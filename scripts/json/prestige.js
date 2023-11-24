const prestige = {
    'maxClones': {
        text: 'Cramped',
        tooltipDesc: 'Max Clones (+1)',
        cost: 2,
        level: 0
    },
    'cloneBoost': {
        text: 'Handyman',
        tooltipDesc: 'Clone Productivity (+5%)',
        cost: 1,
        level: 0
    },
    'gatheringBoost': {
        text: 'Picker',
        tooltipDesc: 'Gathering Efficiency (+10%)',
        cost: 1,
        level: 0
    },
    'masonryBoost': {
        text: 'Rocker',
        tooltipDesc: 'Masonry Efficiency (+10%)',
        cost: 1,
        level: 0
    },
    'carpentryBoost': {
        text: 'Chopped',
        tooltipDesc: 'Carpentry Efficiency (+10%)',
        cost: 1,
        level: 0
    },
    'thinkingBoost': {
        text: 'Wizened',
        tooltipDesc: 'Thinking Efficiency (+10%)',
        cost: 1,
        level: 0
    },
    'farmingBoost': {
        text: 'Pruned',
        tooltipDesc: 'Farming Efficiency (+10%)',
        cost: 1,
        level: 0
    },
    'fishingBoost': {
        text: 'Hooked',
        tooltipDesc: 'Fishing Efficiency (+10%)',
        cost: 1,
        level: 0
    },
    'huntingBoost': {
        text: 'Tracker',
        tooltipDesc: 'Hunting Efficiency (+10%)',
        cost: 1,
        level: 0
    },
    // 'cheaperBuildings': {
    //     text: 'Rickety',
    //     tooltipDesc: 'Building Cost (-5%)',
    //     cost: 2,
    //     level: 0
    // },
    'storageSpace': {
        text: 'Stuffed',
        tooltipDesc: 'Storage Space (+5%)',
        cost: 2,
        level: 0
    }
};

function hasPrestige(pres) {
    return getLevelOfPrestige(pres) > 0;
}

function getLevelOfPrestige(pres) {
    return prestige[pres].level;
}

function setPrestigeLevel(pres, level) {
    prestige[pres].level = level;
}

function setPrestigeCost(pres, cost) {
    prestige[pres].cost = cost;
}
module.exports = {
    prestige,
    hasPrestige,
    getLevelOfPrestige,
    setPrestigeCost,
    setPrestigeLevel
};