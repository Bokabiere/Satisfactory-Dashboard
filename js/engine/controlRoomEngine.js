/**
 * controlRoomEngine.js - FICSIT Control Room & Tactical HUD Engine
 * Gère le télex télémétrique.
 */

window.ControlRoomEngine = (function() {
  'use strict';

  let telexInterval = null;
  let crtActive = false;
  let bloomActive = true;

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
    initTelex();
    setupControls();
  }

  /* -------------------------------------------------------------
     1. TÉLEX DE TÉLÉMÉTRIE & LOGS FICSIT
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
     2. CONTRÔLES HUD (SCANLINES, BLOOM, FULLSCREEN)
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
  }

  return {
    init,
    addTelexMessage
  };
})();
