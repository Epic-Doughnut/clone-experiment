const { drawAllConnections } = require('./jobs');
const { refreshValues, battleResult, simulateBattle } = require('./combat');
const {  playSound } = require('./audio');

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
    const activeContent = document.getElementById(tabName);

    activeContent.classList.add('active');

    if (tabName === prevTab) return;

    playSound('./audio/tab.wav');


    let prevTabElement = document.getElementById(prevTab);
    if (prevTabElement) {
        prevTabElement.classList.remove('active');
        prevTabElement.style.opacity = '0';
    }
    // Get all tab buttons and remove the active class
    let tabs = document.querySelectorAll(".tab-button");
    for (let tab of tabs) {
        tab.classList.remove("active");
    }

    // Show the clicked tab's main container div and make the tab button active
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

    if (tabName === 'combatTab') {
        refreshValues();

        // When returning to the combatTab, resolve the battle if it hasn't been resolved yet
        if (battleResult === null) {
            simulateBattle();
        }
    }
    const canvas = document.querySelector('canvas#fullscreen');
    const body = document.body,
        html = document.documentElement;
    canvas.height = Math.min(body.scrollHeight, body.offsetHeight,
        html.clientHeight, html.scrollHeight, html.offsetHeight);;
    setTimeout(() => {
        canvas.width = document.documentElement.scrollWidth;
        canvas.height = Math.max(body.scrollHeight, body.offsetHeight,
            html.clientHeight, html.scrollHeight, html.offsetHeight);
        console.log("changed canvas dimensions", canvas.width, canvas.height);

    }, 100);
    console.log(prevTab, '>', tabName);

    // updateSidebar();
}
exports.showTab = showTab;
