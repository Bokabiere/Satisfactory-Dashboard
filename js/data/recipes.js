// Base de données des recettes standards et alternatives de Satisfactory 1.2
// items/min et débits basés sur le temps de cycle standard

const RECIPES = [
  // ==========================================
  // LINGOTS & PRODUITS DE BASE
  // ==========================================
  {
    id: "recipe_iron_ingot",
    name: "Lingot de fer",
    isAlt: false,
    building: "smelter",
    ingredients: [{ item: "iron_ore", amount: 30 }],
    products: [{ item: "iron_ingot", amount: 30 }]
  },
  {
    id: "recipe_alt_pure_iron_ingot",
    name: "Lingot de fer pur (Alt)",
    isAlt: true,
    building: "refinery",
    ingredients: [{ item: "iron_ore", amount: 35 }, { item: "water", amount: 20 }],
    products: [{ item: "iron_ingot", amount: 65 }]
  },
  {
    id: "recipe_alt_iron_alloy_ingot",
    name: "Alliage de fer (Alt)",
    isAlt: true,
    building: "foundry",
    ingredients: [{ item: "iron_ore", amount: 20 }, { item: "copper_ore", amount: 20 }],
    products: [{ item: "iron_ingot", amount: 50 }]
  },
  {
    id: "recipe_copper_ingot",
    name: "Lingot de cuivre",
    isAlt: false,
    building: "smelter",
    ingredients: [{ item: "copper_ore", amount: 30 }],
    products: [{ item: "copper_ingot", amount: 30 }]
  },
  {
    id: "recipe_alt_copper_alloy_ingot",
    name: "Alliage de cuivre (Alt)",
    isAlt: true,
    building: "foundry",
    ingredients: [{ item: "copper_ore", amount: 50 }, { item: "iron_ore", amount: 25 }],
    products: [{ item: "copper_ingot", amount: 100 }]
  },
  {
    id: "recipe_alt_pure_copper_ingot",
    name: "Lingot de cuivre pur (Alt)",
    isAlt: true,
    building: "refinery",
    ingredients: [{ item: "copper_ore", amount: 15 }, { item: "water", amount: 10 }],
    products: [{ item: "copper_ingot", amount: 37.5 }]
  },
  {
    id: "recipe_caterium_ingot",
    name: "Lingot de caterium",
    isAlt: false,
    building: "smelter",
    ingredients: [{ item: "caterium_ore", amount: 45 }],
    products: [{ item: "caterium_ingot", amount: 15 }]
  },
  {
    id: "recipe_alt_pure_caterium_ingot",
    name: "Lingot de caterium pur (Alt)",
    isAlt: true,
    building: "refinery",
    ingredients: [{ item: "caterium_ore", amount: 24 }, { item: "water", amount: 24 }],
    products: [{ item: "caterium_ingot", amount: 12 }]
  },
  {
    id: "recipe_steel_ingot",
    name: "Lingot d'acier",
    isAlt: false,
    building: "foundry",
    ingredients: [{ item: "iron_ore", amount: 45 }, { item: "coal", amount: 45 }],
    products: [{ item: "steel_ingot", amount: 45 }]
  },
  {
    id: "recipe_alt_solid_steel_ingot",
    name: "Lingot d'acier massif (Alt)",
    isAlt: true,
    building: "foundry",
    ingredients: [{ item: "iron_ingot", amount: 40 }, { item: "coal", amount: 40 }],
    products: [{ item: "steel_ingot", amount: 60 }]
  },
  {
    id: "recipe_alt_coke_steel_ingot",
    name: "Acier au coke (Alt)",
    isAlt: true,
    building: "foundry",
    ingredients: [{ item: "iron_ore", amount: 75 }, { item: "petroleum_coke", amount: 75 }],
    products: [{ item: "steel_ingot", amount: 100 }]
  },
  {
    id: "recipe_aluminum_ingot",
    name: "Lingot d'aluminium",
    isAlt: false,
    building: "foundry",
    ingredients: [{ item: "aluminum_scrap", amount: 90 }, { item: "silica", amount: 75 }],
    products: [{ item: "aluminum_ingot", amount: 60 }]
  },
  {
    id: "recipe_alt_pure_aluminum_ingot",
    name: "Lingot d'aluminium pur (Alt)",
    isAlt: true,
    building: "smelter",
    ingredients: [{ item: "aluminum_scrap", amount: 60 }],
    products: [{ item: "aluminum_ingot", amount: 30 }]
  },

  // ==========================================
  // PIÈCES DE BASE : PLAQUES, TIGES, VIS, FILS
  // ==========================================
  {
    id: "recipe_iron_plate",
    name: "Plaque de fer",
    isAlt: false,
    building: "constructor",
    ingredients: [{ item: "iron_ingot", amount: 30 }],
    products: [{ item: "iron_plate", amount: 20 }]
  },
  {
    id: "recipe_iron_rod",
    name: "Tige de fer",
    isAlt: false,
    building: "constructor",
    ingredients: [{ item: "iron_ingot", amount: 15 }],
    products: [{ item: "iron_rod", amount: 15 }]
  },
  {
    id: "recipe_alt_steel_rod",
    name: "Tige en acier (Alt)",
    isAlt: true,
    building: "constructor",
    ingredients: [{ item: "steel_ingot", amount: 12 }],
    products: [{ item: "iron_rod", amount: 48 }]
  },
  {
    id: "recipe_screw",
    name: "Vis",
    isAlt: false,
    building: "constructor",
    ingredients: [{ item: "iron_rod", amount: 10 }],
    products: [{ item: "screw", amount: 40 }]
  },
  {
    id: "recipe_alt_cast_screw",
    name: "Vis coulée (Alt)",
    isAlt: true,
    building: "constructor",
    ingredients: [{ item: "iron_ingot", amount: 12.5 }],
    products: [{ item: "screw", amount: 50 }]
  },
  {
    id: "recipe_alt_steel_screw",
    name: "Vis en acier (Alt)",
    isAlt: true,
    building: "constructor",
    ingredients: [{ item: "steel_beam", amount: 5 }],
    products: [{ item: "screw", amount: 260 }]
  },
  {
    id: "recipe_wire",
    name: "Fil électrique",
    isAlt: false,
    building: "constructor",
    ingredients: [{ item: "copper_ingot", amount: 15 }],
    products: [{ item: "wire", amount: 30 }]
  },
  {
    id: "recipe_alt_iron_wire",
    name: "Fil de fer (Alt)",
    isAlt: true,
    building: "constructor",
    ingredients: [{ item: "iron_ingot", amount: 12.5 }],
    products: [{ item: "wire", amount: 22.5 }]
  },
  {
    id: "recipe_alt_fused_wire",
    name: "Fil fusionné (Alt)",
    isAlt: true,
    building: "assembler",
    ingredients: [{ item: "copper_ingot", amount: 12 }, { item: "caterium_ingot", amount: 3 }],
    products: [{ item: "wire", amount: 90 }]
  },
  {
    id: "recipe_cable",
    name: "Câble",
    isAlt: false,
    building: "constructor",
    ingredients: [{ item: "wire", amount: 60 }],
    products: [{ item: "cable", amount: 30 }]
  },
  {
    id: "recipe_alt_quickwire_cable",
    name: "Câble au filactif (Alt)",
    isAlt: true,
    building: "assembler",
    ingredients: [{ item: "quickwire", amount: 7.5 }, { item: "rubber", amount: 5 }],
    products: [{ item: "cable", amount: 27.5 }]
  },
  {
    id: "recipe_alt_insulated_cable",
    name: "Câble isolé (Alt)",
    isAlt: true,
    building: "assembler",
    ingredients: [{ item: "wire", amount: 45 }, { item: "rubber", amount: 30 }],
    products: [{ item: "cable", amount: 100 }]
  },
  {
    id: "recipe_copper_sheet",
    name: "Tôle de cuivre",
    isAlt: false,
    building: "constructor",
    ingredients: [{ item: "copper_ingot", amount: 20 }],
    products: [{ item: "copper_sheet", amount: 10 }]
  },
  {
    id: "recipe_alt_steamed_copper_sheet",
    name: "Tôle de cuivre étuvée (Alt)",
    isAlt: true,
    building: "refinery",
    ingredients: [{ item: "copper_ingot", amount: 22.5 }, { item: "water", amount: 22.5 }],
    products: [{ item: "copper_sheet", amount: 22.5 }]
  },
  {
    id: "recipe_concrete",
    name: "Béton",
    isAlt: false,
    building: "constructor",
    ingredients: [{ item: "limestone", amount: 45 }],
    products: [{ item: "concrete", amount: 15 }]
  },
  {
    id: "recipe_alt_wet_concrete",
    name: "Béton humide (Alt)",
    isAlt: true,
    building: "refinery",
    ingredients: [{ item: "limestone", amount: 120 }, { item: "water", amount: 100 }],
    products: [{ item: "concrete", amount: 80 }]
  },
  {
    id: "recipe_alt_rubber_concrete",
    name: "Béton au caoutchouc (Alt)",
    isAlt: true,
    building: "assembler",
    ingredients: [{ item: "limestone", amount: 50 }, { item: "rubber", amount: 10 }],
    products: [{ item: "concrete", amount: 45 }]
  },

  // ==========================================
  // COMPOSANTS INTERMÉDIAIRES
  // ==========================================
  {
    id: "recipe_reinforced_iron_plate",
    name: "Plaque de fer renforcée",
    isAlt: false,
    building: "assembler",
    ingredients: [{ item: "iron_plate", amount: 30 }, { item: "screw", amount: 60 }],
    products: [{ item: "reinforced_iron_plate", amount: 5 }]
  },
  {
    id: "recipe_alt_stitched_iron_plate",
    name: "Plaque de fer cousue (Alt)",
    isAlt: true,
    building: "assembler",
    ingredients: [{ item: "iron_plate", amount: 18.75 }, { item: "wire", amount: 37.5 }],
    products: [{ item: "reinforced_iron_plate", amount: 5.625 }]
  },
  {
    id: "recipe_alt_bolted_iron_plate",
    name: "Plaque de fer boulonnée (Alt)",
    isAlt: true,
    building: "assembler",
    ingredients: [{ item: "iron_plate", amount: 90 }, { item: "screw", amount: 250 }],
    products: [{ item: "reinforced_iron_plate", amount: 15 }]
  },
  {
    id: "recipe_alt_adhered_iron_plate",
    name: "Plaque de fer adhésive (Alt)",
    isAlt: true,
    building: "assembler",
    ingredients: [{ item: "iron_plate", amount: 11.25 }, { item: "rubber", amount: 3.75 }],
    products: [{ item: "reinforced_iron_plate", amount: 3.75 }]
  },
  {
    id: "recipe_rotor",
    name: "Rotor",
    isAlt: false,
    building: "assembler",
    ingredients: [{ item: "iron_rod", amount: 20 }, { item: "screw", amount: 100 }],
    products: [{ item: "rotor", amount: 4 }]
  },
  {
    id: "recipe_alt_copper_rotor",
    name: "Rotor en cuivre (Alt)",
    isAlt: true,
    building: "assembler",
    ingredients: [{ item: "copper_sheet", amount: 22.5 }, { item: "screw", amount: 195 }],
    products: [{ item: "rotor", amount: 11.25 }]
  },
  {
    id: "recipe_alt_steel_rotor",
    name: "Rotor en acier (Alt)",
    isAlt: true,
    building: "assembler",
    ingredients: [{ item: "steel_pipe", amount: 10 }, { item: "wire", amount: 30 }],
    products: [{ item: "rotor", amount: 5 }]
  },
  {
    id: "recipe_modular_frame",
    name: "Cadre modulaire",
    isAlt: false,
    building: "assembler",
    ingredients: [{ item: "reinforced_iron_plate", amount: 3 }, { item: "iron_rod", amount: 12 }],
    products: [{ item: "modular_frame", amount: 2 }]
  },
  {
    id: "recipe_alt_bolted_frame",
    name: "Cadre boulonné (Alt)",
    isAlt: true,
    building: "assembler",
    ingredients: [{ item: "reinforced_iron_plate", amount: 7.5 }, { item: "screw", amount: 140 }],
    products: [{ item: "modular_frame", amount: 5 }]
  },
  {
    id: "recipe_alt_steeled_frame",
    name: "Cadre en acier (Alt)",
    isAlt: true,
    building: "assembler",
    ingredients: [{ item: "reinforced_iron_plate", amount: 2 }, { item: "steel_pipe", amount: 10 }],
    products: [{ item: "modular_frame", amount: 3 }]
  },
  {
    id: "recipe_steel_beam",
    name: "Poutre en acier",
    isAlt: false,
    building: "constructor",
    ingredients: [{ item: "steel_ingot", amount: 60 }],
    products: [{ item: "steel_beam", amount: 15 }]
  },
  {
    id: "recipe_steel_pipe",
    name: "Tuyau en acier",
    isAlt: false,
    building: "constructor",
    ingredients: [{ item: "steel_ingot", amount: 30 }],
    products: [{ item: "steel_pipe", amount: 20 }]
  },
  {
    id: "recipe_encased_industrial_beam",
    name: "Poutre industrielle renforcée",
    isAlt: false,
    building: "assembler",
    ingredients: [{ item: "steel_beam", amount: 18 }, { item: "concrete", amount: 18 }],
    products: [{ item: "encased_industrial_beam", amount: 6 }]
  },
  {
    id: "recipe_alt_encased_pipe",
    name: "Tuyau industriel renforcé (Alt)",
    isAlt: true,
    building: "assembler",
    ingredients: [{ item: "steel_pipe", amount: 28 }, { item: "concrete", amount: 20 }],
    products: [{ item: "encased_industrial_beam", amount: 4 }]
  },
  {
    id: "recipe_stator",
    name: "Stator",
    isAlt: false,
    building: "assembler",
    ingredients: [{ item: "steel_pipe", amount: 15 }, { item: "wire", amount: 40 }],
    products: [{ item: "stator", amount: 5 }]
  },
  {
    id: "recipe_alt_quickwire_stator",
    name: "Stator au filactif (Alt)",
    isAlt: true,
    building: "assembler",
    ingredients: [{ item: "steel_pipe", amount: 16 }, { item: "quickwire", amount: 60 }],
    products: [{ item: "stator", amount: 8 }]
  },
  {
    id: "recipe_motor",
    name: "Moteur",
    isAlt: false,
    building: "assembler",
    ingredients: [{ item: "rotor", amount: 10 }, { item: "stator", amount: 10 }],
    products: [{ item: "motor", amount: 5 }]
  },
  {
    id: "recipe_alt_rigour_motor",
    name: "Moteur rigoureux (Alt)",
    isAlt: true,
    building: "manufacturer",
    ingredients: [{ item: "rotor", amount: 3.75 }, { item: "stator", amount: 3.75 }, { item: "quartz_crystal", amount: 3.75 }],
    products: [{ item: "motor", amount: 7.5 }]
  },
  {
    id: "recipe_heavy_modular_frame",
    name: "Cadre modulaire lourd",
    isAlt: false,
    building: "manufacturer",
    ingredients: [
      { item: "modular_frame", amount: 10 },
      { item: "steel_pipe", amount: 40 },
      { item: "encased_industrial_beam", amount: 10 },
      { item: "screw", amount: 240 }
    ],
    products: [{ item: "heavy_modular_frame", amount: 2 }]
  },
  {
    id: "recipe_alt_heavy_encased_frame",
    name: "Cadre lourd renforcé (Alt)",
    isAlt: true,
    building: "manufacturer",
    ingredients: [
      { item: "modular_frame", amount: 7.5 },
      { item: "encased_industrial_beam", amount: 9.375 },
      { item: "steel_pipe", amount: 33.75 },
      { item: "concrete", amount: 20.625 }
    ],
    products: [{ item: "heavy_modular_frame", amount: 2.8125 }]
  },
  {
    id: "recipe_alt_heavy_flexible_frame",
    name: "Cadre lourd flexible (Alt)",
    isAlt: true,
    building: "manufacturer",
    ingredients: [
      { item: "modular_frame", amount: 10 },
      { item: "encased_industrial_beam", amount: 7.5 },
      { item: "rubber", amount: 50 },
      { item: "screw", amount: 260 }
    ],
    products: [{ item: "heavy_modular_frame", amount: 3.75 }]
  },

  // ==========================================
  // PÉTROLE, PLASTIQUE & ÉLECTRONIQUE
  // ==========================================
  {
    id: "recipe_plastic",
    name: "Plastique",
    isAlt: false,
    building: "refinery",
    ingredients: [{ item: "crude_oil", amount: 30 }],
    products: [{ item: "plastic", amount: 20 }, { item: "heavy_oil_residue", amount: 10 }]
  },
  {
    id: "recipe_rubber",
    name: "Caoutchouc",
    isAlt: false,
    building: "refinery",
    ingredients: [{ item: "crude_oil", amount: 30 }],
    products: [{ item: "rubber", amount: 20 }, { item: "heavy_oil_residue", amount: 20 }]
  },
  {
    id: "recipe_fuel",
    name: "Carburant",
    isAlt: false,
    building: "refinery",
    ingredients: [{ item: "crude_oil", amount: 60 }],
    products: [{ item: "fuel", amount: 40 }, { item: "polymer_resin", amount: 30 }]
  },
  {
    id: "recipe_alt_heavy_oil_residue",
    name: "Résidu d'huile lourde (Alt)",
    isAlt: true,
    building: "refinery",
    ingredients: [{ item: "crude_oil", amount: 30 }],
    products: [{ item: "heavy_oil_residue", amount: 40 }, { item: "polymer_resin", amount: 20 }]
  },
  {
    id: "recipe_alt_diluted_fuel",
    name: "Carburant dilué (Alt)",
    isAlt: true,
    building: "blender",
    ingredients: [{ item: "heavy_oil_residue", amount: 50 }, { item: "water", amount: 100 }],
    products: [{ item: "fuel", amount: 100 }]
  },
  {
    id: "recipe_alt_recycled_plastic",
    name: "Plastique recyclé (Alt)",
    isAlt: true,
    building: "refinery",
    ingredients: [{ item: "fuel", amount: 30 }, { item: "rubber", amount: 30 }],
    products: [{ item: "plastic", amount: 60 }]
  },
  {
    id: "recipe_alt_recycled_rubber",
    name: "Caoutchouc recyclé (Alt)",
    isAlt: true,
    building: "refinery",
    ingredients: [{ item: "fuel", amount: 30 }, { item: "plastic", amount: 30 }],
    products: [{ item: "rubber", amount: 60 }]
  },
  {
    id: "recipe_circuit_board",
    name: "Circuit imprimé",
    isAlt: false,
    building: "assembler",
    ingredients: [{ item: "copper_sheet", amount: 15 }, { item: "plastic", amount: 30 }],
    products: [{ item: "circuit_board", amount: 7.5 }]
  },
  {
    id: "recipe_alt_silicon_circuit_board",
    name: "Circuit imprimé en silicium (Alt)",
    isAlt: true,
    building: "assembler",
    ingredients: [{ item: "copper_sheet", amount: 27.5 }, { item: "silica", amount: 27.5 }],
    products: [{ item: "circuit_board", amount: 12.5 }]
  },
  {
    id: "recipe_alt_caterium_circuit_board",
    name: "Circuit imprimé en caterium (Alt)",
    isAlt: true,
    building: "assembler",
    ingredients: [{ item: "plastic", amount: 25 }, { item: "quickwire", amount: 75 }],
    products: [{ item: "circuit_board", amount: 17.5 }]
  },
  {
    id: "recipe_quickwire",
    name: "Filactif",
    isAlt: false,
    building: "constructor",
    ingredients: [{ item: "caterium_ingot", amount: 12 }],
    products: [{ item: "quickwire", amount: 60 }]
  },
  {
    id: "recipe_alt_fused_quickwire",
    name: "Filactif fusionné (Alt)",
    isAlt: true,
    building: "assembler",
    ingredients: [{ item: "caterium_ingot", amount: 7.5 }, { item: "copper_ingot", amount: 37.5 }],
    products: [{ item: "quickwire", amount: 90 }]
  },
  {
    id: "recipe_ai_limiter",
    name: "Limiteur d'IA",
    isAlt: false,
    building: "assembler",
    ingredients: [{ item: "copper_sheet", amount: 25 }, { item: "quickwire", amount: 100 }],
    products: [{ item: "ai_limiter", amount: 5 }]
  },
  {
    id: "recipe_high_speed_connector",
    name: "Connecteur haute vitesse",
    isAlt: false,
    building: "manufacturer",
    ingredients: [
      { item: "quickwire", amount: 210 },
      { item: "cable", amount: 37.5 },
      { item: "circuit_board", amount: 3.75 }
    ],
    products: [{ item: "high_speed_connector", amount: 3.75 }]
  },
  {
    id: "recipe_alt_silicon_high_speed_connector",
    name: "Connecteur haute vitesse en silicium (Alt)",
    isAlt: true,
    building: "manufacturer",
    ingredients: [
      { item: "quickwire", amount: 90 },
      { item: "silica", amount: 37.5 },
      { item: "circuit_board", amount: 3 }
    ],
    products: [{ item: "high_speed_connector", amount: 3 }]
  },
  {
    id: "recipe_supercomputer",
    name: "Superordinateur",
    isAlt: false,
    building: "manufacturer",
    ingredients: [
      { item: "circuit_board", amount: 10 },
      { item: "ai_limiter", amount: 5 },
      { item: "high_speed_connector", amount: 7.5 },
      { item: "plastic", amount: 28 }
    ],
    products: [{ item: "supercomputer", amount: 2.5 }]
  },
  {
    id: "recipe_alt_oc_supercomputer",
    name: "Superordinateur surcadencé (Alt)",
    isAlt: true,
    building: "assembler",
    ingredients: [
      { item: "circuit_board", amount: 12 },
      { item: "cooling_system", amount: 6 }
    ],
    products: [{ item: "supercomputer", amount: 3 }]
  },

  // ==========================================
  // ALUMINIUM, QUARTZ & COMPOSANTS AVANCÉS
  // ==========================================
  {
    id: "recipe_quartz_crystal",
    name: "Cristal de quartz",
    isAlt: false,
    building: "constructor",
    ingredients: [{ item: "raw_quartz", amount: 37.5 }],
    products: [{ item: "quartz_crystal", amount: 22.5 }]
  },
  {
    id: "recipe_alt_pure_quartz_crystal",
    name: "Cristal de quartz pur (Alt)",
    isAlt: true,
    building: "refinery",
    ingredients: [{ item: "raw_quartz", amount: 67.5 }, { item: "water", amount: 37.5 }],
    products: [{ item: "quartz_crystal", amount: 52.5 }]
  },
  {
    id: "recipe_silica",
    name: "Silice",
    isAlt: false,
    building: "constructor",
    ingredients: [{ item: "raw_quartz", amount: 22.5 }],
    products: [{ item: "silica", amount: 37.5 }]
  },
  {
    id: "recipe_alt_cheap_silica",
    name: "Silice bon marché (Alt)",
    isAlt: true,
    building: "assembler",
    ingredients: [{ item: "raw_quartz", amount: 22.5 }, { item: "limestone", amount: 37.5 }],
    products: [{ item: "silica", amount: 52.5 }]
  },
  {
    id: "recipe_aluminum_scrap",
    name: "Résidus d'aluminium (Standard)",
    isAlt: false,
    building: "refinery",
    ingredients: [{ item: "bauxite", amount: 120 }, { item: "coal", amount: 60 }], // Simplifié : après solution
    products: [{ item: "aluminum_scrap", amount: 360 }]
  },
  {
    id: "recipe_aluminum_casing",
    name: "Boîtier en aluminium",
    isAlt: false,
    building: "constructor",
    ingredients: [{ item: "aluminum_ingot", amount: 90 }],
    products: [{ item: "aluminum_casing", amount: 60 }]
  },
  {
    id: "recipe_alclad_aluminum_sheet",
    name: "Tôle d'aluminium alclad",
    isAlt: false,
    building: "assembler",
    ingredients: [{ item: "aluminum_ingot", amount: 30 }, { item: "copper_ingot", amount: 10 }],
    products: [{ item: "alclad_aluminum_sheet", amount: 30 }]
  },
  {
    id: "recipe_radio_control_unit",
    name: "Unité de contrôle radio",
    isAlt: false,
    building: "manufacturer",
    ingredients: [
      { item: "aluminum_casing", amount: 40 },
      { item: "circuit_board", amount: 5 },
      { item: "quartz_crystal", amount: 30 }
    ],
    products: [{ item: "radio_control_unit", amount: 2.5 }]
  },
  {
    id: "recipe_cooling_system",
    name: "Système de refroidissement",
    isAlt: false,
    building: "blender",
    ingredients: [
      { item: "heat_sink", amount: 12 }, // Remplacé en alu casing si simplified
      { item: "rubber", amount: 12 },
      { item: "water", amount: 30 },
      { item: "nitrogen_gas", amount: 25 }
    ],
    products: [{ item: "cooling_system", amount: 6 }]
  },
  {
    id: "recipe_fused_modular_frame",
    name: "Cadre modulaire fusionné",
    isAlt: false,
    building: "blender",
    ingredients: [
      { item: "heavy_modular_frame", amount: 1.5 },
      { item: "aluminum_casing", amount: 75 },
      { item: "nitrogen_gas", amount: 37.5 }
    ],
    products: [{ item: "fused_modular_frame", amount: 1.5 }]
  },
  {
    id: "recipe_turbo_motor",
    name: "Turbomoteur",
    isAlt: false,
    building: "manufacturer",
    ingredients: [
      { item: "motor", amount: 7.5 },
      { item: "radio_control_unit", amount: 3.75 },
      { item: "electromagnetic_control_rod", amount: 3.75 },
      { item: "rotor", amount: 22.5 }
    ],
    products: [{ item: "turbo_motor", amount: 1.875 }]
  },
  {
    id: "recipe_electromagnetic_control_rod",
    name: "Barre de contrôle électromagnétique",
    isAlt: false,
    building: "assembler",
    ingredients: [{ item: "stator", amount: 6 }, { item: "ai_limiter", amount: 4 }],
    products: [{ item: "electromagnetic_control_rod", amount: 4 }]
  },

  // ==========================================
  // ASCENSEUR SPATIAL (PHASES 1 À 5)
  // ==========================================
  {
    id: "recipe_smart_plating",
    name: "Placage intelligent",
    isAlt: false,
    building: "assembler",
    ingredients: [{ item: "reinforced_iron_plate", amount: 2 }, { item: "rotor", amount: 2 }],
    products: [{ item: "smart_plating", amount: 2 }]
  },
  {
    id: "recipe_versatile_framework",
    name: "Structure polyvalente",
    isAlt: false,
    building: "assembler",
    ingredients: [{ item: "modular_frame", amount: 2.5 }, { item: "steel_beam", amount: 30 }],
    products: [{ item: "versatile_framework", amount: 5 }]
  },
  {
    id: "recipe_automated_wiring",
    name: "Câblage automatisé",
    isAlt: false,
    building: "assembler",
    ingredients: [{ item: "stator", amount: 2.5 }, { item: "cable", amount: 50 }],
    products: [{ item: "automated_wiring", amount: 2.5 }]
  },
  {
    id: "recipe_modular_engine",
    name: "Moteur modulaire",
    isAlt: false,
    building: "manufacturer",
    ingredients: [
      { item: "motor", amount: 2 },
      { item: "rubber", amount: 15 },
      { item: "smart_plating", amount: 2 }
    ],
    products: [{ item: "modular_engine", amount: 1 }]
  },
  {
    id: "recipe_adaptive_control_unit",
    name: "Unité de contrôle adaptatif",
    isAlt: false,
    building: "manufacturer",
    ingredients: [
      { item: "automated_wiring", amount: 7.5 },
      { item: "circuit_board", amount: 5 },
      { item: "heavy_modular_frame", amount: 1 },
      { item: "circuit_board", amount: 2 }
    ],
    products: [{ item: "adaptive_control_unit", amount: 1 }]
  },
  {
    id: "recipe_assembly_director_system",
    name: "Système de guidage d'assemblage",
    isAlt: false,
    building: "assembler",
    ingredients: [{ item: "adaptive_control_unit", amount: 1.5 }, { item: "supercomputer", amount: 0.75 }],
    products: [{ item: "assembly_director_system", amount: 0.75 }]
  },
  {
    id: "recipe_magnetic_field_generator",
    name: "Générateur de champ magnétique",
    isAlt: false,
    building: "manufacturer",
    ingredients: [
      { item: "versatile_framework", amount: 2.5 },
      { item: "electromagnetic_control_rod", amount: 1.25 },
      { item: "battery", amount: 5 }
    ],
    products: [{ item: "magnetic_field_generator", amount: 1 }]
  },
  {
    id: "recipe_thermal_propulsion_rocket",
    name: "Fusée à propulsion thermique",
    isAlt: false,
    building: "manufacturer",
    ingredients: [
      { item: "modular_engine", amount: 2.5 },
      { item: "turbo_motor", amount: 1 },
      { item: "cooling_system", amount: 3 },
      { item: "fused_modular_frame", amount: 3 }
    ],
    products: [{ item: "thermal_propulsion_rocket", amount: 1 }]
  },
  {
    id: "recipe_nuclear_pasta",
    name: "Pâtes nucléaires",
    isAlt: false,
    building: "particle_accelerator",
    ingredients: [{ item: "copper_powder", amount: 100 }, { item: "pressure_conversion_cube", amount: 0.5 }],
    products: [{ item: "nuclear_pasta", amount: 0.5 }]
  },
  {
    id: "recipe_copper_powder",
    name: "Poudre de cuivre",
    isAlt: false,
    building: "constructor",
    ingredients: [{ item: "copper_ingot", amount: 300 }],
    products: [{ item: "copper_powder", amount: 50 }]
  },

  // ==========================================
  // PHASE 5 & TECHNOLOGIES QUANTIQUES (1.2)
  // ==========================================
  {
    id: "recipe_ballistic_warp_drive",
    name: "Propulseur à distorsion balistique",
    isAlt: false,
    building: "quantum_encoder",
    ingredients: [
      { item: "thermal_propulsion_rocket", amount: 1 },
      { item: "singularity_cell", amount: 5 },
      { item: "supercomputer", amount: 2 },
      { item: "dark_matter_crystal", amount: 40 }
    ],
    products: [{ item: "ballistic_warp_drive", amount: 1 }]
  },
  {
    id: "recipe_biochemical_sculptor",
    name: "Sculpteur biochimique",
    isAlt: false,
    building: "quantum_encoder",
    ingredients: [
      { item: "assembly_director_system", amount: 2 },
      { item: "dark_matter_crystal", amount: 20 },
      { item: "water", amount: 50 }
    ],
    products: [{ item: "biochemical_sculptor", amount: 2 }]
  },
  {
    id: "recipe_ai_expansion_server",
    name: "Serveur d'extension d'IA",
    isAlt: false,
    building: "quantum_encoder",
    ingredients: [
      { item: "magnetic_field_generator", amount: 2 },
      { item: "neural_quantum_processor", amount: 1 },
      { item: "supercomputer", amount: 1 }
    ],
    products: [{ item: "ai_expansion_server", amount: 1 }]
  },
  {
    id: "recipe_dark_matter_crystal",
    name: "Cristal de matière noire",
    isAlt: false,
    building: "particle_accelerator",
    ingredients: [{ item: "diamonds", amount: 30 }, { item: "dark_matter_residue", amount: 150 }],
    products: [{ item: "dark_matter_crystal", amount: 30 }]
  },
  {
    id: "recipe_dark_matter_residue",
    name: "Résidu de matière noire",
    isAlt: false,
    building: "converter",
    ingredients: [{ item: "sam", amount: 50 }],
    products: [{ item: "dark_matter_residue", amount: 100 }]
  },
  {
    id: "recipe_diamonds",
    name: "Diamants",
    isAlt: false,
    building: "particle_accelerator",
    ingredients: [{ item: "coal", amount: 600 }],
    products: [{ item: "diamonds", amount: 30 }]
  },
  {
    id: "recipe_time_crystal",
    name: "Cristal temporel",
    isAlt: false,
    building: "converter",
    ingredients: [{ item: "diamonds", amount: 12 }, { item: "sam", amount: 24 }],
    products: [{ item: "time_crystal", amount: 6 }]
  }
];

if (typeof window !== "undefined") {
  window.RECIPES = RECIPES;
}

if (typeof module !== "undefined") {
  module.exports = { RECIPES };
}
