import json

from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from django.conf import settings

from unittest.mock import patch

from cs_app.views import generate_unique_alias, remove_config, remove_conn


class ChangeDatabaseViewTests(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="testpass")

    @patch("django.conf.settings.DATABASES")
    def test_change_database_view_authenticated(self, mock_databases):
        mock_databases.__getitem__.return_value = {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": "test_db.sqlite",
            "HOST": "localhost",
        }

        self.client.login(username="testuser", password="testpass")

        response = self.client.get(reverse("change_database"))

        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "change_database.html")
        self.assertIn("db_info", response.context)
        self.assertEqual(
            response.context["db_info"]["db_engine"], "django.db.backends.sqlite3"
        )
        self.assertEqual(response.context["db_info"]["db_name"], "test_db.sqlite")
        self.assertEqual(response.context["db_info"]["db_host"], "localhost")

    def test_change_database_view_unauthenticated(self):
        response = self.client.get(reverse("change_database"))

        self.assertRedirects(response, f'/login/?next={reverse("change_database")}')


class GetDbInfoViewTests(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="testpass")

    @patch("django.conf.settings.DATABASES", new_callable=dict)
    def test_get_db_info_view_authenticated_valid_alias(self, mock_databases):
        mock_databases.update(
            {
                "test_db": {
                    "ENGINE": "django.db.backends.sqlite3",
                    "NAME": "test_db.sqlite",
                    "HOST": "localhost",
                }
            }
        )

        self.client.login(username="testuser", password="testpass")

        # Requesting the database info with a valid alias
        response = self.client.get(reverse("get_db_info"), {"db_alias": "test_db"})

        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(
            response.content,
            {
                "db_engine": "django.db.backends.sqlite3",
                "db_name": "test_db.sqlite",
                "db_host": "localhost",
            },
        )

    def test_get_db_info_view_authenticated_invalid_alias(self):
        self.client.login(username="testuser", password="testpass")

        response = self.client.get(reverse("get_db_info"), {"db_alias": "invalid_db"})

        self.assertEqual(response.status_code, 400)
        self.assertJSONEqual(response.content, {"Error": "Invalid database alias"})

    def test_get_db_info_view_authenticated_missing_alias(self):
        self.client.login(username="testuser", password="testpass")

        response = self.client.get(reverse("get_db_info"))

        self.assertEqual(response.status_code, 400)
        self.assertJSONEqual(response.content, {"Error": "Missing database alias"})

    def test_get_db_info_view_unauthenticated(self):
        response = self.client.get(reverse("get_db_info"))

        expected_redirect_url = f'/login/?next={reverse("get_db_info")}'
        self.assertRedirects(response, expected_redirect_url)


