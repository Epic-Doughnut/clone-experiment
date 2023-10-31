const { buttons } = require('./json/buttons');
const { craftedResources } = require('./json/craftedResources');
const { buildings } = require("./json/buildings");
const { ponders } = require("./json/ponder");

const { saveGame, loadGame } = require("./saving");
const { getMaterial, createResourceTag } = require('./resources');
const { recalculateBuildingCost } = require('./buildings');
const { hasPerk } = require('./perks');
/* MY CODE STARTS HERE */



// Initialize values
// let skilled = false;
let hasGeneratedSkillTable = false;

let allVisibleButtons = new Set(['gatherSticks']);

let stages = [];



/**
 * 
 * @param {string} str stringExample
 * @returns StringExample
 */
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}



/* GATHERING MATERIALS*/






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

const emojiGatherDiv = document.querySelector('#emojiGatherDisplay');
function toggleResource(resourceKey) {
    const resource = resources[resourceKey];

    // emojiDiv.textContent = '𓆮';
    const sidebarParent = document.querySelector("#resources");
    const sidebarText = sidebarParent.querySelector('#resource-' + resourceKey);
    const resourceButton = document.querySelector('#gather' + resourceKey.charAt(0).toUpperCase() + resourceKey.slice(1));

    if (!resource.isGetting) {
        stopAllGathering(); // Stop all gathering actions
        resource.isGetting = true;
        resourceButton.textContent = resource.activeText;
        if (sidebarText) sidebarText.style.fontWeight = 'bold';
        emojiGatherDiv.textContent = resource.emoji;
        console.log(resource.emoji);
    } else {
        resource.isGetting = false;
        resourceButton.textContent = resource.defaultText;
        if (sidebarText) sidebarText.style.fontWeight = 'normal';
    }
}

var ateFish = false;






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
            console.warn('Error with requirement while generating buttons: ', btn, err);
        }
    }
}



// Attach event listeners for gathering
// for (let key in resources) {
//     let resource = resources[key];
//     let button = document.getElementById(resource.id);
//     if (button) {
//         button.addEventListener('click', () => toggleResource(key));
//         resource.button = button; // Store the button reference in the object
//     }

//     if (craftedResources[key]) {
//         resource.tooltipCost = generateTooltipCost(craftedResources[key].requires);
//     }
// }

// Automatically add event listeners
// for (let key in craftedResources) {
//     let resource = craftedResources[key];
//     let button = document.getElementById(resource.id);
//     if (button) {
//         button.addEventListener('click', () => craftResource(key));
//     }
// }



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
    stageElements.forEach(element => element.style.display = '');
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
        try {
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
        } catch (err) {
            console.warn('Error with checking requirement of button: ', buttonConfig, err);
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

        // Update the tooltip for this button if its active
        // if (button === currentHoverButton) updateTooltip(button);

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

    document.querySelectorAll('.job-button').forEach(button => {
        const job = button.getAttribute('data-job');
        button.classList.remove('hidden', 'purchasable', 'button-disabled');

        var state = 'purchasable';
        const reqPonder = jobRequiredPonders[job];
        if (reqPonder === null || reqPonder === undefined) state = 'purchasable';
        else if (isPondered(reqPonder)) state = 'purchasable';
        else if (reqPonder === 'not-unlockable') state = 'hidden';
        else state = 'button-disabled';


        // console.log(job, button, reqPonder, state);
        // button.classList.
        if (state === 'hidden') {
            // console.log('hiding',button);
            button.style.display = 'none';
        } else {
            // console.log('all visible ', button.id);
            allVisibleButtons.add(button.id);
            button.classList.add(state);
            button.style.display = ''; // This will revert it back to its original display state or default (e.g., 'block' or 'inline-block')
        }
    });
}




// for (const resourceName in resources) {
//     if (resources.hasOwnProperty(resourceName)) {
//         const resourceDisplayName = capitalizeFirst(resourceName).split('_').join(' ');

//         const resourceElement = document.createElement('p');
//         resourceElement.className = `${resourceName} resource`;
//         resourceElement.id = `resource-${resourceName}`;

//         const resourceNameSpan = document.createElement('span');
//         resourceNameSpan.className = 'resourceName';
//         resourceNameSpan.textContent = `${resourceDisplayName}:`;

