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
allMaterials.forEach((key) => { setRate(key, 0); });

/**
 * Set the rate of a resource's increase
 * @param {string} key The resource key to set the rate of
 * @param {float} value How much this resource should change, per second
 */
function setRate(key, value)
{
    globalRates[key] = value;
}

function getRate(key)
{
    return globalRates[key];
}

/**
 * Update the value of every resource's rate
 */
function updateAllRates()
{
    Array.from(allMaterials).forEach((key) =>
    {
        setRate(key, calcIncrease(key, 1000));
    });
}

module.exports = {
    setRate: setRate,
    getRate: getRate,
    showGlobalRates: showGlobalRates,
    updateAllRates
};