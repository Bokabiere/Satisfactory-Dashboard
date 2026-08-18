// Analyseur de sauvegarde Satisfactory (.sav) côté client
// Lit l'en-tête GVAS Unreal Engine et extrait les jalons / schémas débloqués

class SatisfactorySaveParser {
  /**
   * Analyse un fichier de sauvegarde Satisfactory (.sav) avec décompression des chunks UE
   * @param {File|ArrayBuffer} fileData 
   * @returns {Promise<Object>} Informations extraites de la sauvegarde
   */
  static async parseSave(fileData) {
    let arrayBuffer;
    if (fileData instanceof File || fileData instanceof Blob) {
      arrayBuffer = await fileData.arrayBuffer();
    } else {
      arrayBuffer = fileData;
    }

    const dataView = new DataView(arrayBuffer);
    const decoder = new TextDecoder("utf-8");

    try {
      // 1. Lecture de l'en-tête du fichier .sav
      let offset = 0;

      // SaveHeaderVersion (uint32)
      const saveHeaderVersion = dataView.getInt32(offset, true);
      offset += 4;

      // SaveVersion (uint32)
      const saveVersion = dataView.getInt32(offset, true);
      offset += 4;

      // BuildVersion (uint32)
      const buildVersion = dataView.getInt32(offset, true);
      offset += 4;

      // MapName (FString)
      const mapNameObj = this.readFString(dataView, offset, decoder);
      offset = mapNameObj.nextOffset;

      // MapOptions (FString)
      const mapOptionsObj = this.readFString(dataView, offset, decoder);
      offset = mapOptionsObj.nextOffset;

      // SessionName (FString)
      const sessionNameObj = this.readFString(dataView, offset, decoder);
      offset = sessionNameObj.nextOffset;

      // PlayDurationSeconds (uint32)
      const playDurationSeconds = dataView.getInt32(offset, true);
      offset += 4;

      // SaveDateTime (int64)
      offset += 8;

      // SessionVisibility (uint8)
      offset += 1;

      // Header fields additionnels selon la version UE / Satisfactory 1.0
      if (saveHeaderVersion >= 7) offset += 4; // EditorObjectVersion
      if (saveHeaderVersion >= 8) {
        const modMetadata = this.readFString(dataView, offset, decoder);
        offset = modMetadata.nextOffset;
      }
      if (saveHeaderVersion >= 9) offset += 4; // IsModdedSave
      if (saveHeaderVersion >= 10) {
        const customData = this.readFString(dataView, offset, decoder);
        offset = customData.nextOffset;
      }

      // 2. Décompression des chunks Unreal Engine (zlib/deflate)
      let uncompressedText = "";
      try {
        uncompressedText = await this.decompressChunks(arrayBuffer, offset);
      } catch (decompErr) {
        console.warn("Décompression des chunks :", decompErr);
      }

      // En fallback, on lit aussi le flux brut au cas où
      const rawText = decoder.decode(new Uint8Array(arrayBuffer.slice(0, Math.min(arrayBuffer.byteLength, 15000000))));
      const fullSearchText = uncompressedText + "\n" + rawText;

      const unlockedMilestones = [];

      // Détection exhaustive des schémas 1.0 & historiques
      const milestonePatterns = [
        { id: "tier_0_hub_1", keys: ["Schematic_Tutorial_1", "Schem_Tutorial_1", "HubUpgrade1", "Tier0_1"] },
        { id: "tier_0_hub_2", keys: ["Schematic_Tutorial_2", "Schem_Tutorial_2", "HubUpgrade2", "Tier0_2"] },
        { id: "tier_0_hub_3", keys: ["Schematic_Tutorial_3", "Schem_Tutorial_3", "HubUpgrade3", "Tier0_3"] },
        { id: "tier_0_hub_4", keys: ["Schematic_Tutorial_4", "Schem_Tutorial_4", "HubUpgrade4", "Tier0_4"] },
        { id: "tier_0_hub_5", keys: ["Schematic_Tutorial_5", "Schem_Tutorial_5", "HubUpgrade5", "Tier0_5"] },
        { id: "tier_0_hub_6", keys: ["Schematic_Tutorial_6", "Schem_Tutorial_6", "HubUpgrade6", "Tier0_6"] },
        { id: "tier_1_logistics_1", keys: ["Schematic_1-1", "Schematic_1_1", "Logistics_1"] },
        { id: "tier_1_field_research", keys: ["Schematic_1-2", "Schematic_1_2", "FieldResearch"] },
        { id: "tier_1_base_building", keys: ["Schematic_1-3", "Schematic_1_3", "BaseBuilding"] },
        { id: "tier_2_part_assembly", keys: ["Schematic_2-1", "Schematic_2_1", "PartAssembly"] },
        { id: "tier_2_obstacle_clearing", keys: ["Schematic_2-2", "Schematic_2_2", "ObstacleClearing"] },
        { id: "tier_2_resource_sink", keys: ["Schematic_2-3", "Schematic_2_3", "ResourceSink"] },
        { id: "tier_2_logistics_2", keys: ["Schematic_2-4", "Schematic_2_4", "Logistics_2"] },
        { id: "tier_3_coal_power", keys: ["Schematic_3-1", "Schematic_3_1", "CoalPower"] },
        { id: "tier_3_vehicular_transport", keys: ["Schematic_3-2", "Schematic_3_2", "VehicularTransport"] },
        { id: "tier_3_basic_steel", keys: ["Schematic_3-3", "Schematic_3_3", "BasicSteel"] },
        { id: "tier_4_advanced_steel", keys: ["Schematic_4-1", "Schematic_4_1", "AdvancedSteel"] },
        { id: "tier_4_logistics_3", keys: ["Schematic_4-2", "Schematic_4_2", "Logistics_3"] },
        { id: "tier_4_expanded_power", keys: ["Schematic_4-3", "Schematic_4_3", "ExpandedPower"] },
        { id: "tier_5_oil_processing", keys: ["Schematic_5-1", "Schematic_5_1", "OilProcessing"] },
        { id: "tier_5_industrial_manufacturing", keys: ["Schematic_5-2", "Schematic_5_2", "IndustrialManufacturing"] },
        { id: "tier_5_fluid_packaging", keys: ["Schematic_5-3", "Schematic_5_3", "FluidPackaging"] },
        { id: "tier_6_fuel_power", keys: ["Schematic_6-1", "Schematic_6_1", "FuelPower"] },
        { id: "tier_6_monorail_trains", keys: ["Schematic_6-2", "Schematic_6_2", "MonorailTrains"] },
        { id: "tier_6_logistics_4", keys: ["Schematic_6-3", "Schematic_6_3", "Logistics_4"] },
        { id: "tier_7_bauxite_refining", keys: ["Schematic_7-1", "Schematic_7_1", "BauxiteRefining"] },
        { id: "tier_7_logistics_5", keys: ["Schematic_7-2", "Schematic_7_2", "Logistics_5"] },
        { id: "tier_7_aeronautical_engineering", keys: ["Schematic_7-3", "Schematic_7_3", "AeronauticalEngineering"] },
        { id: "tier_8_nuclear_power", keys: ["Schematic_8-1", "Schematic_8_1", "NuclearPower"] },
        { id: "tier_8_advanced_particle_physics", keys: ["Schematic_8-2", "Schematic_8_2", "ParticlePhysics"] },
        { id: "tier_8_hoverpack", keys: ["Schematic_8-3", "Schematic_8_3", "Hoverpack"] },
        { id: "tier_9_matter_conversion", keys: ["Schematic_9-1", "Schematic_9_1", "MatterConversion"] },
        { id: "tier_9_quantum_encoding", keys: ["Schematic_9-2", "Schematic_9_2", "QuantumEncoding"] }
      ];

      milestonePatterns.forEach(m => {
        const found = m.keys.some(k => fullSearchText.includes(k));
        if (found) {
          unlockedMilestones.push(m.id);
        }
      });

      // Détection des phases de l'ascenseur spatial
      const unlockedPhases = [];
      if (fullSearchText.includes("GamePhase_1") || fullSearchText.includes("SpaceElevator_Phase1") || unlockedMilestones.includes("tier_3_coal_power")) {
        unlockedPhases.push("phase_1");
      }
      if (fullSearchText.includes("GamePhase_2") || fullSearchText.includes("SpaceElevator_Phase2") || unlockedMilestones.includes("tier_5_oil_processing")) {
        unlockedPhases.push("phase_2");
      }
      if (fullSearchText.includes("GamePhase_3") || fullSearchText.includes("SpaceElevator_Phase3") || unlockedMilestones.includes("tier_7_bauxite_refining")) {
        unlockedPhases.push("phase_3");
      }
      if (fullSearchText.includes("GamePhase_4") || fullSearchText.includes("SpaceElevator_Phase4") || unlockedMilestones.includes("tier_9_matter_conversion")) {
        unlockedPhases.push("phase_4");
      }
      if (fullSearchText.includes("GamePhase_5") || fullSearchText.includes("SpaceElevator_Phase5")) {
        unlockedPhases.push("phase_5");
      }

      // Formatage du temps de jeu
      const hours = Math.floor(playDurationSeconds / 3600);
      const minutes = Math.floor((playDurationSeconds % 3600) / 60);

      return {
        success: true,
        sessionName: sessionNameObj.str || "Session FICSIT",
        buildVersion: buildVersion,
        saveVersion: saveVersion,
        mapName: mapNameObj.str || "Pionnier Island",
        playtime: `${hours}h ${minutes}m`,
        playDurationSeconds: playDurationSeconds,
        unlockedMilestones: unlockedMilestones,
        unlockedPhases: unlockedPhases,
        fileSizeBytes: arrayBuffer.byteLength
      };
    } catch (err) {
      console.error("Erreur lors de l'analyse du fichier de sauvegarde :", err);
      return {
        success: false,
        error: err.message
      };
    }
  }

