const accountInfoScript = require("../static/js/account_information_script");
const { JSDOM } = require("jsdom");

describe("fadeInPopup function", () => {
    let dom;

    beforeEach(() => {
        dom = new JSDOM(
            `<!DOCTYPE html>
                <div id="testField">
                    <div id="update_testField" style="display: none;"></div>
                    <div id="pageOverlay" style="display: none;"></div>
                </div>`
        );

        global.document = dom.window.document;
        global.window = dom.window;
        global.$ = require("jquery")(dom.window);

        consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    });

    afterEach(() => {
        dom.window.close();
        consoleWarnSpy.mockRestore();
    });

    test("should show the popup and page overlay correctly", () => {
        const form = $("#update_testField");
        const overlay = $("#pageOverlay");

        accountInfoScript.fadeInPopup("testField");

        expect(form.css("display")).toBe("block");
        expect(form.hasClass("show")).toBe(true);
        expect(overlay.css("display")).toBe("block");
    });

    test("should log warning if popup element does not exist", () => {
        $("#update_testField").remove();

        accountInfoScript.fadeInPopup("testField");

        expect(consoleWarnSpy).toHaveBeenCalledWith('Popup with id "update_testField" does not exist.');
    });

    test("should log warning if overlay element does not exist", () => {
        $("#pageOverlay").remove();

        accountInfoScript.fadeInPopup("testField");

        expect(consoleWarnSpy).toHaveBeenCalledWith('Page overlay does not exist.');
    });
});

describe("validatePassword function", () => {
    test("should return true with proper password specifications", () => {
        let goodPass = "goodPass1#";

        expect(accountInfoScript.validatePassword(goodPass)).toBe(true);
    });

    test("should return false with pass less than 8 chars", () => {
        let pLessThan8 = "#123456";

        expect(accountInfoScript.validatePassword(pLessThan8)).toBe(false);
    });

    test("should return false with pass without special char", () => {
        let pNoSpecial = "12345678";

        expect(accountInfoScript.validatePassword(pNoSpecial)).toBe(false);
    });

    test("should return false with pass without number", () => {
        let pNoDigit = "#abcdef";

        expect(accountInfoScript.validatePassword(pNoDigit)).toBe(false);
    });

    test("should return false with pass without special char and number", () => {
        let pInvalid = "abcdefgh";

        expect(accountInfoScript.validatePassword(pInvalid)).toBe(false);
    });

    test("should return false with pass containing control characters", () => {
        let pWithControlChar = "Passw0rd\n#";

        expect(accountInfoScript.validatePassword(pWithControlChar)).toBe(false);
    });
});

describe("validateEmail function", () => {
    test("should return true with proper email specifications", () => {
        let goodEmail = "test@testing.com";

        expect(accountInfoScript.validateEmail(goodEmail)).toBe(true);
    });

    test("should return false with an email without an @ symbol", () => {
        let eNoAtSymbol = "testtesting.com";

        expect(accountInfoScript.validateEmail(eNoAtSymbol)).toBe(false);
    });

    test("should return false with email without '.[2 chars]'", () => {
        let pNoSpecial = "test@testing.k";

        expect(accountInfoScript.validateEmail(pNoSpecial)).toBe(false);
    });

    test("should return false with email without '.'", () => {
        let eNoPeriod = "test@testingcom";

        expect(accountInfoScript.validateEmail(eNoPeriod)).toBe(false);
    });

    test("should return false with email without out local part before @", () => {
        let eNoLocalPart = "@testing.com";

        expect(accountInfoScript.validateEmail(eNoLocalPart)).toBe(false);
    });

    test("should return false with email with leading or trailing spaces", () => {
        let eWithSpaces = " test@testing.com ";

        expect(accountInfoScript.validateEmail(eWithSpaces)).toBe(false);
    });

    test("should return false with email with invalid characters before @", () => {
        let eWithInvalidChars = "test!#$%&'*+/=?^_`{|}~@testing.com";

        expect(accountInfoScript.validateEmail(eWithInvalidChars)).toBe(false);
    });

    test("should return false with email with invalid characters before @", () => {
        let eWithInvalidChars = "test!#$%&'*+/=?^_`{|}~@testing.com";

        expect(accountInfoScript.validateEmail(eWithInvalidChars)).toBe(false);
    });
});

describe("validateName function", () => {
    test("should return true with proper name specifications", () => {
        let goodName = "John Doe-'";

        expect(accountInfoScript.validateName(goodName)).toBe(true);
    });

    test("should return false with name less than 2 chars", () => {
        let nLessThanTwo = "a";

        expect(accountInfoScript.validateName(nLessThanTwo)).toBe(false);
    });

    test("should return false with name with non-allowed chars", () => {
        let nWithSpecChars = "John#%$#67";

        expect(accountInfoScript.validateName(nWithSpecChars)).toBe(false);
    });
});

