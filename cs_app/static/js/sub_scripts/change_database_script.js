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

    $("#db-history__listing > div").on("click", function () {
        $("#input_engine").val($(this).find(".past-engine").text());
        $("#input_name").val($(this).find(".past-name").text());
        $("#input_host").val($(this).find(".past-host").text());
        $("#input_driver").val($(this).find(".past-driver").text());
        $("#input_port").val($(this).find(".past-port").text());
    });

    // Setting current screen name in nav bar
    $("#current-screen-name").text("Change Database");
}

/**
 * Gathers input values for database configuration fields, validates them,
 * and initiates the process to submit the new configuration.
 */
function createNewConfig() {
    db_info = getInputValues();

    if ((db_info["db_engine"] == "") | (db_info["db_name"] == "") | (db_info["db_host"] == "")) {
        alert("Please fill out engine, name, and host");
        return;
    }

    msg = validateDbConfig(db_info);

    if (msg) {
        $("#database-change__status").append(`<p class='stat__message'>Error: ${msg}</p>`);
        return;
    } else {
        $("#database-change__status").append(`<p class='stat__message'>Field formats valid.</p>`);
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
        $(".database-info").eq(0).html(`<strong>Database Engine:</strong> ${message.db_engine}`);
        $(".database-info").eq(1).html(`<strong>Database Name:</strong> ${message.db_name}`);
        $(".database-info").eq(2).html(`<strong>Database Host:</strong> ${message.db_host}`);
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
 * Formats these into an object used in creating the new database configuration.
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
 * Validates the database configuration and displays errors if validation fails.
 *
 * @param {string} db_engine - The database engine (e.g., 'postgresql', 'mssql').
 * @param {string} db_name - The name of the database.
 * @param {string} db_host - The hostname or IP address of the database server.
 * @param {string} db_driver - The database driver (e.g., 'psycopg2', 'pymysql').
 * @param {string} db_port - The database port.
 */
function validateDbConfig({ db_engine, db_name, db_host, db_driver, db_port }) {
    let errorMessage = "";

    if (!validateDbEngine(db_engine)) {
        errorMessage = "Engine name invalid.";
    } else if (!validateDbName(db_name)) {
        errorMessage = "Database name invalid. Alphanumerics only.";
    } else if (!validateDbHost(db_host)) {
        errorMessage = "Database host invalid";
    } else if (!validateDbDriver(db_driver)) {
        errorMessage = "Database driver invalid. Alphanumerics only.";
    } else if (db_port && !validateDbPort(db_port)) {
        errorMessage = "Database port invalid. Numbers must be between 1024 and 65535.";
    }

    return errorMessage;
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

/**
 * Validates the database engine field.
 *
 * Database Engine Options:
 * - Acceptable values: 'postgresql' and 'mssql'.
 *
 * @param {string} db_engine - The database engine (e.g., 'postgresql', 'mssql').
 * @returns {boolean} - True if the engine is valid, False otherwise.
 */
function validateDbEngine(db_engine) {
    const dbEnginePattern = /(postgresql|mssql)/i;
    return dbEnginePattern.test(db_engine);
}

/**
 * Validates the database name field.
 *
 * Database Name Format:
 * - Only alphanumeric characters and underscores are allowed.
 *
 * @param {string} db_name - The name of the database.
 * @returns {boolean} - True if the database name is valid, False otherwise.
 */
function validateDbName(db_name) {
    const dbNamePattern = /^[a-zA-Z0-9_]+$/;
    return dbNamePattern.test(db_name);
}

/**
 * Validates the database host field.
 *
 * Database Host Format:
 * - Can be 'localhost', a valid domain name (e.g., 'example.com'), or an IPv4 address (e.g., '192.168.1.1').
 *
 * @param {string} db_host - The hostname or IP address of the database server.
 * @returns {boolean} - True if the host is valid, False otherwise.
 */
function validateDbHost(db_host) {
    const dbHostPattern =
        /^(localhost|([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}|(\d{1,3}\.){3}\d{1,3}|[a-zA-Z0-9-]+(\[[a-zA-Z0-9-]+\])?)(\\[a-zA-Z0-9-]+)?$/;
    return dbHostPattern.test(db_host);
}

/**
 * Validates the database driver field.
 *
 * Database Driver Format:
 * - Can include alphanumeric characters, underscores, and spaces.
 *
 * @param {string} db_driver - The database driver (e.g., 'psycopg2', 'pymysql').
 * @returns {boolean} - True if the driver is valid, False otherwise.
 */
function validateDbDriver(db_driver) {
    const dbDriverPattern = /^[a-zA-Z0-9_ ]+$/;
    return dbDriverPattern.test(db_driver);
}

/**
 * Validates the port number field.
 *
 * Port Number Format:
 * - Must be an integer between 0 and 65535.
 *
 * @param {string|number} port - The port number (e.g., 5432, 80).
 * @returns {boolean} - True if the port number is valid, False otherwise.
 */
function validateDbPort(port) {
    const portNumber = parseInt(port, 10);
    return Number.isInteger(portNumber) && portNumber >= 1024 && portNumber <= 65535;
}

try {
    // Export all functions
    module.exports = {
        attachEventListeners,
        dbChangeHandler,
        getInputValues,
        showOverlay,
        validateDbConfig,
        validateDbEngine,
        validateDbName,
        validateDbHost,
        validateDbDriver,
        validateDbPort,
    };
} catch (error) {
    console.log(error);
}
