let musicVolume = 0.5;


function setMusicVolume(vol) {
    musicVolume = vol;
}
function getMusicVolume() {
    return musicVolume;
}

let sfxVolume = 0.5;

function setSfxVolume(vol) {
    sfxVolume = vol;
}
function getSfxVolume() {
    return sfxVolume;
}

module.exports = {
    setMusicVolume,
    getMusicVolume,
    setSfxVolume,
    getSfxVolume
};