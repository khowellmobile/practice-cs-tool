/**
 * Shows dropdown menu on click
 */
$(".dropdown-button").on("click", function (event) {
    // Prevent the document click event from firing
    event.stopPropagation();
    $(".dropdown-content").css("visibility", "visible");

    console.log("showing");
});

/**
 * Handles when dropdown option has been clicked
 */
$(".dropdown-item").on("click", function () {
    activeTimeRange = $(this).data("value");
    alterDates(activeTimeRange);
    $(".dropdown-button").text($(this).text());
    $(".dropdown-content").css("visibility", "hidden");

    console.log("hidinge 1");
});

/**
 * Hides dropdown when user clicks outside of it
 *
 * Contained in try catch to allow testing of file
 */
try {
    $(document).on("click", function (event) {
        if (!$(event.target).closest(".dropdown").length) {
            $(".dropdown-content").css("visibility", "hidden");
            console.log("hiding 2");
        }
    });
} catch (error) {}
