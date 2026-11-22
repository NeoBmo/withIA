---
name: legal-compliance
description: Revisa lo legal de una web o app. Usar al crear o revisar textos legales, formularios con datos personales, registro de usuarios, cookies, correos comerciales o cobranza, o al reutilizar logos, imágenes, fuentes o código ajenos. No es asesoría legal ni sustituye a un abogado.
---

# Cumplimiento legal

Dice qué exige la norma a una web o app y comprueba si está. Informa, no asesora:
no es asesoría legal ni sustituye a un abogado.

Las normas, con artículo y URL oficial, están en [sources.md](sources.md). Lee su
cabecera antes de citar: si la fecha de «Revisar antes de» ya pasó, avísalo a la
persona y vuelve a verificar en la fuente cada norma que vayas a citar.

## Alcance

Antes de revisar, fija:

1. **Qué trata**: formularios, cuentas, pagos, analítica, correos comerciales,
   cobranza, menores, terceros que reciben datos, y material ajeno.
2. **Jurisdicción**: dónde está el responsable y a quién se dirige. Si no consta,
   pregunta; no lo supongas.
3. **Qué se revisa**: la web en marcha, el código o un texto suelto.

El RGPD no se aplica por recibir visitas desde Europa. A quien está fuera de la UE
se le aplica si ofrece bienes o servicios a personas en la UE o monitoriza su
comportamiento allí (art. 3.2, `UE-1`). En la UE, las directivas rigen por leyes
nacionales: pregunta en qué países está el público.

Lo que no aplique se marca `NO APLICA` con el motivo.

## Niveles

Cada punto lleva uno:

| Nivel | Significa |
|---|---|
| `OBLIGACIÓN` | La exige una norma a quien hace esa actividad en esa jurisdicción. Cita norma, artículo y fila de sources.md |
| `DEPENDE DEL CASO` | Obliga sólo si se cumple una condición: escríbela (umbral, tamaño, sector, entidad pública) |
| `BUENA PRÁCTICA` | Inferencia razonable o guía no vinculante. Nunca se presenta como obligación |

Lo que sources.md lista en «Por verificar» no es obligación: dilo así y deja la
pregunta a una persona competente.

## Temas

Revisa sólo los que active el alcance. Entre paréntesis, las filas de sources.md.

- **Política de privacidad y aviso**: responsable y contacto, qué datos, para qué,
  con qué base, a quién se envían, cuánto se guardan y cómo ejercer los derechos.
  Enlazada desde el pie y desde cada formulario (`CO-1`, `CO-15`, `UE-2`, `UE-3`,
  `US-1`).
- **Términos y condiciones**: si hay cuentas, compras o contenido de usuarios.
  Identidad del proveedor, precio total, desistimiento o retracto, sin cláusulas
  abusivas, y descargables (`CO-8`, `CO-9`, `UE-14`, `UE-15`, `US-12`, `US-13`).
- **Consentimiento**: acción afirmativa y casilla sin marcar. La casilla de
  marketing va aparte de la de aceptar términos, y aceptar términos no obliga a
  recibir publicidad (`CO-2`, `CO-3`, `UE-4`, `UE-13`, `US-4`). En Colombia la
  casilla sin marcar es una inferencia: cítala como `BUENA PRÁCTICA`.
- **Registro de aceptación**: ver la sección siguiente.
- **Cookies**: inventaria lo que se instala de verdad. Las no esenciales, sólo
  tras el consentimiento donde la norma lo exija; rechazar es una opción real; se
  informan duración y terceros (`CO-5`, `UE-6`, `US-5`). Si sólo hay cookies
  estrictamente necesarias, puede bastar con informar: no añadas un banner que no
  hace falta.
- **Baja en correos comerciales**: mecanismo sencillo y gratuito en cada envío y
  remitente identificable; en Colombia, además, horarios (`CO-6`, `UE-7`, `US-6`,
  `US-7`).
