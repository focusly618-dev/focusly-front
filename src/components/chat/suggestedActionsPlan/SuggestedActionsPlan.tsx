import React from 'react';
import {
  Box,
  Typography,
  Button,
  ButtonBase,
  Dialog,
  IconButton,
  Chip,
  CircularProgress,
  useTheme,
} from '@mui/material';
import {
  Close as CloseIcon,
  EventNote as EventNoteIcon,
  CheckCircle as CheckCircleIcon,
  ErrorOutline as ErrorOutlineIcon,
  Add as AddIcon,
  Schedule as ScheduleIcon,
  Flag as FlagIcon,
  Folder as FolderIcon,
  Description as DescriptionIcon,
  Assignment as AssignmentIcon,
  EventRepeat as RescheduleIcon,
  OpenInFull as OpenInFullIcon,
} from '@mui/icons-material';
import {
  Plan,
  PlanHeader,
  PlanTitle,
  PlanDescription,
  PlanContent,
  PlanFooter,
  PlanTrigger,
} from '@/components/ai-elements/plan';
import {
  Task,
  TaskTrigger,
  TaskContent,
  TaskStatus,
  type TaskStatusType,
} from '@/components/ai-elements/task';
import {
  getActionPreviewData,
  getActionTitle,
} from '../suggestedActionCard/actionExecution.utils';
import { useSuggestedActionsPlan } from './useSuggestedActionsPlan.hook';
import { brand, byMode, emerald, rose, truncateSx, zinc } from '@/styles/mui';
import type {
  SuggestedActionsPlanProps,
  PlanItemStatus,
} from './SuggestedActionsPlan.types';
import {
  dialogPaperSx,
  dialogHeaderSx,
  dialogListSx,
  planRowSx,
  planRowHeaderSx,
  planRowDateChipSx,
  planRowTitleSx,
  planRowDescriptionSx,
  planRowMetaRowSx,
  planRowMetaChipSx,
  dialogFooterSx,
  createAllButtonSx,
} from './SuggestedActionsPlan.styles';

const mapStatusToTaskStatus = (status: PlanItemStatus): TaskStatusType => {
  switch (status) {
    case 'done':
      return 'completed';
    case 'creating':
      return 'in_progress';
    case 'error':
      return 'error';
    default:
      return 'pending';
  }
};

const getActionTypeIcon = (type: string) => {
  switch (type) {
    case 'CREATE_TASK':
      return <AssignmentIcon sx={{ fontSize: 16, color: 'primary.main' }} />;
    case 'UPDATE_TASK':
      return <RescheduleIcon sx={{ fontSize: 16, color: 'info.main' }} />;
    case 'CREATE_PROJECT_GROUP':
    case 'CREATE_WORKSPACE':
      return <FolderIcon sx={{ fontSize: 16, color: 'warning.main' }} />;
    case 'CREATE_NOTE':
      return <DescriptionIcon sx={{ fontSize: 16, color: 'secondary.main' }} />;
    default:
      return <AssignmentIcon sx={{ fontSize: 16, color: 'primary.main' }} />;
  }
};

