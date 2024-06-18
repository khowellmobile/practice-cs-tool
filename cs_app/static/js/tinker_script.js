const throttledToggleSize = throttle(toggleSize, 500);

// Changes the size of #c1 and #c2 to allow of an expanding history div
function toggleSize(eId, smallPercent, largePercent) {
    let delta = 10;
    let e = $("#" + eId);
    let e2 = $("#c2");

    let pWidth = $("#content").width();
    let cWidth = e.width();

    let lSize = (largePercent / 100) * pWidth;

    if (cWidth <= lSize - delta) {
        e.css("width", largePercent + "%");
        e2.css("width", "80%");
        toggleSizeButton(true);
    } else {
        e.css("width", smallPercent + "%");
        e2.css("width", "97%");
        toggleSizeButton(false);
    }
}

function foo() {
    for (let i = 0; i < 10; i++) {
        $("#c1-2").append("<button class='but historyButton'>LY</button>");
    }
}

function toggleSizeButton(goingBig) {
    let c1 = $(".expandedInfo");
    let c2 = $(".symbol");

    if (goingBig) {
        c1.css("opacity", "1");
        c1.css("display", "flex");
        c2.css("opacity", "0");
        c2.css("display", "none");
    } else {
        c1.css("opacity", "0");
        c1.css("display", "none");
        c2.css("opacity", "1");
        c2.css("display", "flex");
    }
}

// Throttle function to avoid user spamming calls
function throttle(func, delay) {
    let throttled = false;

    return function () {
        if (!throttled) {
            throttled = true;
            func.apply(this, arguments);
            setTimeout(() => {
                throttled = false;
            }, delay);
        }
    };
}
