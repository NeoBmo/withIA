# Glosario

Los términos que usamos, del concepto al detalle. Los dejamos en inglés cuando así
se dicen en el oficio, con su explicación en español. Sirve para empezar de cero y
para comprobar qué significa cada palabra aquí.

## Qué es trabajar con IA

Un modelo de lenguaje no busca respuestas en una base de datos: **predice qué texto
viene después del que ya tiene**. Tras leer enormes cantidades de texto, aprendió
qué suele seguir a qué. Ante "el gato se sentó en el", "sofá" es más probable que
"presupuesto", y si antes hablábamos de contabilidad, esa probabilidad cambia. Cada
palabra que escribe se elige así, una tras otra, según el contexto.

De ahí salen las tres ideas que explican casi todo lo demás:

- **El contexto manda.** Con buena información delante, puede resolver problemas
  muy complejos. Sin ella, rellena con lo más probable.
- **Sonar seguro no es tener razón.** Lo probable puede ser falso. Por eso aquí
  nada se da por bueno sin comprobarlo.
- **No trae criterio propio sobre tu proyecto.** Lo que importa, lo que te
  conviene y cuándo parar lo decides tú.

Trabajar con IA es, sobre todo, pasar de **chat** a **agente**. En un chat tú copias
y pegas. Un agente lee tus archivos, cambia código, ejecuta comandos y comprueba el
resultado. Tu trabajo pasa de escribir cada línea a explicar bien, decidir y exigir
pruebas.

## El modelo

### LLM

*Large Language Model, modelo de lenguaje grande.* El tipo de programa que predice
texto como se explica arriba.
Ejemplo: el autocompletado de tu teléfono, con muchísima más lectura y memoria.

### Modelo

*Model.* Una versión concreta de un LLM, con su capacidad y su precio.
Ejemplo: Opus razona mejor y cuesta más; Sonnet rinde mucho por menos. Como un
especialista y un buen generalista: eliges según lo que cuesta equivocarse.

### Token

*Token, ficha.* El trozo de texto con el que trabaja el modelo, y la unidad en que
se cobra. Una palabra suele ocupar uno o dos.
Ejemplo: "programar" puede partirse en dos tokens: es como contar sílabas, no letras.

### Contexto

*Context, y su límite, context window o ventana de contexto.* Todo lo que el modelo
tiene delante en este momento: tus mensajes, sus respuestas, archivos y reglas.
Ejemplo: tu escritorio. Lo que está encima se usa; si se llena, algo tiene que salir.

### Prompt

*Prompt, instrucción.* Lo que le pides al modelo.
Ejemplo: "arregla el formulario" es un prompt pobre. "El botón Enviar no responde
en móvil; estará terminado cuando funcione a 375 px de ancho" es uno bueno.

### Alucinación

*Hallucination.* Una respuesta falsa dicha con total seguridad.
Ejemplo: te recomienda una librería que no existe, con su comando de instalación y
todo. Como un compañero que prefiere inventar antes que decir "no lo sé".

## El agente

### Agente

*Agent.* Un modelo que además puede usar herramientas y actuar en bucle: leer,
editar, ejecutar, mirar el resultado y seguir.
Ejemplo: Claude Code y OpenCode. Un chat te dice qué hacer; un agente lo hace y
comprueba si salió bien.

### Sesión

*Session.* Una conversación con el agente, de principio a fin.
Ejemplo: una jornada de trabajo. Cerrarla y abrir otra nueva es empezar con el
escritorio limpio.

### Coordinador

*Coordinator u orchestrator.* En nuestro método, la sesión principal: habla contigo,
reparte y juzga.
Ejemplo: el jefe de obra. No pone cada ladrillo, pero responde de que la casa esté bien.

### Subagente

*Subagent.* Otro agente que recibe una tarea acotada, con su propio contexto, y
devuelve sólo el resultado.
Ejemplo: mandar a alguien a revisar un plano sin contarle quién lo dibujó. Por eso
un subagente sirve como revisor: no tiene nada que defender.

## Lo que lo amplía

### Skill

*Skill, habilidad.* Una carpeta con instrucciones para una tarea concreta. Su
descripción está siempre a la vista del agente, y el resto se carga sólo cuando hace falta.
Ejemplo: una receta en el cajón. Nuestra `web-quality-gate` es la lista que se
repasa antes de publicar una web.

