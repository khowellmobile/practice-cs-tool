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

        consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    });

    afterEach(() => {
        consoleWarnSpy.mockRestore();
        dom.window.close();
    });

    test("should add classB after a 0.5s timeout", (done) => {
        let testElement = $("#test");

        directionsScript.classToggleTimeout(testElement, true, "classB", 500);

        expect(testElement.hasClass("classB")).toBe(false);

        setTimeout(() => {
            expect(testElement.hasClass("classB")).toBe(true);
            done();
        }, 550);
    });

    test("should remove classA after a 0.5s timeout", (done) => {
        let testElement = $("#test");

        directionsScript.classToggleTimeout(testElement, false, "classA", 500);

        expect(testElement.hasClass("classA")).toBe(true);

        setTimeout(() => {
            expect(testElement.hasClass("classA")).toBe(false);
            done();
        }, 550);
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
        global.document = dom.window.document;
        global.window = dom.window;
        global.$ = require("jquery")(dom.window);
    });

    afterEach(() => {
        dom.window.close();
    });

    test("should switch subslides and apply classes correctly", async () => {
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

        await new Promise((resolve) => setTimeout(resolve, 600));

        // Check final state
        expect(slide1.hasClass("scaleUp")).toBe(false);
        expect(slide1.hasClass("scaleDown")).toBe(true);
        expect(slide2.hasClass("scaleUp")).toBe(true);
        expect(slide2.hasClass("scaleDown")).toBe(false);
        expect(slide1.css("display")).toBe("none");
        expect(slide2.css("display")).toBe("flex");
        expect(directionsScript.getCurrentActiveSubSlide()).toBe("slide2");
    });

    test("should now allow slide change when locked", async () => {
        directionsScript.setCurrentActiveSubSlide("slide1");
        directionsScript.setLockSubSlides(false);

        directionsScript.switchSubSlide("slide2");

        await new Promise((resolve) => setTimeout(resolve, 50));

        expect(directionsScript.getLockSubSlides()).toBe(true);

        await new Promise((resolve) => setTimeout(resolve, 550));

        expect(directionsScript.getLockSubSlides()).toBe(false);
    });
});
