const { buttons } = require('./json/buttons');
const { getCraftedResourceConfigById } = require('./json/craftedResources');
const { getBuildingCount } = require('./json/buildings');
const { isPondered, canUnlock } = require('./ponder');
const { getCraftedResourceKeyByConfig } = require("./json/craftedResources");
const { isButtonIdVisible, canBuyBuilding, setVisibleButton } = require('./helper');
const { canCraft } = require('./canCraft');
const { getMaterial } = require('./getMaterial');
/**
 * Changes the states of buttons between 'hidden', 'purchasable', and 'button-disabled'
 */
function updateButtonVisibility() {
    const selectButtons = document.querySelectorAll('button'); // Adjust the selector accordingly

    selectButtons.forEach(button => {
        const buttonConfig = buttons[button.id]; /* get the button's configuration using its data attribute or ID, etc. */ /* get the button's configuration using its data attribute or ID, etc. *//* get the button's configuration using its data attribute or ID, etc. */ /* get the button's configuration using its data attribute or ID, etc. */;
        if (!buttonConfig) return;
        // console.log(buttonConfig.data_building, buttonConfig.requirement);
        // Reset all states first
        button.classList.remove('hidden', 'purchasable', 'button-disabled');

        var state = 'hidden';

        if (button.id && isButtonIdVisible(button.id)) state = 'button-disabled';

        // If requirement is met, it should be visible
        try {
            // let getMaterial = require('./getMaterial').getMaterial;
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
            // console.warn('Error with checking requirement of button: ', buttonConfig, err);
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
            setVisibleButton(button.id);
            button.style.display = ''; // This will revert it back to its original display state or default (e.g., 'block' or 'inline-block')
        }
    });

    document.querySelectorAll('.job-button').forEach(button => {
        const job = button.getAttribute('data-job');
        button.classList.remove('hidden', 'purchasable', 'button-disabled');

        var state = 'purchasable';
        const reqPonder = (require('./jobRequiredPonders').jobRequiredPonders)[job];
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
            setVisibleButton(button.id);
            button.classList.add(state);
            // @ts-ignore
            button.style.display = ''; // This will revert it back to its original display state or default (e.g., 'block' or 'inline-block')
        }
    });
}
exports.updateButtonVisibility = updateButtonVisibility;