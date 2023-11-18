// DEPENDS ON: resources.js
const { calcIncrease, updateEmojiDisplay } = require('./resources');
const { addTool, getAllTools } = require('./tools');
const { allVisibleButtons, setVisibleButton, getMax } = require('./helper');
const { makeVisible } = require('./makeVisible');
const { getCraftedResource } = require('./getCraftedResource');
const { getMaterial } = require('./getMaterial');

const { getAllPerks, addPerk, hasPerk, selectAbility } = require('./perks');
const { isPondered } = require('./ponder');
const { jobCounts, setConnections, getConnections, distributeWorkers, updateDisplay } = require('./jobs');
const { total_time } = require('./main');
const { setAteFish, getAteFish } = require('./ateFish');


const { craftedResources } = require('./json/craftedResources');
const { buildings } = require("./json/buildings");
const { ponders } = require("./json/ponder");
const { resources } = require('./json/resources');
const { skills } = require("./json/skills");
const { getAllStages } = require('./stages');
const { activeFactoriesProducing, loadFactory } = require('./factory');
const { recalcMaxClones } = require('./recalcMaxClones');
const { updateSidebar } = require('./sidebar');
const { prestige } = require('./json/prestige');
const { recalculateBuildingCost } = require('./recalculateBuildingCost');
const { updateBuildingButtonCount } = require('./updateBuildingButtonCount');
const { updateBuildingList } = require('./buildings');
const { populateSkillsTable } = require('./skills');

// import jobCounts;
/* SAVING */
// var save = {
//     resources: resources,
//     craftedResources: craftedResources,
//     skills: skills,
//     playerTools: playerTools
// }

function saveGame() {
    let save = {
        skills: {}, // This will hold the experience and level for each skill
        craftedResources: {}, // This will hold the value for each crafted item
        resources: {},
        tools: [],
        stages: [],
        unlocks: {},
        jobs: {},
        buildings: {},
        time: {},
        allVisibleButtons: [],
        message: [],
        connections: new Map(),
        perks: [],
        factories: {},
        prestige: {},
        newBuildings: {}
    };

    // Extract exp and level from skills and save to save.skills
    for (let skill in skills) {
        save.skills[skill] = {
            exp: skills[skill].exp,
            level: skills[skill].level
        };
    }

    // Extract value from craftedResources and save to save.craftedItems
    for (let item in craftedResources) {
        if (!save.craftedResources.hasOwnProperty(item)) {
            save.craftedResources[item] = { value: 0, craftedOnce: false };
        }

        save.craftedResources[item].value = getCraftedResource(item);
        save.craftedResources[item].craftedOnce = craftedResources[item].craftedOnce;

    }

    for (let item in resources) {
        // Check if the item exists in the save.resources object. If not, initialize it.
        if (!save.resources.hasOwnProperty(item)) {
            save.resources[item] = { value: 0, max: 0 };
        }

        save.resources[item].value = getMaterial(item, resources);
        save.resources[item].max = resources[item].max;
    }

    save.tools = getAllTools();
    save.stages = getAllStages();
    save.jobs = jobCounts;
    save.perks = getAllPerks();

    // @ts-ignore
    save.connections = Array.from(getConnections().entries());

    for (let u in ponders) {
        save.unlocks[u] = isPondered(u);
    }

    let lastNewBuilding = null;
    for (let b in buildings) {
        save.buildings[b] = buildings[b].count;
        if (buildings[b].hasOwnProperty('name')) {
            // save new building data 
            save.newBuildings[b] = buildings[b];
            lastNewBuilding = buildings[b];
        }
    }

    // console.log(allVisibleButtons.values());
    for (let a in allVisibleButtons) {
        // console.log(a);
        save.allVisibleButtons.push(a);
        // console.log(save.allVisibleButtons);
    }

    function extractTextFromHTML(htmlString) {
        const div = document.createElement('div');
        div.innerHTML = htmlString;

        const textContent = div.textContent;
        const spanText = div.querySelector('span').textContent;

        return [textContent, spanText];
    }

    function getMessageTooltip() {
        // Get most recent building
        // return messageElement.querySelector("#alone").getAttribute('tooltipDesc');
        const needs = 'You feel a strange, constructive urge to acquire ' + Object.keys(lastNewBuilding.cost).join(', ');
        console.log('message tooltip:', needs);
        return needs;
    }

    for (const [key, val] of Object.entries(activeFactoriesProducing)) {
        save.factories[key] = val;
    }

    const htmlString = require('./main').getMessage().innerHTML;
    const messageTooltip = getMessageTooltip();
    const messageArray = extractTextFromHTML(htmlString); // [message, span]
    messageArray.push(messageTooltip);
    save.message = messageArray;

    for (const [key, val] of Object.entries(prestige)) {
        save.prestige[key] = { cost: val.cost, level: val.level };
    }

    // console.log(combinedText); // "You find yourself alone in a forest"
    // console.log(spanText); // "alone"


    save.time['total_time'] = total_time;
    save.time['time_of_save'] = Date.now();
    // You can now use the save object to store the data somewhere or display it to the user

    console.log(save);
    // console.log(JSON.stringify(save));

    localStorage.setItem("save", JSON.stringify(save));
    return save;
}



