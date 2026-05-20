export type ArticleSection = {
  heading: string;
  navLabel?: string;
  navLabels?: string[];
  paragraphs: string[];
  bullets?: string[];
};

export type ArticleAudience = "psicologia" | "legal" | "ambos";

export type Article = {
  id: string;
  title: string;
  desc: string;
  audience: ArticleAudience;
  tags: string[];
  img: string;
  intro: string;
  readingTimeMinutes?: number | null;
  headerMeta?: string;
  tocTitle?: string;
  sections: ArticleSection[];
};

export const articles: Article[] = [
  {
    id: "terapia-grupal-adultez-mayor",
    title: "Beneficios de asistir a terapia grupal en la adultez mayor",
    desc: "Un espacio cálido para sentirse acompañado, escuchado y emocionalmente fortalecido durante esta etapa de la vida.",
    audience: "psicologia",
    tags: ["Psicología", "Terapia Grupal", "Adultos Mayores"],
    img: "https://images.unsplash.com/photo-1753362594001-60c847cab56a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200&q=80",
    intro:
      "Tener un espacio para sentirse acompañado, escuchado y emocionalmente fortalecido puede transformar la forma de vivir la adultez mayor. Con el paso de los años, muchas personas comienzan a sentirse más solas, aisladas, preocupadas o poco comprendidas.",
    sections: [
      {
        heading: "Un espacio cálido y seguro",
        paragraphs: [
          "La jubilación, los cambios en la salud, la pérdida de seres queridos o el distanciamiento social pueden afectar el estado de ánimo y la tranquilidad emocional.",
          "En estos momentos, la terapia grupal brinda un espacio cálido y seguro donde podrá compartir experiencias con personas que están pasando por lo mismo, aprender herramientas para sentirse acompañado y descubrir que no tiene que enfrentar esta etapa en soledad.",
          "A veces, hablar con personas que viven situaciones parecidas puede ayudar más de lo que imaginamos.",
        ],
      },
      {
        heading: "¿Qué es la terapia grupal?",
        paragraphs: [
          "Es un espacio guiado por una profesional de la salud emocional donde varias personas comparten experiencias, emociones y herramientas para sentirse mejor.",
          "No necesita tener un problema grave para asistir. Muchas personas participan simplemente porque desean sentirse más tranquilas, comprendidas y acompañadas.",
        ],
      },
      {
        heading: "1. Ayuda a disminuir la soledad",
        paragraphs: [
          "Muchas personas adultas mayores pasan gran parte del tiempo solas, lo cual puede generar tristeza o desánimo. La terapia grupal ayuda a recuperar el interés por convivir y participar.",
          "Sentirse parte de un grupo mejora el ánimo y la motivación.",
        ],
        bullets: ["Sentirse acompañado", "Convivir con otras personas", "Recuperar el interés por convivir y participar"],
      },
      {
        heading: "2. Le permite sentirse comprendido",
        paragraphs: [
          "Escuchar a otras personas hablar de situaciones similares ayuda a entender que lo que siente es válido y más común de lo que parece.",
          "Compartir experiencias genera alivio emocional.",
        ],
        bullets: ["Preocupaciones", "Miedos", "Tristeza", "Cambios familiares", "Dificultades emocionales"],
      },
      {
        heading: "3. Mejora el estado de ánimo",
        paragraphs: [
          "Participar en actividades grupales ayuda a reducir la tristeza, el aislamiento, la ansiedad y la falta de motivación.",
          "Convivir y hablar con otras personas favorece emociones más positivas y una mejor actitud ante la vida.",
        ],
      },
      {
        heading: "4. Mantiene la mente activa",
        paragraphs: [
          "Conversar, escuchar, reflexionar y participar ayuda a fortalecer la memoria, la atención, la comunicación y la agilidad mental.",
          "Mantener la mente activa también es una forma de cuidar la salud.",
        ],
      },
      {
        heading: "5. Fortalece la confianza y la comunicación",
        paragraphs: [
          "La terapia grupal ayuda a expresar emociones y necesidades con mayor claridad y seguridad.",
          "Muchas personas logran comunicarse mejor con su familia, sentirse más seguras al hablar y expresar emociones sin miedo o vergüenza.",
        ],
      },
      {
        heading: "6. Motiva a recuperar actividades y proyectos",
        paragraphs: [
          "Ver el avance y entusiasmo de otras personas puede inspirarle a retomar actividades, hacer nuevas amistades, recuperar pasatiempos y encontrar nuevas metas.",
          "Nunca es tarde para comenzar algo nuevo.",
        ],
      },
      {
        heading: "7. Ayuda a resolver problemas cotidianos",
        paragraphs: [
          "En el grupo se comparten experiencias y consejos útiles relacionados con la salud, la familia, la jubilación, los trámites, los cuidados personales y las actividades recreativas.",
          "Escuchar diferentes puntos de vista ayuda a sentirse más orientado y tranquilo.",
        ],
      },
      {
        heading: "8. Favorece el apoyo emocional mutuo",
        paragraphs: [
          "Sentirse escuchado y escuchar a otras personas fortalece el sentido de pertenencia y compañía.",
          "Ayudar a otros también puede ayudarle a sentirse mejor consigo mismo.",
        ],
      },
      {
        heading: "9. Ayuda a recuperar tranquilidad emocional",
        paragraphs: [
          "Hablar de lo que siente evita guardar emociones que con el tiempo pueden afectar la salud física y emocional.",
          "La terapia grupal favorece mayor calma, mejor descanso, menos preocupación y más bienestar emocional.",
        ],
      },
      {
        heading: "10. Disfrutar esta etapa de la vida",
        paragraphs: [
          "La adultez mayor también puede ser una etapa de crecimiento, tranquilidad y nuevas experiencias.",
          "Participar en terapia grupal puede ayudarle a sentirse útil y valorado, recuperar ilusión y motivación, y vivir con mayor plenitud emocional.",
        ],
      },
      {
        heading: "Este puede ser el momento de comenzar a sentirse mejor",
        paragraphs: [
          "No espere a que la tristeza, la soledad o la preocupación aumenten. Muchas personas descubren demasiado tarde que sí necesitaban apoyo emocional.",
          "Pedir ayuda no es señal de debilidad. Es una forma de cuidarse y darse la oportunidad de vivir con más tranquilidad.",
          "Entre más pronto comience, más rápido podrá sentirse acompañado, comprendido y emocionalmente fortalecido.",
        ],
      },
      {
        heading: "Reserve hoy su lugar",
        paragraphs: [
          "El cupo es limitado y el espacio se desarrolla en un ambiente cálido, respetuoso y con atención especializada para adultos mayores.",
          "Comenzar puede ser el primer paso para sentirse mejor y disfrutar esta etapa con mayor tranquilidad y bienestar emocional.",
        ],
      },
    ],
  },
  {
    id: "terapia-individual-adultez-mayor",
    title: "Beneficios de la terapia individual en la adultez mayor",
    desc: "Un espacio seguro y confidencial para sentirse escuchado, acompañado y emocionalmente tranquilo.",
    audience: "psicologia",
    tags: ["Psicología", "Terapia Individual", "Adultos Mayores"],
    img: "https://images.unsplash.com/photo-1765447041709-9f1efbc81606?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200&q=80",
    intro:
      "A lo largo de la vida ha cuidado de su familia, su trabajo y muchas responsabilidades. Ahora también merece un espacio para sentirse escuchado, acompañado y emocionalmente tranquilo.",
    sections: [
      {
        heading: "Es momento de cuidar de usted",
        paragraphs: [
          "No espere a sentirse completamente agotado para buscar apoyo. Hablar con un profesional puede ayudarle a recuperar bienestar, seguridad y tranquilidad desde hoy.",
          "La terapia es un espacio seguro, confidencial y respetuoso donde usted puede hablar libremente, sentirse comprendido y encontrar herramientas para vivir esta etapa con mayor calma y plenitud.",
        ],
      },
      {
        heading: "Sanar pérdidas y aliviar el dolor emocional",
        paragraphs: [
          "La pérdida de una pareja, amistades, familiares o los cambios importantes en la vida pueden generar tristeza profunda, soledad o vacío emocional.",
          "Usted no tiene que enfrentar estos momentos en soledad.",
        ],
        bullets: [
          "Expresar lo que siente sin guardárselo",
          "Comprender y aliviar el dolor emocional",
          "Recuperar tranquilidad poco a poco",
          "Sentirse acompañado durante el proceso",
        ],
      },
      {
        heading: "Recuperar el ánimo y el bienestar emocional",
        paragraphs: [
          "Sentirse desanimado, preocupado o sin ganas de hacer actividades no tiene por qué formar parte de su rutina diaria.",
          "Entre más pronto comience, más rápido podrá sentirse mejor.",
        ],
        bullets: [
          "Recuperar motivación",
          "Disminuir sentimientos de tristeza y ansiedad",
          "Sentirse más tranquilo y seguro",
          "Volver a disfrutar actividades cotidianas",
        ],
      },
      {
        heading: "Adaptarse mejor a los cambios de esta etapa",
        paragraphs: [
          "La jubilación, los cambios físicos o los problemas de salud pueden generar miedo o incertidumbre.",
          "Está a tiempo de construir una vida llena de bienestar y tranquilidad.",
        ],
        bullets: [
          "Aceptar cambios con mayor serenidad",
          "Recuperar confianza en usted mismo",
          "Encontrar nuevas metas y actividades",
          "Vivir esta etapa con mayor plenitud",
        ],
      },
      {
        heading: "Mantener la mente activa y fortalecida",
        paragraphs: [
          "Hablar, reflexionar y expresar emociones ayuda a mantener una mente más activa y saludable.",
          "Cuidar la salud emocional también es cuidar la salud física.",
        ],
        bullets: ["Claridad mental", "Concentración", "Comunicación", "Bienestar emocional"],
      },
      {
        heading: "Fortalecer la relación con la familia",
        paragraphs: [
          "Muchas veces las emociones acumuladas generan conflictos o distanciamiento con hijos, nietos o cuidadores.",
          "Una mejor relación familiar también mejora su tranquilidad emocional.",
        ],
        bullets: [
          "Expresar necesidades con claridad",
          "Sentirse escuchado",
          "Mejorar la comunicación familiar",
          "Evitar sentirse una carga",
        ],
      },
      {
        heading: "Es el momento de comenzar a sentirse mejor",
        paragraphs: [
          "No espere a que la tristeza, la soledad o la preocupación aumenten. Buscar apoyo psicológico es un acto de cuidado personal, valentía y amor propio.",
          "Cada paso que dé hoy puede ayudarle a vivir esta etapa con mayor calma, seguridad y bienestar emocional.",
        ],
      },
      {
        heading: "Agenda hoy su espacio de acompañamiento",
        paragraphs: [
          "Permítase sentirse escuchado, comprendido y acompañado. Su bienestar emocional también es importante.",
          "Comenzar puede ser más sencillo de lo que imagina.",
        ],
      },
    ],
  },
  {
    id: "depresion-no-es-normal-envejecimiento",
    title: "La depresión no es una parte normal del envejecimiento",
    desc: "Sentirse triste o solo no debe aceptarse como inevitable: con apoyo psicológico es posible recuperar bienestar.",
    audience: "psicologia",
    tags: ["Psicología", "Depresión", "Bienestar Emocional"],
    img: "https://images.unsplash.com/photo-1749325390269-b9764b27f613?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200&q=80",
    intro:
      "Muchas personas creen que sentirse tristes o solas es algo normal en esta etapa de la vida. Pero vivir con depresión no debe aceptarse como algo inevitable.",
    sections: [
      {
        heading: "Con apoyo es posible sentirse mejor",
        paragraphs: [
          "Con apoyo psicológico adecuado es posible recuperar tranquilidad, motivación y bienestar emocional.",
          "Pedir ayuda también es una forma de cuidarse.",
        ],
      },
      {
        heading: "¿Cómo ayuda la terapia psicológica?",
        paragraphs: [
          "El acompañamiento psicológico ofrece un espacio seguro para hablar de lo que duele, ordenar emociones y recuperar recursos personales.",
        ],
        bullets: [
          "Expresar emociones guardadas",
          "Disminuir tristeza y ansiedad",
          "Recuperar el interés por la vida",
          "Mejorar la comunicación familiar",
          "Sentirse acompañado y comprendido",
          "Fortalecer autoestima y seguridad emocional",
        ],
      },
      {
        heading: "No espere a sentirse peor para buscar apoyo",
        paragraphs: [
          "Muchas personas pasan meses o años viviendo en silencio con tristeza, soledad o preocupación.",
          "Entre más pronto se reciba apoyo, mayores son las posibilidades de sentirse mejor emocionalmente y recuperar calidad de vida.",
          "Usted merece sentirse escuchado, acompañado y emocionalmente tranquilo.",
        ],
      },
      {
        heading: "Agenda hoy su espacio de acompañamiento",
        paragraphs: [
          "Reciba atención cálida y respetuosa en un espacio seguro, confidencial y especializado en adultos mayores.",
        ],
      },
    ],
  },
  {
    id: "envejecimiento-y-emociones",
    title: "Envejecimiento y Emociones",
    desc: "Comprender la adaptación emocional en la jubilación y la vejez ayuda a sostener bienestar y autonomía.",
    audience: "ambos",
    tags: ["Psicología", "Jubilación", "Salud Mental"],
    img: "/images/articles/prepararte-jubilacion.png",
    intro:
      "El envejecimiento es un proceso dinámico que transforma rutinas, roles e identidad. No se trata solo de edad cronológica, sino de cómo cada persona reorganiza su vida emocional frente a cambios físicos, sociales y económicos.",
    sections: [
      {
        heading: "Reconfiguración de la identidad",
        paragraphs: [
          "La jubilación suele cerrar una etapa de reconocimiento social ligada al trabajo. Cuando ese rol desaparece, muchas personas atraviesan una transición interna marcada por preguntas sobre propósito y pertenencia.",
          "Este ajuste no es lineal: puede pasar por entusiasmo inicial, desencanto, reorientación y finalmente estabilización. Identificar estas fases reduce culpa y permite pedir apoyo a tiempo.",
        ],
      },
      {
        heading: "Ansiedad en la vejez",
        paragraphs: [
          "La ansiedad puede presentarse como miedo a perder independencia, preocupación por la salud o incertidumbre económica. A veces se confunde con síntomas físicos o con deterioro cognitivo, retrasando su abordaje.",
          "Una percepción negativa del envejecimiento incrementa el malestar. En cambio, cuando se fortalece la resiliencia y una mirada activa sobre la etapa vital, la ansiedad disminuye y mejora la funcionalidad cotidiana.",
        ],
      },
      {
        heading: "Intervenciones útiles",
        paragraphs: [
          "La atención integral combina terapia psicológica, seguimiento médico y hábitos sostenibles. La terapia cognitivo-conductual puede ayudar a reformular pensamientos de pérdida y a construir estrategias de afrontamiento.",
          "El ejercicio regular, una rutina de sueño estable y prácticas de relajación también contribuyen a reducir tensión emocional y mejorar calidad de vida.",
        ],
      },
    ],
  },
  {
    id: "envejecer-con-plenitud",
    title: "Envejecer con plenitud",
    desc: "La plenitud en esta etapa se construye con propósito, vínculos y participación activa en la comunidad.",
    audience: "ambos",
    tags: ["Plenitud", "Resiliencia", "Envejecimiento Activo"],
    img: "/images/articles/protege-bienes.png",
    intro:
      "Envejecer con plenitud no implica negar los cambios, sino integrarlos con sentido. La resiliencia puede desarrollarse en cualquier momento de la vida y es uno de los mejores predictores de bienestar en la adultez mayor.",
    sections: [
      {
        heading: "Participación social significativa",
        paragraphs: [
          "Las conexiones sociales protegen contra el aislamiento y favorecen la salud mental. Participar en grupos, actividades cívicas o voluntariado fortalece la autoestima y renueva objetivos personales.",
          "El envejecimiento activo incluye participación social, cultural y comunitaria, más allá de la actividad física.",
        ],
      },
      {
        heading: "Estimulación física e intelectual",
        paragraphs: [
          "Caminar, bailar o realizar ejercicios de fuerza de forma adaptada mejora equilibrio, movilidad e independencia. En paralelo, aprender nuevas habilidades sostiene la agilidad cognitiva.",
          "La continuidad de rutinas de aprendizaje también favorece la motivación y el sentido de logro.",
        ],
      },
      {
        heading: "Autonomía con dignidad",
        paragraphs: [
          "Preservar la capacidad de decisión en asuntos cotidianos es clave para la dignidad. Evitar la infantilización y promover elecciones reales fortalece identidad y bienestar emocional.",
          "La plenitud también necesita entornos accesibles y redes familiares que acompañen sin anular la autonomía.",
        ],
      },
    ],
  },
  {
    id: "consejos-para-envejecer",
    title: "Consejos para envejecer",
    desc: "Acciones sencillas en casa y en hábitos diarios pueden mejorar seguridad, energía y confianza.",
    audience: "ambos",
    tags: ["Bienestar", "Autonomía", "Prevención"],
    img: "/images/articles/cambio-identidad.png",
    intro:
      "La calidad de vida en la adultez mayor mejora cuando el entorno y la rutina diaria se adaptan de forma práctica. Pequeños cambios sostenidos tienen un impacto acumulativo alto.",
    sections: [
      {
        heading: "Hogar seguro y funcional",
        paragraphs: [
          "Instalar pasamanos, reforzar iluminación y evitar superficies resbalosas reduce caídas y mejora independencia. La seguridad física es base de la tranquilidad emocional.",
          "También conviene reorganizar espacios para facilitar movilidad y acceso a objetos de uso frecuente.",
        ],
      },
      {
        heading: "Hábitos de salud sostenibles",
        paragraphs: [
          "Una alimentación equilibrada y una rutina de sueño consistente ayudan a mantener energía y estabilidad emocional. Mantenerse hidratado y activo favorece función cognitiva y cardiovascular.",
          "Los controles médicos periódicos permiten prevenir complicaciones y ajustar tratamientos oportunamente.",
        ],
      },
      {
        heading: "Tecnología como apoyo",
        paragraphs: [
          "Herramientas simples como recordatorios, asistentes de voz o videollamadas facilitan tareas diarias y fortalecen contacto social.",
          "Usar tecnología de forma gradual y acompañada puede aumentar seguridad sin generar frustración.",
        ],
      },
    ],
  },
  {
    id: "apoyo-a-familiares-y-cuidadores",
    title: "Apoyo a familiares y cuidadores",
    desc: "Cuidar también implica cuidarse: apoyo, descanso y comunicación clara previenen el agotamiento.",
    audience: "ambos",
    tags: ["Cuidadores", "Familia", "Autocuidado"],
    img: "/images/articles/derechos-salud.png",
    intro:
      "El cuidado de una persona mayor exige coordinación, paciencia y recursos emocionales. Para sostener un cuidado de calidad en el tiempo, la red familiar debe distribuir responsabilidades y priorizar el bienestar del cuidador principal.",
    sections: [
      {
        heading: "Prevención del burnout",
        paragraphs: [
          "El agotamiento del cuidador suele aparecer cuando se acumulan tareas sin descanso ni apoyo. Señales como irritabilidad, insomnio y dolores frecuentes indican que es momento de reorganizar cargas.",
          "Pedir ayuda concreta y calendarizada facilita que la familia participe de manera real.",
        ],
      },
      {
        heading: "Estrategias prácticas de apoyo",
        paragraphs: [
          "Dividir tareas, programar tiempos de relevo y usar servicios de cuidado temporal permite sostener la atención sin deteriorar la salud del cuidador.",
          "Los grupos de apoyo aportan contención emocional y soluciones aplicables al día a día.",
        ],
      },
      {
        heading: "Comunicación y respeto",
        paragraphs: [
          "La comunicación empática con la persona mayor debe priorizar su autonomía y su dignidad. Acompañar no significa decidir por completo en su lugar.",
          "Cuando la familia sostiene acuerdos claros y respetuosos, disminuyen conflictos y mejora la calidad del cuidado.",
        ],
      },
    ],
  },
];

export const articlesById = Object.fromEntries(
  articles.map((article) => [article.id, article]),
) as Record<string, Article>;
