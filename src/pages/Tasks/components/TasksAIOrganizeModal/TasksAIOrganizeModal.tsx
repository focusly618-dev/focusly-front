import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  AutoAwesome as AutoAwesomeIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useMutation } from '@apollo/client';
import { UPDATE_TASK, GET_TASKS } from '@/pages/Tasks/Tasks.graphql';
import { organizeTasksAI, type AIPlanItem } from '@/api/AI/apiAIPlanner';
import type { Task } from '@/redux/tasks/task.types';
import { sileo } from '@/utils/sileo';
import { useAppSelector } from '@/redux/hooks';

interface TasksAIOrganizeModalProps {
  open: boolean;
  onClose: () => void;
  tasks: Task[];
}

export const TasksAIOrganizeModal: React.FC<TasksAIOrganizeModalProps> = ({
  open,
  onClose,
  tasks,
}) => {
  const { user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState(false);
  const [plan, setPlan] = useState<AIPlanItem[]>([]);
  const [updateTaskMutation] = useMutation(UPDATE_TASK);

  useEffect(() => {
    if (open && tasks.length > 0) {
      const fetchPlan = async () => {
        setLoading(true);
        try {
          const res = await organizeTasksAI(tasks);
          setPlan(res.plan);
        } catch (e) {
          console.error('Error organizing tasks:', e);
          sileo.error({
            title: 'Error de Planificador',
            description: 'No se pudo obtener la planificación optimizada.',
            duration: 4000,
          });
          onClose();
        } finally {
          setLoading(false);
        }
      };
      fetchPlan();
    }
  }, [open, tasks, onClose]);

  const handleApply = async () => {
    if (!user?.id || plan.length === 0) return;
    setApplying(true);
    try {
      // Loop through each plan recommendation and trigger update
      for (const item of plan) {
        const targetTask = tasks.find((t) => t.id === item.taskId);
        if (!targetTask) continue;

        // Map recommendedPriority to numeric levels (High: 3, Med: 2, Low: 1)
        const priorityMap: Record<string, number> = {
          HIGH: 3,
          MEDIUM: 2,
          LOW: 1,
        };
        const newPriorityLevel =
          priorityMap[item.recommendedPriority.toUpperCase()] || 2;

        await updateTaskMutation({
          variables: {
            updateTaskInput: {
              id: item.taskId,
              title: targetTask.title,
              notes_encrypted: targetTask.notes_encrypted || '',
              status: targetTask.status || 'Todo',
              estimate_timer: targetTask.estimate_timer || 0,
              priority_level: newPriorityLevel,
              deadline: targetTask.deadline || new Date().toISOString(),
              category: targetTask.category || 'General',
              tags: targetTask.tags || [],
              google_event_id: targetTask.google_event_id,
              estimated_start_date: targetTask.estimated_start_date,
              estimated_end_date: targetTask.estimated_end_date,
            },
          },
          refetchQueries: [
            { query: GET_TASKS, variables: { userId: user.id } },
          ],
        });
      }

      sileo.success({
        title: 'Planificación Aplicada',
        description:
          'Lumina ha reorganizado y priorizado tus tareas con éxito.',
        duration: 4000,
      });
      onClose();
    } catch (e) {
      console.error('Error applying AI plan:', e);
      sileo.error({
        title: 'Error',
        description: 'Hubo un problema al aplicar las prioridades en lote.',
        duration: 4000,
      });
    } finally {
      setApplying(false);
    }
  };

  const getPriorityLabel = (level: number) => {
    if (level >= 3) return 'High';
    if (level === 2) return 'Med';
    return 'Low';
  };

  const getPriorityChipColor = (priority: string) => {
    switch (priority.toUpperCase()) {
      case 'HIGH':
        return 'error';
      case 'MEDIUM':
      case 'MED':
        return 'warning';
      default:
        return 'default';
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
        Focusly AI Planner: Organize Tasks
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
              Lumina AI está analizando tus tareas y prioridades...
            </Typography>
          </Box>
        ) : (
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Lumina ha analizado el impacto, urgencia, esfuerzo estimado y
              plazos de tus tareas actuales para recomendar un orden de
              ejecución y niveles de prioridad optimizados.
            </Typography>

            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: '12px',
                overflow: 'hidden',
              }}
            >
              <Table size="small">
                <TableHead sx={{ bgcolor: 'action.hover' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Tarea</TableCell>
                    <TableCell sx={{ fontWeight: 700, textAlign: 'center' }}>
                      Prioridad
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, textAlign: 'center' }}>
                      Orden Sugerido
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      Justificación de Lumina
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {plan.map((item) => {
                    const task = tasks.find((t) => t.id === item.taskId);
                    if (!task) return null;

                    const currentPriority = getPriorityLabel(
                      task.priority_level,
                    );
                    const isPriorityChanged =
                      currentPriority.toUpperCase() !==
                      item.recommendedPriority.toUpperCase();

                    return (
                      <TableRow key={item.taskId} hover>
                        <TableCell sx={{ fontWeight: 600 }}>
                          {task.title}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center' }}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 0.5,
                            }}
                          >
                            <Chip
                              label={currentPriority}
                              size="small"
                              variant="outlined"
                              color={getPriorityChipColor(currentPriority)}
                            />
                            {isPriorityChanged && (
                              <>
                                <ArrowForwardIcon
                                  sx={{ fontSize: 12, color: 'text.secondary' }}
                                />
                                <Chip
                                  label={item.recommendedPriority}
                                  size="small"
                                  color={getPriorityChipColor(
                                    item.recommendedPriority,
                                  )}
                                />
                              </>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell
                          sx={{
                            textAlign: 'center',
                            fontWeight: 700,
                            color: 'primary.main',
                          }}
                        >
                          #{item.suggestedOrder}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: 'text.secondary',
                            fontSize: '0.8rem',
                            maxWidth: '300px',
                          }}
                        >
                          {item.reason}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
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
          disabled={loading || applying || plan.length === 0}
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
          {applying ? 'Aplicando cambios...' : 'Confirmar y Organizar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
