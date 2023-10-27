/* BUTTONS */
const buttons = {

    /* PRODUCTION TAB */
    'gatherSticks': {
        class: 'tooltip startVisible',
        tab: 'production',
        text: 'Gather Sticks',
        tooltipDesc: 'Five, Six, Pick up sticks.',
        tooltipCost: 'Free',
        requirement: () => true,
        hide: () => false // This button is always visible
    },
    'gatherVines': {
        class: 'tooltip stick',
        tab: 'production',
        text: 'Gather Vines',
        tooltipDesc: 'Some vines are rubbery, others are gummy.',
        tooltipCost: 'Free',
        requirement: () => getMaterial('sticks') >= 10 || passedStage('vines'),
        hide: () => false
    },
    'gatherRocks': {
        class: 'tooltip stick',
        tab: 'production',
        text: 'Gather Rocks',
        tooltipDesc: 'Not a single window to throw them through.',
        tooltipCost: 'Free',
        requirement: () => getMaterial('vines') >= 10 || passedStage('rocks'),
        hide: () => false
    },
    'gatherFish': {
        class: 'tooltip fishing',
        tab: 'production',
        text: 'Go Fish',
        tooltipDesc: 'Got any tuna?',
        tooltipCost: 'Free',
        requirement: () => hasTool('Spear') || hasTool("Fishing Rod") || passedStage('fishing'),
        hide: () => false
    },
    'gatherWood': {
        class: 'woodToggle wood',
        tab: 'production',
        text: 'Chop Wood',
        tooltipDesc: 'An axe hurts way less than using your hands.',
        requirement: () => hasTool('Axe') || passedStage('wood'),
        hide: () => false
    },
    'gatherOre': {
        "class": "tooltip ",
        "tab": "production",
        "text": "Mine Ore",
        "tooltipDesc": "Diggy Diggy Hole",
        "tooltipCost": "Free",
        requirement: () => hasTool('Pickaxe') || passedStage('ore'),
        hide: () => false
    },



    /* TABS */
    'productionTabButton': {
        class: 'tab-button',
        text: 'Production',
        showTab: 'productionTab',
        tab: 'tabs',
        requirement: () => passedStage('tab-button'),
        hide: () => false
    },
    'experimentTabButton': {
        class: 'tab-button',
        text: 'Experiment',
        showTab: 'experimentTab',
        tab: 'tabs',
        requirement: () => passedStage('tab-button'),
        hide: () => false
    },
    'ponderTabButton': {
        class: 'tab-button',
        text: 'Ponder',
        showTab: 'ponderTab',
        tab: 'tabs',
        requirement: () => passedStage('ponder-tab'),
        hide: () => false
    },
    'jobsTabButton': {
        class: 'tab-button',
        text: 'Jobs',
        showTab: 'jobsTab',
        tab: 'tabs',
        requirement: () => passedStage('jobs-tab'),
        hide: () => false
    },

    /* PONDER TAB */
    'gatherPonder': {
        class: 'tooltip',
        text: 'Ponder',
        tooltipDesc: 'Wrap your head around the great mysteries',
        tooltipCost: 'Time',
        tab: 'ponder',
        requirement: () => passedStage('ponder-tab'),
        hide: () => false
    },
    // 'ponderClones1': {
    //     class: 'tooltip unlock',
    //     text: 'Understand Cloning',
    //     tooltipDesc: 'Why are there two of you?',
    //     tooltipCost: 'Sanity (20 Ponder)',
    //     tab: 'ponder',
    //     unlock: 'jobs-tab',
    //     requirement: () => (getMaterial('ponder') >= 10),
    //     hide: () => passedStage('jobs-tab') || isPondered('jobs-tab')
    // },
    // 'ponderSkills': {
    //     class: 'tooltip unlock',
    //     text: 'Notice Improvement',
    //     tooltipDesc: "You're starting to learn things, right?",
    //     tooltipCost: '40 Ponder',
    //     tab: 'ponder',
    //     unlock: 'skillsTable',
    //     requirement: () => (getMaterial('ponder') >= 25),
    //     hide: () => passedStage('skillsTable') || isPondered('skillsTable')
    // },
    // 'ponderFishing': {
    //     class: 'tooltip unlock',
    //     text: 'Think about Fishing',
    //     tooltipDesc: 'What if you could make your clones fish?',
    //     tooltipCost: '60 Ponder, 50 Fish',
    //     tab: 'ponder',
    //     unlock: 'fishing',
    //     requirement: () => getMaterial('fish') >= 40,
    //     hide: () => isPondered('fishing')

    // }
}
