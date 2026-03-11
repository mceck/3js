import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function createCamera(canvas, gridWidth, gridHeight) {
  // Calculate view size based on grid
  const maxDim = Math.max(gridWidth || 7, gridHeight || 7);
  const viewSize = maxDim * 0.9;

  const aspect = window.innerWidth / window.innerHeight;
  const camera = new THREE.OrthographicCamera(
    -viewSize * aspect / 2,
    viewSize * aspect / 2,
    viewSize / 2,
    -viewSize / 2,
    0.1,
    100
  );

  // Isometric-like angle
  const dist = 15;
  const angle = Math.PI / 4; // 45 degrees rotation
  const tilt = Math.atan(1 / Math.sqrt(2)); // ~35.26 degrees - true isometric

  camera.position.set(
    dist * Math.sin(angle) * Math.cos(tilt),
    dist * Math.sin(tilt),
    dist * Math.cos(angle) * Math.cos(tilt)
  );
  camera.lookAt(0, 0, 0);

  return camera;
}

export function createControls(camera, canvas) {
  const controls = new OrbitControls(camera, canvas);
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.rotateSpeed = 0.5;

  // Limit zoom
  controls.minZoom = 0.5;
  controls.maxZoom = 2.5;

  // Limit vertical rotation
  controls.minPolarAngle = Math.PI / 6;
  controls.maxPolarAngle = Math.PI / 3;

  controls.target.set(0, 0, 0);
  controls.update();

  return controls;
}

export function updateCameraSize(camera, gridWidth, gridHeight) {
  const maxDim = Math.max(gridWidth || 7, gridHeight || 7);
  const viewSize = maxDim * 0.9;
  const aspect = window.innerWidth / window.innerHeight;

  camera.left = -viewSize * aspect / 2;
  camera.right = viewSize * aspect / 2;
  camera.top = viewSize / 2;
  camera.bottom = -viewSize / 2;
  camera.updateProjectionMatrix();
}
