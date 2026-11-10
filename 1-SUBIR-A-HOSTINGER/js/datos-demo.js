/* datos-demo.js — Ser profe en la era de la IA
 * CONTENIDO DE DEMOSTRACIÓN. Nada de esto es contenido oficial del diplomado
 * ni datos de personas reales. El equipo debe reemplazarlo por los textos
 * aprobados (ver 3-DOCUMENTACION/CONTEXTO.md, "Contenido de demostración").
 */
window.SPIA_DEMO = {

  /* Las 15 sesiones: títulos y fase tomados de la presentación sintética del
     diplomado (equipo LXD). No son de demostración. `claves` alimenta el buscador. */
  sesiones: [
    { titulo: '¿Qué está pasando? ¿La IA entra a nuestras aulas sin que lo hayamos decidido?', fase: 1, claves: 'dilemas mitos diario mapa colectivo selwyn diagnostico' },
    { titulo: 'La IA como objeto de análisis: materialidad, sesgos y costos invisibles', fase: 1, claves: 'crawford auditoria sesgo alucinacion materialidad sur global' },
    { titulo: 'Marcos regulatorios y el lugar de las Facultades de Educación en la agenda IA', fase: 1, claves: 'conpes 4144 minciencias unesco regulacion infografia politica publica' },
    { titulo: 'La mediación pedagógica reconfigurada: docente – IA – estudiante', fase: 2, claves: 'matetica papert construccionismo mediacion hito 1 bitacora didactica' },
    { titulo: 'Autoría, co-creación y la barrera del significado', fase: 2, claves: 'mitchell autoria matriz co-creacion declaracion' },
    { titulo: '¿Cómo aprenden mis estudiantes cuando tienen IA disponible?', fase: 2, claves: 'heutagogia blaschke dependencia alfabetizacion reflexion matetica' },
    { titulo: 'Rediseñar la evaluación: del producto al proceso', fase: 3, claves: 'evaluacion rubrica proceso retroalimentacion hito 2 instrumento' },
    { titulo: 'Planeación curricular y gestión académica: ¿dónde puede apoyar la IA?', fase: 3, claves: 'gestion planeacion mapa de practicas calendario automatizacion' },
    { titulo: 'La IA en la enseñanza de mi área disciplinar: alcances y límites reales', fase: 3, claves: 'disciplina ficha disciplinar hito 3 equidad herramientas' },
    { titulo: 'Ética de la IA en el aula: dilemas reales, decisiones situadas y límites pedagógicos', fase: 4, claves: 'etica deshonestidad privacidad datos ciudadania digital plan de uso' },
    { titulo: 'Soberanía tecnológica, automatización y bienestar docente', fase: 4, claves: 'soberania bienestar carga invisible wajcman solucionismo lineamientos' },
    { titulo: 'Elección definitiva de modalidad y arquitectura del Artefacto/Caja de Herramientas', fase: 5, claves: 'proyecto modalidad propuesta hito 4 hcltf kong cronograma' },
    { titulo: 'Desarrollo del Artefacto/Caja de Herramientas', fase: 5, claves: 'proyecto asesorias transferibilidad bitacora de proceso prototipo' },
    { titulo: 'Entrega del Artefacto/Caja de Herramientas', fase: 5, claves: 'entrega hito 5 diario de cierre presentacion coherencia' },
    { titulo: 'Presentación de Artefactos/Cajas de herramientas y cierre del diplomado', fase: 5, claves: 'plenaria cierre publicacion nodo ia lineamientos carta' }
  ],

  /* Glosario (HU-09). Definiciones propuestas, por aprobar. */
  glosario: [
    { t: 'IA generativa', d: 'Herramientas que crean textos, imágenes u otros contenidos nuevos a partir de lo que les pedimos.' },
    { t: 'instrucciones para la IA', d: 'Lo que le escribimos a la herramienta para pedirle algo. En inglés se conoce como «prompt».' },
    { t: 'mediación pedagógica', d: 'La forma en que el docente acompaña y da sentido al aprendizaje. La herramienta no la reemplaza.' },
    { t: 'soberanía tecnológica', d: 'Capacidad de una comunidad o institución para decidir qué tecnologías usa y cómo cuida sus datos.' },
    { t: 'encuentro sincrónico', d: 'Reunión en vivo, a la misma hora, entre participantes y equipo formador.' },
    { t: 'sesgo', d: 'Tendencia de una herramienta a favorecer ciertas respuestas por los datos con los que fue creada.' }
  ],

  /* Panel de tutor (HU-08). Sin nombres ni fotos: están pendientes. */
  tutores: [
    { ini: 'TP', rol: 'Tutoría pedagógica', nota: 'Dudas sobre actividades, bitácora y proyecto final.' },
    { ini: 'ST', rol: 'Soporte técnico', nota: 'Problemas para entrar, ver recursos o guardar.' },
    { ini: 'CO', rol: 'Coordinación', nota: 'Fechas, encuentros y certificación.' }
  ],
  bienvenida: 'Hola, somos el equipo tutor de la Facultad de Educación. Estamos aquí para acompañarte. Cuéntanos qué necesitas.',
  respuestas: [
    { q: 'No sé por dónde seguir', a: 'En Inicio, la tarjeta «Mi recorrido» te lleva a la sesión que sigue. Si prefieres ver todo el diplomado, entra al Mapa del curso.' },
    { q: '¿Mi bitácora quedó guardada?', a: 'Cuando guardas, pasamos a una página que dice «Tu borrador se guardó.» y muestra lo que escribiste. También queda en «Tus borradores».' },
    { q: 'Quiero hablar con una persona', a: 'Te acompañamos. En el diplomado te responderá una persona del equipo tutor; en esta demostración el mensaje no se envía.' }
  ],
  respuestaLibre: 'Recibimos tu mensaje. En esta demostración no llega al equipo tutor; en el diplomado te responderá una persona.',

  /* Nodo IA (HU-01). Casos de demostración. */
  disciplinas: ['Humanidades', 'Ciencias', 'Ingeniería', 'Salud', 'Otra'],
  reconocimientos: ['Me inspira', 'Lo aplicaría', 'Me deja pensando'],
  casos: [
    {
      id: 'c1', disciplina: 'Humanidades', tema: 'Evaluación',
      titulo: 'Rúbricas construidas con el grupo y revisadas con IA',
      resumen: 'Un curso de escritura usó IA generativa para proponer criterios de una rúbrica, y el grupo decidió cuáles conservar.',
      texto: [
        'La docente pidió a una herramienta de IA generativa un primer borrador de criterios para evaluar un ensayo. Lo llevó a clase sin decir de dónde venía.',
        'El grupo discutió cada criterio, eliminó dos y reescribió tres con sus palabras. Solo al final supieron que el borrador lo había hecho una herramienta. La conversación giró hacia el sesgo: ¿qué tipo de escritura premiaba ese borrador?'
      ],
      pregunta: '¿Qué parte de la evaluación no delegarías nunca en una herramienta?',
      comentarios: [
        { autor: 'Docente 04', texto: 'Me gusta que la decisión final quedó en el grupo. Yo probaría mostrando desde el inicio que el borrador venía de una herramienta.' },
        { autor: 'Docente 09', texto: '¿Cuánto tiempo de clase tomó la discusión de los criterios?' }
      ]
    },
    {
      id: 'c2', disciplina: 'Ciencias', tema: 'Pensamiento crítico',
      titulo: 'Contrastar las respuestas de la IA con las fuentes del laboratorio',
      resumen: 'En un laboratorio, cada equipo comparó una explicación generada por IA con sus propias mediciones.',
      texto: [
        'Cada equipo redactó sus instrucciones para la IA pidiendo una explicación del fenómeno que iban a medir. Luego hicieron la práctica y compararon.',
        'Tres equipos encontraron diferencias entre la explicación y sus datos. La actividad terminó con una pregunta escrita en el tablero: ¿a quién le creemos y por qué?'
      ],
      pregunta: '¿Cómo ayudas a tus estudiantes a dudar con método de lo que responde una herramienta?',
      comentarios: [
        { autor: 'Docente 02', texto: 'Lo adaptaría pidiendo que cada equipo guarde la conversación con la herramienta como evidencia.' }
      ]
    },
    {
      id: 'c3', disciplina: 'Ingeniería', tema: 'Ética',
      titulo: 'Acuerdos de aula para usar IA en los proyectos del semestre',
      resumen: 'Un curso de proyectos escribió, entre docente y estudiantes, cuándo se vale usar IA y cómo declararlo.',
      texto: [
        'En la primera semana, el grupo redactó cinco acuerdos: en qué etapas del proyecto se puede usar IA generativa, cómo se declara y qué datos no se comparten con ninguna herramienta.',
        'El último acuerdo habla de soberanía tecnológica: el curso decidió qué herramientas usar según dónde quedan guardados los datos del proyecto.'
      ],
      pregunta: '¿Qué acuerdo sobre IA te gustaría construir con tu grupo?',
      comentarios: []
    }
  ],

  /* Nodo IA: lecturas. Las referencias son documentos reales; los resúmenes
     son de demostración (redactados con IA) y deben verificarse con la fuente. */
  papers: [
    {
      id: 'p1', disciplina: 'Transversal', tema: 'Ética', rel: ['c3', 'c1'],
      titulo: 'Orientaciones para la IA generativa en la educación y la investigación',
      autores: 'UNESCO', anio: '2023', fuente: 'Documento de política educativa',
      resumen: 'Guía internacional para que escuelas y universidades usen la IA generativa con un enfoque centrado en las personas.',
      hallazgos: [
        'Propone regular la IA generativa poniendo a las personas en el centro.',
        'Recomienda validar las herramientas antes de llevarlas al aula y proteger los datos de los estudiantes.',
        'Pide fortalecer la formación docente para usar estas herramientas con criterio.'
      ],
      pregunta: '¿Qué validación harías antes de usar una herramienta nueva con tu grupo?'
    },
    {
      id: 'p2', disciplina: 'Transversal', tema: 'Aprendizaje con IA', rel: ['c1', 'c2'],
      titulo: 'ChatGPT for good? On opportunities and challenges of large language models for education',
      autores: 'Kasneci, E. y otros', anio: '2023', fuente: 'Learning and Individual Differences',
      resumen: 'Artículo que revisa qué pueden aportar los modelos de lenguaje a la educación y qué riesgos traen.',
      hallazgos: [
        'Señala oportunidades como el apoyo a la escritura, la retroalimentación y la personalización.',
        'Advierte sobre sesgos, errores y dependencia de la herramienta.',
        'Insiste en formar a docentes y estudiantes para un uso crítico.'
      ],
      pregunta: '¿Qué oportunidad de esta lista ya estás usando y cuál te preocupa?'
    },
    {
      id: 'p3', disciplina: 'Transversal', tema: 'Investigación', rel: ['p2', 'b2'],
      titulo: 'Systematic review of research on artificial intelligence applications in higher education – where are the educators?',
      autores: 'Zawacki-Richter, O. y otros', anio: '2019', fuente: 'International Journal of Educational Technology in Higher Education',
      resumen: 'Revisión sistemática de la investigación sobre IA en educación superior y de quiénes la hacen.',
      hallazgos: [
        'La mayoría de los estudios revisados venían de campos técnicos, con poca participación de educadores.',
        'Encontró poca reflexión sobre las implicaciones pedagógicas y éticas.',
        'Invita a los educadores a participar más en la investigación sobre IA.'
      ],
      pregunta: '¿Qué pregunta de investigación sobre IA podrías hacer desde tu propia aula?'
    },
    {
      id: 'p4', disciplina: 'Transversal', tema: 'Ética', rel: ['p1'],
      titulo: 'Consenso de Beijing sobre la inteligencia artificial y la educación',
      autores: 'UNESCO', anio: '2019', fuente: 'Documento final de conferencia internacional',
      resumen: 'Acuerdo internacional sobre cómo orientar la IA para que fortalezca la educación.',
      hallazgos: [
        'Plantea que la IA debe apoyar a los docentes, no reemplazarlos.',
        'Promueve un uso equitativo e inclusivo de la IA en la educación.',
        'Pide políticas públicas que acompañen su adopción.'
      ],
      pregunta: '¿Cómo se ve, en tu clase, una IA que apoya y no reemplaza?'
    },
    {
      id: 'p5', disciplina: 'Transversal', tema: 'Pensamiento crítico', rel: ['c2', 'b3'],
      titulo: 'Artificial Intelligence in Education: Promises and Implications for Teaching and Learning',
      autores: 'Holmes, W., Bialik, M. y Fadel, C.', anio: '2019', fuente: 'Center for Curriculum Redesign (libro)',
      resumen: 'Libro que examina qué promete la IA para la enseñanza y qué implica para lo que enseñamos.',
      hallazgos: [
        'Distingue entre aprender con IA, aprender sobre IA y prepararse para convivir con ella.',
        'Discute promesas y límites de la IA en la enseñanza.',
        'Invita a repensar qué y cómo se enseña.'
      ],
      pregunta: '¿Qué contenido de tu curso cambiarías si tus estudiantes ya usan IA a diario?'
    }
  ],

  /* Bitácoras de ejemplo, con multimedia ilustrativa. */
  bitacorasEjemplo: [
    {
      id: 'b1', autor: 'Docente 05', sesion: 'Sesión 02', disciplina: 'Humanidades', tema: 'Evaluación', rel: ['c1', 'p2'],
      titulo: 'Mi primera rúbrica revisada con el grupo',
      resumen: 'Llevé a clase una rúbrica que empezó como borrador de una herramienta de IA generativa y la terminamos entre todos.',
      partes: [
        ['Lo que aprendí', 'Que el borrador de la herramienta era un punto de partida útil, pero premiaba un solo estilo de escritura.'],
        ['Cómo lo aplico', 'Voy a mostrar el borrador desde el inicio y pedir al grupo que lo corrija antes de usarlo.'],
        ['Duda o hallazgo', '¿Cómo explicarle a otros colegas que la rúbrica final es del grupo y no de la herramienta?']
      ],
      media: [{ tipo: 'imagen', ilus: 'rubrica', pie: 'Foto del tablero con la rúbrica final', alt: 'Ilustración de una rúbrica en una cuadrícula de cuatro columnas', ejemplo: true }]
    },
    {
      id: 'b2', autor: 'Docente 07', sesion: 'Sesión 04', disciplina: 'Ciencias', tema: 'Pensamiento crítico', rel: ['c2', 'p5'],
      titulo: 'Lo que midió el laboratorio y lo que dijo la IA',
      resumen: 'Comparamos una explicación generada por IA con las mediciones del grupo. No coincidían en todo.',
      partes: [
        ['Lo que aprendí', 'La diferencia entre la explicación y los datos abrió la mejor discusión del semestre.'],
        ['Cómo lo aplico', 'Cada equipo va a guardar sus instrucciones para la IA como parte de la evidencia.'],
        ['Duda o hallazgo', 'Tres equipos confiaron más en la herramienta que en sus propias mediciones.']
      ],
      media: [
        { tipo: 'imagen', ilus: 'barras', pie: 'Gráfica de las mediciones del grupo', alt: 'Ilustración de una gráfica de barras', ejemplo: true },
        { tipo: 'video', pie: 'Video corto de la práctica', duracion: '1:24', ejemplo: true }
      ]
    },
    {
      id: 'b3', autor: 'Docente 11', sesion: 'Sesión 03', disciplina: 'Ingeniería', tema: 'Ética', rel: ['c3', 'p1'],
      titulo: 'Acuerdos de aula: lo que cambió en la semana 3',
      resumen: 'El grupo revisó los acuerdos sobre IA que escribimos en la primera semana. Grabé una nota de voz al salir de clase.',
      partes: [
        ['Lo que aprendí', 'Los acuerdos funcionan cuando el grupo los revisa, no cuando solo se firman.'],
        ['Cómo lo aplico', 'Dejaré diez minutos cada tres semanas para revisarlos.'],
        ['Duda o hallazgo', '¿Qué hago con los datos del proyecto que ya se compartieron con una herramienta?']
      ],
      media: [
        { tipo: 'audio', pie: 'Nota de voz con mi reflexión', duracion: '0:42', ejemplo: true },
        { tipo: 'imagen', ilus: 'aula', pie: 'Mapa de ideas del grupo', alt: 'Ilustración abstracta de círculos conectados', ejemplo: true }
      ]
    }
  ],

  /* Vista de coordinador (HU-15). Cohorte ficticia. */
  cohorte: [
    { id: 'Docente 01', hechas: 8, dias: 1, bitacoras: 7 },
    { id: 'Docente 02', hechas: 7, dias: 2, bitacoras: 6 },
    { id: 'Docente 03', hechas: 2, dias: 14, bitacoras: 1 },
    { id: 'Docente 04', hechas: 5, dias: 6, bitacoras: 3 },
    { id: 'Docente 05', hechas: 9, dias: 0, bitacoras: 8 },
    { id: 'Docente 06', hechas: 1, dias: 18, bitacoras: 0 },
    { id: 'Docente 07', hechas: 6, dias: 3, bitacoras: 5 },
    { id: 'Docente 08', hechas: 4, dias: 7, bitacoras: 2 },
    { id: 'Docente 09', hechas: 7, dias: 1, bitacoras: 7 },
    { id: 'Docente 10', hechas: 3, dias: 11, bitacoras: 1 },
    { id: 'Docente 11', hechas: 8, dias: 2, bitacoras: 6 },
    { id: 'Docente 12', hechas: 5, dias: 5, bitacoras: 4 }
  ]
};
