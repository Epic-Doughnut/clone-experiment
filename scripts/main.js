const { craftedResources, resetCraftedResources } = require('./json/craftedResources');
const { buildings, resetBuildings } = require("./json/buildings");
const { ponders, resetPonders } = require("./json/ponder");
const { buttons } = require("./json/buttons");
const { resources, resetResources } = require('./json/resources');

const { saveGame, loadGame } = require("./saving");
const { appendCraftedResourceButtons, increaseMaterial, craftAllResources, craftResource, calcIncrease, updateResourceIncreaseRates, increaseMax } = require('./resources');
const { buyMaxBuildings, buyBuilding, } = require('./buildings');
const { selectAbility, resetPerks } = require('./perks');
const { clearSidebar } = require('./helper');
const { makeVisible } = require('./makeVisible');
const { updateButtonVisibility } = require('./updateButtonVisibility');
const { getCraftedResource } = require('./getCraftedResource');
const { getMaterial } = require('./getMaterial');
const { buyFactory, attemptManufacture, upgradeBulk } = require('./factory');
const { isPondered, generatePonderButtons } = require("./ponder");
const { hasTool, addTool } = require('./tools');
const { getAteFish, setAteFish } = require('./ateFish');
const { updateTotal, clearJobAssignments, resetAllJobs } = require('./jobs');
const { capitalizeFirst } = require('./capitalizeFirst');
const { passedStage, resetStages } = require('./stages');
const { recalcMaxClones } = require('./recalcMaxClones');
const { initializeResourceTags, updateSidebar, updateDisplayValue } = require('./sidebar');
const { prestige } = require('./json/prestige');
const { triggerFloatUpText } = require('./triggerFloatUpText');
const { updateBounceAnimation } = require('./updateBounceAnimation');
const { updateTooltip, hideTooltip } = require('./updateTooltip');
const { canCraft } = require('./canCraft');
const { calculateWinChance, combat, switchStance } = require('./combat');
const { showTab, getCurrentTab } = require('./showTab');
const { getSfxVolume, getMusicVolume, setMusicVolume, setSfxVolume } = require('./audio');
const { generateRandomBuilding } = require('./generateRandomBuilding');
const { changeMessage, messageElement } = require('./changeMessage');
const { generateButtons } = require('./generateButtons');
const { toggleResource } = require('./gathering');



function setTotalTime(time) {
    total_time = time;
}





const toolsToStages = {
    'SharpRocks': 'craftRocks',
    'Spear': 'fishing',
    "FishingRod": 'fishing',
    'Axe': 'wood',
    "Pickaxe": 'ore'
};

// Update visibility of assets
const visibilityRules = [
    {
        condition: () => getMaterial("sticks", resources) >= 1,
        action: () => makeVisible("stick")
    },
    {
        condition: () => getMaterial('sticks', resources) >= 10,
        action: () => makeVisible('vines')
    },
    {
        condition: () => getMaterial('vines', resources) >= 10,
        action: () => makeVisible('rocks')
    },
    {
        condition: () => getMaterial("rocks", resources) >= 1,
        action: () => { makeVisible("tab-button"); makeVisible('craftRocks'); }
    },
    {
        condition: () => getCraftedResource('spear', craftedResources) > 0,
        action: () => makeVisible('spear')
    },

    {
        condition: () => getMaterial("fish", resources) >= 1,
        action: () => makeVisible('fishing')
    },

    {
        condition: () => hasTool("Axe"),
        action: () => makeVisible('wood')
    },
    {
        condition: () => getCraftedResource('rope') >= 1,
        action: () => makeVisible('rope')
    },

    {
        condition: () => getMaterial('fish', resources) >= 5 && !getAteFish(),
        action: () => makeVisible('eatFish')
    },
    {
        condition: () => getAteFish(),
        action: () => { makeVisible('clone'); makeVisible('ponder-tab'); }
    },
    {
        condition: () => isPondered('ponderFinish'),
        action: () => navigateTo('stage2.html')
    },
    {
        condition: () => isPondered('biggerShelter'),
        action: () => recalcMaxClones()
    },
    {
        condition: () => isPondered('biggerHut'),
        action: () => recalcMaxClones()
    },
    {
        condition: () => isPondered('biggerHouse'),
        action: () => recalcMaxClones()
    },
    {
        condition: () => isPondered('biggerTeepee'),
        action: () => recalcMaxClones()
    },
    {
        condition: () => isPondered('evenBiggerShelter'),
        action: () => recalcMaxClones()
    },
    {
        condition: () => getMaterial('clones') >= 40,
        action: () => makeVisible('prestige')
    },
    {
        condition: () => getMaterial('clay') > 0,
        action: () => makeVisible('clay')
    },
    {
        condition: () => !document.getElementById('toggle-basics') && isPondered('organization'),
        action: () => initializeResourceTags(true)
    },
    {
        condition: () => passedStage('combatTab'),
        action: () => calculateWinChance()
    }
];

