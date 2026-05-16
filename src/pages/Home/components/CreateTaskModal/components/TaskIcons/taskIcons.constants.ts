export const getStatusColor = (status: string | null): string => {
  switch (status) {
    case 'Todo':
      return 'text.secondary';
    case 'Planning':
      return 'info.main';
    case 'Scheduled':
      return '#8b5cf6';
    case 'Pending':
      return 'warning.main';
    case 'On Hold':
      return 'error.main';
    case 'Review':
      return '#06b6d4';
    case 'Done':
      return 'success.main';
    case 'Backlog':
      return 'text.secondary';
    case 'Archived':
      return '#4b5563';
    default:
      return 'primary.main';
  }
};

export const getCategoryColor = (category: string | null): string => {
  switch (category) {
    case 'General':
      return 'text.secondary';
    case 'Deep Work':
      return 'secondary.main';
    case 'Meeting':
      return 'info.main';
    case 'Admin':
      return 'text.secondary';
    case 'Design':
      return 'warning.main';
    case 'Development':
      return 'primary.main';
    case 'Marketing':
      return 'error.main';
    case 'Planning':
      return 'info.main';
    case 'Research':
      return 'secondary.main';
    case 'Learning':
      return 'warning.main';
    case 'Personal':
      return 'text.secondary';
    default:
      return 'text.secondary';
  }
};

export const getPriorityIconColor = (priority: string | null): string => {
  switch (priority) {
    case 'High':
      return 'error.main';
    case 'Med':
      return 'warning.main';
    case 'Low':
      return 'success.main';
    default:
      return 'inherit';
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
