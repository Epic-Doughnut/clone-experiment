const { getMaterial } = require('./getMaterial');
const { craftedResources } = require('./json/craftedResources');
const { resources } = require('./json/resources');
// Assuming these are defined globally
// var manufacturedMap = {
//     clay: ['bricks'],
//     herbs: ['medicine'],
//     hides: ['leather'],
//     iron: ['steel', 'nails'],
//     ore: ['iron', 'silver', 'gold'],
//     sand: ['glass', 'concrete'],
//     rocks: ['slabs'],
//     vines: ['rope'],
//     wood: ['paper', 'beams', 'crates'],
// };

var switchedManufacturedMap = {
    'beams': ['wood'],
    'bricks': ['clay'],
    'concrete': ['sand'],
    'crates': ['wood'],
    'glass': ['sand'],
    'gold': ['ore'],
    'handle': ['sticks'],
    'iron': ['ore'],
    'leather': ['hides'],
    'medicine': ['herbs'],
    'nails': ['iron'],
    'paper': ['wood'],
    'sharprocks': ['rocks'],
    'silver': ['ore'],
    'slabs': ['rocks'],
    'spear': ['staff', 'sharprocks', 'rope'],
    'staff': ['handle', 'rope'],
    'steel': ['iron'],
    'sticks': ['wood'],
    'rope': ['vines'],
    'wood': ['sticks'],
};


var allMaterials = [];
Object.keys(resources).forEach(r => allMaterials.push(r));
Object.keys(craftedResources).forEach(r => allMaterials.push(r));
console.log("All materials: ", allMaterials);

let activeFactoriesProducing = {};
let activeFactoriesConsuming = {};

function isProducing(resource) {
    return resource in activeFactoriesProducing;
}

function isConsuming(resource) {
    return resource in activeFactoriesConsuming;
}

// function getFactoryConsumption(resource) {
//     return activeFactoriesConsuming[resource] * ;
// }

function getFactoryProduction(resource) {
    return activeFactoriesProducing[resource] * manufactureBulk;
}


// Function to update resource production and consumption
function updateFactoryResourceTracking(oldProduced, newProduced, factoryIndex) {
    // If this factory was previously producing something, reduce the count
    if (oldProduced && oldProduced !== 'none') {
        activeFactoriesProducing[oldProduced]--;
        Array.from(craftedResources[oldProduced].cost).forEach((cost) => {
            activeFactoriesConsuming[cost.resource] -= cost.amount;
        });
    }

    // Update the production count for the new resource
    activeFactoriesProducing[newProduced]++;
    Array.from(craftedResources[newProduced].cost).forEach((cost) => {
        activeFactoriesConsuming[cost.resource] += cost.amount;
    });
}

// Call this whenever a factory's settings change
function onFactoryModified(factoryIndex, newProduced) {
    const rightSelect = document.querySelector(`#factory-${factoryIndex} .rightSelect`);
    updateFactoryResourceTracking(rightSelect.getAttribute('data-produced'), newProduced, factoryIndex);
    rightSelect.setAttribute('data-produced', newProduced);
}
function createFactoryDiv() {

    // Initialize resource tracking objects
    Object.keys(craftedResources).forEach((resource) => {
        activeFactoriesProducing[resource] = 0;
        Array.from(craftedResources[resource].cost).forEach((cost) => {
            if (!activeFactoriesConsuming[cost.resource]) {
                activeFactoriesConsuming[cost.resource] = 0;
            }
        });
    });


    const factoriesContainer = document.getElementById('factories');
    const factoryDiv = document.createElement('div');
    factoryDiv.className = 'factory';

    const leftText = document.createElement('span');
    leftText.classList.add('factoryCost');
    const rightSelect = document.createElement('select');

    // Populate the right dropdown
    Object.keys(switchedManufacturedMap).forEach(resource => {

        const option = document.createElement('option');
        option.value = resource;
        option.textContent = resource;
        rightSelect.appendChild(option);


    });

    rightSelect.setAttribute('data-produced', 'none');


    rightSelect.addEventListener('change', function () {
        // Get the current produced resource for this factory
        const currentProduced = this.getAttribute('data-produced');
        if (currentProduced !== 'none') document.querySelector(`#resource-${currentProduced}`).style.color = '';

        const newProduced = rightSelect.value;

        // Update resource tracking
        updateFactoryResourceTracking(currentProduced, newProduced, this.dataset.factoryIndex);

        // Now update the dataset for the next change event
        this.setAttribute('data-produced', newProduced);


        document.querySelector(`#resource-${newProduced}`).style.color = 'thistle';
        leftText.innerHTML = '';
        leftText.innerHTML += `${require('./resources').generateTooltipCost(craftedResources[rightSelect.value].cost)}`;

    });

    // Add the initial option for left select
    function addInitialOption(selectElement, text) {
        const initialOption = document.createElement('option');
        initialOption.value = '';
        initialOption.textContent = text;
        initialOption.disabled = true;
        initialOption.selected = true;
        selectElement.appendChild(initialOption);
    }

    const arrow = document.createElement('span');
    arrow.innerHTML = '&#8594;'; // Right arrow HTML entity

    factoryDiv.appendChild(leftText);
    factoryDiv.appendChild(arrow);
    factoryDiv.appendChild(rightSelect);

    addInitialOption(rightSelect, 'Select a Resource');

    factoriesContainer.appendChild(factoryDiv);

    return factoryDiv;

}

