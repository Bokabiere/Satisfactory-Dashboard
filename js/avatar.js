const AVATAR_CONTAINER_ID = 'ficsit-global-search-bubble';
const MODEL_PATH = 'Avatar/Animation/Talking.fbx';

// Fallback animations
const ANIM_FILES = [
  { path: 'Avatar/Animation/Talking.fbx', name: 'talking', loop: true },
  { path: 'Avatar/Animation/Thinking.fbx', name: 'thinking', loop: true },
  { path: 'Avatar/Animation/Victory Idle.fbx', name: 'victory', loop: true },
  { path: 'Avatar/Animation/Whatever Gesture.fbx', name: 'whatever', loop: false },
  { path: 'Avatar/Animation/Silly Dancing.fbx', name: 'dancing', loop: true }
];

let scene, camera, renderer, mixer, clock;
let avatarModel;
let actions = {};
let currentAction = null;
let currentAnimIndex = 0;

function initAvatar() {
  const container = document.getElementById(AVATAR_CONTAINER_ID);
  if (!container) return;

  // Set container styles to override the old bubble CSS
  container.style.position = 'fixed';
  container.style.bottom = '20px';
  container.style.right = '20px';
  container.style.width = '120px';
  container.style.height = '120px';
  container.style.zIndex = '9999999'; // Modifié pour être au-dessus du modal (999999)
  container.style.cursor = 'pointer';
  container.style.transition = 'transform 0.2s ease-in-out';
  container.style.setProperty('background', 'transparent', 'important');
  container.style.setProperty('border', 'none', 'important');
  container.style.setProperty('box-shadow', 'none', 'important');
  container.style.borderRadius = '0';
  
  // --- Speech Bubble ---
  const speechBubble = document.createElement('div');
  speechBubble.textContent = "Besoin d'aide ?";
  speechBubble.style.position = 'absolute';
  speechBubble.style.top = '-20px';
  speechBubble.style.left = '50%';
  speechBubble.style.transform = 'translateX(-50%)';
  speechBubble.style.background = 'white';
  speechBubble.style.color = '#333';
  speechBubble.style.padding = '6px 12px';
  speechBubble.style.borderRadius = '12px';
  speechBubble.style.fontSize = '12px';
  speechBubble.style.fontWeight = 'bold';
  speechBubble.style.whiteSpace = 'nowrap';
  speechBubble.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
  speechBubble.style.pointerEvents = 'none';
  speechBubble.style.fontFamily = 'sans-serif';
  speechBubble.style.opacity = '0.9';
  
  const triangle = document.createElement('div');
  triangle.style.position = 'absolute';
  triangle.style.bottom = '-6px';
  triangle.style.left = '50%';
  triangle.style.transform = 'translateX(-50%)';
  triangle.style.borderWidth = '6px 6px 0';
  triangle.style.borderStyle = 'solid';
  triangle.style.borderColor = 'white transparent transparent transparent';
  speechBubble.appendChild(triangle);

  container.appendChild(speechBubble);
  // ---------------------

  // --- Drag & Drop ---
  let isDragging = false;
  let startX, startY;
  let initialLeft, initialTop;
  let hasDragged = false;

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    hasDragged = false;
    startX = e.clientX;
    startY = e.clientY;
    
    const rect = container.getBoundingClientRect();
    container.style.right = 'auto';
    container.style.bottom = 'auto';
    container.style.left = rect.left + 'px';
    container.style.top = rect.top + 'px';
    
    initialLeft = rect.left;
    initialTop = rect.top;
    
    container.style.cursor = 'grabbing';
    container.style.transition = 'none';
    e.preventDefault(); // Prevent text selection
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      hasDragged = true;
    }
    
    container.style.left = (initialLeft + dx) + 'px';
    container.style.top = (initialTop + dy) + 'px';
  });

  window.addEventListener('mouseup', (e) => {
    if (isDragging) {
      isDragging = false;
      container.style.cursor = 'pointer';
      container.style.transition = 'transform 0.2s ease-in-out';
    }
  });

  // Capture click event to prevent search modal if we dragged
  container.addEventListener('click', (e) => {
    if (hasDragged) {
      e.stopPropagation();
      e.preventDefault();
      hasDragged = false;
    }
  }, true);
  // -------------------

  // Disable default CSS hover by overwriting event listeners
  container.addEventListener('mouseenter', () => {
    if (!isDragging) container.style.transform = 'scale(1.1)';
  });
  container.addEventListener('mouseleave', () => {
    if (!isDragging) container.style.transform = 'scale(1.0)';
  });

  scene = new THREE.Scene();
  clock = new THREE.Clock();

  const width = 120;
  const height = 120;
  camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000);
  camera.position.set(0, 0, 200);

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.domElement.style.pointerEvents = 'none'; // Let events pass to container
  container.appendChild(renderer.domElement);

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
  hemiLight.position.set(0, 200, 0);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(0, 200, 100);
  dirLight.castShadow = true;
  scene.add(dirLight);

  const loader = new THREE.FBXLoader();
  
  loader.load(MODEL_PATH, (object) => {
    avatarModel = object;
    
    // Auto-scale
    const box = new THREE.Box3().setFromObject(avatarModel);
    const size = box.getSize(new THREE.Vector3());
    
    if (size.y > 0) {
        const targetHeight = 90; 
        const scaleFactor = targetHeight / size.y;
        avatarModel.scale.set(scaleFactor, scaleFactor, scaleFactor);
    }

    // Center vertically
    const newBox = new THREE.Box3().setFromObject(avatarModel);
    const newSize = newBox.getSize(new THREE.Vector3());
    avatarModel.position.y = -(newSize.y / 2);

    scene.add(avatarModel);

    mixer = new THREE.AnimationMixer(avatarModel);
    
    if (object.animations && object.animations.length > 0) {
      const anim = object.animations[0];
      const action = mixer.clipAction(anim);
      actions['idle'] = action;
      action.play();
    }
    
    // Load other animations
    ANIM_FILES.forEach(anim => {
      loadAnimation(loader, anim.path, anim.name, anim.loop ? THREE.LoopRepeat : THREE.LoopOnce);
    });

    animate();

  }, undefined, (error) => {
    console.error("FBX Load Error: ", error);
  });
}

function loadAnimation(loader, path, name, loopMode) {
  loader.load(path, (object) => {
    if (object.animations && object.animations.length > 0) {
      const anim = object.animations[0];
      const action = mixer.clipAction(anim);
      if (loopMode === THREE.LoopOnce) {
        action.setLoop(THREE.LoopOnce);
        action.clampWhenFinished = true;
      }
      actions[name] = action;
    }
  });
}

function playAvatarAnimation(name) {
  if (!actions[name] || !mixer) return;
  if (currentAction === actions[name]) return;

  const prevAction = currentAction;
  currentAction = actions[name];
  
  currentAction.reset();
  currentAction.play();
  
  if (prevAction) {
    currentAction.crossFadeFrom(prevAction, 0.5, true);
  }
}

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);
  renderer.render(scene, camera);
}

document.addEventListener('DOMContentLoaded', initAvatar);
