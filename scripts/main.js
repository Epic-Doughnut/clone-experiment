
/* MY CODE STARTS HERE */



// Initialize values
// let skilled = false;
let hasGeneratedSkillTable = false;


// Price chart
// [name, principle, exponent]
let prices = [];
let stages = [];


prices.push(["lumberjacks", 10, 1.1]);


// Get references to the elements
const messageElement = document.querySelector("#message");

const clonesValueElement = document.querySelector('#clonesValue');
// const increaseButton = document.querySelector('#increaseButton');

// const startElements = document.querySelectorAll(".start");
// const stickElements = document.querySelectorAll(".stick");
// const woodElements = document.querySelectorAll('.wood');


// const assignLumberjack = document.querySelector('#createLumberjackButton');
// const lumberjackValueElement = document.querySelector("#lumberjackValue");
// const lumberjackCostElement = document.querySelector("#lumberjackCostValue");






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




/* GATHERING MATERIALS*/

// Stop all gathering functions
// function stopAllGathering() {
//     woodToggle.textContent = "Chop Wood";
//     stickToggle.textContent = "Gather Sticks";
//     vineToggle.textContent = "Gather Vines";
//     rockToggle.textContent = "Gather Rocks";
// }


// Get function for materials
function getMaterial(material) {
    if (resources.hasOwnProperty(material)) {
        return resources[material].value;
    } else {
        // console.error("Invalid material:", material);  // For debugging
        return getCraftedResource(material);

    }
}

function stopAllGathering() {
    for (let key in resources) {
        resources[key].isGetting = false;
        if (resources[key].button) resources[key].button.textContent = resources[key].defaultText;

        // Set sidebar to not bold
        const sidebarParent = document.querySelector("#resources");
        const sidebarText = sidebarParent.querySelector('#resource-' + key);
        if (sidebarText) sidebarText.style.fontWeight = 'normal';

    }
}

function toggleResource(resourceKey) {
    const resource = resources[resourceKey];

    const sidebarParent = document.querySelector("#resources");
    const sidebarText = sidebarParent.querySelector('#resource-' + resourceKey);


    if (!resource.isGetting) {
        stopAllGathering(); // Stop all gathering actions
        resource.isGetting = true;
        resource.button.textContent = resource.activeText;

        // console.log(sidebarText);
        if (sidebarText) sidebarText.style.fontWeight = 'bold';
    } else {
        resource.isGetting = false;
        resource.button.textContent = resource.defaultText;
        if (sidebarText) sidebarText.style.fontWeight = 'normal';
    }
}

var ateFish;




function generateBuildingTooltipCost(cost) {
    return Object.entries(cost).map(([material, amount]) => `${amount.toFixed(2)} ${material}`).join(', ');
}


function generateTooltipCost(requirements) {
    return requirements.map(req => `${req.amount} ${req.material}`).join(', ');
}


function getCraftedResource(material) {
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


/* HELPER FUNCTIONS */

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
    material.max += num;
    updateSidebar();
}
// Generic increase
function increaseMaterial(material, num) {
    // Ensure we actually need to do anything
    if (num != 0) {
        // console.log(material);
        // This check ensures that the material key exists in the resources map.
        if (resources.hasOwnProperty(material)) {
            // console.log('changing',material,'by',num);
            resources[material].value += num;
            updateDisplayValue(material);
            updateSkills(material);
        } else {
            // console.error("Invalid material:", material);  // For debugging
            if (craftedResources.hasOwnProperty(material)) {
                // crafted materials have no max, a la Kittens Game
                craftedResources[material].value += num;
                updateDisplayValue(material);
                updateSkills(material);
            }
        }

        if (resources[material] && resources[material].value > resources[material].max) {
            resources[material].value = resources[material].max;
        }

        updateSidebar();
    }


    // resources[material].value += num;
    // document.querySelector("#" + material + "Value").textContent = resources[material].value;

}









// Hardcoded unlocks map
let unlocks = {
    'jobs-tab': {
        id: 'ponderClones1',
        isUnlocked: false,
        cost: [{
            material: 'ponder',
            amount: 20
        }]
    },
    'skillsTable': {
        id: 'ponderSkills',
        isUnlocked: false,
        cost: [{
            material: 'ponder',
            amount: 40
        }]
    }
    // ... add other unlock items as needed
};

function isUnlocked(id) {
    // Check if the id exists in the unlocks map
    if (unlocks[id]) {
        return unlocks[id].isUnlocked;
    }

    // If the id doesn't exist in the map, return false
    return false;
}

