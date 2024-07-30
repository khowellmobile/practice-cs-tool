var buttonAssignments = {
    "b-1": `foo('hello')`,
    "b-2": `iterateChildren('#d1-2', 0)`,
    "b-3": `toggleOutline('#b-3')`,
    "b-4": null,
    "b-5": null,
    "b-6": null,
    "b-7": null,
    "b-8": null,
    "b-9": null,
    "b-10": null,
};

$(document).ready(function () {
    populateSliders();
    populateButtons();

    $(".sliderInput").on("change", function () {
        let parentId = $(this).parent().attr("id");
        $("sliderRange").val(sliderInputRange($(this).val(), parentId));
    });

    $(".sliderRange").on("input", function () {
        let parentId = $(this).parent().attr("id");
        e = $("#" + parentId + " > input[type=text]");
        e.val($(this).val());
    });

    iterateChildren("#d1-2", 0);

    $(".leaf").on("mouseenter", function () {
        let id = "#" + $(this).attr("id").slice(0, 2);

        $(id).addClass("hovered");

        if (!$(this).hasClass("clicked")) {
            addOutline(id);
        }
    });

    $(".leaf").on("click", function () {
        let id = "#" + $(this).attr("id").slice(0, 2);
        $(this).toggleClass("clicked");
    });

    $(".leaf").on("mouseleave", function () {
        let id = "#" + $(this).attr("id").slice(0, 2);

        $(id).removeClass("hovered");

        if (!$(this).hasClass("clicked")) {
            removeOutline(id);
        }
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
                <p>s${i}</p>
                <div id="s${i}" class="input-container">
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

function populateButtons() {
    // Loop to create and append the buttons
    for (var i = 1; i <= 10; i++) {
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

function iterateChildren(identifier, count) {
    var indent = "";

    for (let i = 0; i < count; i++) {
        indent = indent + "---";
    }

    $element = $(identifier);
    eId = $element.attr("id");
    eTag = $element.prop("tagName");

    console.log(identifier)

    var leaf = `
        <div id='${eId}-l' class='leaf'>
            <p>${indent}${eTag} ${eId}</p>
        </div>
    `;

    // Process the current element (for example, log its tag name)
    $("#tree-container").append(leaf);

    count++;

    // Iterate through each child element
    $element.children().each(function () {
        // Recursively call the function for each child
        iterateChildren($(this), count);
    });
}

function toggleOutline(id, colorChar) {
    $(`${id}`).toggleClass("outline" + colorChar);
}

function addOutline(id) {
    $(`${id}`).addClass("outlineO");
}

function removeOutline(id) {
    $(`${id}`).removeClass("outlineO");
}
