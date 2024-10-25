/**
 * JavaScript file for handling dynamic UI interactions and fetch requests for the generate_report.html page.
 *
 * This file includes functions to manage UI behavior such as altering date inputs based on
 * preset selections, generating and displaying tables from server data, and throttling function calls to optimize
 * performance. It utilizes jQuery for DOM manipulation and fetch operations.
 *
 * Functions:
 * - alterDates(range): Adjusts date inputs according to a predefined time range selection.
 * - generateTable(): Initiates the process of generating a table based on user input.
 * - createTable(formdata): Sends fetch request to load table data based on provided form data.
 * - initializeTable(data): Renders a DataTable with formatted data and manages table height.
 * - setTableHeight(): Sets the height of the report table dynamically based on its container.
 * - formatData(data): Formats raw data from the server into a format suitable for DataTables.
 *
 * Dependencies: Requires jQuery for DOM manipulation and fetch operations.
 */

// Required for global jqeury recognition for use in testing
// CDN still included in html file
try {
    var jsdom = require("jsdom");
    $ = require("jquery")(new jsdom.JSDOM().window);
} catch (error) {
    console.log(error);
}

// Global variable to disallow spamming same report type
var currentReportParameters = "";

attachEventListeners();

function attachEventListeners() {
    /**
     * Shows dropdown menu on click
     */
    $(".dropdown-button").on("click", function (event) {
        // Prevent the document click event from firing
        event.stopPropagation();
        $(".dropdown-content").css("visibility", "visible");
    });

    /**
     * Handles when dropdown option has been clicked
     */
    $(".dropdown-item").on("click", function () {
        activeTimeRange = $(this).data("value");
        alterDates(activeTimeRange);
        $(".dropdown-button").text($(this).text());
        $(".dropdown-content").css("visibility", "hidden");
    });

    /**
     * Hides dropdown when user clicks outside of it
     *
     * Contained in try catch to allow testing of file
     */
    try {
        $(document).on("click", function (event) {
            if (!$(event.target).closest(".dropdown").length) {
                $(".dropdown-content").css("visibility", "hidden");
            }
        });
    } catch (error) {}

    /**
     * Sets value of time range preset to "Custom" when dates are manually input
     */
    $("#start_date, #end_date").on("change", function () {
        $(".dropdown-button").text("Custom");
        activeTimeRange = "Custom";
    });

    /**
     * Calls setTableHeight() when window is resized
     *
     * Contained in try catch to allow testing of file
     */
    try {
        $(window).on("resize", function () {
            setTableHeight();
        });
    } catch (error) {}
}

/**
 * Sets date inputs to proper range
 *
 * This function handles calculating and displaying time
 * range presets
 *
 * @param {string} range - The wanted time range preset
 */
function alterDates(range) {
    var start_date, end_date;

    let currentDate = new Date();
    let day = currentDate.getDate();
    let month = currentDate.getMonth() + 1;
    let year = currentDate.getFullYear();

    day = day < 10 ? `0${day}` : day;
    month = month < 10 ? `0${month}` : month;

    switch (range) {
        case "YTD":
            start_date = `${year}-01-01`;
            end_date = `${year}-${month}-${day}`;
            break;
        case "Last Year":
            start_date = `${year - 1}-01-01`;
            end_date = `${year - 1}-12-31`;
            break;
        case "All Time":
            start_date = "1000-01-01";
            end_date = `${year}-${month}-${day}`;
            break;
        case "Custom":
            break;
        default:
            console.warn("Unknown time range");
            break;
    }

    $("#start_date").val(start_date);
    $("#end_date").val(end_date);
}

/**
 * Starts the process of generating a table from input data
 *
 * Calls createTable() after pulling input values
 */
function generateTable() {
    var formdata = {
        time_range: $(".dropdown-button").text(),
        start_date: $("#start_date").val(),
        end_date: $("#end_date").val(),
    };

    if (formdata["start_date"] == "" || formdata["end_date"] == "") {
        alert("Please fill out starting and ending dates");
        return
    }

    if (formdata !== currentReportParameters) {
        createTable(formdata);
    }
}

/**
 * Gets needed table information
 *
 * Uses fetch to send inputs to a view which will return report
 * information to be used to create a table
 *
 * Calls initializeTable () to render table
 *
 * @param {string} formData - The input data used to create the report
 */
function createTable(formdata) {
    fetch("/load_table/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrf_token,
        },
        body: JSON.stringify(formdata),
    })
        .then((response) => {
            if (!response.ok) {
                alert("error");
            }
            return response.json();
        })
        .then((response) => {
            initializeTable(formatData(response.data));
        });
}

/**
 * Initializes and renders data table to display report information
 *
 * Destroys old table, adds new html for new table, and initializes new table
 *
 * Calls setTableHeight() to set proper table height
 *
 * @param {string} data - Formatted input data for new data table
 */
function initializeTable(data) {
    if ($.fn.DataTable.isDataTable("#reportTable")) {
        $("#reportTable").DataTable().destroy(); // Destroy the existing DataTable instance
        $("#reportTable").remove(); // Remove the existing table
    }

    $("#report").append('<table id="reportTable" class="display" style="width:100%;"></table>');

    $("#reportTable").DataTable({
        // Initialize DataTable
        columns: [{ title: "Name" }, { title: "Hours" }],
        data: data,
    });

    setTableHeight();
}

/**
 * Sets table height to proper height
 *
 * This function handles calculating and setting the height for a
 * newly generated table
 */
function setTableHeight() {
    let table = $("#reportTable");
    let parentHeight = $("#report").height();

    let childHeight = parentHeight - parentHeight / 7;

    table.css("height", childHeight + "px");
}

/**
 * Sets date inputs to proper range
 *
 * This function takes data returned from the database and
 * formats it to be able to be used for a DataTables.net table
 *
 * @param {string} data - The data to be formatted
 * @return {string} - The formatted data
 */
function formatData(data) {
    var res = [];

    data.forEach(function (item) {
        let name = item.department_name;
        let hours = parseFloat(item.total_hours);

        res.push([name, hours]);
    });

    return res;
}
