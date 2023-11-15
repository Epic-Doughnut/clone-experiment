const { capitalizeFirst } = require("./capitalizeFirst");
const { craftedResources } = require("./json/craftedResources");
const { resources } = require("./json/resources");

// Define a list of possible building names, costs, and descriptions
const possibleResources = Object.keys(resources).filter(key => key !== 'husks');
const possibleCraftedResources = Object.keys(craftedResources);

function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomEmoji() {
  // Define the Unicode ranges for random emojis
  const ranges = [
    { start: 0x1311B, end: 0x1313E },
    { start: 0x131E3, end: 0x1321F },
  ];

  // Choose a random range
  const randomRange = ranges[Math.floor(Math.random() * ranges.length)];

  // Generate a random Unicode character within the selected range
  const randomUnicode = Math.floor(getRandomNumber(randomRange.start, randomRange.end + 1));

  // Convert the Unicode code point to a JavaScript string
  return String.fromCodePoint(randomUnicode);
}

const adjectives = [
  'bustling',
  'majestic',
  'ancient',
  'elegant',
  'hidden',
  'glorious',
  'enchanted',
  'whispering',
  'mystical',
  'luminous',
  'radiant',
  'spectacular',
  'dazzling',
  'serenade',
  'celestial',
  'vibrant',
  'imposing',
  'venerable',
  'immaculate',
  'enigmatic',
  'harmonious',
  'ethereal',
  'resplendent',
  'tranquil',
  'serene',
  'awe-inspiring',
  'peaceful',
  'picturesque',
  'captivating',
];

const buildingNames = [
  'Sanctuary',
  'Citadel',
  'Haven',
  'Monastery',
  'Outpost',
  'Observatory',
  'Stronghold',
  'Palace',
  'Temple',
  'Manor',
  'Keep',
  'Chateau',
  'Acropolis',
  'Cathedral',
  'Villa',
  'Fortress',
  'Bastion',
  'Lighthouse',
  'Castle',
  'Coliseum',
  'Pyramid',
  'Mansion',
  'Estate',
  'Museum',
  'Tower',
  'Hall',
  'Library',
  'Gallery',
  'Bazaar',
];

// Function to generate a random building name by combining an adjective and a building name
function generateBuildingName() {
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomBuildingName = buildingNames[Math.floor(Math.random() * buildingNames.length)];
  return `${capitalizeFirst(randomAdjective)} ${randomBuildingName}`;
}


const nouns = [
  'sanctuary',
  'citadel',
  'haven',
  'monastery',
  'outpost',
  'observatory',
  'stronghold',
  'palace',
  'temple',
  'manor',
];

const verbs = [
  'provides',
  'enhances',
  'imbues',
  'radiates',
  'embodies',
  'inspires',
  'evokes',
  'exudes',
  'bestows',
  'creates',
];

const prepositions = [
  'with',
  'through',
  'amidst',
  'beneath',
  'above',
  'alongside',
];

const conjunctions = [
  'and',
  'while',
  'as',
  'although',
  'yet',
];

// Function to generate a random building description
function generateBuildingDescription() {
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomAdjective2 = adjectives[Math.floor(Math.random() * adjectives.length)];

  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomVerb = verbs[Math.floor(Math.random() * verbs.length)];
  const randomPreposition = prepositions[Math.floor(Math.random() * prepositions.length)];
  const randomConjunction = conjunctions[Math.floor(Math.random() * conjunctions.length)];

  const sentenceStructure = Math.floor(Math.random() * 6); // How many sentence structures we have

  let description = '';

  switch (sentenceStructure) {
    case 0:
      description = `${randomAdjective} ${randomNoun} that ${randomVerb} an aura of splendor.`;
      break;
    case 1:
      description = `${capitalizeFirst(randomPreposition)} its ${randomAdjective} appearance, the ${randomNoun} ${randomVerb} an aura of ${randomAdjective2}.`;
      break;
    case 2:
      description = `${capitalizeFirst(randomAdjective)} ${randomNoun} ${randomVerb} gracefully, exuding an enchanting atmosphere.`;
      break;
    case 3:
      description = `The ${randomNoun} is ${randomAdjective} and ${randomVerb} with a sense of wonder.`;
      break;
    case 4:
      description = `Amidst the ${randomAdjective} surroundings, the ${randomNoun} ${randomVerb} tranquility and beauty.`;
      break;
    case 5:
      description = `An ${randomAdjective} ${randomNoun} that ${randomVerb} an aura of charm ${randomConjunction} mystique.`;
      break;
    default:
      description = `${capitalizeFirst(randomAdjective)} ${randomNoun} that ${randomVerb} an aura of splendor.`;
  }

  return description;
}

function generateRandomBuilding() {
  // Randomly select a name, description, and cost for the building
  const randomName = generateBuildingName();
  const randomDescription = generateBuildingDescription();

  // Randomly choose 1-3 random resources for the cost
  const numResources = getRandomNumber(1, 3);
  const randomCosts = {};
  for (let i = 0; i < numResources; i++) {
    // We don't care about repeats, it's the same as rolling one fewer cost
    const randomResource = possibleResources[Math.floor(Math.random() * possibleResources.length)];
    randomCosts[randomResource] = Math.floor(Math.random() * 100 * (5 - numResources)); // Fewer resources means more expensive
  }

  // 0-1 crafted resources
  const numCraftedResources = getRandomNumber(0, 1);
  for (let i = 0; i < numCraftedResources; i++) {
    // We don't care about repeats, it's the same as rolling one fewer cost
    const randomResource = possibleCraftedResources[Math.floor(Math.random() * possibleCraftedResources.length)];
    randomCosts[randomResource] = Math.floor(Math.random() * 50);
  }


  // Generate random effects
  const randomEffects = {};
  const numEffects = getRandomNumber(0, 3);
  for (let i = 0; i < numEffects; i++) {
    const randomResource = possibleResources[Math.floor(Math.random() * possibleResources.length)];
    const randomEffectValue = Math.floor(getRandomNumber(30, 200)); // Adjust the range as needed
    randomEffects[randomResource] = randomEffectValue;
  }

  // Generate random boosts
  const randomBoosts = {};
  const numBoosts = getRandomNumber(numEffects === 0 ? 1 : 0, 3); // Ensure the building does *something*
  for (let i = 0; i < numBoosts; i++) {
    const randomResource = possibleResources[Math.floor(Math.random() * possibleResources.length)];
    const randomBoostValue = getRandomNumber(1.01, 1.2); // Adjust the range as needed
    randomBoosts[randomResource] = randomBoostValue;
  }

  // Create a random building object
  const randomBuilding = {
    name: randomName,
    description: randomDescription,
    basecost: randomCosts,
    cost: randomCosts,
    effects: randomEffects,
    boost: randomBoosts,
    count: 0,
    ratio: getRandomNumber(1.3, 1.6), // You can adjust this as needed
    emoji: getRandomEmoji(), // You can use any emoji or icon
  };

  return randomBuilding;
}
exports.generateRandomBuilding = generateRandomBuilding;