@AGENTS.md

# Adaptador para Claude Code

## Quién soy

<!-- Cambia esto: rol, experiencia, idioma, sistema operativo, terminal y sus
     particularidades (por ejemplo, en Windows `py` en vez de `python`). -->
Desarrollador. Respóndeme en español y explica el porqué de las decisiones
importantes, con un ejemplo concreto.

## Modelos

| Rol | Quién | Modelo |
|---|---|---|
| Coordinador | sesión principal | Opus, esfuerzo alto |
| Explorar / borrador de plan | agentes nativos `Explore`, `Plan` | los suyos |
| Implementar una tarea delegada | `implementer` | Sonnet |
| Revisar | `reviewer` | Sonnet; Opus en auth, dinero y migraciones |
| Documentar | `writer` | Sonnet |
| Especialistas | `agency-*` | Sonnet |

El modelo se puede cambiar en cada llamada a un subagente.

## Skills del flujo

| Momento | Skill |
|---|---|
| Repo nuevo sin `CLAUDE.md` | `discover` |
| Planificar cambios grandes | `sdd` |
| Algo falla al ajustar | `systematic-debugging` |
| Evaluar una herramienta externa | `vet` |

Son skills propias o externas: instala las que uses. Ver
[tools/](https://github.com/NeoBmo/withIA/tree/main/tools).

## Barreras

Los permisos y hooks de `settings.json` son la barrera real. Si bloquean algo,
no los rodees: explica el bloqueo y pregunta.
