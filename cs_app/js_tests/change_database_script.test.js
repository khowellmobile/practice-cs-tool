const { setSpinnerVisiblity } = require("../static/js/change_database_script");
const { JSDOM } = require("jsdom");

const $ = require("jquery");

describe("setSpinnerVisiblity function", () => {
    let dom;

    beforeEach(() => {
        // Set up a DOM environment using jsdom
        dom = new JSDOM(
            '<!DOCTYPE html><div><div class="spinner"></div></div>'
        );
        global.document = dom.window.document;
        global.window = dom.window;
    });

    afterEach(() => {
        // Clean up the DOM after each test
        dom.window.close();
    });

    test("should make spinner visible when spinnerVisible is true", () => {
        setSpinnerVisiblity(true);
        const spinner = document.querySelector(".spinner");
        expect(getComputedStyle(spinner).visibility).toBe("visible");
    });

    test("should hide spinner when spinnerVisible is false", () => {
        setSpinnerVisiblity(false);
        const spinner = document.querySelector(".spinner");
        expect(getComputedStyle(spinner).visibility).toBe("hidden");
    });
});
