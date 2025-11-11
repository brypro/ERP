from flask import Blueprint, request, jsonify
from models.servicio import Servicio

servicios_bp = Blueprint('servicios', __name__)

@servicios_bp.route('/api/servicios', methods=['GET'])
def get_servicios():
    """Obtiene todos los servicios o los filtra por búsqueda"""
    try:
        search_term = request.args.get('search')

        if search_term:
            servicios = Servicio.search(search_term)
        else:
            servicios = Servicio.get_all()

        return jsonify({
            'success': True,
            'data': servicios,
            'count': len(servicios)
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@servicios_bp.route('/api/servicios/<int:servicio_id>', methods=['GET'])
def get_servicio(servicio_id):
    """Obtiene un servicio específico por ID"""
    try:
        servicio = Servicio.get_by_id(servicio_id)

        if not servicio:
            return jsonify({
                'success': False,
                'error': 'Servicio no encontrado'
            }), 404

        return jsonify({
            'success': True,
            'data': servicio
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@servicios_bp.route('/api/servicios', methods=['POST'])
def create_servicio():
    """Crea un nuevo servicio"""
    try:
        data = request.get_json()

        # Validar datos requeridos
        required_fields = ['nombre', 'precio']
        missing_fields = [field for field in required_fields if not data.get(field)]

        if missing_fields:
            return jsonify({
                'success': False,
                'error': f'Campos requeridos faltantes: {", ".join(missing_fields)}'
            }), 400

        # Validar precio
        try:
            precio = float(data.get('precio'))
            if precio < 0:
                return jsonify({
                    'success': False,
                    'error': 'El precio no puede ser negativo'
                }), 400
        except (ValueError, TypeError):
            return jsonify({
                'success': False,
                'error': 'El precio debe ser un número válido'
            }), 400

        servicio = Servicio.create(data)

        return jsonify({
            'success': True,
            'data': servicio,
            'message': 'Servicio creado exitosamente'
        }), 201

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@servicios_bp.route('/api/servicios/<int:servicio_id>', methods=['PUT'])
def update_servicio(servicio_id):
    """Actualiza un servicio existente"""
    try:
        # Verificar que el servicio existe
        existing = Servicio.get_by_id(servicio_id)
        if not existing:
            return jsonify({
                'success': False,
                'error': 'Servicio no encontrado'
            }), 404

        data = request.get_json()

        # Validar datos requeridos
        required_fields = ['nombre', 'precio']
        missing_fields = [field for field in required_fields if not data.get(field)]

        if missing_fields:
            return jsonify({
                'success': False,
                'error': f'Campos requeridos faltantes: {", ".join(missing_fields)}'
            }), 400

        # Validar precio
        try:
            precio = float(data.get('precio'))
            if precio < 0:
                return jsonify({
                    'success': False,
                    'error': 'El precio no puede ser negativo'
                }), 400
        except (ValueError, TypeError):
            return jsonify({
                'success': False,
                'error': 'El precio debe ser un número válido'
            }), 400

        servicio = Servicio.update(servicio_id, data)

        return jsonify({
            'success': True,
            'data': servicio,
            'message': 'Servicio actualizado exitosamente'
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@servicios_bp.route('/api/servicios/<int:servicio_id>', methods=['DELETE'])
def delete_servicio(servicio_id):
    """Elimina un servicio"""
    try:
        # Verificar que el servicio existe
        existing = Servicio.get_by_id(servicio_id)
        if not existing:
            return jsonify({
                'success': False,
                'error': 'Servicio no encontrado'
            }), 404

        success = Servicio.delete(servicio_id)

        if success:
            return jsonify({
                'success': True,
                'message': 'Servicio eliminado exitosamente'
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': 'No se pudo eliminar el servicio'
            }), 500

    except Exception as e:
        # Manejar error de foreign key constraint
        if 'foreign key' in str(e).lower() or 'violates foreign key' in str(e).lower():
            return jsonify({
                'success': False,
                'error': 'No se puede eliminar el servicio porque está siendo usado en órdenes de trabajo'
            }), 400

        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
