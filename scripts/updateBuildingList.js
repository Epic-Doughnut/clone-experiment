const { buildings } = require('./json/buildings');
const { updateTooltip, hideTooltip } = require('./updateTooltip');
const { fitCharToCell } = require('./fitCharToCell');

function updateBuildingList() {
    const buildingList = document.getElementById('buildingList');
    buildingList.innerHTML = '';
    let i = 0;
    const gridSize = 6;
    const maxCellWidth = 36;
    const maxCellHeight = 48;
    const initialFontSize = 36; // starting font size

    for (const [key, val] of Object.entries(buildings)) {
        for (let j = 0; j < val.count; ++j, ++i) {
            let col = (i % gridSize + 1).toString();
            let row = Math.floor(i / gridSize + 1).toString();

            // Calculate the best font size for this character
            // const fontSize = fitCharToCell(val.emoji || '?', maxCellWidth, maxCellHeight, initialFontSize);

            // Add the span with the calculated font size
            buildingList.innerHTML += `<span class = 'tooltip' style='grid-column:${col}; grid-row:${row}; font-size:${initialFontSize}px' tooltipDesc='${key}'>${val.emoji || '?'}</span>`;
        }
    }
    buildingList.querySelectorAll('span.tooltip').forEach((span) => {
        span.addEventListener('mouseenter', () => {
            updateTooltip(span);
        });
        span.addEventListener('mouseleave', () => {
            hideTooltip();
        });
    });
}
exports.updateBuildingList = updateBuildingList;