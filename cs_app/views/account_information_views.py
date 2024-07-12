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

"""

from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.shortcuts import render


@login_required
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


@login_required
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
        email = request.POST.get("email")

        user = request.user

        user.email = email
        user.username = email
        user.save()

        return JsonResponse({"message": "Data received successfully"})

    return JsonResponse({"error": "Invalid request method"}, status=400)


@login_required
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
        password = request.POST.get("password")

        user = request.user

        user.set_password(password)
        user.save()

        return JsonResponse({"message": "Data received successfully"})

    return JsonResponse({"error": "Invalid request method"}, status=400)
