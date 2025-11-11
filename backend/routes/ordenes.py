from flask import Blueprint, request, jsonify
from models.orden_trabajo import OrdenTrabajo

ordenes_bp = Blueprint('ordenes', __name__)

@ordenes_bp.route('/api/ordenes', methods=['GET'])
def get_ordenes():
    """Obtiene todas las órdenes o las filtra por búsqueda/estado/vehículo"""
    try:
        search_term = request.args.get('search')
        estado = request.args.get('estado')
        vehiculo_id = request.args.get('vehiculo_id')

        if search_term:
            ordenes = OrdenTrabajo.search(search_term)
        elif estado:
            ordenes = OrdenTrabajo.get_by_estado(estado)
        elif vehiculo_id:
            ordenes = OrdenTrabajo.get_by_vehiculo(int(vehiculo_id))
        else:
            ordenes = OrdenTrabajo.get_all()

        return jsonify({
            'success': True,
            'data': ordenes,
            'count': len(ordenes)
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@ordenes_bp.route('/api/ordenes/<int:orden_id>', methods=['GET'])
def get_orden(orden_id):
    """Obtiene una orden específica con sus detalles"""
    try:
        orden = OrdenTrabajo.get_by_id(orden_id)

        if not orden:
            return jsonify({
                'success': False,
                'error': 'Orden no encontrada'
            }), 404

        return jsonify({
            'success': True,
            'data': orden
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@ordenes_bp.route('/api/ordenes', methods=['POST'])
def create_orden():
    """Crea una nueva orden de trabajo con sus servicios"""
    try:
        data = request.get_json()

        # Validar datos requeridos
        required_fields = ['vehiculo_id', 'fecha_ingreso']
        missing_fields = [field for field in required_fields if not data.get(field)]

        if missing_fields:
            return jsonify({
                'success': False,
                'error': f'Campos requeridos faltantes: {", ".join(missing_fields)}'
            }), 400

        # Validar que el total sea correcto si hay detalles
        detalles = data.get('detalles', [])
        if detalles:
            total_calculado = sum(float(d.get('subtotal', 0)) for d in detalles)
            data['total'] = total_calculado

        orden = OrdenTrabajo.create(data)

        # Obtener la orden completa con detalles
        orden_completa = OrdenTrabajo.get_by_id(orden['id'])

        return jsonify({
            'success': True,
            'data': orden_completa,
            'message': 'Orden creada exitosamente'
        }), 201

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@ordenes_bp.route('/api/ordenes/<int:orden_id>', methods=['PUT'])
def update_orden():
    """Actualiza una orden de trabajo"""
    try:
        orden_id = int(request.view_args['orden_id'])

        # Verificar que la orden existe
        existing = OrdenTrabajo.get_by_id(orden_id)
        if not existing:
            return jsonify({
                'success': False,
                'error': 'Orden no encontrada'
            }), 404

        data = request.get_json()

        # Validar datos requeridos
        required_fields = ['vehiculo_id', 'fecha_ingreso', 'estado']
        missing_fields = [field for field in required_fields if not data.get(field)]

        if missing_fields:
            return jsonify({
                'success': False,
                'error': f'Campos requeridos faltantes: {", ".join(missing_fields)}'
            }), 400

        orden = OrdenTrabajo.update(orden_id, data)

        # Obtener la orden completa con detalles
        orden_completa = OrdenTrabajo.get_by_id(orden['id'])

        return jsonify({
            'success': True,
            'data': orden_completa,
            'message': 'Orden actualizada exitosamente'
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@ordenes_bp.route('/api/ordenes/<int:orden_id>/detalles', methods=['POST'])
def add_detalle(orden_id):
    """Agrega un servicio a una orden existente"""
    try:
        # Verificar que la orden existe
        existing = OrdenTrabajo.get_by_id(orden_id)
        if not existing:
            return jsonify({
                'success': False,
                'error': 'Orden no encontrada'
            }), 404

        data = request.get_json()

        # Validar datos requeridos
        required_fields = ['servicio_id', 'precio_unitario', 'subtotal']
        missing_fields = [field for field in required_fields if not data.get(field)]

        if missing_fields:
            return jsonify({
                'success': False,
                'error': f'Campos requeridos faltantes: {", ".join(missing_fields)}'
            }), 400

        detalle = OrdenTrabajo.add_detalle(orden_id, data)

        return jsonify({
            'success': True,
            'data': detalle,
            'message': 'Servicio agregado a la orden'
        }), 201

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@ordenes_bp.route('/api/ordenes/detalles/<int:detalle_id>', methods=['DELETE'])
def delete_detalle(detalle_id):
    """Elimina un servicio de una orden"""
    try:
        success = OrdenTrabajo.delete_detalle(detalle_id)

        if success:
            return jsonify({
                'success': True,
                'message': 'Servicio eliminado de la orden'
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': 'No se pudo eliminar el servicio'
            }), 500

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@ordenes_bp.route('/api/ordenes/<int:orden_id>', methods=['DELETE'])
def delete_orden(orden_id):
    """Elimina una orden de trabajo"""
    try:
        # Verificar que la orden existe
        existing = OrdenTrabajo.get_by_id(orden_id)
        if not existing:
            return jsonify({
                'success': False,
                'error': 'Orden no encontrada'
            }), 404

        success = OrdenTrabajo.delete(orden_id)

        if success:
            return jsonify({
                'success': True,
                'message': 'Orden eliminada exitosamente'
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': 'No se pudo eliminar la orden'
            }), 500

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
