# Starts API and UI in separate PowerShell windows.
$ErrorActionPreference='Stop'
Start-Process powershell.exe -ArgumentList '-NoExit','-ExecutionPolicy','Bypass','-File',(Join-Path $PSScriptRoot 'start_backend.ps1')
Start-Process powershell.exe -ArgumentList '-NoExit','-ExecutionPolicy','Bypass','-File',(Join-Path $PSScriptRoot 'start_frontend.ps1')
Write-Output 'Open http://127.0.0.1:5173 after both windows report ready.'
