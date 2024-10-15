$("#c1")
    .on("mouseenter", function () {
        $("#c1").toggleClass("small-menu large-menu");
        $("#c2").toggleClass("small-content large-content");

        $("#c1-1 > p").fadeIn(250);
        $("#c1-2 > div > p").fadeIn(250);
    })
    .on("mouseleave", function () {
        $("#c1").toggleClass("small-menu large-menu");
        $("#c2").toggleClass("small-content large-content");

        $("#c1-1 > p").fadeOut(250);
        $("#c1-2 > div > p").fadeOut(250);
    });
