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
 * - attachEventListeners(): Attaches event listeners to elements
 * - attachRangeEventListeners(): Attaches event listeners to range input elements
 * - attachButtonEventListeners(): Attaches event listeners to button elements
 * - loadCssToTextarea(): Loads CSS from the tinker CSS file into the text area
 * - applyTextAreaCss(): Applies CSS in the textarea to the page
 * - saveCssToStorage(cssContent): Saves textarea CSS to storage (prevents removal on refresh)
 * - loadCssFromStorage(): Loads textarea CSS from storage (runs on page load)
 * - resetCssToBase(): Resets the page CSS and storage CSS back to default
 * - setIndicator(min, max, value, indicator): Sets the indicator for a range element
 * - setCSS(selector, property, units, value): Sets CSS properties for a given selector
 * - printTree(element, indent, leafCounter = { co }): Prints a tree structure of the elements
 * - darkMode(): Activates dark mode for the page
 * - lightMode(): Activates light mode for the page
 * - addTinkerSlider(): Adds a slider element to the page
 * - saveSlidersToStorage(): Saves slider states to storage
 * - loadSlidersFromStorage(): Loads slider states from storage
 * - resetTinkerSliders(): Resets the sliders to their default state
 * - addTinkerButton(): Adds a button element to the page
 * - saveButtonsToStorage(): Saves button states to storage
 * - loadButtonsFromStorage(): Loads button states from storage
 * - resetTinkerButtons(): Resets the buttons to their default state
 * - saveSettingsToStorage(): Saves settings to storage
 * - loadSettingsFromStorage(): Loads settings from storage
 */

// Save input values before refresh
$(window).on("beforeunload", function () {
    saveSlidersToStorage();
    saveButtonsToStorage();
    saveSettingsToStorage();
});

// Load needed information from storage and attach event listeners
$(window).on("load", function () {
    loadSlidersFromStorage();
    loadButtonsFromStorage();
    loadSettingsFromStorage();
    loadCssFromStorage();
    loadCssToTextarea();
    attachEventListeners();
});

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

        $("#tinker-slides .slide").eq(index).toggleClass("active-slide inactive-slide");
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

    $(".leaf").on("mouseenter", function () {
        let leafLeafId = $(this).attr("leafId");
        let elementLeafId = leafs[leafLeafId.slice(0, -2)].elementLeafId;

        $(`[leafId='${elementLeafId}']`).addClass("blinking-outline");
    });

    $(".leaf").on("mouseleave", function () {
        let leafLeafId = $(this).attr("leafId");
        let elementLeafId = leafs[leafLeafId.slice(0, -2)].elementLeafId;

        $(`[leafId='${elementLeafId}']`).removeClass("blinking-outline");
    });

    $(".leaf").on("click", function () {
        let leafLeafId = $(this).attr("leafId");
        let elementLeafId = leafs[leafLeafId.slice(0, -2)].elementLeafId;

        $(`[leafId='${elementLeafId}']`).toggleClass("constant-outline");
    });

    attachRangeEventListeners();
    attachButtonEventListeners();

    $("#run-css-button").on("click", applyTextAreaCss);
    $("#reset-css-button").on("click", resetCssToBase);
}

/**
 * Attaches relevany event listeners to sliders
 */
function attachRangeEventListeners() {
    // Update the indicator position when the slider value changes
    $(".css-range-slider")
        .off("input")
        .on("input", function () {
            let value = $(this).val();
            let indicator = $(this).parent().children(1);
            let inputs = $(this).parent().parent().children(1);
            let selector = inputs.find(".css-selector-input").val();
            let property = inputs.find(".css-property-input").val();
            let units = inputs.find(".css-units-input").val();

            setIndicator($(this).attr("min"), $(this).attr("max"), value, indicator);
            setCSS(selector, property, units, value);
        });

    $(".css-range-start-input, .css-range-end-input")
        .off("input")
        .on("input", function () {
            let cluster = $(this).closest(".slider-cluster");
            let slider = cluster.find(".css-range-slider");

            if ($(this).hasClass("css-range-start-input")) {
                slider.attr("min", $(this).val());
            } else if ($(this).hasClass("css-range-end-input")) {
                slider.attr("max", $(this).val());
            }
        });
}

/**
 * Attaches relevant event listeners to function buttons
 */
function attachButtonEventListeners() {
    $(".button-function-input")
        .off("input")
        .on("input", function () {
            let cluster = $(this).closest(".button-cluster");
            let button = cluster.find(".tinker-function-button");
            let value = $(this).val();

            button.off("click").on("click", function () {
                eval(value);
            });
        });
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
    sessionStorage.setItem("textareaCss", cssContent);
}

