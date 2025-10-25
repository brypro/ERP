export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <main className="flex flex-col items-center justify-center py-16 px-8 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          ERP - Taller Mecánico
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl">
          Sistema de gestión integral para talleres mecánicos. 
          Administra clientes, vehículos, servicios y órdenes de trabajo de manera eficiente.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 max-w-4xl">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold text-blue-600 mb-2">Clientes</h2>
            <p className="text-gray-600">Gestiona la información de tus clientes</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold text-green-600 mb-2">Vehículos</h2>
            <p className="text-gray-600">Control de vehículos y mantenimientos</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold text-purple-600 mb-2">Servicios</h2>
            <p className="text-gray-600">Catálogo de servicios ofrecidos</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold text-orange-600 mb-2">Órdenes</h2>
            <p className="text-gray-600">Seguimiento de órdenes de trabajo</p>
          </div>
        </div>
        <div className="mt-12">
          <p className="text-sm text-gray-500">
            Versión 1.0.0 - Sistema en desarrollo
          </p>
        </div>
      </main>
    </div>
  );
}
