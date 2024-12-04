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

// Save input values before refresh
$(window).on("beforeunload", function () {
    saveSlidersToStorage();
    saveButtonsToStorage();
    saveSettingsToStorage();
});

$(window).on("load", function () {
    loadSlidersFromStorage();
    loadButtonsFromStorage();
    loadSettingsFromStorage();
    loadCssFromStorage();
    loadCssToTextarea()
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
    sessionStorage.setItem("textareaCss", cssContent);
}

/**
 * Loads an item called "textareaCss" from local storage, loads it into the text
 * area, and applies the css.
 */
function loadCssFromStorage() {
    console.log("loadings");
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
        };

        $("#tinker-tree").append(leaf);

        // Recursive call
        printTree($(this), newIndent, leafCounter);
    });
}

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

function darkMode() {
    $("html").css("--tinker-primary-color", "orange");
    $("html").css("--tinker-darker-primary", "rgb(255, 140, 0)");
    $("html").css("--tinker-background-color", "rgb(22, 22, 22)");
    $("html").css("--tinker-background-shadow-color", "rgb(15, 15, 15)");
    $("html").css("--tinker-text-color", "white");
    $("html").css("--tinker-slider-background", "black");
    $("html").css("--tinker-slider-thumb", "#333");
    $("html").css("--tinker-slider-shadow", "#333");
}

function lightMode() {
    $("html").css("--tinker-primary-color", "rgb(94, 94, 248)");
    $("html").css("--tinker-darker-primary", "rgb(94, 94, 248)");
    $("html").css("--tinker-background-color", "white");
    $("html").css("--tinker-background-shadow-color", "rgb(0, 0, 0, 0)");
    $("html").css("--tinker-text-color", "black");
    $("html").css("--tinker-slider-background", "white");
    $("html").css("--tinker-slider-thumb", "rgb(0, 0, 0, 0)");
    $("html").css("--tinker-slider-shadow", "rgb(0, 0, 0, 0.2)");
}

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

function loadSlidersFromStorage() {
    const savedSliderData = JSON.parse(sessionStorage.getItem("sliderData"));

    if (savedSliderData.length > 0) {
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

function loadButtonsFromStorage() {
    const savedButtonData = JSON.parse(sessionStorage.getItem("buttonData"));

    if (savedButtonData.length > 0) {
        savedButtonData.forEach((buttonData, index) => {
            addTinkerButton();

            let cluster = $(".button-cluster").eq(index);
            cluster.find(".button-function-input").val(buttonData.functionInfo);
        });
    } else {
        addTinkerButton();
    }
}

function saveSettingsToStorage() {
    const settingsData = {
        displayMode: $("html").css("--current-display-mode"),
        backgroundColor: $("dev-container").css("background-color"),
    };

    sessionStorage.setItem("settingsData", JSON.stringify(settingsData));
}

function loadSettingsFromStorage() {
    const settingsData = JSON.parse(sessionStorage.getItem("settingsData"));

    if (settingsData.displayMode == "light") {
        lightMode();
    }

    $("dev-container").css("background-color", settingsData.backgroundColor);
}
