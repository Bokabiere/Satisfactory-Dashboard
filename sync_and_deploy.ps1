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

# Extraction des details et detection automatique des fonctionnalites via git diff
$diffText = git diff --cached -U0

$detectedFeatures = @()
$modifiedModules = @()

foreach ($line in ($diffText -split "`r?`n")) {
    if ($line -match '^\+\+\+ b\/(.+)$') {
        $currentFile = $matches[1]
        if ($currentFile -match 'recipes\.js') { $modifiedModules += "recettes" }
        elseif ($currentFile -match 'calculator\.js') { $modifiedModules += "calculateur" }
        elseif ($currentFile -match 'buildings\.js') { $modifiedModules += "batiments" }
        elseif ($currentFile -match 'milestones\.js') { $modifiedModules += "jalons" }
        elseif ($currentFile -match 'nodes\.js') { $modifiedModules += "gisements" }
        elseif ($currentFile -match 'styles\.css') { $modifiedModules += "styles CSS" }
        elseif ($currentFile -match 'README\.md') { $modifiedModules += "documentation" }
    }
    
    # Detection de nouvelles fonctions JS (ex: function TOTO() ou const TOTO = ...)
    if ($line -match '^\+\s*(?:async\s+)?function\s+([a-zA-Z0-9_$]+)\s*\(') {
        $fName = $matches[1]
        if ($fName -notmatch '^(init|ready|setup|callback)$') { $detectedFeatures += "fonction $fName()" }
    } elseif ($line -match '^\+\s*(?:const|let|var)\s+([a-zA-Z0-9_$]+)\s*=\s*(?:async\s*)?\(') {
        $fName = $matches[1]
        $detectedFeatures += "fonction $fName()"
    } 
    # Detection de nouveaux onglets / sections / boutons HTML
    elseif ($line -match '^\+\s*<[^>]+data-tab=["'']([^"'']+)["'']') {
        $detectedFeatures += "onglet '$($matches[1])'"
    } elseif ($line -match '^\+\s*<button[^>]+id=["'']btn-?([^"'']+)["'']') {
        $detectedFeatures += "bouton '$($matches[1])'"
    } elseif ($line -match '^\+\s*<div[^>]+id=["'']tab-?([^"'']+)["'']') {
        $detectedFeatures += "onglet '$($matches[1])'"
    } elseif ($line -match '^\+\s*<section[^>]+id=["'']([^"'']+)["'']') {
        $detectedFeatures += "section '$($matches[1])'"
    }
}

$detectedFeatures = $detectedFeatures | Select-Object -Unique
$modifiedModules = $modifiedModules | Select-Object -Unique

# Fichiers modifies
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

# 4. Construction automatique du titre du commit
if ([string]::IsNullOrWhiteSpace($CommitMessage)) {
    if ($detectedFeatures.Count -gt 0) {
        $firstFeats = $detectedFeatures | Select-Object -First 2
        $featText = $firstFeats -join " et "
        if ($detectedFeatures.Count -gt 2) {
            $featText += " (+$( $detectedFeatures.Count - 2 ) autres)"
        }
        $commitTitle = "feat: Ajout de $featText"
    } elseif ($modifiedModules.Count -gt 0) {
        $commitTitle = "MAJ: " + ($modifiedModules -join ", ") + " ($filesOverview)"
    } else {
        $commitTitle = "MAJ: $filesOverview ($summaryStats)"
    }

    $CommitMessage = "$commitTitle`n`nDetails des changements :`n" + ($details -join "`n")
} else {
    $CommitMessage = "$CommitMessage`n`nDetails des changements :`n" + ($details -join "`n")
}

Write-Host "   -> Message de commit genere automatiquement :" -ForegroundColor Cyan
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