function canUnlock(unlockId) {
    // Get the key from this id
    var unlockKey = '';
    for (let unlock in unlocks) {
        if (unlocks[unlock].id === unlockId) {
            unlockKey = unlock;
        }
    }
    // Check if we have enough resources
    var canBuy = true;
    for (let req of unlocks[unlockKey].cost) {
        if (getMaterial(req.material) < req.amount) {
            console.log("Cannot unlock " + unlockAttr);
            canBuy = false;
            break;
        }
    }

    // console.log('can we unlock ', unlockId, canBuy);
    return canBuy;
}


// Function to get all buttons with class 'unlock' and attach an event listener to them
function initializeUnlockButtons() {
    const unlockButtons = document.querySelectorAll('.unlock');

    unlockButtons.forEach(button => {
        button.addEventListener('click', function () {
            console.log('click');
            const unlockAttr = this.getAttribute('unlock');
            console.log(unlockAttr);
            if (unlocks[unlockAttr]) {
                canCraft = true;
                for (let req of unlocks[unlockAttr].cost) {
                    if (getMaterial(req.material) < req.amount) {
                        console.log("Cannot unlock " + unlockAttr);
                        canCraft = false;
                        break;
                    }
                }

                if (canCraft) {
                    for (let req of unlocks[unlockAttr].cost) {
                        increaseMaterial(req.material, -req.amount);
                    }
                    unlocks[unlockAttr].isUnlocked = true;
                    makeVisible(unlockAttr);
                    // document.querySelector("#" + resourceKey + "Value").textContent = craftedResources[resourceKey].value.toFixed(2);
                    // make this button disappear
                    this.display = 'none';

                    console.log("Unlocking " + unlockAttr);
                }
            }
        });
    });
}

// Initialize the buttons when the DOM is fully loaded
// document.addEventListener('DOMContentLoaded', initializeUnlockButtons);




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

        // Check if the button corresponds to a crafted resource using the ID
        const craftedResource = Object.values(craftedResources).find(resource => resource.id === key);

        if (craftedResource) {
            btn.tooltipCost = generateTooltipCost(craftedResource.requires);
        }

        const building = Object.keys(buildings).find(building => building === key);
        if (building) {
            // console.log(building, key);
            btn.tooltipCost = generateBuildingTooltipCost(buildings[building].cost);
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
            tabsContainer.appendChild(buttonElement);
        } else if (btn.tab === 'ponder') {
            ponderColumns[ponderColumnIndex].appendChild(buttonElement);
            ponderColumnIndex = (ponderColumnIndex + 1) % 3;
        } else if (btn.tab === 'job') {
            // jobColumns[jobColumnIndex].appendChild(buttonElement);
            // jobColumnIndex = (jobColumnIndex + 1) % 3;
        }
        // Add more conditions for other tabs as needed

        // Hide the buttons we shouldn't see yet
        // console.log(btn);
        if (!btn.requirement()) {
            buttonElement.style.display = 'none';
        }
    }
}




generateButtons(); // Call this once on page load or game initialization


// After you've appended your buttons:
const buildingButtons = document.querySelectorAll('button[data_building]:not([data_building="undefined"])');
console.log(buildingButtons);
buildingButtons.forEach(button => {
    button.addEventListener('click', function () {
        console.log("Button clicked! ");
        const buildingName = this.getAttribute('data_building');
        buyBuilding(buildingName);
    });
});



// Attach event listeners
for (let key in resources) {
    let resource = resources[key];
    let button = document.getElementById(resource.id);
    if (button) {
        button.addEventListener('click', () => toggleResource(key));
        resource.button = button; // Store the button reference in the object
    }

    if (craftedResources[key]) {
        resource.tooltipCost = generateTooltipCost(craftedResources[key].requires);
    }
}

// Automatically add event listeners
for (let key in craftedResources) {
    let resource = craftedResources[key];
    let button = document.getElementById(resource.id);
    if (button) {
        button.addEventListener('click', () => craftResource(key));
    }
}



function passedStage(stage) {
    return stages.includes(stage);
}

// Make everything with the class "stage" visible
function makeVisible(stage) {
    if (!passedStage(stage)) {
        stages.push(stage);
    }
    const stageElements = document.querySelectorAll("p." + stage);
    stageElements.forEach(element => element.classList.add('visible'));
    stageElements.forEach(element => element.style.display = 'block');
    updateButtonVisibility();
}

