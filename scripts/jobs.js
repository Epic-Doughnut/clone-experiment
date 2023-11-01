// @ts-nocheck
// DEPENDS ON: skills.js, ponder.js
const { skills } = require('./json/skills');
const { resources } = require('./json/resources');


const { getMaterial } = require('./getMaterial');
const { updateEmojiDisplay } = require('./resources');
const { isPondered } = require("./ponder");

/* JOBS FUNCTIONALITY */


const jobCounts = {};
for (let skill in skills) {
    jobCounts[skill] = 0;
}



const jobsTab = document.getElementById('jobsTab');

Object.keys(skills).forEach(skill => {
    const jobDiv = document.createElement('div');
    jobDiv.classList.add('job-button');
    jobDiv.setAttribute('data-job', skill);
    jobDiv.id = 'job-button-' + skill;

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




document.querySelectorAll('.btn-increment').forEach(btn => {
    btn.addEventListener('click', function () {
        const jobType = this.closest('.job-button').getAttribute('data-job');
        if (getMaterial('clones', resources) > getTotalJobs()) {
            jobCounts[jobType]++;
            // increaseMaterial('clones', -1);
        }
        distributeWorkers(jobType, jobCounts[jobType]);
        updateDisplay(jobType);
        updateTotal();
        console.log(workersDistribution);
    });
});

document.querySelectorAll('.btn-decrement').forEach(btn => {
    btn.addEventListener('click', function () {
        const jobType = this.closest('.job-button').getAttribute('data-job');
        if (jobCounts[jobType] > 0) {
            jobCounts[jobType]--;
            // increaseMaterial('clones', 1);
            distributeWorkers(jobType, jobCounts[jobType]);
            updateDisplay(jobType);
            updateTotal();
        }
    });
});


function getTotalJobs() {
    var total = 0;
    for (let j in jobCounts) {
        total += jobCounts[j];
    }
    return total;
}

// Global for which resource each clone gathers
let workersDistribution = new Map();
function distributeWorkers(skill, totalWorkers) {
    if (!skills[skill]) return null;  // Return null if the skill doesn't exist

    let affectedResources = skills[skill].affectedResources;

    // Filter affectedResources to only contain keys that are present in the resources map
    affectedResources = affectedResources.filter(resource => resource in resources);

    // let a;
    // for (let i = 0; i < affectedResources.length; a = affectedResources[i]) {

    //     console.log(a);
    //     if (!resources[a]) {

    //         const index = affectedResources.indexOf(a);
    //         console.log(a, index);
    //         let x = affectedResources.splice(index, 1);
    //     } else {
    //         ++i;
    //     }
    // }
    console.log(affectedResources);
    let numberOfResources = affectedResources.length;

    // Initial even distribution
    let perResource = Math.floor(totalWorkers / numberOfResources);

    // Evenly distribute workers among the affected resources
    for (let resource of affectedResources) {
        workersDistribution.set(resource, perResource);
    }

    // Distribute any remaining workers due to rounding
    let remainingWorkers = totalWorkers - (perResource * numberOfResources);
    for (let resource of affectedResources) {
        if (remainingWorkers > 0) {
            workersDistribution.set(resource, workersDistribution.get(resource) + 1);
            remainingWorkers--;
        }
    }

    console.log(workersDistribution);
}


function getWorkers(resourceName) {
    return workersDistribution.get(resourceName);
}

// const allJobButtonbs = document.querySelectorAll('.job-button');
function updateDisplay(jobType) {
    const thisJobButton = document.querySelector(`.job-button[data-job="${jobType}"]`);
    if (!thisJobButton) console.warn("Couldn't find job button for job: ", jobType);
    const jobElement = thisJobButton.querySelector(`.job-name`);
    if (jobElement) jobElement.textContent = `${jobType.charAt(0).toUpperCase() + jobType.slice(1)}: ${jobCounts[jobType]}`;

    updateEmojiDisplay();
}


function updateTotal() {
    const totalElement = document.querySelector('#jobs-total');
    totalElement.textContent = "Assigned Clones: " + getTotalJobs() + " / " + getMaterial('clones', resources);
}


let startButton = null;
let connections = new Map();  // Map to store connections
let management = { 'connections': connections, 'mins': {}, 'maxes': {}, 'triggers': {} };
let canvas = document.getElementById('lineCanvas');

function setConnections(newConnections) {
    connections = newConnections;
}

function getConnections() {
    return connections;
}

// if (canvas) {
// @ts-ignore
let ctx = canvas.getContext('2d');
// @ts-ignore
canvas.width = window.innerWidth;
// @ts-ignore
canvas.height = window.innerHeight;
// }

document.addEventListener('DOMContentLoaded', function () {
    let buttons = document.querySelectorAll('.job-button');

    buttons.forEach(button => {
        button.addEventListener('click', function (e) {
            if (e.target.closest('.btn-decrement') || e.target.closest('.btn-increment')) return;

            if (!isPondered('management')) return;

            let jobButton = e.target.closest('.job-button');

            if (jobButton) {
                if (!startButton) {
                    startButton = jobButton;
                    startButton.classList.add('highlight');
                } else if (startButton.id && jobButton.id) { // Ensure both IDs are available
                    connections.set(startButton.id, jobButton.id);

                    // Draw all connections
                    drawAllConnections();

                    // Reset
                    startButton.classList.remove('highlight');
                    startButton = null;
                } else {
                    console.error('Missing ID for one of the buttons:', startButton, jobButton);
                }
            } else {
                console.error('Clicked element is not inside a job button:', e.target);
            }
        });

    });

    document.addEventListener('mousemove', function (e) {
        if (startButton) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw existing connections
            drawAllConnections();

            // Draw the line from startButton to current mouse position
            drawLine(startButton, e.clientX, e.clientY);
        }
    });
});

function drawAllConnections() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    try {


        for (let [oldId, newId] of connections.entries()) {
            let oldButton = document.getElementById(oldId);
            let newButton = document.getElementById(newId);
            let rect = newButton.getBoundingClientRect();
            let newX = rect.left + rect.width / 2;
            let newY = 0;
            if (rect.bottom > oldButton.getBoundingClientRect().bottom) newY = newButton.offsetTop - 10;
            else newY = newButton.offsetTop + newButton.offsetHeight + 10;
            drawLine(oldButton, newX, newY);
        }
    }
    catch (error) { console.warn('drawAllConnections', error); }
}

