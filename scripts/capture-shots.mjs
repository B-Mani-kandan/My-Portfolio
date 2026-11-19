// Usage: node scripts/capture-shots.mjs public/work name=url [name=url...]
// Saves <name>.jpg (1440x900 hero) and <name>-full.jpg (full page, capped at 5200px) per site
// using the locally installed Chrome. Set WAIT=25000 for sites with long preloaders.
// Use the -full image in /public/work and update `shotH` in lib/data.ts.
import { spawn } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const [outDir, ...pairs] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });
const PORT = 9333;
const W = 1440, H = 900, MAXH = 5200;

const proc = spawn(CHROME, [
  "--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${join(tmpdir(), "cdp-shot-profile")}`,
  "--no-first-run", "--disable-features=HttpsUpgrades,HttpsFirstBalancedModeAutoEnable,HttpsFirstModeV2ForEngagedSites", "--ignore-certificate-errors", "--hide-scrollbars", "--ignore-gpu-blocklist", "--enable-webgl", "--use-angle=swiftshader", "about:blank",
], { stdio: "ignore" });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function json(path, method = "GET") {
  for (let i = 0; i < 40; i++) {
    try { const r = await fetch(`http://127.0.0.1:${PORT}${path}`, { method }); return await r.json(); } catch { await sleep(250); }
  }
  throw new Error("chrome not reachable");
}

function client(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let id = 0; const pending = new Map();
  ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.rej(new Error(JSON.stringify(m.error))) : p.res(m.result); } };
  const ready = new Promise((r) => (ws.onopen = r));
  const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
  return { ready, send, close: () => ws.close() };
}

try {
  await json("/json/version");
  for (const pair of pairs) {
    const [name, url] = [pair.slice(0, pair.indexOf("=")), pair.slice(pair.indexOf("=") + 1)];
    const t = await json(`/json/new?about:blank`, "PUT");
    const c = client(t.webSocketDebuggerUrl); await c.ready;
    await c.send("Page.enable");
    await c.send("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: 1, mobile: false });
    await c.send("Page.navigate", { url });
    await sleep(Number(process.env.WAIT || 9000));
    // scroll through the page to trigger lazy content / reveal animations, then back to top
    const { result } = await c.send("Runtime.evaluate", { expression: "Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)", returnByValue: true });
    const full = Math.min(result.value || H, MAXH);
    for (let y = 0; y < full; y += 500) { await c.send("Runtime.evaluate", { expression: `window.scrollTo(0, ${y})` }); await sleep(350); }
    await c.send("Runtime.evaluate", { expression: "window.scrollTo(0,0)" }); await sleep(2500);
    const hero = await c.send("Page.captureScreenshot", { format: "jpeg", quality: 82 });
    writeFileSync(join(outDir, `${name}.jpg`), Buffer.from(hero.data, "base64"));
    const page = await c.send("Page.captureScreenshot", { format: "jpeg", quality: 72, captureBeyondViewport: true, clip: { x: 0, y: 0, width: W, height: full, scale: 1 } });
    writeFileSync(join(outDir, `${name}-full.jpg`), Buffer.from(page.data, "base64"));
    console.log(name, "ok, height", full);
    c.close();
    // keep tab open (closing the last tab exits headless chrome)
  }
} finally { proc.kill(); }
