// Données des Jalons du HUB et Phases de l'Ascenseur Spatial (Satisfactory 1.2)

const MILESTONES_DATA = {
  phases: [
    {
      id: "phase_1",
      name: "Phase 1 - Lancement initial",
      tierRequirement: "Tier 1 - 2",
      description: "Première cargaison pour le Projet Assemblée.",
      cost: {
        smart_plating: 50
      },
      unlocks: "Débloque les Paliers 3 & 4 (Charbon, Acier, Logistique Mk.3)"
    },
    {
      id: "phase_2",
      name: "Phase 2 - Expansion industrielle",
      tierRequirement: "Tier 3 - 4",
      description: "Deuxième cargaison pour lancer les technologies pétrolières.",
      cost: {
        smart_plating: 500,
        versatile_framework: 500,
        automated_wiring: 100
      },
      unlocks: "Débloque les Paliers 5 & 6 (Pétrole, Plastique, Caoutchouc, Carburant)"
    },
    {
      id: "phase_3",
      name: "Phase 3 - Consolidation avancée",
      tierRequirement: "Tier 5 - 6",
      description: "Troisième cargaison pour accéder au nucléaire et à l'aluminium.",
      cost: {
        versatile_framework: 2500,
        modular_engine: 500,
        adaptive_control_unit: 100
      },
      unlocks: "Débloque les Paliers 7 & 8 (Aluminium, Nucléaire, Accélérateur de particules)"
    },
    {
      id: "phase_4",
      name: "Phase 4 - Propulsion & Contrôle",
      tierRequirement: "Tier 7 - 8",
      description: "Quatrième cargaison majeure pour débloquer l'ère quantique 1.2.",
      cost: {
        assembly_director_system: 4000,
        magnetic_field_generator: 4000,
        thermal_propulsion_rocket: 1000,
        nuclear_pasta: 1000
      },
      unlocks: "Débloque le Palier 9 (Technologie Quantique, Convertisseur, Encodeur quantique)"
    },
    {
      id: "phase_5",
      name: "Phase 5 - Sauvetage de la Terre (1.2 Finale)",
      tierRequirement: "Tier 9",
      description: "L'ultime expédition pour compléter la mission de la FICSIT.",
      cost: {
        nuclear_pasta: 1000,
        biochemical_sculptor: 200,
        ai_expansion_server: 250,
        ballistic_warp_drive: 200
      },
      unlocks: "Achèvement de Satisfactory 1.2 & Victoire FICSIT !"
    }
  ],

  tiers: [
    {
      tier: 0,
      name: "Palier 0 - Intégration FICSIT",
      milestones: [
        {
          id: "tier_0_hub_1",
          name: "Amélioration du HUB 1",
          cost: { iron_rod: 10 },
          buildings: ["smelter"],
          unlockedItems: ["iron_ingot", "iron_rod"]
        },
        {
          id: "tier_0_hub_2",
          name: "Amélioration du HUB 2",
          cost: { iron_rod: 20, iron_plate: 10 },
          buildings: [],
          unlockedItems: ["iron_plate", "copper_ore", "copper_ingot", "wire"]
        },
        {
          id: "tier_0_hub_3",
          name: "Amélioration du HUB 3",
          cost: { iron_rod: 30, iron_plate: 20, wire: 20 },
          buildings: ["constructor"],
          unlockedItems: ["concrete", "screw"]
        },
        {
          id: "tier_0_hub_4",
          name: "Amélioration du HUB 4",
          cost: { iron_plate: 75, iron_rod: 20, cable: 10 },
          buildings: [],
          unlockedItems: ["cable"]
        },
        {
          id: "tier_0_hub_5",
          name: "Amélioration du HUB 5",
          cost: { iron_rod: 75, iron_plate: 75, cable: 90, concrete: 20 },
          buildings: ["miner_mk1"],
          unlockedItems: []
        },
        {
          id: "tier_0_hub_6",
          name: "Amélioration du HUB 6",
          cost: { iron_rod: 100, iron_plate: 100, wire: 100, concrete: 50 },
          buildings: ["assembler"],
          unlockedItems: ["reinforced_iron_plate", "rotor", "modular_frame"]
        }
      ]
    },
    {
      tier: 1,
      name: "Palier 1 - Automatisation de base",
      milestones: [
        {
          id: "tier_1_logistics_1",
          name: "Logistique Mk.1",
          cost: { iron_plate: 150, iron_rod: 150, wire: 300 },
          buildings: [],
          unlockedItems: ["Convoyeurs Mk.1", "Répartiteurs", "Groupeurs"]
        },
        {
          id: "tier_1_field_research",
          name: "Recherche sur le terrain",
          cost: { wire: 300, screw: 300, iron_plate: 100 },
          buildings: [],
          unlockedItems: ["M.A.M.", "Scanner d'objets", "Balise"]
        },
        {
          id: "tier_1_base_building",
          name: "Construction de base",
          cost: { concrete: 200, iron_plate: 100, iron_rod: 100 },
          buildings: [],
          unlockedItems: ["Fondations", "Murs", "Passerelles"]
        }
      ]
    },
    {
      tier: 2,
      name: "Palier 2 - Assemblage & Pièces avancées",
      milestones: [
        {
          id: "tier_2_part_assembly",
          name: "Assemblage de pièces",
          cost: { reinforced_iron_plate: 50, rotor: 50, cable: 100 },
          buildings: ["assembler"],
          unlockedItems: ["reinforced_iron_plate", "rotor", "smart_plating"]
        },
        {
          id: "tier_2_obstacle_clearing",
          name: "Dégagement d'obstacles",
          cost: { screw: 500, cable: 100, concrete: 100 },
          buildings: [],
          unlockedItems: ["Tronçonneuse", "Biocarburant solide"]
        },
        {
          id: "tier_2_resource_sink",
          name: "Broyage de ressources",
          cost: { concrete: 400, wire: 500, reinforced_iron_plate: 100 },
          buildings: [],
          unlockedItems: ["Broyeur A.W.E.S.O.M.E.", "Magasin A.W.E.S.O.M.E."]
        },
        {
          id: "tier_2_logistics_2",
          name: "Logistique Mk.2",
          cost: { reinforced_iron_plate: 50, concrete: 200, iron_rod: 300 },
          buildings: [],
          unlockedItems: ["Convoyeurs Mk.2 (120/min)", "Élévateurs Mk.2"]
        }
      ]
    },
    {
      tier: 3,
      name: "Palier 3 - Énergie au charbon & Acier",
      milestones: [
        {
          id: "tier_3_coal_power",
          name: "Énergie au charbon",
          cost: { reinforced_iron_plate: 150, rotor: 50, cable: 300 },
          buildings: ["water_extractor"],
          unlockedItems: ["Générateur à charbon", "Extracteur d'eau", "Tuyaux fluides Mk.1"]
        },
        {
          id: "tier_3_vehicular_transport",
          name: "Transport par véhicules",
          cost: { modular_frame: 25, rotor: 100, reinforced_iron_plate: 100, concrete: 400 },
          buildings: [],
          unlockedItems: ["Tracteur", "Gare routière"]
        },
        {
          id: "tier_3_basic_steel",
          name: "Production d'acier de base",
          cost: { modular_frame: 50, rotor: 150, concrete: 300, wire: 1000 },
          buildings: ["foundry"],
          unlockedItems: ["steel_ingot", "steel_beam", "steel_pipe", "versatile_framework"]
        }
      ]
    },
    {
      tier: 4,
      name: "Palier 4 - Poutres industrielles & Logistique 3",
      milestones: [
        {
          id: "tier_4_advanced_steel",
          name: "Production d'acier avancée",
          cost: { steel_pipe: 200, steel_beam: 200, modular_frame: 100 },
          buildings: [],
          unlockedItems: ["encased_industrial_beam", "stator", "motor", "automated_wiring"]
        },
        {
          id: "tier_4_logistics_3",
          name: "Logistique Mk.3",
          cost: { steel_beam: 200, steel_pipe: 100, reinforced_iron_plate: 100 },
          buildings: ["miner_mk2"],
          unlockedItems: ["Convoyeurs Mk.3 (270/min)", "Foreuse Mk.2"]
        },
        {
          id: "tier_4_expanded_power",
          name: "Infrastructures électriques",
          cost: { steel_beam: 100, rotor: 100, cable: 500 },
          buildings: [],
          unlockedItems: ["Pylônes électriques Mk.2", "Interrupteur d'alimentation"]
        }
      ]
    },
    {
      tier: 5,
      name: "Palier 5 - Raffinage de pétrole",
      milestones: [
        {
          id: "tier_5_oil_processing",
          name: "Traitement du pétrole",
          cost: { motor: 50, encased_industrial_beam: 100, steel_pipe: 500, copper_sheet: 500 },
          buildings: ["oil_extractor", "refinery"],
          unlockedItems: ["plastic", "rubber", "fuel", "circuit_board"]
        },
        {
          id: "tier_5_industrial_manufacturing",
          name: "Fabrication industrielle",
          cost: { motor: 100, encased_industrial_beam: 200, steel_pipe: 200, plastic: 200 },
          buildings: ["manufacturer"],
          unlockedItems: ["heavy_modular_frame", "modular_engine", "adaptive_control_unit"]
        },
        {
          id: "tier_5_fluid_packaging",
          name: "Conditionnement de fluides",
          cost: { plastic: 100, steel_pipe: 100, copper_sheet: 100 },
          buildings: ["packager"],
          unlockedItems: ["Conditionneuse", "Réservoir de fluide industriel"]
        }
      ]
    },
    {
      tier: 6,
      name: "Palier 6 - Énergie au carburant & Trains",
      milestones: [
        {
          id: "tier_6_fuel_power",
          name: "Générateur à carburant",
          cost: { computer: 50, heavy_modular_frame: 50, rubber: 300, quickwire: 1000 },
          buildings: [],
          unlockedItems: ["Générateur à carburant (250 MW)", "Tuyaux fluides Mk.2"]
        },
        {
          id: "tier_6_monorail_trains",
          name: "Trains monorails",
          cost: { heavy_modular_frame: 50, computer: 50, steel_pipe: 500, concrete: 1000 },
          buildings: [],
          unlockedItems: ["Locomotive électrique", "Wagon de fret", "Gare ferroviaire"]
        },
        {
          id: "tier_6_logistics_4",
          name: "Logistique Mk.4",
          cost: { encased_industrial_beam: 200, heavy_modular_frame: 50, plastic: 300 },
          buildings: [],
          unlockedItems: ["Convoyeurs Mk.4 (480/min)"]
        }
      ]
    },
    {
      tier: 7,
      name: "Palier 7 - Bauxite & Aluminium",
      milestones: [
        {
          id: "tier_7_bauxite_refining",
          name: "Raffinage de la bauxite",
          cost: { radio_control_unit: 50, heavy_modular_frame: 100, motor: 200, plastic: 500 },
          buildings: [],
          unlockedItems: ["aluminum_scrap", "aluminum_ingot", "alclad_aluminum_sheet", "aluminum_casing"]
        },
        {
          id: "tier_7_logistics_5",
          name: "Logistique Mk.5",
          cost: { alclad_aluminum_sheet: 200, encased_industrial_beam: 200, rubber: 400 },
          buildings: ["miner_mk3"],
          unlockedItems: ["Convoyeurs Mk.5 (780/min)", "Foreuse Mk.3"]
        },
        {
          id: "tier_7_aeronautical_engineering",
          name: "Ingénierie aéronautique",
          cost: { radio_control_unit: 100, alclad_aluminum_sheet: 200, motor: 200 },
          buildings: ["blender"],
          unlockedItems: ["radio_control_unit", "cooling_system", "turbo_motor", "Drone", "Port de drones"]
        }
      ]
    },
    {
      tier: 8,
      name: "Palier 8 - Énergie nucléaire & Particules",
      milestones: [
        {
          id: "tier_8_nuclear_power",
          name: "Énergie nucléaire",
          cost: { heavy_modular_frame: 100, turbo_motor: 50, radio_control_unit: 100, cable: 1000 },
          buildings: [],
          unlockedItems: ["Centrale nucléaire", "Barre de combustible à l'uranium"]
        },
        {
          id: "tier_8_advanced_particle_physics",
          name: "Physique avancée des particules",
          cost: { electromagnetic_control_rod: 100, cooling_system: 100, fused_modular_frame: 50, turbo_motor: 50 },
          buildings: ["particle_accelerator"],
          unlockedItems: ["particle_accelerator", "nuclear_pasta", "Poudre de cuivre"]
        },
        {
          id: "tier_8_hoverpack",
          name: "Hoverpack & Combinaison",
          cost: { cooling_system: 50, radio_control_unit: 50, alclad_aluminum_sheet: 200 },
          buildings: [],
          unlockedItems: ["Hoverpack (Vol d'usine)", "Filtre à iode"]
        }
      ]
    },
    {
      tier: 9,
      name: "Palier 9 - Technologie Quantique (Satisfactory 1.2)",
      milestones: [
        {
          id: "tier_9_matter_conversion",
          name: "Conversion de matière",
          cost: { fused_modular_frame: 100, radio_control_unit: 100, cooling_system: 100, supercomputer: 50 },
          buildings: ["converter"],
          unlockedItems: ["converter", "dark_matter_residue", "time_crystal", "diamonds"]
        },
        {
          id: "tier_9_quantum_encoding",
          name: "Encodage quantique",
          cost: { time_crystal: 100, dark_matter_crystal: 100, supercomputer: 100 },
          buildings: ["quantum_encoder"],
          unlockedItems: ["quantum_encoder", "ballistic_warp_drive", "biochemical_sculptor", "ai_expansion_server"]
        },
        {
          id: "tier_9_spatial_compression",
          name: "Compression spatiale",
          cost: { singularity_cell: 50, neural_quantum_processor: 50, fused_modular_frame: 50 },
          buildings: [],
          unlockedItems: ["Portail dimensionnel FICSIT", "Dépôt d'inventaire dimensionnel avancé"]
        }
      ]
    }
  ]
};

if (typeof window !== "undefined") {
  window.MILESTONES_DATA = MILESTONES_DATA;
}

if (typeof module !== "undefined") {
  module.exports = { MILESTONES_DATA };
}
