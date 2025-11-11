import { apiClient } from './api';
import type { Vehiculo } from '@/types';

export interface VehiculoInput {
  cliente_id: number;
  marca: string;
  modelo: string;
  año?: number;
  placa: string;
  kilometraje?: number;
}

export interface VehiculoResponse {
  success: boolean;
  data?: Vehiculo;
  error?: string;
  message?: string;
}

export interface VehiculosListResponse {
  success: boolean;
  data?: Vehiculo[];
  count?: number;
  error?: string;
}

class VehiculosService {
  /**
   * Obtiene todos los vehículos
   */
  async getAll(searchTerm?: string, clienteId?: number): Promise<VehiculosListResponse> {
    try {
      let endpoint = '/api/vehiculos';
      const params = new URLSearchParams();

      if (searchTerm) {
        params.append('search', searchTerm);
      }
      if (clienteId) {
        params.append('cliente_id', clienteId.toString());
      }

      if (params.toString()) {
        endpoint += `?${params.toString()}`;
      }

      return await apiClient.get<VehiculosListResponse>(endpoint);
    } catch (error) {
      console.error('Error fetching vehiculos:', error);
      return {
        success: false,
        error: 'Error al obtener los vehículos'
      };
    }
  }

  /**
   * Obtiene un vehículo por ID
   */
  async getById(id: number): Promise<VehiculoResponse> {
    try {
      return await apiClient.get<VehiculoResponse>(`/api/vehiculos/${id}`);
    } catch (error) {
      console.error(`Error fetching vehiculo ${id}:`, error);
      return {
        success: false,
        error: 'Error al obtener el vehículo'
      };
    }
  }

  /**
   * Obtiene todos los vehículos de un cliente
   */
  async getByCliente(clienteId: number): Promise<VehiculosListResponse> {
    return this.getAll(undefined, clienteId);
  }

  /**
   * Crea un nuevo vehículo
   */
  async create(data: VehiculoInput): Promise<VehiculoResponse> {
    try {
      return await apiClient.post<VehiculoResponse>('/api/vehiculos', data);
    } catch (error) {
      console.error('Error creating vehiculo:', error);
      return {
        success: false,
        error: 'Error al crear el vehículo'
      };
    }
  }

  /**
   * Actualiza un vehículo existente
   */
  async update(id: number, data: VehiculoInput): Promise<VehiculoResponse> {
    try {
      return await apiClient.put<VehiculoResponse>(`/api/vehiculos/${id}`, data);
    } catch (error) {
      console.error(`Error updating vehiculo ${id}:`, error);
      return {
        success: false,
        error: 'Error al actualizar el vehículo'
      };
    }
  }

  /**
   * Elimina un vehículo
   */
  async delete(id: number): Promise<VehiculoResponse> {
    try {
      return await apiClient.delete<VehiculoResponse>(`/api/vehiculos/${id}`);
    } catch (error) {
      console.error(`Error deleting vehiculo ${id}:`, error);
      return {
        success: false,
        error: 'Error al eliminar el vehículo'
      };
    }
  }
}

export const vehiculosService = new VehiculosService();
