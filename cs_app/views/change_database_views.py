"""
Django views for change database page and related functionalities.

This module contains Django view functions related to database management tasks.
These functions are restricted to authenticated users by using the @login_required
decorator. They handle rendering templates, retrieving database information,
switching database configurations, and managing database connections dynamically.

Functions:
- change_database_view(request): Renders 'change_database.html' with current database information.
- get_db_info_view(request): Retrieves database information based on the provided alias via AJAX GET request.
- switch_database_view(request): Handles POST request to switch database configurations dynamically.
- test_database_connection(db_config): Creates connection to ensure proper config.
- save_database_into_history(req_user, db_engine, db_name, db_host, db_driver): Saves database information into history
- remove_config(alias): Removes a config from settings
- remove_conn(alias): Removes a connection from the list of connections
- generate_unique_alias(base_alias): Generates a unique alias to ensure no duplicate aliases

Dependencies:
- Django modules: render, JsonResponse, settings, connections, ImproperlyConfigured
- External modules: pyodbc (for database connectivity)
"""

from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.conf import settings
from django.db import connections
from django.http import JsonResponse

from ..models import DatabaseConnection

import cs_app.utils.common_functions as cf
import json
import pyodbc
import psycopg2


@login_required
def change_database_view(request):
    """
    View function to render the change database page.

    Requires the user to be logged in to access the view.

    Retrieves current database configuration details from Django settings and renders
    the 'change_database.html' template with the user and database information.

    Args:
        request (HttpRequest): The HTTP request object.

    Returns:
        HttpResponse: Rendered template with user and database information context.
    """

    user = request.user

    data_db = None
    if user.active_database_alias in settings.DATABASES:
        data_db = settings.DATABASES[user.active_database_alias]
    else:
        data_db = settings.DATABASES["default"]

    db_info = {
        "db_engine": data_db["ENGINE"],
        "db_name": data_db["NAME"],
        "db_host": data_db["HOST"],
    }

    past_connections = DatabaseConnection.objects.filter(user=request.user)
    menu_status = None
    additional_info = request.GET.get("additionalInfo", None)

    if additional_info:
        try:
            decoded_info = json.loads(additional_info)
            menu_status = decoded_info.get("menu_status")
        except (ValueError, TypeError):
            menu_status = None

    context = {
        "user": user,
        "db_info": db_info,
        "past_connections": past_connections,
        "menu_status": menu_status,
    }

    return render(request, "subpages/change_database.html", context)


@login_required
def get_db_info_view(request):
    """
    View function to retrieve database information based on alias via AJAX GET request.

    Requires the user to be logged in to access the view.

    Retrieves database configuration details from Django settings based on the provided
    alias via GET parameters. Returns a JSON response with database engine, name, and host
    information if the alias is valid; otherwise, returns an error message.

    Args:
        request (HttpRequest): The HTTP request object containing GET parameters.

    Returns:
        JsonResponse: JSON response with database information or error message.
    """

    db_alias = request.user.active_database_alias

    if db_alias:
        if db_alias in settings.DATABASES:
            data_db = settings.DATABASES[db_alias]
            return JsonResponse(
                {
                    "db_engine": data_db.get("ENGINE"),
                    "db_name": data_db.get("NAME"),
                    "db_host": data_db.get("HOST"),
                }
            )
        else:
            return JsonResponse({"Error": "Invalid database alias"}, status=400)
    else:
        return JsonResponse({"Error": "Missing database alias"}, status=400)


@login_required
def switch_database_view(request):
    """
    View function to handle POST request to switch database configuration dynamically.

    Requires the user to be logged in to access the view.

    Processes POST requests containing new database configuration parameters, verifies
    their validity, and attempts to switch the application's database connection to
    the new configuration. Returns a JSON response indicating success or failure along
    with any relevant error messages.

    Args:
        request (HttpRequest): The HTTP request object containing POST data.

    Returns:
        JsonResponse: JSON response indicating success or failure of the database switch operation.
    """

    if request.method == "POST":
        data = json.loads(request.body.decode("utf-8"))
        db_engine = data.get("db_engine")
        db_name = data.get("db_name")
        db_host = data.get("db_host")
        db_driver = data.get("db_driver")
        db_user = data.get("db_user")
        db_pass = data.get("db_pass")

        # Validates engine, name, host, and driver.
        error_response, status_code = validate_db_fields(
            db_engine, db_name, db_host, db_driver
        )

        if error_response:
            return JsonResponse(error_response, status=status_code)

        # Getting database config
        new_database_config = construct_config(
            db_engine, db_name, db_host, db_driver, db_user, db_pass
        )

        # Generating unique alias for connections
        if db_name in settings.DATABASES:
            alias = generate_unique_alias(db_name)
        else:
            alias = db_name

        try:

            connection_error = test_database_connection(new_database_config)

            if connection_error:
                remove_conn(alias)
                remove_config(alias)
                return JsonResponse(
                    {"success": False, "error": connection_error}, status=400
                )

            settings.DATABASES[alias] = new_database_config

            request.user.active_database_alias = alias
            request.user.save()

            save_database_into_history(
                request.user, db_engine, db_name, db_host, db_driver
            )

            return JsonResponse(
                {
                    "success": True,
                    "db_engine": db_engine,
                    "db_name": db_name,
                    "db_host": db_host,
                }
            )

        # Catch general exceptions not caught by "test_database_connection"
        except Exception as e:
            remove_conn(alias)
            remove_config(alias)
            return JsonResponse({"success": False, "error": str(e)}, status=400)

    return JsonResponse(
        {"success": False, "error": "Invalid request method"}, status=405
    )


