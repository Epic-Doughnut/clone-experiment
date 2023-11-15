const { drawAllConnections } = require('./jobs');
const { updateSidebar } = require('./sidebar');
const { refreshValues } = require('./combat');
const { sfxVolume } = require('./audio');

function getCurrentTab() {
    let tab = '';
    for (let content of tabContainers) {
        if (content.classList.contains('active')) {
            tab = content.id;
        }
    }
    return tab;
}
exports.getCurrentTab = getCurrentTab;
// Switch tabs
let tabContainers = document.querySelectorAll(".tab-content > .content"); // Direct children only

function showTab(tabName) {
    console.log("show tab: " + tabName);
    // Get all main container divs and hide them
    let prevTab = getCurrentTab();

    if (tabName === prevTab) return;

    let tabAudio = new Audio('./audio/tab.wav');
    tabAudio.volume = sfxVolume;
    tabAudio.play();

    let prevTabElement = document.getElementById(prevTab);
    prevTabElement.classList.remove('active');
    prevTabElement.style.opacity = '0';
    // Get all tab buttons and remove the active class
    let tabs = document.querySelectorAll(".tab-button");
    for (let tab of tabs) {
        tab.classList.remove("active");
    }

    // Show the clicked tab's main container div and make the tab button active
    let activeContent = document.getElementById(tabName);
    // @ts-ignore
    setTimeout(() => { activeContent.classList.add("active"); }, 100);
    setTimeout(() => {
        activeContent.style.opacity = '1';
    }, 200);


    // Get the clicked tab button and make it active
    const tabString = `#${tabName}Button`;
    let activeTabButton = document.querySelector(tabString);

    if (activeTabButton) activeTabButton.classList.add("active");

    if (tabName === 'jobsTab')
        drawAllConnections();

    if (tabName === 'combatTab')
        refreshValues();

    console.log(prevTab, '>', tabName);

    updateSidebar();
}
exports.showTab = showTab;
