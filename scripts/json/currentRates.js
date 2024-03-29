const { allMaterials } = require('./allMaterials');

var globalRates = {};
// Make visible in console
window.globalRates = globalRates;
// Initialize keys
Object.keys(allMaterials).forEach((key) => {globalRates[key] = 0;});


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
};