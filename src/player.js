import * as THREE from 'three';
import { playerAuraMaterial, COLORS } from './materials.js';
import { EnergyRing } from './particles.js';

const MOVE_DURATION = 150; // ms

export class Player {
  constructor(scene) {
    this.scene = scene;
    this.gridX = 0;
    this.gridZ = 0;
    this.group = new THREE.Group();
    this.animating = false;
    this.facingAngle = 0;
    this.targetFacingAngle = 0;

    // Character group (for facing rotation, independent of position/hop)
    this.character = new THREE.Group();

    // Dark metallic armor material
    const armorMat = new THREE.MeshStandardMaterial({
      color: 0x1a2540,
      roughness: 0.3,
      metalness: 0.8,
      emissive: 0x0a1428,
      emissiveIntensity: 0.3,
    });

    // Glowing cyan energy material
    const glowMat = new THREE.MeshStandardMaterial({
      color: COLORS.player,
      emissive: COLORS.player,
      emissiveIntensity: 1.2,
      roughness: 0.1,
      metalness: 0.5,
    });

    // === HEAD - armored helmet ===
    const headGeo = new THREE.SphereGeometry(0.1, 8, 6);
    this.head = new THREE.Mesh(headGeo, armorMat.clone());
    this.head.scale.y = 0.85;
    this.head.position.y = 0.50;
    this.head.castShadow = true;
    this.character.add(this.head);

    // === VISOR - glowing eye slit ===
    const visorGeo = new THREE.BoxGeometry(0.14, 0.022, 0.035);
    this.visorMat = glowMat.clone();
    this.visor = new THREE.Mesh(visorGeo, this.visorMat);
    this.visor.position.set(0, 0.48, 0.085);
    this.character.add(this.visor);

    // === BODY - hexagonal armored torso ===
    const bodyGeo = new THREE.CylinderGeometry(0.1, 0.15, 0.25, 6);
    this.body = new THREE.Mesh(bodyGeo, armorMat.clone());
    this.body.position.y = 0.28;
    this.body.castShadow = true;
    this.character.add(this.body);

    // === CORE WINDOW - glowing energy center ===
    const coreGeo = new THREE.SphereGeometry(0.04, 6, 4);
    this.coreMat = new THREE.MeshBasicMaterial({
      color: COLORS.playerInner,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    this.core = new THREE.Mesh(coreGeo, this.coreMat);
    this.core.position.set(0, 0.32, 0.12);
    this.character.add(this.core);

    // === ROBE - flowing lower section ===
    const robeGeo = new THREE.CylinderGeometry(0.15, 0.04, 0.14, 6);
    const robeMat = new THREE.MeshStandardMaterial({
      color: 0x151d30,
      roughness: 0.4,
      metalness: 0.7,
      emissive: 0x080e1a,
      emissiveIntensity: 0.2,
    });
    this.robe = new THREE.Mesh(robeGeo, robeMat);
    this.robe.position.y = 0.09;
    this.character.add(this.robe);

    // === CROWN CRYSTAL - floating above head ===
    const crownGeo = new THREE.OctahedronGeometry(0.045, 0);
    this.crownMat = glowMat.clone();
    this.crown = new THREE.Mesh(crownGeo, this.crownMat);
    this.crown.position.y = 0.68;
    this.character.add(this.crown);

    // === SHOULDER RUNES - orbiting crystal shards ===
    const runeGeo = new THREE.TetrahedronGeometry(0.03, 0);
    const runeMat = glowMat.clone();
    runeMat.emissiveIntensity = 0.8;
    this.runeLeft = new THREE.Mesh(runeGeo, runeMat);
    this.runeLeft.position.set(-0.2, 0.4, 0);
    this.character.add(this.runeLeft);

    this.runeRight = new THREE.Mesh(runeGeo.clone(), runeMat.clone());
    this.runeRight.position.set(0.2, 0.4, 0);
    this.character.add(this.runeRight);

    // === WIREFRAME AURA - outer energy field ===
    const auraGeo = new THREE.DodecahedronGeometry(0.3, 0);
    this.aura = new THREE.Mesh(auraGeo, playerAuraMaterial);
    this.aura.position.y = 0.35;
    this.character.add(this.aura);

    this.group.add(this.character);

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
    // Compute facing direction before updating grid position
    const ddx = gx - this.gridX;
    const ddz = gz - this.gridZ;
    if (ddx !== 0 || ddz !== 0) {
      this.targetFacingAngle = Math.atan2(ddx, ddz);
    }

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
    // Idle floating bob
    if (!this.animating) {
      this.character.position.y = Math.sin(time * 2) * 0.03;
    } else {
      this.character.position.y = 0;
    }

    // Smooth facing rotation toward movement direction
    let facingDiff = this.targetFacingAngle - this.facingAngle;
    while (facingDiff > Math.PI) facingDiff -= 2 * Math.PI;
    while (facingDiff < -Math.PI) facingDiff += 2 * Math.PI;
    this.facingAngle += facingDiff * 0.15;
    this.character.rotation.y = this.facingAngle;

    // Crown crystal rotation and hover
    this.crown.rotation.y = time * 1.5;
    this.crown.position.y = 0.68 + Math.sin(time * 3) * 0.02;

    // Shoulder runes gentle orbit
    const runeOrbit = time * 0.8;
    this.runeLeft.position.x = -0.19 * Math.cos(runeOrbit);
    this.runeLeft.position.z = -0.19 * Math.sin(runeOrbit);
    this.runeLeft.rotation.y = time * 2;
    this.runeLeft.rotation.x = time * 1.5;

    this.runeRight.position.x = 0.19 * Math.cos(runeOrbit + Math.PI);
    this.runeRight.position.z = 0.19 * Math.sin(runeOrbit + Math.PI);
    this.runeRight.rotation.y = -time * 2;
    this.runeRight.rotation.x = -time * 1.5;

    // Visor emissive pulse
    this.visorMat.emissiveIntensity = 1.0 + Math.sin(time * 4) * 0.3;

    // Core glow pulse
    this.coreMat.opacity = 0.4 + Math.sin(time * 3) * 0.2;

    // Aura opacity pulse
    playerAuraMaterial.opacity = 0.08 + Math.sin(time * 3) * 0.04;

    // Update particle ring
    const ringY = 0.35 + (this.animating ? 0 : this.character.position.y);
    this.ring.update(time, ringY);
  }

  dispose() {
    this.ring.dispose();
    this.scene.remove(this.group);
  }
}
