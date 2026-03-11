import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function createCamera(canvas, gridWidth, gridHeight) {
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
  const angle = Math.PI / 4;
  const tilt = Math.atan(1 / Math.sqrt(2));

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

// Smoothly snap-rotate the camera by 90 degrees
// direction: +1 = clockwise, -1 = counter-clockwise
export function snapRotateCamera(controls, direction) {
  const currentAzimuth = controls.getAzimuthalAngle();
  const snappedCurrent = Math.round(currentAzimuth / (Math.PI / 2)) * (Math.PI / 2);
  const targetAzimuth = snappedCurrent + direction * (Math.PI / 2);

  const startAzimuth = currentAzimuth;
  const startTime = performance.now();
  const duration = 350;

  function animate(now) {
    const t = Math.min((now - startTime) / duration, 1);
    const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    const angle = startAzimuth + (targetAzimuth - startAzimuth) * ease;
    const polar = controls.getPolarAngle();
    const distance = controls.object.position.distanceTo(controls.target);

    controls.object.position.x = controls.target.x + distance * Math.sin(polar) * Math.sin(angle);
    controls.object.position.y = controls.target.y + distance * Math.cos(polar);
    controls.object.position.z = controls.target.z + distance * Math.sin(polar) * Math.cos(angle);
    controls.object.lookAt(controls.target);
    controls.update();

    if (t < 1) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
}
