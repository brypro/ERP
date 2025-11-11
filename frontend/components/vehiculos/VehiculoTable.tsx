'use client';

import type { Vehiculo } from '@/types';

interface VehiculoTableProps {
  vehiculos: Vehiculo[];
  onEdit: (vehiculo: Vehiculo) => void;
  onDelete: (id: number) => void;
  loading?: boolean;
}

export default function VehiculoTable({
  vehiculos,
  onEdit,
  onDelete,
  loading = false
}: VehiculoTableProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-600">Cargando vehículos...</p>
      </div>
    );
  }

  if (vehiculos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="text-6xl mb-4">🚗</div>
        <p className="text-gray-600">No hay vehículos registrados</p>
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
                Placa
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Marca/Modelo
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Año
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Kilometraje
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {vehiculos.map((vehiculo) => (
              <tr key={vehiculo.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {vehiculo.placa}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {vehiculo.marca} {vehiculo.modelo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {vehiculo.año || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {vehiculo.cliente_nombre && vehiculo.cliente_apellido
                    ? `${vehiculo.cliente_nombre} ${vehiculo.cliente_apellido}`
                    : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {vehiculo.kilometraje ? `${vehiculo.kilometraje.toLocaleString()} km` : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEdit(vehiculo)}
                    className="text-blue-600 hover:text-blue-900 mr-4 transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(vehiculo.id)}
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
