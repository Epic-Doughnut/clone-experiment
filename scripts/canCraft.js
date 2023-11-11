const { resources } = require('./json/resources');
const { craftedResources } = require("./json/craftedResources");
const { getMaterial } = require('./getMaterial');

function canCraft(resourceKey) {
    let canCraft = true;
    let requirements = craftedResources[resourceKey].cost;

    // Check if all requirements are met
    try {
        // console.log(resourceKey, requirements);
        for (let mat in requirements) {

            if (getMaterial(mat, resources) < requirements[mat]) {
                canCraft = false;
                break;
            }
        }
    } catch (err) {
        console.warn('Error in calculating requirements: ', resourceKey, requirements, err);
    }

    return canCraft;
}
exports.canCraft = canCraft;