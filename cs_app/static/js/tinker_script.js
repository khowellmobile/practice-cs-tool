/**
 * This file contains functions to handle various UI interactions including button actions, slider operations,
 * and element manipulation within the dev-container and slider interfaces. Write all components in #dev-container.
 * Css For #dev-container may need small adjustments.
 *
 * Global Variables:
 * - buttonAssignments: Maps button IDs to corresponding functions to execute on click.
 * - leafStates: Tracks the state of leaf elements in the tree structure.
 * - sliderStates: Keeps track of the state of sliders and their configurations.
 * - activeElement: The currently active element in the UI.
 *
 * Functions:
 * - $(document).ready(function () { ... }): Initializes the page by populating elements, attaching event handlers.
 * - populateLeafs(identifier, indent, k, i): Recursively populates tree structure with leaf elements.
 * - getLeaf(eId, eTag, indent, k): Creates HTML for a leaf element based on its attributes.
 * - populateSliders(): Creates and appends slider elements to the page.
 * - populateSliderAssigns(): Creates and appends slider assignment elements to the page.
 * - populateButtons(): Creates and appends buttons with assigned actions to the page.
 * - attachLeafActionHandlers(): Attaches event handlers to leaf elements for interaction.
 * - attachSliderActionHandlers(): Attaches event handlers to sliders for user interactions.
 * - activateSlider(sliderId): Activates a slider and updates its state and visual indicators.
 * - deactivateSlider(sliderId): Deactivates a slider and updates its state and visual indicators.
 * - toggleOutline(outlineOn): Toggles the outline appearance of the active element.
 * - toggleOutlineAll(identifier): Toggles the outline appearance for all elements within a given container.
 * - changeCss(parentId, val): Updates the CSS property of an element based on slider input.
 */

var buttonAssignments = {
    "b-1": `foo()`,
    "b-2": "fade1()",
    "b-3": "fade2()",
    "b-4": null,
    "b-5": null,
    "b-6": null,
    "b-7": null,
    "b-8": null,
    "b-9": null,
    "b-10": null,
};

/*----------------------------------- Dev Functions Go Here -----------------------------------*/

function foo() {
    alert("hello!");
}

$(".form__input")
    .on("focus", function () {
        $(this).parent().css("border-bottom", "2px solid rgb(105, 105, 236)");
    })
    .on("blur", function () {
        $(this).parent().css("border-bottom", "2px solid rgb(114, 114, 134)");
    });

/*---------------------------------------------------------------------------------------------*/

/**
 * Functions written below are used to run the ui and functionality of the page.
 */

// Generic object added for clarity.
// Other objects added in populateLeafs().
var leafStates = {
    "k-?-l": {
        "k-value": null,
        "slider-id": null,
    },
};

// Generic object added for clarity.
// Other objects added in populateSliders().
var sliderStates = {
    "s-?": {
        "slider-assign-id": "s-?-a",
        "k-l": null,
        units: null,
        property: null,
        assigned: false,
    },
};

var activeElement = "";

/**
 * Initializes the page by populating elements, attaching event handlers, and setting up listeners.
 *
 * This function is called when the document is ready. It populates leaf elements, sliders, slider assignments,
 * and attaches event handlers to sliders and leaf elements. It also sets up change listeners for outline checkboxes.
 */
$(document).ready(function () {
    // Populating page elements
    populateLeafs("#dev-container", "", "k", "1");
    populateSliders();
    populateSliderAssigns();
    populateButtons();

    // Attaching listeners to sliders
    attachSliderActionHandlers();

    // Attaching listeners to leafs
    attachLeafActionHandlers();

    $("#outline-check").on("change", function () {
        toggleOutline($(this).is(":checked"));
    });

    $("#outline-check-all").on("change", function () {
        toggleOutlineAll("#dev-container");
    });
});

/**
 * Recursively populates tree structure with leaf elements.
 *
 * @param {string} identifier - The jQuery selector to identify the parent element.
 * @param {string} indent - The current indentation level for visual representation.
 * @param {string} k - The key value used to track the leaf element.
 * @param {string} i - The index used for numbering child elements.
 */
function populateLeafs(identifier, indent, k, i) {
    $element = $(identifier);
    eId = $element.attr("id");
    eTag = $element.prop("tagName");

    $element.attr("k-value", k);

    var leaf = getLeaf(eId, eTag, indent, k);

    leafStates[k + "-l"] = {
        "k-value": k,
        "slider-id": null,
    };

    $("#tree-container").append(leaf);

    $element.children().each(function () {
        // Recursive call
        populateLeafs($(this), indent + "---", k + "-" + i++, 1);
    });
}

