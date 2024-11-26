/**
 * This file contains functions to handle various UI interactions including button actions, slider operations,
 * and element manipulation within the dev-container and slider interfaces. Write all components in #dev-container.
 * Css For #dev-container may need small adjustments.
 *
 * Global Variables:
 * -
 *
 * Functions:
 * - attachEventListeners(): Attaches eventlisteners to elements
 * - loadCssToTextarea(): Loads css from tinker css file into text area
 * - applyTextAreaCss(): Applies css in textarea to the page
 * - saveCssToStorage(cssContent): Saves textarea css to storage (prevent removal on refresh)
 * - loadCssFromStorage(): Loads textarea css from storage (runs on page load)
 * - resetCssToBase(): Resets the page css and storage css back to default
 */

attachEventListeners();
loadCssToTextarea();
window.onload = loadCssFromStorage;

/**
 * Function to attach event listeners
 */
function attachEventListeners() {
    $(".tab").on("click", function () {
        let index = $(this).index();

        // Sets proper tab as active
        $(".active-tab").toggleClass("active-tab inactive-tab");

        $(this).toggleClass("active-tab inactive-tab");

        // Sets matching slide as active
        $(".active-slide").toggleClass("active-slide inactive-slide");

        $("#slides .slide").eq(index).toggleClass("active-slide inactive-slide");
    });

    $("#css-textarea").on("keydown", function (e) {
        if (e.key == "Tab") {
            e.preventDefault();

            var cursorPos = this.selectionStart;
            var textBefore = this.value.substring(0, cursorPos);
            var textAfter = this.value.substring(cursorPos);

            this.value = textBefore + "    " + textAfter;

            this.selectionStart = this.selectionEnd = cursorPos + 4;
        } else if (e.key == "{") {
            e.preventDefault();

            var cursorPos = this.selectionStart;
            var textBefore = this.value.substring(0, cursorPos);
            var textAfter = this.value.substring(cursorPos);

            this.value = textBefore + "{}" + textAfter;

            this.selectionStart = this.selectionEnd = cursorPos + 1;
        }
    });

    // Update the indicator position when the slider value changes
    $(".css-range-slider").on("input", function () {
        let value = $(this).val();
        let indicator = $(this).parent().children(1);
        let inputs = $(this).parent().parent().children(1);
        let selector = inputs.find(".css-selector-input");
        let property = inputs.find(".css-property-input");
        let units = inputs.find("css-units-input");

        setIndicator($(this).attr("min"), $(this).attr("max"), value, indicator);
        setCSS(selector, property, units, value);
    });

    $(".css-range-start-input, .css-range-end-input").on("input", function () {
        let cluster = $(this).closest(".slider-cluster");
        let slider = cluster.find(".css-range-slider");

        if ($(this).hasClass("css-range-start-input")) {
            slider.attr("min", $(this).val());
        } else if ($(this).hasClass("css-range-end-input")) {
            slider.attr("max", $(this).val());
        }
    });

    $("#run-css-button").on("click", applyTextAreaCss);
    $("#reset-css-button").on("click", resetCssToBase);
}

/**
 * Loads css from tinker_style.css link into the text area.
 */
function loadCssToTextarea() {
    const linkElement = document.querySelector('link[rel="stylesheet"][href*="tinker_style.css"]');

    if (linkElement) {
        const stylesheetUrl = linkElement.href;

        // Fetch file and load into textarea
        fetch(stylesheetUrl)
            .then((response) => response.text())
            .then((cssContent) => {
                $("#css-textarea").val(cssContent);
            })
            .catch((error) => {
                console.error("Error loading CSS file:", error);
            });
    } else {
        console.error("Stylesheet not found");
    }
}

/**
 * Applys the css contained within the text are to the page.
 */
function applyTextAreaCss() {
    const cssContent = $("#css-textarea").val();
    const styleElement = $("<style></style>");

    styleElement.html(cssContent);

    $("head").append(styleElement);

    saveCssToStorage(cssContent);
}

/**
 * Saves the passed variable to a local storage item named "textareaCss"
 *
 * @param {*} cssContent
 */
function saveCssToStorage(cssContent) {
    localStorage.setItem("textareaCss", cssContent);
}

/**
 * Loads an item called "textareaCss" from local storage, loads it into the text
 * area, and applies the css.
 */
function loadCssFromStorage() {
    const savedCss = localStorage.getItem("textareaCss");
    if (savedCss) {
        $("#css-textarea").val(savedCss);
        applyTextAreaCss();
    }
}

/**
 * Resets the pages css back to whatever is contained within "tinker_style.css"
 * This function will also clear the "textareaCss" from local storage.
 */
function resetCssToBase() {
    // Remove all dynamically added styles
    $("style").remove();
    localStorage.removeItem("textareaCss");

    // Get base link
    let baseLink = $('link[rel="stylesheet"][href*="tinker_style.css"]');

    // Add link if no longer present
    if (baseLink.length === 0) {
        $("head").append('<link rel="stylesheet" href="{% static \'css/tinker_style.css\' %}" />');
    }

    loadCssToTextarea();
}

function setIndicator(min, max, value, indicator) {
    let percentThrough = ((value - min) / (max - min)) * 100;

    // Offset to avoid additional movement due to thumb width
    let leftOffset = (percentThrough / 100) * 15;

    indicator.css("left", `calc(${percentThrough}% - ${leftOffset}px)`);

    $(indicator).find(".indicator-text").text(value);
}

function setCSS(selector, property, units, value) {
    $(selector).css(`${property}: ${value}${units}`);
}

function addSlider() {
    let sliderHtml = `
        <div class="slider-cluster">
            <div class="slider-cluster__options">
                <input
                    type="text"
                    class="css-selector-input slider-input__full"
                    spellcheck="false"
                    placeholder="Selector"
                />
                <input
                    type="text"
                    class="css-property-input slider-input__full"
                    spellcheck="false"
                    placeholder="Property"
                />
                <span>
                    <input
                        type="text"
                        class="css-range-start-input slider-input__half"
                        spellcheck="false"
                        placeholder="Start"
                    />
                    <input
                        type="text"
                        class="css-range-end-input slider-input__half"
                        spellcheck="false"
                        placeholder="End"
                    />
                    <input
                    type="text"
                    class="css-units-input slider-input__half"
                    spellcheck="false"
                    placeholder="Units"
                />
                </span>
            </div>
            <div class="slider-cluster__slider">
                <div class="indicator"><p class="indicator-text">0</p></div>
                <input type="range" min="0.00" max="50" step="0.1" value="0" class="css-range-slider" />
            </div>
        </div>
        <div class="sep-h"></div>
        `;
    $("#sliders").append(sliderHtml);
    attachEventListeners();
}

console.log($("#main").html())
