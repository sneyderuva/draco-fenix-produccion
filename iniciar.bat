@echo off
rem Abre la app de produccion de Draco Fenix en este computador (sin contrasena, solo local).
cd /d "%~dp0"
set LOCAL=1
set PORT=3000
where node >nul 2>nul
if %errorlevel%==0 (
  start "" http://localhost:3000
  node server.js
) else (
  echo Node.js no esta instalado; se usa Docker. La primera vez puede tardar un minuto.
  start "" http://localhost:3000
  docker run --rm -p 127.0.0.1:3000:3000 -e LOCAL=1 -e HOST=0.0.0.0 -v "%cd%":/app -w /app node:22-alpine node server.js
)
pause
