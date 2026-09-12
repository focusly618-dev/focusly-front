import type { ProjectTaskItemData } from './projectTasks.types';

// Mock data strictly matching the provided design screenshot
export const MOCK_PROJECT_TASKS: ProjectTaskItemData[] = [
  // ── In Progress (3) ──
  {
    id: 'task-1',
    title: 'Implement biometric authe...',
    status: 'in_progress',
    tag: 'Security',
    priority: 'Critical',
    duration: '1h 05m',
    dueDate: 'Today',
    dueDateHighlight: 'today',
    assignee: {
      name: 'Sotelo U.',
      initials: 'SU',
      color: '#ea580c',
    },
    subtasks: [
      {
        id: 'sub-1',
        title: 'FaceID / TouchID permissions handler',
        completed: true,
        duration: '15m',
        dueBadge: 'Completed',
      },
      {
        id: 'sub-2',
        title: 'Fallback 6-digit PIN keyboard layout',
        completed: false,
        duration: '30m',
        dueBadge: 'Today',
      },
      {
        id: 'sub-3',
        title: 'Biometric error shake animation',
        completed: false,
        duration: '20m',
        dueBadge: 'Tomorrow',
      },
    ],
  },
  {
    id: 'task-2',
    title: 'Offline state sync with Optimistic UI updates',
    status: 'in_progress',
    tag: 'Sync Engine',
    priority: 'High',
    duration: '2h 45m',
    dueDate: 'Tomorrow',
    dueDateHighlight: 'tomorrow',
    assignee: {
      name: 'Ethan Ross',
      initials: 'ER',
      color: '#0d9488',
    },
  },
  {
    id: 'task-3',
    title: 'Custom pull-to-refresh haptic curve calibration',
    status: 'in_progress',
    tag: 'UX Polish',
    priority: 'Medium',
    duration: '45m',
    dueDate: 'Sep 18',
    dueDateHighlight: 'normal',
    assignee: {
      name: 'David Kim',
      initials: 'DK',
      color: '#64748b',
    },
  },

  // ── To Do (5) ──
  {
    id: 'task-4',
    title: 'Migrate CoreData models to WatermelonDB schema',
    status: 'todo',
    tag: 'Database',
    priority: 'Critical',
    duration: '3h 00m',
    dueDate: 'Sep 20',
    dueDateHighlight: 'normal',
    assignee: {
      name: 'Sotelo U.',
      initials: 'SU',
      color: '#ea580c',
    },
  },
  {
    id: 'task-5',
    title: 'WidgetKit extension for iOS 17 Lock Screen tasks',
    status: 'todo',
    tag: 'iOS Widgets',
    priority: 'Medium',
    duration: '1h 45m',
    dueDate: 'Sep 22',
    dueDateHighlight: 'normal',
    assignee: {
      name: 'Ethan Ross',
      initials: 'ER',
      color: '#0d9488',
    },
  },
  {
    id: 'task-6',
    title: 'Deep link router parsing for task share invitations',
    status: 'todo',
    tag: 'Navigation',
    priority: 'Low',
    duration: '50m',
    dueDate: 'Sep 24',
    dueDateHighlight: 'normal',
    assignee: {
      name: 'David Kim',
      initials: 'DK',
      color: '#64748b',
    },
  },

  // ── Completed (12) ──
  {
    id: 'task-7',
    title: 'App icon set generation & asset catalog configuration',
    status: 'completed',
    tag: 'Design',
    priority: 'Low',
    duration: '1h 15m',
    completed: true,
    dueDate: 'Sep 10',
    assignee: {
      name: 'Sotelo U.',
      initials: 'SU',
      color: '#ea580c',
    },
  },
];