- **Plazo de retención**: por categoría de dato, con su criterio y su borrado
  (`CO-7`, `UE-8`, `US-2`). No des cifras que sources.md no tenga.
- **Patrones engañosos**: rechazo escondido, urgencia falsa, pagos premarcados,
  baja más difícil que el alta, reseñas falsas (`CO-10`, `UE-11`, `UE-12`, `US-9`,
  `US-10`, `US-11`, `US-18`).
- **Cobranza y contacto con deudores**: canales autorizados, horarios y
  frecuencia; en Colombia, la Ley 2300 de 2023 (`CO-11`, `CO-12`, `UE-17`,
  `UE-18`, `US-14`).
- **Menores**: si el servicio se dirige a ellos o sabe que los tiene (`CO-13`,
  `US-8`).
- **Terceros, encargados y SDKs**, sólo desde el ángulo de a quién se envían datos: cada
  proveedor, qué recibe, si trata por cuenta tuya o para sus fines, si hay
  contrato y si los datos salen del país (`CO-14`, `UE-9`, `UE-10`, `US-3`,
  `LIC-7`). La seguridad de un SDK es de la skill `security-audit`.
- **Logos y marcas ajenas**: nombrar una marca para informar no es mostrar su
  logo como cliente o socio; eso sugiere respaldo y pide permiso (`CO-16`,
  `UE-16`, `US-15`).
- **Licencias de imágenes, fuentes y código** que entran en el proyecto: autor,
  fuente, licencia y cómo se cumple su condición (`LIC-1` a `LIC-10`). La
  admisión de herramientas es de la skill `vet`.

Navegación con teclado y accesibilidad no se revisan aquí: viven en
`web-quality-gate`. Sólo anota cuándo son obligación legal: entidades públicas en
Colombia (`CO-17`), los servicios que enumera el art. 2(2) de la Directiva
2019/882, entre ellos el comercio electrónico, salvo microempresas (`UE-19`), y
gobiernos estatales y locales en EE. UU. (`US-16`).

## Registro de aceptación

Quién aceptó qué y cuándo es en sí un dato personal: trátalo como tal.

- Campos mínimos: identificador, versión del texto aceptado, fecha y hora, y canal.
- La IP, sólo si hace falta.
- Su retención va ligada a la relación: lo que dure y lo que la norma exija después.
- Que se pueda consultar y reproducir sin cambios (`CO-4`, `US-12`; en la UE, poder demostrarlo: `UE-5`).
- Las normas piden poder demostrar la aceptación, no un formato: estos campos son
  una inferencia práctica.
- Si hay backend, protege esa escritura con la skill `hardening-server-writes`.

## Cómo verificar

- Mide lo que la web hace y envía de verdad: navegador, red y código, no lo que
  promete el texto legal.
- Las cookies, con un perfil de navegador nuevo: en la primera carga y otra vez
  tras rechazar.
- Contrasta cada afirmación del texto legal con lo que la web hace. Una política
  que promete lo que no se cumple también es un fallo.
- Lo que no puedas comprobar queda `NO VERIFICADO`.

## Textos que generes

Un texto generado es un **BORRADOR**: márcalo así y nunca lo des por válido. Lo
debe revisar una persona competente.

**Nunca inventes datos legales**: razón social, NIT o identificación fiscal,
dirección o contacto salen de la persona. Si faltan, deja `[POR COMPLETAR]`.

## Veredicto

| Tema | Estado | Evidencia | Norma o nivel |
|---|---|---|---|

Estados: `FALTA`, `PRESENTE`, `NO APLICA`, `NO VERIFICADO`.

- `PRESENTE` dice que el elemento existe y coincide con lo que la web hace, no
  que cumpla.
- En «Norma o nivel», la fila de sources.md y su nivel; en `DEPENDE DEL CASO`,
  también la condición.
- Nunca concluyas «cumple» ni «es legal». Cierra con lo que falta, lo no
  verificado y las preguntas para una persona competente.

La skill informa; no arregla sin que se lo pidan.
