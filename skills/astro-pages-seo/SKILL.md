---
name: astro-pages-seo
description: SEO técnico y vistas previas al compartir para un sitio Astro desplegado en GitHub Pages. Audita sobre dist/ con evidencia y propone el arreglo en Astro (sitemap, robots, metadatos, JSON-LD, imagen OG, caché, workflow, Search Console). Usar con Astro + GitHub Pages si piden "SEO", "sitemap", "vista previa en WhatsApp", "og:image", "Search Console".
---

# SEO y vistas previas: Astro en GitHub Pages

Receta para un stack concreto. Los **criterios** generales de SEO están en la
sección SEO de `web-quality-gate`; aquí está **cómo cumplirlos** en Astro servido
por GitHub Pages, y las trampas de ese stack. No repitas aquí lo que allí se juzga.

Primero audita, después propone. No añadas dependencias nuevas, no cambies la
configuración de Pages y no hagas push sin preguntar.

## Alcance

Antes de empezar, confirma con el repo, no con suposiciones:

1. **Stack**: `astro` en `package.json`, y `site` y `base` en `astro.config.*`. Si
   no es Astro o no se despliega en Pages, esta skill no aplica: usa
   `web-quality-gate`.
2. **Despliegue**: workflow propio en `.github/workflows/` con
   `actions/deploy-pages`, o despliegue desde una rama. Lo de abajo asume Actions.
3. **Dominio**: `usuario.github.io` (raíz), `usuario.github.io/repo` (con `base`) o
   dominio propio.
4. **Páginas**: cuáles son indexables y cuáles no (la 404, borradores).
5. **Identidad** para la imagen OG: logo, colores y tipografía del propio sitio.

## Cómo auditar

Mide lo que se construye y lo que se sirve. El código fuente sólo explica por qué
algo falla. Instalar las dependencias que el repo ya declara (`npm ci`) es parte de
construir; añadir dependencias nuevas, no.

```bash
npm ci
npm run build
```

Cada área acaba en `PASA`, `FALLA`, `NO APLICA` o `NO VERIFICADO`, con su evidencia:
la salida de un comando, una cabecera de `curl` o lo que muestra un validador. Un
área vale lo que su peor punto: si una parte queda `NO VERIFICADO` y el resto pasa,
el área es `NO VERIFICADO` y la nota dice qué parte falta.

**Página indexable** es todo HTML de `dist/` salvo los que llevan `noindex` y los
archivos de verificación (`google*.html`), que no son páginas. Revisa
cada uno, no sólo la portada. El HTML de Astro sale minificado en una línea, así que
cuenta con `grep -o ... | wc -l`, nunca con `grep -c`:

```bash
for f in $(find dist -name '*.html'); do
  echo "== $f"
  grep -o '<title>[^<]*</title>' "$f"
  grep -o '<link rel="canonical"[^>]*>' "$f"
  grep -o '<meta name="robots"[^>]*>' "$f"
  echo "h1: $(grep -o '<h1' "$f" | wc -l)"
done
grep -o '<meta [^>]*og:[^>]*>' dist/index.html
grep -o '<loc>[^<]*</loc>' dist/sitemap.xml
cat dist/robots.txt
```

Después compara con **producción**, que puede ir por detrás del repo:

```bash
curl -s https://usuario.github.io/ | grep -o '<meta [^>]*og:image"[^>]*>'
curl -sI https://usuario.github.io/
curl -sI http://usuario.github.io/
```

La primera línea debe coincidir con `dist/`. La segunda da la caché real. La
tercera debe responder `301` hacia `https`. Si producción difiere de `dist/`, juzga
`dist/` y añade una línea aparte: «producción sin desplegar», con la diferencia.
Eso no es un fallo de la receta, pero la persona tiene que saberlo antes de pedir
un nuevo rastreo a las redes.

## 1. `site` y `base`

- `site` en `astro.config.*` es la URL absoluta del sitio. Sin ella, Astro no puede
  generar URLs absolutas y fallan canonical, sitemap y `og:image`.
- Con el workflow de Pages, toma los dos valores de `actions/configure-pages`, así
  sirve el mismo build en raíz o bajo `/repo`:

  ```js
  export default defineConfig({
    site: process.env.SITE_URL ?? "https://usuario.github.io",
    base: process.env.BASE_PATH ?? "/",
  });
  ```

  En el workflow: `SITE_URL: ${{ steps.pages.outputs.origin }}` y
  `BASE_PATH: ${{ steps.pages.outputs.base_path }}`.
