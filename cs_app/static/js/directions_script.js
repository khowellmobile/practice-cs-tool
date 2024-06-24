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

    toggleSlideHandler(e);
});

function toggleSlideHandler(tab) {
    switch (tab.attr("id")) {
        case "t1":
            toggleOverviewSlides();
            break;
        case "t2":
            toggleOverviewSlides();
            break;
        case "t3":
            toggleOverviewSlides();
            break;
        case "t4":
            toggleOverviewSlides();
            break;
        default:
            console.log("unknown tab");
    }
}

function toggleOverviewSlides() {
    let e1 = $("#d1-2-1");
    let e2 = $("#d1-2-2");
    let e3 = $("#d1-2-3");

    if (e1.hasClass("up")) {
        setTimeout(() => {
            e1.removeClass("up");
        }, 150);
        setTimeout(() => {
            e2.removeClass("down");
        }, 300);
        setTimeout(() => {
            e3.removeClass("up");
        }, 450);
        setTimeout(() => {
            e1.css("background-color", "lightgreen");
            e2.css("background-color", "lightgreen");
            e3.css("background-color", "lightgreen");
        }, 1200);
    } else {
        e1.css("background-color", "red");
        e2.css("background-color", "red");
        e3.css("background-color", "red");
        setTimeout(() => {
            e1.addClass("up");
        }, 150);
        setTimeout(() => {
            e2.addClass("down");
        }, 300);
        setTimeout(() => {
            e3.addClass("up");
        }, 450);
    }
}
