from django.http import HttpResponse, JsonResponse
from django.template import loader

from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect
from django.contrib.auth.models import User

from django.db import connections

from .models import PastParameter

from datetime import datetime


def main_view(request):
    template = loader.get_template("index.html")
    return HttpResponse(template.render())


def create_account_view(request):
    if request.method == "POST":
        # Get fields
        first_name = request.POST.get("firstName")
        last_name = request.POST.get("lastName")
        email = request.POST.get("email")
        password = request.POST.get("password")
        confirm_password = request.POST.get("confirmPassword")

        # Check if passwords match
        if password != confirm_password:
            error_message = "Passwords do not match"
            return render(
                request,
                "create_account.html",
                {"error_message": error_message, "request": request},
            )

        # Check if username already exists
        elif User.objects.filter(username=email).exists():
            error_message = "Email is already being used."
            return render(
                request,
                "create_account.html",
                {"error_message": error_message, "request": request},
            )

        else:
            # Create new user and save into database
            user = User.objects.create_user(username=email, password=password)
            user.first_name = first_name
            user.last_name = last_name
            user.email = email
            user.save()
            return redirect("/login/")

    return render(
        request, "create_account.html", {"error_message": None, "request": request}
    )


def login_view(request):
    if request.method == "POST":
        form = AuthenticationForm(request, request.POST)
        if form.is_valid():
            # Get fields
            username = form.cleaned_data.get("username")
            password = form.cleaned_data.get("password")
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                # Redirect to a success page after login
                return redirect("/home/")
            else:
                # Invalid login credentials
                error_message = "Invalid username or password."
        else:
            # Form is not valid
            error_message = "Invalid form data. Please check the input fields."
    else:
        form = AuthenticationForm()
        error_message = None
    return render(request, "login.html", {"form": form, "error_message": error_message})


@login_required
def logout_view(request):
    logout(request)
    return redirect("login")


@login_required
def home_view(request):
    user = request.user
    context = {
        "user": user,
    }

    return render(request, "home.html", context)


@login_required
def generate_report_view(request):
    data = PastParameter.objects.order_by("-date_field")[:16]
    user = request.user
    context = {
        "user": user,
        "data": data,
    }

    return render(request, "generate_report.html", context)


@login_required
def directions_view(request):
    user = request.user
    context = {
        "user": user,
    }

    return render(request, "directions.html", context)


@login_required
def change_database_view(request):
    user = request.user
    context = {
        "user": user,
    }

    return render(request, "change_database.html", context)


@login_required
def change_account_view(request):
    user = request.user
    context = {
        "user": user,
    }

    return render(request, "change_account.html", context)


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
