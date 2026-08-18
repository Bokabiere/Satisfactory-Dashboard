const fs = require('fs');
const path = require('path');

// Base Center Coords at Western Waterfalls Plateau
const BASE_X = -145200;
const BASE_Y = 185600;
const BASE_Z = 8500;

const entities = [];

// Helper to push an entity
function addBuilding(className, relX, relY, relZ, rotYaw = 0, properties = {}) {
  // Convert Yaw to Quaternion
  const rad = (rotYaw * Math.PI) / 180;
  const qz = Math.sin(rad / 2);
  const qw = Math.cos(rad / 2);

  entities.push({
    className: className,
    transform: {
      translation: [BASE_X + relX, BASE_Y + relY, BASE_Z + relZ],
      rotation: [0, 0, qz, qw],
      scale: [1, 1, 1]
    },
    properties: properties
  });
}

const FDN_8x4 = '/Game/FactoryGame/Buildable/Building/Foundation/Build_Foundation_8x4_01.Build_Foundation_8x4_01_C';
const FDN_GLASS = '/Game/FactoryGame/Buildable/Building/Foundation/Build_Foundation_Glass_01.Build_Foundation_Glass_01_C';
const WALL_GLASS = '/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Glass_8x4_01.Build_Wall_Glass_8x4_01_C';
const PILLAR_STONE = '/Game/FactoryGame/Buildable/Building/Pillar/Build_PillarMiddle.Build_PillarMiddle_C';
const SMELTER = '/Game/FactoryGame/Buildable/Factory/SmelterMk1/Build_SmelterMk1.Build_SmelterMk1_C';
const CONSTRUCTOR = '/Game/FactoryGame/Buildable/Factory/ConstructorMk1/Build_ConstructorMk1.Build_ConstructorMk1_C';
const ASSEMBLER = '/Game/FactoryGame/Buildable/Factory/AssemblerMk1/Build_AssemblerMk1.Build_AssemblerMk1_C';
const TRAIN_STATION = '/Game/FactoryGame/Buildable/Factory/Train/Station/Build_TrainStation.Build_TrainStation_C';
const FREIGHT_PLATFORM = '/Game/FactoryGame/Buildable/Factory/Train/Station/Build_TrainDockingStation.Build_TrainDockingStation_C';
const RAIL_TRACK = '/Game/FactoryGame/Buildable/Factory/Train/Track/Build_RailroadTrack.Build_RailroadTrack_C';
const STORAGE_IND = '/Game/FactoryGame/Buildable/Factory/StorageContainerMk2/Build_StorageContainerMk2.Build_StorageContainerMk2_C';
const POWER_POLE = '/Game/FactoryGame/Buildable/Factory/PowerPoleMk3/Build_PowerPoleMk3.Build_PowerPoleMk3_C';
const STREET_LIGHT = '/Game/FactoryGame/Buildable/Factory/Floodlight/Build_StreetLight.Build_StreetLight_C';
const HUB = '/Game/FactoryGame/Buildable/Factory/HubTerminal/Build_HubTerminal.Build_HubTerminal_C';
const MAM = '/Game/FactoryGame/Buildable/Factory/MAM/Build_MAM.Build_MAM_C';

console.log('Generating Grand Campus 1900 3D Architecture...');

// 1. LE GRAND DÔME CENTRAL & TOUR HORLOGE (Center: 0, 0, 0)
for (let x = -2; x <= 2; x++) {
  for (let y = -2; y <= 2; y++) {
    // Ground foundation
    addBuilding(FDN_8x4, x * 800, y * 800, 0);
    // Sandwich technical floor (+6m)
    addBuilding(FDN_8x4, x * 800, y * 800, 600);
    // Polished marble floor (+8m)
    addBuilding(FDN_GLASS, x * 800, y * 800, 800);
    // Upper Dome Ceiling (+18m)
    addBuilding(WALL_GLASS, x * 800, y * 800, 1800, 0);
  }
}
// Add HUB & MAM inside Dome
addBuilding(HUB, -400, 0, 800, 90);
addBuilding(MAM, 400, 0, 800, -90);
addBuilding(POWER_POLE, 0, 0, 800);

