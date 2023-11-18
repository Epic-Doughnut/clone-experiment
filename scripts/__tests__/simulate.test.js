// game.test.js
const { buyBuilding } = require('../building'); // Import your game functions
const { update } = require('../main'); // Import your game functions


jest.useFakeTimers(); // Mock timers to control time


describe('Simulated Player Actions', () => {
    beforeAll(() => {// Mock the Audio class to prevent ReferenceError
        class MockAudio {
            constructor() { }
            play() { }
            pause() { }
            // Add other methods you might use in your code
        }

        // @ts-ignore
        global.Audio = MockAudio; // Assign the mocked Audio class to the global object
    });

    beforeEach(() => {
        jest.clearAllTimers(); // Clear timers before each test
    });

    it('should simulate a player clicking to buy a building', () => {
        const buildingId = 'exampleBuilding';


        // Mock the buyBuilding function
        // @ts-ignore
        const buyBuildingSpy = jest.spyOn(global, 'buyBuilding');

        // Simulate the game loop and player click
        update(1000); // Simulate a game update with deltaTime

        // Advance time to simulate the player's click
        jest.advanceTimersByTime(5000); // Simulate a click every 5 seconds

        // Expect that the buyBuilding function was called with the correct building ID
        expect(buyBuildingSpy).toHaveBeenCalledWith(buildingId);
    });
});
