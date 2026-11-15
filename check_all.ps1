# AgroSat full LOCAL quality gate. Start the API + frontend first with .\start_local.ps1.
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
$root = $PSScriptRoot
$python = Join-Path $root 'backend\.venv\Scripts\python.exe'
if (-not (Test-Path $python)) { throw 'Python venv missing. See README.md' }

function Assert-Exit([string]$step) {
    if ($LASTEXITCODE -ne 0) { throw "FAIL: $step (exit code $LASTEXITCODE)" }
    Write-Output "PASS: $step"
}

& $python (Join-Path $root 'backend\scripts\stage4_source_audit.py')
Assert-Exit 'NASA stage 4 satellite provenance, complete daily values, SMAP missing data and imagery limits'

Push-Location (Join-Path $root 'backend')
try {
    & $python -m pytest -q
    Assert-Exit 'Python unit, API and NASA scientific data integrity'
}
finally { Pop-Location }

Push-Location (Join-Path $root 'frontend')
try {
    & npm.cmd run lint
    Assert-Exit 'React/TypeScript linter'
    & npm.cmd run test:i18n
    Assert-Exit 'EN, RU, UZ translation completeness'
    & npm.cmd run build
    Assert-Exit 'React production build'
    & node scripts/base-path-assets-check.mjs
    Assert-Exit 'Deployment image paths: root + nested hosting, 10 SVGs and 2 MODIS PNGs'
    try {
        $api = Invoke-RestMethod -Uri 'http://127.0.0.1:8000/api/health' -TimeoutSec 5
        $ui = Invoke-WebRequest -Uri 'http://127.0.0.1:5173/' -UseBasicParsing -TimeoutSec 5
        if ($api.status -ne 'ok' -or $ui.StatusCode -ne 200) { throw 'HTTP readiness failure' }
    }
    catch { throw 'Start both servers with .\start_local.ps1, then rerun the checks. Details: ' + $_ }
    & npm.cmd run test:api
    Assert-Exit 'Live API reason-code translations'
    & node scripts/browser-smoke.mjs
    Assert-Exit 'Chrome: English, Russian, Uzbek, scientific decision matrix and mobile layout'
    & node scripts/theme-smoke.mjs
    Assert-Exit 'Chrome: milk light / dark green themes, persistence, contrast and mobile layouts'
    & npm.cmd run test:jury
    Assert-Exit 'NASA jury demo: farmer-first questions, A/B/C analysis, sources, navigation and responsive design'
    & node scripts/farmer-easy-smoke.mjs
    Assert-Exit 'AgroSat Easy: accessible decisions, API-bound water risk, next steps and EN/RU/UZ'
    & npm.cmd run test:race
    Assert-Exit 'API resilience: out-of-order responses, edits in flight, source outage and form validation'
    & npm.cmd run test:agronomy
    Assert-Exit 'Khorezm science: crop calendars, measured data provenance, four crop references, 3 languages and mobile'
    & npm.cmd run test:calendar
    Assert-Exit 'Scientific calendar regression: concealed date conflicts, translation and negative-duration safety'
    & npm.cmd run test:crops
    Assert-Exit 'Primary FAO/ICARDA sources for each crop metric, applicability notes and three languages'
    & npm.cmd run test:field
    Assert-Exit 'Farmer measurement validation: source, period, finite numeric bounds and unknown preservation'
    & npm.cmd run test:evidence
    Assert-Exit 'Field provenance: laboratory claims, meter/estimates, ECe interpretation and localizations'
    & npm.cmd run test:matrix
    Assert-Exit 'Phase 5: 18 accessible matrix explanations, three languages, desktop and mobile'
}
finally { Pop-Location }

Write-Output ''
Write-Output 'ALL LOCAL AGROSAT QUALITY GATES: PASS'
Write-Output 'PUBLIC DEPLOYMENT / NASA SUBMISSION: NOT CHECKED BY THIS SCRIPT'
