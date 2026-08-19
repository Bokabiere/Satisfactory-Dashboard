// Base de données Logistique & Transports pour Satisfactory 1.2
// Spécifications officielles des véhicules, carburants, gares, conteneurs et signalisation

const LOGISTICS_DATA = {
  // 1. Spécifications des modes de transport
  modes: {
    train: {
      id: "train",
      name: "Monorail Ferroviaire FICSIT",
      icon: "🚂",
      category: "Rail",
      speedKmh: 120, // 33.33 m/s
      dockTimeSec: 25, // Temps de gel du quai pendant le chargement / déchargement
      locomotive: {
        name: "Locomotive Électrique",
        powerMinMW: 25,
        powerMaxMW: 110,
        powerAvgMW: 65,
        idealWagonRatio: 4, // 1 loco pour 4 wagons sur terrain plat / 1:2 en forte pente
        cost: { "heavy_modular_frame": 5, "motor": 10, "steel_pipe": 15, "rubber": 10 }
      },
      freightCar: {
        name: "Wagon de Fret",
        capacitySlots: 32,
        cost: { "heavy_modular_frame": 3, "steel_pipe": 20, "steel_beam": 10 }
      },
      fluidFreightCar: {
        name: "Wagon-Citerne",
        capacityM3: 2400,
        cost: { "heavy_modular_frame": 3, "steel_pipe": 20, "motor": 2 }
      },
      station: {
        name: "Gare Ferroviaire",
        powerMW: 50,
        cost: { "heavy_modular_frame": 10, "motor": 10, "steel_pipe": 20, "circuit_board": 5 }
      },
      freightPlatform: {
        name: "Plateforme de Fret",
        powerMW: 50,
        capacitySlots: 32,
        inputs: 2,
        outputs: 2,
        cost: { "heavy_modular_frame": 5, "cable": 20, "steel_pipe": 15, "concrete": 50 }
      },
      fluidFreightPlatform: {
        name: "Plateforme de Fret Fluide",
        powerMW: 50,
        capacityM3: 2400,
        inputs: 2,
        outputs: 2,
        cost: { "heavy_modular_frame": 5, "motor": 5, "steel_pipe": 25, "concrete": 50 }
      },
      trackCostPer100m: {
        "steel_pipe": 10,
        "steel_beam": 10
      }
    },

    drone: {
      id: "drone",
      name: "Drone de Fret Aérien FICSIT",
      icon: "🛸",
      category: "Aérien",
      cruiseSpeedMs: 70, // 252 km/h
      takeoffLandingSec: 40, // 20s au départ + 20s à l'arrivée
      capacitySlots: 9,
      port: {
        name: "Port de Drone",
        powerActiveMW: 100,
        powerIdleMW: 10,
        internalBatteryBuffer: 200,
        capacitySlots: 36,
        cost: { "heavy_modular_frame": 20, "aluminum_sheet": 20, "circuit_board": 10, "motor": 10 }
      },
      droneVehicle: {
        name: "Drone FICSIT",
        cost: { "motor": 4, "aluminum_sheet": 10, "radio_control_unit": 1, "ai_limiter": 2 }
      },
      batteryFormula: (distM) => Math.max(4, Math.ceil(5 + (distM / 1000) * 2)) // Batteries par aller-retour
    },

    vehicles: {
      tractor: {
        id: "tractor",
        name: "Tracteur FICSIT",
        icon: "🚜",
        speedKmh: 55,
        capacitySlots: 25,
        burnRateMW: 100, // 100 MW de puissance consommée en roulant
        dockTimeSec: 20,
        cost: { "modular_frame": 5, "rotor": 5, "reinforced_iron_plate": 10 }
      },
      truck: {
        id: "truck",
        name: "Camion Lourd FICSIT",
        icon: "🚛",
        speedKmh: 50,
        capacitySlots: 48,
        burnRateMW: 200,
        dockTimeSec: 20,
        cost: { "heavy_modular_frame": 10, "motor": 15, "circuit_board": 10, "rubber": 20 }
      },
      explorer: {
        id: "explorer",
        name: "Explorateur Tout-Terrain",
        icon: "🏎️",
        speedKmh: 105,
        capacitySlots: 24,
        burnRateMW: 120,
        dockTimeSec: 15,
        cost: { "motor": 5, "steel_pipe": 10, "modular_frame": 5 }
      },
      station: {
        name: "Gare Routière",
        powerMW: 20,
        capacitySlots: 48,
        fuelBufferSlots: 1,
        dockTimeSec: 20,
        inputs: 2,
        outputs: 2,
        cost: { "modular_frame": 10, "motor": 10, "cable": 20, "concrete": 50 }
      }
    },

    belts: {
      mk1: { name: "Convoyeur Mk.1", speed: 60, costPer100m: { "iron_plate": 10 } },
      mk2: { name: "Convoyeur Mk.2", speed: 120, costPer100m: { "reinforced_iron_plate": 10 } },
      mk3: { name: "Convoyeur Mk.3", speed: 270, costPer100m: { "steel_beam": 10 } },
      mk4: { name: "Convoyeur Mk.4", speed: 480, costPer100m: { "encased_industrial_beam": 10 } },
      mk5: { name: "Convoyeur Mk.5", speed: 780, costPer100m: { "aluminum_sheet": 10 } },
      mk6: { name: "Convoyeur Mk.6 (1.0/1.2)", speed: 1200, costPer100m: { "ficsite_trigon": 10 } }
    },

    pipes: {
      mk1: { name: "Tuyau Mk.1", flow: 300, costPer100m: { "copper_sheet": 10 } },
      mk2: { name: "Tuyau Mk.2", flow: 600, costPer100m: { "copper_sheet": 10, "plastic": 10 } }
    }
  },

  // 2. Énergies des Carburants (MJ) pour les Véhicules Terrestres
  fuels: [
    { id: "solid_biofuel", name: "Biocarburant Solide", energyMJ: 450, icon: "🪵" },
    { id: "coal", name: "Charbon", energyMJ: 300, icon: "🪨" },
    { id: "compacted_coal", name: "Charbon Compacté", energyMJ: 630, icon: "🧱" },
    { id: "petroleum_coke", name: "Coke de Pétrole", energyMJ: 180, icon: "⚫" },
    { id: "fuel", name: "Carburant Liquide (Emballé)", energyMJ: 750, icon: "⛽" },
    { id: "turbofuel", name: "Turbo-Carburant (Emballé)", energyMJ: 2000, icon: "🚀" },
    { id: "rocket_fuel", name: "Carburant de Fusée 1.0", energyMJ: 3600, icon: "🔥" },
    { id: "ionized_fuel", name: "Carburant Ionisé 1.0", energyMJ: 6000, icon: "⚡" },
    { id: "battery", name: "Batterie", energyMJ: 6000, icon: "🔋" }
  ],

  // 3. Tailles de Piles (Stack Sizes) officielles de Satisfactory 1.2
  stackSizes: {
    500: [
      "screw", "wire", "quickwire"
    ],
    200: [
      "iron_ore", "copper_ore", "limestone", "coal", "caterium_ore", "raw_quartz", "bauxite", "sulfur", "uranium",
      "iron_ingot", "copper_ingot", "caterium_ingot", "steel_ingot", "aluminum_ingot", "concrete", "silica",
      "compacted_coal", "petroleum_coke", "polymer_resin", "ficsite_ingot", "ficsite_trigon"
    ],
    100: [
      "iron_plate", "iron_rod", "reinforced_iron_plate", "copper_sheet", "steel_pipe", "steel_beam",
      "encased_industrial_beam", "aluminum_sheet", "aluminum_casing", "plastic", "rubber",
      "circuit_board", "cable", "rotor", "stator", "motor", "quartz_crystal", "diamond", "time_crystal",
      "dark_matter_residue", "dark_matter_crystal"
    ],
    50: [
      "modular_frame", "heavy_modular_frame", "fused_modular_frame", "computer", "supercomputer",
      "radio_control_unit", "turbo_motor", "cooling_system", "battery", "electromagnetic_control_rod",
      "ai_limiter", "high_speed_connector", "pressure_conversion_cube", "neural_quantum_processor",
      "singularity_cell", "superposition_oscillator", "thermal_propulsion_rocket", "magnetic_field_generator",
      "assembly_director_system", "ballistic_warp_drive", "smart_plating", "versatile_framework",
      "automated_wiring", "modular_engine", "adaptive_control_unit", "biochemical_sculptor"
    ],
    fluid: [
      "water", "crude_oil", "heavy_oil_residue", "fuel", "turbofuel", "liquid_biofuel",
      "alumina_solution", "sulfuric_acid", "nitric_acid", "rocket_fuel", "ionized_fuel"
    ]
  },

  // 4. Guides d'Ingénierie & Règles d'Or
  engineeringGuides: {
    signals: [
      {
        title: "Block Signal vs Path Signal (La Règle d'Or FICSIT)",
        subtitle: "Path en ENTRÉE de croisement, Block à la SORTIE",
        tag: "Sécurité Ferroviaire",
        description: "Un **Block Signal** réserve la section de voie complète pour 1 seul train. Un **Path Signal** permet à plusieurs trains de traverser simultanément un carrefour complexe sans se toucher, s'ils ont des itinéraires qui ne se croisent pas.",
        goldenRule: "Entrée d'intersection ➔ Signal de Voie (Path) | Sortie d'intersection ➔ Signal de Bloc (Block)",
        schematicId: "crossroad_schematic"
      },
      {
        title: "Dimensionnement des Tampons Anti-Gel de 25s",
        subtitle: "Éliminer la perte de débit lors du chargement/déchargement",
        tag: "Débit Continu 100%",
        description: "Pendant les 25 secondes d'animation du bras de la plateforme de fret, les convoyeurs reliés à la gare sont TOTALEMENT FIGÉS. Pour ne pas brider votre usine :",
        goldenRule: "Reliez DEUX sorties de la plateforme à un Conteneur Industriel Tampon avec des convoyeurs de vitesse double.",
        schematicId: "buffer_schematic"
      },
      {
        title: "Règle de Pente & Puissance des Locomotives",
        subtitle: "1 Locomotive pour 4 Wagons sur le plat, 1:2 en pente 4m/8m",
        tag: "Traction & Pentes",
        description: "Une locomotive chargée au-delà de 4 wagons perdra énormément de vitesse dans les montées. Pour les longues lignes vallonnées, adoptez la formation 2 Locos + 4 Wagons ou 2 Locos + 6 Wagons.",
        goldenRule: "Pente douce (2m) : 1 Loco / 4 Wagons | Pente raide (4m/8m) : 1 Loco / 2 Wagons",
        schematicId: "train_ratio_schematic"
      }
    ]
  }
};
