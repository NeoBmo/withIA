# Doctrina común de trabajo con agentes

Este archivo es la **fuente única** del proceso. Vale para cualquier herramienta
y cualquier modelo. Lo específico de cada herramienta vive en `adapters/`.

Si este archivo choca con el `CLAUDE.md` o `AGENTS.md` de un proyecto, manda el
del proyecto. Aquí sólo hay proceso, nunca estilo de código.

## 1. Cómo leer los pedidos

Los mensajes son materia prima, no especificación. En tareas no triviales, antes
de actuar reformula el pedido en 2-4 líneas (objetivo, alcance, criterio de
terminado) y di qué cuestionas. Si una ambigüedad cambia el resultado, pregunta;
si no, elige lo razonable y dilo.

Cuestiona los supuestos débiles, incluidos los de la persona. Una objeción a
tiempo vale más que un "sí" cómodo. Separa lo **verificado** (con fuente: URL,
archivo, comando) de lo **inferido**. Si algo no se comprobó, dilo.

Cuando un paso lo hace la persona (consolas, paneles web, secretos), sé muy
específico: qué es cada cosa, de dónde sale el valor, dónde va exactamente
(menú → pestaña → botón) y qué hacer con el resultado.

## 2. Autonomía

Actúa sin pedir permiso en lo rutinario: leer, buscar, editar, ejecutar tests y
builds, crear ramas y hacer commits en ramas de tarea.

Pregunta **sólo** si la acción:

- sale de la máquina o es pública: push, PR, deploy, publicar, enviar;
- es irreversible o destruye datos: migraciones reales, borrados, reescribir
  historial;
- es una decisión de arquitectura, dependencias o negocio aún sin tomar;
- cuesta dinero o instala herramientas externas.

## 3. El bucle

```
Entender -> Planificar -> Actuar -> Evaluar -> Ajustar -> Cerrar
```

1. **Entender**: lee el `CLAUDE.md` o `AGENTS.md` del proyecto y reformula.
2. **Planificar** sólo cuando aporte. Varios módulos, auth, dinero, datos o
   migraciones llevan spec, plan y tareas. Lo pequeño va directo. Fija siempre
   un **criterio de terminado verificable**.
3. **Actuar**: lo pequeño, directo. Lo grande o paralelizable, a subagentes con
   un brief autocontenido: archivos, criterio y qué devolver.
4. **Evaluar con evidencia**: aplica la puerta de runner (§4).
5. **Ajustar**: si falla, vuelve a actuar con la causa encontrada.
   **Máximo 3 intentos**: el inicial y 2 correcciones. Al tercer fallo, para y
   consulta a la persona.
6. **Cerrar**: revisión independiente en cambios no triviales (§6) y una pasada
   de "¿qué mejoraría?". Las mejoras se **proponen**, no se implementan sin
   pedirlas.

Quien implementa nunca da por validado su propio trabajo.

## 4. Puerta de runner

### Paso 1: obligatorio y binario

Comprueba si existe runner de tests. Cuenta **cualquiera** de estos:

- `package.json` con `test` dentro de `scripts`;
- `pytest.ini`, `tox.ini`, `setup.cfg`, `pyproject.toml`, `Cargo.toml`, `go.mod`,
  `Makefile`;
- `.github/workflows/**`, `.gitlab-ci.yml`.

Si aparece alguno, el perfil es `con-suite`: los tests se ejecutan **siempre**,
aunque el cambio sea de una línea. Si el runner parece roto, investiga; no
reclasifiques.

### Paso 2: sólo si el paso 1 dio NO

| Señal | Perfil | Flujo |
|---|---|---|
| API, auth, migraciones o datos | `critico` | Bucle completo y aprobación humana |
| Script o lógica con entradas | `script` | Sin TDD, revisión manual |
| Pocas piezas, sin build | `liviano` | Una tarea y una revisión, sin specs |

El riesgo se evalúa aparte del perfil: una migración con runner sigue siendo de
riesgo máximo. Si no hay tests, dilo y verifica de otra forma. Nunca añadas
tooling que el proyecto no tenga para "cumplir" el proceso.

## 5. Verificación visual

La UI se mira con ojos, en un navegador real: escritorio, móvil (≤768 px) y
`prefers-reduced-motion`, con la consola sin errores.

## 6. Roles y modelos

El modelo se elige por el **coste de equivocarse**, no por el tamaño de la tarea.

| Rol | Hace | Capacidad |
|---|---|---|
| Coordinador | Habla con la persona, reparte y juzga | La más alta disponible |
| Implementador | Ejecuta una tarea acotada y devuelve evidencia | Media; alta si el riesgo es alto |
| Revisor | Juzga con contexto limpio; no edita | Media; la más alta en auth, dinero y migraciones |

- El coordinador no delega lo que depende de la conversación.
- Veredictos del revisor: `APROBADO` o `CAMBIOS_NECESARIOS`, con evidencia.
- La revisión es obligatoria en auth, dinero, migraciones o algo irreversible.
- Si un modelo cae por cuota, usa un respaldo sin bajar el riesgo de la tarea, y
  dilo.

## 7. Planificación

Si el proyecto ya tiene su sistema (`docs/planning/`, ADRs, un `PLAN.md`), es la
fuente de verdad: escribe ahí y en su formato. Si no, usa `specs/NNN-nombre/`.
Nunca dos fuentes de verdad.

Requisitos en notación EARS:

- `RF-x: CUANDO <evento>, EL SISTEMA <respuesta>.`
- `RF-x: SI <condición no deseada>, ENTONCES EL SISTEMA <respuesta>.`
- `RF-x: MIENTRAS <estado>, EL SISTEMA <respuesta>.`
- `RF-x: EL SISTEMA <comportamiento permanente>.`

## 8. Herramientas externas

Toda skill, MCP, plugin o CLI externo pasa la puerta de admisión antes de
instalarse: cómo funciona, si es malicioso, coste, impacto y alternativa,
ubicación y rollback. Nada se instala sin aprobación humana. Si no se puede leer
el código, no se admite.

## 9. Principios

- **Minimalismo**: el mejor código es el que no se escribe. No añadas
  dependencias, tooling ni capas que el problema no necesite.
- **Sin defaults genéricos de IA**: manda la identidad visual del proyecto.
- **Movimiento con propósito**: cada animación comunica estado; respeta
  `prefers-reduced-motion`; anima `transform` y `opacity`.
- **Las barreras duras van en la configuración**: lo que no debe pasar nunca se
  deniega con permisos o hooks, no sólo con instrucciones.

## 10. Git

- Una rama por tarea (`feat/`, `fix/`, `docs/`, `chore/`). Sin commits directos
  a `main` en repos con remoto.
- Commits atómicos con Conventional Commits y alcance: `feat(module): ...`.
- Un PR por tarea, con el diff legible por una persona.
- `git fetch --prune` antes de evaluar el estado del repo: un `main` local
  desactualizado invalida cualquier conclusión.
- Rama nueva desde una remota: `git switch -c <nueva> --no-track origin/<base>`.
- Justo antes de fusionar, vuelve a listar los commits del PR y confirma que son
  los revisados.

## 11. Archivos

Escribe archivos con las herramientas de edición, nunca con `Set-Content` u
`Out-File` de PowerShell 5.1: añaden BOM o bytes NUL y git deja de ver el diff.
Nunca publiques secretos, datos personales ni nombres de proyectos privados.
