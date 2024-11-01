from django.contrib.auth.decorators import login_required
from django.shortcuts import render

@login_required
def report_history_view(request):
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
    user = request.user
    context = {
        "user": user,
        "additionalInfo": request.GET.get("additionalInfo", None),
    }

    return render(request, "subpages/report_history.html", context)