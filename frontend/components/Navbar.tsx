'use client';

import { useState, useEffect } from 'react';

export default function Navbar() {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleString('es-CL', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Actualizar cada minuto

    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="h-16 bg-white border-b border-gray-200 fixed top-0 right-0 left-64 z-10">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Fecha y hora */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{currentTime}</span>
        </div>

        {/* Usuario y acciones */}
        <div className="flex items-center gap-4">
          {/* Notificaciones (placeholder) */}
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <span className="text-xl">🔔</span>
          </button>

          {/* Usuario (placeholder) */}
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
            <span className="text-xl">👤</span>
            <span className="text-sm font-medium">Admin</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