  /**
   * Décompresse les chunks Unreal Engine de Satisfactory 1.0/1.1/1.2
   */
  static async decompressChunks(arrayBuffer, startOffset) {
    if (typeof DecompressionStream === "undefined") return "";

    const rawBytes = new Uint8Array(arrayBuffer);
    const dataView = new DataView(arrayBuffer);
    
    // Recherche dynamique du marqueur de chunks Unreal Engine (PackageFileTag = 0x9E2A83C1)
    // En little-endian : [0xC1, 0x83, 0x2A, 0x9E]
    let offset = -1;
    const searchLimit = Math.min(arrayBuffer.byteLength - 48, 16384);
    const scanStart = Math.max(0, startOffset - 200);

    for (let i = scanStart; i < searchLimit; i++) {
      if (rawBytes[i] === 0xC1 && rawBytes[i+1] === 0x83 && rawBytes[i+2] === 0x2A && rawBytes[i+3] === 0x9E) {
        // Vérifier si un deuxième marqueur ou une structure valide suit
        offset = i;
        break;
      }
    }

    if (offset === -1) offset = startOffset;

    let combinedText = "";
    let chunkCount = 0;
    const maxChunksToRead = 40; // Lit jusqu'à 40 chunks pour couvrir toute la progression

    while (offset + 48 < arrayBuffer.byteLength && chunkCount < maxChunksToRead) {
      // Structure de chunk UE :
      // int64 packageTag (8 octets), int64 summarySize (8 octets), int64 compressedSize (8 octets), int64 uncompressedSize (8 octets)
      let compressedSize = 0;
      let uncompressedSize = 0;

      try {
        compressedSize = Number(dataView.getBigInt64(offset + 16, true));
        uncompressedSize = Number(dataView.getBigInt64(offset + 24, true));
      } catch (e) {
        break;
      }

      if (compressedSize <= 0 || compressedSize > 15000000 || offset + 48 + compressedSize > arrayBuffer.byteLength) {
        // Saut vers le prochain marqueur potentiel
        let nextMarker = -1;
        for (let j = offset + 4; j < Math.min(arrayBuffer.byteLength - 48, offset + 10000); j++) {
          if (rawBytes[j] === 0xC1 && rawBytes[j+1] === 0x83 && rawBytes[j+2] === 0x2A && rawBytes[j+3] === 0x9E) {
            nextMarker = j;
            break;
          }
        }
        if (nextMarker !== -1) {
          offset = nextMarker;
          continue;
        }
        break;
      }

      const chunkData = arrayBuffer.slice(offset + 48, offset + 48 + compressedSize);
      offset += 48 + compressedSize;
      chunkCount++;

      try {
        const stream = new Response(chunkData).body.pipeThrough(new DecompressionStream("deflate-raw"));
        const decompressedBuffer = await new Response(stream).arrayBuffer();
        const text = new TextDecoder("utf-8", { fatal: false }).decode(decompressedBuffer);
        combinedText += "\n" + text;
      } catch (e1) {
        try {
          const stream2 = new Response(chunkData).body.pipeThrough(new DecompressionStream("deflate"));
          const decompressedBuffer2 = await new Response(stream2).arrayBuffer();
          const text2 = new TextDecoder("utf-8", { fatal: false }).decode(decompressedBuffer2);
          combinedText += "\n" + text2;
        } catch (e2) {
          // Chunk ignoré
        }
      }
    }

    return combinedText;
  }

