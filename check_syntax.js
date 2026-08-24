const fs = require('fs');
const content = fs.readFileSync('c:/IA/Projets/Satisfactory-Dashboard/index.html', 'utf-8');
const scripts = content.match(/<script\b[^>]*>([\s\S]*?)<\/script>/gi);
let hasError = false;
scripts.forEach((scriptTag, index) => {
  const scriptContent = scriptTag.replace(/<script\b[^>]*>/i, '').replace(/<\/script>/i, '');
  if (!scriptContent.trim() || scriptTag.includes('src=')) return;
  
  try {
    new Function(scriptContent);
  } catch (e) {
    console.error('Syntax error in script tag ' + index + ':', e.message);
    hasError = true;
  }
});
if (!hasError) console.log('No syntax errors found in inline scripts');
