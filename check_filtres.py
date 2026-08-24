with open('c:/IA/Projets/Satisfactory-Dashboard/index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if '<!-- Filtres de Ressources -->' in line:
        start = i - 15
        end = i + 5
        break

for i in range(start, end):
    clean_line = lines[i].encode('ascii', 'ignore').decode('ascii').strip()
    print(f"{i}: {clean_line}")
