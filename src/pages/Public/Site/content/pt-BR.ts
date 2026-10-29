import type { SiteContent } from './types';

export const ptBR: SiteContent = {
  items: {
    tasks: {
      name: 'Tarefas',
      desc: 'Caixa de entrada, hoje e próximas, com prioridades e subtarefas',
    },
    calendar: {
      name: 'Calendário e Google Agenda',
      short: 'Calendário',
      desc: 'Sincronização bidirecional com sua agenda',
    },
    planner: {
      name: 'Planejador com IA',
      desc: 'A Lumina encaixa suas tarefas no seu horário de trabalho',
    },
    focus: { name: 'Modo foco', desc: 'Sessões de trabalho profundo e pausas' },
    timeBlocks: {
      name: 'Blocos de tempo',
      desc: 'A Lumina propõe, você confirma',
    },
    workspaces: {
      name: 'Espaços de trabalho e notas',
      desc: 'Markdown com pré-visualização ao vivo',
    },
    projects: { name: 'Projetos', desc: 'Agrupe seus documentos por projeto' },
    templates: {
      name: 'Modelos',
      desc: 'Documentos e planos prontos para usar',
    },
    insights: {
      name: 'Insights e janela de ouro',
      short: 'Insights',
      desc: 'As horas em que você se concentra melhor',
    },
    lumina: {
      name: 'Lumina AI',
      desc: 'Sua assistente de IA para planejar e manter o foco',
    },
    students: {
      name: 'Estudantes',
      desc: 'Distribua o estudo de cada prova em blocos antes da data.',
    },
    freelancers: {
      name: 'Freelancers',
      desc: 'Equilibre vários clientes e registre o tempo de cada projeto.',
    },
    developers: {
      name: 'Desenvolvedores',
      desc: 'Proteja horas de trabalho profundo entre reuniões.',
    },
    creators: {
      name: 'Criadores',
      desc: 'Planeje roteiro, gravação e publicação na mesma semana.',
    },
    pricing: { name: 'Preços', desc: 'Planos Free, Pro e Business' },
    help: { name: 'Central de ajuda', desc: 'Guias passo a passo e respostas' },
    changelog: {
      name: 'Novidades',
      desc: 'Mudanças e melhorias em cada versão',
    },
  },

  pages: {
    tasks: {
      group: 'Produto · Planejar',
      title: 'Todas as suas tarefas, em ordem',
      sub: 'Caixa de entrada, hoje e próximas, com prioridades, tags, subtarefas e registro de tempo numa única lista.',
      blocks: [
        [
          'Caixa de entrada, Hoje e Próximas',
          'Anote tudo na caixa de entrada e decida depois. Hoje mostra o que vence; Próximas, o que vem a seguir.',
        ],
        [
          'Prioridades e tags',
          'Marque o que é urgente e agrupe por contexto, cliente ou assunto.',
        ],
        [
          'Subtarefas e registro de tempo',
          'Divida o trabalho em etapas e acompanhe quanto tempo cada uma leva.',
        ],
      ],
    },
    calendar: {
      group: 'Produto · Planejar',
      title: 'Sua agenda e suas tarefas, finalmente juntas',
      sub: 'Sincronização bidirecional com o Google Agenda: o que você muda de um lado aparece do outro.',
      blocks: [
        [
          'Sincronização bidirecional',
          'Seus eventos do Google Agenda aparecem no Focusly, e o que você cria no Focusly aparece no Google Agenda.',
        ],
        [
          'Eventos e blocos numa só visualização',
          'Veja reuniões, aulas e blocos de foco na mesma semana.',
        ],
        [
          'Nada sem a sua confirmação',
          'A Lumina propõe blocos; eles só entram na sua agenda depois que você confirma.',
        ],
      ],
    },
    planner: {
      group: 'Produto · Planejar',
      title: 'Sua semana planejada em minutos',
      sub: 'A Lumina encaixa suas tarefas no seu horário de trabalho e propõe um plano semanal.',
      blocks: [
        [
          'Respeita seu horário de trabalho',
          'Os blocos ficam dentro das horas que você definiu como expediente.',
        ],
        [
          'Revise antes de confirmar',
          'Ajuste ou descarte qualquer bloco e confirme o plano com um clique.',
        ],
        [
          'Direto para o Google Agenda',
          'O plano confirmado aparece na sua agenda.',
        ],
      ],
    },
    focus: {
      group: 'Produto · Foco',
      title: 'Sessões de trabalho profundo, com pausas',
      sub: 'Um cronômetro para focar numa tarefa e descansar entre as sessões.',
      blocks: [
        [
          'Cronômetro de sessão',
          'Escolha uma tarefa e trabalhe nela sem trocar de aba.',
        ],
        [
          'Pausas entre sessões',
          'Alterne trabalho profundo e pausas para manter o ritmo.',
        ],
        [
          'Suas horas contam',
          'Cada sessão alimenta seus Insights: horas de foco e janela de ouro.',
        ],
      ],
    },
    timeBlocks: {
      group: 'Produto · Foco',
      title: 'Reserve tempo para o que importa',
      sub: 'Blocos de foco na sua agenda que a Lumina propõe e você confirma com um clique.',
      blocks: [
        [
          'Propostos pela Lumina',
          'A Lumina encontra espaços na sua semana para cada tarefa.',
        ],
        ['Confirmados com um clique', 'Aceite todos, um por um ou nenhum.'],
        [
          'Visíveis no Google Agenda',
          'Seus blocos aparecem na agenda para ninguém ocupar esse tempo.',
        ],
      ],
    },
    workspaces: {
      group: 'Produto · Organizar',
      title: 'Documentos ao lado do seu trabalho',
      sub: 'Escreva em Markdown com pré-visualização ao vivo e mantenha suas notas junto das tarefas.',
      blocks: [
        [
          'Markdown com pré-visualização ao vivo',
          'Formate sem tirar as mãos do teclado e veja o resultado na hora.',
        ],
        [
          'Organizados em projetos',
          'Cada documento vive dentro do seu projeto.',
        ],
        [
          'A Lumina entende seus documentos',
          'Mencione um documento com @ e a Lumina responde com o contexto dele.',
        ],
      ],
    },
    projects: {
      group: 'Produto · Organizar',
      title: 'Cada projeto no seu lugar',
      sub: 'Agrupe os documentos de um mesmo projeto dentro dos seus espaços de trabalho.',
      blocks: [
        ['Um espaço por projeto', 'Notas, especificações e planos juntos.'],
        [
          'Comece com modelos',
          'Crie a estrutura do projeto a partir de um modelo.',
        ],
        [
          'Contexto para a Lumina',
          'A Lumina pode usar os documentos do projeto para responder.',
        ],
      ],
    },
    insights: {
      group: 'Produto · Entender',
      title: 'Descubra quando você trabalha melhor',
      sub: 'Horas de foco, tarefas concluídas, nível de energia, janela de ouro, mapa de calor e tendências.',
      blocks: [
        [
          'Horas de foco e tarefas concluídas',
          'Veja quanto trabalho profundo você faz e quanto conclui por semana.',
        ],
        [
          'Nível de energia',
          'Acompanhe como sua energia muda ao longo da semana.',
        ],
        [
          'Janela de ouro',
          'As horas em que você se concentra melhor, para guardá-las para o trabalho difícil.',
        ],
        ['Mapa de calor e tendências', 'Descubra padrões por dia e hora.'],
      ],
    },
    lumina: {
      group: 'Lumina AI',
      cta2: 'Ver o planejador',
      title: 'Conheça a Lumina',
      sub: 'Sua assistente de IA no Focusly: conversa com você, entende suas tarefas e documentos e organiza sua semana.',
      blocks: [
        [
          'Cria tarefas e planos completos',
          'Descreva o que você precisa alcançar e a Lumina cria as tarefas, com subtarefas e prioridades.',
        ],
        [
          'Planeja sua semana',
          'Propõe blocos de foco na sua agenda; você confirma com um clique.',
        ],
        [
          'Responde com seus documentos',
          'Usa o contexto das suas tarefas, menções com @ e arquivos PDF, DOCX ou TXT.',
        ],
        [
          'Lembra suas preferências',
          'Leva em conta como você gosta de trabalhar ao propor planos.',
        ],
        [
          'Suas informações, só para você',
          'A Lumina usa seus dados apenas para responder a você.',
        ],
      ],
    },
    templates: {
      group: 'Recursos',
      title: 'Modelos para começar mais rápido',
      sub: 'Documentos e planos com estrutura pronta para seus espaços de trabalho.',
    },
    students: {
      group: 'Para quem é',
      title: 'Focusly para estudantes',
      sub: 'Distribua o estudo de cada prova em blocos antes da data.',
      blocks: [
        [
          'Um plano por prova',
          'Diga à Lumina a data e a matéria; ela distribui a revisão pela sua semana.',
        ],
        [
          'Do programa às tarefas',
          'Anexe o programa da disciplina em PDF e a Lumina o transforma num projeto com notas e tarefas de revisão.',
        ],
        [
          'Sessões de estudo',
          'Use o modo foco com pausas para estudar sem distrações.',
        ],
      ],
    },
    freelancers: {
      group: 'Para quem é',
      title: 'Focusly para freelancers',
      sub: 'Equilibre vários clientes e registre o tempo de cada projeto.',
      blocks: [
        [
          'Um projeto por cliente',
          'As tarefas, notas e entregas de cada cliente no seu próprio espaço.',
        ],
        [
          'Registro de tempo',
          'Saiba quanto tempo você dedica a cada tarefa e a cada cliente.',
        ],
        [
          'Chamadas com clientes',
          'Crie a reunião a partir da tarefa, com link do Google Meet e convite para o cliente.',
        ],
      ],
    },
    developers: {
      group: 'Para quem é',
      title: 'Focusly para desenvolvedores',
      sub: 'Proteja horas de trabalho profundo entre reuniões.',
      blocks: [
        [
          'Blocos de trabalho profundo',
          'Reserve tempo na agenda antes que ela se encha de reuniões.',
        ],
        [
          'Sua sprint num quadro',
          'Passe da lista ao Kanban e mova cada tarefa de A fazer para Concluída.',
        ],
        [
          'Trabalho difícil na sua janela de ouro',
          'Agende as tarefas complexas nas horas em que você se concentra melhor.',
        ],
      ],
    },
    creators: {
      group: 'Para quem é',
      title: 'Focusly para criadores',
      sub: 'Planeje roteiro, gravação e publicação na mesma semana.',
      blocks: [
        [
          'Do roteiro à publicação',
          'Cada peça como uma tarefa com subtarefas: roteiro, gravação, edição e publicação.',
        ],
        [
          'A Lumina escreve com você',
          'Peça que ela rascunhe, resuma ou reescreva seu roteiro sem sair do editor.',
        ],
        [
          'Seu calendário de publicações',
          'Datas sincronizadas com o Google Agenda.',
        ],
      ],
    },
    pricing: {
      group: 'Preços',
      title: 'Planos e preços',
      sub: 'Comece grátis, sem cartão, e faça upgrade quando precisar.',
    },
    help: {
      group: 'Recursos',
      title: 'Central de ajuda',
      sub: 'Guias passo a passo e respostas para aproveitar ao máximo o Focusly.',
    },
    changelog: {
      group: 'Recursos',
      title: 'Novidades',
      sub: 'As mudanças e melhorias em cada versão do Focusly.',
    },
  },

  nav: {
    homeAria: 'Focusly, ir para o início',
    mainAria: 'Principal',
    product: 'Produto',
    lumina: 'Lumina AI',
    who: 'Para quem é',
    pricing: 'Preços',
    resources: 'Recursos',
    login: 'Entrar',
    start: 'Comece grátis',
    openApp: 'Abrir o Focusly',
    language: 'Idioma',
    openMenu: 'Abrir menu',
    closeMenu: 'Fechar menu',
    menu: 'Menu',
    themeAria: 'Tema: {name}. Mudar tema',
    columns: {
      plan: 'Planejar',
      focus: 'Foco',
      organize: 'Organizar',
      understand: 'Entender',
    },
    luminaCard: {
      title: 'Lumina AI',
      desc: 'Transforma um objetivo num plano com blocos na sua agenda.',
      cta: 'Conheça a Lumina',
      prompt: 'Planeje minha semana',
    },
  },

  themes: { light: 'Claro', dark: 'Escuro', graydark: 'Suave' },

  hero: {
    h1: 'Diga seu objetivo à Lumina. Ela planeja sua semana.',
    sub: 'Tarefas, agenda e notas num só lugar. A Lumina transforma seus objetivos em blocos de foco no seu Google Agenda.',
    cta: 'Comece grátis',
    demo: 'Ver demo (60 s)',
    micro: 'Sem cartão · Entre com Google ou e-mail',
    prompt: 'Planeje minha semana',
    thinking: 'A Lumina está pensando',
    plan: 'Plano sugerido · 4 blocos',
    add: 'Adicionar à agenda',
    added: 'Adicionado à agenda',
    placeholder: 'Pergunte ou peça um plano…',
    items: [
      'Relatório final',
      'Revisão para a prova',
      'Proposta para cliente',
      'Revisão semanal',
    ],
    durations: ['2h', '1,5h', '1h', '30min'],
    days: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'],
    events: ['Aula', 'Reunião', 'Aula'],
    alt: 'Focusly: a Lumina cria um plano semanal e coloca blocos de foco na agenda',
  },

  trust: {
    aria: 'Integrações',
    integrates: 'Funciona com',
    logoTitle: 'Logotipo oficial do Google Agenda',
    beta: 'Em beta aberto',
  },

  problem: {
    eyebrow: 'O problema',
    title: 'Planejar não deveria custar sua manhã',
    sub: 'Se sua semana vive no Google Agenda e suas tarefas em outro lugar, decidir o que fazer e quando vira mais uma tarefa.',
    pains: [
      {
        icon: 'apps',
        title: 'Apps demais',
        desc: 'Tarefas num, agenda em outro e notas num terceiro.',
        fix: 'Tarefas, agenda, notas e IA num só lugar.',
      },
      {
        icon: 'help',
        title: 'Não sei o que fazer primeiro',
        desc: 'A lista não para de crescer e decidir por onde começar consome sua manhã.',
        fix: 'A Lumina prioriza e propõe um plano para hoje e para a semana.',
      },
      {
        icon: 'event_busy',
        title: 'Minha agenda não reflete minhas tarefas',
        desc: 'O que você precisa fazer não tem tempo reservado na sua semana.',
        fix: 'Blocos de foco sincronizados com o Google Agenda.',
      },
    ],
  },

  pillars: {
    eyebrow: 'Produto',
    title: 'Sua semana inteira num só app',
    tabsAria: 'Pilares do produto',
    tabs: [
      {
        icon: 'calendar_month',
        label: 'Planejar',
        title: 'Tarefas e agenda que conversam entre si',
        bullets: [
          'Caixa de entrada, hoje e próximas, com prioridades, tags, subtarefas e registro de tempo.',
          'Sincronização bidirecional com o Google Agenda.',
          'Planejador semanal: a Lumina encaixa suas tarefas no seu horário de trabalho.',
        ],
        mediaAlt:
          'Focusly: a Lumina encaixa as tarefas da caixa de entrada na sua semana de trabalho e as sincroniza com o Google Agenda',
      },
      {
        icon: 'timer',
        label: 'Foco',
        title: 'Trabalho profundo, sem distrações',
        bullets: [
          'Cronômetro de sessões de trabalho profundo.',
          'Pausas entre sessões.',
          'Blocos de tempo que a Lumina propõe e você confirma com um clique.',
        ],
      },
      {
        icon: 'folder_open',
        label: 'Organizar',
        title: 'Documentos ao lado das suas tarefas',
        bullets: [
          'Espaços de trabalho com documentos em Markdown e pré-visualização ao vivo.',
          'Documentos organizados em projetos.',
          'Modelos para começar mais rápido.',
        ],
      },
      {
        icon: 'insights',
        label: 'Entender',
        title: 'Dados para planejar melhor',
        bullets: [
          'Horas de foco e tarefas concluídas.',
          'Nível de energia e janela de ouro.',
          'Mapa de calor e tendências.',
        ],
      },
    ],
  },

  lumina: {
    eyebrow: 'Lumina AI',
    title: 'Uma assistente que conhece seu trabalho',
    sub: 'A Lumina conversa com você, entende suas tarefas e documentos e propõe blocos de foco na sua agenda. Você confirma com um clique.',
    caps: [
      {
        icon: 'add_task',
        title: 'Cria tarefas',
        desc: 'Escreva o que você precisa e a Lumina cria as tarefas ou um plano completo.',
      },
      {
        icon: 'date_range',
        title: 'Planeja sua semana',
        desc: 'Propõe blocos de foco na sua agenda; você confirma com um clique.',
      },
      {
        icon: 'attach_file',
        title: 'Usa seus documentos',
        desc: 'Responde com o contexto das suas tarefas, menções com @ e arquivos PDF, DOCX ou TXT.',
      },
      {
        icon: 'bookmark_heart',
        title: 'Lembra suas preferências',
        desc: 'Leva em conta como você gosta de trabalhar ao propor planos.',
      },
    ],
    demo: {
      aria: 'Demo: a Lumina cria quatro tarefas a partir de uma mensagem',
      before:
        'Preciso entregar meu TCC na sexta e preparar a apresentação. Use',
      mention: '@TCC.docx',
      thinking: 'A Lumina está pensando',
      planTitle: 'Plano sugerido · 4 tarefas',
      tasks: [
        ['Escrever as conclusões', 'Hoje · 2h'],
        ['Revisar a bibliografia', 'Ter · 1h'],
        ['Criar os slides', 'Qua · 1,5h'],
        ['Ensaiar a apresentação', 'Qui · 45min'],
      ],
      create: 'Criar todas',
      created: '4 tarefas criadas',
      input: 'Mensagem para a Lumina · use @ para mencionar',
    },
  },

  how: {
    eyebrow: 'Como funciona',
    title: 'Três passos para uma semana com rumo',
    steps: [
      {
        icon: 'sync',
        title: 'Conecte o Google Agenda',
        desc: 'Entre com o Google e seus eventos aparecem no Focusly.',
      },
      {
        icon: 'auto_awesome',
        title: 'Conte seus objetivos à Lumina',
        desc: 'Ela cria as tarefas e propõe blocos na sua agenda.',
      },
      {
        icon: 'insights',
        title: 'Foque e confira seus Insights',
        desc: 'Trabalhe no modo foco e descubra sua janela de ouro.',
      },
    ],
  },

  insights: {
    eyebrow: 'Insights',
    title: 'Descubra quando você trabalha melhor',
    sub: 'Horas de foco, tarefas concluídas, nível de energia e sua janela de ouro: as horas em que você se concentra melhor.',
    week: 'Esta semana',
    sample: 'Dados de exemplo',
    focusHours: 'Horas de foco',
    tasksDone: 'Tarefas concluídas',
    energy: 'Energia',
    golden: 'Janela de ouro',
    barsTitle: 'Horas de foco por dia',
    days: ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'],
    heatmapTitle: 'Mapa de calor',
    goldenLegend: 'Janela de ouro · 9:00–11:30',
    hoursUnit: 'h',
  },

  whoSection: {
    eyebrow: 'Para quem é',
    title: 'Para quem planeja a semana no Google Agenda',
  },

  beta: {
    title: 'Entre no beta e ajude a construir o Focusly',
    sub: 'Teste novidades antes de todo mundo e diga o que podemos melhorar.',
    emailLabel: 'E-mail',
    placeholder: 'voce@email.com',
    submit: 'Entrar no beta',
  },

  pricing: {
    eyebrow: 'Preços',
    title: 'Comece grátis. Faça upgrade quando precisar.',
    monthly: 'Mensal',
    annual: 'Anual',
    annualAria: 'Cobrança anual',
    save: 'Economize [PENDIENTE]',
    recommended: 'Recomendado',
    perMonth: '/mês',
    perMonthAnnual: '/mês · cobrado anualmente',
    managePlan: 'Gerenciar meu plano',
    compareAll: 'Comparar tudo',
    compareTitle: 'Comparar planos',
    feature: 'Recurso',
    note: 'Os preços e limites vêm de uma única configuração compartilhada com a landing page.',
    plans: {
      free: {
        name: 'Free',
        desc: 'Para uso pessoal',
        cta: 'Comece grátis',
        feats: [
          'Espaços de trabalho: [LÍMITE]',
          'Tarefas ilimitadas',
          'Calendário básico',
        ],
      },
      pro: {
        name: 'Pro',
        desc: 'Para estudantes e profissionais',
        cta: 'Escolher Pro',
        feats: [
          'Espaços de trabalho ilimitados',
          'Lumina: [LÍMITE] usos por mês',
          'Análises avançadas',
          'Integração com o Google Agenda',
        ],
      },
      business: {
        name: 'Business',
        desc: 'Para máxima produtividade',
        cta: 'Escolher Business',
        feats: [
          'Lumina ilimitada',
          'Fila de IA prioritária',
          'Insights e auditorias avançados',
          'Exportar espaços de trabalho (Markdown/Word)',
          'Suporte prioritário e acesso ao beta',
          'SLA e protocolos de segurança',
        ],
      },
    },
    table: [
      ['Tarefas', 'Ilimitadas', 'Ilimitadas', 'Ilimitadas'],
      ['Espaços de trabalho', '[LÍMITE]', 'Ilimitados', 'Ilimitados'],
      ['Calendário', 'Básico', 'Completo', 'Completo'],
      ['Integração com o Google Agenda', '[PENDIENTE]', '✓', '✓'],
      ['Lumina AI', '[LÍMITE]', '[LÍMITE] usos/mês', 'Ilimitada'],
      ['Prioridade na fila de IA', '—', '—', '✓'],
      [
        'Análises e Insights',
        '[PENDIENTE]',
        'Avançados',
        'Avançados + auditorias',
      ],
      ['Exportar espaços de trabalho (Markdown/Word)', '—', '—', '✓'],
      ['Suporte', '[PENDIENTE]', '[PENDIENTE]', 'Prioritário + acesso ao beta'],
      ['SLA e protocolos de segurança', '—', '—', '✓'],
    ],
  },

  security: {
    eyebrow: 'Segurança e privacidade',
    title: 'Seus dados são seus',
    terms: 'Termos',
    privacy: 'Privacidade',
    items: [
      {
        icon: 'lock',
        title: 'HTTPS em tudo',
        desc: 'Suas informações trafegam criptografadas.',
      },
      {
        icon: 'block',
        title: 'Não vendemos seus dados',
        desc: 'Nem para anunciantes, nem para terceiros.',
      },
      {
        icon: 'shield_person',
        title: 'A IA só trabalha para você',
        desc: 'A Lumina usa suas informações apenas para responder a você.',
      },
      {
        icon: 'delete',
        title: 'Exclua sua conta quando quiser',
        desc: 'Remova sua conta e seus dados nas Configurações.',
      },
    ],
  },

  faq: {
    title: 'Perguntas frequentes',
    items: [
      [
        'Quanto custa o Focusly?',
        'Você pode começar grátis, sem cartão. O Pro custa [PRECIO] e o Business [PRECIO] por mês.',
      ],
      [
        'Posso cancelar quando quiser?',
        'Sim, nas Configurações. [PENDIENTE: condiciones de reembolso y fin de periodo]',
      ],
      [
        'O que a Lumina vê das minhas informações?',
        'Só o que ela precisa para responder: suas tarefas, os documentos que você menciona com @ e os arquivos que você anexa. Ela não os usa para mais nada.',
      ],
      [
        'Como funciona a sincronização com o Google Agenda?',
        'É bidirecional: o que você cria no Focusly aparece no Google Agenda e vice-versa. Os blocos que a Lumina propõe só são adicionados depois que você confirma.',
      ],
      [
        'Posso exportar meus dados?',
        'Os documentos dos seus espaços de trabalho podem ser exportados em Markdown e Word. [PENDIENTE: exportación de tareas y disponibilidad por plan]',
      ],
      [
        'Em quais idiomas está disponível?',
        'Espanhol, inglês (EUA e Reino Unido), português (Brasil), francês, alemão, italiano, japonês, coreano e chinês simplificado.',
      ],
      [
        'Funciona no celular?',
        'O Focusly é um app web e funciona no navegador do celular. [PENDIENTE: app nativa]',
      ],
      [
        'Meus dados estão seguros?',
        'Usamos HTTPS, não vendemos seus dados e você pode excluir sua conta quando quiser. Mais detalhes no aviso de privacidade.',
      ],
      [
        'Preciso de senha?',
        'Não. Você entra com um link mágico que enviamos por e-mail ou com sua conta Google.',
      ],
    ],
  },

  finalCta: {
    title: 'Sua próxima semana, já organizada',
    sub: 'Conecte sua agenda e diga à Lumina o que você precisa alcançar.',
    cta: 'Comece grátis',
    micro: 'Sem cartão · Entre com Google ou e-mail',
  },

  footer: {
    tagline: 'Tarefas, agenda, notas e IA num só lugar.',
    product: 'Produto',
    resources: 'Recursos',
    legal: 'Jurídico',
    terms: 'Termos',
    privacy: 'Privacidade',
    language: 'Idioma',
    theme: 'Tema',
  },

  demoModal: { aria: 'Demo do Focusly, 60 segundos', close: 'Fechar vídeo' },

  page: {
    breadcrumbAria: 'Trilha de navegação',
    home: 'Início',
    seePricing: 'Ver preços',
    explore: 'Continue explorando',
    finalTitle: 'Sua próxima semana, já organizada',
    useTemplate: 'Usar modelo',
    preview: 'pré-visualização',
    filterTemplates: 'Filtrar modelos',
    helpSearchLabel: 'Pesquisar na central de ajuda',
    helpPlaceholder: 'Busque um guia ou uma pergunta',
    helpEmpty: 'Nenhum resultado para “{q}”.',
    helpContactTitle: 'Não encontrou o que procurava?',
    helpContactDesc: 'Escreva para nós e responderemos.',
    helpContact: 'Fale conosco',
  },

  help: [
    {
      icon: 'rocket_launch',
      title: 'Primeiros passos',
      desc: 'Crie sua conta com link mágico ou Google e defina seu horário.',
    },
    {
      icon: 'checklist',
      title: 'Tarefas',
      desc: 'Caixa de entrada, hoje, próximas, prioridades, tags e subtarefas.',
    },
    {
      icon: 'calendar_month',
      title: 'Calendário e Google Agenda',
      desc: 'Conecte sua conta e entenda a sincronização.',
    },
    {
      icon: 'auto_awesome',
      title: 'Lumina AI',
      desc: 'Menções com @, anexos e planos semanais.',
    },
    {
      icon: 'description',
      title: 'Espaços de trabalho',
      desc: 'Documentos em Markdown, projetos e modelos.',
    },
    {
      icon: 'manage_accounts',
      title: 'Conta e cobrança',
      desc: 'Planos, idioma, tema e exclusão da conta.',
    },
  ],

  changelog: [
    {
      version: 'Workspaces 2.0',
      date: '[PENDIENTE: fecha]',
      tag: 'Novo',
      title: 'Chegou o Workspaces 2.0',
      desc: '[PENDIENTE: resumen real de los cambios]',
    },
    {
      version: '[PENDIENTE]',
      date: '[PENDIENTE: fecha]',
      tag: 'Melhoria',
      title: '[PENDIENTE: título]',
      desc: '[PENDIENTE: descripción]',
    },
    {
      version: '[PENDIENTE]',
      date: '[PENDIENTE: fecha]',
      tag: 'Correção',
      title: '[PENDIENTE: título]',
      desc: '[PENDIENTE: descripción]',
    },
  ],

  templateCategories: [
    'Todos',
    'Planejamento',
    'Estudo',
    'Trabalho',
    'Conteúdo',
  ],
  templates: [
    {
      cat: 'Planejamento',
      name: 'Planejamento semanal',
      desc: 'Objetivos, prioridades e revisão da semana.',
    },
    {
      cat: 'Estudo',
      name: 'Plano de estudos',
      desc: 'Temas, datas de provas e sessões de revisão.',
    },
    {
      cat: 'Trabalho',
      name: 'Acompanhamento de clientes',
      desc: 'Escopo, entregas e notas de cada cliente.',
    },
    {
      cat: 'Trabalho',
      name: 'Atas de reunião',
      desc: 'Participantes, decisões e próximos passos.',
    },
    {
      cat: 'Trabalho',
      name: 'Documentação técnica',
      desc: 'Contexto, decisões e especificação.',
    },
    {
      cat: 'Conteúdo',
      name: 'Roteiro de vídeo',
      desc: 'Ideia, estrutura, roteiro e checklist de publicação.',
    },
  ],
};
