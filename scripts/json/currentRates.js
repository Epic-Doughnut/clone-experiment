const { allMaterials } = require('./allMaterials');
var globalRates = {};

function showGlobalRates()
{
    console.log("Showing global rates");
    console.log(globalRates);
}
// Make visible in console
window.showGlobalRates = showGlobalRates;
// Initialize keys
allMaterials.forEach((key) =>
{ setRate(key, 0); });

function setRate(key, value)
{
    globalRates[key] = value;
}

function getRate(key)
{
    return globalRates[key];
}

module.exports = {
    setRate: setRate,
    getRate: getRate,
    showGlobalRates: showGlobalRates,
};