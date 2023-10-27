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
    "wood": {
        "id": "gatherWood",
        "isGetting": false,
        "isVisible": false,
        "activeText": "Chopping Wood",
        "defaultText": "Chop Wood",
        "tools": [{ "tool": "Axe", "val": 1.5 }, { "tool": "Chainsaw", "val": 3 }],
        "value": 0,
        max: 40
    },

    "sticks": {
        "id": "gatherSticks",
        "isGetting": false,
        "isVisible": true,
        "activeText": "Gathering Sticks",
        "defaultText": "Gather Sticks",
        "value": 0,
        max: 50
    },
    "vines": {
        "id": "gatherVines",
        "isGetting": false,
        "isVisible": false,
        "activeText": "Gathering Vines",
        "defaultText": "Gather Vines",
        "tools": [{ "tool": "Axe", "val": 1.5 }],
        "value": 0,
        max: 50
    },
    "rocks": {
        "id": "gatherRocks",
        "isGetting": false,
        "isVisible": false,
        "activeText": "Gathering Rocks",
        "defaultText": "Gather Rocks",
        "value": 0,
        max: 30
    },
    "fish": {
        "id": "gatherFish",
        "isGetting": false,
        "isVisible": false,
        "activeText": "Gone Fishing",
        "defaultText": "Go Fish",
        "value": 0,
        "tools": [{ "tool": "Spear", "val": 1 }, { "tool": "Fishing Rod", "val": 2 }],
        max: 10
    },
    "ponder": {
        "id": "gatherPonder",
        "isGetting": false,
        "isVisible": false,
        "activeText": "Pondering",
        "defaultText": "Ponder",
        "value": 0,
        max: 50
    },
    "ore": {
        "value": 0,
        "id": "gatherOre",
        "isGetting": false,
        "isVisible": false,
        "activeText": "Mining Ore",
        "defaultText": "Mine Ore",
        max: 20
    },
    "sand": {
        "value": 0,
        "id": "gatherSand",
        "isGetting": false,
        "isVisible": false,
        "activeText": "Scooping Sand",
        "defaultText": "Scoop Sand",
        max: 20
    },
    "wheat": {
        "value": 0,
        "id": "gatherWheat",
        "isGetting": false,
        "isVisible": false,
        "activeText": "Mining Ore",
        "defaultText": "Mine Ore",
        max: 20
    }
}
