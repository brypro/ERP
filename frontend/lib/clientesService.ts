import { apiClient } from './api';
import type { Cliente } from '@/types';

export interface ClienteInput {
  nombre: string;
  apellido: string;
  telefono?: string;
  email?: string;
  direccion?: string;
}

export interface ClienteResponse {
  success: boolean;
  data?: Cliente;
  error?: string;
  message?: string;
}

export interface ClientesListResponse {
  success: boolean;
  data?: Cliente[];
  count?: number;
  error?: string;
}

class ClientesService {
  /**
   * Obtiene todos los clientes
   */
  async getAll(searchTerm?: string): Promise<ClientesListResponse> {
    try {
      const endpoint = searchTerm
        ? `/api/clientes?search=${encodeURIComponent(searchTerm)}`
        : '/api/clientes';

      return await apiClient.get<ClientesListResponse>(endpoint);
    } catch (error) {
      console.error('Error fetching clientes:', error);
      return {
        success: false,
        error: 'Error al obtener los clientes'
      };
    }
  }

  /**
   * Obtiene un cliente por ID
   */
  async getById(id: number): Promise<ClienteResponse> {
    try {
      return await apiClient.get<ClienteResponse>(`/api/clientes/${id}`);
    } catch (error) {
      console.error(`Error fetching cliente ${id}:`, error);
      return {
        success: false,
        error: 'Error al obtener el cliente'
      };
    }
  }

  /**
   * Crea un nuevo cliente
   */
  async create(data: ClienteInput): Promise<ClienteResponse> {
    try {
      return await apiClient.post<ClienteResponse>('/api/clientes', data);
    } catch (error) {
      console.error('Error creating cliente:', error);
      return {
        success: false,
        error: 'Error al crear el cliente'
      };
    }
  }

  /**
   * Actualiza un cliente existente
   */
  async update(id: number, data: ClienteInput): Promise<ClienteResponse> {
    try {
      return await apiClient.put<ClienteResponse>(`/api/clientes/${id}`, data);
    } catch (error) {
      console.error(`Error updating cliente ${id}:`, error);
      return {
        success: false,
        error: 'Error al actualizar el cliente'
      };
    }
  }

  /**
   * Elimina un cliente
   */
  async delete(id: number): Promise<ClienteResponse> {
    try {
      return await apiClient.delete<ClienteResponse>(`/api/clientes/${id}`);
    } catch (error) {
      console.error(`Error deleting cliente ${id}:`, error);
      return {
        success: false,
        error: 'Error al eliminar el cliente'
      };
    }
  }
}

export const clientesService = new ClientesService();
