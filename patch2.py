import re

def patch_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    old_snippet = r'itemMatch = itemMatch.replace(/\b(un|une|des|le|la|les|du|de|d)\b/g, " ").replace(/\s+/g, " ").trim();'
    new_snippet = r"""// Synonymes courants pour aider l'IA
        itemMatch = itemMatch.replace(/\bbarre\b/g, "tige");
        
        itemMatch = itemMatch.replace(/\b(un|une|des|le|la|les|du|de|d)\b/g, " ").replace(/\s+/g, " ").trim();"""

    if old_snippet in content:
        content = content.replace(old_snippet, new_snippet)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Patched {filepath}')
    else:
        # Try regex if exact match fails
        pattern = re.compile(r'itemMatch = itemMatch\.replace\(/\\b\(un\|une\|des\|le\|la\|les\|du\|de\|d\)\\b/g, " "\)\.replace\(/\\s\+/g, " "\)\.trim\(\);')
        if pattern.search(content):
            content = pattern.sub(lambda m: new_snippet, content)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f'Patched with regex {filepath}')
        else:
            print(f'Could not find snippet in {filepath}')

patch_file('index.html')
patch_file('satisfactory_dashboard.html')
patch_file('js/app.js')
