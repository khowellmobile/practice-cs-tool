const accountInfoScript = require("../static/js/sub_scripts/account_information_script");
const { JSDOM } = require("jsdom");

describe("fadeOutPopup function", () => {
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

    test("should hide the popup and page overlay correctly", () => {
        const form = $("#update_testField");
        const overlay = $("#pageOverlay");

        accountInfoScript.fadeOutPopup("testField");

        expect(form.css("display")).toBe("none");
        expect(form.hasClass("show")).toBe(false);
        expect(overlay.css("display")).toBe("none");
    });

    test("should log warning if popup element does not exist", () => {
        $("#update_testField").remove();

        accountInfoScript.fadeOutPopup("testField");

        expect(consoleWarnSpy).toHaveBeenCalledWith('Popup with id "update_testField" does not exist.');
    });

    test("should log warning if overlay element does not exist", () => {
        $("#pageOverlay").remove();

        accountInfoScript.fadeOutPopup("testField");

        expect(consoleWarnSpy).toHaveBeenCalledWith("Page overlay does not exist.");
    });
});

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

        expect(consoleWarnSpy).toHaveBeenCalledWith("Page overlay does not exist.");
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

describe("validatePhoneNumber function", () => {
    test("should return true with a valid phone number", () => {
        let validPhone = "+1 (555) 123-4567";

        expect(accountInfoScript.validatePhoneNumber(validPhone)).toBe(true);
    });

    test("should return false with an invalid phone number format", () => {
        let invalidPhone = "123-abc-4567";

        expect(accountInfoScript.validatePhoneNumber(invalidPhone)).toBe(false);
    });

    test("should return false with a phone number too short", () => {
        let shortPhone = "123";

        expect(accountInfoScript.validatePhoneNumber(shortPhone)).toBe(false);
    });

    test("should return false with a phone number containing special characters", () => {
        let phoneWithSpecialChars = "555-123-#$%";

        expect(accountInfoScript.validatePhoneNumber(phoneWithSpecialChars)).toBe(false);
    });
});

