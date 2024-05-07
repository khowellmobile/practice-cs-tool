from django.contrib import admin
from .models import PastParameter

@admin.register(PastParameter)
class PastParametersAdmin(admin.ModelAdmin):
    list_display = ['text_field', 'date_field', 'display_parameters']
    # You can customize other attributes and methods here as needed

    def display_parameters(self, obj):
        return obj.parameters_json
    display_parameters.short_description = 'Parameters'
