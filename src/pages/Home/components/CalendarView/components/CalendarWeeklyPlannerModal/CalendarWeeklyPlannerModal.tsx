import React, { useState, useEffect } from 'react';
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
import { useMutation } from '@apollo/client';
import { UPDATE_TASK, GET_TASKS } from '@/pages/Tasks/Tasks.graphql';
import { planWeeklyAI, type AIWeeklyPlanDayItem } from '@/api/AI/apiAIPlanner';
import type { Task } from '@/redux/tasks/task.types';
import { sileo } from '@/utils';
import { startOfWeek, addDays, format } from 'date-fns';

interface CalendarWeeklyPlannerModalProps {
  open: boolean;
  onClose: () => void;
  tasks: Task[];
  currentDate: Date;
}

export const CalendarWeeklyPlannerModal: React.FC<
  CalendarWeeklyPlannerModalProps
> = ({ open, onClose, tasks, currentDate }) => {
  const { user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState(false);
  const [weeklyPlan, setWeeklyPlan] = useState<AIWeeklyPlanDayItem[]>([]);
  const [summary, setSummary] = useState('');
  const [updateTaskMutation] = useMutation(UPDATE_TASK);

  useEffect(() => {
    if (open && tasks.length > 0) {
      const fetchWeeklyPlan = async () => {
        setLoading(true);
        try {
          const pendingTasks = tasks.filter((t) => t.status !== 'Done');
          if (pendingTasks.length === 0) {
            sileo.info({
              title: 'Weekly Planner',
              description:
                'No tienes tareas pendientes para planificar esta semana.',
              duration: 3000,
            });
            onClose();
            return;
          }

          const res = await planWeeklyAI(pendingTasks);
          setWeeklyPlan(res.weeklyPlan || []);
          setSummary(res.recommendationSummary || '');
        } catch (e) {
          console.error('Error fetching weekly plan:', e);
          sileo.error({
            title: 'Error',
            description:
              'No se pudo obtener la planificación semanal de Lumina.',
            duration: 4000,
          });
          onClose();
        } finally {
          setLoading(false);
        }
      };
      fetchWeeklyPlan();
    }
  }, [open, tasks, onClose]);

  const getDayDate = (dayName: string) => {
    const monday = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday = 1
    const map: Record<string, number> = {
      monday: 0,
      tuesday: 1,
      wednesday: 2,
      thursday: 3,
      friday: 4,
      saturday: 5,
      sunday: 6,
    };
    const offset = map[dayName.toLowerCase()] ?? 0;
    return addDays(monday, offset);
  };

  const handleApply = async () => {
    if (!user?.id || weeklyPlan.length === 0) return;
    setApplying(true);
    try {
      // Loop over daily suggestions
      for (const dayItem of weeklyPlan) {
        const targetDate = getDayDate(dayItem.day);

        // Find tasks in this day package matching title
        for (const taskTitle of dayItem.tasks) {
          const targetTask = tasks.find(
            (t) =>
              t.title.toLowerCase().trim() === taskTitle.toLowerCase().trim(),
          );
          if (!targetTask) continue;

          // Set estimated start date to this day at 09:00 AM, and end date to 11:00 AM
          const startDate = new Date(targetDate);
          startDate.setHours(9, 0, 0, 0);
          const endDate = new Date(targetDate);
          endDate.setHours(11, 0, 0, 0);

          await updateTaskMutation({
            variables: {
              updateTaskInput: {
                id: targetTask.id,
                title: targetTask.title,
                notes_encrypted: targetTask.notes_encrypted || '',
                status: targetTask.status || 'Todo',
                estimate_timer: targetTask.estimate_timer || 0,
                priority_level: targetTask.priority_level,
                deadline: targetTask.deadline || new Date().toISOString(),
                category: targetTask.category || 'General',
                tags: targetTask.tags || [],
                google_event_id: targetTask.google_event_id,
                estimated_start_date: startDate.toISOString(),
                estimated_end_date: endDate.toISOString(),
              },
            },
            refetchQueries: [
              { query: GET_TASKS, variables: { userId: user.id } },
            ],
          });
        }
      }

      sileo.success({
        title: 'Planificación Semanal Aplicada',
        description:
          'Se han configurado las fechas estimadas de trabajo para tus tareas.',
        duration: 4000,
      });
      onClose();
    } catch (e) {
      console.error('Error applying weekly schedule:', e);
      sileo.error({
        title: 'Error',
        description:
          'Ocurrió un problema al guardar las fechas de planificación.',
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
        Focusly AI Weekly Planner
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
              Lumina AI está organizando tu agenda semanal...
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
                  🎯 Recomendación de Lumina:
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
              {weeklyPlan.map((dayItem, idx) => {
                const dayDate = getDayDate(dayItem.day);
                return (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
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
                      >
                        {dayItem.day}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'block', mb: 1.5, fontWeight: 600 }}
                      >
                        {format(dayDate, 'MMMM d, yyyy')}
                      </Typography>

                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1,
                        }}
                      >
                        {dayItem.tasks.length === 0 ? (
                          <Typography
                            variant="caption"
                            color="text.disabled"
                            sx={{ fontStyle: 'italic' }}
                          >
                            Sin tareas asignadas.
                          </Typography>
                        ) : (
                          dayItem.tasks.map((taskTitle, tIdx) => (
                            <Box
                              key={tIdx}
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
                              {taskTitle}
                            </Box>
                          ))
                        )}
                      </Box>
                    </Paper>
                  </Grid>
                );
              })}
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
          Descartar
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
          {applying ? 'Asignando tareas...' : 'Confirmar Plan Semanal'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
