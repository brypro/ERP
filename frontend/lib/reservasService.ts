import { apiClient } from './api';
import type { Reserva, ReservaEstado } from '@/types';

export interface ReservaInput {
  cliente_id: number;
  vehiculo_id: number;
  fecha_reserva: string;
  hora_reserva: string;
  servicio_solicitado?: string;
  estado?: ReservaEstado;
  observaciones?: string;
}

export interface ReservasFilters {
  search?: string;
  clienteId?: number;
  fecha?: string;
  estado?: ReservaEstado;
}

export interface ReservaResponse {
  success: boolean;
  data?: Reserva;
  message?: string;
  error?: string;
}

export interface ReservasListResponse {
  success: boolean;
  data?: Reserva[];
  count?: number;
  error?: string;
}

class ReservasService {
  async getAll(filters: ReservasFilters = {}): Promise<ReservasListResponse> {
    try {
      const params = new URLSearchParams();

      if (filters.search) {
        params.append('search', filters.search);
      }
      if (filters.clienteId) {
        params.append('cliente_id', filters.clienteId.toString());
      }
      if (filters.fecha) {
        params.append('fecha', filters.fecha);
      }
      if (filters.estado) {
        params.append('estado', filters.estado);
      }

      const endpoint = params.toString()
        ? `/api/reservas?${params.toString()}`
        : '/api/reservas';

      return await apiClient.get<ReservasListResponse>(endpoint);
    } catch (error) {
      console.error('Error fetching reservas:', error);
      return {
        success: false,
        error: 'Error al obtener las reservas'
      };
    }
  }

  async getById(id: number): Promise<ReservaResponse> {
    try {
      return await apiClient.get<ReservaResponse>(`/api/reservas/${id}`);
    } catch (error) {
      console.error(`Error fetching reserva ${id}:`, error);
      return {
        success: false,
        error: 'Error al obtener la reserva'
      };
    }
  }

  async create(data: ReservaInput): Promise<ReservaResponse> {
    try {
      return await apiClient.post<ReservaResponse>('/api/reservas', data);
    } catch (error) {
      console.error('Error creating reserva:', error);
      return {
        success: false,
        error: 'Error al crear la reserva'
      };
    }
  }

  async update(id: number, data: ReservaInput): Promise<ReservaResponse> {
    try {
      return await apiClient.put<ReservaResponse>(`/api/reservas/${id}`, data);
    } catch (error) {
      console.error(`Error updating reserva ${id}:`, error);
      return {
        success: false,
        error: 'Error al actualizar la reserva'
      };
    }
  }

  async delete(id: number): Promise<ReservaResponse> {
    try {
      return await apiClient.delete<ReservaResponse>(`/api/reservas/${id}`);
    } catch (error) {
      console.error(`Error deleting reserva ${id}:`, error);
      return {
        success: false,
        error: 'Error al eliminar la reserva'
      };
    }
  }
}

export const reservasService = new ReservasService();
