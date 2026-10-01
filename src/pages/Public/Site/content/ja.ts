import type { SiteContent } from './types';

export const ja: SiteContent = {
  items: {
    tasks: {
      name: 'タスク',
      desc: '受信箱・今日・予定を、優先度とサブタスク付きで',
    },
    calendar: {
      name: 'カレンダーとGoogleカレンダー',
      short: 'カレンダー',
      desc: 'スケジュールと双方向に同期',
    },
    planner: {
      name: 'AIプランナー',
      desc: 'Luminaがタスクを勤務時間に割り振ります',
    },
    focus: { name: '集中モード', desc: 'ディープワークのセッションと休憩' },
    timeBlocks: {
      name: 'タイムブロック',
      desc: 'Luminaが提案し、あなたが確定',
    },
    workspaces: {
      name: 'ワークスペースとノート',
      desc: 'ライブプレビュー付きのMarkdown',
    },
    projects: {
      name: 'プロジェクト',
      desc: 'ドキュメントをプロジェクトごとに整理',
    },
    templates: { name: 'テンプレート', desc: 'すぐに使えるドキュメントと計画' },
    insights: {
      name: 'インサイトとゴールデンタイム',
      short: 'インサイト',
      desc: '最も集中できる時間帯',
    },
    lumina: { name: 'Lumina AI', desc: '計画と集中を支えるAIアシスタント' },
    students: {
      name: '学生',
      desc: '試験ごとの勉強を、試験日までのブロックに分けて計画。',
    },
    freelancers: {
      name: 'フリーランス',
      desc: '複数のクライアントを両立し、プロジェクトごとの時間を記録。',
    },
    developers: {
      name: '開発者',
      desc: '会議の合間にディープワークの時間を確保。',
    },
    creators: {
      name: 'クリエイター',
      desc: '台本、撮影、公開を同じ週の中で計画。',
    },
    pricing: { name: '料金', desc: '無料・Pro・ビジネスプラン' },
    help: { name: 'ヘルプセンター', desc: 'ステップごとのガイドと回答' },
    changelog: { name: '新機能', desc: '各バージョンの変更点と改善' },
  },

  pages: {
    tasks: {
      group: '製品 · 計画する',
      title: 'すべてのタスクを、きちんと整理',
      sub: '受信箱・今日・予定を、優先度、タグ、サブタスク、作業時間の記録とともにひとつのリストで。',
      blocks: [
        [
          '受信箱・今日・予定',
          'まずは受信箱にすべて入れて、後で判断。「今日」はやるべきことを、「予定」はこれからのことを表示します。',
        ],
        [
          '優先度とタグ',
          '急ぎのものに印をつけ、状況・クライアント・科目ごとにまとめられます。',
        ],
        [
          'サブタスクと作業時間の記録',
          '作業をステップに分け、それぞれにかかった時間を記録します。',
        ],
      ],
    },
    calendar: {
      group: '製品 · 計画する',
      title: 'カレンダーとタスクが、ついにひとつに',
      sub: 'Googleカレンダーと双方向に同期。片方で変えた内容がもう片方にも反映されます。',
      blocks: [
        [
          '双方向の同期',
          'Googleカレンダーの予定がFocuslyに表示され、Focuslyで作成したものはGoogleカレンダーに表示されます。',
        ],
        [
          '予定とブロックをひとつの画面で',
          '会議、授業、集中ブロックを同じ週の中で確認できます。',
        ],
        [
          '確認なしには何も追加しません',
          'Luminaはブロックを提案するだけ。あなたが確定したときにだけカレンダーに追加されます。',
        ],
      ],
    },
    planner: {
      group: '製品 · 計画する',
      title: '1週間の計画が数分で完成',
      sub: 'Luminaがタスクを勤務時間に割り振り、週間プランを提案します。',
      blocks: [
        [
          '勤務時間を尊重',
          'ブロックは、あなたが設定した勤務時間の中に配置されます。',
        ],
        [
          '確定前に見直し',
          'どのブロックも調整・削除でき、ワンクリックで計画を確定できます。',
        ],
        [
          'そのままGoogleカレンダーへ',
          '確定した計画がスケジュールに表示されます。',
        ],
      ],
    },
    focus: {
      group: '製品 · 集中する',
      title: '休憩を挟んだディープワークのセッション',
      sub: 'ひとつのタスクに集中し、セッションの合間に休むためのタイマー。',
      blocks: [
        [
          'セッションタイマー',
          'タスクを選び、タブを切り替えずに取り組めます。',
        ],
        [
          'セッション間の休憩',
          'ディープワークと休憩を交互に取り、ペースを保ちます。',
        ],
        [
          '集中した時間が記録に',
          '各セッションがインサイト（集中時間とゴールデンタイム）に反映されます。',
        ],
      ],
    },
    timeBlocks: {
      group: '製品 · 集中する',
      title: '大切なことのために時間を確保',
      sub: 'Luminaが提案し、あなたがワンクリックで確定する、カレンダー上の集中ブロック。',
      blocks: [
        ['Luminaが提案', 'Luminaが各タスクのために週の空き時間を探します。'],
        [
          'ワンクリックで確定',
          'すべて、ひとつずつ、または何も受け入れない、を選べます。',
        ],
        [
          'Googleカレンダーに表示',
          'ブロックがスケジュールに表示されるので、その時間が他の予定で埋まりません。',
        ],
      ],
    },
    workspaces: {
      group: '製品 · 整理する',
      title: '作業のすぐそばにドキュメントを',
      sub: 'ライブプレビュー付きのMarkdownで書き、ノートをタスクの隣に置けます。',
      blocks: [
        [
          'ライブプレビュー付きMarkdown',
          'キーボードから手を離さずに書式を整え、結果をすぐに確認できます。',
        ],
        [
          'プロジェクトごとに整理',
          'すべてのドキュメントはそれぞれのプロジェクトの中にあります。',
        ],
        [
          'Luminaが内容を理解',
          '@でドキュメントをメンションすると、Luminaがその内容を踏まえて回答します。',
        ],
      ],
    },
    projects: {
      group: '製品 · 整理する',
      title: 'すべてのプロジェクトを、あるべき場所に',
      sub: '同じプロジェクトのドキュメントをワークスペースの中にまとめます。',
      blocks: [
        ['プロジェクトごとのスペース', 'ノート、仕様、計画をひとまとめに。'],
        [
          'テンプレートから開始',
          'テンプレートからプロジェクトの構成を作成できます。',
        ],
        [
          'Luminaのためのコンテキスト',
          'Luminaはプロジェクトのドキュメントを使って回答できます。',
        ],
      ],
    },
    insights: {
      group: '製品 · 理解する',
      title: '自分が最も集中できる時間を知る',
      sub: '集中時間、完了したタスク、エネルギースコア、ゴールデンタイム、ヒートマップ、傾向。',
      blocks: [
        [
          '集中時間と完了したタスク',
          '毎週どれだけディープワークをし、どれだけ終えたかを確認できます。',
        ],
        ['エネルギースコア', '1週間を通じたエネルギーの変化を追えます。'],
        [
          'ゴールデンタイム',
          '最も集中できる時間帯を、難しい仕事のために確保しましょう。',
        ],
        ['ヒートマップと傾向', '曜日や時間ごとのパターンを見つけられます。'],
      ],
    },
    lumina: {
      group: 'Lumina AI',
      cta2: 'プランナーを見る',
      title: 'Luminaのご紹介',
      sub: 'FocuslyのAIアシスタント。あなたと会話し、タスクやドキュメントを理解して、1週間を整えます。',
      blocks: [
        [
          'タスクや計画を丸ごと作成',
          '達成したいことを伝えると、Luminaがサブタスクと優先度付きでタスクを作成します。',
        ],
        [
          '1週間を計画',
          'カレンダーに集中ブロックを提案し、ワンクリックで確定できます。',
        ],
        [
          'ドキュメントを踏まえて回答',
          'タスクの内容、@メンション、PDF・DOCX・TXTファイルを活用します。',
        ],
        [
          '好みを記憶',
          '計画を提案する際に、あなたの働き方の好みを考慮します。',
        ],
        [
          'あなたの情報はあなたのためだけに',
          'Luminaはあなたのデータを回答のためだけに使います。',
        ],
      ],
    },
    templates: {
      group: 'リソース',
      title: 'すぐに始められるテンプレート',
      sub: 'ワークスペースですぐに使える構成のドキュメントと計画。',
    },
    students: {
      group: '対象ユーザー',
      title: '学生のためのFocusly',
      sub: '試験ごとの勉強を、試験日までのブロックに分けて計画。',
      blocks: [
        [
          '試験ごとの計画',
          '日付と科目をLuminaに伝えると、復習を1週間に割り振ります。',
        ],
        [
          'Markdownのノート',
          '科目ごとにワークスペースを作り、ノートをタスクの隣に。',
        ],
        [
          '勉強セッション',
          '休憩付きの集中モードで、気が散らずに勉強できます。',
        ],
      ],
    },
    freelancers: {
      group: '対象ユーザー',
      title: 'フリーランスのためのFocusly',
      sub: '複数のクライアントを両立し、プロジェクトごとの時間を記録。',
      blocks: [
        [
          'クライアントごとのプロジェクト',
          '各クライアントのタスク、ノート、成果物を専用のスペースに。',
        ],
        [
          '作業時間の記録',
          'タスクやクライアントごとにかけた時間がわかります。',
        ],
        ['バランスの取れた1週間', 'Luminaが仕事を勤務時間に割り振ります。'],
      ],
    },
    developers: {
      group: '対象ユーザー',
      title: '開発者のためのFocusly',
      sub: '会議の合間にディープワークの時間を確保。',
      blocks: [
        [
          'ディープワークのブロック',
          '会議で埋まる前に、カレンダーに時間を確保しましょう。',
        ],
        [
          'Markdownでドキュメント作成',
          '仕様書や技術ノートをライブプレビュー付きで。',
        ],
        [
          '難しい仕事はゴールデンタイムに',
          '複雑なタスクを、最も集中できる時間帯に入れましょう。',
        ],
      ],
    },
    creators: {
      group: '対象ユーザー',
      title: 'クリエイターのためのFocusly',
      sub: '台本、撮影、公開を同じ週の中で計画。',
      blocks: [
        [
          '台本から公開まで',
          '各作品をサブタスク付きのタスクに：台本、撮影、編集、公開。',
        ],
        ['ワークスペースで台本作成', 'タスクの隣で台本をMarkdownで書けます。'],
        ['公開カレンダー', '日付はGoogleカレンダーと同期されます。'],
      ],
    },
    pricing: {
      group: '料金',
      title: 'プランと料金',
      sub: 'カード不要で無料で始めて、必要になったらアップグレード。',
    },
    help: {
      group: 'リソース',
      title: 'ヘルプセンター',
      sub: 'Focuslyを使いこなすための、ステップごとのガイドと回答。',
    },
    changelog: {
      group: 'リソース',
      title: '新機能',
      sub: 'Focuslyの各バージョンの変更点と改善。',
    },
  },

  nav: {
    homeAria: 'Focusly、ホームへ',
    mainAria: 'メイン',
    product: '製品',
    lumina: 'Lumina AI',
    who: '対象ユーザー',
    pricing: '料金',
    resources: 'リソース',
    login: 'ログイン',
    start: '無料で始める',
    openApp: 'Focuslyを開く',
    language: '言語',
    openMenu: 'メニューを開く',
    closeMenu: 'メニューを閉じる',
    menu: 'メニュー',
    themeAria: 'テーマ：{name}。テーマを変更',
    columns: {
      plan: '計画する',
      focus: '集中する',
      organize: '整理する',
      understand: '理解する',
    },
    luminaCard: {
      title: 'Lumina AI',
      desc: '目標を、カレンダー上のブロック付きの計画に変えます。',
      cta: 'Luminaを見る',
      prompt: '今週の計画を立てて',
    },
  },

  themes: { light: 'ライト', dark: 'ダーク', graydark: 'グレー' },

  hero: {
    h1: '目標をLuminaに伝えるだけ。1週間を整えます。',
    sub: 'タスク、カレンダー、ノートをひとつに。LuminaがGoogleカレンダーに集中ブロックを組み込みます。',
    cta: '無料で始める',
    demo: 'デモを見る（60秒）',
    micro: 'カード不要 · Googleまたはメールでログイン',
    prompt: '今週の計画を立てて',
    thinking: 'Luminaが考えています',
    plan: '提案プラン · 4ブロック',
    add: 'カレンダーに追加',
    added: 'カレンダーに追加しました',
    placeholder: '質問や計画の依頼…',
    items: ['最終レポート', '試験の復習', 'クライアント提案', '週次レビュー'],
    durations: ['2時間', '1.5時間', '1時間', '30分'],
    days: ['月', '火', '水', '木', '金'],
    events: ['授業', '会議', '授業'],
    alt: 'Focusly：Luminaが週の計画を作成し、カレンダーに集中ブロックを配置',
  },

  trust: {
    aria: '連携',
    integrates: '連携先',
    logoTitle: 'Googleカレンダーの公式ロゴ',
    beta: 'オープンベータ中',
  },

  problem: {
    eyebrow: '課題',
    title: '計画に午前中を費やす必要はありません',
    sub: '1週間はGoogleカレンダーに、タスクは別の場所に。そんな状態では、何をいつやるかを決めること自体がまたひとつのタスクになります。',
    pains: [
      {
        icon: 'apps',
        title: 'アプリが多すぎる',
        desc: 'タスクはこのアプリ、カレンダーは別のアプリ、ノートはさらに別のアプリ。',
        fix: 'タスク、カレンダー、ノート、AIをひとつに。',
      },
      {
        icon: 'help',
        title: '何から始めればいいかわからない',
        desc: 'リストは増える一方で、どこから手をつけるかを決めるだけで午前中が終わります。',
        fix: 'Luminaが優先順位をつけ、今日と今週の計画を提案します。',
      },
      {
        icon: 'event_busy',
        title: 'カレンダーにタスクが反映されていない',
        desc: 'やるべきことのための時間が、週の中に確保されていません。',
        fix: 'Googleカレンダーと同期する集中ブロック。',
      },
    ],
  },

  pillars: {
    eyebrow: '製品',
    title: '1週間のすべてを、ひとつのアプリで',
    tabsAria: '製品の柱',
    tabs: [
      {
        icon: 'calendar_month',
        label: '計画する',
        title: 'タスクとカレンダーが連携',
        bullets: [
          '受信箱・今日・予定を、優先度、タグ、サブタスク、作業時間の記録とともに。',
          'Googleカレンダーと双方向に同期。',
          '週間プランナー：Luminaがタスクを勤務時間に割り振ります。',
        ],
      },
      {
        icon: 'timer',
        label: '集中する',
        title: '気が散らないディープワーク',
        bullets: [
          'ディープワークのセッションタイマー。',
          'セッション間の休憩。',
          'Luminaが提案し、ワンクリックで確定するタイムブロック。',
        ],
      },
      {
        icon: 'folder_open',
        label: '整理する',
        title: 'タスクのそばにドキュメントを',
        bullets: [
          'ライブプレビュー付きMarkdownのワークスペース。',
          'プロジェクトごとに整理されたドキュメント。',
          'すぐに始められるテンプレート。',
        ],
      },
      {
        icon: 'insights',
        label: '理解する',
        title: 'よりよい計画のためのデータ',
        bullets: [
          '集中時間と完了したタスク。',
          'エネルギースコアとゴールデンタイム。',
          'ヒートマップと傾向。',
        ],
      },
    ],
  },

  lumina: {
    eyebrow: 'Lumina AI',
    title: 'あなたの仕事を知っているアシスタント',
    sub: 'Luminaはあなたと会話し、タスクやドキュメントを理解して、カレンダーに集中ブロックを提案します。あなたはワンクリックで確定するだけです。',
    caps: [
      {
        icon: 'add_task',
        title: 'タスクを作成',
        desc: '必要なことを書くと、Luminaがタスクや計画を丸ごと作成します。',
      },
      {
        icon: 'date_range',
        title: '1週間を計画',
        desc: 'カレンダーに集中ブロックを提案し、ワンクリックで確定できます。',
      },
      {
        icon: 'attach_file',
        title: 'ドキュメントを活用',
        desc: 'タスクの内容、@メンション、PDF・DOCX・TXTファイルを踏まえて回答します。',
      },
      {
        icon: 'bookmark_heart',
        title: '好みを記憶',
        desc: '計画を提案する際に、あなたの働き方の好みを考慮します。',
      },
    ],
    demo: {
      aria: 'デモ：Luminaがひとつのメッセージから4つのタスクを作成',
      before:
        '金曜日に卒業論文を提出して、発表の準備もしないといけない。使って：',
      mention: '@卒論.docx',
      thinking: 'Luminaが考えています',
      planTitle: '提案プラン · 4タスク',
      tasks: [
        ['結論を書く', '今日 · 2時間'],
        ['参考文献を見直す', '火 · 1時間'],
        ['スライドを作る', '水 · 1.5時間'],
        ['発表を練習する', '木 · 45分'],
      ],
      create: 'すべて作成',
      created: '4つのタスクを作成しました',
      input: 'Luminaにメッセージ · @でメンション',
    },
  },

  how: {
    eyebrow: '使い方',
    title: '方向性のある1週間への3ステップ',
    steps: [
      {
        icon: 'sync',
        title: 'Googleカレンダーを連携',
        desc: 'Googleでログインすると、予定がFocuslyに表示されます。',
      },
      {
        icon: 'auto_awesome',
        title: 'Luminaに目標を伝える',
        desc: 'タスクを作成し、スケジュールにブロックを提案します。',
      },
      {
        icon: 'insights',
        title: '集中してインサイトを確認',
        desc: '集中モードで取り組み、自分のゴールデンタイムを見つけましょう。',
      },
    ],
  },

  insights: {
    eyebrow: 'インサイト',
    title: '自分が最も集中できる時間を知る',
    sub: '集中時間、完了したタスク、エネルギースコア、そしてゴールデンタイム（最も集中できる時間帯）。',
    week: '今週',
    sample: 'サンプルデータ',
    focusHours: '集中時間',
    tasksDone: '完了したタスク',
    energy: 'エネルギー',
    golden: 'ゴールデンタイム',
    barsTitle: '1日あたりの集中時間',
    days: ['月', '火', '水', '木', '金', '土', '日'],
    heatmapTitle: 'ヒートマップ',
    goldenLegend: 'ゴールデンタイム · 9:00–11:30',
    hoursUnit: '時間',
  },

  whoSection: {
    eyebrow: '対象ユーザー',
    title: 'Googleカレンダーで1週間を計画するすべての人に',
  },

  beta: {
    title: 'ベータに参加して、Focuslyづくりに協力してください',
    sub: '新機能を誰よりも早く試して、改善点を教えてください。',
    emailLabel: 'メールアドレス',
    placeholder: 'you@email.com',
    submit: 'ベータに参加',
  },

  pricing: {
    eyebrow: '料金',
    title: '無料で始めて、必要なときにアップグレード。',
    monthly: '月払い',
    annual: '年払い',
    annualAria: '年払い',
    save: '[PENDIENTE] お得',
    recommended: 'おすすめ',
    perMonth: '/月',
    perMonthAnnual: '/月 · 年払い',
    compareAll: 'すべてを比較',
    compareTitle: 'プランを比較',
    feature: '機能',
    note: '料金と上限は、ランディングページと共通の設定から読み込まれます。',
    plans: {
      free: {
        name: '無料',
        desc: '個人利用向け',
        cta: '無料で始める',
        feats: ['ワークスペース：[LÍMITE]', 'タスク無制限', '基本カレンダー'],
      },
      pro: {
        name: 'Pro',
        desc: '学生とプロフェッショナル向け',
        cta: 'Proを選ぶ',
        feats: [
          'ワークスペース無制限',
          'Lumina：月[LÍMITE]回',
          '高度な分析',
          'Googleカレンダー連携',
        ],
      },
      business: {
        name: 'ビジネス',
        desc: '最大限の生産性のために',
        cta: 'ビジネスを選ぶ',
        feats: [
          'Lumina無制限',
          'AIキューでの優先処理',
          '高度なインサイトと監査',
          'ワークスペースのエクスポート（Markdown/Word）',
          '優先サポートとベータアクセス',
          'SLAとセキュリティプロトコル',
        ],
      },
    },
    table: [
      ['タスク', '無制限', '無制限', '無制限'],
      ['ワークスペース', '[LÍMITE]', '無制限', '無制限'],
      ['カレンダー', '基本', 'フル', 'フル'],
      ['Googleカレンダー連携', '[PENDIENTE]', '✓', '✓'],
      ['Lumina AI', '[LÍMITE]', '月[LÍMITE]回', '無制限'],
      ['AIキューの優先度', '—', '—', '✓'],
      ['分析とインサイト', '[PENDIENTE]', '高度', '高度 + 監査'],
      ['ワークスペースのエクスポート（Markdown/Word）', '—', '—', '✓'],
      ['サポート', '[PENDIENTE]', '[PENDIENTE]', '優先 + ベータアクセス'],
      ['SLAとセキュリティプロトコル', '—', '—', '✓'],
    ],
  },

  security: {
    eyebrow: 'セキュリティとプライバシー',
    title: 'あなたのデータはあなたのもの',
    terms: '利用規約',
    privacy: 'プライバシー',
    items: [
      {
        icon: 'lock',
        title: 'すべてHTTPS',
        desc: '情報は暗号化されて送信されます。',
      },
      {
        icon: 'block',
        title: 'データは販売しません',
        desc: '広告主にも第三者にも。',
      },
      {
        icon: 'shield_person',
        title: 'AIはあなたのためだけに',
        desc: 'Luminaはあなたの情報を回答のためだけに使います。',
      },
      {
        icon: 'delete',
        title: 'いつでもアカウントを削除',
        desc: '設定からアカウントとデータを削除できます。',
      },
    ],
  },

  faq: {
    title: 'よくある質問',
    items: [
      [
        'Focuslyの料金は？',
        'カード不要で無料で始められます。Proは月[PRECIO]、ビジネスは月[PRECIO]です。',
      ],
      [
        'いつでも解約できますか？',
        'はい、設定から解約できます。[PENDIENTE: condiciones de reembolso y fin de periodo]',
      ],
      [
        'Luminaは私の情報のどこまでを見ますか？',
        '回答に必要なものだけです。あなたのタスク、@でメンションしたドキュメント、添付したファイル。それ以外の目的には使いません。',
      ],
      [
        'Googleカレンダーとの同期はどのように機能しますか？',
        '双方向です。Focuslyで作成したものはGoogleカレンダーに表示され、その逆も同様です。Luminaが提案したブロックは、あなたが確定したときにだけ追加されます。',
      ],
      [
        'データをエクスポートできますか？',
        'ワークスペースのドキュメントはMarkdownとWordでエクスポートできます。[PENDIENTE: exportación de tareas y disponibilidad por plan]',
      ],
      ['対応言語は？', 'スペイン語、英語、日本語です。'],
      [
        'スマートフォンで使えますか？',
        'FocuslyはWebアプリなので、スマートフォンのブラウザで使えます。[PENDIENTE: app nativa]',
      ],
      [
        'データは安全ですか？',
        'HTTPSを使用し、データは販売せず、アカウントはいつでも削除できます。詳しくはプライバシー通知をご覧ください。',
      ],
      [
        'パスワードは必要ですか？',
        'いいえ。メールでお送りするマジックリンク、またはGoogleアカウントでログインします。',
      ],
    ],
  },

  finalCta: {
    title: '来週は、もう整っています',
    sub: 'カレンダーを連携して、達成したいことをLuminaに伝えましょう。',
    cta: '無料で始める',
    micro: 'カード不要 · Googleまたはメールでログイン',
  },

  footer: {
    tagline: 'タスク、カレンダー、ノート、AIをひとつに。',
    product: '製品',
    resources: 'リソース',
    legal: '法的情報',
    terms: '利用規約',
    privacy: 'プライバシー',
    language: '言語',
    theme: 'テーマ',
  },

  demoModal: { aria: 'Focuslyのデモ（60秒）', close: '動画を閉じる' },

  page: {
    breadcrumbAria: 'パンくずリスト',
    home: 'ホーム',
    seePricing: '料金を見る',
    explore: 'さらに見る',
    finalTitle: '来週は、もう整っています',
    useTemplate: 'テンプレートを使う',
    preview: 'プレビュー',
    filterTemplates: 'テンプレートを絞り込む',
    helpSearchLabel: 'ヘルプセンターを検索',
    helpPlaceholder: 'ガイドや質問を検索',
    helpEmpty: '「{q}」に一致する結果はありません。',
    helpContactTitle: '探しているものが見つかりませんか？',
    helpContactDesc: 'お問い合わせいただければ、お返事します。',
    helpContact: 'お問い合わせ',
  },

  help: [
    {
      icon: 'rocket_launch',
      title: 'はじめに',
      desc: 'マジックリンクまたはGoogleでアカウントを作成し、スケジュールを設定します。',
    },
    {
      icon: 'checklist',
      title: 'タスク',
      desc: '受信箱、今日、予定、優先度、タグ、サブタスク。',
    },
    {
      icon: 'calendar_month',
      title: 'カレンダーとGoogleカレンダー',
      desc: 'アカウントを連携し、同期の仕組みを理解します。',
    },
    {
      icon: 'auto_awesome',
      title: 'Lumina AI',
      desc: '@メンション、添付ファイル、週間プラン。',
    },
    {
      icon: 'description',
      title: 'ワークスペース',
      desc: 'Markdownのドキュメント、プロジェクト、テンプレート。',
    },
    {
      icon: 'manage_accounts',
      title: 'アカウントと請求',
      desc: 'プラン、言語、テーマ、アカウントの削除。',
    },
  ],

  changelog: [
    {
      version: 'Workspaces 2.0',
      date: '[PENDIENTE: fecha]',
      tag: '新機能',
      title: 'Workspaces 2.0をリリース',
      desc: '[PENDIENTE: resumen real de los cambios]',
    },
    {
      version: '[PENDIENTE]',
      date: '[PENDIENTE: fecha]',
      tag: '改善',
      title: '[PENDIENTE: título]',
      desc: '[PENDIENTE: descripción]',
    },
    {
      version: '[PENDIENTE]',
      date: '[PENDIENTE: fecha]',
      tag: '修正',
      title: '[PENDIENTE: título]',
      desc: '[PENDIENTE: descripción]',
    },
  ],

  templateCategories: ['すべて', '計画', '勉強', '仕事', 'コンテンツ'],
  templates: [
    { cat: '計画', name: '週間計画', desc: '目標、優先度、週の振り返り。' },
    { cat: '勉強', name: '勉強計画', desc: 'テーマ、試験日、復習セッション。' },
    {
      cat: '仕事',
      name: 'クライアント管理',
      desc: '各クライアントの範囲、成果物、ノート。',
    },
    { cat: '仕事', name: '会議メモ', desc: '参加者、決定事項、次のステップ。' },
    { cat: '仕事', name: '技術ドキュメント', desc: '背景、決定事項、仕様。' },
    {
      cat: 'コンテンツ',
      name: '動画の台本',
      desc: 'アイデア、構成、台本、公開チェックリスト。',
    },
  ],
};
