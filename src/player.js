import * as THREE from 'three';
import { playerMaterial, COLORS } from './materials.js';

const MOVE_DURATION = 150; // ms

export class Player {
  constructor(scene) {
    this.scene = scene;
    this.gridX = 0;
    this.gridZ = 0;
    this.group = new THREE.Group();
    this.animating = false;

    // Main body - octahedron
    const bodyGeo = new THREE.OctahedronGeometry(0.25, 0);
    this.body = new THREE.Mesh(bodyGeo, playerMaterial);
    this.body.position.y = 0.35;
    this.body.castShadow = true;
    this.group.add(this.body);

    // Glow point light
    this.light = new THREE.PointLight(COLORS.player, 0.8, 3);
    this.light.position.y = 0.35;
    this.group.add(this.light);

    scene.add(this.group);
  }

  // Set position instantly (no animation)
  setPosition(gx, gz, grid) {
    this.gridX = gx;
    this.gridZ = gz;
    const world = grid.gridToWorld(gx, gz);
    this.group.position.set(world.x, 0, world.z);
  }

  // Animate move to new grid position
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
        const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; // ease in-out
        this.group.position.x = start.x + (target.x - start.x) * ease;
        this.group.position.z = start.z + (target.z - start.z) * ease;

        // Slight hop
        this.group.position.y = Math.sin(t * Math.PI) * 0.1;

        if (t < 1) {
          requestAnimationFrame(animate);
        } else {
          this.group.position.y = 0;
          this.animating = false;
          resolve();
        }
      };
      requestAnimationFrame(animate);
    });
  }

  // Idle floating animation
  update(time) {
    if (!this.animating) {
      this.body.position.y = 0.35 + Math.sin(time * 2) * 0.03;
      this.body.rotation.y = time * 0.5;
    }
  }

  dispose() {
    this.scene.remove(this.group);
  }
}
