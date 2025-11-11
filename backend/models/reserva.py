from utils.database import execute_query, execute_one

class Reserva:
    """Modelo para la gestión de reservas/citas"""

    @staticmethod
    def get_all():
        """Obtiene todas las reservas con información del cliente y vehículo"""
        query = """
            SELECT r.id, r.cliente_id, r.vehiculo_id, r.fecha_reserva,
                   r.hora_reserva::text as hora_reserva,
                   r.servicio_solicitado, r.estado, r.observaciones,
                   r.fecha_creacion, r.fecha_actualizacion,
                   c.nombre as cliente_nombre, c.apellido as cliente_apellido,
                   c.telefono as cliente_telefono,
                   v.marca as vehiculo_marca, v.modelo as vehiculo_modelo,
                   v.placa as vehiculo_placa
            FROM reservas r
            LEFT JOIN clientes c ON r.cliente_id = c.id
            LEFT JOIN vehiculos v ON r.vehiculo_id = v.id
            ORDER BY r.fecha_reserva DESC, r.hora_reserva DESC
        """
        return execute_query(query)

    @staticmethod
    def get_by_id(reserva_id):
        """Obtiene una reserva específica por ID con información completa"""
        query = """
            SELECT r.id, r.cliente_id, r.vehiculo_id, r.fecha_reserva,
                   r.hora_reserva::text as hora_reserva,
                   r.servicio_solicitado, r.estado, r.observaciones,
                   r.fecha_creacion, r.fecha_actualizacion,
                   c.nombre as cliente_nombre, c.apellido as cliente_apellido,
                   c.telefono as cliente_telefono,
                   v.marca as vehiculo_marca, v.modelo as vehiculo_modelo,
                   v.placa as vehiculo_placa
            FROM reservas r
            LEFT JOIN clientes c ON r.cliente_id = c.id
            LEFT JOIN vehiculos v ON r.vehiculo_id = v.id
            WHERE r.id = %s
        """
        return execute_one(query, (reserva_id,))

    @staticmethod
    def get_by_cliente(cliente_id):
        """Obtiene todas las reservas de un cliente específico"""
        query = """
            SELECT r.id, r.cliente_id, r.vehiculo_id, r.fecha_reserva,
                   r.hora_reserva::text as hora_reserva,
                   r.servicio_solicitado, r.estado, r.observaciones,
                   r.fecha_creacion, r.fecha_actualizacion,
                   c.nombre as cliente_nombre, c.apellido as cliente_apellido,
                   c.telefono as cliente_telefono,
                   v.marca as vehiculo_marca, v.modelo as vehiculo_modelo,
                   v.placa as vehiculo_placa
            FROM reservas r
            LEFT JOIN clientes c ON r.cliente_id = c.id
            LEFT JOIN vehiculos v ON r.vehiculo_id = v.id
            WHERE r.cliente_id = %s
            ORDER BY r.fecha_reserva DESC, r.hora_reserva DESC
        """
        return execute_query(query, (cliente_id,))

    @staticmethod
    def get_by_fecha(fecha):
        """Obtiene todas las reservas de una fecha específica"""
        query = """
            SELECT r.id, r.cliente_id, r.vehiculo_id, r.fecha_reserva,
                   r.hora_reserva::text as hora_reserva,
                   r.servicio_solicitado, r.estado, r.observaciones,
                   r.fecha_creacion, r.fecha_actualizacion,
                   c.nombre as cliente_nombre, c.apellido as cliente_apellido,
                   c.telefono as cliente_telefono,
                   v.marca as vehiculo_marca, v.modelo as vehiculo_modelo,
                   v.placa as vehiculo_placa
            FROM reservas r
            LEFT JOIN clientes c ON r.cliente_id = c.id
            LEFT JOIN vehiculos v ON r.vehiculo_id = v.id
            WHERE r.fecha_reserva = %s
            ORDER BY r.hora_reserva ASC
        """
        return execute_query(query, (fecha,))

    @staticmethod
    def get_by_estado(estado):
        """Obtiene todas las reservas con un estado específico"""
        query = """
            SELECT r.id, r.cliente_id, r.vehiculo_id, r.fecha_reserva,
                   r.hora_reserva::text as hora_reserva,
                   r.servicio_solicitado, r.estado, r.observaciones,
                   r.fecha_creacion, r.fecha_actualizacion,
                   c.nombre as cliente_nombre, c.apellido as cliente_apellido,
                   c.telefono as cliente_telefono,
                   v.marca as vehiculo_marca, v.modelo as vehiculo_modelo,
                   v.placa as vehiculo_placa
            FROM reservas r
            LEFT JOIN clientes c ON r.cliente_id = c.id
            LEFT JOIN vehiculos v ON r.vehiculo_id = v.id
            WHERE r.estado = %s
            ORDER BY r.fecha_reserva DESC, r.hora_reserva DESC
        """
        return execute_query(query, (estado,))

    @staticmethod
    def search(search_term):
        """Busca reservas por cliente, vehículo o servicio"""
        query = """
            SELECT r.id, r.cliente_id, r.vehiculo_id, r.fecha_reserva,
                   r.hora_reserva::text as hora_reserva,
                   r.servicio_solicitado, r.estado, r.observaciones,
                   r.fecha_creacion, r.fecha_actualizacion,
                   c.nombre as cliente_nombre, c.apellido as cliente_apellido,
                   c.telefono as cliente_telefono,
                   v.marca as vehiculo_marca, v.modelo as vehiculo_modelo,
                   v.placa as vehiculo_placa
            FROM reservas r
            LEFT JOIN clientes c ON r.cliente_id = c.id
            LEFT JOIN vehiculos v ON r.vehiculo_id = v.id
            WHERE c.nombre ILIKE %s
               OR c.apellido ILIKE %s
               OR v.placa ILIKE %s
               OR v.marca ILIKE %s
               OR v.modelo ILIKE %s
               OR r.servicio_solicitado ILIKE %s
            ORDER BY r.fecha_reserva DESC, r.hora_reserva DESC
        """
        search_pattern = f'%{search_term}%'
        return execute_query(query, (search_pattern,) * 6)

    @staticmethod
    def create(data):
        """Crea una nueva reserva"""
        query = """
            INSERT INTO reservas (cliente_id, vehiculo_id, fecha_reserva, hora_reserva,
                                servicio_solicitado, estado, observaciones)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING id, cliente_id, vehiculo_id, fecha_reserva,
                      hora_reserva::text as hora_reserva,
                      servicio_solicitado, estado, observaciones,
                      fecha_creacion, fecha_actualizacion
        """
        result = execute_one(query, (
            data.get('cliente_id'),
            data.get('vehiculo_id'),
            data.get('fecha_reserva'),
            data.get('hora_reserva'),
            data.get('servicio_solicitado'),
            data.get('estado', 'pendiente'),
            data.get('observaciones')
        ))
        return result

    @staticmethod
    def update(reserva_id, data):
        """Actualiza una reserva existente"""
        query = """
            UPDATE reservas
            SET cliente_id = %s,
                vehiculo_id = %s,
                fecha_reserva = %s,
                hora_reserva = %s,
                servicio_solicitado = %s,
                estado = %s,
                observaciones = %s
            WHERE id = %s
            RETURNING id, cliente_id, vehiculo_id, fecha_reserva,
                      hora_reserva::text as hora_reserva,
                      servicio_solicitado, estado, observaciones,
                      fecha_creacion, fecha_actualizacion
        """
        result = execute_one(query, (
            data.get('cliente_id'),
            data.get('vehiculo_id'),
            data.get('fecha_reserva'),
            data.get('hora_reserva'),
            data.get('servicio_solicitado'),
            data.get('estado'),
            data.get('observaciones'),
            reserva_id
        ))
        return result

    @staticmethod
    def delete(reserva_id):
        """Elimina una reserva"""
        query = "DELETE FROM reservas WHERE id = %s"
        execute_query(query, (reserva_id,), fetch=False)
        return True
