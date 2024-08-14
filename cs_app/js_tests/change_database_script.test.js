const changeDbScript = require("../static/js/change_database_script");
const { JSDOM } = require("jsdom");

describe("setSpinnerVisiblity function", () => {
    let dom;

    beforeEach(() => {
        // Set up a DOM environment using jsdom
        dom = new JSDOM(
            `<!DOCTYPE html>
                <div>
                    <div class="spinner" style="visibility: hidden;">
                </div>
            </div>`
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
        changeDbScript.setSpinnerVisibility(true);

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

        changeDbScript.setSpinnerVisibility(false);

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

        changeDbScript.setSpinnerVisibility(false);

        // Ensure .spinner remains hidden
        let spinner = $(".spinner");
        let computedStyle = dom.window.getComputedStyle(spinner[0]);
        expect(computedStyle.visibility).toBe("hidden");

        // Set up initial state: .spinner is visible
        $(".spinner").css("visibility", "visible");

        changeDbScript.setSpinnerVisibility(true);

        // Ensure .spinner remains visible
        spinner = $(".spinner");
        computedStyle = dom.window.getComputedStyle(spinner[0]);
        expect(computedStyle.visibility).toBe("visible");
    });
});

describe("dbChangeHandler function", () => {
    let dom;

    beforeEach(() => {
        // Set up a DOM environment using jsdom
        dom = new JSDOM(
            `<!DOCTYPE html>
                <div>
                    <div id="database-change__status">
                </div>
            </div>`
        );
        global.document = dom.window.document;
        global.window = dom.window;

        // Initialize jQuery within the test environment
        $ = require("jquery")(dom.window);

        // Mock the global alert function
        global.alert = jest.fn();
    });

    afterEach(() => {
        // Clean up the DOM after each test
        dom.window.close();
    });

    test("Should append success message to div when success is true", () => {
        changeDbScript.dbChangeHandler(true, {}, jest.fn());

        const pElements = $("#database-change__status p");

        expect(pElements.length).toBe(1);

        const pElement = pElements[0];

        expect(pElement.classList.contains("stat__message")).toBe(true);
        expect(pElement.textContent).toBe("Successful Connection");
    });

    test("Should append error message to div when success false and message is non-empty", () => {
        changeDbScript.dbChangeHandler(false, { responseJSON: { error: "test-error" } }, jest.fn());

        const pElements = $("#database-change__status p");

        expect(pElements.length).toBe(1);

        const pElement = pElements[0];

        expect(pElement.classList.contains("stat__message")).toBe(true);
        expect(pElement.textContent).toBe("Error: test-error");
    });

    test("Should alert error when success is false and message is empty", () => {
        changeDbScript.dbChangeHandler(false, {}, jest.fn());

        expect(global.alert).toHaveBeenCalledWith("An error occurred while processing your request. Please try again.");

        const pElements = $("#database-change__status p");
        expect(pElements.length).toBe(0);
    });
});

describe("getInputValues function", () => {
    let dom;

    beforeEach(() => {
        // Set up a DOM environment using jsdom
        dom = new JSDOM(
            `<!DOCTYPE html>
                <div>
                    <form id="database-change__form">
                        <input id="input_engine" value="MySQL" />
                        <input id="input_name" value="test_db" />
                        <input id="input_host" value="localhost" />
                        <input id="input_driver" value="driver_name" />
                    </form>
                </div>`
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

    test("should return an object with the correct values from form inputs", () => {
        const expected = {
            db_engine: "MySQL",
            db_name: "test_db",
            db_host: "localhost",
            db_driver: "driver_name"
        };
        
        const result = changeDbScript.getInputValues();

        expect(result).toEqual(expected);
    });

    test("should trim whitespace from input values", () => {
        $("#db_engine").val("  MySQL  ");
        $("#db_name").val("  test_db  ");
        $("#db_host").val("  localhost  ");
        $("#db_driver").val("  driver_name  ");

        const expected = {
            db_engine: "MySQL",
            db_name: "test_db",
            db_host: "localhost",
            db_driver: "driver_name"
        };
        
        const result = changeDbScript.getInputValues();

        expect(result).toEqual(expected);
    });

    test("should return an empty object if no inputs are present", () => {
        $("#database-change__form").empty();

        const expected = {};
        
        const result = changeDbScript.getInputValues();

        expect(result).toEqual(expected);
    });

    test("should handle missing inputs", () => {
        $("#database-change__form").empty();

        $("#database-change__form").append('<input id="input_engine" value="MySQL" />');
        $("#database-change__form").append('<input id="input_name" value="test_db" />');

        const expected = {
            db_engine: "MySQL",
            db_name: "test_db",
        };
        
        const result = changeDbScript.getInputValues();

        expect(result).toEqual(expected);
    });

    test("should handle empty inputs", () => {
        $("#database-change__form").empty();

        $("#database-change__form").append('<input id="input_engine" value="MySQL" />');
        $("#database-change__form").append('<input id="input_name" value="test_db" />');
        $("#database-change__form").append('<input id="input_host" />');
        $("#database-change__form").append('<input id="input_driver" />');

        const expected = {
            db_engine: "MySQL",
            db_name: "test_db",
            db_host: "",
            db_driver: "",
        };
        
        const result = changeDbScript.getInputValues();

        expect(result).toEqual(expected);
    });
});
