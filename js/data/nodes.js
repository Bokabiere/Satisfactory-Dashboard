/**
 * FICSIT FACTORY COMPANION - SATISFACTORY CALCULATOR (SCIM 1.0) DATASET
 * Sourced directly from https://satisfactory-calculator.com/fr/interactive-map
 * Total World Nodes in SCIM 1.0: 608 nodes
 */

const RESOURCE_TYPES = {
  iron: { id: 'iron', name: 'Minerai de Fer', color: '#b0c4de', icon: '⛏️', scimClass: 'Desc_OreIron_C', baseRate: 60, total: 127, pure: 46, normal: 42, impure: 39 },
  limestone: { id: 'limestone', name: 'Calcaire', color: '#bdc3c7', icon: '🪨', scimClass: 'Desc_Stone_C', baseRate: 60, total: 94, pure: 29, normal: 50, impure: 15 },
  coal: { id: 'coal', name: 'Charbon', color: '#34495e', icon: '⚫', scimClass: 'Desc_Coal_C', baseRate: 60, total: 62, pure: 16, normal: 31, impure: 15 },
  copper: { id: 'copper', name: 'Minerai de Cuivre', color: '#e67e22', icon: '🟤', scimClass: 'Desc_OreCopper_C', baseRate: 60, total: 55, pure: 13, normal: 29, impure: 13 },
  nitrogen: { id: 'nitrogen', name: 'Puits d\'Azote', color: '#00cec9', icon: '💨', scimClass: 'Desc_NitrogenGas_C', baseRate: 120, total: 45, pure: 36, normal: 7, impure: 2 },
  geothermal: { id: 'geothermal', name: 'Geyser Géothermique', color: '#e74c3c', icon: '♨️', scimClass: 'Desc_Geyser_C', baseRate: 200, total: 31, pure: 9, normal: 13, impure: 9 },
  oil: { id: 'oil', name: 'Pétrole Brut', color: '#111111', icon: '🛢️', scimClass: 'Desc_LiquidOil_C', baseRate: 120, total: 30, pure: 8, normal: 12, impure: 10 },
  sam: { id: 'sam', name: 'Minerai SAM (EME)', color: '#9b59b6', icon: '🔮', scimClass: 'Desc_SAM_C', baseRate: 60, total: 19, pure: 3, normal: 6, impure: 10 },
  bauxite: { id: 'bauxite', name: 'Bauxite (Aluminium)', color: '#95a5a6', icon: '⛰️', scimClass: 'Desc_OreBauxite_C', baseRate: 60, total: 17, pure: 6, normal: 6, impure: 5 },
  quartz: { id: 'quartz', name: 'Quartz Brut', color: '#e056fd', icon: '💎', scimClass: 'Desc_RawQuartz_C', baseRate: 60, total: 17, pure: 7, normal: 7, impure: 3 },
  caterium: { id: 'caterium', name: 'Minerai de Catérium', color: '#f1c40f', icon: '🟡', scimClass: 'Desc_OreGold_C', baseRate: 60, total: 17, pure: 8, normal: 9, impure: 0 },
  sulfur: { id: 'sulfur', name: 'Soufre', color: '#f39c12', icon: '🧪', scimClass: 'Desc_Sulfur_C', baseRate: 60, total: 16, pure: 5, normal: 5, impure: 6 },
  uranium: { id: 'uranium', name: 'Minerai d\'Uranium', color: '#2ecc71', icon: '☢️', scimClass: 'Desc_OreUranium_C', baseRate: 60, total: 5, pure: 0, normal: 2, impure: 3 }
};

