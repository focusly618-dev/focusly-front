import type { SiteContent } from './types';

export const ko: SiteContent = {
  items: {
    tasks: {
      name: '작업',
      desc: '수신함, 오늘, 예정 작업을 우선순위와 하위 작업과 함께',
    },
    calendar: {
      name: '캘린더 및 Google 캘린더',
      short: '캘린더',
      desc: '일정과 양방향 동기화',
    },
    planner: {
      name: 'AI 플래너',
      desc: 'Lumina가 작업을 근무 시간에 맞춰 배치해요',
    },
    focus: { name: '집중 모드', desc: '딥 워크 세션과 휴식' },
    timeBlocks: {
      name: '타임 블록',
      desc: 'Lumina가 제안하고 내가 확정해요',
    },
    workspaces: {
      name: '워크스페이스 및 노트',
      desc: '실시간 미리보기가 되는 마크다운',
    },
    projects: { name: '프로젝트', desc: '문서를 프로젝트별로 묶기' },
    templates: { name: '템플릿', desc: '바로 쓸 수 있는 문서와 계획' },
    insights: {
      name: '인사이트 및 골든 윈도',
      short: '인사이트',
      desc: '가장 잘 집중하는 시간대',
    },
    lumina: {
      name: 'Lumina AI',
      desc: '계획과 집중을 돕는 AI 어시스턴트',
    },
    students: {
      name: '학생',
      desc: '시험마다 공부를 시험일 전까지 블록으로 나눠요.',
    },
    freelancers: {
      name: '프리랜서',
      desc: '여러 고객을 관리하고 프로젝트별 시간을 기록해요.',
    },
    developers: {
      name: '개발자',
      desc: '회의 사이에 딥 워크 시간을 지켜요.',
    },
    creators: {
      name: '크리에이터',
      desc: '대본, 촬영, 게시를 같은 주에 계획해요.',
    },
    pricing: { name: '요금', desc: 'Free, Pro, Business 플랜' },
    help: { name: '도움말 센터', desc: '단계별 가이드와 답변' },
    changelog: {
      name: '새로운 기능',
      desc: '버전마다의 변경 사항과 개선 사항',
    },
  },

  pages: {
    tasks: {
      group: '제품 · 계획',
      title: '모든 작업을 질서 있게',
      sub: '수신함, 오늘, 예정 작업을 우선순위, 태그, 하위 작업, 시간 기록과 함께 하나의 목록에서.',
      blocks: [
        [
          '수신함, 오늘, 예정',
          '모든 걸 수신함에 담고 나중에 결정하세요. 오늘에는 마감인 것이, 예정에는 다음 할 일이 보여요.',
        ],
        [
          '우선순위와 태그',
          '급한 일을 표시하고 맥락, 고객, 주제별로 묶으세요.',
        ],
        [
          '하위 작업과 시간 기록',
          '일을 단계로 나누고 각 단계에 걸리는 시간을 기록하세요.',
        ],
      ],
    },
    calendar: {
      group: '제품 · 계획',
      title: '캘린더와 작업이 드디어 한곳에',
      sub: 'Google 캘린더와 양방향 동기화: 한쪽에서 바꾼 내용이 다른 쪽에도 나타나요.',
      blocks: [
        [
          '양방향 동기화',
          'Google 캘린더 일정이 Focusly에 나타나고, Focusly에서 만든 것은 Google 캘린더에 나타나요.',
        ],
        [
          '일정과 블록을 한 화면에',
          '회의, 수업, 집중 블록을 같은 주에서 확인하세요.',
        ],
        [
          '확인 없이는 아무것도 하지 않아요',
          'Lumina가 블록을 제안하고, 내가 확정한 뒤에만 캘린더에 추가돼요.',
        ],
      ],
    },
    planner: {
      group: '제품 · 계획',
      title: '몇 분 만에 계획되는 한 주',
      sub: 'Lumina가 작업을 근무 시간에 맞춰 배치하고 주간 계획을 제안해요.',
      blocks: [
        [
          '근무 시간을 지켜요',
          '블록은 근무 시간으로 설정한 시간대 안에만 배치돼요.',
        ],
        [
          '확정 전에 검토',
          '블록을 조정하거나 빼고, 클릭 한 번으로 계획을 확정하세요.',
        ],
        ['Google 캘린더로 바로', '확정한 계획이 일정에 나타나요.'],
      ],
    },
    focus: {
      group: '제품 · 집중',
      title: '휴식이 있는 딥 워크 세션',
      sub: '하나의 작업에 집중하고 세션 사이에 쉬도록 돕는 타이머.',
      blocks: [
        ['세션 타이머', '작업을 골라 탭을 바꾸지 않고 집중하세요.'],
        ['세션 사이 휴식', '딥 워크와 휴식을 번갈아 하며 페이스를 유지하세요.'],
        [
          '내 시간이 쌓여요',
          '모든 세션이 인사이트에 반영돼요: 집중 시간과 골든 윈도.',
        ],
      ],
    },
    timeBlocks: {
      group: '제품 · 집중',
      title: '중요한 일에 시간을 확보하세요',
      sub: 'Lumina가 제안하고 클릭 한 번으로 확정하는 캘린더 속 집중 블록.',
      blocks: [
        ['Lumina가 제안', 'Lumina가 작업마다 이번 주의 빈 시간을 찾아요.'],
        ['클릭 한 번으로 확정', '전부, 하나씩, 또는 하나도 받지 않아도 돼요.'],
        [
          'Google 캘린더에 표시',
          '블록이 일정에 표시되어 아무도 그 시간을 가져가지 못해요.',
        ],
      ],
    },
    workspaces: {
      group: '제품 · 정리',
      title: '업무 바로 옆의 문서',
      sub: '실시간 미리보기가 되는 마크다운으로 쓰고, 노트를 작업 옆에 두세요.',
      blocks: [
        [
          '실시간 미리보기 마크다운',
          '키보드에서 손을 떼지 않고 서식을 적용하고 결과를 바로 확인하세요.',
        ],
        ['프로젝트별 정리', '모든 문서는 해당 프로젝트 안에 있어요.'],
        [
          'Lumina가 문서를 이해해요',
          '@로 문서를 언급하면 Lumina가 그 맥락으로 답해요.',
        ],
      ],
    },
    projects: {
      group: '제품 · 정리',
      title: '모든 프로젝트를 제자리에',
      sub: '같은 프로젝트의 문서를 워크스페이스 안에 묶으세요.',
      blocks: [
        ['프로젝트마다 하나의 공간', '노트, 사양, 계획을 한곳에.'],
        ['템플릿으로 시작', '템플릿으로 프로젝트 구조를 만드세요.'],
        [
          'Lumina를 위한 맥락',
          'Lumina가 프로젝트 문서를 활용해 답할 수 있어요.',
        ],
      ],
    },
    insights: {
      group: '제품 · 이해',
      title: '언제 가장 잘 일하는지 알아보세요',
      sub: '집중 시간, 완료한 작업, 에너지 점수, 골든 윈도, 히트맵과 추세.',
      blocks: [
        [
          '집중 시간과 완료한 작업',
          '매주 딥 워크를 얼마나 하고 얼마나 끝내는지 확인하세요.',
        ],
        ['에너지 점수', '한 주 동안 에너지가 어떻게 변하는지 살펴보세요.'],
        [
          '골든 윈도',
          '가장 잘 집중하는 시간대예요. 어려운 일을 위해 남겨 두세요.',
        ],
        ['히트맵과 추세', '요일과 시간대별 패턴을 찾아보세요.'],
      ],
    },
    lumina: {
      group: 'Lumina AI',
      cta2: '플래너 보기',
      title: 'Lumina를 만나 보세요',
      sub: 'Focusly 속 AI 어시스턴트: 나와 대화하고, 작업과 문서를 이해하고, 한 주를 정리해요.',
      blocks: [
        [
          '작업과 전체 계획 생성',
          '이루고 싶은 것을 설명하면 Lumina가 하위 작업과 우선순위까지 갖춘 작업을 만들어요.',
        ],
        [
          '한 주 계획',
          '캘린더에 집중 블록을 제안하고, 클릭 한 번으로 확정해요.',
        ],
        [
          '내 문서로 답변',
          '작업의 맥락, @ 언급, PDF·DOCX·TXT 파일을 활용해요.',
        ],
        ['선호를 기억', '계획을 제안할 때 내가 일하는 방식을 고려해요.'],
        [
          '내 정보는 나만을 위해',
          'Lumina는 답변하는 데에만 내 데이터를 사용해요.',
        ],
      ],
    },
    templates: {
      group: '리소스',
      title: '더 빨리 시작하는 템플릿',
      sub: '워크스페이스에 바로 쓸 수 있는 구조의 문서와 계획.',
    },
    students: {
      group: '이런 분께',
      title: '학생을 위한 Focusly',
      sub: '시험마다 공부를 시험일 전까지 블록으로 나눠요.',
      blocks: [
        [
          '시험마다 하나의 계획',
          'Lumina에게 날짜와 과목을 알려 주면 복습을 한 주에 나눠 배치해요.',
        ],
        [
          '강의 계획서에서 작업으로',
          '강의 계획서를 PDF로 첨부하면 Lumina가 노트와 복습 작업이 있는 프로젝트로 만들어요.',
        ],
        ['공부 세션', '휴식이 포함된 집중 모드로 방해 없이 공부하세요.'],
      ],
    },
    freelancers: {
      group: '이런 분께',
      title: '프리랜서를 위한 Focusly',
      sub: '여러 고객을 관리하고 프로젝트별 시간을 기록해요.',
      blocks: [
        [
          '고객마다 하나의 프로젝트',
          '고객별 작업, 노트, 산출물을 각자의 공간에.',
        ],
        ['시간 기록', '작업과 고객마다 시간을 얼마나 쓰는지 파악하세요.'],
        [
          '고객 미팅',
          '작업에서 바로 Google Meet 링크와 고객 초대가 포함된 회의를 만드세요.',
        ],
      ],
    },
    developers: {
      group: '이런 분께',
      title: '개발자를 위한 Focusly',
      sub: '회의 사이에 딥 워크 시간을 지켜요.',
      blocks: [
        ['딥 워크 블록', '캘린더가 회의로 차기 전에 시간을 확보하세요.'],
        [
          '보드 위의 스프린트',
          '목록에서 칸반으로 바꾸고 작업을 할 일에서 완료로 옮기세요.',
        ],
        [
          '어려운 일은 골든 윈도에',
          '복잡한 작업을 가장 잘 집중하는 시간대에 배치하세요.',
        ],
      ],
    },
    creators: {
      group: '이런 분께',
      title: '크리에이터를 위한 Focusly',
      sub: '대본, 촬영, 게시를 같은 주에 계획해요.',
      blocks: [
        [
          '대본부터 게시까지',
          '콘텐츠마다 하위 작업이 있는 작업으로: 대본, 촬영, 편집, 게시.',
        ],
        [
          'Lumina와 함께 쓰기',
          '편집기를 떠나지 않고 대본 초안 작성, 요약, 다시 쓰기를 요청하세요.',
        ],
        ['게시 캘린더', 'Google 캘린더와 동기화되는 날짜.'],
      ],
    },
    pricing: {
      group: '요금',
      title: '플랜 및 요금',
      sub: '카드 없이 무료로 시작하고, 필요할 때 업그레이드하세요.',
    },
    help: {
      group: '리소스',
      title: '도움말 센터',
      sub: 'Focusly를 최대한 활용하기 위한 단계별 가이드와 답변.',
    },
    changelog: {
      group: '리소스',
      title: '새로운 기능',
      sub: 'Focusly의 버전마다의 변경 사항과 개선 사항.',
    },
  },

  nav: {
    homeAria: 'Focusly, 홈으로 이동',
    mainAria: '주 메뉴',
    product: '제품',
    lumina: 'Lumina AI',
    who: '이런 분께',
    pricing: '요금',
    resources: '리소스',
    login: '로그인',
    start: '무료로 시작',
    openApp: 'Focusly 열기',
    language: '언어',
    openMenu: '메뉴 열기',
    closeMenu: '메뉴 닫기',
    menu: '메뉴',
    themeAria: '테마: {name}. 테마 변경',
    columns: {
      plan: '계획',
      focus: '집중',
      organize: '정리',
      understand: '이해',
    },
    luminaCard: {
      title: 'Lumina AI',
      desc: '목표를 캘린더 블록이 있는 계획으로 바꿔요.',
      cta: 'Lumina 알아보기',
      prompt: '이번 주 계획 세워 줘',
    },
  },

  themes: { light: '라이트', dark: '다크', graydark: '딤' },

  hero: {
    h1: 'Lumina에게 목표를 말하세요. 한 주는 Lumina가 계획해요.',
    sub: '작업, 캘린더, 노트를 한곳에. Lumina가 목표를 Google 캘린더의 집중 블록으로 바꿔요.',
    cta: '무료로 시작',
    demo: '데모 보기 (60초)',
    micro: '카드 불필요 · Google 또는 이메일로 로그인',
    prompt: '이번 주 계획 세워 줘',
    thinking: 'Lumina가 생각 중이에요',
    plan: '추천 계획 · 블록 4개',
    add: '캘린더에 추가',
    added: '캘린더에 추가됨',
    placeholder: '질문하거나 계획을 요청하세요…',
    items: ['최종 보고서', '시험 복습', '고객 제안서', '주간 회고'],
    durations: ['2시간', '1.5시간', '1시간', '30분'],
    days: ['월', '화', '수', '목', '금'],
    events: ['수업', '회의', '수업'],
    alt: 'Focusly: Lumina가 주간 계획을 만들고 캘린더에 집중 블록을 배치해요',
  },

  trust: {
    aria: '연동',
    integrates: '함께 쓰는 서비스',
    logoTitle: 'Google 캘린더 공식 로고',
    beta: '오픈 베타 중',
  },

  problem: {
    eyebrow: '문제',
    title: '계획 세우느라 아침을 다 써서는 안 돼요',
    sub: '한 주는 Google 캘린더에, 작업은 다른 곳에 있다면 무엇을 언제 할지 정하는 것 자체가 또 하나의 일이 돼요.',
    pains: [
      {
        icon: 'apps',
        title: '앱이 너무 많아요',
        desc: '작업은 이 앱, 캘린더는 저 앱, 노트는 또 다른 앱에.',
        fix: '작업, 캘린더, 노트, AI를 한곳에.',
      },
      {
        icon: 'help',
        title: '무엇부터 해야 할지 모르겠어요',
        desc: '목록은 계속 늘어나고 어디서 시작할지 정하다 아침이 지나가요.',
        fix: 'Lumina가 우선순위를 정하고 오늘과 이번 주 계획을 제안해요.',
      },
      {
        icon: 'event_busy',
        title: '캘린더에 작업이 반영되지 않아요',
        desc: '해야 할 일에 한 주 중 확보된 시간이 없어요.',
        fix: 'Google 캘린더와 동기화되는 집중 블록.',
      },
    ],
  },

  pillars: {
    eyebrow: '제품',
    title: '한 주 전체를 하나의 앱에서',
    tabsAria: '제품의 핵심 기능',
    tabs: [
      {
        icon: 'calendar_month',
        label: '계획',
        title: '서로 연결되는 작업과 캘린더',
        bullets: [
          '수신함, 오늘, 예정 작업을 우선순위, 태그, 하위 작업, 시간 기록과 함께.',
          'Google 캘린더와 양방향 동기화.',
          '주간 플래너: Lumina가 작업을 근무 시간에 맞춰 배치해요.',
        ],
        mediaAlt:
          'Focusly: Lumina가 수신함의 작업을 업무 주간에 배치하고 Google 캘린더와 동기화해요',
      },
      {
        icon: 'timer',
        label: '집중',
        title: '방해 없는 딥 워크',
        bullets: [
          '딥 워크 세션 타이머.',
          '세션 사이 휴식.',
          'Lumina가 제안하고 클릭 한 번으로 확정하는 타임 블록.',
        ],
      },
      {
        icon: 'folder_open',
        label: '정리',
        title: '작업 바로 옆의 문서',
        bullets: [
          '실시간 미리보기가 되는 마크다운 문서 워크스페이스.',
          '프로젝트별로 정리된 문서.',
          '더 빨리 시작하는 템플릿.',
        ],
      },
      {
        icon: 'insights',
        label: '이해',
        title: '더 나은 계획을 위한 데이터',
        bullets: [
          '집중 시간과 완료한 작업.',
          '에너지 점수와 골든 윈도.',
          '히트맵과 추세.',
        ],
      },
    ],
  },

  lumina: {
    eyebrow: 'Lumina AI',
    title: '내 일을 아는 어시스턴트',
    sub: 'Lumina는 나와 대화하고, 작업과 문서를 이해하고, 캘린더에 집중 블록을 제안해요. 클릭 한 번으로 확정하세요.',
    caps: [
      {
        icon: 'add_task',
        title: '작업 생성',
        desc: '필요한 것을 적으면 Lumina가 작업이나 전체 계획을 만들어요.',
      },
      {
        icon: 'date_range',
        title: '한 주 계획',
        desc: '캘린더에 집중 블록을 제안하고, 클릭 한 번으로 확정해요.',
      },
      {
        icon: 'attach_file',
        title: '내 문서 활용',
        desc: '작업의 맥락, @ 언급, PDF·DOCX·TXT 파일로 답해요.',
      },
      {
        icon: 'bookmark_heart',
        title: '선호를 기억',
        desc: '계획을 제안할 때 내가 일하는 방식을 고려해요.',
      },
    ],
    demo: {
      aria: '데모: Lumina가 메시지 하나로 작업 4개를 만들어요',
      before: '금요일까지 논문을 제출하고 발표를 준비해야 해. 참고해:',
      mention: '@논문.docx',
      thinking: 'Lumina가 생각 중이에요',
      planTitle: '추천 계획 · 작업 4개',
      tasks: [
        ['결론 쓰기', '오늘 · 2시간'],
        ['참고 문헌 검토', '화 · 1시간'],
        ['슬라이드 디자인', '수 · 1.5시간'],
        ['발표 리허설', '목 · 45분'],
      ],
      create: '모두 만들기',
      created: '작업 4개 생성됨',
      input: 'Lumina에게 메시지 · @로 언급',
    },
  },

  how: {
    eyebrow: '이용 방법',
    title: '방향 있는 한 주를 위한 세 단계',
    steps: [
      {
        icon: 'sync',
        title: 'Google 캘린더 연결',
        desc: 'Google로 로그인하면 일정이 Focusly에 나타나요.',
      },
      {
        icon: 'auto_awesome',
        title: 'Lumina에게 목표 말하기',
        desc: '작업을 만들고 일정에 블록을 제안해요.',
      },
      {
        icon: 'insights',
        title: '집중하고 인사이트 확인',
        desc: '집중 모드로 일하고 나의 골든 윈도를 발견하세요.',
      },
    ],
  },

  insights: {
    eyebrow: '인사이트',
    title: '언제 가장 잘 일하는지 알아보세요',
    sub: '집중 시간, 완료한 작업, 에너지 점수, 그리고 가장 잘 집중하는 시간대인 골든 윈도.',
    week: '이번 주',
    sample: '예시 데이터',
    focusHours: '집중 시간',
    tasksDone: '완료한 작업',
    energy: '에너지',
    golden: '골든 윈도',
    barsTitle: '일별 집중 시간',
    days: ['월', '화', '수', '목', '금', '토', '일'],
    heatmapTitle: '히트맵',
    goldenLegend: '골든 윈도 · 9:00–11:30',
    hoursUnit: '시간',
  },

  whoSection: {
    eyebrow: '이런 분께',
    title: 'Google 캘린더로 한 주를 계획하는 모든 분께',
  },

  beta: {
    title: '베타에 참여해 Focusly를 함께 만들어 주세요',
    sub: '새 기능을 누구보다 먼저 써 보고 개선할 점을 알려 주세요.',
    emailLabel: '이메일',
    placeholder: 'you@email.com',
    submit: '베타 참여하기',
  },

  pricing: {
    eyebrow: '요금',
    title: '무료로 시작하고, 필요할 때 업그레이드하세요.',
    monthly: '월간',
    annual: '연간',
    annualAria: '연간 결제',
    save: '[PENDIENTE] 절약',
    recommended: '추천',
    perMonth: '/월',
    perMonthAnnual: '/월 · 연간 결제',
    managePlan: '내 플랜 관리',
    compareAll: '전체 비교',
    compareTitle: '플랜 비교',
    feature: '기능',
    note: '가격과 한도는 랜딩 페이지와 공유되는 단일 설정에서 가져와요.',
    plans: {
      free: {
        name: 'Free',
        desc: '개인용',
        cta: '무료로 시작',
        feats: ['워크스페이스: [LÍMITE]', '무제한 작업', '기본 캘린더'],
      },
      pro: {
        name: 'Pro',
        desc: '학생과 전문가를 위해',
        cta: 'Pro 선택',
        feats: [
          '무제한 워크스페이스',
          'Lumina: 월 [LÍMITE]회 사용',
          '고급 분석',
          'Google 캘린더 연동',
        ],
      },
      business: {
        name: 'Business',
        desc: '최고의 생산성을 위해',
        cta: 'Business 선택',
        feats: [
          '무제한 Lumina',
          'AI 대기열 우선 처리',
          '고급 인사이트 및 감사',
          '워크스페이스 내보내기 (Markdown/Word)',
          '우선 지원 및 베타 이용',
          'SLA 및 보안 프로토콜',
        ],
      },
    },
    table: [
      ['작업', '무제한', '무제한', '무제한'],
      ['워크스페이스', '[LÍMITE]', '무제한', '무제한'],
      ['캘린더', '기본', '전체', '전체'],
      ['Google 캘린더 연동', '[PENDIENTE]', '✓', '✓'],
      ['Lumina AI', '[LÍMITE]', '월 [LÍMITE]회', '무제한'],
      ['AI 대기열 우선순위', '—', '—', '✓'],
      ['분석 및 인사이트', '[PENDIENTE]', '고급', '고급 + 감사'],
      ['워크스페이스 내보내기 (Markdown/Word)', '—', '—', '✓'],
      ['지원', '[PENDIENTE]', '[PENDIENTE]', '우선 지원 + 베타 이용'],
      ['SLA 및 보안 프로토콜', '—', '—', '✓'],
    ],
  },

  security: {
    eyebrow: '보안 및 개인정보',
    title: '내 데이터는 나의 것',
    terms: '약관',
    privacy: '개인정보',
    items: [
      {
        icon: 'lock',
        title: '모든 곳에 HTTPS',
        desc: '정보는 암호화되어 전송돼요.',
      },
      {
        icon: 'block',
        title: '데이터를 팔지 않아요',
        desc: '광고주에게도, 제3자에게도.',
      },
      {
        icon: 'shield_person',
        title: 'AI는 나만을 위해 일해요',
        desc: 'Lumina는 답변하는 데에만 내 정보를 사용해요.',
      },
      {
        icon: 'delete',
        title: '언제든 계정 삭제',
        desc: '설정에서 계정과 데이터를 삭제하세요.',
      },
    ],
  },

  faq: {
    title: '자주 묻는 질문',
    items: [
      [
        'Focusly는 얼마인가요?',
        '카드 없이 무료로 시작할 수 있어요. Pro는 월 [PRECIO], Business는 월 [PRECIO]예요.',
      ],
      [
        '언제든 취소할 수 있나요?',
        '네, 설정에서 할 수 있어요. [PENDIENTE: condiciones de reembolso y fin de periodo]',
      ],
      [
        'Lumina는 내 정보를 얼마나 보나요?',
        '답변에 필요한 것만 봐요: 작업, @로 언급한 문서, 첨부한 파일. 다른 용도로는 사용하지 않아요.',
      ],
      [
        'Google 캘린더 동기화는 어떻게 작동하나요?',
        '양방향이에요. Focusly에서 만든 것은 Google 캘린더에, Google 캘린더에서 만든 것은 Focusly에 나타나요. Lumina가 제안한 블록은 확정한 뒤에만 추가돼요.',
      ],
      [
        '데이터를 내보낼 수 있나요?',
        '워크스페이스 문서는 Markdown과 Word로 내보낼 수 있어요. [PENDIENTE: exportación de tareas y disponibilidad por plan]',
      ],
      [
        '어떤 언어를 지원하나요?',
        '스페인어, 영어(미국·영국), 포르투갈어(브라질), 프랑스어, 독일어, 이탈리아어, 일본어, 한국어, 중국어(간체)를 지원해요.',
      ],
      [
        '휴대폰에서도 되나요?',
        'Focusly는 웹 앱이라 휴대폰 브라우저에서 작동해요. [PENDIENTE: app nativa]',
      ],
      [
        '내 데이터는 안전한가요?',
        'HTTPS를 사용하고, 데이터를 팔지 않으며, 언제든 계정을 삭제할 수 있어요. 자세한 내용은 개인정보 처리방침을 확인하세요.',
      ],
      [
        '비밀번호가 필요한가요?',
        '아니요. 이메일로 보내는 매직 링크나 Google 계정으로 로그인해요.',
      ],
    ],
  },

  finalCta: {
    title: '다음 주가 벌써 정리되어 있어요',
    sub: '캘린더를 연결하고 Lumina에게 이루고 싶은 것을 말하세요.',
    cta: '무료로 시작',
    micro: '카드 불필요 · Google 또는 이메일로 로그인',
  },

  footer: {
    tagline: '작업, 캘린더, 노트, AI를 한곳에.',
    product: '제품',
    resources: '리소스',
    legal: '법적 고지',
    terms: '약관',
    privacy: '개인정보',
    language: '언어',
    theme: '테마',
  },

  demoModal: { aria: 'Focusly 데모, 60초', close: '동영상 닫기' },

  page: {
    breadcrumbAria: '이동 경로',
    home: '홈',
    seePricing: '요금 보기',
    explore: '계속 둘러보기',
    finalTitle: '다음 주가 벌써 정리되어 있어요',
    useTemplate: '템플릿 사용',
    preview: '미리보기',
    filterTemplates: '템플릿 필터',
    helpSearchLabel: '도움말 센터 검색',
    helpPlaceholder: '가이드나 질문을 검색하세요',
    helpEmpty: '“{q}”에 대한 결과가 없어요.',
    helpContactTitle: '찾는 내용이 없나요?',
    helpContactDesc: '메시지를 보내 주시면 답변드릴게요.',
    helpContact: '문의하기',
  },

  help: [
    {
      icon: 'rocket_launch',
      title: '시작하기',
      desc: '매직 링크나 Google로 계정을 만들고 근무 시간을 설정하세요.',
    },
    {
      icon: 'checklist',
      title: '작업',
      desc: '수신함, 오늘, 예정, 우선순위, 태그, 하위 작업.',
    },
    {
      icon: 'calendar_month',
      title: '캘린더 및 Google 캘린더',
      desc: '계정을 연결하고 동기화를 이해하세요.',
    },
    {
      icon: 'auto_awesome',
      title: 'Lumina AI',
      desc: '@ 언급, 첨부 파일, 주간 계획.',
    },
    {
      icon: 'description',
      title: '워크스페이스',
      desc: '마크다운 문서, 프로젝트, 템플릿.',
    },
    {
      icon: 'manage_accounts',
      title: '계정 및 결제',
      desc: '플랜, 언어, 테마, 계정 삭제.',
    },
  ],

  changelog: [
    {
      version: 'Workspaces 2.0',
      date: '[PENDIENTE: fecha]',
      tag: '신규',
      title: 'Workspaces 2.0 출시',
      desc: '[PENDIENTE: resumen real de los cambios]',
    },
    {
      version: '[PENDIENTE]',
      date: '[PENDIENTE: fecha]',
      tag: '개선',
      title: '[PENDIENTE: título]',
      desc: '[PENDIENTE: descripción]',
    },
    {
      version: '[PENDIENTE]',
      date: '[PENDIENTE: fecha]',
      tag: '수정',
      title: '[PENDIENTE: título]',
      desc: '[PENDIENTE: descripción]',
    },
  ],

  templateCategories: ['전체', '계획', '공부', '업무', '콘텐츠'],
  templates: [
    {
      cat: '계획',
      name: '주간 계획',
      desc: '목표, 우선순위, 한 주 회고.',
    },
    {
      cat: '공부',
      name: '학습 계획',
      desc: '주제, 시험 날짜, 복습 세션.',
    },
    {
      cat: '업무',
      name: '고객 관리',
      desc: '고객별 범위, 산출물, 노트.',
    },
    {
      cat: '업무',
      name: '회의록',
      desc: '참석자, 결정 사항, 다음 단계.',
    },
    {
      cat: '업무',
      name: '기술 문서',
      desc: '배경, 결정 사항, 사양.',
    },
    {
      cat: '콘텐츠',
      name: '영상 대본',
      desc: '아이디어, 구성, 대본, 게시 체크리스트.',
    },
  ],
};
