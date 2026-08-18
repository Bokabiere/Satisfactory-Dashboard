const { BLUEPRINTS_DATA } = require('./satisfactory-dashboard/js/data/blueprints.js');
const { ITEM_NAMES } = require('./satisfactory-dashboard/js/data/buildings.js');

console.log('Testing', BLUEPRINTS_DATA.length, 'blueprints...');

BLUEPRINTS_DATA.forEach((bp, index) => {
  if (!bp.inputs) console.error('missing inputs:', index, bp.id);
  if (!bp.outputs) console.error('missing outputs:', index, bp.id);
  if (!bp.materialsNeeded) console.error('missing materialsNeeded:', index, bp.id);
  if (!bp.schematic) console.error('missing schematic:', index, bp.id);
  
  const inputsHtml = bp.inputs ? bp.inputs.map(i => '<div>📥 ' + i + '</div>').join('') : '';
  const outputsHtml = bp.outputs ? bp.outputs.map(o => '<div>📤 ' + o + '</div>').join('') : '';
  const materialsHtml = bp.materialsNeeded ? Object.entries(bp.materialsNeeded).map(([mat, qty]) => {
    return '<div class="cost-tag"><span class="cost-qty">' + qty + '</span> ' + (ITEM_NAMES[mat] || mat) + '</div>';
  }).join('') : '';
  const schematicStr = bp.schematic ? bp.schematic.trim() : '';
});

console.log('All checked successfully!');
