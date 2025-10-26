from flask import Flask, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return jsonify({
        'message': 'ERP API - Taller Mecánico',
        'status': 'active'
    })

@app.route('/api/health')
def health():
    return jsonify({
        'status': 'healthy'
    })

if __name__ == '__main__':
    # Debug mode should be disabled in production
    debug_mode = os.getenv('FLASK_ENV') == 'development'
    app.run(debug=debug_mode, host='0.0.0.0', port=5000)
