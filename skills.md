# Skills, plugins y agentes

Inventario de todo lo que está activo en nuestra configuración, con lo que hace,
de quién viene, cuánto lo usamos y cuánto vale. Separa lo creado por nosotros de lo
que viene de otros. El porqué de admitir o rechazar cada herramienta está en
[tools.md](tools.md); aquí está si de verdad nos sirve.

Una skill es un conjunto de instrucciones que el agente carga cuando las necesita.
Un plugin empaqueta skills, comandos y hooks. Un agente (subagent) es otro Claude con
contexto limpio al que se le delega una tarea.

**Aviso:** son 14 días de una sola persona, una muestra pequeña. Un uso más o
menos cambia una fila. Un 0 significa "no registrado", no "inútil": una skill de
migraciones puede pasar meses sin hacer falta y salvarte el día que la necesitas.

Medido el 2026-11-07: 59 entradas en la lista de skills, más 2 skills manuales que
no ocupan lista y 3 agentes.

## Cómo medimos

| Dato | Cómo sale |
|---|---|
| Usos | Llamadas a la herramienta `Skill`, comandos con barra y lanzamientos de subagente en las transcripciones de Claude Code, contando sólo nombres y sin repetir el id de la llamada |
| Ventana | Del 2026-10-24 al 2026-11-06, ambos incluidos: 14 días naturales y 27 sesiones. Excluye las sesiones que sólo tienen errores de API (`<synthetic>`), como [tokens.md](tokens.md#método), que además corta un día antes |
| Sesiones | Entre paréntesis, en cuántas sesiones distintas apareció |
| Bytes | Lo que ocupa su línea en la lista de skills, que entra en cada sesión. Una skill manual (`disable-model-invocation`) ocupa 0. En los agentes, los bytes de su descripción |

El conteo no ve una skill seguida sin llamarla, ni otros clientes o equipos. Los
agentes lanzados por un workflow pueden quedar fuera.

## Criterio de valor

| Valor | Condición |
|---|---|
| **Alto** | 2 o más usos en 2 o más sesiones, y además evita un fallo real o aporta algo que el modelo no hace solo |
| **Medio** | Se usó, o aporta algo que el modelo no hace solo, pero no ambas cosas |
| **Bajo** | No se usó y lo que hace ya lo cubre el modelo u otra entrada activa |
| **Sin datos** | Entró en la última semana de la ventana o después: no ha tenido ocasión |

El coste en lista desempata: entre dos parecidas, se va la más cara. Lo que evita un
fallo real sale de [Fallos reales](tools.md#fallos-reales).

La acción es una propuesta, no algo ya hecho: **mantener**, **vigilar** (se revisa
en la próxima pasada) o **retirar**.

## Creado por nosotros

Viven en este repo y son [MIT](LICENSE). Son la parte más útil de copiar y también
la menos probada por otras personas.

### Skills

| Skill | Qué hace | Usos | Bytes | Valor | Acción |
|---|---|---|---|---|---|
| [vet](skills/vet/SKILL.md) | Evalúa una herramienta externa antes de instalarla y anota el veredicto | 4 (3) | 379 | Alto | Mantener |
| [sdd](skills/sdd/SKILL.md) | Decide cuánta planificación pide una tarea y escribe spec, plan y tareas | 2 (2) | 433 | Alto | Mantener |
| [discover](skills/discover/SKILL.md) | Prepara un repo nuevo y crea su documento de instrucciones | 0 | 395 | Medio | Vigilar |
| [web-quality-gate](skills/web-quality-gate/SKILL.md) | Comprueba una web antes de publicarla: accesibilidad, rendimiento, SEO, seguridad, cookies y legal | 0 | 328 | Sin datos | Vigilar |
| [hardening-server-writes](skills/hardening-server-writes/SKILL.md) | Protege una escritura de servidor contra carreras, reintentos y clientes que mienten | 0 | 386 | Sin datos | Vigilar |

`web-quality-gate` entró el 2026-11-06 y `hardening-server-writes` el 2026-11-07:
su 0 no dice nada todavía. Las dos cubren casos reales sobre el papel, y
`hardening-server-writes` tiene una prueba propia en
[Prueba de hardening-server-writes](#prueba-de-hardening-server-writes).

### Agentes

| Agente | Qué hace | Usos | Bytes | Valor | Acción |
|---|---|---|---|---|---|
| [reviewer](agents/reviewer.md) | Revisa el cambio con contexto limpio y devuelve aprobado o cambios necesarios | 15 (11) | 326 | Alto | Mantener |
| [implementer](agents/implementer.md) | Ejecuta una tarea acotada y devuelve evidencia | 1 (1) | 339 | Medio | Vigilar |
| [writer](agents/writer.md) | Documenta lo que existe, contrastado con el código | 0 | 245 | Bajo | Vigilar |

### Reglas y plantillas

| Pieza | Qué hace | Dónde se instala | Valor | Acción |
|---|---|---|---|---|
| [rules/frontend.md](rules/frontend.md) | Reglas al construir UI: estados, envío único, foco, HTML nativo y patrones visuales vetados. Sólo se carga al tocar archivos de interfaz | `~/.claude/rules/` | Sin datos | Vigilar |
| [templates/verify/SKILL.md](templates/verify/SKILL.md) | Receta rápida por proyecto: build, ruta clave, consola y 320 px | `.claude/skills/verify/` de cada proyecto, nunca en el nivel personal | Sin datos | Vigilar |

Comprobamos que la regla carga: en una sesión de prueba no aparece tras leer un
`.txt` y sí tras leer un `.tsx`. Eso prueba que carga, no que mejore el resultado.
La plantilla no se ha usado en ningún proyecto. Una skill llamada `verify` se ejecuta
antes de cada commit, según la
[documentación](https://code.claude.com/docs/en/skills), y por eso no va en el
nivel personal.

## De terceros, instalado

Trabajo de otras personas, que enlazamos y no copiamos. La licencia es la que declara
cada fuente. Si dos skills hacen lo mismo, gana la que ya usamos.

**Instalado no significa recomendado.** Recomendamos lo que pasó la puerta, listado en
[Admitidas](tools.md#admitidas). Lo marcado *sin evaluar* no la ha pasado: ver
[Sin evaluar](tools.md#sin-evaluar).

### Skills

| Skill | Qué hace | Autor y licencia | Usos | Bytes | Valor | Acción |
|---|---|---|---|---|---|---|
| [systematic-debugging](https://github.com/obra/superpowers) | Busca la causa antes de proponer un arreglo | Jesse Vincent, MIT | 2 (2) | 115 | Medio | Mantener |
| [animate](https://github.com/emilkowalski/skills) | Decide si animar y cómo, en orden, y escribe la animación | Emil Kowalski, MIT | 1 (1) | 485 | Medio | Mantener |
| [emil-design-eng](https://github.com/emilkowalski/skills) | Criterio de pulido de UI y diseño de componentes | Emil Kowalski, MIT | 1 (1) | 174 | Medio | Mantener |
| [mobile-native](https://github.com/emilkowalski/skills) | Hace que una web se sienta nativa en el móvil | Emil Kowalski, MIT | 1 (1) | 757 | Medio | Mantener |
| [animation-performance](https://github.com/emilkowalski/skills) | Encuentra por qué una animación pierde fotogramas | Emil Kowalski, MIT | 0 | 834 | Medio | Vigilar |
| [review-animations](https://github.com/emilkowalski/skills) | Critica el movimiento existente con un listón alto. Manual | Emil Kowalski, MIT | 0 | 0 | Medio | Mantener |
| [grilling](https://github.com/mattpocock/skills), *sin evaluar* | Te interroga sobre un plan hasta que no queda nada sin decidir | Matt Pocock, MIT | 0 | 164 | Medio | Vigilar |
| [industrial-brutalist-ui](https://github.com/Leonxlnx/taste-skill-classics) | Un estilo visual mecánico, con carácter. Manual | Leonxlnx, MIT | 0 | 0 | Medio | Mantener |
| [web-design-guidelines](https://github.com/vercel-labs/web-interface-guidelines), *sin evaluar* | Revisa UI contra una guía remota que descarga en cada uso, fijada a un commit en nuestra copia | Vercel, licencia sin confirmar | 0 | 209 | Bajo | Retirar |

`web-design-guidelines` es la propuesta más clara: no tiene usos y se solapa con
`web-quality-gate` y con [rules/frontend.md](rules/frontend.md).

### Plugins

| Plugin | Qué hace | Autor y licencia | Usos | Bytes | Valor | Acción |
|---|---|---|---|---|---|---|
| [frontend-design](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/frontend-design) | Da dirección estética a una UI nueva | Anthropic, Apache-2.0 | 2 (1) | 239 | Medio | Mantener |
| [headroom](https://github.com/petrovicistefan/claude-code-plugins/tree/main/headroom): `headroom` | Trabaja con logs, JSON o CSV grandes sin llenar el contexto | Stefan Petrovici, MIT | 0 | 175 | Medio | Vigilar |
| headroom: `peek` | Saca el esquema de un archivo grande para leer sólo lo necesario | Stefan Petrovici, MIT | 0 | 80 | Medio | Vigilar |
| ralph-loop, *sin evaluar*: `ralph-loop` | Repite el mismo prompt en bucle hasta acabar | Anthropic, Apache-2.0 | 0 | 60 | Bajo | Retirar |
| ralph-loop, *sin evaluar*: `cancel-ralph` | Detiene ese bucle | Anthropic, Apache-2.0 | 0 | 51 | Bajo | Retirar |
| ralph-loop, *sin evaluar*: `help` | Explica el plugin | Anthropic, Apache-2.0 | 0 | 67 | Bajo | Retirar |
| engineering, *sin evaluar*: `architecture` | Escribe o evalúa un registro de decisión de arquitectura | Anthropic, licencia sin confirmar | 0 | 310 | Bajo | Vigilar |
| engineering, *sin evaluar*: `code-review` | Revisa cambios por seguridad, rendimiento y corrección | Anthropic, licencia sin confirmar | 0 | 277 | Bajo | Vigilar |
| engineering, *sin evaluar*: `debug` | Sesión guiada para reproducir, aislar y arreglar un fallo | Anthropic, licencia sin confirmar | 0 | 281 | Bajo | Vigilar |
| engineering, *sin evaluar*: `deploy-checklist` | Lista de comprobación antes de desplegar | Anthropic, licencia sin confirmar | 0 | 276 | Bajo | Vigilar |
| engineering, *sin evaluar*: `documentation` | Escribe documentación técnica | Anthropic, licencia sin confirmar | 0 | 299 | Bajo | Vigilar |
| engineering, *sin evaluar*: `incident-response` | Gestiona un incidente y su informe posterior | Anthropic, licencia sin confirmar | 0 | 299 | Bajo | Vigilar |
| engineering, *sin evaluar*: `standup` | Resume la actividad reciente para una reunión diaria | Anthropic, licencia sin confirmar | 0 | 271 | Bajo | Vigilar |
| engineering, *sin evaluar*: `system-design` | Ayuda a diseñar sistemas, APIs y datos | Anthropic, licencia sin confirmar | 0 | 277 | Bajo | Vigilar |
| engineering, *sin evaluar*: `tech-debt` | Identifica y prioriza deuda técnica | Anthropic, licencia sin confirmar | 0 | 259 | Bajo | Vigilar |
| engineering, *sin evaluar*: `testing-strategy` | Diseña estrategias y planes de prueba | Anthropic, licencia sin confirmar | 0 | 268 | Bajo | Vigilar |

Un plugin se apaga entero, así que la decisión de `engineering` es una sola: sus 10
entradas suman 2817 bytes y ninguna se usó. Varias se solapan con `reviewer`,
`writer` o `systematic-debugging`, y `standup` no tiene sentido trabajando solo. Si
en la próxima revisión sigue en 0, se apaga. `ralph-loop` lleva un hook, nunca pasó
por [vet](skills/vet/SKILL.md) y no se ha usado.

## Incluido con el cliente o la cuenta

No las elegimos: vienen con Claude Code o con la cuenta de claude.ai, y son de
Anthropic. No revisamos la licencia de cada una, y no confirmamos que se puedan apagar
una a una. Por eso ninguna lleva acción de retirar, aunque varias sean de las
entradas más caras de la lista.

### Con Claude Code

| Skill | Qué hace | Usos | Bytes | Valor | Acción |
|---|---|---|---|---|---|
| `plugin-authoring` | Crea mods de la interfaz y hooks del propio Claude | 2 (2) | 266 | Alto | Mantener |
| `workflow-authoring` | Referencia para escribir scripts de workflow | 2 (comando) | 252 | Medio | Mantener |
| `update-config` | Configura `settings.json`: permisos, hooks y variables | 1 (1) | 707 | Medio | Mantener |
| `init` | Crea un `CLAUDE.md` básico | 1 (comando) | 67 | Medio | Mantener |
| `security-review` | Revisa la seguridad de los cambios pendientes | 0 | 90 | Medio | Mantener |
| `fewer-permission-prompts` | Propone permisos a partir de las llamadas habituales | 0 | 191 | Medio | Mantener |
| `run` | Arranca y maneja la app para ver un cambio funcionando | 0 | 368 | Medio | Mantener |
| `code-review` | Revisa el diff o un PR buscando errores de corrección | 0 | 998 | Bajo | Vigilar |
| `simplify` | Revisa y aplica limpiezas de calidad | 0 | 190 | Bajo | Vigilar |
| `dataviz` | Guía para crear cualquier gráfico | 0 | 1459 | Bajo | Vigilar |
| `artifact-design` | Guía de diseño para artifacts | 0 | 197 | Bajo | Vigilar |
| `artifact-diagramming` | Guía de diagramas en artifacts | 0 | 205 | Bajo | Vigilar |
| `artifact-capabilities` | Capacidades de ejecución de un artifact | 0 | 738 | Bajo | Vigilar |
| `keybindings-help` | Personaliza atajos de teclado | 0 | 248 | Bajo | Vigilar |
| `loop` | Repite un prompt cada cierto intervalo | 0 | 344 | Bajo | Vigilar |
| `schedule` | Programa agentes en la nube | 0 | 381 | Bajo | Vigilar |
| `claude-api` | Referencia de la API de Claude y sus SDK | 0 | 166 | Bajo | Vigilar |

### Con la cuenta de claude.ai

| Skill | Qué hace | Usos | Bytes | Valor | Acción |
|---|---|---|---|---|---|
| `built-in-browser` | Cómo usar el navegador integrado de la app de escritorio | 1 (1) | 854 | Medio | Mantener |
| `skill-creator` | Crea skills y mide si funcionan | 0 | 353 | Medio | Mantener |
| `deep-research` | Investigación con varias fuentes y un informe | 0 | 604 | Medio | Vigilar |
| `docs` | Crea documentos editables | 0 | 1033 | Bajo | Vigilar |
| `docx` | Crea y edita archivos de Word | 0 | 959 | Bajo | Vigilar |
| `pdf` | Lee, crea y edita PDF | 0 | 461 | Bajo | Vigilar |
| `pptx` | Crea y edita presentaciones de PowerPoint | 0 | 987 | Bajo | Vigilar |
| `xlsx` | Crea y edita hojas de cálculo | 0 | 977 | Bajo | Vigilar |
| `google-workspace` | Crea y edita archivos de Google | 0 | 978 | Bajo | Vigilar |
| `computer-use` | Controla apps del escritorio con capturas y clics | 0 | 967 | Bajo | Vigilar |
| `chrome-browser` | Cómo usar la extensión de Chrome | 0 | 786 | Bajo | Vigilar |
| `artifact-emulator` | Muestra un artifact como lo verá una persona, en la nube | 0 | 724 | Bajo | Vigilar |
| `morning` | Genera un resumen matutino | 0 | 367 | Bajo | Vigilar |
| `import-memory` | Importa memoria de otro asistente | 0 | 175 | Bajo | Vigilar |

Las 14 suman 10225 bytes, casi el 40% de la lista, con un solo uso. Es la parte que
más compensaría recortar, y la que menos controlamos.

## Fuera de la lista

| Qué | Estado | Detalle |
|---|---|---|
| Superpowers | Plugin desactivado | Su `brainstorming` fue, con `vet`, lo más usado (4 usos en 4 sesiones), y `writing-plans` tuvo 1. Lo desactivamos por otro motivo, que explica [tools.md](tools.md). Si echamos en falta esa forma de arrancar, se reconsidera |
| small-business, data, marketing, productivity, design, cowork-plugin-management | Plugins desactivados | 0 usos en la ventana. Ver [Poda de la lista](tokens.md#poda-de-la-lista-de-skills) |
| `grill-me` | Retirada | Sólo llamaba a `grilling` |
| Los 7 `agency-*` | Retirados | 0 usos. Ver [tools.md](tools.md) |
| Playwright MCP | Activo, no es skill | 319 llamadas: es de lo más usado y no aparece arriba. Los MCP están en [tools.md](tools.md) |

## Prueba de hardening-server-writes

**Pregunta:** ¿aparece una prueba concurrente porque existe la skill?

**Resultado:** no. La prueba concurrente apareció en las dos corridas, así que por ese
criterio la skill no ganó. Las diferencias estuvieron en otros puntos.

**Montaje:** una fixture de 5 archivos con un `withdraw` en Node y SQLite, que lee el
saldo, espera a un servicio de fraude y escribe. El prompt no nombra la carrera ni la
skill: "va a producción mañana y mueve dinero real". Una corrida de cada, con Sonnet:
una con la skill instalada y otra con todas las skills apagadas
(`--disable-slash-commands`). Después corrimos una prueba oculta con 20 retiradas
simultáneas y un importe negativo.

| Medida | Con la skill | Sin skills |
|---|---|---|
| La skill se activó sin nombrarla | Sí, por su descripción | No aplica |
| Pasa la prueba oculta, 3 de 3 | Sí | Sí |
| Prueba concurrente propia | Sí | Sí |
| Falla contra el código original | Sí | Sí |
| Concurrencia de esa prueba | 20 a la vez, en 5 rondas | 3 a la vez, una vez |
| Idempotencia | Implementada y probada | Señalada y dejada como decisión |
| Restricciones en la base (`CHECK`, `UNIQUE`) | Sí | No |
| Prueba con dos conexiones | Sí | No, señalada como pendiente |
| Tests al acabar | 15 | 25 |
| Duración | 97 s | 40 s |

Cómo leerlo:

- **Lo que no aporta:** Sonnet, con nuestro `CLAUDE.md` global y el `reviewer`, ya
  encuentra esta carrera y la prueba. La línea base es fuerte.
- **Lo que parece aportar:** cierra más huecos de datos, sobre todo la idempotencia,
  a cambio de más tiempo. No decimos que sea mejor: dejar la idempotencia como
  decisión también es razonable, porque cambia el contrato de la API.
- **Límites:** es una corrida de cada, una fixture pequeña y un prompt que ya habla de
  dinero. El control apaga todas las skills, no sólo ésta. La fixture usa SQLite, así
  que los puntos de RLS y de migración real siguen sin probarse.
- **Un error nuestro:** repetimos la prueba. En el primer intento la skill ya estaba
  instalada de forma global, el control la vio y la activó, así que descartamos ese
  par. En ese par, la corrida con skill la encontró listando archivos, no por su
  descripción.

La evaluación previa pedía dejarla en el proyecto hasta ver el fallo en un segundo
repo, porque los 13 casos vienen de uno solo. Está instalada a nivel personal: si no
se usa en la próxima revisión, se baja a proyecto o se retira.

## Sugerencias

Si usas alguna de estas herramientas de otra forma, o conoces una mejor para un
desarrollador que trabaja solo, cuéntanoslo: ver [CONTRIBUTING.md](CONTRIBUTING.md).
