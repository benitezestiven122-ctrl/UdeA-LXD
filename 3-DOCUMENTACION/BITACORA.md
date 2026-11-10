# Bitácora del proyecto: Ser profe en la era de la IA

Registro de decisiones y de uso de IA, según el Anexo B de la guía del curso. Las entradas de Miguel sobre la construcción inicial del sitio están pendientes de que él las registre.

## [2026-11-10] Stiven — Diagnóstico contra la guía de implementación
- **Objetivo del cambio:** saber qué le faltaba al sitio antes de publicarlo.
- **Prompt clave:** "Verificar que la página cumpla con todo lo requerido en la guía de implementación antes de su publicación en Hostinger" (Claude Code, con acceso a la carpeta).
- **Qué produjo la IA:** tabla cumple / no cumple / no puedo verificar contra la sección 7 de la guía y un plan en cinco pasos.
- **Decisión del equipo:** aceptado por Stiven; se ejecutó un paso por aprobación.
- **Evidencia que lo sustenta:** lista de chequeo de la guía. Hallazgos: sin aviso de privacidad, sin página 404, menú móvil de 184 px de alto, H1 con contraste 2,04:1, sin eventos de analítica, sin BITACORA.md.
- **Archivos modificados:** ninguno.
- **Verificación:** revisión de enlaces y atributos en las 15 páginas con un script, y recorrido en navegador local a 1280 px y 375 px.

## [2026-11-10] Stiven — Analítica lista para medir
- **Objetivo del cambio:** cumplir "aviso de privacidad y consentimiento visible" y "eventos del plan de medición".
- **Prompt clave:** aprobación del paso 1 del plan.
- **Qué produjo la IA:** aviso de privacidad fijo con botón "Entendido", eventos de Hotjar en botones clave y ocultamiento del texto de la bitácora en las grabaciones.
- **Decisión del equipo:** aceptado. El texto del aviso lo redactó la IA y **está pendiente de aprobación del equipo**. Se decidió que los scripts carguen siempre (como pide el tutorial) y que el aviso sea informativo.
- **Evidencia que lo sustenta:** Fase 6 de la guía. No proviene de la investigación con usuarios.
- **Archivos modificados:** `js/main.js`, `css/estilos.css`, `bitacora.html`, `bitacora-guardada.html`.
- **Verificación:** en local, el aviso aparece con `?reset=1`, se cierra, no reaparece y se reabre desde el pie; los eventos entran en la cola de Hotjar. **No verificado:** que lleguen a Hotjar (requiere HTTPS).

## [2026-11-10] Stiven — Página 404, .htaccess, favicon y versión de archivos
- **Objetivo del cambio:** cumplir "página 404 útil", control de caché y "misma versión del CSS en todas las páginas".
- **Prompt clave:** aprobación del paso 2 del plan.
- **Qué produjo la IA:** `404.html` con el mismo marco y tres salidas, `.htaccess`, `favicon.svg` y parámetro `?v=` en CSS y JS.
- **Decisión del equipo:** aceptado. Los textos de la 404 los redactó la IA y están pendientes de aprobación.
- **Evidencia que lo sustenta:** secciones 6.2 y 7.1 de la guía.
- **Archivos modificados:** `404.html`, `.htaccess`, `assets/imagenes/favicon.svg` (nuevos); las 15 páginas HTML; `js/main.js`.
- **Verificación:** en local, una URL inexistente muestra la 404 con estilos y enlaces. **No verificado:** el `.htaccess` (el servidor local no es Apache).

## [2026-11-10] Stiven — Menú móvil y accesibilidad
- **Objetivo del cambio:** cumplir "el menú funciona en móvil y no deja espacios vacíos" y los mínimos de accesibilidad.
- **Prompt clave:** aprobación del paso 3 del plan.
- **Qué produjo la IA:** botón "Menú" que pliega los enlaces en pantallas angostas (el buscador queda visible), H1 en `#4A7A1C` y título lateral de las sesiones convertido en párrafo para respetar el orden de títulos.
- **Decisión del equipo:** aceptado. El color del H1 era una decisión pendiente del equipo; queda propuesto.
- **Evidencia que lo sustenta:** secciones 7.1 y 7.4 de la guía; tabla de contraste del README anterior.
- **Archivos modificados:** `js/main.js`, `css/estilos.css`, las 10 páginas de `sesiones/`, versión en las 16 páginas.
- **Verificación:** a 375 px el menú cerrado mide 68 px (antes 184); abre, cierra y responde a Escape. Contraste del H1 calculado a mano (aprox. 5,1:1), no medido con herramienta externa.

