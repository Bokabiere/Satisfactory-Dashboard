// Moteur de Calcul Énergétique & Centrales Électriques pour Satisfactory 1.0 / 1.2
// Gère le calcul par Puissance Cible (MW) ou par Débit de Ressource Disponible (/min)
// avec optimisation de la plomberie et génération de la Shopping List de Chantier.

class PowerPlantCalculator {
  constructor(powerTechnologies = POWER_TECHNOLOGIES, buildingsData = (typeof BUILDINGS !== 'undefined' ? BUILDINGS : {})) {
    this.techs = powerTechnologies;
    this.buildings = buildingsData;
  }

  /**
   * Calcul par Puissance Cible (MW)
   * @param {string} techId 
   * @param {number} targetMW 
   * @param {number} overclockPercent (100 - 250)
   * @param {boolean} isSomersloop 
   * @returns {Object} Bilan complet de la centrale
   */
  calculateFromTargetPower(techId, targetMW, overclockPercent = 100, isSomersloop = false) {
    const tech = this.techs[techId];
    if (!tech) throw new Error(`Technologie énergétique inconnue : ${techId}`);

    const baseGenMW = tech.generatorPowerMW;
    const ocMultiplier = overclockPercent / 100;
    const somersloopMultiplier = isSomersloop ? 2.0 : 1.0;
    const effectiveGenMW = baseGenMW * ocMultiplier * somersloopMultiplier;

    // Nombre de générateurs nécessaires
    const exactGenerators = targetMW / effectiveGenMW;
    const ceilGenerators = Math.ceil(exactGenerators);
    const grossPowerMW = exactGenerators * effectiveGenMW;

    // Débits de combustible et fluides
    const totalFuelRate = exactGenerators * tech.fuelRatePerGen * ocMultiplier;
    const totalWaterRate = exactGenerators * tech.waterRatePerGen * ocMultiplier;
    const totalWasteRate = exactGenerators * tech.wasteRatePerGen * ocMultiplier;
    const waterExtractorsCount = totalWaterRate > 0 ? totalWaterRate / 120 : 0;

    // Ressources brutes nécessaires en entrée
    const rawResourcesRequired = this.calculateRawInputs(tech, exactGenerators, ocMultiplier);

    // Analyse hydraulique et réseau de tuyauterie
    const plumbingAnalysis = this.analyzePlumbing(tech, ceilGenerators, totalWaterRate, totalFuelRate);

    // Chaîne amont
    const upstreamMachines = this.calculateUpstream(tech, ceilGenerators, totalFuelRate, totalWaterRate);

    // Matériaux de construction requis
    const buildingShoppingList = this.computeShoppingList(tech, ceilGenerators, waterExtractorsCount, upstreamMachines);

    return {
      mode: "target_power",
      tech,
      targetMW,
      grossPowerMW: Math.round(grossPowerMW * 100) / 100,
      exactGenerators: Math.round(exactGenerators * 100) / 100,
      ceilGenerators,
      overclockPercent,
      isSomersloop,
      effectiveGenMW: Math.round(effectiveGenMW * 100) / 100,
      totalFuelRate: Math.round(totalFuelRate * 100) / 100,
      totalWaterRate: Math.round(totalWaterRate * 100) / 100,
      totalWasteRate: Math.round(totalWasteRate * 100) / 100,
      waterExtractorsCount: Math.round(waterExtractorsCount * 100) / 100,
      rawResourcesRequired,
      plumbingAnalysis,
      upstreamMachines,
      buildingShoppingList
    };
  }

