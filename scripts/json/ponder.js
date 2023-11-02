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
        cost: { 'ponder': 40 },
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
    // 'metalWorking': {
    //     id: 'ponderMetalWorking',
    //     isPondered: false,
    //     requirement: () => true,
    //     text: "Metal Working",
    //     tooltipDesc: "Start processing that ore",
    //     // cost: [{ material: 'ponder', amount: 100 }, { material: 'ore', amount: 50 }, { material: 'rocks', amount: 50 }]
    //     cost: { 'ponder': 100, 'ore': 50, 'rocks': 50 },
    // },
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
        tooltipDesc: "Increase building effects by 1%",
        cost: { 'ponder': 140 },
    },
    'agriculture': {
        id: 'ponderAgriculture',
        requirement: () => true,
        isPondered: false,
        text: "Agriculture",
        tooltipDesc: "Find some seeds from all those plants",
        cost: { 'ponder': 150 }
    },
    'combat': {
        id: 'ponderCombat',
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
        cost: { 'ponder': 140, 'fish': 50 }
    },
    'perksTab': {
        id: 'ponderPerksTab',
        requirement: () => true,
        isPondered: false,
        text: 'Perks',
        tooltipDesc: 'Maybe you as the original should specialize',
        cost: { 'ponder': 400 }
    },
    'autocraft': {
        id: "ponderAutocraft",
        requirement: () => true,
        isPondered: false,
        text: "Auto Craft",
        tooltipDesc: "Automatically craft resources when they reach the storage limit",
        cost: { 'ponder': 400, 'wood': 1000, 'rocks': 500, 'wheat': 1000 }
    },
    'finish': {
        id: 'ponderFinish',
        requirement: () => true,
        isPondered: false,
        text: "Finish the Game",
        tooltipDesc: "That's it. You're done",
        cost: { 'ponder': 1000 }
    },
    // 'exploration': {
    //     id: 'ponderExploration',
    //     isPondered: false,
    //     cost: [{
    //         material: 'ponder',
    //         amount: 160
    //     }]
    // },
    'trading': {
        id: 'ponderTrading',
        isPondered: false,
        text: "Trading",
        tooltipDesc: "You met someone! Time to trade with them.",
        cost: { 'gold': 10, 'ponder': 400 }
    },
    // 'science': {
    //     id: 'ponderScience',
    //     isPondered: false,
    //     cost: [{
    //         material: 'ponder',
    //         amount: 200
    //     }]
    // },
    // 'magic': {
    //     id: 'ponderMagic',
    //     isPondered: false,
    //     cost: [{
    //         material: 'ponder',
    //         amount: 220
    //     }]
    // },
    // 'diplomacy': {
    //     id: 'ponderDiplomacy',
    //     isPondered: false,
    //     cost: [{
    //         material: 'ponder',
    //         amount: 240
    //     }]
    // },
    // 'construction': {
    //     id: 'ponderConstruction',
    //     isPondered: false,
    //     cost: [{
    //         material: 'ponder',
    //         amount: 260
    //     }]
    // },
    // 'arts': {
    //     id: 'ponderArts',
    //     isPondered: false,
    //     cost: [{
    //         material: 'ponder',
    //         amount: 280
    //     }]
    // },
    // 'astronomy': {
    //     id: 'ponderAstronomy',
    //     isPondered: false,
    //     cost: [{
    //         material: 'ponder',
    //         amount: 300
    //     }]
    // }
};


module.exports = {
    ponders: ponders
};