#!/usr/bin/env node
// Carga una o varias URL con la red limitada y mide qué ve la persona y cuándo.
// Sin dependencias: Node 22+ (WebSocket nativo) y un Chrome o Chromium instalado.
// Uso: node slow-network.mjs <url> [url2 ...] [opciones]   (--help para verlas)
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { homedir, platform, tmpdir } from "node:os";
import { join } from "node:path";
import { parseArgs } from "node:util";

// Perfiles de red de Chrome DevTools: bajada y subida en bits/s, latencia en ms.
const PROFILES = {
  "slow-4g": { down: 1.6e6, up: 750e3, latency: 150 },
  "fast-3g": { down: 1.44e6, up: 675e3, latency: 563 },
  "slow-3g": { down: 400e3, up: 400e3, latency: 2000 },
};

const HELP = `Uso: node slow-network.mjs <url> [url2 ...] [opciones]

Con dos URL o más, las compara en la misma tabla (antes y después).

  --profiles  slow-4g,fast-3g,slow-3g   perfiles de red (por defecto, los tres)
  --size      412x915                   ventana; por debajo de 768 de ancho emula móvil
  --cpu       1                         ralentiza la CPU N veces (4 = móvil de gama media)
  --shots     1,2,3,5,8,12              segundos en que se hace una captura
  --runs      1                         repeticiones; la tabla muestra la mediana
  --timeout   60                        segundos máximos de espera al evento load
  --out       ./slow-network-out        carpeta de capturas y del informe JSON
  --chrome    <ruta>                    ejecutable de Chrome o Chromium (o variable CHROME)
`;

const { values: opt, positionals: urls } = parseArgs({
  allowPositionals: true,
  options: {
    profiles: { type: "string", default: Object.keys(PROFILES).join(",") },
    size: { type: "string", default: "412x915" },
    cpu: { type: "string", default: "1" },
    shots: { type: "string", default: "1,2,3,5,8,12" },
    runs: { type: "string", default: "1" },
    timeout: { type: "string", default: "60" },
    out: { type: "string", default: "slow-network-out" },
    chrome: { type: "string", default: process.env.CHROME },
    help: { type: "boolean", short: "h" },
  },
});

