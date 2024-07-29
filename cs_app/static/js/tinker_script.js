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
                        class="sliderRange "
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
        var buttonHtml = `
            <button id="b-${i}" class="button-1">Place Holder</button>
        `;

        $("#d2-1").append(buttonHtml);
    }
}
