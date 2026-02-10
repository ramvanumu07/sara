@echo off
title Sara Learning Platform
color 0A

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    Sara Learning Platform                    ║
echo ║                    Starting Servers...                      ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js is available
echo.

REM Check if backend directory exists
if not exist "backend" (
    echo ❌ Backend directory not found
    echo Please run this script from the Sara project root directory
    pause
    exit /b 1
)

REM Check if frontend directory exists
if not exist "frontend" (
    echo ❌ Frontend directory not found
    echo Please run this script from the Sara project root directory
    pause
    exit /b 1
)

echo 📁 Project directories found
echo.

REM Check if backend dependencies are installed
if not exist "backend\node_modules" (
    echo ⚠️  Backend dependencies not found. Installing...
    cd backend
    npm install
    if errorlevel 1 (
        echo ❌ Failed to install backend dependencies
        pause
        exit /b 1
    )
    cd ..
)

REM Check if frontend dependencies are installed
if not exist "frontend\node_modules" (
    echo ⚠️  Frontend dependencies not found. Installing...
    cd frontend
    npm install
    if errorlevel 1 (
        echo ❌ Failed to install frontend dependencies
        pause
        exit /b 1
    )
    cd ..
)

echo 📦 Dependencies are ready
echo.

REM Check environment files
if not exist "backend\.env" (
    echo ⚠️  Backend .env file not found
    if exist "backend\.env.example" (
        echo 📝 Copying .env.example to .env
        copy "backend\.env.example" "backend\.env" >nul
        echo ⚠️  Please edit backend\.env with your actual values
    ) else (
        echo ❌ No .env.example file found
    )
)

if not exist "frontend\.env" (
    echo ⚠️  Frontend .env file not found
    if exist "frontend\.env.example" (
        echo 📝 Copying .env.example to .env
        copy "frontend\.env.example" "frontend\.env" >nul
    )
)

echo.
echo 🚀 Starting Sara Learning Platform...
echo.
echo 📊 Backend will start on: http://localhost:5000
echo 🌐 Frontend will start on: http://localhost:5173
echo.
echo ⚠️  Keep both windows open while using Sara
echo ⚠️  Close this window to stop all servers
echo.

REM Start backend in a new window
echo Starting Backend Server...
start "Sara Backend" cmd /k "cd backend && echo Backend starting... && npm run dev"

REM Wait a bit for backend to start
timeout /t 5 /nobreak >nul

REM Start frontend in a new window
echo Starting Frontend Server...
start "Sara Frontend" cmd /k "cd frontend && echo Frontend starting... && npm run dev"

echo.
echo ✅ Both servers are starting!
echo.
echo 📋 Next steps:
echo    1. Wait for both servers to fully start (30-60 seconds)
echo    2. Open your browser to: http://localhost:5173
echo    3. Backend API will be available at: http://localhost:5000
echo.
echo 🔧 Troubleshooting:
echo    - If backend fails: Check backend\.env configuration
echo    - If frontend fails: Check for port conflicts
echo    - For help: Check the console output in the server windows
echo.

REM Keep this window open to monitor
echo 📊 Monitoring servers... (Press Ctrl+C to stop all servers)
echo.

:monitor
timeout /t 10 /nobreak >nul
echo [%time%] Servers running... (Backend: http://localhost:5000, Frontend: http://localhost:5173)
goto monitor