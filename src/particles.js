import * as THREE from 'three';
import { COLORS } from './materials.js';

// Ambient floating particles throughout the scene
export class AmbientParticles {
  constructor(scene, count = 200) {
    this.count = count;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const alphas = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = Math.random() * 4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 16;
      sizes[i] = Math.random() * 3 + 1;
      alphas[i] = Math.random();
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0x4466aa) },
      },
      vertexShader: `
        attribute float size;
        attribute float alpha;
        varying float vAlpha;
        uniform float uTime;
        void main() {
          vAlpha = alpha;
          vec3 pos = position;
          pos.y += sin(uTime * 0.3 + position.x * 2.0 + position.z) * 0.15;
          pos.x += sin(uTime * 0.15 + position.z * 1.5) * 0.08;
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (80.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying float vAlpha;
        uniform vec3 uColor;
        void main() {
          float d = length(gl_PointCoord - vec2(0.5));
          if (d > 0.5) discard;
          float fade = 1.0 - smoothstep(0.0, 0.5, d);
          gl_FragColor = vec4(uColor, fade * vAlpha * 0.35);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.points = new THREE.Points(geo, mat);
    scene.add(this.points);
  }

  update(time) {
    this.points.material.uniforms.uTime.value = time;
  }

  dispose(scene) {
    scene.remove(this.points);
    this.points.geometry.dispose();
    this.points.material.dispose();
  }
}

// Energy particles that orbit around a point (for blocks and plates)
export class EnergyRing {
  constructor(parent, count = 12, radius = 0.4, color = COLORS.block) {
    this.count = count;
    this.radius = radius;
    const positions = new Float32Array(count * 3);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color,
      size: 0.04,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.points = new THREE.Points(geo, mat);
    parent.add(this.points);
    this._color = color;
  }

  update(time, yOffset = 0.35) {
    const positions = this.points.geometry.attributes.position.array;
    for (let i = 0; i < this.count; i++) {
      const angle = (i / this.count) * Math.PI * 2 + time * 1.2;
      const r = this.radius + Math.sin(time * 2 + i) * 0.03;
      positions[i * 3]     = Math.cos(angle) * r;
      positions[i * 3 + 1] = yOffset + Math.sin(time * 3 + i * 0.5) * 0.06;
      positions[i * 3 + 2] = Math.sin(angle) * r;
    }
    this.points.geometry.attributes.position.needsUpdate = true;
  }

  setColor(hex) {
    this._color = hex;
    this.points.material.color.setHex(hex);
  }

  dispose() {
    this.points.geometry.dispose();
    this.points.material.dispose();
  }
}

// Win celebration burst particles
export class CelebrationBurst {
  constructor(scene, origin) {
    this.scene = scene;
    this.startTime = performance.now();
    this.duration = 1500;
    const count = 80;

    const positions = new Float32Array(count * 3);
    this.velocities = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const cyanColor = new THREE.Color(COLORS.block);
    const greenColor = new THREE.Color(COLORS.blockOnPlate);
    const purpleColor = new THREE.Color(COLORS.plate);

    for (let i = 0; i < count; i++) {
      positions[i * 3]     = origin.x;
      positions[i * 3 + 1] = origin.y || 0.5;
      positions[i * 3 + 2] = origin.z;

      // Random velocity in all directions
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const speed = 1.5 + Math.random() * 2.5;
      this.velocities[i * 3]     = Math.sin(phi) * Math.cos(theta) * speed;
      this.velocities[i * 3 + 1] = Math.abs(Math.cos(phi)) * speed * 1.2;
      this.velocities[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * speed;

      // Random color from palette
      const c = [cyanColor, greenColor, purpleColor][Math.floor(Math.random() * 3)];
      colors[i * 3]     = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.points = new THREE.Points(geo, mat);
    scene.add(this.points);
    this.alive = true;
  }

  update() {
    if (!this.alive) return;
    const elapsed = (performance.now() - this.startTime) / this.duration;
    if (elapsed >= 1) {
      this.dispose();
      return;
    }

    const positions = this.points.geometry.attributes.position.array;
    const dt = 0.016; // ~60fps step
    for (let i = 0; i < positions.length / 3; i++) {
      positions[i * 3]     += this.velocities[i * 3] * dt;
      positions[i * 3 + 1] += this.velocities[i * 3 + 1] * dt;
      positions[i * 3 + 2] += this.velocities[i * 3 + 2] * dt;
      this.velocities[i * 3 + 1] -= 3.0 * dt; // gravity
    }
    this.points.geometry.attributes.position.needsUpdate = true;
    this.points.material.opacity = 1 - elapsed;
  }

  dispose() {
    this.alive = false;
    this.scene.remove(this.points);
    this.points.geometry.dispose();
    this.points.material.dispose();
  }
}