- Toda ruta interna respeta `base`. Un ayudante como
  `href(path)` = `BASE_URL` sin barra final + `/` + ruta evita barras dobles.

## 2. Sitemap y robots

- Con pocas páginas, una ruta propia basta y evita una dependencia:
  `src/pages/sitemap.xml.ts` y `src/pages/robots.txt.ts`, cada una con
  `export const GET: APIRoute` que devuelve el texto y su `Content-Type`. Propón
  `@astrojs/sitemap` sólo con muchas páginas o i18n, y pregunta antes de añadirla.
- El sitemap lista las mismas rutas que se generan: si una página se filtra al
  generarla, el sitemap usa el mismo filtro. Se comprueba comparando los `<loc>`
  con los HTML indexables de `dist/`: tienen que ser los mismos.
- URLs absolutas, construidas con `new URL(href(path), site)`.
- Sin `changefreq` ni `priority`: Google los ignora. `lastmod` sólo si es real y
  verificable; una fecha inventada o la del build no vale.
- La 404 y las páginas `noindex` fuera del sitemap.
- `robots.txt` permite el rastreo y apunta al sitemap con URL absoluta:

  ```text
  User-agent: *
  Allow: /

  Sitemap: https://usuario.github.io/sitemap.xml
  ```

## 3. Metadatos por página

Viven en el layout base, con valores por defecto y `props` por página:

