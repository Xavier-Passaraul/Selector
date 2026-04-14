#!/bin/bash

# ========================================
# Script de Instalación Rápida
# Selector de Personajes para Eventos
# ========================================

echo "🏮 Iniciando instalación de Selector..."
echo ""

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null
then
    echo "❌ Node.js no está instalado"
    echo "Descárgalo desde: https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js detectado: $(node -v)"
echo ""

# Crear carpeta db si no existe
if [ ! -d "db" ]; then
    echo "📁 Creando carpeta db..."
    mkdir db
fi

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Crear archivo .env si no existe
if [ ! -f ".env" ]; then
    echo "⚙️  Creando archivo .env..."
    cp .env.example .env
fi

echo ""
echo "✓ ¡Instalación completada!"
echo ""
echo "Para iniciar el servidor, ejecuta:"
echo "  npm start"
echo ""
echo "Luego abre en tu navegador:"
echo "  http://localhost:3000"
echo ""
echo "🏮 ¡Disfruta del Selector! 修仙者选择"
