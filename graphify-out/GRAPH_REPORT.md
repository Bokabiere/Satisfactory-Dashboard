# Graph Report - Satisfactory-Dashboard  (2026-08-19)

## Corpus Check
- Large corpus: 93 files · ~667,155 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder.

## Summary
- 437 nodes · 1019 edges · 27 communities (16 shown, 11 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 86 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Application UI & Interactivity Controller
- PDF Generator Utility (jsPDF Internal A)
- 3D Factory Viewer & WebGL Rendering
- Interactive Canvas Resource Map Engine
- Batch SBP Binary Exporter
- PDF Generation Engine (jsPDF Core)
- PDF Generator Utility (jsPDF Internal B)
- SBP Binary Blueprint Generator CLI
- Web Application Asset Bundler
- In-Browser Blueprint Binary Encoder
- PDF Generator Utility (jsPDF Internal C)
- PDF Generator Utility (jsPDF Internal D)
- PDF Generator Utility (jsPDF Internal E)
- Blueprint Binary Writer Subroutines
- Production Optimization & Calculation Engine
- Companion Modules & Architecture Specifications
- Full CBP Megablueprint Builder
- Resource Nodes & Purity Data
- Satisfactory Save File Binary Parser
- Building & Item Entity Definitions
- PDF Generator Helper Functions
- Blueprint Test Harness
- Building 3D/2D Textures Data
- Map Texture & Biome Layer Assets
- HUB Milestones & Progression Data
- Production Recipes & Alternate Recipes

## God Nodes (most connected - your core abstractions)
1. `De()` - 106 edges
2. `m()` - 65 edges
3. `Factory3DViewer` - 41 edges
4. `e()` - 36 edges
5. `showToast()` - 28 edges
6. `SatisfactoryMapEngine` - 25 edges
7. `a()` - 23 edges
8. `i()` - 19 edges
9. `n()` - 18 edges
10. `saveState()` - 17 edges

## Surprising Connections (you probably didn't know these)
- `a()` --indirect_call--> `L()`  [INFERRED]
  js/jspdf.min.js → js/jspdf.min.js  _Bridges community 6 → community 10_
- `f()` --indirect_call--> `a()`  [INFERRED]
  js/jspdf.min.js → js/jspdf.min.js  _Bridges community 11 → community 12_
- `d()` --indirect_call--> `a()`  [INFERRED]
  js/jspdf.min.js → js/jspdf.min.js  _Bridges community 5 → community 12_
- `m()` --indirect_call--> `e()`  [INFERRED]
  js/jspdf.min.js → js/jspdf.min.js  _Bridges community 1 → community 6_
- `et()` --indirect_call--> `Mt()`  [INFERRED]
  js/jspdf.min.js → js/jspdf.min.js  _Bridges community 5 → community 6_

## Import Cycles
- None detected.

## Communities (27 total, 11 thin omitted)

### Community 0 - "Application UI & Interactivity Controller"
Cohesion: 0.07
Nodes (65): addCalculationToChecklist(), attachGuideInteractivity(), attachInteractivity(), attachMachineInteractivity(), buildGraph(), close(), compressZlibStream(), executeCalculation() (+57 more)

### Community 1 - "PDF Generator Utility (jsPDF Internal A)"
Cohesion: 0.09
Nodes (47): De(), ae(), ar(), be(), cr(), de(), ee(), fe() (+39 more)

### Community 4 - "Batch SBP Binary Exporter"
Cohesion: 0.13
Nodes (11): BinaryWriter, { BLUEPRINTS_DATA }, exportAllBlueprints(), fs, generateSbpBuffers(), ITEM_DESC_CLASSES, path, UOBJECT_CLASSES (+3 more)

### Community 5 - "PDF Generation Engine (jsPDF Core)"
Cohesion: 0.09
Nodes (13): Be(), C(), d(), jt(), Et(), g(), k(), Me() (+5 more)

### Community 6 - "PDF Generator Utility (jsPDF Internal B)"
Cohesion: 0.22
Nodes (24): a(), b(), c(), ce(), ct(), dt(), e(), et() (+16 more)

### Community 7 - "SBP Binary Blueprint Generator CLI"
Cohesion: 0.18
Nodes (6): BinaryWriter, fs, generateBlueprint(), path, yawToQuat(), zlib

### Community 8 - "Web Application Asset Bundler"
Cohesion: 0.12
Nodes (16): appJs, blueprintsJs, buildingsJs, buildingTexturesJs, calcJs, css, factory3DJs, fs (+8 more)

### Community 9 - "In-Browser Blueprint Binary Encoder"
Cohesion: 0.12
Nodes (4): BlueprintBinaryWriter, BlueprintFileGenerator, ITEM_DESC_CLASSES_BROWSER, UOBJECT_CLASSES_BROWSER

### Community 10 - "PDF Generator Utility (jsPDF Internal C)"
Cohesion: 0.21
Nodes (16): b(), bt(), d(), f(), ft(), gt(), h(), nt() (+8 more)

### Community 11 - "PDF Generator Utility (jsPDF Internal D)"
Cohesion: 0.21
Nodes (14): g(), k(), kt(), m(), p(), rt(), zt(), Ee() (+6 more)

### Community 12 - "PDF Generator Utility (jsPDF Internal E)"
Cohesion: 0.22
Nodes (14): Ct(), a(), er(), hr(), it(), o(), qt(), ue() (+6 more)

### Community 15 - "Companion Modules & Architecture Specifications"
Cohesion: 0.25
Nodes (8): Module 6: Checklist de Chantier & Fiches d'Atelier, Module 5: Calculateur d'Usines Compl?tes (Multi-Lignes), Module 2: Jalons du HUB (Tiers 0-9), Module 7: Carte Interactive des Ressources, Module 4: Calculateur de Pi?ces Uniques, Module 3: Ascenseur Spatial (Phases 1-5), Module 1: Vue Synth?tique & Dashboard, FICSIT Factory Companion (Satisfactory Dashboard)

### Community 16 - "Full CBP Megablueprint Builder"
Cohesion: 0.25
Nodes (6): cbpJson, cbpPayload, entities, fs, path, projectDir

### Community 17 - "Resource Nodes & Purity Data"
Cohesion: 0.40
Nodes (5): BIOMES, calculateNodeOutput(), getResourcePurityMultiplier(), RESOURCE_NODES, RESOURCE_TYPES

### Community 20 - "PDF Generator Helper Functions"
Cohesion: 0.67
Nodes (3): br(), j(), v()

## Knowledge Gaps
- **52 isolated node(s):** `fs`, `path`, `zlib`, `{ BLUEPRINTS_DATA }`, `UOBJECT_CLASSES` (+47 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `De()` connect `PDF Generator Utility (jsPDF Internal A)` to `PDF Generation Engine (jsPDF Core)`, `PDF Generator Utility (jsPDF Internal B)`, `PDF Generator Utility (jsPDF Internal C)`, `PDF Generator Utility (jsPDF Internal D)`, `PDF Generator Utility (jsPDF Internal E)`, `PDF Generator Helper Functions`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Why does `m()` connect `PDF Generator Utility (jsPDF Internal A)` to `PDF Generation Engine (jsPDF Core)`, `PDF Generator Utility (jsPDF Internal B)`, `PDF Generator Utility (jsPDF Internal C)`, `PDF Generator Utility (jsPDF Internal D)`, `PDF Generator Utility (jsPDF Internal E)`, `PDF Generator Helper Functions`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `De()` (e.g. with `kr()` and `xr()`) actually correct?**
  _`De()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `m()` (e.g. with `e()` and `i()`) actually correct?**
  _`m()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 8 inferred relationships involving `e()` (e.g. with `a()` and `c()`) actually correct?**
  _`e()` has 8 INFERRED edges - model-reasoned connections that need verification._
- **What connects `fs`, `path`, `zlib` to the rest of the system?**
  _52 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Application UI & Interactivity Controller` be split into smaller, more focused modules?**
  _Cohesion score 0.07245386192754613 - nodes in this community are weakly interconnected._