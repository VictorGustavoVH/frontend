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

// Sube una imagen para el usuario (ejemplo genérico)
export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  try {
    const {
      data: { image },
    }: { data: { image: string } } = await api.post('/user/image', formData);
    return image;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
}

// Obtiene todos los productos
export async function getProducts(): Promise<Product[]> {
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
export async function getProductByName(name: string): Promise<Product> {
  try {
    const encodedName = encodeURIComponent(name);
    const { data } = await api.get<Product>(`/products/${encodedName}`);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
}

// Registra un producto
export async function registerProduct(productData: Partial<Product>) {
  try {
    const { data } = await api.post('/admin/product/register', productData);
    return data; // p. ej. "Producto registrado correctamente"
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
}

export async function uploadProductImage(file: File, productName: string) {
    // productName debería ser el slug (p. ej. "MiProducto")
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', productName); // <--- OJO, este "name" es el slug
  
      const { data } = await api.post('/product/image', formData);
      return data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.error);
      }
      throw error;
    }
  }
