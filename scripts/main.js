// @ts-nocheck

const { craftedResources, getCraftedResourceConfigById } = require('./json/craftedResources');
const { buildings } = require("./json/buildings");
const { ponders } = require("./json/ponder");
const { buttons } = require("./json/buttons");
const { resources, getResourceConfigById } = require('./json/resources');

const { saveGame, loadGame } = require("./saving");
const { createResourceTag, generateTooltipCost, appendCraftedResourceButtons, increaseMaterial, craftAllResources, craftResource, calcIncrease, updateResourceIncreaseRates, calcSecondsRemaining, increaseMax } = require('./resources');
const { recalculateBuildingCost, buyMaxBuildings, buyBuilding } = require('./buildings');
const { hasPerk, selectAbility } = require('./perks');
const { updateSidebar, getMax } = require('./helper');
const { makeVisible } = require('./makeVisible');
const { updateButtonVisibility } = require('./updateButtonVisibility');
const { getCraftedResource } = require('./getCraftedResource');
const { getMaterial } = require('./getMaterial');
// @ts-ignore
const { canUnlock, isPondered, generatePonderButtons } = require("./ponder");
const { hasTool, addTool } = require('./tools');
const { getAteFish, setAteFish } = require('./ateFish');
const { drawAllConnections, updateTotal } = require('./jobs');
const { capitalizeFirst } = require('./capitalizeFirst');
const { passedStage } = require('./stages');
/* MY CODE STARTS HERE */



// Initialize values
// let skilled = false;


function setTotalTime(time) {
    total_time = time;
}





/* GATHERING MATERIALS*/






const sidebarParent = document.querySelector("#resources");
function stopAllGathering() {
    for (let key in resources) {
        resources[key].isGetting = false;
        const rButton = document.querySelector("#gather" + capitalizeFirst(key));
        if (rButton) rButton.textContent = resources[key].defaultText;

        // Set sidebar to not bold
        // @ts-ignore
        const sidebarText = sidebarParent.querySelector('#resource-' + key);
        // @ts-ignore
        if (sidebarText) sidebarText.style.fontWeight = 'normal';

    }
}

const emojiGatherDiv = document.querySelector('#emojiGatherDisplay');
function toggleResource(resourceKey) {
    const resource = resources[resourceKey];

    // emojiDiv.textContent = '𓆮';
    const sidebarParent = document.querySelector("#resources");
    // @ts-ignore
    const sidebarText = sidebarParent.querySelector('#resource-' + resourceKey);
    const resourceButton = document.querySelector('#gather' + resourceKey.charAt(0).toUpperCase() + resourceKey.slice(1));

    if (!resource.isGetting) {
        stopAllGathering(); // Stop all gathering actions
        resource.isGetting = true;
        // @ts-ignore
        resourceButton.textContent = resource.activeText;
        // @ts-ignore
        if (sidebarText) sidebarText.style.fontWeight = 'bold';
        // @ts-ignore
        emojiGatherDiv.textContent = resource.emoji;
        console.log(resource.emoji);
    } else {
        resource.isGetting = false;
        // @ts-ignore
        resourceButton.textContent = resource.defaultText;
        // @ts-ignore
        if (sidebarText) sidebarText.style.fontWeight = 'normal';
    }
}








/* BUTTONS GENERATE */

