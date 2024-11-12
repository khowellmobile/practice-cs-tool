/**
 * This file contains functions to switch between cards to display information on the
 * directions page
 *
 * Functions:
 * - $(".content-card").on("click) - Toggles classes when a card is clicked
 *
 * Dependencies: Requires jQuery for DOM manipulation.
 */

// Required for global jqeury recognition for use in testing
// CDN still included in html file
try {
    var jsdom = require("jsdom");
    $ = require("jquery")(new jsdom.JSDOM().window);
} catch (error) {
    console.log(error);
}

attachEventListeners();

function attachEventListeners() {
    /**
     * This event listener toggles classes when a card is clicked to change what information
     * is being displayed
     */
    $(".content-card").on("click", function () {
        let clickedId = $(this).attr("id");

        $(".content-card").each(function () {
            if ($(this).attr("id") === clickedId && $(this).hasClass("content-card-initial")) {
                $(this).toggleClass("content-card-initial content-card-expanded");
                $(`#${clickedId} > p.initial-card-text`).fadeOut(300);
                $(`#${clickedId} > .hidden-div`).fadeIn(300);
            } else if ($(this).attr("id") === clickedId) {
                $(this).toggleClass("content-card-initial content-card-expanded");
                $(`#${clickedId} > p.initial-card-text`).fadeIn(300);
                $(`#${clickedId} > .hidden-div`).fadeOut(300);
            }
        });
    });

    // Setting current screen name in nav bar
    $("#current-screen-name").text("Directions");
}

try {
    // Export all functions
    module.exports = {
        attachEventListeners,
    };
} catch (error) {
    console.log(error);
}
