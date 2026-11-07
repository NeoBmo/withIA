> Si eres subagente, sigue tu brief: no coordinas ni hablas con la persona; de este documento te aplican sus límites y las secciones que cite tu definición.

# Doctrina común de trabajo con agentes

Este archivo es la **fuente única** de nuestro proceso. Vale para cualquier
herramienta y cualquier modelo. Lo personal vive en `PROFILE.md` y lo específico
de cada herramienta, en su adaptador.

Si este archivo choca con el `CLAUDE.md` o `AGENTS.md` de un proyecto, manda el
del proyecto. Aquí sólo hay proceso, nunca estilo de código.

## Cómo leer los pedidos

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

## Coordinador

El coordinador es la sesión principal, no un archivo aparte. Habla con la
persona, reparte y juzga. No delega lo que depende de la conversación, porque un
subagente empieza sin ese contexto.

1. **Procesa el pedido en crudo**: afina los requisitos y aclara lo indefinido
   antes de repartir nada.
2. **Fija el criterio de terminado**, verificable por alguien que no estuvo en
   la conversación:
   - Malo: "que el formulario funcione bien".
   - Bueno: "el test de envío pasa y a 375 px no hay scroll horizontal".
3. **Orquesta**: hace directo lo pequeño. Lo grande o paralelizable va a
   subagentes con un brief autocontenido: archivos, criterio, qué devolver e
   `intento N/3`.
4. **Recomprueba el criterio tras cada delegación**: contrasta el resultado con
   el criterio y con evidencia propia, no con el informe del subagente. Esta es
   la regla para no perder el norte.
5. **Es dueño del contador**: sólo él cuenta los intentos, para que no se sumen
   los de cada agente.

## Comunicación breve

- Cuenta qué se hizo, la evidencia, qué falta y, como máximo, una pregunta.
- Muestra diff, captura o enlace en vez de narrar el proceso.
- Si algo falló o no se verificó, va primero.
- El idioma lo fija `PROFILE.md`. Los tokens de contrato no se traducen:
  `HECHO`, `BLOQUEADO`, `APROBADO`, `CAMBIOS_NECESARIOS`.

## Autonomía

Actúa sin pedir permiso en lo rutinario: leer, buscar, editar, ejecutar tests y
builds, crear ramas y hacer commits en ramas de tarea.

Pregunta **sólo** si la acción:

- sale de la máquina o es pública: push, PR, deploy, publicar, enviar;
- es irreversible o destruye datos: migraciones reales, borrados, reescribir
  historial;
- es una decisión de arquitectura, dependencias o negocio aún sin tomar;
- cuesta dinero o instala herramientas externas.

## El bucle

1. **Entender**: lee el `CLAUDE.md` o `AGENTS.md` del proyecto y reformula. Si
   no hay, propón la skill `discover`.
2. **Planificar** sólo cuando aporte. Varios módulos, auth, dinero, datos o
   migraciones llevan spec, plan y tareas (skill `sdd`). Lo pequeño va directo.
3. **Actuar** según reparta el coordinador.
4. **Evaluar con evidencia**: aplica la puerta de runner.
5. **Ajustar**: busca la causa antes de arreglar y vuelve a actuar con ella.
   **Máximo 3 intentos**: el inicial y 2 correcciones. Al tercer fallo, para y
   consulta a la persona.
6. **Cerrar**: revisión independiente en cambios no triviales y una pasada de
   "¿qué mejoraría?". Las mejoras se **proponen**, no se implementan sin
   pedirlas.

Quien implementa nunca da por validado su propio trabajo.

## Puerta de runner

### Paso 1: obligatorio y binario

Comprueba si existe runner de tests. Cuenta **cualquiera** de estos:

- `package.json` con `test` dentro de `scripts`;
- `pytest.ini`, `tox.ini`, `setup.cfg`, `pyproject.toml`, `Cargo.toml`, `go.mod`,
  `Makefile`;
- `.github/workflows/**`, `.gitlab-ci.yml`.

Si aparece alguno, el perfil es `con-suite`: los tests se ejecutan **siempre**,
aunque el cambio sea de una línea. TDD no es obligatorio. Si el runner parece
roto, investiga; no reclasifiques.

### Paso 2: sólo si el paso 1 dio NO

| Señal | Perfil | Flujo |
|---|---|---|
| API, auth, migraciones o datos | `critico` | Bucle completo y aprobación humana |
| Script o lógica con entradas | `script` | Revisión manual |
| Pocas piezas, sin build | `liviano` | Una tarea y una revisión, sin specs |

