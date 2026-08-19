/**
 * FICSIT FACTORY COMPANION - INTERACTIVE MAP ENGINE
 * High-performance 2D Canvas & Vector Topography Renderer with Pan, Zoom & Radius Analysis.
 */

class SatisfactoryMapEngine {
  constructor(canvasElement, options = {}) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d');
    this.options = options;

    // Viewport State
    this.scale = 1.0;
    this.minScale = 0.5;
    this.maxScale = 6.0;
    this.offsetX = 0;
    this.offsetY = 0;
    this.isDragging = false;
    this.dragStartX = 0;
    this.dragStartY = 0;

    // Data State
    this.nodes = (typeof RESOURCE_NODES !== 'undefined') ? [...RESOURCE_NODES] : [];
    this.filteredNodes = [...this.nodes];
    this.selectedNode = null;
    this.hoveredNode = null;
    this.activeFilters = {
      types: new Set(Object.keys(typeof RESOURCE_TYPES !== 'undefined' ? RESOURCE_TYPES : {})),
      purities: new Set(['pure', 'normal', 'impure']),
      search: ''
    };

    // Map Background Texture Layers ('satellite', 'biomes', 'tactical')
    this.mapLayer = 'satellite';
    this.satelliteImg = new Image();
    this.biomesImg = new Image();
    this.imagesLoaded = { satellite: false, biomes: false };

    this.initMapImages();

    // Tools: 'select', 'radius', 'custom_pin', 'route'
    this.currentTool = 'select';
    this.radiusCenter = null;
    this.radiusDistance = 150; // in map units (approx 1.5km)
    this.customPins = this.loadCustomPins();
    this.routePoints = [];

    // Callbacks
    this.onNodeSelect = options.onNodeSelect || (() => {});
    this.onRadiusUpdate = options.onRadiusUpdate || (() => {});
    this.onPinUpdate = options.onPinUpdate || (() => {});
    this.onRouteMeasured = options.onRouteMeasured || (() => {});

