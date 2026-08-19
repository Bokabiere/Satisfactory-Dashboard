@echo off
set "GHD=%LOCALAPPDATA%\GitHubDesktop\GitHubDesktop.exe"
if exist "%GHD%" (
    start "" "%GHD%" "%~dp0."
) else (
    echo GitHub Desktop n'a pas ete trouve dans %LOCALAPPDATA%\GitHubDesktop\
    pause
)
