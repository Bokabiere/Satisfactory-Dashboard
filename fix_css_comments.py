import re

with open('c:/IA/Projets/Satisfactory-Dashboard/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r'/\*\s*/\*\s*// REMOVED_FEATURE:\s*(.*?)\s*\*/\s*\*/', r'/* REMOVED_FEATURE: \1 */', content)
content = re.sub(r'/\*\s*// REMOVED_FEATURE:\s*(.*?)\s*\*/', r'/* REMOVED_FEATURE: \1 */', content)

with open('c:/IA/Projets/Satisfactory-Dashboard/index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('Cleaned up nested CSS comments')
