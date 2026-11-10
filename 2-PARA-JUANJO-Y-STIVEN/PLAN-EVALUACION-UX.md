# Plan de evaluación UX (Maze y Hotjar) — Ser profe en la era de la IA

**Para:** Juanjo y Stiven · **Depende de:** Miguel (publicación en Hostinger)
**Sitio:** https://diplomadoia.proyectosdeclase.online/
**Entrega individual:** 17 de noviembre de 2026

Este documento no contiene resultados. Todo lo que está entre corchetes se llena con datos reales después de las pruebas.

---

## 1. Matriz de planeación

La columna "Función del backlog" usa las historias de usuario del backlog priorizado (MVP). **Son correspondencias propuestas: confírmenlas con Juanjo antes de usarlas en el informe.**

| Misión | Función del backlog | Objetivo UX | Recorrido esperado | Criterio de éxito | Evidencia |
|---|---|---|---|---|---|
| 1. Continuar mi curso | HU-07 Navegación lineal guiada · HU-10 Barra de progreso | Comprobar si la persona entiende dónde retomar su proceso | Inicio → botón principal de la tarjeta "Mi recorrido" → Sesión 01 | Llega a `/sesiones/sesion-01.html` | Maze: % completada, % ruta esperada, duración. Hotjar: evento `clic_continuar_curso`, heatmap de Inicio |
| 2. Encontrar una actividad | HU-07 (mapa y cambio "Paso a paso / Explorar módulos") | Evaluar si la organización módulos → sesiones → actividad se entiende | Inicio → Mapa del curso → Módulo 03 → Sesión 03 | Llega a `/sesiones/sesion-03.html` | Maze: éxito directo/indirecto, rutas alternas. Hotjar: eventos `clic_explorar_mapa`, `clic_ver_sesiones`, `clic_sesion_03`, `busqueda_*`; heatmap del mapa o del módulo |
| 3. Registrar una reflexión | HU-11 Confirmación de la entrega (implementada como "Tu borrador se guardó.") | Comprobar si escribir, guardar y entender la confirmación es claro | Inicio → Mi bitácora → escribir → guardar | Llega a una URL que contiene `bitacora-guardada.html` | Maze: % completada, duración. Hotjar: eventos `clic_abrir_bitacora`, `clic_guardar_borrador`, `bitacora_error_vacia`, `bitacora_guardada`; heatmap de la bitácora |

**Funciones añadidas después de definir estas misiones** (10 de noviembre): "Examinar archivo" (HU-12), panel "Contactar tutor" (HU-08), glosario (HU-09), Nodo IA (HU-01) y vista de coordinador (HU-15). Tienen contenido de demostración. Las tres misiones no las evalúan de forma directa, pero ahora pueden aparecer como desvíos: por ejemplo, alguien puede abrir "Contactar tutor" o entrar a Nodo IA durante la Misión 2. Los eventos de Hotjar lo registran (ver README).

**Misiones opcionales** si Juanjo quiere medirlas (decidir antes de poner el estudio en vivo):
- Adjuntar una evidencia a la reflexión → éxito: `bitacora-guardada.html`, con el evento `archivo_adjuntado`.
- Pedir ayuda al equipo del diplomado → evento `clic_contactar_tutor` (el panel no cambia la URL, así que Maze no lo mide por ruta; se observa en Hotjar).
- Encontrar un caso sobre ética y comentarlo → éxito: URL que contiene `nodo-ia-caso.html` (desde la red 3D: clic en un nodo → "Comentar y reconocer"). El lector deslizable no cambia la URL; se observa con los eventos `nodo_abierto` y `nodo_siguiente` en Hotjar.
- Coordinador: entrar con `/?reset=1` → «Coordinador pedagógico» → «Ver seguimiento de la cohorte» → filtro «En riesgo» (eventos `entrar_coordinador`, `clic_seguimiento_cohorte`, `clic_filtro_riesgo`).
- Coordinador: ver quién entregó la bitácora de la sesión 2 → módulo → «entregaron» (evento `coordinador_entregas`).

**Supuesto frente a hallazgo:** que el botón principal se entienda, que el mapa sea claro y que la confirmación tranquilice son **supuestos de diseño** hasta que los datos de Maze y Hotjar los respalden o los contradigan.

---

## 2. Bloques para Maze (Website Test)

Proyecto en Maze: **Diplomado IA**. Un bloque Website Test por misión.

