# API Documentation - ERP Taller Mecánico

## Base URL
```
http://localhost:5000
```

## Endpoints

### General

#### GET /
Información general de la API

**Response:**
```json
{
  "message": "ERP API - Taller Mecánico",
  "status": "active"
}
```

#### GET /api/health
Estado de salud de la API

**Response:**
```json
{
  "status": "healthy"
}
```

---

## Próximos Endpoints (En Desarrollo)

### Clientes

#### GET /api/clientes
Obtener lista de todos los clientes

#### GET /api/clientes/:id
Obtener un cliente específico

#### POST /api/clientes
Crear un nuevo cliente

**Request Body:**
```json
{
  "nombre": "string",
  "apellido": "string",
  "telefono": "string",
  "email": "string",
  "direccion": "string"
}
```

#### PUT /api/clientes/:id
Actualizar un cliente existente

#### DELETE /api/clientes/:id
Eliminar un cliente

---

### Vehículos

#### GET /api/vehiculos
Obtener lista de todos los vehículos

#### GET /api/vehiculos/:id
Obtener un vehículo específico

#### GET /api/clientes/:id/vehiculos
Obtener vehículos de un cliente específico

#### POST /api/vehiculos
Crear un nuevo vehículo

**Request Body:**
```json
{
  "cliente_id": "number",
  "marca": "string",
  "modelo": "string",
  "año": "number",
  "placa": "string",
  "kilometraje": "number"
}
```

#### PUT /api/vehiculos/:id
Actualizar un vehículo existente

#### DELETE /api/vehiculos/:id
Eliminar un vehículo

---

### Servicios

#### GET /api/servicios
Obtener lista de todos los servicios

#### GET /api/servicios/:id
Obtener un servicio específico

#### POST /api/servicios
Crear un nuevo servicio

**Request Body:**
```json
{
  "nombre": "string",
  "descripcion": "string",
  "precio": "number"
}
```

#### PUT /api/servicios/:id
Actualizar un servicio existente

#### DELETE /api/servicios/:id
Eliminar un servicio

---

### Órdenes de Trabajo

#### GET /api/ordenes
Obtener lista de todas las órdenes de trabajo

**Query Parameters:**
- `estado` - Filtrar por estado (pendiente, en_proceso, completado, entregado)
- `fecha_inicio` - Fecha de inicio del rango
- `fecha_fin` - Fecha fin del rango

#### GET /api/ordenes/:id
Obtener una orden de trabajo específica con detalles

#### POST /api/ordenes
Crear una nueva orden de trabajo

**Request Body:**
```json
{
  "vehiculo_id": "number",
  "fecha_ingreso": "date",
  "fecha_entrega_estimada": "date",
  "observaciones": "string",
  "servicios": [
    {
      "servicio_id": "number",
      "cantidad": "number"
    }
  ]
}
```

#### PUT /api/ordenes/:id
Actualizar una orden de trabajo

#### PATCH /api/ordenes/:id/estado
Actualizar el estado de una orden

**Request Body:**
```json
{
  "estado": "pendiente | en_proceso | completado | entregado"
}
```

#### DELETE /api/ordenes/:id
Eliminar una orden de trabajo

---

## Códigos de Estado HTTP

- `200 OK` - Solicitud exitosa
- `201 Created` - Recurso creado exitosamente
- `400 Bad Request` - Datos de entrada inválidos
- `404 Not Found` - Recurso no encontrado
- `500 Internal Server Error` - Error del servidor

## Autenticación

*Por implementar*

Se planea implementar autenticación JWT para proteger los endpoints.

## Rate Limiting

*Por implementar*

Se planea implementar límites de tasa para prevenir abuso de la API.

## CORS

La API tiene CORS habilitado para permitir solicitudes desde el frontend en desarrollo.
