from django.urls import path
from . import views

urlpatterns = [
    path('', views.main_view, name='main'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('create_account/', views.create_account_view, name='create_account'),
    path('home/', views.home_view, name='home'),
]