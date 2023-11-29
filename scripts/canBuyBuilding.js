const { resources } = require('./json/resources');
const { getMaterial } = require('./getMaterial');
const { passedStage } = require('./stages');
const { getMax } = require('./helper');

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

    // Can't buy cloning buildings before clones unlocked
    if (building.effects && building.effects['clones'] && !passedStage('clone')) canBuy = false;

    // console.log('can we buy ',buildingName,canBuy);
    return canBuy;
}
exports.canBuyBuilding = canBuyBuilding;

function canStoreBuilding(buildingName) {
    // Check if we have enough resources
    const buildings = require('./json/buildings').buildings;
    const building = buildings[buildingName];

    return canAffordCost(building.cost);

}
exports.canStoreBuilding = canStoreBuilding;

function canAffordCost(cost) {
    for (const resource in cost) {
        if (cost[resource] > getMax(resource)) {
            return false;
        }
    }
    return true;
}
exports.canAffordCost = canAffordCost;