const { resources } = require("./json/resources");

const { skills } = require('./json/skills');
const { getWorkers } = require('./jobs');
const { hasPerk } = require('./perks');
const { isPondered } = require('./ponder');
const { getFactoryProduction, getFactoryConsumption } = require("./factory");
const { hasPrestige, getLevelOfPrestige } = require("./json/prestige");
const { getMaterial } = require("./getMaterial");
const { ponders } = require("./json/ponder");
const { canCraft } = require("./canCraft");

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
    // console.log('skills', resourceName, total);
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
    // console.log(resourceName, toolName, total);
    return total;
}

// Apply ponder bonuses
function applyPonderBonuses(total, resourceName) {
    for (const [ponderId, ponder] of Object.entries(ponders)) {
        if (isPondered(ponderId)) {

            if (ponderId.startsWith('fasterResourceGain')) {
                // console.log('Faster Resource', ponderId);
                total *= 1.05; // Apply the bonus for this specific ponder
            }

            if (ponderId.startsWith('fasterPonder')) {
                if (resourceName === 'ponder') total *= 1.05;
            }
        }
    }
    return total;
}

/**
 * Calculate the amount a resource should increase by in a given time period
 * @param {string} resourceName The resource to calculate
 * @param {number} delta_time How much time has elapsed
 * @returns {number} The amount that resource should increase by
*/
function calcIncrease(resourceName, delta_time) {
    var total = 0;
    // console.log('calcIncrease', resourceName, delta_time);
    if (isPondered('eatBread') && getMaterial('bread') > 0 && resourceName === 'bread') return parseFloat((-1 * delta_time / 1000).toFixed(3));

    // if (resourceName === 'bread' && isPondered('eatBread')) return parseFloat((-1 * delta_time / 1000).toFixed(3));

    const buildings = require("./json/buildings").buildings;

    if (resourceName === 'clones' && isPondered('autoClone')) total = 1;

    // Gathering personally
    if (resources[resourceName] && resources[resourceName].isGetting) {
        total += 1;
    }

    // Check jobs
    let leaderMult = hasPerk('Leader') ? cloneMult * 1.5 : cloneMult;
    total += leaderMult * getWorkers(resourceName) || 0;
    if (hasPrestige('cloneBoost') && getWorkers(resourceName) > 0) total *= 1.05 * getWorkers(resourceName) * getLevelOfPrestige('cloneBoost');


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
            for (const [ponderId, ponder] of Object.entries(ponders)) {
                if (isPondered(ponderId)) {

                    if (ponderId.startsWith('effectiveBuildings')) {
                        increase *= 1.03; // Apply the bonus for this specific ponder
                    }

                }
            }
            total *= increase;
        }
    }


    // console.log('building boosts', resourceName, total);
    if (isPondered('eatBread') && getMaterial('bread') > 0 && resourceName !== 'bread') total *= 1.1;
    // Usage: Apply ponders to the 'total' value
    total = applyPonderBonuses(total, resourceName);
    // if (isPondered('fasterResourceGain')) total *= 1.05;
    // console.log('ponder boosts', resourceName, total);


    // Check tools
    total = applyToolBoost(total, resourceName);
    // console.log('tool boosts', resourceName, total);
    // Need at least 10 husks to boost mathematically (ln(1) = 0)
    if (getMaterial('husks') > 10) total *= 1 + Math.log(getMaterial('husks') / 10);

    // Diminishing returns
    total = Math.sqrt(total);

    // Factories don't diminish
    total += canCraft(resourceName) ? getFactoryProduction(resourceName) : 0;
    total -= getFactoryConsumption(resourceName);
    // console.log('sqrt', resourceName, total);
    // Convert from seconds to milliseconds
    return parseFloat((total * delta_time / 1000).toFixed(3));
}
exports.calcIncrease = calcIncrease;