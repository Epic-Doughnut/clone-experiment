const { resources } = require('./resources');
const { craftedResources } = require('./craftedResources');

var allMaterials = [];
Object.keys(resources).forEach(r => allMaterials.push(r));
Object.keys(craftedResources).forEach(r => allMaterials.push(r));
console.log("All materials: ", allMaterials);

exports.allMaterials = allMaterials;