const directionsScript = require("../static/js/directions_script");
const { JSDOM } = require("jsdom");

describe("classToggleTimeout function", () => {
    let dom;

    beforeEach(() => {
        dom = new JSDOM(
            `<!DOCTYPE html>
                <div>
                    <div id="test" class="classA"></div>
                </div>`
        );
        global.document = dom.window.document;
        global.window = dom.window;
        global.$ = require("jquery")(dom.window);

        clock = jest.useFakeTimers();

        consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    });

    afterEach(() => {
        consoleWarnSpy.mockRestore();
        dom.window.close();

        jest.useRealTimers();
    });

    test("should add classB after a 0.5s timeout", () => {
        let testElement = $("#test");

        directionsScript.classToggleTimeout(testElement, true, "classB", 500);

        expect(testElement.hasClass("classB")).toBe(false);

        clock.advanceTimersByTime(550);

        expect(testElement.hasClass("classB")).toBe(true);
    });

    test("should remove classA after a 0.5s timeout", () => {
        let testElement = $("#test");

        directionsScript.classToggleTimeout(testElement, false, "classA", 500);

        expect(testElement.hasClass("classA")).toBe(true);

        clock.advanceTimersByTime(550);

        expect(testElement.hasClass("classA")).toBe(false);
    });

    test("should warn a message if element is empty or non-jQuery", () => {
        directionsScript.classToggleTimeout(null, true, "classB", 500);

        expect(consoleWarnSpy).toHaveBeenCalledWith("Invalid or empty jQuery element provided.");

        consoleWarnSpy.mockClear();

        directionsScript.classToggleTimeout($(), true, "classB", 500);

        expect(consoleWarnSpy).toHaveBeenCalledWith("Invalid or empty jQuery element provided.");
    });

    test("should warn a message if cssClass is not a string or is empty", () => {
        let testElement = $("#test");

        directionsScript.classToggleTimeout(testElement, true, 123, 500);

        expect(consoleWarnSpy).toHaveBeenCalledWith("Invalid CSS class provided.");

        consoleWarnSpy.mockClear();

        directionsScript.classToggleTimeout(testElement, true, "", 500);

        expect(consoleWarnSpy).toHaveBeenCalledWith("Invalid CSS class provided.");
    });

    test("should warn a message if timeout is not a number or is <= 0", () => {
        let testElement = $("#test");

        directionsScript.classToggleTimeout(testElement, true, "classB", "500");

        expect(consoleWarnSpy).toHaveBeenCalledWith("Invalid timeout value provided.");

        consoleWarnSpy.mockClear();

        directionsScript.classToggleTimeout(testElement, true, "classB", -500);

        expect(consoleWarnSpy).toHaveBeenCalledWith("Invalid timeout value provided.");
    });
});

describe("testing getter and setter functions", () => {
    test("should set proper currentActiveId and get currentActiveId", () => {
        directionsScript.setCurrentActiveId("newActiveId");

        expect(directionsScript.getCurrentActiveId()).toBe("newActiveId");
    });

    test("should set proper currentActiveSubSlide and get CurrentActiveSubSlide", () => {
        directionsScript.setCurrentActiveSubSlide("newSlide");

        expect(directionsScript.getCurrentActiveSubSlide()).toBe("newSlide");
    });

    test("should set proper lockTabs and get lockTabs", () => {
        directionsScript.setLockTabs(true);

        expect(directionsScript.getLockTabs()).toBe(true);

        directionsScript.setLockTabs(false);

        expect(directionsScript.getLockTabs()).toBe(false);
    });

    test("should set proper lockSubSlides and get lockSubSlides", () => {
        directionsScript.setLockSubSlides(true);

        expect(directionsScript.getLockSubSlides()).toBe(true);

        directionsScript.setLockSubSlides(false);

        expect(directionsScript.getLockSubSlides()).toBe(false);
    });
});

