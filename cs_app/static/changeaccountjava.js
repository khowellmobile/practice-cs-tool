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

function submitForm() {
    var formdata = {
        'identifier' : $("#email").val(),
        'first_name' : $("#first_name").val(),
        'last_name' : $("#last_name").val(),
    }

    $.ajax({
        type: "POST",
        headers: {'X-CSRFToken': csrf_token},
        url: "/update_name/",
        data: formdata,
        success: function(response) {
            console.log(response);
        },
        error: function(xhr, errmsg, err) {
            
        }
    });
}