function updateButtonVisibility() {
    const selectButtons = document.querySelectorAll('button'); // Adjust the selector accordingly

    selectButtons.forEach(button => {
        const buttonConfig = buttons[button.id]; /* get the button's configuration using its data attribute or ID, etc. */;
        if (!buttonConfig) return;
        // console.log(buttonConfig.data_building, buttonConfig.requirement);
        // Reset all states first
        button.classList.remove('hidden', 'purchasable', 'button-disabled');

        var state = 'hidden';

        // If requirement is met, it should be visible
        if (buttonConfig.requirement()) {
            state = 'button-disabled';
            // always purchasable gather buttons
            if (buttonConfig.tab && !buttonConfig.data_building) {
                // console.log(buttonConfig);
                if (buttonConfig.tab === 'production') state = 'purchasable';
            }

            // ponder button
            if (button.id && button.id === 'gatherPonder') {
                state = 'purchasable';
            }

            // ponder unlocks
            if (buttonConfig.tab && buttonConfig.tab === 'ponder') {
                // console.log(button.classList);
                if (button.id && button.classList.contains('unlock')) {
                    // console.log(button);
                    if (canUnlock(button.id)) state = 'purchasable';
                }
            }

            // tab buttons always either hidden or enabled
            if (buttonConfig.tab && buttonConfig.tab === 'tabs') {
                state = 'visible';
            }
        }

        if (buttonConfig.id && buttonConfig.id.slice(0, 5) === 'craft') {
            // never hide this button once its been unlocked
            if (buttonConfig.craftedOnce) state = 'button-disabled';


            // If we can afford this craft, it should be purchasable
            var crafted = getCraftedResourceConfigById(buttonConfig.id);
            // console.log(crafted);
            if (crafted.value > 0) state = 'button-disabled';

            const key = getCraftedResourceKeyByConfig(crafted);
            // console.log(key);
            if (canCraft(key)) state = 'purchasable';
        }

        // If we can afford this building, it should be purchasable
        // console.log(buttonConfig);
        if (buttonConfig.data_building) {
            // If we've already purchased a building, it should be visible
            state = getBuildingCount(buttonConfig.data_building) ? 'button-disabled' : state;
            // Find the building cost
            // console.log(buttonConfig);
            state = canBuyBuilding(buttonConfig.data_building) ? 'purchasable' : state;
        }


        // If hidden is met, it should be hidden
        if (buttonConfig.hide) {
            state = buttonConfig.hide() ? 'hidden' : state;
        }





        // Add the current state
        if (state !== '') button.classList.add(state);

        // If the state is not-purchasable, disable the button
        // button.disabled = state === 'button-disabled';

        // If the state is hidden, set the button's display to none
        if (state === 'hidden') {
            // console.log('hiding',button);
            button.style.display = 'none';
        } else {
            button.style.display = ''; // This will revert it back to its original display state or default (e.g., 'block' or 'inline-block')
        }
    });
}


// Update visibility of assets
const visibilityRules = [
    {
        condition: () => getMaterial("sticks") >= 1,
        action: () => makeVisible("stick")
    },
    {
        condition: () => getMaterial("rocks") >= 1,
        action: () => { makeVisible("tab-button"); makeVisible('craftRocks'); }
    },
    {
        condition: () => !hasTool("Sharp Rock") && getCraftedResource('sharpRocks') >= 1,
        action: () => {
            addTool("Sharp Rock");
            makeVisible('craftRocks');
        }
    },
    {
        condition: () => !hasTool("Spear") && getCraftedResource('spear') >= 1,
        action: () => { addTool("Spear"); makeVisible('fishing'); }
    },
    {
        condition: () => getMaterial("fish") >= 1,
        action: () => makeVisible('fishing')
    },
    {
        condition: () => !hasTool("Axe") && getCraftedResource('axe') >= 1,
        action: () => { addTool("Axe"); makeVisible('wood'); }
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
        condition: () => !hasTool("Fishing Rod") && getCraftedResource('fishingRod') >= 1,
        action: () => {
            addTool("Fishing Rod");
            makeVisible("fishing");
        }
    },
    {
        condition: () => getMaterial('fish') >= 5,
        action: () => {
            document.getElementById('eatFish').display = 'block';
            document.getElementById('eatFish').classList.add('visible');
        }
    },
    {
        condition: () => ateFish,
        action: () => { makeVisible('clone'); makeVisible('ponder-tab'); }
    },
    {
        condition: () => isUnlocked('jobs-tab'),
        action: () => makeVisible('jobs-tab')
    },
    {
        condition: () => isUnlocked('skillsTable'),
        action: () => { makeVisible("skilled"); populateSkillsTable(); }
    }
];

