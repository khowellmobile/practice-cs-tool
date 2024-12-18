"""
Django views for generate report page and related functionalities.

This module contains Django view functions related to rendering the generate report page
and loading data into tables. These views require users to be logged in, enforced by the 
@login_required decorator. The functions handle HTTP requests to render HTML templates 
and respond with JSON data for AJAX requests.

Functions:
- generate_report_view(request): Renders the 'generate_report.html' template with the
  latest 25 entries from PastParameter and the current user's information.
  
- load_table_view(request): Processes AJAX POST requests containing start_date, end_date,
  and time_range parameters. Logs parameters in PastParameter, executes a SQL query to
  calculate department-wise total hours, and returns JSON response with the data.

Dependencies:
- Django modules: render, JsonResponse, connections
- Python modules: datetime
- Model: PastParameter from the application's models

"""

from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import render
from django.db import connections
from django.conf import settings

from datetime import datetime

from ..models import RanReportParameter

import json


@login_required
def generate_report_view(request):
    """
    View function to generate the generate report page

    Requires the user to be logged in to access the view.

    Prepares the data along with the current user's information, and renders
    the 'generate_report.html' template with the context.

    Args:
        request (HttpRequest): The HTTP request object.

    Returns:
        HttpResponse: Rendered template with user and data context.
    """

    user = request.user

    menu_status = None
    start_date = None
    end_date = None
    report_type = None
    history_database_name = None

    additional_info = request.GET.get("additionalInfo", None)

    if additional_info:
        try:
            decoded_info = json.loads(additional_info)
            menu_status = decoded_info.get("menu_status", None)
            start_date = format_date(decoded_info.get("start_date", None))
            end_date = format_date(decoded_info.get("end_date", None))
            report_type = decoded_info.get("report_type", None)
            history_database_name = decoded_info.get("database_name", None)
        except (ValueError, TypeError) as e:
            print(f"Error decoding additional_info: {e}")

    context = {
        "user": user,
        "menu_status": menu_status,
        "start_date": start_date,
        "end_date": end_date,
        "report_type": report_type,
        "history_database_name": history_database_name,
        "current_database_name": request.user.active_database_alias,
    }

    return render(request, "subpages/generate_report.html", context)


@login_required
def load_table_view(request):
    """
    View function to handle AJAX POST requests for loading data into a table.

    Requires the user to be logged in to access the view.

    Processes POST requests containing parameters like start_date, end_date, and time_range.
    Stores relevant parameters in the PastParameter model for logging purposes.
    Executes a SQL query to retrieve department-wise total hours based on given date filters.
    Returns JSON response with department names and corresponding total hours.

    Args:
        request (HttpRequest): The HTTP request object containing POST data.

    Returns:
        JsonResponse: JSON response with data if successful, or error message if request method is not POST.
    """
    if request.method == "POST":
        data = json.loads(request.body.decode("utf-8"))
        start_date = data.get("start_date")
        end_date = data.get("end_date")
        time_range = data.get("time_range")
        current_date = datetime.now().date()
        active_database_alias = request.user.active_database_alias

        # Check to ensure an active database is being used
        if not any(active_database_alias in key for key in settings.DATABASES):
            return JsonResponse({"error": "No connections with database name active"}, status=400) 

        existing_report = RanReportParameter.objects.filter(
            user=request.user,
            report_type=time_range,
            start_date=start_date,
            end_date=end_date,
        ).exists()

        if not existing_report:
            RanReportParameter.objects.create(
                user=request.user,
                report_type=time_range,
                ran_on_date=current_date,
                start_date=start_date,
                end_date=end_date,
                database_name=active_database_alias.split("_")[0] if active_database_alias else "unrecognized name format",
            )

        conn = connections[active_database_alias]

        cursor = conn.cursor()

        where_clause = ""

        if start_date and end_date:
            where_clause = f"WHERE StartDate BETWEEN '{start_date}' AND '{end_date}'"

        query = f"""SELECT Department.Name, COUNT(Department.Name) * 8.0 AS 'TotalHours'
                   FROM HumanResources.EmployeeDepartmentHistory
                   JOIN HumanResources.Department ON EmployeeDepartmentHistory.DepartmentID = Department.DepartmentID
                   JOIN HumanResources.Shift ON EmployeeDepartmentHistory.ShiftID = Shift.ShiftID
                   {where_clause}
                   GROUP BY Department.Name;
                   """

        cursor.execute(query)

        rows = cursor.fetchall()

        # Prepare data for JsonResponse
        data = []
        for row in rows:
            department_name, total_hours = row
            data.append(
                {"department_name": department_name, "total_hours": total_hours}
            )

        # Return JsonResponse with data
        return JsonResponse({"data": data})

    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)


def format_date(date_str):
    """Convert a date string to the format YYYY-MM-DD."""

    if date_str:
        try:
            # Parse the date string to a datetime object
            date_obj = datetime.strptime(date_str, "%b. %d, %Y")

            # Return the date in the format YYYY-MM-DD
            return date_obj.strftime("%Y-%m-%d")
        except ValueError:
            return None
    else:
        return None
