@echo off
setlocal enabledelayedexpansion
title Prime Fitness Gym - Stop Services

:: Set current directory to script location
cd /d "%~dp0"

echo ========================================================
echo         PRIME FITNESS GYM - STOP APPLICATION
echo ========================================================
echo.

echo [INFO] Stopping backend service (Port 5000)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5000" ^| findstr "LISTENING"') do (
    taskkill /f /pid %%a >nul 2>&1
)

echo [INFO] Stopping frontend service (Port 5173)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173" ^| findstr "LISTENING"') do (
    taskkill /f /pid %%a >nul 2>&1
)

echo [INFO] Closing launcher command windows...
taskkill /fi "WINDOWTITLE eq Prime Fitness Gym - Backend*" /f >nul 2>&1
taskkill /fi "WINDOWTITLE eq Prime Fitness Gym - Frontend*" /f >nul 2>&1

echo.
echo [SUCCESS] Prime Fitness Gym application services stopped successfully.
echo.
if /i "%1" neq "/silent" (
    pause
)
