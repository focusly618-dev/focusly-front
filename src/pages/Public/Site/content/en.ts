import type { SiteContent } from './types';

export const en: SiteContent = {
  items: {
    tasks: {
      name: 'Tasks',
      desc: 'Inbox, today and upcoming, with priorities and subtasks',
    },
    calendar: {
      name: 'Calendar & Google Calendar',
      short: 'Calendar',
      desc: 'Two-way sync with your schedule',
    },
    planner: {
      name: 'AI planner',
      desc: 'Lumina fits your tasks into your working hours',
    },
    focus: { name: 'Focus mode', desc: 'Deep work sessions and breaks' },
    timeBlocks: {
      name: 'Time blocks',
      desc: 'Lumina proposes them, you confirm them',
    },
    workspaces: {
      name: 'Workspaces & notes',
      desc: 'Markdown with live preview',
    },
    projects: { name: 'Projects', desc: 'Group your documents by project' },
    templates: { name: 'Templates', desc: 'Ready-to-use documents and plans' },
    insights: {
      name: 'Insights & golden window',
      short: 'Insights',
      desc: 'The hours when you focus best',
    },
    lumina: {
      name: 'Lumina AI',
      desc: 'Your AI assistant for planning and focus',
    },
    students: {
      name: 'Students',
      desc: 'Spread the study for each exam into blocks before the date.',
    },
    freelancers: {
      name: 'Freelancers',
      desc: 'Balance several clients and track the time of each project.',
    },
    developers: {
      name: 'Developers',
      desc: 'Protect deep work hours between meetings.',
    },
    creators: {
      name: 'Creators',
      desc: 'Plan scripting, recording and publishing in the same week.',
    },
    pricing: { name: 'Pricing', desc: 'Free, Pro and Business plans' },
    help: { name: 'Help center', desc: 'Step-by-step guides and answers' },
    changelog: {
      name: "What's new",
      desc: 'Changes and improvements in every release',
    },
  },

  pages: {
    tasks: {
      group: 'Product · Plan',
      title: 'All your tasks, in order',
      sub: 'Inbox, today and upcoming, with priorities, tags, subtasks and time tracking in a single list.',
      blocks: [
        [
          'Inbox, Today and Upcoming',
          'Capture everything in the inbox and decide later. Today shows what’s due; Upcoming, what’s next.',
        ],
        [
          'Priorities and tags',
          'Flag what’s urgent and group by context, client or subject.',
        ],
        [
          'Subtasks and time tracking',
          'Break work into steps and track how long each one takes.',
        ],
      ],
    },
    calendar: {
      group: 'Product · Plan',
      title: 'Your calendar and your tasks, together at last',
      sub: 'Two-way sync with Google Calendar: what you change on one side shows up on the other.',
      blocks: [
        [
          'Two-way sync',
          'Your Google Calendar events appear in Focusly, and what you create in Focusly appears in Google Calendar.',
        ],
        [
          'Events and blocks in one view',
          'See your meetings, classes and focus blocks in the same week.',
        ],
        [
          'Nothing without your confirmation',
          'Lumina proposes blocks; they’re only added to your calendar once you confirm them.',
        ],
      ],
    },
    planner: {
      group: 'Product · Plan',
      title: 'Your week planned in minutes',
      sub: 'Lumina fits your tasks into your working hours and proposes a weekly plan.',
      blocks: [
        [
          'Respects your working hours',
          'Blocks are placed within the hours you set as working time.',
        ],
        [
          'Review before you confirm',
          'Adjust or discard any block and confirm the plan with one click.',
        ],
        [
          'Straight to Google Calendar',
          'The confirmed plan shows up in your schedule.',
        ],
      ],
    },
    focus: {
      group: 'Product · Focus',
      title: 'Deep work sessions, with breaks',
      sub: 'A timer to focus on one task and rest between sessions.',
      blocks: [
        ['Session timer', 'Pick a task and work on it without switching tabs.'],
        [
          'Breaks between sessions',
          'Alternate deep work and pauses to keep your pace.',
        ],
        [
          'Your hours count',
          'Every session feeds your Insights: focus hours and golden window.',
        ],
      ],
    },
    timeBlocks: {
      group: 'Product · Focus',
      title: 'Reserve time for what matters',
      sub: 'Focus blocks on your calendar that Lumina proposes and you confirm with one click.',
      blocks: [
        ['Proposed by Lumina', 'Lumina finds gaps in your week for each task.'],
        [
          'Confirmed with one click',
          'Accept all of them, one by one, or none.',
        ],
        [
          'Visible in Google Calendar',
          'Your blocks appear in your schedule so nobody takes that time.',
        ],
      ],
    },
    workspaces: {
      group: 'Product · Organize',
      title: 'Documents next to your work',
      sub: 'Write in Markdown with live preview and keep your notes beside your tasks.',
      blocks: [
        [
          'Markdown with live preview',
          'Format without leaving the keyboard and see the result instantly.',
        ],
        ['Organized into projects', 'Every document lives inside its project.'],
        [
          'Lumina understands them',
          'Mention a document with @ and Lumina answers with its context.',
        ],
      ],
    },
    projects: {
      group: 'Product · Organize',
      title: 'Every project in its place',
      sub: 'Group the documents of the same project inside your workspaces.',
      blocks: [
        ['One space per project', 'Notes, specs and plans together.'],
        [
          'Start from templates',
          'Create the project’s structure from a template.',
        ],
        [
          'Context for Lumina',
          'Lumina can use the project’s documents to answer you.',
        ],
      ],
    },
    insights: {
      group: 'Product · Understand',
      title: 'Find out when you work best',
      sub: 'Focus hours, completed tasks, energy score, golden window, heat map and trends.',
      blocks: [
        [
          'Focus hours and completed tasks',
          'See how much deep work you do and how much you finish each week.',
        ],
        ['Energy score', 'Follow how your energy changes over the week.'],
        [
          'Golden window',
          'The hours when you focus best, to save them for the hard stuff.',
        ],
        ['Heat map and trends', 'Spot patterns by day and hour.'],
      ],
    },
    lumina: {
      group: 'Lumina AI',
      cta2: 'See the planner',
      title: 'Meet Lumina',
      sub: 'Your AI assistant in Focusly: she chats with you, understands your tasks and documents, and organizes your week.',
      blocks: [
        [
          'Creates tasks and full plans',
          'Describe what you need to achieve and Lumina creates the tasks, with subtasks and priorities.',
        ],
        [
          'Plans your week',
          'Proposes focus blocks on your calendar; you confirm them with one click.',
        ],
        [
          'Answers with your documents',
          'Uses the context of your tasks, @ mentions and PDF, DOCX or TXT files.',
        ],
        [
          'Remembers your preferences',
          'Takes into account how you like to work when proposing plans.',
        ],
        [
          'Your information, only for you',
          'Lumina uses your data solely to answer you.',
        ],
      ],
    },
    templates: {
      group: 'Resources',
      title: 'Templates to get started faster',
      sub: 'Documents and plans with a ready-to-use structure for your workspaces.',
    },
    students: {
      group: 'Who it’s for',
      title: 'Focusly for students',
      sub: 'Spread the study for each exam into blocks before the date.',
      blocks: [
        [
          'One plan per exam',
          'Tell Lumina the date and the subject; she spreads the review across your week.',
        ],
        [
          'Notes in Markdown',
          'One workspace per subject, with your notes next to your tasks.',
        ],
        [
          'Study sessions',
          'Use focus mode with breaks to study without distractions.',
        ],
      ],
    },
    freelancers: {
      group: 'Who it’s for',
      title: 'Focusly for freelancers',
      sub: 'Balance several clients and track the time of each project.',
      blocks: [
        [
          'One project per client',
          'Each client’s tasks, notes and deliverables in their own space.',
        ],
        [
          'Time tracking',
          'Know how much you spend on each task and each client.',
        ],
        [
          'A balanced week',
          'Lumina spreads the work across your working hours.',
        ],
      ],
    },
    developers: {
      group: 'Who it’s for',
      title: 'Focusly for developers',
      sub: 'Protect deep work hours between meetings.',
      blocks: [
        [
          'Deep work blocks',
          'Reserve time on your calendar before it fills up with meetings.',
        ],
        ['Docs in Markdown', 'Specs and technical notes with live preview.'],
        [
          'Hard work in your golden window',
          'Schedule complex tasks in the hours when you focus best.',
        ],
      ],
    },
    creators: {
      group: 'Who it’s for',
      title: 'Focusly for creators',
      sub: 'Plan scripting, recording and publishing in the same week.',
      blocks: [
        [
          'From script to publishing',
          'Each piece as a task with subtasks: script, recording, editing and publishing.',
        ],
        [
          'Scripts in workspaces',
          'Write your scripts in Markdown next to your tasks.',
        ],
        ['Your publishing calendar', 'Dates synced with Google Calendar.'],
      ],
    },
    pricing: {
      group: 'Pricing',
      title: 'Plans and pricing',
      sub: 'Start free, no card needed, and upgrade when you need to.',
    },
    help: {
      group: 'Resources',
      title: 'Help center',
      sub: 'Step-by-step guides and answers to get the most out of Focusly.',
    },
    changelog: {
      group: 'Resources',
      title: "What's new",
      sub: 'The changes and improvements in every Focusly release.',
    },
  },

  nav: {
    homeAria: 'Focusly, go to home',
    mainAria: 'Main',
    product: 'Product',
    lumina: 'Lumina AI',
    who: 'Who it’s for',
    pricing: 'Pricing',
    resources: 'Resources',
    login: 'Log in',
    start: 'Start free',
    openApp: 'Open Focusly',
    language: 'Language',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    menu: 'Menu',
    themeAria: 'Theme: {name}. Change theme',
    columns: {
      plan: 'Plan',
      focus: 'Focus',
      organize: 'Organize',
      understand: 'Understand',
    },
    luminaCard: {
      title: 'Lumina AI',
      desc: 'Turns a goal into a plan with blocks on your calendar.',
      cta: 'Meet Lumina',
      prompt: 'Plan my week',
    },
  },

  themes: { light: 'Light', dark: 'Dark', graydark: 'Dim' },

  hero: {
    h1: 'Tell Lumina your goal. She plans your week.',
    sub: 'Tasks, calendar and notes in one place. Lumina turns your goals into focus blocks on your Google Calendar.',
    cta: 'Start free',
    demo: 'Watch demo (60 s)',
    micro: 'No card · Sign in with Google or email',
    prompt: 'Plan my week',
    thinking: 'Lumina is thinking',
    plan: 'Suggested plan · 4 blocks',
    add: 'Add to calendar',
    added: 'Added to calendar',
    placeholder: 'Ask or request a plan…',
    items: ['Final report', 'Exam review', 'Client proposal', 'Weekly review'],
    durations: ['2h', '1.5h', '1h', '30m'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    events: ['Class', 'Meeting', 'Class'],
    alt: 'Focusly: Lumina creates a weekly plan and places focus blocks on the calendar',
  },

  trust: {
    aria: 'Integrations',
    integrates: 'Works with',
    logoTitle: 'Official Google Calendar logo',
    beta: 'In open beta',
  },

  problem: {
    eyebrow: 'The problem',
    title: 'Planning shouldn’t cost you the morning',
    sub: 'If your week lives in Google Calendar and your tasks somewhere else, deciding what to do and when becomes one more task.',
    pains: [
      {
        icon: 'apps',
        title: 'Too many apps',
        desc: 'Tasks in one, calendar in another and notes in a third.',
        fix: 'Tasks, calendar, notes and AI in one place.',
      },
      {
        icon: 'help',
        title: 'I don’t know what to do first',
        desc: 'The list keeps growing and deciding where to start eats your morning.',
        fix: 'Lumina prioritizes and proposes a plan for today and the week.',
      },
      {
        icon: 'event_busy',
        title: 'My calendar doesn’t reflect my tasks',
        desc: 'What you need to do has no time reserved in your week.',
        fix: 'Focus blocks synced with Google Calendar.',
      },
    ],
  },

  pillars: {
    eyebrow: 'Product',
    title: 'Your whole week in one app',
    tabsAria: 'Product pillars',
    tabs: [
      {
        icon: 'calendar_month',
        label: 'Plan',
        title: 'Tasks and calendar that talk to each other',
        bullets: [
          'Inbox, today and upcoming, with priorities, tags, subtasks and time tracking.',
          'Two-way sync with Google Calendar.',
          'Weekly planner: Lumina fits your tasks into your working hours.',
        ],
      },
      {
        icon: 'timer',
        label: 'Focus',
        title: 'Deep work, without distractions',
        bullets: [
          'Deep work session timer.',
          'Breaks between sessions.',
          'Time blocks that Lumina proposes and you confirm with one click.',
        ],
      },
      {
        icon: 'folder_open',
        label: 'Organize',
        title: 'Documents next to your tasks',
        bullets: [
          'Workspaces with Markdown documents and live preview.',
          'Documents organized into projects.',
          'Templates to get started faster.',
        ],
      },
      {
        icon: 'insights',
        label: 'Understand',
        title: 'Data to plan better',
        bullets: [
          'Focus hours and completed tasks.',
          'Energy score and golden window.',
          'Heat map and trends.',
        ],
      },
    ],
  },

  lumina: {
    eyebrow: 'Lumina AI',
    title: 'An assistant who knows your work',
    sub: 'Lumina chats with you, understands your tasks and documents, and proposes focus blocks on your calendar. You confirm them with one click.',
    caps: [
      {
        icon: 'add_task',
        title: 'Creates tasks',
        desc: 'Write what you need and Lumina creates the tasks or a full plan.',
      },
      {
        icon: 'date_range',
        title: 'Plans your week',
        desc: 'Proposes focus blocks on your calendar; you confirm them with one click.',
      },
      {
        icon: 'attach_file',
        title: 'Uses your documents',
        desc: 'Answers with the context of your tasks, @ mentions and PDF, DOCX or TXT files.',
      },
      {
        icon: 'bookmark_heart',
        title: 'Remembers your preferences',
        desc: 'Takes into account how you like to work when proposing plans.',
      },
    ],
    demo: {
      aria: 'Demo: Lumina creates four tasks from one message',
      before:
        'I have to hand in my thesis on Friday and prepare the presentation. Use',
      mention: '@Thesis.docx',
      thinking: 'Lumina is thinking',
      planTitle: 'Suggested plan · 4 tasks',
      tasks: [
        ['Write the conclusions', 'Today · 2h'],
        ['Review the bibliography', 'Tue · 1h'],
        ['Design the slides', 'Wed · 1.5h'],
        ['Rehearse the presentation', 'Thu · 45m'],
      ],
      create: 'Create all',
      created: '4 tasks created',
      input: 'Message Lumina · use @ to mention',
    },
  },

  how: {
    eyebrow: 'How it works',
    title: 'Three steps to a week with direction',
    steps: [
      {
        icon: 'sync',
        title: 'Connect Google Calendar',
        desc: 'Sign in with Google and your events appear in Focusly.',
      },
      {
        icon: 'auto_awesome',
        title: 'Tell Lumina your goals',
        desc: 'She creates the tasks and proposes blocks in your schedule.',
      },
      {
        icon: 'insights',
        title: 'Focus and check your Insights',
        desc: 'Work in focus mode and discover your golden window.',
      },
    ],
  },

  insights: {
    eyebrow: 'Insights',
    title: 'Find out when you work best',
    sub: 'Focus hours, completed tasks, energy score and your golden window: the hours when you focus best.',
    week: 'This week',
    sample: 'Sample data',
    focusHours: 'Focus hours',
    tasksDone: 'Completed tasks',
    energy: 'Energy',
    golden: 'Golden window',
    barsTitle: 'Focus hours per day',
    days: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    heatmapTitle: 'Heat map',
    goldenLegend: 'Golden window · 9:00–11:30',
    hoursUnit: 'h',
  },

  whoSection: {
    eyebrow: 'Who it’s for',
    title: 'For anyone who plans their week in Google Calendar',
  },

  beta: {
    title: 'Join the beta and help us build Focusly',
    sub: 'Try new features before anyone else and tell us what to improve.',
    emailLabel: 'Email',
    placeholder: 'you@email.com',
    submit: 'Join the beta',
  },

  pricing: {
    eyebrow: 'Pricing',
    title: 'Start free. Upgrade when you need to.',
    monthly: 'Monthly',
    annual: 'Yearly',
    annualAria: 'Yearly billing',
    save: 'Save [PENDIENTE]',
    recommended: 'Recommended',
    perMonth: '/month',
    perMonthAnnual: '/month · billed yearly',
    compareAll: 'Compare everything',
    compareTitle: 'Compare plans',
    feature: 'Feature',
    note: 'Prices and limits come from a single configuration shared with the landing page.',
    plans: {
      free: {
        name: 'Free',
        desc: 'For personal use',
        cta: 'Start free',
        feats: ['Workspaces: [LÍMITE]', 'Unlimited tasks', 'Basic calendar'],
      },
      pro: {
        name: 'Pro',
        desc: 'For students and professionals',
        cta: 'Choose Pro',
        feats: [
          'Unlimited workspaces',
          'Lumina: [LÍMITE] uses per month',
          'Advanced analytics',
          'Google Calendar integration',
        ],
      },
      business: {
        name: 'Business',
        desc: 'For maximum productivity',
        cta: 'Choose Business',
        feats: [
          'Unlimited Lumina',
          'Priority AI queue processing',
          'Advanced insights and audits',
          'Export workspaces (Markdown/Word)',
          'Priority support and beta access',
          'SLA and security protocols',
        ],
      },
    },
    table: [
      ['Tasks', 'Unlimited', 'Unlimited', 'Unlimited'],
      ['Workspaces', '[LÍMITE]', 'Unlimited', 'Unlimited'],
      ['Calendar', 'Basic', 'Full', 'Full'],
      ['Google Calendar integration', '[PENDIENTE]', '✓', '✓'],
      ['Lumina AI', '[LÍMITE]', '[LÍMITE] uses/month', 'Unlimited'],
      ['AI queue priority', '—', '—', '✓'],
      [
        'Analytics and Insights',
        '[PENDIENTE]',
        'Advanced',
        'Advanced + audits',
      ],
      ['Export workspaces (Markdown/Word)', '—', '—', '✓'],
      ['Support', '[PENDIENTE]', '[PENDIENTE]', 'Priority + beta access'],
      ['SLA and security protocols', '—', '—', '✓'],
    ],
  },

  security: {
    eyebrow: 'Security and privacy',
    title: 'Your data is yours',
    terms: 'Terms',
    privacy: 'Privacy',
    items: [
      {
        icon: 'lock',
        title: 'HTTPS everywhere',
        desc: 'Your information travels encrypted.',
      },
      {
        icon: 'block',
        title: 'We don’t sell your data',
        desc: 'Not to advertisers, not to third parties.',
      },
      {
        icon: 'shield_person',
        title: 'The AI only works for you',
        desc: 'Lumina uses your information solely to answer you.',
      },
      {
        icon: 'delete',
        title: 'Delete your account anytime',
        desc: 'Remove your account and your data from Settings.',
      },
    ],
  },

  faq: {
    title: 'Frequently asked questions',
    items: [
      [
        'How much does Focusly cost?',
        'You can start free, no card needed. Pro costs [PRECIO] and Business [PRECIO] per month.',
      ],
      [
        'Can I cancel anytime?',
        'Yes, from Settings. [PENDIENTE: condiciones de reembolso y fin de periodo]',
      ],
      [
        'What does Lumina see of my information?',
        'Only what she needs to answer you: your tasks, the documents you mention with @ and the files you attach. She doesn’t use them for anything else.',
      ],
      [
        'How does Google Calendar sync work?',
        'It’s two-way: what you create in Focusly appears in Google Calendar and vice versa. The blocks Lumina proposes are only added once you confirm them.',
      ],
      [
        'Can I export my data?',
        'Your workspace documents can be exported to Markdown and Word. [PENDIENTE: exportación de tareas y disponibilidad por plan]',
      ],
      ['Which languages is it available in?', 'Spanish, English and Japanese.'],
      [
        'Does it work on mobile?',
        'Focusly is a web app and works in your phone’s browser. [PENDIENTE: app nativa]',
      ],
      [
        'Is my data safe?',
        'We use HTTPS, we don’t sell your data and you can delete your account anytime. More details in the privacy notice.',
      ],
      [
        'Do I need a password?',
        'No. You sign in with a magic link we email you or with your Google account.',
      ],
    ],
  },

  finalCta: {
    title: 'Your next week, already organized',
    sub: 'Connect your calendar and tell Lumina what you need to achieve.',
    cta: 'Start free',
    micro: 'No card · Sign in with Google or email',
  },

  footer: {
    tagline: 'Tasks, calendar, notes and AI in one place.',
    product: 'Product',
    resources: 'Resources',
    legal: 'Legal',
    terms: 'Terms',
    privacy: 'Privacy',
    language: 'Language',
    theme: 'Theme',
  },

  demoModal: { aria: 'Focusly demo, 60 seconds', close: 'Close video' },

  page: {
    breadcrumbAria: 'Breadcrumb',
    home: 'Home',
    seePricing: 'See pricing',
    explore: 'Keep exploring',
    finalTitle: 'Your next week, already organized',
    useTemplate: 'Use template',
    preview: 'preview',
    filterTemplates: 'Filter templates',
    helpSearchLabel: 'Search the help center',
    helpPlaceholder: 'Search for a guide or a question',
    helpEmpty: 'No results for “{q}”.',
    helpContactTitle: 'Can’t find what you’re looking for?',
    helpContactDesc: 'Write to us and we’ll get back to you.',
    helpContact: 'Contact us',
  },

  help: [
    {
      icon: 'rocket_launch',
      title: 'Getting started',
      desc: 'Create your account with a magic link or Google and set your schedule.',
    },
    {
      icon: 'checklist',
      title: 'Tasks',
      desc: 'Inbox, today, upcoming, priorities, tags and subtasks.',
    },
    {
      icon: 'calendar_month',
      title: 'Calendar & Google Calendar',
      desc: 'Connect your account and understand the sync.',
    },
    {
      icon: 'auto_awesome',
      title: 'Lumina AI',
      desc: '@ mentions, attachments and weekly plans.',
    },
    {
      icon: 'description',
      title: 'Workspaces',
      desc: 'Markdown documents, projects and templates.',
    },
    {
      icon: 'manage_accounts',
      title: 'Account & billing',
      desc: 'Plans, language, theme and account deletion.',
    },
  ],

  changelog: [
    {
      version: 'Workspaces 2.0',
      date: '[PENDIENTE: fecha]',
      tag: 'New',
      title: 'Workspaces 2.0 is here',
      desc: '[PENDIENTE: resumen real de los cambios]',
    },
    {
      version: '[PENDIENTE]',
      date: '[PENDIENTE: fecha]',
      tag: 'Improvement',
      title: '[PENDIENTE: título]',
      desc: '[PENDIENTE: descripción]',
    },
    {
      version: '[PENDIENTE]',
      date: '[PENDIENTE: fecha]',
      tag: 'Fix',
      title: '[PENDIENTE: título]',
      desc: '[PENDIENTE: descripción]',
    },
  ],

  templateCategories: ['All', 'Planning', 'Study', 'Work', 'Content'],
  templates: [
    {
      cat: 'Planning',
      name: 'Weekly planning',
      desc: 'Goals, priorities and the week’s review.',
    },
    {
      cat: 'Study',
      name: 'Study plan',
      desc: 'Topics, exam dates and review sessions.',
    },
    {
      cat: 'Work',
      name: 'Client tracker',
      desc: 'Scope, deliverables and notes for each client.',
    },
    {
      cat: 'Work',
      name: 'Meeting notes',
      desc: 'Attendees, decisions and next steps.',
    },
    {
      cat: 'Work',
      name: 'Technical docs',
      desc: 'Context, decisions and specification.',
    },
    {
      cat: 'Content',
      name: 'Video script',
      desc: 'Idea, structure, script and publishing checklist.',
    },
  ],
};
