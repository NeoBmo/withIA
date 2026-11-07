---
name: web-quality-gate
description: Puerta de calidad de una web antes de cerrarla o publicarla, con evidencia. Cubre accesibilidad, rendimiento, SEO, seguridad, cookies y páginas legales. Usar al terminar una página o sitio público, o si piden "web quality", "launch check", "revisa SEO", "accesibilidad", "cookies" o "listo para publicar".
---

# Puerta de calidad web

Comprueba lo que normalmente se pide a mano. Verifica, no opina: cada criterio
acaba en un estado con su evidencia.

## Alcance

Antes de empezar, fija:

1. **Tipo**: web pública, app privada tras login, o pieza interna. En una app
   privada, SEO no aplica. En una pieza interna, sólo accesibilidad y seguridad.
2. **Qué se comprueba**: URL de producción o preview, o servidor local. Las
   cabeceras y el rendimiento de un servidor de desarrollo no valen como evidencia:
   márcalos `NO VERIFICADO`. Una preview configurada como producción sí vale.
3. **Datos que trata**: formularios, cuentas, analítica, pagos, terceros.
4. **Público y jurisdicción**: de ahí dependen cookies y legal. Si no consta,
   pregunta a la persona; no lo supongas.

Si el proyecto tiene sus propias reglas, mandan las suyas. Lo que aquí no aplique
se marca `NO APLICA` con el motivo. No añadas dependencias ni tooling para pasar
esta puerta.

## Criterios

Mide lo que se renderiza de verdad, no lo que pretende el código.

### Funcionamiento

- Estilos, scripts e imágenes cargan, con su tipo correcto; la consola no da errores.
- Cada formulario envía de verdad y los datos llegan a su destino.
- Los recorridos principales se completan de principio a fin.

### Accesibilidad (WCAG 2.2 AA)

- Cada página tiene `<title>` descriptivo y `lang` correcto en `<html>`.
- Contraste de texto 4.5:1; texto grande (18 pt, o 14 pt en negrita) 3:1.
- Todo funciona con teclado, en orden lógico y con foco visible.
- Objetivos de puntero de al menos 24 × 24 px CSS, salvo las excepciones de WCAG.
- En una ventana real de 320 px no hay scroll horizontal ni se pierde contenido; la
  emulación móvil sin `viewport` puede ocultar el fallo.
- Imágenes con `alt` útil, o vacío si son decorativas; controles con nombre
  accesible; formularios con `label` y errores asociados; un solo `h1` y jerarquía
  sin saltos.
- `prefers-reduced-motion` respetado.
- El foco no queda tapado (2.4.11), arrastrar tiene alternativa (2.5.7), no se piden
  dos veces los mismos datos (3.3.7) y el login no exige memorizar (3.3.8).

Un análisis automático no sustituye esta lista: sólo detecta parte de los fallos.

### Rendimiento

- Objetivo Core Web Vitals, percentil 75 con datos reales: LCP ≤ 2.5 s,
  INP ≤ 200 ms, CLS ≤ 0.1.
- Sin datos de campo, una medición de laboratorio es una **estimación**: dilo. INP
  necesita interacciones reales.
- Imágenes con dimensiones y tamaño adecuado; lo que no está en la primera vista,
  con carga diferida; fuentes y scripts de terceros justificados.

### SEO (web pública)

- `<title>` único y `meta description` propia en cada página indexable. No hay
  límite oficial de caracteres: lo que importa es que sean específicos, sin relleno.
- Un `h1` claro, HTTPS, URL legibles y `canonical` donde haga falta.
- `robots.txt` y `sitemap.xml` responden con contenido válido y **no bloquean
  producción**. Busca un
  `noindex` olvidado.
- Open Graph para compartir. Datos estructurados sólo si describen lo visible.
- Enlaces sin romper y una 404 que devuelve el código 404.

### Seguridad

- Sólo HTTPS. Secretos fuera del cliente y del repositorio.
- Dependencias sin vulnerabilidades altas o críticas: usa la auditoría del gestor
  del proyecto, como `npm audit`.
- Entradas validadas en el servidor; salidas escapadas; autorización comprobada en
  el servidor, no sólo en la interfaz.
