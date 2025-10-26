# Backend - Flask API

API backend para el sistema ERP del taller mecánico.

## Instalación

1. Crear entorno virtual:
```bash
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
```

2. Instalar dependencias:
```bash
pip install -r requirements.txt
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

4. Ejecutar la aplicación:
```bash
python app.py
```

La API estará disponible en `http://localhost:5000`

## Endpoints

- `GET /` - Información de la API
- `GET /api/health` - Estado de salud de la API
