const fs = require('fs');
const content = fs.readFileSync('c:/IA/Projets/Satisfactory-Dashboard/index.html', 'utf-8');
const scripts = content.match(/<script\b[^>]*>([\s\S]*?)<\/script>/gi);
const scriptContent = scripts[scripts.length - 1].replace(/<script\b[^>]*>/i, '').replace(/<\/script>/i, '');
fs.writeFileSync('c:/IA/Projets/Satisfactory-Dashboard/scratch/inline.js', scriptContent, 'utf-8');
console.log('Saved to scratch/inline.js');
