import React from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  CircularProgress,
  useTheme,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Add as AddIcon,
  EventRepeat as RescheduleIcon,
  Schedule as ScheduleIcon,
  Flag as FlagIcon,
  CalendarToday as CalendarTodayIcon,
  AccessTime as AccessTimeIcon,
  Checklist as ChecklistIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
} from '@mui/icons-material';

import { useSuggestedActionCard } from './useSuggestedActionCard.hook';
import type { SuggestedActionCardProps } from './suggestedActionCard.types';
import {
  cardSx,
  cardContentSx,
  headerRowSx,
  previewBoxSx,
  previewTitleSx,
  previewDescriptionSx,
  previewMetaRowSx,
  metaChipSx,
  subtasksContainerSx,
  subtasksHeaderSx,
  subtasksCountBadgeSx,
  subtaskItemSx,
  subtaskTitleSx,
  subtaskTimerChipSx,
  errorTextSx,
  actionsRowSx,
  completedRowSx,
  successRowSx,
  successIconSx,
  outlinedActionButtonSx,
  addIconSx,
  primaryActionButtonSx,
} from './suggestedActionCard.styles';

export const SuggestedActionCard: React.FC<SuggestedActionCardProps> = ({
  action,
}) => {
  const theme = useTheme();
  const [, setSearchParams] = useSearchParams();
  const {
    isCompleted,
    createdId,
    errorMessage,
    handleExecute,
    getActionIcon,
    getActionTitle,
    getActionPreview,
    isLoading,
  } = useSuggestedActionCard(action);

  const preview = getActionPreview();
  const accentColor = preview.priorityColor || theme.palette.primary.main;

  return (
    <Card sx={cardSx(theme)}>
      <CardContent sx={cardContentSx}>
        <Box sx={headerRowSx}>
          {getActionIcon()}
          <Typography variant="subtitle2" fontWeight={800} color="text.primary">
            {action.type === 'CREATE_TASK'
              ? 'Evento / Tarea Sugerida'
              : `${getActionTitle()} Sugerencia`}
          </Typography>
        </Box>

        <Box sx={previewBoxSx(theme, accentColor)}>
          {(preview.dateLabel ||
            preview.timeRangeLabel ||
            preview.durationLabel ||
            preview.priorityLabel) && (
            <Box sx={previewMetaRowSx}>
              {preview.dateLabel && (
                <Chip
                  size="small"
                  icon={<CalendarTodayIcon sx={{ fontSize: 13 }} />}
                  label={preview.dateLabel}
                  sx={metaChipSx(accentColor)}
                />
              )}
              {preview.timeRangeLabel && (
                <Chip
                  size="small"
                  icon={<AccessTimeIcon sx={{ fontSize: 13 }} />}
                  label={preview.timeRangeLabel}
                  sx={metaChipSx()}
                />
              )}
              {preview.durationLabel && (
                <Chip
                  size="small"
                  icon={<ScheduleIcon sx={{ fontSize: 13 }} />}
                  label={preview.durationLabel}
                  sx={metaChipSx()}
                />
              )}
              {preview.priorityLabel && (
                <Chip
                  size="small"
                  icon={<FlagIcon sx={{ fontSize: 13 }} />}
                  label={preview.priorityLabel}
                  sx={metaChipSx(preview.priorityColor)}
                />
              )}
            </Box>
          )}

          {preview.title && (
            <Typography
              variant="body2"
              fontWeight={700}
              color="text.primary"
              sx={previewTitleSx}
            >
              {preview.title}
            </Typography>
          )}

          {preview.description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={previewDescriptionSx}
            >
              {preview.description}
            </Typography>
          )}

          {preview.contentPreview && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={previewDescriptionSx}
            >
              {preview.contentPreview}
            </Typography>
          )}

          {preview.subtasks && preview.subtasks.length > 0 && (
            <Box sx={subtasksContainerSx(theme)}>
              <Box sx={subtasksHeaderSx}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <ChecklistIcon
                    sx={{ fontSize: 15, color: 'text.secondary' }}
                  />
                  <Typography
                    variant="caption"
                    fontWeight={700}
                    color="text.secondary"
                  >
                    Subtareas
                  </Typography>
                </Box>
                <Box sx={subtasksCountBadgeSx(theme)}>
                  {preview.subtasks.length}{' '}
                  {preview.subtasks.length === 1 ? 'paso' : 'pasos'}
                </Box>
              </Box>

              {preview.subtasks.map((st, idx) => (
                <Box key={idx} sx={subtaskItemSx(theme)}>
                  <RadioButtonUncheckedIcon
                    sx={{
                      fontSize: 13,
                      color: 'text.secondary',
                      opacity: 0.7,
                      flexShrink: 0,
                    }}
                  />
                  <Typography sx={subtaskTitleSx}>{st.title}</Typography>
                  {st.durationLabel && (
                    <Chip
                      size="small"
                      label={st.durationLabel}
                      sx={subtaskTimerChipSx(theme)}
                    />
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {errorMessage && (
          <Typography
            variant="caption"
            color="error.main"
            display="block"
            sx={errorTextSx}
          >
            {errorMessage}
          </Typography>
        )}

        <Box sx={actionsRowSx}>
          {isCompleted ? (
            <Box sx={completedRowSx}>
              <Box sx={successRowSx}>
                <CheckCircleIcon sx={successIconSx} />
                <Typography variant="caption" fontWeight={700}>
                  {action.type === 'INSERT_TO_WORKSPACE'
                    ? '¡Insertado con éxito!'
                    : action.type === 'CREATE_NOTE'
                      ? '¡Nota creada con éxito!'
                      : action.type === 'UPDATE_TASK'
                        ? '¡Reprogramado con éxito!'
                        : '¡Agregado al calendario!'}
                </Typography>
              </Box>

              {createdId &&
                (action.type === 'CREATE_WORKSPACE' ||
                  action.type === 'CREATE_NOTE') && (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() =>
                      setSearchParams({
                        tab: 'Projects',
                        workspaceId: createdId,
                      })
                    }
                    sx={outlinedActionButtonSx}
                  >
                    Abrir Espacio
                  </Button>
                )}

              {createdId &&
                (action.type === 'CREATE_TASK' ||
                  action.type === 'UPDATE_TASK') && (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setSearchParams((prev) => {
                        const newParams = new URLSearchParams(prev);
                        newParams.set('taskId', createdId);
                        return newParams;
                      });
                    }}
                    sx={outlinedActionButtonSx}
                  >
                    Ver Tarea
                  </Button>
                )}
            </Box>
          ) : (
            <Button
              variant="contained"
              size="small"
              disabled={isLoading}
              onClick={handleExecute}
              startIcon={
                isLoading ? (
                  <CircularProgress size={12} color="inherit" />
                ) : action.type === 'UPDATE_TASK' ? (
                  <RescheduleIcon sx={addIconSx} />
                ) : (
                  <AddIcon sx={addIconSx} />
                )
              }
              sx={primaryActionButtonSx(theme)}
            >
              {isLoading
                ? action.type === 'INSERT_TO_WORKSPACE'
                  ? 'Insertando...'
                  : action.type === 'UPDATE_TASK'
                    ? 'Reprogramando...'
                    : 'Agregando...'
                : action.type === 'INSERT_TO_WORKSPACE'
                  ? 'Insertar en Nota'
                  : action.type === 'UPDATE_TASK'
                    ? 'Reprogramar'
                    : action.type === 'CREATE_TASK'
                      ? 'Agregar al Calendario'
                      : 'Crear'}
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
