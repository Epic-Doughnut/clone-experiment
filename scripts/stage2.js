// Example resources
let resources = {
    wood: { amount: 100, rate: 1 },
    rocks: { amount: 100, rate: 1 },
    // ... add all resources
};

// Initialize sidebar with resources
function updateSidebar() {
    const resourcesDiv = document.getElementById('resources');
    resourcesDiv.innerHTML = ''; // Clear current resources list
    for (let key in resources) {
        let resource = resources[key];
        resourcesDiv.innerHTML += `<div>${key}: ${resource.amount} (Rate: ${resource.rate}/s)</div>`;
    }
}

// Show main panel
function showMainPanel() {
    document.getElementById('main-panel').classList.remove('hidden');
    document.getElementById('graphs-panel').classList.add('hidden');
}

// Show graphs panel
function showGraphsPanel() {
    document.getElementById('graphs-panel').classList.remove('hidden');
    document.getElementById('main-panel').classList.add('hidden');
}

// Hotkey event listener
document.addEventListener('keydown', function (event) {
    switch (event.key) {
        case '1':
            showMainPanel();
            break;
        case '2':
            showGraphsPanel();
            break;
    }
});

updateSidebar();
