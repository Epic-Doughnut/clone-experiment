
/* BUILDINGS */

function getBuildingCount(buildingName) {
    return buildings[buildingName].count;
}
function getBoost(buildingName, resource) {
    const building = buildings[buildingName];
    if (building && building.boost && building.boost[resource]) {
        return building.boost[resource];
    }
    return null;
}

function generateEffectString(building) {
    let effectParts = [];

    for (let [resource, effect] of Object.entries(building.effects)) {
        for (let [key, value] of Object.entries(effect)) {
            if (key === "max") {
                effectParts.push(`+${value} max ${resource}`);
            } else if (key === "multiplier") {
                let percentageBoost = Math.round((value - 1) * 100);
                effectParts.push(`+${percentageBoost}% ${resource} production`);
            }
            // Add more conditions here if you introduce new types of effects
        }
    }

    for (let [resource, boost] of Object.entries(building.boost)) {
        for (let [key, value] of Object.entries(boost)) {
            if (key === "multiplier") {
                let percentageBoost = Math.round((value - 1) * 100);
                effectParts.push(`+${percentageBoost}% ${resource} production`);
            }
            // Similarly, add more conditions here for new types of boosts
        }
    }

    return effectParts.join(', ');
}

// Usage:

function recalculateBuildingCost(buildingKey) {
    let building = buildings[buildingKey];
    if (building && building.cost && building.ratio) {
        for (let material in building.cost) {
            building.cost[material] = building.cost[material] * Math.pow(building.ratio, building.count);
        }
    }

    // Update tooltip cost
    const myButton = document.querySelector('#' + buildingKey);
    var newText = generateBuildingTooltipCost(building.cost);
    myButton.setAttribute('data-tooltip-cost', newText);
    // map(([material, amount]) => `${amount.toFixed(2)} ${material}`).join(', ');
    const effectString = generateEffectString(building);
    myButton.setAttribute('data-tooltip-effect', effectString);
    // console.log(effectString);
}





function createBuildingButton(buildingKey) {
    const building = buildings[buildingKey];

    const costs = Object.entries(building.cost)
        .map(([material, amount]) => `${material}: ${amount}`)
        .join(', ');

    const halfCostRequirement = Object.entries(building.cost)
        .map(([material, amount]) => `getMaterial('${material}') >= ${Math.floor(amount / 2)}`)
        .join(' && ');

    let requirementString = `return ${halfCostRequirement}`;

    // Check if the building has an effect on clones max
    if (building.effects && building.effects.clones && building.effects.clones.max) {
        requirementString += ` && passedStage('clone')`;
    }

    const button = {
        'class': 'tooltip ' + buildingKey,
        'tab': 'production',
        'text': `${buildingKey.charAt(0).toUpperCase() + buildingKey.slice(1)}`,
        'tooltipDesc': generateTooltipDescription(buildingKey),
        'tooltipCost': costs,
        'requirement': new Function(requirementString),
        'data_building': buildingKey,
    };

    return button;
}





function generateTooltipDescription(buildingKey) {
    const quips = {
        "shelter": "For when you need a home away from home.",
        "shed": "The ultimate storage solution for the pack rat in you.",
        "fish_traps": "Fishing made easy. No patience required.",
        "drying_racks": "Air drying: Nature's way of preserving food.",
        "mine": "Dig deep and find your inner ore.",
        "campfire": "Where stories are told and marshmallows are toasted.",
        "house": "Every clone's dream. Minus the white picket fence.",
        "lumber_yard": "Wood you like some more wood?",
        "stone_quarry": "Rock on with your bad self!",
        "fishery": "Fish are friends. And food.",
        "vineyard": "For the finest vines. What else would it grow?",
        "observatory": "Stargazing has never been so... productive?",
        "forge": "Melt, mold, and make marvelous metals.",
        "workshop": "DIY's dream destination.",
        "library": "Knowledge is power. And a fire hazard if not stored properly."
    };

    return quips[buildingKey] || "A mysterious building with untold benefits.";
}

for (let buildingKey in buildings) {
    const button = createBuildingButton(buildingKey);
    buttons[buildingKey] = button;
    // console.log("Made button for " + buildingKey);
}


console.log(buttons);

function getBuildingCost(buildingName) {
    return buildings[buildingName].cost;
}

function canBuyBuilding(buildingName) {
    // Check if we have enough resources
    let canBuy = true;
    const building = buildings[buildingName];

    for (const resource in building.cost) {
        if (building.cost[resource] > getMaterial(resource)) {
            canBuy = false;
            break;
        }
    }

    // console.log('can we buy ',buildingName,canBuy);
    return canBuy;
}

function buyBuilding(buildingName) {
    console.log("Buying building " + buildingName);
    const building = buildings[buildingName];



    if (canBuyBuilding(buildingName)) {
        // Subtract the cost
        for (const resource in building.cost) {
            console.log("Reducing ", resource, "by", building.cost[resource]);
            increaseMaterial(resource, -building.cost[resource]);
        }
        // Add the effects
        for (const effect in building.effects) {
            if (building.effects[effect].max) {
                increaseMax(resources[effect], building.effects[effect].max);
            }
            // Additional logic can be added here for other effects (e.g., increase production rates)
        }


        // Actually build the building
        building.count++;

        updateSidebar();
        // Update button text
        updateBuildingButtonCount(buildingName, building.count);

        // Update the cost of the building
        recalculateBuildingCost(buildingName);


    }
}

function updateBuildingButtonCount(buildingName, buildingCount) {
    document.getElementById(`${buildingName}`).textContent = `${buildingName} (${buildingCount})`;

}

console.log("BUILDING.JS LOADED");