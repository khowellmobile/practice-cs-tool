const { setSpinnerVisibility } = require("../static/js/change_database_script");
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

        // Initialize jQuery within the test environment
        $ = require("jquery")(dom.window);
    });

    afterEach(() => {
        // Clean up the DOM after each test
        dom.window.close();
    });

    // Test ensures setSpinnerVisibility function will change .spinner from hidden to shown
    // when passed a value of true
    test("should make spinner visible when spinnerVisible is true", () => {
        setSpinnerVisibility(true);

        const spinner = $(".spinner");
        // Access computed style using getComputedStyle
        const computedStyle = dom.window.getComputedStyle(spinner[0]);

        expect(computedStyle.visibility).toBe("visible");
    });

    // Test ensures setSpinnerVisibility function will change .spinner from shown to hidden
    // when passed a value of false
    test("should hide spinner when spinnerVisible is false", () => {
        // Modify the inline style to set spinner visible
        $(".spinner").css("visibility", "visible");

        setSpinnerVisibility(false);

        const spinner = $(".spinner");

        // Access computed style using getComputedStyle
        const computedStyle = dom.window.getComputedStyle(spinner[0]);

        expect(computedStyle.visibility).toBe("hidden");
    });

    // Test ensures setSpinnerVisiblity will not alter the visibility value of .spinner when passed
    // false when already or hidden or true when already shown
    test("should not alter spinner visibility when already hidden or shown", () => {
        // Set up initial state: .spinner is hidden
        $(".spinner").css("visibility", "hidden");
    
        setSpinnerVisibility(false);
    
        // Ensure .spinner remains hidden
        let spinner = $(".spinner");
        let computedStyle = dom.window.getComputedStyle(spinner[0]);
        expect(computedStyle.visibility).toBe("hidden");
    
        // Set up initial state: .spinner is visible
        $(".spinner").css("visibility", "visible");
    
        setSpinnerVisibility(true);
    
        // Ensure .spinner remains visible
        spinner = $(".spinner");
        computedStyle = dom.window.getComputedStyle(spinner[0]);
        expect(computedStyle.visibility).toBe("visible");
    });
});
