# 🏭 FICSIT Factory Companion — Satisfactory Dashboard

[![Satisfactory Version](https://img.shields.io/badge/Satisfactory-1.0%20%2B%20%7C%201.2-fa9549?style=for-the-badge&logo=unrealengine&logoColor=white)](https://www.satisfactorygame.com/)
[![Statut du Projet](https://img.shields.io/badge/Statut-En%20cours%20de%20d%C3%A9veloppement%20(WIP)-f3c11b?style=for-the-badge&logo=git&logoColor=black)](https://github.com/Bokabiere/Satisfactory-Dashboard)
[![Application](https://img.shields.io/badge/Application-100%25%20Standalone-4bb3fd?style=for-the-badge&logo=javascript&logoColor=white)](https://github.com/Bokabiere/Satisfactory-Dashboard)
[![Visualiseur 3D](https://img.shields.io/badge/Moteur%203D-Three.js%20WebGL-3fe0d0?style=for-the-badge&logo=three.js&logoColor=white)](https://github.com/Bokabiere/Satisfactory-Dashboard)
[![Déploiement](https://img.shields.io/badge/GitHub%20Pages-Pr%C3%AAt-2ecc71?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Bokabiere/Satisfactory-Dashboard)

> **Tableau de bord et compagnon industriel complet pour Satisfactory 1.0+** : Planification d'usine, calculateur de pièces uniques, dimensionnement d'usines complètes de jalons & phases, générateur de blueprints natifs `.sbp`, organigrammes SCIM interactifs, guide de construction 2D/3D étape par étape, carte interactive des gisements et checklist de chantier.

---

> [!WARNING]
> ### 🚧 PROJET EN COURS DE DÉVELOPPEMENT (Work In Progress)
> Ce projet est **activement développé**. De nouvelles fonctionnalités, modèles 3D, blueprints, schémas d'usines et optimisations d'interface sont ajoutés et ajustés en continu pour Satisfactory 1.0+.  
> Les retours et suggestions d'amélioration sont les bienvenus !

---

## 🖥️ Modules & Fonctionnalités du Tableau de Bord

Le tableau de bord regroupe **7 modules spécialisés** directement accessibles depuis la barre de navigation :

```text
[ 📊 Vue Synthétique ]  [ 📋 Jalons du HUB ]  [ 🚀 Ascenseur Spatial ]  [ 🔩 Pièces Uniques ]  [ 🏭 Usines de Jalons ]  [ 🏗️ Checklist ]  [ 🗺️ Carte ]
```

---

### 📊 1. Vue Synthétique & Tableau de Bord
* **Tableau de bord récapitulatif** de l'état de votre industrie : technologies disponibles, capacités logistiques, convoyeurs débloqués et recommandations de prochains jalons à construire.
* **Calcul rapide en un clic** vers les usines associées aux prochains paliers.
* **Interface épurée et immersive** pensée pour une intégration fluide sur second écran, tablette ou tableau de bord embarqué (MoBro, navigateur plein écran, etc.).

---

### 📋 2. Jalons du HUB (Paliers 0 à 9)
* Suivi interactif des **Paliers 0 à 9** avec barre de navigation rapide par palier.
* Validation dynamique des jalons débloqués pour recalculer automatiquement les recettes et infrastructures accessibles.
* Visualisation instantanée des coûts en matériaux de chaque jalon.
* Bouton **"⚡ Calculer l'Usine pour ce Jalon"** pour router automatiquement l'objectif vers le calculateur d'usines complètes.

---

### 🚀 3. Ascenseur Spatial (Phases 1 à 5)
* Suivi complet des 5 grandes phases du **Projet Assemblée** (jusqu'à la phase finale de Satisfactory 1.0 : Sauvetage de la Terre).
* Détail des pièces d'ascenseur spatial requises (*Placage intelligent*, *Structure polyvalente*, *Câblage automatisé*, *Système de propulsion thermique*, etc.).
* Calcul automatique de la ligne de fabrication complète pour terminer n'importe quelle phase selon la cadence choisie.

---

### 🔩 4. Calculateur de Production — Pièces Uniques & Lignes Dédiées
* **Dédié au dimensionnement d'un composant individuel** (ex: Vis, Rotor, Cadre modulaire lourd, Ordinateur, etc.).
* **Deux modes d'objectifs** :
  * *Cadence continue* (quantité par minute).
  * *Fabrication par lot* (nombre total de pièces à produire en un temps donné).
* **Optimisation IA (Minimum de Bâtiments)** : sélectionne automatiquement la meilleure combinaison de recettes alternatives 1.0 pour réduire l'encombrement au sol.
* **Organigramme Interactif SCIM (Satisfactory-Calculator)** :
  * Arbre de production vectoriel zoomable et déplaçable.
  * Déplacement libre des blocs de machines (drag & drop) et mode heatmap de diagnostic énergétique.
  * Basculement d'orientation Haut ➔ Bas ou Gauche ➔ Droite.
* **Micro-Usines Intégrées Mk.3** (6×6 Fondations) : vue top-down 2D avec raccordements et suivi de chantier machine par machine.
* **Téléchargement direct 1-clic de Blueprints natifs du jeu (`.sbp` & `.sbpcfg`)** directement accessible dans l'en-tête de la Notice de montage, prêt à importer dans votre dossier de sauvegarde Satisfactory 1.0+.
* **Guide de Montage Interactif 3D WebGL (Three.js) & 2D CAD** :
  * Notice de montage étape par étape (Fondations ➔ Logistique ➔ Implantation des Machines ➔ Réseau Électrique).
  * Rendu 3D temps réel avec caméra orbitale 360°, vue éclatée/transparence, zoom et perspectives.
  * Shopping list de matériaux par étape et validation progressive.

---

### 🏭 5. Calculateur d'Usines Complètes de Jalons & Phases (Multi-Lignes)
* **Dédié aux complexes industriels multi-produits** pour valider un Jalon du HUB ou une Phase de l'Ascenseur Spatial en un seul tenant.
* **Sélecteur de Jalon / Phase** avec aperçu immédiat des sous-objectifs de fabrication.
* **Cadence temporelle ajustable** : calculez les débits nécessaires pour boucler l'objectif en 10 min, 15 min, 30 min, 45 min ou 1h.
* **Optimisation IA Multi-Chaînes** : minimise le nombre total de machines requises en croisant l'intégralité des recettes alternatives sur toutes les branches du complexe.
* **Schéma interactif SCIM multi-sorties**, intégration complète des blueprints Mk.3, **Notice de Chantier 3D / 2D pas-à-pas** et **Bouton d'Export Blueprint `.sbp` du complexe complet**.
* **Export instantané vers la Checklist de Chantier** pour préparer l'expédition des matériaux.

---

### 🏗️ 6. Checklist de Chantier & Fiches d'Atelier
* Liste interactive des machines et matériaux à emporter sur le terrain pour construire votre usine.
* Possibilité de cocher chaque élément au fur et à mesure de l'assemblage.
* **Fiche récapitulative d'usine imprimable** : vue épurée et exportable pour consultation sur second écran ou impression papier.

---

### 🗺️ 7. Carte Interactive des Ressources
* Visualiseur cartographique Canvas haute performance avec 3 modes de vue : **Satellite**, **Biomes** et **Tactique**.
* Affichage de tous les gisements avec indication visuelle de pureté (*Pur*, *Normal*, *Impur*).
* **Inspecteur de gisement en temps réel** :
  * Ajustement du type de foreuse (Foreuse Mk.1, Mk.2, Mk.3).
  * Curseur d'overclocking (100% à 250%) et boost Somersloop.
  * Calcul instantané du rendement en pièces/minute.
  * Bouton **"Injecter dans le Calculateur"** pour démarrer une chaîne à partir du gisement sélectionné.
* **Outil Radar de zone** : analyse instantanée de tous les gisements situés dans un rayon configurable (50 m à 3 500 m).
* Filtres multi-critères par type de ressource et par niveau de pureté.

---

## 🛠️ Stack Technique

* **Interface & Rendu** : HTML5, CSS3 Moderne (*FICSIT Dark Industrial Theme*), Canvas 2D, SVG vectoriel interactif.
* **Moteur 3D WebGL** : [Three.js](https://threejs.org/) & OrbitControls pour la visualisation spatiale des blueprints et complexes industriels.
* **Logique & Algorithmes** : JavaScript ES6+ Vanilla (zéro dépendance lourde, exécution ultra-rapide).
* **Moteur Blueprint Natif** : Générateur binaire Unreal Engine `.sbp` / `.sbpcfg` compatible Satisfactory 1.0+.
* **Format & Déploiement** : Page web 100% autonome (*Single File Standalone* via `bundle.js`), utilisable hors-ligne ou hébergée sur GitHub Pages.

---

## 🚀 Utilisation Rapide

### Utilisation en local
1. Clonez le dépôt :
   ```bash
   git clone https://github.com/Bokabiere/Satisfactory-Dashboard.git
   ```
2. Ouvrez simplement le fichier `index.html` ou `satisfactory_dashboard.html` dans n'importe quel navigateur Web moderne.

### Déploiement GitHub Pages
Activez GitHub Pages dans les options de votre dépôt GitHub (`Settings > Pages > Branch : main`) pour accéder à votre tableau de bord depuis n'importe quel PC, smartphone ou tablette.

---

## 🗺️ Feuille de Route (Roadmap)

- [x] Suivi complet des Paliers 0 à 9 et Phases 1 à 5 de l'Ascenseur Spatial.
- [x] Calculateur dédié pour Pièces Uniques et Calculateur dédié pour Usines Complètes de Jalons.
- [x] Organigramme interactif SCIM avec déplacement libre de blocs et mode heatmap.
- [x] Moteur d'optimisation automatique des recettes alternatives (Minimum de machines).
- [x] Export binaire natif de Blueprints `.sbp` / `.sbpcfg` (Designer Mk.3 6×6).
- [x] Visualiseur 3D temps réel WebGL (Three.js) avec modèle interactif des usines.
- [x] Guide de construction visuel 2D CAD étape par étape.
- [x] Carte Canvas interactive avec inspecteur de foreuses et radar de zone.
- [x] Checklist de chantier interactive et fiche d'atelier imprimable.
- [ ] 🟡 *En cours* : Ajout de nouveaux modules de production compacts et verticaux.
- [ ] ⏳ *À venir* : Module de suivi de l'arbre technologique du MAM.

---

## 📜 Mentions Légales

* **Satisfactory** est développé par [Coffee Stain Studios](https://www.coffeestainstudios.com/).
* Cet outil est un projet communautaire non-officiel d'aide au jeu.
