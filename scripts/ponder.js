// DEPENDS ON: json/buttons.js

function isPondered(id) {
    // Check if the id exists in the unlocks map
    // If the id doesn't exist in the map, return false

    return ponders[id] ? ponders[id].isPondered : false;

}
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
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
    // Check if we have enough resources
    var canBuy = true;
    for (let req of ponders[unlockKey].cost) {
        if (getMaterial(req.material) < req.amount) {
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

        buttons[buttonKey] = {
            class: 'tooltip unlock',
            text: ponderObj.text,
            tooltipDesc: ponderObj.tooltipDesc,
            tooltipCost: ponderObj.tooltipCost,
            tab: 'ponder',
            unlock: ponderKey,
            requirement: () => {
                if (Array.isArray(ponderObj.cost)) {
                    return ponderObj.cost.every(cost => getMaterial(cost.material) >= cost.amount);
                } else {
                    return getMaterial(ponderObj.cost.material) >= ponderObj.cost.amount;
                }
            },
            hide: () => isPondered(ponderKey)
        };

        console.log(buttonKey, buttons[buttonKey]);

    }

    // return generatedButtons;
}

// Call the function to generate and add ponder buttons to the 'buttons' map
const ponderButtons = generatePonderButtons(ponders);

