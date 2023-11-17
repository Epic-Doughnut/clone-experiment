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
 * Create a string representation of the effect of a building
 * @param {Object} building The building object
 * @returns The string representation of the effect of the building
 */
function generateEffectString(building) {
    let effectParts = [];

    for (let [resource, value] of Object.entries(building.effects)) {
        effectParts.push(`+${value} max ${resource}`);
    }

    for (let [resource, boost] of Object.entries(building.boost)) {
        let percentageBoost = Math.round((boost - 1) * 100);
        if (isPondered('effectiveBuildings')) percentageBoost *= 1.01;
        effectParts.push(`+${percentageBoost}% ${resource} production`);

    }

    return effectParts.join('<br>');
}

/**
 * Generate a string representation of the cost of the building
 * @param {Object} cost The building cost configuration
 * @returns A string representation of the cost of the building separated by new lines
 */
function generateBuildingTooltipCost(cost) {
    return Object.entries(cost).map(([material, amount]) => `${amount.toFixed(2)} ${material}`).join('\n');
}

/**
 * Create a button for a building
 * @param {string} buildingKey The name of the building
 * @param {Object} buildings Main buildings object
 * @returns The building button
 */
function createBuildingButton(buildingKey, buildings) {
    try {
        const building = buildings[buildingKey];

        // Deep copy basecost to create cost
        building['cost'] = JSON.parse(JSON.stringify(building.basecost));

        const costs = Object.entries(building.cost)
            .map(([material, amount]) => `${material}: ${amount}`)
            .join(', ');

        const requirementFunction = createRequirementFunction(building.cost);
        console.log('create building button:', building, JSON.parse(JSON.stringify(building.emoji)));
        const button = {
            'class': 'tooltip ' + buildingKey,
            'tab': 'production',
            'text': `${JSON.parse(JSON.stringify(building.emoji))} ${capitalizeFirst(buildingKey)} (${building.count})`,
            'tooltipDesc': buildings[buildingKey].tooltipDesc || "A mysterious building with untold benefits.",
            'tooltipCost': costs,
            'requirement': () => requirementFunction(),
            'data_building': buildingKey,
        };

        return button;
    } catch (error) {
        console.error('Could not create building button for', buildingKey, buildings);

    }
}

/**
 * Create a function that checks if a building should be visible
 * @param {Object} costs The costs of the building
 * @returns A function that checks if a building should be visible
 */
function createRequirementFunction(costs) {
    return function () {
        const costCondition = Object.entries(costs)
            .every(([material, amount]) => {
                const hasEnoughResource = getMaterial(material) >= Math.floor(amount / 2);
                // console.log(`Checking ${material}: Need ${Math.floor(amount / 2)}, Have ${getMaterial(material, resources)}, Result: ${hasEnoughResource}`);
                return hasEnoughResource;
            });

        return passedStage('clones') && costCondition;
    };
}


/**
 * Buys a building if possible
 * @param {string} buildingName The name of the building
 * @returns 
 */
function buyBuilding(buildingName) {
    console.log("Buying building " + buildingName);
    const building = buildings[buildingName];



    if (!canBuyBuilding(buildingName)) return;

    // Actually build the building
    building.count++;

    // Subtract the cost
    for (const resource in building.cost) {
        increaseMaterial(resource, -building.cost[resource]);
    }
    // Add the effects
    for (const [resource, amount] of Object.entries(building.effects)) {
        // console.log('bought building effects', resource, amount);
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
    recalculateBuildingCost(buildingName);


    // addToBuildingList(buildingName, building.emoji);
    updateBuildingList();
}

/**
 * Buys the maximum number of buildings that can be purchased
 * @param {string} buildingName The name of the building
 * @returns The number of buildings that were purchased
 */
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


module.exports = {
    generateBuildingTooltipCost,
    createBuildingButton,
    buyMaxBuildings,
    buyBuilding,
    generateEffectString,
    updateBuildingList
};