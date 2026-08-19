# 🏭 FICSIT Factory Companion — Satisfactory Dashboard

[![Satisfactory Version](https://img.shields.io/badge/Satisfactory-1.2-fa9549?style=for-the-badge&logo=unrealengine&logoColor=white)](https://www.satisfactorygame.com/)
[![Statut du Projet](https://img.shields.io/badge/Statut-En%20cours%20de%20d%C3%A9veloppement%20(WIP)-f3c11b?style=for-the-badge&logo=git&logoColor=black)](https://github.com/Bokabiere/Satisfactory-Dashboard)
[![Application](https://img.shields.io/badge/Application-100%25%20Standalone-4bb3fd?style=for-the-badge&logo=javascript&logoColor=white)](https://github.com/Bokabiere/Satisfactory-Dashboard)
[![Visualiseur 3D](https://img.shields.io/badge/Moteur%203D-Three.js%20WebGL-3fe0d0?style=for-the-badge&logo=three.js&logoColor=white)](https://github.com/Bokabiere/Satisfactory-Dashboard)
[![Déploiement](https://img.shields.io/badge/GitHub%20Pages-Pr%C3%AAt-2ecc71?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Bokabiere/Satisfactory-Dashboard)

> **Tableau de bord et compagnon industriel complet pour Satisfactory 1.2** : Planification d'usine, calculateur de pièces uniques, dimensionnement d'usines complètes de jalons & phases, organigrammes SCIM interactifs, guide de construction 2D/3D étape par étape, générateur & bibliothèque de Blueprints `.sbp` *(en cours de développement)*, simulateur énergétique & logistique, carte interactive des gisements et checklist de chantier.

---

> [!NOTE]
> ### 🚧 PROJET EN COURS DE DÉVELOPPEMENT (Work In Progress)
> Ce projet est **activement développé** pour la version 1.2 de Satisfactory. De nouvelles fonctionnalités, modèles 3D, schémas d'usines, modules blueprints et optimisations d'interface sont ajoutés et ajustés en continu.  
> Les retours et suggestions d'amélioration sont les bienvenus !

---

## 🖥️ Modules & Fonctionnalités du Tableau de Bord

Le tableau de bord regroupe **8 modules spécialisés** directement accessibles depuis la barre de navigation :

```text
[ 📊 Vue Synthétique ]  [ 📋 Jalons & Ascenseur ]  [ 🔬 MAM & Disques Durs ]  [ 🏭 Production & Usines ]  [ ⚡ Centrales & Énergie ]  [ 🚚 Logistique & Transports ]  [ 🏗️ Checklist ]  [ 🗺️ Carte ]
```

---

### 📊 1. Vue Synthétique & Tableau de Bord
* **Synchroniseur & Importateur de Sauvegarde (.SAV) Intégré** : Glissez-déposez directement votre fichier de sauvegarde Satisfactory pour synchroniser en 1 clic vos jalons débloqués, phases spatiales, arbres du MAM et recettes alternatives scannées.
* **Tableau de bord récapitulatif** de l'état de votre industrie : technologies disponibles, capacités logistiques, convoyeurs débloqués et recommandations des prochains objectifs à construire.
* **Sélecteur de Thèmes FICSIT** : 5 thèmes immersifs (*FICSIT Standard*, *Caterium Cyberpunk*, *Uranium Hazard*, *Schéma Technique*, *Laboratoire Pionnier*).
* **Compteurs en temps réel** : Suivi global des jalons débloqués et de la puissance électrique totale du réseau.

---

### 📋 2. Jalons du HUB & Ascenseur Spatial (Paliers 0 à 9 & Phases 1 à 5)
* **Vue Unifiée de la Progression** avec sous-onglets ultra-rapides :
  * **Jalons du HUB** : Suivi interactif des **Paliers 0 à 9**, filtres et saut rapide par palier, boutons Déplier/Replier tout, validation dynamique des bâtiments débloqués et bouton direct *"⚡ Calculer l'Usine pour ce Jalon"*.
  * **Ascenseur Spatial** : Suivi des 5 phases du **Projet Assemblée** (jusqu'au dénouement 1.2), détail des pièces orbitales requises (*Placage intelligent*, *Structure polyvalente*, *Câblage automatisé*, *Système de propulsion thermique*, etc.) et dimensionnement instantané de la ligne d'assemblage.

---

### 🔬 3. M.A.M. & Traqueur de Disques Durs (Satisfactory 1.2)
* **Arbres Technologiques Complets (9 branches)** :
  * *Technologie Alien & Dépôt Dimensionnel 1.0* (Sphères de Mercer, Somersloops, vitesse et capacité cloud, Amplificateur de Puissance Alien +500 MW).
  * *Caterium* (Fil actif, Limiteur IA, Connecteurs, Poteaux Mk.2/Mk.3, Géothermie).
  * *Électrolimaces* (Limaces bleues/jaunes/violettes, Overclocking 250%, Synthèse quantique d'éclats).
  * *Quartz*, *Soufre*, *Organismes Alien*, *Mycélia*, *Nutriments*.
* **Simulateur d'Aide au Choix de Disques Durs ("Quelle Recette Choisir parmi 3 ?")** :
  * Évaluation algorithmique instantanée des 3 options d'un scan MAM pour recommander le meilleur choix selon votre palier actuel.
* **Tier-List Dynamique des 100+ Recettes Alternatives** :
  * Classement de **Tier S (Indispensables)** à **Tier D**, avec filtres thématiques (*Stratégie Sans-Vis*, *Économie de Minerai*, *Max Énergie*).
  * Bouton d'activation directe vers le Calculateur de production.

---

### 🏭 4. Calculateur de Production & Usines (Pièces Uniques & Complexes Multi-Lignes)
* **Vue Unifiée avec sous-onglets spécialisés** :
  * **🔩 Pièces Uniques & Lignes Dédiées** :
    * Dimensionnement d'un composant individuel par *Cadence continue (/min)* ou *Fabrication par lot (quantité en temps donné)*.
    * Optimisation automatique par IA (Minimum de machines via recettes alternatives 1.2).
    * Organigramme interactif SCIM zoomable avec drag & drop libre et heatmap énergétique (MW).
    * Guide de montage interactif 3D WebGL (Three.js) avec gestion des étages et vue 2D CAD pas à pas isolée.
    * Bouton direct *"🚚 Planifier le Transport Logistique"*.
  * **🏭 Usines Complètes de Jalons & Phases (Multi-Produits)** :
    * Dimensionnement de complexes industriels multi-lignes pour boucler un Jalon ou une Phase de l'Ascenseur en 10 min, 15 min, 30 min, 45 min ou 1h.
    * Optimisation IA globale sur l'ensemble des branches du complexe.
    * Export direct vers la Checklist de Chantier.

---

### ⚡ 5. Simulateur de Centrales Électriques & Réseau FICSIT (1.0 / 1.2)
* **10 Technologies Énergétiques** : Biomasse automatisée, Charbon standard, Charbon compacté, Carburant liquide (250 MW), Turbo-carburant, Carburant de fusée (*Rocket Fuel* 1.0), Carburant ionisé (*Ionized Fuel* 1.0), Fission Uranium (2500 MW), Recyclage Ficsonium Zéro Déchet, Géothermie et Amplificateur Alien (+500 MW).
* **Mode de Calcul Hybride** : Dimensionnement par *Puissance Cible (MW)* ou par *Débit de Ressource Disponible (/min)*.
* **Guide Hydraulique & Ratios Parfaits FICSIT** : Spécification des tuyaux (Mk.1 300 m³/min vs Mk.2 600 m³/min) et des boucles anti-reflux (ex: 3 extracteurs pour 8 générateurs à charbon).
* **Bilan de la chaîne amont** (Raffineries, Mélangeurs, Pompes) et export direct vers la Checklist de Chantier.

---

### 🚚 6. Simulateur Logistique & Réseaux de Fret (Trains, Drones, Camions & Convoyeurs)
* **Dimensionnement de Flottes & Convois** :
  * **Monorail Ferroviaire** : Calcul du nombre exact de wagons (fret / citerne liquide 2400 m³), puissance requise (MW) et nombre de locomotives adapté au relief/pentes (1:4 sur plat, 1:2 en forte pente).
  * **Drones Aériens (252 km/h)** : Calcul du nombre de drones/ports et de la consommation précise de batteries par minute.
  * **Véhicules Routiers** (Tracteur, Camion, Explorateur) : Choix des carburants (Charbon, Fuel, Turbofuel, Fusée, Batteries) et calcul des débits de ravitaillement.
  * **Convoyeurs & Tuyaux longues distances** (Mk.1 à Mk.6).
* **Gestion du Gel de Quai (25 secondes)** : calcul mathématique des pertes de débit pendant l'animation de quai et dimensionnement des conteneurs industriels tampons double entrée/sortie.
* **Matrice Décisionnelle Comparative FICSIT** : évaluation objective et notation (0-100) du mode de transport optimal selon la distance, le débit et le type de cargaison.
* **Guides et Schémas Techniques Vectoriels** : règles d'or pour la signalisation ferroviaire (*Block Signal* vs *Path Signal*) et topologie des tampons sans interruption.
* **Ponts d'intégration bidirectionnels** avec la Carte Interactive (mesure de trajet au clic) et la Checklist de Chantier.

---

### 🏗️ 7. Checklist de Chantier & Fiches d'Atelier
* Liste interactive des machines et matériaux à emporter sur le terrain pour construire votre usine.
* Possibilité de cocher chaque élément au fur et à mesure de l'assemblage.
* **Fiche récapitulative d'usine imprimable** : vue épurée et exportable pour consultation sur second écran ou impression papier.
* **Notice de chantier pas-à-pas** découpée en modules compacts adaptés aux Blueprint Designers Mk.1, Mk.2 et Mk.3 (6x6).

---

### 🗺️ 8. Carte Interactive des Ressources
* Visualiseur cartographique Canvas haute performance avec 3 modes de vue : **Satellite**, **Biomes** et **Tactique**.
* Affichage de tous les gisements avec indication visuelle de pureté (*Pur*, *Normal*, *Impur*).
* **Inspecteur de gisement en temps réel** :
  * Ajustement du type de foreuse (Foreuse Mk.1, Mk.2, Mk.3).
  * Curseur d'overclocking (100% à 250%) et boost Somersloop.
  * Calcul instantané du rendement en pièces/minute.
  * Bouton **"Injecter dans le Calculateur"** pour démarrer une chaîne à partir du gisement sélectionné.
* **Outil Radar de zone** : analyse instantanée de tous les gisements situés dans un rayon configurable (50 m à 3 500 m).
* **Outil Tracé & Mesure Logistique** : mesure de distance directe entre deux points ou gisements et transfert automatique vers le module Logistique.
* **Affichage des Capsules de Sauvetage (Crash Sites)** avec conditions de déverrouillage de disques durs.
* Filtres multi-critères par type de ressource et par niveau de pureté.

---

## 📦 Bibliothèque & Générateur de Blueprints (.SBP & .SBPCFG) ⚠️ *(En cours de développement)*

> [!WARNING]
> ### ⚙️ Fonctionnalité Expérimentale (WIP)
> Le moteur de génération binaire `.sbp` / `.sbpcfg` ainsi que les fichiers de la bibliothèque de blueprints sont actuellement en **phase active de développement et d'expérimentation**.  
> Certains agencements, connexions automatiques ou gabarits de bâtiments peuvent encore évoluer ou nécessiter des ajustements lors de l'import direct dans les Blueprint Designers de Satisfactory 1.0 / 1.2.

Le module blueprint comprend :

* **Générateur Universel de Blueprints** (`js/engine/blueprintGenerator.js`) : Génère directement au format binaire Unreal Engine les fichiers `.sbp` et `.sbpcfg` compressés en zlib.
* **Dossier de Blueprints Dédié** (`/blueprints`) :
  * Modules de démarrage Palier 0 (*Plaques*, *Tiges*, *Câbles*, *Béton*, *Plaques renforcées*).
  * Modules d'énergie (*Centrales à charbon*, *Raffineries*, etc.).
  * Modules de phases spatiales (Phases 1 à 5).
  * Architecture 1900 et packs d'usines complets (`Pack_Campus_1900.zip`, `Campus_1900_Cascades.cbp`).
* **Export par lot** : Script `batch_export_sbp.js` pour tester et générer automatiquement l'ensemble des blueprints du catalogue.

---

## 🛠️ Stack Technique & Architecture

* **Interface & Rendu** : HTML5, CSS3 Moderne (*FICSIT Dark Industrial Theme*), Canvas 2D, SVG vectoriel interactif.
* **Moteur 3D WebGL** : [Three.js](https://threejs.org/) & OrbitControls pour la visualisation spatiale des complexes industriels avec gestion multi-étages.
* **Logique & Algorithmes** : JavaScript ES6+ Vanilla (zéro framework lourd, exécution instantanée en local).
* **Format & Déploiement** : Page web 100% autonome (*Single File Standalone* via `bundle.js`), utilisable hors-ligne ou hébergée sur GitHub Pages.
* **Automatisation** : Script PowerShell `sync_and_deploy.ps1` pour la synchronisation locale, la détection automatique de modifications et le déploiement Git/GitHub en une commande.

---

## 📁 Structure du Projet

```text
Satisfactory-Dashboard/
├── blueprints/                 # Collection de blueprints .sbp, .sbpcfg, .cbp et archives zip (WIP)
├── js/
│   ├── app.js                  # Contrôleur principal et routage de l'interface
│   ├── data/                   # Données de référence Satisfactory 1.2
│   │   ├── blueprints.js       # Définition des structures de blueprints
│   │   ├── buildings.js        # Catalogue des bâtiments et coûts
│   │   ├── buildingTextures.js # Textures 2D/3D des machines
│   │   ├── logisticsData.js    # Données trains, drones, camions & convoyeurs
│   │   ├── mamData.js          # Arbres MAM et recettes alternatives
│   │   ├── mapTextures.js      # Tuiles cartographiques (Satellite & Biomes)
│   │   ├── milestones.js       # Paliers 0-9 et Phases spatiales 1-5
│   │   ├── nodes.js            # Base de coordonnées de tous les gisements
│   │   ├── powerData.js        # Données des centrales et combustibles
│   │   └── recipes.js          # Recettes de base et alternatives 1.2
│   └── engine/                 # Moteurs de calcul et de rendu
│       ├── blueprintGenerator.js # Générateur binaire .sbp / .sbpcfg (expérimental)
│       ├── calculator.js       # Calculateur de production et optimiseur IA
│       ├── factoryViewer3D.js  # Moteur 3D WebGL (Three.js)
│       ├── logisticsEngine.js  # Moteur de dimensionnement du fret
│       ├── mamEngine.js        # Logique d'analyse MAM et tier-lists
│       ├── mapEngine.js        # Moteur cartographique Canvas 2D
│       ├── powerCalculator.js  # Moteur énergétique et bilans réseau
│       └── saveParser.js       # Analyseur binaire de sauvegardes .SAV
├── batch_export_sbp.js         # Script Node.js d'export groupé de blueprints
├── bundle.js                   # Compilation autonome pour utilisation offline
├── index.html                  # Point d'entrée principal pour GitHub Pages
├── satisfactory_dashboard.html # Application complète autonome
├── styles.css                  # Feuilles de style FICSIT Dark Industrial
├── sync_and_deploy.ps1         # Script d'automatisation et de déploiement GitHub
└── template.html               # Modèle source du dashboard
```

---

## 🚀 Utilisation Rapide

### Utilisation en local
1. Clonez le dépôt :
   ```bash
   git clone https://github.com/Bokabiere/Satisfactory-Dashboard.git
   ```
2. Ouvrez simplement le fichier `index.html` ou `satisfactory_dashboard.html` dans n'importe quel navigateur Web moderne (Chrome, Firefox, Edge, Brave, etc.). Aucun serveur Node.js ou Python n'est requis.

### Déploiement GitHub Pages
Activez GitHub Pages dans les options de votre dépôt GitHub (`Settings > Pages > Branch : main`) pour accéder à votre tableau de bord depuis n'importe quel PC, smartphone ou tablette.

---

## 🗺️ Feuille de Route (Roadmap)

- [x] Suivi complet des Paliers 0 à 9 et Phases 1 à 5 de l'Ascenseur Spatial (Satisfactory 1.2).
- [x] Calculateur dédié pour Pièces Uniques et Calculateur dédié pour Usines Complètes de Jalons.
- [x] Organigramme interactif SCIM avec déplacement libre de blocs et mode heatmap énergétique.
- [x] Moteur d'optimisation automatique des recettes alternatives (Minimum de machines).
- [x] Visualiseur 3D temps réel WebGL (Three.js) avec modèle interactif des usines et sélecteur d'étages.
- [x] Guide de construction visuel 2D CAD étape par étape avec isolation dynamique.
- [x] Carte Canvas interactive avec inspecteur de foreuses, radar de zone et outil de tracé logistique.
- [x] Simulateur Logistique & Réseaux de Fret (Trains, Drones, Camions & Matrice de rentabilité FICSIT).
- [x] Simulateur de Centrales Électriques pour les 10 technologies 1.2 (Ficsonium, Rocket Fuel, Ionized Fuel, etc.).
- [x] Arbre Technologique Complet du MAM & Traqueur de Disques Durs (Dépôt Dimensionnel 1.0, Tier-List S/A/B/C/D & Aide au tirage).
- [x] Checklist de chantier interactive et fiche d'atelier imprimable.
- [x] Synchroniseur et importateur de sauvegardes `.SAV` Satisfactory.
- [ ] 🟡 *En cours de développement* : **Générateur & Bibliothèque de Blueprints .sbp / .sbpcfg natifs** (phase expérimentale, enrichissement et stabilisation des modules compacts et plans d'architecte Blueprint Designer Mk.1 / Mk.2 / Mk.3).

---

## 📜 Mentions Légales

* **Satisfactory** est une marque déposée et un jeu développé par [Coffee Stain Studios](https://www.coffeestainstudios.com/).
* Cet outil est un projet communautaire open-source non-officiel d'aide au jeu.