function generateButtons() {

    console.log("Generating buttons");
    console.trace();
    // Create the columns
    const createColumns = (parent) => {
        const col1 = document.createElement('div');
        const col2 = document.createElement('div');
        const col3 = document.createElement('div');

        col1.style.width = '33.33%';
        col2.style.width = '33.33%';
        col3.style.width = '33.33%';

        col1.style.display = 'inline-block';
        col2.style.display = 'inline-block';
        col3.style.display = 'inline-block';

        col1.classList.add('visible');
        col2.classList.add('visible');
        col3.classList.add('visible');

        // parent.style.display = 'flex;'  // Set parent to be a flex container

        parent.prepend(col3);
        parent.prepend(col2);
        parent.prepend(col1);

        return [col1, col2, col3];
    };

    const tabsContainer = document.getElementById('tabs');
    const productionContainer = document.getElementById('productionTab');
    // @ts-ignore
    const experimentContainer = document.getElementById('experimentTab').querySelector('.button-columns');
    const ponderContainer = document.getElementById('ponderTab');
    // const jobContainer = document.getElementById('jobsTab');
    // You can add more containers for different tabs as needed

    const productionColumns = createColumns(productionContainer);
    const experimentColumns = createColumns(experimentContainer);
    const ponderColumns = createColumns(ponderContainer);
    // const jobColumns = createColumns(jobContainer);
    // Similarly, create columns for other tabs as needed

    let productionColumnIndex = 0;
    let experimentColumnIndex = 0;
    let ponderColumnIndex = 0;
    // @ts-ignore
    // @ts-ignore
    let jobColumnIndex = 0;

    // Add counters for other tabs as needed

    for (let key in buttons) {
        const btn = buttons[key];
        const buttonElement = document.createElement('button');

        buttonElement.id = key;
        buttonElement.className = btn.class;
        buttonElement.textContent = btn.text;

        // buttonElement.style.textAlign = 'center';
        if (btn.tooltipDesc) buttonElement.setAttribute('data-tooltip-desc', btn.tooltipDesc);
        if (btn.tooltipEffect) buttonElement.setAttribute('data-tooltip-effect', btn.tooltipEffect);
        buttonElement.setAttribute('unlock', btn.unlock);
        // console.log(btn);
        buttonElement.setAttribute('data_building', btn.data_building);
        // if this resource isn't unlocked, hide it
        // if (!btn.isVisible) buttonElement.classList.add('hidden');

        // Check if the button corresponds to a crafted resource using the ID
        const craftedResource = Object.values(craftedResources).find(resource => resource.id === key);

        if (craftedResource) {
            btn.tooltipCost = generateTooltipCost(craftedResource.cost);
        }


        buttonElement.setAttribute('data-tooltip-cost', btn.tooltipCost);

        if (btn.showTab) {
            buttonElement.addEventListener('click', () => {
                showTab(btn.showTab);
                console.log("Switching to tab: " + btn.showTab);
            });
        }
        // Append to the appropriate column based on the tab property
        if (btn.tab === 'production') {
            productionColumns[productionColumnIndex].appendChild(buttonElement);
            productionColumnIndex = (productionColumnIndex + 1) % 3;

        } else if (btn.tab === 'experiment') {
            experimentColumns[experimentColumnIndex].appendChild(buttonElement);
            experimentColumnIndex = (experimentColumnIndex + 1) % 3;
        } else if (btn.tab === 'tabs') {
            // @ts-ignore
            tabsContainer.appendChild(buttonElement);
        } else if (btn.tab === 'ponder') {
            ponderColumns[ponderColumnIndex].appendChild(buttonElement);
            ponderColumnIndex = (ponderColumnIndex + 1) % 3;
        } else if (btn.tab === 'job') {
            // jobColumns[jobColumnIndex].appendChild(buttonElement);
            // jobColumnIndex = (jobColumnIndex + 1) % 3;
        }
        // Add more conditions for other tabs as needed

        // Update tooltip for buildings
        const building = Object.keys(buildings).find(building => building === key);
        if (building) {
            // console.log(building, key);
            // btn.tooltipCost = generateBuildingTooltipCost(buildings[building].cost);
            recalculateBuildingCost(key, buildings, hasPerk);
        }
        // Hide the buttons we shouldn't see yet
        // console.log(btn);
        try {
            if (!btn.requirement()) {
                // console.log(buttonElement, btn.requirement());
                buttonElement.style.display = 'none';
            }
        } catch (err) {
            // console.warn('Error with requirement while generating buttons: ', btn, err);
        }
    }
}

const toolsToStages = {
    'SharpRocks': 'craftRocks',
    'Spear': 'fishing',
    "FishingRod": 'fishing',
    'Axe': 'wood',
    "Pickaxe": 'ore'
};

