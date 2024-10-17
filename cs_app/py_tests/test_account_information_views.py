import json

from django.test import TestCase
from django.urls import reverse
from ..models import User
from unittest.mock import patch


class AccountInformationViewTests(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="testpass")
        self.client.login(username="testuser", password="testpass")

    def test_account_information_view_authenticated(self):
        response = self.client.get(reverse("change_account"))

        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "account_information.html")
        self.assertEqual(response.context["user"], self.user)

    def test_account_information_view_unauthenticated(self):
        self.client.logout()

        response = self.client.post(reverse("change_account"))

        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, f'/login/?next={reverse("change_account")}')


class UpdateNameViewTests(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="testpass")
        self.client.login(username="testuser", password="testpass")

    @patch("cs_app.utils.common_functions.validate_name", return_value=True)
    def test_update_name_view_success(self, mock_validate_name):
        data = {"first_name": "NewFirstName", "last_name": "NewLastName"}

        response = self.client.post(
            reverse("update_name"),
            data=json.dumps(data),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(
            response.content, {"message": "Data received successfully"}
        )
        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, "NewFirstName")
        self.assertEqual(self.user.last_name, "NewLastName")

    @patch("cs_app.utils.common_functions.validate_name", return_value=False)
    def test_update_name_view_invalid_format(self, mock_validate_name):
        data = {"first_name": "Invalid@Name", "last_name": "Name"}

        response = self.client.post(
            reverse("update_name"),
            data=json.dumps(data),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertJSONEqual(response.content, {"error": "Invalid format"})

    def test_update_name_view_invalid_method(self):
        response = self.client.get(reverse("update_name"))

        self.assertEqual(response.status_code, 405)
        self.assertJSONEqual(response.content, {"error": "Invalid request method"})

    def test_account_information_view_unauthenticated(self):
        self.client.logout()

        response = self.client.post(reverse("update_name"))

        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, f'/login/?next={reverse("update_name")}')


class UpdateEmailViewTests(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="testpass")
        self.client.login(username="testuser", password="testpass")

    @patch("cs_app.utils.common_functions.validate_email", return_value=True)
    def test_update_email_view_success(self, mock_validate_email):
        data = {"email": "newemail@example.com"}

        response = self.client.post(
            reverse("update_email"),
            data=json.dumps(data),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(
            response.content, {"message": "Data received successfully"}
        )
        self.user.refresh_from_db()
        self.assertEqual(self.user.email, "newemail@example.com")
        self.assertEqual(self.user.username, "newemail@example.com")

    @patch("cs_app.utils.common_functions.validate_email", return_value=False)
    def test_update_email_view_invalid_format(self, mock_validate_email):
        data = {"email": "invalid_email"}

        response = self.client.post(
            reverse("update_email"),
            data=json.dumps(data),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertJSONEqual(response.content, {"error": "Invalid format"})

    def test_update_email_view_invalid_method(self):
        response = self.client.get(reverse("update_email"))

        self.assertEqual(response.status_code, 405)
        self.assertJSONEqual(response.content, {"error": "Invalid request method"})

    def test_account_information_view_unauthenticated(self):
        self.client.logout()

        response = self.client.post(reverse("update_email"))

        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, f'/login/?next={reverse("update_email")}')

class UpdatePhoneNumberViewTests(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="testpass")
        self.client.login(username="testuser", password="testpass")

    @patch("cs_app.utils.common_functions.validate_phone_number", return_value=True)
    def test_update_phone_number_view_success(self, mock_validate_phone_number):
        data = {"phone_number": "+1 (555) 123-4567"}

        response = self.client.post(
            reverse("update_phone_number"),
            data=json.dumps(data),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(response.content, {"message": "Data received successfully"})
        self.user.refresh_from_db()
        self.assertEqual(self.user.phone_number, "+1 (555) 123-4567")

    @patch("cs_app.utils.common_functions.validate_phone_number", return_value=False)
    def test_update_phone_number_view_invalid_format(self, mock_validate_phone_number):
        data = {"phone_number": "123"}

        response = self.client.post(
            reverse("update_phone_number"),
            data=json.dumps(data),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertJSONEqual(response.content, {"error": "Invalid format"})

    def test_update_phone_number_view_invalid_method(self):
        response = self.client.get(reverse("update_phone_number"))

        self.assertEqual(response.status_code, 405)
        self.assertJSONEqual(response.content, {"error": "Invalid request method"})

    def test_update_phone_number_view_unauthenticated(self):
        self.client.logout()

        response = self.client.post(reverse("update_phone_number"))

        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, f'/login/?next={reverse("update_phone_number")}')


class UpdateCompanyViewTests(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="testpass")
        self.client.login(username="testuser", password="testpass")

    @patch("cs_app.utils.common_functions.validate_company", return_value=True)
    def test_update_company_view_success(self, mock_validate_company):
        data = {"company": "John's Company, Inc."}

        response = self.client.post(
            reverse("update_company"),
            data=json.dumps(data),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(response.content, {"message": "Data received successfully"})
        self.user.refresh_from_db()
        self.assertEqual(self.user.company, "John's Company, Inc.")

    @patch("cs_app.utils.common_functions.validate_company", return_value=False)
    def test_update_company_view_invalid_format(self, mock_validate_company):
        data = {"company": "Invalid#Company"}

        response = self.client.post(
            reverse("update_company"),
            data=json.dumps(data),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertJSONEqual(response.content, {"error": "Invalid format"})

    def test_update_company_view_invalid_method(self):
        response = self.client.get(reverse("update_company"))

        self.assertEqual(response.status_code, 405)
        self.assertJSONEqual(response.content, {"error": "Invalid request method"})

    def test_update_company_view_unauthenticated(self):
        self.client.logout()

        response = self.client.post(reverse("update_company"))

        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, f'/login/?next={reverse("update_company")}')

class UpdatePasswordViewTests(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="testpass")
        self.client.login(username="testuser", password="testpass")

    @patch("cs_app.utils.common_functions.validate_password", return_value=True)
    def test_update_password_view_success(self, mock_validate_password):
        data = {"old_password": "testpass", "password": "newpassword"}

        response = self.client.post(
            reverse("update_password"),
            data=json.dumps(data),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(
            response.content, {"message": "Data received successfully"}
        )
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password("newpassword"))

    @patch("cs_app.utils.common_functions.validate_password", return_value=False)
    def test_update_password_view_invalid_format(self, mock_validate_password):
        data = {"old_password": "testpass", "password": "short"}

        response = self.client.post(
            reverse("update_password"),
            data=json.dumps(data),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertJSONEqual(response.content, {"error": "Invalid format"})

    def test_update_password_view_old_password_incorrect(self):
        data = {"old_password": "wrongpass", "password": "newpassword"}

        response = self.client.post(
            reverse("update_password"),
            data=json.dumps(data),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertJSONEqual(response.content, {"error": "Old password is incorrect"})

    def test_update_password_view_invalid_method(self):
        response = self.client.get(reverse("update_password"))
        self.assertEqual(response.status_code, 405)
        self.assertJSONEqual(response.content, {"error": "Invalid request method"})

    def test_account_information_view_unauthenticated(self):
        self.client.logout()

        response = self.client.post(reverse("update_password"))

        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, f'/login/?next={reverse("update_password")}')
