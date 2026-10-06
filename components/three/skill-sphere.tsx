"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useThreeScene } from "./use-three-scene";
import { COLORS } from "@/lib/data";

/** A wireframe sphere with technology labels pinned to it; spins faster under the cursor. */
export function SkillSphere({ skills }: { skills: { name: string; color: string }[] }) {
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const pointer = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  const canvasRef = useThreeScene(
    ({ scene, camera, size }) => {
      const group = new THREE.Group();
      scene.add(group);
      group.add(
        new THREE.Mesh(
          new THREE.IcosahedronGeometry(2.0, 2),
          new THREE.MeshBasicMaterial({ color: 0x1f2735, wireframe: true, transparent: true, opacity: 0.9 })
        )
      );

      // dust on the surface
      const dust = new Float32Array(600 * 3);
      for (let i = 0; i < 600; i++) {
        const u = Math.random() * 2 - 1;
        const a = Math.random() * Math.PI * 2;
        const q = Math.sqrt(1 - u * u);
        dust.set([2.02 * q * Math.cos(a), 2.02 * u, 2.02 * q * Math.sin(a)], i * 3);
      }
      const dustGeo = new THREE.BufferGeometry();
      dustGeo.setAttribute("position", new THREE.BufferAttribute(dust, 3));
      group.add(new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: COLORS.accent, size: 0.03, transparent: true, opacity: 0.5 })));

      // one node per skill, evenly spread (Fibonacci sphere)
      const n = skills.length;
      const nodes: THREE.Vector3[] = [];
      const nodeGeo = new THREE.SphereGeometry(0.045, 10, 10);
      const nodeMat = new THREE.MeshBasicMaterial({ color: COLORS.accent });
      for (let i = 0; i < n; i++) {
        const y = 1 - (i / (n - 1)) * 2;
        const r = Math.sqrt(1 - y * y);
        const th = i * 2.399963;
        const v = new THREE.Vector3(Math.cos(th) * r * 2.35, y * 2.35, Math.sin(th) * r * 2.35);
        const m = new THREE.Mesh(nodeGeo, nodeMat);
        m.position.copy(v);
        group.add(m);
        nodes.push(v);
      }
      const tmp = new THREE.Vector3();

      return {
        frame: () => {
          const p = pointer.current;
          p.x += (p.tx - p.x) * 0.06;
          p.y += (p.ty - p.y) * 0.06;
          group.rotation.y += 0.004 + p.x * 0.025;
          group.rotation.x += (p.y * 0.6 - group.rotation.x) * 0.05;
          group.updateMatrixWorld();

          // project each node to 2D and move its HTML label there
          for (let i = 0; i < n; i++) {
            const el = labelRefs.current[i];
            if (!el) continue;
            tmp.copy(nodes[i]).applyMatrix4(group.matrixWorld);
            const depth = (tmp.z + 2.35) / 4.7;
            tmp.project(camera);
            const sx = (tmp.x * 0.5 + 0.5) * size.w;
            const sy = (-tmp.y * 0.5 + 0.5) * size.h;
            el.style.transform = `translate3d(${sx.toFixed(1)}px,${sy.toFixed(1)}px,0) translate(-50%,-140%) scale(${(0.7 + depth * 0.45).toFixed(3)})`;
            el.style.opacity = (0.15 + depth * 0.85).toFixed(2);
            el.style.zIndex = String(Math.round(depth * 100));
          }
        },
      };
    },
    { fov: 45, z: 7 }
  );

  return (
    <div
      className="relative h-[560px] cursor-grab overflow-hidden rounded-3xl border border-line bg-bg-2"
      onPointerMove={(e) => {
        const rc = e.currentTarget.getBoundingClientRect();
        pointer.current.tx = ((e.clientX - rc.left) / rc.width) * 2 - 1;
        pointer.current.ty = ((e.clientY - rc.top) / rc.height) * 2 - 1;
      }}
      onPointerLeave={() => {
        pointer.current.tx = 0;
        pointer.current.ty = 0;
      }}
    >
      <canvas ref={canvasRef} aria-label="Rotating 3D sphere of technologies" className="absolute inset-0 block h-full w-full" />
      <div className="pointer-events-none absolute inset-0">
        {skills.map((s, i) => (
          <span
            key={s.name}
            ref={(el) => {
              labelRefs.current[i] = el;
            }}
            className="absolute left-0 top-0 whitespace-nowrap rounded-full border bg-[rgba(13,17,24,.86)] px-3 py-1.5 font-mono text-[13px] font-medium text-ink will-change-transform"
            style={{ borderColor: s.color, opacity: 0 }}
          >
            {s.name}
          </span>
        ))}
      </div>
      <div className="absolute bottom-[18px] left-5 flex flex-wrap gap-3.5 font-mono text-[11px] text-dim">
        {[
          ["backend", COLORS.orange],
          ["frontend", COLORS.accent],
          ["data", COLORS.violet],
          ["tools", COLORS.yellow],
        ].map(([label, c]) => (
          <span key={label} className="inline-flex items-center gap-1.5">
            <i className="h-2 w-2 rounded-full" style={{ background: c }} />
            {label}
          </span>
        ))}
      </div>
      <span className="absolute right-[18px] top-4 font-mono text-[11px] text-faint">move your cursor to spin</span>
    </div>
  );
}
