import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, orderBy, where } from 'firebase/firestore';

export interface Brand {
    id?: string;
    name: string;
    logoUrl: string;
}

const COLLECTION_NAME = 'brands';

export const brandService = {
    async getBrands(): Promise<Brand[]> {
        try {
            const q = query(collection(db, COLLECTION_NAME), orderBy('name', 'asc'));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Brand));
        } catch (error) {
            console.error("Erro ao buscar marcas:", error);
            return [];
        }
    },

    async createBrand(brand: Brand): Promise<string> {
        try {
            const docRef = await addDoc(collection(db, COLLECTION_NAME), brand);
            return docRef.id;
        } catch (error) {
            console.error("Erro ao criar marca:", error);
            throw error;
        }
    },

    async seedBrands() {
        const brandsToCheck = await this.getBrands();
        if (brandsToCheck.length > 0) return; // Já existem marcas

        const initialBrands = [
            { name: 'Audi', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Audi-Logo_2016.svg/2560px-Audi-Logo_2016.svg.png' },
            { name: 'BMW', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/2048px-BMW.svg.png' },
            { name: 'Chevrolet', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Chevrolet_logo.png/2560px-Chevrolet_logo.png' },
            { name: 'Ferrari', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d1/Ferrari-Logo.svg/1200px-Ferrari-Logo.svg.png' },
            { name: 'Fiat', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Fiat_Automobiles_logo.svg/2560px-Fiat_Automobiles_logo.svg.png' },
            { name: 'Ford', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Ford_logo_flat.svg/2560px-Ford_logo_flat.svg.png' },
            { name: 'Honda', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Honda_Logo.svg/2560px-Honda_Logo.svg.png' },
            { name: 'Hyundai', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Hyundai_Motor_Company_logo.svg/2560px-Hyundai_Motor_Company_logo.svg.png' },
            { name: 'Jeep', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Jeep_logo.svg/2560px-Jeep_logo.svg.png' },
            { name: 'Kia', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Kia_logo.svg/2560px-Kia_logo.svg.png' },
            { name: 'Land Rover', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9f/Land_Rover_logo_black.svg/1200px-Land_Rover_logo_black.svg.png' },
            { name: 'Mercedes-Benz', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Mercedes-Benz_Logo_2010.svg/2560px-Mercedes-Benz_Logo_2010.svg.png' },
            { name: 'Mitsubishi', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Mitsubishi_logo.svg/2560px-Mitsubishi_logo.svg.png' },
            { name: 'Nissan', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Nissan_logo.png/2560px-Nissan_logo.png' },
            { name: 'Porsche', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/df/Porsche_Wappen.svg/1200px-Porsche_Wappen.svg.png' },
            { name: 'Renault', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Renault_2009_logo.svg/2560px-Renault_2009_logo.svg.png' },
            { name: 'Toyota', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Toyota_carlogo.svg/2560px-Toyota_carlogo.svg.png' },
            { name: 'Volkswagen', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Volkswagen_logo_2019.svg/2560px-Volkswagen_logo_2019.svg.png' },
            { name: 'Volvo', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Volvo_Iron_Mark_Black.svg/2560px-Volvo_Iron_Mark_Black.svg.png' }
        ];

        for (const brand of initialBrands) {
            await this.createBrand(brand);
        }
    }
};
