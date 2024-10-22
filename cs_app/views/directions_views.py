"""
Django views for directions page and related functionalities.

This module contains Django view functions specifically for displaying directions
related to user navigation or guidance. The views ensure that only authenticated
users can access them by using the @login_required decorator. 

Functions:
- directions_view(request): Renders the 'directions.html' template with user context.

Dependencies:
- Django modules: render
- Decorators: login_required
"""

from django.contrib.auth.decorators import login_required
from django.shortcuts import render


@login_required
def directions_view(request):
    """
    View function to render the directions page.

    Requires the user to be logged in to access the view.

    Retrieves the current user information from the request object and prepares
    the context to pass to the 'directions.html' template. Renders the template
    with the user context.

    Args:
        request (HttpRequest): The HTTP request object.

    Returns:
        HttpResponse: Rendered template with user context.
    """

    print(request.GET.get("additionalInfo", None))
    user = request.user
    context = {
        "user": user,
        "additionalInfo": request.GET.get("additionalInfo", None),
    }

    return render(request, "directions.html", context)

@login_required
def directions_sub_view(request):
    """
    View function to render the directions page.

    Requires the user to be logged in to access the view.

    Retrieves the current user information from the request object and prepares
    the context to pass to the 'directions.html' template. Renders the template
    with the user context.

    Args:
        request (HttpRequest): The HTTP request object.

    Returns:
        HttpResponse: Rendered template with user context.
    """

    print(request.GET.get("additionalInfo", None))
    user = request.user
    context = {
        "user": user,
        "additionalInfo": request.GET.get("additionalInfo", None),
    }

    return render(request, "subpages/directions.html", context)
