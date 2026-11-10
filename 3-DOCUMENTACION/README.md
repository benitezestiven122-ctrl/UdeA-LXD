# Ser profe en la era de la IA

Prototipo navegable del entorno de aprendizaje del diplomado **Ser profe en la era de la IA** (Facultad de Educación, Universidad de Antioquia).

**Sitio publicado:** https://diplomadoia.proyectosdeclase.online/ (pendiente de que Miguel suba los archivos)
**Equipo:** Miguel (desarrollo y publicación), Juanjo (diseño UX y evaluación), Stiven (investigación y analítica UX). [Completar nombres completos y roles Scrum]
**Curso:** Experiencia de Usuario 2026-2, Universidad EAFIT

## Qué es

Sitio estático (HTML, CSS y JavaScript sin librerías) para evaluar con docentes universitarios tres tareas: retomar el curso, encontrar una actividad y registrar una reflexión en la bitácora. Las decisiones de diseño salen de la investigación del equipo (entrevistas y paseos cognitivos) resumida en `CONTEXTO.md`.

## Cómo ver el sitio en tu computador

Abre `index.html` en el navegador. No necesita servidor ni base de datos. La página 404 y el `.htaccess` solo funcionan en el servidor.

## Cómo se publica

1. Entrar a Hostinger con el usuario asignado por el profesor → subdominio diplomadoia → Administrador de archivos → `public_html` → carpeta del proyecto.
2. Subir **todo** el contenido de `1-SUBIR-A-HOSTINGER` en una sola operación, incluidos `404.html` y `.htaccess`.
3. No borrar ni modificar `default.php`. Si ya existe un `.htaccess` en el servidor, revisarlo antes de reemplazarlo.
4. Si cambia el CSS o el JS, subir el número de versión (`?v=`) en todas las páginas y volver a subir todo junto.

Detalle paso a paso: `LEEME-PRIMERO.txt`.

## Analítica

- **Herramientas:** Hotjar (sitio "Diplomado IA 2026-2", `hjid 6847283`) y Maze (proyecto "Diplomado IA"). Los scripts son los del tutorial del profesor y están en las 16 páginas, después de `<meta charset>`.
- **Fecha de activación:** [anotar cuando el sitio esté publicado y Hotjar reciba la primera sesión]
- **Eventos (Hotjar):**

| Evento | Cuándo se envía |
|---|---|
| `clic_continuar_curso`, `clic_explorar_mapa`, `clic_ver_sesiones`, `clic_abrir_bitacora`, `clic_guardar_borrador`, `clic_sesion_01` … `clic_sesion_10` | Clic en cada botón clave (todo elemento con `id="btn-…"`) |
| `bitacora_guardada` | Llega a la confirmación con un borrador guardado |
| `bitacora_error_vacia` | Intenta guardar sin escribir |
| `sesion_completada`, `sesion_pendiente` | Marca o desmarca una sesión |
| `busqueda_con_resultados`, `busqueda_sin_resultados` | Usa el buscador |
| `mapa_vista_guiado`, `mapa_vista_libre` | Cambia la forma de ver el mapa |
| `menu_abierto`, `menu_cerrado` | Abre o cierra el menú en celular |
| `pagina_no_encontrada` | Cae en la página 404 |
| `clic_examinar_archivo`, `archivo_adjuntado`, `archivo_quitado` | Usa "Examinar archivo" en la bitácora |
| `clic_contactar_tutor`, `tutor_pregunta_frecuente`, `tutor_mensaje_enviado`, `tutor_glosario` | Abre y usa el panel del equipo tutor |
| `glosario_consultado` | Abre la definición de una palabra subrayada |
| `nodo_filtro`, `nodo_experiencia_publicada`, `nodo_error_vacio`, `nodo_reconocimiento`, `nodo_comentario_publicado`, `clic_publicar_experiencia`, `clic_publicar_comentario` | Usa Nodo IA |
| `perfil_coordinador`, `clic_filtro_riesgo`, `clic_filtro_lento`, `clic_filtro_aldia`, `clic_filtro_todos`, `coordinador_detalle` | Usa la vista de coordinador |
| `aviso_privacidad_aceptado` | Pulsa "Entendido" en el aviso |

- **Dónde ver los datos:** Hotjar → Recordings y Heatmaps; Maze → Results.
- **Aviso de privacidad:** barra fija al pie en la primera visita, con botón "Entendido" y enlace "Ver aviso de privacidad" en el pie. El texto de la bitácora se oculta en Hotjar (`data-hj-suppress`). En Maze hay que activar "Anonymize participant data".
- **`?reset=1`:** borra el progreso, los borradores y la aceptación del aviso en ese navegador.
- **Misiones y plantillas:** `2-PARA-JUANJO-Y-STIVEN/PLAN-EVALUACION-UX.md` y `RUTAS-PRUEBAS-UX.md`.

## Estructura de la carpeta

