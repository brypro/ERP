'use client';

import { useCallback, useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import ReservaTable from '@/components/reservas/ReservaTable';
import ReservaModal from '@/components/reservas/ReservaModal';
import {
  reservasService,
  type ReservaInput,
  type ReservasFilters
} from '@/lib/reservasService';
import type { Reserva, ReservaEstado } from '@/types';

export default function ReservasPage() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReserva, setEditingReserva] = useState<Reserva | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('');
  const [fechaFilter, setFechaFilter] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const buildFilters = () => ({
    search: searchTerm || undefined,
    fecha: fechaFilter || undefined,
    estado: (estadoFilter || undefined) as ReservaEstado | undefined
  });

  const fetchReservas = useCallback(async (filters?: ReservasFilters) => {
    setLoading(true);
    setError(null);
    const response = await reservasService.getAll(filters);

    if (response.success && response.data) {
      setReservas(response.data);
    } else {
      setReservas([]);
      setError(response.error || 'Error al cargar reservas');
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchReservas();
    }, 0);

    return () => clearTimeout(timeout);
  }, [fetchReservas]);

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    await fetchReservas(buildFilters());
  };

  const handleOpenModal = (reserva?: Reserva) => {
    setEditingReserva(reserva || null);
    setIsModalOpen(true);
    setError(null);
    setSuccessMessage(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingReserva(null);
  };

  const handleSave = async (data: ReservaInput) => {
    setError(null);
    let response;

    if (editingReserva) {
      response = await reservasService.update(editingReserva.id, data);
    } else {
      response = await reservasService.create(data);
    }

    if (response.success) {
      setSuccessMessage(
        response.message ||
          `Reserva ${editingReserva ? 'actualizada' : 'creada'} exitosamente`
      );
      await fetchReservas(buildFilters());
      handleCloseModal();
      setTimeout(() => setSuccessMessage(null), 3000);
    } else {
      setError(response.error || 'No se pudo guardar la reserva');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Está seguro de que desea eliminar esta reserva?')) {
      return;
    }

    const response = await reservasService.delete(id);
    if (response.success) {
      setSuccessMessage('Reserva eliminada exitosamente');
      await fetchReservas(buildFilters());
      setTimeout(() => setSuccessMessage(null), 3000);
    } else {
      setError(response.error || 'No se pudo eliminar la reserva');
    }
  };

  const handleClearFilters = async () => {
    setSearchTerm('');
    setEstadoFilter('');
    setFechaFilter('');
    await fetchReservas();
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reservas</h1>
            <p className="text-gray-600 mt-1">
              Gestión de reservas y citas ({reservas.length} registradas)
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition-colors"
          >
            ➕ Nueva Reserva
          </button>
        </div>

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

        <div className="bg-white rounded-lg shadow p-4">
          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row gap-3 md:items-end"
          >
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buscar
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cliente, vehículo, placa o servicio..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha
              </label>
              <input
                type="date"
                value={fechaFilter}
                onChange={(e) => setFechaFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={estadoFilter}
                onChange={(e) => setEstadoFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Todos</option>
                <option value="pendiente">Pendiente</option>
                <option value="confirmada">Confirmada</option>
                <option value="cancelada">Cancelada</option>
                <option value="completada">Completada</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 md:flex-none bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
              >
                Aplicar
              </button>
              <button
                type="button"
                onClick={handleClearFilters}
                className="flex-1 md:flex-none bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Limpiar
              </button>
            </div>
          </form>
        </div>

        <ReservaTable
          reservas={reservas}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
          loading={loading}
        />

        <ReservaModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
          reserva={editingReserva}
        />
      </div>
    </AppLayout>
  );
}
