"""
Django views for main, home, and tinker pages and related functionalities.

This module contains Django view functions for rendering main page, home page, and
tinker page. The views for home and tinker pages require user authentication using
the @login_required decorator to ensure access only to authenticated users.

Functions:
- main_view(request): Renders the main page using 'index.html' template.
- home_view(request): Renders the home page with user information if authenticated.
- tinker_view(request): Renders the tinker page with user information if authenticated.

Dependencies:
- Django modules: HttpResponse, loader
- Django shortcuts: render
- Django authentication: login_required
"""

from django.http import HttpResponse
from django.template import loader
from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.conf import settings

from ..models import RanReportParameter, User
import json


def main_view(request):
    """
    View function to render the main page.

    Args:
        request (HttpRequest): The HTTP request object.

    Returns:
        HttpResponse: Renders the 'index.html' template.
    """
    
    template = loader.get_template("index.html")
    return HttpResponse(template.render())


@login_required
def home_view(request):
    """
    View function to render the home page for authenticated users.

    Requires the user to be logged in to access the view.

    Args:
        request (HttpRequest): The HTTP request object.

    Returns:
        HttpResponse: Renders the 'home.html' template with user context.
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

    return render(request, "home.html", context)


@login_required
def tinker_view(request):
    """
    View function to render the tinker page for authenticated users.

    Args:
        request (HttpRequest): The HTTP request object.

    Returns:
        HttpResponse: Renders the 'tinker.html' template with user context.
    """

    user = request.user
    context = {
        "user": user,
    }

    return render(request, "tinker.html", context)

@login_required
def one_page_view(request):
    additional_info = request.GET.get("additionalInfo", None)
    menu_status = None

    if additional_info:
        try:
            decoded_info = json.loads(additional_info)
            menu_status = decoded_info.get("menu_status")
        except (ValueError, TypeError):
            menu_status = None

    user = request.user

    context = {
        "user": user,
        "menu_status": menu_status,
    }

    return render(request, "one_page.html", context)

@login_required
def home_page_sub_view(request):
    past_reports = RanReportParameter.objects.filter(user=request.user)
    additional_info = request.GET.get("additionalInfo", None)
    menu_status = None

    data_db = settings.DATABASES["data"]
    db_info = {
        "db_engine": data_db["ENGINE"],
        "db_name": data_db["NAME"],
        "db_host": data_db["HOST"],
    }

    if additional_info:
        try:
            decoded_info = json.loads(additional_info)
            menu_status = decoded_info.get("menu_status")
        except (ValueError, TypeError):
            menu_status = None

    user = request.user

    context = {
        "user": user,
        "menu_status": menu_status,
        "past_reports": past_reports,
        "db_info": db_info,
    }

    return render(request, "subpages/home.html", context)

