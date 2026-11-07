@AGENTS.md
@PROFILE.md

# Adaptador para Claude Code

## Modelos

| Rol | Quién | Modelo |
|---|---|---|
| Coordinador | sesión principal | Opus, esfuerzo alto |
| Explorar / borrador de plan | agentes nativos `Explore`, `Plan` | los suyos |
| Implementar una tarea delegada | `implementer` | Sonnet; Opus si el riesgo es alto |
| Revisar | `reviewer` | Sonnet; Opus en auth, dinero y migraciones |
| Documentar | `writer` | Sonnet |
| Especialistas | `agency-*` | Sonnet |

El modelo se cambia en cada llamada a un subagente. Pide Opus al lanzar
`reviewer` en auth, dinero o migraciones, y al lanzar `implementer` si el riesgo
es alto: sin eso se quedan en Sonnet. Pide Sonnet al lanzar un `agency-*`: el
original hereda el modelo de la sesión.

## Barreras

Los permisos y hooks de `settings.json` son la barrera real: si bloquean algo, no
los rodees; explica el bloqueo y pregunta.