function loadFactory(crafting) {
    let div = createFactoryDiv();
    div.querySelector('select').value = crafting;
    document.querySelector(`#resource-${crafting}`).style.color = 'thistle';
    div.querySelector('.factoryCost').innerHTML = '';
    div.querySelector('.factoryCost').innerHTML += `${require('./resources').generateTooltipCost(craftedResources[crafting].cost)}`;

}


let manufactureBulk = 2;
let bulkUpgradeCost = 30;
let manufactureBonus = 1;
/**
 * 
 * @param {string[]} resources All resources required for the craft
 * @param {string} goalResource What we'll be crafting
 */
function manufacture(resources, goalResource) {
    // Calculate how many we can afford
    let arr = [];
    resources.forEach(resource => arr.push(getMaterial(resource)));
    let num = Math.min(manufactureBulk, ...arr);
    num *= manufactureBonus;
    // The factories get to be half price of normal crafting bc efficiency
    require('./resources').craftResourceQuantity(goalResource, num);
    // increaseMaterial(goalResource, num);
    // increaseMaterial(resource, -craftedResources[goalResource].cost);
}

function upgradeBulk() {
    manufactureBulk += 2;
    bulkUpgradeCost += 10;

    const upButton = document.getElementById('upgradeBulkButton');
    upButton.setAttribute('tooltipCost', `${manufactureBulk} → ${manufactureBulk + 2}: ${bulkUpgradeCost.toFixed(0)} silver`);
}

function attemptManufacture() {
    const factories = document.querySelectorAll('.factory');
    factories.forEach(factory => {

        // const leftSelect = factory.querySelector('span:first-child');
        const rightSelect = factory.querySelector('select:last-child');
        const goalResource = rightSelect.value;
        const resources = switchedManufacturedMap[goalResource];
        console.log("checking factory", goalResource);
        if (resources && goalResource) {
            manufacture(resources, goalResource);
        }

    });
}

// Call this function whenever you want to start the manufacturing process
// for example, after creating the factory divs initially or after adding a new one
// startManufacturingProcess();
// function determineNewFactoryCost() {
//     var cost = 50;
//     for (const [key, val] of Object.entries(activeFactoriesProducing)) {
//         if (val > 0)
//             cost *= Math.pow(1.2, val);
//     }
//     return cost;
// }
// var newFactorySilverCost = determineNewFactoryCost();
var newFactorySilverCost = 50;
function buyFactory() {
    const buyFactoryButton = document.getElementById('buyFactoryButton');
    if (getMaterial('silver') < newFactorySilverCost) {
        console.log('Not enough silver!'); return;
    }

    // Has enough silver to afford factory
    require('./resources').increaseMaterial('silver', -newFactorySilverCost);
    createFactoryDiv();

    newFactorySilverCost *= 1.2;
    buyFactoryButton.setAttribute('tooltipCost', `${newFactorySilverCost.toFixed(2)} silver`);
}

module.exports = {
    createFactoryDiv,
    attemptManufacture,
    buyFactory,
    upgradeBulk,
    allMaterials,
    getFactoryProduction,
    loadFactory,
    activeFactoriesProducing
};
