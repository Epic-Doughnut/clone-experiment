// DEPENDS ON: skills.js

/* JOBS FUNCTIONALITY */

const jobCounts = {
    farming: 0,
    gathering: 0,
    masonry: 0,
    carpentry: 0,
    combat: 0,
};


function getTotalJobs() {
    var total = 0;
    for (let j in jobCounts) {
        total += jobCounts[j];
    }
    return total;
}

document.querySelectorAll('.btn-increment').forEach(btn => {
    btn.addEventListener('click', function () {
        const jobType = this.closest('.job-button').getAttribute('data-job');
        if (getMaterial('clones') > getTotalJobs()) {
            jobCounts[jobType]++;
            // increaseMaterial('clones', -1);
        }
        updateDisplay(jobType);
        updateTotal();
    });
});

document.querySelectorAll('.btn-decrement').forEach(btn => {
    btn.addEventListener('click', function () {
        const jobType = this.closest('.job-button').getAttribute('data-job');
        if (jobCounts[jobType] > 0) {
            jobCounts[jobType]--;
            // increaseMaterial('clones', 1);
            updateDisplay(jobType);
            updateTotal();
        }
    });
});

// const allJobButtonbs = document.querySelectorAll('.job-button');
function updateDisplay(jobType) {
    const thisJobButton = document.querySelector(`.job-button[data-job="${jobType}"]`);
    const jobElement = thisJobButton.querySelector(`.job-name`);
    if (jobElement) jobElement.textContent = `${jobType.charAt(0).toUpperCase() + jobType.slice(1)}: ${jobCounts[jobType]}`;


}


function updateTotal() {
    const totalElement = document.querySelector('#jobs-total');
    totalElement.textContent = "Assigned Clones: " + getTotalJobs() + " / " + getMaterial('clones');
}


const jobsTab = document.getElementById('jobsTab');

Object.keys(skills).forEach(skill => {
    const jobDiv = document.createElement('div');
    jobDiv.classList.add('job-button');
    jobDiv.setAttribute('data-job', skill);

    const decrementDiv = document.createElement('div');
    decrementDiv.classList.add('btn-decrement');
    decrementDiv.textContent = '-';
    jobDiv.appendChild(decrementDiv);

    const jobNameSpan = document.createElement('span');
    jobNameSpan.classList.add('job-name');
    jobNameSpan.textContent = `${skill.charAt(0).toUpperCase() + skill.slice(1)}: 0`;
    jobDiv.appendChild(jobNameSpan);

    const incrementDiv = document.createElement('div');
    incrementDiv.classList.add('btn-increment');
    incrementDiv.textContent = '+';
    jobDiv.appendChild(incrementDiv);

    jobsTab.appendChild(jobDiv);
});

