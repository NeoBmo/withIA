#!/usr/bin/env node
// Comprueba contra el catálogo real de OpenCode que cada modelo citado en la
// configuración cuesta 0, está activo y tiene la variante pedida.
// Uso: node check-free-models.mjs [carpeta de configuración]
import { execSync } from "node:child_process"
import { existsSync, readdirSync, readFileSync } from "node:fs"
import { homedir } from "node:os"
import { join } from "node:path"

const root = process.argv[2] ?? join(homedir(), ".config", "opencode")
const agents = join(root, "agents")
const routing = join(root, "docs", "MODEL-ROUTING.md")
const sources = [
  join(root, "opencode.jsonc"),
  ...(existsSync(routing) ? [routing] : []),
  ...(existsSync(agents) ? readdirSync(agents).map((name) => join(agents, name)) : []),
]

// Un catálogo vacío o cortado debe fallar, no pasar en silencio.
const catalog = JSON.parse(execSync("opencode api model.list", { encoding: "utf8", maxBuffer: 1 << 28 }))
const models = new Map(catalog.data.map((model) => [`${model.providerID}/${model.id}`, model]))

const wanted = new Set()
for (const file of sources) {
  for (const [ref] of readFileSync(file, "utf8").matchAll(/(?<![\w./-])opencode\/[a-z0-9][\w.-]*[a-z0-9](?:#\w+)?/g)) {
    wanted.add(ref)
  }
}

const isZero = (value) =>
  typeof value === "object" && value !== null ? Object.values(value).every(isZero) : value === 0

let failures = 0
for (const ref of [...wanted].sort()) {
  const [id, variant] = ref.split("#")
  const model = models.get(id)
  const problems = []
  if (!model) problems.push("no está en el catálogo")
  else {
    if (!model.cost?.length || !model.cost.every(isZero)) problems.push(`coste ${JSON.stringify(model.cost)}`)
    if (model.status !== "active") problems.push(`estado ${model.status}`)
    if (!model.enabled) problems.push("desactivado")
    const variants = model.variants.map((entry) => entry.id ?? entry)
    if (variant && !variants.includes(variant)) problems.push(`sin variante ${variant}`)
  }
  if (problems.length) failures += 1
  console.log(`${problems.length ? "FALLA" : "ok   "} ${ref}${problems.length ? `: ${problems.join(", ")}` : ""}`)
}

console.log(`${wanted.size} modelos revisados, ${failures} con problemas.`)
if (wanted.size === 0) failures = 1
process.exit(failures ? 1 : 0)