**URL inicial**
- Misión 1: `https://diplomadoia.proyectosdeclase.online/?reset=1&modo=docente` (deja el progreso en cero y vuelve a mostrar el aviso de privacidad).
- Misiones 2 y 3: `https://diplomadoia.proyectosdeclase.online/index.html?modo=docente` (sin `reset`, para que el aviso no reaparezca en cada tarea).

### Misión 1
- **Task:** Retoma tu diplomado
- **Description:** Empezaste este diplomado hace unos días. Hoy tienes un rato libre y quieres seguir estudiando desde el punto en el que ibas. Llega hasta ese punto.
- **Destino esperado:** `/sesiones/sesion-01.html`
- **Pregunta posterior (escala 1 a 5):** ¿Qué tan fácil fue saber por dónde seguir? (1 = muy difícil, 5 = muy fácil)
- **Pregunta abierta:** ¿Qué miraste primero para decidir dónde hacer clic?

### Misión 2
- **Task:** Encuentra una actividad
- **Description:** Un colega te contó que en la sesión 3, la de marcos regulatorios, hay que preparar una infografía. Encuentra esa actividad.
- **Destino esperado:** `/sesiones/sesion-03.html`
- **Pregunta posterior (escala 1 a 5):** ¿Qué tan fácil fue encontrarla?
- **Pregunta abierta:** ¿Hubo algún nombre o sección que te hiciera dudar? ¿Cuál?

### Misión 3
- **Task:** Deja registrada una idea
- **Description:** Terminaste la sesión 1 y se te ocurrió una idea para tu clase que no quieres olvidar. Déjala registrada en el sitio de forma que puedas volver a encontrarla. Puedes escribir cualquier frase corta; no uses datos personales.
- **Destino esperado:** URL que contiene `bitacora-guardada.html`
- **Pregunta posterior (escala 1 a 5):** ¿Qué tan seguro quedaste de que tu idea se guardó?
- **Pregunta abierta:** ¿Cómo supiste que quedó guardada?

### Cierre
- **Pregunta abierta:** Si pudieras cambiar una sola cosa del sitio, ¿cuál sería?

**Cuidados al configurar**
- Las descripciones no nombran botones ni secciones. No las cambien por "haz clic en…".
- Activen **Anonymize participant data** en cada bloque: Maze no respeta el ocultamiento que sí aplica Hotjar a la bitácora.
- En el tipo de tarea, usen el que permita marcar ruta esperada (path-based) y definan como éxito la URL de destino. **Por verificar en la herramienta:** si Maze acepta "la URL contiene…" para la Misión 3, porque la URL real termina en `?sesion=1`.
- El aviso de privacidad suma un clic al comienzo de la Misión 1. Ténganlo en cuenta al leer clics y duración.
- Hagan una prueba piloto entre ustedes antes de compartir el enlace, y borren o identifiquen esas respuestas.

---

## 3. Lo que Miguel debe dejar funcionando

1. Subir **todo** el contenido de `1-SUBIR-A-HOSTINGER` en una sola operación, incluidos `404.html` y `.htaccess` (archivo oculto). Antes, revisar si la carpeta del servidor ya tiene un `.htaccess`.
2. No tocar `default.php`.
3. Sitio abierto con `https://` sin avisos del navegador (Hotjar solo funciona con HTTPS).
4. No cambiar nombres de archivo ni los `id` que empiezan por `btn-`.
5. Decidir con Juanjo el destino de la Misión 1: hoy es la Sesión 01; si prefieren el módulo, hay que cambiarlo **antes** de configurar Maze.

---

## 4. Checklist de verificación (con el sitio publicado)

### Hotjar
- [ ] En Chrome, F12 → Red → filtrar `hotjar`: aparece `hotjar-6847283.js` con estado 200.
- [ ] La consola no muestra "Hotjar only works over HTTPS".
- [ ] Hago un recorrido de prueba sin bloqueador de anuncios y aparece en Recordings (puede tardar unos minutos).
- [ ] En la grabación, lo escrito en la bitácora aparece oculto.
- [ ] En Recordings puedo filtrar por evento (por ejemplo `bitacora_guardada`).
- [ ] Anoto la fecha y hora de activación: [fecha]
- [ ] Heatmaps: Inicio aparece con dos URL (`/` y `/index.html`). Uso un filtro que cubra ambas.

### Maze
- [ ] F12 → Red → filtrar `maze`: aparece `maze-universal-loader.js` con estado 200.
- [ ] Los tres bloques abren la URL correcta.
- [ ] Una prueba piloto registra misión completada en las tres misiones.
- [ ] El estudio está en vivo (Live) y tengo el enlace para compartir.