/**
 * Creates HTML for a leaf element based on its attributes.
 *
 * @param {string} eId - The ID of the element.
 * @param {string} eTag - The tag name of the element.
 * @param {string} indent - The current indentation level for visual representation.
 * @param {string} k - The key value used to track the leaf element.
 * @returns {string} - The HTML string for the leaf element.
 */
function getLeaf(eId, eTag, indent, k) {
    if (eId == undefined) {
        eId = "";
    }

    var leaf = `<div class="leaf" k-value='${k}-l'>
            <div>${indent}<p>${eTag} ${eId}</p></div><div class='indicators-div'></div>
        </div>
    `;

    return leaf;
}

/**
 * Creates and appends slider elements to the page.
 *
 * This function generates slider HTML for a predefined number of sliders and appends them to the container.
 * It also initializes the sliderStates object with relevant slider information.
 */
function populateSliders() {
    // Number of sliders to add
    var numberOfSliders = 9;

    for (var i = 1; i <= numberOfSliders; i++) {
        var sliderHtml = `
            <div class="slider-container">
                <span>s-${i}</span>
                <input type="text" value="1.0" class="sliderInput"/>
                <div id="s-${i}" class="input-container">
                    <input type="text" value="0.0" class="slider-start"/>
                    <input
                        type="range"
                        min="0.00"
                        max="10.0"
                        step="0.01"
                        value="1.00"
                        class="sliderRange"
                    />
                    <input type="text" value="10.0" class="slider-end"/>
                </div>
            </div>
        `;

        $("#d1-1").append(sliderHtml);

        sliderStates["s-" + i] = {
            "slider-assign-id": `s-${i}-a`,
            "k-l": null,
            units: null,
            property: null,
            assigned: false,
        };
    }
}

/**
 * Creates and appends slider assignment elements to the page.
 *
 * This function generates HTML for slider assignment options and appends them to the element options container.
 */
function populateSliderAssigns() {
    let e = $("#element-options__slider-assigns");
    for (let i = 1; i <= 9; i++) {
        e.append(
            `
            <div id="s-${i}-a" class="grid-item mini-card">
                <div class='dot dot-hallow'></div>
                <span>s-${i}</span>
                <input type="text" placeholder="" class="slider-prop"/>
                <select id="unit-select" class="slider-units">
                    <option value="" disabled selected></option>
                    <option value="px">px</option>
                    <option value="em">em</option>
                    <option value="rem">rem</option>
                    <option value="%">%</option>
                </select>
            </div>
            `
        );
    }
}

/**
 * Creates and appends buttons with assigned actions to the page.
 *
 * This function generates HTML for buttons based on the buttonAssignments object and appends them to the container.
 */
function populateButtons() {
    // Loop to create and append the buttons
    for (let i = 1; i <= 10; i++) {
        let id = "b-" + i;
        var buttonHtml = `
            <button 
                id="${id}" 
                class="button-1" 
                onclick="${buttonAssignments[id]}"
            >${id}</button>
        `;

        $("#d2-1").append(buttonHtml);
    }
}

/**
 * Attaches event handlers to leaf elements for interaction.
 *
 * This function sets up mouse enter, click, and mouse leave event handlers to manage leaf element behavior
 * and update the active element's information.
 */
function attachLeafActionHandlers() {
    $(".leaf").on("mouseenter", function () {
        let k = $(this).attr("k-value").slice(0, -2);

        $(`[k-value='${k}']`).addClass("hovered");
    });

    $(".leaf").on("click", function () {
        // Getting/setting variables
        const k = $(this).attr("k-value").slice(0, -2);
        const element = $(`[k-value='${k}']`);
        const tagName = element.prop("tagName");
        const id = element.attr("id") || "No ID";
        const classList = element.attr("class").split(/\s+/) || "No Classes";

        activeElement = element;

        $(this).toggleClass("clicked");

        $("#outline-check").prop("checked", element.hasClass("outlineP"));

        $("#e-classes").empty();

        for (e in classList) {
            $("#e-classes").append(`<li>${classList[e]}</li>`);
        }
        $("#e-tag").html(`<b>Tag Name: </b>${tagName}`);
        $("#e-id").html(`<b>Id: </b>${id}`);
    });

    $(".leaf").on("mouseleave", function () {
        let k = $(this).attr("k-value").slice(0, -2);

        $(`[k-value='${k}']`).removeClass("hovered");
    });
}

