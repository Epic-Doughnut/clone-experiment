const { resources } = require("./json/resources");
const { updateTotal } = require('./jobs');
const { updateDisplayValue } = require("./sidebar");

/**
 * Sets the max value for a material.
 * @param {string} material The name of the material.
 * @param {number} num The number of the material.
 */
function setMax(material, num) {
    if (resources[material] === undefined) return;
    resources[material].max = num;
    updateDisplayValue(material);
    updateTotal();
}
exports.setMax = setMax;