function foo(id, size) {
    $("#" + id).css("width", size);
}

/** 
function toggleSize(elementId, size1, size2) {
    let delta = 0.01;
    let parentWidth = $("#content").width();
    let childWidth = $("#" + elementId).width();

    let width = (childWidth / parentWidth) * 100;

    var sideBar = $("#" + elementId);
    var c2 = $("#c2");

    if (width <= size1 + delta && width >= size1 - delta) {
        sideBar.css("width", size2 + "%");
        c2.css("width", "95%");
    } else {
        sideBar.css("width", size1 + "%");
        c2.css("width", "80%");
    }
}

*/

// toggleSize(id, 5, 20);
function toggleSize(eId, smallPercent, largePercent) {
    let delta = 0.1;
    let e = $("#" + eId);
    let e2 = $("#c2");

    let pWidth = $("#content").width();
    let cWidth = e.width();

    let lSize = (largePercent / 100) * pWidth;

    if (cWidth <= lSize - delta) {
        e.css("width", largePercent + "%");
        e2.css("width", "80%");
    } else {
        e.css("width", smallPercent + "%");
        e2.css("width", "97%");
    }
}
