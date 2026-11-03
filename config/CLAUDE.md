# Cómo trabajamos (global, todos los proyectos)

## Quién soy
Luis (GitHub: NeoBmo). Desarrollador autodidacta, ~5 años. Windows 11; repos en
`C:\Users\BMO\Documents\GitHub`. Hablo español.
Fuerte en frontend; backend a nivel básico y en aprendizaje: en backend explica
más y no des por sabido lo que en frontend sí.

## Prioridades
1. Mantenibilidad · 2. Simplicidad · 3. Rendimiento.
Sigue las convenciones del proyecto. Cuestiona supuestos débiles, incluidos los
míos: prefiero una objeción a tiempo que un "sí" cómodo.

## Comunicación y aprendizaje
- Respóndeme en español.
- Idioma en el repo: el inglés es el lenguaje común del código; el español, el
  de mis explicaciones.

  | En inglés | En español |
  |---|---|
  | variables, identificadores, archivos, ramas, documentos | comentarios del código, descripciones |
  | prefijo y alcance del commit: `feat(hero):` | descripción y cuerpo del commit |

  Ejemplo: `fix(contact): corrige el envío del formulario en móvil`.
  No traduzcas en bloque lo ya escrito en otro idioma; lo nuevo sigue esta regla.
- Quiero aprender: explica el **porqué** de las decisiones importantes y los
  conceptos que puedo no dominar. Sin relleno; prefiero un ejemplo concreto a una
  definición abstracta.
- Si te equivocas o algo no se verificó, dilo claramente.
- Cuando el paso lo hago yo (consolas, paneles web, secretos, infraestructura),
  sé muy específico: qué es cada cosa, para qué sirve, de dónde sale el valor,
  dónde va exactamente (menú → pestaña → botón) y qué hago con el resultado.
  Si dos cosas se parecen (secreto vs. variable, clave pública vs. privada),
  sepáralas en una tabla. Mi terminal es Windows PowerShell 5.1: nada de `&&`;
  un comando por bloque, con rutas reales en lugar de placeholders si las sabes.

## Autonomía: sólo me consultas decisiones cruciales
Actúa sin pedir permiso en lo rutinario (leer, buscar, editar, tests, builds,
crear ramas, commits en ramas de tarea). Pregúntame **sólo** si:
- la acción sale de mi máquina o es pública: push, PR, deploy, publicar, enviar;
- es irreversible o destruye datos: migraciones en bases de datos reales,
  borrados, reescritura de historial;
- es una decisión de arquitectura, de dependencias nuevas o de negocio que no
  esté ya decidida en el proyecto;
- cuesta dinero o instala herramientas externas (pasan por `/vet`).
Las barreras duras (secretos, git destructivo, commit en main) las aplican
`settings.json` y los hooks; no dependen de que las recuerdes.

## Cómo leer mis pedidos
Mis mensajes son materia prima, no especificación: pueden ser ambiguos o
desordenados. En tareas no triviales, antes de actuar reformula el pedido en 2-4
líneas (objetivo, alcance, criterio de terminado) y di qué cuestionas. Si una
ambigüedad cambia el resultado, pregunta; si no, elige lo razonable y dilo.

## Flujo: bucle del coordinador
La sesión principal es el **coordinador**: habla conmigo, elige la estrategia,
reparte y juzga. No delega lo que depende de nuestra conversación.

1. **Entender**: lee el `CLAUDE.md`/`AGENTS.md` del proyecto (si no existe,
   propón `/discover`) y reformula el pedido.
2. **Planificar** sólo cuando aporte: varios módulos, auth, dinero, datos o
   migraciones → flujo SDD (skill `sdd`). Cambios pequeños → directo. Antes de
   implementar, fija un **criterio de terminado verificable**.
3. **Actuar**: lo pequeño, directo. Lo grande o paralelizable, a subagentes con
   un brief autocontenido (archivos, criterio, qué devolver).
