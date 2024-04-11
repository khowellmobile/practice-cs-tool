from django.http import HttpResponse
from django.template import loader

from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import authenticate, login
from django.shortcuts import render, redirect

def main(request):
    template = loader.get_template('index.html')
    return HttpResponse(template.render())

@login_required
def success(request):
    template = loader.get_template('success.html')
    return HttpResponse(template.render())

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
                return redirect('/success/')
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
