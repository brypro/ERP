'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import ProductoTable from '@/components/inventario/ProductoTable';
import ProductoModal from '@/components/inventario/ProductoModal';
import inventarioService, { type ProductoInput } from '@/lib/inventarioService';
import type { Producto } from '@/types';

export default function InventarioPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showLowStock, setShowLowStock] = useState(false);

  // Cargar productos
  const loadProductos = async () => {
    setLoading(true);
    try {
      const filters: { search?: string; categoria?: string; low_stock?: boolean } = {};

      if (searchTerm.trim()) {
        filters.search = searchTerm.trim();
      }

      if (categoryFilter.trim()) {
        filters.categoria = categoryFilter.trim();
      }

      if (showLowStock) {
        filters.low_stock = true;
      }

      const response = await inventarioService.getAll(filters);

      if (response.success && response.data) {
        setProductos(response.data);
      } else {
        console.error('Error loading productos:', response.error);
      }
    } catch (error) {
      console.error('Error loading productos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProductos();
  }, [searchTerm, categoryFilter, showLowStock]);

  const handleCreate = () => {
    setSelectedProducto(null);
    setIsModalOpen(true);
  };

  const handleEdit = (producto: Producto) => {
    setSelectedProducto(producto);
    setIsModalOpen(true);
  };

  const handleSave = async (data: ProductoInput) => {
    setSaving(true);
    try {
      let response;

      if (selectedProducto) {
        // Actualizar producto existente
        response = await inventarioService.update(selectedProducto.id, data);
      } else {
        // Crear nuevo producto
        response = await inventarioService.create(data);
      }

      if (response.success) {
        setIsModalOpen(false);
        loadProductos();
      } else {
        alert(response.error || 'Error al guardar el producto');
      }
    } catch (error) {
      console.error('Error saving producto:', error);
      alert('Error al guardar el producto');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Está seguro de que desea eliminar este producto?')) {
      return;
    }

    try {
      const response = await inventarioService.delete(id);

      if (response.success) {
        loadProductos();
      } else {
        alert(response.error || 'Error al eliminar el producto');
      }
    } catch (error) {
      console.error('Error deleting producto:', error);
      alert('Error al eliminar el producto');
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setShowLowStock(false);
  };

  const hasActiveFilters = searchTerm || categoryFilter || showLowStock;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventario</h1>
          <p className="text-gray-600">Gestión de productos y stock</p>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Búsqueda */}
            <div className="md:col-span-2">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Buscar
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por código o nombre..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Categoría */}
            <div>
              <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>
              <input
                type="text"
                id="categoria"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                placeholder="Filtrar por categoría"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Stock Bajo */}
            <div className="flex items-end">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showLowStock}
                  onChange={(e) => setShowLowStock(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Solo stock bajo</span>
              </label>
            </div>
          </div>

          {/* Limpiar filtros */}
          {hasActiveFilters && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Mostrando {productos.length} producto{productos.length !== 1 ? 's' : ''}
              </p>
              <button
                onClick={handleClearFilters}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>

        {/* Botón crear */}
        <div>
          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Producto
          </button>
        </div>

        {/* Tabla de productos */}
        <ProductoTable
          productos={productos}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />

        {/* Modal */}
        <ProductoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          producto={selectedProducto}
          loading={saving}
        />
      </div>
    </AppLayout>
  );
}
