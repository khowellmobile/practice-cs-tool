const { setSpinnerVisiblity } = require("../static/js/change_database_script");
const { JSDOM } = require("jsdom");

describe("setSpinnerVisiblity function", () => {
    let dom;

    beforeEach(() => {
        // Set up a DOM environment using jsdom
        dom = new JSDOM(
            '<!DOCTYPE html><div><div class="spinner" style="visibility: hidden;"></div></div>'
        );
        global.document = dom.window.document;
        global.window = dom.window;
    
        var jsdom = require("jsdom");
        $ = require("jquery")(new jsdom.JSDOM().window);
    });

    afterEach(() => {
        // Clean up the DOM after each test
        dom.window.close();
    });

    test("should make spinner visible when spinnerVisible is true", () => {
        setSpinnerVisiblity(true);
        const spinner = document.querySelector(".spinner");
        // Access computed style using getComputedStyle
        const computedStyle = dom.window.getComputedStyle(spinner);
        expect(computedStyle.visibility).toBe("visible");
    });

    test("should hide spinner when spinnerVisible is false", () => {
        // Modify the inline style to set spinner visible
        document.querySelector(".spinner").style.visibility = "visible";
        setSpinnerVisiblity(false);
        const spinner = document.querySelector(".spinner");
        // Access computed style using getComputedStyle
        const computedStyle = dom.window.getComputedStyle(spinner);
        expect(computedStyle.visibility).toBe("hidden");
    });
});
