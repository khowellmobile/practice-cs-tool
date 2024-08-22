const genRepScript = require("../static/js/generate_report_script");
const { JSDOM } = require("jsdom");

describe("throttle function", () => {
    let dom;

    beforeEach(() => {
        dom = new JSDOM(`<!DOCTYPE html><div></div>`);
        global.document = dom.window.document;
        global.window = dom.window;
        global.$ = require("jquery")(dom.window);

        jest.useFakeTimers();
    });

    afterEach(() => {
        dom.window.close();
        jest.useRealTimers();
    });

    test("should call the function at most once per delay period", () => {
        const mockFunc = jest.fn();
        const throttledFunc = genRepScript.throttle(mockFunc, 100);

        throttledFunc();
        throttledFunc();

        expect(mockFunc).toHaveBeenCalledTimes(1);

        jest.advanceTimersByTime(100);

        throttledFunc();
        expect(mockFunc).toHaveBeenCalledTimes(2);
    });

    test("should call the function with the correct arguments", () => {
        const mockFunc = jest.fn();
        const throttledFunc = genRepScript.throttle(mockFunc, 100);

        throttledFunc();

        jest.advanceTimersByTime(100);

        expect(mockFunc).toHaveBeenCalledWith();
    });

    test("should handle multiple calls during the throttle period correctly", () => {
        const mockFunc = jest.fn();
        const throttledFunc = genRepScript.throttle(mockFunc, 100);

        throttledFunc();
        throttledFunc();
        throttledFunc();

        expect(mockFunc).toHaveBeenCalledTimes(1);

        jest.advanceTimersByTime(100);

        throttledFunc();
        expect(mockFunc).toHaveBeenCalledTimes(2);
    });
});

describe("toggleClassDisplay function", () => {
    let dom;

    beforeEach(() => {
        dom = new JSDOM(`
            <!DOCTYPE html>
                <div>
                    <div class="expanded-info"></div>
                    <div class="symbol"></div>
                </div>`
        );
        global.document = dom.window.document;
        global.window = dom.window;
        global.$ = require("jquery")(dom.window);
    });

    afterEach(() => {
        dom.window.close();
    });

    test("should hide elements of class symbol and show expanded-info when true", () => {
        $(".expanded-info").css("display", "none");
        $(".symbol").css("display", "flex");

        genRepScript.toggleClassDisplay(true);

        expect($(".expanded-info").css("display")).toBe("flex");
        expect($(".symbol").css("display")).toBe("none");
    });

    test("should show elements of class symbol and hide expanded-info when false", () => {
        $(".expanded-info").css("display", "flex");
        $(".symbol").css("display", "none");

        genRepScript.toggleClassDisplay(false);

        expect($(".expanded-info").css("display")).toBe("none");
        expect($(".symbol").css("display")).toBe("flex");
    });
});

describe("toggleSize function", () => {
    let dom;

    beforeEach(() => {
        dom = new JSDOM(`
            <!DOCTYPE html>
                <div>
                    <div id="element_1"></div>
                    <div id="element_2"></div>
                </div>`
        );
        global.document = dom.window.document;
        global.window = dom.window;
        global.$ = require("jquery")(dom.window);
    });

    afterEach(() => {
        dom.window.close();
    });

    test("should toggle classes starting with historySmall and reportLarge", () => {
        let e1 = $("#element_1").css("display", "none");
        let e2 = $("#element_2").css("display", "flex");

        e1.addClass("historySmall")
        e2.addClass("reportLarge");

        genRepScript.toggleSize("element_1", "element_2");

        expect(e1.hasClass("historyLarge")).toBe(true);
        expect(e1.hasClass("historySmall")).toBe(false);
        expect(e2.hasClass("reportSmall")).toBe(true);
        expect(e2.hasClass("reportLarge")).toBe(false);
    });

    test("should toggle classes starting with historyLarge and reportSmall", () => {
        let e1 = $("#element_1").css("display", "none");
        let e2 = $("#element_2").css("display", "flex");

        e1.addClass("historyLarge")
        e2.addClass("reportSmall");

        genRepScript.toggleSize("element_1", "element_2");

        expect(e1.hasClass("historyLarge")).toBe(false);
        expect(e1.hasClass("historySmall")).toBe(true);
        expect(e2.hasClass("reportSmall")).toBe(false);
        expect(e2.hasClass("reportLarge")).toBe(true);
    });
});


