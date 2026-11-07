---
name: vet
description: Evalúa una herramienta externa (skill, MCP, plugin, CLI, proxy) con la puerta de admisión antes de instalarla y registra el veredicto en el catálogo. Usar cuando compartan la URL o el nombre de una herramienta y pregunten si instalarla o adoptarla, o digan "vet", "evalúa esta herramienta", "¿vale la pena instalar…?", "should I install this", "evaluate this tool".
---

# Puerta de admisión de herramientas

Si no te han dicho qué herramienta evaluar, pregúntalo.

**Catálogo**: el que indique `PROFILE.md`; por defecto, `tools.md` de la copia de
withIA cuya ruta figura ahí. Si no lo encuentras, pregunta dónde está.

Léelo primero y revisa las fechas de la columna `Caduca`, porque nada más avisa de
ellas: un veredicto vale **90 días** desde su revisión. Si la herramienta ya tiene
uno vigente y no ha cambiado, no repitas la evaluación. Uno vencido, o una fila
sin fecha, cuenta como sin evaluar. Menciona también los demás vencidos que veas.

## Pasos (en orden, sin saltarse ninguno)

1. **Saber cómo funciona**: fuente real (el repo, no sólo la página de
   presentación), versión, tipo y permisos que pide.
2. **Procedencia y licencia**: autor y licencia reales. Comprueba si algo
   presentado como propio deriva de un tercero, comparándolo con el original. Si
   la licencia exige atribución, anota cómo se cumple.
3. **No malicioso**: lee scripts, hooks y dependencias. Busca telemetría,
   endpoints remotos, acceso a archivos o secretos y contenido remoto cargado como
   instrucciones (riesgo de prompt injection). Si no puedes leerlo, no se admite.
4. **Coste**: dinero, tokens de contexto por turno, latencia y mantenimiento.
5. **Impacto y alternativa**: ¿qué resuelve que no resuelva ya lo nativo de tu
   agente, un plugin oficial o una skill que ya tengas? ¿Hay algo más simple?
6. **Ubicación**: global sólo si sirve a casi todos los proyectos; si no, en el
   proyecto que lo necesita.
7. **Rollback**: versión fijada (nunca `@latest`), cómo desactivarla y cómo
   desinstalarla.

Explica el razonamiento de cada paso: la persona debe poder aprender a evaluar por
sí misma.

## Veredicto

| Veredicto | Significa |
|---|---|
| Admitir con condiciones | Se instala con límites explícitos: versión fija, subconjunto, permisos denegados |
| Sólo como principio | Se conserva la idea en las reglas propias; la herramienta no se instala |
| Diferir | Ahora no; se revisa si aparece la necesidad |
| Rechazar | No se instala, con el motivo escrito |

## Registro

Propón esta ficha a la persona. Con su aprobación, registra el veredicto: en
`tools.md`, una fila en la tabla del bloque que corresponda, con los campos de su
cabecera y `Caduca`; en un catálogo de fichas, la ficha entera. Si el catálogo es
público, cumple «Nada privado en público», de la sección «Principios» de
`AGENTS.md`: sin rutas locales, hashes de archivos locales ni estadísticas de uso
que revelen datos privados. Un commit público de un tercero sí vale: es la versión
fijada.

```markdown
### <Nombre>

- Tipo: skill | MCP | plugin | CLI | proxy
- Fuente: <repo> @ <versión o commit>
- Autor y licencia:
- Procedencia:
- Permisos:
- Coste: <dinero, contexto, latencia, mantenimiento>
- Solape:
- Veredicto:
- Condiciones:
- Ubicación: global | proyecto
- Rollback:
- Revisada: AAAA-MM-DD
- Caduca: AAAA-MM-DD
```

**No instales nada.** La instalación la decide la persona: termina preguntándole
si la quiere con las condiciones indicadas.
