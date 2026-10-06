"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export type SceneKit = {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  size: { w: number; h: number };
};

type Setup = (kit: SceneKit) => {
  /** called every visible frame with elapsed seconds */
  frame: (t: number) => void;
  dispose?: () => void;
};

/**
 * Shared Three.js plumbing: renderer on a canvas, resize handling, pausing while
 * off-screen, reduced-motion support and cleanup.
 */
export function useThreeScene(setup: Setup, opts: { fov?: number; z?: number } = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const setupRef = useRef(setup);
  setupRef.current = setup;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch {
      return; // no WebGL — leave the canvas empty
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(opts.fov ?? 45, 1, 0.1, 100);
    camera.position.set(0, 0, opts.z ?? 7);
    const kit: SceneKit = { renderer, scene, camera, size: { w: 0, h: 0 } };
    const { frame, dispose } = setupRef.current(kit);

    const fit = () => {
      const w = canvas.clientWidth || 1;
      const h = canvas.clientHeight || 1;
      if (w === kit.size.w && h === kit.size.h) return;
      kit.size.w = w; // mutate in place so setups that captured `size` see updates
      kit.size.h = h;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);

    const clock = new THREE.Clock();
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      fit();
      frame(reduce ? 0 : clock.getElapsedTime());
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      dispose?.();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose?.();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat?.dispose?.();
      });
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return canvasRef;
}
