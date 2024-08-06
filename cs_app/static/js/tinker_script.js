var buttonAssignments = {
    "b-1": `foo()`,
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
    "s-1": {
        "leaf-id": null,
        units: null,
        property: null,
    },
    "s-2": {
        "leaf-id": null,
        units: null,
        property: null,
    },
    "s-3": {
        "leaf-id": null,
        units: null,
        property: null,
    },
    "s-4": {
        "leaf-id": null,
        units: null,
        property: null,
    },
    "s-5": {
        "leaf-id": null,
        units: null,
        property: null,
    },
    "s-6": {
        "leaf-id": null,
        units: null,
        property: null,
    },
    "s-7": {
        "leaf-id": null,
        units: null,
        property: null,
    },
    "s-8": {
        "leaf-id": null,
        units: null,
        property: null,
    },
    "s-9": {
        "leaf-id": null,
        units: null,
        property: null,
    },
};

var activeElement = "";

$(document).ready(function () {
    // Populating page with needed elements
    populateSliders();
    populateButtons();
    populateSliderAssigns();
    populateLeafs("#dev-container", "", "k", "1");

    // Attaching listeners to sliders
    attachSliderActionHandlers();

    // Attaching listenders to leafs
    attachLeafActionHandlers();

    $("#outline-check").on("change", function () {
        toggleOutline($(this).is(":checked"));
    });
});

function foo() {
    console.log(sliderStates);
}

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
    for (let i = 1; i <= 9; i++) {
        e.append(
            `
            <div id="s-${i}-a" class="grid-item mini-card">
                <div class='dot blue-dot-hallow'></div>
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

function attachSliderActionHandlers() {
    $(".sliderRange").on("input", function () {
        let parentId = $(this).parent().attr("id");
        e = $("#" + parentId).prev("input");
        e.val($(this).val());
    });

    $(".sliderInput").on("change", function () {
        let parent = $(this).next("div");
        e = parent.children().eq(1);

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

    $(".slider-prop").on("change", function () {
        sliderId = $(this).parent().attr("id").slice(0, -2);

        sliderStates[sliderId]["property"] = $(this).val();
    });

    $(".slider-units").on("change", function () {
        sliderId = $(this).parent().attr("id").slice(0, -2);

        sliderStates[sliderId]["units"] = $(this).val();
    });

    $(".grid-item .dot").on("click", function () {
        $(this).toggleClass("blue-dot-hallow blue-dot-solid");

        sliderId = $(this).parent().attr("id").slice(0, -2);
        sliderStates[sliderId]["leaf-id"] = activeElement.attr("leaf-id");

        activateSlider();
    });
}

function attachLeafActionHandlers() {
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
}

function populateLeafs(identifier, indent, k, i) {
    $element = $(identifier);
    eId = $element.attr("id");
    eTag = $element.prop("tagName");

    $element.attr("leaf-id", k);

    var leaf = getLeaf(eId, eTag, indent, k);

    $("#tree-container").append(leaf);

    $element.children().each(function () {
        // Recursively call the function for each child
        populateLeafs($(this), indent + "---", k + "-" + i++, 1);
    });
}

function getLeaf(eId, eTag, indent, k) {
    if (eId == undefined) {
        eId = "";
    }

    var leaf = `
        <div class='leaf' leaf-id='${k}-l'>
            <div>${indent}<p>${eTag} ${eId}</p></div><div class='indicators-div'></div>
        </div>
    `;

    return leaf;
}

function toggleOutline(outlineOn) {
    leafId = activeElement.attr("leaf-id") + "-l";

    if (outlineOn) {
        activeElement.addClass("outlineP");
        $(`[leaf-id='${leafId}'] > .indicators-div`).append("<div class='blue-box'></div>");
    } else {
        activeElement.removeClass("outlineP");
        $(`[leaf-id='${leafId}'] > .indicators-div .blue-box`).remove();
    }
}

function activateSlider() {
    leafId = activeElement.attr("leaf-id") + "-l";

    console.log(leafId)
    $(`[leaf-id='${leafId}'] > .indicators-div`).append("<div class='dot blue-dot-solid'><b>1</b></div>");
}