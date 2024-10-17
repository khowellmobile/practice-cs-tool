from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
import json

class PastParameter(models.Model):
    text_field = models.TextField()
    date_field = models.DateField()
    parameters_json = models.JSONField()

class CustomUser(AbstractUser):
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    company = models.CharField(max_length=100, blank=True, null=True)

    groups = models.ManyToManyField(
        Group,
        related_name='customuser_groups', 
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='customuser_permissions',  
        blank=True,
    )