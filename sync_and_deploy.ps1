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

# Analyse des fichiers modifies
Write-Host "   -> Analyse des modifications en cours..." -ForegroundColor Gray
git add -A
$statusLines = git status --porcelain

if (-not $statusLines) {
    Write-Host "   [INFO] Aucun fichier modifie a enregistrer." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "[Fin du processus]" -ForegroundColor Gray
    exit 0
}

# Extraction des details des fichiers modifies
$modified = @()
$added = @()
$deleted = @()
$renamed = @()
$details = @()

foreach ($line in $statusLines) {
    if ([string]::IsNullOrWhiteSpace($line)) { continue }
    $code = $line.Substring(0, 2).Trim()
    $file = $line.Substring(2).Trim().Trim('"')

    if ($code -match 'M') {
        $modified += $file
        $details += "- Modifie : $file"
    } elseif ($code -match '\?|A') {
        $added += $file
        $details += "- Ajoute  : $file"
    } elseif ($code -match 'D') {
        $deleted += $file
        $details += "- Supprime: $file"
    } elseif ($code -match 'R') {
        $renamed += $file
        $details += "- Renomme : $file"
    } else {
        $details += "- Modif ($code) : $file"
    }
}

$summaryParts = @()
if ($modified.Count -gt 0) { $summaryParts += "Modif: $($modified.Count)" }
if ($added.Count -gt 0) { $summaryParts += "Ajout: $($added.Count)" }
if ($deleted.Count -gt 0) { $summaryParts += "Suppr: $($deleted.Count)" }
if ($renamed.Count -gt 0) { $summaryParts += "Renom: $($renamed.Count)" }
$summaryStats = $summaryParts -join ", "

$allFiles = @($modified + $added + $deleted + $renamed)
$firstFiles = $allFiles | Select-Object -First 3
$filesOverview = ($firstFiles | ForEach-Object { [System.IO.Path]::GetFileName($_) }) -join ", "
if ($allFiles.Count -gt 3) {
    $filesOverview += " (+$( $allFiles.Count - 3 ) autres)"
}

# Affichage des fichiers modifies
Write-Host "   Fichiers detectes ($summaryStats) :" -ForegroundColor DarkCyan
foreach ($d in $details) {
    Write-Host "     $d" -ForegroundColor Gray
}

# 4. Demande de description fonctionnelle / personnalisee
if ([string]::IsNullOrWhiteSpace($CommitMessage)) {
    Write-Host ""
    Write-Host "   -------------------------------------------------------------" -ForegroundColor DarkGray
    Write-Host "   Decrivez votre mise a jour (ex: Ajout fonction TOTO) :" -ForegroundColor Yellow
    Write-Host "   [Appuyez sur Entree pour utiliser le titre automatique]" -ForegroundColor DarkGray
    Write-Host "   -------------------------------------------------------------" -ForegroundColor DarkGray
    $userInput = Read-Host "   > Message de commit"
    
    if (-not [string]::IsNullOrWhiteSpace($userInput)) {
        $commitTitle = $userInput.Trim()
    } else {
        $commitTitle = "MAJ: $filesOverview ($summaryStats)"
    }
    
    $CommitMessage = "$commitTitle`n`nDetails des changements :`n" + ($details -join "`n")
} else {
    $CommitMessage = "$CommitMessage`n`nDetails des changements :`n" + ($details -join "`n")
}

Write-Host ""
Write-Host "   -> Enregistrement du commit :" -ForegroundColor Gray
Write-Host "----------------------------------------------------" -ForegroundColor DarkGray
Write-Host $CommitMessage -ForegroundColor White
Write-Host "----------------------------------------------------" -ForegroundColor DarkGray

git commit -m "$CommitMessage"
Write-Host "   [OK] Modifications enregistrees en local." -ForegroundColor Green

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