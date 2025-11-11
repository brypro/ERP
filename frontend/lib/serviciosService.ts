import { apiClient } from './api';
import type { Servicio } from '@/types';

export interface ServicioInput {
  nombre: string;
  descripcion?: string | null;
  precio: number;
}

interface ServicioResponse {
  success: boolean;
  data?: Servicio;
  error?: string;
  message?: string;
}

interface ServiciosListResponse {
  success: boolean;
  data?: Servicio[];
  count?: number;
  error?: string;
}

class ServiciosService {
  /**
   * Obtiene todos los servicios o filtra por búsqueda
   */
  async getAll(search?: string): Promise<ServiciosListResponse> {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);

      const query = params.toString() ? `?${params.toString()}` : '';
      return await apiClient.get<ServiciosListResponse>(`/api/servicios${query}`);
    } catch (error) {
      console.error('Error fetching servicios:', error);
      return {
        success: false,
        error: 'Error al cargar los servicios'
      };
    }
  }

  /**
   * Obtiene un servicio por ID
   */
  async getById(id: number): Promise<ServicioResponse> {
    try {
      return await apiClient.get<ServicioResponse>(`/api/servicios/${id}`);
    } catch (error) {
      console.error(`Error fetching servicio ${id}:`, error);
      return {
        success: false,
        error: 'Error al cargar el servicio'
      };
    }
  }

  /**
   * Crea un nuevo servicio
   */
  async create(data: ServicioInput): Promise<ServicioResponse> {
    try {
      return await apiClient.post<ServicioResponse>('/api/servicios', data);
    } catch (error) {
      console.error('Error creating servicio:', error);
      return {
        success: false,
        error: 'Error al crear el servicio'
      };
    }
  }

  /**
   * Actualiza un servicio existente
   */
  async update(id: number, data: ServicioInput): Promise<ServicioResponse> {
    try {
      return await apiClient.put<ServicioResponse>(`/api/servicios/${id}`, data);
    } catch (error) {
      console.error(`Error updating servicio ${id}:`, error);
      return {
        success: false,
        error: 'Error al actualizar el servicio'
      };
    }
  }

  /**
   * Elimina un servicio
   */
  async delete(id: number): Promise<ServicioResponse> {
    try {
      return await apiClient.delete<ServicioResponse>(`/api/servicios/${id}`);
    } catch (error) {
      console.error(`Error deleting servicio ${id}:`, error);
      return {
        success: false,
        error: 'Error al eliminar el servicio'
      };
    }
  }
}

export const serviciosService = new ServiciosService();
export default serviciosService;
