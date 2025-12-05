import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, orderBy, where } from 'firebase/firestore';

// Tipagem do Veículo
export interface Vehicle {
    id?: string;
    marca: string;
    modelo: string;
    ano: string;
    preco: number;
    km: number;
    cor: string;
    combustivel: string;
    transmissao: string;
    descricao: string;
    fotos: string[]; // URLs das fotos
    destaque?: boolean;
    status: 'disponivel' | 'vendido' | 'reservado';
    createdAt: Date;
    // Campos FIPE
    mostrarFipe?: boolean;
    precoFipe?: string; // Valor FIPE formatado (ex: "R$ 82.738,00")
    // Opcionais do veículo
    opcionais?: string[]; // Lista de opcionais (ex: ["Ar-condicionado", "Direção hidráulica", "Airbag"])
}

const COLLECTION_NAME = 'vehicles';

export const vehicleService = {
    // Upload de imagem para Cloudinary (GRATUITO - 25GB)
    async uploadImage(file: File): Promise<string> {
        try {
            const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
            const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

            if (!cloudName || !uploadPreset) {
                throw new Error('Cloudinary não configurado. Verifique o .env.local');
            }

            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', uploadPreset);
            formData.append('folder', 'vehicles');

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                {
                    method: 'POST',
                    body: formData
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Erro ao fazer upload');
            }

            const data = await response.json();
            return data.secure_url;
        } catch (error) {
            console.error("Erro ao fazer upload da imagem:", error);
            throw error;
        }
    },

    // Salvar novo veículo
    async createVehicle(vehicleData: Omit<Vehicle, 'id' | 'createdAt'>): Promise<string> {
        try {
            const docRef = await addDoc(collection(db, COLLECTION_NAME), {
                ...vehicleData,
                createdAt: new Date(),
                status: 'disponivel'
            });
            return docRef.id;
        } catch (error) {
            console.error("Erro ao salvar veículo:", error);
            throw error;
        }
    },

    // Listar todos os veículos
    async getVehicles(): Promise<Vehicle[]> {
        try {
            const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Vehicle));
        } catch (error) {
            console.error("Erro ao buscar veículos:", error);
            throw error;
        }
    },

    // Buscar veículo por ID
    async getVehicleById(id: string): Promise<Vehicle | null> {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() } as Vehicle;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Erro ao buscar veículo:", error);
            throw error;
        }
    },

    // Buscar veículos em destaque (máximo 10)
    async getFeaturedVehicles(): Promise<Vehicle[]> {
        try {
            const q = query(
                collection(db, COLLECTION_NAME),
                where('destaque', '==', true),
                where('status', '==', 'disponivel'),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);

            const featured = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Vehicle));

            return featured.slice(0, 10); // Limitar a 10
        } catch (error) {
            console.error("Erro ao buscar veículos em destaque:", error);
            throw error;
        }
    },

    // Atualizar veículo
    async updateVehicle(id: string, updates: Partial<Vehicle>): Promise<void> {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            await updateDoc(docRef, updates);
        } catch (error) {
            console.error("Erro ao atualizar veículo:", error);
            throw error;
        }
    },

    // Excluir veículo
    async deleteVehicle(id: string): Promise<void> {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error("Erro ao excluir veículo:", error);
            throw error;
        }
    }
};
