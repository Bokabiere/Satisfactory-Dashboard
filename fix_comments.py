with open('c:/IA/Projets/Satisfactory-Dashboard/index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

in_style = False
in_script = False

for i in range(len(lines)):
    line = lines[i]
    if '<style>' in line:
        in_style = True
    if '</style>' in line:
        in_style = False
        
    if '<script' in line:
        in_script = True
    if '</script>' in line:
        in_script = False
    
    if '// REMOVED_FEATURE:' in line:
        if in_style:
            lines[i] = '/* ' + line.strip() + ' */\n'
        elif not in_script and not in_style:
            lines[i] = '<!-- ' + line.strip() + ' -->\n'

with open('c:/IA/Projets/Satisfactory-Dashboard/index.html', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('Fixed HTML and CSS comments correctly!')