def test_database_connection(db_config):
    """
    Helper function to test database connection.

    Attempts to establish a connection to the database using the provided
    configuration. Supports both SQL and Windows authentication.

    Args:
        db_config (dict): A dictionary containing database connection parameters,
                          including engine, name, host, user, password, and options.

    Returns:
        str or None: Returns a custom error message if the connection fails,
                     otherwise returns None.
    """
    if "mssql" in db_config["ENGINE"]:
        try:
            if db_config["USER"] and db_config["PASSWORD"]:
                # Use SQL authentication
                conn_str = (
                    f"DRIVER={db_config['OPTIONS']['driver']};"
                    f"SERVER={db_config['HOST']};"
                    f"DATABASE={db_config['NAME']};"
                    f"UID={db_config['USER']};"
                    f"PWD={db_config['PASSWORD']};"
                )
            else:
                # Use Windows authentication
                conn_str = (
                    f"DRIVER={db_config['OPTIONS']['driver']};"
                    f"SERVER={db_config['HOST']};"
                    f"DATABASE={db_config['NAME']};"
                    f"Trusted_Connection=Yes;"
                )

            connection = pyodbc.connect(conn_str)
            connection.close()
            return None
        except pyodbc.Error as e:
            return str(e)
    elif "postgresql" in db_config["ENGINE"]:
        try:
            # Connect to PostgreSQL using psycopg2
            conn = psycopg2.connect(
                dbname=db_config["NAME"],
                user=db_config["USER"],
                password=db_config["PASSWORD"],
                host=db_config["HOST"],
                port=db_config.get("PORT", "5432"),  # Default to 5432 if not specified
            )
            conn.close()
            return None
        except psycopg2.Error as e:
            return str(e)
    else:

        return None


def save_database_into_history(req_user, db_engine, db_name, db_host, db_driver):
    """
    Helper function to save database connection details into history.

    Checks if a database connection with the specified parameters already exists
    for the user. If not, creates a new record to store the connection details.

    Args:
        req_user (User): The user requesting the database connection.
        db_engine (str): The database engine being used.
        db_name (str): The name of the database.
        db_host (str): The host of the database.
        db_driver (str): The driver used to connect to the database.
    """
    existing_connection = DatabaseConnection.objects.filter(
        user=req_user, engine=db_engine, name=db_name, host=db_host, driver=db_driver
    ).first()

    if not existing_connection:
        db_connection = DatabaseConnection(
            user=req_user,
            engine=db_engine,
            name=db_name,
            host=db_host,
            driver=db_driver,
        )
        db_connection.save()


def remove_config(alias):
    """
    Helper function to remove database configuration from Django settings.

    Args:
        alias (str): The alias of the database configuration to be removed.
    """

    if alias in settings.DATABASES:
        del settings.DATABASES[alias]


def remove_conn(alias):
    """
    Helper function to remove database connection.

    Closes all database connections and removes the connection associated
    with the specified alias.

    Args:
        alias (str): The alias of the database connection to be removed.
    """

    connections.close_all()

    for conn in connections.all():
        if conn.alias == alias:
            connections.__delitem__(alias)


def generate_unique_alias(base_alias):
    """
    Helper function to generate a unique database configuration alias.

    Generates a unique alias based on the provided base alias to avoid
    conflicts with existing database configurations in Django settings.

    Args:
        base_alias (str): The base alias to be used for generating a unique alias.

    Returns:
        str: A unique database configuration alias.
    """

    index = 1
    unique_alias = base_alias

    while unique_alias in settings.DATABASES:
        unique_alias = f"{base_alias}_{index}"
        index += 1

    return unique_alias


def validate_db_fields(db_engine, db_name, db_host, db_driver):
    """
    Validates the database parameters (engine, name, host, driver).
    Returns a JsonResponse dictionary if any validation fails.
    """
    if not cf.validate_db_engine(db_engine):
        return {
            "success": False,
            "error": "Engine name invalid.",
        }, 400

    if not cf.validate_db_name(db_name):
        return {
            "success": False,
            "error": "Database name invalid. Alphanumerics only.",
        }, 400

    if not cf.validate_db_host(db_host):
        return {
            "success": False,
            "error": "Database host invalid.",
        }, 400

    if not cf.validate_db_driver(db_driver):
        return {
            "success": False,
            "error": "Database driver invalid. Alphanumerics only.",
        }, 400

    # If all validations pass, return None (indicating success)
    return None, None


def construct_config(db_engine, db_name, db_host, db_driver, db_user, db_pass):
    """
    Returns a dictionary containing a database config based upon
    what engine the user has selected.
    """
    if "mssql" in db_engine:
        trust_conn = "no" if db_user and db_pass else "yes"
        new_database_config = {
            "ENGINE": db_engine,
            "NAME": db_name,
            "HOST": db_host,
            "OPTIONS": {
                "driver": db_driver,
                "trusted_connection": trust_conn,
            },
            "USER": db_user if db_user else None,
            "PASSWORD": db_pass if db_pass else None,
            "PORT": "",
            "ATOMIC_REQUESTS": True,
            "AUTOCOMMIT": True,
            "CONN_MAX_AGE": 0,
            "CONN_HEALTH_CHECKS": False,
            "TIME_ZONE": None,
        }
        return new_database_config
    elif "postgresql" in db_engine:
        new_database_config = {
            "ENGINE": db_engine,
            "NAME": db_name,
            "HOST": db_host,
            "USER": db_user,
            "PASSWORD": db_pass,
            "PORT": "5432",
            "ATOMIC_REQUESTS": True,
            "AUTOCOMMIT": True,
            "CONN_MAX_AGE": 0,
            "CONN_HEALTH_CHECKS": False,
            "TIME_ZONE": None,
            "OPTIONS": {
                "connect_timeout": 10,
            },
        }
        return new_database_config
    else:
        raise ValueError("construct_config: Engine not recognized")
