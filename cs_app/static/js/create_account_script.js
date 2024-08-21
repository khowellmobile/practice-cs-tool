/**
 * This file contains functions for validating user input and managing password strength on the account creation page.
 *
 * Global Functions:
 * - validateForm(): Validates form fields (name, email, password) and displays alerts for invalid input.
 * - validateName(name): Checks if the name follows the allowed format (letters, spaces, apostrophes, hyphens).
 * - validateEmail(email): Checks if the email follows a standard email format.
 * - passwordChecker(pass): Validates password strength based on length, special characters, and digits.
 *
 * Event Handlers:
 * - $("#create-account-form").on("submit", function (event) { ... }): Prevents default form submission behavior.
 * - $("#password").on("input", function () { ... }): Triggers password strength checking on input.
 *
 * Dependencies:
 * - Requires jQuery for DOM manipulation and event handling.
 */

// Required for global jQuery recognition for use in testing
// CDN still included in HTML file
try {
    var jsdom = require("jsdom");
    $ = require("jquery")(new jsdom.JSDOM().window);
} catch (error) {
    console.log(error);
}

/**
 * Handles form submission for the account creation form.
 *
 * Prevents the default form submission behavior.
 */
$("#create-account-form").on("submit", function (event) {
    event.preventDefault();
});

/**
 * Handles input events on the password field to check password validity.
 *
 * Runs the passwordChecker function to provide feedback on password strength.
 */
$("#password").on("input", function () {
    passwordChecker($(this).val());
});

/**
 * Validates the account creation form fields.
 *
 * Checks if the name, email, and password fields meet their respective format requirements.
 * - Name: Must be valid according to the `validateName` function.
 * - Email: Must be valid according to the `validateEmail` function.
 * - Password: Must meet the criteria checked by `passwordChecker` function.
 *
 * @returns {boolean} True if all fields are valid, False otherwise.
 */
function validateForm() {
    var firstName = $("#firstName").val();
    var lastName = $("#lastName").val();
    var email = $("#email").val();
    var password = $("#password").val();

    if (!validateName(firstName) || !validateName(lastName)) {
        alert(
            "Name format is invalid. Allowed characters include alphabetical characters, spaces, hyphens, and apostrophes."
        );
        return false;
    } else if (!validateEmail(email)) {
        alert("Email format is invalid. Please follow standard email format: example@domain.com");
        return false;
    } else if (!passwordChecker(password)) {
        alert(
            "Password format is invalid. Passwords must be at least 8 characters long, include a number, and include a special character."
        );
        return false;
    }

    return true;
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
 * @returns {boolean} - True if the email address is valid according to the format, False otherwise.
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
 * @returns {boolean} - True if the password is valid according to the criteria, False otherwise.
 */
function passwordChecker(pass) {
    let color1 = "rgb(0, 116, 211)";
    let color2 = "rgb(223, 0, 0)";

    // Regular expressions for validation
    let minLength = pass.length >= 8;
    let hasSpecialChar = /[!@#$%^&*()_+={}[\]:;<>,.?]/.test(pass);
    let hasDigit = /\d/.test(pass);

    if (minLength) {
        $("#passChars").css("color", color1);
    } else {
        $("#passChars").css("color", color2);
    }

    if (hasDigit) {
        $("#passNums").css("color", color1);
    } else {
        $("#passNums").css("color", color2);
    }

    if (hasSpecialChar) {
        $("#passSymbols").css("color", color1);
    } else {
        $("#passSymbols").css("color", color2);
    }

    if (minLength && hasDigit && hasSpecialChar) {
        return true;
    } else {
        return false;
    }
}

try {
    // Export all functions
    module.exports = {
        validateForm,
        validateName,
        validateEmail,
        passwordChecker,
    };
} catch (error) {
    console.log(error);
}

