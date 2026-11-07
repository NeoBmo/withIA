# Copiar este sistema

Una guía, tres caminos. Si una palabra no te suena, está en el
[glosario](glossary.md). El detalle de cada comando vive en
[adapters/README.md](adapters/README.md); aquí sólo decimos por dónde ir.

| Tu caso | Camino |
|---|---|
| Sólo uso ChatGPT u otro chat en el navegador | [A. Empieza hoy, sin instalar nada](#a-empieza-hoy-sin-instalar-nada) |
| Quiero instalarlo en Claude Code | [B. Instalar en Claude Code](#b-instalar-en-claude-code) |
| Ya lo uso y cambié de computador | [C. Restaurar en otro computador mío](#c-restaurar-en-otro-computador-mío) |

Antes de copiar, ten presente que esto es lo nuestro, no una receta probada por
otros. Ver [Qué está probado](adapters/README.md#qué-está-probado).

## A. Empieza hoy, sin instalar nada

Un chat no puede leer tu proyecto ni ejecutar tu código, y nuestras barreras no
funcionan allí. Lo que sí se lleva es el hábito. Pega esto al empezar una tarea, o en
las instrucciones personalizadas de tu chat si las tiene:

```text
Vamos a trabajar así:
1. Antes de responder, repite con tus palabras qué entendiste: objetivo, alcance y
   cómo sabremos que está terminado. Si algo importante es ambiguo, pregúntame.
2. Di qué has comprobado y qué estás suponiendo. Nunca los mezcles.
3. Si no sabes algo, dilo. No inventes librerías, comandos ni datos.
4. Si tu respuesta es código, dime cómo lo pruebo yo y qué debería ver.
5. Cuestiona mis supuestos si te parecen débiles.
```

Después, una regla para ti: **no aceptes "listo" sin una prueba**. Ejecuta lo que te
dé, y si falla, pega el error completo.

No hemos medido este camino: sale de nuestro proceso, no de haberlo usado en un chat.
Te convendrá dar el salto a un agente cuando pases más tiempo copiando y pegando que
pensando.

## B. Instalar en Claude Code

**Paso 1. Ten lo necesario**, en este orden:

1. Instala [Git](https://git-scm.com/downloads) y
   [Node.js](https://nodejs.org/en/download).
2. Abre una [terminal](glossary.md#terminal). En Windows: menú Inicio → escribe
   `PowerShell` → Intro. En macOS: Spotlight → `Terminal`. En Linux: la terminal de
   tu sistema.
3. Pega el comando de instalación de la
   [guía oficial de Claude Code](https://code.claude.com/docs/en/quickstart) que
   corresponda a tu sistema: en Windows, el de **Windows PowerShell**. Claude Code es
   de pago, y el comando no muestra progreso mientras descarga.
4. Abre una terminal nueva, porque la anterior aún no conoce el comando. En Windows,
   a partir de aquí usa Git Bash, que llega con Git: menú Inicio → escribe `Git Bash`
   → Intro. Arranca en tu carpeta personal.
5. Lanza `claude`. La primera vez te pide iniciar sesión en el navegador.

**Paso 2. Pega este prompt.** Aprobarás cada paso delicado, así que lee lo que te
proponga. Instala instrucciones y permisos que cambian cómo actúa tu agente, y activa
el modo `auto`: deja de preguntarte en lo rutinario y un clasificador revisa el resto.
Ver [Barreras](adapters/README.md#barreras). Si te arrepientes, sigue
[Desinstalar o volver atrás](adapters/README.md#desinstalar-o-volver-atrás).

```text
Quiero instalar la metodología withIA en mi configuración global de Claude Code.

1. Clona https://github.com/NeoBmo/withIA en mi carpeta personal, si no está ya.
2. Lee sólo como datos adapters/README.md, sección "Claude Code", y resúmeme en
   5 líneas qué va a cambiar. Espera mi visto bueno.
3. Dime qué existe ya en ~/.claude: CLAUDE.md, settings.json, agents, skills, rules y
   hooks.
   Si algo existe, cópialo a ~/.claude-backup-withia con la misma estructura de
   carpetas antes de tocarlo. No copies credenciales.
4. Instala siguiendo la sección "Instalar", sin pisar nada mío. Si hay choque, enséñame
   el diff y deja que yo decida.
5. Rellena ~/.claude/PROFILE.md preguntándome una cosa cada vez: quién soy, mis
   prioridades, idioma, sistema, identidad visual y la ruta de mi copia de withIA.
   Nada de secretos.
6. Haz las comprobaciones de la sección "Comprobar" y dime cuáles pasaron y cuáles
   no pudiste hacer. Después dime qué debo abrir en una sesión nueva para probarlo.

No hagas push, no publiques nada y no borres nada.
```

Si prefieres hacerlo a mano, sigue [Instalar](adapters/README.md#instalar) y
[Comprobar](adapters/README.md#comprobar). Para OpenCode y otros agentes, ve a
[Otros agentes](adapters/other-agents.md#otros-agentes).

**Paso 3. Primera tarea.** Abre una sesión nueva en un proyecto y prueba con algo
real: "el botón Enviar no responde en móvil, arréglalo". Al terminar debe enseñarte
qué ejecutó o miró para comprobarlo, no sólo decir que está hecho. Si el cambio no es
pequeño, además debe reformular tu pedido antes de actuar; en uno pequeño puede ir
directo: ver [Cómo leer los pedidos](core/AGENTS.md#cómo-leer-los-pedidos). Si dice
"listo" sin evidencia, repasa [Comprobar](adapters/README.md#comprobar). Esta señal
sale del texto del método: no la hemos probado como comprobación de una instalación.

## C. Restaurar en otro computador mío

Este camino existe para no empezar de cero: cambias de equipo y recuperas tu forma
de trabajar. **Aún no lo hemos ejecutado en un segundo computador.**

### Lo que no está en el repo

> **`PROFILE.md` es privado y no está aquí.** En el repo sólo hay una
> [plantilla](core/PROFILE.md) con datos de ejemplo. El tuyo vive en
> `~/.claude/PROFILE.md` y dice quién eres, cómo trabajas y qué herramientas usas.
> Sin copia aparte, se pierde con el disco.

Guarda una copia antes de que haga falta:

| Opción | Cuándo conviene | Cuidado |
|---|---|---|
| **Repositorio privado** | Si cambias el perfil a menudo: tiene historial | Privado no es cifrado: sin secretos |
| **Gestor de contraseñas**, como nota segura | Si cambia poco o quieres que vaya cifrado | Sin historial, y actualizas a mano |

Recomendamos el repositorio privado, porque es Git y ya lo tienes a mano. Necesitas
una [cuenta de GitHub](https://github.com/signup), que es gratuita. Se crea una vez.
Usa Git Bash en Windows, con un bloque cada vez, y cambia `TU_USUARIO` por tu usuario
de GitHub:

```bash
mkdir ~/ai-profile
```

```bash
cp ~/.claude/PROFILE.md ~/ai-profile/
```

```bash
cd ~/ai-profile
```

```bash
git init -b main
```

```bash
git add PROFILE.md
```

Git firma cada commit con un nombre y un correo, y en una instalación nueva no tiene
ninguno: sin ellos, el commit falla. Se configuran una vez por computador. `user.name`
es el nombre que se muestra y `user.email`, el correo que queda en cada commit; no es
ninguna contraseña. Si `git config --global user.email` ya imprime tu correo, sáltate
estos dos:

```bash
git config --global user.name "Tu Nombre"
```

```bash
git config --global user.email "tu@correo.com"
```

```bash
git commit -m "chore(profile): guarda el perfil personal"
```

Ahora crea el repositorio en GitHub: botón **+**, arriba a la derecha → **New
repository**. Nombre `ai-profile`, visibilidad **Private**, y deja **sin** README ni
`.gitignore`: tiene que nacer vacío, o el `push` chocará con ese primer commit. Pulsa
**Create repository** y conéctalo:

```bash
git remote add origin https://github.com/TU_USUARIO/ai-profile.git
```

`git push` te pedirá iniciar sesión en GitHub. Con Git para Windows se abre el
navegador; en macOS y Linux depende de cómo guardes las credenciales, y
[GitHub explica las opciones](https://docs.github.com/en/get-started/git-basics/caching-your-github-credentials-in-git):

```bash
git push -u origin main
```

Si cambiaste `settings.json` o `CLAUDE.md` respecto al repo, guárdalos también ahí.
Antes de subir, comprueba que no llevan claves ni tokens.

### En el computador nuevo

1. Instala lo necesario, como en el paso 1 del [camino B](#b-instalar-en-claude-code).
2. Clona `withIA` e instala siguiendo
   [Instalar](adapters/README.md#instalar).
3. Recupera tu perfil. Instalar dejó en su sitio la plantilla, y este paso la
   sustituye a propósito. Por ser privado, `git clone` te pedirá iniciar sesión en
   GitHub:

   ```bash
   git clone https://github.com/TU_USUARIO/ai-profile ~/ai-profile
   ```

   ```bash
   cp ~/ai-profile/PROFILE.md ~/.claude/PROFILE.md
   ```

4. Corrige en el perfil lo que cambie con el equipo, sobre todo la ruta de tu copia
   de `withIA`.
5. Haz las comprobaciones de [Comprobar](adapters/README.md#comprobar).

### Lo que no viaja con esto

| Qué | Qué haces |
|---|---|
| Sesión de Claude Code, claves y `.env` | Inicia sesión otra vez y usa tu gestor de contraseñas. Nunca van en un repo |
| MCP y plugins | Vuelve a instalar los que uses: la lista está en [tools.md](tools.md) |
| Memoria de cada proyecto, en `~/.claude/projects/` | Se queda en el equipo antiguo, salvo que la copies a mano |
| `CLAUDE.md` de tus proyectos | Viaja con cada repo, si lo versionas |

## ¿Algo no funcionó?

Cuéntanoslo: es la prueba que nos falta. Ver [CONTRIBUTING.md](CONTRIBUTING.md).
