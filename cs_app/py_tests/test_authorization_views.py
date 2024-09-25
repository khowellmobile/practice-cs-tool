from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from unittest.mock import patch

class CreateAccountViewTests(TestCase):
    @patch("cs_app.utils.common_functions.validate_name", return_value=True)
    @patch("cs_app.utils.common_functions.validate_email", return_value=True)
    @patch("cs_app.utils.common_functions.validate_password", return_value=True)
    def test_create_account_success(
        self, mock_validate_name, mock_validate_email, mock_validate_password
    ):
        data = {
            "firstName": "John",
            "lastName": "Doe",
            "email": "john.doe@example.com",
            "password": "Password123!",
            "confirmPassword": "Password123!",
        }

        response = self.client.post(reverse("create_account"), data)

        self.assertRedirects(response, "/login/")
        self.assertTrue(User.objects.filter(username="john.doe@example.com").exists())

    @patch("cs_app.utils.common_functions.validate_name", return_value=False)
    def test_create_account_invalid_name(self, mock_validate_name):
        data = {
            "firstName": "John123",
            "lastName": "Doe",
            "email": "john.doe@example.com",
            "password": "Password123!",
            "confirmPassword": "Password123!",
        }

        response = self.client.post(reverse("create_account"), data)

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Name format is invalid.")

    @patch("cs_app.utils.common_functions.validate_email", return_value=False)
    def test_create_account_invalid_email(self, mock_validate_email):
        data = {
            "firstName": "John",
            "lastName": "Doe",
            "email": "invalid-email",
            "password": "Password123!",
            "confirmPassword": "Password123!",
        }

        response = self.client.post(reverse("create_account"), data)

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Email format is invalid.")

    @patch("cs_app.utils.common_functions.validate_password", return_value=False)
    def test_create_account_invalid_password(self, mock_validate_password):
        data = {
            "firstName": "John",
            "lastName": "Doe",
            "email": "john.doe@example.com",
            "password": "short",
            "confirmPassword": "short",
        }

        response = self.client.post(reverse("create_account"), data)

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Password format is invalid.")

    def test_create_account_passwords_do_not_match(self):
        data = {
            "firstName": "John",
            "lastName": "Doe",
            "email": "john.doe@example.com",
            "password": "Password123!",
            "confirmPassword": "DifferentPassword123!",
        }

        response = self.client.post(reverse("create_account"), data)

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Passwords do not match")

    def test_create_account_email_already_exists(self):
        User.objects.create_user(
            username="john.doe@example.com", password="Password123!"
        )

        data = {
            "firstName": "John",
            "lastName": "Doe",
            "email": "john.doe@example.com",
            "password": "Password123!",
            "confirmPassword": "Password123!",
        }

        response = self.client.post(reverse("create_account"), data)

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Email is already being used.")

    def test_create_account_get_request(self):
        # Checks to make sure correct template is loaded
        response = self.client.get(reverse("create_account"))

        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "create_account.html")

class LoginViewTests(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser@example.com",
            password="testpass"
        )

    def test_login_view_get_request(self):
        # Checks to make sure correct template is loaded
        response = self.client.get(reverse("login"))

        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "login.html")

    def test_login_view_post_success(self):
        response = self.client.post(reverse("login"), {
            'username': 'testuser@example.com',
            'password': 'testpass',
        })

        self.assertRedirects(response, "/home/")
        self.assertTrue(response.wsgi_request.user.is_authenticated)

    def test_login_view_post_invalid_credentials(self):
        response = self.client.post(reverse("login"), {
            'username': 'testuser@example.com',
            'password': 'wrongpass',
        })

        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "login.html")
        self.assertIn('error_message', response.context)
        self.assertEqual(response.context['error_message'], "Invalid form data. Please check the input fields.")

    def test_login_view_post_invalid_form_data(self):
        response = self.client.post(reverse("login"), {
            'username': '',
            'password': '',
        })

        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "login.html")
        self.assertIn('error_message', response.context)
        self.assertEqual(response.context['error_message'], "Invalid form data. Please check the input fields.")

class LogoutViewTests(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser@example.com",
            password="testpass"
        )

    def test_logout_view(self):
        self.client.login(username="testuser@example.com", password="testpass")
        response = self.client.get(reverse("logout"))
        self.assertRedirects(response, "/login/")
        self.assertFalse(response.wsgi_request.user.is_authenticated)
