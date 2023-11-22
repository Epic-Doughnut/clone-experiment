// Example usage
// navigateTo('next-page.html');
// Message 
const messageElement = document.getElementById('message');
exports.messageElement = messageElement;
function changeMessage(newMessage, cloneWords, tooltip = 'You feel peckish for some seafood') {
    // console.log(newMessage, cloneWords, tooltip);
    if (tooltip === null) tooltip = 'You feel peckish for some seafood';
    const modifiedMessage = newMessage.replace(cloneWords, `<span class='tooltip' id="alone" tooltipDesc="${tooltip}" tooltipcost="Click to clone yourself.">${cloneWords}</span>`);
    // @ts-ignore
    messageElement.innerHTML = modifiedMessage;
}
exports.changeMessage = changeMessage;