describe("ajaxResponseError function", () => {
    beforeEach(() => {
        global.alert = jest.fn();
        consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    });

    afterEach(() => {
        consoleLogSpy.mockRestore();
    });

    test("should show correct alert message for name field error", () => {
        accountInfoScript.ajaxResponseError("name", { error: "Invalid format" });
        expect(global.alert).toHaveBeenCalledWith(
            "Name format is invalid. Allowed characters include alphabetical characters, spaces, hyphens, and apostrophes."
        );
    });

    test("should show correct alert message for email field error", () => {
        accountInfoScript.ajaxResponseError("email", { error: "Invalid format" });
        expect(global.alert).toHaveBeenCalledWith(
            "Email format is invalid. Please follow standard email format: example@domain.com"
        );
    });

    test("should show correct alert message for password field error", () => {
        accountInfoScript.ajaxResponseError("password", { error: "Invalid format" });
        expect(global.alert).toHaveBeenCalledWith(
            "Password format is invalid. Passwords must be at least 8 characters long and include a number and special character"
        );
    });

    test("should log to console for unknown field name", () => {
        accountInfoScript.ajaxResponseError("unknownField", { error: "Invalid format" });
        expect(consoleLogSpy).toHaveBeenCalledWith("Field name not recognized");
    });

    test("should show alert for unknown error", () => {
        accountInfoScript.ajaxResponseError("name", { error: "Some other error" });
        expect(global.alert).toHaveBeenCalledWith("An unknown error occurred. Please try again.");
    });
});

describe("ajaxResponseSuccess function", () => {
    let dom;

    beforeEach(() => {
        dom = new JSDOM(
            `<!DOCTYPE html>
                <div>
                    <div id="name_text"></div>
                    <div id="email_text"></div>
                    <div id="password_text"></div>
                </div>`
        );

        consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});

        global.document = dom.window.document;
        global.window = dom.window;

        $ = require("jquery")(dom.window);
    });

    afterEach(() => {
        dom.window.close();
        consoleLogSpy.mockRestore();
    });

    test("should update name text with full name if formdata is complete", () => {
        const formdata = { first_name: "John", last_name: "Doe" };

        accountInfoScript.ajaxResponseSuccess("name", formdata);

        expect($("#name_text").text()).toBe("Name: John Doe");
    });

    test("should log an error and update text with incomplete name formdata", () => {
        const formdata = { first_name: "John" };

        accountInfoScript.ajaxResponseSuccess("name", formdata);

        expect(consoleLogSpy).toHaveBeenCalledWith("Formdata does not include required key-value pairs for name");
        expect($("#name_text").text()).toBe("Name data is incomplete.");
    });

    test("should update email text with email address if formdata is complete", () => {
        const formdata = { email: "john.doe@example.com" };

        accountInfoScript.ajaxResponseSuccess("email", formdata);

        expect($("#email_text").text()).toBe("Email: john.doe@example.com");
    });

    test("should log an error and update text with incomplete email formdata", () => {
        const formdata = {};

        accountInfoScript.ajaxResponseSuccess("email", formdata);

        expect(consoleLogSpy).toHaveBeenCalledWith("Formdata does not include required key-value pair for email");
        expect($("#email_text").text()).toBe("Email data is incomplete.");
    });

    test("should update password text with confirmation message", () => {
        const formdata = {};

        accountInfoScript.ajaxResponseSuccess("password", formdata);

        expect($("#password_text").text()).toBe("New password set.");
    });

    test("should log a message for an unrecognized field name", () => {
        const formdata = {};

        accountInfoScript.ajaxResponseSuccess("unknownField", formdata);

        expect(consoleLogSpy).toHaveBeenCalledWith("Field name not recognized");
    });
});

describe("checkFields function", () => {
    let dom;
    let consoleAlertSpy;

    beforeEach(() => {
        dom = new JSDOM(
            `<!DOCTYPE html>
                <div id="testField">
                    <input id="email_confirm" value="test@example.com" />
                    <input id="password_confirm" value="Password123!" />
                </div>`
        );

        global.document = dom.window.document;
        global.window = dom.window;
        global.$ = require("jquery")(dom.window);

        // Spy on alert function
        consoleAlertSpy = jest.spyOn(global, 'alert').mockImplementation(() => {});
    });

    afterEach(() => {
        dom.window.close();
        consoleAlertSpy.mockRestore();
    });

    test("should alert invalid name format", () => {
        const formData = {
            "first_name": "John123",
            "last_name": "Doe"
        };

        accountInfoScript.checkFields("name", formData);

        expect(consoleAlertSpy).toHaveBeenCalledWith(
            `Name format is invalid. Allowed characters include alphabetical characters, spaces, hyphens, and apostrophes.`
        );
    });

    test("should alert emails do not match", () => {
        $("#email_confirm").val("different@example.com");

        const formData = {
            "email": "test@example.com"
        };

        accountInfoScript.checkFields("email", formData);

        expect(consoleAlertSpy).toHaveBeenCalledWith("Emails do not match");
    });

    test("should alert invalid email format", () => {
        $("#email_confirm").val("invalid-email");

        const formData = {
            "email": "invalid-email"
        };

        accountInfoScript.checkFields("email", formData);

        expect(consoleAlertSpy).toHaveBeenCalledWith("Email format is invalid. Please follow standard email format: example@domain.com");
    });

    test("should alert passwords do not match", () => {
        $("#password_confirm").val("DifferentPassword123!"); 

        const formData = {
            "password": "Password123!"
        };

        accountInfoScript.checkFields("password", formData);

        expect(consoleAlertSpy).toHaveBeenCalledWith("Passwords do not match");
    });

    test("should alert invalid password format", () => {
        $("#password_confirm").val("short"); 

        const formData = {
            "password": "short"
        };

        accountInfoScript.checkFields("password", formData);

        expect(consoleAlertSpy).toHaveBeenCalledWith(
            `Password format is invalid. Passwords must be at least 8 characters long and include a number and special character`
        );
    });

    test("should alert field name not recognized for unknown fieldName", () => {
        const formData = {
            "unknown_field": "value"
        };

        accountInfoScript.checkFields("unknown", formData);

        expect(consoleAlertSpy).toHaveBeenCalledWith("Field name not recognized");
    });
});