    // Init
    this.initEventListeners();
    this.resize();
    this.resetView();
  }

  initMapImages() {
    const satSrc = (typeof MAP_TEXTURES !== 'undefined' && MAP_TEXTURES.satellite) 
      ? MAP_TEXTURES.satellite 
      : 'images/satisfactory_map.jpg';
    
    const bioSrc = (typeof MAP_TEXTURES !== 'undefined' && MAP_TEXTURES.biomes) 
      ? MAP_TEXTURES.biomes 
      : 'images/satisfactory_biomes.jpg';

    this.satelliteImg.onload = () => {
      this.imagesLoaded.satellite = true;
      this.render();
    };
    this.satelliteImg.src = satSrc;

    this.biomesImg.onload = () => {
      this.imagesLoaded.biomes = true;
      this.render();
    };
    this.biomesImg.src = bioSrc;
  }

  setMapLayer(layerName) {
    this.mapLayer = layerName;
    this.render();
  }

  loadCustomPins() {
    try {
      const saved = localStorage.getItem('ficsit_map_custom_pins');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }

  saveCustomPins() {
    try {
      localStorage.setItem('ficsit_map_custom_pins', JSON.stringify(this.customPins));
    } catch (e) {}
  }

  resize() {
    if (!this.ctx) return;
    const parent = this.canvas.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.width = rect.width || 800;
    this.height = rect.height || 600;

    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);
    this.render();
  }

  resetView() {
    this.scale = Math.min(this.width, this.height) / 1050;
    this.offsetX = (this.width - 1000 * this.scale) / 2;
    this.offsetY = (this.height - 1000 * this.scale) / 2;
    this.render();
  }

  focusBiome(biomeId) {
    const biomeNodes = this.nodes.filter(n => n.biome === biomeId);
    if (!biomeNodes.length) return;

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    biomeNodes.forEach(n => {
      if (n.x < minX) minX = n.x;
      if (n.x > maxX) maxX = n.x;
      if (n.y < minY) minY = n.y;
      if (n.y > maxY) maxY = n.y;
    });

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    this.scale = 2.2;
    this.offsetX = this.width / 2 - centerX * this.scale;
    this.offsetY = this.height / 2 - centerY * this.scale;
    this.render();
  }

  focusNode(nodeId) {
    const node = this.nodes.find(n => n.id === nodeId);
    if (!node) return;
    this.selectedNode = node;
    this.scale = 3.0;
    this.offsetX = this.width / 2 - node.x * this.scale;
    this.offsetY = this.height / 2 - node.y * this.scale;
    this.onNodeSelect(node);
    this.render();
  }

  setFilters(filters) {
    if (filters.types) this.activeFilters.types = filters.types;
    if (filters.purities) this.activeFilters.purities = filters.purities;
    if (filters.search !== undefined) this.activeFilters.search = filters.search.toLowerCase().trim();

    this.filteredNodes = this.nodes.filter(n => {
      if (!this.activeFilters.types.has(n.type)) return false;
      if (!this.activeFilters.purities.has(n.purity)) return false;
      if (this.activeFilters.search) {
        const typeMeta = (typeof RESOURCE_TYPES !== 'undefined') ? RESOURCE_TYPES[n.type] : null;
        const typeName = typeMeta ? typeMeta.name.toLowerCase() : '';
        const biomeName = (n.biome || '').toLowerCase();
        const notes = (n.notes || '').toLowerCase();
        if (!typeName.includes(this.activeFilters.search) && 
            !biomeName.includes(this.activeFilters.search) &&
            !notes.includes(this.activeFilters.search)) {
          return false;
        }
      }
      return true;
    });

    this.render();
  }

  setTool(toolName) {
    this.currentTool = toolName;
    if (toolName !== 'radius') {
      this.radiusCenter = null;
    }
    if (toolName !== 'route') {
      this.routePoints = [];
    }
    this.render();
  }

  setRadiusDistance(dist) {
    this.radiusDistance = dist;
    if (this.radiusCenter) {
      this.updateRadiusAnalysis();
    }
    this.render();
  }

  updateRadiusAnalysis() {
    if (!this.radiusCenter) return;
    const inRangeNodes = this.filteredNodes.filter(n => {
      const dx = n.x - this.radiusCenter.x;
      const dy = n.y - this.radiusCenter.y;
      return Math.sqrt(dx * dx + dy * dy) <= this.radiusDistance;
    });

    const summary = {};
    inRangeNodes.forEach(n => {
      if (!summary[n.type]) {
        summary[n.type] = { count: 0, pure: 0, normal: 0, impure: 0, totalRateMk3_250: 0 };
      }
      summary[n.type].count++;
      summary[n.type][n.purity]++;
      const out = (typeof calculateNodeOutput === 'function') 
        ? calculateNodeOutput(n, { minerTier: 3, clockSpeed: 250 })
        : { rate: 1200 };
      summary[n.type].totalRateMk3_250 += out.rate;
    });

    this.onRadiusUpdate({
      center: this.radiusCenter,
      radiusDistance: this.radiusDistance,
      totalNodes: inRangeNodes.length,
      summary: summary,
      nodes: inRangeNodes
    });
  }

  screenToWorld(screenX, screenY) {
    return {
      x: (screenX - this.offsetX) / this.scale,
      y: (screenY - this.offsetY) / this.scale
    };
  }

  worldToScreen(worldX, worldY) {
    return {
      x: worldX * this.scale + this.offsetX,
      y: worldY * this.scale + this.offsetY
    };
  }

  initEventListeners() {
    this.canvas.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const worldPos = this.screenToWorld(mouseX, mouseY);

      if (this.currentTool === 'radius') {
        this.radiusCenter = worldPos;
        this.updateRadiusAnalysis();
        this.render();
        return;
      }

      if (this.currentTool === 'route') {
        const clickedNode = this.findNodeAt(mouseX, mouseY);
        const pt = clickedNode ? { x: clickedNode.x, y: clickedNode.y, label: clickedNode.type } : { x: Math.round(worldPos.x), y: Math.round(worldPos.y) };
        
        if (this.routePoints.length >= 2) {
          this.routePoints = [pt];
        } else {
          this.routePoints.push(pt);
        }

        if (this.routePoints.length === 2) {
          const dx = this.routePoints[1].x - this.routePoints[0].x;
          const dy = this.routePoints[1].y - this.routePoints[0].y;
          const units = Math.sqrt(dx * dx + dy * dy);
          const distMeters = Math.round(units * 5.4 * 1.15); // Facteur 1.15 pour virages
          this.onRouteMeasured(distMeters, this.routePoints[0], this.routePoints[1]);
        }
        this.render();
        return;
      }

      if (this.currentTool === 'custom_pin') {
        const pinName = prompt('Nom de votre Base / Avant-poste FICSIT :', 'Usine Principale');
        if (pinName) {
          const newPin = {
            id: 'pin_' + Date.now(),
            name: pinName,
            x: Math.round(worldPos.x),
            y: Math.round(worldPos.y),
            color: '#fa9549'
          };
          this.customPins.push(newPin);
          this.saveCustomPins();
          this.onPinUpdate(this.customPins);
          this.render();
        }
        return;
      }

      const clickedNode = this.findNodeAt(mouseX, mouseY);
      if (clickedNode) {
        this.selectedNode = clickedNode;
        this.onNodeSelect(clickedNode);
        this.render();
      } else {
        this.isDragging = true;
        this.dragStartX = mouseX - this.offsetX;
        this.dragStartY = mouseY - this.offsetY;
      }
    });

    window.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      if (this.isDragging) {
        this.offsetX = mouseX - this.dragStartX;
        this.offsetY = mouseY - this.dragStartY;
        this.render();
      } else {
        const hovered = this.findNodeAt(mouseX, mouseY);
        if (hovered !== this.hoveredNode) {
          this.hoveredNode = hovered;
          this.canvas.style.cursor = hovered ? 'pointer' : (this.currentTool === 'radius' ? 'crosshair' : 'grab');
          this.render();
        }
      }
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
      const newScale = Math.max(this.minScale, Math.min(this.maxScale, this.scale * zoomFactor));

      if (newScale !== this.scale) {
        this.offsetX = mouseX - (mouseX - this.offsetX) * (newScale / this.scale);
        this.offsetY = mouseY - (mouseY - this.offsetY) * (newScale / this.scale);
        this.scale = newScale;
        this.render();
      }
    }, { passive: false });

    window.addEventListener('resize', () => this.resize());
  }

  findNodeAt(screenX, screenY) {
    const worldPos = this.screenToWorld(screenX, screenY);
    const hitRadius = 14 / this.scale;

    for (let i = this.filteredNodes.length - 1; i >= 0; i--) {
      const node = this.filteredNodes[i];
      const dx = node.x - worldPos.x;
      const dy = node.y - worldPos.y;
      if (dx * dx + dy * dy <= hitRadius * hitRadius) {
        return node;
      }
    }
    return null;
  }

  render() {
    const ctx = this.ctx;
    if (!ctx) return;
    ctx.clearRect(0, 0, this.width, this.height);

    // 1. Render Background & Terrain Map
    this.renderBackground(ctx);

    // 2. Render Biome Overlay if tactical mode or fallback
    if (this.mapLayer === 'tactical' || (!this.imagesLoaded.satellite && !this.imagesLoaded.biomes)) {
      this.renderBiomes(ctx);
    }

    // 3. Render Radius Tool Circle
    if (this.radiusCenter) {
      this.renderRadiusOverlay(ctx);
    }

    // 3b. Render Logistics Route Line
    if (this.routePoints && this.routePoints.length > 0) {
      this.renderRouteOverlay(ctx);
    }

    // 4. Render Custom Pins
    this.renderCustomPins(ctx);

    // 4b. Render Hard Drive Crash Sites
    this.renderCrashSites(ctx);

    // 5. Render Resource Nodes
    this.renderNodes(ctx);

    // 6. Render Selection Highlight & Tooltips
    this.renderOverlays(ctx);
  }

  renderBackground(ctx) {
    // Deep Ocean Background
    ctx.fillStyle = '#060a10';
    ctx.fillRect(0, 0, this.width, this.height);

    const topLeft = this.worldToScreen(0, 0);
    const mapDrawWidth = 1000 * this.scale;
    const mapDrawHeight = 1000 * this.scale;

    // Draw Real Terrain Satellite or Biome Map Image
    if (this.mapLayer === 'satellite' && this.imagesLoaded.satellite) {
      ctx.drawImage(this.satelliteImg, topLeft.x, topLeft.y, mapDrawWidth, mapDrawHeight);
    } else if (this.mapLayer === 'biomes' && this.imagesLoaded.biomes) {
      ctx.drawImage(this.biomesImg, topLeft.x, topLeft.y, mapDrawWidth, mapDrawHeight);
    }

    // Map Border Frame
    ctx.save();
    ctx.strokeStyle = 'rgba(250, 149, 73, 0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(topLeft.x, topLeft.y, mapDrawWidth, mapDrawHeight);

    // FICSIT Coordinate Grid Overlay
    ctx.strokeStyle = 'rgba(75, 179, 253, 0.08)';
    ctx.lineWidth = 1;
    const gridSize = 100 * this.scale;
    const startX = this.offsetX % gridSize;
    const startY = this.offsetY % gridSize;

    for (let x = startX; x < this.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.height);
      ctx.stroke();
    }
    for (let y = startY; y < this.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  renderBiomes(ctx) {
    ctx.save();
    const regions = [
      { name: 'Grass Fields', x: 260, y: 780, r: 160, color: 'rgba(45, 106, 79, 0.4)', border: '#2d6a4f' },
      { name: 'Northern Forest', x: 440, y: 320, r: 110, color: 'rgba(27, 67, 50, 0.4)', border: '#1b4332' },
      { name: 'Rocky Desert', x: 180, y: 260, r: 120, color: 'rgba(156, 102, 68, 0.35)', border: '#9c6644' },
      { name: 'Dune Desert', x: 810, y: 230, r: 150, color: 'rgba(221, 184, 146, 0.3)', border: '#ddb892' },
      { name: 'Crater Lakes', x: 440, y: 440, r: 80, color: 'rgba(42, 111, 151, 0.4)', border: '#2a6f97' },
      { name: 'Titan Forest', x: 580, y: 450, r: 90, color: 'rgba(64, 61, 57, 0.45)', border: '#403d39' },
      { name: 'The Swamp', x: 890, y: 540, r: 110, color: 'rgba(53, 79, 82, 0.5)', border: '#354f52' },
      { name: 'Western Coast', x: 100, y: 530, r: 80, color: 'rgba(72, 202, 228, 0.25)', border: '#48cae4' },
      { name: 'Spire Coast', x: 620, y: 150, r: 90, color: 'rgba(0, 119, 182, 0.35)', border: '#0077b6' },
      { name: 'Red Bamboo', x: 490, y: 500, r: 70, color: 'rgba(163, 112, 129, 0.4)', border: '#a37081' }
    ];

    regions.forEach(reg => {
      const pos = this.worldToScreen(reg.x, reg.y);
      const radius = reg.r * this.scale;

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = reg.color;
      ctx.fill();
      ctx.strokeStyle = reg.border;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      if (this.scale > 0.8) {
        ctx.fillStyle = 'rgba(240, 244, 248, 0.6)';
        ctx.font = `700 ${Math.max(10, Math.round(12 * this.scale))}px 'Chakra Petch', sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(reg.name.toUpperCase(), pos.x, pos.y - radius - 6);
      }
    });

    ctx.restore();
  }

  renderRadiusOverlay(ctx) {
    const pos = this.worldToScreen(this.radiusCenter.x, this.radiusCenter.y);
    const radius = this.radiusDistance * this.scale;

    ctx.save();
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(250, 149, 73, 0.15)';
    ctx.fill();
    ctx.strokeStyle = '#fa9549';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = '#fa9549';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(pos.x - 10, pos.y);
    ctx.lineTo(pos.x + 10, pos.y);
    ctx.moveTo(pos.x, pos.y - 10);
    ctx.lineTo(pos.x, pos.y + 10);
    ctx.stroke();

    ctx.fillStyle = '#fa9549';
    ctx.font = '700 12px "Chakra Petch", sans-serif';
    ctx.fillText(`RAYON RADAR: ${(this.radiusDistance * 10).toLocaleString()} m`, pos.x, pos.y + radius + 18);

    ctx.restore();
  }

  renderRouteOverlay(ctx) {
    if (!this.routePoints || this.routePoints.length === 0) return;
    ctx.save();

    // 1er Point
    const p1 = this.worldToScreen(this.routePoints[0].x, this.routePoints[0].y);
    ctx.fillStyle = '#3fe0d0';
    ctx.beginPath();
    ctx.arc(p1.x, p1.y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#3fe0d0';
    ctx.font = '700 12px "Chakra Petch", sans-serif';
    ctx.fillText('🚩 DÉPART (Gare A)', p1.x + 12, p1.y + 4);

    if (this.routePoints.length >= 2) {
      const p2 = this.worldToScreen(this.routePoints[1].x, this.routePoints[1].y);
      
      // Ligne de tracé
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.strokeStyle = '#3fe0d0';
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      // 2e Point
      ctx.fillStyle = '#fa9549';
      ctx.beginPath();
      ctx.arc(p2.x, p2.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#fa9549';
      ctx.font = '700 12px "Chakra Petch", sans-serif';
      ctx.fillText('🏁 ARRIVÉE (Gare B)', p2.x + 12, p2.y + 4);

      // Badge distance au milieu
      const midX = (p1.x + p2.x) / 2;
      const midY = (p1.y + p2.y) / 2;
      const dx = this.routePoints[1].x - this.routePoints[0].x;
      const dy = this.routePoints[1].y - this.routePoints[0].y;
      const units = Math.sqrt(dx * dx + dy * dy);
      const distMeters = Math.round(units * 5.4 * 1.15);

      const label = `📏 DISTANCE : ${distMeters.toLocaleString()} m`;
      ctx.font = '700 12px "Chakra Petch", sans-serif';
      const textWidth = ctx.measureText(label).width;

      ctx.fillStyle = 'rgba(14, 18, 23, 0.9)';
      ctx.strokeStyle = '#3fe0d0';
      ctx.lineWidth = 1.5;
      ctx.fillRect(midX - textWidth / 2 - 8, midY - 14, textWidth + 16, 26);
      ctx.strokeRect(midX - textWidth / 2 - 8, midY - 14, textWidth + 16, 26);

      ctx.fillStyle = '#3fe0d0';
      ctx.textAlign = 'center';
      ctx.fillText(label, midX, midY + 4);
    }

    ctx.restore();
  }

  renderCustomPins(ctx) {
    this.customPins.forEach(pin => {
      const pos = this.worldToScreen(pin.x, pin.y);
      ctx.save();
      ctx.fillStyle = pin.color || '#fa9549';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = '700 12px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`🚩 ${pin.name}`, pos.x, pos.y - 12);
      ctx.restore();
    });
  }

  renderCrashSites(ctx) {
    if (typeof MAM_DATA === 'undefined' || !MAM_DATA.crashSites) return;
    MAM_DATA.crashSites.forEach(crash => {
      const pos = this.worldToScreen(crash.x, crash.y);
      ctx.save();
      ctx.fillStyle = '#ff007f';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      if (this.scale > 1.2) {
        ctx.fillStyle = '#ff007f';
        ctx.font = '700 10px "Chakra Petch", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`🛸 Épave (${crash.req})`, pos.x, pos.y - 10);
      }
      ctx.restore();
    });
  }

  renderNodes(ctx) {
    this.filteredNodes.forEach(node => {
      const pos = this.worldToScreen(node.x, node.y);
      const resMeta = (typeof RESOURCE_TYPES !== 'undefined' && RESOURCE_TYPES[node.type]) 
        ? RESOURCE_TYPES[node.type] 
        : { color: '#ffffff', icon: '⛏️' };
      const isSelected = this.selectedNode && this.selectedNode.id === node.id;
      const isHovered = this.hoveredNode && this.hoveredNode.id === node.id;

      ctx.save();

      let ringColor = '#f1c40f'; // Normal
      if (node.purity === 'pure') ringColor = '#2ecc71'; // Pure (Green)
      if (node.purity === 'impure') ringColor = '#e74c3c'; // Impure (Red)

      const baseRadius = (isSelected ? 11 : (isHovered ? 10 : 8));

      // Solid Node Marker
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, baseRadius, 0, Math.PI * 2);
      ctx.fillStyle = resMeta.color;
      ctx.fill();

      // Purity Ring & Glow
      ctx.strokeStyle = ringColor;
      ctx.lineWidth = isSelected ? 3.5 : 2;
      ctx.stroke();

      ctx.shadowColor = ringColor;
      ctx.shadowBlur = isSelected ? 16 : 8;
      ctx.stroke();

      ctx.restore();
    });
  }

  renderOverlays(ctx) {
    if (this.selectedNode) {
      const pos = this.worldToScreen(this.selectedNode.x, this.selectedNode.y);
      ctx.save();
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 18, 0, Math.PI * 2);
      ctx.strokeStyle = '#fa9549';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.restore();
    }

    if (this.hoveredNode) {
      const node = this.hoveredNode;
      const pos = this.worldToScreen(node.x, node.y);
      const resMeta = (typeof RESOURCE_TYPES !== 'undefined' && RESOURCE_TYPES[node.type]) 
        ? RESOURCE_TYPES[node.type] 
        : { name: node.type };
      const purityName = node.purity === 'pure' ? 'PUR (2.0x)' : (node.purity === 'normal' ? 'NORMAL (1.0x)' : 'IMPUR (0.5x)');
      const outputMk3 = (typeof calculateNodeOutput === 'function')
        ? calculateNodeOutput(node, { minerTier: 3, clockSpeed: 250 })
        : { rate: 1200, unit: 'pièces/min' };

      const text1 = `${resMeta.icon || '⛏️'} ${resMeta.name}`;
      const text2 = `Pureté: ${purityName} • ${outputMk3.rate} ${outputMk3.unit}`;

      ctx.save();
      ctx.font = '700 12px "Inter", sans-serif';
      const textWidth = Math.max(ctx.measureText(text1).width, ctx.measureText(text2).width) + 24;
      const boxHeight = 46;
      const boxX = Math.min(this.width - textWidth - 10, Math.max(10, pos.x - textWidth / 2));
      const boxY = Math.max(10, pos.y - boxHeight - 16);

      ctx.fillStyle = 'rgba(14, 18, 23, 0.95)';
      ctx.strokeStyle = '#fa9549';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(boxX, boxY, textWidth, boxHeight, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#f0f4f8';
      ctx.textAlign = 'left';
      ctx.fillText(text1, boxX + 12, boxY + 18);

      ctx.font = '500 11px "Inter", sans-serif';
      ctx.fillStyle = '#9aaec4';
      ctx.fillText(text2, boxX + 12, boxY + 36);

      ctx.restore();
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SatisfactoryMapEngine };
}
