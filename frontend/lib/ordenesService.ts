import { apiClient } from './api';
import type { OrdenTrabajo, OrdenDetalle, EstadoOrden } from '@/types';

export interface OrdenDetalleInput {
  servicio_id: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface OrdenTrabajoInput {
  vehiculo_id: number;
  fecha_ingreso: string;
  fecha_entrega_estimada?: string | null;
  fecha_entrega_real?: string | null;
  estado?: EstadoOrden;
  observaciones?: string | null;
  total?: number;
  detalles?: OrdenDetalleInput[];
}

export interface OrdenesFilters {
  search?: string;
  estado?: EstadoOrden;
  vehiculo_id?: number;
}

interface OrdenResponse {
  success: boolean;
  data?: OrdenTrabajo;
  error?: string;
  message?: string;
}

interface OrdenesListResponse {
  success: boolean;
  data?: OrdenTrabajo[];
  count?: number;
  error?: string;
}

class OrdenesService {
  /**
   * Obtiene todas las órdenes o filtra por parámetros
   */
  async getAll(filters?: OrdenesFilters): Promise<OrdenesListResponse> {
    try {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.estado) params.append('estado', filters.estado);
      if (filters?.vehiculo_id) params.append('vehiculo_id', filters.vehiculo_id.toString());

      const query = params.toString() ? `?${params.toString()}` : '';
      return await apiClient.get<OrdenesListResponse>(`/api/ordenes${query}`);
    } catch (error) {
      console.error('Error fetching ordenes:', error);
      return {
        success: false,
        error: 'Error al cargar las órdenes'
      };
    }
  }

  /**
   * Obtiene una orden por ID con sus detalles
   */
  async getById(id: number): Promise<OrdenResponse> {
    try {
      return await apiClient.get<OrdenResponse>(`/api/ordenes/${id}`);
    } catch (error) {
      console.error(`Error fetching orden ${id}:`, error);
      return {
        success: false,
        error: 'Error al cargar la orden'
      };
    }
  }

  /**
   * Crea una nueva orden con sus servicios
   */
  async create(data: OrdenTrabajoInput): Promise<OrdenResponse> {
    try {
      return await apiClient.post<OrdenResponse>('/api/ordenes', data);
    } catch (error) {
      console.error('Error creating orden:', error);
      return {
        success: false,
        error: 'Error al crear la orden'
      };
    }
  }

  /**
   * Actualiza una orden existente
   */
  async update(id: number, data: OrdenTrabajoInput): Promise<OrdenResponse> {
    try {
      return await apiClient.put<OrdenResponse>(`/api/ordenes/${id}`, data);
    } catch (error) {
      console.error(`Error updating orden ${id}:`, error);
      return {
        success: false,
        error: 'Error al actualizar la orden'
      };
    }
  }

  /**
   * Agrega un servicio a una orden existente
   */
  async addDetalle(ordenId: number, detalle: OrdenDetalleInput): Promise<OrdenResponse> {
    try {
      return await apiClient.post<OrdenResponse>(`/api/ordenes/${ordenId}/detalles`, detalle);
    } catch (error) {
      console.error(`Error adding detalle to orden ${ordenId}:`, error);
      return {
        success: false,
        error: 'Error al agregar servicio a la orden'
      };
    }
  }

  /**
   * Elimina un servicio de una orden
   */
  async deleteDetalle(detalleId: number): Promise<OrdenResponse> {
    try {
      return await apiClient.delete<OrdenResponse>(`/api/ordenes/detalles/${detalleId}`);
    } catch (error) {
      console.error(`Error deleting detalle ${detalleId}:`, error);
      return {
        success: false,
        error: 'Error al eliminar servicio'
      };
    }
  }

  /**
   * Elimina una orden
   */
  async delete(id: number): Promise<OrdenResponse> {
    try {
      return await apiClient.delete<OrdenResponse>(`/api/ordenes/${id}`);
    } catch (error) {
      console.error(`Error deleting orden ${id}:`, error);
      return {
        success: false,
        error: 'Error al eliminar la orden'
      };
    }
  }
}

export const ordenesService = new OrdenesService();
export default ordenesService;
