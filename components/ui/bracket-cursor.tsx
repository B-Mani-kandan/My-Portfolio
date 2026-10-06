"use client";

import { useEffect, useRef } from "react";

/**
 * BracketCursor — replaces the system cursor with a dot and four corner brackets
 * that spin forever. The dot sits exactly on the pointer; the bracket square
 * trails a touch behind and grows over links and buttons.
 *
 * Only runs on devices with a mouse (fine pointer); touch devices keep their default.
 */
const HOVER = "a, button, [role='button'], input, textarea, select, label, summary";

export function BracketCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const root = document.documentElement;
    root.classList.add("bracket-cursor");

    const pos = { x: -100, y: -100 };
    const trail = { x: -100, y: -100 };
    let raf = 0;
    let shown = false;

    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (!shown) {
        trail.x = pos.x;
        trail.y = pos.y;
        shown = true;
        root.classList.add("bracket-cursor-on");
      }
      const t = e.target as Element | null;
      ring.dataset.hover = t?.closest(HOVER) ? "1" : "";
    };
    const onLeave = () => {
      shown = false;
      root.classList.remove("bracket-cursor-on");
    };
    const onDown = () => (ring.dataset.down = "1");
    const onUp = () => (ring.dataset.down = "");

    const tick = () => {
      raf = requestAnimationFrame(tick);
      trail.x += (pos.x - trail.x) * 0.22;
      trail.y += (pos.y - trail.y) * 0.22;
      dot.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      ring.style.transform = `translate3d(${trail.x}px, ${trail.y}px, 0)`;
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    return () => {
      cancelAnimationFrame(raf);
      root.classList.remove("bracket-cursor", "bracket-cursor-on");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <div aria-hidden="true" className="bc-layer">
      <div ref={ringRef} className="bc-pos">
        <div className="bc-ring">
          <span className="bc-corner bc-tl" />
          <span className="bc-corner bc-tr" />
          <span className="bc-corner bc-bl" />
          <span className="bc-corner bc-br" />
        </div>
      </div>
      <div ref={dotRef} className="bc-pos">
        <span className="bc-dot" />
      </div>
    </div>
  );
}

export default BracketCursor;
