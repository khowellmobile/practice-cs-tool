/**
 * JavaScript file for managing elements on the one_page page that is a parent page.
 *
 * This file contains functions to handle the expansion and collapse of the menu and content
 * divs on the one_page page. The one_page is extended my the main pages of this application.
 *
 * Functions:
 * - switchClass(expand): Expands and collapsed menu and content.
 *
 * Dependencies: Requires jQuery for DOM manipulation.
 */

$("#menu")
    .on("mouseenter", function () {
        switchClass(true);
    })
    .on("mouseleave", function () {
        switchClass(false);
    });

/**
 * Controls the expansion and collapse of the side navigation menu. Will expand
 * menu when passed true and collapse menu when passed false.
 *
 * @param {boolean} expand indicates if the menu should be expanded or collapsed
 */
function switchClass(expand) {
    if (expand) {
        $("#menu").removeClass("small-menu");
        $("#menu").addClass("large-menu");
        $("#content").removeClass("large-content");
        $("#content").addClass("small-content");
    } else {
        $("#menu").removeClass("large-menu");
        $("#menu").addClass("small-menu");
        $("#content").removeClass("small-content");
        $("#content").addClass("large-content");
    }
}
