"""
Django views for directions page and related functionalities.

This module contains Django view functions to manage user account information
and profile updates. The views require user authentication using the @login_required
decorator to ensure access only to authenticated users. It includes functions to
view account information, update user's name, email, and password.

Functions:
- account_information_view(request): Renders the 'account_information.html' template
  with the current user's information.
- update_name_view(request): Handles POST requests to update the user's first name
  and last name.
- update_email_view(request): Handles POST requests to update the user's email address
  and username.
- update_password_view(request): Handles POST requests to update the user's password.

Dependencies:
- Django modules: JsonResponse
- Django authentication: login_required
- Django shortcuts: render
- Utils: common_functions

"""

from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.contrib.auth import authenticate
from django.contrib.auth.models import User

import json
import cs_app.utils.common_functions as cf



def account_information_view(request):
    """
    View function to render the account information page.

    Requires the user to be logged in to access the view.

    Args:
        request (HttpRequest): The HTTP request object.

    Returns:
        HttpResponse: Renders the 'account_information.html' template with user context.
    """
    user = request.user
    context = {
        "user": user,
    }

    return render(request, "account_information.html", context)



def update_name_view(request):
    """
    View function to handle POST requests for updating user's first name and last name.

    Requires the user to be logged in to access the view.
    Processes POST requests containing 'first_name' and 'last_name' parameters.
    Updates the current user's first name and last name accordingly.

    Args:
        request (HttpRequest): The HTTP request object containing POST data.

    Returns:
        JsonResponse: Returns a JSON response with a success message upon successful data update,
                      or an error message if the request method is not POST.
    """
    if request.method == "POST":
        data = json.loads(request.body.decode("utf-8"))
        first_name = data.get("first_name")
        last_name = data.get("last_name")

        # Validation for name formats
        if not cf.validate_name(first_name) or not cf.validate_name(last_name):
            return JsonResponse({"error": "Invalid format"}, status=400)

        user = request.user

        # Process the data as needed
        user.first_name = first_name
        user.last_name = last_name
        user.save()

        # Return a JSON response
        return JsonResponse({"message": "Data received successfully"})

    # Return an error response if the request method is not POST
    return JsonResponse({"error": "Invalid request method"}, status=405)



def update_email_view(request):
    """
    View function to handle POST requests for updating user's email address.

    Requires the user to be logged in to access the view.
    Processes POST requests containing 'email' parameter.
    Updates the current user's email address and username.

    Args:
        request (HttpRequest): The HTTP request object containing POST data.

    Returns:
        JsonResponse: Returns a JSON response with a success message upon successful data update,
                      or an error message if the request method is not POST.
    """
    if request.method == "POST":
        data = json.loads(request.body.decode("utf-8"))
        email = data.get("email")

        # Validation for email format
        if not cf.validate_email(email):
            return JsonResponse({"error": "Invalid format"}, status=400)

        user = request.user

        user.email = email
        user.username = email
        user.save()

        return JsonResponse({"message": "Data received successfully"})

    return JsonResponse({"error": "Invalid request method"}, status=405)



def update_password_view(request):
    """
    View function to handle POST requests for updating user's password.

    Requires the user to be logged in to access the view.
    Processes POST requests containing 'password' parameter.
    Updates the current user's password.

    Args:
        request (HttpRequest): The HTTP request object containing POST data.

    Returns:
        JsonResponse: Returns a JSON response with a success message upon successful password update,
                      or an error message if the request method is not POST.
    """
    if request.method == "POST":
        data = json.loads(request.body.decode("utf-8"))
        old_password = data.get("old_password")
        password = data.get("password")

        user = request.user

        # Check if the old password is correct
        if not user.check_password(old_password):
            return JsonResponse({"error": "Old password is incorrect"}, status=400)

        # Validation for password format
        if not cf.validate_password(password):
            return JsonResponse({"error": "Invalid format"}, status=400)

        user.set_password(password)
        user.save()

        return JsonResponse({"message": "Data received successfully"})

    return JsonResponse({"error": "Invalid request method"}, status=405)
