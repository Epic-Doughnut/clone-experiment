

/**
 * Tier 1 (400 ponder):
 * Lumberjack
 *  +25% wood production
 *  +25% sticks production
 * 
 * Miner
 *  +25% stone & ore production
 * 
 * Botanist
 *  +25% vines & herbs & wheat production
 * 
 * Leader
 *  50% clone effectiveness
 * 
 * Architect
 *  -25% building cost
 * 
 * 
 * Tier 2 (1500 ponder):
 * Thinker
 *  +50% ponder production and storage
 *  -25% ponder cost
 * 
 * General
 *  +50% combat strength
 *  +25% clone effectiveness
 * 
 * Merchant
 *  -25% trade price
 *  +25% chance of rare trade
 * 
 * Generalist
 *  +10% global production
 * 
 * Specialist
 *  +100% skill gain
 *  +10% skill bonus to resources
 * 
 */
const perks = {
    'tier1': ['Lumberjack', 'Miner', 'Botanist', 'Leader', 'Architect'],
    'tier2': ['Thinker', 'General', 'Merchant', 'Generalist', 'Specialist']
};

module.exports = {
    perks: perks
}