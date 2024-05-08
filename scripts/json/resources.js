
// TODO: ADD REQUIREMENTS FOR EACH TO MAKE THEM VISIBLE
// or just display them when you get your first one?
const resources = {
    "clones": {
        "id": "makeClone",
        "value": 0,
        "isVisible": false,
        basemax: 0
    },

    "sticks": {
        "id": "gatherSticks",
        "isGetting": false,
        "isVisible": true,
        "activeText": "𓆱𓀜 Gathering Sticks",
        "defaultText": "𓆱 Gather Sticks",
        "value": 0,
        emoji: '𓀝',
        basemax: 50
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
        basemax: 50
    },
    "rocks": {
        "id": "gatherRocks",
        "isGetting": false,
        "isVisible": false,
        "activeText": "𓊖𓀩 Gathering Rocks",
        "defaultText": "𓊖 Gather Rocks",
        "value": 0,
        emoji: '𓀩',
        basemax: 30
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
        basemax: 10
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
        basemax: 40
    },
    "ponder": {
        "id": "gatherPonder",
        "isGetting": false,
        "isVisible": false,
        "activeText": "𓀁 Pondering",
        "defaultText": "𓀁 Ponder",
        emoji: '𓀁',
        "value": 0,
        basemax: 20
    },
    "ore": {
        "value": 0,
        "id": "gatherOre",
        "isGetting": false,
        "isVisible": false,
        "activeText": "𓉸𓁄 Mining Ore",
        "defaultText": "𓉸 Mine Ore",
        emoji: '𓁄',
        basemax: 20
    },
    "sand": {
        "value": 0,
        "id": "gatherSand",
        "isGetting": false,
        "isVisible": false,
        "activeText": "𓀩 Scooping Sand",
        "defaultText": "𓀩 Scoop Sand",
        emoji: '𓀩',
        basemax: 20
    },
    "wheat": {
        "value": 0,
        "id": "gatherWheat",
        "isGetting": false,
        "isVisible": false,
        "activeText": "𓀩 Harvesting Wheat",
        "defaultText": "𓀩 Harvest Wheat",
        emoji: '𓀝',
        basemax: 20
    },
    'freshwater': {
        'value': 0,
        'id': 'gatherFreshwater',
        'isGetting': false,
        'isVisible': false,
        'activeText': 'water',
        'defaultText': 'water',
        emoji: '𓀩',
        'basemax': 50
    },
    'hides': {
        'value': 0,
        'id': 'gatherHides',
        'isGetting': false,
        'isVisible': false,
        'activeText': 'water',
        'defaultText': 'water',
        emoji: '𓀎',
        'basemax': 50

    },
    'clay': {
        'value': 0,
        'id': 'gatherClay',
        'isGetting': false,
        'isVisible': false,
        'activeText': 'water',
        'defaultText': 'water',
        emoji: '𓀩',
        'basemax': 50
    },
    'herbs': {
        'value': 0,
        'id': 'gatherHerbs',
        'isGetting': false,
        'isVisible': false,
        'activeText': 'water',
        'defaultText': 'water',
        emoji: '𓀩',
        'basemax': 50
    },
    'game': {
        'value': 0,
        'id': 'gatherGame',
        'isGetting': false,
        'isVisible': false,
        'activeText': '𓃚𓀎 Hunting',
        'defaultText': '𓀎 Hunt',
        emoji: '𓀎',
        'basemax': 50
    },
    'husks': {
        value: 0,
        id: 'gatherHusks',
        isGetting: false,
        isVisible: false,
        activeText: '',
        defaultText: "",
        emoji: 'X',
        'basemax': 1000
    },
    'violence': {
        value: 0,
        id: 'gatherViolence',
        isGetting: false,
        isVisible: false,
        activeText: '',
        defaultText: '',
        emoji: '',
        basemax: 100
    }
};
function isResource(resource)
{
    // return resources[resource] !== null;
    return resource in resources;
}



function getResourceConfigById(id)
{
    for (let r in resources)
    {
        if (resources[r].id === id)
        {
            return resources[r];
        }
    }
    return null;
}

function resetResources()
{
    for (const [key, val] of Object.entries(resources))
    {
        val.value = 0;
    }
}

function getBaseMax(resource)
{
    return resources[resource].basemax;
}

/**
     * Get a resource key from an ID.
     * @param {string} id The id of a resource e.g. gatherGame
     * @returns Resource key e.g. game
     */
function getRKeyFromID(id)
{
    for (const [r, val] of Object.entries(resources))
    {
        if (val.id === id) return r;
    }
    return 'error ' + id;
}
module.exports = {
    resources,
    isResource,
    getResourceConfigById,
    resetResources,
    getBaseMax,
    getRKeyFromID
};

