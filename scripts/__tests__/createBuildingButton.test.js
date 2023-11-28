const { JSDOM } = require('jsdom');
const { createBuildingButton } = require('../buildings');



describe("createBuildingButton", () => {
    let mockBuildings = {};
    const errorSpy = jest.spyOn(console, 'error');


    beforeAll(() => {
        mockBuildings = {
            'sampleBuilding': {
                basecost: { wood: 50, stone: 20 },
                effects: { clones: 5 },
                tooltipDesc: "A sample building for testing.",
                boost: {},
                count: 0,
                ratio: 1,
                emoji: '�'
            }
        };
    });

    it("should not call an error when building is defined", () => {
        const result = createBuildingButton('sampleBuilding', mockBuildings);
        expect(errorSpy).not.toHaveBeenCalled();
        expect(result).toBeDefined();
    });

    it("should call a warning when building is not defined", () => {
        const result = createBuildingButton('fakeBuilding', mockBuildings);
        expect(errorSpy).toHaveBeenCalled();
        expect(result).toBeUndefined();
    });

    test("should create button with correct properties", () => {
        const result = createBuildingButton('sampleBuilding', mockBuildings);

        expect(result).toBeDefined();
        expect(result.class).toBe("tooltip sampleBuilding");
        expect(result.tab).toBe("production");
        expect(result.text).toBe("� SampleBuilding (0)");
        expect(result.tooltipDesc).toBe("A sample building for testing.");
        expect(result.tooltipCost).toBe("wood: 50, stone: 20");
        expect(result.requirement()).toBe(false); // Assuming no materials
        expect(result.data_building).toBe("sampleBuilding");
    });


    // Add more tests based on other edge cases you might encounter
});
