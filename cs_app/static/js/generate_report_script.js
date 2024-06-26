const throttledToggleSize = throttle(toggleSize, 500);

/**
 * Changes value of date inputs when a time range preset is selected
 *
 * This function calls alterDates() with the current time range value
 */
$("#time_range").on("change", function () {
    alterDates($("#time_range").val());
});

/**
 * Sets value of time range preset to "Custom" when dates are manually input
 */
$("#start_date, #end_date").on("change", function () {
    $("#time_range").val("Custom");
});

/**
 * Calls setTableHeight() when window is resized
 */
$(window).on("resize", function () {
    setTableHeight();
});

/**
 * Starts the process of generating a table from input data
 *
 * Calls createTable() after pulling input values
 */
function generateTable() {
    var formdata = {
        time_range: $("#time_range").val(),
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
        headers: { "X-CSRFToken": csrf_token },
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

    $("#report").append(
        '<table id="reportTable" class="display" style="width:100%;"></table>'
    );

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

    $("#time_range").val(time_range);
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
            $("#start_date").val(start_date);
            $("#end_date").val(end_date);
            break;
        case "Last Year":
            start_date = `${year - 1}-01-01`;
            end_date = `${year - 1}-12-31`;
            $("#start_date").val(start_date);
            $("#end_date").val(end_date);
            break;
        case "All Time":
            start_date = "1000-01-01";
            end_date = `${year}-${month}-${day}`;
            $("#start_date").val(start_date);
            $("#end_date").val(end_date);
            break;
        default:
            console.log("error");
            break;
    }
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
 * Toggles the size of 2 divs
 *
 * Handles the resizing of 2 divs. e1 being toggled between small and large
 * percent values and e2 being sized between 80% and 97%;
 *
 * @param {string} e1Id - id of the first div to be sized
 * @param {string} e2Id - id of the second div to be sized
 * @param {string} smallPercent - The number in percent for the small size
 * @param {string} largePercent - The number in percent for the large size
 */
function toggleSize(e1Id, e2Id, smallPercent, largePercent) {
    let delta = 10;
    let e1 = $("#" + e1Id);
    let e2 = $("#" + e2Id);

    let pWidth = $("#content").width();
    let cWidth = e1.width();

    let lSize = (largePercent / 100) * pWidth;

    if (cWidth <= lSize - delta) {
        e1.css("width", largePercent + "%");
        e2.css("width", "80%");
        toggleClassDisplay(true);
    } else {
        e1.css("width", smallPercent + "%");
        e2.css("width", "97%");
        toggleClassDisplay(false);
    }
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
