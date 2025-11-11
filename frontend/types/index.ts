// Tipos base para el sistema ERP

export interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

export interface Vehiculo {
  id: number;
  cliente_id: number;
  marca: string;
  modelo: string;
  año?: number;
  placa: string;
  kilometraje?: number;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
  cliente_nombre?: string;
  cliente_apellido?: string;
}

export type ReservaEstado = 'pendiente' | 'confirmada' | 'cancelada' | 'completada';

export interface Reserva {
  id: number;
  cliente_id: number;
  vehiculo_id: number;
  fecha_reserva: string;
  hora_reserva: string;
  servicio_solicitado?: string | null;
  estado: ReservaEstado;
  observaciones?: string | null;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
  cliente_nombre?: string;
  cliente_apellido?: string;
  cliente_telefono?: string;
  vehiculo_marca?: string;
  vehiculo_modelo?: string;
  vehiculo_placa?: string;
}

export interface Servicio {
  id: number;
  nombre: string;
  descripcion?: string | null;
  precio: number;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

export type EstadoOrden = 'pendiente' | 'en_proceso' | 'completado' | 'entregado';

export interface OrdenDetalle {
  id: number;
  orden_id: number;
  servicio_id: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  fecha_creacion?: string;
  servicio_nombre?: string;
  servicio_descripcion?: string;
}

export interface OrdenTrabajo {
  id: number;
  vehiculo_id: number;
  fecha_ingreso: string;
  fecha_entrega_estimada?: string | null;
  fecha_entrega_real?: string | null;
  estado: EstadoOrden;
  observaciones?: string | null;
  total: number;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
  vehiculo_marca?: string;
  vehiculo_modelo?: string;
  vehiculo_placa?: string;
  cliente_id?: number;
  cliente_nombre?: string;
  cliente_apellido?: string;
  cliente_telefono?: string;
  detalles?: OrdenDetalle[];
}

export interface OrdenServicio {
  id_orden: number;
  fecha_inicio: string; // ISO date string
  fecha_cierre?: string;
  estado: 'abierta' | 'en_progreso' | 'completada' | 'facturada';
  diagnostico: string;
  id_vehiculo: number;
  vehiculo?: Vehiculo;
  detalles?: DetalleOrdenServicio[];
}

export interface Repuesto {
  id_repuesto: number;
  nombre: string;
  precio_unitario: number;
  sku: string;
}

export interface Inventario {
  id_inventario: number;
  cantidad: number;
  stock_critico: number;
  id_repuesto: number;
  repuesto?: Repuesto;
}

export interface Proveedor {
  id_proveedor: number;
  nombre: string;
  contacto: string;
}

export interface Compra {
  id_compra: number;
  fecha: string;
  estado: 'pendiente' | 'recibida' | 'cancelada';
  id_proveedor: number;
  proveedor?: Proveedor;
  detalles?: DetalleCompra[];
}

export interface DetalleCompra {
  id_dc: number;
  cantidad: number;
  precio_unitario: number;
  id_compra: number;
  id_repuesto: number;
  repuesto?: Repuesto;
}

export interface Recepcion {
  id_recepcion: number;
  fecha: string;
  observaciones: string;
  id_compra: number;
  compra?: Compra;
}

export interface Boleta {
  id_boleta: number;
  fecha: string;
  total: number;
  pdf_path?: string;
  id_orden: number;
  orden?: OrdenServicio;
}

export interface DetalleOrdenServicio {
  id_dos: number;
  cantidad: number;
  precio_unitario: number;
  id_orden: number;
  id_repuesto: number;
  repuesto?: Repuesto;
}

// Tipos de respuesta de la API
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Tipos para estadísticas del dashboard
export interface DashboardStats {
  total_clientes: number;
  total_vehiculos: number;
  ordenes_activas: number;
  reservas_hoy: number;
  ingresos_mes: number;
}

// Tipos para inventario
export interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  descripcion?: string | null;
  categoria?: string | null;
  stock_actual: number;
  stock_minimo: number;
  precio_compra: number;
  precio_venta: number;
  ubicacion?: string | null;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}
