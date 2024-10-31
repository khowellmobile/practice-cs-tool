/**
 * JavaScript file for managing database configuration updates via fetch for the database change page.
 *
 * This file contains functions to attach event listeners to form inputs, gather input values for
 * database configurations, and submit the new configuration data to the server via AJAX requests.
 * It handles successful and error responses from the server, updating the user interface accordingly.
 *
 * Functions:
 * - attachEventListeners(): Attaches event listeners to form input elements to handle focus and blur events.
 * - createNewConfig(): Gathers input values for database configuration fields, validates them,
 *                      and initiates the submission process.
 * - submitNewConfig(db_info): Submits the new database configuration data to the server via fetch.
 * - dbChangeHandler(success, message): Handles the server response for database configuration changes,
 *                                      updating UI elements based on success or failure.
 * - getInputValues(): Gathers input values of all inputs in the form and formats them into an object
 *                    for creating the new database configuration.
 * - showOverlay(show): Controls the display of the overlay for loading indications.
 *
 * Dependencies: Requires jQuery for DOM manipulation.
 */

// Required for global jqeury recognition for use in testing
// CDN still included in html file
try {
    var jsdom = require("jsdom");
    $ = require("jquery")(new jsdom.JSDOM().window);
} catch (error) {
    console.log(error);
}

attachEventListeners();

/**
 * Attaches event listeners to form input elements to handle focus and blur events.
 *
 * This function applies a style change to the parent element of the input when the input
 * gains focus, and reverts the style when the input loses focus.
 */
function attachEventListeners() {
    $(".form__input")
        .on("focus", function () {
            $(this).parent().css("border-bottom", "2px solid rgb(105, 105, 236)");
        })
        .on("blur", function () {
            $(this).parent().css("border-bottom", "2px solid rgb(114, 114, 134)");
        });

    $("#db_history__listing > div").on("click", function () {
        $("#input_engine").val($(this).find(".past-engine").text());
        $("#input_name").val($(this).find(".past-name").text());
        $("#input_host").val($(this).find(".past-host").text());
        $("#input_driver").val($(this).find(".past-driver").text());
    });
}

/**
 * Gathers input values for database configuration fields, validates them,
 * and initiates the process to submit the new configuration.
 */
function createNewConfig() {
    db_info = getInputValues();

    if (
        (db_info["db_engine"] == "") |
        (db_info["db_name"] == "") |
        (db_info["db_host"] == "") |
        (db_info["db_driver"] == "")
    ) {
        alert("Please fill out engine, name, host, and driver");
        return;
    }

    submitNewConfig(db_info);
}

/**
 * Submits the new database configuration data to the server via fetch.
 *
 * @param {Object} db_info - The object containing the database configuration information.
 */
function submitNewConfig(db_info) {
    showOverlay(true);

    fetch("/switch_config/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrf_token,
        },
        body: JSON.stringify(db_info),
    })
        .then((response) => {
            if (!response.ok) {
                return response.json().then((err) => Promise.reject(err));
            }
            return response.json();
        })
        .then((data) => {
            dbChangeHandler(true, data);
        })
        .catch((error) => {
            dbChangeHandler(false, error);
        });
}

/**
 * Handles the server response for database configuration changes.
 * Updates UI elements based on whether the operation was successful or not.
 *
 * This function uses dependency injection for testing purposes.
 *
 * @param {boolean} success - Indicates if the database configuration change was successful.
 * @param {Object} message - The response message or error object returned from the server.
 * @param {function} getDisplayDBInfo - Function to get and display new database information.
 */
function dbChangeHandler(success, message) {
    if (success) {
        $("#database-change__status").append("<p class='stat__message'>Successful Connection</p>");
    } else if (message.error) {
        // captures a failure but one that includes a json response
        $("#database-change__status").append(`<p class='stat__message'>Error: ${message.error}</p>`);
    } else {
        // captures a failure due to non-view related circumstances
        alert("An error occurred while processing your request. Please check fields and try again.");
    }

    showOverlay(false);
}

/**
 * Gathers input values of all inputs in the form on the change database page.
 * Formats these into an object used in creating the new databse configuration.
 *
 * @return {Object} - Object that contains the information from the form inputs
 */
function getInputValues() {
    var db_info = {};
    $(".form__cluster")
        .find("input")
        .each(function () {
            id = $(this).attr("id").slice(6);
            db_info[`db_${id}`] = $(this).val().trim();
        });

    return db_info;
}

/**
 * Controls the display of the overlay. Pass true to show overlay.
 * Pass false to hide it.
 *
 * @param {boolean} show - true to show overlay, false to hide it
 */
function showOverlay(show) {
    if (show) {
        $("#page-overlay").show();
    } else {
        $("#page-overlay").hide();
    }
}

try {
    // Export all functions
    module.exports = {
        attachEventListeners,
        dbChangeHandler,
        getInputValues,
        showOverlay,
    };
} catch (error) {
    console.log(error);
}
