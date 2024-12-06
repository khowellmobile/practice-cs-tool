/**
 * This file contains functions to support the functionality of the login page.
 *
 * Functions:
 * - attachEventListeners(): Attaches focus and blur event handlers to input elements
 *   to provide visual feedback on user interactions.
 */

attachEventListeners();

/**
 * Attaches event listeners to form input elements to handle focus and blur events.
 *
 * This function applies a style change to the parent element of the input when the input
 * gains focus, and reverts the style when the input loses focus.
 */
function attachEventListeners() {
    $(".form__input")
        .on("focus", function () {
            $(this).parent().css("border-bottom", "2px solid rgb(105, 105, 236)");
        })
        .on("blur", function () {
            $(this).parent().css("border-bottom", "2px solid rgb(114, 114, 134)");
        });
}
