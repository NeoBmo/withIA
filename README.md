# withIA

Cómo trabajamos Luis ([NeoBmo](https://github.com/NeoBmo)) y Claude para programar:
el proceso, las reglas y las herramientas, con el porqué de cada decisión, para
copiarlo, discutirlo o descartarlo. Es nuestro proceso escrito como paquete; su
estado de prueba está en [Dónde funciona](#dónde-funciona).

- **Evidencia antes que confianza.** Nada se da por terminado sin tests, navegador
  o una revisión independiente. Lo no probado se marca como no probado.
- **Autonomía con barreras.** El agente hace solo lo rutinario y consulta lo
  crucial. Lo que no debe pasar nunca va en permisos y hooks, no en su memoria.
- **Configuración global.** Se instala una vez, a nivel de usuario, y cualquier
  proyecto se abre sin configurar nada.

> **In English:** how we (Luis, a self-taught frontend developer, and Claude) work
> with AI coding agents: evidence first, autonomy with hard guardrails, one global
> setup. The content is in Spanish. Start with
> [core/AGENTS.md](core/AGENTS.md) and [adapters/README.md](adapters/README.md).

## El bucle

```text
entender → planificar (si aporta) → actuar → evaluar con evidencia → cerrar
                                      ↑                │
                                      └──── ajustar ───┘  máximo 3 intentos
```

Por qué así: el fallo típico de un agente es declarar terminado algo que no
comprobó, así que el criterio se fija antes y se recomprueba tras cada delegación.
Reformular cuesta poco y evita construir lo que nadie pidió. El modelo se elige
por el coste de equivocarse: una migración de una línea merece el mejor; renombrar
cuarenta archivos, no. Las reglas exactas están en [core/AGENTS.md](core/AGENTS.md).

## Quién hace qué

| Quién | Qué hace | Dónde está |
|---|---|---|
| **Documento madre** | Se carga en cada sesión y actúa como prompt del coordinador. Está partido en dos: proceso común, que se actualiza, y persona, que no se pisa | [core/AGENTS.md](core/AGENTS.md), [core/PROFILE.md](core/PROFILE.md) |
| **Coordinador** | Es la sesión principal: afina el pedido, fija el criterio, hace directo lo pequeño, reparte lo grande y juzga | Sin archivo propio: [Coordinador](core/AGENTS.md#coordinador) |
| `implementer` | Ejecuta una tarea acotada y devuelve evidencia | [agents/implementer.md](agents/implementer.md) |
| `reviewer` | Juzga el cambio con contexto limpio | [agents/reviewer.md](agents/reviewer.md) |
| `writer` | Documenta lo que existe, contrastado con el código | [agents/writer.md](agents/writer.md) |
| Skills | Preparar un proyecto, planificar y admitir herramientas | [discover](skills/discover/SKILL.md), [sdd](skills/sdd/SKILL.md), [vet](skills/vet/SKILL.md) |
| Terceros | Opcionales, con autor y licencia, enlazados si tienen repo público, nunca copiados | [tools.md](tools.md) |
| La persona | Decide lo crucial y define cómo quiere trabajar | [Autonomía](core/AGENTS.md#autonomía), [core/PROFILE.md](core/PROFILE.md) |
| Configuración | Instalación, permisos y hooks | [adapters/README.md](adapters/README.md) |

## Un ejemplo real

La evaluación del plugin [Superpowers](https://github.com/obra/superpowers) en
este repo, resumida. La sesión evaluó otra herramienta más; aquí seguimos ésta.

1. **Pedido.** Un inventario detectó un plugin global sin ficha en el catálogo. La
   orden fue de una línea: evaluarlo.
2. **Reformulación.** Pasarlo por la puerta de [vet](skills/vet/SKILL.md) y acabar
   en un veredicto escrito, sin instalar ni desactivar nada antes de aprobarlo.
3. **Evidencia.** Leímos sus hooks y scripts, contamos en las transcripciones qué
   se usaba (una sola de sus skills, en pocas sesiones) y calculamos su peso en el
   contexto ([tokens.md](tokens.md)). También apareció un error nuestro:
   `systematic-debugging` figuraba como propia y viene de ese proyecto.
4. **Veredicto.** No es malicioso, pero se rechaza como plugin global: inyecta en
   cada sesión un segundo proceso obligatorio que compite con el nuestro.
5. **Cierre.** Respuesta corta: veredicto, qué cambiaría y qué no quedó verificado
   (sus skills se revisaron por patrones, no enteras). Con el sí, se desactivó y
   corregimos la atribución. Las sesiones nuevas ya no lo listan; su efecto en una
   sesión de trabajo sigue sin observarse ([tokens.md](tokens.md)).

## Dónde funciona

| Agente | Estado |
|---|---|
| Claude Code | Ver [Qué está probado](adapters/README.md#qué-está-probado) |
| OpenCode, Codex CLI, Antigravity, Cursor, Copilot CLI, Gemini CLI | Ver [Compatibilidad](adapters/other-agents.md#compatibilidad) |
| ChatGPT web o Work | Soporte no confirmado |

## Qué no prometemos

- **Ningún porcentaje de ahorro global.** No hay grupo de control: ver
  [tokens.md](tokens.md).
- **Mejor calidad o más velocidad.** No medido, y los datos son de una persona.
- **Barreras absolutas.** Sus límites están en
  [Barreras](adapters/README.md#barreras).

## Licencia

[MIT](LICENSE). Las herramientas de terceros que enlazo conservan su propia
licencia.
