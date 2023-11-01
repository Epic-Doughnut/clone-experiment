var ateFish = false;

function setAteFish(bool) {
    ateFish = bool;
    return ateFish;
}
function getAteFish() {
    return ateFish;
}

module.exports = {
    ateFish,
    setAteFish,
    getAteFish
};