function updateVisible() {
    // console.log('updating visible');
    visibilityRules.forEach(rule => {
        if (rule.condition()) {
            rule.action();
        }
    });

    try {
        updateButtonVisibility();
    } catch (err) {
        console.warn(err);
    }

}


function updateTooltipCosts() {
    // const gatherVinesButton = document.getElementById("gatherVines");
    // const cost = calculateVineCost(); // Some function that determines the cost
    // gatherVinesButton.setAttribute("data-tooltip", "Gather vines. Cost: " + cost + " sticks.");
}

// Call the function when appropriate (e.g., when game state changes)
// updateTooltipCosts();



function updateSkills(resource) {
    for (let skill in skills) {
        if (skills[skill].affectedResources.includes(resource)) {
            skills[skill].exp += 1 / Math.pow(1.1, skills[skill].level);
            // console.log("Updating skill:" + skill + " to " + skills[skill].exp)

            if (skills[skill].exp >= 100) {
                skills[skill].level += 1;
                skills[skill].exp = 0;
                console.log("Level Up! " + skill + skills[skill].level);
            }
        }
    }
    if (passedStage('skilled')) {
        populateSkillsTable();
    }
}


function populateSkillsTable() {
    const table = document.getElementById('skillsTable');

    // If the table is empty, create the rows and progress bars
    if (!hasGeneratedSkillTable) {
        console.log("Generating table for the first time");
        hasGeneratedSkillTable = true;
        for (let skill in skills) {
            let tr = document.createElement('tr');
            let tdProgress = document.createElement('td');
            tdProgress.style.position = 'relative';

            let progressBar = document.createElement('div');
            progressBar.setAttribute('class', 'progressBar');
            if (isDark) {
                progressBar.style.backgroundColor = '#228B22';
            }
            else {
                progressBar.style.backgroundColor = '#50C878';

            }
            progressBar.style.height = '20px';
            progressBar.setAttribute('data-skill', skill); // Assign a data attribute for identification

            let skillText = document.createElement('span');

            skillText.textContent = '[' + skills[skill].level + ']   ' + skill;
            skillText.setAttribute('id', 'level-' + skill);
            skillText.style.position = 'absolute';
            skillText.style.left = '10px';
            skillText.style.top = '50%';
            skillText.style.transform = 'translateY(-50%)';

            tdProgress.appendChild(progressBar);
            tdProgress.appendChild(skillText);
            tr.appendChild(tdProgress);

            table.appendChild(tr);
        }
    }

    // Now, simply update the widths and colors
    for (let skill in skills) {
        let progressBar = document.querySelector(`.progressBar[data-skill="${skill}"]`);
        if (progressBar) {
            progressBar.style.width = skills[skill].exp + '%';
            let skillName = document.querySelector("#level-" + skill);
            skillName.textContent = '[' + skills[skill].level + ']   ' + skill;
        }
    }
}

function getToolValueForResource(resource) {
    if (resource.tools) {
        // Sort the tools in descending order based on their val
        const sortedTools = resource.tools.sort((a, b) => b.val - a.val);

        // Iterate through the sorted tools
        for (let tool of sortedTools) {
            if (hasTool(tool.tool)) {
                // If the player has the tool, return its associated value
                return tool.val;
            }
        }
    }

    // If none of the tools are found, return the default value
    return 1;
}

function isResourceAffectedByJob(job, resource) {
    const skill = skills[job];
    if (skill && skill.affectedResources.includes(resource)) {
        return true;
    }
    return false;
}

var cloneMult = 0.25;
function calcIncrease(resource) {
    var total = 0;

    // clones increase by 1 per second as long as there's space
    if (resource === 'clones') {
        total = 1;
        return total;
    }
    if (resources.hasOwnProperty(resource)) {
        // Check tools
        var currTool = getToolValueForResource(resources[resource]);
        // Gathering personally
        if (resources[resource].isGetting) {
            total += currTool;
        }

        // Clones work at 1/4 the speed by default
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
    }

    // round total to nearest thousandth
    total = parseFloat(total.toFixed(3));
    return total;
}





