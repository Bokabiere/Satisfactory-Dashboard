# 🏭 FICSIT Factory Companion — Satisfactory Dashboard

[![Satisfactory Version](https://img.shields.io/badge/Satisfactory-1.2-fa9549?style=for-the-badge&logo=unrealengine&logoColor=white)](https://www.satisfactorygame.com/)
[![Statut du Projet](https://img.shields.io/badge/Statut-En%20cours%20de%20d%C3%A9veloppement%20(WIP)-f3c11b?style=for-the-badge&logo=git&logoColor=black)](https://github.com/Bokabiere/Satisfactory-Dashboard)
[![Application](https://img.shields.io/badge/Application-100%25%20Standalone-4bb3fd?style=for-the-badge&logo=javascript&logoColor=white)](https://github.com/Bokabiere/Satisfactory-Dashboard)
[![Visualiseur 3D](https://img.shields.io/badge/Moteur%203D-Three.js%20WebGL-3fe0d0?style=for-the-badge&logo=three.js&logoColor=white)](https://github.com/Bokabiere/Satisfactory-Dashboard)
[![Déploiement](https://img.shields.io/badge/GitHub%20Pages-Pr%C3%AAt-2ecc71?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Bokabiere/Satisfactory-Dashboard)

> **Tableau de bord et compagnon industriel complet pour Satisfactory 1.2** : Planification d'usine, calculateur de pièces uniques, dimensionnement d'usines complètes de jalons & phases, organigrammes SCIM interactifs, guide de construction 2D/3D étape par étape, carte interactive des gisements et checklist de chantier.

---

> [!WARNING]
> ### 🚧 PROJET EN COURS DE DÉVELOPPEMENT (Work In Progress)
> Ce projet est **activement développé** pour la version 1.2 de Satisfactory. De nouvelles fonctionnalités, modèles 3D, schémas d'usines et optimisations d'interface sont ajoutés et ajustés en continu.  
> Les retours et suggestions d'amélioration sont l## 🖥️ Modules & Fonctionnalités du Tableau de Bord

Le tableau de bord regroupe **8 modules spécialisés** directement accessibles depuis la barre de navigation :

```text
[ 📊 Vue Synthétique ]  [ 📋 Jalons & Ascenseur ]  [ 🔬 MAM & Disques Durs ]  [ 🏭 Production & Usines ]  [ ⚡ Centrales & Énergie ]  [ 🚚 Logistique & Transports ]  [ 🏗️ Checklist ]  [ 🗺️ Carte ]
```

---

### 📊 1. Vue Synthétique & Tableau de Bord
* **Synchroniseur & Importateur de Sauvegarde (.SAV) Intégré** : Glissez-déposez directement votre fichier de sauvegarde pour synchroniser en 1 clic vos jalons, phases spatiales, arbres du MAM et recettes alternatives scannées.
* **Tableau de bord récapitulatif** de l'état de votre industrie : technologies disponibles, capacités logistiques, convoyeurs débloqués et recommandations de prochains jalons à construire.
* **Sélecteur de Thèmes FICSIT** : 5 thèmes immersifs (*FICSIT Standard*, *Caterium Cyberpunk*, *Uranium Hazard*, *Schéma Technique*, *Laboratoire Pionnier*).
* **Compteurs en temps réel** : Jalons débloqués et puissance électrique totale du réseau.

---

### 📋 2. Jalons du HUB & Ascenseur Spatial (Paliers 0 à 9 & Phases 1 à 5)
* **Vue Unifiée de la Progression** avec sous-onglets ultra-rapides :
  * **Jalons du HUB** : Suivi interactif des **Paliers 0 à 9**, boutons de saut rapide par palier, boutons Déplier/Replier tout, validation dynamique des bâtiments débloqués et bouton direct *"⚡ Calculer l'Usine pour ce Jalon"*.
  * **Ascenseur Spatial** : Suivi des 5 phases du **Projet Assemblée** (jusqu'au dénouement 1.2), détail des pièces orbitales requises (*Placage intelligent*, *Structure polyvalente*, *Câblage automatisé*, etc.) et dimensionnement instantané de la ligne d'assemblage.

---

### 🔬 3. M.A.M. & Traqueur de Disques Durs (Satisfactory 1.2)
* **Arbres Technologiques Complets (9 branches)** :
  * *Technologie Alien & Dépôt Dimensionnel 1.0* (Sphères de Mercer, Somersloops, vitesse et capacité cloud, Amplificateur de Puissance Alien +500 MW).
  * *Caterium* (Fil actif, Limiteur IA, Connecteurs, Poteaux Mk.2/Mk.3, Géothermie).
  * *Électrolimaces* (Limaces bleues/jaunes/violettes, Overclocking 250%, Synthèse quantique d'éclats).
  * *Quartz*, *Soufre*, *Organismes Alien*, *Mycélia*, *Nutriments*.
* **Simulateur d'Aide au Choix de Disques Durs ("Quelle Recette Choisir parmi 3 ?")** :
  * Évaluation algorithmique instantanée des 3 options d'un scan MAM pour recommander le meilleur choix selon votre palier.
* **Tier-List Dynamique des 100+ Recettes Alternatives** :
  * Classement de **Tier S (Indispensables)** à **Tier D**, avec filtres thématiques (*Stratégie Sans-Vis*, *Économie de Minerai*, *Max Énergie*).
  * Bouton d'activation directe vers le Calculateur de production.

---

### 🏭 4. Calculateur de Production & Usines (Pièces Uniques & Complexes Multi-Lignes)
* **Vue Unifiée avec sous-onglets spécialisés** :
  * **🔩 Pièces Uniques & Lignes Dédiées** :
    * Dimensionnement d'un composant individuel par *Cadence continue (/min)* ou *Fabrication par lot (quantité en temps donné)*.
    * Optimisation automatique par IA (Minimum de machines via recettes alternatives 1.2).
    * Organigramme interactif SCIM zoomable avec drag & drop libre et heatmap énergétique.
    * Guide de montage interactif 3D WebGL (Three.js) & 2D CAD pas à pas.
    * Bouton direct *"🚚 Planifier le Transport Logistique"*.
  * **🏭 Usines Complètes de Jalons & Phases (Multi-Produits)** :
    * Dimensionnement de complexes industriels multi-lignes pour boucler un Jalon ou une Phase de l'Ascenseur en 10 min, 15 min, 30 min, 45 min ou 1h.
    * Optimisation IA globale sur l'ensemble des branches du complexe.
    * Export direct vers la Checklist de Chantier.

---

### ⚡ 5. Simulateur de Centrales Électriques & Réseau FICSIT (1.0 / 1.2)
* **10 Technologies Énergétiques** : Biomasse automatisée, Charbon standard, Charbon compacté, Carburant liquide (250 MW), Turbo-carburant, Carburant de fusée (Rocket Fuel 1.0), Carburant ionisé (Ionized Fuel 1.0), Fission Uranium (2500 MW), Recyclage Ficsonium Zéro Déchet, Géothermie et Amplificateur Alien.
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

## 🛠️ Stack Technique

* **Interface & Rendu** : HTML5, CSS3 Moderne (*FICSIT Dark Industrial Theme*), Canvas 2D, SVG vectoriel interactif.
* **Moteur 3D WebGL** : [Three.js](https://threejs.org/) & OrbitControls pour la visualisation spatiale des complexes industriels.
* **Logique & Algorithmes** : JavaScript ES6+ Vanilla (zéro dépendance lourde, exécution ultra-rapide).
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

- [x] Suivi complet des Paliers 0 à 9 et Phases 1 à 5 de l'Ascenseur Spatial (Satisfactory 1.2).
- [x] Calculateur dédié pour Pièces Uniques et Calculateur dédié pour Usines Complètes de Jalons.
- [x] Organigramme interactif SCIM avec déplacement libre de blocs et mode heatmap.
- [x] Moteur d'optimisation automatique des recettes alternatives (Minimum de machines).
- [x] Visualiseur 3D temps réel WebGL (Three.js) avec modèle interactif des usines.
- [x] Guide de construction visuel 2D CAD étape par étape.
- [x] Carte Canvas interactive avec inspecteur de foreuses, radar de zone et outil de tracé de lignes de transport.
- [x] Simulateur Logistique & Réseaux de Fret (Trains, Drones, Camions & Matrice de rentabilité FICSIT).
- [x] **Arbre Technologique Complet du MAM & Traqueur de Disques Durs (Dépôt Dimensionnel 1.0, Tier-List S/A/B/C/D & Aide au tirage)**.
- [x] Checklist de chantier interactive et fiche d'atelier imprimable.
- [ ] 🟡 *En cours* : Ajout de nouveaux modules de production compacts et verticaux.

---

## 📜 Mentions Légales

* **Satisfactory** est développé par [Coffee Stain Studios](https://www.coffeestainstudios.com/).
* Cet outil est un projet communautaire non-officiel d'aide au jeu.

