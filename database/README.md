# Scripts de Base de Datos

Scripts SQL para la inicialización y gestión de la base de datos del ERP.

## Archivos

- `init.sql` - Script de inicialización de la base de datos (crea tablas y estructura)
- `seed.sql` - Script de datos de ejemplo para pruebas

## Estructura de la Base de Datos

### Tablas Principales

1. **clientes** - Información de los clientes del taller
2. **vehiculos** - Vehículos registrados de los clientes
3. **servicios** - Catálogo de servicios ofrecidos
4. **ordenes_trabajo** - Órdenes de trabajo/reparación
5. **orden_detalle** - Detalle de servicios en cada orden

## Uso

### Inicializar la base de datos:
```bash
mysql -u root -p < init.sql
```

### Cargar datos de ejemplo:
```bash
mysql -u root -p erp_taller_mecanico < seed.sql
```

## Notas

- Se recomienda usar PostgreSQL o MySQL
- Ajustar los tipos de datos según el motor de base de datos utilizado
- Cambiar las credenciales de conexión en el archivo .env del backend
