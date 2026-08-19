const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
let html = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf8');
const css = fs.readFileSync(path.join(baseDir, 'styles.css'), 'utf8');

const buildingsJs = fs.readFileSync(path.join(baseDir, 'js', 'data', 'buildings.js'), 'utf8');
const recipesJs = fs.readFileSync(path.join(baseDir, 'js', 'data', 'recipes.js'), 'utf8');
const milestonesJs = fs.readFileSync(path.join(baseDir, 'js', 'data', 'milestones.js'), 'utf8');
const blueprintsJs = fs.readFileSync(path.join(baseDir, 'js', 'data', 'blueprints.js'), 'utf8');
const nodesJs = fs.readFileSync(path.join(baseDir, 'js', 'data', 'nodes.js'), 'utf8');
const mapTexturesJs = fs.readFileSync(path.join(baseDir, 'js', 'data', 'mapTextures.js'), 'utf8');
const buildingTexturesJs = fs.readFileSync(path.join(baseDir, 'js', 'data', 'buildingTextures.js'), 'utf8');
const calcJs = fs.readFileSync(path.join(baseDir, 'js', 'engine', 'calculator.js'), 'utf8');
const saveJs = fs.readFileSync(path.join(baseDir, 'js', 'engine', 'saveParser.js'), 'utf8');
const mapEngineJs = fs.readFileSync(path.join(baseDir, 'js', 'engine', 'mapEngine.js'), 'utf8');
const factory3DJs = fs.readFileSync(path.join(baseDir, 'js', 'engine', 'factoryViewer3D.js'), 'utf8');
const blueprintGenJs = fs.readFileSync(path.join(baseDir, 'js', 'engine', 'blueprintGenerator.js'), 'utf8');
const appJs = fs.readFileSync(path.join(baseDir, 'js', 'app.js'), 'utf8');

// Replace CSS
if (html.includes('<link rel="stylesheet" href="styles.css">')) {
  html = html.replace('<link rel="stylesheet" href="styles.css">', '<style>\n' + css + '\n</style>');
} else if (html.includes('<style>')) {
  html = html.replace(/<style>[\s\S]*?<\/style>/, '<style>\n' + css + '\n</style>');
}

// Replace scripts
const bundleScript = '<script>\n' + 
  buildingsJs + '\n\n' +
  recipesJs + '\n\n' +
  milestonesJs + '\n\n' +
  blueprintsJs + '\n\n' +
  nodesJs + '\n\n' +
  mapTexturesJs + '\n\n' +
  buildingTexturesJs + '\n\n' +
  calcJs + '\n\n' +
  saveJs + '\n\n' +
  mapEngineJs + '\n\n' +
  factory3DJs + '\n\n' +
  blueprintGenJs + '\n\n' +
  appJs + '\n' +
'</script>';

if (html.includes('<script>')) {
  html = html.replace(/<script>[\s\S]*?<\/script>/, bundleScript);
} else {
  html = html.replace(/<script src="js\/data\/buildings\.js"><\/script>[\s\S]*<script src="js\/app\.js"><\/script>/, bundleScript);
}

fs.writeFileSync(path.join(__dirname, 'satisfactory_dashboard.html'), html, 'utf8');
fs.writeFileSync(path.join(baseDir, 'index.html'), html, 'utf8');

console.log('Successfully bundled satisfactory_dashboard.html & index.html (100% standalone with Interactive Resource Map)!');

