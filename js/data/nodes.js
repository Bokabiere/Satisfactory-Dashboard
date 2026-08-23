/**
 * FICSIT FACTORY COMPANION - SATISFACTORY CALCULATOR (SCIM 1.2) DATASET
 * Sourced directly from https://satisfactory-calculator.com/fr/interactive-map
 * Total World Nodes in SCIM 1.2: 608 nodes
 */

const RESOURCE_TYPES = {
  'somersloop': { id: 'somersloop', name: 'Somersloop', color: '#ff4757', icon: '🎀', scimClass: 'Desc_Somersloop_C', total: 106 },
  'mercer_sphere': { id: 'mercer_sphere', name: 'Sph�re de Mercer', color: '#e84118', icon: '??', scimClass: 'Desc_MercerSphere_C', total: 298 },
  'crash_site': { id: 'crash_site', name: '�Épave (Disque Dur)', color: '#353b48', icon: '??', scimClass: 'Desc_CrashSite_C', total: 118 },
  'slug_green': { id: 'slug_green', name: '�Électrolimace Verte', color: '#2ecc71', icon: '??', scimClass: 'Desc_CrystalShard_C', total: 400 },
  'slug_yellow': { id: 'slug_yellow', name: '�Électrolimace Jaune', color: '#f1c40f', icon: '??', scimClass: 'Desc_CrystalShard_C', total: 200 },
  'slug_purple': { id: 'slug_purple', name: '�Électrolimace Violette', color: '#9b59b6', icon: '??', scimClass: 'Desc_CrystalShard_C', total: 100 },
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
  { id: 'northern_forest', name: 'Forêt du Nord (Northern Forest)', color: '#1b4332', desc: 'Plus forte densitéé de gisements purs du jeu' },
  { id: 'rocky_desert', name: 'Désert Rocheux (Rocky Desert)', color: '#9c6644', desc: 'Accès rapide aux ressources marines et gisements équilibrés' },
  { id: 'dune_desert', name: 'Désert de Dunes (Dune Desert)', color: '#ddb892', desc: 'Espace immense pour méga-usines, grande variété de minerais' },
  { id: 'crater_lakes', name: 'Lacs de Cratères (Crater Lakes)', color: '#2a6f97', desc: 'Haute altitude, riche en charbon et lacs profonds' },
  { id: 'titan_forest', name: 'Forêt des Titans (Titan Forest)', color: '#403d39', desc: 'Plateau central surélevé, bauxite et uranium' },
  { id: 'swamp', name: 'Le Marais (Swamp)', color: '#354f52', desc: 'Zone la plus dense en bauxite pure, azote et uranium' },
  { id: 'western_beaches', name: 'Plages de l\'Ouest & Îles Pétrolières', color: '#48cae4', desc: 'Gisements massifs de pétrole et eau à volontéé' },
  { id: 'red_bamboo', name: 'Forêt de Bambous Rouges', color: '#a37081', desc: 'Plateau central avec gisements purs de bauxite et quartz' },
  { id: 'spire_coast', name: 'Côte des Flèches (Spire Coast)', color: '#0077b6', desc: 'Riche en pétrole côtier, geysers et cuivre' }
];

