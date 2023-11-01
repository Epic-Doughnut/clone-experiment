const { resources } = require('./json/resources');
const { buttons } = require('./json/buttons');
const { skills } = require('./json/skills');
const { getCraftedResourceConfigById } = require('./json/craftedResources');
const { getBuildingCount, buildings } = require('./json/buildings');

const { isPondered, canUnlock } = require('./ponder');
const { craftedResources, getCraftedResourceKeyByConfig } = require("./json/craftedResources");
const { getMaterial } = require('./getMaterial');

let stages = [];
let allVisibleButtons = new Set(['gatherSticks']);
exports.allVisibleButtons = allVisibleButtons;


/**
 * 
 * @param {string} str stringExample
 * @returns StringExample
 */
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Make everything with the class "stage" visible
 * @param {string} stage 
 */
function makeVisible(stage) {
    if (!passedStage(stage)) {
        stages.push(stage);
    }
    const stageElements = document.querySelectorAll("p." + stage);
    stageElements.forEach(element => element.classList.add('visible'));
    // 
    // @ts-ignore
    stageElements.forEach(element => element.style.display = '');
    updateButtonVisibility();
}

/**
 * 
 * @param {string} stage Stage to check
 * @returns boolean if stage in stages
 */
function passedStage(stage) {
    return stages.includes(stage);
}

function getAllStages() {
    return stages;
}
/**
 * 
 * @param {string} buildingName 
 * @returns 
 */
function canBuyBuilding(buildingName) {
    // Check if we have enough resources
    let canBuy = true;
    const building = buildings[buildingName];

    for (const resource in building.cost) {
        if (building.cost[resource] > getMaterial(resource, resources)) {
            canBuy = false;
            break;
        }
    }

    // console.log('can we buy ',buildingName,canBuy);
    return canBuy;
}
/**
 * A map of all jobs that require a ponder to be unlocked
 *
 * Job: RequiredPonder
 */
const jobRequiredPonders = {
    'thinking': 'thinking',
    'fishing': 'fishing',
    'smithing': 'not-unlockable',
    'farming': 'agriculture',
    'combat': 'combat',
    'hunting': 'hunting'
};

/**
 * Changes the states of buttons between 'hidden', 'purchasable', and 'button-disabled'
 */
function updateButtonVisibility() {
    const selectButtons = document.querySelectorAll('button'); // Adjust the selector accordingly

    selectButtons.forEach(button => {
        const buttonConfig = buttons[button.id]; /* get the button's configuration using its data attribute or ID, etc. *//* get the button's configuration using its data attribute or ID, etc. */;
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
            // 
            var crafted = getCraftedResourceConfigById(buttonConfig.id);
            // console.log(crafted);
            if (crafted.value > 0) state = 'button-disabled';

            // 
            const key = getCraftedResourceKeyByConfig(crafted);
            // console.log(key);
            // 
            if (canCraft(key)) state = 'purchasable';
        }

        // If we can afford this building, it should be purchasable
        // console.log(buttonConfig);
        if (buttonConfig.data_building) {
            // If we've already purchased a building, it should be visible
            // 
            state = getBuildingCount(buttonConfig.data_building) ? 'button-disabled' : state;
            // Find the building cost
            // console.log(buttonConfig);
            // 
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
            // 
            // @ts-ignore
            button.style.display = 'none';
        } else {
            // console.log('all visible ', button.id);
            allVisibleButtons.add(button.id);
            button.classList.add(state);
            // @ts-ignore
            button.style.display = ''; // This will revert it back to its original display state or default (e.g., 'block' or 'inline-block')
        }
    });
}






// Calculate the final number of crafted goods from bonuses
// @ts-ignore
// @ts-ignore
function calcCraftBonus(resourceKey) {
    return 1;
}


function canCraft(resourceKey) {
    let canCraft = true;
    let requirements = craftedResources[resourceKey].cost;

    // Check if all requirements are met
    try {
        for (let mat in requirements) {
            if (getMaterial(mat, resources) < requirements[mat]) {
                canCraft = false;
                break;
            }
        }
    } catch (err) {
        console.warn('Error in calculating requirements: ', resourceKey, requirements, err);
    }

    return canCraft;
}

// @ts-ignore
function getAffectedResources(skill) {
    if (skills[skill]) {
        return skills[skill].affectedResources;
    }
    return null;  // or an empty array [], based on your preference
}
/**
 * 
 * @param {string} material 
 * @returns Max of material or Infinity
 */