## [2026-11-10] Stiven — Refuerzo visual
- **Objetivo del cambio:** fortalecer el diseño gráfico con más variedad de color, textura y tipografía, conservando el tono.
- **Prompt clave:** "Implementar heurísticas del diseño y alimentarse de componentes como los de ui.aceternity.com; desarrollo más variado con colores, texturas y tipografías de Google Fonts".
- **Qué produjo la IA:** titulares en Fraunces, fondo cálido con trama de puntos, tarjetas oscuras con foco de luz, menú fijo translúcido, tintes derivados de la paleta y movimiento discreto. Todo en CSS propio, sin librerías.
- **Decisión del equipo:** aplicado por Stiven; **pendiente de aprobación de Miguel y Juanjo**, porque se aparta de la home aprobada en titulares y fondo.
- **Evidencia que lo sustenta:** Fase 3 de la guía y heurísticas de Nielsen (visibilidad del estado, consistencia, reconocimiento, diseño minimalista). No proviene de la investigación con usuarios.
- **Archivos modificados:** `css/estilos.css`, `js/main.js`, enlace de fuentes y versión en las 16 páginas.
- **Verificación:** capturas en local a 1280 px y 375 px; sin desborde horizontal en cinco páginas. **No verificado:** celular real ni segundo navegador.

## [2026-11-10] Stiven — Titulares sans serif y cinco funciones del MVP
- **Objetivo del cambio:** construir lo que faltaba del MVP (HU-12, HU-08, HU-09, HU-01, HU-15) y cambiar el H1 a una sans serif de mucho peso.
- **Prompt clave:** "Pasa a desarrollar las partes sin construir: panel de tutor, glosario, Examinar archivo, Nodo IA y vista de coordinador. Cambia la tipografía H1, no uses una serif. Utiliza más variedad de componentes React".
- **Qué produjo la IA:** titulares en Bricolage Grotesque 800; "Examinar archivo" en la bitácora; botón "Contactar tutor" con panel lateral, mensajes y glosario; palabras subrayadas con definición; Nodo IA (lista, caso, comentarios, publicar); seguimiento de cohorte con filtro por estado.
- **Decisión del equipo (Stiven):** ajustado. Se pidió React y se decidió **no usar React**: los componentes se recrearon en CSS y JavaScript propios para mantener el sitio estático sin librerías. Se autorizó contenido de demostración marcado como tal. **Pendiente de aprobación de Miguel y Juanjo.**
- **Evidencia que lo sustenta:** backlog priorizado (HU-15 4,80; HU-08 4,65; HU-12 4,65; HU-01 4,50; HU-09 4,30) y hallazgos: incertidumbre al entregar con arrastrar y soltar, exigencia de soporte humano visible, rechazo a rankings (por eso los reconocimientos no muestran conteos) y coordinadores que buscan a mano las filas en riesgo.
- **Archivos modificados:** `js/extras.js`, `js/datos-demo.js`, `nodo-ia.html`, `nodo-ia-caso.html`, `coordinador.html` (nuevos); `js/main.js`, `css/estilos.css`, `bitacora.html`, `index.html`, `mapa-curso.html`; menú, pie, perfil, scripts y versión en las 16 páginas anteriores.
- **Verificación:** en local, cada función probada con clics reales o simulados; sin desborde a 375 px (se corrigió uno en la tabla del coordinador). **No verificado:** lector de pantalla, celular real, segundo navegador. **El contenido de demostración no ha sido revisado por el equipo.**

