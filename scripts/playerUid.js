let playerUid = null;

// Get User ID
function getPlayerUid() {
    return playerUid;
}

// Function to generate a unique UID
function generateUniqueID() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

module.exports = {
    getPlayerUid,
    generateUniqueID
};