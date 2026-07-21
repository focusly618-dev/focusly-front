import type { GoogleCalendarEvent } from '@/redux/calendar/calendar.types';
import type { Task } from '@/redux/tasks/task.types';

export interface ICalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resource?: Task | GoogleCalendarEvent;
  type: 'task' | 'event';
  overlapIndex?: number;
  provider?: string;
  isDraft?: boolean;
}

export interface CalendarEventProps {
  event: ICalendarEvent;
  title: string;
  continuesPrior?: boolean;
  continuesAfter?: boolean;
  localizer?: unknown;
  slotStart?: Date;
  slotEnd?: Date;
  onStartFocus?: (task: Task) => void;
  currentView?: string;
  onDeleteDraft?: (id: string) => void;
}

export interface UseCalendarContextMenuReturn {
  handleDuplicateTask: (task: Task) => Promise<void>;
  handleChangePriority: (
    taskId: string,
    priorityLevel: number,
  ) => Promise<void>;
  handleDeleteTask: (taskId: string) => Promise<void>;
  handleDeleteGoogleEvent: (eventId: string) => Promise<void>;
  handleContextMenu: (e: React.MouseEvent) => void;
  handleClose: () => void;
  onDuplicate: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  onPriorityChange: (e: React.MouseEvent, level: number) => void;
  handleOnStartFocus: (e: React.MouseEvent) => void;
  isMeeting: boolean;
  isShortEvent: boolean;
  startTime: string;
  currentPriority?: number;
  contextMenu: { mouseX: number; mouseY: number } | null;
  setContextMenu: (position: { mouseX: number; mouseY: number } | null) => void;
  isReadOnly?: boolean;
}
