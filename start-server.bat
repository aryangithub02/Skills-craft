@echo off
:: ============================================================================
:: SkillsCraft Server Launcher
:: This script can be placed anywhere on your system (Desktop, Downloads, etc.)
:: and will always navigate to the saved project directory to start the server.
:: ============================================================================

title SkillsCraft Server Launcher

:: Saved project path
set "SAVED_PROJECT_DIR=c:\Users\lenovo\Documents\GitHub\Skills-craft"

:: Check if running directly inside a project directory with package.json
if exist "%~dp0package.json" (
    set "PROJECT_DIR=%~dp0"
) else (
    set "PROJECT_DIR=%SAVED_PROJECT_DIR%"
)

:: Ensure project directory exists
if not exist "%PROJECT_DIR%\package.json" (
    echo [ERROR] Could not find package.json in "%PROJECT_DIR%"
    echo Please ensure the project directory path is correct.
    echo.
    pause
    exit /b 1
)

:: Navigate to the project directory (/d switch handles drive letters)
cd /d "%PROJECT_DIR%"

echo ============================================================================
echo   SkillsCraft - Starting Development Server
echo ============================================================================
echo   Project Directory : %CD%
echo   Command           : npm run dev
echo ============================================================================
echo.

:: Start Next.js dev server
call npm run dev

:: Keep window open if server stops or errors out
if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Server exited with error code %ERRORLEVEL%.
)
pause
