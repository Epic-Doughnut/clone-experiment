// Initialize values
let clones = 0;

let gettingSticks = false;
let gettingVines = false;
let gettingRocks = false;
let gettingWood = false;

let lumberjacks = 0;
var lumberjackCost = 10;

// Materials storage
// [name, total]
let materials = [];

materials.push(["stick", 0]);
materials.push(["vine", 0]);
materials.push(["wood", 0]);
materials.push(["rock", 0]);

// Price chart
// [name, principle, exponent]
let prices = [];

prices.push(["lumberjacks", 10, 1.1]);


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
    wood: {
        isGetting: false,
        button: document.getElementById('gatherWood'),
        activeText: 'Chopping Wood',
        defaultText: 'Chop Wood'
    },
    sticks: {
        isGetting: false,
        button: document.getElementById('gatherSticks'),
        activeText: 'Gathering Sticks',
        defaultText: 'Gather Sticks'
    },
    vines: {
        isGetting: false,
        button: document.getElementById('gatherVines'),
        activeText: 'Gathering Vines',
        defaultText: 'Gather Vines'
    },
    rocks: {
        isGetting: false,
        button: document.getElementById('gatherRocks'),
        activeText: 'Gathering Rocks',
        defaultText: 'Gather Rocks'
    }
};

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

// Get function for materials
function getMaterial(material){
    return materials.find(item => item[0] === material)[1];
}

// Generic increase
function increaseMaterial(material, num){
    var curr = materials.find(item => item[0] === material);
    // if (curr === null){
    //     return -1;
    // }

    curr[1] += num;
    document.querySelector("#" + material + "Value").textContent = curr[1];

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
    stageElements.forEach(element => element.style.display = 'block');
}

// Check the requirements for each stage of the game
function updateVisible(){
    if (getMaterial("stick") >= 1){ // TODO: Make values larger
        makeVisible("stick");
    }

    if (getMaterial("rock") >= 1){
        makeVisible("experiment-tab");
    }
}



/* GAME LOOP */


window.setInterval(function(){
    increaseMaterial("stick", resources.sticks.isGetting ? 1 : 0);
    increaseMaterial("vine", resources.vines.isGetting ? 1 : 0);
    increaseMaterial("rock", resources.rocks.isGetting ? 1 : 0);
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
let isDark = true;

darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    darkModeToggle.classList.toggle('dark');
    isDark = !isDark;
    darkModeToggle.textContent = !isDark ? "Light Mode" : "Dark Mode"
});
