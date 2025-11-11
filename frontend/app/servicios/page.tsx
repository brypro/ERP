'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import ServicioTable from '@/components/servicios/ServicioTable';
import ServicioModal from '@/components/servicios/ServicioModal';
import { serviciosService, type ServicioInput } from '@/lib/serviciosService';
import type { Servicio } from '@/types';

export default function ServiciosPage() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingServicio, setEditingServicio] = useState<Servicio | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadServicios = async (search?: string) => {
    setLoading(true);
    setError(null);
    const response = await serviciosService.getAll(search);

    if (response.success && response.data) {
      setServicios(response.data);
    } else {
      setError(response.error || 'Error al cargar servicios');
      setServicios([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadServicios();
    }, 0);

    return () => clearTimeout(timeout);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadServicios(searchTerm || undefined);
  };

  const handleOpenModal = (servicio?: Servicio) => {
    setEditingServicio(servicio || null);
    setIsModalOpen(true);
    setError(null);
    setSuccessMessage(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingServicio(null);
  };

  const handleSave = async (data: ServicioInput) => {
    setError(null);

    let response;
    if (editingServicio) {
      response = await serviciosService.update(editingServicio.id, data);
    } else {
      response = await serviciosService.create(data);
    }

    if (response.success) {
      setSuccessMessage(
        response.message || `Servicio ${editingServicio ? 'actualizado' : 'creado'} exitosamente`
      );
      loadServicios(searchTerm || undefined);
      handleCloseModal();
      setTimeout(() => setSuccessMessage(null), 3000);
    } else {
      setError(response.error || 'Error al guardar el servicio');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Está seguro de que desea eliminar este servicio?')) {
      return;
    }

    const response = await serviciosService.delete(id);

    if (response.success) {
      setSuccessMessage('Servicio eliminado exitosamente');
      loadServicios(searchTerm || undefined);
      setTimeout(() => setSuccessMessage(null), 3000);
    } else {
      setError(response.error || 'Error al eliminar el servicio');
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    loadServicios();
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Catálogo de Servicios</h1>
            <p className="text-gray-600 mt-1">
              Gestión de servicios del taller ({servicios.length} registrados)
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition-colors"
          >
            ➕ Nuevo Servicio
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

        {/* Búsqueda */}
        <div className="bg-white rounded-lg shadow p-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre o descripción..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
            >
              Buscar
            </button>
            {searchTerm && (
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
        <ServicioTable
          servicios={servicios}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
          loading={loading}
        />

        {/* Modal */}
        <ServicioModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
          servicio={editingServicio}
        />
      </div>
    </AppLayout>
  );
}
