@echo off
REM PropertyFlow v2.0 - Quick Start for Windows
REM Run this batch file to set up the enhanced rental system

echo.
echo =========================================
echo   PropertyFlow v2.0 - Setup Script
echo =========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo X Node.js is not installed. Please install Node.js v16+ from https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK] Node.js detected: %NODE_VERSION%
echo.

echo [*] Installing dependencies...
call npm install

if %errorlevel% neq 0 (
    echo X Failed to install dependencies
    pause
    exit /b 1
)

echo [OK] Dependencies installed successfully!
echo.

echo [*] Checking for .env file...

if not exist ".env" (
    echo [*] Creating .env file...
    
    (
        echo # Google OAuth Configuration
        echo REACT_APP_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
        echo.
        echo # API Configuration
        echo REACT_APP_API_URL=http://localhost:3001/api
        echo.
        echo # Environment
        echo REACT_APP_ENV=development
        echo.
        echo # Feature Flags
        echo REACT_APP_ENABLE_IP_VERIFICATION=true
        echo REACT_APP_ENABLE_TERMS_MODAL=true
        echo REACT_APP_ENABLE_PARTICLE_EFFECTS=true
        echo.
        echo # Security
        echo REACT_APP_AUTHORIZED_EMAIL=isowekesa@gmail.com
        echo REACT_APP_POLICY_VERSION=2026-07-07
    ) > .env
    
    echo [OK] .env file created!
) else (
    echo [OK] .env file already exists
)

echo.
echo =========================================
echo   Documentation:
echo =========================================
echo   * SETUP_GUIDE.md - Detailed setup
echo   * README_ENHANCED.md - Full docs
echo   * TRANSFORMATION_SUMMARY.md - What's new
echo.

echo =========================================
echo   Ready to start!
echo =========================================
echo.
echo Next steps:
echo   1. Edit .env and add your Google Client ID
echo   2. Run: npm start
echo   3. Open http://localhost:3000
echo.
echo Happy coding! [OK]
echo.

pause
