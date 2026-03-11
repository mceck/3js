import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { VignetteShader } from 'three/addons/shaders/VignetteShader.js';
import { createCamera, createControls, updateCameraSize, snapRotateCamera } from './camera.js';
import { Game } from './game.js';
import { AmbientParticles } from './particles.js';
import { COLORS } from './materials.js';

// Scene setup
const canvas = document.getElementById('game-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.4;

const scene = new THREE.Scene();
scene.background = new THREE.Color(COLORS.fog);
scene.fog = new THREE.FogExp2(COLORS.fog, 0.018);

// Lighting
const ambientLight = new THREE.AmbientLight(COLORS.ambient, 2.5);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0x5566cc, 0.9);
dirLight.position.set(5, 12, 5);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
dirLight.shadow.camera.near = 0.5;
dirLight.shadow.camera.far = 35;
dirLight.shadow.camera.left = -12;
dirLight.shadow.camera.right = 12;
dirLight.shadow.camera.top = 12;
dirLight.shadow.camera.bottom = -12;
dirLight.shadow.bias = -0.001;
scene.add(dirLight);

// Fill light from opposite side
const fillLight = new THREE.DirectionalLight(0x443388, 0.6);
fillLight.position.set(-5, 6, -5);
scene.add(fillLight);

// Hemisphere light for ambient color variation
const hemiLight = new THREE.HemisphereLight(0x1a1a40, 0x101018, 0.7);
scene.add(hemiLight);

// Camera
let camera = createCamera(canvas);
let controls = createControls(camera, canvas);

// Post-processing pipeline
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

// Bloom - makes emissive materials glow
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.6,   // strength
  0.3,   // radius
  0.25   // threshold
);
composer.addPass(bloomPass);

// Vignette - subtle dark edges
const vignettePass = new ShaderPass(VignetteShader);
vignettePass.uniforms['darkness'].value = 0.6;
vignettePass.uniforms['offset'].value = 1.2;
composer.addPass(vignettePass);

// Output pass for correct color space
const outputPass = new OutputPass();
composer.addPass(outputPass);

// Ambient floating particles
const ambientParticles = new AmbientParticles(scene, 250);

// Game
const game = new Game(scene);
game.onLevelLoaded = (gridWidth, gridHeight) => {
  updateCameraSize(camera, gridWidth, gridHeight);
  if (game.player) {
    const pos = game.player.group.position;
    controls.target.set(pos.x, 0, pos.z);
  } else {
    controls.target.set(0, 0, 0);
  }
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

function isOverlayActive() {
  const titleScreen = document.getElementById('title-screen');
  if (titleScreen && !titleScreen.classList.contains('hidden')) return true;
  const completeOverlay = document.getElementById('level-complete');
  if (completeOverlay && !completeOverlay.classList.contains('hidden')) return true;
  const introOverlay = document.getElementById('level-intro');
  if (introOverlay && !introOverlay.classList.contains('hidden')) return true;
  return false;
}

document.addEventListener('keydown', (e) => {
  if (isOverlayActive()) return;

  if (e.code in keyMap) {
    e.preventDefault();
    const [dx, dz] = keyMap[e.code];
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

  // Q/E for camera rotation on desktop
  if (e.code === 'KeyQ') {
    e.preventDefault();
    snapRotateCamera(controls, -1);
  }
  if (e.code === 'KeyE') {
    e.preventDefault();
    snapRotateCamera(controls, 1);
  }
});

// Transform grid movement based on camera rotation
function transformDirection(dx, dz, controls) {
  const azimuth = controls.getAzimuthalAngle();
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
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setSize(w, h);
  composer.setSize(w, h);
  bloomPass.resolution.set(w, h);
  if (game.grid) {
    updateCameraSize(camera, game.grid.width, game.grid.height);
  }
});

// Mobile D-pad controls
const dpadButtons = document.querySelectorAll('.dpad-btn[data-dx]');
dpadButtons.forEach(btn => {
  const handler = (e) => {
    e.preventDefault();
    if (isOverlayActive()) return;
    const dx = parseInt(btn.dataset.dx, 10);
    const dz = parseInt(btn.dataset.dz, 10);
    const dir = transformDirection(dx, dz, controls);
    game.handleMove(dir.dx, dir.dz);
  };
  btn.addEventListener('touchstart', handler, { passive: false });
  btn.addEventListener('mousedown', handler);
});

document.getElementById('btn-undo').addEventListener('click', () => game.undo());
document.getElementById('btn-reset').addEventListener('click', () => game.reset());

// Camera rotation buttons (mobile)
document.getElementById('btn-cam-left').addEventListener('click', () => {
  snapRotateCamera(controls, -1);
});
document.getElementById('btn-cam-right').addEventListener('click', () => {
  snapRotateCamera(controls, 1);
});

// On touch-primary devices, disable free touch rotation — use snap buttons instead
const isTouchPrimary = window.matchMedia('(pointer: coarse)').matches;
if (isTouchPrimary) {
  controls.enableRotate = false;
  controls.touches = {
    ONE: THREE.TOUCH.NONE,
    TWO: THREE.TOUCH.DOLLY_PAN,
  };
}

// Render loop
const CAMERA_LERP = 0.15;
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const elapsed = clock.getElapsedTime();

  // Smoothly follow the player with the camera target
  if (game.player) {
    const pos = game.player.group.position;
    controls.target.x += (pos.x - controls.target.x) * CAMERA_LERP;
    controls.target.z += (pos.z - controls.target.z) * CAMERA_LERP;
    controls.target.y = 0;
  }

  controls.update();
  game.update(elapsed);
  ambientParticles.update(elapsed);

  composer.render();
}

animate();
