@echo off
cd /d "%~dp0"
where py >nul 2>&1
if %errorlevel% equ 0 (
  py -3 "%~dp0run.py" %*
) else (
  python "%~dp0run.py" %*
)
if errorlevel 1 (
  echo.
  echo AgroSat could not start. Read the error above.
  pause
)
