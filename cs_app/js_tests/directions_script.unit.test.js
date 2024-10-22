const directionsScript = require("../static/js/sub_scripts/directions_script");
const { JSDOM } = require("jsdom");

describe("class toggle on click function", () => {
    let dom;

    beforeEach(() => {
        dom = new JSDOM(
            `<!DOCTYPE html>
                <div>
                    <div id="testCard" class="content-card content-card-initial">
                        <p class="initial-card-text"></p>
                        <div class="hidden-div" style="display:none"></div>
                    </div>
                    <div id="testCard2" class="content-card content-card-initial">
                        <p class="initial-card-text"></p>
                        <div class="hidden-div" style="display:none"></div>
                    </div>
                </div>`
        );
        global.document = dom.window.document;
        global.window = dom.window;
        global.$ = require("jquery")(dom.window);

        clock = jest.useFakeTimers();

        directionsScript.attachEventListeners();
    });

    afterEach(() => {
        dom.window.close();

        jest.useRealTimers();
    });

    test("toggles classes and fades in/out properly on first click", () => {
        const card1 = $("#testCard");

        expect(card1.hasClass("content-card-initial")).toBe(true);
        expect(card1.hasClass("content-card-expanded")).toBe(false);

        card1.trigger("click");

        expect(card1.hasClass("content-card-initial")).toBe(false);
        expect(card1.hasClass("content-card-expanded")).toBe(true);

        clock.advanceTimersByTime(305);

        expect(card1.find("p.initial-card-text").is(":visible")).toBe(false);
        expect($('#testCard > .hidden-div').css("display")).toBe("block");
    });

    test("toggles classes and fades in/out properly on second click", () => {
        const card1 = $("#testCard");

        card1.trigger("click");

        expect(card1.hasClass("content-card-initial")).toBe(false);
        expect(card1.hasClass("content-card-expanded")).toBe(true);

        card1.trigger("click");

        expect(card1.hasClass("content-card-initial")).toBe(true);
        expect(card1.hasClass("content-card-expanded")).toBe(false);

        clock.advanceTimersByTime(305);

        expect(card1.find("p.initial-card-text").css("display")).toBe("block");
        expect($('#testCard > .hidden-div').is(":visible")).toBe(false);
    });

    test("doesnt affect other cards", () => {
        const card1 = $("#testCard");
        const card2 = $("#testCard2");

        expect(card1.hasClass("content-card-initial")).toBe(true);
        expect(card1.hasClass("content-card-expanded")).toBe(false);
        expect(card2.hasClass("content-card-initial")).toBe(true);
        expect(card2.hasClass("content-card-expanded")).toBe(false);

        card1.trigger("click");

        expect(card1.hasClass("content-card-initial")).toBe(false);
        expect(card1.hasClass("content-card-expanded")).toBe(true);
        expect(card2.hasClass("content-card-initial")).toBe(true);
        expect(card2.hasClass("content-card-expanded")).toBe(false);
    });
});