/**
 * Attaches event handlers to sliders for user interactions.
 *
 * This function sets up input change and range input event handlers to update slider values and CSS properties.
 */
function attachSliderActionHandlers() {
    $(".sliderRange").on("input", function () {
        let parentId = $(this).parent().attr("id");
        e = $("#" + parentId).prev("input");
        e.val($(this).val());

        changeCss(parentId, $(this).val());
    });

    $(".sliderInput").on("change", function () {
        let parent = $(this).next("div");
        e = parent.children().eq(1);
        e.val($(this).val());

        let parentId = parent.attr("id");

        changeCss(parentId, $(this).val());
    });

    $(".slider-start").on("change", function () {
        e = $(this).next("input");
        e.attr("min", $(this).val());
    });

    $(".slider-end").on("change", function () {
        e = $(this).prev("input");
        e.attr("max", $(this).val());
    });

    $(".slider-prop").on("change", function () {
        sliderId = $(this).parent().attr("id").slice(0, -2);

        sliderStates[sliderId]["property"] = $(this).val();
    });

    $(".slider-units").on("change", function () {
        sliderId = $(this).parent().attr("id").slice(0, -2);

        sliderStates[sliderId]["units"] = $(this).val();
    });

    $(".grid-item .dot").on("click", function () {
        sliderId = $(this).parent().attr("id").slice(0, -2);
        sliderStates[sliderId]["k-l"] = activeElement.attr("k-l");

        if ($(this).hasClass("dot-hallow")) {
            activateSlider(sliderId);
        } else {
            deactivateSlider(sliderId);
        }

        $(this).toggleClass("dot-hallow dot-solid");
    });
}

/**
 * Activates a slider and updates its state and visual indicators.
 *
 * @param {string} sliderId - The ID of the slider to be activated.
 */
function activateSlider(sliderId) {
    kL = activeElement.attr("k-value") + "-l";
    sliderNum = sliderId[sliderId.length - 1];

    leafStates[kL]["slider-id"] = sliderId;
    sliderStates[sliderId]["k-l"] = kL;
    sliderStates[sliderId]["assigned"] = true;

    $(`[k-value='${kL}'] > .indicators-div`).append(
        `<div id='dot-${sliderNum}'class='dot dot-solid'><b>${sliderNum}</b></div>`
    );
}

/**
 * Deactivates a slider and updates its state and visual indicators.
 *
 * @param {string} sliderId - The ID of the slider to be deactivated.
 */
function deactivateSlider(sliderId) {
    kL = activeElement.attr("k-value") + "-l";
    sliderNum = sliderId[sliderId.length - 1];

    leafStates[kL]["slider-id"] = "";
    sliderStates[sliderId]["k-l"] = "";
    sliderStates[sliderId]["assigned"] = false;

    $(`#dot-${sliderNum}`).remove();
}

/**
 * Toggles the outline appearance of the active element.
 *
 * @param {boolean} outlineOn - Whether to turn the outline on or off.
 */
function toggleOutline(outlineOn) {
    kL = activeElement.attr("k-value") + "-l";

    if (outlineOn) {
        activeElement.addClass("outlineP");
        $(`[k-value='${kL}'] > .indicators-div`).append("<div class='blue-box'></div>");
    } else {
        activeElement.removeClass("outlineP");
        $(`[k-value='${kL}'] > .indicators-div .blue-box`).remove();
    }
}

/**
 * Toggles the outline appearance for all elements within a given container.
 *
 * @param {string} identifier - The jQuery selector to identify the container element.
 */
function toggleOutlineAll(identifier) {
    $element = $(identifier);

    $element.toggleClass("outlineR");

    $element.children().each(function () {
        toggleOutlineAll($(this));
    });
}

/**
 * Updates the CSS property of an element based on slider input.
 *
 * @param {string} parentId - The ID of the slider container element.
 * @param {string} val - The value from the slider input to set.
 */
function changeCss(parentId, val) {
    let units = sliderStates[parentId]["units"];
    let property = sliderStates[parentId]["property"];
    let kL = sliderStates[parentId]["k-l"];
    let kval = leafStates[kL]["k-value"];

    if (units == null) {
        units = "";
    }

    element = $(`[k-value='${kval}']`);

    console.log(property, val + units);

    element.css(property, val + units);
}
