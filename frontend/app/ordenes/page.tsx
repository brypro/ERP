'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import OrdenTable from '@/components/ordenes/OrdenTable';
import OrdenModal from '@/components/ordenes/OrdenModal';
import { ordenesService } from '@/lib/ordenesService';
import type { OrdenTrabajo, EstadoOrden } from '@/types';

export default function OrdenesPage() {
  const [ordenes, setOrdenes] = useState<OrdenTrabajo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrden, setSelectedOrden] = useState<OrdenTrabajo | null>(null);
  const [editingOrden, setEditingOrden] = useState<OrdenTrabajo | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFilter, setEstadoFilter] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadOrdenes = async () => {
    setLoading(true);
    setError(null);
    const response = await ordenesService.getAll({
      search: searchTerm || undefined,
      estado: (estadoFilter || undefined) as EstadoOrden | undefined
    });

    if (response.success && response.data) {
      setOrdenes(response.data);
    } else {
      setError(response.error || 'Error al cargar órdenes');
      setOrdenes([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadOrdenes();
    }, 0);

    return () => clearTimeout(timeout);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadOrdenes();
  };

  const handleView = (orden: OrdenTrabajo) => {
    setSelectedOrden(orden);
  };

  const handleCloseView = () => {
    setSelectedOrden(null);
  };

  const handleCreate = () => {
    setEditingOrden(null);
    setShowModal(true);
  };

  const handleEdit = (orden: OrdenTrabajo) => {
    setEditingOrden(orden);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingOrden(null);
  };

  const handleSave = async (data: any) => {
    let response;

    if (editingOrden) {
      response = await ordenesService.update(editingOrden.id, data);
    } else {
      response = await ordenesService.create(data);
    }

    if (response.success) {
      setSuccessMessage(
        editingOrden ? 'Orden actualizada exitosamente' : 'Orden creada exitosamente'
      );
      handleCloseModal();
      loadOrdenes();
      setTimeout(() => setSuccessMessage(null), 3000);
    } else {
      setError(response.error || 'Error al guardar la orden');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Está seguro de que desea eliminar esta orden?')) {
      return;
    }

    const response = await ordenesService.delete(id);

    if (response.success) {
      setSuccessMessage('Orden eliminada exitosamente');
      loadOrdenes();
      setTimeout(() => setSuccessMessage(null), 3000);
    } else {
      setError(response.error || 'Error al eliminar la orden');
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setEstadoFilter('');
    loadOrdenes();
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Órdenes de Servicio</h1>
            <p className="text-gray-600 mt-1">
              Gestión de órdenes de trabajo ({ordenes.length} registradas)
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-md"
          >
            + Nueva Orden
          </button>
        </div>

        {/* Mensajes */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {successMessage}
          </div>
        )}

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow p-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por #orden, placa o cliente..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <select
              value={estadoFilter}
              onChange={(e) => setEstadoFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="en_proceso">En Proceso</option>
              <option value="completado">Completado</option>
              <option value="entregado">Entregado</option>
            </select>
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
            >
              Buscar
            </button>
            {(searchTerm || estadoFilter) && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Limpiar
              </button>
            )}
          </form>
        </div>

        {/* Tabla */}
        <OrdenTable
          ordenes={ordenes}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          loading={loading}
        />

        {/* Modal de Vista Detallada */}
        {selectedOrden && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  Orden #{selectedOrden.id}
                </h2>
                <button
                  onClick={handleCloseView}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                >
                  ×
                </button>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Cliente</p>
                    <p className="font-medium">
                      {selectedOrden.cliente_nombre} {selectedOrden.cliente_apellido}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Vehículo</p>
                    <p className="font-medium">
                      {selectedOrden.vehiculo_marca} {selectedOrden.vehiculo_modelo} - {selectedOrden.vehiculo_placa}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fecha Ingreso</p>
                    <p className="font-medium">{new Date(selectedOrden.fecha_ingreso).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Estado</p>
                    <p className="font-medium capitalize">{selectedOrden.estado.replace('_', ' ')}</p>
                  </div>
                </div>

                {selectedOrden.observaciones && (
                  <div>
                    <p className="text-sm text-gray-600">Observaciones</p>
                    <p className="font-medium">{selectedOrden.observaciones}</p>
                  </div>
                )}

                {selectedOrden.detalles && selectedOrden.detalles.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Servicios</h3>
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Servicio</th>
                          <th className="px-4 py-2 text-right text-xs font-semibold text-gray-700">Cantidad</th>
                          <th className="px-4 py-2 text-right text-xs font-semibold text-gray-700">Precio Unit.</th>
                          <th className="px-4 py-2 text-right text-xs font-semibold text-gray-700">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrden.detalles.map((detalle) => (
                          <tr key={detalle.id} className="border-t">
                            <td className="px-4 py-2">{detalle.servicio_nombre}</td>
                            <td className="px-4 py-2 text-right">{detalle.cantidad}</td>
                            <td className="px-4 py-2 text-right">${Number(detalle.precio_unitario).toFixed(2)}</td>
                            <td className="px-4 py-2 text-right font-medium">${Number(detalle.subtotal).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50 font-bold">
                        <tr>
                          <td colSpan={3} className="px-4 py-2 text-right">Total:</td>
                          <td className="px-4 py-2 text-right">${Number(selectedOrden.total).toFixed(2)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
              </div>
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                <button
                  onClick={handleCloseView}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Crear/Editar */}
        {showModal && (
          <OrdenModal
            orden={editingOrden}
            onSave={handleSave}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </AppLayout>
  );
}
