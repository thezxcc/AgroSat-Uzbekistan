param(
    [Parameter(Mandatory=$true)][string]$DemoUrl,
    [Parameter(Mandatory=$true)][string]$ApiUrl,
    [Parameter(Mandatory=$true)][string]$SlidesUrl
)
$ErrorActionPreference = "Stop"
function Assert-Https([string]$url) {
    if (-not $url.StartsWith('https://')) { throw "Public URL must use HTTPS: $url" }
}
Assert-Https $DemoUrl
Assert-Https $ApiUrl
Assert-Https $SlidesUrl
Write-Host "Checking public AgroSat URLs without local credentials..."
$ui = Invoke-WebRequest -Uri $DemoUrl -UseBasicParsing -TimeoutSec 20
if ($ui.StatusCode -ne 200) { throw "Frontend HTTP $($ui.StatusCode)" }
$healthUrl = $ApiUrl.TrimEnd('/') + '/api/health'
$data = Invoke-RestMethod -Uri $healthUrl -Method Get -TimeoutSec 20
if ($data.status -ne 'ok' -or $data.records -ne 9497) { throw "Unexpected API readiness or NASA record count" }
$compare = Invoke-RestMethod -Uri ($ApiUrl.TrimEnd('/') + '/api/compare') -Method Post -ContentType 'application/json' -Body '{"water":"none","salinity":"unknown","priority":"water"}' -TimeoutSec 20
if (($compare.rotations | Measure-Object).Count -ne 3) { throw "Three options not returned" }
if (($compare.rotations | Where-Object id -In 'B','C' | Where-Object status -Ne 'water-risk').Count -ne 0) { throw "Water risk check failed" }
$slideResponse = Invoke-WebRequest -Uri $SlidesUrl -UseBasicParsing -TimeoutSec 20
if ($slideResponse.StatusCode -ne 200) { throw "Slide URL inaccessible" }
if ($slideResponse.Headers['Content-Type'] -notmatch 'pdf|octet-stream') { Write-Warning "Slide URL does not declare PDF content type. Verify manually." }
Write-Host "PASS: frontend, NASA-powered API, 3 rotations and slides are publicly accessible." -ForegroundColor Green
Write-Host "MANUAL: open demo and PDF in a PRIVATE/INCOGNITO browser; check actual NASA SUBMITTED status."
