from django.urls import path
from .views import *

urlpatterns = [

    # Initial, home screen, and tinker. Admin views
    path('', admin_views.main_view, name='main'),
    path('tinker/', admin_views.tinker_view, name='tinker'),
    path('home/', admin_views.home_page_view, name='home'),

    # Authorization
    path('login/', authorization_views.login_view, name='login'),
    path('logout/', authorization_views.logout_view, name='logout'),
    path('create_account/', authorization_views.create_account_view, name='create_account'),

    # Generate report and functions
    path('generate_report/', generate_report_views.generate_report_view, name='generate_report'),
    path('load_table/', generate_report_views.load_table_view, name='load_table'),

    # Report history and functions
    path('report_history/', report_history_views.report_history_view, name='report_history'),

    # Directions page
    path('directions/', directions_views.directions_view, name='directions'),

    # Change database page and functions
    path('change_database/', change_database_views.change_database_view, name='change_database'),
    path('switch_config/', change_database_views.switch_database_view, name='switch_database'),
    
    # Change account page and functions
    path('account_information/', account_information_views.account_information_view, name='account_information'),
    path('account_information/update_name/', account_information_views.update_name_view, name='update_name'),
    path('account_information/update_email/', account_information_views.update_email_view, name='update_email'),
    path('account_information/update_phone/', account_information_views.update_phone_number_view, name='update_phone'),
    path('account_information/update_company/', account_information_views.update_company_view, name='update_company'),
    path('account_information/update_password/', account_information_views.update_password_view, name='update_password'),


]