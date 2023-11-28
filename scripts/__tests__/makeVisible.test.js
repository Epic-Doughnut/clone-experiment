
// Mock the necessary functions
jest.mock('../makeVisible', () => ({
    makeVisible: jest.fn(),
}));
jest.mock('../stages', () => ({
    passedStage: jest.fn(),
    setStage: jest.fn(),
}));
jest.mock('../updateButtonVisibility', () => ({
    updateButtonVisibility: jest.fn(),
}));

const jsdom = require('jsdom');
const { makeVisible } = require('../makeVisible');
const { setStage, passedStage } = require('../stages');
const { updateButtonVisibility } = require('../updateButtonVisibility');
const { JSDOM } = jsdom;

// Set up a fake DOM before each test
let dom;
let document;
beforeEach(() => {
    dom = new JSDOM(`<html><body></body></html>`);
    document = dom.window._document;
    global.document = document;
});

describe('makeVisible', () => {

    const setStageSpy = jest.spyOn(stages, setStage);
    it('makes stage elements visible and updates visibility', () => {
        // Set up a fake stage class
        document.body.innerHTML += '<p class="stage testStage"></p><p class="stage testStage"></p>';
        // @ts-ignore
        passedStage.mockReturnValue(false);
        makeVisible('testStage');
        expect(setStage).toHaveBeenCalled();
        const stageElements = document.querySelectorAll('.testStage');
        stageElements.forEach((element) => {
            expect(element.classList).toContain('visible');
            expect(element.classList).not.toContain('hidden');
            expect(element.style.display).toBe('');
        });
        expect(updateButtonVisibility).toHaveBeenCalled();
    });
});

afterEach(() => {
    jest.resetAllMocks();
});
