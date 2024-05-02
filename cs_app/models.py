from django.db import models
import json

class PastParameter(models.Model):
    text_field = models.TextField()
    date_field = models.DateField()
    parameters_json = models.JSONField()

    def set_parameters(self, parameters):
        self.parameters_json = json.dumps(parameters)

    def get_parameters(self):
        return json.loads(self.parameters_json)

    def __str__(self):
        return f"Text: {self.text_field}, Date: {self.date_field}, Parameters: {self.parameters_json}"
