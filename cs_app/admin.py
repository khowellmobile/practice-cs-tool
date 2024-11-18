from django.contrib import admin
from .models import User, DatabaseConnection, RanReportParameter
from django.contrib.auth.admin import UserAdmin

class UserAdminCustom(UserAdmin):
    model = User
    list_display = ('username', 'email', 'first_name', 'last_name', 'phone_number', 'company', 'active_database_alias', 'is_active', 'is_staff')
    
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('phone_number', 'company', "active_database_alias")}),
    )

admin.site.register(User, UserAdminCustom)

@admin.register(DatabaseConnection)
class DatabaseConnectionsAdmin(admin.ModelAdmin):
    list_display = ["user", "engine", "name", "host", "driver", "port"]

@admin.register(RanReportParameter)
class RanReportParametersAdmin(admin.ModelAdmin):
    list_display = ["user", "report_type", "ran_on_date", "start_date", "end_date"]