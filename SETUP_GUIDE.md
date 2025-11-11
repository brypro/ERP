# Guía de Configuración - ERP Taller Mecánico

Esta guía te ayudará a configurar y ejecutar el sistema ERP completo.

## ✅ Completado

- [x] PostgreSQL instalado y configurado
- [x] Base de datos `erp_taller_mecanico` creada
- [x] Tablas creadas con `init.sql`
- [x] Datos de ejemplo cargados con `seed.sql`
- [x] Usuario PostgreSQL configurado: `anahuel`

## 📋 Pasos Pendientes

### 1. Instalar Python Virtual Environment

Necesitas instalar el paquete `python3-venv`:

```bash
sudo apt install python3.13-venv
```

### 2. Configurar Backend

```bash
cd /home/anahuel/Desktop/ERP/backend

# Crear entorno virtual
python3 -m venv venv

# Activar entorno virtual
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt
```

### 3. Verificar Conexión a Base de Datos

```bash
# Con el entorno virtual activado
cd /home/anahuel/Desktop/ERP/backend
source venv/bin/activate

# Probar conexión
python3 -c "from utils.database import get_db_connection; conn = get_db_connection(); print('✓ Conexión exitosa!'); conn.close()"
```

### 4. Iniciar Backend

```bash
cd /home/anahuel/Desktop/ERP/backend
source venv/bin/activate
python3 app.py
```

El servidor backend estará en: **http://localhost:5000**

Endpoints disponibles:
- GET http://localhost:5000/ - Info de la API
- GET http://localhost:5000/api/health - Health check
- GET http://localhost:5000/api/clientes - Lista de clientes
- POST http://localhost:5000/api/clientes - Crear cliente
- PUT http://localhost:5000/api/clientes/:id - Actualizar cliente
- DELETE http://localhost:5000/api/clientes/:id - Eliminar cliente

### 5. Iniciar Frontend

**En otra terminal:**

```bash
cd /home/anahuel/Desktop/ERP/frontend

# Si no están instaladas las dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El frontend estará en: **http://localhost:3000**

## 🧪 Probar el Sistema

### Test 1: Backend (desde terminal)

```bash
# Listar clientes (debe mostrar los 3 clientes de seed.sql)
curl http://localhost:5000/api/clientes

# Crear un nuevo cliente
curl -X POST http://localhost:5000/api/clientes \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Pedro",
    "apellido": "Martínez",
    "telefono": "555-9999",
    "email": "pedro@example.com",
    "direccion": "Calle Test 123"
  }'
```

### Test 2: Frontend (desde navegador)

1. Abrir http://localhost:3000
2. Navegar a "Clientes" en el sidebar
3. Ver lista de clientes (deben aparecer los de la base de datos)
4. Hacer clic en "➕ Nuevo Cliente"
5. Llenar el formulario y guardar
6. Verificar que el cliente aparece en la lista
7. Probar editar un cliente
8. Probar buscar clientes
9. Probar eliminar un cliente

## 📊 Verificar Base de Datos

Conectarse a PostgreSQL para ver los datos:

```bash
psql -U anahuel -d erp_taller_mecanico

# Dentro de psql:
SELECT * FROM clientes;
\dt  # Ver todas las tablas
\d clientes  # Ver estructura de tabla clientes
\q  # Salir
```

## ⚙️ Configuración Actual

### Base de Datos
```
Host: localhost
Puerto: 5432
Usuario: anahuel
Password: anahuel
Database: erp_taller_mecanico
```

### Backend (.env)
```
FLASK_APP=app.py
FLASK_ENV=development
DATABASE_URL=postgresql://anahuel:anahuel@localhost:5432/erp_taller_mecanico
PORT=5000
```

### Frontend
```
API URL: http://localhost:5000 (configurado en lib/api.ts)
```

## 🐛 Troubleshooting

### Error: "connection refused"
- Verificar que PostgreSQL esté corriendo: `sudo systemctl status postgresql`
- Iniciar PostgreSQL: `sudo systemctl start postgresql`

### Error: "authentication failed"
- Verificar credenciales en backend/.env
- Verificar que el usuario existe: `psql -U anahuel -d erp_taller_mecanico`

### Error: "ModuleNotFoundError"
- Activar el entorno virtual: `source venv/bin/activate`
- Reinstalar dependencias: `pip install -r requirements.txt`

### Frontend: "Failed to fetch"
- Verificar que el backend esté corriendo en puerto 5000
- Verificar CORS (ya está configurado en Flask)

## 📁 Estructura del Proyecto

```
ERP/
├── backend/
│   ├── app.py              # Servidor Flask
│   ├── models/             # Modelos de datos
│   ├── routes/             # Endpoints API
│   ├── utils/              # Utilidades (DB connection)
│   ├── requirements.txt    # Dependencias Python
│   └── .env                # Variables de entorno
├── frontend/
│   ├── app/                # Páginas Next.js
│   ├── components/         # Componentes React
│   ├── lib/                # Servicios y utilidades
│   ├── types/              # Tipos TypeScript
│   └── package.json        # Dependencias Node.js
├── database/
│   ├── init.sql            # Script de creación de tablas
│   ├── seed.sql            # Datos de ejemplo
│   └── setup.sh            # Script de configuración
└── docs/
    └── README.md           # Documentación general
```

## ✅ Siguiente: Fase 3 - Módulo de Vehículos

Una vez que el módulo de Clientes funcione correctamente, continuaremos con:
- Gestión de vehículos asociados a clientes
- CRUD completo de vehículos
- Relación vehículo-cliente
