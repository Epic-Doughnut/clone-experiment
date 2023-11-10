const { capitalizeFirst } = require('./capitalizeFirst');

function updateBuildingButtonCount(buildingName, buildingCount) {
    document.getElementById(`${buildingName}`).textContent = `${capitalizeFirst(buildingName).split('_').join(' ')} (${buildingCount})`;

}
exports.updateBuildingButtonCount = updateBuildingButtonCount;