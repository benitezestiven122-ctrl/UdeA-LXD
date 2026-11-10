/* datos-demo.js — Ser profe en la era de la IA
 * CONTENIDO DE DEMOSTRACIÓN. Nada de esto es contenido oficial del diplomado
 * ni datos de personas reales. El equipo debe reemplazarlo por los textos
 * aprobados (ver 3-DOCUMENTACION/CONTEXTO.md, "Contenido de demostración").
 */
window.SPIA_DEMO = {

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
