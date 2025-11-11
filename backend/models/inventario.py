from utils.database import execute_query, execute_one

class Inventario:
    """Modelo para la gestión de inventario (repuestos y productos)"""

    @staticmethod
    def get_all():
        """Obtiene todos los productos del inventario"""
        query = """
            SELECT id, codigo, nombre, descripcion, categoria,
                   stock_actual, stock_minimo, precio_compra, precio_venta,
                   ubicacion, fecha_creacion, fecha_actualizacion
            FROM inventario
            ORDER BY nombre ASC
        """
        return execute_query(query)

    @staticmethod
    def get_by_id(producto_id):
        """Obtiene un producto específico por ID"""
        query = """
            SELECT id, codigo, nombre, descripcion, categoria,
                   stock_actual, stock_minimo, precio_compra, precio_venta,
                   ubicacion, fecha_creacion, fecha_actualizacion
            FROM inventario
            WHERE id = %s
        """
        return execute_one(query, (producto_id,))

    @staticmethod
    def get_by_codigo(codigo):
        """Obtiene un producto por su código/SKU"""
        query = """
            SELECT id, codigo, nombre, descripcion, categoria,
                   stock_actual, stock_minimo, precio_compra, precio_venta,
                   ubicacion, fecha_creacion, fecha_actualizacion
            FROM inventario
            WHERE codigo = %s
        """
        return execute_one(query, (codigo,))

    @staticmethod
    def get_by_categoria(categoria):
        """Obtiene productos de una categoría específica"""
        query = """
            SELECT id, codigo, nombre, descripcion, categoria,
                   stock_actual, stock_minimo, precio_compra, precio_venta,
                   ubicacion, fecha_creacion, fecha_actualizacion
            FROM inventario
            WHERE categoria = %s
            ORDER BY nombre ASC
        """
        return execute_query(query, (categoria,))

    @staticmethod
    def get_low_stock():
        """Obtiene productos con stock bajo (menor o igual al mínimo)"""
        query = """
            SELECT id, codigo, nombre, descripcion, categoria,
                   stock_actual, stock_minimo, precio_compra, precio_venta,
                   ubicacion, fecha_creacion, fecha_actualizacion
            FROM inventario
            WHERE stock_actual <= stock_minimo
            ORDER BY stock_actual ASC
        """
        return execute_query(query)

    @staticmethod
    def search(search_term):
        """Busca productos por código, nombre, descripción o categoría"""
        query = """
            SELECT id, codigo, nombre, descripcion, categoria,
                   stock_actual, stock_minimo, precio_compra, precio_venta,
                   ubicacion, fecha_creacion, fecha_actualizacion
            FROM inventario
            WHERE codigo ILIKE %s
               OR nombre ILIKE %s
               OR descripcion ILIKE %s
               OR categoria ILIKE %s
            ORDER BY nombre ASC
        """
        search_pattern = f'%{search_term}%'
        return execute_query(query, (search_pattern,) * 4)

    @staticmethod
    def create(data):
        """Crea un nuevo producto en el inventario"""
        query = """
            INSERT INTO inventario (codigo, nombre, descripcion, categoria,
                                   stock_actual, stock_minimo, precio_compra,
                                   precio_venta, ubicacion)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id, codigo, nombre, descripcion, categoria,
                     stock_actual, stock_minimo, precio_compra, precio_venta,
                     ubicacion, fecha_creacion, fecha_actualizacion
        """
        return execute_one(query, (
            data.get('codigo'),
            data.get('nombre'),
            data.get('descripcion'),
            data.get('categoria'),
            data.get('stock_actual', 0),
            data.get('stock_minimo', 0),
            data.get('precio_compra', 0),
            data.get('precio_venta', 0),
            data.get('ubicacion')
        ))

    @staticmethod
    def update(producto_id, data):
        """Actualiza un producto del inventario (solo campos proporcionados)"""
        allowed_fields = [
            'codigo', 'nombre', 'descripcion', 'categoria',
            'stock_actual', 'stock_minimo', 'precio_compra',
            'precio_venta', 'ubicacion'
        ]

        update_fields = []
        values = []
        for field in allowed_fields:
            if field in data:
                update_fields.append(f"{field} = %s")
                values.append(data[field])

        if not update_fields:
            return Inventario.get_by_id(producto_id)

        values.append(producto_id)

        query = f"""
            UPDATE inventario
            SET {', '.join(update_fields)}
            WHERE id = %s
            RETURNING id, codigo, nombre, descripcion, categoria,
                     stock_actual, stock_minimo, precio_compra, precio_venta,
                     ubicacion, fecha_creacion, fecha_actualizacion
        """
        return execute_one(query, tuple(values))

    @staticmethod
    def adjust_stock(producto_id, cantidad, tipo='ajuste'):
        """
        Ajusta el stock de un producto
        tipo: 'entrada', 'salida', 'ajuste'
        """
        if tipo == 'entrada':
            query = """
                UPDATE inventario
                SET stock_actual = stock_actual + %s
                WHERE id = %s
                RETURNING id, codigo, nombre, stock_actual
            """
        elif tipo == 'salida':
            query = """
                UPDATE inventario
                SET stock_actual = stock_actual - %s
                WHERE id = %s AND stock_actual >= %s
                RETURNING id, codigo, nombre, stock_actual
            """
            return execute_one(query, (cantidad, producto_id, cantidad))
        else:  # ajuste
            query = """
                UPDATE inventario
                SET stock_actual = %s
                WHERE id = %s
                RETURNING id, codigo, nombre, stock_actual
            """

        return execute_one(query, (cantidad, producto_id))

    @staticmethod
    def delete(producto_id):
        """Elimina un producto del inventario"""
        query = "DELETE FROM inventario WHERE id = %s"
        execute_query(query, (producto_id,), fetch=False)
        return True
