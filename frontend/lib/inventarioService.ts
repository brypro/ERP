import { apiClient } from './api';
import type { Producto } from '@/types';

export interface ProductoInput {
  codigo: string;
  nombre: string;
  descripcion?: string | null;
  categoria?: string | null;
  stock_actual?: number;
  stock_minimo?: number;
  precio_compra: number;
  precio_venta: number;
  ubicacion?: string | null;
}

interface ProductoResponse {
  success: boolean;
  data?: Producto;
  error?: string;
  message?: string;
}

interface ProductosListResponse {
  success: boolean;
  data?: Producto[];
  count?: number;
  error?: string;
}

interface StockAdjustInput {
  cantidad: number;
  tipo: 'entrada' | 'salida' | 'ajuste';
}

class InventarioService {
  /**
   * Obtiene todos los productos o filtra por búsqueda/categoría/stock bajo
   */
  async getAll(filters?: { search?: string; categoria?: string; low_stock?: boolean }): Promise<ProductosListResponse> {
    try {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.categoria) params.append('categoria', filters.categoria);
      if (filters?.low_stock) params.append('low_stock', 'true');

      const query = params.toString() ? `?${params.toString()}` : '';
      return await apiClient.get<ProductosListResponse>(`/api/inventario${query}`);
    } catch (error) {
      console.error('Error fetching inventario:', error);
      return {
        success: false,
        error: 'Error al cargar el inventario'
      };
    }
  }

  /**
   * Obtiene un producto por ID
   */
  async getById(id: number): Promise<ProductoResponse> {
    try {
      return await apiClient.get<ProductoResponse>(`/api/inventario/${id}`);
    } catch (error) {
      console.error(`Error fetching producto ${id}:`, error);
      return {
        success: false,
        error: 'Error al cargar el producto'
      };
    }
  }

  /**
   * Crea un nuevo producto
   */
  async create(data: ProductoInput): Promise<ProductoResponse> {
    try {
      return await apiClient.post<ProductoResponse>('/api/inventario', data);
    } catch (error) {
      console.error('Error creating producto:', error);
      return {
        success: false,
        error: 'Error al crear el producto'
      };
    }
  }

  /**
   * Actualiza un producto existente
   */
  async update(id: number, data: Partial<ProductoInput>): Promise<ProductoResponse> {
    try {
      return await apiClient.put<ProductoResponse>(`/api/inventario/${id}`, data);
    } catch (error) {
      console.error(`Error updating producto ${id}:`, error);
      return {
        success: false,
        error: 'Error al actualizar el producto'
      };
    }
  }

  /**
   * Ajusta el stock de un producto
   */
  async adjustStock(id: number, data: StockAdjustInput): Promise<ProductoResponse> {
    try {
      return await apiClient.post<ProductoResponse>(`/api/inventario/${id}/stock`, data);
    } catch (error) {
      console.error(`Error adjusting stock for producto ${id}:`, error);
      return {
        success: false,
        error: 'Error al ajustar el stock'
      };
    }
  }

  /**
   * Elimina un producto
   */
  async delete(id: number): Promise<ProductoResponse> {
    try {
      return await apiClient.delete<ProductoResponse>(`/api/inventario/${id}`);
    } catch (error) {
      console.error(`Error deleting producto ${id}:`, error);
      return {
        success: false,
        error: 'Error al eliminar el producto'
      };
    }
  }
}

export const inventarioService = new InventarioService();
export default inventarioService;
