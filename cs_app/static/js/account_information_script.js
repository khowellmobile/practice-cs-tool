/**
 * JavaScript file for managing user account information updates via AJAX for the account_information.html page.
 *
 * This file contains functions to toggle display of field change forms, submit form data
 * via AJAX requests to update user information (name, email, password), and handle successful
 * AJAX responses by updating corresponding elements on the page dynamically.
 *
 * Functions:
 * - toggleForm(fieldName): Toggles the display of the form for updating the specified field.
 * - submitForm(fieldName): Submits form data for updating user information via AJAX based on
 *                           the field name (name, email, password).
 * - ajaxResponseSuccess(fieldName, formdata): Updates UI elements with new information upon
 *                                             successful AJAX response for the specified field.
 *
 * Dependencies: Requires jQuery for DOM manipulation and AJAX requests.
 */

// Required for global jqeury recognition for use in testing
// CDN still included in html file.
try {
    var jsdom = require("jsdom");
    $ = require("jquery")(new jsdom.JSDOM().window);
} catch (error) {
    console.log(error);
}

/**
 * Attaching event listeners. Waiting for DOM to load not needed due to javascript file
 * being loaded at end of html template.
 */
attachEventListeners();

/**
 * Function to attach event listeners
 */
function attachEventListeners() {
    /**
     * Event listener attached to all toggle buttons
     *
     * Toggles the visibility of the form used to update the specified field gotten from the parent.
     */
    $(".toggleButton").on("click", function () {
        fieldName = $(this).parent().attr("id");
        fadeInPopup(fieldName);
    });

    /**
     * Event listener attached to all toggle buttons
     *
     * Toggles the visibility of the form used to update the specified field gotten from the parent.
     */
    $(".cancel-button").on("click", function () {
        fieldName = $(this).parents(".popupBox").parent().attr("id");
        fadeOutPopup(fieldName);
    });

    /**
     * Event listener attached to all submit buttons
     *
     * Submits the form used to update the specified field gotten from the grandparent.
     */
    $(".save-button").on("click", function () {
        fieldName = $(this).parents(".popupBox").parent().attr("id");
        checkFields(fieldName);
    });
}

function checkFields(fieldName) {
    switch (fieldName) {
        case "name":
            formdata = {
                first_name: $("#first_name").val(),
                last_name: $("#last_name").val(),
            };

            if (!validateName(formdata["first_name"]) || !validateName(formdata["last_name"])) {
                alert(
                    `Name format is invalid. Allowed characters include alphabetical characters, spaces, hyphens, and apostrophes.`
                );
                return;
            }

            submitForm(fieldName, formdata);
            break;
        case "email":
            formdata = {
                email: $("#email").val(),
            };

            if (formdata["email"] != $("#email_confirm").val()) {
                alert("Emails do not match");
                return;
            } else if (!validateEmail(formdata["email"])) {
                alert("Email format is invalid. Please follow standard email format: example@domain.com");
                return;
            }
            submitForm(fieldName, formdata);
            break;
        case "password":
            formdata = {
                password: $("#password").val(),
            };

            if (formdata["password"] != $("#password_confirm").val()) {
                alert("Passwords do not match");
                return;
            } else if (!validatePassword(formdata["password"])) {
                alert(
                    `Password format is invalid. Passwords must be at least 8 characters long and include a number and special character`
                );
                return;
            }
            submitForm(fieldName, formdata);
            break;
        default:
            console.log("Field name not recognized");
            break;
    }
    fadeOutPopup(fieldName);
}

/**
 * Submits form data for updating user information via AJAX based on the field name (name, email, password).
 *
 * The passed fieldName will determine the format of that data and the view the data is sent to.
 *
 * @param {string} fieldName - The name of the field to update (name, email, password).
 * @param {object} formdata - Object containing the information to be submitted
 */
function submitForm(fieldName, formdata) {
    $.ajax({
        type: "POST",
        headers: { "X-CSRFToken": csrf_token }, // csrf_token gotten from js code in html template
        url: `/account_information/update_${fieldName}/`,
        data: formdata,
        success: function (response) {
            ajaxResponseSuccess(fieldName, formdata);
        },
        error: function (xhr) {
            ajaxResponseError(fieldName, xhr.responseJSON);
        },
    });
}

/**
 * Updates UI elements with new information upon successful AJAX response for the specified field.
 *
 * @param {string} fieldName - The name of the field that was updated (name, email, password).
 * @param {Object} formdata - The data object containing updated field information.
 */
function ajaxResponseSuccess(fieldName, formdata) {
    let displayText;

    switch (fieldName) {
        case "name":
            if (!formdata["first_name"] || !formdata["last_name"]) {
                console.log("Formdata does not include required key-value pairs for name");
                displayText = "Name data is incomplete.";
            } else {
                displayText = "Name: " + formdata["first_name"] + " " + formdata["last_name"];
            }
            break;
        case "email":
            if (!formdata["email"]) {
                console.log("Formdata does not include required key-value pair for email");
                displayText = "Email data is incomplete.";
            } else {
                displayText = "Email: " + formdata["email"];
            }
            break;
        case "password":
            displayText = "New password set.";
            break;
        default:
            console.log("Field name not recognized");
            break;
    }

    $(`#${fieldName}_text`).text(displayText);
}

/**
 * Alerts the user about specific errors encountered after an AJAX call.
 *
 * @param {string} fieldName - The name of the field that was being updated (name, email, password).
 * @param {Object} message - The error message object returned from the server.
 *                          It should contain an "error" key indicating the type of error.
 */
function ajaxResponseError(fieldName, message) {
    if (message["error"] == "Invalid format") {
        switch (fieldName) {
            case "name":
                alert(
                    "Name format is invalid. Allowed characters include alphabetical characters, spaces, hyphens, and apostrophes."
                );
                break;
            case "email":
                alert("Email format is invalid. Please follow standard email format: example@domain.com");
                break;
            case "password":
                alert(
                    "Password format is invalid. Passwords must be at least 8 characters long and include a number and special character"
                );
                break;
            default:
                console.log("Field name not recognized");
                break;
        }
    } else {
        alert("An unknown error occurred. Please try again.");
    }
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
 * @returns {boolean} - True if the name is valid according to the format, False otherwise.
 */
function validateName(name) {
    const namePattern = /^[a-zA-Z\'\- ]{2,}$/;

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
 * - Includes at least one special character (!@#$%^&*()_+={}\[\]:;<>,.?)
 * - Includes at least one digit
 *
 * @param {string} password - The password to be validated.
 * @returns {boolean} - True if the password is valid according to the criteria, False otherwise.
 */
function validatePassword(password) {
    const passwordPattern = /^(?=.*[!@#$%^&*()_+={}\[\]:;<>,.?])(?=.*\d).{8,}$/;

    return passwordPattern.test(password);
}

// Show the popup box when the button is clicked
function fadeInPopup(fieldName) {
    $("#update_" + fieldName)
        .fadeIn(250)
        .addClass("show");
    $("#pageOverlay").fadeIn(500);
}

// Hide the popup box when the close button is clicked
function fadeOutPopup(fieldName) {
    $("#update_" + fieldName)
        .removeClass("show")
        .fadeOut(250);
    $("#pageOverlay").fadeOut(500);
}

try {
    // Export all needed functions
    module.exports = {
        attachEventListeners,
        submitForm,
        ajaxResponseSuccess,
        ajaxResponseError,
        validateName,
        validateEmail,
        validatePassword,
    };
} catch (error) {
    console.log(error);
}
