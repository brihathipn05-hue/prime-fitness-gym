@echo off
setlocal enabledelayedexpansion
title Prime Fitness Gym - Application Launcher

:: Set current directory to the directory where this script is located
cd /d "%~dp0"

echo ========================================================
echo         PRIME FITNESS GYM - APPLICATION LAUNCHER
echo ========================================================
echo.

:: 1. Verify Node.js installation
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not found in system PATH.
    echo Please download and install Node.js from https://nodejs.org/
    echo.
    if /i "%~1" neq "/silent" pause
    exit /b 1
)

:: 2. Verify npm installation
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed or not found in system PATH.
    echo Please install Node.js which includes npm from https://nodejs.org/
    echo.
    if /i "%~1" neq "/silent" pause
    exit /b 1
)

:: 3. Determine Server and Client directory locations
set "BACKEND_DIR="
set "FRONTEND_DIR="

if exist "%~dp0server" (
    set "BACKEND_DIR=%~dp0server"
) else if exist "%~dp0backend" (
    set "BACKEND_DIR=%~dp0backend"
)

if exist "%~dp0client" (
    set "FRONTEND_DIR=%~dp0client"
) else if exist "%~dp0frontend" (
    set "FRONTEND_DIR=%~dp0frontend"
)

if "%BACKEND_DIR%"=="" (
    echo [ERROR] Backend folder - server or backend - not found in "%~dp0".
    if /i "%~1" neq "/silent" pause
    exit /b 1
)

if "%FRONTEND_DIR%"=="" (
    echo [ERROR] Frontend folder - client or frontend - not found in "%~dp0".
    if /i "%~1" neq "/silent" pause
    exit /b 1
)

:: 4. Check and install Backend dependencies if missing
if not exist "%BACKEND_DIR%\node_modules" (
    echo [INFO] Installing backend dependencies - first-time setup...
    cd /d "%BACKEND_DIR%"
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install backend dependencies.
        if /i "%~1" neq "/silent" pause
        exit /b 1
    )
    cd /d "%~dp0"
)

:: 5. Check and install Frontend dependencies if missing
if not exist "%FRONTEND_DIR%\node_modules" (
    echo [INFO] Installing frontend dependencies - first-time setup...
    cd /d "%FRONTEND_DIR%"
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install frontend dependencies.
        if /i "%~1" neq "/silent" pause
        exit /b 1
    )
    cd /d "%~dp0"
)

echo [1/4] Launching Node.js/Express Backend on Port 5000...
start "Prime Fitness Gym - Backend" /min cmd /c "cd /d "%BACKEND_DIR%" && npm start"

echo [2/4] Launching React/Vite Frontend on Port 5173...
start "Prime Fitness Gym - Frontend" /min cmd /c "cd /d "%FRONTEND_DIR%" && npm run dev"

echo [3/4] Waiting for services to initialize...
set /a attempts=0
:WAIT_LOOP
set /a attempts+=1
ping 127.0.0.1 -n 2 >nul
netstat -aon | findstr ":5173" | findstr "LISTENING" >nul 2>&1
if %errorlevel% equ 0 goto READY
if %attempts% lss 10 goto WAIT_LOOP

:READY
echo [4/4] Opening Prime Fitness Gym in your default web browser...
start http://localhost:5173

echo.
echo ========================================================
echo   Prime Fitness Gym is running!
echo.
echo   Frontend URL: http://localhost:5173
echo   Backend URL:  http://localhost:5000
echo.
echo   To stop the application, double-click Stop Application.bat.
echo ========================================================
echo.

if /i "%~1" neq "/silent" (
    pause
)
