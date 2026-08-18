// Catalogue Complet des Blueprints par Jalon et Générateur de fichiers .sbp / .sbpcfg
// Version Satisfactory 1.0+ (Paliers 0 à 9 & Phases 1 à 5 de l'Ascenseur Spatial)

const BLUEPRINTS_DATA = [
  // ==========================================
  // RÉSEAU FERROVIAIRE 1900 & GARES CATHÉDRALES
  // ==========================================
  {
    id: "bp_train_grand_station_1_4",
    milestoneId: "tier_6_monorail_trains",
    title: "🚂 La Grande Gare Cathédrale Multivoies (1-4)",
    category: "trains1900",
    image: "images/gare_cathedrale_1900.jpg",
    designerSize: "5x5 Fondations (Designer Mk.2)",
    description: "Chef-d'œuvre ferroviaire : Gare terminus/passage sous verrière cintrée vert-de-gris pour convoi 1-4 (1 Locomotive + 4 Quais de fret), équipée de 8 Conteneurs Industriels tampons anti-gel (25s) et double voie express centrale.",
    inputs: ["Double Voie Viaduc Viaduc 1900", "Alimentation Électrique par Rail"],
    outputs: ["4 Lignes de Fret continu (jusqu'à 1560 items/min)", "Transit Express Central"],
    powerMW: 150,
    buildingsCount: {
      train_station: 1,
      freight_platform: 4,
      storage_container_industrial: 8,
      rail_switch_control: 2,
      wall_glass: 64,
      pillar_concrete: 16
    },
    materialsNeeded: {
      heavy_modular_frame: 50,
      computer: 50,
      steel_pipe: 350,
      concrete: 600,
      quartz_crystal: 120,
      copper_sheet: 100
    },
    schematic: `
    [ VERRIÈRE CINTRÉE ÉMERAUDE - GARE CENTRALE 1-4 ]
    ══════════════════════════════════════════════════════════
    [ Quai Fret 4 ] ──> [ Double Conteneur Tampon ] ──> Sortie 4
    [ Quai Fret 3 ] ──> [ Double Conteneur Tampon ] ──> Sortie 3
    [ Quai Fret 2 ] ──> [ Double Conteneur Tampon ] ──> Sortie 2
    [ Quai Fret 1 ] ──> [ Double Conteneur Tampon ] ──> Sortie 1
    [ Tête Gare  ] ──> [ Aiguillage Feux de Trajet (Path) ]
    ─────────────────── [ Voie Express Transit ] ─────────────>
    ══════════════════════════════════════════════════════════
    `
  },
  {
    id: "bp_train_viaduc_double_track",
    milestoneId: "tier_6_monorail_trains",
    title: "🚂 Tronçon de Viaduc Double Voie 1900",
    category: "trains1900",
    designerSize: "4x4 Fondations (Designer Mk.1)",
    description: "Viaduc ferroviaire aérien surélevé : 2 voies parallèles (Aller à droite / Retour à gauche) avec arcades en pierre taillée, caténaires intégrées, caniveaux de câblage et réverbères ambrés.",
    inputs: ["Voie Aller", "Voie Retour"],
    outputs: ["Ligne principale haute vitesse 120 km/h"],
    powerMW: 0,
    buildingsCount: {
      railroad_track: 2,
      pillar_concrete: 8,
      steel_beam: 16,
      street_light: 2
    },
    materialsNeeded: {
      concrete: 120,
      steel_beam: 40,
      steel_pipe: 30,
      cable: 20
    },
    schematic: `
      [ VOIE RETOUR <── ]        [ VOIE ALLER ──> ]
      ═════════════════════════════════════════════
      [ TABLIER EN ACIER RIVETÉ & RÉVERBÈRES AMBRÉS ]
             │                             │
      [ PILE DE VIADUC EN PIERRE NATURELLE TAILLÉE ]
    `
  },
  {
    id: "bp_train_flying_junction_exchange",
    milestoneId: "tier_6_monorail_trains",
    title: "🚂 Échangeur en Saut-de-Mouton sans Collision",
    category: "trains1900",
    designerSize: "5x5 Fondations (Designer Mk.2)",
    description: "Jonction ferroviaire parfaite à dénivelé (une voie passe au-dessus de l'autre par un pont cintré) avec feux de trajet (Path Signals) à l'entrée et feux de bloc en sortie. Zéro croisement à niveau, zéro risque de collision.",
    inputs: ["Double Voie Ligne Principale", "Embranchement Vers Campus"],
    outputs: ["Bifurcation à pleine vitesse sans arrêt de train"],
    powerMW: 0,
    buildingsCount: {
      railroad_track: 6,
      railroad_signal_path: 4,
      railroad_signal_block: 4,
      pillar_concrete: 12
    },
    materialsNeeded: {
      concrete: 200,
      steel_beam: 80,
      steel_pipe: 60,
      copper_sheet: 40
    },
    schematic: `
    Voie Aller ═════════════════════════════════════════════>
                     \ (Feu Path)
                      \ ─── Pont Supérieur Dénivelé ───┐
                                                       ▼
    Voie Retour <══════════════════════════════════ Branchement Campus
    `
  },
  {
    id: "bp_train_mining_outpost_1_4",
    milestoneId: "tier_6_monorail_trains",
    title: "🚂 Gare d'Avant-Poste Minier 1-4 (Chargement)",
    category: "trains1900",
    designerSize: "5x5 Fondations (Designer Mk.2)",
    description: "Gare de chargement rapide pour avant-poste d'extraction : 4 Plateformes de chargement alimentées en continu par 4 conteneurs tampons, avec boucle de retournement intégrée.",
    inputs: ["4 Sources de Minerais Bruts (Fer, Cuivre, Charbon, Bauxite)"],
    outputs: ["Chargement automatique du convoi 1-4 en 25 secondes"],
    powerMW: 120,
    buildingsCount: {
      train_station: 1,
      freight_platform: 4,
      storage_container_industrial: 4,
      railroad_signal_block: 2
    },
    materialsNeeded: {
      heavy_modular_frame: 40,
      computer: 40,
      steel_pipe: 250,
      concrete: 400
    },
    schematic: `
    [ 4 Lignes Minerais In ] ──> [ 4 Conteneurs Tampons ] ──> [ 4 Quais de Chargement ]
                                                                      │
                               [ Convoi 1-4 Plein ──> Départ vers Gare Centrale ]
    `
  },
  // ==========================================
  // CHEFS-D'ŒUVRE D'ARCHITECTURE 1900 & PALAIS INDUSTRIEL
  // ==========================================
  {
    id: "bp_arch_grand_dome_clocktower",
    milestoneId: "general",
    title: "🏛️ Le Grand Dôme Central & Tour Horloge FICSIT",
    category: "palais1900",
    image: "images/dome_central_horloge.jpg",
    designerSize: "5x5 Fondations (Designer Mk.2)",
    description: "Chef-d'œuvre architectural néo-classique : Coupole vitrée de 40m, Tour Horloge victorienne culminant à 48m, QG central, HUB FICSIT, laboratoire M.A.M. et salle de commandement panoramique à 360°.",
    inputs: ["Alimentation Électrique Principale", "Réseau de Télécommunication"],
    outputs: ["Point Zéro du Campus", "Belvédère Panoramique", "Salle des Cartes"],
    powerMW: 50,
    buildingsCount: {
      hub: 1,
      mam: 1,
      craft_bench: 2,
      equipment_workshop: 1,
      power_switch: 4,
      power_pole_mk3: 8,
      wall_glass: 48,
      pillar_concrete: 16
    },
    materialsNeeded: {
      concrete: 450,
      steel_beam: 180,
      quartz_crystal: 120,
      copper_sheet: 80,
      cable: 100,
      reinforced_iron_plate: 60
    },
    schematic: `
                  ▲ [ FLÈCHE & HORLOGE VICTORIENNE (48m) ]
                  │
          ┌───────┴───────┐
         /  [ GRAND DÔME  \
        │   VERRE ÉMERAUDE ]│  ──> Belvédère Panoramique 360°
        │   (Atrium 40m)   │
         \                 /
          └───┬───────┬───┘
              │       │
       [ COLONNADE & STATUES ]
              │       │
     [ QG FICSIT - HUB & M.A.M. ]  ──> [ 4 Portes vers Ponts Suspendus ]
    `
  },
  {
    id: "bp_arch_hauts_fourneaux_1900",
    milestoneId: "tier_0_hub_1",
    title: "🏛️ Le Palais des Hauts Fourneaux d'Art 1900",
    category: "palais1900",
    image: "images/hauts_fourneaux_1900.jpg",
    designerSize: "4x4 Fondations (Designer Mk.1)",
    description: "Pavillon métallurgique d'architecte : 8 Fonderies sous verrière en berceau vert-de-gris, double plancher sandwich (logistique 100% invisible) et quais de déchargement au RDC sous arcades.",
    inputs: ["240 Minerai de Fer ou Cuivre / min (Quais sous arcades RDC)"],
    outputs: ["240 Lingots / min (Propulsion vers pont suspendu étage 1)"],
    powerMW: 32,
    buildingsCount: {
      smelter: 8,
      splitter: 8,
      merger: 8,
      wall_glass: 32,
      pillar_metal: 8
    },
    materialsNeeded: {
      iron_rod: 40,
      wire: 64,
      iron_plate: 80,
      concrete: 160,
      quartz_crystal: 48,
      copper_sheet: 30
    },
    schematic: `
    [ VERRIÈRE BERCEAU ÉMERAUDE ]
             ▲
    [ Étage 1 : 8 Fonderies d'Art sur Sol Poli ]
             │ (Élévateurs cachés)
    [ Étage Tech : Double Plancher Sandwich (2m) ] ──> [ Sortie Pont Suspendu 240/min ]
             │ (Trémies)
    [ RDC : Arcades Ouvertes & Quais Souterrains ] <── [ Entrée Minerais 240/min ]
    `
  },
  {
    id: "bp_arch_manufacture_estampage_1900",
    milestoneId: "tier_0_hub_3",
    title: "🏛️ La Manufacture d'Estampage & Pièces de Base",
    category: "palais1900",
    image: "images/guide_constructeurs.jpg",
    designerSize: "4x4 Fondations (Designer Mk.1)",
    description: "Atelier d'estampage industriel : 8 Constructeurs sous verrière néo-classique, plancher technique sandwich et départs en façade.",
    inputs: ["120 Lingots de Fer / min"],
    outputs: ["120 Plaques ou 80 Tiges / min"],
    powerMW: 32,
    buildingsCount: {
      constructor: 8,
      splitter: 8,
      merger: 8,
      wall_glass: 32,
      pillar_metal: 8
    },
    materialsNeeded: {
      reinforced_iron_plate: 16,
      cable: 32,
      concrete: 160,
      quartz_crystal: 48
    },
    schematic: `
    [ VERRIÈRE CINTRÉE 1900 ]
             ▲
    [ Étage 1 : 8 Constructeurs d'Art ]
             │ (Élévateurs cachés)
    [ Étage Tech : Double Plancher Sandwich (2m) ] ──> [ Sorties Estampage ]
             │ (Trémies)
    [ RDC : Quais de Déchargement Lingots ]
    `
  },
  {
    id: "bp_arch_halle_rotors_1900",
    milestoneId: "tier_2_part_assembly",
    title: "🏛️ La Grande Halle des Rotors & Assemblage",
    category: "palais1900",
    designerSize: "4x4 Fondations (Designer Mk.1)",
    description: "Halle d'assemblage noble : 4 Assembleuses sous nef vitrée, colonnes cannelées vert-de-gris, bus d'alimentation double totalement dissimulé sous le marbre.",
    inputs: ["30 Plaques de Fer / min", "20 Tiges / min", "160 Vis / min"],
    outputs: ["10 Plaques Renforcées / min", "8 Rotors / min"],
    powerMW: 60,
    buildingsCount: {
      assembler: 4,
      splitter: 8,
      merger: 4,
      wall_glass: 28,
      pillar_concrete: 8
    },
    materialsNeeded: {
      reinforced_iron_plate: 36,
      rotor: 16,
      cable: 60,
      concrete: 150,
      quartz_crystal: 40
    },
    schematic: `
    [ VERRIÈRE VOÛTÉE - LUEUR ÉMERAUDE ]
                   │
    [ 4 Assembleuses sur Sol Impeccable ]
                   │ (Alimentation par le bas)
    [ Sous-sol Sandwich : Double Bus Synchronisé ]
                   │
    [ Quais de Raccordement Ponts Suspendus ]
    `
  },
  {
    id: "bp_arch_suspension_bridge_segment",
    milestoneId: "general",
    title: "🌉 Tronçon de Pont Suspendu des Cascades",
    category: "palais1900",
    designerSize: "4x4 Fondations (Designer Mk.1)",
    description: "Module de grand viaduc suspendu : Pylônes en pierre taillée, haubans métalliques à 45°, tablier double (convoyeurs blindés cachés dans le tablier + voie piétonne en bois et réverbères ambrés au sommet).",
    inputs: ["Ligne de convoyeurs de transit inter-pavillons"],
    outputs: ["Franchissement de gouffres, cascades et vallées"],
    powerMW: 0,
    buildingsCount: {
      pillar_concrete: 12,
      steel_beam: 24,
      conveyor_pole: 8,
      street_light: 4
    },
    materialsNeeded: {
      concrete: 120,
      steel_beam: 48,
      iron_plate: 30,
      cable: 20
    },
    schematic: `
    [ CÂBLES & HAUBANS MÉTALLIQUES ]
           \                      /
            \                    /
      ───────[ PROMENADE PIÉTONNE AMBRÉE ]───────
      ═══════[ TABLIER : CONVOYEURS CACHÉS ]═══════
             │                    │
      [ PYLÔNES MONUMENTAUX EN ROCHE TAILLÉE ]
    `
  },
  // ==========================================
  // PALIER 0 - INTÉGRATION FICSIT
  // ==========================================
  {
    id: "bp_t0_smelting_rods",
    milestoneId: "tier_0_hub_1",
    title: "Palier 0 - Fonderies & Tiges de Fer",
    category: "tier0",
    designerSize: "4x4 Fondations (Designer Mk.1)",
    description: "Atelier de départ : 2 Fonderies + 2 Constructeurs produisant 30 Tiges de fer / min à partir de 60 Minerai de fer.",
    inputs: ["60 Minerai de Fer / min"],
    outputs: ["30 Tiges de Fer / min"],
    powerMW: 16,
    buildingsCount: { smelter: 2, constructor: 2, splitter: 2, merger: 2 },
    materialsNeeded: { iron_rod: 10, wire: 16, reinforced_iron_plate: 4, cable: 4 },
    schematic: `
    [ Min. Fer 60/min ] ── Répartiteur ──> [ 2 Fonderies ] ──> [ 2 Constructeurs ] ──> [ 30 Tiges/min ]
    `
  },
  {
    id: "bp_t0_plates_wire",
    milestoneId: "tier_0_hub_2",
    title: "Palier 0 - Plaques de Fer & Fil de Cuivre",
    category: "tier0",
    designerSize: "4x4 Fondations (Designer Mk.1)",
    description: "Ligne double indépendante : production simultanée de 20 Plaques de fer/min et 60 Fils électriques/min.",
    inputs: ["30 Minerai de Fer / min", "30 Minerai de Cuivre / min"],
    outputs: ["20 Plaques de Fer / min", "60 Fils Électriques / min"],
    powerMW: 16,
    buildingsCount: { smelter: 2, constructor: 2, splitter: 2, merger: 2 },
    materialsNeeded: { iron_rod: 10, wire: 16, reinforced_iron_plate: 4, cable: 4 },
    schematic: `
    [ Fer 30/min ]    ──> [ Fonderie ] ──> [ Constructeur ] ──> [ 20 Plaques/min ]
    [ Cuivre 30/min ] ──> [ Fonderie ] ──> [ Constructeur ] ──> [ 60 Fils/min ]
    `
  },
  {
    id: "bp_t0_screws_concrete",
    milestoneId: "tier_0_hub_3",
    title: "Palier 0 - Vis & Béton de Démarrage",
    category: "tier0",
    designerSize: "4x4 Fondations (Designer Mk.1)",
    description: "Module compact : 1 Constructeur de Béton (15/min) et 2 Constructeurs de Vis (80/min) pour débloquer les premières fondations.",
    inputs: ["45 Calcaire / min", "20 Tiges de Fer / min"],
    outputs: ["15 Béton / min", "80 Vis / min"],
    powerMW: 12,
    buildingsCount: { constructor: 3, splitter: 1, merger: 1 },
    materialsNeeded: { reinforced_iron_plate: 6, cable: 6, iron_rod: 15 },
    schematic: `
    [ Calcaire 45/min ] ──> [ Constructeur ] ──> [ 15 Béton/min ]
    [ Tiges 20/min ]    ──> [ 2 Constructeurs ] ──> [ 80 Vis/min ]
    `
  },
  {
    id: "bp_t0_cables_rods",
    milestoneId: "tier_0_hub_4",
    title: "Palier 0 - Câbles & Tiges Ravitailleur",
    category: "tier0",
    designerSize: "4x4 Fondations (Designer Mk.1)",
    description: "Module d'électrification produisant 30 Câbles / min et 30 Tiges / min avec coffres de stockage tampons intégrés.",
    inputs: ["60 Fil Électrique / min", "30 Lingots de Fer / min"],
    outputs: ["30 Câbles / min", "30 Tiges de Fer / min"],
    powerMW: 12,
    buildingsCount: { constructor: 3, splitter: 2, merger: 2 },
    materialsNeeded: { reinforced_iron_plate: 6, cable: 6, concrete: 20 },
    schematic: `
    [ Fils 60/min ]    ──> [ Constructeur ] ──> [ 30 Câbles/min ]
    [ Lingots 30/min ] ──> [ 2 Constructeurs ] ──> [ 30 Tiges/min ]
    `
  },
  {
    id: "bp_t0_hub_5_miner_starter",
    milestoneId: "tier_0_hub_5",
    title: "Palier 0 - Poste de Minage Automatisé Mk.1",
    category: "tier0",
    designerSize: "4x4 Fondations (Designer Mk.1)",
    description: "Avant-poste d'extraction : Foreuse Mk.1 avec groupeurs et stockage tampon de minerai direct.",
    inputs: ["Gisement de Minerai (Fer, Cuivre ou Calcaire)"],
    outputs: ["60 à 120 Minerais / min"],
    powerMW: 5,
    buildingsCount: { miner_mk1: 1, storage_container: 1 },
    materialsNeeded: { iron_plate: 10, concrete: 10, portable_miner: 1 },
    schematic: `
    [ Gisement ] ──> [ Foreuse Mk.1 ] ──> [ Conteneur Stockage ] ──> [ Ligne Usine ]
    `
  },
  {
    id: "bp_t0_starter_reinforced",
    milestoneId: "tier_0_hub_6",
    title: "Palier 0 - Atelier Démarrage Plaques Renforcées",
    category: "tier0",
    designerSize: "4x4 Fondations (Designer Mk.1)",
    description: "Mini-chaîne complète autonome : 1 Assembleuse de Plaques Renforcées (5/min) alimentée par ses constructeurs de plaques et vis.",
    inputs: ["60 Lingots de Fer / min"],
    outputs: ["5 Plaques de Fer Renforcées / min"],
    powerMW: 27,
    buildingsCount: { assembler: 1, constructor: 3, smelter: 2 },
    materialsNeeded: { reinforced_iron_plate: 14, rotor: 4, cable: 16, iron_rod: 20, wire: 32 },
    schematic: `
    [ Min. Fer 60/min ] ──> [ 2 Fonderies ] ──> [ Plaque + Vis ] ──> [ Assembleuse ] ──> [ 5 Plaques Renforcées/min ]
    `
  },

  // ==========================================
  // PALIER 1 - AUTOMATISATION DE BASE
  // ==========================================
  {
    id: "bp_t1_logistics_hub",
    milestoneId: "tier_1_logistics_1",
    title: "Palier 1 - Hub Logistique & Répartiteurs Compacts",
    category: "tier1",
    designerSize: "4x4 Fondations (Designer Mk.1)",
    description: "Tour de tri et stockage tampon vertical sur 3 niveaux pour organiser 4 lignes de ressources principales.",
    inputs: ["4 Lignes de convoyeurs d'entrée"],
    outputs: ["4 Lignes équilibrées + Conteneurs de stockage"],
    powerMW: 0,
    buildingsCount: { splitter: 8, merger: 8, storage_container: 4 },
    materialsNeeded: { iron_plate: 40, iron_rod: 40, concrete: 32 },
    schematic: `
    [ Ligne 1 ] ── Répartiteur ──> [ Conteneur 1 ] ──> [ Ligne 1 Out ]
    [ Ligne 2 ] ── Répartiteur ──> [ Conteneur 2 ] ──> [ Ligne 2 Out ]
    [ Ligne 3 ] ── Répartiteur ──> [ Conteneur 3 ] ──> [ Ligne 3 Out ]
    [ Ligne 4 ] ── Répartiteur ──> [ Conteneur 4 ] ──> [ Ligne 4 Out ]
    `
  },
  {
    id: "bp_t1_field_research_station",
    milestoneId: "tier_1_field_research",
    title: "Palier 1 - Station M.A.M. & Établi de Recherche",
    category: "tier1",
    designerSize: "4x4 Fondations (Designer Mk.1)",
    description: "Station d'avant-poste équipée du M.A.M., d'un établi d'équipement, de stockage d'échantillons et d'un générateur biomasse d'appoint.",
    inputs: ["Échantillons aliens & minerais bruts"],
    outputs: ["Recherches débloquées & Équipement explorateur"],
    powerMW: -20,
    buildingsCount: { mam: 1, equipment_workshop: 1, craft_bench: 1, biomass_burner: 1 },
    materialsNeeded: { iron_plate: 30, iron_rod: 20, wire: 50, concrete: 25 },
    schematic: `
    [ M.A.M. ] ── [ Établi ] ── [ Coffres Échantillons ] ── [ Brûleur Biomasse ]
    `
  },
  {
    id: "bp_t1_base_building_grid",
    milestoneId: "tier_1_base_building",
    title: "Palier 1 - Module Socle Fondations & Piliers 4x4",
    category: "tier1",
    designerSize: "4x4 Fondations (Designer Mk.1)",
    description: "Structure porteuse surélevée 4x4 avec murs d'angle, passerelles piétonnes FICSIT et sous-sol technique pour convoyeurs.",
    inputs: ["Structure architecturale"],
    outputs: ["Plateforme d'usine propre et nivelée"],
    powerMW: 0,
    buildingsCount: { foundation: 16, wall: 12, ladder: 2 },
    materialsNeeded: { concrete: 80, iron_plate: 40 },
    schematic: `
    [ Dalle Supérieure 4x4 ] ──> [ Sous-sol Technique ] ──> [ Piliers Porteurs ]
    `
  },

  // ==========================================
  // PALIER 2 - ASSEMBLAGE & PIÈCES AVANCÉES
  // ==========================================
  {
    id: "bp_t2_part_assembly_module",
    milestoneId: "tier_2_part_assembly",
    title: "Palier 2 - Usine Dédiée Rotors & Plaques Renforcées",
    category: "tier2",
    designerSize: "4x4 Fondations (Designer Mk.1)",
    description: "Module 2 Assembleuses : 1 pour Plaques de fer renforcées (5/min) + 1 pour Rotors (4/min) avec bus de vis central.",
    inputs: ["30 Plaques de Fer / min", "20 Tiges / min", "160 Vis / min"],
    outputs: ["5 Plaques Renforcées / min", "4 Rotors / min"],
    powerMW: 30,
    buildingsCount: { assembler: 2, splitter: 4, merger: 2 },
    materialsNeeded: { reinforced_iron_plate: 16, rotor: 8, cable: 20, concrete: 32 },
    schematic: `
    [ Plaques 30 ] ────┐
    [ Vis 160 ]   ─────┼──> [ Assem. Plaques ] ──> [ 5 Plaques Renforcées/min ]
    [ Tiges 20 ]  ─────┴──> [ Assem. Rotors  ] ──> [ 4 Rotors/min ]
    `
  },
  {
    id: "bp_t2_biofuel_processor",
    milestoneId: "tier_2_obstacle_clearing",
    title: "Palier 2 - Raffinerie Biomasse & Biocarburant Solide",
    category: "tier2",
    designerSize: "4x4 Fondations (Designer Mk.1)",
    description: "Traitement automatisé : Déposez bois/feuilles dans le coffre In, le module produit 120 Biocarburants Solides / min en continu.",
    inputs: ["Feuilles, Bois ou Carapace Alien"],
    outputs: ["120 Biocarburants Solides / min"],
    powerMW: 16,
    buildingsCount: { constructor: 4, splitter: 2, merger: 2, storage_container: 2 },
    materialsNeeded: { reinforced_iron_plate: 8, cable: 12, concrete: 24 },
    schematic: `
    [ Coffre Entrée ] ──> [ Const. Biomasse ] ──> [ Const. Biocarburant Solide ] ──> [ Coffre Sortie ]
    `
  },
  {
    id: "bp_t2_awesome_sink_hub",
    milestoneId: "tier_2_resource_sink",
    title: "Palier 2 - Broyeur A.W.E.S.O.M.E. & Trop-Plein",
    category: "tier2",
    designerSize: "4x4 Fondations (Designer Mk.1)",
    description: "Station de broyage automatique avec Répartiteur Intelligent pour broyer uniquement les excédents et obtenir des coupons FICSIT.",
    inputs: ["Ligne de surplus d'usine"],
    outputs: ["Coupons A.W.E.S.O.M.E. & Ligne prioritaire sécurisée"],
    powerMW: 30,
    buildingsCount: { resource_sink: 1, smart_splitter: 1, storage_container: 1 },
    materialsNeeded: { reinforced_iron_plate: 15, rotor: 10, cable: 30, concrete: 40 },
    schematic: `
    [ Convoyeur Usine ] ── Répartiteur Intelligent ──┬── Prioritaire ──> [ Ligne Usine ]
                                                     └── Débordement ──> [ Broyeur A.W.E.S.O.M.E. ]
    `
  },
  {
    id: "bp_t2_logistics_mk2_spine",
    milestoneId: "tier_2_logistics_2",
    title: "Palier 2 - Colonne Logistique Mk.2 (120/min)",
    category: "tier2",
    designerSize: "4x4 Fondations (Designer Mk.1)",
    description: "Élévateurs et convoyeurs Mk.2 étagés pour alimenter 3 étages d'ateliers à 120 pièces/min.",
    inputs: ["Convoyeurs 120/min"],
    outputs: ["Distribution verticale sur 3 étages"],
    powerMW: 0,
    buildingsCount: { conveyor_lift: 6, splitter: 6 },
    materialsNeeded: { reinforced_iron_plate: 20, concrete: 30 },
    schematic: `
    [ Ligne In 120/min ] ──> [ Élévateur Étage 1 ] ──> [ Étage 2 ] ──> [ Étage 3 ]
    `
  },

  // ==========================================
  // PALIER 3 - ÉNERGIE AU CHARBON & ACIER
  // ==========================================
  {
    id: "bp_t3_coal_power_station",
    milestoneId: "tier_3_coal_power",
    title: "Palier 3 - Centrale à Charbon 600 MW Autonome",
    category: "tier3",
    designerSize: "5x5 Fondations (Designer Mk.2)",
    description: "Module électrique complet de 8 générateurs à charbon et tuyauterie équilibrée (3 extracteurs d'eau raccordés à 360 m³/min).",
    inputs: ["120 Charbon / min", "360 m³ Eau / min"],
    outputs: ["+600 MW d'électricité continue"],
    powerMW: -600,
    buildingsCount: { coal_generator: 8, pipe_junction: 8, splitter: 8 },
    materialsNeeded: { reinforced_iron_plate: 40, rotor: 32, cable: 80, concrete: 120, copper_sheet: 60 },
    schematic: `
    [ Eau 360 m³/min ] ────── Tuyau Double Entrée ─────┐
    [ Charbon 120/min ] ───── Convoyeur Mk.2 ──────────┤
                                                       ▼
    [Gén 1] [Gén 2] [Gén 3] [Gén 4] [Gén 5] [Gén 6] [Gén 7] [Gén 8]
    `
  },
  {
    id: "bp_t3_tractor_station",
    milestoneId: "tier_3_vehicular_transport",
    title: "Palier 3 - Gare Routière pour Véhicules & Tracteurs",
    category: "tier3",
    designerSize: "4x4 Fondations (Designer Mk.1)",
    description: "Station de chargement/déchargement pour tracteurs et camions avec ligne de ravitaillement automatique en carburant.",
    inputs: ["Fret d'usine", "Charbon ou Biocarburant (Ravitaillement)"],
    outputs: ["Chargement / Déchargement automatique de véhicules"],
    powerMW: 20,
    buildingsCount: { truck_station: 1, storage_container: 2 },
    materialsNeeded: { modular_frame: 10, rotor: 20, reinforced_iron_plate: 20, concrete: 50 },
    schematic: `
    [ Fret In ] ──────────> [ Gare Routière In/Out ] ──> [ Fret Out ]
    [ Carburant In ] ─────> [ Réservoir Tracteur ]
    `
  },
  {
    id: "bp_t3_steel_foundry_block",
    milestoneId: "tier_3_basic_steel",
    title: "Palier 3 - Aciérie de Base (Poutres & Tuyaux)",
    category: "tier3",
    designerSize: "4x4 Fondations (Designer Mk.1)",
    description: "2 Fonderies avancées (90 Acier/min) alimentant 2 Constructeurs de Poutres en acier et 2 Constructeurs de Tuyaux en acier.",
    inputs: ["90 Minerai de Fer / min", "90 Charbon / min"],
    outputs: ["15 Poutres en Acier / min", "40 Tuyaux en Acier / min"],
    powerMW: 48,
    buildingsCount: { foundry: 2, constructor: 4, splitter: 4, merger: 2 },
    materialsNeeded: { modular_frame: 4, rotor: 8, concrete: 40, reinforced_iron_plate: 8, cable: 8 },
    schematic: `
    [ Fer + Charbon ] ──> [ 2 Fonderies Acier ] ──┬──> [ 2 Const. Poutres ] ──> [ 15 Poutres/min ]
                                                  └──> [ 2 Const. Tuyaux  ] ──> [ 40 Tuyaux/min ]
    `
  },

  // ==========================================
  // PALIER 4 - POUTRES INDUSTRIELLES & MOTEURS
  // ==========================================
  {
    id: "bp_t4_encased_and_motors",
    milestoneId: "tier_4_advanced_steel",
    title: "Palier 4 - Poutres Renforcées & Moteurs",
    category: "tier4",
    designerSize: "4x4 Fondations (Designer Mk.1)",
    description: "Atelier complet produisant 6 Poutres industrielles renforcées / min et 5 Moteurs / min.",
    inputs: ["18 Poutres Acier / min", "18 Béton / min", "10 Rotors / min", "10 Stators / min"],
    outputs: ["6 Poutres Renforcées / min", "5 Moteurs / min"],
    powerMW: 30,
    buildingsCount: { assembler: 2, splitter: 4, merger: 2 },
    materialsNeeded: { reinforced_iron_plate: 16, rotor: 8, cable: 20, concrete: 32 },
    schematic: `
    [ Poutres + Béton ] ──> [ Assembleuse 1 ] ──> [ 6 Poutres Renforcées/min ]
    [ Rotors + Stators ] ──> [ Assembleuse 2 ] ──> [ 5 Moteurs/min ]
    `
  },
  {
    id: "bp_t4_logistics_mk3_hub",
    milestoneId: "tier_4_logistics_3",
    title: "Palier 4 - Station Minage Mk.2 & Convoyeurs 270/min",
    category: "tier4",
    designerSize: "4x4 Fondations (Designer Mk.1)",
    description: "Station Foreuse Mk.2 à haut débit (270 minerai/min) avec double ligne de distribution Mk.3.",
    inputs: ["Gisement de Minerai"],
    outputs: ["270 Minerais / min"],
    powerMW: 12,
    buildingsCount: { miner_mk2: 1, storage_container: 2, splitter: 2 },
    materialsNeeded: { reinforced_iron_plate: 10, concrete: 20, modular_frame: 10 },
    schematic: `
    [ Gisement ] ──> [ Foreuse Mk.2 ] ──> [ Convoyeur Mk.3 (270/min) ] ──> [ Usine ]
    `
  },
  {
    id: "bp_t4_power_switch_substation",
    milestoneId: "tier_4_expanded_power",
    title: "Palier 4 - Sous-Station Électrique & Interrupteurs",
    category: "tier4",
    designerSize: "4x4 Fondations (Designer Mk.1)",
    description: "Module de contrôle du réseau électrique avec interrupteurs prioritaires, accumulateurs et isolateurs de circuits.",
    inputs: ["Réseau Électrique Global"],
    outputs: ["Sous-réseaux sécurisés avec coupure d'urgence"],
    powerMW: 0,
    buildingsCount: { power_switch: 4, power_pole_mk2: 6 },
    materialsNeeded: { steel_beam: 20, rotor: 20, cable: 100 },
    schematic: `
    [ Réseau Principal ] ── Interrupteurs FICSIT ──┬── Circuit Usine A
                                                   └── Circuit Usine B
    `
  },

  // ==========================================
  // PALIER 5 - PÉTROLE & CONDITIONNEMENT
  // ==========================================
  {
    id: "bp_t5_oil_refinery_starter",
    milestoneId: "tier_5_oil_processing",
    title: "Palier 5 - Raffinerie Plastique & Caoutchouc",
    category: "tier5",
    designerSize: "5x5 Fondations (Designer Mk.2)",
    description: "4 Raffineries de pétrole produisant 40 Plastique/min, 40 Caoutchouc/min et convertissant le résidu d'huile lourde en carburant.",
    inputs: ["120 Pétrole Brut / min"],
    outputs: ["40 Plastique / min", "40 Caoutchouc / min", "40 Carburant / min"],
    powerMW: 120,
    buildingsCount: { refinery: 4, pipe_junction: 4, splitter: 2, merger: 2 },
    materialsNeeded: { motor: 40, encased_industrial_beam: 40, steel_pipe: 120, copper_sheet: 80 },
    schematic: `
    [ Pétrole 120/min ] ──> [ 2 Raffineries Plastique ] ──> [ 40 Plastique/min ]
                        ──> [ 2 Raffineries Caoutchouc ] ──> [ 40 Caoutchouc/min ]
                                   └─ Résidu d'huile ──> [ Raffinerie Carburant ]
    `
  },
  {
    id: "bp_t5_heavy_modular_frame",
    milestoneId: "tier_5_industrial_manufacturing",
    title: "Palier 5 - Usine Cadres Modulaires Lourds",
    category: "tier5",
    designerSize: "5x5 Fondations (Designer Mk.2)",
    description: "1 Façonneuse à 4 entrées produisant 2 Cadres modulaires lourds / min avec répartiteurs étagés.",
    inputs: ["10 Cadres Modulaires / min", "40 Tuyaux Acier / min", "10 Poutres Renforcées / min", "240 Vis / min"],
    outputs: ["2 Cadres Modulaires Lourds / min"],
    powerMW: 55,
    buildingsCount: { manufacturer: 1, splitter: 4 },
    materialsNeeded: { motor: 10, heavy_modular_frame: 10, cable: 50, plastic: 50 },
    schematic: `
    [ 4 Bus Convoyeurs ] ──> [ Façonneuse 4 Entrées ] ──> [ 2 Cadres Lourds/min ]
    `
  },
  {
    id: "bp_t5_fluid_packager",
    milestoneId: "tier_5_fluid_packaging",
    title: "Palier 5 - Station Conditionneuse de Fluides & Carburant",
    category: "tier5",
    designerSize: "4x4 Fondations (Designer Mk.1)",
    description: "Conditionneuse et déconditionneuse pour emballer l'eau, le pétrole et le carburant en bidons pour le transport.",
    inputs: ["60 m³ Fluide / min", "60 Bidons Vides / min"],
    outputs: ["60 Bidons de Fluide / min"],
    powerMW: 20,
    buildingsCount: { packager: 2, pipe_junction: 2, splitter: 2 },
    materialsNeeded: { reinforced_iron_plate: 40, rubber: 20, steel_pipe: 40 },
    schematic: `
    [ Fluide + Bidons ] ──> [ Conditionneuse ] ──> [ Carburant en Bidon (Véhicules/Jetpack) ]
    `
  },

  // ==========================================
  // PALIER 6 - ÉNERGIE AU CARBURANT & TRAINS
  // ==========================================
  {
    id: "bp_t6_fuel_power_generator",
    milestoneId: "tier_6_fuel_power",
    title: "Palier 6 - Centrale Carburant 1000 MW (4 Générateurs 1.0)",
    category: "tier6",
    designerSize: "5x5 Fondations (Designer Mk.2)",
    description: "4 Générateurs à carburant Satisfactory 1.0 (250 MW chacun = 1000 MW total) avec nourrice d'alimentation fluide à 80 m³/min.",
    inputs: ["80 m³ Carburant / min"],
    outputs: ["+1000 MW d'électricité propre continue"],
    powerMW: -1000,
    buildingsCount: { fuel_generator: 4, pipe_junction: 4 },
    materialsNeeded: { computer: 20, heavy_modular_frame: 20, rubber: 120, quickwire: 400 },
    schematic: `
    [ Carburant 80 m³/min ] ── Nourrice ──> [ 4 Générateurs à Carburant (250 MW ch.) ] ──> [ +1000 MW ]
    `
  },
  {
    id: "bp_t6_monorail_station_hub",
    milestoneId: "tier_6_monorail_trains",
    title: "Palier 6 - Gare Ferroviaire & Double Plateforme Fret",
    category: "tier6",
    designerSize: "5x5 Fondations (Designer Mk.2)",
    description: "Gare ferroviaire modulaire pour trains électriques monorails avec 2 plateformes de fret automatisées et voie d'évitement.",
    inputs: ["Fret industriel lourd"],
    outputs: ["Transport ferroviaire longue distance instantané"],
    powerMW: 50,
    buildingsCount: { train_station: 1, freight_platform: 2 },
    materialsNeeded: { heavy_modular_frame: 20, computer: 20, steel_pipe: 200, concrete: 400 },
    schematic: `
    [ Rail In ] ──> [ Gare Ferroviaire ] ──> [ 2 Plateformes Fret ] ──> [ Rail Out ]
    `
  },
  {
    id: "bp_t6_logistics_mk4_bus",
    milestoneId: "tier_6_logistics_4",
    title: "Palier 6 - Bus Logistique Mk.4 (480/min)",
    category: "tier6",
    designerSize: "4x4 Fondations (Designer Mk.1)",
    description: "Hub de convoyeurs Mk.4 à très haut débit (480 pièces/min) avec répartiteurs programmables et élévateurs.",
    inputs: ["Convoyeurs 480/min"],
    outputs: ["Distribution haute cadence usine"],
    powerMW: 0,
    buildingsCount: { splitter: 8, conveyor_lift: 8 },
    materialsNeeded: { encased_industrial_beam: 40, heavy_modular_frame: 10, plastic: 60 },
    schematic: `
    [ Ligne In 480/min ] ──> [ Distribution Mk.4 ] ──> [ 4 Lignes Alimentées ]
    `
  },

  // ==========================================
  // PALIER 7 - BAUXITE, ALUMINIUM & DRONES
  // ==========================================
  {
    id: "bp_t7_aluminum_foundry",
    milestoneId: "tier_7_bauxite_refining",
    title: "Palier 7 - Usine d'Aluminium & Tôles Alclad",
    category: "tier7",
    designerSize: "5x5 Fondations (Designer Mk.2)",
    description: "Chaîne fermée avec réinjection d'eau : 2 Raffineries de résidus d'aluminium + 1 Fonderie + 1 Assembleuse d'Alclad (60/min).",
    inputs: ["120 Bauxite / min", "60 Charbon / min", "20 Lingots de Cuivre / min"],
    outputs: ["60 Tôles d'Aluminium Alclad / min", "60 Boîtiers en Aluminium / min"],
    powerMW: 110,
    buildingsCount: { refinery: 2, foundry: 1, assembler: 1, constructor: 1 },
    materialsNeeded: { motor: 30, encased_industrial_beam: 30, steel_pipe: 90, copper_sheet: 60 },
    schematic: `
    [ Bauxite + Eau ] ──> [ Raffinerie Solution ] ──> [ Raffinerie Résidus ] ──> [ Fonderie Alu ] ──> [ Tôles Alclad ]
                               ▲                               │ (Eau Recyclée)
                               └───────────────────────────────┘
    `
  },
  {
    id: "bp_t7_miner_mk3_hub",
    milestoneId: "tier_7_logistics_5",
    title: "Palier 7 - Minage Mk.3 & Convoyeurs Mk.5 (780/min)",
    category: "tier7",
    designerSize: "4x4 Fondations (Designer Mk.1)",
    description: "Extraction maximale : Foreuse Mk.3 surcadencée raccordée aux convoyeurs Mk.5 à débit ultime de 780 items/min.",
    inputs: ["Gisement Pur"],
    outputs: ["780 Minerais / min"],
    powerMW: 30,
    buildingsCount: { miner_mk3: 1, storage_container: 2 },
    materialsNeeded: { fused_modular_frame: 3, turbo_motor: 2, steel_pipe: 30, alclad_aluminum_sheet: 40 },
    schematic: `
    [ Gisement Pur ] ──> [ Foreuse Mk.3 ] ──> [ Convoyeur Mk.5 (780/min) ] ──> [ Usine Finale ]
    `
  },
  {
    id: "bp_t7_drone_port_station",
    milestoneId: "tier_7_aeronautical_engineering",
    title: "Palier 7 - Port de Drones & Unités Radio",
    category: "tier7",
    designerSize: "5x5 Fondations (Designer Mk.2)",
    description: "Port de drones autonome avec alimentation en batteries et ligne de fabrication d'Unités de Contrôle Radio (2.5/min).",
    inputs: ["Batteries", "Aluminium", "Circuits Imprimés", "Quartz"],
    outputs: ["Transport aérien par Drone FICSIT", "2.5 Unités de Contrôle Radio / min"],
    powerMW: 100,
    buildingsCount: { drone_port: 1, manufacturer: 1 },
    materialsNeeded: { radio_control_unit: 10, alclad_aluminum_sheet: 20, motor: 20 },
    schematic: `
    [ Port de Drone FICSIT ] ── Alimentation Batteries ──> [ Livraison Aérienne Express ]
    `
  },

  // ==========================================
  // PALIER 8 - ÉNERGIE NUCLÉAIRE, PARTICULES & HOVERPACK
  // ==========================================
  {
    id: "bp_t8_nuclear_power_block",
    milestoneId: "tier_8_nuclear_power",
    title: "Palier 8 - Centrale Nucléaire 2500 MW",
    category: "tier8",
    designerSize: "5x5 Fondations (Designer Mk.2)",
    description: "Centrale nucléaire complète 2500 MW avec double raccordement d'eau (240 m³/min) et alimentation en Barres d'uranium sécurisée.",
    inputs: ["0.2 Barre de Combustible d'Uranium / min", "240 m³ Eau / min"],
    outputs: ["+2500 MW d'électricité massive", "Déchets d'uranium (à recycler)"],
    powerMW: -2500,
    buildingsCount: { nuclear_power_plant: 1, pipe_junction: 2 },
    materialsNeeded: { heavy_modular_frame: 100, turbo_motor: 50, radio_control_unit: 100, cable: 1000 },
    schematic: `
    [ Barre Uranium ] ──┐
    [ Eau 240 m³/min ] ─┴─> [ Centrale Nucléaire FICSIT ] ──> [ +2500 MW ]
    `
  },
  {
    id: "bp_t8_particle_pasta",
    milestoneId: "tier_8_advanced_particle_physics",
    title: "Palier 8 - Accélérateur de Particules & Pâtes Nucléaires",
    category: "tier8",
    designerSize: "5x5 Fondations (Designer Mk.2)",
    description: "Accélérateur de particules alimenté en Poudre de cuivre et Cubes de conversion de pression pour l'Ascenseur Spatial.",
    inputs: ["100 Poudre de Cuivre / min", "0.5 Cube de Conversion / min"],
    outputs: ["0.5 Pâtes Nucléaires / min"],
    powerMW: 1000,
    buildingsCount: { particle_accelerator: 1, splitter: 2 },
    materialsNeeded: { reinforced_iron_plate: 100, electromagnetic_control_rod: 25, fused_modular_frame: 10, cooling_system: 20 },
    schematic: `
    [ Poudre Cuivre + Cubes ] ──> [ Accélérateur de Particules ] ──> [ Pâtes Nucléaires ]
    `
  },
  {
    id: "bp_t8_hoverpack_charging_station",
    milestoneId: "tier_8_hoverpack",
    title: "Palier 8 - Tour Électrique Haute Tension & Hoverpack",
    category: "tier8",
    designerSize: "4x4 Fondations (Designer Mk.1)",
    description: "Pylônes et commutateurs sans fil pour maintenir une couverture électrique 100% stable pour le vol continu en Hoverpack.",
    inputs: ["Réseau Électrique Global"],
    outputs: ["Zone de vol infini pour ingénieur en chef"],
    powerMW: 0,
    buildingsCount: { power_pole_mk3: 8, power_switch: 2 },
    materialsNeeded: { cooling_system: 10, radio_control_unit: 10, alclad_aluminum_sheet: 40 },
    schematic: `
    [ Réseau Haute Tension ] ──> [ Grille Électrique Aérienne ] ──> [ Vol Hoverpack Libre ]
    `
  },

  // ==========================================
  // PALIER 9 - TECHNOLOGIE QUANTIQUE & COMPRESSION (1.0)
  // ==========================================
  {
    id: "bp_t9_matter_converter",
    milestoneId: "tier_9_matter_conversion",
    title: "Palier 9 - Convertisseur de Matière Noire & SAM",
    category: "tier9",
    designerSize: "5x5 Fondations (Designer Mk.2)",
    description: "Convertisseur quantique transformant la Substance Alien Modifiée (SAM) en Résidus de matière noire et Cristaux temporels.",
    inputs: ["50 SAM / min"],
    outputs: ["100 Résidus de Matière Noire / min", "Diamants synthétiques"],
    powerMW: 250,
    buildingsCount: { converter: 1, splitter: 1 },
    materialsNeeded: { fused_modular_frame: 15, radio_control_unit: 10, cooling_system: 10, sam: 50 },
    schematic: `
    [ SAM 50/min ] ──> [ Convertisseur FICSIT ] ──> [ Résidus Matière Noire 100/min ]
    `
  },
  {
    id: "bp_t9_quantum_encoder_warp",
    milestoneId: "tier_9_quantum_encoding",
    title: "Palier 9 - Encodeur Quantique & Propulseur Balistique",
    category: "tier9",
    designerSize: "5x5 Fondations (Designer Mk.2)",
    description: "Encodeur quantique final Satisfactory 1.0 pour assembler les Propulseurs à distorsion balistique et Serveurs d'extension d'IA.",
    inputs: ["1 Fusée Thermique / min", "5 Cellules de Singularité / min", "2 Superordinateurs / min", "40 Cristaux Matière Noire / min"],
    outputs: ["1 Propulseur à Distorsion Balistique / min (Phase 5)"],
    powerMW: 2000,
    buildingsCount: { quantum_encoder: 1 },
    materialsNeeded: { dark_matter_crystal: 20, supercomputer: 10, fused_modular_frame: 10, time_crystal: 10 },
    schematic: `
    [ 4 Ingrédients Quantiques ] ──> [ Encodeur Quantique 1.0 ] ──> [ Propulseur Distorsion ]
    `
  },
  {
    id: "bp_t9_dimensional_depot",
    milestoneId: "tier_9_spatial_compression",
    title: "Palier 9 - Dépôt Dimensionnel & Portail FICSIT",
    category: "tier9",
    designerSize: "4x4 Fondations (Designer Mk.1)",
    description: "Hub de compression dimensionnelle pour téléporter instantanément tous les objets d'usine directement dans votre inventaire cloud !",
    inputs: ["Toutes ressources d'usine finies"],
    outputs: ["Accès inventaire dimensionnel universel infini"],
    powerMW: 100,
    buildingsCount: { dimensional_depot: 4, splitter: 4 },
    materialsNeeded: { singularity_cell: 10, neural_quantum_processor: 10, fused_modular_frame: 10 },
    schematic: `
    [ Ressources Usine ] ──> [ Dépôt Dimensionnel ] ──> [ Inventaire Cloud Disponible Partout ]
    `
  },

  // ==========================================
  // PHASES DE L'ASCENSEUR SPATIAL (PHASES 1 À 5)
  // ==========================================
  {
    id: "bp_phase1_smart_plating",
    milestoneId: "phase_1",
    title: "🚀 Phase 1 - Usine Placages Intelligents",
    category: "phases",
    designerSize: "4x4 Fondations (Designer Mk.1)",
    description: "Chaîne compacte produisant 2 Placages intelligents / min pour compléter la Phase 1 en 25 minutes.",
    inputs: ["2 Plaques Renforcées / min", "2 Rotors / min"],
    outputs: ["2 Placages Intelligents / min (50 requis total)"],
    powerMW: 15,
    buildingsCount: { assembler: 1, splitter: 2 },
    materialsNeeded: { reinforced_iron_plate: 8, rotor: 4, cable: 10, concrete: 20 },
    schematic: `
    [ Plaques Renforcées + Rotors ] ──> [ Assembleuse ] ──> [ 2 Placages Intelligents/min ]
    `
  },
  {
    id: "bp_phase2_expansion",
    milestoneId: "phase_2",
    title: "🚀 Phase 2 - Usine Polyvalente & Câblage Automatisé",
    category: "phases",
    designerSize: "5x5 Fondations (Designer Mk.2)",
    description: "Module multi-assembleuses produisant simultanément les 3 composants de la Phase 2.",
    inputs: ["Poutres Acier, Cadres Modulaires, Stators, Câbles, Rotors, Plaques Renforcées"],
    outputs: ["Placages Intelligents, Structures Polyvalentes, Câblage Automatisé"],
    powerMW: 45,
    buildingsCount: { assembler: 3, splitter: 6, merger: 3 },
    materialsNeeded: { reinforced_iron_plate: 24, rotor: 12, cable: 30, concrete: 60 },
    schematic: `
    [ Bus Ingrédients ] ──┬──> [ Assem 1 ] ──> [ Placage Intelligent ]
                         ├──> [ Assem 2 ] ──> [ Structure Polyvalente ]
                         └──> [ Assem 3 ] ──> [ Câblage Automatisé ]
    `
  },
  {
    id: "bp_phase3_heavy_assembly",
    milestoneId: "phase_3",
    title: "🚀 Phase 3 - Moteurs Modulaires & Contrôle Adaptatif",
    category: "phases",
    designerSize: "5x5 Fondations (Designer Mk.2)",
    description: "2 Façonneuses et 1 Assembleuse produisant les composants haute technologie pour le Palier 7/8.",
    inputs: ["Moteurs, Caoutchouc, Placages Intelligents, Câblages Automatisés, Circuits Imprimés, Cadres Lourds"],
    outputs: ["1 Moteur Modulaire / min", "1 Unité de Contrôle Adaptatif / min"],
    powerMW: 125,
    buildingsCount: { manufacturer: 2, assembler: 1, splitter: 8 },
    materialsNeeded: { heavy_modular_frame: 20, motor: 20, cable: 100, plastic: 100 },
    schematic: `
    [ Ingrédients Tier 5/6 ] ──> [ 2 Façonneuses Dédiées ] ──> [ Moteurs Modulaires + Contrôle Adaptatif ]
    `
  },
  {
    id: "bp_phase4_propulsion",
    milestoneId: "phase_4",
    title: "🚀 Phase 4 - Systèmes de Guidage & Fusées Thermiques",
    category: "phases",
    designerSize: "5x5 Fondations (Designer Mk.2)",
    description: "Ensemble complet pour la Phase 4 : Fusées à propulsion thermique, Générateurs magnétiques et Guidage d'assemblage.",
    inputs: ["Turbomoteurs, Refroidissement, Cadres Fusionnés, Superordinateurs, Barres Électromagnétiques"],
    outputs: ["Composants Phase 4 pour débloquer le Palier 9"],
    powerMW: 180,
    buildingsCount: { manufacturer: 3, assembler: 1 },
    materialsNeeded: { heavy_modular_frame: 30, turbo_motor: 10, supercomputer: 10, plastic: 150 },
    schematic: `
    [ Composants Avancés ] ──> [ Lignes Façonneuses ] ──> [ Fusées Thermiques + Guidage ]
    `
  },
  {
    id: "bp_phase5_victory",
    milestoneId: "phase_5",
    title: "🚀 Phase 5 - Sauvetage de la Terre (Victoire 1.0)",
    category: "phases",
    designerSize: "5x5 Fondations (Designer Mk.2)",
    description: "L'installation finale ultime Satisfactory 1.0 combinant Encodeurs quantiques et Accélérateurs pour clore la campagne FICSIT !",
    inputs: ["Pâtes Nucléaires, Matière Noire, Serveurs IA, Sculpteurs Biochimiques, Distorsion"],
    outputs: ["Achèvement du Projet Assemblée & Victoire finale"],
    powerMW: 4500,
    buildingsCount: { quantum_encoder: 3, particle_accelerator: 2 },
    materialsNeeded: { dark_matter_crystal: 60, supercomputer: 30, fused_modular_frame: 30, time_crystal: 30 },
    schematic: `
    [ Technologies Quantiques 1.0 ] ──> [ Encodeurs Quantiques ] ──> [ VICTOIRE SATISFACTORY 1.0 ]
    `
  }
];

if (typeof window !== "undefined") {
  window.BLUEPRINTS_DATA = BLUEPRINTS_DATA;
}

if (typeof module !== "undefined") {
  module.exports = { BLUEPRINTS_DATA };
}

