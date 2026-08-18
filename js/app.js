// Application Principale - Satisfactory Companion Dashboard
// Contrôleur UI, synchronisation LocalStorage, Calculateur & Savegame Parser

document.addEventListener("DOMContentLoaded", () => {
  // Instances des moteurs
  const calculator = new ProductionCalculator(RECIPES, BUILDINGS);

  // État local persistant
  const STATE = {
    completedMilestones: new Set(JSON.parse(localStorage.getItem("ficsit_milestones") || "[]")),
    completedPhases: new Set(JSON.parse(localStorage.getItem("ficsit_phases") || "[]")),
    activeAltRecipes: JSON.parse(localStorage.getItem("ficsit_alt_recipes") || "{}"),
    checkedChecklist: new Set(JSON.parse(localStorage.getItem("ficsit_checklist") || "[]")),
    builtMachines: new Set(JSON.parse(localStorage.getItem("ficsit_built_machines") || "[]")),
    calcOverclock: parseInt(localStorage.getItem("ficsit_calc_overclock") || "100", 10),
    calcSomersloop: localStorage.getItem("ficsit_calc_somersloop") === "true",
    stepOverrides: {},
    lastCalculation: null
  };

  let currentBlueprintCategory = "all";

  // Synchroniser les recettes alternatives stockées
  for (const [item, recipeId] of Object.entries(STATE.activeAltRecipes)) {
    calculator.setRecipeForItem(item, recipeId);
  }

  // Éléments DOM
  const navTabs = document.querySelectorAll(".nav-tab");
  const tabViews = document.querySelectorAll(".tab-view");
  const statCompletedEl = document.getElementById("stat-completed-milestones");
  const statPowerEl = document.getElementById("stat-total-power");

  // =========================================================================
  // GESTION DES ONGLETS & NAVIGATION
  // =========================================================================
  function switchTab(targetView) {
    navTabs.forEach(t => {
      if (t.getAttribute("data-tab") === targetView) {
        t.classList.add("active");
      } else {
        t.classList.remove("active");
      }
    });

    tabViews.forEach(v => {
      if (v.id === `view-${targetView}`) {
        v.classList.add("active");
      } else {
        v.classList.remove("active");
      }
    });

    if (targetView === "synthetic") {
      renderSyntheticView();
    } else if (targetView === "blueprints") {
      renderBlueprints();
    } else if (targetView === "map") {
      initInteractiveMap();
      if (mapEngineInstance) {
        setTimeout(() => mapEngineInstance.resize(), 50);
      }
    }
  }

  function initNavigation() {
    navTabs.forEach(tab => {
      tab.addEventListener("click", () => {
        const targetView = tab.getAttribute("data-tab");
        switchTab(targetView);
      });
    });
  }

  // =========================================================================
  // AFFICHAGE DES JALONS (TIERS 0 À 9)
  // =========================================================================
  function renderMilestones() {
    const container = document.getElementById("milestones-accordion");
    if (!container) return;

    // Boutons Tout Déplier / Tout Replier
    const expandAllBtn = document.getElementById("btn-expand-all-tiers");
    const collapseAllBtn = document.getElementById("btn-collapse-all-tiers");

    if (expandAllBtn) {
      expandAllBtn.onclick = () => {
        document.querySelectorAll(".tier-block").forEach(b => b.classList.add("open"));
      };
    }

    if (collapseAllBtn) {
      collapseAllBtn.onclick = () => {
        document.querySelectorAll(".tier-block").forEach(b => b.classList.remove("open"));
      };
    }

    // Boutons de Saut Rapide
    document.querySelectorAll(".tier-jump-btn").forEach(btn => {
      btn.onclick = () => {
        const tierNum = btn.getAttribute("data-tier");
        const targetBlock = document.getElementById(`tier-block-${tierNum}`);
        if (targetBlock) {
          targetBlock.classList.add("open");
          targetBlock.scrollIntoView({ behavior: "smooth", block: "start" });
          targetBlock.style.borderColor = "var(--ficsit-orange)";
          setTimeout(() => {
            targetBlock.style.borderColor = "";
          }, 2000);
        }
      };
    });

    container.innerHTML = "";

    MILESTONES_DATA.tiers.forEach(tierData => {
      const tierBlock = document.createElement("div");
      tierBlock.className = "tier-block open";
      tierBlock.id = `tier-block-${tierData.tier}`;

      // En-tête du Palier
      const completedCount = tierData.milestones.filter(m => STATE.completedMilestones.has(m.id)).length;
      const totalCount = tierData.milestones.length;

      const header = document.createElement("div");
      header.className = "tier-header";
      header.innerHTML = `
        <div class="tier-title">
          <span>${tierData.name}</span>
          <span class="tier-badge">${completedCount} / ${totalCount} complétés</span>
        </div>
        <span class="tier-toggle-icon">▼</span>
      `;

      header.addEventListener("click", () => {
        tierBlock.classList.toggle("open");
      });

      // Grille des jalons
      const grid = document.createElement("div");
      grid.className = "milestones-grid";

      tierData.milestones.forEach(m => {
        const isDone = STATE.completedMilestones.has(m.id);
        const card = document.createElement("div");
        card.className = `milestone-card ${isDone ? "completed" : ""}`;
        card.id = `card-${m.id}`;

        // Bâtiments débloqués
        let bldIcons = "";
        if (m.buildings && m.buildings.length > 0) {
          bldIcons = m.buildings.map(bId => {
            const b = BUILDINGS[bId];
            return b ? `<span title="${b.name}">${b.icon} ${b.name}</span>` : "";
          }).join(", ");
        }

        // Tags de coût
        const costHtml = Object.entries(m.cost || {}).map(([itemKey, qty]) => {
          const itemName = ITEM_NAMES[itemKey] || itemKey;
          return `<div class="cost-tag"><span class="cost-qty">${qty}</span> ${itemName}</div>`;
        }).join("");

        card.innerHTML = `
          <div class="milestone-card-top">
            <div class="milestone-name">${m.name}</div>
            <input type="checkbox" class="milestone-checkbox" data-milestone="${m.id}" ${isDone ? "checked" : ""}>
          </div>
          <div class="cost-tags">${costHtml}</div>
          ${bldIcons ? `<div class="unlocked-buildings">🏭 Débloque : ${bldIcons}</div>` : ""}
          <div style="margin-top: 8px;">
            <button class="btn-outline btn-calc-milestone" data-milestone="${m.id}" style="width: 100%; font-size: 12px; padding: 6px 10px; display: flex; justify-content: center; align-items: center; gap: 6px;">
              <span>⚡</span> Calculer l'Usine pour ce Jalon
            </button>
          </div>
        `;

        const calcMilestoneBtn = card.querySelector(".btn-calc-milestone");
        if (calcMilestoneBtn) {
          calcMilestoneBtn.addEventListener("click", () => {
            loadMilestoneIntoCalculator(m);
          });
        }

        const chk = card.querySelector(".milestone-checkbox");
        chk.addEventListener("change", (e) => {
          if (e.target.checked) {
            STATE.completedMilestones.add(m.id);
            card.classList.add("completed");
          } else {
            STATE.completedMilestones.delete(m.id);
            card.classList.remove("completed");
          }
          saveState();
          updateHUDStats();
          renderSyntheticView();
        });

        grid.appendChild(card);
      });

      tierBlock.appendChild(header);
      tierBlock.appendChild(grid);
      container.appendChild(tierBlock);
    });
  }

  // =========================================================================
  // AFFICHAGE DE L'ASCENSEUR SPATIAL (PHASES 1 À 5)
  // =========================================================================
  function renderPhases() {
    const container = document.getElementById("phases-container");
    if (!container) return;

    container.innerHTML = "";

    MILESTONES_DATA.phases.forEach(phase => {
      const isDone = STATE.completedPhases.has(phase.id);
      const card = document.createElement("div");
      card.className = `elevator-card ${isDone ? "completed" : ""}`;

      const costHtml = Object.entries(phase.cost).map(([itemKey, qty]) => {
        const itemName = ITEM_NAMES[itemKey] || itemKey;
        return `<div class="cost-tag"><span class="cost-qty">${qty}</span> ${itemName}</div>`;
      }).join("");

      card.innerHTML = `
        <div class="elevator-info">
          <h4>🚀 ${phase.name} (${phase.tierRequirement})</h4>
          <p>${phase.description}</p>
          <div class="cost-tags" style="margin-top: 10px;">${costHtml}</div>
          <div style="font-size: 12px; color: var(--ficsit-cyan); margin-top: 6px;">✨ ${phase.unlocks}</div>
        </div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <button class="btn-outline btn-calc-phase" data-phase="${phase.id}">Calculer la chaîne</button>
          <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 13px; font-weight: 600;">
            <input type="checkbox" class="milestone-checkbox phase-chk" data-phase="${phase.id}" ${isDone ? "checked" : ""}>
            Validé
          </label>
        </div>
      `;

      const chk = card.querySelector(".phase-chk");
      chk.addEventListener("change", (e) => {
        if (e.target.checked) {
          STATE.completedPhases.add(phase.id);
          card.classList.add("completed");
        } else {
          STATE.completedPhases.delete(phase.id);
          card.classList.remove("completed");
        }
        saveState();
        updateHUDStats();
        renderSyntheticView();
      });

      const calcBtn = card.querySelector(".btn-calc-phase");
      calcBtn.addEventListener("click", () => {
        loadPhaseIntoCalculator(phase);
      });

      container.appendChild(card);
    });
  }

  // =========================================================================
  // VUE SYNTHÉTIQUE DE PROGRESSION
  // =========================================================================
  function renderSyntheticView() {
    const container = document.getElementById("synthetic-summary-content");
    if (!container) return;

    // Déterminer les machines débloquées et prochaines étapes
    const unlockedBuildings = new Set(["smelter", "constructor"]); // Base
    const nextMilestones = [];

    MILESTONES_DATA.tiers.forEach(t => {
      t.milestones.forEach(m => {
        if (STATE.completedMilestones.has(m.id)) {
          (m.buildings || []).forEach(b => unlockedBuildings.add(b));
        } else {
          if (nextMilestones.length < 5) {
            nextMilestones.push({ tier: t.tier, name: m.name, cost: m.cost, buildings: m.buildings });
          }
        }
      });
    });

    const totalMilestones = MILESTONES_DATA.tiers.reduce((acc, t) => acc + t.milestones.length, 0);
    const progressPercent = Math.round((STATE.completedMilestones.size / totalMilestones) * 100);

    let bldListHtml = Array.from(unlockedBuildings).map(bId => {
      const b = BUILDINGS[bId];
      return b ? `<div class="summary-item"><span>${b.icon} ${b.name}</span><span class="cost-tag">${b.powerMW} MW</span></div>` : "";
    }).join("");

    let nextHtml = nextMilestones.map(nm => {
      const costStr = Object.entries(nm.cost || {}).map(([k, q]) => `${q} ${ITEM_NAMES[k] || k}`).join(", ");
      
      // Pré-calcul rapide des machines pour ce jalon (sur base 15 min)
      const targets = Object.entries(nm.cost || {}).map(([item, qty]) => ({ item, rate: Math.round((qty / 15) * 100) / 100 }));
      const quickCalc = calculator.calculate(targets);
      
      const machineSummary = Object.entries(quickCalc.buildingTotals).map(([bId, count]) => {
        const b = BUILDINGS[bId] || { name: bId, icon: "🏭" };
        return `${count}× ${b.name}`;
      }).join(", ");

      return `
        <div class="summary-item" style="flex-direction: column; align-items: flex-start; gap: 8px; padding: 12px; margin-bottom: 6px;">
          <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
            <div style="font-weight: 700; color: var(--text-primary);">Palier ${nm.tier} : ${nm.name}</div>
            <button class="btn-outline btn-quick-calc-nm" data-milestone-id="${nm.name}" style="font-size: 11px; padding: 4px 8px;">
              <span>⚡</span> Calculer l'Usine
            </button>
          </div>
          <div style="font-size: 12px; color: var(--text-secondary);">Requis : ${costStr}</div>
          <div style="font-size: 12px; color: var(--ficsit-orange); font-weight: 600;">
            🏭 Machines estimées (lot en 15 min) : ${machineSummary || "Aucune machine complexe"}
          </div>
        </div>
      `;
    }).join("");

    container.innerHTML = `
      <div class="card-panel" style="margin-bottom: 20px; border-left: 4px solid var(--ficsit-orange);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <h3 style="font-family: var(--font-display); font-size: 18px;">Progression Globale FICSIT</h3>
          <span style="font-family: var(--font-display); font-weight: 700; color: var(--ficsit-orange); font-size: 20px;">${progressPercent}%</span>
        </div>
        <div style="background: var(--bg-card); height: 12px; border-radius: 6px; overflow: hidden; border: 1px solid var(--border-subtle);">
          <div style="background: linear-gradient(90deg, var(--ficsit-orange), var(--ficsit-amber)); width: ${progressPercent}%; height: 100%; transition: width 0.4s ease;"></div>
        </div>
      </div>

      <div class="synthetic-grid">
        <div class="tech-summary-card">
          <h3>🏭 Bâtiments de Production Débloqués</h3>
          <div class="summary-list">${bldListHtml}</div>
        </div>
        <div class="tech-summary-card">
          <h3>🎯 Prochains Jalons Recommandés</h3>
          <div class="summary-list">${nextHtml || "<div style='color: var(--ficsit-green);'>Tous les jalons actuels sont validés ! Bravo Pionnier !</div>"}</div>
        </div>
      </div>
    `;

    // Écouteurs pour les boutons de calcul rapide dans la vue synthétique
    container.querySelectorAll(".btn-quick-calc-nm").forEach((btn, idx) => {
      btn.addEventListener("click", () => {
        const targetNm = nextMilestones[idx];
        if (targetNm) {
          loadMilestoneIntoCalculator(targetNm);
        }
      });
    });
  }

  function loadMilestoneIntoCalculator(milestone) {
    const targets = Object.entries(milestone.cost || {}).map(([item, qty]) => {
      // Cadence pour produire le jalon en 15 minutes
      return { item: item, rate: Math.round((qty / 15) * 100) / 100 };
    });

    if (targets.length === 0) return;

    const results = calculator.calculate(targets, {
      defaultOverclock: STATE.calcOverclock,
      defaultSomersloop: STATE.calcSomersloop,
      stepOverrides: STATE.stepOverrides
    });
    results.milestoneName = milestone.name;
    results.isMilestone = true;
    STATE.lastCalculation = results;

    // Afficher la bannière spéciale du Jalon actif
    const banner = document.getElementById("calc-active-milestone-banner");
    const bannerName = document.getElementById("calc-milestone-banner-name");
    const bannerDesc = document.getElementById("calc-milestone-banner-desc");
    if (banner && bannerName) {
      banner.style.display = "flex";
      bannerName.innerText = milestone.name;
      const targetsDesc = targets.map(t => `<strong style="color: #4ade80;">${t.rate}/m</strong> ${ITEM_NAMES[t.item]||t.item}`).join(" + ");
      if (bannerDesc) {
        bannerDesc.innerHTML = `Ligne complète pour compléter ce Jalon en 15 min : ${targetsDesc}`;
      }
    }

    renderCalculationResults(results);

    // Mettre à jour la sélection d'item
    const firstTarget = targets[0].item;
    const itemSelect = document.getElementById("calc-item-select");
    if (itemSelect) itemSelect.value = firstTarget;

    // Basculer vers l'onglet calculateur
    switchTab("calculator");
    showToast(`Chaîne calculée pour le Jalon : "${milestone.name}" (objectif 15 min)`);
  }

  // =========================================================================
  // CALCULATEUR DE PRODUCTION & RECETTES ALTERNATIVES
  // =========================================================================
  function initCalculatorUI() {
    const itemSelect = document.getElementById("calc-item-select");
    const modeSelect = document.getElementById("calc-mode-select");
    const rateInput = document.getElementById("calc-rate-input");
    const batchQtyInput = document.getElementById("calc-batch-qty");
    const batchTimeInput = document.getElementById("calc-batch-time");
    const batchControls = document.getElementById("calc-batch-controls");
    const rateControls = document.getElementById("calc-rate-controls");
    const runBtn = document.getElementById("btn-run-calc");
    const sendToChecklistBtn = document.getElementById("btn-send-checklist");

    if (!itemSelect) return;

    // Remplir la liste déroulante de tous les items craftables
    const craftableItems = new Set();
    RECIPES.forEach(r => {
      r.products.forEach(p => craftableItems.add(p.item));
    });

    const sortedItems = Array.from(craftableItems).sort((a, b) => {
      const nameA = ITEM_NAMES[a] || a;
      const nameB = ITEM_NAMES[b] || b;
      return nameA.localeCompare(nameB);
    });

    itemSelect.innerHTML = sortedItems.map(itemId => {
      return `<option value="${itemId}">${ITEM_NAMES[itemId] || itemId}</option>`;
    }).join("");

    // Définir par défaut sur Placage Intelligent
    itemSelect.value = "smart_plating";

    // Auto-calcul en temps réel immédiat dès qu'on change d'item ou de quantité
    itemSelect.addEventListener("change", () => {
      executeCalculation(false);
    });

    rateInput.addEventListener("input", () => {
      executeCalculation(true);
    });

    batchQtyInput.addEventListener("input", () => {
      executeCalculation(true);
    });

    batchTimeInput.addEventListener("input", () => {
      executeCalculation(true);
    });

    // Gestion du basculement de mode
    modeSelect.addEventListener("change", () => {
      if (modeSelect.value === "rate") {
        rateControls.style.display = "flex";
        batchControls.style.display = "none";
      } else {
        rateControls.style.display = "none";
        batchControls.style.display = "flex";
      }
      executeCalculation(true);
    });

    // Lancer le calcul standard
    runBtn.addEventListener("click", () => {
      executeCalculation(false);
    });

    // Lancer l'Optimisation Automatique (Minimisation du nombre d'usines)
    const optimizeBtn = document.getElementById("btn-optimize-recipes");
    if (optimizeBtn) {
      optimizeBtn.addEventListener("click", () => {
        executeOptimization();
      });
    }

    // Contrôles Overclocking & Somersloops 1.0
    const globalOverclockSelect = document.getElementById("calc-global-overclock");
    if (globalOverclockSelect) {
      globalOverclockSelect.value = String(STATE.calcOverclock || 100);
      globalOverclockSelect.addEventListener("change", () => {
        STATE.calcOverclock = parseInt(globalOverclockSelect.value, 10) || 100;
        localStorage.setItem("ficsit_calc_overclock", STATE.calcOverclock);
        executeCalculation();
      });
    }

    const globalSomersloopChk = document.getElementById("calc-global-somersloop");
    if (globalSomersloopChk) {
      globalSomersloopChk.checked = !!STATE.calcSomersloop;
      globalSomersloopChk.addEventListener("change", () => {
        STATE.calcSomersloop = globalSomersloopChk.checked;
        localStorage.setItem("ficsit_calc_somersloop", STATE.calcSomersloop ? "true" : "false");
        executeCalculation();
      });
    }

    // Réinitialiser les recettes aux standards
    const resetRecipesBtn = document.getElementById("btn-reset-standard-recipes");
    if (resetRecipesBtn) {
      resetRecipesBtn.addEventListener("click", () => {
        calculator.initDefaultRecipes();
        STATE.activeAltRecipes = {};
        saveState();
        const reportEl = document.getElementById("calc-optimizer-report");
        if (reportEl) reportEl.style.display = "none";
        executeCalculation();
        showToast("Recettes réinitialisées aux standards officiels.");
      });
    }

    // Envoyer vers la checklist
    if (sendToChecklistBtn) {
      sendToChecklistBtn.addEventListener("click", () => {
        if (!STATE.lastCalculation) return;
        addCalculationToChecklist(STATE.lastCalculation);
        showToast("Chaîne de production envoyée à la Checklist de Chantier !");
        // Basculer vers l'onglet checklist
        switchTab("checklist");
      });
    }

    // Téléchargement global SBP depuis le calculateur
    const downloadSbpFunction = async () => {
      if (!STATE.lastCalculation || !STATE.lastCalculation.productionSteps || STATE.lastCalculation.productionSteps.length === 0) {
        executeCalculation(false);
      }
      const results = STATE.lastCalculation;
      if (!results || !results.productionSteps || results.productionSteps.length === 0) {
        showToast("Veuillez d'abord calculer une usine.");
        return;
      }

      const targetItem = results.targets[0] || { item: "Produit Fini", rate: 10 };
      const targetName = ITEM_NAMES[targetItem.item] || targetItem.item;
      const totalMachines = results.productionSteps.reduce((sum, s) => sum + (s.physicalMachines || Math.ceil(s.machinesCount)), 0);

      const bldCount = {};
      const materialsNeeded = {};
      results.productionSteps.forEach(s => {
        const bId = s.building?.id || "constructor";
        const count = s.physicalMachines || Math.ceil(s.machinesCount) || 1;
        bldCount[bId] = (bldCount[bId] || 0) + count;
      });

      materialsNeeded.concrete = (totalMachines * 12) + 80;
      materialsNeeded.iron_plate = (totalMachines * 8);
      materialsNeeded.wire = (totalMachines * 6);

      const bpPayload = {
        id: `bp_calc_${(targetItem.item || 'usine').replace(/[^a-zA-Z0-9_]/g, '_')}`,
        title: `🏭 Usine ${targetName} (${targetItem.rate}/min)`,
        name: `Usine ${targetName}`,
        category: "production",
        designerSize: totalMachines <= 12 ? "4x4 Fondations (Designer Mk.1)" : (totalMachines <= 20 ? "5x5 Fondations (Designer Mk.2)" : "6x6 Fondations (Designer Mk.3)"),
        description: `Usine complète générée automatiquement par le Calculateur pour ${targetName} à ${targetItem.rate}/min.\n• Machines: ${totalMachines} unités\n• Puissance: ${Math.round(results.totalPowerMW)} MW.`,
        inputs: Object.entries(results.rawResources).map(([r, rate]) => `${Math.round(rate*10)/10}/m ${ITEM_NAMES[r]||r}`),
        outputs: [`+${targetItem.rate}/min ${targetName}`],
        powerMW: Math.round(results.totalPowerMW),
        buildingsCount: bldCount,
        materialsNeeded: materialsNeeded
      };

      try {
        showToast(`⏳ Génération du blueprint pour ${targetName}...`);
        const files = await BlueprintFileGenerator.generateFiles(bpPayload);
        BlueprintFileGenerator.downloadBlob(files.sbpBlob, files.sbpFilename);
        setTimeout(() => {
          BlueprintFileGenerator.downloadBlob(files.sbpcfgBlob, files.sbpcfgFilename);
        }, 100);
        showToast(`✅ Blueprint ${bpPayload.title} téléchargé avec succès (.sbp & .sbpcfg) !`);
      } catch(err) {
        console.error(err);
        showToast(`Erreur export blueprint : ${err.message}`);
      }
    };

    const topDownloadBtn = document.getElementById("btn-calc-download-sbp-top");
    if (topDownloadBtn) topDownloadBtn.onclick = downloadSbpFunction;

    const mainDownloadBtn = document.getElementById("btn-calc-download-sbp-main");
    if (mainDownloadBtn) mainDownloadBtn.onclick = downloadSbpFunction;

    // Initialisation du gestionnaire interactif de recettes alternatives (Modal)
    AltRecipesManager.init();

    // Calcul initial
    executeCalculation();
  }

  function executeOptimization() {
    const itemSelect = document.getElementById("calc-item-select");
    const modeSelect = document.getElementById("calc-mode-select");
    const rateInput = document.getElementById("calc-rate-input");
    const batchQtyInput = document.getElementById("calc-batch-qty");
    const batchTimeInput = document.getElementById("calc-batch-time");
    const reportEl = document.getElementById("calc-optimizer-report");

    const itemId = itemSelect.value;
    let targetRate = parseFloat(rateInput.value) || 10;

    if (modeSelect.value === "batch") {
      const totalQty = parseFloat(batchQtyInput.value) || 50;
      const timeMin = parseFloat(batchTimeInput.value) || 10;
      targetRate = totalQty / (timeMin > 0 ? timeMin : 1);
    }

    const targets = [{ item: itemId, rate: targetRate }];
    const opt = calculator.optimize(targets, "min_buildings");

    // Mettre à jour l'état local
    STATE.activeAltRecipes = { ...opt.recipeMap };
    
    // Calculer avec les paramètres d'overclocking et somersloops actifs
    const optimizedResult = calculator.calculate(targets, {
      defaultOverclock: STATE.calcOverclock,
      defaultSomersloop: STATE.calcSomersloop,
      stepOverrides: STATE.stepOverrides
    });

    STATE.lastCalculation = optimizedResult;
    saveState();

    // Afficher le rapport d'optimisation
    if (reportEl) {
      reportEl.style.display = "block";
      const altsHtml = opt.chosenAlts.map(alt => {
        return `<span style="background: rgba(250, 149, 73, 0.2); border: 1px solid var(--ficsit-orange); color: var(--ficsit-orange); font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 4px;">★ ${alt.recipeName}</span>`;
      }).join(" ") || "<span style='color: var(--text-secondary); font-size: 12px;'>La recette standard est déjà la plus économe en machines.</span>";

      reportEl.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; flex-wrap: wrap; gap: 10px;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="background: var(--ficsit-green); color: #000; font-weight: 900; font-size: 11px; padding: 2px 8px; border-radius: 4px;">OPTIMISATION PARFAITE</span>
              <h3 style="font-family: var(--font-display); font-size: 16px; color: var(--text-primary); margin: 0;">
                🏆 Solution avec le Minimum Absolu de Bâtiments
              </h3>
            </div>
            <p style="font-size: 12px; color: var(--text-secondary); margin: 4px 0 0 0;">
              L'algorithme a comparé toutes les combinaisons alternatives de l'arbre technologique 1.0.
            </p>
          </div>
          <div style="display: flex; gap: 14px; text-align: right;">
            <div>
              <div style="font-size: 11px; text-transform: uppercase; color: var(--text-muted); font-weight: 700;">Machines Requises</div>
              <div style="font-size: 20px; font-weight: 800; color: var(--ficsit-green);">${opt.optimal.totalMachines} <span style="font-size: 13px; color: var(--text-muted); text-decoration: line-through;">${opt.baseline.totalMachines}</span></div>
            </div>
            <div>
              <div style="font-size: 11px; text-transform: uppercase; color: var(--text-muted); font-weight: 700;">Gain d'Espace</div>
              <div style="font-size: 20px; font-weight: 800; color: var(--ficsit-orange);">-${opt.savings.machinesPct}%</div>
            </div>
            <div>
              <div style="font-size: 11px; text-transform: uppercase; color: var(--text-muted); font-weight: 700;">Énergie Totale</div>
              <div style="font-size: 20px; font-weight: 800; color: var(--ficsit-amber);">${opt.optimal.totalPowerMW} MW</div>
            </div>
          </div>
        </div>

        <div style="background: rgba(0,0,0,0.3); border-radius: var(--radius-sm); padding: 10px; margin-top: 10px;">
          <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: var(--text-muted); margin-bottom: 6px;">
            Recettes Alternatives Sélectionnées (${opt.chosenAlts.length}) :
          </div>
          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            ${altsHtml}
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; margin-top: 10px;">
          <button type="button" class="btn-ficsit" id="btn-toggle-all-calc-grids" style="font-size: 12px; padding: 6px 14px; font-weight: 700;">
            🗺️ Déployer Tous les Plans de Montage 2D de l'Usine
          </button>
        </div>
      `;

      const toggleAllBtn = document.getElementById("btn-toggle-all-calc-grids");
      if (toggleAllBtn) {
        toggleAllBtn.onclick = () => {
          const rows = document.querySelectorAll(".calc-step-grid-row");
          const anyHidden = Array.from(rows).some(r => r.style.display === "none");
          rows.forEach(r => r.style.display = anyHidden ? "table-row" : "none");
          toggleAllBtn.textContent = anyHidden ? "🗺️ Replier Tous les Plans de Montage 2D" : "🗺️ Déployer Tous les Plans de Montage 2D de l'Usine";
        };
      }
    }

    // Afficher les résultats du calcul
    renderCalculationResults(optimizedResult);
    showToast(`Optimisation réussie : ${opt.optimal.totalMachines} machines (-${opt.savings.machinesPct}%) !`);
  }

  function executeCalculation(isAuto = false) {
    const itemSelect = document.getElementById("calc-item-select");
    const modeSelect = document.getElementById("calc-mode-select");
    const rateInput = document.getElementById("calc-rate-input");
    const batchQtyInput = document.getElementById("calc-batch-qty");
    const batchTimeInput = document.getElementById("calc-batch-time");

    if (!itemSelect) return;

    if (!isAuto) {
      const banner = document.getElementById("calc-active-milestone-banner");
      if (banner) banner.style.display = "none";
    }

    const itemId = itemSelect.value;
    let targetRate = parseFloat(rateInput.value) || 10;

    if (modeSelect.value === "batch") {
      const totalQty = parseFloat(batchQtyInput.value) || 50;
      const timeMin = parseFloat(batchTimeInput.value) || 10;
      targetRate = totalQty / (timeMin > 0 ? timeMin : 1);
    }

    const results = calculator.calculate([{ item: itemId, rate: targetRate }], {
      defaultOverclock: STATE.calcOverclock,
      defaultSomersloop: STATE.calcSomersloop,
      stepOverrides: STATE.stepOverrides
    });
    STATE.lastCalculation = results;
    renderCalculationResults(results);
    updateHUDStats();

    if (!isAuto) {
      showToast(`Calcul d'usine mis à jour : ${ITEM_NAMES[itemId] || itemId} (${targetRate}/min)`);
    }
  }

  function loadPhaseIntoCalculator(phase) {
    const targets = Object.entries(phase.cost).map(([item, qty]) => {
      // Cadence pour terminer la phase en 30 minutes
      return { item: item, rate: Math.round((qty / 30) * 100) / 100 };
    });

    const results = calculator.calculate(targets, {
      defaultOverclock: STATE.calcOverclock,
      defaultSomersloop: STATE.calcSomersloop,
      stepOverrides: STATE.stepOverrides
    });
    results.phaseName = phase.name;
    results.isPhase = true;
    STATE.lastCalculation = results;

    // Afficher la bannière de phase active
    const banner = document.getElementById("calc-active-milestone-banner");
    const bannerName = document.getElementById("calc-milestone-banner-name");
    const bannerDesc = document.getElementById("calc-milestone-banner-desc");
    if (banner && bannerName) {
      banner.style.display = "flex";
      bannerName.innerText = `Ascenseur Spatial : ${phase.name}`;
      const targetsDesc = targets.map(t => `<strong style="color: #4ade80;">${t.rate}/m</strong> ${ITEM_NAMES[t.item]||t.item}`).join(" + ");
      if (bannerDesc) {
        bannerDesc.innerHTML = `Ligne complète requise (objectif 30 min) : ${targetsDesc}`;
      }
    }

    renderCalculationResults(results);

    // Basculer vers l'onglet calculateur
    switchTab("calculator");
    showToast(`Calcul chargé pour : ${phase.name}`);
  }

  // =========================================================================
  // MOTEUR D'ORGANIGRAMME INTERACTIF DE PRODUCTION (STYLE SATISFACTORY-CALCULATOR / SCIM)
  // =========================================================================
  var SatisfactoryFlowchart = {
    viewState: { scale: 1, x: 20, y: 20, isDragging: false, startX: 0, startY: 0 },
    customPositions: {},
    lastGraph: null,
    orientation: "horizontal",
    heatmapMode: false,

    getBuildingTheme(buildingId) {
      if (buildingId === "smelter" || buildingId === "foundry") return { bg: "#b45309", border: "#f59e0b", label: "FONDERIE" };
      if (buildingId === "constructor") return { bg: "#0369a1", border: "#38bdf8", label: "CONSTRUCTEUR" };
      if (buildingId === "assembler") return { bg: "#6d28d9", border: "#a855f7", label: "ASSEMBLEUSE" };
      if (buildingId === "manufacturer") return { bg: "#a16207", border: "#eab308", label: "FAÇONNEUSE" };
      if (buildingId === "refinery" || buildingId === "blender") return { bg: "#0f766e", border: "#2dd4bf", label: "RAFFINERIE / MÉLANGEUR" };
      return { bg: "#1e293b", border: "#64748b", label: "MACHINE" };
    },

    buildGraph(results) {
      const nodes = new Map();
      const edges = [];

      // 1. Nœuds de ressources brutes (Rank 0)
      Object.entries(results.rawResources || {}).forEach(([res, rate]) => {
        const id = `raw_${res}`;
        nodes.set(id, {
          id,
          type: "raw",
          itemId: res,
          name: ITEM_NAMES[res] || res,
          rate: Math.round(rate * 10) / 10,
          rank: 0,
          w: 220,
          h: 68
        });
      });

      // 2. Nœuds d'étapes de production
      (results.productionSteps || []).forEach(step => {
        const id = `step_${step.recipeId}`;
        const b = step.building || { name: "Machine", icon: "🏭", id: "constructor" };
        const pm = step.physicalMachines || Math.ceil(step.machinesCount);
        nodes.set(id, {
          id,
          type: "step",
          step,
          recipeId: step.recipeId,
          recipeName: step.recipeName,
          itemId: step.itemId,
          itemName: ITEM_NAMES[step.itemId] || step.itemId,
          rate: Math.round(step.rateProduced * 10) / 10,
          building: b,
          machinesCount: pm,
          clock: step.overclock || 100,
          powerMW: Math.round(step.powerMW * 10) / 10,
          ingredients: step.ingredients || [],
          rank: 1,
          w: 260,
          h: 135
        });
      });

      // Calcul des rangs topologiques (Rank = max(parentRank) + 1)
      let changed = true;
      let iterations = 0;
      while (changed && iterations < 15) {
        changed = false;
        iterations++;
        nodes.forEach(node => {
          if (node.type === "step") {
            let maxParentRank = 0;
            node.ingredients.forEach(ing => {
              let provider = null;
              nodes.forEach(p => {
                if (p.itemId === ing.item) provider = p;
              });
              if (provider) {
                maxParentRank = Math.max(maxParentRank, provider.rank);
              }
            });
            const newRank = maxParentRank + 1;
            if (newRank !== node.rank) {
              node.rank = newRank;
              changed = true;
            }
          }
        });
      }

      // 3. Nœuds cibles finaux (Support multi-objectifs / Jalons & Phases de l'Ascenseur)
      let maxRank = 0;
      nodes.forEach(n => { maxRank = Math.max(maxRank, n.rank); });

      const targetsList = (results.targets && results.targets.length > 0) ? results.targets : [{ item: "Produit Fini", rate: 10 }];
      targetsList.forEach((target, tIdx) => {
        const targetId = `target_${target.item}_${tIdx}`;
        nodes.set(targetId, {
          id: targetId,
          type: "target",
          itemId: target.item,
          name: ITEM_NAMES[target.item] || target.item,
          rate: target.rate,
          rank: maxRank + 1,
          w: 230,
          h: 78
        });
      });

      // 4. Construction des Arêtes (Edges / Convoyeurs)
      nodes.forEach(node => {
        if (node.type === "step") {
          node.ingredients.forEach(ing => {
            let provider = null;
            nodes.forEach(p => {
              if (p.id !== node.id && p.itemId === ing.item) provider = p;
            });
            if (provider) {
              edges.push({
                from: provider.id,
                to: node.id,
                item: ing.item,
                rate: Math.round(ing.rate * 10) / 10
              });
            }
          });
        }
      });

      // Arêtes vers tous les produits finaux cibles
      targetsList.forEach((target, tIdx) => {
        const targetId = `target_${target.item}_${tIdx}`;
        let finalProducer = null;
        nodes.forEach(p => {
          if (p.type === "step" && p.itemId === target.item) finalProducer = p;
        });
        if (finalProducer) {
          edges.push({
            from: finalProducer.id,
            to: targetId,
            item: target.item,
            rate: target.rate
          });
        }
      });

      return { nodes, edges };
    },

    // Algorithme d'optimisation de placement hiérarchique Sugiyama (Style SCIM & Satisfactory-Tools)
    layoutGraph(nodes, edges, isVert) {
      // 1. Regroupement par couche (Rank)
      const rankLayers = new Map();
      nodes.forEach(node => {
        if (!rankLayers.has(node.rank)) rankLayers.set(node.rank, []);
        rankLayers.get(node.rank).push(node);
      });

      const ranks = Array.from(rankLayers.keys()).sort((a, b) => a - b);

      // Adjacences rapides pour le barycentre
      const inMap = new Map();
      const outMap = new Map();
      nodes.forEach(n => {
        inMap.set(n.id, []);
        outMap.set(n.id, []);
      });
      edges.forEach(e => {
        if (outMap.has(e.from)) outMap.get(e.from).push(e.to);
        if (inMap.has(e.to)) inMap.get(e.to).push(e.from);
      });

      // 2. Réduction des croisements : Balayages Barycentriques (12 passes alternées)
      for (let sweep = 0; sweep < 12; sweep++) {
        const isForward = (sweep % 2 === 0);
        const loopRanks = isForward ? [...ranks] : [...ranks].reverse();

        loopRanks.forEach(r => {
          const layer = rankLayers.get(r) || [];
          if (layer.length <= 1) return;

          const scores = new Map();
          layer.forEach((node, idx) => {
            let neighborIndices = [];
            if (isForward) {
              // Regarde les parents dans les rangs précédents
              const parents = inMap.get(node.id) || [];
              parents.forEach(pId => {
                const pNode = nodes.get(pId);
                if (pNode) {
                  const pLayer = rankLayers.get(pNode.rank) || [];
                  const pIdx = pLayer.indexOf(pNode);
                  if (pIdx !== -1) neighborIndices.push(pIdx);
                }
              });
            } else {
              // Regarde les enfants dans les rangs suivants
              const children = outMap.get(node.id) || [];
              children.forEach(cId => {
                const cNode = nodes.get(cId);
                if (cNode) {
                  const cLayer = rankLayers.get(cNode.rank) || [];
                  const cIdx = cLayer.indexOf(cNode);
                  if (cIdx !== -1) neighborIndices.push(cIdx);
                }
              });
            }

            if (neighborIndices.length > 0) {
              const avg = neighborIndices.reduce((a, b) => a + b, 0) / neighborIndices.length;
              scores.set(node.id, avg);
            } else {
              scores.set(node.id, idx);
            }
          });

          layer.sort((a, b) => {
            const sa = scores.get(a.id);
            const sb = scores.get(b.id);
            if (sa !== sb) return sa - sb;
            return a.id.localeCompare(b.id);
          });
        });
      }

      // 3. Attribution des coordonnées & Alignement Sugiyama / Brandes-Köpf
      if (isVert) {
        // Mode Vertical (Haut ➔ Bas : X est transversal, Y est le rang)
        const rowGapY = 90;
        const colGapX = 35;
        let currY = 60;
        const rowHeights = new Map();

        ranks.forEach(r => {
          const layer = rankLayers.get(r) || [];
          let maxH = 68;
          layer.forEach(n => { if (n.h > maxH) maxH = n.h; });
          rowHeights.set(r, maxH);
        });

        // Calcul position Y de chaque rangée
        const rankY = new Map();
        ranks.forEach(r => {
          rankY.set(r, currY);
          currY += (rowHeights.get(r) || 120) + rowGapY;
        });

        // Positionnement X initial par barycentre des parents / enfants
        ranks.forEach(r => {
          const layer = rankLayers.get(r) || [];
          let startX = 60;

          layer.forEach(node => {
            if (this.customPositions[node.id]) {
              node.x = this.customPositions[node.id].x;
              node.y = this.customPositions[node.id].y;
              return;
            }

            node.y = rankY.get(r);

            const connectedNodes = [];
            (inMap.get(node.id) || []).forEach(pId => {
              const p = nodes.get(pId);
              if (p && p.x !== undefined) connectedNodes.push(p.x + p.w / 2);
            });
            (outMap.get(node.id) || []).forEach(cId => {
              const c = nodes.get(cId);
              if (c && c.x !== undefined) connectedNodes.push(c.x + c.w / 2);
            });

            if (connectedNodes.length > 0) {
              const idealCenterX = connectedNodes.reduce((a, b) => a + b, 0) / connectedNodes.length;
              node.x = idealCenterX - node.w / 2;
            } else {
              node.x = startX;
            }
          });

          // Résolution des chevauchements horizontaux dans la rangée
          for (let i = 0; i < layer.length; i++) {
            const currNode = layer[i];
            if (this.customPositions[currNode.id]) continue;
            if (i > 0) {
              const prevNode = layer[i - 1];
              const minX = prevNode.x + prevNode.w + colGapX;
              if (currNode.x < minX) {
                currNode.x = minX;
              }
            }
          }
        });

        // Centrage global équilibré des rangées
        let maxRowRight = 0;
        nodes.forEach(n => { maxRowRight = Math.max(maxRowRight, n.x + n.w); });
        ranks.forEach(r => {
          const layer = rankLayers.get(r) || [];
          const uncustom = layer.filter(n => !this.customPositions[n.id]);
          if (uncustom.length === layer.length && layer.length > 0) {
            const minX = Math.min(...layer.map(n => n.x));
            const maxX = Math.max(...layer.map(n => n.x + n.w));
            const layerWidth = maxX - minX;
            const shiftX = (maxRowRight - layerWidth) / 2 - minX;
            if (shiftX > 0) {
              layer.forEach(n => { n.x += Math.round(shiftX * 0.4); });
            }
          }
        });

      } else {
        // Mode Horizontal (Gauche ➔ Droite : X est le rang, Y est transversal)
        const colGapX = 110;
        const rowGapY = 32;
        let currX = 60;
        const colWidths = new Map();

        ranks.forEach(r => {
          const layer = rankLayers.get(r) || [];
          let maxW = 220;
          layer.forEach(n => { if (n.w > maxW) maxW = n.w; });
          colWidths.set(r, maxW);
        });

        // Calcul position X de chaque colonne
        const rankX = new Map();
        ranks.forEach(r => {
          rankX.set(r, currX);
          currX += (colWidths.get(r) || 260) + colGapX;
        });

        // Positionnement Y basé sur le barycentre des connexions
        ranks.forEach(r => {
          const layer = rankLayers.get(r) || [];
          let startY = 70;

          layer.forEach((node, idx) => {
            if (this.customPositions[node.id]) {
              node.x = this.customPositions[node.id].x;
              node.y = this.customPositions[node.id].y;
              return;
            }

            node.x = rankX.get(r);

            const connectedY = [];
            (inMap.get(node.id) || []).forEach(pId => {
              const p = nodes.get(pId);
              if (p && p.y !== undefined) connectedY.push(p.y + p.h / 2);
            });
            (outMap.get(node.id) || []).forEach(cId => {
              const c = nodes.get(cId);
              if (c && c.y !== undefined) connectedY.push(c.y + c.h / 2);
            });

            if (connectedY.length > 0) {
              const idealCenterY = connectedY.reduce((a, b) => a + b, 0) / connectedY.length;
              node.y = idealCenterY - node.h / 2;
            } else {
              node.y = startY + idx * (node.h + rowGapY);
            }
          });

          // Résolution stricte des chevauchements verticaux de haut en bas
          for (let i = 0; i < layer.length; i++) {
            const currNode = layer[i];
            if (this.customPositions[currNode.id]) continue;
            if (i > 0) {
              const prevNode = layer[i - 1];
              const minY = prevNode.y + prevNode.h + rowGapY;
              if (currNode.y < minY) {
                currNode.y = minY;
              }
            } else {
              if (currNode.y < 50) currNode.y = 50;
            }
          }
        });

        // 4. Centrage vertical harmonique des colonnes éparses (Ex: Cibles finales ou Ressources brutes uniques)
        ranks.forEach(r => {
          const layer = rankLayers.get(r) || [];
          const uncustom = layer.filter(n => !this.customPositions[n.id]);
          if (uncustom.length === layer.length && layer.length > 0) {
            const layerMinY = Math.min(...layer.map(n => n.y));
            const layerMaxY = Math.max(...layer.map(n => n.y + n.h));

            // Calcul du barycentre vertical idéal des parents et enfants
            let parentCenters = [];
            layer.forEach(n => {
              (inMap.get(n.id) || []).forEach(pId => {
                const p = nodes.get(pId);
                if (p) parentCenters.push(p.y + p.h / 2);
              });
              (outMap.get(n.id) || []).forEach(cId => {
                const c = nodes.get(cId);
                if (c) parentCenters.push(c.y + c.h / 2);
              });
            });

            if (parentCenters.length > 0) {
              const targetCenterY = parentCenters.reduce((a, b) => a + b, 0) / parentCenters.length;
              const currentCenterY = (layerMinY + layerMaxY) / 2;
              const shiftY = targetCenterY - currentCenterY;
              const newMinY = layerMinY + shiftY;
              if (newMinY >= 40) {
                layer.forEach(n => { n.y += Math.round(shiftY * 0.7); });
              }
            }
          }
        });
      }
    },

    // Calcul précis des ports d'ancrage multi-entrées / multi-sorties pour éviter la superposition des lignes
    getEdgePorts(edge, nodesMap, edgesList, isVert) {
      const src = nodesMap.get(edge.from);
      const dst = nodesMap.get(edge.to);
      if (!src || !dst) return null;

      const outEdges = edgesList.filter(e => e.from === edge.from);
      const inEdges = edgesList.filter(e => e.to === edge.to);

      const outIdx = Math.max(0, outEdges.findIndex(e => e === edge || (e.from === edge.from && e.to === edge.to && e.item === edge.item)));
      const inIdx = Math.max(0, inEdges.findIndex(e => e === edge || (e.from === edge.from && e.to === edge.to && e.item === edge.item)));

      const totalOut = Math.max(1, outEdges.length);
      const totalIn = Math.max(1, inEdges.length);

      let x1, y1, x2, y2;

      if (isVert) {
        x1 = src.x + (src.w * (outIdx + 1)) / (totalOut + 1);
        y1 = src.y + src.h;
        x2 = dst.x + (dst.w * (inIdx + 1)) / (totalIn + 1);
        y2 = dst.y;
      } else {
        x1 = src.x + src.w;
        y1 = src.y + (src.h * (outIdx + 1)) / (totalOut + 1);
        x2 = dst.x;
        y2 = dst.y + (dst.h * (inIdx + 1)) / (totalIn + 1);
      }

      return { x1, y1, x2, y2 };
    },

    getBeltTierInfo(rate) {
      if (rate <= 60) return { mk: "Mk.1", max: 60, color: "#38bdf8", bg: "#0369a1", pct: Math.round((rate / 60) * 100), isBottleneck: false };
      if (rate <= 120) return { mk: "Mk.2", max: 120, color: "#4ade80", bg: "#15803d", pct: Math.round((rate / 120) * 100), isBottleneck: false };
      if (rate <= 270) return { mk: "Mk.3", max: 270, color: "#fbbf24", bg: "#b45309", pct: Math.round((rate / 270) * 100), isBottleneck: false };
      if (rate <= 480) return { mk: "Mk.4", max: 480, color: "#f472b6", bg: "#be185d", pct: Math.round((rate / 480) * 100), isBottleneck: false };
      if (rate <= 780) return { mk: "Mk.5", max: 780, color: "#c084fc", bg: "#7e22ce", pct: Math.round((rate / 780) * 100), isBottleneck: false };
      if (rate <= 1200) return { mk: "Mk.6", max: 1200, color: "#f87171", bg: "#b91c1c", pct: Math.round((rate / 1200) * 100), isBottleneck: false };
      const count = Math.ceil(rate / 1200);
      return { mk: `${count}× Mk.6`, max: 1200 * count, color: "#ef4444", bg: "#991b1b", pct: 100, isBottleneck: true };
    },

    getAncestors(nodeId, edges) {
      const ancestors = new Set();
      const queue = [nodeId];
      while (queue.length > 0) {
        const curr = queue.shift();
        edges.forEach(e => {
          if (e.to === curr && !ancestors.has(e.from)) {
            ancestors.add(e.from);
            queue.push(e.from);
          }
        });
      }
      return ancestors;
    },

    getDescendants(nodeId, edges) {
      const descendants = new Set();
      const queue = [nodeId];
      while (queue.length > 0) {
        const curr = queue.shift();
        edges.forEach(e => {
          if (e.from === curr && !descendants.has(e.to)) {
            descendants.add(e.to);
            queue.push(e.to);
          }
        });
      }
      return descendants;
    },

    updateConnectedEdges(container, nodeId, nodeData, nodesMap, edgesList) {
      if (!edgesList || !nodesMap || !container) return;
      const isVert = this.orientation === "vertical";

      edgesList.forEach(edge => {
        if (edge.from !== nodeId && edge.to !== nodeId) return;

        const ports = this.getEdgePorts(edge, nodesMap, edgesList, isVert);
        if (!ports) return;

        const { x1, y1, x2, y2 } = ports;
        let pathD;
        if (isVert) {
          const dy = Math.max(45, Math.abs(y2 - y1) * 0.45);
          pathD = `M ${x1} ${y1} C ${x1} ${y1 + dy}, ${x2} ${y2 - dy}, ${x2} ${y2}`;
        } else {
          const dx = Math.max(55, Math.abs(x2 - x1) * 0.45);
          pathD = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
        }

        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;

        const pathEl = container.querySelector(`path.scim-edge-from-${edge.from}.scim-edge-to-${edge.to}`);
        if (pathEl) pathEl.setAttribute("d", pathD);

        const arrowEl = container.querySelector(`polygon.scim-edge-from-${edge.from}.scim-edge-to-${edge.to}`);
        if (arrowEl) {
          if (isVert) {
            arrowEl.setAttribute("points", `${x2},${y2} ${x2 - 5},${y2 - 8} ${x2 + 5},${y2 - 8}`);
          } else {
            arrowEl.setAttribute("points", `${x2},${y2} ${x2 - 8},${y2 - 5} ${x2 - 8},${y2 + 5}`);
          }
        }

        const badgeW = 104;
        const badgeH = 22;
        const badgeEl = container.querySelector(`g.scim-edge-badge.scim-edge-from-${edge.from}.scim-edge-to-${edge.to}`);
        if (badgeEl) badgeEl.setAttribute("transform", `translate(${midX - badgeW / 2}, ${midY - badgeH / 2})`);
      });
    },

    generateSVG(results) {
      const graph = this.buildGraph(results);
      this.lastGraph = graph;
      const { nodes, edges } = graph;
      const isVert = this.orientation === "vertical";
      const isHeatmap = this.heatmapMode;

      // Exécuter l'optimiseur de placement topologique
      this.layoutGraph(nodes, edges, isVert);

      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;

      nodes.forEach(n => {
        if (n.x < minX) minX = n.x;
        if (n.y < minY) minY = n.y;
        if (n.x + n.w > maxX) maxX = n.x + n.w;
        if (n.y + n.h > maxY) maxY = n.y + n.h;
      });

      if (minX === Infinity) { minX = 0; maxX = 1200; minY = 0; maxY = 650; }

      const padding = 60;
      const viewX = Math.max(0, Math.round(minX - padding));
      const viewY = Math.max(0, Math.round(minY - padding));
      const totalWidth = Math.max(1100, Math.round((maxX - minX) + padding * 2));
      const totalHeight = Math.max(600, Math.round((maxY - minY) + padding * 2));

      // Rendu des Arêtes (Convoyeurs avec Courbes de Bézier multi-ports & Débits)
      let edgesSvg = "";
      edges.forEach(edge => {
        const src = nodes.get(edge.from);
        const dst = nodes.get(edge.to);
        if (!src || !dst) return;

        const ports = this.getEdgePorts(edge, nodes, edges, isVert);
        if (!ports) return;

        const { x1, y1, x2, y2 } = ports;
        let pathD;
        if (isVert) {
          const dy = Math.max(45, Math.abs(y2 - y1) * 0.45);
          pathD = `M ${x1} ${y1} C ${x1} ${y1 + dy}, ${x2} ${y2 - dy}, ${x2} ${y2}`;
        } else {
          const dx = Math.max(55, Math.abs(x2 - x1) * 0.45);
          pathD = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
        }

        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        const belt = this.getBeltTierInfo(edge.rate);
        const rateLabel = `${edge.rate}/m`;

        const isSrcMasked = src && (
          (src.type === "raw" && STATE.builtMachines && STATE.builtMachines.has(`scim_raw_${src.itemId}`)) ||
          (src.type === "step" && (Array.from({ length: src.machinesCount }, (_, i) => `${src.recipeId}_m${i + 1}`).every(k => STATE.builtMachines && STATE.builtMachines.has(k)) || (STATE.builtMachines && STATE.builtMachines.has(`scim_${src.id}`)))) ||
          (src.type === "target" && STATE.builtMachines && STATE.builtMachines.has(`scim_${src.id}`))
        );

        const edgeStroke = isSrcMasked ? "#10b981" : (isHeatmap ? (belt.isBottleneck ? '#ef4444' : '#10b981') : belt.color);
        const edgeDash = isSrcMasked ? "4,4" : "none";
        const edgeOpacity = isSrcMasked ? "0.30" : "0.88";

        const badgeW = 104;
        const badgeH = 22;

        const arrowPoints = isVert
          ? `${x2},${y2} ${x2 - 5},${y2 - 8} ${x2 + 5},${y2 - 8}`
          : `${x2},${y2} ${x2 - 8},${y2 - 5} ${x2 - 8},${y2 + 5}`;

        edgesSvg += `
          <!-- Convoyeur ${edge.item} (${belt.mk}) -->
          <path class="scim-edge scim-edge-from-${edge.from} scim-edge-to-${edge.to}" data-from="${edge.from}" data-to="${edge.to}" d="${pathD}" stroke="${edgeStroke}" stroke-width="${belt.isBottleneck ? '4' : '3'}" stroke-dasharray="${edgeDash}" fill="none" stroke-linecap="round" opacity="${edgeOpacity}" />
          <polygon class="scim-edge-arrow scim-edge-from-${edge.from} scim-edge-to-${edge.to}" data-from="${edge.from}" data-to="${edge.to}" points="${arrowPoints}" fill="${edgeStroke}" opacity="${edgeOpacity}" />
          
          <!-- Badge Débit & Convoyeur Mk.X (SatisfactoryPlanner style) -->
          <g class="scim-edge-badge scim-edge-from-${edge.from} scim-edge-to-${edge.to}" data-from="${edge.from}" data-to="${edge.to}" transform="translate(${midX - badgeW / 2}, ${midY - badgeH / 2})" opacity="${edgeOpacity}">
            <rect width="${badgeW}" height="${badgeH}" rx="11" fill="#0f172a" stroke="${edgeStroke}" stroke-width="1.5" />
            <text x="44" y="15" fill="${isSrcMasked ? '#a7f3d0' : '#f8fafc'}" font-size="10" font-weight="800" text-anchor="middle">📦 ${rateLabel}</text>
            <rect x="74" y="3" width="26" height="16" rx="8" fill="${belt.bg}" />
            <text x="87" y="14" fill="#ffffff" font-size="8.5" font-weight="900" text-anchor="middle">${belt.mk}</text>
          </g>
        `;
      });

      // Rendu des Nœuds (Cartes de Process SCIM & Diagnostics Satisfactory-Tool)
      let nodesSvg = "";
      nodes.forEach(node => {
        if (node.type === "raw") {
          const isMasked = STATE.builtMachines && STATE.builtMachines.has(`scim_raw_${node.itemId}`);
          const nodeOpacity = isMasked ? "0.32" : "1";
          const nodeBorder = isMasked ? "#10b981" : (isHeatmap ? "#10b981" : "#f59e0b");
          const nodeFill = isMasked ? "#050e17" : "#1e293b";

          const outPortCx = isVert ? node.w / 2 : node.w;
          const outPortCy = isVert ? node.h : node.h / 2;

          nodesSvg += `
            <g class="scim-node scim-clickable-node" data-node-id="${node.id}" data-node-type="raw" data-item-id="${node.itemId}" data-inputs-detail="Gisement naturel direct" data-output-detail="+${node.rate}/min ${node.name}" data-power-val="0 MW" data-node-name="Extraction : ${node.name}" transform="translate(${node.x}, ${node.y})" opacity="${nodeOpacity}" style="cursor: grab; transition: opacity 0.2s;">
              <title>⛏️ Extraction Brute : ${node.name}&#10;📤 Sortie : +${node.rate}/min&#10;🖐️ Glisser pour déplacer&#10;${isMasked ? '✓ Statut : Masqué / Fait' : '⏳ Statut : Actif (Clic pour masquer)'}</title>
              <rect width="${node.w}" height="${node.h}" rx="6" fill="${nodeFill}" stroke="${nodeBorder}" stroke-width="${isHeatmap ? '2.5' : '2'}" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.4))" />
              <!-- En-tête -->
              <rect width="${node.w}" height="24" rx="6" fill="${isMasked ? '#064e3b' : '#0f172a'}" />
              <rect y="18" width="${node.w}" height="6" fill="${isMasked ? '#064e3b' : '#0f172a'}" />
              <text x="10" y="16" fill="${isMasked ? '#a7f3d0' : '#f59e0b'}" font-size="11" font-weight="900" text-transform="uppercase">${isMasked ? '✓ EXTRACTION FAITE' : '⛏️ EXTRACTION BRUTE'}</text>
              <text x="${node.w - 10}" y="16" fill="#94a3b8" font-size="9" font-weight="bold" text-anchor="end">${isMasked ? '✓ MASQUÉ' : '🖐️ GLISSER'}</text>
              
              <!-- Corps -->
              <text x="10" y="44" fill="${isMasked ? '#64748b' : '#ffffff'}" font-size="13" font-weight="bold" ${isMasked ? 'text-decoration="line-through"' : ''}>${node.name}</text>
              <text x="10" y="58" fill="#94a3b8" font-size="11">Requis : <tspan fill="${isMasked ? '#10b981' : '#f59e0b'}" font-weight="bold">${node.rate}/min</tspan></text>
              
              <!-- Port de sortie -->
              <circle cx="${outPortCx}" cy="${outPortCy}" r="5" fill="${nodeBorder}" stroke="#0f172a" stroke-width="2" />
            </g>
          `;
        } else if (node.type === "step") {
          const theme = this.getBuildingTheme(node.building.id);
          const pm = node.machinesCount;
          const allBuilt = Array.from({ length: pm }, (_, i) => `${node.recipeId}_m${i + 1}`).every(k => STATE.builtMachines && STATE.builtMachines.has(k)) || (STATE.builtMachines && STATE.builtMachines.has(`scim_${node.id}`));
          const isMasked = allBuilt;
          const nodeOpacity = isMasked ? "0.32" : "1";

          let nodeBorder = isMasked ? "#10b981" : theme.border;
          if (isHeatmap) {
            nodeBorder = isMasked ? "#10b981" : (node.powerMW > 50 ? "#38bdf8" : "#fbbf24");
          }

          const nodeFill = isMasked ? "#050e17" : "#131926";
          const headerBg = isMasked ? "#064e3b" : (isHeatmap ? "#1e293b" : theme.bg);

          const ingrRows = node.ingredients.map(ing => `📥 ${Math.round(ing.rate*10)/10}/m ${ITEM_NAMES[ing.item]||ing.item}`).join(" | ");
          const inputsDetailStr = node.ingredients.map(ing => `${Math.round(ing.rate*10)/10}/min ${ITEM_NAMES[ing.item]||ing.item}`).join(" + ") || "Matières directes";

          const inPortCx = isVert ? node.w / 2 : 0;
          const inPortCy = isVert ? 0 : node.h / 2;
          const outPortCx = isVert ? node.w / 2 : node.w;
          const outPortCy = isVert ? node.h : node.h / 2;

          nodesSvg += `
            <g class="scim-node scim-clickable-node" data-node-id="${node.id}" data-node-type="step" data-recipe-id="${node.recipeId}" data-mach-count="${pm}" data-item-id="${node.itemId}" data-inputs="${node.ingredients.map(i => i.item).join(',')}" data-inputs-detail="${inputsDetailStr}" data-output-detail="+${node.rate}/min ${node.itemName}" data-power-val="${node.powerMW} MW" data-node-name="${node.machinesCount}× ${node.building.name} (${node.recipeName})" transform="translate(${node.x}, ${node.y})" opacity="${nodeOpacity}" style="cursor: grab; transition: opacity 0.2s;">
              <title>🏭 ${node.machinesCount}× ${node.building.name} (${node.recipeName})&#10;📥 ENTRÉES : ${inputsDetailStr}&#10;📤 SORTIE : +${node.rate}/min ${node.itemName}&#10;⚡ PUISSANCE : ${node.powerMW} MW&#10;🖐️ Glisser pour déplacer&#10;${isMasked ? '✓ Statut : Masqué / Construit' : '⏳ Statut : Actif (Clic pour masquer)'}</title>
              <!-- Fond de carte -->
              <rect width="${node.w}" height="${node.h}" rx="8" fill="${nodeFill}" stroke="${nodeBorder}" stroke-width="${isHeatmap ? '2.8' : (isMasked ? '2.2' : '2')}" filter="drop-shadow(0 6px 12px rgba(0,0,0,0.5))" />
              
              <!-- Header Couleur Machine -->
              <rect width="${node.w}" height="28" rx="8" fill="${headerBg}" />
              <rect y="20" width="${node.w}" height="8" fill="${headerBg}" />
              <text x="10" y="19" fill="${isMasked ? '#a7f3d0' : '#ffffff'}" font-size="12" font-weight="900" letter-spacing="0.5">${isMasked ? '✅' : node.building.icon} ${node.machinesCount} × ${node.building.name.toUpperCase()}</text>
              <text x="${node.w - 10}" y="19" fill="${isMasked ? '#a7f3d0' : (isHeatmap ? '#38bdf8' : '#ffffff')}" font-size="11" font-weight="bold" text-anchor="end">${isMasked ? '✓ FAIT' : `${node.powerMW} MW`}</text>

              <!-- Recette & Overclock -->
              <text x="10" y="48" fill="${isMasked ? '#64748b' : '#f8fafc'}" font-size="12.5" font-weight="bold" ${isMasked ? 'text-decoration="line-through"' : ''}>⚙️ ${node.recipeName}</text>
              <text x="${node.w - 10}" y="48" fill="#38bdf8" font-size="10.5" font-weight="bold" text-anchor="end">@${node.clock}%</text>

              <!-- Séparateur -->
              <line x1="10" y1="58" x2="${node.w - 10}" y2="58" stroke="rgba(255,255,255,0.1)" stroke-width="1" />

              <!-- Ingrédients Entrées -->
              <text x="10" y="74" fill="#94a3b8" font-size="10" font-weight="bold" text-transform="uppercase">ENTRÉES :</text>
              <text x="10" y="90" fill="#cbd5e1" font-size="10.5">${ingrRows || "Matières directes"}</text>

              <!-- Produit Sortie -->
              <text x="10" y="109" fill="#94a3b8" font-size="10" font-weight="bold" text-transform="uppercase">PRODUCTION :</text>
              <text x="10" y="124" fill="${isMasked ? '#10b981' : '#4ade80'}" font-size="11" font-weight="bold">${isMasked ? '✓' : '➔'} ${node.rate}/min ${node.itemName}</text>

              <!-- Ports de connexion -->
              <circle cx="${inPortCx}" cy="${inPortCy}" r="5" fill="${nodeBorder}" stroke="#0f172a" stroke-width="2" />
              <circle cx="${outPortCx}" cy="${outPortCy}" r="5" fill="${isMasked ? '#10b981' : '#4ade80'}" stroke="#0f172a" stroke-width="2" />
            </g>
          `;
        } else if (node.type === "target") {
          const isMasked = STATE.builtMachines && STATE.builtMachines.has(`scim_${node.id}`);
          const nodeOpacity = isMasked ? "0.32" : "1";
          const inPortCx = isVert ? node.w / 2 : 0;
          const inPortCy = isVert ? 0 : node.h / 2;

          nodesSvg += `
            <g class="scim-node scim-clickable-node" data-node-id="${node.id}" data-node-type="target" data-item-id="${node.itemId}" data-inputs-detail="Alimenté par l'usine" data-output-detail="+${node.rate}/min ${node.name}" data-power-val="0 MW" data-node-name="Produit Final : ${node.name}" transform="translate(${node.x}, ${node.y})" opacity="${nodeOpacity}" style="cursor: grab; transition: opacity 0.2s;">
              <title>🎯 Produit Final Demandé : ${node.name}&#10;📤 Sortie Nette : +${node.rate}/min&#10;🖐️ Glisser pour déplacer&#10;${isMasked ? '✓ Statut : Masqué / Fait' : '⏳ Statut : Actif (Clic pour masquer)'}</title>
              <rect width="${node.w}" height="${node.h}" rx="6" fill="${isMasked ? '#050e17' : '#064e3b'}" stroke="#10b981" stroke-width="${isMasked ? '2' : '2.5'}" filter="drop-shadow(0 6px 12px rgba(16, 185, 129, 0.3))" />
              <rect width="${node.w}" height="24" rx="6" fill="#047857" />
              <rect y="18" width="${node.w}" height="6" fill="#047857" />
              <text x="10" y="17" fill="#ffffff" font-size="11" font-weight="900">${isMasked ? '✅ PRODUIT ATTEINT' : '🎯 PRODUIT FINAL DEMANDÉ'}</text>
              <text x="${node.w - 10}" y="17" fill="#a7f3d0" font-size="9" font-weight="bold" text-anchor="end">${isMasked ? '✓ FAIT' : '🖐️ GLISSER'}</text>
              
              <text x="10" y="46" fill="${isMasked ? '#64748b' : '#ffffff'}" font-size="13" font-weight="bold" ${isMasked ? 'text-decoration="line-through"' : ''}>${node.name}</text>
              <text x="10" y="64" fill="#a7f3d0" font-size="12" font-weight="bold">Débit Sortie : +${node.rate}/min</text>
              
              <!-- Port d'entrée -->
              <circle cx="${inPortCx}" cy="${inPortCy}" r="5" fill="#10b981" stroke="#064e3b" stroke-width="2" />
            </g>
          `;
        }
      });

      return `
        <svg id="scim-flowchart-svg" width="100%" height="100%" viewBox="${viewX} ${viewY} ${totalWidth} ${totalHeight}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%; min-height: 520px; background: #080d14; font-family: system-ui, -apple-system, sans-serif; cursor: grab; display: block;">
          <defs>
            <pattern id="scimGrid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255, 255, 255, 0.04)" stroke-width="1"/>
            </pattern>
          </defs>

          <!-- Grille SCIM -->
          <rect x="${viewX}" y="${viewY}" width="${totalWidth}" height="${totalHeight}" fill="url(#scimGrid)" />

          <!-- Arêtes & Nœuds -->
          ${edgesSvg}
          ${nodesSvg}
        </svg>
      `;
    },

    attachInteractivity(container, results) {
      if (!container) return;

      const svgEl = container.querySelector("#scim-flowchart-svg") || container.querySelector("svg");
      const nodesMap = this.lastGraph?.nodes || new Map();
      const edgesList = this.lastGraph?.edges || [];

      let tooltip = document.getElementById("ficsit-machine-hud-tooltip");
      if (!tooltip) {
        tooltip = document.createElement("div");
        tooltip.id = "ficsit-machine-hud-tooltip";
        tooltip.style.cssText = `
          position: fixed;
          display: none;
          pointer-events: none;
          z-index: 99999999;
          background: #09101d;
          border: 1.5px solid #38bdf8;
          box-shadow: 0 10px 30px rgba(0,0,0,0.9), 0 0 20px rgba(56,189,248,0.3);
          border-radius: 8px;
          padding: 12px 16px;
          font-family: system-ui, -apple-system, sans-serif;
          color: #f8fafc;
          font-size: 12px;
          min-width: 250px;
          max-width: 360px;
          backdrop-filter: blur(10px);
          transition: opacity 0.12s ease;
        `;
        document.body.appendChild(tooltip);
      }

      const positionTooltip = (e) => {
        const padding = 16;
        let x = e.clientX + padding;
        let y = e.clientY + padding;

        const rect = tooltip.getBoundingClientRect();
        if (x + rect.width > window.innerWidth - 10) {
          x = e.clientX - rect.width - padding;
        }
        if (y + rect.height > window.innerHeight - 10) {
          y = e.clientY - rect.height - padding;
        }
        tooltip.style.left = `${Math.max(10, x)}px`;
        tooltip.style.top = `${Math.max(10, y)}px`;
      };

      let activeDraggedNode = null;
      let nodeStartX = 0;
      let nodeStartY = 0;
      let initialNodeX = 0;
      let initialNodeY = 0;
      let dragMoveDist = 0;
      let isNodeDragging = false;

      container.querySelectorAll(".scim-clickable-node").forEach(nodeEl => {
        const nodeId = nodeEl.getAttribute("data-node-id");
        const nodeType = nodeEl.getAttribute("data-node-type");
        const nodeName = nodeEl.getAttribute("data-node-name") || "Étape";
        const recipeId = nodeEl.getAttribute("data-recipe-id");
        const machCount = parseInt(nodeEl.getAttribute("data-mach-count") || "1", 10);
        const itemId = nodeEl.getAttribute("data-item-id");
        const inDetail = nodeEl.getAttribute("data-inputs-detail") || "Minerais directs";
        const outDetail = nodeEl.getAttribute("data-output-detail") || "";
        const pVal = nodeEl.getAttribute("data-power-val") || "";

        // 1. DÉBUT DU DÉPLACEMENT (MOUSEDOWN)
        nodeEl.addEventListener("mousedown", (e) => {
          if (e.button !== 0) return;
          e.stopPropagation();

          activeDraggedNode = nodeEl;
          isNodeDragging = true;
          dragMoveDist = 0;
          nodeStartX = e.clientX;
          nodeStartY = e.clientY;

          const nodeData = nodesMap.get(nodeId) || { x: 0, y: 0, w: 260, h: 135 };
          initialNodeX = nodeData.x;
          initialNodeY = nodeData.y;

          nodeEl.style.cursor = "grabbing";
          nodeEl.style.filter = "drop-shadow(0 0 20px #38bdf8)";
          if (tooltip) tooltip.style.display = "none";
        });

        // 2. SURVOL (HOVER) : Traçage d'arbre récursif (Amont ➔ Cyan, Aval ➔ Émeraude)
        nodeEl.onmouseenter = (e) => {
          if (isNodeDragging) return;
          nodeEl.style.filter = "drop-shadow(0 0 16px #38bdf8)";
          nodeEl.style.opacity = "1";

          const isMasked = (nodeType === "step" && (Array.from({ length: machCount }, (_, i) => `${recipeId}_m${i + 1}`).every(k => STATE.builtMachines.has(k)) || STATE.builtMachines.has(`scim_${nodeId}`)))
            || (nodeType === "raw" && STATE.builtMachines.has(`scim_raw_${itemId}`))
            || (nodeType === "target" && STATE.builtMachines.has(`scim_${nodeId}`));

          tooltip.innerHTML = `
            <div style="font-weight: 800; font-size: 13.5px; color: #38bdf8; border-bottom: 1px solid rgba(56, 189, 248, 0.3); padding-bottom: 6px; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between; gap: 10px;">
              <span>🏭 ${nodeName}</span>
              ${pVal ? `<span style="color: #f59e0b; font-size: 11px; font-weight: bold;">⚡ ${pVal}</span>` : ''}
            </div>
            <div style="margin-bottom: 8px;">
              <div style="font-size: 10px; text-transform: uppercase; font-weight: 800; color: #fbbf24; margin-bottom: 3px; letter-spacing: 0.5px;">
                📥 COMPOSANTS REQUIS EN ENTRÉE :
              </div>
              <div style="background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.4); padding: 6px 10px; border-radius: 4px; font-weight: 700; color: #fef3c7; font-size: 12.5px;">
                ${inDetail}
              </div>
            </div>
            <div>
              <div style="font-size: 10px; text-transform: uppercase; font-weight: 800; color: #4ade80; margin-bottom: 3px; letter-spacing: 0.5px;">
                📤 PRODUCTION EN SORTIE :
              </div>
              <div style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); padding: 6px 10px; border-radius: 4px; font-weight: 800; color: #a7f3d0; font-size: 12.5px;">
                ${outDetail}
              </div>
            </div>
            <div style="margin-top: 8px; padding-top: 6px; border-top: 1px dashed rgba(255,255,255,0.1); font-size: 10px; color: ${isMasked ? '#a7f3d0' : '#94a3b8'}; display: flex; justify-content: space-between;">
              <span>${isMasked ? '✅ Statut : Masqué / Fait' : '⏳ Statut : Actif'}</span>
              <span style="color: #38bdf8;">(Glisser pour déplacer • Clic pour ${isMasked ? 'réactiver' : 'masquer'})</span>
            </div>
          `;
          tooltip.style.display = "block";
          positionTooltip(e);

          // Traçage récursif complet (Satisfactory-Tool DAG Tracing)
          const ancestors = SatisfactoryFlowchart.getAncestors(nodeId, edgesList);
          const descendants = SatisfactoryFlowchart.getDescendants(nodeId, edgesList);

          // Nœuds Amont (Fournisseurs) ➔ Cyan
          ancestors.forEach(ancId => {
            const ancEl = container.querySelector(`.scim-node[data-node-id="${ancId}"]`);
            if (ancEl) {
              ancEl.style.opacity = "1";
              ancEl.style.filter = "drop-shadow(0 0 12px #38bdf8)";
            }
          });

          // Nœuds Aval (Consommateurs) ➔ Vert Émeraude
          descendants.forEach(descId => {
            const descEl = container.querySelector(`.scim-node[data-node-id="${descId}"]`);
            if (descEl) {
              descEl.style.opacity = "1";
              descEl.style.filter = "drop-shadow(0 0 12px #4ade80)";
            }
          });

          // Convoyeurs Amont / Aval
          container.querySelectorAll(".scim-edge").forEach(edgeEl => {
            const fromId = edgeEl.getAttribute("data-from");
            const toId = edgeEl.getAttribute("data-to");

            if (toId === nodeId || (ancestors.has(fromId) && (ancestors.has(toId) || toId === nodeId))) {
              edgeEl.style.stroke = "#38bdf8";
              edgeEl.style.strokeWidth = "3.5";
              edgeEl.style.opacity = "1";
              edgeEl.style.filter = "drop-shadow(0 0 8px #38bdf8)";
            } else if (fromId === nodeId || (descendants.has(toId) && (descendants.has(fromId) || fromId === nodeId))) {
              edgeEl.style.stroke = "#4ade80";
              edgeEl.style.strokeWidth = "3.5";
              edgeEl.style.opacity = "1";
              edgeEl.style.filter = "drop-shadow(0 0 8px #4ade80)";
            } else {
              edgeEl.style.opacity = "0.06";
            }
          });
        };

        nodeEl.onmousemove = (e) => {
          if (isNodeDragging) return;
          positionTooltip(e);
        };

        nodeEl.onmouseleave = () => {
          if (isNodeDragging && activeDraggedNode === nodeEl) return;
          if (tooltip) tooltip.style.display = "none";
          nodeEl.style.filter = "";

          container.querySelectorAll(".scim-node").forEach(n => {
            const nType = n.getAttribute("data-node-type");
            const nId = n.getAttribute("data-node-id");
            const nRecId = n.getAttribute("data-recipe-id");
            const nMCount = parseInt(n.getAttribute("data-mach-count") || "1", 10);
            const nItemId = n.getAttribute("data-item-id");

            const isMasked = (nType === "step" && (Array.from({ length: nMCount }, (_, i) => `${nRecId}_m${i + 1}`).every(k => STATE.builtMachines.has(k)) || STATE.builtMachines.has(`scim_${nId}`)))
              || (nType === "raw" && STATE.builtMachines.has(`scim_raw_${nItemId}`))
              || (nType === "target" && STATE.builtMachines.has(`scim_${nId}`));

            n.style.opacity = isMasked ? "0.32" : "1";
            n.style.filter = "";
          });

          container.querySelectorAll(".scim-edge, .scim-edge-arrow, .scim-edge-badge").forEach(el => {
            el.style.stroke = "";
            el.style.strokeWidth = "";
            el.style.opacity = "";
            el.style.filter = "";
            if (el.tagName === "polygon") el.style.fill = "";
          });
        };
      });

      // 3. MOUVEMENT FLUIDE DE LA CASE & MISE À JOUR DYNAMIQUE DES CONVOYEURS
      window.addEventListener("mousemove", (e) => {
        if (!isNodeDragging || !activeDraggedNode || !svgEl) return;

        const vbAttr = svgEl.getAttribute("viewBox") || "0 0 1200 650";
        const parts = vbAttr.split(" ").map(Number);
        const vbW = parts[2] || 1200;
        const vbH = parts[3] || 650;
        const rect = svgEl.getBoundingClientRect();
        const scaleX = vbW / Math.max(rect.width, 10);
        const scaleY = vbH / Math.max(rect.height, 10);

        const dx = (e.clientX - nodeStartX) * scaleX;
        const dy = (e.clientY - nodeStartY) * scaleY;
        dragMoveDist += Math.abs(e.movementX || 0) + Math.abs(e.movementY || 0);

        const newX = Math.round(initialNodeX + dx);
        const newY = Math.round(initialNodeY + dy);

        activeDraggedNode.setAttribute("transform", `translate(${newX}, ${newY})`);

        const nodeId = activeDraggedNode.getAttribute("data-node-id");
        const nodeData = nodesMap.get(nodeId);
        if (nodeData) {
          nodeData.x = newX;
          nodeData.y = newY;
          SatisfactoryFlowchart.customPositions[nodeId] = { x: newX, y: newY };
          SatisfactoryFlowchart.updateConnectedEdges(container, nodeId, nodeData, nodesMap, edgesList);
        }
      });

      // 4. FIN DU DÉPLACEMENT (MOUSEUP) : DISTINGUE LE DÉPLACEMENT DU CLIC
      window.addEventListener("mouseup", () => {
        if (!isNodeDragging || !activeDraggedNode) return;

        const nodeEl = activeDraggedNode;
        const nodeId = nodeEl.getAttribute("data-node-id");
        const nodeType = nodeEl.getAttribute("data-node-type");
        const nodeName = nodeEl.getAttribute("data-node-name") || "Étape";
        const recipeId = nodeEl.getAttribute("data-recipe-id");
        const machCount = parseInt(nodeEl.getAttribute("data-mach-count") || "1", 10);
        const itemId = nodeEl.getAttribute("data-item-id");

        isNodeDragging = false;
        activeDraggedNode = null;
        nodeEl.style.cursor = "grab";
        nodeEl.style.filter = "";

        // Si le déplacement est inférieur à 6px ➔ C'était un clic intentionnel pour masquer/cocher !
        if (dragMoveDist < 6) {
          if (nodeType === "step") {
            const allKeys = Array.from({ length: machCount }, (_, i) => `${recipeId}_m${i + 1}`);
            const isAllBuilt = allKeys.every(k => STATE.builtMachines.has(k)) || STATE.builtMachines.has(`scim_${nodeId}`);

            if (isAllBuilt) {
              allKeys.forEach(k => STATE.builtMachines.delete(k));
              STATE.builtMachines.delete(`scim_${nodeId}`);
              showToast(`↺ Étape réactivée : ${nodeName}`);
            } else {
              allKeys.forEach(k => STATE.builtMachines.add(k));
              STATE.builtMachines.add(`scim_${nodeId}`);
              showToast(`✅ Étape masquée / construite : ${nodeName}`);
            }
          } else if (nodeType === "raw") {
            const key = `scim_raw_${itemId}`;
            if (STATE.builtMachines.has(key)) {
              STATE.builtMachines.delete(key);
              showToast(`↺ Extraction réactivée : ${nodeName}`);
            } else {
              STATE.builtMachines.add(key);
              showToast(`✅ Extraction masquée : ${nodeName}`);
            }
          } else if (nodeType === "target") {
            const key = `scim_${nodeId}`;
            if (STATE.builtMachines.has(key)) {
              STATE.builtMachines.delete(key);
              showToast(`↺ Produit final réactivé : ${nodeName}`);
            } else {
              STATE.builtMachines.add(key);
              showToast(`✅ Produit final masqué / atteint : ${nodeName}`);
            }
          }

          saveState();
          if (STATE.lastCalculation) {
            renderCalculationResults(STATE.lastCalculation);
          }
        }
      });
    },

    initInteractive(viewportEl, results) {
      if (!viewportEl) return;

      const svgHtml = this.generateSVG(results);
      viewportEl.innerHTML = svgHtml;

      const svgEl = viewportEl.querySelector("#scim-flowchart-svg");
      if (!svgEl) return;

      this.attachInteractivity(viewportEl, results);

      const vbAttr = svgEl.getAttribute("viewBox") || "0 0 1200 650";
      const parts = vbAttr.split(" ").map(Number);
      let vbX = parts[0] || 0;
      let vbY = parts[1] || 0;
      let vbW = parts[2] || 1200;
      let vbH = parts[3] || 650;
      const initialVb = { x: vbX, y: vbY, width: vbW, height: vbH };

      let isDragging = false;
      let startX = 0;
      let startY = 0;

      svgEl.addEventListener("mousedown", (e) => {
        if (e.target.closest(".scim-clickable-node")) return;
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        svgEl.style.cursor = "grabbing";
      });

      window.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        const rect = svgEl.getBoundingClientRect();
        const cw = rect.width > 10 ? rect.width : 1000;
        const ch = rect.height > 10 ? rect.height : 540;
        const scaleX = vbW / cw;
        const scaleY = vbH / ch;
        const dx = (e.clientX - startX) * scaleX;
        const dy = (e.clientY - startY) * scaleY;
        if (!isNaN(dx) && !isNaN(dy)) {
          vbX -= dx;
          vbY -= dy;
          svgEl.setAttribute("viewBox", `${vbX} ${vbY} ${vbW} ${vbH}`);
        }
        startX = e.clientX;
        startY = e.clientY;
      });

      window.addEventListener("mouseup", () => {
        isDragging = false;
        if (svgEl) svgEl.style.cursor = "grab";
      });

      svgEl.addEventListener("wheel", (e) => {
        e.preventDefault();
        const factor = e.deltaY < 0 ? 0.85 : 1.18;
        const rect = svgEl.getBoundingClientRect();
        const cw = rect.width > 10 ? rect.width : 1000;
        const ch = rect.height > 10 ? rect.height : 540;
        const mouseX = Math.max(0, Math.min(1, (e.clientX - rect.left) / cw));
        const mouseY = Math.max(0, Math.min(1, (e.clientY - rect.top) / ch));

        const newW = vbW * factor;
        const newH = vbH * factor;
        if (!isNaN(newW) && !isNaN(newH) && newW > 100 && newW < 10000) {
          vbX += (vbW - newW) * mouseX;
          vbY += (vbH - newH) * mouseY;
          vbW = newW;
          vbH = newH;
          svgEl.setAttribute("viewBox", `${vbX} ${vbY} ${vbW} ${vbH}`);
        }
      }, { passive: false });

      const btnIn = document.getElementById("flowchart-btn-zoom-in");
      const btnOut = document.getElementById("flowchart-btn-zoom-out");
      const btnReset = document.getElementById("flowchart-btn-reset");
      const btnResetLayout = document.getElementById("flowchart-btn-reset-layout");
      const btnToggleOrientation = document.getElementById("flowchart-btn-toggle-orientation");
      const btnToggleHeatmap = document.getElementById("flowchart-btn-toggle-heatmap");

      if (btnIn) btnIn.onclick = () => {
        const newW = vbW * 0.8;
        const newH = vbH * 0.8;
        vbX += (vbW - newW) * 0.5;
        vbY += (vbH - newH) * 0.5;
        vbW = newW;
        vbH = newH;
        svgEl.setAttribute("viewBox", `${vbX} ${vbY} ${vbW} ${vbH}`);
      };

      if (btnOut) btnOut.onclick = () => {
        const newW = vbW * 1.25;
        const newH = vbH * 1.25;
        vbX += (vbW - newW) * 0.5;
        vbY += (vbH - newH) * 0.5;
        vbW = newW;
        vbH = newH;
        svgEl.setAttribute("viewBox", `${vbX} ${vbY} ${vbW} ${vbH}`);
      };

      if (btnReset) btnReset.onclick = () => {
        vbX = initialVb.x;
        vbY = initialVb.y;
        vbW = initialVb.width;
        vbH = initialVb.height;
        svgEl.setAttribute("viewBox", `${vbX} ${vbY} ${vbW} ${vbH}`);
      };

      if (btnResetLayout) btnResetLayout.onclick = () => {
        SatisfactoryFlowchart.customPositions = {};
        if (STATE.lastCalculation) {
          renderCalculationResults(STATE.lastCalculation);
          showToast("↺ Agencement automatique du graphe rétabli.");
        }
      };

      if (btnToggleOrientation) {
        btnToggleOrientation.innerText = SatisfactoryFlowchart.orientation === "vertical" ? "↕️ Vertic." : "↔️ Horiz.";
        btnToggleOrientation.onclick = () => {
          SatisfactoryFlowchart.orientation = SatisfactoryFlowchart.orientation === "vertical" ? "horizontal" : "vertical";
          btnToggleOrientation.innerText = SatisfactoryFlowchart.orientation === "vertical" ? "↕️ Vertic." : "↔️ Horiz.";
          SatisfactoryFlowchart.customPositions = {};
          if (STATE.lastCalculation) {
            renderCalculationResults(STATE.lastCalculation);
            showToast(`↔️ Orientation : ${SatisfactoryFlowchart.orientation === "vertical" ? "Verticale (Haut ➔ Bas)" : "Horizontale (A ➔ Z)"}`);
          }
        };
      }

      if (btnToggleHeatmap) {
        btnToggleHeatmap.style.background = SatisfactoryFlowchart.heatmapMode ? "rgba(16, 185, 129, 0.25)" : "";
        btnToggleHeatmap.style.borderColor = SatisfactoryFlowchart.heatmapMode ? "#10b981" : "";
        btnToggleHeatmap.onclick = () => {
          SatisfactoryFlowchart.heatmapMode = !SatisfactoryFlowchart.heatmapMode;
          btnToggleHeatmap.style.background = SatisfactoryFlowchart.heatmapMode ? "rgba(16, 185, 129, 0.25)" : "";
          btnToggleHeatmap.style.borderColor = SatisfactoryFlowchart.heatmapMode ? "#10b981" : "";
          if (STATE.lastCalculation) {
            renderCalculationResults(STATE.lastCalculation);
            showToast(`🌡️ Mode Diagnostic Heatmap : ${SatisfactoryFlowchart.heatmapMode ? "ACTIVÉ" : "DÉSACTIVÉ"}`);
          }
        };
      }
    }
  };

  function generateIntegratedMultiMachineBlueprintSVG(results) {
    const steps = results.productionSteps || [];
    const targetItem = (results.targets && results.targets[0]) || { item: "Produit Fini", rate: 10 };
    const targetName = ITEM_NAMES[targetItem.item] || targetItem.item;

    const totalMachines = steps.reduce((sum, s) => sum + (s.physicalMachines || Math.ceil(s.machinesCount)), 0);
    const totalPower = results.totalPowerMW || 0;

    const svgWidth = 980;
    const svgHeight = 600;

    const gridX = 70;
    const gridY = 90;
    const gridW = 840;
    const gridH = 430;
    const cellW = gridW / 6;
    const cellH = gridH / 6;

    // 1. Dalles de Fondations 6x6 (48m x 48m)
    let gridTilesSvg = "";
    const colLetters = ["A", "B", "C", "D", "E", "F"];
    for (let c = 0; c < 6; c++) {
      for (let r = 0; r < 6; r++) {
        const x = gridX + c * cellW;
        const y = gridY + r * cellH;
        gridTilesSvg += `
          <rect x="${x}" y="${y}" width="${cellW}" height="${cellH}" fill="#0a101b" stroke="rgba(56, 189, 248, 0.09)" stroke-width="1" />
          <line x1="${x + cellW / 2}" y1="${y}" x2="${x + cellW / 2}" y2="${y + cellH}" stroke="rgba(56, 189, 248, 0.03)" stroke-width="1" stroke-dasharray="2,2" />
          <line x1="${x}" y1="${y + cellH / 2}" x2="${x + cellW}" y2="${y + cellH / 2}" stroke="rgba(56, 189, 248, 0.03)" stroke-width="1" stroke-dasharray="2,2" />
        `;
      }
      gridTilesSvg += `
        <text x="${gridX + c * cellW + cellW / 2}" y="${gridY - 8}" fill="#38bdf8" font-size="10" font-weight="800" text-anchor="middle" font-family="monospace">${colLetters[c]} (8m)</text>
      `;
    }
    for (let r = 0; r < 6; r++) {
      gridTilesSvg += `
        <text x="${gridX - 14}" y="${gridY + r * cellH + cellH / 2 + 3.5}" fill="#38bdf8" font-size="10" font-weight="800" text-anchor="middle" font-family="monospace">${r + 1}</text>
      `;
    }

    // 2. Découpage en 3 Zones Mixtes Intégrées (Colonnes A-B: Fonderies, C-D: Usinage, E-F: Assemblage)
    const smelterSteps = steps.filter(s => s.building && (s.building.id === "smelter" || s.building.id === "foundry"));
    const constructorSteps = steps.filter(s => s.building && (s.building.id === "constructor" || s.building.id === "refinery"));
    const assemblerSteps = steps.filter(s => s.building && (s.building.id === "assembler" || s.building.id === "manufacturer" || s.building.id === "blender" || s.building.id === "particle_accelerator" || s.building.id === "quantum_encoder"));

    const zones = [
      { name: "ZONE 1 : MÉTALLURGIE", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.04)", border: "rgba(245, 158, 11, 0.25)", x: gridX + 6, w: cellW * 2 - 12, steps: smelterSteps },
      { name: "ZONE 2 : USINAGE", color: "#38bdf8", bg: "rgba(56, 189, 248, 0.04)", border: "rgba(56, 189, 248, 0.25)", x: gridX + cellW * 2 + 6, w: cellW * 2 - 12, steps: constructorSteps },
      { name: "ZONE 3 : ASSEMBLAGE & FINITION", color: "#a855f7", bg: "rgba(168, 85, 247, 0.04)", border: "rgba(168, 85, 247, 0.25)", x: gridX + cellW * 4 + 6, w: cellW * 2 - 12, steps: assemblerSteps }
    ];

    let zonesSvg = "";
    let mixedMachinesSvg = "";
    const placedMachines = [];

    zones.forEach((z, zIdx) => {
      zonesSvg += `
        <rect x="${z.x}" y="${gridY + 6}" width="${z.w}" height="${gridH - 12}" rx="6" fill="${z.bg}" stroke="${z.border}" stroke-width="1.2" stroke-dasharray="5,3" />
        <rect x="${z.x + 10}" y="${gridY + 12}" width="${z.w - 20}" height="22" rx="3" fill="#0f172a" stroke="${z.color}" stroke-width="1" />
        <text x="${z.x + z.w / 2}" y="${gridY + 26.5}" fill="${z.color}" font-size="9" font-weight="900" text-anchor="middle" font-family="sans-serif" letter-spacing="0.5">${z.name}</text>
      `;

      const zoneSteps = z.steps;
      let totalZoneMachines = zoneSteps.reduce((sum, s) => sum + (s.physicalMachines || Math.ceil(s.machinesCount)), 0);
      if (totalZoneMachines === 0) {
        zonesSvg += `
          <text x="${z.x + z.w / 2}" y="${gridY + gridH / 2}" fill="#64748b" font-size="10.5" text-anchor="middle" font-style="italic">Intégré en amont / direct</text>
        `;
        return;
      }

      let mList = [];
      zoneSteps.forEach(st => {
        const count = st.physicalMachines || Math.ceil(st.machinesCount);
        for (let i = 0; i < count; i++) {
          mList.push({ step: st, idx: i + 1, total: count });
        }
      });

      const maxToDraw = Math.min(6, mList.length);
      const mRows = Math.ceil(maxToDraw / 2);
      const mCols = maxToDraw > 1 ? 2 : 1;
      const mBoxW = (z.w - 20) / mCols;
      const mBoxH = (gridH - 65) / Math.max(mRows, 1);

      for (let mi = 0; mi < maxToDraw; mi++) {
        const item = mList[mi];
        const st = item.step;
        const b = st.building || { name: "Machine", icon: "🏭" };
        const rIdx = Math.floor(mi / mCols);
        const cIdx = mi % mCols;

        const mx = z.x + 10 + cIdx * mBoxW + 3;
        const my = gridY + 44 + rIdx * mBoxH + 4;
        const mw = mBoxW - 6;
        const mh = Math.min(74, mBoxH - 8);

        const outRate = Math.round((st.rateProduced / item.total) * 10) / 10;
        const perMachInList = st.ingredients.map(ing => {
          const r = Math.round((ing.rate / item.total) * 10) / 10;
          const name = ITEM_NAMES[ing.item] || ing.item;
          return `${r}/min ${name}`;
        });
        const inputsDetailStr = perMachInList.join(" + ") || "Minerais bruts directs";
        const outputDetailStr = `+${outRate}/min ${ITEM_NAMES[st.itemId] || st.itemId}`;
        const powerPerMach = Math.round((st.powerMW / item.total) * 10) / 10;

        const inX = mx;
        const inY = my + mh / 2;
        const outX = mx + mw;
        const outY = my + mh / 2;

        const machUniqueKey = `${st.recipeId}_m${item.idx}`;
        const isBuilt = STATE.builtMachines && STATE.builtMachines.has(machUniqueKey);

        const cardFill = isBuilt ? "#050e17" : "#0f172a";
        const cardOpacity = isBuilt ? "0.32" : "1";
        const cardBorder = isBuilt ? "#10b981" : z.color;
        const statusBadge = isBuilt
          ? `<rect x="${mx + 6}" y="${my + mh - 18}" width="${mw - 12}" height="14" rx="2" fill="#064e3b" stroke="#10b981" stroke-width="0.8" />
             <text x="${mx + mw / 2}" y="${my + mh - 8}" fill="#a7f3d0" font-size="7.5" font-weight="900" text-anchor="middle">✓ CONSTRUITE</text>`
          : `<text x="${mx + mw / 2}" y="${my + 52}" fill="#10b981" font-size="8.5" font-weight="900" text-anchor="middle">➔ +${outRate}/m</text>`;

        placedMachines.push({
          id: `mach_${st.itemId}_${mi}`,
          machKey: machUniqueKey,
          isBuilt,
          step: st,
          itemId: st.itemId,
          recipeName: st.recipeName,
          zoneIdx: zIdx,
          mx, my, mw, mh,
          inX, inY, outX, outY,
          outRate,
          color: z.color
        });

        mixedMachinesSvg += `
          <g class="svg-clickable-machine" data-mach-key="${machUniqueKey}" data-item-id="${st.itemId}" data-inputs="${st.ingredients.map(i => i.item).join(',')}" data-inputs-detail="${inputsDetailStr}" data-output-detail="${outputDetailStr}" data-power-val="${powerPerMach} MW" data-mach-name="${b.name} #${item.idx} (${st.recipeName})" style="cursor: pointer; transition: opacity 0.2s;" opacity="${cardOpacity}">
            <title>🏭 ${b.name} #${item.idx} (${st.recipeName})&#10;📥 ENTRÉES : ${inputsDetailStr}&#10;📤 SORTIE : ${outputDetailStr}&#10;⚡ PUISSANCE : ${powerPerMach} MW</title>
            <!-- Carte Machine Aérée -->
            <rect x="${mx}" y="${my}" width="${mw}" height="${mh}" rx="5" fill="${cardFill}" stroke="${cardBorder}" stroke-width="${isBuilt ? '1.8' : '1.2'}" filter="drop-shadow(0 2px 5px rgba(0,0,0,0.6))" />
            
            <!-- Header Machine -->
            <rect x="${mx}" y="${my}" width="${mw}" height="18" rx="5" fill="${isBuilt ? '#064e3b' : '#1e293b'}" />
            <rect x="${mx}" y="${my + 12}" width="${mw}" height="6" fill="${isBuilt ? '#064e3b' : '#1e293b'}" />
            <text x="${mx + 6}" y="${my + 13}" fill="${isBuilt ? '#a7f3d0' : z.color}" font-size="8.5" font-weight="900">${isBuilt ? '✅' : b.icon} #${item.idx}</text>
            <text x="${mx + mw - 6}" y="${my + 13}" fill="#94a3b8" font-size="7.5" font-weight="bold" text-anchor="end">${isBuilt ? '✓ FAIT' : '➡️'}</text>

            <!-- Recette & Débit Net -->
            <text x="${mx + mw / 2}" y="${my + 36}" fill="${isBuilt ? '#64748b' : '#ffffff'}" font-size="8.5" font-weight="bold" text-anchor="middle" ${isBuilt ? 'text-decoration="line-through"' : ''}>${st.recipeName.substring(0, 16)}</text>
            ${statusBadge}
            
            <!-- Ports d'E/S physiques nets -->
            <circle cx="${inX}" cy="${inY}" r="3.5" fill="${isBuilt ? '#10b981' : z.color}" stroke="#0f172a" stroke-width="2" />
            <circle cx="${outX}" cy="${outY}" r="3.5" fill="#10b981" stroke="#0f172a" stroke-width="2" />
          </g>
        `;
      }
    });

    // 3. ARCHITECTURE EN BUS COLLECTEUR ORTHOGONAL (ZÉRO SPAGHETTI / LISIBILITÉ CAD PARFAITE)
    let machineLinksSvg = "";

    const zone1Machs = placedMachines.filter(m => m.zoneIdx === 0);
    const zone2Machs = placedMachines.filter(m => m.zoneIdx === 1);
    const zone3Machs = placedMachines.filter(m => m.zoneIdx === 2);

    // --- BUS 0 : Arrivée Minerais Bruts ➔ Zone 1 (Fonderies) ---
    const busRawX = gridX + 4;
    const rawFeedY = gridY + 60;

    if (zone1Machs.length > 0) {
      const minInY = Math.min(...zone1Machs.map(m => m.inY));
      const maxInY = Math.max(...zone1Machs.map(m => m.inY));
      const allZone1Built = zone1Machs.every(m => m.isBuilt);

      // Ligne d'arrivée principale
      machineLinksSvg += `
        <!-- Alimentation Brute Principale -->
        <path d="M 25 ${rawFeedY} L ${busRawX} ${rawFeedY}" stroke="${allZone1Built ? '#065f46' : '#f59e0b'}" stroke-width="3.5" fill="none" stroke-linecap="round" opacity="${allZone1Built ? '0.25' : '1'}" />
        <polygon points="${busRawX},${rawFeedY} ${busRawX - 6},${rawFeedY - 3} ${busRawX - 6},${rawFeedY + 3}" fill="${allZone1Built ? '#065f46' : '#f59e0b'}" opacity="${allZone1Built ? '0.25' : '1'}" />
        
        <!-- Tronc Vertical Bus Minerais -->
        <line x1="${busRawX}" y1="${Math.min(rawFeedY, minInY)}" x2="${busRawX}" y2="${maxInY}" stroke="${allZone1Built ? '#065f46' : '#f59e0b'}" stroke-width="2.5" stroke-linecap="round" opacity="${allZone1Built ? '0.25' : '1'}" />
      `;

      // Dérivations horizontales vers chaque Fonderie
      zone1Machs.forEach(m => {
        const strokeColor = m.isBuilt ? "#065f46" : "#f59e0b";
        const op = m.isBuilt ? "0.22" : "1";
        machineLinksSvg += `
          <line class="mach-link-line mach-in-${m.machKey}" x1="${busRawX}" y1="${m.inY}" x2="${m.inX}" stroke="${strokeColor}" stroke-width="2" stroke-dasharray="${m.isBuilt ? '3,3' : 'none'}" stroke-linecap="round" opacity="${op}" />
          <polygon class="mach-link-arrow mach-in-${m.machKey}" points="${m.inX},${m.inY} ${m.inX - 4},${m.inY - 2.5} ${m.inX - 4},${m.inY + 2.5}" fill="${strokeColor}" opacity="${op}" />
        `;
      });
    }

    // --- BUS 1 : Tronc Collecteur Lingots (Entre Zone 1 et Zone 2) ---
    const bus1X = gridX + cellW * 2; // Exactement dans l'allée centrale
    if (zone1Machs.length > 0 && zone2Machs.length > 0) {
      const minOutY = Math.min(...zone1Machs.map(m => m.outY));
      const maxOutY = Math.max(...zone1Machs.map(m => m.outY));
      const minInY = Math.min(...zone2Machs.map(m => m.inY));
      const maxInY = Math.max(...zone2Machs.map(m => m.inY));

      const trunkTop = Math.min(minOutY, minInY);
      const trunkBottom = Math.max(maxOutY, maxInY);
      const allZone1Built = zone1Machs.every(m => m.isBuilt);

      // Collecte depuis les sorties de Zone 1 vers le Bus 1
      zone1Machs.forEach(m => {
        const strokeColor = m.isBuilt ? "#065f46" : "#f59e0b";
        const op = m.isBuilt ? "0.22" : "1";
        machineLinksSvg += `
          <line class="mach-link-line mach-out-${m.machKey}" x1="${m.outX}" y1="${m.outY}" x2="${bus1X}" y2="${m.outY}" stroke="${strokeColor}" stroke-width="2" stroke-dasharray="${m.isBuilt ? '3,3' : 'none'}" stroke-linecap="round" opacity="${op}" />
        `;
      });

      // Ligne de tronc vertical principal Bus 1
      machineLinksSvg += `
        <!-- Tronc Vertical Bus Lingots -->
        <line x1="${bus1X}" y1="${trunkTop}" x2="${bus1X}" y2="${trunkBottom}" stroke="${allZone1Built ? '#065f46' : '#f59e0b'}" stroke-width="3" stroke-linecap="round" opacity="${allZone1Built ? '0.3' : '1'}" />
        
        <!-- Badge Bus Lingots -->
        <g transform="translate(${bus1X - 28}, ${trunkTop - 14})" opacity="${allZone1Built ? '0.35' : '1'}">
          <rect width="56" height="14" rx="3" fill="#0f172a" stroke="${allZone1Built ? '#065f46' : '#f59e0b'}" stroke-width="1" />
          <text x="28" y="10" fill="${allZone1Built ? '#a7f3d0' : '#fef3c7'}" font-size="7.5" font-weight="900" text-anchor="middle">BUS LINGOTS</text>
        </g>
      `;

      // Dérivations horizontales vers les entrées des Constructeurs (Zone 2)
      zone2Machs.forEach(m => {
        const strokeColor = m.isBuilt ? "#065f46" : "#f59e0b";
        const op = m.isBuilt ? "0.22" : "1";
        machineLinksSvg += `
          <line class="mach-link-line mach-in-${m.machKey}" x1="${bus1X}" y1="${m.inY}" x2="${m.inX}" stroke="${strokeColor}" stroke-width="2" stroke-dasharray="${m.isBuilt ? '3,3' : 'none'}" stroke-linecap="round" opacity="${op}" />
          <polygon class="mach-link-arrow mach-in-${m.machKey}" points="${m.inX},${m.inY} ${m.inX - 4},${m.inY - 2.5} ${m.inX - 4},${m.inY + 2.5}" fill="${strokeColor}" opacity="${op}" />
        `;
      });
    }

    // --- BUS 2 : Tronc Collecteur Composants (Entre Zone 2 et Zone 3) ---
    const bus2X = gridX + cellW * 4; // Dans l'allée entre Zone 2 et Zone 3
    if (zone2Machs.length > 0 && zone3Machs.length > 0) {
      const minOutY = Math.min(...zone2Machs.map(m => m.outY));
      const maxOutY = Math.max(...zone2Machs.map(m => m.outY));
      const minInY = Math.min(...zone3Machs.map(m => m.inY));
      const maxInY = Math.max(...zone3Machs.map(m => m.inY));

      const trunkTop = Math.min(minOutY, minInY);
      const trunkBottom = Math.max(maxOutY, maxInY);
      const allZone2Built = zone2Machs.every(m => m.isBuilt);

      // Collecte depuis les sorties de Zone 2 vers le Bus 2
      zone2Machs.forEach(m => {
        const strokeColor = m.isBuilt ? "#065f46" : "#38bdf8";
        const op = m.isBuilt ? "0.22" : "1";
        machineLinksSvg += `
          <line class="mach-link-line mach-out-${m.machKey}" x1="${m.outX}" y1="${m.outY}" x2="${bus2X}" y2="${m.outY}" stroke="${strokeColor}" stroke-width="2" stroke-dasharray="${m.isBuilt ? '3,3' : 'none'}" stroke-linecap="round" opacity="${op}" />
        `;
      });

      // Ligne de tronc vertical principal Bus 2
      machineLinksSvg += `
        <!-- Tronc Vertical Bus Composants -->
        <line x1="${bus2X}" y1="${trunkTop}" x2="${bus2X}" y2="${trunkBottom}" stroke="${allZone2Built ? '#065f46' : '#38bdf8'}" stroke-width="3" stroke-linecap="round" opacity="${allZone2Built ? '0.3' : '1'}" />
        
        <!-- Badge Bus Composants -->
        <g transform="translate(${bus2X - 32}, ${trunkTop - 14})" opacity="${allZone2Built ? '0.35' : '1'}">
          <rect width="64" height="14" rx="3" fill="#0f172a" stroke="${allZone2Built ? '#065f46' : '#38bdf8'}" stroke-width="1" />
          <text x="32" y="10" fill="${allZone2Built ? '#a7f3d0' : '#38bdf8'}" font-size="7.5" font-weight="900" text-anchor="middle">BUS USINAGE</text>
        </g>
      `;

      // Dérivations horizontales vers les Assembleuses (Zone 3)
      zone3Machs.forEach(m => {
        const strokeColor = m.isBuilt ? "#065f46" : "#38bdf8";
        const op = m.isBuilt ? "0.22" : "1";
        machineLinksSvg += `
          <line class="mach-link-line mach-in-${m.machKey}" x1="${bus2X}" y1="${m.inY}" x2="${m.inX}" stroke="${strokeColor}" stroke-width="2" stroke-dasharray="${m.isBuilt ? '3,3' : 'none'}" stroke-linecap="round" opacity="${op}" />
          <polygon class="mach-link-arrow mach-in-${m.machKey}" points="${m.inX},${m.inY} ${m.inX - 4},${m.inY - 2.5} ${m.inX - 4},${m.inY + 2.5}" fill="${strokeColor}" opacity="${op}" />
        `;
      });
    }

    // --- BUS 3 : Collecteur de Sortie Finale (Produit Fini) ---
    const finalProducers = zone3Machs.length > 0 ? zone3Machs : (zone2Machs.length > 0 ? zone2Machs : zone1Machs);
    const busOutX = gridX + gridW - 12;
    const finalOutY = gridY + gridH - 60;

    if (finalProducers.length > 0) {
      const minOutY = Math.min(...finalProducers.map(m => m.outY));
      const maxOutY = Math.max(...finalProducers.map(m => m.outY));

      // Collecte depuis les machines vers le Bus de Sortie
      finalProducers.forEach(m => {
        const strokeColor = m.isBuilt ? "#065f46" : "#10b981";
        const op = m.isBuilt ? "0.22" : "1";
        machineLinksSvg += `
          <line class="mach-link-line mach-out-${m.machKey}" x1="${m.outX}" y1="${m.outY}" x2="${busOutX}" y2="${m.outY}" stroke="${strokeColor}" stroke-width="2" stroke-dasharray="${m.isBuilt ? '3,3' : 'none'}" stroke-linecap="round" opacity="${op}" />
        `;
      });

      const allFinalBuilt = finalProducers.every(m => m.isBuilt);

      // Ligne de tronc vertical de sortie
      machineLinksSvg += `
        <!-- Tronc Vertical de Sortie -->
        <line x1="${busOutX}" y1="${minOutY}" x2="${busOutX}" y2="${finalOutY}" stroke="${allFinalBuilt ? '#065f46' : '#10b981'}" stroke-width="3.5" stroke-linecap="round" opacity="${allFinalBuilt ? '0.3' : '1'}" />
        
        <!-- Évacuation Finale vers le Port de Droite -->
        <path d="M ${busOutX} ${finalOutY} L ${svgWidth - 25} ${finalOutY}" stroke="${allFinalBuilt ? '#065f46' : '#10b981'}" stroke-width="4" fill="none" stroke-linecap="round" opacity="${allFinalBuilt ? '0.35' : '1'}" />
        <polygon points="${svgWidth - 20},${finalOutY} ${svgWidth - 28},${finalOutY - 4} ${svgWidth - 28},${finalOutY + 4}" fill="${allFinalBuilt ? '#065f46' : '#10b981'}" opacity="${allFinalBuilt ? '0.35' : '1'}" />
      `;
    }

    // 4. Cartouches d'Entrée Principale et Sortie Finale
    let internalLinksSvg = `
      <!-- Entrée Brute Extérieure Gauche -->
      <g transform="translate(10, ${rawFeedY - 26})">
        <rect width="125" height="22" rx="4" fill="#0f172a" stroke="#f59e0b" stroke-width="1.2" />
        <text x="62" y="15" fill="#fef3c7" font-size="9" font-weight="bold" text-anchor="middle" font-family="monospace">📥 MINERAIS BRUTS</text>
      </g>

      <!-- Réseau de Bus Orthogonal Épuré -->
      ${machineLinksSvg}

      <!-- Sortie Produit Fini Unique Droite -->
      <g transform="translate(${svgWidth - 180}, ${finalOutY - 32})">
        <rect width="165" height="24" rx="4" fill="#064e3b" stroke="#10b981" stroke-width="1.5" />
        <text x="82" y="16" fill="#ffffff" font-size="10" font-weight="900" text-anchor="middle" font-family="monospace">📦 ${targetItem.rate}/m ${targetName}</text>
      </g>
    `;

    return `
      <svg viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto; max-height: 72vh; aspect-ratio: ${svgWidth} / ${svgHeight}; border-radius: 6px; background: #060a12; font-family: system-ui, -apple-system, sans-serif; display: block;">
        <defs>
          <pattern id="cadGridMicro" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255, 255, 255, 0.02)" stroke-width="0.8"/>
          </pattern>
        </defs>

        <rect width="${svgWidth}" height="${svgHeight}" fill="url(#cadGridMicro)" />

        <!-- Cadre Technique Principal -->
        <rect x="12" y="12" width="${svgWidth - 24}" height="${svgHeight - 24}" rx="4" fill="none" stroke="#1e293b" stroke-width="1.5" />
        <rect x="16" y="16" width="${svgWidth - 32}" height="${svgHeight - 32}" fill="none" stroke="rgba(56, 189, 248, 0.2)" stroke-width="1" />

        <!-- En-Tête Cartouche Officiel Micro-Usine Mk.3 -->
        <rect x="22" y="22" width="${svgWidth - 44}" height="46" rx="3" fill="#0c1322" stroke="rgba(56, 189, 248, 0.4)" stroke-width="1" />
        <text x="36" y="44" fill="#38bdf8" font-size="13" font-weight="900" letter-spacing="1">
          🏛️ MICRO-USINE INTÉGRÉE CLEF-EN-MAIN MK.3 : ${targetName.toUpperCase()} (${targetItem.rate}/MIN)
        </text>
        <text x="36" y="58" fill="#94a3b8" font-size="10">
          Module Tout-en-Un (Fonderies + Constructeurs + Assembleuses) | Puissance : <tspan fill="#f59e0b" font-weight="bold">${totalPower} MW</tspan> | Grille : <tspan fill="#38bdf8" font-weight="bold">6x6 Fondations (48m × 48m)</tspan>
        </text>

        <g transform="translate(${svgWidth - 210}, 28)">
          <rect width="180" height="34" rx="4" fill="#064e3b" stroke="#10b981" stroke-width="1.2" />
          <text x="90" y="15" fill="#a7f3d0" font-size="9.5" font-weight="900" text-anchor="middle" font-family="monospace">1 SEUL PLAN MK.3</text>
          <text x="90" y="27" fill="#ffffff" font-size="8.5" text-anchor="middle">${totalMachines} Machines Intégrées</text>
        </g>

        <!-- Fond de Grille 6x6 Fondations -->
        ${gridTilesSvg}

        <!-- 3 Zones Mixtes Intégrées -->
        ${zonesSvg}

        <!-- Machines Mixtes -->
        ${mixedMachinesSvg}

        <!-- Convoyeurs de Liaison Directe -->
        ${internalLinksSvg}

        <!-- Pied de Page CAD -->
        <line x1="22" y1="${svgHeight - 44}" x2="${svgWidth - 22}" y2="${svgHeight - 44}" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
        <text x="30" y="${svgHeight - 24}" fill="#64748b" font-size="9.5" font-family="monospace">
          PLAN CAD MULTI-MACHINES MIXTE // COMPACTAGE MAXIMUM MK.3 // ENTRÉE BRUTE ➔ SORTIE PRODUIT FINI DIRECTE
        </text>
        <text x="${svgWidth - 30}" y="${svgHeight - 24}" fill="#10b981" font-size="9.5" font-weight="bold" text-anchor="end" font-family="monospace">
          AUTONOMIE TOTALE 1.2
        </text>
      </svg>
    `;
  }

  // Écouteurs de clic & survol pour surbrillance des machines et affichage des composants d'entrée
  function attachMachineInteractivity(container) {
    if (!container) return;

    let tooltip = document.getElementById("ficsit-machine-hud-tooltip");
    if (!tooltip) {
      tooltip = document.createElement("div");
      tooltip.id = "ficsit-machine-hud-tooltip";
      tooltip.style.cssText = `
        position: fixed;
        display: none;
        pointer-events: none;
        z-index: 99999999;
        background: #09101d;
        border: 1.5px solid #38bdf8;
        box-shadow: 0 10px 30px rgba(0,0,0,0.9), 0 0 20px rgba(56,189,248,0.3);
        border-radius: 8px;
        padding: 12px 16px;
        font-family: system-ui, -apple-system, sans-serif;
        color: #f8fafc;
        font-size: 12px;
        min-width: 250px;
        max-width: 360px;
        backdrop-filter: blur(10px);
        transition: opacity 0.12s ease;
      `;
      document.body.appendChild(tooltip);
    }

    const positionTooltip = (e) => {
      const padding = 16;
      let x = e.clientX + padding;
      let y = e.clientY + padding;

      const rect = tooltip.getBoundingClientRect();
      if (x + rect.width > window.innerWidth - 10) {
        x = e.clientX - rect.width - padding;
      }
      if (y + rect.height > window.innerHeight - 10) {
        y = e.clientY - rect.height - padding;
      }
      tooltip.style.left = `${Math.max(10, x)}px`;
      tooltip.style.top = `${Math.max(10, y)}px`;
    };

    container.querySelectorAll(".svg-clickable-machine").forEach(el => {
      const key = el.getAttribute("data-mach-key");
      const name = el.getAttribute("data-mach-name") || "Machine";
      if (!key) return;

      // 1. CLIC : Cocher / Décocher
      el.onclick = (e) => {
        e.stopPropagation();
        if (STATE.builtMachines.has(key)) {
          STATE.builtMachines.delete(key);
          showToast(`↺ Machine réactivée : ${name}`);
        } else {
          STATE.builtMachines.add(key);
          showToast(`✅ Machine construite en jeu : ${name}`);
        }
        saveState();
        if (STATE.lastCalculation) {
          renderCalculationResults(STATE.lastCalculation);
        }
      };

      // 2. SURVOL (HOVER) : Mettre en surbrillance la machine, les machines associées, les lignes et AFFICHER LES COMPOSANTS D'ENTRÉE
      el.onmouseenter = (e) => {
        el.style.filter = "drop-shadow(0 0 16px #38bdf8)";
        el.style.opacity = "1";

        const myItem = el.getAttribute("data-item-id");
        const myInputs = (el.getAttribute("data-inputs") || "").split(",").filter(Boolean);
        const inDetail = el.getAttribute("data-inputs-detail") || "Minerais bruts directs";
        const outDetail = el.getAttribute("data-output-detail") || "";
        const mName = el.getAttribute("data-mach-name") || "Machine";
        const pVal = el.getAttribute("data-power-val") || "";
        const isBuilt = STATE.builtMachines && STATE.builtMachines.has(key);

        // Afficher l'infobulle HUD FICSIT des composants d'entrée
        tooltip.innerHTML = `
          <div style="font-weight: 800; font-size: 13.5px; color: #38bdf8; border-bottom: 1px solid rgba(56, 189, 248, 0.3); padding-bottom: 6px; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between; gap: 10px;">
            <span>🏭 ${mName}</span>
            <span style="color: #f59e0b; font-size: 11px; font-weight: bold;">⚡ ${pVal}</span>
          </div>
          <div style="margin-bottom: 8px;">
            <div style="font-size: 10px; text-transform: uppercase; font-weight: 800; color: #fbbf24; margin-bottom: 3px; letter-spacing: 0.5px;">
              📥 COMPOSANTS REQUIS EN ENTRÉE :
            </div>
            <div style="background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.4); padding: 6px 10px; border-radius: 4px; font-weight: 700; color: #fef3c7; font-size: 12.5px;">
              ${inDetail}
            </div>
          </div>
          <div>
            <div style="font-size: 10px; text-transform: uppercase; font-weight: 800; color: #4ade80; margin-bottom: 3px; letter-spacing: 0.5px;">
              📤 PRODUCTION EN SORTIE :
            </div>
            <div style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); padding: 6px 10px; border-radius: 4px; font-weight: 800; color: #a7f3d0; font-size: 12.5px;">
              ${outDetail}
            </div>
          </div>
          <div style="margin-top: 8px; padding-top: 6px; border-top: 1px dashed rgba(255,255,255,0.1); font-size: 10px; color: ${isBuilt ? '#a7f3d0' : '#94a3b8'}; display: flex; justify-content: space-between;">
            <span>${isBuilt ? '✅ Statut : Construite' : '⏳ Statut : À construire'}</span>
            <span style="color: #38bdf8;">(Clic pour cocher)</span>
          </div>
        `;
        tooltip.style.display = "block";
        positionTooltip(e);

        // Mettre en surbrillance les machines associées (fournisseurs & consommateurs)
        container.querySelectorAll(".svg-clickable-machine").forEach(other => {
          if (other === el) return;
          const otherItem = other.getAttribute("data-item-id");
          const otherInputs = (other.getAttribute("data-inputs") || "").split(",").filter(Boolean);

          const isSupplier = otherItem && myInputs.includes(otherItem);
          const isConsumer = myItem && otherInputs.includes(myItem);

          if (isSupplier) {
            other.style.opacity = "1";
            other.style.filter = "drop-shadow(0 0 12px #38bdf8)";
          } else if (isConsumer) {
            other.style.opacity = "1";
            other.style.filter = "drop-shadow(0 0 12px #4ade80)";
          } else {
            other.style.opacity = "0.15";
          }
        });

        // Lignes d'entrée associées ➔ Surbrillance Cyan
        container.querySelectorAll(`.mach-in-${key}`).forEach(l => {
          l.style.stroke = "#38bdf8";
          l.style.strokeWidth = "4";
          l.style.opacity = "1";
          l.style.filter = "drop-shadow(0 0 8px #38bdf8)";
          if (l.tagName === "polygon") l.style.fill = "#38bdf8";
        });

        // Lignes de sortie associées ➔ Surbrillance Vert Émeraude
        container.querySelectorAll(`.mach-out-${key}`).forEach(l => {
          l.style.stroke = "#4ade80";
          l.style.strokeWidth = "4";
          l.style.opacity = "1";
          l.style.filter = "drop-shadow(0 0 8px #4ade80)";
          if (l.tagName === "polygon") l.style.fill = "#4ade80";
        });

        // Atténuation des lignes non concernées
        container.querySelectorAll(".mach-link-line, .mach-link-arrow").forEach(otherLine => {
          if (!otherLine.classList.contains(`mach-in-${key}`) && !otherLine.classList.contains(`mach-out-${key}`)) {
            otherLine.style.opacity = "0.08";
          }
        });
      };

      el.onmousemove = (e) => {
        positionTooltip(e);
      };

      el.onmouseleave = () => {
        tooltip.style.display = "none";
        container.querySelectorAll(".svg-clickable-machine").forEach(m => {
          m.style.filter = "";
          const mKey = m.getAttribute("data-mach-key");
          const isBuilt = STATE.builtMachines.has(mKey);
          m.style.opacity = isBuilt ? "0.32" : "1";
        });

        container.querySelectorAll(".mach-link-line, .mach-link-arrow").forEach(l => {
          l.style.stroke = "";
          l.style.strokeWidth = "";
          l.style.opacity = "";
          l.style.filter = "";
          l.style.fill = "";
        });
      };
    });
  }

  // Ouverture modale Blueprint HD FICSIT
  function openBlueprintModal(title, svgContent) {
    const modal = document.getElementById("blueprint-img-modal");
    const modalTitle = document.getElementById("modal-bp-title");
    const modalImg = document.getElementById("modal-bp-img");
    const modalSvgContainer = document.getElementById("modal-bp-dynamic-svg");
    const closeBtn = document.getElementById("modal-bp-close");

    if (!modal) return;

    if (modalTitle) modalTitle.textContent = title;
    if (modalImg) modalImg.style.display = "none";
    if (modalSvgContainer) {
      modalSvgContainer.innerHTML = svgContent;
      modalSvgContainer.style.display = "block";
      attachMachineInteractivity(modalSvgContainer);
    }

    modal.classList.add("is-active");
    modal.style.display = "flex";
    modal.style.zIndex = "9999999";

    const closeModal = (e) => {
      if (e && e.stopPropagation) e.stopPropagation();
      modal.classList.remove("is-active");
      modal.style.display = "none";
    };

    if (closeBtn) closeBtn.onclick = closeModal;
    modal.onclick = (e) => {
      if (e.target === modal) closeModal(e);
    };
  }

  // Gestionnaire global pour ouvrir le plan Mk.3 HD d'un module
  window.openMk3PlanModal = (modIdx) => {
    const calcData = STATE.lastCalculation;
    if (!calcData || !calcData.productionSteps) return;

    const totalMachines = calcData.productionSteps.reduce((sum, s) => sum + (s.physicalMachines || Math.ceil(s.machinesCount)), 0);
    const targetItem = (calcData.targets && calcData.targets[0]) || { item: "Produit Fini", rate: 10 };
    const targetName = ITEM_NAMES[targetItem.item] || targetItem.item;

    const mk3Modules = [];
    if (totalMachines <= 18) {
      mk3Modules.push({
        num: 1,
        title: `Plan Mk.3 #1 : Micro-Usine Intégrée [${targetName}]`,
        steps: calcData.productionSteps
      });
    } else {
      let currentSteps = [];
      let currentCount = 0;
      let mIdx = 1;
      calcData.productionSteps.forEach((st) => {
        const count = st.physicalMachines || Math.ceil(st.machinesCount);
        if (currentCount + count > 18 && currentSteps.length > 0) {
          mk3Modules.push({
            num: mIdx,
            title: `Plan Mk.3 #${mIdx} : Module Intermédiaire [${currentSteps.map(s => s.recipeName).join(" + ")}]`,
            steps: [...currentSteps]
          });
          mIdx++;
          currentSteps = [];
          currentCount = 0;
        }
        currentSteps.push(st);
        currentCount += count;
      });
      if (currentSteps.length > 0) {
        mk3Modules.push({
          num: mIdx,
          title: `Plan Mk.3 #${mIdx} : Module Final [${targetName}]`,
          steps: [...currentSteps]
        });
      }
    }

    const mod = mk3Modules[modIdx] || mk3Modules[0];
    const modData = mod ? { ...calcData, productionSteps: mod.steps } : calcData;
    const svg = generateIntegratedMultiMachineBlueprintSVG(modData);
    openBlueprintModal(`🏛️ ${mod ? mod.title : "Micro-Usine Intégrée Mk.3"} (Designer 6×6)`, svg);
  };

  // =========================================================================
  // MOTEUR DU GUIDE DE CHANTIER PAS-À-PAS INTERACTIF (NOTICE FICSIT IN-GAME)
  // VUE TOP-DOWN 2D PHOTORÉALISTE STYLE SCIM BLUEPRINT DESIGNER
  // =========================================================================
  const FactoryConstructionGuide = {
    currentStepIndex: 0,
    steps: [],
    currentViewMode: "step", // "step" ou "full"
    validatedSteps: new Set(JSON.parse(localStorage.getItem("ficsit_guide_validated") || "[]")),
    lastResults: null,

    // Rendu d'une dalle de fondation FICSIT 8m×8m biseautée
    renderFoundationTile(x, y, w, h, colLabel, rowLabel) {
      const qW = (w - 8) / 2;
      const qH = (h - 8) / 2;
      return `
        <g class="ficsit-foundation-tile" data-coord="${colLabel}${rowLabel}">
          <!-- Dalle extérieure biseautée -->
          <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#141822" stroke="#252f3e" stroke-width="1.2" rx="2" />
          <!-- 4 Panneaux métalliques intérieurs -->
          <rect x="${x + 3}" y="${y + 3}" width="${qW}" height="${qH}" rx="2" fill="#1b222e" stroke="#253040" stroke-width="0.8" />
          <rect x="${x + w/2 + 1}" y="${y + 3}" width="${qW}" height="${qH}" rx="2" fill="#1b222e" stroke="#253040" stroke-width="0.8" />
          <rect x="${x + 3}" y="${y + h/2 + 1}" width="${qW}" height="${qH}" rx="2" fill="#1b222e" stroke="#253040" stroke-width="0.8" />
          <rect x="${x + w/2 + 1}" y="${y + h/2 + 1}" width="${qW}" height="${qH}" rx="2" fill="#1b222e" stroke="#253040" stroke-width="0.8" />
          <!-- Rivets / Boulons aux 4 coins -->
          <circle cx="${x + 5}" cy="${y + 5}" r="1.2" fill="#475569" />
          <circle cx="${x + w - 5}" cy="${y + 5}" r="1.2" fill="#475569" />
          <circle cx="${x + 5}" cy="${y + h - 5}" r="1.2" fill="#475569" />
          <circle cx="${x + w - 5}" cy="${y + h - 5}" r="1.2" fill="#475569" />
          <!-- Coordonnée discrète -->
          <text x="${x + 6}" y="${y + h - 6}" fill="rgba(56, 189, 248, 0.18)" font-size="8" font-weight="bold" font-family="monospace">${colLabel}${rowLabel}</text>
        </g>
      `;
    },

    // Rendu Sprite 2D Fonderie (Smelter) Top-Down avec Creuset en Fusion
    renderSpriteSmelter(x, y, w, h, data, opacity = 1, isTargetStep = false) {
      const activeGlow = isTargetStep ? `filter="drop-shadow(0 0 12px rgba(245, 158, 11, 0.75))"` : `filter="drop-shadow(0 4px 10px rgba(0,0,0,0.6))"`;
      const strokeCol = isTargetStep ? "#f59e0b" : "#3e4d62";
      return `
        <g class="ficsit-sprite-smelter" transform="translate(${x}, ${y})" opacity="${opacity}" ${activeGlow} style="cursor: pointer;">
          <title>🏭 Fonderie : ${data.recipeName || "Lingots"} (${data.rateProduced ? Math.round(data.rateProduced*10)/10 + '/min' : ""})&#10;Emplacement : Dalle Fondations</title>
          <!-- Corps principal de la machine -->
          <rect x="0" y="0" width="${w}" height="${h}" rx="5" fill="#171d27" stroke="${strokeCol}" stroke-width="${isTargetStep ? 2.2 : 1.4}" />
          <!-- Gardes-corps latéraux FICSIT Orange -->
          <rect x="2" y="8" width="4" height="${h - 16}" rx="1" fill="#ea580c" />
          <rect x="${w - 6}" y="8" width="4" height="${h - 16}" rx="1" fill="#ea580c" />
          <!-- Ailettes de dissipation thermique -->
          <line x1="8" y1="18" x2="14" y2="18" stroke="#475569" stroke-width="1.2" />
          <line x1="8" y1="24" x2="14" y2="24" stroke="#475569" stroke-width="1.2" />
          <line x1="${w - 14}" y1="18" x2="${w - 8}" y2="18" stroke="#475569" stroke-width="1.2" />
          <line x1="${w - 14}" y1="24" x2="${w - 8}" y2="24" stroke="#475569" stroke-width="1.2" />
          <!-- Cavité & Foyer incandescent au centre (Molten Core) -->
          <rect x="${w/2 - 13}" y="${h/2 - 19}" width="26" height="38" rx="13" fill="#090d14" stroke="#ea580c" stroke-width="1.2" />
          <ellipse cx="${w/2}" cy="${h/2}" rx="9" ry="14" fill="url(#smelterCoreGlow)" />
          <ellipse cx="${w/2}" cy="${h/2}" rx="5" ry="8" fill="#ffffff" opacity="0.85" />
          <!-- Port d'entrée Arrière (Bas) -->
          <rect x="${w/2 - 8}" y="${h - 4}" width="16" height="5" rx="1.5" fill="#1e293b" stroke="#f97316" stroke-width="1" />
          <circle cx="${w/2}" cy="${h - 1}" r="2" fill="#38bdf8" />
          <!-- Port de sortie Avant (Haut) -->
          <rect x="${w/2 - 8}" y="-1" width="16" height="5" rx="1.5" fill="#1e293b" stroke="#10b981" stroke-width="1" />
          <circle cx="${w/2}" cy="1" r="2" fill="#22c55e" />
          <!-- Étiquette FICSIT -->
          <rect x="8" y="4" width="${w - 16}" height="10" rx="2" fill="#0f172a" opacity="0.9" />
          <text x="${w/2}" y="12" fill="#f59e0b" font-size="7.5" font-weight="900" text-anchor="middle" font-family="sans-serif">FONDERIE</text>
          <text x="${w/2}" y="${h - 7}" fill="#cbd5e1" font-size="7" font-weight="bold" text-anchor="middle">${(data.recipeName || "Lingots").substring(0, 11)}</text>
        </g>
      `;
    },

    // Rendu Sprite 2D Constructeur (Constructor) Top-Down avec Treillis Orange & Pistons
    renderSpriteConstructor(x, y, w, h, data, opacity = 1, isTargetStep = false) {
      const activeGlow = isTargetStep ? `filter="drop-shadow(0 0 12px rgba(56, 189, 248, 0.75))"` : `filter="drop-shadow(0 4px 10px rgba(0,0,0,0.6))"`;
      const strokeCol = isTargetStep ? "#38bdf8" : "#3e4d62";
      return `
        <g class="ficsit-sprite-constructor" transform="translate(${x}, ${y})" opacity="${opacity}" ${activeGlow} style="cursor: pointer;">
          <title>⚙️ Constructeur : ${data.recipeName || "Pièces"} (${data.rateProduced ? Math.round(data.rateProduced*10)/10 + '/min' : ""})&#10;Emplacement : Dalle Fondations</title>
          <!-- Corps principal de la machine -->
          <rect x="0" y="0" width="${w}" height="${h}" rx="5" fill="#161c26" stroke="${strokeCol}" stroke-width="${isTargetStep ? 2.2 : 1.4}" />
          <!-- Cage en Treillis FICSIT Orange Gauche (Lattice Truss Frame) -->
          <rect x="2" y="6" width="10" height="${h - 12}" fill="#0f141d" stroke="#ea580c" stroke-width="1.2" rx="1" />
          <line x1="2" y1="6" x2="12" y2="18" stroke="#f97316" stroke-width="1.2" />
          <line x1="12" y1="6" x2="2" y2="18" stroke="#f97316" stroke-width="1.2" />
          <line x1="2" y1="18" x2="12" y2="30" stroke="#f97316" stroke-width="1.2" />
          <line x1="12" y1="18" x2="2" y2="30" stroke="#f97316" stroke-width="1.2" />
          <line x1="2" y1="30" x2="12" y2="42" stroke="#f97316" stroke-width="1.2" />
          <line x1="12" y1="30" x2="2" y2="42" stroke="#f97316" stroke-width="1.2" />
          <line x1="2" y1="42" x2="12" y2="54" stroke="#f97316" stroke-width="1.2" />
          <line x1="12" y1="42" x2="2" y2="54" stroke="#f97316" stroke-width="1.2" />
          <!-- Cage en Treillis FICSIT Orange Droite -->
          <rect x="${w - 12}" y="6" width="10" height="${h - 12}" fill="#0f141d" stroke="#ea580c" stroke-width="1.2" rx="1" />
          <line x1="${w - 12}" y1="6" x2="${w - 2}" y2="18" stroke="#f97316" stroke-width="1.2" />
          <line x1="${w - 2}" y1="6" x2="${w - 12}" y2="18" stroke="#f97316" stroke-width="1.2" />
          <line x1="${w - 12}" y1="18" x2="${w - 2}" y2="30" stroke="#f97316" stroke-width="1.2" />
          <line x1="${w - 2}" y1="18" x2="${w - 12}" y2="30" stroke="#f97316" stroke-width="1.2" />
          <line x1="${w - 12}" y1="30" x2="${w - 2}" y2="42" stroke="#f97316" stroke-width="1.2" />
          <line x1="${w - 2}" y1="30" x2="${w - 12}" y2="42" stroke="#f97316" stroke-width="1.2" />
          <line x1="${w - 12}" y1="42" x2="${w - 2}" y2="54" stroke="#f97316" stroke-width="1.2" />
          <line x1="${w - 2}" y1="42" x2="${w - 12}" y2="54" stroke="#f97316" stroke-width="1.2" />
          <!-- Piston / Presse Hydraulique Centrale -->
          <rect x="15" y="16" width="${w - 30}" height="${h - 32}" rx="3" fill="#0d1219" stroke="#334155" stroke-width="1" />
          <rect x="${w/2 - 6}" y="20" width="12" height="14" rx="2" fill="#3b82f6" opacity="0.8" />
          <line x1="${w/2}" y1="20" x2="${w/2}" y2="${h - 20}" stroke="#94a3b8" stroke-width="2.5" />
          <rect x="${w/2 - 10}" y="${h/2 - 6}" width="20" height="12" rx="2" fill="#1e293b" stroke="#64748b" stroke-width="1" />
          <!-- Ports d'entrée (Bas) et sortie (Haut) -->
          <rect x="${w/2 - 8}" y="${h - 4}" width="16" height="5" rx="1.5" fill="#1e293b" stroke="#38bdf8" stroke-width="1" />
          <circle cx="${w/2}" cy="${h - 1}" r="2" fill="#38bdf8" />
          <rect x="${w/2 - 8}" y="-1" width="16" height="5" rx="1.5" fill="#1e293b" stroke="#10b981" stroke-width="1" />
          <circle cx="${w/2}" cy="1" r="2" fill="#22c55e" />
          <!-- Header Nom Machine -->
          <rect x="14" y="4" width="${w - 28}" height="9" rx="2" fill="#0369a1" opacity="0.9" />
          <text x="${w/2}" y="11" fill="#ffffff" font-size="7" font-weight="900" text-anchor="middle" font-family="sans-serif">CONSTRUCTEUR</text>
          <text x="${w/2}" y="${h - 6}" fill="#93c5fd" font-size="6.5" font-weight="bold" text-anchor="middle">${(data.recipeName || "Pièces").substring(0, 11)}</text>
        </g>
      `;
    },

    // Rendu Sprite 2D Assembleuse (Assembler) Top-Down avec Dôme Vitré & Bras Robotiques
    renderSpriteAssembler(x, y, w, h, data, opacity = 1, isTargetStep = false) {
      const activeGlow = isTargetStep ? `filter="drop-shadow(0 0 14px rgba(168, 85, 247, 0.8))"` : `filter="drop-shadow(0 4px 12px rgba(0,0,0,0.65))"`;
      const strokeCol = isTargetStep ? "#a855f7" : "#3e4d62";
      return `
        <g class="ficsit-sprite-assembler" transform="translate(${x}, ${y})" opacity="${opacity}" ${activeGlow} style="cursor: pointer;">
          <title>🧩 Assembleuse : ${data.recipeName || "Assemblage"} (${data.rateProduced ? Math.round(data.rateProduced*10)/10 + '/min' : ""})&#10;Double Entrée ➔ Sortie Unique</title>
          <!-- Châssis Lourd Double Largeur -->
          <rect x="0" y="0" width="${w}" height="${h}" rx="6" fill="#131822" stroke="${strokeCol}" stroke-width="${isTargetStep ? 2.4 : 1.5}" />
          <!-- Bras d'alimentation articulés latéraux (Orange & Rouge) -->
          <path d="M 0 24 L -6 24 L -6 44 L 0 44" stroke="#ea580c" stroke-width="2.5" fill="none" />
          <rect x="-9" y="30" width="4" height="8" rx="1" fill="#ef4444" />
          <path d="M ${w} 24 L ${w + 6} 24 L ${w + 6} 44 L ${w} 44" stroke="#ea580c" stroke-width="2.5" fill="none" />
          <rect x="${w + 5}" y="30" width="4" height="8" rx="1" fill="#ef4444" />
          <!-- Dôme Central Vitré Translucide (Glass Canopy) -->
          <rect x="14" y="16" width="${w - 28}" height="${h - 32}" rx="8" fill="url(#assemblerGlassGlow)" stroke="#38bdf8" stroke-width="1.2" />
          <!-- Reflet spéculaire sur la verrière -->
          <path d="M 20 22 L ${w - 30} 22" stroke="#ffffff" stroke-width="1" opacity="0.6" stroke-linecap="round" />
          <!-- Mécanisme interne visible à travers la vitre -->
          <circle cx="${w/2 - 10}" cy="${h/2}" r="7" fill="none" stroke="#475569" stroke-width="1.5" stroke-dasharray="3,2" />
          <circle cx="${w/2 + 10}" cy="${h/2}" r="7" fill="none" stroke="#475569" stroke-width="1.5" stroke-dasharray="3,2" />
          <circle cx="${w/2}" cy="${h/2}" r="3" fill="#a855f7" />
          <!-- Deux Ports d'Entrée Arrière (Bas gauche et bas droite) -->
          <rect x="${w/2 - 20}" y="${h - 4}" width="14" height="5" rx="1.5" fill="#1e293b" stroke="#38bdf8" stroke-width="1" />
          <circle cx="${w/2 - 13}" cy="${h - 1}" r="2" fill="#38bdf8" />
          <rect x="${w/2 + 6}" y="${h - 4}" width="14" height="5" rx="1.5" fill="#1e293b" stroke="#38bdf8" stroke-width="1" />
          <circle cx="${w/2 + 13}" cy="${h - 1}" r="2" fill="#38bdf8" />
          <!-- Port de Sortie Avant Central (Haut) -->
          <rect x="${w/2 - 9}" y="-1" width="18" height="5" rx="1.5" fill="#1e293b" stroke="#10b981" stroke-width="1" />
          <circle cx="${w/2}" cy="1" r="2.2" fill="#22c55e" />
          <!-- Header Nom Machine -->
          <rect x="18" y="4" width="${w - 36}" height="10" rx="2" fill="#6b21a8" opacity="0.9" />
          <text x="${w/2}" y="12" fill="#ffffff" font-size="7.5" font-weight="900" text-anchor="middle" font-family="sans-serif">ASSEMBLEUSE</text>
          <text x="${w/2}" y="${h - 6}" fill="#d8b4fe" font-size="7" font-weight="bold" text-anchor="middle">${(data.recipeName || "Assemblage").substring(0, 14)}</text>
        </g>
      `;
    },

    // Rendu Sprite 2D Répartiteur (Splitter) FICSIT Orange Octogonal
    renderSpriteSplitter(x, y, size = 26) {
      return `
        <g class="ficsit-sprite-splitter" transform="translate(${x - size/2}, ${y - size/2})">
          <polygon points="7,0 ${size-7},0 ${size},7 ${size},${size-7} ${size-7},${size} 7,${size} 0,${size-7} 0,7" fill="#ea580c" stroke="#f97316" stroke-width="1.2" />
          <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 5}" fill="#1e293b" stroke="#64748b" stroke-width="1" />
          <!-- Flèches de répartition 3 voies -->
          <polygon points="${size/2},4 ${size/2 - 2.5},8 ${size/2 + 2.5},8" fill="#38bdf8" />
          <polygon points="${size - 4},${size/2} ${size - 8},${size/2 - 2.5} ${size - 8},${size/2 + 2.5}" fill="#38bdf8" />
          <polygon points="4,${size/2} 8,${size/2 - 2.5} 8,${size/2 + 2.5}" fill="#38bdf8" />
          <circle cx="${size/2}" cy="${size/2}" r="2" fill="#ffffff" />
        </g>
      `;
    },

    // Rendu Sprite 2D Groupeur (Merger) FICSIT Bleu-Acier Octogonal
    renderSpriteMerger(x, y, size = 26) {
      return `
        <g class="ficsit-sprite-merger" transform="translate(${x - size/2}, ${y - size/2})">
          <polygon points="7,0 ${size-7},0 ${size},7 ${size},${size-7} ${size-7},${size} 7,${size} 0,${size-7} 0,7" fill="#0284c7" stroke="#38bdf8" stroke-width="1.2" />
          <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 5}" fill="#1e293b" stroke="#64748b" stroke-width="1" />
          <!-- Flèches de convergence -->
          <polygon points="${size/2},4 ${size/2 - 2.5},8 ${size/2 + 2.5},8" fill="#10b981" />
          <polygon points="${size - 8},${size/2} ${size - 4},${size/2 - 2.5} ${size - 4},${size/2 + 2.5}" fill="#10b981" />
          <polygon points="8,${size/2} 4,${size/2 - 2.5} 4,${size/2 + 2.5}" fill="#10b981" />
          <circle cx="${size/2}" cy="${size/2}" r="2" fill="#ffffff" />
        </g>
      `;
    },

    // Rendu Convoyeur Réaliste avec Courbe Bézier
    renderCurvedConveyor(pathD, color = "#475569", width = 12) {
      return `
        <path d="${pathD}" stroke="#1e242f" stroke-width="${width}" fill="none" stroke-linecap="round" stroke-linejoin="round" />
        <path d="${pathD}" stroke="${color}" stroke-width="${width - 3}" fill="none" stroke-linecap="round" stroke-linejoin="round" />
        <path d="${pathD}" stroke="#0b1017" stroke-width="${width - 6}" fill="none" stroke-linecap="round" stroke-linejoin="round" />
        <path d="${pathD}" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" stroke-dasharray="3,6" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      `;
    },

    // =========================================================================
    // VISUELS D'IMPLANTATION TOP-DOWN SPÉCIFIQUES POUR CHAQUE ÉTAPE DU CHANTIER
    // =========================================================================

    // ÉTAPE 1 : VISUEL TOP-DOWN FONDATIONS & ZONAGE GÉODÉSIQUE
    generateFoundationsStepSVG(results) {
      const svgW = 680, svgH = 680, margin = 50;
      const gridW = svgW - margin * 2, gridH = svgH - margin * 2;
      const cols = 6, rows = 6;
      const cellW = gridW / cols, cellH = gridH / rows;
      const colLetters = ["A", "B", "C", "D", "E", "F"];

      let foundationsSvg = "";
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          foundationsSvg += this.renderFoundationTile(margin + c * cellW, margin + r * cellH, cellW, cellH, colLetters[c], r + 1);
        }
      }

      let axesSvg = "";
      for (let c = 0; c < cols; c++) {
        axesSvg += `
          <text x="${margin + c * cellW + cellW/2}" y="${margin - 12}" fill="#38bdf8" font-size="11" font-weight="900" text-anchor="middle" font-family="monospace">${colLetters[c]} (8m)</text>
          <text x="${margin + c * cellW + cellW/2}" y="${svgH - margin + 20}" fill="#64748b" font-size="9" text-anchor="middle" font-family="monospace">${c*8}m - ${(c+1)*8}m</text>
        `;
      }
      for (let r = 0; r < rows; r++) {
        axesSvg += `<text x="${margin - 16}" y="${margin + r * cellH + cellH/2 + 4}" fill="#38bdf8" font-size="11" font-weight="900" text-anchor="middle" font-family="monospace">${r + 1}</text>`;
      }

      return `
        <svg viewBox="0 0 ${svgW} ${svgH}" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background: #060910; font-family: system-ui, sans-serif; user-select: none;">
          <!-- Titre -->
          <text x="${svgW/2}" y="24" fill="#38bdf8" font-size="13" font-weight="900" text-anchor="middle" letter-spacing="0.5">ÉTAPE 1 : DALLE DE FONDATIONS 6×6 (48m × 48m)</text>
          <text x="${svgW/2}" y="38" fill="#94a3b8" font-size="9.5" text-anchor="middle">Implantation du sol industriel et repères d'axes géodésiques FICSIT</text>
          
          <!-- Boussole -->
          <g transform="translate(${svgW - 40}, 30)">
            <circle cx="0" cy="0" r="14" fill="#111827" stroke="#38bdf8" stroke-width="1.2" />
            <polygon points="0,-11 -4,3 0,0 4,3" fill="#ef4444" />
            <polygon points="0,11 -4,0 0,0 4,0" fill="#94a3b8" />
            <text x="0" y="-14" fill="#ef4444" font-size="9" font-weight="900" text-anchor="middle">N</text>
          </g>

          <!-- Dalles et repères -->
          <g>${foundationsSvg}${axesSvg}</g>

          <!-- Zones d'implantation en surbrillance (Zonage fonctionnel FICSIT) -->
          <!-- Zone 1 : Fonderies (Rangée 5) -->
          <rect x="${margin + cellW + 4}" y="${margin + 4*cellH + 4}" width="${cellW * 4 - 8}" height="${cellH * 2 - 8}" rx="6" fill="rgba(245, 158, 11, 0.08)" stroke="#f59e0b" stroke-width="2" stroke-dasharray="6,4" />
          <rect x="${margin + cellW + 10}" y="${margin + 4*cellH + 10}" width="190" height="18" rx="3" fill="#0f172a" stroke="#f59e0b" stroke-width="1" />
          <text x="${margin + cellW + 105}" y="${margin + 4*cellH + 22}" fill="#f59e0b" font-size="9" font-weight="900" text-anchor="middle">ZONE 1 : MÉTALLURGIE (FONDERIES)</text>

          <!-- Zone 2 : Constructeurs (Rangée 3) -->
          <rect x="${margin + cellW + 4}" y="${margin + 2*cellH + 4}" width="${cellW * 4 - 8}" height="${cellH * 2 - 8}" rx="6" fill="rgba(56, 189, 248, 0.08)" stroke="#38bdf8" stroke-width="2" stroke-dasharray="6,4" />
          <rect x="${margin + cellW + 10}" y="${margin + 2*cellH + 10}" width="200" height="18" rx="3" fill="#0f172a" stroke="#38bdf8" stroke-width="1" />
          <text x="${margin + cellW + 110}" y="${margin + 2*cellH + 22}" fill="#38bdf8" font-size="9" font-weight="900" text-anchor="middle">ZONE 2 : USINAGE (CONSTRUCTEURS)</text>

          <!-- Zone 3 : Assembleuses (Rangée 1-2) -->
          <rect x="${margin + cellW + 4}" y="${margin + 4}" width="${cellW * 4 - 8}" height="${cellH * 2 - 8}" rx="6" fill="rgba(168, 85, 247, 0.08)" stroke="#a855f7" stroke-width="2" stroke-dasharray="6,4" />
          <rect x="${margin + cellW + 10}" y="${margin + 10}" width="210" height="18" rx="3" fill="#0f172a" stroke="#a855f7" stroke-width="1" />
          <text x="${margin + cellW + 115}" y="${margin + 22}" fill="#a855f7" font-size="9" font-weight="900" text-anchor="middle">ZONE 3 : ASSEMBLAGE & FINITION</text>

          <!-- Zone 4 : Stockage (Nord-Est / Dalle F1) -->
          <rect x="${margin + 5*cellW + 4}" y="${margin + 4}" width="${cellW - 8}" height="${cellH - 8}" rx="4" fill="rgba(16, 185, 129, 0.12)" stroke="#10b981" stroke-width="2" stroke-dasharray="4,3" />
          <text x="${margin + 5*cellW + cellW/2}" y="${margin + cellH/2}" fill="#10b981" font-size="8.5" font-weight="900" text-anchor="middle">📦 STOCKAGE</text>

          <!-- Cotation 48m -->
          <line x1="${margin}" y1="${svgH - 12}" x2="${svgW - margin}" y2="${svgH - 12}" stroke="#38bdf8" stroke-width="2" />
          <polygon points="${margin},${svgH - 12} ${margin + 8},${svgH - 16} ${margin + 8},${svgH - 8}" fill="#38bdf8" />
          <polygon points="${svgW - margin},${svgH - 12} ${svgW - margin - 8},${svgH - 16} ${svgW - margin - 8},${svgH - 8}" fill="#38bdf8" />
          <rect x="${svgW/2 - 75}" y="${svgH - 22}" width="150" height="20" rx="4" fill="#0f172a" stroke="#38bdf8" stroke-width="1" />
          <text x="${svgW/2}" y="${svgH - 9}" fill="#a7f3d0" font-size="10" font-weight="900" text-anchor="middle">◄ 48m × 48m (36 Dalles) ►</text>
        </svg>
      `;
    },

    // ÉTAPE 2 : VISUEL TOP-DOWN ARRIVÉES BRUTES & RÉPARTITEURS MANIFOLD
    generateRawLogisticsStepSVG(results) {
      const svgW = 680, svgH = 680, margin = 50;
      const gridW = svgW - margin * 2, gridH = svgH - margin * 2;
      const cols = 6, rows = 6;
      const cellW = gridW / cols, cellH = gridH / rows;
      const colLetters = ["A", "B", "C", "D", "E", "F"];

      let foundationsSvg = "";
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          foundationsSvg += this.renderFoundationTile(margin + c * cellW, margin + r * cellH, cellW, cellH, colLetters[c], r + 1);
        }
      }

      let axesSvg = "";
      for (let c = 0; c < cols; c++) {
        axesSvg += `<text x="${margin + c * cellW + cellW/2}" y="${margin - 12}" fill="#38bdf8" font-size="11" font-weight="900" text-anchor="middle" font-family="monospace">${colLetters[c]} (8m)</text>`;
      }
      for (let r = 0; r < rows; r++) {
        axesSvg += `<text x="${margin - 16}" y="${margin + r * cellH + cellH/2 + 4}" fill="#38bdf8" font-size="11" font-weight="900" text-anchor="middle" font-family="monospace">${r + 1}</text>`;
      }

      const rawEntries = Object.entries(results.rawResources || {});
      const splitY = margin + 5 * cellH + cellH/2;

      let splittersSvg = "";
      let beltsSvg = "";
      const splitPositions = [];

      for (let i = 0; i < 4; i++) {
        const cIdx = 1 + i; // B6, C6, D6, E6
        const sx = margin + cIdx * cellW + cellW/2;
        splitPositions.push(sx);
        splittersSvg += this.renderSpriteSplitter(sx, splitY, 28);
        // Flèches d'attente vers les fonderies
        beltsSvg += this.renderCurvedConveyor(`M ${sx} ${splitY} L ${sx} ${splitY - 32}`, "#f59e0b", 10);
        beltsSvg += `<polygon points="${sx},${splitY - 36} ${sx - 4},${splitY - 28} ${sx + 4},${splitY - 28}" fill="#f59e0b" />`;
      }

      // Ligne principale Manifold
      if (splitPositions.length > 0) {
        const firstX = splitPositions[0];
        const lastX = splitPositions[splitPositions.length - 1];
        // Entrée Sud
        beltsSvg += this.renderCurvedConveyor(`M ${firstX} ${svgH - 10} L ${firstX} ${splitY}`, "#f59e0b", 14);
        // Tronc transversal
        beltsSvg += this.renderCurvedConveyor(`M ${firstX} ${splitY} L ${lastX} ${splitY}`, "#f59e0b", 12);
      }

      const rawLabels = rawEntries.map(([res, rate]) => `<span style="color: #f59e0b; font-weight: bold;">+${Math.round(rate*10)/10}/min ${ITEM_NAMES[res]||res}</span>`).join(" • ");

      return `
        <svg viewBox="0 0 ${svgW} ${svgH}" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background: #060910; font-family: system-ui, sans-serif; user-select: none;">
          <text x="${svgW/2}" y="24" fill="#38bdf8" font-size="13" font-weight="900" text-anchor="middle" letter-spacing="0.5">ÉTAPE 2 : ARRIVÉES DE MINERAIS & MANIFOLD DE RÉPARTITEURS</text>
          <text x="${svgW/2}" y="38" fill="#94a3b8" font-size="9.5" text-anchor="middle">Pose des répartiteurs FICSIT Orange en Ligne 6 (Dalles B6, C6, D6, E6)</text>
          
          <g>${foundationsSvg}${axesSvg}</g>

          <!-- Zone Ligne 6 mise en valeur -->
          <rect x="${margin + 4}" y="${margin + 5*cellH + 4}" width="${gridW - 8}" height="${cellH - 8}" rx="4" fill="rgba(245, 158, 11, 0.12)" stroke="#f59e0b" stroke-width="1.8" stroke-dasharray="6,3" />
          <text x="${margin + 12}" y="${margin + 5*cellH + 18}" fill="#f59e0b" font-size="9" font-weight="900">ALIGNEMENT RÉPARTITEURS ENTRÉE</text>

          <!-- Convoyeurs et Splitters -->
          <g>${beltsSvg}${splittersSvg}</g>

          <!-- Badge Débit Entrée -->
          <g transform="translate(${splitPositions[0] - 80}, ${svgH - 46})">
            <rect width="160" height="26" rx="4" fill="#0f172a" stroke="#f59e0b" stroke-width="1.5" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.6))" />
            <text x="80" y="17" fill="#fef08a" font-size="9.5" font-weight="900" text-anchor="middle">📥 ARRIVÉE MINERAI SUD</text>
          </g>
        </svg>
      `;
    },

    // ÉTAPE 3 : VISUEL TOP-DOWN IMPLANTATION DES FONDERIES
    generateSmeltersStepSVG(results, smelters) {
      return this.generateTopDownFactoryBlueprintSVG(results, "step_smelters");
    },

    // ÉTAPE 4 : VISUEL TOP-DOWN IMPLANTATION DES CONSTRUCTEURS
    generateConstructorsStepSVG(results, constructors) {
      return this.generateTopDownFactoryBlueprintSVG(results, "step_constructors");
    },

    // ÉTAPE 5 : VISUEL TOP-DOWN IMPLANTATION DES ASSEMBLEUSES
    generateAssemblersStepSVG(results, assemblers) {
      return this.generateTopDownFactoryBlueprintSVG(results, "step_assemblers");
    },

    // ÉTAPE 6 : VISUEL TOP-DOWN RÉSEAU ÉLECTRIQUE & CÂBLAGE
    generatePowerStepSVG(results) {
      return this.generateTopDownFactoryBlueprintSVG(results, "step_power");
    },

    // ÉTAPE 7 : VISUEL TOP-DOWN EXPÉDITION & STOCKAGE FINAL
    generateStorageStepSVG(results) {
      return this.generateTopDownFactoryBlueprintSVG(results, "step_output_storage");
    },

    // Générateur Principal du Plan Top-Down 2D Complet / Étape
    generateTopDownFactoryBlueprintSVG(results, targetStepId = null) {
      const steps = results.productionSteps || [];
      const totalMachines = steps.reduce((sum, s) => sum + (s.physicalMachines || Math.ceil(s.machinesCount)), 0);
      const targetItem = (results.targets && results.targets[0]) || { item: "Produit Fini", rate: 10 };
      const targetName = ITEM_NAMES[targetItem.item] || targetItem.item;
      const rawResources = results.rawResources || {};

      const svgW = 680;
      const svgH = 680;
      const margin = 50;
      const gridW = svgW - margin * 2;
      const gridH = svgH - margin * 2;
      const cols = 6;
      const rows = 6;
      const cellW = gridW / cols;
      const cellH = gridH / rows;

      const colLetters = ["A", "B", "C", "D", "E", "F"];

      // 1. Grille des 36 Fondations (48m × 48m)
      let foundationsSvg = "";
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = margin + c * cellW;
          const y = margin + r * cellH;
          foundationsSvg += this.renderFoundationTile(x, y, cellW, cellH, colLetters[c], r + 1);
        }
      }

      // Repères d'axes A-F et 1-6
      let axesSvg = "";
      for (let c = 0; c < cols; c++) {
        axesSvg += `
          <text x="${margin + c * cellW + cellW/2}" y="${margin - 12}" fill="#38bdf8" font-size="11" font-weight="900" text-anchor="middle" font-family="monospace">${colLetters[c]} (8m)</text>
          <text x="${margin + c * cellW + cellW/2}" y="${svgH - margin + 20}" fill="#64748b" font-size="9" text-anchor="middle" font-family="monospace">${c*8}m - ${(c+1)*8}m</text>
        `;
      }
      for (let r = 0; r < rows; r++) {
        axesSvg += `
          <text x="${margin - 16}" y="${margin + r * cellH + cellH/2 + 4}" fill="#38bdf8" font-size="11" font-weight="900" text-anchor="middle" font-family="monospace">${r + 1}</text>
        `;
      }

      // Boussole Nord
      const compassSvg = `
        <g transform="translate(${svgW - 40}, 30)">
          <circle cx="0" cy="0" r="14" fill="#111827" stroke="#38bdf8" stroke-width="1.2" />
          <polygon points="0,-11 -4,3 0,0 4,3" fill="#ef4444" />
          <polygon points="0,11 -4,0 0,0 4,0" fill="#94a3b8" />
          <text x="0" y="-14" fill="#ef4444" font-size="9" font-weight="900" text-anchor="middle">N</text>
        </g>
      `;

      // Groupement des machines par tier
      const smelters = steps.filter(s => s.building && (s.building.id === "smelter" || s.building.id === "foundry"));
      const constructors = steps.filter(s => s.building && (s.building.id === "constructor" || s.building.id === "refinery"));
      const assemblers = steps.filter(s => s.building && (s.building.id === "assembler" || s.building.id === "manufacturer" || s.building.id === "blender"));

      // Détermination de l'opacité selon l'étape ciblée
      const isFull = !targetStepId || this.currentViewMode === "full";
      const getOpacity = (stepType) => {
        if (isFull) return 1;
        if (targetStepId === "step_foundations") return 0.2;
        if (targetStepId === "step_raw_logistics" && stepType === "raw") return 1;
        if (targetStepId === "step_smelters" && (stepType === "smelter" || stepType === "raw")) return 1;
        if (targetStepId === "step_constructors" && (stepType === "constructor" || stepType === "smelter" || stepType === "raw")) return 1;
        if (targetStepId === "step_assemblers" && (stepType === "assembler" || stepType === "constructor" || stepType === "smelter" || stepType === "raw")) return 1;
        if (targetStepId === "step_power") return 0.85;
        if (targetStepId === "step_output_storage") return 1;
        return 0.2;
      };

      let beltsSvg = "";
      let machinesSvg = "";
      let splittersSvg = "";
      let powerSvg = "";

      // -------------------------------------------------------------
      // 2. DISPOSITION DES FONDERIES (Ligne Sud / Rangée 5-6)
      // -------------------------------------------------------------
      const smeltCount = smelters.reduce((sum, s) => sum + (s.physicalMachines || Math.ceil(s.machinesCount)), 0);
      const displaySmelters = Math.min(smeltCount, 4);
      const smeltPositions = [];

      for (let i = 0; i < displaySmelters; i++) {
        const cIdx = 1 + i; // Colonnes B, C, D, E
        const mx = margin + cIdx * cellW + (cellW - 54) / 2;
        const my = margin + 4 * cellH + 6;
        smeltPositions.push({ x: mx, y: my, w: 54, h: 78, inX: mx + 27, inY: my + 78, outX: mx + 27, outY: my });
        
        const isStep = targetStepId === "step_smelters";
        machinesSvg += this.renderSpriteSmelter(mx, my, 54, 78, smelters[i % smelters.length] || {}, getOpacity("smelter"), isStep);

        // Répartiteur d'entrée en bas (Rangée 6)
        const splitY = margin + 5 * cellH + cellH/2;
        splittersSvg += this.renderSpriteSplitter(mx + 27, splitY, 24);
        
        // Convoyeur d'alimentation du Splitter vers la Fonderie
        beltsSvg += this.renderCurvedConveyor(`M ${mx + 27} ${splitY} L ${mx + 27} ${my + 78}`, "#f59e0b", 10);
      }

      // Ligne principale de minerai brut alimentant les splitters de fonderie
      if (smeltPositions.length > 0) {
        const firstSplitX = smeltPositions[0].inX;
        const lastSplitX = smeltPositions[smeltPositions.length - 1].inX;
        const splitY = margin + 5 * cellH + cellH/2;
        
        // Entrée depuis le bord Sud
        beltsSvg += this.renderCurvedConveyor(`M ${firstSplitX} ${svgH - 10} L ${firstSplitX} ${splitY}`, "#f59e0b", 12);
        // Manifold transversal
        if (lastSplitX > firstSplitX) {
          beltsSvg += this.renderCurvedConveyor(`M ${firstSplitX} ${splitY} L ${lastSplitX} ${splitY}`, "#f59e0b", 10);
        }
      }

      // -------------------------------------------------------------
      // 3. DISPOSITION DES CONSTRUCTEURS (Ligne Centre / Rangée 3-4)
      // -------------------------------------------------------------
      const constCount = constructors.reduce((sum, s) => sum + (s.physicalMachines || Math.ceil(s.machinesCount)), 0);
      const displayConst = Math.min(constCount, 4);
      const constPositions = [];

      for (let i = 0; i < displayConst; i++) {
        const cIdx = 1 + i;
        const mx = margin + cIdx * cellW + (cellW - 54) / 2;
        const my = margin + 2 * cellH + 6;
        constPositions.push({ x: mx, y: my, w: 54, h: 84, inX: mx + 27, inY: my + 84, outX: mx + 27, outY: my });

        const isStep = targetStepId === "step_constructors";
        machinesSvg += this.renderSpriteConstructor(mx, my, 54, 84, constructors[i % constructors.length] || {}, getOpacity("constructor"), isStep);

        // Groupeur de sortie des fonderies / Répartiteur d'entrée des constructeurs
        const interSplitY = margin + 3 * cellH + cellH/2;
        splittersSvg += this.renderSpriteMerger(mx + 27, interSplitY, 24);

        // Tapis reliant Fonderie ➔ Collecteur ➔ Constructeur
        if (i < smeltPositions.length) {
          beltsSvg += this.renderCurvedConveyor(`M ${smeltPositions[i].outX} ${smeltPositions[i].outY} L ${mx + 27} ${interSplitY}`, "#4ade80", 10);
        }
        beltsSvg += this.renderCurvedConveyor(`M ${mx + 27} ${interSplitY} L ${mx + 27} ${my + 84}`, "#38bdf8", 10);
      }

      // -------------------------------------------------------------
      // 4. DISPOSITION DES ASSEMBLEUSES (Ligne Nord / Rangée 1-2)
      // -------------------------------------------------------------
      const assCount = assemblers.reduce((sum, s) => sum + (s.physicalMachines || Math.ceil(s.machinesCount)), 0);
      const displayAss = Math.min(Math.max(assCount, (constructors.length > 0 ? 1 : 0)), 2);
      const assPositions = [];

      for (let i = 0; i < displayAss; i++) {
        const cIdx = 1 + i * 2.5; // Occupent 2 colonnes
        const mx = margin + cIdx * cellW + 6;
        const my = margin + 6;
        const assW = cellW * 2 - 12;
        const assH = cellH * 2 - 14;
        assPositions.push({ x: mx, y: my, w: assW, h: assH, inX1: mx + assW/2 - 13, inX2: mx + assW/2 + 13, inY: my + assH, outX: mx + assW/2, outY: my });

        const isStep = targetStepId === "step_assemblers";
        machinesSvg += this.renderSpriteAssembler(mx, my, assW, assH, assemblers[i % (assemblers.length || 1)] || { recipeName: targetName }, getOpacity("assembler"), isStep);

        // Convoyeurs courbés venant des constructeurs vers la double entrée de l'assembleuse
        if (constPositions.length >= 2) {
          const c1 = constPositions[Math.min(i*2, constPositions.length - 1)];
          const c2 = constPositions[Math.min(i*2 + 1, constPositions.length - 1)];
          
          // Courbe 1 (Gauche)
          beltsSvg += this.renderCurvedConveyor(`M ${c1.outX} ${c1.outY} Q ${c1.outX} ${my + assH + 15}, ${mx + assW/2 - 13} ${my + assH}`, "#a855f7", 10);
          // Courbe 2 (Droite)
          beltsSvg += this.renderCurvedConveyor(`M ${c2.outX} ${c2.outY} Q ${c2.outX} ${my + assH + 15}, ${mx + assW/2 + 13} ${my + assH}`, "#38bdf8", 10);
        } else if (constPositions.length === 1) {
          beltsSvg += this.renderCurvedConveyor(`M ${constPositions[0].outX} ${constPositions[0].outY} L ${mx + assW/2} ${my + assH}`, "#a855f7", 10);
        }
      }

      // -------------------------------------------------------------
      // 5. SORTIE FINALE & CONTENEUR INDUSTRIEL (Nord-Est / Colonne F)
      // -------------------------------------------------------------
      const storageX = margin + 5 * cellW + 6;
      const storageY = margin + 12;
      const isStorageStep = targetStepId === "step_output_storage";
      const storageGlow = isStorageStep ? `filter="drop-shadow(0 0 14px rgba(16, 185, 129, 0.8))"` : `filter="drop-shadow(0 4px 10px rgba(0,0,0,0.6))"`;

      const storageSvg = `
        <g transform="translate(${storageX}, ${storageY})" opacity="${getOpacity('storage')}" ${storageGlow} style="cursor: pointer;">
          <title>📦 Conteneur de Stockage Industriel&#10;🎯 Produit Fini : ${targetName}</title>
          <rect width="${cellW - 12}" height="68" rx="4" fill="#064e3b" stroke="${isStorageStep ? '#10b981' : '#047857'}" stroke-width="${isStorageStep ? 2 : 1.2}" />
          <!-- Nervures Container -->
          <line x1="10" y1="8" x2="10" y2="60" stroke="#047857" stroke-width="2" />
          <line x1="22" y1="8" x2="22" y2="60" stroke="#047857" stroke-width="2" />
          <line x1="34" y1="8" x2="34" y2="60" stroke="#047857" stroke-width="2" />
          <line x1="${cellW - 22}" y1="8" x2="${cellW - 22}" y2="60" stroke="#047857" stroke-width="2" />
          <!-- Header FICSIT Container -->
          <rect x="4" y="4" width="${cellW - 20}" height="12" rx="2" fill="#022c22" />
          <text x="${(cellW - 12)/2}" y="13" fill="#a7f3d0" font-size="7.5" font-weight="900" text-anchor="middle">STOCKAGE</text>
          <circle cx="12" cy="10" r="2.5" fill="#10b981" />
          <text x="${(cellW - 12)/2}" y="42" fill="#ffffff" font-size="8" font-weight="bold" text-anchor="middle">PRODUIT FINI</text>
          <!-- Port d'entrée du container -->
          <rect x="-3" y="26" width="6" height="16" rx="1.5" fill="#1e293b" stroke="#10b981" stroke-width="1" />
          <circle cx="0" cy="34" r="2" fill="#10b981" />
        </g>
      `;

      // Tapis final reliant l'assembleuse au conteneur
      if (assPositions.length > 0) {
        const lastAss = assPositions[assPositions.length - 1];
        beltsSvg += this.renderCurvedConveyor(`M ${lastAss.outX} ${lastAss.outY} Q ${lastAss.outX} ${storageY + 34}, ${storageX} ${storageY + 34}`, "#10b981", 12);
      }

      // -------------------------------------------------------------
      // 6. RÉSEAU ÉLECTRIQUE & PÔLES (Étape Power)
      // -------------------------------------------------------------
      const isPowerStep = targetStepId === "step_power";
      const pole1X = margin + 1 * cellW;
      const pole1Y = margin + 3 * cellH;
      const pole2X = margin + 5 * cellW;
      const pole2Y = margin + 3 * cellH;

      powerSvg += `
        <!-- Poteau Électrique Ouest -->
        <g transform="translate(${pole1X}, ${pole1Y})" opacity="${isPowerStep ? 1 : 0.4}">
          <circle cx="0" cy="0" r="10" fill="#111827" stroke="#f59e0b" stroke-width="1.8" />
          <circle cx="0" cy="0" r="4" fill="#f59e0b" filter="drop-shadow(0 0 6px #f59e0b)" />
          <text x="0" y="3.5" fill="#000" font-size="8" font-weight="900" text-anchor="middle">⚡</text>
        </g>
        <!-- Poteau Électrique Est -->
        <g transform="translate(${pole2X}, ${pole2Y})" opacity="${isPowerStep ? 1 : 0.4}">
          <circle cx="0" cy="0" r="10" fill="#111827" stroke="#f59e0b" stroke-width="1.8" />
          <circle cx="0" cy="0" r="4" fill="#f59e0b" filter="drop-shadow(0 0 6px #f59e0b)" />
          <text x="0" y="3.5" fill="#000" font-size="8" font-weight="900" text-anchor="middle">⚡</text>
        </g>
        <!-- Câbles d'alimentation vers machines -->
        <path d="M ${pole1X} ${pole1Y} Q ${margin + 3*cellW} ${margin + 3.2*cellH}, ${pole2X} ${pole2Y}" stroke="#f59e0b" stroke-width="1.8" stroke-dasharray="4,4" fill="none" opacity="${isPowerStep ? 1 : 0.35}" />
      `;

      if (isPowerStep) {
        smeltPositions.forEach(p => {
          powerSvg += `<path d="M ${pole1X} ${pole1Y} L ${p.x + p.w/2} ${p.y + p.h/2}" stroke="#f59e0b" stroke-width="1.2" stroke-dasharray="3,3" fill="none" opacity="0.8" />`;
        });
        constPositions.forEach(p => {
          powerSvg += `<path d="M ${pole1X} ${pole1Y} L ${p.x + p.w/2} ${p.y + p.h/2}" stroke="#f59e0b" stroke-width="1.2" stroke-dasharray="3,3" fill="none" opacity="0.8" />`;
        });
        assPositions.forEach(p => {
          powerSvg += `<path d="M ${pole2X} ${pole2Y} L ${p.x + p.w/2} ${p.y + p.h/2}" stroke="#f59e0b" stroke-width="1.2" stroke-dasharray="3,3" fill="none" opacity="0.8" />`;
        });
      }

      // Bannière d'en-tête du plan top-down
      const planTitle = isFull 
        ? `PLAN D'IMPLANTATION TOP-DOWN COMPLET (6×6 DALLES • 48m × 48m)` 
        : `PLAN D'IMPLANTATION : ÉTAPE ${this.currentStepIndex + 1}/${this.steps.length} (${(this.steps[this.currentStepIndex]?.tag || "").toUpperCase()})`;

      return `
        <svg viewBox="0 0 ${svgW} ${svgH}" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background: #060910; font-family: system-ui, sans-serif; user-select: none;">
          <defs>
            <!-- Gradient Foyer en fusion (Smelter Core) -->
            <radialGradient id="smelterCoreGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#ffffff" />
              <stop offset="25%" stop-color="#fef08a" />
              <stop offset="55%" stop-color="#f59e0b" />
              <stop offset="85%" stop-color="#ea580c" />
              <stop offset="100%" stop-color="#9a3412" stop-opacity="0.1" />
            </radialGradient>
            <!-- Gradient Verrière Assembleuse -->
            <linearGradient id="assemblerGlassGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="rgba(56, 189, 248, 0.35)" />
              <stop offset="100%" stop-color="rgba(14, 165, 233, 0.12)" />
            </linearGradient>
          </defs>

          <!-- Titre du plan -->
          <text x="${svgW/2}" y="24" fill="#38bdf8" font-size="12" font-weight="900" text-anchor="middle" letter-spacing="0.5">${planTitle}</text>
          <text x="${svgW/2}" y="38" fill="#94a3b8" font-size="9" text-anchor="middle">Placement exact sur la grille mondiale (Vue du dessus SCIM)</text>
          
          <!-- Boussole -->
          ${compassSvg}

          <!-- Grille Fondations & Axes -->
          <g id="blueprint-foundations-layer">
            ${foundationsSvg}
            ${axesSvg}
          </g>

          <!-- Réseau Logistique Convoyeurs & Splitters -->
          <g id="blueprint-belts-layer">
            ${beltsSvg}
            ${splittersSvg}
          </g>

          <!-- Machines & Usines Implantation -->
          <g id="blueprint-machines-layer">
            ${machinesSvg}
            ${storageSvg}
          </g>

          <!-- Réseau Électrique -->
          <g id="blueprint-power-layer">
            ${powerSvg}
          </g>
        </svg>
      `;
    },

    generateSteps(results) {
      this.lastResults = results;
      const steps = [];
      const totalMachines = results.productionSteps.reduce((sum, s) => sum + (s.physicalMachines || Math.ceil(s.machinesCount)), 0);
      const targetItem = results.targets[0] || { item: "Produit Fini", rate: 10 };
      const targetName = results.targets.length === 1 ? (ITEM_NAMES[targetItem.item] || targetItem.item) : results.targets.map(t => `${t.rate}/m ${ITEM_NAMES[t.item]||t.item}`).join(" + ");
      const rawResources = results.rawResources || {};

      // 1. Étape 1 : Fondations & Implantation Géodésique
      steps.push({
        id: "step_foundations",
        tag: "1. FONDATIONS & SOL",
        title: "1. Pose de la dalle de fondations 6×6 (48m × 48m)",
        desc: "Installez une dalle de fondation plane de 48m × 48m (6×6 dalles de 8m×8m) alignée sur la grille mondiale (touche Ctrl enfoncée).",
        details: `
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <div>📐 <strong>Dimensions :</strong> 6 dalles (A-F) × 6 dalles (1-6) = 36 fondations (2304 m²).</div>
            <div>🧭 <strong>Alignement :</strong> Placer la dalle face au Nord avec accès logistique dégagé au Sud.</div>
            <div>🧱 <strong>Type recommandé :</strong> Fondations béton 2m ou 4m pour cacher la tuyauterie et les convoyeurs.</div>
            <div>📍 <strong>Repères de pose :</strong> Colonnes A à F de gauche à droite, Lignes 1 (Nord) à 6 (Sud).</div>
          </div>
        `,
        shopping: [
          { name: "Béton", qty: 216, icon: "🧱" }
        ],
        svg: this.generateFoundationsStepSVG(results)
      });

      // 2. Étape 2 : Arrivées Minerais & Manifolds d'entrée
      const rawList = Object.entries(rawResources);
      const rawShopping = [];
      let rawSplittersCount = 0;
      rawList.forEach(([item, rate]) => {
        rawSplittersCount += Math.max(1, Math.ceil(rate / 60));
      });
      rawShopping.push({ name: "Plaque de fer (Tapis)", qty: 60, icon: "📦" });
      rawShopping.push({ name: "Plaque de fer renf. (Répartiteurs)", qty: rawSplittersCount * 2, icon: "⚙️" });

      steps.push({
        id: "step_raw_logistics",
        tag: "2. ARRIVÉES BRUTES",
        title: "2. Arrivées de minerais et pose des répartiteurs d'entrée",
        desc: "Amenez les flux de matières premières brutes au bord Sud de la dalle (Ligne 6) et posez la ligne de Répartiteurs (Splitters) en manifold.",
        details: `
          <div style="display: flex; flex-direction: column; gap: 6px;">
            ${rawList.map(([item, rate]) => {
              const belt = SatisfactoryFlowchart.getBeltTierInfo(rate);
              return `<div>📥 <strong>${ITEM_NAMES[item]||item} :</strong> <span style="color: #f59e0b; font-weight: bold;">${Math.round(rate*10)/10}/min</span> ➔ Tapis recommandé : <span style="color: ${belt.color}; font-weight: bold;">${belt.mk}</span>.</div>`;
            }).join("")}
            <div>🔀 <strong>Logistique :</strong> Aligner 1 Répartiteur orange sur chaque axe de machine en Dalle B6, C6, D6, E6.</div>
          </div>
        `,
        shopping: rawShopping,
        svg: this.generateRawLogisticsStepSVG(results)
      });

      // 3. Groupe Fonderies
      const smelters = results.productionSteps.filter(s => s.building && (s.building.id === "smelter" || s.building.id === "foundry"));
      if (smelters.length > 0) {
        const totalSmeltMachines = smelters.reduce((sum, s) => sum + (s.physicalMachines || Math.ceil(s.machinesCount)), 0);
        const smelterBld = smelters[0].building;
        const bldCost = BUILDINGS[smelterBld.id]?.cost || { "iron_rod": 8, "wire": 5 };
        const shopping = Object.entries(bldCost).map(([item, q]) => ({ name: ITEM_NAMES[item]||item, qty: q * totalSmeltMachines, icon: "🏭" }));

        steps.push({
          id: "step_smelters",
          tag: "3. FONDERIES",
          title: `3. Implantation des Fonderies (${totalSmeltMachines} machines)`,
          desc: "Posez la rangée de fonderies sur les fondations de Rangée 5 (B5, C5, D5...). Reliez les entrées aux splitters Sud et les sorties aux collecteurs Nord.",
          details: `
            <div style="display: flex; flex-direction: column; gap: 6px;">
              ${smelters.map(s => `<div>⚙️ <strong>${s.recipeName} :</strong> ${s.physicalMachines || Math.ceil(s.machinesCount)}× ${s.building.name} (@${s.overclock||100}%) ➔ Sortie : <span style="color: #4ade80; font-weight: bold;">+${Math.round(s.rateProduced*10)/10}/m ${ITEM_NAMES[s.itemId]||s.itemId}</span></div>`).join("")}
              <div>⚡ <strong>Puissance requise :</strong> <span style="color: #f59e0b; font-weight: bold;">${Math.round(smelters.reduce((sum, s) => sum + s.powerMW, 0)*10)/10} MW</span>.</div>
              <div>📍 <strong>Positionnement :</strong> Entrée face au Sud, sortie face au Nord vers la rangée 4.</div>
            </div>
          `,
          shopping: shopping,
          svg: this.generateSmeltersStepSVG(results, smelters)
        });
      }

      // 4. Groupe Constructeurs
      const constructors = results.productionSteps.filter(s => s.building && s.building.id === "constructor");
      if (constructors.length > 0) {
        const totalConstMachines = constructors.reduce((sum, s) => sum + (s.physicalMachines || Math.ceil(s.machinesCount)), 0);
        const constBld = constructors[0].building;
        const bldCost = BUILDINGS[constBld.id]?.cost || { "reinforced_iron_plate": 2, "cable": 8 };
        const shopping = Object.entries(bldCost).map(([item, q]) => ({ name: ITEM_NAMES[item]||item, qty: q * totalConstMachines, icon: "🏭" }));

        steps.push({
          id: "step_constructors",
          tag: "4. CONSTRUCTEURS",
          title: `4. Implantation des Constructeurs (${totalConstMachines} machines)`,
          desc: "Installez les constructeurs sur les dalles centrales de Rangée 3 (B3, C3, D3...). Connectez les lingots en entrée et regroupez les pièces usinées.",
          details: `
            <div style="display: flex; flex-direction: column; gap: 6px;">
              ${constructors.map(s => `<div>⚙️ <strong>${s.recipeName} :</strong> ${s.physicalMachines || Math.ceil(s.machinesCount)}× Constructeur (@${s.overclock||100}%) ➔ <span style="color: #38bdf8; font-weight: bold;">+${Math.round(s.rateProduced*10)/10}/m ${ITEM_NAMES[s.itemId]||s.itemId}</span></div>`).join("")}
              <div>⚡ <strong>Puissance requise :</strong> <span style="color: #f59e0b; font-weight: bold;">${Math.round(constructors.reduce((sum, s) => sum + s.powerMW, 0)*10)/10} MW</span>.</div>
              <div>📍 <strong>Positionnement :</strong> Entrée face aux collecteurs de fonderie (Sud), sortie orientée vers les assembleuses (Nord).</div>
            </div>
          `,
          shopping: shopping,
          svg: this.generateConstructorsStepSVG(results, constructors)
        });
      }

      // 5. Groupe Assembleuses / Façonneuses
      const assemblers = results.productionSteps.filter(s => s.building && (s.building.id === "assembler" || s.building.id === "manufacturer" || s.building.id === "refinery" || s.building.id === "blender"));
      if (assemblers.length > 0) {
        const totalAssMachines = assemblers.reduce((sum, s) => sum + (s.physicalMachines || Math.ceil(s.machinesCount)), 0);
        const assBld = assemblers[0].building;
        const bldCost = BUILDINGS[assBld.id]?.cost || { "modular_frame": 4, "rotor": 8 };
        const shopping = Object.entries(bldCost).map(([item, q]) => ({ name: ITEM_NAMES[item]||item, qty: q * totalAssMachines, icon: "🏭" }));

        steps.push({
          id: "step_assemblers",
          tag: "5. ASSEMBLAGE FINAL",
          title: `5. Implantation des Assembleuses (${totalAssMachines} machines)`,
          desc: "Positionnez les assembleuses finales sur les fondations Nord de Rangée 1-2 (B1-B2 & D1-D2). Raccordez les deux flux d'entrée via des convoyeurs courbés.",
          details: `
            <div style="display: flex; flex-direction: column; gap: 6px;">
              ${assemblers.map(s => `<div>⚙️ <strong>${s.recipeName} :</strong> ${s.physicalMachines || Math.ceil(s.machinesCount)}× ${s.building.name} (@${s.overclock||100}%) ➔ <span style="color: #a855f7; font-weight: bold;">+${Math.round(s.rateProduced*10)/10}/m ${ITEM_NAMES[s.itemId]||s.itemId}</span></div>`).join("")}
              <div>⚡ <strong>Puissance requise :</strong> <span style="color: #f59e0b; font-weight: bold;">${Math.round(assemblers.reduce((sum, s) => sum + s.powerMW, 0)*10)/10} MW</span>.</div>
              <div>📍 <strong>Empreinte :</strong> 2 dalles de large par assembleuse avec double arrivée de convoyeurs.</div>
            </div>
          `,
          shopping: shopping,
          svg: this.generateAssemblersStepSVG(results, assemblers)
        });
      }

      // 6. Étape Réseau Électrique
      const polesCount = Math.ceil(totalMachines / 3) + 2;
      steps.push({
        id: "step_power",
        tag: "6. ÉLECTRICITÉ",
        title: "6. Raccordement Électrique & Mise sous Tension",
        desc: "Posez les poteaux électriques aux intersections de fondations et câblez chaque machine vers le réseau général FICSIT.",
        details: `
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <div>⚡ <strong>Bilan Électrique Global :</strong> <span style="color: #f59e0b; font-weight: 800; font-size: 13px;">${results.totalPowerMW || 0} MW</span>.</div>
            <div>🔌 <strong>Poteaux / Prises recommandés :</strong> ${polesCount} Poteaux électriques Mk.1 ou Prises murales.</div>
            <div>💡 <strong>Implantation :</strong> 1 Pylône Ouest (Fondation A3) + 1 Pylône Est (Fondation F3) avec liaison guirlande centrale.</div>
          </div>
        `,
        shopping: [
          { name: "Câble", qty: polesCount * 6 + totalMachines * 3, icon: "⚡" },
          { name: "Tige de fer", qty: polesCount * 2, icon: "🔩" },
          { name: "Béton", qty: polesCount * 1, icon: "🧱" }
        ],
        svg: this.generatePowerStepSVG(results)
      });

      // 7. Étape Sortie & Stockage Fini
      steps.push({
        id: "step_output_storage",
        tag: "7. EXPÉDITION",
        title: "7. Sortie finale vers Stockage ou Broyeur A.W.E.S.O.M.E.",
        desc: "Raccordez la sortie de l'usine au Conteneur de Stockage Industriel (Dalle F1) ou vers votre réseau logistique principal.",
        details: `
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <div>🎯 <strong>Production Finale Nette :</strong> <span style="color: #10b981; font-weight: 900; font-size: 14px;">${targetName}</span>.</div>
            <div>📦 <strong>Stockage recommandé :</strong> 1 Conteneur de Stockage Industriel posé en Dalle F1-F2.</div>
            <div>✨ <strong>Validation de chaîne :</strong> Les machines doivent tourner en continu à 100% d'efficacité sans engorgement.</div>
          </div>
        `,
        shopping: [
          { name: "Plaque de fer renf.", qty: 10, icon: "📦" },
          { name: "Tige de fer", qty: 20, icon: "🔩" }
        ],
        svg: this.generateStorageStepSVG(results)
      });

      this.steps = steps;
      return steps;
    },

    renderCurrentStep() {
      if (this.steps.length === 0) return;
      const step = this.steps[this.currentStepIndex];
      if (!step) return;

      const badgeEl = document.getElementById("guide-step-counter-badge");
      const tagEl = document.getElementById("guide-step-tag");
      const titleEl = document.getElementById("guide-step-title");
      const descEl = document.getElementById("guide-step-description");
      const detailsEl = document.getElementById("guide-step-details-card");
      const shoppingEl = document.getElementById("guide-step-shopping-list");
      const svgViewport = document.getElementById("guide-step-svg-viewport");
      const progressFill = document.getElementById("guide-progress-bar-fill");
      const progressPct = document.getElementById("guide-progress-pct");
      const validateBtn = document.getElementById("btn-guide-validate-step");
      const toggleFullBtn = document.getElementById("btn-guide-toggle-full-view");

      if (badgeEl) badgeEl.innerText = `Étape ${this.currentStepIndex + 1} / ${this.steps.length}`;
      if (tagEl) tagEl.innerText = step.tag;
      if (titleEl) titleEl.innerText = step.title;
      if (descEl) descEl.innerText = step.desc;
      if (detailsEl) detailsEl.innerHTML = step.details;

      if (shoppingEl) {
        shoppingEl.innerHTML = step.shopping.map(s => `
          <div style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 4px; padding: 4px 8px; font-size: 11.5px; font-weight: bold; color: #a7f3d0; display: inline-flex; align-items: center; gap: 4px;">
            <span>${s.icon || "📦"}</span> ${s.qty}× ${s.name}
          </div>
        `).join("");
      }

      if (svgViewport) {
        if (this.currentViewMode === "full" && this.lastResults) {
          svgViewport.innerHTML = this.generateTopDownFactoryBlueprintSVG(this.lastResults, null);
        } else {
          svgViewport.innerHTML = step.svg;
        }
      }

      if (toggleFullBtn) {
        toggleFullBtn.innerText = this.currentViewMode === "full" ? "🎯 Vue Étape Ciblée" : "🗺️ Vue Usine Complète 2D";
        toggleFullBtn.style.background = this.currentViewMode === "full" ? "rgba(56, 189, 248, 0.2)" : "transparent";
      }

      // Progression
      const pct = Math.round(((this.validatedSteps.size) / Math.max(this.steps.length, 1)) * 100);
      if (progressFill) progressFill.style.width = `${pct}%`;
      if (progressPct) progressPct.innerText = `${pct}%`;

      // Bouton de validation
      const isDone = this.validatedSteps.has(step.id);
      if (validateBtn) {
        validateBtn.innerText = isDone ? "✅ Étape Validée (Fait)" : "✓ Valider cette étape";
        validateBtn.style.background = isDone ? "#059669" : "#10b981";
      }
    },

    init(results) {
      if (!results || !results.productionSteps || results.productionSteps.length === 0) {
        const section = document.getElementById("calc-construction-guide-section");
        if (section) section.style.display = "none";
        return;
      }

      const section = document.getElementById("calc-construction-guide-section");
      if (section) section.style.display = "block";

      this.lastResults = results;
      this.generateSteps(results);
      this.currentStepIndex = 0;
      this.currentViewMode = "step";
      this.renderCurrentStep();

      const prevBtn = document.getElementById("btn-guide-prev-step");
      const nextBtn = document.getElementById("btn-guide-next-step");
      const validateBtn = document.getElementById("btn-guide-validate-step");
      const toggleFullBtn = document.getElementById("btn-guide-toggle-full-view");
      const fullscreenBtn = document.getElementById("btn-guide-fullscreen");

      if (prevBtn) {
        prevBtn.onclick = () => {
          if (this.currentStepIndex > 0) {
            this.currentStepIndex--;
            this.renderCurrentStep();
          }
        };
      }

      if (nextBtn) {
        nextBtn.onclick = () => {
          if (this.currentStepIndex < this.steps.length - 1) {
            this.currentStepIndex++;
            this.renderCurrentStep();
          }
        };
      }

      if (toggleFullBtn) {
        toggleFullBtn.onclick = () => {
          this.currentViewMode = this.currentViewMode === "full" ? "step" : "full";
          this.renderCurrentStep();
        };
      }

      if (fullscreenBtn) {
        fullscreenBtn.onclick = () => {
          const targetItem = (results.targets && results.targets[0]) || { item: "Usine", rate: 10 };
          const targetName = ITEM_NAMES[targetItem.item] || targetItem.item;
          const svgContent = this.currentViewMode === "full"
            ? this.generateTopDownFactoryBlueprintSVG(results, null)
            : (this.steps[this.currentStepIndex] ? this.steps[this.currentStepIndex].svg : this.generateTopDownFactoryBlueprintSVG(results, null));
          openBlueprintModal(`📐 Plan d'Implantation Top-Down 2D : ${targetName}`, svgContent);
        };
      }

      if (validateBtn) {
        validateBtn.onclick = () => {
          const step = this.steps[this.currentStepIndex];
          if (step) {
            if (this.validatedSteps.has(step.id)) {
              this.validatedSteps.delete(step.id);
              showToast(`↺ Étape remise en cours : ${step.title}`);
            } else {
              this.validatedSteps.add(step.id);
              showToast(`✅ Étape validée : ${step.title}`);
              // Avancer à l'étape suivante si possible
              if (this.currentStepIndex < this.steps.length - 1) {
                this.currentStepIndex++;
              }
            }
            localStorage.setItem("ficsit_guide_validated", JSON.stringify(Array.from(this.validatedSteps)));
            this.renderCurrentStep();
          }
        };
      }
    }
  };

  function renderCalculationResults(results) {
    const tableBody = document.getElementById("calc-table-body");
    const rawResPanel = document.getElementById("calc-raw-resources");
    const buildingsPanel = document.getElementById("calc-buildings-summary");
    const powerTotalEl = document.getElementById("calc-total-power-val");
    const shardsEl = document.getElementById("calc-total-shards-val");
    const loopsEl = document.getElementById("calc-total-somersloops-val");
    const altSelectorContainer = document.getElementById("alt-recipes-selection");

    if (!tableBody) return;

    if (shardsEl) shardsEl.innerText = `${results.totalPowerShards || 0} éclat(s)`;
    if (loopsEl) loopsEl.innerText = `${results.totalSomersloops || 0} loop(s)`;

    // Organigramme interactif Satisfactory-Calculator (SCIM)
    const chainFlowEl = document.getElementById("calc-chain-flow");
    const flowViewport = document.getElementById("flowchart-viewport");

    if (chainFlowEl && results.productionSteps.length > 0) {
      chainFlowEl.style.display = "block";
      SatisfactoryFlowchart.initInteractive(flowViewport, results);

      const openGlobalPlanBtn = document.getElementById("btn-open-global-factory-plan");
      if (openGlobalPlanBtn) {
        openGlobalPlanBtn.onclick = () => {
          openBlueprintModal(`Organigramme de Production SCIM : ${ITEM_NAMES[results.targets[0]?.item] || "Produit Fini"}`, SatisfactoryFlowchart.generateSVG(results));
          SatisfactoryFlowchart.attachInteractivity(document.getElementById("modal-bp-dynamic-svg"), results);
        };
      }
    } else if (chainFlowEl) {
      chainFlowEl.style.display = "none";
    }

    // Micro-Usine Intégrée Mk.3 (Multi-Machines Tout-en-Un)
    const integratedSection = document.getElementById("calc-integrated-module-section");
    const integratedViewport = document.getElementById("integrated-blueprint-viewport");
    const integratedBadge = document.getElementById("integrated-module-count-badge");
    const integratedSummaryBar = document.getElementById("integrated-module-summary-bar");
    const toggleIntegratedBtn = document.getElementById("btn-toggle-integrated-view");

    if (integratedSection && results.productionSteps.length > 0) {
      integratedSection.style.display = "block";
      const totalMachines = results.productionSteps.reduce((sum, s) => sum + (s.physicalMachines || Math.ceil(s.machinesCount)), 0);
      const modulesNeeded = totalMachines <= 18 ? 1 : (totalMachines <= 36 ? 2 : Math.ceil(totalMachines / 18));
      
      if (integratedBadge) {
        integratedBadge.innerText = modulesNeeded === 1 ? "1 SEUL BLUEPRINT MK.3 TOUT-EN-UN" : `${modulesNeeded} BLUEPRINTS MK.3 COMBINÉS`;
        integratedBadge.style.background = modulesNeeded === 1 ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)";
        integratedBadge.style.borderColor = modulesNeeded === 1 ? "#10b981" : "#f59e0b";
        integratedBadge.style.color = modulesNeeded === 1 ? "#10b981" : "#f59e0b";
      }

      if (integratedViewport) {
        integratedViewport.innerHTML = generateIntegratedMultiMachineBlueprintSVG(results);
      }

      if (integratedSummaryBar) {
        const rawList = Object.entries(results.rawResources).map(([r, rate]) => `<span style="color: var(--ficsit-orange); font-weight: bold;">${Math.round(rate*10)/10}/m ${ITEM_NAMES[r]||r}</span>`).join(" + ");
        const targetItem = results.targets[0] || { item: "Produit Fini", rate: 10 };
        
        let builtCount = 0;
        results.productionSteps.forEach(st => {
          const count = st.physicalMachines || Math.ceil(st.machinesCount);
          for (let i = 1; i <= count; i++) {
            if (STATE.builtMachines.has(`${st.recipeId}_m${i}`)) builtCount++;
          }
        });
        const pct = Math.round((builtCount / Math.max(totalMachines, 1)) * 100);

        integratedSummaryBar.innerHTML = `
          <div>
            <strong>📥 Entrée Brute :</strong> ${rawList || "Matières directes"}
          </div>
          <div>
            <strong>⚙️ Machines Compactées :</strong> <span style="color: var(--ficsit-cyan); font-weight: bold;">${totalMachines} machines</span> (<strong style="color: #10b981;">${modulesNeeded} Mod. Mk.3</strong>)
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <strong>🔨 Suivi Chantier :</strong>
            <span style="color: ${builtCount === totalMachines ? '#4ade80' : '#38bdf8'}; font-weight: bold;">
              ${builtCount} / ${totalMachines} (${pct}%)
            </span>
            <button type="button" id="btn-reset-built-machines" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.2); color: #94a3b8; font-size: 10.5px; border-radius: 3px; padding: 2px 7px; cursor: pointer;">
              ↺ Tout décocher
            </button>
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <button type="button" id="btn-download-all-integrated-sbp" class="btn-ficsit" style="font-size: 11px; padding: 5px 12px; background: var(--ficsit-orange); color: #000; font-weight: 800; border-radius: 4px; display: inline-flex; align-items: center; gap: 5px; cursor: pointer; border: none; box-shadow: 0 2px 8px rgba(250,149,73,0.3);">
              📥 Télécharger Tout le Complexe (.sbp)
            </button>
          </div>
        `;

        const downloadAllComplexBtn = document.getElementById("btn-download-all-integrated-sbp");
        if (downloadAllComplexBtn) {
          downloadAllComplexBtn.onclick = async () => {
            try {
              downloadAllComplexBtn.disabled = true;
              downloadAllComplexBtn.innerText = "⏳ Génération des Blueprints...";

              let delay = 0;
              for (const mod of mk3Modules) {
                setTimeout(async () => {
                  const bldCount = {};
                  const materialsNeeded = {};
                  mod.steps.forEach(s => {
                    const bId = s.building?.id || "constructor";
                    const count = s.physicalMachines || Math.ceil(s.machinesCount) || 1;
                    bldCount[bId] = (bldCount[bId] || 0) + count;
                  });
                  materialsNeeded.concrete = (mod.machinesCount * 12) + 80;
                  materialsNeeded.iron_plate = (mod.machinesCount * 8);
                  materialsNeeded.wire = (mod.machinesCount * 6);

                  const bpPayload = {
                    id: `bp_calc_${(targetItem.item || 'module').replace(/[^a-zA-Z0-9_]/g, '_')}_mod${mod.num}`,
                    title: mod.title,
                    name: mod.title,
                    category: "production",
                    designerSize: "6x6 Fondations (Designer Mk.3)",
                    description: `Plan généré automatiquement depuis le calculateur pour ${targetName} (${mod.outputStr}).\nPuissance: ${Math.round(mod.powerMW)} MW.`,
                    inputs: [mod.rawInputs],
                    outputs: [mod.outputStr],
                    powerMW: Math.round(mod.powerMW),
                    buildingsCount: bldCount,
                    materialsNeeded: materialsNeeded
                  };

                  const files = await BlueprintFileGenerator.generateFiles(bpPayload);
                  BlueprintFileGenerator.downloadBlob(files.sbpBlob, files.sbpFilename);
                  setTimeout(() => {
                    BlueprintFileGenerator.downloadBlob(files.sbpcfgBlob, files.sbpcfgFilename);
                  }, 100);
                }, delay);
                delay += 300;
              }

              showToast(`Export de tous les blueprints du complexe lancé !`);
            } catch(err) {
              console.error(err);
              showToast(`Erreur export : ${err.message}`);
            } finally {
              downloadAllComplexBtn.disabled = false;
              downloadAllComplexBtn.innerHTML = "📥 Télécharger Tout le Complexe (.sbp)";
            }
          };
        }

        const resetBuiltBtn = document.getElementById("btn-reset-built-machines");
        if (resetBuiltBtn) {
          resetBuiltBtn.onclick = () => {
            STATE.builtMachines.clear();
            saveState();
            renderCalculationResults(results);
            showToast("Suivi du chantier réinitialisé (0 machine construite).");
          };
        }
      }

      if (integratedViewport) {
        attachMachineInteractivity(integratedViewport);
      }

      if (toggleIntegratedBtn) {
        toggleIntegratedBtn.onclick = () => {
          openBlueprintModal(`Micro-Usine Intégrée Mk.3 Tout-en-Un : ${results.targets[0] ? (ITEM_NAMES[results.targets[0].item] || results.targets[0].item) : "Produit Fini"}`, generateIntegratedMultiMachineBlueprintSVG(results));
        };
      }
    } else if (integratedSection) {
      integratedSection.style.display = "none";
    }

    // 1. Remplissage du tableau des Plans Blueprint Mk.3 Tout-en-Un (Multi-Machines Intégrés)
    const targetItem = results.targets[0] || { item: "Produit Fini", rate: 10 };
    const targetName = ITEM_NAMES[targetItem.item] || targetItem.item;
    const totalMachines = results.productionSteps.reduce((sum, s) => sum + (s.physicalMachines || Math.ceil(s.machinesCount)), 0);
    const rawListStr = Object.entries(results.rawResources).map(([r, rate]) => `${Math.round(rate*10)/10}/m ${ITEM_NAMES[r]||r}`).join(" + ") || "Matières directes";

    // Découpage en Modules Mk.3 (18 machines max par module sur grille 6x6)
    const modulesNeeded = totalMachines <= 18 ? 1 : Math.ceil(totalMachines / 18);
    const mk3Modules = [];

    if (modulesNeeded === 1) {
      // 1 Seul Module Tout-en-Un
      mk3Modules.push({
        num: 1,
        title: `Plan Mk.3 #1 : Micro-Usine Intégrée [${targetName}]`,
        subtitle: `Module 100% Autonome : Minerais Bruts ➔ ${targetName} direct`,
        steps: results.productionSteps,
        machinesCount: totalMachines,
        powerMW: results.totalPowerMW,
        rawInputs: rawListStr,
        outputStr: `+${targetItem.rate}/min ${targetName}`,
        isAllInOne: true
      });
    } else {
      // Découpage intelligent par modules Mk.3 (6x6)
      let currentSteps = [];
      let currentCount = 0;
      let mIdx = 1;

      results.productionSteps.forEach((st, idx) => {
        const count = st.physicalMachines || Math.ceil(st.machinesCount);
        if (currentCount + count > 18 && currentSteps.length > 0) {
          mk3Modules.push({
            num: mIdx,
            title: `Plan Mk.3 #${mIdx} : Module Intermédiaire [${currentSteps.map(s => s.recipeName).join(" + ")}]`,
            subtitle: `Étage / Section #${mIdx} : Préparation & Usinage`,
            steps: [...currentSteps],
            machinesCount: currentCount,
            powerMW: currentSteps.reduce((sum, s) => sum + s.powerMW, 0),
            rawInputs: mIdx === 1 ? rawListStr : "Alimenté par Module précédent",
            outputStr: `➔ Vers Module #${mIdx + 1}`,
            isAllInOne: false
          });
          mIdx++;
          currentSteps = [];
          currentCount = 0;
        }
        currentSteps.push(st);
        currentCount += count;
      });

      if (currentSteps.length > 0) {
        mk3Modules.push({
          num: mIdx,
          title: `Plan Mk.3 #${mIdx} : Module Final [${targetName}]`,
          subtitle: `Étage / Section Finale : Assemblage et Sortie Produit Fini`,
          steps: [...currentSteps],
          machinesCount: currentCount,
          powerMW: currentSteps.reduce((sum, s) => sum + s.powerMW, 0),
          rawInputs: "Alimenté par Module(s) précédent(s)",
          outputStr: `+${targetItem.rate}/min ${targetName}`,
          isAllInOne: false
        });
      }
    }

    const calcData = results;

    tableBody.innerHTML = mk3Modules.map((mod, modIdx) => {
      const stepGridId = `step-lego-grid-mod-${modIdx}`;
      const modData = { ...calcData, productionSteps: mod.steps };

      // Liste des machines compactées dans ce module
      const machinesListHtml = mod.steps.map(s => {
        const pCount = s.physicalMachines || Math.ceil(s.machinesCount);
        const clock = s.overclock || 100;
        const b = s.building || { name: "Machine", icon: "🏭" };
        return `
          <div style="margin-bottom: 4px;">
            <span style="color: var(--ficsit-cyan); font-weight: bold;">${b.icon} ${pCount}× ${b.name}</span>
            <span style="color: var(--text-secondary); font-size: 11px;">(${s.recipeName} @ ${clock}%)</span>
          </div>
        `;
      }).join("");

      return `
        <tr>
          <td>
            <div style="font-size: 13.5px; font-weight: 800; color: #38bdf8; display: flex; align-items: center; gap: 6px;">
              🏛️ ${mod.title}
            </div>
            <div style="font-size: 11px; color: var(--text-muted); margin-top: 3px;">
              ${mod.subtitle}
            </div>
            <div style="margin-top: 6px;">
              <span style="background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; color: #a7f3d0; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 3px; display: inline-block;">
                📐 Designer Mk.3 (6×6 - 48m × 48m)
              </span>
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px;">
              <button type="button" class="btn-ficsit btn-download-calc-sbp" data-mod-idx="${modIdx}" style="font-size: 11px; padding: 5px 12px; background: var(--ficsit-orange); color: #000; font-weight: 800; border-radius: 4px; display: inline-flex; align-items: center; gap: 5px; cursor: pointer; border: none;">
                📥 Télécharger (.sbp/.sbpcfg)
              </button>
              <button type="button" class="btn-outline btn-open-step-mk3-modal" onclick="window.openMk3PlanModal(${modIdx})" data-mod-idx="${modIdx}" style="font-size: 11px; padding: 5px 12px; border-color: #38bdf8; background: rgba(56, 189, 248, 0.12); color: #38bdf8; font-weight: bold; border-radius: 4px; display: inline-flex; align-items: center; gap: 5px; cursor: pointer;">
                📐 Ouvrir le Plan Mk.3 HD
              </button>
              <button type="button" class="btn-outline btn-toggle-calc-grid" data-target="${stepGridId}" style="font-size: 10.5px; padding: 4px 10px; border-color: rgba(255, 255, 255, 0.2); color: var(--text-secondary); cursor: pointer;">
                ↕️ Déplier le Schéma
              </button>
            </div>
          </td>
          <td>
            <div style="font-weight: 700; margin-bottom: 6px; color: #f8fafc;">
              📦 ${mod.machinesCount} Machine(s) Intégrée(s) :
            </div>
            ${machinesListHtml}
            <div style="font-size: 10.5px; color: var(--text-muted); margin-top: 4px;">
              Occupation : <strong style="color: #10b981;">${mod.machinesCount} / 18 max</strong>
            </div>
          </td>
          <td>
            <div style="margin-bottom: 6px;">
              <div style="font-size: 11px; color: var(--ficsit-orange); font-weight: 700;">📥 Entrées Requises :</div>
              <div style="font-size: 12px; font-weight: 600; color: #fef3c7;">${mod.rawInputs}</div>
            </div>
            <div>
              <div style="font-size: 11px; color: var(--ficsit-green); font-weight: 700;">📤 Sortie Nette :</div>
              <div style="font-size: 13px; font-weight: 900; color: #4ade80;">${mod.outputStr}</div>
            </div>
          </td>
          <td>
            <div style="color: var(--ficsit-amber); font-size: 14px; font-weight: 800;">
              ⚡ ${Math.round(mod.powerMW * 10) / 10} MW
            </div>
            <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">
              Convoyeurs : <strong style="color: var(--ficsit-cyan);">Mk.2 / Mk.3</strong>
            </div>
          </td>
        </tr>
        <tr id="${stepGridId}" class="calc-step-grid-row" style="display: none;">
          <td colspan="4" style="padding: 10px 14px; background: rgba(0,0,0,0.4);">
            <div style="border-radius: 6px; overflow: hidden; border: 1px solid rgba(56, 189, 248, 0.3); height: 440px;">
              ${generateIntegratedMultiMachineBlueprintSVG(modData)}
            </div>
          </td>
        </tr>
      `;
    }).join("");

    // Écouteurs de téléchargement SBP direct depuis le calculateur
    tableBody.querySelectorAll(".btn-download-calc-sbp").forEach(btn => {
      btn.onclick = async () => {
        const modIdx = parseInt(btn.getAttribute("data-mod-idx"), 10);
        const mod = mk3Modules[modIdx];
        if (!mod) return;

        try {
          btn.disabled = true;
          btn.innerText = "⏳ Génération...";

          const bldCount = {};
          const materialsNeeded = {};

          mod.steps.forEach(s => {
            const bId = s.building?.id || "constructor";
            const count = s.physicalMachines || Math.ceil(s.machinesCount) || 1;
            bldCount[bId] = (bldCount[bId] || 0) + count;
          });

          materialsNeeded.concrete = (mod.machinesCount * 12) + 80;
          materialsNeeded.iron_plate = (mod.machinesCount * 8);
          materialsNeeded.wire = (mod.machinesCount * 6);

          const bpPayload = {
            id: `bp_calc_${(targetItem.item || 'module').replace(/[^a-zA-Z0-9_]/g, '_')}_mod${mod.num}`,
            title: mod.title,
            name: mod.title,
            category: "production",
            designerSize: "6x6 Fondations (Designer Mk.3)",
            description: `Plan généré automatiquement depuis le calculateur pour ${targetName} (${mod.outputStr}).\nPuissance: ${Math.round(mod.powerMW)} MW.`,
            inputs: [mod.rawInputs],
            outputs: [mod.outputStr],
            powerMW: Math.round(mod.powerMW),
            buildingsCount: bldCount,
            materialsNeeded: materialsNeeded
          };

          const files = await BlueprintFileGenerator.generateFiles(bpPayload);
          BlueprintFileGenerator.downloadBlob(files.sbpBlob, files.sbpFilename);
          setTimeout(() => {
            BlueprintFileGenerator.downloadBlob(files.sbpcfgBlob, files.sbpcfgFilename);
          }, 100);

          showToast(`Blueprint ${mod.title} téléchargé (.sbp/.sbpcfg) !`);
        } catch(err) {
          console.error(err);
          showToast(`Erreur génération : ${err.message}`);
        } finally {
          btn.disabled = false;
          btn.innerHTML = "📥 Télécharger (.sbp/.sbpcfg)";
        }
      };
    });

    // Écouteurs de bascule des grilles LEGO du calculateur
    tableBody.querySelectorAll(".btn-toggle-calc-grid").forEach(btn => {
      btn.addEventListener("click", () => {
        const targetId = btn.getAttribute("data-target");
        const row = document.getElementById(targetId);
        if (row) {
          const isHidden = row.style.display === "none";
          row.style.display = isHidden ? "table-row" : "none";
          btn.style.background = isHidden ? "rgba(75, 179, 253, 0.2)" : "";
        }
      });
    });

    const deployAllStepsBtn = document.getElementById("btn-deploy-all-steps");
    if (deployAllStepsBtn) {
      deployAllStepsBtn.onclick = () => {
        const rows = tableBody.querySelectorAll(".calc-step-grid-row");
        const anyHidden = Array.from(rows).some(r => r.style.display === "none");
        rows.forEach(r => r.style.display = anyHidden ? "table-row" : "none");
        deployAllStepsBtn.textContent = anyHidden ? "🗺️ Replier Tous les Plans de la Chaîne" : "🗺️ Déployer Tous les Plans de la Chaîne";
      };
    }

    // Écouteurs de clic sur les images ou schémas dynamiques pour ouvrir la modale Lightbox
    tableBody.querySelectorAll(".bp-img-preview-box").forEach(box => {
      box.addEventListener("click", () => {
        const isDynamic = box.getAttribute("data-dynamic-svg") === "true";
        const imgSrc = box.getAttribute("data-img");
        const title = box.getAttribute("data-title") || "Plan FICSIT Dynamique";
        const modal = document.getElementById("blueprint-img-modal");
        const modalImg = document.getElementById("modal-bp-img");
        const modalSvgContainer = document.getElementById("modal-bp-dynamic-svg");
        const modalTitle = document.getElementById("modal-bp-title");
        const closeBtn = document.getElementById("modal-bp-close");

        if (modal) {
          if (modalTitle) modalTitle.textContent = title;

          if (isDynamic && modalSvgContainer) {
            const svgEl = box.querySelector("svg");
            if (svgEl) {
              modalSvgContainer.innerHTML = svgEl.outerHTML;
              modalSvgContainer.style.display = "block";
              if (modalImg) modalImg.style.display = "none";
            }
          } else if (modalImg && imgSrc) {
            modalImg.src = imgSrc;
            modalImg.style.display = "block";
            if (modalSvgContainer) modalSvgContainer.style.display = "none";
          }

          modal.style.display = "flex";

          const closeModal = () => { modal.style.display = "none"; };
          if (closeBtn) closeBtn.onclick = closeModal;
          modal.onclick = (e) => { if (e.target === modal) closeModal(); };
        }
      });
    });

    // Attacher l'interactivité (clic & survol) aux schémas d'étapes
    attachMachineInteractivity(tableBody);

    // 2. Matières premières brutes
    rawResPanel.innerHTML = Object.entries(results.rawResources).map(([rawItem, rate]) => {
      return `
        <div class="resource-row">
          <span>${ITEM_NAMES[rawItem] || rawItem}</span>
          <span class="resource-val">${Math.round(rate * 10) / 10} / min</span>
        </div>
      `;
    }).join("") || "<div style='color: var(--text-muted); font-size: 13px;'>Aucune matière brute requise directement.</div>";

    // 3. Sommaire des Bâtiments
    buildingsPanel.innerHTML = Object.entries(results.buildingTotals).map(([bId, count]) => {
      const b = BUILDINGS[bId] || { name: bId, icon: "🏭" };
      return `
        <div class="resource-row">
          <span>${b.icon} ${b.name}</span>
          <span class="resource-val">${count} unité(s)</span>
        </div>
      `;
    }).join("");

    // 4. Puissance électrique totale
    if (powerTotalEl) {
      powerTotalEl.innerText = `${results.totalPowerMW} MW`;
    }

    // 5. Sélecteur interactif des Recettes Alternatives pour chaque composant
    if (altSelectorContainer) {
      const relevantItems = results.productionSteps.map(s => s.itemId);
      const uniqueItems = Array.from(new Set(relevantItems));

      altSelectorContainer.innerHTML = uniqueItems.map(itemId => {
        const availableRecipes = calculator.getRecipesForItem(itemId);
        if (availableRecipes.length <= 1) return ""; // Pas d'alternative disponible

        const currentActive = calculator.getActiveRecipe(itemId);

        const optionsHtml = availableRecipes.map(r => {
          const isSelected = currentActive && currentActive.id === r.id;
          return `<option value="${r.id}" ${isSelected ? "selected" : ""}>${r.name} ${r.isAlt ? "★ (Alt)" : ""}</option>`;
        }).join("");

        return `
          <div class="form-group" style="margin-bottom: 10px;">
            <label class="form-label">${ITEM_NAMES[itemId] || itemId}</label>
            <select class="form-control alt-recipe-select" data-item="${itemId}">
              ${optionsHtml}
            </select>
          </div>
        `;
      }).filter(Boolean).join("");

      // Écouter les changements d'alternatives
      document.querySelectorAll(".alt-recipe-select").forEach(select => {
        select.addEventListener("change", (e) => {
          const it = e.target.getAttribute("data-item");
          const recId = e.target.value;
          calculator.setRecipeForItem(it, recId);
          if (calculator.isAltRecipe(recId)) {
            STATE.activeAltRecipes[it] = recId;
          } else {
            delete STATE.activeAltRecipes[it];
          }
          saveState();
          executeCalculation();
          showToast(`Recette mise à jour pour ${ITEM_NAMES[it] || it}`);
        });
      });
    }

    // Mise à jour du badge du nombre d'alternatives actives
    const activeCount = Object.keys(STATE.activeAltRecipes || {}).filter(k => calculator.isAltRecipe(STATE.activeAltRecipes[k])).length;
    const countBadge = document.getElementById("badge-active-alt-count");
    if (countBadge) {
      countBadge.innerText = `${activeCount} active(s)`;
      countBadge.style.color = activeCount > 0 ? "var(--ficsit-orange)" : "var(--text-muted)";
      countBadge.style.borderColor = activeCount > 0 ? "var(--ficsit-orange)" : "var(--border-subtle)";
    }

    // 4. Initialisation du Guide de Chantier Pas-à-Pas Interactif
    FactoryConstructionGuide.init(results);
  }

  // =========================================================================
  // GESTIONNAIRE & SÉLECTEUR AVANCÉ DE RECETTES ALTERNATIVES FICSIT (MODAL)
  // =========================================================================
  const AltRecipesManager = {
    currentFilter: "current",
    searchQuery: "",
    isInitialized: false,

    init() {
      if (this.isInitialized) return;
      this.isInitialized = true;

      const openBtn = document.getElementById("btn-open-alt-recipes-modal");
      const closeBtn = document.getElementById("btn-close-alt-modal");
      const applyBtn = document.getElementById("btn-apply-alt-modal");
      const modal = document.getElementById("alt-recipes-manager-modal");
      const searchInput = document.getElementById("alt-modal-search-input");
      const filterBtns = document.querySelectorAll(".alt-modal-filter-btn");
      const optBtn = document.getElementById("btn-modal-opt-alts");
      const resetBtn = document.getElementById("btn-modal-reset-alts");

      if (openBtn) {
        openBtn.addEventListener("click", () => {
          this.open("current");
        });
      }

      if (closeBtn) {
        closeBtn.addEventListener("click", () => {
          this.close();
        });
      }

      if (applyBtn) {
        applyBtn.addEventListener("click", () => {
          this.close();
          executeCalculation();
          showToast("Recettes alternatives appliquées avec succès !");
        });
      }

      if (modal) {
        modal.addEventListener("click", (e) => {
          if (e.target === modal) {
            this.close();
          }
        });
      }

      if (searchInput) {
        searchInput.addEventListener("input", (e) => {
          this.searchQuery = e.target.value.toLowerCase().trim();
          this.render();
        });
      }

      filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
          filterBtns.forEach(b => {
            b.style.background = "var(--bg-surface-elevated)";
            b.style.color = "var(--text-secondary)";
            b.style.border = "1px solid var(--border-subtle)";
          });
          btn.style.background = "var(--ficsit-orange)";
          btn.style.color = "#000";
          btn.style.border = "none";
          this.currentFilter = btn.getAttribute("data-filter") || "current";
          this.render();
        });
      });

      if (optBtn) {
        optBtn.addEventListener("click", () => {
          executeOptimization();
          this.render();
          showToast("⚡ Optimisation IA appliquée aux recettes alternatives !");
        });
      }

      if (resetBtn) {
        resetBtn.addEventListener("click", () => {
          calculator.initDefaultRecipes();
          STATE.activeAltRecipes = {};
          saveState();
          this.render();
          executeCalculation();
          showToast("↺ Toutes les recettes ont été réinitialisées aux standards.");
        });
      }
    },

    open(filter = "current") {
      this.init();
      this.currentFilter = filter;
      const modal = document.getElementById("alt-recipes-manager-modal");
      const searchInput = document.getElementById("alt-modal-search-input");
      if (searchInput) searchInput.value = "";
      this.searchQuery = "";

      const filterBtns = document.querySelectorAll(".alt-modal-filter-btn");
      filterBtns.forEach(btn => {
        const f = btn.getAttribute("data-filter");
        if (f === filter) {
          btn.style.background = "var(--ficsit-orange)";
          btn.style.color = "#000";
          btn.style.border = "none";
        } else {
          btn.style.background = "var(--bg-surface-elevated)";
          btn.style.color = "var(--text-secondary)";
          btn.style.border = "1px solid var(--border-subtle)";
        }
      });

      if (modal) {
        modal.style.display = "flex";
      }
      this.render();
    },

    close() {
      const modal = document.getElementById("alt-recipes-manager-modal");
      if (modal) {
        modal.style.display = "none";
      }
    },

    render() {
      const grid = document.getElementById("alt-modal-recipes-grid");
      if (!grid) return;

      // 1. Déterminer la liste des items candidats avec alternatives
      let candidateItems = [];

      if (this.currentFilter === "current" && STATE.lastCalculation?.productionSteps) {
        const currentItems = STATE.lastCalculation.productionSteps.map(s => s.itemId);
        candidateItems = Array.from(new Set(currentItems)).filter(itemId => {
          return calculator.getRecipesForItem(itemId).length > 1;
        });
      } else if (this.currentFilter === "active") {
        const activeItems = Object.keys(STATE.activeAltRecipes || {}).filter(itemId => {
          return calculator.isAltRecipe(STATE.activeAltRecipes[itemId]);
        });
        candidateItems = Array.from(new Set(activeItems));
      } else {
        // "all" ou fallback
        const allItemsWithAlts = [];
        calculator.recipes.forEach(r => {
          r.products.forEach(p => {
            if (calculator.getRecipesForItem(p.item).length > 1 && !allItemsWithAlts.includes(p.item)) {
              allItemsWithAlts.push(p.item);
            }
          });
        });
        candidateItems = allItemsWithAlts;
      }

      // Si le filtre actuel est "current" mais ne donne aucun item (ou aucun calcul actif), fallback sur tous
      if (this.currentFilter === "current" && candidateItems.length === 0) {
        calculator.recipes.forEach(r => {
          r.products.forEach(p => {
            if (calculator.getRecipesForItem(p.item).length > 1 && !candidateItems.includes(p.item)) {
              candidateItems.push(p.item);
            }
          });
        });
      }

      // 2. Filtrage par recherche
      if (this.searchQuery) {
        const q = this.searchQuery;
        candidateItems = candidateItems.filter(itemId => {
          const itemName = (ITEM_NAMES[itemId] || itemId).toLowerCase();
          const recipes = calculator.getRecipesForItem(itemId);
          const recipeNames = recipes.map(r => r.name.toLowerCase()).join(" ");
          const ingredients = recipes.flatMap(r => r.ingredients.map(i => (ITEM_NAMES[i.item] || i.item).toLowerCase())).join(" ");
          return itemName.includes(q) || recipeNames.includes(q) || ingredients.includes(q);
        });
      }

      if (candidateItems.length === 0) {
        grid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px; color: var(--text-muted);">
            <div style="font-size: 36px; margin-bottom: 10px;">🔍</div>
            <div style="font-family: var(--font-display); font-size: 15px; color: var(--text-secondary); margin-bottom: 6px;">
              Aucune recette trouvée pour ces critères
            </div>
            <div style="font-size: 12px;">Essayez un autre mot-clé ou cliquez sur l'onglet <strong>🌐 Tous les Produits</strong>.</div>
          </div>
        `;
        return;
      }

      grid.innerHTML = candidateItems.map(itemId => {
        const recipes = calculator.getRecipesForItem(itemId);
        const activeRecipe = calculator.getActiveRecipe(itemId);
        const itemName = ITEM_NAMES[itemId] || itemId;
        const hasActiveAlt = activeRecipe && activeRecipe.isAlt;

        const recipesCardsHtml = recipes.map(r => {
          const isSelected = activeRecipe && activeRecipe.id === r.id;
          const building = BUILDINGS[r.building] || { name: r.building, icon: "🏭", powerMW: 4 };

          const ingrStr = r.ingredients.map(ing => {
            const ingRate = Math.round((ing.amount * (60 / r.duration)) * 10) / 10;
            return `<span style="display: inline-block; background: rgba(0,0,0,0.35); padding: 2px 6px; border-radius: 4px; font-size: 11px; margin: 2px;">📥 <strong>${ingRate}/min</strong> ${ITEM_NAMES[ing.item] || ing.item}</span>`;
          }).join(" ");

          const prod = r.products.find(p => p.item === itemId) || r.products[0];
          const prodRate = prod ? Math.round((prod.amount * (60 / r.duration)) * 10) / 10 : 0;

          return `
            <div class="alt-recipe-card" data-item="${itemId}" data-recipe-id="${r.id}" style="border: ${isSelected ? '2px solid var(--ficsit-orange)' : '1px solid var(--border-subtle)'}; background: ${isSelected ? 'rgba(250, 149, 73, 0.12)' : 'rgba(0,0,0,0.3)'}; border-radius: var(--radius-sm); padding: 10px 12px; cursor: pointer; transition: all 0.15s ease; margin-bottom: 8px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <input type="radio" name="radio_item_${itemId}" value="${r.id}" ${isSelected ? "checked" : ""} style="accent-color: var(--ficsit-orange); cursor: pointer;">
                  <strong style="font-size: 13px; color: ${isSelected ? 'var(--ficsit-orange)' : 'var(--text-primary)'};">
                    ${r.name}
                  </strong>
                </div>
                <span style="font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px; background: ${r.isAlt ? 'rgba(250, 149, 73, 0.25)' : 'rgba(75, 179, 253, 0.2)'}; color: ${r.isAlt ? 'var(--ficsit-orange)' : 'var(--ficsit-blue)'}; border: 1px solid ${r.isAlt ? 'rgba(250,149,73,0.5)' : 'rgba(75,179,253,0.5)'};">
                  ${r.isAlt ? '★ ALTERNATIVE' : 'OFFICIELLE / STD'}
                </span>
              </div>

              <div style="font-size: 11.5px; color: var(--text-secondary); margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
                <span>${building.icon} ${building.name} (${r.duration}s/cycle)</span>
                <span style="color: #4ade80; font-weight: 700;">📤 +${prodRate}/min</span>
              </div>

              <div style="display: flex; flex-wrap: wrap; gap: 2px; align-items: center;">
                ${ingrStr}
              </div>
            </div>
          `;
        }).join("");

        return `
          <div style="background: var(--bg-surface-elevated); border: 1px solid ${hasActiveAlt ? 'rgba(250, 149, 73, 0.5)' : 'var(--border-subtle)'}; border-radius: var(--radius-sm); padding: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 8px;">
              <div>
                <h4 style="margin: 0; font-size: 14px; font-weight: 800; color: #fff;">
                  ⚙️ ${itemName}
                </h4>
                <span style="font-size: 11px; color: var(--text-muted);">${recipes.length} procédé(s) disponible(s)</span>
              </div>
              ${hasActiveAlt ? '<span style="background: rgba(250,149,73,0.2); border: 1px solid var(--ficsit-orange); color: var(--ficsit-orange); font-size: 10px; font-weight: 800; padding: 2px 7px; border-radius: 4px;">★ ALT ACTIVE</span>' : '<span style="color: var(--text-muted); font-size: 11px;">Standard</span>'}
            </div>
            <div>
              ${recipesCardsHtml}
            </div>
          </div>
        `;
      }).join("");

      // Écouter les clics sur les cartes de recettes
      grid.querySelectorAll(".alt-recipe-card").forEach(card => {
        card.addEventListener("click", () => {
          const itemId = card.getAttribute("data-item");
          const recipeId = card.getAttribute("data-recipe-id");
          if (!itemId || !recipeId) return;

          calculator.setRecipeForItem(itemId, recipeId);
          if (calculator.isAltRecipe(recipeId)) {
            STATE.activeAltRecipes[itemId] = recipeId;
          } else {
            delete STATE.activeAltRecipes[itemId];
          }
          saveState();

          // Mettre à jour l'affichage dans le modal
          AltRecipesManager.render();

          // Mettre à jour le badge de comptage dans l'en-tête
          const activeCount = Object.keys(STATE.activeAltRecipes || {}).filter(k => calculator.isAltRecipe(STATE.activeAltRecipes[k])).length;
          const countBadge = document.getElementById("badge-active-alt-count");
          if (countBadge) {
            countBadge.innerText = `${activeCount} active(s)`;
            countBadge.style.color = activeCount > 0 ? "var(--ficsit-orange)" : "var(--text-muted)";
            countBadge.style.borderColor = activeCount > 0 ? "var(--ficsit-orange)" : "var(--border-subtle)";
          }

          showToast(`Procédé mis à jour : ${ITEM_NAMES[itemId] || itemId}`);
        });
      });
    }
  };

  // =========================================================================
  // CATALOGUE DE PLANS & BLUEPRINTS (.SBP / .SBPCFG NATIVE ENGINE)
  // =========================================================================

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

  async function compressZlibStream(uint8Arr) {
    if (typeof CompressionStream !== 'undefined') {
      const cs = new CompressionStream('deflate');
      const writer = cs.writable.getWriter();
      writer.write(uint8Arr);
      writer.close();
      const response = new Response(cs.readable);
      const arrayBuffer = await response.arrayBuffer();
      return new Uint8Array(arrayBuffer);
    }
    throw new Error('CompressionStream non supporté.');
  }

  const BlueprintFileGenerator = {
    async generateFiles(bp) {
      let sizeX = 4, sizeY = 4, sizeZ = 4;
      if (bp.designerSize && bp.designerSize.includes('5x5')) {
        sizeX = 5; sizeY = 5; sizeZ = 5;
      } else if (bp.designerSize && bp.designerSize.includes('6x6')) {
        sizeX = 6; sizeY = 6; sizeZ = 6;
      }

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

      const buildings = [];
      const halfSpan = sizeX * 400;
      const step = 800;

      // Plateforme 8x4 complète
      for (let x = -halfSpan + 400; x <= halfSpan - 400; x += step) {
        for (let y = -halfSpan + 400; y <= halfSpan - 400; y += step) {
          buildings.push({
            className: UOBJECT_CLASSES.foundation_8x4,
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
            rot: [0, 0, 0, 1],
            scale: [1, 1, 1]
          });
          machineIndex++;
        }
      });

      // Pylone central
      buildings.push({
        className: UOBJECT_CLASSES.powerpole,
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
            item: ITEM_DESC_CLASSES[mat] || `/Game/FactoryGame/Resource/Parts/Concrete/Desc_Concrete.Desc_Concrete_C`,
            amount: qty
          });
        });
      } else {
        costs.push({ item: ITEM_DESC_CLASSES.concrete, amount: 80 });
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

      // Total Body
      const totalBodyPayload = new Uint8Array(objHeaderBuf.length + propBuf.length);
      totalBodyPayload.set(objHeaderBuf, 0);
      totalBodyPayload.set(propBuf, objHeaderBuf.length);

      const bodyWriter = new BlueprintBinaryWriter();
      bodyWriter.writeInt32(totalBodyPayload.length + 4);
      bodyWriter.writeInt32(objHeaderBuf.length);
      bodyWriter.writeBuffer(totalBodyPayload);

      const uncompressedBody = bodyWriter.getUint8Array();
      const compressedBody = await compressZlibStream(uncompressedBody);

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

  function renderBlueprints() {
    const filterBar = document.getElementById("bp-filters-bar");
    const downloadAllBtn = document.getElementById("btn-download-all-bp");

    if (filterBar) {
      filterBar.querySelectorAll(".bp-filter-btn").forEach(btn => {
        btn.onclick = () => {
          currentBlueprintCategory = btn.getAttribute("data-cat");
          filterBar.querySelectorAll(".bp-filter-btn").forEach(b => {
            if (b.getAttribute("data-cat") === currentBlueprintCategory) {
              b.className = "btn-ficsit bp-filter-btn";
            } else {
              b.className = "btn-outline bp-filter-btn";
            }
          });
          renderBlueprintCards();
        };
      });
    }

    if (downloadAllBtn) {
      downloadAllBtn.onclick = async () => {
        showToast("Téléchargement du pack complet des Blueprints (.sbp)...");
        let delay = 0;
        for (const bp of BLUEPRINTS_DATA) {
          setTimeout(async () => {
            const files = await BlueprintFileGenerator.generateFiles(bp);
            BlueprintFileGenerator.downloadBlob(files.sbpBlob, files.sbpFilename);
            setTimeout(() => {
              BlueprintFileGenerator.downloadBlob(files.sbpcfgBlob, files.sbpcfgFilename);
            }, 100);
          }, delay);
          delay += 250;
        }
      };
    }

    const downloadScimBtn = document.getElementById("btn-download-scim-megabp");
    const downloadCbpBtn = document.getElementById("btn-download-scim-cbp");

    if (downloadCbpBtn) {
      downloadCbpBtn.onclick = () => {
        const cbpPayload = {
          formatVersion: 2,
          type: "megablueprint",
          name: "Grand Campus 1900 des Cascades",
          author: "FICSIT Imperial Architecture",
          gameVersion: "1.0+",
          data: {
            blueprintName: "🏛️ Le Grand Campus Industriel 1900 des Cascades",
            targetBiome: "Western Waterfall Plateau / Prairies Verdoyantes",
            worldCoordinates: { x: -145200.0, y: 185600.0, z: 8500.0, rotationYaw: 90.0 },
            dimensions: { widthMeters: 320, lengthMeters: 280, heightMeters: 64, footprint: "40x35 Fondations" },
            buildingsCount: 184,
            powerConsumptionMW: 324,
            subStructures: [
              "Grand Dôme Central & Tour Horloge (QG & HUB)",
              "Palais des Hauts Fourneaux d'Art (8 Fonderies 240/min)",
              "Manufacture d'Estampage & Tiges (8 Constructeurs)",
              "Grande Halle des Rotors & Assemblage (4 Assembleuses)",
              "Grande Gare Cathédrale Multivoies (1-4)",
              "Réseau de Ponts Suspendus & Viaducs des Cascades"
            ]
          }
        };

        const cbpBlob = new Blob([JSON.stringify(cbpPayload, null, 2)], { type: "application/octet-stream" });
        BlueprintFileGenerator.downloadBlob(cbpBlob, "Campus_1900_Cascades.cbp");
        showToast("Fichier MegaBlueprint (.cbp) téléchargé pour Satisfactory-Calculator !");
      };
    }

    if (downloadScimBtn) {
      downloadScimBtn.onclick = () => {
        const scimData = {
          scimVersion: "1.0+",
          blueprintName: "🏛️ Le Grand Campus Industriel 1900 des Cascades (MegaBlueprint)",
          author: "FICSIT Imperial Architecture & Engineering",
          gameVersion: "Satisfactory 1.0",
          category: "Mega-Structures & Industrial Complexes",
          targetBiome: "Western Waterfall Plateau / Prairies Verdoyantes",
          worldCoordinates: {
            x: -145200.0,
            y: 185600.0,
            z: 8500.0,
            rotationYaw: 90.0
          },
          dimensions: {
            widthMeters: 320,
            lengthMeters: 280,
            heightMeters: 64,
            foundationFootprint: "40x35 Fondations"
          },
          summary: {
            totalBuildings: 184,
            totalPowerConsumptionMW: 324,
            totalSmeltingCapacity: "240 lingots/min",
            totalAssemblyCapacity: "10 plaques renforcées/min + 8 rotors/min",
            trainStationType: "Gare Multivoies 1-4 sous Verrière Cathédrale avec 8 Tampons Industriels"
          }
        };

        const jsonBlob = new Blob([JSON.stringify(scimData, null, 2)], { type: "application/json" });
        BlueprintFileGenerator.downloadBlob(jsonBlob, "Campus_1900_Cascades_MegaBlueprint_SCIM.json");
        showToast("MegaBlueprint SCIM téléchargé ! Prêt pour satisfactory-calculator.com");
      };
    }

    renderBlueprintCards();
  }

  function renderBlueprintCards() {
    const container = document.getElementById("bp-grid-container");
    if (!container) return;

    const filtered = currentBlueprintCategory === "all"
      ? BLUEPRINTS_DATA
      : BLUEPRINTS_DATA.filter(bp => bp.category === currentBlueprintCategory);

    container.innerHTML = filtered.map(bp => {
      const bld = BUILDINGS[bp.buildingId] || { name: "Machine", icon: "🏭" };
      const dim = bp.dimensions || { x: 3, y: 3, z: 2 };
      const dimsStr = bp.designerSize || `${dim.x * 8}m × ${dim.y * 8}m (${dim.x}x${dim.y} fondations)`;

      return `
        <div class="blueprint-card" data-cat="${bp.category}">
          <div class="bp-card-header">
            <div>
              <div class="bp-card-title">${bp.title || bp.name}</div>
              <div class="bp-card-sub">${(bp.category || '').toUpperCase()} • ${dimsStr}</div>
            </div>
            <span class="badge-ficsit">${bld.icon} ${bp.buildingsCount ? Object.values(bp.buildingsCount)[0] : 1}x</span>
          </div>
          <div class="bp-card-body">
            <p style="font-size: 12px; color: var(--text-secondary); margin: 0 0 10px 0;">${bp.description || ""}</p>
            <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 12px;">
              <div>⚡ Puissance : <strong>${bp.powerMW || 0} MW</strong></div>
              <div>📦 Sortie : <strong>${bp.rateProduced || (bp.outputs ? bp.outputs[0] : 'N/A')}</strong></div>
            </div>
            <div style="display: flex; gap: 8px;">
              <button class="btn-ficsit btn-download-bp-single" data-bpid="${bp.id}" style="flex: 1; font-size: 11.5px; padding: 6px;">
                📥 Télécharger (.sbp/.sbpcfg)
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");

    container.querySelectorAll(".btn-download-bp-single").forEach(btn => {
      btn.onclick = async () => {
        const bpId = btn.getAttribute("data-bpid");
        const bp = BLUEPRINTS_DATA.find(b => b.id === bpId);
        if (bp) {
          try {
            btn.disabled = true;
            btn.innerText = "⏳ Génération...";
            const files = await BlueprintFileGenerator.generateFiles(bp);
            BlueprintFileGenerator.downloadBlob(files.sbpBlob, files.sbpFilename);
            setTimeout(() => {
              BlueprintFileGenerator.downloadBlob(files.sbpcfgBlob, files.sbpcfgFilename);
            }, 100);
            showToast(`Blueprint natif généré : ${bp.title || bp.name}`);
          } catch(err) {
            console.error(err);
            showToast(`Erreur de génération : ${err.message}`);
          } finally {
            btn.disabled = false;
            btn.innerText = "📥 Télécharger (.sbp/.sbpcfg)";
          }
        }
      };
    });
  }

  function generateDynamicBlueprintSVG(step) {
    const exactCount = Math.ceil(step.machinesCount) || 1;
    const bld = step.building || { name: "Machine", icon: "🏭", id: "constructor" };
    const prodRate = Math.round(step.rateProduced * 10) / 10;
    const itemName = ITEM_NAMES[step.itemId] || step.itemId;
    const ingr = step.ingredients || [];
    const mainIng = ingr[0] || { item: "ingr", rate: prodRate };
    const mainIngName = ITEM_NAMES[mainIng.item] || mainIng.item;
    const mainIngRate = Math.round(mainIng.rate * 10) / 10;

    const totalStepPower = Math.round(step.powerMW * 10) / 10;

    // Dimensions du canevas CAD
    const svgWidth = 920;
    const svgHeight = 560;

    // Dimensions & coordonnées de la zone de grille Mk.3 (6x6 Fondations = 48m x 48m)
    const gridX = 70;
    const gridY = 85;
    const gridW = 780;
    const gridH = 390;
    const cellW = gridW / 6; // 6 colonnes (A à F)
    const cellH = gridH / 6; // 6 lignes (1 à 6)

    // Calcul de la densité maximale Mk.3 par type de machine
    let maxSingleFloor = 8;
    if (bld.id === "smelter") maxSingleFloor = 12;
    else if (bld.id === "foundry") maxSingleFloor = 8;
    else if (bld.id === "constructor") maxSingleFloor = 10;
    else if (bld.id === "assembler") maxSingleFloor = 6;
    else if (bld.id === "manufacturer" || bld.id === "blender") maxSingleFloor = 4;
    else if (bld.id === "refinery") maxSingleFloor = 4;

    const isMultiFloor = exactCount > maxSingleFloor;
    const displayCount = isMultiFloor ? Math.min(exactCount, maxSingleFloor * 2) : exactCount;

    // Répartition en 2 rangées symétriques pour compacité maximale
    let cols = Math.min(6, Math.ceil(displayCount / 2));
    let rows = displayCount > 1 ? 2 : 1;
    if (displayCount === 1) { cols = 1; rows = 1; }

    const perColW = gridW / Math.max(cols, 1);
    const rowY1 = gridY + gridH * 0.28;
    const rowY2 = gridY + gridH * 0.72;

    const machW = Math.min(96, perColW - 16);
    const machH = rows === 1 ? 95 : 72;

    // 1. Fond de grille 6x6 Fondations FICSIT Mk.3 avec repères A-F et 1-6
    let gridTilesSvg = "";
    const colLetters = ["A", "B", "C", "D", "E", "F"];
    for (let c = 0; c < 6; c++) {
      for (let r = 0; r < 6; r++) {
        const x = gridX + c * cellW;
        const y = gridY + r * cellH;
        gridTilesSvg += `
          <rect x="${x}" y="${y}" width="${cellW}" height="${cellH}" fill="#0a101b" stroke="rgba(56, 189, 248, 0.09)" stroke-width="1" />
          <line x1="${x + cellW / 2}" y1="${y}" x2="${x + cellW / 2}" y2="${y + cellH}" stroke="rgba(56, 189, 248, 0.03)" stroke-width="1" stroke-dasharray="2,2" />
          <line x1="${x}" y1="${y + cellH / 2}" x2="${x + cellW}" y2="${y + cellH / 2}" stroke="rgba(56, 189, 248, 0.03)" stroke-width="1" stroke-dasharray="2,2" />
        `;
      }
      // Marqueurs de colonnes (A à F)
      gridTilesSvg += `
        <text x="${gridX + c * cellW + cellW / 2}" y="${gridY - 8}" fill="#38bdf8" font-size="10" font-weight="800" text-anchor="middle" font-family="monospace">${colLetters[c]} (8m)</text>
      `;
    }
    // Marqueurs de lignes (1 à 6)
    for (let r = 0; r < 6; r++) {
      gridTilesSvg += `
        <text x="${gridX - 12}" y="${gridY + r * cellH + cellH / 2 + 3.5}" fill="#38bdf8" font-size="10" font-weight="800" text-anchor="middle" font-family="monospace">${r + 1}</text>
      `;
    }

    // 2. Bus d'alimentation & Collecteur d'évacuation
    const busInY = gridY + 18;
    const busOutY = gridY + gridH - 18;

    let conveyorsSvg = `
      <!-- Collecteur Principal Entrée (Manifold In) -->
      <path d="M ${gridX - 25} ${busInY} L ${gridX + gridW - 20} ${busInY}" stroke="#f59e0b" stroke-width="4" fill="none" stroke-linecap="round" />
      <polygon points="${gridX - 20},${busInY} ${gridX - 30},${busInY - 4} ${gridX - 30},${busInY + 4}" fill="#f59e0b" />
      
      <!-- Collecteur Principal Sortie (Manifold Out) -->
      <path d="M ${gridX + 20} ${busOutY} L ${gridX + gridW + 25} ${busOutY}" stroke="#10b981" stroke-width="4" fill="none" stroke-linecap="round" />
      <polygon points="${gridX + gridW + 30},${busOutY} ${gridX + gridW + 20},${busOutY - 4} ${gridX + gridW + 20},${busOutY + 4}" fill="#10b981" />

      <!-- Badges Débit Entrée & Sortie -->
      <g transform="translate(${gridX - 45}, ${busInY - 26})">
        <rect width="180" height="20" rx="4" fill="#0f172a" stroke="#f59e0b" stroke-width="1.2" />
        <text x="90" y="14" fill="#fef3c7" font-size="9.5" font-weight="bold" text-anchor="middle" font-family="monospace">📥 IN: ${mainIngRate}/min ${mainIngName}</text>
      </g>
      <g transform="translate(${gridX + gridW - 135}, ${busOutY + 8})">
        <rect width="180" height="20" rx="4" fill="#0f172a" stroke="#10b981" stroke-width="1.2" />
        <text x="90" y="14" fill="#d1fae5" font-size="9.5" font-weight="bold" text-anchor="middle" font-family="monospace">📤 OUT: ${prodRate}/min ${itemName}</text>
      </g>
    `;

    // 3. Rendu des Machines Compactées avec Splitters [S] et Mergers [G]
    let machinesSvg = "";
    let splittersSvg = "";
    let mergersSvg = "";

    const perMachIn = Math.round((mainIngRate / exactCount) * 10) / 10;
    const perMachOut = Math.round((prodRate / exactCount) * 10) / 10;

    for (let i = 0; i < displayCount; i++) {
      const isSecondRow = rows > 1 && i >= cols;
      const colIdx = isSecondRow ? (i - cols) : i;

      const cx = gridX + colIdx * perColW + perColW / 2;
      const cy = isSecondRow ? rowY2 : rowY1;

      const machUniqueKey = `${step.recipeId}_m${i + 1}`;
      const isBuilt = STATE.builtMachines && STATE.builtMachines.has(machUniqueKey);
      const linkOp = isBuilt ? "0.22" : "1";
      const spStroke = isBuilt ? "#065f46" : "#f59e0b";
      const mgStroke = isBuilt ? "#065f46" : "#10b981";

      // Splitter [S]
      const spY = isSecondRow ? (cy - machH / 2 - 18) : (busInY + 16);
      splittersSvg += `
        <line class="mach-link-line mach-in-${machUniqueKey}" x1="${cx}" y1="${busInY}" x2="${cx}" y2="${cy - machH / 2}" stroke="${spStroke}" stroke-width="2" stroke-dasharray="${isBuilt ? '3,3' : 'none'}" stroke-linecap="round" opacity="${linkOp}" />
        <polygon class="mach-link-arrow mach-in-${machUniqueKey}" points="${cx},${cy - machH / 2} ${cx - 3},${cy - machH / 2 - 4} ${cx + 3},${cy - machH / 2 - 4}" fill="${spStroke}" opacity="${linkOp}" />
        <rect class="mach-link-line mach-in-${machUniqueKey}" x="${cx - 9}" y="${spY - 7}" width="18" height="14" rx="2" fill="#0f172a" stroke="${isBuilt ? '#065f46' : '#38bdf8'}" stroke-width="1.2" opacity="${linkOp}" />
        <text class="mach-link-line mach-in-${machUniqueKey}" x="${cx}" y="${spY + 3.5}" fill="${isBuilt ? '#a7f3d0' : '#38bdf8'}" font-size="7.5" font-weight="900" text-anchor="middle" font-family="monospace" opacity="${linkOp}">S${i + 1}</text>
      `;

      // Merger [G]
      const mgY = isSecondRow ? (busOutY - 16) : (cy + machH / 2 + 18);
      mergersSvg += `
        <line class="mach-link-line mach-out-${machUniqueKey}" x1="${cx}" y1="${cy + machH / 2}" x2="${cx}" y2="${busOutY}" stroke="${mgStroke}" stroke-width="2" stroke-dasharray="${isBuilt ? '3,3' : 'none'}" stroke-linecap="round" opacity="${linkOp}" />
        <polygon class="mach-link-arrow mach-out-${machUniqueKey}" points="${cx},${busOutY} ${cx - 3},${busOutY - 4} ${cx + 3},${busOutY - 4}" fill="${mgStroke}" opacity="${linkOp}" />
        <rect class="mach-link-line mach-out-${machUniqueKey}" x="${cx - 9}" y="${mgY - 7}" width="18" height="14" rx="2" fill="#0f172a" stroke="${isBuilt ? '#065f46' : '#10b981'}" stroke-width="1.2" opacity="${linkOp}" />
        <text class="mach-link-line mach-out-${machUniqueKey}" x="${cx}" y="${mgY + 3.5}" fill="${isBuilt ? '#a7f3d0' : '#10b981'}" font-size="7.5" font-weight="900" text-anchor="middle" font-family="monospace" opacity="${linkOp}">G${i + 1}</text>
      `;

      // Silhouette Machine Mk.3 Épurée
      const machOpacity = isBuilt ? "0.32" : "1";
      const machBorder = isBuilt ? "#10b981" : "#38bdf8";

      const perMachInList = step.ingredients.map(ing => {
        const r = Math.round((ing.rate / exactCount) * 10) / 10;
        const name = ITEM_NAMES[ing.item] || ing.item;
        return `${r}/min ${name}`;
      });
      const inputsDetailStr = perMachInList.join(" + ") || "Minerais bruts";
      const outputDetailStr = `+${perMachOut}/min ${itemName}`;
      const powerPerMach = Math.round((totalStepPower / exactCount) * 10) / 10;

      machinesSvg += `
        <g class="svg-clickable-machine" data-mach-key="${machUniqueKey}" data-item-id="${step.itemId}" data-inputs="${step.ingredients.map(i => i.item).join(',')}" data-inputs-detail="${inputsDetailStr}" data-output-detail="${outputDetailStr}" data-power-val="${powerPerMach} MW" data-mach-name="${bld.name} #${i + 1} (${step.recipeName})" style="cursor: pointer; transition: opacity 0.2s;" opacity="${machOpacity}">
          <title>🏭 ${bld.name} #${i + 1} (${step.recipeName})&#10;📥 ENTRÉES : ${inputsDetailStr}&#10;📤 SORTIE : ${outputDetailStr}&#10;⚡ PUISSANCE : ${powerPerMach} MW</title>
          <!-- Ombre portée & Corps principal -->
          <rect x="${cx - machW / 2}" y="${cy - machH / 2}" width="${machW}" height="${machH}" rx="5" fill="${isBuilt ? '#050e17' : '#111827'}" stroke="${machBorder}" stroke-width="${isBuilt ? '1.8' : '1.4'}" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.6))" />
          
          <!-- Bandeau En-Tête -->
          <rect x="${cx - machW / 2}" y="${cy - machH / 2}" width="${machW}" height="18" rx="5" fill="${isBuilt ? '#064e3b' : '#1e293b'}" />
          <rect x="${cx - machW / 2}" y="${cy - machH / 2 + 12}" width="${machW}" height="6" fill="${isBuilt ? '#064e3b' : '#1e293b'}" />
          <text x="${cx - machW / 2 + 6}" y="${cy - machH / 2 + 12.5}" fill="${isBuilt ? '#a7f3d0' : '#38bdf8'}" font-size="8.5" font-weight="800" font-family="sans-serif">${isBuilt ? '✅' : bld.icon} #${i + 1}</text>
          <text x="${cx + machW / 2 - 6}" y="${cy - machH / 2 + 12.5}" fill="#94a3b8" font-size="7.5" font-weight="bold" text-anchor="end" font-family="monospace">${isBuilt ? '✓ FAIT' : '⬇️ POSE'}</text>

          <!-- Données de Process -->
          <text x="${cx}" y="${cy + 2}" fill="${isBuilt ? '#64748b' : '#ffffff'}" font-size="9" font-weight="800" text-anchor="middle" font-family="sans-serif" ${isBuilt ? 'text-decoration="line-through"' : ''}>${step.recipeName}</text>
          <text x="${cx}" y="${cy + 15}" fill="#10b981" font-size="8.5" font-weight="900" text-anchor="middle" font-family="monospace">${isBuilt ? '✓ CONSTRUITE' : `📤 +${perMachOut}/m`}</text>
          <text x="${cx}" y="${cy + 26}" fill="#f59e0b" font-size="7.5" text-anchor="middle" font-family="monospace">📥 -${perMachIn}/m</text>

          <!-- Ports In/Out -->
          <circle cx="${cx}" cy="${cy - machH / 2}" r="3" fill="${isBuilt ? '#10b981' : '#f59e0b'}" stroke="#0a101b" stroke-width="1.5" />
          <circle cx="${cx}" cy="${cy + machH / 2}" r="3" fill="#10b981" stroke="#0a101b" stroke-width="1.5" />
        </g>
      `;
    }

    // 4. Cartouche FICSIT CAD Mk.3 Officiel & Légende
    return `
      <svg viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto; max-height: 72vh; aspect-ratio: ${svgWidth} / ${svgHeight}; border-radius: 6px; background: #060a12; font-family: system-ui, -apple-system, sans-serif; display: block;">
        <defs>
          <pattern id="cadGridSmall" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255, 255, 255, 0.02)" stroke-width="0.8"/>
          </pattern>
        </defs>

        <!-- Fond grille millimétrique -->
        <rect width="${svgWidth}" height="${svgHeight}" fill="url(#cadGridSmall)" />

        <!-- Cadre Technique FICSIT Blueprint Mk.3 -->
        <rect x="12" y="12" width="${svgWidth - 24}" height="${svgHeight - 24}" rx="4" fill="none" stroke="#1e293b" stroke-width="1.5" />
        <rect x="16" y="16" width="${svgWidth - 32}" height="${svgHeight - 32}" fill="none" stroke="rgba(56, 189, 248, 0.2)" stroke-width="1" />

        <!-- En-Tête Cartouche Officiel Mk.3 -->
        <rect x="22" y="22" width="${svgWidth - 44}" height="42" rx="3" fill="#0c1322" stroke="rgba(56, 189, 248, 0.4)" stroke-width="1" />
        <text x="36" y="44" fill="#fa9549" font-size="12.5" font-weight="900" letter-spacing="1">
          📐 PLAN VECTORIEL MK.3 (48m × 48m) : ${exactCount} × ${bld.name.toUpperCase()}
        </text>
        <text x="36" y="57" fill="#94a3b8" font-size="10">
          Recette : <tspan fill="#ffffff" font-weight="bold">${step.recipeName}</tspan> | Puissance Étape : <tspan fill="#f59e0b" font-weight="bold">${totalStepPower} MW</tspan> | Grille : <tspan fill="#38bdf8" font-weight="bold">6x6 Fondations Mk.3</tspan>
        </text>

        <!-- Badge Statut Capacité Maximale -->
        <g transform="translate(${svgWidth - 230}, 28)">
          <rect width="195" height="30" rx="3" fill="#091b2c" stroke="#38bdf8" stroke-width="1" />
          <text x="97" y="14" fill="#38bdf8" font-size="9" font-weight="bold" text-anchor="middle" font-family="monospace">CAPACITÉ MK.3 : OPTIMALE</text>
          <text x="97" y="24.5" fill="#f8fafc" font-size="8" text-anchor="middle">${isMultiFloor ? "Double Étage Vertical (+12m)" : "Simple Étage Plein Pied"}</text>
        </g>

        <!-- Grille 6x6 Fondations -->
        ${gridTilesSvg}

        <!-- Réseau de Convoyeurs & Manifolds -->
        ${conveyorsSvg}
        ${splittersSvg}
        ${mergersSvg}
        ${machinesSvg}

        <!-- Pied de Page CAD & Échelle -->
        <line x1="22" y1="${svgHeight - 48}" x2="${svgWidth - 22}" y2="${svgHeight - 48}" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
        <text x="30" y="${svgHeight - 28}" fill="#64748b" font-size="9.5" font-family="monospace">
          ÉCHELLE 1:100 // STANDARD BLUEPRINT DESIGNER MK.3 (6x6) // CADENCE PRODUITE : ${prodRate} ${itemName.toUpperCase()}/MIN
        </text>
        <text x="${svgWidth - 30}" y="${svgHeight - 28}" fill="#38bdf8" font-size="9.5" font-weight="bold" text-anchor="end" font-family="monospace">
          FICSIT ENGINEERING PROTOCOL 1.2
        </text>
      </svg>
    `;
  }

  function renderStepLegoGrid(step) {
    const exactCount = Math.ceil(step.machinesCount);
    const bld = step.building || { name: "Machine", icon: "🏭" };
    const prodRate = Math.round(step.rateProduced * 10) / 10;
    const ingrList = step.ingredients.map(i => `<span style="color: var(--ficsit-cyan); font-weight: 700;">${Math.round(i.rate*10)/10}/min</span> ${ITEM_NAMES[i.item]||i.item}`).join(", ");

    const dynamicSvg = generateDynamicBlueprintSVG(step);

    let inputDesc = "1 Tapis d'arrivée ➔ Répartiteurs en cascade ➔ Entrées des machines";
    let orientationText = "Orientées vers l'avant (⬇️ Entrée en haut, ⬇️ Sortie en bas)";
    let layoutDiagram = `
      <div style="font-family: var(--font-mono, monospace); font-size: 11px; line-height: 1.6; background: rgba(0,0,0,0.6); padding: 8px 12px; border-radius: 4px; border: 1px solid rgba(75, 179, 253, 0.3); margin-top: 6px;">
        <div style="color: var(--ficsit-cyan); font-weight: 700;">📥 [Arrivée Matières] ──▶ (Tapis) ──▶ [Répartiteurs] ──▶ ⬇️ [Entrées Machines]</div>
        <div style="color: var(--ficsit-orange); font-weight: 700; margin: 2px 0;">🏭 ⬇️ [Corps des ${exactCount} ${bld.name}(s)] ➔ Flux orienté vers l'avant</div>
        <div style="color: var(--ficsit-green); font-weight: 700;">📤 ⬇️ [Sorties Machines] ──▶ [Groupeurs] ──▶ (Tapis) ──▶ [Sortie Unique Produits]</div>
      </div>
    `;

    if (bld.id === "constructor") {
      inputDesc = "1 Tapis d'ingrédients ➔ Répartiteurs latéraux ➔ Entrées";
      orientationText = "2 Colonnes face-à-face orientées vers l'intérieur (Colonne A ➔ ⬅️ Colonne B)";
    } else if (bld.id === "assembler") {
      inputDesc = "2 Tapis superposés (Bus A & B) ➔ Répartiteurs empilés ➔ 2 Entrées";
      orientationText = "Face-à-face au centre (Entrées sur les côtés ➔, Sorties vers le collecteur central ⬇️)";
      layoutDiagram = `
        <div style="font-family: var(--font-mono, monospace); font-size: 11px; line-height: 1.6; background: rgba(0,0,0,0.6); padding: 8px 12px; border-radius: 4px; border: 1px solid rgba(75, 179, 253, 0.3); margin-top: 6px;">
          <div style="color: var(--ficsit-cyan); font-weight: 700;">📥 [Bus Ingrédient A (Haut)] ──▶ [Répartiteur A] ──▶ ⬇️ Entrée 1</div>
          <div style="color: #67e8f9; font-weight: 700;">📥 [Bus Ingrédient B (Bas)]  ──▶ [Répartiteur B] ──▶ ⬇️ Entrée 2</div>
          <div style="color: var(--ficsit-orange); font-weight: 700; margin: 2px 0;">🏭 ⬇️ [Assembleuses] ➔ Entrées latérales ➔ Sortie avant</div>
          <div style="color: var(--ficsit-green); font-weight: 700;">📤 ⬇️ [Sorties Assembleuses] ──▶ [Groupeur Central] ──▶ (Tapis Sortie)</div>
        </div>
      `;
    } else if (bld.id === "manufacturer" || bld.id === "blender" || bld.id === "particle_accelerator" || bld.id === "quantum_encoder") {
      inputDesc = "4 Tapis superposés (Quadruple Bus) ➔ 4 Répartiteurs empilés ➔ 4 Entrées";
      orientationText = "Orientées vers la droite (Entrées à gauche ➡️, Sortie à droite ➡️)";
      layoutDiagram = `
        <div style="font-family: var(--font-mono, monospace); font-size: 11px; line-height: 1.6; background: rgba(0,0,0,0.6); padding: 8px 12px; border-radius: 4px; border: 1px solid rgba(75, 179, 253, 0.3); margin-top: 6px;">
          <div style="color: var(--ficsit-cyan); font-weight: 700;">📥 [Bus 4 Étages 1..4] ──▶ [4 Répartiteurs Empilés] ──▶ ➡️ [4 Entrées Façonneuse]</div>
          <div style="color: var(--ficsit-orange); font-weight: 700; margin: 2px 0;">⚙️ ➡️ [Façonneuse 4x4/5x5] ➔ Alimentation par bus vertical</div>
          <div style="color: var(--ficsit-green); font-weight: 700;">📤 ➡️ [Sortie Façonneuse] ──▶ [Groupeur de Sortie] ──▶ [Tapis Expédition]</div>
        </div>
      `;
    }

    return `
      <div style="background: #060a0f; border: 1px solid rgba(75, 179, 253, 0.35); border-radius: var(--radius-sm); padding: 14px; box-shadow: inset 0 0 16px rgba(0,0,0,0.8);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px; border-bottom: 1px solid rgba(75, 179, 253, 0.2); padding-bottom: 8px;">
          <span style="font-size: 13px; font-weight: 700; color: var(--ficsit-cyan); text-transform: uppercase;">
            🗺️ Plan Vectoriel & Guide : ${exactCount} × ${bld.name} (${step.recipeName})
          </span>
          <span style="font-size: 11px; background: rgba(250, 149, 73, 0.15); color: var(--ficsit-orange); border: 1px solid var(--ficsit-orange); padding: 2px 8px; border-radius: 4px; font-weight: 700;">
            🏛️ Format 6x6 Mk.3 Dynamique (${exactCount} machine${exactCount > 1 ? 's' : ''})
          </span>
        </div>

        <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: stretch;">
          <!-- COLONNE GAUCHE : PLAN SVG VECTORIEL DYNAMIQUE (ZOOMABLE) -->
          <div class="bp-img-preview-box" data-dynamic-svg="true" data-title="Plan FICSIT Dynamique : ${exactCount} × ${bld.name} (${step.recipeName})" style="flex: 0 0 320px; min-height: 220px; border-radius: var(--radius-sm); overflow: hidden; border: 1px solid rgba(75, 179, 253, 0.5); cursor: pointer; position: relative; background: #07131e;">
            ${dynamicSvg}
            <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%); display: flex; align-items: flex-end; padding: 8px; pointer-events: none;">
              <span style="background: var(--ficsit-orange); color: #000; font-weight: 800; font-size: 10px; padding: 3px 8px; border-radius: 3px;">
                🔍 CLIQUEZ POUR PLEIN ÉCRAN
              </span>
            </div>
          </div>

          <!-- COLONNE DROITE : GUIDE PAS-À-PAS AVEC SENS DE POSE ET FLÈCHES -->
          <div style="flex: 1; min-width: 320px; display: flex; flex-direction: column; justify-content: space-between; gap: 10px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: var(--radius-sm); padding: 12px;">
            
            <div style="display: flex; flex-direction: column; gap: 8px; font-size: 12px;">
              <div style="display: flex; align-items: flex-start; gap: 8px;">
                <span style="background: var(--ficsit-orange); color: #000; font-weight: 800; font-size: 10px; padding: 2px 6px; border-radius: 3px; flex-shrink: 0; margin-top: 1px;">ÉTAPE 1</span>
                <div>
                  <strong>Fondations :</strong> Poser la dalle de fondations de <strong>2m d'épaisseur</strong> (Grille 6x6 dans le Blueprint Designer).
                </div>
              </div>

              <div style="display: flex; align-items: flex-start; gap: 8px;">
                <span style="background: var(--ficsit-cyan); color: #000; font-weight: 800; font-size: 10px; padding: 2px 6px; border-radius: 3px; flex-shrink: 0; margin-top: 1px;">ÉTAPE 2</span>
                <div>
                  <strong>Sens de pose des machines :</strong> Aligner vos <strong>${exactCount} ${bld.name}(s)</strong>.
                  <div style="color: var(--ficsit-amber); font-weight: 700; margin-top: 2px;">🧭 Orientation : ${orientationText}</div>
                </div>
              </div>

              <div style="display: flex; align-items: flex-start; gap: 8px;">
                <span style="background: var(--ficsit-amber); color: #000; font-weight: 800; font-size: 10px; padding: 2px 6px; border-radius: 3px; flex-shrink: 0; margin-top: 1px;">ÉTAPE 3</span>
                <div>
                  <strong>Répartiteurs & Convoyeurs d'Entrée :</strong> Placer un <em>Répartiteur de convoyeur</em> devant chaque entrée de machine (flèche dirigée vers l'entrée de l'usine). Relier l'arrivée principale.
                </div>
              </div>

              <div style="display: flex; align-items: flex-start; gap: 8px;">
                <span style="background: var(--ficsit-green); color: #000; font-weight: 800; font-size: 10px; padding: 2px 6px; border-radius: 3px; flex-shrink: 0; margin-top: 1px;">ÉTAPE 4</span>
                <div>
                  <strong>Groupeurs & Convoyeurs de Sortie :</strong> Placer un <em>Groupeur de convoyeur</em> devant chaque sortie de machine (flèche dirigée vers le convoyeur d'évacuation) pour regrouper tous les produits vers la sortie unique.
                </div>
              </div>
            </div>

            <!-- SCHÉMA FLÉCHÉ DU FLUX LOGISTIQUE -->
            ${layoutDiagram}

            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 8px; margin-top: 4px; font-size: 11.5px; flex-wrap: wrap; gap: 8px;">
              <div>📥 <strong>Entrée Requise :</strong> ${ingrList}</div>
              <div>📤 <strong>Sortie Prévue :</strong> <strong style="color: var(--ficsit-green);">${prodRate}/min ${ITEM_NAMES[step.itemId]||step.itemId}</strong></div>
            </div>

          </div>
        </div>
      </div>
    `;
  }

  function renderLegoGridMatrix(bp) {
    const is5x5 = (bp.designerSize || "").includes("5x5");
    const cols = is5x5 ? ["A", "B", "C", "D", "E"] : ["A", "B", "C", "D"];
    const rows = is5x5 ? [1, 2, 3, 4, 5] : [1, 2, 3, 4];
    const bCount = bp.buildingsCount || {};

    let gridData = [];

    if (bCount.train_station || bp.category === "trains1900") {
      // Modèle Ferroviaire (Loco + Quais de fret)
      gridData = [
        ["🚂 Tête Gare", "📦 Quai Fret 1", "📦 Quai Fret 2", "📦 Quai Fret 3", "📦 Quai Fret 4"],
        ["🚥 Feu Path", "🗄️ Tampon 1", "🗄️ Tampon 2", "🗄️ Tampon 3", "🗄️ Tampon 4"],
        ["🚶 Passerelle", "🚶 Allée Voie", "🚶 Allée Voie", "🚶 Allée Voie", "🚶 Allée Voie"],
        ["🛤️ Voie Express", "🛤️ Voie Express", "🛤️ Voie Express", "🛤️ Voie Express", "🛤️ Voie Express"],
        ["🚥 Feu Block", "📤 Ligne Fret 1", "📤 Ligne Fret 2", "📤 Ligne Fret 3", "📤 Sortie Fret 4"]
      ];
    } else if (bCount.manufacturer || bCount.blender || bCount.particle_accelerator) {
      // Modèle Grosses Machines (Façonneuses / Mélangeurs)
      gridData = is5x5 ? [
        ["⚙️ Façonneuse 1", "⚙️ Façonneuse 1", "⚡ Poteau", "⚙️ Façonneuse 2", "⚙️ Façonneuse 2"],
        ["📥 Bus Ingr. 1", "📥 Bus Ingr. 2", "🚶 Allée", "📥 Bus Ingr. 3", "📥 Bus Ingr. 4"],
        ["📦 Convoyeur Mk.4", "📦 Convoyeur Mk.4", "⚡ Poteau", "📦 Convoyeur Mk.4", "📦 Convoyeur Mk.4"],
        ["⚙️ Façonneuse 3", "⚙️ Façonneuse 3", "🚶 Allée", "⚙️ Façonneuse 4", "⚙️ Façonneuse 4"],
        ["📤 Groupeur 1", "📤 Groupeur 2", "⚡ Poteau", "📤 Groupeur 3", "📤 Sortie Finale"]
      ] : [
        ["⚙️ Façonneuse 1", "⚙️ Façonneuse 1", "⚙️ Façonneuse 2", "⚙️ Façonneuse 2"],
        ["📥 Bus Entrées 1", "📥 Bus Entrées 2", "📥 Bus Entrées 3", "📥 Bus Entrées 4"],
        ["🚶 Allée Centrale", "⚡ Poteau Central", "⚡ Poteau Central", "🚶 Allée Centrale"],
        ["📤 Groupeur 1 ➔", "📤 Groupeur 2 ➔", "📤 Groupeur 3 ➔", "📤 Sortie Finale"]
      ];
    } else if (bCount.assembler) {
      // Modèle Assembleuses (4x4 ou 5x5)
      gridData = is5x5 ? [
        ["🔧 Assembleuse 1", "🔧 Assembleuse 1", "⚡ Poteau", "🔧 Assembleuse 2", "🔧 Assembleuse 2"],
        ["📥 Répartiteur 1", "📥 Répartiteur 2", "🚶 Allée", "📥 Répartiteur 3", "📥 Entrée Composants"],
        ["🚶 Allée Centrale", "🚶 Allée Centrale", "⚡ Poteau", "🚶 Allée Centrale", "🚶 Allée Centrale"],
        ["📤 Groupeur 1 ➔", "📤 Groupeur 2 ➔", "🚶 Allée", "📤 Groupeur 3 ➔", "📤 Sortie Produits"],
        ["🔧 Assembleuse 3", "🔧 Assembleuse 3", "⚡ Poteau", "🔧 Assembleuse 4", "🔧 Assembleuse 4"]
      ] : [
        ["🔧 Assembleuse 1", "🔧 Assembleuse 1", "🔧 Assembleuse 2", "🔧 Assembleuse 2"],
        ["📥 Ingrédient 1 ➔", "📥 Répartiteur A", "📥 Répartiteur B", "📥 Entrée Ingr. 1"],
        ["📥 Ingrédient 2 ➔", "📥 Répartiteur C", "📥 Répartiteur D", "📥 Entrée Ingr. 2"],
        ["📤 Groupeur 1 ➔", "📤 Groupeur 2 ➔", "📤 Groupeur 3 ➔", "📤 Sortie Produits"]
      ];
    } else if (bCount.generator_coal || bCount.generator_fuel || bCount.generator_nuclear) {
      // Modèle Énergie & Générateurs
      gridData = [
        ["⚡ Générateur 1", "⚡ Générateur 2", "⚡ Générateur 3", "⚡ Générateur 4"],
        ["🚰 Collecteur Eau", "🚰 Jonction Pipe", "🚰 Jonction Pipe", "🚰 Arrivée Eau"],
        ["⬛ Tapis Charbon", "⬛ Répartiteur 1", "⬛ Répartiteur 2", "⬛ Arrivée Combustible"],
        ["⚡ Générateur 5", "⚡ Générateur 6", "⚡ Générateur 7", "⚡ Générateur 8"]
      ];
    } else {
      // Modèle Standard : 8 Fonderies / 8 Constructeurs
      gridData = [
        ["🏭 Machine 1 (⬇)", "🏭 Machine 2 (⬇)", "🏭 Machine 3 (⬇)", "🏭 Machine 4 (⬇)"],
        ["📤 Groupeur 1 ➔", "📤 Groupeur 2 ➔", "📤 Groupeur 3 ➔", "📤 Sortie Finale"],
        ["📥 Répartiteur 1", "📥 Répartiteur 2", "📥 Répartiteur 3", "📥 Entrée Matière"],
        ["🏭 Machine 5 (⬆)", "🏭 Machine 6 (⬆)", "🏭 Machine 7 (⬆)", "🏭 Machine 8 (⬆)"]
      ];
    }

    const headerCells = cols.map(c => `<th style="padding: 4px 6px; font-size: 10px; color: var(--ficsit-cyan); text-align: center; border: 1px solid rgba(75, 179, 253, 0.2); background: rgba(0,0,0,0.5);">Col ${c}</th>`).join("");

    const bodyRows = rows.map((r, rIdx) => {
      const rowCells = cols.map((c, cIdx) => {
        const val = (gridData[rIdx] && gridData[rIdx][cIdx]) || `${c}${r}`;
        let bg = "rgba(255,255,255,0.03)";
        let border = "1px solid rgba(255,255,255,0.07)";
        let color = "#e0e6ed";

        if (val.includes("Machine") || val.includes("Fonderie") || val.includes("Constructeur") || val.includes("Assembleuse") || val.includes("Façonneuse") || val.includes("Générateur") || val.includes("Tête Gare")) {
          bg = "rgba(250, 149, 73, 0.15)";
          border = "1px solid rgba(250, 149, 73, 0.5)";
          color = "var(--ficsit-orange)";
        } else if (val.includes("Groupeur") || val.includes("Sortie")) {
          bg = "rgba(46, 204, 113, 0.12)";
          border = "1px solid rgba(46, 204, 113, 0.4)";
          color = "var(--ficsit-green)";
        } else if (val.includes("Répartiteur") || val.includes("Entrée") || val.includes("Bus")) {
          bg = "rgba(75, 179, 253, 0.12)";
          border = "1px solid rgba(75, 179, 253, 0.4)";
          color = "var(--ficsit-cyan)";
        } else if (val.includes("Poteau") || val.includes("Feu")) {
          color = "var(--ficsit-amber)";
        }

        return `<td style="padding: 6px 4px; font-size: 10px; font-weight: 600; text-align: center; border: ${border}; background: ${bg}; color: ${color}; border-radius: 2px;">${val}</td>`;
      }).join("");

      return `<tr><td style="padding: 4px; font-size: 10px; font-weight: 700; color: var(--text-muted); text-align: center; border: 1px solid rgba(255,255,255,0.08); background: rgba(0,0,0,0.5);">L${r}</td>${rowCells}</tr>`;
    }).join("");

    return `
      <div style="overflow-x: auto; margin-top: 4px;">
        <table style="width: 100%; border-collapse: collapse; font-family: var(--font-mono, monospace);">
          <thead>
            <tr>
              <th style="padding: 4px; font-size: 10px; color: var(--text-muted); border: 1px solid rgba(255,255,255,0.08); background: rgba(0,0,0,0.5);">#</th>
              ${headerCells}
            </tr>
          </thead>
          <tbody>
            ${bodyRows}
          </tbody>
        </table>
      </div>
    `;
  }



  // =========================================================================
  // CHECKLIST DE CHANTIER INTERACTIVE
  // =========================================================================
  function renderChecklist() {
    const container = document.getElementById("checklist-items-list");
    const clearBtn = document.getElementById("btn-clear-checklist");
    if (!container) return;

    const savedItems = JSON.parse(localStorage.getItem("ficsit_checklist_items") || "[]");

    if (savedItems.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px; color: var(--text-secondary);">
          <div style="font-size: 32px; margin-bottom: 12px;">📋</div>
          <div>Votre liste de chantier est vide.</div>
          <div style="font-size: 12px; margin-top: 6px;">Utilisez le calculateur de production et cliquez sur <strong>"Envoyer vers la Checklist"</strong> pour planifier votre usine !</div>
        </div>
      `;
      return;
    }

    container.innerHTML = savedItems.map((item, idx) => {
      const isChecked = STATE.checkedChecklist.has(`chk_${idx}`);
      return `
        <div class="checklist-item ${isChecked ? "checked" : ""}">
          <input type="checkbox" class="milestone-checkbox checklist-chk" data-idx="chk_${idx}" ${isChecked ? "checked" : ""}>
          <div class="item-text">
            <strong>${item.title}</strong>
            <div style="font-size: 12px; color: var(--text-secondary);">${item.subtitle || ""}</div>
          </div>
          <span class="item-qty">${item.qty || ""}</span>
        </div>
      `;
    }).join("");

    // Écouteurs de cases à cocher
    container.querySelectorAll(".checklist-chk").forEach(chk => {
      chk.addEventListener("change", (e) => {
        const id = e.target.getAttribute("data-idx");
        const parent = e.target.closest(".checklist-item");
        if (e.target.checked) {
          STATE.checkedChecklist.add(id);
          parent.classList.add("checked");
        } else {
          STATE.checkedChecklist.delete(id);
          parent.classList.remove("checked");
        }
        saveState();
      });
    });

    if (clearBtn) {
      clearBtn.onclick = () => {
        localStorage.removeItem("ficsit_checklist_items");
        STATE.checkedChecklist.clear();
        saveState();
        renderChecklist();
        showToast("Checklist réinitialisée !");
      };
    }
  }

  let currentPrintType = "checklist";

  function initPrintModal() {
    const modal = document.getElementById("ficsit-print-modal");
    const closeBtn = document.getElementById("btn-close-print-modal");
    const copyBtn = document.getElementById("btn-copy-print-sheet");

    // Écouteur Affichage Fiche Checklist
    const printChecklistBtn = document.getElementById("btn-print-checklist");
    if (printChecklistBtn) {
      printChecklistBtn.onclick = () => {
        openPrintSpecSheet("checklist");
      };
    }

    // Écouteur Affichage Fiche Calculateur
    const printCalcBtn = document.getElementById("btn-print-calc-sheet");
    if (printCalcBtn) {
      printCalcBtn.onclick = () => {
        if (!STATE.lastCalculation) {
          executeCalculation();
        }
        openPrintSpecSheet("calculator");
      };
    }

    if (closeBtn && modal) {
      closeBtn.onclick = () => { modal.style.display = "none"; };
      modal.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };
    }

    if (copyBtn) {
      copyBtn.onclick = () => {
        const content = document.getElementById("print-sheet-content");
        if (!content) return;
        const text = content.innerText || content.textContent;
        navigator.clipboard.writeText(text).then(() => {
          showToast("📋 Fiche récapitulative copiée dans le Presse-Papier avec succès !");
        }).catch(() => {
          // Fallback
          const textarea = document.createElement("textarea");
          textarea.value = text;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand("copy");
          textarea.remove();
          showToast("📋 Fiche récapitulative copiée dans le Presse-Papier !");
        });
      };
    }
  }

  function openPrintSpecSheet(type, customData) {
    currentPrintType = type;
    const modal = document.getElementById("ficsit-print-modal");
    const content = document.getElementById("print-sheet-content");
    if (!modal || !content) return;

    const now = new Date().toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });

    let sheetHtml = "";

    if (type === "checklist") {
      const savedItems = JSON.parse(localStorage.getItem("ficsit_checklist_items") || "[]");
      const rowsHtml = savedItems.map((item, i) => {
        const isChecked = STATE.checkedChecklist.has(`chk_${i}`);
        return `
          <tr>
            <td style="width: 30px; text-align: center;">${isChecked ? "☑" : "☐"}</td>
            <td><strong>${item.title}</strong><div style="font-size: 11px; color: #7f93a8;">${item.subtitle || ""}</div></td>
            <td style="font-weight: 700; text-align: right; color: var(--ficsit-orange);">${item.qty || ""}</td>
          </tr>
        `;
      }).join("") || "<tr><td colspan='3' style='text-align: center; padding: 20px;'>Aucun élément dans la checklist.</td></tr>";

      sheetHtml = `
        <div class="ficsit-spec-header">
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="ficsit-spec-badge">FICSIT INC. // OFFICIAL SPEC</span>
              <span style="font-size: 11px; color: var(--text-muted);">REF: FICSIT-ENG-1900-CHK</span>
            </div>
            <h1 style="font-family: var(--font-display); font-size: 20px; color: var(--ficsit-orange); margin: 6px 0 2px 0;">
              🏗️ BORDEREAU DE CHANTIER & MATÉRIAUX EMBARQUÉS
            </h1>
            <div style="font-size: 11px; color: var(--text-secondary);">Généré le ${now} | Directive Industrielle Pionnier 1.0</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 11px; text-transform: uppercase; color: var(--text-muted);">Statut de mission</div>
            <div style="font-size: 14px; font-weight: 800; color: var(--ficsit-green);">PRÊT POUR DÉPLOIEMENT</div>
          </div>
        </div>

        <div class="spec-grid-layout">
          <div class="spec-box">
            <div class="spec-box-title">Total Postes de Travail</div>
            <div style="font-size: 20px; font-weight: 800; color: var(--text-primary);">${savedItems.length} tâche(s)</div>
          </div>
          <div class="spec-box">
            <div class="spec-box-title">Avancement Actuel</div>
            <div style="font-size: 20px; font-weight: 800; color: var(--ficsit-green);">${STATE.checkedChecklist.size} / ${savedItems.length} validé(s)</div>
          </div>
        </div>

        <table class="spec-checklist-table">
          <thead>
            <tr>
              <th>État</th>
              <th>Désignation de la Machine ou Ressource</th>
              <th style="text-align: right;">Quantité</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>

        <div style="margin-top: 24px; padding-top: 12px; border-top: 1px dashed var(--border-subtle); display: flex; justify-content: space-between; font-size: 11px; color: var(--text-muted);">
          <div>FICSIT Industrial Automation Protocol - Satisfactory 1.0</div>
          <div>Page 1 / 1 - Document Officiel de Chantier</div>
        </div>
      `;
    } else if (type === "calculator") {
      const results = STATE.lastCalculation;
      if (!results) {
        showToast("Veuillez d'abord lancer un calcul.");
        return;
      }

      const stepsHtml = results.productionSteps.map(step => {
        return `
          <div style="margin-bottom: 16px; page-break-inside: avoid;">
            ${renderStepLegoGrid(step)}
          </div>
        `;
      }).join("");

      const rawHtml = Object.entries(results.rawResources).map(([r, rate]) => {
        return `<div><strong>${Math.round(rate * 10) / 10}/min</strong> ${ITEM_NAMES[r] || r}</div>`;
      }).join("") || "<div>Aucune</div>";

      sheetHtml = `
        <div class="ficsit-spec-header">
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="ficsit-spec-badge">FICSIT INC. // USINE COMPLÈTE</span>
              <span style="font-size: 11px; color: var(--text-muted);">REF: FICSIT-PROD-PLAN-1.0</span>
            </div>
            <h1 style="font-family: var(--font-display); font-size: 20px; color: var(--ficsit-orange); margin: 6px 0 2px 0;">
              🏭 FICHE TECHNIQUE DE PRODUCTION & PLANS DE MONTAGE
            </h1>
            <div style="font-size: 11px; color: var(--text-secondary);">Généré le ${now} | Configuration Optimisée</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 11px; text-transform: uppercase; color: var(--text-muted);">Énergie Requise</div>
            <div style="font-size: 18px; font-weight: 800; color: var(--ficsit-amber);">${results.totalPowerMW} MW</div>
          </div>
        </div>

        <div class="spec-grid-layout">
          <div class="spec-box">
            <div class="spec-box-title">Total Machines Requises</div>
            <div style="font-size: 20px; font-weight: 800; color: var(--ficsit-green);">
              ${Object.values(results.buildingTotals).reduce((a, b) => a + b, 0)} usines
            </div>
          </div>
          <div class="spec-box">
            <div class="spec-box-title">Alimentation Brute Requise</div>
            <div style="font-size: 12px; line-height: 1.5; color: var(--text-primary);">${rawHtml}</div>
          </div>
        </div>

        <h3 style="font-family: var(--font-display); font-size: 15px; color: var(--ficsit-cyan); margin: 16px 0 10px 0; text-transform: uppercase;">
          📐 Plans de Montage Simplifiés par Étape :
        </h3>
        ${stepsHtml}

        <div style="margin-top: 24px; padding-top: 12px; border-top: 1px dashed var(--border-subtle); display: flex; justify-content: space-between; font-size: 11px; color: var(--text-muted);">
          <div>FICSIT Industrial Automation Protocol - Satisfactory 1.0</div>
          <div>Document Officiel de Chantier & Plans d'Apparat</div>
        </div>
      `;
    }

    content.innerHTML = sheetHtml;
    modal.style.display = "flex";
  }

  function addCalculationToChecklist(calcResults) {
    const items = [];

    // 1. Bâtiments à construire
    for (const [bId, count] of Object.entries(calcResults.buildingTotals)) {
      const b = BUILDINGS[bId] || { name: bId, icon: "🏭" };
      items.push({
        title: `Construire ${count} × ${b.name} ${b.icon}`,
        subtitle: `Catégorie : ${b.category} | Consommation unitaire : ${b.powerMW} MW`,
        qty: `${count} unités`
      });
    }

    // 2. Matériaux de construction nécessaires
    for (const [matId, qty] of Object.entries(calcResults.constructionMaterials)) {
      items.push({
        title: `Préparer : ${ITEM_NAMES[matId] || matId}`,
        subtitle: `Composants d'inventaire requis pour poser les machines`,
        qty: `${qty} pcs`
      });
    }

    // 3. Artefacts spéciaux (Éclats de charge & Somersloops)
    if (calcResults.totalPowerShards > 0) {
      items.push({
        title: `💎 Rassembler ${calcResults.totalPowerShards} × Éclat de Charge (Power Shard)`,
        subtitle: `Overclocking des machines de l'usine`,
        qty: `${calcResults.totalPowerShards} pcs`
      });
    }
    if (calcResults.totalSomersloops > 0) {
      items.push({
        title: `🌀 Rassembler ${calcResults.totalSomersloops} × Somersloop Alien 1.0`,
        subtitle: `Amplification technologique alien (+100% bonus)`,
        qty: `${calcResults.totalSomersloops} pcs`
      });
    }

    localStorage.setItem("ficsit_checklist_items", JSON.stringify(items));
    STATE.checkedChecklist.clear();
    saveState();
    renderChecklist();
  }

  // =========================================================================
  // IMPORTEUR DE SAUVEGARDE .SAV
  // =========================================================================
  function initSaveUploader() {
    const dropzone = document.getElementById("save-dropzone");
    const fileInput = document.getElementById("save-file-input");
    const saveReport = document.getElementById("save-report-panel");
    const browseBtn = document.getElementById("btn-browse-save");
    const copyPathBtn = document.getElementById("btn-copy-save-path");

    if (!dropzone || !fileInput) return;

    if (browseBtn) {
      browseBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        fileInput.click();
      });
    }

    if (copyPathBtn) {
      copyPathBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const savePath = "%LOCALAPPDATA%\\FactoryGame\\Saved\\SaveGames\\";
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(savePath).then(() => {
            showToast("Chemin copié ! Collez-le dans l'Explorateur Windows (Ctrl+V).");
          }).catch(() => fallbackCopy(savePath));
        } else {
          fallbackCopy(savePath);
        }
      });
    }

    function fallbackCopy(text) {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        showToast("Chemin copié ! Collez-le dans l'Explorateur Windows (Ctrl+V).");
      } catch (err) {
        showToast("Emplacement : %LOCALAPPDATA%\\FactoryGame\\Saved\\SaveGames\\");
      }
      document.body.removeChild(ta);
    }

    dropzone.addEventListener("click", () => fileInput.click());

    dropzone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropzone.classList.add("dragover");
    });

    dropzone.addEventListener("dragleave", () => {
      dropzone.classList.remove("dragover");
    });

    dropzone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropzone.classList.remove("dragover");
      if (e.dataTransfer.files.length > 0) {
        handleSaveFile(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener("change", (e) => {
      if (e.target.files.length > 0) {
        handleSaveFile(e.target.files[0]);
      }
    });

    async function handleSaveFile(file) {
      showToast("Analyse du fichier de sauvegarde Satisfactory...");
      const result = await SatisfactorySaveParser.parseSave(file);

      if (result.success) {
        // Appliquer les jalons trouvés
        result.unlockedMilestones.forEach(mId => STATE.completedMilestones.add(mId));
        result.unlockedPhases.forEach(pId => STATE.completedPhases.add(pId));
        saveState();

        // Mettre à jour toutes les vues
        renderMilestones();
        renderPhases();
        renderSyntheticView();
        updateHUDStats();

        // Afficher le rapport de sauvegarde
        if (saveReport) {
          saveReport.style.display = "block";
          saveReport.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
              <span style="background: var(--ficsit-green); color: #000; font-weight: 800; font-size: 11px; padding: 2px 8px; border-radius: 4px;">SYNCHRONISÉ</span>
              <h4 style="color: var(--ficsit-green); margin: 0; font-family: var(--font-display); font-size: 16px;">
                ✔ Sauvegarde analysée avec succès !
              </h4>
            </div>
            <div class="resource-row"><span>Nom de la Session :</span><strong>${result.sessionName}</strong></div>
            <div class="resource-row"><span>Temps de Jeu :</span><strong>${result.playtime}</strong></div>
            <div class="resource-row"><span>Build Version :</span><strong>${result.buildVersion}</strong></div>
            <div class="resource-row"><span>Jalons Détectés & Cochés :</span><strong style="color: var(--ficsit-orange);">${result.unlockedMilestones.length} jalon(s)</strong></div>
            <div class="resource-row"><span>Phases Ascenseur Validées :</span><strong style="color: var(--ficsit-amber);">${result.unlockedPhases.length} phase(s)</strong></div>

            <div style="margin-top: 16px; padding: 12px; background: rgba(46, 204, 113, 0.1); border: 1px solid var(--ficsit-green); border-radius: var(--radius-sm); font-size: 12px; color: var(--text-primary);">
              ✨ <strong>Vos jalons et phases sont maintenant 100% synchronisés !</strong> Vous pouvez consulter l'onglet <em>Vue Synthétique</em> ou <em>Calculateur de Production</em>.
            </div>
          `;
        }

        showToast(`Sauvegarde "${result.sessionName}" synchronisée avec succès !`);
      } else {
        alert("Erreur lors de la lecture du fichier .sav : " + result.error);
      }
    }

    // Gestion des Boutons de Présélection Rapide de Palier
    document.querySelectorAll(".btn-preset-tier").forEach(btn => {
      btn.addEventListener("click", () => {
        const targetTier = parseInt(btn.getAttribute("data-tier"), 10);
        STATE.completedMilestones.clear();
        STATE.completedPhases.clear();

        MILESTONES_DATA.tiers.forEach(t => {
          if (t.tier <= targetTier || targetTier === 100) {
            t.milestones.forEach(m => STATE.completedMilestones.add(m.id));
          }
        });

        if (targetTier >= 4 || targetTier === 100) STATE.completedPhases.add("phase_1");
        if (targetTier >= 6 || targetTier === 100) STATE.completedPhases.add("phase_2");
        if (targetTier >= 8 || targetTier === 100) STATE.completedPhases.add("phase_3");
        if (targetTier >= 9 || targetTier === 100) STATE.completedPhases.add("phase_4");
        if (targetTier === 100) STATE.completedPhases.add("phase_5");

        saveState();
        renderMilestones();
        renderPhases();
        renderSyntheticView();
        updateHUDStats();
        showToast(targetTier === 100 ? "🏆 Progression 100% débloquée !" : `⚡ Progression synchronisée jusqu'au Palier ${targetTier} !`);
      });
    });

    const resetProgBtn = document.getElementById("btn-reset-all-progression");
    if (resetProgBtn) {
      resetProgBtn.addEventListener("click", () => {
        STATE.completedMilestones.clear();
        STATE.completedPhases.clear();
        saveState();
        renderMilestones();
        renderPhases();
        renderSyntheticView();
        updateHUDStats();
        showToast("Progression réinitialisée au début de partie (Palier 0).");
      });
    }
  }

  // =========================================================================
  // UTILITAIRES & NOTIFICATIONS
  // =========================================================================
  function updateHUDStats() {
    if (statCompletedEl) {
      statCompletedEl.innerText = `${STATE.completedMilestones.size}`;
    }
    if (statPowerEl && STATE.lastCalculation) {
      statPowerEl.innerText = `${STATE.lastCalculation.totalPowerMW} MW`;
    }
  }

  function saveState() {
    localStorage.setItem("ficsit_milestones", JSON.stringify(Array.from(STATE.completedMilestones)));
    localStorage.setItem("ficsit_phases", JSON.stringify(Array.from(STATE.completedPhases)));
    localStorage.setItem("ficsit_alt_recipes", JSON.stringify(STATE.activeAltRecipes));
    localStorage.setItem("ficsit_checklist", JSON.stringify(Array.from(STATE.checkedChecklist)));
    localStorage.setItem("ficsit_built_machines", JSON.stringify(Array.from(STATE.builtMachines)));
  }

  function showToast(message) {
    const existing = document.querySelector(".toast-msg");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.className = "toast-msg";
    toast.innerHTML = `<span>🏭</span> <div>${message}</div>`;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // =========================================================================
  // CARTE INTERACTIVE DES RESSOURCES
  // =========================================================================
  let mapEngineInstance = null;

  function initInteractiveMap() {
    const canvas = document.getElementById("map-canvas");
    if (!canvas) return;

    if (!mapEngineInstance && typeof SatisfactoryMapEngine !== 'undefined') {
      mapEngineInstance = new SatisfactoryMapEngine(canvas, {
        onNodeSelect: (node) => showNodeInspector(node),
        onRadiusUpdate: (data) => updateRadiusPanel(data),
        onPinUpdate: () => showToast("Marqueur de base sauvegardé sur la carte !")
      });
    }

    // Map Layer buttons
    document.querySelectorAll(".map-layer-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".map-layer-btn").forEach(b => {
          b.classList.remove("active");
          b.style.background = "transparent";
          b.style.color = "var(--text-secondary)";
        });
        btn.classList.add("active");
        btn.style.background = "var(--ficsit-orange)";
        btn.style.color = "#000";

        const layer = btn.getAttribute("data-layer");
        if (mapEngineInstance) {
          mapEngineInstance.setMapLayer(layer);
        }
      });
    });

    // Populate Biomes dropdown
    const biomeSelect = document.getElementById("map-biome-select");
    if (biomeSelect && typeof BIOMES !== 'undefined' && biomeSelect.options.length <= 1) {
      BIOMES.forEach(b => {
        const opt = document.createElement("option");
        opt.value = b.id;
        opt.textContent = b.name;
        biomeSelect.appendChild(opt);
      });

      biomeSelect.addEventListener("change", () => {
        if (biomeSelect.value && mapEngineInstance) {
          mapEngineInstance.focusBiome(biomeSelect.value);
        }
      });
    }

    // Reset View Button
    const resetBtn = document.getElementById("btn-map-reset-view");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (mapEngineInstance) mapEngineInstance.resetView();
      });
    }

    // Zoom Buttons
    const zoomInBtn = document.getElementById("btn-map-zoom-in");
    if (zoomInBtn) {
      zoomInBtn.addEventListener("click", () => {
        if (mapEngineInstance) {
          mapEngineInstance.scale = Math.min(mapEngineInstance.maxScale, mapEngineInstance.scale * 1.3);
          mapEngineInstance.render();
        }
      });
    }

    const zoomOutBtn = document.getElementById("btn-map-zoom-out");
    if (zoomOutBtn) {
      zoomOutBtn.addEventListener("click", () => {
        if (mapEngineInstance) {
          mapEngineInstance.scale = Math.max(mapEngineInstance.minScale, mapEngineInstance.scale * 0.77);
          mapEngineInstance.render();
        }
      });
    }

    // Tools Buttons
    const toolSelectBtn = document.getElementById("tool-map-select");
    const toolRadiusBtn = document.getElementById("tool-map-radius");
    const toolPinBtn = document.getElementById("tool-map-pin");
    const radiusPanel = document.getElementById("map-radius-panel");

    function setToolActive(toolName, activeBtn) {
      [toolSelectBtn, toolRadiusBtn, toolPinBtn].forEach(b => b && b.classList.remove("active"));
      if (activeBtn) activeBtn.classList.add("active");
      if (mapEngineInstance) mapEngineInstance.setTool(toolName);
      if (radiusPanel) {
        radiusPanel.style.display = toolName === "radius" ? "block" : "none";
      }
    }

    if (toolSelectBtn) toolSelectBtn.addEventListener("click", () => setToolActive("select", toolSelectBtn));
    if (toolRadiusBtn) toolRadiusBtn.addEventListener("click", () => {
      setToolActive("radius", toolRadiusBtn);
      showToast("Cliquez sur la carte pour définir le centre du radar de zone !");
    });
    if (toolPinBtn) toolPinBtn.addEventListener("click", () => {
      setToolActive("custom_pin", toolPinBtn);
      showToast("Cliquez sur la carte pour poser un marqueur d'usine !");
    });

    // Populate Resource Chips
    const resGrid = document.getElementById("map-resource-filter-grid");
    if (resGrid && typeof RESOURCE_TYPES !== 'undefined' && resGrid.children.length === 0) {
      Object.entries(RESOURCE_TYPES).forEach(([typeKey, meta]) => {
        const chip = document.createElement("div");
        chip.className = "resource-chip active";
        chip.setAttribute("data-res", typeKey);
        chip.innerHTML = `
          <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${meta.color};"></span>
          <span>${meta.name}</span>
        `;
        chip.addEventListener("click", () => {
          chip.classList.toggle("active");
          triggerFiltersUpdate();
        });
        resGrid.appendChild(chip);
      });
    }

    // All / None Resource Filter Buttons
    const btnAllRes = document.getElementById("btn-filter-all-res");
    if (btnAllRes) {
      btnAllRes.addEventListener("click", () => {
        document.querySelectorAll(".resource-chip").forEach(c => c.classList.add("active"));
        triggerFiltersUpdate();
      });
    }

    const btnNoneRes = document.getElementById("btn-filter-none-res");
    if (btnNoneRes) {
      btnNoneRes.addEventListener("click", () => {
        document.querySelectorAll(".resource-chip").forEach(c => c.classList.remove("active"));
        triggerFiltersUpdate();
      });
    }

    // Purity Chips
    document.querySelectorAll(".purity-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        chip.classList.toggle("active");
        triggerFiltersUpdate();
      });
    });

    // Search Input
    const searchInput = document.getElementById("map-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", () => triggerFiltersUpdate());
    }

    function triggerFiltersUpdate() {
      if (!mapEngineInstance) return;
      const activeTypes = new Set();
      document.querySelectorAll(".resource-chip.active").forEach(c => {
        activeTypes.add(c.getAttribute("data-res"));
      });

      const activePurities = new Set();
      document.querySelectorAll(".purity-chip.active").forEach(c => {
        activePurities.add(c.getAttribute("data-purity"));
      });

      const searchVal = searchInput ? searchInput.value : "";

      mapEngineInstance.setFilters({
        types: activeTypes,
        purities: activePurities,
        search: searchVal
      });
    }

    // Radius Distance Slider
    const radarDistSlider = document.getElementById("radar-dist-slider");
    const radarDistLabel = document.getElementById("radar-dist-label");
    if (radarDistSlider) {
      radarDistSlider.addEventListener("input", () => {
        const val = parseInt(radarDistSlider.value, 10);
        if (radarDistLabel) radarDistLabel.textContent = `${(val * 10).toLocaleString()} m`;
        if (mapEngineInstance) mapEngineInstance.setRadiusDistance(val);
      });
    }

    // Close Inspector Button
    const closeInspBtn = document.getElementById("btn-close-node-inspector");
    if (closeInspBtn) {
      closeInspBtn.addEventListener("click", () => {
        const inspectorEl = document.getElementById("map-node-inspector");
        if (inspectorEl) inspectorEl.style.display = "none";
        if (mapEngineInstance) {
          mapEngineInstance.selectedNode = null;
          mapEngineInstance.render();
        }
      });
    }
  }

  function showNodeInspector(node) {
    const inspector = document.getElementById("map-node-inspector");
    if (!inspector) return;
    inspector.style.display = "block";

    const resMeta = (typeof RESOURCE_TYPES !== 'undefined' && RESOURCE_TYPES[node.type]) ? RESOURCE_TYPES[node.type] : { name: node.type, category: 'solid' };
    const nameEl = document.getElementById("node-inspector-name");
    const purityBadge = document.getElementById("node-inspector-purity-badge");
    const biomeEl = document.getElementById("node-inspector-biome");
    const minerTierGroup = document.getElementById("node-miner-tier-group");
    const minerSlider = document.getElementById("node-miner-slider");
    const minerLabel = document.getElementById("node-miner-label");
    const clockSlider = document.getElementById("node-clock-slider");
    const clockLabel = document.getElementById("node-clock-label");
    const somersloopChk = document.getElementById("node-somersloop-chk");
    const yieldVal = document.getElementById("node-inspector-yield");
    const yieldUnit = document.getElementById("node-inspector-unit");
    const sendBtn = document.getElementById("btn-send-node-to-calc");

    if (nameEl) nameEl.textContent = `${resMeta.icon || '⛏️'} ${resMeta.name}`;
    if (purityBadge) {
      purityBadge.textContent = node.purity.toUpperCase();
      purityBadge.style.background = node.purity === 'pure' ? '#2ecc71' : (node.purity === 'normal' ? '#f1c40f' : '#e74c3c');
      purityBadge.style.color = '#0e1217';
    }
    if (biomeEl) {
      const biomeObj = (typeof BIOMES !== 'undefined') ? BIOMES.find(b => b.id === node.biome) : null;
      biomeEl.textContent = `📍 ${biomeObj ? biomeObj.name : node.biome}`;
    }

    if (minerTierGroup) {
      minerTierGroup.style.display = resMeta.category === 'solid' ? 'flex' : 'none';
    }

    function updateYield() {
      const tier = minerSlider ? parseInt(minerSlider.value, 10) : 3;
      const clock = clockSlider ? parseInt(clockSlider.value, 10) : 250;
      const loop = somersloopChk ? somersloopChk.checked : false;

      if (minerLabel) minerLabel.textContent = `Foreuse Mk.${tier}`;
      if (clockLabel) {
        const shards = clock === 250 ? '3 Éclats' : (clock > 150 ? '2 Éclats' : (clock > 100 ? '1 Éclat' : '0'));
        clockLabel.textContent = `${clock}% (${shards})`;
      }

      if (typeof calculateNodeOutput === 'function') {
        const out = calculateNodeOutput(node, { minerTier: tier, clockSpeed: clock, somersloop: loop });
        if (yieldVal) yieldVal.textContent = out.rate;
        if (yieldUnit) yieldUnit.textContent = out.unit;
      }
    }

    if (minerSlider) minerSlider.oninput = updateYield;
    if (clockSlider) clockSlider.oninput = updateYield;
    if (somersloopChk) somersloopChk.onchange = updateYield;

    updateYield();

    if (sendBtn) {
      sendBtn.onclick = () => {
        let rate = 1200;
        let unit = 'pièces/min';
        if (typeof calculateNodeOutput === 'function') {
          const out = calculateNodeOutput(node, {
            minerTier: minerSlider ? parseInt(minerSlider.value, 10) : 3,
            clockSpeed: clockSlider ? parseInt(clockSlider.value, 10) : 250,
            somersloop: somersloopChk ? somersloopChk.checked : false
          });
          rate = out.rate;
          unit = out.unit;
        }

        // Switch to calculator tab and set target
        switchTab("calculator");
        const calcItemSelect = document.getElementById("calc-target-item");
        const calcRateInput = document.getElementById("calc-target-rate");

        if (calcRateInput) calcRateInput.value = rate;

        // Match item recipe or product
        if (calcItemSelect) {
          let matchedItem = null;
          if (node.type === 'iron') matchedItem = 'iron_ingot';
          else if (node.type === 'copper') matchedItem = 'copper_ingot';
          else if (node.type === 'limestone') matchedItem = 'concrete';
          else if (node.type === 'coal') matchedItem = 'steel_ingot';
          else if (node.type === 'caterium') matchedItem = 'caterium_ingot';
          else if (node.type === 'quartz') matchedItem = 'quartz_crystal';
          else if (node.type === 'bauxite') matchedItem = 'aluminum_ingot';
          else if (node.type === 'oil') matchedItem = 'plastic';

          if (matchedItem) {
            calcItemSelect.value = matchedItem;
          }
        }

        const calcBtn = document.getElementById("btn-calculate-production");
        if (calcBtn) calcBtn.click();

        showToast(`Débit de ${rate} ${unit} injecté dans le Calculateur de Production !`);
      };
    }
  }

  function updateRadiusPanel(data) {
    const countEl = document.getElementById("radar-nodes-count");
    const listEl = document.getElementById("radar-summary-list");
    if (!listEl) return;

    if (countEl) countEl.textContent = `${data.totalNodes} gisement(s)`;

    listEl.innerHTML = "";
    if (data.totalNodes === 0) {
      listEl.innerHTML = `<div style="font-size: 12px; color: var(--text-secondary); padding: 8px;">Aucun gisement dans ce rayon. Cliquez ailleurs pour déplacer le radar.</div>`;
      return;
    }

    Object.entries(data.summary).forEach(([typeKey, info]) => {
      const resMeta = (typeof RESOURCE_TYPES !== 'undefined' && RESOURCE_TYPES[typeKey]) ? RESOURCE_TYPES[typeKey] : { name: typeKey, color: '#ffffff' };
      const row = document.createElement("div");
      row.style.display = "flex";
      row.style.justifyContent = "space-between";
      row.style.alignItems = "center";
      row.style.padding = "6px 8px";
      row.style.background = "var(--bg-surface)";
      row.style.border = "1px solid var(--border-subtle)";
      row.style.borderRadius = "var(--radius-sm)";
      row.style.fontSize = "12px";

      row.innerHTML = `
        <div style="display: flex; align-items: center; gap: 6px;">
          <span style="width: 8px; height: 8px; border-radius: 50%; background: ${resMeta.color};"></span>
          <span>${resMeta.name}</span>
          <strong style="color: var(--ficsit-orange);">×${info.count}</strong>
        </div>
        <div style="font-family: var(--font-display); color: var(--ficsit-amber); font-weight: 700;">
          ${info.totalRateMk3_250} /min
        </div>
      `;
      listEl.appendChild(row);
    });
  }

  // =========================================================================
  // DÉMARRAGE & INITIALISATION DE L'APPLICATION
  // =========================================================================
  initNavigation();
  renderMilestones();
  renderPhases();
  renderSyntheticView();
  initCalculatorUI();
  renderBlueprints();
  renderChecklist();
  initSaveUploader();
  initPrintModal();
  initInteractiveMap();
  updateHUDStats();
});

