import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  useTheme,
  TextField,
  InputAdornment,
  Divider,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
import {
  Close as CloseIcon,
  DescriptionOutlined as TemplateIcon,
  Add as AddIcon,
  Search as SearchIcon,
  RocketLaunchOutlined as RocketIcon,
  PsychologyOutlined as BrainIcon,
  TrackChangesOutlined as TargetIcon,
  CodeOutlined as CodeIcon,
  SpeedOutlined as SpeedIcon,
  SchoolOutlined as LearnIcon,
  VisibilityOutlined as EyeIcon,
  FolderOutlined as FolderIcon,
  ChecklistOutlined as ChecklistIcon,
  TimerOutlined as TimerIcon,
  WavesOutlined as WavesIcon,
  InboxOutlined as InboxIcon,
  RepeatOutlined as RepeatIcon,
  MenuBookOutlined as BookIcon,
  AutorenewOutlined as RetroIcon,
  ViewKanbanOutlined as KanbanIcon,
  WarningAmberOutlined as RiskIcon,
  ForumOutlined as FeedbackIcon,
} from '@mui/icons-material';
import type { ProjectGroupTypes } from '../../../types/workspace.types';

export interface TemplateItem {
  id: string;
  title: string;
  category: 'Product & Strategy' | 'Engineering' | 'Productivity' | 'Systems';
  description: string;
  estimatedTime: string;
  icon: React.ReactNode;
  content: string;
  tips: string[];
}

