// Moteur de Calcul de Production Satisfactory 1.2
// Supporte calculs récursifs, recettes alternatives, bilan énergétique et checklist chantier

class ProductionCalculator {
  constructor(recipes, buildings) {
    this.recipes = recipes;
    this.buildings = buildings;
    // Recettes actives par produit : { "iron_ingot": "recipe_iron_ingot", ... }
    this.activeRecipes = {};
    this.initDefaultRecipes();
  }

  // Initialise par défaut avec les recettes standards
  initDefaultRecipes() {
    this.recipes.forEach(recipe => {
      recipe.products.forEach(p => {
        if (!this.activeRecipes[p.item] || (!recipe.isAlt && this.isAltRecipe(this.activeRecipes[p.item]))) {
          this.activeRecipes[p.item] = recipe.id;
        }
      });
    });
  }

  isAltRecipe(recipeId) {
    const r = this.recipes.find(rec => rec.id === recipeId);
    return r ? r.isAlt : false;
  }

  // Définir une recette active pour un item (ex: Cast Screw au lieu de standard Screw)
  setRecipeForItem(itemId, recipeId) {
    this.activeRecipes[itemId] = recipeId;
  }

  // Obtenir toutes les recettes disponibles pour un item donné (standard + alternatives)
  getRecipesForItem(itemId) {
    return this.recipes.filter(r => r.products.some(p => p.item === itemId));
  }

  // Obtenir la recette active pour un item
  getActiveRecipe(itemId) {
    const recId = this.activeRecipes[itemId];
    if (recId) {
      const found = this.recipes.find(r => r.id === recId);
      if (found) return found;
    }
    // Fallback standard
    return this.recipes.find(r => !r.isAlt && r.products.some(p => p.item === itemId));
  }

  // Liste des matières premières brutes (non craftées en usine)
  isRawResource(itemId) {
    const rawList = [
      "iron_ore", "copper_ore", "limestone", "coal", "caterium_ore",
      "raw_quartz", "sulfur", "bauxite", "crude_oil", "water",
      "nitrogen_gas", "sam", "uranium"
    ];
    return rawList.includes(itemId);
  }

