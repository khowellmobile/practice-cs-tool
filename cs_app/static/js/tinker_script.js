const throttledToggleSize = throttle(toggleSize, 500);

// Changes the size of #c1 and #c2 to allow of an expanding history div
function toggleSize(eId, smallPercent, largePercent) {
    let delta = 10;
    let e = $("#" + eId);
    let e2 = $("#c2");

    let pWidth = $("#content").width();
    let cWidth = e.width();

    let lSize = (largePercent / 100) * pWidth;

    if (cWidth <= lSize - delta) {
        e.css("width", largePercent + "%");
        e2.css("width", "80%");
        toggleSizeButton(true);
    } else {
        e.css("width", smallPercent + "%");
        e2.css("width", "97%");
        toggleSizeButton(false);
    }
}

function toggleSizeButton(goingBig) {
    let c1 = $(".expandedInfo");
    let c2 = $(".symbol");

    if (goingBig) {
        c1.css("display", "flex");
        c2.css("display", "none");
    } else {
        c1.css("display", "none");
        c2.css("display", "flex");
    }
}

// Throttle function to avoid user spamming calls
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

// Function to organize table generation function calls
function generateTable() {
    var formdata = {
        time_range: $("#time_range").val(),
        start_date: $("#start_date").val(),
        end_date: $("#end_date").val(),
    };

    createTable(formdata);
}

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
}