const PROFESSIONAL_TEMPLATES: TemplateItem[] = [
  {
    id: 'prd-spec',
    title: 'Product Requirement Document (PRD)',
    category: 'Product & Strategy',
    description:
      'Complete specification for new features, problem definition, user stories, acceptance criteria, and success metrics.',
    estimatedTime: '15-30 min setup',
    icon: <RocketIcon sx={{ color: '#7c3aed' }} />,
    tips: [
      'Use this template before writing code to align scope.',
      'Fill out the Acceptance Criteria section to generate test scenarios.',
      'Link this workspace note directly to your primary task.',
    ],
    content: `# 🚀 Product Requirement Document: [Feature Name]

> **Author**: [Your Name]  
> **Status**: Draft | Under Review | Approved  
> **Target Release**: Q3 2026  

---

## 🎯 1. Problem Statement & Context
- **What problem are we solving?**
  Describe the user pain point or business opportunity clearly.
- **Why is it important now?**
  Explain the business impact and user demand.

---

## 👤 2. Target Users & User Stories
| User Persona | Action / Need | Expected Outcome |
| :--- | :--- | :--- |
| **End User** | Wants to preview templates before applying | Avoids creating blank notes |
| **Developer** | Wants a clear PRD structure | Reduces ambiguity and back-and-forth |

---

## 📋 3. Functional Requirements & Scope
- [ ] **Core Requirement 1**: Interactive live preview panel in modal.
- [ ] **Core Requirement 2**: Search and category filtering across templates.
- [ ] **Core Requirement 3**: One-click initialization into Workspace Editor.
- [ ] **Out of Scope**: Third-party template marketplace (Deferred to V2).

---

## ✅ 4. Acceptance Criteria
- [ ] **AC-1**: Selecting any template updates the right preview pane instantly.
- [ ] **AC-2**: Clicking "Use This Template" loads title and content into editor.
- [ ] **AC-3**: Mobile responsive split view switches smoothly.

---

## 📊 5. Success Metrics (KPIs)
- **Primary Metric**: 30% reduction in time-to-first-note.
- **Secondary Metric**: Increased usage of structured workspace notes.

---

## 🔬 6. Technical Considerations & Risks
- **Dependencies**: Workspace GraphQL mutations, React Hook Form integration.
- **Potential Risk**: Large markdown strings rendering in live preview.
`,
  },
  {
    id: 'tech-spec-rfc',
    title: 'Technical Architecture Spec (RFC)',
    category: 'Engineering',
    description:
      'System design document detailing proposed architecture, API endpoints, data schema, trade-offs, and security considerations.',
    estimatedTime: '20-45 min setup',
    icon: <CodeIcon sx={{ color: '#3b82f6' }} />,
    tips: [
      'Ideal for evaluating complex system design decisions.',
      'List at least two alternative architectures in Section 4.',
      'Include data migration or security impact in Section 5.',
    ],
    content: `# 🔬 Technical RFC: [System / Architecture Name]

> **Author**: Engineering Team  
> **Status**: RFC / Proposed  
> **Created Date**: August 2026  

---

## 📌 1. High-Level Summary
Provide a concise overview of the technical change or new subsystem being introduced.

---

## 🏛️ 2. Proposed System Architecture
Describe the structural design, component interaction, and data flow.

\`\`\`
[ Client Application ] 
       │ (GraphQL Query / Mutation)
       ▼
[ API Gateway / Handler ]
       │ (Business Logic)
       ▼
[ Database / PostgreSQL Store ]
\`\`\`

---

## ⚙️ 3. API & Data Contracts
- **Input**: \`CreateWorkspaceInput { title, content, groupId }\`
- **Output**: \`WorkspacePayload { id, title, content, updatedAt }\`

---

## ⚖️ 4. Trade-Offs & Alternatives Considered
1. **Option A (Chosen)**: Live rendered preview inside modal.
   - *Pros*: Immediate feedback, high user engagement.
   - *Cons*: Slight increase in modal width requirement.
2. **Option B**: Full-page template explorer.
   - *Pros*: More room.
   - *Cons*: Breaks user workflow context.

---

## 🔒 5. Security, Performance & Scalability
- **Security**: Sanitize markdown output before rendering.
- **Performance**: Pre-compile template markdown strings.
- **Scalability**: Zero extra database overhead until user confirms creation.
`,
  },
  {
    id: 'para-second-brain',
    title: 'Second Brain (PARA System)',
    category: 'Systems',
    description:
      'Tiago Forte’s PARA framework for organizing digital life into Projects, Areas, Resources, and Archives.',
    estimatedTime: '10 min daily',
    icon: <BrainIcon sx={{ color: '#ec4899' }} />,
    tips: [
      'Projects have deadlines and concrete outcomes.',
      'Areas are ongoing responsibilities without an end date.',
      'Resources are topics of interest and reference materials.',
    ],
    content: `# 🧠 Second Brain: PARA System Dashboard

> **Framework**: PARA (Projects, Areas, Resources, Archives)  
> **Goal**: Universal organization system for digital knowledge  

---

## 🚀 1. Active Projects (Short-Term Outcomes)
*Short-term efforts with a deadline and specific completion goal.*

- [ ] **Project A**: Launch Focusly Template Explorer (Deadline: Next Week)
- [ ] **Project B**: Refactor Workspace Header Layout (Deadline: Friday)

---

## 🎯 2. Areas of Responsibility (Ongoing Standards)
*Long-term standards that require continuous maintenance.*

- 💼 **Career & Code Quality**: Maintain 0 ESLint errors & strict TypeScript standards.
- 🧘 **Health & Energy**: 8 hours sleep, 30 min daily exercise.
- 💰 **Personal Finance**: Monthly budget audit & savings allocation.

---

## 📚 3. Resources (Topics & Interests)
*Information, guides, and inspiration for future reference.*

- 📘 **Web Architecture**: React modern state patterns, Server Components.
- 🎨 **UI/UX Inspiration**: Dark glassmorphic design systems, micro-animations.

---

## 📦 4. Archives (Inactive Items)
*Completed projects and inactive resources preserved for future audit.*

- [x] Initial Focusly Backend Deployment
- [x] Redis Cache Setup
`,
  },
  {
    id: 'okr-goals',
    title: 'OKRs & Quarterly Strategy',
    category: 'Product & Strategy',
    description:
      'Objectives & Key Results framework to set ambitious goals, measure progress, and track key initiatives.',
    estimatedTime: '15 min weekly',
    icon: <TargetIcon sx={{ color: '#f59e0b' }} />,
    tips: [
      'Objectives should be qualitative and inspiring.',
      'Key Results MUST be quantitative and measurable.',
      'Review Key Results every Monday during your weekly review.',
    ],
    content: `# ⚡ Quarterly OKRs: Q3 2026

> **Timeframe**: Q3 (July - September)  
> **Focus Theme**: Product Excellence & User Mastery  

---

## 🎯 Objective 1: Deliver World-Class Workspace & Note Experience
*Make Focusly the fastest, most intuitive personal productivity platform.*

### 📈 Key Results
- [ ] **KR 1.1**: Increase daily note creation by 40%.
- [ ] **KR 1.2**: Maintain 0 unhandled runtime errors in production.
- [ ] **KR 1.3**: Reduce workspace load time to under 200ms.

---

## 🎯 Objective 2: Master Personal Focus & Time Execution
*Help individual users eliminate distractions and achieve deep flow states.*

### 📈 Key Results
- [ ] **KR 2.1**: Complete 50 verified Focus Mode sessions per month.
- [ ] **KR 2.2**: Maintain a 5-day consecutive habit streak.

---

## 📋 High-Impact Initiatives
- [ ] Implement Live Markdown Template Explorer.
- [ ] Add AI Task Range Preview in Editor.
`,
  },
  {
    id: 'weekly-deep-work',
    title: 'Weekly Execution & Deep Work Planner',
    category: 'Productivity',
    description:
      'Prioritize tasks using the Eisenhower Matrix, schedule focus blocks, and run a weekly retrospective.',
    estimatedTime: '10 min Mondays',
    icon: <SpeedIcon sx={{ color: '#10b981' }} />,
    tips: [
      'Schedule deep work blocks during your peak energy hours.',
      'Keep Urgent + Important tasks to a maximum of 3 per day.',
      'Run the retrospective every Friday afternoon.',
    ],
    content: `# 📊 Weekly Execution & Deep Work Planner

> **Week Of**: [Date]  
> **Primary Focus**: [Main Priority of the Week]  

---

## 📌 1. Eisenhower Priority Matrix

### 🔥 Urgent & Important (Do First)
- [ ] Critical production bug fixes
- [ ] Key deliverable deadline

### 🎯 Important, Not Urgent (Schedule It - Deep Work)
- [ ] Architectural planning & refactoring
- [ ] Learning & skills development

---

## ⚡ 2. Daily Focus Allocation
| Day | Primary Focus Block | Secondary Tasks |
| :--- | :--- | :--- |
| **Monday** | Template Explorer Implementation | Code Review |
| **Tuesday** | Frontend Verification & Testing | Team Sync |
| **Wednesday** | Deep Work: Core Feature Build | Documentation |
| **Thursday** | UI Polishing & Accessibility Audit | Backlog Refinement |
| **Friday** | Weekly Retrospective & Planning | Bug Fixes |

---

## 🧘 3. Friday Retrospective
- **What was my biggest win this week?**
- **Where did I lose focus or get blocked?**
- **One adjustment for next week:**
`,
  },
  {
    id: 'feynman-learning',
    title: 'Feynman Learning & Study System',
    category: 'Systems',
    description:
      'Master complex concepts by explaining them simply, identifying knowledge gaps, and creating practical applications.',
    estimatedTime: '15 min per topic',
    icon: <LearnIcon sx={{ color: '#8b5cf6' }} />,
    tips: [
      'Rule 1: Explain the concept as if teaching a 10-year-old.',
      'Rule 2: Highlight jargon words and replace them with simple analogies.',
      'Rule 3: Test your understanding with a practical code example.',
    ],
    content: `# 🎓 Feynman Method: Mastering [Concept Name]

> **Topic**: [e.g., React Fiber Architecture / GraphQL Resolvers]  
> **Category**: Computer Science | System Design | Business  

---

## 💡 1. The Simple Explanation (ELI5)
*Explain the concept using plain language, zero jargon, and clear analogies.*

> Imagine [Concept] is like a [Simple Analogy]. When [Trigger happens], it automatically [Result]...

---

## 🔍 2. Identified Knowledge Gaps
*Where did you struggle while explaining? What parts felt fuzzy?*

- [ ] Gap 1: Need to clarify how memory allocation works during async calls.
- [ ] Gap 2: Understand exact edge case behavior when error occurs.

---

## 🧪 3. Practical Code / Applied Example
\`\`\`typescript
// Simplified demonstration of the concept
function demonstrateConcept(input: string): string {
  return \`Transformed: \${input}\`;
}
\`\`\`

---

## 🎯 4. Summary Takeaway
Write a single sentence summarizing the essence of this concept.
`,
  },
  {
    id: 'ivy-lee-daily-six',
    title: 'Ivy Lee Method: Daily Top 6',
    category: 'Productivity',
    description:
      "The 1918 method that made Charles Schwab's Bethlehem Steel legendary: rank your 6 most important tasks and work them in strict order, one at a time.",
    estimatedTime: '5 min nightly',
    icon: <ChecklistIcon sx={{ color: '#0ea5e9' }} />,
    tips: [
      "Write tomorrow's list at the end of today, while today's work is still fresh in mind.",
      'Never work on task #2 until task #1 is fully done — resist the urge to jump around.',
      "Unfinished tasks simply roll into tomorrow's new ranked list, no guilt required.",
    ],
    content: `# ✅ Ivy Lee Method: Daily Top 6

> **Method**: Ivy Lee Method (1918)  
> **Origin**: Devised for Charles Schwab, President of Bethlehem Steel  
> **Core Rule**: Never start task #2 until task #1 is complete.  

---

## 🌙 1. Tonight: Write Tomorrow's List
*At the end of each day, write down the 6 most important tasks for tomorrow — no more, no less.*

1. [ ] Task 1 (most important)
2. [ ] Task 2
3. [ ] Task 3
4. [ ] Task 4
5. [ ] Task 5
6. [ ] Task 6

---

## 🔢 2. Rank by True Importance
*Reorder the list above by actual impact, not by urgency or ease.*

- **Ask yourself**: "If I could only finish ONE of these tomorrow, which one matters most?"
- Renumber the list until it reflects real priority, not what feels easiest.

---

## ☀️ 3. Tomorrow: Work in Strict Order
- Start with Task 1. Do not move to Task 2 until Task 1 is finished.
- If a task isn't done by end of day, move it to tomorrow's new list of 6.
- Unfinished tasks don't carry shame — they simply get re-ranked.

---

## 📊 4. Why This Works (The Science)
- **Single-tasking beats multitasking**: research on task-switching shows constant switching can reduce effective output significantly.
- **Constrained choice reduces decision fatigue** — capping the list at 6 forces real prioritization instead of an endless backlog.
- **A written list off-loads working memory**, freeing attention for execution instead of remembering.

---

## 📝 Your Custom Additions
*Add your own tracking columns, a weekly summary, or personal ranking criteria below.*

-
`,
  },
  {
    id: 'pomodoro-sprint-log',
    title: 'Pomodoro Focus Sprint Log',
    category: 'Productivity',
    description:
      "Francesco Cirillo's time-boxed focus technique: 25-minute sprints with short breaks to fight procrastination and cognitive fatigue.",
    estimatedTime: '25 min per sprint',
    icon: <TimerIcon sx={{ color: '#ef4444' }} />,
    tips: [
      'Silence notifications completely during each 25-minute sprint — even one glance resets your focus.',
      'Log every interruption instead of acting on it immediately — review the pattern weekly.',
      'Always take the break, even if you feel unstoppable — breaks prevent the afternoon crash.',
    ],
    content: `# 🍅 Pomodoro Focus Sprint Log

> **Technique**: Pomodoro Technique (Francesco Cirillo, late 1980s)  
> **Cycle**: 25 min focus → 5 min break → repeat 4x → 15-30 min long break  

---

## 🎯 1. Today's Target Task
*Pick ONE task to run sprints against. Break bigger tasks into 25-minute chunks.*

**Task**: [What are you working on?]

---

## ⏱️ 2. Sprint Log

| Sprint # | Start Time | Focus Task | Interruptions | Completed (✓) |
| :--- | :--- | :--- | :--- | :--- |
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |
| 4 | | | | |

*After 4 sprints, take a 15-30 min long break.*

---

## 🚧 3. Interruption Log
*Write down every distraction the instant it happens, then return to the sprint. Reviewing this list weekly reveals your biggest focus leaks.*

-
-

---

## 📊 4. Why This Works (The Science)
- **Time-boxing reduces procrastination**: a fixed 25-minute container makes starting feel low-risk.
- **Scheduled breaks combat cognitive fatigue** — attention naturally dips after sustained focus without recovery.
- **Externalizing interruptions** (writing them down instead of acting on them) preserves your attention for the current sprint.

---

## 📝 Your Custom Additions
*Add your own sprint count goal, energy rating per sprint, or a reward system below.*

-
`,
  },
  {
    id: 'ultradian-energy-planner',
    title: 'Ultradian Rhythm Energy Planner',
    category: 'Productivity',
    description:
      "Based on Kleitman's rest-activity cycle research: plan deep work around your natural ~90-minute energy waves instead of the clock.",
    estimatedTime: '10 min setup',
    icon: <WavesIcon sx={{ color: '#06b6d4' }} />,
    tips: [
      "Track your energy for at least 2-3 days before planning — everyone's peak hours are different.",
      'Protect your top 1-2 peak blocks for your hardest, most important work only.',
      "Take the recovery break even when you don't feel tired — it's preventative, not reactive.",
    ],
    content: `# 🌊 Ultradian Rhythm Energy Planner

> **Basis**: Kleitman's Basic Rest-Activity Cycle & Ericsson's Deliberate Practice research  
> **Principle**: Manage your energy in ~90-minute waves, not just your calendar in hours  

---

## 🔋 1. Map Your Energy Curve
*Track your natural energy for 2-3 days to find your personal peaks and dips.*

| Time Block | Energy Level (Peak/Medium/Low) | Best Task Type |
| :--- | :--- | :--- |
| 6-8 AM | | |
| 8-10 AM | | |
| 10 AM-12 PM | | |
| 12-2 PM | | |
| 2-4 PM | | |
| 4-6 PM | | |
| Evening | | |

---

## 🧠 2. Match Work to Energy
- **Peak hours** → Deep work: strategy, writing, complex problem-solving.
- **Medium hours** → Shallow work: meetings, email, admin.
- **Low hours** → Rest, movement, or fully mechanical tasks.

---

## ⏳ 3. Today's 90-Minute Blocks
- [ ] **Block 1** ([time]): [Deep work task] → 15-20 min recovery break
- [ ] **Block 2** ([time]): [Deep work task] → 15-20 min recovery break
- [ ] **Block 3** ([time]): [Shallow work / admin]

---

## 📊 4. Why This Works (The Science)
- **Ultradian cycles**: the body naturally moves through ~90-120 minute cycles of alertness followed by a dip (Kleitman's BRAC research).
- **Deliberate practice studies** (Ericsson et al.) found elite performers cap focused sessions around 90 minutes with real recovery breaks — pushing past this hurts performance, not helps it.
- **"Manage energy, not time"** (Schwartz & Loehr) — the same hour is not equally productive; matching task difficulty to energy state compounds results.

---

## 📝 Your Custom Additions
*Add your own energy-tracking metrics (sleep, caffeine, mood) or a weekly energy trend chart below.*

-
`,
  },
  {
    id: 'gtd-weekly-review',
    title: 'GTD Weekly Capture & Clarify',
    category: 'Systems',
    description:
      "David Allen's 5-step system to capture every open loop, clarify next actions, and clear your mental RAM for real focus.",
    estimatedTime: '20-30 min weekly',
    icon: <InboxIcon sx={{ color: '#6366f1' }} />,
    tips: [
      "Capture first, clarify later — don't try to organize while you're still dumping your brain.",
      "A 'Next Action' must start with a verb and be genuinely doable in one sitting.",
      'Skipping the weekly review is the #1 reason GTD systems collapse — protect that time.',
    ],
    content: `# 📥 GTD Weekly Capture & Clarify

> **System**: Getting Things Done (David Allen)  
> **5 Steps**: Capture → Clarify → Organize → Reflect → Engage  

---

## 📬 1. Capture (Empty Every Inbox)
*Dump every open loop from your brain, email, notes app, and messages. Don't filter yet — just capture.*

-
-
-

---

## 🔍 2. Clarify (Process Each Item)
*For every item above, ask: "Is it actionable?"*

- **Not actionable** → Trash, Someday/Maybe, or Reference.
- **Actionable, < 2 min** → Do it right now.
- **Actionable, > 2 min** → Turn it into a Next Action or a Project.

| Item | Actionable? | Next Action | Project? |
| :--- | :--- | :--- | :--- |
| | | | |
| | | | |

---

## 🗂️ 3. Organize by Context
- **@Calls**:
- **@Computer**:
- **@Errands**:
- **@Waiting For**:

---

## 🔄 4. Weekly Review Checklist
- [ ] Inbox at zero (all items processed)
- [ ] All projects have at least one Next Action
- [ ] Calendar reviewed for the upcoming week
- [ ] Someday/Maybe list reviewed for anything ready to activate

---

## 📊 5. Why This Works (The Science)
- **Open loops consume working memory** — unresolved commitments create background cognitive load even when you're not actively thinking about them (the "Zeigarnik effect").
- **Externalizing tasks into a trusted system** frees mental bandwidth for actually doing the work instead of remembering it.
- **A weekly review ritual** prevents system decay — GTD only works if the "trusted system" stays trustworthy.

---

## 📝 Your Custom Additions
*Add your own contexts, project list, or someday/maybe backlog below.*

-
`,
  },
  {
    id: 'atomic-habits-tracker',
    title: 'Atomic Habits Tracker',
    category: 'Systems',
    description:
      "James Clear's habit-loop framework: stack tiny habits onto existing routines and track daily consistency for compounding 1% gains.",
    estimatedTime: '5 min daily',
    icon: <RepeatIcon sx={{ color: '#22c55e' }} />,
    tips: [
      'Make the habit embarrassingly small at first — size comes after consistency, not before.',
      'Stack new habits onto rock-solid existing ones (coffee, brushing teeth) for automatic triggering.',
      "If you miss a day, the only rule is: don't miss the next one too.",
    ],
    content: `# 🔁 Atomic Habits Tracker

> **Basis**: James Clear's "Atomic Habits" — the Habit Loop & the 1% Rule  
> **Formula**: Cue → Craving → Response → Reward  

---

## 🎯 1. Habit Stacking
*Attach your new habit to an existing one for automatic triggering.*

> After [CURRENT HABIT], I will [NEW HABIT].

**Example**: After I pour my morning coffee, I will write my 3 daily priorities.

- **My stack**: After ______________, I will ______________.

---

## 📅 2. Weekly Habit Grid
*Mark ✓ the moment you complete the habit — visible progress reinforces the loop.*

| Habit | Mon | Tue | Wed | Thu | Fri | Sat | Sun |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| | | | | | | | |
| | | | | | | | |
| | | | | | | | |

---

## 🌱 3. The 2-Minute Rule
*Make the habit so small it's impossible to say no. Scale up only after the habit sticks.*

- Instead of "Read 30 min" → start with "Read 1 page."
- Instead of "Work out 1 hour" → start with "Put on my shoes."

---

## 🛑 4. Never Miss Twice
*Missing once is an accident. Missing twice is the start of a new (bad) habit. If you slip, your only rule is: don't slip again tomorrow.*

---

## 📊 5. Why This Works (The Science)
- **Habit stacking** leverages existing neural pathways instead of building new ones from scratch.
- **The 1% rule**: tiny, consistent improvements compound dramatically over a year of daily practice.
- **Visible tracking creates a reinforcing feedback loop** — a core mechanism of the habit loop's "reward" stage.

---

## 📝 Your Custom Additions
*Add your own identity statement ("I am someone who..."), reward system, or accountability partner notes below.*

-
`,
  },
  {
    id: 'cornell-spaced-repetition',
    title: 'Cornell Notes & Spaced Repetition',
    category: 'Systems',
    description:
      "Walter Pauk's Cornell note-taking layout paired with a spaced-repetition review schedule based on Ebbinghaus's forgetting curve.",
    estimatedTime: '15 min per session',
    icon: <BookIcon sx={{ color: '#f97316' }} />,
    tips: [
      'Write the Summary within 24 hours — waiting even a day sharply increases forgetting.',
      'Cover the Notes column and try to recall from the Cue column alone before checking.',
      "Don't skip the later intervals (Day 16, Day 30) — that's where long-term retention is actually built.",
    ],
    content: `# 📖 Cornell Notes & Spaced Repetition

> **Method**: Cornell Note-Taking System (Walter Pauk, Cornell University)  
> **Retention Booster**: Spaced Repetition (based on Ebbinghaus's Forgetting Curve)  

---

## 🗒️ 1. Notes Layout

| 🔑 Cues / Questions | 📝 Notes |
| :--- | :--- |
| Key question or keyword | Detailed notes, examples, diagrams |
| | |
| | |

---

## ✍️ 2. Summary (Write This Within 24 Hours)
*In 2-3 sentences, summarize the core idea in your own words — this is where real learning happens.*

>

---

## 🔁 3. Spaced Repetition Review Schedule
*Review the Cue column only, and try to recall the Notes before checking. Check off each review.*

- [ ] Day 1 (same day)
- [ ] Day 3
- [ ] Day 7
- [ ] Day 16
- [ ] Day 30

---

## 📊 4. Why This Works (The Science)
- **The Cornell method's cue column** forces active recall instead of passive re-reading — retrieval practice is one of the most robust findings in learning science.
- **The Forgetting Curve** (Ebbinghaus) shows memory decays fast without review — spacing reviews at increasing intervals fights this decay efficiently.
- **A large meta-analysis (Cepeda et al., 2006)** confirmed distributed practice consistently beats cramming for long-term retention.

---

## 📝 Your Custom Additions
*Add your own flashcard prompts, related topics to link, or a personal mnemonic below.*

-
`,
  },
  {
    id: 'sprint-retro-4ls',
    title: 'Sprint Retrospective: 4Ls',
    category: 'Engineering',
    description:
      'A structured Agile retrospective format — Liked, Learned, Lacked, Longed For — that turns team reflection into real action items.',
    estimatedTime: '30-45 min per sprint',
    icon: <RetroIcon sx={{ color: '#14b8a6' }} />,
    tips: [
      'Have everyone write silently for 5 minutes before discussing — it prevents groupthink and anchoring.',
      'Cap action items at 2-3 per retro — more than that and none of them get done.',
      "Assign a real owner and due date to every action, or it won't survive the next sprint.",
    ],
    content: `# 🔄 Sprint Retrospective: 4Ls

> **Format**: Liked, Learned, Lacked, Longed For  
> **Cadence**: End of every sprint / iteration  

---

## 😀 1. Liked
*What went well this sprint? What should we keep doing?*

-
-

---

## 🧠 2. Learned
*What new insight, tool, or approach did the team discover?*

-
-

---

## 😕 3. Lacked
*What was missing — resources, clarity, communication?*

-
-

---

## 💭 4. Longed For
*What do we wish we had, even if it seems unrealistic?*

-
-

---

## ✅ 5. Action Items

| Action | Owner | Due Date |
| :--- | :--- | :--- |
| | | |
| | | |

---

## 📊 6. Why This Works (The Science)
- **Structured retrospectives outperform informal debriefs** — Agile/Scrum research links regular retros to measurably higher team performance over time.
- **The 4Ls format balances positive and negative reflection**, preventing the meeting from becoming purely a complaint session.
- **Grounded in Kolb's Experiential Learning Cycle**: reflection converts raw experience into actionable knowledge.

---

## 📝 Your Custom Additions
*Add your own metrics (velocity, bug count), team mood check, or celebration ritual below.*

-
`,
  },
  {
    id: 'kanban-wip-board',
    title: 'Kanban WIP-Limited Board',
    category: 'Engineering',
    description:
      "David J. Anderson's Kanban method with WIP limits grounded in Little's Law: less work-in-progress means faster delivery.",
    estimatedTime: '15 min setup',
    icon: <KanbanIcon sx={{ color: '#2563eb' }} />,
    tips: [
      'Set WIP limits low at first — you can raise them later, but starting too high defeats the purpose.',
      'When a column hits its limit, swarm to unblock it before pulling in new work.',
      'Review blocked items daily — an aging card is a bigger risk than an empty column.',
    ],
    content: `# 🗂️ Kanban WIP-Limited Board

> **Method**: Kanban (David J. Anderson) + Lean/Toyota Production System principles  
> **Law**: Little's Law — Cycle Time = WIP ÷ Throughput  

---

## 📋 1. Board Columns & WIP Limits

| Backlog | To Do (max 3) | In Progress (max 2) | Review (max 2) | Done |
| :--- | :--- | :--- | :--- | :--- |
| | | | | |
| | | | | |
| | | | | |

---

## 🚦 2. WIP Limit Rules
- If a column is at its limit, **finish something before starting something new.**
- A blocked task doesn't get a pass — swarm on it or pull it back, don't just add more WIP.

---

## 📈 3. This Week's Flow Metrics
- **Throughput** (items completed):
- **Average Cycle Time**:
- **Blocked items & why**:

---

## 📊 4. Why This Works (The Science)
- **Little's Law** proves mathematically that reducing Work-In-Progress reduces cycle time for a given throughput — less WIP means faster delivery, not less output.
- **Context-switching costs**: research on task-switching shows each additional concurrent task adds real overhead — WIP limits force single-piece flow.
- **Visualizing work** surfaces bottlenecks immediately instead of discovering them at the deadline.

---

## 📝 Your Custom Additions
*Add your own swimlanes (by project, priority, or person), aging-item alerts, or a blocked-flag column below.*

-
`,
  },
  {
    id: 'premortem-risk-analysis',
    title: 'Pre-Mortem Risk Analysis',
    category: 'Product & Strategy',
    description:
      "Gary Klein's HBR-published technique: imagine the project has already failed to surface far more risks before they happen.",
    estimatedTime: '30-45 min per project',
    icon: <RiskIcon sx={{ color: '#dc2626' }} />,
    tips: [
      'Have each person write their failure causes silently first, then share — this avoids anchoring on the loudest voice.',
      'Focus on causes within your control, not just external bad luck.',
      'Revisit this doc mid-project — check which warning signals actually showed up.',
    ],
    content: `# ⚠️ Pre-Mortem Risk Analysis

> **Method**: Project Pre-Mortem (Gary Klein, Harvard Business Review, 2007)  
> **Premise**: Imagine the project has already failed — then work backward to find out why.  

---

## 💀 1. Imagine Failure
*It's [X months] from now. This project has failed completely. Write the headline.*

> "[Project Name] failed because..."

---

## 🔍 2. Brainstorm Every Possible Cause
*Individually first, then combine — this avoids groupthink and anchoring on the first idea shared.*

| Potential Failure Cause | Likelihood (H/M/L) | Impact (H/M/L) | Mitigation |
| :--- | :--- | :--- | :--- |
| | | | |
| | | | |
| | | | |

---

## 🚨 3. Early Warning Signals
*What would we observe 2-4 weeks in that tells us we're heading toward this failure?*

-
-

---

## ✅ 4. Go / No-Go Decision
- [ ] Risks are acceptable — proceed as planned.
- [ ] Risks require plan changes before proceeding.
- [ ] Risk is too high — do not proceed without executive review.

---

## 📊 5. Why This Works (The Science)
- **Prospective hindsight**: Klein's research found that assuming failure has already happened significantly increases the number of risks people identify compared to standard risk brainstorming.
- **Counters optimism bias and groupthink** — it's psychologically easier to critique a "failed" project than to voice doubts about a project everyone is currently excited about.
- **Cheap insurance**: a 30-45 minute exercise can surface risks that would otherwise cost weeks or months to discover mid-project.

---

## 📝 Your Custom Additions
*Add your own risk-scoring model, stakeholder sign-off log, or contingency budget below.*

-
`,
  },
  {
    id: 'one-on-one-sbi-feedback',
    title: '1:1 Feedback Notes: SBI Model',
    category: 'Product & Strategy',
    description:
      "The Center for Creative Leadership's Situation-Behavior-Impact model for specific, low-defensiveness feedback conversations.",
    estimatedTime: '10 min per 1:1',
    icon: <FeedbackIcon sx={{ color: '#a855f7' }} />,
    tips: [
      "Stick to Situation-Behavior-Impact and skip labels like 'lazy' or 'unprofessional' entirely.",
      'Deliver feedback close to the event — specificity fades fast with time.',
      'Always end on a clear, mutually agreed follow-up commitment, not just a discussion.',
    ],
    content: `# 💬 1:1 Feedback Notes: SBI Model

> **Framework**: Situation-Behavior-Impact (Center for Creative Leadership)  
> **Goal**: Specific, evidence-based feedback that reduces defensiveness  

---

## 📍 1. Situation
*When and where did this happen? Be specific — not "you always..." but "in yesterday's standup..."*

>

---

## 🎬 2. Behavior
*What did you actually observe — facts, not interpretations or labels.*

>

---

## 🌊 3. Impact
*What was the effect — on the team, the project, or you personally?*

>

---

## 🗣️ 4. Feedback Log

| Date | Situation | Feedback Given | Follow-up Committed |
| :--- | :--- | :--- | :--- |
| | | | |
| | | | |

---

## ✅ 5. Follow-Up Commitments
- [ ]
- [ ]

---

## 📊 6. Why This Works (The Science)
- **SBI structures feedback around observable facts**, not character judgments — this is a core reason it's taught at the Center for Creative Leadership as a lower-defensiveness feedback model.
- **Specificity beats generality**: vague feedback ("be more proactive") is far less actionable than a concrete Situation-Behavior-Impact statement.
- **Logging feedback over time** turns one-off comments into visible patterns, which is far more persuasive than a single incident.

---

## 📝 Your Custom Additions
*Add your own recognition log, career growth notes, or goal check-ins below.*

-
`,
  },
];