  /**
   * Calcul principal de chaîne de production
   * @param {Array<{item: string, rate: number}>} targets Liste des produits cibles et débits demandés (/min)
   * @param {Object} options Options d'overclocking et d'amplification Somersloop 1.0
   * @returns {Object} Rapport complet (étapes, machines, énergie, matières premières, shards, somersloops)
   */
  calculate(targets, options = {}) {
    const defaultOverclock = options.defaultOverclock || 100;
    const defaultSomersloop = !!options.defaultSomersloop;
    const stepOverrides = options.stepOverrides || {};

    const demand = Object.create(null);
    const productionSteps = [];
    const rawResources = Object.create(null);
    const byproducts = Object.create(null);

    // Initialisation avec les cibles
    targets.forEach(t => {
      demand[t.item] = (demand[t.item] || 0) + t.rate;
    });

    // File de résolution
    const queue = [...targets];

    while (queue.length > 0) {
      const current = queue.shift();
      const itemId = current.item;
      const rate = current.rate;

      if (rate <= 0) continue;

      if (this.isRawResource(itemId)) {
        rawResources[itemId] = (rawResources[itemId] || 0) + rate;
        continue;
      }

      const recipe = this.getActiveRecipe(itemId);
      if (!recipe) {
        rawResources[itemId] = (rawResources[itemId] || 0) + rate;
        continue;
      }

      const overrides = stepOverrides[recipe.id] || {};
      const isSomersloop = (overrides.somersloop !== undefined) ? overrides.somersloop : defaultSomersloop;
      const somersloopMultiplier = isSomersloop ? 2 : 1;

      // Quantité produite par cycle standard
      const productInfo = recipe.products.find(p => p.item === itemId);
      const baseOutputPerMin = productInfo ? productInfo.amount : 1;
      const effectiveOutputPerMin = baseOutputPerMin * somersloopMultiplier;

      // Facteur d'échelle du cycle
      const cyclesPerMin = rate / effectiveOutputPerMin;

      // Calcul des sous-produits éventuels
      recipe.products.forEach(p => {
        if (p.item !== itemId) {
          const bpAmount = p.amount * cyclesPerMin * somersloopMultiplier;
          byproducts[p.item] = (byproducts[p.item] || 0) + bpAmount;
        }
      });

      // Bâtiment
      const buildingInfo = this.buildings[recipe.building] || {
        id: recipe.building,
        name: recipe.building,
        powerMW: 10,
        icon: "🏭",
        cost: {}
      };

      const machinesNeeded100 = cyclesPerMin;

      // Enregistrer l'étape de production
      let existingStep = productionSteps.find(s => s.recipeId === recipe.id);
      if (!existingStep) {
        existingStep = {
          recipeId: recipe.id,
          recipeName: recipe.name,
          isAlt: recipe.isAlt,
          itemId: itemId,
          building: buildingInfo,
          machinesCount: 0,
          rateProduced: 0,
          powerMW: 0,
          ingredients: [],
          overclock: overrides.overclock || defaultOverclock,
          somersloop: isSomersloop
        };
        productionSteps.push(existingStep);
      }

      existingStep.machinesCount += machinesNeeded100;
      existingStep.rateProduced += rate;

      // Traiter les ingrédients nécessaires (Ingrédients réduits si Somersloop actif !)
      recipe.ingredients.forEach(ing => {
        const requiredIngRate = ing.amount * cyclesPerMin;
        
        let existingIng = existingStep.ingredients.find(i => i.item === ing.item);
        if (!existingIng) {
          existingStep.ingredients.push({ item: ing.item, rate: requiredIngRate });
        } else {
          existingIng.rate += requiredIngRate;
        }

        // Ajouter à la file de calcul
        queue.push({ item: ing.item, rate: requiredIngRate });
      });
    }

    // Traitement de l'overclocking, des shards, des somersloops et du bilan d'énergie
    let totalPowerMW = 0;
    let totalPowerShards = 0;
    let totalSomersloops = 0;
    const buildingTotals = Object.create(null);
    const constructionMaterials = Object.create(null);

    productionSteps.forEach(step => {
      const bId = step.building.id;
      const clock = Math.min(250, Math.max(1, step.overclock || defaultOverclock));
      const clockFraction = clock / 100;

      // Nombre de machines physiques
      const physicalMachines = Math.ceil(step.machinesCount / clockFraction);
      step.physicalMachines = physicalMachines;
      step.overclock = clock;

      // Éclats de charge requis (Power Shards)
      let shardsPerMachine = 0;
      if (clock > 200) shardsPerMachine = 3;
      else if (clock > 150) shardsPerMachine = 2;
      else if (clock > 100) shardsPerMachine = 1;
      step.powerShardsCount = shardsPerMachine * physicalMachines;
      totalPowerShards += step.powerShardsCount;

      // Somersloops requis (Technologie Alien 1.0)
      let loopsPerMachine = 1;
      if (["assembler"].includes(bId)) loopsPerMachine = 2;
      else if (["manufacturer", "refinery", "blender", "particle_accelerator", "quantum_encoder", "converter"].includes(bId)) loopsPerMachine = 4;

      step.somersloopsCount = step.somersloop ? (loopsPerMachine * physicalMachines) : 0;
      totalSomersloops += step.somersloopsCount;

      // Puissance électrique Satisfactory 1.0 (Exposant 1.321928 + x4 si Somersloop)
      const basePower = step.building.powerMW || 10;
      const somersloopPowerMult = step.somersloop ? 4 : 1;
      const powerPerMachine = basePower * Math.pow(clockFraction, 1.321928) * somersloopPowerMult;
      
      step.powerMW = (step.machinesCount / clockFraction) * powerPerMachine;
      totalPowerMW += step.powerMW;

      // Bâtiments totaux
      buildingTotals[bId] = (typeof buildingTotals[bId] === "number" ? buildingTotals[bId] : 0) + physicalMachines;

      // Matériaux de construction
      const costs = step.building.cost || {};
      for (const [mat, qty] of Object.entries(costs)) {
        constructionMaterials[mat] = (typeof constructionMaterials[mat] === "number" ? constructionMaterials[mat] : 0) + qty * physicalMachines;
      }
    });

    // Tri chronologique de la chaîne (de la fusion/transformation de base vers le produit final)
    const buildingOrder = {
      smelter: 1,
      foundry: 1,
      constructor: 2,
      assembler: 3,
      refinery: 4,
      blender: 4,
      manufacturer: 5,
      particle_accelerator: 6,
      quantum_encoder: 7,
      converter: 8
    };

    productionSteps.sort((a, b) => {
      const orderA = buildingOrder[a.building.id] || 3;
      const orderB = buildingOrder[b.building.id] || 3;
      if (orderA !== orderB) return orderA - orderB;
      // Mettre les cibles finales tout à la fin
      const isTargetA = targets.some(t => t.item === a.itemId);
      const isTargetB = targets.some(t => t.item === b.itemId);
      if (isTargetA && !isTargetB) return 1;
      if (!isTargetA && isTargetB) return -1;
      return 0;
    });

    return {
      targets,
      productionSteps,
      rawResources,
      byproducts,
      totalPowerMW: Math.round(totalPowerMW * 10) / 10,
      totalPowerShards,
      totalSomersloops,
      buildingTotals,
      constructionMaterials
    };
  }

