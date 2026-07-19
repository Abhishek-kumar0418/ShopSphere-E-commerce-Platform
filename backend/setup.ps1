# Run this script as Administrator
# Right-click and select "Run with PowerShell" or execute: powershell -NoProfile -ExecutionPolicy Bypass -File setup.ps1

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "  E-Commerce Platform - Database Setup" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "❌ This script must be run as Administrator" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please follow these steps:" -ForegroundColor Yellow
    Write-Host "1. Press Win + X and select 'Windows PowerShell (Admin)'" -ForegroundColor Yellow
    Write-Host "2. Navigate to the backend folder: cd '$PSScriptRoot'" -ForegroundColor Yellow
    Write-Host "3. Run: .\setup.ps1" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✅ Running as Administrator" -ForegroundColor Green
Write-Host ""

# Start MySQL service
Write-Host "▶  Starting MySQL80 service..." -ForegroundColor Cyan
try {
    $service = Get-Service MySQL80 -ErrorAction Stop
    if ($service.Status -ne 'Running') {
        Start-Service MySQL80 -ErrorAction Stop
        Write-Host "✅ MySQL80 service started" -ForegroundColor Green
    } else {
        Write-Host "✅ MySQL80 service is already running" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Failed to start MySQL service: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Make sure MySQL Server 8.0 is installed." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Run database setup
Write-Host "▶  Setting up database..." -ForegroundColor Cyan
try {
    node setup-db.js
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Database setup completed successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Yellow
        Write-Host "1. Go to the frontend folder: cd ../frontend" -ForegroundColor Yellow
        Write-Host "2. Start a live server (e.g., using VS Code Live Server extension)" -ForegroundColor Yellow
        Write-Host "3. Go to the backend folder: cd ../backend" -ForegroundColor Yellow
        Write-Host "4. Start the server: npm run dev" -ForegroundColor Yellow
        Write-Host ""
    } else {
        Write-Host "❌ Database setup failed" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Error running setup: $_" -ForegroundColor Red
}

Write-Host ""
Read-Host "Press Enter to exit"
