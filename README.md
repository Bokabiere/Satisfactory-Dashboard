# 🏭 FICSIT Factory Companion — Satisfactory Dashboard

[![Satisfactory Version](https://img.shields.io/badge/Satisfactory-1.0%20%2B%20%7C%201.2-fa9549?style=for-the-badge&logo=unrealengine&logoColor=white)](https://www.satisfactorygame.com/)
[![Statut du Projet](https://img.shields.io/badge/Statut-En%20cours%20de%20d%C3%A9veloppement%20(WIP)-f3c11b?style=for-the-badge&logo=git&logoColor=black)](https://github.com/)
[![Application](https://img.shields.io/badge/Application-100%25%20Standalone-4bb3fd?style=for-the-badge&logo=javascript&logoColor=white)](https://github.com/)
[![Déploiement](https://img.shields.io/badge/GitHub%20Pages-Pr%C3%AAt-2ecc71?style=for-the-badge&logo=github&logoColor=white)](https://github.com/)

> **Tableau de bord et compagnon industriel pour Satisfactory 1.0+** : Planification d'usine, calculateur de production avec recettes alternatives, guide de construction 2D étape par étape, carte interactive des gisements et checklist de chantier.

---

> [!WARNING]
> ### 🚧 PROJET EN COURS DE DÉVELOPPEMENT (Work In Progress)
> Ce projet est **activement développé**. De nouvelles fonctionnalités, blueprints, schémas d'usines et optimisations d'interface sont ajoutés et ajustés au fil des versions de Satisfactory.  
> Les retours et suggestions d'amélioration sont les bienvenus !

---

## 🖥️ Fonctionnalités du Tableau de Bord

Le tableau de bord regroupe 6 modules directement accessibles depuis la barre de navigation :

```text
[ 📊 Vue Synthétique ]  [ 📋 Jalons du HUB ]  [ 🚀 Ascenseur Spatial ]  [ ⚙️ Calculateur ]  [ 🏗️ Checklist ]  [ 🗺️ Carte ]
```

---

### 📊 1. Vue Synthétique
* **Statistiques en direct** dans le bandeau supérieur (nombre de jalons accomplis, puissance électrique totale calculée).
* **Tableau de bord récapitulatif** de l'état de votre industrie : technologies disponibles, capacités logistiques et recommandations.

---

### 📋 2. Jalons du HUB (Paliers 0 à 9)
* Suivi interactif des **Paliers 0 à 9** avec barre de saut rapide d'un palier à l'autre.
* Cochez vos jalons validés pour actualiser dynamiquement la liste des machines, recettes et infrastructures débloquées.
* Visualisation des coûts en matériaux pour chaque jalon.

---

### 🚀 3. Ascenseur Spatial (Phases 1 à 5)
* Suivi des 5 grandes phases du **Projet Assemblée** (jusqu'à la phase finale de Satisfactory 1.0).
* Détail des pièces d'ascenseur spatial requises (*Plaquage intelligent*, *Structure polyvalente*, *Câblage automatisé*, etc.).

---

### ⚙️ 4. Calculateur de Production & Guide d'Implantation 2D
* **Calcul des chaînes de production** avec sélection des recettes standards et alternatives.
* Intégration des mécaniques 1.0 :
  * ⚡ **Overclocking jusqu'à 250%** (calcul du nombre d'Éclats de charge requis).
  * 🌀 **Multiplicateur Somersloop (x2)** pour doubler la production.
* **Guide de construction interactif étape par étape** :
  * 📐 **Plan d'implantation 2D (CAD / SVG)** pour visualiser le placement des fondations, machines et convoyeurs.
  * 🎒 **Shopping List de l'étape** : liste exacte des matériaux d'inventaire nécessaires.
* **Bilan énergétique & matières premières** : calcul en temps réel des MW consommés et du minerai brut nécessaire.
* Bouton d'export direct vers la **Checklist de chantier**.

---

### 🏗️ 5. Checklist de Chantier
* Liste interactive des machines et matériaux à emporter sur le terrain.
* Possibilité de cocher chaque élément au fur et à mesure de la construction.
* **Fiche récapitulative d'usine** : vue épurée et imprimable pour consultation sur second écran ou papier.

---

### 🗺️ 6. Carte Interactive des Ressources
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

* **Interface & Rendu** : HTML5, CSS3 Moderne (*FICSIT Dark Industrial Theme*), Canvas 2D, SVG.
* **Logique** : JavaScript ES6+ Vanilla (zéro framework lourd, performances optimales).
* **Format** : Page web 100% autonome (*Standalone*), utilisable hors-ligne ou hébergée sur GitHub Pages.

---

## 🚀 Utilisation Rapide

### Utilisation en local
1. Clonez le dépôt :
   ```bash
   git clone https://github.com/Bokabiere/Satisfactory-Dashboard.git
   ```
2. Ouvrez simplement le fichier `index.html` dans votre navigateur Web.

### Déploiement GitHub Pages
Activez GitHub Pages dans les options de votre dépôt GitHub (`Settings > Pages > Branch : main`) pour accéder à votre tableau de bord depuis n'importe quel écran ou tablette.

---

## 🗺️ Feuille de Route (Roadmap)

- [x] Suivi complet des Paliers 0 à 9 et Phases 1 à 5 de l'Ascenseur Spatial.
- [x] Calculateur de ratios avec recettes alternatives, Overclocking et Somersloops.
- [x] Guide de construction visuel 2D CAD étape par étape.
- [x] Carte Canvas interactive avec inspecteur de foreuses et radar de zone.
- [x] Checklist de chantier interactive et fiche récapitulative.
- [ ] 🟡 *En cours* : Ajout de nouveaux plans d'usines compacts et modulaires.
- [ ] 🟡 *En cours* : Amélioration des schémas d'implantation pour usines multi-niveaux.
- [ ] ⏳ *À venir* : Module de suivi de l'arbre technologique du MAM.

---

## 📜 Mentions Légales

* **Satisfactory** est développé par [Coffee Stain Studios](https://www.coffeestainstudios.com/).
* Cet outil est un projet communautaire non-officiel d'aide au jeu.
