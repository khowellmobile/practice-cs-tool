from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from unittest.mock import patch
from ..models import RanReportParameter
import json


class MainViewtests(TestCase):

    def test_main_view(self):
        response = self.client.get(reverse("main"))

        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "index.html")

class HomeViewTests(TestCase):

    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create_user(username="testuser", password="testpass")
        self.client.login(username="testuser", password="testpass")

        self.past_report_1 = RanReportParameter.objects.create(
            user=self.user,
            report_type="Custom",
            ran_on_date="2024-01-01",
            start_date="2023-12-01",
            end_date="2023-12-31"
        )
        self.past_report_2 = RanReportParameter.objects.create(
            user=self.user,
            report_type="All Time",
            ran_on_date="2024-12-31",
            start_date="2024-01-01",
            end_date="2024-12-31"
        )

    def test_home_view_authenticated(self):
        response = self.client.get(reverse("home"))

        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "subpages/home.html")

        self.assertEqual(response.context["user"], self.user)

        past_reports = response.context["past_reports"]
        
        self.assertEqual(past_reports[0].report_type, "Custom")
        self.assertEqual(str(past_reports[0].ran_on_date), "2024-01-01")
        self.assertEqual(str(past_reports[0].start_date), "2023-12-01")
        self.assertEqual(str(past_reports[0].end_date), "2023-12-31")

        self.assertEqual(past_reports[1].report_type, "All Time")
        self.assertEqual(str(past_reports[1].ran_on_date), "2024-12-31")
        self.assertEqual(str(past_reports[1].start_date), "2024-01-01")
        self.assertEqual(str(past_reports[1].end_date), "2024-12-31")

    def test_account_information_view_unauthenticated(self):
        self.client.logout()

        response = self.client.get(reverse("home"))

        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, f'/login/?next={reverse("home")}')

    def test_home_view_with_additional_info(self):
        additional_info = json.dumps({"menu_status": "menu_open"})
        response = self.client.get(reverse("home") + f"?additionalInfo={additional_info}")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.context["menu_status"], "menu_open")

    def test_home_view_with_invalid_additional_info(self):
        invalid_additional_info = "invalid_json"
        response = self.client.get(reverse("home") + f"?additionalInfo={invalid_additional_info}")

        self.assertEqual(response.status_code, 200)
        self.assertIsNone(response.context["menu_status"])

    @patch('django.conf.settings.DATABASES', {
        "data": {
            "ENGINE": "mssql",
            "NAME": "mydatabase",
            "HOST": "localhost"
        }
    })
    def test_home_view_with_mock_db_info(self):
        response = self.client.get(reverse("home"))
        db_info = response.context["db_info"]

        self.assertEqual(db_info["db_engine"], "mssql")
        self.assertEqual(db_info["db_name"], "mydatabase")
        self.assertEqual(db_info["db_host"], "localhost")