function drawArrowhead(context, fromX, fromY, toX, toY, radius) {
    let x_center = toX;
    let y_center = toY;

    let angle;
    let x;
    let y;

    context.beginPath();

    angle = Math.atan2(toY - fromY, toX - fromX);
    x = radius * Math.cos(angle) + x_center;
    y = radius * Math.sin(angle) + y_center;

    context.moveTo(x, y);

    angle += (1 / 3) * (2 * Math.PI);
    x = radius * Math.cos(angle) + x_center;
    y = radius * Math.sin(angle) + y_center;

    context.lineTo(x, y);

    angle += (1 / 3) * (2 * Math.PI);
    x = radius * Math.cos(angle) + x_center;
    y = radius * Math.sin(angle) + y_center;

    context.lineTo(x, y);

    context.closePath();

    context.fill();
}

function drawLine(startElement, endX, endY) {
    let rect = startElement.getBoundingClientRect();
    // let offset = Math.random() * 100 + 100
    let startX = rect.left + rect.width / 2; // - offset;
    // endX -= offset;
    let startY = scrollY + rect.top + rect.height / 2;

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // Draw arrow at the end of the line
    drawArrowhead(ctx, startX, startY, endX, endY, 10);  // adjust the last parameter for arrow size
}

function clearJobAssignments() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    connections = new Map();
}

function reassignJobsBasedOnResources() {
    // For each connection
    try {
        const entries = connections.entries();
        if (entries === undefined) throw 'Entries is undefined';

        for (let [oldJobId, newJobId] of entries) {
            let oldJobButton = document.getElementById(oldJobId);
            let dataJob = oldJobButton.getAttribute('data-job');

            const oldId = oldJobId.replace('job-button-', '');
            const newId = newJobId.replace('job-button-', '');
            let maxedOut = true;

            let resourceArray = skills[dataJob].affectedResources;
            if (!resourceArray) return;
            // console.log(resourceArray);
            for (const r of resourceArray) {

                // console.log(r);
                if (resources[r] !== undefined && getMaterial(r) < resources[r].max) {
                    // console.log(r, getMaterial(r), resources[r].max);
                    maxedOut = false;
                    break;
                }
            }

            if (maxedOut && jobCounts[dataJob] > 0) {
                switchJob(oldId, newId);
                distributeWorkers(oldId, jobCounts[oldId]);
                distributeWorkers(newId, jobCounts[newId]);
            }

            // if (resources[affectedResource].currentValue >= resources[affectedResource].maxValue) {
            //     switchJob(oldJobId, newJobId);
            // }
        }
    } catch (error) { console.warn('reassignJobs', error); }

}

function switchJob(oldJobId, newJobId) {
    // This function switches workers from oldJob to newJob.
    // Depending on your application structure, you can implement this function accordingly.
    // For example, reduce the count of workers in oldJob and increase in newJob.
    // console.log(`Switching workers from ${oldJobId} to ${newJobId}`);

    let workers = jobCounts[oldJobId];
    jobCounts[oldJobId] = 0;
    jobCounts[newJobId] += workers;
    updateDisplay(oldJobId);
    updateDisplay(newJobId);
}


module.exports = {
    clearJobAssignments,
    reassignJobsBasedOnResources,
    switchJob,
    drawAllConnections,
    getWorkers,
    updateTotal,
    setConnections,
    getConnections,
    distributeWorkers,
    updateDisplay,
    jobCounts
};