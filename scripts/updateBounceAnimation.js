const { getMaterial } = require("./getMaterial");
const { getMax } = require("./helper");

function updateBounceAnimation() {
    const aloneElement = document.getElementById('alone');

    if (getMaterial('clones') < getMax('clones')) {
        // Apply the animation
        aloneElement.classList.add('bouncing');

        // Wait for the animation to complete plus an additional delay, then check the condition again
        setTimeout(() => {
            // Remove the animation class to reset
            aloneElement.classList.remove('bouncing');
            void aloneElement.offsetHeight;
            // Recursive call to re-check the condition and potentially reapply the animation
            updateBounceAnimation();
        }, 11000); // Wait for the duration of the animation (1s) + delay (10s)
    } else {
        // Remove the animation class if the condition is not met
        aloneElement.classList.remove('bouncing');
    }

}
exports.updateBounceAnimation = updateBounceAnimation;