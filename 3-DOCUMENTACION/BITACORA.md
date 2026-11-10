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
