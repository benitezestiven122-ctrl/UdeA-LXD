# Plan de desarrollo — Perfil "Coordinador pedagógico" (protopersona P3)

**Creado:** 10 de noviembre de 2026 (Stiven, con Claude Code)
**Para retomar en otra sesión:** carga `CONTEXTO.md` y este archivo, y pide continuar desde la primera fase que no esté marcada como "Hecha".

## Objetivo

El coordinador debe poder **monitorear la cohorte** (ya existe), **revisar y editar la información de los módulos y sesiones del curso** y **revisar las bitácoras** dejando retroalimentación humana. Todo sigue siendo una demostración local (`localStorage`), sin servidor.

## Reglas que el desarrollo debe respetar

- Sitio estático, sin librerías ni React. Componentes propios en `js/extras.js` y `css/estilos.css` (solo variables de `:root`).
- No cambiar URL ni `id` existentes (Maze y Hotjar dependen de ellos).
- Todo cambio hecho por el coordinador se marca en el sitio como **"Editado por coordinación · Demostración local"**.
- **No hay reescritura ni corrección automática con IA** (HU-18 descartada): la retroalimentación la escribe una persona.
- **Nada de rankings ni puntajes públicos** (hallazgo refutado sobre gamificación competitiva).
- Los módulos sin fecha muestran "Disponible próximamente"; con fecha, "Disponible a partir del [fecha]" (hallazgo sobre los candados).
- Cada clic de un botón con `id="btn-…"` genera un evento de Hotjar automáticamente.

## Datos (en `state`, clave `ser-profe-ia-demo-v1`)

```js
state.contenido = {
  modulos:  { "1": { apertura: "AAAA-MM-DD", nota: "" }, ... },
  sesiones: { "3": { titulo: "", objetivo: "", actividad: "", recurso: "", publicada: true }, ... }
};
state.revisiones = { "3": { comentario: "", fecha: 1731200000000 } };  // por sesión de la bitácora
state.mensajes   = [ { segmento: "riesgo", texto: "", fecha: 0 } ];     // Fase 3
```

`?reset=1` ya borra todo `state`, así que también limpia estas ediciones.

## Fases

| Fase | Contenido | HU | Estado |
|---|---|---|---|
| 1 | Pestañas en `coordinador.html`: **Seguimiento**, **Contenido del curso**, **Revisión de bitácoras** | HU-15 | Hecha (10 nov) |
| 1 | Editor de módulos: fecha de apertura y nota para los docentes (se descartó el campo "estado": la fecha ya lo comunica) | — | Hecha |
| 1 | Editor de sesiones (1–10): título, objetivo, actividad, enlace del recurso y "Sesión publicada" | — | Hecha |
| 1 | Aplicar las ediciones en `modulo-evaluacion.html`, las 10 sesiones, `mapa-curso.html` e Inicio | — | Hecha |
| 1 | Revisión de bitácoras: lista de borradores guardados en el navegador, lectura y retroalimentación escrita; el docente la ve en `bitacora.html` | HU-11 | Hecha |
| 2 | Vista previa "como la verá el docente" antes de guardar; deshacer el último cambio; historial de cambios por sesión | — | Pendiente |
| 2 | Validaciones: título máximo 80 caracteres, enlaces que empiecen por `https://`, aviso al salir con cambios sin guardar | — | Pendiente |
| 3 | Mensajes segmentados por estado (en riesgo / lento / al día) con plantilla editable; no se envían | HU-19 (post-MVP) | Pendiente |
| 3 | Exportar la cohorte a CSV desde el navegador | HU-17 (post-MVP) | Pendiente |
| 3 | Panel "Resumen del módulo": sesiones publicadas, bitácoras por sesión, docentes en riesgo | HU-15 | Pendiente |
| 4 | Pruebas: teclado, 375 px, contraste, eventos; actualizar README, CONTEXTO, BITACORA y `PLAN-EVALUACION-UX.md` (misión opcional para coordinador) | — | Pendiente |

## Criterios de aceptación (Fase 1)

1. Con el perfil "Coordinador pedagógico", `coordinador.html` muestra tres pestañas navegables con teclado (flechas izquierda/derecha).
2. Si el coordinador escribe el título de la Sesión 03 y guarda, al abrir `sesiones/sesion-03.html` y `modulo-evaluacion.html` aparece ese título con la marca "Editado por coordinación".
3. Si pone una fecha de apertura al Módulo 01, el mapa muestra "Disponible a partir del [fecha]" en lugar de "Disponible próximamente".
4. Si despublica una sesión, su página muestra "Esta sesión no está publicada todavía" en lugar del contenido editado.
5. Si deja retroalimentación en la bitácora de la Sesión 01, el docente la ve en `bitacora.html` al elegir esa sesión.
6. Sin desborde a 375 px; todas las acciones funcionan con teclado.

## Archivos que toca

- `coordinador.html` (estructura de pestañas y contenedores).
- `js/extras.js` (editor, revisión y aplicación de ediciones).
- `css/estilos.css` (bloque "v1.3 - Perfil coordinador").
- Versión `?v=` en todas las páginas al terminar.

## Pendiente de decisión del equipo

- ¿Puede el coordinador editar los **nombres oficiales** de los módulos (vienen de la ficha institucional)? Por ahora **no**: solo estado, fecha y nota.
- Regla del semáforo (hoy: 10+ días en riesgo, 5–9 lento).
- Textos de la interfaz del coordinador (propuestos por la IA, por aprobar).

## Registro de avance

- **10 nov 2026 — Fase 1 hecha.** Los 6 criterios de aceptación se comprobaron en local (Chromium, 1280 px y 375 px): pestañas con flechas, título y objetivo editados visibles en la sesión y en el módulo, fecha "Disponible a partir del 24 de noviembre" en el mapa, sesión despublicada, retroalimentación visible en la bitácora, sin desborde. Código en `js/extras.js` (bloque "Perfil coordinador"), `coordinador.html`, `bitacora.html` y CSS "v1.3". Versión `?v=20261110f`.
- **Siguiente:** Fase 2 (vista previa, deshacer, historial, aviso al salir con cambios sin guardar).
- **No verificado:** lector de pantalla, celular real, segundo navegador.