import json

from django.test import TestCase
from django.urls import reverse
from ..models import User
from unittest.mock import patch, MagicMock

from cs_app.models import PastParameter


class GenerateReportViewTests(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="testpass")
        self.client.login(username="testuser", password="testpass")

        # Create some PastParameter entriese
        for i in range(30):
            PastParameter.objects.create(
                text_field=f"Sample text {i}",
                date_field=f"2024-09-25",
                parameters_json={"key": f"value {i}"},
            )

    def test_directions_view_authenticated(self):
        response = self.client.get(reverse("generate_report"))

        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "generate_report.html")
        self.assertEqual(response.context["user"], self.user)
        self.assertIn("data", response.context)

        self.assertEqual(len(response.context["data"]), 25)
        self.assertEqual(response.context["data"][0].text_field, "Sample text 24")

    def test_directions_view_unauthenticated(self):
        self.client.logout()

        response = self.client.post(reverse("generate_report"))

        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, f'/login/?next={reverse("generate_report")}')
