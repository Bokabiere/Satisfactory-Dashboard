// =========================================================================
// MOTEUR 3D FICSIT - VISUALISEUR DE CHANTIER PAS-À-PAS THREE.JS
// Architecture Manifold Réelle par Tronçons Inter-Répartiteurs (Port-à-Port)
// Garantie Absolue : ZÉRO CHEVAUCHEMENT (Aucun tapis ne traverse un répartiteur)
// Double Bus Parallèle Strict pour Assembleuses & Traçabilité Intégrale
// =========================================================================

class Factory3DViewer {
  constructor(containerId) {
    this.container = typeof containerId === "string" ? document.getElementById(containerId) : containerId;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.raycaster = null;
    this.mouse = null;
    
    this.isInitialized = false;
    this.animationFrameId = null;
    this.stepMeshes = [];
    this.allMeshes = [];
    this.labelSprites = [];
    this.floorSlabMeshes = [];
    this.showLabels = true;
    this.subfloorTransparent = false;
    this.currentStepIndex = 0;
    this.currentFloorFilter = "all";
    this.viewMode = "step";
    this.hoveredObject = null;
    this.selectedObject = null;
    this.activeHighlightedObjects = [];
    this.tooltipEl = null;

    this.materials = null;

    this.ITEM_COLORS_HEX = {
      "iron_ore": 0xea580c, "iron_ingot": 0xf59e0b, "iron_plate": 0x38bdf8, "iron_rod": 0x0284c7, "screw": 0x94a3b8, "reinforced_iron_plate": 0x06b6d4, "rotor": 0xa855f7, "modular_frame": 0xd946ef,
      "copper_ore": 0xf97316, "copper_ingot": 0xea580c, "wire": 0xeab308, "cable": 0x0284c7, "copper_sheet": 0xca8a04,
      "coal": 0x334155, "steel_ingot": 0x64748b, "steel_beam": 0x64748b, "steel_pipe": 0x94a3b8, "encased_industrial_beam": 0x10b981, "stator": 0x8b5cf6, "motor": 0xec4899, "heavy_modular_frame": 0xf43f5e,
      "limestone": 0xcbd5e1, "concrete": 0xe2e8f0,
      "caterium_ore": 0xeab308, "caterium_ingot": 0xfacc15, "quickwire": 0xfbbf24,
      "raw_quartz": 0xec4899, "quartz_crystal": 0xf472b6, "silica": 0xcbd5e1,
      "crude_oil": 0x4f46e5, "plastic": 0x06b6d4, "rubber": 0x64748b, "fuel": 0xf59e0b,
      "bauxite": 0xdc2626, "aluminum_scrap": 0xe2e8f0, "aluminum_ingot": 0xcbd5e1, "alclad_aluminum_sheet": 0x38bdf8,
      "smart_plating": 0x10b981, "versatile_framework": 0x10b981, "automated_wiring": 0x10b981, "adaptive_control_unit": 0x10b981, "modular_engine": 0x10b981
    };
  }

