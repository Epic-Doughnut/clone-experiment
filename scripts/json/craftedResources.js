/* CRAFTING RESOURCES */

const craftedResources = {
    'sharprocks': {
        text: 'Sharp Rocks',
        id: 'craftSharprocks',
        value: 0,
        cost: { 'rocks': 2 },
        craftedOnce: false,
        requirement: () => getMaterial('rocks') >= 5,
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
        requirement: () => getMaterial('vines') >= 3,
        tooltipDesc: 'The basis of attaching things to other things.',
        tooltipCost: 'Vines: 3',
        class: 'rope'
        // tool: 'Bare Hands'
    },
    'handle': {
        id: 'craftHandle',
        value: 0,
        cost: { 'sticks': 2 },
        craftedOnce: false,
        requirement: () => getCraftedResource('sharpRocks') >= 1,
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
        requirement: () => getCraftedResource('handle') >= 1,
        tooltipDesc: 'Stick some sheared sticks together',
        tooltipCost: 'Handles: 2',
        class: 'rope'
        // tool: 'Bare Hands'
    },
    'fishingrod': {
        id: 'craftFishingrod',
        value: 0,
        cost: { 'staff': 1, 'rope': 2 },
        craftedOnce: false,
        requirement: () => passedStage('fishing'),
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
            'sharpRocks': 1,
            'rope': 1,
        },
        craftedOnce: false,
        requirement: () => getCraftedResource('staff') >= 1,
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
        requirement: () => getCraftedResource('spear') >= 1,
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
            'sharpRocks': 3,
            'rope': 1,
            'rocks': 10
        },
        craftedOnce: false,
        requirement: () => getCraftedResource('axe') >= 1,
        tooltipDesc: 'Sadly not made of diamonds',
        tooltipCost: 'Axes: 1',
        class: 'rope'
    },

    'glass': {
        id: 'craftGlass',
        value: 0,
        cost: { 'sand': 10 },
        craftedOnce: false,
        requirement: () => passedStage("glassBlowing")
    },
    'paper': {
        id: 'craftPaper',
        value: 0,
        cost: { 'wood': 12 },
        craftedOnce: false,
        requirement: () => passedStage('paper'),
    },
    'gold': {
        id: 'craftGold',
        value: 0,
        cost: { 'ore': 100 },
        craftedOnce: false,
        requirement: () => passedStage('metalWorking'),
        tooltipDesc: "There's some yellow bits in this ore",
        tooltipCost: '',
        class: 'metalWorking'
    },
    'iron': {
        id: 'craftIron',
        value: 0,
        cost: { 'ore': 20 },
        craftedOnce: false,
        requirement: () => passedStage('metalWorking'),
        tooltipDesc: "There's some sturdy-looking bits in this ore",
        tooltipCost: '',
        class: 'metalWorking'
    },
    'silver': {
        id: 'craftSilver',
        value: 0,
        cost: { 'ore': 50 },

        craftedOnce: false,
        requirement: () => passedStage('metalWorking'),
        tooltipDesc: "There's some shiny gray bits in this ore",
        tooltipCost: '',
        class: 'metalWorking'
    },
    'bricks': {
        id: 'craftBricks',
        value: 0,
        cost: { 'clay': 15 },
        craftedOnce: false,
        requirement: () => getMaterial('clay') > 5,
        tooltipDesc: "Leave some clay by the fire",
        tooltipCost: ''
    }
}

module.exports = {
    craftedResources
};