function render() {

    for (let i = visibilityRules.length - 1; i >= 0; i--) {
        const rule = visibilityRules[i];
        if (rule.condition()) {
            rule.action();
            // Remove the rule from the array
            visibilityRules.splice(i, 1);
        }
    }

    for (let tool in toolsToStages) {
        if (!hasTool(tool) && getCraftedResource(tool) > 0) {
            addTool(tool);
            makeVisible(toolsToStages[tool]);
        }
    }

    try {
        updateButtonVisibility();
        // updateBounceAnimation();
        if (currentHoverButton !== null) updateTooltip(currentHoverButton);
    } catch (err) {
        console.warn(err);
    }

}


// MUSIC MANAGER

const audioFiles = [
    './audio/song1.wav',
    './audio/song2.wav',
    './audio/song3.wav',
    './audio/song4.wav',
    './audio/song5.wav',
    './audio/song6.wav',
    './audio/song7.wav',
    './audio/song8.wav',
    './audio/song9.wav',
    './audio/song10.wav',

];

let currentAudio = null;
let timeoutId = null;

function playRandomTrack() {
    // Stop current audio if playing
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }

    // Select a random track
    const randomIndex = Math.floor(Math.random() * audioFiles.length);
    currentAudio = new Audio(audioFiles[randomIndex]);
    currentAudio.volume = getMusicVolume();
    // Play the selected track
    currentAudio.play();

    // Schedule the next track
    scheduleNextTrack();
}

function scheduleNextTrack() {
    // Clear any existing timeout
    if (timeoutId) {
        clearTimeout(timeoutId);
    }

    // When the current track ends, wait for up to 30 seconds before playing the next
    const silenceDuration = Math.random() * 30000 + 5000; // Random silence duration 5 - 35 seconds
    currentAudio.onended = () => {
        timeoutId = setTimeout(playRandomTrack, silenceDuration);
    };
}

/* HOTKEYS */
document.addEventListener('keydown', function (event) {
    switch (event.key) {
        case '1':
            showTab('productionTab');
            break;
        case '2':
            if (passedStage('tab-button')) showTab('experimentTab');
            break;
        case '3':
            if (passedStage('ponder-tab')) showTab('ponderTab');
            break;
        case '4':
            if (passedStage('jobs-tab')) showTab('jobsTab');
            break;
        case '5':
            if (passedStage('skillsTable')) showTab('skillsTab');
            break;
        case '6':
            if (passedStage('perksTab')) showTab('perksTab');
            break;
        case '7':
            if (passedStage('factoryTab')) showTab('factoryTab');
            break;
        case '8':
            if (passedStage('combatTab')) showTab('combatTab');
            break;
        case 'a':
            if (getCurrentTab() === 'combatTab') switchStance('aggressive');
            break;
        case 'b':
            if (getCurrentTab() === 'combatTab') switchStance('balanced');
            break;
        case 'c':
            if (getCurrentTab() === 'combatTab') switchStance('careful');
            break;
        case 'f':
            // @ts-ignore
            if (getCurrentTab() === 'combatTab' && !document.getElementById('startCombat').disabled) combat();
            else toggleResource('fish');
            break;
        case 's':
            toggleResource('sticks');
            break;
        case 'r':
            if (passedStage('rocks')) toggleResource('rocks');
            break;
        case 'v':
            if (passedStage('vines')) toggleResource('vines');
            break;
        case 'w':
            if (passedStage('wood')) toggleResource('wood');
            break;
        case 'o':
            if (passedStage('ore')) toggleResource('ore');
            break;
        case 'p':
            if (passedStage('ponder-tab')) toggleResource('ponder');
            break;
        case 'Escape':
            toggleOptions();
            break;
        default:
            break;
    }
});





/* DARK MODE */
// const darkModeToggle = document.getElementById("darkModeToggle");
const body = document.body;
body.classList.toggle('dark-mode');
// @ts-ignore
// darkModeToggle.classList.toggle('dark');
let isDark = true;


