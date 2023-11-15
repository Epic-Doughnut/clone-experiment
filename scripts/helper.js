const { hasPrestige, getLevelOfPrestige } = require('./json/prestige');
const { resources, isResource } = require('./json/resources');
const { skills } = require('./json/skills');




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
        if (hasPrestige('storageSpace') && material !== 'clones') max *= 1.05 * getLevelOfPrestige('storageSpace');
        else if (material === 'clones' && hasPrestige('maxClones')) max += getLevelOfPrestige('maxClones');
        return max;
    } else {
        return Infinity;
    }
}

function clearSidebar() {
    const sidebar = document.querySelector("#resources");
    sidebar.innerHTML = '';
}


function isButtonIdVisible(id) {
    return allVisibleButtons.has(id);
}

function setVisibleButton(id) {
    allVisibleButtons.add(id);
}

module.exports = {
    getMax,
    calcCraftBonus,
    isButtonIdVisible,
    setVisibleButton,
    clearSidebar,
};

