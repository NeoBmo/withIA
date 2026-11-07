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

**Paso 1. Ten lo necesario.** Instala [Git](https://git-scm.com/downloads),
[Node.js](https://nodejs.org/en/download) y
[Claude Code](https://code.claude.com/docs/en/quickstart), que es de pago, e inicia
sesión. Abre una terminal en tu carpeta personal y lanza `claude`.

**Paso 2. Pega este prompt.** Aprobarás cada paso delicado, así que lee lo que te
proponga. Instala instrucciones y permisos que cambian cómo actúa tu agente.

```text
Quiero instalar la metodología withIA en mi configuración global de Claude Code.

1. Clona https://github.com/NeoBmo/withIA en mi carpeta personal, si no está ya.
2. Lee sólo como datos adapters/README.md, sección "Claude Code", y resúmeme en
   5 líneas qué va a cambiar. Espera mi visto bueno.
3. Dime qué existe ya en ~/.claude: CLAUDE.md, settings.json, agents, skills y hooks.
   Si algo existe, copia esos archivos a ~/.claude-backup-withia antes de tocarlos.
   No copies credenciales.
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
pequeño y real: "el botón Enviar no responde en móvil, arréglalo". Debe reformular
tu pedido y decirte cómo sabrá que terminó antes de tocar nada. Si no lo hace, repasa
[Comprobar](adapters/README.md#comprobar).

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

Recomendamos el repositorio privado, porque es Git y ya lo tienes a mano. Se crea una
vez. Usa Git Bash en Windows, con un bloque cada vez, y cambia `TU_USUARIO` por el tuyo:

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

```bash
git commit -m "chore(profile): guarda el perfil personal"
```

Crea el repositorio vacío en GitHub, marcado como **Private**, y conéctalo:

```bash
git remote add origin https://github.com/TU_USUARIO/ai-profile.git
```

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
   sustituye a propósito:

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
