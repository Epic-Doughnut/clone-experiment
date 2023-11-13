const { hasPerk } = require("../perks");
const { recalcMaxClones } = require("../recalcMaxClones");
const { recalculateBuildingCost } = require("../recalculateBuildingCost");
const { updateBuildingButtonCount } = require("../updateBuildingButtonCount");

const buildings = {

    /**
     * HOUSING
     */
    "shelter": {
        "basecost": { "sticks": 30 },
        "effects": { "clones": 1 },
        "boost": {},
        "count": 0,
        "ratio": 1.3,
        tooltipDesc: "For when you need a home away from home.",
        emoji: '八'
    },
    'hut': {
        basecost: { 'sticks': 50, 'vines': 30 },
        'effects': { 'clones': 1 },
        boost: {},
        count: 0,
        ratio: 1.2,
        tooltipDesc: 'A cozy, idyllic chunk of wood.',
        emoji: '冂'
    },
    "house": {
        "basecost": { "wood": 50, "rocks": 20, 'fish': 10 },
        "effects": { "clones": 2 },
        "boost": {},
        "count": 0,
        "ratio": 1.4,
        tooltipDesc: "Every clone's dream. Minus the white picket fence.",
        emoji: '介'
    },
    'teepee': {
        basecost: { 'wood': 10, 'hides': 25, 'fish': 15 },
        effects: { 'clones': 2 },
        boost: {},
        count: 0,
        ratio: 1.5,
        tooltipDesc: "Wrap some hides around some wood and call it a home.",
        emoji: '穴'
    },
    'hospital': {
        basecost: { concrete: 10, medicine: 20, fish: 20 },
        effects: { 'clones': 3 },
        boost: {},
        count: 0,
        ratio: 1.6,
        tooltipDesc: 'Keep yourself safe.',
        emoji: '+'
    },

    /**
     * STORAGE
     */
    "shed": {
        "basecost": { "wood": 40 },
        "effects": { "wood": 50, "sticks": 50, "rocks": 20 },
        "boost": {},
        "count": 0,
        "ratio": 1.1,
        tooltipDesc: "The ultimate storage solution for the pack rat in you.",
        emoji: '个'
    },
    'stockpile': {
        basecost: { rocks: 30 },
        effects: { wood: 100 },
        ratio: 1.1,
        boost: {},
        count: 0,
        tooltipDesc: "Chuck a bunch of logs in a pile, what could happen?",
        emoji: '品'
    },
    "drying_racks": {
        "basecost": { "sticks": 30, "fish": 5 },
        "effects": { "fish": 20 },
        "boost": {},
        "count": 0,
        "ratio": 1.1,
        tooltipDesc: "Air drying: Nature's way of preserving food.",
        emoji: '四'
    },
    "workshop": {
        "basecost": { "wood": 40, "sticks": 20, "rocks": 10 },
        "effects": { 'rocks': 50, 'ore': 50, 'sand': 100, 'clay': 50 },
        "boost": {},
        "count": 0,
        "ratio": 1.2,
        tooltipDesc: "DIY's dream destination.",
        emoji: '𓎰'
    },
    'barn': {
        'basecost': { 'wood': 30, 'wheat': 5 },
        'effects': { 'wheat': 100, 'berries': 40, 'vines': 40 },
        'boost': {},
        'count': 0,
        'ratio': 1.2,
        tooltipDesc: "Hay, what's in that building?",
        emoji: '𓏆'
    },
    'herbalist_hut': {
        basecost: { 'sticks': 50, 'vines': 50, 'herbs': 50 },
        effects: { 'herbs': 100, 'vines': 100 },
        boost: { 'herbs': 1.2, vines: 1.1 },
        count: 0,
        ratio: 1.2,
        tooltipDesc: "A place for brewing and stewing.",
        emoji: '𓏃'
    },
    "bakery": {
        "basecost": {
            "wood": 80,
            "wheat": 100,
            "rocks": 40
        },
        "effects": { 'wheat': 200 },
        "boost": {},
        "count": 0,
        "ratio": 1.25,
        "tooltipDesc": "Freshly baked bread, hot and ready.",
        emoji: '𓏖'

    },
    "animal_pen": {
        basecost: {
            sticks: 50,
            game: 20,
            fish: 25
        },
        effects: { 'game': 100, 'hides': 30 },
        boost: {},
        count: 0,
        ratio: 1.2,
        tooltipDesc: "A place to put those lesser than you.",
        emoji: '皿'
    },
    'reservoir': {
        basecost: {
            rocks: 100,
            clay: 50,
            water: 10
        },
        effects: { 'water': 100 },
        boost: {},
        count: 0,
        ratio: 1.3,
        tooltipDesc: "A hole filled with water. Useful.",
        emoji: '𓈞'
    },
    'stone_depot': {
        basecost: {
            rocks: 200
        },
        effects: { 'rocks': 250 },
        boost: {},
        count: 0,
        ratio: 1.2,
        tooltipDesc: "A big stack of rocks.",
        emoji: '𓈓'
    },
    'warehouse': {
        basecost: {
            crates: 10,
            concrete: 20
        },
        effects: { 'wood': 100, 'rocks': 100, 'clay': 100, 'sand': 100 },
        boost: {},
        count: 0,
        ratio: 1.3,
        tooltipDesc: 'Put stuff in a box inside a larger box.',
        emoji: '𓇦'
    },



    /**
     * PRODUCTION BOOST
     */
    "grove": {
        basecost: { 'wood': 20, 'vines': 20 },
        effects: {},
        boost: { 'wood': 1.05, 'sticks': 1.1 },
        count: 0,
        ratio: 1.2,
        tooltipDesc: "A nice grove of trees to find wood faster.",
        emoji: '𓆭𓆭'
    },
    "fish_traps": {
        "basecost": {
            "rope": 40
        },
        "effects": {},
        "boost": {
            "fish": 1.05
        },
        "count": 0,
        "ratio": 1.2,
        tooltipDesc: "Fishing made easy. No patience required.",
        emoji: '井'
    },
    "mine": {
        "basecost": {
            "rocks": 30,
            "wood": 30
        },
        "effects": {},
        "boost": {
            "ore": 1.05, 'rocks': 1.05
        },
        "count": 0,
        "ratio": 1.2,
        tooltipDesc: "Dig deep and find your inner ore.",
        emoji: '𓊍'
    },
    "campfire": {
        "basecost": {
            "rocks": 20,
            "sticks": 20
        },
        "effects": {},
        "boost": { 'all': 1.05 },
        "count": 0,
        "ratio": 1.5,
        tooltipDesc: "Where stories are told and marshmallows are toasted.",
        emoji: '火'
    },
    "lumber_yard": {
        "basecost": {
            "wood": 200,
            "iron": 1
        },
        "effects": {},
        "boost": {
            "wood": 1.2
        },
        "count": 0,
        "ratio": 1.3,
        tooltipDesc: "Wood you like some more wood?",
        emoji: '𓌏'
    },
    "stone_quarry": {
        "basecost": {
            "rocks": 50,
            "wood": 20,
            "rope": 30
        },
        "effects": {},
        "boost": {
            "rocks": 1.1
        },
        "count": 0,
        "ratio": 1.3,
        tooltipDesc: "Rock on with your bad self!",
        emoji: '𓊎'
    },
    "fishery": {
        "basecost": {
            "wood": 40,
            "rope": 15
        },
        "effects": {},
        "boost": {
            "fish": 1.1
        },
        "count": 0,
        "ratio": 1.2,
        tooltipDesc: "Fish are friends. And food.",
        emoji: '𓌤'
    },
    "vineyard": {
        "basecost": {
            "wood": 20,
            "vines": 50
        },
        "effects": {},
        "boost": {
            "vines": 1.1
        },
        "count": 0,
        "ratio": 1.2,
        tooltipDesc: "For the finest vines. What else would it grow?",
        emoji: '🜌'
    },
    "forge": {
        "basecost": {
            "rocks": 40,
            "ore": 20,
            "wood": 100
        },
        "effects": {},
        "boost": {
            "ore": 1.2
        },
        "count": 0,
        "ratio": 1.2,
        tooltipDesc: "Melt, mold, and make marvelous metals.",
        emoji: '𓊫'
    },
    'water_pump': {
        'basecost': {
            'rocks': 30,
            'rope': 1,
            'wood': 10,
            'wheat': 2
        },
        'effects': { 'freshwater': 30 },
        'boost': {
            'freshwater': 1.1
        },
        'count': 0,
        'ratio': 1.4,
        tooltipDesc: "Fresh water on demand!",
        emoji: '𓏂'
    },
    'tower': {
        'basecost': {
            'bricks': 20,
            'rocks': 10,
            'wood': 30
        },
        'effects': {},
        'boost': { 'hides': 1.05, 'game': 1.1 },
        'count': 0,
        ratio: 1.3,
        tooltipDesc: "See things from afar.",
        emoji: '𓊢'
    },
    "tannery": {
        "basecost": {
            "wood": 60,
            "hides": 40
        },
        "effects": { 'hides': 50 },
        "boost": {
            "hides": 1.1
        },
        "count": 0,
        "ratio": 1.3,
        "tooltipDesc": "Treat hides to make quality leather.",
        emoji: '𓃔'
    },
    "marketplace": {
        "basecost": {
            "wood": 100,
            "rocks": 50,
            "berries": 40,
            "gold": 1
        },
        "effects": {},
        "boost": {
            "berries": 1.2,
            "herbs": 1.2,
            'ore': 1.1
        },
        "count": 0,
        "ratio": 1.25,
        "tooltipDesc": "A bustling hub of trade and barter.",
        emoji: '₿'
    },
    "windmill": {
        "basecost": {
            "wood": 100,
            "rocks": 60,
            "wheat": 50
        },
        "effects": {},
        "boost": {
            "wheat": 1.2
        },
        "count": 0,
        "ratio": 1.3,
        "tooltipDesc": "Grind grains efficiently with wind power.",
        emoji: '𓇬'
    },
    'garden': {
        basecost: {
            beams: 20,
            herbs: 20,
            berries: 50,
            freshwater: 10
        },
        effects: {},
        boost: { 'berries': 1.1, 'herbs': 1.1, 'sticks': 1.05 },
        count: 0,
        ratio: 1.3,
        tooltipDesc: "Nice nature, carefully cultivated.",
        emoji: '𓆷'
    },
    'sand_scoop': {
        basecost: { beams: 10, iron: 5 },
        effects: {},
        boost: { 'sand': 1.1 },
        count: 0,
        ratio: 1.2,
        tooltipDesc: 'Scoop the sand from the shore? Sure!',
        emoji: '𓄛'
    },
    'traps': {
        basecost: { nails: 10, sticks: 20, herbs: 20 },
        effects: {},
        boost: { 'game': 1.1 },
        count: 0,
        ratio: 1.2,
        tooltipDesc: "Watch your step!",
        emoji: '𓄦'
    },
    'rock_role': {
        basecost: { slabs: 20, freshwater: 30 },
        effects: {},
        boost: { 'rocks': 1.2 },
        count: 0,
        ratio: 1.3,
        tooltipDesc: 'In order to gather the rock you must become the rock.',
        emoji: '𓆇'
    },


    /**
     * PONDER
     */
    'telescope': {
        basecost: {
            glass: 1,
            wood: 10,
            ponder: 10
        },
        effects: {},
        boost: { ponder: 1.05 },
        count: 0,
        ratio: 1.2,
        tooltipDesc: "Look, up in the sky! It's a star!",
        emoji: '𓌩'
    },
    "observatory": {
        "basecost": {
            "bricks": 70,
            "wood": 30,
            "glass": 50,
            "ponder": 50
        },
        "effects": {},
        "boost": {
            "ponder": 1.2
        },
        "count": 0,
        "ratio": 1.3,
        tooltipDesc: "Stargazing has never been so... productive?",
        emoji: '☆'
    },
    "library": {
        "basecost": {
            "wood": 70,
            "paper": 25,
            "glass": 5,
            "ponder": 25
        },
        "effects": { "ponder": 50 },
        "boost": {
            "ponder": 1.1
        },
        "count": 0,
        "ratio": 1.3,
        tooltipDesc: "Knowledge is power. And a fire hazard if not stored properly.",
        emoji: '🕮'
    },
    "desk": {
        "basecost": {
            "wood": 15,
            "sticks": 20,
            "ponder": 10
        },
        "effects": { "ponder": 30 },
        "boost": { "ponder": 1.05 },
        "count": 0,
        "ratio": 1.2,
        tooltipDesc: "A writer's block is no match for armor-piercing pencils!",
        emoji: '𓊬'
    }
};

function getBuildingCount(buildingName) {
    return buildings[buildingName].count;
}

/**
 * 
 * @param {string} buildingName 
 * @param {string} resource 
 * @returns 
 */
function getBoost(buildingName, resource) {
    const building = buildings[buildingName];

    if (building && building.boost) {
        if (building.boost[resource]) return building.boost[resource];
        if (building.boost['all']) return building.boost['all'];
    }
    return null;
}



function resetBuildings() {
    for (const [key, val] of Object.entries(buildings)) {
        val['count'] = 0;
        // Update button text
        updateBuildingButtonCount(key, 0);

        // Update the cost of the building
        recalculateBuildingCost(key, buildings, hasPerk);

    }
    // Update max clones after updating the count
    recalcMaxClones();
}

function isPopBuilding(buildingName) {
    switch (buildingName) {
        case 'shelter':
        case 'hut':
        case 'house':
        case 'teepee':
            return true;
            break;
        default:
            return false;
            break;
    }
}


module.exports = {
    buildings,
    getBuildingCount,
    getBoost,
    resetBuildings,
    isPopBuilding
};