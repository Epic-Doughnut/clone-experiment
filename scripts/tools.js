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

function getToolValueForResource(resource) {
    if (resource.tools) {
        // Sort the tools in descending order based on their val
        const sortedTools = resource.tools.sort((a, b) => b.val - a.val);

        // Iterate through the sorted tools
        for (let tool of sortedTools) {
            if (hasTool(tool.tool)) {
                // If the player has the tool, return its associated value
                return tool.val;
            }
        }
    }

    // If none of the tools are found, return the default value
    return 1;
}