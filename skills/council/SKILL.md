---
name: council
description: Consejo de cinco lentes para una decisión cara o difícil de revertir con dos o más opciones reales (arquitectura, dependencias, negocio, precio, lanzar o no). No usar en preguntas casuales ni en decisiones baratas y reversibles.
---

# Consejo de cinco lentes

Un consejo no decide: ordena el desacuerdo para que la persona decida. Según
«Autonomía», de `AGENTS.md`, las decisiones de arquitectura, dependencias o negocio
aún sin tomar son suyas.

## Paso 0: cortar

- Si la decisión es barata y reversible, responde directo. No convoques.
- Si la persona no pidió el consejo, ofrécelo en una línea con su coste (unas 7
  llamadas a agentes) y espera su sí. Sin sí, no lances nada.

## Paso 1: brief en un archivo

Los subagentes no ven la conversación. Escribe un archivo temporal, fuera del
repo, con:

- La decisión, en una frase.
- Las opciones reales, con sus nombres.
- Restricciones: plazo, dinero, habilidades, dependencias ya fijadas.
- Lo que ya se sabe, separando **verificado** (con fuente) de **inferido**.

Sin tu opinión ni la de la persona: un brief sesgado sesga a los cinco.

## Paso 2: cinco consejeros en paralelo

Lanza los cinco subagentes en UN solo mensaje. Cada uno lee el brief (salvo el de
afuera), responde en un máximo de ~200 palabras y con puntos concretos.

| Lente | Qué hace |
|---|---|
| Contrario | Busca qué mata la idea. Aplica el pre-mortem de «Atacar el plan», en «El bucle» de `AGENTS.md` |
| Primeros principios | Ignora la pregunta tal como viene y pregunta qué se intenta resolver de verdad |
| Expansionista | Señala el potencial que la persona no ve |
| De afuera | Recibe SÓLO la pregunta, sin el brief. Descubre lo obvio que se dejó de notar |
| Ejecutor | Sólo le importa qué se hace ya y cuál es el primer paso |

Las lentes nunca hablan como personas reales ni las citan.

## Paso 3: revisión cruzada

Un sexto agente recibe las cinco respuestas anonimizadas como A-E, sin saber qué
lente es cuál. Debe señalar:

- La respuesta más sólida y por qué.
- Las contradicciones entre ellas.
- Los puntos ciegos: lo que ninguna vio.

## Paso 4: presidente

El presidente es el coordinador. Con las cinco respuestas y la revisión, entrega:

1. **Veredicto**: qué opción recomienda y por qué.
2. **UN paso claro**: el siguiente, no una lista.
3. **Estimación**: un rango con sus razones, como pide «Cómo leer los pedidos» de
   `AGENTS.md`.
4. **Qué cambiaría el veredicto**: el dato o hecho que lo invertiría.

Es una recomendación: decide la persona. Si hay riesgo alto, no sustituye a la
revisión independiente ni a su aprobación.

## Sin subagentes

Si la herramienta no los tiene (por ejemplo OpenCode con modelos gratuitos), recorre
las cinco lentes en secuencia en un solo contexto, con la revisión cruzada al final.
Avisa a la persona de que la independencia es menor: cada lente ve a las anteriores.

Estructura de opiniones, revisión cruzada anónima y presidente: idea de
https://github.com/karpathy/llm-council (sin licencia; sólo la idea, nada de su código).
