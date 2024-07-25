$(".sliderInput").on("change", function () {
    let parentId = $(this).parent().attr("id");
    $("sliderRange").val(sliderInputRange($(this).val(), parentId));
});

$(".sliderRange").on("input", function () {
    let parentId = $(this).parent().attr("id");
    e = $("#" + parentId + " > input[type=text]");
    e.val($(this).val());
    
    console.log("hi")
})

function sliderInputRange(num, id) {
    e = $("#" + id + " > input[type=range]");
    console.log(s);
    if (num > 100) {
        e.val(100);
    } else if (num < 0) {
        e.val(0);
    } else {
        e.val(num);
    }
}
