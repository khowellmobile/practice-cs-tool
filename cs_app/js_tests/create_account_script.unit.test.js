const createAcctScript = require("../static/js/create_account_script");
const { JSDOM } = require("jsdom");

describe("passwordChecker function", () => {
    let dom;

    beforeEach(() => {
        dom = new JSDOM(
            `<!DOCTYPE html>
                <div>
                    <div id="passChars"></div>
                    <div id="passNums"></div>
                    <div id="passSymbols"></div>
                </div>`
        );
        global.document = dom.window.document;
        global.window = dom.window;

        $ = require("jquery")(dom.window);
    });

    afterEach(() => {
        dom.window.close();
    });

    test("#passChars should have proper class based on minimum length", () => {
        createAcctScript.passwordChecker("#12345678");
        expect($("#passChars").hasClass("completed")).toBe(true);
        expect($("#passChars").hasClass("uncompleted")).toBe(false);

        createAcctScript.passwordChecker("#1234");
        expect($("#passChars").hasClass("uncompleted")).toBe(true);
        expect($("#passChars").hasClass("completed")).toBe(false);
    });

    test("#passNums should have proper class based on presence of digit", () => {
        createAcctScript.passwordChecker("#12345678");
        expect($("#passNums").hasClass("completed")).toBe(true);
        expect($("#passNums").hasClass("uncompleted")).toBe(false);

        createAcctScript.passwordChecker("#abcdefgh");
        expect($("#passNums").hasClass("uncompleted")).toBe(true);
        expect($("#passNums").hasClass("completed")).toBe(false);
    });

    test("#passSymbols should have proper class based on presence of special character", () => {
        createAcctScript.passwordChecker("#12345678");
        expect($("#passSymbols").hasClass("completed")).toBe(true);
        expect($("#passSymbols").hasClass("uncompleted")).toBe(false);

        createAcctScript.passwordChecker("12345678");
        expect($("#passSymbols").hasClass("uncompleted")).toBe(true);
        expect($("#passSymbols").hasClass("completed")).toBe(false);
    });

    test("should return true for valid passwords", () => {
        expect(createAcctScript.passwordChecker("#GoodPass1")).toBe(true);
        expect(createAcctScript.passwordChecker("#Ju5tMaK1nGSur3")).toBe(true);
    });

    test("should return false for invalid passwords", () => {
        expect(createAcctScript.passwordChecker("short")).toBe(false);
        expect(createAcctScript.passwordChecker("longbutnodigit!")).toBe(false);
        expect(createAcctScript.passwordChecker("longbutnospecial1")).toBe(false);
    });
});

describe("validateEmail function", () => {
    test("should return true with proper email specifications", () => {
        let goodEmail = "test@testing.com";

        expect(createAcctScript.validateEmail(goodEmail)).toBe(true);
    });

    test("should return false with an email without an @ symbol", () => {
        let eNoAtSymbol = "testtesting.com";

        expect(createAcctScript.validateEmail(eNoAtSymbol)).toBe(false);
    });

    test("should return false with email without '.[2 chars]'", () => {
        let pNoSpecial = "test@testing.k";

        expect(createAcctScript.validateEmail(pNoSpecial)).toBe(false);
    });

    test("should return false with email without '.'", () => {
        let eNoPeriod = "test@testingcom";

        expect(createAcctScript.validateEmail(eNoPeriod)).toBe(false);
    });

    test("should return false with email without out local part before @", () => {
        let eNoLocalPart = "@testing.com";

        expect(createAcctScript.validateEmail(eNoLocalPart)).toBe(false);
    });

    test("should return false with email with leading or trailing spaces", () => {
        let eWithSpaces = " test@testing.com ";

        expect(createAcctScript.validateEmail(eWithSpaces)).toBe(false);
    });

    test("should return false with email with invalid characters before @", () => {
        let eWithInvalidChars = "test!#$%&'*+/=?^_`{|}~@testing.com";

        expect(createAcctScript.validateEmail(eWithInvalidChars)).toBe(false);
    });

    test("should return false with email with invalid characters before @", () => {
        let eWithInvalidChars = "test!#$%&'*+/=?^_`{|}~@testing.com";

        expect(createAcctScript.validateEmail(eWithInvalidChars)).toBe(false);
    });
});

describe("validateName function", () => {
    test("should return true with proper name specifications", () => {
        let goodName = "John Doe-'";

        expect(createAcctScript.validateName(goodName)).toBe(true);
    });

    test("should return false with name less than 2 chars", () => {
        let nLessThanTwo = "a";

        expect(createAcctScript.validateName(nLessThanTwo)).toBe(false);
    });

    test("should return false with name with non-allowed chars", () => {
        let nWithSpecChars = "John#%$#67";

        expect(createAcctScript.validateName(nWithSpecChars)).toBe(false);
    });
});

describe("validateForm function", () => {
    let dom;

    beforeEach(() => {
        dom = new JSDOM(
            `<!DOCTYPE html>
                <div>
                    <input type="text" id="firstName" />
                    <input type="text" id="lastName" />
                    <input type="text" id="email" />
                    <input type="password" id="password" />
                </div>`
        );
        global.document = dom.window.document;
        global.window = dom.window;

        $ = require("jquery")(dom.window);

        // Mocking alert function
        global.alert = jest.fn();
    });

    afterEach(() => {
        dom.window.close();
    });

    test("should show alert and return false for invalid names", () => {
        $("#firstName").val("John@");
        $("#lastName").val("Doe!");

        const result = createAcctScript.validateForm();

        expect(global.alert).toHaveBeenCalledWith(
            "Name format is invalid. Allowed characters include alphabetical characters, spaces, hyphens, and apostrophes."
        );
        expect(result).toBe(false);
    });

    test("should show alert and return false for invalid email", () => {
        $("#firstName").val("John");
        $("#lastName").val("Doe");
        $("#email").val("invalid-email");
        $("#password").val("ValidPassword1!");

        const result = createAcctScript.validateForm();

        expect(global.alert).toHaveBeenCalledWith(
            "Email format is invalid. Please follow standard email format: example@domain.com"
        );
        expect(result).toBe(false);
    });

    test("should show alert and return false for invalid password", () => {
        $("#firstName").val("John");
        $("#lastName").val("Doe");
        $("#email").val("valid.email@example.com");
        $("#password").val("short");

        const result = createAcctScript.validateForm();

        expect(global.alert).toHaveBeenCalledWith(
            "Password format is invalid. Passwords must be at least 8 characters long, include a number, and include a special character."
        );
        expect(result).toBe(false);
    });

    test("should return true for valid form input", () => {
        $("#firstName").val("John");
        $("#lastName").val("Doe");
        $("#email").val("valid.email@example.com");
        $("#password").val("ValidPassword1!");

        const result = createAcctScript.validateForm();

        expect(global.alert).not.toHaveBeenCalled();
        expect(result).toBe(true);
    });
});
