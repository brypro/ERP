-- Datos de ejemplo para el sistema ERP
-- ERP Taller Mecánico

-- Insertar clientes de ejemplo
INSERT INTO clientes (nombre, apellido, telefono, email, direccion) VALUES
('Juan', 'Pérez', '555-0101', 'juan.perez@email.com', 'Calle Principal 123'),
('María', 'González', '555-0102', 'maria.gonzalez@email.com', 'Avenida Central 456'),
('Carlos', 'Rodríguez', '555-0103', 'carlos.rodriguez@email.com', 'Boulevard Norte 789');

-- Insertar vehículos de ejemplo
INSERT INTO vehiculos (cliente_id, marca, modelo, año, placa, kilometraje) VALUES
(1, 'Toyota', 'Corolla', 2020, 'ABC-123', 45000),
(1, 'Honda', 'Civic', 2019, 'DEF-456', 52000),
(2, 'Ford', 'Focus', 2021, 'GHI-789', 30000),
(3, 'Chevrolet', 'Spark', 2018, 'JKL-012', 68000);

-- Insertar servicios de ejemplo
INSERT INTO servicios (nombre, descripcion, precio) VALUES
('Cambio de Aceite', 'Cambio de aceite de motor y filtro', 45.00),
('Alineación y Balanceo', 'Alineación de dirección y balanceo de llantas', 60.00),
('Revisión de Frenos', 'Revisión completa del sistema de frenos', 80.00),
('Cambio de Llantas', 'Cambio de juego de llantas', 300.00),
('Mantenimiento General', 'Mantenimiento preventivo general del vehículo', 120.00);

-- Insertar órdenes de trabajo de ejemplo
INSERT INTO ordenes_trabajo (vehiculo_id, fecha_ingreso, fecha_entrega_estimada, estado, observaciones, total) VALUES
(1, '2024-01-15', '2024-01-16', 'completado', 'Cliente solicita revisión completa', 165.00),
(2, '2024-01-20', '2024-01-21', 'en_proceso', 'Cambio de aceite programado', 45.00),
(3, '2024-01-22', '2024-01-23', 'pendiente', 'Alineación necesaria', 60.00);

-- Insertar detalles de órdenes
INSERT INTO orden_detalle (orden_id, servicio_id, cantidad, precio_unitario, subtotal) VALUES
(1, 1, 1, 45.00, 45.00),
(1, 5, 1, 120.00, 120.00),
(2, 1, 1, 45.00, 45.00),
(3, 2, 1, 60.00, 60.00);
