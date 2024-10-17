from django.contrib.auth.models import AbstractUser
from django.db import models
import json

class PastParameter(models.Model):
    text_field = models.TextField()
    date_field = models.DateField()
    parameters_json = models.JSONField()

class User(AbstractUser):
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    company = models.CharField(max_length=100, blank=True, null=True)