/**
 * This file contains functions to handle various UI interactions including button actions, slider operations,
 * and element manipulation within the dev-container and slider interfaces. Write all components in #dev-container.
 * Css For #dev-container may need small adjustments.
 * 
 * Tree/Leaf explained:
 * To facilitate the outlines and matching of elements a leaf global object named leafs is used.
 * The leafs object tracks the state of each leaf and its relevant id variations.
 * Each element/leaf pair is given a "leafId". The number is then stored in a custom
 * attribute named leadId on each leaf and element. Elements leafIds are suffixed by "-e"
 * and leafs are suffixed by "-l"
 *
 * Global Variables:
 * - leafs: object to track the state of leafs. Each leaf matches an html element.
 *
 * Functions:
 * - attachEventListeners(): Attaches eventlisteners to elements
 * - loadCssToTextarea(): Loads css from tinker css file into text area
 * - applyTextAreaCss(): Applies css in textarea to the page
 * - saveCssToStorage(cssContent): Saves textarea css to storage (prevent removal on refresh)
 * - loadCssFromStorage(): Loads textarea css from storage (runs on page load)
 * - resetCssToBase(): Resets the page css and storage css back to default
 * 
 */

attachEventListeners();
loadCssToTextarea();
window.onload = loadCssFromStorage;


var leafs = {};

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
        let selector = inputs.find(".css-selector-input").val();
        let property = inputs.find(".css-property-input").val();
        let units = inputs.find(".css-units-input").val();

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

    $(".button-function-input").on("input", function () {
        let cluster = $(this).closest(".button-cluster");
        let button = cluster.find(".tinker-function-button");
        let value = $(this).val();

        button.off("click").on("click", function () {
            eval(value);
        });
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
    $(selector).css(`${property}`, `${value}${units}`);
}

function addTinkerSlider() {
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

function addTinkerButton() {
    let buttonHtml = `
        <div class="button-cluster">
            <div class="button-cluster__inputs">
                <input
                    type="text"
                    class="button-function-input tinker-text-input tinker-text-input__full"
                    spellcheck="false"
                    placeholder="Function(args)"
                />
            </div>
            <button class="tinker-function-button">Run Function</button>
        </div>
        <div class="sep-h"></div>
        `;
    $("#tinker-buttons").append(buttonHtml);
    attachEventListeners();
}

printTree($("#dev-container"), "");

function printTree(element, indent, leafCounter = { count: 0 }) {
    let numOfChildren = element.children().length;

    // Base Case: If no children, stop recursion
    if (numOfChildren === 0) {
        return;
    }

    let newIndent = indent + "    ";

    element.children().each(function () {
        let leafId = leafCounter.count++;
        let tagName = $(this).prop("nodeName").toLowerCase();
        let leaf = `<div class="leaf" leafId="${leafId}-l"><p>${newIndent}${tagName}</p></div>`;

        $(this).attr("leafId", `${leafId}-e`);
            
        leafs[leafId] = {
            leafLeafId: leafId + "-l",
            elementLeafId: leafId + "-e",
            outline: false,
        }

        $("#tinker-tree").append(leaf);

        // Recursive call
        printTree($(this), newIndent, leafCounter);
    });
}

$(".leaf").on("mouseenter", function () {
    let leafLeafId = $(this).attr("leafId");
    let elementLeafId = leafs[leafLeafId.slice(0,-2)].elementLeafId;

    $(`[leafId='${elementLeafId}']`).addClass("blinking-outline");
})

$(".leaf").on("mouseleave", function () {
    let leafLeafId = $(this).attr("leafId");
    let elementLeafId = leafs[leafLeafId.slice(0,-2)].elementLeafId;

    $(`[leafId='${elementLeafId}']`).removeClass("blinking-outline");
})

$(".leaf").on("click", function () {
    let leafLeafId = $(this).attr("leafId");
    let elementLeafId = leafs[leafLeafId.slice(0,-2)].elementLeafId;

    $(`[leafId='${elementLeafId}']`).toggleClass("constant-outline");
})
