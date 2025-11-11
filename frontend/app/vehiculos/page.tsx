'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import VehiculoTable from '@/components/vehiculos/VehiculoTable';
import VehiculoModal from '@/components/vehiculos/VehiculoModal';
import { vehiculosService, type VehiculoInput } from '@/lib/vehiculosService';
import type { Vehiculo } from '@/types';

export default function VehiculosPage() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehiculo, setEditingVehiculo] = useState<Vehiculo | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadVehiculos = async (search?: string) => {
    setLoading(true);
    setError(null);
    const response = await vehiculosService.getAll(search);

    if (response.success && response.data) {
      setVehiculos(response.data);
    } else {
      setError(response.error || 'Error al cargar vehículos');
      setVehiculos([]);
    }
    setLoading(false);
  };

  // Cargar vehículos al montar el componente
  useEffect(() => {
    const timeout = setTimeout(() => {
      loadVehiculos();
    }, 0);

    return () => clearTimeout(timeout);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadVehiculos(searchTerm || undefined);
  };

  const handleOpenModal = (vehiculo?: Vehiculo) => {
    setEditingVehiculo(vehiculo || null);
    setIsModalOpen(true);
    setError(null);
    setSuccessMessage(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingVehiculo(null);
  };

  const handleSave = async (data: VehiculoInput) => {
    setError(null);

    let response;
    if (editingVehiculo) {
      response = await vehiculosService.update(editingVehiculo.id, data);
    } else {
      response = await vehiculosService.create(data);
    }

    if (response.success) {
      setSuccessMessage(
        response.message || `Vehículo ${editingVehiculo ? 'actualizado' : 'creado'} exitosamente`
      );
      loadVehiculos(searchTerm || undefined);
      handleCloseModal();
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setSuccessMessage(null), 3000);
    } else {
      setError(response.error || 'Error al guardar el vehículo');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Está seguro de que desea eliminar este vehículo?')) {
      return;
    }

    const response = await vehiculosService.delete(id);

    if (response.success) {
      setSuccessMessage('Vehículo eliminado exitosamente');
      loadVehiculos(searchTerm || undefined);
      setTimeout(() => setSuccessMessage(null), 3000);
    } else {
      setError(response.error || 'Error al eliminar el vehículo');
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    loadVehiculos();
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vehículos</h1>
            <p className="text-gray-600 mt-1">
              Gestión de vehículos del taller ({vehiculos.length} registrados)
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition-colors"
          >
            ➕ Nuevo Vehículo
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
              placeholder="Buscar por marca, modelo o placa..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
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
        <VehiculoTable
          vehiculos={vehiculos}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
          loading={loading}
        />

        {/* Modal */}
        <VehiculoModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
          vehiculo={editingVehiculo}
        />
      </div>
    </AppLayout>
  );
}
