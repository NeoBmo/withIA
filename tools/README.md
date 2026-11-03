# Herramientas que uso

Sólo aparece lo que pasó la [puerta de admisión](../practices/tool-admission.md)
y uso de verdad. Lo descartado o en espera está en [rejected.md](../rejected.md).

Última revisión: 2026-10-28. Los veredictos caducan a los 90 días.

## MCP

| Herramienta | Para qué | Condiciones |
|---|---|---|
| [Engram](https://github.com/Gentleman-Programming/engram) | Memoria entre sesiones: decisiones, bugs, convenciones. Local, SQLite + FTS5 | Versión fijada; sólo el perfil `agent`; sync en la nube desactivado |
| [Playwright MCP](https://github.com/microsoft/playwright-mcp) | Probar UI desde el agente: WebKit/Firefox, reduced-motion, uso desde terminal | `browser_run_code_unsafe` denegado en permisos |

## Skills

| Skill | Fuente | Para qué |
|---|---|---|
| `emil-design-eng`, `animate`, `animation-performance`, `mobile-native`, `review-animations` | [emilkowalski/skills](https://github.com/emilkowalski/skills) | Pulido de UI y animación. Sólo 5 de 15 |
| `industrial-brutalist-ui` | [taste-skill-classics](https://github.com/Leonxlnx/taste-skill-classics) | Un estilo visual con carácter que evita el look "SaaS limpio" genérico. Sólo uno |
| `frontend-design` | Plugin oficial de Anthropic | Dirección estética; la identidad del proyecto manda sobre ella |
| `vet` | Propia | Ejecuta la puerta de admisión y registra el veredicto |
| `discover` | Propia | Prepara un repo nuevo: detecta stack, tests y convenciones y escribe su `CLAUDE.md` |
| `sdd` | Propia | Spec-Driven Development para cambios grandes |
| `systematic-debugging` | Propia | Encontrar la causa antes de proponer un arreglo |
| `grilling` | Propia | Que la IA me cuestione un plan antes de ejecutarlo |

## Agentes

| Agente | Modelo | Para qué |
|---|---|---|
| `implementer` | Sonnet | Implementa una tarea acotada y devuelve evidencia |
| `reviewer` | Sonnet / Opus | Revisión independiente; no puede editar |
| `writer` | Sonnet | Documentación |
| `agency-frontend-developer`, `agency-minimal-change-engineer`, `agency-software-architect`, `agency-backend-architect`, `agency-reality-checker`, `agency-evidence-collector`, `agency-accessibility-auditor` | Sonnet | Especialistas de [agency-agents](https://github.com/msitarzewski/agency-agents) (7 de 299), fijados al commit `b37b5bb` |

## Plugins

| Plugin | Para qué |
|---|---|
| Headroom (Stefan Petrovici) | `/peek`: esquema de un archivo grande (log, JSON, CSV) para leer sólo lo necesario |
| frontend-design | Ver Skills |
