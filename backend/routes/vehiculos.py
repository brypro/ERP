from flask import Blueprint, request, jsonify
from models.vehiculo import Vehiculo

vehiculos_bp = Blueprint('vehiculos', __name__)

@vehiculos_bp.route('/api/vehiculos', methods=['GET'])
def get_vehiculos():
    """Obtiene todos los vehículos o los filtra por búsqueda/cliente"""
    try:
        search_term = request.args.get('search')
        cliente_id = request.args.get('cliente_id')

        if search_term:
            vehiculos = Vehiculo.search(search_term)
        elif cliente_id:
            vehiculos = Vehiculo.get_by_cliente(int(cliente_id))
        else:
            vehiculos = Vehiculo.get_all()

        return jsonify({
            'success': True,
            'data': vehiculos,
            'count': len(vehiculos)
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@vehiculos_bp.route('/api/vehiculos/<int:vehiculo_id>', methods=['GET'])
def get_vehiculo(vehiculo_id):
    """Obtiene un vehículo específico por ID"""
    try:
        vehiculo = Vehiculo.get_by_id(vehiculo_id)

        if not vehiculo:
            return jsonify({
                'success': False,
                'error': 'Vehículo no encontrado'
            }), 404

        return jsonify({
            'success': True,
            'data': vehiculo
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@vehiculos_bp.route('/api/vehiculos', methods=['POST'])
def create_vehiculo():
    """Crea un nuevo vehículo"""
    try:
        data = request.get_json()

        # Validar datos requeridos
        required_fields = ['cliente_id', 'marca', 'modelo', 'placa']
        missing_fields = [field for field in required_fields if not data.get(field)]

        if missing_fields:
            return jsonify({
                'success': False,
                'error': f'Campos requeridos faltantes: {", ".join(missing_fields)}'
            }), 400

        vehiculo = Vehiculo.create(data)

        return jsonify({
            'success': True,
            'data': vehiculo,
            'message': 'Vehículo creado exitosamente'
        }), 201

    except Exception as e:
        # Manejar error de placa duplicada
        if 'unique constraint' in str(e).lower() or 'duplicate key' in str(e).lower():
            return jsonify({
                'success': False,
                'error': 'Ya existe un vehículo con esta placa'
            }), 400

        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@vehiculos_bp.route('/api/vehiculos/<int:vehiculo_id>', methods=['PUT'])
def update_vehiculo(vehiculo_id):
    """Actualiza un vehículo existente"""
    try:
        # Verificar que el vehículo existe
        existing = Vehiculo.get_by_id(vehiculo_id)
        if not existing:
            return jsonify({
                'success': False,
                'error': 'Vehículo no encontrado'
            }), 404

        data = request.get_json()

        # Validar datos requeridos
        required_fields = ['cliente_id', 'marca', 'modelo', 'placa']
        missing_fields = [field for field in required_fields if not data.get(field)]

        if missing_fields:
            return jsonify({
                'success': False,
                'error': f'Campos requeridos faltantes: {", ".join(missing_fields)}'
            }), 400

        vehiculo = Vehiculo.update(vehiculo_id, data)

        return jsonify({
            'success': True,
            'data': vehiculo,
            'message': 'Vehículo actualizado exitosamente'
        }), 200

    except Exception as e:
        # Manejar error de placa duplicada
        if 'unique constraint' in str(e).lower() or 'duplicate key' in str(e).lower():
            return jsonify({
                'success': False,
                'error': 'Ya existe un vehículo con esta placa'
            }), 400

        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@vehiculos_bp.route('/api/vehiculos/<int:vehiculo_id>', methods=['DELETE'])
def delete_vehiculo(vehiculo_id):
    """Elimina un vehículo"""
    try:
        # Verificar que el vehículo existe
        existing = Vehiculo.get_by_id(vehiculo_id)
        if not existing:
            return jsonify({
                'success': False,
                'error': 'Vehículo no encontrado'
            }), 404

        success = Vehiculo.delete(vehiculo_id)

        if success:
            return jsonify({
                'success': True,
                'message': 'Vehículo eliminado exitosamente'
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': 'No se pudo eliminar el vehículo'
            }), 500

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
