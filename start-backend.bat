@echo off
title Sara Backend Server
color 0B

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    Sara Backend Server                       ║
echo ║                      Starting...                            ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found
    pause
    exit /b 1
)

REM Go to backend directory
if not exist "backend" (
    echo ❌ Backend directory not found
    echo Please run from Sara project root
    pause
    exit /b 1
)

cd backend

REM Check dependencies
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
    if errorlevel 1 (
        echo ❌ Dependency installation failed
        pause
        exit /b 1
    )
)

REM Check environment
if not exist ".env" (
    echo ⚠️  .env file not found
    if exist ".env.example" (
        copy ".env.example" ".env" >nul
        echo 📝 Created .env from .env.example
        echo ⚠️  Please edit .env with your actual values
        echo.
        pause
    )
)

echo ✅ Starting Sara Backend Server...
echo 📊 Server will be available at: http://localhost:5000
echo 🔧 Health check: http://localhost:5000/health
echo.

REM Start the server
npm run dev

echo.
echo ⚠️  Backend server stopped
pause