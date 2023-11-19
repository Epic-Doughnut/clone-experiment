
const { hasPrestige, getLevelOfPrestige } = require("./json/prestige");
const { isPondered } = require("./ponder");
const { passedStage } = require("./stages");
const { updateBounceAnimation } = require("./updateBounceAnimation");

function recalcMaxClones() {
    let maxClones = require("./json/resources").getBaseMax('clones');
    if (passedStage('clone')) maxClones += 1;

    const buildings = require("./json/buildings").buildings;
    // console.log(passedStage('clone'), maxClones);
    for (const [key, building] of Object.entries(buildings)) {

        // console.log(key, building, building.effects);
        if (building.effects && building.effects['clones'])
            maxClones += building.effects['clones'] * building.count;
    }

    // Ponder bonuses
    if (isPondered('biggerShelter')) maxClones += 1 * buildings['shelter'].count;
    if (isPondered('biggerHut')) maxClones += 1 * buildings['hut'].count;
    if (isPondered('biggerHouse')) maxClones += 2 * buildings['house'].count;
    if (isPondered('biggerTeepee')) maxClones += 4 * buildings['teepee'].count;
    if (isPondered('evenBiggerShelter')) maxClones += 1 * buildings['shelter'].count;

    if (hasPrestige('maxClones')) maxClones += 1 * getLevelOfPrestige('maxClones');
    // console.log(maxClones);
    // return maxClones;
    require("./setMax").setMax('clones', maxClones);
    updateBounceAnimation();
}

exports.recalcMaxClones = recalcMaxClones;