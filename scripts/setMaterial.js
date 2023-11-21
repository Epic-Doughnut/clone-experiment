const { updateTotal } = require("./jobs");
const { updateDisplayValue } = require("./sidebar");
const { resources } = require("./json/resources");

/**
 *
 * @param {string} material
 * @param {number} num
 */
function setMaterial(material, num) {
    // Check if material exists
    if (resources[material] === undefined) return;
    resources[material].value = num;
    updateDisplayValue(material);
    updateTotal();
}
exports.setMaterial = setMaterial;