const { buildings, isPopBuilding } = require('./json/buildings');
const { increaseMaterial, increaseMax, } = require('./resources');
const { updateTotal } = require('./jobs');
const { hasPerk } = require('./perks');
const { getMaterial } = require('./getMaterial');
const { passedStage } = require('./stages');
const { recalcMaxClones } = require('./recalcMaxClones');

const { updateBuildingButtonCount } = require('./updateBuildingButtonCount');
const { recalculateBuildingCost } = require('./recalculateBuildingCost');
const { canBuyBuilding } = require('./canBuyBuilding');
const { isPondered } = require('./ponder');
const { updateBuildingList } = require('./updateBuildingList');
const { capitalizeFirst } = require('./capitalizeFirst');

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
        if (isPondered('effectiveBuildings')) percentageBoost *= 1.01;
        effectParts.push(`+${percentageBoost}% ${resource} production`);

    }

    return effectParts.join(', ');
}

function generateBuildingTooltipCost(cost) {
    return Object.entries(cost).map(([material, amount]) => `${amount.toFixed(2)} ${material}`).join('\n');
}


function createBuildingButton(buildingKey, buildings) {
    const building = buildings[buildingKey];

    // building.cost = building.basecost;
    building.cost = JSON.parse(JSON.stringify(building.basecost));

    const costs = Object.entries(building.cost)
        .map(([material, amount]) => `${material}: ${amount}`)
        .join(', ');

    // const halfCostRequirement = Object.entries(building.cost)
    //     .map(([material, amount]) => `getMaterial('${material},resources') >= ${Math.floor(amount / 2)}`)
    //     .join(' && ');

    // let requirementString = `return ${halfCostRequirement}`;

    // Check if the building has an effect on clones max
    // if (building.effects && building.effects['clones']) {
    //     requirementString += ` && passedStage('clones')`;
    // }
    const requirementFunction = createRequirementFunction(building.cost, buildingKey);
    console.log('create building button:', building, JSON.parse(JSON.stringify(building.emoji)));
    const button = {
        'class': 'tooltip ' + buildingKey,
        'tab': 'production',
        'text': `${JSON.parse(JSON.stringify(building.emoji))} ${capitalizeFirst(buildingKey)}`,
        'tooltipDesc': buildings[buildingKey].tooltipDesc || "A mysterious building with untold benefits.",
        'tooltipCost': costs,
        'requirement': () => requirementFunction(),
        'data_building': buildingKey,
    };

    return button;
}

function createRequirementFunction(costs, buildingKey) {
    return function () {
        const costCondition = Object.entries(costs)
            .every(([material, amount]) => {
                const hasEnoughResource = getMaterial(material) >= Math.floor(amount / 2);
                // console.log(`Checking ${material}: Need ${Math.floor(amount / 2)}, Have ${getMaterial(material, resources)}, Result: ${hasEnoughResource}`);
                return hasEnoughResource;
            });
        // console.log(`PassedStage for ${buildingKey}: ${passedStage('clones')}`);
        // console.log(`Cost condition for ${buildingKey}: ${costCondition}`);

        return passedStage('clones') && costCondition;
    };
}








// console.log(buttons);

function getBuildingCost(buildingName) {
    return buildings[buildingName].cost;
}


function buyBuilding(buildingName) {
    console.log("Buying building " + buildingName);
    const building = buildings[buildingName];



    if (!canBuyBuilding(buildingName)) return;
    // Actually build the building
    building.count++;

    // Subtract the cost
    for (const resource in building.cost) {
        // console.log("Reducing ", resource, "by", building.cost[resource]);
        // console.log(increaseMaterial);
        increaseMaterial(resource, -building.cost[resource]);
    }
    // Add the effects
    for (const [resource, amount] of Object.entries(building.effects)) {
        console.log('bought building effects', resource, amount);
        increaseMax(resource, amount);
        // Update max clones after updating the count
        if (resource === 'clones') {
            recalcMaxClones();
            updateTotal();
        }
    }


    // Update button text
    updateBuildingButtonCount(buildingName, building.count, JSON.parse(JSON.stringify(building.emoji)));

    // Update the cost of the building
    recalculateBuildingCost(buildingName, buildings, hasPerk);


    // addToBuildingList(buildingName, building.emoji);
    updateBuildingList();
}
function buyMaxBuildings(buildingName) {
    let i = 0;
    let building = buildings[buildingName];
    // TODO update with cool formula
    // Math.floor(Math.log((currency * (building.ratio - 1)) / (building.basecost * Math.pow(building.ratio, building.count))) / Math.log(building.ratio));
    while (canBuyBuilding(buildingName)) {
        buyBuilding(buildingName);
        ++i;
    }
    return i;
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
    generateBuildingTooltipCost,
    createBuildingButton,
    buyMaxBuildings,
    buyBuilding,
    generateEffectString,
    updateBuildingList
};