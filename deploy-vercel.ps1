# Deploy Sara to Vercel
# Run from project root: .\deploy-vercel.ps1
# First time: run "npx vercel login" and complete the browser sign-in, then run this script again.

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "Checking Vercel CLI..." -ForegroundColor Cyan
$version = npx --yes vercel --version 2>&1
if ($LASTEXITCODE -ne 0) { throw "Vercel CLI failed" }
Write-Host "Vercel $version" -ForegroundColor Green

Write-Host "`nDeploying to Vercel (production)..." -ForegroundColor Cyan
npx --yes vercel deploy --prod --yes
if ($LASTEXITCODE -ne 0) {
  Write-Host "`nIf you see 'No existing credentials', run: npx vercel login" -ForegroundColor Yellow
  Write-Host "Then open the URL shown, sign in to Vercel, and run this script again." -ForegroundColor Yellow
  exit 1
}
Write-Host "`nDeploy complete. Check the URL printed above." -ForegroundColor Green
