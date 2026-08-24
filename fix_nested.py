with open('c:/IA/Projets/Satisfactory-Dashboard/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('/* REMOVED_FEATURE: /* Radar Canvas */ */', '/* REMOVED_FEATURE: Radar Canvas */')

with open('c:/IA/Projets/Satisfactory-Dashboard/index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('Fixed last nested comment')
