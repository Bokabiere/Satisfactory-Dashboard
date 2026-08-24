with open('c:/IA/Projets/Satisfactory-Dashboard/index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

in_layout = False
depth = 0
layout_children = 0

for line in lines:
    if '<div class="map-view-layout">' in line:
        in_layout = True
        depth = 1
        print("Found map-view-layout")
        continue
    
    if in_layout:
        # count <div and </div
        # note: this is a very basic count, might be flawed if multiple divs on same line
        div_opens = line.count('<div')
        div_closes = line.count('</div')
        
        if depth == 1 and div_opens > 0:
            layout_children += div_opens
            print(f"Child found at depth 1: {line.strip()}")
            
        depth += div_opens
        depth -= div_closes
        
        if depth == 0:
            print(f"map-view-layout closed. Total children: {layout_children}")
            break
