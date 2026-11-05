# Adaptador para OpenCode

La misma [doctrina común](../../core/AGENTS.md), pensada para trabajar **sin
coste** con los modelos gratuitos de OpenCode.

OpenCode lee un único `AGENTS.md` global, así que el adaptador se concatena al
núcleo. Las reglas propias están en [`rules.md`](rules.md).

## Instalación

Si ya tienes `~/.config/opencode/AGENTS.md`, **haz una copia antes**, porque este
comando lo sobrescribe. Es para Git Bash, desde la raíz del repo:

```bash
mkdir -p ~/.config/opencode
```

```bash
cat core/AGENTS.md adapters/opencode/rules.md > ~/.config/opencode/AGENTS.md
```

Usa `cat` y no `Get-Content | Set-Content` de PowerShell 5.1, que añade BOM.

Después recarga y comprueba:

```bash
opencode reload
```

```bash
opencode debug agents
```

## Qué cambia respecto a Claude Code

| | Claude Code | OpenCode |
|---|---|---|
| Proceso | `core/AGENTS.md` | `core/AGENTS.md` |
| Coste | De pago | Gratis |
| Garantía de calidad | Un modelo superior coordina | Revisión cruzada entre familias |
| Si se acaba la cuota | Esperar o bajar de modelo | Cadena de respaldo |
| Estado entre sesiones | Memoria del agente | `MEMORY.md` y `tasks.md` en disco |
| Barreras duras | Permisos y hooks | Permisos; los hooks de Claude no se trasladan |

La lista de modelos gratuitos no se publica aquí porque cambia rápido. Compruébala
con la tool `models`.

La combinación de los dos archivos todavía no se ha instalado ni probado en
OpenCode.
