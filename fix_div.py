with open('c:/IA/Projets/Satisfactory-Dashboard/index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(5815, 5825):
    if "<!-- Rempli dynamiquement -->" in lines[i]:
        # line i+1 should be </div>
        if "</div>" in lines[i+1]:
            lines[i+1] = "<!-- " + lines[i+1].strip() + " -->\n"
            print("Commented out </div> for radar-summary-list")

with open('c:/IA/Projets/Satisfactory-Dashboard/index.html', 'w', encoding='utf-8') as f:
    f.writelines(lines)