// Update visibility of assets
const visibilityRules = [
    {
        condition: () => getMaterial("sticks", resources) >= 1,
        action: () => makeVisible("stick")
    },
    {
        condition: () => getMaterial('sticks', resources) >= 10,
        action: () => makeVisible('vines')
    },
    {
        condition: () => getMaterial('vines', resources) >= 10,
        action: () => makeVisible('rocks')
    },
    {
        condition: () => getMaterial("rocks", resources) >= 1,
        action: () => { makeVisible("tab-button"); makeVisible('craftRocks'); }
    },

    {
        condition: () => getMaterial("fish", resources) >= 1,
        action: () => makeVisible('fishing')
    },

    {
        condition: () => hasTool("Axe"),
        action: () => makeVisible('wood')
    },
    {
        condition: () => getCraftedResource('rope') >= 1,
        action: () => makeVisible('rope')
    },

    {
        condition: () => getMaterial('fish', resources) >= 5 && !getAteFish(),
        action: () => {
            // @ts-ignore
            document.getElementById('eatFish').style.display = 'block';
            // @ts-ignore
            document.getElementById('eatFish').classList.add('visible');
        }
    },
    {
        condition: () => getAteFish(),
        action: () => { makeVisible('clone'); makeVisible('ponder-tab'); }
    },
    // {
    //     condition: () => isPondered('jobs-tab'),
    //     action: () => makeVisible('jobs-tab')
    // },
    // {
    //     condition: () => isPondered('skillsTable'),
    //     action: () => { makeVisible("skilled"); populateSkillsTable(); }
    // }
];

function render() {
    // console.log('updating visible');
    visibilityRules.forEach(rule => {
        if (rule.condition()) {
            rule.action();
        }
    });

    for (let tool in toolsToStages) {
        // @ts-ignore
        if (!hasTool(tool) && getCraftedResource(tool) > 0) {
            // @ts-ignore
            addTool(tool);
            makeVisible(toolsToStages[tool]);
        }
    }

    try {
        // @ts-ignore
        updateButtonVisibility();
        if (currentHoverButton !== null) updateTooltip(currentHoverButton);
    } catch (err) {
        console.warn(err);
    }

}








// Switch tabs
let tabContainers = document.querySelectorAll(".tab-content > .content"); // Direct children only
function showTab(tabName) {
    console.log("show tab: " + tabName);
    // Get all main container divs and hide them
    for (let content of tabContainers) {
        content.classList.remove("active");
    }

    // Get all tab buttons and remove the active class
    let tabs = document.querySelectorAll(".tab-button");
    for (let tab of tabs) {
        tab.classList.remove("active");
    }

    // Show the clicked tab's main container div and make the tab button active
    let activeContent = document.getElementById(tabName);
    // @ts-ignore
    activeContent.classList.add("active");

    // Get the clicked tab button and make it active
    const tabString = `#${tabName}Button`;
    let activeTabButton = document.querySelector(tabString);

    if (activeTabButton) activeTabButton.classList.add("active");

    if (tabName === 'jobsTab') {
        drawAllConnections();
    }
}


/* HOTKEYS */
document.addEventListener('keydown', function (event) {
    switch (event.key) {
        case '1':
            showTab('productionTab');
            break;
        case '2':
            if (passedStage('tab-button')) showTab('experimentTab');
            break;
        // Add cases for other tabs as needed
        case '3':
            if (passedStage('ponder-tab')) showTab('ponderTab');
            break;
        case '4':
            if (passedStage('jobs-tab')) showTab('jobsTab');
            break;
        case '5':
            if (passedStage('skillsTable')) showTab('skillsTab');
            break;
        case '6':
            if (passedStage('perksTab')) showTab('perksTab');
            break;
        default:
            break;
    }
});





/* DARK MODE */
const darkModeToggle = document.getElementById("darkModeToggle");
const body = document.body;
body.classList.toggle('dark-mode');
// @ts-ignore
darkModeToggle.classList.toggle('dark');
let isDark = true;


/* CUTSCENES */

