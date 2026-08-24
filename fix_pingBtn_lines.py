with open('c:/IA/Projets/Satisfactory-Dashboard/index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "if (pingBtn) {" in line:
        start_idx = i
        break

for i in range(start_idx, start_idx + 8):
    if not lines[i].strip().startswith('//'):
        lines[i] = '// ' + lines[i]

with open('c:/IA/Projets/Satisfactory-Dashboard/index.html', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('Fixed pingBtn block by lines')
