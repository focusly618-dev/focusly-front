import { TaskBar } from '@/pages/Home/components/Sidebar/types/Sidebar.types';

export interface OnboardingTourProps {
  activeTab: TaskBar;
  onTabChange: (tab: TaskBar) => void;
}
