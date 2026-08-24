import re

with open('c:/IA/Projets/Satisfactory-Dashboard/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

target = '''// REMOVED_FEATURE:     const pingBtn = document.getElementById('btn-radar-ping');
    if (pingBtn) {
      pingBtn.onclick = () => {
// REMOVED_FEATURE:         addTelexMessage([] RADAR: Balayage haute fréquence déclenché. 7 balises actualisées., 'warn');
// REMOVED_FEATURE:         if (radarBlips) {
// REMOVED_FEATURE:           radarBlips.forEach(b => b.pulse = 15);
        }
      };
    }'''

replacement = '''// REMOVED_FEATURE:     const pingBtn = document.getElementById('btn-radar-ping');
// REMOVED_FEATURE:     if (pingBtn) {
// REMOVED_FEATURE:       pingBtn.onclick = () => {
// REMOVED_FEATURE:         addTelexMessage([] RADAR: Balayage haute fréquence déclenché. 7 balises actualisées., 'warn');
// REMOVED_FEATURE:         if (radarBlips) {
// REMOVED_FEATURE:           radarBlips.forEach(b => b.pulse = 15);
// REMOVED_FEATURE:         }
// REMOVED_FEATURE:       };
// REMOVED_FEATURE:     }'''

if target in content:
    content = content.replace(target, replacement)
    with open('c:/IA/Projets/Satisfactory-Dashboard/index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print('Replaced pingBtn block successfully')
else:
    print('Target not found')
