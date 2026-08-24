with open('c:/IA/Projets/Satisfactory-Dashboard/index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(5725, 5730):
    if "</button>" in lines[i] and "Radar Zone" in lines[i-1]:
        lines[i] = "<!-- " + lines[i].strip() + " -->\n"
        print("Commented out </button> for Radar Zone")

with open('c:/IA/Projets/Satisfactory-Dashboard/index.html', 'w', encoding='utf-8') as f:
    f.writelines(lines)
