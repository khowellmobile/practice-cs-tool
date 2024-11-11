from django.contrib import admin
from .models import User, DatabaseConnection, RanReportParameter
from django.contrib.auth.admin import UserAdmin

class UserAdminCustom(UserAdmin):
    model = User
    list_display = ('username', 'email', 'first_name', 'last_name', 'phone_number', 'company', 'is_active', 'is_staff')
    
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('phone_number', 'company')}),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('phone_number', 'company')}),
    )

admin.site.register(User, UserAdminCustom)

@admin.register(DatabaseConnection)
class DatabaseConnectionsAdmin(admin.ModelAdmin):
    list_display = ["user", "engine", "name", "host", "driver"]

@admin.register(RanReportParameter)
class RanReportParametersAdmin(admin.ModelAdmin):
    list_display = ["user", "report_type", "ran_on_date", "start_date", "end_date"]