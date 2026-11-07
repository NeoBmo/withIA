# Perfil personal

Plantilla: sustituye los ejemplos por los tuyos y borra las líneas "Por qué".
Aquí va lo que te define a ti en cualquier proyecto; el proceso está en
`AGENTS.md`. Se instala una vez y las actualizaciones no lo pisan. Nunca pongas
secretos.

## Quién soy

Por qué: el agente ajusta cuánto explica según lo que ya dominas.

- Ana, desarrolladora backend con 8 años de experiencia; floja en CSS: ahí
  explica más.

## Prioridades

Por qué: decide los empates entre dos soluciones válidas.

- Seguridad, después legibilidad y, por último, rendimiento.

## Comunicación e idioma

Por qué: evita repetir en cada sesión cómo quieres que te hablen.

- Respóndeme en español y explica el porqué con un ejemplo concreto.
- Código, archivos y commits en inglés.

## Entorno y sus trampas

Por qué: un comando pensado para otro sistema falla y gasta un intento.

- macOS con Zsh; gestor de paquetes: `pnpm`, nunca `npm`.
- En PowerShell 5.1 no escribas con `Set-Content` ni `Out-File`: añaden BOM o
  bytes NUL y git deja de ver el diff. Usa las herramientas de edición.

## Cuando el paso lo hago yo

Por qué: en consolas y paneles web, un paso ambiguo acaba en error.

- Un comando por bloque, con rutas reales en lugar de placeholders.
- Si dos cosas se parecen (clave pública y privada), sepáralas en una tabla.

## Estilo e identidad visual

Por qué: sin esto, la UI cae en lo genérico.

- Sin defaults genéricos de IA: manda la identidad visual del proyecto.
- Movimiento con propósito: cada animación comunica estado; respeta
  `prefers-reduced-motion`; anima `transform` y `opacity`.

## Herramientas personales

Por qué: el agente sólo usa lo que sabe que tienes.

- Tareas en Linear: lee la tarea antes de empezar y actualiza su estado al
  cerrar.
- Copia de withIA: `~/code/withIA`. Su `tools.md` es el catálogo de `vet`; si usas
  otro, pon aquí su ruta.
