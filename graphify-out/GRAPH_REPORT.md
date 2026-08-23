# Graph Report - Satisfactory-Dashboard  (2026-08-23)

## Corpus Check
- Large corpus: 114 files · ~1,597,817 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder.

## Summary
- 526 nodes · 1205 edges · 32 communities (15 shown, 17 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 88 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- jsPDF Library Part 1
- App UI Interactions
- 3D Viewer Engine
- Interactive Map Engine
- Webpack Bundle Data
- Batch SBP Exporter
- jsPDF Library Part 2
- Global Search UI
- SBP Generator
- Blueprint Generator
// REMOVED_FEATURE: - Radar Scanning
- UI Handlers
- App Events
- Core State
- Item Tracking
- Graph Logic
- Map Rendering
- Blueprint Writer
- Binary Serialization
- Factory Logic
- Resource Nodes
- Production Lines
- Utility Logic
- Control Room Engine
- UI Components
- Settings UI
- Game Data
- Recipes Database
- Math Utils
- Canvas Rendering

## God Nodes (most connected - your core abstractions)
1. `De()` - 106 edges
2. `m()` - 65 edges
3. `Factory3DViewer` - 41 edges
4. `showToast()` - 37 edges
5. `e()` - 36 edges
6. `SatisfactoryMapEngine` - 27 edges
7. `a()` - 23 edges
8. `switchTab()` - 21 edges
9. `saveState()` - 21 edges
10. `init()` - 20 edges

## Surprising Connections (you probably didn't know these)
- `Satisfactory Dashboard App` --implements--> `FICSIT Factory Companion`  [INFERRED]
  index.html → README.md

## Import Cycles
- None detected.

## Communities (32 total, 17 thin omitted)

### Community 0 - "jsPDF Library Part 1"
Cohesion: 0.06
Nodes (117): a(), b(), De(), a(), ae(), ar(), b(), be() (+109 more)

### Community 1 - "App UI Interactions"
Cohesion: 0.05
Nodes (95): addCalculationToChecklist(), applyTabPreferences(), attachGuideInteractivity(), attachInteractivity(), attachMachineInteractivity(), bindEvents(), buildGraph(), close() (+87 more)

### Community 4 - "Webpack Bundle Data"
Cohesion: 0.08
Nodes (25): appJs, blueprintGenJs, blueprintsJs, buildingsJs, buildingTexturesJs, calcJs, controlRoomJs, css (+17 more)

### Community 5 - "Batch SBP Exporter"
Cohesion: 0.13
Nodes (11): BinaryWriter, { BLUEPRINTS_DATA }, exportAllBlueprints(), fs, generateSbpBuffers(), ITEM_DESC_CLASSES, path, UOBJECT_CLASSES (+3 more)

### Community 6 - "jsPDF Library Part 2"
Cohesion: 0.10
Nodes (14): Be(), C(), Ct(), d(), jt(), Et(), g(), h() (+6 more)

### Community 7 - "Global Search UI"
Cohesion: 0.15
Nodes (15): initGlobalSearch(), closeModal(), executeResultAction(), renderSearchResults(), initPowerCalculatorUI(), convertPowerPlantToSCIMResults(), populateRecipeSelect(), renderEnergyResults() (+7 more)

### Community 8 - "SBP Generator"
Cohesion: 0.18
Nodes (6): BinaryWriter, fs, generateBlueprint(), path, yawToQuat(), zlib

### Community 9 - "Blueprint Generator"
Cohesion: 0.15
Nodes (5): BlueprintBinaryWriter, BlueprintFileGenerator, BUILDING_ARCHETYPES, compressZlib(), packUEChunks()

### Community 13 - "Core State"
Cohesion: 0.25
Nodes (6): cbpJson, cbpPayload, entities, fs, path, projectDir

### Community 14 - "Item Tracking"
Cohesion: 0.43
Nodes (6): actions, ANIM_FILES, animate(), initAvatar(), loadAnimation(), playAvatarAnimation()

### Community 17 - "Blueprint Writer"
Cohesion: 0.70
Nodes (4): addTelexMessage(), init(), initTelex(), setupControls()

### Community 18 - "Binary Serialization"
Cohesion: 0.50
Nodes (3): BIOMES, RESOURCE_NODES, RESOURCE_TYPES

### Community 19 - "Factory Logic"
Cohesion: 0.50
Nodes (3): jsdom, dependencies, jsdom

## Knowledge Gaps
- **61 isolated node(s):** `fs`, `path`, `zlib`, `{ BLUEPRINTS_DATA }`, `UOBJECT_CLASSES` (+56 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `De()` connect `jsPDF Library Part 1` to `jsPDF Library Part 2`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Why does `m()` connect `jsPDF Library Part 1` to `jsPDF Library Part 2`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `showToast()` connect `App UI Interactions` to `Global Search UI`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `De()` (e.g. with `kr()` and `xr()`) actually correct?**
  _`De()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `m()` (e.g. with `e()` and `i()`) actually correct?**
  _`m()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 8 inferred relationships involving `e()` (e.g. with `a()` and `c()`) actually correct?**
  _`e()` has 8 INFERRED edges - model-reasoned connections that need verification._
- **What connects `fs`, `path`, `zlib` to the rest of the system?**
  _61 weakly-connected nodes found - possible documentation gaps or missing edges._