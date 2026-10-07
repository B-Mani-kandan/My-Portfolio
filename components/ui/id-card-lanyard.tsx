"use client";

import React, { useEffect, useRef } from "react";

/*
 * IDCardLanyard — a draggable ID card hanging from a physics-simulated lanyard.
 * Drag to swing, click to flip.
 *
 * Changes from the original component (marked "// added"):
 *  - `contained`: render inside a positioned parent instead of a fixed full-viewport
 *    overlay, so the card can live in a page section (e.g. About).
 *  - `photoUrl`: show a real photo on the front instead of the illustrated avatar.
 *  - `extraRowLabel` / `extraRowValue`: third ID row (default "Valid Thru").
 *  - The name uses the signature (Caveat) script.
 */

export interface IDCardLanyardProps {
  name?: string;
  role?: string;
  brand?: string;
  brandTagline?: string;
  pillars?: [string, string, string];
  location?: string;
  idNumber?: string;
  validThru?: string;
  site?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  /** Horizontal anchor: "50%", "120px", or "calc(100% - 130px)". */
  anchorX?: string;
  /** Vertical anchor offset in px from the top of the stage. */
  anchorY?: number;
  zIndex?: number;
  showHint?: boolean;
  className?: string;
  /** added: render inside the nearest positioned parent instead of over the whole viewport. */
  contained?: boolean;
  /** added: photo for the front face. */
  photoUrl?: string;
  /** added: label/value for the third ID row. */
  extraRowLabel?: string;
  extraRowValue?: string;
  /** added: rope length in px. */
  ropeLength?: number;
}

