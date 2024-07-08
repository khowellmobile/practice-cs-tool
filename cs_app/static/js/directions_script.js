/**
 * This file contains functions to manage tab clicks, show/hide slides based on tab selection,
 * and switch between sub-slides with animation effects within the directions.html template page.
 *
 * Global Variables:
 * - currentActiveId: Tracks the ID of the currently active tab.
 * - currentActiveSubSlide: Tracks the ID of the currently active sub-slide.
 * - lockTabs: Prevents tab switch spamming to avoid unintended behavior.
 * - lockSubSlides: Prevents sub-slide switch spamming to ensure smooth animations.
 *
 * Functions:
 * - $(".tab").on("click", function () { ... }): Event listener for tab clicks with locking mechanism.
 * - hideActive(): Hides the currently active set of slides based on `currentActiveId`.
 * - showNewActive(): Shows the slides corresponding to the newly activated tab after a delay.
 * - hideTripleSlides(tabId): Hides triple slides based on the provided `tabId`.
 * - showTripleSlides(tabId): Shows triple slides based on the provided `tabId` after a delay.
 * - hideDoubleSlides(tabId): Hides double slides based on the provided `tabId`.
 * - showDoubleSlides(tabId): Shows double slides based on the provided `tabId` after a delay.
 * - switchSubSlide(newSlideId): Switches the active sub-slide with animation based on `lockSubSlides`.
 *
 * Dependencies: Requires jQuery for DOM manipulation.
 */

var currentActiveId = "t1";
var currentActiveSubSlide = "slides__genRep__2__repHist";
var lockTabs = false;
var lockSubSlides = false;

/**
 * Handles tab click events with a lock mechanism to prevent click spam.
 *
 * This function handles clicking on a tab then locking further tab changes (2400ms).
 * The tab clicked on will become active and the rest of teh tabs are set to inactive.
 */
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
    }
});

/**
 * Hides the currently active slides based on the currentActiveId.
 *
 * @param {string} tabId - The ID of the tab determining which slides to hide.
 */
function hideActive() {
    switch (currentActiveId) {
        case "t1":
            hideTripleSlides("t1");
            break;
        case "t2":
            hideDoubleSlides("t2");
            break;
        case "t3":
            hideDoubleSlides("t3");
            break;
        case "t4":
            hideDoubleSlides("t4");
            break;
        default:
            console.log("unknown tab");
    }
}

/**
 * Shows the newly active slides based on the currentActiveId after a delay.
 *
 * The delay is to wait until the currently shown slides have completed a hiding animation.
 *
 * @param {string} tabId - The ID of the tab determining which slides to show.
 */
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
                showDoubleSlides("t3");
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

/**
 * Hides triple slides corresponding to the given tabId.
 *
 * @param {string} tabId - The ID of the tab determining which slides to hide.
 */
function hideTripleSlides(tabId) {
    let e1, e2, e3;

    e1 = $("#slides__overview__1");
    e2 = $("#slides__overview__2");
    e3 = $("#slides__overview__3");

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

/**
 * Shows triple slides corresponding to the given tabId after a delay.
 *
 * @param {string} tabId - The ID of the tab determining which slides to show.
 */
function showTripleSlides(tabId) {
    let e1, e2, e3;
    e1 = $("#slides__overview__1");
    e2 = $("#slides__overview__2");
    e3 = $("#slides__overview__3");

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

/**
 * Hides double slides corresponding to the given tabId.
 *
 * @param {string} tabId - The ID of the tab determining which slides to hide.
 */
function hideDoubleSlides(tabId) {
    let e1, e2;
    if (tabId === "t2") {
        e1 = $("#slides__genRep__1");
        e2 = $("#slides__genRep__2");
    } else if (tabId === "t3") {
        e1 = $("#slides__changeDB__1");
        e2 = $("#slides__changeDB__2");
    } else {
        e1 = $("#slides__acctInfo__1");
        e2 = $("#slides__acctInfo__2");
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

/**
 * Shows double slides corresponding to the given tabId after a delay.
 *
 * @param {string} tabId - The ID of the tab determining which slides to show.
 */
function showDoubleSlides(tabId) {
    let e1, e2;
    if (tabId === "t2") {
        e1 = $("#slides__genRep__1");
        e2 = $("#slides__genRep__2");
    } else if (tabId === "t3") {
        e1 = $("#slides__changeDB__1");
        e2 = $("#slides__changeDB__2");
    } else {
        e1 = $("#slides__acctInfo__1");
        e2 = $("#slides__acctInfo__2");
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

/**
 * Handles switching the displayed sub-slide and locking any futher changes while
 * animations are active.
 *
 * When a subslide is switched there is a 550ms animation for hiding
 * then showing the old and new slide.
 *
 * @param {string} newSlideId - The ID of the new sub-slide to switch to.
 */
function switchSubSlide(newSlideId) {
    if (!lockSubSlides) {
        lockSubSlides = true;
        setTimeout(() => {
            lockSubSlides = false;
        }, 550);

        e1 = $("#" + currentActiveSubSlide);
        e2 = $("#" + newSlideId);

        e1.removeClass("scaleUp");
        e1.addClass("scaleDown");
        setTimeout(() => {
            e1.css("display", "none");
        }, 500);

        setTimeout(() => {
            e2.css("display", "flex");
        }, 525);

        setTimeout(() => {
            e2.removeClass("scaleDown");
            e2.addClass("scaleUp");
        }, 550);

        currentActiveSubSlide = newSlideId;
    }
}
