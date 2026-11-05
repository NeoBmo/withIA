# Adaptador para Claude Code

Convierte la [doctrina común](../../core/AGENTS.md) en una configuración de
Claude Code. Para quien tenga acceso a modelos Claude de pago.

| Archivo | Va en | Qué hace |
|---|---|---|
| [`../../core/AGENTS.md`](../../core/AGENTS.md) | `~/.claude/AGENTS.md` | El proceso común |
| [`CLAUDE.md`](CLAUDE.md) | `~/.claude/CLAUDE.md` | Importa el proceso con `@AGENTS.md` y añade tu perfil y modelos |
| [`settings.json`](settings.json) | `~/.claude/settings.json` | Permisos y hooks |
| [`hooks/`](hooks/) | `~/.claude/hooks/` | Bloqueo de commits en `main` y control de BOM. Necesitan Node.js |

## Instalación

Si ya tienes alguno de estos archivos, **no lo sobrescribas**: combínalo a mano.
Estos comandos son para Git Bash, desde la raíz del repo:

```bash
cp -i core/AGENTS.md ~/.claude/AGENTS.md
```

```bash
cp -i adapters/claude-code/CLAUDE.md ~/.claude/CLAUDE.md
```

```bash
cp -i adapters/claude-code/settings.json ~/.claude/settings.json
```

```bash
mkdir -p ~/.claude/hooks
```

```bash
cp -i adapters/claude-code/hooks/*.js ~/.claude/hooks/
```

Después edita la sección "Quién soy" de `~/.claude/CLAUDE.md`.

## Actualizar

Vuelve a copiar `core/AGENTS.md` con el mismo comando; `-i` pregunta antes de
sobrescribir. Tu perfil en `CLAUDE.md` no se toca, y por eso
el proceso y lo personal van en archivos separados.

Comprobado en Windows 11 con Git Bash: `@AGENTS.md` se importa y `$HOME` se
resuelve en los hooks. En macOS y Linux está sin probar.

Cómo encajan las piezas: [practices/guardrails.md](../../practices/guardrails.md).
