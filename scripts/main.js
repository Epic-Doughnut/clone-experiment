
/* MY CODE STARTS HERE */



// Initialize values
// let skilled = false;
let hasGeneratedSkillTable = false;

let allVisibleButtons = new Set(['gatherSticks']);

let stages = [];







/* GATHERING MATERIALS*/




// Get function for materials
function getMaterial(material) {
    if (resources.hasOwnProperty(material)) {
        return resources[material].value;
    } else {
        // console.error("Invalid material:", material);  // For debugging
        return getCraftedResource(material);

    }
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const sidebarParent = document.querySelector("#resources");
function stopAllGathering() {
    for (let key in resources) {
        resources[key].isGetting = false;
        const rButton = document.querySelector("#gather" + capitalizeFirst(key));
        if (rButton) rButton.textContent = resources[key].defaultText;

        // Set sidebar to not bold
        const sidebarText = sidebarParent.querySelector('#resource-' + key);
        if (sidebarText) sidebarText.style.fontWeight = 'normal';

    }
}

function toggleResource(resourceKey) {
    const resource = resources[resourceKey];

    const sidebarParent = document.querySelector("#resources");
    const sidebarText = sidebarParent.querySelector('#resource-' + resourceKey);
    const resourceButton = document.querySelector('#gather' + resourceKey.charAt(0).toUpperCase() + resourceKey.slice(1));

    if (!resource.isGetting) {
        stopAllGathering(); // Stop all gathering actions
        resource.isGetting = true;
        resourceButton.textContent = resource.activeText;
        if (sidebarText) sidebarText.style.fontWeight = 'bold';
    } else {
        resource.isGetting = false;
        resourceButton.textContent = resource.defaultText;
        if (sidebarText) sidebarText.style.fontWeight = 'normal';
    }
}

var ateFish;










/* HELPER FUNCTIONS */












function isPondered(id) {
    // Check if the id exists in the unlocks map
    // If the id doesn't exist in the map, return false

    return ponders[id] ? ponders[id].isPondered : false;

}

function canUnlock(unlockId) {
    // Get the key from this id
    var unlockKey = '';
    for (let unlock in ponders) {
        if (ponders[unlock].id === unlockId) {
            unlockKey = unlock;
        }
    }
    // Check if we have enough resources
    var canBuy = true;
    for (let req of ponders[unlockKey].cost) {
        if (getMaterial(req.material) < req.amount) {
            // console.log("Cannot unlock " + unlockId);
            canBuy = false;
            break;
        }
    }

    // console.log('can we unlock ', unlockId, canBuy);
    return canBuy;
}


// Function to get all buttons with class 'unlock' and attach an event listener to them
// function initializeUnlockButtons() {
//     const unlockButtons = document.querySelectorAll('.unlock');

//     unlockButtons.forEach(button => {
//         button.addEventListener('click', function () {
//             console.log('click');
//             const unlockAttr = this.getAttribute('unlock');
//             console.log(unlockAttr);
//             if (unlocks[unlockAttr]) {
//                 canCraft = true;
//                 for (let req of unlocks[unlockAttr].cost) {
//                     if (getMaterial(req.material) < req.amount) {
//                         console.log("Cannot unlock " + unlockAttr);
//                         canCraft = false;
//                         break;
//                     }
//                 }

//                 if (canCraft) {
//                     for (let req of unlocks[unlockAttr].cost) {
//                         increaseMaterial(req.material, -req.amount);
//                     }
//                     unlocks[unlockAttr].isUnlocked = true;
//                     makeVisible(unlockAttr);
//                     // document.querySelector("#" + resourceKey + "Value").textContent = craftedResources[resourceKey].value.toFixed(2);
//                     // make this button disappear
//                     this.display = 'none';

//                     console.log("Unlocking " + unlockAttr);
//                 }
//             }
//         });
//     });
// }

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
        // if this resource isn't unlocked, hide it
        // if (!btn.isVisible) buttonElement.classList.add('hidden');

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






// After you've appended your buttons:
// const buildingButtons = document.querySelectorAll('button[data_building]:not([data_building="undefined"])');
// console.log(buildingButtons);
// buildingButtons.forEach(button => {
//     button.addEventListener('click', function () {
//         console.log("Button clicked! ");
//         const buildingName = this.getAttribute('data_building');
//         buyBuilding(buildingName);
//     });
// });



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

        if (button.id && allVisibleButtons.has(button.id)) state = 'button-disabled';

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
                    // If a ponder button is unlocked, hide it
                    if (isPondered(button.getAttribute('unlock'))) state = 'hidden';
                    // console.log(button, state);
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
            // console.log('all visible ', button.id);
            allVisibleButtons.add(button.id);
            button.style.display = ''; // This will revert it back to its original display state or default (e.g., 'block' or 'inline-block')
        }
    });
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
        condition: () => getMaterial("sticks") >= 1,
        action: () => makeVisible("stick")
    },
    {
        condition: () => getMaterial("rocks") >= 1,
        action: () => { makeVisible("tab-button"); makeVisible('craftRocks'); }
    },

    {
        condition: () => getMaterial("fish") >= 1,
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
        if (!hasTool(tool) && getCraftedResource(tool) > 0) {
            addTool(tool);
            makeVisible(toolsToStages[tool]);
        }
    }

    try {
        updateButtonVisibility();
    } catch (err) {
        console.warn(err);
    }

}



