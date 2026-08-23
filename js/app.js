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
    unlockedAltRecipes: new Set(JSON.parse(localStorage.getItem("ficsit_unlocked_alt_recipes") || "[]")),
    recipeFilterMode: localStorage.getItem("ficsit_recipe_filter_mode") || "all",
    saveSessionInfo: JSON.parse(localStorage.getItem("ficsit_save_session") || "null"),
    mamTrees: JSON.parse(localStorage.getItem("ficsit_mam_trees") || "null"),
    researchedMAMNodes: new Set(JSON.parse(localStorage.getItem("ficsit_mam_nodes") || "[]")),
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
  function switchSyntheticSubtab(subtab) {
    const subnavBtns = document.querySelectorAll("[data-synth-subtab]");
    const cockpitSubtab = document.getElementById("synth-subtab-cockpit");
    const progSubtab = document.getElementById("synth-subtab-progression");

    subnavBtns.forEach(btn => {
      if (btn.getAttribute("data-synth-subtab") === subtab) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    if (cockpitSubtab) cockpitSubtab.style.display = subtab === "cockpit" ? "block" : "none";
    if (progSubtab) progSubtab.style.display = subtab === "progression" ? "block" : "none";

    if (subtab === "cockpit" && window.ControlRoomEngine && typeof window.ControlRoomEngine.init === 'function') {
      setTimeout(() => window.ControlRoomEngine.init(), 30);
    }
  }

  function switchProgressionSubtab(subtab) {
    const subnavBtns = document.querySelectorAll("[data-prog-subtab]");
    const milestonesSubtab = document.getElementById("prog-subtab-milestones");
    const phasesSubtab = document.getElementById("prog-subtab-phases");

    subnavBtns.forEach(btn => {
      if (btn.getAttribute("data-prog-subtab") === subtab) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    if (milestonesSubtab) milestonesSubtab.style.display = subtab === "milestones" ? "block" : "none";
    if (phasesSubtab) phasesSubtab.style.display = subtab === "phases" ? "block" : "none";
  }

  function switchCalculatorSubtab(subtab) {
    const subnavBtns = document.querySelectorAll("[data-calc-subtab]");
    const singleSubtab = document.getElementById("calc-subtab-single");
    const milestonesSubtab = document.getElementById("calc-subtab-milestones");

    subnavBtns.forEach(btn => {
      if (btn.getAttribute("data-calc-subtab") === subtab) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    if (singleSubtab) singleSubtab.style.display = subtab === "single" ? "block" : "none";
    if (milestonesSubtab) milestonesSubtab.style.display = subtab === "milestones" ? "block" : "none";
  }

  function switchTab(targetView) {
    let progSubtab = null;
    let calcSubtab = null;

    if (targetView === "phases") {
      targetView = "milestones";
      progSubtab = "phases";
    } else if (targetView === "milestones") {
      progSubtab = "milestones";
    } else if (targetView === "calc-milestones") {
      targetView = "calculator";
      calcSubtab = "milestones";
    } else if (targetView === "calc-single" || targetView === "calculator") {
      targetView = "calculator";
      calcSubtab = "single";
    }

    navTabs.forEach(t => {
      const tabId = t.getAttribute("data-tab");
      if (tabId === targetView || (targetView === "calculator" && (tabId === "calc-single" || tabId === "calc-milestones"))) {
        t.classList.add("active");
      } else {
        t.classList.remove("active");
      }
    });

    tabViews.forEach(v => {
      if (v.id === `view-${targetView}` || (targetView === "calculator" && (v.id === "view-calc-single" || v.id === "view-calc-milestones"))) {
        v.classList.add("active");
      } else {
        v.classList.remove("active");
      }
    });

    if (progSubtab) {
      switchProgressionSubtab(progSubtab);
    }
    if (calcSubtab) {
      switchCalculatorSubtab(calcSubtab);
    }

    if (targetView === "synthetic") {
      renderSyntheticView();
      if (window.ControlRoomEngine && typeof window.ControlRoomEngine.init === 'function') {
        setTimeout(() => window.ControlRoomEngine.init(), 50);
      }
    } else if (targetView === "milestones") {
      renderMilestones();
      renderPhases();
    } else if (targetView === "energy") {
      if (typeof initPowerCalculatorUI === 'function') {
        // Déjà initialisé ou actualisé
      }
    } else if (targetView === "logistics") {
      if (typeof initLogisticsUI === 'function') {
        initLogisticsUI();
      }
    } else if (targetView === "mam") {
      if (typeof initMAMUI === 'function') {
        initMAMUI();
      }
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

    // Sous-navigation Synthèse & Salle de Contrôle
    document.querySelectorAll("[data-synth-subtab]").forEach(btn => {
      btn.addEventListener("click", () => {
        const targetSubtab = btn.getAttribute("data-synth-subtab");
        switchSyntheticSubtab(targetSubtab);
      });
    });

    document.querySelectorAll(".btn-switch-to-ms-calc").forEach(btn => {
      btn.addEventListener("click", () => {
        switchTab("calc-milestones");
      });
    });

    document.querySelectorAll(".btn-switch-to-single-calc").forEach(btn => {
      btn.addEventListener("click", () => {
        switchTab("calculator");
      });
    });
  }

  // =========================================================================
  // GESTION DE LA PERSONNALISATION DE L'AFFICHAGE & SECTIONS REPLIABLES
  // =========================================================================
  const DisplayPreferencesManager = {
    STORAGE_KEY_TABS: "ficsit_visible_tabs",
    STORAGE_KEY_COLLAPSED: "ficsit_collapsed_sections",

    allTabs: [
      { id: "synthetic", label: "Synthèse & Salle de Contrôle", icon: "📊" },
      { id: "milestones", label: "Jalons & Ascenseur Spatial", icon: "📋" },
      { id: "mam", label: "MAM & Disques Durs", icon: "🔬" },
      { id: "calculator", label: "Usines & Production", icon: "🏭" },
      { id: "energy", label: "Centrales & Énergie", icon: "⚡" },
      { id: "logistics", label: "Logistique & Transports", icon: "🚚" },
      { id: "checklist", label: "Checklist de Chantier", icon: "🏗️" },
      { id: "map", label: "Carte des Ressources", icon: "🗺️" }
    ],

    getVisibleTabs() {
      try {
        const saved = localStorage.getItem(this.STORAGE_KEY_TABS);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.warn("Erreur lecture ficsit_visible_tabs", e);
      }
      return this.allTabs.map(t => t.id);
    },

    saveVisibleTabs(tabs) {
      try {
        localStorage.setItem(this.STORAGE_KEY_TABS, JSON.stringify(tabs));
      } catch (e) {}
    },

    getCollapsedSections() {
      try {
        const saved = localStorage.getItem(this.STORAGE_KEY_COLLAPSED);
        if (saved) return JSON.parse(saved);
      } catch (e) {}
      return {};
    },

    saveCollapsedSections(collapsedMap) {
      try {
        localStorage.setItem(this.STORAGE_KEY_COLLAPSED, JSON.stringify(collapsedMap));
      } catch (e) {}
    },

    init() {
      this.renderTabsDropdown();
      this.applyTabPreferences();
      this.initCollapsibleSections();
      this.bindEvents();
    },

    renderTabsDropdown() {
      const listEl = document.getElementById("display-tabs-toggles");
      if (!listEl) return;

      const visibleTabs = this.getVisibleTabs();

      listEl.innerHTML = this.allTabs.map(tab => {
        const isChecked = visibleTabs.includes(tab.id);
        return `
          <label class="display-tab-switch-item" data-tab-toggle="${tab.id}">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 15px;">${tab.icon}</span>
              <span style="font-size: 12px; font-weight: 600; color: #e2e8f0;">${tab.label}</span>
            </div>
            <input type="checkbox" class="ficsit-switch-input" data-tab-id="${tab.id}" ${isChecked ? "checked" : ""}>
            <span class="ficsit-switch-slider"></span>
          </label>
        `;
      }).join("");
    },

    applyTabPreferences() {
      const visibleTabs = this.getVisibleTabs();
      let activeTabVisible = false;
      let firstVisibleTab = null;

      navTabs.forEach(tab => {
        const tabId = tab.getAttribute("data-tab");
        if (visibleTabs.includes(tabId)) {
          tab.style.display = "";
          if (!firstVisibleTab) firstVisibleTab = tabId;
          if (tab.classList.contains("active")) activeTabVisible = true;
        } else {
          tab.style.display = "none";
        }
      });

      // Si l'onglet actif a été masqué, basculer sur le premier onglet visible
      if (!activeTabVisible && firstVisibleTab) {
        switchTab(firstVisibleTab);
      }
    },

    toggleTabVisibility(tabId, isVisible) {
      let visibleTabs = this.getVisibleTabs();
      if (isVisible) {
        if (!visibleTabs.includes(tabId)) visibleTabs.push(tabId);
      } else {
        if (visibleTabs.length <= 1) {
          alert("Au moins un onglet de navigation doit rester visible !");
          this.renderTabsDropdown();
          return;
        }
        visibleTabs = visibleTabs.filter(id => id !== tabId);
      }

      this.saveVisibleTabs(visibleTabs);
      this.applyTabPreferences();
    },

    initCollapsibleSections() {
      const collapsedMap = this.getCollapsedSections();

      // Sélecteur ciblant les sections identifiées et les card-panels
      const candidateElements = document.querySelectorAll(
        ".collapsible-section, [data-collapsible-id], .tab-view > .card-panel"
      );

      candidateElements.forEach(el => {
        const id = el.getAttribute("data-collapsible-id") || el.id || el.getAttribute("id");
        if (!id) return;

        // Trouver ou créer l'en-tête
        const header = el.querySelector(":scope > .panel-header, :scope > div:first-child");
        if (!header) return;

        // Vérifier si un bouton de repliage existe déjà
        let btn = header.querySelector(".btn-toggle-collapse");
        if (!btn) {
          btn = document.createElement("button");
          btn.type = "button";
          btn.className = "btn-toggle-collapse";
          btn.title = "Replier / Déplier cette section";
          btn.innerHTML = `<span>▲ Replier</span>`;
          
          // Ajouter dans les actions de l'en-tête ou à la fin
          const actionsContainer = header.querySelector("div[style*='display: flex']:last-child") || header;
          actionsContainer.appendChild(btn);
        }

        btn.onclick = (e) => {
          e.stopPropagation();
          this.toggleSectionCollapse(el, id);
        };

        // État initial
        if (collapsedMap[id]) {
          el.classList.add("is-collapsed");
          btn.innerHTML = `<span>▼ Déplier</span>`;
        } else {
          el.classList.remove("is-collapsed");
          btn.innerHTML = `<span>▲ Replier</span>`;
        }
      });
    },

    toggleSectionCollapse(el, id) {
      const isNowCollapsed = !el.classList.contains("is-collapsed");
      el.classList.toggle("is-collapsed", isNowCollapsed);

      const btn = el.querySelector(".btn-toggle-collapse");
      if (btn) {
        btn.innerHTML = isNowCollapsed 
          ? `<span>▼ Déplier</span>` 
          : `<span>▲ Replier</span>`;
      }

      const collapsedMap = this.getCollapsedSections();
      if (isNowCollapsed) {
        collapsedMap[id] = true;
      } else {
        delete collapsedMap[id];
      }
      this.saveCollapsedSections(collapsedMap);
    },

    resetAll() {
      localStorage.removeItem(this.STORAGE_KEY_TABS);
      localStorage.removeItem(this.STORAGE_KEY_COLLAPSED);

      this.renderTabsDropdown();
      this.applyTabPreferences();

      document.querySelectorAll(".is-collapsed").forEach(el => {
        el.classList.remove("is-collapsed");
        const btn = el.querySelector(".btn-toggle-collapse");
        if (btn) {
          btn.innerHTML = `<span>▲ Replier</span>`;
        }
      });

      const popover = document.getElementById("display-settings-popover");
      if (popover) popover.style.display = "none";
    },

    bindEvents() {
      const toggleBtn = document.getElementById("btn-toggle-display-menu");
      const popover = document.getElementById("display-settings-popover");
      const closeBtn = document.getElementById("btn-close-display-popover");
      const resetBtn = document.getElementById("btn-reset-display-prefs");

      if (toggleBtn && popover) {
        toggleBtn.onclick = (e) => {
          e.stopPropagation();
          const isHidden = popover.style.display === "none" || !popover.style.display;
          popover.style.display = isHidden ? "block" : "none";
        };

        document.addEventListener("click", (e) => {
          if (popover && popover.style.display === "block" && !popover.contains(e.target) && e.target !== toggleBtn && !toggleBtn.contains(e.target)) {
            popover.style.display = "none";
          }
        });
      }

      if (closeBtn && popover) {
        closeBtn.onclick = () => {
          popover.style.display = "none";
        };
      }

      if (resetBtn) {
        resetBtn.onclick = () => {
          if (confirm("Voulez-vous réinitialiser tous les menus et sections visibles par défaut ?")) {
            this.resetAll();
          }
        };
      }

      const listEl = document.getElementById("display-tabs-toggles");
      if (listEl) {
        listEl.addEventListener("change", (e) => {
          if (e.target.classList.contains("ficsit-switch-input")) {
            const tabId = e.target.getAttribute("data-tab-id");
            const isChecked = e.target.checked;
            this.toggleTabVisibility(tabId, isChecked);
          }
        });
      }
    }
  };

  // =========================================================================
  // AFFICHAGE DES JALONS (TIERS 0 À 9)
  // =========================================================================
  function renderMilestones() {
    const container = document.getElementById("milestones-accordion");
    if (!container) return;

    // Sous-navigation Jalons vs Ascenseur Spatial
    const progSubnavBtns = document.querySelectorAll("[data-prog-subtab]");
    progSubnavBtns.forEach(btn => {
      btn.onclick = () => {
        const targetSubtab = btn.getAttribute("data-prog-subtab");
        switchProgressionSubtab(targetSubtab);
      };
    });

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
            nextMilestones.push({ id: m.id, tier: t.tier, name: m.name, cost: m.cost, buildings: m.buildings });
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

    // Panneau de Synchronisation / Import de Sauvegarde .SAV
    let saveWidgetHtml = "";
    if (STATE.saveSessionInfo) {
      const s = STATE.saveSessionInfo;
      saveWidgetHtml = `
        <div class="card-panel" style="margin-bottom: 20px; border-left: 4px solid var(--ficsit-green); background: var(--bg-surface); padding: 18px;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 14px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="font-size: 28px;">💾</span>
              <div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="background: var(--ficsit-green); color: #000; font-weight: 800; font-size: 10.5px; padding: 2px 7px; border-radius: 4px; font-family: var(--font-display);">SAUVEGARDE SYNCHRONISÉE</span>
                  <h3 style="margin: 0; font-family: var(--font-display); font-size: 17px; color: #fff;">${s.sessionName}</h3>
                </div>
                <div style="font-size: 12px; color: var(--text-secondary); margin-top: 3px;">
                  Temps de jeu : <strong style="color: var(--text-primary);">${s.playtime}</strong> • Version : <strong style="color: var(--text-primary);">${s.buildVersion}</strong>
                </div>
              </div>
            </div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <button type="button" id="btn-synth-resync-save" class="btn-ficsit" style="font-size: 11.5px; padding: 6px 12px; background: var(--ficsit-green); color: #000; font-weight: 700;">
                <span>🔄</span> Remplacer la Sauvegarde
              </button>
              <button type="button" id="btn-synth-disconnect-save" class="btn-outline" style="font-size: 11.5px; padding: 6px 10px; border-color: rgba(239, 68, 68, 0.5); color: #f87171;">
                <span>❌</span> Déconnecter
              </button>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 10px;">
            <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 6px; padding: 10px 12px;">
              <div style="font-size: 10.5px; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Jalons Débloqués</div>
              <div style="font-size: 17px; font-weight: 800; color: var(--ficsit-orange); font-family: var(--font-display);">${s.unlockedMilestonesCount} / 46</div>
            </div>
            <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 6px; padding: 10px 12px;">
              <div style="font-size: 10.5px; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Phases Ascenseur</div>
              <div style="font-size: 17px; font-weight: 800; color: var(--ficsit-amber); font-family: var(--font-display);">${s.unlockedPhasesCount} / 5</div>
            </div>
            <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 6px; padding: 10px 12px;">
              <div style="font-size: 10.5px; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Recettes Alternatives</div>
              <div style="font-size: 17px; font-weight: 800; color: #4ade80; font-family: var(--font-display);">${s.unlockedRecipesCount} / 41</div>
            </div>
          </div>
          <input type="file" id="synth-save-file-input" accept=".sav" style="display: none;">
        </div>
      `;
    } else {
      saveWidgetHtml = `
        <div id="synth-save-dropzone" class="card-panel" style="margin-bottom: 20px; border: 2px dashed var(--ficsit-green); background: rgba(16, 185, 129, 0.05); padding: 22px; cursor: pointer; transition: all 0.2s ease;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
            <div style="display: flex; align-items: center; gap: 16px; flex: 1; min-width: 280px;">
              <div style="font-size: 34px; background: rgba(16, 185, 129, 0.15); width: 56px; height: 56px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-sm); border: 1px solid rgba(16, 185, 129, 0.35);">📁</div>
              <div>
                <h3 style="margin: 0; font-family: var(--font-display); font-size: 17px; color: var(--ficsit-green);">
                  💾 Importez votre Sauvegarde Satisfactory (.SAV)
                </h3>
                <p style="margin: 4px 0 0 0; font-size: 12.5px; color: var(--text-secondary); line-height: 1.4;">
                  Glissez-déposez votre fichier <code>.sav</code> ici pour synchroniser instantanément vos jalons, phases, recherches du MAM et recettes de disques durs.
                </p>
              </div>
            </div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <button type="button" id="btn-synth-upload-save" class="btn-ficsit" style="font-size: 12px; padding: 8px 16px; background: var(--ficsit-green); color: #000; font-weight: 800;">
                <span>📂</span> Parcourir (.sav)...
              </button>
              <button type="button" id="btn-synth-copy-path" class="btn-outline" style="font-size: 12px; padding: 8px 14px;">
                <span>📋</span> Copier l'Emplacement Windows
              </button>
            </div>
          </div>
          <input type="file" id="synth-save-file-input" accept=".sav" style="display: none;">
        </div>
      `;
    }

    container.innerHTML = `
      ${saveWidgetHtml}

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
        <div class="tech-summary-card" style="border-top: 2px solid #38bdf8;">
          <h3>⚡ Outils d'Ingénierie & Blueprints</h3>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <button type="button" class="btn-outline btn-synth-nav" data-tab="calculator" style="text-align: left; padding: 10px 14px; display: flex; align-items: center; justify-content: space-between; border-color: rgba(56, 189, 248, 0.4); background: rgba(56, 189, 248, 0.05); cursor: pointer; border-radius: var(--radius-sm);">
              <div>
                <strong style="color: #38bdf8; font-size: 13px;">🔩 Pièces Uniques</strong>
                <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">Calculateur de cadence, notice 3D et export .sbp</div>
              </div>
              <span style="font-size: 14px; color: #38bdf8;">➔</span>
            </button>
            <button type="button" class="btn-outline btn-synth-nav" data-tab="calc-milestones" style="text-align: left; padding: 10px 14px; display: flex; align-items: center; justify-content: space-between; border-color: rgba(16, 185, 129, 0.4); background: rgba(16, 185, 129, 0.05); cursor: pointer; border-radius: var(--radius-sm);">
              <div>
                <strong style="color: #10b981; font-size: 13px;">🏭 Usines de Jalons</strong>
                <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">Complexes multi-lignes, optimisation et blueprint complet</div>
              </div>
              <span style="font-size: 14px; color: #10b981;">➔</span>
            </button>
            <button type="button" class="btn-outline btn-synth-nav" data-tab="phases" style="text-align: left; padding: 10px 14px; display: flex; align-items: center; justify-content: space-between; border-color: rgba(245, 158, 11, 0.4); background: rgba(245, 158, 11, 0.05); cursor: pointer; border-radius: var(--radius-sm);">
              <div>
                <strong style="color: var(--ficsit-amber); font-size: 13px;">🚀 Ascenseur Spatial</strong>
                <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">Phases 1 à 5 et pièces du Projet Assemblée</div>
              </div>
              <span style="font-size: 14px; color: var(--ficsit-amber);">➔</span>
            </button>
            <button type="button" class="btn-outline btn-synth-nav" data-tab="map" style="text-align: left; padding: 10px 14px; display: flex; align-items: center; justify-content: space-between; border-color: rgba(168, 85, 247, 0.4); background: rgba(168, 85, 247, 0.05); cursor: pointer; border-radius: var(--radius-sm);">
              <div>
                <strong style="color: #a855f7; font-size: 13px;">🗺️ Carte des Ressources</strong>
                <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">Visualiseur satellite, radar et injection dans le calculateur</div>
              </div>
              <span style="font-size: 14px; color: #a855f7;">➔</span>
            </button>
          </div>
        </div>
      </div>
    `;

    // Câblage des événements du widget d'import de sauvegarde
    const synthFileInput = document.getElementById("synth-save-file-input");
    const synthUploadBtn = document.getElementById("btn-synth-upload-save");
    const synthResyncBtn = document.getElementById("btn-synth-resync-save");
    const synthDropzone = document.getElementById("synth-save-dropzone");
    const synthCopyPathBtn = document.getElementById("btn-synth-copy-path");
    const synthDisconnectBtn = document.getElementById("btn-synth-disconnect-save");

    if (synthUploadBtn && synthFileInput) {
      synthUploadBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        synthFileInput.click();
      });
    }

    if (synthResyncBtn && synthFileInput) {
      synthResyncBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        synthFileInput.click();
      });
    }

    if (synthFileInput) {
      synthFileInput.addEventListener("change", (e) => {
        if (e.target.files.length > 0 && typeof window.processAndApplySaveFile === 'function') {
          window.processAndApplySaveFile(e.target.files[0]);
        }
      });
    }

    if (synthDropzone) {
      synthDropzone.addEventListener("click", () => {
        if (synthFileInput) synthFileInput.click();
      });

      synthDropzone.addEventListener("dragover", (e) => {
        e.preventDefault();
        synthDropzone.style.borderColor = "#4ade80";
        synthDropzone.style.background = "rgba(16, 185, 129, 0.15)";
      });

      synthDropzone.addEventListener("dragleave", () => {
        synthDropzone.style.borderColor = "var(--ficsit-green)";
        synthDropzone.style.background = "rgba(16, 185, 129, 0.05)";
      });

      synthDropzone.addEventListener("drop", (e) => {
        e.preventDefault();
        synthDropzone.style.borderColor = "var(--ficsit-green)";
        synthDropzone.style.background = "rgba(16, 185, 129, 0.05)";
        if (e.dataTransfer.files.length > 0 && typeof window.processAndApplySaveFile === 'function') {
          window.processAndApplySaveFile(e.dataTransfer.files[0]);
        }
      });
    }

    if (synthCopyPathBtn) {
      synthCopyPathBtn.addEventListener("click", (e) => {
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

    if (synthDisconnectBtn) {
      synthDisconnectBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        STATE.saveSessionInfo = null;
        STATE.recipeFilterMode = "all";
        saveState();
        renderSyntheticView();
        showToast("Sauvegarde déconnectée.");
      });
    }

    // Écouteurs pour les boutons de calcul rapide dans la vue synthétique
    container.querySelectorAll(".btn-quick-calc-nm").forEach((btn, idx) => {
      btn.addEventListener("click", () => {
        const targetNm = nextMilestones[idx];
        if (targetNm) {
          loadMilestoneIntoCalculator(targetNm);
        }
      });
    });

    // Écouteurs pour les raccourcis d'onglets de la vue synthétique
    container.querySelectorAll(".btn-synth-nav").forEach(btn => {
      btn.addEventListener("click", () => {
        const tab = btn.getAttribute("data-tab");
        if (tab) switchTab(tab);
      });
    });
  }

  function getMilestoneOrPhaseById(id) {
    const phase = (MILESTONES_DATA.phases || []).find(p => p.id === id);
    if (phase) return { ...phase, isPhase: true };

    for (const tierObj of (MILESTONES_DATA.tiers || [])) {
      const ms = (tierObj.milestones || []).find(m => m.id === id);
      if (ms) return { ...ms, isMilestone: true, tier: tierObj.tier };
    }
    return null;
  }

  function loadMilestoneIntoCalculator(milestone, timeMinutes = 15) {
    const msId = (milestone.id || "").toLowerCase();
    const msName = (milestone.name || "").toLowerCase();

    // Redirection intelligente si le jalon concerne l'énergie/centrales
    if (msId.includes("coal_power") || msName.includes("charbon")) {
      switchTab("energy");
      if (typeof selectEnergyTechGlobal === 'function') {
        selectEnergyTechGlobal("coal_standard");
      }
      showToast(`⚡ Centrale à Charbon dimensionnée pour le Jalon : "${milestone.name}"`);
      return;
    } else if (msId.includes("fuel_power") || msName.includes("carburant") || msName.includes("pétrole")) {
      switchTab("energy");
      if (typeof selectEnergyTechGlobal === 'function') {
        selectEnergyTechGlobal("fuel_standard");
      }
      showToast(`⚡ Centrale au Carburant dimensionnée pour le Jalon : "${milestone.name}"`);
      return;
    } else if (msId.includes("nuclear") || msName.includes("nucléaire")) {
      switchTab("energy");
      if (typeof selectEnergyTechGlobal === 'function') {
        selectEnergyTechGlobal("nuclear_uranium");
      }
      showToast(`⚡ Centrale Nucléaire dimensionnée pour le Jalon : "${milestone.name}"`);
      return;
    }

    const msSelect = document.getElementById("calc-ms-select");
    const timeSelect = document.getElementById("calc-ms-time-select");
    if (msSelect) msSelect.value = milestone.id;
    if (timeSelect) timeSelect.value = String(timeMinutes);

    executeMilestoneCalculation(false);
    switchTab("calc-milestones");
    showToast(`Usine complète calculée pour le Jalon : "${milestone.name}" (${timeMinutes} min)`);
  }

  function loadPhaseIntoCalculator(phase, timeMinutes = 30) {
    const msSelect = document.getElementById("calc-ms-select");
    const timeSelect = document.getElementById("calc-ms-time-select");
    if (msSelect) msSelect.value = phase.id;
    if (timeSelect) timeSelect.value = String(timeMinutes);

    executeMilestoneCalculation(false);
    switchTab("calc-milestones");
    showToast(`Usine complète calculée pour : "${phase.name}" (${timeMinutes} min)`);
  }

  function updateRecipeFilterModeUI() {
    const mode = STATE.recipeFilterMode || "all";
    document.querySelectorAll(".btn-alt-mode-toggle").forEach(btn => {
      const bMode = btn.getAttribute("data-mode");
      if (bMode === mode) {
        btn.classList.add("active");
        btn.style.background = bMode === 'save' ? 'var(--ficsit-green)' : (bMode === 'custom' ? 'var(--ficsit-blue)' : 'var(--ficsit-orange)');
        btn.style.color = "#000";
        btn.style.fontWeight = "800";
        btn.style.border = "none";
      } else {
        btn.classList.remove("active");
        btn.style.background = "var(--bg-surface-elevated)";
        btn.style.color = "var(--text-secondary)";
        btn.style.fontWeight = "normal";
        btn.style.border = "1px solid var(--border-subtle)";
      }
    });
  }

  function updateAltRecipeCounters() {
    const activeCount = Object.keys(STATE.activeAltRecipes || {}).length;
    const countEl = document.getElementById("count-active-alts-label");
    const countMsEl = document.getElementById("count-active-alts-label-ms");
    if (countEl) countEl.innerText = `${activeCount}`;
    if (countMsEl) countMsEl.innerText = `${activeCount}`;
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

    // Sous-navigation Pièces Uniques vs Usines Complètes
    const calcSubnavBtns = document.querySelectorAll("[data-calc-subtab]");
    calcSubnavBtns.forEach(btn => {
      btn.onclick = () => {
        const targetSubtab = btn.getAttribute("data-calc-subtab");
        switchCalculatorSubtab(targetSubtab);
      };
    });

    // Boutons de basculement de mode de recettes alternatives (all / save / custom)
    document.querySelectorAll(".btn-alt-mode-toggle").forEach(btn => {
      btn.addEventListener("click", () => {
        const mode = btn.getAttribute("data-mode") || "all";
        if (mode === "save" && (!STATE.unlockedAltRecipes || STATE.unlockedAltRecipes.size === 0)) {
          showToast("⚠️ Aucune sauvegarde chargée. Ouvrez '🔄 Synchroniser .SAV' pour charger votre fichier.");
          const modal = document.getElementById("save-sync-modal");
          if (modal) modal.style.display = "flex";
          return;
        }
        STATE.recipeFilterMode = mode;
        updateRecipeFilterModeUI();
        saveState();
        executeCalculation(true);
        if (typeof executeMilestoneCalculation === "function") {
          executeMilestoneCalculation(true);
        }
        showToast(`Mode recettes alternatives : ${mode === 'save' ? '💾 Ma Sauvegarde' : (mode === 'custom' ? '🛠️ Personnalisé' : '🌐 Toutes')}`);
      });
    });

    const openAltModalBtn = document.getElementById("btn-open-alt-recipes-modal");
    if (openAltModalBtn) {
      openAltModalBtn.onclick = () => {
        AltRecipesManager.open(STATE.recipeFilterMode === "save" ? "save" : "current");
      };
    }

    const openMsAltModalBtn = document.getElementById("btn-open-ms-alt-recipes-modal");
    if (openMsAltModalBtn) {
      openMsAltModalBtn.onclick = () => {
        AltRecipesManager.open(STATE.recipeFilterMode === "save" ? "save" : "current");
      };
    }

    updateRecipeFilterModeUI();
    updateAltRecipeCounters();

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
    const sendToChecklistAll = [sendToChecklistBtn, document.getElementById("btn-send-to-checklist")];
    sendToChecklistAll.forEach(btn => {
      if (btn) {
        btn.addEventListener("click", () => {
          if (!STATE.lastCalculation) executeCalculation(false);
          if (!STATE.lastCalculation) return;
          addCalculationToChecklist(STATE.lastCalculation);
          showToast("Chaîne de production envoyée à la Checklist de Chantier !");
          switchTab("checklist");
        });
      }
    });

    // Envoyer vers le module Logistique
    const sendToLogisticsBtn = document.getElementById("btn-send-to-logistics");
    if (sendToLogisticsBtn) {
      sendToLogisticsBtn.addEventListener("click", () => {
        if (!STATE.lastCalculation) executeCalculation(false);
        const item = itemSelect ? itemSelect.value : "iron_plate";
        const rate = (STATE.lastCalculation && STATE.lastCalculation.targetRate) ? STATE.lastCalculation.targetRate : 60;
        if (typeof window.injectIntoLogistics === 'function') {
          window.injectIntoLogistics(item, rate);
        }
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
    
    let allowedRecipeIds = null;
    if (STATE.recipeFilterMode === "save") {
      allowedRecipeIds = Array.from(STATE.unlockedAltRecipes || []);
    } else if (STATE.recipeFilterMode === "custom") {
      allowedRecipeIds = Object.values(STATE.activeAltRecipes || {});
    }
    
    const opt = calculator.optimize(targets, "min_buildings", allowedRecipeIds);

    // Mettre à jour l'état local
    STATE.activeAltRecipes = { ...opt.recipeMap };
    updateAltRecipeCounters();
    
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
              L'algorithme a comparé toutes les combinaisons alternatives de l'arbre technologique 1.2.
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

  // =========================================================================
  // CALCULATEUR D'USINES COMPLÈTES DE JALONS & PHASES (MULTI-LIGNES)
  // =========================================================================
  function initMilestoneCalculatorUI() {
    const msSelect = document.getElementById("calc-ms-select");
    const timeSelect = document.getElementById("calc-ms-time-select");
    const runBtn = document.getElementById("btn-calc-ms-run");
    const optimizeBtn = document.getElementById("btn-calc-ms-optimize");
    const sendToChecklistTop = document.getElementById("btn-calc-ms-send-checklist-top");
    const sendToChecklistSide = document.getElementById("btn-calc-ms-send-to-checklist");
    const printBtn = document.getElementById("btn-calc-ms-print-sheet");

    if (!msSelect) return;

    let optionsHtml = "";

    // 1. Phases de l'Ascenseur Spatial
    if (MILESTONES_DATA.phases && MILESTONES_DATA.phases.length > 0) {
      optionsHtml += `<optgroup label="🚀 Ascenseur Spatial (Phases 1 à 5)">`;
      MILESTONES_DATA.phases.forEach(ph => {
        const costStr = Object.entries(ph.cost).map(([it, q]) => `${q} ${ITEM_NAMES[it]||it}`).join(", ");
        optionsHtml += `<option value="${ph.id}">${ph.name} [${costStr}]</option>`;
      });
      optionsHtml += `</optgroup>`;
    }

    // 2. Jalons des Paliers 0 à 9
    if (MILESTONES_DATA.tiers && MILESTONES_DATA.tiers.length > 0) {
      MILESTONES_DATA.tiers.forEach(tierObj => {
        optionsHtml += `<optgroup label="${tierObj.name}">`;
        (tierObj.milestones || []).forEach(m => {
          const costStr = Object.entries(m.cost || {}).map(([it, q]) => `${q} ${ITEM_NAMES[it]||it}`).join(", ");
          optionsHtml += `<option value="${m.id}">${m.name} (${costStr})</option>`;
        });
        optionsHtml += `</optgroup>`;
      });
    }

    msSelect.innerHTML = optionsHtml;
    // Sélection par défaut : Logistique Mk.1 si disponible, sinon première option
    if (msSelect.querySelector('option[value="tier_1_logistics_1"]')) {
      msSelect.value = "tier_1_logistics_1";
    } else if (msSelect.options[0]) {
      msSelect.value = msSelect.options[0].value;
    }

    msSelect.addEventListener("change", () => {
      executeMilestoneCalculation(false);
    });

    if (timeSelect) {
      timeSelect.addEventListener("change", () => {
        executeMilestoneCalculation(false);
      });
    }

    if (runBtn) {
      runBtn.addEventListener("click", () => {
        executeMilestoneCalculation(false);
      });
    }

    if (optimizeBtn) {
      optimizeBtn.addEventListener("click", () => {
        executeMilestoneOptimization();
      });
    }

    const ocSelect = document.getElementById("calc-ms-global-overclock");
    if (ocSelect) {
      ocSelect.value = String(STATE.calcOverclock || 100);
      ocSelect.addEventListener("change", () => {
        executeMilestoneCalculation(true);
      });
    }

    const slChk = document.getElementById("calc-ms-global-somersloop");
    if (slChk) {
      slChk.checked = !!STATE.calcSomersloop;
      slChk.addEventListener("change", () => {
        executeMilestoneCalculation(true);
      });
    }

    const resetAltsBtn = document.getElementById("btn-reset-ms-standard-recipes");
    if (resetAltsBtn) {
      resetAltsBtn.addEventListener("click", () => {
        calculator.initDefaultRecipes();
        STATE.activeAltRecipes = {};
        saveState();
        const reportEl = document.getElementById("calc-ms-optimizer-report");
        if (reportEl) reportEl.style.display = "none";
        executeMilestoneCalculation(false);
        showToast("Recettes réinitialisées aux standards officiels.");
      });
    }

    const sendToChecklistFn = () => {
      if (!STATE.lastMilestoneCalculation) return;
      addCalculationToChecklist(STATE.lastMilestoneCalculation);
      showToast("Complexe de jalon envoyé à la Checklist de Chantier !");
      switchTab("checklist");
    };

    if (sendToChecklistTop) sendToChecklistTop.addEventListener("click", sendToChecklistFn);
    if (sendToChecklistSide) sendToChecklistSide.addEventListener("click", sendToChecklistFn);

    if (printBtn) {
      printBtn.addEventListener("click", () => {
        openPrintSpecSheet("milestone");
      });
    }

    const downloadMsSbpFn = async () => {
      if (!STATE.lastMilestoneCalculation || !STATE.lastMilestoneCalculation.productionSteps || STATE.lastMilestoneCalculation.productionSteps.length === 0) {
        executeMilestoneCalculation(false);
      }
      const results = STATE.lastMilestoneCalculation;
      if (!results || !results.productionSteps || results.productionSteps.length === 0) {
        showToast("Veuillez d'abord calculer une usine de jalon.");
        return;
      }

      const msName = results.milestoneName || "Jalon";
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
        id: `bp_ms_${(msName).replace(/[^a-zA-Z0-9_]/g, '_')}`,
        title: `🏭 Complexe ${msName}`,
        name: `Complexe ${msName}`,
        category: "production",
        designerSize: "6x6 Fondations (Designer Mk.3)",
        description: `Complexe complet généré pour ${msName}.\n• Machines: ${totalMachines} unités\n• Puissance: ${Math.round(results.totalPowerMW)} MW.`,
        inputs: Object.entries(results.rawResources).map(([r, rate]) => `${Math.round(rate*10)/10}/m ${ITEM_NAMES[r]||r}`),
        outputs: results.targets.map(t => `+${t.rate}/min ${ITEM_NAMES[t.item]||t.item}`),
        powerMW: Math.round(results.totalPowerMW),
        buildingsCount: bldCount,
        materialsNeeded: materialsNeeded
      };

      try {
        showToast(`⏳ Génération du blueprint pour le complexe ${msName}...`);
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

    const downloadTopBtn = document.getElementById("btn-calc-ms-download-sbp-top");
    if (downloadTopBtn) downloadTopBtn.onclick = downloadMsSbpFn;

    const downloadMainBtn = document.getElementById("btn-calc-ms-download-sbp-main");
    if (downloadMainBtn) downloadMainBtn.onclick = downloadMsSbpFn;

    const deployAllStepsBtn = document.getElementById("btn-ms-deploy-all-steps");
    if (deployAllStepsBtn) {
      deployAllStepsBtn.onclick = () => {
        const rows = document.querySelectorAll("#calc-ms-table-body .calc-step-grid-row");
        const anyHidden = Array.from(rows).some(r => r.style.display === "none");
        rows.forEach(r => r.style.display = anyHidden ? "table-row" : "none");
        deployAllStepsBtn.textContent = anyHidden ? "🗺️ Replier Tous les Plans Mk.3" : "🗺️ Déployer Tous les Plans Mk.3";
      };
    }

    // Calcul initial du jalon
    executeMilestoneCalculation(true);
  }

  function executeMilestoneCalculation(isAuto = false) {
    const msSelect = document.getElementById("calc-ms-select");
    const timeSelect = document.getElementById("calc-ms-time-select");
    if (!msSelect || !timeSelect) return;

    const chosenId = msSelect.value;
    const itemData = getMilestoneOrPhaseById(chosenId);
    if (!itemData || !itemData.cost) return;

    const timeMinutes = parseFloat(timeSelect.value) || 15;
    const targets = Object.entries(itemData.cost).map(([item, qty]) => {
      const rate = Math.round((qty / timeMinutes) * 100) / 100;
      return { item, rate: Math.max(rate, 0.1) };
    });

    if (targets.length === 0) return;

    // Mise à jour de l'aperçu dynamique des cibles
    const previewEl = document.getElementById("calc-ms-target-preview");
    if (previewEl) {
      const title = itemData.isPhase ? `🚀 ${itemData.name}` : `📋 ${itemData.name}`;
      const chips = targets.map(t => {
        const totalQty = itemData.cost[t.item] || 0;
        return `<span style="background: rgba(16, 185, 129, 0.18); border: 1px solid #10b981; color: #a7f3d0; font-size: 11.5px; font-weight: 700; padding: 4px 10px; border-radius: 4px; display: inline-flex; align-items: center; gap: 5px;">
          📦 ${ITEM_NAMES[t.item] || t.item} : <strong>${totalQty} total</strong> ➔ <span style="color: #38bdf8;">${t.rate}/min</span>
        </span>`;
      }).join(" ");

      previewEl.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
          <strong style="color: #ffffff; font-size: 13px; font-family: var(--font-display);">${title}</strong>
          <span style="color: var(--text-muted); font-size: 11.5px;">(Objectif de fabrication en <strong>${timeMinutes} min</strong>)</span>
        </div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
          ${chips}
        </div>
      `;
    }

    const ocSelect = document.getElementById("calc-ms-global-overclock");
    const slChk = document.getElementById("calc-ms-global-somersloop");
    const ocVal = ocSelect ? (parseInt(ocSelect.value, 10) || 100) : STATE.calcOverclock;
    const slVal = slChk ? slChk.checked : !!STATE.calcSomersloop;

    const results = calculator.calculate(targets, {
      defaultOverclock: ocVal,
      defaultSomersloop: slVal,
      stepOverrides: STATE.stepOverrides
    });
    results.milestoneName = itemData.name;
    results.isMilestone = !itemData.isPhase;
    results.isPhase = !!itemData.isPhase;
    STATE.lastMilestoneCalculation = results;

    renderMilestoneCalculationResults(results);
    updateHUDStats();

    if (!isAuto) {
      showToast(`Usine complète calculée pour : ${itemData.name} (${timeMinutes} min)`);
    }
  }

  function executeMilestoneOptimization() {
    const msSelect = document.getElementById("calc-ms-select");
    const timeSelect = document.getElementById("calc-ms-time-select");
    const reportEl = document.getElementById("calc-ms-optimizer-report");
    if (!msSelect || !timeSelect) return;

    const chosenId = msSelect.value;
    const itemData = getMilestoneOrPhaseById(chosenId);
    if (!itemData || !itemData.cost) return;

    const timeMinutes = parseFloat(timeSelect.value) || 15;
    const targets = Object.entries(itemData.cost).map(([item, qty]) => {
      const rate = Math.round((qty / timeMinutes) * 100) / 100;
      return { item, rate: Math.max(rate, 0.1) };
    });

    let allowedRecipeIds = null;
    if (STATE.recipeFilterMode === "save") {
      allowedRecipeIds = Array.from(STATE.unlockedAltRecipes || []);
    } else if (STATE.recipeFilterMode === "custom") {
      allowedRecipeIds = Object.values(STATE.activeAltRecipes || {});
    }

    const opt = calculator.optimize(targets, "min_buildings", allowedRecipeIds);
    STATE.activeAltRecipes = { ...opt.recipeMap };
    updateAltRecipeCounters();

    const ocSelect = document.getElementById("calc-ms-global-overclock");
    const slChk = document.getElementById("calc-ms-global-somersloop");
    const ocVal = ocSelect ? (parseInt(ocSelect.value, 10) || 100) : STATE.calcOverclock;
    const slVal = slChk ? slChk.checked : !!STATE.calcSomersloop;

    const optimizedResult = calculator.calculate(targets, {
      defaultOverclock: ocVal,
      defaultSomersloop: slVal,
      stepOverrides: STATE.stepOverrides
    });
    optimizedResult.milestoneName = itemData.name;
    optimizedResult.isMilestone = !itemData.isPhase;
    optimizedResult.isPhase = !!itemData.isPhase;

    STATE.lastMilestoneCalculation = optimizedResult;
    saveState();

    if (reportEl) {
      reportEl.style.display = "block";
      const altsHtml = opt.chosenAlts.map(alt => {
        return `<span style="background: rgba(250, 149, 73, 0.2); border: 1px solid var(--ficsit-orange); color: var(--ficsit-orange); font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 4px;">★ ${alt.recipeName}</span>`;
      }).join(" ") || "<span style='color: var(--text-secondary); font-size: 12px;'>Les recettes standards sont déjà les plus économes en machines.</span>";

      reportEl.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; flex-wrap: wrap; gap: 10px;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="background: var(--ficsit-green); color: #000; font-weight: 900; font-size: 11px; padding: 2px 8px; border-radius: 4px;">OPTIMISATION MULTI-LIGNES</span>
              <h3 style="font-family: var(--font-display); font-size: 16px; color: var(--text-primary); margin: 0;">
                🏆 Complexe Compact : Minimum de Bâtiments
              </h3>
            </div>
            <p style="font-size: 12px; color: var(--text-secondary); margin: 4px 0 0 0;">
              Combinaison optimale trouvée pour toutes les sous-chaînes de ce jalon.
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
      `;
    }

    renderMilestoneCalculationResults(optimizedResult);
    showToast(`Optimisation de l'usine de jalon réussie : ${opt.optimal.totalMachines} machines (-${opt.savings.machinesPct}%) !`);
  }

  function groupStepsIntoMk3Modules(productionSteps) {
    if (!productionSteps || productionSteps.length === 0) return [];

    const totalMachines = productionSteps.reduce((sum, s) => sum + (s.physicalMachines || Math.ceil(s.machinesCount)), 0);
    const modules = [];

    function getBldList(steps) {
      const counts = {};
      steps.forEach(s => {
        const name = s.building ? s.building.name : "Machine";
        const c = s.physicalMachines || Math.ceil(s.machinesCount);
        counts[name] = (counts[name] || 0) + c;
      });
      return Object.entries(counts).map(([name, count]) => ({ name, count }));
    }

    function getInputsStr(steps) {
      const inSet = new Set();
      steps.forEach(s => {
        (s.inputs || []).forEach(inp => {
          inSet.add(ITEM_NAMES[inp.item] || inp.item);
        });
      });
      return Array.from(inSet).join(", ") || "Minerais Bruts";
    }

    function getOutputsStr(steps) {
      return steps.map(s => `+${Math.round(s.rateProduced * 10) / 10}/m ${ITEM_NAMES[s.itemId] || s.itemId}`).join(", ");
    }

    if (totalMachines <= 18) {
      const bldList = getBldList(productionSteps);
      modules.push({
        num: 1,
        title: "Module Tout-en-Un Intégré Mk.3",
        bldList,
        machinesCount: totalMachines,
        rawInputs: getInputsStr(productionSteps),
        outputStr: getOutputsStr(productionSteps),
        powerMW: productionSteps.reduce((sum, s) => sum + (s.powerMW || 0), 0),
        steps: productionSteps
      });
    } else {
      let currentSteps = [];
      let currentCount = 0;
      let mIdx = 1;

      productionSteps.forEach(st => {
        const count = st.physicalMachines || Math.ceil(st.machinesCount);
        if (currentCount + count > 18 && currentSteps.length > 0) {
          modules.push({
            num: mIdx,
            title: `Module #${mIdx} : Préparation [${currentSteps.map(s => s.recipeName || s.name || "Procédé").join(" + ")}]`,
            bldList: getBldList(currentSteps),
            machinesCount: currentCount,
            rawInputs: getInputsStr(currentSteps),
            outputStr: getOutputsStr(currentSteps),
            powerMW: currentSteps.reduce((sum, s) => sum + (s.powerMW || 0), 0),
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
        modules.push({
          num: mIdx,
          title: `Module #${mIdx} : Assemblage & Finition`,
          bldList: getBldList(currentSteps),
          machinesCount: currentCount,
          rawInputs: getInputsStr(currentSteps),
          outputStr: getOutputsStr(currentSteps),
          powerMW: currentSteps.reduce((sum, s) => sum + (s.powerMW || 0), 0),
          steps: [...currentSteps]
        });
      }
    }

    return modules;
  }

  function renderMilestoneCalculationResults(results) {
    const tableBody = document.getElementById("calc-ms-table-body");
    const rawResPanel = document.getElementById("calc-ms-raw-resources");
    const buildingsPanel = document.getElementById("calc-ms-buildings-summary");
    const powerTotalEl = document.getElementById("calc-ms-total-power-val");
    const shardsEl = document.getElementById("calc-ms-total-shards-val");
    const loopsEl = document.getElementById("calc-ms-total-somersloops-val");
    const altSelectorContainer = document.getElementById("alt-ms-recipes-selection");
    const bpContainer = document.getElementById("calc-ms-blueprint-mk3-container");

    if (!tableBody) return;

    if (bpContainer) bpContainer.style.display = "block";
    if (powerTotalEl) powerTotalEl.innerText = `${Math.round(results.totalPowerMW * 10) / 10} MW`;
    if (shardsEl) shardsEl.innerText = `${results.totalPowerShards || 0} éclat(s)`;
    if (loopsEl) loopsEl.innerText = `${results.totalSomersloops || 0} loop(s)`;

    // Organigramme interactif SCIM du jalon
    const chainFlowEl = document.getElementById("calc-ms-chain-flow");
    const flowViewport = document.getElementById("flowchart-ms-viewport");

    if (chainFlowEl && results.productionSteps.length > 0) {
      chainFlowEl.style.display = "block";
      SatisfactoryFlowchart.initInteractive(flowViewport, results);

      const openGlobalPlanBtn = document.getElementById("btn-open-ms-global-factory-plan");
      if (openGlobalPlanBtn) {
        openGlobalPlanBtn.onclick = () => {
          openBlueprintModal(`Organigramme SCIM : ${results.milestoneName || "Complexe de Jalon"}`, SatisfactoryFlowchart.generateSVG(results));
          SatisfactoryFlowchart.attachInteractivity(document.getElementById("modal-bp-dynamic-svg"), results);
        };
      }
    } else if (chainFlowEl) {
      chainFlowEl.style.display = "none";
    }

    // Micro-Usines Intégrées Mk.3 / Méga Complexe (Masqué - Remplacé par la Notice de Montage Pas-à-Pas)
    const integratedSection = document.getElementById("calc-ms-integrated-module-section");
    if (integratedSection) {
      integratedSection.style.display = "none";
    }

    // Notice de Montage Pas-à-Pas du Jalon
    FactoryConstructionGuide.init(results, true);

    // Tableau des plans Blueprint Mk.3
    const mk3Modules = groupStepsIntoMk3Modules(results.productionSteps);
    let tableHtml = "";

    mk3Modules.forEach(mod => {
      const bldBadges = mod.bldList.map(b => `<span style="background: rgba(56, 189, 248, 0.12); border: 1px solid rgba(56, 189, 248, 0.3); color: #e2e8f0; font-size: 11px; padding: 2px 6px; border-radius: 3px;">${b.count}× ${b.name}</span>`).join(" ");

      tableHtml += `
        <tr>
          <td>
            <div style="font-weight: 800; color: #38bdf8; font-size: 13px;">${mod.title}</div>
            <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">Designer Mk.3 (6×6 Fondations)</div>
          </td>
          <td>
            <div style="display: flex; gap: 4px; flex-wrap: wrap;">${bldBadges}</div>
            <div style="font-size: 11px; color: var(--text-secondary); margin-top: 3px;">Total : <strong>${mod.machinesCount} machines</strong></div>
          </td>
          <td>
            <div style="font-size: 12px;"><strong>Entrées :</strong> ${mod.rawInputs}</div>
            <div style="font-size: 12px; color: #4ade80; font-weight: bold; margin-top: 2px;"><strong>Sortie :</strong> ${mod.outputStr}</div>
          </td>
          <td>
            <div style="color: var(--ficsit-amber); font-weight: 800;">${Math.round(mod.powerMW)} MW</div>
            <div style="font-size: 11px; color: var(--text-muted);">${mod.steps.length} procédé(s)</div>
          </td>
        </tr>
      `;
    });

    tableBody.innerHTML = tableHtml || `<tr><td colspan="4" style="text-align: center; color: var(--text-secondary); padding: 16px;">Aucune étape de production requise.</td></tr>`;

    // Minerais bruts
    if (rawResPanel) {
      const rawEntries = Object.entries(results.rawResources || {});
      if (rawEntries.length === 0) {
        rawResPanel.innerHTML = "<div style='color: var(--text-secondary); font-size: 12px;'>Aucun minerai brut requis.</div>";
      } else {
        rawResPanel.innerHTML = rawEntries.map(([resKey, rate]) => {
          const rName = ITEM_NAMES[resKey] || resKey;
          return `
            <div style="display: flex; justify-content: space-between; font-size: 12.5px; padding: 3px 0; border-bottom: 1px solid rgba(255,255,255,0.04);">
              <span>${rName} :</span>
              <strong style="color: var(--ficsit-orange);">${Math.round(rate * 10) / 10} /min</strong>
            </div>
          `;
        }).join("");
      }
    }

    // Bâtiments
    if (buildingsPanel) {
      const bldCount = {};
      results.productionSteps.forEach(s => {
        const bName = s.building?.name || "Machine";
        const count = s.physicalMachines || Math.ceil(s.machinesCount);
        bldCount[bName] = (bldCount[bName] || 0) + count;
      });

      const totalMachinesCount = Object.values(bldCount).reduce((a, b) => a + b, 0);
      let bldHtml = Object.entries(bldCount).map(([name, count]) => `
        <div style="display: flex; justify-content: space-between; font-size: 12.5px; padding: 3px 0; border-bottom: 1px solid rgba(255,255,255,0.04);">
          <span>${name} :</span>
          <strong style="color: var(--ficsit-cyan);">${count}</strong>
        </div>
      `).join("");

      bldHtml += `
        <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 800; padding-top: 6px; margin-top: 4px; border-top: 1px solid rgba(255,255,255,0.1); color: #ffffff;">
          <span>TOTAL COMPLEXE :</span>
          <strong style="color: #4ade80;">${totalMachinesCount} machines</strong>
        </div>
      `;
      buildingsPanel.innerHTML = bldHtml;
    }

    // Recettes alternatives pour le jalon
    if (altSelectorContainer) {
      const uniqueItems = Array.from(new Set(results.productionSteps.map(s => s.itemId)));
      altSelectorContainer.innerHTML = uniqueItems.map(itemId => {
        const availableRecipes = calculator.getRecipesForItem(itemId);
        if (availableRecipes.length <= 1) return "";

        const currentActive = calculator.getActiveRecipe(itemId);
        const optionsHtml = availableRecipes.map(r => {
          const isSelected = currentActive && currentActive.id === r.id;
          return `<option value="${r.id}" ${isSelected ? "selected" : ""}>${r.name} ${r.isAlt ? "★ (Alt)" : ""}</option>`;
        }).join("");

        return `
          <div class="form-group" style="margin-bottom: 10px;">
            <label class="form-label">${ITEM_NAMES[itemId] || itemId}</label>
            <select class="form-control alt-ms-recipe-select" data-item="${itemId}">
              ${optionsHtml}
            </select>
          </div>
        `;
      }).filter(Boolean).join("");

      document.querySelectorAll(".alt-ms-recipe-select").forEach(select => {
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
          executeMilestoneCalculation(true);
          showToast(`Recette mise à jour pour ${ITEM_NAMES[it] || it}`);
        });
      });
    }

    // Badge recettes alternatives actives
    const activeCount = Object.keys(STATE.activeAltRecipes || {}).filter(k => calculator.isAltRecipe(STATE.activeAltRecipes[k])).length;
    const countBadge = document.getElementById("badge-ms-active-alt-count");
    if (countBadge) {
      countBadge.innerText = `${activeCount} active(s)`;
      countBadge.style.color = activeCount > 0 ? "var(--ficsit-orange)" : "var(--text-muted)";
      countBadge.style.borderColor = activeCount > 0 ? "var(--ficsit-orange)" : "var(--border-subtle)";
    }

    DisplayPreferencesManager.initCollapsibleSections();
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

      const isMs = (viewportEl.id && viewportEl.id.includes("ms"));
      const btnIn = document.getElementById(isMs ? "flowchart-ms-btn-zoom-in" : "flowchart-btn-zoom-in");
      const btnOut = document.getElementById(isMs ? "flowchart-ms-btn-zoom-out" : "flowchart-btn-zoom-out");
      const btnReset = document.getElementById(isMs ? "flowchart-ms-btn-reset" : "flowchart-btn-reset");
      const btnResetLayout = document.getElementById(isMs ? "flowchart-ms-btn-reset-layout" : "flowchart-btn-reset-layout");
      const btnToggleOrientation = document.getElementById(isMs ? "flowchart-ms-btn-toggle-orientation" : "flowchart-btn-toggle-orientation");
      const btnToggleHeatmap = document.getElementById(isMs ? "flowchart-ms-btn-toggle-heatmap" : "flowchart-btn-toggle-heatmap");

      const reRender = () => {
        if (isMs && STATE.lastMilestoneCalculation) {
          renderMilestoneCalculationResults(STATE.lastMilestoneCalculation);
        } else if (!isMs && STATE.lastCalculation) {
          renderCalculationResults(STATE.lastCalculation);
        }
      };

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
        reRender();
        showToast("↺ Agencement automatique du graphe rétabli.");
      };

      if (btnToggleOrientation) {
        btnToggleOrientation.innerText = SatisfactoryFlowchart.orientation === "vertical" ? "↕️ Vertic." : "↔️ Horiz.";
        btnToggleOrientation.onclick = () => {
          SatisfactoryFlowchart.orientation = SatisfactoryFlowchart.orientation === "vertical" ? "horizontal" : "vertical";
          btnToggleOrientation.innerText = SatisfactoryFlowchart.orientation === "vertical" ? "↕️ Vertic." : "↔️ Horiz.";
          SatisfactoryFlowchart.customPositions = {};
          reRender();
          showToast(`↔️ Orientation : ${SatisfactoryFlowchart.orientation === "vertical" ? "Verticale (Haut ➔ Bas)" : "Horizontale (A ➔ Z)"}`);
        };
      }

      if (btnToggleHeatmap) {
        btnToggleHeatmap.style.background = SatisfactoryFlowchart.heatmapMode ? "rgba(16, 185, 129, 0.25)" : "";
        btnToggleHeatmap.style.borderColor = SatisfactoryFlowchart.heatmapMode ? "#10b981" : "";
        btnToggleHeatmap.onclick = () => {
          SatisfactoryFlowchart.heatmapMode = !SatisfactoryFlowchart.heatmapMode;
          btnToggleHeatmap.style.background = SatisfactoryFlowchart.heatmapMode ? "rgba(16, 185, 129, 0.25)" : "";
          btnToggleHeatmap.style.borderColor = SatisfactoryFlowchart.heatmapMode ? "#10b981" : "";
          reRender();
          showToast(`🌡️ Mode Diagnostic Heatmap : ${SatisfactoryFlowchart.heatmapMode ? "ACTIVÉ" : "DÉSACTIVÉ"}`);
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
      if (typeof FactoryConstructionGuide !== "undefined" && FactoryConstructionGuide.attachGuideInteractivity) {
        FactoryConstructionGuide.attachGuideInteractivity(modalSvgContainer, STATE.lastCalculation, false);
      }
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
    singleState: { currentStepIndex: 0, steps: [], currentViewMode: "step", lastResults: null, calcKey: "", selectedMachine: null, maxBeltMk: 3, densityProfile: "standard", architectureMode: "multi_floor", footprintMode: "auto", activeFloor: 0, viewType: "2d", viewMode3D: "step" },
    msState: { currentStepIndex: 0, steps: [], currentViewMode: "step", lastResults: null, calcKey: "", selectedMachine: null, maxBeltMk: 3, densityProfile: "standard", architectureMode: "multi_floor", footprintMode: "auto", activeFloor: 0, viewType: "2d", viewMode3D: "step" },
    single3DViewer: null,
    ms3DViewer: null,
    validatedSteps: new Set(JSON.parse(localStorage.getItem("ficsit_guide_validated") || "[]")),

    // Rendu d'une dalle de fondation FICSIT 8m×8m biseautée
    renderFoundationTile(x, y, w, h, colLabel, rowLabel) {
      const qW = (w - 8) / 2;
      const qH = (h - 8) / 2;
      return `
        <g class="ficsit-foundation-tile" data-coord="${colLabel}${rowLabel}">
          <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#141822" stroke="#252f3e" stroke-width="1.2" rx="2" />
          <rect x="${x + 3}" y="${y + 3}" width="${qW}" height="${qH}" rx="2" fill="#1b222e" stroke="#253040" stroke-width="0.8" />
          <rect x="${x + w/2 + 1}" y="${y + 3}" width="${qW}" height="${qH}" rx="2" fill="#1b222e" stroke="#253040" stroke-width="0.8" />
          <rect x="${x + 3}" y="${y + h/2 + 1}" width="${qW}" height="${qH}" rx="2" fill="#1b222e" stroke="#253040" stroke-width="0.8" />
          <rect x="${x + w/2 + 1}" y="${y + h/2 + 1}" width="${qW}" height="${qH}" rx="2" fill="#1b222e" stroke="#253040" stroke-width="0.8" />
          <circle cx="${x + 5}" cy="${y + 5}" r="1.2" fill="#475569" />
          <circle cx="${x + w - 5}" cy="${y + 5}" r="1.2" fill="#475569" />
          <circle cx="${x + 5}" cy="${y + h - 5}" r="1.2" fill="#475569" />
          <circle cx="${x + w - 5}" cy="${y + h - 5}" r="1.2" fill="#475569" />
          <text x="${x + 6}" y="${y + h - 6}" fill="rgba(56, 189, 248, 0.18)" font-size="8" font-weight="bold" font-family="monospace">${colLabel}${rowLabel}</text>
        </g>
      `;
    },

    // Rendu Sprite 2D Fonderie (Smelter) Top-Down avec ports et données interactives
    renderSpriteSmelter(x, y, w, h, data, opacity = 1, isTargetStep = false, machId = "smelter_0", loc = "Dalle B5") {
      const activeGlow = isTargetStep ? `filter="drop-shadow(0 0 12px rgba(245, 158, 11, 0.75))"` : `filter="drop-shadow(0 4px 10px rgba(0,0,0,0.6))"`;
      const strokeCol = isTargetStep ? "#f59e0b" : "#3e4d62";
      const isDual = (data.building?.id === "foundry") || (data.ingredients && data.ingredients.length >= 2);
      const rName = data.recipeName || (ITEM_NAMES[data.itemId] || "Lingots");
      const machInfo = {
        id: machId,
        type: data.building?.name || (isDual ? "Fonderie avancée" : "Fonderie"),
        recipeName: rName,
        isAlt: !!data.isAlt,
        itemId: data.itemId,
        itemName: ITEM_NAMES[data.itemId] || data.itemId || "Lingot",
        rateProduced: data.rateProduced ? Math.round(data.rateProduced * 10) / 10 : 30,
        powerMW: data.powerMW ? Math.round(data.powerMW * 10) / 10 : (isDual ? 16 : 4),
        overclock: data.overclock || 100,
        ingredients: (data.ingredients && data.ingredients.length > 0)
          ? data.ingredients.map(i => ({ item: i.item, name: ITEM_NAMES[i.item] || i.item, rate: Math.round((i.rate || 0) * 10) / 10 }))
          : [{ item: "raw_ore", name: "Minerai brut", rate: Math.round((data.rateProduced || 30) * 10) / 10 }],
        location: loc
      };
      const jsonStr = encodeURIComponent(JSON.stringify(machInfo));
      return `
        <g class="ficsit-sprite-smelter ficsit-guide-clickable-machine" data-guide-mach-id="${machId}" data-mach-json="${jsonStr}" transform="translate(${x}, ${y})" opacity="${opacity}" ${activeGlow} style="cursor: pointer;">
          <title>🏭 ${machInfo.type} : ${rName} (${machInfo.rateProduced}/min)&#10;⚡ ${machInfo.powerMW} MW @ ${machInfo.overclock}%&#10;👆 Cliquer pour afficher la recette & les flux I/O</title>
          <rect x="0" y="0" width="${w}" height="${h}" rx="5" fill="#171d27" stroke="${strokeCol}" stroke-width="${isTargetStep ? 2.2 : 1.4}" />
          <rect x="2" y="8" width="4" height="${h - 16}" rx="1" fill="#ea580c" />
          <rect x="${w - 6}" y="8" width="4" height="${h - 16}" rx="1" fill="#ea580c" />
          <line x1="8" y1="18" x2="14" y2="18" stroke="#475569" stroke-width="1.2" />
          <line x1="8" y1="24" x2="14" y2="24" stroke="#475569" stroke-width="1.2" />
          <line x1="${w - 14}" y1="18" x2="${w - 8}" y2="18" stroke="#475569" stroke-width="1.2" />
          <line x1="${w - 14}" y1="24" x2="${w - 8}" y2="24" stroke="#475569" stroke-width="1.2" />
          <rect x="${w/2 - 13}" y="${h/2 - 19}" width="26" height="38" rx="13" fill="#090d14" stroke="#ea580c" stroke-width="1.2" />
          <ellipse cx="${w/2}" cy="${h/2}" rx="9" ry="14" fill="url(#smelterCoreGlow)" />
          <ellipse cx="${w/2}" cy="${h/2}" rx="5" ry="8" fill="#ffffff" opacity="0.85" />
          ${isDual ? `
            <!-- Ports d'entrée Sud Dual (Gauche & Droite) -->
            <rect x="${w/2 - 18}" y="${h - 4}" width="12" height="5" rx="1.5" fill="#1e293b" stroke="#38bdf8" stroke-width="1" />
            <circle cx="${w/2 - 12}" cy="${h - 1}" r="2.8" class="ficsit-port-in" fill="#38bdf8" stroke="#0284c7" stroke-width="1.2" />
            <rect x="${w/2 + 6}" y="${h - 4}" width="12" height="5" rx="1.5" fill="#1e293b" stroke="#38bdf8" stroke-width="1" />
            <circle cx="${w/2 + 12}" cy="${h - 1}" r="2.8" class="ficsit-port-in" fill="#38bdf8" stroke="#0284c7" stroke-width="1.2" />
          ` : `
            <!-- Port d'entrée Sud Single (Centre) -->
            <rect x="${w/2 - 8}" y="${h - 4}" width="16" height="5" rx="1.5" fill="#1e293b" stroke="#38bdf8" stroke-width="1" />
            <circle cx="${w/2}" cy="${h - 1}" r="3" class="ficsit-port-in" fill="#38bdf8" stroke="#0284c7" stroke-width="1.2" />
          `}
          <!-- Port de sortie Nord (Vert / Out) -->
          <rect x="${w/2 - 8}" y="-1" width="16" height="5" rx="1.5" fill="#1e293b" stroke="#10b981" stroke-width="1" />
          <circle cx="${w/2}" cy="1" r="3" class="ficsit-port-out" fill="#22c55e" stroke="#15803d" stroke-width="1.2" />
          <rect x="6" y="4" width="${w - 12}" height="10" rx="2" fill="#0f172a" opacity="0.9" />
          <text x="${w/2}" y="12" fill="#f59e0b" font-size="7.2" font-weight="900" text-anchor="middle" font-family="sans-serif">${isDual ? "FONDERIE AV." : "FONDERIE"}</text>
          <text x="${w/2}" y="${h - 7}" fill="#cbd5e1" font-size="7" font-weight="bold" text-anchor="middle">${rName.substring(0, 11)}</text>
        </g>
      `;
    },

    // Rendu Sprite 2D Constructeur (Constructor) Top-Down avec ports et données interactives
    renderSpriteConstructor(x, y, w, h, data, opacity = 1, isTargetStep = false, machId = "const_0", loc = "Dalle B3") {
      const activeGlow = isTargetStep ? `filter="drop-shadow(0 0 12px rgba(56, 189, 248, 0.75))"` : `filter="drop-shadow(0 4px 10px rgba(0,0,0,0.6))"`;
      const strokeCol = isTargetStep ? "#38bdf8" : "#3e4d62";
      const rName = data.recipeName || (ITEM_NAMES[data.itemId] || "Pièces");
      const machInfo = {
        id: machId,
        type: "Constructeur",
        recipeName: rName,
        isAlt: !!data.isAlt,
        itemId: data.itemId,
        itemName: ITEM_NAMES[data.itemId] || data.itemId || "Pièce usinée",
        rateProduced: data.rateProduced ? Math.round(data.rateProduced * 10) / 10 : 20,
        powerMW: data.powerMW ? Math.round(data.powerMW * 10) / 10 : 4,
        overclock: data.overclock || 100,
        ingredients: (data.ingredients && data.ingredients.length > 0)
          ? data.ingredients.map(i => ({ item: i.item, name: ITEM_NAMES[i.item] || i.item, rate: Math.round((i.rate || 0) * 10) / 10 }))
          : [{ item: "ingot", name: "Lingots nécessaires", rate: 30 }],
        location: loc
      };
      const jsonStr = encodeURIComponent(JSON.stringify(machInfo));
      return `
        <g class="ficsit-sprite-constructor ficsit-guide-clickable-machine" data-guide-mach-id="${machId}" data-mach-json="${jsonStr}" transform="translate(${x}, ${y})" opacity="${opacity}" ${activeGlow} style="cursor: pointer;">
          <title>⚙️ Constructeur : ${rName} (${machInfo.rateProduced}/min)&#10;⚡ ${machInfo.powerMW} MW @ ${machInfo.overclock}%&#10;👆 Cliquer pour afficher la recette & les flux I/O</title>
          <rect x="0" y="0" width="${w}" height="${h}" rx="5" fill="#161c26" stroke="${strokeCol}" stroke-width="${isTargetStep ? 2.2 : 1.4}" />
          <rect x="2" y="6" width="10" height="${h - 12}" fill="#0f141d" stroke="#ea580c" stroke-width="1.2" rx="1" />
          <line x1="2" y1="6" x2="12" y2="18" stroke="#f97316" stroke-width="1.2" />
          <line x1="12" y1="6" x2="2" y2="18" stroke="#f97316" stroke-width="1.2" />
          <line x1="2" y1="18" x2="12" y2="30" stroke="#f97316" stroke-width="1.2" />
          <line x1="12" y1="18" x2="2" y2="30" stroke="#f97316" stroke-width="1.2" />
          <line x1="2" y1="30" x2="12" y2="42" stroke="#f97316" stroke-width="1.2" />
          <line x1="12" y1="30" x2="2" y2="42" stroke="#f97316" stroke-width="1.2" />
          <rect x="${w - 12}" y="6" width="10" height="${h - 12}" fill="#0f141d" stroke="#ea580c" stroke-width="1.2" rx="1" />
          <line x1="${w - 12}" y1="6" x2="${w - 2}" y2="18" stroke="#f97316" stroke-width="1.2" />
          <line x1="${w - 2}" y1="6" x2="${w - 12}" y2="18" stroke="#f97316" stroke-width="1.2" />
          <line x1="${w - 12}" y1="18" x2="${w - 2}" y2="30" stroke="#f97316" stroke-width="1.2" />
          <line x1="${w - 2}" y1="18" x2="${w - 12}" y2="30" stroke="#f97316" stroke-width="1.2" />
          <line x1="${w - 12}" y1="30" x2="${w - 2}" y2="42" stroke="#f97316" stroke-width="1.2" />
          <line x1="${w - 2}" y1="30" x2="${w - 12}" y2="42" stroke="#f97316" stroke-width="1.2" />
          <rect x="15" y="16" width="${w - 30}" height="${h - 32}" rx="3" fill="#0d1219" stroke="#334155" stroke-width="1" />
          <rect x="${w/2 - 6}" y="20" width="12" height="14" rx="2" fill="#3b82f6" opacity="0.8" />
          <line x1="${w/2}" y1="20" x2="${w/2}" y2="${h - 20}" stroke="#94a3b8" stroke-width="2.5" />
          <rect x="${w/2 - 10}" y="${h/2 - 6}" width="20" height="12" rx="2" fill="#1e293b" stroke="#64748b" stroke-width="1" />
          <!-- Port d'entrée Sud (Bleu / In) -->
          <rect x="${w/2 - 8}" y="${h - 4}" width="16" height="5" rx="1.5" fill="#1e293b" stroke="#38bdf8" stroke-width="1" />
          <circle cx="${w/2}" cy="${h - 1}" r="3" class="ficsit-port-in" fill="#38bdf8" stroke="#0284c7" stroke-width="1.2" />
          <!-- Port de sortie Nord (Vert / Out) -->
          <rect x="${w/2 - 8}" y="-1" width="16" height="5" rx="1.5" fill="#1e293b" stroke="#10b981" stroke-width="1" />
          <circle cx="${w/2}" cy="1" r="3" class="ficsit-port-out" fill="#22c55e" stroke="#15803d" stroke-width="1.2" />
          <rect x="10" y="4" width="${w - 20}" height="9" rx="2" fill="#0369a1" opacity="0.9" />
          <text x="${w/2}" y="11" fill="#ffffff" font-size="7" font-weight="900" text-anchor="middle" font-family="sans-serif">CONSTRUCTEUR</text>
          <text x="${w/2}" y="${h - 6}" fill="#93c5fd" font-size="6.5" font-weight="bold" text-anchor="middle">${rName.substring(0, 11)}</text>
        </g>
      `;
    },

    // Rendu Sprite 2D Assembleuse (Assembler) Top-Down avec ports et données interactives
    renderSpriteAssembler(x, y, w, h, data, opacity = 1, isTargetStep = false, machId = "assembler_0", loc = "Dalles B1-B2") {
      const activeGlow = isTargetStep ? `filter="drop-shadow(0 0 14px rgba(168, 85, 247, 0.8))"` : `filter="drop-shadow(0 4px 12px rgba(0,0,0,0.65))"`;
      const strokeCol = isTargetStep ? "#a855f7" : "#3e4d62";
      const bldName = (data.building?.name || "Assembleuse").toUpperCase();
      const rName = data.recipeName || (ITEM_NAMES[data.itemId] || "Assemblage");
      const machInfo = {
        id: machId,
        type: data.building?.name || "Assembleuse",
        recipeName: rName,
        isAlt: !!data.isAlt,
        itemId: data.itemId,
        itemName: ITEM_NAMES[data.itemId] || data.itemId || "Composant complexe",
        rateProduced: data.rateProduced ? Math.round(data.rateProduced * 10) / 10 : 5,
        powerMW: data.powerMW ? Math.round(data.powerMW * 10) / 10 : 15,
        overclock: data.overclock || 100,
        ingredients: (data.ingredients && data.ingredients.length > 0)
          ? data.ingredients.map(i => ({ item: i.item, name: ITEM_NAMES[i.item] || i.item, rate: Math.round((i.rate || 0) * 10) / 10 }))
          : [{ item: "parts", name: "Composants d'assemblage", rate: 10 }],
        location: loc
      };
      const jsonStr = encodeURIComponent(JSON.stringify(machInfo));
      return `
        <g class="ficsit-sprite-assembler ficsit-guide-clickable-machine" data-guide-mach-id="${machId}" data-mach-json="${jsonStr}" transform="translate(${x}, ${y})" opacity="${opacity}" ${activeGlow} style="cursor: pointer;">
          <title>🧩 ${data.building?.name || "Assembleuse"} : ${rName} (${machInfo.rateProduced}/min)&#10;⚡ ${machInfo.powerMW} MW @ ${machInfo.overclock}%&#10;👆 Cliquer pour afficher la recette & les flux I/O</title>
          <rect x="0" y="0" width="${w}" height="${h}" rx="6" fill="#131822" stroke="${strokeCol}" stroke-width="${isTargetStep ? 2.4 : 1.5}" />
          <path d="M 0 24 L -6 24 L -6 44 L 0 44" stroke="#ea580c" stroke-width="2.5" fill="none" />
          <rect x="-9" y="30" width="4" height="8" rx="1" fill="#ef4444" />
          <path d="M ${w} 24 L ${w + 6} 24 L ${w + 6} 44 L ${w} 44" stroke="#ea580c" stroke-width="2.5" fill="none" />
          <rect x="${w + 5}" y="30" width="4" height="8" rx="1" fill="#ef4444" />
          <rect x="14" y="16" width="${w - 28}" height="${h - 32}" rx="8" fill="url(#assemblerGlassGlow)" stroke="#38bdf8" stroke-width="1.2" />
          <path d="M 20 22 L ${w - 30} 22" stroke="#ffffff" stroke-width="1" opacity="0.6" stroke-linecap="round" />
          <circle cx="${w/2 - 10}" cy="${h/2}" r="7" fill="none" stroke="#475569" stroke-width="1.5" stroke-dasharray="3,2" />
          <circle cx="${w/2 + 10}" cy="${h/2}" r="7" fill="none" stroke="#475569" stroke-width="1.5" stroke-dasharray="3,2" />
          <circle cx="${w/2}" cy="${h/2}" r="3" fill="#a855f7" />
          <!-- Port d'entrée 1 Sud -->
          <rect x="${w/2 - 20}" y="${h - 4}" width="14" height="5" rx="1.5" fill="#1e293b" stroke="#38bdf8" stroke-width="1" />
          <circle cx="${w/2 - 13}" cy="${h - 1}" r="3" class="ficsit-port-in" fill="#38bdf8" stroke="#0284c7" stroke-width="1.2" />
          <!-- Port d'entrée 2 Sud -->
          <rect x="${w/2 + 6}" y="${h - 4}" width="14" height="5" rx="1.5" fill="#1e293b" stroke="#38bdf8" stroke-width="1" />
          <circle cx="${w/2 + 13}" cy="${h - 1}" r="3" class="ficsit-port-in" fill="#38bdf8" stroke="#0284c7" stroke-width="1.2" />
          <!-- Port de sortie Nord -->
          <rect x="${w/2 - 9}" y="-1" width="18" height="5" rx="1.5" fill="#1e293b" stroke="#10b981" stroke-width="1" />
          <circle cx="${w/2}" cy="1" r="3.2" class="ficsit-port-out" fill="#22c55e" stroke="#15803d" stroke-width="1.2" />
          <rect x="14" y="4" width="${w - 28}" height="10" rx="2" fill="#6b21a8" opacity="0.9" />
          <text x="${w/2}" y="12" fill="#ffffff" font-size="7.5" font-weight="900" text-anchor="middle" font-family="sans-serif">${bldName.substring(0, 15)}</text>
          <text x="${w/2}" y="${h - 6}" fill="#d8b4fe" font-size="7" font-weight="bold" text-anchor="middle">${rName.substring(0, 14)}</text>
        </g>
      `;
    },

    // Rendu Sprite 2D Conteneur de Stockage Industriel
    renderSpriteStorage(x, y, w, h, targetName, opacity = 1, isTargetStep = false, machId = "storage_0", loc = "Dalle F1-F2", finalTargets = []) {
      const activeGlow = isTargetStep ? `filter="drop-shadow(0 0 14px rgba(16, 185, 129, 0.8))"` : `filter="drop-shadow(0 4px 10px rgba(0,0,0,0.6))"`;
      const strokeCol = isTargetStep ? '#10b981' : '#047857';
      const machInfo = {
        id: machId,
        type: "Conteneur de Stockage Industriel",
        recipeName: `Stockage & Logistique : ${targetName}`,
        isAlt: false,
        itemId: (finalTargets[0] && finalTargets[0].item) || "product",
        itemName: targetName,
        rateProduced: (finalTargets[0] && finalTargets[0].rate) || 10,
        powerMW: 0,
        overclock: 100,
        ingredients: (finalTargets && finalTargets.length > 0)
          ? finalTargets.map(t => ({ item: t.item, name: ITEM_NAMES[t.item] || t.item, rate: Math.round(t.rate * 10) / 10 }))
          : [{ item: "product", name: targetName, rate: 10 }],
        location: loc
      };
      const jsonStr = encodeURIComponent(JSON.stringify(machInfo));
      return `
        <g class="ficsit-guide-clickable-machine ficsit-sprite-storage" data-guide-mach-id="${machId}" data-mach-json="${jsonStr}" transform="translate(${x}, ${y})" opacity="${opacity}" ${activeGlow} style="cursor: pointer;">
          <title>📦 Conteneur de Stockage Industriel&#10;🎯 Produit Fini : ${targetName}&#10;👆 Cliquer pour afficher le récapitulatif d'expédition</title>
          <rect width="${w}" height="${h}" rx="4" fill="#064e3b" stroke="${strokeCol}" stroke-width="${isTargetStep ? 2.2 : 1.4}" />
          <line x1="10" y1="8" x2="10" y2="${h - 8}" stroke="#047857" stroke-width="2" />
          <line x1="22" y1="8" x2="22" y2="${h - 8}" stroke="#047857" stroke-width="2" />
          <line x1="34" y1="8" x2="34" y2="${h - 8}" stroke="#047857" stroke-width="2" />
          <line x1="${w - 22}" y1="8" x2="${w - 22}" y2="${h - 8}" stroke="#047857" stroke-width="2" />
          <rect x="4" y="4" width="${w - 8}" height="12" rx="2" fill="#022c22" />
          <text x="${w/2}" y="13" fill="#a7f3d0" font-size="7.5" font-weight="900" text-anchor="middle">STOCKAGE</text>
          <circle cx="10" cy="10" r="2.5" fill="#10b981" />
          <text x="${w/2}" y="${h/2 + 8}" fill="#ffffff" font-size="8" font-weight="bold" text-anchor="middle">PRODUIT FINI</text>
          <!-- Port d'entrée Ouest (Bleu/Vert) -->
          <rect x="-3" y="${h/2 - 8}" width="6" height="16" rx="1.5" fill="#1e293b" stroke="#10b981" stroke-width="1" />
          <circle cx="0" cy="${h/2}" r="3" class="ficsit-port-in" fill="#10b981" stroke="#059669" stroke-width="1.2" />
        </g>
      `;
    },

    // Rendu Sprite 2D Répartiteur (Splitter)
    renderSpriteSplitter(x, y, size = 26) {
      return `
        <g class="ficsit-sprite-splitter" transform="translate(${x - size/2}, ${y - size/2})">
          <polygon points="7,0 ${size-7},0 ${size},7 ${size},${size-7} ${size-7},${size} 7,${size} 0,${size-7} 0,7" fill="#ea580c" stroke="#f97316" stroke-width="1.2" />
          <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 5}" fill="#1e293b" stroke="#64748b" stroke-width="1" />
          <polygon points="${size/2},4 ${size/2 - 2.5},8 ${size/2 + 2.5},8" fill="#38bdf8" />
          <polygon points="${size - 4},${size/2} ${size - 8},${size/2 - 2.5} ${size - 8},${size/2 + 2.5}" fill="#38bdf8" />
          <polygon points="4,${size/2} 8,${size/2 - 2.5} 8,${size/2 + 2.5}" fill="#38bdf8" />
          <circle cx="${size/2}" cy="${size/2}" r="2" fill="#ffffff" />
        </g>
      `;
    },

    // Rendu Sprite 2D Groupeur (Merger)
    renderSpriteMerger(x, y, size = 26) {
      return `
        <g class="ficsit-sprite-merger" transform="translate(${x - size/2}, ${y - size/2})">
          <polygon points="7,0 ${size-7},0 ${size},7 ${size},${size-7} ${size-7},${size} 7,${size} 0,${size-7} 0,7" fill="#0284c7" stroke="#38bdf8" stroke-width="1.2" />
          <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 5}" fill="#1e293b" stroke="#64748b" stroke-width="1" />
          <polygon points="${size/2},4 ${size/2 - 2.5},8 ${size/2 + 2.5},8" fill="#10b981" />
          <polygon points="${size - 8},${size/2} ${size - 4},${size/2 - 2.5} ${size - 4},${size/2 + 2.5}" fill="#10b981" />
          <polygon points="8,${size/2} 4,${size/2 - 2.5} 4,${size/2 + 2.5}" fill="#10b981" />
          <circle cx="${size/2}" cy="${size/2}" r="2" fill="#ffffff" />
        </g>
      `;
    },

    // Rendu Sprite 2D Ascenseur de Convoyeur (Conveyor Lift)
    renderSpriteConveyorLift(x, y, size = 28, direction = "up", label = "Lift +8m", destFloor = 1) {
      const isUp = direction === "up";
      const mainCol = isUp ? "#f59e0b" : "#38bdf8";
      const arrowIcon = isUp ? "▲" : "▼";
      return `
        <g class="ficsit-conveyor-lift" transform="translate(${x - size/2}, ${y - size/2})">
          <title>Ascenseur Vertical FICSIT : ${label} (${isUp ? "Montée vers Étage " + destFloor : "Arrivée depuis Étage précédent"})</title>
          <rect x="0" y="0" width="${size}" height="${size}" rx="4" fill="#0b111e" stroke="${mainCol}" stroke-width="1.8" />
          <rect x="3" y="3" width="${size - 6}" height="${size - 6}" rx="2" fill="#1e293b" stroke="#334155" stroke-width="1" />
          <circle cx="${size/2}" cy="${size/2}" r="6" fill="${mainCol}" opacity="0.25" />
          <text x="${size/2}" y="${size/2 + 4}" fill="${mainCol}" font-size="11" font-weight="900" text-anchor="middle">${arrowIcon}</text>
          <text x="${size/2}" y="${size + 9}" fill="${mainCol}" font-size="7" font-weight="bold" text-anchor="middle">${label}</text>
        </g>
      `;
    },

    // Rendu Convoyeur Réaliste avec Courbe Bézier, Groupes et Identifiants pour Surbrillance
    renderCurvedConveyor(pathD, color = "#475569", width = 12, beltId = "", fromMach = "", toMach = "") {
      const idAttr = beltId ? `id="${beltId}"` : "";
      const fromAttr = fromMach ? `data-belt-from="${fromMach}"` : "";
      const toAttr = toMach ? `data-belt-to="${toMach}"` : "";
      const dataIdAttr = beltId ? `data-belt-id="${beltId}"` : "";
      return `
        <g class="ficsit-guide-conveyor" ${idAttr} ${dataIdAttr} ${fromAttr} ${toAttr}>
          <path class="belt-base" d="${pathD}" stroke="#1e242f" stroke-width="${width}" fill="none" stroke-linecap="round" stroke-linejoin="round" />
          <path class="belt-track" d="${pathD}" stroke="${color}" stroke-width="${width - 3}" fill="none" stroke-linecap="round" stroke-linejoin="round" />
          <path class="belt-center" d="${pathD}" stroke="#0b1017" stroke-width="${width - 6}" fill="none" stroke-linecap="round" stroke-linejoin="round" />
          <path class="belt-dashes flow-line" d="${pathD}" stroke="rgba(255,255,255,0.4)" stroke-width="1.8" stroke-dasharray="3,6" fill="none" stroke-linecap="round" stroke-linejoin="round" />
        </g>
      `;
    },

    // Générateur Principal du Plan Top-Down 2D Complet / Étape
    generateTopDownFactoryBlueprintSVG(results, targetStepId = null, activeState = null) {
      const steps = results.productionSteps || [];
      const totalMachines = steps.reduce((sum, s) => sum + (s.physicalMachines || Math.ceil(s.machinesCount)), 0);
      const targetItem = (results.targets && results.targets[0]) || { item: "Produit Fini", rate: 10 };
      const targetName = results.targets && results.targets.length === 1 
        ? (ITEM_NAMES[targetItem.item] || targetItem.item)
        : (results.targets || []).map(t => `${t.rate}/m ${ITEM_NAMES[t.item]||t.item}`).join(" + ");
      const factoryTitle = results.milestoneName || targetName;
      const rawResources = results.rawResources || {};

      const svgW = 720;
      const svgH = 720;
      const margin = 50;
      const gridW = svgW - margin * 2;
      const gridH = svgH - margin * 2;
      const cols = 6;
      const rows = 6;
      const cellW = gridW / cols;
      const cellH = gridH / rows;

      const colLetters = ["A", "B", "C", "D", "E", "F"];

      const ITEM_COLORS = {
        "iron_ore": "#ea580c", "iron_ingot": "#f59e0b", "iron_plate": "#38bdf8", "iron_rod": "#0284c7", "screw": "#94a3b8", "reinforced_iron_plate": "#06b6d4", "rotor": "#a855f7", "modular_frame": "#d946ef",
        "copper_ore": "#f97316", "copper_ingot": "#ea580c", "wire": "#eab308", "cable": "#0284c7", "copper_sheet": "#ca8a04",
        "coal": "#475569", "steel_ingot": "#64748b", "steel_beam": "#64748b", "steel_pipe": "#94a3b8", "encased_industrial_beam": "#10b981", "stator": "#8b5cf6", "motor": "#ec4899", "heavy_modular_frame": "#f43f5e",
        "limestone": "#cbd5e1", "concrete": "#e2e8f0",
        "caterium_ore": "#eab308", "caterium_ingot": "#facc15", "quickwire": "#fbbf24",
        "raw_quartz": "#ec4899", "quartz_crystal": "#f472b6", "silica": "#cbd5e1",
        "crude_oil": "#4f46e5", "plastic": "#06b6d4", "rubber": "#64748b", "fuel": "#f59e0b",
        "bauxite": "#dc2626", "aluminum_scrap": "#e2e8f0", "aluminum_ingot": "#cbd5e1", "alclad_aluminum_sheet": "#38bdf8",
        "smart_plating": "#10b981", "versatile_framework": "#10b981", "automated_wiring": "#10b981", "adaptive_control_unit": "#10b981", "modular_engine": "#10b981"
      };

      let foundationsSvg = "";
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = margin + c * cellW;
          const y = margin + r * cellH;
          foundationsSvg += this.renderFoundationTile(x, y, cellW, cellH, colLetters[c], r + 1);
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
        axesSvg += `
          <text x="${margin - 16}" y="${margin + r * cellH + cellH/2 + 4}" fill="#38bdf8" font-size="11" font-weight="900" text-anchor="middle" font-family="monospace">${r + 1}</text>
        `;
      }

      const compassSvg = `
        <g transform="translate(${svgW - 40}, 30)">
          <circle cx="0" cy="0" r="14" fill="#111827" stroke="#38bdf8" stroke-width="1.2" />
          <polygon points="0,-11 -4,3 0,0 4,3" fill="#ef4444" />
          <polygon points="0,11 -4,0 0,0 4,0" fill="#94a3b8" />
          <text x="0" y="-14" fill="#ef4444" font-size="9" font-weight="900" text-anchor="middle">N</text>
        </g>
      `;

      const smelters = steps.filter(s => s.building && (s.building.id === "smelter" || s.building.id === "foundry"));
      const constructors = steps.filter(s => s.building && (s.building.id === "constructor"));
      const assemblers = steps.filter(s => s.building && (s.building.id === "assembler" || s.building.id === "manufacturer" || s.building.id === "refinery" || s.building.id === "blender" || s.building.id === "packager"));

      const isFull = !targetStepId || (activeState && activeState.currentViewMode === "full");
      const getOpacity = (stepType, machItem = "") => {
        if (isFull) return 1;
        if (targetStepId === "step_foundations") return 0.2;
        if (targetStepId === "step_raw_logistics" && stepType === "raw") return 1;
        if (targetStepId && targetStepId.startsWith("step_line_")) {
          if (activeState && activeState.steps && activeState.steps[activeState.currentStepIndex]) {
            const curStep = activeState.steps[activeState.currentStepIndex];
            if (curStep.lineData && curStep.lineData.steps) {
              const matches = curStep.lineData.steps.some(s => s.itemId === machItem || (machItem && s.recipeId && s.recipeId.includes(machItem)));
              if (matches) return 1;
            }
          }
          return 0.25;
        }
        if (targetStepId === "step_smelters" && (stepType === "smelter" || stepType === "raw")) return 1;
        if (targetStepId === "step_constructors" && (stepType === "constructor" || stepType === "smelter" || stepType === "raw")) return 1;
        if (targetStepId === "step_assemblers" && (stepType === "assembler" || stepType === "constructor" || stepType === "smelter" || stepType === "raw")) return 1;
        if (targetStepId === "step_power") return 0.85;
        if (targetStepId === "step_output_storage") return 1;
        return 0.25;
      };

      const isMultiFloor = activeState && activeState.architectureMode === "multi_floor";
      const activeFloor = (activeState && typeof activeState.activeFloor === "number") ? activeState.activeFloor : 0;

      let beltsSvg = "";
      let machinesSvg = "";
      let splittersSvg = "";
      let powerSvg = "";
      let rawInletsSvg = "";
      let liftsSvg = "";

      // 1. ARRIVÉES MULTI-RESSOURCES BRUTES (Sud - Rangée 6)
      const rawEntries = Object.entries(rawResources);
      const rawCount = Math.max(1, rawEntries.length);
      const rawPositions = {};
      const rawYMap = {};
      const baseSplitY = margin + 5 * cellH + cellH/2;

      if (!isMultiFloor || activeFloor === 0) {
        rawEntries.forEach(([rItem, rate], rIdx) => {
          const itemCol = ITEM_COLORS[rItem] || "#f59e0b";
          const inX = margin + (rIdx + 1) * (gridW / (rawCount + 1));
          const inY = svgH - 12;
          rawPositions[rItem] = { x: inX, y: inY, color: itemCol, rate: rate };

          // Étage/Canal Y dédié par type de minerai :
          // Tier 1 (Sud / Bas) : rIdx = 0 (ex: Fer)
          // Tier 2 (Nord / Haut) : rIdx = 1 (ex: Charbon)
          // Tier 3 : rIdx = 2 (ex: Cuivre)
          const yOffset = (rIdx === 0) ? 14 : ((rIdx === 1) ? -14 : 0);
          rawYMap[rItem] = baseSplitY + yOffset;

          rawInletsSvg += `
            <g class="ficsit-raw-inlet" transform="translate(${inX}, ${inY})">
              <rect x="-42" y="-18" width="84" height="18" rx="3" fill="#0f172a" stroke="${itemCol}" stroke-width="1.2" />
              <text x="0" y="-6" fill="${itemCol}" font-size="8" font-weight="900" text-anchor="middle" font-family="sans-serif">📥 ${Math.round(rate*10)/10}/m ${ITEM_NAMES[rItem] || rItem}</text>
              <circle cx="0" cy="0" r="3.5" fill="${itemCol}" stroke="#0f172a" stroke-width="1" />
            </g>
          `;
        });
      }

      // 2. FONDERIES & FONDERIES AVANCÉES (Rangée 5 - Dalles B5 à E5)
      const smeltCount = smelters.reduce((sum, s) => sum + (s.physicalMachines || Math.ceil(s.machinesCount)), 0);
      const displaySmelters = Math.min(smeltCount, 4);
      const smeltPositions = [];
      const splittersList = [];

      for (let i = 0; i < displaySmelters; i++) {
        const cIdx = 1 + i;
        const colLetter = colLetters[cIdx] || "B";
        const mx = margin + cIdx * cellW + (cellW - 54) / 2;
        const my = margin + 4 * cellH + 6;
        const machId = `smelter_${i}`;
        const locName = isMultiFloor ? `RDC - Dalle ${colLetter}5` : `Dalle ${colLetter}5 (Rangée Sud)`;
        const sData = smelters[i % smelters.length] || {};
        const isDual = (sData.building?.id === "foundry") || (sData.ingredients && sData.ingredients.length >= 2);
        const in1Item = (sData.ingredients && sData.ingredients[0]?.item) || "iron_ore";
        const in2Item = (sData.ingredients && sData.ingredients[1]?.item) || null;
        const outItem = sData.itemId || "iron_ingot";
        const outColor = ITEM_COLORS[outItem] || "#f59e0b";

        smeltPositions.push({ id: machId, x: mx, y: my, w: 54, h: 78, isDual, in1Item, in2Item, outItem, outColor });
        
        if (!isMultiFloor || activeFloor === 0) {
          const isStep = targetStepId === "step_smelters" || (targetStepId && targetStepId.startsWith("step_line_") && getOpacity("smelter", outItem) === 1);
          machinesSvg += this.renderSpriteSmelter(mx, my, 54, 78, sData, getOpacity("smelter", outItem), isStep, machId, locName);

          if (isDual && in2Item) {
            // Port d'entrée 1 (Gauche) - canal Y dédié
            const p1X = mx + 16;
            const splitY1 = rawYMap[in1Item] || (baseSplitY + 14);
            const in1Color = ITEM_COLORS[in1Item] || "#f59e0b";
            splittersSvg += this.renderSpriteSplitter(p1X, splitY1, 20);
            beltsSvg += this.renderCurvedConveyor(`M ${p1X} ${splitY1} L ${p1X} ${my + 78}`, in1Color, 9, `belt_in1_${machId}`, `raw_splitter_${i}_1`, machId);
            splittersList.push({ item: in1Item, x: p1X, y: splitY1, color: in1Color, id: `raw_splitter_${i}_1`, machId });

            // Port d'entrée 2 (Droite) - canal Y dédié
            const p2X = mx + 38;
            const splitY2 = rawYMap[in2Item] || (baseSplitY - 14);
            const in2Color = ITEM_COLORS[in2Item] || "#475569";
            splittersSvg += this.renderSpriteSplitter(p2X, splitY2, 20);
            beltsSvg += this.renderCurvedConveyor(`M ${p2X} ${splitY2} L ${p2X} ${my + 78}`, in2Color, 9, `belt_in2_${machId}`, `raw_splitter_${i}_2`, machId);
            splittersList.push({ item: in2Item, x: p2X, y: splitY2, color: in2Color, id: `raw_splitter_${i}_2`, machId });
          } else {
            // Port d'entrée unique
            const pX = mx + 27;
            const splitY = rawYMap[in1Item] || baseSplitY;
            const in1Color = ITEM_COLORS[in1Item] || "#f59e0b";
            splittersSvg += this.renderSpriteSplitter(pX, splitY, 24);
            beltsSvg += this.renderCurvedConveyor(`M ${pX} ${splitY} L ${pX} ${my + 78}`, in1Color, 10, `belt_in_${machId}`, `raw_splitter_${i}`, machId);
            splittersList.push({ item: in1Item, x: pX, y: splitY, color: in1Color, id: `raw_splitter_${i}`, machId });
          }

          if (isMultiFloor && activeFloor === 0) {
            liftsSvg += this.renderSpriteConveyorLift(mx + 27, margin + 3 * cellH + 10, 26, "up", "▲ Vers Étage 1", 1);
            beltsSvg += this.renderCurvedConveyor(`M ${mx + 27} ${my} L ${mx + 27} ${margin + 3 * cellH + 23}`, outColor, 10, `belt_smelt_to_lift_${i}`, machId, `lift_up_${i}`);
          }
        }
      }

      // Raccordement multi-ressources strict (Par canal Y dédié sans aucun croisement de répartiteur)
      if ((!isMultiFloor || activeFloor === 0) && splittersList.length > 0) {
        const groupsByItem = {};
        splittersList.forEach((sp) => {
          if (!groupsByItem[sp.item]) groupsByItem[sp.item] = [];
          groupsByItem[sp.item].push(sp);
        });

        Object.entries(groupsByItem).forEach(([inItem, spGroup]) => {
          const rawFeedPos = rawPositions[inItem] || { x: spGroup[0].x, color: spGroup[0].color || "#f59e0b" };
          const firstSplitX = spGroup[0].x;
          const lineY = spGroup[0].y; // Hauteur Y dédiée de cette ressource

          // Amenée dédiée depuis l'entrée spécifique de cette ressource (ex: Charbon, Fer, Cuivre) vers le 1er répartiteur
          beltsSvg += this.renderCurvedConveyor(`M ${rawFeedPos.x} ${svgH - 12} L ${firstSplitX} ${lineY}`, rawFeedPos.color, 11, `belt_raw_feed_${inItem}`, `raw_inlet_${inItem}`, spGroup[0].id);

          // Manifold horizontal le long de son canal Y exclusif (ne traverse aucun répartiteur d'une autre ressource)
          if (spGroup.length > 1) {
            for (let g = 0; g < spGroup.length - 1; g++) {
              const x1 = spGroup[g].x;
              const x2 = spGroup[g + 1].x;
              beltsSvg += this.renderCurvedConveyor(`M ${x1} ${lineY} L ${x2} ${lineY}`, rawFeedPos.color, 9, `belt_manifold_${inItem}_${g}`, spGroup[g].id, spGroup[g + 1].id);
            }
          }
        });
      }

      // 3. CONSTRUCTEURS (Rangée 3 - Dalles B3 à E3)
      const constCount = constructors.reduce((sum, s) => sum + (s.physicalMachines || Math.ceil(s.machinesCount)), 0);
      const displayConst = Math.min(constCount, 4);
      const constPositions = [];

      for (let i = 0; i < displayConst; i++) {
        const cIdx = 1 + i;
        const colLetter = colLetters[cIdx] || "B";
        const mx = margin + cIdx * cellW + (cellW - 54) / 2;
        const my = margin + 2 * cellH + 6;
        const machId = `const_${i}`;
        const locName = isMultiFloor ? `Étage 1 - Dalle ${colLetter}3` : `Dalle ${colLetter}3 (Rangée Centrale)`;
        const cData = constructors[i % constructors.length] || {};
        const inItem = (cData.ingredients && cData.ingredients[0]?.item) || "iron_ingot";
        const outItem = cData.itemId || "iron_plate";
        const inColor = ITEM_COLORS[inItem] || "#f59e0b";
        const outColor = ITEM_COLORS[outItem] || "#38bdf8";

        constPositions.push({ id: machId, x: mx, y: my, w: 54, h: 84, inX: mx + 27, inY: my + 84, outX: mx + 27, outY: my, inItem, outItem, inColor, outColor });

        if (!isMultiFloor || activeFloor === 1) {
          const isStep = targetStepId === "step_constructors" || (targetStepId && targetStepId.startsWith("step_line_") && getOpacity("constructor", outItem) === 1);
          machinesSvg += this.renderSpriteConstructor(mx, my, 54, 84, cData, getOpacity("constructor", outItem), isStep, machId, locName);

          const interSplitY = margin + 3 * cellH + cellH/2;
          splittersSvg += this.renderSpriteMerger(mx + 27, interSplitY, 24);

          if (isMultiFloor && activeFloor === 1) {
            liftsSvg += this.renderSpriteConveyorLift(mx + 27, margin + 5 * cellH, 26, "down", "▼ Arrivée RDC", 0);
            beltsSvg += this.renderCurvedConveyor(`M ${mx + 27} ${margin + 5 * cellH - 13} L ${mx + 27} ${interSplitY}`, inColor, 10, `belt_lift_to_const_${i}`, `lift_down_${i}`, machId);
            liftsSvg += this.renderSpriteConveyorLift(mx + 27, margin + 0.8 * cellH, 26, "up", "▲ Vers Étage 2", 2);
            beltsSvg += this.renderCurvedConveyor(`M ${mx + 27} ${my} L ${mx + 27} ${margin + 0.8 * cellH + 13}`, outColor, 10, `belt_const_to_lift_${i}`, machId, `lift_up_e2_${i}`);
          } else {
            if (i < smeltPositions.length) {
              const sMach = smeltPositions[i];
              beltsSvg += this.renderCurvedConveyor(`M ${sMach.outX} ${sMach.outY} L ${mx + 27} ${interSplitY}`, sMach.outColor, 10, `belt_smelt_to_const_${i}`, sMach.id, machId);
            } else if (smeltPositions.length === 0) {
              const rawFeedPos = Object.values(rawPositions)[0] || { x: mx + 27, color: "#f59e0b" };
              beltsSvg += this.renderCurvedConveyor(`M ${rawFeedPos.x} ${svgH - 12} L ${mx + 27} ${interSplitY}`, inColor, 10, `belt_raw_to_const_${i}`, "raw_inlet", machId);
            }
          }
          beltsSvg += this.renderCurvedConveyor(`M ${mx + 27} ${interSplitY} L ${mx + 27} ${my + 84}`, inColor, 10, `belt_in_${machId}`, (i < smeltPositions.length ? smeltPositions[i].id : "raw_inlet"), machId);
        }
      }

      // 4. ASSEMBLEUSES & FAÇONNEUSES (Rangée 1-2 - Dalles B1-C1 & D1-E1)
      const assCount = assemblers.reduce((sum, s) => sum + (s.physicalMachines || Math.ceil(s.machinesCount)), 0);
      const displayAss = Math.min(assCount, 2);
      const assPositions = [];

      for (let i = 0; i < displayAss; i++) {
        const cIdx = 1 + i * 2.5;
        const mx = margin + cIdx * cellW + 6;
        const my = margin + 6;
        const assW = cellW * 2 - 12;
        const assH = cellH * 2 - 14;
        const machId = `assembler_${i}`;
        const locName = isMultiFloor ? `Étage 2 - Dalles B1-C1` : (i === 0 ? "Dalles B1-C1 (Rangée Nord)" : "Dalles D1-E1 (Rangée Nord)");
        const aData = assemblers[i % assemblers.length] || {};
        const in1Item = (aData.ingredients && aData.ingredients[0]?.item) || "iron_plate";
        const in2Item = (aData.ingredients && aData.ingredients[1]?.item) || "screw";
        const in1Color = ITEM_COLORS[in1Item] || "#38bdf8";
        const in2Color = ITEM_COLORS[in2Item] || "#a855f7";
        const outItem = aData.itemId || "reinforced_iron_plate";
        const outColor = ITEM_COLORS[outItem] || "#10b981";

        assPositions.push({ id: machId, x: mx, y: my, w: assW, h: assH, inX1: mx + assW/2 - 13, inX2: mx + assW/2 + 13, inY: my + assH, outX: mx + assW/2, outY: my, outColor });

        if (!isMultiFloor || activeFloor === 2) {
          const isStep = targetStepId === "step_assemblers" || (targetStepId && targetStepId.startsWith("step_line_") && getOpacity("assembler", outItem) === 1);
          machinesSvg += this.renderSpriteAssembler(mx, my, assW, assH, aData, getOpacity("assembler", outItem), isStep, machId, locName);

          if (isMultiFloor && activeFloor === 2) {
            liftsSvg += this.renderSpriteConveyorLift(mx + assW/2 - 13, margin + 4 * cellH, 26, "down", "▼ Arrivée Étage 1", 1);
            liftsSvg += this.renderSpriteConveyorLift(mx + assW/2 + 13, margin + 4 * cellH, 26, "down", "▼ Arrivée Étage 1", 1);
            beltsSvg += this.renderCurvedConveyor(`M ${mx + assW/2 - 13} ${margin + 4 * cellH - 13} L ${mx + assW/2 - 13} ${my + assH}`, in1Color, 10, `belt_lift_to_ass1_${i}`, `lift_down1_${i}`, machId);
            beltsSvg += this.renderCurvedConveyor(`M ${mx + assW/2 + 13} ${margin + 4 * cellH - 13} L ${mx + assW/2 + 13} ${my + assH}`, in2Color, 10, `belt_lift_to_ass2_${i}`, `lift_down2_${i}`, machId);
          } else {
            if (constPositions.length >= 2) {
              const c1 = constPositions[Math.min(i*2, constPositions.length - 1)];
              const c2 = constPositions[Math.min(i*2 + 1, constPositions.length - 1)];
              beltsSvg += this.renderCurvedConveyor(`M ${c1.outX} ${c1.outY} Q ${c1.outX} ${my + assH + 15}, ${mx + assW/2 - 13} ${my + assH}`, in1Color, 10, `belt_const_${c1.id}_to_${machId}`, c1.id, machId);
              beltsSvg += this.renderCurvedConveyor(`M ${c2.outX} ${c2.outY} Q ${c2.outX} ${my + assH + 15}, ${mx + assW/2 + 13} ${my + assH}`, in2Color, 10, `belt_const_${c2.id}_to_${machId}`, c2.id, machId);
            } else if (constPositions.length === 1) {
              beltsSvg += this.renderCurvedConveyor(`M ${constPositions[0].outX} ${constPositions[0].outY} L ${mx + assW/2} ${my + assH}`, in1Color, 10, `belt_const_to_${machId}`, constPositions[0].id, machId);
            }
          }
        }
      }

      // 5. STOCKAGE INDUSTRIEL DE SORTIE (Rangée 1 - Dalles F1-F2)
      const storageX = margin + 5 * cellW + 6;
      const storageY = margin + 12;
      const isStorageStep = targetStepId === "step_output_storage";
      const storageW = cellW - 12;
      const storageH = 68;
      let storageSvg = "";

      if (!isMultiFloor || activeFloor === 2) {
        storageSvg = this.renderSpriteStorage(storageX, storageY, storageW, storageH, targetName, getOpacity('storage'), isStorageStep, "storage_0", isMultiFloor ? "Étage 2 - Dalles F1-F2" : "Dalles F1-F2 (Expédition)", results.targets || []);

        if (assPositions.length > 0) {
          const lastAss = assPositions[assPositions.length - 1];
          beltsSvg += this.renderCurvedConveyor(`M ${lastAss.outX} ${lastAss.outY} Q ${lastAss.outX} ${storageY + 34}, ${storageX} ${storageY + 34}`, "#10b981", 12, "belt_ass_to_storage", lastAss.id, "storage_0");
        } else if (constPositions.length > 0) {
          const lastConst = constPositions[constPositions.length - 1];
          beltsSvg += this.renderCurvedConveyor(`M ${lastConst.outX} ${lastConst.outY} Q ${lastConst.outX} ${storageY + 34}, ${storageX} ${storageY + 34}`, "#10b981", 12, "belt_const_to_storage", lastConst.id, "storage_0");
        }
      }

      // 6. RÉSEAU ÉLECTRIQUE
      const isPowerStep = targetStepId === "step_power";
      const pole1X = margin + 1 * cellW;
      const pole1Y = margin + 3 * cellH;
      const pole2X = margin + 5 * cellW;
      const pole2Y = margin + 3 * cellH;

      powerSvg += `
        <g transform="translate(${pole1X}, ${pole1Y})" opacity="${isPowerStep ? 1 : 0.4}">
          <circle cx="0" cy="0" r="10" fill="#111827" stroke="#f59e0b" stroke-width="1.8" />
          <circle cx="0" cy="0" r="4" fill="#f59e0b" filter="drop-shadow(0 0 6px #f59e0b)" />
          <text x="0" y="3.5" fill="#000" font-size="8" font-weight="900" text-anchor="middle">⚡</text>
        </g>
        <g transform="translate(${pole2X}, ${pole2Y})" opacity="${isPowerStep ? 1 : 0.4}">
          <circle cx="0" cy="0" r="10" fill="#111827" stroke="#f59e0b" stroke-width="1.8" />
          <circle cx="0" cy="0" r="4" fill="#f59e0b" filter="drop-shadow(0 0 6px #f59e0b)" />
          <text x="0" y="3.5" fill="#000" font-size="8" font-weight="900" text-anchor="middle">⚡</text>
        </g>
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

      const curIdx = activeState ? activeState.currentStepIndex : 0;
      const totalStepsCount = activeState && activeState.steps ? activeState.steps.length : 7;
      const curTag = activeState && activeState.steps && activeState.steps[curIdx] ? activeState.steps[curIdx].tag : "";
      
      const floorHeader = isMultiFloor 
        ? ` • ÉTAGE ${activeFloor} (${activeFloor === 0 ? "RDC FONDERIES" : (activeFloor === 1 ? "ÉTAGE 1 CONSTRUCTEURS" : "ÉTAGE 2 ASSEMBLEUSES")})`
        : "";

      const planTitle = isFull 
        ? `PLAN D'IMPLANTATION TOP-DOWN : ${factoryTitle.toUpperCase()}${floorHeader}` 
        : `PLAN TOP-DOWN : ÉTAPE ${curIdx + 1}/${totalStepsCount} (${curTag.toUpperCase()})${floorHeader}`;

      return `
        <svg id="topdown-factory-svg" viewBox="0 0 ${svgW} ${svgH}" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background: #060910; font-family: system-ui, sans-serif; user-select: none; cursor: grab;">
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
          <text x="${svgW/2}" y="38" fill="#94a3b8" font-size="9" text-anchor="middle">${totalMachines} Machines • ${results.totalPowerMW || 0} MW • Grille 6×6 (48m × 48m)</text>
          
          <!-- Boussole -->
          ${compassSvg}

          <!-- Grille Fondations & Axes -->
          <g id="blueprint-foundations-layer">
            ${foundationsSvg}
            ${axesSvg}
          </g>

          <!-- Arrivées de minerais bruts -->
          <g id="blueprint-raw-inlets-layer">
            ${rawInletsSvg}
          </g>

          <!-- Ascenseurs de Convoyeurs (Conveyor Lifts) -->
          <g id="blueprint-lifts-layer">
            ${liftsSvg}
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

    // Rendu de la Fiche Machine & Recette Interactive dans la colonne latérale
    renderMachineInspector(container, machInfo, isMs = false, results = null) {
      if (!container) return;

      if (!machInfo) {
        container.innerHTML = `
          <div style="background: rgba(15, 23, 42, 0.6); border: 1px dashed rgba(56, 189, 248, 0.35); border-radius: 6px; padding: 10px 14px; font-size: 11.5px; color: #94a3b8; display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 20px;">💡</span>
            <div>
              <div style="font-weight: bold; color: #e2e8f0; margin-bottom: 2px;">Inspecteur de Recette & Raccordements I/O</div>
              <div>Cliquez sur n'importe quelle machine du plan 2D pour afficher sa recette à régler en jeu et mettre en évidence ses convoyeurs d'entrée/sortie.</div>
            </div>
          </div>
        `;
        return;
      }

      const state = isMs ? this.msState : this.singleState;
      const isAlt = machInfo.isAlt;
      const mType = machInfo.type || "Machine";
      const mIcon = mType.includes("Fonderie") ? "🏭" : (mType.includes("Constructeur") ? "⚙️" : (mType.includes("Stockage") ? "📦" : "🧩"));
      const rName = machInfo.recipeName || "Standard";
      const pMW = machInfo.powerMW || 0;
      const oClock = machInfo.overclock || 100;
      const loc = machInfo.location || "Grille FICSIT";

      const inputsHtml = (machInfo.ingredients && machInfo.ingredients.length > 0)
        ? machInfo.ingredients.map(ing => {
            const belt = (typeof SatisfactoryFlowchart !== "undefined" && SatisfactoryFlowchart.getBeltTierInfo) ? SatisfactoryFlowchart.getBeltTierInfo(ing.rate) : { mk: "Convoyeur Mk.1", color: "#f59e0b" };
            return `
              <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.3); padding: 5px 8px; border-radius: 4px; font-size: 11.5px; border-left: 3px solid #38bdf8;">
                <span style="color: #f1f5f9; font-weight: 600;">🔹 ${ing.name}</span>
                <span style="color: #38bdf8; font-weight: 800;">${ing.rate} /min</span>
              </div>
            `;
          }).join("")
        : `<div style="color: #94a3b8; font-size: 11px;">Minerais bruts / Entrées directes</div>`;

      const outputsHtml = `
        <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.3); padding: 5px 8px; border-radius: 4px; font-size: 11.5px; border-left: 3px solid #10b981;">
          <span style="color: #f1f5f9; font-weight: 600;">🟢 ${machInfo.itemName || rName}</span>
          <span style="color: #4ade80; font-weight: 900;">+${machInfo.rateProduced} /min</span>
        </div>
      `;

      container.innerHTML = `
        <div style="background: linear-gradient(145deg, #0b1320, #080d16); border: 1.5px solid #38bdf8; border-radius: 6px; padding: 12px 14px; box-shadow: 0 4px 18px rgba(0,0,0,0.7), 0 0 15px rgba(56,189,248,0.2);">
          <!-- En-tête machine avec localisation et bouton fermer -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px solid rgba(56, 189, 248, 0.25);">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 18px;">${mIcon}</span>
              <div>
                <div style="font-weight: 800; font-size: 13.5px; color: #f8fafc; font-family: var(--font-display); letter-spacing: 0.5px;">${mType}</div>
                <div style="font-size: 10.5px; color: #38bdf8; font-weight: 600;">📍 ${loc}</div>
              </div>
            </div>
            <button type="button" class="btn-guide-close-inspector" style="background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.4); color: #fca5a5; font-size: 10.5px; border-radius: 4px; padding: 3px 8px; cursor: pointer; display: flex; align-items: center; gap: 4px;">
              ✖ Désélectionner
            </button>
          </div>

          <!-- Bannière Recette active à configurer -->
          <div style="background: rgba(14, 165, 233, 0.12); border: 1px solid rgba(56, 189, 248, 0.4); border-radius: 5px; padding: 8px 10px; margin-bottom: 10px;">
            <div style="font-size: 10px; font-weight: 800; color: #93c5fd; text-transform: uppercase; margin-bottom: 3px; display: flex; justify-content: space-between; align-items: center;">
              <span>📜 Recette à Appliquer en Jeu :</span>
              ${isAlt ? '<span style="background: rgba(168, 85, 247, 0.25); border: 1px solid #a855f7; color: #d8b4fe; padding: 1px 6px; border-radius: 3px; font-size: 9.5px; font-weight: bold;">⭐ ALTERNATIVE</span>' : '<span style="background: rgba(16, 185, 129, 0.2); border: 1px solid #10b981; color: #a7f3d0; padding: 1px 6px; border-radius: 3px; font-size: 9.5px; font-weight: bold;">STANDARD</span>'}
            </div>
            <div style="font-size: 15px; font-weight: 900; color: #f59e0b; margin-bottom: 4px;">
              ${rName}
            </div>
            <div style="display: flex; gap: 14px; font-size: 11px; color: #cbd5e1; flex-wrap: wrap;">
              <span>⚡ <strong>Puissance :</strong> <strong style="color: #f59e0b;">${pMW} MW</strong></span>
              <span>⏱️ <strong>Horloge :</strong> <strong style="color: #38bdf8;">${oClock}%</strong></span>
            </div>
          </div>

          <!-- Grille Entrées / Sorties (I/O) -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px;">
            <!-- Entrées (Bleu/Cyan) -->
            <div style="background: rgba(2, 132, 199, 0.12); border: 1px solid rgba(56, 189, 248, 0.35); border-radius: 4px; padding: 8px 10px;">
              <div style="font-size: 10px; font-weight: 800; color: #38bdf8; text-transform: uppercase; margin-bottom: 5px; display: flex; align-items: center; gap: 4px;">
                <span>📥</span> Entrées (Convoyeur Bleu) :
              </div>
              <div style="display: flex; flex-direction: column; gap: 4px;">
                ${inputsHtml}
              </div>
            </div>

            <!-- Sorties (Vert Émeraude) -->
            <div style="background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.35); border-radius: 4px; padding: 8px 10px;">
              <div style="font-size: 10px; font-weight: 800; color: #4ade80; text-transform: uppercase; margin-bottom: 5px; display: flex; align-items: center; gap: 4px;">
                <span>📤</span> Sortie (Convoyeur Vert) :
              </div>
              <div style="display: flex; flex-direction: column; gap: 4px;">
                ${outputsHtml}
              </div>
            </div>
          </div>

          <!-- Conseil In-Game & Bouton Copie -->
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 6px; font-size: 10.5px; color: #94a3b8;">
            <div>💡 <em>Dans Satisfactory : Ouvrez la machine [E], sélectionnez <strong>${rName}</strong> et réglez l'horloge sur <strong>${oClock}%</strong>.</em></div>
            <button type="button" class="btn-guide-copy-recipe btn-outline" style="font-size: 10.5px; padding: 3px 9px; color: #38bdf8; border-color: rgba(56, 189, 248, 0.4); cursor: pointer;">
              📋 Copier la recette
            </button>
          </div>
        </div>
      `;

      const closeBtn = container.querySelector(".btn-guide-close-inspector");
      if (closeBtn) {
        closeBtn.onclick = () => {
          state.selectedMachine = null;
          const svgViewport = document.getElementById(isMs ? "guide-ms-step-svg-viewport" : "guide-step-svg-viewport");
          if (svgViewport) {
            this.attachGuideInteractivity(svgViewport, state.lastResults, isMs);
          }
          this.renderMachineInspector(container, null, isMs, results);
        };
      }

      const copyBtn = container.querySelector(".btn-guide-copy-recipe");
      if (copyBtn) {
        copyBtn.onclick = () => {
          const text = `Machine: ${mType}\nRecette: ${rName}\nHorloge: ${oClock}%\nPuissance: ${pMW} MW`;
          if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
              showToast(`📋 Paramètres copiés : "${rName}"`);
            }).catch(() => {
              showToast(`Recette : ${rName}`);
            });
          } else {
            showToast(`Recette : ${rName}`);
          }
        };
      }
    },

    // Écouteurs de clics et survol sur les machines du plan Top-Down 2D
    attachGuideInteractivity(container, results, isMs = false) {
      if (!container) return;
      const state = isMs ? this.msState : this.singleState;
      const inspectorCardId = isMs ? "guide-ms-machine-inspector-card" : "guide-machine-inspector-card";
      const inspectorCardEl = document.getElementById(inspectorCardId);

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
        if (x + rect.width > window.innerWidth - 10) x = e.clientX - rect.width - padding;
        if (y + rect.height > window.innerHeight - 10) y = e.clientY - rect.height - padding;
        tooltip.style.left = `${Math.max(10, x)}px`;
        tooltip.style.top = `${Math.max(10, y)}px`;
      };

      const applyHighlight = (selectedId) => {
        container.querySelectorAll(".ficsit-guide-clickable-machine").forEach(mEl => {
          const id = mEl.getAttribute("data-guide-mach-id");
          if (!selectedId) {
            mEl.classList.remove("is-selected", "is-dimmed");
          } else if (id === selectedId) {
            mEl.classList.add("is-selected");
            mEl.classList.remove("is-dimmed");
          } else {
            mEl.classList.remove("is-selected");
            mEl.classList.add("is-dimmed");
          }
        });

        container.querySelectorAll(".ficsit-guide-conveyor").forEach(bEl => {
          const from = bEl.getAttribute("data-belt-from");
          const to = bEl.getAttribute("data-belt-to");
          if (!selectedId) {
            bEl.classList.remove("is-input-flow", "is-output-flow", "is-dimmed");
          } else if (to === selectedId) {
            bEl.classList.add("is-input-flow");
            bEl.classList.remove("is-output-flow", "is-dimmed");
          } else if (from === selectedId) {
            bEl.classList.add("is-output-flow");
            bEl.classList.remove("is-input-flow", "is-dimmed");
          } else {
            bEl.classList.remove("is-input-flow", "is-output-flow");
            bEl.classList.add("is-dimmed");
          }
        });
      };

      const selectMachine = (machInfo) => {
        state.selectedMachine = machInfo;
        this.renderMachineInspector(inspectorCardEl, machInfo, isMs, results);
        applyHighlight(machInfo ? machInfo.id : null);
        if (machInfo) {
          showToast(`🔍 Machine sélectionnée : ${machInfo.type} (${machInfo.recipeName})`);
        }
      };

      // Appliquer l'état existant si déjà sélectionné
      if (state.selectedMachine) {
        this.renderMachineInspector(inspectorCardEl, state.selectedMachine, isMs, results);
        applyHighlight(state.selectedMachine.id);
      } else {
        this.renderMachineInspector(inspectorCardEl, null, isMs, results);
      }

      // Écouteurs de clics sur chaque machine
      container.querySelectorAll(".ficsit-guide-clickable-machine").forEach(machEl => {
        machEl.onclick = (e) => {
          e.stopPropagation();
          const rawJson = machEl.getAttribute("data-mach-json");
          if (!rawJson) return;
          try {
            const machInfo = JSON.parse(decodeURIComponent(rawJson));
            if (state.selectedMachine && state.selectedMachine.id === machInfo.id) {
              selectMachine(null);
            } else {
              selectMachine(machInfo);
            }
          } catch (err) {
            console.error("Error parsing machine JSON", err);
          }
        };

        machEl.onmouseenter = (e) => {
          const rawJson = machEl.getAttribute("data-mach-json");
          if (!rawJson) return;
          try {
            const info = JSON.parse(decodeURIComponent(rawJson));
            const inputsText = (info.ingredients || []).map(i => `${i.rate}/m ${i.name}`).join(", ") || "Matières directes";
            const isAltBadge = info.isAlt ? '<span style="color:#d8b4fe;font-weight:bold;">[⭐ Alternative]</span>' : '<span style="color:#7dd3fc;">[Standard]</span>';
            tooltip.innerHTML = `
              <div style="font-weight: 800; font-size: 13.5px; color: #38bdf8; border-bottom: 1px solid rgba(56, 189, 248, 0.3); padding-bottom: 6px; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between; gap: 10px;">
                <span>🏭 ${info.type}</span>
                <span style="color: #f59e0b; font-size: 11px; font-weight: bold;">⚡ ${info.powerMW} MW</span>
              </div>
              <div style="font-size: 12px; margin-bottom: 6px;">
                <strong>📜 Recette :</strong> <span style="color: #f59e0b; font-weight: 800;">${info.recipeName}</span> ${isAltBadge}
              </div>
              <div style="font-size: 11.5px; color: #94a3b8; margin-bottom: 4px;">
                <strong style="color: #38bdf8;">📥 Entrées :</strong> ${inputsText}
              </div>
              <div style="font-size: 11.5px; color: #94a3b8; margin-bottom: 6px;">
                <strong style="color: #10b981;">📤 Sortie :</strong> +${info.rateProduced}/min ${info.itemName}
              </div>
              <div style="font-size: 10.5px; color: #64748b; border-top: 1px dashed rgba(255,255,255,0.1); padding-top: 5px;">
                👆 <em>Cliquez pour verrouiller et inspecter le raccordement complet</em>
              </div>
            `;
            tooltip.style.display = "block";
            positionTooltip(e);
          } catch (err) {}
        };

        machEl.onmousemove = (e) => {
          positionTooltip(e);
        };

        machEl.onmouseleave = () => {
          tooltip.style.display = "none";
        };
      });

      // Clic hors des machines dans le SVG pour désélectionner
      const svgEl = container.querySelector("svg");
      if (svgEl) {
        svgEl.onclick = (e) => {
          if (!e.target.closest(".ficsit-guide-clickable-machine")) {
            selectMachine(null);
          }
        };

        // --- GESTION DU PAN & ZOOM INTÉRACTIF DANS LE PLAN 2D TOP-DOWN ---
        const vbAttr = svgEl.getAttribute("viewBox") || "0 0 720 720";
        const parts = vbAttr.split(" ").map(Number);
        let vbX = parts[0] || 0;
        let vbY = parts[1] || 0;
        let vbW = parts[2] || 720;
        let vbH = parts[3] || 720;
        const initialVb = { x: vbX, y: vbY, width: vbW, height: vbH };

        const updateViewBox = () => {
          svgEl.setAttribute("viewBox", `${vbX} ${vbY} ${vbW} ${vbH}`);
        };

        let isDragging = false;
        let startX = 0;
        let startY = 0;

        svgEl.addEventListener("mousedown", (e) => {
          if (e.target.closest(".ficsit-guide-clickable-machine")) return;
          isDragging = true;
          startX = e.clientX;
          startY = e.clientY;
          svgEl.style.cursor = "grabbing";
        });

        window.addEventListener("mousemove", (e) => {
          if (!isDragging) return;
          const rect = svgEl.getBoundingClientRect();
          const cw = rect.width > 10 ? rect.width : 720;
          const ch = rect.height > 10 ? rect.height : 720;
          const scaleX = vbW / cw;
          const scaleY = vbH / ch;
          const dx = (e.clientX - startX) * scaleX;
          const dy = (e.clientY - startY) * scaleY;
          if (!isNaN(dx) && !isNaN(dy)) {
            vbX -= dx;
            vbY -= dy;
            startX = e.clientX;
            startY = e.clientY;
            updateViewBox();
          }
        });

        window.addEventListener("mouseup", () => {
          if (isDragging) {
            isDragging = false;
            svgEl.style.cursor = "grab";
          }
        });

        // Zoom à la molette fluide centré sur le curseur
        svgEl.addEventListener("wheel", (e) => {
          e.preventDefault();
          const zoomFactor = e.deltaY < 0 ? 0.85 : 1.15;
          const rect = svgEl.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;
          const svgX = vbX + (mouseX / (rect.width || 1)) * vbW;
          const svgY = vbY + (mouseY / (rect.height || 1)) * vbH;

          const newW = Math.min(Math.max(vbW * zoomFactor, 160), 2400);
          const newH = Math.min(Math.max(vbH * zoomFactor, 160), 2400);

          vbX = svgX - (mouseX / (rect.width || 1)) * newW;
          vbY = svgY - (mouseY / (rect.height || 1)) * newH;
          vbW = newW;
          vbH = newH;
          updateViewBox();
        }, { passive: false });

        // Double-clic pour réinitialiser le cadrage
        svgEl.addEventListener("dblclick", (e) => {
          if (e.target.closest(".ficsit-guide-clickable-machine")) return;
          vbX = initialVb.x;
          vbY = initialVb.y;
          vbW = initialVb.width;
          vbH = initialVb.height;
          updateViewBox();
        });

        // Liaison des boutons de contrôle de zoom externes
        const btnZoomIn = document.getElementById(isMs ? "btn-guide-ms-zoom-in" : "btn-guide-zoom-in");
        const btnZoomOut = document.getElementById(isMs ? "btn-guide-ms-zoom-out" : "btn-guide-zoom-out");
        const btnResetZoom = document.getElementById(isMs ? "btn-guide-ms-reset-zoom" : "btn-guide-reset-zoom");

        if (btnZoomIn) {
          btnZoomIn.onclick = () => {
            const factor = 0.8;
            const centerX = vbX + vbW / 2;
            const centerY = vbY + vbH / 2;
            vbW = Math.max(vbW * factor, 160);
            vbH = Math.max(vbH * factor, 160);
            vbX = centerX - vbW / 2;
            vbY = centerY - vbH / 2;
            updateViewBox();
          };
        }

        if (btnZoomOut) {
          btnZoomOut.onclick = () => {
            const factor = 1.25;
            const centerX = vbX + vbW / 2;
            const centerY = vbY + vbH / 2;
            vbW = Math.min(vbW * factor, 2400);
            vbH = Math.min(vbH * factor, 2400);
            vbX = centerX - vbW / 2;
            vbY = centerY - vbH / 2;
            updateViewBox();
          };
        }

        if (btnResetZoom) {
          btnResetZoom.onclick = () => {
            vbX = initialVb.x;
            vbY = initialVb.y;
            vbW = initialVb.width;
            vbH = initialVb.height;
            updateViewBox();
          };
        }
      }
    },

    // Découpage intelligent du complexe de jalon en lignes de production modulaires
    decomposeIntoLines(results) {
      const steps = results.productionSteps || [];
      const targets = results.targets || [];
      const lines = [];

      const getItemName = (id) => ITEM_NAMES[id] || id;

      if (targets.length > 1) {
        // Cas 1 : Multi-produits finaux du jalon (ex: Phase 2)
        targets.forEach((target, tIdx) => {
          const targetStep = steps.find(s => s.itemId === target.item);
          const targetSteps = [];
          if (targetStep) targetSteps.push(targetStep);

          const ingItems = targetStep && targetStep.ingredients ? targetStep.ingredients.map(i => i.item) : [];
          steps.forEach(s => {
            if (s.itemId !== target.item && (ingItems.includes(s.itemId) || s.ingredients?.some(ing => ingItems.includes(ing.item)))) {
              if (!targetSteps.includes(s)) targetSteps.push(s);
            }
          });

          const lineMachines = targetSteps.reduce((sum, s) => sum + (s.physicalMachines || Math.ceil(s.machinesCount)), 0);
          const linePower = Math.round(targetSteps.reduce((sum, s) => sum + s.powerMW, 0) * 10) / 10;

          lines.push({
            lineId: `line_${tIdx}`,
            lineIndex: tIdx + 1,
            title: `Ligne ${String.fromCharCode(65 + tIdx)} : ${getItemName(target.item)} (+${target.rate}/min)`,
            tag: `${tIdx + 3}. LIGNE ${String.fromCharCode(65 + tIdx)} (${getItemName(target.item).toUpperCase()})`,
            targetItem: target.item,
            targetRate: target.rate,
            steps: targetSteps.length > 0 ? targetSteps : steps,
            totalMachines: lineMachines || Math.ceil(steps.length / targets.length),
            powerMW: linePower || Math.round((results.totalPowerMW / targets.length) * 10) / 10,
            desc: `Implantation complète et raccordement autonome de la ligne de fabrication de ${getItemName(target.item)} (${target.rate}/min).`
          });
        });
      } else if (targets.length === 1) {
        // Cas 2 : Un seul produit avec sous-ensembles (ex: Phase 1 Smart Plating -> Reinforced Plates + Rotors)
        const target = targets[0];
        const finalStep = steps.find(s => s.itemId === target.item);
        const subProducts = finalStep && finalStep.ingredients ? finalStep.ingredients.map(i => i.item) : [];

        if (subProducts.length >= 2) {
          subProducts.forEach((subItem, sIdx) => {
            const subSteps = steps.filter(s => s.itemId === subItem || s.ingredients?.some(i => i.item === subItem) || (s.building?.id === 'smelter' && sIdx === 0));
            const lineMachines = subSteps.reduce((sum, s) => sum + (s.physicalMachines || Math.ceil(s.machinesCount)), 0);
            const linePower = Math.round(subSteps.reduce((sum, s) => sum + s.powerMW, 0) * 10) / 10;
            const subRate = finalStep.ingredients.find(i => i.item === subItem)?.rate || 10;

            lines.push({
              lineId: `line_${sIdx}`,
              lineIndex: sIdx + 1,
              title: `Sous-ensemble ${String.fromCharCode(65 + sIdx)} : ${getItemName(subItem)} (+${Math.round(subRate*10)/10}/min)`,
              tag: `${sIdx + 3}. SOUS-ENSEMBLE ${String.fromCharCode(65 + sIdx)} (${getItemName(subItem).toUpperCase()})`,
              targetItem: subItem,
              targetRate: subRate,
              steps: subSteps,
              totalMachines: lineMachines || 3,
              powerMW: linePower || 25,
              desc: `Ligne de fabrication dédiée à l'usinage des ${getItemName(subItem)} pour alimenter l'assemblage final.`
            });
          });

          const finalMachines = finalStep ? (finalStep.physicalMachines || Math.ceil(finalStep.machinesCount)) : 1;
          lines.push({
            lineId: `line_final`,
            lineIndex: subProducts.length + 1,
            title: `Ligne d'Assemblage Final : ${getItemName(target.item)} (+${target.rate}/min)`,
            tag: `${subProducts.length + 3}. ASSEMBLAGE FINAL (${getItemName(target.item).toUpperCase()})`,
            targetItem: target.item,
            targetRate: target.rate,
            steps: finalStep ? [finalStep] : [],
            totalMachines: finalMachines,
            powerMW: finalStep ? Math.round(finalStep.powerMW * 10) / 10 : 15,
            desc: `Raccordement des sous-ensembles aux assembleuses finales pour produire ${getItemName(target.item)} en flux tendu continu.`
          });
        } else {
          lines.push({
            lineId: `line_0`,
            lineIndex: 1,
            title: `Ligne de Production Complète : ${getItemName(target.item)} (+${target.rate}/min)`,
            tag: `3. LIGNE PRINCIPALE (${getItemName(target.item).toUpperCase()})`,
            targetItem: target.item,
            targetRate: target.rate,
            steps: steps,
            totalMachines: steps.reduce((sum, s) => sum + (s.physicalMachines || Math.ceil(s.machinesCount)), 0),
            powerMW: results.totalPowerMW,
            desc: `Fabrication en flux continu de ${getItemName(target.item)}.`
          });
        }
      }

      return lines;
    },

    generateSteps(results, isMs = false) {
      const state = isMs ? this.msState : this.singleState;
      const maxBeltMk = state.maxBeltMk || 3;
      const BELT_CAPS = { 1: 60, 2: 120, 3: 270, 4: 480, 5: 780 };
      const maxCap = BELT_CAPS[maxBeltMk] || 270;
      const isMultiFloor = state.architectureMode === "multi_floor";
      const densityProfile = state.densityProfile || "standard";

      const steps = [];
      const prodSteps = results.productionSteps || [];
      const totalMachines = prodSteps.reduce((sum, s) => sum + (s.physicalMachines || Math.ceil(s.machinesCount)), 0);
      const targetItem = (results.targets && results.targets[0]) || { item: "Produit Fini", rate: 10 };
      const targetName = results.targets && results.targets.length === 1 
        ? (ITEM_NAMES[targetItem.item] || targetItem.item)
        : (results.targets || []).map(t => `${t.rate}/m ${ITEM_NAMES[t.item]||t.item}`).join(" + ");
      const factoryTitle = results.milestoneName || targetName;
      const rawResources = results.rawResources || {};
      const rawList = Object.entries(rawResources);

      const smelters = prodSteps.filter(s => s.building && (s.building.id === "smelter" || s.building.id === "foundry"));
      const constructors = prodSteps.filter(s => s.building && (s.building.id === "constructor"));
      const assemblers = prodSteps.filter(s => s.building && (s.building.id === "assembler" || s.building.id === "manufacturer" || s.building.id === "refinery" || s.building.id === "blender" || s.building.id === "packager"));

      // =========================================================================
      // CAS 1 : MODE MULTI-ÉTAGES VERTICAL (DÉCOUPAGE PAR ÉTAGE 0, 1, 2)
      // =========================================================================
      if (isMultiFloor) {
        // --- ÉTAGE 0 (RDC) ---
        steps.push({
          baseId: "step_floor0_foundations",
          targetFloor: 0,
          tag: "RDC : 1. FONDATIONS SOL",
          title: "1. [RDC] Pose de la dalle de sol (32m × 32m) & Mur Panneau Sandwich",
          desc: "Posez la dalle de fondation de base au niveau du sol et élevez le mur panneau sandwich technique pour les ascenseurs.",
          details: `
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <div>📐 <strong>Emprise au sol :</strong> Dalles de 8m×8m avec vide technique de 6m.</div>
              <div>📍 <strong>Niveau :</strong> <span style="color: #a855f7; font-weight: bold;">Niveau 0 (RDC)</span>.</div>
              <div>🧭 <strong>Alignement :</strong> Dégager l'accès logistique Sud pour l'arrivée des minerais bruts.</div>
            </div>
          `,
          shopping: [{ name: "Béton", qty: 96, icon: "🧱" }],
          svg: (st) => this.generateTopDownFactoryBlueprintSVG(results, "step_foundations", { ...st, activeFloor: 0 })
        });

        let rawSplittersCount = 0;
        rawList.forEach(([item, rate]) => {
          rawSplittersCount += Math.max(1, Math.ceil(rate / maxCap));
        });

        steps.push({
          baseId: "step_floor0_raw_logistics",
          targetFloor: 0,
          tag: "RDC : 2. ARRIVÉES MINERAIS",
          title: `2. [RDC] Arrivées de minerais bruts (${rawList.length} flux • Tapis Max Mk.${maxBeltMk})`,
          desc: "Amenez les flux de minerais bruts au Sud du RDC et installez les puits d'accès logistiques.",
          details: `
            <div style="display: flex; flex-direction: column; gap: 6px;">
              ${rawList.map(([item, rate]) => {
                const rRate = Math.round(rate * 10) / 10;
                const isOverCap = rate > maxCap;
                const parallelBelts = Math.ceil(rate / maxCap);
                const splitWarning = isOverCap 
                  ? `<span style="color: #ef4444; font-weight: bold;">⚠️ Dépasse Mk.${maxBeltMk} (${maxCap}/m) ➔ Diviser en ${parallelBelts} convoyeurs Mk.${maxBeltMk}</span>`
                  : `<span style="color: #10b981; font-weight: bold;">✓ 1 Tapis Mk.${maxBeltMk} suffit</span>`;
                return `<div>📥 <strong>${ITEM_NAMES[item]||item} :</strong> <span style="color: #f59e0b; font-weight: bold;">${rRate}/min</span> ➔ ${splitWarning}</div>`;
              }).join("") || "<div>📥 <em>Alimentation directe</em></div>"}
              <div>📍 <strong>Niveau :</strong> <span style="color: #a855f7; font-weight: bold;">Niveau 0 (RDC) - Bord Sud</span>.</div>
            </div>
          `,
          shopping: [
            { name: `Plaque de fer (Tapis Mk.${maxBeltMk})`, qty: 50, icon: "📦" },
            { name: "Plaque de fer renf. (Répartiteurs)", qty: Math.max(rawSplittersCount * 2, 4), icon: "⚙️" }
          ],
          svg: (st) => this.generateTopDownFactoryBlueprintSVG(results, "step_raw_logistics", { ...st, activeFloor: 0 })
        });

        const smeltMachines = smelters.reduce((sum, s) => sum + (s.physicalMachines || Math.ceil(s.machinesCount)), 0);
        const smeltShopping = [];
        smelters.forEach(s => {
          const bCost = BUILDINGS[s.building?.id]?.cost || { "iron_rod": 8, "wire": 5 };
          const mCount = s.physicalMachines || Math.ceil(s.machinesCount);
          Object.entries(bCost).forEach(([cItem, q]) => {
            const ex = smeltShopping.find(sh => sh.name === (ITEM_NAMES[cItem]||cItem));
            if (ex) ex.qty += q * mCount;
            else smeltShopping.push({ name: ITEM_NAMES[cItem]||cItem, qty: q * mCount, icon: "🏭" });
          });
        });
        if (densityProfile === "compact") smeltShopping.push({ name: "Éclat de charge", qty: smeltMachines * 2, icon: "💎" });

        steps.push({
          baseId: "step_floor0_smelters",
          targetFloor: 0,
          tag: "RDC : 3. POSE DES FONDERIES",
          title: `3. [RDC] Pose des Fonderies FICSIT (${smeltMachines} machine(s))`,
          desc: "Installez les fonderies/fours alignés sur la dalle du RDC face au Nord.",
          details: `
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <div>🏭 <strong>Machines au RDC :</strong> ${smeltMachines}× Fonderie(s)/Four(s).</div>
              <div>🧭 <strong>Orientation :</strong> Entrées face au Sud (vide technique), Sorties vers le Nord (mur sandwich).</div>
            </div>
          `,
          shopping: smeltShopping,
          svg: (st) => this.generateTopDownFactoryBlueprintSVG(results, "step_smelters", { ...st, activeFloor: 0 })
        });

        steps.push({
          baseId: "step_floor0_smelters_conveyors",
          targetFloor: 0,
          tag: "RDC : 4. CONVOYEURS & LIFTS FONDERIES",
          title: "4. [RDC] Réseau de Convoyeurs, Répartiteurs en Sous-Sol & Lifts 1 (+18m)",
          desc: "Posez les passe-dalles, les répartiteurs en sous-sol technique et raccordez les sorties aux ascenseurs verticaux (Lifts 1) montants en gaine vers l'Étage 1.",
          details: `
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <div>▲ <strong>Ascenseurs verticaux (+18m) :</strong> Expédient les lingots fondus dans la gaine technique vers le sous-sol de l'Étage 1.</div>
              <div>🔀 <strong>Manifolds Sous-Sol :</strong> Distribution des minerais aux fonderies sans aucun croisement en surface.</div>
              <div>⚡ <strong>Réseau RDC :</strong> Câbler les fonderies vers le pylône principal au RDC.</div>
            </div>
          `,
          shopping: [
            { name: `Plaque de fer (Tapis Mk.${maxBeltMk})`, qty: 60, icon: "📦" },
            { name: "Ascenseur de convoyeur", qty: Math.max(smeltMachines, 2), icon: "▲" },
            { name: "Câble", qty: 25, icon: "⚡" }
          ],
          svg: (st) => this.generateTopDownFactoryBlueprintSVG(results, "step_smelters", { ...st, activeFloor: 0 })
        });

        // --- ÉTAGE 1 (+18m) ---
        steps.push({
          baseId: "step_floor1_slab",
          targetFloor: 1,
          tag: "ÉTAGE 1 : 5. PLANCHER (+18M)",
          title: "5. [Étage 1] Pose du plancher sandwich suspendu (+18m, 6m sous-sol)",
          desc: "Montez de 18 mètres et posez le plancher sandwich de l'Étage 1 avec son vide technique suspendu.",
          details: `
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <div>📐 <strong>Dimensions :</strong> Dalles suspendues à +18m avec 6m de sous-sol technique.</div>
              <div>📍 <strong>Niveau :</strong> <span style="color: #38bdf8; font-weight: bold;">Niveau 1 (+18m)</span>.</div>
            </div>
          `,
          shopping: [{ name: "Béton", qty: 96, icon: "🧱" }],
          svg: (st) => this.generateTopDownFactoryBlueprintSVG(results, "step_foundations", { ...st, activeFloor: 1 })
        });

        const constMachines = constructors.reduce((sum, s) => sum + (s.physicalMachines || Math.ceil(s.machinesCount)), 0);
        const constShopping = [];
        constructors.forEach(s => {
          const bCost = BUILDINGS[s.building?.id]?.cost || { "reinforced_iron_plate": 2, "cable": 8 };
          const mCount = s.physicalMachines || Math.ceil(s.machinesCount);
          Object.entries(bCost).forEach(([cItem, q]) => {
            const ex = constShopping.find(sh => sh.name === (ITEM_NAMES[cItem]||cItem));
            if (ex) ex.qty += q * mCount;
            else constShopping.push({ name: ITEM_NAMES[cItem]||cItem, qty: q * mCount, icon: "🏭" });
          });
        });
        if (densityProfile === "compact") constShopping.push({ name: "Éclat de charge", qty: constMachines * 2, icon: "💎" });

        steps.push({
          baseId: "step_floor1_constructors",
          targetFloor: 1,
          tag: "ÉTAGE 1 : 6. POSE CONSTRUCTEURS",
          title: `6. [Étage 1] Pose des Constructeurs FICSIT (${constMachines} machine(s))`,
          desc: "Installez les constructeurs sur la dalle du 1er étage pour usiner les pièces intermédiaires.",
          details: `
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <div>🏭 <strong>Machines à l'Étage 1 :</strong> ${constMachines}× Constructeur(s) FICSIT.</div>
              <div>⚙️ <strong>Usinage :</strong> Fabrication des composants (Plaques, Tiges, Vis, Fils...).</div>
            </div>
          `,
          shopping: constShopping,
          svg: (st) => this.generateTopDownFactoryBlueprintSVG(results, "step_constructors", { ...st, activeFloor: 1 })
        });

        steps.push({
          baseId: "step_floor1_constructors_conveyors",
          targetFloor: 1,
          tag: "ÉTAGE 1 : 7. CONVOYEURS & LIFTS CONSTRUCTEURS",
          title: "7. [Étage 1] Réseau de Convoyeurs d'Usinage, Manifold Sous-Sol & Lifts 2 (+36m)",
          desc: "Raccordez l'infeed manifold depuis le Lift 1, posez les passe-dalles et connectez les sorties aux ascenseurs verticaux (Lifts 2) vers l'Étage 2.",
          details: `
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <div>▼ <strong>Infeed Manifold :</strong> Distribution sous-sol par tronçons de 60/min vers chaque constructeur.</div>
              <div>▲ <strong>Ascenseurs verticaux (+36m) :</strong> Expédition des pièces usinées vers le plancher d'assemblage.</div>
              <div>⚡ <strong>Raccordement électrique :</strong> Poteau intermédiaire relié au réseau du RDC.</div>
            </div>
          `,
          shopping: [
            { name: `Plaque de fer (Tapis Mk.${maxBeltMk})`, qty: 70, icon: "📦" },
            { name: "Ascenseur de convoyeur", qty: Math.max(constMachines, 2), icon: "▲" },
            { name: "Câble", qty: 30, icon: "⚡" }
          ],
          svg: (st) => this.generateTopDownFactoryBlueprintSVG(results, "step_constructors", { ...st, activeFloor: 1 })
        });

        // --- ÉTAGE 2 (+36m) ---
        steps.push({
          baseId: "step_floor2_slab",
          targetFloor: 2,
          tag: "ÉTAGE 2 : 8. PLANCHER (+36M)",
          title: "8. [Étage 2] Pose du plancher sandwich supérieur (+36m, 6m sous-sol)",
          desc: "Montez à +36m et installez la dalle supérieure pour les assembleuses avec son sous-sol technique.",
          details: `
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <div>📐 <strong>Dimensions :</strong> Dalles suspendues à +36m de hauteur avec 6m de vide technique.</div>
              <div>📍 <strong>Niveau :</strong> <span style="color: #10b981; font-weight: bold;">Niveau 2 (+36m - Assemblage)</span>.</div>
            </div>
          `,
          shopping: [{ name: "Béton", qty: 96, icon: "🧱" }],
          svg: (st) => this.generateTopDownFactoryBlueprintSVG(results, "step_foundations", { ...st, activeFloor: 2 })
        });

        const assMachines = assemblers.reduce((sum, s) => sum + (s.physicalMachines || Math.ceil(s.machinesCount)), 0);
        const assShopping = [];
        assemblers.forEach(s => {
          const bCost = BUILDINGS[s.building?.id]?.cost || { "modular_frame": 4, "rotor": 8 };
          const mCount = s.physicalMachines || Math.ceil(s.machinesCount);
          Object.entries(bCost).forEach(([cItem, q]) => {
            const ex = assShopping.find(sh => sh.name === (ITEM_NAMES[cItem]||cItem));
            if (ex) ex.qty += q * mCount;
            else assShopping.push({ name: ITEM_NAMES[cItem]||cItem, qty: q * mCount, icon: "🏭" });
          });
        });
        if (densityProfile === "compact") assShopping.push({ name: "Éclat de charge", qty: assMachines * 2, icon: "💎" });
        if (densityProfile === "somersloop") assShopping.push({ name: "Somersloop (Artefact)", qty: 2, icon: "🔮" });

        steps.push({
          baseId: "step_floor2_assemblers",
          targetFloor: 2,
          tag: "ÉTAGE 2 : 9. POSE ASSEMBLEUSES",
          title: `9. [Étage 2] Pose des Assembleuses FICSIT (${assMachines} machine(s))`,
          desc: "Installez les assembleuses sur la dalle de l'Étage 2 pour finaliser la fabrication.",
          details: `
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <div>🏭 <strong>Machines à l'Étage 2 :</strong> ${assMachines}× Assembleuse(s) / Façonneuse(s).</div>
              <div>🎯 <strong>Production Finale :</strong> <span style="color: #10b981; font-weight: bold;">${targetName}</span>.</div>
            </div>
          `,
          shopping: assShopping,
          svg: (st) => this.generateTopDownFactoryBlueprintSVG(results, "step_assemblers", { ...st, activeFloor: 2 })
        });

        steps.push({
          baseId: "step_floor2_assemblers_conveyors",
          targetFloor: 2,
          tag: "ÉTAGE 2 : 10. CONVOYEURS & LIFTS ASSEMBLEUSES",
          title: "10. [Étage 2] Réseau de Convoyeurs Double Bus Dédié & Lifts 3 (+54m)",
          desc: "Posez le double bus parallèle en sous-sol (Tier 1 & Tier 2) et raccordez les sorties des assembleuses aux Lifts 3 montants vers le Hub de stockage.",
          details: `
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <div>▼ <strong>Double Bus Parallèle :</strong> Tier 1 (Bus A) et Tier 2 (Bus B) sous plancher sans aucun croisement.</div>
              <div>▲ <strong>Ascenseurs verticaux (+54m) :</strong> Acheminement du produit fini vers le sommet de la tour.</div>
              <div>⚡ <strong>Raccordement électrique :</strong> Câblage de l'étage d'assemblage.</div>
            </div>
          `,
          shopping: [
            { name: `Plaque de fer (Tapis Mk.${maxBeltMk})`, qty: 80, icon: "📦" },
            { name: "Ascenseur de convoyeur", qty: 2, icon: "▲" },
            { name: "Câble", qty: 30, icon: "⚡" }
          ],
          svg: (st) => this.generateTopDownFactoryBlueprintSVG(results, "step_power", { ...st, activeFloor: 2 })
        });

        // --- ÉTAGE 3 (+54m - HUB DE STOCKAGE INDUSTRIEL) ---
        steps.push({
          baseId: "step_floor3_slab",
          targetFloor: 3,
          tag: "ÉTAGE 3 : 11. PLANCHER EXPÉDITION (+54M)",
          title: "11. [Étage 3] Pose du plancher supérieur (+54m, 6m sous-sol)",
          desc: "Montez au dernier niveau (+54m) et installez la dalle supérieure pour les conteneurs industriels.",
          details: `
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <div>📐 <strong>Dimensions :</strong> Dalles suspendues à +54m avec vide technique logistique.</div>
              <div>📍 <strong>Niveau :</strong> <span style="color: #38bdf8; font-weight: bold;">Niveau 3 (+54m - Hub Logistique & Expédition)</span>.</div>
            </div>
          `,
          shopping: [{ name: "Béton", qty: 96, icon: "🧱" }],
          svg: (st) => this.generateTopDownFactoryBlueprintSVG(results, "step_foundations", { ...st, activeFloor: 2 })
        });

        steps.push({
          baseId: "step_floor3_storage",
          targetFloor: 3,
          tag: "ÉTAGE 3 : 12. GROS CONTENEURS",
          title: "12. [Étage 3] Pose des Gros Conteneurs Industriels de Stockage FICSIT",
          desc: "Posez les Conteneurs de Stockage Industriels FICSIT (48 slots) pour stocker la production terminée.",
          details: `
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <div>📦 <strong>Stockage :</strong> Gros Conteneur(s) de Stockage Industriel (Double étage, 48 slots FICSIT, jauge LED).</div>
            </div>
          `,
          shopping: [
            { name: "Plaque de fer renf.", qty: 30, icon: "📦" },
            { name: "Tige de fer", qty: 40, icon: "🔩" }
          ],
          svg: (st) => this.generateTopDownFactoryBlueprintSVG(results, "step_output_storage", { ...st, activeFloor: 2 })
        });

        steps.push({
          baseId: "step_floor3_storage_conveyors",
          targetFloor: 3,
          tag: "ÉTAGE 3 : 13. CONVOYEURS FINAUX & DÔME (+70M)",
          title: "13. [Étage 3 - Sommet] Réseau de Convoyeurs Finaux de Stockage, Câblage & Dôme Vitré (+70m)",
          desc: "Raccordez les convoyeurs sous-sol du 3e étage aux conteneurs et posez la toiture dôme vitrée culminant à +70m.",
          details: `
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <div>🏛️ <strong>Toiture Dôme Vitrée :</strong> Culmine à +70m avec pylône haute tension FICSIT.</div>
              <div>⚡ <strong>Puissance Totale de la Tour :</strong> <span style="color: #f59e0b; font-weight: 800;">${results.totalPowerMW || 0} MW</span>.</div>
              <div>✨ <strong>Validation :</strong> Les 4 niveaux tournent de manière synchronisée à 100% d'efficacité !</div>
            </div>
          `,
          shopping: [
            { name: "Poutre d'acier", qty: 20, icon: "🏗️" },
            { name: "Verre de silice", qty: 40, icon: "🪟" },
            { name: "Câble", qty: 30, icon: "⚡" }
          ],
          svg: (st) => this.generateTopDownFactoryBlueprintSVG(results, "step_output_storage", { ...st, activeFloor: 2 })
        });

        return steps;
      }

      // =========================================================================
      // CAS 2 : MODE PLAIN-PIED (1 ÉTAGE - DÉCOUPAGE PAR ÉTAPES BÂTIMENTS & CONVOYEURS)
      // =========================================================================
      // 1. Étape 1 : Fondations
      steps.push({
        baseId: "step_foundations",
        tag: "1. FONDATIONS & SOL",
        title: `1. Pose de la dalle de fondations pour : ${factoryTitle}`,
        desc: `Installez la dalle de fondation plane avec vide technique de 6m alignée sur la grille mondiale. Cette dalle accueillera l'ensemble du complexe de ${totalMachines} machines.`,
        details: `
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <div>🧭 <strong>Alignement :</strong> Placer la dalle face au Nord avec accès logistique minerais au Sud.</div>
            <div>🏭 <strong>Capacité :</strong> Prévue pour ${totalMachines} machines FICSIT en flux continu.</div>
          </div>
        `,
        shopping: [{ name: "Béton", qty: 216, icon: "🧱" }],
        svg: (st) => this.generateTopDownFactoryBlueprintSVG(results, "step_foundations", st)
      });

      // 2. Étape 2 : Arrivées Minerais & Manifolds d'entrée
      let rawSplittersCount = 0;
      rawList.forEach(([item, rate]) => {
        rawSplittersCount += Math.max(1, Math.ceil(rate / maxCap));
      });
      const rawShopping = [
        { name: `Plaque de fer (Tapis Mk.${maxBeltMk})`, qty: 80, icon: "📦" },
        { name: "Plaque de fer renf. (Répartiteurs)", qty: Math.max(rawSplittersCount * 2, 4), icon: "⚙️" }
      ];

      steps.push({
        baseId: "step_raw_logistics",
        tag: "2. ARRIVÉES BRUTES",
        title: `2. Arrivées de matières premières (${rawList.length} flux • Tapis Max Mk.${maxBeltMk})`,
        desc: `Amenez les flux de matières premières brutes au bord Sud de la dalle et posez la ligne de répartiteurs en sous-sol.`,
        details: `
          <div style="display: flex; flex-direction: column; gap: 6px;">
            ${rawList.map(([item, rate]) => {
              const rRate = Math.round(rate * 10) / 10;
              const isOverCap = rate > maxCap;
              const parallelBelts = Math.ceil(rate / maxCap);
              const splitWarning = isOverCap 
                ? `<span style="color: #ef4444; font-weight: bold;">⚠️ Dépasse Mk.${maxBeltMk} (${maxCap}/m) ➔ Diviser en ${parallelBelts} lignes parallèles Mk.${maxBeltMk}</span>`
                : `<span style="color: #10b981; font-weight: bold;">✓ 1 Tapis Mk.${maxBeltMk} suffit</span>`;
              return `<div>📥 <strong>${ITEM_NAMES[item]||item} :</strong> <span style="color: #f59e0b; font-weight: bold;">${rRate}/min</span> ➔ ${splitWarning}</div>`;
            }).join("") || "<div>📥 <em>Alimentation par composants intermédiaires</em></div>"}
          </div>
        `,
        shopping: rawShopping,
        svg: (st) => this.generateTopDownFactoryBlueprintSVG(results, "step_raw_logistics", st)
      });

      // 3. Étape 3 : Pose Fonderies
      const smeltMachines = smelters.reduce((sum, s) => sum + (s.physicalMachines || Math.ceil(s.machinesCount)), 0);
      steps.push({
        baseId: "step_smelters_buildings",
        tag: "3. POSE FONDERIES",
        title: `3. Pose des Fonderies FICSIT (${smeltMachines} machine(s))`,
        desc: "Installez les fonderies sur la rangée Sud de la dalle de fondation.",
        details: `
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <div>🏭 <strong>Machines :</strong> ${smeltMachines}× Fonderie(s)/Four(s).</div>
          </div>
        `,
        shopping: [{ name: "Tige de fer", qty: smeltMachines * 8, icon: "🔩" }, { name: "Fil actif", qty: smeltMachines * 5, icon: "🧵" }],
        svg: (st) => this.generateTopDownFactoryBlueprintSVG(results, "step_smelters", st)
      });

      // 4. Étape 4 : Convoyeurs Fonderies
      steps.push({
        baseId: "step_smelters_conveyors",
        tag: "4. CONVOYEURS FONDERIES",
        title: "4. Réseau de Convoyeurs Fonderies & Passe-Dalles en Sous-Sol",
        desc: "Posez les répartiteurs d'entrée, les passe-dalles et les convoyeurs de liaison vers les constructeurs.",
        details: `
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <div>▼ <strong>Distribution :</strong> Convoyeurs dédiés sous la dalle reliant directement les fonderies aux constructeurs.</div>
          </div>
        `,
        shopping: [{ name: `Plaque de fer (Tapis Mk.${maxBeltMk})`, qty: 80, icon: "📦" }],
        svg: (st) => this.generateTopDownFactoryBlueprintSVG(results, "step_smelters", st)
      });

      // 5. Étape 5 : Pose Constructeurs
      const constMachines = constructors.reduce((sum, s) => sum + (s.physicalMachines || Math.ceil(s.machinesCount)), 0);
      steps.push({
        baseId: "step_constructors_buildings",
        tag: "5. POSE CONSTRUCTEURS",
        title: `5. Pose des Constructeurs FICSIT (${constMachines} machine(s))`,
        desc: "Installez les constructeurs sur la rangée intermédiaire.",
        details: `
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <div>🏭 <strong>Machines :</strong> ${constMachines}× Constructeur(s) FICSIT.</div>
          </div>
        `,
        shopping: [{ name: "Plaque de fer renf.", qty: constMachines * 2, icon: "⚙️" }, { name: "Câble", qty: constMachines * 8, icon: "⚡" }],
        svg: (st) => this.generateTopDownFactoryBlueprintSVG(results, "step_constructors", st)
      });

      // 6. Étape 6 : Convoyeurs Constructeurs
      steps.push({
        baseId: "step_constructors_conveyors",
        tag: "6. CONVOYEURS CONSTRUCTEURS",
        title: "6. Réseau de Convoyeurs d'Usinage & Manifolds en Sous-Sol",
        desc: "Raccordez les manifolds d'usinage et les convoyeurs dédiés d'évacuation vers les assembleuses.",
        details: `
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <div>▼ <strong>Logistique :</strong> Tapis d'usinage et passe-dalles en sous-sol.</div>
          </div>
        `,
        shopping: [{ name: `Plaque de fer (Tapis Mk.${maxBeltMk})`, qty: 80, icon: "📦" }],
        svg: (st) => this.generateTopDownFactoryBlueprintSVG(results, "step_constructors", st)
      });

      // 7. Étape 7 : Pose Assembleuses
      const assMachines = assemblers.reduce((sum, s) => sum + (s.physicalMachines || Math.ceil(s.machinesCount)), 0);
      steps.push({
        baseId: "step_assemblers_buildings",
        tag: "7. POSE ASSEMBLEUSES",
        title: `7. Pose des Assembleuses FICSIT (${assMachines} machine(s))`,
        desc: "Installez les assembleuses pour fabriquer le produit fini.",
        details: `
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <div>🏭 <strong>Machines :</strong> ${assMachines}× Assembleuse(s) FICSIT.</div>
            <div>🎯 <strong>Produit Fini :</strong> <span style="color: #10b981; font-weight: bold;">${targetName}</span>.</div>
          </div>
        `,
        shopping: [{ name: "Cadre modulaire", qty: assMachines * 4, icon: "🏗️" }, { name: "Rotor", qty: assMachines * 8, icon: "🔄" }],
        svg: (st) => this.generateTopDownFactoryBlueprintSVG(results, "step_assemblers", st)
      });

      // 8. Étape 8 : Convoyeurs Assembleuses
      steps.push({
        baseId: "step_assemblers_conveyors",
        tag: "8. CONVOYEURS ASSEMBLEUSES",
        title: "8. Réseau de Convoyeurs d'Assemblage & Bus Dédiés Sous-Sol",
        desc: "Raccordez le double bus mono-composant d'alimentation et le convoyeur final d'évacuation.",
        details: `
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <div>▼ <strong>Double Bus :</strong> Alimentation distincte pour chaque port d'entrée.</div>
          </div>
        `,
        shopping: [{ name: `Plaque de fer (Tapis Mk.${maxBeltMk})`, qty: 60, icon: "📦" }],
        svg: (st) => this.generateTopDownFactoryBlueprintSVG(results, "step_assemblers", st)
      });

      // 9. Étape 9 : Stockage & Électricité
      steps.push({
        baseId: "step_output_storage",
        tag: "9. STOCKAGE & ÉLECTRICITÉ",
        title: `9. Pose des Conteneurs de Stockage FICSIT & Câblage Électrique (${results.totalPowerMW || 0} MW)`,
        desc: "Posez le conteneur de stockage industriel au Nord, câblez les machines et mettez l'usine sous tension.",
        details: `
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <div>📦 <strong>Stockage :</strong> 1 Conteneur Industriel FICSIT.</div>
            <div>⚡ <strong>Puissance Totale :</strong> <span style="color: #f59e0b; font-weight: 800;">${results.totalPowerMW || 0} MW</span>.</div>
          </div>
        `,
        shopping: [
          { name: "Plaque de fer renf.", qty: 10, icon: "📦" },
          { name: "Tige de fer", qty: 20, icon: "🔩" },
          { name: "Câble", qty: 40, icon: "⚡" }
        ],
        svg: (st) => this.generateTopDownFactoryBlueprintSVG(results, "step_output_storage", st)
      });

      return steps;
    },

    renderCurrentStep(isMs = false) {
      const state = isMs ? this.msState : this.singleState;
      if (!state || !state.steps || state.steps.length === 0) return;
      const step = state.steps[state.currentStepIndex];
      if (!step) return;

      const prefix = isMs ? "guide-ms-" : "guide-";
      const btnPrefix = isMs ? "btn-guide-ms-" : "btn-guide-";

      if (state.floorFilter === undefined || state.floorFilter === null) {
        if (typeof step.targetFloor === "number") {
          state.activeFloor = step.targetFloor;
        }
      }

      const badgeEl = document.getElementById(`${prefix}step-counter-badge`);
      const tagEl = document.getElementById(`${prefix}step-tag`);
      const titleEl = document.getElementById(`${prefix}step-title`);
      const descEl = document.getElementById(`${prefix}step-description`);
      const detailsEl = document.getElementById(`${prefix}step-details-card`);
      const shoppingEl = document.getElementById(`${prefix}step-shopping-list`);
      const svgViewport = document.getElementById(`${prefix}step-svg-viewport`);
      const progressFill = document.getElementById(`${prefix}progress-bar-fill`);
      const progressPct = document.getElementById(`${prefix}progress-pct`);
      const validateBtn = document.getElementById(`${btnPrefix}validate-step`);
      const toggleFullBtn = document.getElementById(`${btnPrefix}toggle-full-view`);

      // Sélecteur de plancher (affiché si multi_floor)
      const floorSelectorCont = document.getElementById(`${prefix}floor-selector-container`);
      if (floorSelectorCont) {
        floorSelectorCont.style.display = state.architectureMode === "multi_floor" ? "flex" : "none";
        floorSelectorCont.querySelectorAll(`.${btnPrefix}floor-tab, .btn-guide-floor-tab`).forEach(btn => {
          const fl = parseInt(btn.getAttribute("data-floor"), 10);
          if (fl === state.activeFloor) {
            btn.style.borderColor = "#a855f7";
            btn.style.color = "#a855f7";
            btn.style.background = "rgba(168, 85, 247, 0.2)";
          } else {
            btn.style.borderColor = "rgba(255, 255, 255, 0.2)";
            btn.style.color = "#94a3b8";
            btn.style.background = "transparent";
          }
        });
      }

      if (badgeEl) badgeEl.innerText = `Étape ${state.currentStepIndex + 1} / ${state.steps.length}`;
      if (tagEl) tagEl.innerText = step.tag;
      if (titleEl) titleEl.innerText = step.title;
      if (descEl) descEl.innerText = step.desc;
      if (detailsEl) detailsEl.innerHTML = step.details;

      if (shoppingEl) {
        shoppingEl.innerHTML = (step.shopping || []).map(s => `
          <div style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 4px; padding: 4px 8px; font-size: 11.5px; font-weight: bold; color: #a7f3d0; display: inline-flex; align-items: center; gap: 4px;">
            <span>${s.icon || "📦"}</span> ${s.qty}× ${s.name}
          </div>
        `).join("");
      }

      if (svgViewport) {
        const floorToRender = (state.floorFilter !== undefined && state.floorFilter !== null && state.floorFilter !== "all") ? state.floorFilter : state.activeFloor;
        const renderState = { ...state, activeFloor: floorToRender };
        if (state.currentViewMode === "full" && state.lastResults) {
          svgViewport.innerHTML = this.generateTopDownFactoryBlueprintSVG(state.lastResults, null, renderState);
        } else {
          svgViewport.innerHTML = typeof step.svg === "function" ? step.svg(renderState) : step.svg;
        }
        // Attacher l'interactivité sur les machines et convoyeurs
        this.attachGuideInteractivity(svgViewport, state.lastResults, isMs);
      }

      if (toggleFullBtn) {
        toggleFullBtn.innerText = state.currentViewMode === "full" ? "🎯 Vue Étape Ciblée" : "🗺️ Vue Usine Complète 2D";
        toggleFullBtn.style.background = state.currentViewMode === "full" ? "rgba(56, 189, 248, 0.2)" : "transparent";
      }

      // Synchronisation du Visualiseur 3D Three.js & Contrôles d'Étages
      const floorControls3D = document.getElementById(isMs ? "guide-ms-3d-floor-controls" : "guide-3d-floor-controls");
      if (floorControls3D) {
        floorControls3D.style.display = state.architectureMode === "multi_floor" ? "flex" : "none";
        const currentActiveFilter = (state.floorFilter !== undefined && state.floorFilter !== null) ? state.floorFilter.toString() : state.activeFloor.toString();
        floorControls3D.querySelectorAll(".btn-3d-floor").forEach(b => {
          const fl = b.getAttribute("data-floor");
          if (fl === currentActiveFilter) {
            b.classList.add("active");
          } else {
            b.classList.remove("active");
          }
        });
      }

      const viewer = isMs ? this.ms3DViewer : this.single3DViewer;
      if (viewer && viewer.isInitialized) {
        viewer.goToStep(state.currentStepIndex, state.viewMode3D || "step");
        const floorToFilter = (state.floorFilter !== undefined && state.floorFilter !== null)
          ? state.floorFilter
          : (state.architectureMode === "multi_floor" && typeof step.targetFloor === "number" ? step.targetFloor : "all");
        viewer.setFloorFilter(floorToFilter);
      }

      // Synchronisation du HUD et des Flèches de Navigation d'Étape 3D
      const btn3DPrev = document.getElementById(isMs ? "btn-3d-ms-prev-step" : "btn-3d-prev-step");
      const btn3DNext = document.getElementById(isMs ? "btn-3d-ms-next-step" : "btn-3d-next-step");
      const btn3DHudPrev = document.getElementById(isMs ? "btn-3d-ms-hud-prev" : "btn-3d-hud-prev");
      const btn3DHudNext = document.getElementById(isMs ? "btn-3d-ms-hud-next" : "btn-3d-hud-next");
      const btn3DHudVal = document.getElementById(isMs ? "btn-3d-ms-hud-validate" : "btn-3d-hud-validate");
      const hud3DNum = document.getElementById(isMs ? "guide-ms-3d-step-hud-num" : "guide-3d-step-hud-num");
      const hud3DTitle = document.getElementById(isMs ? "guide-ms-3d-step-hud-title" : "guide-3d-step-hud-title");

      if (btn3DPrev) btn3DPrev.disabled = (state.currentStepIndex <= 0);
      if (btn3DNext) btn3DNext.disabled = (state.currentStepIndex >= state.steps.length - 1);
      if (btn3DHudPrev) btn3DHudPrev.disabled = (state.currentStepIndex <= 0);
      if (btn3DHudNext) btn3DHudNext.disabled = (state.currentStepIndex >= state.steps.length - 1);
      if (hud3DNum) hud3DNum.innerText = `Étape ${state.currentStepIndex + 1} / ${state.steps.length}`;
      if (hud3DTitle) hud3DTitle.innerText = step.title;

      // Synchronisation du Plan 2D Incrusté sur le Visuel 3D
      const inset2DSvg = document.getElementById(isMs ? "guide-ms-3d-2d-svg-content" : "guide-3d-2d-svg-content");
      const inset2DFloorBadge = document.getElementById(isMs ? "guide-ms-3d-2d-floor-badge" : "guide-3d-2d-floor-badge");
      if (inset2DSvg) {
        const floorToRender = (state.floorFilter !== undefined && state.floorFilter !== null && state.floorFilter !== "all") ? state.floorFilter : state.activeFloor;
        const renderState = { ...state, activeFloor: floorToRender };
        const svgContent = typeof step.svg === "function" ? step.svg(renderState) : step.svg;
        inset2DSvg.innerHTML = svgContent;
        if (inset2DFloorBadge) {
          const fl = typeof floorToRender === "number" ? floorToRender : 0;
          inset2DFloorBadge.innerText = fl === 0 ? "RDC" : `Ét. ${fl}`;
        }
      }

      // Progression par calcul
      const calcKey = state.calcKey || "default";
      const validatedCount = state.steps.filter(s => this.validatedSteps.has(`${calcKey}__${s.baseId}`)).length;
      const pct = Math.round((validatedCount / Math.max(state.steps.length, 1)) * 100);
      if (progressFill) progressFill.style.width = `${pct}%`;
      if (progressPct) progressPct.innerText = `${pct}%`;

      // Bouton de validation
      const fullStepId = `${calcKey}__${step.baseId}`;
      const isDone = this.validatedSteps.has(fullStepId);
      if (validateBtn) {
        validateBtn.innerText = isDone ? "✅ Étape Validée (Fait)" : "✓ Valider cette étape";
        validateBtn.style.background = isDone ? "#059669" : "#10b981";
      }
      if (btn3DHudVal) {
        btn3DHudVal.innerText = isDone ? "✅ Validé" : "✓ Fait";
        btn3DHudVal.style.background = isDone ? "#059669" : "#10b981";
      }
    },

    init(results, isMs = false) {
      const sectionId = isMs ? "calc-ms-construction-guide-section" : "calc-construction-guide-section";
      const section = document.getElementById(sectionId);

      if (!results || !results.productionSteps || results.productionSteps.length === 0) {
        if (section) section.style.display = "none";
        return;
      }

      if (section) section.style.display = "block";

      const calcKey = isMs ? ("ms_" + (results.milestoneName || "default")) : ("single_" + ((results.targets && results.targets[0]?.item) || "default"));
      const state = isMs ? this.msState : this.singleState;
      state.calcKey = calcKey;
      state.lastResults = results;
      state.steps = this.generateSteps(results, isMs);
      state.currentStepIndex = 0;
      state.currentViewMode = "step";
      state.selectedMachine = null;
      state.viewType = state.viewType || "2d";
      state.viewMode3D = state.viewMode3D || "step";

      this.renderCurrentStep(isMs);

      const prefix = isMs ? "guide-ms-" : "guide-";
      const btnPrefix = isMs ? "btn-guide-ms-" : "btn-guide-";
      const prevBtn = document.getElementById(`${btnPrefix}prev-step`);
      const nextBtn = document.getElementById(`${btnPrefix}next-step`);
      const validateBtn = document.getElementById(`${btnPrefix}validate-step`);
      const toggleFullBtn = document.getElementById(`${btnPrefix}toggle-full-view`);
      const fullscreenBtn = document.getElementById(`${btnPrefix}fullscreen`);

      // Téléchargement direct du Blueprint (.sbp / .sbpcfg) depuis la notice de montage
      const downloadSbpBtn = document.getElementById(`${btnPrefix}download-sbp`);
      if (downloadSbpBtn) {
        downloadSbpBtn.onclick = async () => {
          try {
            downloadSbpBtn.disabled = true;
            downloadSbpBtn.innerHTML = "⏳ Génération...";

            const targetItem = results.targets && results.targets[0] ? results.targets[0] : { item: 'production', rate: 0 };
            const targetName = ITEM_NAMES[targetItem.item] || targetItem.item;
            const totalMachines = results.productionSteps.reduce((acc, s) => acc + (s.physicalMachines || Math.ceil(s.machinesCount)), 0);

            const bldCount = {};
            results.productionSteps.forEach(s => {
              const bId = s.building?.id || 'constructor';
              const count = s.physicalMachines || Math.ceil(s.machinesCount);
              bldCount[bId] = (bldCount[bId] || 0) + count;
            });

            const materialsNeeded = {};
            results.productionSteps.forEach(s => {
              const bld = (typeof BUILDINGS !== 'undefined' && BUILDINGS[s.building?.id]) ? BUILDINGS[s.building?.id] : null;
              const count = s.physicalMachines || Math.ceil(s.machinesCount);
              if (bld && bld.cost) {
                Object.entries(bld.cost).forEach(([mat, qty]) => {
                  materialsNeeded[mat] = (materialsNeeded[mat] || 0) + qty * count;
                });
              }
            });

            const bpPayload = {
              id: isMs ? `bp_ms_${(results.milestoneName || 'complexe').replace(/[^a-zA-Z0-9_]/g, '_')}` : `bp_calc_${(targetItem.item || 'usine').replace(/[^a-zA-Z0-9_]/g, '_')}`,
              title: isMs ? `🏭 Complexe ${results.milestoneName || 'Jalon'}` : `🏭 Usine ${targetName} (${targetItem.rate}/min)`,
              name: isMs ? `Complexe ${results.milestoneName || 'Jalon'}` : `Usine ${targetName}`,
              category: "production",
              designerSize: totalMachines <= 12 ? "4x4 Fondations (Designer Mk.1)" : (totalMachines <= 20 ? "5x5 Fondations (Designer Mk.2)" : "6x6 Fondations (Designer Mk.3)"),
              description: isMs 
                ? `Complexe complet généré pour ${results.milestoneName || 'Jalon'}.\n• Machines: ${totalMachines} unités\n• Puissance: ${Math.round(results.totalPowerMW || 0)} MW.`
                : `Usine complète générée pour ${targetName} à ${targetItem.rate}/min.\n• Machines: ${totalMachines} unités\n• Puissance: ${Math.round(results.totalPowerMW || 0)} MW.`,
              inputs: Object.entries(results.rawResources || {}).map(([r, rate]) => `${Math.round(rate * 10) / 10}/m ${ITEM_NAMES[r] || r}`),
              outputs: isMs ? (results.targets || []).map(t => `+${t.rate}/min ${ITEM_NAMES[t.item] || t.item}`) : [`+${targetItem.rate}/min ${targetName}`],
              powerMW: Math.round(results.totalPowerMW || 0),
              buildingsCount: bldCount,
              materialsNeeded: materialsNeeded
            };

            showToast(`⏳ Génération du Blueprint (.sbp) pour ${bpPayload.name}...`);
            const generator = (typeof BlueprintFileGenerator !== 'undefined') ? BlueprintFileGenerator : window.BlueprintFileGenerator;
            const activePlanData = {
              ...results,
              architectureMode: state.architectureMode,
              densityProfile: state.densityProfile,
              footprintMode: state.footprintMode || "auto",
              maxBeltMk: state.maxBeltMk,
              floorFilter: state.floorFilter,
              activeFloor: state.activeFloor
            };
            const files = await generator.generateFiles(bpPayload, activePlanData);
            generator.downloadBlob(files.sbpBlob, files.sbpFilename);
            setTimeout(() => {
              generator.downloadBlob(files.sbpcfgBlob, files.sbpcfgFilename);
            }, 100);
            showToast(`✅ Blueprint ${bpPayload.name} téléchargé (.sbp & .sbpcfg) !`);
          } catch(err) {
            console.error(err);
            showToast(`Erreur export blueprint : ${err.message}`);
          } finally {
            downloadSbpBtn.disabled = false;
            downloadSbpBtn.innerHTML = "📥 Télécharger le Blueprint (.sbp) (En cours de dev) (En cours de dev)";
          }
        };
      }

      // =====================================================================
      // 0. BASCULE 2D CAD TOP-DOWN / 3D INTERACTIVE THREE.JS
      // =====================================================================
      const btnView2D = document.getElementById(isMs ? "btn-guide-ms-view-2d" : "btn-guide-view-2d");
      const btnView3D = document.getElementById(isMs ? "btn-guide-ms-view-3d" : "btn-guide-view-3d");
      const container2D = document.getElementById(isMs ? "guide-ms-2d-container" : "guide-2d-container");
      const container3D = document.getElementById(isMs ? "guide-ms-3d-container" : "guide-3d-container");
      const viewport3DId = isMs ? "guide-ms-step-3d-viewport" : "guide-step-3d-viewport";

      const setup3DViewer = () => {
        let viewerInstance = isMs ? this.ms3DViewer : this.single3DViewer;
        if (!viewerInstance) {
          if (typeof Factory3DViewer !== "undefined") {
            viewerInstance = new Factory3DViewer(viewport3DId);
            if (isMs) this.ms3DViewer = viewerInstance;
            else this.single3DViewer = viewerInstance;
          }
        }
        if (viewerInstance) {
          viewerInstance.buildFactoryFromPlan({
            ...results,
            architectureMode: state.architectureMode,
            densityProfile: state.densityProfile,
            footprintMode: state.footprintMode || "auto",
            maxBeltMk: state.maxBeltMk
          }, state.steps);
          viewerInstance.goToStep(state.currentStepIndex, state.viewMode3D || "step");
          const floorToFilter = (state.floorFilter !== undefined && state.floorFilter !== null)
            ? state.floorFilter
            : (state.architectureMode === "multi_floor" && state.steps[state.currentStepIndex]?.targetFloor !== undefined ? state.steps[state.currentStepIndex].targetFloor : "all");
          viewerInstance.setFloorFilter(floorToFilter);
          setTimeout(() => viewerInstance.resize(), 60);
        }
      };

      if (btnView2D && btnView3D && container2D && container3D) {
        btnView2D.onclick = () => {
          state.viewType = "2d";
          btnView2D.classList.add("active");
          btnView3D.classList.remove("active");
          container2D.style.display = "block";
          container3D.style.display = "none";
        };

        btnView3D.onclick = () => {
          state.viewType = "3d";
          btnView3D.classList.add("active");
          btnView2D.classList.remove("active");
          container2D.style.display = "none";
          container3D.style.display = "block";
          setup3DViewer();
          showToast("🧊 Notice 3D Active : Clic gauche pour orbiter, clic droit pour translater, molette pour zoomer.");
        };
      }

      // Si le mode 3D était déjà actif, reconstruire la scène
      if (state.viewType === "3d" && container3D && container3D.style.display !== "none") {
        setup3DViewer();
      }

      // Contrôles Caméra 3D (ISO, Top, Face, Côté)
      const camIsoBtn = document.getElementById(isMs ? "btn-3d-ms-cam-iso" : "btn-3d-cam-iso");
      const camTopBtn = document.getElementById(isMs ? "btn-3d-ms-cam-top" : "btn-3d-cam-top");
      const camFrontBtn = document.getElementById(isMs ? "btn-3d-ms-cam-front" : "btn-3d-cam-front");
      const camSideBtn = document.getElementById(isMs ? "btn-3d-ms-cam-side" : "btn-3d-cam-side");

      const updateCamActiveBtn = (targetBtn) => {
        [camIsoBtn, camTopBtn, camFrontBtn, camSideBtn].forEach(b => {
          if (b) b.classList.remove("active");
        });
        if (targetBtn) targetBtn.classList.add("active");
      };

      if (camIsoBtn) camIsoBtn.onclick = () => { const v = isMs ? this.ms3DViewer : this.single3DViewer; if (v) v.setCameraPreset("iso"); updateCamActiveBtn(camIsoBtn); };
      if (camTopBtn) camTopBtn.onclick = () => { const v = isMs ? this.ms3DViewer : this.single3DViewer; if (v) v.setCameraPreset("top"); updateCamActiveBtn(camTopBtn); };
      if (camFrontBtn) camFrontBtn.onclick = () => { const v = isMs ? this.ms3DViewer : this.single3DViewer; if (v) v.setCameraPreset("front"); updateCamActiveBtn(camFrontBtn); };
      if (camSideBtn) camSideBtn.onclick = () => { const v = isMs ? this.ms3DViewer : this.single3DViewer; if (v) v.setCameraPreset("side"); updateCamActiveBtn(camSideBtn); };

      // Toggle Sous-Étages Logistiques (Vides Techniques)
      const subfloorToggleBtn = document.getElementById(isMs ? "btn-3d-ms-toggle-subfloor" : "btn-3d-toggle-subfloor");
      if (subfloorToggleBtn) {
        subfloorToggleBtn.onclick = () => {
          const v = isMs ? this.ms3DViewer : this.single3DViewer;
          if (v) {
            const isTransparent = v.toggleSubfloorView();
            subfloorToggleBtn.style.color = isTransparent ? "var(--ficsit-amber)" : "var(--text-secondary)";
            subfloorToggleBtn.style.borderColor = isTransparent ? "var(--ficsit-amber)" : "";
            showToast(`🔧 Vides Techniques : ${isTransparent ? "Mode Écorché (Planchers Transparents)" : "Mode Hall de Production (Normal)"}`);
          }
        };
      }

      // Toggle Badges / Étiquettes 3D
      const labelsToggleBtn = document.getElementById(isMs ? "btn-3d-ms-toggle-labels" : "btn-3d-toggle-labels");
      if (labelsToggleBtn) {
        labelsToggleBtn.onclick = () => {
          const v = isMs ? this.ms3DViewer : this.single3DViewer;
          if (v) {
            const isVisible = v.toggleLabels();
            labelsToggleBtn.style.color = isVisible ? "var(--ficsit-cyan)" : "var(--text-secondary)";
            labelsToggleBtn.style.borderColor = isVisible ? "var(--ficsit-cyan)" : "";
            showToast(`🏷️ Badges 3D : ${isVisible ? "Affichés" : "Masqués"}`);
          }
        };
      }

      // Toggle Mode Fantôme 3D
      const ghostToggleBtn = document.getElementById(isMs ? "btn-3d-ms-toggle-ghost" : "btn-3d-toggle-ghost");
      if (ghostToggleBtn) {
        ghostToggleBtn.onclick = () => {
          state.viewMode3D = state.viewMode3D === "ghost" ? "step" : "ghost";
          ghostToggleBtn.style.color = state.viewMode3D === "ghost" ? "var(--ficsit-cyan)" : "";
          ghostToggleBtn.style.borderColor = state.viewMode3D === "ghost" ? "var(--ficsit-cyan)" : "";
          const v = isMs ? this.ms3DViewer : this.single3DViewer;
          if (v) v.goToStep(state.currentStepIndex, state.viewMode3D);
          showToast(`👻 Mode 3D : ${state.viewMode3D === "ghost" ? "Hologramme futur actif" : "Étapes séquentielles"}`);
        };
      }

      // Toggle Plein Écran 3D
      const fullscreen3DBtn = document.getElementById(isMs ? "btn-3d-ms-toggle-fullscreen" : "btn-3d-toggle-fullscreen");
      const viewportWrapper = document.getElementById(isMs ? "guide-ms-3d-viewport-wrapper" : "guide-3d-viewport-wrapper");
      if (fullscreen3DBtn && viewportWrapper) {
        fullscreen3DBtn.onclick = () => {
          viewportWrapper.classList.toggle("is-fullscreen");
          const isFull = viewportWrapper.classList.contains("is-fullscreen");
          fullscreen3DBtn.textContent = isFull ? "✕ Quitter Plein Écran" : "⛶ Plein Écran";
          const v = isMs ? this.ms3DViewer : this.single3DViewer;
          if (v) setTimeout(() => v.resize(), 100);
        };
      }

      // 1. Liaison Tapis Max
      const beltSelect = document.getElementById(`${prefix}belt-tier`);
      if (beltSelect) {
        beltSelect.value = state.maxBeltMk.toString();
        beltSelect.onchange = () => {
          state.maxBeltMk = parseInt(beltSelect.value, 10);
          state.steps = this.generateSteps(state.lastResults, isMs);
          this.renderCurrentStep(isMs);
          if (state.viewType === "3d") setup3DViewer();
          showToast(`⚙️ Logistique ajustée pour Tapis Max Mk.${state.maxBeltMk}`);
        };
      }

      // 2. Liaison Profil de Densité
      const densitySelect = document.getElementById(`${prefix}density-profile`);
      if (densitySelect) {
        densitySelect.value = state.densityProfile;
        densitySelect.onchange = () => {
          state.densityProfile = densitySelect.value;
          state.steps = this.generateSteps(state.lastResults, isMs);
          this.renderCurrentStep(isMs);
          if (state.viewType === "3d") setup3DViewer();
          showToast(`🎛️ Profil appliqué : ${state.densityProfile === "compact" ? "Micro-Usine (250% Overclock)" : (state.densityProfile === "somersloop" ? "Somersloop ×2 (Doublement)" : "Standard 100%")}`);
        };
      }

      // 3. Liaison Architecture Mode & Multi-Étages
      const archSelect = document.getElementById(`${prefix}architecture-mode`);
      if (archSelect) {
        archSelect.value = state.architectureMode;
        archSelect.onchange = () => {
          state.architectureMode = archSelect.value;
          state.activeFloor = 0;
          state.steps = this.generateSteps(state.lastResults, isMs);
          this.renderCurrentStep(isMs);
          if (state.viewType === "3d") setup3DViewer();
          showToast(`🏢 Mode Bâtiment : ${state.architectureMode === "multi_floor" ? "Vertical (3 Étages + Ascenseurs)" : "Plain-Pied (1 Étage)"}`);
        };
      }

      // 3. bis Liaison Gabarit de Dalle (Illimité vs Compact 6x6)
      const footprintSelect = document.getElementById(`${prefix}footprint-mode`);
      if (footprintSelect) {
        footprintSelect.value = state.footprintMode || "auto";
        footprintSelect.onchange = () => {
          state.footprintMode = footprintSelect.value;
          state.steps = this.generateSteps(state.lastResults, isMs);
          this.renderCurrentStep(isMs);
          if (state.viewType === "3d") setup3DViewer();
          showToast(`📐 Gabarit de Dalle : ${state.footprintMode === "compact" ? "Standard Blueprint (48m × 48m)" : "Méga-Usine Illimitée (Auto-Fit 100% Machines)"}`);
        };
      }

      // 4. Liaison Onglets d'Étages (2D & 3D)
      const floorCont = document.getElementById(`${prefix}floor-selector-container`);
      const floorControls3D = document.getElementById(isMs ? "guide-ms-3d-floor-controls" : "guide-3d-floor-controls");

      const selectFloor = (flStr) => {
        const v = isMs ? this.ms3DViewer : this.single3DViewer;
        if (flStr === "all") {
          state.activeFloor = 0;
          state.floorFilter = "all";
          if (v) v.setFloorFilter("all");
          showToast("🏢 Vue 3D : Tour Complète");
        } else {
          const targetFloorNum = parseInt(flStr, 10);
          state.activeFloor = targetFloorNum;
          state.floorFilter = targetFloorNum;
          const targetStepIdx = state.steps.findIndex(s => s.targetFloor === targetFloorNum);
          if (targetStepIdx !== -1) {
            state.currentStepIndex = targetStepIdx;
          }
          if (v) v.setFloorFilter(targetFloorNum);
          showToast(`🏢 Focus Étage ${targetFloorNum === 0 ? 'RDC' : targetFloorNum}`);
        }
        this.renderCurrentStep(isMs);
      };

      if (floorControls3D) {
        floorControls3D.style.display = state.architectureMode === "multi_floor" ? "flex" : "none";
        floorControls3D.querySelectorAll(".btn-3d-floor").forEach(b => {
          b.onclick = () => {
            selectFloor(b.getAttribute("data-floor"));
          };
        });
      }

      if (floorCont) {
        floorCont.querySelectorAll("button").forEach(btn => {
          btn.onclick = () => {
            selectFloor(btn.getAttribute("data-floor"));
          };
        });
      }

      // 5. Gestion des Flèches et Navigation d'Étapes 3D
      const btn3DPrev = document.getElementById(isMs ? "btn-3d-ms-prev-step" : "btn-3d-prev-step");
      const btn3DNext = document.getElementById(isMs ? "btn-3d-ms-next-step" : "btn-3d-next-step");
      const btn3DHudPrev = document.getElementById(isMs ? "btn-3d-ms-hud-prev" : "btn-3d-hud-prev");
      const btn3DHudNext = document.getElementById(isMs ? "btn-3d-ms-hud-next" : "btn-3d-hud-next");
      const btn3DHudVal = document.getElementById(isMs ? "btn-3d-ms-hud-validate" : "btn-3d-hud-validate");

      const handleStepPrev = () => {
        if (state.currentStepIndex > 0) {
          state.currentStepIndex--;
          state.floorFilter = null;
          this.renderCurrentStep(isMs);
        }
      };

      const handleStepNext = () => {
        if (state.currentStepIndex < state.steps.length - 1) {
          state.currentStepIndex++;
          state.floorFilter = null;
          this.renderCurrentStep(isMs);
        }
      };

      if (btn3DPrev) btn3DPrev.onclick = handleStepPrev;
      if (btn3DNext) btn3DNext.onclick = handleStepNext;
      if (btn3DHudPrev) btn3DHudPrev.onclick = handleStepPrev;
      if (btn3DHudNext) btn3DHudNext.onclick = handleStepNext;
      if (btn3DHudVal && validateBtn) {
        btn3DHudVal.onclick = () => validateBtn.click();
      }

      // 6. Gestion du Plan 2D Incrusté sur le Visuel 3D
      const toggle2DPlanBtn = document.getElementById(isMs ? "btn-3d-ms-toggle-2d-plan" : "btn-3d-toggle-2d-plan");
      const inset2DContainer = document.getElementById(isMs ? "guide-ms-3d-2d-inset" : "guide-3d-2d-inset");
      const inset2DCloseBtn = document.getElementById(isMs ? "btn-3d-ms-2d-inset-close" : "btn-3d-2d-inset-close");
      const inset2DToggleSizeBtn = document.getElementById(isMs ? "btn-3d-ms-2d-inset-toggle-size" : "btn-3d-2d-inset-toggle-size");

      if (toggle2DPlanBtn && inset2DContainer) {
        toggle2DPlanBtn.onclick = () => {
          inset2DContainer.classList.toggle("is-hidden");
          const isHidden = inset2DContainer.classList.contains("is-hidden");
          toggle2DPlanBtn.classList.toggle("active", !isHidden);
          toggle2DPlanBtn.style.color = !isHidden ? "var(--ficsit-cyan)" : "var(--text-secondary)";
          toggle2DPlanBtn.style.borderColor = !isHidden ? "var(--ficsit-cyan)" : "";
          showToast(`📐 Plan 2D Incrusté : ${!isHidden ? "Affiché" : "Masqué"}`);
        };
      }

      if (inset2DCloseBtn && inset2DContainer && toggle2DPlanBtn) {
        inset2DCloseBtn.onclick = () => {
          inset2DContainer.classList.add("is-hidden");
          toggle2DPlanBtn.classList.remove("active");
          toggle2DPlanBtn.style.color = "var(--text-secondary)";
          toggle2DPlanBtn.style.borderColor = "";
        };
      }

      if (inset2DToggleSizeBtn && inset2DContainer) {
        inset2DToggleSizeBtn.onclick = () => {
          inset2DContainer.classList.toggle("is-expanded");
          const isExp = inset2DContainer.classList.contains("is-expanded");
          inset2DToggleSizeBtn.textContent = isExp ? "🗕" : "⛶";
        };
      }

      if (prevBtn) {
        prevBtn.onclick = handleStepPrev;
      }

      if (nextBtn) {
        nextBtn.onclick = handleStepNext;
      }

      if (toggleFullBtn) {
        toggleFullBtn.onclick = () => {
          state.currentViewMode = state.currentViewMode === "full" ? "step" : "full";
          this.renderCurrentStep(isMs);
        };
      }

      // Bascule Grand Écran pour toute la notice de montage
      const guideToggleFullscreenBtn = document.getElementById(isMs ? "btn-guide-ms-toggle-fullscreen" : "btn-guide-toggle-fullscreen");
      if (guideToggleFullscreenBtn && section) {
        guideToggleFullscreenBtn.onclick = () => {
          const isFull = section.classList.toggle("is-guide-fullscreen");
          if (isFull) {
            guideToggleFullscreenBtn.innerHTML = "✕ Quitter Grand Écran";
            guideToggleFullscreenBtn.style.background = "rgba(239, 68, 68, 0.2)";
            guideToggleFullscreenBtn.style.borderColor = "#ef4444";
            guideToggleFullscreenBtn.style.color = "#fca5a5";
            showToast("🖥️ Notice de montage en mode Grand Écran (Échap pour quitter)");
            try {
              if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
              }
            } catch(e) {}
          } else {
            guideToggleFullscreenBtn.innerHTML = "⛶ Grand Écran";
            guideToggleFullscreenBtn.style.background = "rgba(56, 189, 248, 0.15)";
            guideToggleFullscreenBtn.style.borderColor = "#38bdf8";
            guideToggleFullscreenBtn.style.color = "#38bdf8";
            try {
              if (document.fullscreenElement && document.exitFullscreen) {
                document.exitFullscreen().catch(() => {});
              }
            } catch(e) {}
          }
          const viewerInstance = isMs ? this.ms3DViewer : this.single3DViewer;
          if (viewerInstance) setTimeout(() => viewerInstance.resize(), 100);
        };
      }

      if (fullscreenBtn) {
        fullscreenBtn.onclick = () => {
          const targetItem = (results.targets && results.targets[0]) || { item: "Usine", rate: 10 };
          const targetName = results.milestoneName || (ITEM_NAMES[targetItem.item] || targetItem.item);
          const svgContent = state.currentViewMode === "full"
            ? this.generateTopDownFactoryBlueprintSVG(results, null, state)
            : (state.steps[state.currentStepIndex] ? (typeof state.steps[state.currentStepIndex].svg === 'function' ? state.steps[state.currentStepIndex].svg(state) : state.steps[state.currentStepIndex].svg) : this.generateTopDownFactoryBlueprintSVG(results, null, state));
          openBlueprintModal(`📐 Plan d'Implantation Top-Down 2D : ${targetName}`, svgContent);
          const modalSvgContainer = document.getElementById("modal-bp-dynamic-svg");
          if (modalSvgContainer) {
            this.attachGuideInteractivity(modalSvgContainer, results, isMs);
          }
        };
      }

      if (validateBtn) {
        validateBtn.onclick = () => {
          const step = state.steps[state.currentStepIndex];
          if (step) {
            const fullStepId = `${state.calcKey}__${step.baseId}`;
            if (this.validatedSteps.has(fullStepId)) {
              this.validatedSteps.delete(fullStepId);
              showToast(`↺ Étape remise en cours : ${step.title}`);
            } else {
              this.validatedSteps.add(fullStepId);
              showToast(`✅ Étape validée : ${step.title}`);
              if (state.currentStepIndex < state.steps.length - 1) {
                state.currentStepIndex++;
              }
            }
            try {
              localStorage.setItem("ficsit_guide_validated", JSON.stringify(Array.from(this.validatedSteps)));
            } catch(e) {}
            this.renderCurrentStep(isMs);
          }
        };
      }

      // Raccourcis Clavier Globaux (Flèche Droite = Suivant, Flèche Gauche = Précédent, Espace = Valider & Enchaîner, Échap = Quitter Grand Écran)
      if (!window._ficsitGuideKeydownAttached) {
        window._ficsitGuideKeydownAttached = true;
        window.addEventListener("keydown", (e) => {
          if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) return;

          if (e.key === "Escape") {
            const singleGuide = document.getElementById("calc-construction-guide-section");
            const msGuide = document.getElementById("calc-ms-construction-guide-section");
            const checklist = document.getElementById("view-checklist");
            const printBox = document.querySelector("#ficsit-print-modal > div");

            let closedAny = false;
            if (singleGuide && singleGuide.classList.contains("is-guide-fullscreen")) {
              singleGuide.classList.remove("is-guide-fullscreen");
              const btn = document.getElementById("btn-guide-toggle-fullscreen");
              if (btn) {
                btn.innerHTML = "⛶ Grand Écran";
                btn.style.background = "rgba(56, 189, 248, 0.15)";
                btn.style.borderColor = "#38bdf8";
                btn.style.color = "#38bdf8";
              }
              if (FactoryConstructionGuide.single3DViewer) setTimeout(() => FactoryConstructionGuide.single3DViewer.resize(), 100);
              closedAny = true;
            }
            if (msGuide && msGuide.classList.contains("is-guide-fullscreen")) {
              msGuide.classList.remove("is-guide-fullscreen");
              const btn = document.getElementById("btn-guide-ms-toggle-fullscreen");
              if (btn) {
                btn.innerHTML = "⛶ Grand Écran";
                btn.style.background = "rgba(56, 189, 248, 0.15)";
                btn.style.borderColor = "#38bdf8";
                btn.style.color = "#38bdf8";
              }
              if (FactoryConstructionGuide.ms3DViewer) setTimeout(() => FactoryConstructionGuide.ms3DViewer.resize(), 100);
              closedAny = true;
            }
            if (checklist && checklist.classList.contains("is-checklist-fullscreen")) {
              checklist.classList.remove("is-checklist-fullscreen");
              const btn = document.getElementById("btn-checklist-toggle-fullscreen");
              if (btn) {
                btn.innerHTML = "<span>⛶</span> Grand Écran Chantier";
                btn.style.borderColor = "#38bdf8";
                btn.style.color = "#38bdf8";
              }
              closedAny = true;
            }
            if (printBox && printBox.classList.contains("is-print-box-fullscreen")) {
              printBox.classList.remove("is-print-box-fullscreen");
              const btn = document.getElementById("btn-toggle-print-fullscreen");
              if (btn) btn.innerHTML = "⛶ Grand Écran";
              closedAny = true;
            }
            if (closedAny) {
              try {
                if (document.fullscreenElement && document.exitFullscreen) {
                  document.exitFullscreen().catch(() => {});
                }
              } catch(err) {}
            }
            return;
          }

          const isMsActive = document.getElementById("calc-ms-construction-guide-section")?.style.display !== "none";
          const activeSec = isMsActive ? "calc-ms-construction-guide-section" : "calc-construction-guide-section";
          const secEl = document.getElementById(activeSec);
          if (!secEl || secEl.style.display === "none") return;
          const st = isMsActive ? FactoryConstructionGuide.msState : FactoryConstructionGuide.singleState;
          if (!st || !st.steps || st.steps.length === 0) return;

          if (e.key === "ArrowRight") {
            if (st.currentStepIndex < st.steps.length - 1) {
              st.currentStepIndex++;
              FactoryConstructionGuide.renderCurrentStep(isMsActive);
            }
          } else if (e.key === "ArrowLeft") {
            if (st.currentStepIndex > 0) {
              st.currentStepIndex--;
              FactoryConstructionGuide.renderCurrentStep(isMsActive);
            }
          } else if (e.key === " " || e.key === "Enter") {
            const valBtn = document.getElementById(isMsActive ? "btn-guide-ms-validate-step" : "btn-guide-validate-step");
            if (valBtn) {
              e.preventDefault();
              valBtn.click();
            }
          }
        });
      }
    }
  };

  window.FactoryConstructionGuide = FactoryConstructionGuide;

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
              📥 Télécharger Tout le Complexe (.sbp) (En cours de dev)
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
              downloadAllComplexBtn.innerHTML = "📥 Télécharger Tout le Complexe (.sbp) (En cours de dev) (En cours de dev)";
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
                📥 Télécharger (.sbp/.sbpcfg) (En cours de dev)
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
          btn.innerHTML = "📥 Télécharger (.sbp/.sbpcfg) (En cours de dev) (En cours de dev)";
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

    DisplayPreferencesManager.initCollapsibleSections();
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
      const openMsBtn = document.getElementById("btn-open-ms-alt-recipes-modal");
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

      if (openMsBtn) {
        openMsBtn.addEventListener("click", () => {
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
          if (typeof executeMilestoneCalculation === "function") {
            executeMilestoneCalculation(true);
          }
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
          if (typeof executeMilestoneCalculation === "function") {
            executeMilestoneCalculation(true);
          }
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
      } else if (this.currentFilter === "save") {
        const saveItems = [];
        calculator.recipes.forEach(r => {
          if (r.isAlt && STATE.unlockedAltRecipes && STATE.unlockedAltRecipes.has(r.id)) {
            r.products.forEach(p => {
              if (!saveItems.includes(p.item)) saveItems.push(p.item);
            });
          }
        });
        candidateItems = saveItems;
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

      // Si le filtre actuel est "current" ou "save" mais ne donne aucun item (ou aucun calcul actif), fallback informatif
      if ((this.currentFilter === "current" || this.currentFilter === "save") && candidateItems.length === 0) {
        if (this.currentFilter === "save") {
          grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px; color: var(--text-muted);">
              <div style="font-size: 36px; margin-bottom: 10px;">💾</div>
              <div style="font-family: var(--font-display); font-size: 15px; color: var(--text-secondary); margin-bottom: 6px;">
                Aucune recette alternative scannée dans la sauvegarde actuelle
              </div>
              <div style="font-size: 12px;">Chargez votre fichier .sav via le bouton <strong>🔄 Synchroniser .SAV</strong> dans l'en-tête.</div>
            </div>
          `;
          return;
        }
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
          const isUnlockedInSave = STATE.unlockedAltRecipes && STATE.unlockedAltRecipes.has(r.id);

          const ingrStr = r.ingredients.map(ing => {
            const ingRate = Math.round((ing.amount * (60 / r.duration)) * 10) / 10;
            return `<span style="display: inline-block; background: rgba(0,0,0,0.35); padding: 2px 6px; border-radius: 4px; font-size: 11px; margin: 2px;">📥 <strong>${ingRate}/min</strong> ${ITEM_NAMES[ing.item] || ing.item}</span>`;
          }).join(" ");

          const prod = r.products.find(p => p.item === itemId) || r.products[0];
          const prodRate = prod ? Math.round((prod.amount * (60 / r.duration)) * 10) / 10 : 0;

          return `
            <div class="alt-recipe-card" data-item="${itemId}" data-recipe-id="${r.id}" style="border: ${isSelected ? '2px solid var(--ficsit-orange)' : (isUnlockedInSave ? '1.5px solid rgba(16,185,129,0.5)' : '1px solid var(--border-subtle)')}; background: ${isSelected ? 'rgba(250, 149, 73, 0.12)' : 'rgba(0,0,0,0.3)'}; border-radius: var(--radius-sm); padding: 10px 12px; cursor: pointer; transition: all 0.15s ease; margin-bottom: 8px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; flex-wrap: wrap; gap: 4px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <input type="radio" name="radio_item_${itemId}" value="${r.id}" ${isSelected ? "checked" : ""} style="accent-color: var(--ficsit-orange); cursor: pointer;">
                  <strong style="font-size: 13px; color: ${isSelected ? 'var(--ficsit-orange)' : 'var(--text-primary)'};">
                    ${r.name}
                  </strong>
                </div>
                <div style="display: flex; align-items: center; gap: 4px;">
                  ${isUnlockedInSave ? '<span style="font-size: 9.5px; font-weight: 800; padding: 2px 6px; border-radius: 4px; background: rgba(16, 185, 129, 0.25); color: #4ade80; border: 1px solid rgba(16,185,129,0.6);">✔ DANS MA SAVE</span>' : ''}
                  <span style="font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px; background: ${r.isAlt ? 'rgba(250, 149, 73, 0.25)' : 'rgba(75, 179, 253, 0.2)'}; color: ${r.isAlt ? 'var(--ficsit-orange)' : 'var(--ficsit-blue)'}; border: 1px solid ${r.isAlt ? 'rgba(250,149,73,0.5)' : 'rgba(75,179,253,0.5)'};">
                    ${r.isAlt ? '★ ALTERNATIVE' : 'OFFICIELLE / STD'}
                  </span>
                </div>
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
  // Utilise BlueprintFileGenerator défini dans blueprintGenerator.js
  // =========================================================================

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
          gameVersion: "1.2+",
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
          scimVersion: "1.2+",
          blueprintName: "🏛️ Le Grand Campus Industriel 1900 des Cascades (MegaBlueprint)",
          author: "FICSIT Imperial Architecture & Engineering",
          gameVersion: "Satisfactory 1.2",
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
                📥 Télécharger (.sbp/.sbpcfg) (En cours de dev)
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
            btn.innerText = "📥 Télécharger (.sbp/.sbpcfg) (En cours de dev) (En cours de dev)";
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
  let checklistFilter = "all";
  let checklistSearchQuery = "";

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

    const totalCount = savedItems.length;
    let checkedCount = 0;
    savedItems.forEach((_, idx) => {
      if (STATE.checkedChecklist.has(`chk_${idx}`)) checkedCount++;
    });
    const pct = Math.round((checkedCount / Math.max(totalCount, 1)) * 100);

    const filteredIndices = [];
    savedItems.forEach((item, idx) => {
      const isChecked = STATE.checkedChecklist.has(`chk_${idx}`);
      if (checklistFilter === "todo" && isChecked) return;
      if (checklistFilter === "done" && !isChecked) return;
      if (checklistSearchQuery) {
        const q = checklistSearchQuery.toLowerCase();
        const text = `${item.title} ${item.subtitle || ""} ${item.qty || ""}`.toLowerCase();
        if (!text.includes(q)) return;
      }
      filteredIndices.push(idx);
    });

    const hudHtml = `
      <div style="grid-column: 1 / -1; margin-bottom: 14px; background: rgba(14, 21, 32, 0.85); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
        <div style="display: flex; align-items: center; gap: 14px; flex-wrap: wrap; flex: 1;">
          <div style="font-size: 13px; font-weight: 700; color: var(--text-primary);">
            🏗️ Avancement du Chantier : <span style="color: ${checkedCount === totalCount ? 'var(--ficsit-green)' : 'var(--ficsit-orange)'};">${checkedCount} / ${totalCount} validés (${pct}%)</span>
          </div>
          <div style="flex: 1; min-width: 140px; max-width: 320px; height: 8px; background: rgba(255,255,255,0.08); border-radius: 4px; overflow: hidden;">
            <div style="width: ${pct}%; height: 100%; background: linear-gradient(90deg, #38bdf8, #10b981); transition: width 0.3s ease;"></div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
          <input type="text" id="checklist-search-input" value="${checklistSearchQuery}" placeholder="🔍 Filtrer le matériel..." style="background: #080d14; border: 1px solid var(--border-subtle); border-radius: 4px; padding: 4px 10px; color: #fff; font-size: 11.5px; width: 160px;">
          <button type="button" class="btn-outline btn-chk-filter ${checklistFilter === 'all' ? 'active' : ''}" data-filter="all" style="font-size: 11px; padding: 3px 8px;">Tous</button>
          <button type="button" class="btn-outline btn-chk-filter ${checklistFilter === 'todo' ? 'active' : ''}" data-filter="todo" style="font-size: 11px; padding: 3px 8px;">À faire (${totalCount - checkedCount})</button>
          <button type="button" class="btn-outline btn-chk-filter ${checklistFilter === 'done' ? 'active' : ''}" data-filter="done" style="font-size: 11px; padding: 3px 8px;">Validés (${checkedCount})</button>
        </div>
      </div>
    `;

    const itemsHtml = filteredIndices.map(idx => {
      const item = savedItems[idx];
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
    }).join("") || `<div style="grid-column: 1 / -1; text-align: center; padding: 24px; color: var(--text-muted);">Aucun élément ne correspond au filtre.</div>`;

    container.innerHTML = hudHtml + itemsHtml;

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
        renderChecklist();
      });
    });

    // Filtres
    container.querySelectorAll(".btn-chk-filter").forEach(btn => {
      btn.onclick = () => {
        checklistFilter = btn.getAttribute("data-filter");
        renderChecklist();
      };
    });

    // Recherche
    const searchInput = document.getElementById("checklist-search-input");
    if (searchInput) {
      searchInput.oninput = (e) => {
        checklistSearchQuery = e.target.value;
        renderChecklist();
        const freshInput = document.getElementById("checklist-search-input");
        if (freshInput) {
          freshInput.focus();
          freshInput.selectionStart = freshInput.selectionEnd = freshInput.value.length;
        }
      };
    }

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

    // Bouton Grand Écran Checklist de Chantier
    const checklistFullscreenBtn = document.getElementById("btn-checklist-toggle-fullscreen");
    const checklistView = document.getElementById("view-checklist");
    if (checklistFullscreenBtn && checklistView) {
      checklistFullscreenBtn.onclick = () => {
        const isFull = checklistView.classList.toggle("is-checklist-fullscreen");
        if (isFull) {
          checklistFullscreenBtn.innerHTML = "<span>✕</span> Quitter Grand Écran";
          checklistFullscreenBtn.style.borderColor = "#ef4444";
          checklistFullscreenBtn.style.color = "#fca5a5";
          showToast("🏗️ Checklist de Chantier en mode Grand Écran (Échap pour quitter)");
          try {
            if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
              document.documentElement.requestFullscreen().catch(() => {});
            }
          } catch(e) {}
        } else {
          checklistFullscreenBtn.innerHTML = "<span>⛶</span> Grand Écran Chantier";
          checklistFullscreenBtn.style.borderColor = "#38bdf8";
          checklistFullscreenBtn.style.color = "#38bdf8";
          try {
            if (document.fullscreenElement && document.exitFullscreen) {
              document.exitFullscreen().catch(() => {});
            }
          } catch(e) {}
        }
      };
    }

    // Bouton Grand Écran Modal Fiche de Chantier
    const printFullscreenBtn = document.getElementById("btn-toggle-print-fullscreen");
    const printModalBox = document.querySelector("#ficsit-print-modal > div");
    if (printFullscreenBtn && printModalBox) {
      printFullscreenBtn.onclick = () => {
        const isFull = printModalBox.classList.toggle("is-print-box-fullscreen");
        printFullscreenBtn.innerHTML = isFull ? "✕ Quitter Grand Écran" : "⛶ Grand Écran";
      };
    }

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
            <div style="font-size: 11px; color: var(--text-secondary);">Généré le ${now} | Directive Industrielle Pionnier 1.2</div>
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
          <div>FICSIT Industrial Automation Protocol - Satisfactory 1.2</div>
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
              <span style="font-size: 11px; color: var(--text-muted);">REF: FICSIT-PROD-PLAN-1.2</span>
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
          <div>FICSIT Industrial Automation Protocol - Satisfactory 1.2</div>
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
        title: `🌀 Rassembler ${calcResults.totalSomersloops} × Somersloop Alien 1.2`,
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
  // SIMULATEUR DE CENTRALES & ÉNERGIE (1.0 / 1.2)
  // =========================================================================
  let powerCalcInstance = null;
  let currentPowerCalcResult = null;

  function initPowerCalculatorUI() {
    if (typeof PowerPlantCalculator === 'undefined' || typeof POWER_TECHNOLOGIES === 'undefined') return;
    powerCalcInstance = new PowerPlantCalculator(POWER_TECHNOLOGIES, BUILDINGS);

    const techGrid = document.getElementById("energy-tech-grid");
    const modeBtnTarget = document.getElementById("btn-energy-mode-target");
    const modeBtnResource = document.getElementById("btn-energy-mode-resource");
    const groupTarget = document.getElementById("energy-input-group-target");
    const recipeSelect = document.getElementById("energy-recipe-select");
    const recipeBadge = document.getElementById("energy-recipe-badge");
    const catFilters = document.querySelectorAll(".energy-cat-filter");
    const groupResource = document.getElementById("energy-input-group-resource");
    const targetPowerInput = document.getElementById("energy-target-power-input");
    const targetPowerLabel = document.getElementById("energy-target-power-label");
    const resourceRateInput = document.getElementById("energy-resource-rate-input");
    const resourceValLabel = document.getElementById("energy-resource-val-label");
    const resourceInputLabel = document.getElementById("energy-resource-input-label");
    const ocSlider = document.getElementById("energy-oc-slider");
    const ocLabel = document.getElementById("energy-oc-label");
    const somersloopChk = document.getElementById("energy-somersloop-chk");
    const recalcBtn = document.getElementById("btn-recalc-energy");
    const exportChecklistBtn = document.getElementById("btn-energy-export-checklist");
    const resultsContainer = document.getElementById("energy-results-container");

    if (!techGrid) return;

    let selectedTechId = localStorage.getItem("ficsit_energy_tech") || "coal_standard";
    if (!POWER_TECHNOLOGIES[selectedTechId]) selectedTechId = "coal_standard";
    let activeMode = "target_power";
    let activeCategory = "all";

    // 0. Peuplement du sélecteur déroulant de recettes
    function populateRecipeSelect() {
      if (!recipeSelect) return;
      recipeSelect.innerHTML = "";

      const categories = {};
      Object.entries(POWER_TECHNOLOGIES).forEach(([id, tech]) => {
        const cat = tech.categoryLabel || "Autres";
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push({ id, ...tech });
      });

      Object.entries(categories).forEach(([catName, techs]) => {
        const optgroup = document.createElement("optgroup");
        optgroup.label = catName;
        techs.forEach(t => {
          const opt = document.createElement("option");
          opt.value = t.id;
          const tag = t.recipeType === "alternate" ? "⚡ [ALT]" : "📄 [STD]";
          opt.innerText = `${tag} ${t.name} (${t.generatorPowerMW} MW/u)`;
          if (t.id === selectedTechId) opt.selected = true;
          optgroup.appendChild(opt);
        });
        recipeSelect.appendChild(optgroup);
      });

      updateRecipeBadge();
    }

    function updateRecipeBadge() {
      const tech = POWER_TECHNOLOGIES[selectedTechId];
      if (!recipeBadge || !tech) return;
      if (tech.recipeType === "alternate") {
        recipeBadge.className = "energy-recipe-tag alternate";
        recipeBadge.innerHTML = "⚡ Recette Alternative FICSIT";
      } else {
        recipeBadge.className = "energy-recipe-tag standard";
        recipeBadge.innerHTML = "📄 Recette Standard";
      }
    }

    if (recipeSelect) {
      recipeSelect.addEventListener("change", (e) => {
        const newTechId = e.target.value;
        if (POWER_TECHNOLOGIES[newTechId]) {
          selectedTechId = newTechId;
          localStorage.setItem("ficsit_energy_tech", newTechId);
          renderTechGrid();
          updateResourceInputLabel();
          updateRecipeBadge();
          runEnergyCalculation(true);
        }
      });
    }

    // Filtres de catégories
    catFilters.forEach(btn => {
      btn.addEventListener("click", () => {
        catFilters.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        activeCategory = btn.getAttribute("data-cat") || "all";
        renderTechGrid();
      });
    });

    // 1. Rendu des cartes de technologie
    function renderTechGrid() {
      techGrid.innerHTML = "";
      Object.entries(POWER_TECHNOLOGIES).forEach(([id, tech]) => {
        // Filtrage par catégorie
        if (activeCategory !== "all" && tech.category !== activeCategory) {
          return;
        }

        const card = document.createElement("div");
        card.className = `energy-tech-card ${id === selectedTechId ? "active" : ""}`;
        card.dataset.techId = id;

        const isAlt = tech.recipeType === "alternate";
        const tagHtml = isAlt 
          ? `<span class="energy-recipe-tag alternate">⚡ Alt</span>`
          : `<span class="energy-recipe-tag standard">📄 Std</span>`;

        card.innerHTML = `
          <div class="energy-tech-header">
            <div class="energy-tech-icon">
              <img src="${tech.icon}" alt="${tech.name}" onerror="this.src='images/buildings/IconDesc_BiomassGenerator_256.png'">
            </div>
            <div style="flex: 1; min-width: 0;">
              <div style="display: flex; justify-content: space-between; align-items: center; gap: 4px; margin-bottom: 2px;">
                <div class="energy-tech-tier">${tech.tier}</div>
                ${tagHtml}
              </div>
              <div class="energy-tech-title">${tech.name}</div>
            </div>
          </div>
          <div style="font-size: 11px; color: var(--text-muted); line-height: 1.3; margin-top: 2px;">
            ${tech.recipeName || tech.fuelItem}
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 6px;">
            <div class="energy-tech-power-badge">⚡ ${tech.generatorPowerMW} MW / unité</div>
            <span style="font-size: 11px; color: var(--ficsit-amber); font-weight: 600;">${tech.fuelItem}</span>
          </div>
        `;

        card.addEventListener("click", () => {
          selectedTechId = id;
          localStorage.setItem("ficsit_energy_tech", id);
          if (recipeSelect) recipeSelect.value = id;
          document.querySelectorAll(".energy-tech-card").forEach(c => c.classList.remove("active"));
          card.classList.add("active");
          updateResourceInputLabel();
          updateRecipeBadge();
          runEnergyCalculation(true);
        });

        techGrid.appendChild(card);
      });
    }

    function updateResourceInputLabel() {
      const tech = POWER_TECHNOLOGIES[selectedTechId];
      if (resourceInputLabel && tech) {
        resourceInputLabel.innerText = `Débit de ${tech.fuelItem} disponible :`;
      }
    }

    // 2. Gestion des modes
    if (modeBtnTarget && modeBtnResource) {
      modeBtnTarget.addEventListener("click", () => {
        activeMode = "target_power";
        modeBtnTarget.classList.add("active");
        modeBtnResource.classList.remove("active");
        groupTarget.style.display = "block";
        groupResource.style.display = "none";
        runEnergyCalculation();
      });

      modeBtnResource.addEventListener("click", () => {
        activeMode = "resource_rate";
        modeBtnResource.classList.add("active");
        modeBtnTarget.classList.remove("active");
        groupTarget.style.display = "none";
        groupResource.style.display = "block";
        updateResourceInputLabel();
        runEnergyCalculation();
      });
    }

    // 3. Presets & Événements inputs
    document.querySelectorAll(".energy-quick-preset").forEach(btn => {
      btn.addEventListener("click", () => {
        const val = parseFloat(btn.dataset.val);
        targetPowerInput.value = val;
        targetPowerLabel.innerText = `${val.toLocaleString()} MW`;
        runEnergyCalculation();
      });
    });

    document.querySelectorAll(".energy-quick-res-preset").forEach(btn => {
      btn.addEventListener("click", () => {
        const val = parseFloat(btn.dataset.val);
        resourceRateInput.value = val;
        resourceValLabel.innerText = `${val.toLocaleString()} /min`;
        runEnergyCalculation();
      });
    });

    if (targetPowerInput) {
      targetPowerInput.addEventListener("input", (e) => {
        const val = parseFloat(e.target.value) || 0;
        targetPowerLabel.innerText = `${val.toLocaleString()} MW`;
      });
      targetPowerInput.addEventListener("change", () => runEnergyCalculation());
    }

    if (resourceRateInput) {
      resourceRateInput.addEventListener("input", (e) => {
        const val = parseFloat(e.target.value) || 0;
        resourceValLabel.innerText = `${val.toLocaleString()} /min`;
      });
      resourceRateInput.addEventListener("change", () => runEnergyCalculation());
    }

    if (ocSlider && ocLabel) {
      ocSlider.addEventListener("input", (e) => {
        const val = parseInt(e.target.value, 10);
        let shardText = "Base";
        if (val === 150) shardText = "1 Éclat";
        else if (val === 200) shardText = "2 Éclats";
        else if (val === 250) shardText = "3 Éclats";
        ocLabel.innerText = `${val}% (${shardText})`;
        runEnergyCalculation();
      });
    }

    selectEnergyTechGlobal = function(techId) {
      if (!POWER_TECHNOLOGIES[techId]) return;
      selectedTechId = techId;
      localStorage.setItem("ficsit_energy_tech", techId);
      if (recipeSelect) recipeSelect.value = techId;
      updateRecipeBadge();

      if (activeCategory !== "all" && POWER_TECHNOLOGIES[techId].category !== activeCategory) {
        activeCategory = "all";
        catFilters.forEach(b => b.classList.toggle("active", b.getAttribute("data-cat") === "all"));
        renderTechGrid();
      } else {
        document.querySelectorAll(".energy-tech-card").forEach(c => {
          if (c.dataset.techId === techId) c.classList.add("active");
          else c.classList.remove("active");
        });
      }

      updateResourceInputLabel();
      runEnergyCalculation(true);
    };

    if (recalcBtn) {
      recalcBtn.addEventListener("click", () => {
        recalcBtn.innerHTML = `<span>⏳</span> Calcul FICSIT en cours...`;
        recalcBtn.style.opacity = "0.8";
        try {
          runEnergyCalculation(true);
          recalcBtn.innerHTML = `<span>✅</span> Centrale Calculée !`;
        } catch (err) {
          console.error("Erreur de calcul de centrale:", err);
          showToast(`⚠️ Erreur : ${err.message}`);
          recalcBtn.innerHTML = `<span>⚠️</span> Erreur de calcul`;
        } finally {
          setTimeout(() => {
            recalcBtn.innerHTML = `<span>⚡</span> Calculer la Centrale`;
            recalcBtn.style.opacity = "1";
          }, 900);
        }
      });
    }

    // 4. Calcul & Affichage
    function runEnergyCalculation(isExplicitClick = false) {
      const oc = parseInt(ocSlider?.value || "100", 10);
      const loop = somersloopChk?.checked || false;

      let res;
      if (activeMode === "target_power") {
        const targetMW = parseFloat(targetPowerInput?.value || "2500");
        res = powerCalcInstance.calculateFromTargetPower(selectedTechId, targetMW, oc, loop);
      } else {
        const resRate = parseFloat(resourceRateInput?.value || "300");
        res = powerCalcInstance.calculateFromResourceRate(selectedTechId, resRate, oc, loop);
      }

      currentPowerCalcResult = res;
      renderEnergyResults(res);

      if (resultsContainer) {
        resultsContainer.classList.remove("calc-pulse");
        void resultsContainer.offsetWidth; // Force reflow pour relancer l'animation
        resultsContainer.classList.add("calc-pulse");

        if (isExplicitClick) {
          resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }

      if (statPowerEl) {
        statPowerEl.innerText = `${res.grossPowerMW.toLocaleString()} MW`;
      }

      if (isExplicitClick) {
        const rawSummary = res.rawResourcesRequired && res.rawResourcesRequired.length > 0 
          ? ` • Entrées : ${res.rawResourcesRequired.map(r => `${r.totalRate} ${r.unit} ${r.item}`).join(', ')}`
          : '';
        showToast(`⚡ Centrale ${res.tech.name} : ${res.grossPowerMW.toLocaleString()} MW (${res.exactGenerators} générateurs)${rawSummary}`);
      }
    }

    function renderEnergyResults(res) {
      if (!resultsContainer) return;

      const tech = res.tech;
      const gwStr = (res.grossPowerMW / 1000).toFixed(2);

      // Bannière de statut de calcul
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      const statusBannerHtml = `
        <div class="energy-status-banner">
          <div class="energy-status-banner-text">
            <span>✅</span> CENTRALE OPTIMISÉE — ${tech.name.toUpperCase()} (${res.grossPowerMW.toLocaleString()} MW)
          </div>
          <div style="font-size: 11px; color: var(--text-secondary);">
            ⚡ Calculé à ${timeStr} • ${res.ceilGenerators} bâtiments • Prêt pour construction
          </div>
        </div>
      `;

      // Diagramme d'architecture et de flux
      const rawResSummary = res.rawResourcesRequired && res.rawResourcesRequired.length > 0
        ? res.rawResourcesRequired.map(r => `${r.totalRate} ${r.unit}`).join(', ')
        : 'Passif';
      const firstRawName = res.rawResourcesRequired && res.rawResourcesRequired.length > 0
        ? res.rawResourcesRequired[0].item
        : 'Geysers / Alien';

      const flowDiagramHtml = `
        <div class="energy-flow-diagram">
          <div style="font-family: var(--font-display); font-size: 14px; font-weight: 700; color: var(--ficsit-orange); display: flex; align-items: center; gap: 8px;">
            <span>📐</span> SCHÉMA D'IMPLANTATION & FLUX DE PRODUCTION DE LA CENTRALE
          </div>
          <div class="energy-flow-steps">
            <div class="energy-flow-step">
              <div class="energy-flow-step-header"><span>⛏️</span> 1. Extraction</div>
              <div class="energy-flow-step-title">${firstRawName}</div>
              <div class="energy-flow-step-desc">${rawResSummary}</div>
            </div>
            <div class="energy-flow-arrow">➔</div>
            <div class="energy-flow-step">
              <div class="energy-flow-step-header"><span>⚙️</span> 2. Traitement / Fluides</div>
              <div class="energy-flow-step-title">${res.totalWaterRate > 0 ? 'Eau & Plomberie' : (res.upstreamMachines?.length > 0 ? res.upstreamMachines[0].building : 'Convoyeurs')}</div>
              <div class="energy-flow-step-desc">${res.totalWaterRate > 0 ? `${res.totalWaterRate} m³/min d'eau` : `${res.totalFuelRate} ${tech.fuelItem}/min`}</div>
            </div>
            <div class="energy-flow-arrow">➔</div>
            <div class="energy-flow-step highlight">
              <div class="energy-flow-step-header"><span>🏭</span> 3. Production Électrique</div>
              <div class="energy-flow-step-title">${tech.generatorType}</div>
              <div class="energy-flow-step-desc">${res.exactGenerators} × à ${res.effectiveGenMW} MW/u</div>
            </div>
            <div class="energy-flow-arrow">➔</div>
            <div class="energy-flow-step">
              <div class="energy-flow-step-header"><span>⚡</span> 4. Réseau FICSIT</div>
              <div class="energy-flow-step-title">+${res.grossPowerMW.toLocaleString()} MW</div>
              <div class="energy-flow-step-desc">${gwStr} GW de puissance active</div>
            </div>
          </div>
        </div>
      `;

      let wasteHtml = "";
      if (res.totalWasteRate > 0) {
        wasteHtml = `
          <div class="energy-stat-card" style="border-color: var(--ficsit-red);">
            <div class="energy-stat-title" style="color: var(--ficsit-red);">☢️ Sous-produit / Déchet</div>
            <div class="energy-stat-big-val" style="color: var(--ficsit-red);">${res.totalWasteRate} /min</div>
            <div style="font-size: 11px; color: var(--text-muted);">${tech.wasteItem}</div>
          </div>
        `;
      }

      let plumbingHtml = "";
      if (res.plumbingAnalysis && res.plumbingAnalysis.hasFluid) {
        let groupsHtml = res.plumbingAnalysis.pipeGroups.map(g => `
          <div class="plumbing-group-card">
            <div class="plumbing-group-title">
              <span>${g.title}</span>
              <strong style="color: var(--ficsit-cyan);">${g.pipeType}</strong>
            </div>
            <div class="plumbing-group-desc">💡 ${g.recommendation}</div>
          </div>
        `).join("");

        plumbingHtml = `
          <div class="plumbing-guide-box">
            <div class="plumbing-guide-title">
              <span>💧</span> Guide de Plomberie & Ratios Parfaits FICSIT
            </div>
            <p style="font-size: 13px; color: var(--text-secondary); margin: 0;">
              ${res.plumbingAnalysis.summary}
            </p>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${groupsHtml}
            </div>
          </div>
        `;
      }

      let upstreamHtml = "";
      if (res.upstreamMachines && res.upstreamMachines.length > 0) {
        const rows = res.upstreamMachines.map(m => `
          <tr>
            <td style="font-weight: 700; color: var(--text-primary);">${m.building}</td>
            <td style="font-family: var(--font-display); font-weight: 700; color: var(--ficsit-orange); font-size: 15px;">×${m.count}</td>
            <td style="color: var(--ficsit-amber);">${m.outputItem}</td>
            <td style="color: var(--text-secondary);">${m.inputItem}</td>
          </tr>
        `).join("");

        upstreamHtml = `
          <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 16px;">
            <div style="font-family: var(--font-display); font-size: 15px; font-weight: 700; color: var(--ficsit-orange); margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
              <span>🏭</span> Chaîne Amont Recommandée (Raffinage & Préparation)
            </div>
            <table class="energy-upstream-table">
              <thead>
                <tr>
                  <th>Machine Amont</th>
                  <th>Quantité</th>
                  <th>Production</th>
                  <th>Alimentation Requise</th>
                </tr>
              </thead>
              <tbody>
                ${rows}
              </tbody>
            </table>
          </div>
        `;
      }

      let shoppingHtml = "";
      if (res.buildingShoppingList && Object.keys(res.buildingShoppingList).length > 0) {
        const badges = Object.entries(res.buildingShoppingList).map(([mat, qty]) => `
          <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 6px 10px; font-size: 12px; display: flex; align-items: center; justify-content: space-between; gap: 10px;">
            <span style="color: var(--text-secondary);">${mat}</span>
            <strong style="font-family: var(--font-display); color: var(--ficsit-amber);">${qty} pcs</strong>
          </div>
        `).join("");

        shoppingHtml = `
          <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 16px;">
            <div style="font-family: var(--font-display); font-size: 15px; font-weight: 700; color: var(--ficsit-amber); margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
              <span>🧱</span> Matériaux de Construction du Complexe Énergétique
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 8px;">
              ${badges}
            </div>
          </div>
        `;
      }

      // Section Ressources Brutes Requises en Entrée
      let rawInputsHtml = "";
      if (res.rawResourcesRequired && res.rawResourcesRequired.length > 0) {
        const inputCards = res.rawResourcesRequired.map(r => `
          <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 12px 14px; display: flex; flex-direction: column; gap: 4px; border-left: 4px solid ${r.color || 'var(--ficsit-orange)'};">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 13px; font-weight: 700; color: var(--text-primary);">${r.item}</span>
              <span style="font-size: 11px; color: var(--text-muted);">${r.isFluid ? '💧 Fluide' : '📦 Solide'}</span>
            </div>
            <div style="font-family: var(--font-display); font-size: 22px; font-weight: 700; color: ${r.color || 'var(--ficsit-orange)'};">
              ${r.totalRate} <span style="font-size: 13px; font-weight: 600; color: var(--text-secondary);">${r.unit}</span>
            </div>
            ${r.miningNote ? `<div style="font-size: 11px; color: var(--text-secondary); margin-top: 2px;">⛏️ <em>${r.miningNote}</em></div>` : ''}
          </div>
        `).join("");

        rawInputsHtml = `
          <div style="background: var(--bg-card); border: 2px solid var(--ficsit-orange); border-radius: var(--radius-md); padding: 18px; box-shadow: var(--shadow-sm);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <div style="font-family: var(--font-display); font-size: 16px; font-weight: 700; color: var(--ficsit-orange); display: flex; align-items: center; gap: 8px;">
                <span>📦</span> RESSOURCES BRUTES NÉCESSAIRES EN ENTRÉE (PAR MINUTE)
              </div>
              <span style="font-size: 12px; color: var(--text-secondary); background: var(--bg-surface); padding: 4px 8px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
                Alimentation continue à 100%
              </span>
            </div>
            <p style="font-size: 12px; color: var(--text-secondary); margin-bottom: 12px;">
              Débits totaux de matières premières à extraire de la carte pour faire tourner l'ensemble du complexe énergétique sans interruption :
            </p>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px;">
              ${inputCards}
            </div>
          </div>
        `;
      }

      resultsContainer.innerHTML = `
        ${statusBannerHtml}

        <div class="energy-stats-row">
          <div class="energy-stat-card highlight">
            <div class="energy-stat-title">⚡ Puissance Brute Totale</div>
            <div class="energy-stat-big-val amber">${res.grossPowerMW.toLocaleString()} MW</div>
            <div style="font-size: 12px; color: var(--text-secondary);">${gwStr} Gigawatts de capacité</div>
          </div>

          <div class="energy-stat-card">
            <div class="energy-stat-title">🏭 Générateurs Requis</div>
            <div class="energy-stat-big-val orange">${res.exactGenerators} ×</div>
            <div style="font-size: 12px; color: var(--text-secondary);">${tech.generatorType} (${res.effectiveGenMW} MW/u)</div>
          </div>

          <div class="energy-stat-card">
            <div class="energy-stat-title">🛢️ Débit Combustible Direct</div>
            <div class="energy-stat-big-val cyan">${res.totalFuelRate} /min</div>
            <div style="font-size: 12px; color: var(--text-secondary);">${tech.fuelItem}</div>
          </div>

          ${res.totalWaterRate > 0 ? `
            <div class="energy-stat-card">
              <div class="energy-stat-title">💧 Besoin en Eau Direct</div>
              <div class="energy-stat-big-val cyan">${res.totalWaterRate} m³/min</div>
              <div style="font-size: 12px; color: var(--text-secondary);">${res.waterExtractorsCount} × Extracteurs d'eau (120 m³/min)</div>
            </div>
          ` : ''}

          ${wasteHtml}
        </div>

        ${rawInputsHtml}
        ${flowDiagramHtml}
        ${plumbingHtml}
        ${upstreamHtml}
        ${shoppingHtml}
      `;

      // Rendu de l'Organigramme SCIM Multi-Produits Interactif de la Centrale
      const flowViewport = document.getElementById("flowchart-energy-viewport");
      const fullscreenBtn = document.getElementById("btn-open-energy-fullscreen");
      const scimResults = convertPowerPlantToSCIMResults(res);

      if (flowViewport && scimResults) {
        SatisfactoryFlowchart.initInteractive(flowViewport, scimResults);

        if (fullscreenBtn) {
          fullscreenBtn.onclick = () => {
            openBlueprintModal(`Organigramme SCIM : ${scimResults.milestoneName}`, SatisfactoryFlowchart.generateSVG(scimResults));
            SatisfactoryFlowchart.attachInteractivity(document.getElementById("modal-bp-dynamic-svg"), scimResults);
          };
        }
      }
    }

    function convertPowerPlantToSCIMResults(res) {
      if (!res || !res.tech) return null;
      const tech = res.tech;

      // 1. Matières premières brutes (Rank 0)
      const rawResources = {};
      if (res.rawResourcesRequired && res.rawResourcesRequired.length > 0) {
        res.rawResourcesRequired.forEach(r => {
          rawResources[r.item] = r.totalRate;
        });
      } else {
        rawResources[tech.fuelItem] = res.totalFuelRate;
        if (res.totalWaterRate > 0) {
          rawResources["Eau"] = res.totalWaterRate;
        }
      }

      // 2. Étapes de production (Ranks 1+)
      const productionSteps = [];

      // A. Extracteurs d'eau
      if (res.totalWaterRate > 0) {
        productionSteps.push({
          recipeId: "water_extraction",
          recipeName: "Extraction Hydraulique",
          itemId: "Eau",
          rateProduced: res.totalWaterRate,
          building: { id: "water_extractor", name: "Extracteur d'Eau", icon: "💧" },
          physicalMachines: Math.ceil(res.waterExtractorsCount),
          machinesCount: res.waterExtractorsCount,
          overclock: 100,
          powerMW: 20 * Math.ceil(res.waterExtractorsCount),
          ingredients: [
            { item: "Eau", rate: res.totalWaterRate }
          ]
        });
      }

      // B. Chaîne de raffinage amont
      if (res.upstreamMachines && res.upstreamMachines.length > 0) {
        res.upstreamMachines.forEach((m, idx) => {
          productionSteps.push({
            recipeId: `upstream_${idx}_${m.outputItem.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
            recipeName: `${m.building} (${m.outputItem})`,
            itemId: m.outputItem,
            rateProduced: res.totalFuelRate,
            building: { id: m.building.toLowerCase().replace(/[^a-z0-9]/g, '_'), name: m.building, icon: "🏭" },
            physicalMachines: m.count,
            machinesCount: m.count,
            overclock: res.overclockPercent,
            powerMW: 30 * m.count,
            ingredients: [
              { item: m.inputItem, rate: res.totalFuelRate }
            ]
          });
        });
      }

      // C. Générateurs / Centrale Électrique
      const genIngredients = [];
      genIngredients.push({ item: tech.fuelItem, rate: res.totalFuelRate });
      if (res.totalWaterRate > 0) {
        genIngredients.push({ item: "Eau", rate: res.totalWaterRate });
      }

      productionSteps.push({
        recipeId: `gen_${tech.id}`,
        recipeName: `Génération Électrique : ${tech.name}`,
        itemId: `⚡ Puissance Réseau (+${res.grossPowerMW.toLocaleString()} MW)`,
        rateProduced: res.grossPowerMW,
        building: { id: tech.id, name: tech.generatorType, icon: "⚡" },
        physicalMachines: res.ceilGenerators,
        machinesCount: res.exactGenerators,
        overclock: res.overclockPercent,
        powerMW: -res.grossPowerMW,
        ingredients: genIngredients
      });

      // 3. Cibles / Produits finaux (Réseau FICSIT & Sous-produits)
      const targets = [
        { item: `⚡ Puissance Réseau (+${res.grossPowerMW.toLocaleString()} MW)`, rate: res.grossPowerMW }
      ];
      if (res.totalWasteRate > 0) {
        targets.push({
          item: `☢️ Sous-produit : ${tech.wasteItem}`,
          rate: res.totalWasteRate
        });
      }

      return {
        rawResources,
        productionSteps,
        targets,
        totalPowerMW: -res.grossPowerMW,
        milestoneName: `Centrale ${tech.name} (${res.grossPowerMW.toLocaleString()} MW)`
      };
    }

    // 5. Export vers la Checklist
    if (exportChecklistBtn) {
      exportChecklistBtn.addEventListener("click", () => {
        if (!currentPowerCalcResult) return;

        const res = currentPowerCalcResult;
        const tech = res.tech;
        const items = [];

        // Générateurs
        items.push({
          title: `🏭 Construire ${res.ceilGenerators} × ${tech.generatorType}`,
          subtitle: `Centrale ${tech.name} (${res.grossPowerMW} MW)`,
          qty: `${res.ceilGenerators} bâts`
        });

        // Extracteurs d'eau
        if (res.waterExtractorsCount > 0) {
          const extCount = Math.ceil(res.waterExtractorsCount);
          items.push({
            title: `💧 Installer ${extCount} × Extracteur d'Eau`,
            subtitle: `Approvisionnement ${res.totalWaterRate} m³/min d'eau`,
            qty: `${extCount} bâts`
          });
        }

        // Machines amont
        if (res.upstreamMachines) {
          res.upstreamMachines.forEach(m => {
            items.push({
              title: `⚙️ Installer ${m.count} × ${m.building}`,
              subtitle: `Production de ${m.outputItem}`,
              qty: `${m.count} bâts`
            });
          });
        }

        // Ressources brutes à extraire / alimenter
        if (res.rawResourcesRequired) {
          res.rawResourcesRequired.forEach(r => {
            items.push({
              title: `⛏️ Raccorder ${r.totalRate} ${r.unit} de ${r.item}`,
              subtitle: `Approvisionnement continu de la centrale (${r.miningNote || 'Gisement carte'})`,
              qty: `${r.totalRate} ${r.unit}`
            });
          });
        }

        // Matériaux de construction
        if (res.buildingShoppingList) {
          for (const [mat, qty] of Object.entries(res.buildingShoppingList)) {
            items.push({
              title: `📦 Rassembler ${qty} × ${mat}`,
              subtitle: `Matériau pour la centrale ${tech.name}`,
              qty: `${qty} pcs`
            });
          }
        }

        localStorage.setItem("ficsit_checklist_items", JSON.stringify(items));
        STATE.checkedChecklist.clear();
        saveState();
        renderChecklist();
        switchTab("checklist");
        showToast("⚡ Centrale exportée avec succès vers votre Checklist de Chantier !");
      });
    }

    populateRecipeSelect();
    renderTechGrid();
    updateResourceInputLabel();
    runEnergyCalculation();
  }

  // =========================================================================
  // IMPORTEUR ET SYNCHRONISEUR DE SAUVEGARDE .SAV
  // =========================================================================
  function initSaveUploader() {
    const modal = document.getElementById("save-sync-modal");
    const openBtn = document.getElementById("btn-open-save-modal");
    const closeBtn = document.getElementById("btn-close-save-modal");
    const doneBtn = document.getElementById("btn-save-modal-done");
    const dropzone = document.getElementById("save-dropzone");
    const fileInput = document.getElementById("save-file-input");
    const saveReport = document.getElementById("save-report-panel");
    const browseBtn = document.getElementById("btn-browse-save");
    const copyPathBtn = document.getElementById("btn-copy-save-path");

    // Gestion de l'ouverture / fermeture de la modal
    if (openBtn && modal) {
      openBtn.addEventListener("click", () => {
        modal.style.display = "flex";
        // Si une session est déjà chargée en mémoire, réafficher son bilan
        if (STATE.saveSessionInfo && saveReport) {
          renderSaveReport(STATE.saveSessionInfo);
        }
      });
    }

    if (closeBtn && modal) {
      closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
      });
    }

    if (doneBtn && modal) {
      doneBtn.addEventListener("click", () => {
        modal.style.display = "none";
      });
    }

    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.style.display = "none";
      });
    }

    if (browseBtn && fileInput) {
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

    if (dropzone && fileInput) {
      dropzone.addEventListener("click", () => fileInput.click());

      dropzone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropzone.style.borderColor = "var(--ficsit-green)";
        dropzone.style.background = "rgba(16, 185, 129, 0.1)";
      });

      dropzone.addEventListener("dragleave", () => {
        dropzone.style.borderColor = "var(--border-strong)";
        dropzone.style.background = "rgba(0,0,0,0.3)";
      });

      dropzone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropzone.style.borderColor = "var(--border-strong)";
        dropzone.style.background = "rgba(0,0,0,0.3)";
        if (e.dataTransfer.files.length > 0) {
          handleSaveFile(e.dataTransfer.files[0]);
        }
      });

      fileInput.addEventListener("change", (e) => {
        if (e.target.files.length > 0) {
          handleSaveFile(e.target.files[0]);
        }
      });
    }

    window.processAndApplySaveFile = handleSaveFile;

    async function handleSaveFile(file) {
      if (modal) modal.style.display = "flex";
      const dropzone = document.getElementById("save-dropzone");
      const loader = document.getElementById("save-loader-overlay");
      const loaderStatus = document.getElementById("save-loader-status");
      const loaderProgressBar = document.getElementById("save-loader-progress-bar");
      const loaderPercentage = document.getElementById("save-loader-percentage");
      const saveReport = document.getElementById("save-report-panel");

      if (dropzone) dropzone.style.display = "none";
      if (saveReport) saveReport.style.display = "none";
      if (loader) {
        loader.style.display = "block";
        if (loaderProgressBar) loaderProgressBar.style.width = "0%";
        if (loaderPercentage) loaderPercentage.innerText = "0%";
        if (loaderStatus) loaderStatus.innerText = "Initialisation et décompression de la sauvegarde Satisfactory...";
      }

      showToast("⏳ Analyse du fichier de sauvegarde Satisfactory...");

      const onProgress = (current, total) => {
        const pct = Math.round((current / (total || 1)) * 100);
        if (loaderProgressBar) loaderProgressBar.style.width = `${pct}%`;
        if (loaderPercentage) loaderPercentage.innerText = `${pct}% (Blocs ${current} / ${total})`;
        if (loaderStatus) {
          if (pct < 30) loaderStatus.innerText = `Décompression des blocs de données Unreal Engine (${current}/${total})...`;
          else if (pct < 75) loaderStatus.innerText = `Extraction des jalons, arbres MAM et schémas (${current}/${total})...`;
          else loaderStatus.innerText = `Analyse et filtrage des 41 recettes alternatives (${current}/${total})...`;
        }
      };

      try {
        const result = await SatisfactorySaveParser.parseSave(file, onProgress);

        if (loader) loader.style.display = "none";
        if (dropzone) dropzone.style.display = "block";

        if (result.success) {
          // Appliquer l'état exact de la sauvegarde
          STATE.completedMilestones.clear();
          STATE.completedPhases.clear();
          result.unlockedMilestones.forEach(mId => STATE.completedMilestones.add(mId));
          result.unlockedPhases.forEach(pId => STATE.completedPhases.add(pId));
          
          // Appliquer les recettes alternatives trouvées
          STATE.unlockedAltRecipes = new Set(result.unlockedRecipes || []);
          STATE.mamTrees = result.mamTrees || null;
          STATE.saveSessionInfo = {
            sessionName: result.sessionName,
            playtime: result.playtime,
            buildVersion: result.buildVersion,
            unlockedMilestonesCount: result.unlockedMilestones.length,
            unlockedPhasesCount: result.unlockedPhases.length,
            unlockedRecipesCount: result.unlockedRecipes.length,
            unlockedRecipesList: result.unlockedRecipes
          };

          // Par défaut, activer le mode "Recettes de ma sauvegarde" pour l'optimiseur
          STATE.recipeFilterMode = "save";
          updateRecipeFilterModeUI();
          saveState();

          // Mettre à jour toutes les vues du tableau de bord
          renderMilestones();
          renderPhases();
          renderSyntheticView();
          updateHUDStats();
          updateAltRecipeCounters();

          // Mettre à jour les calculateurs
          if (typeof executeCalculation === "function") {
            executeCalculation(true);
          }
          if (typeof executeMilestoneCalculation === "function") {
            executeMilestoneCalculation(true);
          }

          // Afficher le rapport détaillé
          renderSaveReport(STATE.saveSessionInfo);

          showToast(`✔ Sauvegarde "${result.sessionName}" synchronisée avec succès (${result.unlockedMilestones.length} jalons, ${result.unlockedRecipes.length} recettes) !`);
        } else {
          alert("Erreur lors de la lecture du fichier .sav : " + result.error);
        }
      } catch (err) {
        if (loader) loader.style.display = "none";
        if (dropzone) dropzone.style.display = "block";
        alert("Erreur inattendue lors de l'analyse : " + err.message);
      }
    }

    function renderSaveReport(info) {
      if (!saveReport) return;
      saveReport.style.display = "block";

      const mamBadges = STATE.mamTrees ? Object.entries(STATE.mamTrees).map(([key, tree]) => {
        const pct = Math.round((tree.count / tree.total) * 100);
        return `
          <div style="background: rgba(0,0,0,0.35); border: 1px solid var(--border-subtle); border-radius: 4px; padding: 6px 10px; font-size: 11.5px; display: flex; justify-content: space-between; align-items: center;">
            <span>🔬 <strong>${tree.name}</strong></span>
            <span style="color: ${pct === 100 ? 'var(--ficsit-green)' : 'var(--ficsit-amber)'}; font-weight: 700;">${tree.count}/${tree.total} (${pct}%)</span>
          </div>
        `;
      }).join("") : "";

      const recipesHtml = (info.unlockedRecipesList || []).map(rId => {
        const rec = RECIPES.find(r => r.id === rId);
        const name = rec ? rec.name : rId;
        return `<span style="background: rgba(16, 185, 129, 0.15); border: 1px solid var(--ficsit-green); color: #4ade80; font-size: 11px; font-weight: 600; padding: 2px 7px; border-radius: 4px;">★ ${name}</span>`;
      }).join(" ") || "<span style='color: var(--text-muted); font-size: 12px;'>Aucune recette alternative scannée dans cette sauvegarde.</span>";

      saveReport.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 10px; flex-wrap: wrap; gap: 8px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="background: var(--ficsit-green); color: #000; font-weight: 800; font-size: 11px; padding: 2px 8px; border-radius: 4px;">SYNCHRONISÉ</span>
            <h4 style="color: var(--ficsit-green); margin: 0; font-family: var(--font-display); font-size: 16px;">
              ✔ Sauvegarde active : ${info.sessionName}
            </h4>
          </div>
          <div style="font-size: 12px; color: var(--text-secondary);">
            Temps de jeu : <strong style="color: #fff;">${info.playtime}</strong> | Build : <strong>${info.buildVersion}</strong>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; margin-bottom: 14px;">
          <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-subtle); border-radius: 4px; padding: 8px 12px;">
            <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Jalons Débloqués</div>
            <div style="font-size: 18px; font-weight: 800; color: var(--ficsit-orange);">${info.unlockedMilestonesCount} jalon(s)</div>
          </div>
          <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-subtle); border-radius: 4px; padding: 8px 12px;">
            <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Phases Ascenseur</div>
            <div style="font-size: 18px; font-weight: 800; color: var(--ficsit-amber);">${info.unlockedPhasesCount} phase(s)</div>
          </div>
          <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-subtle); border-radius: 4px; padding: 8px 12px;">
            <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Recettes Alternatives</div>
            <div style="font-size: 18px; font-weight: 800; color: #4ade80;">${info.unlockedRecipesCount} / 41</div>
          </div>
        </div>

        ${mamBadges ? `
          <div style="margin-bottom: 14px;">
            <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: var(--text-muted); margin-bottom: 6px;">Arbres de Recherche du MAM :</div>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 6px;">
              ${mamBadges}
            </div>
          </div>
        ` : ''}

        <div style="background: rgba(0,0,0,0.35); border-radius: var(--radius-sm); padding: 10px; margin-bottom: 14px;">
          <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: var(--text-muted); margin-bottom: 6px;">
            Recettes Alternatives Détectées (${info.unlockedRecipesCount}) :
          </div>
          <div style="display: flex; gap: 6px; flex-wrap: wrap; max-height: 120px; overflow-y: auto;">
            ${recipesHtml}
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; padding: 10px; background: rgba(16, 185, 129, 0.1); border: 1px solid var(--ficsit-green); border-radius: var(--radius-sm);">
          <div style="font-size: 12px; color: #fff;">
            🎯 <strong>Mode Optimiseur Actif :</strong> Les calculateurs d'usines n'utiliseront QUE vos ${info.unlockedRecipesCount} recettes débloquées.
          </div>
          <button type="button" class="btn-ficsit" id="btn-goto-calc-from-save" style="font-size: 11.5px; padding: 5px 12px; background: var(--ficsit-orange); color: #000; font-weight: 700; border: none; cursor: pointer;">
            🔩 Lancer le Calculateur d'Usine ➔
          </button>
        </div>
      `;

      const gotoCalcBtn = document.getElementById("btn-goto-calc-from-save");
      if (gotoCalcBtn) {
        gotoCalcBtn.onclick = () => {
          if (modal) modal.style.display = "none";
          switchTab("calculator");
        };
      }
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
    localStorage.setItem("ficsit_unlocked_alt_recipes", JSON.stringify(Array.from(STATE.unlockedAltRecipes || [])));
    localStorage.setItem("ficsit_recipe_filter_mode", STATE.recipeFilterMode || "all");
    if (STATE.saveSessionInfo) {
      localStorage.setItem("ficsit_save_session", JSON.stringify(STATE.saveSessionInfo));
    }
    if (STATE.mamTrees) {
      localStorage.setItem("ficsit_mam_trees", JSON.stringify(STATE.mamTrees));
    }
    localStorage.setItem("ficsit_mam_nodes", JSON.stringify(Array.from(STATE.researchedMAMNodes || [])));
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
  // GESTION DU THÈME FICSIT
  // =========================================================================
  function initThemeSelector() {
    const themeSelect = document.getElementById("ficsit-theme-select");
    const savedTheme = localStorage.getItem("ficsit_theme") || "ficsit-classic";

    document.documentElement.setAttribute("data-theme", savedTheme);
    if (themeSelect) {
      themeSelect.value = savedTheme;
      themeSelect.addEventListener("change", (e) => {
        const newTheme = e.target.value;
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("ficsit_theme", newTheme);
        showToast(`Thème FICSIT appliqué : ${themeSelect.options[themeSelect.selectedIndex].text}`);
      });
    }
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
        onPinUpdate: () => showToast("Marqueur de base sauvegardé sur la carte !"),
        onRouteMeasured: (distMeters, p1, p2) => {
          showToast(`📏 Distance mesurée : ${distMeters.toLocaleString()} m ! Injectée dans le simulateur logistique.`);
          const distInput = document.getElementById("logistics-distance-input");
          if (distInput) {
            distInput.value = distMeters;
          }
          if (typeof recalculateLogistics === 'function') {
            recalculateLogistics();
          }
        }
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
    const toolRouteBtn = document.getElementById("tool-map-route");
    const radiusPanel = document.getElementById("map-radius-panel");

    function setToolActive(toolName, activeBtn) {
      [toolSelectBtn, toolRadiusBtn, toolPinBtn, toolRouteBtn].forEach(b => b && b.classList.remove("active"));
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
    if (toolRouteBtn) toolRouteBtn.addEventListener("click", () => {
      setToolActive("route", toolRouteBtn);
      showToast("Cliquez sur 2 points (ou gisements) de la carte pour tracer une ligne logistique !");
    });

            // Populate Resource Chips
    const resGrid = document.getElementById("map-resource-filter-grid");
    if (resGrid && typeof RESOURCE_TYPES !== 'undefined' && resGrid.children.length === 0) {
      // Change grid to 1 column for the rows
      resGrid.style.gridTemplateColumns = "1fr";
      resGrid.style.gap = "4px";

      const groups = {
        'Minerais': ['iron', 'copper', 'limestone', 'coal', 'caterium', 'bauxite', 'quartz', 'sulfur', 'uranium', 'sam'],
        'Fluides & Gaz': ['oil', 'nitrogen', 'geothermal'],
        'Exploration': ['somersloop', 'mercer_sphere', 'crash_site', 'slug_green', 'slug_yellow', 'slug_purple']
      };
      
      Object.entries(groups).forEach(([groupName, keys]) => {
        const groupTitle = document.createElement("div");
        groupTitle.style = "font-weight: bold; color: var(--ficsit-orange); margin-top: 10px; font-size: 11px; text-transform: uppercase; border-bottom: 1px solid var(--border-subtle); padding-bottom: 3px;";
        groupTitle.innerText = groupName;
        resGrid.appendChild(groupTitle);
        
        keys.forEach(typeKey => {
          const meta = RESOURCE_TYPES[typeKey];
          if (!meta) return;
          
          const row = document.createElement("div");
          row.style = "display: flex; align-items: center; justify-content: space-between; padding: 4px 0;";
          
          const nameSpan = document.createElement("span");
          nameSpan.style = "font-size: 11px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; cursor: pointer;";
          nameSpan.innerText = meta.name;
          nameSpan.title = "Cliquer pour basculer toutes les puret�s de cette ressource";
          nameSpan.addEventListener("click", () => {
            // Toggle all buttons in this row
            const btns = buttonsContainer.querySelectorAll(".resource-specific-btn");
            const allActive = Array.from(btns).every(b => b.classList.contains("active"));
            btns.forEach(btn => {
              if (allActive) {
                btn.classList.remove("active");
                btn.style.borderColor = '#444';
                btn.style.background = '#222';
              } else {
                btn.classList.add("active");
                btn.style.borderColor = 'var(--ficsit-orange)';
                btn.style.background = '#333';
              }
            });
            triggerFiltersUpdate();
          });
          row.appendChild(nameSpan);
          
          const buttonsContainer = document.createElement("div");
          buttonsContainer.style = "display: flex; gap: 4px;";
          
          const purities = (groupName === 'Exploration' || !meta.pure) ? ['normal'] : ['impure', 'normal', 'pure'];
          
          purities.forEach(p => {
            let color = '#f1c40f';
            if (p === 'pure') color = '#2ecc71';
            if (p === 'impure') color = '#e74c3c';
            if (groupName === 'Exploration') color = meta.color;
            
            const btn = document.createElement("div");
            btn.className = "resource-specific-btn";
            btn.setAttribute("data-res", typeKey);
            btn.setAttribute("data-purity", p);
            btn.style = `display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 4px; background: #222; border: 2px solid #444; cursor: pointer; position: relative;`;
            
            const countStr = (meta[p] !== undefined) ? meta[p] : (p === 'normal' && meta.total) ? meta.total : '';
            
            btn.innerHTML = `
              <div style="width: 20px; height: 20px; border-radius: 50%; background: ${meta.color}; border: 2px solid ${color}; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #fff; box-sizing: border-box;">${meta.icon || ''}</div>
              ${countStr ? `<div style="position: absolute; top: -6px; right: -6px; background: #e67e22; color: #fff; font-size: 9px; font-weight: bold; border-radius: 6px; padding: 1px 4px;">${countStr}</div>` : ''}
            `;
            
            btn.addEventListener("click", () => {
              if (btn.classList.contains('active')) {
                btn.style.borderColor = '#444';
                btn.style.background = '#222';
                btn.classList.remove('active');
              } else {
                btn.style.borderColor = 'var(--ficsit-orange)';
                btn.style.background = '#333';
                btn.classList.add('active');
              }
              triggerFiltersUpdate();
            });
            
            buttonsContainer.appendChild(btn);
          });
          
          row.appendChild(buttonsContainer);
          resGrid.appendChild(row);
        });
      });
    }

    // All / None Resource Filter Buttons
    const btnAllRes = document.getElementById("btn-filter-all-res");
    if (btnAllRes) {
      btnAllRes.addEventListener("click", () => {
        document.querySelectorAll(".resource-specific-btn").forEach(btn => {
          btn.classList.add('active');
          btn.style.borderColor = 'var(--ficsit-orange)';
          btn.style.background = '#333';
        });
        triggerFiltersUpdate();
      });
    }

    const btnNoneRes = document.getElementById("btn-filter-none-res");
    if (btnNoneRes) {
      btnNoneRes.addEventListener("click", () => {
        document.querySelectorAll(".resource-specific-btn").forEach(btn => {
          btn.classList.remove('active');
          btn.style.borderColor = '#444';
          btn.style.background = '#222';
        });
        triggerFiltersUpdate();
      });
    }

    // Search Input
    const searchInput = document.getElementById("map-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", () => triggerFiltersUpdate());
      
      // Populate Datalist for autocomplete
      const datalist = document.getElementById("map-search-datalist");
      if (datalist && typeof RESOURCE_TYPES !== 'undefined') {
        const uniqueEntries = new Set();
        Object.values(RESOURCE_TYPES).forEach(meta => uniqueEntries.add(meta.name));
        if (typeof BIOMES !== 'undefined') {
          Object.values(BIOMES).forEach(b => uniqueEntries.add(b.name));
        }
        // Also add purity names
        uniqueEntries.add("Pur");
        uniqueEntries.add("Normal");
        uniqueEntries.add("Impur");
        
        uniqueEntries.forEach(val => {
          const opt = document.createElement("option");
          opt.value = val;
          datalist.appendChild(opt);
        });
      }
    }

    function triggerFiltersUpdate() {
      if (!mapEngineInstance) return;
      const specifics = new Set();
      document.querySelectorAll(".resource-specific-btn.active").forEach(btn => {
        specifics.add(btn.getAttribute("data-res") + '-' + btn.getAttribute("data-purity"));
      });
      const searchInput = document.getElementById("map-search-input");
      const searchVal = searchInput ? searchInput.value : "";
      mapEngineInstance.setFilters({ specifics, search: searchVal });
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
  // MODULE 🚚 LOGISTIQUE & TRANSPORTS FICSIT (1.0 / 1.2)
  // =========================================================================
  let lastLogisticsCalculation = null;

  function initLogisticsUI() {
    const subnavBtns = document.querySelectorAll(".logistics-subnav-btn");
    const subtabViews = {
      simulator: document.getElementById("logistics-subtab-simulator"),
      matrix: document.getElementById("logistics-subtab-matrix"),
      engineering: document.getElementById("logistics-subtab-engineering")
    };

    subnavBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        subnavBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const target = btn.getAttribute("data-subtab");
        Object.entries(subtabViews).forEach(([key, view]) => {
          if (view) view.style.display = key === target ? "block" : "none";
        });
        if (target === "matrix") renderLogisticsMatrix();
        if (target === "engineering") renderLogisticsEngineering();
      });
    });

    const modeSelect = document.getElementById("logistics-mode-select");
    const itemSelect = document.getElementById("logistics-item-select");
    const throughputInput = document.getElementById("logistics-throughput-input");
    const distanceInput = document.getElementById("logistics-distance-input");
    const unitLabel = document.getElementById("logistics-unit-label");
    const optSlope = document.getElementById("opt-train-slope");
    const optBidi = document.getElementById("opt-train-bidirectional");
    const optFuel = document.getElementById("opt-road-fuel");
    const slopeSelect = document.getElementById("logistics-slope-select");
    const bidiCheck = document.getElementById("logistics-bidirectional-check");
    const fuelSelect = document.getElementById("logistics-fuel-select");
    const recalcBtn = document.getElementById("btn-calc-logistics");
    const exportChecklistBtn = document.getElementById("btn-export-logistics-checklist");
    const measureMapBtn = document.getElementById("btn-measure-on-map");

    function updateFormVisibility() {
      if (!modeSelect) return;
      const mode = modeSelect.value;
      const itemId = itemSelect ? itemSelect.value : "iron_ore";
      const isFluid = typeof SatisfactoryLogisticsEngine !== 'undefined' ? SatisfactoryLogisticsEngine.isItemFluid(itemId) : false;

      if (unitLabel) {
        unitLabel.textContent = isFluid ? "m³ / min" : "pièces / min";
      }

      if (optSlope) optSlope.style.display = mode === "train" ? "block" : "none";
      if (optBidi) optBidi.style.display = mode === "train" ? "block" : "none";
      if (optFuel) optFuel.style.display = (mode === "truck" || mode === "tractor" || mode === "explorer") ? "block" : "none";
    }

    if (modeSelect) modeSelect.addEventListener("change", () => {
      updateFormVisibility();
      recalculateLogistics();
    });

    if (itemSelect) itemSelect.addEventListener("change", () => {
      updateFormVisibility();
      recalculateLogistics();
    });

    if (throughputInput) throughputInput.addEventListener("input", () => recalculateLogistics());
    if (distanceInput) distanceInput.addEventListener("input", () => recalculateLogistics());
    if (slopeSelect) slopeSelect.addEventListener("change", () => recalculateLogistics());
    if (bidiCheck) bidiCheck.addEventListener("change", () => recalculateLogistics());
    if (fuelSelect) fuelSelect.addEventListener("change", () => recalculateLogistics());
    if (recalcBtn) recalcBtn.addEventListener("click", () => recalculateLogistics());

    if (exportChecklistBtn) {
      exportChecklistBtn.addEventListener("click", () => exportLogisticsToChecklist());
    }

    if (measureMapBtn) {
      measureMapBtn.addEventListener("click", () => {
        switchTab("map");
        setTimeout(() => {
          const toolRouteBtn = document.getElementById("tool-map-route");
          if (toolRouteBtn) toolRouteBtn.click();
        }, 100);
      });
    }

    updateFormVisibility();
    recalculateLogistics();
  }

  function recalculateLogistics() {
    if (typeof SatisfactoryLogisticsEngine === 'undefined') return;

    const modeSelect = document.getElementById("logistics-mode-select");
    const itemSelect = document.getElementById("logistics-item-select");
    const throughputInput = document.getElementById("logistics-throughput-input");
    const distanceInput = document.getElementById("logistics-distance-input");
    const slopeSelect = document.getElementById("logistics-slope-select");
    const bidiCheck = document.getElementById("logistics-bidirectional-check");
    const fuelSelect = document.getElementById("logistics-fuel-select");

    const mode = modeSelect ? modeSelect.value : "train";
    const itemId = itemSelect ? itemSelect.value : "iron_ore";
    const throughput = parseFloat(throughputInput ? throughputInput.value : 600) || 600;
    const distance = parseFloat(distanceInput ? distanceInput.value : 1200) || 1200;
    const slope = slopeSelect ? slopeSelect.value : "flat";
    const isBidi = bidiCheck ? bidiCheck.checked : false;
    const fuelId = fuelSelect ? fuelSelect.value : "fuel";

    const options = {
      slope,
      isBidirectional: isBidi,
      fuelType: fuelId
    };

    let result = null;
    if (mode === "train") {
      result = SatisfactoryLogisticsEngine.calculateTrain(distance, throughput, itemId, options);
    } else if (mode === "drone") {
      result = SatisfactoryLogisticsEngine.calculateDrone(distance, throughput, itemId, options);
    } else if (mode === "truck" || mode === "tractor" || mode === "explorer") {
      result = SatisfactoryLogisticsEngine.calculateVehicle(distance, throughput, itemId, mode, fuelId, options);
    } else if (mode === "belt") {
      result = SatisfactoryLogisticsEngine.calculateBeltsAndPipes(distance, throughput, itemId, options);
    }

    lastLogisticsCalculation = {
      mode,
      itemId,
      throughput,
      distance,
      options,
      result
    };

    renderLogisticsSimulator(result);
  }

  function renderLogisticsSimulator(res) {
    const container = document.getElementById("logistics-results-panel");
    if (!container) return;
    if (!res) {
      container.innerHTML = `<div style="color: var(--text-secondary); padding: 20px;">Aucun calcul disponible.</div>`;
      return;
    }

    if (res.error) {
      container.innerHTML = `
        <div class="dock-lockout-notice danger">
          <span class="dock-lockout-icon">⚠️</span>
          <div class="dock-lockout-text">
            <strong>Incompatibilité FICSIT :</strong><br>
            ${res.error}
          </div>
        </div>
      `;
      return;
    }

    let kpi1 = "", kpi2 = "", kpi3 = "", kpi4 = "";
    let fleetHtml = "";
    let alertHtml = "";

    if (res.mode === "train") {
      kpi1 = `
        <div class="logistics-kpi-card">
          <span class="logistics-kpi-label">Convoi Requis</span>
          <span class="logistics-kpi-val">${res.locosRequired} Loco + ${res.wagonsRequired} Wagon${res.wagonsRequired > 1 ? 's' : ''}</span>
          <span class="logistics-kpi-sub">Capacité : ${res.totalCapacity.toLocaleString()} ${res.isFluid ? 'm³' : 'pcs'}</span>
        </div>
      `;
      kpi2 = `
        <div class="logistics-kpi-card accent-cyan">
          <span class="logistics-kpi-label">Temps de Cycle (A/R)</span>
          <span class="logistics-kpi-val">${res.roundtripFormatted}</span>
          <span class="logistics-kpi-sub">Dont 2x 25s de quai</span>
        </div>
      `;
      kpi3 = `
        <div class="logistics-kpi-card accent-amber">
          <span class="logistics-kpi-label">Réseau Électrique</span>
          <span class="logistics-kpi-val">${res.totalPowerAvgMW} MW</span>
          <span class="logistics-kpi-sub">Pic max : ${res.totalPowerMaxMW} MW</span>
        </div>
      `;
      kpi4 = `
        <div class="logistics-kpi-card accent-green">
          <span class="logistics-kpi-label">Débit Ligne Sécurisé</span>
          <span class="logistics-kpi-val">${res.maxLineThroughputPerMin} /min</span>
          <span class="logistics-kpi-sub">Saturation ligne : ${res.saturationPercent}%</span>
        </div>
      `;

      // Visualisation Convoi
      let carsUnits = "";
      for (let i = 0; i < res.locosRequired; i++) {
        carsUnits += `
          <div class="train-car-unit locomotive">
            <span class="train-car-icon">🚂</span>
            <span class="train-car-label">Locomotive</span>
            <span class="train-car-sub">65 MW</span>
          </div>
          <div class="train-coupler"></div>
        `;
      }
      for (let i = 0; i < res.wagonsRequired; i++) {
        carsUnits += `
          <div class="train-car-unit ${res.isFluid ? 'fluid' : 'freight'}">
            <span class="train-car-icon">${res.isFluid ? '🛢️' : '📦'}</span>
            <span class="train-car-label">${res.isFluid ? 'Citerne' : 'Wagon Fret'}</span>
            <span class="train-car-sub">${res.singleCarCapacity} ${res.isFluid ? 'm³' : 'pcs'}</span>
          </div>
          ${i < res.wagonsRequired - 1 ? '<div class="train-coupler"></div>' : ''}
        `;
      }

      fleetHtml = `
        <div class="fleet-visualizer-box">
          <div style="font-size: 11.5px; font-family: var(--font-display); color: var(--ficsit-orange); margin-bottom: 8px; font-weight: 700;">
            🚆 COMPOSITION DU CONVOI FERROVIAIRE FICSIT (2 Gares + ${res.wagonsRequired * 2} Quais)
          </div>
          <div class="train-consist">
            ${carsUnits}
          </div>
        </div>
      `;

      // Alerte Gel de Quai 25s
      alertHtml = `
        <div class="dock-lockout-notice">
          <span class="dock-lockout-icon">⏱️</span>
          <div class="dock-lockout-text">
            <strong>Gestion du Gel de Quai (25 secondes) :</strong><br>
            Pendant l'animation de chargement/déchargement, la plateforme bloque les convoyeurs. Pour maintenir <strong>${res.throughputPerMin} pièces/min sans interruption</strong> :<br>
            • Pertes cumulées par cycle : <strong>${res.freezeLossItems} pièces</strong><br>
            • Solution recommandée : <strong>${res.doubleContainerBufferNeeded ? 'Brancher 2 SORTIES de la plateforme vers un Conteneur Industriel Tampon (Bande double vitesse requise).' : '1 Convoyeur standard suffit pour absorber le gel.'}</strong>
          </div>
        </div>
      `;

    } else if (res.mode === "drone") {
      kpi1 = `
        <div class="logistics-kpi-card accent-cyan">
          <span class="logistics-kpi-label">Flotte Aérienne</span>
          <span class="logistics-kpi-val">${res.dronesRequired} Drone${res.dronesRequired > 1 ? 's' : ''}</span>
          <span class="logistics-kpi-sub">${res.portsRequired} Ports de Drones</span>
        </div>
      `;
      kpi2 = `
        <div class="logistics-kpi-card">
          <span class="logistics-kpi-label">Temps de Vol (A/R)</span>
          <span class="logistics-kpi-val">${res.roundtripFormatted}</span>
          <span class="logistics-kpi-sub">Vitesse : 252 km/h (70 m/s)</span>
        </div>
      `;
      kpi3 = `
        <div class="logistics-kpi-card accent-amber">
          <span class="logistics-kpi-label">Consommation Batteries</span>
          <span class="logistics-kpi-val">${res.batteriesPerMin} /min</span>
          <span class="logistics-kpi-sub">${res.batteriesPerHour} batteries / heure</span>
        </div>
      `;
      kpi4 = `
        <div class="logistics-kpi-card accent-green">
          <span class="logistics-kpi-label">Puissance Ports</span>
          <span class="logistics-kpi-val">${res.totalPowerAvgMW} MW</span>
          <span class="logistics-kpi-sub">100 MW par port actif</span>
        </div>
      `;

      let dronesUnits = "";
      for (let i = 0; i < Math.min(res.dronesRequired, 6); i++) {
        dronesUnits += `
          <div class="train-car-unit freight" style="border-color: var(--ficsit-cyan); background: rgba(63, 224, 208, 0.1);">
            <span class="train-car-icon">🛸</span>
            <span class="train-car-label">Drone #${i + 1}</span>
            <span class="train-car-sub">${res.singleDroneCapacity} pcs</span>
          </div>
        `;
      }
      if (res.dronesRequired > 6) {
        dronesUnits += `<div style="display: flex; align-items: center; color: var(--text-secondary); font-size: 12px; padding: 0 10px;">+ ${res.dronesRequired - 6} autres drones...</div>`;
      }

      fleetHtml = `
        <div class="fleet-visualizer-box">
          <div style="font-size: 11.5px; font-family: var(--font-display); color: var(--ficsit-cyan); margin-bottom: 8px; font-weight: 700;">
            🛸 FLOTTE DE DRONES AÉRIENS (${res.portsRequired} Ports Connectés)
          </div>
          <div class="train-consist">
            ${dronesUnits}
          </div>
        </div>
      `;

      alertHtml = `
        <div class="dock-lockout-notice">
          <span class="dock-lockout-icon">🔋</span>
          <div class="dock-lockout-text">
            <strong>Ravitaillement en Batteries :</strong><br>
            Chaque vol consomme <strong>${res.batteriesPerTrip} batteries</strong>. Pour alimenter en continu la ligne sans panne sèche, prévoyez une usine produisant au moins <strong>${res.batteriesPerMin} batteries/min</strong> acheminée sur le port de départ.
          </div>
        </div>
      `;

    } else if (res.mode === "vehicle") {
      kpi1 = `
        <div class="logistics-kpi-card">
          <span class="logistics-kpi-label">Véhicules Requis</span>
          <span class="logistics-kpi-val">${res.vehiclesRequired} × ${res.vehicleName}</span>
          <span class="logistics-kpi-sub">Capacité : ${res.singleCapacity} pcs/véhicule</span>
        </div>
      `;
      kpi2 = `
        <div class="logistics-kpi-card accent-cyan">
          <span class="logistics-kpi-label">Rotation Aller-Retour</span>
          <span class="logistics-kpi-val">${res.roundtripFormatted}</span>
          <span class="logistics-kpi-sub">Dont 2x 20s de quai</span>
        </div>
      `;
      kpi3 = `
        <div class="logistics-kpi-card accent-amber">
          <span class="logistics-kpi-label">Consommation ${res.fuelIcon}</span>
          <span class="logistics-kpi-val">${res.totalFuelPerMin} /min</span>
          <span class="logistics-kpi-sub">${res.fuelName} (${res.totalFuelPerHour}/h)</span>
        </div>
      `;
      kpi4 = `
        <div class="logistics-kpi-card accent-green">
          <span class="logistics-kpi-label">Gares Routières</span>
          <span class="logistics-kpi-val">${res.stationsPowerMW} MW</span>
          <span class="logistics-kpi-sub">2 gares (20 MW chacune)</span>
        </div>
      `;

      let vehUnits = "";
      for (let i = 0; i < Math.min(res.vehiclesRequired, 5); i++) {
        vehUnits += `
          <div class="train-car-unit freight" style="border-color: var(--ficsit-orange);">
            <span class="train-car-icon">${res.icon}</span>
            <span class="train-car-label">${res.vehicleName}</span>
            <span class="train-car-sub">${res.singleCapacity} pcs</span>
          </div>
        `;
      }
      if (res.vehiclesRequired > 5) {
        vehUnits += `<div style="display: flex; align-items: center; color: var(--text-secondary); font-size: 12px; padding: 0 10px;">+ ${res.vehiclesRequired - 5} autres...</div>`;
      }

      fleetHtml = `
        <div class="fleet-visualizer-box">
          <div style="font-size: 11.5px; font-family: var(--font-display); color: var(--ficsit-orange); margin-bottom: 8px; font-weight: 700;">
            🚚 FLOTTE ROUTIÈRE AUTOMATISÉE
          </div>
          <div class="train-consist">
            ${vehUnits}
          </div>
        </div>
      `;

      alertHtml = `
        <div class="dock-lockout-notice">
          <span class="dock-lockout-icon">⛽</span>
          <div class="dock-lockout-text">
            <strong>Ravitaillement Routier :</strong><br>
            Chaque véhicule consomme <strong>${res.fuelUnitsPerTrip} unités de ${res.fuelName}</strong> par rotation. Assurez-vous qu'au moins une des deux gares routières dispose d'une alimentation dédiée sur le port carburant.
          </div>
        </div>
      `;

    } else {
      // Convoyeur / Tuyau
      kpi1 = `
        <div class="logistics-kpi-card accent-green">
          <span class="logistics-kpi-label">Infrastructure</span>
          <span class="logistics-kpi-val">${res.linesRequired}x ${res.isFluid ? 'Ligne(s) Tuyau' : 'Convoyeur(s)'}</span>
          <span class="logistics-kpi-sub">${res.recommendedTier}</span>
        </div>
      `;
      kpi2 = `
        <div class="logistics-kpi-card accent-cyan">
          <span class="logistics-kpi-label">Consommation Énergie</span>
          <span class="logistics-kpi-val">0 MW</span>
          <span class="logistics-kpi-sub">Zéro carburant / électricité</span>
        </div>
      `;
      kpi3 = `
        <div class="logistics-kpi-card">
          <span class="logistics-kpi-label">Distance Totale</span>
          <span class="logistics-kpi-val">${res.distanceM.toLocaleString()} m</span>
          <span class="logistics-kpi-sub">Liaison point à point</span>
        </div>
      `;
      kpi4 = `
        <div class="logistics-kpi-card accent-amber">
          <span class="logistics-kpi-label">Flux Continu</span>
          <span class="logistics-kpi-val">100% Constant</span>
          <span class="logistics-kpi-sub">Aucun temps de gel de quai</span>
        </div>
      `;

      alertHtml = `
        <div class="dock-lockout-notice">
          <span class="dock-lockout-icon">💡</span>
          <div class="dock-lockout-text">
            <strong>Diagnostic de portée FICSIT :</strong><br>
            ${res.complexityNote}
          </div>
        </div>
      `;
    }

    container.innerHTML = `
      <div class="logistics-card">
        <div class="logistics-card-header">
          <h3 class="logistics-card-title"><span>📊</span> Bilan de Dimensionnement & Performances</h3>
          <span style="font-size: 11px; background: rgba(250, 149, 73, 0.15); color: var(--ficsit-orange); padding: 4px 8px; border-radius: 4px; font-weight: 700; font-family: var(--font-display);">
            ${res.distanceM.toLocaleString()} m • ${res.throughputPerMin} ${res.isFluid ? 'm³/min' : 'pcs/min'}
          </span>
        </div>

        <div class="logistics-kpi-grid">
          ${kpi1}
          ${kpi2}
          ${kpi3}
          ${kpi4}
        </div>

        ${fleetHtml}
        ${alertHtml}
      </div>
    `;
  }

  function renderLogisticsMatrix() {
    const container = document.getElementById("logistics-matrix-content");
    if (!container || typeof SatisfactoryLogisticsEngine === 'undefined') return;

    const itemSelect = document.getElementById("logistics-item-select");
    const throughputInput = document.getElementById("logistics-throughput-input");
    const distanceInput = document.getElementById("logistics-distance-input");

    const itemId = itemSelect ? itemSelect.value : "iron_ore";
    const throughput = parseFloat(throughputInput ? throughputInput.value : 600) || 600;
    const distance = parseFloat(distanceInput ? distanceInput.value : 1200) || 1200;

    const matrix = SatisfactoryLogisticsEngine.calculateDecisionMatrix(distance, throughput, itemId);

    let cardsHtml = "";
    matrix.evaluations.forEach((ev, idx) => {
      const isWinner = idx === 0;
      const prosHtml = ev.pros.map(p => `<li class="pro-con-item pro"><span>✔</span> <span>${p}</span></li>`).join("");
      const consHtml = ev.cons.map(c => `<li class="pro-con-item con"><span>✖</span> <span>${c}</span></li>`).join("");

      cardsHtml += `
        <div class="matrix-card ${isWinner ? 'winner' : ''}">
          ${isWinner ? '<span class="matrix-card-winner-badge">🏆 Choix Idéal FICSIT</span>' : ''}
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
            <span style="font-size: 24px;">${ev.icon}</span>
            <div>
              <div style="font-family: var(--font-display); font-size: 15px; font-weight: 700; color: var(--text-primary);">${ev.name}</div>
              <div style="font-size: 11px; color: ${isWinner ? 'var(--ficsit-green)' : 'var(--text-secondary)'}; font-weight: 600;">${ev.rating} (${ev.score}/100)</div>
            </div>
          </div>

          <div class="matrix-score-bar-bg">
            <div class="matrix-score-bar-fill" style="width: ${ev.score}%;"></div>
          </div>

          <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 8px; color: var(--text-secondary);">
            <span>Énergie : <strong style="color: var(--text-primary);">${ev.powerMW} MW</strong></span>
            <span>Complexité : <strong style="color: var(--text-primary);">${ev.setupCost}</strong></span>
          </div>

          <ul class="pro-con-list">
            ${prosHtml}
            ${consHtml}
          </ul>
        </div>
      `;
    });

    container.innerHTML = `
      <div style="background: rgba(46, 204, 113, 0.1); border-left: 4px solid var(--ficsit-green); padding: 12px 16px; border-radius: 0 var(--radius-sm) var(--radius-sm) 0; margin-bottom: 16px;">
        <div style="font-size: 14px; font-weight: 700; color: var(--ficsit-green); font-family: var(--font-display);">
          🎯 RECOMMANDATION FICSIT POUR ${distance.toLocaleString()} m & ${throughput} ${matrix.trainDetails.isFluid ? 'm³/min' : 'pcs/min'} :
        </div>
        <div style="font-size: 13px; color: var(--text-primary); margin-top: 4px;">
          Le mode le plus économique et performant est : <strong>${matrix.winner.name}</strong> (${matrix.winner.score}/100).
        </div>
      </div>

      <div class="matrix-cards-grid">
        ${cardsHtml}
      </div>
    `;
  }

  function renderLogisticsEngineering() {
    const container = document.getElementById("logistics-engineering-content");
    if (!container || typeof LOGISTICS_DATA === 'undefined') return;

    container.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 18px;">
        
        <!-- Guide 1 : Signaux Ferroviaires -->
        <div class="logistics-card">
          <div class="logistics-card-header">
            <h3 class="logistics-card-title"><span>🚦</span> Block Signal vs Path Signal</h3>
            <span style="font-size: 11px; color: var(--ficsit-orange); font-weight: 700;">Règle d'or</span>
          </div>
          <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.4; margin: 0 0 10px 0;">
            Un <strong>Block Signal</strong> réserve tout le tronçon pour 1 train. Un <strong>Path Signal</strong> lit la trajectoire exacte du train dans le carrefour et permet les passages simultanés sans collision.
          </p>

          <div class="schematic-box">
            <svg viewBox="0 0 400 160" width="100%" height="150" style="display: block;">
              <!-- Rail horizontal -->
              <line x1="20" y1="80" x2="380" y2="80" stroke="#3e4d62" stroke-width="6" />
              <!-- Rail vertical -->
              <line x1="200" y1="20" x2="200" y2="140" stroke="#3e4d62" stroke-width="6" />
              <!-- Zone d'intersection -->
              <rect x="175" y="55" width="50" height="50" fill="rgba(250, 149, 73, 0.15)" stroke="#fa9549" stroke-dasharray="4,4" stroke-width="1.5" rx="4" />
              
              <!-- Signaux Path (Entrée) -->
              <circle cx="140" cy="80" r="7" fill="#3fe0d0" stroke="#fff" stroke-width="2" />
              <text x="140" y="65" fill="#3fe0d0" font-size="10" font-family="Chakra Petch" font-weight="700" text-anchor="middle">PATH</text>

              <circle cx="200" cy="40" r="7" fill="#3fe0d0" stroke="#fff" stroke-width="2" />
              <text x="230" y="44" fill="#3fe0d0" font-size="10" font-family="Chakra Petch" font-weight="700">PATH</text>

              <!-- Signaux Block (Sortie) -->
              <circle cx="260" cy="80" r="7" fill="#2ecc71" stroke="#fff" stroke-width="2" />
              <text x="260" y="65" fill="#2ecc71" font-size="10" font-family="Chakra Petch" font-weight="700" text-anchor="middle">BLOCK</text>

              <circle cx="200" cy="120" r="7" fill="#2ecc71" stroke="#fff" stroke-width="2" />
              <text x="235" y="124" fill="#2ecc71" font-size="10" font-family="Chakra Petch" font-weight="700">BLOCK</text>
            </svg>
          </div>

          <div class="golden-rule-banner">
            ⭐ <strong>Règle d'or :</strong> Signal PATH à chaque entrée de croisement, Signal BLOCK à chaque sortie !
          </div>
        </div>

        <!-- Guide 2 : Tampon anti-gel 25s -->
        <div class="logistics-card">
          <div class="logistics-card-header">
            <h3 class="logistics-card-title"><span>📦</span> Tampon Anti-Gel de Quai (25s)</h3>
            <span style="font-size: 11px; color: var(--ficsit-cyan); font-weight: 700;">Débit 100%</span>
          </div>
          <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.4; margin: 0 0 10px 0;">
            Le bras mécanique fige la gare pendant 25 secondes. Reliez <strong>les 2 sorties</strong> de la plateforme à un Conteneur Industriel Tampon pour alimenter l'usine en continu.
          </p>

          <div class="schematic-box">
            <svg viewBox="0 0 400 160" width="100%" height="150" style="display: block;">
              <!-- Plateforme de gare -->
              <rect x="30" y="40" width="100" height="80" fill="#161c24" stroke="#4bb3fd" stroke-width="2" rx="4" />
              <text x="80" y="75" fill="#4bb3fd" font-size="11" font-family="Chakra Petch" font-weight="700" text-anchor="middle">PLATEFORME</text>
              <text x="80" y="92" fill="#8ea8cc" font-size="9" text-anchor="middle">DE FRET (Gare)</text>

              <!-- 2 Convoyeurs Sortie -->
              <line x1="130" y1="60" x2="220" y2="60" stroke="#fa9549" stroke-width="4" />
              <line x1="130" y1="100" x2="220" y2="100" stroke="#fa9549" stroke-width="4" />
              <text x="175" y="52" fill="#fa9549" font-size="9" text-anchor="middle">Mk.5 (780)</text>
              <text x="175" y="115" fill="#fa9549" font-size="9" text-anchor="middle">Mk.5 (780)</text>

              <!-- Conteneur Tampon -->
              <rect x="220" y="40" width="90" height="80" fill="#161c24" stroke="#2ecc71" stroke-width="2" rx="4" />
              <text x="265" y="75" fill="#2ecc71" font-size="11" font-family="Chakra Petch" font-weight="700" text-anchor="middle">CONTENEUR</text>
              <text x="265" y="92" fill="#8ea8cc" font-size="9" text-anchor="middle">INDUSTRIEL</text>

              <!-- Sortie vers Usine -->
              <line x1="310" y1="80" x2="380" y2="80" stroke="#2ecc71" stroke-width="4" />
              <text x="345" y="72" fill="#2ecc71" font-size="9" text-anchor="middle">Flux 100%</text>
            </svg>
          </div>

          <div class="golden-rule-banner">
            ⭐ <strong>Règle d'or :</strong> Débit Usine = Débit Moyen Constant. Les 2 bandes vident la gare à 2x la vitesse !
          </div>
        </div>

        <!-- Guide 3 : Ratio Locomotives / Wagons -->
        <div class="logistics-card">
          <div class="logistics-card-header">
            <h3 class="logistics-card-title"><span>⛰️</span> Ratio de Traction & Dénivelé</h3>
            <span style="font-size: 11px; color: var(--ficsit-amber); font-weight: 700;">Traction</span>
          </div>
          <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.4; margin: 0 0 10px 0;">
            Le poids des wagons pleins ralentit considérablement les trains dans les rampes. Adaptez la composition de votre train selon le profil altimétrique :
          </p>
          <div style="font-size: 13px; display: flex; flex-direction: column; gap: 8px; margin-top: 12px;">
            <div style="background: var(--bg-surface); padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
              🟢 <strong>Terrain plat & ponts :</strong> 1 Loco pour 4 Wagons de fret
            </div>
            <div style="background: var(--bg-surface); padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
              🟡 <strong>Rampes 2m standard :</strong> 1 Loco pour 3 Wagons
            </div>
            <div style="background: var(--bg-surface); padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
              🔴 <strong>Rampes raides 4m / hélicoïdes :</strong> 1 Loco pour 2 Wagons (Formation 2-4 recommandée)
            </div>
          </div>
        </div>

      </div>
    `;
  }

  function exportLogisticsToChecklist() {
    if (!lastLogisticsCalculation || !lastLogisticsCalculation.result) {
      showToast("Veuillez d'abord calculer une ligne logistique !");
      return;
    }

    const { mode, result, throughput, itemId, distance } = lastLogisticsCalculation;
    const items = JSON.parse(localStorage.getItem("ficsit_checklist_items") || "[]");

    if (mode === "train") {
      items.push({
        title: `🚂 Construire ${result.locosRequired} × Locomotive Électrique`,
        subtitle: `Ligne Monorail ${distance}m (${throughput} pcs/min)`,
        qty: `${result.locosRequired} pcs`
      });
      items.push({
        title: `📦 Poser ${result.wagonsRequired} × ${result.isFluid ? 'Wagon-Citerne' : 'Wagon de Fret'}`,
        subtitle: `Capacité totale : ${result.totalCapacity} ${result.isFluid ? 'm³' : 'pcs'}`,
        qty: `${result.wagonsRequired} pcs`
      });
      items.push({
        title: `🏢 Poser 2 × Gare Ferroviaire & ${result.wagonsRequired * 2} × Plateforme de Fret`,
        subtitle: `Gares de départ et d'arrivée connectées au réseau électrique`,
        qty: `${2 + result.wagonsRequired * 2} bâtiments`
      });
      const railsCount = Math.ceil(distance / 50);
      items.push({
        title: `🛤️ Poser ~${distance}m de Rails Monorail (${railsCount} segments)`,
        subtitle: `Voie ferrée principale et raccordements`,
        qty: `${railsCount} segments`
      });
    } else if (mode === "drone") {
      items.push({
        title: `🛸 Construire ${result.dronesRequired} × Drone FICSIT`,
        subtitle: `Liaison aérienne ${distance}m (${throughput} pcs/min)`,
        qty: `${result.dronesRequired} pcs`
      });
      items.push({
        title: `🏢 Construire ${result.portsRequired} × Port de Drone`,
        subtitle: `Ports de départ, arrivée et alimentation batteries`,
        qty: `${result.portsRequired} ports`
      });
    } else if (mode === "vehicle") {
      items.push({
        title: `🚛 Fabriquer ${result.vehiclesRequired} × ${result.vehicleName}`,
        subtitle: `Liaison routière ${distance}m`,
        qty: `${result.vehiclesRequired} pcs`
      });
      items.push({
        title: `🏢 Poser 2 × Gare Routière avec Ravitaillement ${result.fuelName}`,
        subtitle: `Gares de chargement et déchargement`,
        qty: `2 gares`
      });
    } else {
      items.push({
        title: `📦 Installer Ligne ${result.recommendedTier} sur ${distance}m`,
        subtitle: `Débit requis : ${throughput} /min`,
        qty: `1 ligne`
      });
    }

    localStorage.setItem("ficsit_checklist_items", JSON.stringify(items));
    renderChecklist();
    showToast(`🏗️ Matériel logistique ajouté à la Checklist de Chantier !`);
  }

  // Pont externe pour injecter depuis le Calculateur
  window.injectIntoLogistics = function(itemId, throughputPerMin) {
    switchTab("logistics");
    setTimeout(() => {
      const itemSelect = document.getElementById("logistics-item-select");
      const throughputInput = document.getElementById("logistics-throughput-input");
      if (itemSelect && itemId) itemSelect.value = itemId;
      if (throughputInput && throughputPerMin) throughputInput.value = throughputPerMin;
      recalculateLogistics();
      showToast(`🚚 Flux de ${throughputPerMin}/min (${itemId}) injecté dans le module Logistique !`);
    }, 150);
  };

  // =========================================================================
  // MODULE 🔬 M.A.M. & DISQUES DURS (1.0 / 1.2)
  // =========================================================================
  let activeMAMBranch = "alien_tech";
  let activeMAMTierFilter = "all";
  let mamSearchQuery = "";

  function initMAMUI() {
    if (typeof MAM_DATA === 'undefined') return;

    // 1. Sous-navigation MAM
    const subnavBtns = document.querySelectorAll("[data-mam-subtab]");
    const subtabs = {
      trees: document.getElementById("mam-subtab-trees"),
      picker: document.getElementById("mam-subtab-picker"),
      tierlist: document.getElementById("mam-subtab-tierlist")
    };

    subnavBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        subnavBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const target = btn.getAttribute("data-mam-subtab");
        Object.entries(subtabs).forEach(([k, el]) => {
          if (el) el.style.display = k === target ? "block" : "none";
        });
        if (target === "trees") renderMAMTree();
        if (target === "picker") initMAMPicker();
        if (target === "tierlist") renderMAMTierList();
      });
    });

    renderMAMBranchChips();
    renderMAMTree();
    initMAMPicker();
    renderMAMTierList();
  }

  function renderMAMBranchChips() {
    const container = document.getElementById("mam-branch-chips-container");
    if (!container || typeof MAM_DATA === 'undefined') return;
    container.innerHTML = "";

    Object.entries(MAM_DATA.trees).forEach(([treeId, tree]) => {
      const prog = SatisfactoryMAMEngine.getTreeProgress(treeId, STATE.researchedMAMNodes);
      const chip = document.createElement("div");
      chip.className = `mam-branch-chip ${treeId === activeMAMBranch ? 'active' : ''}`;
      chip.innerHTML = `
        <div class="mam-branch-header">
          <span style="font-size: 18px;">${tree.icon}</span>
          <span style="flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${tree.name}</span>
          <span style="font-size: 11px; color: ${prog.pct === 100 ? 'var(--ficsit-green)' : 'var(--text-secondary)'}; font-family: var(--font-display);">${prog.pct}%</span>
        </div>
        <div class="mam-branch-progress-bar">
          <div class="mam-branch-progress-fill" style="width: ${prog.pct}%; background: ${tree.color || 'var(--ficsit-green)'};"></div>
        </div>
      `;

      chip.addEventListener("click", () => {
        activeMAMBranch = treeId;
        renderMAMBranchChips();
        renderMAMTree();
      });

      container.appendChild(chip);
    });
  }

  function renderMAMTree() {
    const headerEl = document.getElementById("mam-active-branch-header");
    const nodesContainer = document.getElementById("mam-nodes-container");
    if (!headerEl || !nodesContainer || typeof MAM_DATA === 'undefined') return;

    const tree = MAM_DATA.trees[activeMAMBranch];
    if (!tree) return;

    const prog = SatisfactoryMAMEngine.getTreeProgress(activeMAMBranch, STATE.researchedMAMNodes);
    
    // Header
    headerEl.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 28px;">${tree.icon}</span>
        <div>
          <h3 style="margin: 0; font-family: var(--font-display); font-size: 17px; color: ${tree.color || 'var(--ficsit-orange)'};">
            ${tree.name}
          </h3>
          <p style="margin: 2px 0 0 0; font-size: 12px; color: var(--text-secondary);">
            ${tree.description}
          </p>
        </div>
      </div>
      <div style="display: flex; gap: 14px; align-items: center;">
        <div style="font-family: var(--font-display); font-size: 13px; color: var(--text-primary);">
          Recherches : <strong style="color: ${prog.pct === 100 ? 'var(--ficsit-green)' : 'var(--ficsit-orange)'};">${prog.completed} / ${prog.total} (${prog.pct}%)</strong>
        </div>
        <button class="btn-outline" id="btn-toggle-all-mam-branch" style="font-size: 11px; padding: 4px 10px;">
          ${prog.completed === prog.total ? '🔄 Tout Décocher' : '✔ Tout Valider'}
        </button>
      </div>
    `;

    const toggleAllBtn = document.getElementById("btn-toggle-all-mam-branch");
    if (toggleAllBtn) {
      toggleAllBtn.addEventListener("click", () => {
        const isAll = prog.completed === prog.total;
        tree.nodes.forEach(n => {
          if (isAll) {
            STATE.researchedMAMNodes.delete(n.id);
          } else {
            STATE.researchedMAMNodes.add(n.id);
          }
        });
        saveState();
        renderMAMBranchChips();
        renderMAMTree();
      });
    }

    // Nodes
    nodesContainer.innerHTML = "";
    tree.nodes.forEach(node => {
      const isResearched = STATE.researchedMAMNodes.has(node.id);
      
      // Check if parents are researched
      let isAvailable = true;
      if (node.parents && node.parents.length > 0) {
        isAvailable = node.parents.every(pId => STATE.researchedMAMNodes.has(pId));
      }

      const statusClass = isResearched ? 'researched' : (isAvailable ? 'available' : 'locked');
      const statusLabel = isResearched ? '✔ Recherché' : (isAvailable ? '⚡ Disponible' : '🔒 Verrouillé');

      const costBadges = Object.entries(node.cost || {}).map(([item, qty]) => {
        return `<span style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); padding: 2px 6px; border-radius: 4px; font-size: 11px;">${qty}x ${item.replace(/_/g, " ")}</span>`;
      }).join(" ");

      const card = document.createElement("div");
      card.className = `mam-node-card ${statusClass}`;
      card.innerHTML = `
        <span class="mam-node-status-badge ${statusClass}">${statusLabel}</span>
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
          <span style="font-size: 24px;">${node.icon}</span>
          <div>
            <div style="font-family: var(--font-display); font-size: 14px; font-weight: 700; color: var(--text-primary);">${node.name}</div>
            <div style="font-size: 11px; color: var(--text-secondary);">Palier ${node.tierReq}+ • ⏱️ ${node.timeSec}s</div>
          </div>
        </div>

        <div style="font-size: 12px; color: var(--text-primary); margin: 8px 0; line-height: 1.4;">
          ${node.unlocks}
        </div>

        <div style="margin-top: auto; padding-top: 10px; border-top: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
          <div style="display: flex; gap: 4px; flex-wrap: wrap;">
            ${costBadges}
          </div>
          <button class="btn-${isResearched ? 'outline' : 'ficsit'} btn-toggle-mam-node" style="font-size: 11px; padding: 4px 10px; font-weight: 700;">
            ${isResearched ? 'Annuler' : 'Rechercher'}
          </button>
        </div>
      `;

      const btn = card.querySelector(".btn-toggle-mam-node");
      if (btn) {
        btn.addEventListener("click", () => {
          if (STATE.researchedMAMNodes.has(node.id)) {
            STATE.researchedMAMNodes.delete(node.id);
          } else {
            STATE.researchedMAMNodes.add(node.id);
          }
          saveState();
          renderMAMBranchChips();
          renderMAMTree();
        });
      }

      nodesContainer.appendChild(card);
    });
  }

  function initMAMPicker() {
    const pick1 = document.getElementById("mam-pick-1");
    const pick2 = document.getElementById("mam-pick-2");
    const pick3 = document.getElementById("mam-pick-3");
    const evalBtn = document.getElementById("btn-eval-hard-drive");
    const resultsContainer = document.getElementById("mam-picker-results");

    if (!pick1 || !pick2 || !pick3 || typeof MAM_DATA === 'undefined') return;

    if (pick1.children.length === 0) {
      const optionsHtml = MAM_DATA.alternateTierList.map(r => {
        return `<option value="${r.id}">[Tier ${r.tier}] ${r.name}</option>`;
      }).join("");

      pick1.innerHTML = `<option value="">-- Choisir 1ère Recette --</option>` + optionsHtml;
      pick2.innerHTML = `<option value="">-- Choisir 2ème Recette --</option>` + optionsHtml;
      pick3.innerHTML = `<option value="">-- Choisir 3ème Recette --</option>` + optionsHtml;

      // Valeurs par défaut
      if (pick1.options.length > 1) pick1.selectedIndex = 1;
      if (pick2.options.length > 2) pick2.selectedIndex = 2;
      if (pick3.options.length > 3) pick3.selectedIndex = 6;
    }

    if (evalBtn) {
      evalBtn.onclick = () => {
        const r1 = pick1.value;
        const r2 = pick2.value;
        const r3 = pick3.value;

        if (!r1 && !r2 && !r3) {
          showToast("Veuillez sélectionner au moins une recette alternative.");
          return;
        }

        const evaluation = SatisfactoryMAMEngine.evaluateHardDriveChoices(r1, r2, r3);
        renderPickerResults(evaluation);
      };
    }

    function renderPickerResults(ev) {
      if (!resultsContainer) return;
      let cardsHtml = "";

      ev.choices.forEach(ch => {
        const isRec = ev.winner && ev.winner.id === ch.id;
        const tierClass = `tier-${ch.tier.toLowerCase()}`;

        cardsHtml += `
          <div class="hard-drive-card ${isRec ? 'recommended' : ''}">
            ${isRec ? '<span class="matrix-card-winner-badge">🏆 Meilleur Choix FICSIT</span>' : ''}
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span class="tier-badge ${tierClass}">Rang ${ch.tier}</span>
              <span style="font-family: var(--font-display); font-size: 13px; font-weight: 700; color: var(--ficsit-orange);">${ch.score}/100</span>
            </div>
            <h4 style="font-family: var(--font-display); font-size: 15px; color: var(--text-primary); margin: 0 0 6px 0;">
              ${ch.name}
            </h4>
            <p style="font-size: 12px; color: var(--text-secondary); margin: 0 0 8px 0; line-height: 1.4;">
              ${ch.description}
            </p>
            <div style="background: var(--bg-card); padding: 8px 10px; border-radius: var(--radius-sm); font-size: 11.5px; color: var(--ficsit-cyan); margin-top: auto;">
              💡 <strong>Avantage :</strong> ${ch.advantage}
            </div>
            <button class="btn-${isRec ? 'ficsit' : 'outline'} btn-pick-alt-recipe" data-recipe="${ch.id}" style="margin-top: 12px; width: 100%; justify-content: center; font-size: 12px; font-weight: 700;">
              <span>⚡</span> Activer cette Recette
            </button>
          </div>
        `;
      });

      resultsContainer.innerHTML = `
        <div style="background: rgba(250, 149, 73, 0.1); border-left: 4px solid var(--ficsit-orange); padding: 12px 16px; border-radius: 0 var(--radius-sm) var(--radius-sm) 0; margin-bottom: 16px;">
          <div style="font-size: 14px; font-weight: 700; color: var(--ficsit-orange); font-family: var(--font-display);">
            📋 VERDICT FICSIT :
          </div>
          <div style="font-size: 13px; color: var(--text-primary); margin-top: 4px;">
            ${ev.recommendationSummary}
          </div>
        </div>

        <div class="hard-drive-picker-grid">
          ${cardsHtml}
        </div>
      `;

      resultsContainer.querySelectorAll(".btn-pick-alt-recipe").forEach(btn => {
        btn.addEventListener("click", () => {
          const recId = btn.getAttribute("data-recipe");
          STATE.unlockedAltRecipes.add(recId);
          saveState();
          showToast(`Recette débloquée enregistrée !`);
        });
      });
    }
  }

  function renderMAMTierList() {
    const container = document.getElementById("mam-tierlist-content");
    const searchInput = document.getElementById("mam-tier-search");
    if (!container || typeof MAM_DATA === 'undefined') return;

    const tierChips = document.querySelectorAll(".mam-tier-chip");
    tierChips.forEach(chip => {
      chip.onclick = () => {
        tierChips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        activeMAMTierFilter = chip.getAttribute("data-tier");
        renderMAMTierList();
      };
    });

    if (searchInput) {
      searchInput.oninput = () => {
        mamSearchQuery = searchInput.value;
        renderMAMTierList();
      };
    }

    const recipes = SatisfactoryMAMEngine.filterRecipes({
      tier: activeMAMTierFilter,
      search: mamSearchQuery
    });

    if (recipes.length === 0) {
      container.innerHTML = `<div style="color: var(--text-secondary); padding: 30px; text-align: center;">Aucune recette ne correspond à ces critères.</div>`;
      return;
    }

    let rowsHtml = "";
    recipes.forEach(r => {
      const tierClass = `tier-${r.tier.toLowerCase()}`;
      const isUnlocked = STATE.unlockedAltRecipes.has(r.id);

      rowsHtml += `
        <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 8px;">
          <div style="display: flex; align-items: center; gap: 12px; flex: 1; min-width: 260px;">
            <span class="tier-badge ${tierClass}" style="min-width: 45px;">${r.tier}</span>
            <div>
              <div style="font-family: var(--font-display); font-size: 14px; font-weight: 700; color: var(--text-primary);">${r.name}</div>
              <div style="font-size: 12px; color: var(--text-secondary); margin-top: 2px;">${r.advantage}</div>
            </div>
          </div>
          <div style="display: flex; gap: 8px; align-items: center;">
            <span style="font-size: 11px; background: var(--bg-surface-elevated); padding: 3px 8px; border-radius: 4px; color: var(--text-muted); font-family: var(--font-display);">Palier ${r.minTier}+</span>
            <button class="btn-${isUnlocked ? 'outline' : 'ficsit'} btn-toggle-alt-unlock" data-recipe="${r.id}" style="font-size: 11px; padding: 4px 10px; font-weight: 700;">
              ${isUnlocked ? '✔ Débloquée' : '🔒 Verrouillée'}
            </button>
          </div>
        </div>
      `;
    });

    container.innerHTML = rowsHtml;

    container.querySelectorAll(".btn-toggle-alt-unlock").forEach(btn => {
      btn.addEventListener("click", () => {
        const rId = btn.getAttribute("data-recipe");
        if (STATE.unlockedAltRecipes.has(rId)) {
          STATE.unlockedAltRecipes.delete(rId);
        } else {
          STATE.unlockedAltRecipes.add(rId);
        }
        saveState();
        renderMAMTierList();
      });
    });
  }

  // =========================================================================
  // MANUEL & DOCUMENTATION FICSIT 1.2 (README)
  // =========================================================================
  function initReadmeModal() {
    const modal = document.getElementById("readme-modal");
    const openBtn = document.getElementById("btn-open-readme-modal");
    const closeBtn = document.getElementById("btn-close-readme-modal");
    const doneBtn = document.getElementById("btn-readme-modal-done");
    const bodyContainer = document.getElementById("readme-modal-body");
    const rawContainer = document.getElementById("readme-raw-container");
    const rawTextElem = document.getElementById("readme-raw-text");
    const toggleViewBtn = document.getElementById("btn-toggle-readme-view");
    const searchInput = document.getElementById("readme-search-input");
    const copyBtn = document.getElementById("btn-copy-readme-text");
    const tocBtns = document.querySelectorAll(".readme-toc-btn");

    if (!modal) return;

    // Contenu markdown (injecté via bundle.js ou fallback)
    const markdownContent = (typeof window.FICSIT_README_MARKDOWN === "string" && window.FICSIT_README_MARKDOWN.trim()) 
      ? window.FICSIT_README_MARKDOWN 
      : "# 🏭 FICSIT Factory Companion — Satisfactory Dashboard\n\nCompagnon industriel 1.2 pour la planification et l'optimisation de vos usines.";

    let isRawView = false;

    function parseMarkdown(md) {
      if (!md) return "<p style='color: var(--text-secondary);'>Aucun contenu disponible.</p>";

      // 1. Sauvegarde et masquage des blocs de code
      const codeBlocks = [];
      let html = md.replace(/```([a-zA-Z0-9_-]*)\r?\n([\s\S]*?)```/g, (match, lang, code) => {
        const id = `___CODE_BLOCK_${codeBlocks.length}___`;
        const escaped = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        codeBlocks.push(`<pre><code class="language-${lang || 'text'}">${escaped}</code></pre>`);
        return id;
      });

      // 2. Headings avec IDs d'ancres
      html = html.replace(/^# (.*$)/gim, '<h1 id="readme-sec-intro">$1</h1>');
      html = html.replace(/^## (.*$)/gim, (match, title) => {
        let secId = "sec-" + title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        if (/module|fonctionnalit/i.test(title)) secId = "readme-sec-modules";
        else if (/blueprint/i.test(title)) secId = "readme-sec-blueprints";
        else if (/stack|architecture|structure/i.test(title)) secId = "readme-sec-stack";
        else if (/utilisation|démarrage|astuce|feuille/i.test(title)) secId = "readme-sec-tips";
        return `<h2 id="${secId}">${title}</h2>`;
      });
      html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
      html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');

      // 3. Callouts GitHub Alerts (> [!NOTE], > [!WARNING], > [!TIP], > [!IMPORTANT])
      html = html.replace(/> \[!NOTE\]\r?\n((?:> .*\r?\n?)*)/gim, (match, body) => {
        const clean = body.replace(/^> /gm, '').trim();
        return `<div class="ficsit-callout callout-note"><div class="ficsit-callout-title" style="color: var(--ficsit-cyan);">ℹ️ NOTE FICSIT</div><div>${clean}</div></div>`;
      });
      html = html.replace(/> \[!WARNING\]\r?\n((?:> .*\r?\n?)*)/gim, (match, body) => {
        const clean = body.replace(/^> /gm, '').trim();
        return `<div class="ficsit-callout callout-warn"><div class="ficsit-callout-title" style="color: var(--ficsit-amber);">⚠️ AVERTISSEMENT / EXPÉRIMENTAL</div><div>${clean}</div></div>`;
      });
      html = html.replace(/> \[!TIP\]\r?\n((?:> .*\r?\n?)*)/gim, (match, body) => {
        const clean = body.replace(/^> /gm, '').trim();
        return `<div class="ficsit-callout"><div class="ficsit-callout-title" style="color: var(--ficsit-blue);">💡 ASTUCE PIONNIER</div><div>${clean}</div></div>`;
      });
      html = html.replace(/> \[!IMPORTANT\]\r?\n((?:> .*\r?\n?)*)/gim, (match, body) => {
        const clean = body.replace(/^> /gm, '').trim();
        return `<div class="ficsit-callout callout-warn"><div class="ficsit-callout-title" style="color: var(--ficsit-orange);">⚡ IMPORTANT</div><div>${clean}</div></div>`;
      });

      // 4. Blockquotes standards
      html = html.replace(/^> (.*$)/gim, '<blockquote style="border-left: 3px solid var(--ficsit-orange); padding-left: 12px; margin: 10px 0; color: var(--text-secondary);">$1</blockquote>');

      // 5. Badges Shields [![...](...)]
      html = html.replace(/\[!\[(.*?)\]\((.*?)\)\]\((.*?)\)/gim, '<a href="$3" target="_blank" rel="noopener noreferrer" style="text-decoration:none; display:inline-block; margin: 2px;"><img src="$2" alt="$1" style="vertical-align: middle; border-radius: 3px;" /></a>');

      // 6. Tableaux Markdown
      html = html.replace(/^\|(.+)\|\r?\n^\|[-:| ]+\|\r?\n((?:^\|.+\|\r?\n?)+)/gm, (match, headerLine, rowsBlock) => {
        const headers = headerLine.split('|').filter(c => c.trim() !== '').map(c => `<th>${c.trim()}</th>`).join('');
        const rows = rowsBlock.trim().split(/\r?\n/).map(row => {
          const cells = row.split('|').filter(c => c.trim() !== '').map(c => `<td>${c.trim()}</td>`).join('');
          return `<tr>${cells}</tr>`;
        }).join('');
        return `<table class="readme-table"><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
      });

      // 7. Checklists et listes à puces
      html = html.replace(/^- \[x\] (.*$)/gim, '<li style="list-style:none;">✅ <span style="color: var(--ficsit-green); font-weight:600;">$1</span></li>');
      html = html.replace(/^- \[ \] (.*$)/gim, '<li style="list-style:none;">⏳ <span style="color: var(--text-secondary);">$1</span></li>');
      html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
      html = html.replace(/^- (.*$)/gim, '<li>$1</li>');

      // 8. Formatage Inline
      html = html.replace(/\*\*(.*?)\*\*/gim, '<strong style="color: var(--text-primary);">$1</strong>');
      html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
      html = html.replace(/`([^`]+)`/gim, '<code>$1</code>');
      html = html.replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: var(--ficsit-blue); text-decoration: underline;">$1</a>');
      html = html.replace(/^---$/gim, '<hr>');

      // 9. Restaurer les blocs de code
      codeBlocks.forEach((block, i) => {
        html = html.replace(`___CODE_BLOCK_${i}___`, block);
      });

      return html;
    }

    function initContent() {
      if (rawTextElem) rawTextElem.textContent = markdownContent;
      if (bodyContainer) bodyContainer.innerHTML = parseMarkdown(markdownContent);
    }

    initContent();

    // Ouverture du modal
    if (openBtn) {
      openBtn.addEventListener("click", () => {
        modal.style.display = "flex";
        if (searchInput) {
          searchInput.value = "";
          searchInput.focus();
        }
      });
    }

    // Fermeture du modal
    function closeModal() {
      modal.style.display = "none";
    }

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (doneBtn) doneBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.style.display === "flex") {
        closeModal();
      }
    });

    // Bascule vue Formattée / Markdown Brut
    if (toggleViewBtn) {
      toggleViewBtn.addEventListener("click", () => {
        isRawView = !isRawView;
        if (isRawView) {
          bodyContainer.style.display = "none";
          rawContainer.style.display = "block";
          toggleViewBtn.innerHTML = "📖 Mode Formatté";
          toggleViewBtn.style.color = "var(--ficsit-orange)";
        } else {
          bodyContainer.style.display = "block";
          rawContainer.style.display = "none";
          toggleViewBtn.innerHTML = "📄 Mode Markdown Brut";
          toggleViewBtn.style.color = "";
        }
      });
    }

    // Navigation par chapitres / Quick TOC
    tocBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const targetId = btn.getAttribute("data-target");
        if (isRawView) {
          isRawView = false;
          bodyContainer.style.display = "block";
          rawContainer.style.display = "none";
          if (toggleViewBtn) toggleViewBtn.innerHTML = "📄 Mode Markdown Brut";
        }
        const targetElem = document.getElementById(targetId);
        if (targetElem && bodyContainer) {
          bodyContainer.scrollTo({
            top: targetElem.offsetTop - 15,
            behavior: "smooth"
          });
        }
      });
    });

    // Recherche en direct
    if (searchInput && bodyContainer) {
      let searchTimeout;
      searchInput.addEventListener("input", (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          const query = e.target.value.trim().toLowerCase();
          if (!query) {
            bodyContainer.innerHTML = parseMarkdown(markdownContent);
            return;
          }

          const rawHtml = parseMarkdown(markdownContent);
          const temp = document.createElement("div");
          temp.innerHTML = rawHtml;

          const walker = document.createTreeWalker(temp, NodeFilter.SHOW_TEXT, null, false);
          const nodesToReplace = [];
          let node;
          while ((node = walker.nextNode())) {
            if (node.nodeValue.toLowerCase().includes(query) && node.parentNode.nodeName !== "CODE" && node.parentNode.nodeName !== "SCRIPT") {
              nodesToReplace.push(node);
            }
          }

          nodesToReplace.forEach(textNode => {
            const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
            const span = document.createElement("span");
            span.innerHTML = textNode.nodeValue.replace(regex, '<mark class="readme-highlight-match">$1</mark>');
            textNode.parentNode.replaceChild(span, textNode);
          });

          bodyContainer.innerHTML = temp.innerHTML;

          const firstMatch = bodyContainer.querySelector(".readme-highlight-match");
          if (firstMatch) {
            firstMatch.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 150);
      });
    }

    // Copier le Markdown brut
    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(markdownContent).then(() => {
          showToast("📋 Documentation README.md copiée dans le presse-papier !");
        }).catch(() => {
          showToast("❌ Impossible de copier le texte.");
        });
      });
    }
  }

  // =========================================================================
  // LOGIQUE DE RECHERCHE GLOBALE & ASSISTANT DE TERMINAL FICSIT
  // =========================================================================
  function initGlobalSearch() {
    const bubble = document.getElementById("ficsit-global-search-bubble");
    const modal = document.getElementById("ficsit-global-search-modal");
    const closeBtn = document.getElementById("btn-close-global-search");
    const searchInput = document.getElementById("global-search-input");
    const resultsArea = document.getElementById("global-search-results");

    if (!bubble || !modal || !searchInput || !resultsArea) return;

    let searchResults = [];
    let selectedIndex = -1;

    // --- Inject FICSIT Chat UI ---
    let chatArea = document.getElementById("ficsit-chat-response");
    if (!chatArea) {
      chatArea = document.createElement("div");
      chatArea.id = "ficsit-chat-response";
      chatArea.style.display = "none";
      chatArea.style.padding = "12px 16px";
      chatArea.style.margin = "0 20px 10px 20px";
      chatArea.style.backgroundColor = "rgba(250, 149, 73, 0.1)";
      chatArea.style.borderLeft = "4px solid var(--ficsit-orange)";
      chatArea.style.borderRadius = "4px";
      chatArea.style.color = "var(--text-main)";
      chatArea.style.fontFamily = "var(--font-main)";
      chatArea.style.fontSize = "14px";
      chatArea.style.lineHeight = "1.4";
      chatArea.innerHTML = `<strong>ADA :</strong> <span id="ficsit-chat-text"></span>`;
      
      resultsArea.parentNode.insertBefore(chatArea, resultsArea);
    }
    const chatText = document.getElementById("ficsit-chat-text");
    let chatTypingTimeout = null;
    // -----------------------------

    function openModal() {
      modal.style.display = "flex";
      searchInput.value = "";
      resultsArea.innerHTML = `<div class="ficsit-search-placeholder">Saisissez au moins 2 caractères pour lancer la recherche...</div>`;
      searchResults = [];
      selectedIndex = -1;
      if (chatArea) chatArea.style.display = "none";
      setTimeout(() => searchInput.focus(), 50);
    }

    function closeModal() {
      modal.style.display = "none";
    }

    // Toggle click events
    bubble.onclick = openModal;
    if (closeBtn) closeBtn.onclick = closeModal;

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      // Ctrl+K to open
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openModal();
      }
      // Escape to close
      if (e.key === "Escape" && modal.style.display === "flex") {
        closeModal();
      }
    });

    // Keyboard navigation within results
    searchInput.addEventListener("keydown", (e) => {
      const items = resultsArea.querySelectorAll(".ficsit-search-result-item");
      if (items.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % items.length;
        updateSelection(items);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        selectedIndex = (selectedIndex - 1 + items.length) % items.length;
        updateSelection(items);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
          executeResultAction(searchResults[selectedIndex]);
        }
      }
    });

    function updateSelection(items) {
      items.forEach((item, idx) => {
        if (idx === selectedIndex) {
          item.classList.add("selected");
          item.scrollIntoView({ block: "nearest" });
        } else {
          item.classList.remove("selected");
        }
      });
    }

    // Saisie utilisateur
    searchInput.addEventListener("input", () => {
      const q = searchInput.value.toLowerCase().trim();
      selectedIndex = -1;
      
      // Animation Thinking pendant la frappe
      if (typeof playAvatarAnimation === 'function') {
        playAvatarAnimation('thinking');
      }
      
      clearTimeout(chatTypingTimeout);

      if (q.length < 2) {
        resultsArea.innerHTML = `<div class="ficsit-search-placeholder">Saisissez au moins 2 caractères pour lancer la recherche...</div>`;
        searchResults = [];
        if (chatArea) chatArea.style.display = "none";
        return;
      }

      searchResults = performSearch(q);

      if (searchResults.length === 0) {
        resultsArea.innerHTML = `<div class="ficsit-search-placeholder">Aucun résultat trouvé pour "<strong>${q}</strong>".</div>`;
      } else {
        renderSearchResults(searchResults);
      }
      
      // --- FICSIT Chatbot Logic (Debounced) ---
      chatTypingTimeout = setTimeout(() => {
        evaluateFicsitChat(q, searchResults.length);
      }, 400);
    });

    function evaluateFicsitChat(query, resultCount) {
      if (!chatArea || !chatText) return;
      
      let response = "";
      let anim = "talking";
      const q = query.toLowerCase();
      
      // 1. IA Locale : Recettes
      const isRecipeQuery = q.includes("comment fabriquer") || q.includes("recette") || q.includes("comment faire") || q.includes("craft") || (q.includes("comment") && q.includes("obtenir"));
      if (isRecipeQuery) {
        let itemMatch = q.replace(/comment fabriquer|recettes de|recette de|recette d'|recette|comment faire|craft|comment obtenir/g, " ");
        // Synonymes courants pour aider l'IA
        itemMatch = itemMatch.replace(/\bbarre\b/g, "tige");
        
        itemMatch = itemMatch.replace(/\b(un|une|des|le|la|les|du|de|d)\b/g, " ").replace(/\s+/g, " ").trim();
        
        if (typeof RECIPES !== 'undefined' && itemMatch.length > 1) {
          const keywords = itemMatch.split(" ").filter(k => k.length > 1);
          const recipe = RECIPES.find(r => {
             const nameEn = r.name.toLowerCase();
             const nameFr = (r.products[0] && ITEM_NAMES[r.products[0].item] ? ITEM_NAMES[r.products[0].item].toLowerCase() : "");
             return keywords.length > 0 && keywords.every(kw => nameEn.includes(kw) || nameFr.includes(kw));
          });
          
          if (recipe) {
            const ingTexts = recipe.ingredients.map(ing => `${ing.amount}x ${ITEM_NAMES[ing.item] || ing.item}`).join(", ");
            const prodName = recipe.products[0] ? (ITEM_NAMES[recipe.products[0].item] || recipe.products[0].item) : recipe.name;
            const bldName = recipe.building ? (BUILDINGS[recipe.building]?.name || recipe.building) : 'Artisanat';
            response = `Pour fabriquer "${prodName}", il vous faut : ${ingTexts}. Assemblez cela dans : ${bldName}.`;
            anim = "thinking";
          }
        }
      }
      
      // 2. IA Locale : Bâtiments / Énergie
      const isPowerQuery = q.includes("énergie") || q.includes("consommation") || q.includes("puissance") || q.includes("mw");
      if (!response && isPowerQuery) {
        let bldMatch = q.replace(/énergie|consommation|puissance|mw|combien/g, " ");
        bldMatch = bldMatch.replace(/\b(un|une|des|le|la|les|du|de|d)\b/g, " ").replace(/\s+/g, " ").trim();
        if (typeof BUILDINGS !== 'undefined' && bldMatch.length > 1) {
          const keywords = bldMatch.split(" ").filter(k => k.length > 1);
          const bld = Object.values(BUILDINGS).find(b => {
             const nameFr = b.name.toLowerCase();
             return keywords.length > 0 && keywords.every(kw => nameFr.includes(kw));
          });
          if (bld) {
            response = `Le bâtiment "${bld.name}" consomme ${bld.powerMW} MW. Assurez-vous que votre réseau électrique peut le supporter.`;
            anim = "thinking";
          }
        }
      }
      
      // 3. IA Locale : Fallback et interactions basiques
      if (!response) {
        if (isRecipeQuery) {
          response = `Je n'ai pas trouvé de recette correspondant à votre demande. Vérifiez l'orthographe des matériaux.`;
          anim = "whatever";
        }
        else if (isPowerQuery) {
          response = `Bâtiment non reconnu dans mes archives d'énergie.`;
          anim = "whatever";
        }
        else if (q === "> danse" || q === "> dance") {
          response = "Protocole de divertissement non autorisé activé. Veuillez ne pas le dire aux RH.";
          anim = "dancing";
        } 
        else if (q.includes("pause") || q.includes("café") || q.includes("dormir") || q.includes("fatigue")) {
          response = "FICSIT vous rappelle que le sommeil est une perte de productivité. Retournez au travail.";
          anim = "whatever";
        }
        else if (q.includes("bonjour") || q.includes("salut") || q.includes("coucou")) {
          response = "Bonjour Pionnier. FICSIT Inc. espère que vous êtes prêt(e) à optimiser l'usine.";
          anim = "victory";
        }
        else if (q.includes("merci") || q.includes("bravo") || q.includes("super")) {
          response = "Votre approbation n'est pas requise. Seule l'efficacité compte.";
          anim = "victory";
        }
        else if (q.includes("aide")) {
          response = "Je suis votre assistant local FICSIT. Demandez-moi 'comment fabriquer [objet]' ou 'énergie de [bâtiment]'.";
          anim = "talking";
        }
        else if (resultCount === 0) {
          response = "Mes banques de données locales n'ont rien trouvé. Avez-vous mal épelé ce mot ou est-ce une distraction ?";
          anim = "whatever";
        } 
        else {
          response = `J'ai localisé ${resultCount} donnée(s) pertinente(s) ci-dessous. Consultez-les pour accroître la production.`;
          anim = "talking";
        }
      }
      
      chatText.textContent = response;
      chatArea.style.display = "block";
      
      if (typeof playAvatarAnimation === 'function') {
        playAvatarAnimation(anim);
      }
    }

    function performSearch(q) {
      const results = [];

      // 1. Recettes et Produits (Recipes & Items)
      if (typeof RECIPES !== 'undefined' && typeof ITEM_NAMES !== 'undefined') {
        RECIPES.forEach(recipe => {
          const isNameMatch = recipe.name.toLowerCase().includes(q);
          const hasMatchedIngredients = recipe.ingredients.some(ing => {
            const ingName = ITEM_NAMES[ing.item] || ing.item;
            return ingName.toLowerCase().includes(q);
          });
          const hasMatchedProducts = recipe.products.some(p => {
            const prodName = ITEM_NAMES[p.item] || p.item;
            return prodName.toLowerCase().includes(q);
          });

          if (isNameMatch || hasMatchedIngredients || hasMatchedProducts) {
            const mainProduct = recipe.products[0]?.item || "smart_plating";
            results.push({
              category: "Calculateur",
              badgeClass: "badge-recipe",
              title: recipe.name,
              subtitle: `${recipe.isAlt ? 'Recette Alternative' : 'Recette Standard'} • Fabriqué dans : ${recipe.building ? (BUILDINGS[recipe.building]?.name || recipe.building) : 'Artisanat'}`,
              icon: "🔩",
              action: () => {
                switchTab("calculator");
                const select = document.getElementById("calc-item-select");
                if (select) {
                  select.value = mainProduct;
                  select.dispatchEvent(new Event("change"));
                }
              }
            });
          }
        });
      }

      // 2. Bâtiments (Buildings)
      if (typeof BUILDINGS !== 'undefined') {
        Object.entries(BUILDINGS).forEach(([bId, building]) => {
          if (building.name.toLowerCase().includes(q)) {
            results.push({
              category: "Bâtiment",
              badgeClass: "badge-building",
              title: building.name,
              subtitle: `Énergie : ${building.powerMW} MW • Catégorie : ${building.category}`,
              icon: building.icon || "🏭",
              action: () => {
                switchTab("checklist");
                checklistSearchQuery = building.name;
                const chkSearchInput = document.getElementById("checklist-search-input");
                if (chkSearchInput) chkSearchInput.value = building.name;
                renderChecklist();
              }
            });
          }
        });
      }

      // 3. Carte, Ressources & Biomes
      if (typeof RESOURCE_TYPES !== 'undefined') {
        Object.entries(RESOURCE_TYPES).forEach(([resId, resType]) => {
          if (resType.name.toLowerCase().includes(q)) {
            results.push({
              category: "Carte (Gisements)",
              badgeClass: "badge-map",
              title: `Gisements : ${resType.name}`,
              subtitle: `${resType.total} gisements répartis sur le monde (Pure : ${resType.pure})`,
              icon: resType.icon || "🗺️",
              action: () => {
                switchTab("map");
                const chip = document.querySelector(`.resource-chip[data-res="${resId}"]`);
                if (chip) {
                  document.querySelectorAll(".resource-chip").forEach(c => c.classList.remove("active"));
                  chip.classList.add("active");
                  const mapSearch = document.getElementById("map-search-input");
                  if (mapSearch) mapSearch.value = "";
                  if (mapEngineInstance) {
                    mapEngineInstance.setFilters({
                      types: new Set([resId]),
                      purities: new Set(),
                      search: ""
                    });
                  }
                }
              }
            });
          }
        });
      }

      if (typeof BIOMES !== 'undefined') {
        BIOMES.forEach(biome => {
          if (biome.name.toLowerCase().includes(q) || (biome.desc && biome.desc.toLowerCase().includes(q))) {
            results.push({
              category: "Carte (Biome)",
              badgeClass: "badge-biome",
              title: biome.name,
              subtitle: biome.desc,
              icon: "🏞️",
              action: () => {
                switchTab("map");
                const select = document.getElementById("map-biome-select");
                if (select) {
                  select.value = biome.id;
                  select.dispatchEvent(new Event("change"));
                }
              }
            });
          }
        });
      }

      // 4. Jalons du HUB & Ascenseur Spatial
      if (typeof MILESTONES_DATA !== 'undefined') {
        MILESTONES_DATA.tiers.forEach(t => {
          t.milestones.forEach(m => {
            const unlocksMatch = m.unlockedItems && m.unlockedItems.some(item => item.toLowerCase().includes(q));
            if (m.name.toLowerCase().includes(q) || unlocksMatch) {
              results.push({
                category: "Jalon du HUB",
                badgeClass: "badge-milestone",
                title: m.name,
                subtitle: `${t.name} • Débloque : ${m.unlockedItems ? m.unlockedItems.join(', ') : 'Technologies'}`,
                icon: "📋",
                action: () => {
                  switchTab("milestones");
                  const targetBlock = document.getElementById(`tier-block-${t.tier}`);
                  if (targetBlock) {
                    targetBlock.classList.add("open");
                    setTimeout(() => {
                      targetBlock.scrollIntoView({ behavior: "smooth", block: "start" });
                      targetBlock.style.borderColor = "var(--ficsit-orange)";
                      setTimeout(() => targetBlock.style.borderColor = "", 2000);
                    }, 100);
                  }
                }
              });
            }
          });
        });

        MILESTONES_DATA.phases.forEach(p => {
          if (p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)) {
            results.push({
              category: "Ascenseur Spatial",
              badgeClass: "badge-phase",
              title: p.name,
              subtitle: p.description,
              icon: "🚀",
              action: () => {
                switchTab("phases");
              }
            });
          }
        });
      }

      // 5. Recherche MAM
      if (typeof MAM_DATA !== 'undefined') {
        Object.entries(MAM_DATA.trees).forEach(([treeId, tree]) => {
          if (tree.name.toLowerCase().includes(q) || tree.description.toLowerCase().includes(q)) {
            results.push({
              category: "Arbre MAM",
              badgeClass: "badge-mam",
              title: `Arbre : ${tree.name}`,
              subtitle: tree.description,
              icon: tree.icon || "🔬",
              action: () => {
                switchTab("mam");
                const treesBtn = document.querySelector('[data-mam-subtab="trees"]');
                if (treesBtn) treesBtn.click();
                activeMAMBranch = treeId;
                renderMAMBranchChips();
                renderMAMTree();
              }
            });
          }

          tree.nodes.forEach(node => {
            const unlocksMatch = node.unlocks && node.unlocks.toLowerCase().includes(q);
            if (node.name.toLowerCase().includes(q) || unlocksMatch) {
              results.push({
                category: "Recherche MAM",
                badgeClass: "badge-mam-node",
                title: node.name,
                subtitle: `Arbre : ${tree.name} • Débloque : ${node.unlocks || 'Technologie'}`,
                icon: node.icon || "🔬",
                action: () => {
                  switchTab("mam");
                  const treesBtn = document.querySelector('[data-mam-subtab="trees"]');
                  if (treesBtn) treesBtn.click();
                  activeMAMBranch = treeId;
                  renderMAMBranchChips();
                  renderMAMTree();
                }
              });
            }
          });
        });
      }

      return results.slice(0, 15);
    }

    function renderSearchResults(results) {
      resultsArea.innerHTML = results.map((r, idx) => {
        return `
          <div class="ficsit-search-result-item" data-index="${idx}">
            <div class="ficsit-search-result-icon">${r.icon}</div>
            <div class="ficsit-search-result-content">
              <div class="ficsit-search-result-title">
                ${r.title}
                <span class="ficsit-search-badge ${r.badgeClass}">${r.category}</span>
              </div>
              <div class="ficsit-search-result-subtitle">${r.subtitle}</div>
            </div>
          </div>
        `;
      }).join("");

      // Add click event listeners
      resultsArea.querySelectorAll(".ficsit-search-result-item").forEach(item => {
        item.addEventListener("click", () => {
          const idx = parseInt(item.getAttribute("data-index"), 10);
          if (idx >= 0 && idx < searchResults.length) {
            executeResultAction(searchResults[idx]);
          }
        });
      });
    }

    function executeResultAction(result) {
      if (typeof result.action === "function") {
        result.action();
      }
      closeModal();
      showToast(`🧭 Navigation : ${result.title}`);
    }
  }

  // =========================================================================
  // DÉMARRAGE & INITIALISATION DE L'APPLICATION
  // =========================================================================
  initThemeSelector();
  initNavigation();
  initSaveUploader();
  initReadmeModal();
  renderMilestones();
  renderPhases();
  initMAMUI();
  renderSyntheticView();
  initCalculatorUI();
  initMilestoneCalculatorUI();
  initPowerCalculatorUI();
  initLogisticsUI();
  renderBlueprints();
  renderChecklist();
  initPrintModal();
  initInteractiveMap();
  DisplayPreferencesManager.init();
  initGlobalSearch();
  updateHUDStats();
});



