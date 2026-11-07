---
name: discover
description: Prepara un proyecto en una pasada. Detecta stack, tests, planificación, memoria y convenciones, y crea su documento de instrucciones (CLAUDE.md o AGENTS.md, según el agente) para no repetir la configuración global. Usar al llegar a un repo sin documento propio, o cuando digan "discover", "prepara este proyecto", "configura este repo", "onboard this repo", "set up this project".
---

# Descubrir y preparar un proyecto

Objetivo: que el proyecto tenga un documento **corto** que diga sólo lo que le es
propio. Lo general ya está en `AGENTS.md` y `PROFILE.md`: no lo repitas.

Si el proyecto ya tiene documento propio, esta skill no hace falta: dilo y para,
salvo que la persona pida actualizarlo.

## Qué archivo generar

`CLAUDE.md` en Claude Code, `GEMINI.md` en Gemini CLI y `AGENTS.md` en el resto.
Si el repo ya tiene `AGENTS.md` y usas Claude Code, crea un `CLAUDE.md` que lo
importe con `@AGENTS.md` en lugar de duplicarlo.

## 1. Detectar (sólo lectura)

- **Estado real**: actualiza el remoto como indica la sección «Git» de `AGENTS.md`
  y compara con la rama principal (`git status -sb`,
  `git log --oneline HEAD..origin/main`). Mira también `git worktree list` y
  `git stash list`: el trabajo puede estar fuera de la carpeta actual.
- **Runner**: aplica la sección «Puerta de runner» de `AGENTS.md` y anota los
  comandos exactos de test, lint, typecheck, build y dev.
- **Stack**: lenguaje, framework, gestor de paquetes (por el lockfile), base de
  datos y despliegue.
- **Planificación**: sigue la sección «Planificación» de `AGENTS.md`. Anota dónde
  se planifica y no crees otra fuente.
- **Memoria y tareas**: `MEMORY.md`, la memoria del agente para este repo, un
  `tasks.md` y la lista de tareas o misiones que use el proyecto. Anota dónde
  viven y qué hay en curso.
- **Instrucciones existentes**: `.claude/`, `.opencode/`, `.cursorrules` y
  similares.
- **Convenciones de git**: `git log --oneline -20` y `git branch -a`.
- **Trampas**: lo que un recién llegado haría mal. Servicios que levantar antes de
  los tests, variables de `.env.example`, carpetas generadas que no se tocan.

## 2. Proponer

Enseña a la persona el documento propuesto, de unas 60 líneas como máximo y sin
las secciones vacías:

```markdown
# <Proyecto>
<Una línea: qué es.>

## Comandos
- Tests: `...` · Lint: `...` · Typecheck: `...` · Dev: `...`

## Arquitectura
<3-6 líneas: módulos clave y dónde vive qué.>

## Fuente de verdad
<Dónde se planifica y qué documento gana en un conflicto.>

## Memoria y tareas
<Dónde viven.>

## Trampas
- <Algo no obvio que rompe cosas.>
```

Si el proyecto se beneficiaría de una skill o un MCP, sugiérelo mirando tu
catálogo de herramientas. No instales nada.

## 3. Escribir

Con el visto bueno, escribe el archivo. Si ya existía, edítalo conservando lo que
escribió la persona. Lo que hayas descubierto y no se deduzca del repo se guarda
según la sección «Memoria» de `AGENTS.md`. Termina diciendo qué dejaste fuera por
ser general.