```text
1-SUBIR-A-HOSTINGER/
├── index.html               Inicio
├── mapa-curso.html          Mapa del diplomado: 5 módulos e hitos
├── modulo-evaluacion.html   Módulo de evaluación: 10 sesiones
├── sesiones/sesion-01.html … sesion-10.html
├── bitacora.html            Bitácora con borradores locales y «Examinar archivo»
├── bitacora-guardada.html   Confirmación «Tu borrador se guardó.»
├── nodo-ia.html             Nodo IA: casos, filtro por disciplina y «Comparte una experiencia»
├── nodo-ia-caso.html        Un caso (?caso=c1): texto, reconocimientos y comentarios
├── coordinador.html         Seguimiento de la cohorte (perfil «Coordinador pedagógico»)
├── 404.html                 Página no encontrada
├── .htaccess                Página de error, página inicial y caché
├── css/estilos.css          Único CSS: variables + componentes
├── js/main.js               Comportamiento compartido y eventos
├── js/extras.js             Panel de tutor, glosario, Nodo IA y coordinador
├── js/datos-demo.js         CONTENIDO DE DEMOSTRACIÓN (glosario, casos, cohorte, respuestas del tutor)
└── assets/imagenes/         logo-udea.webp, favicon.svg
2-PARA-JUANJO-Y-STIVEN/      Plan de evaluación y rutas
3-DOCUMENTACION/             README, CONTEXTO, BITACORA (no se suben)
```

## Procedencia del contenido

| Contenido | Fuente | Estado |
|---|---|---|
| Nombres, semanas y horas de los 5 módulos; 5 hitos; 2 h de encuentro por semana | Ficha institucional del diplomado | Dato oficial |
| Estructura de 10 sesiones del módulo de evaluación | Contexto adicional aprobado por el equipo | Estructura aprobada; contenido pendiente |
| Títulos, objetivos, recursos y actividades de las sesiones | — | **Disponible próximamente** |
| Fecha, hora y enlace de los encuentros | — | Disponible próximamente |
| Partes de la bitácora | Arquitectura de información v0.3 del equipo | Propuesta del equipo |
| Textos de interfaz, aviso de privacidad y página 404 | UX writing provisional + textos propuestos (ver `CONTEXTO.md`) | Provisional, por aprobar |

## Supuestos y limitaciones

- **Módulo de evaluación = Módulo 3 de la ficha.** El equipo debe confirmarlo.
- Los módulos 1, 2, 4 y 5 aparecen como "Disponible próximamente".
- **El progreso, la bitácora, Nodo IA y el panel de tutor son una demostración local** (`localStorage`, clave `ser-profe-ia-demo-v1`). Nada llega al equipo tutor ni a otros participantes.
- **Contenido de demostración** (redactado con IA, por reemplazar; todo está en `js/datos-demo.js`): 6 definiciones del glosario, 3 casos de Nodo IA con sus comentarios, respuestas del panel de tutor y una cohorte ficticia de 12 docentes. En el sitio aparece marcado como "Demostración", "Caso de demostración" o "Datos de demostración".
- **Panel de tutor (HU-08):** sin nombres ni fotos del equipo ("Disponible próximamente"); los mensajes no se envían.
- **"Examinar archivo" (HU-12):** solo guarda el nombre y el tamaño del archivo; el archivo no se sube.
- **Vista de coordinador (HU-15):** el contenido de las bitácoras y los mensajes de acompañamiento no están construidos.
- El aviso de privacidad y la página 404 se añadieron el 10 de noviembre; las tres páginas nuevas llevan Hotjar y Maze como las demás.

## Verificación

| Qué | Resultado | Cómo |
|---|---|---|
| Enlaces e imágenes internas | Sin enlaces rotos | Script sobre las páginas y recorrido local (10 nov) |
| Responsive | Sin desborde horizontal a 375 px en 5 páginas | Navegador local |
| Menú móvil | 68 px cerrado; abre, cierra, Escape | Navegador local |
| Contraste del H1 (`#4A7A1C`) | Aprox. 5,1:1 sobre blanco y 4,8:1 sobre el fondo | Cálculo manual; **falta herramienta externa** |
| Consola | Sin errores propios en local | Navegador local |
| Lighthouse, validador W3C, celular real, segundo navegador | **Pendiente** | Con el sitio publicado |
| Eventos llegando a Hotjar y Maze | **Pendiente** | Requiere HTTPS |

## Uso de IA

- Construcción inicial del sitio: Claude (Miguel). [Miguel: completar]
- Diagnóstico, analítica, 404, menú móvil, refuerzo visual y documentación: Claude Code con acceso a la carpeta (Stiven, 10 de noviembre de 2026).
- Registro de cada cambio: `BITACORA.md`.

## Créditos y licencias

- **Tipografías:** Bricolage Grotesque, Geist y Jost, servidas desde Google Fonts (SIL Open Font License).
- **Logo de la Universidad de Antioquia:** marca institucional. **Falta confirmar el permiso de uso.**
- **Íconos:** SVG en línea dibujados para el proyecto.
- **Referentes visuales:** efectos inspirados en ui.aceternity.com, escritos en CSS propio (no se copió código).
- **Credenciales:** ningún archivo del sitio las contiene. Las del tutorial no deben copiarse en el código ni en repositorios.
