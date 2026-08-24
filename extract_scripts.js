const fs = require('fs');
const content = fs.readFileSync('c:/IA/Projets/Satisfactory-Dashboard/index.html', 'utf-8');
const scripts = content.match(/<script\b[^>]*>([\s\S]*?)<\/script>/gi);
scripts.forEach((scriptTag, index) => {
  const scriptContent = scriptTag.replace(/<script\b[^>]*>/i, '').replace(/<\/script>/i, '');
  if (!scriptContent.trim() || scriptTag.includes('src=')) return;
  fs.writeFileSync('c:/IA/Projets/Satisfactory-Dashboard/scratch/script_' + index + '.js', scriptContent, 'utf-8');
});
console.log('Scripts extracted');