export interface TemplatesModalProps {
  open: boolean;
  onClose: () => void;
  projects?: ProjectGroupTypes[];
  selectedGroupId?: string | null;
  onSelectTemplate: (title: string, content: string, groupId?: string) => void;
}

const escapeHtml = (text: string): string =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const renderInline = (raw: string): string => {
  let text = escapeHtml(raw);
  text = text.replace(/`([^`]+?)`/g, '<code class="md-inline-code">$1</code>');
  text = text.replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em>$1</em>');
  text = text.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener" class="md-link">$1</a>',
  );
  return text;
};

const renderMarkdownToHtml = (markdown: string): string => {
  const lines = markdown.split('\n');
  let html = '';
  let inCodeBlock = false;
  let codeContent = '';
  let inTable = false;
  let tableHeader: string[] = [];
  let tableRows: string[][] = [];

  const flushTable = () => {
    if (!inTable) return;
    html += '<div class="md-table-wrapper"><table class="md-table"><thead><tr>';
    tableHeader.forEach((cell) => {
      html += `<th>${renderInline(cell)}</th>`;
    });
    html += '</tr></thead><tbody>';
    tableRows.forEach((row) => {
      html += '<tr>';
      row.forEach((cell) => {
        html += `<td>${renderInline(cell)}</td>`;
      });
      html += '</tr>';
    });
    html += '</tbody></table></div>';
    inTable = false;
    tableHeader = [];
    tableRows = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code blocks
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        html += `<pre class="md-code-block"><code>${escapeHtml(codeContent.trim())}</code></pre>`;
        codeContent = '';
        inCodeBlock = false;
      } else {
        flushTable();
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeContent += line + '\n';
      continue;
    }

    // Tables
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      const cells = line
        .trim()
        .slice(1, -1)
        .split('|')
        .map((c) => c.trim());

      if (cells.every((c) => /^:?-+:?$/.test(c))) {
        continue;
      }

      if (!inTable) {
        inTable = true;
        tableHeader = cells;
      } else {
        tableRows.push(cells);
      }
      continue;
    } else if (inTable) {
      flushTable();
    }

    // Horizontal Rule
    if (line.trim() === '---' || line.trim() === '***') {
      html += '<hr class="md-hr" />';
      continue;
    }

    // Headings
    if (line.startsWith('# ')) {
      html += `<h1 class="md-h1">${renderInline(line.slice(2))}</h1>`;
      continue;
    }
    if (line.startsWith('## ')) {
      html += `<h2 class="md-h2">${renderInline(line.slice(3))}</h2>`;
      continue;
    }
    if (line.startsWith('### ')) {
      html += `<h3 class="md-h3">${renderInline(line.slice(4))}</h3>`;
      continue;
    }

    // Blockquotes
    if (line.startsWith('> ')) {
      html += `<blockquote class="md-blockquote">${renderInline(line.slice(2))}</blockquote>`;
      continue;
    }

    // Checkboxes
    if (line.trim().startsWith('- [ ] ')) {
      html += `<div class="md-checkbox"><span class="md-box"></span><span class="md-text">${renderInline(line.trim().slice(6))}</span></div>`;
      continue;
    }
    if (line.trim().startsWith('- [x] ') || line.trim().startsWith('- [X] ')) {
      html += `<div class="md-checkbox checked"><span class="md-box checked">✓</span><span class="md-text checked">${renderInline(line.trim().slice(6))}</span></div>`;
      continue;
    }

    // Bullet lists
    if (line.trim().startsWith('- ')) {
      html += `<div class="md-bullet"><span class="md-dot">•</span><span class="md-text">${renderInline(line.trim().slice(2))}</span></div>`;
      continue;
    }

    // Numbered list
    const numMatch = line.trim().match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      html += `<div class="md-bullet"><span class="md-num">${numMatch[1]}.</span><span class="md-text">${renderInline(numMatch[2])}</span></div>`;
      continue;
    }

    // Paragraph
    if (line.trim()) {
      html += `<p class="md-p">${renderInline(line)}</p>`;
    }
  }

  flushTable();

  return html;
};

export const TemplatesModal: React.FC<TemplatesModalProps> = ({
  open,
  onClose,
  projects = [],
  selectedGroupId = null,
  onSelectTemplate,
}) => {
  const { t: translate } = useTranslation();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    PROFESSIONAL_TEMPLATES[0].id,
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [targetGroupId, setTargetGroupId] = useState<string>(
    selectedGroupId || 'unassigned',
  );

  const categories = [
    'All',
    'Product & Strategy',
    'Engineering',
    'Productivity',
    'Systems',
  ];

  const categoryLabels: Record<string, string> = {
    All: translate('templatesModal.categories.all'),
    'Product & Strategy': translate(
      'templatesModal.categories.productStrategy',
    ),
    Engineering: translate('templatesModal.categories.engineering'),
    Productivity: translate('templatesModal.categories.productivity'),
    Systems: translate('templatesModal.categories.systems'),
  };

  const filteredTemplates = useMemo(() => {
    return PROFESSIONAL_TEMPLATES.filter((t) => {
      const matchesCategory =
        selectedCategory === 'All' || t.category === selectedCategory;
      const matchesSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const activeTemplate = useMemo(() => {
    return (
      PROFESSIONAL_TEMPLATES.find((t) => t.id === selectedTemplateId) ||
      PROFESSIONAL_TEMPLATES[0]
    );
  }, [selectedTemplateId]);

  const renderedHtml = useMemo(() => {
    return renderMarkdownToHtml(activeTemplate.content);
  }, [activeTemplate.content]);

  const handleApplyTemplate = () => {
    const finalGroupId =
      targetGroupId === 'unassigned' ? undefined : targetGroupId;
    onSelectTemplate(
      activeTemplate.title,
      activeTemplate.content,
      finalGroupId,
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          bgcolor: 'background.paper',
          backgroundImage: 'none',
          height: '85vh',
          maxHeight: '900px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: isDark
            ? '0 24px 72px rgba(0,0,0,0.7)'
            : '0 24px 72px rgba(0,0,0,0.15)',
        },
      }}
    >
      {/* Modal Header */}
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 2,
          px: 3,
          borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
        }}
      >
        <Box display="flex" alignItems="center" gap={1.5}>
          <TemplateIcon sx={{ color: 'primary.main', fontSize: 26 }} />
          <Box>
            <Typography variant="h6" fontWeight={700} lineHeight={1.2}>
              {translate('templatesModal.title')}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {translate('templatesModal.subtitle')}
            </Typography>
          </Box>
        </Box>
        <IconButton
          size="small"
          onClick={onClose}
          sx={{ color: 'text.secondary' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Main Split Content Area */}
      <DialogContent
        sx={{ p: 0, display: 'flex', flex: 1, overflow: 'hidden' }}
      >
        {/* Left Explorer Pane */}
        <Box
          sx={{
            width: { xs: '100%', md: '360px' },
            borderRight: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
            display: 'flex',
            flexDirection: 'column',
            bgcolor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.01)',
          }}
        >
          {/* Search & Category Filter Header */}
          <Box sx={{ p: 2, pb: 1.5 }}>
            <TextField
              placeholder={translate('templatesModal.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon
                      sx={{ color: 'text.secondary', fontSize: 18 }}
                    />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 1.5 }}
            />

            {/* Category Filter Chips */}
            <Box sx={{ display: 'flex', gap: 0.8, overflowX: 'auto', pb: 0.5 }}>
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <Chip
                    key={cat}
                    label={categoryLabels[cat] || cat}
                    size="small"
                    onClick={() => setSelectedCategory(cat)}
                    sx={{
                      fontSize: '11px',
                      fontWeight: isSelected ? 700 : 500,
                      bgcolor: isSelected
                        ? 'primary.main'
                        : isDark
                          ? 'rgba(255,255,255,0.06)'
                          : 'rgba(0,0,0,0.05)',
                      color: isSelected ? '#ffffff' : 'text.secondary',
                      '&:hover': {
                        bgcolor: isSelected
                          ? 'primary.main'
                          : isDark
                            ? 'rgba(255,255,255,0.1)'
                            : 'rgba(0,0,0,0.08)',
                      },
                    }}
                  />
                );
              })}
            </Box>
          </Box>

          <Divider sx={{ opacity: 0.6 }} />

          {/* Template Item List */}
          <Box sx={{ flex: 1, overflowY: 'auto', p: 1.5 }}>
            {filteredTemplates.map((tmpl) => {
              const isSelected = activeTemplate.id === tmpl.id;
              return (
                <Box
                  key={tmpl.id}
                  onClick={() => setSelectedTemplateId(tmpl.id)}
                  sx={{
                    p: 1.8,
                    mb: 1,
                    borderRadius: '10px',
                    cursor: 'pointer',
                    border: `1px solid ${
                      isSelected
                        ? theme.palette.primary.main
                        : isDark
                          ? 'rgba(255,255,255,0.06)'
                          : 'rgba(0,0,0,0.06)'
                    }`,
                    bgcolor: isSelected
                      ? isDark
                        ? 'rgba(124, 58, 237, 0.12)'
                        : 'rgba(124, 58, 237, 0.05)'
                      : isDark
                        ? 'rgba(255,255,255,0.02)'
                        : '#ffffff',
                    transition: 'all 0.15s ease',
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                    },
                  }}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={0.8}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      {tmpl.icon}
                      <Typography
                        variant="subtitle2"
                        fontWeight={700}
                        fontSize="13px"
                      >
                        {tmpl.title}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      fontSize: '12px',
                      lineHeight: 1.3,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {tmpl.description}
                  </Typography>

                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mt={1.2}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: '10px' }}
                    >
                      ⏱️ {tmpl.estimatedTime}
                    </Typography>
                    {isSelected && (
                      <Chip
                        icon={<EyeIcon sx={{ fontSize: '12px !important' }} />}
                        label={translate('templatesModal.previewing')}
                        size="small"
                        color="primary"
                        sx={{
                          height: '18px',
                          fontSize: '10px',
                          fontWeight: 700,
                        }}
                      />
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Right Live Preview Pane */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            bgcolor: 'background.paper',
            overflow: 'hidden',
          }}
        >
          {/* Active Template Action Header with Project Target Selector */}
          <Box
            sx={{
              p: 2.5,
              borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
              bgcolor: isDark ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.01)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            <Box>
              <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                <Chip
                  label={
                    categoryLabels[activeTemplate.category] ||
                    activeTemplate.category
                  }
                  size="small"
                  sx={{
                    fontSize: '10px',
                    fontWeight: 700,
                    height: '20px',
                    bgcolor: 'rgba(124, 58, 237, 0.1)',
                    color: theme.palette.primary.main,
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  {translate('templatesModal.liveRenderedPreview')}
                </Typography>
              </Box>
              <Typography variant="h6" fontWeight={800} fontSize="17px">
                {activeTemplate.title}
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={1.5}>
              {/* Project Target Selector */}
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <Select
                  value={targetGroupId}
                  onChange={(e) => setTargetGroupId(e.target.value)}
                  displayEmpty
                  size="small"
                  sx={{
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 600,
                    bgcolor: isDark
                      ? 'rgba(255,255,255,0.05)'
                      : 'rgba(0,0,0,0.03)',
                  }}
                >
                  <MenuItem value="unassigned" sx={{ fontSize: '13px' }}>
                    <em>{translate('templatesModal.generalUnassigned')}</em>
                  </MenuItem>
                  {projects.map((p) => (
                    <MenuItem key={p.id} value={p.id} sx={{ fontSize: '13px' }}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <FolderIcon
                          sx={{
                            fontSize: 16,
                            color: p.color || 'primary.main',
                          }}
                        />
                        <span>{p.name}</span>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleApplyTemplate}
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 700,
                  px: 3,
                  py: 1,
                  boxShadow: 'none',
                  bgcolor: isDark ? '#ffffff' : '#1c1c1a',
                  color: isDark ? '#0b0f14' : '#ffffff',
                  '&:hover': {
                    bgcolor: isDark
                      ? 'rgba(255,255,255,0.9)'
                      : 'rgba(28,28,26,0.9)',
                  },
                }}
              >
                {translate('templatesModal.useTemplate')}
              </Button>
            </Box>
          </Box>

          {/* Template Implementation Tips Callout */}
          {activeTemplate.tips && activeTemplate.tips.length > 0 && (
            <Box
              sx={{
                px: 2.5,
                py: 1.5,
                bgcolor: isDark
                  ? 'rgba(59, 130, 246, 0.08)'
                  : 'rgba(59, 130, 246, 0.04)',
                borderBottom: `1px solid ${isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.1)'}`,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <BrainIcon sx={{ fontSize: 18, color: '#3b82f6' }} />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: '12px' }}
              >
                💡 <strong>{translate('templatesModal.proTip')}</strong>:{' '}
                {activeTemplate.tips[0]}
              </Typography>
            </Box>
          )}

          {/* Scrollable Rendered HTML Markdown Live Preview Container */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 4,
              bgcolor: isDark ? '#090d14' : '#ffffff',
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '14px',
              lineHeight: 1.6,
              color: 'text.primary',

              '& .md-h1': {
                fontSize: '22px',
                fontWeight: 800,
                color: theme.palette.primary.main,
                mb: 1.5,
                mt: 0.5,
              },
              '& .md-h2': {
                fontSize: '16px',
                fontWeight: 700,
                color: 'text.primary',
                mt: 3,
                mb: 1,
                pb: 0.5,
                borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
              },
              '& .md-h3': {
                fontSize: '14px',
                fontWeight: 700,
                color: 'text.secondary',
                mt: 2,
                mb: 0.8,
              },
              '& .md-blockquote': {
                m: 0,
                mb: 2,
                p: '10px 16px',
                bgcolor: isDark
                  ? 'rgba(124, 58, 237, 0.1)'
                  : 'rgba(124, 58, 237, 0.05)',
                borderLeft: `4px solid ${theme.palette.primary.main}`,
                borderRadius: '6px',
                color: 'text.primary',
                fontSize: '13px',
              },
              '& .md-code-block': {
                bgcolor: isDark ? '#0f172a' : '#1e293b',
                color: '#38bdf8',
                p: 2,
                borderRadius: '8px',
                overflowX: 'auto',
                fontFamily: 'monospace',
                fontSize: '12.5px',
                my: 2,
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              },
              '& .md-table-wrapper': {
                overflowX: 'auto',
                my: 2,
                borderRadius: '8px',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              },
              '& .md-table': {
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '13px',
              },
              '& .md-table th': {
                bgcolor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                textAlign: 'left',
                p: '10px 14px',
                fontWeight: 700,
                borderBottom: `2px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              },
              '& .md-table td': {
                p: '10px 14px',
                borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
              },
              '& .md-checkbox': {
                display: 'flex',
                alignItems: 'center',
                gap: 1.2,
                my: 0.6,
              },
              '& .md-box': {
                width: 16,
                height: 16,
                borderRadius: '4px',
                border: `1.8px solid ${theme.palette.text.secondary}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                flexShrink: 0,
              },
              '& .md-box.checked': {
                bgcolor: 'success.main',
                borderColor: 'success.main',
                color: '#ffffff',
                fontWeight: 'bold',
              },
              '& .md-text.checked': {
                textDecoration: 'line-through',
                opacity: 0.6,
              },
              '& .md-bullet': {
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1.2,
                my: 0.5,
                pl: 0.5,
              },
              '& .md-dot': {
                color: theme.palette.primary.main,
                fontSize: '16px',
                lineHeight: 1,
                mt: '3px',
              },
              '& .md-num': {
                color: theme.palette.primary.main,
                fontWeight: 700,
                fontSize: '13px',
              },
              '& .md-inline-code': {
                bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
                px: '6px',
                py: '2px',
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '12px',
                color: theme.palette.primary.main,
              },
              '& .md-hr': {
                my: 2.5,
                border: 'none',
                borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
              },
              '& .md-p': {
                my: 0.8,
              },
            }}
            dangerouslySetInnerHTML={{ __html: renderedHtml }}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};
