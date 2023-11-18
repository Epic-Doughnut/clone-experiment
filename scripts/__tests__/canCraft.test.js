// @ts-nocheck
// Mocking the modules
jest.mock('../getMaterial', () => ({
    getMaterial: jest.fn()
}));
jest.mock('../json/craftedResources', () => ({
    craftedResources: {
        wood: { cost: { sticks: 5 } },
        rope: { cost: { vines: 3 } }
    }
}));

const { canCraft } = require('../canCraft');
const { getMaterial } = require('../getMaterial');
const { craftedResources } = require('../json/craftedResources');

describe('canCraft', () => {
    beforeEach(() => {
        // Clear mock implementation before each test
        getMaterial.mockClear();
    });

    it('returns true when all materials are available', () => {
        getMaterial.mockImplementation((mat) => 10); // Mock implementation

        expect(canCraft('rope')).toBeTruthy();
        expect(getMaterial).toHaveBeenCalledWith('vines');
    });

    it('returns false when not all materials are available', () => {
        getMaterial.mockImplementation((mat) => 0); // Mock implementation

        expect(canCraft('rope')).toBeFalsy();
        expect(getMaterial).toHaveBeenCalledWith('vines');
    });

});
