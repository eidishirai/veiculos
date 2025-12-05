export const fipeService = {
    async getBrands() {
        const response = await fetch('https://parallelum.com.br/fipe/api/v1/carros/marcas');
        return response.json();
    },

    async getModels(brandId: string) {
        const response = await fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${brandId}/modelos`);
        return response.json();
    },

    async getYears(brandId: string, modelId: string) {
        const response = await fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${brandId}/modelos/${modelId}/anos`);
        return response.json();
    },

    async getVehicleDetails(brandId: string, modelId: string, yearId: string) {
        const response = await fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${brandId}/modelos/${modelId}/anos/${yearId}`);
        return response.json();
    }
};
