// Initialize table and set intial table size
$(document).ready(function () {
    setTableSize();

    $("#time_range").on("change", function () {
        alterDates($("#time_range").val());
    });

    $("#start_date, #end_date").on("change", function () {
        $("#time_range").val("custom");
    });
});

// Resize table when the window resizes
$(window).resize(function () {
    setTableSize();
});

// Shows user what the input parameters were
function submitParameters() {
    var formdata = {
        start_date: $("#start_date").val(),
        end_date: $("#end_date").val(),
        client_name: $("#client_name").val(),
    };

    populateTable(formdata);

    var res = "";
    for (var key in formdata) {
        res += `${formdata[key]}, `;
    }

    $("#report_params").text("Report Parameters: " + res.slice(0, -2));
}

// Populates the table through an ajax query
function populateTable(formdata) {
    let url = "/load_table/";

    $.ajax({
        type: "POST",
        headers: { "X-CSRFToken": csrf_token },
        url: url,
        data: formdata,
        success: function (response) {
            createTable(formatData(response.data));
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

// Creates the table with input data
function createTable(data) {
    new DataTable("#example", {
        columns: [{ title: "Name" }, { title: "Hours" }],
        data: data,
    });
}

// Sets table size just a tad smaller than its parent for responsiveness
function setTableSize() {
    let parentWidth = $(".reportBlock").width();
    let parentHeight = $(".reportBlock").height();

    let childWidth = parentWidth - parentWidth / 100;
    let childHeight = parentHeight - parentHeight / 10;

    console.log(parentHeight + " " + childHeight);
    console.log(parentWidth + " " + childWidth);

    $("#example").css("height", childHeight + "px");
    $("#example").css("width", childWidth + "px");
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
        case "ytd":
            start_date = `${year - 1}-01-01`;
            end_date = `${year}-${month}-${day}`;
            $("#start_date").val(start_date);
            $("#end_date").val(end_date);
            break;
        case "last_year":
            start_date = `${year - 1}-01-01`;
            end_date = `${year - 1}-12-31`;
            $("#start_date").val(start_date);
            $("#end_date").val(end_date);
            break;
        case "all_time":
            start_date = "1000-01-01";
            end_date = `${year}-${month}-${day}`;
            $("#start_date").val(start_date);
            $("#end_date").val(end_date);
            break;
        default:
            console.log("4");
            break;
    }
}
