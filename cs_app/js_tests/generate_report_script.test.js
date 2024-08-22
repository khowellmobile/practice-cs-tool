const genRepScript = require("../static/js/generate_report_script");
const { JSDOM } = require("jsdom");

describe("throttle function", () => {
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
