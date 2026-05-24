export const getStatusColor = (status: string | null): string => {
  switch (status) {
    case 'Todo':
      return '#3b82f6';
    case 'Planning':
      return '#3b82f6';
    case 'Scheduled':
      return '#8b5cf6';
    case 'Pending':
      return '#f59e0b';
    case 'On Hold':
      return '#ef4444';
    case 'Review':
      return '#06b6d4';
    case 'Done':
      return '#22c55e';
    case 'Backlog':
      return '#6b7280';
    case 'Archived':
      return '#4b5563';
    default:
      return '#3b82f6';
  }
};

export const getCategoryColor = (category: string | null): string => {
  switch (category) {
    case 'General':
      return '#6b7280';
    case 'Deep Work':
      return '#8b5cf6';
    case 'Meeting':
      return '#3b82f6';
    case 'Admin':
      return '#6b7280';
    case 'Design':
      return '#f59e0b';
    case 'Development':
      return '#2563eb';
    case 'Marketing':
      return '#ef4444';
    case 'Planning':
      return '#3b82f6';
    case 'Research':
      return '#8b5cf6';
    case 'Learning':
      return '#f59e0b';
    case 'Personal':
      return '#ec4899';
    default:
      return '#6b7280';
  }
};

export const getPriorityIconColor = (priority: string | null): string => {
  switch (priority) {
    case 'High':
      return '#ef4444';
    case 'Med':
      return '#f59e0b';
    case 'Low':
      return '#22c55e';
    default:
      return '#6b7280';
  }
};

export const STATUS_LIST = [
  'Todo',
  'Planning',
  'Scheduled',
  'Pending',
  'On Hold',
  'Review',
  'Done',
  'Backlog',
  'Archived',
] as const;
export const PRIORITY_LIST = ['High', 'Med', 'Low', 'No priority'] as const;
export const CATEGORY_LIST = [
  'General',
  'Deep Work',
  'Meeting',
  'Admin',
  'Design',
  'Development',
  'Marketing',
  'Planning',
  'Research',
  'Learning',
  'Personal',
] as const;
