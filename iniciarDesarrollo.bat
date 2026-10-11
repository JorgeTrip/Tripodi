@echo off
setlocal
cd /d "%~dp0"

echo ====================================================
echo   Iniciando Tripodi Web - Modo Desarrollo
echo ====================================================
echo.

node --watch-path=src --watch-path=css --watch-path=js --watch scripts/iniciarDesarrollo.mjs
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ====================================================
    echo Ocurrio un error al ejecutar el servidor.
    echo ====================================================
    pause
)
