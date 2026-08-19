// Données des bâtiments de production et logistique Satisfactory 1.0+
const BUILDINGS = {
  // Extraction & Minage
  miner_mk1: {
    id: "miner_mk1",
    name: "Foreuse Mk.1",
    category: "extraction",
    powerMW: 5,
    icon: "⛏️",
    image: "images/buildings/IconDesc_MinerMk1_256.png",
    cost: { portable_miner: 1, iron_plate: 10, concrete: 10 }
  },
  miner_mk2: {
    id: "miner_mk2",
    name: "Foreuse Mk.2",
    category: "extraction",
    powerMW: 12,
    icon: "⛏️",
    image: "images/buildings/IconDesc_MinerMk2_256.png",
    cost: { miner_mk1: 1, reinforced_iron_plate: 10, concrete: 20, modular_frame: 10 }
  },
  miner_mk3: {
    id: "miner_mk3",
    name: "Foreuse Mk.3",
    category: "extraction",
    powerMW: 30,
    icon: "⛏️",
    image: "images/buildings/IconDesc_MinerMk3_256.png",
    cost: { miner_mk2: 1, fused_modular_frame: 3, turbo_motor: 2, steel_pipe: 30 }
  },
  water_extractor: {
    id: "water_extractor",
    name: "Extracteur d'eau",
    category: "extraction",
    powerMW: 20,
    icon: "💧",
    image: "images/buildings/Waterpump_256.png",
    cost: { copper_sheet: 20, reinforced_iron_plate: 10, rotor: 10 }
  },
  oil_extractor: {
    id: "oil_extractor",
    name: "Extracteur de pétrole",
    category: "extraction",
    powerMW: 40,
    icon: "🛢️",
    image: "images/buildings/OilPump_256.png",
    cost: { motor: 15, encased_industrial_beam: 20, steel_pipe: 60 }
  },
  resource_well_pressurizer: {
    id: "resource_well_pressurizer",
    name: "Pressuriseur de puits de ressource",
    category: "extraction",
    powerMW: 150,
    icon: "🌀",
    image: "images/buildings/IconDesc_Smasher_256.png",
    cost: { wire: 200, rubber: 50, encased_industrial_beam: 50, motor: 50 }
  },

  // Fonderies & Fusion
  smelter: {
    id: "smelter",
    name: "Fonderie",
    category: "smelting",
    powerMW: 4,
    icon: "🔥",
    image: "images/buildings/IconDesc_SmelterMk1_256.png",
    cost: { iron_rod: 5, wire: 8 }
  },
  foundry: {
    id: "foundry",
    name: "Fonderie avancée",
    category: "smelting",
    powerMW: 16,
    icon: "🌋",
    image: "images/buildings/IconDesc_Foundry_256.png",
    cost: { modular_frame: 2, rotor: 4, concrete: 8 }
  },

  // Usinage & Assemblage
  constructor: {
    id: "constructor",
    name: "Constructeur",
    category: "production",
    powerMW: 4,
    icon: "⚙️",
    image: "images/buildings/IconDesc_ConstructorMk1_256.png",
    cost: { reinforced_iron_plate: 2, cable: 2 }
  },
  assembler: {
    id: "assembler",
    name: "Assembleuse",
    category: "production",
    powerMW: 15,
    icon: "🔩",
    image: "images/buildings/IconDesc_AssemblerMk1_256.png",
    cost: { reinforced_iron_plate: 8, rotor: 4, cable: 10 }
  },
  manufacturer: {
    id: "manufacturer",
    name: "Façonneuse",
    category: "production",
    powerMW: 55,
    icon: "🏭",
    image: "images/buildings/IconDesc_Manufacturer_256.png",
    cost: { motor: 10, heavy_modular_frame: 10, cable: 50, plastic: 50 }
  },
  packager: {
    id: "packager",
    name: "Conditionneuse",
    category: "production",
    powerMW: 10,
    icon: "📦",
    image: "images/buildings/IconDesc_Packager_256.png",
    cost: { reinforced_iron_plate: 20, rubber: 10, steel_pipe: 20 }
  },
  refinery: {
    id: "refinery",
    name: "Raffinerie",
    category: "production",
    powerMW: 30,
    icon: "🧪",
    image: "images/buildings/IconDesc_OilRefinery_256.png",
    cost: { motor: 10, encased_industrial_beam: 10, steel_pipe: 30, copper_sheet: 20 }
  },
  blender: {
    id: "blender",
    name: "Mélangeur",
    category: "production",
    powerMW: 75,
    icon: "🍹",
    image: "images/buildings/IconDesc_Blender_256.png",
    cost: { motor: 10, heavy_modular_frame: 4, aluminum_casing: 50, radio_control_unit: 5 }
  },
  particle_accelerator: {
    id: "particle_accelerator",
    name: "Accélérateur de particules",
    category: "production",
    powerMW: 1000, // Moyenne de puissance variable
    icon: "⚛️",
    image: "images/buildings/IconDesc_HadronCollider_256.png",
    cost: { reinforced_iron_plate: 100, electromagnetic_control_rod: 25, fused_modular_frame: 10, cooling_system: 20 }
  },
  converter: {
    id: "converter",
    name: "Convertisseur",
    category: "quantum",
    powerMW: 250,
    icon: "💠",
    image: "images/buildings/IconDesc_Converter_256.png",
    cost: { fused_modular_frame: 15, radio_control_unit: 10, cooling_system: 10, sam: 50 }
  },
  quantum_encoder: {
    id: "quantum_encoder",
    name: "Encodeur quantique",
    category: "quantum",
    powerMW: 2000,
    icon: "🌌",
    image: "images/buildings/IconDesc_QuantumEncoder_256.png",
    cost: { dark_matter_crystal: 20, supercomputer: 10, fused_modular_frame: 10, time_crystal: 10 }
  },
  storage_container: {
    id: "storage_container",
    name: "Conteneur de stockage",
    category: "logistics",
    powerMW: 0,
    icon: "📦",
    image: "images/buildings/IconDesc_StorageContainer_256.png",
    cost: { iron_plate: 10, iron_rod: 10 }
  },
  storage_container_mk2: {
    id: "storage_container_mk2",
    name: "Conteneur industriel",
    category: "logistics",
    powerMW: 0,
    icon: "📦",
    image: "images/buildings/IconDesc_StorageContainerMk2_256.png",
    cost: { steel_beam: 10, steel_pipe: 20 }
  }
};

