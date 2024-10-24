const genRepScript = require("../static/js/sub_scripts/generate_report_script");
const { JSDOM } = require("jsdom");

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
        jest.clearAllMocks();
    });

    test("should set YTD dates correctly", () => {
        const currentDate = new Date();
        const day = currentDate.getDate().toString().padStart(2, "0");
        const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
        const year = currentDate.getFullYear();
    
        genRepScript.alterDates("YTD");
    
        expect($("#start_date").val()).toBe(`${year}-01-01`);
        expect($("#end_date").val()).toBe(`${year}-${month}-${day}`);
      });
    
      test("should set Last Year dates correctly", () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
    
        genRepScript.alterDates("Last Year");
    
        expect($("#start_date").val()).toBe(`${year - 1}-01-01`);
        expect($("#end_date").val()).toBe(`${year - 1}-12-31`);
      });
    
      test("should set All Time dates correctly", () => {
        const currentDate = new Date();
        const day = currentDate.getDate().toString().padStart(2, "0");
        const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
        const year = currentDate.getFullYear();
    
        genRepScript.alterDates("All Time");
    
        expect($("#start_date").val()).toBe(`1000-01-01`);
        expect($("#end_date").val()).toBe(`${year}-${month}-${day}`);
      });
    
      test("should handle unknown range", () => {
        console.warn = jest.fn();
        genRepScript.alterDates("Unknown Range");
    
        expect(console.warn).toHaveBeenCalledTimes(1);
        expect(console.warn).toHaveBeenCalledWith("Unknown time range");
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
                </div>
                <div id="non-dropdown-click"></div>`
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

        expect(dropContent.css("visibility")).toBe("visible");

        dropButton.trigger("click");

        expect(dropContent.css("visibility")).toBe("visible");

        $("#non-dropdown-click").trigger("click");

        expect(dropContent.css("visibility")).toBe("hidden");
    });

    test("should set dropdown-button text to be clicked on option then hide content", () => {
        genRepScript.attachEventListeners();

        chosenItem = $("#item-text1");
        dropContent = $(".dropdown-content");
        dropButton = $(".dropdown-button");

        chosenItem.trigger("click");

        expect(dropButton.text()).toBe("Text1");
        expect(dropContent.css("visibility")).toBe("hidden");
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
