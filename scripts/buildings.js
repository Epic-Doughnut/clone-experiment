const { buildings, isPopBuilding } = require('./json/buildings');
const { buttons } = require('./json/buttons');
const { resources } = require('./json/resources');
const { increaseMaterial, increaseMax, } = require('./resources');
const { updateTotal } = require('./jobs');
const { hasPerk } = require('./perks');
const { getMaterial } = require('./getMaterial');
const { passedStage } = require('./stages');
const { recalcMaxClones } = require('./recalcMaxClones');
const { updateSidebar } = require('./sidebar');
const { updateBuildingButtonCount } = require('./updateBuildingButtonCount');
const { recalculateBuildingCost } = require('./recalculateBuildingCost');
const { canBuyBuilding } = require('./canBuyBuilding');
const { updateTooltip, hideTooltip } = require('./updateTooltip');

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

    const button = {
        'class': 'tooltip ' + buildingKey,
        'tab': 'production',
        'text': `${buildingKey.charAt(0).toUpperCase() + buildingKey.slice(1)}`,
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
    }


    // Actually build the building
    building.count++;

    updateSidebar();

    updateTotal();
    // Update button text
    updateBuildingButtonCount(buildingName, building.count);

    // Update the cost of the building
    recalculateBuildingCost(buildingName, buildings, hasPerk);

    // Update max clones after updating the count
    recalcMaxClones();

    updateBuildingList();
}
function fitCharToCell(char, cellWidth, cellHeight, initialFontSize) {
    // Create a temporary span element to measure the character
    const span = document.createElement('span');
    span.textContent = char;
    span.style.fontSize = `${initialFontSize}px`;
    span.style.position = 'absolute'; // so it doesn't affect the layout
    span.style.whiteSpace = 'nowrap'; // to prevent line breaks
    span.style.visibility = 'hidden'; // to keep it hidden
    document.body.appendChild(span);

    // Check if the span fits within the dimensions, and adjust font size if not
    let currentFontSize = initialFontSize;
    while (span.offsetWidth < cellWidth && span.offsetHeight < cellHeight) {
        currentFontSize++;
        span.style.fontSize = `${currentFontSize}px`;

        // Optional: stop if the font size gets too small
        if (currentFontSize >= 1000) {
            break;
        }
    }

    // Clean up: remove the temporary span element
    document.body.removeChild(span);

    return currentFontSize;
}

function updateBuildingList() {
    const buildingList = document.getElementById('buildingList');
    buildingList.innerHTML = '';
    let i = 0;
    const gridSize = 6;
    const maxCellWidth = 36;
    const maxCellHeight = 48;
    const initialFontSize = 36; // starting font size

    for (const [key, val] of Object.entries(buildings)) {
        for (let j = 0; j < val.count; ++j, ++i) {
            let col = (i % gridSize + 1).toString();
            let row = Math.floor(i / gridSize + 1).toString();

            // Calculate the best font size for this character
            const fontSize = fitCharToCell(val.emoji || '?', maxCellWidth, maxCellHeight, initialFontSize);

            // Add the span with the calculated font size
            buildingList.innerHTML += `<span class = 'tooltip' style='grid-column:${col}; grid-row:${row}; font-size:${fontSize}px' tooltipDesc='${key}'>${val.emoji || '?'}</span>`;
            buildingList.querySelectorAll('span.tooltip').forEach((span) => {
                span.addEventListener('mouseenter', () => {
                    updateTooltip(span);
                });
                span.addEventListener('mouseleave', () => {
                    hideTooltip();
                });
            });
        }
    }
}

function buyMaxBuildings(buildingName) {
    let i = 0;
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