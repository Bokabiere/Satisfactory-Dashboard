# Nom du Skill : Context Mapper
# Description : Génère, met à jour et lit la cartographie du projet pour cibler les interventions et économiser les tokens.

## Déclencheurs :
- Au début d'une nouvelle session de débogage ou d'ajout de fonctionnalité.
- Si on te demande d'analyser l'architecture du projet.

## Instructions strictes :
1. Vérifie la présence du fichier PROJECT_CONTEXT.md à la racine du projet.
2. Si le fichier n'existe pas ou semble dater de plus de quelques jours, exécute immédiatement le script .agents/skills/repo_mapper/generate_context.sh.
3. Avant d'utiliser des commandes comme grep, ind, ou d'ouvrir de multiples fichiers à l'aveugle, lis d'abord le contenu de PROJECT_CONTEXT.md.
4. Utilise les informations de ce fichier pour identifier directement les 2 ou 3 fichiers spécifiques qui nécessitent d'être modifiés.
5. Après chaque modification de code, tu dois me demander avec validation pour lancer les tests locaux du projet. Si les tests réussissent, affiche uniquement le mot **SUCCÈS**. Si les tests échouent, analyse uniquement les lignes d'erreur pour corriger le problème.
