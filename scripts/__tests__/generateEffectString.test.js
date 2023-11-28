const { generateEffectString } = require("../buildings");

jest.mock('../ponder', () => ({
    isPondered: jest.fn(),
}));
const { isPondered } = require("../ponder");

describe("generateEffectString", () => {
    const woodBuilding = { effects: { wood: 1 }, boost: { wood: 1.1 } };
    it("should generate a string", () => {
        expect(typeof generateEffectString(woodBuilding)).toBe("string");
    });

    it("should generate a string of effects and boosts", () => {
        expect(generateEffectString(woodBuilding)).toBe("+1 max wood<br>+10.00% wood production");
    });

    it("should round effects to the nearest two decimal places", () => {
        woodBuilding.boost = { wood: 1.1005 };
        expect(generateEffectString(woodBuilding)).toBe("+1 max wood<br>+10.00% wood production");
    });
    it("should incorporate ponder bonuses", () => {
        // @ts-ignore
        isPondered.mockImplementation((pon) => { if (pon == "effectiveBuildings1") return true; });
        expect(generateEffectString(woodBuilding)).toBe("+1 max wood<br>+10.30% wood production");

        // @ts-ignore
        isPondered.mockImplementation((pon) => { if (pon == "effectiveBuildings1" || pon == "effectiveBuildings2") return true; });
        expect(generateEffectString(woodBuilding)).toBe("+1 max wood<br>+10.61% wood production");

    });
});