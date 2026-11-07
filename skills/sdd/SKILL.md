---
name: sdd
description: Spec-Driven Development para tareas no triviales. Clasifica el perfil con la puerta de runner y, según el perfil, escribe spec, plan y tareas en specs/NNN-nombre/ sólo si el proyecto no tiene su propio sistema de planificación. Usar al empezar una funcionalidad, un cambio de varios módulos, auth, dinero, datos o migraciones, o cuando digan "sdd", "especificación", "spec", "planifica esto", "write a spec", "plan this".
---

# Spec-Driven Development

Esta skill sólo añade qué artefactos se escriben y cómo. El ciclo es la sección
«El bucle» de `AGENTS.md`.

## 1. Clasifica

Aplica la sección «Puerta de runner» de `AGENTS.md` y obtén el perfil. Evalúa el
riesgo aparte: una migración de datos es de riesgo máximo aunque haya runner.

## 2. Decide dónde escribir

Sigue la sección «Planificación» de `AGENTS.md`. Si el proyecto tiene su sistema,
escribe ahí y en su formato; lo que sigue sólo aplica a `specs/NNN-nombre/`.

## 3. Genera según el perfil

| Perfil | Artefactos |
|---|---|
| `con-suite` | `spec.md`, `plan.md` y `tasks.md` |
| `critico` | Los tres, con la verificación manual documentada en `tasks.md` |
| `script` | Un `plan.md` breve |
| `liviano` | Ninguno: basta con la tarea y su verificación |

## 4. Plantillas

Los requisitos siguen la notación EARS de la sección «Planificación» de
`AGENTS.md`, y cada uno debe poder comprobarse. Ejemplo:
`RF-02: SI el archivo supera 5 MB, ENTONCES EL SISTEMA rechazará la subida e indicará el límite.`

`spec.md`:

```markdown
# <Nombre>

## Contexto y límites
<Qué existe hoy y qué queda fuera.>

## Objetivo
<Una o dos líneas.>

## Requisitos
- RF-01: ...

## Criterios de aceptación
- [ ] <Verificable por alguien que no estuvo en la conversación.>
```

`plan.md`:

```markdown
# Plan: <Nombre>

## Decisiones
- <Decisión>. Por qué: <motivo>.

## Archivos afectados
- `ruta`: <qué cambia>

## Riesgos
- <Riesgo y cómo se mitiga.>
```

`tasks.md`:

```markdown
# Tareas: <Nombre>

| Tarea | Requisitos | Estado | Intento | Veredicto y evidencia |
|---|---|---|---|---|
| <Descripción> | RF-01 | pendiente | 0/3 | |
```

## 5. Actualiza `tasks.md`

Lo actualiza **sólo el coordinador**: el contador de intentos es suyo y quien
implementa no da por validado su propio trabajo. El implementador y el revisor
informan; no tocan este archivo.

| Estado | Cuándo pasa |
|---|---|
| `pendiente` | Al crear la tarea |
| `en_progreso` | Al empezarla o delegarla, sumando un intento |
| `implementada` | Con `HECHO`, tras recomprobar el criterio con evidencia propia |
| `validada` | Con `APROBADO` del revisor y evidencia del runner |

En el perfil `critico`, `validada` exige además la verificación manual y la
aprobación de la persona. Con `CAMBIOS_NECESARIOS` o `BLOQUEADO`, la tarea vuelve a
`en_progreso` en un nuevo intento. **Máximo 3 intentos**, como fija «El bucle»: al
tercer fallo, para y consulta a la persona.
