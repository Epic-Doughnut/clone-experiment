const { buildings } = require("./json/buildings");
const { isPondered } = require("./ponder");
const { setMax } = require("./resources");
const { passedStage } = require("./stages");

function recalcMaxClones() {
    let maxClones = 0;
    if (passedStage('clone')) maxClones += 1;
    // console.log(passedStage('clone'), maxClones);
    for (const key in buildings) {
        const building = buildings[key];
        // console.log(key, building, maxClones);
        if (building.effects && building.effects['clones'])
            maxClones += building.effects['clones'] * building.count;
    }

    // Ponder bonuses
    if (isPondered('biggerShelter')) maxClones += 1 * buildings['shelter'].count;
    if (isPondered('biggerHut')) maxClones += 1 * buildings['hut'].count;
    if (isPondered('biggerHouse')) maxClones += 2 * buildings['house'].count;
    if (isPondered('biggerTeepee')) maxClones += 4 * buildings['teepee'].count;
    if (isPondered('evenBiggerShelter')) maxClones += 1 * buildings['shelter'].count;

    // console.log(maxClones);
    // return maxClones;
    setMax('clones', maxClones);
}

exports.recalcMaxClones = recalcMaxClones;