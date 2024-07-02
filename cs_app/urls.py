from django.urls import path
from .views import *

urlpatterns = [

    # Initial and home screen
    path('', admin_views.main_view, name='main'),
    path('home/', admin_views.home_view, name='home'),

    # Authorization
    path('login/', authorization_views.login_view, name='login'),
    path('logout/', authorization_views.logout_view, name='logout'),
    path('create_account/', authorization_views.create_account_view, name='create_account'),

    # Generate report and functions
    path('generate_report/', admin_views.generate_report_view, name='generate_report'),
    path('load_table/', admin_views.load_table_view, name='load_table'),

    # Directions page
    path('directions/', admin_views.directions_view, name='directions'),

    # Change database page and functions
    path('change_database/', admin_views.change_database_view, name='change_database'),
    path('switch_config/', admin_views.switch_database_view, name='switch_database'),
    path('get_db_info/', admin_views.get_db_info_view, name='get_db_info'),

    # Change account page and functions
    path('account_information/', admin_views.account_information_view, name='change_account'),
    path('account_information/update_name/', admin_views.update_name_view, name='update_name'),
    path('account_information/update_email/', admin_views.update_email_view, name='update_name'),
    path('account_information/update_password/', admin_views.update_password_view, name='update_name'),

    #tinker
    path('tinker/', admin_views.tinker_view, name='tinker'),
]