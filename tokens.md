# Tokens: qué medimos y qué no

Única página del repo con cifras de consumo. No damos ningún porcentaje de ahorro
global: no tenemos con qué compararlo (ver [Qué no podemos afirmar](#qué-no-podemos-afirmar)).

Tres avisos antes de leer:

- Son 13 días de una sola persona. No generalizan.
- Todo son **proporciones de tokens, no de coste**. No usamos precios.
- El dato incómodo: lo que cargamos nosotros (documento global y lista de skills)
  es sólo un 3.55% aproximado del arranque de una sesión. Recortarlo no es la
  palanca principal. Esa cifra mide nuestra configuración privada de hoy, no este
  paquete, que pesa algo más: ver [Contexto siempre cargado](#contexto-siempre-cargado).

## Método

```bash
node scripts/measure-tokens.js --until 2026-11-06
```

Añade `--json` para la salida estructurada, o `--since YYYY-MM-DD` para otro
inicio. [El script](scripts/measure-tokens.js) no tiene dependencias, necesita
Node.js y sólo lee transcripciones de Claude Code (`~/.claude/projects`). Imprime
agregados: nunca texto, rutas ni nombres de proyecto.

**Periodo:** de 2026-10-24T02:59Z a 2026-11-05T23:21Z, en UTC. `--until` es
exclusivo: corta antes de las 00:00 UTC del día indicado, así que los totales
ya no se mueven aunque sigamos trabajando.

**Qué se puede reproducir:** tú puedes correr el mismo comando sobre tus propias
transcripciones. Estas cifras concretas salen de las nuestras, que no se
publican y sólo existen mientras sigan en disco.

Dos definiciones:

| Término | Fórmula | Qué significa |
|---|---|---|
| Procesados | entrada + salida + creación de caché + lectura de caché | Todo lo que pasó por el modelo, también lo reutilizado |
| Sin caché | entrada + salida + creación de caché | Lo que no salió de la caché |

Tres decisiones del script, comprobadas en los datos:

- Cada bloque de una respuesta se guarda como una entrada aparte, con el mismo
  `message.id` y el mismo usage. Por eso se deduplica por `id`.
- Una sesión puede repartirse en dos archivos, así que se agrupa por `sessionId`.
- Los errores de API (modelo `<synthetic>`, usage a cero) se excluyen.

## Lo que medimos

Volumen del periodo: 26 sesiones, 211 turnos humanos, 2052 llamadas a la API.

| Afirmación | Fórmula | Confianza |
|---|---|---|
| Sumar líneas de las transcripciones infla el consumo 2.70 veces; hay que deduplicar por `message.id` | 5535 líneas con usage / 2052 ids únicos = 2.70; ids repetidos con usage distinto = 0 | Alta, medido |
| En 13 días y 26 sesiones se procesaron 600.91 M de tokens, de los que 19.47 M no salieron de caché | Procesados = 600909191; sin caché = 19468922 | Alta, verificado por otra vía |
| El 97.09% de la entrada que recibe el modelo se lee de caché | 581440269 / (4118 + 17446585 + 581440269) = 97.09% | Alta, medido. Es proporción de tokens, no de coste |
| Una sesión mediana procesa 10.57 M de tokens y 370692 sin caché; el p90 llega a 31.12 M y 1.82 M | Percentil por rango más cercano sobre 26 sesiones, subagentes incluidos | Alta como descripción; n=26 |
| Cada turno humano genera de media 9.7 llamadas a la API | 2052 / 211 = 9.73 | Media: "humano" depende de `turnOrigin` y se asume humano si falta |
| Los subagentes hacen el 10.09% de las llamadas, pero sólo el 1.50% de los tokens procesados y el 6.33% de los no cacheados | 207/2052; 9001193/600909191; 1233139/19468922 | Alta, medido |
| Opus concentra el 99.05% de los tokens procesados; Sonnet y Haiku, el 6.04% de las llamadas | 595187825/600909191; (101 + 23)/2052 | Alta, medido |
| Las 5 compactaciones fueron automáticas y redujeron el contexto de una media de 441624 a 32750 tokens, un 92.6% | 1 − 32750/441624 = 92.58% | Alta, medido; n=5 |
| Una sesión arranca con unos 98000 tokens de contexto | Media de entrada + creación + lectura de caché en la primera llamada de cada sesión = 98174, n=26 | Alta, medido |

Cómo se verificó:

- **Otra vía, coincide exacto.** Sobre este mismo periodo, sumando con `grep` y
  `awk` sobre el texto crudo y sin parser JSON: respuestas 2052, salida 2018219,
  lectura de caché 581440269, creación de caché 17446585, entrada 4118.
- **Registros `cost-state` del cliente, contraste débil.** De 23 sesiones
  comparables, 10 coinciden exacto en salida y lectura de caché a 3 decimales; las
  demás difieren. Son instantáneas parciales, no un total, así que no confirman.
- **Datos sintéticos.** Comprueban que deduplica, excluye `<synthetic>`, separa
  `tool_result`, cuenta subagente y compactación, y respeta `--since`. Tampoco
  filtra texto ni rutas.

## Contexto siempre cargado

Medido a partir de bytes, con `tokens ≈ bytes / 3.5`, un factor que declaramos
para español. Es una aproximación: no es la cuenta del modelo. Los tamaños son
los de hoy, no los de cada sesión.

Nuestra configuración privada, la que corresponde a las sesiones medidas:

| Pieza | Bytes | Tokens aprox. |
|---|---|---|
| `CLAUDE.md` global, que no se publica | 7859 | 2245 |
| Lista de skills globales (13; sólo `discover`, `sdd` y `vet` son propias) | 4337 | 1239 |
| **Total que cargamos nosotros** | **12196** | **3485** |

| Afirmación | Fórmula | Confianza |
|---|---|---|
| En nuestra configuración privada, `CLAUDE.md` global y lista de skills son aprox. el 3.55% del arranque; el 96.45% restante es otra cosa | (7859 + 4337) / 3.5 = 3485; 3485/98174 = 3.55% | Media: tokens aproximados por bytes/3.5 |

La lista puede sobrestimarse un poco: 3 de las skills que hay en disco no aparecen
en la lista de la sesión.

Lo que instala este paquete, con el mismo método y sin ninguna herramienta de
terceros:

| Pieza | Bytes | Tokens aprox. |
|---|---|---|
| `core/AGENTS.md` | 8777 | 2508 |
| `core/PROFILE.md`, plantilla sin rellenar | 1915 | 547 |
| `CLAUDE.md` del adaptador | 888 | 254 |
| Descripciones de las 3 skills | 1223 | 349 |
| Descripciones de los 3 agentes | 952 | 272 |
| **Total** | **13755** | **3930** |

| Afirmación | Fórmula | Confianza |
|---|---|---|
| El paquete equivale a aprox. un 4.00% de nuestro arranque medio | 13755 / 3.5 = 3930; 3930/98174 = 4.00% | Baja: compara bytes del paquete con un arranque medido con otra configuración; ninguna sesión lo ha cargado |
| `core/AGENTS.md` creció un 33% al reescribirlo: el proceso nuevo se paga en cada sesión | 6579 bytes antes, 8777 después; 8777/6579 = 1.33 | Alta, medido en bytes |

## Superpowers: calculado, no observado

Desactivamos este plugin el 2026-11-06 a las 20:34 UTC, por el motivo que
explica [tools.md](tools.md). **Lo que sigue está calculado, no observado:** no
hay ninguna sesión iniciada después del cambio, y falta comprobar en una sesión
nueva que la desactivación surte efecto. Para observarlo:

```bash
node scripts/measure-tokens.js --since 2026-11-07
```

| Afirmación | Fórmula | Confianza |
|---|---|---|
| Desactivarlo quita aprox. un 1.8% del contexto inicial medio (rango 1.6-1.9%) | (3616 + 2588) / 3.5 = 1773; 1773/98174 = 1.81%. Sensibilidad: 6204/4 = 1551, un 1.58%, porque el texto está en inglés; con los bytes medidos en el plugin, 1.67-1.89% | Media: calculado, sin muestra posterior |
| Ocupaba aprox. un tercio del contexto siempre cargado medido | 1773 / (3485 + 1773) = 33.7% | Media: sólo sobre esos tres elementos, no sobre todo el contexto |
| Como cota superior, esos tokens fueron un 0.55% del contexto de entrada medio por llamada principal | (3696 + 16410618 + 573672215)/1845 = 319830; 1773/319830 = 0.55% | Media: cota superior; no consta activo en todas las sesiones y casi todo sería lectura de caché |

Los 3616 y 2588 bytes son los indicados de partida (inyección al inicio y
descripciones). Medidos en el plugin salen 3424 y entre 2308 y 2876, por eso damos
un rango.

## Qué no podemos afirmar

**Por qué no hay un porcentaje de ahorro total.** Haría falta un grupo de control.
Un número frente a "trabajar sin esta metodología" sería un contrafactual
inventado, y lo mismo pasa con "sin caché costaría X".

Tampoco podemos medir:

- **Ahorro observado por desactivar Superpowers:** no hay sesiones posteriores
  al cambio. Hay que volver a medir con `--since 2026-11-07`.
- **Si Superpowers estaba activo en cada una de las 26 sesiones:** las fechas de
  los archivos del plugin no prueban su estado sesión a sesión. Por eso comparar
  periodos no sirve como "antes y después", y además hubo otros cambios.
- **Su efecto en subagentes:** el hook de inicio y la lista de skills en
  subagentes no se distinguen en los datos de usage.
- **De qué se compone el 96.45% restante del arranque** (prompt de sistema,
  esquemas de herramientas, MCP, skills de plugins, `CLAUDE.md` de proyecto):
  usage sólo da el total.
- **El contexto exacto de cada sesión:** `CLAUDE.md` y skills se midieron como
  están hoy, no como estaban entonces.
- **El arranque real con este paquete:** ninguna sesión medida lo cargó.
- **Los bytes exactos que recibe el modelo:** 3616 y 2588 no se reproducen exactos.
- **Llamadas no registradas en transcripciones:** `cost-state` muestra más salida
  que la transcripción en algunas sesiones, lo que apunta a tareas en segundo plano
  o peticiones no guardadas. Causa sin confirmar; los totales pueden quedar algo
  cortos.
- **Lo anterior a lo que hay en disco**, por retención de transcripciones, y el
  consumo en otros clientes o equipos.
- **Coste en dinero:** no se calculó. La cifra de `cost-state` es parcial.
- **Calidad o velocidad del trabajo:** los tokens no miden si el resultado fue
  mejor.
