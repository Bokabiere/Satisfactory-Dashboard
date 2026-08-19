// Données des technologies énergétiques Satisfactory 1.0 / 1.2
// Spécifications officielles des générateurs, combustibles, recettes alternatives, rendements et plomberie

const POWER_TECHNOLOGIES = {
  // =========================================================================
  // 1. BIOMASSE & BIOCARBURANT
  // =========================================================================
  "biomass_solid": {
    id: "biomass_solid",
    category: "biomass",
    categoryLabel: "Biomasse & Biocarburant",
    name: "Biomasse Solide (Automatisée)",
    recipeType: "standard",
    recipeName: "Standard : Végétation / Bois",
    tier: "Palier 0 - Tutoriel",
    generatorType: "Biomass Generator",
    generatorPowerMW: 30,
    fuelItem: "Biomasse solide",
    fuelEnergyMJ: 450,
    fuelRatePerGen: 4, // 30 MW / 450 MJ * 60 = 4 /min
    waterRatePerGen: 0,
    wasteItem: null,
    wasteRatePerGen: 0,
    icon: "images/buildings/IconDesc_BiomassGenerator_256.png",
    description: "Brûleur à biomasse automatisé (1.0). Convoyable automatiquement.",
    ratiosNote: "Alimentation automatique par convoyeur Mk.1 (débit très faible requis).",
    rawInputs: [
      { item: "Biomasse / Végétation", ratePerGen: 8, isFluid: false, color: "#16a34a", unit: "pièces/min" }
    ],
    upstream: [
      { building: "Constructeur", countRatio: 0.067, outputItem: "Biomasse solide", inputItem: "Biomasse / Feuilles / Bois" }
    ]
  },
  "liquid_biofuel": {
    id: "liquid_biofuel",
    category: "biomass",
    categoryLabel: "Biomasse & Biocarburant",
    name: "Biocarburant Liquide",
    recipeType: "standard",
    recipeName: "Standard : Raffinage Biomasse",
    tier: "Palier 3 - Véhicules",
    generatorType: "Fuel Generator",
    generatorPowerMW: 250,
    fuelItem: "Biocarburant liquide",
    fuelEnergyMJ: 750,
    fuelRatePerGen: 20, // 250 MW / 750 MJ * 60 = 20 m³/min
    waterRatePerGen: 0,
    wasteItem: null,
    wasteRatePerGen: 0,
    icon: "images/buildings/FuelGenerator_256.png",
    description: "Alimente des générateurs à carburant (250 MW) à base de biomasse raffinée.",
    ratiosNote: "1 Raffinerie de Biocarburant liquide (60 m³/min) alimente exactement 3 Générateurs à carburant (750 MW).",
    rawInputs: [
      { item: "Biomasse solide", ratePerGen: 30, isFluid: false, color: "#16a34a", unit: "pièces/min" },
      { item: "Eau brute", ratePerGen: 15, isFluid: true, color: "#38bdf8", unit: "m³/min" }
    ],
    upstream: [
      { building: "Raffinerie", countRatio: 0.333, outputItem: "Biocarburant liquide", inputItem: "Biomasse solide + Eau" }
    ]
  },

  // =========================================================================
  // 2. CHARBON & CHARBON COMPACTÉ
  // =========================================================================
  "coal_standard": {
    id: "coal_standard",
    category: "coal",
    categoryLabel: "Charbon & Vapeur",
    name: "Centrale à Charbon Standard",
    recipeType: "standard",
    recipeName: "Standard : Charbon Brut",
    tier: "Palier 3 - Énergie au charbon",
    generatorType: "Coal Generator",
    generatorPowerMW: 75,
    fuelItem: "Charbon",
    fuelEnergyMJ: 300,
    fuelRatePerGen: 15, // 75 MW / 300 MJ * 60 = 15 /min
    waterRatePerGen: 45, // 45 m³/min d'eau
    wasteItem: null,
    wasteRatePerGen: 0,
    icon: "images/buildings/IconDesc_CoalGenerator_256.png",
    description: "La première source d'énergie 100% autonome et continue de Satisfactory.",
    ratiosNote: "Ratio d'or FICSIT : 3 Extracteurs d'eau (360 m³/min) alimentent exactement 8 Générateurs à charbon (600 MW) et 120 Charbon/min.",
    plumbingGuide: {
      extractors: 3,
      generators: 8,
      pipeSetup: "2 tuyaux Mk.1 (180 m³/min chacun) raccordés aux deux extrémités de la rampe pour équilibrer la pression hydraulique.",
      totalWater: 360,
      totalCoal: 120
    },
    rawInputs: [
      { item: "Charbon brut", ratePerGen: 15, isFluid: false, color: "#475569", unit: "pièces/min" },
      { item: "Eau brute", ratePerGen: 45, isFluid: true, color: "#38bdf8", unit: "m³/min" }
    ],
    upstream: [
      { building: "Extracteur d'eau", countRatio: 0.375, outputItem: "Eau", inputItem: "Nappe d'eau" },
      { building: "Foreuse Mk.1", countRatio: 0.125, outputItem: "Charbon", inputItem: "Gisement de Charbon" }
    ]
  },
  "compacted_coal": {
    id: "compacted_coal",
    category: "coal",
    categoryLabel: "Charbon & Vapeur",
    name: "Centrale au Charbon Compacté",
    recipeType: "alternate",
    recipeName: "Alt : Charbon Compacté (+ Soufre)",
    tier: "Palier 3 - MAM Soufre",
    generatorType: "Coal Generator",
    generatorPowerMW: 75,
    fuelItem: "Charbon compacté",
    fuelEnergyMJ: 630,
    fuelRatePerGen: 7.143, // 75 / 630 * 60 = 7.143 /min
    waterRatePerGen: 45,
    wasteItem: null,
    wasteRatePerGen: 0,
    icon: "images/buildings/IconDesc_CoalGenerator_256.png",
    description: "Mélange de charbon et de soufre doublant l'énergie produite par tonne de charbon miné.",
    ratiosNote: "1 Assembleur de Charbon Compacté (25/min) alimente 3.5 Générateurs à charbon (262.5 MW).",
    plumbingGuide: {
      extractors: 3,
      generators: 8,
      pipeSetup: "3 Extracteurs d'eau à 100% (360 m³/min) ➔ 8 Générateurs (57.14 Charbon compacté/min).",
      totalWater: 360,
      totalCoal: 57.14
    },
    rawInputs: [
      { item: "Charbon brut", ratePerGen: 7.143, isFluid: false, color: "#475569", unit: "pièces/min" },
      { item: "Minerai de Soufre", ratePerGen: 7.143, isFluid: false, color: "#eab308", unit: "pièces/min" },
      { item: "Eau brute", ratePerGen: 45, isFluid: true, color: "#38bdf8", unit: "m³/min" }
    ],
    upstream: [
      { building: "Assembleur", countRatio: 0.286, outputItem: "Charbon compacté", inputItem: "Charbon + Soufre (25/min)" },
      { building: "Extracteur d'eau", countRatio: 0.375, outputItem: "Eau", inputItem: "Nappe d'eau" }
    ]
  },

  // =========================================================================
  // 3. CARBURANT PÉTROLIER & DILUÉ
  // =========================================================================
  "fuel_standard": {
    id: "fuel_standard",
    category: "fuel",
    categoryLabel: "Carburant Pétrolier",
    name: "Carburant Liquide (Fuel Standard)",
    recipeType: "standard",
    recipeName: "Standard : Raffinage Direct",
    tier: "Palier 5 - Raffinage de pétrole",
    generatorType: "Fuel Generator",
    generatorPowerMW: 250,
    fuelItem: "Carburant",
    fuelEnergyMJ: 750,
    fuelRatePerGen: 20, // 250 / 750 * 60 = 20 m³/min
    waterRatePerGen: 0,
    wasteItem: null,
    wasteRatePerGen: 0,
    icon: "images/buildings/FuelGenerator_256.png",
    description: "Centrale thermique au carburant standard (250 MW par générateur en Satisfactory 1.0/1.2).",
    ratiosNote: "1 Tuyau Mk.1 plein (300 m³/min) alimente exactement 15 Générateurs à carburant = 3 750 MW.",
    plumbingGuide: {
      extractors: 0,
      generators: 15,
      pipeSetup: "1 Tuyau Mk.1 (300 m³/min) ou 1 Tuyau Mk.2 (600 m³/min pour 30 générateurs = 7 500 MW).",
      totalWater: 0,
      totalFuel: 300
    },
    rawInputs: [
      { item: "Pétrole brut", ratePerGen: 30, isFluid: true, color: "#0f172a", unit: "m³/min" }
    ],
    upstream: [
      { building: "Raffinerie (Carburant)", countRatio: 0.5, outputItem: "Carburant (40 m³/min)", inputItem: "Pétrole brut (60 m³/min)" },
      { building: "Broyeur / Constructeur", countRatio: 0.25, outputItem: "Gestion Résine polymère", inputItem: "Résine polymère" }
    ]
  },
  "fuel_diluted": {
    id: "fuel_diluted",
    category: "fuel",
    categoryLabel: "Carburant Pétrolier",
    name: "Carburant Dilué (Diluted Fuel - Mélangeur)",
    recipeType: "alternate",
    recipeName: "Alt : Carburant Dilué (Mélangeur)",
    tier: "Palier 7 - Mélangeur & Fluides",
    generatorType: "Fuel Generator",
    generatorPowerMW: 250,
    fuelItem: "Carburant",
    fuelEnergyMJ: 750,
    fuelRatePerGen: 20, // 20 m³/min
    waterRatePerGen: 0,
    wasteItem: null,
    wasteRatePerGen: 0,
    icon: "images/buildings/FuelGenerator_256.png",
    description: "La meilleure recette de Satisfactory : double la production de carburant par m³ de pétrole grâce à l'eau !",
    ratiosNote: "50 Résidu de pétrole lourd + 100 Eau ➔ 100 Carburant (Rendement pétrole doublé : seulement 15 m³/min de pétrole brut par générateur !)",
    plumbingGuide: {
      extractors: 3,
      generators: 15,
      pipeSetup: "Mélangeur : Injection d'eau (100 m³/min) + Résidu lourd ➔ 100 m³/min de carburant continu.",
      totalWater: 300,
      totalFuel: 300
    },
    rawInputs: [
      { item: "Pétrole brut", ratePerGen: 15.0, isFluid: true, color: "#0f172a", unit: "m³/min" },
      { item: "Eau brute", ratePerGen: 20.0, isFluid: true, color: "#38bdf8", unit: "m³/min" }
    ],
    upstream: [
      { building: "Raffinerie (Résidu lourd)", countRatio: 0.25, outputItem: "Résidu de pétrole lourd", inputItem: "Pétrole brut (30 m³/min)" },
      { building: "Mélangeur (Carburant dilué)", countRatio: 0.2, outputItem: "Carburant (100 m³/min)", inputItem: "Résidu lourd + Eau" },
      { building: "Extracteur d'eau", countRatio: 0.167, outputItem: "Eau", inputItem: "Nappe d'eau" }
    ]
  },

  // =========================================================================
  // 4. TURBO-CARBURANT (TURBOFUEL)
  // =========================================================================
  "turbofuel": {
    id: "turbofuel",
    category: "turbofuel",
    categoryLabel: "Turbo-Carburant (Turbofuel)",
    name: "Turbo-carburant Standard (Raffinerie)",
    recipeType: "standard",
    recipeName: "Standard : Carburant + Charbon Compacté",
    tier: "Palier 5 - MAM Soufre / Pétrole",
    generatorType: "Fuel Generator",
    generatorPowerMW: 250,
    fuelItem: "Turbo-carburant",
    fuelEnergyMJ: 2000,
    fuelRatePerGen: 7.5, // 250 / 2000 * 60 = 7.5 m³/min
    waterRatePerGen: 0,
    wasteItem: null,
    wasteRatePerGen: 0,
    icon: "images/buildings/FuelGenerator_256.png",
    description: "Carburant surpuissant combinant résidus pétroliers et charbon compacté pour une autonomie gigantesque.",
    ratiosNote: "1 Tuyau Mk.1 plein (300 m³/min de Turbofuel) alimente 40 Générateurs à carburant = 10 000 MW !",
    plumbingGuide: {
      extractors: 0,
      generators: 40,
      pipeSetup: "Tuyau Mk.1 (300 m³/min) distribué sur une double ligne de 20 générateurs en boucle fermée.",
      totalWater: 0,
      totalFuel: 300
    },
    rawInputs: [
      { item: "Pétrole brut", ratePerGen: 13.5, isFluid: true, color: "#0f172a", unit: "m³/min" },
      { item: "Charbon brut", ratePerGen: 6.0, isFluid: false, color: "#475569", unit: "pièces/min" },
      { item: "Minerai de Soufre", ratePerGen: 6.0, isFluid: false, color: "#eab308", unit: "pièces/min" }
    ],
    upstream: [
      { building: "Raffinerie (Turbofuel)", countRatio: 0.25, outputItem: "Turbo-carburant (30 m³/min)", inputItem: "Carburant + Charbon compacté" },
      { building: "Assembleur (Charbon compacté)", countRatio: 0.24, outputItem: "Charbon compacté", inputItem: "Charbon + Soufre" }
    ]
  },
  "turbofuel_blend": {
    id: "turbofuel_blend",
    category: "turbofuel",
    categoryLabel: "Turbo-Carburant (Turbofuel)",
    name: "Turbo-carburant Mélangé (Turbo Blend Fuel - Mélangeur)",
    recipeType: "alternate",
    recipeName: "Alt : Turbofuel Mélangé (Mélangeur)",
    tier: "Palier 7 - MAM Soufre / Mélangeur",
    generatorType: "Fuel Generator",
    generatorPowerMW: 250,
    fuelItem: "Turbo-carburant",
    fuelEnergyMJ: 2000,
    fuelRatePerGen: 7.5,
    waterRatePerGen: 0,
    wasteItem: null,
    wasteRatePerGen: 0,
    icon: "images/buildings/FuelGenerator_256.png",
    description: "Recette alternative au mélangeur éliminant le besoin de compacter le charbon : consomme directement du soufre brut et du pétrole brut !",
    ratiosNote: "Mélangeur : 15 Carburant + 30 Résidu lourd + 22.5 Soufre + 15 Pétrole brut ➔ 45 Turbofuel/min.",
    plumbingGuide: {
      extractors: 0,
      generators: 40,
      pipeSetup: "Alimentation directe au mélangeur sans passer par les assembleuses de charbon.",
      totalWater: 0,
      totalFuel: 300
    },
    rawInputs: [
      { item: "Pétrole brut", ratePerGen: 8.44, isFluid: true, color: "#0f172a", unit: "m³/min" },
      { item: "Minerai de Soufre", ratePerGen: 3.75, isFluid: false, color: "#eab308", unit: "pièces/min" }
    ],
    upstream: [
      { building: "Mélangeur (Turbo Blend)", countRatio: 0.167, outputItem: "Turbo-carburant (45 m³/min)", inputItem: "Carburant + Résidu + Pétrole + Soufre" }
    ]
  },

  // =========================================================================
  // 5. CARBURANT DE FUSÉE (ROCKET FUEL 1.0)
  // =========================================================================
  "rocket_fuel": {
    id: "rocket_fuel",
    category: "rocket_fuel",
    categoryLabel: "Carburant de Fusée (1.0)",
    name: "Carburant de Fusée Standard (Rocket Fuel)",
    recipeType: "standard",
    recipeName: "Standard : Turbofuel + Azote + Acide",
    tier: "Palier 7 - Conversion avancée 1.0",
    generatorType: "Fuel Generator",
    generatorPowerMW: 250,
    fuelItem: "Carburant de fusée",
    fuelEnergyMJ: 3600,
    fuelRatePerGen: 4.167, // 250 / 3600 * 60 = 4.1667 m³/min
    waterRatePerGen: 0,
    wasteItem: null,
    wasteRatePerGen: 0,
    icon: "images/buildings/FuelGenerator_256.png",
    description: "Nouveau carburant 1.0 combinant Turbocarburant, Acide Nitrique et Azote. Rendement phénoménal.",
    ratiosNote: "1 Mélangeur de Rocket Fuel (100 m³/min) alimente exactement 24 Générateurs à carburant = 6 000 MW.",
    plumbingGuide: {
      extractors: 0,
      generators: 24,
      pipeSetup: "100 m³/min de Rocket Fuel vers 24 générateurs (4.167 m³/min chacun).",
      totalWater: 0,
      totalFuel: 100
    },
    rawInputs: [
      { item: "Pétrole brut", ratePerGen: 4.5, isFluid: true, color: "#0f172a", unit: "m³/min" },
      { item: "Gaz d'Azote", ratePerGen: 3.58, isFluid: true, color: "#a855f7", unit: "m³/min" },
      { item: "Charbon brut", ratePerGen: 2.0, isFluid: false, color: "#475569", unit: "pièces/min" },
      { item: "Minerai de Soufre", ratePerGen: 2.0, isFluid: false, color: "#eab308", unit: "pièces/min" },
      { item: "Eau brute", ratePerGen: 0.38, isFluid: true, color: "#38bdf8", unit: "m³/min" },
      { item: "Minerai de Fer", ratePerGen: 0.38, isFluid: false, color: "#ea580c", unit: "pièces/min" }
    ],
    upstream: [
      { building: "Mélangeur (Rocket Fuel)", countRatio: 0.0417, outputItem: "Rocket Fuel (100 m³/min)", inputItem: "Turbofuel + Acide Nitrique + Azote" }
    ]
  },
  "rocket_fuel_nitro": {
    id: "rocket_fuel_nitro",
    category: "rocket_fuel",
    categoryLabel: "Carburant de Fusée (1.0)",
    name: "Nitro Rocket Fuel (Recette Alt)",
    recipeType: "alternate",
    recipeName: "Alt : Nitro Rocket Fuel (Sans Acide)",
    tier: "Palier 7 - Disque dur 1.0",
    generatorType: "Fuel Generator",
    generatorPowerMW: 250,
    fuelItem: "Carburant de fusée",
    fuelEnergyMJ: 3600,
    fuelRatePerGen: 4.167,
    waterRatePerGen: 0,
    wasteItem: null,
    wasteRatePerGen: 0,
    icon: "images/buildings/FuelGenerator_256.png",
    description: "Recette alternative 1.0 ultra-simplifiée produisant du Rocket Fuel directement à partir de Carburant, Résidu lourd, Azote et Soufre, sans aucune étape d'acide nitrique ni eau !",
    ratiosNote: "Mélangeur : 120 Carburant + 60 Résidu + 150 Azote + 100 Soufre ➔ 250 Rocket Fuel/min (Alimente 60 Générateurs = 15 000 MW !).",
    plumbingGuide: {
      extractors: 0,
      generators: 60,
      pipeSetup: "Injection directe d'Azote et de Carburant dans le mélangeur.",
      totalWater: 0,
      totalFuel: 250
    },
    rawInputs: [
      { item: "Pétrole brut", ratePerGen: 3.8, isFluid: true, color: "#0f172a", unit: "m³/min" },
      { item: "Gaz d'Azote", ratePerGen: 2.5, isFluid: true, color: "#a855f7", unit: "m³/min" },
      { item: "Minerai de Soufre", ratePerGen: 1.67, isFluid: false, color: "#eab308", unit: "pièces/min" }
    ],
    upstream: [
      { building: "Mélangeur (Nitro Rocket)", countRatio: 0.0167, outputItem: "Rocket Fuel (250 m³/min)", inputItem: "Carburant + Résidu + Azote + Soufre" }
    ]
  },

  // =========================================================================
  // 6. COMBUSTIBLE IONISÉ (IONIZED FUEL 1.0)
  // =========================================================================
  "ionized_fuel": {
    id: "ionized_fuel",
    category: "ionized_fuel",
    categoryLabel: "Combustible Quantique (1.0)",
    name: "Carburant Ionisé (Ionized Fuel)",
    recipeType: "standard",
    recipeName: "Standard : Rocket Fuel + Cristaux Noirs",
    tier: "Palier 9 - Technologie Quantique 1.0",
    generatorType: "Fuel Generator",
    generatorPowerMW: 250,
    fuelItem: "Carburant ionisé",
    fuelEnergyMJ: 5000,
    fuelRatePerGen: 3.0, // 250 / 5000 * 60 = 3 m³/min
    waterRatePerGen: 0,
    wasteItem: null,
    wasteRatePerGen: 0,
    icon: "images/buildings/FuelGenerator_256.png",
    description: "Carburant quantique ultime utilisant des cristaux de matière noire. Densité maximale.",
    ratiosNote: "1 Convertisseur (40 m³/min) alimente 13.33 Générateurs = 3 333 MW.",
    plumbingGuide: {
      extractors: 0,
      generators: 13.33,
      pipeSetup: "Débit ultra-faible : 3 m³/min par générateur.",
      totalWater: 0,
      totalFuel: 40
    },
    rawInputs: [
      { item: "Pétrole brut", ratePerGen: 3.24, isFluid: true, color: "#0f172a", unit: "m³/min" },
      { item: "Gaz d'Azote", ratePerGen: 2.58, isFluid: true, color: "#a855f7", unit: "m³/min" },
      { item: "Charbon brut", ratePerGen: 1.44, isFluid: false, color: "#475569", unit: "pièces/min" },
      { item: "Minerai de Soufre", ratePerGen: 1.44, isFluid: false, color: "#eab308", unit: "pièces/min" },
      { item: "Cristaux de Matière Noire", ratePerGen: 0.19, isFluid: false, color: "#ec4899", unit: "pièces/min" }
    ],
    upstream: [
      { building: "Convertisseur / Raffinerie", countRatio: 0.075, outputItem: "Ionized Fuel (40 m³/min)", inputItem: "Rocket Fuel + Cristaux de matière noire" }
    ]
  },
  "ionized_fuel_dark": {
    id: "ionized_fuel_dark",
    category: "ionized_fuel",
    categoryLabel: "Combustible Quantique (1.0)",
    name: "Dark Ionized Fuel (Recette Alt Quantique)",
    recipeType: "alternate",
    recipeName: "Alt : Dark Ionized Fuel",
    tier: "Palier 9 - Convertisseur Quantique",
    generatorType: "Fuel Generator",
    generatorPowerMW: 250,
    fuelItem: "Carburant ionisé",
    fuelEnergyMJ: 5000,
    fuelRatePerGen: 3.0,
    waterRatePerGen: 0,
    wasteItem: null,
    wasteRatePerGen: 0,
    icon: "images/buildings/FuelGenerator_256.png",
    description: "Synthèse quantique accélérée dans le convertisseur utilisant du carburant condensé.",
    ratiosNote: "Alimente jusqu'à 30 Générateurs pour 7 500 MW avec un seul convertisseur quantique overclocké.",
    plumbingGuide: {
      extractors: 0,
      generators: 30,
      pipeSetup: "Réseau de distribution cryogénique à débit réduit.",
      totalWater: 0,
      totalFuel: 90
    },
    rawInputs: [
      { item: "Pétrole brut", ratePerGen: 2.8, isFluid: true, color: "#0f172a", unit: "m³/min" },
      { item: "Gaz d'Azote", ratePerGen: 2.2, isFluid: true, color: "#a855f7", unit: "m³/min" },
      { item: "Minerai de Soufre", ratePerGen: 1.2, isFluid: false, color: "#eab308", unit: "pièces/min" },
      { item: "Cristaux de Matière Noire", ratePerGen: 0.15, isFluid: false, color: "#ec4899", unit: "pièces/min" }
    ],
    upstream: [
      { building: "Convertisseur Quantique", countRatio: 0.05, outputItem: "Dark Ionized Fuel", inputItem: "Nitro Rocket + Cristaux Noirs" }
    ]
  },

  // =========================================================================
  // 7. ÉNERGIE NUCLÉAIRE (URANIUM, PLUTONIUM & FICSONIUM 1.0)
  // =========================================================================
  "nuclear_uranium": {
    id: "nuclear_uranium",
    category: "nuclear",
    categoryLabel: "Énergie Nucléaire (Fission)",
    name: "Nucléaire Uranium Standard",
    recipeType: "standard",
    recipeName: "Standard : Barres d'Uranium (0.2/min)",
    tier: "Palier 8 - Énergie Nucléaire",
    generatorType: "Nuclear Power Plant",
    generatorPowerMW: 2500,
    fuelItem: "Barre de combustible d'uranium",
    fuelEnergyMJ: 750000,
    fuelRatePerGen: 0.2, // 2500 / 750000 * 60 = 0.2 /min (1 barre toutes les 5 minutes)
    waterRatePerGen: 240, // 240 m³/min d'eau
    wasteItem: "Déchets d'uranium",
    wasteRatePerGen: 10, // 10 déchets/min par réacteur
    icon: "images/buildings/IconDesc_HadronCollider_256.png",
    description: "Centrale à fission atomique produisant 2 500 MW par réacteur. Rejette des déchets radioactifs.",
    ratiosNote: "1 Réacteur Nucléaire nécessite 240 m³/min d'eau (2 Extracteurs d'eau à 100% ou 1 à 200%) et 0.2 Barre/min.",
    plumbingGuide: {
      extractors: 2,
      generators: 1,
      pipeSetup: "1 Tuyau Mk.1 indépendant (240 m³/min) dédié par tranche de 1 Réacteur Nucléaire pour garantir 100% de fiabilité.",
      totalWater: 240,
      totalFuel: 0.2
    },
    rawInputs: [
      { item: "Minerai d'Uranium", ratePerGen: 10.0, isFluid: false, color: "#22c55e", unit: "pièces/min" },
      { item: "Eau brute", ratePerGen: 246.0, isFluid: true, color: "#38bdf8", unit: "m³/min" },
      { item: "Minerai de Soufre", ratePerGen: 6.0, isFluid: false, color: "#eab308", unit: "pièces/min" },
      { item: "Minerai de Cuivre", ratePerGen: 16.0, isFluid: false, color: "#f97316", unit: "pièces/min" },
      { item: "Minerai de Fer", ratePerGen: 15.0, isFluid: false, color: "#94a3b8", unit: "pièces/min" },
      { item: "Minerai de Caterium", ratePerGen: 6.0, isFluid: false, color: "#fbbf24", unit: "pièces/min" },
      { item: "Calcaire", ratePerGen: 9.0, isFluid: false, color: "#e2e8f0", unit: "pièces/min" }
    ],
    upstream: [
      { building: "Manufacturier (Barres)", countRatio: 0.67, outputItem: "Barre de combustible (0.3/min)", inputItem: "Uranium encapsulé + Poutres + Rotors" },
      { building: "Extracteur d'eau", countRatio: 2.0, outputItem: "Eau (240 m³/min)", inputItem: "Nappe d'eau" }
    ]
  },
  "nuclear_uranium_alt": {
    id: "nuclear_uranium_alt",
    category: "nuclear",
    categoryLabel: "Énergie Nucléaire (Fission)",
    name: "Nucléaire Uranium Infusé (Infused Uranium)",
    recipeType: "alternate",
    recipeName: "Alt : Barres d'Uranium Infusé (-40% Uranium)",
    tier: "Palier 8 - Disques Durs Nucléaire",
    generatorType: "Nuclear Power Plant",
    generatorPowerMW: 2500,
    fuelItem: "Barre de combustible d'uranium",
    fuelEnergyMJ: 750000,
    fuelRatePerGen: 0.2,
    waterRatePerGen: 240,
    wasteItem: "Déchets d'uranium",
    wasteRatePerGen: 10,
    icon: "images/buildings/IconDesc_HadronCollider_256.png",
    description: "Recette alternative combinant Uranium, Silice et Soufre pour économiser 40% d'Uranium brut par MWh généré !",
    ratiosNote: "Permet d'atteindre plus de 50 000 MW avec un seul gisement d'Uranium Pur.",
    plumbingGuide: {
      extractors: 2,
      generators: 1,
      pipeSetup: "1 Tuyau Mk.1 indépendant (240 m³/min) par réacteur.",
      totalWater: 240,
      totalFuel: 0.2
    },
    rawInputs: [
      { item: "Minerai d'Uranium", ratePerGen: 6.0, isFluid: false, color: "#22c55e", unit: "pièces/min" },
      { item: "Eau brute", ratePerGen: 244.0, isFluid: true, color: "#38bdf8", unit: "m³/min" },
      { item: "Minerai de Soufre", ratePerGen: 4.5, isFluid: false, color: "#eab308", unit: "pièces/min" },
      { item: "Quartz brut (Silice)", ratePerGen: 12.0, isFluid: false, color: "#ec4899", unit: "pièces/min" },
      { item: "Minerai de Fer", ratePerGen: 10.0, isFluid: false, color: "#94a3b8", unit: "pièces/min" },
      { item: "Calcaire", ratePerGen: 6.0, isFluid: false, color: "#e2e8f0", unit: "pièces/min" }
    ],
    upstream: [
      { building: "Manufacturier (Unit Rod)", countRatio: 0.5, outputItem: "Barre d'Uranium Infusé", inputItem: "Cellules infusées + Silice" },
      { building: "Extracteur d'eau", countRatio: 2.0, outputItem: "Eau", inputItem: "Nappe d'eau" }
    ]
  },
  "nuclear_ficsonium": {
    id: "nuclear_ficsonium",
    category: "nuclear",
    categoryLabel: "Énergie Nucléaire (Fission)",
    name: "Nucléaire Zéro Déchet Ficsonium (1.0)",
    recipeType: "alternate",
    recipeName: "Zéro Déchet 1.0 : Barres de Ficsonium",
    tier: "Palier 9 - Ficsonium & Recyclage 1.0",
    generatorType: "Nuclear Power Plant",
    generatorPowerMW: 2500,
    fuelItem: "Barre de combustible de Ficsonium",
    fuelEnergyMJ: 500000,
    fuelRatePerGen: 0.3, // 2500 / 500000 * 60 = 0.3 /min
    waterRatePerGen: 240,
    wasteItem: "Déchets de Ficsonium (100% Broyables au Broyeur A.W.E.S.O.M.E.)",
    wasteRatePerGen: 0,
    icon: "images/buildings/IconDesc_HadronCollider_256.png",
    description: "Recyclage complet des déchets d'uranium et de plutonium en Ficsonium pour un complexe nucléaire à résidus zéro.",
    ratiosNote: "Rejet zéro : Le cycle Ficsonium consomme l'intégralité des sous-produits nucléaires sans stockage infini.",
    plumbingGuide: {
      extractors: 2,
      generators: 1,
      pipeSetup: "240 m³/min d'eau par réacteur + boucle de réinjection des condensats.",
      totalWater: 240,
      totalFuel: 0.3
    },
    rawInputs: [
      { item: "Eau brute", ratePerGen: 240.0, isFluid: true, color: "#38bdf8", unit: "m³/min" },
      { item: "Plutonium résiduel", ratePerGen: 0.6, isFluid: false, color: "#a855f7", unit: "pièces/min" },
      { item: "Trigone sombre", ratePerGen: 0.3, isFluid: false, color: "#6366f1", unit: "pièces/min" }
    ],
    upstream: [
      { building: "Accélérateur de particules", countRatio: 0.5, outputItem: "Barre de Ficsonium", inputItem: "Plutonium résiduel + Trigone sombre" },
      { building: "Extracteur d'eau", countRatio: 2.0, outputItem: "Eau", inputItem: "Nappe d'eau" }
    ]
  },

  // =========================================================================
  // 8. ÉNERGIES VERTES & ALIEN
  // =========================================================================
  "geothermal": {
    id: "geothermal",
    category: "alien",
    categoryLabel: "Énergies Propres & Alien",
    name: "Générateur Géothermique",
    recipeType: "standard",
    recipeName: "Standard : Puits Géothermique Naturel",
    tier: "Palier 6 - MAM Quartz / Caterium",
    generatorType: "Geothermal Generator",
    generatorPowerMW: 200, // Moyenne ~200 MW
    fuelItem: "Énergie géothermique",
    fuelEnergyMJ: 1,
    fuelRatePerGen: 0,
    waterRatePerGen: 0,
    wasteItem: null,
    wasteRatePerGen: 0,
    icon: "images/buildings/GeoThermalPowerGenerator_256.png",
    description: "Énergie propre 100% gratuite sans combustible ni eau, implantée sur les Geysers de la carte.",
    ratiosNote: "Geyser Impur : 50-150 MW (Moyenne 100 MW) | Normal : 100-300 MW (Moyenne 200 MW) | Pur : 200-600 MW (Moyenne 400 MW).",
    plumbingGuide: null,
    rawInputs: [
      { item: "Geyser actif", ratePerGen: 1.0, isFluid: false, color: "#06b6d4", unit: "emplacement(s)" }
    ],
    upstream: []
  },
  "alien_augmenter": {
    id: "alien_augmenter",
    category: "alien",
    categoryLabel: "Énergies Propres & Alien",
    name: "Amplificateur d'Énergie Alien (1.0)",
    recipeType: "standard",
    recipeName: "Standard : Sphère Mercer Alien",
    tier: "MAM - Technologie Alien 1.0",
    generatorType: "Alien Power Augmenter",
    generatorPowerMW: 500, // +500 MW fixes + 10% sur tout le réseau
    fuelItem: "Sphère Mercer / Énergie Alien",
    fuelEnergyMJ: 1,
    fuelRatePerGen: 0,
    waterRatePerGen: 0,
    wasteItem: null,
    wasteRatePerGen: 0,
    icon: "images/buildings/IconDesc_AlienPowerAugmenter_256.png",
    description: "Bâtiment alien (1.0) produisant 500 MW fixes et multipliant la production globale de TOUT votre réseau de +10% !",
    ratiosNote: "Placez-en plusieurs pour cumuler l'effet multiplicateur (+10% par bâtiment) sur une centrale géante de plusieurs dizaines de Gigawatts.",
    plumbingGuide: null,
    rawInputs: [
      { item: "Sphère Mercer", ratePerGen: 1.0, isFluid: false, color: "#d946ef", unit: "sphère(s)" }
    ],
    upstream: []
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { POWER_TECHNOLOGIES };
}

