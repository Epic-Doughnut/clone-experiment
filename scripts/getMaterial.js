const { getCraftedResource } = require('./getCraftedResource');
// const { craftedResources } = require('./json/craftedResources');

// Get function for materials
/**
 * Get the value of the given material
 * @param {string} material
 * @returns Value of material
*/
function getMaterial(material, resources) {
    if (!resources) resources = require('./json/resources').resources;
    if (resources.hasOwnProperty(material)) {
        return resources[material].value;
    } else {
        // console.error("Invalid material:", material);  // For debugging
        return getCraftedResource(material, null);

    }
}
exports.getMaterial = getMaterial;