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
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
    } catch {
      return; // no WebGL — leave the canvas empty
    }
    // 1.5x is visually identical for these scenes and draws ~45% fewer pixels than 2x
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(opts.fov ?? 45, 1, 0.1, 100);
    camera.position.set(0, 0, opts.z ?? 7);
    const kit: SceneKit = { renderer, scene, camera, size: { w: 0, h: 0 } };
    const { frame, dispose } = setupRef.current(kit);

    // size comes from a ResizeObserver, so the loop never reads layout
    let pendingW = canvas.clientWidth || 1;
    let pendingH = canvas.clientHeight || 1;
    const ro = new ResizeObserver(([e]) => {
      pendingW = Math.round(e.contentRect.width) || 1;
      pendingH = Math.round(e.contentRect.height) || 1;
    });
    ro.observe(canvas);
    const fit = () => {
      if (pendingW === kit.size.w && pendingH === kit.size.h) return;
      kit.size.w = pendingW; // mutate in place so setups that captured `size` see updates
      kit.size.h = pendingH;
      renderer.setSize(pendingW, pendingH, false);
      camera.aspect = pendingW / pendingH;
      camera.updateProjectionMatrix();
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const clock = new THREE.Clock();
    let raf = 0;
    let visible = false;
    const loop = () => {
      raf = visible ? requestAnimationFrame(loop) : 0;
      fit();
      frame(reduce ? 0 : clock.getElapsedTime());
      renderer.render(scene, camera);
    };
    // the loop stops completely while the scene is off-screen and restarts when it's back
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);
    loop(); // draw the first frame right away

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
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
