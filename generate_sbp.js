const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

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

function generateBlueprint(bpName) {
  console.log(`\n======================================================`);
  console.log(`Generating native Satisfactory Blueprint: "${bpName}"...`);

  // Designer Mk1: 4x4 (32m x 32m x 32m) -> sizeX=4, sizeY=4, sizeZ=4
  const sizeX = 4, sizeY = 4, sizeZ = 4;

  const FDN_8x4 = '/Game/FactoryGame/Buildable/Building/Foundation/Build_Foundation_8x4_01.Build_Foundation_8x4_01_C';
  const SMELTER = '/Game/FactoryGame/Buildable/Factory/SmelterMk1/Build_SmelterMk1.Build_SmelterMk1_C';
  const POWERPOLE = '/Game/FactoryGame/Buildable/Factory/PowerPoleMk1/Build_PowerPoleMk1.Build_PowerPoleMk1_C';

  const buildings = [];
  const coords = [-1200, -400, 400, 1200];

  // 1. Full 4x4 platform of 16 Foundations (8x4 thick)
  // Foundation 8x4: center Z=200, bottom Z=0, top surface Z=400
  for (let x of coords) {
    for (let y of coords) {
      buildings.push({
        className: FDN_8x4,
        instanceName: `Build_Foundation_8x4_01_C_${Math.floor(2147400000 + Math.random() * 80000)}`,
        pos: [x, y, 200],
        rot: [0, 0, 0, 1],
        scale: [1, 1, 1]
      });
    }
  }

  // 2. 4 Smelters placed directly on top of the foundations (Z = 400)
  // Row 1 (X = -600)
  buildings.push({
    className: SMELTER,
    instanceName: `Build_SmelterMk1_C_${Math.floor(2147400000 + Math.random() * 80000)}`,
    pos: [-600, -600, 400],
    rot: yawToQuat(0),
    scale: [1, 1, 1]
  });
  buildings.push({
    className: SMELTER,
    instanceName: `Build_SmelterMk1_C_${Math.floor(2147400000 + Math.random() * 80000)}`,
    pos: [-600, 600, 400],
    rot: yawToQuat(0),
    scale: [1, 1, 1]
  });

  // Row 2 (X = +600)
  buildings.push({
    className: SMELTER,
    instanceName: `Build_SmelterMk1_C_${Math.floor(2147400000 + Math.random() * 80000)}`,
    pos: [600, -600, 400],
    rot: yawToQuat(0),
    scale: [1, 1, 1]
  });
  buildings.push({
    className: SMELTER,
    instanceName: `Build_SmelterMk1_C_${Math.floor(2147400000 + Math.random() * 80000)}`,
    pos: [600, 600, 400],
    rot: yawToQuat(0),
    scale: [1, 1, 1]
  });

  // 3. Central Power Pole (Z = 400)
  buildings.push({
    className: POWERPOLE,
    instanceName: `Build_PowerPoleMk1_C_${Math.floor(2147400000 + Math.random() * 80000)}`,
    pos: [0, 0, 400],
    rot: yawToQuat(0),
    scale: [1, 1, 1]
  });

  console.log(`Placed ${buildings.length} building actors (16 Fondations + 4 Fonderies + 1 Pylone).`);

  // Material Costs
  const costs = [
    { item: '/Game/FactoryGame/Resource/Parts/Concrete/Desc_Concrete.Desc_Concrete_C', amount: 80 },
    { item: '/Game/FactoryGame/Resource/Parts/IronPlate/Desc_IronPlate.Desc_IronPlate_C', amount: 32 },
    { item: '/Game/FactoryGame/Resource/Parts/IronRod/Desc_IronRod.Desc_IronRod_C', amount: 20 },
    { item: '/Game/FactoryGame/Resource/Parts/Wire/Desc_Wire.Desc_Wire_C', amount: 4 }
  ];

  // Recipes
  const recipes = [
    '/Game/FactoryGame/Recipes/Buildings/Recipe_Foundation_8x4_01.Recipe_Foundation_8x4_01_C',
    '/Game/FactoryGame/Recipes/Buildings/Recipe_SmelterMk1.Recipe_SmelterMk1_C',
    '/Game/FactoryGame/Recipes/Buildings/Recipe_PowerPoleMk1.Recipe_PowerPoleMk1_C'
  ];

  // 1. Build Payload Body (Uncompressed)
  const bodyWriter = new BinaryWriter();
  
  // Object table
  const objHeaderWriter = new BinaryWriter();
  objHeaderWriter.writeInt32(buildings.length); // Count of objects

  buildings.forEach(b => {
    objHeaderWriter.writeInt32(1); // 1 = Actor
    objHeaderWriter.writeString(b.className);
    objHeaderWriter.writeString('Persistent_Level');
    objHeaderWriter.writeString(`Persistent_Level:PersistentLevel.${b.instanceName}`);
    
    // Exact UE5 Save Actor Layout:
    objHeaderWriter.writeInt32(8); // flags = 8 (HAS_TRANSFORM)
    objHeaderWriter.writeInt32(1); // needTransform = 1
    // Rotation Quaternion [qx, qy, qz, qw]
    objHeaderWriter.writeFloat(b.rot[0]);
    objHeaderWriter.writeFloat(b.rot[1]);
    objHeaderWriter.writeFloat(b.rot[2]);
    objHeaderWriter.writeFloat(b.rot[3]);
    // Translation Vector [x, y, z]
    objHeaderWriter.writeFloat(b.pos[0]);
    objHeaderWriter.writeFloat(b.pos[1]);
    objHeaderWriter.writeFloat(b.pos[2]);
    // Scale Vector [sx, sy, sz]
    objHeaderWriter.writeFloat(b.scale[0]);
    objHeaderWriter.writeFloat(b.scale[1]);
    objHeaderWriter.writeFloat(b.scale[2]);
    
    objHeaderWriter.writeInt32(0); // wasPlacedInLevel = 0
  });

  const objHeaderBuf = objHeaderWriter.getBuffer();

  // Properties table
  const propWriter = new BinaryWriter();
  propWriter.writeInt32(buildings.length); // Count of entity property blocks

  buildings.forEach(b => {
    const entPropWriter = new BinaryWriter();
    entPropWriter.writeString('Persistent_Level');
    entPropWriter.writeString(`Persistent_Level:PersistentLevel.${b.instanceName}`);
    
    // Terminate properties with None
    entPropWriter.writeString('None');
    
    const entBuf = entPropWriter.getBuffer();
    propWriter.writeInt32(entBuf.length + 4); // Length including length prefix
    propWriter.writeBuffer(entBuf);
  });

  const propBuf = propWriter.getBuffer();

  // Combine into Body
  const totalBodyPayload = Buffer.concat([objHeaderBuf, propBuf]);
  
  // Body Header: total length + header block length + payload
  bodyWriter.writeInt32(totalBodyPayload.length + 4);
  bodyWriter.writeInt32(objHeaderBuf.length);
  bodyWriter.writeBuffer(totalBodyPayload);

  const uncompressedBody = bodyWriter.getBuffer();
  console.log(`Uncompressed body size: ${uncompressedBody.length} bytes`);

  // Compress Body with ZLIB
  const compressedBody = zlib.deflateSync(uncompressedBody);
  console.log(`Compressed body size: ${compressedBody.length} bytes`);

  // 2. Build SBP Full File
  const sbpWriter = new BinaryWriter();
  
  // SBP Header
  sbpWriter.writeInt32(2); // BlueprintVersion
  sbpWriter.writeInt32(60); // BuildVersion
  sbpWriter.writeInt32(491125); // SaveVersion (Satisfactory 1.0)
  sbpWriter.writeInt32(sizeX);
  sbpWriter.writeInt32(sizeY);
  sbpWriter.writeInt32(sizeZ);

  // Costs
  sbpWriter.writeInt32(costs.length);
  costs.forEach(c => {
    sbpWriter.writeInt32(0);
    sbpWriter.writeString(c.item);
    sbpWriter.writeInt32(c.amount);
  });

  // Recipes
  sbpWriter.writeInt32(recipes.length);
  recipes.forEach(r => {
    sbpWriter.writeInt32(0);
    sbpWriter.writeString(r);
  });

  // GVAS Sub-Header
  sbpWriter.writeInt32(0); // gvasSaveHeaderType
  sbpWriter.writeInt32(522); // gvasSaveVersion
  sbpWriter.writeInt32(1017); // gvasPackageVersion
  sbpWriter.writeInt32(3); // gvasEngineMajor
  sbpWriter.writeInt16(5); // gvasEngineMinor
  sbpWriter.writeInt16(6); // gvasEnginePatch
  sbpWriter.writeInt16(1); // gvasEngineLicense
  sbpWriter.writeUInt32(2147974773); // gvasChangelist (0x80077E75)
  sbpWriter.writeString('++FactoryGame+rel-main-1.2.0');

  // Custom Versions (8 GUIDs)
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

  // Package Tag
  sbpWriter.writeUInt32(0x9E2A83C1);

  // Compression Chunk Header
  sbpWriter.writeUInt32(0x22222222); // packageFileTag
  sbpWriter.writeInt64(131072); // maxChunkSize (0x00020000)
  sbpWriter.writeUInt8(3); // compType = 3 (ZLIB)
  sbpWriter.writeInt64(compressedBody.length);
  sbpWriter.writeInt64(uncompressedBody.length);
  sbpWriter.writeInt64(compressedBody.length);
  sbpWriter.writeInt64(uncompressedBody.length);

  // Write Compressed Data
  sbpWriter.writeBuffer(compressedBody);

  const sbpFinal = sbpWriter.getBuffer();

  // 3. Build .SBPCFG Config File
  const cfgWriter = new BinaryWriter();
  cfgWriter.writeInt32(0); // Version
  
  const desc = `⚡ **${bpName}**\n\nModule 4x4 Fondations + 4 Fonderies Mk1 calibré au sol.\n- 16 Fondations 8x4 béton (plateforme complète)\n- 4 Fonderies Mk1 posées au sol (Z=400)\n- 1 Pylone électrique central`;
  cfgWriter.writeString(desc);
  
  // Icon ID (782)
  cfgWriter.writeInt32(782);
  
  // Color RGBA (Cyan / FICSIT Blue-Green)
  cfgWriter.writeFloat(0.12);
  cfgWriter.writeFloat(0.65);
  cfgWriter.writeFloat(0.85);
  cfgWriter.writeFloat(1.0);

  // Icon Library
  cfgWriter.writeString('/Game/FactoryGame/-Shared/Blueprint/IconLibrary');
  cfgWriter.writeString('IconLibrary');
  
  // Category / SubCategory
  cfgWriter.writeInt32(0);

  const cfgFinal = cfgWriter.getBuffer();

  // Deploy to ALL blueprint folders found in AppData
  const baseBpDir = path.join(process.env.LOCALAPPDATA, 'FactoryGame', 'Saved', 'SaveGames', 'blueprints');
  const sessions = ['Boka_2026', 'test1', 'ETE_2026', 'Chill', 'Experimental', 'Avril_2025'];

  sessions.forEach(sess => {
    const targetDir = path.join(baseBpDir, sess);
    if (fs.existsSync(targetDir)) {
      const sbpPath = path.join(targetDir, `${bpName}.sbp`);
      const cfgPath = path.join(targetDir, `${bpName}.sbpcfg`);
      fs.writeFileSync(sbpPath, sbpFinal);
      fs.writeFileSync(cfgPath, cfgFinal);
      console.log(`Deployed to [${sess}]: ${sbpPath} (${sbpFinal.length} bytes)`);
    }
  });
}

generateBlueprint('Antigravity_Test_Smelters');
