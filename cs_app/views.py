from django.http import HttpResponse, JsonResponse
from django.template import loader

from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect
from django.contrib.auth.models import User


def main_view(request):
    template = loader.get_template("index.html")
    return HttpResponse(template.render())


def create_account_view(request):
    if request.method == "POST":
        # Get fields
        first_name = request.POST.get("firstName")
        last_name = request.POST.get("lastName")
        username = request.POST.get("username")
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
        elif User.objects.filter(username=username).exists():
            error_message = "Username already exists"
            return render(
                request,
                "create_account.html",
                {"error_message": error_message, "request": request},
            )

        else:
            # Create new user and save into database
            user = User.objects.create_user(username=username, password=password)
            user.first_name = first_name
            user.last_name = last_name
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
    template = loader.get_template("home.html")
    return HttpResponse(template.render())


@login_required
def generate_report_view(request):
    template = loader.get_template("generate_report.html")
    return HttpResponse(template.render())


@login_required
def directions_view(request):
    template = loader.get_template("directions.html")
    return HttpResponse(template.render())


@login_required
def change_database_view(request):
    template = loader.get_template("change_database.html")
    return HttpResponse(template.render())


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
