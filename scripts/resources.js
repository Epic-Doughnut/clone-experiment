
// DEPENDS ON: tools.js, jobs.js

/**
 * 
 * @param {string} job 
 * @param {string} resource 
 * @returns 
 */
function isResourceAffectedByJob(job, resource) {
    const skill = skills[job];
    if (!skill) return false;

    if (skill.affectedResources.includes(resource)) {
        // Check if there's a tool requirement for this resource
        if (skill.needTools && Array.isArray(skill.needTools)) {
            for (let toolObj of skill.needTools) {
                for (let tool in toolObj) {
                    if (toolObj[tool].includes(resource)) {
                        // Check if player has this tool
                        // For now, just returning true to indicate the resource is affected and a tool is needed
                        // But you may want to replace this with a check to see if the player possesses the required tool
                        return hasTool(tool);
                    }
                }
            }
            // We needed a tool but not for this
            return true;
        }
        // If no tool requirement was found for the resource, it's still affected by the job
        else {
            return true;
        }
    }
    return false;
}


// Clones work at 1/4 the speed by default
var cloneMult = 0.25;
function calcIncrease(resource, delta_time) {
    var total = 0;

    // clones increase by 1 per second as long as there's space
    // if (resource === 'clones' && passedStage('clone')) {
    //     total = 1;
    //     return total;
    // }
    if (!resources.hasOwnProperty(resource)) return total;

    // Check tools
    var currTool = getToolValueForResource(resources[resource]);
    // Gathering personally
    if (resources[resource].isGetting) {
        total += currTool;
    }

    // Check jobs
    for (let job in jobCounts) {
        if (isResourceAffectedByJob(job, resource)) {
            total += cloneMult * jobCounts[job];
        }
    }


    // Apply skills to all clones
    for (let skill in skills) {
        if (skills[skill].affectedResources.includes(resource)) {
            var mult = 1 + (Math.pow(1.2, skills[skill].level) - 1) / 100;
            // console.log("Multiplying gain by " + mult);
            total *= mult;
        }
    }


    // All buildings after level
    for (let building in buildings) {
        const boostData = getBoost(building, resource);
        if (boostData && boostData.multiplier) {
            total *= Math.pow(boostData.multiplier, buildings[building].count);
        }
    }
    if (resource === 'ponder') {
        // console.log("PONDERING INC: ",total);
    }


    // Convert from seconds to milliseconds
    total *= delta_time / 1000;
    // round total to nearest thousandth
    total = parseFloat(total.toFixed(3));
    // console.log("time for resources", delta_time, resource, total);
    return total;
}



function updateDisplayValue(material) {
    const element = document.querySelector("#" + material + "Value");
    if (element) {
        element.textContent = getMaterial(material).toFixed(1);
    } else {
        const craftedButton = document.querySelector(`button#craft${material}`);
        if (craftedButton) {
            const countSpan = craftedButton.querySelector(`#${material}Value`);
            if (countSpan) {
                countSpan.textContent = getCraftedResource(material).toFixed(1);
            }
        } else {
            console.warn(`No display element found for material: ${material}`);
        }
    }
}



function increaseMax(material, num) {
    console.log("increase max ", material, num);
    resources[material].max += num;
    updateSidebar();
}
// Generic increase
function increaseMaterial(material, num) {
    // Ensure we actually need to do anything
    if (num == 0) return;

    if (Math.abs(num) > 5) console.log('changing', material, 'by', num);

    // This check ensures that the material key exists in the resources map.
    if (resources.hasOwnProperty(material)) {
        if (isPondered('fasterResourceGain')) num *= 1.05;

        if (resources[material].value < resources[material].max && num > 0) {
            resources[material].value += num;
            updateSkills(material, num);
        } else if (num < 0) {
            resources[material].value += num;
        } else {
            resources[material].value = resources[material].max;

        }
        updateDisplayValue(material);


    }
    else if (craftedResources.hasOwnProperty(material)) {
        craftedResources[material].value += num;
        updateDisplayValue(material);
        updateSkills(material, num);
    }

    // crafted materials have no max, a la Kittens Game

    updateSidebar();



    updateSidebar();



    // resources[material].value += num;
    // document.querySelector("#" + material + "Value").textContent = resources[material].value;

}


function updateResourceIncreaseRates() {
    // const resources = ["clones", "sticks", "vines", "rocks", "fish", "wood", "ponder"];
    for (let resource in resources) {
        // console.log("increase of " + resource);
        const rate = calcIncrease(resource, 1000);
        var rateElement = document.getElementById(`${resource}IncreaseRate`);
        if (rateElement) rateElement.textContent = rate;
    }
}

function createCraftedResourceButton(config) {
    const button = document.createElement('button');
    button.className = config.class + ' tooltip';
    button.setAttribute('id', config.id);
    const cleanCount = parseFloat(config.count).toFixed(0);
    button.innerHTML = `${config.text}: <span id="${config.resourceName + "Value"}">${cleanCount}</span>`;
    // button.tooltipDesc = config.tooltipDesc; 
    button.tab = 'experiment';

    return button;
}


