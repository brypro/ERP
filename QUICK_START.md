# 🚀 Inicio Rápido - ERP Taller Mecánico

## Paso 1: Instalar Dependencias del Sistema

```bash
sudo apt update
sudo apt install python3.13-venv python3.13-dev libpq-dev
```

Explicación:
- `python3.13-venv`: Para crear entornos virtuales de Python
- `python3.13-dev`: Headers de desarrollo de Python (necesario para psycopg2)
- `libpq-dev`: Bibliotecas de desarrollo de PostgreSQL

## Paso 2: Configurar Backend

```bash
cd /home/anahuel/Desktop/ERP/backend

# Eliminar venv anterior si existe (por el error previo)
rm -rf venv

# Crear nuevo entorno virtual
python3 -m venv venv

# Activar entorno virtual
source venv/bin/activate

# Instalar dependencias (ahora debería funcionar)
pip install -r requirements.txt
```

## Paso 3: Iniciar Backend

```bash
# Asegúrate de estar en backend/ con venv activado
python3 app.py
```

Deberías ver:
```
 * Serving Flask app 'app'
 * Debug mode: on
 * Running on http://0.0.0.0:5000
```

**Déjalo corriendo** y abre otra terminal para el siguiente paso.

## Paso 4: Probar Backend

En **otra terminal** ejecuta:

```bash
# Test health check
curl http://localhost:5000/api/health

# Debería responder:
# {"database":"connected","status":"healthy"}

# Test listar clientes
curl http://localhost:5000/api/clientes

# Debería mostrar 3 clientes (Juan Pérez, María González, Carlos Rodríguez)
```

## Paso 5: Iniciar Frontend

En **otra terminal**:

```bash
cd /home/anahuel/Desktop/ERP/frontend

# Iniciar servidor de desarrollo
npm run dev
```

Deberías ver:
```
  ▲ Next.js 16.0.0
  - Local:        http://localhost:3000
```

## Paso 6: Probar en el Navegador

1. Abrir **http://localhost:3000**
2. Se redirige automáticamente a `/dashboard`
3. Hacer clic en **"Clientes"** en el sidebar
4. Deberías ver una tabla con 3 clientes

### Probar Funcionalidades:

✅ **Crear Cliente:**
- Clic en "➕ Nuevo Cliente"
- Llenar formulario (nombre y apellido son requeridos)
- Clic en "Guardar"
- El cliente aparece en la tabla

✅ **Editar Cliente:**
- Clic en "Editar" en cualquier cliente
- Modificar datos
- Clic en "Guardar"

✅ **Buscar Cliente:**
- Escribir en el campo de búsqueda
- Clic en "Buscar"
- Solo aparecen clientes que coinciden

✅ **Eliminar Cliente:**
- Clic en "Eliminar" en cualquier cliente
- Confirmar en el diálogo
- El cliente desaparece de la tabla

## 🎯 Estado del Proyecto

### ✅ Funcionando
- **Frontend**: Next.js 16 + React 19 + TypeScript + Tailwind
- **Backend**: Flask 3.0 + PostgreSQL
- **Base de Datos**: PostgreSQL 17 con 5 tablas
- **Módulo Clientes**: CRUD completo funcional

### 📋 Próximos Módulos
- Vehículos
- Reservas
- Órdenes de Servicio
- Inventario
- Proveedores
- Compras
- Boletas

## 🐛 Solución de Problemas

### Backend no inicia
```bash
# Verificar que estás en el directorio correcto
pwd  # Debe mostrar: /home/anahuel/Desktop/ERP/backend

# Verificar que el entorno virtual está activado
which python3  # Debe mostrar: .../backend/venv/bin/python3

# Revisar logs de error en la terminal
```

### Frontend muestra error de conexión
```bash
# Verificar que el backend está corriendo en puerto 5000
curl http://localhost:5000/api/health

# Si no responde, revisar el backend
```

### Base de datos no conecta
```bash
# Verificar que PostgreSQL está corriendo
sudo systemctl status postgresql

# Probar conexión manual
psql -U anahuel -d erp_taller_mecanico -c "SELECT COUNT(*) FROM clientes;"

# Debe mostrar: count = 3 (o más si agregaste clientes)
```

## 📊 Verificar Base de Datos

```bash
# Conectar a PostgreSQL
psql -U anahuel -d erp_taller_mecanico

# Ver clientes
SELECT * FROM clientes;

# Ver estructura de tablas
\dt

# Salir
\q
```

## 🔧 Comandos Útiles

### Backend
```bash
# Activar entorno virtual
cd backend && source venv/bin/activate

# Instalar nueva dependencia
pip install nombre-paquete
pip freeze > requirements.txt

# Desactivar entorno virtual
deactivate
```

### Frontend
```bash
# Instalar nueva dependencia
npm install nombre-paquete

# Build de producción
npm run build

# Linter
npm run lint
```

### Base de Datos
```bash
# Backup
pg_dump -U anahuel erp_taller_mecanico > backup.sql

# Restore
psql -U anahuel -d erp_taller_mecanico < backup.sql

# Recrear tablas (CUIDADO: borra datos)
psql -U anahuel -d erp_taller_mecanico -f database/init.sql
```

---

**¡Listo!** El sistema está funcionando. Puedes empezar a probar el módulo de clientes.
