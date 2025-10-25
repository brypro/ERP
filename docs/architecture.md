# Arquitectura del Sistema - ERP Taller Mecánico

## Visión General

El sistema ERP está diseñado con una arquitectura de tres capas que separa las responsabilidades en frontend, backend y base de datos.

## Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                       FRONTEND                           │
│                      (Next.js)                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │  Pages   │  │Components│  │  Styles  │             │
│  └──────────┘  └──────────┘  └──────────┘             │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTP/REST API
                      ▼
┌─────────────────────────────────────────────────────────┐
│                       BACKEND                            │
│                       (Flask)                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │   API    │  │ Business │  │   Auth   │             │
│  │ Routes   │  │  Logic   │  │          │             │
│  └──────────┘  └──────────┘  └──────────┘             │
└─────────────────────┬───────────────────────────────────┘
                      │ SQL Queries
                      ▼
┌─────────────────────────────────────────────────────────┐
│                     BASE DE DATOS                        │
│                   (MySQL/PostgreSQL)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ Clientes │  │Vehículos │  │ Órdenes  │             │
│  └──────────┘  └──────────┘  └──────────┘             │
└─────────────────────────────────────────────────────────┘
```

## Componentes del Sistema

### 1. Frontend (Next.js)

**Responsabilidades:**
- Interfaz de usuario
- Validación de entrada de datos
- Comunicación con el backend vía API REST
- Gestión del estado de la aplicación
- Renderizado de páginas y componentes

**Tecnologías:**
- Next.js 15+
- React 19+
- TypeScript
- Tailwind CSS
- Axios/Fetch para peticiones HTTP

**Estructura de Carpetas:**
```
frontend/
├── app/              # Rutas de la aplicación (App Router)
│   ├── page.tsx      # Página principal
│   ├── clientes/     # Módulo de clientes
│   ├── vehiculos/    # Módulo de vehículos
│   ├── ordenes/      # Módulo de órdenes
│   └── servicios/    # Módulo de servicios
├── components/       # Componentes reutilizables
├── lib/              # Utilidades y helpers
└── public/           # Archivos estáticos
```

### 2. Backend (Flask)

**Responsabilidades:**
- Lógica de negocio
- Validación de datos del servidor
- Autenticación y autorización
- Acceso a la base de datos
- Procesamiento de peticiones
- Generación de respuestas JSON

**Tecnologías:**
- Flask 3.0+
- Flask-CORS
- SQLAlchemy (ORM) - por implementar
- Flask-JWT-Extended (Auth) - por implementar
- Python 3.12+

**Estructura de Carpetas:**
```
backend/
├── app.py            # Aplicación principal
├── models/           # Modelos de datos (por crear)
├── routes/           # Rutas de la API (por crear)
├── services/         # Lógica de negocio (por crear)
└── utils/            # Utilidades (por crear)
```

### 3. Base de Datos

**Responsabilidades:**
- Almacenamiento persistente de datos
- Integridad referencial
- Consultas optimizadas
- Transacciones ACID

**Tecnología:**
- MySQL o PostgreSQL

**Modelo de Datos:**

```
clientes
├── id (PK)
├── nombre
├── apellido
├── telefono
├── email
└── direccion

vehiculos
├── id (PK)
├── cliente_id (FK)
├── marca
├── modelo
├── año
├── placa
└── kilometraje

servicios
├── id (PK)
├── nombre
├── descripcion
└── precio

ordenes_trabajo
├── id (PK)
├── vehiculo_id (FK)
├── fecha_ingreso
├── fecha_entrega_estimada
├── fecha_entrega_real
├── estado
├── observaciones
└── total

orden_detalle
├── id (PK)
├── orden_id (FK)
├── servicio_id (FK)
├── cantidad
├── precio_unitario
└── subtotal
```

## Flujo de Datos

### Ejemplo: Crear una Orden de Trabajo

1. **Usuario en Frontend:** Ingresa datos de la orden en el formulario
2. **Validación Frontend:** Valida formato de datos antes de enviar
3. **Petición HTTP:** POST a `/api/ordenes` con datos JSON
4. **Backend - Validación:** Valida datos recibidos
5. **Backend - Lógica:** Procesa la orden, calcula totales
6. **Base de Datos:** Inserta registros en `ordenes_trabajo` y `orden_detalle`
7. **Respuesta:** Backend retorna orden creada con ID
8. **Frontend:** Actualiza UI con la nueva orden

## Seguridad

### Medidas Implementadas
- CORS configurado para desarrollo
- Validación de entrada en frontend y backend

### Por Implementar
- Autenticación JWT
- Encriptación de contraseñas
- Rate limiting
- Sanitización de entrada SQL
- HTTPS en producción
- Gestión de sesiones

## Escalabilidad

### Consideraciones Actuales
- Arquitectura modular y desacoplada
- API RESTful para fácil integración

### Futuras Mejoras
- Implementar caché (Redis)
- Balanceo de carga
- Microservicios para módulos específicos
- CDN para assets estáticos
- Réplicas de base de datos

## Despliegue

### Desarrollo
- Frontend: `npm run dev` en puerto 3000
- Backend: `python app.py` en puerto 5000
- Base de datos: MySQL/PostgreSQL local

### Producción (Planeado)
- Frontend: Vercel o similar
- Backend: Heroku, AWS, o DigitalOcean
- Base de datos: Managed database service

## Monitoreo y Logging

*Por implementar*

- Logs de aplicación
- Monitoreo de performance
- Alertas de errores
- Métricas de uso

## Testing

*Por implementar*

- Unit tests (Jest para frontend, pytest para backend)
- Integration tests
- End-to-end tests (Playwright)
- API tests (Postman/Newman)
