var buttonAssignments = {
    "b-1": `foo('hello')`,
    "b-2": `iterateChildren('#d1-2', 0)`,
    "b-3": `toggleOutline('#b-3')`,
    "b-4": `createCustomIds('#dev-container', 'k', 1)`,
    "b-5": null,
    "b-6": null,
    "b-7": null,
    "b-8": null,
    "b-9": null,
    "b-10": null,
};

var sliderStates = {
    "s-1": null,
    "s-2": null,
    "s-3": null,
    "s-4": null,
    "s-5": null,
    "s-6": null,
    "s-7": null,
    "s-8": null,
    "s-9": null,
};

var activeElement = "";

$(document).ready(function () {
    populateSliders();
    populateButtons();
    populateSliderAssigns();

    $(".sliderRange").on("input", function () {
        let parentId = $(this).parent().attr("id");
        e = $("#" + parentId).prev("input");
        e.val($(this).val());
    });

    $(".slider-start").on("change", function () {
        e = $(this).next("input");
        e.attr("min", $(this).val());
    });

    $(".slider-end").on("change", function () {
        e = $(this).prev("input");
        e.attr("max", $(this).val());
    });

    iterateChildren("#dev-container", "", "k", "1");

    $(".leaf").on("mouseenter", function () {
        let leafId = $(this).attr("leaf-id").slice(0, -2);

        $(`[leaf-id='${leafId}']`).addClass("hovered");
    });

    $(".leaf").on("click", function () {
        // Getting/setting variables
        const leafId = $(this).attr("leaf-id").slice(0, -2);
        const element = $(`[leaf-id='${leafId}']`);
        const tagName = element.prop("tagName");
        const id = element.attr("id") || "No ID";
        const classList = element.attr("class").split(/\s+/) || "No Classes";

        activeElement = element;

        $(this).toggleClass("clicked");

        $("#outline-check").prop("checked", element.hasClass("outlineP"));

        // Displaying needed information
        $("#e-classes").empty();

        for (e in classList) {
            $("#e-classes").append(`<li>${classList[e]}</li>`);
        }
        $("#e-tag").html(`<b>Tag Name: </b>${tagName}`);
        $("#e-id").html(`<b>Id: </b>${id}`);
    });

    $(".leaf").on("mouseleave", function () {
        let leafId = $(this).attr("leaf-id").slice(0, -2);

        $(`[leaf-id='${leafId}']`).removeClass("hovered");
    });

    $("#outline-check").on("change", function () {
        toggleOutline($(this).is(":checked"));
    });
});

function populateSliders() {
    // Number of sliders to add
    var numberOfSliders = 9;

    // Loop to create and append the sliders
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
    }
}

function populateSliderAssigns() {
    let e = $("#element-options__slider-assigns");
    for (let i = 1; i < 10; i++) {
        e.append(
            `
            <div class="grid-item mini-card">
                <span>s-${i}</span>
                <select id="dropdown" name="options">
                    <option value="" disabled selected></option>
                    <option value="height">Height</option>
                    <option value="width">Width</option>
                    <option value="margin">Margin</option>
                    <option value="padding">Padding</option>
                </select>
                <input type="text" id="sa-${i}" placeholder="" />
            </div>
            `
        );
    }
}

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

function foo(str) {}

function iterateChildren(identifier, indent, k, i) {
    $element = $(identifier);
    eId = $element.attr("id");
    eTag = $element.prop("tagName");

    $element.attr("leaf-id", k);

    var leaf = getLeaf(eId, eTag, indent, k);

    $("#tree-container").append(leaf);

    $element.children().each(function () {
        // Recursively call the function for each child
        iterateChildren($(this), indent + "---", k + "-" + i++, 1);
    });
}

function getLeaf(eId, eTag, indent, k) {
    if (eId == undefined) {
        eId = "";
    }

    var leaf = `
        <div class='leaf' leaf-id='${k}-l'>
            <p>${indent}${eTag} ${eId}</p>
        </div>
    `;

    return leaf;
}

function toggleOutline(outlineOn) {
    if (outlineOn) {
        activeElement.addClass("outlineP");
    } else {
        activeElement.removeClass("outlineP");
    }
}

function sliderAssignHandler(element) {}
