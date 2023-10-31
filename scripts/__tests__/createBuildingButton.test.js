const { JSDOM } = require('jsdom');
const { createBuildingButton } = require('../buildings');
const { getMaterial } = require('../resources');



describe("createBuildingButton", () => {
    let mockBuildings = {};

    beforeEach(() => {
        mockBuildings = {
            'sampleBuilding': {
                basecost: { wood: 50, stone: 20 },
                effects: { clones: 5 },
                tooltipDesc: "A sample building for testing."
            }
        };
    });

    const passedStage = jest.fn();

    test("should create button with correct properties", () => {
        passedStage.mockImplementation((name) => { return true; });
        const result = createBuildingButton('sampleBuilding', mockBuildings);

        expect(result.class).toBe("tooltip sampleBuilding");
        expect(result.tab).toBe("production");
        expect(result.text).toBe("SampleBuilding");
        expect(result.tooltipDesc).toBe("A sample building for testing.");
        expect(result.tooltipCost).toBe("wood: 50, stone: 20");
        expect(result.requirement()).toBe(true); // Assuming passedStage('clones') would be true
        expect(result.data_building).toBe("sampleBuilding");
    });

    test("should handle building without 'clones' effects", () => {
        mockBuildings.sampleBuilding.effects = {};
        passedStage.mockImplementation((name) => { return false; });

        const result = createBuildingButton('sampleBuilding', mockBuildings);
        expect(result.requirement()).toBe(true); // As there's no clones effect
    });

    // Add more tests based on other edge cases you might encounter
});
