/**
 * JavaScript file for handling database configuration changes and AJAX interactions for the change_database.html page.
 *
 * This file contains functions to gather new database configuration, submit it via AJAX,
 * handle the response from the server, retrieve current database information, and manage
 * the visibility of a spinner during AJAX requests.
 *
 * Functions:
 * - getNewConfig(): Gathers input values for database configuration fields, validates them,
 *                  and submits them for processing.
 * - submitNewConfig(db_info): Submits the new database configuration data via AJAX to the server.
 * - dbChangeHandler(success, message): Handles the server response for database configuration changes,
 *                                      updating UI elements accordingly.
 * - getDisplayDBInfo(alias): Retrieves current database information via AJAX based on the alias provided.
 * - setSpinnerVisibility(spinnerVisible): Controls the visibility of a spinner element based on the
 *                                        spinnerVisible parameter.
 *
 * Dependencies: Requires jQuery for DOM manipulation and AJAX operations.
 */

/**
 * Gathers input values for database configuration fields, validates them,
 * and initiates the process to submit the new configuration.
 */
function getNewConfig() {
    let engine = $("#input_engine").val().trim();
    let name = $("#input_name").val().trim();
    let host = $("#input_host").val().trim();
    let driver = $("#input_driver").val().trim();
    let user = $("#input_user").val().trim();
    let pass = $("#input_password").val().trim();

    if ((engine == "") | (name == "") | (host == "") | (driver == "")) {
        alert("Please fill out engine, name, host, and driver");
    } else {
        let db_info = {
            db_engine: engine,
            db_name: name,
            db_host: host,
            db_driver: driver,
            db_user: user,
            db_pass: pass,
        };

        // Will stop users from spamming connections while connection is loading
        if ($(".spinner").css("visibility") == "visible") {
            return;
        }

        setSpinnerVisibility(true);

        submitNewConfig(db_info);
    }
}

/**
 * Submits the new database configuration data to the server via AJAX.
 *
 * @param {Object} db_info - The object containing the database configuration information.
 */
function submitNewConfig(db_info) {
    let url = "/switch_config/";

    $.ajax({
        type: "POST",
        headers: { "X-CSRFToken": csrf_token }, // csrf_token gotten from js code in html template
        url: url,
        data: db_info,
        success: function (response) {
            dbChangeHandler(true, response);
        },
        error: function (xhr) {
            dbChangeHandler(false, xhr);
        },
    });
}

/**
 * Handles the server response for database configuration changes.
 * Updates UI elements based on whether the operation was successful or not.
 *
 * @param {boolean} success - Indicates if the database configuration change was successful.
 * @param {Object} message - The response message or error object returned from the server.
 */
function dbChangeHandler(success, message) {
    setSpinnerVisibility(false);

    if (success) {
        $("#database-change__status").append(
            "<p class='stat__message'>Successful Connection</p>"
        );
        getDisplayDBInfo(message.db_alias);
    } else {
        if (message.responseJSON) {
            $("#database-change__status").append(
                `<p class='stat__message'> Error: ${message.responseJSON.error}</p>`
            );
        } else {
            alert(
                "An error occurred while processing your request. Please try again."
            );
        }
    }
}

/**
 * Retrieves current database information via AJAX based on the alias provided.
 *
 * @param {string} alias - The alias or identifier for the database to retrieve information for.
 */
function getDisplayDBInfo(alias) {
    let url = "/get_db_info/";

    $.ajax({
        type: "GET",
        headers: { "X-CSRFToken": csrf_token }, // csrf_token gotten from js code in html template
        url: url,
        data: { db_alias: alias },
        success: function (response) {
            $("#curr_engine").text(response["db_engine"]);
            $("#curr_name").text(response["db_name"]);
            $("#curr_host").text(response["db_host"]);
        },
        error: function (xhr) {
            alert("Error");
        },
    });
}

/**
 * Controls the visibility of a spinner element on the page.
 *
 * @param {boolean} spinnerVisible - Indicates whether the spinner should be visible (true) or hidden (false).
 */
function setSpinnerVisibility(spinnerVisible) {
    if (spinnerVisible) {
        $(".spinner").css("visibility", "visible");
    } else {
        $(".spinner").css("visibility", "hidden");
    }
}

// Export for testing using jest and jsdom
module.exports = { setSpinnerVisibility };
