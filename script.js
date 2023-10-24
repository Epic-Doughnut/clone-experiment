// Initialize values
let clones = 0;

let hasSharpRock = false;
let skilled = false;
let hasGeneratedSkillTable = false;


// Price chart
// [name, principle, exponent]
let prices = [];
let stages = [];


prices.push(["lumberjacks", 10, 1.1]);


// Get references to the elements
const messageElement = document.querySelector("#message");

const clonesValueElement = document.querySelector('#clonesValue');
// const increaseButton = document.querySelector('#increaseButton');

// const startElements = document.querySelectorAll(".start");
// const stickElements = document.querySelectorAll(".stick");
// const woodElements = document.querySelectorAll('.wood');


// const assignLumberjack = document.querySelector('#createLumberjackButton');
// const lumberjackValueElement = document.querySelector("#lumberjackValue");
// const lumberjackCostElement = document.querySelector("#lumberjackCostValue");



/* GATHERING MATERIALS*/

// Stop all gathering functions
function stopAllGathering() {
    woodToggle.textContent = "Chop Wood";
    stickToggle.textContent = "Gather Sticks";
    vineToggle.textContent = "Gather Vines";
    rockToggle.textContent = "Gather Rocks";
}

// State of each resource
const resources = {
    "clones": {
        "id": "makeClone",
        "value": 0
    },
    "totalClones": {
        "value": 0
    },
    "wood": {
        "id": "gatherWood",
        "isGetting": false,
        "activeText": "Chopping Wood",
        "defaultText": "Chop Wood",
        "tools": [{"tool": "Axe", "val": 1.5}, {"tool": "Chainsaw", "val":3}],
        "value": 0
    },
    "sticks": {
        "id": "gatherSticks",
        "isGetting": false,
        "activeText": "Gathering Sticks",
        "defaultText": "Gather Sticks",
        "value": 0
    },
    "vines": {
        "id": "gatherVines",
        "isGetting": false,
        "activeText": "Gathering Vines",
        "defaultText": "Gather Vines",
        "tools": [{"tool": "Axe", "val": 1.5}],
        "value": 0
    },
    "rocks": {
        "id": "gatherRocks",
        "isGetting": false,
        "activeText": "Gathering Rocks",
        "defaultText": "Gather Rocks",
        "value": 0
    },
    "fish": {
        "id": "gatherFish",
        "isGetting": false,
        "activeText": "Gone Fishing",
        "defaultText": "Go Fish",
        "value": 0,
        "tools": [{"tool": "Spear", "val":1}, {"tool": "Fishing Rod", "val": 2}]
    },
    "ponder":{
        "id": "gatherPonder",
        "isGetting": false,
        "activeText": "Pondering",
        "defaultText": "Ponder",
        "value": 0
    },
    "ore": {
        "value": 0,
        "id": "gatherOre",
        "isGetting": false,
        "activeText": "Mining Ore",
        "defaultText": "Mine Ore"
    }
}


// Get function for materials
function getMaterial(material){
    if(resources.hasOwnProperty(material)) {
        return resources[material].value;
    } else {
        // console.error("Invalid material:", material);  // For debugging
        return getCraftedResource(material);
        
    }
}

