from django.contrib import admin
from .models import PastParameter
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(PastParameter)
class PastParametersAdmin(admin.ModelAdmin):
    list_display = ["text_field", "date_field", "display_parameters"]
    # You can customize other attributes and methods here as needed

    def display_parameters(self, obj):
        return obj.parameters_json

    display_parameters.short_description = "Parameters"

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
