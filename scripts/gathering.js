const { resources } = require('./json/resources');
const { capitalizeFirst } = require('./capitalizeFirst');
const { getSfxVolume } = require('./audio');

/* GATHERING MATERIALS*/
const sidebarParent = document.querySelector("#resources");
function stopAllGathering() {
    for (const [key, val] of Object.entries(resources)) {
        val.isGetting = false;
        const rButton = document.querySelector("#gather" + capitalizeFirst(key));
        if (rButton) {
            rButton.textContent = val.defaultText;
            rButton.classList.remove('gathering');
        }

        // Set sidebar to not bold
        const sidebarText = sidebarParent.querySelector('#resource-' + key);
        // @ts-ignore
        if (sidebarText) sidebarText.style.fontWeight = 'normal';

    }
}
const emojiGatherDiv = document.querySelector('#emojiGatherDisplay');
function toggleResource(resourceKey) {

    const gatherAudio = new Audio('./audio/gather.wav');
    gatherAudio.volume = getSfxVolume();
    gatherAudio.play();

    const resource = resources[resourceKey];


    const sidebarParent = document.querySelector("#resources");

    const sidebarText = sidebarParent.querySelector('#resource-' + resourceKey);
    const resourceButton = document.querySelector('#gather' + resourceKey.charAt(0).toUpperCase() + resourceKey.slice(1));
    emojiGatherDiv.textContent = '𓀟'; // Default emoji 𓀟


    if (!resource.isGetting) {
        stopAllGathering(); // Stop all gathering actions
        resource.isGetting = true;
        // @ts-ignore
        resourceButton.textContent = resource.activeText;
        // @ts-ignore
        if (sidebarText) sidebarText.style.fontWeight = 'bold';
        // @ts-ignore
        emojiGatherDiv.textContent = resource.emoji;
        console.log(resource.emoji);
        resourceButton.classList.add('gathering');
    } else {
        resource.isGetting = false;
        resourceButton.classList.remove('gathering');
        // @ts-ignore
        resourceButton.textContent = resource.defaultText;
        // @ts-ignore
        if (sidebarText) sidebarText.style.fontWeight = 'normal';
    }
}
exports.toggleResource = toggleResource;
