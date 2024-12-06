/*
 * Common Script for Django Application
 *
 * This script contains common functions and utilities that are used across multiple pages
 * in the Django application. It helps in maintaining consistency and reusability of code.
 *
 * List of functions:
 * - redirectTo(string url)
 * - [Function 2]
 * - [Function 3]
 */

function redirectTo(url, additionalInfo) {
    if (additionalInfo) {
        const jsonString = JSON.stringify(additionalInfo);

        // Encode the optionalField to make it URL-safe
        const encodedField = encodeURIComponent(jsonString);

        // Append the optionalField as a query parameter
        url += `?additionalInfo=${encodedField}`;
    }

    window.location.href = url;
}

try {
    // Export all functions
    module.exports = {
        redirectTo,
    };
} catch (error) {
    console.log(error);
}
