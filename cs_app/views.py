from django.http import HttpResponse
from django.template import loader

from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import authenticate, login
from django.shortcuts import render, redirect
from django.http import HttpResponseRedirect
from django.contrib.auth.models import User
from django.contrib import messages

def main(request):
    template = loader.get_template('index.html')
    return HttpResponse(template.render())

def create_account(request):
    if request.method == 'POST':
        first_name = request.POST.get('firstName')
        last_name = request.POST.get('lastName')
        username = request.POST.get('username')
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirmPassword')

        # Check if passwords match
        if password != confirm_password:
            error_message = 'Passwords do not match'
            return render(request, 'create_account.html', {'error_message': error_message})

        # Check if username already exists
        elif User.objects.filter(username=username).exists():
            error_message = 'Username already exists'
            return render(request, 'create_account.html', {'error_message': error_message})

        else:
            user = User.objects.create_user(username=username, password=password)
            user.first_name = first_name
            user.last_name = last_name
            user.save()
            return redirect('/login/')


    return render(request, 'create_account.html', {'error_message': None})


def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                # Redirect to a success page after login
                return redirect('/home/')
            else:
                # Invalid login credentials
                error_message = "Invalid username or password."
        else:
            # Form is not valid
            error_message = "Invalid form data. Please check the input fields."
    else:
        form = AuthenticationForm()
        error_message = None
    return render(request, 'login.html', {'form': form, 'error_message': error_message})

@login_required
def home(request):
    template = loader.get_template('home.html')
    return HttpResponse(template.render())