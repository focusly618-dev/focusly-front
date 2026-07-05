import { useMemo, useState, useEffect, useRef } from 'react';
import { useQuery } from '@apollo/client';
import { GET_INSIGHTS } from './Insights.graphql';
import { useAppSelector } from '@/redux/hooks';
import type { InsightsData } from './useInsights.types';
import {
  FILTERS,
  DEFAULT_STATS,
  calculatePeriodLabel,
} from './useInsights.utils';

export const useInsights = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [filter, setFilter] = useState('Weekly');
  const [baseDate, setBaseDate] = useState<string | null>(null);
  const [localCache, setLocalCache] = useState<Record<string, InsightsData>>(
    {},
  );
  const [lastData, setLastData] = useState<InsightsData | null>(null);

  const userId = user?.id || '';

  const handleSetFilter = (newFilter: string) => {
    setFilter(newFilter);
    setBaseDate(null);
  };

  // Load cache from localStorage on mount or user change
  useEffect(() => {
    if (!userId) return;
    const expectedLengths: Record<string, number> = {
      Daily: 24,
      Weekly: 7,
      Monthly: 30,
    };
    const loadedCache: Record<string, InsightsData> = {};
    for (const f of FILTERS) {
      const cached = localStorage.getItem(`focusly_insights_${userId}_${f}`);
      if (cached) {
        try {
          const parsedContainer = JSON.parse(cached);
          const data =
            parsedContainer && parsedContainer.data
              ? parsedContainer.data
              : (parsedContainer as InsightsData);
          const updatedAt =
            parsedContainer && parsedContainer.updatedAt
              ? parsedContainer.updatedAt
              : 0;

          // Expiration check: 24 hours
          const isExpired = Date.now() - updatedAt > 24 * 60 * 60 * 1000;

          if (isExpired) {
            localStorage.removeItem(`focusly_insights_${userId}_${f}`);
            continue;
          }

          const expectedLen = expectedLengths[f];
          if (expectedLen && data.heatmapCells?.length !== expectedLen) {
            localStorage.removeItem(`focusly_insights_${userId}_${f}`);
            continue;
          }
          loadedCache[f] = data;
        } catch (e) {
          console.error(`Error parsing cached insights for ${f}`, e);
        }
      }
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalCache(loadedCache);
  }, [userId]);

  const { data, loading, error, refetch } = useQuery(GET_INSIGHTS, {
    variables: {
      userId,
      filter,
      timezoneOffset: new Date().getTimezoneOffset(),
      baseDate,
    },
    skip: !userId,
    fetchPolicy: 'cache-and-network',
  });

  const isFirstMount = useRef(true);

  // Force refetch on filter or date navigation changes to guarantee execution
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    if (userId) {
      refetch({
        userId,
        filter,
        timezoneOffset: new Date().getTimezoneOffset(),
        baseDate,
      });
    }
  }, [baseDate, filter, userId, refetch]);

  // Update cache when new data arrives (only for current period, i.e. baseDate is null)
  useEffect(() => {
    if (data?.insights && userId && !baseDate) {
      const insights = data.insights as InsightsData;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalCache((prev) => ({
        ...prev,
        [filter]: insights,
      }));
      const cacheValue = {
        data: insights,
        updatedAt: Date.now(),
      };
      localStorage.setItem(
        `focusly_insights_${userId}_${filter}`,
        JSON.stringify(cacheValue),
      );
    }
  }, [data, filter, userId, baseDate]);

  // Invalidate stale cache for other users or on logout
  useEffect(() => {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith('focusly_insights_')) {
        if (!userId || !key.startsWith(`focusly_insights_${userId}_`)) {
          localStorage.removeItem(key);
        }
      }
    }
  }, [userId]);

  // Sync lastData to retain previous month's results during refetches
  useEffect(() => {
    if (data?.insights) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLastData(data.insights as InsightsData);
    } else if (localCache[filter] && !baseDate) {
      setLastData(localCache[filter]);
    } else if (!loading) {
      setLastData(null);
    }
  }, [data, filter, localCache, baseDate, loading]);

  const stats = useMemo(() => {
    return lastData || DEFAULT_STATS;
  }, [lastData]);

  const hasData = useMemo(() => {
    return !!lastData;
  }, [lastData]);

  const navigatePeriod = (direction: 'prev' | 'next') => {
    const refDate = baseDate ? new Date(baseDate + 'T00:00:00') : new Date();
    const today = new Date();

    if (filter === 'Monthly') {
      const newDate = new Date(
        refDate.getFullYear(),
        refDate.getMonth() + (direction === 'prev' ? -1 : 1),
        1,
      );
      const currentMonthStart = new Date(
        today.getFullYear(),
        today.getMonth(),
        1,
      );

      if (direction === 'next' && newDate > currentMonthStart) {
        return;
      }

      if (newDate.getTime() === currentMonthStart.getTime()) {
        setBaseDate(null);
      } else {
        const year = newDate.getFullYear();
        const month = String(newDate.getMonth() + 1).padStart(2, '0');
        setBaseDate(`${year}-${month}-01`);
      }
    } else if (filter === 'Weekly') {
      const newDate = new Date(
        refDate.getTime() +
          (direction === 'prev' ? -7 : 7) * 24 * 60 * 60 * 1000,
      );

      // Aligned current week start (Monday)
      const currentWeekStart = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
      );
      const day = currentWeekStart.getDay();
      const diff = currentWeekStart.getDate() - day + (day === 0 ? -6 : 1);
      currentWeekStart.setDate(diff);
      currentWeekStart.setHours(0, 0, 0, 0);

      // Aligned new week start
      const targetWeekStart = new Date(
        newDate.getFullYear(),
        newDate.getMonth(),
        newDate.getDate(),
      );
      const targetDay = targetWeekStart.getDay();
      const targetDiff =
        targetWeekStart.getDate() - targetDay + (targetDay === 0 ? -6 : 1);
      targetWeekStart.setDate(targetDiff);
      targetWeekStart.setHours(0, 0, 0, 0);

      if (direction === 'next' && targetWeekStart > currentWeekStart) {
        return;
      }

      if (targetWeekStart.getTime() === currentWeekStart.getTime()) {
        setBaseDate(null);
      } else {
        const year = targetWeekStart.getFullYear();
        const month = String(targetWeekStart.getMonth() + 1).padStart(2, '0');
        const d = String(targetWeekStart.getDate()).padStart(2, '0');
        setBaseDate(`${year}-${month}-${d}`);
      }
    } else if (filter === 'Daily') {
      const newDate = new Date(
        refDate.getTime() +
          (direction === 'prev' ? -1 : 1) * 24 * 60 * 60 * 1000,
      );
      newDate.setHours(0, 0, 0, 0);
      const todayDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
      );

      if (direction === 'next' && newDate > todayDate) {
        return;
      }

      if (newDate.getTime() === todayDate.getTime()) {
        setBaseDate(null);
      } else {
        const year = newDate.getFullYear();
        const month = String(newDate.getMonth() + 1).padStart(2, '0');
        const d = String(newDate.getDate()).padStart(2, '0');
        setBaseDate(`${year}-${month}-${d}`);
      }
    }
  };

  const resetPeriod = () => {
    setBaseDate(null);
  };

  const periodLabel = useMemo(() => {
    return calculatePeriodLabel(filter, baseDate, stats.heatmapCells);
  }, [stats.heatmapCells, filter, baseDate]);

  return {
    stats,
    loading,
    hasData,
    error,
    filter,
    filters: FILTERS,
    setFilter: handleSetFilter,
    refetch,
    baseDate,
    navigatePeriod,
    resetPeriod,
    periodLabel,
  };
};
