/**
 *
 * @param {string} material
 * @returns
 */
function getCraftedResource(material, craftedResources) {

    material = material.toLowerCase();
    // Load craftedResources if not provided
    if (!craftedResources) craftedResources = require('./json/craftedResources').craftedResources;

    if (craftedResources.hasOwnProperty(material)) return craftedResources[material].value || 0;
    else return 0;

}
exports.getCraftedResource = getCraftedResource;
