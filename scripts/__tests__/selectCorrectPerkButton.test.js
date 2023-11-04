// selectCorrectPerkButton.test.js
const { selectCorrectPerkButton } = require('../selectCorrectPerkButton'); // Update with your actual path
const { JSDOM } = require('jsdom');


describe('selectCorrectPerkButton', () => {
    let document;
    beforeEach(() => {
        document = (new JSDOM(`<html><body></body></html>`)).window._document;
        global.document = document;
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('disables all buttons and highlights the correct one', () => {
        document.body.innerHTML = `
      <button id="SpeedPerk" class="tierOneButton">Speed</button>
    `;
        selectCorrectPerkButton('Speed');
        const button = document.getElementById('SpeedPerk');
        expect(button.disabled).toBeFalsy();
        expect(button.classList.contains('selected')).toBeTruthy();
    });

    it('logs a warning when no button is found', () => {
        console.warn = jest.fn();
        selectCorrectPerkButton('nonExistentPerk');
        expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('No button found with ability name:'));
    });

    it('does not select wrong buttons', () => {
        document.body.innerHTML = `
      <button id="SpeedPerk" class="tierOneButton">Speed</button>
    `;
        selectCorrectPerkButton('NonExistant');
        const button = document.getElementById('SpeedPerk');


        expect(button.classList.contains('selected')).toBeFalsy();
        expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('No button found with ability name:'));

    });
});
