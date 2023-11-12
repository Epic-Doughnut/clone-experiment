const { hasPrestige, getLevelOfPrestige } = require('./json/prestige');

/**
 *
 * @param {string} buildingKey The building we recalculate the cost of
 * @param {Object} buildings Buildings object
 * @param {function} hasPerk HasPerk function
 */
function recalculateBuildingCost(buildingKey, buildings, hasPerk) {
    let building = buildings[buildingKey];
    if (building && building.cost && building.ratio) {
        for (let material in building.cost) {
            // console.log(building.basecost[material], building.ratio, building.count);
            building.cost[material] = Math.round(building.basecost[material] * Math.pow(building.ratio, building.count));

            if (hasPerk('Architect')) building.cost[material] *= 0.75; // 25% reduction for architects
            if (hasPrestige('cheaperBuildings')) building.cost[material] *= Math.pow(0.95, getLevelOfPrestige('cheaperBuildings')); // 5% reduction
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