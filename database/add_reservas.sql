-- Script para agregar tabla de reservas
-- Ejecutar con: psql -U anahuel -d erp_taller_mecanico -f add_reservas.sql

-- Tipo para estados de reservas (solo si no existe)
DO $$ BEGIN
    CREATE TYPE estado_reserva AS ENUM ('pendiente', 'confirmada', 'cancelada', 'completada');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Tabla de reservas/citas
CREATE TABLE IF NOT EXISTS reservas (
    id SERIAL PRIMARY KEY,
    cliente_id INT NOT NULL,
    vehiculo_id INT NOT NULL,
    fecha_reserva DATE NOT NULL,
    hora_reserva TIME NOT NULL,
    servicio_solicitado VARCHAR(200),
    estado estado_reserva DEFAULT 'pendiente',
    observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
    FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id) ON DELETE CASCADE
);

-- Trigger para actualizar fecha_actualizacion
CREATE TRIGGER trigger_reservas_actualizacion
BEFORE UPDATE ON reservas
FOR EACH ROW
EXECUTE FUNCTION update_fecha_actualizacion();

-- Índice para mejorar búsquedas por fecha
CREATE INDEX IF NOT EXISTS idx_reserva_fecha ON reservas(fecha_reserva, hora_reserva);
CREATE INDEX IF NOT EXISTS idx_reserva_estado ON reservas(estado);

-- Datos de ejemplo
INSERT INTO reservas (cliente_id, vehiculo_id, fecha_reserva, hora_reserva, servicio_solicitado, estado, observaciones) VALUES
(1, 1, '2025-11-12', '09:00:00', 'Cambio de aceite y filtros', 'confirmada', 'Cliente prefiere la mañana'),
(2, 3, '2025-11-13', '14:00:00', 'Revisión general', 'pendiente', 'Primera revisión del año'),
(3, 4, '2025-11-14', '10:30:00', 'Reparación de frenos', 'confirmada', 'Urgente - Cliente reporta ruidos'),
(1, 2, '2025-11-15', '11:00:00', 'Alineación y balanceo', 'pendiente', NULL);

SELECT 'Tabla de reservas creada exitosamente!' as mensaje;
