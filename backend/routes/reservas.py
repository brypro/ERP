from flask import Blueprint, request, jsonify
from models.reserva import Reserva

reservas_bp = Blueprint('reservas', __name__)

@reservas_bp.route('/api/reservas', methods=['GET'])
def get_reservas():
    """Obtiene todas las reservas o las filtra por búsqueda/cliente/fecha/estado"""
    try:
        search_term = request.args.get('search')
        cliente_id = request.args.get('cliente_id')
        fecha = request.args.get('fecha')
        estado = request.args.get('estado')

        if search_term:
            reservas = Reserva.search(search_term)
        elif cliente_id:
            reservas = Reserva.get_by_cliente(int(cliente_id))
        elif fecha:
            reservas = Reserva.get_by_fecha(fecha)
        elif estado:
            reservas = Reserva.get_by_estado(estado)
        else:
            reservas = Reserva.get_all()

        return jsonify({
            'success': True,
            'data': reservas,
            'count': len(reservas)
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@reservas_bp.route('/api/reservas/<int:reserva_id>', methods=['GET'])
def get_reserva(reserva_id):
    """Obtiene una reserva específica por ID"""
    try:
        reserva = Reserva.get_by_id(reserva_id)

        if not reserva:
            return jsonify({
                'success': False,
                'error': 'Reserva no encontrada'
            }), 404

        return jsonify({
            'success': True,
            'data': reserva
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@reservas_bp.route('/api/reservas', methods=['POST'])
def create_reserva():
    """Crea una nueva reserva"""
    try:
        data = request.get_json()

        # Validar datos requeridos
        required_fields = ['cliente_id', 'vehiculo_id', 'fecha_reserva', 'hora_reserva']
        missing_fields = [field for field in required_fields if not data.get(field)]

        if missing_fields:
            return jsonify({
                'success': False,
                'error': f'Campos requeridos faltantes: {", ".join(missing_fields)}'
            }), 400

        reserva = Reserva.create(data)

        return jsonify({
            'success': True,
            'data': reserva,
            'message': 'Reserva creada exitosamente'
        }), 201

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@reservas_bp.route('/api/reservas/<int:reserva_id>', methods=['PUT'])
def update_reserva(reserva_id):
    """Actualiza una reserva existente"""
    try:
        # Verificar que la reserva existe
        existing = Reserva.get_by_id(reserva_id)
        if not existing:
            return jsonify({
                'success': False,
                'error': 'Reserva no encontrada'
            }), 404

        data = request.get_json()

        # Validar datos requeridos
        required_fields = ['cliente_id', 'vehiculo_id', 'fecha_reserva', 'hora_reserva', 'estado']
        missing_fields = [field for field in required_fields if not data.get(field)]

        if missing_fields:
            return jsonify({
                'success': False,
                'error': f'Campos requeridos faltantes: {", ".join(missing_fields)}'
            }), 400

        reserva = Reserva.update(reserva_id, data)

        return jsonify({
            'success': True,
            'data': reserva,
            'message': 'Reserva actualizada exitosamente'
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@reservas_bp.route('/api/reservas/<int:reserva_id>', methods=['DELETE'])
def delete_reserva(reserva_id):
    """Elimina una reserva"""
    try:
        # Verificar que la reserva existe
        existing = Reserva.get_by_id(reserva_id)
        if not existing:
            return jsonify({
                'success': False,
                'error': 'Reserva no encontrada'
            }), 404

        success = Reserva.delete(reserva_id)

        if success:
            return jsonify({
                'success': True,
                'message': 'Reserva eliminada exitosamente'
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': 'No se pudo eliminar la reserva'
            }), 500

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
