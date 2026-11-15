---
name: readme-craft
description: Escribe o audita el README de un repo para que tenga identidad y voz propias, no una plantilla. Puntúa con una rúbrica, crea un banner SVG con modo claro y oscuro, y marca con TODO lo que no puede verificar. Usar al crear o rehacer un README, o si piden "readme", "audita el readme", "que no sea plano", "write a README", "review this README".
---

# README con carácter

Un README es la portada del proyecto: decide en segundos si alguien sigue leyendo.
Esta skill hace dos cosas con la misma rúbrica:

- **Crear**: escribe un README nuevo o rehace uno existente.
- **Auditar**: puntúa un README existente y propone arreglos, sin editar nada.

Si no está claro cuál de las dos se pide, pregunta.

## Qué buscamos

1. **Convence en 5 segundos.** Arriba, antes de cualquier instalación, van la
   identidad, una frase con voz propia y una prueba visual: captura, GIF o diagrama.
2. **Identidad del proyecto, no de una plantilla.** Colores, tono y vocabulario
   salen del propio proyecto.
3. **Se lee en capas.** Primero qué es y por qué existe, después cómo se usa. El
   detalle va en `<details>` o en otro archivo enlazado.
4. **No inventa nada.** Lo que no se pueda verificar en el repo queda como
   `<!-- TODO: ... -->`.
