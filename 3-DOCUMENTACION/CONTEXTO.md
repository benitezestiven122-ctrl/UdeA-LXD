# Contexto del proyecto: Ser profe en la era de la IA

Este archivo describe **el sitio que está en `1-SUBIR-A-HOSTINGER`** (multipágina, verde/teal/amarillo). El documento anterior `contexto_LXD.md` describía una versión SPA con paleta gris que no es la que se publica; de él se conservan aquí propósito, usuarios, evidencia y backlog.

## Propósito

Entorno de aprendizaje del diplomado "Ser profe en la era de la IA" (Facultad de Educación, Universidad de Antioquia). Debe ofrecer una experiencia humanizada y sin barreras tecnológicas: tranquilidad para docentes con baja alfabetización digital y autonomía para docentes avanzados. Esta versión es un prototipo para evaluar la experiencia con Maze y Hotjar.

## Usuarios y tareas principales

- **Docente innovador (alta alfabetización digital):** explorar sin quedar retenido en lo básico.
- **Docente tradicional (baja alfabetización digital):** recorrido paso a paso y confirmaciones inconfundibles de lo que guarda.
- **Coordinador pedagógico:** seguimiento de la cohorte (no construido en este prototipo).

Tareas que el prototipo permite: retomar el curso, encontrar una actividad y registrar una reflexión.

## Evidencia clave de la investigación (sin datos personales)

- Incertidumbre al entregar (validada) → confirmación explícita en página propia: "Tu borrador se guardó.".
- Pestañas fijas para los 5 módulos saturan (refutada) → mapa con dos vistas: "Paso a paso" y "Explorar módulos".
- Los candados generan angustia (refutada) → sin candados; etiqueta "Disponible próximamente".
- Miedo a la frialdad algorítmica (validada) → logo UdeA y redacción cercana. El panel de tutor humano no está construido.
- Rechazo a la gamificación competitiva (refutada) → sin rankings ni rachas.

## Backlog y alcance

MVP priorizado: HU-07 navegación guiada, HU-10 progreso, HU-11 confirmación de entregas, HU-15 dashboard, HU-08 panel de tutor, HU-12 "Examinar archivo", HU-01 repositorio Nodo IA, HU-09 glosario.

**Construido en este prototipo:** HU-07 (mapa con dos vistas, "Continuar mi curso"), HU-10 (barra de progreso), HU-11 de forma parcial (confirmación del borrador; sin "Misión cumplida" ni comprobante por correo), HU-12 ("Examinar archivo"; solo guarda el nombre), HU-08 (panel "Contactar tutor"; sin nombres ni fotos, los mensajes no se envían), HU-09 (palabras subrayadas con definición), HU-01 (Nodo IA con casos, comentarios y publicación local) y HU-15 (seguimiento de cohorte con filtro por estado).

### Contenido de demostración (por reemplazar)

Todo está en `js/datos-demo.js` y lo redactó la IA el 10 de noviembre de 2026 con autorización de Stiven. **No es contenido oficial ni datos de personas reales.**

- Glosario: 6 definiciones (IA generativa, instrucciones para la IA, mediación pedagógica, soberanía tecnológica, encuentro sincrónico, sesgo).
- Nodo IA: 3 casos con pregunta para conversar y comentarios de "Docente 02", "Docente 04" y "Docente 09".
- Panel de tutor: mensaje de bienvenida, 3 preguntas frecuentes con respuesta y 3 roles sin nombre.
- Coordinador: 12 docentes ficticios. Regla de estado: 10 días o más sin actividad = en riesgo; 5 a 9 = avance lento; menos de 5 = al día. **La regla es un supuesto; el equipo debe definirla.**

## Tecnología y restricciones

