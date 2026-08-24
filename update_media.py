with open('c:/IA/Projets/Satisfactory-Dashboard/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('@media (max-width: 1100px) {\n    .map-view-layout {\n      grid-template-columns: 1fr;\n    }\n  }', '@media (max-width: 768px) {\n    .map-view-layout {\n      grid-template-columns: 1fr;\n    }\n  }')

with open('c:/IA/Projets/Satisfactory-Dashboard/index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('Media query updated')
