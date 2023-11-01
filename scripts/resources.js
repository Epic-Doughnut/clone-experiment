
// DEPENDS ON: tools.js, jobs.js
const { resources } = require("./json/resources");
const { craftedResources } = require('./json/craftedResources');
const { buildings, getBoost } = require("./json/buildings");
// @ts-ignore
const { ponders } = require("./json/ponder");
const { buttons } = require("./json/buttons");
const { skills } = require('./json/skills');

const { getWorkers, updateTotal, reassignJobsBasedOnResources } = require('./jobs');
const { hasTool, getToolValueForResource } = require('./tools');
const { updateSidebar, updateSkills, calcCraftBonus } = require("./helper");
const { canCraft } = require('./canCraft');
const { capitalizeFirst } = require('./capitalizeFirst');
const { getMaterial } = require('./getMaterial');

const { hasPerk } = require('./perks');
const { isPondered } = require('./ponder');
const { getCraftedResource } = require('./getCraftedResource');
console.log(capitalizeFirst);

/**
 * 
 * @param {string} job 
 * @param {string} resource 
 * @returns 
 */
// @ts-ignore
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
// console.log('initial', workersDistribution);
function calcIncrease(resourceName, delta_time) {
    var total = 0;

    // clones increase by 1 per second as long as there's space
    // if (resource === 'clones' && passedStage('clone')) {
    //     total = 1;
    //     return total;
    // }
    if (!resources.hasOwnProperty(resourceName)) return total;

    if (resourceName === 'clones' && isPondered('autoClone')) total = 1;
    // Check tools
    var currTool = getToolValueForResource(resources[resourceName]);
    // Gathering personally
    if (resources[resourceName].isGetting) {
        total += currTool;
    }

    // Check jobs
    let leaderMult = hasPerk('Leader') ? cloneMult * 1.5 : cloneMult;
    total += leaderMult * getWorkers(resourceName) || 0;


    // Apply perks production boost
    if (hasPerk('Lumberjack') && (resourceName == 'wood' || resourceName == 'sticks')) total *= 1.25;
    if (hasPerk('Miner') && (resourceName == 'rocks' || resourceName == 'ore')) total *= 1.25;
    if (hasPerk('Botanist') && (resourceName == 'vines' || resourceName == 'herbs' || resourceName == 'wheat')) total *= 1.25;

    // Apply skills to all clones
    for (let skill in skills) {
        if (skills[skill].affectedResources.includes(resourceName)) {
            let skillRatio = 1.2;
            var mult = 1 + (Math.pow(skillRatio, skills[skill].level) - 1) / 100;
            // console.log("Multiplying gain by " + mult);
            total *= mult;
        }
    }


    // All buildings after level
    for (let building in buildings) {
        const boostData = getBoost(building, resourceName);
        if (boostData) {
            var increase = Math.pow(boostData, buildings[building].count);
            if (isPondered('effectiveBuildings')) increase *= 1.01;
            total *= increase;
        }
    }
    if (resourceName === 'ponder') {
        // console.log("PONDERING INC: ",total);
        if (isPondered('ponder1')) total *= 1.05;
    }

    if (isPondered('fasterResourceGain')) total *= 1.05;

    // Convert from seconds to milliseconds
    total *= delta_time / 1000;
    // round total to nearest thousandth
    total = parseFloat(total.toFixed(3));
    // console.log("time for resources", delta_time, resourceName, total);
    return total;
}

function calcSecondsRemaining(resourceName, needed) {
    if (needed <= resources[resourceName]) return 0;

    // How much per second
    const increase = calcIncrease(resourceName, 1000);
    if (increase == 0) return -1;
    // console.log('ping');
    // Difference over time
    const timeRemaining = Math.ceil(needed - resources[resourceName].value) / increase;

    // console.log('calc milli', resourceName, needed, timeRemaining);
    // if (timeRemaining == Infinity || timeRemaining == -Infinity) return -1;
    return timeRemaining;
}

