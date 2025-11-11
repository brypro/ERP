'use client';

import AppLayout from '@/components/AppLayout';

export default function OrdenesPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Órdenes de Servicio</h1>
            <p className="text-gray-600 mt-1">Gestión de órdenes de trabajo</p>
          </div>
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition-colors">
            ➕ Nueva Orden
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-6xl mb-4">🔧</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Módulo en Desarrollo</h2>
          <p className="text-gray-600">
            La funcionalidad de órdenes de servicio estará disponible próximamente.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
