import json

from django.test import TestCase
from django.urls import reverse
from ..models import User

from cs_app.views import format_date


class GenerateReportViewTests(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="testpass")
        self.client.login(username="testuser", password="testpass")

    def test_directions_view_authenticated(self):
        response = self.client.get(reverse("generate_report"))

        self.assertEqual(response.status_code, 200)

        self.assertTemplateUsed(response, "subpages/generate_report.html")

        self.assertEqual(response.context["user"], self.user)

        self.assertIsNone(response.context["menu_status"])
        self.assertIsNone(response.context["start_date"])
        self.assertIsNone(response.context["end_date"])
        self.assertIsNone(response.context["report_type"])

    def test_directions_view_with_additional_info(self):
        additional_info = json.dumps(
            {
                "menu_status": "active",
                "start_date": "Jan. 1, 2000",
                "end_date": "Jan. 2, 2000",
                "report_type": "All Time",
            }
        )

        response = self.client.get(
            reverse("generate_report") + f"?additionalInfo={additional_info}"
        )

        self.assertEqual(response.status_code, 200)

        self.assertTemplateUsed(response, "subpages/generate_report.html")

        self.assertEqual(response.context["menu_status"], "active")
        self.assertEqual(response.context["start_date"], "2000-01-01")
        self.assertEqual(response.context["end_date"], "2000-01-02")
        self.assertEqual(response.context["report_type"], "All Time")

    def test_directions_view_unauthenticated(self):
        self.client.logout()

        response = self.client.post(reverse("generate_report"))

        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, f'/login/?next={reverse("generate_report")}')


class FormatDateTests(TestCase):

    def test_valid_date(self):
        self.assertEqual(format_date("Jan. 1, 2023"), "2023-01-01")
        self.assertEqual(format_date("Feb. 14, 2024"), "2024-02-14")
        self.assertEqual(format_date("Dec. 25, 2021"), "2021-12-25")

    def test_invalid_date(self):
        self.assertIsNone(format_date("Not a date"))
        self.assertIsNone(format_date("2023-01-01"))
        self.assertIsNone(format_date("Apr. 31, 2023"))
        self.assertIsNone(format_date("Mar. 32, 2023"))

    def test_edge_cases(self):
        self.assertIsNone(format_date(""))

        self.assertEqual(format_date("   Jan. 5, 2023   "), None)
