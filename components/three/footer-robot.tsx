"use client";

import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { useThreeScene } from "./use-three-scene";
import { COLORS } from "@/lib/data";

/**
 * FooterRobot — a glossy little designer-toy robot holding a laptop.
 *
 *  - Egg-shaped head with a dark glass visor; glowing eyes follow the cursor, blink,
 *    and now and then glance down at the laptop screen.
 *  - Hovers on a pulsing ring of light.
 *  - Click it: it crouches, the rocket lights with a puff of smoke, it blasts up with
 *    the flame stretching under it, hangs at the top, falls back as the flame fades
 *    into smoke puffs, and lands in a dust cloud with a squash — then it's ready again.
 *  - Soft studio reflections (RoomEnvironment) give it a polished vinyl-toy finish.
 */

const FLIGHT = 3.0; // seconds for one launch → land → settle
const PEAK = 2.6; // how high it flies

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (a: number, b: number, x: number) => {
  const k = clamp01((x - a) / (b - a));
  return k * k * (3 - 2 * k);
};
const easeOutCubic = (x: number) => 1 - Math.pow(1 - clamp01(x), 3);
const easeInOutCubic = (x: number) => {
  const k = clamp01(x);
  return k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
};

/** Height, rocket thrust (0–1), stretch (+) / squash (−) and "excited" pose for `f` seconds into a launch. */
function flight(f: number) {
  if (f < 0 || f >= FLIGHT) return { y: 0, thrust: 0, stretch: 0, excited: 0 };
  if (f < 0.25) {
    // crouch while the engine lights
    const k = smooth(0, 0.25, f);
    return { y: -0.14 * k, thrust: 0.6 * k, stretch: -0.08 * k, excited: k };
  }
  if (f < 1.0) {
    // blast off: fast thrust, slowing into the apex
    const k = (f - 0.25) / 0.75;
    return { y: -0.14 + (PEAK + 0.14) * easeOutCubic(k), thrust: 1 - 0.55 * smooth(0.55, 1, k), stretch: 0.09 * (1 - smooth(0, 0.6, k)), excited: 1 };
  }
  if (f < 1.3) {
    // hang at the top
    return { y: PEAK + Math.sin((f - 1.0) * 10) * 0.035, thrust: 0.4, stretch: 0, excited: 1 };
  }
  if (f < 2.25) {
    // fall back down, the flame dying away into smoke, easing in for a soft landing
    const k = (f - 1.3) / 0.95;
    return { y: PEAK * (1 - easeInOutCubic(k)), thrust: 0.35 * (1 - k * 0.7), stretch: 0.04 * Math.sin(k * Math.PI), excited: 1 };
  }
  // touchdown: squash, bounce, settle
  const k = (f - 2.25) / (FLIGHT - 2.25);
  return {
    y: Math.sin(clamp01((k - 0.25) / 0.35) * Math.PI) * 0.1, // a little bounce after the squash
    thrust: 0,
    stretch: -0.12 * Math.sin(clamp01(k / 0.3) * Math.PI) + 0.04 * Math.sin(clamp01((k - 0.3) / 0.35) * Math.PI),
    excited: 1 - smooth(0.6, 1, k),
  };
}

