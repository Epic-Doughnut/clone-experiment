function triggerFloatUpText(x, y, text, color) {
    const floatText = document.createElement('div');
    floatText.textContent = text;
    floatText.style.left = `${window.scrollX + x}px`;
    floatText.style.top = `${window.scrollY + y - 30}px`;
    floatText.style.color = color;
    floatText.classList.add('float-up-fade-out');

    document.body.appendChild(floatText);

    // Remove the element from the DOM after the animation completes
    floatText.addEventListener('animationend', () => {
        floatText.remove();
    });
}
exports.triggerFloatUpText = triggerFloatUpText;
