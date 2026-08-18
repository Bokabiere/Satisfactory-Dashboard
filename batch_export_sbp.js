const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { BLUEPRINTS_DATA } = require('./js/data/blueprints.js');

// Binary Writer
class BinaryWriter {
  constructor() {
    this.buffers = [];
    this.length = 0;
  }

  writeInt8(val) {
    const buf = Buffer.alloc(1);
    buf.writeInt8(val, 0);
    this.buffers.push(buf);
    this.length += 1;
  }

  writeUInt8(val) {
    const buf = Buffer.alloc(1);
    buf.writeUInt8(val, 0);
    this.buffers.push(buf);
    this.length += 1;
  }

  writeInt16(val) {
    const buf = Buffer.alloc(2);
    buf.writeInt16LE(val, 0);
    this.buffers.push(buf);
    this.length += 2;
  }

  writeInt32(val) {
    const buf = Buffer.alloc(4);
    buf.writeInt32LE(val, 0);
    this.buffers.push(buf);
    this.length += 4;
  }

  writeUInt32(val) {
    const buf = Buffer.alloc(4);
    buf.writeUInt32LE(val, 0);
    this.buffers.push(buf);
    this.length += 4;
  }

  writeInt64(val) {
    const buf = Buffer.alloc(8);
    buf.writeBigInt64LE(BigInt(val), 0);
    this.buffers.push(buf);
    this.length += 8;
  }

  writeFloat(val) {
    const buf = Buffer.alloc(4);
    buf.writeFloatLE(val, 0);
    this.buffers.push(buf);
    this.length += 4;
  }

  writeString(str) {
    if (!str || str.length === 0) {
      this.writeInt32(0);
      return;
    }
    const strBuf = Buffer.from(str + '\0', 'utf8');
    this.writeInt32(strBuf.length);
    this.buffers.push(strBuf);
    this.length += strBuf.length;
  }

  writeBuffer(buf) {
    this.buffers.push(buf);
    this.length += buf.length;
  }

  getBuffer() {
    return Buffer.concat(this.buffers, this.length);
  }
}

// Convert Yaw degrees to Quaternion [qx, qy, qz, qw]
function yawToQuat(yawDeg) {
  const rad = (yawDeg * Math.PI) / 180;
  const qz = Math.sin(rad / 2);
  const qw = Math.cos(rad / 2);
  return [0, 0, qz, qw];
}

// Class mappings
const UOBJECT_CLASSES = {
  foundation_8x4: '/Game/FactoryGame/Buildable/Building/Foundation/Build_Foundation_8x4_01.Build_Foundation_8x4_01_C',
  foundation_glass: '/Game/FactoryGame/Buildable/Building/Foundation/Build_Foundation_Glass_01.Build_Foundation_Glass_01_C',
  wall_glass: '/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Glass_8x4_01.Build_Wall_Glass_8x4_01_C',
  smelter: '/Game/FactoryGame/Buildable/Factory/SmelterMk1/Build_SmelterMk1.Build_SmelterMk1_C',
  foundry: '/Game/FactoryGame/Buildable/Factory/FoundryMk1/Build_FoundryMk1.Build_FoundryMk1_C',
  constructor: '/Game/FactoryGame/Buildable/Factory/ConstructorMk1/Build_ConstructorMk1.Build_ConstructorMk1_C',
  assembler: '/Game/FactoryGame/Buildable/Factory/AssemblerMk1/Build_AssemblerMk1.Build_AssemblerMk1_C',
  manufacturer: '/Game/FactoryGame/Buildable/Factory/ManufacturerMk1/Build_ManufacturerMk1.Build_ManufacturerMk1_C',
  refinery: '/Game/FactoryGame/Buildable/Factory/OilRefinery/Build_OilRefinery.Build_OilRefinery_C',
  generator_coal: '/Game/FactoryGame/Buildable/Factory/GeneratorCoal/Build_GeneratorCoal.Build_GeneratorCoal_C',
  generator_fuel: '/Game/FactoryGame/Buildable/Factory/GeneratorFuel/Build_GeneratorFuel.Build_GeneratorFuel_C',
  powerpole: '/Game/FactoryGame/Buildable/Factory/PowerPoleMk1/Build_PowerPoleMk1.Build_PowerPoleMk1_C',
  train_station: '/Game/FactoryGame/Buildable/Factory/Train/Station/Build_TrainStation.Build_TrainStation_C',
  freight_platform: '/Game/FactoryGame/Buildable/Factory/Train/Station/Build_TrainDockingStation.Build_TrainDockingStation_C',
  storage_ind: '/Game/FactoryGame/Buildable/Factory/StorageContainerMk2/Build_StorageContainerMk2.Build_StorageContainerMk2_C'
};