## [2026-11-11] Stiven — Sesiones 11 a 15 y retiro de la «caja» 3D
- **Objetivo del cambio:** completar las 15 sesiones del diplomado y quitar la metáfora visual de la Caja de herramientas.
- **Prompt clave:** "Créalas. Además elimina la caja de herramientas, ya que parece un elemento interactuable pero entiendo que solo es visual. La idea de poner ahí la actividad semanal o el artefacto es correcta; lo que no funciona es la metáfora visual".
- **Qué produjo la IA:** `sesion-11.html` a `sesion-15.html` con el contenido de la presentación (Módulo 4: sesión 11; Módulo 5: sesiones 12–15, con Hitos 4 y 5 y los avisos de semanas que rompen el patrón). Las 15 páginas comparten lista lateral, selector móvil y botones anterior/siguiente. Se quitaron el cubo 3D giratorio y el medidor de 15 casillas; el artefacto queda como tarjeta de texto («Artefacto semanal · Entrada N de 15»), sin inclinación al pasar el cursor.
- **Decisión del equipo (Stiven):** aplicado. La página `modulo-evaluacion.html` pasa a llamarse «Sesiones del diplomado» (h1 «Las 15 sesiones»); la URL no cambió.
- **Evidencia que lo sustenta:** retroalimentación de Stiven: un elemento decorativo que parece interactivo genera expectativa falsa (heurística de Nielsen: correspondencia con lo esperado / prevención de errores).
- **Archivos modificados:** 15 páginas de `sesiones/` (5 nuevas), `modulo-evaluacion.html`, `mapa-curso.html`, `index.html`, `bitacora.html` (sesiones 11–15 en el selector), `js/main.js` (TOTAL = 15), `js/extras.js`, `js/datos-demo.js`, `css/estilos.css`, versión `?v=20261111f` en 24 páginas.
- **Verificación:** en local (1280 px y 375 px): 15 tarjetas y 5 grupos en el módulo, espiral con 15 esferas, sesión 12 con Hito 4 y aviso de patrón, «Marcar como completada» funciona, cero enlaces rotos en 24 páginas, sin desborde ni errores de consola.

## [2026-11-11] Stiven — Contenido real de las 10 sesiones y componentes 3D del módulo
- **Objetivo del cambio:** completar las sesiones con la información oficial y reforzar visualmente el módulo con animaciones y componentes interactivos, considerando objetos 3D.
- **Prompt clave:** "Con base en la info de los documentos adjuntos completa la información de las 10 sesiones del módulo de evaluación" + "refuerza visualmente la estética dentro de los módulos… ten en cuenta la lógica del nodo 3D… posible uso de objetos o componentes 3D".
- **Qué produjo la IA:** detectó que el Módulo 3 tiene solo 3 sesiones (7–9). **Decisión de Stiven:** mantener 10 páginas con las sesiones 1 a 10 reales; la página pasa a «Sesiones 1 a 10». Cada sesión: fase en 5 pasos, objetivo, dinámica, tópicos en tarjetas que giran en 3D, «Tu semana» con 5 pasos marcables, recurso pendiente y artefacto con un cubo 3D de la Caja de herramientas y un medidor de 15 entradas. Módulo: espiral 3D en canvas (distinta de la red de Nodo IA: un camino continuo con orden), resultados de aprendizaje y anillo de avance. Inclinación 3D al pasar el cursor por las tarjetas. Módulos 1, 2 y 4 ahora enlazan a sus sesiones en el mapa y en Inicio.
- **Fuentes:** presentación sintética del diplomado (textos copiados tal cual, con ajustes mínimos de espacios) y «Mapa de concepto y experiencia» (semana tipo). No se usaron las filas marcadas como hipótesis («Qué se pregunta», «Cómo se siente», «Qué puede salir mal»).
- **Diferencias encontradas en las fuentes:** la diapositiva de la sesión 9 ubica el Hito 3 en la semana 9 («diseño del artefacto»), mientras la diapositiva de hitos lo pone en la semana 10 («Marco ético»); el mapa del sitio conserva la versión de hitos. La sesión 6 dice «y para luego hacen»; se dejó «y luego hacen».
- **Archivos modificados:** las 10 páginas de `sesiones/`, `modulo-evaluacion.html`, `mapa-curso.html`, `index.html`, `js/main.js`, `js/extras.js`, `js/datos-demo.js`, `css/estilos.css` (v1.7), versión `?v=20261111e` en 19 páginas, RUTAS, PLAN de evaluación, README, CONTEXTO.
- **Corrección adicional:** la animación de entrada dejaba el contenido en opacidad 0 si el navegador no la ejecutaba (pestaña oculta, capturas de Hotjar); ahora solo desplaza.
- **Verificación:** en local (1280 px y 375 px): espiral visible y clicable, tarjetas que giran, pasos de la semana guardados, medidor de la Caja, buscador encuentra «Papert», modo coordinador conserva sus herramientas en el módulo, sin desborde ni errores de consola.