  /**
   * Optimiseur automatique de recettes alternatives (Minimisation du nombre de machines)
   * Utilise la programmation dynamique pour trouver la combinaison globale avec le moins d'usines
   * @param {Array<{item: string, rate: number}>} targets 
   * @param {string} criterion 'min_buildings' | 'min_power'
   * @returns {Object} Rapport d'optimisation (comparatif avant/après, recettes choisies, économies)
   */
  optimize(targets, criterion = 'min_buildings') {
    const memo = new Map();
    const callStack = new Set();

    const getBestRecipeForItem = (itemId) => {
      if (this.isRawResource(itemId)) {
        return { costPerUnit: 0, bestRecipeId: null, subRecipes: {} };
      }

      if (memo.has(itemId)) {
        return memo.get(itemId);
      }

      if (callStack.has(itemId)) {
        return { costPerUnit: Infinity, bestRecipeId: null, subRecipes: {} };
      }
      callStack.add(itemId);

      const recipes = this.getRecipesForItem(itemId);
      if (!recipes || recipes.length === 0) {
        callStack.delete(itemId);
        const res = { costPerUnit: 0, bestRecipeId: null, subRecipes: {} };
        memo.set(itemId, res);
        return res;
      }

      let minCost = Infinity;
      let bestRec = recipes[0];
      let bestSubRecipes = {};

      for (const rec of recipes) {
        const productInfo = rec.products.find(p => p.item === itemId);
        const outputPerMin = productInfo ? productInfo.amount : 1;
        
        // Coût en machines par unité produite par minute
        const machineCostFor1UnitPerMin = 1 / outputPerMin;
        let totalCostForRec = machineCostFor1UnitPerMin;
        let currentSubRecipes = { [itemId]: rec.id };
        let possible = true;

        for (const ing of rec.ingredients) {
          const ingAmountNeededFor1Unit = ing.amount / outputPerMin;
          const ingBest = getBestRecipeForItem(ing.item);

          if (ingBest.costPerUnit === Infinity) {
            possible = false;
            break;
          }

          totalCostForRec += ingAmountNeededFor1Unit * ingBest.costPerUnit;
          Object.assign(currentSubRecipes, ingBest.subRecipes);
        }

        if (possible && totalCostForRec < minCost) {
          minCost = totalCostForRec;
          bestRec = rec;
          bestSubRecipes = currentSubRecipes;
        }
      }

      callStack.delete(itemId);
      const result = { costPerUnit: minCost, bestRecipeId: bestRec ? bestRec.id : null, subRecipes: bestSubRecipes };
      memo.set(itemId, result);
      return result;
    };

    // Calculer les meilleures recettes pour toutes les cibles
    const optimalRecipeMap = {};
    for (const t of targets) {
      const best = getBestRecipeForItem(t.item);
      Object.assign(optimalRecipeMap, best.subRecipes);
    }

    // 1. Calcul Baseline avec Recettes Standards
    this.initDefaultRecipes();
    const baselineResult = this.calculate(targets);
    const baselineMachines = baselineResult.productionSteps.reduce((a, s) => a + s.machinesCount, 0);

    // 2. Calcul avec la Combinaison Optimale
    for (const [it, rId] of Object.entries(optimalRecipeMap)) {
      this.setRecipeForItem(it, rId);
    }
    const optimalResult = this.calculate(targets);
    const optimalMachines = optimalResult.productionSteps.reduce((a, s) => a + s.machinesCount, 0);

    const machineSavings = baselineMachines - optimalMachines;
    const machineSavingsPct = baselineMachines > 0 ? ((machineSavings / baselineMachines) * 100).toFixed(1) : "0.0";

    // Liste des recettes alternatives activées
    const chosenAlts = [];
    for (const [it, rId] of Object.entries(optimalRecipeMap)) {
      const rec = this.recipes.find(r => r.id === rId);
      if (rec && rec.isAlt) {
        chosenAlts.push({
          itemId: it,
          recipeId: rec.id,
          recipeName: rec.name,
          building: rec.building
        });
      }
    }

    return {
      targets,
      criterion,
      recipeMap: optimalRecipeMap,
      chosenAlts,
      baseline: {
        totalMachines: Math.round(baselineMachines * 100) / 100,
        totalPowerMW: baselineResult.totalPowerMW,
        buildingTotals: baselineResult.buildingTotals,
        result: baselineResult
      },
      optimal: {
        totalMachines: Math.round(optimalMachines * 100) / 100,
        totalPowerMW: optimalResult.totalPowerMW,
        buildingTotals: optimalResult.buildingTotals,
        result: optimalResult
      },
      savings: {
        machines: Math.round(machineSavings * 100) / 100,
        machinesPct: machineSavingsPct,
        powerMW: Math.round((baselineResult.totalPowerMW - optimalResult.totalPowerMW) * 10) / 10
      }
    };
  }
}

if (typeof module !== "undefined") {
  module.exports = { ProductionCalculator };
}