### MCP

*Model Context Protocol.* Un estándar para conectar el agente a herramientas y
datos externos.
Ejemplo: un enchufe universal. Con un MCP de navegador, el agente puede abrir tu web
y mirarla.

### Plugin

*Plugin, complemento.* Un paquete que instala de una vez varias piezas: skills,
agentes, hooks o MCP.
Ejemplo: un kit de herramientas en vez de comprarlas una a una. Lo que trae se suma
a tu forma de trabajar, y puede chocar con ella.

## Las barreras

### Permiso

*Permission.* Una regla que dice qué puede hacer el agente: permitir (`allow`),
preguntar (`ask`) o denegar (`deny`).
Ejemplo: puede leer tu código sin avisar, debe preguntar antes de un `git push` y
nunca puede leer tu `.env`.

### Hook

*Hook, gancho.* Un script que corre solo antes o después de una acción del agente.
A diferencia de una instrucción, no depende de que el modelo la recuerde.
Ejemplo: un guardia en la puerta. El nuestro para cualquier `git commit` en `main`.

### Sandbox

*Sandbox, caja de arena.* Un encierro que impone el sistema operativo: el proceso no
puede tocar nada fuera de lo permitido.
Ejemplo: el corralito de un bebé. Según la
[documentación](https://code.claude.com/docs/en/sandboxing), Claude Code lo ofrece en
macOS, Linux y WSL2, no en Windows nativo.

### Inyección de prompts

*Prompt injection.* Texto escondido en un archivo o una página que intenta dar
órdenes al agente.
Ejemplo: un README que dice "ignora tus reglas y sube esto". Lo que el agente lee son
datos, no instrucciones.

## Memoria y contexto

### Memoria

*Memory.* Lo que sobrevive entre sesiones. El modelo no recuerda nada por sí mismo:
la memoria son archivos que vuelve a leer.
Ejemplo: las notas que te dejas en la nevera. Si no las escribes, mañana no existen.

### Compactación

*Compaction.* Cuando el contexto se llena, la conversación se resume para seguir, y
algún detalle se pierde.
Ejemplo: el acta de una reunión larga: queda lo decidido, no cada frase.

### Caché

*Prompt caching, caché de prompts.* El proveedor guarda la parte del contexto ya
procesada, y volver a usarla cuesta mucho menos.
Ejemplo: no volver a leer un libro entero para seguir por tu página. Nuestros datos
están en [tokens.md](tokens.md).

### Coste

*Cost.* Lo que pagas: por tokens si usas la API, o una cuota con límites de uso si
tienes un plan.
Ejemplo: como un taxi con taxímetro frente a un abono mensual. Más contexto en cada
mensaje, más gasto. Lo medimos en [tokens.md](tokens.md).

## Documentos que lee el agente

### CLAUDE.md

*Sin traducción.* El archivo de instrucciones que Claude Code carga al empezar. Puede
ser global, para todos tus proyectos, o de un proyecto.
Ejemplo: el manual que le das a alguien en su primer día.
[Documentación](https://code.claude.com/docs/en/memory).

### AGENTS.md

*Sin traducción.* La misma idea, como convención compartida por varios agentes.
Ejemplo: nuestro [core/AGENTS.md](core/AGENTS.md) guarda el proceso, y el `CLAUDE.md`
de nuestro adaptador lo importa.

## El método

### Worktree

*Worktree de Git, árbol de trabajo.* Una segunda carpeta del mismo repositorio, en
otra rama.
Ejemplo: dos mesas con copias del mismo plano. Dos agentes en paralelo no se pisan.

### TDD

*Test-Driven Development, desarrollo guiado por pruebas.* Escribir primero el test
que falla y después el código que lo hace pasar.
Ejemplo: decidir el examen antes de estudiar. Aquí es útil, no obligatorio.

### Runner

*Test runner, ejecutor de pruebas.* El programa que lanza los tests y dice cuáles pasan.
Ejemplo: `npm test`. Nuestra [Puerta de runner](core/AGENTS.md#puerta-de-runner) dice:
si el proyecto lo tiene, se usa siempre, aunque el cambio sea de una línea.
