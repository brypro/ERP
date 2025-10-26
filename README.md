# ERP - Sistema de Gestión para Taller Mecánico

Sistema ERP básico diseñado para la gestión integral de un taller mecánico. Permite administrar clientes, vehículos, servicios y órdenes de trabajo.

## 🚀 Estructura del Proyecto

```
ERP/
├── frontend/          # Aplicación web con Next.js
├── backend/           # API REST con Flask
├── database/          # Scripts de base de datos SQL
└── docs/              # Documentación del proyecto
```

## 📋 Características

- **Gestión de Clientes**: Registro y administración de información de clientes
- **Gestión de Vehículos**: Control de vehículos asociados a cada cliente
- **Catálogo de Servicios**: Definición de servicios y precios
- **Órdenes de Trabajo**: Creación y seguimiento de órdenes de reparación/mantenimiento

## 🛠️ Tecnologías

### Frontend
- Next.js 15+
- React 19+
- TypeScript
- Tailwind CSS

### Backend
- Flask 3.0+
- Python 3.12+
- Flask-CORS

### Base de Datos
- MySQL / PostgreSQL

## 📦 Instalación

### Frontend
```bash
cd frontend
npm install
npm run dev
```
El frontend estará disponible en `http://localhost:3000`

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```
El backend estará disponible en `http://localhost:5000`

### Base de Datos
```bash
cd database
mysql -u root -p < init.sql
mysql -u root -p erp_taller_mecanico < seed.sql
```

## 📚 Documentación

Consulta la carpeta `docs/` para documentación detallada:

- [Documentación General](docs/README.md)
- [API Documentation](docs/api.md)
- [Arquitectura del Sistema](docs/architecture.md)

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue para discutir cambios mayores.

## 📄 Licencia

Este proyecto es de código abierto y está disponible para uso educativo y comercial.
