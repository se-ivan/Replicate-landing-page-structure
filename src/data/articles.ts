export type ArticleSection = {
  heading: string;
  paragraphs: string[];
};

export type Article = {
  id: string;
  title: string;
  desc: string;
  tags: string[];
  img: string;
  intro: string;
  sections: ArticleSection[];
};

export const articles: Article[] = [
  {
    id: "envejecimiento-y-emociones",
    title: "Envejecimiento y Emociones",
    desc: "Comprender la adaptación emocional en la jubilación y la vejez ayuda a sostener bienestar y autonomía.",
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
