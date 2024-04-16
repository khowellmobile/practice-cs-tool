function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function showForm(fieldName) {
    $("#update_" + fieldName).show();
}

function submitForm(fieldName) {
    $("#update_" + fieldName).hide();

    if (fieldName == 'name') {
        var url = "/update_name/"
        var formdata = {
            'first_name' : $("#first_name").val(),
            'last_name' : $("#last_name").val(),
        }
    }

    $.ajax({
        type: "POST",
        headers: {'X-CSRFToken': csrf_token},
        url: url,
        data: formdata,
        success: function(response) {
            console.log(response);
            $('#first_name_last_name').text("Name: " + formdata['first_name'] + " " + formdata['last_name'])
        },
        error: function(xhr, errmsg, err) {
            
        }
    });
}