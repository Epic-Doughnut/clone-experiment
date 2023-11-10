let stages = [];
function setStage(stage) {
    stages.push(stage);
}
/**
 *
 * @param {string} stage Stage to check
 * @returns boolean if stage in stages
 */
function passedStage(stage) {
    return Object.values(stages).includes(stage);
}
function getAllStages() {
    return stages;
}

function resetStages() {
    while (stages.length > 0)
        stages.pop();
}
module.exports = {
    setStage,
    passedStage,
    getAllStages,
    resetStages
};