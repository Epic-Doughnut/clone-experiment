/* CRAFTING RESOURCES */
const { getMaterial } = require('../getMaterial');
const { getCraftedResource } = require('../getCraftedResource');
const { resources } = require('./resources');
const { passedStage } = require('../stages');


const craftedResources = {
    'sharprocks': {
        text: 'Sharp Rocks',
        id: 'craftSharprocksButton',
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
        id: 'craftRopeButton',
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
        id: 'craftHandleButton',
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
        id: 'craftStaffButton',
        value: 0,
        cost: { 'handle': 2, 'rope': 1 },
        craftedOnce: false,
        requiredStage: "rocks",
        tooltipDesc: 'Stick some sheared sticks together',
        tooltipCost: 'Handles: 2',
        class: 'rocks'
        // tool: 'Bare Hands'
    },
    'fishingrod': {
        id: 'craftFishingrodButton',
        text: 'Fishing Rod',
        value: 0,
        cost: { 'staff': 1, 'rope': 2 },
        craftedOnce: false,
        requiredStage: "fishing",
        tooltipDesc: 'A weapon feared by underwater life',
        tooltipCost: '',
        class: 'fishing'
        // tool: 'Bare Hands'
    },
    'spear': {
        id: 'craftSpearButton',
        value: 0,
        cost: {
            'staff': 1,
            'sharprocks': 1,
            'rope': 1,
        },
        craftedOnce: false,
        requiredStage: "rope",
        tooltipDesc: 'A long and pointy stick',
        tooltipCost: 'Staffs: 1',
        class: 'rope'
        // tool: 'Bare Hands'
    },
    'axe': {
        id: 'craftAxeButton',
        value: 0,
        cost: { 'handle': 1, 'rope': 1, 'sharprocks': 2 },
        craftedOnce: false,
        requiredStage: "spear",
        tooltipDesc: 'Put a rock straight through that handle',
        tooltipCost: 'Spears: 1',
        class: 'spear'
        // tool: 'Bare Hands'
    },
    'pickaxe': {
        id: 'craftPickaxeButton',
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
        class: 'spear'
    },

    'glass': {
        id: 'craftGlassButton',
        value: 0,
        cost: { 'sand': 10 },
        craftedOnce: false,
        tooltipDesc: 'You can see right through it!',
        requiredStage: "glassBlowing",
        class: 'glassBlowing'
    },
    'paper': {
        id: 'craftPaperButton',
        value: 0,
        cost: { 'wood': 12 },
        craftedOnce: false,
        tooltipDesc: 'Outsource your memory',
        requiredStage: "paper",
        class: 'paper'
    },
    'gold': {
        id: 'craftGoldButton',
        value: 0,
        cost: { 'ore': 100 },
        craftedOnce: false,
        requiredStage: "metalWorking",
        tooltipDesc: "There's some yellow bits in this ore",
        tooltipCost: '',
        class: 'metalWorking'
    },
    'iron': {
        id: 'craftIronButton',
        value: 0,
        cost: { 'ore': 20 },
        craftedOnce: false,
        requiredStage: "metalWorking",
        tooltipDesc: "There's some sturdy-looking bits in this ore",
        tooltipCost: '',
        class: 'metalWorking'
    },
    'silver': {
        id: 'craftSilverButton',
        value: 0,
        cost: { 'ore': 50 },

        craftedOnce: false,
        requiredStage: "metalWorking",
        tooltipDesc: "There's some shiny gray bits in this ore",
        tooltipCost: '',
        class: 'metalWorking'
    },
    'bricks': {
        id: 'craftBricksButton',
        value: 0,
        cost: { 'clay': 15 },
        craftedOnce: false,
        requiredStage: "clay",
        tooltipDesc: "Leave some clay by the fire",
        tooltipCost: '',
        class: 'clay'
    },
    'bread': {
        id: 'craftBreadButton',
        value: 0,
        cost: { wheat: 13 },
        craftedOnce: false,
        requiredStage: 'agriculture',
        tooltipDesc: "I'm gonna grind your wheat to make my bread!",
        tooltipcost: '',
        class: 'agriculture'
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
        if (val.id === id) {
            return val;
        }
    }
    return null;
}

function getCraftedResourceKeyByConfig(config) {
    for (let k in craftedResources) {
        // console.log(k);
        if (craftedResources[k].id === config.id) return k;
    }
    return null;
}

function resetCraftedResources() {
    for (const [key, val] of Object.entries(craftedResources)) {
        val.value = 0;
        val.craftedOnce = false;
    }
}

module.exports = {
    craftedResources,
    getCraftedResourceConfigById,
    getCraftedResourceKeyByConfig,
    resetCraftedResources
};