// Clock Tower Spire (Center Pillar up to 48m)
for (let h = 1800; h <= 4800; h += 600) {
  addBuilding(PILLAR_STONE, 0, 0, h);
  addBuilding(WALL_GLASS, -400, 0, h, 0);
  addBuilding(WALL_GLASS, 400, 0, h, 180);
}

// 2. PAVILLON A : LES HAUTS FOURNEAUX D'ART (Rel: +4800, 0)
const P1_X = 4800, P1_Y = 0;
for (let x = -2; x <= 1; x++) {
  for (let y = -2; y <= 1; y++) {
    addBuilding(FDN_8x4, P1_X + x * 800, P1_Y + y * 800, 0);
    addBuilding(FDN_8x4, P1_X + x * 800, P1_Y + y * 800, 600);
    addBuilding(FDN_8x4, P1_X + x * 800, P1_Y + y * 800, 800);
    addBuilding(WALL_GLASS, P1_X + x * 800, P1_Y + y * 800, 1600);
  }
}
// 8 Smelters in 2 rows of 4
for (let i = 0; i < 4; i++) {
  addBuilding(SMELTER, P1_X - 800, P1_Y - 1200 + i * 800, 800, 90);
  addBuilding(SMELTER, P1_X + 400, P1_Y - 1200 + i * 800, 800, -90);
}

// 3. PAVILLON B : LA MANUFACTURE D'ESTAMPAGE (Rel: 0, +4800)
const P2_X = 0, P2_Y = 4800;
for (let x = -2; x <= 1; x++) {
  for (let y = -2; y <= 1; y++) {
    addBuilding(FDN_8x4, P2_X + x * 800, P2_Y + y * 800, 0);
    addBuilding(FDN_8x4, P2_X + x * 800, P2_Y + y * 800, 600);
    addBuilding(FDN_8x4, P2_X + x * 800, P2_Y + y * 800, 800);
    addBuilding(WALL_GLASS, P2_X + x * 800, P2_Y + y * 800, 1600);
  }
}
// 8 Constructors
for (let i = 0; i < 4; i++) {
  addBuilding(CONSTRUCTOR, P2_X - 800, P2_Y - 1200 + i * 800, 800, 90);
  addBuilding(CONSTRUCTOR, P2_X + 400, P2_Y - 1200 + i * 800, 800, -90);
}

// 4. PAVILLON C : LA HALLE DES ROTORS (Rel: +4800, +4800)
const P3_X = 4800, P3_Y = 4800;
for (let x = -2; x <= 1; x++) {
  for (let y = -2; y <= 1; y++) {
    addBuilding(FDN_8x4, P3_X + x * 800, P3_Y + y * 800, 0);
    addBuilding(FDN_8x4, P3_X + x * 800, P3_Y + y * 800, 600);
    addBuilding(FDN_8x4, P3_X + x * 800, P3_Y + y * 800, 800);
    addBuilding(WALL_GLASS, P3_X + x * 800, P3_Y + y * 800, 1800);
  }
}
// 4 Assemblers
for (let i = 0; i < 4; i++) {
  addBuilding(ASSEMBLER, P3_X - 200, P3_Y - 1200 + i * 1000, 800, 0);
}

// 5. LA GRANDE GARE CATHÉDRALE MULTIVOIES 1-4 (Rel: -6400, 0)
const ST_X = -6400, ST_Y = 0;
for (let x = -2; x <= 2; x++) {
  for (let y = -3; y <= 3; y++) {
    addBuilding(FDN_8x4, ST_X + x * 800, ST_Y + y * 800, 400);
    addBuilding(WALL_GLASS, ST_X + x * 800, ST_Y + y * 800, 1800);
  }
}
// Train Station Head + 4 Freight Platforms
addBuilding(TRAIN_STATION, ST_X, ST_Y - 2400, 800, 0);
for (let i = 0; i < 4; i++) {
  addBuilding(FREIGHT_PLATFORM, ST_X, ST_Y - 1200 + i * 1200, 800, 0);
  // Double Industrial Storage Buffers
  addBuilding(STORAGE_IND, ST_X + 800, ST_Y - 1200 + i * 1200, 800, 90);
  addBuilding(STORAGE_IND, ST_X - 800, ST_Y - 1200 + i * 1200, 800, -90);
}
// Railroad Tracks
for (let y = -4000; y <= 4000; y += 1600) {
  addBuilding(RAIL_TRACK, ST_X, ST_Y + y, 800, 0);
}

