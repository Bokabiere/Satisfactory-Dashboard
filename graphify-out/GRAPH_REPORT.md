# Graph Report - Satisfactory-Dashboard  (2026-08-19)

## Corpus Check
- Large corpus: 103 files · ~763,596 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder.

## Summary
- 512 nodes · 1193 edges · 29 communities (12 shown, 17 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 88 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Js_jspdf_min_a Module
- Js_app Module
- Js_engine_factoryviewer3d Module
- Js_engine_mapengine Module
- Bundle Module
- Batch_export_sbp Module
- Js_jspdf_min Module
- Generate_sbp Module
- Js_engine_blueprintgenerator Module
- Js_engine_controlroomengine Module
- Js_engine_calculator Module
- Js_engine_logisticsengine Module
- Js_engine_powercalculator Module
- Build_full_cbp Module
- Js_engine_mamengine Module
- Js_data_nodes Module
- Js_engine_saveparser Module
- Js_app_groupstepsintomk3modules Module
- Js_data_buildings Module
- Test_bp Module
- Js_data_buildingtextures Module
- Js_data_logisticsdata Module
- Js_data_mamdata Module
- Js_data_maptextures Module
- Js_data_milestones Module
- Js_data_powerdata Module
- Js_data_recipes Module

## God Nodes (most connected - your core abstractions)
1. `De()` - 106 edges
2. `m()` - 65 edges
3. `Factory3DViewer` - 41 edges
4. `e()` - 36 edges
5. `showToast()` - 35 edges
6. `SatisfactoryMapEngine` - 27 edges
7. `a()` - 23 edges
8. `saveState()` - 21 edges
9. `switchTab()` - 20 edges
10. `init()` - 20 edges

## Surprising Connections (you probably didn't know these)
- `h()` --indirect_call--> `o()`  [INFERRED]
  js/jspdf.min.js → js/jspdf.min.js  _Bridges community 6 → community 0_
- `renderMilestoneCalculationResults()` --calls--> `groupStepsIntoMk3Modules()`  [EXTRACTED]
  js/app.js → js/app.js  _Bridges community 17 → community 1_

## Import Cycles
- None detected.

## Communities (29 total, 17 thin omitted)

### Community 0 - "Js_jspdf_min_a Module"
Cohesion: 0.06
Nodes (117): a(), b(), De(), a(), ae(), ar(), b(), be() (+109 more)

### Community 1 - "Js_app Module"
Cohesion: 0.05
Nodes (101): addCalculationToChecklist(), applyTabPreferences(), attachGuideInteractivity(), attachInteractivity(), attachMachineInteractivity(), bindEvents(), buildGraph(), close() (+93 more)

### Community 4 - "Bundle Module"
Cohesion: 0.08
Nodes (24): appJs, blueprintGenJs, blueprintsJs, buildingsJs, buildingTexturesJs, calcJs, controlRoomJs, css (+16 more)

### Community 5 - "Batch_export_sbp Module"
Cohesion: 0.13
Nodes (11): BinaryWriter, { BLUEPRINTS_DATA }, exportAllBlueprints(), fs, generateSbpBuffers(), ITEM_DESC_CLASSES, path, UOBJECT_CLASSES (+3 more)

### Community 6 - "Js_jspdf_min Module"
Cohesion: 0.10
Nodes (14): Be(), C(), Ct(), d(), jt(), Et(), g(), h() (+6 more)

### Community 7 - "Generate_sbp Module"
Cohesion: 0.18
Nodes (6): BinaryWriter, fs, generateBlueprint(), path, yawToQuat(), zlib

### Community 8 - "Js_engine_blueprintgenerator Module"
Cohesion: 0.15
Nodes (5): BlueprintBinaryWriter, BlueprintFileGenerator, BUILDING_ARCHETYPES, compressZlib(), packUEChunks()

### Community 9 - "Js_engine_controlroomengine Module"
Cohesion: 0.29
Nodes (14): addTelexMessage(), animateHolo3D(), animateRadar(), buildExplodedBuilding(), init(), initGauges(), initHolo3D(), initRadar() (+6 more)

### Community 13 - "Build_full_cbp Module"
Cohesion: 0.25
Nodes (6): cbpJson, cbpPayload, entities, fs, path, projectDir

### Community 15 - "Js_data_nodes Module"
Cohesion: 0.40
Nodes (5): BIOMES, calculateNodeOutput(), getResourcePurityMultiplier(), RESOURCE_NODES, RESOURCE_TYPES

## Knowledge Gaps
- **55 isolated node(s):** `fs`, `path`, `zlib`, `{ BLUEPRINTS_DATA }`, `UOBJECT_CLASSES` (+50 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `De()` connect `Js_jspdf_min_a Module` to `Js_jspdf_min Module`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Why does `m()` connect `Js_jspdf_min_a Module` to `Js_jspdf_min Module`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `De()` (e.g. with `kr()` and `xr()`) actually correct?**
  _`De()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `m()` (e.g. with `e()` and `i()`) actually correct?**
  _`m()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 8 inferred relationships involving `e()` (e.g. with `a()` and `c()`) actually correct?**
  _`e()` has 8 INFERRED edges - model-reasoned connections that need verification._
- **What connects `fs`, `path`, `zlib` to the rest of the system?**
  _55 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Js_jspdf_min_a Module` be split into smaller, more focused modules?**
  _Cohesion score 0.05651612903225806 - nodes in this community are weakly interconnected._