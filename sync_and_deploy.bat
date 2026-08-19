@echo off
chcp 65001 > nul
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0sync_and_deploy.ps1" %*
echo.
pause
