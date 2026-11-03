#!/usr/bin/env node
// PreToolUse (Bash): bloquea `git commit` cuando la rama actual es main/master.
// Regla global: rama por tarea, nunca commits directos a la rama principal.
// Exit 2 = bloquear la llamada y devolver el motivo a Claude.
const { execFileSync } = require("child_process");

let raw = "";
process.stdin.on("data", (d) => (raw += d));
process.stdin.on("end", () => {
  let input;
  try {
    input = JSON.parse(raw);
  } catch {
    process.exit(0); // entrada inesperada: no bloquear por un fallo del propio hook
  }
  const cmd = input?.tool_input?.command ?? "";
  const quoted = String.raw`("[^"]+"|'[^']+'|[^\s;&|]+)`;
  const unquote = (s) => s.replace(/^["']|["']$/g, "");
  const match = new RegExp(String.raw`\bgit\s+(?:-C\s+${quoted}\s+)?commit\b`).exec(cmd);
  if (!match) process.exit(0);

  // Repo destino real: `git -C <ruta>`, si no el último `cd <ruta>` previo, si no la sesión.
  const sessionDir = input.cwd || process.cwd();
  let target = match[1] && unquote(match[1]);
  if (!target) {
    const cds = [...cmd.slice(0, match.index).matchAll(new RegExp(String.raw`\bcd\s+${quoted}`, "g"))];
    if (cds.length) target = unquote(cds.at(-1)[1]);
  }
  const dir = target ? require("path").resolve(sessionDir, target) : sessionDir;
  let branch = "";
  try {
    branch = execFileSync("git", ["-C", dir, "branch", "--show-current"], { encoding: "utf8" }).trim();
  } catch {
    process.exit(0); // no es un repo git: nada que proteger
  }
  // Sin remoto no hay flujo de PR que proteger (p. ej. repos de configuración local).
  let remotes = "";
  try {
    remotes = execFileSync("git", ["-C", dir, "remote"], { encoding: "utf8" }).trim();
  } catch {}
  if ((branch === "main" || branch === "master") && remotes) {
    process.stderr.write(
      `Bloqueado: no se commitea en '${branch}'. Crea una rama de tarea (git switch -c <tipo>/<tarea>) y commitea ahí.\n`
    );
    process.exit(2);
  }
  process.exit(0);
});