const fail = (msg) => { console.error(`Error: ${msg}`); process.exit(1); };
if (opt.help) { console.log(HELP); process.exit(0); }
if (urls.length === 0) fail(`falta la URL.\n\n${HELP}`);
if (typeof WebSocket === "undefined") fail(`Node ${process.versions.node} no trae WebSocket nativo: usa Node 22 o superior.`);
for (const u of urls) if (!/^https?:\/\//.test(u)) fail(`"${u}" no es una URL http(s).`);

const profiles = opt.profiles.split(",").map((p) => p.trim());
for (const p of profiles) if (!PROFILES[p]) fail(`perfil desconocido "${p}". Usa: ${Object.keys(PROFILES).join(", ")}.`);
const [W, H] = opt.size.split("x").map(Number);
if (!W || !H) fail(`--size debe ser ANCHOxALTO, por ejemplo 412x915.`);
const shots = opt.shots.split(",").map(Number).filter((s) => s > 0).sort((a, b) => a - b);
const runs = Math.max(1, Number(opt.runs) || 1);
const cpu = Math.max(1, Number(opt.cpu) || 1);
const timeoutMs = Math.max(1, Number(opt.timeout) || 60) * 1000;

// Busca Chrome: la opción, la variable, el Chromium que instala Playwright y las rutas habituales.
function findChrome() {
  if (opt.chrome) return existsSync(opt.chrome) ? opt.chrome : fail(`no existe ${opt.chrome}`);
  const home = homedir();
  const os = platform();
  const pw = os === "win32" ? join(process.env.LOCALAPPDATA ?? join(home, "AppData/Local"), "ms-playwright")
    : os === "darwin" ? join(home, "Library/Caches/ms-playwright") : join(home, ".cache/ms-playwright");
  const inPw = {
    win32: ["chrome-win64/chrome.exe", "chrome-win/chrome.exe"],
    darwin: ["chrome-mac-arm64/Chromium.app/Contents/MacOS/Chromium", "chrome-mac/Chromium.app/Contents/MacOS/Chromium"],
    linux: ["chrome-linux64/chrome", "chrome-linux/chrome"],
  }[os] ?? [];
  const candidates = [];
  if (existsSync(pw)) {
    for (const d of readdirSync(pw).filter((d) => /^chromium-\d+$/.test(d)).sort().reverse()) {
      for (const rel of inPw) candidates.push(join(pw, d, rel));
    }
  }
  candidates.push(...{
    win32: [join(process.env.PROGRAMFILES ?? "C:/Program Files", "Google/Chrome/Application/chrome.exe")],
    darwin: ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"],
    linux: ["/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser"],
  }[os] ?? []);
  return candidates.find(existsSync) ?? fail("no encuentro Chrome. Pásalo con --chrome <ruta> o la variable CHROME.");
}

const sleep = (ms) => new Promise((r) => setTimeout(r, Math.max(0, ms)));

// Arranca un Chrome sin cabeza con un perfil limpio (sin extensiones ni caché) y un puerto libre.
async function openBrowser(chrome) {
  const profile = mkdtempSync(join(tmpdir(), "slow-network-"));
  const proc = spawn(chrome, [
    "--headless=new", "--remote-debugging-port=0", `--user-data-dir=${profile}`,
    "--no-first-run", "--no-default-browser-check", "--enable-unsafe-swiftshader", "about:blank",
  ], { stdio: "ignore" });
  // Con el puerto 0, Chrome elige uno libre y lo escribe en DevToolsActivePort.
  const portFile = join(profile, "DevToolsActivePort");
  let ws;
  for (let i = 0; i < 100 && !ws; i++) {
    await sleep(100);
    try {
      const port = readFileSync(portFile, "utf8").split("\n")[0].trim();
      const page = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === "page");
      if (page) ws = new WebSocket(page.webSocketDebuggerUrl);
    } catch {}
  }
  const abort = (msg) => {
    proc.kill();
    try { rmSync(profile, { recursive: true, force: true }); } catch {}
    fail(msg);
  };
  if (!ws) abort("Chrome no abrió su puerto de depuración en 10 s.");
  const opened = await Promise.race([
    new Promise((r) => { ws.addEventListener("open", () => r(true), { once: true }); ws.addEventListener("error", () => r(false), { once: true }); }),
    sleep(10000).then(() => false),
  ]);
  if (!opened) abort("no se pudo conectar con Chrome por WebSocket.");

  let id = 0;
  const pending = new Map();
  ws.addEventListener("message", (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m.error ? { error: m.error } : m.result); pending.delete(m.id); }
  });
  // Cada orden espera como mucho `ms`: una captura antes del primer fotograma no responde nunca.
  // El temporizador se cancela al responder: uno vivo impediría que Node termine.
  const send = (method, params = {}, ms = 10000) => {
    const i = ++id;
    return new Promise((resolve) => {
      const timer = setTimeout(() => { pending.delete(i); resolve(null); }, ms);
      pending.set(i, (v) => { clearTimeout(timer); resolve(v); });
      ws.send(JSON.stringify({ id: i, method, params }));
    });
  };
  const close = async () => {
    for (const r of pending.values()) r(null);
    pending.clear();
    ws.close();
    proc.kill();
    // Windows tarda en soltar los archivos del perfil: reintenta antes de avisar.
    for (let i = 0; i < 5; i++) {
      await sleep(500);
      try { rmSync(profile, { recursive: true, force: true }); return; } catch {}
    }
    console.error(`  no se pudo borrar el perfil temporal ${profile}`);
  };
  return { send, close };
}

// Métricas del Performance API: lo que pasó en la página, no lo que pretende el código.
const METRICS = `(async () => {
  const nav = performance.getEntriesByType("navigation")[0];
  const paint = Object.fromEntries(performance.getEntriesByType("paint").map((e) => [e.name, e.startTime]));
  const lcp = await new Promise((resolve) => {
    let last = null;
    try {
      new PerformanceObserver((list) => { last = list.getEntries().at(-1)?.startTime ?? last; })
        .observe({ type: "largest-contentful-paint", buffered: true });
    } catch {}
    setTimeout(() => resolve(last), 100);
  });
  const res = performance.getEntriesByType("resource").map((e) => ({
    url: e.name, type: e.initiatorType, end: Math.round(e.responseEnd), bytes: e.transferSize,
  }));
  const r = (n) => (n > 0 ? Math.round(n) : null);
  // Sin TTFB: con la red emulada por CDP, responseStart del documento no incluye la latencia simulada.
  return {
    fcp: r(paint["first-contentful-paint"]), lcp: r(lcp),
    domReady: r(nav?.domContentLoadedEventEnd), load: r(nav?.loadEventEnd),
    requests: res.length + 1, bytes: res.reduce((a, x) => a + x.bytes, 0) + (nav?.transferSize ?? 0),
    resources: res.sort((a, b) => a.end - b.end),
  };
})()`;