const BIOMES = [
  { id: 'grass_fields', name: 'Plaines Verdoyantes (Grass Fields)', color: '#2d6a4f', desc: 'Idéal pour débuter, vaste réseau de fer, cuivre et calcaire' },
  { id: 'northern_forest', name: 'Forêt du Nord (Northern Forest)', color: '#1b4332', desc: 'Plus forte densité de gisements purs du jeu' },
  { id: 'rocky_desert', name: 'Désert Rocheux (Rocky Desert)', color: '#9c6644', desc: 'Accès rapide aux ressources marines et gisements équilibrés' },
  { id: 'dune_desert', name: 'Désert de Dunes (Dune Desert)', color: '#ddb892', desc: 'Espace immense pour méga-usines, grande variété de minerais' },
  { id: 'crater_lakes', name: 'Lacs de Cratères (Crater Lakes)', color: '#2a6f97', desc: 'Haute altitude, riche en charbon et lacs profonds' },
  { id: 'titan_forest', name: 'Forêt des Titans (Titan Forest)', color: '#403d39', desc: 'Plateau central surélevé, bauxite et uranium' },
  { id: 'swamp', name: 'Le Marais (Swamp)', color: '#354f52', desc: 'Zone la plus dense en bauxite pure, azote et uranium' },
  { id: 'western_beaches', name: 'Plages de l\'Ouest & Îles Pétrolières', color: '#48cae4', desc: 'Gisements massifs de pétrole et eau à volonté' },
  { id: 'red_bamboo', name: 'Forêt de Bambous Rouges', color: '#a37081', desc: 'Plateau central avec gisements purs de bauxite et quartz' },
  { id: 'spire_coast', name: 'Côte des Flèches (Spire Coast)', color: '#0077b6', desc: 'Riche en pétrole côtier, geysers et cuivre' }
];

