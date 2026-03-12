import * as THREE from 'three';
import { COLORS } from './materials.js';
import { EnergyRing } from './particles.js';

const MOVE_DURATION = 150; // ms

export class Block {
  constructor(scene, gx, gz, grid) {
    this.scene = scene;
    this.gridX = gx;
    this.gridZ = gz;
    this.onPlate = false;
    this.group = new THREE.Group();

    // === OUTER SHELL - icosahedron containment field ===
    const shellGeo = new THREE.IcosahedronGeometry(0.22, 1);
    this.shellMat = new THREE.MeshStandardMaterial({
      color: COLORS.block,
      emissive: COLORS.block,
      emissiveIntensity: 0.3,
      roughness: 0.15,
      metalness: 0.9,
      transparent: true,
      opacity: 0.35,
    });
    this.shell = new THREE.Mesh(shellGeo, this.shellMat);
    this.shell.position.y = 0.35;
    this.shell.castShadow = true;
    this.group.add(this.shell);

    // === SHELL EDGES - wireframe highlight ===
    const shellEdges = new THREE.EdgesGeometry(shellGeo);
    this.edgeMat = new THREE.LineBasicMaterial({
      color: COLORS.block,
      transparent: true,
      opacity: 0.6,
    });
    this.edges = new THREE.LineSegments(shellEdges, this.edgeMat);
    this.edges.position.y = 0.35;
    this.group.add(this.edges);

    // === INNER CORE - bright energy sphere ===
    const coreGeo = new THREE.SphereGeometry(0.1, 12, 8);
    this.coreMat = new THREE.MeshBasicMaterial({
      color: COLORS.block,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    this.core = new THREE.Mesh(coreGeo, this.coreMat);
    this.core.position.y = 0.35;
    this.group.add(this.core);

    // === ORBITAL RING 1 - horizontal gyroscope ring ===
    const ringGeo = new THREE.TorusGeometry(0.18, 0.012, 8, 24);
    this.ringMat1 = new THREE.MeshStandardMaterial({
      color: COLORS.block,
      emissive: COLORS.block,
      emissiveIntensity: 0.8,
      roughness: 0.1,
      metalness: 0.8,
    });
    this.ring1 = new THREE.Mesh(ringGeo, this.ringMat1);
    this.ring1.position.y = 0.35;
    this.group.add(this.ring1);

    // === ORBITAL RING 2 - perpendicular gyroscope ring ===
    this.ringMat2 = this.ringMat1.clone();
    this.ring2 = new THREE.Mesh(ringGeo.clone(), this.ringMat2);
    this.ring2.position.y = 0.35;
    this.ring2.rotation.x = Math.PI / 2;
    this.group.add(this.ring2);

    // === ORBITAL RING 3 - diagonal gyroscope ring ===
    this.ringMat3 = this.ringMat1.clone();
    this.ring3 = new THREE.Mesh(ringGeo.clone(), this.ringMat3);
    this.ring3.position.y = 0.35;
    this.ring3.rotation.z = Math.PI / 2;
    this.group.add(this.ring3);

    // Orbiting energy particles
    this.particleRing = new EnergyRing(this.group, 12, 0.38, COLORS.block);

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
          this.light.intensity = this.onPlate ? 1.2 : 0.7;
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

    // Shell
    this.shellMat.color.setHex(color);
    this.shellMat.emissive.setHex(color);
    this.shellMat.emissiveIntensity = onPlate ? 0.5 : 0.3;
    this.shellMat.opacity = onPlate ? 0.5 : 0.35;

    // Edges
    this.edgeMat.color.setHex(color);
    this.edgeMat.opacity = onPlate ? 0.9 : 0.6;

    // Core
    this.coreMat.color.setHex(color);
    this.coreMat.opacity = onPlate ? 0.9 : 0.7;

    // Rings
    [this.ringMat1, this.ringMat2, this.ringMat3].forEach(mat => {
      mat.color.setHex(color);
      mat.emissive.setHex(color);
      mat.emissiveIntensity = onPlate ? 1.2 : 0.8;
    });

    // Light
    this.light.color.setHex(color);
    this.light.intensity = onPlate ? 1.2 : 0.7;

    // Particles
    this.particleRing.setColor(color);
  }

  update(time) {
    const offset = this.gridX * 0.7 + this.gridZ * 1.1;
    const speed = this.onPlate ? 1.5 : 1.0;

    // Shell gentle tumble
    this.shell.rotation.y = time * 0.3 * speed + offset;
    this.shell.rotation.x = Math.sin(time * 0.5 + offset) * 0.15;

    // Edges follow shell
    this.edges.rotation.copy(this.shell.rotation);

    // Gyroscope rings - each on a different axis at different speeds
    this.ring1.rotation.z = time * 1.2 * speed + offset;
    this.ring2.rotation.y = time * 0.9 * speed + offset;
    this.ring2.rotation.x = Math.PI / 2 + time * 0.3;
    this.ring3.rotation.x = time * 0.7 * speed + offset;
    this.ring3.rotation.z = Math.PI / 2 + time * 0.2;

    // Float bob
    const bobY = 0.35 + Math.sin(time * 1.5 + offset) * 0.025;
    this.shell.position.y = bobY;
    this.edges.position.y = bobY;
    this.core.position.y = bobY;
    this.ring1.position.y = bobY;
    this.ring2.position.y = bobY;
    this.ring3.position.y = bobY;

    // Core pulse
    const pulse = Math.sin(time * 3 + offset);
    this.coreMat.opacity = (this.onPlate ? 0.7 : 0.5) + pulse * 0.15;
    this.core.scale.setScalar(1.0 + pulse * 0.08);

    // Update particle ring
    this.particleRing.update(time + offset, bobY);
  }

  dispose() {
    this.particleRing.dispose();
    this.scene.remove(this.group);
    this.shell.geometry.dispose();
    this.shellMat.dispose();
    this.edges.geometry.dispose();
    this.edgeMat.dispose();
    this.core.geometry.dispose();
    this.coreMat.dispose();
    this.ring1.geometry.dispose();
    this.ringMat1.dispose();
    this.ring2.geometry.dispose();
    this.ringMat2.dispose();
    this.ring3.geometry.dispose();
    this.ringMat3.dispose();
  }
}
