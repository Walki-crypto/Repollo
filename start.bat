@echo off
echo  INICIANDO CYBERMONITOR RD - ZERO TRUST + IA
echo ==============================================

REM [1/5] Verificar Python
python --version >nul 2>&1
if errorlevel 1 (
    echo  Python no encontrado
    pause
    exit /b 1
)

REM [2/5] Verificar Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo  Node.js no encontrado
    pause
    exit /b 1
)

REM [3/5] Iniciar Backend
echo  Iniciando Backend (FastAPI)...
cd backend
if not exist venv (
    echo  Creando entorno virtual...
    python -m venv venv
    call venv\Scripts\activate.bat
    echo  Instalando dependencias desde requirements.txt...
    pip install -r requirements.txt
) else (
    call venv\Scripts\activate.bat
)

start "CyberMonitor Backend" cmd /k "uvicorn main:app --reload --host 0.0.0.0 --port 8000"
timeout /t 3 >nul

REM [4/5] Iniciar Frontend
echo  Iniciando Frontend (React)...
cd ..\frontend
if not exist node_modules (
    echo  Instalando dependencias Node.js...
    call pnpm install
)

start "CyberMonitor Frontend" cmd /k "npm run dev"
timeout /t 5 >nul

REM [5/5] Mostrar información
echo  Servicios iniciados correctamente
echo.
echo  Frontend:   http://localhost:3000
echo   Backend:    http://localhost:8000
echo  API Docs:   http://localhost:8000/docs
echo.
echo  Credenciales:
echo    Usuario: admin@hospital.com
echo    Contraseña: Admin123!
echo    MFA Code: 123456
echo.
echo  Supabase:   https://app.supabase.com
echo.
pause