function stopAllGathering() {
    for (let key in resources) {
        resources[key].isGetting = false;
        if (resources[key].button)       resources[key].button.textContent = resources[key].defaultText;
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

// let ateFish = true;



/* CRAFTING RESOURCES */

const craftedResources = {
    'sharpRocks': {
        id: 'craftRocks',
        value: 0,
        requires: [
            { material: 'rocks', amount: 2 }
        ],
        // tool: 'Bare Hands'
    },
    'rope': {
        id: 'craftRope',
        value: 0,
        requires: [
            { material: 'vines', amount: 3 }
        ],
        // tool: 'Bare Hands'
    },
    'handle': {
        id: 'craftHandle',
        value: 0,
        requires: [
            { material: 'sticks', amount: 1 }
        ],
        // tool: 'Sharp Rock'
    },
    'staff': {
        id: 'craftStaff',
        value: 0,
        requires: [
            { material: 'handle', amount: 2 },
            { material: 'rope', amount: 1 },
        ],
        // tool: 'Bare Hands'
    },
    'fishingRod': {
        id: 'craftFishingRod',
        value: 0,
        requires: [
            { material: 'staff', amount: 1 },
            { material: 'rope', amound: 1 }
        ],
        // tool: 'Bare Hands'
    },
    'spear': {
        id: 'craftSpear',
        value: 0,
        requires: [
            { material: 'staff', amount:1},
            { material: 'sharpRocks', amount:1},
            { material: 'rope', amount: 1 },
        ],
        // tool: 'Bare Hands'
    },
    'axe': {
        id: 'craftAxe',
        value: 0,
        requires: [
            { material: 'handle', amount:1},
            { material: 'sharpRocks', amount:2},
            { material: 'rope', amount: 1 },
        ],
        // tool: 'Bare Hands'
    },
    'pickaxe': {
        id: 'craftPickaxe',
        value: 0,
        requires: [
        {material: 'handle', amount: 1},
        {material: 'sharpRocks', amount:3},
        {material: 'rope', amount: 1},
        {material: 'rocks', amount: 10}
        ]
    },
}



function generateTooltipCost(requirements) {
    return requirements.map(req => `${req.amount} ${req.material}`).join(', ');
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
function craftResource(resourceKey) {
    if (!craftedResources.hasOwnProperty(resourceKey)) {
        console.log("Invalid craft:" + resourceKey);
        return;
    }

    let canCraft = true;
    let requirements = craftedResources[resourceKey].requires;

    // if (craftedResources[resourceKey].tool){
    //     canCraft = hasTool(craftedResources[resourceKey].tool);
    // }
    // Check if all requirements are met
    for (let req of requirements) {
        if (getMaterial(req.material) < req.amount) {
            canCraft = false;
            break;
        }
    }

    if (canCraft) {
        for (let req of requirements) {
            increaseMaterial(req.material, -req.amount);
        }
        craftedResources[resourceKey].value += calcCraftBonus(resourceKey);
        // document.querySelector("#" + resourceKey + "Value").textContent = craftedResources[resourceKey].value.toFixed(2);
        updateDisplayValue(resourceKey);
    }
}


/* HELPER FUNCTIONS */


function updateDisplayValue(material){
    // console.log("Updating the display value for " + material);
    document.querySelector("#" + material + "Value").textContent = getMaterial(material).toFixed(1);
}

// Generic increase
function increaseMaterial(material, num){
    // Ensure we actually need to do anything
    if (num != 0)
    {
    // This check ensures that the material key exists in the resources map.
        if(resources.hasOwnProperty(material)) {
            resources[material].value += num;
            updateDisplayValue(material);
            updateSkills(material);
        } else {
            // console.error("Invalid material:", material);  // For debugging
            if(craftedResources.hasOwnProperty(material)){
                craftedResources[material].value += num;
                updateDisplayValue(material);
                updateSkills(material);
            }
        }

    }

    // resources[material].value += num;
    // document.querySelector("#" + material + "Value").textContent = resources[material].value;

}


/* Calculate the cost of the next building */
function calcCost(principle, exponent, num){
    return Math.floor(principle * Math.pow(exponent, num));
}


/* TOOLS */


// List to hold the tools
let playerTools = ['Bare Hands'];

// Function to check if a tool is present in the list
function hasTool(tool) {
    return playerTools.includes(tool);
}

// Function to add a tool if it's not already present
function addTool(tool) {
    if (!hasTool(tool)) {
        playerTools.push(tool);

        // Update the UI
        var ul = document.getElementById("tools-list");
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(tool));
        ul.appendChild(li);
    }
}




/* BUTTONS */


const buttons = {

/* PRODUCTION TAB */
    'gatherSticks': {
        class: 'tooltip startVisible',
        tab: 'production',
        text: 'Gather Sticks',
        tooltipDesc: 'Five, Six, Pick up sticks.',
        tooltipCost: 'Free',
        requirement: () => true // This button is always visible
    },
    'gatherVines': {
        class: 'tooltip stick',
        tab: 'production',
        text: 'Gather Vines',
        tooltipDesc: 'Some vines are rubbery, others are gummy.',
        tooltipCost: 'Free',
        requirement: () => getMaterial('sticks') >= 10
    },
    'gatherRocks': {
        class: 'tooltip stick',
        tab: 'production',
        text: 'Gather Rocks',
        tooltipDesc: 'Not a single window to throw them through.',
        tooltipCost: 'Free',
        requirement: () => getMaterial('vines') >= 10 // Example requirement, adjust as needed
    },
    'makeClone': {
        class: 'clone',
        tab: 'production',
        text: 'Spawn',
        requirement: () => false // never visible. Adjust as necessary.
    },
    'gatherFish': {
        class: 'tooltip fishing',
        tab: 'production',
        text: 'Go Fish',
        tooltipDesc: 'Got any tuna?',
        tooltipCost: 'Free',
        requirement: () => hasTool('Spear') || hasTool("Fishing Rod")
    },
    'gatherWood': {
        class: 'woodToggle wood',
        tab: 'production',
        text: 'Chop Wood',
        tooltipDesc: 'An axe hurts way less than using your hands.',
        requirement: () => hasTool('Axe')
    },
    'gatherOre': {
        "class": "tooltip ",
        "tab": "production",
        "text": "Mine Ore",
        "tooltipDesc": "Diggy Diggy Hole",
        "tooltipCost": "Free",
        requirement: () => hasTool('Pickaxe')
    },


/* EXPERIMENT TAB */
    'craftRope': {
        class: 'tooltip',
        text: 'Twist vines together',
        tooltipDesc: 'The basis of attaching things to other things.',
        tooltipCost: '',
        tab: 'experiment',
        requirement: () => getMaterial('vines') >= 3
    },
    'craftRocks': {
        class: 'tooltip',
        text: 'Bang rocks together',
        tooltipDesc: 'Craft a rock using nothing but rocks!',
        tooltipCost: '',
        tab: 'experiment',
        requirement: () => getMaterial('rocks') >= 5
    },
    'craftHandle': {
        class: 'tooltip',
        text: 'Debark sticks',
        tooltipDesc: 'Shear off that bark to hold it better',
        tooltipCost: '',
        tab: 'experiment',
        requirement: () => hasTool('Sharp Rock')
    },
    'craftStaff': {
        class: 'tooltip',
        text: 'Craft Staff',
        tooltipDesc: 'Stick some sheared sticks together',
        tooltipCost: '',
        tab: 'experiment',
        requirement: () => getCraftedResource('handle') >= 2 
    },
    'craftAxe': {
        class: 'tooltip',
        text: 'Craft Axe',
        tooltipDesc: 'Put a rock straight through that handle',
        tooltipCost: '',
        tab: 'experiment',
        requirement: () => hasTool('Spear')
    },
    'craftSpear': {
        class: 'tooltip',
        text: 'Craft Spear',
        tooltipDesc: 'A long and pointy stick',
        tooltipCost: '',
        tab: 'experiment',
        requirement: () => getCraftedResource('staff') >= 1
    },
    'craftPickaxe': {
        class: 'tooltip',
        text: 'Craft Pickaxe',
        tooltipDesc: 'Sadly not made of diamonds',
        tooltipCost: '',
        tab: 'experiment',
        requirement: () => hasTool('axe')
    },
    
/* TABS */
    'productionTabButton': {
        class: 'tab-button',
        text: 'Production',
        showTab: 'productionTab',
        tab: 'tabs',
        requirement: () => passedStage('tab-button')
    },
    'experimentTabButton': {
        class: 'tab-button',
        text: 'Experiment',
        showTab: 'experimentTab',
        tab: 'tabs',
        requirement: () => passedStage('tab-button')
    },
    'ponderTabButton': {
        class: 'tab-button',
        text: 'Ponder',
        showTab: 'ponderTab',
        tab: 'tabs',
        requirement: () => passedStage('ponder-tab')
    },
    'jobsTabButton': {
        class: 'tab-button',
        text: 'Jobs',
        showTab: 'jobsTab',
        tab: 'tabs',
        requirement: () => passedStage('jobs-tab')  // Assuming the job tab appears after unlocking 'jobs-tab'
    },

/* PONDER TAB */
    'gatherPonder': {
        class: 'tooltip',
        text: 'Ponder',
        tooltipDesc: 'Wrap your head around the great mysteries',
        tooltipCost: 'Time',
        tab: 'ponder',
        requirement: () => passedStage('ponder-tab')
    },
    'ponderClones1': {
        class: 'tooltip unlock',
        text: 'Understand Cloning',
        tooltipDesc: 'Why are there two of you?',
        tooltipCost: 'Sanity (20 Ponder)',
        tab: 'ponder',
        unlock: 'jobs-tab',
        requirement: () => (getMaterial('ponder') >= 10) && !passedStage('jobs-tab')
    },
    'ponderSkills': {
        class: 'tooltip unlock',
        text: 'Notice Improvement',
        tooltipDesc: "You're starting to learn things, right?",
        tooltipCost: '40 Ponder',
        tab: 'ponder',
        unlock: 'skillsTable',
        requirement: () => (getMaterial('ponder') >= 25)
    },



/* JOBS TAB */
    // 'assignFarming': {
    //     class: 'tooltip',
    //     text: `
    //         <div class="btn-adjustment">-</div>
    //         Farming
    //         <div class="btn-adjustment">+</div>
    //     `,
    //     tooltipDesc: 'Assign a worker to farm crops',
    //     tooltipCost: 'Food and Water',
    //     tab: 'job',
    //     requirement: () => hasTool("Hoe")  // This is just a hypothetical requirement
    // },

    // 'assignHunting': {
    //     class: 'tooltip',
    //     text: `
    //         <div class="btn-adjustment">-</div>
    //         Hunting
    //         <div class="btn-adjustment">+</div>
    //     `,
    //     tooltipDesc: 'Assign a worker to hunt animals',
    //     tooltipCost: 'Weapons and Stamina',
    //     tab: 'job',
    //     requirement: () => hasTool("Spear")  // This is just a hypothetical requirement
    // },

    // 'assignFishing': {
    //     class: 'tooltip',
    //     text: `
    //         <div class="btn-adjustment">-</div>
    //         Fishing
    //         <div class="btn-adjustment">+</div>
    //     `,
    //     tooltipDesc: 'Assign a worker to fish in the nearby water',
    //     tooltipCost: 'Fishing Rods and Patience',
    //     tab: 'job',
    //     requirement: () => hasTool("Spear") || hasTool("Fishing Rod")  // This is just a hypothetical requirement
    // }

}

// Hardcoded unlocks map
let unlocks = {
    'jobs-tab': {
        id: 'ponderClones1',
        isUnlocked: false,
        requirements: [{
                    material: 'ponder',
                    amount: 20
                }]
    },
    'skillsTable': {
        id: 'ponderSkills',
        isUnlocked: false,
        requirements: [{
                    material: 'ponder',
                    amount: 40
                }]
    }
    // ... add other unlock items as needed
};

function isUnlocked(id) {
    // Check if the id exists in the unlocks map
    if (unlocks[id]) {
        return unlocks[id].isUnlocked;
    }

    // If the id doesn't exist in the map, return false
    return false;
}


// Function to get all buttons with class 'unlock' and attach an event listener to them
function initializeUnlockButtons() {
    const unlockButtons = document.querySelectorAll('.unlock');
    
    unlockButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('click');
            const unlockAttr = this.getAttribute('unlock');
            console.log(unlockAttr);
            if (unlocks[unlockAttr]) {
                canCraft = true;   
                for (let req of unlocks[unlockAttr].requirements) {
                    if (getMaterial(req.material) < req.amount) {
                        console.log("Cannot unlock " + unlockAttr);
                        canCraft = false;
                        break;
                    }
                }

                if (canCraft) {
                    for (let req of unlocks[unlockAttr].requirements) {
                        increaseMaterial(req.material, -req.amount);
                    }
                    unlocks[unlockAttr].isUnlocked = true;
                    makeVisible(unlockAttr);
                    // document.querySelector("#" + resourceKey + "Value").textContent = craftedResources[resourceKey].value.toFixed(2);
                    // make this button disappear
                    this.display = 'none';

                    console.log("Unlocking " + unlockAttr);
                }
            }
        });
    });
}

