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

var activeElement = "";

$(document).ready(function () {
    populateSliders();
    populateButtons();
    populateSliderAssigns();

    $(".sliderInput").on("change", function () {
        let parentId = $(this).parent().attr("id");
        $("sliderRange").val(sliderInputRange($(this).val(), parentId));
    });

    $(".sliderRange").on("input", function () {
        let parentId = $(this).parent().attr("id");
        e = $("#" + parentId + " > input[type=text]");
        e.val($(this).val());
    });

    iterateChildren("#dev-container", "", "k", "1");

    $(".leaf").on("mouseenter", function () {
        let leafId = $(this).attr("leaf-id").slice(0, -2);

        $(`[leaf-id='${leafId}']`).addClass("hovered");
    });

    $(".leaf").on("click", function () {
        // Getting variables
        let leafId = $(this).attr("leaf-id").slice(0, -2);

        let element = $(`[leaf-id='${leafId}']`);
        activeElement = element;

        let tagName = element.prop("tagName");
        let id = element.attr("id") || "No ID";
        let classList = element.attr("class").split(" ") || "No Classes";

        $(this).toggleClass("clicked");

        $("#outline-check").prop("checked", element.hasClass("outlineP"));

        // Displaying needed information
        $("#e-classes").html("");
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
        toggleOutline($(this).is(":checked"))
    });
});

function sliderInputRange(num, id) {
    e1 = $("#" + id + " > input[type=range]");
    e2 = $("#" + id + " > input[type=text]");
    if (num > 5) {
        e1.val(5);
        e2.val(5);
    } else if (num < 0) {
        e1.val(0);
        e2.val(0);
    } else {
        e1.val(num);
        e2.val(num);
    }
}

function populateSliders() {
    // Number of sliders to add
    var numberOfSliders = 9;

    // Loop to create and append the sliders
    for (var i = 1; i <= numberOfSliders; i++) {
        var sliderHtml = `
            <div class="slider-container">
                <p>s-${i}</p>
                <div id="s-${i}" class="input-container">
                    <input
                        type="range"
                        min="0.00"
                        max="5.00"
                        step="0.01"
                        value="1.00"
                        class="sliderRange"
                    />
                    <input type="text" value="1.0" class="sliderInput"/>
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
