Set-StrictMode -Version Latest
$ErrorActionPreference='Stop'
Set-Location (Join-Path $PSScriptRoot 'frontend')
if (-not (Test-Path 'node_modules')) { throw 'Missing frontend dependencies. Run npm install.' }
& npm.cmd run dev -- --host 127.0.0.1