/**
 * Loads an item called "textareaCss" from local storage, loads it into the text
 * area, and applies the css.
 */
function loadCssFromStorage() {
    const savedCss = sessionStorage.getItem("textareaCss");
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
    sessionStorage.removeItem("textareaCss");

    // Get base link
    let baseLink = $('link[rel="stylesheet"][href*="tinker_style.css"]');

    // Add link if no longer present
    if (baseLink.length === 0) {
        $("head").append('<link rel="stylesheet" href="{% static \'css/tinker_style.css\' %}" />');
    }

    loadCssToTextarea();
}

/**
 * Calculates and sets the proper offset and
 * value for the indicator on a slider
 *
 * @param {int} min - minimum value of the slider range
 * @param {int} max - maximum value of the slider range
 * @param {int} value - Current value of the slider
 * @param {$element} indicator - Indicator element for the slider
 */
function setIndicator(min, max, value, indicator) {
    let percentThrough = ((value - min) / (max - min)) * 100;

    // Offset to avoid additional movement due to thumb width
    let leftOffset = (percentThrough / 100) * 15;

    indicator.css("left", `calc(${percentThrough}% - ${leftOffset}px)`);

    $(indicator).find(".indicator-text").text(value);
}

/**
 * Uses jquery to set the css of a DOM element using the input information
 *
 * @param {string} selector - CSS selector to select the jquery element
 * @param {string} property - CSs property to change
 * @param {string} units - Units of the CSS property (eq. rem, px, vh,...)
 * @param {int} value - The value to set the property to
 */
function setCSS(selector, property, units, value) {
    $(selector).css(`${property}`, `${value}${units}`);
}

printTree($("#dev-container"), "");

/**
 * Recursive function to print the DOM elements in the tinker tree
 *
 * The function works by creating a "leaf" that correlates to a real
 * DOM element by use of a leaf-id. The leafs are then stored in a
 * global object that tracks their relevant states.
 *
 * @param {$element} element - The current element to print the children of
 * @param {string} indent - The amount to indent the text by for formatting
 * @param {object} leafCounter - The leaf number that correlates to the current element
 * @returns
 */
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
        };

        $("#tinker-tree").append(leaf);

        // Recursive call
        printTree($(this), newIndent, leafCounter);
    });
}

/**
 * Sets all necessary css variables to dark mode variations
 */
function darkMode() {
    $("html").css("--current-display-mode", "dark");
    $("html").css("--tinker-primary-color", "orange");
    $("html").css("--tinker-darker-primary", "rgb(255, 140, 0)");
    $("html").css("--tinker-background-color", "rgb(22, 22, 22)");
    $("html").css("--tinker-background-shadow-color", "rgb(15, 15, 15)");
    $("html").css("--tinker-text-color", "white");
    $("html").css("--tinker-slider-background", "black");
    $("html").css("--tinker-slider-thumb", "#333");
    $("html").css("--tinker-slider-shadow", "#333");
}

/**
 * Sets all necessary css variables to light mode variations
 */
function lightMode() {
    $("html").css("--current-display-mode", "light");
    $("html").css("--tinker-primary-color", "rgb(94, 94, 248)");
    $("html").css("--tinker-darker-primary", "rgb(94, 94, 248)");
    $("html").css("--tinker-background-color", "white");
    $("html").css("--tinker-background-shadow-color", "rgb(0, 0, 0, 0)");
    $("html").css("--tinker-text-color", "black");
    $("html").css("--tinker-slider-background", "white");
    $("html").css("--tinker-slider-thumb", "rgb(0, 0, 0, 0)");
    $("html").css("--tinker-slider-shadow", "rgb(0, 0, 0, 0.2)");
}

/**
 * Adds default slider html to the slider container and attaches event listeners to
 * new slider.
 */
