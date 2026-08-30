import React from 'react';
import {
  Card,
  CardContent,
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
} from '@mui/icons-material';
import { cardSx } from '../suggestedActionCard/suggestedActionCard.styles';
import {
  getActionPreviewData,
  getActionTitle,
} from '../suggestedActionCard/actionExecution.utils';
import { useSuggestedActionsPlan } from './useSuggestedActionsPlan.hook';
import type { SuggestedActionsPlanProps } from './SuggestedActionsPlan.types';
import {
  summaryCardContentSx,
  summaryTextRowSx,
  previewButtonSx,
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
  // A batch made entirely of moves ("compress my week", "add a break
  // between these") reads very differently from a batch of brand-new
  // items — labeling it "Create 5 tasks" would repeat the exact
  // create-vs-edit confusion this action type exists to fix.
  const isRescheduleOnly =
    actions.length > 0 && actions.every((a) => a.type === 'UPDATE_TASK');

  return (
    <>
      <Card sx={cardSx(theme)}>
        <CardContent sx={summaryCardContentSx}>
          <Box sx={summaryTextRowSx}>
            <EventNoteIcon
              sx={{ fontSize: 20, color: theme.palette.primary.main }}
            />
            <Box minWidth={0}>
              <Typography
                variant="subtitle2"
                fontWeight={800}
                color="text.primary"
              >
                {isRescheduleOnly ? 'Cambios sugeridos' : 'Plan sugerido'} ·{' '}
                {actions.length} tareas
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {isCompleted
                  ? isRescheduleOnly
                    ? 'Ya movidas en tu calendario'
                    : 'Ya agregado a tu calendario'
                  : isRescheduleOnly
                    ? 'Revisa los nuevos horarios antes de aplicarlos'
                    : 'Revisa las fechas antes de agregarlas'}
              </Typography>
            </Box>
          </Box>

          {isCompleted ? (
            <Chip
              size="small"
              icon={<CheckCircleIcon sx={{ fontSize: 14 }} />}
              label="Creadas"
              color="success"
              variant="outlined"
            />
          ) : (
            <Button
              variant="outlined"
              size="small"
              onClick={() => setOpen(true)}
              sx={previewButtonSx}
            >
              Preview
            </Button>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{ sx: dialogPaperSx }}
      >
        <Box sx={dialogHeaderSx}>
          <Typography variant="subtitle1" fontWeight={800} color="text.primary">
            {isRescheduleOnly ? 'Cambios sugeridos' : 'Plan sugerido'} ·{' '}
            {actions.length} tareas
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
                  <Typography
                    sx={planRowDescriptionSx}
                    color="text.secondary"
                  >
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
                  ? `Mover las ${actions.length} tareas`
                  : `Crear las ${actions.length} tareas`}
          </Button>
        </Box>
      </Dialog>
    </>
  );
};