describe("switchSubSlide function", () => {
    let dom;

    beforeEach(() => {
        dom = new JSDOM(
            `<!DOCTYPE html>
                <div>
                    <div id="slide1"></div>
                    <div id="slide2" style="display: none;"></div>
                </div>`
        );

        clock = jest.useFakeTimers();

        global.document = dom.window.document;
        global.window = dom.window;
        global.$ = require("jquery")(dom.window);
    });

    afterEach(() => {
        dom.window.close();
        jest.useRealTimers();
    });

    test("should switch subslides and apply classes correctly", () => {
        let slide1 = $("#slide1");
        let slide2 = $("#slide2");
        directionsScript.setCurrentActiveSubSlide("slide1");
        directionsScript.setLockSubSlides(false);

        slide1.addClass("scaleUp");
        slide2.addClass("scaleDown");

        // Check initial state
        expect(slide1.hasClass("scaleUp")).toBe(true);
        expect(slide1.hasClass("scaleDown")).toBe(false);
        expect(slide2.hasClass("scaleUp")).toBe(false);
        expect(slide2.hasClass("scaleDown")).toBe(true);

        // Run Function
        directionsScript.switchSubSlide("slide2");

        clock.advanceTimersByTime(600);

        // Check final state
        expect(slide1.hasClass("scaleUp")).toBe(false);
        expect(slide1.hasClass("scaleDown")).toBe(true);
        expect(slide2.hasClass("scaleUp")).toBe(true);
        expect(slide2.hasClass("scaleDown")).toBe(false);
        expect(slide1.css("display")).toBe("none");
        expect(slide2.css("display")).toBe("flex");
        expect(directionsScript.getCurrentActiveSubSlide()).toBe("slide2");
    });

    test("should now allow slide change when locked", () => {
        directionsScript.setCurrentActiveSubSlide("slide1");
        directionsScript.setLockSubSlides(false);

        directionsScript.switchSubSlide("slide2");

        clock.advanceTimersByTime(50);

        expect(directionsScript.getLockSubSlides()).toBe(true);

        clock.advanceTimersByTime(550);

        expect(directionsScript.getLockSubSlides()).toBe(false);
    });
});

describe("showDoubleSlides function", () => {
    let dom;

    beforeEach(() => {
        dom = new JSDOM(
            `<!DOCTYPE html>
                <div>
                    <div id="slides__test__1" class="up" style="display: none;"></div>
                    <div id="slides__test__2" class="down" style="display: none;"></div>
                </div>`
        );

        clock = jest.useFakeTimers();

        global.document = dom.window.document;
        global.window = dom.window;
        global.$ = require("jquery")(dom.window);
    });

    afterEach(() => {
        dom.window.close();
        jest.useRealTimers();
    });

    test("should show slides and apply classes correctly", async () => {
        slide1 = $("#slides__test__1");
        slide2 = $("#slides__test__2");

        slide1.addClass("up");
        slide2.addClass("down");

        directionsScript.showDoubleSlides("test");

        expect(slide1.css("display")).toBe("flex");
        expect(slide2.css("display")).toBe("flex");

        clock.advanceTimersByTime(155);

        expect(slide1.hasClass("up")).toBe(false);
        expect(slide2.hasClass("down")).toBe(true);

        clock.advanceTimersByTime(155);

        expect(slide1.hasClass("down")).toBe(false);
    });

    test("should warn when elements are not found", async () => {
        consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

        directionsScript.showDoubleSlides("doesNotExist");

        expect(consoleWarnSpy).toHaveBeenCalledWith("Element not found.");

        consoleWarnSpy.mockRestore();
    });
});

