const { getCraftedResourceConfigById } = require('./json/craftedResources');
const { buildings } = require("./json/buildings");
const { ponders } = require("./json/ponder");
const { resources, getResourceConfigById } = require('./json/resources');
const { calcSecondsRemaining } = require('./resources');
const { getMax } = require('./helper');
const { getMaterial } = require('./getMaterial');

const tooltip = document.getElementById('dynamic-tooltip');
function showTooltip(target, desc, effect, cost) {
    let content = '';

    if (desc) {
        content += `<span >${desc}</span><hr>`;
    }

    if (effect) {
        content += `<span style="color:#4cf">${effect}</span><hr>`;
    }

    function processMaterials(htmlString, resources) {
        // Regular expression to extract material and amount
        const regex = /class="tooltip-(\w+) .+?">([\d.]+[KM]?)\s(\w+)</g;
        let match;
        let processedString = '';

        while ((match = regex.exec(htmlString)) !== null) {
            const material = match[1];
            const amountText = match[2];
            const amount = parseAmount(amountText); // Convert '121K' to 121000, for example

            // Perform your logic here
            const hasEnough = getMaterial(material, resources) >= amount;
            var colorClass = hasEnough ? 'enough' : 'not-enough';
            if (getMax(material) < amount) colorClass = 'exceeds-max';

            processedString += `<span class="tooltip-${material} ${colorClass}">${amountText} ${material}</span>`;

            let secondsRemaining = 0;
            if (resources[material]) secondsRemaining = calcSecondsRemaining(material, amount);
            if (secondsRemaining > 0 && colorClass != 'exceeds-max') {
                processedString += `<span class="time-remaining">(${secondsRemaining.toFixed(0)} seconds)</span>`;
            }
            processedString += `<br>`;
        }

        return processedString;
    }

    // Helper function to parse amounts like '121K' into numbers
    function parseAmount(amountText) {
        let amount = parseFloat(amountText);
        if (amountText.includes('K')) {
            amount *= 1e3;
        } else if (amountText.includes('M')) {
            amount *= 1e6;
        } else if (amountText.includes('B')) {
            amount *= 1e9;
        }
        return amount;
    }

    try {
        // console.log('cost of tooltip:', cost);
        if (cost.toString().includes('span')) {
            // content += `<span style="color:#F4D03F">${cost}</span><br>`;
            // console.log('running procmat for ', cost);
            content += processMaterials(cost, resources);
        }
        else {
            var str = '';
            for (const [material, amount] of Object.entries(cost)) {
                // const material = req;
                const hasEnough = getMaterial(material, resources) >= amount; /* Your logic to check if there's enough of the material *//* Your logic to check if there's enough of the material */;
                var colorClass = hasEnough ? 'enough' : 'not-enough';
                if (getMax(material) < amount) colorClass = 'exceeds-max';
                str += `<span class="tooltip-${material} ${colorClass}">${amount.toFixed(0)} ${material}</span>`;

                let secondsRemaining = 0;
                if (resources[material]) secondsRemaining = calcSecondsRemaining(material, amount);
                // console.log(secondsRemaining);
                if (secondsRemaining > 0 && colorClass != 'exceeds-max') { str += `<span class="time-remaining">(${(secondsRemaining).toFixed(0)} seconds)</span>`; }
                str += `<br>`;
            }
            content += str;


        }
    } catch (error) {
        content += cost;
        // console.error("Couldn't make normal cost for button: ", target, cost, error);
    }
    // console.log(target, content);
    // @ts-ignore
    tooltip.innerHTML = content;
    // @ts-ignore
    tooltip.style.left = (target.getBoundingClientRect().right + 5) + 'px';
    // @ts-ignore
    tooltip.style.top = (target.getBoundingClientRect().top - tooltip.offsetHeight / 2) + 'px';
    // @ts-ignore
    tooltip.style.display = 'block';
}

function hideTooltip() {
    // @ts-ignore
    tooltip.style.display = 'none';
}
exports.hideTooltip = hideTooltip;

function updateTooltip(button) {
    const desc = button.getAttribute('data-tooltip-desc') || button.getAttribute('tooltipDesc');
    const effect = button.getAttribute('data-tooltip-effect');
    // const cost = button.getAttribute('data-tooltip-cost');
    const config = getResourceConfigById(button.id) || getCraftedResourceConfigById(button.id) || buildings[button.getAttribute('data_building')] || ponders[button.getAttribute('unlock')];
    // console.log(config);
    const cost = button.getAttribute('tooltipCost') || button.getAttribute('data-tooltip-cost') || (config && config.cost);
    showTooltip(button, desc, effect, cost);
}
exports.updateTooltip = updateTooltip;
