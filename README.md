# 🏭 FICSIT Factory Companion — Satisfactory Dashboard

[![Satisfactory Version](https://img.shields.io/badge/Satisfactory-1.0%20%2B%20%7C%201.2-fa9549?style=for-the-badge&logo=unrealengine&logoColor=white)](https://www.satisfactorygame.com/)
[![Statut du Projet](https://img.shields.io/badge/Statut-En%20cours%20de%20d%C3%A9veloppement%20(WIP)-f3c11b?style=for-the-badge&logo=git&logoColor=black)](https://github.com/)
[![Type](https://img.shields.io/badge/Application-100%25%20Standalone%20%2F%20Client--Side-4bb3fd?style=for-the-badge&logo=javascript&logoColor=white)](https://github.com/)
[![Déploiement](https://img.shields.io/badge/GitHub%20Pages-Pr%C3%AAt-2ecc71?style=for-the-badge&logo=github&logoColor=white)](https://github.com/)

> **Votre tableau de bord tout-en-un pour Satisfactory 1.0+** : Calculateur de lignes de production avec recettes alternatives, carte interactive des ressources, import automatique de sauvegardes (`.sav`), suivi des jalons & phases, et bibliothèque de blueprints exportables (`.sbp` / `.sbpcfg`).

---

> [!WARNING]
> ### 🚧 PROJET EN COURS DE DÉVELOPPEMENT (Work In Progress)
> Ce projet est **activement développé et enrichi**. Certaines fonctionnalités, recettes, équilibrages et schémas de blueprints sont en cours de perfectionnement ou d'ajustement pour suivre les dernières versions de Satisfactory (1.0+).  
> Vos retours, suggestions d'améliorations et contributions via les *Issues* et *Pull Requests* sont les bienvenus !

---

## 🌟 Fonctionnalités Principales

### 📊 1. Tableau de Bord & Vue Synthétique
* **Statistiques instantanées** de la progression industrielle (consommation électrique estimée, jalons débloqués, bâtiments disponibles).
* **Synthèse globale** des technologies actives et des capacités logistiques.

### 📋 2. Gestionnaire de Jalons du HUB (Tiers 0 à 9)
* Suivi interactif des **Paliers 0 à 9** avec barre de saut rapide.
* Affichage détaillé des coûts en ressources et des récompenses débloquées (bâtiments, recettes, outils).
* Mise à jour en temps réel des capacités de production disponibles.

### 🚀 3. Ascenseur Spatial (Phases 1 à 5)
* Suivi complet des livraisons pour le **Projet Assemblée** jusqu'au palier final 1.0.
* Calcul des composants requis et des cadences cibles.

### ⚙️ 4. Calculateur de Production Avancé & Plans 2D
* **Recettes standards et alternatives** prises en compte dynamiquement.
* Prise en charge des nouveautés 1.0 : **Overclocking jusqu'à 250% (Éclats de charge)** et **Multiplicateur Somersloop (x2)**.
* **Plans d'implantation 2D (Top-Down CAD / SVG)** étape par étape : fondations, alignement des machines, répartition logistique (splitters/mergers) et câblage.
* **Shopping list intégrée** : liste précise des matériaux d'inventaire requis pour construire chaque module.

### 🏗️ 5. Checklist de Chantier & Fiches Récapitulatives
* Inventaire embarqué pour la construction sur le terrain avec cases à cocher.
* **Fiches techniques imprimables / exportables** (style industriel FICSIT) adaptées pour le papier ou le second écran.

### 🗺️ 6. Carte Interactive des Ressources (Satisfactory Map Engine)
* Moteur cartographique Canvas avec couches **Satellite**, **Biomes** et **Tactique**.
* Localisation des gisements de minerais, puits de pétrole, eau, gaz et geysers avec niveaux de pureté (*Impur*, *Normal*, *Pur*).
* **Inspecteur de gisement** : calcul automatique des débits en fonction du modèle de foreuse (Mk.1 à Mk.3), de la cadence d'horloge et des bonus Somersloop.
* **Outil Radar de zone** : analyse des ressources disponibles dans un rayon personnalisable (50m à 3500m).
* Envoi direct d'un gisement sélectionné vers le calculateur de production en 1 clic.

### 💾 7. Analyseur & Synchronisation de Sauvegarde (`.sav`)
* **100% côté client (Client-Side)** : Vos fichiers de sauvegarde ne quittent jamais votre machine (aucun envoi sur serveur externe).
* Glissez-déposez simplement votre fichier `.sav` depuis `%LOCALAPPDATA%\FactoryGame\Saved\SaveGames\`.
* Détection et validation automatique de tous vos jalons accomplis et de vos phases de l'ascenseur spatial.

### 📐 8. Bibliothèque & Générateur de Blueprints (`.sbp` / `.sbpcfg`)
* Blueprints préconçus modulaires et esthétiques (ex: style architectural *Grand Palais / Campus 1900*, gares cathédrales, modules d'estampage, viaducs ferroviaires).
* Outils de génération et d'export direct au format binaire de Satisfactory (`.sbp`, `.sbpcfg`, `.cbp`).

---

## 🛠️ Stack Technique

* **Front-end** : HTML5, CSS3 Moderne (*Design System FICSIT Dark HUD*), JavaScript ES6+ (Vanilla / Zéro framework lourd).
* **Cartographie & Rendu** : HTML5 Canvas haute performance, schémas vectoriels SVG.
* **Architecture** : Application 100% autonome (*Standalone Single Page Application*), ne nécessitant aucun backend ou base de données externe.
* **Automatisation / Build** : Node.js (scripts de bundling et d'exportation de fichiers de plans).

---

## 🚀 Démarrage Rapide

### Option 1 : Utilisation Locale Directe
1. Clonez ou téléchargez ce dépôt :
   ```bash
   git clone https://github.com/Bokabiere/Satisfactory-Dashboard.git
   ```
2. Double-cliquez simplement sur `index.html` (ou `satisfactory_dashboard.html`) pour ouvrir l'application dans votre navigateur favori (Chrome, Firefox, Edge, etc.).

### Option 2 : Déploiement GitHub Pages
Le projet est prêt pour **GitHub Pages** :
1. Activez GitHub Pages dans les paramètres de votre dépôt (`Settings > Pages > Source : Deploy from branch main / root`).
2. Votre dashboard sera immédiatement accessible en ligne sur n'importe quel appareil (PC, tablette, second écran).

### Option 3 : Intégration sur Second Écran / MoBro
Un script PowerShell de synchronisation locale est inclus (`sync_and_deploy.ps1`) pour déployer automatiquement le tableau de bord vers un écran de contrôle PC dédié (ex: MoBro).

---

## 📂 Structure du Projet

```text
Satisfactory-Dashboard/
├── index.html                     # Version standalone compilée (prête pour GitHub Pages)
├── template.html                  # Gabarit source de l'interface FICSIT
├── styles.css                     # Feuille de styles et design system FICSIT
├── bundle.js                      # Script de compilation (fusionne HTML/CSS/JS)
├── batch_export_sbp.js            # Générateur de fichiers de blueprints .sbp
├── sync_and_deploy.ps1            # Script de synchronisation locale et déploiement Git
├── js/
│   ├── app.js                     # Contrôleur principal et logique d'interface
│   ├── data/
│   │   ├── milestones.js          # Données des Jalons 0-9 & Phases 1-5
│   │   ├── recipes.js             # Recettes standards & alternatives 1.0
│   │   ├── buildings.js           # Bâtiments, machines et stats énergétiques
│   │   ├── nodes.js               # Coordonnées et pureté des gisements
│   │   ├── blueprints.js          # Catalogue et métadonnées des plans
│   │   └── mapTextures.js         # Textures vectorielles de la carte
│   └── engine/
│       ├── calculator.js          # Moteur de résolution des ratios de production
│       ├── mapEngine.js           # Moteur de rendu Canvas de la carte
│       ├── saveParser.js          # Décodeur binaire de sauvegardes .sav
│       └── blueprintGenerator.js  # Générateur de données de plans
├── blueprints/                    # Fichiers de blueprints exportés (.sbp, .sbpcfg, .cbp)
└── images/                        # Assets graphiques et captures des architectures
```

---

## 💻 Scripts & Commandes

* **Compiler l'application autonome** :
  ```bash
  node bundle.js
  ```
* **Exporter les fichiers de blueprints (.sbp / .sbpcfg)** :
  ```bash
  node batch_export_sbp.js
  ```
* **Synchroniser et déployer vers GitHub Pages** :
  ```powershell
  .\sync_and_deploy.ps1 -CommitMessage "Mise à jour des ratios et plans"
  ```

---

## 🗺️ Feuille de Route & Statut de Développement

- [x] Suivi complet des Tiers 0 à 9 et Phases 1 à 5 (Satisfactory 1.0+).
- [x] Calculateur avec gestion des recettes alternatives, overclocking et Somersloops.
- [x] Carte Canvas interactive avec couches biomes, puretés et calculs de débits.
- [x] Décodeur de sauvegardes `.sav` 100% sécurisé côté client.
- [x] Visualiseur d'étapes de construction en schéma 2D CAD.
- [ ] 🟡 *En cours* : Enrichissement de la collection de Blueprints prêts à l'emploi.
- [ ] 🟡 *En cours* : Optimisation du planificateur d'usines complexes multi-étages.
- [ ] ⏳ *Prévu* : Arbre des technologies MAM et suivi des disques durs.
- [ ] ⏳ *Prévu* : Export PDF interactif personnalisé des plans de construction.

---

## 🤝 Contribution

Les contributions sont les bienvenues !
1. **Forkez** le projet.
2. Créez votre branche de fonctionnalité (`git checkout -b feature/amelioration-calculateur`).
3. Commitez vos modifications (`git commit -m 'Ajout d'une nouvelle recette alternative'`).
4. Poussez sur votre branche (`git push origin feature/amelioration-calculateur`).
5. Ouvrez une **Pull Request**.

---

## 📜 Mentions Légales & Crédits

* **Satisfactory** est un jeu vidéo développé et édité par [Coffee Stain Studios](https://www.coffeestainstudios.com/).
* Ce projet est un outil d'accompagnement non-officiel développé par et pour la communauté de pionniers.
* Tous les droits, noms et marques déposées associés à Satisfactory appartiennent à Coffee Stain Studios & Coffee Stain Holding.
