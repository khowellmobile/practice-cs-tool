$(document).ready(function () {
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
                        min="0"
                        max="100"
                        value="50"
                        class="sliderRange "
                    />
                    <input type="text" value="50" class="sliderInput"/>
                </div>
            </div>
        `;

        $("#d1-1").append(sliderHtml);
    }

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
    e = $("#" + id + " > input[type=range]");
    if (num > 100) {
        e.val(100);
    } else if (num < 0) {
        e.val(0);
    } else {
        e.val(num);
    }
}
