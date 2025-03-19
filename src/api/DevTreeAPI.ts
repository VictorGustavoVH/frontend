///api/devtreeAPI
import { isAxiosError } from 'axios';
import api from '../config/axios';
import { User } from '../types';
import { Product } from '../types/product';

// Obtiene un usuario por su username
export async function getUserByUsername(username: string) {
    try {
        const url = `/user/${username}`;
        const { data } = await api.get<User>(url);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
        throw error;
    }
}

// Actualiza el perfil del usuario
export async function updateProfile(formData: User) {
    try {
        const { data } = await api.patch<string>('/user', formData);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
        throw error;
    }
}

// Sube una imagen para el usuario
export async function uploadImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    try {
        const { data: { image } } : { data: { image: string } } = await api.post('/user/image', formData);
        return image;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
        throw error;
    }
}

// Obtiene un usuario por su handle (redundante con getUserByUsername)
export async function getUserByHandle(username: string) {
    try {
        const url = `/user/${username}`;
        const { data } = await api.get<User>(url);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
        throw error;
    }
}

// Busca usuario por username
export async function searchByUsername(username: string) {
    try {
        const { data } = await api.post<string>('/search', { username });
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
        throw error;
    }
}

// Obtiene todos los productos
export async function getProducts() {
    try {
        const { data } = await api.get<Product[]>('/products');
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
        throw error;
    }
}

// Obtiene un producto por name
export async function getProductByName(name: string) {
    try {
        console.log(`🔍 Enviando solicitud a: /products/${encodeURIComponent(name)}`);
        
        const { data } = await api.get<Product>(`/products/${encodeURIComponent(name)}`);
        
        console.log("✅ Respuesta de la API:", data);
        return data;
    } catch (error) {
        console.error('❌ Error en getProductByName:', error);
        throw error;
    }
}
