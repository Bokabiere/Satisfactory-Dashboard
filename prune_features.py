import re, os

root = 'c:/IA/Projets/Satisfactory-Dashboard'

# Patterns to remove (case-insensitive)
patterns = [
    r'Télémétrie Énergétique & Production',
    r'Energy Telemetry',
    r'Telemetry',
    r'Radar Tactique Canvas 2D',
    r'Radar',
    r'Holo-Inspecteur 3D à Vue Éclatée',
    r'Holo-Inspecteur',
    r'ghostHologram',
    r'ghost hologram',
]

regex = re.compile('|'.join(patterns), re.IGNORECASE)

# Files to process
for dirpath, dirnames, filenames in os.walk(root):
    for fn in filenames:
        if fn.endswith(('.js', '.md', '.html', '.css')):
            path = os.path.join(dirpath, fn)
            with open(path, 'r', encoding='utf-8', errors='ignore') as f:
                lines = f.readlines()
            new_lines = []
            changed = False
            for line in lines:
                if regex.search(line):
                    # Comment out the line to keep file structure
                    new_lines.append('// REMOVED_FEATURE: ' + line)
                    changed = True
                else:
                    new_lines.append(line)
            if changed:
                with open(path, 'w', encoding='utf-8') as f:
                    f.writelines(new_lines)
                print(f'Processed {path}')

print('Feature pruning complete.')
