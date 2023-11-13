const { buildings } = require('./json/buildings');
const { updateTooltip, hideTooltip } = require('./updateTooltip');
const { fitCharToCell } = require('./fitCharToCell');

const buildingList = document.getElementById('buildingList');
// function updateBuildingList() {
//     buildingList.innerHTML = '';
//     let i = 0;
//     const gridSize = 6;
//     const maxCellWidth = 36;
//     const maxCellHeight = 48;
//     const initialFontSize = 36; // starting font size

//     for (const [key, val] of Object.entries(buildings)) {
//         for (let j = 0; j < val.count; ++j, ++i) {
//             let col = (i % gridSize + 1).toString();
//             let row = Math.floor(i / gridSize + 1).toString();

//             // Calculate the best font size for this character
//             // const fontSize = fitCharToCell(val.emoji || '?', maxCellWidth, maxCellHeight, initialFontSize);

//             // Add the span with the calculated font size
//             // addToBuildingList(col, row, initialFontSize, key, val.emoji);
//             buildingList.innerHTML += `<span class = 'tooltip' style='grid-column:${col}; grid-row:${row}; font-size:${initialFontSize}px' tooltipDesc='${key}'>${val.emoji || '?'}</span>`;

//         }
//     }
//     buildingList.querySelectorAll('span.tooltip').forEach((span) => {
//         span.addEventListener('mouseenter', () => {
//             updateTooltip(span);
//         });
//         span.addEventListener('mouseleave', () => {
//             hideTooltip();
//         });
//     });
// }

function updateBuildingList() {
    const fragment = document.createDocumentFragment();
    let i = 0;
    const gridSize = 6;
    const initialFontSize = 36; // Starting font size

    for (const [key, val] of Object.entries(buildings)) {
        for (let j = 0; j < val.count; ++j, ++i) {
            let col = (i % gridSize + 1).toString();
            let row = Math.floor(i / gridSize + 1).toString();

            const span = document.createElement('span');
            span.className = 'tooltip';
            span.style.gridColumn = col;
            span.style.gridRow = row;
            span.style.fontSize = `${initialFontSize}px`;
            span.setAttribute('tooltipDesc', key);
            span.textContent = val.emoji || '?';

            fragment.appendChild(span);
        }
    }

    // Clear the existing content and append the new content
    buildingList.innerHTML = '';
    buildingList.appendChild(fragment);

    // Event delegation for tooltips
    buildingList.addEventListener('mouseenter', (event) => {
        if (event.target.classList.contains('tooltip')) {
            updateTooltip(event.target);
        }
    }, true);

    buildingList.addEventListener('mouseleave', (event) => {
        if (event.target.classList.contains('tooltip')) {
            hideTooltip();
        }
    }, true);
}

exports.updateBuildingList = updateBuildingList;



/**
 *
 * @param {Object} building
 */
// function addToBuildingList(key, emoji) {
//     buildingList.innerHTML += `<span class = 'tooltip' style='grid-column:${col}; grid-row:${row}; font-size:${fontsize}px' tooltipDesc='${key}'>${emoji || '?'}</span>`;

// }
// exports.addToBuildingList = addToBuildingList;