/* CUTSCENES */

// @ts-ignore
// @ts-ignore
function eatFish() {
    if (!getAteFish() && getMaterial('fish', resources) >= 1) {
        // eat a fish and blackout
        const fishAudio = new Audio('./audio/fish.wav');
        fishAudio.volume = getSfxVolume();
        fishAudio.play();
        // @ts-ignore
        increaseMaterial('fish', -1);
        // Call this function to start the sequence
        fadeToBlack();
        // Hide fish button
        setAteFish(true);
        const fishButton = document.querySelector("#eatFish");
        // @ts-ignore
        fishButton.style.display = 'none';
        setTimeout(() => {
            changeMessage("You are with yourself in a forest.", 'with yourself', 'You feel peckish for some seafood.');
            increaseMax('clones', 1);
            increaseMaterial('clones', 1);
        }, 1000); // delay of 1s

    }
}


function fadeToBlack() {
    const overlay = document.getElementById('overlay');
    const overlayText = document.getElementById('overlay-text');
    const overlayButton = document.getElementById('overlay-button');

    // @ts-ignore
    overlay.style.display = 'flex';

    setTimeout(() => {
        // @ts-ignore
        overlayText.style.opacity = '1';
    }, 2000);

    setTimeout(() => {
        // @ts-ignore
        overlayButton.style.display = 'block';
        overlayButton.style.opacity = '1';
    }, 5000);
}

function hideOverlay() {
    const overlayText = document.getElementById('overlay-text');
    overlayText.style.opacity = '0';

    const overlayButton = document.getElementById('overlay-button');
    overlayButton.style.opacity = '0';

    const overlay = document.getElementById('overlay');
    overlay.style.display = 'none';

    const isekaiButtons = document.getElementById('isekaiButtons');
    // isekaiButtons.childNodes.forEach(child => isekaiButtons.removeChild(child));
    isekaiButtons.innerHTML = '';
    location.reload();
}

function navigateTo(url) {
    // Trigger the overlay to fade in
    var overlay = document.getElementById('page-transition-overlay');
    overlay.classList.add('fade-in');

    // Wait for the fade in to complete before changing the page
    setTimeout(function () {
        window.location.href = url;
    }, 300); // This duration should match the CSS opacity transition
}

function getMessage() {
    return messageElement;
}
function getMessageTooltip() {
    return messageElement.querySelector("#alone").getAttribute('tooltipDesc');
}

/* GAME LOOP */


let milliseconds_per_frame = 50;
let last_time = null;
let total_time = 0;
let accumulated_lag = 0;


function loop(current_time) {
    if (last_time === null) last_time = current_time;

    const delta_time = current_time - last_time;

    total_time += delta_time;
    accumulated_lag += delta_time;

    last_time = current_time;

    // Catch up all the missed ticks
    let normalRate = milliseconds_per_frame;
    // simulate with less fidelity to make up time
    // while (accumulated_lag >= 100 * milliseconds_per_frame) {
    //     milliseconds_per_frame *= 100;
    // }
    if (accumulated_lag >= 10 * milliseconds_per_frame) {
        milliseconds_per_frame = accumulated_lag / 10;
    }
    while (accumulated_lag >= milliseconds_per_frame) {

        accumulated_lag -= milliseconds_per_frame;
        update(milliseconds_per_frame, total_time);
    }

    milliseconds_per_frame = normalRate;
    requestAnimationFrame(loop);
}


let time_since_last_save = 0;
let time_since_manufature = 0;
function update(delta_time, total_time) {

    // @ts-ignore
    // @ts-ignore
    for (const [key, val] of Object.entries(resources)) {
        // console.log("updating " + key);

        increaseMaterial(key, calcIncrease(key, delta_time));
    }

    updateResourceIncreaseRates();
    render();

    // Save the game every 10 seconds
    time_since_last_save += delta_time;
    time_since_manufature += delta_time;
    total_time += delta_time;
    if (time_since_last_save >= 10000) {
        saveGame();
        time_since_last_save = 0;
    }

    // Manufacture every second
    if (passedStage('factoryTab') && time_since_manufature >= 1000) {
        attemptManufacture();
        time_since_manufature = 0;
    }

}

