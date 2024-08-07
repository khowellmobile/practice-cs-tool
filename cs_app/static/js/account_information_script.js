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

/**
 * Event listener attached to all toggle buttons
 *
 * Toggles the visibility of the form used to update the specified field gotten from the parent.
 */
$(".toggleButton").on("click", function () {
    fieldName = $(this).parent().attr("id");
    $("#update_" + fieldName).toggle();
});

/**
 * Event listener attached to all submit buttons
 *
 * Submits the form used to update the specified field gotten from the grandparent.
 */
$(".submitButton").on("click", function () {
    fieldName = $(this).parent().parent().attr("id");
    submitForm(fieldName);
});

/**
 * Submits form data for updating user information via AJAX based on the field name (name, email, password).
 *
 * The passed fieldName will determine the format of that data and the view the data is sent to.
 *
 * @param {string} fieldName - The name of the field to update (name, email, password).
 */
function submitForm(fieldName) {
    $("#update_" + fieldName).hide();

    var formdata;

    switch (fieldName) {
        case "name":
            formdata = {
                first_name: $("#first_name").val(),
                last_name: $("#last_name").val(),
            };
            break;
        case "email":
            formdata = {
                email: $("#email").val(),
            };
            break;
        case "password":
            formdata = {
                password: $("#password").val(),
            };
            break;
        default:
            console.log("Field name not recognized");
            break;
    }

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
    var displayText;

    switch (fieldName) {
        case "name":
            displayText =
                "Name: " + formdata["first_name"] + " " + formdata["last_name"];
            break;
        case "email":
            displayText = "Email: " + formdata["email"];
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
                alert(
                    "Email format is invalid. Please follow standard email format: example@domain.com"
                );
                break;
            case "password":
                alert(
                    "Password format is invalid. Passwords must be at least 8 characters long."
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
