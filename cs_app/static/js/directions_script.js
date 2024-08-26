/**
 * This file contains functions to manage tab clicks, show/hide slides based on tab selection,
 * and switch between sub-slides with animation effects within the directions.html template page.
 *
 * Global Variables:
 * NOTE: These variables are held in a global object named state
 * - currentActiveId: Tracks the ID of the currently active tab.
 * - currentActiveSubSlide: Tracks the ID of the currently active sub-slide.
 * - lockTabs: Prevents tab switch spamming to avoid unintended behavior.
 * - lockSubSlides: Prevents sub-slide switch spamming to ensure smooth animations.
 *
 * Functions:
 * - $(".tab").on("click", function () { ... }): Event listener for tab clicks with locking mechanism.
 * - hideActive(): Hides the currently active set of slides based on `currentActiveId`.
 * - showNewActive(): Shows the slides corresponding to the newly activated tab after a delay.
 * - hideTripleSlides(): Hides triple slides.
 * - showTripleSlides(): Shows triple slides after delay.
 * - hideDoubleSlides(tabId): Hides double slides based on the provided `tabId`.
 * - showDoubleSlides(tabId): Shows double slides based on the provided `tabId` after a delay.
 * - switchSubSlide(newSlideId): Switches the active sub-slide with animation based on `lockSubSlides`.
 * - classToggleTimeout(element, addingClass, cssClass, timeout): Toggles a specified class for an element after a delay
 * - Getters and Setters: Used to get and set global fields in the global state object.
 *
 * Dependencies: Requires jQuery for DOM manipulation.
 */

// Global object to track the state of various needed variables
var state = {
    currentActiveId: "overview",
    currentActiveSubSlide: "slides__genRep__2__repHist",
    lockTabs: false,
    lockSubSlides: false,
};

// Required for global jqeury recognition for use in testing
// CDN still included in html file
try {
    var jsdom = require("jsdom");
    $ = require("jquery")(new jsdom.JSDOM().window);
} catch (error) {
    console.log(error);
}

/**
 * Handles subslide button click events
 *
 * Runs switchSubSlide on click. This avoids multiple onclick() in the html file.
 */
$(".mini-genRep__button").on("click", function () {
    slideConnection = $(this).data("slide-connection");
    switchSubSlide("slides__genRep__2__" + slideConnection);
});

/**
 * Handles tab click events with a lock mechanism to prevent click spam.
 *
 * This function handles clicking on a tab then locking further tab changes (2400ms).
 * The tab clicked on will become active and the rest of teh tabs are set to inactive.
 */