// window.setInterval(render, 100) // Update visuals 10 times per second
// window.setInterval(tick, 1000); // Every tick lasts for 1 second
// window.setInterval(saveGame, 10000); // Save the game every 10 seconds
window.onbeforeunload = function () {
    // We use a function rather than shorthand because savegame returns a string
    if (!currentlyDeleting) saveGame();
};


// const myResources = {};

// document.getElementById("addResourceBtn").addEventListener("click", function () {
//     document.getElementById("resourceForm").style.display = "block";
// });

// @ts-ignore
// @ts-ignore
function addResource() {
    // @ts-ignore
    const resourceName = document.getElementById("resourceName").value;
    // @ts-ignore
    const activeText = document.getElementById("resourceActiveText").value;
    // @ts-ignore
    const defaultText = document.getElementById("resourceDefaultText").value;

    // @ts-ignore
    const btnText = document.getElementById("btnText").value;
    // @ts-ignore
    const btnTooltipDesc = document.getElementById("btnTooltipDesc").value;
    // @ts-ignore
    const btnTooltipCost = document.getElementById("btnTooltipCost").value;

    // @ts-ignore
    var newResource = myResources[resourceName] = {
        value: 0,
        id: "gather" + resourceName,
        isGetting: false,
        activeText: activeText,
        defaultText: defaultText,
        // ... Add other attributes as fetched from form ...
    };

    // Create the button object
    var newButton = buttons["gather" + resourceName.charAt(0).toUpperCase() + resourceName.slice(1)] = {
        class: 'tooltip ',
        tab: 'production',
        text: btnText,
        tooltipDesc: btnTooltipDesc,
        tooltipCost: btnTooltipCost,
        requirement: () => true // By default, making this always visible. Modify as needed.
    };

    console.log(newResource);
    console.log(newButton);

    // Hide form once resource is added
    // @ts-ignore
    document.getElementById("resourceForm").style.display = "none";

    // Optionally, you can update the UI to show the added resource
    // updateUI(resourceName);
}

function updateUI(resourceName) {
    // Here you can create a new DOM element to display the added resource
    const resourceDiv = document.createElement("div");
    resourceDiv.innerHTML = `${resourceName}: ${resources[resourceName].value}`;

    // Append to some container
    document.body.appendChild(resourceDiv);
}



function toggleOptions() {
    const optionAudio = new Audio('./audio/options.wav');
    optionAudio.volume = getSfxVolume();
    optionAudio.play();

    const optionsMenu = document.getElementById('optionsMenu');
    optionsMenu.style.display = optionsMenu.style.display === 'none' ? 'block' : 'none';
}


let currentlyDeleting = false;

