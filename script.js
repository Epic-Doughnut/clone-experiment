// Initialize values
let clones = 0;

let gettingSticks = false;
let gettingVines = false;
let gettingRocks = false;
let gettingWood = false;
let hasSharpRock = false;
let skilled = false;

let lumberjacks = 0;
var lumberjackCost = 10;

// Materials storage
// [name, total]
// let materials = [];

// materials.push(["stick", 0]);
// materials.push(["vine", 0]);
// materials.push(["wood", 0]);
// materials.push(["rock", 0]);

// Price chart
// [name, principle, exponent]
let prices = [];

prices.push(["lumberjacks", 10, 1.1]);


// Tool list
let tools = ["Bare Hands"];

// Get references to the elements
const messageElement = document.querySelector("#message");

const clonesValueElement = document.querySelector('#clonesValue');
const increaseButton = document.querySelector('#increaseButton');

const startElements = document.querySelectorAll(".start");
const stickElements = document.querySelectorAll(".stick");
const woodElements = document.querySelectorAll('.wood');


const assignLumberjack = document.querySelector('#createLumberjackButton');
const lumberjackValueElement = document.querySelector("#lumberjackValue");
const lumberjackCostElement = document.querySelector("#lumberjackCostValue");


function increaseClones(num) {
    clones += num;
    clonesValueElement.textContent = clones;

    if(!woodVisible && clones >= 1) {
        woodElements.forEach(element => element.style.display = 'inline-block');
    }
};




/* GATHERING MATERIALS*/

// Stop all gathering functions
function stopAllGathering() {
    gettingWood = false;
    gettingSticks = false;
    gettingVines = false;
    gettingRocks = false;
    woodToggle.textContent = "Chop Wood";
    stickToggle.textContent = "Gather Sticks";
    vineToggle.textContent = "Gather Vines";
    rockToggle.textContent = "Gather Rocks";
}

// State of each resource
const resources = {
    'wood': {
        isGetting: false,
        button: document.getElementById('gatherWood'),
        activeText: 'Chopping Wood',
        defaultText: 'Chop Wood',
        value: 0
    },
    'sticks': {
        isGetting: false,
        button: document.getElementById('gatherSticks'),
        activeText: 'Gathering Sticks',
        defaultText: 'Gather Sticks',
        value: 0
    },
    'vines': {
        isGetting: false,
        button: document.getElementById('gatherVines'),
        activeText: 'Gathering Vines',
        defaultText: 'Gather Vines',
        value: 0
    },
    'rocks': {
        isGetting: false,
        button: document.getElementById('gatherRocks'),
        activeText: 'Gathering Rocks',
        defaultText: 'Gather Rocks',
        value: 0
    }
};

// Get function for materials
function getMaterial(material){
    if(resources.hasOwnProperty(material)) {
        return resources[material].value;
    } else {
        console.error("Invalid material:", material);  // For debugging
        return -1;
    }
}

function stopAllGathering() {
    for (let key in resources) {
        resources[key].isGetting = false;
        resources[key].button.textContent = resources[key].defaultText;
    }
}

function toggleResource(resourceKey) {
    const resource = resources[resourceKey];
    if (!resource.isGetting) {
        stopAllGathering(); // Stop all gathering actions
        resource.isGetting = true;
        resource.button.textContent = resource.activeText;
    } else {
        resource.isGetting = false;
        resource.button.textContent = resource.defaultText;
    }
}

// Attach event listeners
resources.wood.button.addEventListener('click', () => toggleResource('wood'));
resources.sticks.button.addEventListener('click', () => toggleResource('sticks'));
resources.vines.button.addEventListener('click', () => toggleResource('vines'));
resources.rocks.button.addEventListener('click', () => toggleResource('rocks'));


/* CRAFTING RESOURCES */

const craftedResources = {
    'sharpRocks': {
        id: 'craftRocks',  // Added this so that you can reference the button's ID
        value: 0,
        requires: ['rocks', 2],
        tool: 'Bare Hands'
    },

    'rope': {
        id: 'craftRope',
        value: 0,
        requires: ['vines', 3],
        tool: 'Bare Hands'
    },

    'handle': {
        id: 'craftHandle',
        value: 0,
        requires: ['sticks', 1],
        tool: 'Sharp Rock'
    }
}

// Automatically add event listeners
for (let key in craftedResources) {
    let resource = craftedResources[key];
    let button = document.getElementById(resource.id);
    if (button) {
        button.addEventListener('click', () => craftResource(key));
    }
}


function getCraftedResource(material){
    if(craftedResources.hasOwnProperty(material)) {
        return craftedResources[material].value;
    } else {
        console.error("Invalid crafted resource:", material);  // For debugging
        return -1;
    }
}

// Calculate the final number of crafted goods from bonuses
function calcCraftBonus(resourceKey){
    return 1;
}

// Craft function
function craftResource(resourceKey){
    if(!craftedResources.hasOwnProperty(resourceKey)) {
        console.log("Invalid craft:" + resourceKey)
        return;
    }

    var requirements = craftedResources[resourceKey].requires;
    console.log("Crafting " + requirements[1] + " " + requirements[0] + " into " + calcCraftBonus(resourceKey) + " " + resourceKey);


    if (getMaterial(requirements[0]) >= requirements[1]){
        craftedResources[resourceKey].value += calcCraftBonus(resourceKey);
        increaseMaterial(requirements[0], -requirements[1]);
        document.querySelector("#" + resourceKey + "Value").textContent = craftedResources[resourceKey].value;

    }
}