$(".tab").on("click", function () {
    if (!getLockTabs()) {
        setLockTabs(true);
        setTimeout(() => {
            setLockTabs(false);
        }, 2400);

        hideActive();

        let e = $(this);
        let tabId = e.attr("id");
        setCurrentActiveId(tabId);

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
    switch (getCurrentActiveId()) {
        case "overview":
            hideTripleSlides("overview");
            break;
        case "genRep":
            hideDoubleSlides("genRep");
            break;
        case "changeDB":
            hideDoubleSlides("changeDB");
            break;
        case "acctInfo":
            hideDoubleSlides("acctInfo");
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
    switch (getCurrentActiveId()) {
        case "overview":
            setTimeout(() => {
                showTripleSlides("overview");
            }, 1200);
            break;
        case "genRep":
            setTimeout(() => {
                showDoubleSlides("genRep");
            }, 1200);
            break;
        case "changeDB":
            setTimeout(() => {
                showDoubleSlides("changeDB");
            }, 1200);
            break;
        case "acctInfo":
            setTimeout(() => {
                showDoubleSlides("acctInfo");
            }, 1200);
        default:
            console.log("unknown tab");
    }
}

/**
 * Hides triple slides corresponding to the given tabId.
 *
 */
function hideTripleSlides() {
    let e1, e2, e3;

    e1 = $("#slides__overview__1");
    e2 = $("#slides__overview__2");
    e3 = $("#slides__overview__3");

    classToggleTimeout(e1, true, "up", 150);
    classToggleTimeout(e2, true, "down", 300);
    classToggleTimeout(e3, true, "up", 450);

    setTimeout(() => {
        e1.css("display", "none");
        e2.css("display", "none");
        e3.css("display", "none");
    }, 1200);
}

/**
 * Shows triple slides corresponding to the given tabId after a delay.
 *
 */
function showTripleSlides() {
    let e1, e2, e3;
    e1 = $("#slides__overview__1");
    e2 = $("#slides__overview__2");
    e3 = $("#slides__overview__3");

    e1.css("display", "flex");
    e2.css("display", "flex");
    e3.css("display", "flex");

    classToggleTimeout(e1, false, "up", 150);
    classToggleTimeout(e2, false, "down", 300);
    classToggleTimeout(e3, false, "up", 450);
}

/**
 * Hides double slides corresponding to the given tabId.
 *
 * @param {string} tabId - The ID of the tab determining which slides to hide.
 */
function hideDoubleSlides(tabId) {
    let e1 = $(`#slides__${tabId}__1`);
    let e2 = $(`#slides__${tabId}__2`);

    if (e1.length == 0 || e2.length == 0) {
        console.warn(`Element not found.`);
        return;
    }

    classToggleTimeout(e1, true, "up", 150);
    classToggleTimeout(e2, true, "down", 300);

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
    let e1 = $(`#slides__${tabId}__1`);
    let e2 = $(`#slides__${tabId}__2`);

    if (e1.length === 0 || e2.length === 0) {
        console.warn(`Element not found.`);
        return;
    }

    e1.css("display", "flex");
    e2.css("display", "flex");

    classToggleTimeout(e1, false, "up", 150);
    classToggleTimeout(e2, false, "down", 300);
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
    if ($("#" + newSlideId) <= 0|| $("#" + getCurrentActiveSubSlide()) <= 0) {
        console.warn("No matching element for given id");
        return;
    }

    if (!getLockSubSlides()) {
        setLockSubSlides(true);
        setTimeout(() => {
            setLockSubSlides(false);
        }, 550);

        e1 = $("#" + getCurrentActiveSubSlide());
        e2 = $("#" + newSlideId);

        e1.removeClass("scaleUp");
        e1.addClass("scaleDown");

        setTimeout(() => {
            e1.css("display", "none");
        }, 500);

        setTimeout(() => {
            e2.css("display", "flex");
        }, 525);

        classToggleTimeout(e2, false, "scaleDown", 550);
        classToggleTimeout(e2, true, "scaleUp", 550);

        setCurrentActiveSubSlide(newSlideId);
    }
}

/**
 * Sets a timeout to toggle a CSS class on an element after a delay.
 *
 * @param {jQuery} element - The jQuery element to toggle the class on.
 * @param {boolean} addingClass - Whether to add or remove the class.
 * @param {string} cssClass - The CSS class to toggle.
 * @param {number} timeout - The delay in milliseconds before toggling the class.
 */
function classToggleTimeout(element, addingClass, cssClass, timeout) {
    if (!element || !element.length) {
        console.warn("Invalid or empty jQuery element provided.");
        return;
    }

    if (typeof cssClass !== "string" || !cssClass.trim()) {
        console.warn("Invalid CSS class provided.");
        return;
    }

    if (typeof timeout !== "number" || timeout <= 0) {
        console.warn("Invalid timeout value provided.");
        return;
    }

    if (addingClass) {
        setTimeout(() => {
            element.addClass(cssClass);
        }, timeout);
    } else {
        setTimeout(() => {
            element.removeClass(cssClass);
        }, timeout);
    }
}

/**
 * Gets the current active ID.
 *
 * @returns {string} The current active ID.
 */
function getCurrentActiveId() {
    return state.currentActiveId;
}

/**
 * Sets the current active ID.
 *
 * @param {string} id - The new ID to set as the current active ID.
 */
function setCurrentActiveId(id) {
    state.currentActiveId = id;
}

/**
 * Gets the current active sub-slide ID.
 *
 * @returns {string} The current active sub-slide ID.
 */
function getCurrentActiveSubSlide() {
    return state.currentActiveSubSlide;
}

/**
 * Sets the current active sub-slide ID.
 *
 * @param {string} subSlideId - The new ID to set as the current active sub-slide ID.
 */
function setCurrentActiveSubSlide(subSlideId) {
    state.currentActiveSubSlide = subSlideId;
}

/**
 * Checks if tabs are locked.
 *
 * @returns {boolean} True if tabs are locked, false otherwise.
 */
function getLockTabs() {
    return state.lockTabs;
}

/**
 * Sets whether tabs are locked.
 *
 * @param {boolean} lock - The new lock status for tabs.
 */
function setLockTabs(lock) {
    state.lockTabs = lock;
}

/**
 * Checks if sub-slides are locked.
 *
 * @returns {boolean} True if sub-slides are locked, false otherwise.
 */
function getLockSubSlides() {
    return state.lockSubSlides;
}

/**
 * Sets whether sub-slides are locked.
 *
 * @param {boolean} lock - The new lock status for sub-slides.
 */
function setLockSubSlides(lock) {
    state.lockSubSlides = lock;
}

try {
    // Export all functions
    module.exports = {
        getCurrentActiveId,
        setCurrentActiveId,
        getCurrentActiveSubSlide,
        setCurrentActiveSubSlide,
        getLockTabs,
        setLockTabs,
        getLockSubSlides,
        setLockSubSlides,
        hideActive,
        showNewActive,
        hideTripleSlides,
        showTripleSlides,
        hideDoubleSlides,
        showDoubleSlides,
        switchSubSlide,
        classToggleTimeout,
    };
} catch (error) {
    console.log(error);
}
