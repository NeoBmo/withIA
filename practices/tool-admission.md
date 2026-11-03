# Puerta de admisión de herramientas

Cada semana sale un MCP, una skill o un plugin que promete multiplicar la
productividad. Instalarlos todos tiene un coste que no se ve en la demo:

- **Contexto**: la descripción de cada skill, agente o herramienta MCP entra en
  el contexto de *todas* las sesiones, aunque no se use.
- **Seguridad**: un MCP o un hook ejecuta código en tu máquina, con acceso a tus
  archivos.
- **Conflictos**: dos herramientas que interceptan lo mismo (contexto, memoria,
  lecturas) se pisan sin dar error visible.

Por eso toda herramienta externa pasa esta puerta antes de instalarse. La ejecuto
con una skill propia, `/vet`, que deja el veredicto en un catálogo compartido
entre Claude Code y OpenCode.

## Los seis pasos (en orden, sin saltarse)

1. **Saber cómo funciona**: fuente, licencia, versión, permisos.
2. **No malicioso**: scripts, dependencias, telemetría, endpoints, acceso a
   archivos o secretos.
3. **Coste**: dinero, tokens de contexto, latencia, mantenimiento.
4. **Impacto y alternativa**: ¿se solapa con algo que ya uso? ¿Hay algo más
   simple?
5. **Ubicación**: ¿global o sólo en el proyecto que lo necesita?
6. **Rollback**: versión fijada, cómo desactivarlo, cómo desinstalarlo.

## Veredictos posibles

| Veredicto | Significa |
|---|---|
| Admitido con condiciones | Se instala, con límites explícitos (versión fija, subconjunto, permisos denegados) |
| Admitido sólo como principio | Me quedo con la idea y la escribo en mis reglas; no instalo la herramienta |
| Diferido | No ahora; se revisa si aparece la necesidad |
| Rechazado | No se instala, con el motivo escrito |

Cada ficha caduca a los **90 días**: las herramientas cambian rápido y un
veredicto viejo puede ser falso.

## Ejemplo real

[Agency Agents](https://github.com/msitarzewski/agency-agents) trae 299
subagentes. Instalarlos todos inflaría el contexto en cada turno y empeoraría la
elección automática de agente. Veredicto: admitido con condiciones, **sólo 7**
que encajan con mi perfil, fijados a un commit y forzados a usar Sonnet para que
no hereden el modelo caro de la sesión.

Ver el resultado completo en [tools/](../tools/README.md) y
[rejected.md](../rejected.md).
