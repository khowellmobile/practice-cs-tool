"""
Django views for user authentication and realted functionalities.

This module contains Django view functions for handling user account creation,
authentication, login, and logout functionalities. It includes views to create
a new user account, authenticate users during login, and manage user sessions
such as logout.

Functions:
- create_account_view(request): Handles POST requests for account creation 
    and account creation page render.
- login_view(request): Handles login page render and user authentication.
- logout_view(request): Handles user logout and redirects to the login page.

Dependencies:
- Django modules: render, redirect
- Django authentication: User, AuthenticationForm, authenticate, login, logout
- Decorators: login_required
- Utils: common_functions
"""

from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import authenticate, login, logout

import cs_app.utils.common_functions as cf


def create_account_view(request):
    """
    View function to handle POST requests for creating a new user account 
    and rendering create account page.

    Processes POST requests containing user registration form data (first name, last name,
    email, password, confirm password). Validates form data, checks for existing email,
    creates a new user account if validations pass, and redirects to the login page upon
    successful account creation.

    Args:
        request (HttpRequest): The HTTP request object containing POST data.

    Returns:
        HttpResponse: Renders 'create_account.html' with error message if validations fail,
                      or redirects to '/login/' upon successful account creation.
    """

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
    """
    View function to handle both user authentication and login page render.

    Processes both GET requests to render the login form and POST requests to authenticate
    users based on provided username (email) and password. Redirects to '/home/' upon successful
    authentication or renders 'login.html' with error messages for invalid credentials or form data.

    Args:
        request (HttpRequest): The HTTP request object.

    Returns:
        HttpResponse: Renders 'login.html' with login form and error message(s) if applicable,
                      or redirects to '/home/' upon successful login.
    """

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
    """
    View function to handle user logout.

    Args:
        request (HttpRequest): The HTTP request object.

    Returns:
        HttpResponseRedirect: Redirects to the login page.
    """
    logout(request)
    return redirect("login")
