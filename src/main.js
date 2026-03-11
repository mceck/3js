import * as THREE from 'three';
import { createCamera, createControls, updateCameraSize } from './camera.js';
import { Game } from './game.js';
import { COLORS } from './materials.js';

// Scene setup
const canvas = document.getElementById('game-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color(COLORS.fog);
scene.fog = new THREE.FogExp2(COLORS.fog, 0.04);

// Lighting
const ambientLight = new THREE.AmbientLight(COLORS.ambient, 1.5);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0x4466aa, 0.8);
dirLight.position.set(5, 10, 5);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 1024;
dirLight.shadow.mapSize.height = 1024;
dirLight.shadow.camera.near = 0.5;
dirLight.shadow.camera.far = 30;
dirLight.shadow.camera.left = -10;
dirLight.shadow.camera.right = 10;
dirLight.shadow.camera.top = 10;
dirLight.shadow.camera.bottom = -10;
scene.add(dirLight);

// Subtle fill light
const fillLight = new THREE.DirectionalLight(0x220044, 0.3);
fillLight.position.set(-5, 5, -5);
scene.add(fillLight);

// Camera
let camera = createCamera(canvas);
let controls = createControls(camera, canvas);

// Game
const game = new Game(scene);
game.onLevelLoaded = (gridWidth, gridHeight) => {
  updateCameraSize(camera, gridWidth, gridHeight);
  controls.target.set(0, 0, 0);
  controls.update();
};

// Input handling
const keyMap = {
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  KeyW: [0, -1],
  KeyS: [0, 1],
  KeyA: [-1, 0],
  KeyD: [1, 0],
};

document.addEventListener('keydown', (e) => {
  // Ignore if title screen is visible
  const titleScreen = document.getElementById('title-screen');
  if (titleScreen && !titleScreen.classList.contains('hidden')) return;

  // Ignore if level complete overlay is visible
  const completeOverlay = document.getElementById('level-complete');
  if (completeOverlay && !completeOverlay.classList.contains('hidden')) return;

  if (e.code in keyMap) {
    e.preventDefault();
    const [dx, dz] = keyMap[e.code];

    // Transform movement by camera rotation
    const dir = transformDirection(dx, dz, controls);
    game.handleMove(dir.dx, dir.dz);
  }

  if (e.code === 'KeyZ') {
    e.preventDefault();
    game.undo();
  }

  if (e.code === 'KeyR') {
    e.preventDefault();
    game.reset();
  }
});

// Transform grid movement based on camera rotation
function transformDirection(dx, dz, controls) {
  const azimuth = controls.getAzimuthalAngle();

  // Snap to nearest 90-degree increment
  const snapped = Math.round(azimuth / (Math.PI / 2)) * (Math.PI / 2);
  const cos = Math.round(Math.cos(snapped));
  const sin = Math.round(Math.sin(snapped));

  return {
    dx: dx * cos + dz * sin,
    dz: -dx * sin + dz * cos,
  };
}

// Handle window resize
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  if (game.grid) {
    updateCameraSize(camera, game.grid.width, game.grid.height);
  }
});

// Render loop
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const elapsed = clock.getElapsedTime();

  controls.update();
  game.update(elapsed);
  renderer.render(scene, camera);
}

animate();
