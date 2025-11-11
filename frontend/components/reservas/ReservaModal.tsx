'use client';

import { useEffect, useState } from 'react';
import type { Cliente, Reserva, ReservaEstado, Vehiculo } from '@/types';
import type { ReservaInput } from '@/lib/reservasService';
import { clientesService } from '@/lib/clientesService';
import { vehiculosService } from '@/lib/vehiculosService';

interface ReservaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ReservaInput) => Promise<void>;
  reserva?: Reserva | null;
}

const ESTADO_OPTIONS: { value: ReservaEstado; label: string }[] = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'confirmada', label: 'Confirmada' },
  { value: 'cancelada', label: 'Cancelada' },
  { value: 'completada', label: 'Completada' }
];

const DEFAULT_FORM: ReservaInput & { estado: ReservaEstado } = {
  cliente_id: 0,
  vehiculo_id: 0,
  fecha_reserva: '',
  hora_reserva: '',
  servicio_solicitado: '',
  estado: 'pendiente',
  observaciones: ''
};

export default function ReservaModal({
  isOpen,
  onClose,
  onSave,
  reserva
}: ReservaModalProps) {
  const [formData, setFormData] = useState(() => ({ ...DEFAULT_FORM }));
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loadingClientes, setLoadingClientes] = useState(false);
  const [loadingVehiculos, setLoadingVehiculos] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Cargar clientes cuando se abre el modal
  useEffect(() => {
    const fetchClientes = async () => {
      setLoadingClientes(true);
      try {
        const response = await clientesService.getAll();
        if (response.success && response.data) {
          setClientes(response.data);
        } else {
          setClientes([]);
        }
      } catch (error) {
        console.error('Error loading clientes:', error);
        setClientes([]);
      } finally {
        setLoadingClientes(false);
      }
    };

    if (isOpen) {
      fetchClientes();
    }
  }, [isOpen]);

  // Preparar formulario cuando cambia la reserva
  useEffect(() => {
    if (reserva) {
      setFormData({
        cliente_id: reserva.cliente_id,
        vehiculo_id: reserva.vehiculo_id,
        fecha_reserva: reserva.fecha_reserva,
        hora_reserva: reserva.hora_reserva,
        servicio_solicitado: reserva.servicio_solicitado || '',
        estado: reserva.estado,
        observaciones: reserva.observaciones || ''
      });
    } else {
      setFormData({ ...DEFAULT_FORM });
    }
    setErrors({});
  }, [reserva, isOpen]);

  // Cargar vehículos cuando cambia el cliente seleccionado
  useEffect(() => {
    const clienteId = formData.cliente_id;
    if (!isOpen || !clienteId) {
      setVehiculos([]);
      return;
    }

    const fetchVehiculos = async () => {
      setLoadingVehiculos(true);
      try {
        const response = await vehiculosService.getByCliente(clienteId);
        if (response.success && response.data) {
          setVehiculos(response.data);
        } else {
          setVehiculos([]);
        }
      } catch (error) {
        console.error('Error loading vehiculos:', error);
        setVehiculos([]);
      } finally {
        setLoadingVehiculos(false);
      }
    };

    fetchVehiculos();
  }, [formData.cliente_id, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.cliente_id) {
      newErrors.cliente_id = 'Debe seleccionar un cliente';
    }

    if (!formData.vehiculo_id) {
      newErrors.vehiculo_id = 'Debe seleccionar un vehículo';
    }

    if (!formData.fecha_reserva) {
      newErrors.fecha_reserva = 'La fecha es requerida';
    }

    if (!formData.hora_reserva) {
      newErrors.hora_reserva = 'La hora es requerida';
    } else if (!/^\d{2}:\d{2}$/.test(formData.hora_reserva)) {
      newErrors.hora_reserva = 'Hora inválida (formato HH:MM)';
    }

    if (!formData.servicio_solicitado?.trim()) {
      newErrors.servicio_solicitado = 'Debe describir el servicio solicitado';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setSaving(true);
    try {
      await onSave({
        ...formData,
        servicio_solicitado: formData.servicio_solicitado?.trim(),
        observaciones: formData.observaciones?.trim()
          ? formData.observaciones.trim()
          : undefined
      });
      onClose();
    } catch (error) {
      console.error('Error saving reserva:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    let processedValue: string | number | undefined = value;
    if (name === 'cliente_id' || name === 'vehiculo_id') {
      processedValue = value ? Number(value) : 0;
    }

    setFormData((prev) => {
      const nextState = {
        ...prev,
        [name]: processedValue
      };

      if (name === 'cliente_id') {
        nextState.vehiculo_id = 0;
      }

      return nextState;
    });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  if (!isOpen) {
    return null;
  }

  const vehiculosDisponibles = formData.cliente_id ? vehiculos : [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {reserva ? 'Editar Reserva' : 'Nueva Reserva'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cliente */}
            <div>
              <label
                htmlFor="cliente_id"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Cliente <span className="text-red-500">*</span>
              </label>
              <select
                id="cliente_id"
                name="cliente_id"
                value={formData.cliente_id || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.cliente_id ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={loadingClientes}
              >
                <option value="">
                  {loadingClientes ? 'Cargando clientes...' : 'Seleccione un cliente'}
                </option>
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nombre} {cliente.apellido}
                  </option>
                ))}
              </select>
              {errors.cliente_id && (
                <p className="text-red-500 text-sm mt-1">{errors.cliente_id}</p>
              )}
            </div>

            {/* Vehículo */}
            <div>
              <label
                htmlFor="vehiculo_id"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Vehículo <span className="text-red-500">*</span>
              </label>
              <select
                id="vehiculo_id"
                name="vehiculo_id"
                value={formData.vehiculo_id || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.vehiculo_id ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={!formData.cliente_id || loadingVehiculos}
              >
                <option value="">
                  {!formData.cliente_id
                    ? 'Seleccione un cliente primero'
                    : loadingVehiculos
                      ? 'Cargando vehículos...'
                      : vehiculosDisponibles.length === 0
                        ? 'Sin vehículos disponibles'
                        : 'Seleccione un vehículo'}
                </option>
                {vehiculosDisponibles.map((vehiculo) => (
                  <option key={vehiculo.id} value={vehiculo.id}>
                    {vehiculo.marca} {vehiculo.modelo} - {vehiculo.placa}
                  </option>
                ))}
              </select>
              {errors.vehiculo_id && (
                <p className="text-red-500 text-sm mt-1">{errors.vehiculo_id}</p>
              )}
            </div>

            {/* Fecha */}
            <div>
              <label
                htmlFor="fecha_reserva"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Fecha <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="fecha_reserva"
                name="fecha_reserva"
                value={formData.fecha_reserva}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.fecha_reserva ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.fecha_reserva && (
                <p className="text-red-500 text-sm mt-1">{errors.fecha_reserva}</p>
              )}
            </div>

            {/* Hora */}
            <div>
              <label
                htmlFor="hora_reserva"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Hora <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                id="hora_reserva"
                name="hora_reserva"
                value={formData.hora_reserva}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.hora_reserva ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.hora_reserva && (
                <p className="text-red-500 text-sm mt-1">{errors.hora_reserva}</p>
              )}
            </div>

            {/* Servicio */}
            <div className="md:col-span-2">
              <label
                htmlFor="servicio_solicitado"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Servicio solicitado <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="servicio_solicitado"
                name="servicio_solicitado"
                value={formData.servicio_solicitado || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.servicio_solicitado ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ej: Mantención completa, cambio de frenos..."
              />
              {errors.servicio_solicitado && (
                <p className="text-red-500 text-sm mt-1">{errors.servicio_solicitado}</p>
              )}
            </div>

            {/* Estado */}
            <div>
              <label
                htmlFor="estado"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Estado
              </label>
              <select
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {ESTADO_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Observaciones */}
          <div>
            <label
              htmlFor="observaciones"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Observaciones
            </label>
            <textarea
              id="observaciones"
              name="observaciones"
              value={formData.observaciones || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={4}
              placeholder="Comentarios adicionales sobre la reserva..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={saving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={saving}
            >
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