// Switch tabs
function showTab(tabName) {
    console.log("show tab: " + tabName);
    // Get all main container divs and hide them
    let contents = document.querySelectorAll(".tab-content > .content"); // Direct children only
    for (let content of contents) {
        content.classList.remove("active");
    }

    // Get all tab buttons and remove the active class
    let tabs = document.querySelectorAll(".tab-button");
    for (let tab of tabs) {
        tab.classList.remove("active");
    }

    // Show the clicked tab's main container div and make the tab button active
    let activeContent = document.getElementById(tabName);
    activeContent.classList.add("active");

    // Get the clicked tab button and make it active
    const tabString = `#${tabName}Button`;
    let activeTabButton = document.querySelector(tabString);
    console.log(tabString);
    if (activeTabButton) {
        activeTabButton.classList.add("active");
    }

    // Show buttons in the active tab (including those in the three columns)
    let columnsInActiveTab = activeContent.querySelectorAll('div');
    for (let column of columnsInActiveTab) {
        column.classList.add("active");

        let buttonsInColumn = column.querySelectorAll('button');
        for (let button of buttonsInColumn) {
            // console.log(buttons[button.id]);
            if (buttons[button.id].requirement()) {
                button.style.display = 'flex'; // Or 'inline-block', or whatever your desired display style is
                console.log("displaying " + button.id);
            }
        }
    }

    // Hide buttons in inactive tabs (including those in the three columns)
    for (let content of contents) {
        if (content !== activeContent) {
            let columnsToHide = content.querySelectorAll('div');
            for (let column of columnsToHide) {
                let buttonsToHide = column.querySelectorAll('button');
                for (let button of buttonsToHide) {
                    // button.classList.add('button-disabled');
                }
            }
        }
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
        default:
            break;
    }
});





/* DARK MODE */
const darkModeToggle = document.getElementById("darkModeToggle");
const body = document.body;
body.classList.toggle('dark-mode');
darkModeToggle.classList.toggle('dark');
let isDark = true;

darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    darkModeToggle.classList.toggle('dark');
    isDark = !isDark;
    darkModeToggle.textContent = isDark ? "Light Mode" : "Dark Mode"
});



/* CUTSCENES */

function eatFish() {
    if (!ateFish && getMaterial('fish') >= 1) {
        // eat a fish and blackout
        increaseMaterial('fish', -1);
        // Call this function to start the sequence
        fadeToBlack();
        // Hide fish button
        const fishButton = document.querySelector("#eatFish");
        fishButton.display = 'none';
        ateFish = true;
        setTimeout(() => {
            changeMessage("You are with yourself in a forest.");
            increaseMax('clones', 1);
            increaseMaterial('clones', 1);
        }, 1000); // delay of 1s

    }
}


function fadeToBlack() {
    const overlay = document.getElementById('overlay');
    const overlayText = document.getElementById('overlay-text');
    const overlayButton = document.getElementById('overlay-button');

    overlay.style.display = 'flex';

    setTimeout(() => {
        overlayText.style.opacity = '1';
    }, 2000);

    setTimeout(() => {
        overlayButton.style.display = 'block';
    }, 5000);
}

function hideOverlay() {
    const overlay = document.getElementById('overlay');
    overlay.style.display = 'none';
}


// Message 
function changeMessage(newMessage) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = newMessage;
}

// Example usage:
// changeMessage("You are now in a desert.");





document.addEventListener('DOMContentLoaded', (event) => {
    loadGame();
    initializeUnlockButtons();
    // Your code here
});


function updateResourceIncreaseRates() {
    // const resources = ["clones", "sticks", "vines", "rocks", "fish", "wood", "ponder"];
    for (let resource in resources) {
        // console.log("increase of " + resource);
        const rate = calcIncrease(resource);
        var rateElement = document.getElementById(`${resource}IncreaseRate`);
        if (rateElement) rateElement.textContent = rate;
    }
}

// Call the function to update the rates, and consider setting an interval to periodically update them.
// setInterval(updateResourceIncreaseRates, 1000); // This will update the rates every second.



/* GAME LOOP */

function tick() {
    for (let key in resources) {
        // console.log("updating " + key);
        increaseMaterial(key, calcIncrease(key));
    }
    updateResourceIncreaseRates();
}

window.setInterval(updateVisible, 100) // Update visuals 10 times per second
window.setInterval(tick, 1000); // Every tick lasts for 1 second
window.setInterval(saveGame, 10000); // Save the game every 10 seconds



