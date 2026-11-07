#!/usr/bin/env node
// PreToolUse (Bash): bloquea `git commit` cuando la rama actual es main/master.
// Regla global: rama por tarea, nunca commits directos a la rama principal.
// Exit 2 = bloquear la llamada y devolver el motivo a Claude.
const { execFileSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const block = (reason) => {
  process.stderr.write(`Bloqueado: ${reason}\n`);
  process.exit(2);
};

// Git Bash escribe /c/Users/...; Node en Windows lo entendería como C:\c\Users\...
const nativePath = (p) => {
  const home = p.replace(/^~(?=\/|$)/, os.homedir());
  return process.platform === "win32" ? home.replace(/^\/([a-zA-Z])(?=\/|$)/, "$1:") : home;
};

let raw = "";
process.stdin.on("data", (d) => (raw += d));
process.stdin.on("end", () => {
  let input;
  try {
    input = JSON.parse(raw);
  } catch {
    process.exit(0); // entrada inesperada: no bloquear por un fallo del propio hook
  }
  const cmd = String(input?.tool_input?.command ?? "");

  // Las cadenas entre comillas se apartan para que `echo 'git commit'` no cuente;
  // se conservan porque una ruta de `cd` o `-C` puede ir entre comillas.
  const strings = [];
  const masked = cmd.replace(/"(?:[^"\\]|\\.)*"|'[^']*'/g, (s) => `\0${strings.push(s.slice(1, -1)) - 1}\0`);
  const unmask = (s) => s.replace(/\0(\d+)\0/g, (_, i) => strings[i]);

  // Las opciones globales de git van entre `git` y el subcomando: -C, -c, --no-pager...
  const commits = masked.matchAll(
    /\bgit(?:\.exe)?((?:\s+(?:-[Cc]\s+\S+|--(?:git-dir|work-tree|namespace|config-env)\s+\S+|-\S+))*)\s+commit(?=$|[\s;&|)])/g
  );

  const sessionDir = input.cwd || process.cwd();
  for (const commit of commits) {
    // Repo destino real: cada `cd` previo y después cada `git -C <ruta>`, sobre la sesión.
    const cds = [...masked.slice(0, commit.index).matchAll(/\bcd\s+([^\s;&|)]+)/g)].map((m) => m[1]);
    const dashC = [...commit[1].matchAll(/\s-C\s+(\S+)/g)].map((m) => m[1]);
    const dir = [...cds, ...dashC].reduce((from, to) => path.resolve(from, nativePath(unmask(to))), sessionDir);

    if (!fs.existsSync(dir)) {
      block(`no se pudo resolver el repo de este commit (${dir}). Lanza el commit desde esa carpeta, en un comando aparte.`);
    }
    let branch = "";
    try {
      branch = execFileSync("git", ["-C", dir, "branch", "--show-current"], { encoding: "utf8" }).trim();
    } catch {
      continue; // no es un repo git: nada que proteger
    }
    // Sin remoto no hay flujo de PR que proteger (p. ej. repos de configuración local).
    let remotes = "";
    try {
      remotes = execFileSync("git", ["-C", dir, "remote"], { encoding: "utf8" }).trim();
    } catch {}
    if ((branch === "main" || branch === "master") && remotes) {
      block(`no se commitea en '${branch}'. Crea una rama de tarea (git switch -c <tipo>/<tarea>) y commitea ahí.`);
    }
  }
  process.exit(0);
});
