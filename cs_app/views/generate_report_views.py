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

from datetime import datetime

from ..models import PastParameter

import json


@login_required
def generate_report_view(request):
    """
    View function to generate the generate report page

    Requires the user to be logged in to access the view.

    Retrieves the latest 25 entries from PastParameter ordered by date_field,
    prepares the data along with the current user's information, and renders
    the 'generate_report.html' template with the context.

    Args:
        request (HttpRequest): The HTTP request object.

    Returns:
        HttpResponse: Rendered template with user and data context.
    """
    data = list(PastParameter.objects.order_by("-date_field")[:25])[::-1]
    user = request.user
    context = {
        "user": user,
        "data": data,
    }

    return render(request, "generate_report.html", context)


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

        PastParameter.objects.create(
            text_field=time_range,
            date_field=current_date,
            parameters_json={
                "start_date": start_date,
                "end_date": end_date,
            },
        )

        excess_record_count = PastParameter.objects.count() - 25
        if excess_record_count > 0:
            excess_records = PastParameter.objects.order_by("date_field")[
                :excess_record_count
            ]
            excess_record_ids = excess_records.values_list("id", flat=True)
            PastParameter.objects.filter(id__in=excess_record_ids).delete()

        conn = connections["data"]

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
