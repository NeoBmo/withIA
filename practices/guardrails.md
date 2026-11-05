# Barreras duras: permisos y hooks

Escribir en el `CLAUDE.md` "nunca hagas commit en main" funciona casi siempre.
*Casi* no basta para lo que no se puede deshacer. Por eso separo dos capas:

| Capa | Dónde vive | Para qué |
|---|---|---|
| Instrucciones | `CLAUDE.md` | Criterio, estilo, cuándo preguntar |
| Barreras duras | `settings.json` (permisos) y hooks | Lo que no debe pasar nunca, aunque el modelo lo olvide |

El modelo puede olvidar una instrucción; no puede saltarse un permiso denegado.

## Permisos

En [adapters/claude-code/settings.json](../adapters/claude-code/settings.json):

- **`deny`**: leer `.env`, claves, credenciales; `git push --force`,
  `git reset --hard`, `git clean`; la ejecución arbitraria de JS en Playwright.
- **`ask`**: `git push`, `npm publish`, migraciones de base de datos y deploy a
  producción. Salen de mi máquina, así que los apruebo yo.
- **`allow`**: lo de sólo lectura y los tests, para no aprobar cada llamada.

## Hooks

Un hook es un script que Claude Code ejecuta antes o después de usar una
herramienta. Si sale con código 2, bloquea la acción y le explica el motivo al
modelo.

- **`block-commit-on-main`** (antes de `git commit`): bloquea commits en
  `main`/`master` cuando el repo tiene remoto. Fuerza una rama por tarea.
- **`check-encoding`** (después de editar): avisa si un archivo quedó con BOM o
  bytes NUL, algo típico al escribir desde PowerShell en Windows que rompe el
  diff de git.