// Create all our resource tags in the sidebar
const resourcesContainer = document.getElementById('resources');
function createResourceTag(resourceName) {
    if (!resources.hasOwnProperty(resourceName)) throw "Invalid resource: " + resourceName;

    const resourceDisplayName = capitalizeFirst(resourceName).split('_').join(' ');

    const resourceElement = document.createElement('p');
    resourceElement.className = `${resourceName} resource`;
    resourceElement.id = `resource-${resourceName}`;

    const resourceNameSpan = document.createElement('span');
    resourceNameSpan.className = 'resourceName';
    resourceNameSpan.textContent = `${resourceDisplayName}:`;

    const resourceValueSpan = document.createElement('span');
    resourceValueSpan.className = 'resourceValue';
    resourceValueSpan.id = `${resourceName}Value`;
    resourceValueSpan.textContent = `${resources[resourceName].value.toFixed(1)} / ${resources[resourceName].max.toFixed(1)}`;

    const resourceRateSpan = document.createElement('span');
    resourceRateSpan.className = 'resourceRate';
    resourceRateSpan.innerHTML = `(+
            <span id="${resourceName}IncreaseRate">0</span>/s)`;

    resourceElement.appendChild(resourceNameSpan);
    resourceElement.appendChild(resourceValueSpan);
    resourceElement.appendChild(resourceRateSpan);

    resourcesContainer.appendChild(resourceElement);

    // Update the ordering

    // Function to change the order of a resource
    function changeResourceOrder(resourceId, newOrder) {
        const resource = document.getElementById(resourceId);
        if (resource) {
            resource.style.order = newOrder;
        }
    }


    changeResourceOrder("resource-clones", 1);
    changeResourceOrder("resource-sticks", 2); // Move "Sticks" to order 2
    changeResourceOrder("resource-vines", 3); // Move "Vines" to order 3
    changeResourceOrder("resource-rocks", 4);
    changeResourceOrder("resource-fish", 5);
    changeResourceOrder("resource-wood", 6);
    changeResourceOrder("resource-ore", 7);
    changeResourceOrder("resource-ponder", 50);


}



function updateDisplayValue(material) {
    const element = resourcesContainer.querySelector(`#${material}Value`);
    const craftedButton = document.querySelector(`button#craft${capitalizeFirst(material)}`);
    try { if (!element || craftedButton) createResourceTag(material); }
    catch (error) { }



    if (element) {
        try {
            element.textContent = `${resources[material].value.toFixed(1)} / ${resources[material].max.toFixed(1)}`;

        } catch (error) {
            console.error(element, material, error);
        }

        if (resources[material].isGetting) {
            const sidebarText = document.querySelector("#resources").querySelector('#resource-' + material);
            // @ts-ignore
            if (sidebarText) sidebarText.style.fontWeight = 'bold';

        }
    } else if (craftedButton) {
        const countSpan = craftedButton.querySelector(`#${material}Value`);
        if (countSpan) countSpan.textContent = getCraftedResource(material).toFixed(0);
        else console.warn(`Resource button found but no count span for: ${material}`);

    } else {
        // console.warn(`No display element found for material: ${material}`);
    }

}

function setMax(material, num) {
    resources[material].max = num;
    updateSidebar();
    updateTotal();
}

function increaseMax(material, num) {
    // console.log("increase max ", material, num);
    resources[material].max += num;
    updateSidebar();
    updateTotal();
}

// Generic increase
function increaseMaterial(material, num) {
    // Ensure we actually need to do anything
    if (num == 0) return;
    material = material.toLowerCase();
    // console.log('increase material', material, num);
    // if (Math.abs(num) > 5) console.log('changing', material, 'by', num);

    // This check ensures that the material key exists in the resources map.
    if (resources.hasOwnProperty(material)) {
        if (isPondered('fasterResourceGain')) num *= 1.05;

        if (resources[material].value < resources[material].max && num > 0) { // Adding resources
            resources[material].value += num;
            updateSkills(material, num);
        } else if (num < 0) { // Subtracting resources
            resources[material].value += num;
        } else { // Already at max
            resources[material].value = resources[material].max;
            if (isPondered('autocraft') && autoCraftTable[material]) {
                craftAllResources(autoCraftTable[material]);
            }

        }
        updateDisplayValue(material);
        reassignJobsBasedOnResources();

    }
    else if (craftedResources.hasOwnProperty(material)) {
        // console.log('crafting a material', material, num);
        craftedResources[material].value += num;
        updateDisplayValue(material);
        updateSkills(material, num);
    }
    else {
        throw "Tried to increase Invalid material: " + material;
    }

    // crafted materials have no max, a la Kittens Game



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
        // @ts-ignore
        if (rateElement) rateElement.textContent = rate;
    }
}

/**
 * 
 * @param {Object} config 
 * @returns Button
 */
function createCraftedResourceButton(config) {
    const button = document.createElement('button');
    button.className = config.class + ' tooltip';
    button.setAttribute('id', config.id);
    // @ts-ignore
    button.requirement = config.requirement;
    const resourceName = Object.keys(craftedResources).find(key => craftedResources[key] === config);
    const cleanCount = parseFloat(craftedResources[resourceName].value).toFixed(0);
    button.innerHTML = `${config.text || capitalizeFirst(resourceName)}: <span id="${resourceName + "Value"}">${cleanCount}</span>`;
    // button.tooltipDesc = config.tooltipDesc; 
    // @ts-ignore
    button.tab = 'experiment';

    return button;
}