function appendCraftedResourceButtons() {
    const container = document.querySelector('#craftedResourceButtons');

    // Define the button configurations based on the existing paragraphs
    const resourceConfigs = [
        {
            text: 'Sharp Rocks',
            id: 'craftRocks',
            resourceName: 'sharprocks',
            // countId: 'sharpRocksValue',
            count: 0,
            requirement: () => getMaterial('rocks') >= 5,
            tooltipDesc: 'Craft a rock using nothing but rocks!',
            tooltipCost: 'Rocks: 5',
            class: 'craftRocks'
        },
        {
            text: 'Rope',
            id: 'craftRope',
            resourceName: 'rope',
            // countId: 'ropeValue',
            count: 0,
            requirement: () => getMaterial('vines') >= 3,
            tooltipDesc: 'The basis of attaching things to other things.',
            tooltipCost: 'Vines: 3',
            class: 'rope'
        },
        {
            text: 'Handles',
            id: 'craftHandle',
            resourceName: 'handle',
            // countId: 'handleValue',
            count: 0,
            requirement: () => getCraftedResource('sharpRocks') >= 1,
            tooltipDesc: 'Shear off that bark to hold it better',
            tooltipCost: 'Sharp Rocks: 1',
            class: 'craftRocks'
        },
        {
            text: 'Staffs',
            id: 'craftStaff',
            resourceName: 'staff',
            // countId: 'staffValue',
            count: 0,
            requirement: () => getCraftedResource('handle') >= 1,
            tooltipDesc: 'Stick some sheared sticks together',
            tooltipCost: 'Handles: 2',
            class: 'rope'
        },
        {
            text: 'Spears',
            id: 'craftSpear',
            resourceName: 'spear',
            // countId: 'spearValue',
            count: 0,
            requirement: () => getCraftedResource('staff') >= 1,
            tooltipDesc: 'A long and pointy stick',
            tooltipCost: 'Staffs: 1',
            class: 'rope'
        },
        {
            text: 'Axes',
            id: 'craftAxe',
            resourceName: 'axe',
            // countId: 'axeValue',
            count: 0,
            requirement: () => getCraftedResource('spear') >= 1,
            tooltipDesc: 'Put a rock straight through that handle',
            tooltipCost: 'Spears: 1',
            class: 'rope'
        },
        {
            text: 'Pickaxes',
            id: 'craftPickaxe',
            resourceName: 'pickaxe',
            // countId: 'pickaxeValue',
            count: 0,
            requirement: () => getCraftedResource('axe') >= 1,
            tooltipDesc: 'Sadly not made of diamonds',
            tooltipCost: 'Axes: 1',
            class: 'rope'
        },
        {
            text: 'Fishing Rods',
            id: 'craftFishingRod',
            resourceName: 'fishingrod',
            count: 0,
            requirement: () => passedStage('fishing'),
            tooltipDesc: 'A weapon feared by underwater life',
            tooltipCost: '',
            class: 'rope'
        },
        {
            text: 'Gold',
            id: 'craftGold',
            resourceName: 'gold',
            count: 0,
            requirement: () => passedStage('metal-working'),
            tooltipDesc: "There's some yellow bits in this ore",
            tooltipCost: '',
            class: 'metal-working'
        }
        // ... other resources as needed
    ];


    // Capture the count values before deleting the paragraphs
    // for (let config of resourceConfigs) {
    //     config.count = document.getElementById(config.countId).textContent;
    // }

    // // Clear out the existing children (i.e., the <p> elements)
    // while (container.firstChild) {
    //     container.removeChild(container.firstChild);
    // }

    // For each resource, create a button using the captured counts
    for (let config of resourceConfigs) {

        config.count = craftedResources[config.resourceName].value;
        const button = createCraftedResourceButton(config);
        button.setAttribute('data-tooltip-desc', config.tooltipDesc);
        button.setAttribute('data-tooltip-cost', generateTooltipCost(getCraftedResourceConfigById(config.id).requires));

        container.appendChild(button);
        buttons[config.id] = config;
    }
}

// Call the function to replace <p> elements with the buttons
appendCraftedResourceButtons();


function generateTooltipCost(requirements) {
    return requirements.map(req => `${req.amount} ${req.material}`).join(', ');
}


function getCraftedResourceConfigById(id) {
    for (let c in craftedResources) {
        if (craftedResources[c].id === id) {
            return craftedResources[c];
        }
    }
    return null;
}

function getCraftedResourceKeyByConfig(config) {
    for (let k in craftedResources) {
        // console.log(k);
        if (craftedResources[k].id === config.id) return k;
    }
    return null;
}

/**
 * 
 * @param {string} material 
 * @returns 
 */
function getCraftedResource(material) {
    material = material.toLowerCase();
    if (craftedResources.hasOwnProperty(material)) {
        return craftedResources[material].value;
    } else {
        console.warn("Invalid crafted resource:", material);  // For debugging
        return -1;
    }
}

// Calculate the final number of crafted goods from bonuses
function calcCraftBonus(resourceKey) {
    return 1;
}


function canCraft(resourceKey) {
    let canCraft = true;
    let requirements = craftedResources[resourceKey].requires;

    // Check if all requirements are met
    for (let req of requirements) {
        if (getMaterial(req.material) < req.amount) {
            canCraft = false;
            break;
        }
    }

    return canCraft;
}


// Craft function
function craftResource(resourceKey) {
    if (!craftedResources.hasOwnProperty(resourceKey)) {
        console.log("Invalid craft:" + resourceKey);
        return;
    }

    let requirements = craftedResources[resourceKey].requires;

    if (canCraft(resourceKey)) {
        for (let req of requirements) {
            increaseMaterial(req.material, -req.amount);
        }
        craftedResources[resourceKey].value += calcCraftBonus(resourceKey);
        // document.querySelector("#" + resourceKey + "Value").textContent = craftedResources[resourceKey].value.toFixed(2);
        craftedResources[resourceKey].craftedOnce = true;
        updateDisplayValue(resourceKey);
    }
}