export const SuggestedActionsPlan: React.FC<SuggestedActionsPlanProps> = ({
  actions,
}) => {
  const theme = useTheme();
  const {
    open,
    setOpen,
    isCompleted,
    isCreating,
    itemStatuses,
    errorMessage,
    handleCreateAll,
  } = useSuggestedActionsPlan(actions);

  const previews = actions.map((action) => getActionPreviewData(action));

  const isRescheduleOnly =
    actions.length > 0 && actions.every((a) => a.type === 'UPDATE_TASK');

  const hasTasks = actions.some(
    (a) => a.type === 'CREATE_TASK' || a.type === 'UPDATE_TASK',
  );
  const hasDocuments = actions.some(
    (a) => a.type === 'CREATE_WORKSPACE' || a.type === 'CREATE_NOTE',
  );
  const planItemLabel =
    hasTasks && !hasDocuments
      ? actions.length === 1
        ? 'tarea'
        : 'tareas'
      : !hasTasks && hasDocuments
        ? actions.length === 1
          ? 'documento'
          : 'documentos'
        : actions.length === 1
          ? 'elemento'
          : 'elementos';

  const completedCount = itemStatuses.filter((s) => s === 'done').length;

  return (
    <>
      {/* AI Elements Inline Plan Container */}
      <Plan
        defaultOpen={true}
        isStreaming={isCreating}
        sx={{
          my: 1.75,
          border: `1px solid ${emerald[500]}33`,
          bgcolor: byMode('rgba(255, 255, 255, 0.8)', `${zinc[900]}e6`),
          boxShadow: byMode(
            '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
            '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          ),
        }}
      >
        <PlanHeader sx={{ py: 1.5, px: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              minWidth: 0,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: '12px',
                bgcolor: `${brand.main}1a`,
                color: byMode(brand.main, brand.dark),
                flexShrink: 0,
              }}
            >
              <EventNoteIcon sx={{ fontSize: 18 }} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <PlanTitle
                sx={{
                  fontSize: '14px',
                  fontWeight: 600,
                  letterSpacing: '-0.025em',
                  color: byMode(zinc[900], zinc[100]),
                  ...truncateSx,
                }}
              >
                {isRescheduleOnly ? 'Cambios sugeridos' : 'Plan sugerido'} ·{' '}
                {actions.length} {planItemLabel}
              </PlanTitle>
              <PlanDescription
                sx={{ fontSize: '12px', color: byMode(zinc[500], zinc[400]) }}
              >
                {isCompleted
                  ? isRescheduleOnly
                    ? 'Horarios actualizados en tu calendario'
                    : 'Elementos agregados a tu espacio'
                  : isCreating
                    ? `Aplicando acciones (${completedCount}/${actions.length})...`
                    : `${actions.length} acciones listas para confirmar`}
              </PlanDescription>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              flexShrink: 0,
            }}
          >
            {isCompleted ? (
              <Chip
                size="small"
                icon={<CheckCircleIcon sx={{ fontSize: 14 }} />}
                label="Completado"
                color="success"
                variant="outlined"
                sx={{ height: 26, fontSize: '11px', fontWeight: 600 }}
              />
            ) : (
              <Button
                variant="contained"
                size="small"
                disabled={isCreating}
                onClick={handleCreateAll}
                startIcon={
                  isCreating ? (
                    <CircularProgress size={12} color="inherit" />
                  ) : (
                    <AddIcon sx={{ fontSize: 14 }} />
                  )
                }
                sx={{
                  textTransform: 'none',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  py: 0.5,
                  px: 1.5,
                  borderRadius: '8px',
                  boxShadow: 'none',
                  bgcolor: '#008767',
                  color: '#ffffff',
                  '&:hover': { bgcolor: '#007357', boxShadow: 'none' },
                }}
              >
                {isCreating ? 'Creando...' : 'Ejecutar todo'}
              </Button>
            )}

            <TooltipIconButton
              title="Vista detallada"
              onClick={() => setOpen(true)}
            >
              <OpenInFullIcon sx={{ fontSize: 15 }} />
            </TooltipIconButton>

            <PlanTrigger />
          </Box>
        </PlanHeader>

        <PlanContent sx={{ p: 1.5, gap: 1 }}>
          {actions.map((action, idx) => {
            const preview = previews[idx];
            const status = itemStatuses[idx];
            const taskStatus = mapStatusToTaskStatus(status);

            return (
              <Task
                key={idx}
                defaultOpen={false}
                sx={{
                  border: '1px solid',
                  borderColor: byMode(
                    'rgba(0, 0, 0, 0.06)',
                    'rgba(255, 255, 255, 0.06)',
                  ),
                  bgcolor: byMode(
                    'rgba(0, 0, 0, 0.015)',
                    'rgba(255, 255, 255, 0.02)',
                  ),
                }}
              >
                <TaskTrigger>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 1.25,
                      width: '100%',
                      py: 0.25,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.25,
                        minWidth: 0,
                        flex: 1,
                      }}
                    >
                      <TaskStatus status={taskStatus} />
                      <Box sx={{ flexShrink: 0, display: 'flex' }}>
                        {getActionTypeIcon(action.type)}
                      </Box>
                      <Box
                        component="span"
                        sx={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color: byMode(zinc[800], zinc[200]),
                          ...truncateSx,
                        }}
                      >
                        {preview.title || getActionTitle(action)}
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.75,
                        flexShrink: 0,
                      }}
                    >
                      {preview.dateLabel && (
                        <Box
                          component="span"
                          sx={{
                            fontSize: '10.5px',
                            px: 1,
                            py: 0.25,
                            borderRadius: '999px',
                            fontWeight: 500,
                            bgcolor: byMode(emerald[50], `${emerald[950]}66`),
                            color: byMode(emerald[700], emerald[300]),
                            border: '1px solid',
                            borderColor: byMode(
                              `${emerald[200]}80`,
                              `${emerald[800]}66`,
                            ),
                          }}
                        >
                          {preview.dateLabel}
                        </Box>
                      )}
                      {preview.durationLabel && (
                        <Box
                          component="span"
                          sx={{
                            fontSize: '10px',
                            px: 0.75,
                            py: 0.25,
                            borderRadius: '6px',
                            fontWeight: 500,
                            color: byMode(zinc[500], zinc[400]),
                            bgcolor: byMode(zinc[100], `${zinc[800]}99`),
                          }}
                        >
                          {preview.durationLabel}
                        </Box>
                      )}
                      {preview.priorityLabel && (
                        <Box
                          component="span"
                          sx={{
                            fontSize: '10px',
                            px: 0.75,
                            py: 0.25,
                            borderRadius: '6px',
                            fontWeight: 600,
                            color: '#ffffff',
                            bgcolor: preview.priorityColor || brand.main,
                          }}
                        >
                          {preview.priorityLabel}
                        </Box>
                      )}
                    </Box>
                  </Box>
                </TaskTrigger>

                <TaskContent>
                  {(preview.description || preview.contentPreview) && (
                    <Box
                      component="p"
                      sx={{
                        m: 0,
                        fontSize: '12px',
                        lineHeight: 1.625,
                        color: byMode(zinc[600], zinc[300]),
                      }}
                    >
                      {preview.description || preview.contentPreview}
                    </Box>
                  )}

                  {preview.subtasks && preview.subtasks.length > 0 && (
                    <Box
                      sx={{
                        mt: 1,
                        pt: 1,
                        borderTop: '1px solid',
                        borderColor: byMode(
                          'rgba(0, 0, 0, 0.05)',
                          'rgba(255, 255, 255, 0.05)',
                        ),
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.5,
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          display: 'block',
                          fontSize: '10.5px',
                          fontWeight: 700,
                          color: zinc[500],
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                      >
                        Subtareas ({preview.subtasks.length}):
                      </Box>
                      {preview.subtasks.map((st, sIdx) => (
                        <Box
                          key={sIdx}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            fontSize: '12px',
                            py: 0.25,
                            color: byMode(zinc[700], zinc[300]),
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            <Box
                              component="span"
                              sx={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                bgcolor: brand.main,
                              }}
                            />
                            <span>{st.title}</span>
                          </Box>
                          {st.durationLabel && (
                            <Box
                              component="span"
                              sx={{ fontSize: '10px', color: zinc[400] }}
                            >
                              {st.durationLabel}
                            </Box>
                          )}
                        </Box>
                      ))}
                    </Box>
                  )}
                </TaskContent>
              </Task>
            );
          })}

          {errorMessage && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                p: 1,
                borderRadius: '8px',
                bgcolor: `${rose[500]}1a`,
                color: byMode(rose[600], rose[400]),
                fontSize: '12px',
              }}
            >
              <ErrorOutlineIcon sx={{ fontSize: 16 }} />
              <span>{errorMessage}</span>
            </Box>
          )}
        </PlanContent>

        <PlanFooter
          sx={{
            py: 1,
            px: 2,
            bgcolor: byMode(`${zinc[50]}99`, `${zinc[900]}66`),
          }}
        >
          <Box
            component="span"
            sx={{ fontSize: '11px', color: byMode(zinc[500], zinc[400]) }}
          >
            {isCompleted
              ? 'Todas las acciones se han ejecutado correctamente'
              : `${actions.length - completedCount} pendientes de ejecutar`}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              variant="text"
              size="small"
              onClick={() => setOpen(true)}
              sx={{
                textTransform: 'none',
                fontSize: '11px',
                color: 'text.secondary',
              }}
            >
              Ver en modal
            </Button>
            {!isCompleted && (
              <Button
                variant="contained"
                size="small"
                disabled={isCreating}
                onClick={handleCreateAll}
                sx={{
                  textTransform: 'none',
                  fontSize: '11px',
                  fontWeight: 700,
                  borderRadius: '6px',
                  boxShadow: 'none',
                }}
              >
                {isCreating ? 'Creando...' : 'Crear todas'}
              </Button>
            )}
          </Box>
        </PlanFooter>
      </Plan>

      {/* Fallback Detailed Modal Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{ sx: dialogPaperSx }}
      >
        <Box sx={dialogHeaderSx}>
          <Typography variant="subtitle1" fontWeight={800} color="text.primary">
            {isRescheduleOnly ? 'Cambios sugeridos' : 'Plan sugerido'} ·{' '}
            {actions.length} {planItemLabel}
          </Typography>
          <IconButton size="small" onClick={() => setOpen(false)}>
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        <Box sx={dialogListSx}>
          {actions.map((action, idx) => {
            const preview = previews[idx];
            const status = itemStatuses[idx];
            return (
              <Box key={idx} sx={planRowSx}>
                <Box sx={planRowHeaderSx}>
                  {preview.dateLabel ? (
                    <Chip
                      size="small"
                      label={preview.dateLabel}
                      sx={planRowDateChipSx(theme.palette.primary.main)}
                    />
                  ) : (
                    <Chip
                      size="small"
                      label={getActionTitle(action)}
                      sx={planRowDateChipSx(theme.palette.text.secondary)}
                    />
                  )}
                  <Typography sx={planRowTitleSx} color="text.primary">
                    {preview.title || getActionTitle(action)}
                  </Typography>
                  {status === 'creating' && (
                    <CircularProgress size={14} sx={{ flexShrink: 0 }} />
                  )}
                  {status === 'done' && (
                    <CheckCircleIcon
                      sx={{
                        fontSize: 16,
                        color: 'success.main',
                        flexShrink: 0,
                      }}
                    />
                  )}
                  {status === 'error' && (
                    <ErrorOutlineIcon
                      sx={{ fontSize: 16, color: 'error.main', flexShrink: 0 }}
                    />
                  )}
                </Box>

                {(preview.description || preview.contentPreview) && (
                  <Typography sx={planRowDescriptionSx} color="text.secondary">
                    {preview.description || preview.contentPreview}
                  </Typography>
                )}

                {(preview.durationLabel || preview.priorityLabel) && (
                  <Box sx={planRowMetaRowSx}>
                    {preview.durationLabel && (
                      <Chip
                        size="small"
                        icon={<ScheduleIcon />}
                        label={preview.durationLabel}
                        sx={planRowMetaChipSx()}
                      />
                    )}
                    {preview.priorityLabel && (
                      <Chip
                        size="small"
                        icon={<FlagIcon />}
                        label={preview.priorityLabel}
                        sx={planRowMetaChipSx(preview.priorityColor)}
                      />
                    )}
                  </Box>
                )}

                {preview.subtasks && preview.subtasks.length > 0 && (
                  <Box
                    sx={{
                      mt: 1,
                      pt: 0.8,
                      borderTop: `1px dashed ${theme.palette.divider}`,
                    }}
                  >
                    <Typography
                      variant="caption"
                      fontWeight={700}
                      color="text.secondary"
                      sx={{ display: 'block', mb: 0.4, fontSize: '10.5px' }}
                    >
                      Subtareas ({preview.subtasks.length}):
                    </Typography>
                    {preview.subtasks.map((st, sIdx) => (
                      <Box
                        key={sIdx}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.8,
                          py: 0.2,
                        }}
                      >
                        <Box
                          sx={{
                            width: 5,
                            height: 5,
                            borderRadius: '50%',
                            bgcolor: theme.palette.primary.main,
                            opacity: 0.7,
                            flexShrink: 0,
                          }}
                        />
                        <Typography
                          variant="caption"
                          color="text.primary"
                          sx={{ flex: 1, fontSize: '11px' }}
                        >
                          {st.title}
                        </Typography>
                        {st.durationLabel && (
                          <Typography
                            variant="caption"
                            sx={{
                              fontSize: '10px',
                              color: 'text.secondary',
                              fontWeight: 600,
                            }}
                          >
                            {st.durationLabel}
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>

        <Box sx={dialogFooterSx}>
          {errorMessage && (
            <Typography variant="caption" color="error.main">
              {errorMessage}
            </Typography>
          )}
          <Button
            variant="contained"
            fullWidth
            disabled={isCreating || isCompleted}
            onClick={handleCreateAll}
            startIcon={
              isCreating ? (
                <CircularProgress size={14} color="inherit" />
              ) : (
                <AddIcon sx={{ fontSize: 16 }} />
              )
            }
            sx={createAllButtonSx}
          >
            {isCompleted
              ? isRescheduleOnly
                ? 'Ya movidas'
                : 'Ya creadas'
              : isCreating
                ? isRescheduleOnly
                  ? 'Moviendo...'
                  : 'Creando...'
                : isRescheduleOnly
                  ? `Mover las ${actions.length} ${planItemLabel}`
                  : `Crear las ${actions.length} ${planItemLabel}`}
          </Button>
        </Box>
      </Dialog>
    </>
  );
};

const TooltipIconButton: React.FC<{
  title: string;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ title, onClick, children }) => (
  <ButtonBase
    title={title}
    onClick={onClick}
    sx={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 32,
      height: 32,
      borderRadius: '8px',
      color: zinc[500],
      transition: 'color 0.15s ease, background-color 0.15s ease',
      '&:hover': {
        color: byMode(zinc[900], zinc[100]),
        bgcolor: byMode('rgba(0, 0, 0, 0.05)', 'rgba(255, 255, 255, 0.05)'),
      },
    }}
  >
    {children}
  </ButtonBase>
);
