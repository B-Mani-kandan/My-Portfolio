"use client";

import * as THREE from "three";
import { useThreeScene } from "./use-three-scene";
import { COLORS } from "@/lib/data";

/** A rolling field of points used behind the contact section. */
export function WaveField({ className }: { className?: string }) {
  const canvasRef = useThreeScene(
    ({ scene, camera }) => {
      camera.position.set(0, 5, 11);
      camera.lookAt(0, 0, -2);
      const cols = 110;
      const rows = 44;
      const gap = 0.34;
      const pos = new Float32Array(cols * rows * 3);
      for (let x = 0; x < cols; x++)
        for (let z = 0; z < rows; z++) {
          const i = (x * rows + z) * 3;
          pos[i] = (x - cols / 2) * gap;
          pos[i + 2] = (z - rows / 2) * gap - 2;
        }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      scene.add(new THREE.Points(geo, new THREE.PointsMaterial({ color: COLORS.accent, size: 0.05, transparent: true, opacity: 0.5 })));

      return {
        frame: (t) => {
          const p = geo.attributes.position.array as Float32Array;
          for (let a = 0; a < cols; a++)
            for (let b = 0; b < rows; b++) {
              p[(a * rows + b) * 3 + 1] = Math.sin(a * 0.18 + t * 1.1) * 0.45 + Math.cos(b * 0.28 + t * 0.8) * 0.35;
            }
          geo.attributes.position.needsUpdate = true;
        },
      };
    },
    { fov: 55, z: 11 }
  );

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
