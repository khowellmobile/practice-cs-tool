const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const { toggleForm } = require("../static/js/change_account_script");

describe("toggleForm function", () => {
    test("toggles form visibility", () => {
        const dom = new JSDOM(`<!DOCTYPE html><div id='update_name></div>`);

        console.log(dom)
    });
});
