import type { Dispatch } from '@reduxjs/toolkit';
import { client } from '@/api/apollo';
import { incrementSyncVersion } from '@/redux/calendar/calendar.slice';

// Refreshing what's on screen after a change, once.
//
// A task change reaches this tab twice: the mutation's own answer, and the
// server's "schedule_updated" socket event about the same change (it goes to
// every tab of the user, this one included). Each used to refetch the lists,
// so every change fetched them twice. Now the tab that made the change
// refreshes, and the event is skipped when it arrives right after that.

/** Every query that lists tasks. */
export const TASK_QUERIES = [
  'GetTasksByUserPaginated',
  'GetTasksCalendar',
  'GetTasksTitles',
  'GetProjectTasks',
];
/** Workspace lists (they show their linked tasks). */
export const WORKSPACE_QUERIES = ['GetWorkspacesPaginated'];
/** Project folders (they count their documents). */
export const PROJECT_QUERIES = [
  'GetProjectGroups',
  'GetProjectGroupsPaginated',
];

/** A server event this soon after this tab's own refresh is about the same
 * change: the refresh already has it. */
export const ECHO_WINDOW_MS = 2000;

const lastLocalRefresh = new Map<string, number>();
let lastLocalCalendarSync = 0;

/** The names of the queries mounted right now (asking Apollo to refetch one
 * that isn't only warns). */
const activeQueryNames = () => {
  const names = new Set<string>();
  client.getObservableQueries('active').forEach((query) => {
    if (query.queryName) names.add(query.queryName);
  });
  return names;
};

/**
 * Refetches the named queries that are on screen, each with its own
 * variables. `fromServer`: a socket event, skipped for the queries this tab
 * refreshed itself a moment ago.
 */
export const refreshQueries = async (
  names: string[],
  { fromServer = false } = {},
): Promise<void> => {
  const now = Date.now();
  const active = activeQueryNames();
  const due = [...new Set(names)].filter(
    (name) =>
      active.has(name) &&
      !(fromServer && now - (lastLocalRefresh.get(name) ?? 0) < ECHO_WINDOW_MS),
  );
  if (!fromServer) names.forEach((name) => lastLocalRefresh.set(name, now));
  if (due.length === 0) return;
  await client.refetchQueries({ include: due });
};

/** Reloads the Google Calendar events (same rule as refreshQueries). */
export const requestCalendarSync = (
  dispatch: Dispatch,
  { fromServer = false } = {},
) => {
  const now = Date.now();
  if (fromServer && now - lastLocalCalendarSync < ECHO_WINDOW_MS) return;
  if (!fromServer) lastLocalCalendarSync = now;
  dispatch(incrementSyncVersion());
};

/** For tests. */
export const resetRefreshState = () => {
  lastLocalRefresh.clear();
  lastLocalCalendarSync = 0;
};
