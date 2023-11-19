const { craftedResources, resetCraftedResources } = require('./json/craftedResources');
const { buildings, resetBuildings } = require("./json/buildings");
const { ponders, resetPonders } = require("./json/ponder");
const { buttons } = require("./json/buttons");
const { resources, resetResources } = require('./json/resources');

const { saveGame, loadGame } = require("./saving");
const { appendCraftedResourceButtons, increaseMaterial, craftAllResources, craftResource, calcIncrease, updateResourceIncreaseRates, increaseMax } = require('./resources');
const { buyMaxBuildings, buyBuilding, } = require('./buildings');
const { selectAbility, resetPerks } = require('./perks');
const { clearSidebar, getMax } = require('./helper');
const { makeVisible } = require('./makeVisible');
const { updateButtonVisibility } = require('./updateButtonVisibility');
const { getCraftedResource } = require('./getCraftedResource');
const { getMaterial } = require('./getMaterial');
const { buyFactory, attemptManufacture, upgradeBulk, allMaterials } = require('./factory');
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
const { getSfxVolume, getMusicVolume, setMusicVolume, setSfxVolume, playSound } = require('./audio');
const { generateRandomBuilding } = require('./generateRandomBuilding');
const { changeMessage, messageElement } = require('./changeMessage');
const { generateButtons } = require('./generateButtons');
const { toggleResource } = require('./gathering');
const { GameSimulator } = require('./GameSimulator');
const { initializeApp } = require('@firebase/app');
const { getAnalytics } = require('@firebase/analytics');



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
        condition: () => getMaterial('clones') >= 30, // 30 is where rates start to slow down
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


/* GAME LOOP */


let milliseconds_per_frame = 50;
let last_time = null;
let total_time = 0;
let accumulated_lag = 0;
const fidelity = 10;

function loop(current_time) {
    if (last_time === null) last_time = current_time;

    const delta_time = current_time - last_time;

    total_time += delta_time;
    accumulated_lag += delta_time;

    last_time = current_time;

    // Catch up all the missed ticks
    let normalRate = milliseconds_per_frame;

    // simulate with less fidelity to make up time
    if (accumulated_lag >= fidelity * milliseconds_per_frame) {
        milliseconds_per_frame = accumulated_lag / fidelity;
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
const save_rate = 10_000;
const manufacture_rate = 1_000;
function update(delta_time, total_time) {

    for (const [i, key] of Object.entries(allMaterials)) {
        increaseMaterial(key, calcIncrease(key, delta_time));
    }

    updateResourceIncreaseRates();
    render();

    // Save the game every 10 seconds
    time_since_last_save += delta_time;
    time_since_manufature += delta_time;
    total_time += delta_time;
    if (time_since_last_save >= save_rate) {
        saveGame();
        time_since_last_save = 0;
    }

    // Manufacture every second
    if (passedStage('factoryTab') && time_since_manufature >= manufacture_rate) {
        console.log('manufacturing attempt', time_since_manufature, manufacture_rate);
        time_since_manufature = 0;
        attemptManufacture();
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
    playSound('./audio/options.wav', true);

    const optionsMenu = document.getElementById('optionsMenu');
    optionsMenu.style.display = optionsMenu.style.display === 'none' ? 'block' : 'none';
}


let currentlyDeleting = false;

// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// After all has been loaded
document.addEventListener('DOMContentLoaded', (event) => {

    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
        apiKey: "AIzaSyCotsZUfpU3dBSARhviv3oKtlnEyv7e_gk",
        authDomain: "clone-experiment.firebaseapp.com",
        projectId: "clone-experiment",
        storageBucket: "clone-experiment.appspot.com",
        messagingSenderId: "1028768441674",
        appId: "1:1028768441674:web:2bf0906e5a94f5b2400db3",
        measurementId: "G-M45BJLXJFR"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);





    generatePonderButtons(ponders);
    // appendCraftedResourceButtons();

    loadGame(); // Get all new new buildings and add them with buttons
    generateButtons(); // Call this once on page load or game initialization
    makeFactoryButtons();

    initializeResourceTags();

    loadGame(); // Actually load the game

    clearSidebar();
    initializeResourceTags(isPondered('organization')); // check if we need groups

    appendCraftedResourceButtons();

    updateSidebar();

    showTab('productionTab');
    require('./trade').generateTradeTable(resources);


    // for (let i = 0; i < 30; ++i)
    //     console.log(generateRandomBuilding());

    /**
     * Get a resource key from an ID.
     * @param {string} id The id of a resource e.g. gatherGame
     * @returns Resource key e.g. game
     */
    function getRKeyFromID(id) {
        for (const [r, val] of Object.entries(resources)) {
            // console.log(resources[r].id, id);
            if (val.id === id) return r;
        }
        return 'error ' + id;
    }
    /**
     * Get a crafted resource key from an ID.
     * @param {string} id The id of a resource e.g. craftHandle
     * @returns Resource key e.g. handle
     */
    function getCRKeyFromID(id) {
        for (const [r, val] of Object.entries(craftedResources)) {
            console.log(r, val, id);
            if (val.id === id) return r;
        }
        return 'error ' + id;
    }

    // General document click handler
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

                playSound('./audio/building.wav', true);

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

                        playSound('./audio/ponder.wav', true);


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
                    playSound('./audio/craft.wav', true);

                    // @ts-ignore
                    let cr = getCRKeyFromID(button.id);


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
            if (getMaterial('clones') < getMax('clones')) { resources['clones'].value += 1; }
            else text = 'Max Clones';

            playSound(text === '+1 Clone' ? './audio/clone.wav' : './audio/failclone.wav');


            const x = event.pageX; // X coordinate of the click
            const y = event.pageY; // Y coordinate of the click
            const color = text === '+1 Clone' ? 'green' : 'red';
            triggerFloatUpText(x, y, text, color);
            updateTotal();
            updateDisplayValue('clones');
        }
    });

    /**
     * Make factory buttons of buy new factory and buy bulk upgrade.
     */
    function makeFactoryButtons() {
        const factoryButtons = document.querySelector('#factoryButtons');

        const buyFactoryButton = document.createElement('button');
        buyFactoryButton.classList.add('tooltip');
        buyFactoryButton.id = 'buyFactoryButton';
        buyFactoryButton.textContent = 'Buy New Factory';
        buyFactoryButton.setAttribute('data-tooltip-desc', 'The factory must grow!');
        buyFactoryButton.setAttribute('tooltipCost', '50 silver');
        factoryButtons.appendChild(buyFactoryButton);

        // Buy new factory button
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

        // Upgrade bulk button
        upgradeBulkButton.addEventListener("click", () => {
            console.log('upgrading bulk');
            upgradeBulk();
        });



    }

    // Options menu
    document.getElementById('optionsButton').addEventListener('click', toggleOptions);


    // Adjust music volume
    document.getElementById('musicVolume').addEventListener('input', function () {
        // @ts-ignore
        setMusicVolume(this.value);
        currentAudio.volume = getMusicVolume();
    });

    // Adjust sfx volume
    document.getElementById('sfxVolume').addEventListener('input', function () {
        // @ts-ignore
        setSfxVolume(this.value);
    });



    // Start the main gameplay loop
    requestAnimationFrame(loop);

    // Update the tooltip when hovering over a button
    document.querySelectorAll('.tooltip').forEach(button => {

        // Update the tooltip on mouse enter
        button.addEventListener('mouseenter', function (e) {
            updateTooltip(button);
            currentHoverButton = button;
        });


        // TODO: move this event listener
        // Update on onclick for purchases
        button.addEventListener('onclick', function () {
            updateTooltip(button);
        });

        // Hide on mouse leave
        button.addEventListener('mouseleave', function () { hideTooltip(); currentHoverButton = null; });
    });

    // Update the jobs counter
    updateTotal();
    // Update the bounce animation for alone
    updateBounceAnimation();


    // Set clones to max to be nice
    setMaterial('clones', getMax('clones'));

    // const simulator = new GameSimulator();
    // simulator.runSimulation(10_000); // Run the simulation for 3 hours

});


