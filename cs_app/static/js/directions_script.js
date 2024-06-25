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
            hideTripleSlides("t1");
            break;
        case "t2":
            hideDoubleSlides("t2");
            break;
        case "t3":
            hideTripleSlides("t3");
            break;
        case "t4":
            hideDoubleSlides("t4");
            break;
        default:
            console.log("unknown tab");
    }
}

function showNewActive() {
    switch (currentActiveId) {
        case "t1":
            setTimeout(() => {
                showTripleSlides("t1");
            }, 1200);
            break;
        case "t2":
            setTimeout(() => {
                showDoubleSlides("t2");
            }, 1200);
            break;
        case "t3":
            setTimeout(() => {
                showTripleSlides("t3");
            }, 1200);
            break;
        case "t4":
            setTimeout(() => {
                showDoubleSlides("t4");
            }, 1200);
        default:
            console.log("unknown tab");
    }
}

function hideTripleSlides(tabId) {
    let e1, e2, e3;
    if (tabId === "t1") {
        e1 = $("#d1-2-1");
        e2 = $("#d1-2-2");
        e3 = $("#d1-2-3");
    } else {
        e1 = $("#d1-2-6");
        e2 = $("#d1-2-7");
        e3 = $("#d1-2-8");
    }

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

function showTripleSlides(tabId) {
    let e1, e2, e3;
    if (tabId === "t1") {
        e1 = $("#d1-2-1");
        e2 = $("#d1-2-2");
        e3 = $("#d1-2-3");
    } else {
        e1 = $("#d1-2-6");
        e2 = $("#d1-2-7");
        e3 = $("#d1-2-8");
    }

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

function hideDoubleSlides(tabId) {
    let e1, e2;
    if (tabId === "t2") {
        e1 = $("#d1-2-4");
        e2 = $("#d1-2-5");
    } else {
        e1 = $("#d1-2-9");
        e2 = $("#d1-2-10");
    }

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

function showDoubleSlides(tabId) {
    let e1, e2;
    if (tabId === "t2") {
        e1 = $("#d1-2-4");
        e2 = $("#d1-2-5");
    } else {
        e1 = $("#d1-2-9");
        e2 = $("#d1-2-10");
    }

    e1.css("display", "flex");
    e2.css("display", "flex");
    setTimeout(() => {
        e1.removeClass("up");
    }, 150);
    setTimeout(() => {
        e2.removeClass("down");
    }, 300);
}