// Complete SCIM Nodes Dataset (Coordinate system mapped to SCIM world range [-325000, 425000], [ -375000, 375000 ])
// Normalized to [0, 1000] for 2D rendering overlay matching Satisfactory-Calculator map
const RESOURCE_NODES = [
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode555",
    "type": "limestone",
    "purity": "impure",
    "x": 1745.99,
    "y": 4013.9,
    "z": -3279.111328125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode556",
    "type": "limestone",
    "purity": "impure",
    "x": 1426.2,
    "y": 4158.16,
    "z": -5349.6840820312,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode193",
    "type": "limestone",
    "purity": "impure",
    "x": 4715.48,
    "y": 1880.52,
    "z": 207.13555908203,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode224",
    "type": "limestone",
    "purity": "impure",
    "x": 4561.13,
    "y": 1162.37,
    "z": 4110,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode464_UAID_40B076DF2F790EE201_1850696287",
    "type": "limestone",
    "purity": "impure",
    "x": 2264.32,
    "y": 1441.13,
    "z": -1397.1209716797,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode464_UAID_40B076DF2F7914E201_2026233335",
    "type": "limestone",
    "purity": "impure",
    "x": 2779.16,
    "y": 1613.01,
    "z": 700.67614746094,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode557",
    "type": "limestone",
    "purity": "impure",
    "x": 1533.12,
    "y": 4015.23,
    "z": -2399.3713378906,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode534",
    "type": "limestone",
    "purity": "impure",
    "x": 1789.87,
    "y": 4303.52,
    "z": -3776.6999511719,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode181",
    "type": "limestone",
    "purity": "impure",
    "x": 3744.55,
    "y": 1398.82,
    "z": 2636.0129394531,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode589_UAID_40B076DF2F79B1E101_1767545917",
    "type": "limestone",
    "purity": "impure",
    "x": 3062.47,
    "y": 3316.06,
    "z": 12311.319335938,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode182",
    "type": "limestone",
    "purity": "impure",
    "x": 3792.78,
    "y": 1226.03,
    "z": 1832.5977783203,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode191",
    "type": "limestone",
    "purity": "impure",
    "x": 4156.19,
    "y": 1927.35,
    "z": 5936,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode586",
    "type": "limestone",
    "purity": "impure",
    "x": 1874.04,
    "y": 4090.5,
    "z": -3810.8610839844,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode226",
    "type": "limestone",
    "purity": "impure",
    "x": 4420.35,
    "y": 1127.44,
    "z": 4225,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode553",
    "type": "limestone",
    "purity": "impure",
    "x": 1887.51,
    "y": 4416.6,
    "z": -2545.5698242188,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode465",
    "type": "limestone",
    "purity": "normal",
    "x": 2971.28,
    "y": 1908.83,
    "z": 13669.116210938,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode549",
    "type": "limestone",
    "purity": "normal",
    "x": 2190.26,
    "y": 4314.68,
    "z": -4107.9633789062,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode59_755",
    "type": "limestone",
    "purity": "normal",
    "x": 2301.21,
    "y": 1598.23,
    "z": 16881.8359375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode124_5785",
    "type": "limestone",
    "purity": "normal",
    "x": 1559.91,
    "y": 1483.05,
    "z": -1700.3139648438,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode464_UAID_40B076DF2F790FE201_1577140465",
    "type": "limestone",
    "purity": "normal",
    "x": 2607.64,
    "y": 1493.71,
    "z": -1180.9619140625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode187_0",
    "type": "limestone",
    "purity": "normal",
    "x": 3664.93,
    "y": 918.9,
    "z": 1043.2283935547,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode158",
    "type": "limestone",
    "purity": "normal",
    "x": 1302.95,
    "y": 2233.26,
    "z": 2898.1501464844,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode443",
    "type": "limestone",
    "purity": "normal",
    "x": 2119.77,
    "y": 1694.63,
    "z": 10380.249023438,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode97_1",
    "type": "limestone",
    "purity": "normal",
    "x": 3801.24,
    "y": 1039.49,
    "z": 1311.5662841797,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode550",
    "type": "limestone",
    "purity": "normal",
    "x": 2269.99,
    "y": 4254.2,
    "z": -3824.1799316406,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode157",
    "type": "limestone",
    "purity": "normal",
    "x": 371.47,
    "y": 1970.05,
    "z": -292.37127685547,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode41_1099",
    "type": "limestone",
    "purity": "normal",
    "x": 2878.28,
    "y": 2208.65,
    "z": 14774.432617188,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode189",
    "type": "limestone",
    "purity": "normal",
    "x": 4219.7,
    "y": 1826.56,
    "z": 6378.2045898438,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode139_909",
    "type": "limestone",
    "purity": "normal",
    "x": 3217.8,
    "y": 2063.83,
    "z": 2591.2600097656,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode104",
    "type": "limestone",
    "purity": "normal",
    "x": 341.26,
    "y": 2365.52,
    "z": -1537.0546875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode509",
    "type": "limestone",
    "purity": "normal",
    "x": 1442.21,
    "y": 4233.61,
    "z": -4801.6577148438,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode133_6963",
    "type": "limestone",
    "purity": "normal",
    "x": 2895.75,
    "y": 3805.72,
    "z": -3246.7119140625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode441",
    "type": "limestone",
    "purity": "normal",
    "x": 2615.11,
    "y": 1859.04,
    "z": 9362.0341796875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode186",
    "type": "limestone",
    "purity": "normal",
    "x": 4134.69,
    "y": 680.53,
    "z": 1237.4617919922,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode178",
    "type": "limestone",
    "purity": "normal",
    "x": 3403.41,
    "y": 3009.25,
    "z": 1138.1640625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode554",
    "type": "limestone",
    "purity": "normal",
    "x": 1915.22,
    "y": 3837.53,
    "z": -3056.4609375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode132_5908",
    "type": "limestone",
    "purity": "normal",
    "x": 1008.17,
    "y": 1749.94,
    "z": 31.635986328125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode145_1749",
    "type": "limestone",
    "purity": "normal",
    "x": 863.84,
    "y": 2324.84,
    "z": -627.99206542969,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode584",
    "type": "limestone",
    "purity": "normal",
    "x": 2104.76,
    "y": 4382.54,
    "z": -1137.0134277344,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode144_1644",
    "type": "limestone",
    "purity": "normal",
    "x": 620.7,
    "y": 1900.61,
    "z": 823.98370361328,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode521_UAID_40B076DF2F79C3E101_1735462083",
    "type": "limestone",
    "purity": "normal",
    "x": 1048.47,
    "y": 2904.3,
    "z": 24000.763671875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode102_2068",
    "type": "limestone",
    "purity": "normal",
    "x": 291.17,
    "y": 2216.31,
    "z": -1276.1479492188,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode439_1",
    "type": "limestone",
    "purity": "normal",
    "x": 2693.7,
    "y": 1991.63,
    "z": 12028.005859375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode138_590",
    "type": "limestone",
    "purity": "normal",
    "x": 3335.54,
    "y": 2229.17,
    "z": 6611.685546875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode103",
    "type": "limestone",
    "purity": "normal",
    "x": 383.04,
    "y": 2334.11,
    "z": -723.64849853516,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode77",
    "type": "limestone",
    "purity": "normal",
    "x": 3671.01,
    "y": 1160.82,
    "z": 1079.3498535156,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode511",
    "type": "limestone",
    "purity": "normal",
    "x": 1812.29,
    "y": 4257.48,
    "z": -3819.6577148438,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode42_1294",
    "type": "limestone",
    "purity": "normal",
    "x": 2588.09,
    "y": 2552.13,
    "z": 14012.659179688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode96_886",
    "type": "limestone",
    "purity": "normal",
    "x": 3106.2,
    "y": 4032.96,
    "z": -5835.1923828125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode464_UAID_40B076DF2F7915E201_1334543513",
    "type": "limestone",
    "purity": "normal",
    "x": 2431,
    "y": 1533.55,
    "z": 369.07440185547,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode589",
    "type": "limestone",
    "purity": "normal",
    "x": 2218.34,
    "y": 3478.41,
    "z": -9599.8828125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode67_2193",
    "type": "limestone",
    "purity": "normal",
    "x": 3967.26,
    "y": 2809.39,
    "z": -1613.8238525391,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode548",
    "type": "limestone",
    "purity": "normal",
    "x": 2189.39,
    "y": 4300.56,
    "z": -4107.9633789062,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode60_984",
    "type": "limestone",
    "purity": "normal",
    "x": 2663.34,
    "y": 1677.86,
    "z": 13630.326171875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode466",
    "type": "limestone",
    "purity": "normal",
    "x": 3285.66,
    "y": 1777.51,
    "z": 1587.0561523438,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode143_1543",
    "type": "limestone",
    "purity": "normal",
    "x": 1299.06,
    "y": 1851.2,
    "z": 4129.6215820312,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode512",
    "type": "limestone",
    "purity": "normal",
    "x": 1569.32,
    "y": 3516.43,
    "z": -3019.6936035156,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode228",
    "type": "limestone",
    "purity": "normal",
    "x": 4633.29,
    "y": 1019.28,
    "z": 4225,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode118_4340",
    "type": "limestone",
    "purity": "normal",
    "x": 1273.43,
    "y": 2261.88,
    "z": 3832.0007324219,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode46_2284",
    "type": "limestone",
    "purity": "normal",
    "x": 4452.06,
    "y": 1940.94,
    "z": 5618,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode119",
    "type": "limestone",
    "purity": "normal",
    "x": 1191.22,
    "y": 2283.65,
    "z": 3281.0756835938,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode521_UAID_40B076DF2F79C3E101_1100698081",
    "type": "limestone",
    "purity": "normal",
    "x": 1067.27,
    "y": 2927.87,
    "z": 24379.79296875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode442",
    "type": "limestone",
    "purity": "normal",
    "x": 2566.56,
    "y": 1978.07,
    "z": 9437.1376953125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode229",
    "type": "limestone",
    "purity": "normal",
    "x": 4734.86,
    "y": 803.72,
    "z": 3420.0153808594,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode37_178",
    "type": "limestone",
    "purity": "normal",
    "x": 3343.65,
    "y": 1920.66,
    "z": 2459.1350097656,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode589_UAID_40B076DF2F79B2E101_1298360096",
    "type": "limestone",
    "purity": "pure",
    "x": 3141.48,
    "y": 3262.08,
    "z": 12296.141601562,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode85",
    "type": "limestone",
    "purity": "pure",
    "x": 1155.43,
    "y": 3723.35,
    "z": 998.07000732422,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode166",
    "type": "limestone",
    "purity": "pure",
    "x": 788.75,
    "y": 1553.52,
    "z": 4859.95703125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode464",
    "type": "limestone",
    "purity": "pure",
    "x": 2497.7,
    "y": 1450.62,
    "z": -144.06066894531,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode227",
    "type": "limestone",
    "purity": "pure",
    "x": 4487.98,
    "y": 1409.37,
    "z": 4238.0327148438,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode54_833",
    "type": "limestone",
    "purity": "pure",
    "x": 1883.88,
    "y": 1482.16,
    "z": 9227.1572265625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode516",
    "type": "limestone",
    "purity": "pure",
    "x": 3272.04,
    "y": 2548.32,
    "z": 15934.047851562,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode110",
    "type": "limestone",
    "purity": "pure",
    "x": 975.84,
    "y": 1396.79,
    "z": 7616.8671875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode225",
    "type": "limestone",
    "purity": "pure",
    "x": 4769.28,
    "y": 1107.58,
    "z": 4998.1596679688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode165",
    "type": "limestone",
    "purity": "pure",
    "x": 285.01,
    "y": 1600,
    "z": 1998.0148925781,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode575",
    "type": "limestone",
    "purity": "pure",
    "x": 1629.01,
    "y": 3858.88,
    "z": 1544.5307617188,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode93_5",
    "type": "limestone",
    "purity": "pure",
    "x": 3628.24,
    "y": 2777.33,
    "z": -1597.6604003906,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode564",
    "type": "limestone",
    "purity": "pure",
    "x": 4061.98,
    "y": 3240.99,
    "z": -1605.71484375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode508",
    "type": "limestone",
    "purity": "pure",
    "x": 2963.03,
    "y": 2430.13,
    "z": 10448.190429688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode20_3137",
    "type": "limestone",
    "purity": "pure",
    "x": 294.71,
    "y": 1289.51,
    "z": 338.1083984375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode113",
    "type": "limestone",
    "purity": "pure",
    "x": 1063.13,
    "y": 1609.49,
    "z": 1610.91015625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode561",
    "type": "limestone",
    "purity": "pure",
    "x": 1794.29,
    "y": 3354.84,
    "z": 8671.7841796875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode190",
    "type": "limestone",
    "purity": "pure",
    "x": 4239.5,
    "y": 2031.83,
    "z": 5620.265625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode84",
    "type": "limestone",
    "purity": "pure",
    "x": 1118.26,
    "y": 3841.66,
    "z": 961.45812988281,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode20_UAID_04D9F5D42711A7C902_1245462149",
    "type": "limestone",
    "purity": "pure",
    "x": 304.04,
    "y": 1256.24,
    "z": 338.1083984375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode69_UAID_A036BCACDEB0A7A601_1261875850",
    "type": "limestone",
    "purity": "pure",
    "x": 3665.09,
    "y": 2450.15,
    "z": -1549.8608398438,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode571",
    "type": "limestone",
    "purity": "pure",
    "x": 1805.44,
    "y": 3563.61,
    "z": 3355.8898925781,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode521",
    "type": "limestone",
    "purity": "pure",
    "x": 1443.91,
    "y": 2896.93,
    "z": 2653.3466796875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode62",
    "type": "limestone",
    "purity": "pure",
    "x": 647.75,
    "y": 1443.13,
    "z": 8947.6650390625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode234",
    "type": "limestone",
    "purity": "pure",
    "x": 4529.35,
    "y": 1678.09,
    "z": 5003.63671875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode164",
    "type": "limestone",
    "purity": "pure",
    "x": 420.06,
    "y": 1721.19,
    "z": 4302.5883789062,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode463",
    "type": "limestone",
    "purity": "pure",
    "x": 1792.51,
    "y": 1635.26,
    "z": 6951.5869140625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode163",
    "type": "limestone",
    "purity": "pure",
    "x": 685.3,
    "y": 1799.42,
    "z": 4105.7001953125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode440",
    "type": "limestone",
    "purity": "pure",
    "x": 2626.27,
    "y": 1828.49,
    "z": 9391.8876953125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode13",
    "type": "iron",
    "purity": "impure",
    "x": 3780.12,
    "y": 1501.99,
    "z": 2590.6520996094,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode577",
    "type": "iron",
    "purity": "impure",
    "x": 1791.59,
    "y": 3789.83,
    "z": -2557.0275878906,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode578",
    "type": "iron",
    "purity": "impure",
    "x": 1781.81,
    "y": 3779.2,
    "z": -2513.3725585938,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode542",
    "type": "iron",
    "purity": "impure",
    "x": 1886.28,
    "y": 3333.48,
    "z": 8644.9326171875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode49",
    "type": "iron",
    "purity": "impure",
    "x": 3932.13,
    "y": 1310.52,
    "z": 3456.9108886719,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode462_UAID_40B076DF2F7907E201_1624182051",
    "type": "iron",
    "purity": "impure",
    "x": 1729.82,
    "y": 1157.71,
    "z": 6925.3540039062,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode592",
    "type": "iron",
    "purity": "impure",
    "x": 1828.86,
    "y": 4389.45,
    "z": -2614.7639160156,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode488",
    "type": "iron",
    "purity": "impure",
    "x": 1530.27,
    "y": 4244.38,
    "z": -4620.1567382812,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode569",
    "type": "iron",
    "purity": "impure",
    "x": 1874.01,
    "y": 3363.17,
    "z": 8662.2705078125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode173",
    "type": "iron",
    "purity": "impure",
    "x": 3923.73,
    "y": 1412.38,
    "z": 3331.6552734375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode221",
    "type": "iron",
    "purity": "impure",
    "x": 4240.67,
    "y": 1063.39,
    "z": 2436.8999023438,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode563_UAID_40B076DF2F79B9E101_1570060334",
    "type": "iron",
    "purity": "impure",
    "x": 3718.42,
    "y": 3465.31,
    "z": -267.43524169922,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode580",
    "type": "iron",
    "purity": "impure",
    "x": 1751.18,
    "y": 3791.58,
    "z": -2042.0100097656,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode541",
    "type": "iron",
    "purity": "impure",
    "x": 1907.84,
    "y": 3348,
    "z": 8811.4970703125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode494",
    "type": "iron",
    "purity": "impure",
    "x": 1919.51,
    "y": 4119.38,
    "z": -2502.6240234375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode532",
    "type": "iron",
    "purity": "impure",
    "x": 1536.26,
    "y": 4280.57,
    "z": -3127.7263183594,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode535",
    "type": "iron",
    "purity": "impure",
    "x": 1729.24,
    "y": 3411.14,
    "z": 8488.220703125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode491",
    "type": "iron",
    "purity": "impure",
    "x": 1554.51,
    "y": 4180.49,
    "z": -4513.923828125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode563_UAID_40B076DF2F79BBE101_1434258671",
    "type": "iron",
    "purity": "impure",
    "x": 3717.48,
    "y": 3427.22,
    "z": -304.43524169922,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode530",
    "type": "iron",
    "purity": "impure",
    "x": 1499.07,
    "y": 4278.54,
    "z": -4660.7299804688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode539",
    "type": "iron",
    "purity": "impure",
    "x": 1869.92,
    "y": 3880.48,
    "z": -2228.2329101562,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode12_91",
    "type": "iron",
    "purity": "impure",
    "x": 3818.7,
    "y": 1523.77,
    "z": 3561.8935546875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode200",
    "type": "iron",
    "purity": "impure",
    "x": 4055.2,
    "y": 1687.21,
    "z": 4452.267578125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode462_UAID_40B076DF2F790CE201_2008279933",
    "type": "iron",
    "purity": "impure",
    "x": 1810.36,
    "y": 1153.77,
    "z": 6792.5341796875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode536",
    "type": "iron",
    "purity": "impure",
    "x": 1881.03,
    "y": 3375.79,
    "z": 8668.765625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode489",
    "type": "iron",
    "purity": "impure",
    "x": 1515.12,
    "y": 4254.72,
    "z": -4625.6518554688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode531",
    "type": "iron",
    "purity": "impure",
    "x": 1541.19,
    "y": 4187.61,
    "z": -4509.763671875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode533",
    "type": "iron",
    "purity": "impure",
    "x": 1547.15,
    "y": 4267.03,
    "z": -3125.0441894531,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode490",
    "type": "iron",
    "purity": "impure",
    "x": 1505.79,
    "y": 4265.16,
    "z": -4634.9521484375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode184",
    "type": "iron",
    "purity": "impure",
    "x": 4236.88,
    "y": 1639.92,
    "z": 4669.4892578125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode579",
    "type": "iron",
    "purity": "impure",
    "x": 1770.09,
    "y": 3799.96,
    "z": -2195.5678710938,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode538",
    "type": "iron",
    "purity": "impure",
    "x": 1883.33,
    "y": 3873.26,
    "z": -2228.2329101562,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode563_UAID_40B076DF2F79B7E101_1869159978",
    "type": "iron",
    "purity": "impure",
    "x": 3666.55,
    "y": 3478.91,
    "z": -193.43524169922,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode222",
    "type": "iron",
    "purity": "impure",
    "x": 4259.33,
    "y": 1186.96,
    "z": 3905.6872558594,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode204_0",
    "type": "iron",
    "purity": "impure",
    "x": 4364.85,
    "y": 1548.79,
    "z": 3965.8974609375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode495",
    "type": "iron",
    "purity": "impure",
    "x": 1929.23,
    "y": 4132.1,
    "z": -2504.1110839844,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode563_UAID_40B076DF2F79B8E101_1620414156",
    "type": "iron",
    "purity": "impure",
    "x": 3638.76,
    "y": 3471.9,
    "z": -200.09094238281,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode591",
    "type": "iron",
    "purity": "impure",
    "x": 1845.97,
    "y": 4423.58,
    "z": -2526.4792480469,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode537",
    "type": "iron",
    "purity": "impure",
    "x": 1759.87,
    "y": 3439.3,
    "z": 8416.7841796875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode105_2463",
    "type": "iron",
    "purity": "normal",
    "x": 404.22,
    "y": 2291.11,
    "z": -411.67340087891,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode233",
    "type": "iron",
    "purity": "normal",
    "x": 4661.03,
    "y": 766.86,
    "z": 3231.7561035156,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode199",
    "type": "iron",
    "purity": "normal",
    "x": 3941.32,
    "y": 1693.09,
    "z": 4084.0034179688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode148",
    "type": "iron",
    "purity": "normal",
    "x": 2787.4,
    "y": 3562.87,
    "z": 2111.1162109375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode36",
    "type": "iron",
    "purity": "normal",
    "x": 3769.45,
    "y": 900.72,
    "z": 1048.3444824219,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode551",
    "type": "iron",
    "purity": "normal",
    "x": 1802.2,
    "y": 4023.05,
    "z": -3845.7517089844,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode205",
    "type": "iron",
    "purity": "normal",
    "x": 4248.74,
    "y": 1605.74,
    "z": 4861.5473632812,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode147",
    "type": "iron",
    "purity": "normal",
    "x": 2804.7,
    "y": 3559.53,
    "z": 2102.8388671875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode66",
    "type": "iron",
    "purity": "normal",
    "x": 3800.17,
    "y": 2696.46,
    "z": -847.2978515625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode223",
    "type": "iron",
    "purity": "normal",
    "x": 4006.59,
    "y": 1198.1,
    "z": 2898.7397460938,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode35",
    "type": "iron",
    "purity": "normal",
    "x": 3872.89,
    "y": 1178.94,
    "z": 3561.4650878906,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode128_5242",
    "type": "iron",
    "purity": "normal",
    "x": 891.29,
    "y": 1713.22,
    "z": 706,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode168",
    "type": "iron",
    "purity": "normal",
    "x": 910.31,
    "y": 1733.62,
    "z": 706,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode558",
    "type": "iron",
    "purity": "normal",
    "x": 2102.79,
    "y": 4449.57,
    "z": -2527.2478027344,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode208",
    "type": "iron",
    "purity": "normal",
    "x": 4416.67,
    "y": 1314.79,
    "z": 4959.2177734375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode236",
    "type": "iron",
    "purity": "normal",
    "x": 4680.11,
    "y": 804.65,
    "z": 3347.1306152344,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode496",
    "type": "iron",
    "purity": "normal",
    "x": 1835.69,
    "y": 4038.29,
    "z": -3845.7517089844,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode108",
    "type": "iron",
    "purity": "normal",
    "x": 435.89,
    "y": 2199.01,
    "z": -494.14990234375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode218",
    "type": "iron",
    "purity": "normal",
    "x": 4153.6,
    "y": 1170.2,
    "z": 2709.4597167969,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode546",
    "type": "iron",
    "purity": "normal",
    "x": 1826.83,
    "y": 4511.84,
    "z": -2583.3332519531,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode149",
    "type": "iron",
    "purity": "normal",
    "x": 2780.7,
    "y": 3583.11,
    "z": 1881.9614257812,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode167",
    "type": "iron",
    "purity": "normal",
    "x": 917.18,
    "y": 1708.9,
    "z": 706,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode230",
    "type": "iron",
    "purity": "normal",
    "x": 4029.67,
    "y": 758.92,
    "z": 1859.7014160156,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode544",
    "type": "iron",
    "purity": "normal",
    "x": 2155.25,
    "y": 4394.93,
    "z": -1139.7622070312,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode153",
    "type": "iron",
    "purity": "normal",
    "x": 440.48,
    "y": 2226.48,
    "z": -327,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode545",
    "type": "iron",
    "purity": "normal",
    "x": 1863.38,
    "y": 4507.87,
    "z": -2543.1181640625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode106",
    "type": "iron",
    "purity": "normal",
    "x": 429.3,
    "y": 2312.24,
    "z": -640.12866210938,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode73_6071",
    "type": "iron",
    "purity": "normal",
    "x": 3050.94,
    "y": 3813.03,
    "z": -7378.8447265625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode74",
    "type": "iron",
    "purity": "normal",
    "x": 3042.22,
    "y": 3792.21,
    "z": -7424.6928710938,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode198",
    "type": "iron",
    "purity": "normal",
    "x": 3952.28,
    "y": 1718.19,
    "z": 4206.8032226562,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode206",
    "type": "iron",
    "purity": "normal",
    "x": 4423.95,
    "y": 1276.26,
    "z": 4477.0478515625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode462_UAID_40B076DF2F7902E201_1630060169",
    "type": "iron",
    "purity": "normal",
    "x": 1769.59,
    "y": 1001.96,
    "z": 9573.6044921875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode497_1",
    "type": "iron",
    "purity": "normal",
    "x": 1818.57,
    "y": 4022.88,
    "z": -3845.7517089844,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode528",
    "type": "iron",
    "purity": "normal",
    "x": 3716.48,
    "y": 2320.44,
    "z": 8976.265625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode543",
    "type": "iron",
    "purity": "normal",
    "x": 2166.56,
    "y": 4384.95,
    "z": -1139.7622070312,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode90_482",
    "type": "iron",
    "purity": "normal",
    "x": 3847.16,
    "y": 2690.3,
    "z": -798.65893554688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode146",
    "type": "iron",
    "purity": "normal",
    "x": 2808.91,
    "y": 3542.23,
    "z": 2110.3044433594,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode524_UAID_40B076DF2F798ADF01_1172524943",
    "type": "iron",
    "purity": "normal",
    "x": 3747.02,
    "y": 2343.3,
    "z": 8796.6357421875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode109",
    "type": "iron",
    "purity": "normal",
    "x": 420.98,
    "y": 2222.04,
    "z": -327,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode107",
    "type": "iron",
    "purity": "normal",
    "x": 455.06,
    "y": 2299.66,
    "z": -668.00988769531,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode523_UAID_40B076DF2F7987DF01_1117795413",
    "type": "iron",
    "purity": "normal",
    "x": 3795.79,
    "y": 2347.87,
    "z": 8820.6298828125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode585",
    "type": "iron",
    "purity": "normal",
    "x": 2094.55,
    "y": 4433.08,
    "z": -2475.6525878906,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode517",
    "type": "iron",
    "purity": "pure",
    "x": 2995.34,
    "y": 2531.17,
    "z": 15573.579101562,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode207",
    "type": "iron",
    "purity": "pure",
    "x": 3986.97,
    "y": 1510.37,
    "z": 4082.7124023438,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode95_579",
    "type": "iron",
    "purity": "pure",
    "x": 3259.15,
    "y": 4082.28,
    "z": -8588.59765625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode175",
    "type": "iron",
    "purity": "pure",
    "x": 624.28,
    "y": 1730.29,
    "z": 3917.6010742188,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode76",
    "type": "iron",
    "purity": "pure",
    "x": 3053.35,
    "y": 3865.83,
    "z": -7424.3212890625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode196",
    "type": "iron",
    "purity": "pure",
    "x": 3863.81,
    "y": 1886.44,
    "z": 5523.857421875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode65_1865",
    "type": "iron",
    "purity": "pure",
    "x": 3624.86,
    "y": 2743.86,
    "z": -1292.1663818359,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode430",
    "type": "iron",
    "purity": "pure",
    "x": 2556.7,
    "y": 2020.58,
    "z": 10568.01953125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode39",
    "type": "iron",
    "purity": "pure",
    "x": 3373.81,
    "y": 1722.6,
    "z": 2150.03125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode454",
    "type": "iron",
    "purity": "pure",
    "x": 1873.64,
    "y": 1585.92,
    "z": 8046.3544921875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode116",
    "type": "iron",
    "purity": "pure",
    "x": 1026.84,
    "y": 2307.93,
    "z": -596.00744628906,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode180",
    "type": "iron",
    "purity": "pure",
    "x": 4067.81,
    "y": 1646.84,
    "z": 3875.8503417969,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode55_1215",
    "type": "iron",
    "purity": "pure",
    "x": 1848.96,
    "y": 1557.74,
    "z": 8074.4296875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode114",
    "type": "iron",
    "purity": "pure",
    "x": 1146.51,
    "y": 2191.7,
    "z": 692.62347412109,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode82",
    "type": "iron",
    "purity": "pure",
    "x": 1078.31,
    "y": 3710.52,
    "z": 712.97607421875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode217",
    "type": "iron",
    "purity": "pure",
    "x": 4017.2,
    "y": 1093.81,
    "z": 3221.9482421875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode126_6409",
    "type": "iron",
    "purity": "pure",
    "x": 1522.31,
    "y": 3586.08,
    "z": -3734.4926757812,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode161",
    "type": "iron",
    "purity": "pure",
    "x": 483.13,
    "y": 1664.57,
    "z": 3847.6010742188,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode174",
    "type": "iron",
    "purity": "pure",
    "x": 647.22,
    "y": 1705.42,
    "z": 3931.6010742188,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode201",
    "type": "iron",
    "purity": "pure",
    "x": 4476.78,
    "y": 2107.16,
    "z": -748.96417236328,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode435_26",
    "type": "iron",
    "purity": "pure",
    "x": 2723.88,
    "y": 1921.48,
    "z": 9766.52734375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode583_1",
    "type": "iron",
    "purity": "pure",
    "x": 3868.2,
    "y": 2475.95,
    "z": 3583.283203125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode427",
    "type": "iron",
    "purity": "pure",
    "x": 2635.02,
    "y": 1976.5,
    "z": 10451.649414062,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode40",
    "type": "iron",
    "purity": "pure",
    "x": 3349.41,
    "y": 1694.5,
    "z": 2250.7485351562,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode115",
    "type": "iron",
    "purity": "pure",
    "x": 1051.6,
    "y": 2319.61,
    "z": -509.76654052734,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode563",
    "type": "iron",
    "purity": "pure",
    "x": 3973.91,
    "y": 3164.72,
    "z": -1294.7979736328,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode453",
    "type": "iron",
    "purity": "pure",
    "x": 1863.73,
    "y": 1568.22,
    "z": 7983.0224609375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode209",
    "type": "iron",
    "purity": "pure",
    "x": 4644.36,
    "y": 1475.45,
    "z": 4005.9694824219,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode437_30",
    "type": "iron",
    "purity": "pure",
    "x": 2719.28,
    "y": 1894.11,
    "z": 9590.7333984375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode565_8",
    "type": "iron",
    "purity": "pure",
    "x": 3780.55,
    "y": 3081.54,
    "z": -617.17700195312,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode160",
    "type": "iron",
    "purity": "pure",
    "x": 496.14,
    "y": 1655.51,
    "z": 3837.6010742188,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode239",
    "type": "iron",
    "purity": "pure",
    "x": 4145.88,
    "y": 1496.97,
    "z": 3972.9916992188,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode567",
    "type": "iron",
    "purity": "pure",
    "x": 3801.25,
    "y": 2525.53,
    "z": 573.63409423828,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode123_5084",
    "type": "iron",
    "purity": "pure",
    "x": 1425.76,
    "y": 1597.01,
    "z": 1911,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode81",
    "type": "iron",
    "purity": "pure",
    "x": 1066.86,
    "y": 3639.45,
    "z": 1612.3469238281,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode210",
    "type": "iron",
    "purity": "pure",
    "x": 4485.43,
    "y": 1672.89,
    "z": 4283.5400390625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode431",
    "type": "iron",
    "purity": "pure",
    "x": 2593.11,
    "y": 2021.35,
    "z": 10641.12890625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode238",
    "type": "iron",
    "purity": "pure",
    "x": 4194.29,
    "y": 1345.77,
    "z": 3801.0607910156,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode462",
    "type": "iron",
    "purity": "pure",
    "x": 1912.08,
    "y": 1549.78,
    "z": 7971.7919921875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode220",
    "type": "iron",
    "purity": "pure",
    "x": 4730.52,
    "y": 1232.51,
    "z": 4280.7553710938,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode203",
    "type": "iron",
    "purity": "pure",
    "x": 4291.75,
    "y": 1444.32,
    "z": 3864.5659179688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode426",
    "type": "iron",
    "purity": "pure",
    "x": 2616.42,
    "y": 1957.37,
    "z": 9944.1513671875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode518",
    "type": "iron",
    "purity": "pure",
    "x": 3019.6,
    "y": 2508.34,
    "z": 15542.841796875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode80",
    "type": "iron",
    "purity": "pure",
    "x": 1045.79,
    "y": 3691.25,
    "z": 1589.6323242188,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode457",
    "type": "iron",
    "purity": "pure",
    "x": 2937.38,
    "y": 2392.9,
    "z": 14026.735351562,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode219",
    "type": "iron",
    "purity": "pure",
    "x": 4046.68,
    "y": 1303.2,
    "z": 4212.3583984375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode_C_UAID_40B076DF2F794DE201_1841969367",
    "type": "copper",
    "purity": "impure",
    "x": 2297,
    "y": 1366.14,
    "z": 15477.609375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode493",
    "type": "copper",
    "purity": "impure",
    "x": 1608.72,
    "y": 4331.45,
    "z": -6264.2524414062,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode492",
    "type": "copper",
    "purity": "impure",
    "x": 1603.2,
    "y": 4316.91,
    "z": -6240.1333007812,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode131",
    "type": "copper",
    "purity": "impure",
    "x": 384.02,
    "y": 1608.98,
    "z": 5973.7822265625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode188",
    "type": "copper",
    "purity": "impure",
    "x": 3871.49,
    "y": 1269.6,
    "z": 3519.3256835938,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode75_6425",
    "type": "copper",
    "purity": "impure",
    "x": 3032.78,
    "y": 3691.06,
    "z": -5545.0971679688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode214",
    "type": "copper",
    "purity": "impure",
    "x": 4341.62,
    "y": 1101.7,
    "z": 3687.765625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode_C_UAID_40B076DF2F794FE201_2126930721",
    "type": "copper",
    "purity": "impure",
    "x": 2798.16,
    "y": 1375.49,
    "z": 13262,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode83_UAID_40B076DF2F79FFE101_1122581639",
    "type": "copper",
    "purity": "impure",
    "x": 1118.3,
    "y": 3222.83,
    "z": 16113.072265625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode212",
    "type": "copper",
    "purity": "impure",
    "x": 4358.03,
    "y": 1258.56,
    "z": 3740.8823242188,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode562",
    "type": "copper",
    "purity": "impure",
    "x": 1685.1,
    "y": 3205.17,
    "z": 8466.1513671875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode237",
    "type": "copper",
    "purity": "impure",
    "x": 4706.29,
    "y": 711.05,
    "z": 3485.9716796875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode83_UAID_40B076DF2F79FBE101_1618730935",
    "type": "copper",
    "purity": "impure",
    "x": 1099.02,
    "y": 3247.4,
    "z": 16254.215820312,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode202",
    "type": "copper",
    "purity": "normal",
    "x": 3718.51,
    "y": 846.51,
    "z": 1056.9970703125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode162_5199",
    "type": "copper",
    "purity": "normal",
    "x": 1074.11,
    "y": 1218.08,
    "z": 10761.330078125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode150",
    "type": "copper",
    "purity": "normal",
    "x": 2883.28,
    "y": 3509.76,
    "z": 3387.5666503906,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode215",
    "type": "copper",
    "purity": "normal",
    "x": 4080.52,
    "y": 667.16,
    "z": 1242.4907226562,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode38_902",
    "type": "copper",
    "purity": "normal",
    "x": 3281.71,
    "y": 1721.99,
    "z": 2426.6403808594,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode185",
    "type": "copper",
    "purity": "normal",
    "x": 3847.98,
    "y": 1420.4,
    "z": 3452.7375488281,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode506",
    "type": "copper",
    "purity": "normal",
    "x": 2197.75,
    "y": 3542.27,
    "z": -12082.823242188,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode194",
    "type": "copper",
    "purity": "normal",
    "x": 4144.7,
    "y": 1854.65,
    "z": 6021.4301757812,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode125_5930",
    "type": "copper",
    "purity": "normal",
    "x": 1517.64,
    "y": 1596.2,
    "z": 166,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode540",
    "type": "copper",
    "purity": "normal",
    "x": 1940.64,
    "y": 4037.75,
    "z": -1394.3503417969,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode68_2514",
    "type": "copper",
    "purity": "normal",
    "x": 1917.69,
    "y": 4471.31,
    "z": -2366.0461425781,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode127",
    "type": "copper",
    "purity": "normal",
    "x": 1534.54,
    "y": 3599.99,
    "z": -3734.8344726562,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode197",
    "type": "copper",
    "purity": "normal",
    "x": 4535.22,
    "y": 2054.62,
    "z": -396.25744628906,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode159",
    "type": "copper",
    "purity": "normal",
    "x": 1054.1,
    "y": 1633.78,
    "z": 1600.2266845703,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode547_UAID_40B076DF2F79AEE101_1979010387",
    "type": "copper",
    "purity": "normal",
    "x": 2549.48,
    "y": 3044.09,
    "z": 11800.666015625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode112",
    "type": "copper",
    "purity": "normal",
    "x": 385.3,
    "y": 2154.9,
    "z": -331.48297119141,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode94_406",
    "type": "copper",
    "purity": "normal",
    "x": 3229.61,
    "y": 4222.71,
    "z": -1094.7055664062,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode192_0",
    "type": "copper",
    "purity": "normal",
    "x": 3964.22,
    "y": 1088.32,
    "z": 3051.4780273438,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode505",
    "type": "copper",
    "purity": "normal",
    "x": 2210.54,
    "y": 3529.38,
    "z": -12082.940429688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode593",
    "type": "copper",
    "purity": "normal",
    "x": 1971.46,
    "y": 3815.38,
    "z": -1997.0275878906,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode156",
    "type": "copper",
    "purity": "normal",
    "x": 287.78,
    "y": 2017.27,
    "z": -1200.9078369141,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode91_785",
    "type": "copper",
    "purity": "normal",
    "x": 4043.98,
    "y": 2917.8,
    "z": -1601.3115234375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode92",
    "type": "copper",
    "purity": "normal",
    "x": 4145.37,
    "y": 2447.73,
    "z": -298.2346496582,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode141",
    "type": "copper",
    "purity": "normal",
    "x": 4146.78,
    "y": 1777.73,
    "z": 5475.0166015625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode195",
    "type": "copper",
    "purity": "normal",
    "x": 4012.7,
    "y": 1870.07,
    "z": 5535.765625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode507",
    "type": "copper",
    "purity": "normal",
    "x": 2196.23,
    "y": 3560.79,
    "z": -12082.940429688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode211",
    "type": "copper",
    "purity": "normal",
    "x": 4488.19,
    "y": 1261.42,
    "z": 4235.7700195312,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode111_3367",
    "type": "copper",
    "purity": "normal",
    "x": 374.96,
    "y": 2130.45,
    "z": -343.69091796875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode547",
    "type": "copper",
    "purity": "normal",
    "x": 2021.03,
    "y": 4380.6,
    "z": -2531.189453125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode117",
    "type": "copper",
    "purity": "pure",
    "x": 1176.38,
    "y": 2295.52,
    "z": -556.12951660156,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode179",
    "type": "copper",
    "purity": "pure",
    "x": 3665.57,
    "y": 2867.53,
    "z": -1303.9815673828,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode_C_UAID_A036BCACDEB0A6A601_2086848673",
    "type": "copper",
    "purity": "pure",
    "x": 1983.5,
    "y": 1528.37,
    "z": 8397.134765625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode53_510",
    "type": "copper",
    "purity": "pure",
    "x": 2017.75,
    "y": 1529.41,
    "z": 10021.678710938,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode515",
    "type": "copper",
    "purity": "pure",
    "x": 3161.97,
    "y": 2527.58,
    "z": 15468.125976562,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode513",
    "type": "copper",
    "purity": "pure",
    "x": 3180.04,
    "y": 2531.17,
    "z": 15168.270507812,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode547_UAID_40B076DF2F79ADE101_1836911209",
    "type": "copper",
    "purity": "pure",
    "x": 2701.44,
    "y": 4109.96,
    "z": -4444.0463867188,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode83",
    "type": "copper",
    "purity": "pure",
    "x": 1017.3,
    "y": 3732.72,
    "z": 1077.1573486328,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode213",
    "type": "copper",
    "purity": "pure",
    "x": 4531.65,
    "y": 1499.49,
    "z": 4214.5043945312,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode216",
    "type": "copper",
    "purity": "pure",
    "x": 4447.31,
    "y": 1732.93,
    "z": 6020.38671875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode445",
    "type": "copper",
    "purity": "pure",
    "x": 2536.68,
    "y": 1924.3,
    "z": 9944.388671875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode514",
    "type": "copper",
    "purity": "pure",
    "x": 3213.96,
    "y": 2595.39,
    "z": 15369.974609375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode235",
    "type": "copper",
    "purity": "pure",
    "x": 4700.61,
    "y": 1366.01,
    "z": 4187.0166015625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode142_UAID_40B076DF2F79E8DD01_2087440367",
    "type": "caterium",
    "purity": "normal",
    "x": 3574.54,
    "y": 2371.15,
    "z": -29.199884414673,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode134_8590",
    "type": "caterium",
    "purity": "normal",
    "x": 2893.29,
    "y": 3533.15,
    "z": 4175.6665039062,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode574",
    "type": "caterium",
    "purity": "normal",
    "x": 2765.04,
    "y": 3033.5,
    "z": 10116.560546875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode142_UAID_40B076DF2F79E9DD01_1872254547",
    "type": "caterium",
    "purity": "normal",
    "x": 3548.97,
    "y": 2387.37,
    "z": -55.342662811279,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode487_UAID_40B076DF2F7934DF01_1597642799",
    "type": "caterium",
    "purity": "normal",
    "x": 2854.81,
    "y": 1865.18,
    "z": 12651.911132812,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode121_UAID_40B076DF2F7938DF01_2097772508",
    "type": "caterium",
    "purity": "normal",
    "x": 1259.95,
    "y": 1333.97,
    "z": 7753,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode487",
    "type": "caterium",
    "purity": "normal",
    "x": 2077.35,
    "y": 1800.05,
    "z": 10908.915039062,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode142",
    "type": "caterium",
    "purity": "normal",
    "x": 3657.6,
    "y": 1639.68,
    "z": 7240.548828125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode169_UAID_40B076DF2F7939DE01_2083925623",
    "type": "caterium",
    "purity": "normal",
    "x": 2923.68,
    "y": 2383.26,
    "z": 14021.446289062,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode176_UAID_40B076DF2F793BDF01_1694110039",
    "type": "caterium",
    "purity": "pure",
    "x": 1140.53,
    "y": 3043.74,
    "z": 20330.234375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode570",
    "type": "caterium",
    "purity": "pure",
    "x": 3967.35,
    "y": 3295.67,
    "z": -54.522705078125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode142_UAID_40B076DF2F79E9DD01_1434900545",
    "type": "caterium",
    "purity": "pure",
    "x": 3549.85,
    "y": 2336.79,
    "z": 594.19293212891,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode140",
    "type": "caterium",
    "purity": "pure",
    "x": 3739.58,
    "y": 765.58,
    "z": 11784.350585938,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode70_3132",
    "type": "caterium",
    "purity": "pure",
    "x": 1285.9,
    "y": 4008.65,
    "z": -787.02404785156,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode240",
    "type": "caterium",
    "purity": "pure",
    "x": 4872.21,
    "y": 1120.17,
    "z": -1539.4595947266,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode72_998",
    "type": "caterium",
    "purity": "pure",
    "x": 1547.35,
    "y": 4370.34,
    "z": -4620.4956054688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode121_4877",
    "type": "caterium",
    "purity": "pure",
    "x": 973.23,
    "y": 1965.44,
    "z": 3331,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode620",
    "type": "coal",
    "purity": "impure",
    "x": 4869.77,
    "y": 812.87,
    "z": 3920.4284667969,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode604",
    "type": "coal",
    "purity": "impure",
    "x": 2218.39,
    "y": 2965.08,
    "z": 23244.650390625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode611",
    "type": "coal",
    "purity": "impure",
    "x": 4620.88,
    "y": 1989.19,
    "z": -538.83081054688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode622",
    "type": "coal",
    "purity": "impure",
    "x": 3633.65,
    "y": 829.56,
    "z": 1257.345703125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode621",
    "type": "coal",
    "purity": "impure",
    "x": 3621.74,
    "y": 797.24,
    "z": 1070.1922607422,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode573_UAID_40B076DF2F7981E001_1464253430",
    "type": "coal",
    "purity": "impure",
    "x": 3345.52,
    "y": 3360.84,
    "z": 10377.458007812,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode573_UAID_40B076DF2F797DE001_1807610722",
    "type": "coal",
    "purity": "impure",
    "x": 3169.93,
    "y": 2997.55,
    "z": 9714.443359375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode573_UAID_40B076DF2F7974E101_1439035199",
    "type": "coal",
    "purity": "impure",
    "x": 351.44,
    "y": 1523.31,
    "z": -1628.8963623047,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode573_UAID_40B076DF2F7984E001_1384492965",
    "type": "coal",
    "purity": "impure",
    "x": 3454.75,
    "y": 3272.21,
    "z": 10248.458007812,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode573_UAID_40B076DF2F795EE801_1339162695",
    "type": "coal",
    "purity": "impure",
    "x": 3188.08,
    "y": 3056.45,
    "z": 9505.6005859375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode573_UAID_40B076DF2F7973E101_1125437021",
    "type": "coal",
    "purity": "impure",
    "x": 289.85,
    "y": 1546.83,
    "z": -1635.9776611328,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode573_UAID_40B076DF2F7984E001_1664435967",
    "type": "coal",
    "purity": "impure",
    "x": 3367.79,
    "y": 3435.97,
    "z": 9394.4580078125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode573_UAID_40B076DF2F7980E001_1705275252",
    "type": "coal",
    "purity": "impure",
    "x": 3199.72,
    "y": 3249.09,
    "z": 6026.2465820312,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode573_UAID_40B076DF2F7971E101_2069219665",
    "type": "coal",
    "purity": "impure",
    "x": 1198.12,
    "y": 2925.06,
    "z": 3136.9489746094,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode612",
    "type": "coal",
    "purity": "impure",
    "x": 4598.13,
    "y": 1963.48,
    "z": -63.161750793457,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode504",
    "type": "coal",
    "purity": "normal",
    "x": 1640.14,
    "y": 3355.98,
    "z": -3648.8708496094,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode560",
    "type": "coal",
    "purity": "normal",
    "x": 1584.37,
    "y": 3416.05,
    "z": -3613.6010742188,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode617",
    "type": "coal",
    "purity": "normal",
    "x": 4579.18,
    "y": 1592.91,
    "z": 5895.0258789062,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode503",
    "type": "coal",
    "purity": "normal",
    "x": 1656.41,
    "y": 3365.31,
    "z": -3632.1213378906,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode573_UAID_40B076DF2F796FE101_1569477308",
    "type": "coal",
    "purity": "normal",
    "x": 3561.76,
    "y": 3580.91,
    "z": 5348.37890625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode615",
    "type": "coal",
    "purity": "normal",
    "x": 3972.2,
    "y": 855.99,
    "z": 1630.9066162109,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode6_379",
    "type": "coal",
    "purity": "normal",
    "x": 1428.95,
    "y": 1636.9,
    "z": -1405.4753417969,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode616",
    "type": "coal",
    "purity": "normal",
    "x": 4825.36,
    "y": 797.06,
    "z": 3822.7800292969,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode502",
    "type": "coal",
    "purity": "normal",
    "x": 3166.28,
    "y": 4159.51,
    "z": -5135.7299804688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode606",
    "type": "coal",
    "purity": "normal",
    "x": 1222.61,
    "y": 2760.32,
    "z": 19144.66015625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode7_380",
    "type": "coal",
    "purity": "normal",
    "x": 1478.79,
    "y": 1562.63,
    "z": -1581.7320556641,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode559",
    "type": "coal",
    "purity": "normal",
    "x": 1567.1,
    "y": 3406.48,
    "z": -3948.6486816406,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode500",
    "type": "coal",
    "purity": "normal",
    "x": 3210.35,
    "y": 4105.92,
    "z": -6201.1733398438,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode501",
    "type": "coal",
    "purity": "normal",
    "x": 3188.23,
    "y": 4178.76,
    "z": -4609.9643554688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode618",
    "type": "coal",
    "purity": "normal",
    "x": 4616.07,
    "y": 1570.41,
    "z": 5475.8515625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode573_UAID_40B076DF2F7983E001_1088885785",
    "type": "coal",
    "purity": "normal",
    "x": 3594.87,
    "y": 3273.34,
    "z": 10801.458007812,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode619",
    "type": "coal",
    "purity": "normal",
    "x": 4600.91,
    "y": 1608.79,
    "z": 5255.8999023438,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode603",
    "type": "coal",
    "purity": "normal",
    "x": 2546.77,
    "y": 2798.92,
    "z": 24895.326171875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode573_UAID_40B076DF2F7974E101_1674467201",
    "type": "coal",
    "purity": "normal",
    "x": 327.03,
    "y": 1392.61,
    "z": -1621.8963623047,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode5_381",
    "type": "coal",
    "purity": "normal",
    "x": 1444.74,
    "y": 1627.05,
    "z": -1525.4753417969,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode573_UAID_40B076DF2F79ACE101_1257410031",
    "type": "coal",
    "purity": "normal",
    "x": 392.08,
    "y": 1414.56,
    "z": 1526.1036376953,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode498",
    "type": "coal",
    "purity": "normal",
    "x": 4831,
    "y": 746.73,
    "z": 3427.2507324219,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode602",
    "type": "coal",
    "purity": "normal",
    "x": 2382.84,
    "y": 2496.85,
    "z": 23076.40625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode609",
    "type": "coal",
    "purity": "normal",
    "x": 1804.33,
    "y": 2716.01,
    "z": 20012.234375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode581",
    "type": "coal",
    "purity": "normal",
    "x": 4005.11,
    "y": 830.56,
    "z": 1260.6813964844,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode594",
    "type": "coal",
    "purity": "normal",
    "x": 4860.38,
    "y": 1738.04,
    "z": 634.64172363281,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode601",
    "type": "coal",
    "purity": "normal",
    "x": 1730.62,
    "y": 2444.89,
    "z": 22626.6640625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode451",
    "type": "coal",
    "purity": "normal",
    "x": 3016.18,
    "y": 2331.19,
    "z": 8263.71875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode499",
    "type": "coal",
    "purity": "normal",
    "x": 3201.5,
    "y": 4149.33,
    "z": -6062.52734375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode600",
    "type": "coal",
    "purity": "normal",
    "x": 1963.32,
    "y": 2760.53,
    "z": 21307.763671875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode122",
    "type": "coal",
    "purity": "normal",
    "x": 1498.96,
    "y": 1519.35,
    "z": -1631.12109375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode605",
    "type": "coal",
    "purity": "pure",
    "x": 1444.38,
    "y": 2708.37,
    "z": 22428.25390625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode614",
    "type": "coal",
    "purity": "pure",
    "x": 4365.11,
    "y": 735.22,
    "z": 2144.0053710938,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode469",
    "type": "coal",
    "purity": "pure",
    "x": 3087.79,
    "y": 2337,
    "z": 9410.7685546875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode452",
    "type": "coal",
    "purity": "pure",
    "x": 2980.45,
    "y": 2316.94,
    "z": 7998.9155273438,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode599",
    "type": "coal",
    "purity": "pure",
    "x": 1756.49,
    "y": 3136.53,
    "z": 21234.123046875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode587",
    "type": "coal",
    "purity": "pure",
    "x": 1722.4,
    "y": 4471.92,
    "z": -6102.42578125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode_700",
    "type": "coal",
    "purity": "pure",
    "x": 1408.25,
    "y": 2202.63,
    "z": 16295.931640625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode573_UAID_40B076DF2F7972E101_1083579843",
    "type": "coal",
    "purity": "pure",
    "x": 1173.57,
    "y": 2871.1,
    "z": 3127.6848144531,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode610",
    "type": "coal",
    "purity": "pure",
    "x": 4858.27,
    "y": 1719.18,
    "z": 1122.1617431641,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode573_UAID_40B076DF2F7983E001_1840982787",
    "type": "coal",
    "purity": "pure",
    "x": 3760.68,
    "y": 3483.29,
    "z": 6662.4584960938,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode449",
    "type": "coal",
    "purity": "pure",
    "x": 3071.03,
    "y": 2357.15,
    "z": 9425.298828125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode129",
    "type": "coal",
    "purity": "pure",
    "x": 1405.58,
    "y": 2160.67,
    "z": 16266.267578125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode573_UAID_40B076DF2F796BE101_1963012602",
    "type": "coal",
    "purity": "pure",
    "x": 3535.62,
    "y": 3702.43,
    "z": 10347.3203125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode590",
    "type": "coal",
    "purity": "pure",
    "x": 2277.13,
    "y": 4364.89,
    "z": 2768.0454101562,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode130",
    "type": "coal",
    "purity": "pure",
    "x": 1445.4,
    "y": 2147.86,
    "z": 16193.370117188,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode623",
    "type": "coal",
    "purity": "pure",
    "x": 4332.3,
    "y": 736.27,
    "z": 1673.5780029297,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode25_98",
    "type": "oil",
    "purity": "impure",
    "x": 2362.62,
    "y": 1253,
    "z": -1689.2554931641,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode16",
    "type": "oil",
    "purity": "impure",
    "x": 1872.11,
    "y": 1229.93,
    "z": 2291.0378417969,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode98",
    "type": "oil",
    "purity": "impure",
    "x": 3293.79,
    "y": 3849.82,
    "z": -9242.583984375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode446_1",
    "type": "oil",
    "purity": "impure",
    "x": 3278.3,
    "y": 1904.45,
    "z": 1049.76953125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode447",
    "type": "oil",
    "purity": "impure",
    "x": 3337.64,
    "y": 1869.56,
    "z": 1419.1478271484,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode15",
    "type": "oil",
    "purity": "impure",
    "x": 1945.5,
    "y": 1215.15,
    "z": 2280.0439453125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode24_97",
    "type": "oil",
    "purity": "impure",
    "x": 2265.1,
    "y": 1180.98,
    "z": -1606.4981689453,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode23_96",
    "type": "oil",
    "purity": "impure",
    "x": 2543.58,
    "y": 1223.38,
    "z": -1744.9278564453,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode32_105",
    "type": "oil",
    "purity": "impure",
    "x": 3138.75,
    "y": 1014.84,
    "z": -1580.8369140625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode31_104",
    "type": "oil",
    "purity": "impure",
    "x": 3147.53,
    "y": 1079.56,
    "z": -1429.3393554688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode459",
    "type": "oil",
    "purity": "normal",
    "x": 2513.22,
    "y": 2437.44,
    "z": 13593.469726562,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode100",
    "type": "oil",
    "purity": "normal",
    "x": 3350.76,
    "y": 3867.85,
    "z": -9238.5712890625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode448",
    "type": "oil",
    "purity": "normal",
    "x": 3314.44,
    "y": 1866.82,
    "z": 1042.3630371094,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode14_609",
    "type": "oil",
    "purity": "normal",
    "x": 2340,
    "y": 1205.52,
    "z": -1683.8994140625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode29_102",
    "type": "oil",
    "purity": "normal",
    "x": 2512.43,
    "y": 1155.74,
    "z": -1658.7414550781,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode458",
    "type": "oil",
    "purity": "normal",
    "x": 2491.99,
    "y": 2464.82,
    "z": 13191.504882812,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode88",
    "type": "oil",
    "purity": "normal",
    "x": 613.51,
    "y": 2914.55,
    "z": -1676.4932861328,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode444_0",
    "type": "oil",
    "purity": "normal",
    "x": 3320.36,
    "y": 1885.66,
    "z": 1051.0395507812,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode30_103",
    "type": "oil",
    "purity": "normal",
    "x": 3152.25,
    "y": 1206.29,
    "z": -1603.0947265625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode28_101",
    "type": "oil",
    "purity": "normal",
    "x": 1924.66,
    "y": 1102.13,
    "z": -1708.5833740234,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode151",
    "type": "oil",
    "purity": "normal",
    "x": 3396.47,
    "y": 3923.39,
    "z": -8910.6083984375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode86",
    "type": "oil",
    "purity": "normal",
    "x": 636.27,
    "y": 3015.83,
    "z": -1684.9669189453,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode152_995",
    "type": "oil",
    "purity": "pure",
    "x": 3390.49,
    "y": 3941.09,
    "z": -8910.763671875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode87",
    "type": "oil",
    "purity": "pure",
    "x": 529.67,
    "y": 3099.21,
    "z": -1652.3980712891,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode460",
    "type": "oil",
    "purity": "pure",
    "x": 2493.56,
    "y": 2500.75,
    "z": 13149.619140625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode26_99",
    "type": "oil",
    "purity": "pure",
    "x": 2459.28,
    "y": 972.84,
    "z": -1743.5040283203,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode154",
    "type": "oil",
    "purity": "pure",
    "x": 3376.42,
    "y": 3750.08,
    "z": -5640.095703125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode27_100",
    "type": "oil",
    "purity": "pure",
    "x": 2243.81,
    "y": 996.81,
    "z": -1744.1844482422,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode89",
    "type": "oil",
    "purity": "pure",
    "x": 479.79,
    "y": 2960.96,
    "z": -1562.4610595703,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode155",
    "type": "oil",
    "purity": "pure",
    "x": 3394.2,
    "y": 3768,
    "z": -5732.2104492188,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode71_UAID_40B076DF2F7925DB01_1453678949",
    "type": "sulfur",
    "purity": "impure",
    "x": 2771.24,
    "y": 3961.82,
    "z": -78.607200622559,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode582",
    "type": "sulfur",
    "purity": "impure",
    "x": 4138.71,
    "y": 2584.59,
    "z": -881.76940917969,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode170_363",
    "type": "sulfur",
    "purity": "impure",
    "x": 1888.7,
    "y": 2013.07,
    "z": 23212.21484375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode177",
    "type": "sulfur",
    "purity": "impure",
    "x": 2393.7,
    "y": 4388.28,
    "z": 905,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode510",
    "type": "sulfur",
    "purity": "impure",
    "x": 1896.91,
    "y": 1873.67,
    "z": 343.07620239258,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode461",
    "type": "sulfur",
    "purity": "impure",
    "x": 3017.75,
    "y": 1991.03,
    "z": 3668.3757324219,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode467",
    "type": "sulfur",
    "purity": "normal",
    "x": 2776.35,
    "y": 2517.44,
    "z": 16079.166015625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode71_UAID_40B076DF2F7929DB01_1177072656",
    "type": "sulfur",
    "purity": "normal",
    "x": 2804.98,
    "y": 3963.05,
    "z": -83.758453369141,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode613",
    "type": "sulfur",
    "purity": "normal",
    "x": 4697.62,
    "y": 1767.75,
    "z": 9236.6181640625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode71_736",
    "type": "sulfur",
    "purity": "normal",
    "x": 1487.11,
    "y": 3105.8,
    "z": 8665.2392578125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode71_UAID_40B076DF2F79B9DB01_1490254983",
    "type": "sulfur",
    "purity": "normal",
    "x": 743.1,
    "y": 1364.99,
    "z": -1317.3026123047,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode624",
    "type": "sulfur",
    "purity": "pure",
    "x": 3805.51,
    "y": 653.09,
    "z": 1498.7733154297,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode71_UAID_40B076DF2F797CDB01_1695622247",
    "type": "sulfur",
    "purity": "pure",
    "x": 1196.14,
    "y": 3600.81,
    "z": 12698.50390625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode71_UAID_40B076DF2F7924DB01_1576108771",
    "type": "sulfur",
    "purity": "pure",
    "x": 2794.84,
    "y": 3990.57,
    "z": -85.799781799316,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode71_UAID_40B076DF2F7912DC01_2042985647",
    "type": "sulfur",
    "purity": "pure",
    "x": 3416.86,
    "y": 849.61,
    "z": 23307.0078125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode71_UAID_40B076DF2F7923DB01_2085455593",
    "type": "sulfur",
    "purity": "pure",
    "x": 3777.58,
    "y": 3513.06,
    "z": 8887.830078125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode481",
    "type": "bauxite",
    "purity": "impure",
    "x": 3488.52,
    "y": 3117.61,
    "z": 1238.6220703125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode635",
    "type": "bauxite",
    "purity": "impure",
    "x": 2851.29,
    "y": 2945.56,
    "z": 9540.1162109375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode477",
    "type": "bauxite",
    "purity": "impure",
    "x": 3902.99,
    "y": 2817.63,
    "z": -816.80450439453,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode566",
    "type": "bauxite",
    "purity": "impure",
    "x": 2125.21,
    "y": 2791.01,
    "z": 21065.998046875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode636",
    "type": "bauxite",
    "purity": "impure",
    "x": 2759.82,
    "y": 2913.22,
    "z": 10375.116210938,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode529",
    "type": "bauxite",
    "purity": "normal",
    "x": 2425.84,
    "y": 2843.22,
    "z": 23601.6015625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode476",
    "type": "bauxite",
    "purity": "normal",
    "x": 3916.45,
    "y": 2853.15,
    "z": -1325.3865966797,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode480",
    "type": "bauxite",
    "purity": "normal",
    "x": 3488.99,
    "y": 3089.79,
    "z": 1096.8028564453,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode486",
    "type": "bauxite",
    "purity": "normal",
    "x": 2179.88,
    "y": 2561.83,
    "z": 24001.51953125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode597",
    "type": "bauxite",
    "purity": "normal",
    "x": 1159.27,
    "y": 2496.24,
    "z": 19505.623046875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode633",
    "type": "bauxite",
    "purity": "normal",
    "x": 2869.48,
    "y": 2832.3,
    "z": 9765.1162109375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode479",
    "type": "bauxite",
    "purity": "pure",
    "x": 3897.46,
    "y": 2870.56,
    "z": -866.56665039062,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode568",
    "type": "bauxite",
    "purity": "pure",
    "x": 2127.48,
    "y": 3109.1,
    "z": 22756.326171875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode596",
    "type": "bauxite",
    "purity": "pure",
    "x": 980.72,
    "y": 2795.84,
    "z": 23765.869140625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode485",
    "type": "bauxite",
    "purity": "pure",
    "x": 1767.41,
    "y": 2593.51,
    "z": 23995.044921875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode634",
    "type": "bauxite",
    "purity": "pure",
    "x": 2941.66,
    "y": 2839.17,
    "z": 17359.505859375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode595",
    "type": "bauxite",
    "purity": "pure",
    "x": 716.25,
    "y": 2571.2,
    "z": 17705.3828125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode57_UAID_40B076DF2F7935DF01_1413169977",
    "type": "quartz",
    "purity": "impure",
    "x": 2529.56,
    "y": 1627.04,
    "z": 7156.283203125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode57_UAID_40B076DF2F7991DF01_1459615180",
    "type": "quartz",
    "purity": "impure",
    "x": 2577.87,
    "y": 1581.9,
    "z": 8325.423828125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode136_UAID_40B076DF2F7975DF01_1617269241",
    "type": "quartz",
    "purity": "impure",
    "x": 2576.68,
    "y": 3878.04,
    "z": -4197.0180664062,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode137_2248",
    "type": "quartz",
    "purity": "normal",
    "x": 2395.79,
    "y": 3284.71,
    "z": 13410.24609375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode231",
    "type": "quartz",
    "purity": "normal",
    "x": 4199.76,
    "y": 491.35,
    "z": 1232.6881103516,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode474_UAID_40B076DF2F7983DF01_2128950703",
    "type": "quartz",
    "purity": "normal",
    "x": 3473.4,
    "y": 2403.52,
    "z": 9398.4814453125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode136_UAID_40B076DF2F7975DF01_1622351243",
    "type": "quartz",
    "purity": "normal",
    "x": 2530.97,
    "y": 3866.26,
    "z": -5763.1850585938,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode552",
    "type": "quartz",
    "purity": "normal",
    "x": 868.34,
    "y": 1561.95,
    "z": -1241.9168701172,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode232",
    "type": "quartz",
    "purity": "normal",
    "x": 4219.34,
    "y": 526.13,
    "z": 1256.873046875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode474_UAID_40B076DF2F798EDF01_2134364650",
    "type": "quartz",
    "purity": "normal",
    "x": 3429.62,
    "y": 2381.39,
    "z": 9456.515625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode522",
    "type": "quartz",
    "purity": "pure",
    "x": 1560.49,
    "y": 2920.36,
    "z": 2145.046875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode588",
    "type": "quartz",
    "purity": "pure",
    "x": 1047.41,
    "y": 1526.95,
    "z": -1914.1225585938,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode136_UAID_40B076DF2F7975DF01_1587576239",
    "type": "quartz",
    "purity": "pure",
    "x": 2573.63,
    "y": 3803.55,
    "z": -3725.4567871094,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode588_UAID_40B076DF2F79CEDF01_1910960903",
    "type": "quartz",
    "purity": "pure",
    "x": 1016.58,
    "y": 1537.17,
    "z": -2030.1938476562,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode474_UAID_40B076DF2F798DDF01_1645035472",
    "type": "quartz",
    "purity": "pure",
    "x": 3455.49,
    "y": 2460.01,
    "z": 10260.310546875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode136",
    "type": "quartz",
    "purity": "pure",
    "x": 2415.5,
    "y": 3301.18,
    "z": 13370.24609375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode520",
    "type": "quartz",
    "purity": "pure",
    "x": 1559.8,
    "y": 2943.97,
    "z": 2145.046875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode632",
    "type": "uranium",
    "purity": "impure",
    "x": 1277.92,
    "y": 1248.14,
    "z": 46528.30859375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode484_UAID_40B076DF2F79E0DF01_2091429101",
    "type": "uranium",
    "purity": "impure",
    "x": 3363.62,
    "y": 1237.36,
    "z": 23503.19921875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode484",
    "type": "uranium",
    "purity": "impure",
    "x": 3287.1,
    "y": 2834.7,
    "z": -9.3217897415161,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode598_0",
    "type": "uranium",
    "purity": "normal",
    "x": 1656.98,
    "y": 2840.01,
    "z": 19145.953125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode576",
    "type": "uranium",
    "purity": "normal",
    "x": 2415.99,
    "y": 3106.85,
    "z": -4809.0512695312,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode99",
    "type": "sam",
    "purity": "impure",
    "x": 3048.82,
    "y": 4099.41,
    "z": -14192.569335938,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode43_UAID_40B076DF2F793ED901_1532454233",
    "type": "sam",
    "purity": "impure",
    "x": 3182.13,
    "y": 2336.32,
    "z": 4287.4365234375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode43_UAID_40B076DF2F7936D401_1733397541",
    "type": "sam",
    "purity": "impure",
    "x": 1623.81,
    "y": 2280.66,
    "z": 15656.698242188,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode172_UAID_40B076DF2F79DFD901_1471130569",
    "type": "sam",
    "purity": "impure",
    "x": 2700.76,
    "y": 3859.31,
    "z": 5722.4125976562,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode43_UAID_40B076DF2F7932D901_1711042113",
    "type": "sam",
    "purity": "impure",
    "x": 1851.89,
    "y": 813.15,
    "z": 4931.095703125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode241_UAID_40B076DF2F7947D301_1723440520",
    "type": "sam",
    "purity": "impure",
    "x": 3980.99,
    "y": 753.8,
    "z": 1087.6807861328,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode607",
    "type": "sam",
    "purity": "impure",
    "x": 1205.68,
    "y": 2634.33,
    "z": 19457.724609375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode101_UAID_40B076DF2F79E6D901_1551800812",
    "type": "sam",
    "purity": "impure",
    "x": 2956.79,
    "y": 2971,
    "z": 18673.609375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode43_UAID_40B076DF2F7941D901_1404601764",
    "type": "sam",
    "purity": "impure",
    "x": 3699.15,
    "y": 2272.69,
    "z": 2185.2993164062,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode101_1893",
    "type": "sam",
    "purity": "impure",
    "x": 3241.89,
    "y": 3186.97,
    "z": 5602.8876953125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode519_UAID_40B076DF2F79D3D901_1586151453",
    "type": "sam",
    "purity": "normal",
    "x": 951.09,
    "y": 3089.15,
    "z": 17039.228515625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode47_3066",
    "type": "sam",
    "purity": "normal",
    "x": 2265.78,
    "y": 2491.04,
    "z": 14671.2109375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode241",
    "type": "sam",
    "purity": "normal",
    "x": 3312.74,
    "y": 596.42,
    "z": 21591.23046875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode78_1097",
    "type": "sam",
    "purity": "normal",
    "x": 3684.03,
    "y": 3270.22,
    "z": -1581.8171386719,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode172",
    "type": "sam",
    "purity": "normal",
    "x": 2002.37,
    "y": 4292.16,
    "z": -13353.768554688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode135",
    "type": "sam",
    "purity": "normal",
    "x": 948.63,
    "y": 1549.01,
    "z": -1743.8706054688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode101_UAID_40B076DF2F79E7D901_2125168992",
    "type": "sam",
    "purity": "pure",
    "x": 3248.36,
    "y": 2931.69,
    "z": 9782.39453125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode519",
    "type": "sam",
    "purity": "pure",
    "x": 1840.36,
    "y": 3354.4,
    "z": 23613.654296875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNode43",
    "type": "sam",
    "purity": "pure",
    "x": 2712.95,
    "y": 1035,
    "z": 8929.0693359375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite7",
    "type": "nitrogen",
    "purity": "impure",
    "x": 3585.24,
    "y": 3379.49,
    "z": -317.35888671875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite6",
    "type": "nitrogen",
    "purity": "impure",
    "x": 3593.31,
    "y": 3414.67,
    "z": -225.07778930664,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite8",
    "type": "nitrogen",
    "purity": "normal",
    "x": 3600.41,
    "y": 3380.05,
    "z": -285,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite9",
    "type": "nitrogen",
    "purity": "normal",
    "x": 3615.84,
    "y": 3389.58,
    "z": -187.51669311523,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite3",
    "type": "nitrogen",
    "purity": "normal",
    "x": 2996.45,
    "y": 4188.77,
    "z": 159.65127563477,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite18_3",
    "type": "nitrogen",
    "purity": "normal",
    "x": 3006.74,
    "y": 4180.26,
    "z": -372,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite23_5",
    "type": "nitrogen",
    "purity": "normal",
    "x": 3674.56,
    "y": 424.02,
    "z": 7905.6401367188,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite16",
    "type": "nitrogen",
    "purity": "normal",
    "x": 3630.33,
    "y": 428.7,
    "z": 7879.724609375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite25",
    "type": "nitrogen",
    "purity": "normal",
    "x": 497.35,
    "y": 1229.5,
    "z": -1739.56640625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite33",
    "type": "nitrogen",
    "purity": "pure",
    "x": 1210.35,
    "y": 3284.3,
    "z": 14995.01953125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite32",
    "type": "nitrogen",
    "purity": "pure",
    "x": 1218.08,
    "y": 3308.22,
    "z": 15259.43359375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite31",
    "type": "nitrogen",
    "purity": "pure",
    "x": 1211.23,
    "y": 3296.55,
    "z": 15174.9140625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite34",
    "type": "nitrogen",
    "purity": "pure",
    "x": 1192.66,
    "y": 3335.05,
    "z": 15439.01953125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite28",
    "type": "nitrogen",
    "purity": "pure",
    "x": 1178.91,
    "y": 3333.01,
    "z": 15315.870117188,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite30",
    "type": "nitrogen",
    "purity": "pure",
    "x": 1191.66,
    "y": 3291.22,
    "z": 15181.536132812,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite29",
    "type": "nitrogen",
    "purity": "pure",
    "x": 1200.81,
    "y": 3325.61,
    "z": 15387.870117188,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite42",
    "type": "nitrogen",
    "purity": "pure",
    "x": 2726.96,
    "y": 3156.53,
    "z": 10049.584960938,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite40",
    "type": "nitrogen",
    "purity": "pure",
    "x": 2740.52,
    "y": 3158.67,
    "z": 10057.5859375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite44",
    "type": "nitrogen",
    "purity": "pure",
    "x": 2736.06,
    "y": 3224.73,
    "z": 9962.3173828125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite35",
    "type": "nitrogen",
    "purity": "pure",
    "x": 2748.65,
    "y": 3175.45,
    "z": 10177.965820312,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite37",
    "type": "nitrogen",
    "purity": "pure",
    "x": 2754.1,
    "y": 3213.23,
    "z": 9991.8251953125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite41",
    "type": "nitrogen",
    "purity": "pure",
    "x": 2722.47,
    "y": 3213.77,
    "z": 10103.807617188,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite36",
    "type": "nitrogen",
    "purity": "pure",
    "x": 2706.82,
    "y": 3185.1,
    "z": 10183.618164062,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite38",
    "type": "nitrogen",
    "purity": "pure",
    "x": 2716.51,
    "y": 3173.96,
    "z": 10216.438476562,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite43",
    "type": "nitrogen",
    "purity": "pure",
    "x": 2706.99,
    "y": 3206.21,
    "z": 10241.166015625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite39",
    "type": "nitrogen",
    "purity": "pure",
    "x": 2749.15,
    "y": 3195.46,
    "z": 10209.373046875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite12",
    "type": "nitrogen",
    "purity": "pure",
    "x": 3616.7,
    "y": 3411.71,
    "z": -209.02577209473,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite11",
    "type": "nitrogen",
    "purity": "pure",
    "x": 3604.95,
    "y": 3424.69,
    "z": -212.02577209473,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite10",
    "type": "nitrogen",
    "purity": "pure",
    "x": 3578.86,
    "y": 3415.29,
    "z": -126.02577209473,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite13",
    "type": "nitrogen",
    "purity": "pure",
    "x": 3573.49,
    "y": 3382.51,
    "z": -247.35888671875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite5",
    "type": "nitrogen",
    "purity": "pure",
    "x": 3035.94,
    "y": 4209.44,
    "z": 238,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite4",
    "type": "nitrogen",
    "purity": "pure",
    "x": 3032.55,
    "y": 4194.13,
    "z": -294,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite_2",
    "type": "nitrogen",
    "purity": "pure",
    "x": 3017.22,
    "y": 4219.09,
    "z": 890,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite2",
    "type": "nitrogen",
    "purity": "pure",
    "x": 2996.48,
    "y": 4203.1,
    "z": 734,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite17",
    "type": "nitrogen",
    "purity": "pure",
    "x": 3672.13,
    "y": 409.38,
    "z": 8160.9453125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite14",
    "type": "nitrogen",
    "purity": "pure",
    "x": 3663.83,
    "y": 434.74,
    "z": 7875.6401367188,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite19",
    "type": "nitrogen",
    "purity": "pure",
    "x": 3637.32,
    "y": 418.48,
    "z": 7931.724609375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite15",
    "type": "nitrogen",
    "purity": "pure",
    "x": 3640.79,
    "y": 444.5,
    "z": 8244.490234375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite20",
    "type": "nitrogen",
    "purity": "pure",
    "x": 3655.43,
    "y": 406.82,
    "z": 7867.1240234375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite24",
    "type": "nitrogen",
    "purity": "pure",
    "x": 483.63,
    "y": 1221.62,
    "z": -1741.0864257812,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite21",
    "type": "nitrogen",
    "purity": "pure",
    "x": 472.15,
    "y": 1250.99,
    "z": -1240.98046875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite22",
    "type": "nitrogen",
    "purity": "pure",
    "x": 465.4,
    "y": 1224.9,
    "z": -1581.9809570312,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite51_1",
    "type": "nitrogen",
    "purity": "pure",
    "x": 470.23,
    "y": 1237.26,
    "z": -1460.1298828125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite27",
    "type": "nitrogen",
    "purity": "pure",
    "x": 490.43,
    "y": 1267.44,
    "z": -1457.1298828125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite26",
    "type": "nitrogen",
    "purity": "pure",
    "x": 500.34,
    "y": 1243.9,
    "z": -1739.56640625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite47",
    "type": "oil",
    "purity": "impure",
    "x": 3923.67,
    "y": 3258.45,
    "z": -77.76171875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite48",
    "type": "oil",
    "purity": "impure",
    "x": 3971.61,
    "y": 3238.39,
    "z": -102.578125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite45",
    "type": "oil",
    "purity": "impure",
    "x": 3942.94,
    "y": 3262.7,
    "z": -101.34375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite46",
    "type": "oil",
    "purity": "impure",
    "x": 3922.47,
    "y": 3243.56,
    "z": -66.40234375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite50",
    "type": "oil",
    "purity": "impure",
    "x": 3945.05,
    "y": 3230.71,
    "z": -91.1640625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite49",
    "type": "oil",
    "purity": "impure",
    "x": 3958.78,
    "y": 3265.57,
    "z": -83.2890625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite61_UAID_40B076DF2F79D7DF01_2053713511",
    "type": "oil",
    "purity": "impure",
    "x": 417.09,
    "y": 2965.36,
    "z": -1159.0599365234,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite61_UAID_40B076DF2F79D8DF01_1999134691",
    "type": "oil",
    "purity": "impure",
    "x": 407.76,
    "y": 2977.91,
    "z": -1353.6193847656,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite57",
    "type": "oil",
    "purity": "normal",
    "x": 1894.85,
    "y": 2467.75,
    "z": 25053.796875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite60",
    "type": "oil",
    "purity": "normal",
    "x": 1884.34,
    "y": 2430.72,
    "z": 25142.185546875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite59",
    "type": "oil",
    "purity": "normal",
    "x": 1871.13,
    "y": 2440.43,
    "z": 25138.8828125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite61_UAID_40B076DF2F79D7DF01_1933830510",
    "type": "oil",
    "purity": "normal",
    "x": 425.86,
    "y": 2979.33,
    "z": -1188.0451660156,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite61_UAID_40B076DF2F79D8DF01_1587984689",
    "type": "oil",
    "purity": "normal",
    "x": 400.89,
    "y": 3002.53,
    "z": -1296.5887451172,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite61_UAID_40B076DF2F79D9DF01_1230935868",
    "type": "oil",
    "purity": "normal",
    "x": 394.19,
    "y": 2978.8,
    "z": -1342.2883300781,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite61",
    "type": "oil",
    "purity": "pure",
    "x": 1903.13,
    "y": 2427.43,
    "z": 25325.0703125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite62",
    "type": "oil",
    "purity": "pure",
    "x": 1916.44,
    "y": 2444.26,
    "z": 25170.345703125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite63",
    "type": "oil",
    "purity": "pure",
    "x": 1874.59,
    "y": 2453.01,
    "z": 25053.646484375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_FrackingSatellite61_UAID_40B076DF2F79D8DF01_1704280690",
    "type": "oil",
    "purity": "pure",
    "x": 388.75,
    "y": 2996.99,
    "z": -1279.5224609375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNodeGeyser_C_UAID_40B076DF2F796FE001_1768243264",
    "type": "geothermal",
    "purity": "impure",
    "x": 2422.9,
    "y": 3952.87,
    "z": -5933,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNodeGeyser_C_UAID_40B076DF2F797AE001_2137062191",
    "type": "geothermal",
    "purity": "impure",
    "x": 4040.9,
    "y": 2492.51,
    "z": 2408,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNodeGeyser_C_UAID_40B076DF2F792DE001_1228687627",
    "type": "geothermal",
    "purity": "impure",
    "x": 3000.97,
    "y": 1517.64,
    "z": 18842,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNodeGeyser_C_UAID_40B076DF2F79C7DB01_1750096454",
    "type": "geothermal",
    "purity": "impure",
    "x": 3441.67,
    "y": 880.33,
    "z": 22813,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNodeGeyser_C_UAID_40B076DF2F797AE001_1940806190",
    "type": "geothermal",
    "purity": "impure",
    "x": 4048.07,
    "y": 2508,
    "z": 2550,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNodeGeyser_76",
    "type": "geothermal",
    "purity": "impure",
    "x": 3058.95,
    "y": 1890.98,
    "z": 1984.0189208984,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNodeGeyser9_3239",
    "type": "geothermal",
    "purity": "impure",
    "x": 2454.4,
    "y": 1839.42,
    "z": 10544,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNodeGeyser7_2873",
    "type": "geothermal",
    "purity": "impure",
    "x": 2780,
    "y": 2286.32,
    "z": 5615.953125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNodeGeyser10_3650",
    "type": "geothermal",
    "purity": "impure",
    "x": 2491.55,
    "y": 2132.59,
    "z": 5773,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNodeGeyser_C_UAID_40B076DF2F792FE001_1083532997",
    "type": "geothermal",
    "purity": "normal",
    "x": 764.17,
    "y": 1434.04,
    "z": -1769,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNodeGeyser_C_UAID_40B076DF2F7967E001_1786196831",
    "type": "geothermal",
    "purity": "normal",
    "x": 1546.08,
    "y": 2049.26,
    "z": 15498,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNodeGeyser_C_UAID_40B076DF2F796AE001_1928280369",
    "type": "geothermal",
    "purity": "normal",
    "x": 1031.2,
    "y": 2632.58,
    "z": 15329,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNodeGeyser_C_UAID_40B076DF2F792EE001_1257671809",
    "type": "geothermal",
    "purity": "normal",
    "x": 741.07,
    "y": 1427.31,
    "z": -1621,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNodeGeyser_C_UAID_40B076DF2F796AE001_1661824368",
    "type": "geothermal",
    "purity": "normal",
    "x": 1009.83,
    "y": 2692.91,
    "z": 15333,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNodeGeyser_C_UAID_40B076DF2F7974E001_1257931119",
    "type": "geothermal",
    "purity": "normal",
    "x": 2434.6,
    "y": 3900.68,
    "z": -5818,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNodeGeyser18",
    "type": "geothermal",
    "purity": "normal",
    "x": 1237.28,
    "y": 2110.74,
    "z": 3236.3615722656,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNodeGeyser11_3803",
    "type": "geothermal",
    "purity": "normal",
    "x": 2630.52,
    "y": 2402.56,
    "z": 13085,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNodeGeyser4_1615",
    "type": "geothermal",
    "purity": "normal",
    "x": 4036.13,
    "y": 2550.56,
    "z": 953.33203125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNodeGeyser8",
    "type": "geothermal",
    "purity": "normal",
    "x": 2801.82,
    "y": 2291.13,
    "z": 5590,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNodeGeyser19",
    "type": "geothermal",
    "purity": "normal",
    "x": 3541.61,
    "y": 2799.78,
    "z": -1367,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNodeGeyser12_3894",
    "type": "geothermal",
    "purity": "normal",
    "x": 1940.34,
    "y": 1910.55,
    "z": -87,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNodeGeyser2_581",
    "type": "geothermal",
    "purity": "normal",
    "x": 3107.97,
    "y": 1903.54,
    "z": 1558.6442871094,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNodeGeyser_C_UAID_40B076DF2F79ADDD01_1602669012",
    "type": "geothermal",
    "purity": "pure",
    "x": 2793.47,
    "y": 3950.31,
    "z": -154,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNodeGeyser_C_UAID_40B076DF2F79ADDD01_1447318011",
    "type": "geothermal",
    "purity": "pure",
    "x": 2758.92,
    "y": 3985.67,
    "z": 21,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNodeGeyser_C_UAID_40B076DF2F796CE001_1156904726",
    "type": "geothermal",
    "purity": "pure",
    "x": 2499.51,
    "y": 2789.56,
    "z": 23962,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNodeGeyser_C_UAID_40B076DF2F7975E001_2124245305",
    "type": "geothermal",
    "purity": "pure",
    "x": 3180.62,
    "y": 3903.49,
    "z": -8796,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNodeGeyser_C_UAID_40B076DF2F796EE001_1440606080",
    "type": "geothermal",
    "purity": "pure",
    "x": 2458.15,
    "y": 2819.45,
    "z": 23761,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNodeGeyser_C_UAID_40B076DF2F796DE001_2106907903",
    "type": "geothermal",
    "purity": "pure",
    "x": 2472.79,
    "y": 2849.91,
    "z": 23943,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNodeGeyser15",
    "type": "geothermal",
    "purity": "pure",
    "x": 1214.46,
    "y": 2087.91,
    "z": 3018.4145507812,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNodeGeyser14",
    "type": "geothermal",
    "purity": "pure",
    "x": 3510.49,
    "y": 2796.02,
    "z": -1317,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_ResourceNodeGeyser13_3999",
    "type": "geothermal",
    "purity": "pure",
    "x": 1830.94,
    "y": 1415.59,
    "z": -1849,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_41",
    "type": "slug_green",
    "purity": "normal",
    "x": 3269.26,
    "y": 3271.95,
    "z": 9841,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0785B01_1425075382",
    "type": "slug_green",
    "purity": "normal",
    "x": 3105.8,
    "y": 1414.95,
    "z": 2480,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0DD5B01_1562001181",
    "type": "slug_green",
    "purity": "normal",
    "x": 3152.47,
    "y": 1350.37,
    "z": 3923,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk45_UAID_40B076DF2F791E6201_1165229929",
    "type": "slug_green",
    "purity": "normal",
    "x": 3052.71,
    "y": 1357.11,
    "z": 339.95495605469,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal102",
    "type": "slug_green",
    "purity": "normal",
    "x": 3104.95,
    "y": 1436.53,
    "z": 5767,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0A05F01_1896752643",
    "type": "slug_green",
    "purity": "normal",
    "x": 3531.2,
    "y": 1593.71,
    "z": 18455,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal117_2",
    "type": "slug_green",
    "purity": "normal",
    "x": 3418.01,
    "y": 1480.46,
    "z": 23561,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal125_0",
    "type": "slug_green",
    "purity": "normal",
    "x": 3534.42,
    "y": 1452.03,
    "z": 22062,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F02C6001_1338841280",
    "type": "slug_green",
    "purity": "normal",
    "x": 3548.29,
    "y": 1382.57,
    "z": 16879,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal96",
    "type": "slug_green",
    "purity": "normal",
    "x": 3213,
    "y": 1348.53,
    "z": 8384,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0395B01_1557158296",
    "type": "slug_green",
    "purity": "normal",
    "x": 3447.17,
    "y": 1342.15,
    "z": 23641,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0775B01_1420184201",
    "type": "slug_green",
    "purity": "normal",
    "x": 3208.95,
    "y": 1242.44,
    "z": 7352,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0615301_1117010932",
    "type": "slug_green",
    "purity": "normal",
    "x": 3292.67,
    "y": 1287.63,
    "z": 20626,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0395B01_1742920298",
    "type": "slug_green",
    "purity": "normal",
    "x": 3385.61,
    "y": 1199.71,
    "z": 23854,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F03A5B01_1333253475",
    "type": "slug_green",
    "purity": "normal",
    "x": 3458.67,
    "y": 1072.34,
    "z": 23474,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal93_2",
    "type": "slug_green",
    "purity": "normal",
    "x": 3300.05,
    "y": 1147.89,
    "z": 17622,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal56_4",
    "type": "slug_green",
    "purity": "normal",
    "x": 3250.72,
    "y": 1176.02,
    "z": 14214,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_14",
    "type": "slug_green",
    "purity": "normal",
    "x": 2258.06,
    "y": 2509.68,
    "z": 23354.48046875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal66_3",
    "type": "slug_green",
    "purity": "normal",
    "x": 2410.08,
    "y": 2700.18,
    "z": 8911.24609375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal14_10",
    "type": "slug_green",
    "purity": "normal",
    "x": 2428.47,
    "y": 2507.24,
    "z": 17326.091796875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal2_228",
    "type": "slug_green",
    "purity": "normal",
    "x": 2477.63,
    "y": 2951.53,
    "z": 31465.447265625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal65",
    "type": "slug_green",
    "purity": "normal",
    "x": 2450.65,
    "y": 2880.88,
    "z": 13030.284179688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal98",
    "type": "slug_green",
    "purity": "normal",
    "x": 2509.14,
    "y": 2726.08,
    "z": 21532.9921875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal1_227",
    "type": "slug_green",
    "purity": "normal",
    "x": 2591.32,
    "y": 2825.32,
    "z": 31373.697265625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal9_19",
    "type": "slug_green",
    "purity": "normal",
    "x": 2524.74,
    "y": 2870.43,
    "z": 20087.505859375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal1_21",
    "type": "slug_green",
    "purity": "normal",
    "x": 2632.46,
    "y": 3014.88,
    "z": 13007.944335938,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal2_1",
    "type": "slug_green",
    "purity": "normal",
    "x": 2422.7,
    "y": 3058.86,
    "z": 14359.439453125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal7_11",
    "type": "slug_green",
    "purity": "normal",
    "x": 2122.65,
    "y": 2590.69,
    "z": 29140.52734375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal5_9",
    "type": "slug_green",
    "purity": "normal",
    "x": 2340.42,
    "y": 2763.93,
    "z": 22600.861328125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal8_4",
    "type": "slug_green",
    "purity": "normal",
    "x": 2483,
    "y": 2834.07,
    "z": 24675.572265625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal4_0",
    "type": "slug_green",
    "purity": "normal",
    "x": 2138.01,
    "y": 3016.43,
    "z": 21871.2734375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal6_2",
    "type": "slug_green",
    "purity": "normal",
    "x": 1927.53,
    "y": 1551.67,
    "z": 10443.392578125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_25",
    "type": "slug_green",
    "purity": "normal",
    "x": 2762.46,
    "y": 2486.14,
    "z": 17381.369140625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_13",
    "type": "slug_green",
    "purity": "normal",
    "x": 2615.97,
    "y": 2541.98,
    "z": 13419.422851562,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal99",
    "type": "slug_green",
    "purity": "normal",
    "x": 2505.91,
    "y": 2652.01,
    "z": 19466.759765625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0A77401_1114044059",
    "type": "slug_green",
    "purity": "normal",
    "x": 2825.51,
    "y": 2886.93,
    "z": 21949,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0A67401_1901138878",
    "type": "slug_green",
    "purity": "normal",
    "x": 2829.59,
    "y": 2900.01,
    "z": 22600,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0A67401_2137612882",
    "type": "slug_green",
    "purity": "normal",
    "x": 2814.83,
    "y": 2875.22,
    "z": 22733,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0A67401_1962658879",
    "type": "slug_green",
    "purity": "normal",
    "x": 2803.94,
    "y": 2919.62,
    "z": 22345,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0A67401_2008955880",
    "type": "slug_green",
    "purity": "normal",
    "x": 2802.19,
    "y": 2901.64,
    "z": 22448,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F79955F01_1408102760",
    "type": "slug_green",
    "purity": "normal",
    "x": 1901.46,
    "y": 1175.37,
    "z": 8225.453125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F79CC6201_1521305575",
    "type": "slug_green",
    "purity": "normal",
    "x": 1889.15,
    "y": 1149.66,
    "z": 2636.7658691406,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_10",
    "type": "slug_green",
    "purity": "normal",
    "x": 2678.52,
    "y": 3759.6,
    "z": 2239.0798339844,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal3",
    "type": "slug_green",
    "purity": "normal",
    "x": 648.47,
    "y": 1535.21,
    "z": 4639.6401367188,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal23_26",
    "type": "slug_green",
    "purity": "normal",
    "x": 171.2,
    "y": 2246.77,
    "z": 710.83898925781,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal11_7",
    "type": "slug_green",
    "purity": "normal",
    "x": 2698.73,
    "y": 2366.14,
    "z": 13644.541992188,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal7_5",
    "type": "slug_green",
    "purity": "normal",
    "x": 2641.09,
    "y": 2277.26,
    "z": 19807.615234375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal13_13",
    "type": "slug_green",
    "purity": "normal",
    "x": 2041.57,
    "y": 4250.77,
    "z": 1988.0001220703,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal14_14",
    "type": "slug_green",
    "purity": "normal",
    "x": 2042.17,
    "y": 4307.73,
    "z": -5811.1674804688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal7",
    "type": "slug_green",
    "purity": "normal",
    "x": 691.75,
    "y": 1637.89,
    "z": 4906.9379882812,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal14",
    "type": "slug_green",
    "purity": "normal",
    "x": 1253.2,
    "y": 1375.13,
    "z": 21128.541015625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal21",
    "type": "slug_green",
    "purity": "normal",
    "x": 1225.74,
    "y": 1363.9,
    "z": 9075.2666015625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal46",
    "type": "slug_green",
    "purity": "normal",
    "x": 1147.5,
    "y": 1347.13,
    "z": 18053.810546875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal11_15",
    "type": "slug_green",
    "purity": "normal",
    "x": 2148.78,
    "y": 1762.63,
    "z": 11560.880859375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal15_11",
    "type": "slug_green",
    "purity": "normal",
    "x": 2535.39,
    "y": 2387.02,
    "z": 13119.012695312,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal51",
    "type": "slug_green",
    "purity": "normal",
    "x": 2146.53,
    "y": 1903.64,
    "z": 16375.677734375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_0",
    "type": "slug_green",
    "purity": "normal",
    "x": 2114.7,
    "y": 2013.34,
    "z": 9390,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal62",
    "type": "slug_green",
    "purity": "normal",
    "x": 2210.77,
    "y": 1936.17,
    "z": 10442.334960938,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal4",
    "type": "slug_green",
    "purity": "normal",
    "x": 719.55,
    "y": 1403.35,
    "z": -1791.9129638672,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_16",
    "type": "slug_green",
    "purity": "normal",
    "x": 2345.99,
    "y": 1831.32,
    "z": 12243.345703125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_26",
    "type": "slug_green",
    "purity": "normal",
    "x": 2270.17,
    "y": 1746.89,
    "z": 16250.08984375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal1_1",
    "type": "slug_green",
    "purity": "normal",
    "x": 1127.13,
    "y": 3894.81,
    "z": -1543.5715332031,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal2_2",
    "type": "slug_green",
    "purity": "normal",
    "x": 2206.95,
    "y": 4443.79,
    "z": 1160.9963378906,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal15_15",
    "type": "slug_green",
    "purity": "normal",
    "x": 2133.66,
    "y": 4427.89,
    "z": 2358.4875488281,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal28_28",
    "type": "slug_green",
    "purity": "normal",
    "x": 1641.31,
    "y": 4298.13,
    "z": -3966.4895019531,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_18",
    "type": "slug_green",
    "purity": "normal",
    "x": 2403.05,
    "y": 2125.59,
    "z": 15536.594726562,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal19_8",
    "type": "slug_green",
    "purity": "normal",
    "x": 2435.72,
    "y": 2087.51,
    "z": 11987.225585938,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_19",
    "type": "slug_green",
    "purity": "normal",
    "x": 2384.06,
    "y": 2081.97,
    "z": 6328.1958007812,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal7_7",
    "type": "slug_green",
    "purity": "normal",
    "x": 2229.75,
    "y": 4334.23,
    "z": -5657.83203125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal67",
    "type": "slug_green",
    "purity": "normal",
    "x": 2640.17,
    "y": 2183.59,
    "z": 14106.416992188,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal5_4",
    "type": "slug_green",
    "purity": "normal",
    "x": 2522.4,
    "y": 2208.99,
    "z": 15948.525390625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal72",
    "type": "slug_green",
    "purity": "normal",
    "x": 2680.57,
    "y": 1887.07,
    "z": 15886.942382812,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal8",
    "type": "slug_green",
    "purity": "normal",
    "x": 579.8,
    "y": 1465.2,
    "z": 13809.399414062,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal12",
    "type": "slug_green",
    "purity": "normal",
    "x": 1097.27,
    "y": 1265.49,
    "z": 18189.853515625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_17",
    "type": "slug_green",
    "purity": "normal",
    "x": 2250.05,
    "y": 2222.78,
    "z": 13983.938476562,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F79CB6201_1168596395",
    "type": "slug_green",
    "purity": "normal",
    "x": 2067.18,
    "y": 1171.04,
    "z": -1422.2341308594,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F79386001_2015526406",
    "type": "slug_green",
    "purity": "normal",
    "x": 2023.52,
    "y": 1169,
    "z": 14133.40234375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_3",
    "type": "slug_green",
    "purity": "normal",
    "x": 1979.39,
    "y": 1077.31,
    "z": 3130.4526367188,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal17_14",
    "type": "slug_green",
    "purity": "normal",
    "x": 2107.97,
    "y": 2034.5,
    "z": 10830,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal13_9",
    "type": "slug_green",
    "purity": "normal",
    "x": 2188.47,
    "y": 2070.12,
    "z": 15100.353515625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal17_18",
    "type": "slug_green",
    "purity": "normal",
    "x": 2306.64,
    "y": 1934.59,
    "z": 18499.7734375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal70",
    "type": "slug_green",
    "purity": "normal",
    "x": 2259.65,
    "y": 1944.14,
    "z": 12499.297851562,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_23",
    "type": "slug_green",
    "purity": "normal",
    "x": 2414.03,
    "y": 2234.64,
    "z": 13521.953125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_20",
    "type": "slug_green",
    "purity": "normal",
    "x": 2523.86,
    "y": 2061.23,
    "z": 6283.3823242188,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_22",
    "type": "slug_green",
    "purity": "normal",
    "x": 2524.5,
    "y": 2094.98,
    "z": 9871.8505859375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_21",
    "type": "slug_green",
    "purity": "normal",
    "x": 2512.23,
    "y": 2151.17,
    "z": 9318.6474609375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal3_2",
    "type": "slug_green",
    "purity": "normal",
    "x": 2520.65,
    "y": 1963.88,
    "z": 12783.220703125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_15",
    "type": "slug_green",
    "purity": "normal",
    "x": 2622.56,
    "y": 2008.27,
    "z": 12584.9296875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_28",
    "type": "slug_green",
    "purity": "normal",
    "x": 2619.34,
    "y": 1789.48,
    "z": 10610.041992188,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F79066401_1370998836",
    "type": "slug_green",
    "purity": "normal",
    "x": 1708.39,
    "y": 1239.57,
    "z": -1138.5739746094,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal3_4",
    "type": "slug_green",
    "purity": "normal",
    "x": 970.93,
    "y": 3370.21,
    "z": 3782.4750976562,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal12_13",
    "type": "slug_green",
    "purity": "normal",
    "x": 1035.08,
    "y": 3002,
    "z": 2371.7478027344,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal34_2",
    "type": "slug_green",
    "purity": "normal",
    "x": 1090.96,
    "y": 3000.39,
    "z": 5015.2021484375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal6",
    "type": "slug_green",
    "purity": "normal",
    "x": 1254.56,
    "y": 1739.26,
    "z": 2834.9455566406,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal13_18",
    "type": "slug_green",
    "purity": "normal",
    "x": 1537.22,
    "y": 2345.52,
    "z": 17598.025390625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal8_9",
    "type": "slug_green",
    "purity": "normal",
    "x": 1583.69,
    "y": 2796.29,
    "z": 3570.42578125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal5_6",
    "type": "slug_green",
    "purity": "normal",
    "x": 1560.52,
    "y": 2859.92,
    "z": 3794.1896972656,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F0958101_1177712657",
    "type": "slug_green",
    "purity": "normal",
    "x": 1514.88,
    "y": 2620.6,
    "z": 20330,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal5_5126",
    "type": "slug_green",
    "purity": "normal",
    "x": 1764.77,
    "y": 2353.17,
    "z": 18939.73046875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F05A7301_2035634448",
    "type": "slug_green",
    "purity": "normal",
    "x": 1540.58,
    "y": 2560.55,
    "z": 22301,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0217201_2134786423",
    "type": "slug_green",
    "purity": "normal",
    "x": 1533.55,
    "y": 2554.14,
    "z": 21705,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0217201_1462011415",
    "type": "slug_green",
    "purity": "normal",
    "x": 1523.62,
    "y": 2551.24,
    "z": 22013,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F02B7201_1774057258",
    "type": "slug_green",
    "purity": "normal",
    "x": 1537.59,
    "y": 2537.53,
    "z": 20619,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0277201_2091967520",
    "type": "slug_green",
    "purity": "normal",
    "x": 1543.32,
    "y": 2546.09,
    "z": 23110,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0766701_1729573755",
    "type": "slug_green",
    "purity": "normal",
    "x": 2061.69,
    "y": 2343.24,
    "z": 14497,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0766701_1842097756",
    "type": "slug_green",
    "purity": "normal",
    "x": 2053.19,
    "y": 2352.1,
    "z": 16020,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0766701_1663177753",
    "type": "slug_green",
    "purity": "normal",
    "x": 2070.31,
    "y": 2340.85,
    "z": 15569,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0766701_1707460754",
    "type": "slug_green",
    "purity": "normal",
    "x": 2064.62,
    "y": 2352.67,
    "z": 14980,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0766701_1589843752",
    "type": "slug_green",
    "purity": "normal",
    "x": 2067.41,
    "y": 2353.13,
    "z": 16210,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal19_28",
    "type": "slug_green",
    "purity": "normal",
    "x": 1430.54,
    "y": 2959.57,
    "z": 13389.17578125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal9_10",
    "type": "slug_green",
    "purity": "normal",
    "x": 1518.66,
    "y": 2839.28,
    "z": 2483.9541015625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal24_24",
    "type": "slug_green",
    "purity": "normal",
    "x": 2188.91,
    "y": 3771.17,
    "z": -5231.451171875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal16_10",
    "type": "slug_green",
    "purity": "normal",
    "x": 1874.87,
    "y": 1814.09,
    "z": 2429.9458007812,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal6_14",
    "type": "slug_green",
    "purity": "normal",
    "x": 2041.13,
    "y": 2171.41,
    "z": 15741.612304688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal7_16",
    "type": "slug_green",
    "purity": "normal",
    "x": 1939.2,
    "y": 1968.29,
    "z": 784.26989746094,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal8_17",
    "type": "slug_green",
    "purity": "normal",
    "x": 1844.11,
    "y": 1965.48,
    "z": 18904.1875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal3_5",
    "type": "slug_green",
    "purity": "normal",
    "x": 1448.86,
    "y": 2206.08,
    "z": 3303.236328125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal2_2780",
    "type": "slug_green",
    "purity": "normal",
    "x": 1488.75,
    "y": 2247.12,
    "z": 15237.251953125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal9_8928",
    "type": "slug_green",
    "purity": "normal",
    "x": 2001.1,
    "y": 2144.13,
    "z": 15622.702148438,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal12_12002",
    "type": "slug_green",
    "purity": "normal",
    "x": 1736.75,
    "y": 2007.98,
    "z": 17318.951171875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal1_12",
    "type": "slug_green",
    "purity": "normal",
    "x": 1682.2,
    "y": 2178.32,
    "z": 16772.71875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal4_3771",
    "type": "slug_green",
    "purity": "normal",
    "x": 1677.82,
    "y": 2054.86,
    "z": 15571.041015625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal3_13",
    "type": "slug_green",
    "purity": "normal",
    "x": 1878.79,
    "y": 2246.5,
    "z": 18913.5859375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F792A8701_1662356113",
    "type": "slug_green",
    "purity": "normal",
    "x": 1766.46,
    "y": 1767.46,
    "z": 3360,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_5",
    "type": "slug_green",
    "purity": "normal",
    "x": 2083.58,
    "y": 1992.84,
    "z": 9999,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal15_8",
    "type": "slug_green",
    "purity": "normal",
    "x": 2078.58,
    "y": 1981.59,
    "z": 11183,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal16_11",
    "type": "slug_green",
    "purity": "normal",
    "x": 2093.84,
    "y": 2006.69,
    "z": 11090,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_1",
    "type": "slug_green",
    "purity": "normal",
    "x": 2016.62,
    "y": 1674.41,
    "z": 11088.021484375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal8_12",
    "type": "slug_green",
    "purity": "normal",
    "x": 1906.87,
    "y": 1715.42,
    "z": 7935.1181640625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_2",
    "type": "slug_green",
    "purity": "normal",
    "x": 2044.43,
    "y": 1391.36,
    "z": 720.505859375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal14_15",
    "type": "slug_green",
    "purity": "normal",
    "x": 984.55,
    "y": 3027.47,
    "z": 12265.813476562,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal35_5",
    "type": "slug_green",
    "purity": "normal",
    "x": 955.07,
    "y": 3006.99,
    "z": 17784.416015625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F79CC6201_1413653574",
    "type": "slug_green",
    "purity": "normal",
    "x": 1915.1,
    "y": 1345.36,
    "z": 1608.7658691406,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0C7AF01_1736399985",
    "type": "slug_green",
    "purity": "normal",
    "x": 1727.33,
    "y": 1469.61,
    "z": -195,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F79486401_1444694438",
    "type": "slug_green",
    "purity": "normal",
    "x": 2762.22,
    "y": 1488.53,
    "z": 3778,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F079AF01_2086299378",
    "type": "slug_green",
    "purity": "normal",
    "x": 2276.62,
    "y": 1485.18,
    "z": 3057,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal13",
    "type": "slug_green",
    "purity": "normal",
    "x": 1252.37,
    "y": 1268.69,
    "z": 15780.985351562,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal24",
    "type": "slug_green",
    "purity": "normal",
    "x": 1180.35,
    "y": 1325.91,
    "z": 10486.55859375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal47",
    "type": "slug_green",
    "purity": "normal",
    "x": 1253.66,
    "y": 1267.96,
    "z": 25884.150390625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal20_24",
    "type": "slug_green",
    "purity": "normal",
    "x": 2666.44,
    "y": 1651.44,
    "z": 7007.2885742188,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal2_3",
    "type": "slug_green",
    "purity": "normal",
    "x": 1163.58,
    "y": 3634.31,
    "z": 3607.4423828125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal63",
    "type": "slug_green",
    "purity": "normal",
    "x": 1250.49,
    "y": 3577.71,
    "z": 721.90179443359,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal3_1",
    "type": "slug_green",
    "purity": "normal",
    "x": 2222.7,
    "y": 1531.8,
    "z": 505.48522949219,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal10_3",
    "type": "slug_green",
    "purity": "normal",
    "x": 2145.22,
    "y": 1552.72,
    "z": 15899.30078125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal22_7",
    "type": "slug_green",
    "purity": "normal",
    "x": 2479.31,
    "y": 1657.83,
    "z": 13866.262695312,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F79F25F01_1763105083",
    "type": "slug_green",
    "purity": "normal",
    "x": 2583.82,
    "y": 1413.52,
    "z": 19365,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F79B36201_1122808154",
    "type": "slug_green",
    "purity": "normal",
    "x": 2530.95,
    "y": 1377.64,
    "z": -539,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F79F35F01_1129500264",
    "type": "slug_green",
    "purity": "normal",
    "x": 2556.91,
    "y": 1404,
    "z": 18594,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal17_UAID_40B076DF2F79875B01_2021256020",
    "type": "slug_green",
    "purity": "normal",
    "x": 2527.44,
    "y": 1409.23,
    "z": 2696.5471191406,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F79F25F01_2029785085",
    "type": "slug_green",
    "purity": "normal",
    "x": 2571.85,
    "y": 1451.45,
    "z": 16611,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_32",
    "type": "slug_green",
    "purity": "normal",
    "x": 2587.44,
    "y": 1446.1,
    "z": 4032.529296875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal8_10",
    "type": "slug_green",
    "purity": "normal",
    "x": 2584.54,
    "y": 1469.55,
    "z": 9753.73046875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0B3AF01_1789903464",
    "type": "slug_green",
    "purity": "normal",
    "x": 2603.61,
    "y": 1602.78,
    "z": 679,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F792F6001_1132971811",
    "type": "slug_green",
    "purity": "normal",
    "x": 2348.91,
    "y": 1415.25,
    "z": 13921.40234375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F79685201_1807114065",
    "type": "slug_green",
    "purity": "normal",
    "x": 2315.39,
    "y": 1374.83,
    "z": -1049.6092529297,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_27",
    "type": "slug_green",
    "purity": "normal",
    "x": 2210.93,
    "y": 1621.39,
    "z": 13971.37890625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal75",
    "type": "slug_green",
    "purity": "normal",
    "x": 2798.58,
    "y": 2377.65,
    "z": 15506.841796875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal6_5",
    "type": "slug_green",
    "purity": "normal",
    "x": 2793.73,
    "y": 2332.83,
    "z": 5884.416015625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_54",
    "type": "slug_green",
    "purity": "normal",
    "x": 2892.39,
    "y": 2343.5,
    "z": 10756.797851562,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F793A8701_1412502928",
    "type": "slug_green",
    "purity": "normal",
    "x": 2788.13,
    "y": 2268.01,
    "z": 7100,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal14_12",
    "type": "slug_green",
    "purity": "normal",
    "x": 2805.44,
    "y": 2232.98,
    "z": 10001.666015625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal44",
    "type": "slug_green",
    "purity": "normal",
    "x": 2357.1,
    "y": 3233.98,
    "z": -8772.74609375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk16",
    "type": "slug_green",
    "purity": "normal",
    "x": 2727.21,
    "y": 995.98,
    "z": 1743.9923095703,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F79285B01_1944304298",
    "type": "slug_green",
    "purity": "normal",
    "x": 2657.59,
    "y": 963.31,
    "z": -135.1766204834,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal34_21",
    "type": "slug_green",
    "purity": "normal",
    "x": 481.07,
    "y": 1633.13,
    "z": 8113.9809570312,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal28",
    "type": "slug_green",
    "purity": "normal",
    "x": 787.51,
    "y": 1194.39,
    "z": -1391.2119140625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal15_13",
    "type": "slug_green",
    "purity": "normal",
    "x": 2926.64,
    "y": 2185.44,
    "z": 8321.583984375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_56",
    "type": "slug_green",
    "purity": "normal",
    "x": 2840.51,
    "y": 2145.25,
    "z": 9023.916015625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal7_6",
    "type": "slug_green",
    "purity": "normal",
    "x": 2828.29,
    "y": 2068.67,
    "z": 15056.083984375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal9_8",
    "type": "slug_green",
    "purity": "normal",
    "x": 3021.68,
    "y": 2378.74,
    "z": 14242.173828125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal13_11",
    "type": "slug_green",
    "purity": "normal",
    "x": 3029.85,
    "y": 2319.37,
    "z": 9200.4267578125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal12_10",
    "type": "slug_green",
    "purity": "normal",
    "x": 2922.48,
    "y": 2400.78,
    "z": 16177.655273438,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal8_7",
    "type": "slug_green",
    "purity": "normal",
    "x": 2943.2,
    "y": 2305.69,
    "z": 11723.147460938,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_55",
    "type": "slug_green",
    "purity": "normal",
    "x": 2842.26,
    "y": 1910.02,
    "z": 14033.30078125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal11_13",
    "type": "slug_green",
    "purity": "normal",
    "x": 3064.51,
    "y": 2105.59,
    "z": 10234.984375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal14_16",
    "type": "slug_green",
    "purity": "normal",
    "x": 3219,
    "y": 2118.37,
    "z": 4905.3876953125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal13_15",
    "type": "slug_green",
    "purity": "normal",
    "x": 3376.97,
    "y": 2002.75,
    "z": 4147.1879882812,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal60",
    "type": "slug_green",
    "purity": "normal",
    "x": 2975.7,
    "y": 2093.34,
    "z": 8123.9233398438,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal12_14",
    "type": "slug_green",
    "purity": "normal",
    "x": 3360.96,
    "y": 2140.63,
    "z": 10519.624023438,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal10_12",
    "type": "slug_green",
    "purity": "normal",
    "x": 3049.71,
    "y": 1956,
    "z": 12307.630859375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal2_0",
    "type": "slug_green",
    "purity": "normal",
    "x": 3017,
    "y": 1865.61,
    "z": 4200.3935546875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal1_3",
    "type": "slug_green",
    "purity": "normal",
    "x": 3084.69,
    "y": 2191.94,
    "z": 7938.6982421875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0AE7301_1502060226",
    "type": "slug_green",
    "purity": "normal",
    "x": 3439.76,
    "y": 2417.38,
    "z": 16837,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0A67401_1113792877",
    "type": "slug_green",
    "purity": "normal",
    "x": 3430.75,
    "y": 2413.68,
    "z": 17360,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0A57401_2106808700",
    "type": "slug_green",
    "purity": "normal",
    "x": 3440.14,
    "y": 2427.64,
    "z": 16377,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal19_23",
    "type": "slug_green",
    "purity": "normal",
    "x": 262.37,
    "y": 2089.35,
    "z": -1267.3620605469,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal6_9",
    "type": "slug_green",
    "purity": "normal",
    "x": 632.38,
    "y": 2359.71,
    "z": -1908.8685302734,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal18_22",
    "type": "slug_green",
    "purity": "normal",
    "x": 635.63,
    "y": 2355.53,
    "z": 4775.8486328125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal26",
    "type": "slug_green",
    "purity": "normal",
    "x": 3046.5,
    "y": 4042.92,
    "z": -14229.362304688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal32",
    "type": "slug_green",
    "purity": "normal",
    "x": 1707.27,
    "y": 3634.3,
    "z": 786.83404541016,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0AF7401_1394094480",
    "type": "slug_green",
    "purity": "normal",
    "x": 3377.59,
    "y": 2766.5,
    "z": 21012,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0AA7401_1909401594",
    "type": "slug_green",
    "purity": "normal",
    "x": 3392.89,
    "y": 2742.91,
    "z": 23154,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0AA7401_1919713595",
    "type": "slug_green",
    "purity": "normal",
    "x": 3371.13,
    "y": 2754.74,
    "z": 21110,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0AA7401_2076003597",
    "type": "slug_green",
    "purity": "normal",
    "x": 3388.98,
    "y": 2749.04,
    "z": 20988,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0AF7401_1381809479",
    "type": "slug_green",
    "purity": "normal",
    "x": 3377.45,
    "y": 2738.33,
    "z": 20725,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_47",
    "type": "slug_green",
    "purity": "normal",
    "x": 3016.93,
    "y": 3105.31,
    "z": 14046.780273438,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_52",
    "type": "slug_green",
    "purity": "normal",
    "x": 3147.54,
    "y": 3032.14,
    "z": 13465,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_24",
    "type": "slug_green",
    "purity": "normal",
    "x": 2829.82,
    "y": 2494.85,
    "z": 19207.748046875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0A57401_2054736699",
    "type": "slug_green",
    "purity": "normal",
    "x": 3431.01,
    "y": 2443.89,
    "z": 16305,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0A57401_1817017698",
    "type": "slug_green",
    "purity": "normal",
    "x": 3420.1,
    "y": 2433.52,
    "z": 16640,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_51",
    "type": "slug_green",
    "purity": "normal",
    "x": 3372.98,
    "y": 3068.49,
    "z": 9224,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_4CEDFB3E2F7F8B9201_1243912814",
    "type": "slug_green",
    "purity": "normal",
    "x": 3324.29,
    "y": 3005.68,
    "z": -1155.7364501953,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_53",
    "type": "slug_green",
    "purity": "normal",
    "x": 3358.13,
    "y": 2987.05,
    "z": 4290,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0A87401_1376559241",
    "type": "slug_green",
    "purity": "normal",
    "x": 3093.93,
    "y": 2446.85,
    "z": 21396,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0A87401_1211555238",
    "type": "slug_green",
    "purity": "normal",
    "x": 3072.4,
    "y": 2454.57,
    "z": 21844,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0A87401_1178078237",
    "type": "slug_green",
    "purity": "normal",
    "x": 3073.13,
    "y": 2438.83,
    "z": 21781,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0A87401_1304279239",
    "type": "slug_green",
    "purity": "normal",
    "x": 3098.31,
    "y": 2443.98,
    "z": 21091,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0A77401_2134624060",
    "type": "slug_green",
    "purity": "normal",
    "x": 3094.03,
    "y": 2434.54,
    "z": 21217,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_4CEDFB3E2F7F8B9201_1239800812",
    "type": "slug_green",
    "purity": "normal",
    "x": 3285.23,
    "y": 3019.83,
    "z": 1260,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_4CEDFB3E2F7F8B9201_1242129813",
    "type": "slug_green",
    "purity": "normal",
    "x": 3235.44,
    "y": 3026.69,
    "z": 1760,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F79265B01_1210582944",
    "type": "slug_green",
    "purity": "normal",
    "x": 2381.74,
    "y": 899.89,
    "z": 1056.8233642578,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal19_19",
    "type": "slug_green",
    "purity": "normal",
    "x": 1989.89,
    "y": 3476.31,
    "z": 296.29693603516,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal18_18",
    "type": "slug_green",
    "purity": "normal",
    "x": 1785.06,
    "y": 3768.26,
    "z": 402.45672607422,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal25_25",
    "type": "slug_green",
    "purity": "normal",
    "x": 1927.62,
    "y": 3608.07,
    "z": 2545.9396972656,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal27_22",
    "type": "slug_green",
    "purity": "normal",
    "x": 1515.51,
    "y": 3147.74,
    "z": 12218.87890625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal37",
    "type": "slug_green",
    "purity": "normal",
    "x": 1898.32,
    "y": 3915.6,
    "z": -426.41427612305,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal17_17",
    "type": "slug_green",
    "purity": "normal",
    "x": 1511.61,
    "y": 3829.32,
    "z": 2836.0964355469,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal16_16",
    "type": "slug_green",
    "purity": "normal",
    "x": 1865.22,
    "y": 4021.2,
    "z": 277.98199462891,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal1_0",
    "type": "slug_green",
    "purity": "normal",
    "x": 1784.05,
    "y": 4060.1,
    "z": -2647.9162597656,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal23_23",
    "type": "slug_green",
    "purity": "normal",
    "x": 1422.27,
    "y": 3984.09,
    "z": 736.20288085938,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal35",
    "type": "slug_green",
    "purity": "normal",
    "x": 1550.83,
    "y": 4158.83,
    "z": -3181.3742675781,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal36",
    "type": "slug_green",
    "purity": "normal",
    "x": 2061.84,
    "y": 3952.92,
    "z": 232.74456787109,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal12_12",
    "type": "slug_green",
    "purity": "normal",
    "x": 1899.64,
    "y": 4333.31,
    "z": -2510.8469238281,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal27_27",
    "type": "slug_green",
    "purity": "normal",
    "x": 1799.26,
    "y": 4298.63,
    "z": -1451.7241210938,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal3_3",
    "type": "slug_green",
    "purity": "normal",
    "x": 1729.85,
    "y": 4281.22,
    "z": -3016.9799804688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal32_11",
    "type": "slug_green",
    "purity": "normal",
    "x": 1797.77,
    "y": 4382.71,
    "z": -1426.6380615234,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal26_26",
    "type": "slug_green",
    "purity": "normal",
    "x": 1694.27,
    "y": 4441.76,
    "z": -6331.5673828125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal34",
    "type": "slug_green",
    "purity": "normal",
    "x": 1582.61,
    "y": 4338.86,
    "z": -3049.3562011719,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal22_22",
    "type": "slug_green",
    "purity": "normal",
    "x": 1424.37,
    "y": 4241.41,
    "z": -6225.0708007812,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal31_7",
    "type": "slug_green",
    "purity": "normal",
    "x": 2076.73,
    "y": 4439.06,
    "z": -1779.2648925781,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal29_29",
    "type": "slug_green",
    "purity": "normal",
    "x": 1999.21,
    "y": 3924.55,
    "z": -3446.3796386719,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_12",
    "type": "slug_green",
    "purity": "normal",
    "x": 2452.93,
    "y": 3573.46,
    "z": -1568.4289550781,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal4_3",
    "type": "slug_green",
    "purity": "normal",
    "x": 2749.72,
    "y": 3411.4,
    "z": 10776.342773438,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal4_5",
    "type": "slug_green",
    "purity": "normal",
    "x": 961.8,
    "y": 3216.33,
    "z": 11441.104492188,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0439B01_1646991632",
    "type": "slug_green",
    "purity": "normal",
    "x": 872.25,
    "y": 1972.48,
    "z": 1088,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal12_43",
    "type": "slug_green",
    "purity": "normal",
    "x": 2473.79,
    "y": 3337.63,
    "z": 13982.475585938,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F79738301_1767542746",
    "type": "slug_green",
    "purity": "normal",
    "x": 2135.69,
    "y": 3479.93,
    "z": -7030,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal3_234",
    "type": "slug_green",
    "purity": "normal",
    "x": 2158.82,
    "y": 3284.53,
    "z": 23006.326171875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal13_44",
    "type": "slug_green",
    "purity": "normal",
    "x": 2521.27,
    "y": 3221.37,
    "z": 11439.095703125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F796C8301_1303426504",
    "type": "slug_green",
    "purity": "normal",
    "x": 2309.26,
    "y": 3626.29,
    "z": -11810,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal20_20",
    "type": "slug_green",
    "purity": "normal",
    "x": 2412.35,
    "y": 3455.18,
    "z": -7061.4389648438,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_2",
    "type": "slug_green",
    "purity": "normal",
    "x": 2134.83,
    "y": 1093.21,
    "z": -1383.1389160156,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_4",
    "type": "slug_green",
    "purity": "normal",
    "x": 2219.57,
    "y": 1167.92,
    "z": 798.76586914062,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal11_10",
    "type": "slug_green",
    "purity": "normal",
    "x": 2259.23,
    "y": 4027.41,
    "z": 7249.8115234375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_5",
    "type": "slug_green",
    "purity": "normal",
    "x": 2332.95,
    "y": 3940.06,
    "z": -2490.8435058594,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_6",
    "type": "slug_green",
    "purity": "normal",
    "x": 2393.79,
    "y": 3932.17,
    "z": -5369.78125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal14_13",
    "type": "slug_green",
    "purity": "normal",
    "x": 2466.16,
    "y": 4006.03,
    "z": 1279.4749755859,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal3_15",
    "type": "slug_green",
    "purity": "normal",
    "x": 2574.92,
    "y": 3938.22,
    "z": -1128.7318115234,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal13_12",
    "type": "slug_green",
    "purity": "normal",
    "x": 2451.87,
    "y": 4179.1,
    "z": -116.95880126953,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal86",
    "type": "slug_green",
    "purity": "normal",
    "x": 2193.28,
    "y": 3808.08,
    "z": 906.55029296875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_11",
    "type": "slug_green",
    "purity": "normal",
    "x": 2554.64,
    "y": 3762.77,
    "z": 3287.8073730469,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal21_21",
    "type": "slug_green",
    "purity": "normal",
    "x": 2313.17,
    "y": 4323.48,
    "z": 2791.6135253906,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal9_9",
    "type": "slug_green",
    "purity": "normal",
    "x": 2249.64,
    "y": 4329.08,
    "z": -5643.6884765625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal10_10",
    "type": "slug_green",
    "purity": "normal",
    "x": 2239.82,
    "y": 4326.44,
    "z": -5485.8310546875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal8_8",
    "type": "slug_green",
    "purity": "normal",
    "x": 2241.95,
    "y": 4335.94,
    "z": -5037.3388671875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_7",
    "type": "slug_green",
    "purity": "normal",
    "x": 2671.69,
    "y": 4011.03,
    "z": 4363.7084960938,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_8",
    "type": "slug_green",
    "purity": "normal",
    "x": 2751.9,
    "y": 3842.34,
    "z": 717.35748291016,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal4_4",
    "type": "slug_green",
    "purity": "normal",
    "x": 2235.88,
    "y": 4445.02,
    "z": 3545.1318359375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal5_5",
    "type": "slug_green",
    "purity": "normal",
    "x": 2257.11,
    "y": 4345.31,
    "z": -5275.73046875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal6_6",
    "type": "slug_green",
    "purity": "normal",
    "x": 2240.32,
    "y": 4347.79,
    "z": -5134.7666015625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal12_11",
    "type": "slug_green",
    "purity": "normal",
    "x": 2292.09,
    "y": 4141.38,
    "z": 3313.3979492188,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal21_86",
    "type": "slug_green",
    "purity": "normal",
    "x": 3544.73,
    "y": 2497,
    "z": -1131.4499511719,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal39",
    "type": "slug_green",
    "purity": "normal",
    "x": 883.27,
    "y": 1395.09,
    "z": -2998.4216308594,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal8_77",
    "type": "slug_green",
    "purity": "normal",
    "x": 3727.96,
    "y": 2829.25,
    "z": -1668.7697753906,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal9_78",
    "type": "slug_green",
    "purity": "normal",
    "x": 3754.87,
    "y": 2961.9,
    "z": -1654.9918212891,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_79",
    "type": "slug_green",
    "purity": "normal",
    "x": 3742.33,
    "y": 2900.87,
    "z": -1667.0402832031,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal11_80",
    "type": "slug_green",
    "purity": "normal",
    "x": 3808.07,
    "y": 2957.03,
    "z": -1707.5673828125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_78",
    "type": "slug_green",
    "purity": "normal",
    "x": 3540.5,
    "y": 3022.8,
    "z": -889.46020507812,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal14_83",
    "type": "slug_green",
    "purity": "normal",
    "x": 3586.96,
    "y": 3065.4,
    "z": 390.95962524414,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_76",
    "type": "slug_green",
    "purity": "normal",
    "x": 3619.69,
    "y": 3043.54,
    "z": -595.37109375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal12_81",
    "type": "slug_green",
    "purity": "normal",
    "x": 3628.41,
    "y": 3063.77,
    "z": -558.10736083984,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal83",
    "type": "slug_green",
    "purity": "normal",
    "x": 3662.26,
    "y": 3009.88,
    "z": -704.56195068359,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal77",
    "type": "slug_green",
    "purity": "normal",
    "x": 3622.13,
    "y": 2992.64,
    "z": -1287.9693603516,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_77",
    "type": "slug_green",
    "purity": "normal",
    "x": 3678.36,
    "y": 3076.24,
    "z": -927.00592041016,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal10_79",
    "type": "slug_green",
    "purity": "normal",
    "x": 3680.41,
    "y": 2900.52,
    "z": -1641.4636230469,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal1_87",
    "type": "slug_green",
    "purity": "normal",
    "x": 3692.8,
    "y": 2960.32,
    "z": -1674.5791015625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal17",
    "type": "slug_green",
    "purity": "normal",
    "x": 2476.84,
    "y": 1173.92,
    "z": 913.60302734375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal19",
    "type": "slug_green",
    "purity": "normal",
    "x": 1388.42,
    "y": 1428.13,
    "z": 896.99298095703,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal4_73",
    "type": "slug_green",
    "purity": "normal",
    "x": 3580.27,
    "y": 2952.74,
    "z": -1664.8247070312,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal24_0",
    "type": "slug_green",
    "purity": "normal",
    "x": 938.6,
    "y": 2603.61,
    "z": 5582.6708984375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal6_76",
    "type": "slug_green",
    "purity": "normal",
    "x": 3800.61,
    "y": 2820.33,
    "z": -1349.9429931641,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal7_75",
    "type": "slug_green",
    "purity": "normal",
    "x": 3806.37,
    "y": 2730.2,
    "z": -1285.2376708984,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal16",
    "type": "slug_green",
    "purity": "normal",
    "x": 3762.45,
    "y": 3030.3,
    "z": -475.45895385742,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal19_20",
    "type": "slug_green",
    "purity": "normal",
    "x": 3556.77,
    "y": 2121.44,
    "z": 19244.8046875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal15_17",
    "type": "slug_green",
    "purity": "normal",
    "x": 3575.9,
    "y": 2103.26,
    "z": 19267.078125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_81",
    "type": "slug_green",
    "purity": "normal",
    "x": 3585.26,
    "y": 2093.91,
    "z": 20010.029296875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal18_19",
    "type": "slug_green",
    "purity": "normal",
    "x": 3553.05,
    "y": 2108.24,
    "z": 20899.201171875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_80",
    "type": "slug_green",
    "purity": "normal",
    "x": 3571.77,
    "y": 2121.47,
    "z": 19434.259765625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal118",
    "type": "slug_green",
    "purity": "normal",
    "x": 4079.02,
    "y": 1911.55,
    "z": 8995.7861328125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal94_8",
    "type": "slug_green",
    "purity": "normal",
    "x": 3901.78,
    "y": 1949.92,
    "z": 7029.1025390625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_90",
    "type": "slug_green",
    "purity": "normal",
    "x": 3884.8,
    "y": 1764.53,
    "z": 5797.5107421875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F007B101_1510242320",
    "type": "slug_green",
    "purity": "normal",
    "x": 3783.89,
    "y": 2073.37,
    "z": 6945,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_87",
    "type": "slug_green",
    "purity": "normal",
    "x": 3571.86,
    "y": 2357.16,
    "z": 6361.8212890625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_86",
    "type": "slug_green",
    "purity": "normal",
    "x": 3564.5,
    "y": 2307.45,
    "z": 1371.4263916016,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_89",
    "type": "slug_green",
    "purity": "normal",
    "x": 3536.12,
    "y": 2409.96,
    "z": 4165.0737304688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_82",
    "type": "slug_green",
    "purity": "normal",
    "x": 3564.41,
    "y": 2321.74,
    "z": 7598.6904296875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_88",
    "type": "slug_green",
    "purity": "normal",
    "x": 3522.8,
    "y": 2334.57,
    "z": 54.506042480469,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_85",
    "type": "slug_green",
    "purity": "normal",
    "x": 3544.77,
    "y": 2358.75,
    "z": 2469.1987304688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk33_31",
    "type": "slug_green",
    "purity": "normal",
    "x": 3556.8,
    "y": 2275.78,
    "z": 4346.181640625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_83",
    "type": "slug_green",
    "purity": "normal",
    "x": 3545.94,
    "y": 2290.53,
    "z": 8330.7041015625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_57",
    "type": "slug_green",
    "purity": "normal",
    "x": 3512.56,
    "y": 2200.38,
    "z": 4890.4296875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_84",
    "type": "slug_green",
    "purity": "normal",
    "x": 3529.33,
    "y": 2223.55,
    "z": 2516.8054199219,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal33",
    "type": "slug_green",
    "purity": "normal",
    "x": 984.31,
    "y": 1543.54,
    "z": 5312.5698242188,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal29",
    "type": "slug_green",
    "purity": "normal",
    "x": 878.51,
    "y": 1515.55,
    "z": 3606.2199707031,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal38",
    "type": "slug_green",
    "purity": "normal",
    "x": 912.26,
    "y": 1542.07,
    "z": -1236.2874755859,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal32_7",
    "type": "slug_green",
    "purity": "normal",
    "x": 947.73,
    "y": 1496.34,
    "z": 2007.3623046875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal42",
    "type": "slug_green",
    "purity": "normal",
    "x": 961.86,
    "y": 1591.67,
    "z": -1722.7019042969,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal3_19",
    "type": "slug_green",
    "purity": "normal",
    "x": 722.54,
    "y": 3245.13,
    "z": -689.42340087891,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal30_30",
    "type": "slug_green",
    "purity": "normal",
    "x": 1461.23,
    "y": 3049.98,
    "z": 13173.229492188,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal24_25",
    "type": "slug_green",
    "purity": "normal",
    "x": 1379.93,
    "y": 2931.04,
    "z": 13399.857421875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal22_27",
    "type": "slug_green",
    "purity": "normal",
    "x": 1408.19,
    "y": 2939.07,
    "z": 13003.23046875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal21_26",
    "type": "slug_green",
    "purity": "normal",
    "x": 1386.27,
    "y": 2958.44,
    "z": 14657.619140625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal20_29",
    "type": "slug_green",
    "purity": "normal",
    "x": 1401.59,
    "y": 2979.44,
    "z": 14877.124023438,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal28_23",
    "type": "slug_green",
    "purity": "normal",
    "x": 1333.24,
    "y": 3059.18,
    "z": 7208.0991210938,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal29_24",
    "type": "slug_green",
    "purity": "normal",
    "x": 1258.52,
    "y": 2976.57,
    "z": 8200.4296875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal1_2",
    "type": "slug_green",
    "purity": "normal",
    "x": 758.7,
    "y": 2783.09,
    "z": 10394.93359375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal7_10",
    "type": "slug_green",
    "purity": "normal",
    "x": 792.56,
    "y": 2315.92,
    "z": 12254.884765625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal10_13",
    "type": "slug_green",
    "purity": "normal",
    "x": 861.49,
    "y": 2576.76,
    "z": 11901.970703125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F09E6901_1553651856",
    "type": "slug_green",
    "purity": "normal",
    "x": 519.44,
    "y": 2830.48,
    "z": 977,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal1_17",
    "type": "slug_green",
    "purity": "normal",
    "x": 661.27,
    "y": 2864.52,
    "z": 1661.9324951172,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal33_9",
    "type": "slug_green",
    "purity": "normal",
    "x": 1391.48,
    "y": 4086.04,
    "z": -4679.3452148438,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal22_25",
    "type": "slug_green",
    "purity": "normal",
    "x": 408.55,
    "y": 2387.06,
    "z": 511.79766845703,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal21_24",
    "type": "slug_green",
    "purity": "normal",
    "x": 585.09,
    "y": 2241.46,
    "z": -1621.8070068359,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal20_21",
    "type": "slug_green",
    "purity": "normal",
    "x": 341.57,
    "y": 2070.05,
    "z": 3103.3347167969,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal2_6",
    "type": "slug_green",
    "purity": "normal",
    "x": 339.28,
    "y": 1873.9,
    "z": -840.84539794922,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal5_8",
    "type": "slug_green",
    "purity": "normal",
    "x": 408.22,
    "y": 1998.26,
    "z": -1639.2873535156,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal10",
    "type": "slug_green",
    "purity": "normal",
    "x": 424.09,
    "y": 1479.51,
    "z": 991.58020019531,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal41",
    "type": "slug_green",
    "purity": "normal",
    "x": 379.05,
    "y": 1562.51,
    "z": 6370.2626953125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal2",
    "type": "slug_green",
    "purity": "normal",
    "x": 418.92,
    "y": 1218.79,
    "z": -890.09698486328,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal9",
    "type": "slug_green",
    "purity": "normal",
    "x": 581.98,
    "y": 1256.77,
    "z": -136.94245910645,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal7_8",
    "type": "slug_green",
    "purity": "normal",
    "x": 1305.05,
    "y": 3279.65,
    "z": 7809.8720703125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal25_21",
    "type": "slug_green",
    "purity": "normal",
    "x": 1405.38,
    "y": 3481.58,
    "z": 6218.9013671875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal57_0",
    "type": "slug_green",
    "purity": "normal",
    "x": 1319.59,
    "y": 3407.66,
    "z": 5168.3984375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal6_7",
    "type": "slug_green",
    "purity": "normal",
    "x": 1125.93,
    "y": 3156.79,
    "z": 13744.422851562,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal31",
    "type": "slug_green",
    "purity": "normal",
    "x": 1088.37,
    "y": 3117.02,
    "z": 9840.0224609375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal26_32",
    "type": "slug_green",
    "purity": "normal",
    "x": 1233.43,
    "y": 3364.09,
    "z": 9832.525390625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal15_16",
    "type": "slug_green",
    "purity": "normal",
    "x": 1056.61,
    "y": 3738.49,
    "z": 2318.0920410156,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal4_7",
    "type": "slug_green",
    "purity": "normal",
    "x": 738.85,
    "y": 2037.46,
    "z": 78.113960266113,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal12_15",
    "type": "slug_green",
    "purity": "normal",
    "x": 980.73,
    "y": 2201.13,
    "z": -1751.6202392578,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal14_17",
    "type": "slug_green",
    "purity": "normal",
    "x": 1247.53,
    "y": 2151.56,
    "z": 8182.55859375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal11_14",
    "type": "slug_green",
    "purity": "normal",
    "x": 1150.22,
    "y": 2228.27,
    "z": 2863.6362304688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal16_19",
    "type": "slug_green",
    "purity": "normal",
    "x": 1311.62,
    "y": 1940.54,
    "z": 2464.6591796875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal17_20",
    "type": "slug_green",
    "purity": "normal",
    "x": 1332.98,
    "y": 2019.07,
    "z": 1736.126953125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal40",
    "type": "slug_green",
    "purity": "normal",
    "x": 1170.09,
    "y": 1803.68,
    "z": 1976.4743652344,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal8_11",
    "type": "slug_green",
    "purity": "normal",
    "x": 1005.92,
    "y": 1971.03,
    "z": 4678.64453125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal13_16",
    "type": "slug_green",
    "purity": "normal",
    "x": 1067.01,
    "y": 2401.07,
    "z": 6184.7202148438,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal5",
    "type": "slug_green",
    "purity": "normal",
    "x": 872.83,
    "y": 1854.14,
    "z": -290.72894287109,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal31_6",
    "type": "slug_green",
    "purity": "normal",
    "x": 1061.77,
    "y": 1516.78,
    "z": 3963.7983398438,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal43",
    "type": "slug_green",
    "purity": "normal",
    "x": 1166.74,
    "y": 1526.05,
    "z": 7390.65625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal11",
    "type": "slug_green",
    "purity": "normal",
    "x": 895,
    "y": 1189.45,
    "z": 5527.1069335938,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal27",
    "type": "slug_green",
    "purity": "normal",
    "x": 1095.87,
    "y": 1406.33,
    "z": 14626.838867188,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal45",
    "type": "slug_green",
    "purity": "normal",
    "x": 1385.83,
    "y": 1332.93,
    "z": 5764.51171875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal30",
    "type": "slug_green",
    "purity": "normal",
    "x": 860.27,
    "y": 1567.84,
    "z": 2677.5073242188,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal1",
    "type": "slug_green",
    "purity": "normal",
    "x": 751.17,
    "y": 1560.81,
    "z": 3107.1645507812,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal15",
    "type": "slug_green",
    "purity": "normal",
    "x": 770.9,
    "y": 1490.32,
    "z": 10257.61328125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal37_24",
    "type": "slug_green",
    "purity": "normal",
    "x": 846.49,
    "y": 1525.53,
    "z": 1994.2559814453,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal36_23",
    "type": "slug_green",
    "purity": "normal",
    "x": 1423.42,
    "y": 1556.49,
    "z": -528.73168945312,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal25",
    "type": "slug_green",
    "purity": "normal",
    "x": 1414.96,
    "y": 1505.28,
    "z": 3780.0930175781,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal14_20",
    "type": "slug_green",
    "purity": "normal",
    "x": 3333.7,
    "y": 3995.06,
    "z": -3270.1279296875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal27_18",
    "type": "slug_green",
    "purity": "normal",
    "x": 3042.96,
    "y": 4148.57,
    "z": -10341.48828125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal24_16",
    "type": "slug_green",
    "purity": "normal",
    "x": 2998.55,
    "y": 4077.61,
    "z": -10840.666015625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal1_6",
    "type": "slug_green",
    "purity": "normal",
    "x": 2912.33,
    "y": 3831.61,
    "z": -5054.6625976562,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_9",
    "type": "slug_green",
    "purity": "normal",
    "x": 2791.13,
    "y": 3772.49,
    "z": 6766.4340820312,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal2_7",
    "type": "slug_green",
    "purity": "normal",
    "x": 3424.9,
    "y": 3832.28,
    "z": 3491.1284179688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal22",
    "type": "slug_green",
    "purity": "normal",
    "x": 2808.55,
    "y": 4032.09,
    "z": -3912.8518066406,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal9_14",
    "type": "slug_green",
    "purity": "normal",
    "x": 2864.07,
    "y": 4048.98,
    "z": -2223.5197753906,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal25_17",
    "type": "slug_green",
    "purity": "normal",
    "x": 3067.86,
    "y": 4151.58,
    "z": -16827.201171875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal23_15",
    "type": "slug_green",
    "purity": "normal",
    "x": 3100.3,
    "y": 4086.05,
    "z": -11460.329101562,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal7_12",
    "type": "slug_green",
    "purity": "normal",
    "x": 3071.98,
    "y": 3861.82,
    "z": -8365.3212890625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal6_11",
    "type": "slug_green",
    "purity": "normal",
    "x": 3295.52,
    "y": 3791.55,
    "z": -7903.7724609375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal16_22",
    "type": "slug_green",
    "purity": "normal",
    "x": 3273.87,
    "y": 3851.92,
    "z": -3605.7238769531,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal15_21",
    "type": "slug_green",
    "purity": "normal",
    "x": 3264.24,
    "y": 3705.36,
    "z": -2581.2756347656,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_68",
    "type": "slug_green",
    "purity": "normal",
    "x": 3580.98,
    "y": 3775.95,
    "z": 12650,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F06C5C01_1356614339",
    "type": "slug_green",
    "purity": "normal",
    "x": 3626.04,
    "y": 3237.15,
    "z": 5147,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal13_82",
    "type": "slug_green",
    "purity": "normal",
    "x": 3654.21,
    "y": 3157.07,
    "z": 1474.2866210938,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_75",
    "type": "slug_green",
    "purity": "normal",
    "x": 3706.44,
    "y": 3124.07,
    "z": 3983.298828125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F05D5D01_2007016764",
    "type": "slug_green",
    "purity": "normal",
    "x": 3686.42,
    "y": 3205.68,
    "z": 5556,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F05E5D01_1095164941",
    "type": "slug_green",
    "purity": "normal",
    "x": 3684.36,
    "y": 3224.07,
    "z": 8098,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal15_84",
    "type": "slug_green",
    "purity": "normal",
    "x": 3753.43,
    "y": 3138.4,
    "z": 893.248046875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0AE5D01_1835696000",
    "type": "slug_green",
    "purity": "normal",
    "x": 3382.88,
    "y": 3591.61,
    "z": 9245,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal17_15",
    "type": "slug_green",
    "purity": "normal",
    "x": 3366.06,
    "y": 3760.21,
    "z": -2922.4892578125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal4_9",
    "type": "slug_green",
    "purity": "normal",
    "x": 3458.13,
    "y": 3786.34,
    "z": -1886.0355224609,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal21_19",
    "type": "slug_green",
    "purity": "normal",
    "x": 3354.57,
    "y": 3710.26,
    "z": -1657.2208251953,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal20_18",
    "type": "slug_green",
    "purity": "normal",
    "x": 3351.77,
    "y": 3738.84,
    "z": -4237.234375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_35",
    "type": "slug_green",
    "purity": "normal",
    "x": 3395.5,
    "y": 3725.72,
    "z": -2015.0460205078,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal19_17",
    "type": "slug_green",
    "purity": "normal",
    "x": 3382.69,
    "y": 3698.91,
    "z": -4264.900390625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_39",
    "type": "slug_green",
    "purity": "normal",
    "x": 3401.3,
    "y": 3241.1,
    "z": 14296,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0675D01_1725830534",
    "type": "slug_green",
    "purity": "normal",
    "x": 3593.25,
    "y": 3254.88,
    "z": 10739,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_8",
    "type": "slug_green",
    "purity": "normal",
    "x": 3639.19,
    "y": 3372.91,
    "z": -2001,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_74",
    "type": "slug_green",
    "purity": "normal",
    "x": 3634.16,
    "y": 3360.41,
    "z": 9040,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal3_14",
    "type": "slug_green",
    "purity": "normal",
    "x": 2839.71,
    "y": 3324.46,
    "z": 10567.384765625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal5_15",
    "type": "slug_green",
    "purity": "normal",
    "x": 2995.28,
    "y": 3280.99,
    "z": 10145.360351562,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal38_2",
    "type": "slug_green",
    "purity": "normal",
    "x": 3280.99,
    "y": 3145.7,
    "z": 6007,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal13_19",
    "type": "slug_green",
    "purity": "normal",
    "x": 3010.06,
    "y": 3587.17,
    "z": 2336.8952636719,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal11_20",
    "type": "slug_green",
    "purity": "normal",
    "x": 3006.56,
    "y": 3532.79,
    "z": 6756.451171875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal5_10",
    "type": "slug_green",
    "purity": "normal",
    "x": 3076.62,
    "y": 3575.08,
    "z": -4670.5961914062,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal8_13",
    "type": "slug_green",
    "purity": "normal",
    "x": 3176.64,
    "y": 3599.75,
    "z": 236.88774108887,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_43",
    "type": "slug_green",
    "purity": "normal",
    "x": 3267.94,
    "y": 3437.08,
    "z": 9845,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0655D01_1109507179",
    "type": "slug_green",
    "purity": "normal",
    "x": 3233.35,
    "y": 3451.88,
    "z": 8072,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal11_16",
    "type": "slug_green",
    "purity": "normal",
    "x": 2929.26,
    "y": 3681.1,
    "z": -5252.8828125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal12_17",
    "type": "slug_green",
    "purity": "normal",
    "x": 3043.64,
    "y": 3664.64,
    "z": -2330.818359375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_34",
    "type": "slug_green",
    "purity": "normal",
    "x": 2984.74,
    "y": 3401.45,
    "z": 11009.131835938,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal4_6",
    "type": "slug_green",
    "purity": "normal",
    "x": 2851.41,
    "y": 1661.94,
    "z": -686.11437988281,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk45",
    "type": "slug_green",
    "purity": "normal",
    "x": 2932.28,
    "y": 1526.43,
    "z": 1624.9549560547,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0BF5D01_1402621031",
    "type": "slug_green",
    "purity": "normal",
    "x": 3015.8,
    "y": 1535,
    "z": 15763,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F79226201_1519973634",
    "type": "slug_green",
    "purity": "normal",
    "x": 3037.72,
    "y": 1530.43,
    "z": 2044.6541748047,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk45_UAID_40B076DF2F798F6001_1203275705",
    "type": "slug_green",
    "purity": "normal",
    "x": 3007.15,
    "y": 1559.23,
    "z": 397.95495605469,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk45_UAID_40B076DF2F79106201_1437870469",
    "type": "slug_green",
    "purity": "normal",
    "x": 2998.78,
    "y": 1499.37,
    "z": 498.95495605469,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal111_3",
    "type": "slug_green",
    "purity": "normal",
    "x": 3022.64,
    "y": 1574.04,
    "z": 12648,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0795B01_1115579560",
    "type": "slug_green",
    "purity": "normal",
    "x": 2995.77,
    "y": 1542.45,
    "z": 2062,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk45_UAID_40B076DF2F790D6301_1205856025",
    "type": "slug_green",
    "purity": "normal",
    "x": 2847.08,
    "y": 1498.82,
    "z": -1428.0450439453,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F79F35F01_1502667268",
    "type": "slug_green",
    "purity": "normal",
    "x": 2778.54,
    "y": 1489.14,
    "z": 21179.59765625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0EC5F01_1293213040",
    "type": "slug_green",
    "purity": "normal",
    "x": 3333.97,
    "y": 1666.12,
    "z": 10608,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F07B6001_2100568184",
    "type": "slug_green",
    "purity": "normal",
    "x": 3365.51,
    "y": 1658.49,
    "z": 17418,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0316001_1179996182",
    "type": "slug_green",
    "purity": "normal",
    "x": 3235.16,
    "y": 1634.66,
    "z": 15386,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0EA5F01_1564806683",
    "type": "slug_green",
    "purity": "normal",
    "x": 3212.87,
    "y": 1658.53,
    "z": 9353,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0815B01_1784184985",
    "type": "slug_green",
    "purity": "normal",
    "x": 3052.33,
    "y": 1513.93,
    "z": 6667,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_61",
    "type": "slug_green",
    "purity": "normal",
    "x": 3080.68,
    "y": 1522.98,
    "z": 2754.654296875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0F45F01_1549163457",
    "type": "slug_green",
    "purity": "normal",
    "x": 3135.6,
    "y": 1494.71,
    "z": 18421.966796875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0775B01_1580171202",
    "type": "slug_green",
    "purity": "normal",
    "x": 2902.47,
    "y": 1369.78,
    "z": 521,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F792F6001_1856291813",
    "type": "slug_green",
    "purity": "normal",
    "x": 2781.22,
    "y": 1340.08,
    "z": 18656,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0795B01_1706418562",
    "type": "slug_green",
    "purity": "normal",
    "x": 2899.86,
    "y": 1468.35,
    "z": 4514,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F79306001_1695738994",
    "type": "slug_green",
    "purity": "normal",
    "x": 2804.92,
    "y": 1446.71,
    "z": 15840,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk46",
    "type": "slug_green",
    "purity": "normal",
    "x": 2889.57,
    "y": 1437.25,
    "z": -339.59686279297,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal17_UAID_40B076DF2F79175C01_2025354360",
    "type": "slug_green",
    "purity": "normal",
    "x": 2779.06,
    "y": 1405.06,
    "z": 2321.5471191406,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal89",
    "type": "slug_green",
    "purity": "normal",
    "x": 3724.17,
    "y": 1163.95,
    "z": 1536.1064453125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F02C6001_1557408281",
    "type": "slug_green",
    "purity": "normal",
    "x": 3639.95,
    "y": 1135.07,
    "z": 14370,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal84",
    "type": "slug_green",
    "purity": "normal",
    "x": 3936.38,
    "y": 1523.74,
    "z": 4396.9936523438,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal113",
    "type": "slug_green",
    "purity": "normal",
    "x": 4041.49,
    "y": 1479.74,
    "z": 3937.1115722656,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal79",
    "type": "slug_green",
    "purity": "normal",
    "x": 3980.37,
    "y": 1401.57,
    "z": 4244.916015625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal98_9",
    "type": "slug_green",
    "purity": "normal",
    "x": 3643.73,
    "y": 1218.22,
    "z": 1372.5130615234,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal68",
    "type": "slug_green",
    "purity": "normal",
    "x": 3626.1,
    "y": 1321.41,
    "z": 4903.712890625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0AA5201_1287975681",
    "type": "slug_green",
    "purity": "normal",
    "x": 3460.54,
    "y": 1254,
    "z": 23570,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0AB5201_1104409861",
    "type": "slug_green",
    "purity": "normal",
    "x": 3464.61,
    "y": 1246.14,
    "z": 24109,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0E85F01_1421899313",
    "type": "slug_green",
    "purity": "normal",
    "x": 3497.11,
    "y": 1272.43,
    "z": 26734,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F03B5B01_1299814658",
    "type": "slug_green",
    "purity": "normal",
    "x": 3536.73,
    "y": 1178.75,
    "z": 23403,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal48",
    "type": "slug_green",
    "purity": "normal",
    "x": 3842.9,
    "y": 1136.25,
    "z": 1602.1171875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal129",
    "type": "slug_green",
    "purity": "normal",
    "x": 3773.56,
    "y": 428.86,
    "z": 6774.1396484375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal141",
    "type": "slug_green",
    "purity": "normal",
    "x": 3771.93,
    "y": 989.84,
    "z": 1931.4821777344,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_92",
    "type": "slug_green",
    "purity": "normal",
    "x": 3820.62,
    "y": 816.13,
    "z": 1279.0703125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal119",
    "type": "slug_green",
    "purity": "normal",
    "x": 3789.22,
    "y": 899.12,
    "z": 2538.7607421875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal115",
    "type": "slug_green",
    "purity": "normal",
    "x": 3740.31,
    "y": 917.85,
    "z": 3417.0786132812,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal114",
    "type": "slug_green",
    "purity": "normal",
    "x": 4010.57,
    "y": 909.24,
    "z": 4069.2338867188,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_94",
    "type": "slug_green",
    "purity": "normal",
    "x": 3606,
    "y": 491.95,
    "z": 16625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0E85F01_1933315318",
    "type": "slug_green",
    "purity": "normal",
    "x": 3676.75,
    "y": 644.12,
    "z": 24722,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_91",
    "type": "slug_green",
    "purity": "normal",
    "x": 3882.23,
    "y": 808.75,
    "z": 7161.7514648438,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0F25F01_1725349098",
    "type": "slug_green",
    "purity": "normal",
    "x": 3523.43,
    "y": 999.08,
    "z": 23533,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F02C6001_1622416282",
    "type": "slug_green",
    "purity": "normal",
    "x": 3556.27,
    "y": 958,
    "z": 16946,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_93",
    "type": "slug_green",
    "purity": "normal",
    "x": 3996.33,
    "y": 655.27,
    "z": 8503.90625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk24_11",
    "type": "slug_green",
    "purity": "normal",
    "x": 3670.92,
    "y": 1011.18,
    "z": 5126.0268554688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal14_8",
    "type": "slug_green",
    "purity": "normal",
    "x": 4239.36,
    "y": 2320.74,
    "z": 410.8971862793,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal74",
    "type": "slug_green",
    "purity": "normal",
    "x": 4254.83,
    "y": 1965.35,
    "z": 5641.2993164062,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal80",
    "type": "slug_green",
    "purity": "normal",
    "x": 4406.66,
    "y": 1857.72,
    "z": 5910.1655273438,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal117",
    "type": "slug_green",
    "purity": "normal",
    "x": 4167.74,
    "y": 1869.9,
    "z": 8790.7919921875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal127",
    "type": "slug_green",
    "purity": "normal",
    "x": 4236.61,
    "y": 1767.65,
    "z": 10724.021484375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal133_1",
    "type": "slug_green",
    "purity": "normal",
    "x": 4259.9,
    "y": 1813.57,
    "z": 7744.4184570312,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal59",
    "type": "slug_green",
    "purity": "normal",
    "x": 4239.28,
    "y": 1749.42,
    "z": 6358.4653320312,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk45_UAID_40B076DF2F79646201_1982914249",
    "type": "slug_green",
    "purity": "normal",
    "x": 3004.23,
    "y": 1207.08,
    "z": 675.95495605469,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0805B01_1369679802",
    "type": "slug_green",
    "purity": "normal",
    "x": 2987.48,
    "y": 1285.21,
    "z": 1902,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal93",
    "type": "slug_green",
    "purity": "normal",
    "x": 3009.42,
    "y": 1278.52,
    "z": 5565,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal78",
    "type": "slug_green",
    "purity": "normal",
    "x": 4331.77,
    "y": 1952.28,
    "z": 5739.177734375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_96",
    "type": "slug_green",
    "purity": "normal",
    "x": 4202.19,
    "y": 2179.92,
    "z": 5785.5424804688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal15_10",
    "type": "slug_green",
    "purity": "normal",
    "x": 4401.71,
    "y": 2353.87,
    "z": -1221.0155029297,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal156",
    "type": "slug_green",
    "purity": "normal",
    "x": 4582.54,
    "y": 1750.82,
    "z": 6611.8266601562,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal13_UAID_40B076DF2F79AD9B01_1733787293",
    "type": "slug_green",
    "purity": "normal",
    "x": 4378.59,
    "y": 2093.66,
    "z": 1560.5609130859,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal135",
    "type": "slug_green",
    "purity": "normal",
    "x": 4325.89,
    "y": 2140.81,
    "z": 7148.39453125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal13_6",
    "type": "slug_green",
    "purity": "normal",
    "x": 4437.57,
    "y": 2063.62,
    "z": 990.56097412109,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal147",
    "type": "slug_green",
    "purity": "normal",
    "x": 4578.16,
    "y": 1888.82,
    "z": 6712.67578125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal13_UAID_40B076DF2F79AC9B01_1616270112",
    "type": "slug_green",
    "purity": "normal",
    "x": 4552.86,
    "y": 1921.34,
    "z": 2670.5610351562,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal155",
    "type": "slug_green",
    "purity": "normal",
    "x": 4796.15,
    "y": 1709.5,
    "z": 5637.259765625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal76",
    "type": "slug_green",
    "purity": "normal",
    "x": 4049.76,
    "y": 1663.22,
    "z": 2752.6105957031,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal81",
    "type": "slug_green",
    "purity": "normal",
    "x": 4161.58,
    "y": 1275.07,
    "z": 3582.6455078125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_99",
    "type": "slug_green",
    "purity": "normal",
    "x": 4288.14,
    "y": 1244.92,
    "z": 4238.4506835938,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal125",
    "type": "slug_green",
    "purity": "normal",
    "x": 3017.45,
    "y": 1391.38,
    "z": 4005,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk45_UAID_40B076DF2F79106201_1550891470",
    "type": "slug_green",
    "purity": "normal",
    "x": 3009.69,
    "y": 1442.38,
    "z": 135.95495605469,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F04C5E01_2099362813",
    "type": "slug_green",
    "purity": "normal",
    "x": 3011.82,
    "y": 1467.11,
    "z": 16610,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0825B01_1553698166",
    "type": "slug_green",
    "purity": "normal",
    "x": 2930.11,
    "y": 1397.05,
    "z": 3668,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal91",
    "type": "slug_green",
    "purity": "normal",
    "x": 4400.96,
    "y": 1446.38,
    "z": 4132.5161132812,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal58",
    "type": "slug_green",
    "purity": "normal",
    "x": 4541.08,
    "y": 1633.51,
    "z": 4867.345703125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal53",
    "type": "slug_green",
    "purity": "normal",
    "x": 4590.07,
    "y": 1098.94,
    "z": 4050.9765625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal50",
    "type": "slug_green",
    "purity": "normal",
    "x": 4503.18,
    "y": 1131,
    "z": 4452.5034179688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal82",
    "type": "slug_green",
    "purity": "normal",
    "x": 4469.85,
    "y": 1100.35,
    "z": 4461.8989257812,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal49",
    "type": "slug_green",
    "purity": "normal",
    "x": 4431.12,
    "y": 1228.02,
    "z": 4548.23046875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_98",
    "type": "slug_green",
    "purity": "normal",
    "x": 4360.5,
    "y": 1714.01,
    "z": 7559.1372070312,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal148",
    "type": "slug_green",
    "purity": "normal",
    "x": 4599.33,
    "y": 1563.86,
    "z": 4929.6889648438,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_97",
    "type": "slug_green",
    "purity": "normal",
    "x": 4687.91,
    "y": 1558.03,
    "z": 4787.1997070312,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal151",
    "type": "slug_green",
    "purity": "normal",
    "x": 4725.04,
    "y": 1605.77,
    "z": 6067.259765625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal152",
    "type": "slug_green",
    "purity": "normal",
    "x": 4819.08,
    "y": 1604.59,
    "z": 5891.259765625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal61",
    "type": "slug_green",
    "purity": "normal",
    "x": 4660.01,
    "y": 1047.98,
    "z": 4357.33984375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal87",
    "type": "slug_green",
    "purity": "normal",
    "x": 4567.69,
    "y": 942.07,
    "z": 4618.6987304688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal90",
    "type": "slug_green",
    "purity": "normal",
    "x": 4282.63,
    "y": 960.55,
    "z": 3620.9899902344,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal55",
    "type": "slug_green",
    "purity": "normal",
    "x": 4525.52,
    "y": 1060.74,
    "z": 4586.0239257812,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F03B5B01_1622325660",
    "type": "slug_green",
    "purity": "normal",
    "x": 3149.52,
    "y": 1251.81,
    "z": 10405,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_58",
    "type": "slug_green",
    "purity": "normal",
    "x": 3087.02,
    "y": 1289.63,
    "z": 3505,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk45_UAID_40B076DF2F79236201_1250559816",
    "type": "slug_green",
    "purity": "normal",
    "x": 3114.17,
    "y": 1203.33,
    "z": -1554.0450439453,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0825B01_1706644167",
    "type": "slug_green",
    "purity": "normal",
    "x": 3131.41,
    "y": 1253.6,
    "z": 1906,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal126",
    "type": "slug_green",
    "purity": "normal",
    "x": 3127.41,
    "y": 1161,
    "z": 2340,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk45_UAID_40B076DF2F79626201_1797282896",
    "type": "slug_green",
    "purity": "normal",
    "x": 3174.78,
    "y": 1126.49,
    "z": -1132.0450439453,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F79D38101_2011951550",
    "type": "slug_green",
    "purity": "normal",
    "x": 4311.1,
    "y": 547.66,
    "z": -878.40167236328,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal20",
    "type": "slug_green",
    "purity": "normal",
    "x": 1475.23,
    "y": 1692.71,
    "z": 252.93231201172,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_2",
    "type": "slug_green",
    "purity": "normal",
    "x": 1849.54,
    "y": 1331.3,
    "z": 2661.658203125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F790A6401_1480408547",
    "type": "slug_green",
    "purity": "normal",
    "x": 1900.47,
    "y": 1232.51,
    "z": 2914.7658691406,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_29",
    "type": "slug_green",
    "purity": "normal",
    "x": 2482.04,
    "y": 1281.61,
    "z": 812.72808837891,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal17_UAID_40B076DF2F79755B01_1333072849",
    "type": "slug_green",
    "purity": "normal",
    "x": 2388.38,
    "y": 1306.73,
    "z": 972.54724121094,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F79B36201_1823459155",
    "type": "slug_green",
    "purity": "normal",
    "x": 2433.45,
    "y": 1290,
    "z": -1191,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F79F76301_1288406181",
    "type": "slug_green",
    "purity": "normal",
    "x": 2227.93,
    "y": 1031.51,
    "z": -908.27691650391,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_40B076DF2F79006401_1101274773",
    "type": "slug_green",
    "purity": "normal",
    "x": 2110.42,
    "y": 977.98,
    "z": -1773.1389160156,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_60",
    "type": "slug_green",
    "purity": "normal",
    "x": 2352.22,
    "y": 1081.65,
    "z": -1756.0439453125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F79275B01_1177099121",
    "type": "slug_green",
    "purity": "normal",
    "x": 2301.97,
    "y": 839.46,
    "z": 1810.7230224609,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk45_UAID_40B076DF2F79B26201_1806151977",
    "type": "slug_green",
    "purity": "normal",
    "x": 2681.23,
    "y": 1262.2,
    "z": -1283.7886962891,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F799E5F01_1400742291",
    "type": "slug_green",
    "purity": "normal",
    "x": 2722.47,
    "y": 1165.62,
    "z": -595,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk17_UAID_40B076DF2F79036301_1202643250",
    "type": "slug_green",
    "purity": "normal",
    "x": 2695.1,
    "y": 1095.67,
    "z": -1212.7723388672,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk17",
    "type": "slug_green",
    "purity": "normal",
    "x": 2754.44,
    "y": 1090.5,
    "z": -1329.7723388672,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F79355B01_1612365590",
    "type": "slug_green",
    "purity": "normal",
    "x": 2775.28,
    "y": 1093.19,
    "z": 1053.8233642578,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F79A75901_1341271538",
    "type": "slug_green",
    "purity": "normal",
    "x": 2395.47,
    "y": 1030.08,
    "z": -1701.1766357422,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F79B46201_1396705333",
    "type": "slug_green",
    "purity": "normal",
    "x": 2389.1,
    "y": 959.24,
    "z": -785,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_31",
    "type": "slug_green",
    "purity": "normal",
    "x": 2384.5,
    "y": 1411.75,
    "z": 1598.8790283203,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F792E6001_1313258633",
    "type": "slug_green",
    "purity": "normal",
    "x": 2402.22,
    "y": 1415.18,
    "z": 18702.40234375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_30",
    "type": "slug_green",
    "purity": "normal",
    "x": 2373,
    "y": 1377.88,
    "z": -1163.9345703125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F792E6001_2033315634",
    "type": "slug_green",
    "purity": "normal",
    "x": 2477.23,
    "y": 1368.9,
    "z": 21354.40234375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal9_11",
    "type": "slug_green",
    "purity": "normal",
    "x": 2432.73,
    "y": 1456.52,
    "z": 6092.7758789062,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal17_UAID_40B076DF2F79845B01_1828836491",
    "type": "slug_green",
    "purity": "normal",
    "x": 2468.32,
    "y": 1366.55,
    "z": 1673.5472412109,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F792D6001_1825806456",
    "type": "slug_green",
    "purity": "normal",
    "x": 2476.19,
    "y": 1477.89,
    "z": 14990.40234375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal146",
    "type": "slug_green",
    "purity": "normal",
    "x": 4653.43,
    "y": 1656.28,
    "z": 5814.2578125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal150",
    "type": "slug_green",
    "purity": "normal",
    "x": 4575.65,
    "y": 1692.45,
    "z": 8665.259765625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal97",
    "type": "slug_green",
    "purity": "normal",
    "x": 4590.72,
    "y": 1429.28,
    "z": 7239.6440429688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal54",
    "type": "slug_green",
    "purity": "normal",
    "x": 4678.11,
    "y": 1256.23,
    "z": 5812.2583007812,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F006B101_2082315136",
    "type": "slug_green",
    "purity": "normal",
    "x": 3582.65,
    "y": 1783.77,
    "z": 8812,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F007B101_1247933313",
    "type": "slug_green",
    "purity": "normal",
    "x": 3652.79,
    "y": 1883.82,
    "z": 1440,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F007B101_1436486318",
    "type": "slug_green",
    "purity": "normal",
    "x": 3640.07,
    "y": 1978.86,
    "z": 10489,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0355B01_2005222588",
    "type": "slug_green",
    "purity": "normal",
    "x": 3522.41,
    "y": 895.46,
    "z": 24584,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0F35F01_1247028277",
    "type": "slug_green",
    "purity": "normal",
    "x": 3522.35,
    "y": 834.16,
    "z": 16103,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal149",
    "type": "slug_green",
    "purity": "normal",
    "x": 4496.04,
    "y": 1851.79,
    "z": 8058.1484375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_101",
    "type": "slug_green",
    "purity": "normal",
    "x": 4701.74,
    "y": 609.56,
    "z": 2016.8859863281,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal17_UAID_40B076DF2F79F76301_1463908182",
    "type": "slug_green",
    "purity": "normal",
    "x": 2582.55,
    "y": 1074.57,
    "z": 1912.5472412109,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal52",
    "type": "slug_green",
    "purity": "normal",
    "x": 4705.6,
    "y": 1106.46,
    "z": 5197.337890625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal10_10171",
    "type": "slug_green",
    "purity": "normal",
    "x": 2131.33,
    "y": 2211.12,
    "z": 16426.92578125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal154",
    "type": "slug_green",
    "purity": "normal",
    "x": 4869.62,
    "y": 1506.71,
    "z": 7051.259765625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal153",
    "type": "slug_green",
    "purity": "normal",
    "x": 4835.5,
    "y": 1537.39,
    "z": 4978.259765625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_38",
    "type": "slug_green",
    "purity": "normal",
    "x": 3364.62,
    "y": 3338.76,
    "z": 11567,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F06E5D01_1646682771",
    "type": "slug_green",
    "purity": "normal",
    "x": 3370.94,
    "y": 3493.91,
    "z": 8525,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal73",
    "type": "slug_green",
    "purity": "normal",
    "x": 4048.87,
    "y": 2203.32,
    "z": 6246.0961914062,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0245C01_1792102668",
    "type": "slug_green",
    "purity": "normal",
    "x": 3473.67,
    "y": 753.62,
    "z": 947,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0375B01_1529908943",
    "type": "slug_green",
    "purity": "normal",
    "x": 3508.26,
    "y": 722.46,
    "z": 6173,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0AC5201_1696194044",
    "type": "slug_green",
    "purity": "normal",
    "x": 3521.7,
    "y": 604.74,
    "z": 10054,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0E95F01_1231921499",
    "type": "slug_green",
    "purity": "normal",
    "x": 3570.46,
    "y": 608.17,
    "z": 30679,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_63",
    "type": "slug_green",
    "purity": "normal",
    "x": 3422.79,
    "y": 593.2,
    "z": 17916,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal132",
    "type": "slug_green",
    "purity": "normal",
    "x": 4074.57,
    "y": 573.93,
    "z": 4090.1069335938,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0605301_1273983749",
    "type": "slug_green",
    "purity": "normal",
    "x": 3220.68,
    "y": 758.9,
    "z": 1394,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_64",
    "type": "slug_green",
    "purity": "normal",
    "x": 3248.8,
    "y": 705.5,
    "z": 12110,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F05F5301_1878669572",
    "type": "slug_green",
    "purity": "normal",
    "x": 3227.74,
    "y": 607.88,
    "z": 16441,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal88",
    "type": "slug_green",
    "purity": "normal",
    "x": 3734.29,
    "y": 1247.1,
    "z": 1207.9210205078,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal121_2",
    "type": "slug_green",
    "purity": "normal",
    "x": 3282.45,
    "y": 892.39,
    "z": 5530,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal122_5",
    "type": "slug_green",
    "purity": "normal",
    "x": 3166.13,
    "y": 1010.21,
    "z": -569,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk45_UAID_40B076DF2F79C06101_1984578386",
    "type": "slug_green",
    "purity": "normal",
    "x": 2959.49,
    "y": 976.9,
    "z": -942.04504394531,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal10_15",
    "type": "slug_green",
    "purity": "normal",
    "x": 3186.75,
    "y": 4211.29,
    "z": -925.99035644531,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_59",
    "type": "slug_green",
    "purity": "normal",
    "x": 2911.04,
    "y": 1184.89,
    "z": -1322.0344238281,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F799E5F01_1682598293",
    "type": "slug_green",
    "purity": "normal",
    "x": 2803.36,
    "y": 1108.89,
    "z": 6984,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk45_UAID_40B076DF2F79C26101_1487303739",
    "type": "slug_green",
    "purity": "normal",
    "x": 2829.75,
    "y": 1109.22,
    "z": -1633.0450439453,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal17_UAID_40B076DF2F79F76301_1548250183",
    "type": "slug_green",
    "purity": "normal",
    "x": 2524.98,
    "y": 992.08,
    "z": -1363.4527587891,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk45_UAID_40B076DF2F79956001_1285061765",
    "type": "slug_green",
    "purity": "normal",
    "x": 2784.58,
    "y": 1319.82,
    "z": -798.04504394531,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk45_UAID_40B076DF2F79BB6101_1629973504",
    "type": "slug_green",
    "purity": "normal",
    "x": 2887.3,
    "y": 1304.2,
    "z": -964.04504394531,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0D45B01_1751130579",
    "type": "slug_green",
    "purity": "normal",
    "x": 2893.59,
    "y": 1292.15,
    "z": 4012,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk45_UAID_40B076DF2F79B26201_1656659976",
    "type": "slug_green",
    "purity": "normal",
    "x": 2608.25,
    "y": 1308.82,
    "z": -1388.0450439453,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F79A65901_1120267361",
    "type": "slug_green",
    "purity": "normal",
    "x": 2292.9,
    "y": 1035.02,
    "z": -1787.1766357422,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_33",
    "type": "slug_green",
    "purity": "normal",
    "x": 2339.58,
    "y": 980.55,
    "z": 1685.1961669922,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F79BB6201_1894786568",
    "type": "slug_green",
    "purity": "normal",
    "x": 2267.78,
    "y": 939.51,
    "z": -1129.2769775391,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F796D5201_1366229946",
    "type": "slug_green",
    "purity": "normal",
    "x": 2355.43,
    "y": 1303.07,
    "z": -1069.6092529297,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal17_UAID_40B076DF2F79755B01_1353668850",
    "type": "slug_green",
    "purity": "normal",
    "x": 2306,
    "y": 1267.33,
    "z": 2482.5471191406,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F79C66201_1961069510",
    "type": "slug_green",
    "purity": "normal",
    "x": 2273.73,
    "y": 1225.89,
    "z": -985.60919189453,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F79C66201_1113882509",
    "type": "slug_green",
    "purity": "normal",
    "x": 2260.71,
    "y": 1324,
    "z": -1197.6092529297,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F79C96201_2035056042",
    "type": "slug_green",
    "purity": "normal",
    "x": 2069.65,
    "y": 1296.59,
    "z": -1368.2341308594,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F79486001_1490105224",
    "type": "slug_green",
    "purity": "normal",
    "x": 2076.86,
    "y": 987.17,
    "z": 1635.7230224609,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F79496001_1424029408",
    "type": "slug_green",
    "purity": "normal",
    "x": 1727.07,
    "y": 1188.35,
    "z": 172.93194580078,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F79496001_1203214406",
    "type": "slug_green",
    "purity": "normal",
    "x": 1751.17,
    "y": 1106.47,
    "z": -1239.5473632812,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F798B5F01_1548531946",
    "type": "slug_green",
    "purity": "normal",
    "x": 1776.33,
    "y": 1149.14,
    "z": 357.45263671875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F79486001_1870504226",
    "type": "slug_green",
    "purity": "normal",
    "x": 1812.33,
    "y": 1061.79,
    "z": 2879.4526367188,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F79486001_1737515225",
    "type": "slug_green",
    "purity": "normal",
    "x": 1737.17,
    "y": 1047.51,
    "z": 3088.1240234375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_UAID_40B076DF2F79425901_1727560760",
    "type": "slug_green",
    "purity": "normal",
    "x": 1856.71,
    "y": 950.8,
    "z": 387.77954101562,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F79625301_1884959066",
    "type": "slug_green",
    "purity": "normal",
    "x": 1922.84,
    "y": 880.57,
    "z": 190.45263671875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F798B5F01_1501465945",
    "type": "slug_green",
    "purity": "normal",
    "x": 1842.24,
    "y": 856.82,
    "z": -399.54736328125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_UAID_40B076DF2F79065901_1178046200",
    "type": "slug_green",
    "purity": "normal",
    "x": 1881.61,
    "y": 843.19,
    "z": 1620.7550048828,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_UAID_40B076DF2F79BF5D01_1163546993",
    "type": "slug_green",
    "purity": "normal",
    "x": 1981.69,
    "y": 909.88,
    "z": -1518.1654052734,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_UAID_40B076DF2F79FD6301_2028775242",
    "type": "slug_green",
    "purity": "normal",
    "x": 2055.63,
    "y": 897.36,
    "z": -1476.1654052734,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk45_UAID_40B076DF2F79916001_1775397058",
    "type": "slug_green",
    "purity": "normal",
    "x": 2773.37,
    "y": 1446.86,
    "z": 69.954956054688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F79F35F01_1275724266",
    "type": "slug_green",
    "purity": "normal",
    "x": 2714.83,
    "y": 1425.09,
    "z": 20260,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk45_UAID_40B076DF2F79946001_1613712588",
    "type": "slug_green",
    "purity": "normal",
    "x": 2690.81,
    "y": 1354.66,
    "z": 15.954956054688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal9_12",
    "type": "slug_green",
    "purity": "normal",
    "x": 370.17,
    "y": 2557.91,
    "z": 26.374755859375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal18",
    "type": "slug_green",
    "purity": "normal",
    "x": 3693.31,
    "y": 3562.02,
    "z": 7624,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal30_3",
    "type": "slug_green",
    "purity": "normal",
    "x": 2083.12,
    "y": 4510.53,
    "z": -1881.1641845703,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal11_11",
    "type": "slug_green",
    "purity": "normal",
    "x": 1804.17,
    "y": 4493.3,
    "z": -6722.6235351562,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal3_8",
    "type": "slug_green",
    "purity": "normal",
    "x": 3543.99,
    "y": 3852.58,
    "z": 8445.4326171875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal23",
    "type": "slug_green",
    "purity": "normal",
    "x": 1464.6,
    "y": 1252.07,
    "z": -1760.2000732422,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal18_16",
    "type": "slug_green",
    "purity": "normal",
    "x": 2832.44,
    "y": 1750.42,
    "z": 18312.45703125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal2_21",
    "type": "slug_green",
    "purity": "normal",
    "x": 757.22,
    "y": 3421.33,
    "z": -579.32342529297,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_100",
    "type": "slug_green",
    "purity": "normal",
    "x": 4381.29,
    "y": 853.93,
    "z": 6805.6865234375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F0706801_1432001712",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3315.52,
    "y": 3252.1,
    "z": 10456,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F0785B01_1533531383",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3106.38,
    "y": 1374.08,
    "z": 2592,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk67",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3080.36,
    "y": 1380.26,
    "z": 7075,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk72_2",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3121.94,
    "y": 1394.07,
    "z": 8215,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F03A5B01_1502427478",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3402.06,
    "y": 1588.76,
    "z": 21262,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F06D5201_1177233968",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3187.01,
    "y": 1491.54,
    "z": 25630,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_31",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3487.81,
    "y": 1410.33,
    "z": 27278,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk75_5",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3218.97,
    "y": 1395.22,
    "z": 15800,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_33",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3389.48,
    "y": 1409.48,
    "z": 25400,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk74_4",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3204.05,
    "y": 1308.18,
    "z": 23,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F0855B01_1254483667",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3237.65,
    "y": 1076.29,
    "z": 2017,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk20_11",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3255.56,
    "y": 1124.39,
    "z": 20755,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk216_19",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2360.19,
    "y": 2465.56,
    "z": 22391.23046875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk213_17",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2195.81,
    "y": 2465.94,
    "z": 23476.080078125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk25_1",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1731.48,
    "y": 1637.58,
    "z": 3804.4028320312,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk21_27",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2630.54,
    "y": 2946.05,
    "z": 17283.0546875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk25_31",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2774.7,
    "y": 3006,
    "z": 13587.196289062,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F0E87A01_1547094844",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2671.16,
    "y": 2771.23,
    "z": 19581,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk25_14",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2316.49,
    "y": 2869.33,
    "z": 21881.208984375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk217",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2358.58,
    "y": 2868.42,
    "z": 3854.4750976562,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk214_18",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2216.22,
    "y": 2604.9,
    "z": 23335.716796875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk215_20",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2216.86,
    "y": 3029.44,
    "z": 21411.35546875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk25_26",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2602.16,
    "y": 2485.05,
    "z": 13496.383789062,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0B47301_1859830293",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2757.09,
    "y": 2593.15,
    "z": 17865,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_UAID_04421A9713F0EE7A01_1112899902",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2714.27,
    "y": 2646.93,
    "z": 21809,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0B47301_1731763291",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2661.08,
    "y": 2683.9,
    "z": 12092,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F0E87A01_1147893840",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2583.23,
    "y": 2575.78,
    "z": 19057,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk24_25",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2528.07,
    "y": 2591.81,
    "z": 13498.432617188,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_1",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1931.19,
    "y": 1114.05,
    "z": 3254.6674804688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk213_22",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1248.21,
    "y": 1356.73,
    "z": 37361.98828125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk25_2",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1194.9,
    "y": 1473.26,
    "z": 19247,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk22_23",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2367.52,
    "y": 2357.38,
    "z": 13456.196289062,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk27_6",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1554.39,
    "y": 4301.82,
    "z": -6500.0258789062,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_10",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2439.76,
    "y": 2038.82,
    "z": 9450.462890625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk24_3",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2123.14,
    "y": 4266.54,
    "z": 676.99810791016,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk21_5",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 505.44,
    "y": 1376.01,
    "z": 5078.0375976562,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk21_22",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2335.99,
    "y": 2181.99,
    "z": 18668.875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk7",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2045.38,
    "y": 1144.11,
    "z": 1834.3435058594,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk23_25",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1794.92,
    "y": 2650.42,
    "z": 21705.673828125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk28_2",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2332.48,
    "y": 2015.91,
    "z": 10156.739257812,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_12",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2741.09,
    "y": 1756.19,
    "z": 9698.123046875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk24",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2773.16,
    "y": 2129.04,
    "z": 8920.400390625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk23_24",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2130.51,
    "y": 2327.68,
    "z": 19436.115234375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_9",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2636.16,
    "y": 2149.49,
    "z": 9506.2001953125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk49_UAID_40B076DF2F79955F01_1622838761",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1763.09,
    "y": 1229.83,
    "z": 8660.16796875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk49",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1719.64,
    "y": 1327.51,
    "z": 10320.16796875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk6",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1795.86,
    "y": 1263.1,
    "z": 6443.4873046875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk23_1",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 918.65,
    "y": 2868.44,
    "z": 10871.2578125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk211_9",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1075.55,
    "y": 3105.4,
    "z": -206.93145751953,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk218",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1819.37,
    "y": 2867.38,
    "z": 24633.041015625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk26_81",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1733.55,
    "y": 2837.27,
    "z": 20748.669921875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk22_24",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1806.57,
    "y": 2493.16,
    "z": 23039.193359375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk21_11",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1609.72,
    "y": 2470.42,
    "z": 24093.203125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk210_0",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1887.41,
    "y": 3047.16,
    "z": 27301.111328125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk210_1",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1564.34,
    "y": 2622.97,
    "z": 20984.60546875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk23_20",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1626.35,
    "y": 2813.82,
    "z": 21569.576171875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk215_95",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1588.2,
    "y": 2984.77,
    "z": 20805.05078125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk220",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1747.87,
    "y": 2989.96,
    "z": 20370.423828125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk217_91",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1650.72,
    "y": 2903.31,
    "z": 20636.3046875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk216_106",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1763.01,
    "y": 2779.85,
    "z": 22058.39453125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk213_87",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1496.37,
    "y": 2672.39,
    "z": 21435.484375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk24_26",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2026.62,
    "y": 2544.68,
    "z": 25365.455078125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk25_19",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2023.43,
    "y": 2433.65,
    "z": 21601.818359375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk22_22",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1696.51,
    "y": 2397.93,
    "z": 23641.234375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk29_1",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2048.39,
    "y": 3088.72,
    "z": 20888.681640625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk24_23",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1464.02,
    "y": 2920.24,
    "z": 21511.91015625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_2",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1398.61,
    "y": 2113.34,
    "z": 13728.413085938,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk27_4",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1623.91,
    "y": 1848.64,
    "z": 1520.8980712891,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk22_7",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2059.7,
    "y": 2182.75,
    "z": 14203.12890625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk23_14",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1850.39,
    "y": 2112.86,
    "z": 16076.041992188,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F03E6501_1921080728",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1419.06,
    "y": 2250.94,
    "z": 24204,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk24_15",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1488.54,
    "y": 2042.1,
    "z": 13817.005859375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk26",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2041.42,
    "y": 1719.51,
    "z": 9019.66796875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk24_0",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2087.15,
    "y": 1502.44,
    "z": 12213.100585938,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk54",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1971.77,
    "y": 1339.94,
    "z": 9723.470703125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk26_4",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 886.93,
    "y": 3042.87,
    "z": 121.56372833252,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk48_2",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1793.14,
    "y": 1376.54,
    "z": 6041.6630859375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk23_11",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 719.08,
    "y": 3346.77,
    "z": -778.86944580078,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk214",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2734.56,
    "y": 1597.07,
    "z": 7882.8466796875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk81",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2768.35,
    "y": 1511.15,
    "z": 10085.359375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_13",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2577.57,
    "y": 1651.62,
    "z": 10574.090820312,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk22",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1202.5,
    "y": 1281.63,
    "z": -976.78161621094,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F06FA401_2035551894",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1200.93,
    "y": 3540.19,
    "z": 14338,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk211_48",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2466.51,
    "y": 1661.69,
    "z": 2307.9052734375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_15",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2635.78,
    "y": 1381.67,
    "z": 5002.5131835938,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk79",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2604.97,
    "y": 1425.29,
    "z": 7163.5913085938,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F79F35F01_1207047265",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2635.76,
    "y": 1430.58,
    "z": 17495,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk56",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2223.35,
    "y": 1371.03,
    "z": 4681.28125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk55",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2102.56,
    "y": 1395.32,
    "z": 6012.248046875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk60_UAID_40B076DF2F794D6401_1849768319",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2290.51,
    "y": 1359.49,
    "z": 4531.2529296875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk60_UAID_40B076DF2F79F35F01_1959731276",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2291.88,
    "y": 1406.56,
    "z": 14260.73828125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_14",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2331.8,
    "y": 1363.75,
    "z": 2813.2260742188,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk59",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2280.47,
    "y": 1465.3,
    "z": 12263.912109375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_27",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2861.72,
    "y": 2277.15,
    "z": 14088.1875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F09E7401_1282285465",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3173.03,
    "y": 2423.07,
    "z": 18890,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_40B076DF2F79AB5201_1083372854",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2715.34,
    "y": 950.63,
    "z": 437.66748046875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk21_23",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2921.52,
    "y": 2183.71,
    "z": 12305.359375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_28",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3094.98,
    "y": 2028.7,
    "z": 3153.6828613281,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk213_52",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3245.32,
    "y": 2099.45,
    "z": 10362.00390625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk29_37",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3355.46,
    "y": 1890.81,
    "z": 9177.44140625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_29",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3430.48,
    "y": 2116.13,
    "z": 8015.9956054688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk25",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3076.68,
    "y": 2253.2,
    "z": 14122.983398438,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk21_33",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3120.36,
    "y": 2205.73,
    "z": 4640.8432617188,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F0F87A01_1248874721",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3408.99,
    "y": 2317.41,
    "z": 13648,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk22_34",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3229.21,
    "y": 2264.09,
    "z": 9359.224609375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F0327B01_1576760848",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2937.36,
    "y": 2625.06,
    "z": 16708,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F0327B01_2054731851",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3027.97,
    "y": 2678.82,
    "z": 15565,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_UAID_04421A9713F0F77A01_1321147532",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3365.28,
    "y": 2674.33,
    "z": 2049,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F0E57A01_1590485297",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3366.96,
    "y": 2592.62,
    "z": 18596,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_23",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3444.39,
    "y": 2667.6,
    "z": -1451.2270507812,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F0F67A01_1684184353",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3271.85,
    "y": 2755.2,
    "z": 11812,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F0F37A01_1513905808",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3114.21,
    "y": 2798.74,
    "z": 17570,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk210",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1802.25,
    "y": 3641.95,
    "z": 1832.5125732422,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk211_85",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1120.28,
    "y": 2606.52,
    "z": 18193.84375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_9",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1128.71,
    "y": 2601.34,
    "z": 4123.7006835938,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk24_30",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3147.78,
    "y": 3072.42,
    "z": 17688.154296875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0B37301_2109802113",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2840.22,
    "y": 2801.37,
    "z": 22441,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk26_27",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2811.46,
    "y": 2436.28,
    "z": 12607.208984375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk26_26",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2831.89,
    "y": 2488.54,
    "z": 10628.08984375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_26",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3373.15,
    "y": 2948.25,
    "z": 9571,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_24",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3346.26,
    "y": 2937.44,
    "z": 16009,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0767801_1471881678",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3017.06,
    "y": 2466.49,
    "z": 17861,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F03F7B01_1398535141",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3060.81,
    "y": 2593.61,
    "z": 17075,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F0F37A01_1199794805",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3075.85,
    "y": 2684.11,
    "z": 11957,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F0E57A01_1469842296",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3196.6,
    "y": 2676.55,
    "z": 19268,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F0E67A01_1084770479",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3208.26,
    "y": 2614.68,
    "z": 18279,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0B57301_1300199470",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2933.68,
    "y": 2758.61,
    "z": 12359,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F0397B01_1952176084",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3117.02,
    "y": 2546.51,
    "z": 17435,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_UAID_04421A9713F0747801_1178299322",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3260.2,
    "y": 2470.34,
    "z": 21256,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_49",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3209.82,
    "y": 3019.39,
    "z": 12539,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_4CEDFB3E2F7F8B9201_1245751815",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3275.95,
    "y": 3052.84,
    "z": 1920,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_48",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3284.38,
    "y": 2913.95,
    "z": 12327,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F0EE7A01_1935774906",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2896.28,
    "y": 2578.58,
    "z": 21050,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_18",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2412.49,
    "y": 916.05,
    "z": -118.19750976562,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk14",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2479,
    "y": 902.34,
    "z": -517.99694824219,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_19",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2498.15,
    "y": 796.72,
    "z": 1702.5979003906,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_40B076DF2F79738301_1516430745",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1978.82,
    "y": 3425.96,
    "z": -6960,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk22_1",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1996.71,
    "y": 3727.26,
    "z": -921.794921875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk25_3",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1735.78,
    "y": 3321.34,
    "z": 14866.653320312,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk212_15",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1559.8,
    "y": 3293.9,
    "z": 6336.6357421875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk26_6",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1841.94,
    "y": 3121.56,
    "z": 22369.02734375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk29",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1791.51,
    "y": 4162.03,
    "z": -1964.3571777344,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk26_5",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1688.39,
    "y": 4376.77,
    "z": -3690.3576660156,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk211",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2081.48,
    "y": 4381.29,
    "z": 3348.228515625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_6",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2616.37,
    "y": 3634.32,
    "z": 12604.408203125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_7",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2514.02,
    "y": 3629.84,
    "z": 9668.572265625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F071A401_1739232248",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 971.56,
    "y": 3115.3,
    "z": 20888,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk212_9",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2184.99,
    "y": 3307.37,
    "z": 2106.4919433594,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk22_28",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2567.57,
    "y": 3153.31,
    "z": 12721.857421875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk27_33",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2392.04,
    "y": 3223.94,
    "z": 18144.36328125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk27_3",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2371.76,
    "y": 3182.63,
    "z": 25912.46875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_8",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2586.12,
    "y": 3399.4,
    "z": 6859.9755859375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_5",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2298.05,
    "y": 3775.63,
    "z": 18411.984375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk23_2",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2311.6,
    "y": 3711.07,
    "z": -7746.9584960938,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F79C96201_1094933041",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2225.69,
    "y": 1144.89,
    "z": -1151.2341308594,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F049B201_2036002976",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2583.39,
    "y": 3896.47,
    "z": 1668,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_7",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 577.63,
    "y": 2634.2,
    "z": -815.03918457031,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk21_0",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2232.99,
    "y": 4279.41,
    "z": -3765.0478515625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_3",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2366.53,
    "y": 4107.13,
    "z": -3493.0004882812,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F0F67A01_1837729354",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3556.24,
    "y": 2476.5,
    "z": 7236,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F0F67A01_1953261355",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3464.4,
    "y": 2596.77,
    "z": 10326,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_39",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3589.9,
    "y": 2575.98,
    "z": 30.511039733887,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_43",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3548.85,
    "y": 2680.85,
    "z": 307.57730102539,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk29_18",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 904.64,
    "y": 1364.37,
    "z": -506.25338745117,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk215",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 785.31,
    "y": 1219.92,
    "z": 7608.8935546875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk27_92",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3643.23,
    "y": 2763.78,
    "z": 443.39001464844,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk26_91",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3529.78,
    "y": 2991.49,
    "z": 4686.2978515625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk229",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3634.54,
    "y": 2933.67,
    "z": -1192.9157714844,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk47",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2373.98,
    "y": 1066.42,
    "z": -1763.5588378906,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F798E5F01_1854991497",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2408.86,
    "y": 1154.5,
    "z": -789,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk75_2",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3686.61,
    "y": 3385.98,
    "z": -5741,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_42",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3556.36,
    "y": 2891.78,
    "z": 1499.3280029297,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk226",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3829.69,
    "y": 2571.94,
    "z": -1204.5845947266,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk219",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1347.65,
    "y": 2685.86,
    "z": 19845.18359375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk24_89",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 4094.98,
    "y": 2583.82,
    "z": 5261.662109375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_41",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3744.96,
    "y": 3065.12,
    "z": 2368.9895019531,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk221",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3836.23,
    "y": 3022.27,
    "z": -1671.20703125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk228",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 4077.9,
    "y": 2751.84,
    "z": -1474.2644042969,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk224",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 4105.41,
    "y": 2705.2,
    "z": -930.74243164062,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F05F7801_1738752601",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3801.63,
    "y": 2415.65,
    "z": 9374,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk210_47",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3461.31,
    "y": 2035.5,
    "z": 4453.9213867188,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0607801_2027765785",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3679.76,
    "y": 2247.02,
    "z": 17205,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0607801_1667283784",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3819.57,
    "y": 2261.55,
    "z": 14055,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk212",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3447.71,
    "y": 2220.29,
    "z": 5780.171875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F063A401_1791316779",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1072.79,
    "y": 3393.19,
    "z": 12793,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk227",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3877.32,
    "y": 2399.4,
    "z": 5681.4599609375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk28_35",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3553.24,
    "y": 1953.29,
    "z": 3290.0681152344,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk29_22",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 4050.15,
    "y": 1987.1,
    "z": 7312.7065429688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0AE7301_1236769225",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3493.1,
    "y": 2338.35,
    "z": 12429,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0AE7301_1916140227",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3603.72,
    "y": 2296.85,
    "z": 18055,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F0F77A01_2016858540",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3539.21,
    "y": 2210.05,
    "z": 15264,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk22_88",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 4018.39,
    "y": 2420.67,
    "z": 10741.427734375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk29_84",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1217.04,
    "y": 2813.83,
    "z": 19467.55078125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk24_2",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1228.4,
    "y": 2912.2,
    "z": 11797.08984375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk25_27",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1132.05,
    "y": 2823.59,
    "z": 24059.484375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk21_21",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1048.45,
    "y": 2801.78,
    "z": 21913.396484375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk28_83",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 935.86,
    "y": 2702.78,
    "z": 22715.638671875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk29_19",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1032.1,
    "y": 2933.32,
    "z": 17682.416015625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F062A401_1920904598",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1182.12,
    "y": 3099.9,
    "z": 19152,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk27_82",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 815.74,
    "y": 2489.2,
    "z": 20376.408203125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk214_88",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1280.2,
    "y": 2468.27,
    "z": 22879.83203125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_5",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1228.95,
    "y": 2394.02,
    "z": 10426.9453125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk212_86",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1030.98,
    "y": 2497.76,
    "z": 20486.767578125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk21_3",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 398.41,
    "y": 2989.37,
    "z": -910.37445068359,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk28_7",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1349.88,
    "y": 3873.48,
    "z": -303.41311645508,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_4",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 612.85,
    "y": 2007.14,
    "z": 1110.4932861328,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_1",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 295.23,
    "y": 2301.17,
    "z": 2944.0109863281,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk216",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 254.74,
    "y": 1649.66,
    "z": 2345.5366210938,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk28",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 351.68,
    "y": 1216.35,
    "z": 2767.0737304688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk28_6",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1348.77,
    "y": 3153.74,
    "z": 7165.4135742188,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk27_5",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1141.94,
    "y": 3221.48,
    "z": 7960.0659179688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F071A401_1842127249",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1074.33,
    "y": 3202.15,
    "z": 20025,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk213",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1205.39,
    "y": 3464.71,
    "z": 4374.8564453125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk210_20",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1212.96,
    "y": 3733.35,
    "z": 2270.5205078125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk22_0",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1000.96,
    "y": 3699.68,
    "z": 6287.08203125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_3",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 751.3,
    "y": 2173.4,
    "z": 6656.3989257812,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_6",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 986.45,
    "y": 2032.47,
    "z": 1101.4508056641,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_8",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1135.41,
    "y": 2083.48,
    "z": 4752.837890625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk214_9",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1278.31,
    "y": 1608.31,
    "z": 6457.1064453125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk211_20",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1248.29,
    "y": 1187.42,
    "z": 6527.6767578125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk210_19",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 829.61,
    "y": 1672.92,
    "z": 1762.5112304688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk211_17",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2992.13,
    "y": 4073.77,
    "z": -2511.6396484375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk210_16",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2997.54,
    "y": 4120.35,
    "z": -7112.3251953125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk25_11",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3397.18,
    "y": 3888.51,
    "z": 4808.0493164062,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk213_19",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3180.85,
    "y": 4041.41,
    "z": -9409.650390625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk23_9",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3060.02,
    "y": 3951.62,
    "z": 875.99102783203,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk24_10",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3151.37,
    "y": 4246.74,
    "z": 9909.8427734375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_40",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3586.75,
    "y": 3161.9,
    "z": -587.46252441406,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F0595D01_1702343033",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3683.91,
    "y": 3225.41,
    "z": 3414,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F0635D01_1402584822",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3645.33,
    "y": 3241.93,
    "z": 10484,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk225",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3827.26,
    "y": 3231.44,
    "z": -1958.2740478516,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk25_90",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3774.35,
    "y": 3302.08,
    "z": 5734.6577148438,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk22_8",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3329.07,
    "y": 3572.22,
    "z": 13100.876953125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk93",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3329.1,
    "y": 3205.83,
    "z": 11552,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_25",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3324.34,
    "y": 3123.68,
    "z": 8096,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_40",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3388.04,
    "y": 3194.43,
    "z": 5404,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk76_2",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3555.47,
    "y": 3267.7,
    "z": 11668,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_73",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3661.74,
    "y": 3373.62,
    "z": 4723,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_70",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3631.7,
    "y": 3310.14,
    "z": 4015,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F05B5D01_1459628393",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3685.22,
    "y": 3266.4,
    "z": 7122,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk26_36",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2780.46,
    "y": 3246.52,
    "z": 10873.426757812,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_42",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3185.19,
    "y": 3253.69,
    "z": 7941,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal8_18",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3121.26,
    "y": 3334.52,
    "z": 16239.978515625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk28_34",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3058.91,
    "y": 3186.51,
    "z": 13407.155273438,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_50",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3261.73,
    "y": 3127.78,
    "z": 8701,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk212_18",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3110.67,
    "y": 3569.8,
    "z": 5205.3530273438,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk21_7",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3212.01,
    "y": 3596.16,
    "z": -3296.123046875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk28_14",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2950.94,
    "y": 3725.57,
    "z": -2799.9086914062,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk29_15",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3107.95,
    "y": 3761.71,
    "z": -5792.6928710938,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk23_29",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3040.92,
    "y": 3386.7,
    "z": 12902.702148438,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_34",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2962.67,
    "y": 1546.53,
    "z": 18490,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F0795B01_1357525561",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2993.76,
    "y": 1517.09,
    "z": 7521,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F0B65201_2137568813",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3296.63,
    "y": 1629.95,
    "z": 19620,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_30",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3112.85,
    "y": 1592.45,
    "z": 14001,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F0D25B01_1831343223",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3090.73,
    "y": 1523.33,
    "z": 15697,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F0815B01_1988173986",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3052.79,
    "y": 1549.72,
    "z": 8475,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F0D45B01_1937028581",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2902.7,
    "y": 1391.28,
    "z": 9345,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F0795B01_2008124563",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2881.04,
    "y": 1422.46,
    "z": 4122,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk82",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2819.05,
    "y": 1444.65,
    "z": 7812.2431640625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk70_3",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3598.11,
    "y": 1076.39,
    "z": 14660,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_45",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3594.87,
    "y": 1267.87,
    "z": 9165,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F0E85F01_1340931312",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3459.69,
    "y": 1198.93,
    "z": 26250,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk24_17",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3773.9,
    "y": 483.62,
    "z": 2506.4130859375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk21_8",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3790.61,
    "y": 1063.78,
    "z": 5473.5458984375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk211_24",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3744.32,
    "y": 687.2,
    "z": 6301.7866210938,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk210_23",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3833.65,
    "y": 697.72,
    "z": 1862.1190185547,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk21_13",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3844.08,
    "y": 662.63,
    "z": 9397.5986328125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F0E95F01_1115335496",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3782.72,
    "y": 680.65,
    "z": 26753,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk27_20",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3752.44,
    "y": 636.3,
    "z": 2786.7438964844,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk26_1",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3623.96,
    "y": 719.27,
    "z": 16643,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk27_2",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3638.49,
    "y": 853.16,
    "z": 11623,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F0E85F01_1744709315",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3593.12,
    "y": 1036.23,
    "z": 29564,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk25_18",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3927.24,
    "y": 452.41,
    "z": 1217.7619628906,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk28_21",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3921.46,
    "y": 698.61,
    "z": 6723.01171875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk230",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3973.28,
    "y": 716.93,
    "z": 12222.561523438,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk212_25",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3953.81,
    "y": 740.79,
    "z": 4230.1416015625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F0F35F01_1114488275",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3648.29,
    "y": 931.25,
    "z": 26282,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal138",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3685.67,
    "y": 1018.18,
    "z": 9364.21484375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk21_12",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 4327.94,
    "y": 2278.97,
    "z": 556.74133300781,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_12",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 4349.16,
    "y": 2233.9,
    "z": 6001.0908203125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk24_16",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 4148.96,
    "y": 2102.59,
    "z": 7096.330078125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk61",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2988.12,
    "y": 1319.71,
    "z": 8070,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk22_18",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 4451.55,
    "y": 1984.2,
    "z": 5861.3666992188,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_47",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 4458.54,
    "y": 1538.83,
    "z": 4534.8291015625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F0AA5201_1338657684",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3445.88,
    "y": 1250.83,
    "z": 26134,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F0AA5201_1255154679",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3450.84,
    "y": 1236.66,
    "z": 24604,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk22_4",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 4802.97,
    "y": 1290.49,
    "z": 3861.0852050781,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F0825B01_1335318165",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2929.09,
    "y": 1404.03,
    "z": 7442,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F0815B01_1488038982",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3000.33,
    "y": 1457.13,
    "z": 5259,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk63",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3013.15,
    "y": 1378.1,
    "z": 7660,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F07F5B01_2043697625",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2940.39,
    "y": 1346.2,
    "z": 5954,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_10",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 4523.77,
    "y": 1319.46,
    "z": 8424.3505859375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk25_5",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 4143.59,
    "y": 572.45,
    "z": 1615.2067871094,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_62",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3158.81,
    "y": 1321.62,
    "z": -915.25305175781,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F0805B01_1612786803",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3075.61,
    "y": 1258.93,
    "z": 2388,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F0BD5201_1079947071",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3071.26,
    "y": 1291.69,
    "z": 8958,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk73_3",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3149.07,
    "y": 1260.65,
    "z": 6440,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk21_1",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 4654.85,
    "y": 886.02,
    "z": 4105.884765625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk30_12",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3095.62,
    "y": 1075.75,
    "z": 5350,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk76_6",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2928.04,
    "y": 1190.01,
    "z": 3160,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk51",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3043.97,
    "y": 1160.67,
    "z": 6230,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F0FC5201_1997354134",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3035.24,
    "y": 1168.45,
    "z": 13002,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F790F6201_1248400288",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2972.61,
    "y": 1119.06,
    "z": 265.96563720703,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk51_28",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2992.42,
    "y": 1146.72,
    "z": 5405,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk21",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1319.6,
    "y": 3623.3,
    "z": -5713.0048828125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk50",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1859.33,
    "y": 1313.36,
    "z": 9388.494140625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk10",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2222.12,
    "y": 1027.53,
    "z": 2202.9729003906,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F79C56201_1257600332",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2355.09,
    "y": 1138.63,
    "z": -955.60919189453,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F79C66201_2074565511",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2282.12,
    "y": 1117.1,
    "z": -1196.6092529297,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk9",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2260.54,
    "y": 882.55,
    "z": -943.78369140625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_40B076DF2F79245C01_1676679653",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2743.57,
    "y": 1285.2,
    "z": 1945.5131835938,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal17_UAID_40B076DF2F79245C01_1529847652",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2735.38,
    "y": 1281.95,
    "z": -487.45275878906,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_40B076DF2F799E5F01_1558324292",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2735.55,
    "y": 1066.73,
    "z": 4172.6674804688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F798E5F01_1514525492",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2765.26,
    "y": 1196.33,
    "z": -886.47082519531,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_20",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2458.63,
    "y": 1063.17,
    "z": -1750.9606933594,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk60",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2436.18,
    "y": 1398.51,
    "z": 20133.73828125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk66",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2438.31,
    "y": 1340.58,
    "z": 9259.435546875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F0357B01_1376513381",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3638.97,
    "y": 2147.45,
    "z": 16165,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk212_16",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2036.99,
    "y": 2778.19,
    "z": 26922.96484375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk211_15",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2284.36,
    "y": 3084.2,
    "z": 24813.91796875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk21_4",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 4556.25,
    "y": 1745.29,
    "z": 9359.69921875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_11",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2255.28,
    "y": 2046.86,
    "z": 6530.5732421875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk27_28",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2236.73,
    "y": 2140.84,
    "z": 14890.504882812,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk23_23",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3860.05,
    "y": 3397.26,
    "z": -3415.3061523438,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk72_11",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3750.95,
    "y": 3384,
    "z": 12325,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_66",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3808.09,
    "y": 3498.42,
    "z": 9420,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_22",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2857.84,
    "y": 3512.76,
    "z": 6634.4868164062,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F79016301_2047367890",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2636.03,
    "y": 1139.54,
    "z": -1174,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_21",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2622.18,
    "y": 1068.12,
    "z": 1371.3317871094,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_72",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3562.56,
    "y": 3391.97,
    "z": -81,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F0AE5D01_1615859992",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3472.72,
    "y": 3515.38,
    "z": 8669,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk94",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3391.12,
    "y": 3368.48,
    "z": 15902,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk88",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3326.72,
    "y": 3360.83,
    "z": 16334,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F0156301_1720971459",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3351.43,
    "y": 3277.5,
    "z": 12980,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_67",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3557.65,
    "y": 3526.9,
    "z": 50,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_37",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3561.65,
    "y": 3653.41,
    "z": 16615,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_69",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3504.37,
    "y": 3623.05,
    "z": 11448,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_11",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 4863.66,
    "y": 1828.13,
    "z": 5890.81640625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk23_21",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 4826.02,
    "y": 1843,
    "z": -420.81921386719,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk222_6",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3669.98,
    "y": 2579,
    "z": -1654.9744873047,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F0245C01_1697523667",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3515.8,
    "y": 782.41,
    "z": 9368,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F0775B01_1268218200",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3476.73,
    "y": 674.81,
    "z": 12056,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk63_10",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3519.23,
    "y": 590.29,
    "z": 22147,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk6_2",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3431.23,
    "y": 740.35,
    "z": 4334,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk43_3",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3434.65,
    "y": 1012.5,
    "z": 23933,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk9_14",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3375.22,
    "y": 808.51,
    "z": 14235,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk22_2",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 4139.05,
    "y": 577.43,
    "z": 18058.34375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk23_15",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 4032.76,
    "y": 588.62,
    "z": 1632.3546142578,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk22_14",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 4075.1,
    "y": 579.5,
    "z": 22984.947265625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_46",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 4054,
    "y": 641.93,
    "z": 1692.1013183594,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk213_26",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3445.57,
    "y": 406.18,
    "z": 4072.3857421875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F0575301_1826590140",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3281.83,
    "y": 738.87,
    "z": 3951,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F0595301_1302912499",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3175.82,
    "y": 609.47,
    "z": 2976,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk29_23",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3131.29,
    "y": 910.89,
    "z": 5983,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F0865B01_1135287853",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3319.48,
    "y": 941.37,
    "z": 11494,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F0855B01_1620780674",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3244.18,
    "y": 938.36,
    "z": 810,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk45_UAID_40B076DF2F790F6201_1607312289",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2982.36,
    "y": 1062.51,
    "z": -1216.0450439453,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk45_UAID_40B076DF2F79BF6101_1113212209",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2833.83,
    "y": 1177.34,
    "z": -1071.0450439453,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_40B076DF2F79745B01_1428147672",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2515.51,
    "y": 1315.38,
    "z": 5512.2260742188,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk53_UAID_40B076DF2F79625301_2075930067",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2593.49,
    "y": 1254.8,
    "z": 615.95239257812,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F79B56201_1247281510",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2361.88,
    "y": 934.5,
    "z": 1798.1961669922,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F79A35901_1559939832",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2333.39,
    "y": 1026.83,
    "z": -1745.1766357422,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk58",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2307.11,
    "y": 1323.26,
    "z": 11012.22265625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk27",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2157.01,
    "y": 1215.3,
    "z": -1115.6439208984,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk57",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2215.57,
    "y": 1308.22,
    "z": 4952.0737304688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk23",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2070.74,
    "y": 1249.67,
    "z": 4193.517578125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_40B076DF2F79BC5D01_1825052456",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1966.69,
    "y": 1337.73,
    "z": 5976.6674804688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk19",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2004.31,
    "y": 1258.28,
    "z": 2571.208984375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F79CB6201_1211861396",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2023.57,
    "y": 1043.57,
    "z": -1205.2341308594,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F02A8701_1121902119",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1593.59,
    "y": 1540.76,
    "z": -888,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk52",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1797.01,
    "y": 1069.5,
    "z": 5914.1435546875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk53_UAID_40B076DF2F79F55801_1917538208",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1817.89,
    "y": 1112.12,
    "z": 2431.7509765625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_0",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1659.59,
    "y": 1140.06,
    "z": 1109.3272705078,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk53_UAID_40B076DF2F79105301_1728144638",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1821.13,
    "y": 830.59,
    "z": 3340.9523925781,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F79486001_2099963228",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1778.32,
    "y": 949.29,
    "z": 1480.4526367188,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk53",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1833.86,
    "y": 975.08,
    "z": 4473.7548828125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F79CB6201_2127484397",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1930.59,
    "y": 1016.02,
    "z": -1389.2341308594,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F79CC6201_1781367576",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1901.73,
    "y": 817.34,
    "z": -1329.2341308594,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk53_UAID_40B076DF2F79615301_1537373889",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1978.84,
    "y": 832.88,
    "z": 623.75500488281,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_UAID_40B076DF2F79FD6301_1735716241",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1959.74,
    "y": 789.51,
    "z": -106.16542816162,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk45_UAID_40B076DF2F79926001_1740797235",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2766.4,
    "y": 1403.58,
    "z": 246.10511779785,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk80",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2734.64,
    "y": 1453.87,
    "z": 19815.7109375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk84",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2744.56,
    "y": 1348.34,
    "z": 8873.552734375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk83",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 2751.96,
    "y": 1398.26,
    "z": 7298.7993164062,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk22_10",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 455.62,
    "y": 3263.86,
    "z": -634.27288818359,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_36",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 4032.12,
    "y": 3198.36,
    "z": -134.734375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk223_7",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 4222.89,
    "y": 2596.92,
    "z": 3468.1247558594,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk25_4",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 1950.41,
    "y": 4520.66,
    "z": -1471.3424072266,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk27_13",
    "type": "slug_yellow",
    "purity": "normal",
    "x": 3516.54,
    "y": 3887.31,
    "z": 13253.913085938,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk90",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3246.88,
    "y": 3372.54,
    "z": 12843,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_28",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3098.51,
    "y": 1372.79,
    "z": 23048,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk43",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3106.31,
    "y": 1374.64,
    "z": 11485,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_UAID_04421A9713F0775B01_1729283204",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3122.58,
    "y": 1411.81,
    "z": 2648,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk73_UAID_04421A9713F03A5B01_1974981481",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3581.2,
    "y": 1531.89,
    "z": 16431,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_UAID_04421A9713F07F6001_2021531889",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3329.76,
    "y": 1562.68,
    "z": 23781,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk71_0",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3471.71,
    "y": 1367.11,
    "z": 13456,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_UAID_04421A9713F0DC5B01_1453235998",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3230.09,
    "y": 1352.5,
    "z": 11245,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_29",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3276.52,
    "y": 1420.39,
    "z": 28410,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_UAID_04421A9713F0406001_1876322801",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3321.67,
    "y": 1465.14,
    "z": 26277,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_27",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3295.05,
    "y": 1294.39,
    "z": 9435,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_UAID_04421A9713F0DD5B01_1099993180",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3302.35,
    "y": 1316.99,
    "z": 4656,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk16_2",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3343.36,
    "y": 1125.56,
    "z": 24184,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_UAID_04421A9713F0FB5201_1256959955",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3230.33,
    "y": 1123.29,
    "z": 7271,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk34_15",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2258.88,
    "y": 2514.71,
    "z": 18401.87109375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk31_16",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2600.48,
    "y": 2928.18,
    "z": 35873.38671875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk32_17",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2517.59,
    "y": 2988.55,
    "z": 10890.176757812,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_UAID_04421A9713F02A7C01_1594764512",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2711.16,
    "y": 2943.52,
    "z": 24097,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0B37301_2124852114",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2737.25,
    "y": 2807.35,
    "z": 23200,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk38_34",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2433.03,
    "y": 3013.66,
    "z": 26895.443359375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk313_59",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2152.12,
    "y": 2694.38,
    "z": 24393.349609375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk37_30",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2225.09,
    "y": 2881.59,
    "z": 20895.423828125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk31_15",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2415.17,
    "y": 2738.01,
    "z": 23414.39453125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk327",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2505.75,
    "y": 2481.89,
    "z": 13377.489257812,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_UAID_04421A9713F0E87A01_1253298841",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2642.43,
    "y": 2624.45,
    "z": 20486,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk33_1",
    "type": "slug_purple",
    "purity": "normal",
    "x": 659.68,
    "y": 1487.75,
    "z": -5123.6088867188,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_UAID_04421A9713F063A401_1570680776",
    "type": "slug_purple",
    "purity": "normal",
    "x": 1128.31,
    "y": 3335.74,
    "z": 15257,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk33_2",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2036.07,
    "y": 4311.05,
    "z": 10535.1015625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk31_12",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2552.1,
    "y": 2313.04,
    "z": 24845.505859375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk38",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2000.05,
    "y": 1178.42,
    "z": 19270.591796875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk36_26",
    "type": "slug_purple",
    "purity": "normal",
    "x": 1752.94,
    "y": 2566.21,
    "z": 23072.78125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk34_18",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2095.42,
    "y": 2303.81,
    "z": 22220.240234375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk31_9",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2509.47,
    "y": 1963.54,
    "z": 5869.5654296875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk325",
    "type": "slug_purple",
    "purity": "normal",
    "x": 1768.06,
    "y": 1298.51,
    "z": 15343.176757812,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk310_92",
    "type": "slug_purple",
    "purity": "normal",
    "x": 1787.85,
    "y": 2888.97,
    "z": 20969.35546875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk36_88",
    "type": "slug_purple",
    "purity": "normal",
    "x": 1820.18,
    "y": 2939.06,
    "z": 24877.009765625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk322",
    "type": "slug_purple",
    "purity": "normal",
    "x": 1950.12,
    "y": 2707.92,
    "z": 20664.59375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk321",
    "type": "slug_purple",
    "purity": "normal",
    "x": 1876.93,
    "y": 2764.71,
    "z": 21539.5625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk310_42",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2017.31,
    "y": 2854.44,
    "z": 21953.3671875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk324",
    "type": "slug_purple",
    "purity": "normal",
    "x": 1642.12,
    "y": 2639.67,
    "z": 21166.484375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk39_91",
    "type": "slug_purple",
    "purity": "normal",
    "x": 1674.43,
    "y": 2821.08,
    "z": 25491.169921875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk317",
    "type": "slug_purple",
    "purity": "normal",
    "x": 1624.59,
    "y": 2723.22,
    "z": 19814.099609375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk315",
    "type": "slug_purple",
    "purity": "normal",
    "x": 1452.35,
    "y": 2724.1,
    "z": 23600.427734375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk31_1",
    "type": "slug_purple",
    "purity": "normal",
    "x": 1523.15,
    "y": 2789.26,
    "z": 5091.7846679688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk320",
    "type": "slug_purple",
    "purity": "normal",
    "x": 1956.99,
    "y": 2951.93,
    "z": 21705.81640625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk33_85",
    "type": "slug_purple",
    "purity": "normal",
    "x": 1863.35,
    "y": 2865.68,
    "z": 21220.55859375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk35_87",
    "type": "slug_purple",
    "purity": "normal",
    "x": 1655.65,
    "y": 2966.27,
    "z": 27345.791015625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk311_93",
    "type": "slug_purple",
    "purity": "normal",
    "x": 1552.44,
    "y": 2837.61,
    "z": 21545.513671875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk323",
    "type": "slug_purple",
    "purity": "normal",
    "x": 1577.82,
    "y": 2911.29,
    "z": 25335.830078125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk312_52",
    "type": "slug_purple",
    "purity": "normal",
    "x": 1975.15,
    "y": 2627.87,
    "z": 22615.845703125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk311_48",
    "type": "slug_purple",
    "purity": "normal",
    "x": 1913.27,
    "y": 2455.04,
    "z": 30028.802734375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk32_16",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2030.08,
    "y": 3017.18,
    "z": 38858.62109375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk34_86",
    "type": "slug_purple",
    "purity": "normal",
    "x": 1520.75,
    "y": 2954.61,
    "z": 12270.674804688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk34",
    "type": "slug_purple",
    "purity": "normal",
    "x": 1546.23,
    "y": 2876.82,
    "z": 9571.3291015625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk33_12",
    "type": "slug_purple",
    "purity": "normal",
    "x": 1992.02,
    "y": 2059.26,
    "z": 23114.283203125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk31_10",
    "type": "slug_purple",
    "purity": "normal",
    "x": 1818.25,
    "y": 1972.53,
    "z": 5734.0498046875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk21_6",
    "type": "slug_purple",
    "purity": "normal",
    "x": 1795.65,
    "y": 2204.62,
    "z": 16937.626953125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_0",
    "type": "slug_purple",
    "purity": "normal",
    "x": 1768.57,
    "y": 1769.79,
    "z": 1205.2802734375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk33_14",
    "type": "slug_purple",
    "purity": "normal",
    "x": 1980.37,
    "y": 1990.54,
    "z": 11631.908203125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_UAID_04421A9713F079AF01_1615812377",
    "type": "slug_purple",
    "purity": "normal",
    "x": 1960.6,
    "y": 1432.97,
    "z": 16061,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk32",
    "type": "slug_purple",
    "purity": "normal",
    "x": 984.08,
    "y": 3087.34,
    "z": 11533.1015625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk34_20",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2568.53,
    "y": 1626.73,
    "z": 2713.2180175781,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_7",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2521.97,
    "y": 1724.43,
    "z": 24484.62109375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk35_6",
    "type": "slug_purple",
    "purity": "normal",
    "x": 1256.47,
    "y": 1278.94,
    "z": 18125.166015625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_9",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2536.5,
    "y": 1369.89,
    "z": 25644.134765625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_40B076DF2F79F25F01_1677709082",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2518.6,
    "y": 1410.29,
    "z": 20922,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_13",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2577.64,
    "y": 1412.35,
    "z": 23171.580078125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_11",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2333.89,
    "y": 1421.2,
    "z": 17078.501953125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_6",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2838.68,
    "y": 2200.05,
    "z": 17823.810546875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk33_11",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2832.46,
    "y": 1888.22,
    "z": 5325.3740234375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk35_21",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3168.87,
    "y": 1909.45,
    "z": 12950.685546875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_UAID_04421A9713F0727801_1634602960",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3325.74,
    "y": 2334.05,
    "z": 19107,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_UAID_04421A9713F0F87A01_1467276724",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3447.85,
    "y": 2338.59,
    "z": 15292,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_UAID_04421A9713F06DAF01_1615607160",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3298.93,
    "y": 2193.71,
    "z": 5512,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_UAID_04421A9713F0F77A01_1578399538",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3021.33,
    "y": 2581.58,
    "z": 14071,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_UAID_04421A9713F0E67A01_2112441483",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3066.21,
    "y": 2703.35,
    "z": 18559,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_UAID_04421A9713F0297C01_1197302326",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3163.76,
    "y": 2802.94,
    "z": 12251,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk32_84",
    "type": "slug_purple",
    "purity": "normal",
    "x": 1016.5,
    "y": 2664.24,
    "z": 15695.169921875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal7_17",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3000.87,
    "y": 3036.13,
    "z": 12793.5,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk33_18",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2928.86,
    "y": 3021.6,
    "z": 18274.873046875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_UAID_04421A9713F02A7C01_1360375511",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2853.01,
    "y": 2999.86,
    "z": 16428,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_UAID_04421A9713F0277C01_2138469968",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3025.32,
    "y": 2881.71,
    "z": 10448,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_UAID_04421A9713F0297C01_2084244334",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3022.41,
    "y": 2923.56,
    "z": 19440,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_4",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2732.02,
    "y": 3330.11,
    "z": 8912.5654296875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk85",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3346.96,
    "y": 2950.65,
    "z": 19688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk37_51",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3412.94,
    "y": 2868.04,
    "z": -1683.2459716797,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_UAID_04421A9713F0717801_1844491783",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3344.9,
    "y": 2502.04,
    "z": 18925,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk76",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3340.85,
    "y": 3109.36,
    "z": 11410,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0757801_2136946500",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2957.5,
    "y": 2479.21,
    "z": 17628,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_UAID_04421A9713F0E57A01_1764014301",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3139.79,
    "y": 2598.76,
    "z": 18161,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_UAID_04421A9713F0E57A01_1659753299",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3278.14,
    "y": 2600.58,
    "z": 22839,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_UAID_04421A9713F0E77A01_1394636661",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3036.01,
    "y": 2783.26,
    "z": 18044,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F0757801_1889185499",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3156.72,
    "y": 2545.09,
    "z": 20663,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk74",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3243.23,
    "y": 2956.44,
    "z": 14664,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk86",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3212.12,
    "y": 2970.22,
    "z": 17878,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_UAID_04421A9713F0807C01_1687435632",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3211.48,
    "y": 2948.72,
    "z": -10,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_UAID_04421A9713F0EE7A01_1230590903",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2779.56,
    "y": 2640.09,
    "z": 19405,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk13",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2403.29,
    "y": 816.05,
    "z": 3403.3696289062,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk32_1",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2032.01,
    "y": 3584.64,
    "z": 7996.703125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk37_89",
    "type": "slug_purple",
    "purity": "normal",
    "x": 1785.85,
    "y": 3234.94,
    "z": 23874.552734375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk38_90",
    "type": "slug_purple",
    "purity": "normal",
    "x": 1435.4,
    "y": 3168.57,
    "z": 16307.810546875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_UAID_40B076DF2F79F68401_1268529865",
    "type": "slug_purple",
    "purity": "normal",
    "x": 1936.9,
    "y": 3252.57,
    "z": -6565,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk35_0",
    "type": "slug_purple",
    "purity": "normal",
    "x": 1837.71,
    "y": 3369.59,
    "z": 24037.513671875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk31_0",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2383.5,
    "y": 3673.26,
    "z": -6537.7485351562,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_5",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2456.29,
    "y": 3756.39,
    "z": 10354.413085938,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_16",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2684.55,
    "y": 3653.56,
    "z": -3988.6833496094,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk35_22",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2281.71,
    "y": 3332.5,
    "z": 27380.458984375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk39_41",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2223.81,
    "y": 3164.23,
    "z": 24429.640625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_13",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2605.31,
    "y": 3849.73,
    "z": 11018.750976562,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_9",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2271.3,
    "y": 3925.55,
    "z": 13773.23046875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_5",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2770.95,
    "y": 4040.23,
    "z": 7409.2524414062,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_40",
    "type": "slug_purple",
    "purity": "normal",
    "x": 4002.74,
    "y": 2832.91,
    "z": -615.68469238281,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk73_15",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3684.31,
    "y": 3426.98,
    "z": 3658,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk79_8",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3709.86,
    "y": 3392.38,
    "z": -8415,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_38",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3706.03,
    "y": 3484.81,
    "z": 10093,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk32_0",
    "type": "slug_purple",
    "purity": "normal",
    "x": 1298.79,
    "y": 1670.73,
    "z": -3827.453125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk34_31",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3792.73,
    "y": 2677.53,
    "z": -1671.3302001953,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk319",
    "type": "slug_purple",
    "purity": "normal",
    "x": 1302.21,
    "y": 2634.23,
    "z": 28689.953125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk310",
    "type": "slug_purple",
    "purity": "normal",
    "x": 949.28,
    "y": 2687.51,
    "z": 10801.411132812,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F05F7801_1673526600",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3718.72,
    "y": 2443.31,
    "z": 7615,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_42",
    "type": "slug_purple",
    "purity": "normal",
    "x": 4016.5,
    "y": 2580.78,
    "z": 1374.4731445312,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk36_50",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3887.39,
    "y": 2945.27,
    "z": -1043.3137207031,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk38_52",
    "type": "slug_purple",
    "purity": "normal",
    "x": 4217.3,
    "y": 2431.81,
    "z": 1764.4595947266,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_UAID_04421A9713F0F87A01_1842830725",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3884.01,
    "y": 2219.7,
    "z": 14458,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_UAID_04421A9713F0F87A01_1173440720",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3381.79,
    "y": 2249.77,
    "z": 14455,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk36_22",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3504.48,
    "y": 1892.61,
    "z": 10951.834960938,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_UAID_04421A9713F0627801_2036326140",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3554.97,
    "y": 2352.45,
    "z": 18580,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk31",
    "type": "slug_purple",
    "purity": "normal",
    "x": 992.47,
    "y": 2790.43,
    "z": 18989.81640625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_UAID_04421A9713F02AA401_1523751748",
    "type": "slug_purple",
    "purity": "normal",
    "x": 1152.61,
    "y": 3011.53,
    "z": 21708,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_2",
    "type": "slug_purple",
    "purity": "normal",
    "x": 840.73,
    "y": 2425.9,
    "z": 3815.6572265625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk312",
    "type": "slug_purple",
    "purity": "normal",
    "x": 1328.7,
    "y": 2824.24,
    "z": 34041.640625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk318",
    "type": "slug_purple",
    "purity": "normal",
    "x": 1315.99,
    "y": 2785.59,
    "z": 19964.611328125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk313",
    "type": "slug_purple",
    "purity": "normal",
    "x": 1155.5,
    "y": 2643.23,
    "z": 26174.703125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_4",
    "type": "slug_purple",
    "purity": "normal",
    "x": 707.09,
    "y": 2657.43,
    "z": 8754.7333984375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk31_3",
    "type": "slug_purple",
    "purity": "normal",
    "x": 374.26,
    "y": 3076.17,
    "z": -1742.5778808594,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_1",
    "type": "slug_purple",
    "purity": "normal",
    "x": 401.44,
    "y": 2270.45,
    "z": 9152.1025390625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk34_6",
    "type": "slug_purple",
    "purity": "normal",
    "x": 251.33,
    "y": 1428.4,
    "z": 6791.5913085938,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk33",
    "type": "slug_purple",
    "purity": "normal",
    "x": 1069.32,
    "y": 3113.95,
    "z": 7268.4614257812,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk36",
    "type": "slug_purple",
    "purity": "normal",
    "x": 1205.76,
    "y": 3344.1,
    "z": 13045.333007812,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_UAID_04421A9713F06EA401_1809380716",
    "type": "slug_purple",
    "purity": "normal",
    "x": 1203.72,
    "y": 3426.85,
    "z": 13128,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_UAID_04421A9713F072A401_1701014427",
    "type": "slug_purple",
    "purity": "normal",
    "x": 1254.29,
    "y": 3671.42,
    "z": 16319,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_3",
    "type": "slug_purple",
    "purity": "normal",
    "x": 1110.65,
    "y": 1900.21,
    "z": -4184.5078125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk31_8",
    "type": "slug_purple",
    "purity": "normal",
    "x": 1280.27,
    "y": 1286.71,
    "z": 46942.09375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk33_9",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3431.13,
    "y": 4031.87,
    "z": -11162.178710938,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk36_12",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3099.78,
    "y": 4171.82,
    "z": -5815.2456054688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk31_7",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3052.21,
    "y": 4099.65,
    "z": -8871.61328125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_20",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3245.66,
    "y": 3991.97,
    "z": -7889.8603515625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk34_10",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3304.85,
    "y": 3657.02,
    "z": 4754.6049804688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk35_11",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3483.06,
    "y": 3699.3,
    "z": 17957.123046875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk92",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3498.92,
    "y": 3212.22,
    "z": 8178,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_C_UAID_04421A9713F05D5D01_1813536763",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3711.21,
    "y": 3222.32,
    "z": 4992,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_35",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3672.67,
    "y": 3201.79,
    "z": -1397.8775634766,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_41",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3735.74,
    "y": 3124.11,
    "z": -896.49517822266,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_UAID_04421A9713F0056301_2025275612",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3402.91,
    "y": 3145.1,
    "z": 12635,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_23",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3375.35,
    "y": 3114.73,
    "z": 3222,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk75",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3343.98,
    "y": 3148.72,
    "z": 7139,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk89",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3457.25,
    "y": 3233.4,
    "z": 15475,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_39",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3533.06,
    "y": 3327.88,
    "z": -6371,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk71_9",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3578.35,
    "y": 3337.62,
    "z": 6325,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_UAID_04421A9713F0585D01_1891820856",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3708.53,
    "y": 3330.19,
    "z": 6984,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_UAID_04421A9713F06A5C01_1458580968",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3649.46,
    "y": 3261.33,
    "z": 3132,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_37",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3688.64,
    "y": 3360.11,
    "z": 16900,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_UAID_04421A9713F06B5C01_1971558160",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3725.77,
    "y": 3276.72,
    "z": 11707,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_22",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3128.99,
    "y": 3174.5,
    "z": 21318,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk87",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3198.43,
    "y": 3174.79,
    "z": 8236,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk38_14",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3038.36,
    "y": 3592.16,
    "z": -3921.6091308594,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk34_19",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3232.77,
    "y": 3382.91,
    "z": 11079.766601562,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk91",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3170,
    "y": 3432.62,
    "z": 13255,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk77_1",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2970.73,
    "y": 1544.32,
    "z": 10707,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_UAID_04421A9713F0585E01_1956229960",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2990.92,
    "y": 1499.75,
    "z": 15820,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_25",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2967.12,
    "y": 1656.62,
    "z": 19369.837890625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk73_UAID_04421A9713F0B65201_1605781812",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3169.88,
    "y": 1597.96,
    "z": 21699,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_30",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3056.37,
    "y": 1509.89,
    "z": 12905,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_16",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2791.94,
    "y": 1362.22,
    "z": 13387.778320312,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_UAID_04421A9713F0AA5201_1333563683",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3482.77,
    "y": 1240.68,
    "z": 25342,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk72_1",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3582.35,
    "y": 1252.6,
    "z": 20425,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_UAID_04421A9713F0E85F01_1517332314",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3500.09,
    "y": 1164.01,
    "z": 34166,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk31_4",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3745.8,
    "y": 1120.32,
    "z": 8012.7817382812,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk30",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3740.02,
    "y": 1107.09,
    "z": 17216.205078125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk73",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3743.3,
    "y": 677.73,
    "z": 16501,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk32_3",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3854.71,
    "y": 546.66,
    "z": 5423.572265625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_0",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3867.29,
    "y": 561.89,
    "z": 32565.87890625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_UAID_04421A9713F0E95F01_1176278498",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3605.46,
    "y": 590.01,
    "z": 42936,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk31_2",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3673.21,
    "y": 529.39,
    "z": 1647.1021728516,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_43",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3688.81,
    "y": 732.81,
    "z": 20885,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_UAID_04421A9713F0E85F01_1852831317",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3621.22,
    "y": 799.46,
    "z": 33313,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_UAID_40B076DF2F79DBAD01_1358054399",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3902.18,
    "y": 789.92,
    "z": 3673.1076660156,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk65",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2978.63,
    "y": 1278.38,
    "z": 10600,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_33",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2973.76,
    "y": 1226.28,
    "z": 7765,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_32",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2973.9,
    "y": 1363.86,
    "z": 12265,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk70_0",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2974.86,
    "y": 1472.1,
    "z": 11895,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_UAID_04421A9713F08B5B01_2043989757",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2990.19,
    "y": 1457.21,
    "z": 11828,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_UAID_04421A9713F0D45B01_1873455580",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2919.97,
    "y": 1438.04,
    "z": 9278,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk62",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3023.94,
    "y": 1382.43,
    "z": 10770,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk30_10",
    "type": "slug_purple",
    "purity": "normal",
    "x": 4793.36,
    "y": 1490.46,
    "z": 9860.0380859375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk33_4",
    "type": "slug_purple",
    "purity": "normal",
    "x": 4156.51,
    "y": 520.74,
    "z": 9881.6875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_UAID_04421A9713F0835B01_1215726345",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3112.26,
    "y": 1240.77,
    "z": 7345,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk40",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3106.75,
    "y": 1201.09,
    "z": 8835,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk41",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3076.15,
    "y": 1155.28,
    "z": 799.72784423828,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_UAID_40B076DF2F79DCAD01_1900669576",
    "type": "slug_purple",
    "purity": "normal",
    "x": 4696.53,
    "y": 670.1,
    "z": 1909,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk24_14",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2970.23,
    "y": 1072.21,
    "z": 3009.6591796875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk5_5",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2987.65,
    "y": 1158.43,
    "z": 9742,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_31",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3036.71,
    "y": 1186.82,
    "z": 9875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_UAID_04421A9713F070A401_1749057071",
    "type": "slug_purple",
    "purity": "normal",
    "x": 1306.5,
    "y": 3539.27,
    "z": 13823,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk316",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2470.21,
    "y": 1228.32,
    "z": 7631.5639648438,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_2",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2374.28,
    "y": 1329.75,
    "z": 3246.5471191406,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_UAID_40B076DF2F79905F01_1499395864",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2415.2,
    "y": 1281.27,
    "z": 3610.4697265625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk10_UAID_40B076DF2F79486001_1273441223",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2223.1,
    "y": 1019.9,
    "z": 4924.97265625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk12",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2309.43,
    "y": 907.72,
    "z": 1506.1215820312,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_19",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2645.03,
    "y": 1113.87,
    "z": 12637.537109375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk18",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2732.64,
    "y": 1196.46,
    "z": 5124.4091796875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_17",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2719.09,
    "y": 1197.37,
    "z": 19226.88671875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_UAID_40B076DF2F798B5F01_1138825944",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2413.54,
    "y": 1389.17,
    "z": 22368.669921875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_10",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2468.48,
    "y": 1353.86,
    "z": 5395.7080078125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk311",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2346.38,
    "y": 2986.88,
    "z": -753.92999267578,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_UAID_40B076DF2F79D5AD01_1325784341",
    "type": "slug_purple",
    "purity": "normal",
    "x": 4125.94,
    "y": 1347.79,
    "z": 3900.7275390625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk35_1",
    "type": "slug_purple",
    "purity": "normal",
    "x": 4658.38,
    "y": 1734.67,
    "z": 5891.8266601562,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_UAID_04421A9713F0036301_1297164245",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3751.33,
    "y": 3518.33,
    "z": 13063.473632812,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk30_7",
    "type": "slug_purple",
    "purity": "normal",
    "x": 4729.67,
    "y": 1112.67,
    "z": 9585.3125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_38",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3518.99,
    "y": 3465.52,
    "z": 6584,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_UAID_04421A9713F0AC5201_1755460045",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3531.82,
    "y": 596.58,
    "z": 9664,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_46",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3567.82,
    "y": 560.43,
    "z": 22885,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk42_8",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3364.69,
    "y": 715.95,
    "z": 19165,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk13_2",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3414.47,
    "y": 783.95,
    "z": -1780,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk37_14",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3327.87,
    "y": 1018.99,
    "z": 13420,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_UAID_04421A9713F08A5B01_2054934580",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3332.05,
    "y": 998.16,
    "z": 21124,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk64_8",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3382.89,
    "y": 869.63,
    "z": 23505,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk14_5",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3387.52,
    "y": 521.97,
    "z": 21390,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk67_2",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3377.15,
    "y": 460.43,
    "z": 20502,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_UAID_04421A9713F05A5301_1813979681",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3190.14,
    "y": 689.46,
    "z": -1336,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk31_13",
    "type": "slug_purple",
    "purity": "normal",
    "x": 4066.92,
    "y": 3349.39,
    "z": 11353.857421875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk61_8",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3144.01,
    "y": 1058.59,
    "z": 6780,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_UAID_04421A9713F0145C01_1961591832",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3310.1,
    "y": 1057.83,
    "z": 20199,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_UAID_04421A9713F0895B01_1662240391",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3252.02,
    "y": 1019.8,
    "z": 4746,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk32_8",
    "type": "slug_purple",
    "purity": "normal",
    "x": 3335.85,
    "y": 4164.29,
    "z": -898.87548828125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_18",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2827.77,
    "y": 1066.18,
    "z": 4077.2690429688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk2_C_16",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2800.84,
    "y": 1176.74,
    "z": 5835.7026367188,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk15",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2527.44,
    "y": 969.4,
    "z": 4340.3408203125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_34",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2798.27,
    "y": 1279.27,
    "z": 5830.5908203125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk44",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2831.07,
    "y": 1279.42,
    "z": 2283.8166503906,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_12",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2510.22,
    "y": 1300.1,
    "z": 9201.384765625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_8",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2317.63,
    "y": 1273.2,
    "z": 5097.9868164062,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_1",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2140.06,
    "y": 1300.93,
    "z": 6313.4584960938,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk39",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2060.55,
    "y": 1213.24,
    "z": 7399.1591796875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk8_UAID_40B076DF2F79915F01_1298320049",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2070.64,
    "y": 1249.29,
    "z": -727.27124023438,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk8",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2038.86,
    "y": 969.65,
    "z": 4295.728515625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk35",
    "type": "slug_purple",
    "purity": "normal",
    "x": 1743.72,
    "y": 1083.73,
    "z": 8378.265625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_3",
    "type": "slug_purple",
    "purity": "normal",
    "x": 1808.72,
    "y": 973.19,
    "z": 8127.7197265625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk5",
    "type": "slug_purple",
    "purity": "normal",
    "x": 1777.88,
    "y": 1037.99,
    "z": -1020.8106689453,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk4_UAID_40B076DF2F79435901_1076437937",
    "type": "slug_purple",
    "purity": "normal",
    "x": 1833.82,
    "y": 1028.91,
    "z": 3662.7795410156,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk4",
    "type": "slug_purple",
    "purity": "normal",
    "x": 1824.97,
    "y": 906.58,
    "z": 3870.9523925781,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk37",
    "type": "slug_purple",
    "purity": "normal",
    "x": 1920.06,
    "y": 798.1,
    "z": 4686.83984375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk34_3",
    "type": "slug_purple",
    "purity": "normal",
    "x": 1250.65,
    "y": 4105.47,
    "z": -11804.258789062,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_15",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2704.56,
    "y": 1461.19,
    "z": 28168.74609375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_14",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2733.69,
    "y": 1442.98,
    "z": 9725.8544921875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk11",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2709.55,
    "y": 1440.4,
    "z": 5138.7568359375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk33_17",
    "type": "slug_purple",
    "purity": "normal",
    "x": 2055.43,
    "y": 3255.29,
    "z": 21485.1015625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_11",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3322.78,
    "y": 3286.76,
    "z": 10465,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT111",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3095.19,
    "y": 1445.65,
    "z": 559.04748535156,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_19",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3450.99,
    "y": 1503.39,
    "z": 23070,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT119",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3240.53,
    "y": 1361.96,
    "z": 17202,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_18",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3421.97,
    "y": 1378.03,
    "z": 23738,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT113",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3194.42,
    "y": 1226.74,
    "z": 2575,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT112_14",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3407.77,
    "y": 1137.64,
    "z": 25648,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT28_38",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2308.18,
    "y": 2553.56,
    "z": 23371.8046875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT18_12",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2470.94,
    "y": 2590.55,
    "z": 23995.080078125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT21_10",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2387.74,
    "y": 2932.89,
    "z": 23524.431640625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F0317C01_1516355747",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2628.59,
    "y": 2859.36,
    "z": 9747,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT11_15",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2561.42,
    "y": 3002.04,
    "z": 21210.15625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F0317C01_2116555749",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2729.14,
    "y": 2724.43,
    "z": 11723,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F0447B01_1978893022",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2720.81,
    "y": 2748,
    "z": 9868,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT17_11",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2301.28,
    "y": 2655.73,
    "z": 23861.197265625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT29_42",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2228.12,
    "y": 2773.73,
    "z": 22512.033203125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT25_19",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2418.98,
    "y": 2768.59,
    "z": 18103.447265625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_2",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2676.8,
    "y": 2465.47,
    "z": 13480.114257812,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_3",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2589.21,
    "y": 2463.52,
    "z": 19352.052734375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F0307C01_1078840569",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2912.71,
    "y": 2947.78,
    "z": 16212,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT77",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1882.3,
    "y": 1093.84,
    "z": 2649.4384765625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT22_277",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1101.2,
    "y": 3379.75,
    "z": 3832.7163085938,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F02AA401_1741245750",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1006.13,
    "y": 3252.91,
    "z": 19567,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT27_716",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1029.36,
    "y": 3372.89,
    "z": 9363.015625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT210",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2021.4,
    "y": 4249.67,
    "z": -4610.2724609375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT12",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 703.32,
    "y": 1714.2,
    "z": 11051.813476562,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT1_9",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2489.72,
    "y": 1867.09,
    "z": 17692.578125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT4",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2411.99,
    "y": 1747.34,
    "z": 10781.443359375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT3_UAID_40B076DF2F795E7801_2071161425",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2431.23,
    "y": 1854.44,
    "z": 9342.6689453125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT6_7",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2194.2,
    "y": 1851.43,
    "z": 14818.638671875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT25_5",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2213.77,
    "y": 4453.2,
    "z": -2276.2231445312,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT22_25",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1713.83,
    "y": 2694.85,
    "z": 19643.296875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_5",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2501.46,
    "y": 2279.97,
    "z": 13389.30078125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT27_31",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2100.88,
    "y": 2398.38,
    "z": 32838.53515625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_4",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2237.46,
    "y": 2335.76,
    "z": 13449.58984375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT16_10",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2256.47,
    "y": 2425.95,
    "z": 25644.3515625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_1",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2604.69,
    "y": 2088.12,
    "z": 7539.0390625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT3_UAID_40B076DF2F795E7801_1675473424",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2609.64,
    "y": 1979.8,
    "z": 7998.837890625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT80",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1754.28,
    "y": 1297.6,
    "z": -159.90380859375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT23_26",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1719.88,
    "y": 2896.66,
    "z": 22381.48046875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT26_27",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2073.53,
    "y": 2953.69,
    "z": 23096.392578125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT24_19",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1649.57,
    "y": 2609.24,
    "z": 23137.701171875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT26_29",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1629.66,
    "y": 2760.84,
    "z": 19783.75390625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT210_42",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1949.27,
    "y": 2839.71,
    "z": 21865.87109375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT28_34",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1887.39,
    "y": 2960.72,
    "z": 21100.06640625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F0A96F01_1658558123",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1800.62,
    "y": 3039.02,
    "z": 20035,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT25_28",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1575.65,
    "y": 2845.92,
    "z": 24589.728515625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F0A96F01_1573952121",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1660.42,
    "y": 2859.27,
    "z": 22701,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT23_2",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1819.65,
    "y": 2333.64,
    "z": 18533.224609375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT25_23",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1878.9,
    "y": 2579.18,
    "z": 23999.52734375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F0A96F01_1627684122",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1421.25,
    "y": 2842.4,
    "z": 23991,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT11",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1408.41,
    "y": 2142.13,
    "z": 21683.12109375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT24_3",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2015.73,
    "y": 2203.12,
    "z": 20304.7421875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT13_1",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1916.63,
    "y": 1990.1,
    "z": 11640,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT15_3",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1732.06,
    "y": 2059.72,
    "z": 12511.133789062,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT25_4",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1892.22,
    "y": 2099.51,
    "z": 14472.30859375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT21_0",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1561.57,
    "y": 2011.81,
    "z": 15897.509765625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT8_5",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1677.52,
    "y": 1914.18,
    "z": -55.431743621826,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT12_0",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1943.35,
    "y": 2175.04,
    "z": 14668.02734375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT5_8",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2002.8,
    "y": 1888.66,
    "z": 9658.271484375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2073.92,
    "y": 1628.42,
    "z": 9323.27734375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F02AA401_1366971746",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 992.93,
    "y": 3037.2,
    "z": 23923,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT28_8",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2261.06,
    "y": 1586.62,
    "z": 1231.5828857422,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT3_4",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2333.35,
    "y": 1706.36,
    "z": 12503.8984375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT7",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2678.69,
    "y": 1697.96,
    "z": 14084.499023438,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F087BE01_1694514560",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1237.83,
    "y": 3545.34,
    "z": 17468,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT3_UAID_40B076DF2F796A7301_1820015257",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2444.04,
    "y": 1706.64,
    "z": 11369.8984375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT15_0",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2615.89,
    "y": 1412.87,
    "z": -1759.6098632812,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT102",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2168.39,
    "y": 1375.13,
    "z": 1844.283203125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_7",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2254.88,
    "y": 1385.62,
    "z": 12229.78125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_UAID_40B076DF2F796A7301_1664532256",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2116.2,
    "y": 1628.62,
    "z": 21074.27734375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_15",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2891.85,
    "y": 2252.59,
    "z": 8860.150390625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F0327C01_1394521928",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3138.57,
    "y": 2413.49,
    "z": 16369,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT90",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2675.65,
    "y": 1053.49,
    "z": 2721.0961914062,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_16",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2994.56,
    "y": 2426.63,
    "z": 14743.533203125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_14",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2910.6,
    "y": 2007.44,
    "z": 12662.31640625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT32_20",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3246.98,
    "y": 2007.56,
    "z": -22.824737548828,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT7_UAID_40B076DF2F795F7801_1562250602",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2976.86,
    "y": 1808.92,
    "z": 17466.82421875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT29_11",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3116.83,
    "y": 2172.95,
    "z": 977.87670898438,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT31_17",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3183.5,
    "y": 1759.7,
    "z": -1196.0091552734,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F0F47A01_2000362987",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3250.54,
    "y": 2323.22,
    "z": 19627,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F0337C01_1632970109",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3415.11,
    "y": 2362.2,
    "z": 11033,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT10_5",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3290.52,
    "y": 2281.55,
    "z": 11407.16796875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F0F27A01_1632980625",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3041.62,
    "y": 2697.14,
    "z": 10341,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F0F07A01_1459225259",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3010.5,
    "y": 2608.33,
    "z": 13038,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT21_10184",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2994.57,
    "y": 2575.31,
    "z": 18559.505859375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT20_9811",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3395.35,
    "y": 2680.53,
    "z": 10781.602539062,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT45_7909",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3233.21,
    "y": 2787.11,
    "z": 18793.140625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F0397C01_2086373177",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3215.59,
    "y": 2829.44,
    "z": 11031,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F03A7C01_1499181354",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3082.23,
    "y": 2942.49,
    "z": 12668,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT24_18",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3082.09,
    "y": 2999.42,
    "z": 13021.893554688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F0307C01_1582547570",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2960.25,
    "y": 2842.98,
    "z": 14186,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F03A7C01_1798728356",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2890.05,
    "y": 2723.92,
    "z": 10379,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F0B37301_1874710112",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2901.41,
    "y": 2822.15,
    "z": 21602,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_40B076DF2F79D68D01_1178565720",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2871.86,
    "y": 2445.3,
    "z": 15484.150390625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_12",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3446.09,
    "y": 3069.64,
    "z": 1121.8068847656,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F0FD6301_1551743241",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3336.6,
    "y": 3052.37,
    "z": 15118,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F0327C01_1340668927",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2998.89,
    "y": 2494.47,
    "z": 13751,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F0367C01_1997582645",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3153.87,
    "y": 2659.4,
    "z": 11566,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F0F17A01_1899547441",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3102.42,
    "y": 2620.05,
    "z": 10929,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT87",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2955.04,
    "y": 2774.47,
    "z": 9846,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F0357C01_1830097463",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3110.38,
    "y": 2559.67,
    "z": 13395,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F0357C01_1629276462",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3231.54,
    "y": 2547.79,
    "z": 16381,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_13",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3278.67,
    "y": 3074.11,
    "z": 6072,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F0156301_1631721457",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3283.42,
    "y": 3079.39,
    "z": 11633,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F0EE7A01_1386093905",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2833.82,
    "y": 2613.15,
    "z": 19038,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT140",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1450.7,
    "y": 3328.02,
    "z": 6294.2036132812,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT24_4",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2093.07,
    "y": 3678.06,
    "z": 1102.4473876953,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT21_356",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1663.78,
    "y": 3194.77,
    "z": 11242.198242188,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F0A96F01_1534709120",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1614.87,
    "y": 3192.32,
    "z": 21784,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT22_11",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1933.59,
    "y": 3140.05,
    "z": 23434.595703125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT141",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1781.75,
    "y": 3430.77,
    "z": -4968.2841796875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT139",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1939.06,
    "y": 3306.34,
    "z": 3027.3020019531,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT28",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1938.65,
    "y": 3818.97,
    "z": 1278.0842285156,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT21_UAID_40B076DF2F79CA7C01_1851394664",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1508.51,
    "y": 4037.64,
    "z": -663.23596191406,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT23_3",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1646.12,
    "y": 4192.25,
    "z": -4589.3466796875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT27_7",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1835.39,
    "y": 4276.72,
    "z": -3112.3798828125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT22_2",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1967.2,
    "y": 4131.61,
    "z": 2510.6079101562,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT26_6",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2079.11,
    "y": 3797.83,
    "z": -1379.7899169922,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT12_2",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1483.15,
    "y": 4349.18,
    "z": -1620.4888916016,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT24_278",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 904.23,
    "y": 3152,
    "z": 5641.3505859375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F0C86101_1887823809",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 949.16,
    "y": 1893.23,
    "z": 1903,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT28_9",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2764.27,
    "y": 3582.05,
    "z": -4523.4731445312,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT97_3991",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2736.77,
    "y": 3574.78,
    "z": 1756.2927246094,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT21_15",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2592.41,
    "y": 3177.06,
    "z": 11766.455078125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT211_UAID_40B076DF2F79007A01_1988795993",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2319.58,
    "y": 3544.57,
    "z": -16557.263671875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT12_4",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2126.04,
    "y": 3177.47,
    "z": 23652.515625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT73",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1682.79,
    "y": 1000.65,
    "z": 5749.869140625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT211_UAID_40B076DF2F79007A01_1867371992",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2581.79,
    "y": 3398.83,
    "z": -8357.7412109375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT211_UAID_40B076DF2F79017A01_1322649170",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2485.54,
    "y": 3508.27,
    "z": 6222.2197265625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT84",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2131.09,
    "y": 1153.16,
    "z": -955.90380859375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT95_2253",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2484.43,
    "y": 3937.96,
    "z": -6016.6528320312,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT96_3047",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2401.91,
    "y": 4090.22,
    "z": -5053.9560546875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F0FA6801_1163136984",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1022.06,
    "y": 3558.56,
    "z": 247,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT99_2052",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2507.71,
    "y": 3841.55,
    "z": -1560.9357910156,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT211",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2258.52,
    "y": 3816.04,
    "z": -11030.689453125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT91_340",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2185.04,
    "y": 3965.33,
    "z": -1998.234375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT98_5463",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2663.3,
    "y": 3843.06,
    "z": 3425.7194824219,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT29",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2315.22,
    "y": 4394.99,
    "z": -492.63140869141,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT94_781",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2611.26,
    "y": 4115.41,
    "z": 1171.6286621094,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F0337C01_1544698108",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3508.45,
    "y": 2526.67,
    "z": 12999,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F0327C01_1605927929",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3483.64,
    "y": 2495.35,
    "z": 5407,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT26",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 832.54,
    "y": 1318.8,
    "z": -1531.4420166016,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT1_C_17",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3650.04,
    "y": 3096.32,
    "z": 1337.7686767578,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_23",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3601.11,
    "y": 3421.63,
    "z": -3035,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_28",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3534.14,
    "y": 2889.67,
    "z": -1537.0631103516,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT24_27",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1297.85,
    "y": 2601.81,
    "z": 19523.603515625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT27_30",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 942.62,
    "y": 2588.7,
    "z": 21767.57421875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT14_3",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3760.45,
    "y": 2764.36,
    "z": -1682.3511962891,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_25",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3889.29,
    "y": 3108.49,
    "z": -1513.9333496094,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_26",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3919.8,
    "y": 2580.05,
    "z": 1694.1873779297,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT22_26",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 4048.87,
    "y": 2848.72,
    "z": -898.38671875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT1_C_19",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3963.95,
    "y": 2246.11,
    "z": 5306.4331054688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F0F17A01_2106088442",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3742.52,
    "y": 2250.8,
    "z": 17298,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F0737801_1258887144",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3404.65,
    "y": 2291.18,
    "z": 10332.74609375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT30_14",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3394.44,
    "y": 2168.87,
    "z": 5641.6586914062,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F0607801_1378431781",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3877.92,
    "y": 2373.38,
    "z": 12447,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT24_28",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3870.89,
    "y": 2334.73,
    "z": 9149.595703125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT61",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3952.8,
    "y": 2032.72,
    "z": 9573.5947265625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_40B076DF2F793DA801_1139638307",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3571.72,
    "y": 1940.31,
    "z": 11761,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT69",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 4120.87,
    "y": 1976.82,
    "z": 5730.5947265625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F0397C01_1667868175",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3590.82,
    "y": 2425.58,
    "z": 7599,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F0337C01_1494320107",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3544.38,
    "y": 2291.9,
    "z": 13392,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT27",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 988.9,
    "y": 1525.44,
    "z": 5993.6767578125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F0C06801_1834655836",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 352.92,
    "y": 3194.91,
    "z": -1602,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT29_38",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1244.44,
    "y": 2811.51,
    "z": 23703.7421875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F0C46101_1232106098",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 961.2,
    "y": 2346.84,
    "z": 3242,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT144",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1426.56,
    "y": 3109.92,
    "z": 5077.0229492188,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT21_24",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1504.07,
    "y": 3065.43,
    "z": 17574.259765625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F0A96F01_1680839124",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 905.36,
    "y": 2758.4,
    "z": 16911,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT145",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1038.18,
    "y": 2881.19,
    "z": 12554.120117188,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F02AA401_1546189749",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1083.42,
    "y": 2915.94,
    "z": 18816,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT143_4633",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1193.27,
    "y": 3094.07,
    "z": 9324.46875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F0C46101_1131406096",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1370.47,
    "y": 2324.68,
    "z": 10832,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT148",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 795.11,
    "y": 2648.49,
    "z": -1181.3687744141,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F0C46101_1178535097",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1013.38,
    "y": 2472.27,
    "z": 12872,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F0C26101_1093316736",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 708.49,
    "y": 2486.72,
    "z": 2008,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT22_7",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 570.02,
    "y": 2870.63,
    "z": -1461.2108154297,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT21_1",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1322.77,
    "y": 3929.67,
    "z": 2780.0083007812,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT149",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 309.8,
    "y": 1898.8,
    "z": -863.01824951172,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT212",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 404.08,
    "y": 1754.01,
    "z": -1507.7767333984,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT124",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 684.32,
    "y": 1909.51,
    "z": -1601.6325683594,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT135",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 459.44,
    "y": 2087.4,
    "z": 180.14810180664,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT25",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 474.22,
    "y": 1484.63,
    "z": 15231.032226562,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT11_21",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 337.45,
    "y": 1498.5,
    "z": -1510.4635009766,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT22",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 379.39,
    "y": 1294.05,
    "z": 462.43057250977,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F025A401_1185385862",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1351.62,
    "y": 3344.13,
    "z": 15396,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F025A401_1318668863",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1392.54,
    "y": 3474.71,
    "z": 13947,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F087BE01_1872685562",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1057.45,
    "y": 3229.73,
    "z": 11182,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F02AA401_1814961751",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1245.56,
    "y": 3268.67,
    "z": 15174,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT23_1410",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1134.91,
    "y": 3767.97,
    "z": 1619.4642333984,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT130",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 836.44,
    "y": 2219.45,
    "z": 763.72192382812,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT126",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1237.58,
    "y": 2241.94,
    "z": 799.69384765625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT127",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1275.74,
    "y": 1874.93,
    "z": 485.6061706543,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT38_2",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1315.88,
    "y": 1507.41,
    "z": 3997.9421386719,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT17",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1037.14,
    "y": 1345.06,
    "z": 7728.0405273438,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT14",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1375.83,
    "y": 1258.05,
    "z": 14188.654296875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT26_3",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 750.57,
    "y": 1629.42,
    "z": 6632.6787109375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT26_7",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3022.17,
    "y": 4176.01,
    "z": -1773.4708251953,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT27_8",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2839.74,
    "y": 3863.85,
    "z": -3128.2805175781,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT24_5",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3089.34,
    "y": 3938.95,
    "z": -8892.1572265625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT18_9",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3110.37,
    "y": 4102.01,
    "z": -2772.7158203125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT25_6",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3252.59,
    "y": 3876.72,
    "z": -9177.3359375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT23_27",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3753.32,
    "y": 3237.08,
    "z": -4900.2631835938,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT1_C_14",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3811.86,
    "y": 3292.69,
    "z": -950.5849609375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT21_25",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3867.2,
    "y": 3265.52,
    "z": 8746.177734375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT13_4",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3410.07,
    "y": 3598.73,
    "z": 3372.4113769531,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT21_2",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3354.17,
    "y": 3754.93,
    "z": 771.38903808594,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT9",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3375.76,
    "y": 3115.46,
    "z": 6673,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT1_C_13",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3541.48,
    "y": 3247.76,
    "z": 78.672058105469,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F0426401_1291680381",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3625.84,
    "y": 3323.32,
    "z": 12483,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT22_16",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2898.01,
    "y": 3223,
    "z": 9321.00390625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT23_17",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3100.52,
    "y": 3302.66,
    "z": 12593.233398438,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F0006401_1631706786",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3185.82,
    "y": 3207.76,
    "z": 14153,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT19_10",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3292.22,
    "y": 3650.37,
    "z": -5233.8427734375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT22_3",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3183.38,
    "y": 3662.12,
    "z": -4478.0439453125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT120",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2953.9,
    "y": 1495.09,
    "z": 5030,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT94_1",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2984.59,
    "y": 1482.34,
    "z": 19742,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT31_UAID_40B076DF2F7932A801_1176269369",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3454.14,
    "y": 1827.92,
    "z": 2416.9909667969,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT31_UAID_40B076DF2F7932A801_1267200370",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2982.72,
    "y": 1668.13,
    "z": 3788.9909667969,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT91_0",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3140.94,
    "y": 1585.39,
    "z": 16336,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_40B076DF2F794FA001_1689147024",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 4091.4,
    "y": 1497.8,
    "z": 3508,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F0226201_2044450637",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3660.78,
    "y": 1445.52,
    "z": 4518,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT39_3",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3693.71,
    "y": 1237.36,
    "z": 6126.1572265625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT122_3",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3583.58,
    "y": 1208.61,
    "z": 24567,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F01E6201_1415384932",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3919.36,
    "y": 947.48,
    "z": 1102,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT43",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 4075.13,
    "y": 927.7,
    "z": 3059.5737304688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_30",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3778.38,
    "y": 758.83,
    "z": 9879,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT81",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3719.72,
    "y": 502.08,
    "z": 1313.75,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT53",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3766.33,
    "y": 583.31,
    "z": 18486.205078125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT82",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3853.95,
    "y": 601.6,
    "z": 2898.75,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_31",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3621.67,
    "y": 848.04,
    "z": 8273,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT71",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3707.43,
    "y": 861.79,
    "z": 1261.75,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT86_0",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3517.6,
    "y": 1023.32,
    "z": 24626,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT75",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3903.79,
    "y": 788.65,
    "z": 6537.04296875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT33_18",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3499.31,
    "y": 476.35,
    "z": 22415,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT65_1",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3977.45,
    "y": 522.6,
    "z": 6152.04296875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F01D6201_1995497755",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3720.25,
    "y": 1063.13,
    "z": 4296,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT76",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3662.51,
    "y": 1060.13,
    "z": 1283.75,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT51",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3724.79,
    "y": 1005.76,
    "z": 13622.75,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT41",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 4310.7,
    "y": 1778.14,
    "z": 12732.588867188,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT109",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3027.04,
    "y": 1277.56,
    "z": -578.990234375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_17",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2952.33,
    "y": 1316.68,
    "z": 1279.6179199219,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_33",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 4307.72,
    "y": 2016.75,
    "z": 5668.5947265625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_32",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 4321.78,
    "y": 2360.58,
    "z": -1447.4111328125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT54",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 4577.26,
    "y": 1862.31,
    "z": 8769.4638671875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F0B36201_2026104153",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 4394.83,
    "y": 2041.83,
    "z": 6118,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_40B076DF2F79AD9B01_1500683292",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 4485.58,
    "y": 1953.95,
    "z": 2424.5888671875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT48",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 4745.92,
    "y": 1717,
    "z": 8561.4638671875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_20",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3379.58,
    "y": 1301.21,
    "z": 27411,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F0B46201_1162892331",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 4551.99,
    "y": 1105.87,
    "z": 4184,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT54_UAID_40B076DF2F793C8101_1652897954",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 4733,
    "y": 1584.45,
    "z": 7326.125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT42",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 4741.31,
    "y": 1025.59,
    "z": 5181.5888671875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F0B46201_1220705332",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 4622.64,
    "y": 970.61,
    "z": 4198,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT40_UAID_04421A9713F0D2E401_2079149903",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 4653.12,
    "y": 826.61,
    "z": -1004.4111328125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT40",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 4563.11,
    "y": 899.09,
    "z": 3096.5888671875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT106",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3175.94,
    "y": 1137.43,
    "z": 8686,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT113_2",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3101.22,
    "y": 1122.73,
    "z": 2629,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT44",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 4282.66,
    "y": 611.64,
    "z": -1756.6904296875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT118",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2942.17,
    "y": 1187.36,
    "z": 8911,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT142",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1332.81,
    "y": 3523.43,
    "z": 622.70825195312,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT103",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2410.48,
    "y": 1216.92,
    "z": 1099.9403076172,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_8",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2704.41,
    "y": 1321.78,
    "z": 6839.6391601562,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_9",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2661.51,
    "y": 1165.17,
    "z": 14884.638671875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_6",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2404.54,
    "y": 1367.41,
    "z": 11787.241210938,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT23_15",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2324.29,
    "y": 3083.1,
    "z": 35420.578125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT78",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 4644.65,
    "y": 1258.23,
    "z": 3946.5888671875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F01D6201_1939266754",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3586.48,
    "y": 902.6,
    "z": 12831,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT109_11",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3499.9,
    "y": 849.22,
    "z": 26623,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT93",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2564.09,
    "y": 1071.28,
    "z": -1077.0596923828,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT85",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2102.83,
    "y": 856.79,
    "z": -736.90380859375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_10",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3342.19,
    "y": 3268.16,
    "z": 17057,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F0466401_1164905096",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3536.05,
    "y": 3578.39,
    "z": 7363,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F0FD6301_1747414245",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3420.67,
    "y": 3408.95,
    "z": 12000,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_27",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3627.34,
    "y": 2659.37,
    "z": -1714.9548339844,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_40B076DF2F79117901_1226789931",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 4705.99,
    "y": 2046.19,
    "z": -315.4111328125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT60",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 4105.51,
    "y": 2189.17,
    "z": 6849.5947265625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_40B076DF2F79A4A101_1223072041",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3757.82,
    "y": 1765.58,
    "z": 3526,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT87_1",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3592.11,
    "y": 645.21,
    "z": 20571,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT119_8",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3366.17,
    "y": 882.75,
    "z": 15323,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_29",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 4130.58,
    "y": 541.99,
    "z": 6721.5268554688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT108_11",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3258.75,
    "y": 689.37,
    "z": 17583,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT106_2",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3252.83,
    "y": 536.34,
    "z": 23785,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_21",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 4038.17,
    "y": 3304.3,
    "z": 156.27182006836,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT73_2",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3257.89,
    "y": 1014.13,
    "z": 8907,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT29_10",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3141.4,
    "y": 4358.02,
    "z": -5032.1762695312,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT23_4",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 3469.09,
    "y": 3985.04,
    "z": 3840.9438476562,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT23",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2800.45,
    "y": 1084.86,
    "z": 10342.724609375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT89",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2547.92,
    "y": 826.13,
    "z": 1570.0437011719,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT104",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2614.44,
    "y": 1218.18,
    "z": 3292.4248046875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT88",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2339.43,
    "y": 939.55,
    "z": 2582.0961914062,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_0",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1973.25,
    "y": 1298.21,
    "z": 11814.252929688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT16_2",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1775.15,
    "y": 1181.39,
    "z": 13112.3515625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT13_2",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 1868.37,
    "y": 772.49,
    "z": 1141.6109619141,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT105",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2690.55,
    "y": 1434.62,
    "z": 15953.424804688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT20",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 2657.73,
    "y": 1459.79,
    "z": 21542.45703125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT125",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 429.94,
    "y": 2465,
    "z": -126.61528778076,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F05E6901_1906631590",
    "type": "mercer_sphere",
    "purity": "normal",
    "x": 755.52,
    "y": 3493.29,
    "z": -1733,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT1_C_12",
    "type": "somersloop",
    "purity": "normal",
    "x": 3077.31,
    "y": 1457.89,
    "z": 16118,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT1_C_20",
    "type": "somersloop",
    "purity": "normal",
    "x": 3513.84,
    "y": 1421.59,
    "z": 30523,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT86",
    "type": "somersloop",
    "purity": "normal",
    "x": 3467.95,
    "y": 1372.57,
    "z": 15332.543945312,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT14_26",
    "type": "somersloop",
    "purity": "normal",
    "x": 2470.75,
    "y": 2696.55,
    "z": 21985.072265625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT19_14",
    "type": "somersloop",
    "purity": "normal",
    "x": 2100.51,
    "y": 2497.67,
    "z": 24136.544921875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT1_C_UAID_04421A9713F0E87A01_1449703843",
    "type": "somersloop",
    "purity": "normal",
    "x": 2585.03,
    "y": 2692.61,
    "z": 22997.9453125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT1_C_5",
    "type": "somersloop",
    "purity": "normal",
    "x": 2684.22,
    "y": 2192.36,
    "z": 6508.7104492188,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT110",
    "type": "somersloop",
    "purity": "normal",
    "x": 1995.35,
    "y": 4278.22,
    "z": -11490.32421875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT14_UAID_04421A9713F0E56401_1503060069",
    "type": "somersloop",
    "purity": "normal",
    "x": 1850.1,
    "y": 2358.36,
    "z": 18663.11328125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT24",
    "type": "somersloop",
    "purity": "normal",
    "x": 628.75,
    "y": 1738.91,
    "z": -660.75244140625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT13",
    "type": "somersloop",
    "purity": "normal",
    "x": 1213.4,
    "y": 1469.79,
    "z": -1739.7607421875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT134",
    "type": "somersloop",
    "purity": "normal",
    "x": 1505.67,
    "y": 2013.53,
    "z": 7321.3764648438,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT1_C_6",
    "type": "somersloop",
    "purity": "normal",
    "x": 2462.22,
    "y": 2415.91,
    "z": 23272.84375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT13_5",
    "type": "somersloop",
    "purity": "normal",
    "x": 1708.87,
    "y": 2600,
    "z": 22881.126953125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT1_C_0",
    "type": "somersloop",
    "purity": "normal",
    "x": 2160.48,
    "y": 2147.66,
    "z": 13702.315429688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT1_C_UAID_04421A9713F024A401_1924847685",
    "type": "somersloop",
    "purity": "normal",
    "x": 1130.86,
    "y": 3106.49,
    "z": 21293,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT110_47",
    "type": "somersloop",
    "purity": "normal",
    "x": 1868.83,
    "y": 2703.49,
    "z": 23611.197265625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT15_13",
    "type": "somersloop",
    "purity": "normal",
    "x": 2055.47,
    "y": 2692.23,
    "z": 24677.744140625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT19_39",
    "type": "somersloop",
    "purity": "normal",
    "x": 1452,
    "y": 2486.16,
    "z": 24246.947265625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT11_35",
    "type": "somersloop",
    "purity": "normal",
    "x": 1966.44,
    "y": 3037.53,
    "z": 21328.41796875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT14_2",
    "type": "somersloop",
    "purity": "normal",
    "x": 2006.16,
    "y": 2249.33,
    "z": 12691.170898438,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT7_3",
    "type": "somersloop",
    "purity": "normal",
    "x": 1661.95,
    "y": 1745.34,
    "z": 6096.6450195312,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT4_8",
    "type": "somersloop",
    "purity": "normal",
    "x": 2352.16,
    "y": 1631.28,
    "z": 16209.456054688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT3_5",
    "type": "somersloop",
    "purity": "normal",
    "x": 2732.7,
    "y": 1618.92,
    "z": 14976.610351562,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT16",
    "type": "somersloop",
    "purity": "normal",
    "x": 613.37,
    "y": 1286.31,
    "z": 5384.951171875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT1_C_10",
    "type": "somersloop",
    "purity": "normal",
    "x": 3013.21,
    "y": 2185.04,
    "z": 13045.754882812,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT1_C_7",
    "type": "somersloop",
    "purity": "normal",
    "x": 2789.33,
    "y": 2124.44,
    "z": 16329.404296875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT35_7",
    "type": "somersloop",
    "purity": "normal",
    "x": 3456.28,
    "y": 1951.93,
    "z": 1415.9259033203,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT37_13",
    "type": "somersloop",
    "purity": "normal",
    "x": 3171.66,
    "y": 2007.41,
    "z": 11314.807617188,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_UAID_04421A9713F0F27A01_1759969627",
    "type": "somersloop",
    "purity": "normal",
    "x": 3154.06,
    "y": 2742.78,
    "z": 10848,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT1_C_UAID_04421A9713F0F57A01_1575931164",
    "type": "somersloop",
    "purity": "normal",
    "x": 3148.4,
    "y": 2938.75,
    "z": -211.84173583984,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT1_C_UAID_04421A9713F0F37A01_1079321804",
    "type": "somersloop",
    "purity": "normal",
    "x": 3085.07,
    "y": 2904.22,
    "z": 20000,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT17_30",
    "type": "somersloop",
    "purity": "normal",
    "x": 1065.43,
    "y": 2641.26,
    "z": 21901.20703125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT13_17",
    "type": "somersloop",
    "purity": "normal",
    "x": 3009.4,
    "y": 3037.87,
    "z": 17596.953125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT12_1",
    "type": "somersloop",
    "purity": "normal",
    "x": 3352.93,
    "y": 2881.08,
    "z": 4282.2944335938,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT1_C_UAID_04421A9713F0F27A01_1137768619",
    "type": "somersloop",
    "purity": "normal",
    "x": 3422.78,
    "y": 2548.62,
    "z": 19716,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT1_C_UAID_04421A9713F0E57A01_1732622300",
    "type": "somersloop",
    "purity": "normal",
    "x": 3119.68,
    "y": 2629.55,
    "z": 14860.890625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT41_6362",
    "type": "somersloop",
    "purity": "normal",
    "x": 3225.31,
    "y": 2428.83,
    "z": 20169.61328125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT1_C_UAID_04421A9713F0EE7A01_1306830904",
    "type": "somersloop",
    "purity": "normal",
    "x": 2805.1,
    "y": 2697.97,
    "z": 18323.51171875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT18",
    "type": "somersloop",
    "purity": "normal",
    "x": 1528.06,
    "y": 3725.73,
    "z": 2787.7216796875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT25_382",
    "type": "somersloop",
    "purity": "normal",
    "x": 1776.52,
    "y": 3348.62,
    "z": 5069.8251953125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT11_1",
    "type": "somersloop",
    "purity": "normal",
    "x": 1823.35,
    "y": 3960.44,
    "z": -3797.9631347656,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT13_3",
    "type": "somersloop",
    "purity": "normal",
    "x": 1748.71,
    "y": 4351.29,
    "z": -800.67004394531,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT100_3119",
    "type": "somersloop",
    "purity": "normal",
    "x": 2436.98,
    "y": 3651.11,
    "z": 1546.0798339844,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT14_18",
    "type": "somersloop",
    "purity": "normal",
    "x": 2308.13,
    "y": 3337.77,
    "z": 13875.861328125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT92",
    "type": "somersloop",
    "purity": "normal",
    "x": 2566.21,
    "y": 4038.57,
    "z": -3434.0659179688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT147",
    "type": "somersloop",
    "purity": "normal",
    "x": 638.38,
    "y": 2817.32,
    "z": 14435.059570312,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT1_C_18",
    "type": "somersloop",
    "purity": "normal",
    "x": 3617.98,
    "y": 2854.4,
    "z": -1361.8114013672,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_24",
    "type": "somersloop",
    "purity": "normal",
    "x": 3607.45,
    "y": 3465.83,
    "z": 7984.388671875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT1_C_15",
    "type": "somersloop",
    "purity": "normal",
    "x": 3712.7,
    "y": 3400.38,
    "z": -11330.91796875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT1_C_16",
    "type": "somersloop",
    "purity": "normal",
    "x": 3982.51,
    "y": 3039.26,
    "z": -1571.0120849609,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT1_C_21",
    "type": "somersloop",
    "purity": "normal",
    "x": 4225.81,
    "y": 2437.06,
    "z": 5572.76953125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT1_C_UAID_04421A9713F0F57A01_1942877174",
    "type": "somersloop",
    "purity": "normal",
    "x": 3753.09,
    "y": 2353.27,
    "z": -195,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT70",
    "type": "somersloop",
    "purity": "normal",
    "x": 3585.6,
    "y": 2194.38,
    "z": 15881.250976562,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT1_C_UAID_04421A9713F05F6901_1130070767",
    "type": "somersloop",
    "purity": "normal",
    "x": 609.28,
    "y": 3177.44,
    "z": -14,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT12_25",
    "type": "somersloop",
    "purity": "normal",
    "x": 1063.27,
    "y": 2766.72,
    "z": 17845.29296875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT1_C_UAID_04421A9713F023A401_1359406508",
    "type": "somersloop",
    "purity": "normal",
    "x": 1041.08,
    "y": 2920.49,
    "z": 11052.723632812,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT137",
    "type": "somersloop",
    "purity": "normal",
    "x": 1307.2,
    "y": 2985.94,
    "z": 4949.6508789062,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT138",
    "type": "somersloop",
    "purity": "normal",
    "x": 1410.73,
    "y": 3831.59,
    "z": 6687.0185546875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT133",
    "type": "somersloop",
    "purity": "normal",
    "x": 407.58,
    "y": 2212.92,
    "z": 2114.7236328125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT1_C_UAID_04421A9713F022A401_1406932331",
    "type": "somersloop",
    "purity": "normal",
    "x": 1233.02,
    "y": 3424.23,
    "z": 15453,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT1_C_UAID_04421A9713F0C46101_1282102099",
    "type": "somersloop",
    "purity": "normal",
    "x": 1106.97,
    "y": 2124.99,
    "z": 954,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT15",
    "type": "somersloop",
    "purity": "normal",
    "x": 1158.98,
    "y": 1796.19,
    "z": -2841.4868164062,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT14_5",
    "type": "somersloop",
    "purity": "normal",
    "x": 3064.82,
    "y": 4246.86,
    "z": 5220.626953125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT11_0",
    "type": "somersloop",
    "purity": "normal",
    "x": 3296.03,
    "y": 4042.4,
    "z": -8566.578125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT1_C_UAID_04421A9713F0416401_2093804204",
    "type": "somersloop",
    "purity": "normal",
    "x": 3576.25,
    "y": 3237.93,
    "z": -5163.4340820312,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT1_2",
    "type": "somersloop",
    "purity": "normal",
    "x": 3378.97,
    "y": 3212.2,
    "z": 12254,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT12_16",
    "type": "somersloop",
    "purity": "normal",
    "x": 3171.77,
    "y": 3136.54,
    "z": 25683.361328125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT17_8",
    "type": "somersloop",
    "purity": "normal",
    "x": 3241.62,
    "y": 3548.34,
    "z": 10189.131835938,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT12_3",
    "type": "somersloop",
    "purity": "normal",
    "x": 2972.02,
    "y": 3780.35,
    "z": -5000.5200195312,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT123_1",
    "type": "somersloop",
    "purity": "normal",
    "x": 3561.54,
    "y": 1255.69,
    "z": 7430,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT57",
    "type": "somersloop",
    "purity": "normal",
    "x": 3907.95,
    "y": 1203.9,
    "z": 3963.8012695312,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT58",
    "type": "somersloop",
    "purity": "normal",
    "x": 4133.11,
    "y": 914.68,
    "z": 5419.564453125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT55",
    "type": "somersloop",
    "purity": "normal",
    "x": 4032.89,
    "y": 444.98,
    "z": 3041.115234375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT64",
    "type": "somersloop",
    "purity": "normal",
    "x": 3781.86,
    "y": 781.68,
    "z": -323.94284057617,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT83_2",
    "type": "somersloop",
    "purity": "normal",
    "x": 3650.48,
    "y": 565.85,
    "z": 15266.328125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT52",
    "type": "somersloop",
    "purity": "normal",
    "x": 3928.58,
    "y": 769.12,
    "z": 17590.37890625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT74",
    "type": "somersloop",
    "purity": "normal",
    "x": 3926.89,
    "y": 577.47,
    "z": 22833.044921875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT17_6",
    "type": "somersloop",
    "purity": "normal",
    "x": 4259.28,
    "y": 2098.6,
    "z": 5927.8647460938,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT62",
    "type": "somersloop",
    "purity": "normal",
    "x": 4236.99,
    "y": 1898.28,
    "z": 8315.33984375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT3",
    "type": "somersloop",
    "purity": "normal",
    "x": 4355.85,
    "y": 2410.77,
    "z": -1105.5578613281,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT1_C_UAID_04421A9713F0B36201_2077013154",
    "type": "somersloop",
    "purity": "normal",
    "x": 4629.58,
    "y": 1089.73,
    "z": 5163,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT18_1",
    "type": "somersloop",
    "purity": "normal",
    "x": 4373.03,
    "y": 1014.69,
    "z": 4584.3940429688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT19_3",
    "type": "somersloop",
    "purity": "normal",
    "x": 4771.78,
    "y": 889.55,
    "z": 5424.0625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT5_2",
    "type": "somersloop",
    "purity": "normal",
    "x": 1638.17,
    "y": 1226.26,
    "z": 17541.232421875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT10",
    "type": "somersloop",
    "purity": "normal",
    "x": 2297.74,
    "y": 827.74,
    "z": 4921.6206054688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT1_C_1",
    "type": "somersloop",
    "purity": "normal",
    "x": 2747.71,
    "y": 1258.12,
    "z": 10491.397460938,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT11_2",
    "type": "somersloop",
    "purity": "normal",
    "x": 2323.55,
    "y": 2990.54,
    "z": 22864.162109375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT66",
    "type": "somersloop",
    "purity": "normal",
    "x": 4118.01,
    "y": 1402.16,
    "z": 1423.0413818359,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT49",
    "type": "somersloop",
    "purity": "normal",
    "x": 4683.9,
    "y": 1693.97,
    "z": 7257.98828125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT1_C_4",
    "type": "somersloop",
    "purity": "normal",
    "x": 2275.94,
    "y": 2061.86,
    "z": 10249.309570312,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT2_C_22",
    "type": "somersloop",
    "purity": "normal",
    "x": 3824.29,
    "y": 3484.85,
    "z": 14872,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT121",
    "type": "somersloop",
    "purity": "normal",
    "x": 3563.78,
    "y": 840.3,
    "z": 20268,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT45",
    "type": "somersloop",
    "purity": "normal",
    "x": 4866.74,
    "y": 1422.97,
    "z": 5525.1123046875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_Crystal_mk3_C_36",
    "type": "somersloop",
    "purity": "normal",
    "x": 3539.56,
    "y": 3636.2,
    "z": 22366.71484375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT78_0",
    "type": "somersloop",
    "purity": "normal",
    "x": 3569.91,
    "y": 768.9,
    "z": -1601.0645751953,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT80_2",
    "type": "somersloop",
    "purity": "normal",
    "x": 3429.27,
    "y": 834.15,
    "z": 13564.590820312,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT1_C_UAID_04421A9713F0565301_1886270961",
    "type": "somersloop",
    "purity": "normal",
    "x": 3302.76,
    "y": 721.15,
    "z": 663.10137939453,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT1_C_11",
    "type": "somersloop",
    "purity": "normal",
    "x": 2910.12,
    "y": 1090.01,
    "z": 1612.9814453125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT10_UAID_40B076DF2F79B75201_1879979970",
    "type": "somersloop",
    "purity": "normal",
    "x": 2336.11,
    "y": 946.44,
    "z": -1782.5323486328,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT1_C_2",
    "type": "somersloop",
    "purity": "normal",
    "x": 1973.28,
    "y": 989.65,
    "z": -1717.7353515625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT1_C_3",
    "type": "somersloop",
    "purity": "normal",
    "x": 1745.42,
    "y": 875.54,
    "z": 1998.3366699219,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT17_7",
    "type": "somersloop",
    "purity": "normal",
    "x": 2418.83,
    "y": 4331.62,
    "z": 185.84757995605,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT19",
    "type": "somersloop",
    "purity": "normal",
    "x": 1708.37,
    "y": 4520.59,
    "z": -6019.4663085938,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT16_7",
    "type": "somersloop",
    "purity": "normal",
    "x": 3522.82,
    "y": 3794.64,
    "z": 17625.857421875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_WAT15_6",
    "type": "somersloop",
    "purity": "normal",
    "x": 3462.08,
    "y": 3826.96,
    "z": -4851.6459960938,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod4_25",
    "type": "crash_site",
    "purity": "normal",
    "x": 1940.56,
    "y": 2530.84,
    "z": 23519.095703125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod2_1325",
    "type": "crash_site",
    "purity": "normal",
    "x": 858.17,
    "y": 2102.37,
    "z": -84.333374023438,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod3_12",
    "type": "crash_site",
    "purity": "normal",
    "x": 3432.03,
    "y": 3668.28,
    "z": 11478.567382812,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod1_2",
    "type": "crash_site",
    "purity": "normal",
    "x": 3210.71,
    "y": 2228.84,
    "z": 13694.84765625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod_C_UAID_04421A9713F0FF6301_1123988602",
    "type": "crash_site",
    "purity": "normal",
    "x": 3381.15,
    "y": 3121.11,
    "z": 17755,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod39",
    "type": "crash_site",
    "purity": "normal",
    "x": 2958.06,
    "y": 1393.67,
    "z": -171.06915283203,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod25",
    "type": "crash_site",
    "purity": "normal",
    "x": 3222.96,
    "y": 1530.71,
    "z": 23164.8515625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod45_6",
    "type": "crash_site",
    "purity": "normal",
    "x": 3434.73,
    "y": 1646.81,
    "z": 16020,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod28_23787",
    "type": "crash_site",
    "purity": "normal",
    "x": 3712.3,
    "y": 2359.84,
    "z": 8979.958984375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod43_2",
    "type": "crash_site",
    "purity": "normal",
    "x": 3337.3,
    "y": 872.79,
    "z": 7165,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod29_27444",
    "type": "crash_site",
    "purity": "normal",
    "x": 2790.97,
    "y": 2810.73,
    "z": 9435,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod3_4",
    "type": "crash_site",
    "purity": "normal",
    "x": 2795.46,
    "y": 3198.33,
    "z": 9860.046875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod12",
    "type": "crash_site",
    "purity": "normal",
    "x": 2131.38,
    "y": 1988.64,
    "z": 13618.501953125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod1",
    "type": "crash_site",
    "purity": "normal",
    "x": 2747.47,
    "y": 2077.32,
    "z": 13444.25,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod13",
    "type": "crash_site",
    "purity": "normal",
    "x": 2530.94,
    "y": 2154.91,
    "z": 14363.263671875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod2_10",
    "type": "crash_site",
    "purity": "normal",
    "x": 1641.36,
    "y": 3101,
    "z": 20305.7734375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod1_22",
    "type": "crash_site",
    "purity": "normal",
    "x": 1528.12,
    "y": 2542.78,
    "z": 25142.943359375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod_C_4",
    "type": "crash_site",
    "purity": "normal",
    "x": 1969.03,
    "y": 2345.73,
    "z": 17384.154296875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod3_2",
    "type": "crash_site",
    "purity": "normal",
    "x": 1788.59,
    "y": 2011.52,
    "z": 27668.361328125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod6_2102",
    "type": "crash_site",
    "purity": "normal",
    "x": 1437.85,
    "y": 3213.82,
    "z": 10154,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod2",
    "type": "crash_site",
    "purity": "normal",
    "x": 1987.3,
    "y": 1637.64,
    "z": 7780.9321289062,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod30_6998",
    "type": "crash_site",
    "purity": "normal",
    "x": 3296.07,
    "y": 2425.99,
    "z": 18823.9140625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod_C_5",
    "type": "crash_site",
    "purity": "normal",
    "x": 2905.68,
    "y": 2133.62,
    "z": 17081,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod_C_6",
    "type": "crash_site",
    "purity": "normal",
    "x": 2999.1,
    "y": 2263.82,
    "z": 8220.5615234375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod_C_UAID_04421A9713F03B7C01_1712034537",
    "type": "crash_site",
    "purity": "normal",
    "x": 3485.07,
    "y": 2222.32,
    "z": 13786,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod38",
    "type": "crash_site",
    "purity": "normal",
    "x": 2724.26,
    "y": 1357.66,
    "z": -290.72470092773,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod27_20823",
    "type": "crash_site",
    "purity": "normal",
    "x": 3255.69,
    "y": 2904.53,
    "z": 21481,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod4_8033",
    "type": "crash_site",
    "purity": "normal",
    "x": 3125.45,
    "y": 2737.91,
    "z": 17301.25390625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod_C_UAID_04421A9713F03B7C01_1807913538",
    "type": "crash_site",
    "purity": "normal",
    "x": 2969.54,
    "y": 2798,
    "z": 17373,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod_C_UAID_04421A9713F03C7C01_1131248715",
    "type": "crash_site",
    "purity": "normal",
    "x": 3417.66,
    "y": 2609.91,
    "z": 12949,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod4_1",
    "type": "crash_site",
    "purity": "normal",
    "x": 3120.22,
    "y": 3112.42,
    "z": 24990.03515625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod6_27",
    "type": "crash_site",
    "purity": "normal",
    "x": 1927.1,
    "y": 3272.27,
    "z": 21827.935546875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod33",
    "type": "crash_site",
    "purity": "normal",
    "x": 1637.04,
    "y": 4443.76,
    "z": -4767,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod17_7892",
    "type": "crash_site",
    "purity": "normal",
    "x": 1437.59,
    "y": 3920.79,
    "z": 3200.8166503906,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod2_0",
    "type": "crash_site",
    "purity": "normal",
    "x": 2481.09,
    "y": 3798.7,
    "z": 2890.685546875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod32_1",
    "type": "crash_site",
    "purity": "normal",
    "x": 2764.63,
    "y": 3358.71,
    "z": 9112.5146484375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod3_5",
    "type": "crash_site",
    "purity": "normal",
    "x": 2353.99,
    "y": 3783.64,
    "z": 17459.802734375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod7",
    "type": "crash_site",
    "purity": "normal",
    "x": 3602.88,
    "y": 2494.6,
    "z": -1592.9055175781,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod2_1",
    "type": "crash_site",
    "purity": "normal",
    "x": 3557.4,
    "y": 2051.09,
    "z": 14011.010742188,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod5_740",
    "type": "crash_site",
    "purity": "normal",
    "x": 1150.83,
    "y": 2978.63,
    "z": 9945,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod11_2",
    "type": "crash_site",
    "purity": "normal",
    "x": 574.42,
    "y": 2611.66,
    "z": 19741.078125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod3_8348",
    "type": "crash_site",
    "purity": "normal",
    "x": 613.31,
    "y": 2154.14,
    "z": -386,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod4_9",
    "type": "crash_site",
    "purity": "normal",
    "x": 2951.47,
    "y": 3973.06,
    "z": -7063.04296875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod2_11",
    "type": "crash_site",
    "purity": "normal",
    "x": 3409.35,
    "y": 3984.71,
    "z": -3215.4672851562,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod_C_UAID_04421A9713F0486401_1144991453",
    "type": "crash_site",
    "purity": "normal",
    "x": 3772.39,
    "y": 3370.41,
    "z": 17157,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod8",
    "type": "crash_site",
    "purity": "normal",
    "x": 3907.45,
    "y": 3325.65,
    "z": -2597.287109375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod5",
    "type": "crash_site",
    "purity": "normal",
    "x": 3671.67,
    "y": 3149.26,
    "z": 7339.3720703125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod21_2",
    "type": "crash_site",
    "purity": "normal",
    "x": 4129.83,
    "y": 1344.23,
    "z": 8083.0151367188,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod_C_12",
    "type": "crash_site",
    "purity": "normal",
    "x": 3738.91,
    "y": 418.61,
    "z": 9971.1552734375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod2_6",
    "type": "crash_site",
    "purity": "normal",
    "x": 4562.66,
    "y": 1786.93,
    "z": 11815.235351562,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod4_12",
    "type": "crash_site",
    "purity": "normal",
    "x": 1115.94,
    "y": 2454.38,
    "z": 25128.533203125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod_C_10",
    "type": "crash_site",
    "purity": "normal",
    "x": 1216.42,
    "y": 2655.9,
    "z": 32660,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod22",
    "type": "crash_site",
    "purity": "normal",
    "x": 4606.13,
    "y": 476.42,
    "z": -7288.5131835938,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod5_9",
    "type": "crash_site",
    "purity": "normal",
    "x": 4490.56,
    "y": 2237.98,
    "z": -1485.3040771484,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod3_3",
    "type": "crash_site",
    "purity": "normal",
    "x": 4107.54,
    "y": 2994.03,
    "z": -1574.7036132812,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod37",
    "type": "crash_site",
    "purity": "normal",
    "x": 2459.84,
    "y": 870.4,
    "z": -874.52062988281,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod1_4",
    "type": "crash_site",
    "purity": "normal",
    "x": 4183.16,
    "y": 858.26,
    "z": 5487.8237304688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod31",
    "type": "crash_site",
    "purity": "normal",
    "x": 3499.01,
    "y": 3374.2,
    "z": 6341.1127929688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod42_5",
    "type": "crash_site",
    "purity": "normal",
    "x": 3434.2,
    "y": 920.54,
    "z": 23130,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod1_8",
    "type": "crash_site",
    "purity": "normal",
    "x": 3338.49,
    "y": 4115.25,
    "z": -9780.2314453125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod39_UAID_40B076DF2F79F35F01_1355966267",
    "type": "crash_site",
    "purity": "normal",
    "x": 2513.87,
    "y": 1407.68,
    "z": 15413.930664062,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod34",
    "type": "crash_site",
    "purity": "normal",
    "x": 1147.92,
    "y": 4023.73,
    "z": 1052,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod36",
    "type": "crash_site",
    "purity": "normal",
    "x": 2161.85,
    "y": 917.56,
    "z": -1760.7264404297,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod36_UAID_40B076DF2F79496001_1121515405",
    "type": "crash_site",
    "purity": "normal",
    "x": 1825.17,
    "y": 771.06,
    "z": -1667.7264404297,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod26",
    "type": "crash_site",
    "purity": "normal",
    "x": 1795.47,
    "y": 1133.16,
    "z": 7844.7626953125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod_C_3",
    "type": "crash_site",
    "purity": "normal",
    "x": 1189.47,
    "y": 1584.41,
    "z": 2357.7893066406,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod24_1",
    "type": "crash_site",
    "purity": "normal",
    "x": 3328.66,
    "y": 656.84,
    "z": 21151.328125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod_C_0",
    "type": "crash_site",
    "purity": "normal",
    "x": 1338.53,
    "y": 1384.37,
    "z": 29710.71875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod3",
    "type": "crash_site",
    "purity": "normal",
    "x": 999.86,
    "y": 1184.56,
    "z": -1538.0528564453,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod_C_UAID_04421A9713F020A401_1123860977",
    "type": "crash_site",
    "purity": "normal",
    "x": 1065.87,
    "y": 3531.9,
    "z": 12383,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod_C_UAID_04421A9713F020A401_1502230978",
    "type": "crash_site",
    "purity": "normal",
    "x": 1215.27,
    "y": 3148.11,
    "z": 18517,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod16_4595",
    "type": "crash_site",
    "purity": "normal",
    "x": 2365.24,
    "y": 4272.98,
    "z": -987.38519287109,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod_C_9",
    "type": "crash_site",
    "purity": "normal",
    "x": 1531.58,
    "y": 2764.82,
    "z": 19832.365234375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod3_11",
    "type": "crash_site",
    "purity": "normal",
    "x": 1894.88,
    "y": 2915.33,
    "z": 26261.65625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod2_5",
    "type": "crash_site",
    "purity": "normal",
    "x": 2469.63,
    "y": 3440.88,
    "z": 13064.624023438,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod2_23",
    "type": "crash_site",
    "purity": "normal",
    "x": 2244.39,
    "y": 3256.18,
    "z": 26721.71875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod_C_UAID_04421A9713F03B7C01_1559404536",
    "type": "crash_site",
    "purity": "normal",
    "x": 2935.66,
    "y": 2638.96,
    "z": 15519,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod_C_2",
    "type": "crash_site",
    "purity": "normal",
    "x": 3166.62,
    "y": 3472.6,
    "z": 7727.5146484375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod6",
    "type": "crash_site",
    "purity": "normal",
    "x": 3980.21,
    "y": 2683.3,
    "z": -1586.1102294922,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod9",
    "type": "crash_site",
    "purity": "normal",
    "x": 3828.29,
    "y": 2892.56,
    "z": 2430.3151855469,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod10",
    "type": "crash_site",
    "purity": "normal",
    "x": 3709.79,
    "y": 2677.33,
    "z": -1629,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod_C_11",
    "type": "crash_site",
    "purity": "normal",
    "x": 3623.21,
    "y": 1166.29,
    "z": 6503.6499023438,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod19",
    "type": "crash_site",
    "purity": "normal",
    "x": 2220.6,
    "y": 2218.38,
    "z": 13053.444335938,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod_C_UAID_04421A9713F01FA401_2123550800",
    "type": "crash_site",
    "purity": "normal",
    "x": 890.76,
    "y": 2941.72,
    "z": 23751,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod4_13058",
    "type": "crash_site",
    "purity": "normal",
    "x": 828.53,
    "y": 2378.16,
    "z": 12193.295898438,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod3_24",
    "type": "crash_site",
    "purity": "normal",
    "x": 2139.35,
    "y": 2911.06,
    "z": 22109.423828125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod35",
    "type": "crash_site",
    "purity": "normal",
    "x": 2198.09,
    "y": 1251.4,
    "z": -1608.4810791016,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod4_7",
    "type": "crash_site",
    "purity": "normal",
    "x": 2817.89,
    "y": 1499.67,
    "z": 2552.4711914062,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod42",
    "type": "crash_site",
    "purity": "normal",
    "x": 3636.03,
    "y": 3733.56,
    "z": 11560,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod3_8",
    "type": "crash_site",
    "purity": "normal",
    "x": 1782.97,
    "y": 1531.97,
    "z": 2202.423828125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod40_1163",
    "type": "crash_site",
    "purity": "normal",
    "x": 2305.19,
    "y": 3377.02,
    "z": 2510.828125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod2_2",
    "type": "crash_site",
    "purity": "normal",
    "x": 3710.57,
    "y": 3028.25,
    "z": -1275.73828125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod_1145",
    "type": "crash_site",
    "purity": "normal",
    "x": 1115.92,
    "y": 2050.35,
    "z": 11766.45703125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod20",
    "type": "crash_site",
    "purity": "normal",
    "x": 2606.94,
    "y": 2405.61,
    "z": 13420.91796875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod1_1",
    "type": "crash_site",
    "purity": "normal",
    "x": 4117.38,
    "y": 2496.73,
    "z": 522.86364746094,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod4_4",
    "type": "crash_site",
    "purity": "normal",
    "x": 3438.07,
    "y": 2747.23,
    "z": 5676.720703125,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod5_26",
    "type": "crash_site",
    "purity": "normal",
    "x": 2396.64,
    "y": 2606.14,
    "z": 22705.03515625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod5_6",
    "type": "crash_site",
    "purity": "normal",
    "x": 3010.55,
    "y": 1718.7,
    "z": -1397.3220214844,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod1_0",
    "type": "crash_site",
    "purity": "normal",
    "x": 1567.73,
    "y": 2159.47,
    "z": 16019,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod15_821",
    "type": "crash_site",
    "purity": "normal",
    "x": 901.48,
    "y": 3270.51,
    "z": -1764.3046875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod3_1",
    "type": "crash_site",
    "purity": "normal",
    "x": 2281.43,
    "y": 1585.24,
    "z": 13621.961914062,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod4_6",
    "type": "crash_site",
    "purity": "normal",
    "x": 2751.37,
    "y": 3753.52,
    "z": 1420.1120605469,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod14_389",
    "type": "crash_site",
    "purity": "normal",
    "x": 1875.23,
    "y": 3466.75,
    "z": 7472,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod18",
    "type": "crash_site",
    "purity": "normal",
    "x": 432.85,
    "y": 3195.44,
    "z": -1548.1669921875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod23",
    "type": "crash_site",
    "purity": "normal",
    "x": 4563.8,
    "y": 1048.65,
    "z": 3900.66015625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod3_7",
    "type": "crash_site",
    "purity": "normal",
    "x": 3995.9,
    "y": 2146.46,
    "z": 5980.0810546875,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod_C_7",
    "type": "crash_site",
    "purity": "normal",
    "x": 514.64,
    "y": 1549.13,
    "z": 4524.1704101562,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod5_10",
    "type": "crash_site",
    "purity": "normal",
    "x": 3206.18,
    "y": 3772.51,
    "z": -9312.1083984375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod41_8375",
    "type": "crash_site",
    "purity": "normal",
    "x": 2096.18,
    "y": 4011.12,
    "z": -1017.2890625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod_C_8",
    "type": "crash_site",
    "purity": "normal",
    "x": 2593.91,
    "y": 3534.75,
    "z": 14067.2109375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod5_13",
    "type": "crash_site",
    "purity": "normal",
    "x": 1145.27,
    "y": 2721.74,
    "z": 19283.484375,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod1_9",
    "type": "crash_site",
    "purity": "normal",
    "x": 1373.16,
    "y": 2995.01,
    "z": 16995.3515625,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod1_3",
    "type": "crash_site",
    "purity": "normal",
    "x": 2475.65,
    "y": 3972.75,
    "z": 5917.3315429688,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod7_5615",
    "type": "crash_site",
    "purity": "normal",
    "x": 1349.75,
    "y": 3607.13,
    "z": -49,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod44_10",
    "type": "crash_site",
    "purity": "normal",
    "x": 2894.32,
    "y": 1413.5,
    "z": 15570,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod9_1568",
    "type": "crash_site",
    "purity": "normal",
    "x": 1302.29,
    "y": 2896.76,
    "z": 4800,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod4",
    "type": "crash_site",
    "purity": "normal",
    "x": 2903.91,
    "y": 1744.16,
    "z": 12036.184570312,
    "biome": "unknown"
  },
  {
    "id": "Persistent_Level:PersistentLevel.BP_DropPod_C_1",
    "type": "crash_site",
    "purity": "normal",
    "x": 2702.43,
    "y": 2202.93,
    "z": 8303,
    "biome": "unknown"
  }
];
