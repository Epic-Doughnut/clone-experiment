const buildings = {
    "shelter": {
        "cost": {
            "wood": 30
        },
        "effects": {
            "clones": {
                "max": 1
            }
        },
        "boost": {},
        "count": 0,
        "ratio": 1.3
    },
    "shed": {
        "cost": {
            "wood": 40
        },
        "effects": {
            "wood": {
                "max": 50
            },
            "sticks": {
                "max": 50
            },
            "rocks": {
                "max": 20
            }
        },
        "boost": {},
        "count": 0,
        "ratio": 1.1
    },
    "fish_traps": {
        "cost": {
            "rope": 40
        },
        "effects": {},
        "boost": {
            "fish": {
                "multiplier": 1.2
            }
        },
        "count": 0,
        "ratio": 1.2
    },
    "drying_racks": {
        "cost": {
            "sticks": 30,
            "fish": 5
        },
        "effects": {
            "fish": {
                "max": 20
            }
        },
        "boost": {},
        "count": 0,
        "ratio": 1.1
    },
    "mine": {
        "cost": {
            "rocks": 30,
            "wood": 30
        },
        "effects": {},
        "boost": {
            "ore": {
                "multiplier": 1.05
            }
        },
        "count": 0,
        "ratio": 1.2
    },
    "campfire": {
        "cost": {
            "rocks": 20,
            "sticks": 20
        },
        "effects": {},
        "boost": { 'all': { 'multiplier': 1.05 } },
        "count": 0,
        "ratio": 1.5
    },
    "house": {
        "cost": {
            "wood": 50,
            "rocks": 20
        },
        "effects": {
            "clones": {
                "max": 2
            }
        },
        "boost": {},
        "count": 0,
        "ratio": 1.4
    },
    "lumber_yard": {
        "cost": {
            "wood": 60,
            "iron": 5
        },
        "effects": {},
        "boost": {
            "wood": {
                "multiplier": 1.25
            }
        },
        "count": 0,
        "ratio": 1.3
    },
    "stone_quarry": {
        "cost": {
            "rocks": 50,
            "wood": 20,
            "rope": 30
        },
        "effects": {},
        "boost": {
            "rocks": {
                "multiplier": 1.3
            }
        },
        "count": 0,
        "ratio": 1.3
    },
    "fishery": {
        "cost": {
            "wood": 40,
            "rope": 15
        },
        "effects": {},
        "boost": {
            "fish": {
                "multiplier": 1.4
            }
        },
        "count": 0,
        "ratio": 1.2
    },
    "vineyard": {
        "cost": {
            "wood": 50,
            "vines": 20
        },
        "effects": {},
        "boost": {
            "vines": {
                "multiplier": 1.3
            }
        },
        "count": 0,
        "ratio": 1.2
    },
    "observatory": {
        "cost": {
            "rocks": 70,
            "wood": 30,
            "glass": 50,
            "ponder": 50
        },
        "effects": {},
        "boost": {
            "ponder": {
                "multiplier": 1.4
            }
        },
        "count": 0,
        "ratio": 1.3
    },
    "forge": {
        "cost": {
            "rocks": 40,
            "ore": 20,
            "wood": 100
        },
        "effects": {},
        "boost": {
            "ore": {
                "multiplier": 1.5
            }
        },
        "count": 0,
        "ratio": 1.2
    },
    "workshop": {
        "cost": {
            "wood": 40,
            "sticks": 20,
            "rocks": 10
        },
        "effects": {},
        "boost": {},
        "count": 0,
        "ratio": 1.2
    },
    "library": {
        "cost": {
            "wood": 70,
            "paper": 25,
            "glass": 5,
            "ponder": 25
        },
        "effects": {},
        "boost": {
            "ponder": {
                "multiplier": 1.5
            }
        },
        "count": 0,
        "ratio": 1.3
    },
    "desk": {
        "cost": {
            "wood": 15,
            "sticks": 20,
            "ponder": 10
        },
        "effects": { "ponder": { "max": 30 } },
        "boost": { "ponder": { "multiplier": 1.05 } },
        "count": 0,
        "ratio": 1.2
    }
}