#!/bin/bash

# Script de configuración de base de datos PostgreSQL
# ERP Taller Mecánico

echo "========================================"
echo "Setup de Base de Datos - ERP Taller"
echo "========================================"
echo ""

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. Crear usuario de PostgreSQL si no existe
echo -e "${YELLOW}Paso 1: Creando usuario PostgreSQL...${NC}"
sudo -u postgres psql -c "CREATE USER anahuel WITH PASSWORD 'anahuel';" 2>/dev/null || echo "Usuario ya existe"
sudo -u postgres psql -c "ALTER USER anahuel WITH SUPERUSER;" 2>/dev/null

# 2. Crear base de datos
echo -e "${YELLOW}Paso 2: Creando base de datos...${NC}"
sudo -u postgres psql -c "CREATE DATABASE erp_taller_mecanico OWNER anahuel;" 2>/dev/null || echo "Base de datos ya existe"

# 3. Ejecutar script de inicialización
echo -e "${YELLOW}Paso 3: Creando tablas...${NC}"
psql -U anahuel -d erp_taller_mecanico -f init.sql

# 4. Cargar datos de ejemplo
echo -e "${YELLOW}Paso 4: Cargando datos de ejemplo...${NC}"
psql -U anahuel -d erp_taller_mecanico -f seed.sql

# 5. Verificar tablas
echo -e "${YELLOW}Paso 5: Verificando tablas creadas...${NC}"
psql -U anahuel -d erp_taller_mecanico -c "\dt"

echo ""
echo -e "${GREEN}========================================"
echo -e "✓ Setup completado exitosamente!"
echo -e "========================================${NC}"
echo ""
echo "Credenciales de la base de datos:"
echo "  Usuario: anahuel"
echo "  Password: anahuel"
echo "  Base de datos: erp_taller_mecanico"
echo "  Host: localhost"
echo "  Puerto: 5432"
echo ""
echo "Connection string:"
echo "  postgresql://anahuel:anahuel@localhost:5432/erp_taller_mecanico"