// After all has been loaded
// @ts-ignore
// @ts-ignore
document.addEventListener('DOMContentLoaded', (event) => {
    generatePonderButtons(ponders);
    // appendCraftedResourceButtons();
    generateButtons(); // Call this once on page load or game initialization
    makeFactoryButtons();

    initializeResourceTags();

    loadGame();

    clearSidebar();
    initializeResourceTags(isPondered('organization')); // check if we need groups

    appendCraftedResourceButtons();

    updateSidebar();

    showTab('productionTab');
    require('./trade').generateTradeTable(resources);


    // for (let i = 0; i < 30; ++i)
    //     console.log(generateRandomBuilding());

    function getRKeyFromID(id) {
        for (const [r, val] of Object.entries(resources)) {
            // console.log(resources[r].id, id);
            if (val.id === id) return r;
        }
        return 'error ' + id;
    }
    function getCRKeyFromID(id) {
        for (const [r, val] of Object.entries(craftedResources)) {
            console.log(r, val, id);
            if (val.id === id) return r;
        }
        return 'error ' + id;
    }


    document.addEventListener("click", (event) => {
        // Start the music playback
        // We need to wait for a click https://developer.chrome.com/blog/autoplay/
        if (currentAudio === null) playRandomTrack();
        // @ts-ignore
        if (event.target.matches("button")) {


            // one of our buttons was clicked
            const button = event.target;
            // console.log('clicked', button);

            // Update tooltips 
            // if (button.classList.contains('tooltip')) updateTooltip(button);
            // updateTooltip(button);

            // BUILDING BUTTONS
            // @ts-ignore
            if (button.getAttribute('data_building') && button.getAttribute('data_building') !== 'undefined' && button.classList.contains('purchasable')) {

                // @ts-ignore
                var building = button.getAttribute('data_building');
                const x = event.pageX;
                const y = event.pageY;

                let buildingAudio = new Audio('./audio/building.wav');
                buildingAudio.volume = getSfxVolume();
                buildingAudio.play();

                const buildingString = capitalizeFirst(building).split('_').join(' ');
                if (event.shiftKey) {
                    let count = buyMaxBuildings(building);
                    triggerFloatUpText(x, y, `+${count} ${buildingString}s`, 'aqua');
                } else {
                    buyBuilding(building);
                    triggerFloatUpText(x, y, `+1 ${buildingString}`, 'aqua');
                }

            }
            // PONDER BUTTONS
            // @ts-ignore
            else if (button.classList.contains('unlock')) {
                // @ts-ignore
                const unlockAttr = button.getAttribute('unlock');
                // console.log('click');
                console.log(unlockAttr);
                if (ponders[unlockAttr]) {
                    var canUnlock = true;
                    for (let material in ponders[unlockAttr].cost) {
                        if (getMaterial(material, resources) < ponders[unlockAttr].cost[material]) {
                            // console.log("Cannot unlock " + unlockAttr);
                            canUnlock = false;
                            break;
                        }
                    }

                    if (canUnlock) {
                        for (let material in ponders[unlockAttr].cost) {
                            increaseMaterial(material, -ponders[unlockAttr].cost[material]);
                        }
                        ponders[unlockAttr].isPondered = true;
                        makeVisible(unlockAttr);
                        // document.querySelector("#" + resourceKey + "Value").textContent = craftedResources[resourceKey].value.toFixed(2);
                        // make this button disappear
                        // @ts-ignore
                        button.display = 'none';

                        let ponderAudio = new Audio('./audio/ponder.wav');
                        ponderAudio.volume = getSfxVolume();
                        ponderAudio.play();


                        // console.log("Unlocking " + unlockAttr);
                        // Refresh the page when buying organized storage to generate the groups
                        if (unlockAttr === 'organization') location.reload();
                    }
                }

            }
            // OTHER BUTTONS
            // @ts-ignore
            else if (button.id !== 'undefined') {
                // console.log(button);
                // @ts-ignore
                if (button.id.slice(0, 6) === "gather") toggleResource(getRKeyFromID(button.id));

                // @ts-ignore
                else if (button.id.slice(0, 5) === 'craft') {
                    let craftAudio = new Audio('./audio/craft.wav');
                    craftAudio.volume = getSfxVolume();
                    craftAudio.play();

                    // @ts-ignore
                    let cr = getCRKeyFromID(button.id);
                    console.log('clicked cr: ', cr);
                    if (canCraft(cr)) triggerFloatUpText(event.pageX, event.pageY, `+${cr}`, 'aqua');
                    if (event.shiftKey) craftAllResources(cr);
                    else craftResource(cr);

                }

                // @ts-ignore
                else if (button.id === 'saveButton') saveGame();

                // @ts-ignore
                else if (button.id === 'eatFish') eatFish();

                // @ts-ignore
                else if (button.id === 'overlay-button') hideOverlay();

                // @ts-ignore
                else if (button.id === 'deleteSaveButton' && confirm("Are you sure you want to delete your save data? This will reset all your progress.")) {
                    deleteGame();
                }
                // @ts-ignore
                else if (button.id === 'clearJobAssignments') clearJobAssignments();
                // @ts-ignore
                else if (button.id === 'darkModeToggle') {
                    body.classList.toggle('dark-mode');
                    // @ts-ignore
                    darkModeToggle.classList.toggle('dark');
                    isDark = !isDark;
                    // @ts-ignore
                    darkModeToggle.textContent = isDark ? "Light Mode" : "Dark Mode";

                }

                // @ts-ignore
                else if (button.id === 'prestige') {
                    isekai();
                }
                // @ts-ignore
                else if (button.id === 'startCombat') {
                    combat();
                }
            }

            // @ts-ignore
            if (button.classList.contains('tierOneButton')) {
                // @ts-ignore
                let perk = button.textContent;
                selectAbility(perk);
            }

        }

        // @ts-ignore
        if (event.target.matches("#alone")) {
            // increaseMaterial('clones', 1);
            let text = '+1 Clone';

            // Hardcoded instead to avoid increase affected by productivity bonuses
            if (resources['clones'].value < resources['clones'].max) { resources['clones'].value += 1; }
            else text = 'Max Clones';

            const cloneAudio = new Audio(text === '+1 Clone' ? './audio/clone.wav' : './audio/failclone.wav');
            cloneAudio.volume = getSfxVolume();
            cloneAudio.play();

            const x = event.pageX; // X coordinate of the click
            const y = event.pageY; // Y coordinate of the click
            const color = text === '+1 Clone' ? 'green' : 'red';
            triggerFloatUpText(x, y, text, color);
            updateTotal();
            updateDisplayValue('clones');
        }
    });

    function makeFactoryButtons() {
        const factoryButtons = document.querySelector('#factoryButtons');

        const buyFactoryButton = document.createElement('button');
        buyFactoryButton.classList.add('tooltip');
        buyFactoryButton.id = 'buyFactoryButton';
        buyFactoryButton.textContent = 'Buy New Factory';
        buyFactoryButton.setAttribute('data-tooltip-desc', 'The factory must grow!');
        buyFactoryButton.setAttribute('tooltipCost', '50 silver');
        factoryButtons.appendChild(buyFactoryButton);

        buyFactoryButton.addEventListener("click", () => {

            console.log('buying factory');
            buyFactory();
        });

        const upgradeBulkButton = document.createElement('button');
        upgradeBulkButton.classList.add('tooltip');
        upgradeBulkButton.id = 'upgradeBulkButton';
        upgradeBulkButton.textContent = 'Upgrade Bulk';
        upgradeBulkButton.setAttribute('data-tooltip-desc', 'Craft more resources per second');
        upgradeBulkButton.setAttribute('tooltipCost', '2 → 4: 30 silver');
        factoryButtons.appendChild(upgradeBulkButton);

        upgradeBulkButton.addEventListener("click", () => {
            console.log('upgrading bulk');
            upgradeBulk();
        });



    }

    // Options menu
    document.getElementById('optionsButton').addEventListener('click', toggleOptions);


    document.getElementById('musicVolume').addEventListener('input', function () {
        // @ts-ignore
        setMusicVolume(this.value);
        currentAudio.volume = getMusicVolume();
    });

    document.getElementById('sfxVolume').addEventListener('input', function () {
        // @ts-ignore
        setSfxVolume(this.value);
    });




    requestAnimationFrame(loop);

    // Sample usage:
    document.querySelectorAll('.tooltip').forEach(button => {
        // console.log(button);
        // Extract the data from your building or any other data - source
        // const content = "Your tooltip content here";

        // @ts-ignore
        // @ts-ignore
        button.addEventListener('mouseenter', function (e) {
            updateTooltip(button);
            currentHoverButton = button;
        });


        // TODO: move this event listener
        button.addEventListener('onclick', function () {
            updateTooltip(button);
        });

        button.addEventListener('mouseleave', function () { hideTooltip(); currentHoverButton = null; });
    });

    // Update the jobs counter
    updateTotal();
    updateBounceAnimation();



});



