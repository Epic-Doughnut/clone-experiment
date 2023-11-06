const { resources } = require("./json/resources");
const { craftedResources } = require('./json/craftedResources');
const { buildings, getBoost } = require("./json/buildings");
const { skills } = require('./json/skills');
const { getWorkers } = require('./jobs');
const { getToolValueForResource } = require('./tools');
const { hasPerk } = require('./perks');
const { isPondered } = require('./ponder');
const { getFactoryProduction } = require("./factory");

// Clones work at 1/4 the speed by default
var cloneMult = 0.25;
// console.log('initial', workersDistribution);
function calcIncrease(resourceName, delta_time) {
    var total = 0;

    // clones increase by 1 per second as long as there's space
    // if (resource === 'clones' && passedStage('clone')) {
    //     total = 1;
    //     return total;
    // }
    if (craftedResources.hasOwnProperty(resourceName)) {
        // check our factories
        total = getFactoryProduction(resourceName);
        if (total > 0) return total; // Don't apply skills to factories

    } else if (!resources.hasOwnProperty(resourceName)) return total;

    if (resourceName === 'clones' && isPondered('autoClone')) total = 1;
    // Check tools
    var currTool = getToolValueForResource(resources[resourceName]);
    // Gathering personally
    if (resources[resourceName] && resources[resourceName].isGetting) {
        total += currTool;
    }

    // Check jobs
    let leaderMult = hasPerk('Leader') ? cloneMult * 1.5 : cloneMult;
    total += leaderMult * getWorkers(resourceName) || 0;


    // Apply perks production boost
    if (hasPerk('Lumberjack') && (resourceName == 'wood' || resourceName == 'sticks')) total *= 1.25;
    if (hasPerk('Miner') && (resourceName == 'rocks' || resourceName == 'ore')) total *= 1.25;
    if (hasPerk('Botanist') && (resourceName == 'vines' || resourceName == 'herbs' || resourceName == 'wheat')) total *= 1.25;

    // Apply skills to all clones
    for (let skill in skills) {
        if (skills[skill].affectedResources.includes(resourceName)) {
            let skillRatio = 1.06;
            var mult = 1 + (Math.pow(skillRatio, skills[skill].level) - 1) / 100;
            // console.log("Multiplying gain by " + mult);
            total *= mult;
        }
    }


    // All buildings after level
    for (let building in buildings) {
        const boostData = getBoost(building, resourceName);
        if (boostData) {
            var increase = Math.pow(boostData, buildings[building].count);
            if (isPondered('effectiveBuildings')) increase *= 1.01;
            total *= increase;
        }
    }
    if (resourceName === 'ponder') {
        // console.log("PONDERING INC: ",total);
        if (isPondered('ponder1')) total *= 1.05;
    }

    if (isPondered('fasterResourceGain')) total *= 1.05;

    // Convert from seconds to milliseconds
    total *= delta_time / 1000;
    // round total to nearest thousandth
    total = parseFloat(total.toFixed(3));
    // console.log("time for resources", delta_time, resourceName, total);
    return total;
}
exports.calcIncrease = calcIncrease;