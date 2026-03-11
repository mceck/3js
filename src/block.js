import * as THREE from 'three';
import { createBlockMaterial, COLORS } from './materials.js';

const MOVE_DURATION = 150; // ms

export class Block {
  constructor(scene, gx, gz, grid) {
    this.scene = scene;
    this.gridX = gx;
    this.gridZ = gz;
    this.onPlate = false;
    this.group = new THREE.Group();

    // Energy core cube
    const geo = new THREE.BoxGeometry(0.55, 0.55, 0.55);
    this.material = createBlockMaterial(false);
    this.mesh = new THREE.Mesh(geo, this.material);
    this.mesh.position.y = 0.35;
    this.mesh.castShadow = true;
    this.group.add(this.mesh);

    // Glow edges
    const edges = new THREE.EdgesGeometry(geo);
    this.edgeMaterial = new THREE.LineBasicMaterial({
      color: COLORS.block,
      transparent: true,
      opacity: 0.6,
    });
    this.edges = new THREE.LineSegments(edges, this.edgeMaterial);
    this.edges.position.y = 0.35;
    this.group.add(this.edges);

    // Point light
    this.light = new THREE.PointLight(COLORS.block, 0.5, 2.5);
    this.light.position.y = 0.35;
    this.group.add(this.light);

    // Set initial world position
    const world = grid.gridToWorld(gx, gz);
    this.group.position.set(world.x, 0, world.z);

    scene.add(this.group);
  }

  // Set position instantly
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

      const animate = (now) => {
        const t = Math.min((now - startTime) / MOVE_DURATION, 1);
        const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        this.group.position.x = start.x + (target.x - start.x) * ease;
        this.group.position.z = start.z + (target.z - start.z) * ease;

        if (t < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };
      requestAnimationFrame(animate);
    });
  }

  // Update appearance based on plate status
  setOnPlate(onPlate) {
    if (this.onPlate === onPlate) return;
    this.onPlate = onPlate;
    const color = onPlate ? COLORS.blockOnPlate : COLORS.block;
    this.material.color.setHex(color);
    this.material.emissive.setHex(color);
    this.material.emissiveIntensity = onPlate ? 0.6 : 0.4;
    this.edgeMaterial.color.setHex(color);
    this.light.color.setHex(color);
    this.light.intensity = onPlate ? 0.8 : 0.5;
  }

  // Idle rotation
  update(time) {
    this.mesh.rotation.y = time * 0.3;
    this.mesh.rotation.x = Math.sin(time * 0.7) * 0.1;
    this.mesh.position.y = 0.35 + Math.sin(time * 1.5 + this.gridX + this.gridZ) * 0.02;
    this.edges.rotation.copy(this.mesh.rotation);
    this.edges.position.y = this.mesh.position.y;
  }

  dispose() {
    this.scene.remove(this.group);
    this.mesh.geometry.dispose();
    this.material.dispose();
    this.edgeMaterial.dispose();
    this.edges.geometry.dispose();
  }
}