const container = document.querySelector('#craftedResourceButtons');
function appendCraftedResourceButtons() {

    // For each resource, create a button using the captured counts
    for (let name in craftedResources) {

        // config.count = craftedResources[name].value;
        const button = createCraftedResourceButton(craftedResources[name]);
        button.setAttribute('data-tooltip-desc', craftedResources[name].tooltipDesc);
        button.setAttribute('data-tooltip-cost', generateTooltipCost(craftedResources[name].cost));

        container.appendChild(button);
        buttons[craftedResources[name].id] = craftedResources[name];
    }
}

// @ts-ignore
function appendCraftedResourceButton(name) {

    const button = createCraftedResourceButton(craftedResources[name]);
    button.setAttribute('data-tooltip-desc', craftedResources[name].tooltipDesc);
    button.setAttribute('data-tooltip-cost', generateTooltipCost(craftedResources[name].cost));

    container.appendChild(button);
    buttons[craftedResources[name].id] = craftedResources[name];

}

// Call the function to replace <p> elements with the buttons
// appendCraftedResourceButton('sticks');

function generateTooltipCost(requirements) {
    var str = '';
    for (let material in requirements) {

        const hasEnough = getMaterial(material, resources) >= requirements[material];/* Your logic to check if there's enough of the material */;
        const colorClass = hasEnough ? 'enough' : 'not-enough';
        str += `<span class="tooltip-${material} ${colorClass}">${requirements[material]} ${material}</span><br>`;

    }
    return str;
}



const emojiDisplay = document.getElementById('emojiDisplay');
function updateEmojiDisplay() {
    let emojiStr = "";

    // Loop through the jobCounts map to get each job and its count
    for (let resource in resources) {
        // let resource = resources[getAffectedResources(job)[0]];
        let count = getWorkers(resource);
        // console.log(resource, count);
        if (count === undefined || count == 0) continue;
        let emoji = resources[resource].emoji || '𓀟';  // get the emoji corresponding to the job from the resources map
        // console.log(job, emoji);
        if (emoji) {
            emojiStr += emoji.repeat(count);  // repeat the emoji based on the count
        }
    }

    emojiDisplay.textContent = emojiStr;  // update the emojiDisplay div with the generated emoji string

    function adjustFontSize() {
        let fontSize = 48;  // Starting font size

        emojiDisplay.style.fontSize = `${fontSize}px`;

        while ((emojiDisplay.offsetWidth > 600) && fontSize > 30) {
            // 10 is a minimum font-size threshold to prevent an infinite loop
            // console.log(emojiDisplay.offsetWidth, emojiDisplay.offsetHeight);
            fontSize -= 1; // decrease the font size
            emojiDisplay.style.fontSize = `${fontSize}px`;
        }
    }

    // Call this function whenever the content of #emojiDisplay changes
    adjustFontSize();

}

// Call updateEmojiDisplay every time jobCounts is updated:
// For example:
// jobCounts.set('fishing', 4);
updateEmojiDisplay();


const autoCraftTable = {
    'sticks': 'handle',
    'wood': 'paper',
    'rocks': 'sharprocks',
    'vines': 'rope',
    'sand': 'glass',
    'ore': 'gold',
    'clay': 'bricks'
};

function craftAllResources(resourceKey) {
    try {
        while (canCraft(resourceKey)) {
            craftResource(resourceKey);
        }

    } catch (error) {
        console.log('Failed to craftall for: ', resourceKey, error);
    }
}

// Craft function
function craftResource(resourceKey) {
    if (!craftedResources.hasOwnProperty(resourceKey)) throw "Invalid craft for missing resource: " + resourceKey;


    let cost = craftedResources[resourceKey].cost;

    if (canCraft(resourceKey)) {
        for (let mat in cost) {
            increaseMaterial(mat, -cost[mat]);
        }
        increaseMaterial(resourceKey, 1 || calcCraftBonus(resourceKey));
        // document.querySelector("#" + resourceKey + "Value").textContent = craftedResources[resourceKey].value.toFixed(2);
        craftedResources[resourceKey].craftedOnce = true;
        updateDisplayValue(resourceKey);
    }
}


module.exports = {
    getMaterial,
    increaseMaterial,
    setMax,
    increaseMax,
    craftAllResources,
    craftResource,
    updateEmojiDisplay,
    updateDisplayValue,
    generateTooltipCost,
    calcSecondsRemaining,
    createResourceTag,
    appendCraftedResourceButtons,
    calcIncrease,
    updateResourceIncreaseRates

};