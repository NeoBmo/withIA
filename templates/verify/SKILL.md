---
name: verify
description: Receta rápida de este proyecto para comprobar un cambio antes del commit con build, ruta clave, consola y 320 px. Usar antes de cada commit con código o si piden "verifica", "verify" o "comprueba que funciona".
---

<!--
Plantilla. Cópiala a .claude/skills/verify/SKILL.md del proyecto, sustituye lo que
va entre <> y borra este comentario.
No la instales en ~/.claude/skills: una skill llamada verify se ejecuta antes de
cada commit, y en el nivel personal lo haría en todos tus proyectos.
Si tarda más de dos minutos, recórtala: corre en cada commit.
-->

# Verificar este proyecto

Corre los pasos en orden y para en el primer fallo. Cada paso acaba en `PASA`,
`FALLA` o `NO VERIFICADO`, con su evidencia. Si el cambio no toca la interfaz, haz
sólo el paso 1.

1. **Build.** `<comando de build>`, y los tests si son rápidos: `<comando de test>`.
2. **Arranca.** `<comando del servidor de desarrollo>`, en `<URL local>`.
3. **Ruta clave.** Abre `<ruta>` en el navegador y completa `<acción principal>`.
   Debe verse `<resultado esperado>`. Si cambiaste otra pantalla, pásala también.
4. **Consola.** Sin errores tras el recorrido, ni peticiones fallidas.
5. **320 px.** A 320 px de ancho no hay scroll horizontal, nada queda cortado y la
   acción principal se alcanza.

Cierra el servidor que arrancaste y devuelve una línea por paso. Lo que esta receta
no pueda comprobar se dice como `NO VERIFICADO`, no se da por bueno.
