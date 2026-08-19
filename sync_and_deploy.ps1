param (
    [string]$CommitMessage = ""
)

# 1. Detection automatique et ajout de Git au PATH
$possibleGitPaths = @(
    "$env:LOCALAPPDATA\Programs\Git\cmd",
    "C:\Program Files\Git\cmd",
    "C:\Program Files (x86)\Git\cmd"
)

$ghdGit = Get-ChildItem -Path "$env:LOCALAPPDATA\GitHubDesktop\app-*\resources\app\git\cmd" -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty FullName
if ($ghdGit) {
    $possibleGitPaths += $ghdGit
}

foreach ($p in $possibleGitPaths) {
    if (Test-Path $p) {
        $env:Path = "$p;$env:Path"
        break
    }
}

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "   FICSIT COMPANION - AUTOMATISATION & SYNCHRO GITHUB           " -ForegroundColor Yellow
Write-Host "================================================================" -ForegroundColor Cyan

# 2. Synchronisation locale vers le Tableau de bord PC (Mobro)
$src = "c:\IA\Projets\Satisfactory-Dashboard"
$dest = "c:\IA\Projets\Mobro-configuration\satisfactory"

Write-Host ""
Write-Host "[1/3] Synchronisation vers le Tableau de bord PC..." -ForegroundColor Cyan
if (Test-Path $dest) {
    robocopy $src $dest /E /XD ".git" "node_modules" "scratch" "graphify-out" /XO /FFT /NDL /NFL /NJH /NJS | Out-Null
    Write-Host "   [OK] Synchronisation Mobro terminee." -ForegroundColor Green
} else {
    Write-Host "   [INFO] Dossier Mobro non configure, etape ignoree." -ForegroundColor Gray
}

# 3. Verification de Git
Write-Host ""
Write-Host "[2/3] Verification de l'environnement Git / GitHub..." -ForegroundColor Cyan
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "   [ERREUR] Git est introuvable. Veuillez verifier l'installation de Git ou GitHub Desktop." -ForegroundColor Red
    exit 1
}

# 4. Commit & Envoi des modifications
if ([string]::IsNullOrWhiteSpace($CommitMessage)) {
    $dateStr = Get-Date -Format "yyyy-MM-dd HH:mm"
    $CommitMessage = "Mise a jour Satisfactory Companion - $dateStr"
}

Write-Host "   -> Analyse des fichiers modifies..." -ForegroundColor Gray
git add -A

$status = git status --porcelain
if ($status) {
    Write-Host "   -> Enregistrement du commit : '$CommitMessage'..." -ForegroundColor Gray
    git commit -m "$CommitMessage"
    Write-Host "   [OK] Modifications enregistrees en local." -ForegroundColor Green
} else {
    Write-Host "   [INFO] Aucun fichier modifie en local a commiter." -ForegroundColor Yellow
}

# 5. Push vers GitHub
Write-Host ""
Write-Host "[3/3] Envoi vers GitHub (Push vers origin/main)..." -ForegroundColor Cyan
$pushOutput = git push origin main 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "================================================================" -ForegroundColor Green
    Write-Host "   SUCCES : Vos modifications sont en ligne sur GitHub !        " -ForegroundColor Green
    Write-Host "   Depot : https://github.com/Bokabiere/Satisfactory-Dashboard   " -ForegroundColor Cyan
    Write-Host "================================================================" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "   [ERREUR] Echec lors du push vers GitHub :" -ForegroundColor Red
    Write-Host "   $pushOutput" -ForegroundColor Red
    Write-Host ""
    Write-Host "   Astuce : Vous pouvez ouvrir GitHub Desktop pour verifier vos identifiants." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "[Fin du processus]" -ForegroundColor Gray