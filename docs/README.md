# Documentación del Proyecto ERP - Taller Mecánico

## Descripción General

Sistema ERP básico diseñado específicamente para la gestión de un taller mecánico. Permite administrar clientes, vehículos, servicios y órdenes de trabajo.

## Tecnologías Utilizadas

### Frontend
- **Next.js** - Framework de React para aplicaciones web
- **TypeScript** - Tipado estático para JavaScript
- **Tailwind CSS** - Framework de CSS para estilos

### Backend
- **Flask** - Framework web de Python
- **Flask-CORS** - Manejo de CORS para API
- **Python 3.12+** - Lenguaje de programación

### Base de Datos
- **MySQL/PostgreSQL** - Sistema de gestión de base de datos relacional

## Estructura del Proyecto

```
ERP/
├── frontend/          # Aplicación Next.js
│   ├── app/           # Rutas y páginas de la aplicación
│   ├── components/    # Componentes reutilizables
│   ├── public/        # Archivos estáticos
│   └── package.json   # Dependencias de Node.js
├── backend/           # API Flask
│   ├── app.py         # Aplicación principal
│   ├── requirements.txt # Dependencias de Python
│   └── .env.example   # Variables de entorno de ejemplo
├── database/          # Scripts de base de datos
│   ├── init.sql       # Inicialización de la BD
│   └── seed.sql       # Datos de ejemplo
└── docs/              # Documentación
    ├── README.md      # Este archivo
    ├── api.md         # Documentación de la API
    └── architecture.md # Arquitectura del sistema
```

## Instalación y Configuración

### Prerrequisitos
- Node.js 18+ y npm
- Python 3.12+
- MySQL o PostgreSQL

### Instalación del Frontend
```bash
cd frontend
npm install
npm run dev
```

El frontend estará disponible en `http://localhost:3000`

### Instalación del Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

El backend estará disponible en `http://localhost:5000`

### Configuración de la Base de Datos
```bash
cd database
mysql -u root -p < init.sql
mysql -u root -p erp_taller_mecanico < seed.sql
```

## Características Principales

1. **Gestión de Clientes**
   - Registro de clientes
   - Información de contacto
   - Historial de servicios

2. **Gestión de Vehículos**
   - Registro de vehículos por cliente
   - Información técnica (marca, modelo, año, placa)
   - Seguimiento de kilometraje

3. **Catálogo de Servicios**
   - Definición de servicios ofrecidos
   - Precios y descripciones
   - Gestión de inventario de servicios

4. **Órdenes de Trabajo**
   - Creación de órdenes de reparación/mantenimiento
   - Seguimiento del estado
   - Cálculo de totales
   - Fechas de ingreso y entrega

## Flujo de Trabajo

1. **Registro de Cliente**: Ingresar datos del cliente en el sistema
2. **Registro de Vehículo**: Asociar vehículos al cliente
3. **Crear Orden de Trabajo**: Generar orden cuando el cliente trae su vehículo
4. **Agregar Servicios**: Añadir los servicios a realizar en la orden
5. **Actualizar Estado**: Actualizar el estado de la orden (pendiente, en proceso, completado)
6. **Entregar Vehículo**: Marcar como entregado y cerrar la orden

## Próximas Funcionalidades

- [ ] Gestión de inventario de repuestos
- [ ] Sistema de facturación
- [ ] Reportes y estadísticas
- [ ] Notificaciones por email/SMS
- [ ] Panel de control con métricas
- [ ] Gestión de empleados y técnicos
- [ ] Sistema de citas y agenda

## Soporte y Contribuciones

Para reportar problemas o sugerir mejoras, por favor crear un issue en el repositorio.

## Licencia

Este proyecto es de código abierto y está disponible para uso educativo y comercial.