## [2026-11-11] Stiven — Entrada por rol y modo coordinador dentro del curso
- **Objetivo del cambio:** que el coordinador vea lo mismo que los docentes, con más opciones, y simular un inicio de sesión por rol.
- **Prompt clave:** "Haz que la vista de coordinador no sea una vista totalmente aparte… el inicio debe ser igual, con el botón de seguimiento de la cohorte… inspeccionar quiénes entregaron bitácora, cambiar o agregar contenido a un módulo, crear un módulo opcional… un sistema de entrada que simule un login, solo elegir el modo".
- **Qué produjo la IA:** pantalla «¿Cómo quieres navegar hoy?» con dos roles; interruptor «Modo coordinador» y «Cambiar de rol» en la cabecera; franja amarilla en modo coordinador; herramientas en contexto en Inicio, Mapa, Módulo, Sesiones y Mi bitácora; módulos opcionales.
- **Decisión del equipo (Stiven):** aplicado. Se quitó «Coordinador pedagógico» del selector «Perfil de prueba». **Riesgo para Maze:** la pantalla de entrada suma un clic; por eso las URL de inicio llevan `?modo=docente`. Pendiente de aprobación de Miguel y Juanjo.
- **Archivos modificados:** `js/extras.js`, `js/main.js`, `css/estilos.css` (v1.6), selector de perfil y versión `?v=20261111b` en 19 páginas, `RUTAS-PRUEBAS-UX.md`, `PLAN-EVALUACION-UX.md`, `LEEME-PRIMERO.txt`.
- **Verificación:** en local (1280 px y 375 px): entrada por rol, inicio del coordinador con la tarjeta de seguimiento, crear módulo opcional (visible también como docente), editar objetivos, ver entregas, editar una sesión desde su página, revisión en Mi bitácora; `?modo=docente` evita la entrada. Sin errores de consola ni desborde.
- **Incidente:** un script de documentación vació estos archivos; se restauraron desde el historial de archivos de Claude Code y se reaplicaron los cambios.

## [2026-11-11] Stiven — Efectos de la red y multimedia embebida
- **Objetivo del cambio:** nodos más grandes, efecto glow al pasar el mouse y ver cómo se verían videos y documentos embebidos en proyectos y papers.
- **Qué produjo la IA:** nodos 60 % más grandes con brillo esférico; al pasar el mouse, glow animado, anillos que se expanden, conexiones resaltadas y el resto atenuado; estrellas de fondo con profundidad; pulsos que viajan por las conexiones; onda al hacer clic; tarjeta flotante con tipo, tema y «Clic para abrir». En los papers, visor de PDF de 4 páginas; en los proyectos, reproductor de video con capítulos. Ambos son **vistas de ejemplo** y lo dicen en pantalla. Si un nodo trae `embed` con una URL https real, se muestra en un iframe.
- **Decisión del equipo (Stiven):** aplicado; pendiente de aprobación de Miguel y Juanjo. No se usaron videos ni PDF reales porque no hay enlaces verificados del equipo.
- **Archivos modificados:** `js/extras.js`, `css/estilos.css` (bloque v1.5), versión `?v=20261111a` en 19 páginas.
- **Verificación:** en local a 1280 px y 375 px: glow y tarjeta al pasar el mouse, clic abre el nodo, PDF cambia de página, video avanza y se pausa, sin desborde. El movimiento se apaga con «reducir movimiento». **No verificado:** rendimiento en equipos lentos.

