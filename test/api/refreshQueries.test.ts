import { beforeEach, describe, expect, it, vi } from 'vitest';

const { client } = vi.hoisted(() => ({
  client: {
    getObservableQueries: vi.fn(),
    refetchQueries: vi.fn(),
  },
}));
vi.mock('@/api/apollo', () => ({ client }));

import {
  ECHO_WINDOW_MS,
  refreshQueries,
  requestCalendarSync,
  resetRefreshState,
} from '@/api/refreshQueries';

const onScreen = (...names: string[]) =>
  client.getObservableQueries.mockReturnValue(
    new Map(names.map((queryName, i) => [String(i), { queryName }])),
  );

describe('refreshQueries', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    resetRefreshState();
    client.refetchQueries.mockResolvedValue([]);
  });

  it('refetches only the queries on screen', async () => {
    onScreen('GetTasksByUserPaginated');
    await refreshQueries(['GetTasksByUserPaginated', 'GetProjectTasks']);
    expect(client.refetchQueries).toHaveBeenCalledWith({
      include: ['GetTasksByUserPaginated'],
    });
  });

  it('nothing on screen: no request', async () => {
    onScreen();
    await refreshQueries(['GetProjectTasks']);
    expect(client.refetchQueries).not.toHaveBeenCalled();
  });

  it("skips the server's echo of this tab's own change", async () => {
    onScreen('GetTasksByUserPaginated');
    await refreshQueries(['GetTasksByUserPaginated']);
    await refreshQueries(['GetTasksByUserPaginated'], { fromServer: true });
    expect(client.refetchQueries).toHaveBeenCalledTimes(1);
  });

  it('still follows server changes made later (another device)', async () => {
    onScreen('GetTasksByUserPaginated');
    await refreshQueries(['GetTasksByUserPaginated']);
    vi.advanceTimersByTime(ECHO_WINDOW_MS + 1);
    await refreshQueries(['GetTasksByUserPaginated'], { fromServer: true });
    expect(client.refetchQueries).toHaveBeenCalledTimes(2);
  });

  it("this tab's own changes always refetch (a plan's tasks one after another)", async () => {
    onScreen('GetTasksByUserPaginated');
    await refreshQueries(['GetTasksByUserPaginated']);
    await refreshQueries(['GetTasksByUserPaginated']);
    expect(client.refetchQueries).toHaveBeenCalledTimes(2);
  });

  it('the calendar reloads once for a change and its echo', () => {
    const dispatch = vi.fn();
    requestCalendarSync(dispatch);
    requestCalendarSync(dispatch, { fromServer: true });
    expect(dispatch).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(ECHO_WINDOW_MS + 1);
    requestCalendarSync(dispatch, { fromServer: true });
    expect(dispatch).toHaveBeenCalledTimes(2);
  });
});
