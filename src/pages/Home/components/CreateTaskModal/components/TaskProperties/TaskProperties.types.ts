import type { TaskStatus } from '@/redux/tasks/task.types';

export interface TaskPropertiesProps {
  status: TaskStatus;
  setStatusAnchor: (el: HTMLElement | null) => void;
  priority: string;
  setPriorityAnchor: (el: HTMLElement | null) => void;
  category: string;
  setCategoryAnchor: (el: HTMLElement | null) => void;
  currentDate: Date | null;
  setCurrentDate: (d: Date | null) => void;
  timeSlotDisplay: string;
  tags: string[];
  setTags: (t: string[]) => void;
  newTag: string;
  setNewTag: (v: string) => void;
  isAddingTag: boolean;
  setIsAddingTag: (v: boolean) => void;
  handleAddTag: () => void;
  duration: string;
  setDuration: (v: string) => void;
  realTime: string;
  setRealTime: (v: string) => void;
  handleTimerChange: (
    value: string,
    setter: (v: string) => void,
    setSuggestions: (s: string[]) => void,
    setAnchor: (el: HTMLDivElement | null) => void,
    target: HTMLDivElement,
  ) => void;
  durationSuggestions: string[];
  setDurationSuggestions: (s: string[]) => void;
  durationAnchor: HTMLDivElement | null;
  setDurationAnchor: (el: HTMLDivElement | null) => void;
  realTimeSuggestions: string[];
  setRealTimeSuggestions: (s: string[]) => void;
  realTimeAnchor: HTMLDivElement | null;
  setRealTimeAnchor: (el: HTMLDivElement | null) => void;
  errors?: { duration?: string };
}
