/**
 * This js file attachs the event listeners needed for the home page.
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

/**
 * Attaches event listeners to elements. 
 */
function attachEventListeners() {
    $("#right > span").on("mouseenter", function () {
        $(this).find("div > p").toggleClass("right-pos left-pos");
    }).on("mouseleave", function () {
        $(this).find("div > p").toggleClass("right-pos left-pos");
    });

    // Setting current screen name in nav bar
    $("#current-screen-name").text("Home");
}