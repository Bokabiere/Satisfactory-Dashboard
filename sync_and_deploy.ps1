param (
    [string]$CommitMessage = "Mise à jour Satisfactory Companion"
)

# Assurer l'accès à git.exe
$gitCustomPath = "$env:LOCALAPPDATA\Programs\Git\cmd"
if (Test-Path $gitCustomPath) {
    $env:Path = "$gitCustomPath;$env:Path"
}

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "   FICSIT Companion - Synchronisation & Déploiement" -ForegroundColor Yellow
Write-Host "==================================================" -ForegroundColor Cyan

# 1. Synchronisation locale vers le Tableau de bord PC (Mobro)
Write-Host "`n[1/3] Synchronisation vers le Tableau de bord PC..." -ForegroundColor Cyan
$src = "c:\IA\Projets\Satisfactory-Dashboard"
$dest = "c:\IA\Projets\Mobro-configuration\satisfactory"

if (Test-Path $dest) {
    robocopy $src $dest /E /XD ".git" "node_modules" "scratch" /XO /FFT /NDL /NFL /NJH /NJS
    Write-Host "   -> Synchronisation Mobro terminée avec succès." -ForegroundColor Green
} else {
    Write-Host "   -> Dossier Mobro non trouvé, étape ignorée." -ForegroundColor Yellow
}

# 2. Vérification de Git
Write-Host "`n[2/3] Préparation de Git..." -ForegroundColor Cyan
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "   [!] Git est introuvable." -ForegroundColor Red
    exit 1
}

# Initialisation git si besoin
if (-not (Test-Path "$src\.git")) {
    Write-Host "   -> Initialisation du dépôt Git local..." -ForegroundColor Cyan
    git init -b main
}

# Vérifier si remote origin existe
$remotes = git remote
if ($remotes -notcontains "origin") {
    Write-Host "`n[INFO] Aucun dépôt GitHub distant associé ('origin')." -ForegroundColor Yellow
    Write-Host "Pour associer votre dépôt GitHub, exécutez :" -ForegroundColor White
    Write-Host "git remote add origin https://github.com/<VOTRE-PSEUDO>/Satisfactory-Dashboard.git" -ForegroundColor Green
    Write-Host "Puis relancez ce script." -ForegroundColor White
    
    # On commit quand même en local
    git add .
    git commit -m "Commit initial local - Satisfactory Companion"
    Write-Host "`n[OK] Commit local enregistré." -ForegroundColor Green
    exit 0
}

# 3. Commit & Push vers GitHub
git add .
$status = git status --porcelain
if ($status) {
    git commit -m "$CommitMessage - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
    Write-Host "   -> Modifications enregistrées localement." -ForegroundColor Green
} else {
    Write-Host "   -> Aucun nouveau fichier modifié en local." -ForegroundColor Gray
}

Write-Host "`n[3/3] Déploiement vers GitHub Pages..." -ForegroundColor Cyan
git push origin main
if ($LASTEXITCODE -eq 0) {
    Write-Host "`n[SUCCES] Déploiement GitHub terminé ! Votre site se met à jour en ligne." -ForegroundColor Green
} else {
    Write-Host "`n[!] Échec du push vers GitHub. Vérifiez que vous êtes connecté ou que la branche est synchronisée." -ForegroundColor Red
}

Write-Host "`nTerminé !" -ForegroundColor Cyan