class SwitchDatabaseViewTests(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="testpass")
        self.client.login(username="testuser", password="testpass")

    def test_switch_database_view_authenticated_success(self):
        with patch(
            "cs_app.utils.common_functions.validate_db_engine", return_value=True
        ), patch(
            "cs_app.utils.common_functions.validate_db_name", return_value=True
        ), patch(
            "cs_app.utils.common_functions.validate_db_host", return_value=True
        ), patch(
            "cs_app.utils.common_functions.validate_db_driver", return_value=True
        ), patch(
            "django.db.connections"
        ) as mock_connections:

            mock_connections.return_value.cursor.return_value.fetchall.return_value = [
                ("row1",)
            ]

            data = {
                "db_engine": "sqlite",
                "db_name": "test_database",
                "db_host": "localhost",
                "db_driver": "SQLite3",
            }

            response = self.client.post(
                reverse("switch_database"),
                data=json.dumps(data),
                content_type="application/json",
            )

            self.assertEqual(response.status_code, 200)
            self.assertJSONEqual(
                response.content, {"success": True, "db_alias": "test_database"}
            )

    def test_switch_database_view_authenticated_invalid_engine(self):
        with patch(
            "cs_app.utils.common_functions.validate_db_engine", return_value=False
        ):
            data = {
                "db_engine": "invalid_engine",
                "db_name": "test_database",
                "db_host": "localhost",
                "db_driver": "psycopg2",
            }

            response = self.client.post(
                reverse("switch_database"),
                data=json.dumps(data),
                content_type="application/json",
            )

            self.assertEqual(response.status_code, 400)
            self.assertJSONEqual(
                response.content,
                {
                    "success": False,
                    "error": "Engine name invalid. Only postgresql, mysql, sqlite, oracle, mssql supported",
                },
            )

    def test_switch_database_view_authenticated_invalid_name(self):
        with patch(
            "cs_app.utils.common_functions.validate_db_name", return_value=False
        ):
            data = {
                "db_engine": "postgresql",
                "db_name": "invalid name",
                "db_host": "localhost",
                "db_driver": "psycopg2",
            }

            response = self.client.post(
                reverse("switch_database"),
                data=json.dumps(data),
                content_type="application/json",
            )

            self.assertEqual(response.status_code, 400)
            self.assertJSONEqual(
                response.content,
                {
                    "success": False,
                    "error": "Database name invalid. Alphanumerics only",
                },
            )

    def test_switch_database_view_authenticated_invalid_host(self):
        with patch(
            "cs_app.utils.common_functions.validate_db_host", return_value=False
        ):
            data = {
                "db_engine": "postgresql",
                "db_name": "test_database",
                "db_host": "localhost",
                "db_driver": "psycopg2",
            }

            response = self.client.post(
                reverse("switch_database"),
                data=json.dumps(data),
                content_type="application/json",
            )

            self.assertEqual(response.status_code, 400)
            self.assertJSONEqual(
                response.content, {"success": False, "error": "Database host invalid"}
            )

    def test_switch_database_view_authenticated_invalid_driver(self):
        with patch(
            "cs_app.utils.common_functions.validate_db_driver", return_value=False
        ):
            data = {
                "db_engine": "postgresql",
                "db_name": "test_database",
                "db_host": "localhost",
                "db_driver": "psycopg2",
            }

            response = self.client.post(
                reverse("switch_database"),
                data=json.dumps(data),
                content_type="application/json",
            )

            self.assertEqual(response.status_code, 400)
            self.assertJSONEqual(
                response.content,
                {
                    "success": False,
                    "error": "Database driver invalid. Alphanumerics only",
                },
            )

    def test_switch_database_view_authenticated_unauthenticated(self):
        self.client.logout()

        response = self.client.post(reverse("switch_database"), data={})

        self.assertRedirects(
            response, f'/login/?next={reverse("switch_database")}', status_code=302
        )

    def test_switch_database_view_invalid_method(self):
        response = self.client.get(reverse("switch_database"))

        self.assertEqual(response.status_code, 405)
        self.assertJSONEqual(
            response.content, {"success": False, "error": "Invalid request method"}
        )


class RemoveConfigTests(TestCase):

    def setUp(self):
        self.alias = "test_db"
        settings.DATABASES[self.alias] = {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": "test_db.sqlite",
        }

    def test_remove_config_success(self):
        self.assertIn(self.alias, settings.DATABASES)
        remove_config(self.alias)
        self.assertNotIn(self.alias, settings.DATABASES)

    def test_remove_config_nonexistent(self):
        remove_config("nonexistent_db")
        self.assertIn(self.alias, settings.DATABASES)


class RemoveConnTests(TestCase):

    def setUp(self):
        self.alias = "test_db"
        settings.DATABASES[self.alias] = {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": "test_db.sqlite",
        }

    @patch("django.db.connections")
    def test_remove_conn_success(self, mock_connections):
        mock_connection = mock_connections[self.alias]
        mock_connection.alias = self.alias
        self.assertIsNotNone(mock_connections[self.alias])
        remove_conn(self.alias)


class GenerateUniqueAliasTests(TestCase):
    def setUp(self):
        settings.DATABASES = {
            "default": {
                "ENGINE": "django.db.backends.sqlite3",
                "NAME": "mydatabase",
            },
            "test_db": {
                "ENGINE": "django.db.backends.sqlite3",
                "NAME": "testdatabase",
            },
        }

    def test_generate_unique_alias_no_conflict(self):
        alias = "new_db"
        result = generate_unique_alias(alias)
        self.assertEqual(result, "new_db")

    def test_generate_unique_alias_with_one_conflict(self):
        alias = "test_db"
        result = generate_unique_alias(alias)
        self.assertEqual(result, "test_db_1")

    def test_generate_unique_alias_with_multiple_conflicts(self):
        alias = "existing_db"
        settings.DATABASES["existing_db"] = {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": "existing_db",
        }
        settings.DATABASES["existing_db_1"] = {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": "existing_db_1",
        }
        result = generate_unique_alias(alias)
        self.assertEqual(result, "existing_db_2")

    def test_generate_unique_alias_with_custom_prefix(self):
        alias = "base"
        settings.DATABASES["base"] = {}
        result = generate_unique_alias(alias)
        self.assertEqual(result, "base_1")

        settings.DATABASES["base_1"] = {}
        result = generate_unique_alias(alias)
        self.assertEqual(result, "base_2")