function nextFibonacci(n) {
    let a = n * (1 + Math.sqrt(5)) / 2.0;
    return Math.round(a);
}

function prevFibonacci(n) {
    let a = n / ((1 + Math.sqrt(5)) / 2.0);
    return Math.round(a);
}

const overlay = document.getElementById('overlay');
const overlayText = document.getElementById('overlay-text');
const overlayButton = document.getElementById('overlay-button');
const overlayBackButton = document.getElementById('overlay-back-button'); // Get the "Go Back" button
function isekai() {

    overlayButton.addEventListener('click', () => {
        const husksDue = getMaterial('clones');

        // Reset functions to be executed when "Continue" is clicked
        resetResources();
        resetCraftedResources();
        resetPonders();
        resetPerks();
        resetBuildings();
        resetAllJobs();
        resetStages();


        const isekaiConfirmAudio = new Audio('./audio/isekaiconfirm.wav');
        isekaiConfirmAudio.volume = getSfxVolume();
        isekaiConfirmAudio.play();

        // Set max of all resources to 100
        // @ts-ignore
        // @ts-ignore
        for (let [r, val] of Object.entries(resources)) {
            val.max = 100;
        }

        // Give husks afterwards
        increaseMaterial('husks', husksDue);


        // Close the overlay
        overlay.style.display = 'none';

        // location.reload();
        let lastBuilding = null;
        const newBuildingsCount = 5;
        for (let i = 0; i < newBuildingsCount; i++) {
            const randomBuilding = generateRandomBuilding();
            buildings[randomBuilding.name.split(' ').join('_')] = randomBuilding;
            lastBuilding = randomBuilding;
        }
        changeMessage('You are in another world.', 'another', `You feel a need to acquire ${lastBuilding.cost}`);
        initializeResourceTags(false);
    });

    overlayBackButton.addEventListener('click', () => {
        // Just close the overlay without executing reset functions
        overlay.style.display = 'none';
    });

    const isekaiAudio = new Audio('./audio/isekai.wav');
    isekaiAudio.volume = getSfxVolume();
    isekaiAudio.play();

    // Convert clones to husks
    const oldHuskValue = document.getElementById('husksIsekaiValue');
    let huskValue;
    if (oldHuskValue) huskValue = oldHuskValue;
    else huskValue = document.createElement('p');
    huskValue.id = 'husksIsekaiValue';
    huskValue.innerHTML = `Husks:  ${getMaterial('husks')} <br> You will get ${getMaterial('clones')} Husks post-isekai.<br>You will receive 5 randomly generated new buildings, unique to this new world.`;

    huskValue.style.opacity = '0';
    overlay.prepend(huskValue);
    // Overlay
    overlay.style.backgroundColor = 'MidnightBlue';
    overlayText.textContent = 'You step through to another world.';

    fadeToBlack();

    setTimeout(() => {
        // @ts-ignore
        overlayBackButton.style.opacity = '1';
    }, 5000);

    function createPrestigeButtons() {

        const buttonContainer = document.getElementById('isekaiButtons');
        let i = 1;
        Object.keys(prestige).forEach(key => {
            const button = document.createElement('button');
            button.innerHTML = `<b>${prestige[key].text}</b><br>Level: ${prestige[key].level}<br>Cost: ${prestige[key].cost}`;
            button.setAttribute('tooltipCost', prestige[key].cost);
            button.setAttribute('tooltipDesc', prestige[key].tooltipDesc);
            button.classList.add('tooltip'); // Add a class for styling if needed
            button.style.gridColumn = (i % 4 + 1).toString();
            button.style.gridRow = Math.floor(i / 4 + 1).toString();
            ++i;
            // Optional: Add an event listener if you want to handle clicks
            button.addEventListener('click', () => {
                // You can implement what happens when the button is clicked
                console.log(`Button ${key} was clicked`);
                if (getMaterial('husks') < prestige[key].cost) return;
                prestige[key].level++;
                increaseMaterial('husks', -prestige[key].cost);
                prestige[key].cost = nextFibonacci(prestige[key].cost);
                button.setAttribute('tooltipCost', prestige[key].cost);

                button.innerHTML = `<b>${prestige[key].text}</b><br>Level: ${prestige[key].level}<br>Cost: ${prestige[key].cost}`;
                huskValue.textContent = 'Husks: ' + getMaterial('husks');
                updateTooltip(button);
            });
            // Right-click to decrease level
            button.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                // You can implement what happens when the button is clicked
                console.log(`Button ${key} was right clicked`);
                if (prestige[key].level <= 0) return;
                prestige[key].level--;
                prestige[key].cost = prevFibonacci(prestige[key].cost);
                button.setAttribute('tooltipCost', prestige[key].cost);
                increaseMaterial('husks', prestige[key].cost);

                button.innerHTML = `<b>${prestige[key].text}</b><br>Level: ${prestige[key].level}<br>Cost: ${prestige[key].cost}`;
                huskValue.textContent = 'Husks: ' + getMaterial('husks');
                updateTooltip(button);

            });
            buttonContainer.appendChild(button);


            // console.log(button);
            // Extract the data from your building or any other data - source
            // const content = "Your tooltip content here";

            // @ts-ignore
            // @ts-ignore
            button.addEventListener('mouseenter', function (e) {
                updateTooltip(button);
                currentHoverButton = button;
            });



            button.addEventListener('mouseleave', function () { hideTooltip(); currentHoverButton = null; });

        });
    }

    // Call the function to create buttons
    setTimeout(createPrestigeButtons, 5000);
    setTimeout(() => { huskValue.style.opacity = '1'; }, 5000);

}

var currentHoverButton = null;

module.exports = {

    updateUI,
    setTotalTime,
    changeMessage,

    getMessage,
    total_time,
    currentHoverButton,
    deleteGame,
    isekai,
    getMessageTooltip
};
function deleteGame() {
    localStorage.removeItem('save'); currentlyDeleting = true; location.reload();
}

// @ts-ignore
window.deleteGame = deleteGame;
// @ts-ignore
window.isekai = isekai;