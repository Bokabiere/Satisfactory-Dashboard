/**
 * controlRoomEngine.js - FICSIT Control Room & Tactical HUD Engine
 * Gère le radar tactique, les jauges néon, le télex télémétrique et l'inspecteur 3D éclaté.
 */

window.ControlRoomEngine = (function() {
  'use strict';

  let radarCanvas = null;
  let radarCtx = null;
  let radarAnimId = null;
  let radarAngle = 0;
  let radarBlips = [];

  let telexInterval = null;
  let crtActive = false;
  let bloomActive = true;

  let holo3DScene = null;
  let holo3DCamera = null;
  let holo3DRenderer = null;
  let holo3DControls = null;
  let holo3DAnimId = null;
  let holoBuildingGroup = null;
  let holoExplosionFactor = 0;
  let currentBuildingType = 'constructor';

  // Liste des messages FICSIT immersifs pour le télex
  const ficsitLogs = [
    { type: 'info', text: 'SYS-INIT: Réseau électrique FICSIT synchronisé. Télémétrie opérationnelle.' },
    { type: 'warn', text: 'OPTIMISATION: Rapport de productivité - Aucun temps mort toléré par FICSIT Inc.' },
    { type: 'info', text: 'M.A.M. CLOUD: Dépôt Dimensionnel connecté aux nanites de construction.' },
    { type: 'ficsit', text: 'ADA: "Rappelez-vous : le sommeil est une perte de rentabilité."' },
    { type: 'info', text: 'FLUX MINERAIS: 100% d\'acheminement nominal sur les convoyeurs principaux.' },
    { type: 'warn', text: 'RÉSEAU: Stabilisation du réseau à découpage haute tension.' },
    { type: 'ficsit', text: 'FICSIT HQ: "Votre efficacité a été enregistrée à 99.4%. Continuez ainsi."' },
    { type: 'info', text: 'RADAR: Analyse spectrale des gisements et filons purs à 3.5 km.' },
    { type: 'warn', text: 'HYDRO-FLUX: Pression des conduites de fluides stabilisée à 600 m³/min.' }
  ];

  function init() {
    initRadar();
    initGauges();
    initTelex();
    initHolo3D();
    setupControls();
  }

  /* -------------------------------------------------------------
     1. RADAR TACTIQUE CANVAS 2D
     ------------------------------------------------------------- */
  function initRadar() {
    radarCanvas = document.getElementById('ficsit-tactical-radar');
    if (!radarCanvas) return;
    radarCtx = radarCanvas.getContext('2d');

    // Générer des blips aléatoires représentatifs des gisements
    radarBlips = [
      { r: 45, angle: 0.8, type: 'iron', name: 'Fer Pur', pulse: 0 },
      { r: 90, angle: 2.1, type: 'copper', name: 'Cuivre Normal', pulse: 0 },
      { r: 120, angle: 3.7, type: 'coal', name: 'Charbon Pur', pulse: 0 },
      { r: 75, angle: 5.2, type: 'caterium', name: 'Caterium Pur', pulse: 0 },
      { r: 140, angle: 1.4, type: 'oil', name: 'Pétrole Brut', pulse: 0 },
      { r: 160, angle: 4.5, type: 'uranium', name: 'Uranium Impur', pulse: 0 },
      { r: 30, angle: 6.0, type: 'bauxite', name: 'Bauxite Pure', pulse: 0 }
    ];

    if (radarAnimId) cancelAnimationFrame(radarAnimId);
    animateRadar();
  }

  function animateRadar() {
    if (!radarCanvas || !radarCtx) return;
    const w = radarCanvas.width;
    const h = radarCanvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const maxRadius = Math.min(cx, cy) - 15;

    radarCtx.clearRect(0, 0, w, h);

    // Fond radar
    const bgGrad = radarCtx.createRadialGradient(cx, cy, 5, cx, cy, maxRadius);
    bgGrad.addColorStop(0, 'rgba(10, 25, 20, 0.95)');
    bgGrad.addColorStop(1, 'rgba(4, 12, 10, 0.98)');
    radarCtx.fillStyle = bgGrad;
    radarCtx.beginPath();
    radarCtx.arc(cx, cy, maxRadius, 0, Math.PI * 2);
    radarCtx.fill();

    // Cercles concentriques
    radarCtx.strokeStyle = 'rgba(46, 204, 113, 0.25)';
    radarCtx.lineWidth = 1;
    for (let r = maxRadius / 4; r <= maxRadius; r += maxRadius / 4) {
      radarCtx.beginPath();
      radarCtx.arc(cx, cy, r, 0, Math.PI * 2);
      radarCtx.stroke();
    }

    // Axes
    radarCtx.beginPath();
    radarCtx.moveTo(cx - maxRadius, cy);
    radarCtx.lineTo(cx + maxRadius, cy);
    radarCtx.moveTo(cx, cy - maxRadius);
    radarCtx.lineTo(cx, cy + maxRadius);
    radarCtx.stroke();

    // Balayage conique fluorescent
    radarAngle = (radarAngle + 0.025) % (Math.PI * 2);

    radarCtx.save();
    radarCtx.translate(cx, cy);
    radarCtx.rotate(radarAngle);

    // Faisceau
    radarCtx.beginPath();
    radarCtx.moveTo(0, 0);
    radarCtx.arc(0, 0, maxRadius, 0, 0.45);
    radarCtx.closePath();
    const beamGrad = radarCtx.createRadialGradient(0, 0, 0, 0, 0, maxRadius);
    beamGrad.addColorStop(0, 'rgba(46, 204, 113, 0.5)');
    beamGrad.addColorStop(1, 'rgba(46, 204, 113, 0.0)');
    radarCtx.fillStyle = beamGrad;
    radarCtx.fill();

    // Ligne frontale lumineuse
    radarCtx.beginPath();
    radarCtx.moveTo(0, 0);
    radarCtx.lineTo(maxRadius, 0);
    radarCtx.strokeStyle = '#2ecc71';
    radarCtx.lineWidth = 2;
    radarCtx.shadowColor = '#2ecc71';
    radarCtx.shadowBlur = 10;
    radarCtx.stroke();
    radarCtx.restore();

    // Dessiner les Blips
    radarBlips.forEach(blip => {
      const bx = cx + Math.cos(blip.angle) * (blip.r * (maxRadius / 180));
      const by = cy + Math.sin(blip.angle) * (blip.r * (maxRadius / 180));

      let diff = (radarAngle - blip.angle) % (Math.PI * 2);
      if (diff < 0) diff += Math.PI * 2;

      let alpha = 0.2;
      if (diff < 0.8) {
        alpha = 1.0 - (diff / 0.8) * 0.7;
        blip.pulse = Math.min(15, blip.pulse + 0.8);
      } else {
        blip.pulse = Math.max(0, blip.pulse - 0.2);
      }

      radarCtx.beginPath();
      radarCtx.arc(bx, by, 3 + blip.pulse * 0.3, 0, Math.PI * 2);
      radarCtx.fillStyle = `rgba(250, 149, 73, ${alpha})`;
      radarCtx.shadowColor = '#fa9549';
      radarCtx.shadowBlur = alpha > 0.6 ? 8 : 0;
      radarCtx.fill();

      if (alpha > 0.5) {
        radarCtx.fillStyle = `rgba(240, 244, 248, ${alpha})`;
        radarCtx.font = '9px Chakra Petch';
        radarCtx.fillText(blip.name, bx + 6, by - 4);
      }
    });

    radarAnimId = requestAnimationFrame(animateRadar);
  }

  /* -------------------------------------------------------------
     2. JAUGES NÉON & SCORE D'EFFICACITÉ
     ------------------------------------------------------------- */
  function initGauges() {
    updateGauges();
  }

  function updateGauges() {
    const powerConsElem = document.getElementById('hud-power-consumption');
    const powerCapElem = document.getElementById('hud-power-capacity');
    const powerRatioElem = document.getElementById('hud-power-ratio-fill');
    const efficiencyScoreElem = document.getElementById('hud-efficiency-score');
    const factoryLoadElem = document.getElementById('hud-factory-load');

    let capacity = 3750;
    let consumption = 2420;

    if (window.PowerCalculator && window.PowerCalculator.getTotalCapacity) {
      const calcCap = window.PowerCalculator.getTotalCapacity();
      if (calcCap > 0) capacity = calcCap;
    }

    const ratio = Math.min(100, Math.round((consumption / capacity) * 100));
    const efficiency = 98.6;

    if (powerConsElem) powerConsElem.innerText = `${consumption.toLocaleString()} MW`;
    if (powerCapElem) powerCapElem.innerText = `${capacity.toLocaleString()} MW`;
    if (powerRatioElem) powerRatioElem.style.width = `${ratio}%`;
    if (efficiencyScoreElem) efficiencyScoreElem.innerText = `${efficiency}%`;
    if (factoryLoadElem) factoryLoadElem.innerText = `${ratio}%`;
  }

  /* -------------------------------------------------------------
     3. TÉLEX DE TÉLÉMÉTRIE & LOGS FICSIT
     ------------------------------------------------------------- */
  function initTelex() {
    const container = document.getElementById('ficsit-telex-feed');
    if (!container) return;
    container.innerHTML = '';

    ficsitLogs.slice(0, 4).forEach(log => addTelexMessage(log.text, log.type));

    if (telexInterval) clearInterval(telexInterval);
    telexInterval = setInterval(() => {
      const randomLog = ficsitLogs[Math.floor(Math.random() * ficsitLogs.length)];
      const timeStr = new Date().toLocaleTimeString('fr-FR');
      addTelexMessage(`[${timeStr}] ${randomLog.text}`, randomLog.type);
    }, 4500);
  }

  function addTelexMessage(text, type = 'info') {
    const container = document.getElementById('ficsit-telex-feed');
    if (!container) return;

    const row = document.createElement('div');
    row.className = `telex-line telex-${type}`;
    row.innerText = text;
    container.prepend(row);

    while (container.children.length > 25) {
      container.removeChild(container.lastChild);
    }
  }

  /* -------------------------------------------------------------
     4. HOLO-INSPECTEUR 3D AVEC VUE ÉCLATÉE
     ------------------------------------------------------------- */
  function initHolo3D() {
    const container = document.getElementById('ficsit-holo-3d-container');
    if (!container || typeof THREE === 'undefined') return;

    container.innerHTML = '';
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 350;

    holo3DScene = new THREE.Scene();
    holo3DScene.background = new THREE.Color(0x0a0f16);

    holo3DCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    holo3DCamera.position.set(25, 20, 30);

    holo3DRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    holo3DRenderer.setSize(width, height);
    holo3DRenderer.setPixelRatio(window.devicePixelRatio || 1);
    holo3DRenderer.shadowMap.enabled = true;
    container.appendChild(holo3DRenderer.domElement);

    if (typeof THREE.OrbitControls !== 'undefined') {
      holo3DControls = new THREE.OrbitControls(holo3DCamera, holo3DRenderer.domElement);
      holo3DControls.enableDamping = true;
      holo3DControls.dampingFactor = 0.05;
      holo3DControls.autoRotate = true;
      holo3DControls.autoRotateSpeed = 1.2;
    }

    const ambientLight = new THREE.AmbientLight(0x223344, 1.2);
    holo3DScene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xfa9549, 1.5);
    dirLight1.position.set(20, 40, 20);
    holo3DScene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x3fe0d0, 1.0);
    dirLight2.position.set(-20, 20, -20);
    holo3DScene.add(dirLight2);

    const gridHelper = new THREE.GridHelper(40, 20, 0xfa9549, 0x1f3a4d);
    gridHelper.position.y = -0.05;
    holo3DScene.add(gridHelper);

    buildExplodedBuilding(currentBuildingType, 0);

    window.addEventListener('resize', onHoloResize);
    animateHolo3D();
  }

  function onHoloResize() {
    const container = document.getElementById('ficsit-holo-3d-container');
    if (!container || !holo3DRenderer || !holo3DCamera) return;
    const width = container.clientWidth;
    const height = container.clientHeight;
    holo3DCamera.aspect = width / height;
    holo3DCamera.updateProjectionMatrix();
    holo3DRenderer.setSize(width, height);
  }

  function animateHolo3D() {
    holo3DAnimId = requestAnimationFrame(animateHolo3D);
    if (holo3DControls) holo3DControls.update();
    if (holo3DRenderer && holo3DScene && holo3DCamera) {
      holo3DRenderer.render(holo3DScene, holo3DCamera);
    }
  }

  function buildExplodedBuilding(type, factor) {
    if (!holo3DScene) return;
    if (holoBuildingGroup) holo3DScene.remove(holoBuildingGroup);

    holoBuildingGroup = new THREE.Group();
    currentBuildingType = type;
    holoExplosionFactor = factor;

    const ficsitOrangeMat = new THREE.MeshStandardMaterial({
      color: 0xfa9549,
      roughness: 0.3,
      metalness: 0.8
    });
    const darkMetalMat = new THREE.MeshStandardMaterial({
      color: 0x222a35,
      roughness: 0.5,
      metalness: 0.9
    });
    const glowCyanMat = new THREE.MeshBasicMaterial({
      color: 0x3fe0d0
    });
    const glowOrangeMat = new THREE.MeshBasicMaterial({
      color: 0xffaa44
    });

    const exp = factor * 8; // Amplitude d'explosion

    // 1. Socle / Baseplate
    const baseGeo = new THREE.BoxGeometry(12, 1.2, 12);
    const baseMesh = new THREE.Mesh(baseGeo, darkMetalMat);
    baseMesh.position.set(0, 0.6 - exp * 0.5, 0);
    holoBuildingGroup.add(baseMesh);

    // 2. Cœur Technique / Moteur interne
    const coreGeo = new THREE.CylinderGeometry(2.5, 2.5, 6, 16);
    const coreMesh = new THREE.Mesh(coreGeo, glowCyanMat);
    coreMesh.position.set(0, 4.5, 0);
    holoBuildingGroup.add(coreMesh);

    // 3. Panneau Latéral Gauche
    const wallGeo = new THREE.BoxGeometry(0.8, 7, 10);
    const wallLeft = new THREE.Mesh(wallGeo, ficsitOrangeMat);
    wallLeft.position.set(-5.5 - exp, 4.5, 0);
    holoBuildingGroup.add(wallLeft);

    // 4. Panneau Latéral Droit
    const wallRight = new THREE.Mesh(wallGeo, ficsitOrangeMat);
    wallRight.position.set(5.5 + exp, 4.5, 0);
    holoBuildingGroup.add(wallRight);

    // 5. Toiture / Couvercle supérieur
    const roofGeo = new THREE.BoxGeometry(11, 0.8, 11);
    const roofMesh = new THREE.Mesh(roofGeo, darkMetalMat);
    roofMesh.position.set(0, 8.5 + exp * 1.2, 0);
    holoBuildingGroup.add(roofMesh);

    // 6. Cheminée / Tête d'usinage
    if (type === 'smelter' || type === 'refinery' || type === 'coal_generator') {
      const chimneyGeo = new THREE.CylinderGeometry(1.2, 1.8, 8, 16);
      const chimneyMesh = new THREE.Mesh(chimneyGeo, darkMetalMat);
      chimneyMesh.position.set(0, 12 + exp * 1.8, 0);
      holoBuildingGroup.add(chimneyMesh);
    } else {
      const armGeo = new THREE.BoxGeometry(2, 4, 2);
      const armMesh = new THREE.Mesh(armGeo, glowOrangeMat);
      armMesh.position.set(0, 10 + exp * 1.5, 0);
      holoBuildingGroup.add(armMesh);
    }

    // 7. Connecteurs d'entrée / sortie de convoyeurs
    const portGeo = new THREE.BoxGeometry(2.5, 2.5, 2);
    const portIn = new THREE.Mesh(portGeo, darkMetalMat);
    portIn.position.set(0, 2.5, -6 - exp * 0.8);
    const portOut = new THREE.Mesh(portGeo, darkMetalMat);
    portOut.position.set(0, 2.5, 6 + exp * 0.8);
    holoBuildingGroup.add(portIn);
    holoBuildingGroup.add(portOut);

    holo3DScene.add(holoBuildingGroup);
  }

  function setExplosionFactor(val) {
    holoExplosionFactor = parseFloat(val);
    buildExplodedBuilding(currentBuildingType, holoExplosionFactor);
  }

  function setBuildingType(type) {
    currentBuildingType = type;
    buildExplodedBuilding(currentBuildingType, holoExplosionFactor);
  }

  /* -------------------------------------------------------------
     5. CONTRÔLES HUD (SCANLINES, BLOOM, FULLSCREEN)
     ------------------------------------------------------------- */
  function setupControls() {
    const crtBtn = document.getElementById('btn-toggle-crt');
    if (crtBtn) {
      crtBtn.onclick = () => {
        crtActive = !crtActive;
        const main = document.querySelector('.ficsit-control-room-layout');
        if (main) main.classList.toggle('crt-scanlines', crtActive);
        crtBtn.classList.toggle('active', crtActive);
      };
    }

    const bloomBtn = document.getElementById('btn-toggle-bloom');
    if (bloomBtn) {
      bloomBtn.onclick = () => {
        bloomActive = !bloomActive;
        const main = document.querySelector('.ficsit-control-room-layout');
        if (main) main.classList.toggle('hologram-glow', bloomActive);
        bloomBtn.classList.toggle('active', bloomActive);
      };
    }

    const fsBtn = document.getElementById('btn-toggle-fs');
    if (fsBtn) {
      fsBtn.onclick = () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      };
    }

    const slider = document.getElementById('ficsit-explosion-slider');
    if (slider) {
      slider.oninput = (e) => setExplosionFactor(e.target.value);
    }

    const selectBuilding = document.getElementById('ficsit-holo-building-select');
    if (selectBuilding) {
      selectBuilding.onchange = (e) => setBuildingType(e.target.value);
    }

    const pingBtn = document.getElementById('btn-radar-ping');
    if (pingBtn) {
      pingBtn.onclick = () => {
        addTelexMessage(`[${new Date().toLocaleTimeString('fr-FR')}] RADAR: Balayage haute fréquence déclenché. 7 balises actualisées.`, 'warn');
        if (radarBlips) {
          radarBlips.forEach(b => b.pulse = 15);
        }
      };
    }
  }

  return {
    init,
    updateGauges,
    addTelexMessage,
    setExplosionFactor,
    setBuildingType
  };
})();
