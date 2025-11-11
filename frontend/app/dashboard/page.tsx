'use client';

import AppLayout from '@/components/AppLayout';

interface StatCard {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  trend?: string;
}

const mockStats: StatCard[] = [
  {
    title: 'Clientes Totales',
    value: 45,
    icon: '👥',
    color: 'bg-blue-500',
    trend: '+5 este mes',
  },
  {
    title: 'Vehículos Registrados',
    value: 67,
    icon: '🚗',
    color: 'bg-green-500',
    trend: '+8 este mes',
  },
  {
    title: 'Órdenes Activas',
    value: 12,
    icon: '🔧',
    color: 'bg-orange-500',
  },
  {
    title: 'Reservas Hoy',
    value: 5,
    icon: '📅',
    color: 'bg-purple-500',
  },
];

const mockRecentOrders = [
  { id: 1, vehiculo: 'Toyota Corolla - AB1234', cliente: 'Juan Pérez', estado: 'En Progreso' },
  { id: 2, vehiculo: 'Honda Civic - CD5678', cliente: 'María González', estado: 'Pendiente' },
  { id: 3, vehiculo: 'Ford Focus - EF9012', cliente: 'Carlos Rodríguez', estado: 'Completada' },
];

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Resumen general del sistema</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockStats.map((stat) => (
            <div
              key={stat.title}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  {stat.trend && (
                    <p className="text-sm text-green-600 mt-1">{stat.trend}</p>
                  )}
                </div>
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Órdenes Recientes</h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-200">
                    <th className="pb-3 text-sm font-semibold text-gray-700">ID</th>
                    <th className="pb-3 text-sm font-semibold text-gray-700">Vehículo</th>
                    <th className="pb-3 text-sm font-semibold text-gray-700">Cliente</th>
                    <th className="pb-3 text-sm font-semibold text-gray-700">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {mockRecentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="py-4 text-sm text-gray-900">#{order.id}</td>
                      <td className="py-4 text-sm text-gray-900">{order.vehiculo}</td>
                      <td className="py-4 text-sm text-gray-900">{order.cliente}</td>
                      <td className="py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            order.estado === 'Completada'
                              ? 'bg-green-100 text-green-800'
                              : order.estado === 'En Progreso'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {order.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-lg shadow transition-colors">
            ➕ Nueva Orden de Servicio
          </button>
          <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-lg shadow transition-colors">
            👤 Nuevo Cliente
          </button>
          <button className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-4 px-6 rounded-lg shadow transition-colors">
            📅 Nueva Reserva
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
