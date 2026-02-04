# Test Supabase Connection Script

Write-Host "Testing Supabase Connection..." -ForegroundColor Green

# Navigate to API project
Set-Location "src\API"

# Build the project
Write-Host "Building project..." -ForegroundColor Yellow
dotnet build

if ($LASTEXITCODE -eq 0) {
    Write-Host "Build successful!" -ForegroundColor Green
    
    # Run the application
    Write-Host "Starting application..." -ForegroundColor Yellow
    Write-Host "Make sure you've updated the connection string in appsettings.json" -ForegroundColor Cyan
    Write-Host "Press Ctrl+C to stop the application" -ForegroundColor Gray
    
    dotnet run
} else {
    Write-Host "Build failed. Please check for errors." -ForegroundColor Red
}