  /**
   * Calcul par Débit de Ressource Disponible (/min)
   * @param {string} techId 
   * @param {number} resourceRate (/min ou m³/min)
   * @param {number} overclockPercent 
   * @param {boolean} isSomersloop 
   * @returns {Object} Bilan complet de la centrale
   */
  calculateFromResourceRate(techId, resourceRate, overclockPercent = 100, isSomersloop = false) {
    const tech = this.techs[techId];
    if (!tech) throw new Error(`Technologie énergétique inconnue : ${techId}`);

    const baseGenMW = tech.generatorPowerMW;
    const ocMultiplier = overclockPercent / 100;
    const somersloopMultiplier = isSomersloop ? 2.0 : 1.0;
    const effectiveGenMW = baseGenMW * ocMultiplier * somersloopMultiplier;

    if (tech.fuelRatePerGen === 0) {
      // Pour géothermie ou alien (pas de ressource consommée)
      return this.calculateFromTargetPower(techId, 1000, overclockPercent, isSomersloop);
    }

    const fuelPerGen = tech.fuelRatePerGen * ocMultiplier;
    const exactGenerators = resourceRate / fuelPerGen;
    const ceilGenerators = Math.ceil(exactGenerators);
    const grossPowerMW = exactGenerators * effectiveGenMW;

    const totalFuelRate = resourceRate;
    const totalWaterRate = exactGenerators * tech.waterRatePerGen * ocMultiplier;
    const totalWasteRate = exactGenerators * tech.wasteRatePerGen * ocMultiplier;
    const waterExtractorsCount = totalWaterRate > 0 ? totalWaterRate / 120 : 0;

    // Ressources brutes nécessaires en entrée
    const rawResourcesRequired = this.calculateRawInputs(tech, exactGenerators, ocMultiplier);

    const plumbingAnalysis = this.analyzePlumbing(tech, ceilGenerators, totalWaterRate, totalFuelRate);
    const upstreamMachines = this.calculateUpstream(tech, ceilGenerators, totalFuelRate, totalWaterRate);
    const buildingShoppingList = this.computeShoppingList(tech, ceilGenerators, waterExtractorsCount, upstreamMachines);

    return {
      mode: "resource_rate",
      tech,
      targetMW: Math.round(grossPowerMW),
      grossPowerMW: Math.round(grossPowerMW * 100) / 100,
      exactGenerators: Math.round(exactGenerators * 100) / 100,
      ceilGenerators,
      overclockPercent,
      isSomersloop,
      effectiveGenMW: Math.round(effectiveGenMW * 100) / 100,
      totalFuelRate: Math.round(totalFuelRate * 100) / 100,
      totalWaterRate: Math.round(totalWaterRate * 100) / 100,
      totalWasteRate: Math.round(totalWasteRate * 100) / 100,
      waterExtractorsCount: Math.round(waterExtractorsCount * 100) / 100,
      rawResourcesRequired,
      plumbingAnalysis,
      upstreamMachines,
      buildingShoppingList
    };
  }

  /**
   * Calcule précisément les ressources brutes totales en entrée
   */
  calculateRawInputs(tech, exactGenerators, ocMultiplier) {
    if (!tech.rawInputs || tech.rawInputs.length === 0) return [];

    return tech.rawInputs.map(r => {
      const isFixed = tech.id === "geothermal" || tech.id === "alien_augmenter";
      const totalRate = isFixed ? Math.ceil(exactGenerators * r.ratePerGen) : (exactGenerators * r.ratePerGen * ocMultiplier);
      const roundedRate = Math.round(totalRate * 100) / 100;

      let miningNote = "";
      if (r.isFluid && r.item.toLowerCase().includes("eau")) {
        const extCount = (totalRate / 120).toFixed(1);
        miningNote = `${extCount} × Extracteur(s) d'eau (120 m³/min)`;
      } else if (r.isFluid && r.item.toLowerCase().includes("pétrole")) {
        miningNote = `${(totalRate / 600).toFixed(2)} × Tuyau Mk.2 (600 m³/min)`;
      } else if (r.isFluid && r.item.toLowerCase().includes("azote")) {
        miningNote = `Puits d'extraction de gaz`;
      } else if (!r.isFluid && !isFixed) {
        if (totalRate <= 60) miningNote = "1 gisement Impur / Normal";
        else if (totalRate <= 120) miningNote = "1 gisement Normal (Foreuse Mk.1) ou 1/2 Pur";
        else if (totalRate <= 240) miningNote = "1 gisement Pur (Foreuse Mk.2) ou 2 Normaux";
        else if (totalRate <= 480) miningNote = "1 gisement Pur (Foreuse Mk.3) ou 2 Purs Mk.2";
        else miningNote = `${Math.ceil(totalRate / 480)} gisements purs recommandés`;
      }

      return {
        item: r.item,
        totalRate: roundedRate,
        unit: r.unit,
        isFluid: r.isFluid,
        color: r.color,
        miningNote
      };
    });
  }

