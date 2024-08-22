/**
 * JavaScript file for handling dynamic UI interactions and AJAX requests for the generate_report.html page.
 *
 * This file includes functions to manage UI behavior such as toggling div sizes, altering date inputs based on
 * preset selections, generating and displaying tables from server data, and throttling function calls to optimize
 * performance. It utilizes jQuery for DOM manipulation and AJAX operations.
 *
 * Functions:
 * - toggleSize(e1Id, e2Id): Toggles the size of two div elements based on size classes.
 * - alterDates(range): Adjusts date inputs according to a predefined time range selection.
 * - generateTable(): Initiates the process of generating a table based on user input.
 * - createTable(formdata): Sends AJAX request to load table data based on provided form data.
 * - initializeTable(data): Renders a DataTable with formatted data and manages table height.
 * - createReportFromHistory(time_range, parameters_json): Generates a report using history buttons on page and updates UI elements.
 * - setTableHeight(): Sets the height of the report table dynamically based on its container.
 * - formatData(data): Formats raw data from the server into a format suitable for DataTables.
 * - throttle(func, delay): Creates a throttled version of a function to limit its invocation rate.
 *
 * Dependencies: Requires jQuery for DOM manipulation and AJAX operations.
 */

// Required for global jqeury recognition for use in testing
// CDN still included in html file
try {
    var jsdom = require("jsdom");
    $ = require("jquery")(new jsdom.JSDOM().window);
} catch (error) {
    console.log(error);
}

const throttledToggleSize = throttle(toggleSize, 500);
var activeTimeRange = "Custom";

/**
 * Shows dropdown menu on click
 */
$(".dropdown-button").on("click", function (event) {
    // Prevent the document click event from firing
    event.stopPropagation();
    $(this).siblings(".dropdown-content").toggle();
});

/**
 * Handles when dropdown option has been clicked
 */
$(".dropdown-item").on("click", function () {
    activeTimeRange = $(this).data("value");
    alterDates(activeTimeRange);
    $(".dropdown-button").text($(this).text());
    $(".dropdown-content").hide();
});

/**
 * Hides dropdown when user clicks outside of it
 *
 * Contained in try catch to allow testing of file
 */
try {
    $(document).on("click", function (event) {
        if (!$(event.target).closest(".dropdown").length) {
            $(".dropdown-content").hide();
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

/**
 * Calls throttledToggleSize() for history-menu and report-block on click
 * of expand-button
 */
$("#expand-button").on("click", function () {
    throttledToggleSize("history-menu", "report-block");
});

/**
 * Starts the process of generating a table from input data
 *
 * Calls createTable() after pulling input values
 */
function generateTable() {
    var formdata = {
        time_range: activeTimeRange,
        start_date: $("#start_date").val(),
        end_date: $("#end_date").val(),
    };

    createTable(formdata);
}

/**
 * Gets needed table information
 *
 * Uses ajax to send inputs to a view which will return report
 * information to be used to create a table
 *
 * Calls initalizeTable() to render table
 *
 * @param {string} formData - The input data used to create the report
 */
function createTable(formdata) {
    let url = "/load_table/";

    $.ajax({
        type: "POST",
        headers: { "X-CSRFToken": csrf_token }, // csrf_token gotten from js code in html template
        url: url,
        data: formdata,
        success: function (response) {
            initalizeTable(formatData(response.data));
        },
        error: function (xhr, errmsg, err) {
            alert("error");
        },
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
function initalizeTable(data) {
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
 * Creates a report from history
 *
 * Uses history button parameters to generate a previously created report
 *
 * Calls createTable() to create new table
 *
 * @param {string} time_range - The time range preset used for report
 * @param {string} parameters_json - The parameters used for report
 */
function createReportFromHistory(time_range, parameters_json) {
    let paramsJson = JSON.parse(parameters_json.replace(/'/g, '"'));

    formdata = {
        time_range: time_range,
        start_date: paramsJson.start_date,
        end_date: paramsJson.end_date,
    };

    createTable(formdata);

    activeTimeRange = time_range;
    $(".dropdown-button").text(time_range);
    $("#start_date").val(paramsJson.start_date);
    $("#end_date").val(paramsJson.end_date);
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
            start_date = `${year - 1}-01-01`;
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
            console.log("Unknown time range");
            break;
    }

    $("#start_date").val(start_date);
    $("#end_date").val(end_date);
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

/**
 * Toggles the size classes of two specified divs.
 *
 * This function manages the size toggling of two div elements identified
 * by their respective IDs, adjusting them between small and large sizes
 * based on their current state of classes.
 *
 * @param {string} e1Id - The ID of the first div element.
 * @param {string} e2Id - The ID of the second div element.
 */
function toggleSize(e1Id, e2Id) {
    let e1 = $("#" + e1Id);
    let e2 = $("#" + e2Id);

    e1.toggleClass("historySmall historyLarge");

    e2.toggleClass("reportLarge reportSmall");

    let e1Large = e1.hasClass("historyLarge");
    let e2Small = e2.hasClass("reportSmall");

    toggleClassDisplay(e1Large && e2Small);
}

/**
 * Toggles the display of .expandedInfo elements and .symbol elements
 *
 * If hideSymbols is true .expandedInfo items are shown and .symbol items are hidden
 * If hideSymbols is false .expandedInfo items are hidden and .symbol items are shown
 *
 * @param {boolean} hideSymbols - flag to indicate if symbols should be hidden
 */
function toggleClassDisplay(hideSymbols) {
    let c1 = $(".expanded-info");
    let c2 = $(".symbol");

    if (hideSymbols) {
        c1.css("display", "flex");
        c2.css("display", "none");
    } else {
        c1.css("display", "none");
        c2.css("display", "flex");
    }
}

/**
 * Creates a throttled version of a function that limits its use to once in a delay period.
 *
 * This function ensures a function can only get called once in a delay. If the function is
 * called again during the delay the function the function is not executed
 *
 * @param {Function} func - The function to be throttled.
 * @param {number} delay - The delay in milliseconds before allowing the function to be called again.
 * @returns {Function} A throttled version of the original function `func`.
 */
function throttle(func, delay) {
    let throttled = false;

    return function () {
        if (!throttled) {
            throttled = true;
            func.apply(this, arguments);
            setTimeout(() => {
                throttled = false;
            }, delay);
        }
    };
}

$("#history-menu__history-scroll button").each(function () {
    var symbol = $(this).find(".symbol");
    let symbolText = symbol.text().trim();

    switch (symbolText) {
        case "YTD":
            symbol.css("background-color", "#783de4");
            break;
        case "LY":
            symbol.css("background-color", "#b25aec");
            break;
        case "C":
            symbol.css("background-color", "#5784ff");
            break;
        case "AT":
            symbol.css("background-color", "#62d9e9");
            break;
        default:
            console.log("unknown symbol text");
    }
});

$(".report-kind").each(function () {
    var text = $(this).find("p").text();

    switch (text) {
        case "YTD":
            $(this).css("background-color", "#783de4");
            break;
        case "Last Year":
            $(this).css("background-color", "#b25aec");
            break;
        case "Custom":
            $(this).css("background-color", "#5784ff");
            break;
        case "All Time":
            $(this).css("background-color", "#62d9e9");
            break;
        default:
            console.log("unknown symbol text");
    }
});

try {
    // Export all functions
    module.exports = {
        generateTable,
        createTable,
        initalizeTable,
        createReportFromHistory,
        alterDates,
        setTableHeight,
        formatData,
        toggleSize,
        toggleClassDisplay,
        throttle,
    };
} catch (error) {
    console.log(error);
}
