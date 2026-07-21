export enum TaskBar {
  DailyPlan = 'DailyPlan',
  Tasks = 'Tasks',
  Workspace = 'Projects',
  AskAI = 'AskAI',
  Insights = 'Insights',
  Settings = 'Settings',
}
export interface SidebarProps {
  activeTab: TaskBar;
  changeStatusTab: (active: TaskBar, extraParams?: URLSearchParams) => void;
}
