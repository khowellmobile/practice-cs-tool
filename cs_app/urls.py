from django.urls import path
from . import views

urlpatterns = [

    # Initial landing page
    path('', views.main_view, name='main'),

    # Authorization
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('create_account/', views.create_account_view, name='create_account'),

    # Home screen
    path('home/', views.home_view, name='home'),

    # Generate report and functions
    path('generate_report/', views.generate_report_view, name='generate_report'),
    path('load_table/', views.load_table_view, name='load_table'),

    # Directions page
    path('directions/', views.directions_view, name='directions'),

    # Change database page and functions
    path('change_database/', views.change_database_view, name='change_database'),
    path('switch_config/', views.switch_database_view, name='switch_database'),
    path('get_db_info/', views.get_db_info_view, name='get_db_info'),

    # Change account page and functions
    path('change_account/', views.change_account_view, name='change_account'),
    path('change_account/update_name/', views.update_name_view, name='update_name'),
    path('change_account/update_email/', views.update_email_view, name='update_name'),
    path('change_account/update_password/', views.update_password_view, name='update_name'),

    #tinker
    path('tinker/', views.tinker_view, name='tinker'),
]