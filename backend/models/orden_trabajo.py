from utils.database import execute_query, execute_one, get_db_cursor

class OrdenTrabajo:
    """Modelo para la gestión de órdenes de trabajo"""

    @staticmethod
    def get_all():
        """Obtiene todas las órdenes con información del vehículo y cliente"""
        query = """
            SELECT o.id, o.vehiculo_id, o.fecha_ingreso, o.fecha_entrega_estimada,
                   o.fecha_entrega_real, o.estado, o.observaciones, o.total,
                   o.fecha_creacion, o.fecha_actualizacion,
                   v.marca as vehiculo_marca, v.modelo as vehiculo_modelo,
                   v.placa as vehiculo_placa, v.cliente_id,
                   c.nombre as cliente_nombre, c.apellido as cliente_apellido,
                   c.telefono as cliente_telefono
            FROM ordenes_trabajo o
            LEFT JOIN vehiculos v ON o.vehiculo_id = v.id
            LEFT JOIN clientes c ON v.cliente_id = c.id
            ORDER BY o.fecha_ingreso DESC
        """
        return execute_query(query)

    @staticmethod
    def get_by_id(orden_id):
        """Obtiene una orden específica con sus detalles"""
        query = """
            SELECT o.id, o.vehiculo_id, o.fecha_ingreso, o.fecha_entrega_estimada,
                   o.fecha_entrega_real, o.estado, o.observaciones, o.total,
                   o.fecha_creacion, o.fecha_actualizacion,
                   v.marca as vehiculo_marca, v.modelo as vehiculo_modelo,
                   v.placa as vehiculo_placa, v.cliente_id,
                   c.nombre as cliente_nombre, c.apellido as cliente_apellido,
                   c.telefono as cliente_telefono
            FROM ordenes_trabajo o
            LEFT JOIN vehiculos v ON o.vehiculo_id = v.id
            LEFT JOIN clientes c ON v.cliente_id = c.id
            WHERE o.id = %s
        """
        orden = execute_one(query, (orden_id,))

        if orden:
            # Obtener los detalles (servicios) de la orden
            orden['detalles'] = OrdenTrabajo.get_detalles(orden_id)

        return orden

    @staticmethod
    def get_detalles(orden_id):
        """Obtiene los detalles (servicios) de una orden"""
        query = """
            SELECT od.id, od.orden_id, od.servicio_id, od.cantidad,
                   od.precio_unitario, od.subtotal, od.fecha_creacion,
                   s.nombre as servicio_nombre, s.descripcion as servicio_descripcion
            FROM orden_detalle od
            LEFT JOIN servicios s ON od.servicio_id = s.id
            WHERE od.orden_id = %s
            ORDER BY od.id
        """
        return execute_query(query, (orden_id,))

    @staticmethod
    def get_by_vehiculo(vehiculo_id):
        """Obtiene todas las órdenes de un vehículo específico"""
        query = """
            SELECT o.id, o.vehiculo_id, o.fecha_ingreso, o.fecha_entrega_estimada,
                   o.fecha_entrega_real, o.estado, o.observaciones, o.total,
                   o.fecha_creacion, o.fecha_actualizacion,
                   v.marca as vehiculo_marca, v.modelo as vehiculo_modelo,
                   v.placa as vehiculo_placa, v.cliente_id,
                   c.nombre as cliente_nombre, c.apellido as cliente_apellido
            FROM ordenes_trabajo o
            LEFT JOIN vehiculos v ON o.vehiculo_id = v.id
            LEFT JOIN clientes c ON v.cliente_id = c.id
            WHERE o.vehiculo_id = %s
            ORDER BY o.fecha_ingreso DESC
        """
        return execute_query(query, (vehiculo_id,))

    @staticmethod
    def get_by_estado(estado):
        """Obtiene todas las órdenes con un estado específico"""
        query = """
            SELECT o.id, o.vehiculo_id, o.fecha_ingreso, o.fecha_entrega_estimada,
                   o.fecha_entrega_real, o.estado, o.observaciones, o.total,
                   o.fecha_creacion, o.fecha_actualizacion,
                   v.marca as vehiculo_marca, v.modelo as vehiculo_modelo,
                   v.placa as vehiculo_placa, v.cliente_id,
                   c.nombre as cliente_nombre, c.apellido as cliente_apellido
            FROM ordenes_trabajo o
            LEFT JOIN vehiculos v ON o.vehiculo_id = v.id
            LEFT JOIN clientes c ON v.cliente_id = c.id
            WHERE o.estado = %s
            ORDER BY o.fecha_ingreso DESC
        """
        return execute_query(query, (estado,))

    @staticmethod
    def search(search_term):
        """Busca órdenes por placa, cliente o estado"""
        query = """
            SELECT o.id, o.vehiculo_id, o.fecha_ingreso, o.fecha_entrega_estimada,
                   o.fecha_entrega_real, o.estado, o.observaciones, o.total,
                   o.fecha_creacion, o.fecha_actualizacion,
                   v.marca as vehiculo_marca, v.modelo as vehiculo_modelo,
                   v.placa as vehiculo_placa, v.cliente_id,
                   c.nombre as cliente_nombre, c.apellido as cliente_apellido
            FROM ordenes_trabajo o
            LEFT JOIN vehiculos v ON o.vehiculo_id = v.id
            LEFT JOIN clientes c ON v.cliente_id = c.id
            WHERE v.placa ILIKE %s
               OR c.nombre ILIKE %s
               OR c.apellido ILIKE %s
               OR CAST(o.id AS TEXT) ILIKE %s
            ORDER BY o.fecha_ingreso DESC
        """
        search_pattern = f'%{search_term}%'
        return execute_query(query, (search_pattern,) * 4)

    @staticmethod
    def create(data):
        """Crea una nueva orden de trabajo con sus detalles"""
        with get_db_cursor(commit=True) as cursor:
            # Crear la orden
            orden_query = """
                INSERT INTO ordenes_trabajo (vehiculo_id, fecha_ingreso, fecha_entrega_estimada,
                                            estado, observaciones, total)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING id, vehiculo_id, fecha_ingreso, fecha_entrega_estimada,
                          fecha_entrega_real, estado, observaciones, total,
                          fecha_creacion, fecha_actualizacion
            """
            cursor.execute(orden_query, (
                data.get('vehiculo_id'),
                data.get('fecha_ingreso'),
                data.get('fecha_entrega_estimada'),
                data.get('estado', 'pendiente'),
                data.get('observaciones'),
                data.get('total', 0)
            ))
            orden = cursor.fetchone()

            # Agregar detalles (servicios)
            detalles = data.get('detalles', [])
            if detalles:
                detalle_query = """
                    INSERT INTO orden_detalle (orden_id, servicio_id, cantidad,
                                             precio_unitario, subtotal)
                    VALUES (%s, %s, %s, %s, %s)
                """
                for detalle in detalles:
                    cursor.execute(detalle_query, (
                        orden['id'],
                        detalle.get('servicio_id'),
                        detalle.get('cantidad', 1),
                        detalle.get('precio_unitario'),
                        detalle.get('subtotal')
                    ))

            return orden

    @staticmethod
    def update(orden_id, data):
        """Actualiza una orden de trabajo"""
        query = """
            UPDATE ordenes_trabajo
            SET vehiculo_id = %s,
                fecha_ingreso = %s,
                fecha_entrega_estimada = %s,
                fecha_entrega_real = %s,
                estado = %s,
                observaciones = %s,
                total = %s
            WHERE id = %s
            RETURNING id, vehiculo_id, fecha_ingreso, fecha_entrega_estimada,
                      fecha_entrega_real, estado, observaciones, total,
                      fecha_creacion, fecha_actualizacion
        """
        result = execute_one(query, (
            data.get('vehiculo_id'),
            data.get('fecha_ingreso'),
            data.get('fecha_entrega_estimada'),
            data.get('fecha_entrega_real'),
            data.get('estado'),
            data.get('observaciones'),
            data.get('total'),
            orden_id
        ))
        return result

    @staticmethod
    def add_detalle(orden_id, detalle_data):
        """Agrega un servicio a una orden existente"""
        query = """
            INSERT INTO orden_detalle (orden_id, servicio_id, cantidad,
                                     precio_unitario, subtotal)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id, orden_id, servicio_id, cantidad, precio_unitario, subtotal
        """
        result = execute_one(query, (
            orden_id,
            detalle_data.get('servicio_id'),
            detalle_data.get('cantidad', 1),
            detalle_data.get('precio_unitario'),
            detalle_data.get('subtotal')
        ))
        return result

    @staticmethod
    def delete_detalle(detalle_id):
        """Elimina un servicio de una orden"""
        query = "DELETE FROM orden_detalle WHERE id = %s"
        execute_query(query, (detalle_id,), fetch=False)
        return True

    @staticmethod
    def delete(orden_id):
        """Elimina una orden de trabajo (los detalles se eliminan en cascada)"""
        query = "DELETE FROM ordenes_trabajo WHERE id = %s"
        execute_query(query, (orden_id,), fetch=False)
        return True
