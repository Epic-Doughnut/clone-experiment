/**
 * A map of all jobs that require a ponder to be unlocked
 *
 * Job: RequiredPonder
 */
const jobRequiredPonders = {
    'thinking': 'thinking',
    'fishing': 'fishing',
    'smithing': 'not-unlockable',
    'farming': 'agriculture',
    'combat': 'combatTab',
    'hunting': 'hunting'
};
exports.jobRequiredPonders = jobRequiredPonders;
