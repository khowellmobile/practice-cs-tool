/**
 * JavaScript file for handling database configuration changes and fetch interactions for the change_database.html page.
 *
 * This file contains functions to gather new database configuration, submit it via fetch,
 * handle the response from the server, retrieve current database information, and manage
 * the visibility of a spinner during fetch requests.
 *
 * Functions:
 * - getNewConfig(): Gathers input values for database configuration fields, validates them,
 *                  and submits them for processing.
 * - submitNewConfig(db_info): Submits the new database configuration data via fetch to the server.
 * - dbChangeHandler(success, message): Handles the server response for database configuration changes,
 *                                      updating UI elements accordingly.
 * - getDisplayDBInfo(alias): Retrieves current database information via fetch based on the alias provided.
 * - setSpinnerVisibility(spinnerVisible): Controls the visibility of a spinner element based on the
 *                                        spinnerVisible parameter.
 *
 * Dependencies: Requires jQuery for DOM manipulation and fetch operations.
 */

/**
 * Gathers input values for database configuration fields, validates them,
 * and initiates the process to submit the new configuration.
 */
function getNewConfig() {
    // Will stop users from spamming connections while connection is loading
    if ($(".spinner").css("visibility") == "visible") {
        return;
    }

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

    setSpinnerVisibility(true);

    submitNewConfig(db_info);
}

/**
 * Submits the new database configuration data to the server via fetch.
 *
 * @param {Object} db_info - The object containing the database configuration information.
 */
function submitNewConfig(db_info) {
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
            dbChangeHandler(true, data, getDisplayDBInfo);
        })
        .catch((error) => {
            dbChangeHandler(false, error, getDisplayDBInfo);
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
function dbChangeHandler(success, message, getDisplayDBInfo) {
    setSpinnerVisibility(false);

    console.log(message.error);

    if (success) {
        $("#database-change__status").append("<p class='stat__message'>Successful Connection</p>");
        getDisplayDBInfo(message.db_alias);
    } else if (message.error) {
        // captures a failure but one that includes a json response
        $("#database-change__status").append(`<p class='stat__message'>Error: ${message.error}</p>`);
    } else {
        // captures a failure due to non-view related circumstances
        alert("An error occurred while processing your request. Please try again.");
    }
}

/**
 * Retrieves current database information via fetch based on the alias provided.
 *
 * @param {string} alias - The alias or identifier for the database to retrieve information for.
 */
function getDisplayDBInfo(alias) {
    fetch(`/get_db_info/?db_alias=${encodeURIComponent(alias)}`, {
        method: "GET",
        headers: {
            "Content-type": "application/json",
            "X-CSRFToken": csrf_token,
        },
    })
        .then((response) => {
            if (!response.ok) {
                return response.json().then((errorData) => {
                    alert(errorData.error);
                });
            }
            return response.json();
        })
        .then((response) => {
            $("#curr_engine").text(response["db_engine"]);
            $("#curr_name").text(response["db_name"]);
            $("#curr_host").text(response["db_host"]);
        })
        .catch((error) => {
            alert("Error: " + error.message);
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

/**
 * Gathers input values of all inputs in the form on the change database page.
 * Formats these into an object used in creating the new databse configuration.
 *
 * @return {Object} - Object that contains the information from the form inputs
 */
function getInputValues() {
    var db_info = {};
    $("#database-change__form")
        .find("input")
        .each(function () {
            id = $(this).attr("id").slice(6);
            db_info[`db_${id}`] = $(this).val().trim();
        });

    return db_info;
}

// Export for testing using jest and jsdom
module.exports = { setSpinnerVisibility, dbChangeHandler, getInputValues };
