const skills = {
    gathering: {
        exp: 0,
        level: 0,
        affectedResources: ['sticks', 'vines', 'sand']
    },
    masonry: {
        exp: 0,
        level: 0,
        affectedResources: ['rocks', 'ore'],
        needTools: [{ 'Pickaxe': ['ore'] }]
    },
    carpentry: {
        exp: 0,
        level: 0,
        affectedResources: ['wood', 'handle', 'staff', 'fishingRod'],
        needTools: [{ 'Axe': ['wood'] }]
    },
    thinking: {
        exp: 0,
        level: 0,
        affectedResources: ['ponder']
    },
    smithing: {
        exp: 0,
        level: 0,
        affectedResources: ['axe', 'pickaxe', 'spear', 'glass', 'iron', 'silver', 'gold']
    },
    farming: {
        exp: 0,
        level: 0,
        affectedResources: ['wheat']
    },
    combat: {
        exp: 0,
        level: 0,
        affectedResources: []
    },
    fishing: {
        exp: 0,
        level: 0,
        affectedResources: ['fish']
    }
};
