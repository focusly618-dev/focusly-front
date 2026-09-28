import React from 'react';
import {
  Box,
  Typography,
  Button,
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
        className="my-3.5 border border-emerald-500/20 bg-white/80 dark:bg-zinc-900/90 shadow-lg dark:shadow-2xl"
      >
        <PlanHeader className="py-3 px-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex items-center justify-center size-8 rounded-xl bg-[#008767]/10 text-[#008767] dark:text-[#10B981] shrink-0">
              <EventNoteIcon sx={{ fontSize: 18 }} />
            </div>
            <div className="min-w-0">
              <PlanTitle className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 truncate">
                {isRescheduleOnly ? 'Cambios sugeridos' : 'Plan sugerido'} ·{' '}
                {actions.length} {planItemLabel}
              </PlanTitle>
              <PlanDescription className="text-xs text-zinc-500 dark:text-zinc-400">
                {isCompleted
                  ? isRescheduleOnly
                    ? 'Horarios actualizados en tu calendario'
                    : 'Elementos agregados a tu espacio'
                  : isCreating
                    ? `Aplicando acciones (${completedCount}/${actions.length})...`
                    : `${actions.length} acciones listas para confirmar`}
              </PlanDescription>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
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
          </div>
        </PlanHeader>

        <PlanContent className="p-3 space-y-2">
          {actions.map((action, idx) => {
            const preview = previews[idx];
            const status = itemStatuses[idx];
            const taskStatus = mapStatusToTaskStatus(status);

            return (
              <Task
                key={idx}
                defaultOpen={false}
                className="border border-black/[0.06] dark:border-white/[0.06] bg-black/[0.015] dark:bg-white/[0.02]"
              >
                <TaskTrigger>
                  <div className="flex items-center justify-between gap-2.5 w-full py-0.5">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <TaskStatus status={taskStatus} />
                      <div className="shrink-0">
                        {getActionTypeIcon(action.type)}
                      </div>
                      <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate">
                        {preview.title || getActionTitle(action)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {preview.dateLabel && (
                        <span className="text-[10.5px] px-2 py-0.5 rounded-full font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/40">
                          {preview.dateLabel}
                        </span>
                      )}
                      {preview.durationLabel && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/60">
                          {preview.durationLabel}
                        </span>
                      )}
                      {preview.priorityLabel && (
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded-md font-semibold text-white"
                          style={{
                            backgroundColor: preview.priorityColor || '#008767',
                          }}
                        >
                          {preview.priorityLabel}
                        </span>
                      )}
                    </div>
                  </div>
                </TaskTrigger>

                <TaskContent>
                  {(preview.description || preview.contentPreview) && (
                    <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                      {preview.description || preview.contentPreview}
                    </p>
                  )}

                  {preview.subtasks && preview.subtasks.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-black/5 dark:border-white/5 space-y-1">
                      <span className="text-[10.5px] font-bold text-zinc-500 uppercase tracking-wider block">
                        Subtareas ({preview.subtasks.length}):
                      </span>
                      {preview.subtasks.map((st, sIdx) => (
                        <div
                          key={sIdx}
                          className="flex items-center justify-between text-xs py-0.5 text-zinc-700 dark:text-zinc-300"
                        >
                          <div className="flex items-center gap-2">
                            <span className="size-1.5 rounded-full bg-[#008767]" />
                            <span>{st.title}</span>
                          </div>
                          {st.durationLabel && (
                            <span className="text-[10px] text-zinc-400">
                              {st.durationLabel}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </TaskContent>
              </Task>
            );
          })}

          {errorMessage && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs">
              <ErrorOutlineIcon sx={{ fontSize: 16 }} />
              <span>{errorMessage}</span>
            </div>
          )}
        </PlanContent>

        <PlanFooter className="flex items-center justify-between py-2 px-4 bg-zinc-50/60 dark:bg-zinc-900/40">
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
            {isCompleted
              ? 'Todas las acciones se han ejecutado correctamente'
              : `${actions.length - completedCount} pendientes de ejecutar`}
          </span>

          <div className="flex items-center gap-2">
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
          </div>
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
  <button
    type="button"
    title={title}
    onClick={onClick}
    className="inline-flex items-center justify-center size-8 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
  >
    {children}
  </button>
);
