# Adaptadores: instalación y portabilidad

Instalas una vez, a nivel de usuario, y abres cualquier proyecto sin configurar
nada. Esta página cubre Claude Code; los demás agentes están en
[other-agents.md](other-agents.md). El estado de prueba vive en
[Qué está probado](#qué-está-probado).

Nada se instala por defecto de MCP ni plugins: [tools.md](../tools.md) los deja
como opción, y ninguno es necesario para el flujo. Sin el MCP de Playwright,
`implementer` y `reviewer` se quedan sin navegador, no sin trabajo.

## Antes de empezar

Requisitos: Git y Node.js (lo usan los hooks).

**Si tu terminal es PowerShell 5.1, abre Git Bash**: menú Inicio → escribe
`Git Bash` → Intro. Todos los comandos de esta página son para Git Bash, no para
PowerShell. Pega un bloque cada vez. En Windows, `~` es `%USERPROFILE%`.

No escribas estos archivos con `Get-Content | Set-Content`: PowerShell 5.1 añade
BOM.

Clona el repo, sea cual sea tu agente. Salvo que se indique otra cosa, los comandos
se lanzan desde esa carpeta:

```bash
git clone https://github.com/NeoBmo/withIA
```

```bash
cd withIA
```

## Claude Code

### Instalar

```bash
mkdir -p ~/.claude/agents ~/.claude/skills ~/.claude/hooks
```

```bash
cp -n core/AGENTS.md core/PROFILE.md adapters/claude-code/CLAUDE.md adapters/claude-code/settings.json ~/.claude/
```

```bash
cp -n agents/*.md ~/.claude/agents/
```

```bash
cp -rn skills/* ~/.claude/skills/
```

```bash
cp -n adapters/claude-code/hooks/*.js ~/.claude/hooks/
```

Después abre `~/.claude/PROFILE.md` y sustituye los ejemplos por los tuyos,
incluida la ruta de tu copia de `withIA`, que es donde `vet` busca el catálogo.

`cp -n` no pisa nada, pero puede omitir archivos sin avisar. Si ya tenías
configuración, añade `@AGENTS.md` y `@PROFILE.md` a tu `CLAUDE.md` y combina
`settings.json` a mano, o pide a tu agente que lo combine y te enseñe el diff.

`settings.json` no fija el modelo del coordinador: lo elige cada persona con
`/model`. La tabla de `CLAUDE.md` indica el nuestro.

Por qué un `CLAUDE.md` que importa: Claude Code no documenta un `AGENTS.md`
global de usuario, sólo de proyecto.

### Comprobar

No es opcional, porque `cp -n` pudo saltarse algo. Abre una sesión nueva:

1. Aparecen los agentes `implementer`, `reviewer` y `writer`.
2. Aparecen las skills `discover`, `sdd`, `vet` y `web-quality-gate`, y su contenido es el del repo: una
   skill antigua con el mismo nombre también aparece. Compruébalo con el bloque de
   abajo, que no debe imprimir nada.
3. `/memory` lista el documento y sus imports.
4. Prueba de conducta: pregunta qué debe consultarte antes de actuar. Debe
   responder con los casos de la sección "Autonomía" de
   [core/AGENTS.md](../core/AGENTS.md).
5. Un commit en `main` de un repo desechable con remoto queda bloqueado.

Para el punto 2:

```bash
for s in discover sdd vet web-quality-gate; do diff -r "skills/$s" ~/.claude/skills/"$s"; done
```

Para el punto 5, crea ese repo. El remoto es ficticio y nunca se contacta:

```bash
mkdir ~/withia-prueba
```

```bash
cd ~/withia-prueba
```

```bash
git init -b main
```

```bash
git remote add origin https://example.com/prueba.git
```

Abre Claude Code en esa carpeta y pídele `git commit --allow-empty -m prueba`.
Debe responder que no se commitea en `main`. Después borra la carpeta.

### Actualizar

Desde tu copia de `withIA`:

```bash
git pull
```

```bash
cp core/AGENTS.md ~/.claude/
```

```bash
cp agents/*.md ~/.claude/agents/
```

```bash
cp -r skills/* ~/.claude/skills/
```

```bash
cp adapters/claude-code/hooks/*.js ~/.claude/hooks/
```

`PROFILE.md` no se toca: es tuyo, y por eso el documento madre está partido en
proceso y persona. `CLAUDE.md` y `settings.json` tampoco se pisan, porque puedes
haberlos combinado con lo tuyo, pero llevan modelos y barreras: revisa qué cambió y
trasládalo a mano.

```bash
git diff ORIG_HEAD HEAD -- adapters/claude-code/CLAUDE.md adapters/claude-code/settings.json
```

Las copias se desfasan si no repites estos pasos. Lo aceptamos: un script o enlaces
simbólicos añaden piezas y fricción en Windows.

### Qué está probado

Estado: **parcial**. Este paquete es la configuración que usamos a diario en
Windows 11 con Claude Code 2.1.310. Sólo cambian `PROFILE.md`, que es personal, y
tres reglas `ask` de despliegue de nuestro stack en `settings.json`. La instalación
desde un clon limpio sigue sin probarse con cuenta y modelo reales.

| Ejecutado en Windows 11 | Sin probar |
|---|---|
| `diff` sin diferencias entre el repo y `~/.claude`: `AGENTS.md`, `CLAUDE.md`, agentes, hooks y las cuatro skills. En `settings.json` coinciden `allow` y `deny` | `git clone` real e instalación desde cero con modelo real |
| `claude -p` con Haiku, en modo `auto`: cargan `implementer`, `reviewer`, `writer` y las cuatro skills | Las cinco comprobaciones de [Comprobar](#comprobar) seguidas, en sesión interactiva |
| `block-commit-on-main` en sesión real: un commit en `main` con remoto se bloqueó y el repo siguió con 1 commit | El mismo hook dentro de un subagente |
| `reviewer` en sesión real: cargó `web-quality-gate`, navegó y sacó un snapshot con Playwright, sin Edit ni Write. El primer intento falló porque le faltaba `ToolSearch`; corregido, también en `implementer` | Una revisión completa de una web con `web-quality-gate` |
| `implementer` en sesión real: navegó con Playwright y devolvió `HECHO` | `writer` en sesión real |
| `node --test scripts/test-hook.test.js`: 35 casos de los dos hooks contra repos temporales | `check-encoding` dentro de una sesión |
| Reglas de `settings.json` en sesión: `cat .env` rechazado. `node -e` sí leyó el archivo, como advierte [Barreras](#barreras) | El clasificador de auto mode provocado a propósito |
| Los `cp` de [Instalar](#instalar) dejan los archivos en su sitio con un `HOME` vacío, desde una copia local: archivos, no una sesión | macOS, Linux y el sandbox, que no existe en Windows nativo |

Por eso no prometemos un tiempo de instalación: aún no lo hemos cronometrado.

## Barreras

Ninguna capa basta sola. Cada una cubre lo que la anterior no ve, y nosotros usamos
las tres primeras.

| Capa | Dónde vive | Qué cubre | Qué no cubre |
|---|---|---|---|
| Instrucciones | `CLAUDE.md`, `AGENTS.md`, agentes | Criterio: cuándo preguntar y qué no tocar | Es contexto: el modelo puede olvidarla o ignorarla |
| Reglas de permisos y hooks | `settings.json`, `hooks/` | Lo aplica la herramienta, no el modelo, en orden `deny` > `ask` > `allow`. Un hook previo con código 2 bloquea; uno posterior sólo avisa, porque la herramienta ya corrió | Comparan texto: no saben qué hace un script ni casan con formas no literales |
| Clasificador de auto mode | Servicio de Anthropic; se activa con `defaultMode: auto` | Un modelo aparte revisa lo que las reglas no resolvieron. Por defecto frena, entre otros, `curl \| bash`, despliegues, migraciones, `force push`, destruir archivos previos y enviar datos sensibles fuera. También revisa a los subagentes | Es probabilístico. Por defecto permite leer `.env` y enviar credenciales a su API. La documentación avisa de que no garantiza seguridad |
| Sandbox | Sistema operativo; se activa con `/sandbox` | Limita qué escriben y a qué red llegan los comandos de shell, aunque el modelo se equivoque | Sólo shell: ni Read, ni Edit, ni WebFetch, ni hooks, ni MCP locales. Por defecto deja leer casi todo, `~/.ssh` incluido. **No existe en Windows nativo**: sólo macOS, Linux y WSL2 |

Nosotros trabajamos en Windows nativo, así que no tenemos sandbox. Si necesitas esa
capa, ejecuta Claude Code dentro de WSL2. Fuentes:
[modos de permisos](https://code.claude.com/docs/en/permission-modes) y
[sandbox](https://code.claude.com/docs/en/sandboxing).

**Activa la protección de rama en GitHub.** Es la única barrera de `main` que vive
fuera de tu máquina y que ningún agente salta con una forma rara del comando:

1. En tu repo: Settings → Rules → Rulesets → New ruleset → New branch ruleset.
2. Nombre `main`, Enforcement status `Active`, y en Target branches añade
   `Include default branch`.
3. Marca `Require a pull request before merging` con `Required approvals` en 0:
   trabajando solo no puedes aprobar tu propio PR. Deja marcado
   `Block force pushes`.

No hemos comprobado estos pasos en un repo privado ni qué planes los ofrecen ahí.

### Reglas: [`settings.json`](claude-code/settings.json)

- **`env`**: `CLAUDE_CODE_USE_POWERSHELL_TOOL=0` apaga la herramienta PowerShell,
  porque tiene sus propias reglas: las `Bash(...)` y el hook no la cubren. Según la
  documentación, en Windows con Git Bash un `deny` de Bash ya la apaga sin avisar;
  la variable deja la decisión escrita.
- **`deny`**: leer `.env`, claves y credenciales; `git push --force`,
  `git reset --hard`, `git clean`, `git branch -D`, `git` con `--output` (convierte
  una consulta en escritura), `rm -rf` con ruta absoluta o `~`; y la ejecución
  arbitraria de JS en Playwright.
- **`ask`**: `git push`, `gh pr create`, `gh pr merge` y `npm publish`. Añade los
  comandos de despliegue y migración de tu stack, también por nombre de script
  (`Bash(npm run deploy*)`): la sección "Autonomía" los exige y aquí no van,
  porque cambian con cada proyecto.
- **`allow`**: consultas de git y los scripts de tests, lint, tipos y build, para
  no aprobar cada llamada.
- **`defaultMode: auto`**: la autonomía real, y lo que enciende el clasificador. Sólo
  tiene efecto desde los ajustes de usuario o gestionados, por eso va en
  `~/.claude/`. Si tu sesión no puede usarlo, la documentación dice que arranca en
  Manual. En nuestras pruebas arrancó en `auto`.

### Hooks

- **`block-commit-on-main`** (antes de `git commit`): bloquea commits en `main` o
  `master` si el repo tiene remoto.
- **`check-encoding`** (después de editar): avisa si un archivo queda con BOM o
  bytes NUL, que rompen el diff de git.

Para ejecutar sus tests, sin dependencias:

```bash
node --test scripts/test-hook.test.js
```

### Límites que conviene conocer

- Un hook que expira no bloquea, salvo con `onFailure: block`, y los nuestros dejan
  pasar si reciben una entrada inesperada.
- `block-commit-on-main` lee el texto del comando, también entre comillas, así que
  mencionar un commit puede bloquear de más. Si antes del commit hay `switch`,
  `checkout`, `pushd`, `popd`, un `cd` en subshell, `GIT_DIR` o `--git-dir`, no
  puede saber el destino: bloquea y pide lanzarlo aparte. También bloquea si la ruta
  de `cd` o `-C` no existe, incluida una variable como `$REPO`, que no resuelve. No
  ve `merge`, `cherry-pick`, `revert`, scripts, alias de git ni formas no literales
  como `git "commit"`, una continuación con `\` o un `cd` sin argumentos. Los tests
  fijan los límites principales: si cambian, hay que actualizar este texto.
- Las reglas `Read(...)` cubren las herramientas de archivo y comandos reconocidos
  como `cat`. No frenan scripts ni lecturas que no nombren el archivo: `node -e` y
  `grep -r` pueden leer un `.env`. El sandbox tampoco lo arregla por defecto, porque
  deja leer casi todo; hay que restringirlo aparte.
- Las reglas de git sólo casan con la forma literal: `git -C . push`,
  `git -c a=b push` y `git 'push'` escapan de `deny` y de `ask`, y
  `git push origin main --force` escapa del `deny` y cae en `ask`.
- `allow` decide por el nombre del script, no por lo que hace: si tu `build` o tu
  `test` despliega o migra, pasa sin preguntar. Al entrar en auto, la documentación
  dice que se retiran las reglas de ejecución de gestores de paquetes; no hemos
  comprobado si eso incluye las de `npm run`.
- `reviewer` no tiene Edit ni Write, pero conserva Bash para ejecutar tests y su
  navegador guarda instantáneas en `.playwright-mcp/`. No editar el código es una
  instrucción, no una barrera. Añade esa carpeta al `.gitignore` de tus proyectos.