const ITEM_DESC_CLASSES = {
  concrete: '/Game/FactoryGame/Resource/Parts/Concrete/Desc_Concrete.Desc_Concrete_C',
  iron_plate: '/Game/FactoryGame/Resource/Parts/IronPlate/Desc_IronPlate.Desc_IronPlate_C',
  iron_rod: '/Game/FactoryGame/Resource/Parts/IronRod/Desc_IronRod.Desc_IronRod_C',
  wire: '/Game/FactoryGame/Resource/Parts/Wire/Desc_Wire.Desc_Wire_C',
  cable: '/Game/FactoryGame/Resource/Parts/Cable/Desc_Cable.Desc_Cable_C',
  steel_beam: '/Game/FactoryGame/Resource/Parts/SteelPlate/Desc_SteelPlate.Desc_SteelPlate_C',
  steel_pipe: '/Game/FactoryGame/Resource/Parts/SteelPipe/Desc_SteelPipe.Desc_SteelPipe_C',
  reinforced_iron_plate: '/Game/FactoryGame/Resource/Parts/ReinforcedIronPlate/Desc_ReinforcedIronPlate.Desc_ReinforcedIronPlate_C',
  rotor: '/Game/FactoryGame/Resource/Parts/Rotor/Desc_Rotor.Desc_Rotor_C',
  modular_frame: '/Game/FactoryGame/Resource/Parts/ModularFrame/Desc_ModularFrame.Desc_ModularFrame_C',
  heavy_modular_frame: '/Game/FactoryGame/Resource/Parts/ModularFrameHeavy/Desc_ModularFrameHeavy.Desc_ModularFrameHeavy_C',
  computer: '/Game/FactoryGame/Resource/Parts/Computer/Desc_Computer.Desc_Computer_C',
  motor: '/Game/FactoryGame/Resource/Parts/Motor/Desc_Motor.Desc_Motor_C'
};

