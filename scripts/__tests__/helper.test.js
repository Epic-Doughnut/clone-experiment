

// Mock the DOM functionalities
const jsdom = require('jsdom');
const { makeVisible } = require('../makeVisible');
const { passedStage, getAllStages } = require('../stages');
const { JSDOM } = jsdom;

// Initial stages for testing
const stages = [];

describe('DOM-related functions', () => {

    beforeEach(() => {
        // Set up a basic DOM for testing
        const dom = new JSDOM(`
          <!doctype html>
          <html>
              <body>
                  <p class="stage1"></p>
                  <p class="stage2"></p>
              </body>
          </html>
        `);
        global.document = dom.window.document;
    });

    describe('makeVisible', () => {
        it('should make elements with a specific class visible', () => {
            makeVisible('stage1');
            const stage1Elements = document.querySelectorAll("p.stage1");
            stage1Elements.forEach(element => {
                expect(element.classList.contains('visible')).toBe(true);
                expect(element.style.display).toBe('');
            });
        });

        // Additional tests can be added to verify the behavior of updateButtonVisibility and other side effects.
    });

    describe('passedStage', () => {
        it('should return true if a stage has passed', () => {
            stages.push('stage1');
            expect(passedStage('stage1')).toBe(true);
        });

        it('should return false if a stage has not passed', () => {
            expect(passedStage('stage2')).toBe(false);
        });
    });

    describe('getAllStages', () => {
        it('should return all the stages', () => {
            stages.push('stage1', 'stage2');
            expect(getAllStages()).toEqual(['stage1', 'stage2']);
        });
    });

});