const CSS = `
.idcl-root{
  --idcl-accent:#2f8f6a;
  --idcl-accent-dim:#1f6a4d;
  --idcl-card:#faf7f1;
  --idcl-card-2:#efeadf;
  --idcl-card-ink:#15171d;
  --idcl-card-soft:#666c78;
  --idcl-card-line:#e1dbcb;
  --idcl-font-display:'Archivo','Arial Narrow',sans-serif;
  --idcl-font-mono:'JetBrains Mono','Consolas',monospace;
  --idcl-font-script:'Caveat',cursive;
  font-family:'Manrope',system-ui,sans-serif;
}
.idcl-root *{ box-sizing:border-box; }
.idcl-stage{ position:fixed; inset:0; z-index:var(--idcl-z, 60); pointer-events:none; overflow:visible; }
.idcl-root.idcl-contained{ position:absolute; inset:0; }
.idcl-root.idcl-contained .idcl-stage{ position:absolute; }
.idcl-rope{ position:absolute; inset:0; width:100%; height:100%; pointer-events:none; }
.idcl-rail{ position:absolute; top:0; width:64px; height:6px; transform:translateX(-50%); background:linear-gradient(180deg,#3a4150,#21252f); border-radius:0 0 4px 4px; box-shadow:0 2px 6px rgba(0,0,0,.5); pointer-events:none; }
.idcl-card{ position:absolute; width:clamp(210px, 60vw, 252px); aspect-ratio:252/470; perspective:1400px; cursor:grab; touch-action:none; user-select:none; transform-origin:top center; pointer-events:auto; }
.idcl-card:active{ cursor:grabbing; }
.idcl-flipper{ position:relative; width:100%; height:100%; transform-style:preserve-3d; }
.idcl-face{ position:absolute; inset:0; border-radius:18px; padding:16px 18px 14px; display:flex; flex-direction:column; backface-visibility:hidden; -webkit-backface-visibility:hidden;
  box-shadow:0 32px 60px -16px rgba(0,0,0,.7),0 10px 20px -8px rgba(0,0,0,.4),inset 0 1px 0 rgba(255,255,255,.65),inset 0 0 0 1px rgba(0,0,0,.05); }
.idcl-face::before{ content:""; position:absolute; inset:0; border-radius:inherit; pointer-events:none;
  background:linear-gradient(180deg,rgba(255,255,255,.55) 0%,transparent 24%),radial-gradient(rgba(0,0,0,.07) 1px,transparent 1.3px) 0 0/3px 3px; mix-blend-mode:multiply; opacity:.6; }
.idcl-face::after{ content:""; position:absolute; inset:0; border-radius:inherit; pointer-events:none;
  background:radial-gradient(circle at var(--mx,50%) var(--my,50%),rgba(255,255,255,.6),transparent 40%); mix-blend-mode:overlay; opacity:0; transition:opacity .3s ease; }
.idcl-card.idcl-hovering .idcl-face::after{ opacity:1; }
.idcl-front{ background:linear-gradient(165deg,var(--idcl-card),var(--idcl-card-2)); color:var(--idcl-card-ink); }
.idcl-back{ background:linear-gradient(165deg,var(--idcl-card-2),var(--idcl-card)); color:var(--idcl-card-ink); transform:rotateY(180deg); }
.idcl-holo{ position:absolute; top:14px; bottom:14px; right:5px; width:6px; border-radius:5px;
  background:repeating-linear-gradient(125deg,#eef1f7 0%,#cfd6e4 10%,#b9c2d6 20%,#e7ebf3 30%,#eef1f7 40%); background-size:220% 220%;
  animation:idcl-foil 7s linear infinite; box-shadow:inset 0 0 0 1px rgba(0,0,0,.1),0 0 6px rgba(255,255,255,.3); }
@keyframes idcl-foil{ to{ background-position:220% 0%; } }
@media (prefers-reduced-motion: reduce){ .idcl-holo{ animation:none; } .idcl-face::after{ transition:none; } }
.idcl-hole{ width:34px; height:9px; background:var(--idcl-card-ink); border-radius:5px; margin:0 auto 12px; flex-shrink:0; opacity:.85; }
.idcl-header{ display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px; }
.idcl-brand{ display:flex; align-items:flex-start; gap:6px; }
.idcl-brand-mark{ font-size:12px; color:var(--idcl-accent); line-height:1; margin-top:1px; }
.idcl-brand-text{ display:flex; flex-direction:column; }
.idcl-brand-text b{ font-family:var(--idcl-font-display); font-weight:800; font-size:12px; line-height:1.2; }
.idcl-brand-text small{ font-family:var(--idcl-font-mono); font-size:6.5px; letter-spacing:.09em; text-transform:uppercase; color:var(--idcl-card-soft); }
.idcl-pillars{ display:flex; flex-direction:column; align-items:flex-end; gap:1px; }
.idcl-pillars span{ font-family:var(--idcl-font-mono); font-size:7px; letter-spacing:.1em; text-transform:uppercase; color:var(--idcl-card-soft); }
.idcl-pillars i{ width:16px; height:2px; background:var(--idcl-card-ink); margin-top:3px; }
.idcl-photo{ position:relative; width:100%; height:42%; border-radius:10px; background:#eae7de; margin-bottom:14px; flex-shrink:0; }
.idcl-photo img, .idcl-photo svg{ width:100%; height:100%; display:block; border-radius:10px; object-fit:cover; object-position:40% 22%; }
.idcl-verified{ position:absolute; right:-6px; bottom:-6px; width:24px; height:24px; border-radius:50%; background:linear-gradient(160deg,var(--idcl-accent),var(--idcl-accent-dim));
  display:flex; align-items:center; justify-content:center; box-shadow:0 2px 6px rgba(0,0,0,.4),0 0 0 3px var(--idcl-card); }
.idcl-verified svg{ width:12px; height:12px; }
.idcl-name{ margin:0 0 2px; font-family:var(--idcl-font-script); font-weight:700; font-size:32px; line-height:1; }
.idcl-role{ margin:0 0 10px; font-size:10px; color:var(--idcl-card-soft); font-weight:700; letter-spacing:.09em; text-transform:uppercase; }
.idcl-divider{ width:100%; height:1px; background:var(--idcl-card-line); margin-bottom:10px; }
.idcl-idrow{ width:100%; display:flex; justify-content:space-between; align-items:flex-start; gap:10px; }
.idcl-idrow-labels{ display:flex; flex-direction:column; gap:5px; font-family:var(--idcl-font-mono); }
.idcl-idrow-labels div{ display:flex; gap:8px; align-items:baseline; }
.idcl-idrow-labels span{ width:54px; flex-shrink:0; font-size:7.5px; letter-spacing:.06em; text-transform:uppercase; color:var(--idcl-card-soft); }
.idcl-idrow-labels b{ font-size:9.5px; font-weight:600; }
.idcl-footer{ width:100%; margin-top:auto; padding-top:10px; border-top:1px solid var(--idcl-card-line); text-align:center; font-family:var(--idcl-font-mono); font-size:8.5px; letter-spacing:.14em; text-transform:uppercase; color:var(--idcl-card-soft); }
.idcl-footer i{ color:var(--idcl-card-line); font-style:normal; margin:0 5px; }
.idcl-stripe{ width:100%; height:30px; background:repeating-linear-gradient(45deg,#1b1d24,#1b1d24 6px,#26282f 6px,#26282f 12px); border-radius:3px; margin-bottom:12px; }
.idcl-barcode{ display:flex; align-items:flex-end; gap:2px; height:34px; width:100%; background:#fff; border-radius:3px; padding:0 5px; margin-bottom:12px; overflow:hidden; }
.idcl-barcode span{ width:2px; background:#1a1c22; }
.idcl-idnum{ margin:0 0 8px; font-family:var(--idcl-font-mono); font-size:10px; font-weight:600; display:flex; justify-content:space-between; font-variant-numeric:tabular-nums; }
.idcl-idnum em{ font-style:normal; color:var(--idcl-card-soft); }
.idcl-backrow{ display:flex; gap:12px; align-items:flex-start; margin-bottom:10px; }
.idcl-qr{ display:grid; grid-template-columns:repeat(9,1fr); gap:1px; width:64px; height:64px; background:#fff; padding:4px; border-radius:4px; flex-shrink:0; box-shadow:0 0 0 1px var(--idcl-card-line); }
.idcl-qr i.on{ background:#181a20; }
.idcl-qr.idcl-small{ width:46px; height:46px; padding:3px; }
.idcl-scan{ font-family:var(--idcl-font-mono); font-size:8.4px; color:var(--idcl-card-soft); line-height:1.55; padding-top:2px; text-align:left; }
.idcl-scan b{ color:var(--idcl-card-ink); display:block; font-size:9px; margin-bottom:2px; }
.idcl-connect{ display:flex; align-items:center; justify-content:space-between; margin-top:8px; }
.idcl-connect span{ font-family:var(--idcl-font-mono); font-size:8px; letter-spacing:.1em; text-transform:uppercase; color:var(--idcl-card-soft); }
.idcl-connect-icons{ display:flex; gap:6px; }
.idcl-connect-icons a{ width:26px; height:26px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:1px solid var(--idcl-card-line); color:var(--idcl-card-soft); transition:border-color .15s,color .15s,transform .15s; }
.idcl-connect-icons a:hover{ border-color:var(--idcl-accent); color:var(--idcl-accent); transform:translateY(-1px); }
.idcl-connect-icons svg{ width:12px; height:12px; }
.idcl-sig{ margin-top:auto; }
.idcl-sig .idcl-script{ font-family:var(--idcl-font-script); font-size:30px; font-weight:700; line-height:1; }
.idcl-sig small{ display:block; font-family:var(--idcl-font-mono); font-size:8px; letter-spacing:.08em; text-transform:uppercase; color:var(--idcl-card-soft); border-top:1px solid var(--idcl-card-line); margin-top:4px; padding-top:4px; }
.idcl-hint{ position:fixed; top:16px; left:50%; transform:translateX(-50%); display:flex; align-items:center; gap:6px; background:rgba(10,12,16,.72); color:#f3f0e9; padding:7px 14px; border-radius:999px;
  font-family:var(--idcl-font-mono); font-size:11px; pointer-events:none; opacity:1; transition:opacity .4s ease; white-space:nowrap; }
.idcl-root.idcl-contained .idcl-hint{ position:absolute; top:auto; bottom:8px; }
.idcl-hint svg{ width:13px; height:13px; opacity:.75; flex-shrink:0; }
`;

