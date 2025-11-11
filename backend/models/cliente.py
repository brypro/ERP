from utils.database import execute_query, execute_one, get_db_cursor

class Cliente:
    """Modelo para gestionar clientes del taller"""

    @staticmethod
    def get_all():
        """Obtiene todos los clientes"""
        query = """
            SELECT id, nombre, apellido, telefono, email, direccion,
                   fecha_creacion, fecha_actualizacion
            FROM clientes
            ORDER BY nombre, apellido
        """
        return execute_query(query)

    @staticmethod
    def get_by_id(cliente_id):
        """Obtiene un cliente por su ID"""
        query = """
            SELECT id, nombre, apellido, telefono, email, direccion,
                   fecha_creacion, fecha_actualizacion
            FROM clientes
            WHERE id = %s
        """
        return execute_one(query, (cliente_id,))

    @staticmethod
    def create(data):
        """Crea un nuevo cliente"""
        query = """
            INSERT INTO clientes (nombre, apellido, telefono, email, direccion)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id, nombre, apellido, telefono, email, direccion,
                      fecha_creacion, fecha_actualizacion
        """
        with get_db_cursor(commit=True) as cursor:
            cursor.execute(query, (
                data.get('nombre'),
                data.get('apellido'),
                data.get('telefono'),
                data.get('email'),
                data.get('direccion')
            ))
            return cursor.fetchone()

    @staticmethod
    def update(cliente_id, data):
        """Actualiza un cliente existente"""
        query = """
            UPDATE clientes
            SET nombre = %s,
                apellido = %s,
                telefono = %s,
                email = %s,
                direccion = %s
            WHERE id = %s
            RETURNING id, nombre, apellido, telefono, email, direccion,
                      fecha_creacion, fecha_actualizacion
        """
        with get_db_cursor(commit=True) as cursor:
            cursor.execute(query, (
                data.get('nombre'),
                data.get('apellido'),
                data.get('telefono'),
                data.get('email'),
                data.get('direccion'),
                cliente_id
            ))
            return cursor.fetchone()

    @staticmethod
    def delete(cliente_id):
        """Elimina un cliente"""
        query = "DELETE FROM clientes WHERE id = %s"
        with get_db_cursor(commit=True) as cursor:
            cursor.execute(query, (cliente_id,))
            return cursor.rowcount > 0

    @staticmethod
    def search(term):
        """Busca clientes por nombre, apellido, teléfono o email"""
        query = """
            SELECT id, nombre, apellido, telefono, email, direccion,
                   fecha_creacion, fecha_actualizacion
            FROM clientes
            WHERE nombre ILIKE %s
               OR apellido ILIKE %s
               OR telefono ILIKE %s
               OR email ILIKE %s
            ORDER BY nombre, apellido
        """
        search_term = f"%{term}%"
        return execute_query(query, (search_term, search_term, search_term, search_term))
