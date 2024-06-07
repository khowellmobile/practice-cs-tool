// jsdom setup
const { JSDOM } = require("jsdom");

describe("jsdom", () => {
    test("should create a valid DOM", () => {
        const dom = new JSDOM("<!DOCTYPE html><p>Hello world</p>");
        expect(dom.window.document.querySelector("p").textContent).toBe(
            "Hello world"
        );
    });
});
