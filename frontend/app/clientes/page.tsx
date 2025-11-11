'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import ClienteTable from '@/components/clientes/ClienteTable';
import ClienteModal from '@/components/clientes/ClienteModal';
import { clientesService, type ClienteInput } from '@/lib/clientesService';
import type { Cliente } from '@/types';

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadClientes = async (search?: string) => {
    setLoading(true);
    setError(null);
    const response = await clientesService.getAll(search);

    if (response.success && response.data) {
      setClientes(response.data);
    } else {
      setError(response.error || 'Error al cargar clientes');
      setClientes([]);
    }
    setLoading(false);
  };

  // Cargar clientes al montar el componente
  useEffect(() => {
    const timeout = setTimeout(() => {
      loadClientes();
    }, 0);

    return () => clearTimeout(timeout);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadClientes(searchTerm || undefined);
  };

  const handleOpenModal = (cliente?: Cliente) => {
    setEditingCliente(cliente || null);
    setIsModalOpen(true);
    setError(null);
    setSuccessMessage(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCliente(null);
  };

  const handleSave = async (data: ClienteInput) => {
    setError(null);

    let response;
    if (editingCliente) {
      response = await clientesService.update(editingCliente.id, data);
    } else {
      response = await clientesService.create(data);
    }

    if (response.success) {
      setSuccessMessage(
        response.message || `Cliente ${editingCliente ? 'actualizado' : 'creado'} exitosamente`
      );
      loadClientes(searchTerm || undefined);
      handleCloseModal();
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setSuccessMessage(null), 3000);
    } else {
      setError(response.error || 'Error al guardar el cliente');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Está seguro de que desea eliminar este cliente?')) {
      return;
    }

    const response = await clientesService.delete(id);

    if (response.success) {
      setSuccessMessage('Cliente eliminado exitosamente');
      loadClientes(searchTerm || undefined);
      setTimeout(() => setSuccessMessage(null), 3000);
    } else {
      setError(response.error || 'Error al eliminar el cliente');
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    loadClientes();
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
            <p className="text-gray-600 mt-1">
              Gestión de clientes del taller ({clientes.length} registrados)
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition-colors"
          >
            ➕ Nuevo Cliente
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
              placeholder="Buscar por nombre, apellido, teléfono o email..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
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
        <ClienteTable
          clientes={clientes}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
          loading={loading}
        />

        {/* Modal */}
        <ClienteModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
          cliente={editingCliente}
        />
      </div>
    </AppLayout>
  );
}
