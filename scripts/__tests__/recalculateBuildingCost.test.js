const { JSDOM } = require('jsdom');
const { recalculateBuildingCost } = require('../buildings'); // adjust the path accordingly


const dom = new JSDOM(`<!doctype html><html>
<body>
<button id="someBuilding" data-tooltip-cost="" data-tooltip-effect=""></button>
</body>
</html>`);
global.document = dom.window._document;
// @ts-ignore
global.window = dom.window;

// Mocking buildings object and hasPerk function
const buildings = {
    someBuilding: {
        basecost: {
            wood: 100,
            stone: 50
        },
        cost: {
            wood: 100,
            stone: 50
        },
        effects: { wood: 10 },
        boost: { wood: 1.05 },
        ratio: 1.2,
        count: 1
    }
};

const hasPerk = jest.fn();



// const recalculateBuildingCost = require('../recalculateBuildingCost');

test('recalculateBuildingCost calculates cost without architect perk', () => {
    hasPerk.mockImplementation((p) => { return false; });
    recalculateBuildingCost('someBuilding', buildings, hasPerk);
    expect(buildings.someBuilding.cost.wood).toBe(120);
    expect(buildings.someBuilding.cost.stone).toBe(60);
});

test('recalculateBuildingCost applies architect perk', () => {
    hasPerk.mockImplementation((perkName) => {
        if (perkName === 'Architect') {
            return true;
        }
        return false; // Default behavior for other cases
    });
    const initialWoodCost = buildings.someBuilding.cost.wood;
    const initialStoneCost = buildings.someBuilding.cost.stone;

    recalculateBuildingCost('someBuilding', buildings, hasPerk);
    expect(buildings.someBuilding.cost.wood).toBe(Math.round(initialWoodCost * 0.75));
    expect(buildings.someBuilding.cost.stone).toBe(Math.round(initialStoneCost * 0.75));
});