// @ts-ignore
// @ts-ignore
function eatFish() {
    if (!getAteFish() && getMaterial('fish', resources) >= 1) {
        // eat a fish and blackout
        // @ts-ignore
        increaseMaterial('fish', -1);
        // Call this function to start the sequence
        fadeToBlack();
        // Hide fish button
        setAteFish(true);
        const fishButton = document.querySelector("#eatFish");
        // @ts-ignore
        fishButton.style.display = 'none';
        setTimeout(() => {
            changeMessage("You are with yourself in a forest.", 'with yourself');
            increaseMax('clones', 1);
            increaseMaterial('clones', 1);
        }, 1000); // delay of 1s

    }
}


function fadeToBlack() {
    const overlay = document.getElementById('overlay');
    const overlayText = document.getElementById('overlay-text');
    const overlayButton = document.getElementById('overlay-button');

    // @ts-ignore
    overlay.style.display = 'flex';

    setTimeout(() => {
        // @ts-ignore
        overlayText.style.opacity = '1';
    }, 2000);

    setTimeout(() => {
        // @ts-ignore
        overlayButton.style.display = 'block';
    }, 5000);
}

const overlay = document.getElementById('overlay');
// @ts-ignore
// @ts-ignore
function hideOverlay() {
    // @ts-ignore
    overlay.style.display = 'none';
}


// Message 
const messageElement = document.getElementById('message');
function changeMessage(newMessage, cloneWords) {
    const modifiedMessage = newMessage.replace(cloneWords, `<span id="alone" title="You feel peckish for some seafood">${cloneWords}</span>`);
    // @ts-ignore
    messageElement.innerHTML = modifiedMessage;
}
function getMessage() {
    return messageElement;
}

/* GAME LOOP */


let milliseconds_per_frame = 50;
let last_time = null;
let total_time = 0;
let accumulated_lag = 0;


function loop(current_time) {
    if (last_time === null) last_time = current_time;

    const delta_time = current_time - last_time;

    total_time += delta_time;
    accumulated_lag += delta_time;

    last_time = current_time;

    // Catch up all the missed ticks
    let normalRate = milliseconds_per_frame;
    // simulate with less fidelity to make up time
    // while (accumulated_lag >= 100 * milliseconds_per_frame) {
    //     milliseconds_per_frame *= 100;
    // }
    if (accumulated_lag >= 10 * milliseconds_per_frame) {
        milliseconds_per_frame = accumulated_lag / 10;
    }
    while (accumulated_lag >= milliseconds_per_frame) {

        accumulated_lag -= milliseconds_per_frame;
        update(milliseconds_per_frame, total_time);
    }

    milliseconds_per_frame = normalRate;
    requestAnimationFrame(loop);
}


let time_since_last_save = 0;

function update(delta_time, total_time) {

    for (let key in resources) {
        // console.log("updating " + key);

        increaseMaterial(key, calcIncrease(key, delta_time));
    }

    updateResourceIncreaseRates();

    render();

    // Save the game every 10 seconds
    time_since_last_save += delta_time;
    total_time += delta_time;
    if (time_since_last_save >= 10000) {
        saveGame();
        time_since_last_save = 0;
    }

}

// window.setInterval(render, 100) // Update visuals 10 times per second
// window.setInterval(tick, 1000); // Every tick lasts for 1 second
// window.setInterval(saveGame, 10000); // Save the game every 10 seconds



// const myResources = {};

// document.getElementById("addResourceBtn").addEventListener("click", function () {
//     document.getElementById("resourceForm").style.display = "block";
// });

// @ts-ignore
// @ts-ignore
function addResource() {
    // @ts-ignore
    const resourceName = document.getElementById("resourceName").value;
    // @ts-ignore
    const activeText = document.getElementById("resourceActiveText").value;
    // @ts-ignore
    const defaultText = document.getElementById("resourceDefaultText").value;

    // @ts-ignore
    const btnText = document.getElementById("btnText").value;
    // @ts-ignore
    const btnTooltipDesc = document.getElementById("btnTooltipDesc").value;
    // @ts-ignore
    const btnTooltipCost = document.getElementById("btnTooltipCost").value;

    // @ts-ignore
    var newResource = myResources[resourceName] = {
        value: 0,
        id: "gather" + resourceName,
        isGetting: false,
        activeText: activeText,
        defaultText: defaultText,
        // ... Add other attributes as fetched from form ...
    };

    // Create the button object
    var newButton = buttons["gather" + resourceName.charAt(0).toUpperCase() + resourceName.slice(1)] = {
        class: 'tooltip ',
        tab: 'production',
        text: btnText,
        tooltipDesc: btnTooltipDesc,
        tooltipCost: btnTooltipCost,
        requirement: () => true // By default, making this always visible. Modify as needed.
    };

    console.log(newResource);
    console.log(newButton);

    // Hide form once resource is added
    // @ts-ignore
    document.getElementById("resourceForm").style.display = "none";

    // Optionally, you can update the UI to show the added resource
    // updateUI(resourceName);
}