## [2026-11-11] Stiven — Nodo IA en red 3D, multimedia y modo coordinador
- **Objetivo del cambio:** repositorio explorable como red de nodos 3D, lector deslizable de contenidos (proyectos, papers, bitácoras), ejemplos de bitácora con multimedia, carga de multimedia y acceso visible al modo coordinador.
- **Prompt clave:** "Explorar estética 3D… una red de nodos… clic en un nodo despliega el trabajo, scroll o swipe (flechas en PC) para ver otros contenidos; botón para crear tu propio nodo y botón back; en la red, añadir nodo e ir a un nodo aleatorio".
- **Qué produjo la IA:** red 3D en `<canvas>` con código propio (arrastrar o flechas para girar, clic para abrir, Enter abre el nodo más cercano, lista accesible debajo); lector de pantalla completa con scroll-snap; "Añadir nodo" con imagen opcional; "Nodo aleatorio"; campo "Agregar multimedia" en la bitácora; 3 bitácoras de ejemplo; interruptor "Modo coordinador".
- **Decisión del equipo (Stiven):** aplicado. **Sin librerías 3D** (Three.js) para respetar la regla de sitio estático sin dependencias. Los papers son **referencias reales con resúmenes redactados por la IA**: el equipo debe verificarlos contra cada fuente antes de las pruebas. Pendiente de aprobación de Miguel y Juanjo.
- **Evidencia que lo sustenta:** HU-01 (repositorio), HU-03 (reconocimiento cualitativo), protopersona P1 (explorar sin quedarse en lo básico).
- **Archivos modificados:** `nodo-ia.html`, `bitacora.html`, `js/extras.js`, `js/datos-demo.js`, `js/main.js`, `css/estilos.css` (bloque v1.4), versión `?v=20261110g` en 19 páginas.
- **Verificación:** en local (1280 px y 375 px): giro, clic en nodo, flecha abajo pasa al siguiente, Escape vuelve a la red, nodo aleatorio, añadir nodo con imagen, multimedia guardada y visible en la confirmación, ejemplos en panel lateral, sin desborde. Se corrigió un desfase del lector y una imagen sin fuente. **No verificado:** rendimiento en celulares de gama baja, lector de pantalla, segundo navegador.

## [2026-11-10] Stiven — Perfil coordinador, Fase 1
- **Objetivo del cambio:** que el coordinador pueda editar y revisar la información de los módulos y revisar bitácoras.
- **Prompt clave:** "El perfil de coordinador debe tener más funcionalidades… editar y revisar información de los distintos módulos del curso. Primero el plan de desarrollo, actualiza la documentación, después continúa con el desarrollo".
- **Qué produjo la IA:** `PLAN-PERFIL-COORDINADOR.md` (4 fases) y la Fase 1: pestañas Seguimiento / Contenido del curso / Revisión de bitácoras; editor de fecha y nota por módulo; editor de sesiones (título, objetivo, actividad, recurso, publicada); retroalimentación escrita que el docente ve en su bitácora.
- **Decisión del equipo:** aplicado por Stiven; pendiente de aprobación de Miguel y Juanjo. Los nombres oficiales de los módulos no se editan. Sin corrección automática con IA (HU-18 descartada).
- **Evidencia que lo sustenta:** protopersona P3, HU-15 y hallazgo sobre los candados (fecha de apertura en lugar de bloqueo).
- **Archivos modificados:** `coordinador.html`, `bitacora.html`, `js/extras.js`, `css/estilos.css`, versión en las 19 páginas, `PLAN-PERFIL-COORDINADOR.md`, `CONTEXTO.md`.
- **Verificación:** los 6 criterios de aceptación del plan, en local. Sin errores de consola.
## [2026-11-10] Stiven — Documentación y plan de evaluación
- **Objetivo del cambio:** dejar al día README, CONTEXTO y esta bitácora, y preparar Maze y Hotjar.
- **Prompt clave:** aprobación del paso 5 del plan.
- **Qué produjo la IA:** `PLAN-EVALUACION-UX.md` (matriz, bloques de Maze, checklist, plantillas), README y CONTEXTO actualizados.
- **Decisión del equipo:** pendiente de revisión con Juanjo (misiones y correspondencia con el backlog).
- **Evidencia que lo sustenta:** formato del informe final y tutorial de Maze y Hotjar del profesor.
- **Archivos modificados:** carpetas `2-PARA-JUANJO-Y-STIVEN` y `3-DOCUMENTACION`, `LEEME-PRIMERO.txt`.
- **Verificación:** las URL, los `id` y los eventos citados se tomaron del código actual.
