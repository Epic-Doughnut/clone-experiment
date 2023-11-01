const { getMaterial } = require('../getMaterial');

// Mocking the modules
jest.mock('../getCraftedResource', () => ({
    getCraftedResource: jest.fn()
}));

jest.mock('../json/craftedResources', () => ({}));

describe('getMaterial', () => {
    let resourcesMock;
    let craftedResourcesValue = 10;

    beforeEach(() => {
        resourcesMock = {
            wood: { value: 5 },
            stone: { value: 7 }
        };

        // Reset the mock implementation for each test
        // @ts-ignore
        require('../getCraftedResource').getCraftedResource.mockImplementation(() => craftedResourcesValue);
    });

    it('should return the correct value for a material in resources', () => {
        const result = getMaterial('wood', resourcesMock);
        expect(result).toBe(5);
    });

    it('should delegate to getCraftedResource for materials not in resources', () => {
        getMaterial('unknownMaterial', resourcesMock);
        expect(require('../getCraftedResource').getCraftedResource).toHaveBeenCalledWith('unknownMaterial', undefined);
    });

    it('should return the correct value for a crafted resource', () => {
        const result = getMaterial('craftedItem', resourcesMock);
        expect(result).toBe(craftedResourcesValue);
    });

    // You can add more tests as needed, like error scenarios.
});
