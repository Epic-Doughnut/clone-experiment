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
        tooltipDesc: "For when you need a home away from home."
    },
    'hut': {
        basecost: { 'sticks': 50, 'vines': 30 },
        'effects': { 'clones': 1 },
        boost: {},
        count: 0,
        ratio: 1.2,
        tooltipDesc: 'A cozy, idyllic chunk of wood.'
    },
    "house": {
        "basecost": { "wood": 50, "rocks": 20 },
        "effects": { "clones": 2 },
        "boost": {},
        "count": 0,
        "ratio": 1.4,
        tooltipDesc: "Every clone's dream. Minus the white picket fence."
    },
    'teepee': {
        basecost: { 'wood': 10, 'hides': 25 },
        effects: { 'clones': 2 },
        boost: {},
        count: 0,
        ratio: 1.5,
        tooltipDesc: "Wrap some hides around some wood and call it a home."
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
        tooltipDesc: "The ultimate storage solution for the pack rat in you."
    },
    'stockpile': {
        basecost: { rocks: 30 },
        effects: { wood: 100 },
        ratio: 1.1,
        boost: {},
        count: 0,
        tooltipDesc: "Chuck a bunch of logs in a pile, what could happen?"
    },
    "drying_racks": {
        "basecost": { "sticks": 30, "fish": 5 },
        "effects": { "fish": 20 },
        "boost": {},
        "count": 0,
        "ratio": 1.1,
        tooltipDesc: "Air drying: Nature's way of preserving food."
    },
    "workshop": {
        "basecost": { "wood": 40, "sticks": 20, "rocks": 10 },
        "effects": { 'rocks': 50, 'ore': 50, 'sand': 100 },
        "boost": {},
        "count": 0,
        "ratio": 1.2,
        tooltipDesc: "DIY's dream destination."
    },
    'barn': {
        'basecost': { 'wood': 30, 'wheat': 5 },
        'effects': { 'wheat': 100, 'berries': 40, 'vines': 40 },
        'boost': {},
        'count': 0,
        'ratio': 1.2,
        tooltipDesc: "Hay, what's in that building?"
    },
    'herbalist_hut': {
        basecost: { 'sticks': 50, 'vines': 50, 'herbs': 50 },
        effects: { 'herbs': 100, 'vines': 100 },
        boost: { 'herbs': 1.2, vines: 1.1 },
        count: 0,
        ratio: 1.2,
        tooltipDesc: "A place for brewing and stewing."
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
        "tooltipDesc": "Freshly baked bread, hot and ready."
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
        tooltipDesc: "A place to put those lesser than you."
    },


    /**
     * PRODUCTION BOOST
     */
    "grove": {
        basecost: { 'wood': 20, 'vines': 20 },
        effects: {},
        boost: { 'wood': 1.1 },
        count: 0,
        ratio: 1.2,
        tooltipDesc: "A nice grove of trees to find wood faster."
    },
    "fish_traps": {
        "basecost": {
            "rope": 40
        },
        "effects": {},
        "boost": {
            "fish": 1.2
        },
        "count": 0,
        "ratio": 1.2,
        tooltipDesc: "Fishing made easy. No patience required."
    },
    "mine": {
        "basecost": {
            "rocks": 30,
            "wood": 30
        },
        "effects": {},
        "boost": {
            "ore": 1.05
        },
        "count": 0,
        "ratio": 1.2,
        tooltipDesc: "Dig deep and find your inner ore."
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
        tooltipDesc: "Where stories are told and marshmallows are toasted."
    },
    "lumber_yard": {
        "basecost": {
            "wood": 60,
            "iron": 5
        },
        "effects": {},
        "boost": {
            "wood": 1.25
        },
        "count": 0,
        "ratio": 1.3,
        tooltipDesc: "Wood you like some more wood?"
    },
    "stone_quarry": {
        "basecost": {
            "rocks": 50,
            "wood": 20,
            "rope": 30
        },
        "effects": {},
        "boost": {
            "rocks": 1.3
        },
        "count": 0,
        "ratio": 1.3,
        tooltipDesc: "Rock on with your bad self!"
    },
    "fishery": {
        "basecost": {
            "wood": 40,
            "rope": 15
        },
        "effects": {},
        "boost": {
            "fish": 1.4
        },
        "count": 0,
        "ratio": 1.2,
        tooltipDesc: "Fish are friends. And food."
    },
    "vineyard": {
        "basecost": {
            "wood": 20,
            "vines": 50
        },
        "effects": {},
        "boost": {
            "vines": 1.3
        },
        "count": 0,
        "ratio": 1.2,
        tooltipDesc: "For the finest vines. What else would it grow?"
    },
    "forge": {
        "basecost": {
            "rocks": 40,
            "ore": 20,
            "wood": 100
        },
        "effects": {},
        "boost": {
            "ore": 1.5
        },
        "count": 0,
        "ratio": 1.2,
        tooltipDesc: "Melt, mold, and make marvelous metals."
    },
    'water_well': {
        'basecost': {
            'rocks': 30,
            'rope': 5,
            'wood': 10
        },
        'effects': { 'freshwater': 30 },
        'boost': {
            'freshwater': 1.2
        },
        'count': 0,
        'ratio': 1.4,
        tooltipDesc: "Fresh water on demand!"
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
        tooltipDesc: "See things from afar."
    },
    "tannery": {
        "basecost": {
            "wood": 60,
            "hides": 40
        },
        "effects": { 'hides': 50 },
        "boost": {
            "hides": 1.5
        },
        "count": 0,
        "ratio": 1.3,
        "tooltipDesc": "Treat hides to make quality leather."
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
            "berries": 1.4,
            "herbs": 1.4,
            'ore': 1.2
        },
        "count": 0,
        "ratio": 1.25,
        "tooltipDesc": "A bustling hub of trade and barter."
    },
    "windmill": {
        "basecost": {
            "wood": 100,
            "rocks": 60,
            "wheat": 50
        },
        "effects": {},
        "boost": {
            "wheat": 1.4
        },
        "count": 0,
        "ratio": 1.3,
        "tooltipDesc": "Grind grains efficiently with wind power."
    },



    /**
     * PONDER
     */
    "observatory": {
        "basecost": {
            "rocks": 70,
            "wood": 30,
            "glass": 50,
            "ponder": 50
        },
        "effects": {},
        "boost": {
            "ponder": 1.4
        },
        "count": 0,
        "ratio": 1.3,
        tooltipDesc: "Stargazing has never been so... productive?"
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
            "ponder": 1.5
        },
        "count": 0,
        "ratio": 1.3,
        tooltipDesc: "Knowledge is power. And a fire hazard if not stored properly."
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
        tooltipDesc: "A writer's block is no match for armor-piercing pencils!"
    }
}


module.exports = {
    buildings: buildings
};