const { buildings } = require('./json/buildings');
const { perks } = require('./json/perks');
let myPerks = [];

/**
 * 
 * @param {string} perkName 
 * @returns boolean
 */
function hasPerk(perkName) {
    return myPerks.includes(perkName);
}

function getAllPerks() {
    return myPerks;
}
/**
 * 
 * @param {string} perkName Perk to add
 */
function addPerk(perkName) {
    myPerks.push(perkName);

    // Do all the one-time updates
    switch (perkName) {
        case 'Architect':
            const buildings = require('./json/buildings').buildings;
            for (let b of Object.keys(buildings)) {
                require('./recalculateBuildingCost').recalculateBuildingCost(b);

            }
            break;
        default:
            break;
    };
}

/**
 * 
 * @param {Number} tierNum 
 */
function getPerkFromTier(tierNum) {
    for (let perk in perks['tier' + tierNum]) {
        if (hasPerk(perk)) return perk;
    }

    // No perk for this tier
    return '';
}


function selectAbility(abilityName) {
    if (hasPerk(abilityName)) return;

    let confirmSelection = window.confirm("Do you want to select " + abilityName + "? This decision cannot be easily changed.");

    if (!confirmSelection) return;
    addPerk(abilityName);

    // for (let i = 1; i <= 1; ++i)
    require('./selectCorrectPerkButton').selectCorrectPerkButton(abilityName);

    // myPerks.push(abilityName);
}

function resetPerks() {
    myPerks = [];
}

module.exports = {
    hasPerk,
    addPerk,
    selectAbility,
    getPerkFromTier,
    getAllPerks,
    resetPerks
};