  init() {
    if (!this.container) return false;
    if (typeof THREE === "undefined") {
      console.warn("Three.js non disponible.");
      return false;
    }
    if (this.isInitialized) return true;

    const width = this.container.clientWidth || 800;
    const height = this.container.clientHeight || 520;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0e16);
    this.scene.fog = new THREE.FogExp2(0x0a0e16, 0.002);

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 2000);
    this.camera.position.set(55, 50, 65);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;

    this.container.innerHTML = "";
    this.container.style.position = "relative";
    this.container.appendChild(this.renderer.domElement);

    if (typeof THREE.OrbitControls !== "undefined") {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    } else if (typeof OrbitControls !== "undefined") {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    }

    if (this.controls) {
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.08;
      this.controls.maxPolarAngle = Math.PI / 2 - 0.02;
      this.controls.minDistance = 5;
      this.controls.maxDistance = 400;
      this.controls.target.set(0, 14, 0);
    }

    this.setupLighting();
    this.initMaterials();

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.setupInteractivity();

    this.buildWorldGrid();

    window.addEventListener("resize", () => this.resize());
    
    this.animate = this.animate.bind(this);
    this.animate();

    this.isInitialized = true;
    return true;
  }

  setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xdde6f0, 0.8);
    this.scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff8ee, 1.4);
    sunLight.position.set(70, 120, 60);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 350;
    const d = 70;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    sunLight.shadow.bias = -0.0004;
    this.scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0x4bb3fd, 0.6);
    fillLight.position.set(-70, 60, -60);
    this.scene.add(fillLight);

    const orangePoint = new THREE.PointLight(0xfa9549, 1.5, 120);
    orangePoint.position.set(0, 24, 0);
    this.scene.add(orangePoint);
  }

  initMaterials() {
    this.materials = {
      foundationConcrete: new THREE.MeshStandardMaterial({
        color: 0x1f2631,
        roughness: 0.85,
        metalness: 0.15
      }),
      foundationConcreteTrans: new THREE.MeshStandardMaterial({
        color: 0x1f2631,
        roughness: 0.85,
        metalness: 0.15,
        transparent: true,
        opacity: 0.28
      }),
      foundationGrid: new THREE.MeshStandardMaterial({
        color: 0x2b3644,
        roughness: 0.7,
        metalness: 0.3
      }),
      foundationBorder: new THREE.MeshStandardMaterial({
        color: 0xfa9549,
        roughness: 0.4,
        metalness: 0.6
      }),
      subfloorMetalWall: new THREE.MeshStandardMaterial({
        color: 0x151c26,
        roughness: 0.5,
        metalness: 0.8
      }),
      machinePad: new THREE.MeshStandardMaterial({
        color: 0x0f141c,
        roughness: 0.9,
        metalness: 0.2
      }),
      ficsitOrange: new THREE.MeshStandardMaterial({
        color: 0xfa9549,
        roughness: 0.35,
        metalness: 0.6
      }),
      ficsitYellow: new THREE.MeshStandardMaterial({
        color: 0xeab308,
        roughness: 0.35,
        metalness: 0.5
      }),
      ficsitDarkMetal: new THREE.MeshStandardMaterial({
        color: 0x121720,
        roughness: 0.45,
        metalness: 0.85
      }),
      ficsitLightMetal: new THREE.MeshStandardMaterial({
        color: 0x8b9bb4,
        roughness: 0.25,
        metalness: 0.9
      }),
      ficsitSteelBlue: new THREE.MeshStandardMaterial({
        color: 0x1e3a8a,
        roughness: 0.4,
        metalness: 0.7
      }),
      furnaceFireGlow: new THREE.MeshStandardMaterial({
        color: 0xff3b00,
        emissive: 0xff5500,
        emissiveIntensity: 1.8,
        roughness: 0.1
      }),
      ficsitCyanGlow: new THREE.MeshStandardMaterial({
        color: 0x3fe0d0,
        emissive: 0x3fe0d0,
        emissiveIntensity: 0.85,
        roughness: 0.2
      }),
      ficsitAmberGlow: new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xf59e0b,
        emissiveIntensity: 0.85,
        roughness: 0.2
      }),
      ficsitGreenGlow: new THREE.MeshStandardMaterial({
        color: 0x10b981,
        emissive: 0x10b981,
        emissiveIntensity: 1.2,
        roughness: 0.2
      }),
      conveyorBelt: new THREE.MeshStandardMaterial({
        color: 0x181e26,
        roughness: 0.7,
        metalness: 0.3
      }),
      conveyorFrame: new THREE.MeshStandardMaterial({
        color: 0x334155,
        roughness: 0.4,
        metalness: 0.8
      }),
      conveyorArrow: new THREE.MeshBasicMaterial({
        color: 0x38bdf8
      }),
      glass: new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.35,
        roughness: 0.1,
        metalness: 0.1,
        transmission: 0.85,
        ior: 1.5
      }),
      ghostHologram: new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        wireframe: true,
        transparent: true,
        opacity: 0.35
      }),
      highlightActive: new THREE.MeshStandardMaterial({
        color: 0xfa9549,
        emissive: 0xfa9549,
        emissiveIntensity: 1.8,
        roughness: 0.2,
        metalness: 0.5,
        depthTest: false
      }),
      highlightInbound: new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 1.8,
        roughness: 0.2,
        metalness: 0.5,
        depthTest: false
      }),
      highlightOutbound: new THREE.MeshStandardMaterial({
        color: 0x10b981,
        emissive: 0x059669,
        emissiveIntensity: 1.8,
        roughness: 0.2,
        metalness: 0.5,
        depthTest: false
      }),
      dimmedFactory: new THREE.MeshStandardMaterial({
        color: 0x222a35,
        roughness: 0.9,
        metalness: 0.1,
        transparent: true,
        opacity: 0.2
      })
    };
  }

  buildWorldGrid() {
    const gridHelper = new THREE.GridHelper(320, 320 / 8, 0xfa9549, 0x1e293b);
    gridHelper.position.y = -3.1;
    this.scene.add(gridHelper);

    const axes = new THREE.AxesHelper(16);
    axes.position.set(0, 0.1, 0);
    this.scene.add(axes);
  }

  setupInteractivity() {
    this.tooltipEl = document.createElement("div");
    this.tooltipEl.className = "ficsit-3d-tooltip";
    this.tooltipEl.style.position = "absolute";
    this.tooltipEl.style.display = "none";
    this.tooltipEl.style.pointerEvents = "none";
    this.tooltipEl.style.zIndex = "100";
    this.tooltipEl.style.background = "rgba(11, 15, 22, 0.95)";
    this.tooltipEl.style.border = "1.5px solid var(--ficsit-orange)";
    this.tooltipEl.style.boxShadow = "0 8px 24px rgba(0,0,0,0.85), 0 0 16px rgba(250,149,73,0.3)";
    this.tooltipEl.style.padding = "12px 16px";
    this.tooltipEl.style.borderRadius = "8px";
    this.tooltipEl.style.color = "#f0f4f8";
    this.tooltipEl.style.fontFamily = "var(--font-body, sans-serif)";
    this.tooltipEl.style.fontSize = "12px";
    this.tooltipEl.style.backdropFilter = "blur(8px)";
    this.tooltipEl.style.maxWidth = "340px";
    this.container.appendChild(this.tooltipEl);

    const onPointerMove = (e) => {
      const rect = this.renderer.domElement.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.checkHover(e.clientX - rect.left, e.clientY - rect.top);
    };

    const onClick = (e) => {
      if (this.hoveredObject) {
        this.selectObject(this.hoveredObject);
      } else {
        this.clearSelection();
      }
    };

    this.renderer.domElement.addEventListener("mousemove", onPointerMove);
    this.renderer.domElement.addEventListener("click", onClick);
  }

  checkHover(mouseX, mouseY) {
    if (!this.raycaster || !this.camera || !this.allMeshes.length) return;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.allMeshes, true);

    let foundInteractable = null;
    for (let hit of intersects) {
      let obj = hit.object;
      while (obj && !obj.userData?.ficsitData && obj !== this.scene) {
        obj = obj.parent;
      }
      if (obj && obj.userData?.ficsitData && obj.visible) {
        foundInteractable = obj;
        break;
      }
    }

    if (foundInteractable !== this.hoveredObject) {
      this.hoveredObject = foundInteractable;
      if (this.hoveredObject) {
        this.renderer.domElement.style.cursor = "pointer";
        this.showTooltip(this.hoveredObject.userData.ficsitData, mouseX, mouseY);
      } else {
        this.renderer.domElement.style.cursor = "default";
        if (!this.selectedObject) {
          this.hideTooltip();
        }
      }
    } else if (this.hoveredObject) {
      this.updateTooltipPosition(mouseX, mouseY);
    }
  }

  resolveBuildingTexture(buildingId, customImage = null) {
    if (customImage && (customImage.startsWith("data:") || customImage.startsWith("http") || customImage.startsWith("images/"))) {
      return customImage;
    }
    if (typeof BUILDING_TEXTURES !== "undefined" && buildingId) {
      if (BUILDING_TEXTURES[buildingId]) return BUILDING_TEXTURES[buildingId];
      if (buildingId === "storage" && BUILDING_TEXTURES["storage_container"]) return BUILDING_TEXTURES["storage_container"];
    }
    if (typeof BUILDINGS !== "undefined" && buildingId && BUILDINGS[buildingId]?.image) {
      const img = BUILDINGS[buildingId].image;
      const base = img.split('/').pop();
      if (typeof BUILDING_TEXTURES !== "undefined" && BUILDING_TEXTURES[base]) {
        return BUILDING_TEXTURES[base];
      }
      return img;
    }
    return customImage || null;
  }

  showTooltip(mesh, x, y) {
    if (!this.tooltipEl || !mesh.userData?.ficsitData) return;
    const data = mesh.userData.ficsitData;

    let traceHtml = "";
    if (data.pathway) {
      const p = data.pathway;
      traceHtml = `
        <div style="margin-top: 8px; padding-top: 8px; border-top: 1px dashed rgba(250,149,73,0.3); font-size: 11px;">
          <div style="color: #38bdf8; font-weight: 700; margin-bottom: 3px;">🔵 SOURCE : <strong>${p.sourceName}</strong></div>
          <div style="color: #fa9549; font-weight: 700; margin-bottom: 3px;">🛤️ CHEMINEMENT :</div>
          <div style="color: #cbd5e1; margin-left: 10px; margin-bottom: 4px; line-height: 1.4;">${p.pathDescription || 'Parcours technique sécurisé'}</div>
          <div style="color: #10b981; font-weight: 700;">🟢 DESTINATION : <strong>${p.targetName}</strong></div>
        </div>
      `;
    } else if (data.links) {
      const srcList = data.links.sources && data.links.sources.length ? data.links.sources.map(s => `<li>🔵 <strong>${s.name}</strong> <span style="color:#94a3b8;">(${s.item ? s.item.replace(/_/g, ' ') : ''} ${s.rate ? s.rate + '/min' : ''})</span></li>`).join("") : `<li style="color:#64748b;">(Gisement brut / Entrée initiale)</li>`;
      const tgtList = data.links.targets && data.links.targets.length ? data.links.targets.map(t => `<li>🟢 <strong>${t.name}</strong> <span style="color:#94a3b8;">(${t.item ? t.item.replace(/_/g, ' ') : ''} ${t.rate ? t.rate + '/min' : ''})</span></li>`).join("") : `<li style="color:#64748b;">(Stockage final / Sortie usine)</li>`;

      traceHtml = `
        <div style="margin-top: 8px; padding-top: 8px; border-top: 1px dashed rgba(250,149,73,0.3); font-size: 11px;">
          <div style="color: #38bdf8; font-weight: 700; margin-bottom: 2px;">📥 ALIMENTÉ PAR (AMONT) :</div>
          <ul style="margin: 0 0 6px 14px; padding: 0;">${srcList}</ul>
          <div style="color: #10b981; font-weight: 700; margin-bottom: 2px;">📤 ALIMENTE (AVAL) :</div>
          <ul style="margin: 0 0 0 14px; padding: 0;">${tgtList}</ul>
        </div>
      `;
    }

    const imgSource = this.resolveBuildingTexture(data.buildingId, data.image);
    const iconDisplay = imgSource 
      ? `<img src="${imgSource}" alt="" style="width: 44px; height: 44px; object-fit: contain; background: rgba(14, 20, 32, 0.9); border-radius: 8px; padding: 4px; border: 1.5px solid var(--ficsit-orange); flex-shrink: 0; box-shadow: 0 2px 8px rgba(0,0,0,0.5);" />`
      : `<span style="font-size: 24px;">${data.icon || '🏭'}</span>`;

    this.tooltipEl.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px solid rgba(250,149,73,0.3);">
        ${iconDisplay}
        <div>
          <div style="font-family: var(--font-display); font-weight: 700; color: var(--ficsit-orange); font-size: 14px; line-height: 1.2;">
            ${data.title || data.name}
          </div>
          <div style="color: var(--text-secondary); font-size: 11px; margin-top: 2px;">${data.subtitle || ''}</div>
        </div>
      </div>
      ${data.floor !== undefined ? `<div style="display: flex; justify-content: space-between; gap: 12px; font-size: 11px;"><span>Niveau :</span><strong style="color: #a855f7;">${data.floor === 0 ? 'RDC (0m)' : `Étage ${data.floor} (+${data.floor * 14}m)`}</strong></div>` : ''}
      ${data.rate ? `<div style="display: flex; justify-content: space-between; gap: 12px; font-size: 11px;"><span>Débit :</span><strong style="color: var(--ficsit-green);">${data.rate}</strong></div>` : ''}
      ${data.power ? `<div style="display: flex; justify-content: space-between; gap: 12px; font-size: 11px;"><span>Puissance :</span><strong style="color: var(--ficsit-amber);">${data.power} MW</strong></div>` : ''}
      ${data.clock ? `<div style="display: flex; justify-content: space-between; gap: 12px; font-size: 11px;"><span>Horloge :</span><strong style="color: #a855f7;">${data.clock}%</strong></div>` : ''}
      ${traceHtml}
    `;
    this.tooltipEl.style.display = "block";
    this.updateTooltipPosition(x, y);
  }

  updateTooltipPosition(x, y) {
    if (!this.tooltipEl) return;
    const padding = 15;
    let left = x + padding;
    let top = y + padding;

    if (left + 350 > this.container.clientWidth) {
      left = x - 350 - padding;
    }
    if (top + 230 > this.container.clientHeight) {
      top = y - 230 - padding;
    }

    this.tooltipEl.style.left = `${Math.max(10, left)}px`;
    this.tooltipEl.style.top = `${Math.max(10, top)}px`;
  }

  hideTooltip() {
    if (this.tooltipEl) {
      this.tooltipEl.style.display = "none";
    }
  }

  selectObject(obj) {
    if (this.selectedObject === obj) {
      this.clearSelection();
      return;
    }
    this.selectedObject = obj;
    this.highlightCircuit(obj);

    if (typeof window.showToast === "function" && obj.userData?.ficsitData) {
      const d = obj.userData.ficsitData;
      if (d.pathway) {
        window.showToast(`🛤️ Cheminement Convoyeur : ${d.pathway.sourceName} ➔ ${d.pathway.targetName}`);
      } else {
        window.showToast(`🔍 Machine Active : ${d.title || d.name} (🔵 Amont / 🟠 Sélection / 🟢 Aval)`);
      }
    }
  }

  clearSelection() {
    this.selectedObject = null;
    this.clearHighlight();
    this.hideTooltip();
  }

  highlightCircuit(rootObj) {
    this.clearHighlight();
    if (!rootObj || !rootObj.userData?.ficsitData) return;

    const data = rootObj.userData.ficsitData;

    this.allMeshes.forEach(mesh => {
      if (!mesh.userData.origMaterial) {
        mesh.userData.origMaterial = mesh.material;
      }
      mesh.material = this.materials.dimmedFactory;
    });

    if (data.pathway) {
      const p = data.pathway;
      if (p.sourceElement) {
        this.applyGlowToGroup(p.sourceElement, this.materials.highlightInbound);
        this.activeHighlightedObjects.push(p.sourceElement);
      }
      (p.pathwaySegments || []).forEach(seg => {
        this.applyGlowToGroup(seg, this.materials.highlightActive);
        this.activeHighlightedObjects.push(seg);
      });
      if (p.targetElement) {
        this.applyGlowToGroup(p.targetElement, this.materials.highlightOutbound);
        this.activeHighlightedObjects.push(p.targetElement);
      }
      return;
    }

    const links = data.links || { sources: [], targets: [] };
    const inObjects = new Set();
    const outObjects = new Set();

    (links.sources || []).forEach(s => {
      if (s.element) inObjects.add(s.element);
      if (s.belt) inObjects.add(s.belt);
      if (s.lift) inObjects.add(s.lift);
      if (s.hole) inObjects.add(s.hole);
      (s.segments || []).forEach(seg => inObjects.add(seg));
    });

    (links.targets || []).forEach(t => {
      if (t.element) outObjects.add(t.element);
      if (t.belt) outObjects.add(t.belt);
      if (t.lift) outObjects.add(t.lift);
      if (t.hole) outObjects.add(t.hole);
      (t.segments || []).forEach(seg => outObjects.add(seg));
    });

    this.applyGlowToGroup(rootObj, this.materials.highlightActive);
    this.activeHighlightedObjects.push(rootObj);

    inObjects.forEach(obj => {
      this.applyGlowToGroup(obj, this.materials.highlightInbound);
      this.activeHighlightedObjects.push(obj);
    });

    outObjects.forEach(obj => {
      this.applyGlowToGroup(obj, this.materials.highlightOutbound);
      this.activeHighlightedObjects.push(obj);
    });
  }

  applyGlowToGroup(group, glowMat) {
    if (!group) return;
    group.traverse(child => {
      if (child.isMesh) {
        if (!child.userData.origMaterial) {
          child.userData.origMaterial = child.material;
        }
        child.material = glowMat;
        child.renderOrder = 999;
      }
    });
  }

  clearHighlight() {
    this.allMeshes.forEach(mesh => {
      if (mesh.userData.origMaterial) {
        mesh.material = mesh.userData.origMaterial;
        mesh.renderOrder = 0;
      }
    });
    this.activeHighlightedObjects = [];
  }

  createFloatingBillboard(options = {}) {
    const { title = "Machine", subtitle = "", rate = "", power = "", icon = "🏭", color = "#fa9549", image = null, buildingId = null } = options;
    const imgPath = this.resolveBuildingTexture(buildingId, image);

    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 400;
    const ctx = canvas.getContext("2d");

    const renderCard = (loadedImg = null) => {
      ctx.clearRect(0, 0, 1024, 400);

      // Fond principal sombre avec coins arrondis
      ctx.fillStyle = "rgba(10, 14, 22, 0.96)";
      ctx.beginPath();
      ctx.roundRect(16, 16, 992, 368, 28);
      ctx.fill();

      // Bordure externe FICSIT
      ctx.strokeStyle = color;
      ctx.lineWidth = 6;
      ctx.stroke();

      // CADRE GAUCHE : Showcase de l'image officielle HD
      ctx.fillStyle = "rgba(18, 24, 38, 0.95)";
      ctx.beginPath();
      ctx.roundRect(40, 40, 320, 320, 20);
      ctx.fill();

      ctx.strokeStyle = "rgba(250, 149, 73, 0.35)";
      ctx.lineWidth = 3;
      ctx.stroke();

      if (loadedImg) {
        try {
          const imgAspect = (loadedImg.width || 1) / (loadedImg.height || 1);
          let dw = 280, dh = 280;
          if (imgAspect > 1) dh = dw / imgAspect;
          else dw = dh * imgAspect;
          const dx = 40 + (320 - dw) / 2;
          const dy = 40 + (320 - dh) / 2;
          ctx.drawImage(loadedImg, dx, dy, dw, dh);
        } catch (e) {
          ctx.font = "140px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(icon, 200, 240);
          ctx.textAlign = "left";
        }
      } else {
        ctx.font = "140px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(icon, 200, 240);
        ctx.textAlign = "left";
      }

      // COLONNE DROITE : Informations FICSIT
      const textX = 390;

      // Badge Catégorie
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(textX, 44, 260, 44, 10);
      ctx.fill();

      ctx.fillStyle = "#0a0e16";
      ctx.font = "bold 24px 'Chakra Petch', monospace, sans-serif";
      ctx.fillText("FICSIT INDUSTRIAL", textX + 16, 74);

      // Titre de la Machine
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 50px 'Chakra Petch', sans-serif";
      const displayTitle = title.length > 20 ? title.slice(0, 19) + "…" : title;
      ctx.fillText(displayTitle.toUpperCase(), textX, 150);

      // Sous-titre / Recette
      ctx.fillStyle = "#94a3b8";
      ctx.font = "34px 'Inter', sans-serif";
      const subText = subtitle.length > 28 ? subtitle.slice(0, 26) + "…" : (subtitle || title);
      ctx.fillText(subText, textX, 204);

      // Bloc Statut / Débit
      ctx.fillStyle = "rgba(16, 185, 129, 0.15)";
      ctx.beginPath();
      ctx.roundRect(textX, 252, 280, 88, 16);
      ctx.fill();
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = "#10b981";
      ctx.font = "bold 34px sans-serif";
      const rateText = rate ? `🟢 ${rate}` : "🟢 En ligne";
      ctx.fillText(rateText, textX + 18, 308);

      // Bloc Puissance MW
      if (power !== undefined && power !== null && power !== "") {
        ctx.fillStyle = "rgba(245, 158, 11, 0.15)";
        ctx.beginPath();
        ctx.roundRect(textX + 300, 252, 280, 88, 16);
        ctx.fill();
        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = "#f59e0b";
        ctx.font = "bold 34px sans-serif";
        ctx.fillText(`⚡ ${power} MW`, textX + 318, 308);
      }
    };

    renderCard();

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;

    if (imgPath) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        renderCard(img);
        texture.needsUpdate = true;
      };
      img.src = imgPath;
    }

    const spriteMat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false,
      depthWrite: false
    });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(15, 5.86, 1);

    this.labelSprites.push(sprite);
    return sprite;
  }

  toggleLabels(show = null) {
    this.showLabels = (show !== null) ? show : !this.showLabels;
    this.labelSprites.forEach(sp => {
      sp.visible = this.showLabels;
    });
    return this.showLabels;
  }

  toggleSubfloorView() {
    this.subfloorTransparent = !this.subfloorTransparent;
    this.floorSlabMeshes.forEach(mesh => {
      mesh.material = this.subfloorTransparent ? this.materials.foundationConcreteTrans : this.materials.foundationConcrete;
    });
    return this.subfloorTransparent;
  }

  createFloorHoleMesh(x, floorY, z, resource = "iron_ingot", isOutput = false, depth = 5.2) {
    const group = new THREE.Group();

    const ringGeo = new THREE.BoxGeometry(1.8, 0.15, 1.8);
    const ring = new THREE.Mesh(ringGeo, this.materials.foundationBorder);
    ring.position.set(x, floorY + 0.075, z);
    group.add(ring);

    // Goulotte verticale descendant profondément dans le sous-sol technique
    const chuteGeo = new THREE.BoxGeometry(1.4, depth, 1.4);
    const chute = new THREE.Mesh(chuteGeo, this.materials.ficsitDarkMetal);
    chute.position.set(x, floorY - depth / 2, z);
    group.add(chute);

    const ledGeo = new THREE.BoxGeometry(0.3, 0.1, 0.3);
    const led = new THREE.Mesh(ledGeo, isOutput ? this.materials.ficsitAmberGlow : this.materials.ficsitCyanGlow);
    led.position.set(x, floorY + 0.16, z + 0.7);
    group.add(led);

    group.userData.ficsitData = {
      name: "Passe-dalle de convoyeur FICSIT",
      title: "Passe-dalle (Floor Hole)",
      subtitle: `${isOutput ? 'Évacuation' : 'Alimentation'} Dédiée : ${resource.replace(/_/g, ' ')}`,
      icon: "🕳️"
    };

    return group;
  }

  createVerticalShaftWall(gridSize = 6, totalHeight = 74, zPos = -10) {
    const group = new THREE.Group();
    const width = gridSize * 8;
    const startY = -6.0;
    const centerY = startY + totalHeight / 2;

    // Panneau Sandwich Vertical Multicouche (placé en arrière-plan d'appui immédiat des convoyeurs verticaux à zPos = -10) :
    const zBackOuter = zPos - 2.8;   // z = -12.8m (Tôle extérieure arrière du sandwich)
    const zCore = zPos - 2.0;        // z = -12.0m (Âme isolante technique sandwich)
    const zFrontInner = zPos - 1.2;  // z = -11.2m (Tôle intérieure avant du panneau sandwich)

    // 1. TÔLE EXTÉRIEURE ARRIÈRE DU PANNEAU SANDWICH
    const backOuterGeo = new THREE.BoxGeometry(width, totalHeight, 0.4);
    const backOuter = new THREE.Mesh(backOuterGeo, this.materials.subfloorMetalWall);
    backOuter.position.set(0, centerY, zBackOuter);
    backOuter.castShadow = true;
    backOuter.receiveShadow = true;
    group.add(backOuter);

    // 2. ÂME TECHNIQUE SANDWICH
    const coreGeo = new THREE.BoxGeometry(width - 0.4, totalHeight - 0.4, 1.2);
    const coreMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.85, metalness: 0.3 });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.position.set(0, centerY, zCore);
    group.add(coreMesh);

    // 3. TÔLE INTÉRIEURE AVANT DU PANNEAU SANDWICH
    const frontInnerGeo = new THREE.BoxGeometry(width, totalHeight, 0.4);
    const frontInner = new THREE.Mesh(frontInnerGeo, this.materials.subfloorMetalWall);
    frontInner.position.set(0, centerY, zFrontInner);
    frontInner.receiveShadow = true;
    group.add(frontInner);

    // 4. MONTANTS VERTICAUX ET RAILS DE GUIDAGE FICSIT (Poteaux sandwich tous les 8m)
    const numPillars = gridSize + 1;
    for (let p = 0; p < numPillars; p++) {
      const px = -width / 2 + p * 8;
      const pilGeo = new THREE.BoxGeometry(1.2, totalHeight, 1.0);
      const pil = new THREE.Mesh(pilGeo, this.materials.foundationBorder);
      pil.position.set(px, centerY, zFrontInner + 0.3);
      pil.castShadow = true;
      group.add(pil);
    }

    // 5. POUTRES HORIZONTALES ET CONSOLES D'ANCRAGE DES CONVOYEURS
    const floorLevels = [-6, 0, 12, 18, 30, 36, 48, 54, 68];
    floorLevels.forEach(hy => {
      const beamGeo = new THREE.BoxGeometry(width, 1.0, 0.8);
      const beam = new THREE.Mesh(beamGeo, this.materials.foundationBorder);
      beam.position.set(0, hy, zFrontInner + 0.2);
      group.add(beam);

      // Consoles / Potences de supportage reliant le mur sandwich aux convoyeurs verticaux
      for (let p = 0; p < numPillars; p++) {
        const px = -width / 2 + p * 8;
        const bracketGeo = new THREE.BoxGeometry(0.6, 0.4, 1.6);
        const bracket = new THREE.Mesh(bracketGeo, this.materials.ficsitDarkMetal);
        bracket.position.set(px, hy, zPos);
        bracket.castShadow = true;
        group.add(bracket);
      }
    });

    // 6. JOUES LATÉRALES DE FERMETURE DU PANNEAU SANDWICH (Extrémités X)
    [-width / 2, width / 2].forEach(endX => {
      const sideCapGeo = new THREE.BoxGeometry(0.8, totalHeight, 2.6);
      const sideCap = new THREE.Mesh(sideCapGeo, this.materials.subfloorMetalWall);
      sideCap.position.set(endX, centerY, (zBackOuter + zFrontInner) / 2);
      sideCap.castShadow = true;
      group.add(sideCap);

      const sideTrimGeo = new THREE.BoxGeometry(1.0, totalHeight, 0.4);
      const sideTrim = new THREE.Mesh(sideTrimGeo, this.materials.foundationBorder);
      sideTrim.position.set(endX, centerY, zFrontInner + 0.3);
      group.add(sideTrim);
    });

    // 7. BALISAGE LUMINEUX LED FICSIT LE LONG DU MUR SANDWICH
    for (let b = 0; b < gridSize; b++) {
      const bx = -width / 2 + 4.0 + b * 8.0;
      [0, 18, 36, 54].forEach(hy => {
        const ledGeo = new THREE.BoxGeometry(0.6, 0.3, 0.2);
        const led = new THREE.Mesh(ledGeo, (b % 2 === 0) ? this.materials.ficsitCyanGlow : this.materials.ficsitAmberGlow);
        led.position.set(bx, hy + 2.0, zFrontInner + 0.25);
        group.add(led);
      });
    }

    group.userData.ficsitData = {
      name: "Mur Panneau Sandwich Vertical FICSIT",
      title: "Mur Panneau Sandwich Technique (Sandwich Wall)",
      subtitle: "Structure sandwich multicouche supportant et guidant les convoyeurs verticaux (Lifts)",
      icon: "🏢"
    };

    return group;
  }

  createBuildingMesh(buildingId, options = {}) {
    const group = new THREE.Group();
    const { name = "Machine", recipeName = "", rate = "", powerMW = 4, clock = 100, floor = 0, facing = "north" } = options;

    let icon = "🏭";
    let badgeColor = "#fa9549";
    let topHeight = 10;
    let w = 6.5, h = 7, l = 9.5;

    switch (buildingId) {
      case "smelter":
      case "foundry":
        icon = "🔥";
        badgeColor = "#f59e0b";
        w = 6.5; h = 7; l = 9.5;
        topHeight = 13;

        const pad0 = new THREE.Mesh(new THREE.BoxGeometry(w + 1.2, 0.25, l + 1.2), this.materials.machinePad);
        pad0.position.y = 0.125;
        group.add(pad0);

        const padBorder0 = new THREE.Mesh(new THREE.BoxGeometry(w + 1.4, 0.08, l + 1.4), this.materials.foundationBorder);
        padBorder0.position.y = 0.04;
        group.add(padBorder0);

        const smelterBase = new THREE.Mesh(new THREE.BoxGeometry(w, h * 0.5, l), this.materials.ficsitDarkMetal);
        smelterBase.position.y = (h * 0.5) / 2 + 0.25;
        smelterBase.castShadow = true;
        group.add(smelterBase);

        const furnaceCore = new THREE.Mesh(new THREE.BoxGeometry(w * 0.8, h * 0.4, l * 0.6), this.materials.furnaceFireGlow);
        furnaceCore.position.set(0, h * 0.35 + 0.25, 0);
        group.add(furnaceCore);

        const smelterCap = new THREE.Mesh(new THREE.BoxGeometry(w * 0.9, h * 0.3, l * 0.9), this.materials.ficsitOrange);
        smelterCap.position.set(0, h * 0.65 + 0.25, 0);
        smelterCap.castShadow = true;
        group.add(smelterCap);

        const chimney = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.4, 6, 16), this.materials.ficsitDarkMetal);
        chimney.position.set(0, h + 1.75, -l * 0.2);
        chimney.castShadow = true;
        group.add(chimney);

        const chimRing = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 0.6, 16), this.materials.ficsitOrange);
        chimRing.position.set(0, h + 4.25, -l * 0.2);
        group.add(chimRing);

        const statusMast = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 3, 8), this.materials.ficsitLightMetal);
        statusMast.position.set(w * 0.4, h + 1.75, l * 0.4);
        group.add(statusMast);

        const statusLight = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 8), this.materials.ficsitGreenGlow);
        statusLight.position.set(w * 0.4, h + 3.25, l * 0.4);
        group.add(statusLight);
        break;

      case "constructor":
        icon = "⚙️";
        badgeColor = "#38bdf8";
        w = 7.5; h = 8; l = 10.5;
        topHeight = 12;

        const pad1 = new THREE.Mesh(new THREE.BoxGeometry(w + 1.2, 0.25, l + 1.2), this.materials.machinePad);
        pad1.position.y = 0.125;
        group.add(pad1);

        const padBorder1 = new THREE.Mesh(new THREE.BoxGeometry(w + 1.4, 0.08, l + 1.4), this.materials.foundationBorder);
        padBorder1.position.y = 0.04;
        group.add(padBorder1);

        const constBody = new THREE.Mesh(new THREE.BoxGeometry(w, h * 0.7, l), this.materials.ficsitOrange);
        constBody.position.y = (h * 0.7) / 2 + 0.25;
        constBody.castShadow = true;
        group.add(constBody);

        const topHood = new THREE.Mesh(new THREE.BoxGeometry(w * 0.85, h * 0.35, l * 0.7), this.materials.ficsitDarkMetal);
        topHood.position.set(0, h * 0.7 + 0.25, 0);
        topHood.castShadow = true;
        group.add(topHood);

        const glassChamber = new THREE.Mesh(new THREE.BoxGeometry(w * 0.7, h * 0.35, l * 0.45), this.materials.glass);
        glassChamber.position.set(0, h * 0.45 + 0.25, l * 0.1);
        group.add(glassChamber);

        const piston = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, h * 0.3, 12), this.materials.ficsitLightMetal);
        piston.position.set(0, h * 0.45 + 0.25, l * 0.1);
        group.add(piston);

        const controlPanel = new THREE.Mesh(new THREE.BoxGeometry(0.4, 2, 2.5), this.materials.ficsitYellow);
        controlPanel.position.set(w / 2 + 0.2, h * 0.4 + 0.25, 0);
        group.add(controlPanel);

        const constLight = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 8), this.materials.ficsitGreenGlow);
        constLight.position.set(w * 0.35, h * 0.9 + 0.25, l * 0.35);
        group.add(constLight);
        break;

      case "assembler":
      case "manufacturer":
      case "refinery":
        icon = buildingId === "manufacturer" ? "🤖" : (buildingId === "refinery" ? "🧪" : "🧬");
        badgeColor = "#10b981";
        w = 10.5; h = 10; l = 15;
        topHeight = 15;

        const pad2 = new THREE.Mesh(new THREE.BoxGeometry(w + 1.5, 0.25, l + 1.5), this.materials.machinePad);
        pad2.position.y = 0.125;
        group.add(pad2);

        const padBorder2 = new THREE.Mesh(new THREE.BoxGeometry(w + 1.7, 0.08, l + 1.7), this.materials.foundationBorder);
        padBorder2.position.y = 0.04;
        group.add(padBorder2);

        const assemBase = new THREE.Mesh(new THREE.BoxGeometry(w, h * 0.55, l), this.materials.ficsitSteelBlue);
        assemBase.position.y = (h * 0.55) / 2 + 0.25;
        assemBase.castShadow = true;
        group.add(assemBase);

        const gantry = new THREE.Mesh(new THREE.BoxGeometry(w * 0.9, h * 0.45, l * 0.6), this.materials.ficsitOrange);
        gantry.position.set(0, h * 0.7 + 0.25, 0);
        gantry.castShadow = true;
        group.add(gantry);

        const arm1 = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 4, 8), this.materials.ficsitLightMetal);
        arm1.position.set(-w * 0.25, h * 0.65 + 0.25, 0);
        arm1.rotation.z = Math.PI / 6;
        group.add(arm1);

        const arm2 = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 4, 8), this.materials.ficsitLightMetal);
        arm2.position.set(w * 0.25, h * 0.65 + 0.25, 0);
        arm2.rotation.z = -Math.PI / 6;
        group.add(arm2);

        const hopperL = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.4, 2), this.materials.ficsitDarkMetal);
        hopperL.position.set(-2.8, 1.8 + 0.25, l / 2 + 0.8);
        group.add(hopperL);

        const hopperR = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.4, 2), this.materials.ficsitDarkMetal);
        hopperR.position.set(2.8, 1.8 + 0.25, l / 2 + 0.8);
        group.add(hopperR);

        const assLight1 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 8), this.materials.ficsitGreenGlow);
        assLight1.position.set(-w * 0.35, h * 0.95 + 0.25, l * 0.3);
        group.add(assLight1);

        const assLight2 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 8), this.materials.ficsitGreenGlow);
        assLight2.position.set(w * 0.35, h * 0.95 + 0.25, l * 0.3);
        group.add(assLight2);
        break;

      case "storage":
        icon = "📦";
        badgeColor = "#10b981";
        w = 10.0; h = 8.0; l = 14.0;
        topHeight = 12;

        const padS = new THREE.Mesh(new THREE.BoxGeometry(w + 1.6, 0.25, l + 1.6), this.materials.machinePad);
        padS.position.y = 0.125;
        group.add(padS);

        const padBorderS = new THREE.Mesh(new THREE.BoxGeometry(w + 1.8, 0.08, l + 1.8), this.materials.foundationBorder);
        padBorderS.position.y = 0.04;
        group.add(padBorderS);

        // Corps principal renforcé (Conteneur de Stockage Industriel 48 slots FICSIT)
        const storageBody = new THREE.Mesh(new THREE.BoxGeometry(w, h * 0.9, l), this.materials.ficsitDarkMetal);
        storageBody.position.y = (h * 0.9) / 2 + 0.25;
        storageBody.castShadow = true;
        group.add(storageBody);

        // Bande centrale FICSIT Orange
        const decoBand = new THREE.Mesh(new THREE.BoxGeometry(w + 0.2, 1.4, l + 0.2), this.materials.ficsitOrange);
        decoBand.position.set(0, h * 0.5 + 0.25, 0);
        group.add(decoBand);

        // Nervures de renfort industrielles
        for (let rib = -l/2 + 2; rib <= l/2 - 2; rib += 2.5) {
          const ribMesh = new THREE.Mesh(new THREE.BoxGeometry(w + 0.15, h * 0.85, 0.4), this.materials.foundationBorder);
          ribMesh.position.set(0, (h * 0.9) / 2 + 0.25, rib);
          group.add(ribMesh);
        }

        // Ports d'entrée double en façade Sud
        const inPort1 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.2, 1.2), this.materials.ficsitSteelBlue);
        inPort1.position.set(-2.2, 1.4 + 0.25, l / 2 + 0.5);
        group.add(inPort1);

        const inPort2 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.2, 1.2), this.materials.ficsitSteelBlue);
        inPort2.position.set(-2.2, 5.2 + 0.25, l / 2 + 0.5);
        group.add(inPort2);

        // Indicateur de niveau LED vertical
        const ledJauge = new THREE.Mesh(new THREE.BoxGeometry(0.5, 5.0, 0.2), this.materials.ficsitGreenGlow);
        ledJauge.position.set(2.6, 3.8 + 0.25, l / 2 + 0.15);
        group.add(ledJauge);

        // Échelle d'accès latérale
        const ladder = new THREE.Mesh(new THREE.BoxGeometry(0.3, h * 0.85, 1.2), this.materials.ficsitYellow);
        ladder.position.set(w / 2 + 0.18, (h * 0.9) / 2 + 0.25, 0);
        group.add(ladder);

        // Rambardes supérieures (Passerelle)
        const railing = new THREE.Mesh(new THREE.BoxGeometry(w * 0.95, 0.8, l * 0.95), this.materials.foundationBorder);
        railing.position.set(0, h * 0.9 + 0.65, 0);
        group.add(railing);
        break;

      default:
        const generic = new THREE.Mesh(new THREE.BoxGeometry(8, 6, 10), this.materials.ficsitOrange);
        generic.position.y = 3;
        generic.castShadow = true;
        group.add(generic);
        break;
    }

    const cornerGeo = new THREE.BoxGeometry(0.45, h * 0.8, 0.45);
    [-w / 2, w / 2].forEach(cx => {
      [-l / 2, l / 2].forEach(cz => {
        const corner = new THREE.Mesh(cornerGeo, this.materials.ficsitDarkMetal);
        corner.position.set(cx, (h * 0.8) / 2 + 0.25, cz);
        group.add(corner);
      });
    });

    if (facing === "south") {
      group.rotation.y = Math.PI;
    }

    const buildingImg = this.resolveBuildingTexture(buildingId, options.image);

    // Borne de commande industrielle FICSIT avec écran holographique du bâtiment
    if (buildingImg) {
      const consoleGroup = new THREE.Group();
      consoleGroup.position.set(w / 2 + 0.6, 0, l * 0.15);

      // Pied métallique
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 3.2, 8), this.materials.ficsitDarkMetal);
      post.position.y = 1.6;
      post.castShadow = true;
      consoleGroup.add(post);

      // Boîtier d'écran
      const screenBox = new THREE.Mesh(new THREE.BoxGeometry(0.3, 2.5, 2.5), this.materials.ficsitOrange);
      screenBox.position.set(0.05, 3.2, 0);
      screenBox.rotation.z = -Math.PI / 12;
      consoleGroup.add(screenBox);

      // Texture écran
      const texLoader = new THREE.TextureLoader();
      texLoader.load(buildingImg, (tex) => {
        tex.minFilter = THREE.LinearFilter;
        const screenMat = new THREE.MeshBasicMaterial({
          map: tex,
          transparent: true,
          side: THREE.DoubleSide
        });
        const screenPlane = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 2.3), screenMat);
        screenPlane.position.set(0.22, 3.2, 0);
        screenPlane.rotation.y = Math.PI / 2;
        screenPlane.rotation.x = -Math.PI / 12;
        consoleGroup.add(screenPlane);
      });

      group.add(consoleGroup);
    }

    const billboard = this.createFloatingBillboard({
      title: name,
      subtitle: recipeName || name,
      rate: rate,
      power: powerMW,
      icon: icon,
      color: badgeColor,
      image: buildingImg,
      buildingId: buildingId
    });
    billboard.position.set(0, topHeight + 2.5, 0);
    group.add(billboard);

    group.userData.ficsitData = {
      name: name,
      title: name,
      subtitle: recipeName ? `Recette : ${recipeName}` : "",
      rate: rate,
      power: powerMW,
      clock: clock,
      floor: floor,
      icon: icon,
      image: buildingImg,
      buildingId: buildingId,
      links: { sources: [], targets: [] }
    };

    return group;
  }

  createConveyor3D(startVec, endVec, options = {}) {
    const group = new THREE.Group();
    const { mk = 3, resource = "iron_plate", rate = 60, floor = 0 } = options;

    const p1 = new THREE.Vector3(startVec.x, startVec.y, startVec.z);
    const p2 = new THREE.Vector3(endVec.x, endVec.y, endVec.z);

    const dist = p1.distanceTo(p2);
    if (dist < 0.15) return group;

    const beltWidth = 1.6;
    const beltThick = 0.35;

    const frameGeo = new THREE.BoxGeometry(beltWidth + 0.25, beltThick + 0.15, dist);
    const frameMesh = new THREE.Mesh(frameGeo, this.materials.conveyorFrame);
    const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
    frameMesh.position.copy(mid);
    frameMesh.lookAt(p2);
    frameMesh.castShadow = true;
    frameMesh.receiveShadow = true;
    group.add(frameMesh);

    const beltGeo = new THREE.BoxGeometry(beltWidth, beltThick, dist - 0.05);
    const beltMesh = new THREE.Mesh(beltGeo, this.materials.conveyorBelt);
    beltMesh.position.copy(mid);
    beltMesh.position.y += 0.08;
    beltMesh.lookAt(p2);
    group.add(beltMesh);

    const numArrows = Math.max(1, Math.floor(dist / 4));
    for (let i = 1; i <= numArrows; i++) {
      const frac = i / (numArrows + 1);
      const arrowPos = new THREE.Vector3().lerpVectors(p1, p2, frac);
      arrowPos.y += beltThick / 2 + 0.1;

      const arrowGeo = new THREE.ConeGeometry(0.45, 1.1, 3);
      const arrowMesh = new THREE.Mesh(arrowGeo, this.materials.conveyorArrow);
      arrowMesh.position.copy(arrowPos);
      arrowMesh.lookAt(p2);
      arrowMesh.rotateX(Math.PI / 2);
      group.add(arrowMesh);
    }



    const resColor = this.ITEM_COLORS_HEX[resource] || 0xfa9549;
    const numItems = Math.max(1, Math.floor(dist / 3.5));
    const itemMat = new THREE.MeshStandardMaterial({ color: resColor, roughness: 0.3, metalness: 0.7 });

    for (let i = 1; i <= numItems; i++) {
      const frac = i / (numItems + 1);
      const itPos = new THREE.Vector3().lerpVectors(p1, p2, frac);
      itPos.y += beltThick / 2 + 0.45;

      const itGeo = new THREE.BoxGeometry(0.8, 0.55, 0.8);
      const itMesh = new THREE.Mesh(itGeo, itemMat);
      itMesh.position.copy(itPos);
      itMesh.lookAt(p2);
      itMesh.castShadow = true;
      group.add(itMesh);
    }

    group.userData.ficsitData = {
      name: `Convoyeur Mk.${mk}`,
      title: `Convoyeur Dédié Mk.${mk} (${rate}/min)`,
      subtitle: `Ligne Pure : ${resource.replace(/_/g, ' ')}`,
      rate: `${rate} items/min`,
      floor: floor,
      icon: "🛤️",
      links: { sources: [], targets: [] }
    };

    return group;
  }

  createConveyorLift3D(x, z, bottomY, topY, resource = "iron_ingot") {
    const group = new THREE.Group();
    const h = topY - bottomY;
    const midY = bottomY + h / 2;

    // Colonne centrale de l'ascenseur de convoyeur (Lift Body)
    const towerGeo = new THREE.BoxGeometry(2.4, h, 2.4);
    const tower = new THREE.Mesh(towerGeo, this.materials.ficsitDarkMetal);
    tower.position.set(x, midY, z);
    tower.castShadow = true;
    group.add(tower);

    // Courroie / chaîne de transport intérieure verticale
    const innerBeltGeo = new THREE.BoxGeometry(1.6, h, 0.4);
    const innerBelt = new THREE.Mesh(innerBeltGeo, this.materials.conveyorBelt);
    innerBelt.position.set(x, midY, z + 1.0);
    group.add(innerBelt);

    // Vitre frontale d'inspection de flux
    const windowGeo = new THREE.BoxGeometry(2.0, h * 0.85, 0.2);
    const win = new THREE.Mesh(windowGeo, this.materials.glass);
    win.position.set(x, midY, z + 1.22);
    group.add(win);

    // Bagues de renfort et colliers FICSIT Orange
    const ringGeo = new THREE.BoxGeometry(2.6, 0.4, 2.6);
    const ringLevels = [bottomY + 1.2, bottomY + h * 0.33, bottomY + h * 0.66, topY - 1.2];
    ringLevels.forEach(ry => {
      const ring = new THREE.Mesh(ringGeo, this.materials.ficsitOrange);
      ring.position.set(x, ry, z);
      group.add(ring);
    });

    // Flèche lumineuse de flux vertical (Cyan Glow)
    const arrowGeo = new THREE.BoxGeometry(0.8, 1.4, 0.15);
    const arrow = new THREE.Mesh(arrowGeo, this.materials.conveyorArrow);
    arrow.position.set(x, midY, z + 1.28);
    group.add(arrow);

    group.userData.ficsitData = {
      name: "Élévateur de convoyeur Vertical (Lift)",
      title: "Élévateur de Convoyeur FICSIT (Lift Mk.3)",
      subtitle: `Transport Dédié ${bottomY}m ➔ ${topY}m : ${resource.replace(/_/g, ' ')}`,
      icon: "📶",
      links: { sources: [], targets: [] }
    };

    return group;
  }

  createSplitter3D(x, y, z, isMerger = false, floor = 0, itemType = "") {
    const group = new THREE.Group();
    const w = 2.8, h = 2.0, l = 2.8;

    const bodyGeo = new THREE.BoxGeometry(w, h, l);
    const body = new THREE.Mesh(bodyGeo, this.materials.ficsitDarkMetal);
    body.position.set(x, y + h / 2, z);
    body.castShadow = true;
    group.add(body);

    const capGeo = new THREE.BoxGeometry(w * 0.8, 0.35, l * 0.8);
    const capMat = isMerger ? this.materials.ficsitAmberGlow : this.materials.ficsitCyanGlow;
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.set(x, y + h + 0.175, z);
    group.add(cap);

    const portGeo = new THREE.BoxGeometry(0.35, 1.2, 1.6);
    const portLeft = new THREE.Mesh(portGeo, this.materials.ficsitOrange);
    portLeft.position.set(x - w / 2 - 0.18, y + h / 2, z);
    group.add(portLeft);

    const portRight = new THREE.Mesh(portGeo, this.materials.ficsitOrange);
    portRight.position.set(x + w / 2 + 0.18, y + h / 2, z);
    group.add(portRight);

    const itemName = itemType ? ` [${itemType.replace(/_/g, ' ')}]` : "";
    group.userData.ficsitData = {
      name: isMerger ? `Groupeur${itemName}` : `Répartiteur${itemName}`,
      title: isMerger ? `Groupeur Dédié${itemName}` : `Répartiteur Dédié${itemName}`,
      subtitle: isMerger ? "3 Entrées ➔ 1 Sortie (Ligne Pure Mono-Composant)" : "1 Entrée ➔ 3 Sorties (Ligne Pure Mono-Composant)",
      floor: floor,
      icon: isMerger ? "🔀" : "🔁"
    };

    return group;
  }

  createStorageContainer3D(x, y, z, itemName = "Produits Finis", floor = 2) {
    const group = new THREE.Group();
    const w = 8, h = 6, l = 10;

    const boxGeo = new THREE.BoxGeometry(w, h, l);
    const box = new THREE.Mesh(boxGeo, this.materials.ficsitDarkMetal);
    box.position.set(x, y + h / 2, z);
    box.castShadow = true;
    group.add(box);

    const frameGeo = new THREE.BoxGeometry(w + 0.2, h + 0.2, 0.4);
    const frameFront = new THREE.Mesh(frameGeo, this.materials.ficsitOrange);
    frameFront.position.set(x, y + h / 2, z + l / 2);
    group.add(frameFront);

    const light = new THREE.Mesh(new THREE.BoxGeometry(2, 0.5, 0.2), this.materials.ficsitGreenGlow);
    light.position.set(x, y + h - 1, z + l / 2 + 0.25);
    group.add(light);

    const bb = this.createFloatingBillboard({
      title: "Stockage Industriel",
      subtitle: itemName,
      rate: "Sortie Nette",
      icon: "📦",
      color: "#10b981"
    });
    bb.position.set(x, y + h + 2.5, z);
    group.add(bb);

    group.userData.ficsitData = {
      name: "Conteneur de Stockage Industriel",
      title: "Conteneur Tampon de Sortie",
      subtitle: `Stockage final : ${itemName}`,
      floor: floor,
      icon: "📦",
      links: { sources: [], targets: [] }
    };

    return group;
  }

  createPowerPoleMesh(x, y, z, floor = 0) {
    const group = new THREE.Group();
    const h = 9;
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.45, h, 8), this.materials.ficsitDarkMetal);
    mast.position.set(x, y + h / 2, z);
    mast.castShadow = true;
    group.add(mast);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.9, 8, 8), this.materials.ficsitAmberGlow);
    head.position.set(x, y + h, z);
    group.add(head);

    group.userData.ficsitData = {
      name: "Poteau Électrique FICSIT Mk.1",
      title: "Poteau Électrique Haute Tension",
      subtitle: "Distribution 4 Lignes",
      floor: floor,
      icon: "⚡"
    };

    return group;
  }

  createFoundationMesh(gridWidth = 6, gridLength = 6, thickness = 1, floorY = 0, isSubfloorBase = false) {
    const group = new THREE.Group();
    const tileSize = 8;

    for (let x = 0; x < gridWidth; x++) {
      for (let z = 0; z < gridLength; z++) {
        const posX = (x - (gridWidth - 1) / 2) * tileSize;
        const posZ = (z - (gridLength - 1) / 2) * tileSize;

        const slabGeo = new THREE.BoxGeometry(tileSize - 0.15, thickness, tileSize - 0.15);
        const slabMat = isSubfloorBase ? this.materials.subfloorMetalWall : this.materials.foundationConcrete;
        const slab = new THREE.Mesh(slabGeo, slabMat);
        slab.position.set(posX, floorY - thickness / 2, posZ);
        slab.receiveShadow = true;
        group.add(slab);

        if (!isSubfloorBase) {
          this.floorSlabMeshes.push(slab);

          const frameGeo = new THREE.BoxGeometry(tileSize, 0.1, 0.25);
          const borderTop = new THREE.Mesh(frameGeo, this.materials.foundationBorder);
          borderTop.position.set(posX, floorY + 0.05, posZ - tileSize / 2 + 0.12);
          group.add(borderTop);

          const centerPlateGeo = new THREE.BoxGeometry(3, 0.04, 3);
          const centerPlate = new THREE.Mesh(centerPlateGeo, this.materials.foundationGrid);
          centerPlate.position.set(posX, floorY + 0.03, posZ);
          group.add(centerPlate);
        }
      }
    }

    return group;
  }

  registerPathway(sourceElement, sourceName, targetElement, targetName, resource, rate, segments = [], description = "") {
    const pathwayData = {
      sourceElement: sourceElement,
      sourceName: sourceName,
      targetElement: targetElement,
      targetName: targetName,
      resource: resource,
      rate: rate,
      pathwaySegments: segments,
      pathDescription: description
    };

    segments.forEach(seg => {
      if (seg && seg.userData) {
        if (!seg.userData.ficsitData) {
          seg.userData.ficsitData = {};
        }
        seg.userData.ficsitData.pathway = pathwayData;
      }
    });

    if (sourceElement && sourceElement.userData?.ficsitData) {
      sourceElement.userData.ficsitData.links.targets.push({
        name: targetName,
        item: resource,
        rate: rate,
        element: targetElement,
        segments: segments
      });
    }

    if (targetElement && targetElement.userData?.ficsitData) {
      targetElement.userData.ficsitData.links.sources.push({
        name: sourceName,
        item: resource,
        rate: rate,
        element: sourceElement,
        segments: segments
      });
    }
  }

  buildFactoryFromPlan(planData, stepsData = []) {
    if (!this.init()) return;

    this.clearFactory();

    this.stepMeshes = [];
    this.allMeshes = [];
    this.labelSprites = [];
    this.floorSlabMeshes = [];

    const isMultiFloor = planData?.architectureMode === "multi_floor";
    const footprintMode = planData?.footprintMode || "auto";
    const isAutoFootprint = (footprintMode !== "compact");

    const prodSteps = planData?.productionSteps || [];
    const rawResources = planData?.rawResources || { "iron_ore": 60 };
    const rawList = Object.entries(rawResources);
    const targetItem = (planData?.targets && planData.targets[0]) || { item: "Produit Fini", rate: 10 };
    const targetName = (typeof ITEM_NAMES !== "undefined" && ITEM_NAMES[targetItem.item]) ? ITEM_NAMES[targetItem.item] : targetItem.item;
    const smelters = prodSteps.filter(s => s.building && (s.building.id === "smelter" || s.building.id === "foundry"));
    const constructors = prodSteps.filter(s => s.building && (s.building.id === "constructor"));
    const assemblers = prodSteps.filter(s => s.building && (s.building.id === "assembler" || s.building.id === "manufacturer" || s.building.id === "refinery"));

    const rawReal = rawList.length;
    const smeltReal = Math.max(1, smelters.reduce((sum, s) => sum + (s.physicalMachines || Math.ceil(s.machinesCount)), 0));
    const constReal = Math.max(1, constructors.reduce((sum, s) => sum + (s.physicalMachines || Math.ceil(s.machinesCount)), 0));
    const assReal = Math.max(1, assemblers.reduce((sum, s) => sum + (s.physicalMachines || Math.ceil(s.machinesCount)), 0));

    const smeltCount = isAutoFootprint ? smeltReal : Math.min(4, smeltReal);
    const constCount = isAutoFootprint ? constReal : Math.min(4, constReal);
    const assCount = isAutoFootprint ? assReal : Math.min(2, assReal);

    const smeltPitch = 9.0;
    const constPitch = 10.0;
    const assPitch = 14.0;
    const rawPitch = 10.0;

    const maxSpanMeters = Math.max(
      rawReal * rawPitch,
      smeltCount * smeltPitch,
      constCount * constPitch,
      assCount * assPitch
    ) + 16.0;

    const tileSize = 8;
    const gridWidth = isAutoFootprint ? Math.max(6, Math.ceil(maxSpanMeters / tileSize)) : 6;
    const gridLength = isMultiFloor ? 6 : (isAutoFootprint ? 10 : 8);
    const halfGridX = (gridWidth * tileSize) / 2;
    const halfGridZ = (gridLength * tileSize) / 2;

    const cornerMarkers = [
      { x: -halfGridX, z: -halfGridZ }, { x: halfGridX, z: -halfGridZ },
      { x: halfGridX, z: halfGridZ }, { x: -halfGridX, z: halfGridZ }
    ];

    const startSmeltX = -((smeltCount - 1) * smeltPitch) / 2;
    const startConstX = -((constCount - 1) * constPitch) / 2;
    const startAssX = -((assCount - 1) * assPitch) / 2;
    const startRawX = -((rawList.length - 1) * rawPitch) / 2;

    const H_FLOOR0 = 0;
    const H_FLOOR1 = isMultiFloor ? 18 : 0;
    const H_FLOOR2 = isMultiFloor ? 36 : 0;
    const H_FLOOR3 = isMultiFloor ? 54 : 0;

    const H_SUB0_T1 = -4.5;
    const H_SUB0_T2 = -1.8;

    const H_SUB1_T1 = 13.5;
    const H_SUB1_T2 = 16.2;

    const H_SUB2_T1 = 31.5;
    const H_SUB2_T2 = 34.2;

    const H_SUB3_T1 = 49.5;
    const H_SUB3_T2 = 52.2;

    const Z_SHAFT = -10.0;

    const rawNodeElements = [];
    const smelterNodeElements = [];
    const constructorNodeElements = [];
    const assemblerNodeElements = [];
    const storageNodeElements = [];

    if (isMultiFloor) {
      // -------------------------------------------------------------
      // ÉTAPE 0 : [RDC] Vide Sanitaire & Plancher RDC + Gaine Verticale (targetFloor: 0)
      // -------------------------------------------------------------
      const step0Group = new THREE.Group();
      const subBase0 = this.createFoundationMesh(gridWidth, gridLength, 0.6, -6.0, true);
      step0Group.add(subBase0);

      const foundation0 = this.createFoundationMesh(gridWidth, gridLength, 0.8, H_FLOOR0, false);
      step0Group.add(foundation0);

      const shaftWall = this.createVerticalShaftWall(gridWidth, 74, Z_SHAFT);
      step0Group.add(shaftWall);

      cornerMarkers.forEach(pt => {
        const marker = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 2.5, 8), this.materials.foundationBorder);
        marker.position.set(pt.x, 1.25, pt.z);
        step0Group.add(marker);
      });
      this.addStepGroup(0, "step_floor0_foundations", `1. [RDC] Vide Technique (6m) & Plancher Sol (${gridWidth * 8}m × ${gridLength * 8}m) + Mur Panneau Sandwich`, step0Group, 0);

      // -------------------------------------------------------------
      // ÉTAPE 1 : [RDC] Arrivées Multi-Ressources en Sous-Sol (targetFloor: 0)
      // -------------------------------------------------------------
      const step1Group = new THREE.Group();

      rawList.forEach(([rItem, rate], rIdx) => {
        const posX = startRawX + rIdx * rawPitch;
        const posZ = halfGridZ + 4;

        const inlet = new THREE.Mesh(new THREE.BoxGeometry(4, 1.6, 3), this.materials.ficsitDarkMetal);
        inlet.position.set(posX, 0.8, posZ);
        inlet.userData.ficsitData = {
          name: `Gisement ${rItem.replace(/_/g, ' ')}`,
          title: `Arrivée Minerai (${Math.round(rate)}/min)`,
          rate: `${Math.round(rate)}/min`,
          floor: 0,
          icon: "⛏️",
          links: { sources: [], targets: [] }
        };
        step1Group.add(inlet);

        rawNodeElements.push({ item: rItem, rate, inlet, posX, posZ });
      });
      this.addStepGroup(1, "step_floor0_raw_logistics", "2. [RDC] Arrivées Minerais Bruts (Sous-Sol Technique 6m)", step1Group, 0);

      // -------------------------------------------------------------
      // ÉTAPE 2 : [RDC] Pose des Fonderies FICSIT (targetFloor: 0)
      // -------------------------------------------------------------
      const step2Group = new THREE.Group();
      const step3Group = new THREE.Group();
      const splitters3DList = [];

      for (let i = 0; i < smeltCount; i++) {
        const posX = startSmeltX + i * smeltPitch;
        const posZ = 5;
        const sData = smelters[i % (smelters.length || 1)] || {};
        const isDual = (sData.building?.id === "foundry") || (sData.ingredients && sData.ingredients.length >= 2);
        const in1Res = (sData.ingredients && sData.ingredients[0]?.item) || (rawList[0] ? rawList[0][0] : "iron_ore");
        const in2Res = (sData.ingredients && sData.ingredients[1]?.item) || null;
        const outRes = sData.itemId || "iron_ingot";

        const smelterMesh = this.createBuildingMesh(isDual ? "foundry" : "smelter", {
          name: `${isDual ? 'Fonderie Avancée' : 'Fonderie'} #${i + 1}`,
          recipeName: sData.recipeName || "Lingots",
          rate: `+${Math.round((sData.rateProduced || 30) / smeltCount * 10) / 10}/min`,
          powerMW: Math.round((sData.powerMW || 4) / smeltCount * 10) / 10,
          clock: sData.clock || 100,
          floor: 0,
          facing: "north"
        });
        smelterMesh.position.set(posX, 0, posZ);
        step2Group.add(smelterMesh);

        if (isDual && in2Res) {
          // Entrée 1 (Gauche, X = posX - 1.8) - Tier 1 Bas (Y = H_SUB0_T1 = -4.5m)
          const holeIn1 = this.createFloorHoleMesh(posX - 1.8, 0, 10, in1Res, false, 5.2);
          step3Group.add(holeIn1);

          const splitter0_1 = this.createSplitter3D(posX - 1.8, H_SUB0_T1 - 0.5, 15.0, false, 0, in1Res);
          step3Group.add(splitter0_1);

          const subBeltIn1 = this.createConveyor3D({ x: posX - 1.8, y: H_SUB0_T1, z: 13.6 }, { x: posX - 1.8, y: H_SUB0_T1, z: 10 }, {
            mk: 3, resource: in1Res, rate: 30, floor: 0
          });
          step3Group.add(subBeltIn1);

          splitters3DList.push({ item: in1Res, posX: posX - 1.8, zPos: 15.0, yPos: H_SUB0_T1, splitter: splitter0_1, hole: holeIn1, subBelt: subBeltIn1, smelterMesh, machName: `${isDual ? 'Fonderie Avancée' : 'Fonderie'} #${i + 1}` });

          // Entrée 2 (Droite, X = posX + 1.8) - Tier 2 Haut (Y = H_SUB0_T2 = -1.8m)
          const holeIn2 = this.createFloorHoleMesh(posX + 1.8, 0, 10, in2Res, false, 2.5);
          step3Group.add(holeIn2);

          const splitter0_2 = this.createSplitter3D(posX + 1.8, H_SUB0_T2 - 0.5, 12.5, false, 0, in2Res);
          step3Group.add(splitter0_2);

          const subBeltIn2 = this.createConveyor3D({ x: posX + 1.8, y: H_SUB0_T2, z: 11.1 }, { x: posX + 1.8, y: H_SUB0_T2, z: 10 }, {
            mk: 3, resource: in2Res, rate: 30, floor: 0
          });
          step3Group.add(subBeltIn2);

          splitters3DList.push({ item: in2Res, posX: posX + 1.8, zPos: 12.5, yPos: H_SUB0_T2, splitter: splitter0_2, hole: holeIn2, subBelt: subBeltIn2, smelterMesh, machName: `${isDual ? 'Fonderie Avancée' : 'Fonderie'} #${i + 1}` });

        } else {
          // Entrée Unique (Centre, X = posX) - Tier 1 Bas (Y = H_SUB0_T1 = -4.5m)
          const holeIn = this.createFloorHoleMesh(posX, 0, 10, in1Res, false, 5.2);
          step3Group.add(holeIn);

          const splitter0 = this.createSplitter3D(posX, H_SUB0_T1 - 0.5, 14.0, false, 0, in1Res);
          step3Group.add(splitter0);

          const subBeltIn = this.createConveyor3D({ x: posX, y: H_SUB0_T1, z: 12.6 }, { x: posX, y: H_SUB0_T1, z: 10 }, {
            mk: 3, resource: in1Res, rate: 30, floor: 0
          });
          step3Group.add(subBeltIn);

          splitters3DList.push({ item: in1Res, posX: posX, zPos: 14.0, yPos: H_SUB0_T1, splitter: splitter0, hole: holeIn, subBelt: subBeltIn, smelterMesh, machName: `Fonderie #${i + 1}` });
        }

        // Passe-dalle de sortie avant (Z = 0)
        const holeOut = this.createFloorHoleMesh(posX, 0, 0, outRes, true, 2.5);
        step3Group.add(holeOut);

        const lift1X = posX - 1.8;
        const subBeltOut = this.createConveyor3D({ x: posX, y: H_SUB0_T2, z: 0 }, { x: lift1X, y: H_SUB0_T2, z: Z_SHAFT }, {
          mk: 3, resource: outRes, rate: 30, floor: 0
        });
        step3Group.add(subBeltOut);

        // Ascenseur de convoyeur vertical (Lift 1) montant en gaine jusqu'au sous-sol de l'Étage 1
        const lift = this.createConveyorLift3D(lift1X, Z_SHAFT, H_SUB0_T2, H_SUB1_T1, outRes);
        step3Group.add(lift);

        smelterNodeElements.push({
          mesh: smelterMesh,
          lift1: lift,
          lift1X: lift1X,
          subBeltOut,
          holeOut,
          in1Res,
          in2Res,
          outRes,
          rate: 30
        });
      }

      this.addStepGroup(2, "step_floor0_smelters", "3. [RDC] Pose des Fonderies FICSIT", step2Group, 0);

      // -------------------------------------------------------------
      // ÉTAPE 3 : [RDC] Réseau de Convoyeurs Fonderies & Lifts en Mur Sandwich
      // -------------------------------------------------------------
      const groups3D = {};
      splitters3DList.forEach(sp => {
        if (!groups3D[sp.item]) groups3D[sp.item] = [];
        groups3D[sp.item].push(sp);
      });

      Object.entries(groups3D).forEach(([item, spGroup]) => {
        const rawSrc = rawNodeElements.find(r => r.item === item) || rawNodeElements[0];
        if (rawSrc) {
          const firstSp = spGroup[0];
          const inChute = this.createConveyor3D({ x: rawSrc.posX, y: 0.8, z: rawSrc.posZ }, { x: firstSp.posX, y: firstSp.yPos, z: firstSp.zPos + 1.4 }, {
            mk: 3, resource: item, rate: rawSrc.rate || 30, floor: 0
          });
          step3Group.add(inChute);

          spGroup.forEach((sp) => {
            this.registerPathway(
              rawSrc.inlet,
              rawSrc.inlet.userData.ficsitData.name,
              sp.smelterMesh,
              sp.machName,
              item,
              30,
              [inChute, sp.splitter, sp.subBelt, sp.hole],
              `Gisement (${item.replace(/_/g, ' ')}) ➔ Puits Sud ➔ Vide Technique RDC (Tier ${sp.yPos === H_SUB0_T1 ? 'Bas' : 'Haut'}) ➔ Répartiteur ➔ ${sp.machName}`
            );
          });

          // Manifold horizontal le long du canal Z dédié UNIQUEMENT entre machines partageant la même ressource
          if (spGroup.length > 1) {
            for (let g = 0; g < spGroup.length - 1; g++) {
              const spA = spGroup[g];
              const spB = spGroup[g + 1];
              const xFrom = spA.posX + 1.4;
              const xTo = spB.posX - 1.4;
              const manifoldTrunk = this.createConveyor3D({ x: xFrom, y: spA.yPos, z: spA.zPos }, { x: xTo, y: spB.yPos, z: spB.zPos }, {
                mk: 3, resource: item, rate: 60, floor: 0
              });
              step3Group.add(manifoldTrunk);
            }
          }
        }
      });

      const pole0 = this.createPowerPoleMesh(-18, 0, 18, 0);
      step3Group.add(pole0);
      this.addStepGroup(3, "step_floor0_smelters_conveyors", "4. [RDC] Réseau de Convoyeurs Fonderies, Répartiteurs & Lifts 1 en Gaine (+18m)", step3Group, 0);

      // -------------------------------------------------------------
      // ÉTAPE 4 : [Étage 1] Plancher Sandwich Suspendu (+18m) (targetFloor: 1)
      // -------------------------------------------------------------
      const step4Group = new THREE.Group();
      const subBase1 = this.createFoundationMesh(gridWidth, gridLength, 0.6, 12.0, true);
      step4Group.add(subBase1);

      const foundation1 = this.createFoundationMesh(gridWidth, gridLength, 0.8, H_FLOOR1, false);
      step4Group.add(foundation1);

      cornerMarkers.forEach(pt => {
        const pillar = new THREE.Mesh(new THREE.BoxGeometry(2, 18, 2), this.materials.ficsitDarkMetal);
        pillar.position.set(pt.x * 0.95, 9, pt.z * 0.95);
        pillar.castShadow = true;
        step4Group.add(pillar);
      });
      this.addStepGroup(4, "step_floor1_slab", "5. [Étage 1] Plancher Sandwich Suspendu (+18m, 6m de Sous-Sol)", step4Group, 1);

      // -------------------------------------------------------------
      // ÉTAPE 5 : [Étage 1] Pose des Constructeurs FICSIT
      // -------------------------------------------------------------
      const step5Group = new THREE.Group();
      const step6Group = new THREE.Group();

      for (let i = 0; i < constCount; i++) {
        const posX = startConstX + i * constPitch;
        const posZ = 1;
        const cData = constructors[i % (constructors.length || 1)] || {};
        const inRes = (cData.ingredients && cData.ingredients[0]?.item) || "iron_ingot";
        const outRes = cData.itemId || "iron_plate";

        const constMesh = this.createBuildingMesh("constructor", {
          name: `Constructeur #${i + 1}`,
          recipeName: cData.recipeName || "Pièces usinées",
          rate: `+${Math.round((cData.rateProduced || 20) / constCount * 10) / 10}/min`,
          powerMW: Math.round((cData.powerMW || 4) / constCount * 10) / 10,
          clock: cData.clock || 100,
          floor: 1,
          facing: "south"
        });
        constMesh.position.set(posX, H_FLOOR1, posZ);
        step5Group.add(constMesh);

        // Passe-dalle d'entrée Nord (Z = -5)
        const holeIn = this.createFloorHoleMesh(posX, H_FLOOR1, -5, inRes, false, 5.2);
        step6Group.add(holeIn);

        // Splitter dédié à Z = -8
        const splitter1 = this.createSplitter3D(posX, H_SUB1_T1 - 0.5, -8, false, 1, inRes);
        step6Group.add(splitter1);

        // Branche d'alimentation perpendiculaire droite de la sortie Sud du splitter (Z=-6.6) au passe-dalle (Z=-5)
        const inSubBelt = this.createConveyor3D({ x: posX, y: H_SUB1_T1, z: -6.6 }, { x: posX, y: H_SUB1_T1, z: -5 }, {
          mk: 3,
          resource: inRes,
          rate: 30,
          floor: 1
        });
        step6Group.add(inSubBelt);

        const lift1Src = smelterNodeElements[i % (smelterNodeElements.length || 1)];
        if (lift1Src) {
          this.registerPathway(
            lift1Src.mesh,
            lift1Src.mesh.userData.ficsitData.name,
            constMesh,
            `Constructeur #${i + 1}`,
            inRes,
            30,
            [lift1Src.holeOut, lift1Src.subBeltOut, lift1Src.lift1, splitter1, inSubBelt, holeIn],
            `Fonderie ➔ Passe-dalle RDC ➔ Gaine Nord (Lift 1) ➔ Manifold Étage 1 ➔ Répartiteur Dédié #${i + 1} ➔ Constructeur #${i + 1}`
          );
        }

        const holeOut = this.createFloorHoleMesh(posX, H_FLOOR1, 7, outRes, true, 2.5);
        step6Group.add(holeOut);

        const lift2X = posX + 1.8;
        const outSubBelt = this.createConveyor3D({ x: posX, y: H_SUB1_T2, z: 7 }, { x: lift2X, y: H_SUB1_T2, z: Z_SHAFT }, {
          mk: 3,
          resource: outRes,
          rate: 20,
          floor: 1
        });
        step6Group.add(outSubBelt);

        // Lift vertical montant en gaine jusqu'au sous-sol de l'Étage 2
        const lift2 = this.createConveyorLift3D(lift2X, Z_SHAFT, H_SUB1_T2, H_SUB2_T1, outRes);
        step6Group.add(lift2);

        constructorNodeElements.push({
          mesh: constMesh,
          posX: posX,
          inSubBelt: inSubBelt,
          holeIn: holeIn,
          outSubBelt: outSubBelt,
          holeOut: holeOut,
          lift2: lift2,
          lift2X: lift2X,
          outRes: outRes
        });
      }

      this.addStepGroup(5, "step_floor1_constructors", "6. [Étage 1] Pose des Constructeurs FICSIT", step5Group, 1);

      // -------------------------------------------------------------
      // ÉTAPE 6 : [Étage 1] Réseau de Convoyeurs d'Usinage & Lifts 2 en Mur Sandwich
      // -------------------------------------------------------------
      // Liaison de tête depuis le Lift 1 principal vers le premier répartiteur
      if (smelterNodeElements[0]) {
        const lift1Head = this.createConveyor3D({ x: smelterNodeElements[0].lift1X, y: H_SUB1_T1, z: Z_SHAFT }, { x: startConstX, y: H_SUB1_T1, z: -9.4 }, {
          mk: 3,
          resource: "iron_ingot",
          rate: 60,
          floor: 1
        });
        step6Group.add(lift1Head);
      }

      // Tronçons de manifold horizontaux entre répartiteurs à Z = -8
      for (let i = 0; i < constCount - 1; i++) {
        const xFrom = startConstX + i * constPitch + 1.4;
        const xTo = startConstX + (i + 1) * constPitch - 1.4;
        const constTrunk = this.createConveyor3D({ x: xFrom, y: H_SUB1_T1, z: -8 }, { x: xTo, y: H_SUB1_T1, z: -8 }, {
          mk: 3,
          resource: "iron_ingot",
          rate: 60,
          floor: 1
        });
        step6Group.add(constTrunk);
      }

      const pole1 = this.createPowerPoleMesh(-halfGridX * 0.8, H_FLOOR1, -halfGridZ * 0.8, 1);
      step6Group.add(pole1);
      this.addStepGroup(6, "step_floor1_constructors_conveyors", "7. [Étage 1] Réseau de Convoyeurs d'Usinage & Lifts 2 en Mur Panneau Sandwich", step6Group, 1);

      // -------------------------------------------------------------
      // ÉTAPE 7 : [Étage 2] Plancher Sandwich Supérieur (+36m) (targetFloor: 2)
      // -------------------------------------------------------------
      const step7Group = new THREE.Group();
      const subBase2 = this.createFoundationMesh(gridWidth, gridLength, 0.6, 30.0, true);
      step7Group.add(subBase2);

      const foundation2 = this.createFoundationMesh(gridWidth, gridLength, 0.8, H_FLOOR2, false);
      step7Group.add(foundation2);

      cornerMarkers.forEach(pt => {
        const pillar2 = new THREE.Mesh(new THREE.BoxGeometry(2, 18, 2), this.materials.ficsitDarkMetal);
        pillar2.position.set(pt.x * 0.95, 27, pt.z * 0.95);
        pillar2.castShadow = true;
        step7Group.add(pillar2);
      });
      this.addStepGroup(7, "step_floor2_slab", "8. [Étage 2] Plancher Sandwich Supérieur (+36m, 6m de Sous-Sol)", step7Group, 2);

      // -------------------------------------------------------------
      // ÉTAPE 8 : [Étage 2] Pose des Assembleuses FICSIT
      // -------------------------------------------------------------
      const step8Group = new THREE.Group();
      const step9Group = new THREE.Group();
      const assOutLifts = [];

      const aData = assemblers[0] || {};
      const in1 = (aData.ingredients && aData.ingredients[0]?.item) || "reinforced_iron_plate";
      const in2 = (aData.ingredients && aData.ingredients[1]?.item) || "rotor";

      for (let i = 0; i < assCount; i++) {
        const posX = startAssX + i * assPitch;
        const posZ = 1;

        const assMesh = this.createBuildingMesh("assembler", {
          name: `Assembleur #${i + 1}`,
          recipeName: aData.recipeName || "Assemblage Final",
          rate: `+${Math.round((aData.rateProduced || 5) / assCount * 10) / 10}/min`,
          powerMW: Math.round((aData.powerMW || 15) / assCount * 10) / 10,
          clock: aData.clock || 100,
          floor: 2,
          facing: "north"
        });
        assMesh.position.set(posX, H_FLOOR2, posZ);
        step8Group.add(assMesh);

        // Ligne A Dédiée Ingrédient 1 (Trémie Gauche X = posX - 2.8) - Tier 1 Bas (Y = H_SUB2_T1 = 31.5m)
        const hole1 = this.createFloorHoleMesh(posX - 2.8, H_FLOOR2, 8.3, in1, false, 5.2);
        step9Group.add(hole1);

        const splitterA = this.createSplitter3D(posX - 2.8, H_SUB2_T1 - 0.5, -8.0, false, 2, in1);
        step9Group.add(splitterA);

        const branchA = this.createConveyor3D({ x: posX - 2.8, y: H_SUB2_T1, z: -6.6 }, { x: posX - 2.8, y: H_SUB2_T1, z: 8.3 }, {
          mk: 3,
          resource: in1,
          rate: 20,
          floor: 2
        });
        step9Group.add(branchA);

        // Ligne B Dédiée Ingrédient 2 (Trémie Droite X = posX + 2.8) - Tier 2 Haut (Y = H_SUB2_T2 = 34.2m)
        const hole2 = this.createFloorHoleMesh(posX + 2.8, H_FLOOR2, 8.3, in2, false, 2.5);
        step9Group.add(hole2);

        const splitterB = this.createSplitter3D(posX + 2.8, H_SUB2_T2 - 0.5, -5.0, false, 2, in2);
        step9Group.add(splitterB);

        const branchB = this.createConveyor3D({ x: posX + 2.8, y: H_SUB2_T2, z: -3.6 }, { x: posX + 2.8, y: H_SUB2_T2, z: 8.3 }, {
          mk: 3,
          resource: in2,
          rate: 20,
          floor: 2
        });
        step9Group.add(branchB);

        constructorNodeElements.forEach((cn, cnIdx) => {
          const isLine1 = (cnIdx % 2 === 0);
          const usedBranch = isLine1 ? branchA : branchB;
          const usedHole = isLine1 ? hole1 : hole2;
          const usedSplitter = isLine1 ? splitterA : splitterB;
          const usedItem = isLine1 ? in1 : in2;

          this.registerPathway(
            cn.mesh,
            cn.mesh.userData.ficsitData.name,
            assMesh,
            `Assembleur #${i + 1}`,
            usedItem,
            20,
            [cn.holeOut, cn.outSubBelt, cn.lift2, usedSplitter, usedBranch, usedHole],
            `Constructeur (${usedItem.replace(/_/g, ' ')}) ➔ Lift 2 Gaine ➔ Bus Dédié ${isLine1 ? 'A' : 'B'} ➔ Trémie ${isLine1 ? 'Gauche' : 'Droite'} Assembleur #${i + 1}`
          );
        });

        // Passe-dalle sortie avant assembleuse (Z = -6.5m)
        const outRes = targetItem.item || "product";
        const holeOut = this.createFloorHoleMesh(posX, H_FLOOR2, -6.5, outRes, true, 2.5);
        step9Group.add(holeOut);

        const lift3X = posX - 1.8;
        const subBeltOut = this.createConveyor3D({ x: posX, y: H_SUB2_T2, z: -6.5 }, { x: lift3X, y: H_SUB2_T2, z: Z_SHAFT }, {
          mk: 3, resource: outRes, rate: targetItem.rate || 10, floor: 2
        });
        step9Group.add(subBeltOut);

        // Lift 3 montant en gaine jusqu'au sous-sol de l'Étage 3 (de 34.2m à 49.5m)
        const lift3 = this.createConveyorLift3D(lift3X, Z_SHAFT, H_SUB2_T2, H_SUB3_T1, outRes);
        step9Group.add(lift3);

        assOutLifts.push({ posX, lift3X, lift3, holeOut, subBeltOut, outRes });

        assemblerNodeElements.push({
          mesh: assMesh,
          posX: posX
        });
      }

      this.addStepGroup(8, "step_floor2_assemblers", "9. [Étage 2] Pose des Assembleuses FICSIT", step8Group, 2);

      // -------------------------------------------------------------
      // ÉTAPE 9 : [Étage 2] Réseau de Convoyeurs Double Bus & Lifts 3 en Mur Sandwich
      // -------------------------------------------------------------
      // Tronçons de Bus A (Tier 1 : Z = -8.0m)
      for (let i = 0; i < assCount - 1; i++) {
        const xFrom = startAssX + i * assPitch - 2.8 + 1.4;
        const xTo = startAssX + (i + 1) * assPitch - 2.8 - 1.4;
        const trunkA = this.createConveyor3D({ x: xFrom, y: H_SUB2_T1, z: -8.0 }, { x: xTo, y: H_SUB2_T1, z: -8.0 }, {
          mk: 3,
          resource: in1,
          rate: 30,
          floor: 2
        });
        step9Group.add(trunkA);
      }

      // Tronçons de Bus B (Tier 2 : Z = -5.0m)
      for (let i = 0; i < assCount - 1; i++) {
        const xFrom = startAssX + i * assPitch + 2.8 + 1.4;
        const xTo = startAssX + (i + 1) * assPitch + 2.8 - 1.4;
        const trunkB = this.createConveyor3D({ x: xFrom, y: H_SUB2_T2, z: -5.0 }, { x: xTo, y: H_SUB2_T2, z: -5.0 }, {
          mk: 3,
          resource: in2,
          rate: 30,
          floor: 2
        });
        step9Group.add(trunkB);
      }

      const pole2 = this.createPowerPoleMesh(-halfGridX * 0.8, H_FLOOR2, halfGridZ * 0.8, 2);
      step9Group.add(pole2);
      this.addStepGroup(9, "step_floor2_assemblers_conveyors", "10. [Étage 2] Réseau de Convoyeurs Double Bus & Lifts 3 en Mur Panneau Sandwich", step9Group, 2);

      // -------------------------------------------------------------
      // ÉTAPE 10 : [Étage 3] Plancher Sandwich Suspendu (+54m) (targetFloor: 3)
      // -------------------------------------------------------------
      const step10Group = new THREE.Group();
      const subBase3 = this.createFoundationMesh(gridWidth, gridLength, 0.6, 48.0, true);
      step10Group.add(subBase3);

      const foundation3 = this.createFoundationMesh(gridWidth, gridLength, 0.8, H_FLOOR3, false);
      step10Group.add(foundation3);

      cornerMarkers.forEach(pt => {
        const pillar3 = new THREE.Mesh(new THREE.BoxGeometry(2, 18, 2), this.materials.ficsitDarkMetal);
        pillar3.position.set(pt.x * 0.95, 45, pt.z * 0.95);
        pillar3.castShadow = true;
        step10Group.add(pillar3);
      });
      this.addStepGroup(10, "step_floor3_slab", "11. [Étage 3] Plancher Sandwich Suspendu (+54m, 6m de Sous-Sol)", step10Group, 3);

      // -------------------------------------------------------------
      // ÉTAPE 11 : [Étage 3] Pose des Gros Conteneurs Industriels de Stockage
      // -------------------------------------------------------------
      const step11Group = new THREE.Group();
      const step12Group = new THREE.Group();
      const targetsList = (planData?.targets && planData.targets.length > 0) ? planData.targets : [targetItem];
      const storageCount = Math.max(1, Math.min(targetsList.length, 3));
      const storagePitch = 14.0;
      const startStorageX = -((storageCount - 1) * storagePitch) / 2;

      targetsList.slice(0, storageCount).forEach((tItem, tIdx) => {
        const sPosX = startStorageX + tIdx * storagePitch;
        const sPosZ = 0.0;
        const itName = (typeof ITEM_NAMES !== "undefined" && ITEM_NAMES[tItem.item]) ? ITEM_NAMES[tItem.item] : tItem.item;
        const itRate = Math.round((tItem.rate || 10) * 10) / 10;

        const storageMesh = this.createBuildingMesh("storage", {
          name: `Conteneur Industriel #${tIdx + 1}`,
          recipeName: `Stockage FICSIT : ${itName}`,
          rate: `+${itRate}/min`,
          powerMW: 0,
          clock: 100,
          floor: 3,
          facing: "north"
        });
        storageMesh.position.set(sPosX, H_FLOOR3, sPosZ);
        step11Group.add(storageMesh);

        // Passe-dalle d'entrée Sud devant le conteneur (Z = 8.0)
        const holeStorage = this.createFloorHoleMesh(sPosX - 2.2, H_FLOOR3, 8.0, tItem.item, false, 5.2);
        step12Group.add(holeStorage);

        // Raccordement sous-sol depuis la gaine Nord vers le passe-dalle du conteneur
        const matchingLift = assOutLifts[tIdx % assOutLifts.length];
        if (matchingLift) {
          const subBeltStorage = this.createConveyor3D({ x: matchingLift.lift3X, y: H_SUB3_T1, z: Z_SHAFT }, { x: sPosX - 2.2, y: H_SUB3_T1, z: 8.0 }, {
            mk: 3, resource: tItem.item, rate: itRate, floor: 3
          });
          step12Group.add(subBeltStorage);

          // Raccordement court de la sortie du passe-dalle au port d'entrée du conteneur
          const inBelt = this.createConveyor3D({ x: sPosX - 2.2, y: H_FLOOR3 + 0.5, z: 8.0 }, { x: sPosX - 2.2, y: H_FLOOR3 + 1.5, z: 7.0 }, {
            mk: 3, resource: tItem.item, rate: itRate, floor: 3
          });
          step12Group.add(inBelt);

          const assSrc = assemblerNodeElements[tIdx % assemblerNodeElements.length];
          if (assSrc) {
            this.registerPathway(
              assSrc.mesh,
              `Assembleur #${tIdx + 1}`,
              storageMesh,
              `Conteneur Industriel #${tIdx + 1} (${itName})`,
              tItem.item,
              itRate,
              [matchingLift.holeOut, matchingLift.subBeltOut, matchingLift.lift3, subBeltStorage, holeStorage, inBelt],
              `Assembleur ➔ Passe-dalle Étage 2 ➔ Lift 3 en Gaine (+54m) ➔ Sous-Sol Étage 3 ➔ Gros Conteneur Industriel (${itName})`
            );
          }
        }
      });

      this.addStepGroup(11, "step_floor3_storage", "12. [Étage 3] Pose des Gros Conteneurs Industriels de Stockage", step11Group, 3);

      // -------------------------------------------------------------
      // ÉTAPE 12 : [Étage 3 - Sommet] Réseau de Convoyeurs Finaux & Dôme Vitré (+70m)
      // -------------------------------------------------------------
      const roof = new THREE.Mesh(new THREE.BoxGeometry(gridWidth * tileSize, 0.4, gridLength * tileSize), this.materials.glass);
      roof.position.set(0, H_FLOOR3 + 16, 0);
      step12Group.add(roof);

      const pole3 = this.createPowerPoleMesh(-halfGridX * 0.8, H_FLOOR3, halfGridZ * 0.8, 3);
      step12Group.add(pole3);
      this.addStepGroup(12, "step_floor3_storage_conveyors", "13. [Étage 3 - Sommet] Réseau de Convoyeurs Finaux de Stockage & Dôme Vitré (+70m)", step12Group, 3);

    } else {
      // Plain-pied
      const step0Group = new THREE.Group();
      const subBase0 = this.createFoundationMesh(gridWidth, gridLength, 0.6, -6.0, true);
      step0Group.add(subBase0);
      const foundation0 = this.createFoundationMesh(gridWidth, gridLength, 0.8, 0, false);
      step0Group.add(foundation0);
      this.addStepGroup(0, "step_foundations", `1. Vide Technique (6m) & Dalle Sol (${gridWidth * 8}m × ${gridLength * 8}m)`, step0Group, 0);

      // Coordonnées d'espacement Z en ligne droite (Plain-pied) sans aucun chevauchement :
      const zRaw = halfGridZ - 8;       // Sud : Arrivées minerais
      const zSmelt = halfGridZ - 20;    // Rangée Fonderies
      const zConst = halfGridZ - 37;    // Rangée Constructeurs
      const zAss = halfGridZ - 57;      // Rangée Assembleuses
      const zStorage = halfGridZ - 73;  // Nord : Conteneurs de stockage

      const step1Group = new THREE.Group();
      const rawPitch = 10.0;
      const startRawX = -((rawList.length - 1) * rawPitch) / 2;

      rawList.forEach(([rItem, rate], rIdx) => {
        const posX = startRawX + rIdx * rawPitch;
        const posZ = zRaw;

        const inlet = new THREE.Mesh(new THREE.BoxGeometry(4, 1.6, 3), this.materials.ficsitDarkMetal);
        inlet.position.set(posX, 0.8, posZ);
        inlet.userData.ficsitData = {
          name: `Gisement ${rItem.replace(/_/g, ' ')}`,
          title: `Arrivée Minerai Principale (${Math.round(rate)}/min)`,
          rate: `${Math.round(rate)}/min`,
          floor: 0,
          icon: "⛏️",
          links: { sources: [], targets: [] }
        };
        step1Group.add(inlet);

        const rawBelt = this.createConveyor3D({ x: posX, y: 0.8, z: posZ }, { x: posX, y: H_SUB0_T1, z: zSmelt + 6 }, {
          mk: 3,
          resource: rItem,
          rate: Math.round(rate * 10) / 10,
          floor: 0
        });
        step1Group.add(rawBelt);

        rawNodeElements.push({ item: rItem, rate, inlet, inChute: rawBelt, posX });
      });
      this.addStepGroup(1, "step_raw_logistics", "2. Arrivée Minerais (En Sous-Sol)", step1Group, 0);

      const step2Group = new THREE.Group();
      const step3Group = new THREE.Group();

      for (let i = 0; i < smeltCount; i++) {
        const posX = startSmeltX + i * smeltPitch;
        const posZ = zSmelt;
        const sData = smelters[i % (smelters.length || 1)] || {};
        const inRes = (sData.ingredients && sData.ingredients[0]?.item) || (rawList[0] ? rawList[0][0] : "iron_ore");
        const outRes = sData.itemId || "iron_ingot";

        const smelterMesh = this.createBuildingMesh("smelter", {
          name: `Fonderie #${i + 1}`,
          recipeName: sData.recipeName || "Lingots",
          rate: `+${Math.round((sData.rateProduced || 30) / smeltCount * 10) / 10}/min`,
          powerMW: Math.round((sData.powerMW || 4) / smeltCount * 10) / 10,
          clock: sData.clock || 100,
          floor: 0,
          facing: "north"
        });
        smelterMesh.position.set(posX, 0, posZ);
        step2Group.add(smelterMesh);

        const holeIn = this.createFloorHoleMesh(posX, 0, zSmelt + 5, inRes, false);
        step3Group.add(holeIn);

        const inSplitter = this.createSplitter3D(posX, H_SUB0_T1 - 0.5, zSmelt + 6, false, 0, inRes);
        step3Group.add(inSplitter);

        const inBelt = this.createConveyor3D({ x: posX, y: H_SUB0_T1, z: zSmelt + 5.5 }, { x: posX, y: H_SUB0_T1, z: zSmelt + 5 }, {
          mk: 3,
          resource: inRes,
          rate: 30,
          floor: 0
        });
        step3Group.add(inBelt);

        const holeOut = this.createFloorHoleMesh(posX, 0, zSmelt - 5, outRes, true);
        step3Group.add(holeOut);

        const outBelt = this.createConveyor3D({ x: posX, y: H_SUB0_T2, z: zSmelt - 5 }, { x: posX, y: H_SUB0_T2, z: zConst + 6 }, {
          mk: 3,
          resource: outRes,
          rate: 30,
          floor: 0
        });
        step3Group.add(outBelt);

        const rawSrc = rawNodeElements[0];
        if (rawSrc) {
          this.registerPathway(
            rawSrc.inlet,
            rawSrc.inlet.userData.ficsitData.name,
            smelterMesh,
            `Fonderie #${i + 1}`,
            inRes,
            30,
            [rawSrc.inChute, inSplitter, inBelt, holeIn],
            `Gisement Sud ➔ Tapis d'entrée ➔ Manifold Sous-Sol ➔ Répartiteur #${i + 1} ➔ Fonderie #${i + 1}`
          );
        }

        smelterNodeElements.push({ mesh: smelterMesh, outBelt, holeOut, outRes, rate: 30 });
      }

      this.addStepGroup(2, "step_smelters_buildings", "3. Pose des Fonderies FICSIT", step2Group, 0);

      for (let i = 0; i < smeltCount - 1; i++) {
        const xFrom = startSmeltX + i * smeltPitch + 1.4;
        const xTo = startSmeltX + (i + 1) * smeltPitch - 1.4;
        const manifoldTrunk = this.createConveyor3D({ x: xFrom, y: H_SUB0_T1, z: zSmelt + 6 }, { x: xTo, y: H_SUB0_T1, z: zSmelt + 6 }, {
          mk: 3,
          resource: rawList[0] ? rawList[0][0] : "iron_ore",
          rate: 60,
          floor: 0
        });
        step3Group.add(manifoldTrunk);
      }

      this.addStepGroup(3, "step_smelters_conveyors", "4. Réseau de Convoyeurs Fonderies & Passe-Dalles Sous-Sol", step3Group, 0);

      const step4Group = new THREE.Group();
      const step5Group = new THREE.Group();

      for (let i = 0; i < constCount; i++) {
        const posX = startConstX + i * constPitch;
        const posZ = zConst;
        const cData = constructors[i % (constructors.length || 1)] || {};
        const inRes = (cData.ingredients && cData.ingredients[0]?.item) || "iron_ingot";
        const outRes = cData.itemId || "iron_plate";

        const constMesh = this.createBuildingMesh("constructor", {
          name: `Constructeur #${i + 1}`,
          recipeName: cData.recipeName || "Pièces usinées",
          rate: `+${Math.round((cData.rateProduced || 20) / constCount * 10) / 10}/min`,
          powerMW: Math.round((cData.powerMW || 4) / constCount * 10) / 10,
          clock: cData.clock || 100,
          floor: 0,
          facing: "north"
        });
        constMesh.position.set(posX, 0, posZ);
        step4Group.add(constMesh);

        const holeIn = this.createFloorHoleMesh(posX, 0, zConst + 5, inRes, false);
        step5Group.add(holeIn);

        const constSplitter = this.createSplitter3D(posX, H_SUB0_T1 - 0.5, zConst + 6, false, 0, inRes);
        step5Group.add(constSplitter);

        const inBelt = this.createConveyor3D({ x: posX, y: H_SUB0_T1, z: zConst + 5.5 }, { x: posX, y: H_SUB0_T1, z: zConst + 5 }, {
          mk: 3,
          resource: inRes,
          rate: 30,
          floor: 0
        });
        step5Group.add(inBelt);

        const holeOut = this.createFloorHoleMesh(posX, 0, zConst - 5, outRes, true);
        step5Group.add(holeOut);

        const outBelt = this.createConveyor3D({ x: posX, y: H_SUB0_T2, z: zConst - 5 }, { x: posX, y: H_SUB0_T2, z: zAss + 8.5 }, {
          mk: 3,
          resource: outRes,
          rate: 20,
          floor: 0
        });
        step5Group.add(outBelt);

        const sSrc = smelterNodeElements[i % (smelterNodeElements.length || 1)];
        if (sSrc) {
          this.registerPathway(
            sSrc.mesh,
            sSrc.mesh.userData.ficsitData.name,
            constMesh,
            `Constructeur #${i + 1}`,
            inRes,
            30,
            [sSrc.holeOut, sSrc.outBelt, constSplitter, inBelt, holeIn],
            `Fonderie ➔ Passe-dalle sortie ➔ Tapis dédié sous-sol ➔ Passe-dalle entrée ➔ Constructeur #${i + 1}`
          );
        }

        constructorNodeElements.push({ mesh: constMesh, outBelt, holeOut, outRes });
      }

      this.addStepGroup(4, "step_constructors_buildings", "5. Pose des Constructeurs FICSIT", step4Group, 0);

      for (let i = 0; i < constCount - 1; i++) {
        const xFrom = startConstX + i * constPitch + 1.4;
        const xTo = startConstX + (i + 1) * constPitch - 1.4;
        const constTrunk = this.createConveyor3D({ x: xFrom, y: H_SUB0_T1, z: zConst + 6 }, { x: xTo, y: H_SUB0_T1, z: zConst + 6 }, {
          mk: 3,
          resource: "iron_ingot",
          rate: 60,
          floor: 0
        });
        step5Group.add(constTrunk);
      }

      this.addStepGroup(5, "step_constructors_conveyors", "6. Réseau de Convoyeurs d'Usinage & Passe-Dalles Sous-Sol", step5Group, 0);

      const step6Group = new THREE.Group();
      const step7Group = new THREE.Group();

      for (let i = 0; i < assCount; i++) {
        const posX = startAssX + i * assPitch;
        const posZ = zAss;
        const aData = assemblers[i % (assemblers.length || 1)] || {};
        const in1 = (aData.ingredients && aData.ingredients[0]?.item) || "reinforced_iron_plate";
        const in2 = (aData.ingredients && aData.ingredients[1]?.item) || "rotor";

        const assMesh = this.createBuildingMesh("assembler", {
          name: `Assembleur #${i + 1}`,
          recipeName: aData.recipeName || "Assemblage Final",
          rate: `+${Math.round((aData.rateProduced || 5) / assCount * 10) / 10}/min`,
          powerMW: Math.round((aData.powerMW || 15) / assCount * 10) / 10,
          clock: aData.clock || 100,
          floor: 0,
          facing: "north"
        });
        assMesh.position.set(posX, 0, posZ);
        step6Group.add(assMesh);

        const in1X = posX - 2.8;
        const hole1 = this.createFloorHoleMesh(in1X, 0, zAss + 8.5, in1, false);
        step7Group.add(hole1);

        const belt1 = this.createConveyor3D({ x: in1X, y: H_SUB0_T1, z: zAss + 10 }, { x: in1X, y: H_SUB0_T1, z: zAss + 8.5 }, {
          mk: 3,
          resource: in1,
          rate: 20,
          floor: 0
        });
        step7Group.add(belt1);

        const in2X = posX + 2.8;
        const hole2 = this.createFloorHoleMesh(in2X, 0, zAss + 8.5, in2, false);
        step7Group.add(hole2);

        const belt2 = this.createConveyor3D({ x: in2X, y: H_SUB0_T2, z: zAss + 10 }, { x: in2X, y: H_SUB0_T2, z: zAss + 8.5 }, {
          mk: 3,
          resource: in2,
          rate: 20,
          floor: 0
        });
        step7Group.add(belt2);

        constructorNodeElements.forEach((cn, cnIdx) => {
          const isLine1 = (cnIdx % 2 === 0);
          const usedBelt = isLine1 ? belt1 : belt2;
          const usedHole = isLine1 ? hole1 : hole2;
          const usedItem = isLine1 ? in1 : in2;

          this.registerPathway(
            cn.mesh,
            cn.mesh.userData.ficsitData.name,
            assMesh,
            `Assembleur #${i + 1}`,
            usedItem,
            20,
            [cn.holeOut, cn.outBelt, usedBelt, usedHole],
            `Constructeur (${usedItem.replace(/_/g, ' ')}) ➔ Ligne Dédiée Sous-Sol ➔ Passe-dalle ${isLine1 ? 'Gauche' : 'Droite'} ➔ Assembleur #${i + 1}`
          );
        });

        assemblerNodeElements.push({ mesh: assMesh });
      }

      this.addStepGroup(6, "step_assemblers_buildings", "7. Pose des Assembleuses FICSIT", step6Group, 0);

      const finalBelt = this.createConveyor3D({ x: 0, y: 0.8, z: zAss - 8.5 }, { x: 0, y: 1.5, z: zStorage + 5.5 }, {
        mk: 3,
        resource: targetItem.item || "product",
        rate: targetItem.rate || 10,
        floor: 0
      });
      step7Group.add(finalBelt);

      this.addStepGroup(7, "step_assemblers_conveyors", "8. Réseau de Convoyeurs d'Assemblage & Bus Dédiés Sous-Sol", step7Group, 0);

      const step8Group = new THREE.Group();
      const storage = this.createBuildingMesh("storage", {
        name: "Conteneur Industriel #1",
        recipeName: `Stockage FICSIT : ${targetName}`,
        rate: `+${targetItem.rate || 10}/min`,
        powerMW: 0,
        clock: 100,
        floor: 0,
        facing: "north"
      });
      storage.position.set(0, 0, zStorage);
      step8Group.add(storage);

      if (assemblerNodeElements[0]) {
        this.registerPathway(
          assemblerNodeElements[0].mesh,
          assemblerNodeElements[0].mesh.userData.ficsitData.name,
          storage,
          "Conteneur Industriel",
          targetItem.item || "product",
          targetItem.rate || 10,
          [finalBelt],
          `Sortie Assembleur ➔ Convoyeur final dédié ➔ Conteneur Industriel de Stockage`
        );
      }

      cornerMarkers.forEach(p => {
        step8Group.add(this.createPowerPoleMesh(p.x * 0.8, 0, p.z * 0.8, 0));
      });
      this.addStepGroup(8, "step_output_storage", "9. Gros Conteneurs Industriels & Mise sous tension", step8Group, 0);
    }

    this.fitCameraToScene(gridWidth, isMultiFloor ? 4 : 1);
    this.goToStep(0, this.viewMode);
  }

  addStepGroup(stepIndex, baseId, title, group, floor = 0) {
    group.userData = { stepIndex, baseId, title, floor };
    this.scene.add(group);

    this.stepMeshes.push({
      stepIndex,
      baseId,
      title,
      floor,
      group
    });

    group.traverse((child) => {
      if (child.isMesh) {
        this.allMeshes.push(child);
      }
    });
  }

  clearFactory() {
    this.stepMeshes.forEach(st => {
      this.scene.remove(st.group);
      st.group.traverse(child => {
        if (child.geometry) child.geometry.dispose();
      });
    });
    this.stepMeshes = [];
    this.allMeshes = [];
    this.labelSprites = [];
    this.floorSlabMeshes = [];
    this.hoveredObject = null;
    this.selectedObject = null;
    this.activeHighlightedObjects = [];
    this.hideTooltip();
  }

  setFloorFilter(floorIndex) {
    this.currentFloorFilter = floorIndex;

    this.stepMeshes.forEach((st) => {
      const fl = st.floor !== undefined ? st.floor : 0;

      if (floorIndex === "all" || floorIndex === null || floorIndex === undefined) {
        st.group.visible = (this.viewMode === "full" || this.viewMode === "ghost") || (st.stepIndex <= this.currentStepIndex);
        if (this.viewMode === "ghost" && st.stepIndex > this.currentStepIndex) {
          this.applyMeshVisibility(st.group, "ghost");
        } else {
          this.applyMeshVisibility(st.group, (st.stepIndex === this.currentStepIndex) ? "active" : "normal");
        }
      } else {
        const targetFloorNum = parseInt(floorIndex, 10);
        if (fl === targetFloorNum) {
          st.group.visible = true;
          if (this.viewMode === "ghost" && st.stepIndex > this.currentStepIndex) {
            this.applyMeshVisibility(st.group, "ghost");
          } else {
            this.applyMeshVisibility(st.group, (st.stepIndex === this.currentStepIndex) ? "active" : "normal");
          }
        } else if (fl < targetFloorNum) {
          st.group.visible = true;
          this.applyMeshVisibility(st.group, "normal");
        } else {
          if (this.viewMode === "ghost") {
            st.group.visible = true;
            this.applyMeshVisibility(st.group, "ghost");
          } else {
            st.group.visible = false;
          }
        }
      }
    });

    if (this.controls && this.camera) {
      const targetY = (floorIndex === "all" || floorIndex === null) ? 14 : (parseInt(floorIndex, 10) * 14 + 5);
      const deltaY = targetY - this.controls.target.y;
      this.camera.position.y += deltaY;
      this.controls.target.set(0, targetY, 0);
      this.controls.update();
    }
  }

  goToStep(targetStepIndex, mode = "step") {
    this.currentStepIndex = targetStepIndex;
    this.viewMode = mode;

    this.stepMeshes.forEach((st, idx) => {
      if (mode === "full") {
        st.group.visible = true;
        this.applyMeshVisibility(st.group, "normal");
      } else if (mode === "ghost") {
        st.group.visible = true;
        if (idx < targetStepIndex) {
          this.applyMeshVisibility(st.group, "normal");
        } else if (idx === targetStepIndex) {
          this.applyMeshVisibility(st.group, "active");
        } else {
          this.applyMeshVisibility(st.group, "ghost");
        }
      } else {
        if (idx <= targetStepIndex) {
          st.group.visible = true;
          this.applyMeshVisibility(st.group, idx === targetStepIndex ? "active" : "normal");
        } else {
          st.group.visible = false;
        }
      }
    });

    if (this.currentFloorFilter !== "all" && this.currentFloorFilter !== null && this.currentFloorFilter !== undefined && mode !== "ghost") {
      this.setFloorFilter(this.currentFloorFilter);
    }
  }

  applyMeshVisibility(group, mode) {
    group.traverse(child => {
      if (child.isMesh) {
        if (mode === "ghost") {
          if (!child.userData.origMaterial) child.userData.origMaterial = child.material;
          child.material = this.materials.ghostHologram;
        } else {
          if (child.userData.origMaterial) {
            child.material = child.userData.origMaterial;
          }
        }
      }
      if (child.isSprite) {
        child.visible = (mode !== "ghost") && this.showLabels;
      }
    });
  }

  setCameraPreset(preset) {
    if (!this.camera || !this.controls) return;

    const t = this.controls.target;
    switch (preset) {
      case "iso":
        this.camera.position.set(t.x + 55, t.y + 45, t.z + 65);
        break;
      case "top":
        this.camera.position.set(t.x + 0.01, t.y + 90, t.z);
        break;
      case "front":
        this.camera.position.set(t.x, t.y + 16, t.z + 80);
        break;
      case "side":
        this.camera.position.set(t.x + 80, t.y + 16, t.z);
        break;
    }
    this.controls.update();
  }

  fitCameraToScene(gridWidth = 6, numFloors = 4) {
    if (!this.camera || !this.controls) return;
    const span = Math.max((gridWidth || 6) * 8, 48);
    const camDist = span * 1.15;
    const targetY = Math.min(((numFloors || 4) * 18) / 2, 28);
    this.camera.position.set(camDist * 0.85, camDist * 0.75, camDist * 0.95);
    this.controls.target.set(0, targetY, 0);
    this.controls.update();
  }

  resize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth || 800;
    const height = this.container.clientHeight || 520;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    this.animationFrameId = requestAnimationFrame(this.animate);
    if (this.controls) {
      this.controls.update();
    }
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.renderer && this.renderer.domElement) {
      this.renderer.domElement.remove();
    }
    this.isInitialized = false;
  }
}

if (typeof window !== "undefined") {
  window.Factory3DViewer = Factory3DViewer;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = { Factory3DViewer };
}