// Initialize the buttons when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeUnlockButtons);


/* JOBS FUNCTIONALITY */

const jobCounts = {
    farming: 0,
    gathering: 0,
    masonry: 0,
    carpentry: 0,
    combat: 0,
};

document.querySelectorAll('.btn-increment').forEach(btn => {
    btn.addEventListener('click', function() {
        const jobType = this.closest('.job-button').getAttribute('data-job');
        if (getMaterial('clones') > 0)
        {
            jobCounts[jobType]++;
            increaseMaterial('clones', -1);
        }
        updateDisplay(jobType);
    });
});

document.querySelectorAll('.btn-decrement').forEach(btn => {
    btn.addEventListener('click', function() {
        const jobType = this.closest('.job-button').getAttribute('data-job');
        if (jobCounts[jobType] > 0) {
            jobCounts[jobType]--;
            increaseMaterial('clones', 1);
            updateDisplay(jobType);
        }
    });
});

function updateDisplay(jobType) {
    const jobElement = document.querySelector(`.job-button[data-job="${jobType}"] .job-name`);
    if (jobElement) jobElement.textContent = `${jobType.charAt(0).toUpperCase() + jobType.slice(1)}: ${jobCounts[jobType]}`;
}


/* BUTTONS GENERATE */

function generateButtons() {

    console.log("Generating buttons");
    console.trace();
    // Create the columns
    const createColumns = (parent) => {
        const col1 = document.createElement('div');
        const col2 = document.createElement('div');
        const col3 = document.createElement('div');

        col1.style.width = '33.33%';
        col2.style.width = '33.33%';
        col3.style.width = '33.33%';

        col1.style.display = 'inline-block';
        col2.style.display = 'inline-block';
        col3.style.display = 'inline-block';

        col1.classList.add('visible');
        col2.classList.add('visible');
        col3.classList.add('visible');

        // parent.style.display = 'flex;'  // Set parent to be a flex container

        parent.prepend(col3);
        parent.prepend(col2);
        parent.prepend(col1);

        return [col1, col2, col3];
    };

    const tabsContainer = document.getElementById('tabs');
    const productionContainer = document.getElementById('productionTab');
    const experimentContainer = document.getElementById('experimentTab').querySelector('.button-columns');
    const ponderContainer = document.getElementById('ponderTab');
    // const jobContainer = document.getElementById('jobsTab');
    // You can add more containers for different tabs as needed

    const productionColumns = createColumns(productionContainer);
    const experimentColumns = createColumns(experimentContainer);
    const ponderColumns = createColumns(ponderContainer);
    // const jobColumns = createColumns(jobContainer);
    // Similarly, create columns for other tabs as needed

    let productionColumnIndex = 0;
    let experimentColumnIndex = 0;
    let ponderColumnIndex = 0;
    let jobColumnIndex = 0;

    // Add counters for other tabs as needed

    for (let key in buttons) {
        const btn = buttons[key];
        const buttonElement = document.createElement('button');

        buttonElement.id = key;
        buttonElement.className = btn.class;
        buttonElement.textContent = btn.text;
        buttonElement.setAttribute('data-tooltip-desc', btn.tooltipDesc);
        buttonElement.setAttribute('unlock', btn.unlock);

        // Check if the button corresponds to a crafted resource using the ID
        const craftedResource = Object.values(craftedResources).find(resource => resource.id === key);

        if (craftedResource) {
            btn.tooltipCost = generateTooltipCost(craftedResource.requires);
        }

        buttonElement.setAttribute('data-tooltip-cost', btn.tooltipCost);

        if (btn.showTab) {
            buttonElement.addEventListener('click', () => {
                showTab(btn.showTab);
                console.log("Switching to tab: " + btn.showTab);
            });
        }
        // Append to the appropriate column based on the tab property
        if (btn.tab === 'production') {
            productionColumns[productionColumnIndex].appendChild(buttonElement);
            productionColumnIndex = (productionColumnIndex + 1) % 3;
        } else if (btn.tab === 'experiment') {
            experimentColumns[experimentColumnIndex].appendChild(buttonElement);
            experimentColumnIndex = (experimentColumnIndex + 1) % 3;
        } else if (btn.tab === 'tabs'){
            tabsContainer.appendChild(buttonElement);
        } else if (btn.tab === 'ponder'){
            ponderColumns[ponderColumnIndex].appendChild(buttonElement);
            ponderColumnIndex = (ponderColumnIndex + 1) % 3;
        }  else if (btn.tab === 'job'){
            // jobColumns[jobColumnIndex].appendChild(buttonElement);
            // jobColumnIndex = (jobColumnIndex + 1) % 3;
        }
        // Add more conditions for other tabs as needed

        // Hide the buttons we shouldn't see yet
        if (!btn.requirement())
        {
            buttonElement.style.display = 'none';
        }
    }
}




