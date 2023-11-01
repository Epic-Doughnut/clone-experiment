const { craftedResources } = require("./json/craftedResources");

/**
 *
 * @param {string} material
 * @returns
 */
function getCraftedResource(material) {
    // try {
    material = material.toLowerCase();
    // } catch (error) {
    //     console.warn(material, error);
    //     return null;
    // }
    if (craftedResources.hasOwnProperty(material)) {
        return craftedResources[material].value;
    } else {
        throw ("Invalid crafted resource:" + material); // For debugging
    }
}
exports.getCraftedResource = getCraftedResource;
