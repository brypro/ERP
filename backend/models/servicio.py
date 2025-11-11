from utils.database import execute_query, execute_one

class Servicio:
    """Modelo para la gestión del catálogo de servicios"""

    @staticmethod
    def get_all():
        """Obtiene todos los servicios"""
        query = """
            SELECT id, nombre, descripcion, precio,
                   fecha_creacion, fecha_actualizacion
            FROM servicios
            ORDER BY nombre ASC
        """
        return execute_query(query)

    @staticmethod
    def get_by_id(servicio_id):
        """Obtiene un servicio específico por ID"""
        query = """
            SELECT id, nombre, descripcion, precio,
                   fecha_creacion, fecha_actualizacion
            FROM servicios
            WHERE id = %s
        """
        return execute_one(query, (servicio_id,))

    @staticmethod
    def search(search_term):
        """Busca servicios por nombre o descripción"""
        query = """
            SELECT id, nombre, descripcion, precio,
                   fecha_creacion, fecha_actualizacion
            FROM servicios
            WHERE nombre ILIKE %s
               OR descripcion ILIKE %s
            ORDER BY nombre ASC
        """
        search_pattern = f'%{search_term}%'
        return execute_query(query, (search_pattern, search_pattern))

    @staticmethod
    def create(data):
        """Crea un nuevo servicio"""
        query = """
            INSERT INTO servicios (nombre, descripcion, precio)
            VALUES (%s, %s, %s)
            RETURNING id, nombre, descripcion, precio,
                      fecha_creacion, fecha_actualizacion
        """
        result = execute_one(query, (
            data.get('nombre'),
            data.get('descripcion'),
            data.get('precio')
        ))
        return result

    @staticmethod
    def update(servicio_id, data):
        """Actualiza un servicio existente"""
        query = """
            UPDATE servicios
            SET nombre = %s,
                descripcion = %s,
                precio = %s
            WHERE id = %s
            RETURNING id, nombre, descripcion, precio,
                      fecha_creacion, fecha_actualizacion
        """
        result = execute_one(query, (
            data.get('nombre'),
            data.get('descripcion'),
            data.get('precio'),
            servicio_id
        ))
        return result

    @staticmethod
    def delete(servicio_id):
        """Elimina un servicio"""
        query = "DELETE FROM servicios WHERE id = %s"
        execute_query(query, (servicio_id,), fetch=False)
        return True