/**
 * Get the next fibonacci number
 * @param {number} n A fibonacci number
 * @returns The fibonacci number after n
 */
function nextFibonacci(n) {
    let a = n * (1 + Math.sqrt(5)) / 2.0;
    return Math.round(a);
}

/**
 * Get the previous fibonacci number
 * @param {number} n A fibonacci number
 * @returns The fibonacci number before n
 */
function prevFibonacci(n) {
    let a = n / ((1 + Math.sqrt(5)) / 2.0);
    return Math.round(a);
}

const overlay = document.getElementById('overlay');
const overlayText = document.getElementById('overlay-text');
const overlayButton = document.getElementById('overlay-button');
const overlayBackButton = document.getElementById('overlay-back-button'); // Get the "Go Back" button
/**
 * The isekai function, called upon clicking the "Isekai" button
 * 
 * Also handles resetting all resources, crafted resources, ponders, perks, buildings, and overall progress.
 */
function isekai() {

    // Handle the isekai itself
    overlayButton.addEventListener('click', () => {
        const husksDue = getMaterial('clones') + getMaterial('husks');

        // Reset functions to be executed when "Continue" is clicked
        resetResources();
        resetCraftedResources();
        resetPonders();
        resetPerks();
        resetBuildings();
        resetAllJobs();
        resetStages();


        playSound('./audio/isekaiconfirm.wav', true);

        // Set max of all resources to 100 (tiny boost)
        for (let [r, val] of Object.entries(resources)) {
            val.max = 100;
        }

        // Give husks afterwards
        increaseMaterial('husks', husksDue);


        // Close the overlay
        overlay.style.display = 'none';

        let lastBuilding = null;
        const newBuildingsCount = 5;
        for (let i = 0; i < newBuildingsCount; i++) {
            const randomBuilding = generateRandomBuilding();
            buildings[randomBuilding.name.split(' ').join('_')] = randomBuilding;
            lastBuilding = randomBuilding;
        }
        changeMessage('You are in another world.', 'another', `You feel a need to acquire ${Object.values(lastBuilding.cost).join(',')}`);
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
    update
};
function deleteGame() {
    localStorage.removeItem('save'); currentlyDeleting = true; location.reload();
}

// @ts-ignore
window.deleteGame = deleteGame;
// @ts-ignore
window.isekai = isekai;