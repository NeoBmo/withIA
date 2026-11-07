# Otros agentes y compatibilidad

Instalación fuera de Claude Code y rutas de cada herramienta. Los comandos son para
Git Bash y se lanzan desde tu copia de `withIA`: ver
[Antes de empezar](README.md#antes-de-empezar).

## Compatibilidad

Rutas globales de cada herramienta, consultadas el 2026-11-06: envejecerán rápido.
"No probado" significa que sólo lo hemos leído en su documentación.

| Herramienta | Documento global | Skills | Agentes | MCP | Barreras | Estado | Fuente y fecha |
|---|---|---|---|---|---|---|---|
| Claude Code | `~/.claude/CLAUDE.md`, con `@AGENTS.md` | `~/.claude/skills/<nombre>/SKILL.md` | `~/.claude/agents/`, Markdown | `claude mcp add --scope user` | `~/.claude/settings.json`: permisos y hooks | Ver [Qué está probado](README.md#qué-está-probado) | [memoria](https://code.claude.com/docs/en/memory) · [skills](https://code.claude.com/docs/en/skills) · [agentes](https://code.claude.com/docs/en/sub-agents) · [MCP](https://code.claude.com/docs/en/mcp) · [hooks](https://code.claude.com/docs/en/hooks) · [permisos](https://code.claude.com/docs/en/permissions) · 2026-11-06 |
| OpenCode V2 | `~/.config/opencode/AGENTS.md` | `~/.config/opencode/skills`; también lee `~/.claude/skills` y `~/.agents/skills` | `~/.config/opencode/agents/<nombre>.md`, modo `subagent` | `mcp.servers` en `~/.config/opencode/opencode.json(c)` | `permissions` y plugins; no hay archivo de hooks | No probado | [reglas](https://docs.opencode.ai/docs/rules/) · [config V2](https://opencode.ai/v2/docs/config/) · [migración](https://opencode.ai/v2/docs/migrate-v1/) · [skills](https://opencode.ai/docs/skills/) · [agentes](https://opencode.ai/docs/agents/) · [permisos](https://opencode.ai/docs/permissions/) · 2026-11-06 |
| Codex CLI | `~/.codex/AGENTS.md`, hasta 32 KiB combinados | `~/.agents/skills` | `~/.codex/agents/`, **TOML** | `[mcp_servers.<nombre>]` en `~/.codex/config.toml` | `~/.codex/hooks.json`, `sandbox_mode`, `approval_policy` y `~/.codex/rules/default.rules` | No probado | [AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md) · [skills](https://learn.chatgpt.com/docs/build-skills) · [agentes](https://learn.chatgpt.com/docs/agent-configuration/subagents) · [MCP](https://learn.chatgpt.com/docs/extend/mcp?surface=cli) · [hooks](https://learn.chatgpt.com/docs/hooks) · [permisos](https://learn.chatgpt.com/docs/agent-approvals-security) · 2026-11-06 |
| ChatGPT web / Work | No confirmado | No confirmado | No confirmado | No lee `~/.codex/config.toml` en la web; lo demás, no confirmado | No confirmado | No probado | [MCP](https://learn.chatgpt.com/docs/extend/mcp?surface=cli) · [agentes](https://learn.chatgpt.com/docs/agent-configuration/subagents) · [personalización](https://learn.chatgpt.com/docs/customization/overview) · 2026-11-06 |
| Antigravity | `~/.gemini/AGENTS.md`, hasta 24 KB por archivo | `~/.gemini/config/skills/<carpeta>/` | `~/.gemini/config/agents/<nombre>.md` | `~/.gemini/config/mcp_config.json` | `~/.gemini/config/hooks.json`; permisos en Settings (App) o `~/.gemini/antigravity-cli/settings.json` (CLI) | No probado | [reglas](https://antigravity.google/docs/rules) · [skills](https://antigravity.google/docs/skills) · [agentes](https://antigravity.google/docs/subagents) · [MCP](https://antigravity.google/docs/mcp) · [hooks](https://antigravity.google/docs/hooks) · [permisos](https://antigravity.google/docs/permissions) · 2026-11-06 |
| Cursor | Sin archivo: pegar en User Rules (Customize > Rules) | `~/.cursor/skills` o `~/.agents/skills` | `~/.cursor/agents/` | `~/.cursor/mcp.json` | `~/.cursor/hooks.json`; run modes en Settings > Agents > Approvals & Execution | No probado | [reglas](https://cursor.com/docs/context/rules) · [skills](https://cursor.com/docs/context/skills) · [agentes](https://cursor.com/docs/context/subagents) · [MCP](https://cursor.com/docs/context/mcp) · [hooks](https://cursor.com/docs/agent/hooks) · [permisos](https://cursor.com/docs/reference/permissions) · 2026-11-06 |
| Copilot CLI | `~/.copilot/copilot-instructions.md` | `~/.copilot/skills` o `~/.agents/skills` | `~/.copilot/agents/*.agent.md` | `~/.copilot/mcp-config.json` | `~/.copilot/hooks/`; `--deny-tool` y aprobaciones en `~/.copilot/permissions-config.json` | No probado | [instrucciones](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions) · [skills](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills) · [agentes](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/create-custom-agents-for-cli) · [MCP](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers) · [hooks](https://docs.github.com/en/copilot/reference/hooks-configuration) · [permisos](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools) · 2026-11-06 |
| Gemini CLI | `~/.gemini/GEMINI.md`; `AGENTS.md` con `context.fileName` | `~/.gemini/skills/` o `~/.agents/skills/` | `~/.gemini/agents/*.md` | `mcpServers` en `~/.gemini/settings.json` | Hooks en `settings.json` y `~/.gemini/policies/*.toml` | No probado | [GEMINI.md](https://geminicli.com/docs/cli/gemini-md/) · [skills](https://geminicli.com/docs/cli/skills/) · [agentes](https://geminicli.com/docs/core/subagents/) · [MCP](https://geminicli.com/docs/tools/mcp-server/) · [hooks](https://geminicli.com/docs/hooks/) · [permisos](https://geminicli.com/docs/reference/policy-engine/) · 2026-11-06 |

Avisos por herramienta:

- **OpenCode**: conviven docs de V1 y V2 y se contradicen. Fijamos V2 (versión de
  referencia en [rules.md](opencode/rules.md)), y el código de plugins V1 no corre
  en V2. Ninguna guía
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
así que haz una copia si ya existe. Para actualizar, ve a [Actualizar](#actualizar).

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
4. **Barreras**: traduce [Barreras](README.md#barreras) al mecanismo de la herramienta.
   Los hooks de Claude Code no son portables, y mientras no exista una barrera, la
   regla es sólo una instrucción: no le des más autonomía que la que puedas
   frenar.
5. **MCP y plugins**: son opcionales y pasan antes por
   [vet](../skills/vet/SKILL.md). Un MCP va en la ruta de la columna MCP de
   [Compatibilidad](#compatibilidad). Un plugin no es portable: extrae su skill o
   reescríbelo, respetando su licencia. Las condiciones de cada uno están en
   [tools.md](../tools.md).
6. **Comprobar**: abre una sesión nueva y haz la prueba de conducta de
   [Comprobar](README.md#comprobar).

### Actualizar

Tras `git pull`, desde tu copia de `withIA`:

- **Documento**: repite el `cat` de tu agente.
- **Skills**: copia sin `-n`, porque `cp -n` no pisa nada. Usa la línea de tu agente:

  ```bash
  cp -r skills/* ~/.config/opencode/skills/
  ```

  ```bash
  cp -r skills/* ~/.agents/skills/
  ```

- **Agentes**: no los copies encima, porque en OpenCode y Codex los editaste a mano.
  Mira qué cambió y reaplícalo en tus copias:

  ```bash
  git diff ORIG_HEAD HEAD -- agents/
  ```
