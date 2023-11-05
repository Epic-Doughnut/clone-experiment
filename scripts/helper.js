const { resources } = require('./json/resources');
const { skills } = require('./json/skills');
const { buildings } = require('./json/buildings');

const { getMaterial } = require('./getMaterial');



let allVisibleButtons = new Set(['gatherSticks']);
exports.allVisibleButtons = allVisibleButtons;


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
// Calculate the final number of crafted goods from bonuses
// @ts-ignore
// @ts-ignore
function calcCraftBonus(resourceKey) {
    return 1;
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

function clearSidebar() {
    const sidebar = document.querySelector("#resources");
    sidebar.innerHTML = '';
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
    if (require('./ponder').isPondered('fasterSkills')) num *= 1.05;
    // 
    for (let skill in skills) {
        // 
        if (skills[skill].affectedResources.includes(resource)) {
            // max level 100
            if (skills[skill].level >= 100) {
                skills[skill].level = 100;
                skills[skill].exp = 0;
                continue;
            }
            // 
            skills[skill].exp += num / Math.pow(1.4, skills[skill].level);
            // console.log("Updating skill:" + skill + " to " + skills[skill].exp)


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
    if (require('./stages').passedStage('skillsTable')) {
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

function isButtonIdVisible(id) {
    return allVisibleButtons.has(id);
}

function setVisibleButton(id) {
    allVisibleButtons.add(id);
}

module.exports = {
    getMaterial,
    getMax,
    updateSidebar,
    updateSkills,
    populateSkillsTable,
    calcCraftBonus,
    isButtonIdVisible,
    setVisibleButton,
    canBuyBuilding,
    hasGeneratedSkillTable,
    clearSidebar,
};

