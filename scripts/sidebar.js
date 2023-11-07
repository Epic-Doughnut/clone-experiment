const { capitalizeFirst } = require('./capitalizeFirst');
const { getMaterial } = require('./getMaterial');
const { getMax } = require('./helper');
const { resources } = require('./json/resources');




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
    console.log("initialzing resource tags");
    console.trace();
    // Define groups for your resources
    const resourceGroups = {
        basics: ['clones', 'sticks', 'berries', 'fish', 'game', 'wheat', 'freshwater'],
        materials: ['wood', 'sand', 'clay', 'vines', 'rocks', 'hides', 'herbs'],
        tools: ['sharprocks', 'rope', 'handle', 'fishingrod', 'pickaxe', 'axe', 'spear', 'staff'],
        advanced: ['glass', 'paper', 'crates', 'medicine', 'leather'],
        metal: ['ore', 'gold', 'iron', 'silver', 'steel'],
        construction: ['bricks', 'beams', 'nails', 'slabs', 'concrete']
        // ... Add other groups as necessary
    };
    for (let groupName in resourceGroups) {
        const groupOfResources = resourceGroups[groupName];
        groupOfResources.forEach(resourceName => {
            console.log(resourceName);
            let parentElement = document.getElementById('resource-' + resourceName);

            if (!withGroups) groupName = null; // Set group to resources

            if (!parentElement) parentElement = createResourceTag(resourceName, groupName);
            console.log(parentElement);

            var shouldHide = true;
            for (let c in parentElement.classList) {
                // console.log('has passed', resourceName, passedStage(c));
                if (require('./stages').passedStage(c)) { shouldHide = false; console.log('dont hide', resourceName, c); }
            }

            if (getMaterial(resourceName) > 0) {
                shouldHide = false;
                if (resources[resourceName]) resources[resourceName].isVisible = true;
            }
            if (resources[resourceName] && resources[resourceName].isVisible) { shouldHide = false; }

            // Hide the element if we should, otherwise create a resource tag
            if (shouldHide) {
                parentElement.style.display = 'none';
            }
            console.log(shouldHide);

        });
    }
}

function abbreviateNumber(num) {
    function format(value, unit) {
        if (value < 10) return roundToDecimals(value, 3) + unit;
        if (value < 100) return roundToDecimals(value, 2) + unit;
        if (value < 1000) return roundToDecimals(value, 1) + unit;
        return Math.round(value) + unit;
    }

    function roundToDecimals(number, decimals) {
        const factor = Math.pow(10, decimals);
        return (Math.round(number * factor) / factor).toFixed(decimals);
    }

    if (num < 1e3) return roundToDecimals(num, 2); // If less than 1,000
    if (num < 1e6) return format(num / 1e3, 'K'); // Thousands
    if (num < 1e9) return format(num / 1e6, 'M'); // Millions
    if (num < 1e12) return format(num / 1e9, 'B'); // Billions
    // Add more cases for larger numbers if needed
    return num.toString();
}

function updateSidebar() {
    Array.from(require('./factory').allMaterials).forEach(r => require('./resources').updateDisplayValue(r));

    for (const [resourceName, resourceConfig] of Object.entries(resources)) {

        const parentElement = document.getElementById('resource-' + resourceName);
        if (!parentElement) return;
        // console.log(parentElement);
        var shouldHide = true;
        for (let c in parentElement.classList) {
            // console.log('has passed', resourceName, passedStage(c));
            if (require('./stages').passedStage(c)) { shouldHide = false; console.log('dont hide', resourceName, c); }
        }
        if (resourceConfig.value > 0) { shouldHide = false; resources[resourceName].isVisible = true; }
        if (resourceConfig.isVisible) { shouldHide = false; }

        if (shouldHide) {
            parentElement.style.display = 'none';
        }
        const displayElem = document.getElementById(resourceName + 'Value');
        if (displayElem) {
            // console.log(abbreviateNumber(resourceData));
            var color = '#fff';
            // 
            if (resourceConfig.value === getMax(resourceName)) color = '#fcc';
            // 
            else if (resourceConfig.value / getMax(resourceName) > .6) color = '#eeb';

            displayElem.innerHTML = `<span style="color:${color}">${abbreviateNumber(resourceConfig.value)} / ${abbreviateNumber(getMax(resourceName))} </span>`;
        }
    }

}


// Create all our resource tags in the sidebar
const resourcesContainer = document.getElementById('resources');
function createResourceTag(resourceName, groupName) {
    // if (!resources.hasOwnProperty(resourceName)) throw "Invalid resource: " + resourceName;
    console.log("Creating resource tag for ", resourceName, groupName);
    let groupContainer;
    if (groupName) {
        groupContainer = document.getElementById(`group-${groupName}`);
        if (!groupContainer) {
            groupContainer = createResourceGroupContainer(groupName);
            resourcesContainer.appendChild(groupContainer);
            console.log('appending', groupContainer, resourcesContainer, resourcesContainer.childElementCount);
        }
    }
    else {
        groupContainer = document.getElementById('resources');
    }

    // console.log(groupContainer);

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
    let max = getMax(resourceName) === Infinity ? '∞' : getMax(resourceName).toFixed(2);

    resourceValueSpan.textContent = `${getMaterial(resourceName).toFixed(2)} / ${max}`;

    const resourceRateSpan = document.createElement('span');
    resourceRateSpan.className = 'resourceRate';
    resourceRateSpan.innerHTML = `(+
            <span id="${resourceName}IncreaseRate">0</span>/s)`;

    resourceElement.appendChild(resourceNameSpan);
    resourceElement.appendChild(resourceValueSpan);
    resourceElement.appendChild(resourceRateSpan);

    groupContainer.appendChild(resourceElement);


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
    changeResourceOrder("resource-freshwater", 6);
    changeResourceOrder("resource-wood", 7);
    changeResourceOrder("resource-ore", 8);
    changeResourceOrder("resource-sand", 9);
    changeResourceOrder("resource-clay", 10);
    changeResourceOrder("resource-wheat", 11);
    changeResourceOrder("resource-hides", 12);
    changeResourceOrder("resource-game", 13);
    changeResourceOrder("resource-herbs", 14);
    changeResourceOrder("resource-berries", 15);
    changeResourceOrder("resource-ponder", 50);

    return resourceElement;
}





module.exports = {
    updateSidebar,
    initializeResourceTags,
};