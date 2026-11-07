---
name: hardening-server-writes
description: Endurece un endpoint, server action o RPC que escribe datos con transacción y bloqueo, idempotencia, validación en servidor, RLS y errores de BD traducidos. Termina en una prueba concurrente ejecutable. Usar con dinero, stock, cupos o saldos, o si piden "doble cobro", "race condition", "idempotencia", "harden this endpoint". Si sólo lee datos, no aplica.
---

# Escrituras de servidor seguras

Sale de 13 fallos reales: 9 de validación y seguridad de servidor, y 4 de
concurrencia. Vienen de un solo repo, así que es una lista de sospechosos, no una
ley. Un test normal no los ve: una petición sola siempre funciona. Lo que falla
son dos a la vez, un reintento o un cliente que manda lo que no debe.

## Puerta

Responde antes de tocar nada:

1. ¿El cambio escribe en un almacén persistente desde el servidor?
2. ¿Puede repetirse o cruzarse: doble clic, reintento, webhook, dos pestañas,
   dos instancias?
3. ¿Un error aquí perdería dinero, stock o datos ajenos, o sería difícil de deshacer?

Si la 1 es no, o la 2 y la 3 son no, termina con `NO APLICA` y el motivo. No añadas
transacciones ni tablas por si acaso: en un formulario de contacto o en un ajuste
personal que sólo cambia su propio valor, sobran.

## Revisión

Lee antes la ruta entera, de la entrada a la base de datos, y lo que el proyecto
ya usa. Corrige sólo lo que aplique, con el mecanismo del proyecto, sin dependencias
nuevas. Cada punto acaba en `HECHO` o `NO APLICA`, con el motivo.

1. **Validar en el servidor.** Tipo, rango y formato de cada campo, también con la
   validación del cliente. El servidor decide lo que el cliente no debe decidir:
   precio, descuento, dueño, rol, topes. Importes en enteros o decimal, nunca en
   coma flotante. Ejemplo: si el cuerpo trae `price`, se ignora y se lee de la BD.
2. **Autorizar el recurso, no sólo la sesión.** ¿Este usuario puede tocar *esta*
   fila? Cambiar un id en la URL no debe dar acceso a datos ajenos.
3. **RLS, si la BD la usa.** Activa en cada tabla nueva, con políticas separadas
   para leer y escribir. Una función que salta RLS comprueba el permiso ella misma.
   Si el cliente habla directo con la BD, RLS es la única barrera: pruébala con el
   rol real, no con el de servicio, que la salta sin avisar.
4. **Quitar la carrera.** El patrón peligroso es leer, decidir y escribir por
   separado. Usa el que pida el caso, en este orden de preferencia:
   - Actualización condicional en una sentencia:
     `UPDATE ... SET saldo = saldo - $1 WHERE id = $2 AND saldo >= $1`.
   - Restricción `UNIQUE` o `CHECK`, que la BD hace cumplir aunque el código falle.
   - Transacción con bloqueo (`SELECT ... FOR UPDATE`) si hay varios pasos.

   No retengas una transacción abierta mientras llamas a un servicio externo. Con
   varias filas, bloquea siempre en el mismo orden para evitar interbloqueos.
5. **Idempotencia.** Una repetición no debe surtir efecto dos veces. Guarda la
   clave, generada por el cliente o derivada del evento, con restricción `UNIQUE`,
   en la misma transacción que el efecto. Si la clave ya existe, devuelve el
   resultado guardado. Comprobar y luego insertar por separado tiene la misma carrera.
6. **Traducir los errores de BD.** Convierte violación de unicidad, de `CHECK`,
   timeout de bloqueo o interbloqueo en respuestas con sentido (409, 422, 503 con
   reintento). Nunca devuelvas al cliente el texto crudo de la BD: revela tablas y
   columnas. Regístralo en el servidor.
7. **Migración.** Si añades una restricción, comprueba antes que los datos existentes
   la cumplen. Aplicarla en una base real sigue siendo decisión de la persona.

## Verificación final

Esta sección no es opcional si la puerta dejó pasar el cambio. Escribe una prueba
ejecutable en el runner del proyecto y córrela contra la implementación real,
con el motor real o uno que serialice igual. Un mock que ejecuta en orden no prueba
nada. Ajusta a tu caso este esquema:

```js
test('20 retiradas simultáneas no dejan saldo negativo', async () => {
  await seedAccount({ id: 1, balance: 100 })

  const results = await Promise.all(
    Array.from({ length: 20 }, () => withdraw({ accountId: 1, amount: 10 })),
  )

  const ok = results.filter((r) => r.status === 200)
  expect(ok).toHaveLength(10)
  expect(await balance(1)).toBe(0)
  expect(await movements(1)).toHaveLength(10)
})

test('la misma clave repetida surte efecto una vez', async () => {
  await seedAccount({ id: 1, balance: 100 })

  await Promise.all(
    Array.from({ length: 5 }, () =>
      withdraw({ accountId: 1, amount: 10, idempotencyKey: 'k1' }),
    ),
  )

  expect(await balance(1)).toBe(90)
})
```

Debe cumplir tres condiciones:

- **Afirma el invariante**, el estado final, no sólo que no hubo excepción.
- **Falla sin el arreglo.** Córrela contra el código anterior o con `git stash`. Si
  ya pasaba, la prueba no ejerce la carrera: añade espera entre la lectura y la
  escritura, o sube la concurrencia. Una prueba que no ha fallado nunca no demuestra
  nada.
- **Se repite** al menos 5 veces, porque una carrera puede pasar por suerte.

Si el entorno no permite ejecutarla, di `NO VERIFICADO` y por qué. No lo des por
bueno.

## Informe

Una tabla con cada punto de la revisión y su estado, seguida del comando de la
prueba concurrente y su salida con y sin el arreglo.