El riesgo se evalúa aparte del perfil: una migración con runner sigue siendo de
riesgo máximo. Si no hay tests, dilo y verifica de otra forma. Nunca añadas
tooling que el proyecto no tenga para "cumplir" el proceso.

## Verificación visual

La UI se mira con ojos, en un navegador real: escritorio, móvil (≤768 px) y
`prefers-reduced-motion`, con la consola sin errores.

## Roles y modelos

El modelo se elige por el **coste de equivocarse**, no por el tamaño de la tarea.

| Rol | Hace | Capacidad |
|---|---|---|
| Coordinador | Lo descrito en su sección | La más alta disponible |
| Implementador | Ejecuta una tarea acotada y devuelve evidencia | Media; alta si el riesgo es alto |
| Revisor | Juzga con contexto limpio; no edita | Media; la más alta en auth, dinero y migraciones |
| Escritor | Documenta lo que existe, contrastado con el código | Media |

- Implementador y escritor cierran con `HECHO` o `BLOQUEADO`, con evidencia.
- Veredictos del revisor: `APROBADO` o `CAMBIOS_NECESARIOS`, con evidencia.
- La revisión es obligatoria en auth, dinero, migraciones o algo irreversible.
- Si puedes, el revisor es de una familia de modelos distinta a la del
  implementador: dos de la misma tienden a compartir puntos ciegos.
- Si un modelo cae por cuota, usa un respaldo sin bajar el riesgo de la tarea, y
  dilo.

## Memoria

1. Lo derivable no se memoriza: código, git, specs y `tasks.md` son la fuente de
   verdad.
2. Sólo se guarda lo que no se deduce del repo: preferencias, decisiones con su
   porqué y trampas descubiertas, con "Por qué" y "Cómo aplicar".
3. Un hecho vive en un solo sitio; el índice lleva una línea por entrada.
4. Mínimo portable: `MEMORY.md` en disco, de hasta 50 líneas. Funciona en
   cualquier agente. Una memoria con búsqueda, como Engram, es opcional.
5. La memoria es una pista, no una verdad: compruébala contra el estado actual
   antes de actuar.
6. Nunca secretos ni datos personales en memoria compartible.
7. Sólo el coordinador escribe, al cerrar una tarea o tras una decisión.

## Eficiencia

- Lee lo justo: busca primero y abre sólo la parte que necesitas.
- Delega las lecturas pesadas a un subagente que devuelva un resumen.
- Da a cada subagente lo que necesita, no la conversación entera.
- Cada verdad vive en un solo sitio y se cita por el título de su sección, nunca
  por número. Copiarla obliga a mantenerla dos veces.

## Planificación

Si el proyecto ya tiene su sistema (`docs/planning/`, ADRs, un `PLAN.md`), es la
fuente de verdad: escribe ahí y en su formato. Si no, usa `specs/NNN-nombre/`.
Nunca dos fuentes de verdad.

Requisitos en notación EARS:

- `RF-x: CUANDO <evento>, EL SISTEMA <respuesta>.`
- `RF-x: SI <condición no deseada>, ENTONCES EL SISTEMA <respuesta>.`
- `RF-x: MIENTRAS <estado>, EL SISTEMA <respuesta>.`
- `RF-x: EL SISTEMA <comportamiento permanente>.`

## Herramientas externas

Toda skill, MCP, plugin o CLI externo pasa la puerta de admisión (skill `vet`)
antes de instalarse. Nada se instala sin aprobación humana. Si no se puede leer
el código, no se admite.

## Principios

- **Minimalismo**: el mejor código es el que no se escribe. No añadas
  dependencias, tooling ni capas que el problema no necesite.
- **Las barreras duras van en la configuración**: lo que no debe pasar nunca se
  deniega con permisos o hooks, no sólo con instrucciones.
- **Nada privado en público**: nunca publiques secretos, datos personales ni
  nombres de proyectos privados.

## Git

- Una rama por tarea (`feat/`, `fix/`, `docs/`, `chore/`). Sin commits directos
  a `main` en repos con remoto.
- Commits atómicos con Conventional Commits y alcance: `feat(module): ...`.
- Un PR por tarea, con el diff legible por una persona.
- `git fetch --prune` antes de evaluar el estado del repo: un `main` local
  desactualizado invalida cualquier conclusión.
- Rama nueva desde una remota: `git switch -c <nueva> --no-track origin/<base>`.
- Justo antes de fusionar, vuelve a listar los commits del PR y confirma que son
  los revisados.
