import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
  Paper,
  Grid,
} from '@mui/material';
import { AutoAwesome as AutoAwesomeIcon } from '@mui/icons-material';
import { useAppSelector } from '@/redux/hooks';
import { useApolloClient, useMutation } from '@apollo/client';
import { GET_TASKS, UPDATE_TASK } from '@/pages/Tasks/Tasks.graphql';
import { mapResponseToTask } from '@/api/Tasks/taskMapper';
import type { TaskResponse } from '@/api/Tasks/apiTaskTypes';
import { availabilityFromSettings, planWeeklyAI } from '@/api/AI/apiAIPlanner';
import type { Task } from '@/redux/tasks/task.types';
import { notify, getFriendlyErrorMessage } from '@/utils';
import type { UserSettings } from '@/api/User/apiUser.types';
import {
  dayName,
  plannableTasks,
  planningDays,
  schedulePlan,
  workSchedule,
  type PlanDay,
} from './weeklyPlanSchedule';
import { isPlanLimitError } from '@/api/Billing/planLimit';

const PLANNER_TASK_LIMIT = 200;

interface CalendarWeeklyPlannerModalProps {
  open: boolean;
  onClose: () => void;
  tasks: Task[];
  currentDate: Date;
  /** What's already on the calendar, so nothing is planned over it. */
  events?: { start: Date; end: Date }[];
}

export const CalendarWeeklyPlannerModal: React.FC<
  CalendarWeeklyPlannerModalProps
