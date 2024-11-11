from django.test import TestCase
from django.urls import reverse
from ..models import User

class DirectionsViewTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="testpass")
        self.client.login(username="testuser", password="testpass")

    def test_directions_view_authenticated(self):
        response = self.client.get(reverse("directions"))

        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "subpages/directions.html")
        self.assertEqual(response.context["user"], self.user)

    def test_directions_view_unauthenticated(self):
        self.client.logout()

        response = self.client.post(reverse("directions"))

        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, f'/login/?next={reverse("directions")}')
