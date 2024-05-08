const { resources } = require('./resources');
const { craftedResources } = require('./craftedResources');

var allMaterials = new Set([]);
Object.keys(resources).forEach(r => allMaterials.add(r));
Object.keys(craftedResources).forEach(r => allMaterials.add(r));
//console.log("All materials: ", allMaterials);

exports.allMaterials = allMaterials;