describe("hideDoubleSlides function", () => {
    let dom;

    beforeEach(() => {
        dom = new JSDOM(
            `<!DOCTYPE html>
                <div>
                    <div id="slides__test__1" style="display: flex;"></div>
                    <div id="slides__test__2" style="display: flex;"></div>
                </div>`
        );

        clock = jest.useFakeTimers();

        global.document = dom.window.document;
        global.window = dom.window;
        global.$ = require("jquery")(dom.window);
    });

    afterEach(() => {
        dom.window.close();
        jest.useRealTimers();
    });

    test("should hide slides and apply classes correctly", async () => {
        slide1 = $("#slides__test__1");
        slide2 = $("#slides__test__2");

        directionsScript.hideDoubleSlides("test");

        clock.advanceTimersByTime(155);

        expect(slide1.hasClass("up")).toBe(true);
        expect(slide2.hasClass("down")).toBe(false);

        clock.advanceTimersByTime(155);

        expect(slide2.hasClass("down")).toBe(true);

        clock.advanceTimersByTime(905);

        expect(slide1.css("display")).toBe("none");
        expect(slide2.css("display")).toBe("none");
    });

    test("should warn when elements are not found", async () => {
        consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

        directionsScript.hideDoubleSlides("doesNotExist");

        expect(consoleWarnSpy).toHaveBeenCalledWith("Element not found.");

        consoleWarnSpy.mockRestore();
    });
});

describe("showTripleSlides function", () => {
    let dom;

    beforeEach(() => {
        dom = new JSDOM(
            `<!DOCTYPE html>
                <div>
                    <div id="slides__overview__1" class="up" style="display: none;"></div>
                    <div id="slides__overview__2" class="down" style="display: none;"></div>
                    <div id="slides__overview__3" class="up" style="display: none;"></div>
                </div>`
        );

        clock = jest.useFakeTimers();

        global.document = dom.window.document;
        global.window = dom.window;
        global.$ = require("jquery")(dom.window);
    });

    afterEach(() => {
        dom.window.close();
        jest.useRealTimers();
    });

    test("should show slides and apply classes correctly", async () => {
        slide1 = $("#slides__overview__1");
        slide2 = $("#slides__overview__2");
        slide3 = $("#slides__overview__3");

        directionsScript.showTripleSlides();

        expect(slide1.css("display")).toBe("flex");
        expect(slide2.css("display")).toBe("flex");
        expect(slide3.css("display")).toBe("flex");

        clock.advanceTimersByTime(155);

        expect(slide1.hasClass("up")).toBe(false);
        expect(slide2.hasClass("down")).toBe(true);
        expect(slide3.hasClass("up")).toBe(true);

        clock.advanceTimersByTime(155);

        expect(slide2.hasClass("down")).toBe(false);
        expect(slide3.hasClass("up")).toBe(true);

        clock.advanceTimersByTime(155);

        expect(slide3.hasClass("up")).toBe(false);
    });
});

describe("hideTripleSlides function", () => {
    let dom;

    beforeEach(() => {
        dom = new JSDOM(
            `<!DOCTYPE html>
                <div>
                    <div id="slides__overview__1" style="display: flex;"></div>
                    <div id="slides__overview__2" style="display: flex;"></div>
                    <div id="slides__overview__3" style="display: flex;"></div>
                </div>`
        );

        clock = jest.useFakeTimers();

        global.document = dom.window.document;
        global.window = dom.window;
        global.$ = require("jquery")(dom.window);
    });

    afterEach(() => {
        dom.window.close();
        jest.useRealTimers();
    });

    test("should hide slides and apply classes correctly", async () => {
        slide1 = $("#slides__overview__1");
        slide2 = $("#slides__overview__2");
        slide3 = $("#slides__overview__3");

        directionsScript.hideTripleSlides();

        clock.advanceTimersByTime(155);

        expect(slide1.hasClass("up")).toBe(true);
        expect(slide2.hasClass("down")).toBe(false);
        expect(slide3.hasClass("up")).toBe(false);

        clock.advanceTimersByTime(155);

        expect(slide2.hasClass("down")).toBe(true);
        expect(slide3.hasClass("up")).toBe(false);

        clock.advanceTimersByTime(155);

        expect(slide3.hasClass("up")).toBe(true);

        clock.advanceTimersByTime(755);

        expect(slide1.css("display")).toBe("none");
        expect(slide2.css("display")).toBe("none");
        expect(slide3.css("display")).toBe("none");
    });
});
