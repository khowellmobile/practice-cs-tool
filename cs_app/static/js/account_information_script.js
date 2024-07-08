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
 * Toggles the visibility of the form used to update the specified field.
 *
 * @param {string} fieldName - The name of the field for which the form should be toggled.
 */
function toggleForm(fieldName) {
    $("#update_" + fieldName).toggle();
}

/**
 * Submits form data for updating user information via AJAX based on the field name (name, email, password).
 *
 * The passed fieldName will determine the format of that data and the view the data is sent to.
 *
 * @param {string} fieldName - The name of the field to update (name, email, password).
 */
function submitForm(fieldName) {
    $("#update_" + fieldName).hide();

    var url, formdata;

    if (fieldName == "name") {
        url = "/account_information/update_name/";
        formdata = {
            first_name: $("#first_name").val(),
            last_name: $("#last_name").val(),
        };
    } else if (fieldName == "email") {
        url = "/account_information/update_email/";
        formdata = {
            email: $("#email").val(),
        };
    } else {
        url = "/account_information/update_password/";
        formdata = {
            password: $("#password").val(),
        };
    }

    $.ajax({
        type: "POST",
        headers: { "X-CSRFToken": csrf_token },
        url: url,
        data: formdata,
        success: function (response) {
            ajaxResponseSuccess(fieldName, formdata);
        },
        error: function (xhr, errmsg, err) {
            // Handle errors as needed
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

    if (fieldName == "name") {
        displayText =
            "Name: " + formdata["first_name"] + " " + formdata["last_name"];
    } else if (fieldName == "email") {
        displayText = "Email: " + formdata["email"];
    } else {
        displayText = "New password set.";
    }

    $(`#${fieldName}_text`).text(displayText);
}
