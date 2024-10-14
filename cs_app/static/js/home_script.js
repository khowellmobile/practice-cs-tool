$(".report-kind").each(function () {
    var text = $(this).find("span").find("b").text().trim();

    switch (text) {
        case "YTD":
            $(this).css("background-color", "#783de4");
            $(this).siblings(".report-date").css("background-color", "#9e6fe4");
            break;
        case "LY":
            $(this).css("background-color", "#b25aec");
            $(this).siblings(".report-date").css("background-color", "#d1a9ec");
            break;
        case "C":
            $(this).css("background-color", "#5784ff");
            $(this).siblings(".report-date").css("background-color", "#8aaaff");
            break;
        case "AT":
            $(this).css("background-color", "#62d9e9");
            $(this).siblings(".report-date").css("background-color", "#9be1ec");
            break;
        default:
            console.log("unknown symbol text");
    }
});
