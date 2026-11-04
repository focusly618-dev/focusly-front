import type { SiteContent } from './types';

export const fr: SiteContent = {
  items: {
    tasks: {
      name: 'Tâches',
      desc: 'Boîte de réception, aujourd’hui et à venir, avec priorités et sous-tâches',
    },
    calendar: {
      name: 'Calendrier et Google Agenda',
      short: 'Calendrier',
      desc: 'Synchronisation bidirectionnelle avec votre agenda',
    },
    planner: {
      name: 'Planificateur IA',
      desc: 'Lumina place vos tâches dans vos heures de travail',
    },
    focus: {
      name: 'Mode concentration',
      desc: 'Sessions de travail en profondeur et pauses',
    },
    timeBlocks: {
      name: 'Blocs de temps',
      desc: 'Lumina les propose, vous les confirmez',
    },
    workspaces: {
      name: 'Espaces de travail et notes',
      desc: 'Markdown avec aperçu en direct',
    },
    projects: { name: 'Projets', desc: 'Regroupez vos documents par projet' },
    templates: { name: 'Modèles', desc: 'Documents et plans prêts à l’emploi' },
    insights: {
      name: 'Insights et créneau d’or',
      short: 'Insights',
      desc: 'Les heures où vous vous concentrez le mieux',
    },
    lumina: {
      name: 'Lumina AI',
      desc: 'Votre assistante IA pour planifier et rester concentré',
    },
    students: {
      name: 'Étudiants',
      desc: 'Répartissez les révisions de chaque examen en blocs avant la date.',
    },
    freelancers: {
      name: 'Freelances',
      desc: 'Jonglez entre plusieurs clients et suivez le temps de chaque projet.',
    },
    developers: {
      name: 'Développeurs',
      desc: 'Protégez des heures de travail en profondeur entre les réunions.',
    },
    creators: {
      name: 'Créateurs',
      desc: 'Planifiez écriture, tournage et publication dans la même semaine.',
    },
    pricing: { name: 'Tarifs', desc: 'Forfaits Free, Pro et Business' },
    help: { name: 'Centre d’aide', desc: 'Guides pas à pas et réponses' },
    changelog: {
      name: 'Nouveautés',
      desc: 'Changements et améliorations de chaque version',
    },
  },

  pages: {
    tasks: {
      group: 'Produit · Planifier',
      title: 'Toutes vos tâches, en ordre',
      sub: 'Boîte de réception, aujourd’hui et à venir, avec priorités, tags, sous-tâches et suivi du temps dans une seule liste.',
      blocks: [
        [
          'Boîte de réception, Aujourd’hui et À venir',
          'Notez tout dans la boîte de réception et décidez plus tard. Aujourd’hui montre ce qui est dû ; À venir, la suite.',
        ],
        [
          'Priorités et tags',
          'Signalez l’urgent et regroupez par contexte, client ou sujet.',
        ],
        [
          'Sous-tâches et suivi du temps',
          'Découpez le travail en étapes et suivez le temps passé sur chacune.',
        ],
      ],
    },
    calendar: {
      group: 'Produit · Planifier',
      title: 'Votre agenda et vos tâches, enfin réunis',
      sub: 'Synchronisation bidirectionnelle avec Google Agenda : ce que vous modifiez d’un côté apparaît de l’autre.',
      blocks: [
        [
          'Synchronisation bidirectionnelle',
          'Vos événements Google Agenda apparaissent dans Focusly, et ce que vous créez dans Focusly apparaît dans Google Agenda.',
        ],
        [
          'Événements et blocs dans une seule vue',
          'Voyez vos réunions, cours et blocs de concentration dans la même semaine.',
        ],
        [
          'Rien sans votre confirmation',
          'Lumina propose des blocs ; ils ne sont ajoutés à votre agenda qu’une fois confirmés.',
        ],
      ],
    },
    planner: {
      group: 'Produit · Planifier',
      title: 'Votre semaine planifiée en quelques minutes',
      sub: 'Lumina place vos tâches dans vos heures de travail et propose un plan hebdomadaire.',
      blocks: [
        [
          'Respecte vos heures de travail',
          'Les blocs sont placés dans les heures que vous avez définies comme temps de travail.',
        ],
        [
          'Relisez avant de confirmer',
          'Ajustez ou écartez n’importe quel bloc et confirmez le plan en un clic.',
        ],
        [
          'Directement dans Google Agenda',
          'Le plan confirmé apparaît dans votre agenda.',
        ],
      ],
    },
    focus: {
      group: 'Produit · Concentration',
      title: 'Des sessions de travail en profondeur, avec des pauses',
      sub: 'Un minuteur pour vous concentrer sur une tâche et souffler entre les sessions.',
      blocks: [
        [
          'Minuteur de session',
          'Choisissez une tâche et travaillez dessus sans changer d’onglet.',
        ],
        [
          'Pauses entre les sessions',
          'Alternez travail en profondeur et pauses pour garder le rythme.',
        ],
        [
          'Vos heures comptent',
          'Chaque session alimente vos Insights : heures de concentration et créneau d’or.',
        ],
      ],
    },
    timeBlocks: {
      group: 'Produit · Concentration',
      title: 'Réservez du temps pour l’essentiel',
      sub: 'Des blocs de concentration dans votre agenda, proposés par Lumina et confirmés par vous en un clic.',
      blocks: [
        [
          'Proposés par Lumina',
          'Lumina trouve des créneaux dans votre semaine pour chaque tâche.',
        ],
        ['Confirmés en un clic', 'Acceptez-les tous, un par un, ou aucun.'],
        [
          'Visibles dans Google Agenda',
          'Vos blocs apparaissent dans votre agenda pour que personne ne prenne ce temps.',
        ],
      ],
    },
    workspaces: {
      group: 'Produit · Organiser',
      title: 'Vos documents à côté de votre travail',
      sub: 'Écrivez en Markdown avec aperçu en direct et gardez vos notes à côté de vos tâches.',
      blocks: [
        [
          'Markdown avec aperçu en direct',
          'Mettez en forme sans quitter le clavier et voyez le résultat instantanément.',
        ],
        ['Organisés en projets', 'Chaque document vit dans son projet.'],
        [
          'Lumina les comprend',
          'Mentionnez un document avec @ et Lumina répond avec son contexte.',
        ],
      ],
    },
    projects: {
      group: 'Produit · Organiser',
      title: 'Chaque projet à sa place',
      sub: 'Regroupez les documents d’un même projet dans vos espaces de travail.',
      blocks: [
        ['Un espace par projet', 'Notes, spécifications et plans réunis.'],
        [
          'Partez d’un modèle',
          'Créez la structure du projet à partir d’un modèle.',
        ],
        [
          'Du contexte pour Lumina',
          'Lumina peut s’appuyer sur les documents du projet pour vous répondre.',
        ],
      ],
    },
    insights: {
      group: 'Produit · Comprendre',
      title: 'Découvrez quand vous travaillez le mieux',
      sub: 'Heures de concentration, tâches terminées, score d’énergie, créneau d’or, carte de chaleur et tendances.',
      blocks: [
        [
          'Heures de concentration et tâches terminées',
          'Voyez combien de travail en profondeur vous faites et combien vous terminez chaque semaine.',
        ],
        [
          'Score d’énergie',
          'Suivez l’évolution de votre énergie au fil de la semaine.',
        ],
        [
          'Créneau d’or',
          'Les heures où vous vous concentrez le mieux, à réserver pour le plus difficile.',
        ],
        [
          'Carte de chaleur et tendances',
          'Repérez des tendances par jour et par heure.',
        ],
      ],
    },
    lumina: {
      group: 'Lumina AI',
      cta2: 'Voir le planificateur',
      title: 'Voici Lumina',
      sub: 'Votre assistante IA dans Focusly : elle discute avec vous, comprend vos tâches et documents, et organise votre semaine.',
      blocks: [
        [
          'Crée des tâches et des plans complets',
          'Décrivez ce que vous voulez accomplir et Lumina crée les tâches, avec sous-tâches et priorités.',
        ],
        [
          'Planifie votre semaine',
          'Propose des blocs de concentration dans votre agenda ; vous les confirmez en un clic.',
        ],
        [
          'Répond avec vos documents',
          'Utilise le contexte de vos tâches, les mentions @ et les fichiers PDF, DOCX ou TXT.',
        ],
        [
          'Retient vos préférences',
          'Tient compte de votre façon de travailler pour proposer des plans.',
        ],
        [
          'Vos informations, rien que pour vous',
          'Lumina utilise vos données uniquement pour vous répondre.',
        ],
      ],
    },
    templates: {
      group: 'Ressources',
      title: 'Des modèles pour démarrer plus vite',
      sub: 'Des documents et des plans à la structure prête à l’emploi pour vos espaces de travail.',
    },
    students: {
      group: 'Pour qui',
      title: 'Focusly pour les étudiants',
      sub: 'Répartissez les révisions de chaque examen en blocs avant la date.',
      blocks: [
        [
          'Un plan par examen',
          'Donnez à Lumina la date et la matière ; elle répartit les révisions sur votre semaine.',
        ],
        [
          'Du programme aux tâches',
          'Joignez le programme en PDF et Lumina le transforme en projet avec des notes et des tâches de révision.',
        ],
        [
          'Sessions d’étude',
          'Utilisez le mode concentration avec pauses pour étudier sans distractions.',
        ],
      ],
    },
    freelancers: {
      group: 'Pour qui',
      title: 'Focusly pour les freelances',
      sub: 'Jonglez entre plusieurs clients et suivez le temps de chaque projet.',
      blocks: [
        [
          'Un projet par client',
          'Les tâches, notes et livrables de chaque client dans leur propre espace.',
        ],
        [
          'Suivi du temps',
          'Sachez combien de temps vous passez sur chaque tâche et chaque client.',
        ],
        [
          'Appels clients',
          'Créez la réunion depuis la tâche, avec un lien Google Meet et une invitation pour votre client.',
        ],
      ],
    },
    developers: {
      group: 'Pour qui',
      title: 'Focusly pour les développeurs',
      sub: 'Protégez des heures de travail en profondeur entre les réunions.',
      blocks: [
        [
          'Blocs de travail en profondeur',
          'Réservez du temps dans votre agenda avant qu’il ne se remplisse de réunions.',
        ],
        [
          'Votre sprint sur un tableau',
          'Passez de la liste au Kanban et déplacez chaque tâche de À faire à Terminée.',
        ],
        [
          'Le travail difficile dans votre créneau d’or',
          'Planifiez les tâches complexes aux heures où vous vous concentrez le mieux.',
        ],
      ],
    },
    creators: {
      group: 'Pour qui',
      title: 'Focusly pour les créateurs',
      sub: 'Planifiez écriture, tournage et publication dans la même semaine.',
      blocks: [
        [
          'Du script à la publication',
          'Chaque contenu est une tâche avec ses sous-tâches : script, tournage, montage et publication.',
        ],
        [
          'Lumina écrit avec vous',
          'Demandez-lui de rédiger, résumer ou reformuler votre script sans quitter l’éditeur.',
        ],
        [
          'Votre calendrier de publication',
          'Des dates synchronisées avec Google Agenda.',
        ],
      ],
    },
    pricing: {
      group: 'Tarifs',
      title: 'Forfaits et tarifs',
      sub: 'Commencez gratuitement, sans carte, et passez à la vitesse supérieure quand vous en avez besoin.',
    },
    help: {
      group: 'Ressources',
      title: 'Centre d’aide',
      sub: 'Guides pas à pas et réponses pour tirer le meilleur de Focusly.',
    },
    changelog: {
      group: 'Ressources',
      title: 'Nouveautés',
      sub: 'Les changements et améliorations de chaque version de Focusly.',
    },
  },

  nav: {
    homeAria: 'Focusly, aller à l’accueil',
    mainAria: 'Principal',
    product: 'Produit',
    lumina: 'Lumina AI',
    who: 'Pour qui',
    pricing: 'Tarifs',
    resources: 'Ressources',
    login: 'Se connecter',
    start: 'Commencer gratuitement',
    openApp: 'Ouvrir Focusly',
    language: 'Langue',
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
    menu: 'Menu',
    themeAria: 'Thème : {name}. Changer de thème',
    columns: {
      plan: 'Planifier',
      focus: 'Concentration',
      organize: 'Organiser',
      understand: 'Comprendre',
    },
    luminaCard: {
      title: 'Lumina AI',
      desc: 'Transforme un objectif en plan avec des blocs dans votre agenda.',
      cta: 'Découvrir Lumina',
      prompt: 'Planifie ma semaine',
    },
  },

  themes: { light: 'Clair', dark: 'Sombre', graydark: 'Tamisé' },

  hero: {
    h1: 'Dites votre objectif à Lumina. Elle planifie votre semaine.',
    sub: 'Tâches, agenda et notes au même endroit. Lumina transforme vos objectifs en blocs de concentration dans votre Google Agenda.',
    cta: 'Commencer gratuitement',
    demo: 'Voir la démo (60 s)',
    micro: 'Sans carte · Connexion avec Google ou e-mail',
    prompt: 'Planifie ma semaine',
    thinking: 'Lumina réfléchit',
    plan: 'Plan suggéré · 4 blocs',
    add: 'Ajouter à l’agenda',
    added: 'Ajouté à l’agenda',
    placeholder: 'Posez une question ou demandez un plan…',
    items: [
      'Rapport final',
      'Révisions d’examen',
      'Proposition client',
      'Bilan de la semaine',
    ],
    durations: ['2 h', '1 h 30', '1 h', '30 min'],
    days: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'],
    events: ['Cours', 'Réunion', 'Cours'],
    alt: 'Focusly : Lumina crée un plan hebdomadaire et place des blocs de concentration dans l’agenda',
  },

  trust: {
    aria: 'Intégrations',
    integrates: 'Fonctionne avec',
    logoTitle: 'Logo officiel de Google Agenda',
    beta: 'En bêta ouverte',
  },

  problem: {
    eyebrow: 'Le problème',
    title: 'Planifier ne devrait pas vous coûter la matinée',
    sub: 'Si votre semaine vit dans Google Agenda et vos tâches ailleurs, décider quoi faire et quand devient une tâche de plus.',
    pains: [
      {
        icon: 'apps',
        title: 'Trop d’applis',
        desc: 'Les tâches dans l’une, l’agenda dans une autre et les notes dans une troisième.',
        fix: 'Tâches, agenda, notes et IA au même endroit.',
      },
      {
        icon: 'help',
        title: 'Je ne sais pas par quoi commencer',
        desc: 'La liste ne cesse de s’allonger et choisir par où commencer vous prend la matinée.',
        fix: 'Lumina priorise et propose un plan pour aujourd’hui et pour la semaine.',
      },
      {
        icon: 'event_busy',
        title: 'Mon agenda ne reflète pas mes tâches',
        desc: 'Ce que vous devez faire n’a aucun temps réservé dans votre semaine.',
        fix: 'Des blocs de concentration synchronisés avec Google Agenda.',
      },
    ],
  },

  pillars: {
    eyebrow: 'Produit',
    title: 'Toute votre semaine dans une seule appli',
    tabsAria: 'Piliers du produit',
    tabs: [
      {
        icon: 'calendar_month',
        label: 'Planifier',
        title: 'Des tâches et un agenda qui se parlent',
        bullets: [
          'Boîte de réception, aujourd’hui et à venir, avec priorités, tags, sous-tâches et suivi du temps.',
          'Synchronisation bidirectionnelle avec Google Agenda.',
          'Planificateur hebdomadaire : Lumina place vos tâches dans vos heures de travail.',
        ],
        mediaAlt:
          'Focusly : Lumina place les tâches de votre boîte de réception dans votre semaine de travail et les synchronise avec Google Agenda',
      },
      {
        icon: 'timer',
        label: 'Concentration',
        title: 'Le travail en profondeur, sans distractions',
        bullets: [
          'Minuteur de sessions de travail en profondeur.',
          'Pauses entre les sessions.',
          'Des blocs de temps que Lumina propose et que vous confirmez en un clic.',
        ],
      },
      {
        icon: 'folder_open',
        label: 'Organiser',
        title: 'Vos documents à côté de vos tâches',
        bullets: [
          'Espaces de travail avec documents Markdown et aperçu en direct.',
          'Documents organisés en projets.',
          'Des modèles pour démarrer plus vite.',
        ],
      },
      {
        icon: 'insights',
        label: 'Comprendre',
        title: 'Des données pour mieux planifier',
        bullets: [
          'Heures de concentration et tâches terminées.',
          'Score d’énergie et créneau d’or.',
          'Carte de chaleur et tendances.',
        ],
      },
    ],
  },

  lumina: {
    eyebrow: 'Lumina AI',
    title: 'Une assistante qui connaît votre travail',
    sub: 'Lumina discute avec vous, comprend vos tâches et vos documents, et propose des blocs de concentration dans votre agenda. Vous les confirmez en un clic.',
    caps: [
      {
        icon: 'add_task',
        title: 'Crée des tâches',
        desc: 'Écrivez ce dont vous avez besoin et Lumina crée les tâches ou un plan complet.',
      },
      {
        icon: 'date_range',
        title: 'Planifie votre semaine',
        desc: 'Propose des blocs de concentration dans votre agenda ; vous les confirmez en un clic.',
      },
      {
        icon: 'attach_file',
        title: 'Utilise vos documents',
        desc: 'Répond avec le contexte de vos tâches, les mentions @ et les fichiers PDF, DOCX ou TXT.',
      },
      {
        icon: 'bookmark_heart',
        title: 'Retient vos préférences',
        desc: 'Tient compte de votre façon de travailler pour proposer des plans.',
      },
    ],
    demo: {
      aria: 'Démo : Lumina crée quatre tâches à partir d’un message',
      before:
        'Je dois rendre mon mémoire vendredi et préparer la soutenance. Utilise',
      mention: '@Mémoire.docx',
      thinking: 'Lumina réfléchit',
      planTitle: 'Plan suggéré · 4 tâches',
      tasks: [
        ['Rédiger les conclusions', 'Aujourd’hui · 2 h'],
        ['Relire la bibliographie', 'Mar · 1 h'],
        ['Concevoir les diapositives', 'Mer · 1 h 30'],
        ['Répéter la soutenance', 'Jeu · 45 min'],
      ],
      create: 'Tout créer',
      created: '4 tâches créées',
      input: 'Message à Lumina · utilisez @ pour mentionner',
    },
  },

  how: {
    eyebrow: 'Comment ça marche',
    title: 'Trois étapes vers une semaine qui a du sens',
    steps: [
      {
        icon: 'sync',
        title: 'Connectez Google Agenda',
        desc: 'Connectez-vous avec Google et vos événements apparaissent dans Focusly.',
      },
      {
        icon: 'auto_awesome',
        title: 'Dites vos objectifs à Lumina',
        desc: 'Elle crée les tâches et propose des blocs dans votre agenda.',
      },
      {
        icon: 'insights',
        title: 'Concentrez-vous et consultez vos Insights',
        desc: 'Travaillez en mode concentration et découvrez votre créneau d’or.',
      },
    ],
  },

  insights: {
    eyebrow: 'Insights',
    title: 'Découvrez quand vous travaillez le mieux',
    sub: 'Heures de concentration, tâches terminées, score d’énergie et votre créneau d’or : les heures où vous vous concentrez le mieux.',
    week: 'Cette semaine',
    sample: 'Données d’exemple',
    focusHours: 'Heures de concentration',
    tasksDone: 'Tâches terminées',
    energy: 'Énergie',
    golden: 'Créneau d’or',
    barsTitle: 'Heures de concentration par jour',
    days: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
    heatmapTitle: 'Carte de chaleur',
    goldenLegend: 'Créneau d’or · 9:00–11:30',
    hoursUnit: 'h',
  },

  whoSection: {
    eyebrow: 'Pour qui',
    title: 'Pour tous ceux qui planifient leur semaine dans Google Agenda',
  },

  beta: {
    title: 'Rejoignez la bêta et aidez-nous à construire Focusly',
    sub: 'Essayez les nouveautés avant tout le monde et dites-nous quoi améliorer.',
    emailLabel: 'E-mail',
    placeholder: 'vous@email.com',
    submit: 'Rejoindre la bêta',
  },

  pricing: {
    eyebrow: 'Tarifs',
    title: 'Commencez gratuitement. Évoluez quand vous en avez besoin.',
    monthly: 'Mensuel',
    annual: 'Annuel',
    annualAria: 'Facturation annuelle',
    save: 'Économisez [PENDIENTE]',
    recommended: 'Recommandé',
    perMonth: '/mois',
    perMonthAnnual: '/mois · facturé annuellement',
    managePlan: 'Gérer mon forfait',
    compareAll: 'Tout comparer',
    compareTitle: 'Comparer les forfaits',
    feature: 'Fonctionnalité',
    note: 'Les prix et les limites proviennent d’une configuration unique partagée avec la page d’accueil.',
    plans: {
      free: {
        name: 'Free',
        desc: 'Pour un usage personnel',
        cta: 'Commencer gratuitement',
        feats: [
          'Espaces de travail : [LÍMITE]',
          'Tâches illimitées',
          'Calendrier de base',
        ],
      },
      pro: {
        name: 'Pro',
        desc: 'Pour les étudiants et les professionnels',
        cta: 'Choisir Pro',
        feats: [
          'Espaces de travail illimités',
          'Lumina : [LÍMITE] utilisations par mois',
          'Analyses avancées',
          'Intégration Google Agenda',
        ],
      },
      business: {
        name: 'Business',
        desc: 'Pour une productivité maximale',
        cta: 'Choisir Business',
        feats: [
          'Lumina illimitée',
          'File d’IA prioritaire',
          'Insights et audits avancés',
          'Export des espaces de travail (Markdown/Word)',
          'Support prioritaire et accès bêta',
          'SLA et protocoles de sécurité',
        ],
      },
    },
    table: [
      ['Tâches', 'Illimitées', 'Illimitées', 'Illimitées'],
      ['Espaces de travail', '[LÍMITE]', 'Illimités', 'Illimités'],
      ['Calendrier', 'De base', 'Complet', 'Complet'],
      ['Intégration Google Agenda', '[PENDIENTE]', '✓', '✓'],
      ['Lumina AI', '[LÍMITE]', '[LÍMITE] utilisations/mois', 'Illimitée'],
      ['Priorité dans la file d’IA', '—', '—', '✓'],
      ['Analyses et Insights', '[PENDIENTE]', 'Avancés', 'Avancés + audits'],
      ['Export des espaces de travail (Markdown/Word)', '—', '—', '✓'],
      ['Support', '[PENDIENTE]', '[PENDIENTE]', 'Prioritaire + accès bêta'],
      ['SLA et protocoles de sécurité', '—', '—', '✓'],
    ],
  },

  security: {
    eyebrow: 'Sécurité et confidentialité',
    title: 'Vos données vous appartiennent',
    terms: 'Conditions',
    privacy: 'Confidentialité',
    items: [
      {
        icon: 'lock',
        title: 'HTTPS partout',
        desc: 'Vos informations circulent chiffrées.',
      },
      {
        icon: 'block',
        title: 'Nous ne vendons pas vos données',
        desc: 'Ni aux annonceurs, ni à des tiers.',
      },
      {
        icon: 'shield_person',
        title: 'L’IA ne travaille que pour vous',
        desc: 'Lumina utilise vos informations uniquement pour vous répondre.',
      },
      {
        icon: 'delete',
        title: 'Supprimez votre compte à tout moment',
        desc: 'Supprimez votre compte et vos données depuis les Paramètres.',
      },
    ],
  },

  faq: {
    title: 'Questions fréquentes',
    items: [
      [
        'Combien coûte Focusly ?',
        'Vous pouvez commencer gratuitement, sans carte. Pro coûte [PRECIO] et Business [PRECIO] par mois.',
      ],
      [
        'Puis-je résilier à tout moment ?',
        'Oui, depuis les Paramètres. [PENDIENTE: condiciones de reembolso y fin de periodo]',
      ],
      [
        'Que voit Lumina de mes informations ?',
        'Seulement ce dont elle a besoin pour vous répondre : vos tâches, les documents que vous mentionnez avec @ et les fichiers que vous joignez. Elle ne les utilise pour rien d’autre.',
      ],
      [
        'Comment fonctionne la synchronisation avec Google Agenda ?',
        'Elle est bidirectionnelle : ce que vous créez dans Focusly apparaît dans Google Agenda et inversement. Les blocs proposés par Lumina ne sont ajoutés qu’une fois confirmés.',
      ],
      [
        'Puis-je exporter mes données ?',
        'Les documents de vos espaces de travail s’exportent en Markdown et Word. [PENDIENTE: exportación de tareas y disponibilidad por plan]',
      ],
      [
        'Dans quelles langues est-il disponible ?',
        'Espagnol, anglais (États-Unis et Royaume-Uni), portugais (Brésil), français, allemand, italien, japonais, coréen et chinois simplifié.',
      ],
      [
        'Fonctionne-t-il sur mobile ?',
        'Focusly est une application web qui fonctionne dans le navigateur de votre téléphone. [PENDIENTE: app nativa]',
      ],
      [
        'Mes données sont-elles en sécurité ?',
        'Nous utilisons HTTPS, nous ne vendons pas vos données et vous pouvez supprimer votre compte à tout moment. Plus de détails dans la politique de confidentialité.',
      ],
      [
        'Ai-je besoin d’un mot de passe ?',
        'Non. Vous vous connectez avec un lien magique envoyé par e-mail ou avec votre compte Google.',
      ],
    ],
  },

  finalCta: {
    title: 'Votre semaine prochaine, déjà organisée',
    sub: 'Connectez votre agenda et dites à Lumina ce que vous voulez accomplir.',
    cta: 'Commencer gratuitement',
    micro: 'Sans carte · Connexion avec Google ou e-mail',
  },

  footer: {
    tagline: 'Tâches, agenda, notes et IA au même endroit.',
    product: 'Produit',
    resources: 'Ressources',
    legal: 'Mentions légales',
    terms: 'Conditions',
    privacy: 'Confidentialité',
    language: 'Langue',
    theme: 'Thème',
  },

  demoModal: { aria: 'Démo de Focusly, 60 secondes', close: 'Fermer la vidéo' },

  page: {
    breadcrumbAria: 'Fil d’Ariane',
    home: 'Accueil',
    seePricing: 'Voir les tarifs',
    explore: 'Continuer à explorer',
    finalTitle: 'Votre semaine prochaine, déjà organisée',
    useTemplate: 'Utiliser le modèle',
    preview: 'aperçu',
    filterTemplates: 'Filtrer les modèles',
    helpSearchLabel: 'Rechercher dans le centre d’aide',
    helpPlaceholder: 'Cherchez un guide ou une question',
    helpEmpty: 'Aucun résultat pour « {q} ».',
    helpContactTitle: 'Vous ne trouvez pas ce que vous cherchez ?',
    helpContactDesc: 'Écrivez-nous et nous vous répondrons.',
    helpContact: 'Nous contacter',
  },

  help: [
    {
      icon: 'rocket_launch',
      title: 'Premiers pas',
      desc: 'Créez votre compte avec un lien magique ou Google et définissez vos horaires.',
    },
    {
      icon: 'checklist',
      title: 'Tâches',
      desc: 'Boîte de réception, aujourd’hui, à venir, priorités, tags et sous-tâches.',
    },
    {
      icon: 'calendar_month',
      title: 'Calendrier et Google Agenda',
      desc: 'Connectez votre compte et comprenez la synchronisation.',
    },
    {
      icon: 'auto_awesome',
      title: 'Lumina AI',
      desc: 'Mentions @, pièces jointes et plans hebdomadaires.',
    },
    {
      icon: 'description',
      title: 'Espaces de travail',
      desc: 'Documents Markdown, projets et modèles.',
    },
    {
      icon: 'manage_accounts',
      title: 'Compte et facturation',
      desc: 'Forfaits, langue, thème et suppression du compte.',
    },
  ],

  changelog: [
    {
      version: 'Workspaces 2.0',
      date: '[PENDIENTE: fecha]',
      tag: 'Nouveau',
      title: 'Workspaces 2.0 est arrivé',
      desc: '[PENDIENTE: resumen real de los cambios]',
    },
    {
      version: '[PENDIENTE]',
      date: '[PENDIENTE: fecha]',
      tag: 'Amélioration',
      title: '[PENDIENTE: título]',
      desc: '[PENDIENTE: descripción]',
    },
    {
      version: '[PENDIENTE]',
      date: '[PENDIENTE: fecha]',
      tag: 'Correctif',
      title: '[PENDIENTE: título]',
      desc: '[PENDIENTE: descripción]',
    },
  ],

  templateCategories: ['Tous', 'Planification', 'Études', 'Travail', 'Contenu'],
  templates: [
    {
      cat: 'Planification',
      name: 'Planification hebdomadaire',
      desc: 'Objectifs, priorités et bilan de la semaine.',
    },
    {
      cat: 'Études',
      name: 'Plan de révision',
      desc: 'Sujets, dates d’examen et sessions de révision.',
    },
    {
      cat: 'Travail',
      name: 'Suivi client',
      desc: 'Périmètre, livrables et notes pour chaque client.',
    },
    {
      cat: 'Travail',
      name: 'Compte rendu de réunion',
      desc: 'Participants, décisions et prochaines étapes.',
    },
    {
      cat: 'Travail',
      name: 'Documentation technique',
      desc: 'Contexte, décisions et spécification.',
    },
    {
      cat: 'Contenu',
      name: 'Script vidéo',
      desc: 'Idée, structure, script et checklist de publication.',
    },
  ],
};
