const accountInfoScript = require("../static/js/account_information_script");

describe("validatePassword function", () => {

    test("should return true with proper password specifications", () => {
        let goodPass = "goodPass1#";

        expect(accountInfoScript.validatePassword(goodPass)).toBe(true);
    })

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
    })

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
    })

    test("should return false with name less than 2 chars", () => {
        let nLessThanTwo = "a";

        expect(accountInfoScript.validateName(nLessThanTwo)).toBe(false);
    });

    test("should return false with name with non-allowed chars", () => {
        let nWithSpecChars = "John#%$#67";

        expect(accountInfoScript.validateName(nWithSpecChars)).toBe(false);
    });
});