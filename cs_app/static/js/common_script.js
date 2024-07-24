/*
 * Common Script for Django Application
 *
 * This script contains common functions and utilities that are used across multiple pages
 * in the Django application. It helps in maintaining consistency and reusability of code.
 *
 * List of functions:
 * - redirectTo(string url)
 * - [Function 2]
 * - [Function 3]
 */

function redirectTo(url) {
    window.location.href = url;
}

/**
 * Validates if a name follows a standard format.
 *
 * Name Format:
 * - Allows letters (both uppercase and lowercase)
 * - Allows spaces, apostrophes ('), and hyphens (-)
 * - Minimum length of 2 characters
 *
 * @param {string} name - The name to be validated.
 * @returns {boolean} True if the name is valid according to the format, False otherwise.
 */
function validateName(name) {
    const namePattern = /^[a-zA-Z' \-]{2,}$/;
    return namePattern.test(name);
}

/**
 * Validates if an email address follows a standard format.
 *
 * Email Format:
 * - Valid format with basic structure check
 * - Matches typical email address patterns
 *
 * @param {string} email - The email address to be validated.
 * @returns {boolean} True if the email address is valid according to the format, False otherwise.
 */
function validateEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
}

/**
 * Validates if a password meets the specified criteria.
 *
 * Password Criteria:
 * - Minimum 8 characters long
 * - Includes at least one special character (!@#$%^&*()_+={}[]:;<>,.?)
 * - Includes at least one digit
 *
 * @param {string} password - The password to be validated.
 * @returns {boolean} True if the password is valid according to the criteria, False otherwise.
 */
function validatePassword(password) {
    const passwordPattern = /^(?=.*[!@#$%^&*()_+={}[\]:;<>,.?])(?=.*\d).{8,}$/;
    return passwordPattern.test(password);
}


