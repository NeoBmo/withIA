// Barreras de OpenCode V2 que un permiso estático no puede expresar.
// Sin dependencias: Plugin.define es la identidad, así que basta exportar el objeto.
import { execFileSync } from "node:child_process"
import { existsSync } from "node:fs"
import { homedir } from "node:os"
import { resolve } from "node:path"

// Las skills de la app de Claude llegan por ~/.claude/skills/synced y aquí sobran.
const SYNCED_SKILL = /[/\\]\.claude[/\\]skills[/\\]synced[/\\]/

const ARG = `"[^"]*"|'[^']*'|[^\\s;&|)]+`
// Las opciones globales de git van entre `git` y el subcomando: -C, -c, --no-pager...
const COMMIT = new RegExp(
  `\\bgit(?:\\.exe)?((?:\\s+(?:(?:-[Cc]|--(?:git-dir|work-tree|namespace|config-env))\\s+(?:${ARG})|-\\S+))*)\\s+commit(?=$|[\\s;&|)"'\`])`,
  "g",
)
const CD = new RegExp(`\\bcd\\s+(${ARG})`, "g")
const DASH_C = new RegExp(`\\s-C\\s+(${ARG})`, "g")
// Con esto antes del commit, el texto no dice en qué rama o repo acabará.
const UNKNOWN_TARGET =
  /\bgit(?:\.exe)?(?:\s+-[Cc]\s+\S+|\s+-\S+)*\s+(?:switch|checkout)\b|\b(?:pushd|popd)\b|\(\s*cd\b|\bGIT_DIR=|--git-dir\b/

// Git Bash escribe /c/Users/...; en Windows se leería como C:\c\Users\...
const nativePath = (path) => {
  const clean = path.replace(/^["']|["']$/g, "").replace(/^~(?=\/|$)/, homedir())
  return process.platform === "win32" ? clean.replace(/^\/([a-zA-Z])(?=\/|$)/, "$1:") : clean
}

const git = (dir, ...args) => execFileSync("git", ["-C", dir, ...args], { encoding: "utf8" }).trim()

// Devuelve el motivo del bloqueo, o undefined si el comando puede seguir.
function commitBlock(command, cwd) {
  for (const commit of command.matchAll(COMMIT)) {
    const before = command.slice(0, commit.index)
    if (UNKNOWN_TARGET.test(before + commit[0])) {
      return "este comando combina un commit con un cambio de rama o de carpeta. Haz ese cambio primero y lanza el commit en un comando aparte."
    }

    // Repo destino real: cada `cd` previo y después cada `git -C <ruta>`, sobre la sesión.
    const moves = [...before.matchAll(CD), ...commit[1].matchAll(DASH_C)].map((match) => match[1])
    const dir = moves.reduce((from, to) => resolve(from, nativePath(to)), cwd)
    if (!existsSync(dir)) return `no se pudo resolver el repo de este commit (${dir}).`

    let branch, remotes
    try {
      branch = git(dir, "branch", "--show-current")
      remotes = git(dir, "remote")
    } catch {
      continue // no es un repo git: nada que proteger
    }
    if ((branch === "main" || branch === "master") && remotes) {
      return `no se commitea en '${branch}'. Crea una rama de tarea (git switch -c <tipo>/<tarea>) y commitea ahí.`
    }
  }
}

export default {
  id: "guard",
  async setup(ctx) {
    await ctx.skill.transform((skills) => {
      for (const skill of skills.list()) {
        if (SYNCED_SKILL.test(skill.location ?? "")) skills.remove(skill.id)
      }
    })

    // Lanzar aquí cancela el comando y el agente recibe el motivo como error.
    await ctx.shell.hook("create.before", (event) => {
      const reason = commitBlock(event.command, event.cwd)
      if (reason) throw new Error(`Bloqueado: ${reason}`)
    })
  },
}
