import type { SiteContent } from './types';

export const es: SiteContent = {
  items: {
    tasks: {
      name: 'Tareas',
      desc: 'Bandeja, hoy y próximos, con prioridades y subtareas',
    },
    calendar: {
      name: 'Calendario y Google Calendar',
      short: 'Calendario',
      desc: 'Sincronización bidireccional con tu agenda',
    },
    planner: {
      name: 'Planificador con IA',
      desc: 'Lumina reparte tus tareas en tu horario laboral',
    },
    focus: {
      name: 'Modo enfoque',
      desc: 'Sesiones de trabajo profundo y descansos',
    },
    timeBlocks: {
      name: 'Bloques de tiempo',
      desc: 'Lumina los propone, tú los confirmas',
    },
    workspaces: {
      name: 'Workspaces y notas',
      desc: 'Markdown con vista previa en vivo',
    },
    projects: { name: 'Proyectos', desc: 'Agrupa tus documentos por proyecto' },
    templates: {
      name: 'Plantillas',
      desc: 'Documentos y planes listos para usar',
    },
    insights: {
      name: 'Insights y ventana dorada',
      short: 'Insights',
      desc: 'Las horas en que mejor te concentras',
    },
    lumina: {
      name: 'Lumina IA',
      desc: 'Tu asistente de IA para planificar y enfocarte',
    },
    students: {
      name: 'Estudiantes',
      desc: 'Reparte el estudio de cada examen en bloques antes de la fecha.',
    },
    freelancers: {
      name: 'Freelancers',
      desc: 'Equilibra varios clientes y registra el tiempo de cada proyecto.',
    },
    developers: {
      name: 'Desarrolladores',
      desc: 'Protege horas de trabajo profundo entre reuniones.',
    },
    creators: {
      name: 'Creadores',
      desc: 'Planifica guion, grabación y publicación en la misma semana.',
    },
    pricing: { name: 'Precios', desc: 'Planes Gratis, Pro y Empresarial' },
    help: { name: 'Centro de ayuda', desc: 'Guías y respuestas paso a paso' },
    changelog: { name: 'Novedades', desc: 'Cambios y mejoras de cada versión' },
  },

  pages: {
    tasks: {
      group: 'Producto · Planifica',
      title: 'Todas tus tareas, en orden',
      sub: 'Bandeja, hoy y próximos, con prioridades, etiquetas, subtareas y registro de tiempo en una sola lista.',
      blocks: [
        [
          'Bandeja, Hoy y Próximos',
          'Captura todo en la bandeja y decide después. Hoy muestra lo que toca; Próximos, lo que viene.',
        ],
        [
          'Prioridades y etiquetas',
          'Marca lo urgente y agrupa por contexto, cliente o asignatura.',
        ],
        [
          'Subtareas y registro de tiempo',
          'Divide el trabajo en pasos y registra cuánto te lleva cada uno.',
        ],
      ],
    },
    calendar: {
      group: 'Producto · Planifica',
      title: 'Tu calendario y tus tareas, por fin juntos',
      sub: 'Sincronización bidireccional con Google Calendar: lo que cambias en un lado aparece en el otro.',
      blocks: [
        [
          'Sincronización bidireccional',
          'Tus eventos de Google Calendar aparecen en Focusly y lo que creas en Focusly aparece en Google Calendar.',
        ],
        [
          'Eventos y bloques en una vista',
          'Ve tus reuniones, clases y bloques de enfoque en la misma semana.',
        ],
        [
          'Nada sin tu confirmación',
          'Lumina propone bloques; solo se añaden a tu calendario cuando los confirmas.',
        ],
      ],
    },
    planner: {
      group: 'Producto · Planifica',
      title: 'Tu semana planificada en minutos',
      sub: 'Lumina reparte tus tareas en tu horario laboral y te propone un plan semanal.',
      blocks: [
        [
          'Respeta tu horario laboral',
          'Los bloques se colocan dentro de las horas que defines como laborables.',
        ],
        [
          'Revisa antes de confirmar',
          'Ajusta o descarta cualquier bloque y confirma el plan con un clic.',
        ],
        [
          'Directo a Google Calendar',
          'El plan confirmado aparece en tu agenda.',
        ],
      ],
    },
    focus: {
      group: 'Producto · Enfócate',
      title: 'Sesiones de trabajo profundo, con descansos',
      sub: 'Un temporizador para concentrarte en una tarea y descansar entre sesiones.',
      blocks: [
        [
          'Temporizador de sesiones',
          'Elige una tarea y trabaja en ella sin cambiar de pestaña.',
        ],
        [
          'Descansos entre sesiones',
          'Alterna trabajo profundo y pausas para mantener el ritmo.',
        ],
        [
          'Tus horas cuentan',
          'Cada sesión alimenta tus Insights: horas de enfoque y ventana dorada.',
        ],
      ],
    },
    timeBlocks: {
      group: 'Producto · Enfócate',
      title: 'Reserva tiempo para lo que importa',
      sub: 'Bloques de enfoque en tu calendario que Lumina propone y tú confirmas con un clic.',
      blocks: [
        [
          'Propuestos por Lumina',
          'Lumina busca huecos en tu semana para cada tarea.',
        ],
        ['Confirmados con un clic', 'Acepta todos, uno a uno o ninguno.'],
        [
          'Visibles en Google Calendar',
          'Tus bloques aparecen en tu agenda para que nadie ocupe ese tiempo.',
        ],
      ],
    },
    workspaces: {
      group: 'Producto · Organiza',
      title: 'Documentos junto a tu trabajo',
      sub: 'Escribe en Markdown con vista previa en vivo y ten tus notas al lado de tus tareas.',
      blocks: [
        [
          'Markdown con vista previa en vivo',
          'Escribe con formato sin salir del teclado y ve el resultado al instante.',
        ],
        [
          'Organizados en proyectos',
          'Cada documento vive dentro de su proyecto.',
        ],
        [
          'Lumina los entiende',
          'Menciona un documento con @ y Lumina responde con su contexto.',
        ],
      ],
    },
    projects: {
      group: 'Producto · Organiza',
      title: 'Cada proyecto, en su sitio',
      sub: 'Agrupa los documentos de un mismo proyecto dentro de tus workspaces.',
      blocks: [
        ['Un espacio por proyecto', 'Notas, especificaciones y planes juntos.'],
        [
          'Empieza con plantillas',
          'Crea la estructura del proyecto a partir de una plantilla.',
        ],
        [
          'Contexto para Lumina',
          'Lumina puede usar los documentos del proyecto para responderte.',
        ],
      ],
    },
    insights: {
      group: 'Producto · Entiende',
      title: 'Descubre cuándo trabajas mejor',
      sub: 'Horas de enfoque, tareas completadas, puntuación de energía, ventana dorada, mapa de calor y tendencias.',
      blocks: [
        [
          'Horas de enfoque y tareas completadas',
          'Mira cuánto trabajo profundo haces y cuánto terminas cada semana.',
        ],
        [
          'Puntuación de energía',
          'Sigue cómo cambia tu energía a lo largo de la semana.',
        ],
        [
          'Ventana dorada',
          'Las horas en que mejor te concentras, para reservarlas a lo difícil.',
        ],
        ['Mapa de calor y tendencias', 'Detecta patrones por día y hora.'],
      ],
    },
    lumina: {
      group: 'Lumina IA',
      cta2: 'Ver el planificador',
      title: 'Conoce a Lumina',
      sub: 'Tu asistente de IA en Focusly: conversa contigo, entiende tus tareas y documentos y organiza tu semana.',
      blocks: [
        [
          'Crea tareas y planes completos',
          'Describe lo que tienes que lograr y Lumina crea las tareas, con subtareas y prioridades.',
        ],
        [
          'Planifica tu semana',
          'Propone bloques de enfoque en tu calendario; los confirmas con un clic.',
        ],
        [
          'Responde con tus documentos',
          'Usa el contexto de tus tareas, menciones con @ y archivos PDF, DOCX o TXT.',
        ],
        [
          'Recuerda tus preferencias',
          'Tiene en cuenta cómo te gusta trabajar al proponerte planes.',
        ],
        [
          'Tu información, solo para ti',
          'Lumina usa tus datos únicamente para responderte.',
        ],
      ],
    },
    templates: {
      group: 'Recursos',
      title: 'Plantillas para empezar más rápido',
      sub: 'Documentos y planes con una estructura lista para usar en tus workspaces.',
    },
    students: {
      group: 'Para quién',
      title: 'Focusly para estudiantes',
      sub: 'Reparte el estudio de cada examen en bloques antes de la fecha.',
      blocks: [
        [
          'Un plan por examen',
          'Dile a Lumina la fecha y la materia; ella reparte el repaso en tu semana.',
        ],
        [
          'Apuntes en Markdown',
          'Un workspace por asignatura, con tus apuntes junto a tus tareas.',
        ],
        [
          'Sesiones de estudio',
          'Usa el modo enfoque con descansos para estudiar sin distracciones.',
        ],
      ],
    },
    freelancers: {
      group: 'Para quién',
      title: 'Focusly para freelancers',
      sub: 'Equilibra varios clientes y registra el tiempo de cada proyecto.',
      blocks: [
        [
          'Un proyecto por cliente',
          'Tareas, notas y entregables de cada cliente en su propio espacio.',
        ],
        [
          'Registro de tiempo',
          'Sabe cuánto dedicas a cada tarea y cada cliente.',
        ],
        [
          'Una semana equilibrada',
          'Lumina reparte el trabajo en tu horario laboral.',
        ],
      ],
    },
    developers: {
      group: 'Para quién',
      title: 'Focusly para desarrolladores',
      sub: 'Protege horas de trabajo profundo entre reuniones.',
      blocks: [
        [
          'Bloques de trabajo profundo',
          'Reserva tiempo en tu calendario antes de que se llene de reuniones.',
        ],
        [
          'Documentación en Markdown',
          'Especificaciones y notas técnicas con vista previa en vivo.',
        ],
        [
          'Lo difícil, en tu ventana dorada',
          'Programa las tareas complejas en las horas en que mejor te concentras.',
        ],
      ],
    },
    creators: {
      group: 'Para quién',
      title: 'Focusly para creadores',
      sub: 'Planifica guion, grabación y publicación en la misma semana.',
      blocks: [
        [
          'Del guion a la publicación',
          'Cada pieza como una tarea con subtareas: guion, grabación, edición y publicación.',
        ],
        [
          'Guiones en workspaces',
          'Escribe tus guiones en Markdown junto a tus tareas.',
        ],
        [
          'Tu calendario de publicación',
          'Fechas sincronizadas con Google Calendar.',
        ],
      ],
    },
    pricing: {
      group: 'Precios',
      title: 'Planes y precios',
      sub: 'Empieza gratis, sin tarjeta, y mejora cuando lo necesites.',
    },
    help: {
      group: 'Recursos',
      title: 'Centro de ayuda',
      sub: 'Guías y respuestas paso a paso para sacarle partido a Focusly.',
    },
    changelog: {
      group: 'Recursos',
      title: 'Novedades',
      sub: 'Los cambios y mejoras de cada versión de Focusly.',
    },
  },

  nav: {
    homeAria: 'Focusly, ir al inicio',
    mainAria: 'Principal',
    product: 'Producto',
    lumina: 'Lumina IA',
    who: 'Para quién',
    pricing: 'Precios',
    resources: 'Recursos',
    login: 'Iniciar sesión',
    start: 'Empieza gratis',
    openApp: 'Abrir Focusly',
    language: 'Idioma',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    menu: 'Menú',
    themeAria: 'Tema: {name}. Cambiar tema',
    columns: {
      plan: 'Planifica',
      focus: 'Enfócate',
      organize: 'Organiza',
      understand: 'Entiende',
    },
    luminaCard: {
      title: 'Lumina IA',
      desc: 'Convierte un objetivo en un plan con bloques en tu calendario.',
      cta: 'Conoce a Lumina',
      prompt: 'Planifica mi semana',
    },
  },

  themes: { light: 'Claro', dark: 'Oscuro', graydark: 'Gris oscuro' },

  hero: {
    h1: 'Dile a Lumina tu meta. Ella organiza tu semana.',
    sub: 'Tareas, calendario y notas en un solo lugar. Lumina convierte tus objetivos en bloques de enfoque en tu Google Calendar.',
    cta: 'Empieza gratis',
    demo: 'Ver demo (60 s)',
    micro: 'Sin tarjeta · Entra con Google o con tu correo',
    prompt: 'Planifica mi semana',
    thinking: 'Lumina está pensando',
    plan: 'Plan sugerido · 4 bloques',
    add: 'Añadir al calendario',
    added: 'Añadido al calendario',
    placeholder: 'Pregunta o pide un plan…',
    items: [
      'Informe final',
      'Repaso de examen',
      'Propuesta para cliente',
      'Revisión semanal',
    ],
    durations: ['2 h', '1,5 h', '1 h', '30 min'],
    days: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'],
    events: ['Clase', 'Reunión', 'Clase'],
    alt: 'Focusly: Lumina crea un plan semanal y coloca bloques de enfoque en el calendario',
  },

  trust: {
    aria: 'Integraciones',
    integrates: 'Se integra con',
    logoTitle: 'Logo oficial de Google Calendar',
    beta: 'En beta abierta',
  },

  problem: {
    eyebrow: 'El problema',
    title: 'Planificar no debería costarte la mañana',
    sub: 'Si tu semana vive en Google Calendar y tus tareas en otro sitio, decidir qué hacer y cuándo se convierte en otra tarea.',
    pains: [
      {
        icon: 'apps',
        title: 'Demasiadas apps',
        desc: 'Tareas en una, calendario en otra y notas en una tercera.',
        fix: 'Tareas, calendario, notas e IA en un solo lugar.',
      },
      {
        icon: 'help',
        title: 'No sé qué hacer primero',
        desc: 'La lista crece y decidir por dónde empezar te consume la mañana.',
        fix: 'Lumina prioriza y te propone un plan para hoy y la semana.',
      },
      {
        icon: 'event_busy',
        title: 'Mi calendario no refleja mis tareas',
        desc: 'Lo que tienes que hacer no tiene hueco reservado en tu semana.',
        fix: 'Bloques de enfoque sincronizados con Google Calendar.',
      },
    ],
  },

  pillars: {
    eyebrow: 'Producto',
    title: 'Tu semana entera en una sola app',
    tabsAria: 'Pilares del producto',
    tabs: [
      {
        icon: 'calendar_month',
        label: 'Planifica',
        title: 'Tareas y calendario que se hablan',
        bullets: [
          'Bandeja, hoy y próximos, con prioridades, etiquetas, subtareas y registro de tiempo.',
          'Sincronización bidireccional con Google Calendar.',
          'Planificador semanal: Lumina reparte tus tareas en tu horario laboral.',
        ],
      },
      {
        icon: 'timer',
        label: 'Enfócate',
        title: 'Trabajo profundo, sin distracciones',
        bullets: [
          'Temporizador de sesiones de trabajo profundo.',
          'Descansos entre sesiones.',
          'Bloques de tiempo que Lumina propone y tú confirmas con un clic.',
        ],
      },
      {
        icon: 'folder_open',
        label: 'Organiza',
        title: 'Documentos junto a tus tareas',
        bullets: [
          'Workspaces con documentos en Markdown y vista previa en vivo.',
          'Documentos organizados en proyectos.',
          'Plantillas para empezar más rápido.',
        ],
      },
      {
        icon: 'insights',
        label: 'Entiende',
        title: 'Datos para planificar mejor',
        bullets: [
          'Horas de enfoque y tareas completadas.',
          'Puntuación de energía y ventana dorada.',
          'Mapa de calor y tendencias.',
        ],
      },
    ],
  },

  lumina: {
    eyebrow: 'Lumina IA',
    title: 'Una asistente que conoce tu trabajo',
    sub: 'Lumina conversa contigo, entiende tus tareas y documentos y propone bloques de enfoque en tu calendario. Tú los confirmas con un clic.',
    caps: [
      {
        icon: 'add_task',
        title: 'Crea tareas',
        desc: 'Escribe lo que necesitas y Lumina crea las tareas o un plan completo.',
      },
      {
        icon: 'date_range',
        title: 'Planifica tu semana',
        desc: 'Propone bloques de enfoque en tu calendario; los confirmas con un clic.',
      },
      {
        icon: 'attach_file',
        title: 'Usa tus documentos',
        desc: 'Responde con el contexto de tus tareas, menciones con @ y archivos PDF, DOCX o TXT.',
      },
      {
        icon: 'bookmark_heart',
        title: 'Recuerda tus preferencias',
        desc: 'Tiene en cuenta cómo te gusta trabajar al proponerte planes.',
      },
    ],
    demo: {
      aria: 'Demostración: Lumina crea cuatro tareas a partir de un mensaje',
      before:
        'Tengo que entregar la tesis el viernes y preparar la presentación. Usa',
      mention: '@Tesis.docx',
      thinking: 'Lumina está pensando',
      planTitle: 'Plan sugerido · 4 tareas',
      tasks: [
        ['Redactar conclusiones', 'Hoy · 2 h'],
        ['Revisar bibliografía', 'Mar · 1 h'],
        ['Diseñar diapositivas', 'Mié · 1,5 h'],
        ['Ensayar la presentación', 'Jue · 45 min'],
      ],
      create: 'Crear todas',
      created: '4 tareas creadas',
      input: 'Escribe a Lumina · usa @ para mencionar',
    },
  },

  how: {
    eyebrow: 'Cómo funciona',
    title: 'Tres pasos para una semana con rumbo',
    steps: [
      {
        icon: 'sync',
        title: 'Conecta Google Calendar',
        desc: 'Entra con Google y tus eventos aparecen en Focusly.',
      },
      {
        icon: 'auto_awesome',
        title: 'Dile a Lumina tus objetivos',
        desc: 'Ella crea las tareas y propone bloques en tu horario.',
      },
      {
        icon: 'insights',
        title: 'Enfócate y revisa tus Insights',
        desc: 'Trabaja con el modo enfoque y descubre tu ventana dorada.',
      },
    ],
  },

  insights: {
    eyebrow: 'Insights',
    title: 'Descubre cuándo trabajas mejor',
    sub: 'Horas de enfoque, tareas completadas, puntuación de energía y tu ventana dorada: las horas en que mejor te concentras.',
    week: 'Esta semana',
    sample: 'Datos de ejemplo',
    focusHours: 'Horas de enfoque',
    tasksDone: 'Tareas completadas',
    energy: 'Energía',
    golden: 'Ventana dorada',
    barsTitle: 'Horas de enfoque por día',
    days: ['L', 'M', 'X', 'J', 'V', 'S', 'D'],
    heatmapTitle: 'Mapa de calor',
    goldenLegend: 'Ventana dorada · 9:00–11:30',
    hoursUnit: 'h',
  },

  whoSection: {
    eyebrow: 'Para quién',
    title: 'Para quien planifica su semana en Google Calendar',
  },

  beta: {
    title: 'Únete a la beta y ayúdanos a construir Focusly',
    sub: 'Prueba las funciones nuevas antes que nadie y cuéntanos qué mejorar.',
    emailLabel: 'Correo electrónico',
    placeholder: 'tu@correo.com',
    submit: 'Unirme a la beta',
  },

  pricing: {
    eyebrow: 'Precios',
    title: 'Empieza gratis. Mejora cuando lo necesites.',
    monthly: 'Mensual',
    annual: 'Anual',
    annualAria: 'Facturación anual',
    save: 'Ahorra [PENDIENTE]',
    recommended: 'Recomendado',
    perMonth: '/mes',
    perMonthAnnual: '/mes · facturado anualmente',
    compareAll: 'Comparar todo',
    compareTitle: 'Compara los planes',
    feature: 'Función',
    note: 'Los precios y límites se leen de una única configuración compartida con la landing.',
    plans: {
      free: {
        name: 'Gratis',
        desc: 'Para uso personal',
        cta: 'Empieza gratis',
        feats: [
          'Workspaces: [LÍMITE]',
          'Tareas ilimitadas',
          'Calendario básico',
        ],
      },
      pro: {
        name: 'Pro',
        desc: 'Para estudiantes y profesionales',
        cta: 'Elegir Pro',
        feats: [
          'Workspaces ilimitados',
          'Lumina: [LÍMITE] usos al mes',
          'Analíticas avanzadas',
          'Integración con Google Calendar',
        ],
      },
      business: {
        name: 'Empresarial',
        desc: 'Para la máxima productividad',
        cta: 'Elegir Empresarial',
        feats: [
          'Lumina ilimitada',
          'Procesamiento prioritario en la cola de IA',
          'Insights y auditorías avanzadas',
          'Exportar workspaces (Markdown/Word)',
          'Soporte prioritario y acceso beta',
          'SLA y protocolos de seguridad',
        ],
      },
    },
    table: [
      ['Tareas', 'Ilimitadas', 'Ilimitadas', 'Ilimitadas'],
      ['Workspaces', '[LÍMITE]', 'Ilimitados', 'Ilimitados'],
      ['Calendario', 'Básico', 'Completo', 'Completo'],
      ['Integración con Google Calendar', '[PENDIENTE]', '✓', '✓'],
      ['Lumina IA', '[LÍMITE]', '[LÍMITE] usos/mes', 'Ilimitada'],
      ['Prioridad en la cola de IA', '—', '—', '✓'],
      [
        'Analíticas e Insights',
        '[PENDIENTE]',
        'Avanzadas',
        'Avanzadas + auditorías',
      ],
      ['Exportar workspaces (Markdown/Word)', '—', '—', '✓'],
      ['Soporte', '[PENDIENTE]', '[PENDIENTE]', 'Prioritario + acceso beta'],
      ['SLA y protocolos de seguridad', '—', '—', '✓'],
    ],
  },

  security: {
    eyebrow: 'Seguridad y privacidad',
    title: 'Tus datos son tuyos',
    terms: 'Términos',
    privacy: 'Privacidad',
    items: [
      {
        icon: 'lock',
        title: 'HTTPS en todo',
        desc: 'Tu información viaja cifrada.',
      },
      {
        icon: 'block',
        title: 'No vendemos tus datos',
        desc: 'Ni a anunciantes ni a terceros.',
      },
      {
        icon: 'shield_person',
        title: 'La IA solo trabaja para ti',
        desc: 'Lumina usa tu información únicamente para responderte.',
      },
      {
        icon: 'delete',
        title: 'Borra tu cuenta cuando quieras',
        desc: 'Eliminas tu cuenta y tus datos desde Configuración.',
      },
    ],
  },

  faq: {
    title: 'Preguntas frecuentes',
    items: [
      [
        '¿Cuánto cuesta Focusly?',
        'Puedes empezar gratis, sin tarjeta. Pro cuesta [PRECIO] y Empresarial [PRECIO] al mes.',
      ],
      [
        '¿Puedo cancelar cuando quiera?',
        'Sí, desde Configuración. [PENDIENTE: condiciones de reembolso y fin de periodo]',
      ],
      [
        '¿Qué ve Lumina de mi información?',
        'Solo lo que necesita para responderte: tus tareas, los documentos que mencionas con @ y los archivos que adjuntas. No los usa para nada más.',
      ],
      [
        '¿Cómo funciona la sincronización con Google Calendar?',
        'Es bidireccional: lo que creas en Focusly aparece en Google Calendar y al revés. Los bloques que propone Lumina solo se añaden cuando los confirmas.',
      ],
      [
        '¿Puedo exportar mis datos?',
        'Los documentos de tus workspaces se exportan en Markdown y Word. [PENDIENTE: exportación de tareas y disponibilidad por plan]',
      ],
      ['¿En qué idiomas está disponible?', 'En español, inglés y japonés.'],
      [
        '¿Funciona en el móvil?',
        'Focusly es una app web y funciona en el navegador del móvil. [PENDIENTE: app nativa]',
      ],
      [
        '¿Están seguros mis datos?',
        'Usamos HTTPS, no vendemos tus datos y puedes borrar tu cuenta cuando quieras. Más detalles en la política de privacidad.',
      ],
      [
        '¿Necesito contraseña?',
        'No. Entras con un enlace mágico que te enviamos por correo o con tu cuenta de Google.',
      ],
    ],
  },

  finalCta: {
    title: 'Tu próxima semana, ya organizada',
    sub: 'Conecta tu calendario y dile a Lumina qué tienes que lograr.',
    cta: 'Empieza gratis',
    micro: 'Sin tarjeta · Entra con Google o con tu correo',
  },

  footer: {
    tagline: 'Tareas, calendario, notas e IA en un solo lugar.',
    product: 'Producto',
    resources: 'Recursos',
    legal: 'Legal',
    terms: 'Términos',
    privacy: 'Privacidad',
    language: 'Idioma',
    theme: 'Tema',
  },

  demoModal: { aria: 'Demo de Focusly, 60 segundos', close: 'Cerrar video' },

  page: {
    breadcrumbAria: 'Ruta de navegación',
    home: 'Inicio',
    seePricing: 'Ver precios',
    explore: 'Sigue explorando',
    finalTitle: 'Tu próxima semana, ya organizada',
    useTemplate: 'Usar plantilla',
    preview: 'vista previa',
    filterTemplates: 'Filtrar plantillas',
    helpSearchLabel: 'Buscar en el centro de ayuda',
    helpPlaceholder: 'Busca una guía o una pregunta',
    helpEmpty: 'No hay resultados para “{q}”.',
    helpContactTitle: '¿No encuentras lo que buscas?',
    helpContactDesc: 'Escríbenos y te respondemos.',
    helpContact: 'Contactar',
  },

  help: [
    {
      icon: 'rocket_launch',
      title: 'Primeros pasos',
      desc: 'Crea tu cuenta con enlace mágico o Google y configura tu horario.',
    },
    {
      icon: 'checklist',
      title: 'Tareas',
      desc: 'Bandeja, hoy, próximos, prioridades, etiquetas y subtareas.',
    },
    {
      icon: 'calendar_month',
      title: 'Calendario y Google Calendar',
      desc: 'Conecta tu cuenta y entiende la sincronización.',
    },
    {
      icon: 'auto_awesome',
      title: 'Lumina IA',
      desc: 'Menciones con @, adjuntos y planes semanales.',
    },
    {
      icon: 'description',
      title: 'Workspaces',
      desc: 'Documentos en Markdown, proyectos y plantillas.',
    },
    {
      icon: 'manage_accounts',
      title: 'Cuenta y facturación',
      desc: 'Planes, idioma, tema y eliminación de la cuenta.',
    },
  ],

  changelog: [
    {
      version: 'Workspaces 2.0',
      date: '[PENDIENTE: fecha]',
      tag: 'Nuevo',
      title: 'Workspaces 2.0 ya disponible',
      desc: '[PENDIENTE: resumen real de los cambios]',
    },
    {
      version: '[PENDIENTE]',
      date: '[PENDIENTE: fecha]',
      tag: 'Mejora',
      title: '[PENDIENTE: título]',
      desc: '[PENDIENTE: descripción]',
    },
    {
      version: '[PENDIENTE]',
      date: '[PENDIENTE: fecha]',
      tag: 'Corrección',
      title: '[PENDIENTE: título]',
      desc: '[PENDIENTE: descripción]',
    },
  ],

  templateCategories: [
    'Todas',
    'Planificación',
    'Estudio',
    'Trabajo',
    'Contenido',
  ],
  templates: [
    {
      cat: 'Planificación',
      name: 'Planificación semanal',
      desc: 'Objetivos, prioridades y revisión de la semana.',
    },
    {
      cat: 'Estudio',
      name: 'Plan de estudio',
      desc: 'Temas, fechas de examen y sesiones de repaso.',
    },
    {
      cat: 'Trabajo',
      name: 'Seguimiento de cliente',
      desc: 'Alcance, entregables y notas de cada cliente.',
    },
    {
      cat: 'Trabajo',
      name: 'Notas de reunión',
      desc: 'Asistentes, decisiones y próximos pasos.',
    },
    {
      cat: 'Trabajo',
      name: 'Documentación técnica',
      desc: 'Contexto, decisiones y especificación.',
    },
    {
      cat: 'Contenido',
      name: 'Guion de video',
      desc: 'Idea, estructura, guion y checklist de publicación.',
    },
  ],
};
