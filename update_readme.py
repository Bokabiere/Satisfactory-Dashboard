import codecs

with open('README.md', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace the heading
find_text = '## ✨ Fonctionnalités Principales'
replace_text = '''## ✨ Fonctionnalités Principales

### 🤖 **NOUVEAU** : Assistant IA FICSIT (Avatar Interactif)
* **Chatbot Local Intégré** : Posez des questions en langage naturel (ex: "comment fabriquer une tige de fer").
* **Détection Sémantique** : L'IA analyse votre requête, gère les synonymes (ex: "barre" -> "tige") et interroge la base de données du jeu instantanément.
* **Animations de l'Avatar** : L'assistant réagit dynamiquement à vos requêtes directement dans l'interface de Synthèse Industrielle.'''
text = text.replace(find_text, replace_text)

# Update roadmap
find_roadmap = '- [x] Synchroniseur et importateur de sauvegardes `.SAV` Satisfactory.'
replace_roadmap = '- [x] Synchroniseur et importateur de sauvegardes `.SAV` Satisfactory.\n- [x] Assistant IA Local FICSIT (Requêtes de recettes, Énergie, Animations).'
text = text.replace(find_roadmap, replace_roadmap)

with open('README.md', 'w', encoding='utf-8') as f:
    f.write(text)
    
print("Updated!")
