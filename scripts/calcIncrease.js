const { resources } = require("./json/resources");
const { craftedResources } = require('./json/craftedResources');

const { skills } = require('./json/skills');
const { getWorkers } = require('./jobs');
const { hasPerk } = require('./perks');
const { isPondered } = require('./ponder');
const { getFactoryProduction } = require("./factory");
const { hasPrestige, getLevelOfPrestige } = require("./json/prestige");

// Clones work at 1/4 the speed by default
var cloneMult = 0.25;
// console.log('initial', workersDistribution);
function calcIncrease(resourceName, delta_time) {
    var total = 0;
    const buildings = require("./json/buildings").buildings;
    // clones increase by 1 per second as long as there's space
    // if (resource === 'clones' && passedStage('clone')) {
    //     total = 1;
    //     return total;
    // }
    if (!resources.hasOwnProperty(resourceName)) {
        if (craftedResources.hasOwnProperty(resourceName)) {
            // check our factories
            total = getFactoryProduction(resourceName);
            if (total > 0) return total; // Don't apply skills to factories
        }
        else return total; // if not a resource or a crafted resource, return 0
    }

    if (resourceName === 'clones' && isPondered('autoClone')) total = 1;

    // Gathering personally
    if (resources[resourceName] && resources[resourceName].isGetting) {
        total += 1;
    }

    // Check jobs
    let leaderMult = hasPerk('Leader') ? cloneMult * 1.5 : cloneMult;
    total += leaderMult * getWorkers(resourceName) || 0;


    // Apply perks production boost
    if (hasPerk('Lumberjack') && (resourceName == 'wood' || resourceName == 'sticks')) total *= 1.25;
    if (hasPerk('Miner') && (resourceName == 'rocks' || resourceName == 'ore')) total *= 1.25;
    if (hasPerk('Botanist') && (resourceName == 'vines' || resourceName == 'herbs' || resourceName == 'wheat')) total *= 1.25;

    // Apply prestige specific boosts
    // Apply skills to all clones
    for (let skill in skills) {
        if (skills[skill].affectedResources.includes(resourceName)) {
            if (skill === 'gathering' && hasPrestige('gatheringBoost')) total *= 1.1 * getLevelOfPrestige('gatheringBoost');
            if (skill === 'masonry' && hasPrestige('masonryBoost')) total *= 1.1 * getLevelOfPrestige('masonryBoost');
            if (skill === 'carpentry' && hasPrestige('carpentryBoost')) total *= 1.1 * getLevelOfPrestige('carpentryBoost');
            if (skill === 'thinking' && hasPrestige('thinkingBoost')) total *= 1.1 * getLevelOfPrestige('thinkingBoost');
            if (skill === 'farming' && hasPrestige('farmingBoost')) total *= 1.1 * getLevelOfPrestige('farmingBoost');
            if (skill === 'fishing' && hasPrestige('fishingBoost')) total *= 1.1 * getLevelOfPrestige('fishingBoost');
            if (skill === 'hunting' && hasPrestige('huntingBoost')) total *= 1.1 * getLevelOfPrestige('huntingBoost');
            let skillRatio = 1.06;
            var mult = 1 + (Math.pow(skillRatio, skills[skill].level) - 1) / 100;
            // console.log("Multiplying gain by " + mult);
            total *= mult;
        }
    }

    // console.log(getBoost('campfi'))
    // All buildings after level
    for (const building of Object.keys(buildings)) {
        const boostData = require("./json/buildings").getBoost(building, resourceName);
        if (boostData) {

            var increase = Math.pow(boostData, buildings[building].count);
            if (isPondered('effectiveBuildings')) increase *= 1.01;
            total *= increase;
        }
    }
    if (resourceName === 'ponder') {
        if (isPondered('ponder1')) total *= 1.05;
        if (isPondered('ponder2')) total *= 1.05;
        if (isPondered('ponder3')) total *= 1.05;
    }

    if (isPondered('fasterResourceGain')) total *= 1.05;
    if (hasPrestige('cloneBoost')) total *= 1.05 * getLevelOfPrestige('cloneBoost');

    // Convert from seconds to milliseconds
    total *= delta_time / 1000;
    // round total to nearest thousandth
    total = parseFloat(total.toFixed(3));
    // console.log("time for resources", delta_time, resourceName, total);
    return total;
}
exports.calcIncrease = calcIncrease;