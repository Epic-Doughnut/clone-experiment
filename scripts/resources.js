
const { resources } = require("./json/resources");
const { craftedResources } = require('./json/craftedResources');

const { buttons } = require("./json/buttons");
const { skills } = require('./json/skills');

const { getWorkers, updateTotal } = require('./jobs');
const { hasTool, } = require('./tools');
const { calcCraftBonus, getMax } = require("./helper");
const { canCraft } = require('./canCraft');
const { capitalizeFirst } = require('./capitalizeFirst');
const { getMaterial } = require('./getMaterial');

const { isPondered } = require('./ponder');
const { calcIncrease } = require("./calcIncrease");
const { updateSidebar, abbreviateNumber } = require("./sidebar");
const { passedStage } = require("./stages"); // Used for eval functions
const { updateDisplayValue } = require("./sidebar");
const { updateSkills } = require("./skills");
const { recalcMaxClones } = require("./recalcMaxClones");
const { triggerFloatUpText } = require("./triggerFloatUpText");
const { addProducing, addConsuming, removeProducing, removeConsuming } = require("./factory");
const { updateButtonVisibility } = require("./updateButtonVisibility");
// console.log(capitalizeFirst);

/**
 * 
 * @param {string} job 
 * @param {string} resource 
 * @returns 
 */
