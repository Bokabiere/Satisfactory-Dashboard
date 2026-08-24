with open('c:/IA/Projets/Satisfactory-Dashboard/index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(36789, 36886):
    if not lines[i].strip().startswith('//'):
        lines[i] = '// ' + lines[i]

with open('c:/IA/Projets/Satisfactory-Dashboard/index.html', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print('Lines commented successfully')
