function submitParameters() {
    var formdata = {
        'start_date' : $("#start_date").val(),
        'end_date' : $("#end_date").val(),
        'client_name' : $("#client_name").val(),
        'sorting_option' : $("#sorting_option").val(),
    }

    var res = "";
    for (var key in formdata) {
        res += `${formdata[key]} ,`;
    }

    $("#report_params").text("Report Parameters: " + res.slice(0, -2))
}