# withIA

Cómo trabajo con IA para programar: el flujo, las reglas y las herramientas que
uso a diario, con el porqué de cada decisión.

> **In English:** how I (a self-taught frontend developer) work with AI coding
> agents — Claude Code as the main tool, OpenCode with free models as the
> secondary one. The content is in Spanish; the config files are copy-paste
> ready. Start with [workflow.md](workflow.md) and [tools/](tools/README.md).

## Quién escribe esto

Luis ([NeoBmo](https://github.com/NeoBmo)). Desarrollador autodidacta, unos cinco
años, fuerte en frontend y aprendiendo backend. Trabajo en Windows 11.

No es una guía definitiva: es lo que me funciona **hoy**, escrito para poder
copiarlo, discutirlo o descartarlo.

## La idea en cinco líneas

1. **La IA ejecuta; yo decido.** Me consulta sólo lo crucial: lo público, lo
   irreversible, la arquitectura y lo que cuesta dinero.
2. **Evidencia antes que confianza.** Nada está terminado sin tests, navegador o
   una revisión independiente que lo demuestre.
3. **El modelo se elige por el coste de equivocarse**, no por el tamaño de la
   tarea.
4. **Las barreras duras van en la configuración**, no en la memoria del modelo.
5. **Toda herramienta externa pasa una puerta de admisión** antes de instalarse.

## Índice

| Documento | Qué encontrarás |
|---|---|
| [workflow.md](workflow.md) | El bucle del coordinador: entender → planificar → actuar → evaluar → ajustar |
| [practices/](practices/) | Prácticas concretas, una por archivo |
| [tools/](tools/README.md) | Lo que uso: MCP, skills, agentes y plugins, con veredicto |
| [rejected.md](rejected.md) | Lo que evalué y descarté o dejé en espera, y por qué |
| [config/](config/) | Mi `CLAUDE.md` global y `settings.json`, listos para adaptar |

### Prácticas

- [Puerta de admisión de herramientas](practices/tool-admission.md)
- [Puerta de runner y criterio de terminado](practices/runner-gate.md)
- [Reparto de modelos por riesgo](practices/model-routing.md)
- [Barreras duras: permisos y hooks](practices/guardrails.md)

## Herramientas principales

- **Claude Code** (app de escritorio y CLI): herramienta principal.
- **OpenCode**: secundaria, sólo con modelos gratuitos.
