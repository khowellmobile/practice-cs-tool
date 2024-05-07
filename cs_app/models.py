from django.db import models
import json

class PastParameter(models.Model):
    text_field = models.TextField()
    date_field = models.DateField()
    parameters_json = models.JSONField()
