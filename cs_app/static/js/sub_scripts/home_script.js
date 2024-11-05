/**
 * 
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
    $("#report-history__listing > div").on("click", function () {
        let url = "/generate_report/"
        const report_type = $(this).find(".rep_type").text();
        const start_date = $(this).find(".rep_start_date").text();
        const end_date = $(this).find(".rep_end_date").text();
    
        const additionalInfo = {
            menu_status: "menu_closed",
            report_type: report_type,
            start_date: start_date,
            end_date: end_date,
        };
    
        const jsonString = JSON.stringify(additionalInfo);
    
        // Encode the optionalField to make it URL-safe
        const encodedField = encodeURIComponent(jsonString);
    
        url += `?additionalInfo=${encodedField}`;
    
        window.location.assign(url);
    });

    $("#right > span").on("mouseenter", function () {
        $(this).find("div > p").toggleClass("right-pos left-pos");
    }).on("mouseleave", function () {
        $(this).find("div > p").toggleClass("right-pos left-pos");
    });
}