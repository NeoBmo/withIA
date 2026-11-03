# Lo que evalué y no uso (todavía)

Una lista de herramientas sólo dice qué añadir. Esta dice qué **no** añadir y por
qué, que es donde está el criterio.

## Rechazado

| Herramienta | Motivo |
|---|---|
| [TokenRouter](https://www.tokenrouter.com/) | Gateway de pago: los prompts pasan por un tercero y no encontré términos ni política de privacidad |
| [Claude-Mem](https://github.com/thedotmack/claude-mem) | Se solapa con Engram. Además necesita un worker persistente, usa un observador de pago tras 30 días e incluye telemetría (`posthog-node`) |

## Diferido

| Herramienta | Por qué espera | Qué lo desbloquearía |
|---|---|---|
| [Headroom (headroomlabs)](https://github.com/headroomlabs-ai/headroom) | Intercepta prompts y respuestas, telemetría activa por defecto y puede reescribir `AGENTS.md` | Un piloto en un proyecto, con telemetría desactivada |
| [Graphify](https://github.com/Graphify-Labs/graphify) | El análisis semántico necesita API keys de pago | Un repo grande donde grep y Explore se queden cortos; sólo modo offline |
| [Addy Osmani agent-skills](https://github.com/addyosmani/agent-skills) | 25 skills con mucho contexto que pueden contradecir mi proceso | Elegir 2 o 3 por proyecto tras revisar conflictos |
| Task Observer | Escribe sus propias observaciones; aún tengo pocas skills | Que crezca la biblioteca de skills |
| Firecrawl (conector) | Cada URL sale a un tercero y no puedo leer el código del servidor | Sólo cuando `WebFetch` falle, nunca con URLs privadas |

## Admitido sólo como principio

| Herramienta | Qué me quedé |
|---|---|
| [Ponytail](https://github.com/dietrichgebert/ponytail) | La idea, escrita en mis reglas. El plugin inyecta reglas en cada turno y gasta tokens |

## Pendiente de evaluar

| Herramienta | Qué hace | Dudas antes de admitirla |
|---|---|---|
| [context-mode](https://github.com/mksglu/context-mode) | Guarda la salida de las herramientas en SQLite con búsqueda FTS5 para que no llene el contexto. Local, sin telemetría, compatible con Claude Code y OpenCode | ¿Choca con Engram (memoria) y Headroom (lectura de archivos grandes)? Sus hooks interceptan las mismas llamadas |
