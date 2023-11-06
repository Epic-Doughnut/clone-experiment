// DEPENDS ON: json/buttons.js
const { capitalizeFirst } = require('./capitalizeFirst');
const { ponders } = require('./json/ponder');
const { getMaterial } = require('./getMaterial');

const { resources } = require('./json/resources');
const { buttons } = require('./json/buttons');

function isPondered(id) {
    // Check if the id exists in the unlocks map
    // If the id doesn't exist in the map, return false

    return ponders[id] ? ponders[id].isPondered : false;

}

function canUnlock(unlockId) {
    // Get the key from this id
    // console.log('can unlock? ', unlockId);
    var unlockKey = '';
    for (let unlock in ponders) {
        if (ponders[unlock].id === unlockId) {
            unlockKey = unlock;
        }
    }

    if (unlockKey === '') {
        console.warn("invalid unlock id: ", unlockId);
        return false;
    }
    // Check if we have enough resources
    var canBuy = true;
    for (let material in ponders[unlockKey].cost) {
        if (getMaterial(material, resources) < ponders[unlockKey].cost[material]) {
            // console.log("Cannot unlock " + unlockId);
            canBuy = false;
            break;
        }
    }

    // console.log('can we unlock ', unlockId, canBuy);
    return canBuy;
}


function generatePonderButtons(ponderObjects) {
    // const generatedButtons = {};

    for (const [ponderKey, ponderObj] of Object.entries(ponderObjects)) {

        const buttonKey = `ponder${capitalizeFirst(ponderKey)}`; // e.g. ponderFishing

        // let tooltipCost = Object.entries(ponderObj.cost).map(([material, amount]) => `${amount.toFixed(0)} ${material}`).join('<br>');
        let tooltipCost = require('./resources').generateTooltipCost(ponderObj.cost);
        buttons[buttonKey] = {
            class: 'tooltip unlock',
            text: ponderObj.text || 'Ponder a Mystery?',
            tooltipDesc: ponderObj.tooltipDesc || "Who knows what you'll discover",
            tooltipCost: tooltipCost,
            tab: 'ponder',
            unlock: ponderKey,
            requirement: () => {
                return require('./helper').getMax('ponder') >= ponders[ponderKey].cost['ponder'] / 2;

            },
            hide: () => isPondered(ponderKey)
        };

        // console.log(buttonKey, buttons[buttonKey]);

    }

    // return generatedButtons;
}


module.exports = {
    canUnlock,
    isPondered,
    generatePonderButtons
};