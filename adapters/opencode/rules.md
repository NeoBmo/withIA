
# Adaptador para OpenCode: sólo modelos gratuitos

Versión fijada: OpenCode V2 (referencia: v2.1.4). Su documentación convive con
la de V1 y se contradicen: no apliques sintaxis de V1 en permisos, MCP ni plugins.

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
- Aquí no es opcional: no hay un modelo superior que corrija los puntos ciegos
  compartidos.

## Respaldo por cuota

Si un modelo falla por cuota o proveedor, pasa al siguiente de tu lista, avisa y
regístralo. El sustituto conserva la familia distinta y no baja el riesgo de la
tarea. Consulta a la persona sólo si el riesgo es máximo, si la lista se agota o
si el resultado es insuficiente.

## Persistencia

Aplica la sección "Memoria" del núcleo con `MEMORY.md` en disco. Como los modelos
gratuitos cambian y se agotan, registra también las sustituciones de modelo.
Cualquier modelo debe poder retomar la tarea leyendo el `tasks.md` descrito en la
skill `sdd`.
