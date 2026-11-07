# Adaptadores: instalación y portabilidad

Instalas una vez, a nivel de usuario, y abres cualquier proyecto sin configurar
nada. Esta página cubre Claude Code; los demás agentes están en
[other-agents.md](other-agents.md). El estado de prueba vive en
[Qué está probado](#qué-está-probado).

Nada se instala por defecto de MCP ni plugins: [tools.md](../tools.md) los deja
como opción, y ninguno es necesario para el flujo.

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

Estado: **parcial**. Este paquete sólo se ha cargado a nivel de proyecto, nunca
instalado en `~/.claude`, y tampoco es la configuración que usamos a diario: la
nuestra sigue siendo un único documento privado, sin partir.

| Ejecutado en Windows 11 con Git Bash | Sin probar |
|---|---|
| `claude -p` (2.1.310) con el paquete a nivel de proyecto, en una carpeta temporal: cargan `CLAUDE.md`, `@AGENTS.md`, `@PROFILE.md` y los tres agentes | Lo mismo instalado en `~/.claude` |
| `$HOME` se resuelve en los hooks, con la versión anterior del repo | Las skills en sesión: ese `claude -p` mostró las de `~/.claude/skills`, que tienen los mismos nombres, así que no las prueba |
| Los `cp` de [Instalar](#instalar) dejan los 13 archivos en su sitio con un `HOME` vacío, desde una copia local: archivos, no una sesión | `git clone` real |
| `block-commit-on-main`, lanzado a mano contra repos desechables: 57 casos | El mismo hook dentro de una sesión y las cinco comprobaciones de [Comprobar](#comprobar) |
| | Las reglas de `settings.json` dentro de una sesión, `CLAUDE_CODE_USE_POWERSHELL_TOOL` incluida |
| | macOS y Linux |

Por eso no prometemos un tiempo de instalación: aún no lo hemos cronometrado.

## Barreras

| Capa | Dónde vive | Para qué |
|---|---|---|
| Instrucción | `CLAUDE.md`, `AGENTS.md` | Criterio y cuándo preguntar. Es contexto: el modelo puede olvidarla |
| Permiso | `settings.json` | Lo aplica la herramienta, en orden `deny` > `ask` > `allow` |
| Hook | `settings.json` y `hooks/` | Script que corre antes o después de una herramienta. Con código 2, uno previo bloquea; uno posterior sólo avisa al agente, porque la herramienta ya corrió |

En [`settings.json`](claude-code/settings.json):

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
- **`defaultMode: auto`**: la autonomía real. Sólo tiene efecto desde los ajustes
  de usuario o gestionados, por eso va en `~/.claude/`. Puede no estar disponible
  en todo plan o versión. Según la documentación, la sesión arranca entonces en
  Manual; no lo hemos probado: mira en tu primera sesión si te pide confirmar lo
  rutinario.

Hooks:

- **`block-commit-on-main`** (antes de `git commit`): bloquea commits en `main` o
  `master` si el repo tiene remoto.
- **`check-encoding`** (después de editar): avisa si un archivo queda con BOM o
  bytes NUL, que rompen el diff de git.

Ninguna capa es una barrera total. Límites que conviene conocer:

- Un hook que expira no bloquea, salvo con `onFailure: block`, y el nuestro deja
  pasar si recibe una entrada inesperada.
- `block-commit-on-main` lee el texto del comando, también entre comillas, así que
  mencionar un commit puede bloquear de más. Si antes del commit hay `switch`,
  `checkout`, `pushd`, `popd`, un `cd` en subshell, `GIT_DIR` o `--git-dir`, no
  puede saber el destino: bloquea y pide lanzarlo aparte. También bloquea si la ruta
  de `cd` o `-C` no existe. No ve `merge`, `cherry-pick`, `revert`, scripts, alias
  de git ni formas no literales como `git "commit"`, una continuación con `\` o un
  `cd` sin argumentos. **La barrera real de `main` es la protección de rama en el
  remoto: actívala** (en GitHub, Settings → Rules → Rulesets).
- Las reglas `Read(...)` cubren las herramientas de archivo y comandos reconocidos
  como `cat`. No frenan scripts ni lecturas que no nombren el archivo, como
  `grep -r`: para eso hace falta el sandbox.
- Las reglas de git sólo casan con la forma literal: `git -C . push`,
  `git -c a=b push` y `git 'push'` escapan de `deny` y de `ask`, y
  `git push origin main --force` escapa del `deny` y cae en `ask`.
- `allow` decide por el nombre del script, no por lo que hace: si tu `build` o tu
  `test` despliega o migra, pasa sin preguntar. Al entrar en auto, la documentación
  dice que se retiran las reglas de ejecución de gestores de paquetes; no hemos
  comprobado si eso incluye las de `npm run`.
- `reviewer` conserva Bash para ejecutar tests, así que no editar es una
  instrucción, no una barrera.
