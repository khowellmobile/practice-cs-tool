function foo() {
    let e1 = $("#d1-2-1");
    let e2 = $("#d1-2-2");
    let e3 = $("#d1-2-3");

    if (e1.hasClass("up")) {
        setTimeout(() => {
            e1.removeClass("up");
        }, 300); 
        setTimeout(() => {
            e2.removeClass("down");
        }, 600); 
        setTimeout(() => {
            e3.removeClass("up");
        }, 900); 
    } else {
        setTimeout(() => {
            e1.addClass("up");
        }, 300); 
        setTimeout(() => {
            e2.addClass("down");
        }, 600); 
        setTimeout(() => {
            e3.addClass("up");
        }, 900);
    }
}