- Sitio estático multipágina: HTML, CSS y JavaScript sin frameworks ni librerías.
- Datos de demostración en `localStorage` (clave `ser-profe-ia-demo-v1`). No hay servidor ni formularios externos.
- Publicación: Hostinger, https://diplomadoia.proyectosdeclase.online/
- Analítica: Hotjar y Maze en todas las páginas. Eventos definidos: ver README, sección Analítica.

## Estructura del sitio

| Archivo | Qué hace el usuario ahí |
|---|---|
| `index.html` | Ve su progreso, retoma el curso y entra a la bitácora o al mapa |
| `mapa-curso.html` | Explora los 5 módulos y los hitos; cambia entre "Paso a paso" y "Explorar módulos" |
| `modulo-evaluacion.html` | Consulta las 10 sesiones del módulo y su estado |
| `sesiones/sesion-01.html` … `sesion-10.html` | Lee objetivo, recursos y actividad; marca la sesión como completada |
| `bitacora.html` | Escribe y guarda una reflexión en tres campos |
| `bitacora-guardada.html` | Confirma que el borrador se guardó y decide qué hacer después |
| `nodo-ia.html` | Gira la red 3D de proyectos, papers y bitácoras; abre un nodo, desliza (o usa flechas) para ver otros; añade un nodo o va a uno al azar |
| `nodo-ia-caso.html` | Lee un caso, deja un reconocimiento y comenta |
| `coordinador.html` | Filtra la cohorte por estado y abre el detalle de un docente |
| `404.html` | Encuentra una salida cuando la dirección no existe |
| Botón "Contactar tutor" (todas las páginas) | Abre el panel del equipo tutor: mensajes y glosario |

### Tres arquitecturas

- **Información:** navegación principal de cuatro entradas (Inicio, Mapa del curso, Mi bitácora, Nodo IA); la vista de coordinador se abre desde "Perfil de prueba"; migas en las páginas internas; buscador sobre páginas, módulos, hitos y sesiones. Etiquetas en lenguaje cotidiano: actividades, bitácora, módulos, "Disponible próximamente".
- **Participación:** implementado el nivel **participativo** (bitácora individual privada) y el **espectador** (lectura de sesiones). En Nodo IA: **creadores** (publicar una experiencia), **conversadores** (comentar) y **críticos** (reconocimientos con palabras, sin puntajes). Todo se guarda solo en el navegador de cada persona, así que nadie ve lo que publica otro. **Inactivos:** se detectan en la vista de coordinador (con datos ficticios).
- **Experiencia:** *lugar* (menú con página activa, migas, progreso); *consistencia* (un solo CSS, mismos botones y tarjetas); *adaptabilidad* (responsive con menú plegable en celular); *reducción* (sin candados, rankings ni rachas); *correlación* (cada sesión enlaza a la bitácora, a la anterior, a la siguiente y al módulo).

## Sistema visual

La hoja de estilos es `css/estilos.css`. Todos los valores están en `:root`.

- **Color:** teal profundo `#06363D`, verde oscuro `#00160B`, verde `#005C2F`, lima `#8DC63F`, amarillo de acción `#EDC00A`. Titular `#4A7A1C`. Fondo de página `#FAF8F2`; superficies blancas. Tintes: teal `#DDEAE7`, lima `#EDF5DC`, amarillo `#FBF2CC`.
- **Tipografía:** Bricolage Grotesque 800 (sans serif) en H1 y H2; Geist en títulos de apoyo y cifras; Jost en cuerpo e interfaz.
- **Componentes:** botón primario amarillo y secundario delineado; tarjetas blancas con borde; tarjetas oscuras con foco de luz; etiquetas de estado con texto e ícono; barra de progreso; migas; aviso de privacidad.
- **Página modelo:** `index.html`.
- **Pendiente de aprobación del equipo:** el refuerzo visual v1.1 (Bricolage Grotesque, fondo cálido, tintes), los componentes nuevos (panel lateral, pestañas, chips, tarjetas de caso, mapa de calor) y el color del H1.

## Tono de voz y UX writing

