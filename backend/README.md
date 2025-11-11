# Backend - ERP Taller Mecánico

API RESTful desarrollada con Flask para el sistema de gestión de taller mecánico.

## Tecnologías

- **Flask 3.0.3** - Framework web de Python
- **Flask-CORS 4.0.1** - Manejo de CORS
- **psycopg2-binary 2.9.9** - Conector PostgreSQL
- **python-dotenv 1.0.1** - Gestión de variables de entorno
- **Python 3.12+** - Lenguaje de programación

## Estructura del Proyecto

```
backend/
├── app.py                # Aplicación principal Flask
├── models/              # Modelos de datos
│   └── cliente.py       # Modelo de Cliente
├── routes/              # Rutas/Endpoints de la API
│   └── clientes.py      # Rutas CRUD de clientes
├── utils/               # Utilidades
│   └── database.py      # Conexión y helpers de BD
├── .env                 # Variables de entorno (no versionado)
├── .env.example         # Ejemplo de variables de entorno
└── requirements.txt     # Dependencias de Python
```

## Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del backend:

```bash
FLASK_APP=app.py
FLASK_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/erp_taller_mecanico
PORT=5000
```

### Instalación

1. Crear entorno virtual:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
```

2. Instalar dependencias:
```bash
pip install -r requirements.txt
```

3. Configurar base de datos PostgreSQL:
```bash
# Crear la base de datos
createdb erp_taller_mecanico

# O usando psql
psql -U postgres
CREATE DATABASE erp_taller_mecanico;
\q

# Ejecutar script de inicialización
psql -U postgres -d erp_taller_mecanico -f ../database/init.sql

# Opcional: Cargar datos de ejemplo
psql -U postgres -d erp_taller_mecanico -f ../database/seed.sql
```

4. Ejecutar la aplicación:
```bash
python app.py
```

El servidor estará disponible en `http://localhost:5000`

## API Endpoints

### General

#### GET /
Información general de la API

#### GET /api/health
Estado de salud de la API y conexión a base de datos

### Clientes

#### GET /api/clientes
Obtiene lista de todos los clientes

**Query Parameters:**
- `search` (opcional): Término de búsqueda

#### GET /api/clientes/:id
Obtiene un cliente específico

#### POST /api/clientes
Crea un nuevo cliente

**Campos requeridos:** `nombre`, `apellido`

#### PUT /api/clientes/:id
Actualiza un cliente existente

#### DELETE /api/clientes/:id
Elimina un cliente

Ver documentación completa de endpoints en `/docs/api.md`

## Testing

```bash
# Listar clientes
curl http://localhost:5000/api/clientes

# Crear cliente
curl -X POST http://localhost:5000/api/clientes \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Juan","apellido":"Pérez","telefono":"555-0101"}'
```

## Estado del Desarrollo

### ✅ Implementado
- Conexión a base de datos PostgreSQL
- Modelo de Cliente con CRUD completo
- Endpoints RESTful de clientes
- Búsqueda de clientes

### 📋 Pendiente
- Módulos de Vehículos, Reservas, Órdenes, etc.
- Autenticación JWT
- Testing automatizado
