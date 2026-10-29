import type { SiteContent } from './types';

export const it: SiteContent = {
  items: {
    tasks: {
      name: 'Attività',
      desc: 'In arrivo, oggi e prossime, con priorità e sottoattività',
    },
    calendar: {
      name: 'Calendario e Google Calendar',
      short: 'Calendario',
      desc: 'Sincronizzazione bidirezionale con la tua agenda',
    },
    planner: {
      name: 'Pianificatore IA',
      desc: 'Lumina inserisce le attività nel tuo orario di lavoro',
    },
    focus: {
      name: 'Modalità concentrazione',
      desc: 'Sessioni di lavoro profondo e pause',
    },
    timeBlocks: {
      name: 'Blocchi di tempo',
      desc: 'Lumina li propone, tu li confermi',
    },
    workspaces: {
      name: 'Spazi di lavoro e note',
      desc: 'Markdown con anteprima dal vivo',
    },
    projects: { name: 'Progetti', desc: 'Raggruppa i documenti per progetto' },
    templates: { name: 'Modelli', desc: 'Documenti e piani pronti all’uso' },
    insights: {
      name: 'Insights e finestra d’oro',
      short: 'Insights',
      desc: 'Le ore in cui ti concentri meglio',
    },
    lumina: {
      name: 'Lumina AI',
      desc: 'La tua assistente IA per pianificare e concentrarti',
    },
    students: {
      name: 'Studenti',
      desc: 'Distribuisci lo studio di ogni esame in blocchi prima della data.',
    },
    freelancers: {
      name: 'Freelance',
      desc: 'Gestisci più clienti e registra il tempo di ogni progetto.',
    },
    developers: {
      name: 'Sviluppatori',
      desc: 'Proteggi le ore di lavoro profondo tra una riunione e l’altra.',
    },
    creators: {
      name: 'Creator',
      desc: 'Pianifica sceneggiatura, registrazione e pubblicazione nella stessa settimana.',
    },
    pricing: { name: 'Prezzi', desc: 'Piani Free, Pro e Business' },
    help: { name: 'Centro assistenza', desc: 'Guide passo passo e risposte' },
    changelog: {
      name: 'Novità',
      desc: 'Modifiche e miglioramenti di ogni versione',
    },
  },

  pages: {
    tasks: {
      group: 'Prodotto · Pianificare',
      title: 'Tutte le tue attività, in ordine',
      sub: 'In arrivo, oggi e prossime, con priorità, tag, sottoattività e registrazione del tempo in un unico elenco.',
      blocks: [
        [
          'In arrivo, Oggi e Prossime',
          'Annota tutto in In arrivo e decidi dopo. Oggi mostra ciò che scade; Prossime, ciò che viene dopo.',
        ],
        [
          'Priorità e tag',
          'Segnala ciò che è urgente e raggruppa per contesto, cliente o argomento.',
        ],
        [
          'Sottoattività e registrazione del tempo',
          'Dividi il lavoro in passaggi e tieni traccia di quanto dura ciascuno.',
        ],
      ],
    },
    calendar: {
      group: 'Prodotto · Pianificare',
      title: 'La tua agenda e le tue attività, finalmente insieme',
      sub: 'Sincronizzazione bidirezionale con Google Calendar: ciò che cambi da una parte appare dall’altra.',
      blocks: [
        [
          'Sincronizzazione bidirezionale',
          'Gli eventi di Google Calendar compaiono in Focusly, e ciò che crei in Focusly compare in Google Calendar.',
        ],
        [
          'Eventi e blocchi in un’unica vista',
          'Vedi riunioni, lezioni e blocchi di concentrazione nella stessa settimana.',
        ],
        [
          'Niente senza la tua conferma',
          'Lumina propone i blocchi; entrano nella tua agenda solo dopo che li confermi.',
        ],
      ],
    },
    planner: {
      group: 'Prodotto · Pianificare',
      title: 'La tua settimana pianificata in pochi minuti',
      sub: 'Lumina inserisce le attività nel tuo orario di lavoro e propone un piano settimanale.',
      blocks: [
        [
          'Rispetta il tuo orario di lavoro',
          'I blocchi vengono collocati nelle ore che hai impostato come orario di lavoro.',
        ],
        [
          'Rivedi prima di confermare',
          'Modifica o scarta qualsiasi blocco e conferma il piano con un clic.',
        ],
        [
          'Direttamente in Google Calendar',
          'Il piano confermato appare nella tua agenda.',
        ],
      ],
    },
    focus: {
      group: 'Prodotto · Concentrazione',
      title: 'Sessioni di lavoro profondo, con pause',
      sub: 'Un timer per concentrarti su un’attività e riposare tra una sessione e l’altra.',
      blocks: [
        [
          'Timer di sessione',
          'Scegli un’attività e lavoraci senza cambiare scheda.',
        ],
        [
          'Pause tra le sessioni',
          'Alterna lavoro profondo e pause per mantenere il ritmo.',
        ],
        [
          'Le tue ore contano',
          'Ogni sessione alimenta i tuoi Insights: ore di concentrazione e finestra d’oro.',
        ],
      ],
    },
    timeBlocks: {
      group: 'Prodotto · Concentrazione',
      title: 'Riserva tempo per ciò che conta',
      sub: 'Blocchi di concentrazione nella tua agenda che Lumina propone e tu confermi con un clic.',
      blocks: [
        [
          'Proposti da Lumina',
          'Lumina trova spazi nella tua settimana per ogni attività.',
        ],
        [
          'Confermati con un clic',
          'Accettali tutti, uno alla volta o nessuno.',
        ],
        [
          'Visibili in Google Calendar',
          'I tuoi blocchi compaiono in agenda così nessuno occupa quel tempo.',
        ],
      ],
    },
    workspaces: {
      group: 'Prodotto · Organizzare',
      title: 'Documenti accanto al tuo lavoro',
      sub: 'Scrivi in Markdown con anteprima dal vivo e tieni le note accanto alle attività.',
      blocks: [
        [
          'Markdown con anteprima dal vivo',
          'Formatta senza lasciare la tastiera e vedi subito il risultato.',
        ],
        [
          'Organizzati in progetti',
          'Ogni documento vive dentro il suo progetto.',
        ],
        [
          'Lumina li capisce',
          'Menziona un documento con @ e Lumina risponde con il suo contesto.',
        ],
      ],
    },
    projects: {
      group: 'Prodotto · Organizzare',
      title: 'Ogni progetto al suo posto',
      sub: 'Raggruppa i documenti di uno stesso progetto nei tuoi spazi di lavoro.',
      blocks: [
        ['Uno spazio per progetto', 'Note, specifiche e piani insieme.'],
        [
          'Parti dai modelli',
          'Crea la struttura del progetto a partire da un modello.',
        ],
        [
          'Contesto per Lumina',
          'Lumina può usare i documenti del progetto per risponderti.',
        ],
      ],
    },
    insights: {
      group: 'Prodotto · Capire',
      title: 'Scopri quando lavori meglio',
      sub: 'Ore di concentrazione, attività completate, livello di energia, finestra d’oro, mappa di calore e tendenze.',
      blocks: [
        [
          'Ore di concentrazione e attività completate',
          'Guarda quanto lavoro profondo fai e quanto porti a termine ogni settimana.',
        ],
        [
          'Livello di energia',
          'Segui come cambia la tua energia nel corso della settimana.',
        ],
        [
          'Finestra d’oro',
          'Le ore in cui ti concentri meglio, da riservare al lavoro più difficile.',
        ],
        ['Mappa di calore e tendenze', 'Individua schemi per giorno e ora.'],
      ],
    },
    lumina: {
      group: 'Lumina AI',
      cta2: 'Vedi il pianificatore',
      title: 'Ecco Lumina',
      sub: 'La tua assistente IA in Focusly: chatta con te, capisce attività e documenti e organizza la tua settimana.',
      blocks: [
        [
          'Crea attività e piani completi',
          'Descrivi cosa devi ottenere e Lumina crea le attività, con sottoattività e priorità.',
        ],
        [
          'Pianifica la tua settimana',
          'Propone blocchi di concentrazione in agenda; tu li confermi con un clic.',
        ],
        [
          'Risponde con i tuoi documenti',
          'Usa il contesto delle tue attività, le menzioni con @ e i file PDF, DOCX o TXT.',
        ],
        [
          'Ricorda le tue preferenze',
          'Tiene conto di come ti piace lavorare quando propone piani.',
        ],
        [
          'Le tue informazioni, solo per te',
          'Lumina usa i tuoi dati esclusivamente per risponderti.',
        ],
      ],
    },
    templates: {
      group: 'Risorse',
      title: 'Modelli per iniziare più velocemente',
      sub: 'Documenti e piani con una struttura pronta per i tuoi spazi di lavoro.',
    },
    students: {
      group: 'Per chi è',
      title: 'Focusly per studenti',
      sub: 'Distribuisci lo studio di ogni esame in blocchi prima della data.',
      blocks: [
        [
          'Un piano per esame',
          'Di’ a Lumina la data e la materia; lei distribuisce il ripasso nella tua settimana.',
        ],
        [
          'Dal programma alle attività',
          'Allega il programma in PDF e Lumina lo trasforma in un progetto con note e attività di ripasso.',
        ],
        [
          'Sessioni di studio',
          'Usa la modalità concentrazione con pause per studiare senza distrazioni.',
        ],
      ],
    },
    freelancers: {
      group: 'Per chi è',
      title: 'Focusly per freelance',
      sub: 'Gestisci più clienti e registra il tempo di ogni progetto.',
      blocks: [
        [
          'Un progetto per cliente',
          'Attività, note e consegne di ogni cliente nel proprio spazio.',
        ],
        [
          'Registrazione del tempo',
          'Sappi quanto tempo dedichi a ogni attività e a ogni cliente.',
        ],
        [
          'Chiamate con i clienti',
          'Crea la riunione dall’attività, con link Google Meet e invito per il cliente.',
        ],
      ],
    },
    developers: {
      group: 'Per chi è',
      title: 'Focusly per sviluppatori',
      sub: 'Proteggi le ore di lavoro profondo tra una riunione e l’altra.',
      blocks: [
        [
          'Blocchi di lavoro profondo',
          'Riserva tempo in agenda prima che si riempia di riunioni.',
        ],
        [
          'Il tuo sprint su una bacheca',
          'Passa dall’elenco al Kanban e sposta ogni attività da Da fare a Completata.',
        ],
        [
          'Il lavoro difficile nella finestra d’oro',
          'Programma le attività complesse nelle ore in cui ti concentri meglio.',
        ],
      ],
    },
    creators: {
      group: 'Per chi è',
      title: 'Focusly per creator',
      sub: 'Pianifica sceneggiatura, registrazione e pubblicazione nella stessa settimana.',
      blocks: [
        [
          'Dalla sceneggiatura alla pubblicazione',
          'Ogni contenuto come attività con sottoattività: sceneggiatura, registrazione, montaggio e pubblicazione.',
        ],
        [
          'Lumina scrive con te',
          'Chiedile di scrivere una bozza, riassumere o riscrivere la sceneggiatura senza uscire dall’editor.',
        ],
        [
          'Il tuo calendario di pubblicazione',
          'Date sincronizzate con Google Calendar.',
        ],
      ],
    },
    pricing: {
      group: 'Prezzi',
      title: 'Piani e prezzi',
      sub: 'Inizia gratis, senza carta, e passa a un piano superiore quando ti serve.',
    },
    help: {
      group: 'Risorse',
      title: 'Centro assistenza',
      sub: 'Guide passo passo e risposte per sfruttare al meglio Focusly.',
    },
    changelog: {
      group: 'Risorse',
      title: 'Novità',
      sub: 'Le modifiche e i miglioramenti di ogni versione di Focusly.',
    },
  },

  nav: {
    homeAria: 'Focusly, vai alla home',
    mainAria: 'Principale',
    product: 'Prodotto',
    lumina: 'Lumina AI',
    who: 'Per chi è',
    pricing: 'Prezzi',
    resources: 'Risorse',
    login: 'Accedi',
    start: 'Inizia gratis',
    openApp: 'Apri Focusly',
    language: 'Lingua',
    openMenu: 'Apri menu',
    closeMenu: 'Chiudi menu',
    menu: 'Menu',
    themeAria: 'Tema: {name}. Cambia tema',
    columns: {
      plan: 'Pianificare',
      focus: 'Concentrazione',
      organize: 'Organizzare',
      understand: 'Capire',
    },
    luminaCard: {
      title: 'Lumina AI',
      desc: 'Trasforma un obiettivo in un piano con blocchi nella tua agenda.',
      cta: 'Scopri Lumina',
      prompt: 'Pianifica la mia settimana',
    },
  },

  themes: { light: 'Chiaro', dark: 'Scuro', graydark: 'Attenuato' },

  hero: {
    h1: 'Di’ a Lumina il tuo obiettivo. Lei pianifica la tua settimana.',
    sub: 'Attività, agenda e note in un unico posto. Lumina trasforma i tuoi obiettivi in blocchi di concentrazione su Google Calendar.',
    cta: 'Inizia gratis',
    demo: 'Guarda la demo (60 s)',
    micro: 'Senza carta · Accedi con Google o email',
    prompt: 'Pianifica la mia settimana',
    thinking: 'Lumina sta pensando',
    plan: 'Piano suggerito · 4 blocchi',
    add: 'Aggiungi all’agenda',
    added: 'Aggiunto all’agenda',
    placeholder: 'Fai una domanda o chiedi un piano…',
    items: [
      'Relazione finale',
      'Ripasso per l’esame',
      'Proposta per il cliente',
      'Revisione settimanale',
    ],
    durations: ['2 h', '1,5 h', '1 h', '30 min'],
    days: ['Lun', 'Mar', 'Mer', 'Gio', 'Ven'],
    events: ['Lezione', 'Riunione', 'Lezione'],
    alt: 'Focusly: Lumina crea un piano settimanale e inserisce blocchi di concentrazione in agenda',
  },

  trust: {
    aria: 'Integrazioni',
    integrates: 'Funziona con',
    logoTitle: 'Logo ufficiale di Google Calendar',
    beta: 'In beta aperta',
  },

  problem: {
    eyebrow: 'Il problema',
    title: 'Pianificare non dovrebbe costarti la mattinata',
    sub: 'Se la tua settimana vive in Google Calendar e le attività altrove, decidere cosa fare e quando diventa un’attività in più.',
    pains: [
      {
        icon: 'apps',
        title: 'Troppe app',
        desc: 'Le attività in una, l’agenda in un’altra e le note in una terza.',
        fix: 'Attività, agenda, note e IA in un unico posto.',
      },
      {
        icon: 'help',
        title: 'Non so da cosa iniziare',
        desc: 'L’elenco continua a crescere e decidere da dove partire ti mangia la mattinata.',
        fix: 'Lumina dà le priorità e propone un piano per oggi e per la settimana.',
      },
      {
        icon: 'event_busy',
        title: 'La mia agenda non riflette le mie attività',
        desc: 'Ciò che devi fare non ha tempo riservato nella tua settimana.',
        fix: 'Blocchi di concentrazione sincronizzati con Google Calendar.',
      },
    ],
  },

  pillars: {
    eyebrow: 'Prodotto',
    title: 'Tutta la tua settimana in un’unica app',
    tabsAria: 'Pilastri del prodotto',
    tabs: [
      {
        icon: 'calendar_month',
        label: 'Pianificare',
        title: 'Attività e agenda che si parlano',
        bullets: [
          'In arrivo, oggi e prossime, con priorità, tag, sottoattività e registrazione del tempo.',
          'Sincronizzazione bidirezionale con Google Calendar.',
          'Pianificatore settimanale: Lumina inserisce le attività nel tuo orario di lavoro.',
        ],
        mediaAlt:
          'Focusly: Lumina inserisce le attività di In arrivo nella tua settimana lavorativa e le sincronizza con Google Calendar',
      },
      {
        icon: 'timer',
        label: 'Concentrazione',
        title: 'Lavoro profondo, senza distrazioni',
        bullets: [
          'Timer per sessioni di lavoro profondo.',
          'Pause tra le sessioni.',
          'Blocchi di tempo che Lumina propone e tu confermi con un clic.',
        ],
      },
      {
        icon: 'folder_open',
        label: 'Organizzare',
        title: 'Documenti accanto alle tue attività',
        bullets: [
          'Spazi di lavoro con documenti Markdown e anteprima dal vivo.',
          'Documenti organizzati in progetti.',
          'Modelli per iniziare più velocemente.',
        ],
      },
      {
        icon: 'insights',
        label: 'Capire',
        title: 'Dati per pianificare meglio',
        bullets: [
          'Ore di concentrazione e attività completate.',
          'Livello di energia e finestra d’oro.',
          'Mappa di calore e tendenze.',
        ],
      },
    ],
  },

  lumina: {
    eyebrow: 'Lumina AI',
    title: 'Un’assistente che conosce il tuo lavoro',
    sub: 'Lumina chatta con te, capisce le tue attività e i tuoi documenti e propone blocchi di concentrazione in agenda. Tu li confermi con un clic.',
    caps: [
      {
        icon: 'add_task',
        title: 'Crea attività',
        desc: 'Scrivi ciò che ti serve e Lumina crea le attività o un piano completo.',
      },
      {
        icon: 'date_range',
        title: 'Pianifica la tua settimana',
        desc: 'Propone blocchi di concentrazione in agenda; tu li confermi con un clic.',
      },
      {
        icon: 'attach_file',
        title: 'Usa i tuoi documenti',
        desc: 'Risponde con il contesto delle tue attività, le menzioni con @ e i file PDF, DOCX o TXT.',
      },
      {
        icon: 'bookmark_heart',
        title: 'Ricorda le tue preferenze',
        desc: 'Tiene conto di come ti piace lavorare quando propone piani.',
      },
    ],
    demo: {
      aria: 'Demo: Lumina crea quattro attività da un solo messaggio',
      before:
        'Devo consegnare la tesi venerdì e preparare la presentazione. Usa',
      mention: '@Tesi.docx',
      thinking: 'Lumina sta pensando',
      planTitle: 'Piano suggerito · 4 attività',
      tasks: [
        ['Scrivere le conclusioni', 'Oggi · 2 h'],
        ['Rivedere la bibliografia', 'Mar · 1 h'],
        ['Preparare le slide', 'Mer · 1,5 h'],
        ['Provare la presentazione', 'Gio · 45 min'],
      ],
      create: 'Crea tutte',
      created: '4 attività create',
      input: 'Scrivi a Lumina · usa @ per menzionare',
    },
  },

  how: {
    eyebrow: 'Come funziona',
    title: 'Tre passi per una settimana con una direzione',
    steps: [
      {
        icon: 'sync',
        title: 'Collega Google Calendar',
        desc: 'Accedi con Google e i tuoi eventi compaiono in Focusly.',
      },
      {
        icon: 'auto_awesome',
        title: 'Di’ a Lumina i tuoi obiettivi',
        desc: 'Lei crea le attività e propone blocchi nella tua agenda.',
      },
      {
        icon: 'insights',
        title: 'Concentrati e guarda i tuoi Insights',
        desc: 'Lavora in modalità concentrazione e scopri la tua finestra d’oro.',
      },
    ],
  },

  insights: {
    eyebrow: 'Insights',
    title: 'Scopri quando lavori meglio',
    sub: 'Ore di concentrazione, attività completate, livello di energia e la tua finestra d’oro: le ore in cui ti concentri meglio.',
    week: 'Questa settimana',
    sample: 'Dati di esempio',
    focusHours: 'Ore di concentrazione',
    tasksDone: 'Attività completate',
    energy: 'Energia',
    golden: 'Finestra d’oro',
    barsTitle: 'Ore di concentrazione al giorno',
    days: ['L', 'M', 'M', 'G', 'V', 'S', 'D'],
    heatmapTitle: 'Mappa di calore',
    goldenLegend: 'Finestra d’oro · 9:00–11:30',
    hoursUnit: 'h',
  },

  whoSection: {
    eyebrow: 'Per chi è',
    title: 'Per chiunque pianifichi la settimana in Google Calendar',
  },

  beta: {
    title: 'Unisciti alla beta e aiutaci a costruire Focusly',
    sub: 'Prova le novità prima di tutti e dicci cosa migliorare.',
    emailLabel: 'Email',
    placeholder: 'tu@email.com',
    submit: 'Unisciti alla beta',
  },

  pricing: {
    eyebrow: 'Prezzi',
    title: 'Inizia gratis. Passa a un piano superiore quando ti serve.',
    monthly: 'Mensile',
    annual: 'Annuale',
    annualAria: 'Fatturazione annuale',
    save: 'Risparmia [PENDIENTE]',
    recommended: 'Consigliato',
    perMonth: '/mese',
    perMonthAnnual: '/mese · fatturato annualmente',
    managePlan: 'Gestisci il mio piano',
    compareAll: 'Confronta tutto',
    compareTitle: 'Confronta i piani',
    feature: 'Funzionalità',
    note: 'Prezzi e limiti provengono da un’unica configurazione condivisa con la landing page.',
    plans: {
      free: {
        name: 'Free',
        desc: 'Per uso personale',
        cta: 'Inizia gratis',
        feats: [
          'Spazi di lavoro: [LÍMITE]',
          'Attività illimitate',
          'Calendario di base',
        ],
      },
      pro: {
        name: 'Pro',
        desc: 'Per studenti e professionisti',
        cta: 'Scegli Pro',
        feats: [
          'Spazi di lavoro illimitati',
          'Lumina: [LÍMITE] usi al mese',
          'Analisi avanzate',
          'Integrazione con Google Calendar',
        ],
      },
      business: {
        name: 'Business',
        desc: 'Per la massima produttività',
        cta: 'Scegli Business',
        feats: [
          'Lumina illimitata',
          'Coda IA prioritaria',
          'Insights e audit avanzati',
          'Esporta spazi di lavoro (Markdown/Word)',
          'Supporto prioritario e accesso alla beta',
          'SLA e protocolli di sicurezza',
        ],
      },
    },
    table: [
      ['Attività', 'Illimitate', 'Illimitate', 'Illimitate'],
      ['Spazi di lavoro', '[LÍMITE]', 'Illimitati', 'Illimitati'],
      ['Calendario', 'Base', 'Completo', 'Completo'],
      ['Integrazione con Google Calendar', '[PENDIENTE]', '✓', '✓'],
      ['Lumina AI', '[LÍMITE]', '[LÍMITE] usi/mese', 'Illimitata'],
      ['Priorità nella coda IA', '—', '—', '✓'],
      ['Analisi e Insights', '[PENDIENTE]', 'Avanzate', 'Avanzate + audit'],
      ['Esporta spazi di lavoro (Markdown/Word)', '—', '—', '✓'],
      [
        'Supporto',
        '[PENDIENTE]',
        '[PENDIENTE]',
        'Prioritario + accesso alla beta',
      ],
      ['SLA e protocolli di sicurezza', '—', '—', '✓'],
    ],
  },

  security: {
    eyebrow: 'Sicurezza e privacy',
    title: 'I tuoi dati sono tuoi',
    terms: 'Termini',
    privacy: 'Privacy',
    items: [
      {
        icon: 'lock',
        title: 'HTTPS ovunque',
        desc: 'Le tue informazioni viaggiano cifrate.',
      },
      {
        icon: 'block',
        title: 'Non vendiamo i tuoi dati',
        desc: 'Né agli inserzionisti né a terzi.',
      },
      {
        icon: 'shield_person',
        title: 'L’IA lavora solo per te',
        desc: 'Lumina usa le tue informazioni esclusivamente per risponderti.',
      },
      {
        icon: 'delete',
        title: 'Elimina l’account quando vuoi',
        desc: 'Rimuovi account e dati dalle Impostazioni.',
      },
    ],
  },

  faq: {
    title: 'Domande frequenti',
    items: [
      [
        'Quanto costa Focusly?',
        'Puoi iniziare gratis, senza carta. Pro costa [PRECIO] e Business [PRECIO] al mese.',
      ],
      [
        'Posso annullare quando voglio?',
        'Sì, dalle Impostazioni. [PENDIENTE: condiciones de reembolso y fin de periodo]',
      ],
      [
        'Cosa vede Lumina delle mie informazioni?',
        'Solo ciò che le serve per risponderti: le tue attività, i documenti che menzioni con @ e i file che alleghi. Non li usa per nient’altro.',
      ],
      [
        'Come funziona la sincronizzazione con Google Calendar?',
        'È bidirezionale: ciò che crei in Focusly compare in Google Calendar e viceversa. I blocchi proposti da Lumina vengono aggiunti solo dopo la tua conferma.',
      ],
      [
        'Posso esportare i miei dati?',
        'I documenti dei tuoi spazi di lavoro si esportano in Markdown e Word. [PENDIENTE: exportación de tareas y disponibilidad por plan]',
      ],
      [
        'In quali lingue è disponibile?',
        'Spagnolo, inglese (USA e Regno Unito), portoghese (Brasile), francese, tedesco, italiano, giapponese, coreano e cinese semplificato.',
      ],
      [
        'Funziona sul telefono?',
        'Focusly è un’app web e funziona nel browser del telefono. [PENDIENTE: app nativa]',
      ],
      [
        'I miei dati sono al sicuro?',
        'Usiamo HTTPS, non vendiamo i tuoi dati e puoi eliminare l’account quando vuoi. Più dettagli nell’informativa sulla privacy.',
      ],
      [
        'Mi serve una password?',
        'No. Accedi con un link magico che ti inviamo via email o con il tuo account Google.',
      ],
    ],
  },

  finalCta: {
    title: 'La tua prossima settimana, già organizzata',
    sub: 'Collega la tua agenda e di’ a Lumina cosa devi ottenere.',
    cta: 'Inizia gratis',
    micro: 'Senza carta · Accedi con Google o email',
  },

  footer: {
    tagline: 'Attività, agenda, note e IA in un unico posto.',
    product: 'Prodotto',
    resources: 'Risorse',
    legal: 'Note legali',
    terms: 'Termini',
    privacy: 'Privacy',
    language: 'Lingua',
    theme: 'Tema',
  },

  demoModal: { aria: 'Demo di Focusly, 60 secondi', close: 'Chiudi video' },

  page: {
    breadcrumbAria: 'Percorso di navigazione',
    home: 'Home',
    seePricing: 'Vedi i prezzi',
    explore: 'Continua a esplorare',
    finalTitle: 'La tua prossima settimana, già organizzata',
    useTemplate: 'Usa modello',
    preview: 'anteprima',
    filterTemplates: 'Filtra modelli',
    helpSearchLabel: 'Cerca nel centro assistenza',
    helpPlaceholder: 'Cerca una guida o una domanda',
    helpEmpty: 'Nessun risultato per “{q}”.',
    helpContactTitle: 'Non trovi ciò che cerchi?',
    helpContactDesc: 'Scrivici e ti risponderemo.',
    helpContact: 'Contattaci',
  },

  help: [
    {
      icon: 'rocket_launch',
      title: 'Primi passi',
      desc: 'Crea l’account con un link magico o Google e imposta il tuo orario.',
    },
    {
      icon: 'checklist',
      title: 'Attività',
      desc: 'In arrivo, oggi, prossime, priorità, tag e sottoattività.',
    },
    {
      icon: 'calendar_month',
      title: 'Calendario e Google Calendar',
      desc: 'Collega il tuo account e capisci la sincronizzazione.',
    },
    {
      icon: 'auto_awesome',
      title: 'Lumina AI',
      desc: 'Menzioni con @, allegati e piani settimanali.',
    },
    {
      icon: 'description',
      title: 'Spazi di lavoro',
      desc: 'Documenti Markdown, progetti e modelli.',
    },
    {
      icon: 'manage_accounts',
      title: 'Account e fatturazione',
      desc: 'Piani, lingua, tema ed eliminazione dell’account.',
    },
  ],

  changelog: [
    {
      version: 'Workspaces 2.0',
      date: '[PENDIENTE: fecha]',
      tag: 'Novità',
      title: 'È arrivato Workspaces 2.0',
      desc: '[PENDIENTE: resumen real de los cambios]',
    },
    {
      version: '[PENDIENTE]',
      date: '[PENDIENTE: fecha]',
      tag: 'Miglioramento',
      title: '[PENDIENTE: título]',
      desc: '[PENDIENTE: descripción]',
    },
    {
      version: '[PENDIENTE]',
      date: '[PENDIENTE: fecha]',
      tag: 'Correzione',
      title: '[PENDIENTE: título]',
      desc: '[PENDIENTE: descripción]',
    },
  ],

  templateCategories: [
    'Tutti',
    'Pianificazione',
    'Studio',
    'Lavoro',
    'Contenuti',
  ],
  templates: [
    {
      cat: 'Pianificazione',
      name: 'Pianificazione settimanale',
      desc: 'Obiettivi, priorità e revisione della settimana.',
    },
    {
      cat: 'Studio',
      name: 'Piano di studio',
      desc: 'Argomenti, date degli esami e sessioni di ripasso.',
    },
    {
      cat: 'Lavoro',
      name: 'Monitoraggio clienti',
      desc: 'Ambito, consegne e note per ogni cliente.',
    },
    {
      cat: 'Lavoro',
      name: 'Verbale di riunione',
      desc: 'Partecipanti, decisioni e prossimi passi.',
    },
    {
      cat: 'Lavoro',
      name: 'Documentazione tecnica',
      desc: 'Contesto, decisioni e specifica.',
    },
    {
      cat: 'Contenuti',
      name: 'Sceneggiatura video',
      desc: 'Idea, struttura, sceneggiatura e checklist di pubblicazione.',
    },
  ],
};
