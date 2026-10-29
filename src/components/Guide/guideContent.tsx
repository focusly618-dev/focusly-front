import type React from 'react';
import {
  CalendarAiFrame,
  CalendarAwaitedFrame,
  CalendarBlocksFrame,
  CalendarOverviewFrame,
} from './frames/calendarFrames';
import { CalendarKeysFrame, EditorKeysFrame } from './frames/shortcutFrames';
import {
  TasksAiFrame,
  TasksBoardFrame,
  TasksCreateFrame,
  TasksFilterFrame,
  TasksListsFrame,
} from './frames/tasksFrames';
import {
  WorkspacesCreateFrame,
  WorkspacesDocsFrame,
  WorkspacesFindFrame,
  WorkspacesLinkFrame,
  WorkspacesProjectsFrame,
} from './frames/workspaceFrames';
import {
  EditorAiFrame,
  EditorBlocksFrame,
  EditorCanvasFrame,
  EditorMarkdownFrame,
  EditorSidebarFrame,
} from './frames/editorFrames';
import {
  AskChatFrame,
  AskHistoryFrame,
  AskPlanFrame,
  AskSuggestionsFrame,
  InsightsActivityFrame,
  InsightsReportFrame,
  InsightsStatsFrame,
  InsightsTrendsFrame,
} from './frames/insightsAskAiFrames';

/** The parts of Focusly that each have their own guide. */
export type GuideSection =
  | 'calendar'
  | 'tasks'
  | 'workspaces'
  | 'editor'
  | 'insights'
  | 'askAi';

/** One page of a guide: its frame; its title and text live in the
 * translations, under guide.<section>.steps.<id>. */
export interface GuideStep {
  id: string;
  Frame: React.FC;
}

export const GUIDES: Record<GuideSection, GuideStep[]> = {
  calendar: [
    { id: 'overview', Frame: CalendarOverviewFrame },
    { id: 'blocks', Frame: CalendarBlocksFrame },
    { id: 'awaited', Frame: CalendarAwaitedFrame },
    { id: 'ai', Frame: CalendarAiFrame },
    { id: 'keys', Frame: CalendarKeysFrame },
  ],
  tasks: [
    { id: 'lists', Frame: TasksListsFrame },
    { id: 'create', Frame: TasksCreateFrame },
    { id: 'board', Frame: TasksBoardFrame },
    { id: 'find', Frame: TasksFilterFrame },
    { id: 'ai', Frame: TasksAiFrame },
  ],
  workspaces: [
    { id: 'docs', Frame: WorkspacesDocsFrame },
    { id: 'projects', Frame: WorkspacesProjectsFrame },
    { id: 'create', Frame: WorkspacesCreateFrame },
    { id: 'link', Frame: WorkspacesLinkFrame },
    { id: 'find', Frame: WorkspacesFindFrame },
  ],
  editor: [
    { id: 'markdown', Frame: EditorMarkdownFrame },
    { id: 'blocks', Frame: EditorBlocksFrame },
    { id: 'ai', Frame: EditorAiFrame },
    { id: 'canvas', Frame: EditorCanvasFrame },
    { id: 'sidebar', Frame: EditorSidebarFrame },
    { id: 'keys', Frame: EditorKeysFrame },
  ],
  insights: [
    { id: 'stats', Frame: InsightsStatsFrame },
    { id: 'trends', Frame: InsightsTrendsFrame },
    { id: 'activity', Frame: InsightsActivityFrame },
    { id: 'report', Frame: InsightsReportFrame },
  ],
  askAi: [
    { id: 'chat', Frame: AskChatFrame },
    { id: 'suggestions', Frame: AskSuggestionsFrame },
    { id: 'plan', Frame: AskPlanFrame },
    { id: 'history', Frame: AskHistoryFrame },
  ],
};