- Cookies de sesión con `Secure`, `HttpOnly` y `SameSite`.
- Formularios públicos con protección contra abuso. Con sesión por cookie, CSRF.
- Errores sin detalles internos.
- `.env`, `.git`, código del servidor y archivos fuera de la raíz no son accesibles.
- Cabeceras en la respuesta real:

  | Cabecera | Valor |
  |---|---|
  | `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload`, sólo tras confirmar que todo sirve por HTTPS: un fallo de certificado deja la web inaccesible |
  | `Content-Security-Policy` | Política propia del sitio, con `frame-ancestors`; evita `unsafe-inline` si puedes |
  | `X-Content-Type-Options` | `nosniff` |
  | `Referrer-Policy` | `strict-origin-when-cross-origin` |
  | `Permissions-Policy` | Desactiva lo que no use, como `geolocation=(), camera=(), microphone=()` |
  | `X-Frame-Options` | `DENY`, si no lo cubre `frame-ancestors` |

  Retira `X-Powered-By` y el detalle de `Server`. No uses `X-XSS-Protection`.

Esta lista no es una auditoría de seguridad. En auth, pagos o datos sensibles, pide
además revisión independiente.

### Cookies

Inventaria primero lo que la web instala de verdad, propio y de terceros: usa un
perfil de navegador nuevo y comprueba que la URL es la correcta, porque el navegador
puede estar compartido y las cookies de `127.0.0.1` se comparten entre puertos.

- Si sólo hay cookies técnicas necesarias, puede bastar con informar. No añadas un
  banner que no hace falta.
- Con público en la UE, las cookies no esenciales **no se instalan antes del
  consentimiento**. Comprueba en la primera carga que analítica y publicidad no se
  disparan, y que tras rechazar siguen sin dispararse.
- Rechazar debe ser una opción real, y el consentimiento debe poder retirarse sin
  perjuicio.
- Existe un aviso que lista cookies, finalidad, duración y terceros.
- En otra jurisdicción, comprueba su norma vigente. Si depende de una interpretación
  jurídica, márcalo `NO VERIFICADO` y deja la pregunta a una persona competente.

### Páginas legales

- Enlazadas desde el pie de todas las páginas: privacidad y aviso de cookies, si aplican; términos si
  hay cuentas, compras o contenido de usuarios.
- Política de privacidad acorde con lo que se trata: quién es el responsable, qué
  datos, para qué, con quién se comparten, y cómo ejercer los derechos.
- En Colombia, revisa la Ley 1581 de 2012; en la UE, el RGPD.
- Formularios con el aviso o consentimiento que corresponda.

**Nunca inventes datos legales**: razón social, identificación fiscal, dirección o
contacto salen de la persona; si faltan, deja `[POR COMPLETAR]`. Un texto generado
es un **borrador**: márcalo así y nunca lo des por válido. Lo debe revisar una
persona competente.

## Cómo verificar

Usa lo que ya exista: tests del proyecto, navegador real, herramientas de
desarrollo y `curl -I` para cabeceras. Lighthouse y axe son opcionales: si el
proyecto no los tiene, usa el panel del navegador o pásalos por la puerta de
admisión con versión fijada.

Una afirmación sin ejecutar no cuenta. Lo que no puedas comprobar queda
`NO VERIFICADO`, nunca `PASA`.

## Veredicto

Devuelve una tabla breve, sólo con lo relevante:

| Área | Estado | Evidencia | Arreglo |
|---|---|---|---|

Estados: `PASA`, `FALLA`, `NO APLICA`, `NO VERIFICADO`.

- `BLOQUEA`: algún `FALLA` en funcionamiento principal, contraste, teclado o foco,
  secretos, exposición de archivos, autorización, dependencias críticas, `noindex`
  en producción, cookies antes del consentimiento donde la norma lo exija, o una
  política legal ausente o que no coincide con lo que la web trata.
- `PASA CON PENDIENTES`: sin bloqueos, con fallos menores o criterios
  `NO VERIFICADO`; lístalos.
- `LISTA`: todo `PASA` o `NO APLICA`, y los textos legales revisados por una
  persona. Antes de publicar, INP y los datos de campo pueden quedar
  `NO VERIFICADO`: se miden después del lanzamiento.

La puerta informa; no arregla sin que se lo pidan. Quien publica decide.