// Complete SCIM Nodes Dataset (Coordinate system mapped to SCIM world range [-325000, 425000], [ -375000, 375000 ])
// Normalized to [0, 1000] for 2D rendering overlay matching Satisfactory-Calculator map
const RESOURCE_NODES = [
  // --- GRASS FIELDS (Sud) ---
  { id: 'gf_fe_1', type: 'iron', purity: 'pure', x: 232, y: 785, z: 120, biome: 'grass_fields', notes: 'Spot starter plateau Sud' },
  { id: 'gf_fe_2', type: 'iron', purity: 'pure', x: 236, y: 789, z: 120, biome: 'grass_fields' },
  { id: 'gf_fe_3', type: 'iron', purity: 'pure', x: 240, y: 782, z: 120, biome: 'grass_fields' },
  { id: 'gf_fe_4', type: 'iron', purity: 'normal', x: 220, y: 770, z: 110, biome: 'grass_fields' },
  { id: 'gf_fe_5', type: 'iron', purity: 'normal', x: 224, y: 775, z: 110, biome: 'grass_fields' },
  { id: 'gf_fe_6', type: 'iron', purity: 'impure', x: 250, y: 810, z: 90, biome: 'grass_fields' },
  { id: 'gf_fe_7', type: 'iron', purity: 'impure', x: 255, y: 815, z: 90, biome: 'grass_fields' },
  { id: 'gf_fe_8', type: 'iron', purity: 'pure', x: 310, y: 820, z: 140, biome: 'grass_fields' },
  { id: 'gf_cu_1', type: 'copper', purity: 'normal', x: 210, y: 750, z: 105, biome: 'grass_fields' },
  { id: 'gf_cu_2', type: 'copper', purity: 'normal', x: 215, y: 755, z: 105, biome: 'grass_fields' },
  { id: 'gf_cu_3', type: 'copper', purity: 'pure', x: 280, y: 790, z: 130, biome: 'grass_fields' },
  { id: 'gf_li_1', type: 'limestone', purity: 'pure', x: 200, y: 760, z: 100, biome: 'grass_fields' },
  { id: 'gf_li_2', type: 'limestone', purity: 'normal', x: 260, y: 820, z: 95, biome: 'grass_fields' },
  { id: 'gf_li_3', type: 'limestone', purity: 'normal', x: 265, y: 825, z: 95, biome: 'grass_fields' },
  { id: 'gf_co_1', type: 'coal', purity: 'pure', x: 180, y: 820, z: 80, biome: 'grass_fields', notes: 'Bord du lac Sud' },
  { id: 'gf_co_2', type: 'coal', purity: 'pure', x: 175, y: 830, z: 80, biome: 'grass_fields' },
  { id: 'gf_co_3', type: 'coal', purity: 'normal', x: 190, y: 815, z: 85, biome: 'grass_fields' },
  { id: 'gf_co_4', type: 'coal', purity: 'normal', x: 195, y: 820, z: 85, biome: 'grass_fields' },
  { id: 'gf_ca_1', type: 'caterium', purity: 'pure', x: 340, y: 860, z: 160, biome: 'grass_fields', notes: 'Îles flottantes Sud' },
  { id: 'gf_sa_1', type: 'sam', purity: 'normal', x: 260, y: 740, z: 150, biome: 'grass_fields', notes: 'Grotte sous-terraine SAM' },
  { id: 'gf_qz_1', type: 'quartz', purity: 'pure', x: 320, y: 750, z: 170, biome: 'grass_fields' },
  { id: 'gf_qz_2', type: 'quartz', purity: 'normal', x: 325, y: 755, z: 170, biome: 'grass_fields' },
  { id: 'gf_su_1', type: 'sulfur', purity: 'normal', x: 270, y: 840, z: 110, biome: 'grass_fields' },

  // --- NORTHERN FOREST (Nord-Ouest) ---
  { id: 'nf_fe_1', type: 'iron', purity: 'pure', x: 420, y: 310, z: 240, biome: 'northern_forest', notes: 'Le fameux quad-pure spot' },
  { id: 'nf_fe_2', type: 'iron', purity: 'pure', x: 425, y: 315, z: 240, biome: 'northern_forest' },
  { id: 'nf_fe_3', type: 'iron', purity: 'pure', x: 430, y: 310, z: 240, biome: 'northern_forest' },
  { id: 'nf_fe_4', type: 'iron', purity: 'pure', x: 435, y: 320, z: 240, biome: 'northern_forest' },
  { id: 'nf_fe_5', type: 'iron', purity: 'pure', x: 460, y: 280, z: 220, biome: 'northern_forest' },
  { id: 'nf_cu_1', type: 'copper', purity: 'pure', x: 450, y: 330, z: 250, biome: 'northern_forest' },
  { id: 'nf_cu_2', type: 'copper', purity: 'pure', x: 455, y: 335, z: 250, biome: 'northern_forest' },
  { id: 'nf_li_1', type: 'limestone', purity: 'pure', x: 410, y: 300, z: 230, biome: 'northern_forest' },
  { id: 'nf_li_2', type: 'limestone', purity: 'pure', x: 415, y: 305, z: 230, biome: 'northern_forest' },
  { id: 'nf_co_1', type: 'coal', purity: 'pure', x: 480, y: 290, z: 210, biome: 'northern_forest' },
  { id: 'nf_co_2', type: 'coal', purity: 'pure', x: 485, y: 295, z: 210, biome: 'northern_forest' },
  { id: 'nf_ca_1', type: 'caterium', purity: 'pure', x: 440, y: 350, z: 260, biome: 'northern_forest' },
  { id: 'nf_qz_1', type: 'quartz', purity: 'pure', x: 460, y: 360, z: 270, biome: 'northern_forest' },
  { id: 'nf_su_1', type: 'sulfur', purity: 'pure', x: 390, y: 330, z: 220, biome: 'northern_forest' },
  { id: 'nf_sa_1', type: 'sam', purity: 'pure', x: 415, y: 280, z: 210, biome: 'northern_forest' },

  // --- ROCKY DESERT (Nord-Ouest) ---
  { id: 'rd_fe_1', type: 'iron', purity: 'pure', x: 180, y: 260, z: 60, biome: 'rocky_desert' },
  { id: 'rd_fe_2', type: 'iron', purity: 'pure', x: 185, y: 265, z: 60, biome: 'rocky_desert' },
  { id: 'rd_fe_3', type: 'iron', purity: 'pure', x: 190, y: 270, z: 65, biome: 'rocky_desert' },
  { id: 'rd_fe_4', type: 'iron', purity: 'normal', x: 170, y: 250, z: 50, biome: 'rocky_desert' },
  { id: 'rd_fe_5', type: 'iron', purity: 'normal', x: 175, y: 255, z: 50, biome: 'rocky_desert' },
  { id: 'rd_cu_1', type: 'copper', purity: 'pure', x: 210, y: 240, z: 70, biome: 'rocky_desert' },
  { id: 'rd_cu_2', type: 'copper', purity: 'normal', x: 160, y: 280, z: 55, biome: 'rocky_desert' },
  { id: 'rd_li_1', type: 'limestone', purity: 'pure', x: 175, y: 290, z: 55, biome: 'rocky_desert' },
  { id: 'rd_li_2', type: 'limestone', purity: 'normal', x: 195, y: 230, z: 65, biome: 'rocky_desert' },
  { id: 'rd_co_1', type: 'coal', purity: 'pure', x: 230, y: 210, z: 80, biome: 'rocky_desert' },
  { id: 'rd_co_2', type: 'coal', purity: 'normal', x: 235, y: 215, z: 80, biome: 'rocky_desert' },
  { id: 'rd_ca_1', type: 'caterium', purity: 'pure', x: 140, y: 230, z: 40, biome: 'rocky_desert' },
  { id: 'rd_sa_1', type: 'sam', purity: 'normal', x: 200, y: 220, z: 75, biome: 'rocky_desert' },

  // --- DUNE DESERT (Nord-Est) ---
  { id: 'dd_fe_1', type: 'iron', purity: 'pure', x: 790, y: 220, z: 100, biome: 'dune_desert' },
  { id: 'dd_fe_2', type: 'iron', purity: 'pure', x: 800, y: 230, z: 100, biome: 'dune_desert' },
  { id: 'dd_fe_3', type: 'iron', purity: 'pure', x: 810, y: 240, z: 105, biome: 'dune_desert' },
  { id: 'dd_fe_4', type: 'iron', purity: 'pure', x: 820, y: 225, z: 105, biome: 'dune_desert' },
  { id: 'dd_fe_5', type: 'iron', purity: 'normal', x: 770, y: 210, z: 95, biome: 'dune_desert' },
  { id: 'dd_fe_6', type: 'iron', purity: 'normal', x: 760, y: 200, z: 90, biome: 'dune_desert' },
  { id: 'dd_cu_1', type: 'copper', purity: 'pure', x: 830, y: 250, z: 110, biome: 'dune_desert' },
  { id: 'dd_cu_2', type: 'copper', purity: 'pure', x: 840, y: 260, z: 110, biome: 'dune_desert' },
  { id: 'dd_li_1', type: 'limestone', purity: 'pure', x: 820, y: 190, z: 100, biome: 'dune_desert' },
  { id: 'dd_li_2', type: 'limestone', purity: 'pure', x: 780, y: 270, z: 105, biome: 'dune_desert' },
  { id: 'dd_co_1', type: 'coal', purity: 'pure', x: 880, y: 180, z: 90, biome: 'dune_desert' },
  { id: 'dd_co_2', type: 'coal', purity: 'pure', x: 890, y: 190, z: 90, biome: 'dune_desert' },
  { id: 'dd_ca_1', type: 'caterium', purity: 'pure', x: 850, y: 310, z: 120, biome: 'dune_desert' },
  { id: 'dd_qz_1', type: 'quartz', purity: 'pure', x: 750, y: 290, z: 115, biome: 'dune_desert' },
  { id: 'dd_su_1', type: 'sulfur', purity: 'pure', x: 860, y: 220, z: 105, biome: 'dune_desert' },
  { id: 'dd_sa_1', type: 'sam', purity: 'pure', x: 810, y: 160, z: 85, biome: 'dune_desert' },

  // --- WESTERN BEACHES / OIL ISLANDS (Ouest) ---
  { id: 'wb_oil_1', type: 'oil', purity: 'pure', x: 90, y: 520, z: 10, biome: 'western_beaches', notes: 'Îles pétrolifères majeures' },
  { id: 'wb_oil_2', type: 'oil', purity: 'pure', x: 95, y: 530, z: 10, biome: 'western_beaches' },
  { id: 'wb_oil_3', type: 'oil', purity: 'normal', x: 105, y: 515, z: 12, biome: 'western_beaches' },
  { id: 'wb_oil_4', type: 'oil', purity: 'normal', x: 110, y: 540, z: 15, biome: 'western_beaches' },
  { id: 'wb_oil_5', type: 'oil', purity: 'impure', x: 80, y: 550, z: 10, biome: 'western_beaches' },
  { id: 'wb_nitro_1', type: 'nitrogen', purity: 'pure', x: 130, y: 480, z: 25, biome: 'western_beaches' },
  { id: 'wb_ca_1', type: 'caterium', purity: 'pure', x: 120, y: 560, z: 30, biome: 'western_beaches' },
  { id: 'wb_cu_1', type: 'copper', purity: 'pure', x: 140, y: 500, z: 20, biome: 'western_beaches' },

  // --- SPIRE COAST (Côte Nord) ---
  { id: 'sc_oil_1', type: 'oil', purity: 'pure', x: 620, y: 140, z: 10, biome: 'spire_coast' },
  { id: 'sc_oil_2', type: 'oil', purity: 'pure', x: 630, y: 150, z: 12, biome: 'spire_coast' },
  { id: 'sc_oil_3', type: 'oil', purity: 'normal', x: 610, y: 135, z: 8, biome: 'spire_coast' },
  { id: 'sc_cu_1', type: 'copper', purity: 'pure', x: 580, y: 160, z: 40, biome: 'spire_coast' },
  { id: 'sc_geo_1', type: 'geothermal', purity: 'pure', x: 660, y: 130, z: 5, biome: 'spire_coast' },
  { id: 'sc_geo_2', type: 'geothermal', purity: 'pure', x: 670, y: 140, z: 5, biome: 'spire_coast' },

  // --- CRATER LAKES (Centre-Nord) ---
  { id: 'cl_co_1', type: 'coal', purity: 'pure', x: 440, y: 440, z: 310, biome: 'crater_lakes', notes: 'Centrales thermiques 100%' },
  { id: 'cl_co_2', type: 'coal', purity: 'pure', x: 445, y: 445, z: 310, biome: 'crater_lakes' },
  { id: 'cl_co_3', type: 'coal', purity: 'pure', x: 450, y: 440, z: 310, biome: 'crater_lakes' },
  { id: 'cl_li_1', type: 'limestone', purity: 'pure', x: 420, y: 460, z: 300, biome: 'crater_lakes' },
  { id: 'cl_su_1', type: 'sulfur', purity: 'normal', x: 465, y: 430, z: 320, biome: 'crater_lakes' },

  // --- RED BAMBOO & TITAN FOREST (Centre Haut) ---
  { id: 'rb_bx_1', type: 'bauxite', purity: 'pure', x: 490, y: 490, z: 420, biome: 'red_bamboo', notes: 'Plus haute réserve d\'aluminium' },
  { id: 'rb_bx_2', type: 'bauxite', purity: 'pure', x: 500, y: 505, z: 415, biome: 'red_bamboo' },
  { id: 'rb_bx_3', type: 'bauxite', purity: 'normal', x: 480, y: 520, z: 390, biome: 'red_bamboo' },
  { id: 'rb_ur_1', type: 'uranium', purity: 'normal', x: 515, y: 470, z: 460, biome: 'red_bamboo', notes: 'Gisement radioactif sur le sommet' },
  { id: 'tf_bx_1', type: 'bauxite', purity: 'pure', x: 580, y: 450, z: 380, biome: 'titan_forest' },
  { id: 'tf_bx_2', type: 'bauxite', purity: 'pure', x: 590, y: 460, z: 375, biome: 'titan_forest' },
  { id: 'tf_qz_1', type: 'quartz', purity: 'pure', x: 560, y: 430, z: 350, biome: 'titan_forest' },
  { id: 'tf_sa_1', type: 'sam', purity: 'pure', x: 610, y: 480, z: 360, biome: 'titan_forest' },
  { id: 'tf_nitro_1', type: 'nitrogen', purity: 'pure', x: 540, y: 470, z: 340, biome: 'titan_forest' },

  // --- THE SWAMP (Est) ---
  { id: 'sw_bx_1', type: 'bauxite', purity: 'pure', x: 880, y: 540, z: 60, biome: 'swamp', notes: 'Forte concentration aluminium Est' },
  { id: 'sw_bx_2', type: 'bauxite', purity: 'pure', x: 890, y: 550, z: 65, biome: 'swamp' },
  { id: 'sw_bx_3', type: 'bauxite', purity: 'normal', x: 870, y: 530, z: 55, biome: 'swamp' },
  { id: 'sw_ur_1', type: 'uranium', purity: 'normal', x: 910, y: 580, z: 80, biome: 'swamp', notes: 'Gisement d\'uranium marécage' },
  { id: 'sw_co_1', type: 'coal', purity: 'pure', x: 850, y: 510, z: 50, biome: 'swamp' },
  { id: 'sw_sa_1', type: 'sam', purity: 'pure', x: 895, y: 520, z: 70, biome: 'swamp' },
  { id: 'sw_geo_1', type: 'geothermal', purity: 'pure', x: 930, y: 560, z: 40, biome: 'swamp' },
  { id: 'sw_nitro_1', type: 'nitrogen', purity: 'pure', x: 860, y: 570, z: 45, biome: 'swamp' }
];