function updateUI(resourceName) {
    // Here you can create a new DOM element to display the added resource
    const resourceDiv = document.createElement("div");
    resourceDiv.innerHTML = `${resourceName}: ${resources[resourceName].value}`;

    // Append to some container
    document.body.appendChild(resourceDiv);
}








const tooltip = document.getElementById('dynamic-tooltip');

function showTooltip(target, desc, effect, cost) {
    let content = '';

    if (desc) {
        content += `<span >${desc}</span><hr>`;
    }

    if (effect) {
        content += `<span style="color:#00ABE7">${effect}</span><hr>`;
    }

    if (cost) {
        // content += `<span style="color:#F4D03F">${cost}</span><br>`;
        try {
            var str = '';
            for (let material in cost) {
                // const material = req;
                const amount = cost[material];
                const hasEnough = getMaterial(material, resources) >= amount;/* Your logic to check if there's enough of the material */;
                var colorClass = hasEnough ? 'enough' : 'not-enough';
                if (getMax(material) < amount) colorClass = 'exceeds-max';
                str += `<span class="tooltip-${material} ${colorClass}">${amount.toFixed(0)} ${material}</span>`;

                const secondsRemaining = calcSecondsRemaining(material, amount);
                // console.log(secondsRemaining);
                if (secondsRemaining > 0 && colorClass != 'exceeds-max') { str += `<span class="time-remaining">(${(secondsRemaining).toFixed(0)} seconds)</span>`; }
                str += `<br>`;
            }
            content += str;


        } catch (error) {
            content += cost;
            // console.error("Couldn't make normal cost for button: ", target, cost, error);
        }
    }
    // console.log(target, content);
    // @ts-ignore
    tooltip.innerHTML = content;
    // @ts-ignore
    tooltip.style.left = (target.getBoundingClientRect().right + 5) + 'px';
    // @ts-ignore
    tooltip.style.top = (target.getBoundingClientRect().top - tooltip.offsetHeight / 2) + 'px';
    // @ts-ignore
    tooltip.style.display = 'block';
}

function hideTooltip() {
    // @ts-ignore
    tooltip.style.display = 'none';
}

function updateTooltip(button) {
    const desc = button.getAttribute('data-tooltip-desc') || button.getAttribute('tooltipDesc');
    const effect = button.getAttribute('data-tooltip-effect');
    // const cost = button.getAttribute('data-tooltip-cost');

    const config = getResourceConfigById(button.id) || getCraftedResourceConfigById(button.id) || buildings[button.getAttribute('data_building')] || ponders[button.getAttribute('unlock')];
    // console.log(config);
    const cost = button.getAttribute('tooltipCost') || config.cost;
    showTooltip(button, desc, effect, cost);
}


