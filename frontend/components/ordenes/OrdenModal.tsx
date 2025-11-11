'use client';

import { useState, useEffect } from 'react';
import type { OrdenTrabajo, Vehiculo, Servicio, OrdenDetalleInput } from '@/types';
import { vehiculosService } from '@/lib/vehiculosService';
import { serviciosService } from '@/lib/serviciosService';

interface OrdenModalProps {
  orden: OrdenTrabajo | null;
  onSave: (data: any) => void;
  onClose: () => void;
}

export default function OrdenModal({ orden, onSave, onClose }: OrdenModalProps) {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    vehiculo_id: orden?.vehiculo_id || 0,
    fecha_ingreso: orden?.fecha_ingreso?.split('T')[0] || new Date().toISOString().split('T')[0],
    fecha_entrega_estimada: orden?.fecha_entrega_estimada?.split('T')[0] || '',
    estado: orden?.estado || 'pendiente',
    observaciones: orden?.observaciones || ''
  });

  const [detalles, setDetalles] = useState<OrdenDetalleInput[]>(
    orden?.detalles?.map(d => ({
      servicio_id: d.servicio_id,
      cantidad: d.cantidad,
      precio_unitario: Number(d.precio_unitario),
      subtotal: Number(d.subtotal)
    })) || []
  );

  const [selectedServicio, setSelectedServicio] = useState(0);
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [vehiculosRes, serviciosRes] = await Promise.all([
      vehiculosService.getAll(),
      serviciosService.getAll()
    ]);

    if (vehiculosRes.success && vehiculosRes.data) {
      setVehiculos(vehiculosRes.data);
    }
    if (serviciosRes.success && serviciosRes.data) {
      setServicios(serviciosRes.data);
    }
    setLoading(false);
  };

  const handleAddServicio = () => {
    if (selectedServicio === 0) {
      alert('Seleccione un servicio');
      return;
    }

    const servicio = servicios.find(s => s.id === selectedServicio);
    if (!servicio) return;

    const precio_unitario = Number(servicio.precio);
    const subtotal = precio_unitario * cantidad;

    setDetalles([...detalles, {
      servicio_id: selectedServicio,
      cantidad,
      precio_unitario,
      subtotal
    }]);

    setSelectedServicio(0);
    setCantidad(1);
  };

  const handleRemoveDetalle = (index: number) => {
    setDetalles(detalles.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return detalles.reduce((sum, d) => sum + d.subtotal, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.vehiculo_id === 0) {
      alert('Seleccione un vehículo');
      return;
    }

    if (detalles.length === 0) {
      alert('Agregue al menos un servicio');
      return;
    }

    const total = calculateTotal();

    onSave({
      ...formData,
      detalles,
      total
    });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  const getServicioNombre = (servicioId: number) => {
    return servicios.find(s => s.id === servicioId)?.nombre || '-';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {orden ? `Editar Orden #${orden.id}` : 'Nueva Orden de Servicio'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6">
          {/* Vehículo y Fechas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehículo *
              </label>
              <select
                value={formData.vehiculo_id}
                onChange={(e) => setFormData({ ...formData, vehiculo_id: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value={0}>Seleccione un vehículo</option>
                {vehiculos.map((vehiculo) => (
                  <option key={vehiculo.id} value={vehiculo.id}>
                    {vehiculo.placa} - {vehiculo.marca} {vehiculo.modelo} ({vehiculo.cliente_nombre} {vehiculo.cliente_apellido})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado *
              </label>
              <select
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="pendiente">Pendiente</option>
                <option value="en_proceso">En Proceso</option>
                <option value="completado">Completado</option>
                <option value="entregado">Entregado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Ingreso *
              </label>
              <input
                type="date"
                value={formData.fecha_ingreso}
                onChange={(e) => setFormData({ ...formData, fecha_ingreso: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Entrega Estimada
              </label>
              <input
                type="date"
                value={formData.fecha_entrega_estimada}
                onChange={(e) => setFormData({ ...formData, fecha_entrega_estimada: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Observaciones */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observaciones
            </label>
            <textarea
              value={formData.observaciones}
              onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Detalles adicionales del trabajo..."
            />
          </div>

          {/* Agregar Servicios */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-3">Servicios</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
              <div className="md:col-span-2">
                <select
                  value={selectedServicio}
                  onChange={(e) => setSelectedServicio(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value={0}>Seleccione un servicio</option>
                  {servicios.map((servicio) => (
                    <option key={servicio.id} value={servicio.id}>
                      {servicio.nombre} - ${Number(servicio.precio).toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  value={cantidad}
                  onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Cant."
                />
                <button
                  type="button"
                  onClick={handleAddServicio}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  Agregar
                </button>
              </div>
            </div>

            {/* Tabla de Servicios Agregados */}
            {detalles.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Servicio</th>
                      <th className="px-4 py-2 text-right text-xs font-semibold text-gray-700">Cantidad</th>
                      <th className="px-4 py-2 text-right text-xs font-semibold text-gray-700">Precio Unit.</th>
                      <th className="px-4 py-2 text-right text-xs font-semibold text-gray-700">Subtotal</th>
                      <th className="px-4 py-2 text-right text-xs font-semibold text-gray-700">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detalles.map((detalle, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-2">{getServicioNombre(detalle.servicio_id)}</td>
                        <td className="px-4 py-2 text-right">{detalle.cantidad}</td>
                        <td className="px-4 py-2 text-right">${detalle.precio_unitario.toFixed(2)}</td>
                        <td className="px-4 py-2 text-right font-medium">${detalle.subtotal.toFixed(2)}</td>
                        <td className="px-4 py-2 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveDetalle(index)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 font-bold">
                    <tr>
                      <td colSpan={3} className="px-4 py-2 text-right">Total:</td>
                      <td className="px-4 py-2 text-right">${calculateTotal().toFixed(2)}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500 border border-gray-200 rounded-lg">
                No hay servicios agregados
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
            >
              {orden ? 'Actualizar' : 'Crear'} Orden
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