function addTinkerSlider() {
    let sliderHtml = `
        <div class="slider-cluster">
            <div class="slider-cluster__options">
                <input
                    type="text"
                    class="css-selector-input tinker-text-input tinker-text-input__full"
                    spellcheck="false"
                    placeholder="Selector"
                />
                <input
                    type="text"
                    class="css-property-input tinker-text-input tinker-text-input__full"
                    spellcheck="false"
                    placeholder="Property"
                />
                <span>
                    <input
                        type="text"
                        class="css-range-start-input tinker-text-input tinker-text-input__half"
                        spellcheck="false"
                        placeholder="Start"
                    />
                    <input
                        type="text"
                        class="css-range-end-input tinker-text-input tinker-text-input__half"
                        spellcheck="false"
                        placeholder="End"
                    />
                    <input
                    type="text"
                    class="css-units-input tinker-text-input tinker-text-input__half"
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
    attachRangeEventListeners();
}

/**
 * Saves sliders information to sessionStorage
 */
function saveSlidersToStorage() {
    let sliderValues = [];

    $(".slider-cluster").each(function () {
        const cluster = $(this);

        const selectorInput = cluster.find(".css-selector-input").val();
        const propertyInput = cluster.find(".css-property-input").val();
        const rangeStartInput = cluster.find(".css-range-start-input").val();
        const rangeEndInput = cluster.find(".css-range-end-input").val();
        const unitsInput = cluster.find(".css-units-input").val();
        const sliderValue = cluster.find(".css-range-slider").val();

        const clusterData = {
            selector: selectorInput,
            property: propertyInput,
            rangeStart: rangeStartInput,
            rangeEnd: rangeEndInput,
            units: unitsInput,
            sliderValue: sliderValue,
        };

        sliderValues.push(clusterData);
    });

    sessionStorage.setItem("sliderData", JSON.stringify(sliderValues));
}

/**
 * Loads sliders information from storage and creates needed sliders
 */
function loadSlidersFromStorage() {
    const savedSliderData = JSON.parse(sessionStorage.getItem("sliderData"));

    if (savedSliderData && savedSliderData.length > 0) {
        savedSliderData.forEach((sliderData, index) => {
            addTinkerSlider();

            let cluster = $(".slider-cluster").eq(index);

            if (cluster.length) {
                cluster.find(".css-selector-input").val(sliderData.selector);
                cluster.find(".css-property-input").val(sliderData.property);
                cluster.find(".css-range-start-input").val(sliderData.rangeStart);
                cluster.find(".css-range-end-input").val(sliderData.rangeEnd);
                cluster.find(".css-units-input").val(sliderData.units);
                cluster.find(".css-range-slider").val(sliderData.sliderValue);
                cluster.find(".slider-cluster__slider input").attr("min", sliderData.rangeStart);
                cluster.find(".slider-cluster__slider input").attr("max", sliderData.rangeEnd);

                let indicator = cluster.find(".indicator");

                setIndicator(sliderData.rangeStart, sliderData.rangeEnd, sliderData.sliderValue, indicator);
                setCSS(sliderData.selector, sliderData.property, sliderData.units, sliderData.sliderValue);
            }
        });
    } else {
        addTinkerSlider();
    }
}

/**
 * Clears sliders container and resets the session storage
 * that holds sliders information
 */
function resetTinkerSliders() {
    sessionStorage.removeItem("sliderData");
    $("#sliders").empty();
    addTinkerSlider();
}

/**
 * Adds default function button to button container and attaches event listeners to new
 * button
 */
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
    attachButtonEventListeners();
}

/**
 * Saves function button information to sesstion storage
 */
function saveButtonsToStorage() {
    let buttonValues = [];

    $(".button-cluster").each(function () {
        const cluster = $(this);

        const functionInfo = cluster.find(".button-function-input").val();

        const clusterData = {
            functionInfo: functionInfo,
        };

        buttonValues.push(clusterData);
    });

    sessionStorage.setItem("buttonData", JSON.stringify(buttonValues));
}

/**
 * Loads function button information from storage and adds needed buttons to the page.
 */
function loadButtonsFromStorage() {
    const savedButtonData = JSON.parse(sessionStorage.getItem("buttonData"));

    if (savedButtonData && savedButtonData.length > 0) {
        savedButtonData.forEach((buttonData, index) => {
            addTinkerButton();

            let cluster = $(".button-cluster").eq(index);
            cluster.find(".button-function-input").val(buttonData.functionInfo);
        });
    } else {
        addTinkerButton();
    }
}

/**
 * Clears function button container and resets the session storage
 * that holds buttons information
 */
function resetTinkerButtons() {
    sessionStorage.removeItem("buttonData");
    $("#tinker-buttons").empty();
    addTinkerButton();
}

/**
 * Saves settings to session storage
 */
function saveSettingsToStorage() {
    const settingsData = {
        displayMode: $("html").css("--current-display-mode"),
        backgroundColor: $("dev-container").css("background-color"),
    };

    sessionStorage.setItem("settingsData", JSON.stringify(settingsData));
}

/**
 * Loads settings from session storage and applies the stored information
 */
function loadSettingsFromStorage() {
    const settingsData = JSON.parse(sessionStorage.getItem("settingsData"));

    if (settingsData && settingsData.displayMode && settingsData.displayMode == "light") {
        lightMode();
    }

    if (settingsData && settingsData.backgroundColor) {
        $("dev-container").css("background-color", settingsData.backgroundColor);
    }
}
