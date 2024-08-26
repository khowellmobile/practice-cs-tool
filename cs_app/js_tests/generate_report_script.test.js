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
                </div>`);
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
                </div>`);
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

        e1.addClass("historySmall");
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

        e1.addClass("historyLarge");
        e2.addClass("reportSmall");

        genRepScript.toggleSize("element_1", "element_2");

        expect(e1.hasClass("historyLarge")).toBe(false);
        expect(e1.hasClass("historySmall")).toBe(true);
        expect(e2.hasClass("reportSmall")).toBe(false);
        expect(e2.hasClass("reportLarge")).toBe(true);
    });
});

describe("formatData function", () => {
    test("should correctly format an array of objects", () => {
        const inputData = [
            { department_name: "test_dep_1", total_hours: "10" },
            { department_name: "test_dep_2", total_hours: "20" },
        ];

        const expectedOutput = [
            ["test_dep_1", 10],
            ["test_dep_2", 20],
        ];

        expect(genRepScript.formatData(inputData)).toEqual(expectedOutput);
    });

    test("should handle missing fields by returning undefined values", () => {
        const inputData = [{ department_name: "test_dep_1" }, { total_hours: "10" }];

        const expectedOutput = [
            ["test_dep_1", NaN],
            [undefined, 10],
        ];

        expect(genRepScript.formatData(inputData)).toEqual(expectedOutput);
    });

    test("should handle invalid data types", () => {
        const inputData = [
            { department_name: 123, total_hours: "abc" },
            { department_name: null, total_hours: [] },
        ];

        const expectedOutput = [
            [123, NaN],
            [null, NaN],
        ];

        expect(genRepScript.formatData(inputData)).toEqual(expectedOutput);
    });

    test("should return an empty array when input is an empty array", () => {
        const inputData = [];

        const expectedOutput = [];

        expect(genRepScript.formatData(inputData)).toEqual(expectedOutput);
    });
});

describe("alterDates function", () => {
    let dom;

    beforeEach(() => {
        dom = new JSDOM(`
            <!DOCTYPE html>
            <html>
                <body>
                    <input type="text" id="start_date" />
                    <input type="text" id="end_date" />
                </body>
            </html>
        `);
        global.document = dom.window.document;
        global.window = dom.window;
        global.$ = require("jquery")(dom.window);
    });

    afterEach(() => {
        dom.window.close();
    });

    test("should set start_date and end_date correctly for 'YTD'", () => {
        const mockDate = new Date(2024, 7, 22);
        jest.spyOn(global, "Date").mockImplementation(() => mockDate);

        genRepScript.alterDates("YTD");

        expect($("#start_date").val()).toBe("2023-01-01");
        expect($("#end_date").val()).toBe("2024-08-22");

        global.Date.mockRestore();
    });

    test("should set start_date and end_date correctly for 'Last Year'", () => {
        const mockDate = new Date(2024, 7, 22);
        jest.spyOn(global, "Date").mockImplementation(() => mockDate);

        genRepScript.alterDates("Last Year");

        expect($("#start_date").val()).toBe("2023-01-01");
        expect($("#end_date").val()).toBe("2023-12-31");

        global.Date.mockRestore();
    });

    test("should set start_date and end_date correctly for 'All Time'", () => {
        const mockDate = new Date(2024, 7, 22);
        jest.spyOn(global, "Date").mockImplementation(() => mockDate);

        genRepScript.alterDates("All Time");

        expect($("#start_date").val()).toBe("1000-01-01");
        expect($("#end_date").val()).toBe("2024-08-22");

        global.Date.mockRestore();
    });

    test("should not alter dates for 'Custom'", () => {
        const mockDate = new Date(2024, 7, 22);
        jest.spyOn(global, "Date").mockImplementation(() => mockDate);

        genRepScript.alterDates("Custom");

        expect($("#start_date").val()).toBe("");
        expect($("#end_date").val()).toBe("");

        global.Date.mockRestore();
    });

    test("should log a message for unknown time ranges", () => {
        console.log = jest.fn();

        genRepScript.alterDates("Unknown");

        expect(console.log).toHaveBeenCalledWith("Unknown time range");
    });
});

describe("test dropdown menu jquery eventlistener", () => {
    let dom;

    beforeEach(() => {
        dom = new JSDOM(
            `<!DOCTYPE html>
                <button class="dropdown-button">ButtonText</button>
                <div class="dropdown-content" style="display: flex;">
                    <div class="dropdown-item" id="item-text1">Text1</div>
                    <div class="dropdown-item">Text2</div>
                    <div class="dropdown-item">Text3</div>
                    <div class="dropdown-item">Text4</div>
                </div>`
        );

        global.document = dom.window.document;
        global.window = dom.window;
        global.$ = require("jquery")(dom.window);
    });

    afterEach(() => {
        dom.window.close();
    });

    test("should show/hide drop down", () => {
        genRepScript.attachEventListeners();

        dropContent = $(".dropdown-content");
        dropButton = $(".dropdown-button");

        dropButton.trigger("click");

        expect(dropContent.css("display")).toBe("none");

        dropButton.trigger("click");

        expect(dropContent.css("display")).toBe("flex");
    });

    test("should set dropdown-button text to be clicked on option then hide content", () => {
        genRepScript.attachEventListeners();

        chosenItem = $("#item-text1");
        dropContent = $(".dropdown-content");
        dropButton = $(".dropdown-button");

        chosenItem.trigger("click");

        expect(dropButton.text()).toBe("Text1");
        expect(dropContent.css("display")).toBe("none");
    });
});

describe("test dropdown menu jquery eventlistener", () => {
    let dom;

    beforeEach(() => {
        dom = new JSDOM(
            `<!DOCTYPE html>
                <button class="dropdown-button"></button>
                <input type="date" id="start_date"></div>
                <input type="date" id="end_date"></div>`
        );

        global.document = dom.window.document;
        global.window = dom.window;
        global.$ = require("jquery")(dom.window);
    });

    afterEach(() => {
        dom.window.close();
    });

    test("should show/hide drop down", () => {
        genRepScript.attachEventListeners();

        startDate = $("#start_date");
        endDate = $("#end_date");
        dropButton = $(".dropdown-button");

        dropButton.text("ButtonText1");
        expect(dropButton.text()).toBe("ButtonText1");

        startDate.trigger("change");
        expect(dropButton.text()).toBe("Custom");

        dropButton.text("ButtonText2");
        expect(dropButton.text()).toBe("ButtonText2");

        endDate.trigger("change");
        expect(dropButton.text()).toBe("Custom");
    });
});
