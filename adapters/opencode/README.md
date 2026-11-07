# Adaptador para OpenCode

Lo mínimo para que OpenCode V2 trabaje con las mismas barreras que Claude Code.
Probado con OpenCode v2.1.4 en Windows 11. En macOS y Linux no se ha probado.

| Archivo | Qué hace | Destino |
|---|---|---|
| `rules.md` | Reglas de modelos gratuitos y revisión cruzada | Tus instrucciones globales (`AGENTS.md`) |
| `plugins/guard.js` | Bloquea el commit en `main` o `master` con remoto y oculta las skills de `~/.claude/skills/synced` | `~/.config/opencode/plugins/` |
| `permissions.jsonc` | Pide confirmación en push, PR, merge, publicación y despliegue | Al final de `permissions` en `opencode.jsonc` |
| `scripts/check-free-models.mjs` | Comprueba coste 0, estado `active` y variante de cada modelo de tu configuración | `~/.config/opencode/scripts/` |

## Instalar

El plugin no necesita dependencias. Desde la raíz del repo, en PowerShell:

```powershell
New-Item -ItemType Directory -Force "$HOME/.config/opencode/plugins", "$HOME/.config/opencode/scripts"
```

```powershell
Copy-Item adapters/opencode/plugins/guard.js "$HOME/.config/opencode/plugins/"
```

```powershell
Copy-Item adapters/opencode/scripts/check-free-models.mjs "$HOME/.config/opencode/scripts/"
```

Pega las reglas de `permissions.jsonc` al final de `permissions` y recarga:

```powershell
opencode reload
```

Comprueba que el plugin cargó y que tus modelos siguen siendo gratuitos:

```powershell
opencode plugin list
```

```powershell
node "$HOME/.config/opencode/scripts/check-free-models.mjs"
```

## De dónde sale el coste

`opencode models` sólo imprime IDs. El dato real está en `opencode api model.list`,
que devuelve `cost`, `status` y `variants` de cada modelo. El script lee ese catálogo,
busca los IDs `opencode/...` en tu configuración y sale con error si uno falla. Es lo
que OpenCode declara, no una factura: no prueba lo que cobra el proveedor.

## Qué se probó y qué no

Con `opencode run --agent implementer`, un modelo gratuito real y un repo desechable:

| Prueba | Resultado |
|---|---|
| Commit en `main` con remoto | Bloqueado por el plugin; el agente recibe el motivo |
| Commit en una rama de tarea | Pasa |
| `git push`, también tras `&&` | Regla `ask`; sin consola interactiva se rechaza |
| `gh pr create`, `gh pr merge`, `npm publish` | Regla `ask` |
| `vercel --prod`, `supabase db push` | Regla `ask` |

**Sin probar:** el diálogo de confirmación en la interfaz interactiva. Sólo se vio la
regla `ask` en `opencode run`, que la rechaza por no poder preguntar.

## Límites conocidos

- **`--auto` se salta las reglas `ask`.** `opencode run --auto` hizo un push real al
  remoto de prueba. Sólo respeta los `deny`, y el commit en `main` sigue bloqueado
  porque lo frena el plugin. Si usas `--auto`, tú aceptas el push.
- **Son barreras de texto.** Un `git push` dentro de un script o de `powershell -c`
  no coincide con la regla. La barrera real es la protección de rama en el remoto.
- **El bloqueo cubre sólo el commit.** Un merge o un rebase sobre `main` no se detiene.
- **El bloqueo del commit no está documentado.** La documentación no dice que lanzar
  un error en `create.before` cancele el comando; se comprobó probándolo. Tras
  actualizar OpenCode, repite la prueba del commit.
