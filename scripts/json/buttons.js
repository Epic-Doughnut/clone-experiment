const { passedStage } = require('../stages');
const { getMaterial } = require('../getMaterial');
const { hasTool } = require('../tools');
const { resources } = require('./resources');

/* BUTTONS */
const buttons = {

    /* PRODUCTION TAB */
    'gatherSticks': {
        class: 'tooltip startVisible',
        tab: 'production',
        text: '𓀝 Gather Sticks',
        tooltipDesc: 'Five, Six, Pick up sticks.',
        tooltipCost: 'Free',
        requirement: () => true,
        hide: () => false // This button is always visible
    },
    'gatherVines': {
        class: 'tooltip stick',
        tab: 'production',
        text: '𓍯 Gather Vines',
        tooltipDesc: 'Some vines are rubbery, others are gummy.',
        tooltipCost: 'Free',
        requirement: () => getMaterial('sticks', resources) >= 10 || passedStage('vines'),
        hide: () => false
    },
    'gatherRocks': {
        class: 'tooltip stick',
        tab: 'production',
        text: '𓊖𓀩 Gather Rocks',
        tooltipDesc: 'Not a single window to throw them through.',
        tooltipCost: 'Free',
        requirement: () => getMaterial('vines', resources) >= 10 || passedStage('rocks'),
        hide: () => false
    },
    'gatherFish': {
        class: 'tooltip fishing',
        tab: 'production',
        text: '𓆝 𓆟 𓆞 Go Fish',
        tooltipDesc: 'Got any tuna?',
        tooltipCost: 'Free',
        requirement: () => hasTool('Spear') || hasTool("Fishing Rod") || passedStage('fishing'),
        hide: () => false
    },
    'gatherWood': {
        class: 'woodToggle wood',
        tab: 'production',
        text: '𓌏 Chop Wood',
        tooltipDesc: 'An axe hurts way less than using your hands.',
        tooltipCost: 'Free',
        requirement: () => hasTool('Axe') || passedStage('wood'),
        hide: () => false
    },
    'gatherOre': {
        "class": "tooltip ",
        "tab": "production",
        "text": "𓉸 Mine Ore",
        "tooltipDesc": "Diggy Diggy Hole",
        "tooltipCost": "Free",
        requirement: () => hasTool('Pickaxe') || passedStage('ore'),
        hide: () => false
    },



    /* TABS */
    'productionTabButton': {
        class: 'tab-button active',
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
    'skillsTabButton': {
        class: 'tab-button',
        text: 'Skills',
        showTab: 'skillsTab',
        tab: 'tabs',
        requirement: () => passedStage('skillsTable'),
        hide: () => false
    },
    'perksTabButton': {
        class: 'tab-button',
        text: 'Perks',
        showTab: 'perksTab',
        tab: 'tabs',
        requirement: () => passedStage('perksTab'),
        hide: () => false
    },
    'factoryTabButton': {
        class: 'tab-button',
        text: 'Factories',
        showTab: 'factoryTab',
        tab: 'tabs',
        requirement: () => passedStage('factoryTab'),
        hide: () => false
    },
    'combatTabButton': {
        class: 'tab-button',
        text: "Combat",
        showTab: 'combatTab',
        tab: 'tabs',
        requirement: () => passedStage('combatTab'),
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

};

module.exports = {
    buttons: buttons
};