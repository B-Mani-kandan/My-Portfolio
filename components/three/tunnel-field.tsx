"use client";

import * as THREE from "three";
import { useThreeScene } from "./use-three-scene";

/**
 * TunnelField — an endless digital tunnel with a glass orb flying through it.
 *
 *  - Rings and particles flow toward the camera and wrap around at the far end,
 *    where they're fully faded, so the loop never shows a seam.
 *  - The orb travels from deep in the tunnel, grows and brightens as it nears,
 *    fades as it passes the camera, then starts again far away (also faded), so
 *    the reset is invisible.
 *  - The tunnel bends gently over time, and lines near the orb brighten and bulge.
 *
 * Everything moves in shaders; the CPU only updates a few uniforms per frame.
 */

const LEN = 64; // tunnel length
const NEAR = 3; // how far past the camera the tunnel reaches
const RADIUS = 4.6;
const FLOW = 2.2; // tunnel speed, units / second
const ORB_PERIOD = 11; // seconds for one far → camera journey
const ORB_FAR = -(LEN - 8);
const ORB_NEAR = 1.5;

const LAVENDER = new THREE.Color("#c4b2ff");
const VIOLET = new THREE.Color("#8a5cff");

// shared tunnel bend — also used on the CPU so the orb rides the tunnel's centre line
const GLSL_BEND = /* glsl */ `
  vec2 bend(float z, float t) {
    float k = clamp(-z / 30.0, 0.0, 1.0);
    return vec2(sin(z * 0.07 + t * 0.35) * 1.6, cos(z * 0.05 + t * 0.27) * 1.1) * k;
  }
`;
function bend(z: number, t: number) {
  const k = Math.min(1, Math.max(0, -z / 30));
  return [Math.sin(z * 0.07 + t * 0.35) * 1.6 * k, Math.cos(z * 0.05 + t * 0.27) * 1.1 * k];
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** Soft radial glow texture for the orb's halo. */
function glowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grd.addColorStop(0, "rgba(220,205,255,0.9)");
  grd.addColorStop(0.18, "rgba(170,130,255,0.45)");
  grd.addColorStop(0.45, "rgba(120,70,230,0.14)");
  grd.addColorStop(1, "rgba(80,40,180,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function TunnelField({ className }: { className?: string }) {
  const canvasRef = useThreeScene(
    ({ scene, camera }) => {
      camera.fov = 70;
      camera.far = 120;
      camera.updateProjectionMatrix();

      const uniforms = {
        uTime: { value: 0 },
        uOrbZ: { value: ORB_FAR },
        uOrbGlow: { value: 0 },
        uColor: { value: VIOLET.clone() },
        uHot: { value: LAVENDER.clone() },
      };

      // ---------- tunnel lines ----------
      // attributes: position.xy = point on the wall, aBase = depth, aOff = per-vertex depth offset,
      // aFlow = 1 for pieces that travel (rings, spirals), 0 for the fixed lengthwise lines
      const pos: number[] = [];
      const base: number[] = [];
      const off: number[] = [];
      const flow: number[] = [];
      const bright: number[] = [];
      const seg = (x1: number, y1: number, x2: number, y2: number, b: number, o1: number, o2: number, f: number, br: number) => {
        pos.push(x1, y1, 0, x2, y2, 0);
        base.push(b, b);
        off.push(o1, o2);
        flow.push(f, f);
        bright.push(br, br);
      };

      // rings — slightly wavy, evenly spaced along the tunnel
      const RINGS = 34;
      const RING_SEG = 72;
      for (let r = 0; r < RINGS; r++) {
        const z0 = (r / RINGS) * LEN;
        for (let s = 0; s < RING_SEG; s++) {
          const a1 = (s / RING_SEG) * Math.PI * 2;
          const a2 = ((s + 1) / RING_SEG) * Math.PI * 2;
          const w1 = RADIUS * (1 + 0.035 * Math.sin(a1 * 6 + r));
          const w2 = RADIUS * (1 + 0.035 * Math.sin(a2 * 6 + r));
          seg(Math.cos(a1) * w1, Math.sin(a1) * w1, Math.cos(a2) * w2, Math.sin(a2) * w2, z0, 0, 0, 1, 0.75);
        }
      }

      // lengthwise lines from the depths to the camera — they bend with the tunnel
      const SPOKES = 22;
      const STEPS = 90;
      for (let s = 0; s < SPOKES; s++) {
        const a = (s / SPOKES) * Math.PI * 2;
        const x = Math.cos(a) * RADIUS;
        const y = Math.sin(a) * RADIUS;
        for (let k = 0; k < STEPS; k++) {
          const z1 = -(LEN - NEAR) + (k / STEPS) * LEN;
          const z2 = -(LEN - NEAR) + ((k + 1) / STEPS) * LEN;
          seg(x, y, x, y, 0, z1, z2, 0, 0.55);
        }
      }

      // a few flowing spirals for the curved, "digital space" feel
      const SPIRALS = 3;
      const SP_STEPS = 140;
      for (let s = 0; s < SPIRALS; s++) {
        const phase = (s / SPIRALS) * Math.PI * 2;
        const rad = RADIUS * 0.92;
        for (let k = 0; k < SP_STEPS; k++) {
          const d1 = (k / SP_STEPS) * LEN;
          const d2 = ((k + 1) / SP_STEPS) * LEN;
          const a1 = phase + d1 * 0.16;
          const a2 = phase + d2 * 0.16;
          // both ends share the segment's base depth so a segment never splits when it wraps
          seg(Math.cos(a1) * rad, Math.sin(a1) * rad, Math.cos(a2) * rad, Math.sin(a2) * rad, d1, 0, d2 - d1, 1, 1);
        }
      }

      const lineGeo = new THREE.BufferGeometry();
      lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      lineGeo.setAttribute("aBase", new THREE.Float32BufferAttribute(base, 1));
      lineGeo.setAttribute("aOff", new THREE.Float32BufferAttribute(off, 1));
      lineGeo.setAttribute("aFlow", new THREE.Float32BufferAttribute(flow, 1));
      lineGeo.setAttribute("aBright", new THREE.Float32BufferAttribute(bright, 1));
      lineGeo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, -LEN / 2), LEN);

      const lineMat = new THREE.ShaderMaterial({
        uniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexShader: /* glsl */ `
          uniform float uTime, uOrbZ, uOrbGlow;
          attribute float aBase, aOff, aFlow, aBright;
          varying float vAlpha, vHeat;
          ${GLSL_BEND}
          void main() {
            float z = aFlow > 0.5
              ? mod(aBase + uTime * ${FLOW.toFixed(2)}, ${LEN.toFixed(1)}) - ${(LEN - NEAR).toFixed(1)} + aOff
              : aOff;
            float d = z - uOrbZ;
            float heat = exp(-d * d / 22.0) * uOrbGlow;
            vec2 xy = position.xy * (1.0 + 0.07 * heat) + bend(z, uTime);
            float fadeFar = smoothstep(${(-(LEN - NEAR)).toFixed(1)}, ${(-(LEN - NEAR) + 16).toFixed(1)}, z);
            float fadeNear = 1.0 - smoothstep(-2.0, ${NEAR.toFixed(1)}, z);
            vAlpha = fadeFar * fadeNear * aBright * (0.22 + 0.9 * heat);
            vHeat = heat;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(xy, z, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 uColor, uHot;
          varying float vAlpha, vHeat;
          void main() {
            gl_FragColor = vec4(mix(uColor, uHot, clamp(vHeat, 0.0, 1.0)), vAlpha);
          }
        `,
      });
      scene.add(new THREE.LineSegments(lineGeo, lineMat));

      // ---------- particles ----------
      const COUNT = 520;
      const pPos = new Float32Array(COUNT * 3);
      const pSeed = new Float32Array(COUNT);
      for (let i = 0; i < COUNT; i++) {
        const a = Math.random() * Math.PI * 2;
        const r = 0.6 + Math.sqrt(Math.random()) * (RADIUS * 1.15);
        pPos[i * 3] = Math.cos(a) * r;
        pPos[i * 3 + 1] = Math.sin(a) * r;
        pPos[i * 3 + 2] = Math.random() * LEN; // base depth
        pSeed[i] = Math.random();
      }
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
      pGeo.setAttribute("aSeed", new THREE.BufferAttribute(pSeed, 1));
      pGeo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, -LEN / 2), LEN);
      const pMat = new THREE.ShaderMaterial({
        uniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexShader: /* glsl */ `
          uniform float uTime;
          attribute float aSeed;
          varying float vAlpha;
          ${GLSL_BEND}
          void main() {
            float z = mod(position.z + uTime * (0.5 + aSeed * 0.7), ${LEN.toFixed(1)}) - ${(LEN - NEAR).toFixed(1)};
            vec2 drift = vec2(sin(uTime * 0.21 + aSeed * 40.0), cos(uTime * 0.17 + aSeed * 23.0)) * 0.25;
            vec4 mv = modelViewMatrix * vec4(position.xy + drift + bend(z, uTime), z, 1.0);
            float fade = smoothstep(${(-(LEN - NEAR)).toFixed(1)}, ${(-(LEN - NEAR) + 14).toFixed(1)}, z) * (1.0 - smoothstep(-1.5, 1.5, z));
            float twinkle = 0.55 + 0.45 * sin(uTime * (1.0 + aSeed * 2.0) + aSeed * 60.0);
            vAlpha = fade * twinkle * (0.35 + aSeed * 0.65);
            gl_PointSize = min((1.2 + aSeed * 2.6) * (26.0 / max(-mv.z, 0.5)), 14.0);
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 uHot;
          varying float vAlpha;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            float a = smoothstep(0.5, 0.0, d);
            gl_FragColor = vec4(uHot, a * vAlpha);
          }
        `,
      });
      scene.add(new THREE.Points(pGeo, pMat));

      // ---------- the orb ----------
      const orb = new THREE.Group();
      const orbUniforms = { uOpacity: { value: 0 }, uTime: uniforms.uTime };
      const glass = new THREE.Mesh(
        new THREE.SphereGeometry(1.15, 64, 64),
        new THREE.ShaderMaterial({
          uniforms: orbUniforms,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          vertexShader: /* glsl */ `
            varying vec3 vN, vV;
            varying vec3 vP;
            void main() {
              vec4 mv = modelViewMatrix * vec4(position, 1.0);
              vN = normalize(normalMatrix * normal);
              vV = normalize(-mv.xyz);
              vP = position;
              gl_Position = projectionMatrix * mv;
            }
          `,
          fragmentShader: /* glsl */ `
            uniform float uOpacity, uTime;
            varying vec3 vN, vV, vP;
            void main() {
              float fres = pow(1.0 - max(dot(vN, vV), 0.0), 2.2);
              // slow swirling light inside the glass
              float swirl = 0.5 + 0.5 * sin(vP.y * 3.0 + uTime * 0.8 + sin(vP.x * 2.5 + uTime * 0.6) * 1.5);
              vec3 core = mix(vec3(0.20, 0.08, 0.42), vec3(0.55, 0.36, 1.0), swirl * 0.6);
              vec3 rim = vec3(0.84, 0.76, 1.0);
              vec3 col = mix(core, rim, fres);
              float a = (0.16 + swirl * 0.08 + fres * 0.85) * uOpacity;
              gl_FragColor = vec4(col, a);
            }
          `,
        }),
      );
      orb.add(glass);

      // faint wire shell turning slowly around the glass
      const shellMat = new THREE.MeshBasicMaterial({
        color: LAVENDER,
        wireframe: true,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const shell = new THREE.Mesh(new THREE.IcosahedronGeometry(1.32, 2), shellMat);
      orb.add(shell);

      const haloTex = glowTexture();
      const halo = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: haloTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 }),
      );
      halo.scale.setScalar(7.5);
      orb.add(halo);
      scene.add(orb);

      return {
        frame: (t) => {
          // reduced motion passes t = 0 every frame: freeze on a mid-journey pose
          const still = t === 0;
          uniforms.uTime.value = t;

          const phase = still ? 0.55 : (t % ORB_PERIOD) / ORB_PERIOD;
          // ease-in so the orb gathers speed as it approaches
          const z = ORB_FAR + (ORB_NEAR - ORB_FAR) * Math.pow(phase, 1.7);
          const [bx, by] = bend(z, t);
          orb.position.set(bx, by, z);

          const near = smooth(ORB_FAR, -3, z); // 0 far → 1 close
          const fadeIn = smooth(0, 0.12, phase);
          const fadeOut = 1 - smooth(-3.5, ORB_NEAR - 0.3, z); // dissolves as it reaches the camera
          const vis = fadeIn * fadeOut;
          const pulse = 0.85 + 0.15 * Math.sin(t * 1.6);

          orbUniforms.uOpacity.value = vis * (0.35 + 0.65 * near);
          shellMat.opacity = vis * 0.07 * (0.4 + near);
          (halo.material as THREE.SpriteMaterial).opacity = vis * (0.35 + 0.65 * near) * pulse;
          shell.rotation.set(t * 0.08, t * 0.12, 0);

          uniforms.uOrbZ.value = z;
          uniforms.uOrbGlow.value = vis * (0.4 + 0.6 * near);
        },
        dispose: () => haloTex.dispose(),
      };
    },
    { fov: 70, z: 0 },
  );

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