// After all has been loaded
// @ts-ignore
// @ts-ignore
document.addEventListener('DOMContentLoaded', (event) => {
    generatePonderButtons(ponders);
    appendCraftedResourceButtons();
    generateButtons(); // Call this once on page load or game initialization

    loadGame();
    updateSidebar();
    showTab('productionTab');
    // require('./trade').generateTradeTable(resources);
    // createResourceTag('sticks');

    function getRKeyFromID(id) {
        for (let r in resources) {
            // console.log(resources[r].id, id);
            if (resources[r].id === id) return r;
        }
        return '';
    }
    function getCRKeyFromID(id) {
        for (let r in craftedResources) {
            // console.log(resources[r].id, id);
            if (craftedResources[r].id === id) return r;
        }
        return '';
    }
    document.addEventListener("click", (event) => {
        // @ts-ignore
        if (event.target.matches("button")) {
            // one of our buttons was clicked
            const button = event.target;
            // console.log('clicked', button);

            // Update tooltips 
            // if (button.classList.contains('tooltip')) updateTooltip(button);
            // updateTooltip(button);

            // @ts-ignore
            if (button.getAttribute('data_building') && button.getAttribute('data_building') !== 'undefined' && button.classList.contains('purchasable')) {
                // @ts-ignore
                var building = button.getAttribute('data_building');
                if (event.shiftKey) {

                    buyMaxBuildings(building);
                } else {

                    buyBuilding(building);
                }
            }
            // @ts-ignore
            if (button.classList.contains('unlock')) {
                // @ts-ignore
                const unlockAttr = button.getAttribute('unlock');
                // console.log('click');
                console.log(unlockAttr);
                if (ponders[unlockAttr]) {
                    var canUnlock = true;
                    for (let material in ponders[unlockAttr].cost) {
                        if (getMaterial(material, resources) < ponders[unlockAttr].cost[material]) {
                            console.log("Cannot unlock " + unlockAttr);
                            canUnlock = false;
                            break;
                        }
                    }

                    if (canUnlock) {
                        for (let material in ponders[unlockAttr].cost) {
                            increaseMaterial(material, -ponders[unlockAttr].cost[material]);
                        }
                        ponders[unlockAttr].isPondered = true;
                        makeVisible(unlockAttr);
                        // document.querySelector("#" + resourceKey + "Value").textContent = craftedResources[resourceKey].value.toFixed(2);
                        // make this button disappear
                        // @ts-ignore
                        button.display = 'none';

                        console.log("Unlocking " + unlockAttr);
                    }
                }

            }

            // @ts-ignore
            if (button.id !== 'undefined') {
                console.log(button);
                if (button.id.slice(0, 6) === "gather") toggleResource(getRKeyFromID(button.id));

                if (button.id.slice(0, 5) === 'craft')
                    if (event.shiftKey) craftAllResources(getCRKeyFromID(button.id));
                    else craftResource(getCRKeyFromID(button.id));

                if (button.id === 'saveButton') saveGame();

                if (button.id === 'eatFish') eatFish();

                if (button.id === 'overlay-button') hideOverlay();

                if (button.id === 'deleteSaveButton') {
                    localStorage.removeItem('save'); location.reload();
                }
                if (button.id === 'clearJobAssignments') clearJobAssignments();
                // @ts-ignore
                if (button.id === 'darkModeToggle') {
                    body.classList.toggle('dark-mode');
                    // @ts-ignore
                    darkModeToggle.classList.toggle('dark');
                    isDark = !isDark;
                    // @ts-ignore
                    darkModeToggle.textContent = isDark ? "Light Mode" : "Dark Mode";

                }

            }

            if (button.classList.includes('tierOneButton')) {
                let perk = button.textContent;
                selectAbility(perk);
            }

        }

        // @ts-ignore
        if (event.target.matches("#alone")) {
            // increaseMaterial('clones', 1);
            // Hardcoded instead to avoid increase affected by productivity bonuses
            if (resources['clones'].value < resources['clones'].max) resources['clones'].value += 1;

            updateTotal();
        }
    });


    requestAnimationFrame(loop);

    // Sample usage:
    document.querySelectorAll('.tooltip').forEach(button => {
        // console.log(button);
        // Extract the data from your building or any other data - source
        // const content = "Your tooltip content here";
        // @ts-ignore
        // @ts-ignore
        button.addEventListener('mouseenter', function (e) {
            updateTooltip(button);
            currentHoverButton = button;
        });


        // TODO: move this event listener
        button.addEventListener('onclick', function () {
            updateTooltip(button);
        });

        button.addEventListener('mouseleave', function () { hideTooltip(); currentHoverButton = null; });
    });

    // Update the jobs counter
    updateTotal();


});

var currentHoverButton = null;

module.exports = {

    updateSidebar,
    updateUI,
    setTotalTime,
    changeMessage,

    getMessage,
    total_time,
    currentHoverButton

};
