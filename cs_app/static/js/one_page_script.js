$("#c1")
    .on("mouseenter", function () {
        switchClass(true);
    })
    .on("mouseleave", function () {
        switchClass(false);
    });

function switchClass(expand) {
    if (expand) {
        $("#c1").removeClass("small-menu");
        $("#c1").addClass("large-menu");
        $("#c2").removeClass("large-content");
        $("#c2").addClass("small-content");
    } else {
        $("#c1").removeClass("large-menu");
        $("#c1").addClass("small-menu");
        $("#c2").removeClass("small-content");
        $("#c2").addClass("large-content");
    }
}
