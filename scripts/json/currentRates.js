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
allMaterials.forEach((key) => { console.log(`init ${key} to 0 in global rates`); setRate(key, 0); });
console.log('added all materials to globalRates. now contains '  + Object.keys(globalRates).length + " entries.");

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