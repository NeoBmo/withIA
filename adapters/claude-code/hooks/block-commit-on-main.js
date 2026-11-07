#!/usr/bin/env node
// PreToolUse (Bash): bloquea `git commit` cuando la rama de destino es main/master.
// Regla global: rama por tarea, nunca commits directos a la rama principal.
// Lee el texto del comando, también dentro de comillas: mencionar un commit puede
// bloquear de más, y es el lado seguro. La barrera real es la protección de rama
// en el remoto. Exit 2 = bloquear la llamada y devolver el motivo a Claude.
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
  const clean = p.replace(/^["']|["']$/g, "").replace(/^~(?=\/|$)/, os.homedir());
  return process.platform === "win32" ? clean.replace(/^\/([a-zA-Z])(?=\/|$)/, "$1:") : clean;
};

const ARG = `"[^"]*"|'[^']*'|[^\\s;&|)]+`;
// Las opciones globales de git van entre `git` y el subcomando: -C, -c, --no-pager...
const COMMIT = new RegExp(
  `\\bgit(?:\\.exe)?((?:\\s+(?:(?:-[Cc]|--(?:git-dir|work-tree|namespace|config-env))\\s+(?:${ARG})|-\\S+))*)\\s+commit(?=$|[\\s;&|)"'\`])`,
  "g"
);
const CD = new RegExp(`\\bcd\\s+(${ARG})`, "g");
const DASH_C = new RegExp(`\\s-C\\s+(${ARG})`, "g");
// Con esto antes del commit, el texto no dice en qué rama o repo acabará.
const UNKNOWN_TARGET =
  /\bgit(?:\.exe)?(?:\s+-[Cc]\s+\S+|\s+-\S+)*\s+(?:switch|checkout)\b|\b(?:pushd|popd)\b|\(\s*cd\b|\bGIT_DIR=|--git-dir\b/;

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
  const sessionDir = input?.cwd || process.cwd();

  for (const commit of cmd.matchAll(COMMIT)) {
    const before = cmd.slice(0, commit.index);
    if (UNKNOWN_TARGET.test(before + commit[0])) {
      block(
        "este comando combina un commit con switch, checkout, pushd, popd, un cd en subshell o GIT_DIR, " +
          "y no se puede saber en qué rama acabará. Cambia de rama o de carpeta primero y lanza `git commit` en un comando aparte."
      );
    }

    // Repo destino real: cada `cd` previo y después cada `git -C <ruta>`, sobre la sesión.
    const moves = [...before.matchAll(CD), ...commit[1].matchAll(DASH_C)].map((m) => m[1]);
    const dir = moves.reduce((from, to) => path.resolve(from, nativePath(to)), sessionDir);

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
      block(
        `no se commitea en '${branch}'. Crea una rama de tarea (git switch -c <tipo>/<tarea>) y commitea ahí, en otro comando. ` +
          "Si este comando sólo menciona un commit en un texto, quita esa mención o lánzalo desde una rama."
      );
    }
  }
  process.exit(0);
});