function getMax(material) {
    if (resources.hasOwnProperty(material)) {
        return resources[material].max;
    } else {
        return Infinity;
    }
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
            // 
            if (resourceConfig.value === getMax(resourceName)) color = '#fcc';
            // 
            else if (resourceConfig.value / getMax(resourceName) > .6) color = '#eeb';

            displayElem.innerHTML = `<span style="color:${color}">${abbreviateNumber(resourceConfig.value)} / ${abbreviateNumber(getMax(resourceName))} </span>`;
        }
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
const levelUpMessage = document.getElementById('levelUpMessage');

function updateSkills(resource, num) {
    num = Math.abs(num);
    if (isPondered('fasterSkills')) num *= 1.05;
    // 
    for (let skill in skills) {
        // 
        if (skills[skill].affectedResources.includes(resource)) {
            // 
            skills[skill].exp += num / Math.pow(1.1, skills[skill].level);
            // console.log("Updating skill:" + skill + " to " + skills[skill].exp)

            // 
            if (skills[skill].exp >= 100) {
                // 
                skills[skill].level += 1;
                // 
                skills[skill].exp = 0;
                // console.log("Level Up! " + skill + skills[skill].level);
                // 
                levelUpMessage.textContent = `Level up! ${skill} → ${skills[skill].level}`;
                // 
                levelUpMessage.classList.remove('hidden');
                // Hide the message after 3 seconds
                setTimeout(() => {
                    // levelUpMessage.style.display = 'none';
                    // 
                    levelUpMessage.classList.add('hidden');
                }, 3000); // 3000 milliseconds (3 seconds)
            }
        }
    }
    if (passedStage('skillsTable')) {
        populateSkillsTable();
    }
}

let hasGeneratedSkillTable = false;

function populateSkillsTable() {
    const table = document.getElementById('skillsTable');

    // If the table is empty, create the rows and progress bars
    if (!hasGeneratedSkillTable) {
        console.log("Generating table for the first time");
        hasGeneratedSkillTable = true;
        // 
        for (let skill in skills) {
            let tr = document.createElement('tr');
            tr.id = 'tr-' + skill;
            let tdProgress = document.createElement('td');
            tdProgress.style.position = 'relative';

            let progressBar = document.createElement('div');
            progressBar.setAttribute('class', 'progressBar');
            // if (isDark) {
            //     progressBar.style.backgroundColor = '#228B22';
            // }
            // else {
            //     progressBar.style.backgroundColor = '#50C878';
            // }
            progressBar.style.height = '20px';
            progressBar.setAttribute('data-skill', skill); // Assign a data attribute for identification

            let skillText = document.createElement('span');

            // 
            skillText.textContent = '[' + skills[skill].level + ']   ' + skill;
            skillText.setAttribute('id', 'level-' + skill);
            skillText.style.position = 'absolute';
            skillText.style.left = '10px';
            skillText.style.top = '50%';
            skillText.style.transform = 'translateY(-50%)';

            // 
            if (skills[skill].exp == 0 && skills[skill].level == 0) {
                tr.style.display = 'none';
            }
            tdProgress.appendChild(progressBar);
            tdProgress.appendChild(skillText);
            tr.appendChild(tdProgress);

            // 
            table.appendChild(tr);

        }
    }

    else {
        // Display everything we can
        for (let skill in skills) {

            if (skills[skill].exp > 0 || skills[skill].level > 0) {
                // 
                // @ts-ignore
                document.querySelector('#tr-' + skill).style.display = '';
            }
            let progressBar = document.querySelector(`.progressBar[data-skill="${skill}"]`);
            if (progressBar) {
                // 
                // @ts-ignore
                progressBar.style.width = skills[skill].exp + '%';
                let skillName = document.querySelector("#level-" + skill);
                skillName.textContent = '[' + skills[skill].level + ']   ' + skill;
            }
        }
    }

}

module.exports = {
    capitalizeFirst,
    makeVisible,
    passedStage,
    getMaterial,
    getMax,
    updateSidebar,
    updateSkills,
    populateSkillsTable,
    getAllStages,
    updateButtonVisibility, canCraft, calcCraftBonus,
    canBuyBuilding,
    hasGeneratedSkillTable
};