function loadGame() {
    console.log("Loading Game");
    var savegame = JSON.parse(localStorage.getItem("save"));
    console.log(savegame);
    if (savegame === null) {
        // NEW GAME
        return;
    }
    if (typeof savegame.resources !== "undefined") {
        for (let i in savegame.resources) {
            if (i.valueOf() === "undefined" || i === null || resources[i] === null) continue;
            resources[i].value = savegame.resources[i].value;
            resources[i].max = savegame.resources[i].max;
            console.log("Updating resources for " + i + " to " + savegame.resources[i].value, savegame.resources[i].max);
            if (resources[i].value != 0) require('./sidebar').updateDisplayValue(i);
        }
    }

    if (typeof savegame.skills !== 'undefined') {
        for (let i in savegame.skills) {
            skills[i].exp = savegame.skills[i].exp;
            skills[i].level = savegame.skills[i].level;
        }
    }

    if (typeof savegame.craftedResources !== "undefined") {
        for (var key of Object.keys(savegame.craftedResources)) {
            // console.log('loading crafted', key, savegame.craftedResources[key], craftedResources[key]);
            if (!craftedResources[key]) continue;
            craftedResources[key].value = savegame.craftedResources[key].value;
            if (Number.isNaN(craftedResources[key].value)) craftedResources[key].value = 0;
            craftedResources[key].craftedOnce = savegame.craftedResources[key].craftedOnce;
            require('./sidebar').updateDisplayValue(key);
        }
    }

    if (typeof savegame.tools !== 'undefined') {
        // playerTools = savegame.tools;
        // Union the tool lists together
        let union = [...new Set([...getAllTools(), ...savegame.tools])];
        // playerTools = union;
        for (let tool in union) {
            addTool(tool);
        }

        // for (let t in playerTools) {
        //     updateToolUI(playerTools[t]);
        // }
    }

    if (typeof savegame.stages !== 'undefined') {
        for (let s in savegame.stages) {
            makeVisible(savegame.stages[s]);
        }
    }
    if (typeof savegame.jobs !== 'undefined') {
        // jobCounts = savegame.jobs;
        for (let j in savegame.jobs) {
            jobCounts[j] = savegame.jobs[j];
            // console.log(j);
            updateDisplay(j);
        }
    }
    if (typeof savegame.unlocks !== 'undefined') {
        for (let u in savegame.unlocks) {
            try {
                ponders[u].isPondered = savegame.unlocks[u];

            } catch (error) {
                console.warn('Old save data includes obsolete ponder', u);
            }
        }
    }

    if (isPondered('skillsTable')) {
        populateSkillsTable();
    }

    // Perks before buildings to update costs
    if (typeof savegame.perks !== 'undefined') {
        // myPerks = savegame.perks;
        for (let [i, perk] of Object.entries(savegame.perks)) {
            addPerk(perk);
            require('./selectCorrectPerkButton').selectCorrectPerkButton(perk);
        }
    }


    if (typeof savegame.prestige !== 'undefined') {
        for (const [key, val] of Object.entries(savegame.prestige)) {

            prestige[key].cost = val['cost'];
            prestige[key].level = val['level'];
        }
    }

    if (typeof savegame.newBuildings !== 'undefined') {
        for (let b in savegame.newBuildings) {
            buildings[b] = savegame.newBuildings[b];
        }
    }

    if (typeof savegame.buildings !== 'undefined') {
        for (let b in savegame.buildings) {
            // console.log(b, savegame.buildings[b]);
            try {
                buildings[b].count = savegame.buildings[b];
                // Update button text
                if (buildings[b].count > 0) {
                    updateBuildingButtonCount(b, buildings[b].count, buildings[b].emoji);

                    // Calculate the costs of all the buildings
                    recalculateBuildingCost(b);
                }

            }
            catch (error) {
                console.warn('error with building', b, error);
            }
        }
        updateSidebar();
    }


    // After ponders and buildings we can recalculate max clones
    recalcMaxClones();
    updateBuildingList();


    // If we have a clone, then we ate fish
    setAteFish(resources.clones.max >= 1);
    // console.log('atefish', ateFish);
    if (getAteFish()) {
        const fishButton = document.querySelector("#eatFish");
        // @ts-ignore
        fishButton.style.display = 'none';
    }
    // Change the message to the latest one
    if (typeof savegame.message !== 'undefined') {
        // [full message, span, tooltip]
        require('./changeMessage').changeMessage(savegame.message[0], savegame.message[1], savegame.message[2] ? savegame.message[2] : null);

    }


    // Calculate resources earned while away
    if (typeof savegame.time !== 'undefined') {
        require('./main').setTotalTime(savegame.time[total_time]);
        const time_difference = Date.now() - savegame.time['time_of_save'];
        for (let r in resources) {
            const inc = calcIncrease(r, time_difference);
            resources[r].value += inc;
            // console.log(r, time_difference, inc);
            if (resources[r].value > resources[r].max) resources[r].value = resources[r].max;
        }
    }

    if (typeof savegame.allVisibleButtons !== 'undefined') {
        console.log(savegame.allVisibleButtons);
        for (let a in savegame.allVisibleButtons) {
            setVisibleButton(a);
        }

    }

    if (typeof savegame.connections !== 'undefined') {
        setConnections(new Map(savegame.connections));

        if (getConnections().size === 0) setConnections(new Map());
        console.log(getConnections());
    }


    for (let job in jobCounts) {
        distributeWorkers(job, jobCounts[job]);
    }

    updateEmojiDisplay();


    if (typeof savegame.factories !== 'undefined')
        for (const [key, val] of Object.entries(savegame.factories))
            if (val > 0)
                for (let i = 0; i < val; ++i)
                    loadFactory(key);



}


// save the time when the player exits the browser tab
// window.addEventListener("beforeunload", () => saveGame());
module.exports = {
    saveGame,
    loadGame
};

// @ts-ignore
window.saveGame = saveGame;