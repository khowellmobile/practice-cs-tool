function toggleForm(fieldName) {
  $("#update_" + fieldName).toggle();
}

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
      console.log(response);
      ajaxResponse(fieldName, formdata);
    },
    error: function (xhr, errmsg, err) {},
  });
}

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
