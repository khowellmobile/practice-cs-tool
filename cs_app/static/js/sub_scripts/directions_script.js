/**
 * This file contains functions to manage tab clicks, show/hide slides based on tab selection,
 * and switch between sub-slides with animation effects within the directions.html template page.
 *
 * Global Variables:
 *
 * Functions:
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

$(".content-card").on("click", function () {
    let clickedId = $(this).attr("id");

    $(".content-card").each(function () {
        if ($(this).attr("id") === clickedId) {
            $(this).toggleClass("content-card-small content-card-large");
        } else {
            $(this).toggleClass("show hide");
        }
    })
});

try {
    // Export all functions
    module.exports = {};
} catch (error) {
    console.log(error);
}

