// DEPENDS ON: resources.js

/* SAVING */
var save = {
    resources: resources,
    craftedResources: craftedResources,
    skills: skills,
    playerTools: playerTools
}

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
        allVisibleButtons: []
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

        save.resources[item].value = getMaterial(item);
        save.resources[item].max = resources[item].max;
    }

    save.tools = playerTools;
    save.stages = stages;
    save.jobs = jobCounts;

    for (let u in ponders) {
        save.unlocks[u] = isPondered(u);
    }

    for (let b in buildings) {
        save.buildings[b] = buildings[b].count;
    }

    // console.log(allVisibleButtons.values());
    for (let a of allVisibleButtons) {
        // console.log(a);
        save.allVisibleButtons.push(a);
        // console.log(save.allVisibleButtons);
    }


    save.time['total_time'] = total_time;
    save.time['time_of_save'] = Date.now();
    // You can now use the save object to store the data somewhere or display it to the user
    console.log(save);

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
            if (i.value === "undefined" || i === null) continue;
            resources[i].value = savegame.resources[i].value;
            resources[i].max = savegame.resources[i].max;
            console.log("Updating resources for " + i + " to " + savegame.resources[i].value, savegame.resources[i].max);
            updateDisplayValue(i);
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
            craftedResources[key].value = savegame.craftedResources[key].value;
            craftedResources[key].craftedOnce = savegame.craftedResources[key].craftedOnce;
            updateDisplayValue(key);
        }
    }

    if (typeof savegame.tools !== 'undefined') {
        // playerTools = savegame.tools;
        // Union the tool lists together
        let union = [...new Set([...playerTools, ...savegame.tools])];
        playerTools = union;

        for (let t in playerTools) {
            updateToolUI(playerTools[t]);
        }
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
            ponders[u].isUnlocked = savegame.unlocks[u];
        }
    }

    if (typeof savegame.buildings !== 'undefined') {
        for (let b in savegame.buildings) {
            // console.log(b, savegame.buildings[b]);
            buildings[b].count = savegame.buildings[b];
            // Update button text
            updateBuildingButtonCount(b, buildings[b].count);

            // Calculate the costs of all the buildings
            recalculateBuildingCost(b);
        }
        updateSidebar();
    }

    // If we have a clone, then we ate fish
    ateFish = resources.clones.max >= 1;
    // console.log('atefish', ateFish);
    if (ateFish) {
        const fishButton = document.querySelector("#eatFish");
        fishButton.style.display = 'none';
    }
    // Change the message to the latest one
    if (resources.clones.max >= 1) {
        changeMessage("You are with yourself in a forest.", 'with yourself');
    }


    // Calculate resources earned while away
    if (typeof savegame.time !== 'undefined') {
        total_time = savegame.time[total_time];
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
            allVisibleButtons.add(a);
        }

    }
}


// save the time when the player exits the browser tab
// window.addEventListener("beforeunload", () => saveGame());
