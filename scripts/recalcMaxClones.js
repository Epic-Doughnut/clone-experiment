
const { hasPrestige, getLevelOfPrestige } = require("./json/prestige");
const { isPondered } = require("./ponder");
const { setMax } = require("./resources");
const { passedStage } = require("./stages");

function recalcMaxClones() {
    let maxClones = 0;
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
    setMax('clones', maxClones);
}

exports.recalcMaxClones = recalcMaxClones;