'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  name: string;
  href: string;
  icon: string;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Clientes', href: '/clientes', icon: '👥' },
  { name: 'Vehículos', href: '/vehiculos', icon: '🚗' },
  { name: 'Reservas', href: '/reservas', icon: '📅' },
  { name: 'Órdenes de Servicio', href: '/ordenes', icon: '🔧' },
  { name: 'Inventario', href: '/inventario', icon: '📦' },
  { name: 'Proveedores', href: '/proveedores', icon: '🏭' },
  { name: 'Compras', href: '/compras', icon: '🛒' },
  { name: 'Boletas', href: '/boletas', icon: '🧾' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 overflow-y-auto">
      {/* Logo / Header */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold">ERP Taller</h1>
        <p className="text-sm text-gray-400">Sistema de Gestión</p>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }
                  `}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
        <p className="text-xs text-gray-500 text-center">
          v1.0.0 - En desarrollo
        </p>
      </div>
    </aside>
  );
}
