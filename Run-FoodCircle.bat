@echo off
title FoodCircle - Smart Food Rescue Platform
echo ====================================================
echo   Starting FoodCircle Web Application...
echo ====================================================
cd /d "%~dp0"
echo.
echo 1. Opening your web browser to http://localhost:5173 ...
start http://localhost:5173
echo.
echo 2. Launching Vite Development Server...
call npm run dev
pause
