/* JOBS FUNCTIONALITY */

const jobCounts = {
    farming: 0,
    gathering: 0,
    masonry: 0,
    carpentry: 0,
    combat: 0,
};

document.querySelectorAll('.btn-increment').forEach(btn => {
    btn.addEventListener('click', function () {
        const jobType = this.closest('.job-button').getAttribute('data-job');
        if (getMaterial('clones') > 0) {
            jobCounts[jobType]++;
            increaseMaterial('clones', -1);
        }
        updateDisplay(jobType);
    });
});

document.querySelectorAll('.btn-decrement').forEach(btn => {
    btn.addEventListener('click', function () {
        const jobType = this.closest('.job-button').getAttribute('data-job');
        if (jobCounts[jobType] > 0) {
            jobCounts[jobType]--;
            increaseMaterial('clones', 1);
            updateDisplay(jobType);
        }
    });
});

function updateDisplay(jobType) {
    const jobElement = document.querySelector(`.job-button[data-job="${jobType}"] .job-name`);
    if (jobElement) jobElement.textContent = `${jobType.charAt(0).toUpperCase() + jobType.slice(1)}: ${jobCounts[jobType]}`;
}
