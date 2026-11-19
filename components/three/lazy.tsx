"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ComponentType } from "react";

/**
 * Three.js is heavy, so none of the 3D scenes ship with the first page load.
 * Each scene's code is split into its own chunk and only downloaded — and its
 * WebGL context only created — once its box scrolls within ~1 screen of view.
 * The wrapper div keeps the scene's size, so nothing jumps when it appears.
 */
function lazyScene<P extends { className?: string }>(load: () => Promise<ComponentType<P>>) {
  const Scene = dynamic(load, { ssr: false });
  return function LazyScene({ className, ...rest }: P) {
    const ref = useRef<HTMLDivElement>(null);
    const [near, setNear] = useState(false);
    useEffect(() => {
      const el = ref.current;
      if (!el) return;
      const io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            setNear(true);
            io.disconnect();
          }
        },
        { rootMargin: "100% 0px" },
      );
      io.observe(el);
      return () => io.disconnect();
    }, []);
    return (
      <div ref={ref} className={className}>
        {near && <Scene {...(rest as unknown as P)} className="block h-full w-full" />}
      </div>
    );
  };
}

export const LazyLogisticsGlobe = lazyScene(() => import("./logistics-globe").then((m) => m.LogisticsGlobe));
export const LazyWaveField = lazyScene(() => import("./wave-field").then((m) => m.WaveField));
export const LazyTunnelField = lazyScene(() => import("./tunnel-field").then((m) => m.TunnelField));
export const LazyFooterRobot = lazyScene(() => import("./footer-robot").then((m) => m.FooterRobot));
