---
name: slow-network-check
description: Mide cómo carga una web con red móvil lenta (4G lento, 3G rápido y lento) con capturas por segundo, FCP, LCP y peso, y compara antes y después. Usa un script propio sin dependencias. Usar si piden "red lenta", "3G", "carga lenta en móvil", "qué se ve al cargar", "slow network", "throttling".
---

# Prueba de red lenta

Responde a una pregunta concreta: **qué ve alguien con un móvil y mala señal, y
cuándo lo ve**. Un Lighthouse en la red de casa no lo muestra.

El script [slow-network.mjs](slow-network.mjs) abre un Chrome sin cabeza con un
perfil limpio, sin caché, sin extensiones y en tamaño móvil. Limita la red con los
perfiles de Chrome DevTools, hace capturas en segundos fijos y lee las métricas del
Performance API.

Es una medición de laboratorio, así que es una **estimación**. El criterio de
aprobado vive en la sección Rendimiento de `web-quality-gate`, y esta skill no lo
sustituye: aporta la evidencia.

## Requisitos

- Node 22 o superior, por el `WebSocket` nativo. El script avisa si falta.
- Un Chrome o Chromium. Primero busca el que instala Playwright y después las rutas
  habituales de Chrome. Si no encuentra ninguno, pide la ruta. Instalar un navegador
  es instalar una herramienta externa: pregunta antes.
- No añade dependencias al proyecto medido ni toca sus archivos.

## Alcance

Antes de medir, fija:

1. **Qué URL** se mide: casi siempre la portada y la página que más se comparte.
2. **Qué servidor.** Producción, o un servidor local que sirva el build como
   producción. Un servidor de desarrollo no vale: no minifica y añade scripts
   propios. Comprueba la compresión del servidor en vez de suponerla:
   `curl -sI -H 'Accept-Encoding: gzip, br' <url>` debe mostrar `Content-Encoding`.
3. **Qué perfiles.** Por defecto se usan los tres. `slow-3g` es el caso extremo: si
   sólo hay tiempo para uno, usa `slow-4g`.
4. **Qué objetivo.** Por ejemplo: «en `slow-4g`, el contenido principal se ve antes
   de 3 s». Decídelo con la persona. Esta skill no inventa umbrales.

## Cómo medir

Comprueba primero la red base, sin limitar nada:

```bash
curl -s -o /dev/null -w 'total=%{time_total}\n' <url>
```

Si sale más de 1 s, la red de esta máquina contamina la medida, porque la limitación
se suma encima. Dilo en el informe o mide desde otra red.

Después, ejecuta el script desde la carpeta de la skill o con su ruta completa:

```bash
node slow-network.mjs https://ejemplo.com/ --out ./slow-network-out
```

| Opción | Por defecto | Para qué |
|---|---|---|
| `--profiles` | `slow-4g,fast-3g,slow-3g` | Perfiles de red, separados por comas |
| `--size` | `412x915` | Ventana. Por debajo de 768 de ancho emula un móvil |
| `--cpu` | `1` | Ralentiza la CPU N veces; `4` se parece a un móvil de gama media |
| `--shots` | `1,2,3,5,8,12` | Segundos en que se hace una captura |
| `--runs` | `1` | Repeticiones; la tabla muestra la mediana |
| `--timeout` | `60` | Segundos máximos de espera al evento `load` |
| `--out` | `slow-network-out` | Carpeta de las capturas y de `report.json` |
| `--chrome` | variable `CHROME` | Ruta del ejecutable, si no lo encuentra solo |

- Cada combinación de URL, perfil y repetición tarda entre 15 s y más de un minuto.
  Si son muchas, ejecútalo en segundo plano.
- La carpeta `--out` no debe acabar en el repo medido: usa una temporal o añádela a
  `.gitignore`.
- En Git Bash, una ruta que empieza por `/` en `--chrome` o `--out` se convierte en
  ruta de Windows. Si da problemas, antepón `MSYS_NO_PATHCONV=1`.

## Leer el resultado

El script imprime una tabla en Markdown y guarda capturas y `report.json`, con cada
recurso, su tamaño y el momento en que terminó de llegar.

| Columna | Qué es |
|---|---|
| FCP | Primer texto o imagen en pantalla |
| LCP | Último candidato a elemento más grande. `—` significa que Chrome no dio ninguno; pasa con contenido pintado en un `canvas` |
| DOM listo | Fin de `DOMContentLoaded` |
| Load | Fin del evento `load`. `—` significa que no llegó dentro de `--timeout` |
| Peticiones, KB | Recursos transferidos y su peso comprimido. Un recurso de otro origen sin `Timing-Allow-Origin` cuenta 0 bytes: con terceros, el peso real es mayor |

- **Mira las capturas con tus ojos.** Los números no dicen si a los 3 s se ve la
  página o un fondo vacío. Describe qué hay en cada segundo.
- Un FCP posterior al `load` es posible: la página pinta con JavaScript después de
  cargar. Las capturas dicen cuál de los dos importa.
- **No hay TTFB.** Con la red emulada por CDP, el `responseStart` del documento no
  incluye la latencia simulada. En una prueba salió 0,1 s con 2 s de latencia, así
  que se quitó.
- Las capturas se guardan sólo de la primera repetición. Si una no llega, el script
  lo avisa: la página aún no había pintado.
- Una sola pasada tiene ruido. Para decidir, usa `--runs 3`.

## Qué suele arreglarlo

Con `slow-3g`, cada ida y vuelta cuesta 2 s, así que manda **la latencia**, no el
peso. En `report.json`, busca cadenas de peticiones: HTML, luego CSS, luego fuente
o imagen. Cada eslabón suma una ida y vuelta.

| Lo que ves | Arreglo típico |
|---|---|
| Pantalla vacía hasta que llega el CSS | CSS crítico en línea. En Astro, `build.inlineStylesheets: "always"` |
| El texto espera a la fuente | `<link rel="preload">` de la fuente y `font-display: swap` |
| La imagen principal llega la última | `preload` o `fetchpriority="high"` en esa imagen, y sin `loading="lazy"` |
| Mucho peso en `slow-4g` | Imágenes en el tamaño en que se muestran, fuentes recortadas, JS que no hace falta al inicio |

Cada arreglo se valida midiendo, no por intuición.

## Comparar antes y después

Pasa las dos URL en la misma llamada, con el mismo servidor, perfil, máquina y
repeticiones:

```bash
node slow-network.mjs http://localhost:4321/ https://ejemplo.com/ --profiles slow-3g --runs 3
```

Si el antes y el después están en servidores distintos, la comparación no vale:
compila las dos versiones y sírvelas igual.

## Informe

Devuelve:

1. El alcance: URL, servidor, perfiles, `--cpu`, repeticiones y la red base del
   `curl`.
2. La tabla del script.
3. Qué se ve en cada captura clave, por ejemplo: «a 3 s, sólo el fondo; a 5 s, el
   título».
4. El veredicto frente al objetivo acordado: `CUMPLE`, `NO CUMPLE` o
   `NO VERIFICADO`, marcado como estimación de laboratorio.
5. Los arreglos propuestos, con su evidencia en `report.json`.

La skill mide y propone; no cambia el proyecto sin que se lo pidan.
