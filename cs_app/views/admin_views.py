from django.http import HttpResponse, JsonResponse
from django.template import loader

from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.conf import settings

from django.db import connections

import pyodbc

from django.core.exceptions import ImproperlyConfigured

from ..models import PastParameter

from datetime import datetime


def main_view(request):
    template = loader.get_template("index.html")
    return HttpResponse(template.render())


@login_required
def home_view(request):
    user = request.user
    context = {
        "user": user,
    }

    return render(request, "home.html", context)


@login_required
def directions_view(request):
    user = request.user
    context = {
        "user": user,
    }

    return render(request, "directions.html", context)

@login_required
def tinker_view(request):
    user = request.user
    context = {
        "user": user,
    }

    return render(request, "tinker.html", context)


@login_required
def change_database_view(request):
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


@login_required
def get_db_info_view(request):
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


@login_required
def switch_database_view(request):
    if request.method == "POST":
        db_engine = request.POST.get("db_engine")
        db_name = request.POST.get("db_name")
        db_host = request.POST.get("db_host")
        db_driver = request.POST.get("db_driver")
        db_user = request.POST.get("db_user")
        db_pass = request.POST.get("db_pass")
        trust_conn = "no" if db_user and db_pass else "yes"

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

            query = """SELECT * FROM HumanResources.EmployeeDepartmentHistory"""

            conn = connections[alias]

            conn.connect()

            cursor = conn.cursor()

            cursor.execute(query)

            rows = cursor.fetchall()

            if rows:
                print("TRUE")
            else:
                print("FALSE")

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
    if alias in settings.DATABASES:
        del settings.DATABASES[alias]


def remove_conn(alias):

    connections.close_all()

    for conn in connections.all():
        if conn.alias == alias:
            connections.__delitem__(alias)


def generate_unique_alias(base_alias):
    index = 1
    unique_alias = base_alias

    while unique_alias in settings.DATABASES:
        unique_alias = f"{base_alias}_{index}"
        index += 1

    return unique_alias


@login_required
def account_information_view(request):
    user = request.user
    context = {
        "user": user,
    }

    return render(request, "account_information.html", context)


@login_required
def update_name_view(request):
    if request.method == "POST":
        first_name = request.POST.get("first_name")
        last_name = request.POST.get("last_name")

        user = request.user

        # Process the data as needed
        user.first_name = first_name
        user.last_name = last_name
        user.save()

        # Return a JSON response
        return JsonResponse({"message": "Data received successfully"})

    # Return an error response if the request method is not POST
    return JsonResponse({"error": "Invalid request method"}, status=400)


@login_required
def update_email_view(request):
    if request.method == "POST":
        email = request.POST.get("email")

        user = request.user

        user.email = email
        user.username = email
        user.save()

        return JsonResponse({"message": "Data received successfully"})

    return JsonResponse({"error": "Invalid request method"}, status=400)


@login_required
def update_password_view(request):
    if request.method == "POST":
        password = request.POST.get("password")

        user = request.user

        user.set_password(password)
        user.save()

        return JsonResponse({"message": "Data received successfully"})

    return JsonResponse({"error": "Invalid request method"}, status=400)