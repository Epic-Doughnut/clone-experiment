const { buildings } = require('./json/buildings');
const { recalculateBuildingCost } = require('./buildings');
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
            for (let b in buildings) {
                recalculateBuildingCost(b, buildings, hasPerk);

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
    selectCorrectPerkButton(abilityName);

    // myPerks.push(abilityName);
}
/**
 * 
 * @param {string} abilityName 
 */
function selectCorrectPerkButton(abilityName) {
    // Disable all buttons
    let buttons = document.querySelectorAll('.tierOneButton');
    buttons.forEach(button => {
        button.setAttribute('disabled', 'true');
    });

    // Enable and highlight the selected button
    let selectedButton = document.querySelector('.tierOneButton[onclick="selectAbility(\'' + abilityName + '\')"]');
    console.log(selectedButton, abilityName);
    selectedButton.removeAttribute('disabled');
    selectedButton.classList.add('selected');
}


module.exports = {
    hasPerk,
    addPerk,
    selectCorrectPerkButton,
    selectAbility,
    getPerkFromTier,
    getAllPerks
};