@echo off
REM ========================================
REM Script de Instalación Rápida (Windows)
REM Selector de Personajes para Eventos
REM ========================================

echo.
echo 🏮 Iniciando instalacion de Selector...
echo.

REM Verificar si Node.js está instalado
node -v >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js no esta instalado
    echo Descargalo desde: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%a in ('node -v') do set NODE_VERSION=%%a
echo ✓ Node.js detectado: %NODE_VERSION%
echo.

REM Crear carpeta db si no existe
if not exist db (
    echo 📁 Creando carpeta db...
    mkdir db
)

REM Instalar dependencias
echo 📦 Instalando dependencias...
call npm install

REM Crear archivo .env si no existe
if not exist .env (
    echo ⚙️  Creando archivo .env...
    copy .env.example .env
)

echo.
echo ✓ ¡Instalacion completada!
echo.
echo Para iniciar el servidor, ejecuta:
echo   npm start
echo.
echo Luego abre en tu navegador:
echo   http://localhost:3000
echo.
echo 🏮 ¡Disfruta del Selector! 修仙者选择
echo.
pause
