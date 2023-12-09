// @ts-nocheck
const { calcIncrease } = require("./calcIncrease");
const { capitalizeFirst } = require('./capitalizeFirst');
const { getFactoryProduction } = require("./factory");
const { getMaterial } = require("./getMaterial");
const { getMax } = require("./helper");
const { getCraftedResourceConfigById, craftedResources } = require("./json/craftedResources");
const { resources } = require("./json/resources");





function toggleGroupVisibility(groupName) {
    const group = document.getElementById(`group-${groupName}`);
    const toggleButton = document.getElementById(`toggle-${groupName}`); // Ensure you have this button with the id 'toggle-groupName'

    Array.from(group.children).forEach(element => {
        if (element.tagName === 'P') element.classList.toggle('hidden');
    });

    // Check if the group is currently hidden
    if (toggleButton.classList.contains('arrow-down')) {
        toggleButton.classList.remove('arrow-down');
        toggleButton.classList.add('arrow-right');
    } else {
        toggleButton.classList.remove('arrow-right');
        toggleButton.classList.add('arrow-down');
    }
}


// Function to create a group container
function createResourceGroupContainer(groupName) {
    const groupContainer = document.createElement('div');
    groupContainer.className = 'resourceGroup';
    groupContainer.id = `group-${groupName}`;

    const toggleButton = document.createElement('button');
    toggleButton.textContent = groupName.toUpperCase();
    toggleButton.onclick = () => toggleGroupVisibility(groupName);
    toggleButton.className = 'toggle-button arrow-down';
    toggleButton.id = `toggle-${groupName}`;

    groupContainer.appendChild(toggleButton);
    return groupContainer;
}



// Iterates over each group and resource to create tags
function initializeResourceTags(withGroups) {
    // if (isPondered('organization')) withGroups = true;
    console.log("initialzing resource tags");
    console.trace();
    // Define groups for your resources
    const resourceGroups = {
        special: ['clones', 'husks', 'ponder', 'violence'],
        food: ['berries', 'fish', 'game', 'wheat', 'bread', 'freshwater'],
        materials: ['sticks', 'vines', 'rocks', 'wood', 'sand', 'clay', 'hides', 'herbs'],
        tools: ['sharprocks', 'rope', 'handle', 'fishingrod', 'pickaxe', 'axe', 'spear', 'staff'],
        advanced: ['glass', 'paper', 'crates', 'medicine', 'leather'],
        metal: ['ore', 'gold', 'iron', 'silver', 'steel'],
        construction: ['bricks', 'beams', 'nails', 'slabs', 'concrete'],
        // ... Add other groups as necessary
    };
    for (let [groupName, groupOfResources] of Object.entries(resourceGroups)) {

        groupOfResources.forEach(resourceName => {
            // console.log(resourceName, groupName);
            let parentElement = document.getElementById('resource-' + resourceName);

            if (!withGroups) groupName = null; // Set group to resources

            if (!parentElement) parentElement = createResourceTag(resourceName, groupName);
            // console.log(parentElement);


            // Hide the element if we should, otherwise create a resource tag
            // console.log(resourceName, shouldHide(resourceName), getMaterial(resourceName));
            if (shouldHide(resourceName)) {
                parentElement.style.display = 'none';
            }
            else {
                parentElement.style.display = '';
            }
            // console.log(shouldHide);

        });
    }
}

function shouldHide(resourceName) {

    var shouldHide = true;
    // for (let c in parentElement.classList) {
    //     // console.log('has passed', resourceName, passedStage(c));
    //     if (require('./stages').passedStage(c)) { shouldHide = false; console.log('dont hide', resourceName, c); }
    // }

    if (getMaterial(resourceName) > 0) {
        shouldHide = false;
        if (resources[resourceName]) resources[resourceName].isVisible = true;
    }
    if (resources[resourceName] && resources[resourceName].isVisible) { shouldHide = false; }

    // console.log('should hide?', resourceName, shouldHide);
    return shouldHide;

}

function abbreviateNumber(num) {
    if (typeof num !== 'number') return num;
    function format(value, unit) {
        if (value < 10) return roundToDecimals(value, 2) + unit;
        if (value < 100) return roundToDecimals(value, 1) + unit;
        if (value < 1000) return roundToDecimals(value, 0) + unit;
        return Math.round(value) + unit;
    }

    function roundToDecimals(number, decimals) {
        const factor = Math.pow(10, decimals);
        return (Math.round(number * factor) / factor).toFixed(decimals);
    }

    if (num < 1e3) return roundToDecimals(num, 1); // If less than 1,000
    if (num < 1e6) return format(num / 1e3, 'K'); // Thousands
    if (num < 1e9) return format(num / 1e6, 'M'); // Millions
    if (num < 1e12) return format(num / 1e9, 'B'); // Billions
    // Add more cases for larger numbers if needed

    if (num === Infinity) num = '∞';
    return num.toString();
}

