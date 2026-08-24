from bs4 import BeautifulSoup
import re

with open('c:/IA/Projets/Satisfactory-Dashboard/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Only parse the body to avoid script errors
body_start = html.find('<body>')
body_end = html.find('</body>')
body_html = html[body_start:body_end+7]

soup = BeautifulSoup(body_html, 'html.parser')
layout = soup.find('div', class_='map-view-layout')
if layout:
    children = [child for child in layout.children if child.name is not None]
    print(f"Number of element children in map-view-layout: {len(children)}")
    for i, child in enumerate(children):
        classes = child.get('class', [])
        print(f"Child {i+1}: {child.name} class={classes}")
else:
    print("map-view-layout not found")
