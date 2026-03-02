<#
.SYNOPSIS
    Flow test API VSTEP Writing: Health -> Login -> Protected endpoints (profile, levels, admin).
.DESCRIPTION
    Chạy tuần tự các bước: ping, health/db, login (admin/password), profile, levels, admin/users.
    Cần chạy Backend trước (dotnet run trong src/API).
.EXAMPLE
    .\Test-ApiFlow.ps1
.EXAMPLE
    .\Test-ApiFlow.ps1 -BaseUrl "https://localhost:7061" -UseHttps
#>
param(
    [string]$BaseUrl = "http://localhost:5268",
    [switch]$UseHttps,
    [string]$Username = "admin",
    [string]$Password = "password",
    [switch]$SkipAdminTest
)

if ($UseHttps) { $BaseUrl = "https://localhost:7061" }

$ErrorActionPreference = "Stop"
$script:Pass = 0
$script:Fail = 0
$script:Token = $null

function Write-Step { param($Num, $Name) Write-Host "`n--- Step $Num : $Name ---" -ForegroundColor Cyan }
function Write-Ok   { param($Msg) Write-Host "  OK $Msg" -ForegroundColor Green; $script:Pass++ }
function Write-Fail { param($Msg) Write-Host "  FAIL $Msg" -ForegroundColor Red;   $script:Fail++ }

function Invoke-Api {
    param(
        [string]$Method = "GET",
        [string]$Path,
        [object]$Body = $null,
        [string]$Token = $null
    )
    $uri = "$BaseUrl$Path"
    $headers = @{ "Content-Type" = "application/json" }
    if ($Token) { $headers["Authorization"] = "Bearer $Token" }
    $params = @{ Uri = $uri; Method = $Method; Headers = $headers; UseBasicParsing = $true }
    if ($Body) { $params["Body"] = ($Body | ConvertTo-Json -Compress) }
    try {
        $r = Invoke-WebRequest @params
        return @{ Status = $r.StatusCode; Content = $r.Content }
    } catch {
        $status = $_.Exception.Response?.StatusCode?.Value__ ?? 0
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $content = $reader.ReadToEnd()
        return @{ Status = $status; Content = $content; Error = $_.Exception.Message }
    }
}

Write-Host "`n========== VSTEP API Test Flow ==========" -ForegroundColor Yellow
Write-Host "BaseUrl: $BaseUrl" -ForegroundColor Gray

# --- Step 1: Ping ---
Write-Step 1 "GET /api/ping"
$r1 = Invoke-Api -Path "/api/ping"
if ($r1.Status -eq 200) { Write-Ok "Ping $($r1.Status)" } else { Write-Fail "Ping $($r1.Status) $($r1.Content)" }

# --- Step 2: Health DB ---
Write-Step 2 "GET /api/health/db"
$r2 = Invoke-Api -Path "/api/health/db"
if ($r2.Status -eq 200) {
    $obj = $r2.Content | ConvertFrom-Json
    if ($obj.database -eq "connected") { Write-Ok "DB connected, levelCount=$($obj.levelCount)" }
    else { Write-Fail "DB not connected: $($r2.Content)" }
} else { Write-Fail "Health $($r2.Status) $($r2.Content)" }

# --- Step 3: Login ---
Write-Step 3 "POST /api/auth/login"
$loginBody = @{ username = $Username; password = $Password }
$r3 = Invoke-Api -Method POST -Path "/api/auth/login" -Body $loginBody
if ($r3.Status -eq 200) {
    $obj = $r3.Content | ConvertFrom-Json
    $script:Token = $obj.token
    if ($Token) { Write-Ok "Login OK, token received" } else { Write-Fail "No token in response" }
} else { Write-Fail "Login $($r3.Status) $($r3.Content)" }

# --- Step 4: Profile (requires auth) ---
Write-Step 4 "GET /api/users/profile"
if (-not $Token) { Write-Fail "No token, skip" } else {
    $r4 = Invoke-Api -Path "/api/users/profile" -Token $Token
    if ($r4.Status -eq 200) { Write-Ok "Profile $($r4.Status)" } else { Write-Fail "Profile $($r4.Status) $($r4.Content)" }
}

# --- Step 5: Levels ---
Write-Step 5 "GET /api/levels"
if (-not $Token) { Write-Fail "No token, skip" } else {
    $r5 = Invoke-Api -Path "/api/levels" -Token $Token
    if ($r5.Status -eq 200) { Write-Ok "Levels $($r5.Status)" } else { Write-Fail "Levels $($r5.Status) $($r5.Content)" }
}

# --- Step 6: Admin users (admin only) ---
if (-not $SkipAdminTest) {
    Write-Step 6 "GET /api/admin/users"
    if (-not $Token) { Write-Fail "No token, skip" } else {
        $r6 = Invoke-Api -Path "/api/admin/users" -Token $Token
        if ($r6.Status -eq 200) { Write-Ok "Admin users $($r6.Status)" } else { Write-Fail "Admin users $($r6.Status) (expected if not Admin)" }
    }
} else {
    Write-Host "`n--- Step 6 : GET /api/admin/users (skipped) ---" -ForegroundColor Gray
}

# --- Summary ---
Write-Host "`n========== Summary ==========" -ForegroundColor Yellow
Write-Host "  Pass: $Pass" -ForegroundColor Green
Write-Host "  Fail: $Fail" -ForegroundColor $(if ($Fail -gt 0) { "Red" } else { "Green" })
if ($Fail -gt 0) { exit 1 }