generateButtons(); // Call this once on page load or game initialization

// Attach event listeners
for (let key in resources) {
    let resource = resources[key];
    let button = document.getElementById(resource.id);
    if (button) {
        button.addEventListener('click', () => toggleResource(key));
        resource.button = button; // Store the button reference in the object
    }

    if (craftedResources[key])
    {
        resource.tooltipCost = generateTooltipCost(craftedResources[key].requires);
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



function passedStage(stage){
    return stages.includes(stage);
}

// Make everything with the class "stage" visible
function makeVisible(stage){
    if (!passedStage(stage))
    {
        stages.push(stage);
    }
    const stageElements = document.querySelectorAll("p." + stage);
    stageElements.forEach(element => element.classList.add('visible'));
    stageElements.forEach(element => element.style.display = 'block');
    updateButtonVisibility();
}

function updateButtonVisibility() {
    // generateButtons();
    for (let key in buttons) {
        const btn = buttons[key];
        const element = document.getElementById(key);
        if (element && btn.requirement()) {
            element.style.display = 'block';
            element.classList.add('visible');
            element.classList.remove('button-disabled');

        } 
        else
        {
            // element.classList.add('button-disabled');
            // element.style.display = 'none';
            // element.classList.remove('visible');
        }
    }
}


// Update visibility of assets
const visibilityRules = [
    {
        condition: () => getMaterial("sticks") >= 1,
        action: () => makeVisible("stick")
    },
    {
        condition: () => getMaterial("rocks") >= 1,
        action: () => {makeVisible("tab-button"); makeVisible('craftRocks');}   
    },
    {
        condition: () => !hasTool("Sharp Rock") && getCraftedResource('sharpRocks') >= 1,
        action: () => {
            addTool("Sharp Rock");
            makeVisible('craftRocks');
        }
    },
    {
        condition: () => !hasTool("Spear") && getCraftedResource('spear') >= 1,
        action: () => {addTool("Spear"); makeVisible('fishing');}
    },
    {
        condition: () => getMaterial("fish") >= 1,
        action: () => makeVisible('fishing')
    },
    {
        condition: () => !hasTool("Axe") && getCraftedResource('axe') >= 1,
        action: () => {addTool("Axe"); makeVisible('wood');}
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
        condition: () => !hasTool("Fishing Rod") && getCraftedResource('fishingRod') >= 1,
        action: () => {
            addTool("Fishing Rod");
            makeVisible("fishing");
        }
    },
    {
        condition: () => getMaterial('fish') >= 5,
        action: () => {
            document.getElementById('eatFish').display = 'block';
            document.getElementById('eatFish').classList.add('visible');
        }
    },
    {
        condition: () => ateFish,
        action: () => {makeVisible('clone'); makeVisible('ponder-tab');}
    },
    {
        condition: () => isUnlocked('jobs-tab'),
        action: () => makeVisible('jobs-tab')
    },
    {
        condition: () => isUnlocked('skillsTable'),
        action: () => {skilled = true; populateSkillsTable();}
    }
];

function updateVisible() {
    visibilityRules.forEach(rule => {
        if (rule.condition()) {
            rule.action();
        }
    });
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
        exp: 0,
        level: 0,
        affectedResources: ['sticks', 'vines']
    },
    masonry: {
        exp: 0,
        level: 0,
        affectedResources: ['rocks']
    },
    carpentry: {
        exp: 0,
        level: 0,
        affectedResources: ['wood', 'handle', 'staff', 'fishingRod']
    },
    thinking: {
        exp:0,
        level:0,
        affectedResources: ['ponder']
    },
    smithing: {
        exp:0,
        level:0,
        affectedResources: ['axe', 'pickaxe', 'spear']
    },
    farming: {
        exp: 0,
        level:0,
        affectedResources: []
    },
    combat: {
        exp: 0,
        level: 0,
        affectedResources: []
    },
    fishing: {
        exp: 0,
        level: 0,
        affectedResources: ['fish']
    }
};


function updateSkills(resource){
    for (let skill in skills) {
        if (skills[skill].affectedResources.includes(resource)) {
            skills[skill].exp += 1 / Math.pow(1.1, skills[skill].level);
            // console.log("Updating skill:" + skill + " to " + skills[skill].exp)

            if (skills[skill].exp >= 100)
            {
                skills[skill].level += 1;
                skills[skill].exp = 0;
                console.log("Level Up! " + skill + skills[skill].level);
            }
        }
    }
    if (skilled)
    {
        populateSkillsTable();
    }
}


function populateSkillsTable() {
    const table = document.getElementById('skillsTable');

    // If the table is empty, create the rows and progress bars
    if (!hasGeneratedSkillTable) {
        console.log("Generating table for the first time");
        hasGeneratedSkillTable = true;
        for (let skill in skills) {
            let tr = document.createElement('tr');
            let tdProgress = document.createElement('td');
            tdProgress.style.position = 'relative';

            let progressBar = document.createElement('div');
            progressBar.setAttribute('class', 'progressBar');
            if (isDark){
                progressBar.style.backgroundColor = '#228B22';
            }
            else
            {
                progressBar.style.backgroundColor = '#50C878';

            }
            progressBar.style.height = '20px';
            progressBar.setAttribute('data-skill', skill); // Assign a data attribute for identification

            let skillText = document.createElement('span');

            skillText.textContent = '[' + skills[skill].level + ']   ' + skill;
            skillText.setAttribute('id', 'level-' + skill);
            skillText.style.position = 'absolute';
            skillText.style.left = '10px';
            skillText.style.top = '50%';
            skillText.style.transform = 'translateY(-50%)';

            tdProgress.appendChild(progressBar);
            tdProgress.appendChild(skillText);
            tr.appendChild(tdProgress);
            
            table.appendChild(tr);
        }
    }

    // Now, simply update the widths and colors
    for (let skill in skills) {
        let progressBar = document.querySelector(`.progressBar[data-skill="${skill}"]`);
        if (progressBar) {
            progressBar.style.width = skills[skill].exp + '%';
            let skillName = document.querySelector("#level-" + skill);
            skillName.textContent = '[' + skills[skill].level + ']   ' + skill;
        }
    }
}

function getToolValueForResource(resource) {
    if (resource.tools)
    {
        // Sort the tools in descending order based on their val
        const sortedTools = resource.tools.sort((a, b) => b.val - a.val);

        // Iterate through the sorted tools
        for (let tool of sortedTools) {
            if (hasTool(tool.tool)) {
                // If the player has the tool, return its associated value
                return tool.val;
            }
        }
    }

    // If none of the tools are found, return the default value
    return 1;
}

function isResourceAffectedByJob(job, resource) {
    const skill = skills[job];
    if (skill && skill.affectedResources.includes(resource)) {
        return true;
    }
    return false;
}

var cloneMult = 0.25;
function calcIncrease(resource){
    var total = 0;
    if(resources.hasOwnProperty(resource)) {
        // Check tools
        var currTool = getToolValueForResource(resources[resource]);

        // Gathering personally
        if (resources[resource].isGetting)
        {
            total += currTool;
        }

        // Clones work at 1/4 the speed by default
        for (let job in jobCounts)
        {
            if (isResourceAffectedByJob(job, resource))
            {
                total += cloneMult * jobCounts[job];
            }
        }


        // Apply skills to all clones
        for (let skill in skills) {
            if (skills[skill].affectedResources.includes(resource)) {
                var mult = 1 + (Math.pow(1.2, skills[skill].level) -1) / 100;
                // console.log("Multiplying gain by " + mult);
                total *= mult;
            }
        }
    }

    // round total to nearest thousandth
    total = parseFloat(total.toFixed(3));
    return total;
}





// Switch tabs
function showTab(tabName) {
    console.log("show tab: " + tabName);
    // Get all main container divs and hide them
    let contents = document.querySelectorAll(".tab-content > .content"); // Direct children only
    for (let content of contents) {
        content.classList.remove("active");
    }

    // Get all tab buttons and remove the active class
    let tabs = document.querySelectorAll(".tab-button");
    for (let tab of tabs) {
        tab.classList.remove("active");
    }

    // Show the clicked tab's main container div and make the tab button active
    let activeContent = document.getElementById(tabName);
    activeContent.classList.add("active");

    // Get the clicked tab button and make it active
    let activeTabButton = document.querySelector(`.tab-button[data-target="${tabName}"]`);
    if (activeTabButton) {
        activeTabButton.classList.add("active");
    }

    // Show buttons in the active tab (including those in the three columns)
    let columnsInActiveTab = activeContent.querySelectorAll('div');
    for (let column of columnsInActiveTab) {
        column.classList.add("active");
        
        let buttonsInColumn = column.querySelectorAll('button');
        for(let button of buttonsInColumn) {
            // console.log(button.id);
            if (buttons[button.id].requirement())
            {
                button.style.display = 'flex'; // Or 'inline-block', or whatever your desired display style is
                console.log("displaying " + button.id);
            }
        }
    }

    // Hide buttons in inactive tabs (including those in the three columns)
    for(let content of contents) {
        if(content !== activeContent) {
            let columnsToHide = content.querySelectorAll('div');
            for(let column of columnsToHide) {
                let buttonsToHide = column.querySelectorAll('button');
                for(let button of buttonsToHide) {
                    button.classList.add('button-disabled');
                }
            }
        }
    }
}


/* HOTKEYS */
document.addEventListener('keydown', function(event) {
    switch (event.key) {
        case '1':
            showTab('productionTab');
            break;
        case '2':
            showTab('experimentTab');
            break;
        // Add cases for other tabs as needed
        case '3':
            showTab('ponderTab');
            break;
        case '4':
            showTab('jobsTab');
            break;
        default:
            break;
    }
});





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



/* CUTSCENES */

function eatFish(){
    if (!ateFish && getMaterial('fish') >= 1){
        // eat a fish and blackout
        increaseMaterial('fish', -1);
        // Call this function to start the sequence
        fadeToBlack();
        ateFish = true;
        setTimeout(() => {
            changeMessage("You are with yourself in a forest.");
            increaseMaterial('clones',1);
            increaseMaterial('totalClones',1);
        }, 1000); // delay of 1s
    }
}


function fadeToBlack() {
    const overlay = document.getElementById('overlay');
    const overlayText = document.getElementById('overlay-text');
    const overlayButton = document.getElementById('overlay-button');

    overlay.style.display = 'flex';

    setTimeout(() => {
        overlayText.style.opacity = '1';
    }, 2000);

    setTimeout(() => {
        overlayButton.style.display = 'block';
    }, 5000);
}

function hideOverlay() {
    const overlay = document.getElementById('overlay');
    overlay.style.display = 'none';
}


// Message 
function changeMessage(newMessage) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = newMessage;
}

