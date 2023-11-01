const { buildings } = require('./json/buildings');
const { buttons } = require('./json/buttons');
const { resources } = require('./json/resources');
const { increaseMaterial, increaseMax } = require('./resources');
const { canBuyBuilding, updateSidebar } = require('./helper');
const { updateTotal } = require('./jobs');
const { hasPerk } = require('./perks');
const { capitalizeFirst } = require('./capitalizeFirst');
const { getMaterial } = require('./getMaterial');

/* BUILDINGS */



/**
 * 
 * @param {Object} building 
 * @returns 
 */
function generateEffectString(building) {
    let effectParts = [];

    for (let [resource, value] of Object.entries(building.effects)) {
        // for (let [key, value] of Object.entries(effect)) {
        effectParts.push(`+${value} max ${resource}`);
        // Add more conditions here if you introduce new types of effects
        // }
    }

    for (let [resource, boost] of Object.entries(building.boost)) {
        let percentageBoost = Math.round((boost - 1) * 100);
        effectParts.push(`+${percentageBoost}% ${resource} production`);

    }

    return effectParts.join(', ');
}

// Usage:
/**
 * 
 * @param {string} buildingKey 
 * @param {Object} buildings
 * @param {function} hasPerk
 */
function recalculateBuildingCost(buildingKey, buildings, hasPerk) {
    let building = buildings[buildingKey];
    if (building && building.cost && building.ratio) {
        for (let material in building.cost) {
            // console.log(building.basecost[material], building.ratio, building.count);
            building.cost[material] = Math.round(building.basecost[material] * Math.pow(building.ratio, building.count));

            if (hasPerk('Architect')) building.cost[material] *= 0.75; // 25% reduction for architects
        }
    }

    // Update tooltip cost
    const myButton = document.querySelector('#' + buildingKey);
    var newText = generateBuildingTooltipCost(building.cost);
    if (myButton) {
        myButton.setAttribute('data-tooltip-cost', newText);
        const effectString = generateEffectString(building);
        myButton.setAttribute('data-tooltip-effect', effectString);

    }
    else { throw "Button not found for " + buildingKey; }

}


function generateBuildingTooltipCost(cost) {
    return Object.entries(cost).map(([material, amount]) => `${amount.toFixed(2)} ${material}`).join('\n');
}


// function createBuildingButton(buildingKey) {
//     return createBuildingButton(buildingKey, buildings);
// }

function createBuildingButton(buildingKey, buildings) {
    const building = buildings[buildingKey];

    // building.cost = building.basecost;
    building.cost = JSON.parse(JSON.stringify(building.basecost));

    const costs = Object.entries(building.cost)
        .map(([material, amount]) => `${material}: ${amount}`)
        .join(', ');

    const halfCostRequirement = Object.entries(building.cost)
        .map(([material, amount]) => `getMaterial('${material},resources') >= ${Math.floor(amount / 2)}`)
        .join(' && ');

    let requirementString = `return ${halfCostRequirement}`;

    // Check if the building has an effect on clones max
    if (building.effects && building.effects['clones']) {
        requirementString += ` && passedStage('clones')`;
    }

    const button = {
        'class': 'tooltip ' + buildingKey,
        'tab': 'production',
        'text': `${buildingKey.charAt(0).toUpperCase() + buildingKey.slice(1)}`,
        'tooltipDesc': buildings[buildingKey].tooltipDesc || "A mysterious building with untold benefits.",
        'tooltipCost': costs,
        'requirement': new Function(requirementString),
        'data_building': buildingKey,
    };

    return button;
}






for (let buildingKey in buildings) {
    const button = createBuildingButton(buildingKey, buildings);
    buttons[buildingKey] = button;
    // console.log("Made button for " + buildingKey);
}


// console.log(buttons);

function getBuildingCost(buildingName) {
    return buildings[buildingName].cost;
}


function buyBuilding(buildingName) {
    console.log("Buying building " + buildingName);
    const building = buildings[buildingName];



    if (!canBuyBuilding(buildingName)) return;

    // Subtract the cost
    for (const resource in building.cost) {
        // console.log("Reducing ", resource, "by", building.cost[resource]);
        // console.log(increaseMaterial);
        increaseMaterial(resource, -building.cost[resource]);
    }
    // Add the effects
    for (const resource in building.effects) {
        // if (building.effects[effect]) {
        increaseMax(resource, building.effects[resource]);
        // }
        // Additional logic can be added here for other effects (e.g., increase production rates)
    }


    // Actually build the building
    building.count++;

    updateSidebar();

    updateTotal();
    // Update button text
    updateBuildingButtonCount(buildingName, building.count);

    // Update the cost of the building
    recalculateBuildingCost(buildingName, buildings, hasPerk);
}

function buyMaxBuildings(buildingName) {
    while (canBuyBuilding(buildingName)) {
        buyBuilding(buildingName);
    }
}

function updateBuildingButtonCount(buildingName, buildingCount) {
    document.getElementById(`${buildingName}`).textContent = `${capitalizeFirst(buildingName).split('_').join(' ')} (${buildingCount})`;

}




// function doubleStorageEffectsIfPassed() {
//     if (passedStage("doubleStorage1")) {
//         for (let buildingKey in buildings) {
//             let building = buildings[buildingKey];

//             if (building.effects) {
//                 for (let material in building.effects) {
//                     building.effects[material].max *= 2;
//                 }
//             }
//         }
//     }
// }


module.exports = {
    recalculateBuildingCost,
    generateBuildingTooltipCost,
    createBuildingButton,
    updateBuildingButtonCount,
    buyMaxBuildings,
    buyBuilding
};