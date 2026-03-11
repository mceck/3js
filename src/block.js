import * as THREE from 'three';
import { createBlockMaterial, COLORS } from './materials.js';
import { EnergyRing } from './particles.js';

const MOVE_DURATION = 150; // ms

export class Block {
  constructor(scene, gx, gz, grid) {
    this.scene = scene;
    this.gridX = gx;
    this.gridZ = gz;
    this.onPlate = false;
    this.group = new THREE.Group();

    // Energy core - main cube
    const geo = new THREE.BoxGeometry(0.50, 0.50, 0.50);
    this.material = createBlockMaterial(false);
    this.mesh = new THREE.Mesh(geo, this.material);
    this.mesh.position.y = 0.35;
    this.mesh.castShadow = true;
    this.group.add(this.mesh);

    // Inner glow cube (smaller, additive)
    const innerGeo = new THREE.BoxGeometry(0.30, 0.30, 0.30);
    this.innerMat = new THREE.MeshBasicMaterial({
      color: COLORS.block,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });
    this.innerMesh = new THREE.Mesh(innerGeo, this.innerMat);
    this.innerMesh.position.y = 0.35;
    this.group.add(this.innerMesh);

    // Glowing edges
    const edges = new THREE.EdgesGeometry(geo);
    this.edgeMaterial = new THREE.LineBasicMaterial({
      color: COLORS.block,
      transparent: true,
      opacity: 0.7,
    });
    this.edges = new THREE.LineSegments(edges, this.edgeMaterial);
    this.edges.position.y = 0.35;
    this.group.add(this.edges);

    // Orbiting energy particles
    this.ring = new EnergyRing(this.group, 10, 0.38, COLORS.block);

    // Point light
    this.light = new THREE.PointLight(COLORS.block, 0.7, 3);
    this.light.position.y = 0.35;
    this.group.add(this.light);

    // Set initial world position
    const world = grid.gridToWorld(gx, gz);
    this.group.position.set(world.x, 0, world.z);

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

      const animate = (now) => {
        const t = Math.min((now - startTime) / MOVE_DURATION, 1);
        const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        this.group.position.x = start.x + (target.x - start.x) * ease;
        this.group.position.z = start.z + (target.z - start.z) * ease;

        // Pulse light during push
        this.light.intensity = 0.7 + Math.sin(t * Math.PI) * 0.6;

        if (t < 1) {
          requestAnimationFrame(animate);
        } else {
          this.light.intensity = 0.7;
          resolve();
        }
      };
      requestAnimationFrame(animate);
    });
  }

  setOnPlate(onPlate) {
    if (this.onPlate === onPlate) return;
    this.onPlate = onPlate;
    const color = onPlate ? COLORS.blockOnPlate : COLORS.block;
    this.material.color.setHex(color);
    this.material.emissive.setHex(color);
    this.material.emissiveIntensity = onPlate ? 0.8 : 0.5;
    this.innerMat.color.setHex(color);
    this.innerMat.opacity = onPlate ? 0.6 : 0.4;
    this.edgeMaterial.color.setHex(color);
    this.light.color.setHex(color);
    this.light.intensity = onPlate ? 1.2 : 0.7;
    this.ring.setColor(color);
  }

  update(time) {
    const offset = this.gridX * 0.7 + this.gridZ * 1.1;
    this.mesh.rotation.y = time * 0.4 + offset;
    this.mesh.rotation.x = Math.sin(time * 0.8 + offset) * 0.12;
    this.innerMesh.rotation.y = -time * 0.6 + offset;
    this.innerMesh.rotation.x = -this.mesh.rotation.x;
    this.mesh.position.y = 0.35 + Math.sin(time * 1.5 + offset) * 0.025;
    this.innerMesh.position.y = this.mesh.position.y;
    this.edges.rotation.copy(this.mesh.rotation);
    this.edges.position.y = this.mesh.position.y;

    // Pulse inner glow
    this.innerMat.opacity = (this.onPlate ? 0.5 : 0.3) + Math.sin(time * 3 + offset) * 0.1;

    // Update particle ring
    this.ring.update(time + offset, this.mesh.position.y);
  }

  dispose() {
    this.ring.dispose();
    this.scene.remove(this.group);
    this.mesh.geometry.dispose();
    this.material.dispose();
    this.innerMesh.geometry.dispose();
    this.innerMat.dispose();
    this.edgeMaterial.dispose();
    this.edges.geometry.dispose();
  }
}
