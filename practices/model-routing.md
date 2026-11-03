# Reparto de modelos por riesgo

Regla: **el modelo se elige por el coste de equivocarse, no por el tamaño de la
tarea.** Una migración de una línea en una base de datos real merece el mejor
modelo; renombrar cuarenta archivos, no.

## En Claude Code

| Rol | Quién | Modelo |
|---|---|---|
| Coordinador | sesión principal | Opus, esfuerzo alto |
| Explorar / borrador de plan | agentes nativos `Explore`, `Plan` | los suyos |
| Implementar una tarea delegada | agente `implementer` | Sonnet |
| Revisar | agente `reviewer` | Sonnet; Opus en auth, dinero y migraciones |
| Especialistas | agentes `agency-*` | Sonnet |

El modelo se puede cambiar en cada llamada a un subagente, así que la tabla es
el valor por defecto, no una jaula.

## En OpenCode: sólo modelos gratuitos

OpenCode es mi herramienta secundaria y tiene una regla dura: **coste cero**. Si
no hay un modelo gratuito adecuado, se para y me pregunta; nunca cae a uno de
pago.

Dos ideas de ese esquema que sirven en cualquier herramienta:

1. **El revisor es de una familia de modelos distinta al que implementó.** Dos
   modelos de la misma familia tienden a cometer los mismos errores y a no
   verlos en el otro.
2. **Cadena de respaldo.** Si un modelo se queda sin cuota, se pasa al siguiente
   de la cadena con aviso, sin bajar el nivel de riesgo de la tarea. Una regla
   de calidad no debe convertirse en un punto único de fallo.
