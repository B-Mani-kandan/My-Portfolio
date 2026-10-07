"use client";

import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { useThreeScene } from "./use-three-scene";
import { COLORS } from "@/lib/data";

/**
 * FooterRobot — a glossy little designer-toy robot.
 *
 *  - Egg-shaped head with a dark glass visor; glowing eyes follow the cursor and blink.
 *  - Floating hands type on a floating laptop; every few seconds one waves.
 *  - Hovers on a pulsing ring of light; click it and it hops with happy eyes.
 *  - Soft studio reflections (RoomEnvironment) give it a polished vinyl-toy finish.
 */
export function FooterRobot({ className, onJump }: { className?: string; onJump?: () => void }) {
  const canvasRef = useThreeScene(
    ({ scene, camera, renderer }) => {
      camera.fov = 30;
      camera.position.set(0, 0.5, 12.2);
      camera.lookAt(0, -0.2, 0);
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
      const dark = new THREE.MeshPhysicalMaterial({ color: "#232c3b", roughness: 0.45, clearcoat: 0.5 });
      const glow = (color: string, opacity = 1) =>
        new THREE.MeshBasicMaterial({ color, transparent: opacity < 1, opacity, toneMapped: false });

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
      [-0.62, 0.62].forEach((x) => {
        const cheek = new THREE.Mesh(new THREE.CircleGeometry(0.075, 20), glow("#ff7fa8", 0.75));
        cheek.position.set(x, -0.17, 0.86);
        cheek.rotation.y = x * 0.85;
        head.add(cheek);
      });

      // ear pods with glowing rings
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

      // antenna with a bouncy glowing ball
      const antenna = new THREE.Group();
      antenna.position.y = 0.92;
      head.add(antenna);
      const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.45, 12), metal);
      stalk.position.y = 0.2;
      antenna.add(stalk);
      const tip = new THREE.Mesh(new THREE.SphereGeometry(0.11, 24, 24), glow(COLORS.orange));
      tip.position.y = 0.46;
      antenna.add(tip);

      // ---- body: a smaller egg with a glowing core ----
      const torso = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 36), shell);
      torso.scale.set(0.85, 0.72, 0.75);
      torso.position.y = -0.78;
      robot.add(torso);
      const coreRing = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.035, 12, 36), glow(COLORS.accent));
      coreRing.position.set(0, -0.72, 0.73);
      robot.add(coreRing);
      const core = new THREE.Mesh(new THREE.SphereGeometry(0.09, 20, 20), glow(COLORS.violet));
      core.position.set(0, -0.72, 0.73);
      robot.add(core);

      // ---- hover ring + soft light underneath ----
      const hoverRing = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.04, 12, 48), glow(COLORS.accent));
      hoverRing.rotation.x = Math.PI / 2;
      hoverRing.position.y = -1.62;
      robot.add(hoverRing);
      const beam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.42, 0.7, 0.6, 32, 1, true),
        new THREE.MeshBasicMaterial({ color: COLORS.accent, transparent: true, opacity: 0.12, side: THREE.DoubleSide, depthWrite: false, toneMapped: false }),
      );
      beam.position.y = -1.95;
      robot.add(beam);

      // ---- floating hands ----
      const hand = () => {
        const h = new THREE.Mesh(new THREE.SphereGeometry(0.19, 28, 28), mint);
        robot.add(h);
        return h;
      };
      const handL = hand();
      const handR = hand();

      // ---- floating laptop (low, so the hands show above the lid) ----
      const laptop = new THREE.Group();
      laptop.position.set(0, -1.25, 1.1);
      robot.add(laptop);
      laptop.add(new THREE.Mesh(new RoundedBoxGeometry(1.3, 0.07, 0.8, 4, 0.03), dark));
      const lid = new THREE.Group();
      lid.position.set(0, 0.03, 0.38);
      lid.rotation.x = 0.3;
      laptop.add(lid);
      const screen = new THREE.Mesh(new RoundedBoxGeometry(1.3, 0.32, 0.05, 4, 0.03), dark);
      screen.position.y = 0.16;
      lid.add(screen);
      const logo = new THREE.Mesh(new THREE.CircleGeometry(0.07, 24), glow(COLORS.accent));
      logo.position.set(0, 0, 0.03);
      screen.add(logo);

      // ---- shadow ----
      const shadow = new THREE.Mesh(
        new THREE.CircleGeometry(0.8, 40),
        new THREE.MeshBasicMaterial({ color: "#000000", transparent: true, opacity: 0.45, depthWrite: false }),
      );
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.y = -2.35;
      scene.add(shadow);

      // ---- glossy toys ----
      const toy = (geo: THREE.BufferGeometry, color: string) =>
        new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({ color, roughness: 0.25, clearcoat: 1 }));
      const toys = [
        { mesh: toy(new THREE.TorusGeometry(0.22, 0.09, 16, 36), COLORS.orange), x: -2.15, y: 1.0, s: 1.0 },
        { mesh: toy(new THREE.IcosahedronGeometry(0.26, 0), COLORS.violet), x: 2.15, y: 1.2, s: 1.3 },
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
        look.y = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height * 0.35)) / (window.innerHeight / 2)));
      };
      let jumpAt = -10;
      let clock = 0;
      const onDown = () => {
        if (clock - jumpAt > 1) {
          jumpAt = clock;
          onJump?.();
        }
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      renderer.domElement.addEventListener("pointerdown", onDown);

      const smooth = (a: number, b: number, x: number) => {
        const k = Math.min(1, Math.max(0, (x - a) / (b - a)));
        return k * k * (3 - 2 * k);
      };

      return {
        frame: (t) => {
          clock = t;

          // hover + hop (with a squash on landing)
          const j = t - jumpAt;
          const hop = j >= 0 && j < 0.7 ? Math.sin((j / 0.7) * Math.PI) : 0;
          const squash = j >= 0.6 && j < 0.85 ? Math.sin(((j - 0.6) / 0.25) * Math.PI) * 0.07 : 0;
          const hover = Math.sin(t * 2) * 0.12;
          const lift = hover + hop * 0.7;
          robot.position.y = lift;
          robot.rotation.z = Math.sin(t * 1.3) * 0.03;
          robot.scale.set(1 + squash, 1 - squash, 1 + squash);
          const jumping = j >= 0 && j < 1.1;

          shadow.scale.setScalar(1 - lift * 0.25);
          (shadow.material as THREE.MeshBasicMaterial).opacity = 0.45 - lift * 0.15;
          const pulse = 1 + Math.sin(t * 4) * 0.06 + hop * 0.25;
          hoverRing.scale.set(pulse, pulse, pulse);
          (beam.material as THREE.MeshBasicMaterial).opacity = 0.1 + Math.sin(t * 4) * 0.03 + hop * 0.12;

          // head and eyes follow the cursor
          lookNow.x += (look.x - lookNow.x) * 0.08;
          lookNow.y += (look.y - lookNow.y) * 0.08;
          head.rotation.y = lookNow.x * 0.45;
          head.rotation.x = lookNow.y * 0.22 + Math.sin(t * 2 + 0.6) * 0.03;
          const blink = t % 3.6 > 3.45 ? 0.1 : 1;
          eyes.forEach((e, i) => {
            e.position.x = (i ? 0.34 : -0.34) + lookNow.x * 0.05;
            e.position.y = 0.08 - lookNow.y * 0.05;
            e.scale.y = blink;
            e.visible = !jumping;
          });
          happy.forEach((h) => (h.visible = jumping));

          // antenna lags behind the head a little, like it's springy
          antenna.rotation.z = -Math.sin(t * 2 - 0.5) * 0.12 - hop * 0.2;
          tip.scale.setScalar(1 + Math.sin(t * 4) * 0.15);
          earRings.forEach((r, i) => r.scale.setScalar(1 + Math.sin(t * 3 + i * Math.PI) * 0.12));
          core.scale.setScalar(1 + Math.sin(t * 5) * 0.2);

          // typing hands, interrupted by a wave every 7s
          const w = t % 7;
          const waving = smooth(0, 0.4, w - 4.6) * (1 - smooth(0, 0.4, w - 6.4));
          handL.position.set(-0.6, -0.85 + Math.max(0, Math.sin(t * 15)) * 0.1 + hop * 0.15, 0.85);
          const typeY = -0.85 + Math.max(0, Math.sin(t * 15 + Math.PI)) * 0.1;
          const waveX = 1.2 + Math.sin(t * 10) * 0.18;
          handR.position.set(
            0.6 + (waveX - 0.6) * waving,
            typeY + (0.35 - typeY) * waving + hop * 0.15,
            0.85 + (0.4 - 0.85) * waving,
          );

          (logo.material as THREE.MeshBasicMaterial).color.set(waving > 0.5 ? COLORS.orange : COLORS.accent);

          toys.forEach((toyItem, i) => {
            toyItem.mesh.position.y = toyItem.y + Math.sin(t * toyItem.s + i * 1.7) * 0.18;
            toyItem.mesh.rotation.x = t * 0.5 * toyItem.s + i;
            toyItem.mesh.rotation.y = t * 0.7 * toyItem.s;
          });
        },
        dispose: () => {
          window.removeEventListener("pointermove", onMove);
          renderer.domElement.removeEventListener("pointerdown", onDown);
          envTex.dispose();
          pmrem.dispose();
        },
      };
    },
    { fov: 30, z: 12.2 },
  );

  return (
    <canvas
      ref={canvasRef}
      className={className}
      role="img"
      aria-label="A glossy little robot hovering over a ring of light, typing on a laptop. Click it to make it hop."
    />
  );
}
