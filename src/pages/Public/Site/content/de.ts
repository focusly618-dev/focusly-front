import type { SiteContent } from './types';

export const de: SiteContent = {
  items: {
    tasks: {
      name: 'Aufgaben',
      desc: 'Eingang, heute und demnächst, mit Prioritäten und Unteraufgaben',
    },
    calendar: {
      name: 'Kalender und Google Kalender',
      short: 'Kalender',
      desc: 'Synchronisierung in beide Richtungen mit deinem Kalender',
    },
    planner: {
      name: 'KI-Planer',
      desc: 'Lumina verteilt deine Aufgaben auf deine Arbeitszeiten',
    },
    focus: { name: 'Fokusmodus', desc: 'Deep-Work-Sitzungen und Pausen' },
    timeBlocks: {
      name: 'Zeitblöcke',
      desc: 'Lumina schlägt sie vor, du bestätigst sie',
    },
    workspaces: {
      name: 'Arbeitsbereiche und Notizen',
      desc: 'Markdown mit Live-Vorschau',
    },
    projects: {
      name: 'Projekte',
      desc: 'Gruppiere deine Dokumente nach Projekt',
    },
    templates: {
      name: 'Vorlagen',
      desc: 'Sofort nutzbare Dokumente und Pläne',
    },
    insights: {
      name: 'Insights und goldenes Zeitfenster',
      short: 'Insights',
      desc: 'Die Stunden, in denen du dich am besten konzentrierst',
    },
    lumina: {
      name: 'Lumina AI',
      desc: 'Deine KI-Assistentin für Planung und Fokus',
    },
    students: {
      name: 'Studierende',
      desc: 'Verteile das Lernen für jede Prüfung in Blöcken bis zum Termin.',
    },
    freelancers: {
      name: 'Freelancer',
      desc: 'Bring mehrere Kunden unter einen Hut und erfasse die Zeit jedes Projekts.',
    },
    developers: {
      name: 'Entwickler',
      desc: 'Schütze Deep-Work-Stunden zwischen Meetings.',
    },
    creators: {
      name: 'Creator',
      desc: 'Plane Skript, Aufnahme und Veröffentlichung in derselben Woche.',
    },
    pricing: { name: 'Preise', desc: 'Tarife Free, Pro und Business' },
    help: {
      name: 'Hilfe-Center',
      desc: 'Schritt-für-Schritt-Anleitungen und Antworten',
    },
    changelog: {
      name: 'Neuigkeiten',
      desc: 'Änderungen und Verbesserungen in jeder Version',
    },
  },

  pages: {
    tasks: {
      group: 'Produkt · Planen',
      title: 'Alle deine Aufgaben, geordnet',
      sub: 'Eingang, heute und demnächst, mit Prioritäten, Tags, Unteraufgaben und Zeiterfassung in einer einzigen Liste.',
      blocks: [
        [
          'Eingang, Heute und Demnächst',
          'Sammle alles im Eingang und entscheide später. Heute zeigt, was fällig ist; Demnächst, was als Nächstes kommt.',
        ],
        [
          'Prioritäten und Tags',
          'Markiere Dringendes und gruppiere nach Kontext, Kunde oder Thema.',
        ],
        [
          'Unteraufgaben und Zeiterfassung',
          'Teile die Arbeit in Schritte und erfasse, wie lange jeder dauert.',
        ],
      ],
    },
    calendar: {
      group: 'Produkt · Planen',
      title: 'Dein Kalender und deine Aufgaben, endlich vereint',
      sub: 'Synchronisierung in beide Richtungen mit Google Kalender: Was du auf einer Seite änderst, erscheint auf der anderen.',
      blocks: [
        [
          'Synchronisierung in beide Richtungen',
          'Deine Google-Kalender-Termine erscheinen in Focusly, und was du in Focusly erstellst, erscheint in Google Kalender.',
        ],
        [
          'Termine und Blöcke in einer Ansicht',
          'Sieh Meetings, Kurse und Fokusblöcke in derselben Woche.',
        ],
        [
          'Nichts ohne deine Bestätigung',
          'Lumina schlägt Blöcke vor; sie landen erst in deinem Kalender, wenn du sie bestätigst.',
        ],
      ],
    },
    planner: {
      group: 'Produkt · Planen',
      title: 'Deine Woche in Minuten geplant',
      sub: 'Lumina verteilt deine Aufgaben auf deine Arbeitszeiten und schlägt einen Wochenplan vor.',
      blocks: [
        [
          'Respektiert deine Arbeitszeiten',
          'Blöcke landen nur in den Stunden, die du als Arbeitszeit festgelegt hast.',
        ],
        [
          'Prüfen, bevor du bestätigst',
          'Passe Blöcke an oder verwirf sie und bestätige den Plan mit einem Klick.',
        ],
        [
          'Direkt in Google Kalender',
          'Der bestätigte Plan erscheint in deinem Kalender.',
        ],
      ],
    },
    focus: {
      group: 'Produkt · Fokus',
      title: 'Deep-Work-Sitzungen, mit Pausen',
      sub: 'Ein Timer, um dich auf eine Aufgabe zu konzentrieren und zwischen den Sitzungen durchzuatmen.',
      blocks: [
        [
          'Sitzungs-Timer',
          'Wähle eine Aufgabe und arbeite daran, ohne den Tab zu wechseln.',
        ],
        [
          'Pausen zwischen Sitzungen',
          'Wechsle zwischen Deep Work und Pausen, um dein Tempo zu halten.',
        ],
        [
          'Deine Stunden zählen',
          'Jede Sitzung fließt in deine Insights ein: Fokusstunden und goldenes Zeitfenster.',
        ],
      ],
    },
    timeBlocks: {
      group: 'Produkt · Fokus',
      title: 'Reserviere Zeit für das Wichtige',
      sub: 'Fokusblöcke in deinem Kalender, die Lumina vorschlägt und du mit einem Klick bestätigst.',
      blocks: [
        [
          'Von Lumina vorgeschlagen',
          'Lumina findet Lücken in deiner Woche für jede Aufgabe.',
        ],
        ['Mit einem Klick bestätigt', 'Nimm alle an, einzeln oder keinen.'],
        [
          'Sichtbar in Google Kalender',
          'Deine Blöcke erscheinen im Kalender, damit niemand diese Zeit belegt.',
        ],
      ],
    },
    workspaces: {
      group: 'Produkt · Organisieren',
      title: 'Dokumente direkt neben deiner Arbeit',
      sub: 'Schreibe in Markdown mit Live-Vorschau und halte deine Notizen neben deinen Aufgaben.',
      blocks: [
        [
          'Markdown mit Live-Vorschau',
          'Formatiere, ohne die Tastatur zu verlassen, und sieh das Ergebnis sofort.',
        ],
        ['In Projekten organisiert', 'Jedes Dokument liegt in seinem Projekt.'],
        [
          'Lumina versteht sie',
          'Erwähne ein Dokument mit @ und Lumina antwortet mit seinem Kontext.',
        ],
      ],
    },
    projects: {
      group: 'Produkt · Organisieren',
      title: 'Jedes Projekt an seinem Platz',
      sub: 'Gruppiere die Dokumente eines Projekts in deinen Arbeitsbereichen.',
      blocks: [
        [
          'Ein Bereich pro Projekt',
          'Notizen, Spezifikationen und Pläne an einem Ort.',
        ],
        [
          'Mit Vorlagen starten',
          'Erstelle die Projektstruktur aus einer Vorlage.',
        ],
        [
          'Kontext für Lumina',
          'Lumina kann die Dokumente des Projekts nutzen, um dir zu antworten.',
        ],
      ],
    },
    insights: {
      group: 'Produkt · Verstehen',
      title: 'Finde heraus, wann du am besten arbeitest',
      sub: 'Fokusstunden, erledigte Aufgaben, Energiewert, goldenes Zeitfenster, Heatmap und Trends.',
      blocks: [
        [
          'Fokusstunden und erledigte Aufgaben',
          'Sieh, wie viel Deep Work du leistest und wie viel du pro Woche abschließt.',
        ],
        [
          'Energiewert',
          'Verfolge, wie sich deine Energie im Lauf der Woche verändert.',
        ],
        [
          'Goldenes Zeitfenster',
          'Die Stunden, in denen du dich am besten konzentrierst – reserviere sie für das Schwierige.',
        ],
        ['Heatmap und Trends', 'Erkenne Muster nach Tag und Uhrzeit.'],
      ],
    },
    lumina: {
      group: 'Lumina AI',
      cta2: 'Zum Planer',
      title: 'Das ist Lumina',
      sub: 'Deine KI-Assistentin in Focusly: Sie chattet mit dir, versteht deine Aufgaben und Dokumente und organisiert deine Woche.',
      blocks: [
        [
          'Erstellt Aufgaben und ganze Pläne',
          'Beschreibe, was du erreichen willst, und Lumina erstellt die Aufgaben mit Unteraufgaben und Prioritäten.',
        ],
        [
          'Plant deine Woche',
          'Schlägt Fokusblöcke in deinem Kalender vor; du bestätigst sie mit einem Klick.',
        ],
        [
          'Antwortet mit deinen Dokumenten',
          'Nutzt den Kontext deiner Aufgaben, @-Erwähnungen und PDF-, DOCX- oder TXT-Dateien.',
        ],
        [
          'Merkt sich deine Vorlieben',
          'Berücksichtigt bei Planvorschlägen, wie du gern arbeitest.',
        ],
        [
          'Deine Informationen, nur für dich',
          'Lumina nutzt deine Daten ausschließlich, um dir zu antworten.',
        ],
      ],
    },
    templates: {
      group: 'Ressourcen',
      title: 'Vorlagen für einen schnelleren Start',
      sub: 'Dokumente und Pläne mit fertiger Struktur für deine Arbeitsbereiche.',
    },
    students: {
      group: 'Für wen',
      title: 'Focusly für Studierende',
      sub: 'Verteile das Lernen für jede Prüfung in Blöcken bis zum Termin.',
      blocks: [
        [
          'Ein Plan pro Prüfung',
          'Nenne Lumina Termin und Fach; sie verteilt die Wiederholung über deine Woche.',
        ],
        [
          'Vom Lehrplan zu Aufgaben',
          'Hänge den Lehrplan als PDF an und Lumina macht daraus ein Projekt mit Notizen und Lernaufgaben.',
        ],
        [
          'Lernsitzungen',
          'Nutze den Fokusmodus mit Pausen, um ohne Ablenkung zu lernen.',
        ],
      ],
    },
    freelancers: {
      group: 'Für wen',
      title: 'Focusly für Freelancer',
      sub: 'Bring mehrere Kunden unter einen Hut und erfasse die Zeit jedes Projekts.',
      blocks: [
        [
          'Ein Projekt pro Kunde',
          'Aufgaben, Notizen und Lieferungen jedes Kunden in einem eigenen Bereich.',
        ],
        [
          'Zeiterfassung',
          'Wisse, wie viel Zeit du für jede Aufgabe und jeden Kunden aufwendest.',
        ],
        [
          'Kundengespräche',
          'Erstelle das Meeting direkt aus der Aufgabe, mit Google-Meet-Link und Einladung für deinen Kunden.',
        ],
      ],
    },
    developers: {
      group: 'Für wen',
      title: 'Focusly für Entwickler',
      sub: 'Schütze Deep-Work-Stunden zwischen Meetings.',
      blocks: [
        [
          'Deep-Work-Blöcke',
          'Reserviere Zeit im Kalender, bevor er sich mit Meetings füllt.',
        ],
        [
          'Dein Sprint auf einem Board',
          'Wechsle von der Liste zum Kanban und schiebe jede Aufgabe von Zu erledigen nach Erledigt.',
        ],
        [
          'Schwierige Arbeit im goldenen Zeitfenster',
          'Plane komplexe Aufgaben in die Stunden, in denen du dich am besten konzentrierst.',
        ],
      ],
    },
    creators: {
      group: 'Für wen',
      title: 'Focusly für Creator',
      sub: 'Plane Skript, Aufnahme und Veröffentlichung in derselben Woche.',
      blocks: [
        [
          'Vom Skript zur Veröffentlichung',
          'Jeder Beitrag als Aufgabe mit Unteraufgaben: Skript, Aufnahme, Schnitt und Veröffentlichung.',
        ],
        [
          'Lumina schreibt mit dir',
          'Lass sie dein Skript entwerfen, zusammenfassen oder umformulieren, ohne den Editor zu verlassen.',
        ],
        [
          'Dein Veröffentlichungskalender',
          'Termine synchronisiert mit Google Kalender.',
        ],
      ],
    },
    pricing: {
      group: 'Preise',
      title: 'Tarife und Preise',
      sub: 'Starte kostenlos, ohne Karte, und wechsle, wenn du mehr brauchst.',
    },
    help: {
      group: 'Ressourcen',
      title: 'Hilfe-Center',
      sub: 'Schritt-für-Schritt-Anleitungen und Antworten, um das Beste aus Focusly herauszuholen.',
    },
    changelog: {
      group: 'Ressourcen',
      title: 'Neuigkeiten',
      sub: 'Die Änderungen und Verbesserungen in jeder Focusly-Version.',
    },
  },

  nav: {
    homeAria: 'Focusly, zur Startseite',
    mainAria: 'Hauptnavigation',
    product: 'Produkt',
    lumina: 'Lumina AI',
    who: 'Für wen',
    pricing: 'Preise',
    resources: 'Ressourcen',
    login: 'Anmelden',
    start: 'Kostenlos starten',
    openApp: 'Focusly öffnen',
    language: 'Sprache',
    openMenu: 'Menü öffnen',
    closeMenu: 'Menü schließen',
    menu: 'Menü',
    themeAria: 'Design: {name}. Design ändern',
    columns: {
      plan: 'Planen',
      focus: 'Fokus',
      organize: 'Organisieren',
      understand: 'Verstehen',
    },
    luminaCard: {
      title: 'Lumina AI',
      desc: 'Macht aus einem Ziel einen Plan mit Blöcken in deinem Kalender.',
      cta: 'Lumina kennenlernen',
      prompt: 'Plane meine Woche',
    },
  },

  themes: { light: 'Hell', dark: 'Dunkel', graydark: 'Gedimmt' },

  hero: {
    h1: 'Sag Lumina dein Ziel. Sie plant deine Woche.',
    sub: 'Aufgaben, Kalender und Notizen an einem Ort. Lumina macht aus deinen Zielen Fokusblöcke in deinem Google Kalender.',
    cta: 'Kostenlos starten',
    demo: 'Demo ansehen (60 s)',
    micro: 'Ohne Karte · Anmeldung mit Google oder E-Mail',
    prompt: 'Plane meine Woche',
    thinking: 'Lumina denkt nach',
    plan: 'Vorgeschlagener Plan · 4 Blöcke',
    add: 'Zum Kalender hinzufügen',
    added: 'Zum Kalender hinzugefügt',
    placeholder: 'Frag etwas oder bitte um einen Plan…',
    items: [
      'Abschlussbericht',
      'Prüfungsvorbereitung',
      'Kundenangebot',
      'Wochenrückblick',
    ],
    durations: ['2 Std.', '1,5 Std.', '1 Std.', '30 Min.'],
    days: ['Mo', 'Di', 'Mi', 'Do', 'Fr'],
    events: ['Kurs', 'Meeting', 'Kurs'],
    alt: 'Focusly: Lumina erstellt einen Wochenplan und setzt Fokusblöcke in den Kalender',
  },

  trust: {
    aria: 'Integrationen',
    integrates: 'Funktioniert mit',
    logoTitle: 'Offizielles Google-Kalender-Logo',
    beta: 'In offener Beta',
  },

  problem: {
    eyebrow: 'Das Problem',
    title: 'Planen sollte dich nicht den Vormittag kosten',
    sub: 'Wenn deine Woche in Google Kalender lebt und deine Aufgaben woanders, wird die Entscheidung, was wann zu tun ist, zu einer weiteren Aufgabe.',
    pains: [
      {
        icon: 'apps',
        title: 'Zu viele Apps',
        desc: 'Aufgaben in der einen, Kalender in der anderen und Notizen in einer dritten.',
        fix: 'Aufgaben, Kalender, Notizen und KI an einem Ort.',
      },
      {
        icon: 'help',
        title: 'Ich weiß nicht, womit ich anfangen soll',
        desc: 'Die Liste wächst ständig, und die Entscheidung, wo du anfängst, frisst deinen Vormittag.',
        fix: 'Lumina priorisiert und schlägt einen Plan für heute und die Woche vor.',
      },
      {
        icon: 'event_busy',
        title: 'Mein Kalender spiegelt meine Aufgaben nicht wider',
        desc: 'Für das, was du erledigen musst, ist in deiner Woche keine Zeit reserviert.',
        fix: 'Fokusblöcke, synchronisiert mit Google Kalender.',
      },
    ],
  },

  pillars: {
    eyebrow: 'Produkt',
    title: 'Deine ganze Woche in einer App',
    tabsAria: 'Säulen des Produkts',
    tabs: [
      {
        icon: 'calendar_month',
        label: 'Planen',
        title: 'Aufgaben und Kalender, die miteinander reden',
        bullets: [
          'Eingang, heute und demnächst, mit Prioritäten, Tags, Unteraufgaben und Zeiterfassung.',
          'Synchronisierung in beide Richtungen mit Google Kalender.',
          'Wochenplaner: Lumina verteilt deine Aufgaben auf deine Arbeitszeiten.',
        ],
        mediaAlt:
          'Focusly: Lumina verteilt die Aufgaben aus deinem Eingang auf deine Arbeitswoche und synchronisiert sie mit Google Kalender',
      },
      {
        icon: 'timer',
        label: 'Fokus',
        title: 'Deep Work, ohne Ablenkungen',
        bullets: [
          'Timer für Deep-Work-Sitzungen.',
          'Pausen zwischen den Sitzungen.',
          'Zeitblöcke, die Lumina vorschlägt und du mit einem Klick bestätigst.',
        ],
      },
      {
        icon: 'folder_open',
        label: 'Organisieren',
        title: 'Dokumente neben deinen Aufgaben',
        bullets: [
          'Arbeitsbereiche mit Markdown-Dokumenten und Live-Vorschau.',
          'Dokumente in Projekten organisiert.',
          'Vorlagen für einen schnelleren Start.',
        ],
      },
      {
        icon: 'insights',
        label: 'Verstehen',
        title: 'Daten, um besser zu planen',
        bullets: [
          'Fokusstunden und erledigte Aufgaben.',
          'Energiewert und goldenes Zeitfenster.',
          'Heatmap und Trends.',
        ],
      },
    ],
  },

  lumina: {
    eyebrow: 'Lumina AI',
    title: 'Eine Assistentin, die deine Arbeit kennt',
    sub: 'Lumina chattet mit dir, versteht deine Aufgaben und Dokumente und schlägt Fokusblöcke in deinem Kalender vor. Du bestätigst sie mit einem Klick.',
    caps: [
      {
        icon: 'add_task',
        title: 'Erstellt Aufgaben',
        desc: 'Schreib, was du brauchst, und Lumina erstellt die Aufgaben oder einen ganzen Plan.',
      },
      {
        icon: 'date_range',
        title: 'Plant deine Woche',
        desc: 'Schlägt Fokusblöcke in deinem Kalender vor; du bestätigst sie mit einem Klick.',
      },
      {
        icon: 'attach_file',
        title: 'Nutzt deine Dokumente',
        desc: 'Antwortet mit dem Kontext deiner Aufgaben, @-Erwähnungen und PDF-, DOCX- oder TXT-Dateien.',
      },
      {
        icon: 'bookmark_heart',
        title: 'Merkt sich deine Vorlieben',
        desc: 'Berücksichtigt bei Planvorschlägen, wie du gern arbeitest.',
      },
    ],
    demo: {
      aria: 'Demo: Lumina erstellt aus einer Nachricht vier Aufgaben',
      before:
        'Ich muss am Freitag meine Abschlussarbeit abgeben und die Präsentation vorbereiten. Nutze',
      mention: '@Abschlussarbeit.docx',
      thinking: 'Lumina denkt nach',
      planTitle: 'Vorgeschlagener Plan · 4 Aufgaben',
      tasks: [
        ['Fazit schreiben', 'Heute · 2 Std.'],
        ['Literatur prüfen', 'Di · 1 Std.'],
        ['Folien gestalten', 'Mi · 1,5 Std.'],
        ['Präsentation üben', 'Do · 45 Min.'],
      ],
      create: 'Alle erstellen',
      created: '4 Aufgaben erstellt',
      input: 'Nachricht an Lumina · @ zum Erwähnen',
    },
  },

  how: {
    eyebrow: 'So funktioniert’s',
    title: 'In drei Schritten zu einer Woche mit Richtung',
    steps: [
      {
        icon: 'sync',
        title: 'Google Kalender verbinden',
        desc: 'Melde dich mit Google an und deine Termine erscheinen in Focusly.',
      },
      {
        icon: 'auto_awesome',
        title: 'Sag Lumina deine Ziele',
        desc: 'Sie erstellt die Aufgaben und schlägt Blöcke in deinem Kalender vor.',
      },
      {
        icon: 'insights',
        title: 'Fokussieren und Insights ansehen',
        desc: 'Arbeite im Fokusmodus und entdecke dein goldenes Zeitfenster.',
      },
    ],
  },

  insights: {
    eyebrow: 'Insights',
    title: 'Finde heraus, wann du am besten arbeitest',
    sub: 'Fokusstunden, erledigte Aufgaben, Energiewert und dein goldenes Zeitfenster: die Stunden, in denen du dich am besten konzentrierst.',
    week: 'Diese Woche',
    sample: 'Beispieldaten',
    focusHours: 'Fokusstunden',
    tasksDone: 'Erledigte Aufgaben',
    energy: 'Energie',
    golden: 'Goldenes Zeitfenster',
    barsTitle: 'Fokusstunden pro Tag',
    days: ['M', 'D', 'M', 'D', 'F', 'S', 'S'],
    heatmapTitle: 'Heatmap',
    goldenLegend: 'Goldenes Zeitfenster · 9:00–11:30',
    hoursUnit: 'h',
  },

  whoSection: {
    eyebrow: 'Für wen',
    title: 'Für alle, die ihre Woche in Google Kalender planen',
  },

  beta: {
    title: 'Mach bei der Beta mit und hilf uns, Focusly zu bauen',
    sub: 'Teste Neues vor allen anderen und sag uns, was wir verbessern sollen.',
    emailLabel: 'E-Mail',
    placeholder: 'du@email.com',
    submit: 'Bei der Beta mitmachen',
  },

  pricing: {
    eyebrow: 'Preise',
    title: 'Starte kostenlos. Wechsle, wenn du mehr brauchst.',
    monthly: 'Monatlich',
    annual: 'Jährlich',
    annualAria: 'Jährliche Abrechnung',
    save: 'Spare [PENDIENTE]',
    recommended: 'Empfohlen',
    perMonth: '/Monat',
    perMonthAnnual: '/Monat · jährlich abgerechnet',
    managePlan: 'Meinen Tarif verwalten',
    compareAll: 'Alles vergleichen',
    compareTitle: 'Tarife vergleichen',
    feature: 'Funktion',
    note: 'Preise und Limits stammen aus einer einzigen Konfiguration, die mit der Landingpage geteilt wird.',
    plans: {
      free: {
        name: 'Free',
        desc: 'Für die private Nutzung',
        cta: 'Kostenlos starten',
        feats: [
          'Arbeitsbereiche: [LÍMITE]',
          'Unbegrenzte Aufgaben',
          'Basis-Kalender',
        ],
      },
      pro: {
        name: 'Pro',
        desc: 'Für Studierende und Profis',
        cta: 'Pro wählen',
        feats: [
          'Unbegrenzte Arbeitsbereiche',
          'Lumina: [LÍMITE] Nutzungen pro Monat',
          'Erweiterte Analysen',
          'Google-Kalender-Integration',
        ],
      },
      business: {
        name: 'Business',
        desc: 'Für maximale Produktivität',
        cta: 'Business wählen',
        feats: [
          'Unbegrenzt Lumina',
          'Bevorzugte KI-Warteschlange',
          'Erweiterte Insights und Audits',
          'Arbeitsbereiche exportieren (Markdown/Word)',
          'Bevorzugter Support und Beta-Zugang',
          'SLA und Sicherheitsprotokolle',
        ],
      },
    },
    table: [
      ['Aufgaben', 'Unbegrenzt', 'Unbegrenzt', 'Unbegrenzt'],
      ['Arbeitsbereiche', '[LÍMITE]', 'Unbegrenzt', 'Unbegrenzt'],
      ['Kalender', 'Basis', 'Vollständig', 'Vollständig'],
      ['Google-Kalender-Integration', '[PENDIENTE]', '✓', '✓'],
      ['Lumina AI', '[LÍMITE]', '[LÍMITE] Nutzungen/Monat', 'Unbegrenzt'],
      ['KI-Warteschlangen-Priorität', '—', '—', '✓'],
      [
        'Analysen und Insights',
        '[PENDIENTE]',
        'Erweitert',
        'Erweitert + Audits',
      ],
      ['Arbeitsbereiche exportieren (Markdown/Word)', '—', '—', '✓'],
      ['Support', '[PENDIENTE]', '[PENDIENTE]', 'Bevorzugt + Beta-Zugang'],
      ['SLA und Sicherheitsprotokolle', '—', '—', '✓'],
    ],
  },

  security: {
    eyebrow: 'Sicherheit und Datenschutz',
    title: 'Deine Daten gehören dir',
    terms: 'AGB',
    privacy: 'Datenschutz',
    items: [
      {
        icon: 'lock',
        title: 'Überall HTTPS',
        desc: 'Deine Informationen werden verschlüsselt übertragen.',
      },
      {
        icon: 'block',
        title: 'Wir verkaufen deine Daten nicht',
        desc: 'Weder an Werbetreibende noch an Dritte.',
      },
      {
        icon: 'shield_person',
        title: 'Die KI arbeitet nur für dich',
        desc: 'Lumina nutzt deine Informationen ausschließlich, um dir zu antworten.',
      },
      {
        icon: 'delete',
        title: 'Konto jederzeit löschen',
        desc: 'Entferne dein Konto und deine Daten in den Einstellungen.',
      },
    ],
  },

  faq: {
    title: 'Häufige Fragen',
    items: [
      [
        'Was kostet Focusly?',
        'Du kannst kostenlos starten, ohne Karte. Pro kostet [PRECIO] und Business [PRECIO] pro Monat.',
      ],
      [
        'Kann ich jederzeit kündigen?',
        'Ja, in den Einstellungen. [PENDIENTE: condiciones de reembolso y fin de periodo]',
      ],
      [
        'Was sieht Lumina von meinen Informationen?',
        'Nur das, was sie braucht, um dir zu antworten: deine Aufgaben, die Dokumente, die du mit @ erwähnst, und die Dateien, die du anhängst. Für nichts anderes nutzt sie sie.',
      ],
      [
        'Wie funktioniert die Synchronisierung mit Google Kalender?',
        'In beide Richtungen: Was du in Focusly erstellst, erscheint in Google Kalender und umgekehrt. Blöcke, die Lumina vorschlägt, werden erst nach deiner Bestätigung hinzugefügt.',
      ],
      [
        'Kann ich meine Daten exportieren?',
        'Die Dokumente deiner Arbeitsbereiche lassen sich als Markdown und Word exportieren. [PENDIENTE: exportación de tareas y disponibilidad por plan]',
      ],
      [
        'In welchen Sprachen ist es verfügbar?',
        'Spanisch, Englisch (USA und Großbritannien), Portugiesisch (Brasilien), Französisch, Deutsch, Italienisch, Japanisch, Koreanisch und vereinfachtes Chinesisch.',
      ],
      [
        'Funktioniert es auf dem Handy?',
        'Focusly ist eine Web-App und funktioniert im Browser deines Handys. [PENDIENTE: app nativa]',
      ],
      [
        'Sind meine Daten sicher?',
        'Wir nutzen HTTPS, verkaufen deine Daten nicht, und du kannst dein Konto jederzeit löschen. Mehr dazu im Datenschutzhinweis.',
      ],
      [
        'Brauche ich ein Passwort?',
        'Nein. Du meldest dich mit einem Magic Link per E-Mail oder mit deinem Google-Konto an.',
      ],
    ],
  },

  finalCta: {
    title: 'Deine nächste Woche, schon organisiert',
    sub: 'Verbinde deinen Kalender und sag Lumina, was du erreichen willst.',
    cta: 'Kostenlos starten',
    micro: 'Ohne Karte · Anmeldung mit Google oder E-Mail',
  },

  footer: {
    tagline: 'Aufgaben, Kalender, Notizen und KI an einem Ort.',
    product: 'Produkt',
    resources: 'Ressourcen',
    legal: 'Rechtliches',
    terms: 'AGB',
    privacy: 'Datenschutz',
    language: 'Sprache',
    theme: 'Design',
  },

  demoModal: { aria: 'Focusly-Demo, 60 Sekunden', close: 'Video schließen' },

  page: {
    breadcrumbAria: 'Brotkrumennavigation',
    home: 'Start',
    seePricing: 'Preise ansehen',
    explore: 'Weiter entdecken',
    finalTitle: 'Deine nächste Woche, schon organisiert',
    useTemplate: 'Vorlage verwenden',
    preview: 'Vorschau',
    filterTemplates: 'Vorlagen filtern',
    helpSearchLabel: 'Im Hilfe-Center suchen',
    helpPlaceholder: 'Suche nach einer Anleitung oder Frage',
    helpEmpty: 'Keine Ergebnisse für „{q}“.',
    helpContactTitle: 'Nicht gefunden, was du suchst?',
    helpContactDesc: 'Schreib uns und wir melden uns.',
    helpContact: 'Kontakt',
  },

  help: [
    {
      icon: 'rocket_launch',
      title: 'Erste Schritte',
      desc: 'Erstelle dein Konto per Magic Link oder Google und lege deine Arbeitszeiten fest.',
    },
    {
      icon: 'checklist',
      title: 'Aufgaben',
      desc: 'Eingang, heute, demnächst, Prioritäten, Tags und Unteraufgaben.',
    },
    {
      icon: 'calendar_month',
      title: 'Kalender und Google Kalender',
      desc: 'Verbinde dein Konto und verstehe die Synchronisierung.',
    },
    {
      icon: 'auto_awesome',
      title: 'Lumina AI',
      desc: '@-Erwähnungen, Anhänge und Wochenpläne.',
    },
    {
      icon: 'description',
      title: 'Arbeitsbereiche',
      desc: 'Markdown-Dokumente, Projekte und Vorlagen.',
    },
    {
      icon: 'manage_accounts',
      title: 'Konto und Abrechnung',
      desc: 'Tarife, Sprache, Design und Kontolöschung.',
    },
  ],

  changelog: [
    {
      version: 'Workspaces 2.0',
      date: '[PENDIENTE: fecha]',
      tag: 'Neu',
      title: 'Workspaces 2.0 ist da',
      desc: '[PENDIENTE: resumen real de los cambios]',
    },
    {
      version: '[PENDIENTE]',
      date: '[PENDIENTE: fecha]',
      tag: 'Verbesserung',
      title: '[PENDIENTE: título]',
      desc: '[PENDIENTE: descripción]',
    },
    {
      version: '[PENDIENTE]',
      date: '[PENDIENTE: fecha]',
      tag: 'Fehlerbehebung',
      title: '[PENDIENTE: título]',
      desc: '[PENDIENTE: descripción]',
    },
  ],

  templateCategories: ['Alle', 'Planung', 'Lernen', 'Arbeit', 'Content'],
  templates: [
    {
      cat: 'Planung',
      name: 'Wochenplanung',
      desc: 'Ziele, Prioritäten und Wochenrückblick.',
    },
    {
      cat: 'Lernen',
      name: 'Lernplan',
      desc: 'Themen, Prüfungstermine und Wiederholungseinheiten.',
    },
    {
      cat: 'Arbeit',
      name: 'Kunden-Tracker',
      desc: 'Umfang, Lieferungen und Notizen für jeden Kunden.',
    },
    {
      cat: 'Arbeit',
      name: 'Meeting-Notizen',
      desc: 'Teilnehmende, Entscheidungen und nächste Schritte.',
    },
    {
      cat: 'Arbeit',
      name: 'Technische Doku',
      desc: 'Kontext, Entscheidungen und Spezifikation.',
    },
    {
      cat: 'Content',
      name: 'Videoskript',
      desc: 'Idee, Struktur, Skript und Checkliste zur Veröffentlichung.',
    },
  ],
};
