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
            alert(response.success);
        },
        error: function (xhr, errmsg, err) {
            alert("error");
        },
    });
}
