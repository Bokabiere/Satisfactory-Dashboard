[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$desktop = [System.Environment]::GetFolderPath('Desktop')
$wsh = New-Object -ComObject WScript.Shell

# 1. Raccourci de déploiement automatique (1-clic)
$shortcutPath1 = Join-Path $desktop "🚀 Mettre a jour GitHub (Satisfactory).lnk"
$shortcut1 = $wsh.CreateShortcut($shortcutPath1)
$shortcut1.TargetPath = "c:\IA\Projets\Satisfactory-Dashboard\sync_and_deploy.bat"
$shortcut1.WorkingDirectory = "c:\IA\Projets\Satisfactory-Dashboard"
$shortcut1.Description = "Synchronise et envoie automatiquement les modifications sur GitHub"

$ghdExe = "$env:LOCALAPPDATA\GitHubDesktop\GitHubDesktop.exe"
if (Test-Path $ghdExe) {
    $shortcut1.IconLocation = "$ghdExe,0"
}
$shortcut1.Save()

# 2. Raccourci pour ouvrir directement dans GitHub Desktop GUI
$shortcutPath2 = Join-Path $desktop "🖥️ Ouvrir Satisfactory dans GitHub Desktop.lnk"
$shortcut2 = $wsh.CreateShortcut($shortcutPath2)
$shortcut2.TargetPath = "c:\IA\Projets\Satisfactory-Dashboard\open_github_desktop.bat"
$shortcut2.WorkingDirectory = "c:\IA\Projets\Satisfactory-Dashboard"
$shortcut2.Description = "Ouvre l'application GitHub Desktop sur le projet Satisfactory Companion"
if (Test-Path $ghdExe) {
    $shortcut2.IconLocation = "$ghdExe,0"
}
$shortcut2.Save()

Write-Host "================================================================" -ForegroundColor Green
Write-Host "   Raccourcis crees avec succes sur votre Bureau Windows !"     -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Green
Write-Host "1. '🚀 Mettre a jour GitHub (Satisfactory)'" -ForegroundColor Cyan
Write-Host "   -> 1 double-clic : Commit automatique et Push immediat vers GitHub."
Write-Host "2. '🖥️ Ouvrir Satisfactory dans GitHub Desktop'" -ForegroundColor Cyan
Write-Host "   -> 1 double-clic : Ouvre l'interface visuelle GitHub Desktop."
Write-Host ""
