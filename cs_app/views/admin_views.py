from django.http import HttpResponse
from django.template import loader

from django.contrib.auth.decorators import login_required
from django.shortcuts import render


def main_view(request):
    template = loader.get_template("index.html")
    return HttpResponse(template.render())


@login_required
def home_view(request):
    user = request.user
    context = {
        "user": user,
    }

    return render(request, "home.html", context)


@login_required
def tinker_view(request):
    user = request.user
    context = {
        "user": user,
    }

    return render(request, "tinker.html", context)
