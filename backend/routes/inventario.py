from flask import Blueprint, request, jsonify
from models.inventario import Inventario

inventario_bp = Blueprint('inventario', __name__)

@inventario_bp.route('/api/inventario', methods=['GET'])
def get_inventario():
    """Obtiene todos los productos o filtra por búsqueda/categoría/stock bajo"""
    try:
        search = request.args.get('search')
        categoria = request.args.get('categoria')
        low_stock = request.args.get('low_stock')

        if low_stock == 'true':
            productos = Inventario.get_low_stock()
        elif search:
            productos = Inventario.search(search)
        elif categoria:
            productos = Inventario.get_by_categoria(categoria)
        else:
            productos = Inventario.get_all()

        return jsonify({
            'success': True,
            'data': productos,
            'count': len(productos)
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@inventario_bp.route('/api/inventario/<int:producto_id>', methods=['GET'])
def get_producto(producto_id):
    """Obtiene un producto específico por ID"""
    try:
        producto = Inventario.get_by_id(producto_id)

        if not producto:
            return jsonify({
                'success': False,
                'error': 'Producto no encontrado'
            }), 404

        return jsonify({
            'success': True,
            'data': producto
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@inventario_bp.route('/api/inventario', methods=['POST'])
def create_producto():
    """Crea un nuevo producto en el inventario"""
    try:
        data = request.get_json()

        # Validar datos requeridos
        required_fields = ['codigo', 'nombre', 'precio_compra', 'precio_venta']
        missing_fields = [field for field in required_fields if not data.get(field)]

        if missing_fields:
            return jsonify({
                'success': False,
                'error': f'Campos requeridos faltantes: {", ".join(missing_fields)}'
            }), 400

        # Validar que el código no exista
        existing = Inventario.get_by_codigo(data.get('codigo'))
        if existing:
            return jsonify({
                'success': False,
                'error': 'Ya existe un producto con ese código'
            }), 400

        # Validar precios
        try:
            precio_compra = float(data.get('precio_compra'))
            precio_venta = float(data.get('precio_venta'))

            if precio_compra < 0 or precio_venta < 0:
                return jsonify({
                    'success': False,
                    'error': 'Los precios no pueden ser negativos'
                }), 400

        except ValueError:
            return jsonify({
                'success': False,
                'error': 'Precios inválidos'
            }), 400

        producto = Inventario.create(data)

        return jsonify({
            'success': True,
            'data': producto,
            'message': 'Producto creado exitosamente'
        }), 201

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@inventario_bp.route('/api/inventario/<int:producto_id>', methods=['PUT'])
def update_producto(producto_id):
    """Actualiza un producto del inventario"""
    try:
        # Verificar que el producto existe
        existing = Inventario.get_by_id(producto_id)
        if not existing:
            return jsonify({
                'success': False,
                'error': 'Producto no encontrado'
            }), 404

        data = request.get_json()

        # Si se actualiza el código, verificar que no exista en otro producto
        if 'codigo' in data and data['codigo'] != existing['codigo']:
            codigo_exists = Inventario.get_by_codigo(data['codigo'])
            if codigo_exists:
                return jsonify({
                    'success': False,
                    'error': 'Ya existe otro producto con ese código'
                }), 400

        # Validar precios si se proporcionan
        if 'precio_compra' in data or 'precio_venta' in data:
            try:
                if 'precio_compra' in data:
                    precio_compra = float(data['precio_compra'])
                    if precio_compra < 0:
                        return jsonify({
                            'success': False,
                            'error': 'El precio de compra no puede ser negativo'
                        }), 400

                if 'precio_venta' in data:
                    precio_venta = float(data['precio_venta'])
                    if precio_venta < 0:
                        return jsonify({
                            'success': False,
                            'error': 'El precio de venta no puede ser negativo'
                        }), 400

            except ValueError:
                return jsonify({
                    'success': False,
                    'error': 'Precios inválidos'
                }), 400

        producto = Inventario.update(producto_id, data)

        return jsonify({
            'success': True,
            'data': producto,
            'message': 'Producto actualizado exitosamente'
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@inventario_bp.route('/api/inventario/<int:producto_id>/stock', methods=['POST'])
def adjust_stock(producto_id):
    """Ajusta el stock de un producto"""
    try:
        # Verificar que el producto existe
        existing = Inventario.get_by_id(producto_id)
        if not existing:
            return jsonify({
                'success': False,
                'error': 'Producto no encontrado'
            }), 404

        data = request.get_json()
        cantidad = data.get('cantidad')
        tipo = data.get('tipo', 'ajuste')  # 'entrada', 'salida', 'ajuste'

        if cantidad is None:
            return jsonify({
                'success': False,
                'error': 'Cantidad requerida'
            }), 400

        try:
            cantidad = int(cantidad)
            if cantidad < 0 and tipo != 'salida':
                return jsonify({
                    'success': False,
                    'error': 'La cantidad no puede ser negativa'
                }), 400
        except ValueError:
            return jsonify({
                'success': False,
                'error': 'Cantidad inválida'
            }), 400

        resultado = Inventario.adjust_stock(producto_id, cantidad, tipo)

        if not resultado:
            return jsonify({
                'success': False,
                'error': 'Stock insuficiente para realizar la salida'
            }), 400

        return jsonify({
            'success': True,
            'data': resultado,
            'message': f'Stock ajustado exitosamente ({tipo})'
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@inventario_bp.route('/api/inventario/<int:producto_id>', methods=['DELETE'])
def delete_producto(producto_id):
    """Elimina un producto del inventario"""
    try:
        # Verificar que el producto existe
        existing = Inventario.get_by_id(producto_id)
        if not existing:
            return jsonify({
                'success': False,
                'error': 'Producto no encontrado'
            }), 404

        Inventario.delete(producto_id)

        return jsonify({
            'success': True,
            'message': 'Producto eliminado exitosamente'
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
