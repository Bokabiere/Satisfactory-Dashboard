import re

new_code = """    function evaluateFicsitChat(query, resultCount) {
      if (!chatArea || !chatText) return;
      
      let response = "";
      let anim = "talking";
      const q = query.toLowerCase();
      
      // 1. IA Locale : Recettes
      const isRecipeQuery = q.includes("comment fabriquer") || q.includes("recette") || q.includes("comment faire") || q.includes("craft") || (q.includes("comment") && q.includes("obtenir"));
      if (isRecipeQuery) {
        let itemMatch = q.replace(/comment fabriquer|recettes de|recette de|recette d'|recette|comment faire|craft|comment obtenir/g, " ");
        itemMatch = itemMatch.replace(/\\b(un|une|des|le|la|les|du|de|d)\\b/g, " ").replace(/\\s+/g, " ").trim();
        
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
        bldMatch = bldMatch.replace(/\\b(un|une|des|le|la|les|du|de|d)\\b/g, " ").replace(/\\s+/g, " ").trim();
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
    }"""

def patch_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    pattern = re.compile(r'    function evaluateFicsitChat\(query, resultCount\) \{.*?      if \(typeof playAvatarAnimation === \'function\'\) \{\n        playAvatarAnimation\(anim\);\n      \}\n    \}', re.DOTALL)
    
    if pattern.search(content):
        content = pattern.sub(lambda m: new_code, content)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Patched {filepath}')
    else:
        print(f'Could not find evaluateFicsitChat in {filepath}')

patch_file('index.html')
patch_file('satisfactory_dashboard.html')
