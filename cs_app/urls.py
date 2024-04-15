from django.urls import path
from . import views

urlpatterns = [
    path('', views.main_view, name='main'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('create_account/', views.create_account_view, name='create_account'),
    path('home/', views.home_view, name='home'),
    path('generate_report/', views.generate_report_view, name='generate_report'),
    path('directions/', views.directions_view, name='directions'),
    path('change_database/', views.change_database_view, name='change_database'),
    path('change_account/', views.change_account_view, name='change_account'),
]