// Generate SBP & SBPCFG Buffers from blueprint data
function generateSbpBuffers(bp) {
  // Determine Designer dimensions: 4, 5, or 6
  let sizeX = 4, sizeY = 4, sizeZ = 4;
  if (bp.designerSize && bp.designerSize.includes('5x5')) {
    sizeX = 5; sizeY = 5; sizeZ = 5;
  } else if (bp.designerSize && bp.designerSize.includes('6x6')) {
    sizeX = 6; sizeY = 6; sizeZ = 6;
  }

  const buildings = [];

  // Generate foundation platform for designer grid
  const halfSpan = sizeX * 400; // e.g. 1600 for 4x4, 2000 for 5x5, 2400 for 6x6
  const step = 800;
  for (let x = -halfSpan + 400; x <= halfSpan - 400; x += step) {
    for (let y = -halfSpan + 400; y <= halfSpan - 400; y += step) {
      buildings.push({
        className: UOBJECT_CLASSES.foundation_8x4,
        instanceName: `Build_Foundation_8x4_01_C_${Math.floor(2147400000 + Math.random() * 80000)}`,
        pos: [x, y, 200], // Foundation center Z=200, surface Z=400
        rot: [0, 0, 0, 1],
        scale: [1, 1, 1]
      });
    }
  }

  // Parse buildingsCount from BP
  const bldCount = bp.buildingsCount || {};
  const machineEntries = Object.entries(bldCount).filter(([k]) => !k.includes('wall') && !k.includes('pillar') && !k.includes('switch') && !k.includes('signal'));

  // Place machines in rows at Z = 400
  let machineIndex = 0;
  machineEntries.forEach(([bldKey, count]) => {
    const classPath = UOBJECT_CLASSES[bldKey] || UOBJECT_CLASSES.constructor;
    const num = Math.min(count, 12);
    for (let i = 0; i < num; i++) {
      const row = Math.floor(machineIndex / 4);
      const col = machineIndex % 4;
      const x = -1200 + col * 800;
      const y = -600 + row * 1200;
      
      buildings.push({
        className: classPath,
        instanceName: `${classPath.split('.').pop()}_${Math.floor(2147400000 + Math.random() * 80000)}`,
        pos: [x, y, 400],
        rot: yawToQuat(0),
        scale: [1, 1, 1]
      });
      machineIndex++;
    }
  });

  // Central power pole
  buildings.push({
    className: UOBJECT_CLASSES.powerpole,
    instanceName: `Build_PowerPoleMk1_C_${Math.floor(2147400000 + Math.random() * 80000)}`,
    pos: [0, 0, 400],
    rot: yawToQuat(0),
    scale: [1, 1, 1]
  });

  // Material Costs
  const costs = [];
  if (bp.materialsNeeded) {
    Object.entries(bp.materialsNeeded).forEach(([mat, qty]) => {
      costs.push({
        item: ITEM_DESC_CLASSES[mat] || `/Game/FactoryGame/Resource/Parts/Concrete/Desc_Concrete.Desc_Concrete_C`,
        amount: qty
      });
    });
  } else {
    costs.push({ item: ITEM_DESC_CLASSES.concrete, amount: 80 });
  }

  // Recipes
  const recipes = [
    '/Game/FactoryGame/Recipes/Buildings/Recipe_Foundation_8x4_01.Recipe_Foundation_8x4_01_C',
    '/Game/FactoryGame/Recipes/Buildings/Recipe_PowerPoleMk1.Recipe_PowerPoleMk1_C'
  ];

  // 1. Build Payload Body (Uncompressed)
  const bodyWriter = new BinaryWriter();
  
  // Object table
  const objHeaderWriter = new BinaryWriter();
  objHeaderWriter.writeInt32(buildings.length);

  buildings.forEach(b => {
    objHeaderWriter.writeInt32(1); // Actor
    objHeaderWriter.writeString(b.className);
    objHeaderWriter.writeString('Persistent_Level');
    objHeaderWriter.writeString(`Persistent_Level:PersistentLevel.${b.instanceName}`);
    
    // Exact UE5 Save Actor Layout
    objHeaderWriter.writeInt32(8); // flags = 8 (HAS_TRANSFORM)
    objHeaderWriter.writeInt32(1); // needTransform = 1
    // Rotation Quat
    objHeaderWriter.writeFloat(b.rot[0]);
    objHeaderWriter.writeFloat(b.rot[1]);
    objHeaderWriter.writeFloat(b.rot[2]);
    objHeaderWriter.writeFloat(b.rot[3]);
    // Translation
    objHeaderWriter.writeFloat(b.pos[0]);
    objHeaderWriter.writeFloat(b.pos[1]);
    objHeaderWriter.writeFloat(b.pos[2]);
    // Scale
    objHeaderWriter.writeFloat(b.scale[0]);
    objHeaderWriter.writeFloat(b.scale[1]);
    objHeaderWriter.writeFloat(b.scale[2]);
    
    objHeaderWriter.writeInt32(0); // wasPlacedInLevel = 0
  });

  const objHeaderBuf = objHeaderWriter.getBuffer();

  // Properties table
  const propWriter = new BinaryWriter();
  propWriter.writeInt32(buildings.length);

  buildings.forEach(b => {
    const entPropWriter = new BinaryWriter();
    entPropWriter.writeString('Persistent_Level');
    entPropWriter.writeString(`Persistent_Level:PersistentLevel.${b.instanceName}`);
    entPropWriter.writeString('None'); // None terminator
    
    const entBuf = entPropWriter.getBuffer();
    propWriter.writeInt32(entBuf.length + 4);
    propWriter.writeBuffer(entBuf);
  });

  const propBuf = propWriter.getBuffer();

  // Total uncompressed body
  const totalBodyPayload = Buffer.concat([objHeaderBuf, propBuf]);
  bodyWriter.writeInt32(totalBodyPayload.length + 4);
  bodyWriter.writeInt32(objHeaderBuf.length);
  bodyWriter.writeBuffer(totalBodyPayload);

  const uncompressedBody = bodyWriter.getBuffer();
  const compressedBody = zlib.deflateSync(uncompressedBody);

  // 2. Build SBP File
  const sbpWriter = new BinaryWriter();
  sbpWriter.writeInt32(2); // BlueprintVersion
  sbpWriter.writeInt32(60); // BuildVersion
  sbpWriter.writeInt32(491125); // SaveVersion (1.0)
  sbpWriter.writeInt32(sizeX);
  sbpWriter.writeInt32(sizeY);
  sbpWriter.writeInt32(sizeZ);

  sbpWriter.writeInt32(costs.length);
  costs.forEach(c => {
    sbpWriter.writeInt32(0);
    sbpWriter.writeString(c.item);
    sbpWriter.writeInt32(c.amount);
  });

  sbpWriter.writeInt32(recipes.length);
  recipes.forEach(r => {
    sbpWriter.writeInt32(0);
    sbpWriter.writeString(r);
  });

  sbpWriter.writeInt32(0); // gvasSaveHeaderType
  sbpWriter.writeInt32(522); // gvasSaveVersion
  sbpWriter.writeInt32(1017); // gvasPackageVersion
  sbpWriter.writeInt32(3); // gvasEngineMajor
  sbpWriter.writeInt16(5); // gvasEngineMinor
  sbpWriter.writeInt16(6); // gvasEnginePatch
  sbpWriter.writeInt16(1); // gvasEngineLicense
  sbpWriter.writeUInt32(2147974773); // changelist
  sbpWriter.writeString('++FactoryGame+rel-main-1.2.0');

  const customVersions = [
    { guid: '2f3e0421d61fe613519d3b5130a23636', ver: 60 },
    { guid: 'c11de6f4ce9a027c61d5d7853d6a2fe4', ver: 28 },
    { guid: '81d57d69ab414fe6ec514aaa28b6b7be', ver: 121 },
    { guid: '525dda5948493212785978b88be9b870', ver: 9 },
    { guid: '425e9bd8464dbd24a8ac1284791764df', ver: 56 },
    { guid: '86181d60844f64acded316aad6c7ea0d', ver: 207 },
    { guid: '3f74fccf8044b043df14919373201d17', ver: 37 },
    { guid: '686308e7584c236b701b3984915e2616', ver: 17 }
  ];

  sbpWriter.writeInt32(customVersions.length);
  customVersions.forEach(cv => {
    sbpWriter.writeBuffer(Buffer.from(cv.guid, 'hex'));
    sbpWriter.writeInt32(cv.ver);
  });

  sbpWriter.writeUInt32(0x9E2A83C1);
  sbpWriter.writeUInt32(0x22222222);
  sbpWriter.writeInt64(131072);
  sbpWriter.writeUInt8(3); // ZLIB
  sbpWriter.writeInt64(compressedBody.length);
  sbpWriter.writeInt64(uncompressedBody.length);
  sbpWriter.writeInt64(compressedBody.length);
  sbpWriter.writeInt64(uncompressedBody.length);
  sbpWriter.writeBuffer(compressedBody);

  const sbpBuffer = sbpWriter.getBuffer();

  // 3. Build .SBPCFG
  const cfgWriter = new BinaryWriter();
  cfgWriter.writeInt32(0);
  
  const desc = `⚡ **${bp.title || bp.name}**\n\n${bp.description || ''}\n\n• Puissance : ${bp.powerMW || 0} MW\n• Dimensions : ${bp.designerSize || '4x4'}\n• Entrées : ${(bp.inputs || []).join(', ')}\n• Sorties : ${(bp.outputs || []).join(', ')}`;
  cfgWriter.writeString(desc);
  cfgWriter.writeInt32(782); // Icon ID
  cfgWriter.writeFloat(0.12);
  cfgWriter.writeFloat(0.65);
  cfgWriter.writeFloat(0.85);
  cfgWriter.writeFloat(1.0);
  cfgWriter.writeString('/Game/FactoryGame/-Shared/Blueprint/IconLibrary');
  cfgWriter.writeString('IconLibrary');
  cfgWriter.writeInt32(0);

  const cfgBuffer = cfgWriter.getBuffer();

  return { sbpBuffer, cfgBuffer };
}