// Example usage:
// changeMessage("You are now in a desert.");



/* SAVING */
var save = {
    resources: resources,
    craftedResources: craftedResources,
    skills: skills,
    playerTools: playerTools
}

function saveGame() {
    let save = {
        skills: {}, // This will hold the experience and level for each skill
        craftedResources: {}, // This will hold the value for each crafted item
        resources: {},
        tools: [],
        stages: [],
        unlocks: {},
        jobs: {}
    };

    // Extract exp and level from skills and save to save.skills
    for (let skill in skills) {
        save.skills[skill] = {
            exp: skills[skill].exp,
            level: skills[skill].level
        };
    }

    // Extract value from craftedResources and save to save.craftedItems
    for (let item in craftedResources) {
        save.craftedResources[item] = getCraftedResource(item);
    }

    for (let item in resources) {
        save.resources[item] = getMaterial(item);
    }

    save.tools = playerTools;
    save.stages = stages;
    save.jobs = jobCounts;
    
    for (let u in unlocks)
    {
        save.unlocks[u] = isUnlocked(u);
    }

    // You can now use the save object to store the data somewhere or display it to the user
    console.log(save);

    localStorage.setItem("save",JSON.stringify(save));
    return save;
}



function loadGame(){
    console.log("Loading Game");
    var savegame = JSON.parse(localStorage.getItem("save"));
    console.log(savegame);
    if (savegame === null){
        // NEW GAME
        return;
    }
    if (typeof savegame.resources !== "undefined"){
        for (let i in savegame.resources){
            if (i.value === "undefined" || i === null) continue;
            resources[i].value = savegame.resources[i];
            console.log("Updating resources for " + i + " to " + savegame.resources[i]);
            updateDisplayValue(i);
        }
    }

    if (typeof savegame.skills !== 'undefined'){
        for (let i in savegame.skills){
            skills[i].exp = savegame.skills[i].exp;
            skills[i].level = savegame.skills[i].level;
        }
    }

    if (typeof savegame.craftedResources !== "undefined")
    {
        for (let i in savegame.craftedResources)
        {
            craftedResources[i].value = savegame.craftedResources[i];
            updateDisplayValue(i);
        }
    }

    if (typeof savegame.tools !== 'undefined')
    {
        // playerTools = savegame.tools;
        // Union the tool lists together
        let union = [...new Set([...playerTools, ...savegame.tools])];
        playerTools = union;
    }

    if (typeof savegame.stages !== 'undefined')
    {
        for (let s in savegame.stages){
            makeVisible(savegame.stages[s]);
        }
    }
    if (typeof savegame.jobs !== 'undefined')
    {
        // jobCounts = savegame.jobs;
        for (let j in savegame.jobs)
        {
            jobCounts[j] = savegame.jobs[j];
            console.log(j);
            updateDisplay(j);
        }
    }
    if (typeof savegame.unlocks !== 'undefined')
    {
        for (let u in savegame.unlocks)
        {
            unlocks[u].isUnlocked = savegame.unlocks[u];
        }
    }

    // If we have a clone, then we ate fish
    ateFish = getMaterial("totalClones") >= 1;
    
    // Change the message to the latest one
    if (getMaterial("totalClones") >= 1)
    {
     changeMessage("You are with yourself in a forest.");
 
    }
}

