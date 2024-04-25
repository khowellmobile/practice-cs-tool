$(document).ready(function () {
    let table = $("#example").DataTable({
        "bAutoWidth": false
    })

    setTableSize();
});

function submitParameters() {
    var formdata = {
        start_date: $("#start_date").val(),
        end_date: $("#end_date").val(),
        client_name: $("#client_name").val(),
        sorting_option: $("#sorting_option").val(),
    };

    var res = "";
    for (var key in formdata) {
        res += `${formdata[key]} ,`;
    }

    $("#report_params").text("Report Parameters: " + res.slice(0, -2));
}

function setTableSize() {
    let parentWidth = $(".reportBlock").width()
    let parentHeight = $(".reportBlock").height()

    let childWidth = parentWidth - (parentWidth / 100)
    let childHeight = parentHeight - (parentHeight / 10)

    console.log(parentHeight + " " + childHeight);
    console.log(parentWidth + " " + childWidth);

    $("#example").css("height", childHeight + "px")
    $("#example").css("width", childWidth + "px")
}
