@echo off
REM This script must be run as Administrator
REM Right-click this file and select "Run as administrator"

echo.
echo Starting MySQL80 service...
net start MySQL80
if errorlevel 1 (
    echo.
    echo ERROR: Failed to start MySQL. Make sure this script is run as Administrator.
    echo.
    echo To run as Administrator:
    echo 1. Right-click this file (start-mysql-and-setup.bat)
    echo 2. Select "Run as administrator"
    pause
    exit /b 1
)

echo.
echo MySQL service started successfully!
echo.
echo Now setting up the database...
cd /d "%~dp0"
node setup-db.js

if errorlevel 1 (
    echo.
    echo Database setup failed. Check the error message above.
    pause
    exit /b 1
)

echo.
echo All done! You can now run: npm run dev
echo.
pause
