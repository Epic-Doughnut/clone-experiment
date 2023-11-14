let ponders = {
    'ponder1': {
        id: 'ponderPonder1',
        isPondered: false,
        cost: { 'ponder': 10 },
        text: "Think Harder",
        tooltipDesc: "5% boost to pondering",
        requirement: () => true,

    },
    'jobs-tab': {
        id: 'ponderJobs-tab',
        isPondered: false,
        cost: { 'ponder': 20 },
        text: "Understand Cloning",
        tooltipDesc: 'Why are there two of you?',
        requirement: () => true,
        tooltipCost: 'Sanity (20 Ponder)',

    },
    'skillsTable': {
        id: 'ponderSkillsTable',
        isPondered: false,
        cost: { 'ponder': 50 },
        tooltipDesc: "You're starting to learn things, right?",
        requirement: () => true,
        text: "Notice Improvement"
    },
    'fishing': {
        id: 'ponderFishing',
        isPondered: false,
        cost: { 'ponder': 50, 'fish': 50 },
        tooltipDesc: "What if... your clones could go fishing?",
        requirement: () => true,
        text: "Fishing Job"
    },
    // 'micromanagement': {
    //     id: 'ponderMicromanagement',
    //     isPondered: false,
    //     cost: { 'ponder': 200, 'clones': 5 },
    //     text: "Micromanagement",
    //     requirement: () => true,
    //     tooltipDesc: "You managed to make clones manage each other."
    // },
    'fasterSkills': {
        id: 'ponderFasterSkills',
        isPondered: false,
        cost: { 'ponder': 80 },
        requirement: () => true,
        text: "Skills I",
        tooltipDesc: "Think Smarter. 5% bonus to skill exp"
    },
    'thinking': {
        id: 'ponderThinking',
        isPondered: false,
        cost: { 'ponder': 150 },
        text: "Thinking Job",
        requirement: () => true,
        tooltipDesc: "Let your clones start thinking for themselves."

    },
    'fasterResourceGain': {
        id: 'ponderFasterResourceGain',
        isPondered: false,
        cost: { 'ponder': 120 },
        requirement: () => true,
        text: "Productivity I",
        tooltipDesc: "Just work harder. 5% bonus to resource gain"
    },
    'metalWorking': {
        id: 'ponderMetalWorking',
        isPondered: false,
        requirement: () => true,
        text: "Metal Working",
        tooltipDesc: "Start processing that ore",
        // cost: [{ material: 'ponder', amount: 100 }, { material: 'ore', amount: 50 }, { material: 'rocks', amount: 50 }]
        cost: { 'ponder': 100, 'ore': 50, 'rocks': 50 },
    },
    'glassBlowing': {
        id: 'ponderGlassBlowing',
        isPondered: false,
        requirement: () => true,
        text: 'Glass Blowing',
        tooltipDesc: 'Huff and puff and make a cool vase',
        cost: { 'sand': 20, 'ponder': 80 }
    },
    'organization': {
        id: 'ponderOrganization',
        isPondered: false,
        requirement: () => true,
        text: 'Organized Storage',
        tooltipDesc: 'Organize your storage by groups',
        cost: { 'ponder': 200 }
    },
    'paper': {
        id: 'ponderPaper',
        isPondered: false,
        requirement: () => true,
        text: 'Paper Processing',
        tooltipDesc: 'Smash down some wood into paper',
        cost: { 'ponder': 200, 'wood': 100 }
    },
    'autoClone': {
        id: 'ponderAutoClone',
        requirement: () => true,
        isPondered: false,
        text: "Auto Clone",
        tooltipDesc: "Automatically produce clones",
        cost: { 'ponder': 140, 'clones': 20 },
    },

    'effectiveBuildings': {
        id: 'ponderEffectiveBuildings',
        requirement: () => true,
        isPondered: false,
        text: "Buildings I",
        tooltipDesc: "Increase building effects by 3%",
        cost: { 'ponder': 180 },
    },
    'agriculture': {
        id: 'ponderAgriculture',
        requirement: () => true,
        isPondered: false,
        text: "Agriculture",
        tooltipDesc: "Find some seeds from all those plants",
        cost: { 'ponder': 180 }
    },
    'combatTab': {
        id: 'ponderCombatTab',
        requirement: () => true,
        isPondered: false,
        text: "Combat",
        tooltipDesc: "Is there anyone to spar with besides you?",
        cost: { 'ponder': 300, 'spear': 100 }
    },
    'hunting': {
        id: 'ponderHunting',
        requirement: () => true,
        isPondered: false,
        text: "Hunting",
        tooltipDesc: "At least there are animals",
        cost: { 'ponder': 200, 'fish': 50 }
    },
    'perksTab': {
        id: 'ponderPerksTab',
        requirement: () => true,
        isPondered: false,
        text: 'Perks',
        tooltipDesc: 'Maybe you as the original should specialize',
        cost: { 'ponder': 400 }
    },
    // 'autocraft': {
    //     id: "ponderAutocraft",
    //     requirement: () => true,
    //     isPondered: false,
    //     text: "Auto Craft",
    //     tooltipDesc: "Automatically craft resources when they reach the storage limit",
    //     cost: { 'ponder': 400, 'wood': 1000, 'rocks': 500, 'wheat': 1000 }
    // },
    'factoryTab': {
        id: 'ponderFactoryTab',
        requirement: () => true,
        isPondered: false,
        text: "Factories",
        tooltipDesc: "Ascend to the next level of economy",
        cost: { 'ponder': 500, 'gold': 10, 'wood': 1000, 'wheat': 1000, 'rocks': 1000 }
    },
    'ponder2': {
        id: 'ponderPonder2',
        requirement: () => true,
        isPondered: false,
        text: "Think even harder",
        tooltipDesc: "5% boost to pondering",
        cost: { 'ponder': 300 }
    },
    'ponder3': {
        id: 'ponderPonder3',
        requirement: () => true,
        isPondered: false,
        text: "Think hardest",
        tooltipDesc: "5% boost to pondering",
        cost: { 'ponder': 600 }
    },
    'biggerShelter': {
        id: 'ponderBiggerShelter',
        requirement: () => true,
        isPondered: false,
        text: "Expand Shelter",
        tooltipDesc: "Shelters can house 1 more clone each",
        cost: { 'ponder': 500, 'sticks': 1000 }
    },
    'biggerHut': {
        id: 'ponderBiggerHut',
        requirement: () => true,
        isPondered: false,
        text: "Expand Hut",
        tooltipDesc: "Huts can house 1 more clone each",
        cost: { 'ponder': 750, 'sticks': 1500, 'vines': 1000 }
    },
    'biggerHouse': {
        id: 'ponderBiggerHouse',
        requirement: () => true,
        isPondered: false,
        text: "Two-story houses",
        tooltipDesc: "Houses can house 2 more clones each",
        cost: { 'ponder': 1000, 'wood': 2000, 'rocks': 2000 }
    },
    'biggerTeepee': {
        id: 'ponderBiggerTeepee',
        requirement: () => true,
        isPondered: false,
        text: "Double diameter Teepees",
        tooltipDesc: "Teepees can house 4 more clones each",
        cost: { 'ponder': 1250, 'wood': 3000, 'hides': 1500 }
    },
    'evenBiggerShelter': {
        id: 'ponderEvenBiggerShelter',
        requirement: () => true,
        isPondered: false,
        text: "Expand Shelter Again",
        tooltipDesc: "Shelters can house 1 more clone each",
        cost: { 'ponder': 1500, 'sticks': 3000, 'fish': 1000 }
    },
};

function resetPonders() {
    for (const [key, val] of Object.entries(ponders)) {
        val.isPondered = false;
    }
}

module.exports = {
    ponders: ponders,
    resetPonders
};