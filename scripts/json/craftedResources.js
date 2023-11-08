/* CRAFTING RESOURCES */
const { getMaterial } = require('../getMaterial');
const { getCraftedResource } = require('../getCraftedResource');
const { resources } = require('./resources');
const { passedStage } = require('../stages');


const craftedResources = {
    'sharprocks': {
        text: 'Sharp Rocks',
        id: 'craftSharprocks',
        value: 0,
        cost: { 'rocks': 2 },
        craftedOnce: false,
        requiredStage: "rocks",
        tooltipDesc: 'Craft a rock using nothing but rocks!',
        tooltipCost: 'Rocks: 5',
        class: 'craftRocks'
        // tool: 'Bare Hands'
    },
    'rope': {
        id: 'craftRope',
        value: 0,
        cost: { 'vines': 3 },
        craftedOnce: false,
        requiredStage: "rocks",
        tooltipDesc: 'The basis of attaching things to other things.',
        tooltipCost: 'Vines: 3',
        class: 'craftRocks'
        // tool: 'Bare Hands'
    },
    'handle': {
        id: 'craftHandle',
        value: 0,
        cost: { 'sticks': 2 },
        craftedOnce: false,
        requiredStage: "rocks",
        tooltipDesc: 'Shear off that bark to hold it better',
        tooltipCost: 'Sharp Rocks: 1',
        class: 'craftRocks'
        // tool: 'Sharp Rock'
    },
    'staff': {
        id: 'craftStaff',
        value: 0,
        cost: { 'handle': 2, 'rope': 1 },
        craftedOnce: false,
        requiredStage: "rocks",
        tooltipDesc: 'Stick some sheared sticks together',
        tooltipCost: 'Handles: 2',
        class: 'rope'
        // tool: 'Bare Hands'
    },
    'fishingrod': {
        id: 'craftFishingrod',
        text: 'Fishing Rod',
        value: 0,
        cost: { 'staff': 1, 'rope': 2 },
        craftedOnce: false,
        requiredStage: "fishing",
        tooltipDesc: 'A weapon feared by underwater life',
        tooltipCost: '',
        class: 'rope'
        // tool: 'Bare Hands'
    },
    'spear': {
        id: 'craftSpear',
        value: 0,
        cost: {
            'staff': 1,
            'sharprocks': 1,
            'rope': 1,
        },
        craftedOnce: false,
        requiredStage: "rocks",
        tooltipDesc: 'A long and pointy stick',
        tooltipCost: 'Staffs: 1',
        class: 'rope'
        // tool: 'Bare Hands'
    },
    'axe': {
        id: 'craftAxe',
        value: 0,
        cost: { 'handle': 1, 'rope': 1, 'sharprocks': 2 },
        craftedOnce: false,
        requiredStage: "spear",
        tooltipDesc: 'Put a rock straight through that handle',
        tooltipCost: 'Spears: 1',
        class: 'rope'
        // tool: 'Bare Hands'
    },
    'pickaxe': {
        id: 'craftPickaxe',
        value: 0,
        cost: {
            'handle': 1,
            'sharprocks': 3,
            'rope': 1,
            'rocks': 10
        },
        craftedOnce: false,
        requiredStage: "spear",
        tooltipDesc: 'Sadly not made of diamonds',
        tooltipCost: 'Axes: 1',
        class: 'rope'
    },

    'glass': {
        id: 'craftGlass',
        value: 0,
        cost: { 'sand': 10 },
        craftedOnce: false,
        tooltipDesc: 'You can see right through it!',
        requiredStage: "glassBlowing"
    },
    'paper': {
        id: 'craftPaper',
        value: 0,
        cost: { 'wood': 12 },
        craftedOnce: false,
        tooltipDesc: 'Outsource your memory',
        requiredStage: "paper",
    },
    'gold': {
        id: 'craftGold',
        value: 0,
        cost: { 'ore': 100 },
        craftedOnce: false,
        requiredStage: "metalWorking",
        tooltipDesc: "There's some yellow bits in this ore",
        tooltipCost: '',
        class: 'metalWorking'
    },
    'iron': {
        id: 'craftIron',
        value: 0,
        cost: { 'ore': 20 },
        craftedOnce: false,
        requiredStage: "metalWorking",
        tooltipDesc: "There's some sturdy-looking bits in this ore",
        tooltipCost: '',
        class: 'metalWorking'
    },
    'silver': {
        id: 'craftSilver',
        value: 0,
        cost: { 'ore': 50 },

        craftedOnce: false,
        requiredStage: "metalWorking",
        tooltipDesc: "There's some shiny gray bits in this ore",
        tooltipCost: '',
        class: 'metalWorking'
    },
    'bricks': {
        id: 'craftBricks',
        value: 0,
        cost: { 'clay': 15 },
        craftedOnce: false,
        requiredStage: "clay",
        tooltipDesc: "Leave some clay by the fire",
        tooltipCost: ''
    },
    'steel': { value: 0, cost: { 'iron': 5 } },
    'beams': { value: 0, cost: { 'wood': 10 } },
    'crates': { value: 0, cost: { 'wood': 15 } },
    'nails': { value: 0, cost: { 'iron': 1 } },
    'slabs': { value: 0, cost: { 'rocks': 20 } },
    'medicine': { value: 0, cost: { 'herbs': 50 } },
    'leather': { value: 0, cost: { 'hides': 10 } },
    'concrete': { value: 0, cost: { 'sand': 32 } },
    'wood': { value: 0, cost: { 'sticks': 8 } },
    'sticks': { value: 0, cost: { 'wood': .1 } },
};

function getCraftedResourceConfigById(id) {
    for (const [c, val] of Object.entries(craftedResources)) {
        if (val.id + "Button" === id) {
            return val;
        }
    }
    return null;
}

function getCraftedResourceKeyByConfig(config) {
    for (let k in craftedResources) {
        // console.log(k);
        if (craftedResources[k].id + 'Button' === config.id) return k;
    }
    return null;
}

module.exports = {
    craftedResources,
    getCraftedResourceConfigById,
    getCraftedResourceKeyByConfig
};