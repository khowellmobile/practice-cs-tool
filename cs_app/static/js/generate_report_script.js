// Initialize table and set intial table size
$(document).ready(function () {
    $("#time_range").on("change", function () {
        alterDates($("#time_range").val());
    });

    $("#start_date, #end_date").on("change", function () {
        $("#time_range").val("Custom");
    });

    $("#form").submit(function (event) {
        event.preventDefault();
    });
});

// Resize table when the window resizes
$(window).resize(function () {
    setTableSize("report");
});

// Function to organize table generation function calls
function generateTable() {
    var formdata = {
        time_range: $("#time_range").val(),
        start_date: $("#start_date").val(),
        end_date: $("#end_date").val(),
    };

    createTable(formdata);

    displayParameters(formdata);
}

// Shows user what the input parameters were
function displayParameters(formdata) {
    var res = "";
    for (var key in formdata) {
        res += `${formdata[key]}, `;
    }

    $("#report-card__parameters").text("Report Parameters: " + res.slice(0, -2));
}

// Populates the table through an ajax query
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

// Formats data from json response to datatables.net format
function formatData(data) {
    var res = [];

    data.forEach(function (item) {
        let name = item.department_name;
        let hours = parseFloat(item.total_hours);

        res.push([name, hours]);
    });

    return res;
}

// Intializes the table with input data
function initalizeTable(data) {
    if ($.fn.DataTable.isDataTable("#reportTable")) {
        $("#reportTable").DataTable().destroy(); // Destroy the existing DataTable instance
        $("#reportTable").remove(); // Remove the existing table
    }

    $("#report").append(
        '<table id="reportTable" class="stripe display"></table>'
    );

    $("#reportTable").DataTable({
        // Initialize DataTable
        columns: [{ title: "Name" }, { title: "Hours" }],
        data: data,
    });

    setTableSize("report");
}

// Sets table size just a tad smaller than its parent for responsiveness
function setTableSize(tableType) {
    let parentWidth = $("#" + tableType).width();
    let parentHeight = $("#" + tableType).height();

    let childWidth = parentWidth - parentWidth / 100;
    let childHeight = parentHeight - parentHeight / 10;

    $("#" + tableType + "Table").css("height", childHeight + "px");
    $("#" + tableType + "Table").css("width", childWidth + "px");
}

// Sets date input fields based upon selected select option
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

// Creates a table form report history
function createReportFromHistory(time_range, parameters_json) {
    let paramsJson = JSON.parse(parameters_json.replace(/'/g, '"'));

    formdata = {
        time_range: time_range,
        start_date: paramsJson.start_date,
        end_date: paramsJson.end_date,
    };

    createTable(formdata);

    displayParameters(formdata);
}