function updateSkills(resource, num) {
    num = Math.abs(num);
    for (let skill in skills) {
        if (skills[skill].affectedResources.includes(resource)) {
            skills[skill].exp += num / Math.pow(1.1, skills[skill].level);
            // console.log("Updating skill:" + skill + " to " + skills[skill].exp)

            if (skills[skill].exp >= 100) {
                skills[skill].level += 1;
                skills[skill].exp = 0;
                console.log("Level Up! " + skill + skills[skill].level);
            }
        }
    }
    if (passedStage('skillsTable')) {
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
            tr.id = 'tr-' + skill;
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

            if (skills[skill].exp == 0 && skills[skill].level == 0) {
                tr.style.display = 'none';
            }
            tdProgress.appendChild(progressBar);
            tdProgress.appendChild(skillText);
            tr.appendChild(tdProgress);

            table.appendChild(tr);

            // let progressBar = document.querySelector(`.progressBar[data-skill="${skill}"]`);
            if (progressBar) {
                progressBar.style.width = skills[skill].exp + '%';
                let skillName = document.querySelector("#level-" + skill);
                skillName.textContent = '[' + skills[skill].level + ']   ' + skill;
            }
        }
    }

    else {
        // Display everything we can
        for (let skill in skills) {
            if (skills[skill].exp > 0 || skills[skill].level > 0) {
                document.querySelector('#tr-' + skill).style.display = '';
            }
        }
    }

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

// darkModeToggle.addEventListener('click', () => {
//     body.classList.toggle('dark-mode');
//     darkModeToggle.classList.toggle('dark');
//     isDark = !isDark;
//     darkModeToggle.textContent = isDark ? "Light Mode" : "Dark Mode"
// });



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
            changeMessage("You are with yourself in a forest.", 'with yourself');
            increaseMax('clones', 1);
            // increaseMaterial('clones', 1);
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

const overlay = document.getElementById('overlay');
function hideOverlay() {
    overlay.style.display = 'none';
}


// Message 
const messageElement = document.getElementById('message');
function changeMessage(newMessage, cloneWords) {
    const modifiedMessage = newMessage.replace(cloneWords, `<span id="alone">${cloneWords}</span>`);
    messageElement.innerHTML = modifiedMessage;
}

// Example usage:
// changeMessage("You are now in a desert.");