/* ASSIGNING JOBS */

// Lumberjack 
document.getElementById('createLumberjackButton').addEventListener('click', function() {
    if (clones >= 1 && getMaterial("wood") >= lumberjackCost) {
        clones--;
        increaseMaterial("wood", -lumberjackCost);
        lumberjacks++;
        clonesValueElement.textContent = clones;
        lumberjackValueElement.textContent = lumberjacks;

        let lumberjackPrices = prices.find(item => item[0] === "lumberjacks");

        lumberjackCost = calcCost(lumberjackPrices[1], lumberjackPrices[2], lumberjacks);
        lumberjackCostElement.textContent = lumberjackCost;
    }
});


/* HELPER FUNCTIONS */



// Generic increase
function increaseMaterial(material, num){
    // This check ensures that the material key exists in the resources map.
    if(resources.hasOwnProperty(material)) {
        resources[material].value += num;
        document.querySelector("#" + material + "Value").textContent = resources[material].value;
    } else {
        console.error("Invalid material:", material);  // For debugging
    }

    // resources[material].value += num;
    // document.querySelector("#" + material + "Value").textContent = resources[material].value;

}


/* Calculate the cost of the next building */
function calcCost(principle, exponent, num){
    return Math.floor(principle * Math.pow(exponent, num));
}

/* Check every button to see if it should be enabled */
function checkButtons(){
    // Lumberjacks
    if (clones >= 1 && getMaterial("wood") >= lumberjackCost) {
        assignLumberjack.disabled = false;
    }
    else {
        assignLumberjack.disabled = true;
    }
}

// Make everything with the class "stage" visible
function makeVisible(stage){
    const stageElements = document.querySelectorAll("." + stage);
    stageElements.forEach(element => element.classList.add('visible'));
    stageElements.forEach(element => element.style.display = 'block');

}

// Check the requirements for each stage of the game
function updateVisible(){
    if (getMaterial("sticks") >= 1){ // TODO: Make values larger
        makeVisible("stick");
    }

    if (getMaterial("rocks") >= 1){
        makeVisible("tab-button");
    }

    if (!hasSharpRock && getCraftedResource('sharpRocks') >= 1){
        addTool("Sharp Rock");
        hasSharpRock = true;
    }
}

function addTool(tool){
    var ul = document.getElementById("tools-list");
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(tool));
    ul.appendChild(li);
}

function updateTooltipCosts() {
    // const gatherVinesButton = document.getElementById("gatherVines");
    // const cost = calculateVineCost(); // Some function that determines the cost
    // gatherVinesButton.setAttribute("data-tooltip", "Gather vines. Cost: " + cost + " sticks.");
}

// Call the function when appropriate (e.g., when game state changes)
// updateTooltipCosts();

const skills = {
    gathering: {
        value: 0,
        affectedResources: ['sticks', 'vines']
    },
    masonry: {
        value: 0,
        affectedResources: ['rocks']
    },
    carpentry: {
        value: 0,
        affectedResources: ['wood']
    }
};


function updateSkills(resource){
    for (let skill in skills) {
        if (skills[skill].affectedResources.includes(resource)) {
            skills[skill].value++;
        }
    }
    if (skilled)
    {
        renderSkillBars();
    }
}

function renderSkillBars() {
    const container = document.getElementById('skillsContainer');
    container.innerHTML = ''; // Clear existing bars

    for (let skill in skills) {
        // Create progress bar div
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';

        // Create filled part of progress bar
        const filled = document.createElement('div');
        filled.className = 'filled';
        filled.style.width = `${skills[skill].value}%`; // Assuming value is between 0 and 100

        // Append filled to progressBar and progressBar to container
        progressBar.appendChild(filled);
        container.appendChild(progressBar);
    }
}



/* GAME LOOP */


window.setInterval(function(){
    increaseMaterial("sticks", resources.sticks.isGetting ? 1 : 0);
    increaseMaterial("vines", resources.vines.isGetting ? 1 : 0);
    increaseMaterial("rocks", resources.rocks.isGetting ? 1 : 0);
    increaseMaterial("wood", lumberjacks + (resources.wood.isGetting ? 1 : 0));

    updateVisible();
}, 1000);

// Switch tabs
function showTab(tabName) {
    // Get all content divs and hide them
    let contents = document.querySelectorAll(".tab-content .content");
    for (let content of contents) {
        content.classList.remove("active");
    }

    // Get all tab buttons and remove the active class
    let tabs = document.querySelectorAll(".tab-button");
    for (let tab of tabs) {
        tab.classList.remove("active");
    }

    // Show the clicked tab's content and make the tab button active
    document.getElementById(tabName).classList.add("active");
        event.currentTarget.classList.add("active");
}



/* DARK MODE */
const darkModeToggle = document.getElementById("darkModeToggle");
const body = document.body;
body.classList.toggle('dark-mode');
darkModeToggle.classList.toggle('dark');
let isDark = true;

darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    darkModeToggle.classList.toggle('dark');
    isDark = !isDark;
    darkModeToggle.textContent = isDark ? "Light Mode" : "Dark Mode"
});