Cercano, respetuoso de la trayectoria docente y sin tecnicismos. Botones con verbos de acción ("Continuar mi curso", "Abrir mi bitácora", "Guardar borrador"). No usamos: prompts, tareas, exámenes, ranking, foros, bloqueado.

Textos propuestos por aprobar: los listados por Miguel para Inicio, Mapa, Sesiones, Bitácora y Buscador; y los nuevos del 10 de noviembre: aviso de privacidad, "Entendido", "Ver aviso de privacidad", "Menú", "No encontramos esta página", "¿A dónde quieres ir?".

## Reglas para la IA

- Usa los textos exactos que se entregan. No inventes títulos, datos, cifras ni nombres.
- Si falta información, pregunta antes de escribir.
- Un cambio por petición. Primero el plan (archivos y supuestos), luego el código, con aprobación.
- No uses estilos dentro de las páginas ni colores fuera de las variables de `:root`.
- Marca lo pendiente como "Disponible próximamente".
- Di qué archivos y líneas cambiaste, y qué no pudiste verificar.
- Sin librerías ni frameworks.
- Registra cada cambio relevante en `BITACORA.md`.

## No tocar

- Los nombres de archivo y las URL de las páginas (Maze mide con ellas).
- Los `id` que empiezan por `btn-` (generan los eventos de Hotjar).
- Los scripts de Hotjar y Maze al inicio del `<head>`.
- La clave `ser-profe-ia-demo-v1` y el comportamiento de `?reset=1`.
- `default.php` en el servidor.

## Estado actual

- **Terminado:** 15 páginas navegables con Hotjar y Maze; aviso de privacidad; eventos; página 404; `.htaccess`; menú móvil; refuerzo visual v1.1; plan de evaluación; README y bitácora.
- **En curso:** publicación en Hostinger (Miguel); configuración de Maze y verificación de Hotjar (Juanjo y Stiven).
- **Nodo IA (11 nov):** red 3D hecha en canvas sin librerías; 3 proyectos, 5 papers (referencias reales, resúmenes de demostración por verificar) y 3 bitácoras de ejemplo con multimedia ilustrativa. La bitácora acepta fotos, video y audio (fotos reducidas en `localStorage`; de video y audio solo el nombre). Interruptor "Modo coordinador" en la cabecera de todas las páginas.
- **Modo coordinador integrado (11 nov):** entrada simulada por rol, sin credenciales. El coordinador navega las mismas páginas que el docente con extras: tarjeta «Seguimiento de la cohorte» en Inicio, «Editar módulo» y «Crear módulo opcional» en el mapa, objetivos editables y «entregaron / Editar sesión» en cada sesión del módulo, herramientas en cada sesión y «Entregas de bitácora» + revisión en Mi bitácora. `coordinador.html` queda como vista detallada del seguimiento.
- **En desarrollo:** perfil de coordinador ampliado (editar módulos y sesiones, revisar bitácoras). Plan por fases y estado en `PLAN-PERFIL-COORDINADOR.md`; retomar desde ahí.
- **Siguiente:** prueba piloto, pruebas con 3 a 5 docentes, análisis para la entrega individual del 17 de noviembre.
- **Decisiones pendientes del equipo:**
  1. Resuelto (11 nov): el sitio tiene las 15 sesiones del diplomado en `sesiones/sesion-01.html` a `sesion-15.html`. Además, los nombres de los módulos difieren entre la ficha institucional (mapa) y la presentación (pastillas de cada sesión); el equipo debe elegir uno.
  2. URL de Nodo IA.
  3. Aprobar el refuerzo visual v1.1 y el color del H1.
  4. Aprobar el texto del aviso de privacidad y de la página 404.
  5. Destino de la Misión 1: Sesión 01 (actual) o módulo.
  6. Permiso de uso del logo UdeA.
- **Última actualización:** 10 de noviembre de 2026 (Stiven).
