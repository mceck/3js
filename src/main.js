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
renderer.toneMappingExposure = 1.15;

const scene = new THREE.Scene();
scene.background = new THREE.Color(COLORS.fog);
scene.fog = new THREE.FogExp2(COLORS.fog, 0.006);

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
  0.4,   // strength
  0.3,   // radius
  0.25   // threshold
);
composer.addPass(bloomPass);

// Vignette - subtle dark edges
const vignettePass = new ShaderPass(VignetteShader);
vignettePass.uniforms['darkness'].value = 0.8;
vignettePass.uniforms['offset'].value = 1.1;
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
    game.handleMove(dx, dz);
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
    game.handleMove(dx, dz);
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
const CAMERA_ROTATION_LERP = 0.04;
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

  // Auto-rotate camera to stay behind player's last movement direction
  if (game.lastMoveDir) {
    const { dx, dz } = game.lastMoveDir;
    const targetAzimuth = Math.atan2(-dx, -dz);
    const currentAzimuth = controls.getAzimuthalAngle();

    let diff = targetAzimuth - currentAzimuth;
    while (diff > Math.PI) diff -= 2 * Math.PI;
    while (diff < -Math.PI) diff += 2 * Math.PI;

    if (Math.abs(diff) > 0.005) {
      const newAzimuth = currentAzimuth + diff * CAMERA_ROTATION_LERP;
      const polar = controls.getPolarAngle();
      const distance = camera.position.distanceTo(controls.target);

      camera.position.x = controls.target.x + distance * Math.sin(polar) * Math.sin(newAzimuth);
      camera.position.y = controls.target.y + distance * Math.cos(polar);
      camera.position.z = controls.target.z + distance * Math.sin(polar) * Math.cos(newAzimuth);
      camera.lookAt(controls.target);
    }
  }

  controls.update();
  game.update(elapsed);
  ambientParticles.update(elapsed);

  composer.render();
}

animate();