5. **Funciona en GitHub tal cual**, en tema claro, en tema oscuro y en móvil.
6. **Se adapta al tipo de proyecto.** Ver [Por tipo de proyecto](#por-tipo-de-proyecto).

**Vetado**, porque es el sello del README genérico de IA:

- Un emoji delante de cada título, o encabezados como "🚀 Features" y "✨ Highlights".
- Muros de badges. Un badge sólo entra si informa algo que cambia: CI, versión o
  licencia.
- Frases vacías: "una herramienta potente", "fácil de usar", "moderna", "X es una
  solución que permite...".
- Secciones vacías o de relleno: "Contributing" sin proceso real, "Roadmap" sin
  planes, "License" repetida cuando ya existe el archivo.
- Una tabla de contenidos en un README que cabe en dos pantallas.

## Alcance

Antes de escribir o auditar, fija:

1. **Tipo de proyecto**: web o app, portafolio o sitio personal, librería o CLI,
   metodología o documentación, experimento o aprendizaje.
2. **Público**: quién llega al repo y qué viene a buscar (usarlo, contratarte,
   aprender o contribuir).
3. **Idioma**: el que ya usa el repo. Si es nuevo o está mezclado, pregunta.
4. **Identidad**: búscala en el propio proyecto, en este orden: logo o assets,
   tokens de color (variables CSS, configuración de Tailwind, tema), tipografía, el
   tono de la web o la app, y el nombre mismo. Si no hay nada, propón una dirección
   en dos líneas y pregunta antes de dibujar.

Un tipo híbrido toma lo de arriba de su uso principal y añade lo que no puede faltar
de los dos. Escribe el alcance en dos o tres líneas al inicio de tu respuesta, para
que la persona pueda corregirlo.

Si el proyecto tiene sus propias reglas de documentación, mandan las suyas.

## Lo que GitHub renderiza

GitHub limpia el HTML del README y descarta, entre otras cosas, `<style>`,
`<script>` y la mayoría de atributos de estilo. No cuentes con CSS en el README: la
creatividad va por estas vías.

| Recurso | Para qué |
|---|---|
| Imagen SVG propia en `<img>` | Banner o ilustración. Dentro del archivo SVG sí hay CSS, media queries y animación |
| `<picture>` con `<source media="(prefers-color-scheme: dark)">` | Dos imágenes, una por tema, cuando un solo SVG no basta |
| `<p align="center">` | Centrar el banner o la demo |
| Alertas `> [!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]`, `[!CAUTION]` | Lo que no se puede pasar por alto. Como mucho, una o dos por README |
| `<details><summary>` | Detalle plegado: opciones avanzadas, FAQ, logs |
| Bloques `mermaid` | Un flujo o una arquitectura que en un párrafo no se entiende |
| Tablas | Comparar opciones o elegir por dónde entrar |

## Banner SVG

Un archivo, `assets/banner.svg` salvo que el repo ya use otra carpeta. Reglas:

- `viewBox` ancho, del orden de 1280 × 320 a 420, y `width="100%"` en el `<img>`
  del README.
- Accesible: lo que lee un lector de pantalla es el `alt` del `<img>`, así que
  describe la escena, no "banner". `role="img"`, `<title>` y `<desc>` dentro del SVG
  sirven cuando alguien abre el archivo suelto.
- Colores en variables CSS dentro del SVG, sacados de los tokens del proyecto, y un
  `@media (prefers-color-scheme: dark)` que los redefina. Ese media query sigue el
  tema del navegador o del sistema, que puede no coincidir con el tema elegido en
  GitHub: pruébalo cambiando el del sistema. Si el banner tiene que seguir el de
  GitHub, usa `<picture>` con dos archivos y compruébalo en el render.
- Sin fuentes web ni recursos externos: un SVG usado como imagen no los carga. Usa
  pilas de fuentes del sistema, o convierte a trazos el texto que tenga que verse
  exacto.
- Si anima, cada animación comunica algo, mueve sólo `transform` y `opacity`, y se
  apaga con `@media (prefers-reduced-motion: reduce)` dentro del SVG.
- Ligero: que pese decenas de KB, no cientos. Sin imágenes rasterizadas incrustadas
  en base64.
- El texto del banner no sustituye al `# Título` del README, que sigue existiendo
  para lectores de pantalla y buscadores.

Un dibujo hecho a mano en SVG es un borrador: enséñalo y deja que la persona decida.

## Por tipo de proyecto

| Tipo | Lo que va arriba | Lo que no puede faltar |
|---|---|---|
| Web o app | Captura o GIF de la pantalla principal y el enlace en vivo | Cómo arrancarla en local y, si las usa, qué variables de entorno necesita, sin sus valores |
| Portafolio o sitio personal | La web en vivo y una captura que transmita su carácter | Quién está detrás y cómo arrancarla en local |
| Librería o CLI | El ejemplo más corto que funciona, con su salida | Instalación, la API mínima y la versión que soporta |
| Metodología o documentación | Para quién es y para quién no | Por dónde entrar según lo que busques |
| Experimento o aprendizaje | Qué se quería aprender y qué salió | El estado real, sin vender un producto |

## Lectura del repo

Vale igual para crear que para auditar. Lee el README actual, el manifiesto
(`package.json` o equivalente), los scripts, el árbol de carpetas, los assets y, si
hay web, la web. Si es un repo git, mira también los últimos commits; si no lo es,
dilo y sigue. Anota lo que es verificable y de dónde sale: con eso se juzga
**Veracidad**.

## Crear

1. **Lee el repo** con [Lectura del repo](#lectura-del-repo).
2. **Fija el alcance** con [Alcance](#alcance).
3. **Escribe el gancho**: una frase que diga qué es y por qué importa, en la voz
   del proyecto. Escribe tres versiones y quédate con la más concreta.
4. **Consigue la prueba visual.** Si es una web, haz la captura en un navegador
   real. Si no se puede, deja `<!-- TODO: captura de ... -->` en su sitio.
5. **Escribe el cuerpo** en capas, con el patrón de su tipo.
6. **Dibuja el banner** con [Banner SVG](#banner-svg).
7. **Audítalo tú** con la rúbrica. Si alguna nota es 0, arréglalo antes de
   entregar.
8. **Comprueba el render.** Sin verlo en GitHub, en tema claro y oscuro y a menos
   de 768 px, queda `NO VERIFICADO`. Subir una rama para verlo es un push: pide
   permiso.

Nunca inventes métricas, usuarios, testimonios, capturas ni funciones que el código
no tiene. Nada de secretos ni datos personales que no estén ya publicados por la
persona.

## Auditar

Fija el [Alcance](#alcance) y haz la [Lectura del repo](#lectura-del-repo). Después
puntúa cada criterio de 0 a 2 con evidencia: una cita del README, un archivo del
repo o lo que se ve en el render. Una nota sin evidencia no cuenta. Un 2 en un
criterio de juicio, como **Voz** o **Capas**, lleva al menos dos citas y una frase
que diga por qué no es un 1.

**Primera pantalla** es lo que se ve sin hacer scroll en una ventana de escritorio.
Sin render, toma como referencia las primeras 15 líneas del archivo, y dilo.

Si al repo le falta identidad visual, **Identidad** puede ser 0 aunque no sea culpa
del README. El arreglo es proponer una dirección en dos líneas, no dibujarla. Ese 0
impide `CON CARÁCTER`: dilo en el informe.

| Criterio | 0 | 1 | 2 |
|---|---|---|---|
| **Primera impresión** | Empieza por instalación, badges o un título sin más | Dice qué es, pero sin prueba visual o sin gancho | Identidad, gancho y prueba visual en la primera pantalla |
| **Identidad** | Podría ser de cualquier repo | Algún rasgo propio, como un logo o un color | Colores, tono y recursos salen del proyecto y se reconocen |
| **Voz** | Frases vacías o de plantilla | Correcta pero neutra | Se oye a alguien concreto, con frases específicas |
| **Capas** | Muro de texto o todo al mismo nivel | Orden razonable, pero el detalle tapa lo esencial | Lo esencial primero; el detalle plegado o enlazado |
| **Veracidad** | Afirma algo que el repo contradice o no sostiene, incluido un listado (estructura, comandos, funciones) que se presenta como completo y omite partes clave | Sin falsedades, pero con datos clave ausentes y sin `TODO` | Todo se sostiene en el repo, y lo que falta está marcado |
| **Render** | Roto en algún tema, imágenes caídas o scroll horizontal en móvil | Se ve bien, con algún detalle: contraste en oscuro, `alt` vacío | Correcto en claro, oscuro y móvil, con `alt` útiles |

**Vetados.** Cada tipo de elemento vetado presente resta 1 punto, cuente las veces
que cuente: tres secciones vacías restan 1. Un vetado ya castigado con un 0 en su
criterio no resta otra vez; por ejemplo, las frases vacías que dejan **Voz** en 0.
La resta máxima es 3, y el total no baja de 0.

## Veredicto

Devuelve una tabla breve:

| Criterio | Nota | Evidencia | Arreglo |
|---|---|---|---|

Debajo, el total y el veredicto. Calcula en este orden:

1. Suma las notas. Si **Render** es `NO VERIFICADO`, no suma y el total es sobre 10.
2. Resta los vetados.
3. Aplica la primera regla que se cumpla:

| Veredicto | Sobre 12 | Sobre 10 |
|---|---|---|
| `BLOQUEA` | Un 0 en **Veracidad**, sea cual sea el total. Un README que engaña se arregla antes que cualquier otra cosa | Igual |
| `PLANO` | 0 a 5 | 0 a 4 |
| `CORRECTO` | 6 a 9, o más con algún 0 | 5 a 7, o más con algún 0 |
| `CON CARÁCTER` | 10 a 12, sin ningún 0 | 8 a 10, sin ningún 0 |

Los cortes sobre 10 son una aproximación de los de 12. Un `CON CARÁCTER` sobre 10 no
ha visto el render: dilo junto al total, por ejemplo "8/10, render sin verificar".
`BLOQUEA` muestra el total igualmente.

Al auditar, la skill informa y propone; no reescribe sin que se lo pidan.