// Noms français lisibles des items pour affichage
const ITEM_NAMES = {
  // Ressources Brutes
  iron_ore: "Minerai de fer",
  copper_ore: "Minerai de cuivre",
  limestone: "Calcaire",
  coal: "Charbon",
  caterium_ore: "Minerai de caterium",
  raw_quartz: "Quartz brut",
  sulfur: "Soufre",
  bauxite: "Bauxite",
  crude_oil: "Pétrole brut",
  water: "Eau",
  nitrogen_gas: "Azote gazeux",
  sam: "SAM (Substance Alien Modifiée)",
  uranium: "Uranium",

  // Lingots & Produits de base
  iron_ingot: "Lingot de fer",
  copper_ingot: "Lingot de cuivre",
  caterium_ingot: "Lingot de caterium",
  steel_ingot: "Lingot d'acier",
  aluminum_ingot: "Lingot d'aluminium",
  concrete: "Béton",
  iron_plate: "Plaque de fer",
  iron_rod: "Tige de fer",
  wire: "Fil électrique",
  cable: "Câble",
  screw: "Vis",
  copper_sheet: "Tôle de cuivre",
  quartz_crystal: "Cristal de quartz",
  silica: "Silice",
  copper_powder: "Poudre de cuivre",

  // Composants Intermédiaires
  reinforced_iron_plate: "Plaque de fer renforcée",
  rotor: "Rotor",
  stator: "Stator",
  motor: "Moteur",
  steel_beam: "Poutre en acier",
  steel_pipe: "Tuyau en acier",
  encased_industrial_beam: "Poutre industrielle renforcée",
  modular_frame: "Cadre modulaire",
  heavy_modular_frame: "Cadre modulaire lourd",
  fused_modular_frame: "Cadre modulaire fusionné",
  circuit_board: "Circuit imprimé",
  ai_limiter: "Limiteur d'IA",
  high_speed_connector: "Connecteur haute vitesse",
  quickwire: "Filactif",
  plastic: "Plastique",
  rubber: "Caoutchouc",
  polymer_resin: "Résine polymère",
  petroleum_coke: "Coke de pétrole",
  fuel: "Carburant",
  turbofuel: "Turbocarburant",
  heavy_oil_residue: "Résidu d'huile lourde",
  liquid_biofuel: "Biocarburant liquide",
  aluminum_scrap: "Résidus d'aluminium",
  aluminum_casing: "Boîtier en aluminium",
  alclad_aluminum_sheet: "Tôle d'aluminium alclad",
  radio_control_unit: "Unité de contrôle radio",
  cooling_system: "Système de refroidissement",
  supercomputer: "Superordinateur",
  battery: "Batterie",
  electromagnetic_control_rod: "Barre de contrôle électromagnétique",
  turbo_motor: "Turbomoteur",

  // Produits d'Ascenseur Spatial
  smart_plating: "Placage intelligent",
  versatile_framework: "Structure polyvalente",
  automated_wiring: "Câblage automatisé",
  modular_engine: "Moteur modulaire",
  adaptive_control_unit: "Unité de contrôle adaptatif",
  assembly_director_system: "Système de guidage d'assemblage",
  magnetic_field_generator: "Générateur de champ magnétique",
  thermal_propulsion_rocket: "Fusée à propulsion thermique",
  nuclear_pasta: "Pâtes nucléaires",
  ballistic_warp_drive: "Propulseur à distorsion balistique",
  biochemical_sculptor: "Sculpteur biochimique",
  ai_expansion_server: "Serveur d'extension d'IA",

  // Technologies Quantiques & Endgame 1.0
  dark_matter_residue: "Résidu de matière noire",
  dark_matter_crystal: "Cristal de matière noire",
  time_crystal: "Cristal temporel",
  ficsonium: "Ficsonium",
  ficsonium_fuel_rod: "Barre de ficsonium",
  diamonds: "Diamants",
  excited_photonic_matter: "Matière photonique excitée",
  neural_quantum_processor: "Processeur quantique neuronal",
  superposition_oscillator: "Oscillateur à superposition",

  // Consommables & Divers
  black_powder: "Poudre noire",
  smokeless_powder: "Poudre sans fumée",
  solid_biofuel: "Biocarburant solide",
  biomass: "Biomasse",
  gas_filter: "Filtre à gaz",
  iodine_infused_filter: "Filtre infusé à l'iode",
  portable_miner: "Foreuse portable"
};

if (typeof window !== "undefined") {
  window.BUILDINGS = BUILDINGS;
  window.ITEM_NAMES = ITEM_NAMES;
}

// Export pour le navigateur ou modules
if (typeof module !== "undefined") {
  module.exports = { BUILDINGS, ITEM_NAMES };
}
