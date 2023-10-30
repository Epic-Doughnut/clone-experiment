const { JSDOM } = require('jsdom');
const { generateBuildingTooltipCost } = require("../buildings");

describe("generateBuildingTooltipCost", () => {
    test("should format cost correctly", () => {
        const cost = {
            wood: 12.5,
            stone: 24.123,
        };

        const result = generateBuildingTooltipCost(cost);
        const expected = "12.50 wood\n24.12 stone";

        expect(result).toBe(expected);
    });
});
