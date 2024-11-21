import json

from django.test import TestCase
from django.urls import reverse
from ..models import User
from django.conf import settings

from unittest.mock import patch, MagicMock

from cs_app.views import (
    generate_unique_alias,
    remove_config,
    remove_conn,
    validate_db_fields,
    construct_config,
)


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
        self.assertTemplateUsed(response, "subpages/change_database.html")
        self.assertIn("db_info", response.context)
        self.assertEqual(
            response.context["db_info"]["db_engine"], "django.db.backends.sqlite3"
        )
        self.assertEqual(response.context["db_info"]["db_name"], "test_db.sqlite")
        self.assertEqual(response.context["db_info"]["db_host"], "localhost")

    def test_change_database_view_unauthenticated(self):
        response = self.client.get(reverse("change_database"))

        self.assertRedirects(response, f'/login/?next={reverse("change_database")}')


class SwitchDatabaseViewTests(TestCase):

    def setUp(self):
        # Create a user and log in
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
            "cs_app.utils.common_functions.validate_db_port", return_value=True
        ), patch("django.db.connections") as mock_connections:

            mock_db_connection = MagicMock()
            mock_connections.__getitem__.return_value = mock_db_connection
            mock_cursor = MagicMock()
            mock_db_connection.cursor.return_value = mock_cursor

            mock_cursor.fetchall.return_value = [("row1",)]

            data = {
                "db_engine": "mssql",
                "db_name": "AdventureWorks2022",
                "db_host": "HOWELL-PC8\\SQLEXPRESS",
                "db_driver": "ODBC Driver 17 for SQL Server",
            }

            response = self.client.post(
                reverse("switch_database"),
                data=json.dumps(data),
                content_type="application/json",
            )

            # Log the response content to debug
            print("Response status code:", response.status_code)
            print("Response content:", response.content.decode()) 

            # Assertions
            self.assertEqual(response.status_code, 200)
            self.assertJSONEqual(
                response.content,
                {
                    "success": True,
                    "db_engine": "mssql",
                    "db_name": "AdventureWorks2022",
                    "db_host": "HOWELL-PC8\\SQLEXPRESS",
                },
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
                    "error": "Engine name invalid.",
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
                "db_port": "15154",
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
                    "error": "Database name invalid. Alphanumerics only.",
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
                "db_port": "15514",
            }

            response = self.client.post(
                reverse("switch_database"),
                data=json.dumps(data),
                content_type="application/json",
            )

            self.assertEqual(response.status_code, 400)
            self.assertJSONEqual(
                response.content, {"success": False, "error": "Database host invalid."}
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
                    "error": "Database driver invalid. Alphanumerics only.",
                },
            )

    def test_switch_database_view_authenticated_invalid_port(self):
        with patch(
            "cs_app.utils.common_functions.validate_db_port", return_value=False
        ):
            data = {
                "db_engine": "postgresql",
                "db_name": "test_database",
                "db_host": "localhost",
                "db_port": "bad_port",
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
                    "error": "Database port invalid. Number must be between 1024 and 65535.",
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


class ValidateDBFields(TestCase):
    def test_valid_fields_all(self):
        db_engine = "mssql"
        db_name = "valid_name"
        db_host = "valid.host.com"
        db_driver = "valid_driver"
        db_port = "1234"

        result_1, result_2 = validate_db_fields(
            db_engine, db_name, db_host, db_driver, db_port
        )

        self.assertEqual(result_1, None)
        self.assertEqual(result_2, None)

    def test_valid_fields_no_driver(self):
        db_engine = "mssql"
        db_name = "valid_name"
        db_host = "valid.host.com"
        db_driver = ""
        db_port = "1234"

        result_1, result_2 = validate_db_fields(
            db_engine, db_name, db_host, db_driver, db_port
        )

        self.assertEqual(result_1, None)
        self.assertEqual(result_2, None)

    def test_valid_fields_no_port(self):
        db_engine = "mssql"
        db_name = "valid_name"
        db_host = "valid.host.com"
        db_driver = "valid_driver"
        db_port = ""

        result_1, result_2 = validate_db_fields(
            db_engine, db_name, db_host, db_driver, db_port
        )

        self.assertEqual(result_1, None)
        self.assertEqual(result_2, None)

    def test_valid_fields_no_port_no_driver(self):
        db_engine = "mssql"
        db_name = "valid_name"
        db_host = "valid.host.com"
        db_driver = ""
        db_port = ""

        result_1, result_2 = validate_db_fields(
            db_engine, db_name, db_host, db_driver, db_port
        )

        self.assertEqual(result_1, None)
        self.assertEqual(result_2, None)

    def test_invalid_engine(self):
        db_engine = "invalid_engine"
        db_name = "valid_name"
        db_host = "valid.host.com"
        db_driver = "valid_driver"
        db_port = "1234"

        result_1, result_2 = validate_db_fields(
            db_engine, db_name, db_host, db_driver, db_port
        )

        self.assertEqual(
            result_1,
            {
                "success": False,
                "error": "Engine name invalid.",
            },
        )
        self.assertEqual(result_2, 400)

    def test_invalid_name(self):
        db_engine = "mssql"
        db_name = "invalid_name_$%^"
        db_host = "valid.host.com"
        db_driver = "valid_driver"
        db_port = "1234"

        result_1, result_2 = validate_db_fields(
            db_engine, db_name, db_host, db_driver, db_port
        )

        self.assertEqual(
            result_1,
            {
                "success": False,
                "error": "Database name invalid. Alphanumerics only.",
            },
        )
        self.assertEqual(result_2, 400)

    def test_invalid_host(self):
        db_engine = "mssql"
        db_name = "valid_name"
        db_host = "invalid_host_*&^%??"
        db_driver = "valid_driver"
        db_port = "1234"

        result_1, result_2 = validate_db_fields(
            db_engine, db_name, db_host, db_driver, db_port
        )

        self.assertEqual(
            result_1,
            {
                "success": False,
                "error": "Database host invalid.",
            },
        )
        self.assertEqual(result_2, 400)

    def test_invalid_driver(self):
        db_engine = "mssql"
        db_name = "valid_name"
        db_host = "valid.host.com"
        db_driver = "invalid_driver_&*()"
        db_port = "1234"

        result_1, result_2 = validate_db_fields(
            db_engine, db_name, db_host, db_driver, db_port
        )

        self.assertEqual(
            result_1,
            {
                "success": False,
                "error": "Database driver invalid. Alphanumerics only.",
            },
        )
        self.assertEqual(result_2, 400)

    def test_invalid_port(self):
        db_engine = "mssql"
        db_name = "valid_name"
        db_host = "valid.host.com"
        db_driver = "valid_driver"
        db_port = "bad_port"

        result_1, result_2 = validate_db_fields(
            db_engine, db_name, db_host, db_driver, db_port
        )

        self.assertEqual(
            result_1,
            {
                "success": False,
                "error": "Database port invalid. Number must be between 1024 and 65535.",
            },
        )
        self.assertEqual(result_2, 400)


class ConstructConfigTestCase(TestCase):
    def test_mssql_valid_config(self):
        db_engine = "mssql"
        db_name = "valid_db"
        db_host = "valid.host.com"
        db_driver = "SQL Server"
        db_port = "1234"
        db_user = "valid_user"
        db_pass = "valid_password"

        result = construct_config(
            db_engine, db_name, db_host, db_driver, db_user, db_pass, db_port
        )

        expected_result = {
            "ENGINE": "mssql",
            "NAME": "valid_db",
            "HOST": "valid.host.com",
            "OPTIONS": {
                "driver": "SQL Server",
                "trusted_connection": "no",
            },
            "USER": "valid_user",
            "PASSWORD": "valid_password",
            "PORT": "1234",
            "ATOMIC_REQUESTS": True,
            "AUTOCOMMIT": True,
            "CONN_MAX_AGE": 600,
            "CONN_HEALTH_CHECKS": False,
            "TIME_ZONE": None,
        }

        self.assertEqual(result, expected_result)

    def test_valid_mssql_config_with_trusted_connection(self):
        db_engine = "mssql"
        db_name = "valid_db"
        db_host = "valid.host.com"
        db_driver = "SQL Server"
        db_port = "1234"
        db_user = None
        db_pass = None

        result = construct_config(
            db_engine, db_name, db_host, db_driver, db_user, db_pass, db_port
        )

        expected_result = {
            "ENGINE": "mssql",
            "NAME": "valid_db",
            "HOST": "valid.host.com",
            "OPTIONS": {
                "driver": "SQL Server",
                "trusted_connection": "yes",
            },
            "USER": None,
            "PASSWORD": None,
            "PORT": "1234",
            "ATOMIC_REQUESTS": True,
            "AUTOCOMMIT": True,
            "CONN_MAX_AGE": 600,
            "CONN_HEALTH_CHECKS": False,
            "TIME_ZONE": None,
        }

        self.assertEqual(result, expected_result)

    def test_valid_mssql_config_without_port(self):
        db_engine = "mssql"
        db_name = "valid_db"
        db_host = "valid.host.com"
        db_driver = "SQL Server"
        db_port = ""
        db_user = None
        db_pass = None

        result = construct_config(
            db_engine, db_name, db_host, db_driver, db_user, db_pass, db_port
        )

        expected_result = {
            "ENGINE": "mssql",
            "NAME": "valid_db",
            "HOST": "valid.host.com",
            "OPTIONS": {
                "driver": "SQL Server",
                "trusted_connection": "yes",
            },
            "USER": None,
            "PASSWORD": None,
            "PORT": "",
            "ATOMIC_REQUESTS": True,
            "AUTOCOMMIT": True,
            "CONN_MAX_AGE": 600,
            "CONN_HEALTH_CHECKS": False,
            "TIME_ZONE": None,
        }

        self.assertEqual(result, expected_result)

    def test_valid_mssql_config_without_driver(self):
        db_engine = "mssql"
        db_name = "valid_db"
        db_host = "valid.host.com"
        db_driver = ""
        db_port = "1234"
        db_user = None
        db_pass = None

        result = construct_config(
            db_engine, db_name, db_host, db_driver, db_user, db_pass, db_port
        )

        expected_result = {
            "ENGINE": "mssql",
            "NAME": "valid_db",
            "HOST": "valid.host.com",
            "OPTIONS": {
                "driver": "",
                "trusted_connection": "yes",
            },
            "USER": None,
            "PASSWORD": None,
            "PORT": "1234",
            "ATOMIC_REQUESTS": True,
            "AUTOCOMMIT": True,
            "CONN_MAX_AGE": 600,
            "CONN_HEALTH_CHECKS": False,
            "TIME_ZONE": None,
        }

        self.assertEqual(result, expected_result)

    def test_valid_mssql_config_with_no_driver_no_port(self):
        db_engine = "mssql"
        db_name = "valid_db"
        db_host = "valid.host.com"
        db_driver = ""
        db_port = ""
        db_user = None
        db_pass = None

        result = construct_config(
            db_engine, db_name, db_host, db_driver, db_user, db_pass, db_port
        )

        expected_result = {
            "ENGINE": "mssql",
            "NAME": "valid_db",
            "HOST": "valid.host.com",
            "OPTIONS": {
                "driver": "",
                "trusted_connection": "yes",
            },
            "USER": None,
            "PASSWORD": None,
            "PORT": "",
            "ATOMIC_REQUESTS": True,
            "AUTOCOMMIT": True,
            "CONN_MAX_AGE": 600,
            "CONN_HEALTH_CHECKS": False,
            "TIME_ZONE": None,
        }

        self.assertEqual(result, expected_result)

    def test_postgresql_valid_config(self):
        db_engine = "postgresql"
        db_name = "valid_db"
        db_host = "valid.host.com"
        db_driver = "PostgreSQL"
        db_port = "5432"
        db_user = "valid_user"
        db_pass = "valid_password"

        result = construct_config(
            db_engine, db_name, db_host, db_driver, db_user, db_pass, db_port
        )

        expected_result = {
            "ENGINE": "postgresql",
            "NAME": "valid_db",
            "HOST": "valid.host.com",
            "USER": "valid_user",
            "PASSWORD": "valid_password",
            "PORT": "5432",
            "ATOMIC_REQUESTS": True,
            "AUTOCOMMIT": True,
            "CONN_MAX_AGE": 600,
            "CONN_HEALTH_CHECKS": False,
            "TIME_ZONE": None,
            "OPTIONS": {
                "driver": "PostgreSQL",
                "connect_timeout": 30,
            },
        }

        self.assertEqual(result, expected_result)

    def test_postgresql_valid_config_no_driver(self):
        db_engine = "postgresql"
        db_name = "valid_db"
        db_host = "valid.host.com"
        db_driver = ""
        db_port = "5432"
        db_user = "valid_user"
        db_pass = "valid_password"

        result = construct_config(
            db_engine, db_name, db_host, db_driver, db_user, db_pass, db_port
        )

        expected_result = {
            "ENGINE": "postgresql",
            "NAME": "valid_db",
            "HOST": "valid.host.com",
            "USER": "valid_user",
            "PASSWORD": "valid_password",
            "PORT": "5432",
            "ATOMIC_REQUESTS": True,
            "AUTOCOMMIT": True,
            "CONN_MAX_AGE": 600,
            "CONN_HEALTH_CHECKS": False,
            "TIME_ZONE": None,
            "OPTIONS": {
                "driver": "",
                "connect_timeout": 30,
            },
        }

        self.assertEqual(result, expected_result)

    def test_postgresql_valid_config_no_port(self):
        db_engine = "postgresql"
        db_name = "valid_db"
        db_host = "valid.host.com"
        db_driver = "PostgreSQL"
        db_port = ""
        db_user = "valid_user"
        db_pass = "valid_password"

        result = construct_config(
            db_engine, db_name, db_host, db_driver, db_user, db_pass, db_port
        )

        expected_result = {
            "ENGINE": "postgresql",
            "NAME": "valid_db",
            "HOST": "valid.host.com",
            "USER": "valid_user",
            "PASSWORD": "valid_password",
            "PORT": "",
            "ATOMIC_REQUESTS": True,
            "AUTOCOMMIT": True,
            "CONN_MAX_AGE": 600,
            "CONN_HEALTH_CHECKS": False,
            "TIME_ZONE": None,
            "OPTIONS": {
                "driver": "PostgreSQL",
                "connect_timeout": 30,
            },
        }

        self.assertEqual(result, expected_result)

    def test_postgresql_valid_config_no_driver_no_port(self):
        db_engine = "postgresql"
        db_name = "valid_db"
        db_host = "valid.host.com"
        db_driver = ""
        db_port = ""
        db_user = "valid_user"
        db_pass = "valid_password"

        result = construct_config(
            db_engine, db_name, db_host, db_driver, db_user, db_pass, db_port
        )

        expected_result = {
            "ENGINE": "postgresql",
            "NAME": "valid_db",
            "HOST": "valid.host.com",
            "USER": "valid_user",
            "PASSWORD": "valid_password",
            "PORT": "",
            "ATOMIC_REQUESTS": True,
            "AUTOCOMMIT": True,
            "CONN_MAX_AGE": 600,
            "CONN_HEALTH_CHECKS": False,
            "TIME_ZONE": None,
            "OPTIONS": {
                "driver": "",
                "connect_timeout": 30,
            },
        }

        self.assertEqual(result, expected_result)

    def test_invalid_engine(self):
        db_engine = "invalid_engine"
        db_name = "valid_db"
        db_host = "valid.host.com"
        db_driver = "invalid_driver"
        db_port = "bad_port"
        db_user = "valid_user"
        db_pass = "valid_password"

        with self.assertRaises(ValueError) as context:
            construct_config(
                db_engine, db_name, db_host, db_driver, db_user, db_pass, db_port
            )

        self.assertEqual(
            str(context.exception), "construct_config: Engine not recognized"
        )
