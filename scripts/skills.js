const { skills } = require('./json/skills');
const { triggerFloatUpText } = require('./triggerFloatUpText');

function invertSkillsToResources(skills) {
    let resourceToSkillMap = {};

    for (const [skill, data] of Object.entries(skills)) {
        for (const resource of data.affectedResources) {
            if (!resourceToSkillMap[resource]) {
                resourceToSkillMap[resource] = [];
            }
            resourceToSkillMap[resource].push(skill);
        }
    }

    return resourceToSkillMap;
}
const resourceToSkillMap = invertSkillsToResources(skills);
console.log(resourceToSkillMap);
/**
 * Update the relevant skill of a resource increased by num
 * @param {string} resource Which resource was updated
 * @param {number} num How much the resource increased
 * @returns
 */
function updateSkills(resource, num) {
    num = Math.abs(num);
    if (require('./ponder').isPondered('fasterSkills')) num *= 1.05;

    if (!resourceToSkillMap[resource]) return;
    const skill = resourceToSkillMap[resource][0].toString();
    // max level 100
    if (skills[skill].level >= 100) {
        skills[skill].level = 100;
        skills[skill].exp = 0;
        return;
    }
    // 
    skills[skill].exp += num / Math.pow(1.4, skills[skill].level);
    // console.log("Updating skill:" + skill + " to " + skills[skill].exp)
    if (skills[skill].exp >= 100) {

        skills[skill].level += 1;
        skills[skill].exp = 0;

        // Levelup popup
        let levelup = `Level up! ${skill} → ${skills[skill].level}`;
        const rect = document.getElementById('prestige').getBoundingClientRect();
        triggerFloatUpText(rect.x, rect.y, levelup, '#F4D03F');
    }


    // Update the skills table visualization
    if (require('./stages').passedStage('skillsTable')) {
        populateSkillsTable();
    }
}
let hasGeneratedSkillTable = false;
/**
 * Draw the skills table and initialize if needed
 */
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
            skillText.textContent = '[level ' + skills[skill].level + ']   ' + skill;
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
                skillName.textContent = '[level ' + skills[skill].level + ']   ' + skill;
            }
        }
    }

}

module.exports = {
    updateSkills,
    populateSkillsTable

};