loadGame();

function updateResourceIncreaseRates() {
    // const resources = ["clones", "sticks", "vines", "rocks", "fish", "wood", "ponder"];
    for (let resource in resources) {
        // console.log("increase of " + resource);
        const rate = calcIncrease(resource);
        var rateElement = document.getElementById(`${resource}IncreaseRate`);
        if (rateElement) rateElement.textContent = rate;
    }
}

// Call the function to update the rates, and consider setting an interval to periodically update them.
// setInterval(updateResourceIncreaseRates, 1000); // This will update the rates every second.



/* GAME LOOP */

function tick(){
    for (let key in resources){
        // console.log("updating " + key);
        increaseMaterial(key, calcIncrease(key));
    }
    updateResourceIncreaseRates();
}

window.setInterval(updateVisible, 100) // Update visuals 10 times per second
window.setInterval(tick, 1000); // Every tick lasts for 1 second
window.setInterval(saveGame, 10000); // Save the game every 10 seconds



const myResources = {};

document.getElementById("addResourceBtn").addEventListener("click", function() {
    document.getElementById("resourceForm").style.display = "block";
});

function addResource() {
    const resourceName = document.getElementById("resourceName").value;
    const activeText = document.getElementById("resourceActiveText").value;
    const defaultText = document.getElementById("resourceDefaultText").value;
    
    const btnText = document.getElementById("btnText").value;
    const btnTooltipDesc = document.getElementById("btnTooltipDesc").value;
    const btnTooltipCost = document.getElementById("btnTooltipCost").value;
    
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


/*        id: 'gatherFish',
        isGetting: false,
        activeText: 'Gone Fishing',
        defaultText: 'Go Fish',
        value: 0,
        tools: [{tool: "Spear", val:1}, {tool: 'Fishing Rod', val: 2}]*/