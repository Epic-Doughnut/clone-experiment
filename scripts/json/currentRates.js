const { allMaterials } = require('./allMaterials');

var globalRates = {};

function showGlobalRates()
{
    for (const [key, val] in Object.entries(globalRates))
    {
        console.log(key, val);
    }
}
// Make visible in console
window.showGlobalRates = showGlobalRates;
// Initialize keys
Object.keys(allMaterials).forEach((key) => {globalRates[key] = 0;});
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