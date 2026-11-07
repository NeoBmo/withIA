# Herramientas

Qué usamos, qué no y por qué. Una lista de herramientas sólo dice qué añadir;
los bloques de rechazadas y diferidas dicen qué **no** añadir, y ahí está el
criterio.

**Ninguna herramienta de esta página es necesaria para el flujo.** El proceso
funciona con el agente, Git y los tests del proyecto. Lo demás es opcional y
nunca se instala por defecto. El inventario completo, con usos y valor de cada
pieza, está en [skills.md](skills.md).

Última revisión de la página: 2026-11-07. Los veredictos caducan a los 90 días,
porque las herramientas cambian rápido y un veredicto viejo puede ser falso. Cada
fila lleva su fecha en la columna `Caduca`; una fila sin fecha no tiene veredicto
vigente.

## Por qué hay una puerta de admisión

Cada semana sale un MCP, una skill o un plugin que promete multiplicar la
productividad. Instalarlos todos tiene un coste que no se ve en la demo:

- **Contexto**: la descripción de cada skill, agente o herramienta MCP entra en
  el contexto de *todas* las sesiones, aunque no se use.
- **Seguridad**: un MCP o un hook ejecuta código en tu máquina, con acceso a tus
  archivos.
- **Conflictos**: dos herramientas que interceptan lo mismo (contexto, memoria,
  lecturas) se pisan sin dar error visible.

Por eso toda herramienta externa pasa la puerta antes de instalarse. Los pasos,
los veredictos y la ficha viven en [skills/vet](skills/vet/SKILL.md).