/** Soft round puff texture for smoke. */
function puffTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, "rgba(255,255,255,0.95)");
  grd.addColorStop(0.5, "rgba(235,238,245,0.55)");
  grd.addColorStop(1, "rgba(220,225,235,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function FooterRobot({ className, onJump }: { className?: string; onJump?: () => void }) {
  const canvasRef = useThreeScene(
    ({ scene, camera, renderer }) => {
      // tall frame: the robot sits low and flies up into the headroom
      camera.fov = 30;
      camera.position.set(0, 1.6, 16.4);
      camera.lookAt(0, 1.2, 0);
      camera.updateProjectionMatrix();

      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      const pmrem = new THREE.PMREMGenerator(renderer);
      const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = envTex;

      scene.add(new THREE.HemisphereLight("#ffffff", "#1b2433", 0.8));
      const key = new THREE.DirectionalLight("#ffffff", 1.6);
      key.position.set(3, 5, 6);
      scene.add(key);
      const rimMint = new THREE.DirectionalLight(COLORS.accent, 2.4);
      rimMint.position.set(-5, 2, -4);
      scene.add(rimMint);
      const rimViolet = new THREE.DirectionalLight(COLORS.violet, 1.6);
      rimViolet.position.set(5, 1, -3);
      scene.add(rimViolet);

      const shell = new THREE.MeshPhysicalMaterial({ color: "#f3f6fb", roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.18 });
      const mint = new THREE.MeshPhysicalMaterial({ color: COLORS.accent, roughness: 0.35, clearcoat: 0.8, clearcoatRoughness: 0.2 });
      const glass = new THREE.MeshPhysicalMaterial({ color: "#05080c", roughness: 0.08, metalness: 0.3, clearcoat: 1, clearcoatRoughness: 0.05 });
      const metal = new THREE.MeshPhysicalMaterial({ color: "#8f9bb0", roughness: 0.3, metalness: 0.8 });
      const silver = new THREE.MeshPhysicalMaterial({ color: "#c3cad6", roughness: 0.28, metalness: 0.75, clearcoat: 0.6 });
      const graphite = new THREE.MeshPhysicalMaterial({ color: "#1d2430", roughness: 0.5, metalness: 0.3 });
      const glow = (color: string, opacity = 1) =>
        new THREE.MeshBasicMaterial({ color, transparent: opacity < 1, opacity, toneMapped: false });
      const fire = (color: string, opacity: number) =>
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });

      const robot = new THREE.Group();
      scene.add(robot);

      // ---- head: an egg with a glass visor ----
      const head = new THREE.Group();
      head.position.y = 0.55;
      robot.add(head);
      const skull = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 48), shell);
      skull.scale.set(1.2, 0.95, 1.0);
      head.add(skull);
      const visor = new THREE.Mesh(
        new THREE.SphereGeometry(1, 64, 48, Math.PI / 2 - 0.78, 1.56, Math.PI / 2 - 0.5, 1.0),
        glass,
      );
      visor.scale.set(1.225, 0.97, 1.025);
      head.add(visor);

      const eyeMat = glow(COLORS.accent);
      const eyes = [-0.34, 0.34].map((x) => {
        const e = new THREE.Mesh(new RoundedBoxGeometry(0.2, 0.3, 0.04, 4, 0.09), eyeMat);
        e.position.set(x, 0.08, 0.985);
        e.rotation.y = x * 0.75;
        head.add(e);
        return e;
      });
      const happy = [-0.34, 0.34].map((x) => {
        const h = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.035, 8, 24, Math.PI), eyeMat);
        h.position.set(x, 0.04, 0.99);
        h.rotation.y = x * 0.75;
        h.visible = false;
        head.add(h);
        return h;
      });
      const mouth = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.025, 8, 20, Math.PI), eyeMat);
      mouth.rotation.z = Math.PI;
      mouth.position.set(0, -0.22, 0.975);
      head.add(mouth);
      const wow = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.022, 8, 20), eyeMat);
      wow.position.set(0, -0.24, 0.975);
      wow.visible = false;
      head.add(wow);
      [-0.62, 0.62].forEach((x) => {
        const cheek = new THREE.Mesh(new THREE.CircleGeometry(0.075, 20), glow("#ff7fa8", 0.75));
        cheek.position.set(x, -0.17, 0.86);
        cheek.rotation.y = x * 0.85;
        head.add(cheek);
      });

      const earRings = [-1, 1].map((side) => {
        const pod = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.18, 32), mint);
        pod.rotation.z = Math.PI / 2;
        pod.position.x = side * 1.2;
        head.add(pod);
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.025, 10, 32), glow(COLORS.accent));
        ring.rotation.y = Math.PI / 2;
        ring.position.x = side * 1.3;
        head.add(ring);
        return ring;
      });

      const antenna = new THREE.Group();
      antenna.position.y = 0.92;
      head.add(antenna);
      const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.45, 12), metal);
      stalk.position.y = 0.2;
      antenna.add(stalk);
      const tip = new THREE.Mesh(new THREE.SphereGeometry(0.11, 24, 24), glow(COLORS.orange));
      tip.position.y = 0.46;
      antenna.add(tip);

      // ---- body ----
      const torso = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 36), shell);
      torso.scale.set(0.85, 0.72, 0.75);
      torso.position.y = -0.78;
      robot.add(torso);

      // ---- rocket: nozzle, layered flame, warm light ----
      const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.28, 0.2, 32), metal);
      nozzle.position.y = -1.48;
      robot.add(nozzle);
      const nozzleGlow = new THREE.Mesh(new THREE.CircleGeometry(0.2, 32), fire(COLORS.orange, 0));
      nozzleGlow.rotation.x = Math.PI / 2;
      nozzleGlow.position.y = -1.585;
      robot.add(nozzleGlow);

      const flame = new THREE.Group();
      flame.position.y = -1.58;
      robot.add(flame);
      const flameCone = (r: number, color: string) => {
        const geo = new THREE.ConeGeometry(r, 1, 28, 1, true);
        geo.rotateX(Math.PI);
        geo.translate(0, -0.5, 0); // hang down from the nozzle
        const m = new THREE.Mesh(geo, fire(color, 0));
        flame.add(m);
        return m;
      };
      const flameOuter = flameCone(0.25, COLORS.orange);
      const flameMid = flameCone(0.16, "#ffc46b");
      const flameCore = flameCone(0.08, "#fffbea");
      const flameHalo = new THREE.Mesh(new THREE.SphereGeometry(0.5, 24, 24), fire(COLORS.orange, 0));
      flameHalo.scale.set(1, 1.6, 1);
      flameHalo.position.y = -0.45;
      flame.add(flameHalo);
      const flameLight = new THREE.PointLight(COLORS.orange, 0, 5, 1.6);
      flameLight.position.y = -1.9;
      robot.add(flameLight);

      // ---- hover ring + soft beam (gives way to the rocket) ----
      const hoverRing = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.04, 12, 48), glow(COLORS.accent, 0.99));
      hoverRing.rotation.x = Math.PI / 2;
      hoverRing.position.y = -1.72;
      robot.add(hoverRing);
      const beam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.42, 0.7, 0.6, 32, 1, true),
        new THREE.MeshBasicMaterial({ color: COLORS.accent, transparent: true, opacity: 0.12, side: THREE.DoubleSide, depthWrite: false, toneMapped: false }),
      );
      beam.position.y = -2.05;
      robot.add(beam);

      // ---- the laptop, held in both hands in front of the body ----
      // group pivots at the robot's hands; the screen faces the robot, the lid's back faces us
      const laptop = new THREE.Group();
      laptop.position.set(0, -0.82, 0.98);
      laptop.rotation.x = 0.22; // tipped toward the viewer so the keyboard shows
      robot.add(laptop);
      laptop.add(new THREE.Mesh(new RoundedBoxGeometry(1.15, 0.065, 0.72, 4, 0.03), silver));
      const keys = new THREE.Mesh(new RoundedBoxGeometry(0.95, 0.01, 0.34, 2, 0.004), graphite);
      keys.position.set(0, 0.036, -0.06);
      laptop.add(keys);
      const pad = new THREE.Mesh(new RoundedBoxGeometry(0.3, 0.008, 0.16, 2, 0.003), graphite);
      pad.position.set(0, 0.036, 0.22);
      laptop.add(pad);
      // hinge on the far side from the robot (towards us)
      const lid = new THREE.Group();
      lid.position.set(0, 0.03, 0.35);
      lid.rotation.x = 0.28;
      laptop.add(lid);
      const lidShell = new THREE.Mesh(new RoundedBoxGeometry(1.15, 0.72, 0.045, 4, 0.03), silver);
      lidShell.position.y = 0.36;
      lid.add(lidShell);
      const logo = new THREE.Mesh(new THREE.CircleGeometry(0.075, 28), glow(COLORS.accent));
      logo.position.set(0, 0.36, 0.024);
      lid.add(logo);
      // screen faces the robot, with a few lines of glowing "code"
      const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.03, 0.6), glow("#0b1411"));
      screen.rotation.y = Math.PI;
      screen.position.set(0, 0.36, -0.024);
      lid.add(screen);
      const codeColors = [COLORS.accent, COLORS.violet, COLORS.orange, COLORS.accent, COLORS.yellow];
      const codeLines = codeColors.map((c, i) => {
        const w = 0.25 + ((i * 37) % 5) * 0.1;
        const line = new THREE.Mesh(new THREE.PlaneGeometry(w, 0.035), glow(c));
        line.rotation.y = Math.PI;
        line.position.set(0.4 - w / 2 - (i % 2) * 0.08, 0.56 - i * 0.09, -0.026);
        lid.add(line);
        return line;
      });
      // the screen's light falls on the robot's face
      const screenLight = new THREE.PointLight(COLORS.accent, 3, 2.6, 2);
      screenLight.position.set(0, -0.15, 0.7);
      robot.add(screenLight);

      // hands gripping the sides of the laptop
      const handL = new THREE.Mesh(new THREE.SphereGeometry(0.19, 28, 28), mint);
      const handR = new THREE.Mesh(new THREE.SphereGeometry(0.19, 28, 28), mint);
      robot.add(handL, handR);

      // ---- sparks: glowing embers sprayed from the nozzle ----
      const SPARKS = 80;
      const sparkPos = new Float32Array(SPARKS * 3);
      const sparkCol = new Float32Array(SPARKS * 3);
      const sparks = Array.from({ length: SPARKS }, () => ({ x: 0, y: -99, z: 0, vx: 0, vy: 0, vz: 0, life: 0, max: 1 }));
      const sparkGeo = new THREE.BufferGeometry();
      sparkGeo.setAttribute("position", new THREE.BufferAttribute(sparkPos, 3));
      sparkGeo.setAttribute("color", new THREE.BufferAttribute(sparkCol, 3));
      const sparkPoints = new THREE.Points(
        sparkGeo,
        new THREE.PointsMaterial({ size: 0.1, vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }),
      );
      sparkPoints.frustumCulled = false;
      scene.add(sparkPoints);
      const hot = new THREE.Color("#fff3c4");
      const warm = new THREE.Color(COLORS.orange);
      const tmp = new THREE.Color();
      let sparkDebt = 0;

      // ---- smoke: soft puffs that billow, drift and fade ----
      const GROUND = -2.45;
      const puffTex = puffTexture();
      const PUFFS = 36;
      const puffs = Array.from({ length: PUFFS }, () => {
        const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: puffTex, transparent: true, depthWrite: false, opacity: 0, color: "#dfe4ee" }));
        sp.visible = false;
        scene.add(sp);
        return { sp, vx: 0, vy: 0, life: 0, max: 1, size: 1, grow: 1, alpha: 0.6 };
      });
      const puff = (x: number, y: number, vx: number, vy: number, size: number, life: number, alpha: number) => {
        const p = puffs.find((q) => q.life <= 0);
        if (!p) return;
        p.sp.position.set(x, y, 0.3 + Math.random() * 0.3);
        p.vx = vx;
        p.vy = vy;
        p.size = size;
        p.grow = size * (1.6 + Math.random() * 0.8);
        p.max = p.life = life;
        p.alpha = alpha;
        p.sp.visible = true;
      };
      const burst = (y: number, count: number, spread: number, size: number) => {
        for (let i = 0; i < count; i++) {
          const dir = (i / (count - 1)) * 2 - 1; // fan out left ↔ right
          puff(dir * 0.25, y + Math.random() * 0.1, dir * spread * (0.7 + Math.random() * 0.5), 0.15 + Math.random() * 0.35, size * (0.8 + Math.random() * 0.4), 0.9 + Math.random() * 0.5, 0.55);
        }
      };
      let trailDebt = 0;

      // ---- shadow ----
      const shadow = new THREE.Mesh(
        new THREE.CircleGeometry(0.8, 40),
        new THREE.MeshBasicMaterial({ color: "#000000", transparent: true, opacity: 0.45, depthWrite: false }),
      );
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.y = GROUND;
      scene.add(shadow);

      // ---- glossy toys ----
      const toy = (geo: THREE.BufferGeometry, color: string) =>
        new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({ color, roughness: 0.25, clearcoat: 1 }));
      const toys = [
        { mesh: toy(new THREE.TorusGeometry(0.22, 0.09, 16, 36), COLORS.orange), x: -2.15, y: 1.0, s: 1.0 },
        { mesh: toy(new THREE.IcosahedronGeometry(0.26, 0), COLORS.violet), x: 2.15, y: 1.3, s: 1.3 },
        { mesh: toy(new RoundedBoxGeometry(0.32, 0.32, 0.32, 4, 0.08), COLORS.yellow), x: 2.0, y: -1.05, s: 0.8 },
      ];
      toys.forEach((t) => {
        t.mesh.position.set(t.x, t.y, -0.4);
        scene.add(t.mesh);
      });

      // ---- input ----
      const look = { x: 0, y: 0 };
      const lookNow = { x: 0, y: 0 };
      const onMove = (e: PointerEvent) => {
        const r = renderer.domElement.getBoundingClientRect();
        look.x = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2)));
        look.y = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height * 0.6)) / (window.innerHeight / 2)));
      };
      let launchAt = -100;
      let clock = 0;
      let prev = 0;
      let prevY = 0;
      const fired = { ignite: false, land: false };
      const onDown = () => {
        if (clock - launchAt > FLIGHT) {
          launchAt = clock;
          fired.ignite = fired.land = false;
          onJump?.();
        }
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      renderer.domElement.addEventListener("pointerdown", onDown);

      return {
        frame: (t) => {
          clock = t;
          const dt = Math.min(0.05, Math.max(0.0001, t - prev));
          prev = t;

          const f = t - launchAt;
          const fl = flight(f);
          const flying = f >= 0 && f < FLIGHT;
          const ex = fl.excited;

          // ---- position, squash & stretch ----
          const hover = Math.sin(t * 2) * 0.12 * (1 - ex);
          const shake = f >= 0 && f < 0.3 ? Math.sin(t * 90) * 0.025 : 0;
          const lift = hover + fl.y;
          const vel = (lift - prevY) / dt;
          prevY = lift;
          robot.position.set(shake, lift, 0);
          robot.rotation.z = Math.sin(t * 1.3) * 0.03 * (1 - ex) + Math.sin(t * 6) * 0.015 * fl.thrust;
          const st = fl.stretch;
          robot.scale.set(1 - st * 0.6, 1 + st, 1 - st * 0.6);

          const s = Math.max(0.3, 1 - lift * 0.25);
          shadow.scale.setScalar(s);
          (shadow.material as THREE.MeshBasicMaterial).opacity = Math.max(0.06, 0.45 - lift * 0.15);

          // ---- hover ring hands over to the rocket ----
          const ringOn = 1 - smooth(0, 0.25, ex);
          hoverRing.scale.setScalar(1 + Math.sin(t * 4) * 0.06);
          (hoverRing.material as THREE.MeshBasicMaterial).opacity = 0.99 * ringOn;
          (beam.material as THREE.MeshBasicMaterial).opacity = (0.1 + Math.sin(t * 4) * 0.03) * ringOn;

          // ---- flame: grows with thrust and stretches with upward speed ----
          const th = fl.thrust;
          flame.visible = th > 0.01;
          const flick = 1 + Math.sin(t * 38) * 0.12 + Math.sin(t * 23 + 1) * 0.08;
          const len = (0.25 + th * 0.9 + Math.max(0, vel) * 0.16) * flick;
          const wide = 0.75 + th * 0.45;
          flameOuter.scale.set(wide, len, wide);
          flameMid.scale.set(1, len * 0.75, 1);
          flameCore.scale.set(1, len * 0.45, 1);
          (flameOuter.material as THREE.MeshBasicMaterial).opacity = 0.75 * th;
          (flameMid.material as THREE.MeshBasicMaterial).opacity = 0.9 * th;
          (flameCore.material as THREE.MeshBasicMaterial).opacity = Math.min(1, th * 1.3);
          (flameHalo.material as THREE.MeshBasicMaterial).opacity = 0.22 * th;
          flameHalo.scale.set(1, 1.2 + len * 0.6, 1);
          (nozzleGlow.material as THREE.MeshBasicMaterial).opacity = th;
          flameLight.intensity = th * 7 * flick;

          // ---- smoke: burst on ignition, trail while falling, cloud on landing ----
          if (flying && !fired.ignite && f > 0.06) {
            fired.ignite = true;
            burst(GROUND + 0.25, 8, 1.4, 0.8);
          }
          if (flying && !fired.land && f > 2.25) {
            fired.land = true;
            burst(GROUND + 0.2, 12, 2.0, 1.1);
          }
          if (flying && f > 1.3 && f < 2.25) {
            trailDebt += 9 * dt;
            while (trailDebt >= 1) {
              trailDebt -= 1;
              puff((Math.random() - 0.5) * 0.3, lift - 1.75, (Math.random() - 0.5) * 0.4, 0.25 + Math.random() * 0.2, 0.45, 0.8, 0.4);
            }
          }
          for (const p of puffs) {
            if (p.life <= 0) continue;
            p.life -= dt;
            const k = 1 - Math.max(0, p.life) / p.max; // 0 → 1 over its life
            p.sp.position.x += p.vx * dt;
            p.sp.position.y += p.vy * dt;
            p.vx *= 0.97;
            const size = p.size + (p.grow - p.size) * easeOutCubic(k);
            p.sp.scale.set(size, size, 1);
            p.sp.material.opacity = p.alpha * (k < 0.15 ? k / 0.15 : 1 - (k - 0.15) / 0.85);
            if (p.life <= 0) p.sp.visible = false;
          }

          // ---- sparks while the rocket is strong ----
          sparkDebt = Math.min(2, sparkDebt + Math.max(0, th - 0.3) * 110 * dt);
          for (const sp of sparks) {
            if (sparkDebt < 1) break;
            if (sp.life > 0) continue;
            sparkDebt -= 1;
            sp.x = shake + (Math.random() - 0.5) * 0.2;
            sp.y = lift - 1.65;
            sp.z = (Math.random() - 0.5) * 0.2;
            sp.vx = (Math.random() - 0.5) * 1.8;
            sp.vy = -2.5 - Math.random() * 3;
            sp.vz = (Math.random() - 0.5) * 1.2;
            sp.max = sp.life = 0.3 + Math.random() * 0.35;
          }
          sparks.forEach((sp, i) => {
            if (sp.life > 0) {
              sp.life -= dt;
              sp.vy += 3 * dt;
              sp.x += sp.vx * dt;
              sp.y = Math.max(GROUND + 0.05, sp.y + sp.vy * dt);
              sp.z += sp.vz * dt;
            }
            const k = Math.max(0, sp.life / sp.max);
            tmp.copy(warm).lerp(hot, k).multiplyScalar(k); // fades to black = invisible with additive blending
            sparkPos[i * 3] = sp.x;
            sparkPos[i * 3 + 1] = sp.life > 0 ? sp.y : -99;
            sparkPos[i * 3 + 2] = sp.z;
            sparkCol[i * 3] = tmp.r;
            sparkCol[i * 3 + 1] = tmp.g;
            sparkCol[i * 3 + 2] = tmp.b;
          });
          sparkGeo.attributes.position.needsUpdate = true;
          sparkGeo.attributes.color.needsUpdate = true;

          // ---- head: follows the cursor, glances down at the screen every ~8s ----
          lookNow.x += (look.x - lookNow.x) * 0.08;
          lookNow.y += (look.y - lookNow.y) * 0.08;
          const g = t % 8;
          const glance = smooth(5.6, 6.0, g) * (1 - smooth(7.0, 7.4, g)) * (1 - ex);
          head.rotation.y = lookNow.x * 0.45 * (1 - ex) * (1 - glance);
          head.rotation.x = ((lookNow.y * 0.22 + Math.sin(t * 2 + 0.6) * 0.03) * (1 - glance) + 0.3 * glance) * (1 - ex) - 0.12 * ex;
          const blink = t % 3.6 > 3.45 ? 0.1 : 1;
          eyes.forEach((e, i) => {
            e.position.x = (i ? 0.34 : -0.34) + lookNow.x * 0.05 * (1 - glance);
            e.position.y = 0.08 - lookNow.y * 0.05 * (1 - glance) - 0.05 * glance;
            e.scale.y = blink;
            e.visible = !flying;
          });
          happy.forEach((h) => (h.visible = flying));
          mouth.visible = !flying;
          wow.visible = flying;

          antenna.rotation.z = -Math.sin(t * 2 - 0.5) * 0.12 - Math.sin(t * 14) * 0.08 * fl.thrust - vel * 0.02;
          tip.scale.setScalar(1 + Math.sin(t * 4) * 0.15 + fl.thrust * 0.3);
          earRings.forEach((r, i) => r.scale.setScalar(1 + Math.sin(t * 3 + i * Math.PI) * 0.12));

          // ---- laptop: bobs in its hands and lags a little behind the motion ----
          const bob = Math.sin(t * 2.4) * 0.03;
          laptop.position.y = -0.82 + bob;
          laptop.rotation.x = 0.22 - Math.max(-0.15, Math.min(0.15, vel * 0.03));
          laptop.rotation.z = Math.sin(t * 1.7) * 0.03 * (1 - ex);
          handL.position.set(-0.64, -0.8 + bob, 1.0);
          handR.position.set(0.64, -0.8 + bob, 1.0);
          // code on the screen "scrolls"
          codeLines.forEach((l, i) => {
            l.visible = Math.sin(t * 2.5 - i * 0.9) > -0.6;
          });

          toys.forEach((toyItem, i) => {
            toyItem.mesh.position.y = toyItem.y + Math.sin(t * toyItem.s + i * 1.7) * 0.18;
            toyItem.mesh.rotation.x = t * 0.5 * toyItem.s + i;
            toyItem.mesh.rotation.y = t * 0.7 * toyItem.s;
          });
        },
        dispose: () => {
          window.removeEventListener("pointermove", onMove);
          renderer.domElement.removeEventListener("pointerdown", onDown);
          puffs.forEach((p) => p.sp.material.dispose());
          puffTex.dispose();
          envTex.dispose();
          pmrem.dispose();
        },
      };
    },
    { fov: 30, z: 16.4 },
  );

  return (
    <canvas
      ref={canvasRef}
      className={className}
      role="img"
      aria-label="A glossy little robot holding a laptop. Click it to launch it on its rocket."
    />
  );
}
