/**
 * Mapeamento de marcas para logos
 * Usa o serviço da Clearbit para obter logos PNG de alta qualidade.
 */

export const getBrandLogo = (brand: string): string | null => {
    if (!brand) return null;
    const normalized = brand.toLowerCase().trim();

    const domainMap: Record<string, string> = {
        'fiat': 'fiat.com.br',
        'volkswagen': 'vw.com.br',
        'chevrolet': 'chevrolet.com.br',
        'ford': 'ford.com.br',
        'toyota': 'toyota.com.br',
        'honda': 'honda.com.br',
        'hyundai': 'hyundai.com.br',
        'renault': 'renault.com.br',
        'jeep': 'jeep.com.br',
        'nissan': 'nissan.com.br',
        'bmw': 'bmw.com.br',
        'mercedes-benz': 'mercedes-benz.com.br',
        'mercedes': 'mercedes-benz.com.br',
        'audi': 'audi.com.br',
        'kia': 'kia.com.br',
        'peugeot': 'peugeot.com.br',
        'citroen': 'citroen.com.br',
        'mitsubishi': 'mitsubishimotors.com.br',
        'land rover': 'landrover.com.br',
        'volvo': 'volvocars.com',
        'porsche': 'porsche.com',
        'ferrari': 'ferrari.com',
        'lamborghini': 'lamborghini.com',
        'maserati': 'maserati.com',
        'aston martin': 'astonmartin.com',
        'mclaren': 'mclaren.com',
        'subaru': 'subaru.com',
        'mazda': 'mazda.com',
        'suzuki': 'suzukiveiculos.com.br',
        'byd': 'byd.com',
        'gwm': 'gwmmotors.com.br',
        'caoa chery': 'caoachery.com.br',
        'chery': 'caoachery.com.br',
        'jac': 'jacmotors.com.br',
        'ram': 'ram.com.br'
    };

    const domain = domainMap[normalized] || `${normalized}.com`;
    return `https://logo.clearbit.com/${domain}`;
};

export const hasBrandLogo = (brand: string): boolean => {
    return getBrandLogo(brand) !== null;
};
