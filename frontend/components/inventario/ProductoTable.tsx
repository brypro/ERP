'use client';

import type { Producto } from '@/types';

interface ProductoTableProps {
  productos: Producto[];
  onEdit: (producto: Producto) => void;
  onDelete: (id: number) => void;
  loading?: boolean;
}

export default function ProductoTable({
  productos,
  onEdit,
  onDelete,
  loading = false
}: ProductoTableProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-600">Cargando productos...</p>
      </div>
    );
  }

  if (productos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="text-6xl mb-4">📦</div>
        <p className="text-gray-600">No hay productos en el inventario</p>
      </div>
    );
  }

  const getStockStatus = (producto: Producto) => {
    if (producto.stock_actual === 0) {
      return { color: 'text-red-600 bg-red-50', label: 'Sin Stock' };
    }
    if (producto.stock_actual <= producto.stock_minimo) {
      return { color: 'text-yellow-600 bg-yellow-50', label: 'Stock Bajo' };
    }
    return { color: 'text-green-600 bg-green-50', label: 'Disponible' };
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Código
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Precio Venta
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Ubicación
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {productos.map((producto) => {
              const stockStatus = getStockStatus(producto);
              return (
                <tr key={producto.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono text-gray-900">
                      {producto.codigo}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {producto.nombre}
                    </div>
                    {producto.descripcion && (
                      <div className="text-sm text-gray-600 truncate max-w-xs">
                        {producto.descripcion}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {producto.categoria || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-bold text-gray-900">
                        {producto.stock_actual}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${stockStatus.color}`}>
                        {stockStatus.label}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        Min: {producto.stock_minimo}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-medium text-gray-900">
                      ${Number(producto.precio_venta).toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Compra: ${Number(producto.precio_compra).toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {producto.ubicacion || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onEdit(producto)}
                      className="text-blue-600 hover:text-blue-900 mr-4 transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onDelete(producto.id)}
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
