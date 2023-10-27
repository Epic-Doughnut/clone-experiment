/* CRAFTING RESOURCES */

const craftedResources = {
    'sharprocks': {
        id: 'craftRocks',
        value: 0,
        requires: [
            { material: 'rocks', amount: 2 }
        ],
        craftedOnce: false
        // tool: 'Bare Hands'
    },
    'rope': {
        id: 'craftRope',
        value: 0,
        requires: [
            { material: 'vines', amount: 3 }
        ],
        craftedOnce: false
        // tool: 'Bare Hands'
    },
    'handle': {
        id: 'craftHandle',
        value: 0,
        requires: [
            { material: 'sticks', amount: 1 }
        ],
        craftedOnce: false
        // tool: 'Sharp Rock'
    },
    'staff': {
        id: 'craftStaff',
        value: 0,
        requires: [
            { material: 'handle', amount: 2 },
            { material: 'rope', amount: 1 },
        ],
        craftedOnce: false
        // tool: 'Bare Hands'
    },
    'fishingrod': {
        id: 'craftFishingRod',
        value: 0,
        requires: [
            { material: 'staff', amount: 1 },
            { material: 'rope', amount: 2 }
        ],
        craftedOnce: false
        // tool: 'Bare Hands'
    },
    'spear': {
        id: 'craftSpear',
        value: 0,
        requires: [
            { material: 'staff', amount: 1 },
            { material: 'sharpRocks', amount: 1 },
            { material: 'rope', amount: 1 },
        ],
        craftedOnce: false
        // tool: 'Bare Hands'
    },
    'axe': {
        id: 'craftAxe',
        value: 0,
        requires: [
            { material: 'handle', amount: 1 },
            { material: 'sharpRocks', amount: 2 },
            { material: 'rope', amount: 1 },
        ],
        craftedOnce: false
        // tool: 'Bare Hands'
    },
    'pickaxe': {
        id: 'craftPickaxe',
        value: 0,
        requires: [
            { material: 'handle', amount: 1 },
            { material: 'sharpRocks', amount: 3 },
            { material: 'rope', amount: 1 },
            { material: 'rocks', amount: 10 }
        ],
        craftedOnce: false
    },

    'glass': {
        id: 'craftGlass',
        value: 0,
        requires: [
            { material: 'sand', amount: 10 }
        ],
        craftedOnce: false
    },
    'paper': {
        id: 'craftPaper',
        value: 0,
        requires: [
            { material: 'wood', amount: 12 }
        ],
        craftedOnce: false
    },
    'gold': {
        id: 'craftGold',
        value: 0,
        requires: [
            { material: 'ore', amount: 100 }
        ],
        craftedOnce: false
    },
    'iron': {
        id: 'craftIron',
        value: 0,
        requires: [
            { material: 'ore', amount: 20 }
        ],
        craftedOnce: false
    },
    'silver': {
        id: 'craftSilver',
        value: 0,
        requires: [
            { material: 'ore', amount: 50 }
        ],
        craftedOnce: false
    }
}
