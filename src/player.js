import * as THREE from 'three';
import { playerMaterial, playerAuraMaterial, COLORS } from './materials.js';
import { EnergyRing } from './particles.js';

const MOVE_DURATION = 150; // ms

export class Player {
  constructor(scene) {
    this.scene = scene;
    this.gridX = 0;
    this.gridZ = 0;
    this.group = new THREE.Group();
    this.animating = false;

    // Main body - octahedron
    const bodyGeo = new THREE.OctahedronGeometry(0.22, 0);
    this.body = new THREE.Mesh(bodyGeo, playerMaterial);
    this.body.position.y = 0.35;
    this.body.castShadow = true;
    this.group.add(this.body);

    // Wireframe aura (slightly larger)
    const auraGeo = new THREE.OctahedronGeometry(0.30, 0);
    this.aura = new THREE.Mesh(auraGeo, playerAuraMaterial);
    this.aura.position.y = 0.35;
    this.group.add(this.aura);

    // Inner crystal glow
    const innerGeo = new THREE.OctahedronGeometry(0.12, 0);
    const innerMat = new THREE.MeshBasicMaterial({
      color: COLORS.playerInner,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    this.inner = new THREE.Mesh(innerGeo, innerMat);
    this.inner.position.y = 0.35;
    this.group.add(this.inner);

    // Orbiting particle ring
    this.ring = new EnergyRing(this.group, 16, 0.35, COLORS.player);

    // Glow point light
    this.light = new THREE.PointLight(COLORS.player, 1.0, 3.5);
    this.light.position.y = 0.35;
    this.group.add(this.light);

    scene.add(this.group);
  }

  setPosition(gx, gz, grid) {
    this.gridX = gx;
    this.gridZ = gz;
    const world = grid.gridToWorld(gx, gz);
    this.group.position.set(world.x, 0, world.z);
  }

  moveTo(gx, gz, grid) {
    return new Promise(resolve => {
      this.gridX = gx;
      this.gridZ = gz;
      const target = grid.gridToWorld(gx, gz);
      const start = { x: this.group.position.x, z: this.group.position.z };
      const startTime = performance.now();
      this.animating = true;

      const animate = (now) => {
        const t = Math.min((now - startTime) / MOVE_DURATION, 1);
        const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        this.group.position.x = start.x + (target.x - start.x) * ease;
        this.group.position.z = start.z + (target.z - start.z) * ease;

        // Hop arc
        this.group.position.y = Math.sin(t * Math.PI) * 0.12;
        // Light pulses brighter during movement
        this.light.intensity = 1.0 + Math.sin(t * Math.PI) * 0.8;

        if (t < 1) {
          requestAnimationFrame(animate);
        } else {
          this.group.position.y = 0;
          this.light.intensity = 1.0;
          this.animating = false;
          resolve();
        }
      };
      requestAnimationFrame(animate);
    });
  }

  update(time) {
    if (!this.animating) {
      this.body.position.y = 0.35 + Math.sin(time * 2) * 0.03;
      this.inner.position.y = this.body.position.y;
      this.aura.position.y = this.body.position.y;
    }
    this.body.rotation.y = time * 0.6;
    this.aura.rotation.y = -time * 0.3;
    this.inner.rotation.y = time * 1.2;

    // Pulse aura opacity
    playerAuraMaterial.opacity = 0.1 + Math.sin(time * 3) * 0.06;

    // Update particle ring
    this.ring.update(time, this.body.position.y);
  }

  dispose() {
    this.ring.dispose();
    this.scene.remove(this.group);
  }
}
