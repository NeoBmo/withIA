
# Adaptador para OpenCode: sólo modelos gratuitos

## Modelos

- Usa sólo modelos de coste 0 y estado `active`, verificados con la tool
  `models` antes de usarlos. Nunca modelos de pago, ni siquiera como ejemplo.
- Si no hay un modelo gratuito adecuado, para y pregunta. Nunca caigas a uno de
  pago.
- Coste 0 no implica capacidad de texto: excluye routers meta, embeddings,
  rerank, imagen y audio.

## Revisión cruzada

- El revisor es de una **familia de modelos distinta** a la del implementador.
  Familia es el prefijo del ID del modelo, no el proveedor.
- Dos modelos gratuitos de la misma familia tienden a compartir puntos ciegos, y
  aquí no hay un modelo superior que los corrija.

## Respaldo por cuota

Si un modelo falla por cuota o proveedor, pasa al siguiente de tu lista, avisa y
regístralo. El sustituto conserva la familia distinta y no baja el riesgo de la
tarea. Consulta a la persona sólo si el riesgo es máximo, si la lista se agota o
si el resultado es insuficiente.

## Persistencia

Los modelos gratuitos cambian y se agotan, así que el estado vive en disco:
`MEMORY.md` (máximo 50 líneas) lo mantiene sólo el coordinador al cerrar cada
tarea, con estado, evidencia del runner, decisiones y sustituciones de modelo.
Cualquier modelo debe poder retomar la tarea leyendo el plan de tareas de §7 del
núcleo (`tasks.md` dentro de `specs/NNN-nombre/`).
