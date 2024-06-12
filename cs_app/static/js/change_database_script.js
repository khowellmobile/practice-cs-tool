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

        // Will stop users from spamming conncections while connection is loading
        if ($(".spinner").css("visibility") == "visible") {
            return;
        }

        setSpinnerVisibility(true);

        submitNewConfig(db_info);
    }
}

function submitNewConfig(db_info) {
    let url = "/switch_config/";

    $.ajax({
        type: "POST",
        headers: { "X-CSRFToken": csrf_token },
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

function dbChangeHandler(success, message) {
    setSpinnerVisibility(false);

    if (success) {
        $("#database-change__status").append(
            "<p class='stat__message'>Successful Connection</p>"
        );
        getDBInfoFromAlias(message.db_alias);
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

function getDisplayDBInfo(alias) {
    let url = "/get_db_info/";

    $.ajax({
        type: "GET",
        headers: { "X-CSRFToken": csrf_token },
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

function setSpinnerVisibility(spinnerVisible) {
    if (spinnerVisible) {
        $(".spinner").css("visibility", "visible");
    } else {
        $(".spinner").css("visibility", "hidden");
    }
}

module.exports = { setSpinnerVisibility };
