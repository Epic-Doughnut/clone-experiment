/**
 * Recalculates the cost of a building
 * @param {string} buildingKey The building we recalculate the cost of
 */
function recalculateBuildingCost(buildingKey) {
    const buildings = require('./json/buildings').buildings;
    let building = buildings[buildingKey];
    if (building && building.cost && building.ratio) {
        for (let material in building.cost) {
            console.log(building, building.basecost[material], building.ratio, building.count);
            building['cost'][material] = Math.round(building.basecost[material] * Math.pow(building.ratio, building.count));

            if (require('./perks').hasPerk('Architect')) building.cost[material] *= 0.75; // 25% reduction for architects
            if (require('./json/prestige').hasPrestige('cheaperBuildings'))
                building.cost[material] *= Math.pow(0.95, require('./json/prestige').getLevelOfPrestige('cheaperBuildings')); // 5% reduction
        }
    }

    // Update tooltip cost
    const myButton = document.querySelector('#' + buildingKey);
    var newText = require('./resources').generateTooltipCost(building.cost);
    if (myButton) {
        myButton.setAttribute('data-tooltip-cost', newText);
        const effectString = require('./buildings').generateEffectString(building);
        myButton.setAttribute('data-tooltip-effect', effectString);

    }
    else { throw "Button not found for " + buildingKey; }

}
exports.recalculateBuildingCost = recalculateBuildingCost;

function recalculateAllBuildingCosts() {
    const buildings = require('./json/buildings').buildings;
    for (let buildingKey of Object.keys(buildings)) {
        recalculateBuildingCost(buildingKey);
    }
}
exports.recalculateAllBuildingCosts = recalculateAllBuildingCosts;