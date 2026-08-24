import re

with open('c:/IA/Projets/Satisfactory-Dashboard/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

replacement = '''// REMOVED_FEATURE:       { r: 45, angle: 0.8, type: 'iron', name: 'Fer Pur', pulse: 0 },
// REMOVED_FEATURE:       { r: 90, angle: 2.1, type: 'copper', name: 'Cuivre Normal', pulse: 0 },
// REMOVED_FEATURE:       { r: 120, angle: 3.7, type: 'coal', name: 'Charbon Pur', pulse: 0 },
// REMOVED_FEATURE:       { r: 75, angle: 5.2, type: 'caterium', name: 'Caterium Pur', pulse: 0 },
// REMOVED_FEATURE:       { r: 140, angle: 1.4, type: 'oil', name: 'Pétrole Brut', pulse: 0 },
// REMOVED_FEATURE:       { r: 160, angle: 4.5, type: 'uranium', name: 'Uranium Impur', pulse: 0 },
// REMOVED_FEATURE:       { r: 30, angle: 6.0, type: 'bauxite', name: 'Bauxite Pure', pulse: 0 }
// REMOVED_FEATURE:     ];'''

target_regex = re.compile(r'\{\s*r:\s*45,[^\]]+\];', re.DOTALL)

if target_regex.search(content):
    content = target_regex.sub(replacement, content)
    with open('c:/IA/Projets/Satisfactory-Dashboard/index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print('Replaced successfully')
else:
    print('Target not found')
