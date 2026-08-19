// Moteur logique du M.A.M. & Analyseur de Disques Durs pour Satisfactory 1.2
// Évaluation algorithmique des tirages, gestion de progression et filtres de tier-list

class SatisfactoryMAMEngine {

  /**
   * Retourne la liste des 9 arbres du MAM
   */
  static getTrees() {
    return MAM_DATA.trees;
  }

  /**
   * Calcule le taux de complétion d'un arbre donné
   */
  static getTreeProgress(treeId, researchedSet = new Set()) {
    const tree = MAM_DATA.trees[treeId];
    if (!tree) return { total: 0, completed: 0, pct: 0, pendingCosts: {} };

    let completed = 0;
    const pendingCosts = {};

    tree.nodes.forEach(node => {
      const isResearched = researchedSet.has(node.id);
      if (isResearched) {
        completed++;
      } else {
        // Cumul des coûts restants
        if (node.cost) {
          Object.entries(node.cost).forEach(([item, qty]) => {
            pendingCosts[item] = (pendingCosts[item] || 0) + qty;
          });
        }
      }
    });

    const total = tree.nodes.length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      pct,
      pendingCosts
    };
  }

  /**
   * Calcule le taux de progression global du MAM (toutes branches confondues)
   */
  static getOverallProgress(researchedSet = new Set()) {
    let total = 0;
    let completed = 0;

    Object.keys(MAM_DATA.trees).forEach(treeId => {
      const res = this.getTreeProgress(treeId, researchedSet);
      total += res.total;
      completed += res.completed;
    });

    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pct };
  }

  /**
   * Évalue et classe 3 propositions de recettes alternatives lors d'un scan de Disque Dur
   * @param {string} r1Id 
   * @param {string} r2Id 
   * @param {string} r3Id 
   * @param {number} currentTier 
   */
  static evaluateHardDriveChoices(r1Id, r2Id, r3Id, currentTier = 5) {
    const ids = [r1Id, r2Id, r3Id].filter(Boolean);
    const evaluated = [];

    ids.forEach(id => {
      let meta = MAM_DATA.alternateTierList.find(r => r.id === id);
      if (!meta) {
        // Fallback si la recette est dans RECIPES mais pas annotée tier
        meta = {
          id,
          name: id.replace("recipe_alt_", "").replace(/_/g, " "),
          tier: "B",
          advantage: "Recette alternative standard 1.2.",
          tags: []
        };
      }

      let score = 50;
      if (meta.tier === "S") score = 95;
      else if (meta.tier === "A") score = 80;
      else if (meta.tier === "B") score = 65;
      else if (meta.tier === "C") score = 45;
      else score = 30;

      // Bonus de synergie selon le palier du joueur
      if (meta.minTier && meta.minTier <= currentTier) {
        score += 5;
      }

      evaluated.push({
        id: meta.id,
        name: meta.name,
        tier: meta.tier,
        score,
        description: meta.description || "",
        advantage: meta.advantage || "",
        tags: meta.tags || []
      });
    });

    // Tri par score décroissant
    evaluated.sort((a, b) => b.score - a.score);

    const winner = evaluated[0] || null;

    return {
      winner,
      choices: evaluated,
      recommendationSummary: winner ? `FICSIT recommande fortement de choisir : ${winner.name} (Rang ${winner.tier}). ${winner.advantage}` : "Sélectionnez au moins une recette alternative."
    };
  }

  /**
   * Filtre et recherche dans la base des recettes alternatives
   */
  static filterRecipes(options = {}) {
    const { category, tier, tag, search } = options;
    let list = [...MAM_DATA.alternateTierList];

    if (category && category !== "all") {
      list = list.filter(r => r.category === category);
    }

    if (tier && tier !== "all") {
      list = list.filter(r => r.tier === tier);
    }

    if (tag && tag !== "all") {
      list = list.filter(r => r.tags && r.tags.includes(tag));
    }

    if (search) {
      const q = search.toLowerCase().trim();
      list = list.filter(r => r.name.toLowerCase().includes(q) || r.advantage.toLowerCase().includes(q) || (r.description && r.description.toLowerCase().includes(q)));
    }

    return list;
  }
}
