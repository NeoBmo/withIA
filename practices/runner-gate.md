# Puerta de runner y criterio de terminado

El fallo más común de un agente no es escribir mal el código: es **declarar
terminado algo que no comprobó**. Esta práctica existe para eso.

## Criterio de terminado verificable

Antes de implementar se fija qué demuestra que está hecho.

| Malo | Bueno |
|---|---|
| "Que el formulario funcione" | "El envío con email inválido muestra el error y no llama a la API; test `contact.spec.ts` en verde" |
| "Que se vea bien en móvil" | "A 375 px no hay scroll horizontal y el menú abre con teclado" |

## La puerta de runner

Si el proyecto tiene tests, se ejecutan **siempre**, aunque el cambio sea de una
línea. Se detectan por señales del propio repo, como `scripts.test` en
`package.json` o la configuración de CI. La lista completa y los perfiles están
en [core/AGENTS.md](../core/AGENTS.md).

Si no hay tests, el agente lo **dice** y verifica de otra forma (build,
navegador, ejecución manual). Lo que no vale es callarlo.

## La UI se mira con ojos

Los tests no ven el diseño. Para cambios visuales:

- navegador integrado o Playwright;
- escritorio y móvil (≤768 px);
- `prefers-reduced-motion` activado;
- consola sin errores.

## Revisión independiente

En cambios no triviales, un agente `reviewer` con contexto limpio lee el diff y
ejecuta tests, lint y typecheck. Devuelve `APROBADO` o `CAMBIOS_NECESARIOS` con
evidencia. No puede editar archivos: si pudiera, acabaría arreglando en lugar de
juzgar.
