with open('c:/IA/Projets/Satisfactory-Dashboard/index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

if not lines[36787].strip().startswith('//'):
    lines[36787] = '// ' + lines[36787]

with open('c:/IA/Projets/Satisfactory-Dashboard/index.html', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print('Line 36788 commented successfully')