// 6. LES PONTS SUSPENDUS & VIADUCS RELIANT TOUT LE COMPLEXE
// Suspension Bridge 1: Dome (0,0) -> Pavillon A (4800,0)
for (let x = 1600; x <= 4000; x += 800) {
  addBuilding(FDN_8x4, x, 0, 800);
  addBuilding(PILLAR_STONE, x, 0, 0);
  addBuilding(STREET_LIGHT, x, 400, 1200);
}
// Suspension Bridge 2: Dome (0,0) -> Pavillon B (0,4800)
for (let y = 1600; y <= 4000; y += 800) {
  addBuilding(FDN_8x4, 0, y, 800);
  addBuilding(PILLAR_STONE, 0, y, 0);
  addBuilding(STREET_LIGHT, 400, y, 1200);
}
// Suspension Bridge 3: Pavillon A -> Pavillon C
for (let y = 1600; y <= 4000; y += 800) {
  addBuilding(FDN_8x4, 4800, y, 800);
  addBuilding(PILLAR_STONE, 4800, y, 0);
}
// Suspension Bridge 4: Pavillon B -> Pavillon C
for (let x = 1600; x <= 4000; x += 800) {
  addBuilding(FDN_8x4, x, 4800, 800);
  addBuilding(PILLAR_STONE, x, 4800, 0);
}
// Viaduc to Train Station: Dome (0,0) -> Station (-6400, 0)
for (let x = -5600; x <= -1600; x += 800) {
  addBuilding(FDN_8x4, x, 0, 800);
  addBuilding(PILLAR_STONE, x, 0, 0);
  addBuilding(STREET_LIGHT, x, 400, 1200);
}

console.log('Total 3D entities generated:', entities.length);

// Final SCIM CBP Payload Structure
const cbpPayload = {
  header: {
    formatVersion: 2,
    type: "megablueprint",
    name: "🏛️ Le Grand Campus Industriel 1900 des Cascades",
    author: "FICSIT Imperial Architecture",
    gameVersion: "1.0+",
    date: new Date().toISOString(),
    description: "MegaBlueprint 1900 complet : Grand Dôme Horloge 48m, 3 Pavillons d'Art (8 Fonderies, 8 Constructeurs, 4 Assembleuses), Grande Gare 1-4 et Ponts Suspendus.",
    footprint: "40x35 Fondations",
    targetCoords: { x: BASE_X, y: BASE_Y, z: BASE_Z }
  },
  entities: entities
};

const cbpJson = JSON.stringify(cbpPayload, null, 2);

// Output Paths
const projectDir = path.join(__dirname, 'satisfactory-dashboard', 'blueprints');
const gameDir = 'C:\\Users\\y007\\AppData\\Local\\FactoryGame\\Saved\\SaveGames\\blueprints\\Boka_2026';
const mobroDir = 'C:\\IA\\Projets\\Mobro-configuration\\satisfactory\\blueprints';

fs.writeFileSync(path.join(projectDir, 'Campus_1900_Cascades.cbp'), cbpJson, 'utf8');
fs.writeFileSync(path.join(projectDir, 'campus_1900_cascades_megablueprint.json'), cbpJson, 'utf8');

if (fs.existsSync(gameDir)) {
  fs.writeFileSync(path.join(gameDir, 'Campus_1900_Cascades.cbp'), cbpJson, 'utf8');
}
if (fs.existsSync(mobroDir)) {
  fs.writeFileSync(path.join(mobroDir, 'Campus_1900_Cascades.cbp'), cbpJson, 'utf8');
}

console.log('Successfully generated complete .cbp with', entities.length, 'entities (Size:', (Buffer.byteLength(cbpJson)/1024).toFixed(2), 'KB)!');
