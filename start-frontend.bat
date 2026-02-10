@echo off
title Sara Frontend Server
color 0C

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    Sara Frontend Server                      ║
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

REM Go to frontend directory
if not exist "frontend" (
    echo ❌ Frontend directory not found
    echo Please run from Sara project root
    pause
    exit /b 1
)

cd frontend

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
    )
)

echo ✅ Starting Sara Frontend Server...
echo 🌐 Server will be available at: http://localhost:5173
echo 📱 Mobile access: http://[your-ip]:5173
echo.

REM Start the server
npm run dev

echo.
echo ⚠️  Frontend server stopped
pause