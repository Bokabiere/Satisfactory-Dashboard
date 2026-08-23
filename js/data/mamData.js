// Base de données du M.A.M. (Molecular Analysis Machine) & Disques Durs (Satisfactory 1.2)
// Arbres de recherche complets, Dépôt Dimensionnel 1.0, Tier-List des Recettes Alternatives et Capsules de Crash

const MAM_DATA = {
  // 1. Les 9 Arbres Technologiques du MAM
  trees: {
    alien_tech: {
      id: "alien_tech",
      name: "Technologie Alien & Dépôt Dimensionnel",
      icon: "🌀",
      color: "#ff007f",
      description: "Exploitation des Sphères de Mercer et des Somersloops pour débloquer le Dépôt Dimensionnel 1.0 et l'Amplificateur de Puissance Alien.",
      nodes: [
        {
          id: "alien_mercer_analysis",
          name: "Analyse des Sphères de Mercer",
          icon: "🔮",
          cost: { "mercer_sphere": 1 },
          timeSec: 3,
          tierReq: 0,
          parents: [],
          unlocks: "Débloque la technologie des Sphères de Mercer et l'accès au Dépôt Dimensionnel."
        },
        {
          id: "alien_dimensional_depot",
          name: "Dépôt Dimensionnel 1.0",
          icon: "📦",
          cost: { "mercer_sphere": 1, "steel_beam": 50, "circuit_board": 20 },
          timeSec: 3,
          tierReq: 3,
          parents: ["alien_mercer_analysis"],
          unlocks: "Bâtiment : Dépôt Dimensionnel (Téléportation directe des matériaux d'artisanat dans l'inventaire du pionnier depuis n'importe où sur la carte)."
        },
        {
          id: "alien_depot_upload_speed_1",
          name: "Vitesse de Transfert Dépôt I",
          icon: "⚡",
          cost: { "mercer_sphere": 2, "encased_industrial_beam": 30 },
          timeSec: 3,
          tierReq: 4,
          parents: ["alien_dimensional_depot"],
          unlocks: "Double la vitesse de transfert des objets vers le Dépôt Dimensionnel (60 ➔ 120 items/min)."
        },
        {
          id: "alien_depot_upload_speed_2",
          name: "Vitesse de Transfert Dépôt II",
          icon: "⚡",
          cost: { "mercer_sphere": 4, "aluminum_sheet": 50 },
          timeSec: 3,
          tierReq: 7,
          parents: ["alien_depot_upload_speed_1"],
          unlocks: "Vitesse de transfert maximale vers le Dépôt (120 ➔ 240 items/min)."
        },
        {
          id: "alien_depot_capacity_1",
          name: "Capacité Dimensionnelle I",
          icon: "🎒",
          cost: { "mercer_sphere": 3, "computer": 20 },
          timeSec: 3,
          tierReq: 5,
          parents: ["alien_dimensional_depot"],
          unlocks: "Augmente la réserve maximale du cloud de stockage à 2 piles complètes par objet."
        },
        {
          id: "alien_depot_capacity_2",
          name: "Capacité Dimensionnelle II",
          icon: "🎒",
          cost: { "mercer_sphere": 5, "supercomputer": 10 },
          timeSec: 3,
          tierReq: 7,
          parents: ["alien_depot_capacity_1"],
          unlocks: "Augmente la réserve maximale du cloud à 4 piles complètes par objet."
        },
        {
          id: "alien_somersloop_analysis",
          name: "Analyse des Somersloops",
          icon: "🌀",
          cost: { "somersloop": 1 },
          timeSec: 3,
          tierReq: 0,
          parents: [],
          unlocks: "Débloque l'amplification de production (+100% de rendement gratuit par machine)."
        },
        {
          id: "alien_power_augmenter",
          name: "Amplificateur de Puissance Alien 1.0",
          icon: "⚡",
          cost: { "somersloop": 5, "supercomputer": 20, "heavy_modular_frame": 20 },
          timeSec: 3,
          tierReq: 7,
          parents: ["alien_somersloop_analysis"],
          unlocks: "Bâtiment : Amplificateur Alien (+500 MW constants + boost de 10% sur la capacité totale du réseau électrique mondial)."
        }
      ]
    },

    caterium: {
      id: "caterium",
      name: "Caterium",
      icon: "🟡",
      color: "#ffd000",
      description: "Recherche sur les supraconducteurs en or Caterium, l'électronique avancée, les Poteaux Mk.2/3 et la Géothermie.",
      nodes: [
        {
          id: "cat_caterium_ingot",
          name: "Lingot de Caterium",
          icon: "🟡",
          cost: { "caterium_ore": 50 },
          timeSec: 3,
          tierReq: 0,
          parents: [],
          unlocks: "Recette : Lingot de Caterium."
        },
        {
          id: "cat_quickwire",
          name: "Fil Actif (Quickwire)",
          icon: "⚡",
          cost: { "caterium_ingot": 50 },
          timeSec: 3,
          tierReq: 0,
          parents: ["cat_caterium_ingot"],
          unlocks: "Recette : Fil Actif (Quickwire)."
        },
        {
          id: "cat_blade_runners",
          name: "Bottes de Course (Blade Runners)",
          icon: "👟",
          cost: { "quickwire": 50, "rotor": 10 },
          timeSec: 3,
          tierReq: 2,
          parents: ["cat_quickwire"],
          unlocks: "Équipement : Blade Runners (+50% vitesse de sprint, hauteur de saut accrue et réduction des dégâts de chute)."
        },
        {
          id: "cat_power_pole_mk2",
          name: "Poteaux Électriques Mk.2",
          icon: "🔌",
          cost: { "quickwire": 100 },
          timeSec: 3,
          tierReq: 2,
          parents: ["cat_quickwire"],
          unlocks: "Bâtiments : Poteau Électrique Mk.2 (7 connexions) et Fixation Murale Mk.2."
        },
        {
          id: "cat_power_pole_mk3",
          name: "Poteaux Électriques Mk.3",
          icon: "🔌",
          cost: { "high_speed_connector": 20, "steel_pipe": 100 },
          timeSec: 3,
          tierReq: 5,
          parents: ["cat_power_pole_mk2"],
          unlocks: "Bâtiments : Poteau Électrique Mk.3 (10 connexions) et Fixation Murale Mk.3."
        },
        {
          id: "cat_ai_limiter",
          name: "Limiteur IA",
          icon: "🧠",
          cost: { "quickwire": 200, "copper_sheet": 100 },
          timeSec: 3,
          tierReq: 4,
          parents: ["cat_quickwire"],
          unlocks: "Recette : Limiteur IA & Détecteur de Smart Splitters."
        },
        {
          id: "cat_smart_splitter",
          name: "Répartiteur Intelligent & Programmable",
          icon: "🔀",
          cost: { "ai_limiter": 10, "reinforced_iron_plate": 50 },
          timeSec: 3,
          tierReq: 4,
          parents: ["cat_ai_limiter"],
          unlocks: "Bâtiments : Smart Splitter et Programmable Splitter avec gestion du surplus (Overflow)."
        },
        {
          id: "cat_high_speed_connector",
          name: "Connecteur Haute Vitesse",
          icon: "🔲",
          cost: { "quickwire": 500, "plastic": 100 },
          timeSec: 3,
          tierReq: 5,
          parents: ["cat_ai_limiter"],
          unlocks: "Recette : Connecteur Haute Vitesse."
        },
        {
          id: "cat_geothermal",
          name: "Générateur Géothermique 1.0",
          icon: "🌋",
          cost: { "supercomputer": 10, "heavy_modular_frame": 20, "rubber": 100 },
          timeSec: 3,
          tierReq: 7,
          parents: ["cat_high_speed_connector"],
          unlocks: "Bâtiment : Centrale Géothermique (Énergie propre 100% renouvelable sur Geysers)."
        }
      ]
    },

    power_slugs: {
      id: "power_slugs",
      name: "Électrolimaces & Overclocking",
      icon: "🐌",
      color: "#3fe0d0",
      description: "Étude des gastéropodes fluorescents de Massage-2(AB)b pour surcadencer vos usines jusqu'à 250%.",
      nodes: [
        {
          id: "slug_blue",
          name: "Électrolimace Bleue",
          icon: "🐌",
          cost: { "blue_power_slug": 1 },
          timeSec: 3,
          tierReq: 0,
          parents: [],
          unlocks: "Recette : Éclat de Charge (1 éclat par limace bleue)."
        },
        {
          id: "slug_overclocking",
          name: "Overclocking de Production (250%)",
          icon: "⚡",
          cost: { "power_shard": 1, "reinforced_iron_plate": 10 },
          timeSec: 3,
          tierReq: 1,
          parents: ["slug_blue"],
          unlocks: "Fonctionnalité : Curseur d'overclocking jusqu'à 250% sur toutes les machines et générateurs."
        },
        {
          id: "slug_yellow",
          name: "Électrolimace Jaune",
          icon: "🐌",
          cost: { "yellow_power_slug": 1 },
          timeSec: 3,
          tierReq: 2,
          parents: ["slug_overclocking"],
          unlocks: "Recette : 2x Éclat de Charge par limace jaune."
        },
        {
          id: "slug_purple",
          name: "Électrolimace Violette",
          icon: "🐌",
          cost: { "purple_power_slug": 1 },
          timeSec: 3,
          tierReq: 4,
          parents: ["slug_yellow"],
          unlocks: "Recette : 5x Éclats de Charge par limace violette."
        },
        {
          id: "slug_synth_shard",
          name: "Synthèse d'Éclats de Charge 1.0",
          icon: "💎",
          cost: { "power_shard": 10, "dark_matter_crystal": 20 },
          timeSec: 3,
          tierReq: 9,
          parents: ["slug_purple"],
          unlocks: "Recette Quantique : Fabrication synthétique infinie d'Éclats de Charge sans chasser les limaces."
        }
      ]
    },

    quartz: {
      id: "quartz",
      name: "Quartz",
      icon: "💎",
      color: "#e056fd",
// REMOVED_FEATURE:       description: "Étude des cristaux de quartz, fibres optiques, oscillateurs, Tours Radar et structures en verre.",
      nodes: [
        {
          id: "quartz_discovery",
          name: "Quartz Brut",
          icon: "💎",
          cost: { "raw_quartz": 20 },
          timeSec: 3,
          tierReq: 0,
          parents: [],
          unlocks: "Recettes : Cristal de Quartz et Silice."
        },
        {
          id: "quartz_blade_runners",
          name: "Bottes Tout-Terrain",
          icon: "👟",
          cost: { "silica": 50, "modular_frame": 10 },
          timeSec: 3,
          tierReq: 2,
          parents: ["quartz_discovery"],
          unlocks: "Amélioration d'exploration et amortisseurs de chute."
        },
        {
          id: "quartz_oscillator",
          name: "Oscillateur à Cristal",
          icon: "📻",
          cost: { "quartz_crystal": 100, "reinforced_iron_plate": 30 },
          timeSec: 3,
          tierReq: 3,
          parents: ["quartz_discovery"],
          unlocks: "Recette : Oscillateur à Cristal."
        },
        {
// REMOVED_FEATURE:           id: "quartz_radar_tower",
// REMOVED_FEATURE:           name: "Tour Radar",
          icon: "📡",
          cost: { "crystal_oscillator": 10, "steel_beam": 50, "circuit_board": 20 },
          timeSec: 3,
          tierReq: 4,
          parents: ["quartz_oscillator"],
// REMOVED_FEATURE:           unlocks: "Bâtiment : Tour Radar (Révèle automatiquement les gisements et disques durs dans une zone de 3 km)."
        }
      ]
    },

    sulfur: {
      id: "sulfur",
      name: "Soufre & Armement",
      icon: "💣",
      color: "#f39c12",
      description: "Explosifs industriels, Nobelisk, cartouches de fusil avancées et Turbo-carburant.",
      nodes: [
        {
          id: "sulfur_discovery",
          name: "Poudre Noire",
          icon: "💣",
          cost: { "sulfur": 10, "coal": 10 },
          timeSec: 3,
          tierReq: 0,
          parents: [],
          unlocks: "Recette : Poudre Noire."
        },
        {
          id: "sulfur_nobelisk",
          name: "Détonateur & Nobelisk",
          icon: "🧨",
          cost: { "black_powder": 50, "steel_pipe": 50 },
          timeSec: 3,
          tierReq: 3,
          parents: ["sulfur_discovery"],
          unlocks: "Équipement : Détonateur Nobelisk (Destruction des rochers fissurés et des plantes toxiques)."
        },
        {
          id: "sulfur_rifle_ammo",
          name: "Munitions de Fusil Standard & Guidées",
          icon: "🎯",
          cost: { "black_powder": 100, "copper_sheet": 100, "motor": 20 },
          timeSec: 3,
          tierReq: 4,
          parents: ["sulfur_nobelisk"],
          unlocks: "Arme : Fusil d'Assaut FICSIT et cartouches Homing à tête chercheuse."
        },
        {
          id: "sulfur_turbofuel",
          name: "Turbo-Carburant",
          icon: "🚀",
          cost: { "compacted_coal": 25, "packaged_fuel": 25 },
          timeSec: 3,
          tierReq: 5,
          parents: ["sulfur_discovery"],
          unlocks: "Recette : Turbo-Carburant standard (Combustible haute densité 2000 MJ)."
        },
        {
          id: "sulfur_nuke_nobelisk",
          name: "Nobelisk Nucléaire",
          icon: "☢️",
          cost: { "nobelisk": 50, "encased_uranium_cell": 10 },
          timeSec: 3,
          tierReq: 8,
          parents: ["sulfur_rifle_ammo"],
          unlocks: "Munition Ultime : Nobelisk Nucléaire (Dégâts dévastateurs sur zone géante)."
        }
      ]
    },

    alien_organisms: {
      id: "alien_organisms",
      name: "Organismes Extraterrestres",
      icon: "🦎",
      color: "#2ecc71",
      description: "Autopsie de la faune locale (Hogs, Spitters, Stingers, Hatchers) pour synthétiser des protéines et de l'ADN FICSIT.",
      nodes: [
        {
          id: "org_protein",
          name: "Capsule de Protéines Alien",
          icon: "💊",
          cost: { "hog_remains": 1 },
          timeSec: 3,
          tierReq: 0,
          parents: [],
          unlocks: "Recette : Capsule de Protéines Alien & Broyeur d'ADN."
        },
        {
          id: "org_dna",
          name: "Capsule d'ADN Alien (Tickets AWESOME)",
          icon: "🧬",
          cost: { "protein_capsule": 5 },
          timeSec: 3,
          tierReq: 1,
          parents: ["org_protein"],
          unlocks: "Recette : Capsule d'ADN Alien (Rendement massif de coupons au Broyeur AWESOME)."
        },
        {
          id: "org_rebar_shatter",
          name: "Pistolet à Clous Élargi (Shatter Rebar)",
          icon: "🔫",
          cost: { "protein_capsule": 10, "iron_rod": 100 },
          timeSec: 3,
          tierReq: 2,
          parents: ["org_protein"],
          unlocks: "Munition : Éclats Rebar (Effet fusil à pompe de proximité)."
        }
      ]
    },

    mycelia: {
      id: "mycelia",
      name: "Mycélia & Équipement Médical",
      icon: "🍄",
      color: "#e67e22",
      description: "Étude des champignons et fibres biologiques pour fabriquer du tissu, des parachutes et des masques filtrants.",
      nodes: [
        {
          id: "myc_fabric",
          name: "Tissu Synthétique",
          icon: "🧵",
          cost: { "mycelia": 25, "biomass": 100 },
          timeSec: 3,
          tierReq: 0,
          parents: [],
          unlocks: "Recette : Tissu."
        },
        {
          id: "myc_parachute",
          name: "Parachute Réutilisable 1.0",
          icon: "🪂",
          cost: { "fabric": 10, "cable": 50 },
          timeSec: 3,
          tierReq: 1,
          parents: ["myc_fabric"],
          unlocks: "Équipement : Parachute réutilisable à volonté pour le vol plané."
        },
        {
          id: "myc_gas_mask",
          name: "Masque à Gaz & Filtres",
          icon: "😷",
          cost: { "fabric": 50, "steel_pipe": 50, "rubber": 50 },
          timeSec: 3,
          tierReq: 4,
          parents: ["myc_fabric"],
          unlocks: "Équipement : Masque à gaz (Immunité totale aux gaz toxiques)."
        }
      ]
    },

    nutrients: {
      id: "nutrients",
      name: "Nutriments & Soins",
      icon: "🍓",
      color: "#e84393",
      description: "Plantes curatives comestibles de la planète pour maximiser les points de vie du pionnier.",
      nodes: [
        {
          id: "nut_berries",
          name: "Bérilles & Noix Pâles",
          icon: "🍓",
          cost: { "beryl_nut": 5 },
          timeSec: 3,
          tierReq: 0,
          parents: [],
          unlocks: "Consommables de régénération rapide de PV."
        },
        {
          id: "nut_inhaler",
          name: "Inhalateur Médical Haute Puissance",
          icon: "💉",
          cost: { "bacon_agaric": 5, "paleberry": 10, "beryl_nut": 20 },
          timeSec: 3,
          tierReq: 1,
          parents: ["nut_berries"],
          unlocks: "Équipement : Inhalateur Médical (Restaure instantanément 100% des points de vie)."
        }
      ]
    }
  },

  // 2. Tier-List & Guide Décisionnel des 100+ Recettes Alternatives
  alternateTierList: [
    // TIER S (Indispensables & Révolutionnaires)
    {
      id: "recipe_alt_cast_screws",
      name: "Vis Coulées (Cast Screws)",
      tier: "S",
      category: "iron",
      tags: ["zero_rods", "less_machines", "tier_s"],
      description: "Produit des vis DIRECTEMENT à partir de lingots de fer en éliminant complètement l'étape des tiges de fer.",
      advantage: "+50% de gain de place, élimine la moitié des constructeurs dans les lignes de plaques renforcées et rotors.",
      minTier: 1
    },
    {
      id: "recipe_alt_steel_screws",
      name: "Boulons en Acier (Steel Screws)",
      tier: "S",
      category: "steel",
      tags: ["zero_rods", "compact", "tier_s"],
      description: "1 Poutre en acier produit 52 vis (260 vis/min par constructeur).",
      advantage: "Rendement monstrueux : 1 seul constructeur alimente une usine complète de cadres modulaires lourds.",
      minTier: 3
    },
    {
      id: "recipe_alt_stitched_iron_plate",
      name: "Plaque de Fer Cousue (Stitched Iron Plate)",
      tier: "S",
      category: "iron",
      tags: ["zero_screws", "copper_synergy", "tier_s"],
      description: "Combine Plaques de fer + Fil électrique (ou fil actif) sans aucune vis.",
      advantage: "Supprime totalement les vis de la chaîne des plaques de fer renforcées.",
      minTier: 2
    },
    {
      id: "recipe_alt_copper_rotor",
      name: "Rotor en Cuivre (Copper Rotor)",
      tier: "S",
      category: "copper",
      tags: ["zero_screws", "fast", "tier_s"],
      description: "Tiges de fer + Tôle de cuivre (élimine les vis).",
      advantage: "Cadence doublée (11.25 rotors/min) et zéro vis.",
      minTier: 2
    },
    {
      id: "recipe_alt_heavy_encased_frame",
      name: "Cadre Modulaire Lourd Enchâssé",
      tier: "S",
      category: "steel",
      tags: ["zero_screws", "best_ratio", "tier_s"],
      description: "Remplace les vis par du béton et des poutres industrielles dans la façonneuse.",
      advantage: "La meilleure recette du jeu pour les HMF : +30% de rendement, zéro vis.",
      minTier: 4
    },
    {
      id: "recipe_alt_wet_concrete",
      name: "Béton Humide (Wet Concrete)",
      tier: "S",
      category: "minerals",
      tags: ["pure_ore", "compact", "tier_s"],
      description: "Combine Calcaire + Eau en raffinerie pour doubler le rendement en béton.",
      advantage: "Produit 80 bétons/min par machine. Parfait pour les chantiers massifs.",
      minTier: 5
    },
    {
      id: "recipe_alt_heavy_oil_residue",
      name: "Résidu de Pétrole Lourd (Alt)",
      tier: "S",
      category: "oil",
      tags: ["max_energy", "turbofuel", "tier_s"],
      description: "Rendement de résidu lourd maximal (40 HOR + 20 Résine par 30 Pétrole brut).",
      advantage: "La clé de voûte de toutes les méga-centrales électriques Turbo-Carburant et Carburant de Fusée 1.0.",
      minTier: 5
    },
    {
      id: "recipe_alt_diluted_fuel",
      name: "Carburant Dilué (Diluted Fuel)",
      tier: "S",
      category: "oil",
      tags: ["max_energy", "double_yield", "tier_s"],
      description: "Combine Résidu lourd + Eau dans un mélangeur pour tripler la production de carburant.",
      advantage: "Rendement doublé : 100 m³ de pétrole deviennent 200 m³ de carburant.",
      minTier: 7
    },
    {
      id: "recipe_alt_silicon_circuit_board",
      name: "Circuit Imprimé Silicone",
      tier: "S",
      category: "quartz",
      tags: ["compact", "fast", "tier_s"],
      description: "Combine Cuivre + Silice dans un assembleur.",
      advantage: "Produit 12.5 circuits/min sans aucun plastique ni pétrole !",
      minTier: 4
    },

    // TIER A (Excellentes & Très Fortes)
    {
      id: "recipe_alt_pure_iron_ingot",
      name: "Lingot de Fer Pur",
      tier: "A",
      category: "iron",
      tags: ["pure_ore", "high_yield"],
      description: "Fer + Eau en raffinerie (+85% de rendement en lingots).",
      advantage: "Transforme un gisement de fer standard en méga-gisement.",
      minTier: 5
    },
    {
      id: "recipe_alt_solid_steel_ingot",
      name: "Lingot d'Acier Massif (Solid Steel)",
      tier: "A",
      category: "steel",
      tags: ["high_yield", "pure_ore"],
      description: "Combine Lingots de fer + Charbon en fonderie.",
      advantage: "+50% d'acier par minerai comparé à la recette standard.",
      minTier: 3
    },
    {
      id: "recipe_alt_silicon_computer",
      name: "Ordinateur Silicone (Silicon Computer)",
      tier: "A",
      category: "quartz",
      tags: ["compact", "less_machines"],
      description: "Assembleur : Circuits imprimés + Silice.",
      advantage: "Très compact, cadence rapide et élimine les vis des ordinateurs.",
      minTier: 5
    },
    {
      id: "recipe_alt_fused_quickwire",
      name: "Fil Actif Fondu (Fused Quickwire)",
      tier: "A",
      category: "caterium",
      tags: ["pure_ore", "copper_synergy"],
      description: "Caterium + Cuivre en fonderie avancée.",
      advantage: "Multiplie par 3 la quantité de quickwire produite par lingot de Caterium.",
      minTier: 4
    },
    {
      id: "recipe_alt_encased_industrial_pipe",
      name: "Poutre Industrielle sur Tuyau",
      tier: "A",
      category: "steel",
      tags: ["compact", "less_steel"],
      description: "Utilise des tuyaux d'acier au lieu des poutres d'acier.",
      advantage: "Économise 30% d'acier brut et se fabrique en assembleur standard.",
      minTier: 4
    },
    {
      id: "recipe_alt_pure_copper_ingot",
      name: "Lingot de Cuivre Pur",
      tier: "A",
      category: "copper",
      tags: ["pure_ore", "high_yield"],
      description: "Cuivre + Eau en raffinerie (+150% de rendement).",
      advantage: "Énorme économie de minerai de cuivre.",
      minTier: 5
    },

    // TIER B (Bonnes & Pratiques)
    {
      id: "recipe_alt_bolted_iron_plate",
      name: "Plaque de Fer Boulonnée",
      tier: "B",
      category: "iron",
      tags: ["fast", "screw_heavy"],
      description: "Combine Plaques de fer + Vis à très haute vitesse (15/min).",
      advantage: "Très rapide mais dévore énormément de vis.",
      minTier: 2
    },
    {
      id: "recipe_alt_steel_rotor",
      name: "Rotor en Acier",
      tier: "B",
      category: "steel",
      tags: ["compact", "steel_synergy"],
      description: "Tuyaux d'acier + Fil actif.",
      advantage: "Pratique pour centraliser la production sur une usine sidérurgique.",
      minTier: 3
    },
    {
      id: "recipe_alt_caterium_circuit_board",
      name: "Circuit Imprimé Caterium",
      tier: "B",
      category: "caterium",
      tags: ["caterium_synergy"],
      description: "Plastique + Fil actif.",
      advantage: "Très rapide, économise le cuivre.",
      minTier: 5
    },
    {
      id: "recipe_alt_electrode_aluminum_scrap",
      name: "Chutes d'Aluminium à Électrode",
      tier: "B",
      category: "aluminum",
      tags: ["no_coal_refinery"],
      description: "Solution d'alumine + Coke de pétrole.",
      advantage: "Permet de raffiner l'aluminium sans charbon si le pétrole est proche.",
      minTier: 7
    },

    // TIER C (Situationnelles)
    {
      id: "recipe_alt_charcoal",
      name: "Charbon de Bois (Charcoal)",
      tier: "C",
      category: "minerals",
      tags: ["biomass_only"],
      description: "Brûle du bois en constructeur pour faire du charbon.",
      advantage: "Utile en début de partie uniquement avant d'automatiser les mines.",
      minTier: 2
    },
    {
      id: "recipe_alt_biocoal",
      name: "Bio-Charbon (Biocoal)",
      tier: "C",
      category: "minerals",
      tags: ["biomass_only"],
      description: "Transforme de la biomasse en charbon.",
      advantage: "Déconseillé en usine automatisée continue.",
      minTier: 2
    },
    {
      id: "recipe_alt_iron_wire",
      name: "Fil de Fer (Iron Wire)",
      tier: "C",
      category: "iron",
      tags: ["save_copper"],
      description: "Fabrique du fil électrique à partir de lingots de fer.",
      advantage: "Pratique sur une base 100% fer isolée sans cuivre.",
      minTier: 1
    }
  ],

  // 3. Épaves de Capsules de Sauvetage (Crash Sites) emblématiques
  crashSites: [
    { id: "crash_1", biome: "Grass Fields", x: 280, y: 790, req: "20 MW Électricité", hardDrive: true, icon: "🛸" },
    { id: "crash_2", biome: "Northern Forest", x: 420, y: 310, req: "4x Cadre Modulaire", hardDrive: true, icon: "🛸" },
    { id: "crash_3", biome: "Rocky Desert", x: 190, y: 250, req: "30 MW Électricité", hardDrive: true, icon: "🛸" },
    { id: "crash_4", biome: "Dune Desert", x: 820, y: 220, req: "10x Rotor", hardDrive: true, icon: "🛸" },
    { id: "crash_5", biome: "Crater Lakes", x: 450, y: 430, req: "40 MW Électricité", hardDrive: true, icon: "🛸" },
    { id: "crash_6", biome: "The Swamp", x: 880, y: 550, req: "50x Plastique + 50 MW", hardDrive: true, icon: "🛸" },
    { id: "crash_7", biome: "Western Coast", x: 110, y: 520, req: "10x Moteur", hardDrive: true, icon: "🛸" },
    { id: "crash_8", biome: "Titan Forest", x: 590, y: 460, req: "100 MW Électricité", hardDrive: true, icon: "🛸" },
    { id: "crash_9", biome: "Spire Coast", x: 630, y: 160, req: "20x Circuit Imprimé", hardDrive: true, icon: "🛸" }
  ]
};
