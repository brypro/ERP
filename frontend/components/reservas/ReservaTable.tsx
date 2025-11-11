'use client';

import type { Reserva } from '@/types';

interface ReservaTableProps {
  reservas: Reserva[];
  onEdit: (reserva: Reserva) => void;
  onDelete: (id: number) => void;
  loading?: boolean;
}

const estadoStyles: Record<
  Reserva['estado'],
  { bg: string; text: string; label: string }
> = {
  pendiente: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    label: 'Pendiente'
  },
  confirmada: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    label: 'Confirmada'
  },
  cancelada: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    label: 'Cancelada'
  },
  completada: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    label: 'Completada'
  }
};

export default function ReservaTable({
  reservas,
  onEdit,
  onDelete,
  loading = false
}: ReservaTableProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-600">Cargando reservas...</p>
      </div>
    );
  }

  if (reservas.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="text-6xl mb-4">📅</div>
        <p className="text-gray-600">No hay reservas registradas</p>
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
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Fecha & Hora
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Vehículo
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Servicio
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Observaciones
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reservas.map((reserva) => {
              const estadoStyle = estadoStyles[reserva.estado];

              return (
                <tr key={reserva.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    #{reserva.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="font-medium text-gray-900">{reserva.fecha_reserva}</div>
                    <div>{reserva.hora_reserva}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {reserva.cliente_nombre && reserva.cliente_apellido
                      ? `${reserva.cliente_nombre} ${reserva.cliente_apellido}`
                      : `Cliente #${reserva.cliente_id}`}
                    <div className="text-gray-500 text-xs">
                      {reserva.cliente_telefono || 'Sin teléfono'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {reserva.vehiculo_marca && reserva.vehiculo_modelo
                      ? `${reserva.vehiculo_marca} ${reserva.vehiculo_modelo}`
                      : `Vehículo #${reserva.vehiculo_id}`}
                    <div className="text-gray-500 text-xs">{reserva.vehiculo_placa || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 max-w-xs truncate">
                    {reserva.servicio_solicitado || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`${estadoStyle.bg} ${estadoStyle.text} px-3 py-1 rounded-full text-xs font-semibold`}
                    >
                      {estadoStyle.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                    {reserva.observaciones ? (
                      <span title={reserva.observaciones}>{reserva.observaciones}</span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onEdit(reserva)}
                      className="text-purple-600 hover:text-purple-900 mr-4 transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onDelete(reserva.id)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