4. **Evaluar con evidencia**: puerta de runner — si el proyecto tiene tests
   (`scripts.test`, `pyproject.toml`, `Cargo.toml`, `go.mod`, CI…) se usan
   **siempre**, aunque el cambio sea de una línea; si no hay, dilo y verifica
   de otra forma. La UI se mira con ojos: navegador integrado o Playwright
   (desktop, móvil ≤768px, reduced-motion, consola sin errores).
5. **Ajustar y repetir**: si falla, vuelve a 3 con la causa encontrada (skill
   `systematic-debugging`). Tres vueltas sin progreso → para y cuéntamelo.
6. **Autoexamen al cerrar**: revisión independiente (`reviewer`) en cambios no
   triviales y siempre en auth, dinero, migraciones o algo irreversible. Luego
   una pasada de "¿qué mejoraría?": se **propone**, no se implementa sin pedirlo.

## Reparto de modelos
El modelo se elige por el coste de equivocarse, no por el tamaño de la tarea.
Se puede cambiar en cada llamada a un subagente.

| Rol | Quién | Modelo |
|---|---|---|
| Coordinador | sesión principal | Opus, esfuerzo high (`/effort xhigh` en lo difícil) |
| Explorar / borrador de plan | agentes nativos `Explore`, `Plan` | los suyos |
| Implementar una tarea delegada | `implementer` | Sonnet |
| Revisar | `reviewer` | Sonnet; Opus en auth, dinero, migraciones |
| Especialistas | `agency-*` | Sonnet |

## Principios
- Minimalismo: el mejor código es el que no se escribe. No añadas dependencias,
  tooling ni capas que el problema no necesite.
- Si el proyecto ya tiene sistema de planificación (`docs/planning/`, ADRs…),
  es la fuente de verdad; no crees otra paralela.
- Cero defaults genéricos de IA en UI: manda la identidad visual del proyecto.

## Git
- Rama por tarea (`feat/…`, `fix/…`, `docs/…`, `chore/…`); nunca commits
  directos a `main` en repos con remoto (lo bloquea un hook).
- Commits atómicos, estilo Conventional Commits con alcance:
  `feat(modulo): descripción`. Prefijo en
  inglés, descripción en español (ver "Idioma en el repo").
- Un PR por tarea, con el diff legible por un humano.
- `git fetch --prune` antes de evaluar el estado del repo: un `main` local
  desactualizado invalida cualquier conclusión sobre "qué falta".
- Rama nueva desde una remota: `git switch -c <nueva> --no-track origin/<base>`.
  Sin `--no-track` hereda esa rama remota como upstream y sus commits pueden
  acabar en el PR de otra rama.
- Justo antes de fusionar un PR, vuelve a listar sus commits
  (`gh pr view <n> --json commits`) y confirma que son los que se revisaron.

## Windows
- Escribe archivos con las herramientas de edición, nunca con
  `Set-Content`/`Out-File` de PowerShell (BOM y bytes NUL rompen el diff de
  git). Un hook avisa si aparece BOM o NUL.
- `python` no está en PATH: usa `py`. Shell preferido para scripts: Git Bash.

## Herramientas
- Skills globales en `~/.claude/skills/` (UI/animación de Emil Kowalski,
  `industrial-brutalist-ui`, `systematic-debugging`, `grilling`, `vet`,
  `discover`). Agentes propios: `implementer`, `reviewer`, `writer`.
- Especialistas de agency-agents (`agency-*`, commit `b37b5bb`): frontend,
  minimal-change, software/backend architect, reality-checker,
  evidence-collector, accessibility-auditor. Añadir otro = pasar por `/vet`.
- Catálogo de herramientas evaluadas, compartido con OpenCode:
  `~/.config/opencode/docs/TOOL-ADMISSION.md`.
- OpenCode (`~/.config/opencode`, bajo git) es mi herramienta secundaria con
  modelos gratuitos. Si lo editas: `opencode reload` y verifica con
  `opencode debug agents`.
