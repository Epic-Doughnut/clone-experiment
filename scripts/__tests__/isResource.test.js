const { isResource } = require('../json/resources');

describe("isResource test", () => {


    it('should recognize wood', () => {
        expect(isResource('wood')).toBe(true);
    });
    it('should recognize rocks', () => {
        expect(isResource('rocks')).toBe(true);
    });
    it('should not recognize air', () => {
        expect(isResource('air')).toBe(false);
    });
    it('should not recognize junk', () => {
        expect(isResource('junk')).toBe(false);
    });

    it('should not recongize sharprocks', () => {
        expect(isResource('sharprocks')).toBe(false);
    });
    it('should not recognize axe', () => {
        expect(isResource('axe')).toBe(false);
    });
});