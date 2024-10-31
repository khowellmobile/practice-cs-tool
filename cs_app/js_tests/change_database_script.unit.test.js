const changeDbScript = require("../static/js/sub_scripts/change_database_script");
const { JSDOM } = require("jsdom");

describe("showOverlay function", () => {
    let dom;

    beforeEach(() => {
        dom = new JSDOM(
            `<!DOCTYPE html>
                <div>
                    <div id="page-overlay" style="display:none;">
                </div>
            </div>`
        );
        global.document = dom.window.document;
        global.window = dom.window;

        $ = require("jquery")(dom.window);
    });

    afterEach(() => {
        dom.window.close();
    });

    test("should make overlay visible when passed true", () => {
        let overlay = $("#page-overlay");

        changeDbScript.showOverlay(true);

        expect(overlay.css("display")).toBe("block");

        changeDbScript.showOverlay(true);

        expect(overlay.css("display")).toBe("block");
    });

    test("should make overlay visible when passed false", () => {
        let overlay = $("#page-overlay");

        changeDbScript.showOverlay(false);

        expect(overlay.css("display")).toBe("none");

        changeDbScript.showOverlay(false);

        expect(overlay.css("display")).toBe("none");
    });
});

describe("dbChangeHandler function", () => {
    let dom;

    beforeEach(() => {
        dom = new JSDOM(
            `<!DOCTYPE html>
                <div>
                    <div id="database-change__status">
                </div>
            </div>`
        );
        global.document = dom.window.document;
        global.window = dom.window;

        $ = require("jquery")(dom.window);

        global.alert = jest.fn();
    });

    afterEach(() => {
        dom.window.close();
    });

    test("should append success message to div when success is true", () => {
        changeDbScript.dbChangeHandler(true, {}, jest.fn());

        const pElements = $("#database-change__status p");

        expect(pElements.length).toBe(1);

        const pElement = pElements[0];

        expect(pElement.classList.contains("stat__message")).toBe(true);
        expect(pElement.textContent).toBe("Successful Connection");
    });

    test("should append error message to div when success false and message is non-empty", () => {
        changeDbScript.dbChangeHandler(false, { error: "test-error" }, jest.fn());

        const pElements = $("#database-change__status p");

        expect(pElements.length).toBe(1);

        const pElement = pElements[0];

        expect(pElement.classList.contains("stat__message")).toBe(true);
        expect(pElement.textContent).toBe("Error: test-error");
    });

    test("should alert error when success is false and message is empty", () => {
        changeDbScript.dbChangeHandler(false, {}, jest.fn());

        expect(global.alert).toHaveBeenCalledWith("An error occurred while processing your request. Please check fields and try again.");

        const pElements = $("#database-change__status p");
        expect(pElements.length).toBe(0);
    });
});

describe("getInputValues function", () => {
    let dom;

    beforeEach(() => {
        dom = new JSDOM(
            `<!DOCTYPE html>
                <div>
                    <form class="form__cluster">
                        <input id="input_engine" value="MySQL" />
                        <input id="input_name" value="test_db" />
                        <input id="input_host" value="localhost" />
                        <input id="input_driver" value="driver_name" />
                    </form>
                </div>`
        );
        global.document = dom.window.document;
        global.window = dom.window;

        $ = require("jquery")(dom.window);
    });

    afterEach(() => {
        dom.window.close();
    });

    test("should return an object with the correct values from form inputs", () => {
        const expected = {
            db_engine: "MySQL",
            db_name: "test_db",
            db_host: "localhost",
            db_driver: "driver_name",
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
            db_driver: "driver_name",
        };

        const result = changeDbScript.getInputValues();

        expect(result).toEqual(expected);
    });

    test("should return an empty object if no inputs are present", () => {
        $(".form__cluster").empty();

        const expected = {};

        const result = changeDbScript.getInputValues();

        expect(result).toEqual(expected);
    });

    test("should handle missing inputs", () => {
        $(".form__cluster").empty();

        $(".form__cluster").append('<input id="input_engine" value="MySQL" />');
        $(".form__cluster").append('<input id="input_name" value="test_db" />');

        const expected = {
            db_engine: "MySQL",
            db_name: "test_db",
        };

        const result = changeDbScript.getInputValues();

        expect(result).toEqual(expected);
    });

    test("should handle empty inputs", () => {
        $(".form__cluster").empty();

        $(".form__cluster").append('<input id="input_engine" value="MySQL" />');
        $(".form__cluster").append('<input id="input_name" value="test_db" />');
        $(".form__cluster").append('<input id="input_host" />');
        $(".form__cluster").append('<input id="input_driver" />');

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
