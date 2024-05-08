/**
 * Select the perk button that we've chosen and disable the others
 * @param {string} abilityName Name of the chosen perk
 */
function selectCorrectPerkButton(abilityName)
{
    // Disable all buttons
    let buttons = document.querySelectorAll('.tierOneButton');
    let selectedButton;
    try { selectedButton = document.querySelector(`#${abilityName}Perk`); }
    catch (error) { }
    if (selectedButton)
    {
        buttons.forEach(button =>
        {
            button.setAttribute('disabled', 'true');
        });

        // Enable and highlight the selected button
        //console.log(selectedButton, abilityName);
        selectedButton.removeAttribute('disabled');
        selectedButton.classList.add('selected');
    } else
    {
        console.warn('No button found with ability name: ' + abilityName);
    }
}
exports.selectCorrectPerkButton = selectCorrectPerkButton;