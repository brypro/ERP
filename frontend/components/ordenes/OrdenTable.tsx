'use client';

import type { OrdenTrabajo } from '@/types';

interface OrdenTableProps {
  ordenes: OrdenTrabajo[];
  onEdit: (orden: OrdenTrabajo) => void;
  onDelete: (id: number) => void;
  onView: (orden: OrdenTrabajo) => void;
  loading?: boolean;
}

const estadoColors: Record<string, string> = {
  pendiente: 'bg-yellow-100 text-yellow-800',
  en_proceso: 'bg-blue-100 text-blue-800',
  completado: 'bg-green-100 text-green-800',
  entregado: 'bg-gray-100 text-gray-800'
};

const estadoLabels: Record<string, string> = {
  pendiente: 'Pendiente',
  en_proceso: 'En Proceso',
  completado: 'Completado',
  entregado: 'Entregado'
};

export default function OrdenTable({
  ordenes,
  onEdit,
  onDelete,
  onView,
  loading = false
}: OrdenTableProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-600">Cargando órdenes...</p>
      </div>
    );
  }

  if (ordenes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="text-6xl mb-4">🔧</div>
        <p className="text-gray-600">No hay órdenes de trabajo</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                #Orden
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Cliente / Vehículo
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Ingreso
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {ordenes.map((orden) => (
              <tr key={orden.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    #{orden.id}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {orden.cliente_nombre && orden.cliente_apellido
                      ? `${orden.cliente_nombre} ${orden.cliente_apellido}`
                      : '-'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {orden.vehiculo_marca} {orden.vehiculo_modelo} - {orden.vehiculo_placa}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {new Date(orden.fecha_ingreso).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${estadoColors[orden.estado]}`}>
                    {estadoLabels[orden.estado]}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                  ${Number(orden.total).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onView(orden)}
                    className="text-green-600 hover:text-green-900 mr-3 transition-colors"
                  >
                    Ver
                  </button>
                  <button
                    onClick={() => onEdit(orden)}
                    className="text-blue-600 hover:text-blue-900 mr-3 transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(orden.id)}
                    className="text-red-600 hover:text-red-900 transition-colors"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
