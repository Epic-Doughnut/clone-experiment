
const { setStage, passedStage } = require('./stages');
const { updateButtonVisibility } = require('./updateButtonVisibility');

/**
 * Make everything with the class "stage" visible
 * @param {string} stage
 */
function makeVisible(stage) {
    if (!passedStage(stage)) {
        setStage(stage);
    }
    const stageElements = document.querySelectorAll("p." + stage);
    stageElements.forEach(element => element.classList.add('visible'));
    // 
    // @ts-ignore
    stageElements.forEach(element => element.style.display = '');
    updateButtonVisibility();
}
exports.makeVisible = makeVisible;