### Sitio
- [ ] Se ven colores, tipografías y logo igual que en local.
- [ ] Una URL inventada muestra la página "No encontramos esta página".
- [ ] Probado en un celular real y en un segundo navegador.

---

## 5. Participantes y sesión de prueba

**Perfil:** docentes universitarios cercanos a los arquetipos del proyecto (alta y baja familiaridad digital). Entre 3 y 5 personas como mínimo.

**Bienvenida (leer tal cual)**

> Gracias por ayudarnos. Estamos evaluando un sitio web de un diplomado, no a ti: no hay respuestas correctas ni incorrectas. Te vamos a pedir tres tareas cortas. Mientras las haces, el sitio registra tus clics, el movimiento del cursor y la pantalla del sitio; no pedimos tu nombre ni tu correo. No escribas datos personales. Puedes parar cuando quieras. ¿Estás de acuerdo en participar?

**Durante la prueba**
- No señalar botones ni confirmar si va bien. Si pregunta, responder: "Haz lo que harías si estuvieras solo".
- Pedir que desactive el bloqueador de anuncios para este sitio.
- Anotar la hora de inicio: sirve para ubicar la grabación en Hotjar.

**Datos que sí registramos:** código de participante (P01, P02…), fecha y hora, dispositivo, familiaridad digital (alta/baja). **No registramos:** nombre, correo, institución.

### Plantilla de observación (una por participante)

| Campo | Registro |
|---|---|
| Código / fecha y hora / dispositivo | [ ] |
| Familiaridad digital (alta / baja) | [ ] |
| M1: ¿completó? / primer clic / dudas visibles | [ ] |
| M2: ¿completó? / ruta que siguió / dudas visibles | [ ] |
| M3: ¿completó? / ¿intentó guardar vacío? / reacción a la confirmación | [ ] |
| Frases textuales | [ ] |
| Cambio que sugiere | [ ] |

---

## 6. Plantilla de evidencias para el informe individual

### Apartado 1 — Maze

**1.1 Métricas generales**

| Misión | Respuestas | % completada | % ruta esperada | % sin terminar | Duración promedio (s) |
|---|---|---|---|---|---|
| 1 | [ ] | [ ] | [ ] | [ ] | [ ] |
| 2 | [ ] | [ ] | [ ] | [ ] | [ ] |
| 3 | [ ] | [ ] | [ ] | [ ] | [ ] |

**1.2 Nivel de éxito**

| Misión | Éxito directo | Éxito indirecto | No completada | Rutas alternas observadas | ¿Los clics del heatmap coinciden con lo previsto? |
|---|---|---|---|---|---|
| 1 | [ ] | [ ] | [ ] | [ ] | [ ] |
| 2 | [ ] | [ ] | [ ] | [ ] | [ ] |
| 3 | [ ] | [ ] | [ ] | [ ] | [ ] |

**1.3 Tiempos (videos)**

| Misión | Participante más rápido (s) | Más lento (s) | Dónde se detuvo el más lento | Captura |
|---|---|---|---|---|
| 1 | [ ] | [ ] | [ ] | [ ] |
| 2 | [ ] | [ ] | [ ] | [ ] |
| 3 | [ ] | [ ] | [ ] | [ ] |

### Apartado 2 — Hotjar

**2.1 Recordings (dos o tres)**

| Campo | Recorrido 1 | Recorrido 2 | Recorrido 3 |
|---|---|---|---|
| URL (botón Share) | [ ] | [ ] | [ ] |
| Captura | [ ] | [ ] | [ ] |
| Fecha, hora y dispositivo | [ ] | [ ] | [ ] |
| Recorrido que hizo | [ ] | [ ] | [ ] |
| Qué funcionó | [ ] | [ ] | [ ] |
| Problemas de interacción | [ ] | [ ] | [ ] |
| Observaciones y conclusión | [ ] | [ ] | [ ] |

**2.2 Heatmaps (mínimo dos)**

Propuesta: Heatmap 1 = Inicio. Heatmap 2 = Mapa del curso o Mi bitácora, el que tenga más sesiones.

| Campo | Heatmap 1: [página] | Heatmap 2: [página] |
|---|---|---|
| Captura de clics | [ ] | [ ] |
| Captura de movimiento | [ ] | [ ] |
| Captura de scroll | [ ] | [ ] |
| Observaciones de clics | [ ] | [ ] |
| Observaciones de movimiento | [ ] | [ ] |
| Observaciones de scroll | [ ] | [ ] |

**Al interpretar:** un mapa de calor muestra dónde hubo interacción, no por qué. Cada conclusión debe apoyarse también en una grabación o en una respuesta de Maze.
