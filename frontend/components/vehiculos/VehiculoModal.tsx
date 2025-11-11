'use client';

import { useState, useEffect } from 'react';
import type { Vehiculo, Cliente } from '@/types';
import type { VehiculoInput } from '@/lib/vehiculosService';
import clientesService from '@/lib/clientesService';

interface VehiculoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: VehiculoInput) => Promise<void>;
  vehiculo?: Vehiculo | null;
}

export default function VehiculoModal({
  isOpen,
  onClose,
  onSave,
  vehiculo
}: VehiculoModalProps) {
  const [formData, setFormData] = useState<VehiculoInput>({
    cliente_id: 0,
    marca: '',
    modelo: '',
    año: undefined,
    placa: '',
    kilometraje: undefined
  });
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [saving, setSaving] = useState(false);
  const [loadingClientes, setLoadingClientes] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Cargar lista de clientes
  useEffect(() => {
    const fetchClientes = async () => {
      setLoadingClientes(true);
      try {
        const data = await clientesService.getAll();
        setClientes(data);
      } catch (error) {
        console.error('Error loading clientes:', error);
      } finally {
        setLoadingClientes(false);
      }
    };

    if (isOpen) {
      fetchClientes();
    }
  }, [isOpen]);

  // Inicializar formulario
  useEffect(() => {
    if (vehiculo) {
      setFormData({
        cliente_id: vehiculo.cliente_id,
        marca: vehiculo.marca,
        modelo: vehiculo.modelo,
        año: vehiculo.año,
        placa: vehiculo.placa,
        kilometraje: vehiculo.kilometraje
      });
    } else {
      setFormData({
        cliente_id: 0,
        marca: '',
        modelo: '',
        año: undefined,
        placa: '',
        kilometraje: undefined
      });
    }
    setErrors({});
  }, [vehiculo, isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.cliente_id || formData.cliente_id === 0) {
      newErrors.cliente_id = 'Debe seleccionar un cliente';
    }

    if (!formData.marca.trim()) {
      newErrors.marca = 'La marca es requerida';
    }

    if (!formData.modelo.trim()) {
      newErrors.modelo = 'El modelo es requerido';
    }

    if (!formData.placa.trim()) {
      newErrors.placa = 'La placa es requerida';
    } else if (!/^[A-Z0-9-]+$/i.test(formData.placa)) {
      newErrors.placa = 'La placa solo puede contener letras, números y guiones';
    }

    if (formData.año && (formData.año < 1900 || formData.año > new Date().getFullYear() + 1)) {
      newErrors.año = 'Año inválido';
    }

    if (formData.kilometraje && formData.kilometraje < 0) {
      newErrors.kilometraje = 'El kilometraje no puede ser negativo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving vehiculo:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    let processedValue: string | number | undefined = value;

    // Convertir a número para campos numéricos
    if (name === 'cliente_id' || name === 'año' || name === 'kilometraje') {
      processedValue = value === '' ? undefined : Number(value);
    }

    setFormData((prev) => ({ ...prev, [name]: processedValue }));

    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {vehiculo ? 'Editar Vehículo' : 'Nuevo Vehículo'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cliente */}
            <div className="md:col-span-2">
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
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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

            {/* Marca */}
            <div>
              <label
                htmlFor="marca"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Marca <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="marca"
                name="marca"
                value={formData.marca}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.marca ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Toyota"
              />
              {errors.marca && (
                <p className="text-red-500 text-sm mt-1">{errors.marca}</p>
              )}
            </div>

            {/* Modelo */}
            <div>
              <label
                htmlFor="modelo"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Modelo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="modelo"
                name="modelo"
                value={formData.modelo}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.modelo ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Corolla"
              />
              {errors.modelo && (
                <p className="text-red-500 text-sm mt-1">{errors.modelo}</p>
              )}
            </div>

            {/* Placa */}
            <div>
              <label
                htmlFor="placa"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Placa <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="placa"
                name="placa"
                value={formData.placa}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase ${
                  errors.placa ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="ABC123"
              />
              {errors.placa && (
                <p className="text-red-500 text-sm mt-1">{errors.placa}</p>
              )}
            </div>

            {/* Año */}
            <div>
              <label
                htmlFor="año"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Año
              </label>
              <input
                type="number"
                id="año"
                name="año"
                value={formData.año || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.año ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="2020"
                min="1900"
                max={new Date().getFullYear() + 1}
              />
              {errors.año && (
                <p className="text-red-500 text-sm mt-1">{errors.año}</p>
              )}
            </div>

            {/* Kilometraje */}
            <div className="md:col-span-2">
              <label
                htmlFor="kilometraje"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Kilometraje (km)
              </label>
              <input
                type="number"
                id="kilometraje"
                name="kilometraje"
                value={formData.kilometraje || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.kilometraje ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="50000"
                min="0"
              />
              {errors.kilometraje && (
                <p className="text-red-500 text-sm mt-1">{errors.kilometraje}</p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
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
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={saving || loadingClientes}
            >
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
