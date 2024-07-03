from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import render
from django.db import connections

from datetime import datetime

from ..models import PastParameter


@login_required
def generate_report_view(request):
    data = PastParameter.objects.order_by("-date_field")[:25]
    user = request.user
    context = {
        "user": user,
        "data": data,
    }

    return render(request, "generate_report.html", context)


@login_required
def load_table_view(request):
    if request.method == "POST":
        start_date = request.POST.get("start_date")
        end_date = request.POST.get("end_date")
        current_date = datetime.now().date()
        time_range = request.POST.get("time_range")

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
