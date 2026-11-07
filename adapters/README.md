# Adaptadores: instalación y portabilidad

Instalas una vez, a nivel de usuario, y abres cualquier proyecto sin configurar
nada. Sólo Claude Code se ha ejecutado, y en parte: ver
[Qué está probado](#qué-está-probado). El resto sale de la documentación oficial
consultada el 2026-11-06 y envejecerá rápido: su estado consta fila a fila en
[Compatibilidad](#compatibilidad).

Nada se instala por defecto de MCP ni plugins: [tools.md](../tools.md) los deja
como opción, y ninguno es necesario para el flujo.

## Antes de empezar

Requisitos: Git y Node.js (lo usan los hooks).

**Si tu terminal es PowerShell 5.1, abre Git Bash**: menú Inicio → escribe
`Git Bash` → Intro. Todos los comandos de esta página son para Git Bash, no para
PowerShell. Pega un bloque cada vez. En Windows, `~` es `%USERPROFILE%`.

No escribas estos archivos con `Get-Content | Set-Content`: PowerShell 5.1 añade
BOM.

Clona el repo, sea cual sea tu agente. Salvo que se indique otra cosa, los comandos
de esta página se lanzan desde esa carpeta:

```bash
git clone https://github.com/NeoBmo/withIA
```

```bash
cd withIA
```

## Claude Code

### Instalar

```bash
mkdir -p ~/.claude/agents ~/.claude/skills ~/.claude/hooks
```

```bash
cp -n core/AGENTS.md core/PROFILE.md adapters/claude-code/CLAUDE.md adapters/claude-code/settings.json ~/.claude/
```

```bash
cp -n agents/*.md ~/.claude/agents/
```

```bash
cp -rn skills/* ~/.claude/skills/
```

```bash
cp -n adapters/claude-code/hooks/*.js ~/.claude/hooks/
```

Después abre `~/.claude/PROFILE.md` y sustituye los ejemplos por los tuyos,
incluida la ruta de tu copia de `withIA`, que es donde `vet` busca el catálogo.

`cp -n` no pisa nada, pero puede omitir archivos sin avisar. Si ya tenías
configuración, añade `@AGENTS.md` y `@PROFILE.md` a tu `CLAUDE.md` y combina
`settings.json` a mano, o pide a tu agente que lo combine y te enseñe el diff.

Por qué un `CLAUDE.md` que importa: Claude Code no documenta un `AGENTS.md`
global de usuario, sólo de proyecto.

### Comprobar

No es opcional, porque `cp -n` pudo saltarse algo. Abre una sesión nueva:

1. Aparecen los agentes `implementer`, `reviewer` y `writer`.
2. Aparecen las skills `discover`, `sdd` y `vet`.
3. `/memory` lista el documento y sus imports.
4. Prueba de conducta: pregunta qué debe consultarte antes de actuar. Debe
   responder con los casos de la sección "Autonomía" de
   [core/AGENTS.md](../core/AGENTS.md).
5. Un commit en `main` de un repo desechable con remoto queda bloqueado.

Para el punto 5, crea ese repo. El remoto es ficticio y nunca se contacta:

```bash
mkdir ~/withia-prueba
```

```bash
cd ~/withia-prueba
```

```bash
git init -b main
```

```bash
git remote add origin https://example.com/prueba.git
```

Abre Claude Code en esa carpeta y pídele `git commit --allow-empty -m prueba`.
Debe responder que no se commitea en `main`. Después borra la carpeta.

### Actualizar

Desde tu copia de `withIA`:

```bash
git pull
```

```bash
cp core/AGENTS.md ~/.claude/
```

```bash
cp agents/*.md ~/.claude/agents/
```

```bash
cp -r skills/* ~/.claude/skills/
```

`PROFILE.md`, `CLAUDE.md` y `settings.json` no se tocan: por eso el documento
madre está partido en proceso y persona. Las copias se desfasan si no repites
estos pasos. Lo aceptamos: un script o enlaces simbólicos añaden piezas y
fricción en Windows.

### Qué está probado

Estado: **parcial**. Este paquete aún no se ha ejecutado en una sesión real de
Claude Code, y tampoco es la configuración que usamos a diario: la nuestra sigue
siendo un único documento privado, sin partir.

| Ejecutado en Windows 11 con Git Bash | Sin probar |
|---|---|
| `@AGENTS.md` se importa y `$HOME` se resuelve en los hooks, con la versión anterior del repo | `@PROFILE.md`, aunque es el mismo mecanismo |
| Los `cp` de [Instalar](#instalar) dejan los 12 archivos en su sitio con un `HOME` vacío, desde una copia local: archivos, no una sesión | `git clone` real, `agents/`, `skills/` y el `CLAUDE.md` del adaptador dentro de una sesión |
| `block-commit-on-main`, lanzado a mano contra repos desechables | El mismo hook dentro de una sesión y las cinco comprobaciones de [Comprobar](#comprobar) |
| | macOS y Linux |

Por eso no prometemos un tiempo de instalación: aún no lo hemos cronometrado.

## Barreras

| Capa | Dónde vive | Para qué |
|---|---|---|
| Instrucción | `CLAUDE.md`, `AGENTS.md` | Criterio y cuándo preguntar. Es contexto: el modelo puede olvidarla |
| Permiso | `settings.json` | Lo aplica la herramienta, en orden `deny` > `ask` > `allow` |
| Hook | `settings.json` y `hooks/` | Script que corre antes o después de una herramienta. Con código 2, bloquea |

En [`settings.json`](claude-code/settings.json):

- **`deny`**: leer `.env`, claves y credenciales; `git push --force`,
  `git reset --hard`, `git clean`, `git branch -D`, `rm -rf` sobre raíz o home; y
  la ejecución arbitraria de JS en Playwright.
- **`ask`**: `git push`, `gh pr create`, `gh pr merge` y `npm publish`. Añade los
  comandos de despliegue y migración de tu stack, también por nombre de script
  (`Bash(npm run deploy*)`): la sección "Autonomía" los exige y aquí no van,
  porque cambian con cada proyecto.
- **`allow`**: lecturas de git y los scripts de tests, lint, tipos y build, para
  no aprobar cada llamada.
- **`defaultMode: auto`**: la autonomía real. Sólo tiene efecto desde los ajustes
  de usuario o gestionados, por eso va en `~/.claude/`. Puede no estar disponible
  en todo plan o versión. Qué ocurre entonces no está probado: comprueba en tu
  primera sesión si te pide confirmar lo rutinario.

Hooks:

- **`block-commit-on-main`** (antes de `git commit`): bloquea commits en `main` o
  `master` si el repo tiene remoto.
- **`check-encoding`** (después de editar): avisa si un archivo queda con BOM o
  bytes NUL, que rompen el diff de git.

Límites que conviene conocer:

- Un hook que expira no bloquea, salvo con `onFailure: block`, y el nuestro deja
  pasar si recibe una entrada inesperada.
- `block-commit-on-main` lee el texto del comando: no ve un commit dentro de un
  script, de `bash -c`, de un alias de git ni con `--git-dir`. Si no puede resolver
  la carpeta de destino, bloquea.
- `allow` decide por el nombre del script, no por lo que hace: si tu `build` o tu
  `test` despliega o migra, pasa sin preguntar.
- `reviewer` conserva Bash para ejecutar tests, así que no editar es una
  instrucción, no una barrera.

## Compatibilidad

Rutas globales de cada herramienta. "Parcial" significa que hemos ejecutado sólo
una parte; "no probado", que sólo lo hemos leído en su documentación.

| Herramienta | Documento global | Skills | Agentes | MCP | Barreras | Estado | Fuente y fecha |
|---|---|---|---|---|---|---|---|
| Claude Code | `~/.claude/CLAUDE.md`, con `@AGENTS.md` | `~/.claude/skills/<nombre>/SKILL.md` | `~/.claude/agents/`, Markdown | `claude mcp add --scope user` | `~/.claude/settings.json`: permisos y hooks | **Parcial**, ver [Qué está probado](#qué-está-probado) | [memoria](https://code.claude.com/docs/en/memory) · [skills](https://code.claude.com/docs/en/skills) · [agentes](https://code.claude.com/docs/en/sub-agents) · [MCP](https://code.claude.com/docs/en/mcp) · [hooks](https://code.claude.com/docs/en/hooks) · [permisos](https://code.claude.com/docs/en/permissions) · 2026-11-06 |
| OpenCode V2 | `~/.config/opencode/AGENTS.md` | `~/.config/opencode/skills`; también lee `~/.claude/skills` y `~/.agents/skills` | `~/.config/opencode/agents/<nombre>.md`, modo `subagent` | `mcp.servers` en `~/.config/opencode/opencode.json(c)` | `permissions` y plugins; no hay archivo de hooks | No probado | [reglas](https://docs.opencode.ai/docs/rules/) · [config V2](https://opencode.ai/v2/docs/config/) · [migración](https://opencode.ai/v2/docs/migrate-v1/) · [skills](https://opencode.ai/docs/skills/) · [agentes](https://opencode.ai/docs/agents/) · [permisos](https://opencode.ai/docs/permissions/) · 2026-11-06 |
| Codex CLI | `~/.codex/AGENTS.md`, hasta 32 KiB combinados | `~/.agents/skills` | `~/.codex/agents/`, **TOML** | `[mcp_servers.<nombre>]` en `~/.codex/config.toml` | `~/.codex/hooks.json`, `sandbox_mode`, `approval_policy` y `~/.codex/rules/default.rules` | No probado | [AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md) · [skills](https://learn.chatgpt.com/docs/build-skills) · [agentes](https://learn.chatgpt.com/docs/agent-configuration/subagents) · [MCP](https://learn.chatgpt.com/docs/extend/mcp?surface=cli) · [hooks](https://learn.chatgpt.com/docs/hooks) · [permisos](https://learn.chatgpt.com/docs/agent-approvals-security) · 2026-11-06 |
| ChatGPT web / Work | No confirmado | No confirmado | No confirmado | No lee `~/.codex/config.toml` en la web; lo demás, no confirmado | No confirmado | No probado | [MCP](https://learn.chatgpt.com/docs/extend/mcp?surface=cli) · [agentes](https://learn.chatgpt.com/docs/agent-configuration/subagents) · [personalización](https://learn.chatgpt.com/docs/customization/overview) · 2026-11-06 |
| Antigravity | `~/.gemini/AGENTS.md`, hasta 24 KB por archivo | `~/.gemini/config/skills/<carpeta>/` | `~/.gemini/config/agents/<nombre>.md` | `~/.gemini/config/mcp_config.json` | `~/.gemini/config/hooks.json`; permisos en Settings (App) o `~/.gemini/antigravity-cli/settings.json` (CLI) | No probado | [reglas](https://antigravity.google/docs/rules) · [skills](https://antigravity.google/docs/skills) · [agentes](https://antigravity.google/docs/subagents) · [MCP](https://antigravity.google/docs/mcp) · [hooks](https://antigravity.google/docs/hooks) · [permisos](https://antigravity.google/docs/permissions) · 2026-11-06 |
| Cursor | Sin archivo: pegar en User Rules (Customize > Rules) | `~/.cursor/skills` o `~/.agents/skills` | `~/.cursor/agents/` | `~/.cursor/mcp.json` | `~/.cursor/hooks.json`; run modes en Settings > Agents > Approvals & Execution | No probado | [reglas](https://cursor.com/docs/context/rules) · [skills](https://cursor.com/docs/context/skills) · [agentes](https://cursor.com/docs/context/subagents) · [MCP](https://cursor.com/docs/context/mcp) · [hooks](https://cursor.com/docs/agent/hooks) · [permisos](https://cursor.com/docs/reference/permissions) · 2026-11-06 |
| Copilot CLI | `~/.copilot/copilot-instructions.md` | `~/.copilot/skills` o `~/.agents/skills` | `~/.copilot/agents/*.agent.md` | `~/.copilot/mcp-config.json` | `~/.copilot/hooks/`; `--deny-tool` y aprobaciones en `~/.copilot/permissions-config.json` | No probado | [instrucciones](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions) · [skills](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills) · [agentes](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/create-custom-agents-for-cli) · [MCP](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers) · [hooks](https://docs.github.com/en/copilot/reference/hooks-configuration) · [permisos](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools) · 2026-11-06 |
| Gemini CLI | `~/.gemini/GEMINI.md`; `AGENTS.md` con `context.fileName` | `~/.gemini/skills/` o `~/.agents/skills/` | `~/.gemini/agents/*.md` | `mcpServers` en `~/.gemini/settings.json` | Hooks en `settings.json` y `~/.gemini/policies/*.toml` | No probado | [GEMINI.md](https://geminicli.com/docs/cli/gemini-md/) · [skills](https://geminicli.com/docs/cli/skills/) · [agentes](https://geminicli.com/docs/core/subagents/) · [MCP](https://geminicli.com/docs/tools/mcp-server/) · [hooks](https://geminicli.com/docs/hooks/) · [permisos](https://geminicli.com/docs/reference/policy-engine/) · 2026-11-06 |

Avisos por herramienta:

- **OpenCode**: conviven docs de V1 y V2 y se contradicen. Fijamos V2, con
  v2.1.4 como referencia, y el código de plugins V1 no corre en V2. Ninguna guía
  etiqueta V2 como estable o beta.
- **Codex y ChatGPT**: el adaptador real de OpenAI es Codex. No prometemos soporte
  en ChatGPT web o Work: ni la lectura de instrucciones ni pegarlas a mano se han
  verificado.
- **Antigravity**: su propia documentación da varias rutas para las skills
  globales. Usa `~/.gemini/config/skills/` y compruébalo.
- **Cursor**: no documenta un `AGENTS.md` global, así que hay que pegar el
  documento en User Rules o copiarlo por proyecto. Reutiliza `~/.claude/agents/`,
  pero no confirmamos cómo trata campos como `tools`.
- **Copilot CLI**: verificado sólo para la CLI. Combina todos los archivos de
  instrucciones sin precedencia general, y un subagente ignora las del repo salvo
  con `include-custom-instructions: true`.
- **Gemini CLI**: tratarlo como heredado. Su documentación avisa de que Antigravity
  CLI lo reemplazó el 18 de junio de 2026 para el plan gratuito y Google One.

## Otros agentes

Nada de esta sección está probado. Prepara primero tu perfil fuera del repo, para
que `git pull` no choque con él:

```bash
cp -n core/PROFILE.md ~/PROFILE.md
```

Edita `~/PROFILE.md`. Los `cat` siguientes usan `>`: **sobrescriben** el destino,
así que haz una copia si ya existe. Repítelos para actualizar.

### OpenCode

Pensado para trabajar sin coste. Las reglas propias están en
[`opencode/rules.md`](opencode/rules.md).

```bash
mkdir -p ~/.config/opencode/skills ~/.config/opencode/agents
```

```bash
cat core/AGENTS.md ~/PROFILE.md adapters/opencode/rules.md > ~/.config/opencode/AGENTS.md
```

```bash
cp -rn skills/* ~/.config/opencode/skills/
```

```bash
cp -n agents/*.md ~/.config/opencode/agents/
```

Los agentes no valen tal cual. En el frontmatter de cada copia en
`~/.config/opencode/agents/`, pon el modo `subagent`, cambia `model: sonnet` por un
modelo gratuito (de otra familia en el revisor) y sustituye `tools` y
`disallowedTools` por permisos de OpenCode. Después recarga y comprueba:

```bash
opencode reload
```

```bash
opencode debug agents
```

Si ya instalaste Claude Code, OpenCode también lee `~/.claude/skills`: en ese caso
la copia de skills sobra.

| | Claude Code | OpenCode |
|---|---|---|
| Coste | De pago | Gratis |
| Garantía de calidad | Un modelo superior coordina | Revisión cruzada entre familias |
| Si se acaba la cuota | Esperar o bajar de modelo | Cadena de respaldo |
| Memoria | Memoria de archivos del agente | `MEMORY.md` en disco |
| Barreras duras | Permisos y hooks | Permisos; los hooks de Claude no se trasladan |

En ambos, Engram es opcional. La lista de modelos gratuitos no se publica aquí
porque cambia rápido: compruébala con la tool `models`.

### Codex: agente en TOML

Codex no usa el Markdown de `agents/`: pide un TOML por agente, con `name`,
`description` y `developer_instructions`. Permisos, sandbox y MCP se heredan de
la sesión padre, así que `tools` y `disallowedTools` no se trasladan. Ejemplo para
`~/.codex/agents/reviewer.toml`, con el cuerpo de
[agents/reviewer.md](../agents/reviewer.md) dentro de `developer_instructions`:

```toml
name = "reviewer"
description = "Revisa un cambio con contexto limpio. Úsalo al cerrar una tarea no trivial."
developer_instructions = """
Eres el revisor: juzgas un cambio sin haberlo escrito.
No editas archivos. Cierras con APROBADO o CAMBIOS_NECESARIOS, con evidencia.
"""
```

### Cualquier otro agente

1. **Documento**: busca su archivo global en la tabla de
   [Compatibilidad](#compatibilidad) o en su documentación, y concatena proceso y
   perfil. Ejemplo con Codex:

   ```bash
   mkdir -p ~/.codex
   ```

   ```bash
   cat core/AGENTS.md ~/PROFILE.md > ~/.codex/AGENTS.md
   ```

   Si no tiene archivo global, pega ese texto en su ajuste de instrucciones o
   cópialo por proyecto.
2. **Skills**: copia `skills/` a su ruta. `SKILL.md` sigue el estándar abierto
   [Agent Skills](https://agentskills.io), y sólo estos campos son portables:
   `name`, `description`, `license`, `compatibility`, `metadata` y
   `allowed-tools`. Ejemplo con Codex:

   ```bash
   mkdir -p ~/.agents/skills
   ```

   ```bash
   cp -rn skills/* ~/.agents/skills/
   ```

3. **Agentes**: convierte sólo si hace falta. Varios aceptan Markdown con
   frontmatter; Copilot pide `.agent.md` y Codex, TOML.
4. **Barreras**: traduce [Barreras](#barreras) al mecanismo de la herramienta.
   Los hooks de Claude Code no son portables, y mientras no exista una barrera, la
   regla es sólo una instrucción: no le des más autonomía que la que puedas
   frenar.
5. **Comprobar**: abre una sesión nueva y haz la prueba de conducta de
   [Comprobar](#comprobar).
