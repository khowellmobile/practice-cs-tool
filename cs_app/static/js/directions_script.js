$(".tab").on("click", function () {
    let e = $(this);
    let tabId = e.attr("id");

    $(".tab").each(function (index, element) {
        if ($(element).attr("id") === tabId) {
            $(element).removeClass("inactive"); 
            $(element).addClass("active");
        } else {
            $(element).removeClass("active");
            $(element).addClass("inactive");
        }
    });
});
