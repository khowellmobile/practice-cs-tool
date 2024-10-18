from django.test import TestCase
from django.urls import reverse
from ..models import User


class MainViewtests(TestCase):

    def test_main_view(self):
        response = self.client.get(reverse("main"))

        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "index.html")


class HomeViewTests(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="testpass")
        self.client.login(username="testuser", password="testpass")

    def test_home_view_authenticated(self):
        response = self.client.get(reverse("home"))

        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "home.html")
        self.assertEqual(response.context["user"], self.user)

    def test_account_information_view_unauthenticated(self):
        self.client.logout()

        response = self.client.post(reverse("home"))

        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, f'/login/?next={reverse("home")}')
