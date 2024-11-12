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

        expect(global.alert).toHaveBeenCalledWith(
            "An error occurred while processing your request. Please check fields and try again."
        );

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

describe("validateDbDriver function", () => {
    test("should return true with a valid drivers", () => {
        const testDriver1 = "testDriver";
        const testDriver2 = "test_driver";
        const testDriver3 = "test driver";
        const testDriver4 = "test driver 1234 _ 1";

        expect(changeDbScript.validateDbDriver(testDriver1)).toEqual(true);
        expect(changeDbScript.validateDbDriver(testDriver2)).toEqual(true);
        expect(changeDbScript.validateDbDriver(testDriver3)).toEqual(true);
        expect(changeDbScript.validateDbDriver(testDriver4)).toEqual(true);
    });

    test("should return false with invalid drivers", () => {
        const testDriver1 = "";
        const testDriver2 = "testDriver(&*^";
        const testDriver3 = "000*0";
        const testDriver4 = "t3$tDr1ver";

        expect(changeDbScript.validateDbDriver(testDriver1)).toEqual(false);
        expect(changeDbScript.validateDbDriver(testDriver2)).toEqual(false);
        expect(changeDbScript.validateDbDriver(testDriver3)).toEqual(false);
        expect(changeDbScript.validateDbDriver(testDriver4)).toEqual(false);
    });
});

describe("validateDbHost function", () => {
    test("should return true with a valid hosts", () => {
        const testHost1 = "example.com";
        const testHost2 = "localhost";
        const testHost3 = "dbserver123.internal";
        const testHost4 = "192.168.1.1";

        expect(changeDbScript.validateDbHost(testHost1)).toEqual(true);
        expect(changeDbScript.validateDbHost(testHost2)).toEqual(true);
        expect(changeDbScript.validateDbHost(testHost3)).toEqual(true);
        expect(changeDbScript.validateDbHost(testHost4)).toEqual(true);
    });

    test("should return false with invalid hosts", () => {
        const testHost1 = "";
        const testHost2 = "db@domain.com";
        const testHost3 = "some..double-dot.com";

        expect(changeDbScript.validateDbHost(testHost1)).toEqual(false);
        expect(changeDbScript.validateDbHost(testHost2)).toEqual(false);
        expect(changeDbScript.validateDbHost(testHost3)).toEqual(false);
    });
});

describe("validateDbName function", () => {
    test("should return true with a valid names", () => {
        const testName1 = "goodName";
        const testName2 = "g00d_naM3";
        const testName3 = "sn";
        const testName4 = "underscored_name";

        expect(changeDbScript.validateDbName(testName1)).toEqual(true);
        expect(changeDbScript.validateDbName(testName2)).toEqual(true);
        expect(changeDbScript.validateDbName(testName3)).toEqual(true);
        expect(changeDbScript.validateDbName(testName4)).toEqual(true);
    });

    test("should return false with invalid names", () => {
        const testName1 = "";
        const testName2 = "bad $name";
        const testName3 = "$$$$$";
        const testName4 = "bad Name";

        expect(changeDbScript.validateDbName(testName1)).toEqual(false);
        expect(changeDbScript.validateDbName(testName2)).toEqual(false);
        expect(changeDbScript.validateDbName(testName3)).toEqual(false);
        expect(changeDbScript.validateDbName(testName4)).toEqual(false);
    });
});

describe("validateDbEngine function", () => {
    test("should return true with a valid engines", () => {
        const testEngine1 = "postgresql";
        const testEngine2 = "mysql";
        const testEngine3 = "sqlite";
        const testEngine4 = "oracle";
        const testEngine5 = "mssql";

        expect(changeDbScript.validateDbEngine(testEngine1)).toEqual(true);
        expect(changeDbScript.validateDbEngine(testEngine2)).toEqual(true);
        expect(changeDbScript.validateDbEngine(testEngine3)).toEqual(true);
        expect(changeDbScript.validateDbEngine(testEngine4)).toEqual(true);
        expect(changeDbScript.validateDbEngine(testEngine5)).toEqual(true);
    });

    test("should return false with invalid engines", () => {
        const testEngine1 = "";
        const testEngine2 = "not accepted engine";
        const testEngine3 = "mssq";
        const testEngine4 = "orcle";

        expect(changeDbScript.validateDbEngine(testEngine1)).toEqual(false);
        expect(changeDbScript.validateDbEngine(testEngine2)).toEqual(false);
        expect(changeDbScript.validateDbEngine(testEngine3)).toEqual(false);
        expect(changeDbScript.validateDbEngine(testEngine4)).toEqual(false);
    });
});

describe("validateDbConfig function", () => {
    test("should return empty message with valid config", () => {
        const config1 = {
            db_engine: "mssql",
            db_name: "good_name",
            db_host: "localHost",
            db_driver: "good_driver",
        };

        const config2 = {
            db_engine: "postgresql",
            db_name: "goodName",
            db_host: "192.168.1.1",
            db_driver: "pymysql",
        };

        expect(changeDbScript.validateDbConfig(config1)).toEqual("");
        expect(changeDbScript.validateDbConfig(config2)).toEqual("");
    });

    test("should return false with invalid config", () => {
        const config1 = {
            db_engine: "badEngine",
            db_name: "good_name",
            db_host: "localHost",
            db_driver: "good_driver",
        };

        const config2 = {
            db_engine: "mssql",
            db_name: "badName$",
            db_host: "localHost",
            db_driver: "good_driver",
        };

        const config3 = {
            db_engine: "mssql",
            db_name: "good_name",
            db_host: "bad $ host ....",
            db_driver: "good_driver",
        };

        const config4 = {
            db_engine: "mssql",
            db_name: "good_name",
            db_host: "localHost",
            db_driver: "%^baD Driver",
        };

        expect(changeDbScript.validateDbConfig(config1)).toEqual("Engine name invalid.");
        expect(changeDbScript.validateDbConfig(config2)).toEqual("Database name invalid. Alphanumerics only.");
        expect(changeDbScript.validateDbConfig(config3)).toEqual("Database host invalid");
        expect(changeDbScript.validateDbConfig(config4)).toEqual("Database driver invalid. Alphanumerics only.");
    });
});