// Export All Blueprints to Game Directory
function exportAllBlueprints() {
  console.log(`Starting Batch Generation of ${BLUEPRINTS_DATA.length} Blueprints...`);
  
  const baseBpDir = path.join(process.env.LOCALAPPDATA || '', 'FactoryGame', 'Saved', 'SaveGames', 'blueprints');
  const sessions = ['Boka_2026', 'test1', 'ETE_2026', 'Chill'];
  const projectOutDir = path.join(__dirname, 'blueprints');

  if (!fs.existsSync(projectOutDir)) fs.mkdirSync(projectOutDir, { recursive: true });

  let count = 0;
  BLUEPRINTS_DATA.forEach(bp => {
    const filename = (bp.id || bp.title).replace(/[^a-zA-Z0-9_]/g, '_');
    const { sbpBuffer, cfgBuffer } = generateSbpBuffers(bp);

    // Save in project directory
    fs.writeFileSync(path.join(projectOutDir, `${filename}.sbp`), sbpBuffer);
    fs.writeFileSync(path.join(projectOutDir, `${filename}.sbpcfg`), cfgBuffer);

    // Save in active game sessions
    sessions.forEach(sess => {
      const sessDir = path.join(baseBpDir, sess);
      if (fs.existsSync(sessDir)) {
        fs.writeFileSync(path.join(sessDir, `${filename}.sbp`), sbpBuffer);
        fs.writeFileSync(path.join(sessDir, `${filename}.sbpcfg`), cfgBuffer);
      }
    });

    count++;
  });

  console.log(`Successfully generated and exported ${count} Blueprints (.sbp & .sbpcfg) to game folders and dashboard!`);
}

exportAllBlueprints();
