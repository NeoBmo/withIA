---
paths:
  - "**/*.{tsx,jsx,vue,svelte,astro,html}"
  - "**/*.{css,scss}"
---

# Reglas de construcción de UI

Se aplican al escribir la interfaz, no al revisarla. Mandan la identidad visual y
las convenciones del proyecto: si las contradicen, gana el proyecto.

## Datos y envíos

- **Tres estados.** Toda vista con datos remotos pinta carga, vacío y error, además
  del caso feliz. El error dice qué pasó y ofrece reintentar.
- **Envío único.** Desactiva la acción mientras está en curso, sin perder el foco, y
  haz que repetirla no duplique el efecto.
- **El servidor manda.** Totales, topes, permisos y precios los decide el servidor.
  El cliente los muestra y no los recalcula. Tras mutar, pinta lo que devolvió el
  servidor, y revierte cualquier actualización optimista si falla.
- **Frontera cliente/servidor.** Un componente de servidor no lleva interacción:
  mueve el handler a un componente de cliente, lo más pequeño posible.

## Foco y semántica

- **Foco tras mutar.** Al cerrar un modal, vuelve al control que lo abrió. Al borrar
  un elemento, pásalo al siguiente o al encabezado de la lista. Tras un error de
  formulario, al primer campo inválido.
- **HTML nativo antes que ARIA.** `button` para acciones, `a` para navegar, `label`
  para campos, `dialog`, `details`. ARIA sólo para lo que el HTML no pueda expresar.
- **Nombres con sentido.** Cada control con su nombre accesible y cada error unido a
  su campo con `aria-describedby`. Un `div` clicable no se usa nunca.

## Patrones visuales vetados

Salvo que la identidad del proyecto los pida:

- Degradado violeta o azul en el hero, y texto con degradado en titulares.
- Glassmorphism y manchas borrosas de fondo como decoración.
- Tres tarjetas iguales con icono, título y dos líneas.
- Inter o la fuente por defecto sin haberla elegido.
- `rounded-2xl` con sombra en todo por igual.
- Emojis en lugar de iconos.
- Todo centrado, sin jerarquía.
- Cifras, logos o testimonios inventados, y frases de relleno como "Potencia tu flujo
  de trabajo".