//         const resourceValueSpan = document.createElement('span');
//         resourceValueSpan.className = 'resourceValue';
//         resourceValueSpan.id = `${resourceName}Value`;
//         resourceValueSpan.textContent = '0';

//         const resourceRateSpan = document.createElement('span');
//         resourceRateSpan.className = 'resourceRate';
//         resourceRateSpan.innerHTML = `(+
//             <span id="${resourceName}IncreaseRate">0</span>/s)`;

//         resourceElement.appendChild(resourceNameSpan);
//         resourceElement.appendChild(resourceValueSpan);
//         resourceElement.appendChild(resourceRateSpan);

//         resourcesContainer.appendChild(resourceElement);
//     }
// }

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
        condition: () => getMaterial('sticks') >= 10,
        action: () => makeVisible('vines')
    },
    {
        condition: () => getMaterial('vines') >= 10,
        action: () => makeVisible('rocks')
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
        condition: () => getMaterial('fish') >= 5 && !ateFish,
        action: () => {
            document.getElementById('eatFish').style.display = 'block';
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
        if (currentHoverButton !== null) updateTooltip(currentHoverButton);
    } catch (err) {
        console.warn(err);
    }

}


const levelUpMessage = document.getElementById('levelUpMessage');

function updateSkills(resource, num) {
    num = Math.abs(num);
    if (isPondered('fasterSkills')) num *= 1.05;
    for (let skill in skills) {
        if (skills[skill].affectedResources.includes(resource)) {
            skills[skill].exp += num / Math.pow(1.1, skills[skill].level);
            // console.log("Updating skill:" + skill + " to " + skills[skill].exp)

            if (skills[skill].exp >= 100) {
                skills[skill].level += 1;
                skills[skill].exp = 0;
                // console.log("Level Up! " + skill + skills[skill].level);
                levelUpMessage.textContent = `Level up! ${skill} → ${skills[skill].level}`;
                levelUpMessage.classList.remove('hidden');
                // Hide the message after 3 seconds
                setTimeout(() => {
                    // levelUpMessage.style.display = 'none';
                    levelUpMessage.classList.add('hidden');
                }, 3000); // 3000 milliseconds (3 seconds)
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

        }
    }

    else {
        // Display everything we can
        for (let skill in skills) {
            if (skills[skill].exp > 0 || skills[skill].level > 0) {
                document.querySelector('#tr-' + skill).style.display = '';
            }
            let progressBar = document.querySelector(`.progressBar[data-skill="${skill}"]`);
            if (progressBar) {
                progressBar.style.width = skills[skill].exp + '%';
                let skillName = document.querySelector("#level-" + skill);
                skillName.textContent = '[' + skills[skill].level + ']   ' + skill;
            }
        }
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
    activeContent.classList.add("active");

    // Get the clicked tab button and make it active
    const tabString = `#${tabName}Button`;
    let activeTabButton = document.querySelector(tabString);

    if (activeTabButton) activeTabButton.classList.add("active");


    // Show buttons in the active tab (including those in the three columns)
    // let columnsInActiveTab = activeContent.querySelectorAll('div');
    // for (let column of columnsInActiveTab) {
    //     column.classList.add("active");

    //     let buttonsInColumn = column.querySelectorAll('button');
    //     for (let button of buttonsInColumn) {
    //         // console.log(buttons[button.id]);
    //         if (buttons[button.id] && buttons[button.id].requirement()) {
    //             button.style.display = 'flex'; // Or 'inline-block', or whatever your desired display style is
    //             console.log("displaying " + button.id);
    //         }
    //     }
    // }

    // Hide buttons in inactive tabs (including those in the three columns)
    // for (let content of tabContainers) {
    //     if (content !== activeContent) {
    //         let columnsToHide = content.querySelectorAll('div');
    //         for (let column of columnsToHide) {
    //             let buttonsToHide = column.querySelectorAll('button');
    //             for (let button of buttonsToHide) {
    //                 // button.classList.add('button-disabled');
    //             }
    //         }

    //         if (content.id === "perksTab")

    //     }
    // }

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
darkModeToggle.classList.toggle('dark');
let isDark = true;


/* CUTSCENES */

function eatFish() {
    if (!ateFish && getMaterial('fish') >= 1) {
        // eat a fish and blackout
        increaseMaterial('fish', -1);
        // Call this function to start the sequence
        fadeToBlack();
        // Hide fish button
        ateFish = true;
        const fishButton = document.querySelector("#eatFish");
        fishButton.display = 'none';
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
    const modifiedMessage = newMessage.replace(cloneWords, `<span id="alone" title="You feel peckish for some seafood">${cloneWords}</span>`);
    messageElement.innerHTML = modifiedMessage;
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
    while (accumulated_lag >= 100 * milliseconds_per_frame) {
        milliseconds_per_frame *= 10;
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
    for (const [resourceName, resourceConfig] of Object.entries(resources)) {

        const parentElement = document.getElementById('resource-' + resourceName);
        if (!parentElement) return;
        // console.log(parentElement);
        var shouldHide = true;
        for (let c in parentElement.classList) {
            // console.log('has passed', resourceName, passedStage(c));
            if (passedStage(c)) { shouldHide = false; console.log('dont hide', resourceName, c); }
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
            if (resourceConfig.value === getMax(resourceName)) color = '#fcc';
            else if (resourceConfig.value / getMax(resourceName) > .6) color = '#eeb';

            displayElem.innerHTML = `<span style="color:${color}">${abbreviateNumber(resourceConfig.value)} / ${abbreviateNumber(getMax(resourceName))} </span>`;
        }
    }
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
                const hasEnough = getMaterial(material) >= amount;/* Your logic to check if there's enough of the material */;
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
    tooltip.innerHTML = content;
    tooltip.style.left = (target.getBoundingClientRect().right + 5) + 'px';
    tooltip.style.top = (target.getBoundingClientRect().top - tooltip.offsetHeight / 2) + 'px';
    tooltip.style.display = 'block';
}

function hideTooltip() {
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


generateButtons(); // Call this once on page load or game initialization
// After all has been loaded
document.addEventListener('DOMContentLoaded', (event) => {

    loadGame();
    updateSidebar();

    showTab('productionTab');
    createResourceTag('sticks');
    appendCraftedResourceButtons();

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
        if (event.target.matches("button")) {
            // one of our buttons was clicked
            const button = event.target;
            // console.log('clicked', button);

            // Update tooltips 
            // if (button.classList.contains('tooltip')) updateTooltip(button);
            // updateTooltip(button);

            if (button.getAttribute('data_building') && button.getAttribute('data_building') !== 'undefined' && button.classList.contains('purchasable')) {
                var building = button.getAttribute('data_building');
                if (event.shiftKey) {
                    buyMaxBuildings(building);
                } else {
                    buyBuilding(building);
                }
            }
            if (button.classList.contains('unlock')) {
                const unlockAttr = button.getAttribute('unlock');
                // console.log('click');
                console.log(unlockAttr);
                if (ponders[unlockAttr]) {
                    var canUnlock = true;
                    for (let material in ponders[unlockAttr].cost) {
                        if (getMaterial(material) < ponders[unlockAttr].cost[material]) {
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
                        button.display = 'none';

                        console.log("Unlocking " + unlockAttr);
                    }
                }

            }

            if (button.id !== 'undefined') {
                console.log(button);
                if (button.id.slice(0, 6) === "gather") toggleResource(getRKeyFromID(button.id));

                if (button.id.slice(0, 5) === 'craft')
                    if (event.shiftKey) craftAllResources(getCRKeyFromID(button.id));
                    else craftResource(getCRKeyFromID(button.id));


                if (button.id === 'darkModeToggle') {
                    body.classList.toggle('dark-mode');
                    darkModeToggle.classList.toggle('dark');
                    isDark = !isDark;
                    darkModeToggle.textContent = isDark ? "Light Mode" : "Dark Mode"

                }

            }

        }

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
        button.addEventListener('mouseenter', function (e) {
            updateTooltip(button);
            currentHoverButton = button;
        });


        // TODO: move this event listener
        button.addEventListener('onclick', function () {
            updateTooltip(button);
        })

        button.addEventListener('mouseleave', function () { hideTooltip(); currentHoverButton = null; });
    });

    // Update the jobs counter
    updateTotal();


});

var currentHoverButton = null;

module.exports = {
    capitalizeFirst,
    updateSidebar,
    updateUI,
    updateSkills,
    passedStage,
    makeVisible,

    total_time,
    currentHoverButton

};