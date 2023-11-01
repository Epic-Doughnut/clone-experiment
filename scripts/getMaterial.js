const { getCraftedResource } = require('./getCraftedResource');

// Get function for materials
/**
 * Get the value of the given material
 * @param {string} material
 * @returns Value of material
*/
function getMaterial(material, resources) {
    if (resources.hasOwnProperty(material)) {
        return resources[material].value;
    } else {
        // console.error("Invalid material:", material);  // For debugging
        return getCraftedResource(material);

    }
}
exports.getMaterial = getMaterial;