- `<html lang>` correcto, `<title>` y `meta description` propios de cada página.
- Canonical absoluto: `new URL(Astro.url.pathname, Astro.site)`. Su barra final
  tiene que coincidir con la del sitemap y con la URL que se sirve de verdad, que
  depende de `trailingSlash` y `build.format` en `astro.config.*`. Compáralo en la
  salida del bucle de [Cómo auditar](#cómo-auditar).
- Una página `noindex` lleva `<meta name="robots" content="noindex">` y **no** lleva
  canonical: serían señales opuestas.
- Un solo `h1` por página. En una portada muy visual puede estar oculto
  visualmente, pero tiene que existir y describir la página.

## 4. Datos estructurados

- En la portada, un `<script type="application/ld+json">` con un `@graph` de
  `WebSite` y, si es un sitio personal, `Person` (u `Organization`).
- `url` y `@id` con la misma forma que el canonical, barra final incluida.
- `sameAs` sale del contenido que ya existe, por ejemplo la sección de contacto, no
  de una lista copiada a mano.
- Sólo datos que se ven en la página. Nada de valoraciones, precios o cargos
  inventados.
- En Astro: `<script is:inline type="application/ld+json" set:html={JSON.stringify(schema)} />`.

## 5. Imagen para compartir

- 1200 × 630, PNG o JPEG. Que pese poco: WhatsApp no muestra imágenes pesadas.
  Apunta a menos de 300 KB; ese límite lo observamos nosotros, no está documentado.
- **Impórtala desde `src/assets/`, no la pongas en `public/`.** Astro le añade un
  hash al nombre y cada versión nueva tiene otra URL, que es lo que rompe la caché
  (ver la sección 6). Del import salen también ancho, alto y formato:

  ```astro
  ---
  import share from "../assets/share.png";
  // `site` es obligatorio (sección 1); el ! se lo dice a TypeScript.
  const shareUrl = new URL(share.src, Astro.site!);
  ---
  <meta property="og:image" content={shareUrl} />
  <meta property="og:image:type" content={`image/${share.format}`} />
  <meta property="og:image:width" content={String(share.width)} />
  <meta property="og:image:height" content={String(share.height)} />
  <meta property="og:image:alt" content="Qué se ve en la imagen" />
  <meta name="twitter:card" content="summary_large_image" />
  ```

  Más `og:title`, `og:description`, `og:url` (el canonical), `og:type`,
  `og:site_name`, `og:locale`, `twitter:title`, `twitter:description` y
  `twitter:image`. Con una imagen JPEG, `share.format` vale `jpg`: escribe
  `image/jpeg` a mano, que es el tipo válido.
- Para comprobarlo: la URL de `og:image` en `dist/` lleva hash (`/_astro/share.XXXX.png`)
  y el archivo existe y pesa lo esperado:

  ```bash
  ls -l dist/_astro/ | grep -i share
  ```
- URL absoluta con `https`.
- Hazla con la identidad del sitio, no con una plantilla. Si se genera por código,
  que sea con un script reproducible en `scripts/` y una semilla fija para lo
  aleatorio, de modo que el mismo script dé siempre la misma imagen. Si el script
  necesita `sharp` u otra dependencia que el repo no tiene, pregunta antes.

## 6. Caché

- GitHub Pages no deja cambiar cabeceras: sirve `Cache-Control: max-age=600`.
  Compruébalo con `curl -sI`. La única forma de forzar contenido nuevo es cambiar la
  URL, de ahí el hash de la sección 5.
- Las redes guardan la vista previa por URL de **página**, no de imagen. Tras
  publicar, pide un nuevo rastreo:

  | Red | Herramienta |
  |---|---|
  | Facebook, y a veces WhatsApp | [Sharing Debugger](https://developers.facebook.com/tools/debug/), botón «Scrape Again» |
  | LinkedIn | [Post Inspector](https://www.linkedin.com/post-inspector/) |
  | X | No hay validador con vista previa: se ve en el redactor de un post, sin publicarlo |

  WhatsApp tiene su propia caché: que el Sharing Debugger la refresque no está
  garantizado. Si sigue mostrando la vieja, márcalo `NO VERIFICADO` en vez de
  insistir.

## 7. Workflow de Pages

- Despliegue por Actions: `configure-pages`, `upload-pages-artifact` con
  `path: dist` y `deploy-pages`, con permisos `pages: write` e `id-token: write`.
- Cada acción va en su última versión mayor estable; basta con fijar la mayor.
  Compruébala antes de cambiarla, porque envejece rápido y por eso esta skill no la
  fija. Con `gh` instalado, para `configure-pages`, `upload-pages-artifact` y
  `deploy-pages`:

  ```bash
  gh api repos/actions/<acción>/releases/latest --jq .tag_name
  ```

  Sin `gh`, en la página de releases de cada acción en GitHub.
- Con despliegue por Actions, GitHub no ejecuta Jekyll sobre tu build, así que
  `.nojekyll` sobra.
- `upload-pages-artifact` excluye por defecto los archivos que empiezan por punto.
  Si el sitio necesita alguno, como `.well-known/`, usa `include-hidden-files: true`.
- Una `404.astro` propia, marcada `noindex`.
- HTTPS forzado: lo activa la persona en **Settings → Pages → Enforce HTTPS**. La
  evidencia es el `301` de `curl -sI http://...` en [Cómo auditar](#cómo-auditar).

## 8. Search Console

Este paso lo hace la persona; explícalo así:

1. En [Search Console](https://search.google.com/search-console), **Añadir
   propiedad**.
2. Con un dominio `*.github.io` elige **Prefijo de URL**, no **Dominio**: la
   propiedad de dominio se verifica con un registro DNS, y `github.io` no es tuyo.
3. Verificación por **archivo HTML**: Google da un archivo `googleXXXX.html`. Va
   tal cual en `public/`, se despliega y luego se pulsa **Verificar**. La
   alternativa es la etiqueta `google-site-verification` en el layout.
4. Ya verificada: **Sitemaps** → escribe `sitemap.xml` → **Enviar**.

El archivo de verificación no es un secreto: es público por diseño.

## Veredicto

| Área | Estado | Evidencia | Arreglo |
|---|---|---|---|

Áreas: las 8 de arriba. Debajo, una línea:

- `BLOQUEA`: falta `site`, el sitemap o el canonical apuntan a otro dominio o a
  rutas sin `base`, una página que debería indexarse lleva `noindex`, o
  `robots.txt` bloquea el sitio.
- `PASA CON PENDIENTES`: sin bloqueos, con fallos menores o `NO VERIFICADO`;
  lístalos. Lo que depende de redes y de Search Console suele quedar aquí hasta
  después de publicar.
- `LISTA`: todo `PASA` o `NO APLICA`.

La auditoría informa. Los arreglos se proponen como cambios concretos por archivo y
se aplican cuando la persona lo pide.
