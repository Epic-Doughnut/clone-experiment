/**
 * Capitalizes the first character of a string
 * @param {string} str stringExample
 * @returns StringExample
 */
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
exports.capitalizeFirst = capitalizeFirst;