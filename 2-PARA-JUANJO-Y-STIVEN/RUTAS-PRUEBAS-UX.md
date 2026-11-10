# Rutas para las pruebas UX (Maze y Hotjar) — para Juanjo y Stiven

**Sitio:** https://diplomadoia.proyectosdeclase.online/

Hasta que Miguel suba los archivos y pruebe el subdominio, estas URL no funcionan. Él les avisa cuando estén arriba.

## Páginas que existen (cada una con su URL propia)

| Página | URL | Para qué sirve |
|---|---|---|
| Inicio | `/index.html` (o `/`) | Progreso, "Continuar mi curso", accesos a la bitácora y al mapa |
| Mapa del curso | `/mapa-curso.html` | Los 5 módulos del diplomado y los hitos |
| Módulo de evaluación | `/modulo-evaluacion.html` | Objetivos (pendientes) y lista de 10 sesiones |
| Sesión 01 a 10 | `/sesiones/sesion-01.html` … `/sesiones/sesion-10.html` | Objetivo, recursos y actividad de cada sesión |
| Mi bitácora | `/bitacora.html` | Escribir y guardar la reflexión (3 campos) |
| Borrador guardado | `/bitacora-guardada.html` | Confirmación de que el borrador se guardó |

Todas las páginas tienen instalados los scripts de Hotjar (Diplomado IA 2026-2) y de Maze (proyecto Diplomado IA), tomados del tutorial del profesor.

## Antes de cada prueba

- **Para que todos empiecen igual,** usen como URL de inicio `https://diplomadoia.proyectosdeclase.online/?reset=1`. Ese `?reset=1` borra el progreso y los borradores guardados en el navegador del participante; la página se ve normal.
- Los datos se guardan solo en el navegador de cada persona (demostración local). No hay servidor ni base de datos.
- Si el participante tiene un bloqueador de anuncios, puede que Hotjar no grabe. Pídanle que lo desactive para este sitio.
- Los títulos y el contenido de las sesiones dicen "Pendiente de confirmar" o "Disponible próximamente". **Las misiones no deben depender de un tema concreto.** Usen números de sesión ("la actividad de la sesión 3").

## Cambios del 10 de noviembre que afectan las pruebas

- **Aviso de privacidad:** aparece en la primera visita y cada vez que se usa `?reset=1`. Por eso solo la Misión 1 debe empezar con `?reset=1`; las misiones 2 y 3 empiezan en `/index.html`.
- **En celular** los enlaces del menú están tras el botón "Menú". El buscador sigue visible.
- **Página 404:** una dirección que no existe muestra "No encontramos esta página" con tres salidas.
- **Eventos de Hotjar:** cada botón con `id="btn-…"` envía `clic_…` (por ejemplo `clic_continuar_curso`). Lista completa en el README.
- **Páginas nuevas:** `/nodo-ia.html`, `/nodo-ia-caso.html?caso=c1` (también `c2` y `c3`) y `/coordinador.html`. Nodo IA ya está en el menú. La sección "Lo que no existe" de abajo quedó desactualizada: ya existen Nodo IA, "Examinar archivo", el panel "Contactar tutor", el glosario y la vista del coordinador, todos con contenido de demostración.
- **Botón "Contactar tutor":** está fijo abajo a la derecha en todas las páginas.
- Los textos para Maze, la checklist y las plantillas del informe están en `PLAN-EVALUACION-UX.md`.

## Misiones que el sitio ya permite

### Misión 1. Continuar mi curso

- **Inicio:** `/?reset=1`
- **Acción esperada:** botón amarillo **"Continuar mi curso"** en la tarjeta grande (id `btn-continuar-curso`).
- **Destino que indica éxito:** `/sesiones/sesion-01.html`, la primera sesión sin completar para un participante nuevo.
- **Rutas indirectas posibles:** "Explorar el mapa" → "Ver sesiones" → "Comenzar sesión" de la Sesión 01.
- **Para decidir con Miguel:** si prefieren que la misión termine en el módulo y no en la sesión, el destino sería `/modulo-evaluacion.html`. El cambio es una línea; avísenle antes de configurar Maze.

### Misión 2. Encontrar una actividad

Ejemplo de consigna: "Encuentra la actividad de la sesión 3 del módulo de evaluación".

- **Inicio:** `/index.html` (sin `reset`, para que el aviso no reaparezca)
- **Ruta esperada:**
  1. "Mapa del curso" en el menú, o el botón "Explorar el mapa" (id `btn-explorar-mapa`).
  2. **"Ver sesiones"** en el Módulo 03 (id `btn-ver-sesiones`).
  3. **"Comenzar sesión"** de la Sesión 03 (id `btn-sesion-03`).
- **Destino que indica éxito:** `/sesiones/sesion-03.html`. Ahí está la sección **"Actividad de la sesión 03"**.
- **Rutas indirectas posibles:**
  - Tarjeta "Módulo 03" del inicio → módulo → sesión.
  - Buscador: "sesión 3".
  - Lista lateral de sesiones dentro de cualquier sesión.

### Misión 3. Registrar una reflexión

- **Inicio:** `/index.html` (sin `reset`, para que el aviso no reaparezca)
- **Ruta esperada:**
  1. "Mi bitácora" en el menú, o **"Abrir mi bitácora"** (id `btn-abrir-bitacora`).
  2. Escribir en al menos uno de los campos (Lo que aprendí / Cómo lo aplico / Duda o hallazgo).
  3. **"Guardar borrador"** (id `btn-guardar-borrador`).
- **Destino que indica éxito:** `/bitacora-guardada.html`, que muestra "Tu borrador se guardó." y lo que se escribió. La URL termina en `?sesion=1` (o el número de la sesión que eligieron); si Maze lo permite, configuren el éxito como "la URL contiene `bitacora-guardada.html`".
- **Errores que se pueden observar:** si guardan sin escribir nada, aparece "Escribe algo en al menos un campo antes de guardar." y no se cambia de página.

## Heatmaps sugeridos en Hotjar

- `/` (Inicio): es por donde entran todas las misiones.
- `/mapa-curso.html` o `/modulo-evaluacion.html`, para la Misión 2.
- `/bitacora.html`, para la Misión 3.

## Lo que no existe (no lo incluyan en misiones)

- Nodo IA (en el menú aparece como "Próximamente").
- Contenidos reales de las sesiones, fechas de encuentros, entrega definitiva de la bitácora, carga de archivos y la vista del coordinador.
