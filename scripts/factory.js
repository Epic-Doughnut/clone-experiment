const { craftedResources } = require('./json/craftedResources');
const { resources } = require('./json/resources');
const { increaseMaterial, getMaterial, craftResource } = require('./resources');
// Assuming these are defined globally
var manufacturedMap = {
    clay: ['bricks'],
    herbs: ['medicine'],
    hides: ['leather'],
    iron: ['steel', 'nails'],
    ore: ['iron', 'silver', 'gold'],
    sand: ['glass', 'concrete'],
    rocks: ['slabs'],
    vines: ['rope'],
    wood: ['paper', 'beams', 'crates'],
};

var allMaterials = [];
Object.keys(resources).forEach(r => allMaterials.push(r));
Object.keys(craftedResources).forEach(r => allMaterials.push(r));
console.log("All materials: ", allMaterials);

function createFactoryDiv() {
    const factoriesContainer = document.getElementById('factories');
    const factoryDiv = document.createElement('div');
    factoryDiv.className = 'factory';

    const leftText = document.createElement('span');
    const rightSelect = document.createElement('select');

    // Populate the right dropdown
    Object.values(manufacturedMap).forEach(resource => {
        resource.forEach(r => {
            const option = document.createElement('option');
            option.value = r;
            option.textContent = r;
            rightSelect.appendChild(option);

        });
    });


    rightSelect.addEventListener('change', function () {
        document.querySelector(`#resource-${rightSelect.value}`).style.color = 'thistle';

        let foundResource = null;

        // Iterate through the manufacturedMap to find the right resource
        for (const [resource, products] of Object.entries(manufacturedMap)) {
            if (products.includes(rightSelect.value)) { // Make sure to use .value for <select> elements
                foundResource = resource;
                break; // Stop the loop once the resource is found
            }
        }

        // Update the leftText if the resource was found
        if (foundResource) {
            leftText.textContent = foundResource;
        }
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

}


let manufactureBulk = 2;
let bulkUpgradeCost = 30;
let manufactureBonus = 1;
function manufacture(resource, goalResource) {
    // Calculate how many we can afford
    let num = Math.min(manufactureBulk, getMaterial(resource));
    num *= manufactureBonus;
    // The factories get to be half price of normal crafting bc efficiency
    for (let i = 0; i < num; ++i)
        craftResource(goalResource);
    // increaseMaterial(goalResource, num);
    // increaseMaterial(resource, -craftedResources[goalResource].cost);
}

function upgradeBulk() {
    manufactureBulk += 2;
    bulkUpgradeCost += 10;

    const upButton = document.getElementById('upgradeBulkButton');
    upButton.setAttribute('data-tooltip-cost', `${manufactureBulk} → ${manufactureBulk + 2}: ${bulkUpgradeCost.toFixed(0)} silver`);
}

function attemptManufacture() {
    const factories = document.querySelectorAll('.factory');
    factories.forEach(factory => {

        const leftSelect = factory.querySelector('span:first-child');
        const rightSelect = factory.querySelector('select:last-child');
        const resource = leftSelect.textContent;
        const goalResource = rightSelect.value;
        console.log("checking factory", resource, goalResource);
        if (resource && goalResource) {
            manufacture(resource, goalResource);
        }

    });
}

// Call this function whenever you want to start the manufacturing process
// for example, after creating the factory divs initially or after adding a new one
// startManufacturingProcess();
var newFactorySilverCost = 50;
function buyFactory() {
    const buyFactoryButton = document.getElementById('buyFactoryButton');
    if (getMaterial('silver') < newFactorySilverCost) {
        console.log('Not enough silver!'); return;
    }

    // Has enough silver to afford factory
    increaseMaterial('silver', -newFactorySilverCost);
    createFactoryDiv();

    newFactorySilverCost *= 1.2;
    buyFactoryButton.setAttribute('data-tooltip-cost', `${newFactorySilverCost.toFixed(2)} silver`);
}

module.exports = {
    createFactoryDiv,
    attemptManufacture,
    buyFactory,
    upgradeBulk,
    allMaterials
};
