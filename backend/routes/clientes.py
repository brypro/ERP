from flask import Blueprint, request, jsonify
from models.cliente import Cliente

clientes_bp = Blueprint('clientes', __name__)

@clientes_bp.route('/api/clientes', methods=['GET'])
def get_clientes():
    """Obtiene todos los clientes o busca por término"""
    try:
        search_term = request.args.get('search')

        if search_term:
            clientes = Cliente.search(search_term)
        else:
            clientes = Cliente.get_all()

        return jsonify({
            'success': True,
            'data': clientes,
            'count': len(clientes)
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@clientes_bp.route('/api/clientes/<int:cliente_id>', methods=['GET'])
def get_cliente(cliente_id):
    """Obtiene un cliente específico por ID"""
    try:
        cliente = Cliente.get_by_id(cliente_id)

        if not cliente:
            return jsonify({
                'success': False,
                'error': 'Cliente no encontrado'
            }), 404

        return jsonify({
            'success': True,
            'data': cliente
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@clientes_bp.route('/api/clientes', methods=['POST'])
def create_cliente():
    """Crea un nuevo cliente"""
    try:
        data = request.get_json()

        # Validar datos requeridos
        required_fields = ['nombre', 'apellido']
        missing_fields = [field for field in required_fields if not data.get(field)]

        if missing_fields:
            return jsonify({
                'success': False,
                'error': f'Campos requeridos faltantes: {", ".join(missing_fields)}'
            }), 400

        cliente = Cliente.create(data)

        return jsonify({
            'success': True,
            'data': cliente,
            'message': 'Cliente creado exitosamente'
        }), 201

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@clientes_bp.route('/api/clientes/<int:cliente_id>', methods=['PUT'])
def update_cliente(cliente_id):
    """Actualiza un cliente existente"""
    try:
        # Verificar que el cliente existe
        existing = Cliente.get_by_id(cliente_id)
        if not existing:
            return jsonify({
                'success': False,
                'error': 'Cliente no encontrado'
            }), 404

        data = request.get_json()

        # Validar datos requeridos
        required_fields = ['nombre', 'apellido']
        missing_fields = [field for field in required_fields if not data.get(field)]

        if missing_fields:
            return jsonify({
                'success': False,
                'error': f'Campos requeridos faltantes: {", ".join(missing_fields)}'
            }), 400

        cliente = Cliente.update(cliente_id, data)

        return jsonify({
            'success': True,
            'data': cliente,
            'message': 'Cliente actualizado exitosamente'
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@clientes_bp.route('/api/clientes/<int:cliente_id>', methods=['DELETE'])
def delete_cliente(cliente_id):
    """Elimina un cliente"""
    try:
        # Verificar que el cliente existe
        existing = Cliente.get_by_id(cliente_id)
        if not existing:
            return jsonify({
                'success': False,
                'error': 'Cliente no encontrado'
            }), 404

        success = Cliente.delete(cliente_id)

        if success:
            return jsonify({
                'success': True,
                'message': 'Cliente eliminado exitosamente'
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': 'No se pudo eliminar el cliente'
            }), 500

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
