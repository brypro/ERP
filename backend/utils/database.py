import psycopg
from psycopg.rows import dict_row
import os
from contextlib import contextmanager

# Obtener configuración de la base de datos desde variables de entorno
DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/erp_taller_mecanico')

def get_db_connection():
    """Crea una conexión a la base de datos PostgreSQL"""
    try:
        conn = psycopg.connect(DATABASE_URL, row_factory=dict_row)
        return conn
    except psycopg.Error as e:
        print(f"Error conectando a la base de datos: {e}")
        raise

@contextmanager
def get_db_cursor(commit=False):
    """
    Context manager para manejar conexiones y cursores de base de datos.

    Args:
        commit: Si es True, hace commit automáticamente al salir del contexto

    Usage:
        with get_db_cursor(commit=True) as cursor:
            cursor.execute("INSERT INTO ...")
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        yield cursor
        if commit:
            conn.commit()
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()
        conn.close()

def execute_query(query, params=None, fetch=True):
    """
    Ejecuta una consulta SQL y retorna los resultados.

    Args:
        query: La consulta SQL a ejecutar
        params: Parámetros para la consulta (opcional)
        fetch: Si es True, retorna los resultados. Si es False, solo ejecuta.

    Returns:
        Lista de diccionarios con los resultados (si fetch=True)
    """
    with get_db_cursor(commit=not fetch) as cursor:
        cursor.execute(query, params or ())
        if fetch:
            return cursor.fetchall()
        return None

def execute_one(query, params=None):
    """
    Ejecuta una consulta y retorna un solo resultado.

    Args:
        query: La consulta SQL a ejecutar
        params: Parámetros para la consulta (opcional)

    Returns:
        Diccionario con el resultado o None
    """
    with get_db_cursor() as cursor:
        cursor.execute(query, params or ())
        return cursor.fetchone()
