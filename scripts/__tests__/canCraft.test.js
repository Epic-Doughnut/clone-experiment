// canCraft.test.js
const { canCraft } = require('../canCraft');
const craftedResources = {
    wood: { cost: { sticks: 5 } },
    // Add more resources as needed
};

jest.mock('../getMaterial', () => ({
    getMaterial: jest.fn(),
}));
jest.mock('../json/craftedResources', () => ({
    craftedResources: craftedResources,
}));

describe('canCraft', () => {
    it('returns true when all materials are available', () => {
        // @ts-ignore
        require('../getMaterial').getMaterial.mockImplementation((mat) => 10);
        expect(canCraft('wood')).toBeTruthy();
    });

    it('returns false when not all materials are available', () => {
        // @ts-ignore
        require('../getMaterial').getMaterial.mockImplementation((mat) => {
            return mat === 'sticks' ? 4 : 10;
        });
        expect(canCraft('wood')).toBeFalsy();
    });
});

afterEach(() => {
    jest.resetModules();
});