  /**
   * Analyse et optimise les sections de tuyauterie pour éviter le sloshing
   */
  analyzePlumbing(tech, numGenerators, totalWaterRate, totalFuelRate) {
    if (tech.waterRatePerGen === 0 && (!tech.plumbingGuide || totalFuelRate === 0)) {
      return {
        hasFluid: false,
        summary: "Alimentation solide directe par convoyeur à bande.",
        pipeGroups: []
      };
    }

    const groups = [];

    // Cas spécial Charbon (Ratio 8:3)
    if (tech.id === "coal_standard" || tech.id === "compacted_coal") {
      const standardBlocks = Math.floor(numGenerators / 8);
      const remainingGens = numGenerators % 8;

      if (standardBlocks > 0) {
        groups.push({
          title: `${standardBlocks}× Bloc(s) FICSIT Standard 600 MW (8 Générateurs : 3 Extracteurs)`,
          waterRate: standardBlocks * 360,
          pipeType: "Tuyaux Mk.1 (300 m³/min)",
          recommendation: "3 Extracteurs reliés à 2 tuyaux Mk.1 de 180 m³/min raccordés aux 2 extrémités de la ligne de 8 générateurs (Boucle fermée anti-reflux)."
        });
      }

      if (remainingGens > 0) {
        const remWater = remainingGens * 45;
        const remExt = Math.ceil(remWater / 120);
        groups.push({
          title: `Bloc d'appoint (${remainingGens} Générateurs : ${remExt} Extracteurs)`,
          waterRate: remWater,
          pipeType: "Tuyau Mk.1",
          recommendation: `${remExt} Extracteur(s) régulé(s) pour alimenter ${remWater} m³/min d'eau.`
        });
      }
    } else if (tech.id.startsWith("nuclear")) {
      // Nucléaire (240 m³/min d'eau par réacteur)
      groups.push({
        title: `${numGenerators}× Circuit(s) Nucléaire(s) Dédié(s)`,
        waterRate: totalWaterRate,
        pipeType: "Tuyaux Mk.1 Dédiés (240 m³/min)",
        recommendation: "Raccordez 2 Extracteurs d'eau à 100% (ou 1 surcadencé à 200%) directement sur chaque réacteur sans collecteur partagé pour éviter toute perte de débit."
      });
    } else if (totalFuelRate > 0) {
      // Carburants liquides (Fuel, Turbofuel, Rocket Fuel)
      const maxPipeMk1 = 300;
      const numMk1Pipes = Math.ceil(totalFuelRate / maxPipeMk1);
      const gensPerPipe = Math.ceil(numGenerators / numMk1Pipes);

      groups.push({
        title: `Distribution de Carburant (${Math.round(totalFuelRate)} m³/min)`,
        fuelRate: totalFuelRate,
        pipeType: totalFuelRate > 300 ? "Tuyaux Mk.2 (600 m³/min) ou " + numMk1Pipes + "× Tuyaux Mk.1 (300 m³/min)" : "1× Tuyau Mk.1 (300 m³/min)",
        recommendation: `Divisez votre complexe en ${numMk1Pipes} rangée(s) d'environ ${gensPerPipe} générateurs avec un réservoir tampon en tête de ligne.`
      });
    }

    return {
      hasFluid: true,
      summary: tech.ratiosNote,
      pipeGroups: groups
    };
  }

  /**
   * Calcule les machines amont nécessaires
   */
  calculateUpstream(tech, numGenerators, totalFuelRate, totalWaterRate) {
    if (!tech.upstream || tech.upstream.length === 0) return [];

    return tech.upstream.map(u => {
      const machineCount = Math.ceil(numGenerators * u.countRatio);
      return {
        building: u.building,
        count: machineCount,
        outputItem: u.outputItem,
        inputItem: u.inputItem
      };
    });
  }

  /**
   * Calcule la liste d'achat des matériaux pour construire la centrale
   */
  computeShoppingList(tech, numGenerators, waterExtractorsCount, upstreamMachines) {
    const list = {};

    const addCost = (buildingName, count) => {
      if (count <= 0) return;
      const bData = this.buildings[buildingName];
      if (bData && bData.cost) {
        for (const [mat, qty] of Object.entries(bData.cost)) {
          list[mat] = (list[mat] || 0) + qty * count;
        }
      }
    };

    // Générateur principal
    addCost(tech.generatorType, numGenerators);

    // Extracteurs d'eau
    if (waterExtractorsCount > 0) {
      addCost("Water Extractor", Math.ceil(waterExtractorsCount));
    }

    // Machines amont
    if (upstreamMachines) {
      upstreamMachines.forEach(m => {
        let bKey = "Constructor";
        if (m.building.includes("Raffinerie")) bKey = "Oil Refinery";
        else if (m.building.includes("Mélangeur")) bKey = "Blender";
        else if (m.building.includes("Assembleur")) bKey = "Assembler";
        else if (m.building.includes("Manufacturier")) bKey = "Manufacturer";
        else if (m.building.includes("Accélérateur")) bKey = "Particle Accelerator";
        addCost(bKey, m.count);
      });
    }

    return list;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PowerPlantCalculator };
}
