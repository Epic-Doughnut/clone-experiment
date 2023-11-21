const { hasPrestige, getLevelOfPrestige } = require('./json/prestige');
const { resources, isResource } = require('./json/resources');
const { skills } = require('./json/skills');
const { isPondered } = require('./ponder');
const { passedStage } = require('./stages');
const { updateBounceAnimation } = require('./updateBounceAnimation');




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
        let baseMax = resources[material].basemax; // Static base max value
        let max = baseMax;

        if (hasPrestige('storageSpace') && material !== 'clones') {
            max = baseMax * (1.05 * getLevelOfPrestige('storageSpace'));
        } else if (material === 'clones') {
            if (passedStage('clone')) max += 1;

            const buildings = require("./json/buildings").buildings;
            // console.log(passedStage('clone'), maxClones);
            for (const [key, building] of Object.entries(buildings)) {

                // console.log(key, building, building.effects);
                if (building.effects && building.effects['clones'])
                    max += building.effects['clones'] * building.count;
            }

            // Ponder bonuses
            if (isPondered('biggerShelter')) max += 1 * buildings['shelter'].count;
            if (isPondered('biggerHut')) max += 1 * buildings['hut'].count;
            if (isPondered('biggerHouse')) max += 2 * buildings['house'].count;
            if (isPondered('biggerTeepee')) max += 4 * buildings['teepee'].count;
            if (isPondered('evenBiggerShelter')) max += 1 * buildings['shelter'].count;

            if (hasPrestige('maxClones')) max += 1 * getLevelOfPrestige('maxClones');
        }

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

