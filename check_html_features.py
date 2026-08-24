with open('c:/IA/Projets/Satisfactory-Dashboard/index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(6157, 30000):  # rough bounds for HTML body before main scripts
    line = lines[i]
    if '// REMOVED_FEATURE:' in line:
        if '<!--' not in line and '/*' not in line:
            print(f"{i}: {line.strip()}")
