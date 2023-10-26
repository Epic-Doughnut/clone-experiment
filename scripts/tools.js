/* TOOLS */


// List to hold the tools
let playerTools = ['Bare Hands'];

// Function to check if a tool is present in the list
function hasTool(tool) {
    return playerTools.includes(tool);
}

// Function to add a tool if it's not already present
function addTool(tool) {
    if (!hasTool(tool)) {
        playerTools.push(tool);

        updateToolUI(tool);
    }
}

function updateToolUI(tool) {
    // Update the UI
    var ul = document.getElementById("tools-list");
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(tool));
    ul.appendChild(li);
}