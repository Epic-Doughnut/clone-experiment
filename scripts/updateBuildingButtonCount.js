const { capitalizeFirst } = require('./capitalizeFirst');

function updateBuildingButtonCount(buildingName, buildingCount, emoji) {
    document.getElementById(`${buildingName}`).textContent = `${emoji} ${capitalizeFirst(buildingName).split('_').join(' ')} (${buildingCount})`;

}
exports.updateBuildingButtonCount = updateBuildingButtonCount;