const { resources } = require("./json/resources");
const { updateTotal } = require('./jobs');
const { updateSidebar } = require("./sidebar");

function setMax(material, num) {
    resources[material].max = num;
    updateSidebar();
    updateTotal();
}
exports.setMax = setMax;