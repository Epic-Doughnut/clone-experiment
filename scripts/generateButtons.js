const { craftedResources } = require('./json/craftedResources');
const { buildings } = require("./json/buildings");
const { buttons } = require("./json/buttons");
const { generateTooltipCost } = require('./resources');
const { createBuildingButton } = require('./buildings');
const { hasPerk } = require('./perks');
const { recalculateBuildingCost } = require('./recalculateBuildingCost');
const { showTab } = require('./showTab');

/* BUTTONS GENERATE */
function generateButtons() {

    console.log("Generating buttons");
    console.trace();
    // Create the columns
    for (let buildingKey in buildings) {
        const button = createBuildingButton(buildingKey, buildings);
        buttons[buildingKey] = button;
        // console.log("Made button for " + buildingKey);
    }

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
    // @ts-ignore
    const experimentContainer = document.getElementById('experimentTab').querySelector('.button-columns');
    const ponderContainer = document.getElementById('ponderTab');
    // const jobContainer = document.getElementById('jobsTab');
    // You can add more containers for different tabs as needed
    // const productionColumns = createColumns(productionContainer);
    const experimentColumns = createColumns(experimentContainer);
    const ponderColumns = createColumns(ponderContainer);
    // const jobColumns = createColumns(jobContainer);
    // Similarly, create columns for other tabs as needed
    let productionColumnIndex = 1;
    let experimentColumnIndex = 0;
    let ponderColumnIndex = 0;
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    let jobColumnIndex = 0;

    // Add counters for other tabs as needed
    for (let key in buttons) {
        const btn = buttons[key];
        const buttonElement = document.createElement('button');

        buttonElement.id = key;
        buttonElement.className = btn.class;
        buttonElement.textContent = btn.text.split('_').join(' ');

        // buttonElement.style.textAlign = 'center';
        if (btn.tooltipDesc) buttonElement.setAttribute('data-tooltip-desc', btn.tooltipDesc);
        if (btn.tooltipEffect) buttonElement.setAttribute('data-tooltip-effect', btn.tooltipEffect);
        buttonElement.setAttribute('unlock', btn.unlock);
        // console.log(btn);
        buttonElement.setAttribute('data_building', btn.data_building);
        // if this resource isn't unlocked, hide it
        // if (!btn.isVisible) buttonElement.classList.add('hidden');
        // Check if the button corresponds to a crafted resource using the ID
        const craftedResource = Object.values(craftedResources).find(resource => resource.id === key);

        if (craftedResource) {
            btn.tooltipCost = generateTooltipCost(craftedResource.cost);
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
            //style='grid-column:${col}; grid-row:${row};
            buttonElement.style.gridColumn = productionColumnIndex.toString();
            // buttonElement.style.gridRow = '0';
            productionColumnIndex = (productionColumnIndex + 1) % 3;
            productionContainer.appendChild(buttonElement);
            // productionColumns[productionColumnIndex].appendChild(buttonElement);
            // productionColumnIndex = (productionColumnIndex + 1) % 3;
        } else if (btn.tab === 'experiment') {
            experimentColumns[experimentColumnIndex].appendChild(buttonElement);
            experimentColumnIndex = (experimentColumnIndex + 1) % 3;
        } else if (btn.tab === 'tabs') {
            // @ts-ignore
            tabsContainer.appendChild(buttonElement);
        } else if (btn.tab === 'ponder') {
            ponderColumns[ponderColumnIndex].appendChild(buttonElement);
            ponderColumnIndex = (ponderColumnIndex + 1) % 3;
        } else if (btn.tab === 'job') {
            // jobColumns[jobColumnIndex].appendChild(buttonElement);
            // jobColumnIndex = (jobColumnIndex + 1) % 3;
        }
        else {
            document.getElementById(btn.tab).appendChild(btn);
        }
        // Add more conditions for other tabs as needed
        // Update tooltip for buildings
        const building = Object.keys(buildings).find(building => building === key);
        if (building) {
            // console.log(building, key);
            // btn.tooltipCost = generateBuildingTooltipCost(buildings[building].cost);
            recalculateBuildingCost(key, buildings, hasPerk);
        }
        // Hide the buttons we shouldn't see yet
        // console.log(btn);
        try {
            if (!btn.requirement()) {
                // console.log(buttonElement, btn.requirement());
                buttonElement.style.display = 'none';
            }
        } catch (err) {
            // console.warn('Error with requirement while generating buttons: ', btn, err);
        }
    }
}
exports.generateButtons = generateButtons;