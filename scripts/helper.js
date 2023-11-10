const { hasPrestige, getLevelOfPrestige } = require('./json/prestige');
const { resources, isResource } = require('./json/resources');
const { skills } = require('./json/skills');
const { triggerFloatUpText } = require('./triggerFloatUpText');




let allVisibleButtons = new Set(['gatherSticks']);
exports.allVisibleButtons = allVisibleButtons;


// Calculate the final number of crafted goods from bonuses
function calcCraftBonus(resourceKey) {
    let total = 1;
    for (let skill in skills) {
        if (skills[skill].affectedResources.includes(resourceKey)) {
            let skillRatio = 1.06;
            var mult = 1 + (Math.pow(skillRatio, skills[skill].level) - 1) / 100;
            // console.log("Multiplying gain by " + mult);
            total *= mult;
        }
    }

    return total;
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
    if (isResource(material)) {
        let max = resources[material].max;
        if (hasPrestige('storageSpace')) max *= 1.05 * getLevelOfPrestige('storageSpace');
        return max;
    } else {
        return Infinity;
    }
}

function clearSidebar() {
    const sidebar = document.querySelector("#resources");
    sidebar.innerHTML = '';
}





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
                let levelup = `Level up! ${skill} → ${skills[skill].level}`;
                const rect = document.getElementById('prestige').getBoundingClientRect();
                triggerFloatUpText(rect.x, rect.y, levelup, '#F4D03F');

                // levelUpMessage.classList.remove('hidden');
                // Hide the message after 3 seconds
                // setTimeout(() => {
                // levelUpMessage.style.display = 'none';
                // 
                // levelUpMessage.classList.add('hidden');
                // }, 3000); // 3000 milliseconds (3 seconds)
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
    getMax,
    updateSkills,
    populateSkillsTable,
    calcCraftBonus,
    isButtonIdVisible,
    setVisibleButton,
    hasGeneratedSkillTable,
    clearSidebar,
};

