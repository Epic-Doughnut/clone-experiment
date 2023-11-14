// State of each resource

// TODO: ADD REQUIREMENTS FOR EACH TO MAKE THEM VISIBLE
// or just display them when you get your first one?
const resources = {
    "clones": {
        "id": "makeClone",
        "value": 0,
        "isVisible": false,
        max: 0
    },

    "sticks": {
        "id": "gatherSticks",
        "isGetting": false,
        "isVisible": true,
        "activeText": "𓆱𓀜 Gathering Sticks",
        "defaultText": "𓆱 Gather Sticks",
        "value": 0,
        emoji: '𓀝',
        max: 50
    },
    "vines": {
        "id": "gatherVines",
        "isGetting": false,
        "isVisible": false,
        "activeText": "𓍯𓀪 Gathering Vines",
        "defaultText": "𓍯 Gather Vines",
        "tools": [{ "tool": "Axe", "val": 1.5 }],
        "value": 0,
        emoji: '𓀪',
        max: 50
    },
    "rocks": {
        "id": "gatherRocks",
        "isGetting": false,
        "isVisible": false,
        "activeText": "𓊖𓀩 Gathering Rocks",
        "defaultText": "𓊖 Gather Rocks",
        "value": 0,
        emoji: '𓀩',
        max: 30
    },
    "fish": {
        "id": "gatherFish",
        "isGetting": false,
        "isVisible": false,
        "activeText": "𓆝𓆟𓆞 𓁃 Gone Fishing",
        "defaultText": "𓆝𓆟𓆞 Go Fish",
        "value": 0,
        emoji: '𓁃',
        "tools": [{ "tool": "Spear", "val": 1 }, { "tool": "Fishing Rod", "val": 2 }],
        max: 10
    },
    "wood": {
        "id": "gatherWood",
        "isGetting": false,
        "isVisible": false,
        "activeText": "𓀨 Chopping Wood",
        "defaultText": "𓌏 Chop Wood",
        emoji: '𓀨',
        "tools": [{ "tool": "Axe", "val": 1.5 }, { "tool": "Chainsaw", "val": 3 }],
        "value": 0,
        max: 40
    },
    "ponder": {
        "id": "gatherPonder",
        "isGetting": false,
        "isVisible": false,
        "activeText": "𓀁 Pondering",
        "defaultText": "𓀁 Ponder",
        emoji: '𓀁',
        "value": 0,
        max: 20
    },
    "ore": {
        "value": 0,
        "id": "gatherOre",
        "isGetting": false,
        "isVisible": false,
        "activeText": "𓉸𓁄 Mining Ore",
        "defaultText": "𓉸 Mine Ore",
        emoji: '𓁄',
        max: 20
    },
    "sand": {
        "value": 0,
        "id": "gatherSand",
        "isGetting": false,
        "isVisible": false,
        "activeText": "𓀩 Scooping Sand",
        "defaultText": "𓀩 Scoop Sand",
        emoji: '𓀩',
        max: 20
    },
    "wheat": {
        "value": 0,
        "id": "gatherWheat",
        "isGetting": false,
        "isVisible": false,
        "activeText": "𓀩 Harvesting Wheat",
        "defaultText": "𓀩 Harvest Wheat",
        emoji: '𓀝',
        max: 20
    },
    'freshwater': {
        'value': 0,
        'id': 'gatherFreshwater',
        'isGetting': false,
        'isVisible': false,
        'activeText': 'water',
        'defaultText': 'water',
        emoji: '𓀩',
        'max': 50
    },
    'hides': {
        'value': 0,
        'id': 'gatherHides',
        'isGetting': false,
        'isVisible': false,
        'activeText': 'water',
        'defaultText': 'water',
        emoji: '𓀎',
        'max': 50

    },
    'clay': {
        'value': 0,
        'id': 'gatherClay',
        'isGetting': false,
        'isVisible': false,
        'activeText': 'water',
        'defaultText': 'water',
        emoji: '𓀩',
        'max': 50
    },
    'berries': {

        'value': 0,
        'id': 'gatherBerries',
        'isGetting': false,
        'isVisible': false,
        'activeText': 'water',
        'defaultText': 'water',
        emoji: '𓀩',
        'max': 50
    },
    'herbs': {
        'value': 0,
        'id': 'gatherHerbs',
        'isGetting': false,
        'isVisible': false,
        'activeText': 'water',
        'defaultText': 'water',
        emoji: '𓀩',
        'max': 50
    },
    'game': {
        'value': 0,
        'id': 'gatherGame',
        'isGetting': false,
        'isVisible': false,
        'activeText': '𓃚𓀎 Hunting',
        'defaultText': '𓀎 Hunt',
        emoji: '𓀎',
        'max': 50
    },
    'husks': {
        value: 0,
        id: 'gatherHusks',
        isGetting: false,
        isVisible: false,
        activeText: '',
        defaultText: "",
        emoji: 'X',
        'max': 1000
    },
    'violence': {
        value: 0,
        id: 'gatherViolence',
        isGetting: false,
        isVisible: false,
        activeText: '',
        defaultText: '',
        emoji: '',
        max: 100
    }
};
function isResource(resource) {
    // return resources[resource] !== null;
    return resource in resources;
}



function getResourceConfigById(id) {
    for (let r in resources) {
        if (resources[r].id === id) {
            return resources[r];
        }
    }
    return null;
}

function resetResources() {
    for (const [key, val] of Object.entries(resources)) {
        val.value = 0;
    }
}
module.exports = {
    resources: resources,
    isResource,
    getResourceConfigById,
    resetResources
};