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

        consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
        consoleWarnSpy.mockRestore();
        dom.window.close();
    });

    test("should add classB after a 0.5s timeout", (done) => {
        let testElement = $("#test");

        // Call classToggleTimeout with a timeout of 500ms
        directionsScript.classToggleTimeout(testElement, true, "classB", 500);

        expect(testElement.hasClass("classB")).toBe(false);

        setTimeout(() => {
            expect(testElement.hasClass("classB")).toBe(true);
            done();
        }, 550);
    });

    test("should remove classA after a 0.5s timeout", (done) => {
        let testElement = $("#test");

        // Call classToggleTimeout with a timeout of 500ms
        directionsScript.classToggleTimeout(testElement, false, "classA", 500);

        expect(testElement.hasClass("classA")).toBe(true);

        setTimeout(() => {
            expect(testElement.hasClass("classA")).toBe(false);
            done();
        }, 550);
    });

    test("should warn a message if element is empty or non jquery", () => {

    });

    test("should warn a message if cssClass is not a string or is empty", () => {

    });

    test("should warn a message if timeout is not a number or is <= 0", () => {

    });




});
