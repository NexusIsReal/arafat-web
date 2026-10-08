@echo off
title Josephite Learning — Server Starter
cd /d "%~dp0"

echo ============================================
echo   Josephite Learning - Starting Server
echo   St. Josephite School ^& College, Banpara
echo ============================================
echo.

rem -- Install dependencies on first run --
if not exist "node_modules" (
  echo [1/2] Installing dependencies, please wait...
  call npm install
  if errorlevel 1 (
    echo npm install failed.
    echo If the error mentions "gyp" or "Visual Studio", install C++ Build Tools:
    echo   winget install Microsoft.VisualStudio.2022.BuildTools --override "--wait --passive --add Microsoft.VisualStudio.Workload.VCTools --include Recommended"
    echo Then run this file again.
    pause
    exit /b 1
  )
  echo.
)

echo [2/2] Starting API server + Frontend together...
echo.
echo   Frontend (Vite):  http://localhost:5173
echo   API Server:       http://localhost:3001
echo.
echo   Login: student@demo.com / teacher@demo.com / admin@demo.com  (password: demo123)
echo.
echo   NOTE: Keep this window OPEN. Closing it stops the server.
echo.

rem -- Open browser in the site after a short delay --
start "" cmd /c "timeout /t 5 /nobreak >nul & start "" http://localhost:5173"

rem -- Run both server and frontend (Ctrl+C or close window to stop) --
call npm run dev

echo.
echo Server stopped.
pause
