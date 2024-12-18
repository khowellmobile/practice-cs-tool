from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    company = models.CharField(max_length=100, blank=True, null=True)
    active_database_alias = models.CharField(max_length=100, blank=True, null=True)


class DatabaseConnection(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="database_connections"
    )
    engine = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    host = models.CharField(max_length=100)
    driver = models.CharField(max_length=100, null=True, blank=True, default="")
    port = models.CharField(max_length=100, null=True, blank=True, default="")


class RanReportParameter(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="ran_report_parameters"
    )
    report_type = models.TextField()
    ran_on_date = models.DateField()
    start_date = models.DateField()
    end_date = models.DateField()
    database_name = models.CharField(max_length=100, default="")