// Call the function to update the rates, and consider setting an interval to periodically update them.
// setInterval(updateResourceIncreaseRates, 1000); // This will update the rates every second.



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
    while (accumulated_lag >= milliseconds_per_frame) {
        accumulated_lag -= milliseconds_per_frame;
        update(milliseconds_per_frame, total_time);
    }

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
    for (const [resourceName, resourceData] of Object.entries(resources)) {

        const parentElement = document.getElementById('resource-' + resourceName);
        if (!parentElement) return;
        // console.log(parentElement);
        var shouldHide = true;
        for (let c in parentElement.classList) {
            // console.log('has passed', resourceName, passedStage(c));
            if (passedStage(c)) { shouldHide = false; console.log('dont hide', resourceName, c); }
        }
        if (resourceData.value > 0) { shouldHide = false; resources[resourceName].isVisible = true; }
        if (resourceData.isVisible) { shouldHide = false; }

        if (shouldHide) {
            parentElement.style.display = 'none';
        }
        const displayElem = document.getElementById(resourceName + 'Value');
        if (displayElem) {
            // console.log(abbreviateNumber(resourceData));
            displayElem.textContent = abbreviateNumber(resourceData.value) + ' / ' + abbreviateNumber(resourceData.max);
        }
    }
}



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
    // console.log(target, content);
    tooltip.innerHTML = content;
    tooltip.style.left = (target.getBoundingClientRect().right + 5) + 'px';
    tooltip.style.top = (target.getBoundingClientRect().top - tooltip.offsetHeight / 2) + 'px';
    tooltip.style.display = 'block';
}

function hideTooltip() {
    tooltip.style.display = 'none';
}

function updateTooltip(button) {
    const desc = button.getAttribute('data-tooltip-desc');
    const effect = button.getAttribute('data-tooltip-effect');
    const cost = button.getAttribute('data-tooltip-cost');
    showTooltip(button, desc, effect, cost);
}


generateButtons(); // Call this once on page load or game initialization
// After all has been loaded
document.addEventListener('DOMContentLoaded', (event) => {

    loadGame();
    updateSidebar();



    document.addEventListener("click", (event) => {
        if (event.target.matches("button")) {
            // one of our buttons was clicked
            const button = event.target;
            // console.log('clicked', button);

            // Update tooltips 
            if (button.classList.contains('tooltip')) updateTooltip(button);

            if (button.getAttribute('data_building') && button.getAttribute('data_building') !== 'undefined' && button.classList.contains('purchasable')) {
                var building = button.getAttribute('data_building');
                buyBuilding(building);
            }
            if (button.classList.contains('unlock')) {
                const unlockAttr = button.getAttribute('unlock');
                // console.log('click');
                console.log(unlockAttr);
                if (ponders[unlockAttr]) {
                    var canUnlock = true;
                    for (let req of ponders[unlockAttr].cost) {
                        if (getMaterial(req.material) < req.amount) {
                            console.log("Cannot unlock " + unlockAttr);
                            canUnlock = false;
                            break;
                        }
                    }

                    if (canUnlock) {
                        for (let req of ponders[unlockAttr].cost) {
                            increaseMaterial(req.material, -req.amount);
                        }
                        ponders[unlockAttr].isUnlocked = true;
                        makeVisible(unlockAttr);
                        // document.querySelector("#" + resourceKey + "Value").textContent = craftedResources[resourceKey].value.toFixed(2);
                        // make this button disappear
                        button.display = 'none';

                        console.log("Unlocking " + unlockAttr);
                    }
                }

            }

            if (button.id && button.id.slice(0, 6) === "gather") {
                for (let r in resources) {
                    // console.log(resources[r].id, button.id);
                    if (resources[r].id == button.id) {
                        console.log(r);
                        toggleResource(r);

                    }
                }
            }

            if (button.id && button.id === 'darkModeToggle') {
                body.classList.toggle('dark-mode');
                darkModeToggle.classList.toggle('dark');
                isDark = !isDark;
                darkModeToggle.textContent = isDark ? "Light Mode" : "Dark Mode"

            }

        }

        if (event.target.matches("#alone")) {
            increaseMax('clones', 1);
        }
    });


    requestAnimationFrame(loop);

    // Sample usage:
    document.querySelectorAll('.tooltip').forEach(button => {
        // console.log(button);
        // Extract the data from your building or any other data - source
        // const content = "Your tooltip content here";
        button.addEventListener('mousemove', function (e) {
            updateTooltip(button);
        });

        button.addEventListener('mouseleave', hideTooltip);
    });

    // Update the jobs counter
    updateTotal();


});

