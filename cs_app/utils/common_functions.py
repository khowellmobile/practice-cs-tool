"""
Python functions that will be reused throughout the project.

This module contains functions that are used as helpers throughout the project.
Any helper function needed for views that are reused will go here.

Functions:
- validate_name(name): Validates a name using regex to ensure security and consistency
- validate_email(email): Validates an email using regex to ensure security and consistency
- validate_password(password): Validates a password using regex to ensure security and consistency

Dependencies:
- Python Modules: re
"""

import re


def validate_name(name):
    """
    Validates if a name follows a standard format.

    Name Format:
    - Allows letters (both uppercase and lowercase)
    - Allows spaces, apostrophes ('), and hyphens (-)
    - Minimum length of 2 characters

    Args:
        name (str): The name to be validated.

    Returns:
        bool: True if the name is valid according to the format, False otherwise.
    """
    name_pattern = r"^[a-zA-Z\'\- ]{2,}$"

    pattern = re.compile(name_pattern)

    if pattern.match(name):
        return True
    else:
        return False


def validate_email(email):
    """
    Validates if an email address follows a standard format.

    Email Format:
    - Valid format with basic structure check
    - Matches typical email address patterns

    Args:
        email (str): The email address to be validated.

    Returns:
        bool: True if the email address is valid according to the format, False otherwise.
    """

    email_pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"

    pattern = re.compile(email_pattern)

    if pattern.match(email):
        return True
    else:
        return False


def validate_password(password):
    """
    Validates if a password meets the specified criteria.

    Password Criteria:
    - Minimum 8 characters long
    - Includes at least one special character (!@#$%^&*()_+={}\[\]:;<>,.?)
    - Includes at least one digit

    Args:
        password (str): The password to be validated.

    Returns:
        bool: True if the password is valid according to the criteria, False otherwise.
    """
    password_pattern = r"^(?=.*[!@#$%^&*()_+={}\[\]:;<>,.?])(?=.*\d).{8,}$"

    pattern = re.compile(password_pattern)
    if pattern.match(password):
        return True
    else:
        return False


def validate_db_engine(db_engine):
    """
    Validates the database engine field.

    Args:
        db_engine (str): The database engine (e.g., 'postgresql', 'mysql').

    Returns:
        bool: True if the engine is valid, False otherwise.
    """
    db_engine_pattern = r"^(postgresql|mysql|sqlite|oracle|mssql)$"
    return bool(re.match(db_engine_pattern, db_engine))


def validate_db_name(db_name):
    """
    Validates the database name field.

    Args:
        db_name (str): The name of the database.

    Returns:
        bool: True if the database name is valid, False otherwise.
    """
    db_name_pattern = r"^[a-zA-Z0-9_]+$"
    return bool(re.match(db_name_pattern, db_name))


def validate_db_host(db_host):
    """
    Validates the database host field.

    Args:
        db_host (str): The hostname or IP address of the database server.

    Returns:
        bool: True if the host is valid, False otherwise.
    """
    db_host_pattern = re.compile(
        r"^(localhost|"
        r"([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}|"
        r"\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|"
        r"[a-zA-Z0-9-]+(\\[a-zA-Z0-9-]+)?)$"
    )
    return bool(re.match(db_host_pattern, db_host))


def validate_db_driver(db_driver):
    """
    Validates the database driver field.

    Args:
        db_driver (str): The database driver (e.g., 'psycopg2', 'pymysql').

    Returns:
        bool: True if the driver is valid, False otherwise.
    """
    db_driver_pattern = r"^[a-zA-Z0-9_ ]+$"
    return bool(re.match(db_driver_pattern, db_driver))