/**
 * Updates the resource count and maxes of all resources
 * @returns 
 */
function updateSidebar() {
    const allMaterials = require('./factory').allMaterials;
    Array.from(allMaterials).forEach(r => { updateDisplayValue(r); });
}


// Create all our resource tags in the sidebar
const resourcesContainer = document.getElementById('resources');
function createResourceTag(resourceName, groupName) {
    // if (!resources.hasOwnProperty(resourceName)) throw "Invalid resource: " + resourceName;
    // console.log("Creating resource tag for ", resourceName, groupName);
    let groupContainer;
    if (groupName) {
        groupContainer = document.getElementById(`group-${groupName}`);
        if (!groupContainer) {
            groupContainer = createResourceGroupContainer(groupName);
            resourcesContainer.appendChild(groupContainer);
            // console.log('appending', groupContainer, resourcesContainer, resourcesContainer.childElementCount);
        }
    }
    else {
        groupContainer = document.getElementById('resources');
    }

    // console.log(groupContainer);

    const resourceDisplayName = capitalizeFirst(resourceName).split('_').join(' ');

    const resourceElement = document.createElement('p');
    resourceElement.className = `resource`;
    resourceElement.id = `resource-${resourceName}`;

    const resourceNameSpan = document.createElement('span');
    resourceNameSpan.className = 'resourceName';
    resourceNameSpan.textContent = `${resourceDisplayName}:`;

    const resourceValueSpan = document.createElement('span');
    resourceValueSpan.className = 'resourceValue';
    resourceValueSpan.id = `${resourceName}Value`;
    let max = (getMax(resourceName) && getMax(resourceName) < Infinity) ? getMax(resourceName).toFixed(2) : '∞';

    resourceValueSpan.textContent = `${getMaterial(resourceName).toFixed(2)} / ${max}`;

    const resourceRateSpan = document.createElement('span');
    resourceRateSpan.className = 'resourceRate';
    resourceRateSpan.innerHTML = `<span id="${resourceName}IncreaseRate"></span>)`;

    resourceElement.appendChild(resourceNameSpan);
    resourceElement.appendChild(resourceValueSpan);
    resourceElement.appendChild(resourceRateSpan);

    groupContainer.appendChild(resourceElement);

    return resourceElement;
}





module.exports = {
    updateSidebar,
    initializeResourceTags,
    updateDisplayValue,
    abbreviateNumber
};
/**
 * Updates the display value of one resource, a specific updateSidebar()
 * @param {string} material The name of the resource to update
 */
function updateDisplayValue(material) {
    const element = resourcesContainer.querySelector(`#${material}Value`);
    const elementIncrease = resourcesContainer.querySelector(`#${material}IncreaseRate`);

    if (element) {
        try {
            const count = getMaterial(material);
            const max = getMax(material);
            element.textContent = `${abbreviateNumber(count)} / ${abbreviateNumber(max)}`;

            element.style.color = 'white';
            if (count / max > .6) element.style.color = '#ffc';
            if (count / max > .8) element.style.color = '#fec';
            if (count / max > .95) element.style.color = '#fcc';

            if (elementIncrease) {
                const inc = calcIncrease(material, 1000);
                // console.log(inc, elementIncrease);
                if (inc === 0 || Number.isNaN(inc)) elementIncrease.parentElement.innerHTML = `<span id="${material}IncreaseRate"></span>`;
                else elementIncrease.parentElement.innerHTML = `${inc >= 0 ? '+' : ''}<span id="${material}IncreaseRate">${inc.toFixed(2)}</span>/s`;
            }
            // console.log(material, shouldHide(material), getMaterial(material));
            if (shouldHide(material)) {
                element.parentElement.style.display = 'none';
            } else {
                element.parentElement.style.display = '';
            }
        } catch (error) {
            console.error(element, material, error);
        }

        // Bold resource when we're gathering it
        if (resources[material] && resources[material].isGetting) {
            const sidebarText = document.querySelector("#resources").querySelector('#resource-' + material);

            if (sidebarText) sidebarText.style.fontWeight = 'bold';

        }
    }

    const craftedElement = document.querySelector(`#craft${capitalizeFirst(material)}Button`);
    if (craftedElement) {
        craftedElement.textContent = `${craftedResources[material].text || capitalizeFirst(material)}`;

        let factoryCount = getFactoryProduction(material);
        if (factoryCount === NaN || factoryCount === undefined) factoryCount = 0;
        if (factoryCount > 0) craftedElement.textContent += `(${factoryCount})`;
    }
}
