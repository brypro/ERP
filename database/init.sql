-- Script de inicialización de base de datos PostgreSQL
-- ERP Taller Mecánico

-- Crear base de datos (ejecutar como superusuario postgres)
-- CREATE DATABASE erp_taller_mecanico;
-- \c erp_taller_mecanico;

-- Tabla de clientes
CREATE TABLE IF NOT EXISTS clientes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(100),
    direccion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger para actualizar fecha_actualizacion automáticamente
CREATE OR REPLACE FUNCTION update_fecha_actualizacion()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_clientes_actualizacion
BEFORE UPDATE ON clientes
FOR EACH ROW
EXECUTE FUNCTION update_fecha_actualizacion();

-- Tabla de vehículos
CREATE TABLE IF NOT EXISTS vehiculos (
    id SERIAL PRIMARY KEY,
    cliente_id INT NOT NULL,
    marca VARCHAR(50) NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    año INT,
    placa VARCHAR(20) UNIQUE NOT NULL,
    kilometraje INT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
);

CREATE TRIGGER trigger_vehiculos_actualizacion
BEFORE UPDATE ON vehiculos
FOR EACH ROW
EXECUTE FUNCTION update_fecha_actualizacion();

-- Tabla de servicios
CREATE TABLE IF NOT EXISTS servicios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trigger_servicios_actualizacion
BEFORE UPDATE ON servicios
FOR EACH ROW
EXECUTE FUNCTION update_fecha_actualizacion();

-- Tipo para estados de órdenes de trabajo
CREATE TYPE estado_orden AS ENUM ('pendiente', 'en_proceso', 'completado', 'entregado');

-- Tabla de órdenes de trabajo
CREATE TABLE IF NOT EXISTS ordenes_trabajo (
    id SERIAL PRIMARY KEY,
    vehiculo_id INT NOT NULL,
    fecha_ingreso DATE NOT NULL,
    fecha_entrega_estimada DATE,
    fecha_entrega_real DATE,
    estado estado_orden DEFAULT 'pendiente',
    observaciones TEXT,
    total DECIMAL(10, 2) DEFAULT 0,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id) ON DELETE CASCADE
);

CREATE TRIGGER trigger_ordenes_actualizacion
BEFORE UPDATE ON ordenes_trabajo
FOR EACH ROW
EXECUTE FUNCTION update_fecha_actualizacion();

-- Tabla de detalle de órdenes (servicios aplicados)
CREATE TABLE IF NOT EXISTS orden_detalle (
    id SERIAL PRIMARY KEY,
    orden_id INT NOT NULL,
    servicio_id INT NOT NULL,
    cantidad INT DEFAULT 1,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (orden_id) REFERENCES ordenes_trabajo(id) ON DELETE CASCADE,
    FOREIGN KEY (servicio_id) REFERENCES servicios(id) ON DELETE CASCADE
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_cliente_nombre ON clientes(nombre, apellido);
CREATE INDEX IF NOT EXISTS idx_vehiculo_placa ON vehiculos(placa);
CREATE INDEX IF NOT EXISTS idx_orden_estado ON ordenes_trabajo(estado);
CREATE INDEX IF NOT EXISTS idx_orden_fecha_ingreso ON ordenes_trabajo(fecha_ingreso);
