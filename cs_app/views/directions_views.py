from django.contrib.auth.decorators import login_required
from django.shortcuts import render


@login_required
def directions_view(request):
    user = request.user
    context = {
        "user": user,
    }

    return render(request, "directions.html", context)
