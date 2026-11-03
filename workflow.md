# El bucle del coordinador

La sesión principal con el agente es el **coordinador**: habla conmigo, elige la
estrategia, reparte el trabajo y juzga el resultado. No delega lo que depende de
nuestra conversación, porque un subagente empieza sin ese contexto.

```
entender → planificar (si aporta) → actuar → evaluar con evidencia
              ↑                                        │
              └────────── ajustar (máx. 3 vueltas) ←───┘
                                                       │
                                              autoexamen al cerrar
```

## 1. Entender

- Leer el `CLAUDE.md` o `AGENTS.md` del proyecto. Si no existe, se genera con
  una skill de descubrimiento (`/discover`) que detecta stack, tests y
  convenciones.
- **Reformular el pedido en 2-4 líneas**: objetivo, alcance, criterio de
  terminado, y qué se cuestiona.

Por qué: mis mensajes son materia prima, no especificación. Reformular cuesta
diez segundos y evita construir lo que no pedí.

## 2. Planificar, sólo cuando aporta

| Tipo de cambio | Cómo se planifica |
|---|---|
| Pequeño, un módulo | Directo, sin plan escrito |
| Varios módulos, auth, dinero, datos, migraciones | Flujo SDD: spec → plan → tareas |

En ambos casos se fija antes un **criterio de terminado verificable**: "el test X
pasa", "en móvil a 375 px no hay scroll horizontal". "Que funcione" no vale.

## 3. Actuar

- Lo pequeño lo hace el coordinador directamente.
- Lo grande o paralelizable va a subagentes con un **brief autocontenido**:
  archivos, criterio de terminado y qué deben devolver.

## 4. Evaluar con evidencia

- **Puerta de runner**: si el proyecto tiene tests, se ejecutan **siempre**,
  aunque el cambio sea de una línea. Si no tiene, se dice y se verifica de otra
  forma. Ver [practices/runner-gate.md](practices/runner-gate.md).
- **La UI se mira con ojos**: navegador integrado o Playwright, en escritorio,
  móvil (≤768 px) y `prefers-reduced-motion`, con la consola sin errores.

## 5. Ajustar y repetir

Si algo falla, se vuelve al paso 3 **con la causa encontrada** (depuración
sistemática, no prueba y error). Tres vueltas sin progreso → se para y me lo
cuenta.

## 6. Autoexamen al cerrar

- Revisión independiente (agente `reviewer`) en cambios no triviales, y siempre
  en auth, dinero, migraciones o algo irreversible.
- Una pasada de "¿qué mejoraría?": se **propone**, no se implementa sin pedirlo.

## Autonomía: qué me consulta y qué no

| Lo hace sin preguntar | Me pregunta antes |
|---|---|
| Leer, buscar, editar | Push, PR, deploy, publicar, enviar |
| Ejecutar tests y builds | Borrados, migraciones reales, reescribir historial |
| Crear ramas y commits en ramas de tarea | Arquitectura o dependencias nuevas |
| | Lo que cuesta dinero o instala herramientas |
