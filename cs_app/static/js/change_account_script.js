// Toggles display of field change form
function toggleForm(fieldName) {
    $("#update_" + fieldName).toggle();
}

// Detects user change and submits to view for saving
function submitForm(fieldName) {
    $("#update_" + fieldName).hide();

    if (fieldName == "name") {
        var url = "/change_account/update_name/";
        var formdata = {
            first_name: $("#first_name").val(),
            last_name: $("#last_name").val(),
        };
    } else if (fieldName == "email") {
        var url = "/change_account/update_email/";
        var formdata = {
            email: $("#email").val(),
        };
    } else {
        var url = "/change_account/update_password/";
        var formdata = {
            password: $("#password").val(),
        };
    }

    $.ajax({
        type: "POST",
        headers: { "X-CSRFToken": csrf_token },
        url: url,
        data: formdata,
        success: function (response) {
            ajaxResponseSuccess(fieldName, formdata);
        },
        error: function (xhr, errmsg, err) {},
    });
}

// Shows new fieldInformation. Called on successful ajax call
function ajaxResponse(fieldName, formdata) {
    if (fieldName == "name") {
        $(`#${fieldName}_text`).text(
            "Name: " + formdata["first_name"] + " " + formdata["last_name"]
        );
    } else if (fieldName == "email") {
        $(`#${fieldName}_text`).text("Email: " + formdata["email"]);
    } else {
        $(`#${fieldName}_text`).text("New password set.");
    }
}