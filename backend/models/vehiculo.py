from utils.database import execute_query, execute_one, get_db_cursor

class Vehiculo:
    """Modelo para gestionar vehículos del taller"""

    @staticmethod
    def get_all():
        """Obtiene todos los vehículos con información del cliente"""
        query = """
            SELECT v.id, v.cliente_id, v.marca, v.modelo, v.año, v.placa, v.kilometraje,
                   v.fecha_creacion, v.fecha_actualizacion,
                   c.nombre as cliente_nombre, c.apellido as cliente_apellido
            FROM vehiculos v
            LEFT JOIN clientes c ON v.cliente_id = c.id
            ORDER BY v.id DESC
        """
        return execute_query(query)

    @staticmethod
    def get_by_id(vehiculo_id):
        """Obtiene un vehículo por su ID con información del cliente"""
        query = """
            SELECT v.id, v.cliente_id, v.marca, v.modelo, v.año, v.placa, v.kilometraje,
                   v.fecha_creacion, v.fecha_actualizacion,
                   c.nombre as cliente_nombre, c.apellido as cliente_apellido
            FROM vehiculos v
            LEFT JOIN clientes c ON v.cliente_id = c.id
            WHERE v.id = %s
        """
        return execute_one(query, (vehiculo_id,))

    @staticmethod
    def get_by_cliente(cliente_id):
        """Obtiene todos los vehículos de un cliente específico"""
        query = """
            SELECT v.id, v.cliente_id, v.marca, v.modelo, v.año, v.placa, v.kilometraje,
                   v.fecha_creacion, v.fecha_actualizacion
            FROM vehiculos v
            WHERE v.cliente_id = %s
            ORDER BY v.id DESC
        """
        return execute_query(query, (cliente_id,))

    @staticmethod
    def create(data):
        """Crea un nuevo vehículo"""
        query = """
            INSERT INTO vehiculos (cliente_id, marca, modelo, año, placa, kilometraje)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING id, cliente_id, marca, modelo, año, placa, kilometraje,
                      fecha_creacion, fecha_actualizacion
        """
        with get_db_cursor(commit=True) as cursor:
            cursor.execute(query, (
                data.get('cliente_id'),
                data.get('marca'),
                data.get('modelo'),
                data.get('año'),
                data.get('placa'),
                data.get('kilometraje', 0)
            ))
            return cursor.fetchone()

    @staticmethod
    def update(vehiculo_id, data):
        """Actualiza un vehículo existente"""
        query = """
            UPDATE vehiculos
            SET cliente_id = %s,
                marca = %s,
                modelo = %s,
                año = %s,
                placa = %s,
                kilometraje = %s
            WHERE id = %s
            RETURNING id, cliente_id, marca, modelo, año, placa, kilometraje,
                      fecha_creacion, fecha_actualizacion
        """
        with get_db_cursor(commit=True) as cursor:
            cursor.execute(query, (
                data.get('cliente_id'),
                data.get('marca'),
                data.get('modelo'),
                data.get('año'),
                data.get('placa'),
                data.get('kilometraje'),
                vehiculo_id
            ))
            return cursor.fetchone()

    @staticmethod
    def delete(vehiculo_id):
        """Elimina un vehículo"""
        query = "DELETE FROM vehiculos WHERE id = %s"
        with get_db_cursor(commit=True) as cursor:
            cursor.execute(query, (vehiculo_id,))
            return cursor.rowcount > 0

    @staticmethod
    def search(term):
        """Busca vehículos por placa, marca o modelo"""
        query = """
            SELECT v.id, v.cliente_id, v.marca, v.modelo, v.año, v.placa, v.kilometraje,
                   v.fecha_creacion, v.fecha_actualizacion,
                   c.nombre as cliente_nombre, c.apellido as cliente_apellido
            FROM vehiculos v
            LEFT JOIN clientes c ON v.cliente_id = c.id
            WHERE v.placa ILIKE %s
               OR v.marca ILIKE %s
               OR v.modelo ILIKE %s
            ORDER BY v.id DESC
        """
        search_term = f"%{term}%"
        return execute_query(query, (search_term, search_term, search_term))