// @ts-ignore
function isResourceAffectedByJob(job, resource)
{
    const skill = skills[job];
    if (!skill) return false;

    if (skill.affectedResources.includes(resource))
    {
        // Check if there's a tool requirement for this resource
        if (skill.needTools && Array.isArray(skill.needTools))
        {
            for (let toolObj of skill.needTools)
            {
                for (let tool in toolObj)
                {
                    if (toolObj[tool].includes(resource))
                    {
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
        else
        {
            return true;
        }
    }
    return false;
}





function calcSecondsRemaining(resourceName, needed)
{
    if (needed <= getMaterial(resourceName)) return 0;

    // How much per second
    const increase = calcIncrease(resourceName, 1000);
    if (increase == 0) return -1; // Won't display

    // Difference over time
    const timeRemaining = (needed - getMaterial(resourceName)) / increase;

    return timeRemaining;
}






const resourcesContainer = document.getElementById('resources');
exports.resourcesContainer = resourcesContainer;


function increaseMax(material, num)
{
    // console.log("increase max ", material, num);
    // console.trace();
    resources[material].max += num;
    const element = document.getElementById(`${material}Value`);
    const rect = element.getBoundingClientRect();
    // document.getElementById(`${material}Value`).classList.add('float-up-fade-out');
    triggerFloatUpText(rect.right, rect.bottom, '+max', 'green'); //

    updateSidebar();
    updateTotal();

}

// Generic increase
function increaseMaterial(material, num)
{
    // Ensure we actually need to do anything
    if (num == 0 || Number.isNaN(num)) return;

    // Sanitize input
    material = material.toLowerCase();
    console.log('increase material', material, num);
    // if (Math.abs(num) > 5) console.log('changing', material, 'by', num);

    // This check ensures that the material key exists in the resources map.
    if (material in resources)
    {
        // if (material === 'clones') recalcMaxClones();
        if (getMaterial(material) < getMax(material) && num > 0)
        { // Adding resources

            resources[material].value += num;
            updateSkills(material, num);

            if (material === 'violence') require("./combat").refreshValues();

        } else if (num < 0)
        { // Subtracting resources
            resources[material].value = Math.max(resources[material].value + num, 0); // Lower bound at 0
        } else
        { // Already at max
            resources[material].value = getMax(material);
        }
        updateDisplayValue(material);
        // reassignJobsBasedOnResources();

    }
    else if (material in craftedResources)
    {
        // console.log('crafting a material', material, num);
        craftedResources[material].value = Math.max(craftedResources[material].value + num, 0); // Lower bound at 0

        updateDisplayValue(material);
        updateSkills(material, num);
    }
    else
    {
        // Creating a new material
        if (resources[material]) resources[material].value += num;
        if (craftedResources[material]) craftedResources[material].value += num;

        updateSidebar();
    }

    // crafted materials have no max, a la Kittens Game

}
// Globally display for dev purposes
// @ts-ignore
window.increaseMaterial = increaseMaterial;
// @ts-ignore
window.increaseMax = increaseMax;


function updateResourceIncreaseRates()
{
    // const resources = ["clones", "sticks", "vines", "rocks", "fish", "wood", "ponder"];
    for (let resource in resources)
    {
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
function createCraftedResourceButton(config)
{
    const button = document.createElement('button');
    button.className = config.class + ' tooltip';
    button.setAttribute('id', config.id);
    button.setAttribute('requirement', config.requiredStage);
    const resourceName = Object.keys(craftedResources).find(key => craftedResources[key] === config);
    // const cleanCount = parseFloat(craftedResources[resourceName].value).toFixed(0);
    // button.innerHTML = `${config.text || capitalizeFirst(resourceName)}: <span id="${resourceName + "Value"}">${cleanCount}</span>`;
    button.innerHTML = `${config.text || capitalizeFirst(resourceName)}`;
    // button.tooltipDesc = config.tooltipDesc; 
    // @ts-ignore
    button.tab = 'experiment';

    return button;
}


const container = document.querySelector('#craftedResourceButtons');
function appendCraftedResourceButtons()
{

    // For each resource, create a button using the captured counts
    for (let name in craftedResources)
    {
        //console.log('generating button for crafted resource', name);

        // config.count = craftedResources[name].value;
        const button = createCraftedResourceButton(craftedResources[name]);
        button.setAttribute('data-tooltip-desc', craftedResources[name].tooltipDesc || "");
        button.setAttribute('data-tooltip-cost', generateTooltipCost(craftedResources[name].cost) || "");
        // console.log('tooltip cost', button.getAttribute('data-tooltip-cost'));



        // Create a div for the + and - buttons
        const resourceCountDiv = document.createElement('div');
        resourceCountDiv.className = `factory-${name}`;
        resourceCountDiv.classList.add('factory-button');
        // resourceCountDiv.classList.add(craftedResources[name].requiredStage);
        resourceCountDiv.classList.add('hidden');

        // Create the + button
        const plusButton = document.createElement('button');
        plusButton.textContent = '+';
        plusButton.addEventListener('click', (event) =>
        {
            // console.log("plus button for", name, craftedResources[name]);
            // Add the resource to the list of factory production
            addProducing(name);
            for (const [resource, amount] of Object.entries(craftedResources[name].cost))
            {
                // console.log("adding consumption", name, resource, amount);
                addConsuming(resource, amount);
            }
            // Update the display for this crafted resource
            updateDisplayValue(name);
        });
        //console.log('added plus button for', name);
        // Create the - button
        const minusButton = document.createElement('button');
        minusButton.textContent = '-';
        minusButton.addEventListener('click', (event) =>
        {
            removeProducing(name);
            for (const [resource, amount] of Object.entries(craftedResources[name].cost))
            {
                removeConsuming(resource, amount);
            };
            // Update the display for this crafted resource
            updateDisplayValue(name);
        });


        // Append the buttons to the div
        resourceCountDiv.appendChild(plusButton);
        resourceCountDiv.appendChild(minusButton);

        const dummy = document.createElement('div');
        dummy.style.display = 'flex';
        dummy.style.flexDirection = 'row';
        dummy.appendChild(button);
        dummy.appendChild(resourceCountDiv);
        container.appendChild(dummy);

        // const reqResult = passedStage(button.getAttribute('requirement'));
        // console.log(reqResult, button.getAttribute('requirement'), Object.values(getAllStages()));

        // if (reqResult) button.classList.remove('hidden');
        // else button.classList.add('hidden');
        buttons[craftedResources[name].id] = craftedResources[name];
    }
}

// @ts-ignore
function appendCraftedResourceButton(name)
{

    const button = createCraftedResourceButton(craftedResources[name]);
    button.setAttribute('data-tooltip-desc', craftedResources[name].tooltipDesc);
    button.setAttribute('data-tooltip-cost', generateTooltipCost(craftedResources[name].cost));

    container.appendChild(button);
    buttons[craftedResources[name].id] = craftedResources[name];

}

// Call the function to replace <p> elements with the buttons
// appendCraftedResourceButton('sticks');

function generateTooltipCost(requirements)
{
    if (requirements === null) return '';
    var str = '';
    for (let material in requirements)
    {

        const hasEnough = getMaterial(material, resources) >= requirements[material];/* Your logic to check if there's enough of the material */;
        const colorClass = hasEnough ? 'enough' : 'not-enough';
        str += `<span class="tooltip-${material} ${colorClass}">${abbreviateNumber(requirements[material])} ${material}</span><br>`;

    }
    return str;
}



const emojiDisplay = document.getElementById('emojiDisplay');
function updateEmojiDisplay()
{
    let emojiStr = "";
    function getColorComponent()
    {
        return (Math.floor(Math.random() * 55 + 200));
    }
    // Loop through the jobCounts map to get each job and its count
    for (const [skillKey, skill] of Object.entries(skills))
    {

        let skillColor = "";
        switch (skillKey)
        {
            case 'gathering':
                skillColor = 'rgb(227, 254, 210)';
                break;
            case 'masonry':
                skillColor = '#ccc4c7';
                break;
            case 'carpentry':
                skillColor = '#f0e7c9';
                break;
            case 'hunting':
                skillColor = '#c9f0d4';
                break;
            case 'fishing':
                skillColor = '#b5d6eb';
                break;
            case 'thinking':
                skillColor = '#b5bceb';
                break;
            case 'farming':
                skillColor = '#ede4c0';
                break;
            case 'combat':
                skillColor = '#edc3c0';
                break;
            default:
                const red = getColorComponent();
                const blue = getColorComponent();
                const green = getColorComponent();
                skillColor = `rgb(${red}, ${green}, ${blue})`;
                break;
        }
        // console.log(skillKey, skillColor);
        for (const resource of Object.values(skill.affectedResources))
        {
            // console.log(resource);
            // for (let resource in resources) {
            // let resource = resources[getAffectedResources(job)[0]];
            const count = getWorkers(resource);
            // console.log(resource, count);
            if (count === undefined || count == 0) continue;
            const emoji = resources[resource].emoji || '𓀟';  // get the emoji corresponding to the job from the resources map
            // console.log(job, emoji);
            if (emoji)
            {
                emojiStr += `<span class='tooltip' style='color:${skillColor};'tooltipdesc='${resource}' tooltipcost=''>${emoji.repeat(count)}</span>`;  // repeat the emoji based on the count
                // Color in range 0xccc - 0xfff
            }
        }
    }

    emojiDisplay.innerHTML = emojiStr;  // update the emojiDisplay div with the generated emoji string

    function adjustFontSize()
    {
        let fontSize = 48;  // Starting font size

        emojiDisplay.style.fontSize = `${fontSize}px`;

        while ((emojiDisplay.offsetWidth > 600) && fontSize > 30)
        {
            // 30 is a minimum font-size threshold to prevent an infinite loop
            fontSize -= 1; // decrease the font size
            emojiDisplay.style.fontSize = `${fontSize}px`;
        }
    }

    // Call this function whenever the content of #emojiDisplay changes
    // adjustFontSize();

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

function craftAllResources(resourceKey)
{
    try
    {
        const cost = craftedResources[resourceKey].cost;
        let sufficientResources = [];
        for (let mat in cost)
        {
            // if (getMaterial(mat, resources) < cost[mat]) {
            sufficientResources.push(getMaterial(mat, resources) / cost[mat]);
            // }
        }
        let min = Math.floor(Math.min(...sufficientResources));
        //console.log(resourceKey, min);
        craftResourceQuantity(resourceKey, min);


    } catch (error)
    {
        //console.log('Failed to craftall for: ', resourceKey, error);
    }
}

function craftResourceQuantity(resourceKey, quantity)
{
    if (!craftedResources.hasOwnProperty(resourceKey)) throw "Invalid craft for missing resource: " + resourceKey;

    if (!canCraft(resourceKey)) return; // Takes care of quantity < 1
    let cost = craftedResources[resourceKey].cost;
    quantity = Math.floor(quantity); // Make sure the quantity is a whole number

    for (const [mat, val] of Object.entries(cost))
    {
        //console.log('crafting quantity:', mat, val);
        increaseMaterial(mat, -val * quantity);
        updateDisplayValue(mat);
    }
    increaseMaterial(resourceKey, calcCraftBonus(resourceKey) * quantity);
    // for (let i = 0; i < Math.floor(quantity); ++i) { // Only craft whole number, so 1.4 only runs once
    //     console.log('crafting', quantity, resourceKey, cost);
    //     craftOne(resourceKey, cost, calcCraftBonus(resourceKey));
    // }

    // document.querySelector("#" + resourceKey + "Value").textContent = craftedResources[resourceKey].value.toFixed(2);
    if (!craftedResources[resourceKey].craftedOnce) craftedResources[resourceKey].craftedOnce = true;

    updateDisplayValue(resourceKey);

}


function craftOne(resourceKey, cost, craftBonus)
{
    for (const [mat, val] of Object.entries(cost))
    {
        increaseMaterial(mat, -val);
    }
    increaseMaterial(resourceKey, craftBonus);

}
// Craft function
function craftResource(resourceKey)
{
    if (!craftedResources.hasOwnProperty(resourceKey)) throw "Invalid craft for missing resource: " + resourceKey;

    if (!canCraft(resourceKey)) return;

    let cost = craftedResources[resourceKey].cost;
    let craftBonus = calcCraftBonus(resourceKey);


    craftOne(resourceKey, cost, craftBonus);

    // document.querySelector("#" + resourceKey + "Value").textContent = craftedResources[resourceKey].value.toFixed(2);
    if (!craftedResources[resourceKey].craftedOnce) craftedResources[resourceKey].craftedOnce = true;
    updateDisplayValue(resourceKey);
    updateButtonVisibility();
}



module.exports = {
    increaseMaterial,
    increaseMax,
    craftAllResources,
    craftResource,
    updateEmojiDisplay,
    generateTooltipCost,
    calcSecondsRemaining,
    appendCraftedResourceButtons,
    calcIncrease,
    updateResourceIncreaseRates,
    craftResourceQuantity,

};