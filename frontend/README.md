# Frontend - ERP Taller Mecánico

Sistema de gestión integral para talleres mecánicos desarrollado con Next.js 16, React 19 y TypeScript.

## Tecnologías

- **Next.js 16** - Framework React con App Router
- **React 19** - Biblioteca de UI con Server Components
- **TypeScript 5** - Tipado estático
- **Tailwind CSS 4** - Framework de estilos
- **ESLint** - Linter de código

## Estructura del Proyecto

```
frontend/
├── app/                      # Rutas de la aplicación (Next.js App Router)
│   ├── page.tsx             # Página raíz (redirige a /dashboard)
│   ├── layout.tsx           # Layout principal
│   ├── globals.css          # Estilos globales
│   ├── dashboard/           # Dashboard principal
│   │   └── page.tsx         # Vista del dashboard con métricas
│   ├── clientes/            # Módulo de clientes
│   │   └── page.tsx
│   ├── vehiculos/           # Módulo de vehículos
│   │   └── page.tsx
│   ├── reservas/            # Módulo de reservas
│   │   └── page.tsx
│   ├── ordenes/             # Módulo de órdenes de servicio
│   │   └── page.tsx
│   ├── inventario/          # Módulo de inventario
│   │   └── page.tsx
│   ├── proveedores/         # Módulo de proveedores
│   │   └── page.tsx
│   ├── compras/             # Módulo de compras
│   │   └── page.tsx
│   └── boletas/             # Módulo de boletas/facturación
│       └── page.tsx
├── components/              # Componentes reutilizables
│   ├── Sidebar.tsx          # Navegación lateral con menú de módulos
│   ├── Navbar.tsx           # Barra superior con fecha/hora y usuario
│   └── AppLayout.tsx        # Layout wrapper (Sidebar + Navbar + contenido)
├── lib/                     # Utilidades y helpers
│   └── api.ts               # Cliente HTTP para comunicación con backend
├── types/                   # Definiciones de tipos TypeScript
│   └── index.ts             # Interfaces de todas las entidades del sistema
├── public/                  # Archivos estáticos
├── .env.local.example       # Variables de entorno de ejemplo
└── package.json             # Dependencias y scripts
```

## Módulos del Sistema

### 1. Dashboard
- Tarjetas con métricas principales (clientes, vehículos, órdenes activas, reservas)
- Tabla de órdenes recientes
- Botones de acceso rápido

### 2. Clientes
Gestión completa de clientes del taller.

### 3. Vehículos
Control de vehículos asociados a clientes.

### 4. Reservas
Sistema de reservas y citas para servicios.

### 5. Órdenes de Servicio
Gestión de órdenes de trabajo y servicios realizados.

### 6. Inventario
Control de repuestos y stock.

### 7. Proveedores
Gestión de proveedores de repuestos.

### 8. Compras
Control de compras y recepciones de inventario.

### 9. Boletas
Sistema de facturación y generación de boletas.

## Componentes Principales

### AppLayout
Layout wrapper que incluye Sidebar y Navbar. Se usa en todas las páginas de módulos.

```tsx
import AppLayout from '@/components/AppLayout';

export default function MiPagina() {
  return (
    <AppLayout>
      {/* Contenido de la página */}
    </AppLayout>
  );
}
```

### Sidebar
Navegación lateral con enlaces a todos los módulos. Indica visualmente la página activa.

### Navbar
Barra superior que muestra:
- Fecha y hora actual (actualización automática)
- Notificaciones (placeholder)
- Usuario actual (placeholder)

## API Client

El archivo `lib/api.ts` proporciona una clase `ApiClient` para comunicarse con el backend:

```typescript
import { apiClient } from '@/lib/api';

// GET request
const data = await apiClient.get('/api/clientes');

// POST request
const newCliente = await apiClient.post('/api/clientes', {
  nombre: 'Juan',
  telefono: '123456789'
});

// PUT request
const updated = await apiClient.put('/api/clientes/1', data);

// DELETE request
await apiClient.delete('/api/clientes/1');

// Health check
const health = await apiClient.checkHealth();
```

## Tipos TypeScript

Todas las entidades del sistema están definidas en `types/index.ts`:

- `Cliente` - Información de clientes
- `Vehiculo` - Datos de vehículos
- `Reserva` - Reservas de servicio
- `OrdenServicio` - Órdenes de trabajo
- `Repuesto` - Repuestos e inventario
- `Inventario` - Control de stock
- `Proveedor` - Proveedores
- `Compra` - Compras realizadas
- `Boleta` - Facturas generadas
- `ApiResponse<T>` - Respuesta genérica de la API
- `DashboardStats` - Estadísticas del dashboard

## Configuración

### Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Instalación y Ejecución

### Instalación de Dependencias

```bash
npm install
```

### Modo Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

### Build de Producción

```bash
npm run build
```

### Iniciar en Producción

```bash
npm start
```

### Linter

```bash
npm run lint
```

## Flujo de Navegación

1. **Inicio**: La página raíz (`/`) redirige automáticamente a `/dashboard`
2. **Dashboard**: Vista principal con métricas y accesos rápidos
3. **Módulos**: Cada módulo tiene su propia ruta y página dedicada
4. **Sidebar**: Navegación permanente visible en todas las páginas

## Características de UI/UX

- **Responsive Design**: Adaptable a diferentes tamaños de pantalla
- **Navegación Intuitiva**: Sidebar con iconos descriptivos
- **Indicador de Página Activa**: Destacado visual en la navegación
- **Paleta de Colores**: Cada módulo tiene un color distintivo
- **Feedback Visual**: Estados hover y transiciones suaves
- **Layout Fijo**: Sidebar y Navbar permanecen visibles al hacer scroll

## Estado Actual del Desarrollo

### ✅ Implementado (Fase 1)
- Estructura base del proyecto
- Sistema de navegación completo
- Dashboard con métricas (datos mock)
- Páginas placeholder para todos los módulos
- API Client configurado
- Tipos TypeScript definidos
- Build exitoso

### 🚧 En Desarrollo
- Módulo de Clientes (CRUD completo)
- Integración con backend
- Manejo de estados y formularios

### 📋 Pendiente
- Módulos de Vehículos, Reservas, Órdenes, etc.
- Sistema de autenticación
- Gestión de errores global
- Validación de formularios
- Testing (Jest + React Testing Library)
- Internacionalización (i18n)

## Convenciones de Código

- Componentes React en PascalCase
- Archivos de páginas: `page.tsx`
- Archivos de componentes: `NombreComponente.tsx`
- Uso de TypeScript estricto
- Client Components marcados con `'use client'`
- Imports con alias `@/` para rutas absolutas

## Recursos

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
