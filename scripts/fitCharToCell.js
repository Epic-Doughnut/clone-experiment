function fitCharToCell(char, cellWidth, cellHeight, initialFontSize) {
    // Create a temporary span element to measure the character
    const span = document.createElement('span');
    span.textContent = char;
    span.style.fontSize = `${initialFontSize}px`;
    span.style.position = 'absolute'; // so it doesn't affect the layout
    span.style.whiteSpace = 'nowrap'; // to prevent line breaks
    span.style.visibility = 'hidden'; // to keep it hidden
    document.body.appendChild(span);

    // Check if the span fits within the dimensions, and adjust font size if not
    let currentFontSize = initialFontSize;
    while (span.offsetWidth < cellWidth && span.offsetHeight < cellHeight) {
        currentFontSize++;
        span.style.fontSize = `${currentFontSize}px`;

        // Optional: stop if the font size gets too small
        if (currentFontSize >= 1000) {
            break;
        }
    }

    // Clean up: remove the temporary span element
    document.body.removeChild(span);

    return currentFontSize;
}
exports.fitCharToCell = fitCharToCell;
