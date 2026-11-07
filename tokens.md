# Tokens: qué medimos y qué no

Única página del repo con cifras de consumo. No damos ningún porcentaje de ahorro
global: no tenemos con qué compararlo (ver [Qué no podemos afirmar](#qué-no-podemos-afirmar)).

Tres avisos antes de leer:

- Son 13 días de una sola persona. No generalizan.
- Todo son **proporciones de tokens, no de coste**. No usamos precios.
- El dato incómodo: el documento global y la lista completa de skills, plugins
  incluidos, son aprox. un 11% del arranque de una sesión. Recortar el documento
  (2.3%) no es la palanca principal; la lista pesa casi cuatro veces más, pero tiene
  un tope y quitar un plugin no la encoge. El 89% restante no lo hemos identificado.
  Mide nuestra configuración privada, no este paquete: ver
  [Contexto siempre cargado](#contexto-siempre-cargado).

## Método

```bash
node scripts/measure-tokens.js --until 2026-11-06
```

Añade `--json` para la salida estructurada, o `--since YYYY-MM-DD` para otro
inicio. [El script](scripts/measure-tokens.js) no tiene dependencias, necesita
Node.js y sólo lee transcripciones de Claude Code (`~/.claude/projects`). Imprime
agregados: nunca texto, rutas ni nombres de proyecto.

Los datos de la lista de skills y de la inyección de Superpowers no salen del
script: se contaron aparte sobre los adjuntos `skill_listing` y
`hook_additional_context` de las mismas transcripciones, sólo en agregado.

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
| Una sesión arranca con unos 98000 tokens de contexto, con mucha dispersión por cliente | Media de entrada + creación + lectura de caché en la primera llamada de cada sesión = 98174, n=26. Escritorio 75123-159822 (n=20), VS Code 70017-80297 (n=3), SDK 78605-84896 (n=2), terminal 50953 (n=1) | Alta como descripción. Los porcentajes de abajo usan esa media, que mezcla clientes, e incluye una sesión sin turnos humanos |

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
para español. Es una aproximación: no es la cuenta del modelo.

Nuestra configuración privada, la que corresponde a las sesiones medidas:

| Pieza | Bytes | Tokens aprox. |
|---|---|---|
| `CLAUDE.md` global, que no se publica | 7859 | 2245 |
| Lista completa de skills, plugins incluidos | 29962 | 8561 |
| **Total identificado** | **37821** | **10806** |

| Afirmación | Fórmula | Confianza |
|---|---|---|
| En nuestra configuración privada, `CLAUDE.md` global y lista de skills son aprox. el 11.0% del arranque; el 89.0% restante no está identificado | 37821 / 3.5 = 10806; 10806/98174 = 11.0%. Por separado, 2.3% y 8.7% | Media: tokens aproximados por bytes/3.5 |
| La lista de skills tiene un tope cerca de 30000 bytes: más skills no la alargan, le quitan descripciones | En 22 de las 26 sesiones, su primera lista mide 30002-30092 bytes; en las otras 4, 3309-22162. Con 150 entradas, 30012 bytes y 64 descripciones; con 132, 29962 y 78 | Alta en bytes. El tope consta en la [documentación](https://code.claude.com/docs/en/skills#skill-descriptions-are-cut-short), que lo liga al 1% de la ventana de contexto |

Los 29962 bytes son de las tres sesiones posteriores al cambio de abajo. De esa
lista, `discover`, `sdd` y `vet` ocupan 1157.

Lo que instala este paquete, con el mismo método y sin ninguna herramienta de
terceros:

| Pieza | Bytes | Tokens aprox. |
|---|---|---|
| `core/AGENTS.md` | 8897 | 2542 |
| `core/PROFILE.md`, plantilla sin rellenar | 1915 | 547 |
| `CLAUDE.md` del adaptador | 907 | 259 |
| Descripciones de las 4 skills | 1545 | 441 |
| Descripciones de los 3 agentes | 952 | 272 |
| **Total** | **14216** | **4062** |

| Afirmación | Fórmula | Confianza |
|---|---|---|
| El paquete equivale a aprox. un 4.14% de nuestro arranque medio | 14216 / 3.5 = 4062; 4062/98174 = 4.14% | Baja: compara bytes del paquete con un arranque medido con otra configuración; ninguna sesión lo ha cargado |
| `core/AGENTS.md` creció un 35% al reescribirlo: el proceso nuevo se paga en cada sesión | 6579 bytes antes, 8897 después; 8897/6579 = 1.34 | Alta, medido en bytes |

## Superpowers: desactivado, ahorro sin observar

Desactivamos este plugin el 2026-11-06 a las 20:34 UTC, por el motivo que
explica [tools.md](tools.md). Aparece en los adjuntos de 15 de las 26 sesiones del
periodo.

Lo observado después del cambio:

- **Sesiones nuevas: ya no carga.** Hay tres, automáticas y sin turnos humanos. Su
  lista tiene 132 entradas, ninguna de Superpowers, y no hay inyección.
- **Subagentes de una sesión anterior: siguen viéndolo.** Los lanzados después
  desde una sesión abierta antes del cambio reciben 150 entradas, 15 de Superpowers.
  Heredan el estado de esa sesión, así que no contradicen lo anterior.

Falta una sesión de trabajo real para ver el arranque. Para observarlo, usa sólo
la línea `con turnos humanos` del contexto inicial: los totales incluyen sesiones
automáticas y sesiones abiertas antes de la fecha.

```bash
node scripts/measure-tokens.js --since 2026-11-07
```

| Afirmación | Fórmula | Confianza |
|---|---|---|
| Desactivarlo quita aprox. un 1.0% del contexto inicial medio (rango 0.87-0.99%) | Inyección observada: 3417 bytes en las 22 veces que aparece. 3417 / 3.5 = 976; 976/98174 = 0.99%. Sensibilidad: 3417/4 = 854, un 0.87%, porque el texto está en inglés | Media: calculado con bytes observados, sin muestra humana posterior |
| Sus descripciones no suman ahorro: la lista sigue en el tope y otras skills ocupan el hueco | Ver [Contexto siempre cargado](#contexto-siempre-cargado): de 30012 a 29962 bytes | Alta en bytes; n=3 posteriores |
| Como cota superior, esa inyección fue un 0.31% del contexto de entrada medio por llamada principal | (3696 + 16410618 + 573672215)/1845 = 319830; 976/319830 = 0.31% | Media: cota superior; sólo 14 sesiones tienen inyección y casi todo sería lectura de caché |

Nuestra primera estimación era un 1.8% porque sumaba las descripciones, y el tope
de la lista la invalida.

## Qué no podemos afirmar

**Por qué no hay un porcentaje de ahorro total.** Haría falta un grupo de control.
Un número frente a "trabajar sin esta metodología" sería un contrafactual
inventado, y lo mismo pasa con "sin caché costaría X".

Tampoco podemos medir:

- **Ahorro observado por desactivar Superpowers:** no hay sesiones de trabajo
  posteriores al cambio, y las tres automáticas no son comparables.
- **Un antes y después de Superpowers:** se sabe en qué sesiones estaba, pero entre
  ellas hubo otros cambios y clientes distintos.
- **Su efecto en subagentes:** el hook de inicio y la lista de skills en
  subagentes no se distinguen en los datos de usage.
- **De qué se compone el 89.0% restante del arranque** (prompt de sistema,
  esquemas de herramientas, MCP, `CLAUDE.md` de proyecto): usage sólo da el total.
- **El contexto exacto de cada sesión:** `CLAUDE.md` se midió como está hoy, no
  como estaba entonces.
- **El arranque real con este paquete:** ninguna sesión medida lo cargó.
- **Llamadas no registradas en transcripciones:** `cost-state` muestra más salida
  que la transcripción en algunas sesiones, lo que apunta a tareas en segundo plano
  o peticiones no guardadas. Causa sin confirmar; los totales pueden quedar algo
  cortos.
- **Lo anterior a lo que hay en disco**, por retención de transcripciones, y el
  consumo en otros clientes o equipos.
- **Coste en dinero:** no se calculó. La cifra de `cost-state` es parcial.
- **Calidad o velocidad del trabajo:** los tokens no miden si el resultado fue
  mejor.