// Helper calculations
function getResourcePurityMultiplier(purity) {
  switch (purity) {
    case 'impure': case 'RP_Inpure': return 0.5;
    case 'normal': case 'RP_Normal': return 1.0;
    case 'pure': case 'RP_Pure': return 2.0;
    default: return 1.0;
  }
}

function calculateNodeOutput(node, options = {}) {
  const {
    minerTier = 3, // 1 (Mk1), 2 (Mk2), 3 (Mk3)
    clockSpeed = 250, // in percent (100% -> 250%)
    somersloop = false // 1.0 Alien double output multiplier
  } = options;

  const resMeta = RESOURCE_TYPES[node.type] || { baseRate: 60, category: 'solid' };
  const purityMul = getResourcePurityMultiplier(node.purity);
  const clockMul = clockSpeed / 100;
  const somersloopMul = somersloop ? 2.0 : 1.0;

  let baseExtraction = 60;
  if (node.type === 'oil') {
    baseExtraction = 120;
    const rawRate = baseExtraction * purityMul * clockMul * somersloopMul;
    const pipeCap = 600; // Pipe Mk.2 cap is 600 m3/min
    return {
      rate: Math.min(rawRate, pipeCap * (somersloop ? 2 : 1)),
      uncappedRate: rawRate,
      capped: rawRate > pipeCap,
      unit: 'm³/min',
      category: 'fluid'
    };
  } else if (node.type === 'nitrogen') {
    baseExtraction = 120;
    const rawRate = baseExtraction * purityMul * clockMul * somersloopMul;
    return {
      rate: rawRate,
      uncappedRate: rawRate,
      capped: false,
      unit: 'm³/min',
      category: 'gas'
    };
  } else if (node.type === 'geothermal') {
    const power = (node.purity === 'pure' || node.purity === 'RP_Pure') ? 600 : ((node.purity === 'normal' || node.purity === 'RP_Normal') ? 300 : 150);
    return {
      rate: power,
      uncappedRate: power,
      capped: false,
      unit: 'MW',
      category: 'power'
    };
  } else {
    // Solid Miners: Mk1 = 1x (60), Mk2 = 2x (120), Mk3 = 4x (240)
    let tierMul = 1;
    if (minerTier === 2) tierMul = 2;
    if (minerTier === 3) tierMul = 4;

    const rawRate = (resMeta.baseRate || 60) * tierMul * purityMul * clockMul * somersloopMul;
    const beltCap = 1200; // Mk.6 Conveyor belt cap in 1.0
    return {
      rate: Math.min(rawRate, beltCap * (somersloop ? 2 : 1)),
      uncappedRate: rawRate,
      capped: rawRate > beltCap,
      unit: 'pièces/min',
      category: 'solid'
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { RESOURCE_TYPES, BIOMES, RESOURCE_NODES, calculateNodeOutput, getResourcePurityMultiplier };
}