async function measure(chrome, url, profileName, dir) {
  const p = PROFILES[profileName];
  const { send, close } = await openBrowser(chrome);
  try {
    await send("Network.enable");
    await send("Network.setCacheDisabled", { cacheDisabled: true });
    // CDP espera bytes/s; los perfiles están en bits/s, como en DevTools.
    await send("Network.emulateNetworkConditions", {
      offline: false, latency: p.latency, downloadThroughput: p.down / 8, uploadThroughput: p.up / 8,
    });
    if (cpu > 1) await send("Emulation.setCPUThrottlingRate", { rate: cpu });
    await send("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: 1, mobile: W < 768 });
    await send("Page.enable");

    const start = Date.now();
    send("Page.navigate", { url }, timeoutMs);
    const missed = [];
    for (const s of shots) {
      await sleep(start + s * 1000 - Date.now());
      const shot = await send("Page.captureScreenshot", { format: "png" }, 900);
      if (shot?.data && dir) writeFileSync(join(dir, `t${String(s).padStart(2, "0")}s.png`), Buffer.from(shot.data, "base64"));
      else if (!shot?.data) missed.push(s);
    }
    // Espera al load (con tope) para que las métricas no salgan a medias.
    while (Date.now() - start < timeoutMs) {
      const st = await send("Runtime.evaluate", { expression: "document.readyState", returnByValue: true }, 2000);
      if (st?.result?.value === "complete") break;
      await sleep(250);
    }
    const out = await send("Runtime.evaluate", { expression: METRICS, returnByValue: true, awaitPromise: true }, 5000);
    return { ...(out?.result?.value ?? { error: "no se pudieron leer las métricas" }), noFrameAt: missed };
  } finally {
    await close();
  }
}

const median = (xs) => {
  const v = xs.filter((x) => x != null).sort((a, b) => a - b);
  return v.length ? v[Math.floor((v.length - 1) / 2)] : null;
};
const secs = (ms) => (ms == null ? "—" : `${(ms / 1000).toFixed(1)} s`);

const chrome = findChrome();
console.error(`Chrome: ${chrome}`);
const slug = (u) => u.replace(/^https?:\/\//, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").slice(0, 60);
const report = [];

for (const url of urls) {
  for (const profileName of profiles) {
    const results = [];
    for (let run = 1; run <= runs; run++) {
      // Las capturas se guardan sólo de la primera repetición.
      const dir = run === 1 ? join(opt.out, slug(url), profileName) : null;
      if (dir) mkdirSync(dir, { recursive: true });
      console.error(`${url} · ${profileName} · ${run}/${runs}`);
      const m = await measure(chrome, url, profileName, dir);
      if (m.noFrameAt.length) console.error(`  sin fotograma en ${m.noFrameAt.join(", ")} s (aún no había pintado)`);
      if (m.load == null) console.error(`  no llegó al evento load en ${timeoutMs / 1000} s`);
      results.push(m);
    }
    report.push({ url, profile: profileName, runs: results });
  }
}

mkdirSync(opt.out, { recursive: true });
writeFileSync(join(opt.out, "report.json"), JSON.stringify({
  date: new Date().toISOString(), chrome, size: opt.size, cpu, profiles: PROFILES, report,
}, null, 2));

console.log(`\n| URL | Red | FCP | LCP | DOM listo | Load | Peticiones | KB |`);
console.log(`|---|---|---|---|---|---|---|---|`);
for (const { url, profile, runs: rs } of report) {
  const m = (k) => median(rs.map((r) => r[k]));
  const kb = m("bytes");
  console.log(`| ${url} | ${profile} | ${secs(m("fcp"))} | ${secs(m("lcp"))} | ${secs(m("domReady"))} | ${secs(m("load"))} | ${m("requests") ?? "—"} | ${kb == null ? "—" : Math.round(kb / 1024)} |`);
}
console.log(`\n${runs > 1 ? `Mediana de ${runs} repeticiones. ` : ""}Capturas e informe en ${opt.out}/`);
