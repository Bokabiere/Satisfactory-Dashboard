with open('c:/IA/Projets/Satisfactory-Dashboard/index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if '<div class="map-sidebar">' in line:
        start = i
        break

opens = 0
closes = 0
for i in range(start, start + 60):
    line = lines[i]
    opens += line.count('<div')
    closes += line.count('</div')
    if opens == closes and opens > 0:
        print(f"map-sidebar closed at line {i}")
        break
