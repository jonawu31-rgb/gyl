@echo off
setlocal
chcp 65001 >nul

cd /d "%~dp0"

set "LOCAL_NODE=%~dp0.tools\node-v20.19.0-win-x64"
if exist "%LOCAL_NODE%\node.exe" (
  set "PATH=%LOCAL_NODE%;%PATH%"
)

echo ==============================
echo  zhishu web local launcher
echo ==============================
echo.

if not exist "node_modules" (
  echo [1/2] Installing dependencies...
  call npm install
  if errorlevel 1 (
    echo.
    echo Dependency installation failed.
    pause
    exit /b 1
  )
  echo.
)

echo [2/2] Starting development server...
echo Open the URL shown by Vite, usually http://localhost:5173
echo.

call npm run dev -- --host 0.0.0.0

endlocal