> = ({ open, onClose, tasks, currentDate, events }) => {
  const { t, i18n } = useTranslation();
  const { user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState(false);
  const [weeklyPlan, setWeeklyPlan] = useState<PlanDay[]>([]);
  const [summary, setSummary] = useState('');
  const [updateTaskMutation] = useMutation(UPDATE_TASK);
  const apollo = useApolloClient();

  useEffect(() => {
    if (open && user?.id) {
      const fetchWeeklyPlan = async () => {
        setLoading(true);
        try {
          // The calendar only holds scheduled tasks; what needs planning is
          // mostly waiting in the Inbox
          const { data } = await apollo.query({
            query: GET_TASKS,
            variables: {
              userId: user.id,
              filters: { has_project: false },
              limit: PLANNER_TASK_LIMIT,
              offset: 0,
            },
            fetchPolicy: 'network-only',
          });
          const fetched: TaskResponse[] = data?.result?.tasks ?? [];
          const allTasks = [
            ...tasks,
            ...fetched
              .map(mapResponseToTask)
              .filter((task) => !tasks.some((t) => t.id === task.id)),
          ];
          const pendingTasks = plannableTasks(allTasks);
          if (pendingTasks.length === 0) {
            notify.info({
              title: t('calendarWeeklyPlanner.toast.noTasksTitle'),
              description: t('calendarWeeklyPlanner.toast.noTasksDesc'),
              duration: 3000,
            });
            onClose();
            return;
          }

          const now = new Date();
          const schedule = workSchedule(
            (user?.settings as UserSettings | undefined)?.workHoursConfig,
          );
          const days = planningDays(currentDate, now, schedule);
          const res = await planWeeklyAI(
            pendingTasks,
            availabilityFromSettings(user?.settings),
            {
              availableDays: days.map(dayName),
              language: i18n.language,
            },
          );
          const busy = [
            ...allTasks.flatMap((task) =>
              task.estimated_start_date && task.estimated_end_date
                ? [
                    {
                      start: new Date(task.estimated_start_date),
                      end: new Date(task.estimated_end_date),
                    },
                  ]
                : [],
            ),
            ...(events ?? []),
          ];
          const planned = schedulePlan({
            plan: res.weeklyPlan || [],
            tasks: allTasks,
            days,
            now,
            schedule,
            busy,
          });
          setWeeklyPlan(planned.days);
          setSummary(res.recommendationSummary || '');
        } catch (e) {
          // The Pro plans are already on screen.
          if (isPlanLimitError(e)) {
            onClose();
            return;
          }
          console.error('Error fetching weekly plan:', e);
          notify.error({
            title: t('common.error'),
            description: getFriendlyErrorMessage(
              e,
              t('calendarWeeklyPlanner.toast.fetchErrorDesc'),
            ),
            duration: 4000,
          });
          onClose();
        } finally {
          setLoading(false);
        }
      };
      fetchWeeklyPlan();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- plans once per opening
  }, [open]);

  const handleApply = async () => {
    if (!user?.id || weeklyPlan.length === 0) return;
    setApplying(true);
    try {
      for (const { slots } of weeklyPlan) {
        for (const { task: targetTask, start, end } of slots) {
          await updateTaskMutation({
            variables: {
              updateTaskInput: {
                id: targetTask.id,
                title: targetTask.title,
                notes: targetTask.notes || '',
                // Scheduled now: it isn't waiting in the Inbox any more
                status:
                  targetTask.status === 'Backlog'
                    ? 'Todo'
                    : targetTask.status || 'Todo',
                estimate_timer: targetTask.estimate_timer || 0,
                priority_level: targetTask.priority_level,
                // Omitted when the task has no date, so it isn't given one.
                deadline: targetTask.deadline || undefined,
                category: targetTask.category || 'General',
                tags: targetTask.tags || [],
                google_event_id: targetTask.google_event_id,
                estimated_start_date: start.toISOString(),
                estimated_end_date: end.toISOString(),
              },
            },
          });
        }
      }

      notify.success({
        title: t('calendarWeeklyPlanner.toast.appliedTitle'),
        description: t('calendarWeeklyPlanner.toast.appliedDesc'),
        duration: 4000,
      });
      onClose();
    } catch (e) {
      console.error('Error applying weekly schedule:', e);
      notify.error({
        title: t('common.error'),
        description: getFriendlyErrorMessage(
          e,
          t('calendarWeeklyPlanner.toast.applyErrorDesc'),
        ),
        duration: 4000,
      });
    } finally {
      setApplying(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          p: 1.5,
          bgcolor: 'background.paper',
          backgroundImage: 'none',
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 800,
          fontSize: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <AutoAwesomeIcon sx={{ color: 'primary.main' }} />
        {t('calendarWeeklyPlanner.title')}
      </DialogTitle>

      <DialogContent>
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 8,
              gap: 2,
            }}
          >
            <CircularProgress color="primary" />
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              {t('calendarWeeklyPlanner.loading')}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ mt: 1 }}>
            {summary && (
              <Paper
                sx={{
                  p: 2,
                  mb: 3,
                  border: '1px solid',
                  borderColor: 'primary.light',
                  bgcolor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(124,58,237,0.08)'
                      : 'rgba(124,58,237,0.02)',
                  borderRadius: '12px',
                }}
                elevation={0}
              >
                <Typography
                  variant="body2"
                  color="text.primary"
                  fontWeight={600}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    mb: 0.5,
                  }}
                >
                  {t('calendarWeeklyPlanner.recommendation')}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontStyle: 'italic', lineHeight: 1.6 }}
                >
                  {summary}
                </Typography>
              </Paper>
            )}

            <Grid container spacing={2}>
              {weeklyPlan.map((day) => (
                <Grid
                  size={{ xs: 12, sm: 6, md: 4 }}
                  key={day.date.toISOString()}
                >
                  <Paper
                    sx={{
                      p: 2,
                      borderRadius: '12px',
                      border: '1px solid',
                      borderColor: 'divider',
                      bgcolor: 'background.default',
                      height: '100%',
                    }}
                    elevation={0}
                  >
                    <Typography
                      variant="subtitle2"
                      fontWeight={800}
                      color="primary.main"
                      sx={{ textTransform: 'capitalize' }}
                    >
                      {day.date.toLocaleDateString(i18n.language, {
                        weekday: 'long',
                      })}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'block', mb: 1.5, fontWeight: 600 }}
                    >
                      {day.date.toLocaleDateString(i18n.language, {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                      }}
                    >
                      {day.slots.length === 0 ? (
                        <Typography
                          variant="caption"
                          color="text.disabled"
                          sx={{ fontStyle: 'italic' }}
                        >
                          {t('calendarWeeklyPlanner.noTasksAssigned')}
                        </Typography>
                      ) : (
                        day.slots.map(({ task, start, end }) => (
                          <Box
                            key={task.id}
                            sx={{
                              p: 1,
                              borderRadius: '8px',
                              border: '1px solid',
                              borderColor: 'divider',
                              bgcolor: 'background.paper',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                            }}
                          >
                            <Typography
                              component="div"
                              sx={{
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                color: 'primary.main',
                              }}
                            >
                              {start.toLocaleTimeString(i18n.language, {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                              {' – '}
                              {end.toLocaleTimeString(i18n.language, {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </Typography>
                            {task.title}
                          </Box>
                        ))
                      )}
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          disabled={applying}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: '8px',
            color: 'text.secondary',
          }}
        >
          {t('calendar.discard')}
        </Button>
        <Button
          onClick={handleApply}
          disabled={loading || applying || weeklyPlan.length === 0}
          variant="contained"
          startIcon={
            applying ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <AutoAwesomeIcon />
            )
          }
          sx={{
            textTransform: 'none',
            fontWeight: 700,
            borderRadius: '8px',
            boxShadow: 'none',
            '&:hover': { boxShadow: 'none' },
          }}
        >
          {applying
            ? t('calendarWeeklyPlanner.applying')
            : t('calendarWeeklyPlanner.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
