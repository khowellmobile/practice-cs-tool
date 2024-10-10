/**
 * This file contains functions for validating user input and managing password strength on the account creation page.
 *
 * Global Functions:
 * - attachEventListeners(): Attaches focus, blue, and input events to input elements.
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

attachEventListeners();

/**
 * Attaches event listeners to form input elements to handle focus, blur, and input events.
 *
 */
function attachEventListeners() {
    $(".form__input")
        .on("focus", function () {
            $(this).parent().css("border-bottom", "2px solid rgb(105, 105, 236)");
        })
        .on("blur", function () {
            $(this).parent().css("border-bottom", "2px solid rgb(114, 114, 134)");
        });

    $("#password")
        .on("focus", () => {
            $("#tool-tip").css("display", "flex").hide().fadeIn(150);
        })
        .on("blur", () => {
            $("#tool-tip").fadeOut(150);
        });

    $("#password").on("input", function () {
        passwordChecker($(this).val());
    });
}

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
    let pass = $("#password").val();

    // Regular expressions for validation
    let minLength = pass.length >= 8;
    let hasSpecialChar = /[!@#$%^&*()_+={}[\]:;<>,.?]/.test(pass);
    let hasDigit = /\d/.test(pass);

    toggleReqs("passChars", minLength);
    toggleReqs("passNums", hasDigit);
    toggleReqs("passSymbols", hasSpecialChar);

    if (minLength && hasDigit && hasSpecialChar) {
        return true;
    } else {
        return false;
    }
}

function toggleReqs(id, complete) {
    if (complete) {
        $(`#${id} .circle`).css("display", "none");
        $(`#${id} .check-mark`).css("display", "flex");
        $(`#${id} .req-text`).addClass("completed");
        $(`#${id} .req-text`).removeClass("uncompleted");
    } else {
        $(`#${id} .circle`).css("display", "flex");
        $(`#${id} .check-mark`).css("display", "none");
        $(`#${id} .req-text`).addClass("uncompleted");
        $(`#${id} .req-text`).removeClass("completed");
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
