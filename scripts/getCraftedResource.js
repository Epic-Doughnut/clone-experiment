/**
 *
 * @param {string} material
 * @returns
 */
function getCraftedResource(material, craftedResources) {

    material = material.toLowerCase();
    if (!craftedResources) {
        craftedResources = require('./json/craftedResources').craftedResources;
        // console.warn('Missing craftedResources definition, loading default', craftedResources);
    }
    if (craftedResources.hasOwnProperty(material)) {
        return craftedResources[material].value || 0;
    } else {
        // console.warn("Invalid crafted resource:" + material); // For debugging
        return 0;
    }
}
exports.getCraftedResource = getCraftedResource;
