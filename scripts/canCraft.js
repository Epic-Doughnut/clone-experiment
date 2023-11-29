const { craftedResources } = require("./json/craftedResources");
const { getMaterial } = require('./getMaterial');

/**
 * Determine whether the given resource can be crafted.
 * @param {string} resourceKey The key of the resource to check.
 * @returns True if the resource can be crafted, false otherwise.
 */
function canCraft(resourceKey) {
    if (!craftedResources[resourceKey]) return false;
    let requirements = craftedResources[resourceKey].cost;

    // Check if all requirements are met
    // try {
    // console.log(resourceKey, requirements);
    for (const [mat, val] of Object.entries(requirements))
        if (getMaterial(mat) < val)
            return false;
    // } catch (err) {
    // console.warn('Error in calculating requirements: ', resourceKey, requirements, err);
    // }

    return true;
}
exports.canCraft = canCraft;