Un ejemplo: [Agency Agents](https://github.com/msitarzewski/agency-agents) trae
cientos de subagentes. Instalarlos todos inflaría el contexto y empeoraría la elección
automática de agente. Admitimos 7, fijados a un commit y forzados a Sonnet, y los
retiramos el 2026-11-07 porque en 3 semanas no se usó ninguno.

## Admitidas

Lo propio (agentes en [agents/](agents/), skills en [skills/](skills/)) no se
lista aquí: forma parte del repo. Esto es lo de terceros, nunca copiado: cada fila
da autor y licencia, y enlace cuando hay un repo público que enlazar.

### MCP

| Herramienta | Autor y licencia | Para qué | Condiciones | Necesaria para el flujo | Caduca |
|---|---|---|---|---|---|
| [Engram](https://github.com/Gentleman-Programming/engram) | Gentleman-Programming, MIT | Memoria local entre sesiones, en SQLite + FTS5 | Versión fijada (3.4.0; actualizar obliga a repetir la revisión); sólo el perfil `agent`; sin sync en la nube | No. El mínimo portable es `MEMORY.md`; ver la sección Memoria de [core/AGENTS.md](core/AGENTS.md). Hoy casi no lo usamos | 2027-01-22 |
| [Playwright MCP](https://github.com/microsoft/playwright-mcp) | Microsoft, Apache-2.0 | Probar UI desde el agente: WebKit y Firefox, reduced-motion, uso desde terminal | Versión exacta, nunca `@latest` (`@playwright/mcp@0.0.84`); `--isolated` y `--headless`; `browser_run_code_unsafe` denegado en permisos | No. El navegador integrado cubre el uso básico | 2027-02-03 |

### Plugins

| Plugin | Autor y licencia | Para qué | Condiciones | Necesaria para el flujo | Caduca |
|---|---|---|---|---|---|
| [Headroom](https://github.com/petrovicistefan/claude-code-plugins/tree/main/headroom) | Stefan Petrovici, MIT | `/peek`: esquema de un archivo grande (log, JSON, CSV) para leer sólo lo necesario | En Windows se ejecuta con `py`. Su efecto no está medido. No confundir con Headroom de headroomlabs, diferido | No | 2027-01-26 |
| [frontend-design](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/frontend-design) | Anthropic, Apache-2.0 | Dirección estética, sólo markdown | La identidad visual del proyecto manda sobre la skill | No | 2027-01-26 |
| [Claude Code Setup](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/claude-code-setup) | Anthropic, Apache-2.0 | Auditoría de automatizaciones, de sólo lectura | Por proyecto; no se instala tal cual, se adapta | No | 2027-01-20 |
| [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | nextlevelbuilder, MIT | Skill de diseño | Sólo la skill, nunca el plugin completo; piloto por proyecto. No es prioridad | No | 2027-02-03 |

### Skills de terceros

| Skill | Fuente | Para qué | Necesaria para el flujo | Caduca |
|---|---|---|---|---|
| `emil-design-eng`, `animate`, `animation-performance`, `mobile-native`, `review-animations` | [emilkowalski/skills](https://github.com/emilkowalski/skills), de Emil Kowalski (MIT) | Pulido de UI y animación. Sólo 5 de 17 (a 2026-11-06) | No | 2027-01-20 |
| `industrial-brutalist-ui` | [taste-skill-classics](https://github.com/Leonxlnx/taste-skill-classics), de Leonxlnx (MIT) | Un estilo visual con carácter, lejos del look "SaaS limpio" genérico. Sólo uno | No | 2027-01-20 |
| `systematic-debugging` | [obra/superpowers](https://github.com/obra/superpowers), de Jesse Vincent (MIT) | Encontrar la causa antes de proponer un arreglo | No; [core/AGENTS.md](core/AGENTS.md) ya pide buscar la causa antes de arreglar | 2027-02-03 |

### CLI

| Herramienta | Autor y licencia | Condiciones | Necesaria para el flujo | Caduca |
|---|---|---|---|---|
| [PowerShell 7](https://github.com/PowerShell/PowerShell) | Microsoft, MIT | Versión fijada (7.6.9); telemetría desactivada con `POWERSHELL_TELEMETRY_OPTOUT=1` antes de abrir `pwsh`; convive con 5.1, que sigue siendo la referencia de los comandos. Lo que dice de su telemetría sale de la documentación oficial, no del código | No | 2027-02-01 |

## Sin evaluar

**No las recomendamos.** Las tenemos a mano o llegan configuradas, pero no han
pasado la puerta, y eso incumple nuestra propia regla. Que aparezcan aquí no es
un aval.

| Herramienta | Tipo | Dónde está | Qué falta |
|---|---|---|---|
| Context7 | MCP | Configurado en OpenCode y conectado en Claude Code | Pasar la puerta |
| GitHub MCP | MCP | Configurado en OpenCode, con lecturas permitidas y escrituras denegadas | Pesar el solape con `gh` CLI |
| Chrome DevTools MCP | MCP | Configurado en OpenCode | Pasar la puerta; se solapa con Playwright |
| web-validator | MCP | Configurado en OpenCode, para SEO y schema | Revisar su procedencia |
| Notion | MCP | Parte de nuestra configuración privada, no del flujo publicable | Pasar la puerta si alguien quiere adoptarlo |
| ralph-loop | Plugin | Activo por sincronización, sin usos | Pasar la puerta o apagarlo: [skills.md](skills.md) propone retirarlo |
| engineering | Plugin | Activo por sincronización, sin usos | Pasar la puerta. Cada plugin añade descripciones al contexto, justo lo que queremos controlar |
| data, design, productivity, marketing, small-business, cowork-plugin-management | Plugins | Sincronizados y desactivados el 2026-11-07 | Pasar la puerta antes de reactivarlos |
| web-design-guidelines (Vercel) | Skill | Instalada | Pasar la puerta |
| find-skills | Skill | Instalada en OpenCode | Pasar la puerta |
| `grilling` ([mattpocock/skills](https://github.com/mattpocock/skills), de Matt Pocock, MIT) | Skill | Instalada, en `skills/productivity/grilling` del repo de origen | Pasar la puerta: no consta su revisión |

## Fallos reales

Antes de crear skills miramos qué falla de verdad. El 2026-11-07 revisamos commits de
arreglo y 3 semanas de conversaciones, y salieron **88 casos**: 60 de git, 18 de
correcciones humanas y 10 errores admitidos por el modelo. Las skills tocan unos 14.
Casi todo lo demás lo cubren `reviewer`, reglas, hooks y CI, o no lo arregla una skill.

| Tema | Casos | Qué hicimos |
|---|---|---|
| Datos y validación de servidor | 13 (9 de validación, 4 de concurrencia) | [hardening-server-writes](skills/hardening-server-writes/SKILL.md) |
| Reglas de negocio | 9 | Nada aquí: van en los tests de cada proyecto |
| Integración de ramas paralelas | 7 | No es una skill: pide hook o CI |
| Estado de UI y formularios | 6 | [rules/frontend.md](rules/frontend.md) |
| Accesibilidad | 6 (3 de contraste, 3 de semántica y foco) | [web-quality-gate](skills/web-quality-gate/SKILL.md) y la misma regla |
| CI y e2e | 6 | Documentación de cada proyecto |
| Afirmaciones del modelo sin comprobar | 5 | Sin skill: la tabla de evidencia de `implementer` |
| Responsive y móvil | 4 | La misma puerta, [mobile-native](https://github.com/emilkowalski/skills) y la receta [verify](templates/verify/SKILL.md) |

Los temas de la tabla son los principales y no suman 88. Otros, como comandos
fallidos en Windows o contexto perdido entre sesiones, quedan fuera.

Hay que leerlo con cuidado:

- **Sesgo fuerte.** 338 de los 486 commits, y la mayoría de los arreglos, vienen de un
  solo repo de backend. Los 13 casos de servidor salen de ahí. Los repos de frontend
  arreglan sin etiquetar, así que el front está subcontado.
- **Clasificación ligera.** Se hizo una sola vez, a mano y leyendo el asunto de cada
  commit, sin abrir el diff. Un caso es un asunto, no una causa raíz comprobada.
- **Es una pista, no una prueba.** Los conteos justifican probar una pieza, no
  crearla. Por eso [hardening-server-writes](skills.md#prueba-de-hardening-server-writes)
  pasó una prueba con y sin ella, que no ganó en su criterio principal.

## Rechazadas

| Herramienta | Motivo | Caduca |
|---|---|---|
| [TokenRouter](https://www.tokenrouter.com/) | Gateway de pago: los prompts pasan por un tercero y no encontramos términos ni política de privacidad | 2027-01-20 |
| [Claude-Mem](https://github.com/thedotmack/claude-mem) | Se solapa con Engram. Además necesita un worker persistente, usa un observador de pago tras 30 días e incluye telemetría (`posthog-node`) | 2027-01-20 |
| [Agency Agents](https://github.com/msitarzewski/agency-agents), los 7 que admitimos | Retirados el 2026-11-07: 0 usos en 3 semanas. Si los enlazas: el `model: sonnet` era un añadido nuestro, y `agency-reality-checker` y `agency-evidence-collector` citan un script que no existe en su repo | 2027-02-05 |
| [Superpowers](https://github.com/obra/superpowers) (como plugin global) | No por seguridad, sino porque inyecta en cada sesión un segundo proceso obligatorio que compite con el nuestro. Su coste está en [tokens.md](tokens.md). De él enlazamos `systematic-debugging`, con atribución | 2027-02-03 |

## Diferidas

| Herramienta | Por qué espera | Qué lo desbloquearía | Caduca |
|---|---|---|---|
| [Headroom (headroomlabs)](https://github.com/headroomlabs-ai/headroom) | Intercepta prompts y respuestas, telemetría activa por defecto y puede reescribir `AGENTS.md` | Un piloto en un proyecto, con telemetría desactivada | 2027-01-20 |
| [Graphify](https://github.com/Graphify-Labs/graphify) | El análisis semántico necesita API keys de pago | Un repo grande donde grep y Explore se queden cortos; sólo modo offline | 2027-01-20 |
| [Addy Osmani agent-skills](https://github.com/addyosmani/agent-skills) | 25 skills con mucho contexto que pueden contradecir nuestro proceso | Elegir 2 o 3 por proyecto tras revisar conflictos | 2027-01-20 |
| Task Observer | Escribe sus propias observaciones; aún tenemos pocas skills | Que crezca la biblioteca de skills | 2027-01-20 |
| Firecrawl (conector) | Cada URL sale a un tercero y no podemos leer el código del servidor | Sólo cuando `WebFetch` falle, nunca con URLs privadas | 2027-01-26 |
| [21st MCP](https://github.com/21st-dev/magic-mcp) | El servidor no se puede leer y la puerta lo exige. Cada búsqueda sale a un tercero, y el código de su biblioteca comunitaria entra en el proyecto con sus dependencias: riesgo de cadena de suministro y de prompt injection | Sólo por proyecto, sin `generate`, con versión fijada y revisando cada componente y sus dependencias antes de añadirlo | 2027-02-03 |

## Sólo como principio

| Herramienta | Con qué nos quedamos | Caduca |
|---|---|---|
| [Ponytail](https://github.com/dietrichgebert/ponytail) | La idea, escrita en nuestras reglas. El plugin inyecta reglas en cada turno y gasta tokens | 2027-01-20 |

## Pendientes de evaluar

| Herramienta | Qué hace | Dudas antes de admitirla |
|---|---|---|
| [context-mode](https://github.com/mksglu/context-mode) | Guarda la salida de las herramientas en SQLite con búsqueda FTS5 para que no llene el contexto. Local, sin telemetría, compatible con Claude Code y OpenCode | Es Elastic License 2.0 (ELv2), de Mert Koseoglu: código disponible, no abierto. ¿Choca con Engram (memoria) y Headroom (lectura de archivos grandes)? Sus hooks interceptan las mismas llamadas |
