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

    if (cost) {
        // content += `<span style="color:#F4D03F">${cost}</span><br>`;
        try {
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


        } catch (error) {
            content += cost;
            // console.error("Couldn't make normal cost for button: ", target, cost, error);
        }
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
    const cost = (config && config.cost) || button.getAttribute('tooltipCost') || button.getAttribute('data-tooltip-cost');
    showTooltip(button, desc, effect, cost);
}
exports.updateTooltip = updateTooltip;
