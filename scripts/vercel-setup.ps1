# ExactScience Estimators — Vercel Environment Variable Setup
# Run from Windows terminal: powershell -ExecutionPolicy Bypass -File vercel-setup.ps1
#
# BEFORE RUNNING: Replace every REPLACE_WITH_... placeholder below with your actual values.
# Your values are in the Claude chat session.

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  ExactScience Estimators - Vercel Setup  " -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check npm is available
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: npm not found. Install Node.js from nodejs.org first." -ForegroundColor Red
    exit 1
}

# Install Vercel CLI
Write-Host "Installing Vercel CLI..." -ForegroundColor Yellow
npm install -g vercel 2>&1 | Out-Null
Write-Host "Vercel CLI ready." -ForegroundColor Green
Write-Host ""

# Login (opens browser)
Write-Host "Step 1: Logging in to Vercel (your browser will open)..." -ForegroundColor Yellow
vercel login
Write-Host ""

# Link to project
Write-Host "Step 2: Linking to your Vercel project..." -ForegroundColor Yellow
Write-Host "  When prompted:" -ForegroundColor Gray
Write-Host "  - Set up and deploy: Y" -ForegroundColor Gray
Write-Host "  - Scope: exactscienceestimates-boop" -ForegroundColor Gray
Write-Host "  - Link to existing project: Y" -ForegroundColor Gray
Write-Host "  - Project name: supreme-spoon" -ForegroundColor Gray
Write-Host ""
vercel link
Write-Host ""

# -----------------------------------------------------------------------
# FILL IN YOUR VALUES BELOW — replace every REPLACE_WITH_... placeholder
# -----------------------------------------------------------------------
$vars = @(
    @{ name = "ADMIN_SECRET";                value = "REPLACE_WITH_ADMIN_SECRET" },
    @{ name = "ANTHROPIC_API_KEY";           value = "REPLACE_WITH_ANTHROPIC_API_KEY" },
    @{ name = "ZOHO_CLIENT_ID";              value = "REPLACE_WITH_ZOHO_CLIENT_ID" },
    @{ name = "ZOHO_CLIENT_SECRET";          value = "REPLACE_WITH_ZOHO_CLIENT_SECRET" },
    @{ name = "ZOHO_REFRESH_TOKEN";          value = "REPLACE_WITH_ZOHO_REFRESH_TOKEN" },
    @{ name = "ZOHO_ORG_ID";                 value = "5811582000000020005" },
    @{ name = "NEXT_PUBLIC_COMPANY_NAME";    value = "ExactScience Estimators LLC" },
    @{ name = "NEXT_PUBLIC_COMPANY_PHONE";   value = "954-260-7973" },
    @{ name = "NEXT_PUBLIC_COMPANY_EMAIL";   value = "exactscienceestimates@gmail.com" },
    @{ name = "NEXT_PUBLIC_COMPANY_CITY";    value = "Fort Lauderdale, FL" }
)

# Check placeholders are filled in
$unfilled = $vars | Where-Object { $_.value -like "REPLACE_WITH_*" }
if ($unfilled) {
    Write-Host "ERROR: Please fill in these placeholders before running:" -ForegroundColor Red
    $unfilled | ForEach-Object { Write-Host "  $($_.name)" -ForegroundColor Red }
    exit 1
}

Write-Host "Step 3: Adding $($vars.Count) environment variables to production..." -ForegroundColor Yellow
Write-Host ""

foreach ($var in $vars) {
    Write-Host "  Adding $($var.name)..." -NoNewline -ForegroundColor White
    try {
        $var.value | vercel env add $var.name production --force 2>&1 | Out-Null
        Write-Host " OK" -ForegroundColor Green
    } catch {
        Write-Host " FAILED" -ForegroundColor Red
        Write-Host "    Add manually: $($var.name)" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "Step 4: Deploying to production..." -ForegroundColor Yellow
vercel deploy --prod
Write-Host ""

Write-Host "============================================" -ForegroundColor Green
Write-Host "  All done! Your site should be live at:  " -ForegroundColor Green
Write-Host "  https://supreme-spoon.vercel.app         " -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
