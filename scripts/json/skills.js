const skills = {
    gathering: {
        exp: 0,
        level: 0,
        affectedResources: ['sticks', 'vines', 'sand', 'herbs', 'berries']
    },
    masonry: {
        exp: 0,
        level: 0,
        affectedResources: ['rocks', 'ore', 'clay'],
        needTools: [{ 'Pickaxe': ['ore'] }]
    },
    carpentry: {
        exp: 0,
        level: 0,
        affectedResources: ['wood', 'handle', 'staff', 'fishingrod'],
        needTools: [{ 'Axe': ['wood'] }]
    },
    thinking: {
        exp: 0,
        level: 0,
        affectedResources: ['ponder']
    },
    // smithing: {
    //     exp: 0,
    //     level: 0,
    //     affectedResources: ['axe', 'pickaxe', 'spear', 'glass', 'iron', 'silver', 'gold']
    // },
    farming: {
        exp: 0,
        level: 0,
        affectedResources: ['wheat', 'freshwater']
    },
    combat: {
        exp: 0,
        level: 0,
        affectedResources: ['violence']
    },
    fishing: {
        exp: 0,
        level: 0,
        affectedResources: ['fish']
    },
    hunting: {
        exp: 0,
        level: 0,
        affectedResources: ['hides', 'game']
    }
};

module.exports = {
    skills: skills
};