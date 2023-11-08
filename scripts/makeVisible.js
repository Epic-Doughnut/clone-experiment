
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
    const stageElements = document.querySelectorAll("." + stage);
    stageElements.forEach(element => {
        element.classList.add('visible');
        element.classList.remove('hidden');
        // @ts-ignore
        element.style.display = '';
    });
    updateButtonVisibility();
}
exports.makeVisible = makeVisible;