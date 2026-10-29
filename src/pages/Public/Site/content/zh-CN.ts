import type { SiteContent } from './types';

export const zhCN: SiteContent = {
  items: {
    tasks: {
      name: '任务',
      desc: '收件箱、今天和即将到来，支持优先级和子任务',
    },
    calendar: {
      name: '日历和 Google 日历',
      short: '日历',
      desc: '与你的日程双向同步',
    },
    planner: {
      name: 'AI 规划器',
      desc: 'Lumina 把任务安排进你的工作时间',
    },
    focus: { name: '专注模式', desc: '深度工作时段与休息' },
    timeBlocks: {
      name: '时间块',
      desc: 'Lumina 提议，你来确认',
    },
    workspaces: {
      name: '工作区和笔记',
      desc: '支持实时预览的 Markdown',
    },
    projects: { name: '项目', desc: '按项目整理你的文档' },
    templates: { name: '模板', desc: '开箱即用的文档和计划' },
    insights: {
      name: '洞察和黄金时段',
      short: '洞察',
      desc: '你最专注的时间段',
    },
    lumina: {
      name: 'Lumina AI',
      desc: '帮你规划和专注的 AI 助手',
    },
    students: {
      name: '学生',
      desc: '把每场考试的复习分成时间块，在考试前完成。',
    },
    freelancers: {
      name: '自由职业者',
      desc: '兼顾多个客户，记录每个项目的时间。',
    },
    developers: {
      name: '开发者',
      desc: '在会议之间守住深度工作时间。',
    },
    creators: {
      name: '创作者',
      desc: '在同一周内规划脚本、录制和发布。',
    },
    pricing: { name: '价格', desc: 'Free、Pro 和 Business 套餐' },
    help: { name: '帮助中心', desc: '分步指南和解答' },
    changelog: {
      name: '新功能',
      desc: '每个版本的变化与改进',
    },
  },

  pages: {
    tasks: {
      group: '产品 · 规划',
      title: '你的所有任务，井然有序',
      sub: '收件箱、今天和即将到来，优先级、标签、子任务和时间记录都在一个列表里。',
      blocks: [
        [
          '收件箱、今天和即将到来',
          '先把一切记进收件箱，之后再决定。“今天”显示到期的事，“即将到来”显示接下来的事。',
        ],
        ['优先级和标签', '标记紧急事项，并按情境、客户或主题分组。'],
        ['子任务和时间记录', '把工作拆成步骤，记录每一步花了多长时间。'],
      ],
    },
    calendar: {
      group: '产品 · 规划',
      title: '日历和任务，终于在一起',
      sub: '与 Google 日历双向同步：一边的修改会同步到另一边。',
      blocks: [
        [
          '双向同步',
          '你的 Google 日历活动会出现在 Focusly 中，在 Focusly 创建的内容也会出现在 Google 日历中。',
        ],
        ['活动和时间块同屏显示', '在同一周里看到会议、课程和专注块。'],
        ['未经确认，绝不擅动', 'Lumina 提议时间块，只有你确认后才会加入日历。'],
      ],
    },
    planner: {
      group: '产品 · 规划',
      title: '几分钟规划好一周',
      sub: 'Lumina 把任务安排进你的工作时间，并提出一份周计划。',
      blocks: [
        ['尊重你的工作时间', '时间块只会安排在你设定的工作时间内。'],
        ['确认前先审阅', '调整或舍弃任何时间块，一键确认计划。'],
        ['直接写入 Google 日历', '确认后的计划会出现在你的日程中。'],
      ],
    },
    focus: {
      group: '产品 · 专注',
      title: '有休息的深度工作时段',
      sub: '一个计时器，帮你专注于一项任务，并在时段之间休息。',
      blocks: [
        ['时段计时器', '选一项任务，不切换标签页地专心完成。'],
        ['时段之间的休息', '深度工作与休息交替，保持节奏。'],
        ['你的时间都算数', '每个时段都会计入你的洞察：专注时长和黄金时段。'],
      ],
    },
    timeBlocks: {
      group: '产品 · 专注',
      title: '为重要的事预留时间',
      sub: '日历中的专注块由 Lumina 提议，你一键确认。',
      blocks: [
        ['由 Lumina 提议', 'Lumina 为每项任务找出本周的空档。'],
        ['一键确认', '全部接受、逐个接受或都不接受。'],
        ['在 Google 日历中可见', '时间块显示在日程里，没人能占用这段时间。'],
      ],
    },
    workspaces: {
      group: '产品 · 整理',
      title: '文档就在工作旁边',
      sub: '用支持实时预览的 Markdown 书写，让笔记紧挨着任务。',
      blocks: [
        ['实时预览的 Markdown', '手不离键盘就能排版，结果即时可见。'],
        ['按项目整理', '每份文档都归属于它的项目。'],
        ['Lumina 读得懂', '用 @ 提及文档，Lumina 会结合其内容回答。'],
      ],
    },
    projects: {
      group: '产品 · 整理',
      title: '每个项目各就其位',
      sub: '在工作区中把同一项目的文档放在一起。',
      blocks: [
        ['一个项目一个空间', '笔记、规格和计划集中一处。'],
        ['从模板开始', '用模板创建项目结构。'],
        ['为 Lumina 提供上下文', 'Lumina 可以参考项目文档来回答你。'],
      ],
    },
    insights: {
      group: '产品 · 洞察',
      title: '发现你何时工作效率最高',
      sub: '专注时长、已完成任务、精力评分、黄金时段、热力图和趋势。',
      blocks: [
        [
          '专注时长和已完成任务',
          '看看你每周做了多少深度工作、完成了多少任务。',
        ],
        ['精力评分', '追踪你一周中精力的变化。'],
        ['黄金时段', '你最专注的时间段，留给最难的工作。'],
        ['热力图和趋势', '按日期和时段发现规律。'],
      ],
    },
    lumina: {
      group: 'Lumina AI',
      cta2: '查看规划器',
      title: '认识 Lumina',
      sub: '你在 Focusly 中的 AI 助手：与你对话，理解你的任务和文档，帮你安排一周。',
      blocks: [
        [
          '创建任务和完整计划',
          '描述你想达成的目标，Lumina 会创建任务，并附上子任务和优先级。',
        ],
        ['规划你的一周', '在日历中提议专注块，你一键确认。'],
        [
          '结合你的文档回答',
          '利用任务上下文、@ 提及以及 PDF、DOCX 或 TXT 文件。',
        ],
        ['记住你的偏好', '提出计划时会考虑你喜欢的工作方式。'],
        ['你的信息，只为你所用', 'Lumina 只在回答你时使用你的数据。'],
      ],
    },
    templates: {
      group: '资源',
      title: '更快上手的模板',
      sub: '为你的工作区准备好结构的文档和计划。',
    },
    students: {
      group: '适用人群',
      title: '面向学生的 Focusly',
      sub: '把每场考试的复习分成时间块，在考试前完成。',
      blocks: [
        [
          '每场考试一个计划',
          '告诉 Lumina 考试日期和科目，她会把复习分布到你的一周中。',
        ],
        [
          '从课程大纲到任务',
          '以 PDF 附上课程大纲，Lumina 会把它变成包含笔记和复习任务的项目。',
        ],
        ['学习时段', '使用带休息的专注模式，无干扰地学习。'],
      ],
    },
    freelancers: {
      group: '适用人群',
      title: '面向自由职业者的 Focusly',
      sub: '兼顾多个客户，记录每个项目的时间。',
      blocks: [
        ['一个客户一个项目', '每位客户的任务、笔记和交付物都有独立空间。'],
        ['时间记录', '清楚每项任务、每位客户花了你多少时间。'],
        ['客户通话', '直接从任务创建会议，附带 Google Meet 链接并邀请客户。'],
      ],
    },
    developers: {
      group: '适用人群',
      title: '面向开发者的 Focusly',
      sub: '在会议之间守住深度工作时间。',
      blocks: [
        ['深度工作块', '在日历被会议填满之前预留时间。'],
        ['看板上的冲刺', '从列表切换到看板，把每项任务从待办拖到已完成。'],
        ['难活儿放在黄金时段', '把复杂任务安排在你最专注的时间。'],
      ],
    },
    creators: {
      group: '适用人群',
      title: '面向创作者的 Focusly',
      sub: '在同一周内规划脚本、录制和发布。',
      blocks: [
        [
          '从脚本到发布',
          '每个作品都是带子任务的任务：脚本、录制、剪辑和发布。',
        ],
        [
          'Lumina 与你一起写',
          '不离开编辑器，就能让她起草、总结或改写你的脚本。',
        ],
        ['你的发布日历', '日期与 Google 日历同步。'],
      ],
    },
    pricing: {
      group: '价格',
      title: '套餐与价格',
      sub: '免费开始，无需银行卡，需要时再升级。',
    },
    help: {
      group: '资源',
      title: '帮助中心',
      sub: '分步指南和解答，帮你充分利用 Focusly。',
    },
    changelog: {
      group: '资源',
      title: '新功能',
      sub: 'Focusly 每个版本的变化与改进。',
    },
  },

  nav: {
    homeAria: 'Focusly，返回首页',
    mainAria: '主导航',
    product: '产品',
    lumina: 'Lumina AI',
    who: '适用人群',
    pricing: '价格',
    resources: '资源',
    login: '登录',
    start: '免费开始',
    openApp: '打开 Focusly',
    language: '语言',
    openMenu: '打开菜单',
    closeMenu: '关闭菜单',
    menu: '菜单',
    themeAria: '主题：{name}。切换主题',
    columns: {
      plan: '规划',
      focus: '专注',
      organize: '整理',
      understand: '洞察',
    },
    luminaCard: {
      title: 'Lumina AI',
      desc: '把一个目标变成日历上的时间块计划。',
      cta: '认识 Lumina',
      prompt: '帮我规划这一周',
    },
  },

  themes: { light: '浅色', dark: '深色', graydark: '暗淡' },

  hero: {
    h1: '告诉 Lumina 你的目标，她来规划你的一周。',
    sub: '任务、日历和笔记集中一处。Lumina 把你的目标变成 Google 日历上的专注块。',
    cta: '免费开始',
    demo: '观看演示（60 秒）',
    micro: '无需银行卡 · 用 Google 或邮箱登录',
    prompt: '帮我规划这一周',
    thinking: 'Lumina 正在思考',
    plan: '建议计划 · 4 个时间块',
    add: '添加到日历',
    added: '已添加到日历',
    placeholder: '提问或请求一个计划…',
    items: ['期末报告', '考试复习', '客户提案', '每周回顾'],
    durations: ['2 小时', '1.5 小时', '1 小时', '30 分钟'],
    days: ['周一', '周二', '周三', '周四', '周五'],
    events: ['课程', '会议', '课程'],
    alt: 'Focusly：Lumina 生成周计划，并在日历中安排专注块',
  },

  trust: {
    aria: '集成',
    integrates: '兼容',
    logoTitle: 'Google 日历官方标志',
    beta: '公开测试中',
  },

  problem: {
    eyebrow: '问题',
    title: '做计划不该耗掉你一上午',
    sub: '如果你的一周在 Google 日历里，任务却在别处，决定什么时候做什么就成了又一项任务。',
    pains: [
      {
        icon: 'apps',
        title: '应用太多',
        desc: '任务在一个应用，日历在另一个，笔记又在第三个。',
        fix: '任务、日历、笔记和 AI 集中一处。',
      },
      {
        icon: 'help',
        title: '不知道先做什么',
        desc: '清单越来越长，决定从哪儿开始就吃掉了整个上午。',
        fix: 'Lumina 排好优先级，并提出今天和本周的计划。',
      },
      {
        icon: 'event_busy',
        title: '日历反映不出我的任务',
        desc: '要做的事在你的一周里没有预留时间。',
        fix: '与 Google 日历同步的专注块。',
      },
    ],
  },

  pillars: {
    eyebrow: '产品',
    title: '一个应用装下你的整周',
    tabsAria: '产品支柱',
    tabs: [
      {
        icon: 'calendar_month',
        label: '规划',
        title: '互相连通的任务和日历',
        bullets: [
          '收件箱、今天和即将到来，支持优先级、标签、子任务和时间记录。',
          '与 Google 日历双向同步。',
          '周规划器：Lumina 把任务安排进你的工作时间。',
        ],
        mediaAlt:
          'Focusly：Lumina 把收件箱中的任务安排进你的工作周，并与 Google 日历同步',
      },
      {
        icon: 'timer',
        label: '专注',
        title: '没有干扰的深度工作',
        bullets: [
          '深度工作时段计时器。',
          '时段之间的休息。',
          'Lumina 提议、你一键确认的时间块。',
        ],
      },
      {
        icon: 'folder_open',
        label: '整理',
        title: '文档紧挨着任务',
        bullets: [
          '包含 Markdown 文档和实时预览的工作区。',
          '按项目整理的文档。',
          '更快上手的模板。',
        ],
      },
      {
        icon: 'insights',
        label: '洞察',
        title: '用数据更好地规划',
        bullets: [
          '专注时长和已完成任务。',
          '精力评分和黄金时段。',
          '热力图和趋势。',
        ],
      },
    ],
  },

  lumina: {
    eyebrow: 'Lumina AI',
    title: '一位了解你工作的助手',
    sub: 'Lumina 与你对话，理解你的任务和文档，并在日历中提议专注块。你一键确认即可。',
    caps: [
      {
        icon: 'add_task',
        title: '创建任务',
        desc: '写下你的需求，Lumina 会创建任务或完整计划。',
      },
      {
        icon: 'date_range',
        title: '规划你的一周',
        desc: '在日历中提议专注块，你一键确认。',
      },
      {
        icon: 'attach_file',
        title: '使用你的文档',
        desc: '结合任务上下文、@ 提及以及 PDF、DOCX 或 TXT 文件来回答。',
      },
      {
        icon: 'bookmark_heart',
        title: '记住你的偏好',
        desc: '提出计划时会考虑你喜欢的工作方式。',
      },
    ],
    demo: {
      aria: '演示：Lumina 根据一条消息创建四个任务',
      before: '我周五要交论文，还要准备答辩。参考',
      mention: '@论文.docx',
      thinking: 'Lumina 正在思考',
      planTitle: '建议计划 · 4 个任务',
      tasks: [
        ['撰写结论', '今天 · 2 小时'],
        ['核对参考文献', '周二 · 1 小时'],
        ['设计幻灯片', '周三 · 1.5 小时'],
        ['排练答辩', '周四 · 45 分钟'],
      ],
      create: '全部创建',
      created: '已创建 4 个任务',
      input: '给 Lumina 发消息 · 用 @ 提及',
    },
  },

  how: {
    eyebrow: '使用方式',
    title: '三步拥有方向明确的一周',
    steps: [
      {
        icon: 'sync',
        title: '连接 Google 日历',
        desc: '用 Google 登录，你的活动就会出现在 Focusly 中。',
      },
      {
        icon: 'auto_awesome',
        title: '告诉 Lumina 你的目标',
        desc: '她会创建任务，并在日程中提议时间块。',
      },
      {
        icon: 'insights',
        title: '专注并查看洞察',
        desc: '在专注模式下工作，发现你的黄金时段。',
      },
    ],
  },

  insights: {
    eyebrow: '洞察',
    title: '发现你何时工作效率最高',
    sub: '专注时长、已完成任务、精力评分，以及你的黄金时段：你最专注的时间。',
    week: '本周',
    sample: '示例数据',
    focusHours: '专注时长',
    tasksDone: '已完成任务',
    energy: '精力',
    golden: '黄金时段',
    barsTitle: '每日专注时长',
    days: ['一', '二', '三', '四', '五', '六', '日'],
    heatmapTitle: '热力图',
    goldenLegend: '黄金时段 · 9:00–11:30',
    hoursUnit: '小时',
  },

  whoSection: {
    eyebrow: '适用人群',
    title: '适合所有用 Google 日历规划一周的人',
  },

  beta: {
    title: '加入测试，和我们一起打造 Focusly',
    sub: '抢先体验新功能，告诉我们哪里需要改进。',
    emailLabel: '邮箱',
    placeholder: 'you@email.com',
    submit: '加入测试',
  },

  pricing: {
    eyebrow: '价格',
    title: '免费开始，需要时再升级。',
    monthly: '按月',
    annual: '按年',
    annualAria: '按年计费',
    save: '节省 [PENDIENTE]',
    recommended: '推荐',
    perMonth: '/月',
    perMonthAnnual: '/月 · 按年计费',
    managePlan: '管理我的套餐',
    compareAll: '全部对比',
    compareTitle: '套餐对比',
    feature: '功能',
    note: '价格和限额来自与落地页共享的同一份配置。',
    plans: {
      free: {
        name: 'Free',
        desc: '适合个人使用',
        cta: '免费开始',
        feats: ['工作区：[LÍMITE]', '不限任务数', '基础日历'],
      },
      pro: {
        name: 'Pro',
        desc: '适合学生和专业人士',
        cta: '选择 Pro',
        feats: [
          '不限工作区数',
          'Lumina：每月 [LÍMITE] 次',
          '高级分析',
          'Google 日历集成',
        ],
      },
      business: {
        name: 'Business',
        desc: '追求极致效率',
        cta: '选择 Business',
        feats: [
          '无限使用 Lumina',
          'AI 队列优先处理',
          '高级洞察和审计',
          '导出工作区（Markdown/Word）',
          '优先支持和测试资格',
          'SLA 和安全协议',
        ],
      },
    },
    table: [
      ['任务', '不限', '不限', '不限'],
      ['工作区', '[LÍMITE]', '不限', '不限'],
      ['日历', '基础', '完整', '完整'],
      ['Google 日历集成', '[PENDIENTE]', '✓', '✓'],
      ['Lumina AI', '[LÍMITE]', '每月 [LÍMITE] 次', '不限'],
      ['AI 队列优先级', '—', '—', '✓'],
      ['分析和洞察', '[PENDIENTE]', '高级', '高级 + 审计'],
      ['导出工作区（Markdown/Word）', '—', '—', '✓'],
      ['支持', '[PENDIENTE]', '[PENDIENTE]', '优先 + 测试资格'],
      ['SLA 和安全协议', '—', '—', '✓'],
    ],
  },

  security: {
    eyebrow: '安全与隐私',
    title: '你的数据属于你',
    terms: '条款',
    privacy: '隐私',
    items: [
      {
        icon: 'lock',
        title: '全程 HTTPS',
        desc: '你的信息加密传输。',
      },
      {
        icon: 'block',
        title: '我们不出售你的数据',
        desc: '不卖给广告商，也不卖给第三方。',
      },
      {
        icon: 'shield_person',
        title: 'AI 只为你工作',
        desc: 'Lumina 只在回答你时使用你的信息。',
      },
      {
        icon: 'delete',
        title: '随时删除账号',
        desc: '在设置中删除你的账号和数据。',
      },
    ],
  },

  faq: {
    title: '常见问题',
    items: [
      [
        'Focusly 多少钱？',
        '你可以免费开始，无需银行卡。Pro 每月 [PRECIO]，Business 每月 [PRECIO]。',
      ],
      [
        '可以随时取消吗？',
        '可以，在设置中操作。[PENDIENTE: condiciones de reembolso y fin de periodo]',
      ],
      [
        'Lumina 能看到我的哪些信息？',
        '只看回答你所需的内容：你的任务、你用 @ 提及的文档以及你附上的文件。她不会把它们用于其他任何用途。',
      ],
      [
        'Google 日历同步如何运作？',
        '它是双向的：在 Focusly 创建的内容会出现在 Google 日历中，反之亦然。Lumina 提议的时间块只有在你确认后才会添加。',
      ],
      [
        '可以导出我的数据吗？',
        '工作区中的文档可以导出为 Markdown 和 Word。[PENDIENTE: exportación de tareas y disponibilidad por plan]',
      ],
      [
        '支持哪些语言？',
        '西班牙语、英语（美国和英国）、葡萄牙语（巴西）、法语、德语、意大利语、日语、韩语和简体中文。',
      ],
      [
        '手机上能用吗？',
        'Focusly 是网页应用，可以在手机浏览器中使用。[PENDIENTE: app nativa]',
      ],
      [
        '我的数据安全吗？',
        '我们使用 HTTPS，不出售你的数据，你也可以随时删除账号。更多详情请见隐私声明。',
      ],
      [
        '需要密码吗？',
        '不需要。你可以用我们发到邮箱的魔法链接登录，或使用 Google 账号登录。',
      ],
    ],
  },

  finalCta: {
    title: '你的下一周，已经安排好了',
    sub: '连接你的日历，告诉 Lumina 你想达成什么。',
    cta: '免费开始',
    micro: '无需银行卡 · 用 Google 或邮箱登录',
  },

  footer: {
    tagline: '任务、日历、笔记和 AI 集中一处。',
    product: '产品',
    resources: '资源',
    legal: '法律信息',
    terms: '条款',
    privacy: '隐私',
    language: '语言',
    theme: '主题',
  },

  demoModal: { aria: 'Focusly 演示，60 秒', close: '关闭视频' },

  page: {
    breadcrumbAria: '面包屑导航',
    home: '首页',
    seePricing: '查看价格',
    explore: '继续探索',
    finalTitle: '你的下一周，已经安排好了',
    useTemplate: '使用模板',
    preview: '预览',
    filterTemplates: '筛选模板',
    helpSearchLabel: '搜索帮助中心',
    helpPlaceholder: '搜索指南或问题',
    helpEmpty: '没有找到与“{q}”相关的结果。',
    helpContactTitle: '没找到你要的内容？',
    helpContactDesc: '给我们留言，我们会尽快回复。',
    helpContact: '联系我们',
  },

  help: [
    {
      icon: 'rocket_launch',
      title: '快速入门',
      desc: '用魔法链接或 Google 创建账号，并设置你的工作时间。',
    },
    {
      icon: 'checklist',
      title: '任务',
      desc: '收件箱、今天、即将到来、优先级、标签和子任务。',
    },
    {
      icon: 'calendar_month',
      title: '日历和 Google 日历',
      desc: '连接你的账号并了解同步方式。',
    },
    {
      icon: 'auto_awesome',
      title: 'Lumina AI',
      desc: '@ 提及、附件和周计划。',
    },
    {
      icon: 'description',
      title: '工作区',
      desc: 'Markdown 文档、项目和模板。',
    },
    {
      icon: 'manage_accounts',
      title: '账号与账单',
      desc: '套餐、语言、主题和账号删除。',
    },
  ],

  changelog: [
    {
      version: 'Workspaces 2.0',
      date: '[PENDIENTE: fecha]',
      tag: '新功能',
      title: 'Workspaces 2.0 正式上线',
      desc: '[PENDIENTE: resumen real de los cambios]',
    },
    {
      version: '[PENDIENTE]',
      date: '[PENDIENTE: fecha]',
      tag: '改进',
      title: '[PENDIENTE: título]',
      desc: '[PENDIENTE: descripción]',
    },
    {
      version: '[PENDIENTE]',
      date: '[PENDIENTE: fecha]',
      tag: '修复',
      title: '[PENDIENTE: título]',
      desc: '[PENDIENTE: descripción]',
    },
  ],

  templateCategories: ['全部', '规划', '学习', '工作', '内容'],
  templates: [
    {
      cat: '规划',
      name: '每周规划',
      desc: '目标、优先级和本周回顾。',
    },
    {
      cat: '学习',
      name: '学习计划',
      desc: '主题、考试日期和复习时段。',
    },
    {
      cat: '工作',
      name: '客户跟进表',
      desc: '每位客户的范围、交付物和笔记。',
    },
    {
      cat: '工作',
      name: '会议记录',
      desc: '参会人、决定和后续步骤。',
    },
    {
      cat: '工作',
      name: '技术文档',
      desc: '背景、决策和规格说明。',
    },
    {
      cat: '内容',
      name: '视频脚本',
      desc: '创意、结构、脚本和发布检查清单。',
    },
  ],
};
