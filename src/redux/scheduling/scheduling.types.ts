/**
 * NEW SCHEDULING TYPES (Motion-style Architecture)
 *
 * This file defines the types for the new scheduling system.
 * These match the backend domain model.
 */

// ============================================================================
// 1. EXTERNAL CALENDAR EVENTS (Hard Constraints - Not Movable)
// ============================================================================

export interface ExternalCalendarEvent {
  id: string;
  provider: 'google' | 'outlook' | 'ical';
  providerEventId: string;

  title: string;
  description?: string;
  start: Date;
  end: Date;
  isAllDay: boolean;
  location?: string;

  conferenceData?: {
    type: 'google_meet' | 'zoom' | 'teams' | 'other';
    uri?: string;
    hangoutLink?: string;
  };

  attendees?: Array<{
    email: string;
    name?: string;
    responseStatus: 'accepted' | 'declined' | 'tentative' | 'needsAction';
    avatar?: string;
  }>;

  organizer?: {
    email: string;
    name?: string;
    isSelf: boolean;
  };

  recurrence?: string;
  source: 'external';
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// 2. MEETINGS (Hard Constraints - Not Movable)
// ============================================================================

export interface Meeting {
  id: string;
  userId: string;

  title: string;
  description?: string;
  start: Date;
  end: Date;
  isAllDay: boolean;
  location?: string;

  meetingType: 'in_person' | 'virtual' | 'hybrid';
  meetingUrl?: string;

  attendees: Array<{
    email: string;
    name?: string;
    responseStatus: 'accepted' | 'declined' | 'tentative' | 'needsAction';
    avatar?: string;
  }>;

  isLocked: boolean;
  isRecurring: boolean;
  recurrenceRule?: string;

  source: 'manual' | 'external' | 'synced';
  externalEventId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// 3. TASKS (Flexible Work - Movable)
// ============================================================================

export type TaskPriority = 'critical' | 'high' | 'medium' | 'low';
export type TaskUrgency =
  | 'immediate'
  | 'today'
  | 'this_week'
  | 'this_month'
  | 'flexible';
export type TaskStatus =
  | 'backlog'
  | 'planned'
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'cancelled';
export type PreferredTimeOfDay = 'morning' | 'afternoon' | 'evening' | 'any';
export type PreferredDay =
  | 'mon'
  | 'tue'
  | 'wed'
  | 'thu'
  | 'fri'
  | 'sat'
  | 'sun';

export interface Task {
  id: string;
  userId: string;

  title: string;
  description?: string;

  priority: TaskPriority;
  priorityValue: number;
  urgency: TaskUrgency;

  deadline?: Date;
  hardDeadline?: Date;
  estimatedDuration: number;

  isSplitable: boolean;
  minBlockDuration: number;
  maxBlockDuration?: number;
  preferredTimeOfDay?: PreferredTimeOfDay;
  preferredDays?: PreferredDay[];

  status: TaskStatus;

  dependsOnTaskIds: string[];
  blocksTaskIds: string[];

  category?: string;
  tags: string[];
  color?: string;
  source: 'manual' | 'ai_suggested';
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

// ============================================================================
// 4. WORK BLOCKS (Generated Time Blocks)
// ============================================================================

export type WorkBlockType = 'focus' | 'break' | 'buffer' | 'transition';

export interface WorkBlock {
  id: string;
  userId: string;
  taskId?: string;

  start: Date;
  end: Date;
  duration: number;

  blockType: WorkBlockType;

  isLocked: boolean;
  isGenerated: boolean;

  schedulingScore?: number;
  schedulingReason?: string;

  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// 5. SCHEDULING CONSTRAINTS (User Preferences)
// ============================================================================

export type SchedulingStrategy =
  | 'earliest_deadline'
  | 'priority_first'
  | 'balanced';

export interface SchedulingConstraints {
  userId: string;

  workingDays: PreferredDay[];
  workingHours: {
    start: string;
    end: string;
  };

  breakDuration: number;
  breakInterval: number;

  preferredFocusBlockDuration: number;
  minFocusBlockDuration: number;
  maxFocusBlockDuration: number;

  schedulingStrategy: SchedulingStrategy;
  allowSameDaySplitting: boolean;
  allowOvertime: boolean;

  goldenWindow?: {
    start: string;
    end: string;
  };

  updatedAt: Date;
}

// ============================================================================
// 6. SCHEDULING RESULT (Output from Scheduler)
// ============================================================================

export interface SchedulingResult {
  userId: string;
  scheduledAt: Date;

  scheduledTasks: Array<{
    taskId: string;
    workBlocks: WorkBlock[];
    status: 'scheduled' | 'partially_scheduled' | 'could_not_schedule';
    reason?: string;
  }>;

  unscheduledTasks: Array<{
    taskId: string;
    reason:
      | 'no_available_slots'
      | 'deadline_passed'
      | 'constraints_conflict'
      | 'insufficient_time';
    suggestedAction?: string;
  }>;

  conflicts: Array<{
    type: 'overlap' | 'deadline_conflict' | 'dependency_conflict';
    description: string;
    affectedTaskIds: string[];
  }>;

  totalTasksScheduled: number;
  totalWorkBlocksCreated: number;
  totalScheduledMinutes: number;
  schedulingEfficiency: number;
}

// ============================================================================
// 7. CALENDAR EVENT UNIFIED TYPE
// ============================================================================

/**
 * Unified type for calendar events that can be any of the above types.
 * This is what the calendar component will use.
 */
export type CalendarEventType =
  | { type: 'external_event'; data: ExternalCalendarEvent }
  | { type: 'meeting'; data: Meeting }
  | { type: 'task'; data: Task }
  | { type: 'work_block'; data: WorkBlock };

export interface UnifiedCalendarEvent {
  id: string;
  type: 'external_event' | 'meeting' | 'task' | 'work_block';
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  data: ExternalCalendarEvent | Meeting | Task | WorkBlock;

  // Computed properties for calendar display
  isHardConstraint: boolean; // Cannot be moved
  isFlexible: boolean; // Can be moved by scheduler
  color?: string;
  borderColor?: string;
}
