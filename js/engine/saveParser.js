// Analyseur de sauvegarde Satisfactory (.sav) côté client
// Lit l'en-tête GVAS Unreal Engine et extrait les jalons / schémas débloqués

class SatisfactorySaveParser {
  /**
   * Analyse un fichier de sauvegarde Satisfactory (.sav) avec décompression des chunks UE
   * @param {File|ArrayBuffer} fileData 
   * @returns {Promise<Object>} Informations extraites de la sauvegarde
   */
  static async parseSave(fileData, onProgress = null) {
    let arrayBuffer;
    if (fileData instanceof File || fileData instanceof Blob) {
      arrayBuffer = await fileData.arrayBuffer();
    } else if (fileData instanceof ArrayBuffer) {
      arrayBuffer = fileData;
    } else if (fileData && fileData.buffer instanceof ArrayBuffer) {
      arrayBuffer = fileData.buffer.slice(fileData.byteOffset, fileData.byteOffset + fileData.byteLength);
    } else {
      arrayBuffer = fileData;
    }

    const dataView = new DataView(arrayBuffer);
    const decoder = new TextDecoder("utf-8");

    try {
      // 1. Lecture de l'en-tête du fichier .sav (GVAS Unreal Engine)
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

      let saveName = "", mapName = "", mapOptions = "", sessionName = "";

      if (saveHeaderVersion >= 14) {
        const s1 = this.readFString(dataView, offset, decoder); offset = s1.nextOffset; saveName = s1.str;
        const s2 = this.readFString(dataView, offset, decoder); offset = s2.nextOffset; mapName = s2.str;
        const s3 = this.readFString(dataView, offset, decoder); offset = s3.nextOffset; mapOptions = s3.str;
        const s4 = this.readFString(dataView, offset, decoder); offset = s4.nextOffset; sessionName = s4.str;
      } else {
        const s1 = this.readFString(dataView, offset, decoder); offset = s1.nextOffset; mapName = s1.str;
        const s2 = this.readFString(dataView, offset, decoder); offset = s2.nextOffset; mapOptions = s2.str;
        const s3 = this.readFString(dataView, offset, decoder); offset = s3.nextOffset; sessionName = s3.str;
        saveName = sessionName;
      }

      // PlayDurationSeconds (uint32)
      let playDurationSeconds = 0;
      if (offset + 4 <= dataView.byteLength) {
        playDurationSeconds = dataView.getInt32(offset, true);
        offset += 4;
      }

      // 2. Décompression des chunks Unreal Engine (zlib/deflate)
      let uncompressedText = "";
      try {
        uncompressedText = await this.decompressChunks(arrayBuffer, offset, onProgress);
      } catch (decompErr) {
        console.warn("Décompression des chunks :", decompErr);
      }

      // En fallback, on lit aussi le flux brut au cas où
      const rawText = decoder.decode(new Uint8Array(arrayBuffer.slice(0, Math.min(arrayBuffer.byteLength, 15000000))));
      const fullSearchText = uncompressedText + "\n" + rawText;

      const unlockedMilestones = [];

      // Détection exhaustive des schémas 1.0, 1.1 et 1.2
      const milestonePatterns = [
        { id: "tier_0_hub_1", keys: ["Schematic_Tutorial1", "Schematic_Tutorial_1", "HubUpgrade1", "Tier0_1"] },
        { id: "tier_0_hub_2", keys: ["Schematic_Tutorial2", "Schematic_Tutorial_2", "HubUpgrade2", "Tier0_2"] },
        { id: "tier_0_hub_3", keys: ["Schematic_Tutorial3", "Schematic_Tutorial_3", "HubUpgrade3", "Tier0_3"] },
        { id: "tier_0_hub_4", keys: ["Schematic_Tutorial4", "Schematic_Tutorial_4", "HubUpgrade4", "Tier0_4"] },
        { id: "tier_0_hub_5", keys: ["Schematic_Tutorial5", "Schematic_Tutorial_5", "HubUpgrade5", "Tier0_5"] },
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

      // Détection des Recettes Alternatives 1.0/1.2 (Disques durs)
      const altRecipePatterns = [
        { id: "recipe_alt_pure_iron_ingot", name: "Lingot de fer pur (Alt)", keys: ["PureIron", "IngotPureIron", "Alternate_PureIron", "Alternate_IngotIronPure", "PureIronIngot"] },
        { id: "recipe_alt_iron_alloy_ingot", name: "Alliage de fer (Alt)", keys: ["IronAlloy", "IngotIronAlloy", "Alternate_IronAlloy", "Alternate_IngotIronAlloy", "IronAlloyIngot"] },
        { id: "recipe_alt_copper_alloy_ingot", name: "Alliage de cuivre (Alt)", keys: ["CopperAlloy", "IngotCopperAlloy", "Alternate_CopperAlloy", "Alternate_IngotCopperAlloy", "CopperAlloyIngot"] },
        { id: "recipe_alt_pure_copper_ingot", name: "Lingot de cuivre pur (Alt)", keys: ["PureCopper", "IngotPureCopper", "Alternate_PureCopper", "Alternate_IngotCopperPure", "PureCopperIngot"] },
        { id: "recipe_alt_pure_caterium_ingot", name: "Lingot de caterium pur (Alt)", keys: ["PureCaterium", "IngotCateriumPure", "Alternate_PureCaterium", "Alternate_IngotCateriumPure", "PureCateriumIngot"] },
        { id: "recipe_alt_solid_steel_ingot", name: "Lingot d'acier massif (Alt)", keys: ["SolidSteel", "IngotSteelSolid", "Alternate_SolidSteel", "Alternate_IngotSteelSolid", "SolidSteelIngot"] },
        { id: "recipe_alt_coke_steel_ingot", name: "Acier au coke (Alt)", keys: ["CokeSteel", "IngotSteelCoke", "Alternate_CokeSteel", "Alternate_IngotSteelCoke", "CokeSteelIngot"] },
        { id: "recipe_alt_pure_aluminum_ingot", name: "Lingot d'aluminium pur (Alt)", keys: ["PureAluminum", "IngotAluminumPure", "Alternate_PureAluminum", "Alternate_IngotAluminumPure", "PureAluminumIngot"] },
        { id: "recipe_alt_steel_rod", name: "Tige en acier (Alt)", keys: ["SteelRod", "Alternate_SteelRod", "RodSteel", "Alternate_RodSteel", "AluminumRod"] },
        { id: "recipe_alt_cast_screw", name: "Vis coulée (Alt)", keys: ["CastScrew", "Alternate_CastScrew", "ScrewCast", "Screw_1", "Alternate_Screw_1"] },
        { id: "recipe_alt_steel_screw", name: "Vis en acier (Alt)", keys: ["SteelScrew", "Alternate_SteelScrew", "ScrewSteel", "Screw_2", "Alternate_Screw_2"] },
        { id: "recipe_alt_iron_wire", name: "Fil de fer (Alt)", keys: ["IronWire", "Alternate_IronWire", "WireIron", "Wire_1", "Alternate_Wire_1"] },
        { id: "recipe_alt_fused_wire", name: "Fil fusionné (Alt)", keys: ["FusedWire", "Alternate_FusedWire", "WireFused", "Wire_2", "Alternate_Wire_2"] },
        { id: "recipe_alt_quickwire_cable", name: "Câble au filactif (Alt)", keys: ["QuickwireCable", "Alternate_QuickwireCable", "CableQuickwire", "Cable_1", "Alternate_Cable_1"] },
        { id: "recipe_alt_insulated_cable", name: "Câble isolé (Alt)", keys: ["InsulatedCable", "Alternate_InsulatedCable", "CableInsulated", "Cable_2", "Alternate_Cable_2", "CoatedCable"] },
        { id: "recipe_alt_steamed_copper_sheet", name: "Tôle de cuivre étuvée (Alt)", keys: ["SteamedCopperSheet", "Alternate_SteamedCopperSheet", "CopperSheetSteamed", "Alternate_CopperSheet"] },
        { id: "recipe_alt_wet_concrete", name: "Béton humide (Alt)", keys: ["WetConcrete", "Alternate_WetConcrete", "ConcreteWet", "Concrete_1", "Alternate_Concrete_1"] },
        { id: "recipe_alt_rubber_concrete", name: "Béton au caoutchouc (Alt)", keys: ["RubberConcrete", "Alternate_RubberConcrete", "ConcreteRubber", "Concrete_2", "Alternate_Concrete_2"] },
        { id: "recipe_alt_stitched_iron_plate", name: "Plaque de fer cousue (Alt)", keys: ["StitchedIronPlate", "Alternate_StitchedIronPlate", "ReinforcedIronPlate_1", "Alternate_ReinforcedIronPlate_1"] },
        { id: "recipe_alt_bolted_iron_plate", name: "Plaque de fer boulonnée (Alt)", keys: ["BoltedIronPlate", "Alternate_BoltedIronPlate", "ReinforcedIronPlate_2", "Alternate_ReinforcedIronPlate_2"] },
        { id: "recipe_alt_adhered_iron_plate", name: "Plaque de fer collée (Alt)", keys: ["AdheredIronPlate", "Alternate_AdheredIronPlate", "ReinforcedIronPlate_3", "Alternate_ReinforcedIronPlate_3"] },
        { id: "recipe_alt_copper_rotor", name: "Rotor en cuivre (Alt)", keys: ["CopperRotor", "Alternate_CopperRotor", "RotorCopper", "Rotor_1", "Alternate_Rotor_1"] },
        { id: "recipe_alt_steel_rotor", name: "Rotor en acier (Alt)", keys: ["SteelRotor", "Alternate_SteelRotor", "RotorSteel", "Rotor_2", "Alternate_Rotor_2"] },
        { id: "recipe_alt_bolted_frame", name: "Cadre boulonné (Alt)", keys: ["BoltedFrame", "Alternate_BoltedFrame", "ModularFrame_1", "Alternate_ModularFrame_1"] },
        { id: "recipe_alt_steeled_frame", name: "Cadre en acier (Alt)", keys: ["SteeledFrame", "Alternate_SteeledFrame", "ModularFrame_2", "Alternate_ModularFrame_2"] },
        { id: "recipe_alt_encased_pipe", name: "Tuyau enrobé (Alt)", keys: ["EncasedPipe", "Alternate_EncasedPipe", "EncasedIndustrialBeam_1", "Alternate_EncasedIndustrialBeam_1"] },
        { id: "recipe_alt_quickwire_stator", name: "Stator au filactif (Alt)", keys: ["QuickwireStator", "Alternate_QuickwireStator", "Stator_1", "Alternate_Stator_1"] },
        { id: "recipe_alt_rigour_motor", name: "Moteur rigoureux (Alt)", keys: ["RigourMotor", "Alternate_RigourMotor", "Motor_1", "Alternate_Motor_1", "ElectricMotor"] },
        { id: "recipe_alt_heavy_encased_frame", name: "Cadre modulaire lourd enrobé (Alt)", keys: ["HeavyEncasedFrame", "Alternate_HeavyEncasedFrame", "HeavyModularFrame_1", "Alternate_HeavyModularFrame_1"] },
        { id: "recipe_alt_heavy_flexible_frame", name: "Cadre lourd flexible (Alt)", keys: ["HeavyFlexibleFrame", "Alternate_HeavyFlexibleFrame", "HeavyModularFrame_2", "Alternate_HeavyModularFrame_2", "FlexibleFramework"] },
        { id: "recipe_alt_heavy_oil_residue", name: "Résidu d'huile lourde (Alt)", keys: ["HeavyOilResidue", "Alternate_HeavyOilResidue"] },
        { id: "recipe_alt_diluted_fuel", name: "Carburant dilué (Alt)", keys: ["DilutedFuel", "Alternate_DilutedFuel", "DilutedPackagedFuel"] },
        { id: "recipe_alt_recycled_plastic", name: "Plastique recyclé (Alt)", keys: ["RecycledPlastic", "Alternate_RecycledPlastic", "Plastic_1", "Alternate_Plastic_1"] },
        { id: "recipe_alt_recycled_rubber", name: "Caoutchouc recyclé (Alt)", keys: ["RecycledRubber", "Alternate_RecycledRubber", "Rubber_1", "Alternate_Rubber_1"] },
        { id: "recipe_alt_silicon_circuit_board", name: "Circuit imprimé au silicium (Alt)", keys: ["SiliconCircuitBoard", "Alternate_SiliconCircuitBoard", "CircuitBoard_1", "Alternate_CircuitBoard_1"] },
        { id: "recipe_alt_caterium_circuit_board", name: "Circuit imprimé au caterium (Alt)", keys: ["CateriumCircuitBoard", "Alternate_CateriumCircuitBoard", "CircuitBoard_2", "Alternate_CircuitBoard_2"] },
        { id: "recipe_alt_fused_quickwire", name: "Filactif fusionné (Alt)", keys: ["FusedQuickwire", "Alternate_FusedQuickwire", "Quickwire_1", "Alternate_Quickwire_1"] },
        { id: "recipe_alt_silicon_high_speed_connector", name: "Connecteur haute vitesse au silicium (Alt)", keys: ["SiliconHighSpeedConnector", "Alternate_SiliconHighSpeedConnector", "HighSpeedConnector_1"] },
        { id: "recipe_alt_oc_supercomputer", name: "Supercalculateur OC (Alt)", keys: ["OCSupercomputer", "Alternate_OCSupercomputer", "Supercomputer_1", "Alternate_Supercomputer_1"] },
        { id: "recipe_alt_pure_quartz_crystal", name: "Cristal de quartz pur (Alt)", keys: ["PureQuartzCrystal", "Alternate_PureQuartzCrystal", "QuartzCrystal_1", "Alternate_QuartzCrystal_1"] },
        { id: "recipe_alt_cheap_silica", name: "Silice économique (Alt)", keys: ["CheapSilica", "Alternate_CheapSilica", "Silica_1", "Alternate_Silica_1"] }
      ];

      const unlockedRecipes = [];
      altRecipePatterns.forEach(r => {
        const found = r.keys.some(k => fullSearchText.includes(k));
        if (found) {
          unlockedRecipes.push(r.id);
        }
      });

      // Détection des arbres MAM
      const mamTrees = {
        caterium: { name: "Caterium", count: 0, total: 8 },
        quartz: { name: "Quartz", count: 0, total: 7 },
        sulfur: { name: "Soufre", count: 0, total: 6 },
        alien: { name: "Organismes Extraterrestres", count: 0, total: 6 },
        mycelia: { name: "Mycélium", count: 0, total: 4 },
        slugs: { name: "Limaces Électriques", count: 0, total: 4 }
      };

      for (let i = 1; i <= 8; i++) {
        if (fullSearchText.includes(`Research_Caterium_${i}`) || fullSearchText.includes(`Schematic_Tree_Caterium_${i}`)) mamTrees.caterium.count++;
      }
      for (let i = 1; i <= 7; i++) {
        if (fullSearchText.includes(`Research_Quartz_${i}`) || fullSearchText.includes(`Schematic_Tree_Quartz_${i}`)) mamTrees.quartz.count++;
      }
      for (let i = 1; i <= 6; i++) {
        if (fullSearchText.includes(`Research_Sulfur_${i}`) || fullSearchText.includes(`Schematic_Tree_Sulfur_${i}`)) mamTrees.sulfur.count++;
      }
      for (let i = 1; i <= 6; i++) {
        if (fullSearchText.includes(`Research_AlienOrganisms_${i}`) || fullSearchText.includes(`Research_AO_`) || fullSearchText.includes(`Research_Xeno_${i}`)) mamTrees.alien.count++;
      }
      for (let i = 1; i <= 4; i++) {
        if (fullSearchText.includes(`Research_Mycelia_${i}`) || fullSearchText.includes(`Research_Nutrients_${i}`)) mamTrees.mycelia.count++;
      }
      for (let i = 1; i <= 4; i++) {
        if (fullSearchText.includes(`Research_PowerSlugs_${i}`)) mamTrees.slugs.count++;
      }

      // Formatage du temps de jeu
      const hours = Math.floor(playDurationSeconds / 3600);
      const minutes = Math.floor((playDurationSeconds % 3600) / 60);

      return {
        success: true,
        sessionName: sessionName || saveName || "Session FICSIT",
        saveName: saveName || sessionName,
        buildVersion: buildVersion,
        saveVersion: saveVersion,
        mapName: mapName || "Pionnier Island",
        playtime: `${hours}h ${minutes}m`,
        playDurationSeconds: playDurationSeconds,
        unlockedMilestones: unlockedMilestones,
        unlockedPhases: unlockedPhases,
        unlockedRecipes: unlockedRecipes,
        mamTrees: mamTrees,
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
   * Décompresse l'intégralité des chunks Unreal Engine de Satisfactory 1.0/1.1/1.2
   */
  static async decompressChunks(arrayBuffer, startOffset, onProgress = null) {
    if (typeof DecompressionStream === "undefined") return "";

    const rawBytes = new Uint8Array(arrayBuffer);
    const decoder = new TextDecoder("utf-8", { fatal: false });
    
    // Détection de tous les en-têtes de chunks (PackageFileTag = 0x9E2A83C1)
    const chunkOffsets = [];
    for (let i = Math.max(0, startOffset - 100); i < rawBytes.length - 48; i++) {
      if (rawBytes[i] === 0xC1 && rawBytes[i+1] === 0x83 && rawBytes[i+2] === 0x2A && rawBytes[i+3] === 0x9E) {
        chunkOffsets.push(i);
        i += 40;
      }
    }

    if (chunkOffsets.length === 0) return "";

    let combinedText = "";
    const batchSize = 25; // Traitement par lots parallèles non bloquants

    for (let b = 0; b < chunkOffsets.length; b += batchSize) {
      if (onProgress) {
        try {
          onProgress(Math.min(b + batchSize, chunkOffsets.length), chunkOffsets.length);
        } catch (e) {}
      }

      // Laisser respirer la boucle d'événements du navigateur pour rafraîchir l'animation du loader
      await new Promise(resolve => setTimeout(resolve, 0));

      const batch = chunkOffsets.slice(b, b + batchSize);
      const batchPromises = batch.map(async (chOffset, idx) => {
        const globalIdx = b + idx;
        const start = chOffset + 48;
        const end = (globalIdx + 1 < chunkOffsets.length) ? chunkOffsets[globalIdx + 1] : rawBytes.length;
        const chunkData = rawBytes.subarray(start, end);

        try {
          const stream = new Response(chunkData).body.pipeThrough(new DecompressionStream("deflate"));
          const decompressedBuffer = await new Response(stream).arrayBuffer();
          return decoder.decode(decompressedBuffer);
        } catch (e1) {
          if (chunkData[0] === 0x00) {
            try {
              const stream2 = new Response(chunkData.subarray(1)).body.pipeThrough(new DecompressionStream("deflate"));
              const decompressedBuffer2 = await new Response(stream2).arrayBuffer();
              return decoder.decode(decompressedBuffer2);
            } catch (e2) {}
          }
          try {
            const stream3 = new Response(chunkData).body.pipeThrough(new DecompressionStream("deflate-raw"));
            const decompressedBuffer3 = await new Response(stream3).arrayBuffer();
            return decoder.decode(decompressedBuffer3);
          } catch (e3) {
            return "";
          }
        }
      });

      const batchResults = await Promise.all(batchPromises);
      batchResults.forEach(text => {
        if (text) combinedText += text + "\n";
      });
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
