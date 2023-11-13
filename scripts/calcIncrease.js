const { resources } = require("./json/resources");
const { craftedResources } = require('./json/craftedResources');

const { skills } = require('./json/skills');
const { getWorkers } = require('./jobs');
const { hasPerk } = require('./perks');
const { isPondered } = require('./ponder');
const { getFactoryProduction } = require("./factory");
const { hasPrestige, getLevelOfPrestige } = require("./json/prestige");
const { getMaterial } = require("./getMaterial");
const { hasTool } = require("./tools");

// Clones work at 1/4 the speed by default
var cloneMult = 0.25;

// Perks

const perkBoosts = {
    'Lumberjack': ['wood', 'sticks'],
    'Miner': ['rocks', 'ore'],
    'Botanist': ['vines', 'herbs', 'wheat'],
    // Add other perks as needed
};


function applyPerkBoost(total, resourceName) {
    for (const [perk, resources] of Object.entries(perkBoosts)) {
        if (resources.includes(resourceName) && hasPerk(perk)) {
            total *= 1.75; // 75% bonus to specific
        }
    }
    return total;
}

// Skills

const skillBoosts = {
    'gathering': ['gatheringBoost'],
    'masonry': ['masonryBoost'],
    'carpentry': ['carpentryBoost'],
    'thinking': ['thinkingBoost'],
    'farming': ['farmingBoost'],
    'fishing': ['fishingBoost'],
    'hunting': ['huntingBoost'],
};

function applySkillBoost(total, resourceName) {
    for (const [skill, boosts] of Object.entries(skillBoosts)) {
        if (skills[skill].affectedResources.includes(resourceName)) {
            boosts.forEach(boost => {
                if (hasPrestige(boost)) {
                    total *= 1.1 * getLevelOfPrestige(boost);
                }
            });
            let skillRatio = 1.06;
            let mult = 1 + (Math.pow(skillRatio, skills[skill].level) - 1) / 100;
            total *= mult;
        }
    }
    return total;
}

// Tools

const resourceToolMap = {
    'wood': 'axe',
    'ore': 'pickaxe',
    'fish': 'fishingrod',
    'game': 'spear',
    'ponder': 'paper',
    'sticks': 'staff',
    // Add more mappings as needed
};

function applyToolBoost(total, resourceName) {
    const toolName = resourceToolMap[resourceName];
    if (toolName && getMaterial(toolName) > 10) {
        total *= 1 + Math.log10(getMaterial(toolName) / 10);
    }
    return total;
}

/**
 * Calculate the amount a resource should increase by in a given time period
 * @param {string} resourceName The resource to calculate
 * @param {number} delta_time How much time has elapsed
 * @returns The amount that resource should increase by
 */
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
    total = applyPerkBoost(total, resourceName);
    // Apply skills to all clones
    total = applySkillBoost(total, resourceName);

    // console.log(getBoost('campfi'))
    // All buildings after level
    for (const building of Object.keys(buildings)) {
        const boostData = require("./json/buildings").getBoost(building, resourceName);
        if (boostData) {

            var increase = Math.pow(boostData, buildings[building].count);
            if (isPondered('effectiveBuildings')) increase *= 1.03;
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

    // Check tools
    total = applyToolBoost(total, resourceName);

    // Need at least 10 husks to boost mathematically (ln(1) = 0)
    if (getMaterial('husks') > 10) total *= 1 + Math.log(getMaterial('husks') / 10);
    // Convert from seconds to milliseconds
    return parseFloat((total * delta_time / 1000).toFixed(3));
}
exports.calcIncrease = calcIncrease;