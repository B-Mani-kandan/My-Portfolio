"use client";

import * as THREE from "three";
import { useThreeScene } from "./use-three-scene";
import { COLORS } from "@/lib/data";

const HUB: [number, number] = [13.08, 80.27]; // Chennai
const PORTS: [number, number][] = [
  [25.2, 55.27], // Dubai
  [1.35, 103.82], // Singapore
  [51.92, 4.48], // Rotterdam
  [31.23, 121.47], // Shanghai
  [40.71, -74.0], // New York
  [53.55, 9.99], // Hamburg
  [-33.87, 151.2], // Sydney
  [-29.86, 31.02], // Durban
  [35.68, 139.69], // Tokyo
  [19.07, 72.88], // Mumbai
];

/** Wireframe globe with shipping arcs from Chennai and cargo dots travelling along them. */
export function LogisticsGlobe() {
  const canvasRef = useThreeScene(
    ({ scene }) => {
      const R = 2.1;
      const group = new THREE.Group();
      group.rotation.x = 0.35;
      scene.add(group);
      group.add(new THREE.Mesh(new THREE.SphereGeometry(R, 36, 22), new THREE.MeshBasicMaterial({ color: 0x1a2230, wireframe: true, transparent: true, opacity: 0.8 })));
      group.add(new THREE.Mesh(new THREE.SphereGeometry(R * 0.985, 32, 32), new THREE.MeshBasicMaterial({ color: 0x07090d })));

      const ll = (lat: number, lon: number, r: number) => {
        const phi = ((90 - lat) * Math.PI) / 180;
        const th = ((lon + 180) * Math.PI) / 180;
        return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(th), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(th));
      };

      const hub = ll(HUB[0], HUB[1], R);
      const hubMesh = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 12), new THREE.MeshBasicMaterial({ color: COLORS.orange }));
      hubMesh.position.copy(hub);
      group.add(hubMesh);

      const cityGeo = new THREE.SphereGeometry(0.04, 8, 8);
      const cityMat = new THREE.MeshBasicMaterial({ color: 0xf2f5fa });
      const arcMat = new THREE.LineBasicMaterial({ color: COLORS.accent, transparent: true, opacity: 0.55 });
      const shipMat = new THREE.MeshBasicMaterial({ color: COLORS.orange });
      const ships = PORTS.map(([lat, lon], idx) => {
        const p = ll(lat, lon, R);
        const city = new THREE.Mesh(cityGeo, cityMat);
        city.position.copy(p);
        group.add(city);
        const mid = hub.clone().add(p).multiplyScalar(0.5).normalize().multiplyScalar(R + hub.distanceTo(p) * 0.38);
        const curve = new THREE.QuadraticBezierCurve3(hub, mid, p);
        group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(64)), arcMat));
        const ship = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), shipMat);
        group.add(ship);
        return { ship, curve, off: idx * 0.13, speed: 0.12 + (idx % 3) * 0.04 };
      });

      const ring = new THREE.Mesh(new THREE.TorusGeometry(R * 1.35, 0.008, 8, 160), new THREE.MeshBasicMaterial({ color: 0x2a3344 }));
      ring.rotation.x = Math.PI / 2.2;
      scene.add(ring);

      return {
        frame: (t) => {
          group.rotation.y = -1.2 + t * 0.12;
          ring.rotation.z = t * 0.1;
          for (const s of ships) s.ship.position.copy(s.curve.getPoint((t * s.speed + s.off) % 1));
        },
      };
    },
    { fov: 40, z: 7.4 }
  );

  return <canvas ref={canvasRef} aria-label="3D globe with shipping routes from Chennai" className="absolute inset-0 block h-full w-full" />;
}
