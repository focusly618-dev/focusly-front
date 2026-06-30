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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  AutoAwesome as AutoAwesomeIcon,
  CalendarToday as CalendarIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { useAppSelector } from '@/redux/hooks';
import { planCalendarAI, type AITimeBlockItem } from '@/api/AI/apiAIPlanner';
import { createTimeBlock } from '@/api/TimeBlocks/timeBlocksApi';
import type { Task } from '@/redux/tasks/task.types';
import { sileo } from '@/utils/sileo';
import { format, startOfDay, addDays } from 'date-fns';
import { useMutation } from '@apollo/client';
import { UPDATE_TASK } from '@/pages/Tasks/Task.graphql';
import type { ICalendarEvent } from '@/pages/Home/components/CalendarEvent';

interface CalendarAIPlannerModalProps {
  open: boolean;
  onClose: () => void;
  events: ICalendarEvent[];
  tasks: Task[];
  currentDate: Date;
  onSuccess: () => void;
}

export const CalendarAIPlannerModal: React.FC<CalendarAIPlannerModalProps> = ({
  open,
  onClose,
  events,
  tasks,
  currentDate,
  onSuccess,
}) => {
  const { user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [scheduling, setScheduling] = useState(false);
  const [proposedEvents, setProposedEvents] = useState<AITimeBlockItem[]>([]);
  const [updateTaskMutation] = useMutation(UPDATE_TASK);

  // Heuristic to calculate 1-hour free slots between 9 AM and 6 PM for today and the next 2 days
  const calculateFreeSlots = (
    existingEvents: ICalendarEvent[],
    baseDate: Date,
  ) => {
    const slots: { start: string; end: string }[] = [];
    const startDay = startOfDay(baseDate);

    for (let d = 0; d < 3; d++) {
      const day = addDays(startDay, d);
      for (let hour = 9; hour < 18; hour++) {
        const slotStart = new Date(day);
        slotStart.setHours(hour, 0, 0, 0);
        const slotEnd = new Date(day);
        slotEnd.setHours(hour + 1, 0, 0, 0);

        // Check overlap with existing events
        const isOverlap = existingEvents.some((e) => {
          const eStart = new Date(e.start);
          const eEnd = new Date(e.end);
          return slotStart < eEnd && slotEnd > eStart;
        });

        if (!isOverlap) {
          slots.push({
            start: slotStart.toISOString(),
            end: slotEnd.toISOString(),
          });
        }
      }
    }
    return slots;
  };

  useEffect(() => {
    if (open && tasks.length > 0) {
      const generateSchedule = async () => {
        setLoading(true);
        try {
          const pendingTasks = tasks.filter((t) => t.status !== 'Done');
          const freeSlots = calculateFreeSlots(events, currentDate);

          if (pendingTasks.length === 0) {
            sileo.info({
              title: 'Planner',
              description: 'No tienes tareas pendientes para agendar.',
              duration: 3000,
            });
            onClose();
            return;
          }

          if (freeSlots.length === 0) {
            sileo.warning({
              title: 'Sin Disponibilidad',
              description:
                'No hay espacios libres en el calendario para agendar.',
              duration: 3000,
            });
            onClose();
            return;
          }

          const res = await planCalendarAI(pendingTasks, freeSlots);
          setProposedEvents(res.events || []);
        } catch (e) {
          console.error('Error generating AI schedule:', e);
          sileo.error({
            title: 'Error de Planeación',
            description:
              'No se pudo generar la propuesta de bloques de tiempo.',
            duration: 4000,
          });
          onClose();
        } finally {
          setLoading(false);
        }
      };
      generateSchedule();
    }
  }, [open, tasks, events, currentDate, onClose]);

  const handleSchedule = async () => {
    if (!user?.id || proposedEvents.length === 0) return;
    setScheduling(true);
    try {
      for (const item of proposedEvents) {
        // 1. Crear el TimeBlock en BD
        await createTimeBlock({
          userId: user.id,
          taskId: item.taskId,
          startTime: item.startTime,
          endTime: item.endTime,
          blockType: 'Focus_Block',
          source: 'App',
          title: item.title,
        });

        // 2. Mover la tarea al nuevo slot en el calendario
        if (item.taskId) {
          const targetTask = tasks.find((t) => t.id === item.taskId);
          if (targetTask) {
            await updateTaskMutation({
              variables: {
                updateTaskInput: {
                  id: targetTask.id,
                  estimated_start_date: item.startTime,
                  estimated_end_date: item.endTime,
                },
              },
            });
          }
        }
      }

      sileo.success({
        title: 'Calendario Organizado',
        description:
          'Tus tareas han sido convertidas en bloques de tiempo con éxito.',
        duration: 4000,
      });
      onSuccess();
      onClose();
    } catch (e) {
      console.error('Error scheduling events:', e);
      sileo.error({
        title: 'Error',
        description: 'No se pudieron guardar los bloques de tiempo.',
        duration: 4000,
      });
    } finally {
      setScheduling(false);
    }
  };

  const formatEventTime = (isoString: string) => {
    const d = new Date(isoString);
    return format(d, 'eeee d MMM, h:mm a');
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
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
        AI Time Blocking Planner
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
              Lumina AI está organizando tus tareas en el calendario...
            </Typography>
          </Box>
        ) : (
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Lumina ha identificado los espacios libres en tu calendario y
              propone los siguientes bloques de enfoque para tus tareas
              pendientes:
            </Typography>

            <List
              sx={{
                bgcolor: 'action.hover',
                borderRadius: '12px',
                p: 1,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              {proposedEvents.length === 0 ? (
                <ListItem>
                  <ListItemText primary="No se sugirieron bloques de tiempo." />
                </ListItem>
              ) : (
                proposedEvents.map((item, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && <Divider component="li" />}
                    <ListItem sx={{ py: 1.5 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <CalendarIcon sx={{ color: 'primary.main' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={item.title}
                        secondary={
                          <Box
                            component="span"
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 0.5,
                              mt: 0.5,
                            }}
                          >
                            <Box
                              component="span"
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                color: 'text.primary',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                              }}
                            >
                              <ScheduleIcon sx={{ fontSize: 14 }} />
                              {formatEventTime(item.startTime)}
                            </Box>
                            <Box
                              component="span"
                              sx={{
                                fontSize: '0.75rem',
                                color: 'text.secondary',
                                fontStyle: 'italic',
                              }}
                            >
                              {item.reason}
                            </Box>
                          </Box>
                        }
                        primaryTypographyProps={{
                          fontWeight: 700,
                          fontSize: '0.9rem',
                        }}
                      />
                    </ListItem>
                  </React.Fragment>
                ))
              )}
            </List>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          disabled={scheduling}
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
          onClick={handleSchedule}
          disabled={loading || scheduling || proposedEvents.length === 0}
          variant="contained"
          startIcon={
            scheduling ? (
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
          {scheduling ? 'Creando eventos...' : 'Aceptar y Agendar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