// const myResources = {};

// document.getElementById("addResourceBtn").addEventListener("click", function () {
//     document.getElementById("resourceForm").style.display = "block";
// });

function addResource() {
    const resourceName = document.getElementById("resourceName").value;
    const activeText = document.getElementById("resourceActiveText").value;
    const defaultText = document.getElementById("resourceDefaultText").value;

    const btnText = document.getElementById("btnText").value;
    const btnTooltipDesc = document.getElementById("btnTooltipDesc").value;
    const btnTooltipCost = document.getElementById("btnTooltipCost").value;

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



function updateSidebar() {
    for (const [resourceName, resourceData] of Object.entries(resources)) {

        const parentElement = document.getElementById('resource-' + resourceName);
        if (!parentElement) return;
        // console.log(parentElement);
        var shouldHide = true;
        for (let c in parentElement.classList) {
            // console.log('has passed', resourceName, passedStage(c));
            if (passedStage(c)) { shouldHide = false; console.log('dont hide', resourceName, c); }
        }

        if (shouldHide) {
            parentElement.style.display = 'none';
        }
        const displayElem = document.getElementById(resourceName + 'Value');
        if (displayElem) {
            // console.log(resourceData);
            displayElem.textContent = `${resourceData.value.toFixed(1)} / ${resourceData.max.toFixed(1)}`;
        }
    }
}

function createCraftedResourceButton(config) {
    const button = document.createElement('button');
    button.className = config.class + ' tooltip';
    button.setAttribute('id', config.id);
    const cleanCount = parseFloat(config.count).toFixed(0);
    button.innerHTML = `${config.text}: <span id="${config.countId}">${cleanCount}</span>`;
    // button.tooltipDesc = config.tooltipDesc; 
    button.tab = 'experiment';

    button.addEventListener('click', function () {
        // Your crafting logic can be added here
        craftResource(config.resourceName);
        // config.craftedOnce = true;
    });

    return button;
}


function appendCraftedResourceButtons() {
    const container = document.querySelector('#craftedResourceButtons');

    // Define the button configurations based on the existing paragraphs
    const resourceConfigs = [
        {
            text: 'Sharp Rocks',
            id: 'craftRocks',
            resourceName: 'sharpRocks',
            countId: 'sharpRocksValue',
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
            countId: 'ropeValue',
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
            countId: 'handleValue',
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
            countId: 'staffValue',
            count: 0,
            requirement: () => getCraftedResource('handle') >= 2,
            tooltipDesc: 'Stick some sheared sticks together',
            tooltipCost: 'Handles: 2',
            class: 'rope'
        },
        {
            text: 'Spears',
            id: 'craftSpear',
            resourceName: 'spear',
            countId: 'spearValue',
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
            countId: 'axeValue',
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
            countId: 'pickaxeValue',
            count: 0,
            requirement: () => getCraftedResource('axe') >= 1,
            tooltipDesc: 'Sadly not made of diamonds',
            tooltipCost: 'Axes: 1',
            class: 'rope'
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


const tooltip = document.getElementById('dynamic-tooltip');

function showTooltip(target, desc, effect, cost) {
    let content = '';

    if (desc) {
        content += `<span >${desc}</span><br>`;
    }

    if (effect) {
        content += `<span style="color:#5DADE2">${effect}</span><br>`;
    }

    if (cost) {
        content += `<span style="color:#F4D03F">${cost}</span><br>`;
    }

    tooltip.innerHTML = content;
    tooltip.style.left = (target.getBoundingClientRect().right + 5) + 'px';
    tooltip.style.top = (target.getBoundingClientRect().top - tooltip.offsetHeight / 2) + 'px';
    tooltip.style.display = 'block';
}

function hideTooltip() {
    tooltip.style.display = 'none';
}

function updateTooltip(button, target) {
    const desc = button.getAttribute('data-tooltip-desc');
    const effect = button.getAttribute('data-tooltip-effect');
    const cost = button.getAttribute('data-tooltip-cost');
    showTooltip(target.target, desc, effect, cost);
}
// Sample usage:
document.querySelectorAll('.tooltip').forEach(button => {
    // Extract the data from your building or any other data - source
    // const content = "Your tooltip content here";
    button.addEventListener('mousemove', function (e) {
        updateTooltip(button, e);
    });

    button.addEventListener('click', function (e) {
        updateTooltip(button, e);
    });
    button.addEventListener('mouseleave', hideTooltip);
});
