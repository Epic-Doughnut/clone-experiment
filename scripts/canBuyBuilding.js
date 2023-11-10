const { resources } = require('./json/resources');
const { getMaterial } = require('./getMaterial');

/**
 *
 * @param {string} buildingName
 * @returns
 */
function canBuyBuilding(buildingName) {
    // Check if we have enough resources
    let canBuy = true;
    const buildings = require('./json/buildings').buildings;
    const building = buildings[buildingName];

    for (const resource in building.cost) {
        if (building.cost[resource] > getMaterial(resource, resources)) {
            canBuy = false;
            break;
        }
    }

    // console.log('can we buy ',buildingName,canBuy);
    return canBuy;
}
exports.canBuyBuilding = canBuyBuilding;