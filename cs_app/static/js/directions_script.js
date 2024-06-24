var currentActiveId = "t1";
var lockTabs = false;

$(".tab").on("click", function () {
    if (!lockTabs) {
        lockTabs = true;
        setTimeout(() => {
            lockTabs = false;
        }, 2400);

        hideActive();

        let e = $(this);
        let tabId = e.attr("id");
        currentActiveId = tabId;

        $(".tab").each(function (index, element) {
            if ($(element).attr("id") === tabId) {
                $(element).removeClass("inactive");
                $(element).addClass("active");
            } else {
                $(element).removeClass("active");
                $(element).addClass("inactive");
            }
        });
        showNewActive();
    } else {
        console.log("locked");
    }
});

function hideActive() {
    switch (currentActiveId) {
        case "t1":
            hideOverviewSlides();
            break;
        case "t2":
            hideGenRepSlides();
            break;
        case "t3":
            hideChangeDBSlides();
            break;
        case "t4":
            toggleOverviewSlides();
            break;
        default:
            console.log("unknown tab");
    }
}

function showNewActive() {
    switch (currentActiveId) {
        case "t1":
            setTimeout(() => {
                showOverviewSlides();
            }, 1200);
            break;
        case "t2":
            setTimeout(() => {
                showGenRepSlides();
            }, 1200);
            break;
        case "t3":
            setTimeout(() => {
                showChangeDBSlides();
            }, 1200);
            break;
        default:
            console.log("unknown tab");
    }
}

function hideOverviewSlides() {
    let e1 = $("#d1-2-1");
    let e2 = $("#d1-2-2");
    let e3 = $("#d1-2-3");
    setTimeout(() => {
        e1.addClass("up");
    }, 150);
    setTimeout(() => {
        e2.addClass("down");
    }, 300);
    setTimeout(() => {
        e3.addClass("up");
    }, 450);
    setTimeout(() => {
        e1.css("display", "none");
        e2.css("display", "none");
        e3.css("display", "none");
    }, 1200);
}

function showOverviewSlides() {
    let e1 = $("#d1-2-1");
    let e2 = $("#d1-2-2");
    let e3 = $("#d1-2-3");
    e1.css("display", "flex");
    e2.css("display", "flex");
    e3.css("display", "flex");

    setTimeout(() => {
        e1.removeClass("up");
    }, 150);
    setTimeout(() => {
        e2.removeClass("down");
    }, 300);
    setTimeout(() => {
        e3.removeClass("up");
    }, 450);
}

function hideGenRepSlides() {
    let e1 = $("#d1-2-4");
    let e2 = $("#d1-2-5");
    setTimeout(() => {
        e1.addClass("up");
    }, 150);
    setTimeout(() => {
        e2.addClass("down");
    }, 300);
    setTimeout(() => {
        e1.css("display", "none");
        e2.css("display", "none");
    }, 1200);
}

function showGenRepSlides() {
    let e1 = $("#d1-2-4");
    let e2 = $("#d1-2-5");
    e1.css("display", "flex");
    e2.css("display", "flex");
    setTimeout(() => {
        e1.removeClass("up");
    }, 150);
    setTimeout(() => {
        e2.removeClass("down");
    }, 300);
}

function hideChangeDBSlides() {
    let e1 = $("#d1-2-6");
    let e2 = $("#d1-2-7");
    let e3 = $("#d1-2-8");
    setTimeout(() => {
        e1.addClass("down");
    }, 150);
    setTimeout(() => {
        e2.addClass("up");
    }, 300);
    setTimeout(() => {
        e3.addClass("down");
    }, 450);
    setTimeout(() => {
        e1.css("display", "none");
        e2.css("display", "none");
        e3.css("display", "none");
    }, 1200);
}

function showChangeDBSlides() {
    let e1 = $("#d1-2-6");
    let e2 = $("#d1-2-7");
    let e3 = $("#d1-2-8");
    e1.css("display", "flex");
    e2.css("display", "flex");
    e3.css("display", "flex");

    setTimeout(() => {
        e1.removeClass("down");
    }, 150);
    setTimeout(() => {
        e2.removeClass("up");
    }, 300);
    setTimeout(() => {
        e3.removeClass("down");
    }, 450);
}
