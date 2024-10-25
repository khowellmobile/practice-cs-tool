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

Dependencies:
- Django modules: render, JsonResponse, settings, connections, ImproperlyConfigured
- External modules: pyodbc (for database connectivity)
"""

from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.conf import settings
from django.db import connections
from django.http import JsonResponse
from django.core.exceptions import ImproperlyConfigured

import cs_app.utils.common_functions as cf
import json
import pyodbc



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
    data_db = settings.DATABASES["data"]

    db_info = {
        "db_engine": data_db["ENGINE"],
        "db_name": data_db["NAME"],
        "db_host": data_db["HOST"],
    }

    context = {
        "user": user,
        "db_info": db_info,
    }

    return render(request, "change_database.html", context)



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

    db_alias = request.GET.get("db_alias")

    if db_alias:
        data_db = settings.DATABASES.get(db_alias)
        if data_db:
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
        trust_conn = "no" if db_user and db_pass else "yes"

        # Validates engine, name, host, and driver.
        if not cf.validate_db_engine(db_engine):
            return JsonResponse({"success": False, "error": "Engine name invalid. Only postgresql, mysql, sqlite, oracle, mssql supported"}, status=400)
        if not cf.validate_db_name(db_name):
            return JsonResponse({"success": False, "error": "Database name invalid. Alphanumerics only"}, status=400)
        if not cf.validate_db_host(db_host):
            return JsonResponse({"success": False, "error": "Database host invalid"}, status=400)
        if not cf.validate_db_driver(db_driver):
            return JsonResponse({"success": False, "error": "Database driver invalid. Alphanumerics only"}, status=400)

        new_database_config = {
            "ENGINE": db_engine,
            "NAME": db_name,
            "HOST": db_host,
            "OPTIONS": {
                "driver": db_driver,
                "trusted_connection": trust_conn,
            },
            "ATOMIC_REQUESTS": True,
            "AUTOCOMMIT": True,
            "CONN_MAX_AGE": 0,
            "CONN_HEALTH_CHECKS": False,
            "TIME_ZONE": None,
            "USER": (db_user if db_user else None),
            "PASSWORD": db_pass if db_pass else None,
            "PORT": "",
            "TEST": {
                "CHARSET": None,
                "COLLATION": None,
                "MIGRATE": True,
                "MIRROR": None,
                "NAME": None,
            },
        }

        if db_name in settings.DATABASES:
            alias = generate_unique_alias(db_name)
        else:
            alias = db_name

        try:

            settings.DATABASES[alias] = new_database_config

            return JsonResponse({"success": True, "db_alias": alias})

        # Wrong engine error
        # Only remove config required
        except ImproperlyConfigured as e:
            remove_config(alias)
            return JsonResponse({"success": False, "error": str(e)}, status=400)

        # Wrong driver error
        # DB Driver error requires that both the conn and config be removed in this order!
        except pyodbc.InterfaceError as e:
            remove_conn(alias)
            remove_config(alias)
            return JsonResponse({"success": False, "error": str(e)}, status=400)

        # No Matching DB Name, DB Host
        except Exception as e:
            remove_conn(alias)
            remove_config(alias)
            return JsonResponse({"success": False, "error": str(e)}, status=400)

    return JsonResponse(
        {"success": False, "error": "Invalid request method"}, status=405
    )


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