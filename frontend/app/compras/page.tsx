'use client';

import AppLayout from '@/components/AppLayout';

export default function ComprasPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Compras</h1>
            <p className="text-gray-600 mt-1">Gestión de compras y recepciones</p>
          </div>
          <button className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition-colors">
            ➕ Nueva Compra
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Módulo en Desarrollo</h2>
          <p className="text-gray-600">
            La funcionalidad de gestión de compras estará disponible próximamente.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
