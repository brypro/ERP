from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import sys

# Agregar el directorio actual al path para imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Cargar variables de entorno
load_dotenv()

# Importar blueprints
from routes.clientes import clientes_bp
from routes.vehiculos import vehiculos_bp
from routes.reservas import reservas_bp

app = Flask(__name__)
CORS(app)

# Registrar blueprints
app.register_blueprint(clientes_bp)
app.register_blueprint(vehiculos_bp)
app.register_blueprint(reservas_bp)

@app.route('/')
def home():
    return jsonify({
        'message': 'ERP API - Taller Mecánico',
        'status': 'active',
        'version': '1.0.0'
    })

@app.route('/api/health')
def health():
    """Health check endpoint"""
    try:
        # Intentar importar y verificar conexión a BD
        from utils.database import get_db_connection
        conn = get_db_connection()
        conn.close()
        db_status = 'connected'
    except Exception as e:
        db_status = f'disconnected: {str(e)}'

    return jsonify({
        'status': 'healthy',
        'database': db_status
    })

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'error': 'Endpoint no encontrado'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'success': False,
        'error': 'Error interno del servidor'
    }), 500

if __name__ == '__main__':
    # Debug mode should be disabled in production
    debug_mode = os.getenv('FLASK_ENV') == 'development'
    port = int(os.getenv('PORT', 5000))
    app.run(debug=debug_mode, host='0.0.0.0', port=port)
