@echo off
chcp 65001 > nul
cd /d "%~dp0"
title Tripodi Web - Servidor Local y Red

echo =======================================================
echo   Tripodi Web - Iniciador de Desarrollo
echo =======================================================
echo.

:: 1. Verificar si Node.js esta disponible
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] No se encontro Node.js instalado o en el PATH.
    echo Por favor, instala Node.js desde https://nodejs.org/ para continuar.
    echo.
    pause
    exit /b 1
)

:: 2. Compilar fragmentos modulares
echo [1/3] Compilando componentes modulares y estilos...
node compilar.js
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Fallo la compilacion de archivos del proyecto.
    pause
    exit /b 1
)

:: 3. Abrir automaticamente el navegador predeterminado
echo.
echo [2/3] Abriendo el navegador en http://localhost:8080...
start http://localhost:8080/

:: 4. Iniciar el servidor HTTP local y en red
echo.
echo [3/3] Levantando servidor web...
node scripts\servidor.js

pause