/**
 * UNIFIED CALENDAR EVENT MAPPER
 *
 * This utility converts different entity types (ExternalCalendarEvent, Meeting, Task, WorkBlock)
 * into a unified format that the calendar component can display consistently.
 */

import type {
  ExternalCalendarEvent,
  Meeting,
  Task,
  WorkBlock,
  UnifiedCalendarEvent,
} from '@/redux/scheduling/scheduling.types';

/**
 * Convert an ExternalCalendarEvent to a UnifiedCalendarEvent.
 */
export function mapExternalEventToUnified(
  event: ExternalCalendarEvent,
): UnifiedCalendarEvent {
  return {
    id: event.id,
    type: 'external_event',
    title: event.title,
    start: event.start,
    end: event.end,
    allDay: event.isAllDay,
    data: event,
    isHardConstraint: true,
    isFlexible: false,
    color: '#60A5FA', // Blue for external events
    borderColor: '#3B82F6',
  };
}

/**
 * Convert a Meeting to a UnifiedCalendarEvent.
 */
export function mapMeetingToUnified(meeting: Meeting): UnifiedCalendarEvent {
  return {
    id: meeting.id,
    type: 'meeting',
    title: meeting.title,
    start: meeting.start,
    end: meeting.end,
    allDay: meeting.isAllDay,
    data: meeting,
    isHardConstraint: meeting.isLocked,
    isFlexible: !meeting.isLocked,
    color: '#8B5CF6', // Purple for meetings
    borderColor: '#7C3AED',
  };
}

/**
 * Convert a Task to a UnifiedCalendarEvent.
 * Note: Tasks don't have explicit start/end times, so this is for display purposes only.
 * The actual scheduling is done via WorkBlocks.
 */
export function mapTaskToUnified(task: Task): UnifiedCalendarEvent {
  // For display, we might show the task at its deadline or estimated time
  const start = task.deadline || new Date();
  const end = new Date(start.getTime() + task.estimatedDuration * 60000);

  return {
    id: task.id,
    type: 'task',
    title: task.title,
    start,
    end,
    allDay: false,
    data: task,
    isHardConstraint: false,
    isFlexible: true,
    color: task.color || getPriorityColor(task.priority),
    borderColor: getPriorityBorderColor(task.priority),
  };
}

/**
 * Convert a WorkBlock to a UnifiedCalendarEvent.
 */
export function mapWorkBlockToUnified(
  workBlock: WorkBlock,
): UnifiedCalendarEvent {
  return {
    id: workBlock.id,
    type: 'work_block',
    title: workBlock.taskId ? `Work Block` : 'Break',
    start: workBlock.start,
    end: workBlock.end,
    allDay: false,
    data: workBlock,
    isHardConstraint: workBlock.isLocked,
    isFlexible: !workBlock.isLocked,
    color: getWorkBlockColor(workBlock.blockType),
    borderColor: getWorkBlockBorderColor(workBlock.blockType),
  };
}

/**
 * Convert any entity type to a UnifiedCalendarEvent.
 */
export function toUnifiedCalendarEvent(
  entity: ExternalCalendarEvent | Meeting | Task | WorkBlock,
): UnifiedCalendarEvent {
  if ('provider' in entity) {
    return mapExternalEventToUnified(entity as ExternalCalendarEvent);
  }
  if ('meetingType' in entity) {
    return mapMeetingToUnified(entity as Meeting);
  }
  if ('priority' in entity) {
    return mapTaskToUnified(entity as Task);
  }
  if ('blockType' in entity) {
    return mapWorkBlockToUnified(entity as WorkBlock);
  }

  // Fallback (shouldn't happen)
  throw new Error('Unknown entity type');
}

/**
 * Convert an array of mixed entities to UnifiedCalendarEvents.
 */
export function toUnifiedCalendarEvents(
  entities: (ExternalCalendarEvent | Meeting | Task | WorkBlock)[],
): UnifiedCalendarEvent[] {
  return entities.map(toUnifiedCalendarEvent);
}

/**
 * Get color based on task priority.
 */
function getPriorityColor(priority: Task['priority']): string {
  switch (priority) {
    case 'critical':
      return '#EF4444'; // Red
    case 'high':
      return '#F97316'; // Orange
    case 'medium':
      return '#EAB308'; // Yellow
    case 'low':
      return '#22C55E'; // Green
    default:
      return '#6B7280'; // Gray
  }
}

/**
 * Get border color based on task priority.
 */
function getPriorityBorderColor(priority: Task['priority']): string {
  switch (priority) {
    case 'critical':
      return '#DC2626';
    case 'high':
      return '#EA580C';
    case 'medium':
      return '#CA8A04';
    case 'low':
      return '#16A34A';
    default:
      return '#4B5563';
  }
}

/**
 * Get color based on work block type.
 */
function getWorkBlockColor(blockType: WorkBlock['blockType']): string {
  switch (blockType) {
    case 'focus':
      return '#3B82F6'; // Blue
    case 'break':
      return '#10B981'; // Green
    case 'buffer':
      return '#F59E0B'; // Amber
    case 'transition':
      return '#6B7280'; // Gray
    default:
      return '#6B7280';
  }
}

/**
 * Get border color based on work block type.
 */
function getWorkBlockBorderColor(blockType: WorkBlock['blockType']): string {
  switch (blockType) {
    case 'focus':
      return '#2563EB';
    case 'break':
      return '#059669';
    case 'buffer':
      return '#D97706';
    case 'transition':
      return '#4B5563';
    default:
      return '#4B5563';
  }
}

/**
 * Check if an event is a hard constraint (cannot be moved).
 */
export function isHardConstraint(event: UnifiedCalendarEvent): boolean {
  return event.isHardConstraint;
}

/**
 * Check if an event is flexible (can be moved by scheduler).
 */
export function isFlexible(event: UnifiedCalendarEvent): boolean {
  return event.isFlexible;
}

/**
 * Check if an event is a meeting.
 */
export function isMeeting(event: UnifiedCalendarEvent): boolean {
  return event.type === 'meeting';
}

/**
 * Check if an event is an external calendar event.
 */
export function isExternalEvent(event: UnifiedCalendarEvent): boolean {
  return event.type === 'external_event';
}

/**
 * Check if an event is a task.
 */
export function isTask(event: UnifiedCalendarEvent): boolean {
  return event.type === 'task';
}

/**
 * Check if an event is a work block.
 */
export function isWorkBlock(event: UnifiedCalendarEvent): boolean {
  return event.type === 'work_block';
}
