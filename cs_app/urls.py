from django.urls import path
from . import views

urlpatterns = [
    path('', views.main, name='main'),
    path('login/', views.login_view, name='login'),
    path('success/', views.success, name='success'),
    path('create_account/', views.create_account, name='create_account'),
    path('home/', views.home, name='home'),
]