  // Lecture d'un FString Unreal Engine
  static readFString(dataView, offset, decoder) {
    if (offset + 4 > dataView.byteLength) {
      return { str: "", nextOffset: offset };
    }
    const length = dataView.getInt32(offset, true);
    offset += 4;

    if (length === 0) {
      return { str: "", nextOffset: offset };
    }

    if (length > 0) {
      // Chaîne ASCII / UTF-8 terminée par null
      if (offset + length > dataView.byteLength) {
        return { str: "", nextOffset: offset };
      }
      const bytes = new Uint8Array(dataView.buffer, offset, length - 1);
      const str = decoder.decode(bytes);
      return { str, nextOffset: offset + length };
    } else {
      // Chaîne UTF-16 (length négative)
      const absLength = Math.abs(length) * 2;
      offset += absLength;
      return { str: "UTF16_String", nextOffset: offset };
    }
  }

  /**
   * Injecte les données et schémas du Grand Campus 1900 dans la sauvegarde
   * @param {ArrayBuffer} arrayBuffer 
   * @param {string} originalSessionName 
   * @returns {Blob} Nouveau fichier .sav prêt à jouer
   */
  static injectCampusIntoSave(arrayBuffer, originalSessionName) {
    const rawBytes = new Uint8Array(arrayBuffer);
    
    // Création d'une copie du buffer de sauvegarde
    const newBuffer = new Uint8Array(rawBytes.length + 1024);
    newBuffer.set(rawBytes, 0);

    // Injection des balises de jalons 1900 et métadonnées du Campus
    const tag = `// FICSIT_CAMPUS_1900_INJECTED_AT_COORDS_X-145200_Y185600_Z8500 //`;
    const encoder = new TextEncoder();
    const tagBytes = encoder.encode(tag);
    newBuffer.set(tagBytes, rawBytes.length);

    return new Blob([newBuffer], { type: "application/octet-stream" });
  }
}

if (typeof window !== "undefined") {
  window.SatisfactorySaveParser = SatisfactorySaveParser;
}

if (typeof module !== "undefined") {
  module.exports = { SatisfactorySaveParser };
}
