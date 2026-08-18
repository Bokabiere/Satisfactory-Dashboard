// Generateur Universel de Fichiers .SBP et .SBPCFG pour Satisfactory 1.0 (Navigateur & Node.js)
// Compatible Blueprint Designer Mk.1 (4x4), Mk.2 (5x5), Mk.3 (6x6)

class BlueprintBinaryWriter {
  constructor() {
    this.chunks = [];
  }

  writeInt8(val) {
    const b = new Uint8Array(1);
    new DataView(b.buffer).setInt8(0, val);
    this.chunks.push(b);
  }

  writeUInt8(val) {
    const b = new Uint8Array(1);
    new DataView(b.buffer).setUint8(0, val);
    this.chunks.push(b);
  }

  writeInt16(val) {
    const b = new Uint8Array(2);
    new DataView(b.buffer).setInt16(0, val, true);
    this.chunks.push(b);
  }

  writeInt32(val) {
    const b = new Uint8Array(4);
    new DataView(b.buffer).setInt32(0, val, true);
    this.chunks.push(b);
  }

  writeUInt32(val) {
    const b = new Uint8Array(4);
    new DataView(b.buffer).setUint32(0, val, true);
    this.chunks.push(b);
  }

  writeInt64(val) {
    const b = new Uint8Array(8);
    new DataView(b.buffer).setBigInt64(0, BigInt(val), true);
    this.chunks.push(b);
  }

  writeFloat(val) {
    const b = new Uint8Array(4);
    new DataView(b.buffer).setFloat32(0, val, true);
    this.chunks.push(b);
  }

  writeString(str) {
    if (!str || str.length === 0) {
      this.writeInt32(0);
      return;
    }
    const encoder = new TextEncoder();
    const encoded = encoder.encode(str + '\0');
    this.writeInt32(encoded.length);
    this.chunks.push(encoded);
  }

  writeBuffer(buf) {
    if (buf instanceof Uint8Array) {
      this.chunks.push(buf);
    } else {
      this.chunks.push(new Uint8Array(buf));
    }
  }

  getUint8Array() {
    let totalLen = this.chunks.reduce((acc, c) => acc + c.length, 0);
    let result = new Uint8Array(totalLen);
    let offset = 0;
    for (let c of this.chunks) {
      result.set(c, offset);
      offset += c.length;
    }
    return result;
  }
}

// Helper ZLIB Compression for Browser & Node
async function compressZlib(uint8Arr) {
  if (typeof CompressionStream !== 'undefined') {
    const cs = new CompressionStream('deflate');
    const writer = cs.writable.getWriter();
    writer.write(uint8Arr);
    writer.close();
    const response = new Response(cs.readable);
    const arrayBuffer = await response.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  } else if (typeof require !== 'undefined') {
    const zlib = require('zlib');
    return new Uint8Array(zlib.deflateSync(uint8Arr));
  }
  throw new Error('Compression non supportée sur cet environnement.');
}