describe("validateCompany function", () => {
    test("should return true with a valid company name", () => {
        let validCompany = "Test Company, Inc.";

        expect(accountInfoScript.validateCompany(validCompany)).toBe(true);
    });

    test("should return false with a company name less than 2 characters", () => {
        let shortCompany = "A";

        expect(accountInfoScript.validateCompany(shortCompany)).toBe(false);
    });

    test("should return false with a company name containing non-allowed characters", () => {
        let companyWithSpecialChars = "Company#123";

        expect(accountInfoScript.validateCompany(companyWithSpecialChars)).toBe(false);
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

    test("should show correct alert message for phone number field error", () => {
        accountInfoScript.ajaxResponseError("phone_number", { error: "Invalid format" });
        expect(global.alert).toHaveBeenCalledWith(
            "Phone number format is invalid. Please follow standard phone number format: (123) 456-7891"
        );
    });

    test("should show correct alert message for company field error", () => {
        accountInfoScript.ajaxResponseError("company", { error: "Invalid format" });
        expect(global.alert).toHaveBeenCalledWith(
            "Company name format is invalid. Allowed characters include alphabetical characters and standard special characters"
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

    test("should log to console for unknown field name", () => {
        accountInfoScript.ajaxResponseError("password", { error: "Old password is incorrect" });
        expect(global.alert).toHaveBeenCalledWith("Old password is incorrect.");
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
                    <div id="phone_number_text"></div>
                    <div id="company_text"></div>
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

    test("should update email text with email address if formdata is complete", () => {
        const formdata = { email: "john.doe@example.com" };

        accountInfoScript.ajaxResponseSuccess("email", formdata);

        expect($("#email_text").text()).toBe("Email: john.doe@example.com");
    });

    test("should update phone number text with phone number if formdata is complete", () => {
        const formdata = { phone_number: "(123) 456-7891" };

        accountInfoScript.ajaxResponseSuccess("phone_number", formdata);

        expect($("#phone_number_text").text()).toBe("(123) 456-7891");
    });

    test("should update company text with company name if formdata is complete", () => {
        const formdata = { company: "Test Company" };

        accountInfoScript.ajaxResponseSuccess("company", formdata);

        expect($("#company_text").text()).toBe("Test Company");
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
                    <div id="update_name">
                    <div id="update_email">
                    <div id="update_password">
                    <div id="update_phone">
                    <div id="update_company">
                    <div id="pageOverlay">
                </div>`
        );

        global.document = dom.window.document;
        global.window = dom.window;
        global.$ = require("jquery")(dom.window);

        // Spy on alert function
        consoleAlertSpy = jest.spyOn(global, "alert").mockImplementation(() => {});
    });

    afterEach(() => {
        dom.window.close();
        consoleAlertSpy.mockRestore();
    });

    test("should return true with proper name", () => {
        const formData = {
            first_name: "John",
            last_name: "Doe",
        };

        let result = accountInfoScript.checkFields("name", formData);
        expect(result).toBe(true);
    });

    test("should alert invalid name format and return false", () => {
        const formData = {
            first_name: "John123",
            last_name: "Doe",
        };

        let result = accountInfoScript.checkFields("name", formData);
        expect(result).toBe(false);

        expect(consoleAlertSpy).toHaveBeenCalledWith(
            `Name format is invalid. Allowed characters include alphabetical characters, spaces, hyphens, and apostrophes.`
        );
    });

    test("should return true with proper email", () => {
        const formData = {
            email: "test@example.com",
        };

        let result = accountInfoScript.checkFields("email", formData);
        expect(result).toBe(true);
    });

    test("should alert emails do not match and return false", () => {
        $("#email_confirm").val("different@example.com");

        const formData = {
            email: "test@example.com",
        };

        let result = accountInfoScript.checkFields("email", formData);
        expect(result).toBe(false);

        expect(consoleAlertSpy).toHaveBeenCalledWith("Emails do not match");
    });

    test("should alert invalid email format and return false", () => {
        $("#email_confirm").val("invalid-email");

        const formData = {
            email: "invalid-email",
        };

        let result = accountInfoScript.checkFields("email", formData);
        expect(result).toBe(false);

        expect(consoleAlertSpy).toHaveBeenCalledWith(
            "Email format is invalid. Please follow standard email format: example@domain.com"
        );
    });

    test("should return true with proper phone number", () => {
        const formData = {
            phone_number: "(123) 456-7891"
        };

        let result = accountInfoScript.checkFields("phone", formData);
        expect(result).toBe(true);
    });

    test("should alert invalid phone number format and return false", () => {
        const formData = {
            phone_number: "123"
        };

        let result = accountInfoScript.checkFields("phone", formData);
        expect(result).toBe(false);

        expect(consoleAlertSpy).toHaveBeenCalledWith(
            `Phone number format is invalid. Please follow standard phone number format: (123) 456-7891`
        );
    });

    test("should return true with proper company name", () => {
        const formData = {
            company: "Test Company",
        };

        let result = accountInfoScript.checkFields("company", formData);
        expect(result).toBe(true);
    });

    test("should alert invalid company name format and return false", () => {
        const formData = {
            company: "A",
        };

        let result = accountInfoScript.checkFields("company", formData);
        expect(result).toBe(false);

        expect(consoleAlertSpy).toHaveBeenCalledWith(
            `Company Name format is invalid. Allowed characters include alphabetical characters and common special characters`
        );
    });

    test("should return true with proper password", () => {
        const formData = {
            password: "Password123!",
        };

        let result = accountInfoScript.checkFields("password", formData);
        expect(result).toBe(true);
    });

    test("should alert passwords do not match and return false", () => {
        $("#password_confirm").val("DifferentPassword123!");

        const formData = {
            password: "Password123!",
        };

        let result = accountInfoScript.checkFields("password", formData);
        expect(result).toBe(false);

        expect(consoleAlertSpy).toHaveBeenCalledWith("Passwords do not match");
    });

    test("should alert invalid password format and return false", () => {
        $("#password_confirm").val("short");

        const formData = {
            password: "short",
        };

        let result = accountInfoScript.checkFields("password", formData);
        expect(result).toBe(false);

        expect(consoleAlertSpy).toHaveBeenCalledWith(
            `Password format is invalid. Passwords must be at least 8 characters long and include a number and special character`
        );
    });

    test("should alert field name not recognized for unknown fieldName and return false", () => {
        const formData = {
            unknown_field: "value",
        };

        let result = accountInfoScript.checkFields("unknown", formData);
        expect(result).toBe(false);

        expect(consoleAlertSpy).toHaveBeenCalledWith("Field name not recognized");
    });
});