export function IDCardLanyard({
  name = "Maya Chen",
  role = "Creative Developer",
  brand = "MAYA CHEN",
  brandTagline = "Creative Dev Studio",
  pillars = ["Design", "Code", "Ship"],
  location = "Brooklyn, NY",
  idNumber = "MC-042019",
  validThru = "12/2029",
  site = "mayachen.dev/work",
  githubUrl,
  linkedinUrl,
  instagramUrl,
  anchorX = "calc(100% - 130px)",
  anchorY = 6,
  zIndex = 60,
  showHint = true,
  className = "",
  contained = false,
  photoUrl,
  extraRowLabel = "Valid Thru",
  extraRowValue,
  ropeLength = 140,
}: IDCardLanyardProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const flipperRef = useRef<HTMLDivElement>(null);
  const barcodeRef = useRef<HTMLDivElement>(null);
  const qrBackRef = useRef<HTMLDivElement>(null);
  const qrFrontRef = useRef<HTMLDivElement>(null);

  // Fonts (Archivo, JetBrains Mono, Caveat) are self-hosted in app/layout.tsx.

  useEffect(() => {
    const scene = sceneRef.current;
    const canvas = canvasRef.current;
    const rail = railRef.current;
    const card = cardRef.current;
    const flipper = flipperRef.current;
    const barcodeEl = barcodeRef.current;
    const qrBackEl = qrBackRef.current;
    const qrFrontEl = qrFrontRef.current;
    if (!scene || !canvas || !rail || !card || !flipper || !barcodeEl || !qrBackEl || !qrFrontEl) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    barcodeEl.innerHTML = "";
    for (let i = 0; i < 30; i++) {
      const bar = document.createElement("span");
      bar.style.height = ((i * 37) % 100 > 40 ? 100 : 55) + "%";
      barcodeEl.appendChild(bar);
    }

    function buildQR(el: HTMLDivElement, seed: number) {
      el.innerHTML = "";
      const seedOn = new Set([0, 1, 2, 9, 10, 11, 18, 19, 20, 6, 7, 8, 15, 16, 17, 24, 25, 26, 54, 55, 56, 63, 64, 65, 72, 73, 74]);
      for (let i = 0; i < 81; i++) {
        const cell = document.createElement("i");
        if (seedOn.has(i) || (i * seed) % 97 < 46) cell.classList.add("on");
        el.appendChild(cell);
      }
    }
    buildQR(qrBackEl, 928371);
    buildQR(qrFrontEl, 574123);

    function resolveAnchorX() {
      const rect = scene!.getBoundingClientRect();
      const v = anchorX.trim();
      const calcMatch = v.match(/^calc\(\s*100%\s*-\s*([\d.]+)px\s*\)$/);
      if (calcMatch) return rect.width - parseFloat(calcMatch[1]);
      if (v.endsWith("%")) return rect.width * (parseFloat(v) / 100);
      return parseFloat(v);
    }

    const anchor = { x: resolveAnchorX(), y: anchorY };

    function resize() {
      const rect = scene!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = rect.width * dpr;
      canvas!.height = rect.height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      sceneW = rect.width;
      sceneH = rect.height;
      anchor.x = resolveAnchorX();
      rail!.style.left = anchor.x + "px";
      rail!.style.top = anchor.y - 3 + "px";
    }
    let sceneW = 0;
    let sceneH = 0;
    resize();

    const NUM_POINTS = 13;
    const SEGMENT_LENGTH = ropeLength / (NUM_POINTS - 1);
    const GRAVITY = 0.55;
    const FRICTION = 0.98;
    const CONSTRAINT_ITERATIONS = 6;
    const TAP_THRESHOLD = 6;
    const MAX_TILT = 9;

    type Pt = { x: number; y: number; oldx: number; oldy: number; pinned: boolean };
    const points: Pt[] = [];
    for (let i = 0; i < NUM_POINTS; i++) {
      const y = anchor.y + i * SEGMENT_LENGTH;
      // a small initial offset so the card gently swings in on load
      const x = anchor.x + (i / (NUM_POINTS - 1)) * 40;
      points.push({ x, y, oldx: x, oldy: y, pinned: i === 0 });
    }

    let dragging = false;
    let flipped = false;
    let downPos = { x: anchor.x, y: anchor.y };
    let pointer = { x: anchor.x, y: anchor.y + ropeLength };
    let lastPointer = { ...pointer };
    const velocity = { x: 0, y: 0 };
    let flipTarget = 0;
    let flipCurrent = 0;
    const tiltTarget = { x: 0, y: 0 };
    const tiltCurrent = { x: 0, y: 0 };
    let mouse = { x: -9999, y: -9999 };

    function getScenePos(e: PointerEvent) {
      const rect = scene!.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
    function clampToScene(p: { x: number; y: number }) {
      const margin = 18;
      p.x = Math.max(margin, Math.min(sceneW - margin, p.x));
      p.y = Math.max(anchor.y + 20, Math.min(sceneH - 30, p.y));
      return p;
    }
    // idle sway: a soft "breeze" pushing the card side to side on a slow cycle,
    // well below the rope's own swing rate so it drifts instead of bouncing
    const SWAY_FORCE = 0.05;
    const SWAY_PERIOD = 360; // frames (~6s at 60fps)
    const swayOn = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let tick = 0;

    function updatePoints() {
      tick++;
      const w = (tick / SWAY_PERIOD) * Math.PI * 2;
      // a second, slower wave keeps the swing from looking mechanical
      const sway = swayOn && !dragging ? SWAY_FORCE * (Math.sin(w) + 0.35 * Math.sin(w * 0.43 + 1.3)) : 0;
      for (let i = 1; i < points.length; i++) {
        if (dragging && i === points.length - 1) continue;
        const p = points[i];
        const vx = (p.x - p.oldx) * FRICTION;
        const vy = (p.y - p.oldy) * FRICTION;
        p.oldx = p.x;
        p.oldy = p.y;
        p.x += vx + sway * (i / (points.length - 1));
        p.y += vy + GRAVITY;
      }
    }
    function applyConstraints() {
      points[0].x = anchor.x;
      points[0].y = anchor.y;
      if (dragging) {
        const last = points[points.length - 1];
        last.x = pointer.x;
        last.y = pointer.y;
      }
      for (let iter = 0; iter < CONSTRAINT_ITERATIONS; iter++) {
        for (let i = 0; i < points.length - 1; i++) {
          const p1 = points[i];
          const p2 = points[i + 1];
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.0001;
          const diff = (SEGMENT_LENGTH - dist) / dist;
          const offX = dx * diff * 0.5;
          const offY = dy * diff * 0.5;
          const p2Locked = dragging && i + 1 === points.length - 1;
          if (!p1.pinned) {
            p1.x -= offX;
            p1.y -= offY;
          }
          if (!p2Locked) {
            p2.x += offX;
            p2.y += offY;
          }
        }
      }
      for (let i = 1; i < points.length; i++) clampToScene(points[i]);
    }
    function drawRope() {
      ctx!.clearRect(0, 0, sceneW, sceneH);
      const path: { x: number; y: number; cx?: number; cy?: number }[] = [{ x: points[0].x, y: points[0].y }];
      for (let i = 1; i < points.length - 1; i++) {
        path.push({ x: points[i].x, y: points[i].y, cx: (points[i].x + points[i + 1].x) / 2, cy: (points[i].y + points[i + 1].y) / 2 });
      }
      path.push({ x: points[points.length - 1].x, y: points[points.length - 1].y });

      function strokeRibbon(style: string, width: number) {
        ctx!.beginPath();
        ctx!.moveTo(path[0].x, path[0].y);
        for (let i = 1; i < path.length; i++) {
          const p = path[i];
          if (p.cx !== undefined) ctx!.quadraticCurveTo(p.x, p.y, p.cx, p.cy as number);
          else ctx!.lineTo(p.x, p.y);
        }
        ctx!.strokeStyle = style;
        ctx!.lineWidth = width;
        ctx!.lineCap = "round";
        ctx!.lineJoin = "round";
        ctx!.stroke();
      }
      ctx!.save();
      ctx!.translate(2, 4);
      ctx!.globalAlpha = 0.3;
      strokeRibbon("#000000", 16);
      ctx!.restore();
      strokeRibbon("#1c1e23", 16);
      strokeRibbon("rgba(0,0,0,0.35)", 16.5);
      strokeRibbon("#1c1e23", 13.5);
      strokeRibbon("rgba(124,245,196,0.45)", 2); // added: accent thread

      const markIdx = Math.floor(points.length * 0.3);
      const m = points[markIdx];
      const angle = Math.atan2(points[markIdx + 1].y - points[markIdx - 1].y, points[markIdx + 1].x - points[markIdx - 1].x) + Math.PI / 2;
      ctx!.save();
      ctx!.translate(m.x, m.y);
      ctx!.rotate(angle);
      ctx!.strokeStyle = "rgba(255,255,255,0.5)";
      ctx!.lineWidth = 1.3;
      ctx!.beginPath();
      ctx!.moveTo(-4, 3.5);
      ctx!.lineTo(0, -3.5);
      ctx!.lineTo(4, 3.5);
      ctx!.stroke();
      ctx!.restore();
    }
    function drawClip() {
      ctx!.save();
      ctx!.translate(anchor.x, anchor.y - 2);
      const g = ctx!.createLinearGradient(-11, -9, 11, 9);
      g.addColorStop(0, "#e7e9ec");
      g.addColorStop(0.35, "#aeb2b8");
      g.addColorStop(0.65, "#7c8087");
      g.addColorStop(1, "#4d5157");
      ctx!.fillStyle = g;
      ctx!.beginPath();
      ctx!.roundRect(-11, -9, 22, 16, 4);
      ctx!.fill();
      ctx!.fillStyle = "#3a3d42";
      ctx!.beginPath();
      ctx!.arc(0, 0, 2.2, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.restore();
    }
    function positionCard() {
      const last = points[points.length - 1];
      const prev = points[points.length - 2];
      const angle = Math.atan2(last.y - prev.y, last.x - prev.x) - Math.PI / 2;
      card!.style.left = last.x - card!.offsetWidth / 2 + "px";
      card!.style.top = last.y + "px";
      card!.style.transform = `rotate(${angle}rad)`;
    }
    function updateTiltAndSheen() {
      flipCurrent += (flipTarget - flipCurrent) * 0.16;
      const hovering = !dragging && mouse.x > -1000;
      if (hovering) {
        const cx = card!.offsetLeft + card!.offsetWidth / 2;
        const cy = card!.offsetTop + card!.offsetHeight / 2;
        const dx = Math.max(-1, Math.min(1, (mouse.x - cx) / (card!.offsetWidth / 2)));
        const dy = Math.max(-1, Math.min(1, (mouse.y - cy) / (card!.offsetHeight / 2)));
        tiltTarget.y = dx * MAX_TILT;
        tiltTarget.x = -dy * MAX_TILT;
        card!.style.setProperty("--mx", Math.max(0, Math.min(100, ((mouse.x - card!.offsetLeft) / card!.offsetWidth) * 100)) + "%");
        card!.style.setProperty("--my", Math.max(0, Math.min(100, ((mouse.y - card!.offsetTop) / card!.offsetHeight) * 100)) + "%");
        card!.classList.add("idcl-hovering");
      } else {
        tiltTarget.x = 0;
        tiltTarget.y = 0;
        card!.classList.remove("idcl-hovering");
      }
      tiltCurrent.x += (tiltTarget.x - tiltCurrent.x) * 0.12;
      tiltCurrent.y += (tiltTarget.y - tiltCurrent.y) * 0.12;
      flipper!.style.transform = `rotateY(${flipCurrent + tiltCurrent.y}deg) rotateX(${tiltCurrent.x}deg)`;
    }

    let raf = 0;
    function loop() {
      updatePoints();
      applyConstraints();
      drawRope();
      drawClip();
      positionCard();
      updateTiltAndSheen();
      raf = requestAnimationFrame(loop);
    }

    const onCardDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest("a")) return;
      e.preventDefault();
      dragging = true;
      card!.setPointerCapture(e.pointerId);
      const pos = clampToScene(getScenePos(e));
      pointer = pos;
      lastPointer = pos;
      downPos = pos;
    };
    const onWindowMove = (e: PointerEvent) => {
      mouse = getScenePos(e);
      if (!dragging) return;
      const pos = clampToScene({ ...mouse });
      velocity.x = pos.x - lastPointer.x;
      velocity.y = pos.y - lastPointer.y;
      lastPointer = pos;
      pointer = pos;
    };
    const onWindowUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      const pos = getScenePos(e);
      const last = points[points.length - 1];
      if (Math.hypot(pos.x - downPos.x, pos.y - downPos.y) < TAP_THRESHOLD) {
        flipped = !flipped;
        flipTarget = flipped ? 180 : 0;
        last.oldx = last.x;
        last.oldy = last.y;
        return;
      }
      last.oldx = last.x - velocity.x;
      last.oldy = last.y - velocity.y;
    };
    const onPointerOut = (e: PointerEvent) => {
      if (e.relatedTarget === null) mouse = { x: -9999, y: -9999 };
    };
    // keyboard: Enter / Space flips the card (added for accessibility)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        flipped = !flipped;
        flipTarget = flipped ? 180 : 0;
      }
    };

    const ro = new ResizeObserver(() => resize());
    ro.observe(scene);
    card.addEventListener("pointerdown", onCardDown);
    card.addEventListener("keydown", onKey);
    window.addEventListener("pointermove", onWindowMove);
    window.addEventListener("pointerup", onWindowUp);
    document.addEventListener("pointerout", onPointerOut);
    loop();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      card.removeEventListener("pointerdown", onCardDown);
      card.removeEventListener("keydown", onKey);
      window.removeEventListener("pointermove", onWindowMove);
      window.removeEventListener("pointerup", onWindowUp);
      document.removeEventListener("pointerout", onPointerOut);
    };
  }, [anchorX, anchorY, ropeLength]);

  return (
    <div
      className={`idcl-root ${contained ? "idcl-contained" : ""} ${className}`}
      style={{ "--idcl-z": zIndex } as React.CSSProperties}
    >
      <style>{CSS}</style>
      <div className="idcl-stage" ref={sceneRef}>
        <canvas className="idcl-rope" ref={canvasRef} />
        <div className="idcl-rail" ref={railRef} />

        <div className="idcl-card" ref={cardRef} tabIndex={0} role="button" aria-label={`${name} ID card — press to flip`}>
          <div className="idcl-flipper" ref={flipperRef}>
            <div className="idcl-face idcl-front">
              <div className="idcl-hole" />
              <div className="idcl-holo" />
              <div className="idcl-header">
                <div className="idcl-brand">
                  <span className="idcl-brand-mark">▲</span>
                  <div className="idcl-brand-text">
                    <b>{brand}</b>
                    <small>{brandTagline}</small>
                  </div>
                </div>
                <div className="idcl-pillars">
                  {pillars.map((p) => (
                    <span key={p}>{p}</span>
                  ))}
                  <i />
                </div>
              </div>

              <div className="idcl-photo">
                {photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photoUrl} alt={`Portrait of ${name}`} draggable={false} />
                ) : (
                  <svg viewBox="0 0 182 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
                    <rect width="182" height="100" fill="#12151c" />
                    <circle cx="91" cy="62" r="46" fill="#5b8cff" />
                  </svg>
                )}
                <span className="idcl-verified">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12l5 5L20 6" />
                  </svg>
                </span>
              </div>

              <h2 className="idcl-name">{name}</h2>
              <p className="idcl-role">{role}</p>
              <div className="idcl-divider" />
              <div className="idcl-idrow">
                <div className="idcl-idrow-labels">
                  <div><span>ID</span><b>{idNumber}</b></div>
                  <div><span>Location</span><b>{location}</b></div>
                  <div><span>{extraRowLabel}</span><b>{extraRowValue ?? validThru}</b></div>
                </div>
                <div className="idcl-qr idcl-small" ref={qrFrontRef} />
              </div>
              <div className="idcl-footer">
                Build<i>·</i>Ship<i>·</i>Iterate
              </div>
            </div>

            <div className="idcl-face idcl-back">
              <div className="idcl-hole" />
              <div className="idcl-holo" />
              <div className="idcl-stripe" />
              <div className="idcl-idnum">
                <span>NO. {idNumber}</span>
                <em>VALID {validThru}</em>
              </div>
              <div className="idcl-barcode" ref={barcodeRef} />
              <div className="idcl-backrow">
                <div className="idcl-qr" ref={qrBackRef} />
                <div className="idcl-scan">
                  <b>Scan for portfolio</b>
                  {site}
                  <br />
                  Projects, source
                  <br />
                  &amp; case studies.
                </div>
              </div>
              {(githubUrl || linkedinUrl || instagramUrl) && (
                <div className="idcl-connect">
                  <span>Connect</span>
                  <div className="idcl-connect-icons">
                    {githubUrl && (
                      <a href={githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                        </svg>
                      </a>
                    )}
                    {linkedinUrl && (
                      <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                          <rect x="2" y="9" width="4" height="12" />
                          <circle cx="4" cy="4" r="2" />
                        </svg>
                      </a>
                    )}
                    {instagramUrl && (
                      <a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              )}
              <div className="idcl-sig">
                <div className="idcl-script">{name}</div>
                <small>Authorized Signature</small>
              </div>
            </div>
          </div>
        </div>

        {showHint && (
          <div className="idcl-hint">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M12 3v18M7 8l-4 4 4 4M17 8l4 4-4 4" />
            </svg>
            Drag to swing · Click to flip
          </div>
        )}
      </div>
    </div>
  );
}

export default IDCardLanyard;