const UOBJECT_CLASSES_BROWSER = {
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

const ITEM_DESC_CLASSES_BROWSER = {
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

const BlueprintFileGenerator = {
  async generateFiles(bp) {
    let sizeX = 4, sizeY = 4, sizeZ = 4;
    if (bp.designerSize && bp.designerSize.includes('5x5')) {
      sizeX = 5; sizeY = 5; sizeZ = 5;
    } else if (bp.designerSize && bp.designerSize.includes('6x6')) {
      sizeX = 6; sizeY = 6; sizeZ = 6;
    }

    const buildings = [];
    const halfSpan = sizeX * 400;
    const step = 800;

    // Fondations 8x4 de base
    for (let x = -halfSpan + 400; x <= halfSpan - 400; x += step) {
      for (let y = -halfSpan + 400; y <= halfSpan - 400; y += step) {
        buildings.push({
          className: UOBJECT_CLASSES_BROWSER.foundation_8x4,
          instanceName: `Build_Foundation_8x4_01_C_${Math.floor(2147400000 + Math.random() * 80000)}`,
          pos: [x, y, 200],
          rot: [0, 0, 0, 1],
          scale: [1, 1, 1]
        });
      }
    }

    // Machines
    const bldCount = bp.buildingsCount || {};
    const machineEntries = Object.entries(bldCount).filter(([k]) => !k.includes('wall') && !k.includes('pillar') && !k.includes('switch') && !k.includes('signal'));

    let machineIndex = 0;
    machineEntries.forEach(([bldKey, count]) => {
      const classPath = UOBJECT_CLASSES_BROWSER[bldKey] || UOBJECT_CLASSES_BROWSER.constructor;
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
          rot: [0, 0, 0, 1],
          scale: [1, 1, 1]
        });
        machineIndex++;
      }
    });

    // Pylone central
    buildings.push({
      className: UOBJECT_CLASSES_BROWSER.powerpole,
      instanceName: `Build_PowerPoleMk1_C_${Math.floor(2147400000 + Math.random() * 80000)}`,
      pos: [0, 0, 400],
      rot: [0, 0, 0, 1],
      scale: [1, 1, 1]
    });

    // Coûts
    const costs = [];
    if (bp.materialsNeeded) {
      Object.entries(bp.materialsNeeded).forEach(([mat, qty]) => {
        costs.push({
          item: ITEM_DESC_CLASSES_BROWSER[mat] || `/Game/FactoryGame/Resource/Parts/Concrete/Desc_Concrete.Desc_Concrete_C`,
          amount: qty
        });
      });
    } else {
      costs.push({ item: ITEM_DESC_CLASSES_BROWSER.concrete, amount: 80 });
    }

    const recipes = [
      '/Game/FactoryGame/Recipes/Buildings/Recipe_Foundation_8x4_01.Recipe_Foundation_8x4_01_C',
      '/Game/FactoryGame/Recipes/Buildings/Recipe_PowerPoleMk1.Recipe_PowerPoleMk1_C'
    ];

    // Payload
    const objHeaderWriter = new BlueprintBinaryWriter();
    objHeaderWriter.writeInt32(buildings.length);

    buildings.forEach(b => {
      objHeaderWriter.writeInt32(1);
      objHeaderWriter.writeString(b.className);
      objHeaderWriter.writeString('Persistent_Level');
      objHeaderWriter.writeString(`Persistent_Level:PersistentLevel.${b.instanceName}`);
      objHeaderWriter.writeInt32(8); // flags
      objHeaderWriter.writeInt32(1); // needTransform
      objHeaderWriter.writeFloat(b.rot[0]);
      objHeaderWriter.writeFloat(b.rot[1]);
      objHeaderWriter.writeFloat(b.rot[2]);
      objHeaderWriter.writeFloat(b.rot[3]);
      objHeaderWriter.writeFloat(b.pos[0]);
      objHeaderWriter.writeFloat(b.pos[1]);
      objHeaderWriter.writeFloat(b.pos[2]);
      objHeaderWriter.writeFloat(b.scale[0]);
      objHeaderWriter.writeFloat(b.scale[1]);
      objHeaderWriter.writeFloat(b.scale[2]);
      objHeaderWriter.writeInt32(0);
    });

    const objHeaderBuf = objHeaderWriter.getUint8Array();

    const propWriter = new BlueprintBinaryWriter();
    propWriter.writeInt32(buildings.length);

    buildings.forEach(b => {
      const entPropWriter = new BlueprintBinaryWriter();
      entPropWriter.writeString('Persistent_Level');
      entPropWriter.writeString(`Persistent_Level:PersistentLevel.${b.instanceName}`);
      entPropWriter.writeString('None');
      const entBuf = entPropWriter.getUint8Array();
      propWriter.writeInt32(entBuf.length + 4);
      propWriter.writeBuffer(entBuf);
    });

    const propBuf = propWriter.getUint8Array();

    // Body
    const totalBodyPayload = new Uint8Array(objHeaderBuf.length + propBuf.length);
    totalBodyPayload.set(objHeaderBuf, 0);
    totalBodyPayload.set(propBuf, objHeaderBuf.length);

    const bodyWriter = new BlueprintBinaryWriter();
    bodyWriter.writeInt32(totalBodyPayload.length + 4);
    bodyWriter.writeInt32(objHeaderBuf.length);
    bodyWriter.writeBuffer(totalBodyPayload);

    const uncompressedBody = bodyWriter.getUint8Array();
    const compressedBody = await compressZlib(uncompressedBody);

    // SBP Full File
    const sbpWriter = new BlueprintBinaryWriter();
    sbpWriter.writeInt32(2);
    sbpWriter.writeInt32(60);
    sbpWriter.writeInt32(491125);
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

    sbpWriter.writeInt32(0);
    sbpWriter.writeInt32(522);
    sbpWriter.writeInt32(1017);
    sbpWriter.writeInt32(3);
    sbpWriter.writeInt16(5);
    sbpWriter.writeInt16(6);
    sbpWriter.writeInt16(1);
    sbpWriter.writeUInt32(2147974773);
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
      const match = cv.guid.match(/.{1,2}/g);
      const guidBytes = new Uint8Array(match.map(byte => parseInt(byte, 16)));
      sbpWriter.writeBuffer(guidBytes);
      sbpWriter.writeInt32(cv.ver);
    });

    sbpWriter.writeUInt32(0x9E2A83C1);
    sbpWriter.writeUInt32(0x22222222);
    sbpWriter.writeInt64(131072);
    sbpWriter.writeUInt8(3);
    sbpWriter.writeInt64(compressedBody.length);
    sbpWriter.writeInt64(uncompressedBody.length);
    sbpWriter.writeInt64(compressedBody.length);
    sbpWriter.writeInt64(uncompressedBody.length);
    sbpWriter.writeBuffer(compressedBody);

    const sbpArray = sbpWriter.getUint8Array();

    // SBPCFG File
    const cfgWriter = new BlueprintBinaryWriter();
    cfgWriter.writeInt32(0);
    const desc = `⚡ **${bp.title || bp.name}**\n\n${bp.description || ''}\n\n• Puissance : ${bp.powerMW || 0} MW\n• Dimensions : ${bp.designerSize || '4x4'}\n• Entrées : ${(bp.inputs || []).join(', ')}\n• Sorties : ${(bp.outputs || []).join(', ')}`;
    cfgWriter.writeString(desc);
    cfgWriter.writeInt32(782);
    cfgWriter.writeFloat(0.12);
    cfgWriter.writeFloat(0.65);
    cfgWriter.writeFloat(0.85);
    cfgWriter.writeFloat(1.0);
    cfgWriter.writeString('/Game/FactoryGame/-Shared/Blueprint/IconLibrary');
    cfgWriter.writeString('IconLibrary');
    cfgWriter.writeInt32(0);

    const cfgArray = cfgWriter.getUint8Array();

    const filename = (bp.id || bp.title || "blueprint").replace(/[^a-zA-Z0-9_]/g, "_");

    return {
      sbpBlob: new Blob([sbpArray], { type: "application/octet-stream" }),
      sbpFilename: `${filename}.sbp`,
      sbpcfgBlob: new Blob([cfgArray], { type: "application/octet-stream" }),
      sbpcfgFilename: `${filename}.sbpcfg`
    };
  },

  downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 200);
  }
};

if (typeof window !== "undefined") {
  window.BlueprintFileGenerator = BlueprintFileGenerator;
}
if (typeof module !== "undefined") {
  module.exports = { BlueprintFileGenerator };
}
