'use client';

import { useState, useEffect } from 'react';
import type { Producto } from '@/types';
import type { ProductoInput } from '@/lib/inventarioService';

interface ProductoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProductoInput) => Promise<void>;
  producto?: Producto | null;
  loading?: boolean;
}

export default function ProductoModal({
  isOpen,
  onClose,
  onSave,
  producto = null,
  loading = false
}: ProductoModalProps) {
  const [formData, setFormData] = useState<ProductoInput>({
    codigo: '',
    nombre: '',
    descripcion: '',
    categoria: '',
    stock_actual: 0,
    stock_minimo: 0,
    precio_compra: 0,
    precio_venta: 0,
    ubicacion: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (producto) {
      setFormData({
        codigo: producto.codigo,
        nombre: producto.nombre,
        descripcion: producto.descripcion || '',
        categoria: producto.categoria || '',
        stock_actual: producto.stock_actual,
        stock_minimo: producto.stock_minimo,
        precio_compra: producto.precio_compra,
        precio_venta: producto.precio_venta,
        ubicacion: producto.ubicacion || ''
      });
    } else {
      setFormData({
        codigo: '',
        nombre: '',
        descripcion: '',
        categoria: '',
        stock_actual: 0,
        stock_minimo: 0,
        precio_compra: 0,
        precio_venta: 0,
        ubicacion: ''
      });
    }
    setErrors({});
  }, [producto, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.codigo.trim()) {
      newErrors.codigo = 'El código es requerido';
    }

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (formData.precio_compra < 0) {
      newErrors.precio_compra = 'El precio de compra no puede ser negativo';
    }

    if (formData.precio_venta < 0) {
      newErrors.precio_venta = 'El precio de venta no puede ser negativo';
    }

    if (formData.stock_actual < 0) {
      newErrors.stock_actual = 'El stock actual no puede ser negativo';
    }

    if (formData.stock_minimo < 0) {
      newErrors.stock_minimo = 'El stock mínimo no puede ser negativo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Convertir strings vacíos a null para campos opcionales
    const dataToSend: ProductoInput = {
      ...formData,
      descripcion: formData.descripcion?.trim() || null,
      categoria: formData.categoria?.trim() || null,
      ubicacion: formData.ubicacion?.trim() || null
    };

    await onSave(dataToSend);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));

    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {producto ? 'Editar Producto' : 'Nuevo Producto'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={loading}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Código */}
              <div>
                <label htmlFor="codigo" className="block text-sm font-medium text-gray-700 mb-1">
                  Código / SKU *
                </label>
                <input
                  type="text"
                  id="codigo"
                  name="codigo"
                  value={formData.codigo}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.codigo ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="PROD-001"
                />
                {errors.codigo && (
                  <p className="text-red-500 text-sm mt-1">{errors.codigo}</p>
                )}
              </div>

              {/* Nombre */}
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.nombre ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nombre del producto"
                />
                {errors.nombre && (
                  <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>
                )}
              </div>

              {/* Categoría */}
              <div>
                <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría
                </label>
                <input
                  type="text"
                  id="categoria"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Lubricantes, Filtros, etc."
                />
              </div>

              {/* Ubicación */}
              <div>
                <label htmlFor="ubicacion" className="block text-sm font-medium text-gray-700 mb-1">
                  Ubicación
                </label>
                <input
                  type="text"
                  id="ubicacion"
                  name="ubicacion"
                  value={formData.ubicacion}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Estante A1, Bodega B, etc."
                />
              </div>

              {/* Stock Actual */}
              <div>
                <label htmlFor="stock_actual" className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Actual
                </label>
                <input
                  type="number"
                  id="stock_actual"
                  name="stock_actual"
                  value={formData.stock_actual}
                  onChange={handleChange}
                  disabled={loading}
                  min="0"
                  step="1"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.stock_actual ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.stock_actual && (
                  <p className="text-red-500 text-sm mt-1">{errors.stock_actual}</p>
                )}
              </div>

              {/* Stock Mínimo */}
              <div>
                <label htmlFor="stock_minimo" className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Mínimo
                </label>
                <input
                  type="number"
                  id="stock_minimo"
                  name="stock_minimo"
                  value={formData.stock_minimo}
                  onChange={handleChange}
                  disabled={loading}
                  min="0"
                  step="1"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.stock_minimo ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.stock_minimo && (
                  <p className="text-red-500 text-sm mt-1">{errors.stock_minimo}</p>
                )}
              </div>

              {/* Precio Compra */}
              <div>
                <label htmlFor="precio_compra" className="block text-sm font-medium text-gray-700 mb-1">
                  Precio Compra *
                </label>
                <input
                  type="number"
                  id="precio_compra"
                  name="precio_compra"
                  value={formData.precio_compra}
                  onChange={handleChange}
                  disabled={loading}
                  min="0"
                  step="0.01"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.precio_compra ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
                {errors.precio_compra && (
                  <p className="text-red-500 text-sm mt-1">{errors.precio_compra}</p>
                )}
              </div>

              {/* Precio Venta */}
              <div>
                <label htmlFor="precio_venta" className="block text-sm font-medium text-gray-700 mb-1">
                  Precio Venta *
                </label>
                <input
                  type="number"
                  id="precio_venta"
                  name="precio_venta"
                  value={formData.precio_venta}
                  onChange={handleChange}
                  disabled={loading}
                  min="0"
                  step="0.01"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.precio_venta ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
                {errors.precio_venta && (
                  <p className="text-red-500 text-sm mt-1">{errors.precio_venta}</p>
                )}
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                disabled={loading}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Descripción detallada del producto..."
              />
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Guardando...
                  </>
                ) : (
                  producto ? 'Actualizar' : 'Crear Producto'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
